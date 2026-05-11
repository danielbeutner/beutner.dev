---
title: Fall in love with Zustand
description: A field guide to what the docs don't tell you
pubDate: 2026-05-11
---

## Part 1 - The Honeymoon Phase

> Redux gives you a filing cabinet. Context gives you a backpack. Zustand gives you a sticky note — and somehow that's much better.

The first time you use Zustand, you'll spend a few minutes staring at the code wondering what the catch is. There is no Provider wrapping your tree. No dispatch. No action creators, no selectors, no 400-line boilerplate that you copy-paste from a template and half-understand.

Create a store:

```ts
// store/index.ts
const useStore = create<State>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
}));
```

Add it to your component:

```ts
const bears = useStore((state) => state.bears);
```

That's it. That's the whole thing. No `connect()`, no HOCs, no 17 files to open just to follow a data update. You use a hook. It re-renders when the selected slice changes. It doesn't re-render when other parts of the store change. **It just works.**

Then, about three weeks into a real production application, things get interesting.

You have server-rendered pages like in Next.js that need to pre-populate state. You have persistence requirements, but only for _some_ things. Your store has grown from "a few properties" to "a sprawling continent with its own political history" and the Zustand docs, excellent as they are, politely wave goodbye at the door.

This is everything on the other side of that door.

## Part 2 - Structure Before Code

> A store you can't navigate is a store you can't maintain. Start with the directory before you write a single line of state.

The architecture below separates concerns cleanly: one directory per store, one file per slice, one types file per slice. Boring? Yes. A gift to future-you at 11pm debugging a production issue? Absolutely.

```
utils/
└── zustand.ts          // SliceSet, SliceGet, createSliceHelpers, createSliceMerge

store/
├── root-store/
│   ├── index.ts        // createStore()
│   ├── cart-slice.ts
│   └── notifications-slice.ts
└── some-other-store/
    ├── index.ts
    └── some-other-slice.ts

providers/
├── root-store-provider.tsx
└── some-other-store-provider.tsx
```

Two stores. The root store handles global UI state — cart, notifications, modals — and lives for the lifetime of the app. The some-other store is page-scoped: it gets mounted when you navigate to the some-other page and torn down when you leave. No stale state bleeds across routes.

## Part 3 - The Slice Pattern (Done Right)

> Zustand has a "built-in" slice pattern. It works, right until you add persistence. Then it quietly destroys your afternoon.

The documented approach composes multiple `create`-style functions into one store. It's fine for basic use. But when you layer on `persist` middleware, the default shallow merge doesn't know about your slices — it merges the entire store object at once. You lose the ability to inject per-slice server-side initial state. Things get messy fast.

The fix is a tiny custom utility: `createSliceHelpers`. It takes the root `set` and `get`, and returns a `slice()` function that automatically scopes both to a given subtree.

```ts
// `InitialState<T>` uses `StateOnly` to build a type for server-provided initial state — partial, because the server might only hydrate some slices:
export type InitialState<T> = {
  [K in keyof T]?: Partial<StateOnly<T[K]>>;
};
//`SliceSet<S[K]>` and `SliceGet<S[K]>` are the types for the scoped `set` and `get` that each slice factory receives. Because `createSliceHelpers` scopes them, typescript can enforce that a cart slice only mutates cart state:
export type SliceSet<T> = (updater: (state: T) => void) => void;
export type SliceGet<T> = () => T;

export function createSliceHelpers<S extends object>(
  rootSet: SliceSet<S>,
  rootGet: SliceGet<S>,
  initState?: InitialState<S>,
) {
  return <K extends keyof S>(
    key: K,
    creator: (set: SliceSet<S[K]>, get: SliceGet<S[K]>) => S[K],
  ): S[K] => {
    const scopedSet: SliceSet<S[K]> = (fn) =>
      rootSet((root) => fn(root[key] as S[K]));
    const scopedGet: SliceGet<S[K]> = () => rootGet()[key];

    return { ...creator(scopedSet, scopedGet), ...initState?.[key] };
  };
}
```

The key detail: that last line spreads `initState?.[key` on top. This is how server-provided initial state flows into individual slices without any global-store ceremony. Pass in your server data, it lands exactly where it belongs.

Assembling the store becomes a readable declaration:

```ts
export function createStore(initState?: InitState) {
  return createZustandStore<Store>()(
    persist(
      immer((set, get) => {
        const slice = createSliceHelpers<Store>(set, get, initState);

        return {
          cart: slice('cart', createCartSlice),
          notifications: slice('notifications', createNotificationsSlice),
          overlay: slice('overlay', createOverlaySlice),
        };
      }),
      persistOptions,
    ),
  );
}
```

Each slice factory receives pre-scoped `set` and `get` that point only into its subtree. The cart slice genuinely cannot touch notifications state — the types enforce it at compile time. A typo like `state.notificatoins` inside a cart setter is a build error, not a runtime mystery.

## Part 4 - The Middleware Sandwich

Two middleware, one rule: the order is not a preference. It is a law. Violate it and Immer and Persist will fight each other in your production bundle at 2am.

The stack is `persist` on the outside, `immer` on the inside:

```
persist        →  intercepts setState to snapshot localStorage
  immer        →  wraps set so mutations produce immutable state
    your store →  the good stuff
```

**Why this order?** The `set` and `get` your slices receive come from Immer — they already understand draft mutations. Persist wraps from the outside and intercepts `setState` to save snapshots to localStorage. If you invert the order, Immer wraps Persist's already-modified `set`, the layers step on each other, and you end up with state updates that sometimes persist and sometimes don't, depending on the phase of the moon.

The payoff of Immer is dramatic for nested state. Consider adding an item to a cart:

```ts
// ❌ without immer
set((state) => ({
  ...state,
  cart: {
    ...state.cart,
    items: [...state.cart.items, newItem],
  },
}));
```

```ts
// ✅ with immer
set((state) => {
  state.items.push(newItem);
});
```

One of these is legible to a new team member. One looks like a particularly anxious JavaScript interview answer. Immer costs you nothing and gives you the second form everywhere.

## Part 5 - The Function Murder Bug

This one will get you if you don't know about it. It will get you silently, in production, in a way that's extremely hard to reproduce in tests.

When `persist` restores state from localStorage on page load, it calls a merge function to combine the stored snapshot with the freshly-initialized store. The default merge is a shallow `Object.assign`:

```ts
// What persist does internally by default:
Object.assign(currentStore, persistedSnapshot);
```

Your current store's `cart` slice looks like this:

```ts
cart: {
  items: [],
  isOpen: false,
  addItem: fn,     // 👈 your actions, living here
  removeItem: fn,
  setIsOpen: fn,
}
```

Your persisted snapshot (from localStorage) looks like this:

```ts
cart: {
  items: [{ id: 'abc', name: 'Cool Widget', ... }]
  // no functions — they don't serialize to JSON
}
```

> **The bug:** The shallow merge replaces the entire `cart` object with the persisted snapshot. Your `addItem`, `removeItem`, and `setIsOpen` functions are gone. Calling `cart.addItem()` is now `undefined()`. Your cart is a beautiful, inert data museum.

The reason this is hard to catch in tests is that most test setups never exercise the rehydration path. The store initializes fresh for every test, so the functions are always there. You only see the bug when a real user loads the page with data already in their localStorage.

The fix is a custom merge that deep-merges each slice individually, with a preference for functions from the _current_ (freshly initialized) store:

```ts
// utils/zustand.ts
export function createSliceMerge<S extends object>() {
  return (persisted: unknown, current: S): S => {
    const p = (persisted ?? {}) as Partial<S>;
    const result = { ...current };

    for (const key in current) {
      if (!(key in p)) continue;
      const sliceCurrent = current[key];
      const slicePersisted = p[key];

      // Deep merge: data from persisted, functions from current
      result[key] = Object.fromEntries(
        Object.entries(sliceCurrent).map(([k, v]) => [
          k,
          typeof v === 'function'
            ? v // always keep current fn
            : (slicePersisted?.[k] ?? v), // prefer persisted data
        ]),
      );
    }
    return result;
  };
}
```

> **The rule:** Functions always come from the freshly-initialized store. Data always comes from localStorage. No functions get murdered. Everyone goes home happy.

## Part 6 - SSR Hydration Without the Headaches

A global singleton store and server-side rendering are natural enemies. A Context-based provider is the peace treaty.

The core problem: Zustand's `create()` produces a module-level singleton. In a server environment with many concurrent requests, that singleton is shared across all of them. Request A's user data bleeds into Request B. This is not a bug you want to discover from a customer's "I can see someone else's cart" support ticket.

The solution is to never use a module-level store singleton at all. Instead, create the store inside a React Context provider, using `useRef` to prevent recreation on re-renders:

```tsx
// root-store-provider.tsx
export function RootStoreProvider({ children, initState }: Props) {
  const [store] = useState<StoreApi>(() => createStore(initialState));

  return (
    <RootStoreContext.Provider value={store}>
      {children}
    </RootStoreContext.Provider>
  );
}

export const useRootStore = <T,>(selector: (state: Store) => T): T => {
  const store = useContext(RootStoreContext);
  return useStore(store, selector);
};
```

The `initState` prop is the SSR bridge. Your server (what ever this may be at your side) fetches what it needs, passes it to the provider, and `createStore(initState)` spreads it into the right slices before the first render. The client gets pre-populated state with no flicker and no hydration mismatch.

Page-scoped stores get their own providers. Mount them in the page-level component, pass page-specific server data through them, and they're isolated from — and invisible to — the rest of the app.

## Part 7 - Async Actions & the Race You Don't Know You're In

Redux needed middleware (Thunk, Saga, Observable) just to allow async side effects. In Zustand, you just write `async`. This is delightful — until two actions are racing to update the same state and the slower one wins.

```ts
async fetchResults(query) {
  set(state => { state.isLoading = true })
  const data = await fetch(`/api/search?q=${query}`).then(r => r.json())
  set(state => { state.results = data.results; state.isLoading = false })
}
```

This works perfectly when users type slowly and requests complete instantly. In any other situation — say, a real user on a real network — you have a race condition. The user types "cha", "chai", "chair". Three requests fire. They complete out of order. The results for "cha" arrive last and overwrite the results for "chair".

The classic fix is a closure-based request counter. It lives in the slice closure — not in state, not in a ref — and it costs you nothing:

```ts
export function createSearchSlice(set, _get) {
  let currentRequestId = 0; // lives in the closure, not in state

  return {
    query: '',
    results: [],
    isLoading: false,

    async fetchResults(query) {
      const requestId = ++currentRequestId; // capture THIS call's id

      set((state) => {
        state.isLoading = true;
      });

      const data = await fetch(`/api/search?q=${query}`).then((r) => r.json());

      if (requestId !== currentRequestId) return; // stale — discard

      set((state) => {
        state.results = data.results;
        state.isLoading = false;
      });
    },
  };
}
```

Each call to `fetchResults` increments `currentRequestId` and captures its snapshot in `requestId`. Before committing any state, the response checks whether it's still the latest. If a newer request has since started, this one returns silently.

## Part 8 - Testing, All the Way Down

The architecture pays testing dividends. Stores are plain functions. Slices are isolated. Utilities are pure. Everything has a seam.

The store itself needs no React to test. `createStore()` returns a plain store API:

```ts
// root-store/index.unit.ts
test('adds an item to the cart', () => {
  const store = createStore();
  const item = { id: '1', name: 'Widget', price: 9.99 };

  store.getState().cart.addItem(item);

  expect(store.getState().cart.items).toEqual([item]);
});

test('does not persist overlay state', () => {
  const store = createStore();
  const { partialize } = store.persist.getOptions();

  const persisted = partialize!(store.getState());

  expect(persisted).not.toHaveProperty('overlay');
});
```

The merge utility is pure and needs no store context at all. You can test it with plain objects:

```ts
// utils/zustand.unit.ts
test('preserves action functions during merge', () => {
  const merge = createSliceMerge<{
    cart: { items: unknown[]; addItem: () => void };
  }>();
  const addItem = jest.fn();

  const result = merge(
    { cart: { items: [{ id: '1' }] } }, // persisted
    { cart: { items: [], addItem } }, // current
  );

  expect(result.cart.addItem).toBe(addItem); // ✓ function survived
  expect(result.cart.items).toEqual([{ id: '1' }]); // ✓ data restored
});
```

This is what you want from a state architecture: the ability to test the scary parts without spinning up a full browser and hoping localStorage cooperates.

## When to Reach for It

All this machinery is genuinely useful. It is also genuinely heavy. Don't use it because it's impressive — use it because your problem actually needs it.

Zustand earns its keep when you have **complex UI state that spans the component tree**: a cart that's read from ten components and written from four, a notification stack that anything can push to, overlays that need to be controlled globally. These are cases where classic React Context hurts you — every context update re-renders every consumer, even the ones that only care about a field you didn't change.

Zustand's selector model is the fix. Components subscribe to exactly the state they need, and nothing else triggers a re-render. For a store with a large slice count and many active subscribers, this matters.

But for simpler situations, simpler tools win:

**URL state.** If the state should be shareable — search queries, active filters, pagination, tab selection — put it in the URL with [nuqs](https://nuqs.47ng.com). Zustand and nuqs compose naturally: let Zustand own transient UI state, let nuqs own public URL-reflected state. Keep them decoupled and let each do its job.

> The right state management tool is the one that makes the wrong thing impossible — not the one with the most features.

If your application is genuinely simple, `useState` and a single small context will serve you better than this entire post. Start there. Come back here when you feel the friction. And when you do come back — when your store is growing, your team is scaling, and you're finding bugs that only reproduce after a page reload — you'll have a blueprint.

### Summary

| #   | Rule                                                                                         |
| --- | -------------------------------------------------------------------------------------------- |
| 01  | **Slice pattern** — use `createSliceHelpers` for scoped set/get and SSR-friendly init state  |
| 02  | **Middleware order** — `persist → immer → store`, always                                     |
| 03  | **Custom merge** — write `createSliceMerge` or your functions die on reload                  |
| 04  | **Context provider** — never a module singleton; always scoped to a React tree               |
| 05  | **Async race conditions** — closure-based request counter costs nothing and saves everything |
| 06  | **URL state** — belongs in `nuqs`, not Zustand                                               |

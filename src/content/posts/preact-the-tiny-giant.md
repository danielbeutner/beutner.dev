---
title: Preact - the tiny giant your bundle never saw coming
description: Or how I learned to stop worrying and love 3KB
pubDate: 2026-05-02
---

There's a certain type of developer who, upon learning that React weighs in at around **45KB minified and gzipped**, shrugs and moves on. They've got deadlines, their connection is fast, and honestly the app already imports three carousel libraries from 2019 - what's another 45KB?

Then there's the _other_ type.

The type who opens the Network tab, watches their `vendor.js` bundle crawl across the waterfall like a wounded animal, and quietly begins to question every decision that led them here.

If you're the second type - welcome. Pull up a chair. Let's talk about **Preact**.

## What even is Preact?

Preact is, in the project's own words, _"Fast 3KB alternative to React with the same modern API."_

Three. Kilobytes.

That's smaller than most JPEG thumbnails. Smaller than some favicons. At that size, your framework is basically a Post-it note that somehow renders virtual DOM trees. It's the software equivalent of a Swiss Army knife whittled out of a toothpick.

Created by [Jason Miller](https://github.com/developit) and first released in 2015, Preact set out to answer a question nobody was officially asking but everyone secretly wanted answered: _"Does React really need to be this big?"_

Spoiler: No. It does not.

## The "Compat" move that changed everything

Here's where Preact's story gets genuinely clever.

Rather than forking the ecosystem and asking the world to rewrite their components, Preact ships a thin compatibility layer called **`preact/compat`**. Add a couple of aliases to your bundler config:

```js
// vite.config.js
resolve: {
  alias: {
    'react': 'preact/compat',
    'react-dom': 'preact/compat',
  }
}
```

And _that's it._ Your existing React components - including third-party ones from npm - just... work. You didn't rewrite anything. You didn't migrate anything. You told your bundler a small, polite lie and saved yourself 40KB.

It's the kind of move that makes you feel slightly guilty, like you found a cheat code in real life.

## What Preact actually gives up

At this point you're probably narrowing your eyes. _"What's the catch?"_

Fair. Here's what Preact trims to achieve its size:

- **Synthetic events** - Preact uses native browser events. In practice: you'll rarely notice.
- **`PropTypes` runtime checking** - Strip them in prod anyway, right? Right??
- **Some legacy React APIs** - If you're still using `createClass` or `React.Children.map` in novel ways, you might hit edge cases.
- **Concurrent Mode features** - Transitions, `useDeferredValue`, the whole React 18 concurrency model - not here. Preact has its own Signals system instead (more on that shortly).

For the vast majority of applications - dashboards, marketing sites, SPAs, widgets embedded in legacy apps - none of these omissions matter even slightly. The 1% of cases where they do matter are usually complex enough that you'd be evaluating your framework choice anyway.

## Signals: Preact's plot twist

Just when you thought Preact was content being "small React," it did something unexpected: it shipped **[Signals](https://preactjs.com/guide/v10/signals/)** - a reactive primitives system that makes `useState` look like it's working through paperwork.

```js
import { signal, computed } from '@preact/signals';

const count = signal(0);
const doubled = computed(() => count.value * 2);

function Counter() {
  return (
    <button onClick={() => count.value++}>
      {count} × 2 = {doubled}
    </button>
  );
}
```

No dependency arrays. No stale closures. No "why is my effect running six times" debugging sessions at 11pm. A signal changes, the _exact_ DOM node that reads it updates - and nothing else. The component doesn't even re-render.

React looked at this and eventually shipped a whole RFC process about it. Preact just... shipped it.

## Real-world numbers that will make you feel things

Let's get concrete. Here's a rough comparison of what a minimal "Hello World" app looks like across frameworks, production-built:

| Framework           | JS Transferred (approx.) |
| ------------------- | ------------------------ |
| React + ReactDOM    | ~45 KB                   |
| Vue 3               | ~22 KB                   |
| **Preact**          | **~4 KB**                |
| Svelte (no runtime) | ~1–3 KB                  |

Now imagine you're building a widget that gets embedded on a thousand third-party websites. Or a performance-critical e-commerce page where every millisecond of TTI costs money. Or a PWA for users on 3G connections in markets you actually want to reach.

That 40KB gap stops being abstract very quickly.

## Who is Preact actually for?

Let's be real about the use cases where Preact absolutely _shines_:

**E-commerce & landing pages** - Core Web Vitals are tied to conversion rates. Bundle size is tied to Core Web Vitals. The chain is short and expensive.

**Embeddable widgets** - Shipping a chat widget, a booking flow, or a custom element that third parties drop into their sites? You are not allowed to drag React into their bundle. Preact is the polite choice.

**Mobile web apps** - Low-end Android on a congested network is a humbling test environment. Preact passes it more gracefully.

**Incremental React migration** - Existing React codebase you can't fully rewrite? Drop in Preact/compat, win back performance budget, spend it on something useful like lazy loading your enormous chart library.

**Learning projects** - Small enough to read the entire source code in an afternoon. More educational than you'd expect.

## The one thing react still wins on

Community. Ecosystem. Mindshare.

React's npm numbers are staggering. Its StackOverflow coverage is encyclopedic. Its hiring pool is enormous. When you hit an obscure edge case at 2am, there are seventeen identical GitHub issues with answers.

Preact is well-maintained and the community is solid, but it's smaller. Some libraries have React-specific internals that `preact/compat` doesn't fully smooth over. Occasionally you'll hit a gap and spend thirty minutes in the Preact Discord instead of finding an instant answer.

That's the honest tradeoff. It's a real one. For teams of any size shipping production software, ecosystem depth matters.

BUT! In times of coding agents and AI-assisted development, the ecosystem gap is shrinking. If your codebase is mostly vanilla React APIs, an LLM can help you fill in the blanks when you hit a Preact-specific edge case. The "community support" argument is less of a moat than it used to be.

---

## The bottom line

Preact isn't trying to replace React. It's not a manifesto. It's not a movement. It's a well-engineered piece of software that asks a simple, ruthlessly practical question every time you reach for a framework:

> _Do you actually need all of that?_

Sometimes the answer is yes. React's concurrent features, its massive ecosystem, its ecosystem tooling - for complex, long-lived applications built by large teams, the weight is justified, is it?

Sometimes it is all about simplicity and efficiency. Preact is not a compromise. It's the _correct choice_ - and a quietly, stubbornly excellent piece of work which can run your next project.

It's small, it's fast, and it just might be the tiny giant your bundle never saw coming.

_Now go check your bundle size. I'll wait._

## Something's in the wood

Preact's team is currently working on version 11 (beta 1 at the time of writing), which adds some necessary features and optimisations to keep up with infamous sibling. I am really curious to see how the new version will perform in real world applications, and if it will be able to maintain its philosophy.

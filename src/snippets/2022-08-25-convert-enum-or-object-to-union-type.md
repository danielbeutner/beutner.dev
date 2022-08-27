---
title: Convert an Enum or an object to an Union type
---

This is a TypeScript goodie! I use it quite often for states.

## Enum to Union type

If you want to convert an Enum like

```typescript
enum State {
  SUCCESS = 'success',
  ERROR = 'error',
  PENDING = 'pending',
}
```

to an Union type you can use [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) to do that.

```typescript
// Result: type Status = 'success' | 'error' | 'pending';
type Status = `${State}`;
```

## Object to Union type

if you want to use an object instead you can use `as const` to fixate the values like

```typescript
/* 
  const State: {
    SUCCESS: string;
    ERROR: string;
    PENDING: string;
  } 
*/

const State = {
  SUCCESS: 'success',
  ERROR: 'error',
  PENDING: 'pending',
};
```

to convert the value of the objects from `string` to a literal value ('success', 'error' and 'pending') you can use [const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) and add `as const` behind the object.

```typescript
/* 
  const State: {
    readonly SUCCESS: "success";
    readonly ERROR: "error";
    readonly PENDING: "pending";
  }
*/

const State = {
  SUCCESS: 'success',
  ERROR: 'error',
  PENDING: 'pending',
} as const;
```

Then convert this to an Union type with `typeof State` to convert the object to an type and the get the keys of this type with `keyof typeof State`

```typescript
/* 
  typeof State = type StateObject = {
    readonly SUCCESS: "success";
    readonly ERROR: "error";
    readonly PENDING: "pending";
  }

  keyof typeof State = "SUCCESS" | "ERROR" | "PENDING"
*/

// Result: type Status = 'success' | 'error' | 'pending';
type Status = typeof State[keyof typeof State];
```

And by the way: You can also fixate the values with `Object.freeze`. TypeScript wraps the object with the Generic `Readonly` which is the the same as prefixing the entries with `readonly`.

```typescript
/* 
  typeof State = const States: Readonly<{
    SUCCESS: "success";
    ERROR: "error";
    PENDING: "pending";
  }>
*/
const State = Object.freeze({
  SUCCESS: 'success',
  ERROR: 'error',
  PENDING: 'pending',
});

// Result: type Status = 'success' | 'error' | 'pending';
type Status = typeof State[keyof typeof State];
```

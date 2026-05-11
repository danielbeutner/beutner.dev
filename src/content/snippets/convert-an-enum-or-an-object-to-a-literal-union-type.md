---
title: Convert an Enum or an object to a literal union type
pubDate: 2022-08-25
---

This is a TypeScript goodie! I use it quite often for states.

## Enum to Union type

If you want to convert an enum like

```typescript
enum State {
  SUCCESS = 'success',
  ERROR = 'error',
  PENDING = 'pending',
}
```

to an union of string literal types you can use [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) to do that.

```typescript
// Result: type Status = 'success' | 'error' | 'pending';
type Status = `${State}`;
```

## Object to Union type

A normal object has initially just strings as value.

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

If you want to use an object to fixate the values you can convert the values of the object from `string` to a literal type ('success', 'error' and 'pending') by using [const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions). Add `as const` behind the object.

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

Then you can convert the values to an union of string literal types with `typeof State` and using `keyof typeof State` as a key.

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

---
title: Another FizzBuzz version
date: '2019-07-21T12:00:00.000Z'
description: "Another FizzBuzz version and you won't like it …"
cover: ./fizzbuzz.jpg
---

This is my version of the infamous FizzBuzz interview test.

```javascript
const range = new Array(100).fill(0);
const f = 'Fizz';
const b = 'Buzz';

function isMod(mod) {
  return (number) => number % mod === 0;
}

const fizzBuzz = range.map((value, i) => {
  const count = i + 1;

  if (isMod(15)(count)) return f + b;

  if (isMod(3)(count)) return f;

  if (isMod(5)(count)) return b;

  return count;
});
```

[Edit on codesandbox](https://codesandbox.io/s/morning-shadow-wdvxs?fontsize=14)

What do you think? Tweet me!

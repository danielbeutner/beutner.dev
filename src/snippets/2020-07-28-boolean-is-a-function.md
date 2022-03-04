---
title: Boolean is a function
---

Since `Boolean` is a function you can write this:

```javascript
[].filter(Boolean);
```

This is a equal to:

```javascript
function myBooleanFilter(value) {
  return Boolean(value);
}

[].filter(myBooleanFilter);
```

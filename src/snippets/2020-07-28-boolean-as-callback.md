---
title: Boolean object as a callback for Array.prototype.filter
---

The `Boolean` object can be used as a callback function in `Array.prototype.filter` for example to filter out falsy values:

```javascript
[].filter(Boolean);
```

In the above example, the `Boolean` object is called with the value of the array element as the first argument. The return value of the `Boolean` object is used to determine whether the element should be included in the result.

The next snippet describes the equivalent code using a function declaration:

```javascript
function myBooleanFilter(value) {
  return Boolean(value);
}

[].filter(myBooleanFilter);
```

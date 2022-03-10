---
title: Publish a beta to npm
---

If you need a beta package to test your package, there is a manual way to do it.

First you can bump the version to the next major version for example with:

```
npm version 1.0.0-beta0
```

If you are using git this will commit and tag the changes.

After that you can publish your package with the flag `--tag beta`, which will publich your package with `@beta` instead of `@latest`.

```
npm publish --tag beta
```

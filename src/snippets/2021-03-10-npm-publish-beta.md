---
title: Publish a beta to npm
---

If you need to test your package or occasionally need a _beta_ or _next_ version.

First you can bump the version to the next major version for example with:

```
npm version 1.0.0-beta.0
```

If you are using git this will commit the changes and tag the commit in this case with `1.0.0-beta.0`.

After that you can publish your package with the flag `--tag beta`, which will upload your package with the tag `@beta` instead of `@latest`.

```
npm publish --tag beta
```

The tag can be pretty much everything and will not affect the stable versions. This means, you need to install this tagged version explicity with `npm install my-package@1.0.0-beta.0` or `npm install my-package@beta`. The latter will install the latest version in your `beta` "branch".

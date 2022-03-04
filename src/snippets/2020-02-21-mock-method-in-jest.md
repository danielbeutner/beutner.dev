---
title: Mock only a certain method in Jest
---

You can mock only the used methods of a dependency with `jest.mock` and `jest.requireActual`:

```javascript
import { method } from 'some-module';

jest.mock('some-module', () => {
  const original = jest.requireActual('some-module');

  return {
    ...original,
    // Overriding the method with a mocked function
    method: jest.fn().mockImplementation(() => null),
  };
});
```

Since `method` is now a mocked function you can investigate the calls.

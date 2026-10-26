# Lane Q2 receipt front-matter lint

```receipt
build: n/a
route: fixture(receipt-lint-test)
state: built
viewport: n/a (script and fixture test)
persistence: unchanged
tests: node --test tests/check_receipts.test.js
review: diff-scoped
surface: scripts/check_receipts.mjs and fixture test
```

Added a dated receipt front-matter linter and registered it with `check:rules`.
Validation and gate results are recorded in the commit and lane response.

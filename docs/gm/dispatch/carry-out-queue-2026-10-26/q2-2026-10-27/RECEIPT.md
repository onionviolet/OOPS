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


## Current contract reconciliation, 2026-11-04

Read the original Q2 brief, final message, this receipt and current check_receipts.mjs completely. The original folder-date selection has evolved: a fixed explicit legacy-path inventory controls grandfathering, legacy files with a receipt block are checked, and --files bypasses grandfathering. Non-gameplay route n/a is allowed; browser-verified/director-accepted need an actual build hash and natural or named fixture route. The current check:rules run separately reports 24 checked/317 explicit legacy skips; those are structural coverage, not every historical report or runtime behavior (AD32, AD36).

The checker validates field shape, required values and duplicate keys, not whether a build hash exists in an artifact store, a test really passed, a natural route was earned or gameplay survived import. Keep its script/fixture state built and build n/a distinct from browser proof. The branch commit and old worktree links retain provenance without requiring restoration of a retired checkout, rerunning its full suite or adopting any gameplay.

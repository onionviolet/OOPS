Saved the [audit](docs/research/CODEBASE_STRUCTURE_AND_BUNDLE_AUDIT_2026-10-14.md) and [ER2 report](docs/gm/dispatch/engine-runtime-2026-10-14/ER2/REPORT.md), including split plans and reproducible evidence.

- **ER2-F1:** Scratch bundle: 5,100,788 bytes; `main.js` contributes 4.07%.
- **ER2-F3:** Four cyclic groups complicate extraction and lazy loading.
- **ER2-F6:** The NetHack preview is actively referenced.

`npm test` passed 628 tests in 171.54 seconds. The separate timing run passed 634 tests and captured 98 file timings; the sample difference is documented.

Gameplay files and `dist/` were untouched. Actual lazy-loading savings and startup speed remain unmeasured.
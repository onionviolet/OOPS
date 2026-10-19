---
paths:
  - "src/**/*.js"
  - "build.js"
  - "tests/**"
  - "docs/ARCHITECTURE_RULES.md"
---

Runtime code follows [architecture rules](docs/ARCHITECTURE_RULES.md) AR1–AR16
(2026-10-16): `main.js` is a composition root, so a feature adds at most one
registration line there, paid for by moving a line out (net zero; a
baseline reset with a named reason only when paying needs an unrelated
refactor, 2026-10-19), and lands through the domain registry; one authority
per fact; no new import cycles or imports of `main.js`; namespaced save slices
with migrations; structural moves separate from behavior changes; integration
means a player journey crosses the module. Runtime lane briefs name their seam
and link that file.

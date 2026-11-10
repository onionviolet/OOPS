---
paths:
  - "src/reputation*.js"
  - "src/*_standing*.js"
  - "src/faction_rank.js"
  - "src/heat.js"
  - "src/authority*.js"
  - "src/law_case.js"
  - "src/jurisdiction_rules.js"
  - "src/positions*.js"
  - "src/organizations*.js"
  - "src/institution_*.js"
  - "src/recurring_duties.js"
  - "src/duties_domain.js"
  - "src/gatherings.js"
  - "docs/STANDING_RULES.md"
---

Code here follows [standing rules](docs/STANDING_RULES.md) STN1–STN22 (reputation, groups, posts and ranks, duties, authority, law, heat): working defaults under AD56, adjustable; lines in the [limiting lines review](docs/audits/LIMITING_LINES_REVIEW_2026-11-10.md) stay proposals. Standing is read through `reputationView`, each source keeps its writer; rank lives on the post; obligations need claim, knowledge and reach (`authorityOver`); heat is per authority from known acts; law is decided without dice. Cite the codes you apply in the task record or commit message; `node scripts/rule_routes.mjs --for <path>` lists them.

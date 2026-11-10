---
paths:
  - "src/craft_sources.js"
  - "src/livelihood*.js"
  - "src/habitat_care*.js"
  - "src/living_upkeep.js"
  - "src/activities.js"
  - "src/hired_hands*.js"
  - "src/field_works_*.js"
  - "src/management/shipping_farming.js"
  - "src/gathering_*.js"
  - "src/village_career*.js"
  - "docs/LIVELIHOOD_RULES.md"
---

Code here follows [livelihood rules](docs/LIVELIHOOD_RULES.md) LVR1–LVR25 (farming, herds, fishing, foraging, hunting, mining, jobs): working defaults under AD56, adjustable; lines in the [limiting lines review](docs/audits/LIMITING_LINES_REVIEW_2026-11-10.md) stay proposals. Extend `craft_sources.js` before a new farming, fishing or ranching module; read through `livelihoods.js`; diets through `living_upkeep.js`; do not copy `habitat_care.js`; time away is projected lazily. Cite the codes you apply in the task record or commit message; `node scripts/rule_routes.mjs --for <path>` lists them.

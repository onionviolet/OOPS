---
paths:
  - "src/person_*.js"
  - "src/companion_*.js"
  - "src/relationship_*.js"
  - "src/recurring_people.js"
  - "src/people_*.js"
  - "src/crowd_memory.js"
  - "src/rival_memory.js"
  - "src/book_world_lotm_colleagues.js"
  - "src/world_packs/book_hp_lead_life_data.js"
  - "docs/RELATIONSHIP_RULES.md"
---

Code here follows [relationship rules](docs/RELATIONSHIP_RULES.md) TIE1–TIE25 (ties, regard, memories of people, companions, kin, rivals, romance): working defaults under AD56, adjustable; lines in the [limiting lines review](docs/audits/LIMITING_LINES_REVIEW_2026-11-10.md) stay proposals. One edge store (`simulation.relationships`, written through `tieEffects`); every tie needs a reader that changes behaviour; say which regard a gate reads (`tieValue` or `derivedBond`). Debts belong to the Owed ledger; standing is not stored on the edge. Cite the codes you apply in the task record or commit message; `node scripts/rule_routes.mjs --for <path>` lists them.

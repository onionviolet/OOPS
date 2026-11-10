---
paths:
  - "src/person_temperament.js"
  - "src/harm_state.js"
  - "src/book_world_lotm_causes.js"
  - "src/book_world_lotm_harm.js"
  - "src/condition_ladders.js"
  - "src/social_contest.js"
  - "docs/MIND_RULES.md"
---

Code here follows [mind rules](docs/MIND_RULES.md) MND1–MND20 (traits, mood, strain, loss of control, mind powers, identity): working defaults under AD56, adjustable; lines in the [limiting lines review](docs/audits/LIMITING_LINES_REVIEW_2026-11-10.md) stay proposals. Read traits through `createTemperamentPort`; derive mood, do not store it; no generic sanity meter; one strain accumulator with at least two exits; the player's traits never pick the player's actions. Cite the codes you apply in the task record or commit message; `node scripts/rule_routes.mjs --for <path>` lists them.

---
paths:
  - "src/knowledge_*.js"
  - "src/observer_view.js"
  - "src/people_knowledge.js"
  - "src/who_knows_view.js"
  - "src/inquiry*.js"
  - "src/research_*.js"
  - "src/world_events_knowledge.js"
  - "src/beat_knowledge.js"
  - "src/item_card_model.js"
  - "src/information_freshness.js"
  - "src/carry_ledger.js"
  - "src/craft_experiment_log.js"
  - "docs/KNOWLEDGE_RULES.md"
---

Code here follows [knowledge rules](docs/KNOWLEDGE_RULES.md) KNW1–KNW26 (what characters know, research, rumours, appraisal, texts): working defaults under AD56, adjustable; lines in the [limiting lines review](docs/audits/LIMITING_LINES_REVIEW_2026-11-10.md) stay proposals. Write knowledge only through the `knowledge` effect with a basis; read through `observerView`; a guess is not an account; screens leak nothing through names, order, counts or colours. Cite the codes you apply in the task record or commit message; `node scripts/rule_routes.mjs --for <path>` lists them.

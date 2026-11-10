---
paths:
  - "src/canon_pull*.js"
  - "src/world_events*.js"
  - "src/beat_*.js"
  - "src/storylet_*.js"
  - "src/story_*.js"
  - "src/quest_*.js"
  - "src/place_act*.js"
  - "src/window_chain.js"
  - "src/causal_situations.js"
  - "src/lore_history_state.js"
  - "src/rival_memory.js"
  - "docs/STORY_RULES.md"
---

Code here follows [story rules](docs/STORY_RULES.md) STY1–STY32 (canon and divergence, fate levels, events, storyteller, decks, requests, windows, rivals): working defaults under AD56, adjustable; lines in the [limiting lines review](docs/audits/LIMITING_LINES_REVIEW_2026-11-10.md) stay proposals. Fate never creates an impossible route (a restore fixes only listed facts, a pull never lifts a mechanism block); new decks use `storylet_deck2.js`, new requests the needs board, new windows `windowKit`; randomness, storyteller and fate keep separate records. Cite the codes you apply in the task record or commit message; `node scripts/rule_routes.mjs --for <path>` lists them.

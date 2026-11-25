# Atlas wave 2: file ownership (2026-11-24)

Coordinator: Claude session (atlas platform). Weibao: "lets work on all of them ... port all of our previous ideaboarding and ideas into world atlas ... use codex accordingly".

One writer per file. Codex lanes run in the shared checkout at /Users/weiwei/code/yet-another-idle-rpg and never stage, commit, stash, reset or check out. The coordinator reviews and commits.

| Lane | Owns (may create or edit) |
|---|---|
| G2 ladder receipts (Codex) | `scripts/ladder_receipts.mjs`, `docs/coverage/evidence/ladder/**`, `tests/ladder_receipts.test.js` |
| G3 play-to-row key (Codex) | `src/played_effects_domain.js`, `scripts/effect_landing_count.mjs`, `tests/played_effects_domain*.test.js`, `tests/effect_landing_count*.test.js` |
| G1 more rows proven (Codex, later) | new `tests/gu_*_play.test.js` files only |
| Idea inventory (Codex) | `docs/audits/IDEA_SOURCES_INVENTORY_2026-11-24.md` only |
| Coordinator | everything under `prototypes/world-atlas/`, `docs/IDEA_INDEX.md`, `docs/gm/WRITEUP_REGISTER.md`, these briefs |

Forbidden to every lane (other sessions' uncommitted work or not ours):
- `src/item_bound_law.js`, `src/area_field_law.js`, `scripts/law_defaults.mjs`, `src/world_effects.js`, `src/force_effects.js`, `docs/coverage/fields/law_take.json`
- `docs/USER_VISION.md`, `docs/VISION_DIGEST.md`, `docs/gm/USER_VISION_LOG_2026-11.md`, `docs/research/tabletop-library-2026-10-14/**`
- `away-bank-evidence/`, `private_packs/**`, `docs/research/novels/**`
- Any `docs/coverage/*.jsonl` ledger (generated; owner is scripts/gu_coverage_ledgers.mjs and its peers)

Rules for all lanes: proposals, not decisions (AD32). Separate verified facts from inference. No paid reading. Never copy book text or other people's Discord messages verbatim into tracked files. No em dashes in prose. Report: files changed, commands run with their result lines, what is not done.

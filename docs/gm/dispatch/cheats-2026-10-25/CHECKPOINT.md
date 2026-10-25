# D4 cheats, 2026-10-25

Status: running. Branch codex/cheats-2026-10-25, base 3dfc49cf3422c0262d86810df47459f53f3a4a67. Worktree /Users/weiwei/.codex/worktrees/cheats/yet-another-idle-rpg. Port 5104. Branch commits authorized; no master integration or push.

Rules: AD11/22/26/28/29/30/32/34/36/38; AR1–AR16; UR1–UR69; GTR8/9/10/14. Runtime seams: cheat card envelope, domain registry, native harvest, seeded stream receipts, existing continuation and heir owners. Target 1920×1080 desktop; mobile deferred. Golden baseline: existing commands unchanged; schema-1 cards strict; save/import envelope validation remains authoritative. Failure scenarios: faculty disappears on heir/rewind, duplicate claim, appraisal changes without observation, peek advances stream, dice charges replay after reload, dormant UI leaks.

## Ownership and M4 overlap

D4 owns new cheat domain/card modules, cheat card/UI changes and focused cheat regressions; main.js edits restricted to cheat joins. Reader owns INVENTORY.md only; carry reader read-only. No subagent code writes.

Primary status checked before edits: dirty src/main.js, src/continuation_state.js, src/continuation_host.js, src/continuation_ui.js, src/heir_inheritance.js, tests/continuation_state.test.js and docs/CHEAT_LIBRARY.md. Cultivation owns continuation changes there. Clean: src/cheat_cards.js, src/life_experience_host.js, src/carry_ledger.js, src/status_window.js. Branch-only CHEAT_LIBRARY statuses; merge must reconcile its live primary additions. Any continuation edit here is a narrow cheat carrier adapter, not replacement of primary intent/baggage/law/retention/challenge changes.

## Inventory

Complete source-row inventory is being prepared in [INVENTORY.md](INVENTORY.md). Initial implemented card: system-quests (partial: dormant optional grant, awakening, native status projection; no quest loop). All other named cheat cards are proposals until a consumer and UI are verified. Generic existing mechanics are engine candidates, not evidence of implemented cards.

## Build slices

- D4.1 planned: quiet faculty seed, per-card awakening, enduring-stage carry and shared cadence.
- D4.2 planned: real card actions through existing owners, strict persistence and discovery-safe UI.

## Checks

- git status --short / branch / HEAD: clean isolated branch at stated base before changes.
- Primary per-file status: overlap recorded above; no writes there.
- git log --oneline -30 master; systems register; MAW-X1–X9; recent cheat dispatch: read, no newer cheat runtime found.

### D4.1 source slice

Quiet faculty now seeds separately from the optional talking system; awakening reads card-supplied trigger/message. A cheat domain owns its envelope and commit-before-reveal host. Heir uses a carrier adapter retaining quiet-faculty stages/provenance/awakening and resetting per-life points; temporal restore uses the same adapter without replacing local snapshots of accompanying cards. Existing continuation owns the return itself. Status window uses existing pollDisplays cadence, no private timer. These are reversible authored defaults, not newly accepted design rules.

- node --test tests/cheat_carry.test.js: 4/4 pass; ordinary seed, distinct system, heir carry/reset, post-checkpoint acquisition retention.
- npm run check:arch: pass; main 10090 vs baseline 10115, no new cycles; browser and full suite pending final inputs.

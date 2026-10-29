# Lane brief: CR2, card runtime integration patch and persistence fixture

Model: `gpt-6-luna`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force or push. Rules: `.claude/rules/runtime-code.md` AR1-AR16, AD36, AD38, AD43, AD45, MD1-MD3,
CLR1-CLR13 (CLR9: a hunk outside your grant goes in a prepared patch), SUI1-SUI19, RPT1-RPT12; keyed draws only (LSD139); default/dial/reason, no blanket never/always/only.
Lead-life rules: [LEAD_LIFE_RULES](../../../LEAD_LIFE_RULES.md); design lines LSD167, LSD225-LSD227, LSD257-LSD259. Publication: public code and tests use synthetic ids; canon cards stay in private packs (CLR3). Template: [LANE_BRIEF_TEMPLATE](LANE_BRIEF_TEMPLATE.md).

## Why

CR1 ([checkpoint](CR1_CHECKPOINT.md), committed `8aac493a2`) delivered the world-neutral reader `src/cast_card_runtime.js` with tests, and left it **unintegrated**: no LOTM host registration, no report-ledger hookup, no connection to `applySimulationEffects`,
and no Save, reload, Export, literal Import fixture (FLR5). This lane closes exactly those gaps as a prepared patch plus a fixture, in the DV1/MK1/KN1 pattern. The coordinating session applies the patch and runs the rebuilt 1920x1080 browser check
(Codex cannot start Chrome). Reachable here means a card is shown and applied; it is not a playable control, and the playable share must not move.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Registration sites for `defineInferences`/`defineDivinations` in `src/book_world_lotm_cast_host.js` | at least 2 | | yes (stop if you cannot find the site) |
| `pack.bindings.days` rows reachable from the host (scene to window) | present | | yes |
| Cards in the private file `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/cards-2026-10-29/cards-ch1-24.jsonl` whose `scene` matches a `bindings.days` row | record the share | | no; record it and what unmatched cards need |

## Scope and seam

- Read first: [CR1_CHECKPOINT](CR1_CHECKPOINT.md) (contract, pack field `eventCards`), [CR1 brief](CR1_CARD_RUNTIME_BRIEF.md), [KN1_CHECKPOINT/MF_INFERENCE_CHECKPOINT](MF_INFERENCE_CHECKPOINT.md), [DV1_CHECKPOINT](DV1_CHECKPOINT.md) and [MK1_CHECKPOINT](MK1_CHECKPOINT.md) Resume 2 (live-integration fixtures), `tests/cast_divination_adapter.test.js` and `tests/cast_making_adapter.test.js` (the disposable-copy pattern: use the live integration when the patch is reverse-clean, apply it only when it is not integrated).
- Deliver, in `cast-lives-lanes/CR2_INTEGRATION.patch` (shared files are read-only to you): (1) register `defineCards(pack.eventCards, binding)` beside the inference and divination definitions in `src/book_world_lotm_cast_host.js` with a null-safe read when the pack has no `eventCards`;
  (2) resolve each card's `scene` through `pack.bindings.days` to a reached window; (3) before applying effects run `canonActionDecision` over the effect set so a reservation refusal or contradicted canon fact reports its reason and writes nothing; (4) apply allowed effects through `applySimulationEffects`;
  (5) publish the one-line card reports into the existing `lotm.cast.report.` ledger so `castBeatReports` and the normal Reports consumer remain the only ledger and UI (no new panel; the existing Reports disclosure at 1920x1080; the `cards` perspective tag from CR1's patch is already prepared, keep it); (6) the state-validator lookup hunk so saved card state validates; pending and settled states.
  If a hunk cannot be a patch (a needed new export), say so in the checkpoint and stop at that point rather than editing a shared file.
- You may edit `src/cast_card_runtime.js` and `tests/cast_card_runtime.test.js` (CR1's files, now committed) when the integration needs a change; keep it a zero-import leaf and keep its tests passing.
- Files owned: `tests/cast_card_integration.test.js`, `cast-lives-lanes/CR2_INTEGRATION.patch`, `cast-lives-lanes/CR2_CHECKPOINT.md`, plus the two CR1 files above. Everything else read-only.
- Known limits (AD45): processes between beats and the journal of open threads (LSD260-LSD264) stay out; thread ids remain grouping only; no thread logic may depend on clustering quality.

## Work and done check

- Persistence (FLR5), the main deliverable: in a disposable copy, build, run a LOTM be life with synthetic `eventCards`, reach a card window, then **Save, reload, Export and literal Import** through the real validator, with a pending state and a settled state, and tamper checks the validator must reject (a card report with a wrong shape, an effect the card did not carry), as the DV1 and MK1 fixtures do. Report the build SHA-256.
- Failure and refused paths (LSD227): a card refused for a contradicted canon fact reports why and writes no effect and the refusal survives reload; a card whose window has not arrived writes nothing.
- Non-lead fixture (LSD226): the same cards bound to a non-lead `actorId` through the real host path; no branch reads "is the lead".
- Verification: `node --test tests/cast_card_integration.test.js tests/cast_card_runtime.test.js tests/perspective_controls.test.js`, `npm run check:arch` with no growth; checkpoint with FLR1-FLR6 lines (FLR1 names the bundle hash; say "implemented, below floor" until the coordinating session's rebuilt browser check passes), the registration steps, and every check on one line.
- Stop conditions: the host registration site cannot be patched without an export or edit outside the patch format. Ambiguity default (CLR12): where an owner system is missing, record the effect as a fact and name the owner needed.

Do not commit. Keep canon names and source text out of tracked `src/` and `tests/` (CLR3).

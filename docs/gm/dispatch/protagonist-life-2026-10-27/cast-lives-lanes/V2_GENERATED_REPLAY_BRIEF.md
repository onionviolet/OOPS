# Lane brief: V2, replay generated mappings for any chapter range (CL269, ON3, ON5, LSD156-LSD160)

Model: `gpt-6-luna`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`; scripts only, no `src/`, no
`private_packs/`. Beside H1 (`src/`) and R2 (`build_cast_pack.mjs`). Do not commit; the coordinator commits.
Never stash, reset, force or push. Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md); [V1](V1_CHECKPOINT.md),
[X1](X1_CHECKPOINT.md), [X2](X2_CHECKPOINT.md) checkpoints. Rules: AD36, AD44, CLR2, CLR3, CLR12.

## Why

`scripts/lead_run/build_replay_mapping.mjs` now emits `lead-ui-replay/2` rows for chapters 1-24 (1,491 steps, 29 walks,
about 176 wait intents), but `scripts/headless/lead_runs/lotm_ui_replay.mjs` only validates and runs the hand-built
chapters 1-3 shape (fixed scene list, numeric `time.day/from/to`, per-step anchors). Chrome cannot start in the Codex
sandbox, so build it so the coordinator can run it.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Rows in a regenerated chapters 1-24 mapping (command in the X2 checkpoint, plus `--pack private_packs/lotm-cast/cast.json`) | 1,491 | | yes |
| Rows with a usable time (day plus band or minute, or an order edge) | count | | no |
| Where the driver hard-codes the chapters 1-3 shape | list of lines | | yes |

## Scope

- **Adapter.** The driver accepts `lead-ui-replay/2` rows: derives a numeric window from the row's day and time band
  (band edges from `TIME_BANDS` in `src/cast_schedule.js`, imported, not copied) or leaves it open with order only
  (LSD156: order and window, not minutes); validates per row and records a typed gap instead of failing the run.
- **Order fidelity.** Score events reached in book order inside their windows; report per chapter and overall.
- **Null-player determinism.** Compare the two runs at the same game minute (pause the natural clock with
  `simulationTestHooks.pause()` before hashing, or hash at a fixed `clock` target), not at different wall times; a
  mismatch writes both snapshots' differing paths (keys only) to the private output and does not abort the run.
- **Budget.** `--max-steps` and `--chapters a-b` options so a run fits in about 20 minutes; resumable output.
- **Files owned.** `scripts/headless/lead_runs/lotm_ui_replay.mjs`, `tests/lotm_ui_replay.test.js`,
  `tests/lead_replay_score.test.js` (new cases), checkpoint `cast-lives-lanes/V2_CHECKPOINT.md`.

## Done check

Focused tests pass (a v2 row with a band window; an open-window row scored by order; a mismatch recorded, not thrown);
`node --check`; a dry run (`--audit-only`) over the regenerated chapters 1-24 mapping prints counts by row kind; the
checkpoint gives the coordinator's exact browser command. Counts only; no canon names or text. Stop on: probe gate
failure, a needed `src/` change, any paid call.

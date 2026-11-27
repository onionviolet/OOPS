# Lane C brief: one composed investigation case (B5, HW3)

Read [README](README.md) for the shared rules. Idea source: [HW3](../../../research/HEAVENS_WILL_DISCORD_IDEAS_2026-11-24.md#ideas-ranked-for-oops). Several investigation Gu, each detecting its own kind of thing, combine into one move that either sweeps broadly or probes one target more strongly.

## Fit it to the run first

- Read the [foundation run resume block](../foundation-run-2026-11-12/RUN.md#current-resume-block) and its OR1–OR10.
- Read Q3 (decided 2026-11-24): engine-only foundation waves count. They report held-out capability and a named future consumer.
- Read GKM5–GKM8 (killer moves as recipes over roles) and GKM340–GKM343 (senses, concealment, cooperation) in `docs/GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md`, plus `src/gu_senses.js` and the case conveyor (`scripts/coverage_report.mjs` header; `src/world_packs/gu_move_coverage_cases.js` as the pattern).
- Prefer a canon anchor: an investigation killer move or investigation Gu set in Reverend Insanity. Check candidates with `python3 -I scripts/check_passage.py --name "<name>"`. If there is none, the case is authored and labelled so.

## Build

Build one engine-only case: a composed working over two or more investigation-type Gu with one paid activation and two modes.
- Sweep: wider reach, coarser result.
- Probe: one target, stronger against concealment.
- Results are observer-safe: the result reports what the senses reached, not the hidden truth.
- Settle a lost support or failure as GKM5–GKM8 say.

It is proven by `case` plus `expect` through `runCase`, with tests. Put it in a new module (for example `src/world_packs/gu_investigation_cases.js`) and a new test file. Edit `src/gu_senses.js` only where the case needs a missing hook, and list each edit.

Do not edit `docs/coverage/gu_moves.jsonl` (lane B owns it). If the case should attach to a ledger row, put the exact line in your report and the coordinator adds it.

## Checks

Run the new test, `node --test tests/gu_*.test.js` (or the focused Gu tests the conveyor names), `npm run -s check:arch` and `npm run -s check:rules`. Report each exit status. Report as an engine-only wave: held-out capability, named future consumer, and what is not proven (no player route). Write a short record to `lane-c/REPORT.md`.

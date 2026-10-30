# TH2 checkpoint: deterministic full-suite fixtures

Scope: tests and shared test helpers only. Rules: AD36, CLR13. No source files changed; no commit made.

## Changes

- `tests/facts_frame.test.js`: use the headless runner's save diff to allow only the top-level `/saved_at` wall-clock timestamp, then compare every other save field. Any other differing JSON path fails with its name.
- The nine disposable native integration files named in TH2 now allow 300 seconds for the outer test and 270 seconds for their native worker. Full-suite failures had stopped at the previous 160/170-second worker limits while other heavyweight files ran concurrently.

## Checks

- `node --test tests/facts_frame.test.js` — PASS, 9 tests; fresh life, mid-wait and beside-life cases passed; no gaps.
- `node --test tests/cast_divination_adapter.test.js tests/cast_making_adapter.test.js tests/cast_exchange_adapter.test.js tests/cast_body_adapter.test.js tests/cast_inference_adapter.test.js tests/cast_ability_adapter.test.js tests/cast_topic_talk.test.js tests/place_acts.test.js tests/cast_journeys.test.js tests/facts_frame.test.js` — PASS on the prior comparison implementation, 61 tests, 0 failures; duration 218.8 seconds. The final `/saved_at` path guard was then verified by `facts_frame` alone (9/9).
- `node --test tests/cast_inference_adapter.test.js tests/cast_making_adapter.test.js tests/facts_frame.test.js` — PASS, 20 tests, 0 failures; duration 136.9 seconds; no gaps.
- `node --test tests/cast_journeys.test.js` — FAIL, 9/10 tests. The native journey integration reproducibly stops at minute 1920 with `expansionError: Progress paused because saving failed. Free storage and reload before continuing.` This is not a timeout. Suspected owner: the native save/publication error path in `src/main.js` around line 1867; the surfaced error omits the underlying exception. The brief forbids `src/` edits, so record for coordinator triage.
- Final combined focused run after the path guard — 62/63 tests pass; the same `cast_journeys` integration failed. The final `/tmp/th2-path-final.log` captures the error.
- Three diagnostic `npm test` runs before the final edits — 4,058 tests each; run 1: 4,052 pass / 6 fail; run 2: 4,049 pass / 9 fail; run 3: 4,049 pass / 9 fail. `facts_frame` showed an intermittent `create_save()` mismatch, and disposable workers failed at their old timeouts. Each run also had unrelated native-loader failures with `listen EPERM: operation not permitted 127.0.0.1` in `cheat_awakening.test.js`, `cheat_cards.test.js`, and `native_save_fixtures.test.js`. Logs: `/tmp/th2-full-1.log`, `/tmp/th2-full-2.log`, `/tmp/th2-full-3.log`.

The requested three consecutive full-suite runs with zero failures are not established: the three pre-edit diagnostic runs failed, including sandbox-denied local server binds outside this lane's owned files. The final path-guarded facts-frame test passes alone, but the combined focused gate currently retains the reproducible `cast_journeys` save failure above. A clean-HEAD full-suite proof remains open for the coordinator; this lane has not established that the `EPERM` failures occur on clean HEAD.

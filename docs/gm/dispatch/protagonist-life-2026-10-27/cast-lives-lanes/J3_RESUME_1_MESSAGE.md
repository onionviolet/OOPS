# J3 resume 1: the journeys candidate breaks load

Repro (coordinator, headless Chrome 1920×1080, fresh scratch build of HEAD `f35fa6d4c`): with
`pack-backups/cast-whole-book-journeys-candidate-2026-10-29.json` as the scratch build's `private_packs/lotm-cast/cast.json`, the page throws
`Simulation data must be JSON.` twice during load and never shows the play button. The same build with
`cast-whole-book-candidate-2026-10-29.json` (no `journeys`) loads in 14.9 s with zero page errors, so the cause is in the `journeys`
rows, probably a field that is `undefined`, `NaN`, `Infinity` or a non-plain value in a command definition, quote, effect or cost
built by `defineJourneys` (`src/cast_journeys.js`).

Find the offending field using the real `defineJourneys` adapter plus the native registry's JSON check in Node (the same check
the page's `createSimulationRegistry` runs), on the real candidate. Fix in the right place:
- generator side (`scripts/lead_run/build_journeys.mjs`, your files): regenerate the candidate;
- adapter side (`src/cast_journeys.js` and `tests/cast_journeys.test.js`, T2 has finished; you may edit these two): normalize or reject
  the bad value with a clear error, and add a synthetic regression test that feeds a generator-shaped row through the adapter and
  the registry's JSON check.
Also make a bad row fail loudly in a typed pack-load message instead of leaving the page at the loading screen, if that is a small
fix inside the T2 files; otherwise note where it must go.
Append "Resume 1" to J3_CHECKPOINT.md with one line per check. Run `node --test tests/cast_journeys.test.js tests/build_journeys.test.js tests/build_replay_mapping.test.js`.
Do not commit.

# Lane G2: ladder receipts, first slice (Codex sol)

Read first: [OWNERSHIP.md](OWNERSHIP.md) (your files and the forbidden list), then [ATLAS_LADDER_SOURCES_2026-11-24.md](../../../../audits/ATLAS_LADDER_SOURCES_2026-11-24.md) (the design you are building), docs/coverage/CASE_SHAPE.md, scripts/case_runner.mjs, scripts/reachable.mjs, tests/gu_lotus_essence_play.test.js.

Goal: the atlas evidence ladder has four separate rungs per coverage row: (1) case success, (2) module reachability, (3) player-action proof, (4) persistence proof. Weibao's decision (Q1): never infer one rung from another. Rungs 2-4 show "not recorded here" today. Build the producer so they can be filled from real receipts.

Build `scripts/ladder_receipts.mjs` with subcommands, as the design doc's first slice describes:
- `reach`: for every case module referenced by any ledger row, record whether `scripts/reachable.mjs` reaches it from the default entry, and the import chain (`via`) that reaches it. The design doc's trap: the 16 Gu rows are reachable only because played_landing.js imports the Gu grammar, and nothing on that chain plays their scenes. The `via` chain must be stored so the atlas can show that, and add a `consumerCallsCase` boolean (does any file on the chain call the case/scene function) so "reachable" is never shown as "played".
- `play`: run named play/persistence test files (start with tests/gu_lotus_essence_play.test.js and any `tests/gu_*_play.test.js`) and record per row: rung 3 scope ("workshop demo", "headless", "ordinary play", "browser") and rung 4 checks passed (engine restore, save/reload, export/import, browser) as separate booleans. A test file declares which ledger row keys it proves through an exported or commented manifest you define; document the format.
- Optional `engine` and `candidates` subcommands from the design doc if cheap.
- Receipts go to `docs/coverage/evidence/ladder/` as JSON (not `.jsonl`, so the coverage validator never reads them as ledgers). Each receipt names the HEAD commit, the content hashes of every file it watched, the command, and the run time. Staleness = any watched hash differs.
- Never run `scripts/effect_landing_count.mjs` in default mode (it rewrites a tracked receipt). Do not run it at all in this lane.

Tests in `tests/ladder_receipts.test.js` on small fixtures: via chain recorded, consumerCallsCase false for an import-only chain, stale detection when a watched file changes, play manifest parsing, a row with no case reads "no case module" not "unreachable".

Run: the new tests, `node --test tests/case_runner*.test.js`, `npm run -s check:coverage`, `npm run -s check:arch`, and each subcommand once for real (report run times). Do not edit prototypes/world-atlas (the coordinator wires the display).

Report: files, receipt counts (rows with rung 2 filled, how many reachable with consumerCallsCase true vs false, rows with rung 3/4), run times, test lines, gaps.

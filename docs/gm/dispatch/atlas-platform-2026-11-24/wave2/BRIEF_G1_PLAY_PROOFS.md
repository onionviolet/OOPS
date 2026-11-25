# Lane G1: more Gu rows proven in play, with ladder manifests (Codex sol)

Read first: [OWNERSHIP.md](OWNERSHIP.md). This lane owns only NEW files named `tests/gu_<row>_play.test.js`. Do not edit any existing file.

Context: the atlas evidence ladder now reads rungs 3 and 4 from `docs/coverage/evidence/ladder/play.json`, produced by `node scripts/ladder_receipts.mjs play <test files>`. A play test declares the rows it proves with a `// @ladder {...}` manifest (format at the top of scripts/ladder_receipts.mjs). The only example is tests/gu_lotus_essence_play.test.js: it boots the game headless, opens Capability runs, begins the effects workshop, presses the Lotus act, then checks the line survives save/reload and export/import.

Goal: give the other gu_kinds rows that are `runs-*` the same proof, where a real route exists.
1. List the `runs-*` rows in docs/coverage/gu_kinds.jsonl. For each, find whether a player can trigger its effect today: an effects workshop act (src/world_packs/effects_workshop.js, the "gu" vitality-leaf act is the known one), a native action in a book-world start (the keeper's Moonblade hunt joins gu_kinds:moonlight through src/played_effects_domain.js ENTRY_POINTS), or none.
2. For each row with a route, write one play test in the Lotus pattern: boot headless (scripts/headless/runner.mjs), drive the real UI path a player would use, assert the visible line or state change, then save/reload and export/import and assert it survives. Use the honest scope word in the manifest: "workshop demo" for the capability-run workshop, "headless" for a native action in a scripted start, and not "ordinary play", for the reason that ordinary play needs the landing counter. List the checks the test really makes and no others.
3. The workshop act lands a generic sentence with authored amounts for vitality-leaf; say so in the test header. A row with no player route gets no test: list it in your report with why.
4. Run each new test, then `node scripts/ladder_receipts.mjs play tests/gu_lotus_essence_play.test.js <your new files>` and report the receipt count. Keep each test under about 30 s.

Report: rows covered (key, scope, checks), rows with no route and why, test lines and run times, the play receipt count.

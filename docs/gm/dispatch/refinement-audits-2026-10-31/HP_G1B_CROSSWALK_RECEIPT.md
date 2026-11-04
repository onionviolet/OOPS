# HP G1b crosswalk receipt (2026-11-03)

Task G1b of [HP_LEAD_RUN_START_2026-11-03](HP_LEAD_RUN_START_2026-11-03.md); follows [G1](HP_G1_PORTABILITY_RECEIPT.md). AD51 seam work; no LOTM rule imported. Agent-verified, not human-reviewed. Nothing committed, no `dist/` rebuild, no browser, no full `npm test`.

Was wrong: `runtimeCatalogue(world)` threw `world must be lotm or mol`, so `buildCrosswalk` and the cast CLI (no `crosswalk.json` in `--merged`) could not run for `hp`.

Changed: `scripts/lead_run/build_crosswalk.mjs` (`hp` branch: ids from `book_hp_pack.js` catalogue plus the locations and items of `hpSchoolLife` and `hpTradeLife`; people `[]` because those lives use original people, so canon ids like `hp.person.petunia` are never name-matched; CLI hashes the two HP source files as runtime inputs only when `--world hp`). Test added to `tests/lead_run_crosswalk.test.js`.

- (a) PASS: `buildCrosswalk` (crosswalk plus fitness report, JSON sha256) on the lotm merged-cast slice (776 entities, `0118a3aa…`) and the mol merged-cast slice (110 entities, `443139e8…`) is identical before and after. Compared in memory: the CLI's written `crosswalk.json` embeds a hash of the script itself, so those files change by design on any edit to it; not rewritten here.
- (b) PASS: HP crosswalk from `hp1c001_scenes.jsonl` (8 scenes, all chapter 2; slice `en b1 c2 p1` to `c2 p9999`, registry and extras from `wb8-merged-2026-10-30`): 26 touched ids, 0 mapped to runtime ids, 26 proposed `new:` (5 person, 21 place); `missingCoverage` 0. HP has no canon-id runtime catalogue yet, so "missing" here means proposed, not unlisted.
- (c) PASS: `build_cast_pack.mjs hp --from "en b1 c2 p1" --to "en b1 c2 p9999" --merged <scratch dir with those inputs, no crosswalk.json> --base <empty base> --out <scratch> --place-prefix hp.place. --districts privet-drive` ran through the new path: 8 people (5 recurring, 3 role), 11 routines, 24 rows added, 0 conflicts, 0 gaps. Scratch dir and output are outside the repo.
- (d) `node --test tests/lead_run_crosswalk.test.js tests/build_cast_pack.test.js tests/world_portable_tools.test.js`: 41 pass, 0 fail.

## Open
- Nothing maps HP canon ids to runtime yet; that waits for an authored HP cast pack or a review file (`review.entities`), and the Harry lead profile (G2).
- `run()` passes no lead id for `hp` to `discoverLeadPersonas` (only lotm has one); scenes with `pov: lead` work, persona aliases for Harry are unresolved.
- The real CLI path for `crosswalk.json` writing under the novel `private/` directory was not run for `--world hp`.

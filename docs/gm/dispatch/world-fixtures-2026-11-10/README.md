# World fixtures (FRC74, FRC76), 2026-11-10

Six named DEV fixtures so browser proof and the game MCP can start where a feature lives instead of walking a fresh life there.
Owner: `scripts/headless/world_fixtures.mjs`. How lanes use them: [AD36 item 11](../../../RULES_INDEX.md#efficient-rule-verification-ad36).
Codes: FRC74, FRC76; AD36, AD43 (FLR2 named fixture, FLR5 kept), AD54 item 8; AR16 (dev tooling only, no runtime seam touched).

## What exists

| Fixture | How it is made | Proves (after a reload through the real load path) |
| --- | --- | --- |
| `lotm-tingen-day3` | Played: Be Klein Moretti through the Tingen panel, stepped to day 3. Needs `private_packs/lotm-cast` | Tingen life present, day 3 |
| `hp-exam-week` | COMPOSED: Harry's lead begun from Beginning, Arrival/Sorting/first week marked done, Gryffindor, Great Hall, clocks moved to 17 June 09:00 (day 321), as the exams lane's `hp_exam_fixture.mjs` did | At school; HP panel shows Exam week; a paper button is enabled |
| `gu-fed-second` | Played: Gu keeper life; Moonlight Gu taken, petals bought, three meals; three chores; Liquor Worm taken | Moon and worm controlled by the player; the moon's keep has petals |
| `mol-loop2` | COMPOSED clock: Zorian begun by play (elder, Chart, Begin as Zorian); clock and scheduled due times moved to one minute before month end (as `scripts/playtest/mol-restart-memory.mjs` does); the engine's own stepper fires the restart | `runs === 2`, Zorian profile, last death trigger `date` |
| `frontier-hunt-ready` | Played with a DEV SEEDED kit: craftsman story access (the `village-craftsman` patch) plus a Hunter's bow and 6 arrows; elder and craftsman met, frontier inspected, field survey joined by clicks | The `frontier.hunt.arrow` opener in the fight panel is enabled |
| `household-cat` | Played: Homes, homeowner start, meet Moss, pet twice | Moss adopted in `homes.properties.cottage.household.animal` |

Routes: `node scripts/headless/scenarios.mjs build <name> --out f.json`; `game_new {scenario: "<name>"}`; `npm run build && node scripts/fixture_browser.cjs <name|all>` (lane scripts import `openFixture`). Built saves are cached in the OS temp folder per source stamp and only after they load and prove; when code moves, the newest earlier build is reused if it still loads and proves (`YAIRPG_FIXTURE_REBUILD=1` forces a rebuild). Fixture saves never go into git (LOTM carries cast text).

The browser opener restamps `saved_at` to the page's now before storing the save: the headless runner's frozen wall clock otherwise makes the away-time bank fill (found in the first browser run, "452431 minutes passed"). Wall metadata only.

## Timings (wall seconds, load 30 to 100 on this machine)

"Before" is the walk a lane paid to reach the state. Measured means this session ran it; extrapolated means a measured per-day rate times the days.

| Fixture | Before: walk to the state | Fixture cold build | Browser load from cache (1920x1080, fresh origin) |
| --- | --- | --- | --- |
| lotm-tingen-day3 | 936 s headless, measured (about 23 s per game hour) | 936 s (the walk itself) | 14.6 s |
| hp-exam-week | about 3.6 h, extrapolated (40 s per lead day x 321, the exams lane's rate) | 28 s | 6.8 s |
| gu-fed-second | 112 s headless, measured | 112 s | 6.6 s |
| mol-loop2 | about 90 min, extrapolated (182 s per game day x 30, measured per day) | 106 s | 6.8 s |
| frontier-hunt-ready | 397 s headless, measured, and that is with the kit seeded (the bow's crafting route is hours) | 397 s | 13.5 s |
| household-cat | 50 s headless, measured | 50 s | 6.1 s |

Reusing a build after a code change cost 7 to 85 s per fixture (a reload and proof), shown as `fixtureS` in [browser-run.json](browser-run.json).

## Verification (one line per check)

- Browser: `node scripts/fixture_browser.cjs all` on a bundle rebuilt from this tree: 6/6 ok, 0 page errors; screenshots here (`<name>.png`), rows in `browser-run.json`. MOL's check reads the restart line in Reports.
- Focused: `node --test tests/headless/world_fixtures.test.js` (build, load, prove, Options-menu export and import, prove again): 7/7 pass, 271 s on warm caches (Frontier 163 s, others 16 to 31 s).
- MCP: `node scripts/mcp/game_mcp_check.mjs --fixtures-only`: PASS (help names every fixture; `household-cat` shows Moss in Homes after opening Hearth and companion).
- `npm run check:arch`, `npm run check:rules`: pass (exit 0).
- Not run: full `npm test` (no runtime `src/` change; the new test is outside the `tests/*.test.js` glob).

## Limits

- A cold build of LOTM or Frontier runs past the game MCP's 300 s call limit: warm it with `scenarios.mjs build` first.
- `gu-fed-second` follows the keeper roster on master; the unmerged gu-killer-moves branch adds a Little Light Gu and fails old keeper saves, so the cached build rebuilds after that merge (the reuse check catches it).
- Found while writing the MCP check: in a scoped `game_look`, a disclosure's action key can be the bare `summary`, which `game_click({key})` resolves to the first summary on the page. `game_click({text})` works. Candidate ledger entry for `game_report_limit` (not filed from this lane).
- HP and MOL are COMPOSED: they do not exercise the story chain before the moved clock. They are setup for exam and loop-2 behaviour, not proof of the walk.

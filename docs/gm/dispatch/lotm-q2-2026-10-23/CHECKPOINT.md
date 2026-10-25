# LOTM Q2: Tingen districts as a region layer, 2026-10-23

Queue row Q2 of [the LOTM build queue](../lotm-lives-regions-2026-10-23/QUEUE.md). Rules applied: WPR30-WPR32, WA1, WA5,
SR1-SR24 (region identity and access), AR1-AR16 (seam AR14: `src/book_world_lotm_*.js`), WPR5 (each authored value has a reason).
Target viewport desktop 1920x1080; mobile deferred. Opt-in only (`?lotm_probe=1`). All authored values are proposals, not canon.

## What was built

`src/book_world_lotm_districts.js` (new) holds the data: three districts, each with its places, church team, claim text, on-site
text, reason, supervision shift, dose rule and per-act vouch rows. The faith split is the source's (institutions pass F1, stated by
Dunn): Nighthawks north, Mandated Punishers docks/east/south, Machinery team university area and outskirts. Authored: the labels,
which place sits in which district (workroom and lodging in the north quarter, because Hale is a Nighthawk-line warden), minutes,
vouch costs and the Machinery day shift (first 16 hours of each branch day).

| District | Team | Places | Act rows (Hale vouches) | Dose |
|---|---|---|---|---|
| North quarter | Nighthawks (Evernight) | workroom, lodging | base acts, Hale in person | issued and assessed here |
| Docks | Mandated Punishers (Storm) | Tingen docks | laying-out 2 attention, reading 1 | not issued here |
| University area | Machinery team | Tingen university area | reading 1, only on shift | not issued here |

Travel (authored): 2 min inside a district, north-docks 20, north-university 25, docks-university 35. A walk is a timed job
(`book.lotm.walk_<from>_<to>`, 12 commands generated from the places), so the minutes are real and the player is occupied. The host
places the body at the destination when the walk starts (the engine records a job's place at start); the arrival record is written when the job ends.

Jurisdiction effects, all emitted through `lotmFacts` and read as data (base pathway commands contain no district name; a test checks it):
1. Act cost: the same laying-out costs Hale 1 attention at the workroom and 2 at the docks; the Seer's reading adds a 1 attention vouch at the docks and the university.
2. Who may supervise: district acts require `lotm.district.<id>.supervised` (team on duty); the Machinery team is off shift for the last 8 hours of each branch day.
3. Dose acceptance: the four accept and ingest commands require `lotm.district.doseOk` (only the church-held north issues its own dose).
Why-text: each district act writes a "district.act" record (who supervised, what Hale spent, the reason, the attributed claim); each walk writes an "arrived" record. The panel shows the district and team in the status line, a "Places" list (place, district, team, minutes) and the reason line.

Files changed (own paths): `src/book_world_lotm_districts.js` (new), `_ids.js` (two locations), `_actions.js` (district variants and walks generated from the table, `doseOk` on four commands, `districtFacts` in `lotmFacts`, rule consts extracted, no behavior change to base acts), `_host.js` (walks via commit, places and district in the view), `_ui.js` (status, places list, reason), `tests/lotm_districts.test.js` (new, 7 tests), this folder (`dump_fixtures.mjs`, `fixtures/`).
No shared engine file, `ascension_paths.js`, `main.js` or other session's file was edited. `dist/` and `index.html` carry normal build output.

## Save compatibility decision

Additive only. `state.lotm` stays schema 1. New commands exist only in the registry; the new facts are derived, nothing new is stored. New places are extra `current location` values; the envelope accepts them through `LOTM_PLACES`. A save mid-walk holds a job that matches its definition. Evidence: `dump_fixtures.mjs` was run on the pre-Q2 code before the first edit and wrote Seer (taught, promoted) and Corpse Collector (stabilized, promoted) saves; the new test loads all four unchanged (state and envelope validation, facts place them in the north quarter with `doseOk`). Saves containing walks or district acts will not load in pre-Q2 builds (localhost test saves).

## Verification (one line per check)

- `node --test tests/lotm_*.test.js tests/ascension_paths.test.js`: 29 pass, 0 fail (22 baseline from Q1, 7 new). Gap: engine level; no native binding.
- `npm run build`: pass. `npm run check:arch`: pass (main.js growth 0, save_files.js growth 0).
- Not run by design: full `npm test`, `check:rules` (committer).
- Browser 1920x1080, in-app pane, never-used origin `127.0.0.1:19822` (Corpse Collector): enroll, report in, accept, ingest, walked workroom to docks (20 min job, "Warden Hale is elsewhere", arrival record names the Punishers and the attributed claim), laid out a body at the docks (attention 6 to 4, record "Hale vouched for you and spent 2"), **page reload mid-job** (job and attention kept), act count 1/4, `save_to_file()` (114,712 chars), walked back to the workroom (Hale present, North quarter), literal `load_progress(string)` restored the docks state, 1/4 and attention 4.
- Browser, never-used origin `127.0.0.1:19823` (Seer): enroll, accept, ingest, lesson, walked to the university (on shift), read there (attention 5 to 4, record names the Machinery team), walked back, reading, refusal, lodging, slept, three readings, 6/6, assessment, drank the Clown dose: **Sequence 8 · Clown** (Q1's unverified item, now played), `save_to_file()` (196,164 chars), walked to the docks, literal `load_progress` restored the workroom and Sequence 8 · Clown.

## Not exercised (implemented-unverified)

- Off-shift university and the docks Seer reading in the browser (engine test covers off-shift refusal and the docks laying-out; the docks reading has no test).
- Dose refusal in another district in the browser (engine test sets Hale and the player at the docks; with Hale fixed to the workroom it is not reachable by play today).
- Mid-walk reload and a panel screenshot (checks by DOM text); 1366x768; native Export download; human feel of the minutes and costs.
- A second visit in the same life to the university when it is off shift at arrival (nothing but a refusal reason).
- Hale is still the only supervisor actor: Punishers and the Machinery team have no body, so "who responds" is a record, not a person (Q6 or later).

## Notes

- Walk location is set at departure, not arrival: the panel reads the destination while the job runs; nothing else is possible until arrival.
- The old instant walk between workroom and lodging is now 2 minutes.
- The browser autosave and PLAY gate behave as in Q1: after a reload or import, click PLAY (about (400,202) in the 800x450 frame) before time advances.

## Next slice seam (Q3 second life profile)

District rows are the place to hang a life's starting district and starting team standing: a profile could set the entry place and a different `claim` set per team. `districtFacts` already reads only the player's place, so a second profile needs one entry-place field and its own `enrollLotmBranch` branch. The act-vouch rows are keyed by base command id; a third pathway adds its own `districtActs` entry and vouch rows without touching the table logic.

## Committer commands

```
git add src/book_world_lotm_districts.js src/book_world_lotm_ids.js src/book_world_lotm_actions.js src/book_world_lotm_host.js src/book_world_lotm_ui.js tests/lotm_districts.test.js docs/gm/dispatch/lotm-q2-2026-10-23
git add -p src/book_world_lotm_*.js   # Q1's uncommitted hunks share these files; commit Q1 first or together
node --test tests/lotm_*.test.js tests/ascension_paths.test.js && npm run build && npm run check:arch && npm test
git commit -m "LOTM Q2: Tingen districts with jurisdiction effects and timed walks"
```

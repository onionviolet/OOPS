# Cheat absorption sweep, 2026-11-24

Register status: finding and proposal. Nothing here is an accepted decision, and `docs/CHEAT_CATALOGUE.md` was not edited. Candidates are for Weibao or the catalogue owner to adopt, merge into an existing CTC row, or drop.

Why: Weibao wanted the Cheat log to absorb ideaboarding "from past present and future" (2026-11-24). The atlas now has a Cheats section (`prototypes/world-atlas/cheats.mjs`, routes `/cheats` and `/cheats/rows`) with one row per catalogue cheat and a Candidates tab for cheat ideas the catalogue does not list. This page records the first sweep and the method so a later ideaboard can be swept the same way. The build reruns the sweep every time (`node prototypes/world-atlas/build.mjs`, part `cheats`).

## Counts (checkout at 7be146e27, uncommitted work included)

| What | Count |
| --- | --- |
| Catalogue cheats (CTC rows) | 95 |
| Variations attached to them | 196 (92 catalogue source links, 49 library families, 32 cosmology placements, 22 by-world rows, 1 scenario lever) |
| Rows with a definition in `src/cheat_definitions.js` | 8 |
| Rows marked implemented (catalogue says built and an id it names exists in `src/cheat_*.js`) | 10 |
| Rows marked working default (catalogue says partly, or built with no id found in src) | 13 |
| Rows marked proposal | 72 |
| Docs scanned (under `docs/`, excluding any `private/` segment and `docs/research/novels/`, containing the word "cheat") | 1,221 of 8,523 |
| Tables read | 7,931 |
| Candidate rows after dedupe | 581 across 33 docs (418 coded, 163 named only) |
| Candidates seen in more than one doc | 26 |
| Candidates with an inferred resemblance to a catalogue row (overlap 0.45 or more) | 40 |

Every catalogue source link resolved to a real heading (0 broken anchors).

The two statuses the atlas shows are separate fields on purpose: `docStatus` is the catalogue's own words, `runtime` is what the build found in `src/`. Implemented needs both. No definition id in `cheat_definitions.js` is unclaimed by a row.

## Top candidates

Ranked by number of distinct docs that carry the name, then coded before named. Most of the top are the SH reveal cheats (CHEAT_LIBRARY, "cheats that show things") that also appear in the 2026-10-25 cheats dispatch inventory.

1. SH12 Ledger Sight, 3 docs (CHEAT_LIBRARY.md line 1359)
2. SH2 Causality Lens, 2 docs (line 1349)
3. SH5 Agenda Reader (1352)
4. SH6 Turn Sight (1353)
5. SH7 Other-Self Echo (1354)
6. SH8 World Chronicle (1355)
7. SH9 Hidden-Thing Sense (1356), resembles CTC10 truth reading (inferred, 0.53)
8. SH10 Notice Meter (1357)
9. SH11 Curse Identify (1358)
10. SH13 System Empathy (1360)

The full list is at `/cheats/rows?status=candidate`, or `node -e "import('./prototypes/world-atlas/cheats.mjs').then(m=>console.log(m.readCheats().candidates))"`.

## Reading the numbers

- The largest source is `CHEATS_BY_WORLD.md` (103 candidates). Only 22 of its rows matched a catalogue type strongly enough to attach as a variation. Many of the other 103 are probably per-world versions of an existing type (for example the Cauldron vials against CTC56), so they need a human merge, not adoption as new types.
- The coded rows (418) are mostly proposal codes from "more to consider" rounds (SH, CV, CA, CC, PC, IM and similar). Some are implementation notes about cards that already exist (IM17 True Appraisal, IM20 Earned Habit) and should be merged, not adopted. The tool cannot tell those apart from new ideas.
- Resemblance is token overlap, labelled inferred. A score under 0.85 never moves a row into the catalogue as a variation.

## Method (deterministic, rerunnable)

1. List `docs/**/*.md`, skipping any path with a `private/` segment, `docs/research/novels/`, and the catalogue itself. Keep docs whose text contains "cheat".
2. Parse each doc once: headings with GitHub-style slugs, tables with their header row and heading chain, and bold-coded list items. Fenced code is skipped.
3. Detector A, table-named: a table whose header has a `Cheat`, `Cheat family`, `Simple cheat`, `Cheat (book)` or `Cheat (world)` column. The name is that cell. A leading `Code` column keeps its code.
4. Detector B, coded: a row whose first cell, or a list item whose bold lead, is a code such as `CM1` or `SH2`, where the heading chain, the table header or the item text says "cheat", and (for tables) the second header is Cheat, Type, Family, Name, Card or Item. Names that look like file names or test notes are dropped.
5. Match each name against the catalogue: exact type name 1.0, phrase inside the row's type, description, worlds or status text 0.9, else shared-token coverage. At 0.85 or more in the four variant docs (library, cosmology, by-world, scenario) the row becomes a variation of that CTC (labelled inferred, or code if the row names a CTC id). Other docs never become variations.
6. Everything else is a candidate. Candidates dedupe by normalised name; the first locator is primary, up to 12 more go in `alsoAt`.
7. Runtime evidence: ids in backticks in the catalogue Status cell are checked against module entries in `src/cheat_definitions.js`, quoted literals in `src/cheat_cards.js`, and dotted ids in other `src/cheat_*.js` and `src/rehearsed_foe.js` files.

To sweep a new ideaboard, add it under `docs/` with either a table that has a Cheat column or coded entries under a heading that says cheat, then rebuild. A board that uses neither shape will not be seen. Adding a detector means editing `sweepDoc` in `cheats.mjs`.

## Known limits

- Plain prose and bullet lists without a code are not swept. Only tables and bold-coded list items are.
- Name matching is token overlap, so near-duplicates under different words (for example "Hall of Selves" against CTC88 at 0.8) show as candidates with a resemblance, and some true duplicates are missed.
- Docs that never use the word "cheat" are skipped, even if they hold powers that count as cheats.
- The by-world and cosmology variant matches are inferred, not assigned. A wrong attachment is possible below a score of 1.

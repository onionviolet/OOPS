# L2 brief: coverage ledger script (Codex Sol medium)

You own exactly two NEW files: `scripts/lead_run/coverage_ledger.mjs` and `tests/lead_run_coverage.test.js`.
No commits, no web, no edits to any other file, no reads of book text (rows are ids and short labels; never print `what`/`note` prose).
Match the style of `scripts/lead_run/merge_shards.mjs` and `tests/lead_run_cite.test.js` (node:test, ESM, no deps).

## Goal
Report which paid-for LOTM volume 1 read rows have a game consumer. Consumer proxy = the row's id or its locator appears in the game's LOTM data.

## Inputs (CLI: `node scripts/lead_run/coverage_ledger.mjs --merged <dir> [--game <file|dir> ...] [--out <json>] [--summary]`)
- `--merged`: dir with `registry.jsonl`, `extras.jsonl`, `scenes.jsonl` (default `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/merged`).
- Volume 1 filter: a row is volume 1 iff its `shard` does NOT match `/^lotm[2-8]c\d+m?$/`. Registry rows have `shards: []`; keep the entity if any shard is volume 1. Extras and scenes have `shard`.
- Game corpus (defaults): `private_packs/lotm-cast/cast.json`, `private_packs/lotm-ingredients/ingredients.json`, `src/book_world_lotm_*.js`, `src/lotm_formula_rows.js`, `src/cast_schedule.js`. Read each as text. Build (a) a Set of every locator matching `/zh 第\d+章 p\d+/` (volume 1 locators have no `bN`; do NOT match `zh b\d 第...`), (b) the raw concatenated text for id lookup. An id is consumed if it appears as a whole token in the text (bounded by a non-`[a-z0-9._-]` char on both sides; `lotm.person.x` must not match inside `lotm.person.x-y`). Index ids in a Set by extracting all tokens matching `/lotm\.[a-z0-9_]+\.[a-z0-9._-]*[a-z0-9]/g` once, do not scan per id. Also treat a game `indexId`/`indexPlace` token as an id hit (it is just an id token).

## Units (each reported as {total, consumed, missing})
1. people: registry `kind==="person"`. consumed = id token hit.
2. places: registry `kind` in `place`,`organization`. consumed = id token hit.
3. routines: each element of `routine[]` in extras rows with `extra==="people"`. One unit per (person id, routine locator). consumed = routine's `locator` in locator Set.
4. rules by kind: extras `extra==="rules"`, grouped by `kind` (ability, rite, potion, craft, institution, law, custom, spell, other...). consumed = row id token hit OR row `locator` OR any `steps[].locator` in the locator Set.
5. services: extras `extra==="services"`. consumed = locator in Set. Also report how many carry a non-empty `price` other than "unstated"/"not stated".
6. prices: registry `kind==="price"`; consumed = id token hit.
7. dated events: (a) extras `extra==="news"`, consumed = locator in Set; (b) scenes whose `date.value` is not `"unstated"` or whose `dateRef.absolute` is non-null, consumed = scene `beat` id token hit OR any `steps`-independent locator is unavailable so beat only.
8. extras kinds not above (customs, places-rows with `hours` not "not stated" => "opening hours", people_other): report customs and opening-hours the same locator way.

## Output
- stdout: a compact table (kind, total, consumed, pct). With `--out`, write JSON `{generatedFrom, counts, missing:{kind:[{id,locator,shard,rows,touchedByLead,score}]}}`: ids and locators only, no prose fields.
- score for ranking: `(touchedByLead?3:0) + Math.log2(1+rows||1) + (label==='S'?1:label==='T'?0.5:0)` where `rows` is the registry `rows` for entities, 1 otherwise.
- Export `buildLedger({registry, extras, scenes, corpus})` pure function (arrays and strings in, object out); the CLI only does IO. Deterministic: sort missing by score desc then id.

## Test (`tests/lead_run_coverage.test.js`)
Fixture built in the test itself (tmp dir via `fs.mkdtempSync`): 2 volume 1 people (one id in corpus, one not), 1 `lotm2c001m`-shard row that must be ignored, a rules row consumed via a step locator, one missing, a routine consumed via locator, a service, a news row, a dated and an undated scene, a price registry row. Assert exact counts per kind, that the volume 2 row is excluded, that `lotm.person.x` does not match inside `lotm.person.x-y`, and that `--out` JSON has no `what`/`note` keys. Run with `node --test tests/lead_run_coverage.test.js` and report the output.

## Done
Test passes; running the script on the default merged dir prints the table in under 20 seconds. Report the table.

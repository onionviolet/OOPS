# L4 Sol brief: LOTM divination rows (volume 1 slice 1)

You own exactly two NEW files: `src/lotm_divination_rows.js` and `tests/lotm_divination_rows.test.js`. No commits, no web, no edits to any other file (especially not `src/cast_divination_adapter.js`, `src/book_world_lotm_{host,state,cast_host}.js`, `private_packs/`). Rules: `.claude/rules/making-systems.md` (MR1-MR36), `.claude/rules/runtime-code.md` (AR1-AR16), AD38 (model mechanisms, not allowed-outcome lists), WPR5 (anything not source-stated is labelled an authored proposal).

## Task
Export `LOTM_DIVINATION_ROWS = {queries: [...]}`, the shape `defineDivinations(data, binding)` in `src/cast_divination_adapter.js` takes (`pack.divinations`). Read that file and the schema example `exampleQuery` in `tests/cast_divination_adapter.test.js` (use `git show HEAD:tests/cast_divination_adapter.test.js`; the working copy has someone else's edits). Source-pinned: the signal is what the scene showed; no accuracy RNG.

Typed source rows (private; read them, but write ENGLISH ONLY in your files, no Chinese, no quoted source sentences): `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/luna_rows.jsonl`. Use these three:
1. `lotm.craft.coin-divination` (usable): query row, attempt `status:'signal'` for the danger question (ch 113, coin floats then lands, read as dangerous); `locator` "zh 第113章 p11". Skip the club instance (gap).
2. `lotm.rite.cane-dowsing` (usable): attempt `status:'obscured'` (ch 46: the cane tips, turns, stands again, the search is disrupted); locator "zh 第46章 p69".
3. `lotm.rite.altar-search-divination` (and `altar-dream-divination`, same ch 121 procedure, one row; `unusable` outcome so the attempt stage is `kind:'unknown'` with no signal): prepare (seal room, altar, pray), write sentence, rite (recline holding the dead person's effects, recite seven times); locator "zh 第121章 p59".
NOT in this slice (list as `LOTM_DIVINATION_GAPS`, an exported array of {id, reason}): copper-whistle-summon/messenger (a summoned being carries a letter: a messenger mechanism, not a question with a signal), pendulum-divination (demonstration, no question), mirror-divination (teaching scene, no performed answer).

Per row: `id` `lotm.div.<slug>`, `targetId` `lotm.div.target.<slug>`, question, method, label, description (English, own words), `place` omitted unless the scene fixes one, `means` and `contact` as `{fact:'actor.lotm.div.<means|contact>',op:'eq',value:true,reason}` rules, `ritual` optional (skip it unless a stand-in structure is clearly stated; do not invent), step `minutes` are authored proposals (comment them as such), costs only where the source states them (none are stated). Export `LOTM_DIVINATION_FACTS`: the list of fact names the rows require, so the host wiring knows what to provide.

## Test (node:test, ESM)
Focused file only: `node --test tests/lotm_divination_rows.test.js`. Assert: `defineDivinations(LOTM_DIVINATION_ROWS, binding)` builds (binding like the fixture test: `{worldId, group:'book_lotm', situationId}` using `LOTM_IDS` from `src/book_world_lotm_ids.js`); every query has a `locator` of the form `zh 第N章 pM`; signal strings never appear in `quoteDivinations` output (copy the observer-safety check from the existing test); the altar row has no attempt/interpret step; `LOTM_DIVINATION_GAPS` ids do not appear in queries. Do not run any other test file, `npm test` or build.

## Done check
Both files exist, the test passes, `git status` shows only those two new paths from you. Report the test output in one line.

# DWF139 pathway-row generator: checkpoint (2026-10-25)

Rules applied: AR1-AR16 (runtime code), MR (making), AD36 (lean verification, item 7 proof tiers), WPR5 (authored proposals marked), DWF72 (unwritten gaps marked), AD38 (mechanisms, not permission lists). Target UI viewports: 1920x1080 primary, 1536x864 secondary; mobile deferred.

## What is playable (browser-verified, headless)
Brew a Spectator dose at the bench, drink it (source granted, Seer and other offers close), act it (4 acts digest it, the potion "feels settling" then "settled"), judge the digestion by feel, brew a Telepathist dose and drink it for the Sequence 8 source. Save, reload, Export and Import keep all of it.
Drinking undigested or on top of another pathway is a stated cause, not a wall: Telepathist before the potion settles applies skip + rushed (pressure 5, pre-signs); Spectator while holding another pathway applies wrong-pathway + switching (pressure 6, loss line).

## Design (proposals unless marked)
- `src/book_world_lotm_generated.js`: `generatePathwayRow(spec)` derives a row from formula rows (names, Sequences, dose keys: table) plus an authored overlay. Per-field `provenance` is `table`, `proposal` or `gap`; `gaps` lists the unwritten parts. Refuses a formula that needs a rite (DWF149 / DWF166 own rites; Seq 9 and 8 have none). Generated rows live in their own array, reuse the shared facts, flags, sources, assertions and descriptor, and have their own commands (no allocation, no officer, no examiner).
- Supervision default (proposal): self-directed acting, digestion judged by feel (the code's existing canon wording). Table acting principle for Seq 9 (T Alger 0035, S 0299: a neutral spectator, never an actor) drives the two acts; digest count 4 is a proposal. The Psychology Alchemists are route text only, no new person (old saves lack no actor).
- Bench ledger is `held + sold + drunk = bottled`; `book.lotm.bf.<id>.drunk` is a new additive counter (reads 0 on old saves).
- Holding a brewed dose does not block the Seer dose (existing behavior kept); drinking is where the causes apply.
- Save compatibility: new flags `vi.*`, resource `book.lotm.vi.acting`, counters `drunk` are additive. No migration. Old saves load (existing fixtures in tests; browser run imports its own saves).
- `src/book_world_lotm_ids.js`: two new source ids and two dose keys (`spectatorDose`, `telepathistDose`), test-pinned equal to the bench product keys.
- Existing rows: `tests/lotm_commands_golden.test.js` unchanged and passing.

## Checks (one line each)
- `node --test tests/lotm_generated_rows.test.js`: 10 tests pass (keys, provenance vs table text, rite refusal, brew-drink-act-judge-Telepathist with validators and envelope, stated causes, no wrong-potion block, civil refused, bench options, skipping the feel check is not rushing, CC brew standing beside a switching drink validates, self-brewed drink grants no clearance). Slice proof only.
- `node --test tests/lotm_commands_golden.test.js tests/lotm_pathway_rows.test.js tests/dose_process.test.js`: pass; dose_process test for the "drinking is unwritten" marker moved from Spectator to Sun 9 (the pinned shape changed on purpose).
- `npm run build`, `npm run check:arch` (no growth, no new cycles), `npm run check:rules` (PASS 0 warnings): pass.
- Full `npm test` (re-run after the review fixes): 3180 pass, 3 fail. One was my new CC-brew test, caught mid-edit by the run and fixed (passes alone, 10 of 10). The first full run had one real failure of mine (the dose_process marker test, fixed). Two (`tests/school_visitor.test.js`, provisioner and Mara) fail identically on clean HEAD 9b4b220fd in a detached worktree: pre-existing, unrelated, not touched.
- Browser `node docs/gm/dispatch/lotm-pathway-gen-2026-10-25/browser.cjs drink` (fresh origin, hidden headless Chrome, rebuilt bundle): pass, 0 page errors. Screenshots at 1920x1080 and 1536x864 (14px and 21px type) in `evidence/`. Export string import and the Export-button file re-import both pass. The funding step in the script retries because a reload can race the saved money.

## Review fixes (second commit)
- Digestion, not the free feel click, gates the clean Telepathist drink (the click only records the judgement); the rushed variant requires an undigested potion.
- A recorded switching cause now lets a CC brew in progress stand beside another pathway in `validateLotmState` (it threw before).
- Clearance counts only issued (church-allocated) ingestion, so a self-brewed drink stays "probationer"; accept and choice facts still use the wider `ingestedAny`.
- Bench item and bottling text no longer say drinking is "not yet written" for rows that now drink (`bf_collect_*` is not in the golden fixture).

## Gaps and follow-ups
- Not exercised in browser: the rushed and switching drinks (focused tests only); an old pre-change save load (focused test builds a fresh branch; the browser run did not reload a pre-change save).
- Gaps marked in the row: no Telepathist acting principle (M), no Sequence 8 digestion, no Sequence 9/8 abilities (sources grant none), Telepathist with no Spectator source is refused with a reason (no cause row), Psychology Alchemists contact not written.
- The other 21 brewable doses need an overlay each (acts, texts, digest) over this generator; Seq 7 and below are not offered. The sibling lane's ritual conditions plug in where the generator now refuses a rite.
- `dist/` and `index.html` were rebuilt locally and are not part of this commit.


## Content reconciliation B475: complete record and exact joined evidence

All35 lines were reviewed. The generator combines formula-table identity with an authored overlay and per-field provenance/gaps; it does not source-qualify every act, number, ability or ritual. The actual recorded brew→drink→act→feel→next-dose loop closes an earlier dose snapshot's drinking-unwritten marker for these two rows only. Drinking, holding and selling have separate ledger meaning; self-brewed ingestion does not create church-issued clearance. Knowledge of the free feel check is not digestion, and skipping that judgement is not rushing. Wrong-pathway and rushed causes are supported outcomes in the selected model, not a blanket permission wall or canon-perfect risk numbers.

Ten focused tests and the full3180-pass/three-fail result retain their input/time scopes: one case was caught mid-edit then passed alone; two baseline cases were reproduced separately. No clean repeated full pass follows. Browser clean-ingestion persistence does not prove rushed/switching branches or pre-change save compatibility; those have focused-only evidence. Four acts, pressure values, seeding/funding behavior and no-officer self-direction are local proposals. The funding script's reload retry is disclosed, not natural acquisition proof. Sequence8 acting/digestion/abilities, other overlays, higher-sequence rites and contact remain separately unwritten at that date. Current [PROJECT](../../../../PROJECT.md), [world pass rules](../../../WORLD_PASS_RULES.md), AD49/AD36/AD43 and optional review govern a selected current consumer. No source table, code, novel, fixture, test/build/browser or save was newly opened or run.

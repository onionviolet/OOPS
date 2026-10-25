# Dose mechanism checkpoint (DWF101, DWF102), 2026-10-25

Single build lane. Nothing committed. Rules applied: AR1-AR16, MR (one envelope over separate product logics, truth vs knowledge), UR41-UR49 (disclosure), WPR5 (authored figures labelled proposals), AD36.
Target viewport for the UI: desktop 1920x1080 and 1536x864; mobile deferred.

## Built

- `src/dose_process.js` (leaf): defineProcess, processGaps, processReady, processLedger.
- `src/hp_brewing_formula.js`: Polyjuice formula as a process row; `hp_brewing_state.settle` asks `processReady` (save slice untouched).
- `src/book_world_lotm_brew.js`: CC_BREW is a process row; `lotmBrewCommands(row, flag, texts)` generates the three shipped commands byte-identically.
- `src/lotm_formula_rows.js`: 43 rows (23 brewable, 20 inspect-only), 109 ingredients, price/tier/minute dials, ritual and route data.
- `src/book_world_lotm_bench.js`: 158 generated commands (23 rows x formula/start/collect/sell where priced, plus 80 ingredient buys), facts, assertions, lazy stock seed.
- Wiring: actions (commands, flags, facts), content (items, enrollment stock and revision), state and envelope (assertions), host (bench view, seeding), ui (bench disclosure), domain (selection port).

## Checks (one line each)

- Baseline before edits: `node --test tests/lotm_commands_golden.test.js tests/lotm_brew.test.js tests/hp_brewing.test.js tests/world_pack_hp.test.js` pass 37 fail 0.
- Old-save fixtures written with pre-change code: `fixtures/make_fixtures.mjs` (cc-brew-started, cc-brew-ready, hp-brewing) and `fixtures/cc-brew-browser-save.json` via `browser.cjs oldsave` on the pre-change bundle.
- Golden after the CC port: `lotm_commands_golden.test.js` pass (all shipped definitions byte-identical).
- `node --test tests/dose_process.test.js tests/lotm_*.test.js tests/hp_brewing.test.js tests/world_pack_hp.test.js`: pass 143 fail 0 (includes old-save fixtures finishing on new code, lazy seed on an unseeded save, honest drink reason).
- `npm run build`: ok. `npm run check:arch`: exit 0, no growth. `npm run check:rules`: PASS 0 warnings.
- Browser (headless, fresh origin, 1920x1080 + 1536x864 at 14px and 21px): `browser.cjs journey` (CC journey, save/reload/Export/Import), `compat` (old browser CC brew-in-progress save finishes; first bench purchase on that pre-change save seeds stock; reload and import keep it), `bench` (Spectator: buy formula, six materials, brew, reload and import mid-brew, bottle, hold, sell, Export file re-import). Results in `evidence/dm-*-result.json`; journey, compat and bench all passed with no page errors on the final rebuilt bundle (screenshots at both sizes in evidence/).
- Full `npm test` once at the end: tests 3173, pass 3173, fail 0.

## Gaps and open issues

- HP is verified at engine level (focused tests + fixture) only; no existing HP browser journey was found under docs/gm/dispatch, so none was rerun.
- Special orders (Seq 7-5) have a 25 percent premium and 2 lots of stock but no delay. No restock: supplier tier seeds 4 lots per ingredient once per row revision.
- Formula copies are sold at the broker desk (docks), not at Hale's bench. Seq 4-0 formulas and materials have no Tingen route (canon route text is row data).
- Brewed doses are holdable and sellable; drinking is "not yet written" for all, with the unmet rite shown as a stated loss-of-control risk. Seer was not mapped to the issued dose: it would break the "held exactly once" Seer envelope rule.
- Alternate main materials (OR lines) are not modeled; row gaps say so.
- dist/bundle.js and index.html were already modified by other sessions at start; the rebuild includes their uncommitted home_school work.

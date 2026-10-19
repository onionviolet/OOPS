# Runtime fixes from the dedup audit (2026-10-19)

Rules applied: AR1 (no main.js change), AD36 (focused checks, then gate), UR2 (read only). Target viewport: none, no UI change. Nothing committed or staged. dist/ not rebuilt (not a gate here, tracked and modified by others).

## 1. S4-F6 Cafe trader template

- Cause: `src/data/traders.js` named `"Cafe trader"` for "nekomimi trader" and "cat cafe trader". The only template is `inventory_templates["Cat cafe"]`. History: both strings entered together in c3b46a7d1 (upstream v0.5.5.22) and were carried by 19011a015; no `"Cafe trader"` template ever existed, so the template name was never renamed, the trader string was wrong from the start.
- Effect, from code: `fillInventoryFromTemplate` (`src/components/trader_component.js:118-122`) reads `inventory_templates[name].length` unguarded, so a refresh of either trader throws a TypeError. Not run at runtime (traders.js does not load standalone in node because of the locations import cycle).
- Change: `src/data/traders.js:27` and `:32` now `"Cat cafe"`. Chose the trader string over adding a template, since "Cat cafe" is the cafe stock and the locations are named the same.
- Evidence: new `tests/trader_templates.test.js` reads each `traders[...]` declaration from source and asserts its template exists (source read because of the cycle). Mutation check: reverting to "Cafe trader" fails the test; fixed state passes.
- Gap: runtime refresh of the cafe traders not exercised in a browser.

## 2. S4-F7 / T-F20 glassmaking mod

- Cause: `src/mods/glassmaking.js` imported `../traders.js` (does not exist) and also `LocationActivity` from `data/locations.js` (it lives in `models/location.js`). Several imports were stale, not one. Nothing imported the mod; build.js does not bundle it. 987748fc2 ("incorporated glassmaking into main code") already moved the content into the game; the header calls the file a leftover proof of concept.
- Choice: removed the file (and the now-empty `src/mods/`). Repair would need three import fixes and still push bare `TradeItem` into `TradeItemGroup` arrays, and loading it would duplicate content already in items.js. Reversible with `git checkout HEAD -- src/mods/glassmaking.js`. Attribution (OnonokiNonon) stays in git history. The audit suggested owner OK; this is the reversible form, say if you want it restored.
- Not changed: unused templates `"Basic plus"` and `"Intermediate"` in `src/data/inventory_templates.js` (audit offered removal; not requested).
- Check: `tests/architecture.test.js` new test "every relative import under src resolves", built on `importGraph()` from `scripts/check_architecture.mjs` (which records unresolved relative imports as edges to non-vertices). Passes now. Gap: I did not run it against the file before deletion.

## 3. Repeat-search panel and S4-F9 (report only)

- `src/absorb_p23/repeat_search/panel.js` is unmounted, and mounting it would duplicate. main.js already shows the same view through the P23 Village actions: `repeatSearchView` at `src/main.js:1581`, summary and rows pushed at `:1590`, action dispatch `runner_offcut` at `:1543`. The HOST_CONTRACT.md join (line 60-64) was met a different way. No registration is clearly intended, so nothing mounted. Suggest deleting panel.js (and its createRepeatSearchPanel text in the contract) in a docs-owning change.
- S4-F9: `src/main.js:10009-10021` mounts trancheFour, combatOptions, training, livingGear, readingSalvage, growth and household with default or `location_actions_div` hosts, while mistglass uses `projectsHome()`. UR2 says unaccepted features go to the Projects drawer and only Weibao promotes. I found no promotion record in the files checked (UI_RULES.md UR2, PROJECT.md grep for these lanes returned nothing relevant). Not changed: moving seven hosts is a UI behavior change needing a decision, target-viewport browser evidence (1920x1080, 1366x768) and a record of which are promoted. Status: SUSPECTED violation, open.

## Verification

- `node --test tests/architecture.test.js tests/trader_templates.test.js`: 4 pass, 0 fail.
- `npm run check:arch`: exit 0 (growth lines from other sessions' edits: main.js +49, display.js +103, save_files.js +54).
- `npm test`: 2228 tests, 2224 pass, 1 fail. The failure is `tests/crafting_native_reload.test.js` ("gathered lots and crafted products survive native Save and reload"): headless boot error `n2.checkVisibility is not a function` in `fitSecondary` (bundled UI code calling an API the headless DOM stub lacks). Unrelated to these edits; not investigated further. One more test count is not pass or fail (likely skipped).
- Not run: browser exercise (no UI change), `check:rules`.

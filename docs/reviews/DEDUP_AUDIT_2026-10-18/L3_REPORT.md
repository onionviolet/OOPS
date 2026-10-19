# L3 report: X4 architecture ratchets (2026-10-19)

Scope: SYNTHESIS theme X4 (S1-F11, S2-F11, S3-F9, T-F12). Rules: AR1, AR5.

## Changes

1. **Line-count growth now fails.** Cause: `checkBaseline` never compared current line counts to the baseline. It only checked that the baseline file had not changed against HEAD, so growth printed as "growth 49" and exited 0. Now `src/main.js`, `src/display.js` and `src/save_files.js` fail with "grew past its baseline". The baseline file may only shrink against HEAD; a reviewed reset needs `ARCHITECTURE_BASELINE_RESET=1`. `--shrink` also lowers line baselines. New regression test in `tests/architecture.test.js`.
2. **Baselines refreshed.** `scripts/architecture_baseline.json` lineCounts: main.js 10260 -> 10310, display.js 6664 -> 6767, save_files.js 256 -> 310. Main imports 7 -> 6, cyclic edges 297 -> 226 (`--shrink`). `tests/core_ratchets.baseline.json`: mathRandomCalls 60 -> 24, mathRandomReferences 63 -> 28, definePanelCalls floor 6 -> 23, definePanelCallers floor 3 -> 15 (worldModuleImports 23 and xorshiftCopies 7 were already at real values).
3. **Cycle cut.** `simulation_effects.js` only needed `featureBattleFacts` from `feature_expansion_battle.js`. Moved it (plus `FEATURE_SHIELD`, `FEATURE_HOOK`, `FEATURE_BATTLE_FOES`) to new `src/feature_battle_facts.js`; the battle module imports and re-exports them, so all other importers are unchanged. Largest SCC 56 -> 37 modules (the 34-module main.js SCC is unchanged).
4. **trade.js no longer imports main.js.** `trade.js` exports `bindTradeHost`; `main.js` calls it once with `commitNativeTrade, get_context, previewP23MarketPurchase, interruptP23NativeWork` (one line, hoisted functions). Behavior unchanged.
5. **main.js unused imports removed (13):** setUnlockedBeds, ENEMY_ID, LIVELIHOOD_PACK_ID, validateWorkLedger, ELEMENTAL_SETTING_DESCRIPTION, PARADISE_IDS, relayContext, referenceDeskContext, beginSociety, usesVillageClock, usesTownClock, planContinuation, titleBonuses. Each had exactly one whole-word occurrence in main.js (the import itself), none in the export list.

## Remaining cycle (further cuts not cheap)

37-module SCC around `simulation.js`, `simulation_effects.js` and the `*_facts`/`*_host` modules. Best single-edge cuts found by exhaustive removal only reach 34 (for example `body_progression -> simulation`, `lore_practice_runtime -> simulation_effects`); each needs a real provider-injection refactor. Also remaining: the 34-module SCC through main.js, plus the 2-cycles listed in S1-F11.

## Checks

- `npm test` before: 2226 tests, 2222 pass, 1 fail, 3 todo. After: 2227 tests (one added), 2223 pass, 1 fail, 3 todo. The failure is the known `gathered lots and crafted products survive native Save and reload` (crafting_native_reload).
- `ARCHITECTURE_BASELINE_RESET=1 npm run check:arch`: exit 0, growth 0 on all three files. Without the flag, exit 1 until this change is committed (baseline above HEAD), then 0.
- `npm run check:rules`: PASS, 0 warnings. `npm run build`: succeeds; dist/ and index.html restored, not committed.
- Not exercised in a browser; the trade UI path is covered only by unit tests (implemented-unverified for play).

## Gaps

- Other lanes that grow main.js, display.js or save_files.js will now fail the check on merge and must shrink or reset deliberately.
- `docs/CORE_FOUNDATIONS_SCORECARD_2026-10-14.md:28` still cites 63 Math.random calls (outside this lane's ownership).

# L2 report: mol/paradise native binding extraction (X2, one stack)

Date 2026-10-19. Branch `worktree-agent-ade1a18e0e62a2371`. Structural only (AR3, AR5, AR12): no behavior, save key, ID, exported name or registration change.

## What moved

- New `src/book_world_native_base.js` (164 lines): `createBookWorldNative(config)` returns `{calendarAt, questProjection, validateNativeMetadata, validateEnvelope, createBindings}`. It imports only `gameplay_transactions.js` and `simulation_contracts.js`, never a world file, so it adds no cycle.
- `src/book_world_mol_native.js` and `src/book_world_paradise_native.js` are now 11-line bindings. They import their own content and host (as before) and re-export the same five names each: `{mol,paradise}CalendarAt`, `{mol,paradise}QuestProjection`, `validate{Mol,Paradise}NativeMetadata`, `validate{Mol,Paradise}Envelope`, `create{Mol,Paradise}NativeBindings`.
- `src/main.js`, `src/save_files.js`, `src/book_world_paradise_carriers.js`, `tests/world_calendar.test.js` import the same names from the same paths; none was edited.

Line counts: mol_native 157 -> 11, paradise_native 157 -> 11, base +164. Total 314 -> 186 (-128). A third book world is now an 11-line file.

## Divergences (line-by-line diff after normalizing mol/paradise tokens)

| # | Divergence | Handling |
|---|---|---|
| 1 | Imported content/host symbols (`MOL_*`/`PARADISE_*`, `activeMolVisit`...) | Passed as `footprints, nativeDomain, nativeStock, definitions, activeVisit, validateCampaignState` |
| 2 | State slice `motherOfLearning` vs `bookWorldCampaign` | `stateKey` |
| 3 | Inventory namespace and location tag `book_world_mol` vs `book_world_campaign` | `ns` |
| 4 | Plan fields `molActivation`/`molNativeRequests` vs `paradise...`, command field `molStock` vs `paradiseStock` | `activationKey`, `requestsKey`, `stockField` |
| 5 | Owner count 1 vs 2 and its message ("one exact retained world owner" vs "two distinct retained world owners") | `ownerCount`, `ownerCountMessage` |
| 6 | Trade refusal text: "local crown owner" vs "campaign credit owner" (coin) | `tradeMessage` |
| 7 | Quest description text (retrieval/research vs mission extraction/payout) | `questDescription` |
| 8 | "Mol"/"Paradise" inside about 20 messages | `world` label via template literals |
| 9 | Function and export names | Re-exported per world, unchanged |

Nothing else differs; no divergence was unified silently. Literal check: every string literal of both old files appears in base plus world file (after label expansion); the only old-only literals are the three parameters in items 5 to 7.

## S2-F13 verification

True, as a stale-claim contradiction, no fix made. `feature_expansion_book_recognition.js` profile `mother-of-learning` (id line 14) has `nativeBound:false` (line 37) and `nativeWorldStatus:'unactivated-source-qualified-adapter'`; `feature_expansion_book_roster.js` profile `reincarnation-paradise` (id line 481) has `nativeWorldId:null` (line 484). Both native bindings are live: `main.js:155-156,1124,1129` create them, `save_files.js:33-34` validates their envelopes. Caveat: the campaign is optional per save, so "unactivated" may mean "not active by default"; the wording still reads as unbound.

## Checks

- Regression `tests/book_world_native_binding.test.js` + `tests/fixtures/book_world_native_golden.json` (2 tests, 47 KB golden captured from the pre-extraction code, then passing unchanged against the extraction). Per world: calendars, quest projections, register (locations, NPCs, quests, tags, descriptions), absent-campaign validate/restore/snapshot and five refusals, metadata validation, activation stage/write/publish, read, snapshot, accessor errors, an authored stock purchase with four refusals. Mol also: full restore/snapshot round trip of the accepted pending-control save (real `book_world_mol_native` slice, 69 revisions) plus five corrupted-save refusals.
- Baseline `npm test` (before): 2226 tests, 2221 pass, 2 fail (`gathered lots and crafted products survive native Save and reload...` = the known crafting_native_reload; `R51 native independent cooldowns retain a 4:1 speed ratio...`). After: 2228 tests, 2224 pass, 1 fail (the crafting one). The R51 test passed after; it looks timing-dependent and is unrelated to these files.
- `npm run check:arch`: exit 0, same output as before (reports main.js +49, display.js +103, save_files.js +54 growth, 7 main imports, 297 cyclic edges, all grandfathered).

## Gaps

- The Paradise active-campaign restore and full-envelope refusals (trade, quest, NPC) are not exercised: no Paradise save fixture exists and its host validator needs a full simulation state. Paradise active paths are covered through stage/write/publish/read/snapshot on a synthetic state. Its trade message and owner-count message are verified only by the literal check.
- Not browser-exercised (no UI or build change; the bindings run from the same `main.js` call sites).
- `architecture_baseline.json` still lists the `paradise_native -> paradise_host` and `paradise_carriers -> paradise_native` edges; both still exist, so it needs no edit.

## Other clone stacks, ranked (value / effort, estimates)

1. mol/paradise remaining layers (S1-F4): `*_host.js` (79 + 92), `*_state.js` (60 + 58), `*_actions.js`, content. Same two worlds, same conventions, so the base pattern applies directly. Effort: about 1 day for host+state, content is data and stays. Do this next.
2. `proto23_world_native.js` (186) + `feature_expansion_nested_native.js` (123): `savedCounts`, `counts`, `create*NativeBindings` are byte-identical to the base's; validators 0.8 to 0.9 similar. Needs a few more parameters (no campaign slice, different owner shape). About 1 day. Put `counts`/`savedCounts`/`encode` in a leaf first (coordinate with L1's helper work).
3. `feature_expansion_destination_native.js` (135) + `_host.js` (182) vs nested host (300): lower overlap (0.73), more world-local logic. About 1 to 2 days, higher risk.
4. `proto23_world_host.js`/`_state.js` vs mol host/state (`bodySupported` 0.95, `busyReasons`, `passage`, clock-sync loop at four sites): extract after item 1 settles the host shape. About 1 day.
5. `steam_{boh,df,lamb,oni}_*` (1,278 lines): shared `commit*Command` skeleton, presentation remap, vitals/idle guards, facts validators. A helper module with four small adapters, not one parameterized stack. About 2 days; touches simulation hooks (S3-F9), so schedule with that.
6. `book_world_paradise_carriers.js` vs `feature_expansion_nested_carriers.js` (5.4 KB, Jaccard 0.83): a carrier factory. About half a day; depends on item 2.

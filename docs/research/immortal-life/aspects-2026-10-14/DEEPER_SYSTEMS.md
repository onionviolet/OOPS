# Three deeper systems

2026-10-14. Ranked by reusable implementation detail beyond the prior cultivation/sect/roommate dossiers. New selected native bodies are under the new private notes/functions/. All are static reads, not played recipes or persistence acceptance.

## D1: Alchemy as active control with tool tradeoffs

SHOWN: NewAlchemy.AlchemyManager, TypeDef13386, tracks current temperature/progress, a target-range start, time left, disturbance speed/change time, target motion/change time, cooling/heating inputs and a cancellation token. AlchemyRecipe has65 records; AlchemyOven21; AlchemyConfig4 settings. An older18-row Alchemy table also exists and is not silently merged into the newer consumer.

UpdateAlchemyGaming at0x1807121c0 samples input, deltaTime, random disturbance changes and target-range changes. It clamps state, reverses range motion at boundaries, raises progress while temperature lies strictly inside the target band, and handles time expiration and success. Listeners receive range/time and changed temperature/progress values. Recipe and oven parameters jointly affect durations, speeds, costs and output. Shared float helper signatures are incomplete in pseudocode; exact numeric formulas need instruction/type repair before reuse.

A concrete table example, recipe35001, configures21 active seconds, target width30, manual speed45, progress speed8,50 energy,30 power,4 game hours and12 base products. Oven71001 trades20% more allowed time for20% more energy by its fields and authored description. The native combined getter for every modifier was not expanded, so these are configured values rather than a tested balance result. GameSucceed0x1807112d0 generates star-count output, samples mutation and constructs result data; GameFailed0x180711180 uses failure-result flow. AlchemyConfig names a failure product with count bounds4..8. Exact payout/cost admission and mixed success/timeout ordering need further reads.

PROPOSAL P1, crafting/ability authoring: one tool changes controllability or tolerance while another changes yield. First slice: one original recipe, two tools, inspectable input cost, active outcome and supported failure result. Verify pause/input/accessibility and save boundaries; do not force every ordinary craft into an active minigame.

## D2: Cooking as intermediate-product composition

SHOWN:83 Cooking recipes,61 CookingGame definitions,283 CookingMiddleware records,9 CookingProcessing operations,4 grades and15 level coefficients. A recipe names material inputs, ordered output steps and CompletedMiddleID. A cooking game can combine several recipe parts, has its own cost/half-quit flags, workstation/area IDs and grade thresholds. These layers are not interchangeable.

CookingManager has explicit water, oil, cutting, kneading, combining, heat and rubbish stations. MultiGamePrepare0x1804461b0 reads a game definition and builds the preparation flow. CookingPrimaryGame.ProcessFinishedProduct0x1804b8330 and0x1804b8700 match operation type and one or multiple intermediate input IDs against CookingMiddleware; they search current recipe steps before falling back to compatible outputs. CheckFinish0x1804b6ea0 looks for the configured finished intermediate among held productions. This is a transformation graph, not only a timer. Matching/fallback ordering is observed; a complete proof for ambiguous recipes and all station failures is not claimed.

For recipe37101, two authored intermediate outputs lead to completed ID M371012. Processing row1 defines8 seconds and failure intermediate M10. This shows failure as a named material state in the data; the station's exact burn/late-input consumer remains unread. Costs, mastery and restaurant reward settlement need separate consumers. Full recipes and intermediate tables are retained privately.

PROPOSAL P2, crafting/production: let an original work chain keep usable intermediate items and support more than one tool/process route. First slice: two inputs, one intermediate, one useful result, one recoverable mistake. Test consumption and custody across interruption. Preserve a comfortable ordinary/queued route where the world supports it.

## D3: Smelting with fuel, pending work and finished stock

SHOWN: SmelterRecipe3, SmelterLevel2 and Fuel4 records. SmelterData has GUID/level, remaining fuel seconds, recipe ID, pending count, finished count and seconds to the next unit. SmelterManager.SaveData0x181bad2f0 saves both instances and recipe unlocks.

BeginProduce0x181baca80 loops recipe requirements through ItemController.Change, records recipe/pending number and converts one unit's required hours to seconds. The decompiler omits some call arguments, so the exact debit multiplier and affordability admission are not claimed from that body alone. Update0x181bad3f0 budgets elapsed work against remaining fuel, uses whole-unit division/remainder and caps output against remaining work. It updates pending/finished counts and unit time and emits unit-produced events. This supports batched game-time production; the closed-game wall-clock caller is unread.

CancelProduce0x181bacc40 returns requirement quantities for the pending count, transfers already-produced stock, zeros pending/finished/progress and emits cancellation. CollectProduct0x181bacee0 transfers finished count through ItemController.Change, then zeroes only finished stock and emits collection. These distinct paths explain why completed goods, unprocessed inputs and fuel are separate ledgers. Crash/save atomicity, fuel refill and bag-capacity failure settlement remain open.

PROPOSAL P3, engine/production/persistence: give one original furnace separate fuel, committed inputs, work remaining and uncollected output. First slice: partial elapsed work, fuel exhaustion, resume, cancel and collect with exact custody. Save/reload/import must preserve each count. No universal free offline production or whole workshop rewrite is proposed.

# Fifteen deeper systems

2026-10-14. Status: PARTIAL. All results are static. **SHOWN** means inspected table, declaration, mapped native body or binary constant. **STATED** means authored description. **INFERRED** means interpretation or proposed YAIRPG routing. No game, Windows executable or personal save was opened.

Native citations below resolve to `/Users/weiwei/.codex/research/ds-immortal-life/notes/functions/<VA>.txt`. Exact signatures and type IDs are in `notes/selection.json` and `selection2.json`/`selection3.json`; schemas in `extract/application-schemas.json`; full tables in `extract/tables.json`. The manifest preserves original resources.assets path IDs and hashes. These private references contain full detail; this file paraphrases it. Current DLL/metadata match the prior pass. Generic addresses alone do not identify a managed consumer; annotations retain metadata tokens and shared aliases.

Every save statement below means a selected serializer call or schema, not crash durability, migration or a played round trip. The central aggregate writer is documented in [prior A04](../aspects-2026-10-14/ASPECTS.md). Each section names remaining gaps rather than guessing missing formulas.

<a id="d01"></a>
## D01: Crop life cycle, drought and pests

**SHOWN model/authoring:** `Crop` has 37 definitions with season arrays, elemental energy, XP, growth stages, harvest count/interval, weighted drops, seed chance, drought and pest resistance. `SeedQuality` has six quality rules; `InsectPest` supplies remedy IDs. `Info.Seed` stores source/instance IDs, star, count, grown time, pick count, drought/resistance counters, pest details and separate withered/fruiting/infested flags. `PlantLand` adds ground identity and Dry. This is persistent plant state, not just a timestamp on a recipe.

**SHOWN rules:** `Seed.WindUpAnAccount` (0x1803C2D00) advances GrownTime only while alive, uninfested, unripe and the supplied dry flag is false. It marks initial maturity at GrowthCycle and repeat maturity at HarvestInterval once a plant has been picked. A dry settlement does not advance that counter. Infestation counts down its onset counter and then resistance; depleted resistance withers the crop. `PlantLand.WindUpAnAccount` (0x1803BCF00) delegates settlement then marks ground dry and decrements drought endurance. Drought depletion only withers an unripe crop once its growth has reached the configured seedling threshold. `CropRestart` (0x1803C1FE0) clears withered/fruiting and resets GrownTime; it is not proof of a free seed or refunded harvest.

`InsectPestCompute` (0x1803C2580) tests each authored pest chance against a random float and the controller multiplier, draws an inclusive onset range using max+1, then randomly selects among qualified pest candidates. Exact harvest yield, seasonal quality coefficients and every immunity caller remain unread.

**Connections/save:** crops supply food, silk feed, honey power and magic-plant energy. `PlantController.SaveData` (0x18056FAA0) saves `PlantData`, including all lands and five probability/season coefficients. AutoWater has a deity-auto-farm guard; irrigation tools and the blessing are distinct mechanisms. **INFERRED owners:** K8/K9/K28; P01/P02/P08; production palette MS3/MS13/MT7. Adapt optional world-specific care, not new universal survival chores.

<a id="d02"></a>
## D02: Elemental growth and authored formations

**SHOWN model/authoring:** six `MagicPlant` definitions have staged five-element thresholds and directional ornament requirements. `MagicPlantDecoration` has 16 modifiers. `MagicPlantData` retains current plant plus record history; the plant stores step, days and five accumulated element totals. These stages are authored constraints, not a genetics generator.

**SHOWN rules:** `FormationAchieved` (0x180322250) parses directional requirements, partitions nearby ground into eight surrounding regions using coordinates in three-cell bands, and delegates matching to ornament data. `PlantGrowth` (0x180323220) derives elemental input from neighboring crops' ElementType/EnergyPoints and decoration modifiers. Full modifier combination is not resolved here. `Settlement` (0x18031CA90) exits at max step, increments elapsed days, adds `int(input[element] * (1 + blessingRate))` to each total, and advances one step only if **all five** current thresholds are met. It records progress and zeros all five totals after advancement. Excess is therefore not carried into the next stage in this body. The constants 1 and truncating integer casts are shown.

**Connections/save:** placement influences growth, ordinary crops become energy sources, blessings alter each element, and the handbook records fastest maturity. `SaveData` (0x18031CA20) saves `MagicPlantData` under `MagicData`. Exact formation failure feedback, every rotation and maturity harvest custody remain unread.

**INFERRED owners:** K9/K25/K28, P02/P04/P16, production ML7/MR6 and technology TG5/TG6. Generic owners exist; a dedicated spatial-input settlement contract was not located. A small original layout experiment could extend them. Do not transplant this world's elements into unrelated worlds.

<a id="d03"></a>
## D03: Silk as a care and processing chain

**SHOWN model/authoring:** `CanFangSetting` defines five feed days, one cocoon day, update hour 7, five leaves per feed, six unfed days to death and eight rack slots. `CanToJian` maps one animal to ordinary/special cocoons; `JianToSi` maps cocoons to two thread products. `SangYeConfig` maps leaf star to a quality-rate increment. `CanStateData` retains FeedDays, JieJianDays, NoFeedDays, CurrentPlusRate and state. The separate `SpiritAnimalConfig`/Cocoonery system has two spirit profiles and health/food/evolution settings; it is not silently equated with this rack controller.

**SHOWN rules:** `PutSangYe` (0x1808210C0) debits submitted quantities of item 11001 at stars 1/2/3, changes rack state, adds the quality increment and calls OnFeed. `OnFeed` (0x180358020) increments FeedDays, clears NoFeedDays and sets state 2. `SetSangYePlusRate` (0x1803582E0) adds the supplied amount and caps above at 100. `CheckCanGrowed` (0x180357A40) compares FeedDays with the five-day setting. The day state machine (0x180100F90, body continues at 0x180826...) moves fed state 2 to hungry state 1, increments NoFeedDays in state 1 and marks death state 5 at six; state 3 increments cocoon days and becomes ready state 4 at one.

**Connections/save:** leaves have competing destinations; cocoon and thread are separate products. `CanSaveData` retains racks, cocoon pot input/count and produced thread; production SaveData serializes it under `CanSaveData` (0x1808216E0). Full rare-cocoon random settlement, rack-to-pot admission and generic Cocoonery health consumers remain unread. **INFERRED owners:** K8/K9/K22, P02/P06/P08, production MS6/MS7/MX7. Care-derived quality is not heredity or offspring.

<a id="d04"></a>
## D04: Honey remembers the surrounding plants

**SHOWN model/authoring:** `HiveConfig` configures range 2, minimum total power 200, maximum 240, harvest time 7 and three honey outputs. Five `HoneyPlant` entries define power contributions; seven `Honey` types have required plant IDs, minimum distinct types and per-type power. Twenty-five `HoneyStar` entries carry three output quality-weight arrays. `HiveSaveData` separates per-hive plant-power dictionaries from retained reward arrays.

**SHOWN rules:** `CheckTotalReach` (0x1806CFE50) compares accumulated total against the hive's configured minimum. `CheckSpHoneyConditionCompleted` (0x1806CFB70) tests specific plant requirements plus a remaining distinct-type count, subject to minimum power for each qualifying type; the -1 list sentinel permits unspecified types. `CalHoneyProduce` (0x18081BAF0) first checks total and special eligibility, chooses a qualifying plant/type and uses daily-quality helpers to build three reward items, then records them through OnProductHoney. Exact tie choice and the full HoneyStar selection formula remain unresolved. Configured HarvestTime is not alone proof of the callback's exact recurrence.

`HarvestHoney` (0x18081ECE0) checks bag capacity against the reward array, credits one per reward entry, samples a possible extra through the deity double-yield check, and then clears the hive's harvested state. The capacity check is not a proof that the doubled basket is preflighted; that edge remains open.

**Connections/save:** farm layout changes product identity as well as quantity; harvesting and stored output are separate. Production SaveData writes `HiveSaveData`. **INFERRED owners:** K9/K25/K28, P02/P04/P16, production ML7/MS13. Generic owners exist, but no dedicated accumulated spatial-input recipe contract was located.

<a id="d05"></a>
## D05: Automatic versus manual workstations

**SHOWN model/authoring:** six `ProductionTool` definitions nest recipes with item/quality inputs, output count, XP, default unlock and either elapsed Time or PPExpend/PressTime. There are Auto and Press interactions. The separate four-entry root `BuildProduction` table is not the same as all nested recipe records. `ProductingSaveData` retains recipe, building instance, remaining hours, callback ticket, stack, committed expense data, reward items and completion flag.

**SHOWN rules:** `StartWork` (0x180821E30) stages a per-instance job, loops input changes and uses a game-time callback for the elapsed route. For the automatic route, duration is `int(stack * recipe.Time * 3600)` game seconds; the manual route retains `stack * PressTime`. Each requirement is debited by `stack * requiredCount` through ChangeGetStar and retained with the selected quality. Whole-basket affordability and rollback remain caller questions. `WorkingComplete` (0x180822940) marks the job complete and zeros remaining time; it does not immediately collect goods. `Harvest` (0x18081F140) generates `stack * ProductCount` quality rolls, groups items by star, retains the resulting reward array, samples a double-product blessing, checks capacity, transfers rewards and grants working XP. It removes the job after successful collection. This body rebuilds the base quality basket and samples the blessing before CheckAdd on each invocation; storing RewardItems does not by itself freeze retries. Whether the actual UI permits another invocation after refusal remains unread.

**Connections/save:** farm goods become ingredients, food or trade output; recipe unlocks are independent from building ownership. SaveData (0x1808216E0) refreshes remaining timers and stores jobs/unlocks. `LoadWorkingDatas` (0x180820630) rebuilds callbacks for eligible automatic jobs using saved hours times 3600. This is game-clock reconstruction, not wall-clock offline production. **INFERRED owners:** K9/K13, P01/P02/P08/P13; production MS6/MS7/MV5, technology TL3/TG3.

<a id="d06"></a>
## D06: Workshop fabrication, collection and cancellation

**SHOWN model/authoring:** `Build` has 16 definitions and `Decoration` 760. Build/decor blueprints feed separate unlock lists. `WorkShopItemState` stores those lists plus remaining time, current item ID and batch count. `BuildStart` (0x180504E40) records the selected job, changes its preview and consumes each requirement multiplied by requested batch size. Requirement star -1 takes the any-quality branch; full selection ordering remains unread.

**SHOWN rules:** `BuildComplete` (0x180504A30) zeros remaining time, grants per-item working XP times batch and changes the displayed object to its completed form. It leaves the item awaiting collection. `GetItem` (0x180505E20) calls ItemAdd and retains the job on failure, with a capacity message; successful collection resets item ID/count. `CurrentBuildingCancel` (0x1805050A0) clears remaining time and item ID and removes the preview. `ReturnResource` (0x180506B70) separately checks capacity and returns configured resources. Its observed loop uses per-recipe amounts. This pass has not proven the batch caller or that every cancel invokes this return operation, so a full batch-refund guarantee is not established.

**Connections/save:** designs, inputs, working progress and collected furniture/buildings are separate states. SaveData (0x180506DF0) writes `WorkShopItemState` under `WorkShopData`. Remaining gaps: exact stamina cadence, complete timer resumption and batch cancel/refund caller. **INFERRED owners:** K9/K25, P01/P02/P04; production ML3/ML6/MS8/MS12, technology TL2/TL3. Source code order is a useful caution for YAIRPG transactions, not a tested duplication exploit.

<a id="d07"></a>
## D07: Specialist errands freeze a result before return

**SHOWN model/authoring:** three `Delegation` specialist rows contain 27 destinations. A point provides unlock expression, WorkTime, weighted reward packages and presentation text. `WorkingState` stores NPCID, point ID, remaining time, callback ticket and rewardIndex, keyed by NPC in DelegationSaveData.

**SHOWN rules:** `StartWork` (0x180638AE0) schedules WorkTime times **86400** game seconds, builds package weights, selects through RootIndexWithCoefficients and stores the chosen index with the job. Thus the configured 3..9 units are days on this route, resolving the prior unit gap. `Harvest` (0x180638100) reads the retained point/index, builds its basket, checks bag admission, transfers its items and clears work state on success. It does not choose a new package at this point. `CancelWork` (0x180637890) removes the NPC entry; this body does not issue a reward. Complete schedule/availability and payment admission still need callers.

**SHOWN save:** Save (0x180638A60) refreshes remaining times and stores DelegationSaveData. WorkingState.RefreshRemainTime (0x18064AC80) explicitly divides callback seconds by 3600 before storing the remainder. `LoadWorkingDatas` (0x180638700) rebuilds callbacks using saved remaining **hours** times 3600. Starting in days and saving remainder in hours are compatible but distinct units. No personal save was read to test it. Exact callback disposal on cancel, full-bag retry and atomic reward publication remain open.

**INFERRED owners:** K6/K7/K8/K5, P06/P08/P13/P18; characters duties and production MX6/MS5. Keep a selected outcome on the job so reopening a screen does not reroll it. This source establishes authored specialists, not a funded autonomous disciple economy.

<a id="d08"></a>
## D08: Process-specific blessings and long effects

**SHOWN model/authoring:** eleven `Pray` process families choose among three buff IDs. `GodnessLevel` has 12 progression rows. `GodnessSaveData` retains level/XP/points, selected buff families, per-family levels/unlock days, today flags and extra automation/energy days. The live rate dictionary is distinct from that record.

**SHOWN rules:** `UseBuff` (0x180544CA0) selects the authored buff ID from requested level or saved family level, records the selected family and dispatches an add-buff command. `GetCriRate` (0x180543E60) reads the current GodnessLevel row's CriRate. This narrows the prior conflict with GlobalSettings.PrayBaseCriticalRate, but does not prove every prayer caller uses this getter. `GetRate` (0x180543EA0) reads the process-keyed dictionary. `CheckDoubleRate` (0x180543B90) returns false for nonpositive rate; otherwise it tests **Random.Range(0,100) > 100 - 100*rate**. Integer RNG and strict comparison matter. Do not replace this with a mathematically ideal Bernoulli draw or infer an additive combination with critical chance. Constants 100 and 1 were read directly from the matching PE.

`BattleBuff.UpdateDay` (0x1807B9E50) subtracts one unless configured lifetime is -1; `IsFinish` (0x1807B9FE0) checks remaining time <=0 for nonnegative configured lifetime. This closes the decrement-unit subquestion, not the injury's initial-day/removal ordering or medicine route.

**Connections/save:** crops, honey and manufactured output call separate yield processes; magic plants use a rate increase. Godness Save (0x1805446E0) serializes its record. Full stacking, expiry callers and RNG seed/pity remain unread. **INFERRED owners:** K3/K21/K22, P17/P09; ability effects. Offer process-specific choices without forcing worship or cultivation.

<a id="d09"></a>
## D09: Pet growth unlocks carrying and selling

**SHOWN model/authoring:** one `Pet` definition contains six levels, 15 food/quality entries and shape data. Level thresholds are 0/180/270/410/600/840; bag sizes progress from 0 to 24 and then 40. SellTime fields are 5/3/2/2/2/0.05. These are configured values; their complete travel-time caller remains unread. `Info.Pet` retains level, growth, state, Satiety, sale start time, bags and shape unlocks.

**SHOWN rules:** `Eat` (0x1807CC090) finds exact food ID/star, adds positive configured growth where still eligible and marks Satiety true. Food consumption is not inside this model method. `CanLevelUp` (0x1807CCB80) checks growth against next threshold and refuses the configured max level; the actual promotion caller is separate. `ToSell` (0x1807CC7C0) records current game time and state 3; `SellBack` (0x1807CC2E0) sets state 4. `Sell` (0x1807CC2F0) reads each bag item's matching star sale value, removes sellable entries and returns to state 2. Full currency payout arguments and enhanced-item restrictions are not established here. `PetRoundDatUpdate` (0x180564040) clears Satiety; its name alone does not prove wall-day cadence.

**Connections/save:** a companion changes logistics, not merely combat stats. PetController.SaveData serializes the pet list and its bags. The later-level description says feeding ceases to be needed for selling; admission needs its own caller. **INFERRED owners:** K6/K8/K9, P06/P08/P18; companion roles/care/services and production MS5/MX6. No offspring, bloodline, independent trading AI or autonomous goals established.

<a id="d10"></a>
## D10: Home upgrades alter access and capacity

**SHOWN model/authoring:** five `Room` levels define requirements, optional condition expression, hours, rewards as command arrays, prefabs/nav data and recovery values/caps. Sixty `RoomStyle` entries are a separate style catalogue. `Info.Room` stores level and remaining time; placed buildings and decoration have separate owners.

**SHOWN rules:** `RoomUpgradeStart` (0x18052D1F0) looks up next level, schedules `int(Time * 3600)` game seconds, stores the same duration and calls SpendItem. The complete affordability admission is outside this body. `RoomUpgradeCompleteCallBack` (0x18052CEB0) upgrades the room and executes the new level's UpgradeRewards, then emits completion. Row 2 opens ground areas; the initial row activates an entrance. Housing therefore changes usable space, not just a title. Higher room recovery fields are configured, but the bed/recovery consumer is unread. `RoomUpgradeUpdate` shares a no-op body at 0x1802B31E0; its method name is no ticking proof.

**Connections/save:** roommate access requires top-tier housing through prior triggers; furniture and ground availability link home to production. SaveData (0x18052D5A0) writes RoomData. BuildingController separately serializes buildings. Decorate's first JSON value describes placed instance records and currentID, followed by 399 unparsed characters; it is not the 760-row decoration definition table. Exact placement collision, rotation, rollback and load callback behavior remain unread.

**INFERRED owners:** K25/K8/K9, P04/P07/P16; production ML6/ML7/MS10, characters household. A useful room changes a real service, place or recovery route. Preserve optional dwelling choices and supported departures.

<a id="d11"></a>
## D11: Fixed stock versus rotating conditional stock

**SHOWN model/authoring:** nine `Shop` definitions provide hours, refresh cycle, currency, normal/special stock and price variation. `ShopData` retains shop instances and unlocked sells; each shop tracks refresh times and counts. The separate 94-row `NoFixedShop` table chooses package types/weights; NoFixedItem/NoFixedItems supply item pools and buy restrictions. `NoFixedShopData` stores resolved shelves, unlocks, once records and seen signs.

**SHOWN rules:** fixed `CheckRefresh` (0x18046CA70) creates shop state or checks its saved refresh time, resets sold/special counters and special grids, and records current time. `ShopController.Buy` (0x18046C970) only emits a purchase event and credits the item in this body. It does **not** prove payment, affordability or stock admission by itself; UI/caller settlement remains open.

Rotating `CheckRefresh` (0x1803373B0) preserves shelves until the refresh helper permits replacement. `RefreshSell` (0x1803382B0) selects weighted packages, filters restrictions using records such as fishing size, membership and monster discovery, then saves resolved items/stock. Rotating `Buy` (0x180336B90) clamps requested count to stock, rejects negative price, checks full currency cost and bag space, credits the goods, debits positive price times count, reduces stock and records source-specific once limits. Crash atomicity is not shown by this order.

**Connections/save:** discovery and institutions change available goods; stock and knowledge are separate. Both controllers serialize their own records. **INFERRED owners:** K8/K9/K11, P04/P18/P16; means and production MS2/MS5, technology TG8/TG9. Keep source once restrictions local, never universal YAIRPG limits.

<a id="d12"></a>
## D12: Seasonal procurement orders

**SHOWN model/authoring:** 64 `OrderTask` rows specify season, item/count, token reward and order type. OrderTaskData stores selected OrderTaskState IDs and submission flags. Example row 1 requests five of item 11006 for 300 configured MeiHuaCoin. Exact token identity comes from the shared item static, not its displayed name alone.

**SHOWN rules:** `RefreshOrder` (0x180414570) separates candidate lists by current season and order type, picks candidates randomly and removes selected rows from its working pool. The exact number of offers per branch and all special-order filtering remain qualified. OnSeasonChange invokes the refresh surface. `Submit` (0x180414AD0) finds the retained order, marks it submitted, subtracts ItemNum and adds a positive configured reward. This body does not recheck “already submitted” or inventory affordability. That is a concrete admission gap for a future caller read, not proof that the playable UI allows double submission.

**Connections/save:** orders create an alternative sink for farm output and a reason to preserve stock rather than sell immediately. SaveData (0x180414A60) writes OrderTaskData. Seasonal replacement is different from rerolling on every view. No endogenous economy or changing NPC demand simulation is established.

**INFERRED owners:** K8/K9/K28, P02/P10/P18; production MS10/MX9 and technology TG9. A bounded YAIRPG order should quote inputs and real buyer capacity, admit once per accepted transaction, retain rejected stock and allow later independently funded orders. Source limits and menu refresh are not a universal content cap.

<a id="d13"></a>
## D13: Barter can grant knowledge instead of a physical object

**SHOWN model/authoring:** ten `ExchangeShop` roots nest exchanges with type, target ID, unlock state and multi-item costs. Types include recipes/formulas, blueprints, room styles and goods. For example, an authored formula exchange requests 25 units of an ingredient with star -1. That is a configured basket, not a proven full debit.

**SHOWN rules:** `ExchangeItem` (0x180497730) branches by exchange type. The recipe branch looks up the target item's command list, checks individual command executability and executes it; style exchange adds a RoomStyle; ordinary goods use ItemAdd. A goods-limit branch checks and updates retained counters. Seen/new-sign state is cleared separately. These different result types explain why acquiring “a recipe” need not create a consumable recipe item. This method has no complete demonstrated basket debit; UI/caller payment and command failure rollback remain unread. Do not call these exchanges atomic or free.

`OnSeasonChange` (0x1804984E0) resets relevant counters for eligible exchange records, while one-time/learned states have separate guards. The exact policy for every subtype remains open. SaveData (0x180498680) serializes ExchangeShopData.

**Connections:** production unlocks, crafting knowledge, style ownership and item custody have different destinations. **INFERRED owners:** K9/K11/K7, P03/P04/P16/P18; technology TG2/TG10 and production MS2/MS7. Preserve discovery, known method, permission, tools and current input affordability as separate facts. This source does not establish invention, research uncertainty or teaching lineage merely by exposing unlock commands.

<a id="d14"></a>
## D14: Fishing separates anticipation, catch control and records

**SHOWN model/authoring:** 59 fish entries, 11 points, three rods, nine QTE definitions and an eleven-key rule object. Points carry candidate catches; fish specify presentation/QTE and size rules. TrialRules weights for 0/1/2/3/4 feints are 700/2700/2700/2700/1200, summing to 10000. Feint intervals and real-bite timing are separate authored values.

**SHOWN rules:** `GetTrialCount` (0x1805F3FD0) builds weights from TrialRules, chooses WeightIndex and returns that row's Count. These weights support a normalized 7/27/27/27/12 percent interpretation only if the helper uses ordinary proportional selection; its complete RNG endpoint proof is not included. `FishCreat` (0x1805F3E50) and its special counterpart (0x1805F3DA0) create different controllers from pond-selected entries. `FishRecord` (0x1805ECBD0) inserts a first size or replaces a record when new size is **greater than or equal to** the old one, returning a record flag. Equal sizes qualify in this body, so “strict personal best only” would be an incorrect paraphrase.

**Connections/save:** size records feed rotating-shop filters; fish are pet growth inputs and delegation rewards. Fishing SaveData (0x1805ED180) stores FishingData, including record history. Rod/QTE modifiers, exact catch probability, full reward debit/credit and special-counter persistence remain unread. **INFERRED owners:** K9/K13/K11, P09/P11/P04; gathering and production MS1/MS3, companion care. Records are reusable earned facts, not merely trophy text.

<a id="d15"></a>
## D15: Trigger admission, scheduling and memory

**SHOWN model/authoring:** 413 `Trigger` definitions hold default validity, expression, limit, interval, commands and special-handling flag. `TriggerInfo` stores ID, TriggeredCount, LastTriggerTime and IsValid. This is distinct from proximity-trigger state and dialogue choice history.

**SHOWN rules:** `SetTriggerInfos` (0x1807AA490) joins definitions to retained state, creates missing entries with count/time zero and configured validity, excludes the special-handled flag, and adds only entries below their finite limit or with limit -1. `Update` (0x1807AA770) budgets checks with Unity deltaTime and checks one cursor entry per interval. It wraps the cursor, skips invalid entries, checks minimum game-time interval after a previous trigger, evaluates nonempty conditions through GameExpression.Parser, then dispatches GameCommandHelper.Exec. After dispatch it increments count and records game time; an exhausted finite limit removes the pending entry. The elapsed comparison uses a shared TimeData operator; exact interval display units and all asynchronous completion/failure semantics remain open.

`Save` (0x1807AA3C0) writes TriggerManager.Data under `Trigger`. Thus the earlier 22 NPC-advancement trigger rows now have a native admission/dispatch/history path, but this does not prove durable exactly-once settlement if a command partially fails before a save.

**Connections:** quests, letters, schedules, housing and NPC advancement share this authored event route. **INFERRED owners:** K12/K23/K29/K32, P10/P12/P19/P24; characters and authoring. Eligibility, scheduling, effect execution and remembered closure belong to separate stages. A source TriggerLimit is local content data, not a universal solo-player restriction.

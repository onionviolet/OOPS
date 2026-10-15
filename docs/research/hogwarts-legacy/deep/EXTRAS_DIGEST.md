# Extra systems digest

2026-10-14. Steam build 20773316. SHOWN is installed data or decoded code; STATED is shipped text; INFERRED is a join. These are reference findings, not accepted YAIRPG changes. Full shipped tables, including the first pass's useful rows, are in [private tables](../private/tables/ship/SCHEMA.json); [private README](../private/README.md) indexes text, decoded assets and native evidence. No user save, game launch or transaction was used.

## D19: QL1, input and accessibility

STATED: the shipped interface dictionary names separate spell-minigame options 1..4 and its start action, a minigame auto-solve input, subtitle controls, audio visualization, high-contrast/color options, camera-shake controls and an arachnophobia mode. Exact lookup examples are `SettingsControl_UMGSpellMinigameOption1`, `InputAction_Minigame_Autosolve`, `AudioVisualizer_desc`, `Menu_CameraShake_desc`, `Menu_Subtitles_desc` and `Menu_ArachnophobiaMode_desc`. A menu label does not prove every minigame supports auto-solve or every difficulty exposes it.

SHOWN: selected ControlMapper assets separately define a timed conversation-cancel button, Stupefy quick input and analog Stupefy input. Their full properties are preserved. `UIInputActions` supplies 24 records, but is not a complete inventory of gameplay bindings. Reachability, rebinding and the exact hold/toggle timing were not exercised.

Private: [complete interface text](../private/text/MAIN-enUS.json), [UI action table](../private/tables/ship/UIInputActions.json), [selected input exports](../private/decoded/final/receipts.json). Proposal: refine LP1/LP2 so a lesson's evidence does not depend on one physical input technique.

## D20 and D22: QL2/QL5, shops and purchase alternatives

SHOWN: the data chain is `VendorStocks.VendorID,ContainerID,Weight,MinItems,LockID` to `LootCategories.CategoryID,TypeID,ContainerRollsLow,ContainerRollsHigh,RollType`, then `LootContainerContents.LootCategoryID,ContainerID,ItemRollCount,RequiredUnlock,NPCRangeLow,NPCRangeHigh`, then `VirtualContainerContents.VContainerID,ItemID,ItemQuantity,LockID` and `ItemDefinition`.

For example, PercivalPippin's stock points at `VEND_PercivalPippin`. That category has VendorStock type, 4..5 rolls and RandomByWeight. Its ingredient and finished-potion entries include `ITEM_AMFillPotion` with ItemRollCount 2. Static stock generation fields and `VendorStocksDynamic.AdjustedWeight` are distinct from a verified restock clock. Zero random weights must not be interpreted as impossible stock without tracing the generator's special cases.

| ItemDefinition ID | EconomyValue | SellPrice | Sellable |
|---|---:|---:|---:|
| AMFillPotion | 500 | 0 | 0 |
| WoundCleaning | 100 | 0 | 1 |
| Moonstone | 20 | 0 | 0 |
| Recipe_AMFillPotion | 1200 | 0 | 0 |
| Recipe_Transfiguration_Sanc_PotionStationT | 2000 | 0 | 0 |

SHOWN: these are stored values. They are not a verified final checkout formula, discount stack or sell receipt. Sellable and SellPrice are independent fields; a true flag with zero price is not proof of a useful gold faucet.

SHOWN: finished potion, ingredient and recipe container families coexist. `PotionDefinition.LockID` and ingredient/time fields separate having a recipe from buying a dose. Station placement recipes and conjuration unlocks are another layer. INFERRED: buying a usable dose can substitute for production in cases whose vendor stock and recipe chains both join. It does not automatically grant the recipe, a workstation, ingredients or recurring production. Reachability and all lock paths remain qualified.

Private: [vendors](../private/tables/ship/VendorStocks.json), [loot categories](../private/tables/ship/LootCategories.json), [stock selection](../private/tables/ship/LootContainerContents.json), [container contents](../private/tables/ship/VirtualContainerContents.json), [item prices/flags](../private/tables/ship/ItemDefinition.json), [recipes](../private/tables/ship/PotionDefinition.json). Proposal: refine LP3 with a real production-versus-purchase option where both consume finite resources.

## D21: QL3, appearance and strength

SHOWN: 465 `GearAppearanceItems` records contain appearance IDs. `GearItems` has 1,124 rows with gear ID, slot, appearance reference and ability count. `GearPowerLevels` separately supplies level-dependent power ranges and expected gear level; `GearPowerStats` has the numerical multiplier/reduction lookup. Trait recipes and stat-upgrade materials are further tables. INFERRED: appearance identity, gear instance strength and technique-altering traits can be modeled independently. Merely choosing a different appearance ID is not evidence for a changed damage multiplier.

The complete transmog UI, item-instance replacement behavior and every exceptional appearance unlock were not traced. Private: [appearance IDs](../private/tables/ship/GearAppearanceItems.json), [gear definitions](../private/tables/ship/GearItems.json), [power stats](../private/tables/ship/GearPowerStats.json). Proposal: refine LP7 with clear appearance versus capability ownership.

## D10/D14/D23/D24: QL4/QL6/QL7/QL8

| Later question | Answer and boundary |
|---|---|
| QL4, noise | SHOWN: cast/impact noise references join a six-row radius/intensity table. Target selection, sight/hearing profiles and awareness curves are separate. See [AI digest](AI_DIGEST.md), D10/D11. Native noise-event propagation remains OPEN. |
| QL6, schedule overrides | SHOWN: add, replace and remove tasks have explicit typed argument signatures and hundreds of mission uses. See AI digest, D14. Full override-stack arbitration and runtime restoration remain OPEN. |
| QL7, retained/transient data | SHOWN: `StatsDynamic.StatID,Value,Transient` declares a transient flag. `EnemyPersistenceDynamic` has identity, health, position, level and dead-spawn policy; `ScheduleDynamic` has character/active key; conversation, economic expiry and world-event dynamic schemas retain different categories. First-pass wait logic has restore/checkpoint callbacks. These empty templates and callbacks identify intended distinctions. They do not prove the serializer's whitelist, save durability, offline advancement or actual user-save contents. |
| QL8, localization joins | SHOWN: item/perk/mission IDs or their text-key columns join MAIN; graph DialogueID joins SUB. Both dictionaries are fully decoded and retained with original keys. CharacterID on a decoded line is a stronger speaker binding than splitting its key prefix. Missing keys, unused variants and missing graph/effect joins stay explicit. |

Private: [schema](../private/tables/ship/SCHEMA.json), [transient stats template](../private/tables/ship/StatsDynamic.json), [enemy persistence template](../private/tables/ship/EnemyPersistenceDynamic.json), [joined dialogue records](../private/text/dialogue-lines.json). Proposals: LP5/LP6 get explicit restoration boundaries; LP8 gets known, meaningful counters rather than a hidden completion checklist.

## D25: economy faucets and sinks

SHOWN: 20 MissionRewards rows award the internal currency item `Knuts`. There are 53 currency-bearing VirtualContainerContents rows. These include nested/alternate containers and are not 53 unique reachable gold sources. Enemy drop references, loot categories, weighted container selection and mission conditional rewards are separate acquisition paths.

SHOWN: ItemDefinition economy values support purchase costs; recipes, finished consumables, ingredients, gear and room plans are distinct purchase families. Materials for placement, plants, potion inputs, beast products, gear traits and upgrades are additional sinks or transformations. A Moonstone recipe cost is not a gold debit. Full reward tables and recipes were preserved privately.

OPEN: the complete merchant price/resale algorithm, discounts, any native respec currency cost, restock cadence, exact gold supply reachable through all map actors and whether every declared sellable family actually pays currency. No infinite-gold exploit or exhaustive balance-sheet claim follows from table presence.

Private: [mission rewards](../private/tables/ship/MissionRewards.json), [all containers](../private/tables/ship/VirtualContainerContents.json), [item economy](../private/tables/ship/ItemDefinition.json), [trait costs](../private/tables/ship/GearTraitRecipeDefinition.json), [stat upgrade costs](../private/tables/ship/GearStatUpgrade.json). Proposal: refine LP3/LP7 using distinct money, material, capacity and unlock costs.

## D26: quest-step grammar

SHOWN: `MissionTaskTypes` has 155 rows, of which 104 have a nonzero IsAction. Each task declares up to eleven typed keywords plus `StepEvaluationIgnores`. `MissionSteps` has 15,886 rows with MissionID, numeric Step, TaskTypeID, Flags, StepNickname, GotoStepNickname, typed argument slots, journal/objective/failure keys and TaskUID. These are structured instructions, not a prose quest checklist.

Examples: `EvalStat` takes StatID, comparison, integer and progress-display policy; `SetStat` takes set-operation, integer and StatID. Schedule overrides have their own signatures. Conversation results, prerequisite missions, proximity, inventory/locks, story events and rewards are distinct task families. `GotoStepNickname` supplies named control-flow destinations. Grouped step numbers and Flags affect flow, but their full native scheduler semantics were not reconstructed. Do not interpret every adjacent row as a strictly sequential blocking task or every bit as a proved branch polarity.

Counts for common uses include EvalProximity 1,085, EvalAddBeacon 1,027, EvalMissionComplete 993, EvalStat 697, PlayDialogue 661 and SetStat 591. Counts include development and subordinate mission records. Full rows, flags, branch destinations and text keys are preserved for future consumer work.

Private: [typed task grammar](../private/tables/ship/MissionTaskTypes.json), [complete steps](../private/tables/ship/MissionSteps.json), [quest metadata](../private/tables/ship/MissionDefinition.json). Proposal: refine LP2/LP5 with explicit action/evaluator/branch/reward records, scoped to one real lesson route.

## D27: world events and encounters

SHOWN: `Levels/WorldEvents/DataAssets/DT_WorldEventDataTable.uasset` has 85 rows. Each can declare production status, soft world asset, simultaneous-instance cap, persistence/stage policy, repeatability, activity coexistence, event/locator cooldowns, spacing policy, selection chance, required/denied location descriptors, start trigger and conditions. Archived assets and non-final production states exist, so 85 is not a live event count.

SHOWN: parsed conditions include Spring-only; a negated set of rainy weather definitions; morning 07:00..11:00; and active/inactive mission-state checks for a selected mission ID. `BP_WorldEventLocator` is also decoded. INFERRED: candidate eligibility, weighted selection, streaming location and persisted completion are separate concerns. Complete director iteration order, roll normalization, respawn timing and every event's reachability remain OPEN.

SHOWN: encounters also have a separate SQLite grammar. `EncounterInstance` has 1,649 rows with world/group, score range/cap, enemy count/status/level caps and position. `EncounterSpawnZones` has 1,745 rows with encounter link, min/max count, card costs, ranged/melee permission, size, spawn type and static identity. Inclusions/exclusions constrain candidates; EnemyDefinition.CardScore supplies a related budget input. `EncounterScoreModifier` has player/encounter difficulty offsets. These are not proof of the director's exact random sampling or a count of unique random encounters.

Private: [complete world-event export](../private/decoded/final/receipts.json), [encounters](../private/tables/ship/EncounterInstance.json), [spawn zones](../private/tables/ship/EncounterSpawnZones.json), [budget modifiers](../private/tables/ship/EncounterScoreModifier.json). Proposal: a bounded situation selector with real place/state eligibility, cooldown and persistence, not an everywhere-at-once random event list.

## D28: difficulty is more than health

SHOWN: `EnemyDifficultyScaling` stores the following independent inputs. Their complete consumer order is not assumed.

| Level | TicketScale | DamageScale | HealthScale | ParryScale | PerfectParryScale | ProtegoDeflectCount | ProtegoDamageAdjustment | ProtegoCooldownTime |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Story | 3.5 | 0.2 | 1 | 5 | 5 | -1 | 1 | -1 |
| Easy | 1.75 | 0.65 | 1 | 3.5 | 3.5 | 6 | 0.25 | -1 |
| Medium | 1 | 1 | 1 | 1 | 1 | 3 | 0 | 10 |
| Hard | 0.75 | 1.3 | 1 | 0.6 | 0.6 | 2 | 0 | 0 |

ProtegoDecayRate is 20 in all four rows. Negative values are sentinels until their consumer is traced. EnemyVulnerableDamageMods, subtype tickets and encounter-score offsets add other difficulty-dependent controls. The inspected difficulty table has no XP multiplier column. That alone does not establish equal XP in every mode. See [XP](XP_DIGEST.md) and [combat](COMBAT_SHIELD_DIGEST.md) for the traced consumers and remaining limits.

Private: [difficulty rows](../private/tables/ship/EnemyDifficultyScaling.json), [vulnerability modifiers](../private/tables/ship/EnemyVulnerableDamageMods.json). Proposal: tune meaningful timing, coordination and counterplay separately from health inflation; do not copy Legacy's numbers into YAIRPG defaults.

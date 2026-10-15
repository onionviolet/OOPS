# Rune Factory 5 aspects, 2026-10-14

Static installed-build evidence only. Lane status: PARTIAL. SHOWN means fields or asset values read, not gameplay observed. No game or saves were opened. Source tables are in master bundle `382aa2501e16ef256258fc102a8fcea5.bundle`; English tables/index in `2a7ffd6c74027741cd44253e7638237a.bundle`; English event pack in `e5a7b3a52fcb2b3e585bf6f3e9e93ff2.bundle`. Class definitions are in work-area `extract/classes/`. Full private preservation is linked from the main REPORT.

## A01: Dialogue and conversation

Status: PARTIAL. SHOWN: event predicates, gift preferences, choice/gold/conditional command names and saved talk/refusal state. English event pack and all offsets saved. UNREAD: binary commands and exact dialogue branches, including a paid/failable choice. No prose transcript has been fabricated.

Sources: `SubEventData`, `EventUnlockData`, `NpcStatusDataTable`, `AdvIndexData`, `ScriptWork`, `AdvMain`.

YAIRPG: P19 dialogue owner: retain meaningful attempts independently of affinity; use current scoped Ink host.

## A02: Narrative delivery

Status: PARTIAL. SHOWN: character/flag/step/text-ID arrays, scenario talk masks and grouped event script references. Story scheduling and closure are INFERRED until the event readers and pack commands are decoded.

Sources: `UILoveEventConvTextData`, `UIMainEventConvTextData`, `UISubEventConvTextData`, `ScenarioTalkData`, `EventFlagProgressData`, `SeriousEventScriptsData`.

YAIRPG: Characters/world-events owner: keep event prerequisites, active step and remembered result separate.

## A03: Implementation architecture

Status: COVERED. SHOWN: Windows Unity IL2CPP, metadata 24.4; Addressables catalog, ScriptableObject-style tables, action/skill managers, helper state controller, separate save owners. 12,898 recovered types, 4,892 definitions in selected game TypeDef range; 280 master data objects read. The type range is not an assembly count. Native methods and whole tick/event topology remain unread.

Sources: `GameAssembly.dll`, `global-metadata.dat`, `StreamingAssets/aa/catalog.json`, `master bundle 382aa2501e16ef256258fc102a8fcea5.bundle`, `SkillManager`, `FarmSupportMonsterController`.

YAIRPG: ENGINE_AUTHORING: keep definition IDs, instance state and text resources separate; reuse current domain reducers.

## A04: Save and persistence

Status: PARTIAL. SHOWN: binary writer entry points, versioned readers 0000..0007, header version/options and footer lengths/sum. Keyed item source and upgrade provenance coexist with ignored calculated-stat properties. Relationship records preserve refusal, talk, gifts and pending date. MessagePack formatters exist. Exact byte format, encryption, corruption handling, migration and roundtrip are UNREAD. No saves accessed.

Sources: `RF5SaveData`, `RF5ItemData`, `EquipItemData`, `NpcSaveParameter`, `NpcDateSaveParameter`, `SaveDataHeader`, `SaveDataFooter`, `SaveDataManager`.

YAIRPG: Save review owner: retain causal item inputs and pending social state under an explicit content/rule revision; do not copy donor wire format.

## A05: AI and NPC behavior

Status: PARTIAL. SHOWN: two sampled NPC schedules keyed by time/weather and helper work phases/target fields; master behavior tables preserved. Autonomous work routing and stop rules are INFERRED from method names. Full schedule corpus and behavior consumer bodies are UNREAD.

Sources: `NpcLifeCycleTable Date_001 and Def_000_h1`, `FarmSupportMonsterController`, `FarmMonsterWorkState`, `FriendNPCBehaviorDataTable`, `MonsterBehaviorDataTableArray`.

YAIRPG: P01 work/UI owners: assignment, phase and receipt are different facts. Avoid a new population simulation.

## A06: UI and information design

Status: PARTIAL. SHOWN: separate localized names/descriptions, stat text formats, event-summary references and upgrade UI class names. Screen arrangement, keyboard access and feedback visibility are UNREAD because no game was run.

Sources: `SkillUINameData`, `SkillUIDiscriptData`, `ItemDetailFullText`, `ItemParameterTextFormat`, `UILoveEventConvTextData`, `UIStrengthening`.

YAIRPG: Desktop UI owner: place held stock, destination quotes and useful effects together at 1366x768; mobile deferred.

## A07: Content authoring and modding

Status: PARTIAL. SHOWN: data tables, category groups and localized binary event packs support authored content separation. No supported mod API, editor workflow or load-order guarantee was established. Missing evidence does not mean those features are absent.

Sources: `catalog.json`, `CraftGenreDataTableArray`, `CraftTypeTableArray`, `RecipeData`, `SerializedItemDataTable`, `ScriptWork`.

YAIRPG: ENGINE_AUTHORING: validate stable IDs and category membership; do not adopt a generic foreign scripting engine.

## A08: Balance and numbers

Status: PARTIAL. SHOWN: authored XP grants, five 99-entry curves, 28 skill caps at 999 and 11 at 99, price-curve indices, co-work lottery/gauge parameters and helper work constants. Exact formulas, RNG source, rounding and high-level extrapolation are UNREAD.

Sources: `SkillActionDataTableArray`, `SkillDataTableArray`, `SkillLevelupTypeDataTableArray`, `ItemDataTable`, `DualWorkDataTableArray`, `ConstFarm`.

YAIRPG: Skills/production owners: disclose units and distinguish coefficients from actual results. Treat donor numbers as references, not chosen balance.

## A09: Time and scheduling

Status: PARTIAL. SHOWN: a time-speed multiplier field, event time windows, date start/deadline, helper work time and schedule data. Pause rules, native clock units and offline catch-up are UNREAD. No offline-time behavior is claimed.

Sources: `TimeConst`, `EventUnlockData`, `NpcDateSaveParameter`, `FarmSupportMonsterData`, `NpcLifeCycleTable samples`.

YAIRPG: Calendar/work owners: retain explicit deadlines and work progress without inventing catch-up or aging.

## A10: Onboarding and reveal

Status: PARTIAL. SHOWN: recipe-release IDs, builder-gated recipe-pan shop quantities, order prerequisites/rewards and a skill-order check entry point. Full tutorial/unlock sequencing is UNREAD. Recipe skill field and discovery flag are separate data.

Sources: `RecipeData.RecipeRelease`, `RecipePanShopDataTableArray`, `RecipePanCountDataTableArray`, `OrderMasterDataTable`, `SkillManager.OrderFlagCheck`.

YAIRPG: P03/P04 skills owner: show known, permitted, held and affordable states separately.

## A11: Little touches

Status: PARTIAL. SHOWN: birthday/scenario talk masks, personal gift sets, partner contribution data and skill descriptions. Runtime animation, audio timing and accessibility are UNREAD. SMALL_TOUCHES contains 26 explicitly proposed YAIRPG ideas, not observed UI claims.

Sources: `NpcStatusDataTable`, `BirthTalkData`, `ScenarioTalkData`, `DualSmithActorDataTableArray`, `SkillUIDiscriptData`.

YAIRPG: Dialogue/item UI owners: preserve personal context and causal attribution when each has a real consumer.

## A12: Other systems

Status: PARTIAL. SHOWN: crop growth/season/soil parameter fields, multi-family orders, co-work data, fishing and festival table assets. Most native consumers are UNREAD. The full 280-table inventory identifies preserved but undigested systems.

Sources: `CropDataTableArray`, `OrderMasterDataTable`, `DualWorkDataTableArray`, `DualSmithActorDataTableArray`, `Fishing master tables`, `Festival master tables`.

YAIRPG: Production/characters owners: co-work provenance and knowledge-supply routes are useful optional leaves, not new milestone requirements.

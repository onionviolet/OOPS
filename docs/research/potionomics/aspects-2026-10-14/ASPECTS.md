# Aspect pass, 2026-10-14

Status: PARTIAL. All twelve rows addressed. Static shown/stated/inferred definitions are in REPORT; nothing here is runtime proof. A01/A03 structure and A04 save route were prioritized.

## A01 / covered

Dialogue tables retain stable IDs, speaker, text references, branch strings, traits, conditions and pre/post action commands. Parsed corpus has 21,741 rows including examples. GiveCard/GiveCoupon use explicit continuations. Conditions include day, flags, quests, relationship and romance state. Full text stays private. Command interpreter and every branch are not exhaustively traced.

Evidence: `Data/Dialogue/**/*.uasset`, `Blueprints/Dialogue/BPC_Haggle_Dialogue`, `Data/Dialogue/Relationships/Mint/DT_Dialogue_MintRel01`.

Takeaways: P19 dialogue owner: bind paid response to host transaction and stable continuation.; P03 skill owner: grant usable knowledge independently of romance..

## A02 / partial

Scheduled events, quest records, storyboards and relationship scenes supply multiple delivery channels. Data and line conditions are shown; exact event priority, scheduling collisions and closure semantics remain unread.

Evidence: `Data/Events/DT_EventSchedule`, `Data/DT_Storyboards`, `Data/DT_Quests`, `Data/Dialogue`.

Takeaways: CHARACTERS_AND_WORLD_EVENTS: retain the cause and completion of a scene instead of deriving it from current time..

## A03 / covered

Unreal cooked V11 pak, encrypted index, Zlib. Config selects a Blueprint game instance. Native Potionomics classes coexist with Blueprint controller, domain functions, table-authored content and UMG widgets. UE4.27 parser mode exports 2,081 assets without recorded warnings/failures; exact engine release is stripped and unresolved. Card effect enums/conditions/parameters feed common ability execution. No Unity decompile route. Export success is not exhaustive logic verification. Performance and native tick internals unread.

Evidence: `Config/DefaultEngine.ini`, `Blueprints/BP_PlayerController`, `Blueprints/BP_PotionomicsGameInstance`, `Blueprints/CardGame/CardGameV2AbilitiesExecution`, `Potionomics/System/SaveLoad/BPL_SaveLoad`.

Takeaways: ENGINE_AUTHORING: retain domain reducers and existing host rather than importing a toolkit.; P19: separate action data, execution and feedback phases..

## A04 / partial

Gameplay save/load pairs cover profile, relationships, inventory, stations, events, quests, tutorials and vendor shops. Separate settings-only BP_SaveGame and slots-info assets exist. BPL_SaveLoad calls a native SaveLoadBlueprintLibrary, has platform branches, autosave slot arithmetic, Steam storage calls and relationship-derived card reconstruction. Native wire format, version contract, corruption rejection and atomicity remain unread; no saves accessed. No offline catch-up claim.

Evidence: `Potionomics/System/SaveLoad/BP_PotionomicsSaveData`, `Potionomics/System/SaveLoad/BPL_SaveLoad`, `Potionomics/System/SaveLoad/BP_PotionomicsSaveSlotsInfo`, `Blueprints/BP_SaveGame`.

Takeaways: Persistence owner: make migration repairs explicit, idempotent and observable.; P03: knowledge library and active loadout need a clear retained or derived contract..

## A05 / partial

Customers have authored parameters and card tactics with next-move hints; adventure encounters and heroes are data-authored. This is not evidence of autonomous NPC lives or a general planner. Customer selection, every tactic and encounter resolver remain unread.

Evidence: `Data/DT_CustomersV2`, `Data/DT_CustomersV2_Easy`, `Data/DT_CustomersV2_Hard`, `Blueprints/BP_PlayerController`, `Data/Adventuring`.

Takeaways: P19: preview the disclosed next threat without exposing hidden future draws..

## A06 / partial

Composition letters/colors, pie chart, ratio components, capacities, base-price and quality tooltips, separate start/collect/discard controls and save-slot metadata are shown in assets. Widgets include focus and key handlers. Rendered readability, keyboard reachability and desktop screen use were not tested because launch is prohibited.

Evidence: `Potionomics/UI/Brewing/WBP_CauldronPieChart`, `Potionomics/UI/Brewing/WBP_PotionToBeBrewed`, `Potionomics/UI/Brewing/WBP_ActiveCauldron`, `Potionomics/UI/SaveMenu/WBP_SaveSlot`, `Data/DT_Magimins`.

Takeaways: Desktop UI owner: compare stock, quote, result and next action at 1366x768.; P02: composition and purpose should be readable together..

## A07 / partial

Design content uses DataTables, string tables, user-defined structs/enums, command-bearing dialogue rows and Blueprints. The archive includes CCGToolkit content and deprecated/example data. This is an authoring architecture, not proof of an official mod API. Mod author demonstrated package editing historically; load order, validation and supported SDK are unread.

Evidence: `Data/**/*.uasset`, `Blueprints/Enum`, `Blueprints/Struct`, `CCGToolkit/CardGame/CardSets`.

Takeaways: ENGINE_AUTHORING: stable references and validated commands, no free-form effect text as authority..

## A08 / partial

Recipe vectors, tier/star ranges, stability modifier sets, relationship thresholds and percentage-based price aggregation are shown. Difficulty alternatives coexist. Native stability fit, modifier weights, RNG seeding and all balance readers remain unread. Do not infer equal odds from a two-element modifier array.

Evidence: `Data/DT_CauldronStability`, `Data/DT_PotionPurity`, `Data/DT_Potions`, `Data/Relationships`, `Blueprints/BP_PlayerController.CGV2CI_GetCurrentPotionPriceInfo`.

Takeaways: MEANS_AND_APPRAISAL: distinguish known fit and potency from uncertain quality..

## A09 / partial

Brewing and hangouts use game-time segments; tier duration varies and fuel is described as reducing it. Overnight adds two brew segments according to installed text. Exact native time advancement and causal settlement are unread; closed-app progress not established.

Evidence: `Data/DT_Potions.Tiers.TimeNeededToBrew`, `Data/Relationships/DT_RelationshipHangouts`, `Data/Events/DT_EventSchedule`, `Localization/Game/en/Game.locres:ST_LoadingScreenTips.LoadingScreenTips_24`.

Takeaways: P01/work owner: quote units and accepted completion time.; Modular chain round 5: preserve causal boundaries rather than assuming whole-chain catch-up..

## A10 / partial

Tutorial dialogue introduces magimins, ratios, fuel, haggling and end-day actions; flags and unlock tables stage content. Debug/trailer defaults coexist with NewGame, so not every asset is a live start. Exact active unlock sequence and tutorial recovery unread.

Evidence: `Data/DT_DefaultValues`, `Data/DT_Flags`, `Data/Dialogue`, `Data/DT_VendorsUnlockByFlags`, `Data/DT_CustomersUnlock`.

Takeaways: P04: distinguish discovery, permission, ownership and usability when revealing a method..

## A11 / covered

Outcome-specific colors/sounds, ingredient and capacity warnings, hover tooltips, letters plus colors, focus handlers and collect gates are represented in data/widgets. SMALL_TOUCHES lists 24 proposals, explicitly separating current YAIRPG features from gaps. Perceived animation feel and accessibility are untested.

Evidence: `Data/DT_CauldronCraftResults`, `Data/DT_Magimins`, `Potionomics/UI/Brewing/WBP_ActiveCauldron`, `Potionomics/UI/Brewing/WBP_PotionToBeBrewed`.

Takeaways: P01 UI owner: give exact warning at the action and retain a readable actual result..

## A12 / partial

Additional systems include adventures/hero leveling, ingredient supply investment, gardening/slime feeding, marketing, enchantments, aging, store equipment/decor, competitions, debt and achievements. Inventory and top-three deeper-system notes are provided. Full economies, endless-mode balance and subsystem reducers remain unread.

Evidence: `Data/Adventuring`, `Data/Farming`, `Data/Gardening`, `Data/Vendor`, `Data/Carnival`, `Potionomics/System/BPL_Achievements`, `Data/DT_AgingBarrels`.

Takeaways: P02: each intermediate or owned output needs a real downstream reader..

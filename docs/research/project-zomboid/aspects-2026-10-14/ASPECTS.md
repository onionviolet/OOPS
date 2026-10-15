# Aspect pass, Project Zomboid 42.21

Status: PARTIAL. Source inspection only. Priorities A01, A03 and A04 were read first; dialogue branching and whole-save behavior remain open. All recommendations are PROPOSALS.

## A01 (partial)

Shown: recorded-media entries register stable IDs, title/author references, ordered lines, colors and effect codes. The interaction handler gates heard effects by line GUID, range, floor, indoor/outdoor and sleep, then dispatches skill/stat/recipe changes. No conversational choice graph was traced. NPC relationship/portrait gating remains unread; broadcasts are not proof of branching dialogue.

Evidence: `media/lua/shared/RecordedMedia/ISRecordedMedia.lua`, `media/lua/shared/RecordedMedia/recorded_media.lua`, `media/lua/shared/RadioCom/ISRadioInteractions.lua`, `media/radio/RadioData.xml`.

YAIRPG: DIALOGUE_AND_INTERACTIONS: separate authored line identity, heard state and mechanical effect; no copied lines. P19 remains unproven here: media effect codes are not a paid response graph.

## A02 (partial)

Shown reading path: print-media metadata opens a viewer, records read media IDs and can reveal map locations through definition metadata. Radio and stash systems are present in the inventory. Full story scheduling, closure and all stash conditions are unread.

Evidence: `media/lua/shared/PrintMedia/PrintMediaDefinitions.lua`, `media/lua/shared/TimedActions/ISReadABook.lua`, `media/lua/shared/StashDescriptions/`.

YAIRPG: CHARACTERS_AND_WORLD_EVENTS: a discovered document can change a known location without conflating document possession with knowledge.

## A03 (covered)

Shown: Java core plus shared/client/server Lua and script-defined content. Lua registers named events, owns UI/actions, calls Java state and recipe logic. Entity components bind resources, CraftBench or DryingCraftLogic, UI skin and sprite overlays. EntitySimulation uses a fixed tick calculation from accumulated elapsed time. Native libraries are present but were not analyzed.

Evidence: `projectzomboid.jar`, `media/lua/shared/TimedActions/ISBaseTimedAction.lua`, `media/lua/shared/RecordedMedia/ISRecordedMedia.lua`, `zombie/entity/EntitySimulation.class`, `media/scripts/generated/entities/animals/workstations/entity_leather_prep.txt`.

YAIRPG: ENGINE_AUTHORING: keep domain content declarative and distinguish hand actions from unattended jobs. ENGINE_EXPANSION: reuse current scheduler and admission owners, no new global engine on this reference alone.

## A04 (partial)

Shown: byte-buffer save/load for known recipe IDs, reading pages, XP/multiplier bands and known media lines. Craft records pin recipe identity and script version and store elapsed time, inputs and consumed state; mismatched recipe versions/inputs invalidate the craft. Drying adds saved wetness. Whole-save storage, atomicity, autosave cadence, all migrations, global corruption recovery and offline semantics are unread. No saves touched.

Evidence: `zombie/characters/IsoGameCharacter.class`, `zombie/characters/IsoGameCharacter$XP.class`, `zombie/characters/IsoPlayer.class`, `zombie/entity/components/crafting/recipe/CraftRecipeData.class`, `zombie/entity/components/crafting/DryingCraftLogic.class`.

YAIRPG: ENGINE_SAVES_AND_SCALE_REVIEW: retain source identity and reject incompatible pending work rather than invent its completion. No YAIRPG persistence claim is satisfied by donor bytecode.

## A05 (partial)

Inventory confirms animal/zombie and AI areas. Butcher actions face targets and bind a hook user, but autonomous planners and NPC schedules were not read. Do not claim human life-simulation parity.

Evidence: `media/lua/server/Animal/`, `media/lua/server/Zombies/`, `projectzomboid.jar:zombie/ai/`.

YAIRPG: CHARACTERS_AND_WORLD_EVENTS: future AI readers must use actual body/resource rules; no new population simulation selected.

## A06 (covered)

Shown source: independent recipe facts, colored input quantities, kept-tool icons, progress, disabled craft control and causal drying tooltip. Current-level string in InfoBox is computed but unused in its pair. Generic craft failure can be debug-only. No rendered viewport or accessibility proof.

Evidence: `media/lua/client/Entity/ISUI/CraftRecipe/ISCraftRecipeInfoBox.lua`, `media/lua/client/Entity/ISUI/CraftRecipe/ISWidgetInput.lua`, `media/lua/client/Entity/ISUI/CraftRecipe/ISWidgetHandCraftControl.lua`, `zombie/entity/components/crafting/DryingCraftLogic.class`.

YAIRPG: UI_AT_SCALE: place exact blockers and actual result with action and stock at desktop 1366x768. Use words as well as color and retain keyboard focus in a future YAIRPG slice.

## A07 (covered)

Shown: script recipes define item/fluid inputs, tag alternatives, keep/destroy/condition flags, output mappers, skills and station tags; entity components bind stations/UI/resources. Foraging includes author guidance and registration tables. ModTemplate is present, but packaging and full mod load order were not tested.

Evidence: `media/scripts/generated/recipes/`, `media/scripts/generated/entities/`, `media/lua/shared/Foraging/forageSystem.lua`, `Workshop/ModTemplate/`.

YAIRPG: ENGINE_AUTHORING: validate named recipe/station references and show author intent without introducing one generic reducer.

## A08 (partial)

Shown: band multipliers, trait/profession XP factors, pre-award media cutoff, level-10 max XP clamp and animal yield functions. Random yield helpers exist; RNG seed persistence, full balance and bad-luck protection remain unread.

Evidence: `media/lua/server/XpSystem/XPSystem_SkillBook.lua`, `zombie/characters/IsoGameCharacter$XP.class`, `media/lua/shared/RadioCom/ISRadioInteractions.lua`, `media/lua/shared/Definitions/animal/ButcheringUtil.lua`.

YAIRPG: SKILLS_AND_TALENTS: quote the actual benefit and cutoff; preparation is not an XP event.

## A09 (covered)

Shown: action duration and unattended world-time processor are separate clocks. Drying uses game seconds times thermal factor and freezes elapsed progress while wet. Media cooldowns tick with game multiplier. Offline catch-up is unread and not inferred from retained jobs.

Evidence: `media/lua/shared/Entity/TimedActions/ISHandcraftAction.lua`, `zombie/entity/EntitySimulation.class`, `zombie/entity/components/crafting/DryingCraftLogic.class`.

YAIRPG: MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS: one local causal timer, with interruption policy and useful downstream result.

## A10 (partial)

Tutorial/guide surfaces exist but their full sequence is unread. Books explicitly reject too-advanced or obsolete bands; crafting distinguishes learned state. No claim that unknown alternatives remain hidden in all menus.

Evidence: `media/lua/client/Tutorial/`, `media/lua/client/SurvivalGuide/`, `media/lua/shared/TimedActions/ISReadABook.lua`, `media/lua/client/Entity/ISUI/CraftRecipe/ISCraftRecipeInfoBox.lua`.

YAIRPG: TECHNOLOGY_AND_PROGRESSION: disclose known blockers without leaking undiscovered route names; YAIRPG observer-safe admission remains authority.

## A11 (covered)

Shown: reading sounds/page resume, sitting/glasses benefits, kept-tool feedback, variable batch counts and wet/cold/hot status icons. Twenty-four original adaptation ideas are separated in SMALL_TOUCHES.

Evidence: `media/lua/shared/TimedActions/ISReadABook.lua`, `media/lua/client/Entity/ISUI/CraftRecipe/ISWidgetInput.lua`, `zombie/entity/components/crafting/DryingCraftLogic.class`.

YAIRPG: THEMATIC_UI_AND_INFORMATION_DESIGN: useful cause and progress cues before decorative effects.

## A12 (partial)

Additional source slices: research items teach recipe IDs; fluid transfer accounts for progress and retained source amount; foraging composes authored seasonal/environment definitions. World generation, vehicles, farming and economy breadth are inventoried but not fully read.

Evidence: `media/lua/shared/Fluids/ISFluidTransferAction.lua`, `media/lua/shared/TimedActions/ISResearchRecipe.lua`, `media/lua/shared/Foraging/forageSystem.lua`.

YAIRPG: TECHNOLOGY_AND_PROGRESSION: practical object study can be a distinct knowledge route. MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS: partial transfer requires explicit accounting.

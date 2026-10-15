# Installed system inventory

Scope: all six installed Data modules, every raw Def tag discovered, top-level gameplay class namespaces and named runtime subsystems found during targeted traces. This is a discovery inventory, not a claim to semantically read every class. Namespaces and Def tags can overlap systems; counts must not be summed into a unique-system total. An undocumented family is a research lead, not absent behavior.

Private machine indexes: notes/TYPES.txt (all class entries including nested/compiler types), notes/FULL_DEF_RECORDS.json (complete XML by path/row/ID), notes/FULL_ENGLISH_TEXT.json and notes/SYSTEM_CENSUS.json. Data paths below are relative to private extract/. Every raw family is indexed even when its consumers are unread. No runtime mod resolution performed.

## Runtime subsystems

| System | Where | Size signal | Documentation disposition |
| --- | --- | --- | --- |
| Host and Unity compatibility | RimWorld.dll / RimWorldWaylith.Program,Bootstrap; runtimeconfig | 2 host types traced; host class index in notes/HOST_TYPES.txt | New A03; deeper renderer unread |
| Root/game update and world init | Verse.Root,Root_Play,Game | 4 selected types | New A03/A04 |
| Ticks and distributed work | Verse.TickManager,TickList | 2 selected types; 3 buckets | Feature noted; A03/A09 expanded |
| Serialization/write recovery | Verse.Scribe*,SafeSaver,GameDataSaveLoader | 6 selected Scribe types plus save helpers | Feature sampled; A04/D3 expanded |
| Version and content compatibility | Verse.BackCompatibility,PreLoadUtility,ScribeMetaHeaderUtility | 3 policy/preflight types; converter bodies unread | New A04/D3 |
| Mod/XML load and authoring | Verse.LoadedModManager,Def,RulePackDef | 3 selected types; 254 raw Def tags | Feature sampled; A07 expanded |
| Generated social exchange | RimWorld.Pawn_InteractionsTracker,InteractionWorker* | 68 raw InteractionDef nodes | Root bounded social; A01/D1 expanded |
| Directed social memory/opinion | MemoryThoughtHandler,Thought_MemorySocial,Pawn_RelationsTracker | 3 selected types plus NegativeInteractionUtility | Root covered bounded path; current endpoints sampled |
| Grammar and procedural text | Verse.Grammar.*,RulePackDef | 340 raw RulePackDef nodes | Feature indexed; A01/D1 traced |
| Explicit choice/negotiation | DiaNode,DiaOption,Dialog_NodeTree,FactionDialogMaker,Dialog_Negotiation | 7 selected UI/builder types | New A01/D1 |
| Play log and retained attribution | Verse.PlayLog,PlayLogEntry_Interaction | 2 selected types | Root/feature partly; A01 expanded |
| Quest signals/lifecycle | RimWorld.Quest*,SignalManager | 156 raw QuestScriptDef nodes; runtime parts below | New A02/D2 |
| Delayed incidents/retry | RimWorld.IncidentQueue,QueuedIncident | 2 selected types | New A09 |
| Storyteller selection | RimWorld.Storyteller,StorytellerComp_RandomMain | 139 raw IncidentDef nodes | Root bounded; current endpoints sampled |
| NPC jobs/think trees/toils | Verse.AI.*,RimWorld.JobGiver_Work | 61 ThinkTreeDef; 321 JobDef; 154 WorkGiverDef | Root/feature jobs; A05 first-valid-node trace |
| Group/lord AI | Verse.AI.Group | Namespace count below | Undocumented here; unread |
| Pathfinding/spatial search | Verse.AI and reachability/region types | Class index; JobGiver target reader sampled | Undocumented full pathfinder; unread |
| Desktop windows/tabs/hotkeys | MainButtonsRoot,MainTabWindow_Inspect,WindowStack,TimeControls | 15 MainButtonDef; 66 KeyBindingDef | Feature UI source; A06/A11; native unread |
| Bill/stock target interface | RimWorld.Dialog_BillConfig | 1 selected UI type | Feature bills; current count/filter sampled |
| Balance/quality/stat/RNG | QualityUtility,StatWorker,Verse.Rand | 3 selected types; 256 StatDef | Root/feature sampled; A08 expanded quality/RNG |
| Adaptive teaching and tutorials | TutorSystem,LessonAutoActivator | 86 ConceptDef; 37 InstructionDef | New A10 |
| Trade/gifts/standing | RimWorld.TradeDeal,TradeUtility,FactionDialogMaker | 3 selected types | New A12 bounded deal path |
| Research/history/factions | ResearchManager,HistoryAutoRecorder,FactionManager | 3 extracted endpoint/index sources | Feature research; broad faction/history unread |
| Calendar and autosave | RimWorld.GenDate,Autosaver | 2 selected types | New A04/A09 |
| DLC domain consumers | Data/Royalty,Biotech,Ideology,Anomaly,Odyssey | Module/node census below | Feature selected learning/body; broad consumers unread |

## Raw module census

| Module | Raw Def nodes |
| --- | ---: |
| Anomaly | 1482 |
| Biotech | 1440 |
| Core | 6669 |
| Ideology | 2062 |
| Odyssey | 1674 |
| Royalty | 757 |

Total 14,084 raw nodes across 254 tags. English index has 8,223 direct-child rows; embedded grammar and event prose also remain in full XML. XML parses: 1,676 files, zero failures. Rows include abstract/inherited records and do not predict activated/resolved counts.

## Complete discovered Def-family inventory

Each row includes a real installed sample path, a raw-node count and prior/current documentation state. A sample path is an entry point; the private index records every matching path.

| Family/subsystem | Raw nodes | Sample location | Documented? |
| --- | ---: | --- | --- |
| `AbilityCategoryDef` | 4 | `Data/Biotech/Defs/AbilityDefs/Abilities.xml` | Undocumented consumer; indexed only in this lane |
| `AbilityDef` | 107 | `Data/Anomaly/Defs/AbilityDefs/Abilities.xml` | Undocumented consumer; indexed only in this lane |
| `AbilityGroupDef` | 3 | `Data/Ideology/Defs/AbilityDefs/Abilities.xml` | Undocumented consumer; indexed only in this lane |
| `AnimationDef` | 13 | `Data/Anomaly/Defs/AnimationDefs/DeathRefusal.xml` | Undocumented consumer; indexed only in this lane |
| `AnomalyPlaystyleDef` | 3 | `Data/Anomaly/Defs/AnomalyPlaystyles/AnomalyPlaystyles.xml` | Undocumented consumer; indexed only in this lane |
| `ApparelLayerDef` | 6 | `Data/Core/Defs/Misc/ApparelLayerDefs/ApparelLayerDefs.xml` | Undocumented consumer; indexed only in this lane |
| `BabyPlayDef` | 3 | `Data/Biotech/Defs/BabyPlayDefs/BabyPlay.xml` | Undocumented consumer; indexed only in this lane |
| `BackStoryDef` | 1 | `Data/Core/Defs/BackstoryDefs/Solid/Solid_Rare.xml` | Undocumented consumer; indexed only in this lane |
| `BackstoryDef` | 845 | `Data/Anomaly/Defs/BackstoryDefs/Solid/Solid.xml` | Undocumented consumer; indexed only in this lane |
| `BeardDef` | 42 | `Data/Biotech/Defs/BeardDefs/BeardDefs.xml` | Undocumented consumer; indexed only in this lane |
| `BillRepeatModeDef` | 3 | `Data/Core/Defs/Misc/BillDefs/BillRepeatModeDefs.xml` | Undocumented consumer; indexed only in this lane |
| `BillStoreModeDef` | 3 | `Data/Core/Defs/Misc/BillDefs/BillStoreModeDefs.xml` | Undocumented consumer; indexed only in this lane |
| `BiomeDef` | 25 | `Data/Anomaly/Defs/MapGeneration/LabyrinthMapGenerator.xml` | Undocumented consumer; indexed only in this lane |
| `BodyDef` | 48 | `Data/Anomaly/Defs/Bodies/Bodies_Entities.xml` | Undocumented consumer; indexed only in this lane |
| `BodyPartDef` | 147 | `Data/Anomaly/Defs/Bodies/Bodies_Entities.xml` | Undocumented consumer; indexed only in this lane |
| `BodyPartGroupDef` | 48 | `Data/Anomaly/Defs/Bodies/Bodies_Entities.xml` | Undocumented consumer; indexed only in this lane |
| `BodyPartTagDef` | 25 | `Data/Core/Defs/Misc/BodyPartTagDefs/BodyPartTagDefs.xml` | Undocumented consumer; indexed only in this lane |
| `BodyTypeDef` | 8 | `Data/Biotech/Defs/Misc/BodyTypeDefs/BodyTypes.xml` | Undocumented consumer; indexed only in this lane |
| `BossDef` | 3 | `Data/Biotech/Defs/BossgroupDefs/Bossgroups.xml` | Undocumented consumer; indexed only in this lane |
| `BossgroupDef` | 4 | `Data/Biotech/Defs/BossgroupDefs/Bossgroups.xml` | Undocumented consumer; indexed only in this lane |
| `ChemicalDef` | 8 | `Data/Core/Defs/Drugs/Alcohol_Beer.xml` | Undocumented consumer; indexed only in this lane |
| `ClamorDef` | 6 | `Data/Biotech/Defs/Misc/ClamorDefs.xml` | Undocumented consumer; indexed only in this lane |
| `ColorDef` | 140 | `Data/Core/Defs/ColorDefs/ColorDefs.xml` | Undocumented consumer; indexed only in this lane |
| `ComplexLayoutDef` | 3 | `Data/Biotech/Defs/LayoutDefs/Layouts_Misc.xml` | Undocumented consumer; indexed only in this lane |
| `ComplexThreatDef` | 11 | `Data/Core/Defs/ComplexThreatDefs/ComplexThreats_Misx.xml` | Undocumented consumer; indexed only in this lane |
| `ConceptDef` | 86 | `Data/Anomaly/Defs/Tutor/Tutor.xml` | Feature sampled; this A10 |
| `CreepJoinerAggressiveDef` | 3 | `Data/Anomaly/Defs/CreepjoinerDefs/Aggressive.xml` | Undocumented consumer; indexed only in this lane |
| `CreepJoinerBenefitDef` | 10 | `Data/Anomaly/Defs/CreepjoinerDefs/Benefits.xml` | Undocumented consumer; indexed only in this lane |
| `CreepJoinerDownsideDef` | 9 | `Data/Anomaly/Defs/CreepjoinerDefs/Downsides.xml` | Undocumented consumer; indexed only in this lane |
| `CreepJoinerFormKindDef` | 9 | `Data/Anomaly/Defs/CreepjoinerDefs/Forms.xml` | Undocumented consumer; indexed only in this lane |
| `CreepjoinerRejectionDef` | 2 | `Data/Anomaly/Defs/CreepjoinerDefs/Rejections.xml` | Undocumented consumer; indexed only in this lane |
| `CultureDef` | 5 | `Data/Core/Defs/CultureDefs/Cultures.xml` | Undocumented consumer; indexed only in this lane |
| `DamageArmorCategoryDef` | 3 | `Data/Core/Defs/Misc/DamageArmorCategoryDef/DamageArmorCategoryDefs.xml` | Undocumented consumer; indexed only in this lane |
| `DamageDef` | 53 | `Data/Anomaly/Defs/DamageDefs/Damages_Environmental.xml` | Undocumented consumer; indexed only in this lane |
| `DebugTabMenuDef` | 3 | `Data/Core/Defs/DebugTabMenuDefs/DebugTabMenuDefs.xml` | Undocumented consumer; indexed only in this lane |
| `DesignationCategoryDef` | 16 | `Data/Anomaly/Defs/Misc/DesignationCategories.xml` | Undocumented consumer; indexed only in this lane |
| `DesignationDef` | 27 | `Data/Core/Defs/Misc/Designations/Designations.xml` | Undocumented consumer; indexed only in this lane |
| `DesignatorDropdownGroupDef` | 13 | `Data/Core/Defs/Misc/DesignatorDropdownGroupDef/DesignatorDropdownGroupDef.xml` | Undocumented consumer; indexed only in this lane |
| `DifficultyDef` | 7 | `Data/Core/Defs/Misc/DifficultyDefs/Difficulties.xml` | Undocumented consumer; indexed only in this lane |
| `DrawStyleCategoryDef` | 19 | `Data/Core/Defs/DrawStyleCategoryDefs/DrawStyleCategories.xml` | Undocumented consumer; indexed only in this lane |
| `DrawStyleDef` | 6 | `Data/Core/Defs/DrawStyleDefs/DrawStyles.xml` | Undocumented consumer; indexed only in this lane |
| `DrugPolicyDef` | 4 | `Data/Core/Defs/DrugPolicyDefs/DrugPolicyDefs.xml` | Undocumented consumer; indexed only in this lane |
| `DutyDef` | 108 | `Data/Anomaly/Defs/DutyDefs/Duties_Misc.xml` | Undocumented consumer; indexed only in this lane |
| `EffecterDef` | 285 | `Data/Anomaly/Defs/Effects/Effecter_Misc.xml` | Undocumented consumer; indexed only in this lane |
| `EntityCategoryDef` | 3 | `Data/Anomaly/Defs/EntityCategoryDefs/EntityCategories.xml` | Undocumented consumer; indexed only in this lane |
| `EntityCodexEntryDef` | 27 | `Data/Anomaly/Defs/EntityCodexEntryDefs/EntityCodexEntryDefs.xml` | Undocumented consumer; indexed only in this lane |
| `ExpansionDef` | 6 | `Data/Core/Defs/Misc/ExpansionDefs/ExpansionDefs.xml` | Undocumented consumer; indexed only in this lane |
| `ExpectationDef` | 10 | `Data/Core/Defs/Misc/ExpectationDefs/Expectations.xml` | Undocumented consumer; indexed only in this lane |
| `FactionDef` | 39 | `Data/Anomaly/Defs/FactionDefs/Factions_Misc.xml` | Undocumented consumer; indexed only in this lane |
| `FeatureDef` | 25 | `Data/Core/Defs/Misc/FeatureDefs/Features.xml` | Undocumented consumer; indexed only in this lane |
| `FleckDef` | 327 | `Data/Anomaly/Defs/Effects/Fleck_Visual.xml` | Undocumented consumer; indexed only in this lane |
| `FleshTypeDef` | 7 | `Data/Anomaly/Defs/Misc/FleshTypeDefs/FleshType.xml` | Undocumented consumer; indexed only in this lane |
| `FurDef` | 1 | `Data/Biotech/Defs/Misc/FurDefs.xml` | Undocumented consumer; indexed only in this lane |
| `GameConditionDef` | 38 | `Data/Anomaly/Defs/GameConditionDefs/GameConditions_Misc.xml` | Root ColdSnap |
| `GameSetupStepDef` | 4 | `Data/Core/Defs/Misc/GameSetupStepDefs/GameSetupSteps.xml` | Undocumented consumer; indexed only in this lane |
| `GatheringDef` | 3 | `Data/Core/Defs/GatheringDefs/Gatherings.xml` | Undocumented consumer; indexed only in this lane |
| `GauranlenTreeModeDef` | 7 | `Data/Ideology/Defs/GauranlenTreeModDefs/GauranlenTreeModeDefs.xml` | Undocumented consumer; indexed only in this lane |
| `GenStepDef` | 170 | `Data/Anomaly/Defs/MapGeneration/BasePlayerMapGenerator.xml` | Undocumented consumer; indexed only in this lane |
| `GeneCategoryDef` | 21 | `Data/Biotech/Defs/GeneDefs/GeneCategoryDefs.xml` | Undocumented consumer; indexed only in this lane |
| `GeneDef` | 203 | `Data/Biotech/Defs/GeneDefs/GeneDefs_Abilities.xml` | Feature body/genetics |
| `GeneTemplateDef` | 9 | `Data/Biotech/Defs/GeneDefs/GeneTemplateDefs.xml` | Undocumented consumer; indexed only in this lane |
| `GeneratedLocationDef` | 1 | `Data/Odyssey/Defs/GeneratedLocationDefs/GeneratedLocations.xml` | Undocumented consumer; indexed only in this lane |
| `GlobalWorldDrawLayerDef` | 2 | `Data/Core/Defs/GlobalWorldDrawLayerDefs/GlobalWorldDrawLayers.xml` | Undocumented consumer; indexed only in this lane |
| `GoodwillSituationDef` | 39 | `Data/Core/Defs/Goodwill/GoodwillSituations_Misc.xml` | Undocumented consumer; indexed only in this lane |
| `GraphicStateDef` | 2 | `Data/Core/Defs/GraphicStateDefs/GraphicStates.xml` | Undocumented consumer; indexed only in this lane |
| `GravshipComponentTypeDef` | 5 | `Data/Odyssey/Defs/ThingDefs_Buildings/Buildings_Gravship.xml` | Undocumented consumer; indexed only in this lane |
| `HairDef` | 82 | `Data/Anomaly/Defs/HairDefs/HairsCultist.xml` | Undocumented consumer; indexed only in this lane |
| `HeadTypeDef` | 43 | `Data/Anomaly/Defs/Misc/HeadTypes.xml` | Undocumented consumer; indexed only in this lane |
| `HediffDef` | 345 | `Data/Anomaly/Defs/HediffDefs/Hediffs_BodyParts_Prosthetic.xml` | Undocumented consumer; indexed only in this lane |
| `HediffGiverSetDef` | 4 | `Data/Anomaly/Defs/HediffGiverSetDefs/HediffGiverSetDefs.xml` | Undocumented consumer; indexed only in this lane |
| `HibernatableStateDef` | 3 | `Data/Core/Defs/Misc/HibernatableStateDefs/HibernatableStateDefs.xml` | Undocumented consumer; indexed only in this lane |
| `HistoryAutoRecorderDef` | 11 | `Data/Core/Defs/Misc/HistoryAutoRecording/HistoryAutoRecorders.xml` | Undocumented consumer; indexed only in this lane |
| `HistoryAutoRecorderGroupDef` | 4 | `Data/Core/Defs/Misc/HistoryAutoRecording/HistoryAutoRecorderGroups.xml` | Undocumented consumer; indexed only in this lane |
| `HistoryEventDef` | 172 | `Data/Anomaly/Defs/Misc/HistoryEventDefs.xml` | Undocumented consumer; indexed only in this lane |
| `IdeoColorDef` | 33 | `Data/Ideology/Defs/IdeoSymbolDefs/IdeoColorDefs.xml` | Undocumented consumer; indexed only in this lane |
| `IdeoFoundationDef` | 1 | `Data/Ideology/Defs/IdeoFoundationDefs/IdeoFoundations.xml` | Undocumented consumer; indexed only in this lane |
| `IdeoIconDef` | 94 | `Data/Ideology/Defs/IdeoSymbolDefs/IdeoIconDefs_Specific.xml` | Undocumented consumer; indexed only in this lane |
| `IdeoPresetCategoryDef` | 6 | `Data/Ideology/Defs/PreconfiguredIdeos/IdeoPresetDefs.xml` | Undocumented consumer; indexed only in this lane |
| `IdeoPresetDef` | 25 | `Data/Anomaly/Defs/PreconfiguredIdeos/IdeoPresetDefs.xml` | Undocumented consumer; indexed only in this lane |
| `IdeoStoryPatternDef` | 6 | `Data/Ideology/Defs/RulePackDefs/RulePacks_Ideo_Description.xml` | Undocumented consumer; indexed only in this lane |
| `ImpactSoundTypeDef` | 7 | `Data/Biotech/Defs/ImpactSoundTypeDefs/ImpactSoundTypeDefs.xml` | Undocumented consumer; indexed only in this lane |
| `ImplementOwnerTypeDef` | 5 | `Data/Core/Defs/Misc/ImplementOwnerTypeDefs/ImplementOwnerTypeDefs.xml` | Undocumented consumer; indexed only in this lane |
| `IncidentCategoryDef` | 13 | `Data/Core/Defs/Misc/IncidentCategoryDefs/IncidentCategoryDefs.xml` | Undocumented consumer; indexed only in this lane |
| `IncidentDef` | 139 | `Data/Anomaly/Defs/Storyteller/Incidents_Map_Misc.xml` | Root storyteller; this A09 |
| `IncidentTargetTagDef` | 7 | `Data/Core/Defs/Misc/IncidentTargetTypeDefs/IncidentTargetTagDefs.xml` | Undocumented consumer; indexed only in this lane |
| `InfectionPathwayDef` | 3 | `Data/Anomaly/Defs/InfectionPathwayDefs/InfectionPathwayDefs.xml` | Undocumented consumer; indexed only in this lane |
| `InspirationDef` | 8 | `Data/Core/Defs/InspirationDefs/Inspirations.xml` | Undocumented consumer; indexed only in this lane |
| `InstructionDef` | 37 | `Data/Core/Defs/Tutor/Instructions.xml` | This A10 framework |
| `InteractionDef` | 68 | `Data/Anomaly/Defs/InteractionDefs/Interactions_Misc.xml` | Root social; this A01/D1 |
| `InventoryStockGroupDef` | 1 | `Data/Core/Defs/Misc/InventoryStockGroupDefs/InventoryStockGroups.xml` | Undocumented consumer; indexed only in this lane |
| `IssueDef` | 72 | `Data/Anomaly/Defs/PreceptDefs/Precepts_Inhumanizing.xml` | Undocumented consumer; indexed only in this lane |
| `JobDef` | 321 | `Data/Anomaly/Defs/JobDefs/Jobs_Misc.xml` | Undocumented consumer; indexed only in this lane |
| `JoyGiverDef` | 22 | `Data/Core/Defs/Joy/JoyGivers.xml` | Undocumented consumer; indexed only in this lane |
| `JoyKindDef` | 10 | `Data/Core/Defs/Joy/JoyKinds.xml` | Undocumented consumer; indexed only in this lane |
| `KeyBindingCategoryDef` | 9 | `Data/Core/Defs/Misc/KeyBindings/KeyBindingCategories.xml` | Undocumented consumer; indexed only in this lane |
| `KeyBindingDef` | 66 | `Data/Core/Defs/Misc/KeyBindings/KeyBindings.xml` | This A06/A11 |
| `KnowledgeCategoryDef` | 2 | `Data/Anomaly/Defs/KnowledgeCategoryDefs/KnowledgeCategories.xml` | Undocumented consumer; indexed only in this lane |
| `LandingOutcomeDef` | 4 | `Data/Odyssey/Defs/Misc/LandingOutcomes.xml` | Undocumented consumer; indexed only in this lane |
| `LandmarkDef` | 51 | `Data/Odyssey/Defs/TileMutators/Landmarks.xml` | Undocumented consumer; indexed only in this lane |
| `LayoutDef` | 1 | `Data/Anomaly/Defs/LayoutDefs/Layouts_Misc.xml` | Undocumented consumer; indexed only in this lane |
| `LayoutRoomDef` | 145 | `Data/Anomaly/Defs/LayoutRoomDefs/LayoutRooms_Labyrinth.xml` | Undocumented consumer; indexed only in this lane |
| `LearningDesireDef` | 7 | `Data/Biotech/Defs/LearningDesireDefs/LearningDesires.xml` | Undocumented consumer; indexed only in this lane |
| `LetterDef` | 27 | `Data/Anomaly/Defs/Misc/LetterDefs/CustomChoiceLetters.xml` | Undocumented consumer; indexed only in this lane |
| `LifeStageDef` | 19 | `Data/Anomaly/Defs/LifeStageDefs/LifeStages.xml` | Undocumented consumer; indexed only in this lane |
| `LogEntryDef` | 2 | `Data/Core/Defs/Misc/LogEntryDefs/LogEntryDef.xml` | Undocumented consumer; indexed only in this lane |
| `MainButtonDef` | 15 | `Data/Biotech/Defs/MainButtonDefs/MainButtons.xml` | This A06 |
| `ManeuverDef` | 12 | `Data/Core/Defs/Maneuvers/Maneuvers.xml` | Undocumented consumer; indexed only in this lane |
| `MapGeneratorDef` | 20 | `Data/Anomaly/Defs/MapGeneration/LabyrinthMapGenerator.xml` | Undocumented consumer; indexed only in this lane |
| `MapMeshFlagDef` | 15 | `Data/Biotech/Defs/MapMeshFlagDefs/MapMeshFlagDefs.xml` | Undocumented consumer; indexed only in this lane |
| `MaterialDef` | 81 | `Data/Core/Defs/MaterialDefs/Materials.Generated.xml` | Undocumented consumer; indexed only in this lane |
| `MechWeightClassDef` | 4 | `Data/Core/Defs/MechWeightClassDefs/MechWeightClassDefs.xml` | Undocumented consumer; indexed only in this lane |
| `MechWorkModeDef` | 4 | `Data/Biotech/Defs/Misc/MechWorkModes.xml` | Undocumented consumer; indexed only in this lane |
| `MeditationFocusDef` | 7 | `Data/Anomaly/Defs/MeditationFocusDefs/MeditationFocusDefs.xml` | Undocumented consumer; indexed only in this lane |
| `MemeDef` | 38 | `Data/Anomaly/Defs/MemeDefs/Memes_Misc.xml` | Undocumented consumer; indexed only in this lane |
| `MemeGroupDef` | 7 | `Data/Ideology/Defs/MemeDefs/Memes_GenderSupremacy.xml` | Undocumented consumer; indexed only in this lane |
| `MentalBreakDef` | 34 | `Data/Anomaly/Defs/MentalStateDefs/MentalStates_Mood.xml` | Undocumented consumer; indexed only in this lane |
| `MentalFitDef` | 2 | `Data/Biotech/Defs/MentalStateDefs/MentalStates_BabyFits.xml` | Undocumented consumer; indexed only in this lane |
| `MentalStateDef` | 49 | `Data/Anomaly/Defs/MentalStateDefs/MentalStates_Mood.xml` | Undocumented consumer; indexed only in this lane |
| `MessageTypeDef` | 12 | `Data/Core/Defs/Misc/MessageTypeDefs/MessageTypeDef.xml` | Undocumented consumer; indexed only in this lane |
| `MonolithLevelDef` | 7 | `Data/Anomaly/Defs/Misc/MonolithLevels.xml` | Undocumented consumer; indexed only in this lane |
| `MusicSequenceDef` | 8 | `Data/Anomaly/Defs/Misc/Music/Music_Sequences.xml` | Undocumented consumer; indexed only in this lane |
| `MusicTransitionDef` | 9 | `Data/Anomaly/Defs/Misc/Music/Music_Transitions.xml` | Undocumented consumer; indexed only in this lane |
| `MutantDef` | 4 | `Data/Anomaly/Defs/Misc/Mutants.xml` | Undocumented consumer; indexed only in this lane |
| `NeedDef` | 25 | `Data/Biotech/Defs/NeedDefs/Needs.xml` | Undocumented consumer; indexed only in this lane |
| `NegativeFishingOutcomeDef` | 11 | `Data/Odyssey/Defs/Misc/NegativeFishingOutcomes.xml` | Undocumented consumer; indexed only in this lane |
| `OptionCategoryDef` | 8 | `Data/Core/Defs/Misc/OptionCategoryDefs/OptionCategories.xml` | Undocumented consumer; indexed only in this lane |
| `OrbitalDebrisDef` | 3 | `Data/Odyssey/Defs/OrbitalDebrisDefs/OrbitalDebris.xml` | Undocumented consumer; indexed only in this lane |
| `OrderedTakeGroupDef` | 2 | `Data/Core/Defs/Misc/OrderedTakeGroupDefs/OrderedTakeGroupDefs.xml` | Undocumented consumer; indexed only in this lane |
| `PathGridDef` | 3 | `Data/Core/Defs/PathGridDefs/PathGrids.xml` | Undocumented consumer; indexed only in this lane |
| `PawnCapacityDef` | 11 | `Data/Core/Defs/PawnCapacityDefs/PawnCapacity.xml` | Undocumented consumer; indexed only in this lane |
| `PawnColumnDef` | 52 | `Data/Biotech/Defs/PawnColumnDefs/PawnColumns_Icon.xml` | Undocumented consumer; indexed only in this lane |
| `PawnGroupKindDef` | 20 | `Data/Anomaly/Defs/PawnGroupKindDefs/PawnGroupKinds.xml` | Undocumented consumer; indexed only in this lane |
| `PawnKindDef` | 333 | `Data/Anomaly/Defs/PawnKinds/PawnKinds_Entities.xml` | Undocumented consumer; indexed only in this lane |
| `PawnRelationDef` | 28 | `Data/Biotech/Defs/PawnRelationDefs/PawnRelations_FamiltyByBlood.xml` | Undocumented consumer; indexed only in this lane |
| `PawnRenderNodeTagDef` | 5 | `Data/Core/Defs/PawnRenderTreeDefs/PawnRenderNodeTagDefs.xml` | Undocumented consumer; indexed only in this lane |
| `PawnRenderTreeDef` | 11 | `Data/Anomaly/Defs/PawnRenderTreeDefs/PawnRenderTreeDefs.xml` | Undocumented consumer; indexed only in this lane |
| `PawnTableDef` | 6 | `Data/Biotech/Defs/PawnTableDefs/PawnTables.xml` | Undocumented consumer; indexed only in this lane |
| `PawnsArrivalModeDef` | 13 | `Data/Anomaly/Defs/Misc/PawnArrivalModeDefs/PawnArrivalModes.xml` | Undocumented consumer; indexed only in this lane |
| `PitGateIncidentDef` | 1 | `Data/Anomaly/Defs/Misc/PitGateIncidentDefs/PitGateIncidentDefs.xml` | Undocumented consumer; indexed only in this lane |
| `PlaceDef` | 20 | `Data/Ideology/Defs/Misc/PlaceDefs/Places.xml` | Undocumented consumer; indexed only in this lane |
| `PlanetLayerDef` | 3 | `Data/Core/Defs/PlanetLayerDefs/PlanetLayers.xml` | Undocumented consumer; indexed only in this lane |
| `PlanetLayerSettingsDef` | 2 | `Data/Core/Defs/Misc/WorldLayerSettingsDefs/PlanetLayerSettings.xml` | Undocumented consumer; indexed only in this lane |
| `PreceptDef` | 223 | `Data/Anomaly/Defs/PreceptDefs/Precepts_Inhumanizing.xml` | Undocumented consumer; indexed only in this lane |
| `PrefabDef` | 176 | `Data/Biotech/Defs/PrefabDefs/CommonRoomPrefabs.xml` | Undocumented consumer; indexed only in this lane |
| `PrisonerInteractionModeDef` | 12 | `Data/Anomaly/Defs/PrisonerInteractionModeDefs/PrisonerInteractionModeDefs.xml` | Undocumented consumer; indexed only in this lane |
| `PsychicRitualDef_BloodRain` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | Undocumented consumer; indexed only in this lane |
| `PsychicRitualDef_Brainwipe` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | Undocumented consumer; indexed only in this lane |
| `PsychicRitualDef_Chronophagy` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | Undocumented consumer; indexed only in this lane |
| `PsychicRitualDef_ImbueDeathRefusal` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | Undocumented consumer; indexed only in this lane |
| `PsychicRitualDef_NeurosisPulse` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | Undocumented consumer; indexed only in this lane |
| `PsychicRitualDef_Philophagy` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | Undocumented consumer; indexed only in this lane |
| `PsychicRitualDef_PleasurePulse` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | Undocumented consumer; indexed only in this lane |
| `PsychicRitualDef_Psychophagy` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | Undocumented consumer; indexed only in this lane |
| `PsychicRitualDef_SkipAbduction` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | Undocumented consumer; indexed only in this lane |
| `PsychicRitualDef_SkipAbductionPlayer` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | Undocumented consumer; indexed only in this lane |
| `PsychicRitualDef_SummonAnimals` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | Undocumented consumer; indexed only in this lane |
| `PsychicRitualDef_SummonFleshbeasts` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | Undocumented consumer; indexed only in this lane |
| `PsychicRitualDef_SummonFleshbeastsPlayer` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | Undocumented consumer; indexed only in this lane |
| `PsychicRitualDef_SummonPitGate` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | Undocumented consumer; indexed only in this lane |
| `PsychicRitualDef_SummonShamblers` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | Undocumented consumer; indexed only in this lane |
| `PsychicRitualDef_VoidProvocation` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | Undocumented consumer; indexed only in this lane |
| `PsychicRitualRoleDef` | 9 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRitualRoles.xml` | Undocumented consumer; indexed only in this lane |
| `PsychicRitualRoleDef_DeathRefusalTarget` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRitualRoles.xml` | Undocumented consumer; indexed only in this lane |
| `QuestScriptDef` | 156 | `Data/Anomaly/Defs/QuestScriptDefs/Script_CreepjoinerJoins.xml` | Feature indexed only; this A02/D2 framework |
| `RaidAgeRestrictionDef` | 1 | `Data/Biotech/Defs/Storyteller/RaidAgeRestrictions.xml` | Undocumented consumer; indexed only in this lane |
| `RaidStrategyDef` | 12 | `Data/Anomaly/Defs/RaidStrategyDefs/RaidStrategies_Misc.xml` | Undocumented consumer; indexed only in this lane |
| `RecipeDef` | 214 | `Data/Anomaly/Defs/HediffDefs/Hediffs_BodyParts_Prosthetic.xml` | Root production + feature bills |
| `RecordDef` | 70 | `Data/Anomaly/Defs/RecordDefs/Records_Misc.xml` | Undocumented consumer; indexed only in this lane |
| `RenderSkipFlagDef` | 7 | `Data/Core/Defs/MapMeshFlagDefs/RenderSkipFlagDefs.xml` | Undocumented consumer; indexed only in this lane |
| `ResearchProjectDef` | 168 | `Data/Anomaly/Defs/ResearchProjectDefs/ResearchProjects_Anomaly.xml` | Feature research/techprints |
| `ResearchProjectTagDef` | 5 | `Data/Core/Defs/Misc/ResearchProjectTagDefs/ResearchProjectTagDefs.xml` | Undocumented consumer; indexed only in this lane |
| `ResearchTabDef` | 2 | `Data/Anomaly/Defs/ResearchTabDefs/ResearchTabs.xml` | Undocumented consumer; indexed only in this lane |
| `ReservationLayerDef` | 3 | `Data/Core/Defs/Misc/ReservationLayerDefs/ReservationLayerDefs.xml` | Undocumented consumer; indexed only in this lane |
| `RitualAttachableOutcomeEffectDef` | 7 | `Data/Ideology/Defs/PreceptDefs/Ritual_AttachableOutcomes_Special.xml` | Undocumented consumer; indexed only in this lane |
| `RitualBehaviorDef` | 27 | `Data/Biotech/Defs/Rituals/Ritual_Behaviors.xml` | Undocumented consumer; indexed only in this lane |
| `RitualObligationTargetFilterDef` | 21 | `Data/Biotech/Defs/Rituals/Ritual_Targets.xml` | Undocumented consumer; indexed only in this lane |
| `RitualOutcomeEffectDef` | 31 | `Data/Biotech/Defs/Rituals/Ritual_Outcomes.xml` | Undocumented consumer; indexed only in this lane |
| `RitualPatternDef` | 31 | `Data/Biotech/Defs/Rituals/Ritual_Patterns.xml` | Undocumented consumer; indexed only in this lane |
| `RitualTargetFilterDef` | 7 | `Data/Ideology/Defs/Rituals/Ritual_Targets.xml` | Undocumented consumer; indexed only in this lane |
| `RitualVisualEffectDef` | 20 | `Data/Core/Defs/RitualEffectDefs/RitualEffectDefs.xml` | Undocumented consumer; indexed only in this lane |
| `RiverDef` | 4 | `Data/Core/Defs/RiverDefs/RiverDefs.xml` | Undocumented consumer; indexed only in this lane |
| `RoadDef` | 5 | `Data/Core/Defs/RoadDefs/RoadDefs.xml` | Undocumented consumer; indexed only in this lane |
| `RoadPathingDef` | 2 | `Data/Core/Defs/RoadDefs/RoadPathingDefs.xml` | Undocumented consumer; indexed only in this lane |
| `RoadWorldLayerDef` | 5 | `Data/Core/Defs/RoadDefs/RoadWorldLayerDefs.xml` | Undocumented consumer; indexed only in this lane |
| `RoofDef` | 4 | `Data/Anomaly/Defs/Misc/Roofs.xml` | Undocumented consumer; indexed only in this lane |
| `RoomPartDef` | 12 | `Data/Odyssey/Defs/RoomPartDefs/RoomParts_Common.xml` | Undocumented consumer; indexed only in this lane |
| `RoomPart_BarricadeDef` | 1 | `Data/Odyssey/Defs/RoomPartDefs/RoomParts_Common.xml` | Undocumented consumer; indexed only in this lane |
| `RoomPart_CrateDef` | 2 | `Data/Odyssey/Defs/RoomPartDefs/RoomParts_Common.xml` | Undocumented consumer; indexed only in this lane |
| `RoomPart_GestationTankDef` | 1 | `Data/Odyssey/Defs/RoomPartDefs/RoomParts_Common.xml` | Undocumented consumer; indexed only in this lane |
| `RoomPart_ThingDef` | 6 | `Data/Odyssey/Defs/RoomPartDefs/RoomParts_Common.xml` | Undocumented consumer; indexed only in this lane |
| `RoomRoleDef` | 23 | `Data/Anomaly/Defs/Rooms/RoomRoles.xml` | Undocumented consumer; indexed only in this lane |
| `RoomStatDef` | 13 | `Data/Biotech/Defs/Rooms/RoomStats.xml` | Undocumented consumer; indexed only in this lane |
| `RoyalTitleDef` | 13 | `Data/Royalty/Defs/RoyalTitles/RoyalTitles_Empire.xml` | Undocumented consumer; indexed only in this lane |
| `RoyalTitlePermitDef` | 16 | `Data/Royalty/Defs/RoyalTitles/RoyalPermits_Empire.xml` | Undocumented consumer; indexed only in this lane |
| `RuleDef` | 112 | `Data/Anomaly/Defs/RuleDefs/Rules_Complex.xml` | Undocumented consumer; indexed only in this lane |
| `RulePackDef` | 340 | `Data/Anomaly/Defs/InteractionDefs/Interactions_Misc.xml` | Feature indexed only; this A01/D1 |
| `ScatterableDef` | 12 | `Data/Core/Defs/Misc/ScatterableDefs/Scatterables.xml` | Undocumented consumer; indexed only in this lane |
| `ScenPartDef` | 41 | `Data/Anomaly/Defs/Scenarios/ScenParts_Various.xml` | Undocumented consumer; indexed only in this lane |
| `ScenarioDef` | 10 | `Data/Anomaly/Defs/Scenarios/Scenarios.xml` | Undocumented consumer; indexed only in this lane |
| `ShaderDef` | 194 | `Data/Core/Defs/ShaderDefs/Shaders.Map.xml` | Undocumented consumer; indexed only in this lane |
| `ShaderTypeDef` | 122 | `Data/Anomaly/Defs/Misc/ShaderTypeDefs/ShaderTypes.xml` | Undocumented consumer; indexed only in this lane |
| `ShipJobDef` | 7 | `Data/Core/Defs/ShipJobDefs/ShipJobDefs.xml` | Undocumented consumer; indexed only in this lane |
| `SitePartDef` | 64 | `Data/Anomaly/Defs/Sites/DistressCall.xml` | Undocumented consumer; indexed only in this lane |
| `SketchResolverDef` | 33 | `Data/Biotech/Defs/SketchResolverDefs/SketchResolvers.xml` | Undocumented consumer; indexed only in this lane |
| `SkillDef` | 12 | `Data/Core/Defs/SkillDefs/Skills.xml` | Undocumented consumer; indexed only in this lane |
| `SlaveInteractionModeDef` | 5 | `Data/Ideology/Defs/SlaveInteractionModeDefs/SlaveInteractionMode.xml` | Undocumented consumer; indexed only in this lane |
| `SongDef` | 77 | `Data/Anomaly/Defs/Misc/SongDefs/Songs_Sequences.xml` | Undocumented consumer; indexed only in this lane |
| `SoundDef` | 1233 | `Data/Anomaly/Defs/SoundDefs/Buildings_Fleshmass.xml` | Undocumented consumer; indexed only in this lane |
| `SpecialThingFilterDef` | 49 | `Data/Anomaly/Defs/SpecialThingFilterDefs/SpecialThingFilters.xml` | Undocumented consumer; indexed only in this lane |
| `StatCategoryDef` | 40 | `Data/Anomaly/Defs/StatDefs/Stats_Containment.xml` | Undocumented consumer; indexed only in this lane |
| `StatDef` | 256 | `Data/Anomaly/Defs/StatDefs/Stats_Containment.xml` | Root material; feature learning/body |
| `StorytellerDef` | 5 | `Data/Core/Defs/Storyteller/Storytellers.xml` | Root storyteller |
| `StructureLayoutDef` | 33 | `Data/Odyssey/Defs/LayoutDefs/Layouts_AncientRuins.xml` | Undocumented consumer; indexed only in this lane |
| `StructureStructureLayoutDef` | 1 | `Data/Odyssey/Defs/LayoutDefs/Layouts_OrbitalPlatform.xml` | Undocumented consumer; indexed only in this lane |
| `StuffAppearanceDef` | 4 | `Data/Core/Defs/Misc/StuffAppearanceDefs/StuffAppearances.xml` | Undocumented consumer; indexed only in this lane |
| `StuffCategoryDef` | 6 | `Data/Anomaly/Defs/StuffCategoryDefs/StuffCategories.xml` | Undocumented consumer; indexed only in this lane |
| `StyleCategoryDef` | 11 | `Data/Anomaly/Defs/StyleCategoryDefs/StyleCategoryDefs.xml` | Undocumented consumer; indexed only in this lane |
| `StyleItemCategoryDef` | 12 | `Data/Anomaly/Defs/HairDefs/HairsCultist.xml` | Undocumented consumer; indexed only in this lane |
| `SubcameraDef` | 2 | `Data/Core/Defs/Misc/SubcameraDefs/Subcameras.xml` | Undocumented consumer; indexed only in this lane |
| `SurgeryOutcomeEffectDef` | 3 | `Data/Biotech/Defs/RecipeDefs/SurgeryOutcomeEffectDefs.xml` | Undocumented consumer; indexed only in this lane |
| `TaleDef` | 101 | `Data/Anomaly/Defs/TaleDefs/Tales_Double.xml` | Undocumented consumer; indexed only in this lane |
| `TattooDef` | 31 | `Data/Core/Defs/TattooDefs/TattooDefs.xml` | Undocumented consumer; indexed only in this lane |
| `TerrainAffordanceDef` | 12 | `Data/Core/Defs/Misc/TerrainAffordanceDefs/TerrainAffordances.xml` | Undocumented consumer; indexed only in this lane |
| `TerrainDef` | 138 | `Data/Anomaly/Defs/TerrainDefs/Terrain_Floors.xml` | Undocumented consumer; indexed only in this lane |
| `TerrainTemplateDef` | 5 | `Data/Core/Defs/TerrainDefs/Terrain_Floors.xml` | Undocumented consumer; indexed only in this lane |
| `ThingCategoryDef` | 78 | `Data/Anomaly/Defs/ThingCategoryDefs/ThingCategories.xml` | Undocumented consumer; indexed only in this lane |
| `ThingDef` | 2055 | `Data/Anomaly/Defs/AbilityDefs/Abilities.xml` | Root material/production + feature body/items |
| `ThingSetMakerDef` | 52 | `Data/Anomaly/Defs/ThingSetMakerDefs/ThingSetMakers_MapGen.xml` | Undocumented consumer; indexed only in this lane |
| `ThingStyleDef` | 126 | `Data/Anomaly/Defs/ThingStyleDefs/ThingStyleDefs.xml` | Undocumented consumer; indexed only in this lane |
| `ThinkTreeDef` | 61 | `Data/Anomaly/Defs/ThinkTreeDefs/AwokenCorpse.xml` | Undocumented consumer; indexed only in this lane |
| `ThoughtDef` | 934 | `Data/Anomaly/Defs/PreceptDefs/Precepts_Inhumanizing.xml` | Root social/needs |
| `TileMutatorDef` | 95 | `Data/Core/Defs/MapGeneration/TileMutators.xml` | Undocumented consumer; indexed only in this lane |
| `TimeAssignmentDef` | 5 | `Data/Core/Defs/Misc/TimeAssignmentDefs/TimeAssignments.xml` | Undocumented consumer; indexed only in this lane |
| `TipSetDef` | 6 | `Data/Anomaly/Defs/TipSetDefs/Tips.xml` | Undocumented consumer; indexed only in this lane |
| `ToolCapacityDef` | 13 | `Data/Biotech/Defs/ToolCapacityDefs/ToolCapacityDefs.xml` | Undocumented consumer; indexed only in this lane |
| `TraderKindDef` | 20 | `Data/Core/Defs/TraderKindDefs/TraderKinds_Base_Neolithic.xml` | Undocumented consumer; indexed only in this lane |
| `TrainabilityDef` | 3 | `Data/Core/Defs/Misc/TrainabilityDefs/TrainabilityDefs.xml` | Undocumented consumer; indexed only in this lane |
| `TrainableDef` | 14 | `Data/Core/Defs/TrainableDefs/Trainables.xml` | Undocumented consumer; indexed only in this lane |
| `TraitDef` | 51 | `Data/Anomaly/Defs/TraitDefs/Traits.xml` | Undocumented consumer; indexed only in this lane |
| `TransferableSorterDef` | 7 | `Data/Core/Defs/Misc/TradeDialogSorterDefs/TransferableSorters.xml` | Undocumented consumer; indexed only in this lane |
| `TransportShipDef` | 4 | `Data/Biotech/Defs/TransportShipDefs/TransportShipDefs.xml` | Undocumented consumer; indexed only in this lane |
| `WeaponCategoryDef` | 16 | `Data/Odyssey/Defs/WeaponTraitDefs/WeaponCategoryDefs.xml` | Undocumented consumer; indexed only in this lane |
| `WeaponClassDef` | 10 | `Data/Core/Defs/WeaponClassDefs/WeaponClassDefs.xml` | Undocumented consumer; indexed only in this lane |
| `WeaponClassPairDef` | 5 | `Data/Ideology/Defs/WeaponClassPairDefs/WeaponClassPairDefs.xml` | Undocumented consumer; indexed only in this lane |
| `WeaponTraitDef` | 62 | `Data/Odyssey/Defs/WeaponTraitDefs/WeaponTraitDefs.xml` | Undocumented consumer; indexed only in this lane |
| `WeatherDef` | 25 | `Data/Anomaly/Defs/WeatherDefs/Weathers.xml` | Undocumented consumer; indexed only in this lane |
| `WorkGiverDef` | 154 | `Data/Anomaly/Defs/WorkGivers/WorkGivers.xml` | Root jobs + feature blockers/bills |
| `WorkGiverEquivalenceGroupDef` | 3 | `Data/Core/Defs/Misc/WorkGiverEquivalenceGroupDef/WorkGiverEquivalenceGroup.xml` | Undocumented consumer; indexed only in this lane |
| `WorkTypeDef` | 23 | `Data/Anomaly/Defs/WorkTypeDefs/WorkTypes.xml` | Undocumented consumer; indexed only in this lane |
| `WorldGenStepDef` | 12 | `Data/Biotech/Defs/WorldGeneration/WorldGenerator.xml` | Undocumented consumer; indexed only in this lane |
| `WorldObjectDef` | 38 | `Data/Core/Defs/Storyteller/Incidents_Caravan_All.xml` | Undocumented consumer; indexed only in this lane |
| `XenotypeDef` | 12 | `Data/Biotech/Defs/GeneDefs/XenotypeDefs.xml` | Undocumented consumer; indexed only in this lane |
| `XenotypeIconDef` | 11 | `Data/Biotech/Defs/GeneDefs/XenotypeIconDefs.xml` | Undocumented consumer; indexed only in this lane |
| `jobDef` | 6 | `Data/Biotech/Defs/JobDefs/Jobs_Learning.xml` | Undocumented consumer; indexed only in this lane |

## Gameplay class namespaces

Top-level class counts exclude nested/compiler classes and do not equal the old 9,213 exported C# file count. Full type enumeration has 15247 entries.

| Namespace | Top-level classes | Disposition |
| --- | ---: | --- |
| `` | 29 | Indexed only; unread |
| `DelaunatorSharp` | 1 | Indexed only; unread |
| `Ionic.Crc` | 2 | Indexed only; unread |
| `Ionic.Zlib` | 20 | Indexed only; unread |
| `KTrie` | 4 | Indexed only; unread |
| `LudeonTK` | 44 | Indexed only; unread |
| `RimWorld` | 5670 | Selected routes above; most classes unread |
| `RimWorld.BaseGen` | 124 | Selected routes above; most classes unread |
| `RimWorld.IO` | 8 | Selected routes above; most classes unread |
| `RimWorld.Planet` | 287 | Selected routes above; most classes unread |
| `RimWorld.QuestGen` | 377 | Selected routes above; most classes unread |
| `RimWorld.SketchGen` | 36 | Selected routes above; most classes unread |
| `RimWorld.Utility` | 2 | Selected routes above; most classes unread |
| `Unity.Collections` | 1 | Indexed only; unread |
| `Verse` | 1543 | Selected routes above; most classes unread |
| `Verse.AI` | 263 | Selected routes above; most classes unread |
| `Verse.AI.Group` | 126 | Selected routes above; most classes unread |
| `Verse.Grammar` | 8 | Selected routes above; most classes unread |
| `Verse.Noise` | 50 | Selected routes above; most classes unread |
| `Verse.Profile` | 1 | Selected routes above; most classes unread |
| `Verse.ProfilerUI` | 29 | Selected routes above; most classes unread |
| `Verse.Sound` | 56 | Selected routes above; most classes unread |
| `Verse.Steam` | 12 | Selected routes above; most classes unread |
| `Verse.Utility` | 1 | Selected routes above; most classes unread |

## Code family size signals

These overlapping prefixes expose large subdomains hidden inside broad Def tags. Every individual type remains searchable privately.

| Prefix | Top-level type names matching | Review state |
| --- | ---: | --- |
| `QuestPart_` | 244 | Selected named traces only; other implementations unread |
| `QuestNode_` | 301 | Selected named traces only; other implementations unread |
| `JobDriver_` | 302 | Selected named traces only; other implementations unread |
| `WorkGiver_` | 142 | Selected named traces only; other implementations unread |
| `ThinkNode_` | 126 | Selected named traces only; other implementations unread |
| `Hediff` | 228 | Selected named traces only; other implementations unread |
| `Gene_` | 11 | Selected named traces only; other implementations unread |
| `Comp` | 847 | Selected named traces only; other implementations unread |
| `IncidentWorker_` | 95 | Selected named traces only; other implementations unread |
| `MainTabWindow_` | 15 | Selected named traces only; other implementations unread |
| `Dialog_` | 124 | Selected named traces only; other implementations unread |
| `LordJob_` | 71 | Selected named traces only; other implementations unread |
| `LordToil_` | 87 | Selected named traces only; other implementations unread |
| `StatPart_` | 73 | Selected named traces only; other implementations unread |
| `Ability` | 10 | Selected named traces only; other implementations unread |
| `GameCondition_` | 32 | Selected named traces only; other implementations unread |

Top payoff gaps were dialogue grammar and choices, quest lifecycle and save compatibility/autosave. [DEEPER_SYSTEMS](DEEPER_SYSTEMS.md) now traces those frameworks; complete scripts/converters and the other indexed families remain open. No other lane's unlinked research is assumed absent: prior documentation claims refer only to the read root and feature dossiers.

# System inventory

**SHOWN census:** 14,084 raw Def children across 254 families. Three PlanetLayerDef rows include one abstract parent; five StorytellerDef rows include abstract/debug authoring. Counts include inactive DLC content, inherited/abstract records and duplicates. They are not effective active-content counts. Explicit recipes exclude recipes generated from ThingDef recipeMaker. Full fields and IDs are private in FULL_DEF_RECORDS.json.

Every discovered Def family is listed below. It is an authoring taxonomy, not a claim that every family is a separate runtime system. For DLL-only and cross-cutting systems the next table names the discovered route and unread status. The prior pass's full family inventory remains [available read-only](../../aspects-2026-10-14/SYSTEM_INVENTORY.md); this pass does not replace it.

| Runtime system | Where / size signal | Documentation status |
|---|---|---|
| Moving colony and infrastructure | Gravship/controller/utility/placement; 4 primary exports plus engine and layers | Deep selected transfer/admission/persistence, ODYSSEY |
| Layer/environment/travel | PlanetLayer/PlanetLayerDef/OrbitLayer/VacuumUtility; 3 raw layer records | Deep selected consumers, full generation unread |
| Genes and offspring | Pawn_GeneTracker/Gene/PregnancyUtility; 203 GeneDef and 12 XenotypeDef raw rows | Deep selected inheritance/expression; all gene workers unread |
| Childhood, learning and age | AgeTracker/GrowthUtility/Need_Learning; 7 desire records, 9 code tiers | Deep selected growth and admission; every activity consumer unread |
| Belief, office and ritual | Ideo/Meme/Precept/role/ritual; 38 memes and 223 precepts raw | Deep selected shared readers; full belief content partial |
| Subject study/knowledge/containment | CompStudiable/StudyManager/ResearchManager/HoldingPlatform; 2 knowledge categories, 168 research records across modules | Deep selected route; all entity special cases unread |
| Work scheduling and execution | WorkSettings/JobGiver_Work/WorkGiver_DoBill/Toils_Recipe | Deep selected priority/bill chain; other jobs unread |
| Production and stock policy | Bill_Production/RecipeWorkerCounter/GenRecipe; 214 explicit RecipeDef rows | Deep selected butchery/meal/drug/smelt routes; dynamic recipes unresolved |
| Event pacing | Storyteller/comp/IncidentWorker/StoryState/Population/IncidentCycle | Deep two schedules and generic firing; all incident bodies unread |
| Ticks/time/calendar | TickManager shared maps and world; biological age and interval jobs | Bounded deep, complete calendar/away policies unread |
| Saves/migrations/autosave | Scribe/Game/SafeSaver/compatibility | Prior 1.7 aspect deep framework; new subsystem payload readers partial; no runtime |
| Social grammar/faction conversation | Interaction workers, grammar, DiaNode/DiaOption | Prior 1.7 aspect deep representative routes; not new exhaustive read |
| Quests/letters/journals | Quest/QuestPart/signal/LetterStack | Prior 1.7 aspect deep lifecycle plus new study/ritual reports; scripts partial |
| Engine host/content loader/mod patches | RimWorldWaylith/Verse roots/LoadedModManager | Prior 1.7 aspect inspected; effective activation unrun |
| Combat/body/medicine/equipment | Damage/Hediff/Body/Ability/Stat/Thing families | Raw inventory + selected stat/vacuum/gene readers only; broad consumers UNREAD |
| Royalty, titles, psycasts, permits | DLC Data/Royalty and ability/quest/title families | Prior inventory, full consumers UNREAD |
| Faction economy, trade, diplomacy | Faction/Trader/PawnGroup/world objects | Prior selected faction dialogue; autonomous economy UNREAD |
| Map/world generation, pathfinding, ecology | GenStep/WorldGenStep/Biome/Terrain/Plant/animal/lord families | Selected layer/route entry only; full bodies UNREAD |
| Rendering/audio/input/accessibility | Fleck/Effecter/Sound/UI defs and engine drawing classes | Source pointers/prior inventory; native behavior UNRUN |
| Other DLC/mech/psychic-rutual/ending systems | Def families below plus DLL type inventory | Indexed; specific consumers UNREAD unless named in digests |

## Complete raw family catalogue

Private `notes/TYPES.txt` retains the whole previous pinned class index read-only copied for lookup. A type name alone is not read or runtime evidence. Every family not mapped below is explicitly **UNREAD in this deep pass**, with prior coverage kept in the prior inventory.

| Family | Raw rows | Example source XML | Deep-pass status |
|---|---:|---|---|
| AbilityCategoryDef | 4 | `Data/Biotech/Defs/AbilityDefs/Abilities.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| AbilityDef | 107 | `Data/Anomaly/Defs/AbilityDefs/Abilities.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| AbilityGroupDef | 3 | `Data/Ideology/Defs/AbilityDefs/Abilities.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| AnimationDef | 13 | `Data/Anomaly/Defs/AnimationDefs/DeathRefusal.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| AnomalyPlaystyleDef | 3 | `Data/Anomaly/Defs/AnomalyPlaystyles/AnomalyPlaystyles.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ApparelLayerDef | 6 | `Data/Core/Defs/Misc/ApparelLayerDefs/ApparelLayerDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| BabyPlayDef | 3 | `Data/Biotech/Defs/BabyPlayDefs/BabyPlay.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| BackStoryDef | 1 | `Data/Core/Defs/BackstoryDefs/Solid/Solid_Rare.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| BackstoryDef | 845 | `Data/Anomaly/Defs/BackstoryDefs/Solid/Solid.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| BeardDef | 42 | `Data/Biotech/Defs/BeardDefs/BeardDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| BillRepeatModeDef | 3 | `Data/Core/Defs/Misc/BillDefs/BillRepeatModeDefs.xml` | Selected consumers documented: WORK_AND_PRODUCTION.md |
| BillStoreModeDef | 3 | `Data/Core/Defs/Misc/BillDefs/BillStoreModeDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| BiomeDef | 25 | `Data/Anomaly/Defs/MapGeneration/LabyrinthMapGenerator.xml` | Selected consumers documented: ODYSSEY.md |
| BodyDef | 48 | `Data/Anomaly/Defs/Bodies/Bodies_Entities.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| BodyPartDef | 147 | `Data/Anomaly/Defs/Bodies/Bodies_Entities.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| BodyPartGroupDef | 48 | `Data/Anomaly/Defs/Bodies/Bodies_Entities.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| BodyPartTagDef | 25 | `Data/Core/Defs/Misc/BodyPartTagDefs/BodyPartTagDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| BodyTypeDef | 8 | `Data/Biotech/Defs/Misc/BodyTypeDefs/BodyTypes.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| BossDef | 3 | `Data/Biotech/Defs/BossgroupDefs/Bossgroups.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| BossgroupDef | 4 | `Data/Biotech/Defs/BossgroupDefs/Bossgroups.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ChemicalDef | 8 | `Data/Core/Defs/Drugs/Alcohol_Beer.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ClamorDef | 6 | `Data/Biotech/Defs/Misc/ClamorDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ColorDef | 140 | `Data/Core/Defs/ColorDefs/ColorDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ComplexLayoutDef | 3 | `Data/Biotech/Defs/LayoutDefs/Layouts_Misc.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ComplexThreatDef | 11 | `Data/Core/Defs/ComplexThreatDefs/ComplexThreats_Misx.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ConceptDef | 86 | `Data/Anomaly/Defs/Tutor/Tutor.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| CreepJoinerAggressiveDef | 3 | `Data/Anomaly/Defs/CreepjoinerDefs/Aggressive.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| CreepJoinerBenefitDef | 10 | `Data/Anomaly/Defs/CreepjoinerDefs/Benefits.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| CreepJoinerDownsideDef | 9 | `Data/Anomaly/Defs/CreepjoinerDefs/Downsides.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| CreepJoinerFormKindDef | 9 | `Data/Anomaly/Defs/CreepjoinerDefs/Forms.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| CreepjoinerRejectionDef | 2 | `Data/Anomaly/Defs/CreepjoinerDefs/Rejections.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| CultureDef | 5 | `Data/Core/Defs/CultureDefs/Cultures.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| DamageArmorCategoryDef | 3 | `Data/Core/Defs/Misc/DamageArmorCategoryDef/DamageArmorCategoryDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| DamageDef | 53 | `Data/Anomaly/Defs/DamageDefs/Damages_Environmental.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| DebugTabMenuDef | 3 | `Data/Core/Defs/DebugTabMenuDefs/DebugTabMenuDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| DesignationCategoryDef | 16 | `Data/Anomaly/Defs/Misc/DesignationCategories.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| DesignationDef | 27 | `Data/Core/Defs/Misc/Designations/Designations.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| DesignatorDropdownGroupDef | 13 | `Data/Core/Defs/Misc/DesignatorDropdownGroupDef/DesignatorDropdownGroupDef.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| DifficultyDef | 7 | `Data/Core/Defs/Misc/DifficultyDefs/Difficulties.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| DrawStyleCategoryDef | 19 | `Data/Core/Defs/DrawStyleCategoryDefs/DrawStyleCategories.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| DrawStyleDef | 6 | `Data/Core/Defs/DrawStyleDefs/DrawStyles.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| DrugPolicyDef | 4 | `Data/Core/Defs/DrugPolicyDefs/DrugPolicyDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| DutyDef | 108 | `Data/Anomaly/Defs/DutyDefs/Duties_Misc.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| EffecterDef | 285 | `Data/Anomaly/Defs/Effects/Effecter_Misc.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| EntityCategoryDef | 3 | `Data/Anomaly/Defs/EntityCategoryDefs/EntityCategories.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| EntityCodexEntryDef | 27 | `Data/Anomaly/Defs/EntityCodexEntryDefs/EntityCodexEntryDefs.xml` | Selected consumers documented: ANOMALY.md |
| ExpansionDef | 6 | `Data/Core/Defs/Misc/ExpansionDefs/ExpansionDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ExpectationDef | 10 | `Data/Core/Defs/Misc/ExpectationDefs/Expectations.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| FactionDef | 39 | `Data/Anomaly/Defs/FactionDefs/Factions_Misc.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| FeatureDef | 25 | `Data/Core/Defs/Misc/FeatureDefs/Features.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| FleckDef | 327 | `Data/Anomaly/Defs/Effects/Fleck_Visual.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| FleshTypeDef | 7 | `Data/Anomaly/Defs/Misc/FleshTypeDefs/FleshType.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| FurDef | 1 | `Data/Biotech/Defs/Misc/FurDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| GameConditionDef | 38 | `Data/Anomaly/Defs/GameConditionDefs/GameConditions_Misc.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| GameSetupStepDef | 4 | `Data/Core/Defs/Misc/GameSetupStepDefs/GameSetupSteps.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| GatheringDef | 3 | `Data/Core/Defs/GatheringDefs/Gatherings.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| GauranlenTreeModeDef | 7 | `Data/Ideology/Defs/GauranlenTreeModDefs/GauranlenTreeModeDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| GenStepDef | 170 | `Data/Anomaly/Defs/MapGeneration/BasePlayerMapGenerator.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| GeneCategoryDef | 21 | `Data/Biotech/Defs/GeneDefs/GeneCategoryDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| GeneDef | 203 | `Data/Biotech/Defs/GeneDefs/GeneDefs_Abilities.xml` | Selected consumers documented: BIOTECH.md |
| GeneTemplateDef | 9 | `Data/Biotech/Defs/GeneDefs/GeneTemplateDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| GeneratedLocationDef | 1 | `Data/Odyssey/Defs/GeneratedLocationDefs/GeneratedLocations.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| GlobalWorldDrawLayerDef | 2 | `Data/Core/Defs/GlobalWorldDrawLayerDefs/GlobalWorldDrawLayers.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| GoodwillSituationDef | 39 | `Data/Core/Defs/Goodwill/GoodwillSituations_Misc.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| GraphicStateDef | 2 | `Data/Core/Defs/GraphicStateDefs/GraphicStates.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| GravshipComponentTypeDef | 5 | `Data/Odyssey/Defs/ThingDefs_Buildings/Buildings_Gravship.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| HairDef | 82 | `Data/Anomaly/Defs/HairDefs/HairsCultist.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| HeadTypeDef | 43 | `Data/Anomaly/Defs/Misc/HeadTypes.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| HediffDef | 345 | `Data/Anomaly/Defs/HediffDefs/Hediffs_BodyParts_Prosthetic.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| HediffGiverSetDef | 4 | `Data/Anomaly/Defs/HediffGiverSetDefs/HediffGiverSetDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| HibernatableStateDef | 3 | `Data/Core/Defs/Misc/HibernatableStateDefs/HibernatableStateDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| HistoryAutoRecorderDef | 11 | `Data/Core/Defs/Misc/HistoryAutoRecording/HistoryAutoRecorders.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| HistoryAutoRecorderGroupDef | 4 | `Data/Core/Defs/Misc/HistoryAutoRecording/HistoryAutoRecorderGroups.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| HistoryEventDef | 172 | `Data/Anomaly/Defs/Misc/HistoryEventDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| IdeoColorDef | 33 | `Data/Ideology/Defs/IdeoSymbolDefs/IdeoColorDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| IdeoFoundationDef | 1 | `Data/Ideology/Defs/IdeoFoundationDefs/IdeoFoundations.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| IdeoIconDef | 94 | `Data/Ideology/Defs/IdeoSymbolDefs/IdeoIconDefs_Specific.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| IdeoPresetCategoryDef | 6 | `Data/Ideology/Defs/PreconfiguredIdeos/IdeoPresetDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| IdeoPresetDef | 25 | `Data/Anomaly/Defs/PreconfiguredIdeos/IdeoPresetDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| IdeoStoryPatternDef | 6 | `Data/Ideology/Defs/RulePackDefs/RulePacks_Ideo_Description.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ImpactSoundTypeDef | 7 | `Data/Biotech/Defs/ImpactSoundTypeDefs/ImpactSoundTypeDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ImplementOwnerTypeDef | 5 | `Data/Core/Defs/Misc/ImplementOwnerTypeDefs/ImplementOwnerTypeDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| IncidentCategoryDef | 13 | `Data/Core/Defs/Misc/IncidentCategoryDefs/IncidentCategoryDefs.xml` | Selected consumers documented: STORYTELLER.md |
| IncidentDef | 139 | `Data/Anomaly/Defs/Storyteller/Incidents_Map_Misc.xml` | Selected consumers documented: STORYTELLER.md |
| IncidentTargetTagDef | 7 | `Data/Core/Defs/Misc/IncidentTargetTypeDefs/IncidentTargetTagDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| InfectionPathwayDef | 3 | `Data/Anomaly/Defs/InfectionPathwayDefs/InfectionPathwayDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| InspirationDef | 8 | `Data/Core/Defs/InspirationDefs/Inspirations.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| InstructionDef | 37 | `Data/Core/Defs/Tutor/Instructions.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| InteractionDef | 68 | `Data/Anomaly/Defs/InteractionDefs/Interactions_Misc.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| InventoryStockGroupDef | 1 | `Data/Core/Defs/Misc/InventoryStockGroupDefs/InventoryStockGroups.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| IssueDef | 72 | `Data/Anomaly/Defs/PreceptDefs/Precepts_Inhumanizing.xml` | Selected consumers documented: IDEOLOGY.md |
| JobDef | 321 | `Data/Anomaly/Defs/JobDefs/Jobs_Misc.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| JoyGiverDef | 22 | `Data/Core/Defs/Joy/JoyGivers.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| JoyKindDef | 10 | `Data/Core/Defs/Joy/JoyKinds.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| KeyBindingCategoryDef | 9 | `Data/Core/Defs/Misc/KeyBindings/KeyBindingCategories.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| KeyBindingDef | 66 | `Data/Core/Defs/Misc/KeyBindings/KeyBindings.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| KnowledgeCategoryDef | 2 | `Data/Anomaly/Defs/KnowledgeCategoryDefs/KnowledgeCategories.xml` | Selected consumers documented: ANOMALY.md |
| LandingOutcomeDef | 4 | `Data/Odyssey/Defs/Misc/LandingOutcomes.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| LandmarkDef | 51 | `Data/Odyssey/Defs/TileMutators/Landmarks.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| LayoutDef | 1 | `Data/Anomaly/Defs/LayoutDefs/Layouts_Misc.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| LayoutRoomDef | 145 | `Data/Anomaly/Defs/LayoutRoomDefs/LayoutRooms_Labyrinth.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| LearningDesireDef | 7 | `Data/Biotech/Defs/LearningDesireDefs/LearningDesires.xml` | Selected consumers documented: BIOTECH.md |
| LetterDef | 27 | `Data/Anomaly/Defs/Misc/LetterDefs/CustomChoiceLetters.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| LifeStageDef | 19 | `Data/Anomaly/Defs/LifeStageDefs/LifeStages.xml` | Selected consumers documented: BIOTECH.md |
| LogEntryDef | 2 | `Data/Core/Defs/Misc/LogEntryDefs/LogEntryDef.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| MainButtonDef | 15 | `Data/Biotech/Defs/MainButtonDefs/MainButtons.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ManeuverDef | 12 | `Data/Core/Defs/Maneuvers/Maneuvers.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| MapGeneratorDef | 20 | `Data/Anomaly/Defs/MapGeneration/LabyrinthMapGenerator.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| MapMeshFlagDef | 15 | `Data/Biotech/Defs/MapMeshFlagDefs/MapMeshFlagDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| MaterialDef | 81 | `Data/Core/Defs/MaterialDefs/Materials.Generated.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| MechWeightClassDef | 4 | `Data/Core/Defs/MechWeightClassDefs/MechWeightClassDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| MechWorkModeDef | 4 | `Data/Biotech/Defs/Misc/MechWorkModes.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| MeditationFocusDef | 7 | `Data/Anomaly/Defs/MeditationFocusDefs/MeditationFocusDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| MemeDef | 38 | `Data/Anomaly/Defs/MemeDefs/Memes_Misc.xml` | Selected consumers documented: IDEOLOGY.md |
| MemeGroupDef | 7 | `Data/Ideology/Defs/MemeDefs/Memes_GenderSupremacy.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| MentalBreakDef | 34 | `Data/Anomaly/Defs/MentalStateDefs/MentalStates_Mood.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| MentalFitDef | 2 | `Data/Biotech/Defs/MentalStateDefs/MentalStates_BabyFits.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| MentalStateDef | 49 | `Data/Anomaly/Defs/MentalStateDefs/MentalStates_Mood.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| MessageTypeDef | 12 | `Data/Core/Defs/Misc/MessageTypeDefs/MessageTypeDef.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| MonolithLevelDef | 7 | `Data/Anomaly/Defs/Misc/MonolithLevels.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| MusicSequenceDef | 8 | `Data/Anomaly/Defs/Misc/Music/Music_Sequences.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| MusicTransitionDef | 9 | `Data/Anomaly/Defs/Misc/Music/Music_Transitions.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| MutantDef | 4 | `Data/Anomaly/Defs/Misc/Mutants.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| NeedDef | 25 | `Data/Biotech/Defs/NeedDefs/Needs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| NegativeFishingOutcomeDef | 11 | `Data/Odyssey/Defs/Misc/NegativeFishingOutcomes.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| OptionCategoryDef | 8 | `Data/Core/Defs/Misc/OptionCategoryDefs/OptionCategories.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| OrbitalDebrisDef | 3 | `Data/Odyssey/Defs/OrbitalDebrisDefs/OrbitalDebris.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| OrderedTakeGroupDef | 2 | `Data/Core/Defs/Misc/OrderedTakeGroupDefs/OrderedTakeGroupDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PathGridDef | 3 | `Data/Core/Defs/PathGridDefs/PathGrids.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PawnCapacityDef | 11 | `Data/Core/Defs/PawnCapacityDefs/PawnCapacity.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PawnColumnDef | 52 | `Data/Biotech/Defs/PawnColumnDefs/PawnColumns_Icon.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PawnGroupKindDef | 20 | `Data/Anomaly/Defs/PawnGroupKindDefs/PawnGroupKinds.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PawnKindDef | 333 | `Data/Anomaly/Defs/PawnKinds/PawnKinds_Entities.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PawnRelationDef | 28 | `Data/Biotech/Defs/PawnRelationDefs/PawnRelations_FamiltyByBlood.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PawnRenderNodeTagDef | 5 | `Data/Core/Defs/PawnRenderTreeDefs/PawnRenderNodeTagDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PawnRenderTreeDef | 11 | `Data/Anomaly/Defs/PawnRenderTreeDefs/PawnRenderTreeDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PawnTableDef | 6 | `Data/Biotech/Defs/PawnTableDefs/PawnTables.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PawnsArrivalModeDef | 13 | `Data/Anomaly/Defs/Misc/PawnArrivalModeDefs/PawnArrivalModes.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PitGateIncidentDef | 1 | `Data/Anomaly/Defs/Misc/PitGateIncidentDefs/PitGateIncidentDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PlaceDef | 20 | `Data/Ideology/Defs/Misc/PlaceDefs/Places.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PlanetLayerDef | 3 | `Data/Core/Defs/PlanetLayerDefs/PlanetLayers.xml` | Selected consumers documented: ODYSSEY.md |
| PlanetLayerSettingsDef | 2 | `Data/Core/Defs/Misc/WorldLayerSettingsDefs/PlanetLayerSettings.xml` | Selected consumers documented: ODYSSEY.md |
| PreceptDef | 223 | `Data/Anomaly/Defs/PreceptDefs/Precepts_Inhumanizing.xml` | Selected consumers documented: IDEOLOGY.md |
| PrefabDef | 176 | `Data/Biotech/Defs/PrefabDefs/CommonRoomPrefabs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PrisonerInteractionModeDef | 12 | `Data/Anomaly/Defs/PrisonerInteractionModeDefs/PrisonerInteractionModeDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PsychicRitualDef_BloodRain | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PsychicRitualDef_Brainwipe | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PsychicRitualDef_Chronophagy | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PsychicRitualDef_ImbueDeathRefusal | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PsychicRitualDef_NeurosisPulse | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PsychicRitualDef_Philophagy | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PsychicRitualDef_PleasurePulse | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PsychicRitualDef_Psychophagy | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PsychicRitualDef_SkipAbduction | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PsychicRitualDef_SkipAbductionPlayer | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PsychicRitualDef_SummonAnimals | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PsychicRitualDef_SummonFleshbeasts | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PsychicRitualDef_SummonFleshbeastsPlayer | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PsychicRitualDef_SummonPitGate | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PsychicRitualDef_SummonShamblers | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PsychicRitualDef_VoidProvocation | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PsychicRitualRoleDef | 9 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRitualRoles.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| PsychicRitualRoleDef_DeathRefusalTarget | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRitualRoles.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| QuestScriptDef | 156 | `Data/Anomaly/Defs/QuestScriptDefs/Script_CreepjoinerJoins.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RaidAgeRestrictionDef | 1 | `Data/Biotech/Defs/Storyteller/RaidAgeRestrictions.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RaidStrategyDef | 12 | `Data/Anomaly/Defs/RaidStrategyDefs/RaidStrategies_Misc.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RecipeDef | 214 | `Data/Anomaly/Defs/HediffDefs/Hediffs_BodyParts_Prosthetic.xml` | Selected consumers documented: WORK_AND_PRODUCTION.md |
| RecordDef | 70 | `Data/Anomaly/Defs/RecordDefs/Records_Misc.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RenderSkipFlagDef | 7 | `Data/Core/Defs/MapMeshFlagDefs/RenderSkipFlagDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ResearchProjectDef | 168 | `Data/Anomaly/Defs/ResearchProjectDefs/ResearchProjects_Anomaly.xml` | Selected consumers documented: ANOMALY.md |
| ResearchProjectTagDef | 5 | `Data/Core/Defs/Misc/ResearchProjectTagDefs/ResearchProjectTagDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ResearchTabDef | 2 | `Data/Anomaly/Defs/ResearchTabDefs/ResearchTabs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ReservationLayerDef | 3 | `Data/Core/Defs/Misc/ReservationLayerDefs/ReservationLayerDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RitualAttachableOutcomeEffectDef | 7 | `Data/Ideology/Defs/PreceptDefs/Ritual_AttachableOutcomes_Special.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RitualBehaviorDef | 27 | `Data/Biotech/Defs/Rituals/Ritual_Behaviors.xml` | Selected consumers documented: IDEOLOGY.md |
| RitualObligationTargetFilterDef | 21 | `Data/Biotech/Defs/Rituals/Ritual_Targets.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RitualOutcomeEffectDef | 31 | `Data/Biotech/Defs/Rituals/Ritual_Outcomes.xml` | Selected consumers documented: IDEOLOGY.md |
| RitualPatternDef | 31 | `Data/Biotech/Defs/Rituals/Ritual_Patterns.xml` | Selected consumers documented: IDEOLOGY.md |
| RitualTargetFilterDef | 7 | `Data/Ideology/Defs/Rituals/Ritual_Targets.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RitualVisualEffectDef | 20 | `Data/Core/Defs/RitualEffectDefs/RitualEffectDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RiverDef | 4 | `Data/Core/Defs/RiverDefs/RiverDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RoadDef | 5 | `Data/Core/Defs/RoadDefs/RoadDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RoadPathingDef | 2 | `Data/Core/Defs/RoadDefs/RoadPathingDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RoadWorldLayerDef | 5 | `Data/Core/Defs/RoadDefs/RoadWorldLayerDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RoofDef | 4 | `Data/Anomaly/Defs/Misc/Roofs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RoomPartDef | 12 | `Data/Odyssey/Defs/RoomPartDefs/RoomParts_Common.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RoomPart_BarricadeDef | 1 | `Data/Odyssey/Defs/RoomPartDefs/RoomParts_Common.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RoomPart_CrateDef | 2 | `Data/Odyssey/Defs/RoomPartDefs/RoomParts_Common.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RoomPart_GestationTankDef | 1 | `Data/Odyssey/Defs/RoomPartDefs/RoomParts_Common.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RoomPart_ThingDef | 6 | `Data/Odyssey/Defs/RoomPartDefs/RoomParts_Common.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RoomRoleDef | 23 | `Data/Anomaly/Defs/Rooms/RoomRoles.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RoomStatDef | 13 | `Data/Biotech/Defs/Rooms/RoomStats.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RoyalTitleDef | 13 | `Data/Royalty/Defs/RoyalTitles/RoyalTitles_Empire.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RoyalTitlePermitDef | 16 | `Data/Royalty/Defs/RoyalTitles/RoyalPermits_Empire.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RuleDef | 112 | `Data/Anomaly/Defs/RuleDefs/Rules_Complex.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| RulePackDef | 340 | `Data/Anomaly/Defs/InteractionDefs/Interactions_Misc.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ScatterableDef | 12 | `Data/Core/Defs/Misc/ScatterableDefs/Scatterables.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ScenPartDef | 41 | `Data/Anomaly/Defs/Scenarios/ScenParts_Various.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ScenarioDef | 10 | `Data/Anomaly/Defs/Scenarios/Scenarios.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ShaderDef | 194 | `Data/Core/Defs/ShaderDefs/Shaders.Map.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ShaderTypeDef | 122 | `Data/Anomaly/Defs/Misc/ShaderTypeDefs/ShaderTypes.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ShipJobDef | 7 | `Data/Core/Defs/ShipJobDefs/ShipJobDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| SitePartDef | 64 | `Data/Anomaly/Defs/Sites/DistressCall.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| SketchResolverDef | 33 | `Data/Biotech/Defs/SketchResolverDefs/SketchResolvers.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| SkillDef | 12 | `Data/Core/Defs/SkillDefs/Skills.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| SlaveInteractionModeDef | 5 | `Data/Ideology/Defs/SlaveInteractionModeDefs/SlaveInteractionMode.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| SongDef | 77 | `Data/Anomaly/Defs/Misc/SongDefs/Songs_Sequences.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| SoundDef | 1233 | `Data/Anomaly/Defs/SoundDefs/Buildings_Fleshmass.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| SpecialThingFilterDef | 49 | `Data/Anomaly/Defs/SpecialThingFilterDefs/SpecialThingFilters.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| StatCategoryDef | 40 | `Data/Anomaly/Defs/StatDefs/Stats_Containment.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| StatDef | 256 | `Data/Anomaly/Defs/StatDefs/Stats_Containment.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| StorytellerDef | 5 | `Data/Core/Defs/Storyteller/Storytellers.xml` | Selected consumers documented: STORYTELLER.md |
| StructureLayoutDef | 33 | `Data/Odyssey/Defs/LayoutDefs/Layouts_AncientRuins.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| StructureStructureLayoutDef | 1 | `Data/Odyssey/Defs/LayoutDefs/Layouts_OrbitalPlatform.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| StuffAppearanceDef | 4 | `Data/Core/Defs/Misc/StuffAppearanceDefs/StuffAppearances.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| StuffCategoryDef | 6 | `Data/Anomaly/Defs/StuffCategoryDefs/StuffCategories.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| StyleCategoryDef | 11 | `Data/Anomaly/Defs/StyleCategoryDefs/StyleCategoryDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| StyleItemCategoryDef | 12 | `Data/Anomaly/Defs/HairDefs/HairsCultist.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| SubcameraDef | 2 | `Data/Core/Defs/Misc/SubcameraDefs/Subcameras.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| SurgeryOutcomeEffectDef | 3 | `Data/Biotech/Defs/RecipeDefs/SurgeryOutcomeEffectDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| TaleDef | 101 | `Data/Anomaly/Defs/TaleDefs/Tales_Double.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| TattooDef | 31 | `Data/Core/Defs/TattooDefs/TattooDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| TerrainAffordanceDef | 12 | `Data/Core/Defs/Misc/TerrainAffordanceDefs/TerrainAffordances.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| TerrainDef | 138 | `Data/Anomaly/Defs/TerrainDefs/Terrain_Floors.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| TerrainTemplateDef | 5 | `Data/Core/Defs/TerrainDefs/Terrain_Floors.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ThingCategoryDef | 78 | `Data/Anomaly/Defs/ThingCategoryDefs/ThingCategories.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ThingDef | 2055 | `Data/Anomaly/Defs/AbilityDefs/Abilities.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ThingSetMakerDef | 52 | `Data/Anomaly/Defs/ThingSetMakerDefs/ThingSetMakers_MapGen.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ThingStyleDef | 126 | `Data/Anomaly/Defs/ThingStyleDefs/ThingStyleDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ThinkTreeDef | 61 | `Data/Anomaly/Defs/ThinkTreeDefs/AwokenCorpse.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ThoughtDef | 934 | `Data/Anomaly/Defs/PreceptDefs/Precepts_Inhumanizing.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| TileMutatorDef | 95 | `Data/Core/Defs/MapGeneration/TileMutators.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| TimeAssignmentDef | 5 | `Data/Core/Defs/Misc/TimeAssignmentDefs/TimeAssignments.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| TipSetDef | 6 | `Data/Anomaly/Defs/TipSetDefs/Tips.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| ToolCapacityDef | 13 | `Data/Biotech/Defs/ToolCapacityDefs/ToolCapacityDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| TraderKindDef | 20 | `Data/Core/Defs/TraderKindDefs/TraderKinds_Base_Neolithic.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| TrainabilityDef | 3 | `Data/Core/Defs/Misc/TrainabilityDefs/TrainabilityDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| TrainableDef | 14 | `Data/Core/Defs/TrainableDefs/Trainables.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| TraitDef | 51 | `Data/Anomaly/Defs/TraitDefs/Traits.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| TransferableSorterDef | 7 | `Data/Core/Defs/Misc/TradeDialogSorterDefs/TransferableSorters.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| TransportShipDef | 4 | `Data/Biotech/Defs/TransportShipDefs/TransportShipDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| WeaponCategoryDef | 16 | `Data/Odyssey/Defs/WeaponTraitDefs/WeaponCategoryDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| WeaponClassDef | 10 | `Data/Core/Defs/WeaponClassDefs/WeaponClassDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| WeaponClassPairDef | 5 | `Data/Ideology/Defs/WeaponClassPairDefs/WeaponClassPairDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| WeaponTraitDef | 62 | `Data/Odyssey/Defs/WeaponTraitDefs/WeaponTraitDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| WeatherDef | 25 | `Data/Anomaly/Defs/WeatherDefs/Weathers.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| WorkGiverDef | 154 | `Data/Anomaly/Defs/WorkGivers/WorkGivers.xml` | Selected consumers documented: WORK_AND_PRODUCTION.md |
| WorkGiverEquivalenceGroupDef | 3 | `Data/Core/Defs/Misc/WorkGiverEquivalenceGroupDef/WorkGiverEquivalenceGroup.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| WorkTypeDef | 23 | `Data/Anomaly/Defs/WorkTypeDefs/WorkTypes.xml` | Selected consumers documented: WORK_AND_PRODUCTION.md |
| WorldGenStepDef | 12 | `Data/Biotech/Defs/WorldGeneration/WorldGenerator.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| WorldObjectDef | 38 | `Data/Core/Defs/Storyteller/Incidents_Caravan_All.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| XenotypeDef | 12 | `Data/Biotech/Defs/GeneDefs/XenotypeDefs.xml` | Selected consumers documented: BIOTECH.md |
| XenotypeIconDef | 11 | `Data/Biotech/Defs/GeneDefs/XenotypeIconDefs.xml` | UNREAD consumers here; raw indexed; consult prior inventory |
| jobDef | 6 | `Data/Biotech/Defs/JobDefs/Jobs_Learning.xml` | UNREAD consumers here; raw indexed; consult prior inventory |

# System inventory

Source inventory, not a full semantic audit. Every distinct top-level Def tag found in this extracted Data is listed, plus major code subsystems inspected. Raw size counts include abstract templates, duplicate nodes and definitions needing patch/inheritance resolution. A tag can span several systems, while a system can span several tags. No claim of every hidden code subsystem is made. Full per-row files and XML are private in FULL_DEF_RECORDS.json.

| Code subsystem | Location | Size signal | Documentation |
| --- | --- | --- | --- |
| Work admission and jobs | `RimWorld/WorkGiver*, Verse.AI/Job*` | bill giver about 740 lines | F1/F2; rest unread |
| Bills and hauling | `RimWorld/Bill*, StoreUtility` | per-bill order and store helper | F2; broader logistics unread |
| Skills and learning | `RimWorld/SkillRecord, learning/lesson/book classes` | 7 raw learning desires | F4 |
| Research | `Verse/ResearchProjectDef, RimWorld/ResearchManager` | 168 raw project nodes | F3; broader Anomaly/inspection unread |
| Body render and genetics | `Verse/PawnRenderNode*, Gene; RimWorld/Pawn_GeneTracker` | 203 raw genes, 12 raw xenotypes | F5; inheritance unread |
| Scribe save | `Verse/Scribe*, SafeSaver` | selected XML writers and metadata | A04 scoped; migrations unread |
| Content loader | `Verse/LoadedModManager` | 252 raw Def tags | A03/A07 scoped |
| Storyteller/environment | `RimWorld/Storyteller*, Plant` | cold condition + growth endpoint | F6 sampled |
| Social log and memory | `RimWorld/Pawn_InteractionsTracker, Thought_MemorySocial` | 68 raw interactions, 340 rule packs | A01/F6 scoped |
| Unity gameplay export | `decompiled/` | 9,213 C# files, 59 top-level entries | most methods unread |

## Complete raw definition-tag census

| Definition/subsystem tag | Nodes | Representative file | Documentation |
| --- | --- | --- | --- |
| `AbilityCategoryDef` | 4 | `Data/Biotech/Defs/AbilityDefs/Abilities.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `AbilityDef` | 107 | `Data/Anomaly/Defs/AbilityDefs/Abilities.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `AbilityGroupDef` | 3 | `Data/Ideology/Defs/AbilityDefs/Abilities.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `AnimationDef` | 13 | `Data/Anomaly/Defs/AnimationDefs/DeathRefusal.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `AnomalyPlaystyleDef` | 3 | `Data/Anomaly/Defs/AnomalyPlaystyles/AnomalyPlaystyles.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ApparelLayerDef` | 6 | `Data/Core/Defs/Misc/ApparelLayerDefs/ApparelLayerDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `BabyPlayDef` | 3 | `Data/Biotech/Defs/BabyPlayDefs/BabyPlay.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `BackStoryDef` | 1 | `Data/Core/Defs/BackstoryDefs/Solid/Solid_Rare.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `BackstoryDef` | 845 | `Data/Anomaly/Defs/BackstoryDefs/Solid/Solid.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `BeardDef` | 42 | `Data/Biotech/Defs/BeardDefs/BeardDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `BillRepeatModeDef` | 3 | `Data/Core/Defs/Misc/BillDefs/BillRepeatModeDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `BillStoreModeDef` | 3 | `Data/Core/Defs/Misc/BillDefs/BillStoreModeDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `BiomeDef` | 25 | `Data/Anomaly/Defs/MapGeneration/LabyrinthMapGenerator.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `BodyDef` | 48 | `Data/Anomaly/Defs/Bodies/Bodies_Entities.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `BodyPartDef` | 147 | `Data/Anomaly/Defs/Bodies/Bodies_Entities.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `BodyPartGroupDef` | 48 | `Data/Anomaly/Defs/Bodies/Bodies_Entities.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `BodyPartTagDef` | 25 | `Data/Core/Defs/Misc/BodyPartTagDefs/BodyPartTagDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `BodyTypeDef` | 8 | `Data/Biotech/Defs/Misc/BodyTypeDefs/BodyTypes.xml` | F5 sampled |
| `BossDef` | 3 | `Data/Biotech/Defs/BossgroupDefs/Bossgroups.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `BossgroupDef` | 4 | `Data/Biotech/Defs/BossgroupDefs/Bossgroups.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ChemicalDef` | 8 | `Data/Core/Defs/Drugs/Alcohol_Beer.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ClamorDef` | 6 | `Data/Biotech/Defs/Misc/ClamorDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ColorDef` | 140 | `Data/Core/Defs/ColorDefs/ColorDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ComplexLayoutDef` | 3 | `Data/Biotech/Defs/LayoutDefs/Layouts_Misc.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ComplexThreatDef` | 11 | `Data/Core/Defs/ComplexThreatDefs/ComplexThreats_Misx.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ConceptDef` | 86 | `Data/Anomaly/Defs/Tutor/Tutor.xml` | A10 sampled |
| `CreepJoinerAggressiveDef` | 3 | `Data/Anomaly/Defs/CreepjoinerDefs/Aggressive.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `CreepJoinerBenefitDef` | 10 | `Data/Anomaly/Defs/CreepjoinerDefs/Benefits.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `CreepJoinerDownsideDef` | 9 | `Data/Anomaly/Defs/CreepjoinerDefs/Downsides.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `CreepJoinerFormKindDef` | 9 | `Data/Anomaly/Defs/CreepjoinerDefs/Forms.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `CreepjoinerRejectionDef` | 2 | `Data/Anomaly/Defs/CreepjoinerDefs/Rejections.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `CultureDef` | 5 | `Data/Core/Defs/CultureDefs/Cultures.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `DamageArmorCategoryDef` | 3 | `Data/Core/Defs/Misc/DamageArmorCategoryDef/DamageArmorCategoryDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `DamageDef` | 53 | `Data/Anomaly/Defs/DamageDefs/Damages_Environmental.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `DebugTabMenuDef` | 3 | `Data/Core/Defs/DebugTabMenuDefs/DebugTabMenuDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `DesignationCategoryDef` | 16 | `Data/Anomaly/Defs/Misc/DesignationCategories.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `DesignationDef` | 27 | `Data/Core/Defs/Misc/Designations/Designations.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `DesignatorDropdownGroupDef` | 13 | `Data/Core/Defs/Misc/DesignatorDropdownGroupDef/DesignatorDropdownGroupDef.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `DifficultyDef` | 7 | `Data/Core/Defs/Misc/DifficultyDefs/Difficulties.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `DrawStyleCategoryDef` | 19 | `Data/Core/Defs/DrawStyleCategoryDefs/DrawStyleCategories.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `DrawStyleDef` | 6 | `Data/Core/Defs/DrawStyleDefs/DrawStyles.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `DrugPolicyDef` | 4 | `Data/Core/Defs/DrugPolicyDefs/DrugPolicyDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `DutyDef` | 108 | `Data/Anomaly/Defs/DutyDefs/Duties_Misc.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `EffecterDef` | 285 | `Data/Anomaly/Defs/Effects/Effecter_Misc.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `EntityCategoryDef` | 3 | `Data/Anomaly/Defs/EntityCategoryDefs/EntityCategories.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `EntityCodexEntryDef` | 27 | `Data/Anomaly/Defs/EntityCodexEntryDefs/EntityCodexEntryDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ExpansionDef` | 6 | `Data/Core/Defs/Misc/ExpansionDefs/ExpansionDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ExpectationDef` | 10 | `Data/Core/Defs/Misc/ExpectationDefs/Expectations.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `FactionDef` | 39 | `Data/Anomaly/Defs/FactionDefs/Factions_Misc.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `FeatureDef` | 25 | `Data/Core/Defs/Misc/FeatureDefs/Features.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `FleckDef` | 327 | `Data/Anomaly/Defs/Effects/Fleck_Visual.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `FleshTypeDef` | 7 | `Data/Anomaly/Defs/Misc/FleshTypeDefs/FleshType.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `FurDef` | 1 | `Data/Biotech/Defs/Misc/FurDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `GameConditionDef` | 38 | `Data/Anomaly/Defs/GameConditionDefs/GameConditions_Misc.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `GameSetupStepDef` | 4 | `Data/Core/Defs/Misc/GameSetupStepDefs/GameSetupSteps.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `GatheringDef` | 3 | `Data/Core/Defs/GatheringDefs/Gatherings.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `GauranlenTreeModeDef` | 7 | `Data/Ideology/Defs/GauranlenTreeModDefs/GauranlenTreeModeDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `GenStepDef` | 170 | `Data/Anomaly/Defs/MapGeneration/BasePlayerMapGenerator.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `GeneCategoryDef` | 21 | `Data/Biotech/Defs/GeneDefs/GeneCategoryDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `GeneDef` | 203 | `Data/Biotech/Defs/GeneDefs/GeneDefs_Abilities.xml` | F5/BD |
| `GeneTemplateDef` | 9 | `Data/Biotech/Defs/GeneDefs/GeneTemplateDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `GeneratedLocationDef` | 1 | `Data/Odyssey/Defs/GeneratedLocationDefs/GeneratedLocations.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `GlobalWorldDrawLayerDef` | 2 | `Data/Core/Defs/GlobalWorldDrawLayerDefs/GlobalWorldDrawLayers.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `GoodwillSituationDef` | 39 | `Data/Core/Defs/Goodwill/GoodwillSituations_Misc.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `GraphicStateDef` | 2 | `Data/Core/Defs/GraphicStateDefs/GraphicStates.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `GravshipComponentTypeDef` | 5 | `Data/Odyssey/Defs/ThingDefs_Buildings/Buildings_Gravship.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `HairDef` | 82 | `Data/Anomaly/Defs/HairDefs/HairsCultist.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `HeadTypeDef` | 43 | `Data/Anomaly/Defs/Misc/HeadTypes.xml` | F5 sampled |
| `HediffDef` | 345 | `Data/Anomaly/Defs/HediffDefs/Hediffs_BodyParts_Prosthetic.xml` | F5/F6 sampled |
| `HediffGiverSetDef` | 4 | `Data/Anomaly/Defs/HediffGiverSetDefs/HediffGiverSetDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `HibernatableStateDef` | 3 | `Data/Core/Defs/Misc/HibernatableStateDefs/HibernatableStateDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `HistoryAutoRecorderDef` | 11 | `Data/Core/Defs/Misc/HistoryAutoRecording/HistoryAutoRecorders.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `HistoryAutoRecorderGroupDef` | 4 | `Data/Core/Defs/Misc/HistoryAutoRecording/HistoryAutoRecorderGroups.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `HistoryEventDef` | 172 | `Data/Anomaly/Defs/Misc/HistoryEventDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `IdeoColorDef` | 33 | `Data/Ideology/Defs/IdeoSymbolDefs/IdeoColorDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `IdeoFoundationDef` | 1 | `Data/Ideology/Defs/IdeoFoundationDefs/IdeoFoundations.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `IdeoIconDef` | 94 | `Data/Ideology/Defs/IdeoSymbolDefs/IdeoIconDefs_Specific.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `IdeoPresetCategoryDef` | 6 | `Data/Ideology/Defs/PreconfiguredIdeos/IdeoPresetDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `IdeoPresetDef` | 25 | `Data/Anomaly/Defs/PreconfiguredIdeos/IdeoPresetDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `IdeoStoryPatternDef` | 6 | `Data/Ideology/Defs/RulePackDefs/RulePacks_Ideo_Description.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ImpactSoundTypeDef` | 7 | `Data/Biotech/Defs/ImpactSoundTypeDefs/ImpactSoundTypeDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ImplementOwnerTypeDef` | 5 | `Data/Core/Defs/Misc/ImplementOwnerTypeDefs/ImplementOwnerTypeDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `IncidentCategoryDef` | 13 | `Data/Core/Defs/Misc/IncidentCategoryDefs/IncidentCategoryDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `IncidentDef` | 139 | `Data/Anomaly/Defs/Storyteller/Incidents_Map_Misc.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `IncidentTargetTagDef` | 7 | `Data/Core/Defs/Misc/IncidentTargetTypeDefs/IncidentTargetTagDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `InfectionPathwayDef` | 3 | `Data/Anomaly/Defs/InfectionPathwayDefs/InfectionPathwayDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `InspirationDef` | 8 | `Data/Core/Defs/InspirationDefs/Inspirations.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `InstructionDef` | 37 | `Data/Core/Defs/Tutor/Instructions.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `InteractionDef` | 68 | `Data/Anomaly/Defs/InteractionDefs/Interactions_Misc.xml` | A01/F6 sampled |
| `InventoryStockGroupDef` | 1 | `Data/Core/Defs/Misc/InventoryStockGroupDefs/InventoryStockGroups.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `IssueDef` | 72 | `Data/Anomaly/Defs/PreceptDefs/Precepts_Inhumanizing.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `JobDef` | 321 | `Data/Anomaly/Defs/JobDefs/Jobs_Misc.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `JoyGiverDef` | 22 | `Data/Core/Defs/Joy/JoyGivers.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `JoyKindDef` | 10 | `Data/Core/Defs/Joy/JoyKinds.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `KeyBindingCategoryDef` | 9 | `Data/Core/Defs/Misc/KeyBindings/KeyBindingCategories.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `KeyBindingDef` | 66 | `Data/Core/Defs/Misc/KeyBindings/KeyBindings.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `KnowledgeCategoryDef` | 2 | `Data/Anomaly/Defs/KnowledgeCategoryDefs/KnowledgeCategories.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `LandingOutcomeDef` | 4 | `Data/Odyssey/Defs/Misc/LandingOutcomes.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `LandmarkDef` | 51 | `Data/Odyssey/Defs/TileMutators/Landmarks.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `LayoutDef` | 1 | `Data/Anomaly/Defs/LayoutDefs/Layouts_Misc.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `LayoutRoomDef` | 145 | `Data/Anomaly/Defs/LayoutRoomDefs/LayoutRooms_Labyrinth.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `LearningDesireDef` | 7 | `Data/Biotech/Defs/LearningDesireDefs/LearningDesires.xml` | F4/P03 |
| `LetterDef` | 27 | `Data/Anomaly/Defs/Misc/LetterDefs/CustomChoiceLetters.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `LifeStageDef` | 19 | `Data/Anomaly/Defs/LifeStageDefs/LifeStages.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `LogEntryDef` | 2 | `Data/Core/Defs/Misc/LogEntryDefs/LogEntryDef.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `MainButtonDef` | 15 | `Data/Biotech/Defs/MainButtonDefs/MainButtons.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ManeuverDef` | 12 | `Data/Core/Defs/Maneuvers/Maneuvers.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `MapGeneratorDef` | 20 | `Data/Anomaly/Defs/MapGeneration/LabyrinthMapGenerator.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `MapMeshFlagDef` | 15 | `Data/Biotech/Defs/MapMeshFlagDefs/MapMeshFlagDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `MechWeightClassDef` | 4 | `Data/Core/Defs/MechWeightClassDefs/MechWeightClassDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `MechWorkModeDef` | 4 | `Data/Biotech/Defs/Misc/MechWorkModes.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `MeditationFocusDef` | 7 | `Data/Anomaly/Defs/MeditationFocusDefs/MeditationFocusDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `MemeDef` | 38 | `Data/Anomaly/Defs/MemeDefs/Memes_Misc.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `MemeGroupDef` | 7 | `Data/Ideology/Defs/MemeDefs/Memes_GenderSupremacy.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `MentalBreakDef` | 34 | `Data/Anomaly/Defs/MentalStateDefs/MentalStates_Mood.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `MentalFitDef` | 2 | `Data/Biotech/Defs/MentalStateDefs/MentalStates_BabyFits.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `MentalStateDef` | 49 | `Data/Anomaly/Defs/MentalStateDefs/MentalStates_Mood.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `MessageTypeDef` | 12 | `Data/Core/Defs/Misc/MessageTypeDefs/MessageTypeDef.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `MonolithLevelDef` | 7 | `Data/Anomaly/Defs/Misc/MonolithLevels.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `MusicSequenceDef` | 8 | `Data/Anomaly/Defs/Misc/Music/Music_Sequences.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `MusicTransitionDef` | 9 | `Data/Anomaly/Defs/Misc/Music/Music_Transitions.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `MutantDef` | 4 | `Data/Anomaly/Defs/Misc/Mutants.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `NeedDef` | 25 | `Data/Biotech/Defs/NeedDefs/Needs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `NegativeFishingOutcomeDef` | 11 | `Data/Odyssey/Defs/Misc/NegativeFishingOutcomes.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `OptionCategoryDef` | 8 | `Data/Core/Defs/Misc/OptionCategoryDefs/OptionCategories.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `OrbitalDebrisDef` | 3 | `Data/Odyssey/Defs/OrbitalDebrisDefs/OrbitalDebris.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `OrderedTakeGroupDef` | 2 | `Data/Core/Defs/Misc/OrderedTakeGroupDefs/OrderedTakeGroupDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PathGridDef` | 3 | `Data/Core/Defs/PathGridDefs/PathGrids.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PawnCapacityDef` | 11 | `Data/Core/Defs/PawnCapacityDefs/PawnCapacity.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PawnColumnDef` | 52 | `Data/Biotech/Defs/PawnColumnDefs/PawnColumns_Icon.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PawnGroupKindDef` | 20 | `Data/Anomaly/Defs/PawnGroupKindDefs/PawnGroupKinds.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PawnKindDef` | 333 | `Data/Anomaly/Defs/PawnKinds/PawnKinds_Entities.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PawnRelationDef` | 28 | `Data/Biotech/Defs/PawnRelationDefs/PawnRelations_FamiltyByBlood.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PawnRenderNodeTagDef` | 5 | `Data/Core/Defs/PawnRenderTreeDefs/PawnRenderNodeTagDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PawnRenderTreeDef` | 11 | `Data/Anomaly/Defs/PawnRenderTreeDefs/PawnRenderTreeDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PawnTableDef` | 6 | `Data/Biotech/Defs/PawnTableDefs/PawnTables.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PawnsArrivalModeDef` | 13 | `Data/Anomaly/Defs/Misc/PawnArrivalModeDefs/PawnArrivalModes.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PitGateIncidentDef` | 1 | `Data/Anomaly/Defs/Misc/PitGateIncidentDefs/PitGateIncidentDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PlaceDef` | 20 | `Data/Ideology/Defs/Misc/PlaceDefs/Places.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PlanetLayerDef` | 3 | `Data/Core/Defs/PlanetLayerDefs/PlanetLayers.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PlanetLayerSettingsDef` | 2 | `Data/Core/Defs/Misc/WorldLayerSettingsDefs/PlanetLayerSettings.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PreceptDef` | 223 | `Data/Anomaly/Defs/PreceptDefs/Precepts_Inhumanizing.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PrefabDef` | 176 | `Data/Biotech/Defs/PrefabDefs/CommonRoomPrefabs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PrisonerInteractionModeDef` | 12 | `Data/Anomaly/Defs/PrisonerInteractionModeDefs/PrisonerInteractionModeDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PsychicRitualDef_BloodRain` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PsychicRitualDef_Brainwipe` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PsychicRitualDef_Chronophagy` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PsychicRitualDef_ImbueDeathRefusal` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PsychicRitualDef_NeurosisPulse` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PsychicRitualDef_Philophagy` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PsychicRitualDef_PleasurePulse` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PsychicRitualDef_Psychophagy` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PsychicRitualDef_SkipAbduction` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PsychicRitualDef_SkipAbductionPlayer` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PsychicRitualDef_SummonAnimals` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PsychicRitualDef_SummonFleshbeasts` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PsychicRitualDef_SummonFleshbeastsPlayer` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PsychicRitualDef_SummonPitGate` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PsychicRitualDef_SummonShamblers` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PsychicRitualDef_VoidProvocation` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRituals.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PsychicRitualRoleDef` | 9 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRitualRoles.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `PsychicRitualRoleDef_DeathRefusalTarget` | 1 | `Data/Anomaly/Defs/PsychicRitualDefs/PsychicRitualRoles.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `QuestScriptDef` | 156 | `Data/Anomaly/Defs/QuestScriptDefs/Script_CreepjoinerJoins.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RaidAgeRestrictionDef` | 1 | `Data/Biotech/Defs/Storyteller/RaidAgeRestrictions.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RaidStrategyDef` | 12 | `Data/Anomaly/Defs/RaidStrategyDefs/RaidStrategies_Misc.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RecipeDef` | 214 | `Data/Anomaly/Defs/HediffDefs/Hediffs_BodyParts_Prosthetic.xml` | F2/P02 |
| `RecordDef` | 70 | `Data/Anomaly/Defs/RecordDefs/Records_Misc.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RenderSkipFlagDef` | 7 | `Data/Core/Defs/MapMeshFlagDefs/RenderSkipFlagDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ResearchProjectDef` | 168 | `Data/Anomaly/Defs/ResearchProjectDefs/ResearchProjects_Anomaly.xml` | F3/RT |
| `ResearchProjectTagDef` | 5 | `Data/Core/Defs/Misc/ResearchProjectTagDefs/ResearchProjectTagDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ResearchTabDef` | 2 | `Data/Anomaly/Defs/ResearchTabDefs/ResearchTabs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ReservationLayerDef` | 3 | `Data/Core/Defs/Misc/ReservationLayerDefs/ReservationLayerDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RitualAttachableOutcomeEffectDef` | 7 | `Data/Ideology/Defs/PreceptDefs/Ritual_AttachableOutcomes_Special.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RitualBehaviorDef` | 27 | `Data/Biotech/Defs/Rituals/Ritual_Behaviors.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RitualObligationTargetFilterDef` | 21 | `Data/Biotech/Defs/Rituals/Ritual_Targets.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RitualOutcomeEffectDef` | 31 | `Data/Biotech/Defs/Rituals/Ritual_Outcomes.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RitualPatternDef` | 31 | `Data/Biotech/Defs/Rituals/Ritual_Patterns.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RitualTargetFilterDef` | 7 | `Data/Ideology/Defs/Rituals/Ritual_Targets.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RitualVisualEffectDef` | 20 | `Data/Core/Defs/RitualEffectDefs/RitualEffectDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RiverDef` | 4 | `Data/Core/Defs/RiverDefs/RiverDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RoadDef` | 5 | `Data/Core/Defs/RoadDefs/RoadDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RoadPathingDef` | 2 | `Data/Core/Defs/RoadDefs/RoadPathingDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RoadWorldLayerDef` | 5 | `Data/Core/Defs/RoadDefs/RoadWorldLayerDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RoofDef` | 4 | `Data/Anomaly/Defs/Misc/Roofs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RoomPartDef` | 12 | `Data/Odyssey/Defs/RoomPartDefs/RoomParts_Common.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RoomPart_BarricadeDef` | 1 | `Data/Odyssey/Defs/RoomPartDefs/RoomParts_Common.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RoomPart_CrateDef` | 2 | `Data/Odyssey/Defs/RoomPartDefs/RoomParts_Common.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RoomPart_GestationTankDef` | 1 | `Data/Odyssey/Defs/RoomPartDefs/RoomParts_Common.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RoomPart_ThingDef` | 6 | `Data/Odyssey/Defs/RoomPartDefs/RoomParts_Common.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RoomRoleDef` | 23 | `Data/Anomaly/Defs/Rooms/RoomRoles.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RoomStatDef` | 13 | `Data/Biotech/Defs/Rooms/RoomStats.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RoyalTitleDef` | 13 | `Data/Royalty/Defs/RoyalTitles/RoyalTitles_Empire.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RoyalTitlePermitDef` | 16 | `Data/Royalty/Defs/RoyalTitles/RoyalPermits_Empire.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RuleDef` | 112 | `Data/Anomaly/Defs/RuleDefs/Rules_Complex.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `RulePackDef` | 340 | `Data/Anomaly/Defs/InteractionDefs/Interactions_Misc.xml` | A01 structure only |
| `ScatterableDef` | 12 | `Data/Core/Defs/Misc/ScatterableDefs/Scatterables.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ScenPartDef` | 41 | `Data/Anomaly/Defs/Scenarios/ScenParts_Various.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ScenarioDef` | 10 | `Data/Anomaly/Defs/Scenarios/Scenarios.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ShaderTypeDef` | 122 | `Data/Anomaly/Defs/Misc/ShaderTypeDefs/ShaderTypes.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ShipJobDef` | 7 | `Data/Core/Defs/ShipJobDefs/ShipJobDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `SitePartDef` | 64 | `Data/Anomaly/Defs/Sites/DistressCall.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `SketchResolverDef` | 33 | `Data/Biotech/Defs/SketchResolverDefs/SketchResolvers.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `SkillDef` | 12 | `Data/Core/Defs/SkillDefs/Skills.xml` | F4 sampled |
| `SlaveInteractionModeDef` | 5 | `Data/Ideology/Defs/SlaveInteractionModeDefs/SlaveInteractionMode.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `SongDef` | 77 | `Data/Anomaly/Defs/Misc/SongDefs/Songs_Sequences.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `SoundDef` | 1233 | `Data/Anomaly/Defs/SoundDefs/Buildings_Fleshmass.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `SpecialThingFilterDef` | 49 | `Data/Anomaly/Defs/SpecialThingFilterDefs/SpecialThingFilters.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `StatCategoryDef` | 40 | `Data/Anomaly/Defs/StatDefs/Stats_Containment.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `StatDef` | 256 | `Data/Anomaly/Defs/StatDefs/Stats_Containment.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `StorytellerDef` | 5 | `Data/Core/Defs/Storyteller/Storytellers.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `StructureLayoutDef` | 33 | `Data/Odyssey/Defs/LayoutDefs/Layouts_AncientRuins.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `StructureStructureLayoutDef` | 1 | `Data/Odyssey/Defs/LayoutDefs/Layouts_OrbitalPlatform.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `StuffAppearanceDef` | 4 | `Data/Core/Defs/Misc/StuffAppearanceDefs/StuffAppearances.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `StuffCategoryDef` | 6 | `Data/Anomaly/Defs/StuffCategoryDefs/StuffCategories.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `StyleCategoryDef` | 11 | `Data/Anomaly/Defs/StyleCategoryDefs/StyleCategoryDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `StyleItemCategoryDef` | 12 | `Data/Anomaly/Defs/HairDefs/HairsCultist.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `SubcameraDef` | 2 | `Data/Core/Defs/Misc/SubcameraDefs/Subcameras.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `SurgeryOutcomeEffectDef` | 3 | `Data/Biotech/Defs/RecipeDefs/SurgeryOutcomeEffectDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `TaleDef` | 101 | `Data/Anomaly/Defs/TaleDefs/Tales_Double.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `TattooDef` | 31 | `Data/Core/Defs/TattooDefs/TattooDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `TerrainAffordanceDef` | 12 | `Data/Core/Defs/Misc/TerrainAffordanceDefs/TerrainAffordances.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `TerrainDef` | 138 | `Data/Anomaly/Defs/TerrainDefs/Terrain_Floors.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `TerrainTemplateDef` | 5 | `Data/Core/Defs/TerrainDefs/Terrain_Floors.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ThingCategoryDef` | 78 | `Data/Anomaly/Defs/ThingCategoryDefs/ThingCategories.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ThingDef` | 2055 | `Data/Anomaly/Defs/AbilityDefs/Abilities.xml` | F2/F6 sampled |
| `ThingSetMakerDef` | 52 | `Data/Anomaly/Defs/ThingSetMakerDefs/ThingSetMakers_MapGen.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ThingStyleDef` | 126 | `Data/Anomaly/Defs/ThingStyleDefs/ThingStyleDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ThinkTreeDef` | 61 | `Data/Anomaly/Defs/ThinkTreeDefs/AwokenCorpse.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ThoughtDef` | 934 | `Data/Anomaly/Defs/PreceptDefs/Precepts_Inhumanizing.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `TileMutatorDef` | 95 | `Data/Core/Defs/MapGeneration/TileMutators.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `TimeAssignmentDef` | 5 | `Data/Core/Defs/Misc/TimeAssignmentDefs/TimeAssignments.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `TipSetDef` | 6 | `Data/Anomaly/Defs/TipSetDefs/Tips.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `ToolCapacityDef` | 13 | `Data/Biotech/Defs/ToolCapacityDefs/ToolCapacityDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `TraderKindDef` | 20 | `Data/Core/Defs/TraderKindDefs/TraderKinds_Base_Neolithic.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `TrainabilityDef` | 3 | `Data/Core/Defs/Misc/TrainabilityDefs/TrainabilityDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `TrainableDef` | 14 | `Data/Core/Defs/TrainableDefs/Trainables.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `TraitDef` | 51 | `Data/Anomaly/Defs/TraitDefs/Traits.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `TransferableSorterDef` | 7 | `Data/Core/Defs/Misc/TradeDialogSorterDefs/TransferableSorters.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `TransportShipDef` | 4 | `Data/Biotech/Defs/TransportShipDefs/TransportShipDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `WeaponCategoryDef` | 16 | `Data/Odyssey/Defs/WeaponTraitDefs/WeaponCategoryDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `WeaponClassDef` | 10 | `Data/Core/Defs/WeaponClassDefs/WeaponClassDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `WeaponClassPairDef` | 5 | `Data/Ideology/Defs/WeaponClassPairDefs/WeaponClassPairDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `WeaponTraitDef` | 62 | `Data/Odyssey/Defs/WeaponTraitDefs/WeaponTraitDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `WeatherDef` | 25 | `Data/Anomaly/Defs/WeatherDefs/Weathers.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `WorkGiverDef` | 154 | `Data/Anomaly/Defs/WorkGivers/WorkGivers.xml` | F1/F2 sampled |
| `WorkGiverEquivalenceGroupDef` | 3 | `Data/Core/Defs/Misc/WorkGiverEquivalenceGroupDef/WorkGiverEquivalenceGroup.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `WorkTypeDef` | 23 | `Data/Anomaly/Defs/WorkTypeDefs/WorkTypes.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `WorldGenStepDef` | 12 | `Data/Biotech/Defs/WorldGeneration/WorldGenerator.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `WorldObjectDef` | 38 | `Data/Core/Defs/Storyteller/Incidents_Caravan_All.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `XenotypeDef` | 12 | `Data/Biotech/Defs/GeneDefs/XenotypeDefs.xml` | F5/BD |
| `XenotypeIconDef` | 11 | `Data/Biotech/Defs/GeneDefs/XenotypeIconDefs.xml` | UNDOCUMENTED in this lane; raw inventory only |
| `jobDef` | 6 | `Data/Biotech/Defs/JobDefs/Jobs_Learning.xml` | UNDOCUMENTED in this lane; raw inventory only |

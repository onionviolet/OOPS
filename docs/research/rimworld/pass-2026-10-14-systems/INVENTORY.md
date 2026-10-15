# Family and gap map

Every prior inventory row is retained in FAMILY_MAP.json with original file, line, columns and raw count. This list groups the rows for scanning. `indexed-only` means the consumer is still undocumented in the read dossiers; `prior-partial` means a prior scoped trace; `partial-selected-consumers` means this pass traced named readers, not the whole family. Every owner mapping is INFERRED. A specific owner gap does not create a new required gate.

## UI and feedback

| System | Status | New trace | Kit / packets | Specific owner gap |
|---|---|---|---|---|
| AnimationDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | YES |
| ApparelLayerDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| ClamorDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| ColorDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| ConceptDef | prior-partial | none | K14/K19/K20/K30; P01/P20/P21 | no |
| DebugTabMenuDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| DesignationCategoryDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| DesignationDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| DesignatorDropdownGroupDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| DrawStyleCategoryDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | YES |
| DrawStyleDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | YES |
| EffecterDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| FleckDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| GraphicStateDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | YES |
| ImpactSoundTypeDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| InstructionDef | prior-partial | none | K14/K19/K20/K30; P01/P20/P21 | no |
| KeyBindingCategoryDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| KeyBindingDef | prior-partial | none | K14/K19/K20/K30; P01/P20/P21 | no |
| MainButtonDef | prior-partial | none | K14/K19/K20/K30; P01/P20/P21 | no |
| MapMeshFlagDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | YES |
| MaterialDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| MessageTypeDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| MusicSequenceDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| MusicTransitionDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| OptionCategoryDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| PawnColumnDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| PawnRenderNodeTagDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| PawnRenderTreeDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| PawnTableDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| RenderSkipFlagDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | YES |
| ShaderDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | YES |
| ShaderTypeDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | YES |
| SongDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| SoundDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| StuffAppearanceDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| StyleCategoryDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| StyleItemCategoryDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| SubcameraDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | YES |
| ThingStyleDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| TipSetDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| TransferableSorterDef | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| Verse.ProfilerUI | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |
| Verse.Sound | indexed-only | none | K14/K19/K20/K30; P01/P20/P21 | no |

## body

| System | Status | New trace | Kit / packets | Specific owner gap |
|---|---|---|---|---|
| Generated social exchange | prior-partial | none | K2/K3/K22; P04/P15 | no |
| BeardDef | indexed-only | none | K2/K3/K22; P04/P15 | no |
| BodyDef | partial-selected-consumers | S01 | K2/K3/K22; P04/P15 | no |
| BodyPartDef | partial-selected-consumers | S01 | K2/K3/K22; P04/P15 | no |
| BodyPartGroupDef | partial-selected-consumers | S01 | K2/K3/K22; P04/P15 | no |
| BodyPartTagDef | partial-selected-consumers | S01 | K2/K3/K22; P04/P15 | no |
| BodyTypeDef | indexed-only | none | K2/K3/K22; P04/P15 | no |
| ChemicalDef | partial-selected-consumers | S03 | K2/K3/K22; P04/P15 | no |
| DrugPolicyDef | partial-selected-consumers | S03 | K2/K3/K22; P04/P15 | no |
| FleshTypeDef | indexed-only | none | K2/K3/K22; P04/P15 | no |
| FurDef | indexed-only | none | K2/K3/K22; P04/P15 | no |
| GeneCategoryDef | indexed-only | none | K2/K3/K22; P04/P15 | no |
| GeneDef | prior-partial | none | K2/K3/K22; P04/P15 | no |
| GeneTemplateDef | indexed-only | none | K2/K3/K22; P04/P15 | no |
| GeneratedLocationDef | indexed-only | none | K2/K3/K22; P04/P15 | no |
| HairDef | indexed-only | none | K2/K3/K22; P04/P15 | no |
| HeadTypeDef | indexed-only | none | K2/K3/K22; P04/P15 | no |
| HediffDef | partial-selected-consumers | S01,S02,S03,S08 | K2/K3/K22; P04/P15 | no |
| HediffGiverSetDef | indexed-only | none | K2/K3/K22; P04/P15 | no |
| InfectionPathwayDef | indexed-only | none | K2/K3/K22; P04/P15 | no |
| LearningDesireDef | prior-partial | none | K2/K3/K22; P04/P15 | no |
| LifeStageDef | prior-partial | none | K2/K3/K22; P04/P15 | no |
| MapGeneratorDef | indexed-only | none | K2/K3/K22; P04/P15 | no |
| MutantDef | indexed-only | none | K2/K3/K22; P04/P15 | no |
| PawnCapacityDef | partial-selected-consumers | S01 | K2/K3/K22; P04/P15 | no |
| PsychicRitualDef_SummonFleshbeasts | indexed-only | none | K2/K3/K22; P04/P15 | no |
| PsychicRitualDef_SummonFleshbeastsPlayer | indexed-only | none | K2/K3/K22; P04/P15 | no |
| SurgeryOutcomeEffectDef | indexed-only | none | K2/K3/K22; P04/P15 | no |
| TattooDef | indexed-only | none | K2/K3/K22; P04/P15 | no |
| XenotypeDef | prior-partial | none | K2/K3/K22; P04/P15 | no |
| XenotypeIconDef | indexed-only | none | K2/K3/K22; P04/P15 | no |
| Hediff | partial-selected-consumers | S01,S02,S03 | K2/K3/K22; P04/P15 | no |
| Gene_ | indexed-only | none | K2/K3/K22; P04/P15 | no |
| Body render and genetics | prior-partial | none | K2/K3/K22; P04/P15 | no |
| Genes and offspring | prior-partial | none | K2/K3/K22; P04/P15 | no |
| Childhood, learning and age | prior-partial | none | K2/K3/K22; P04/P15 | no |
| Body parts become usable capacities | deep-selected-static | S01 | K2/K3/K10/K22; P04/P15/P17 | no |
| Treatment, disease severity and acquired immunity | deep-selected-static | S02 | K8/K11/K22/K26; P03/P04/P13 | no |
| Substances, tolerance, dependency and use policy | deep-selected-static | S03 | K3/K8/K22/K26; P04/P08/P13/P17 | no |

## companions

| System | Status | New trace | Kit / packets | Specific owner gap |
|---|---|---|---|---|
| GauranlenTreeModeDef | indexed-only | none | K6/K13/K26; P03/P06/P25 | no |
| TrainabilityDef | partial-selected-consumers | S06 | K6/K13/K26; P03/P06/P25 | no |
| TrainableDef | partial-selected-consumers | S06 | K6/K13/K26; P03/P06/P25 | no |
| Companion training, retained learning and command means | deep-selected-static | S06 | K3/K6/K13/K15/K26; P03/P04/P06/P25 | no |

## content authoring

| System | Status | New trace | Kit / packets | Specific owner gap |
|---|---|---|---|---|
| BabyPlayDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| DifficultyDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| EntityCategoryDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| ExpansionDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| GameSetupStepDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| ImplementOwnerTypeDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| IssueDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| JoyGiverDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| JoyKindDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| NeedDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| NegativeFishingOutcomeDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| PawnGroupKindDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| PawnKindDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| PawnsArrivalModeDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| RecipeDef | prior-partial | none | K1/K2/K33/K34; P16/P22 | no |
| RecordDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| ScenPartDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| ScenarioDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| StatCategoryDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| StatDef | prior-partial | none | K1/K2/K33/K34; P16/P22 | no |
| StuffCategoryDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| ThingCategoryDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| ThingDef | partial-selected-consumers | S09,S12,S13 | K1/K2/K33/K34; P16/P22 | no |
| ThingSetMakerDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| TraitDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| jobDef | indexed-only | none | K1/K2/K33/K34; P16/P22 | no |
| Content loader | partial-selected-consumers | S14 | K1/K2/K33/K34; P16/P22 | no |
| Unity gameplay export | prior-partial | none | K1/K2/K33/K34; P16/P22 | no |
| Engine host/content loader/mod patches | partial-selected-consumers | S14 | K1/K2/K33/K34; P16/P22 | no |
| Content patches, inheritance and resolved definitions | deep-selected-static | S14 | K1/K2/K18/K33/K34; P16/P22 | no |

## economy

| System | Status | New trace | Kit / packets | Specific owner gap |
|---|---|---|---|---|
| Trade/gifts/standing | partial-selected-consumers | S09,S11 | K8/K9/K29; P02/P07/P18 | no |
| InventoryStockGroupDef | indexed-only | none | K8/K9/K29; P02/P07/P18 | no |
| TraderKindDef | partial-selected-consumers | S09 | K8/K9/K29; P02/P07/P18 | no |
| Trade quotes, settlement stock and restocking | deep-selected-static | S09 | K7/K8/K9/K29; P02/P07/P18 | no |

## engine infrastructure

| System | Status | New trace | Kit / packets | Specific owner gap |
|---|---|---|---|---|
| Root/game update and world init | prior-partial | none | K18/K34; P16 | YES |
| Ticks and distributed work | prior-partial | none | K18/K34; P16 | YES |
| Serialization/write recovery | prior-partial | none | K18/K34; P16 | YES |
| Mod/XML load and authoring | partial-selected-consumers | S14 | K18/K34; P16 | YES |
| Grammar and procedural text | prior-partial | none | K18/K34; P16 | YES |
| Explicit choice/negotiation | prior-partial | none | K18/K34; P16 | YES |
| Play log and retained attribution | prior-partial | none | K18/K34; P16 | YES |
| Delayed incidents/retry | prior-partial | none | K18/K34; P16 | YES |
| NPC jobs/think trees/toils | prior-partial | none | K18/K34; P16 | YES |
| Group/lord AI | indexed-only | none | K18/K34; P16 | YES |
| Pathfinding/spatial search | indexed-only | none | K18/K34; P16 | YES |
| Desktop windows/tabs/hotkeys | prior-partial | none | K18/K34; P16 | YES |
| Balance/quality/stat/RNG | prior-partial | none | K18/K34; P16 | YES |
| Adaptive teaching and tutorials | prior-partial | none | K18/K34; P16 | YES |
| DLC domain consumers | prior-partial | none | K18/K34; P16 | YES |
| DelaunatorSharp | indexed-only | none | K18/K34; P16 | YES |
| Ionic.Crc | indexed-only | none | K18/K34; P16 | YES |
| Ionic.Zlib | indexed-only | none | K18/K34; P16 | YES |
| KTrie | indexed-only | none | K18/K34; P16 | YES |
| LudeonTK | indexed-only | none | K18/K34; P16 | YES |
| RimWorld | indexed-only | none | K18/K34; P16 | YES |
| RimWorld.IO | indexed-only | none | K18/K34; P16 | YES |
| RimWorld.Utility | indexed-only | none | K18/K34; P16 | YES |
| Unity.Collections | indexed-only | none | K18/K34; P16 | YES |
| Verse | indexed-only | none | K18/K34; P16 | YES |
| Verse.Profile | indexed-only | none | K18/K34; P16 | YES |
| Verse.Steam | indexed-only | none | K18/K34; P16 | YES |
| Verse.Utility | indexed-only | none | K18/K34; P16 | YES |
| Comp | indexed-only | none | K18/K34; P16 | YES |
| MainTabWindow_ | indexed-only | none | K18/K34; P16 | YES |
| Dialog_ | indexed-only | none | K18/K34; P16 | YES |
| LordToil_ | indexed-only | none | K18/K34; P16 | YES |
| StatPart_ | indexed-only | none | K18/K34; P16 | YES |
| Belief, office and ritual | prior-partial | none | K18/K34; P16 | YES |
| Production and stock policy | prior-partial | none | K18/K34; P16 | YES |
| Event pacing | prior-partial | none | K18/K34; P16 | YES |
| Map/world generation, pathfinding, ecology | partial-selected-consumers | S12 | K18/K34; P16 | YES |
| Rendering/audio/input/accessibility | indexed-only | none | K18/K34; P16 | YES |
| Other DLC/mech/psychic-rutual/ending systems | indexed-only | none | K18/K34; P16 | YES |

## events and dialogue

| System | Status | New trace | Kit / packets | Specific owner gap |
|---|---|---|---|---|
| Quest signals/lifecycle | partial-selected-consumers | S15 | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| Storyteller selection | prior-partial | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| AnomalyPlaystyleDef | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| CreepJoinerAggressiveDef | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| CreepJoinerBenefitDef | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| CreepJoinerDownsideDef | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| CreepJoinerFormKindDef | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| CreepjoinerRejectionDef | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| GatheringDef | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| HistoryAutoRecorderDef | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| HistoryAutoRecorderGroupDef | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| HistoryEventDef | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| IncidentCategoryDef | prior-partial | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| IncidentDef | prior-partial | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| IncidentTargetTagDef | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| InspirationDef | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| InteractionDef | partial-selected-consumers | S04 | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| LetterDef | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| LogEntryDef | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| MonolithLevelDef | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| PitGateIncidentDef | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| QuestScriptDef | partial-selected-consumers | S15 | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| RuleDef | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| RulePackDef | prior-partial | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| StorytellerDef | prior-partial | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| TaleDef | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| RimWorld.QuestGen | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| Verse.Grammar | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| QuestPart_ | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| QuestNode_ | indexed-only | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| Storyteller/environment | prior-partial | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| Social log and memory | prior-partial | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| Social grammar/faction conversation | prior-partial | none | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| Quests/letters/journals | partial-selected-consumers | S15 | K6/K11/K12/K23/K32; P10/P12/P19/P20/P21/P24 | no |
| Quest generation compiles choices into saved runtime parts | deep-selected-static | S15 | K6/K11/K12/K18/K23/K32; P10/P12/P16/P19/P20/P24 | no |

## institutions

| System | Status | New trace | Kit / packets | Specific owner gap |
|---|---|---|---|---|
| CultureDef | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| ExpectationDef | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| FactionDef | partial-selected-consumers | S10,S11 | K7/K21/K24; P04/P07/P12 | no |
| GoodwillSituationDef | partial-selected-consumers | S11 | K7/K21/K24; P04/P07/P12 | no |
| IdeoColorDef | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| IdeoFoundationDef | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| IdeoIconDef | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| IdeoPresetCategoryDef | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| IdeoPresetDef | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| IdeoStoryPatternDef | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| MemeDef | prior-partial | none | K7/K21/K24; P04/P07/P12 | no |
| MemeGroupDef | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| PreceptDef | prior-partial | none | K7/K21/K24; P04/P07/P12 | no |
| PrisonerInteractionModeDef | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| PsychicRitualDef_BloodRain | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| PsychicRitualDef_Brainwipe | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| PsychicRitualDef_Chronophagy | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| PsychicRitualDef_ImbueDeathRefusal | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| PsychicRitualDef_NeurosisPulse | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| PsychicRitualDef_Philophagy | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| PsychicRitualDef_PleasurePulse | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| PsychicRitualDef_Psychophagy | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| PsychicRitualDef_SkipAbduction | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| PsychicRitualDef_SkipAbductionPlayer | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| PsychicRitualDef_SummonAnimals | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| PsychicRitualDef_SummonPitGate | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| PsychicRitualDef_SummonShamblers | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| PsychicRitualDef_VoidProvocation | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| PsychicRitualRoleDef | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| PsychicRitualRoleDef_DeathRefusalTarget | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| RitualAttachableOutcomeEffectDef | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| RitualBehaviorDef | prior-partial | none | K7/K21/K24; P04/P07/P12 | no |
| RitualObligationTargetFilterDef | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| RitualOutcomeEffectDef | prior-partial | none | K7/K21/K24; P04/P07/P12 | no |
| RitualPatternDef | prior-partial | none | K7/K21/K24; P04/P07/P12 | no |
| RitualTargetFilterDef | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| RitualVisualEffectDef | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| RoyalTitleDef | partial-selected-consumers | S07 | K7/K21/K24; P04/P07/P12 | no |
| RoyalTitlePermitDef | partial-selected-consumers | S07 | K7/K21/K24; P04/P07/P12 | no |
| SlaveInteractionModeDef | indexed-only | none | K7/K21/K24; P04/P07/P12 | no |
| Royalty, titles, psycasts, permits | partial-selected-consumers | S07,S08 | K7/K21/K24; P04/P07/P12 | no |
| Faction economy, trade, diplomacy | partial-selected-consumers | S09,S11 | K7/K21/K24; P04/P07/P12 | no |
| Titles, favor and faction service permits | deep-selected-static | S07 | K6/K7/K8/K15/K24; P04/P07/P13/P18 | no |
| Diplomacy uses goodwill, situations and relation hysteresis | deep-selected-static | S11 | K6/K7/K12/K24/K29; P07/P10/P12/P19 | no |

## knowledge

| System | Status | New trace | Kit / packets | Specific owner gap |
|---|---|---|---|---|
| Research/history/factions | prior-partial | none | K3/K11/K13; P03/P09/P11/P20 | no |
| EntityCodexEntryDef | indexed-only | none | K3/K11/K13; P03/P09/P11/P20 | no |
| KnowledgeCategoryDef | prior-partial | none | K3/K11/K13; P03/P09/P11/P20 | no |
| ResearchProjectDef | prior-partial | none | K3/K11/K13; P03/P09/P11/P20 | no |
| ResearchProjectTagDef | indexed-only | none | K3/K11/K13; P03/P09/P11/P20 | no |
| ResearchTabDef | indexed-only | none | K3/K11/K13; P03/P09/P11/P20 | no |
| SkillDef | prior-partial | none | K3/K11/K13; P03/P09/P11/P20 | no |
| Skills and learning | prior-partial | none | K3/K11/K13; P03/P09/P11/P20 | no |
| Research | prior-partial | none | K3/K11/K13; P03/P09/P11/P20 | no |
| Subject study/knowledge/containment | prior-partial | none | K3/K11/K13; P03/P09/P11/P20 | no |

## powers

| System | Status | New trace | Kit / packets | Specific owner gap |
|---|---|---|---|---|
| Learned powers, focus, heat and casting effects | deep-selected-static | S08 | K2/K3/K10/K15/K22; P04/P05/P17 | no |

## powers and combat

| System | Status | New trace | Kit / packets | Specific owner gap |
|---|---|---|---|---|
| AbilityCategoryDef | indexed-only | none | K2/K3/K10/K22; P04/P14/P17 | no |
| AbilityDef | partial-selected-consumers | S08 | K2/K3/K10/K22; P04/P14/P17 | no |
| AbilityGroupDef | indexed-only | none | K2/K3/K10/K22; P04/P14/P17 | no |
| BossDef | indexed-only | none | K2/K3/K10/K22; P04/P14/P17 | no |
| BossgroupDef | indexed-only | none | K2/K3/K10/K22; P04/P14/P17 | no |
| DamageArmorCategoryDef | indexed-only | none | K2/K3/K10/K22; P04/P14/P17 | no |
| DamageDef | indexed-only | none | K2/K3/K10/K22; P04/P14/P17 | no |
| ManeuverDef | indexed-only | none | K2/K3/K10/K22; P04/P14/P17 | no |
| MeditationFocusDef | partial-selected-consumers | S08 | K2/K3/K10/K22; P04/P14/P17 | no |
| RaidAgeRestrictionDef | indexed-only | none | K2/K3/K10/K22; P04/P14/P17 | no |
| RaidStrategyDef | indexed-only | none | K2/K3/K10/K22; P04/P14/P17 | no |
| ToolCapacityDef | indexed-only | none | K2/K3/K10/K22; P04/P14/P17 | no |
| WeaponCategoryDef | indexed-only | none | K2/K3/K10/K22; P04/P14/P17 | no |
| WeaponClassDef | indexed-only | none | K2/K3/K10/K22; P04/P14/P17 | no |
| WeaponClassPairDef | indexed-only | none | K2/K3/K10/K22; P04/P14/P17 | no |
| WeaponTraitDef | indexed-only | none | K2/K3/K10/K22; P04/P14/P17 | no |
| Ability | indexed-only | none | K2/K3/K10/K22; P04/P14/P17 | no |
| Combat/body/medicine/equipment | partial-selected-consumers | S01,S02 | K2/K3/K10/K22; P04/P14/P17 | no |

## production

| System | Status | New trace | Kit / packets | Specific owner gap |
|---|---|---|---|---|
| Infrastructure power separates output, stored reserve and service | deep-selected-static | S13 | K8/K9/K13/K25; P02/P04/P08/P17 | YES |

## production and AI

| System | Status | New trace | Kit / packets | Specific owner gap |
|---|---|---|---|---|
| Bill/stock target interface | prior-partial | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| BillRepeatModeDef | prior-partial | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| BillStoreModeDef | prior-partial | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| DutyDef | indexed-only | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| JobDef | indexed-only | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| MechWeightClassDef | indexed-only | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| MechWorkModeDef | indexed-only | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| OrderedTakeGroupDef | indexed-only | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| ReservationLayerDef | indexed-only | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| ShipJobDef | indexed-only | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| SpecialThingFilterDef | indexed-only | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| ThinkTreeDef | indexed-only | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| WorkGiverDef | prior-partial | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| WorkGiverEquivalenceGroupDef | indexed-only | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| WorkTypeDef | prior-partial | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| Verse.AI | indexed-only | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| Verse.AI.Group | indexed-only | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| JobDriver_ | indexed-only | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| WorkGiver_ | indexed-only | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| ThinkNode_ | indexed-only | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| IncidentWorker_ | indexed-only | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| LordJob_ | indexed-only | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| Work admission and jobs | prior-partial | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| Bills and hauling | prior-partial | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |
| Work scheduling and execution | prior-partial | none | K8/K9/K13/K26; P01/P02/P06/P08/P25 | no |

## save and clocks

| System | Status | New trace | Kit / packets | Specific owner gap |
|---|---|---|---|---|
| Host and Unity compatibility | prior-partial | none | K18/K26/K33; P05/P13/P16/P23/P24 | no |
| Version and content compatibility | prior-partial | none | K18/K26/K33; P05/P13/P16/P23/P24 | no |
| Calendar and autosave | prior-partial | none | K18/K26/K33; P05/P13/P16/P23/P24 | no |
| TimeAssignmentDef | indexed-only | none | K18/K26/K33; P05/P13/P16/P23/P24 | no |
| Scribe save | prior-partial | none | K18/K26/K33; P05/P13/P16/P23/P24 | no |
| Ticks/time/calendar | prior-partial | none | K18/K26/K33; P05/P13/P16/P23/P24 | no |
| Saves/migrations/autosave | prior-partial | none | K18/K26/K33; P05/P13/P16/P23/P24 | no |

## social

| System | Status | New trace | Kit / packets | Specific owner gap |
|---|---|---|---|---|
| Directed social memory/opinion | prior-partial | none | K6/K20/K24/K31; P06/P12/P15/P19 | no |
| BackStoryDef | indexed-only | none | K6/K20/K24/K31; P06/P12/P15/P19 | no |
| BackstoryDef | indexed-only | none | K6/K20/K24/K31; P06/P12/P15/P19 | no |
| MentalBreakDef | partial-selected-consumers | S05 | K6/K20/K24/K31; P06/P12/P15/P19 | no |
| MentalFitDef | indexed-only | none | K6/K20/K24/K31; P06/P12/P15/P19 | no |
| MentalStateDef | partial-selected-consumers | S05 | K6/K20/K24/K31; P06/P12/P15/P19 | no |
| PawnRelationDef | partial-selected-consumers | S04 | K6/K20/K24/K31; P06/P12/P15/P19 | no |
| ThoughtDef | partial-selected-consumers | S04,S05 | K6/K20/K24/K31; P06/P12/P15/P19 | no |
| Relationships, romance and family references | deep-selected-static | S04 | K6/K8/K22/K24; P06/P12/P15/P19 | no |
| Mood pressure, break selection and recovery | deep-selected-static | S05 | K6/K22/K26/K32; P10/P12/P13/P25 | no |

## world simulation

| System | Status | New trace | Kit / packets | Specific owner gap |
|---|---|---|---|---|
| BiomeDef | partial-selected-consumers | S10,S12 | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| ComplexLayoutDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| ComplexThreatDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| FeatureDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| GameConditionDef | prior-partial | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| GenStepDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| GlobalWorldDrawLayerDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | YES |
| GravshipComponentTypeDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| HibernatableStateDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| LandingOutcomeDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| LandmarkDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| LayoutDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| LayoutRoomDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| OrbitalDebrisDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| PathGridDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| PlaceDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| PlanetLayerDef | prior-partial | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| PlanetLayerSettingsDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| PrefabDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| RiverDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| RoadDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| RoadPathingDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| RoadWorldLayerDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| RoofDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| RoomPartDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| RoomPart_BarricadeDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| RoomPart_CrateDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| RoomPart_GestationTankDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| RoomPart_ThingDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| RoomRoleDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| RoomStatDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| ScatterableDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| SitePartDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| SketchResolverDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| StructureLayoutDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| StructureStructureLayoutDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| TerrainAffordanceDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| TerrainDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| TerrainTemplateDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| TileMutatorDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| TransportShipDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| WeatherDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| WorldGenStepDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| WorldObjectDef | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| RimWorld.BaseGen | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| RimWorld.Planet | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| RimWorld.SketchGen | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| Verse.Noise | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| GameCondition_ | indexed-only | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| Moving colony and infrastructure | prior-partial | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| Layer/environment/travel | prior-partial | none | K2/K5/K25/K28/K29; P05/P13/P14/P15 | no |
| Caravan logistics, needs and conditional passive foraging | deep-selected-static | S10 | K5/K6/K8/K26/K28; P06/P08/P13/P18 | no |
| Cultivation, harvest yield and ecological admission | deep-selected-static | S12 | K8/K9/K13/K28/K29; P02/P08/P13/P14 | no |


# System inventory

Scope: every top-level content root found in the IoStore export index, named subsystem patterns, and every emitted export type in the targeted reads. This is an auditable inventory of what this lane found, not an exhaustive semantic census of all 92.8 GB of content. Count signals include art, audio, partial objects and repeated samples. An asset path is not a class, runtime instance or enabled feature.

## System families

| System | Where | Size signal | Documentation / gap |
|---|---|---:|---|
| Campaign/world activation | Campaign_Main | 3 generic world slot references; named activation bytecode | WORLD_GENERATION_AND_RULES; native roll selection unread |
| Adventure story selection | World_Fae/Jungle/Nerud Quests/Quest_AdventureMode | 3 base wrappers read, DLC wrappers sampled | WORLD_GENERATION_AND_RULES; weights/eligibility unread |
| Authored stories, inserts and side dungeons | World_*/Quests | See exact-name patterns below | This dossier partial; full constraint solver undocumented |
| Power/build | World_Base/Items/Archetypes, Traits, Mods, Trinkets | Definition patterns below | CARRYOVER_AND_BUILD; unlock tables and all transfer edges unread |
| Dialogue/lore | EventTree_ filename family, related speakers/lore | 127 named EventTree assets attempted | DIALOGUE_AND_DISCOVERY; 161 error-bearing package outputs across all passes |
| Ambient speech | Pan_Wolf dialogue state machine | 45 exports, 6 ActorState records | DIALOGUE_AND_DISCOVERY; other selectors unread |
| Local hazard | World_Nerud/Environments/Blueprint | 2 fog assets decoded | WORLD_GENERATION_AND_RULES; native action effect details unread |
| Navigation/tiles/spawns | TileSet, TileInfo, quest links, EQS | 15 TileSet filename matches | WORLD_GENERATION_AND_RULES; solver and spawn budgets unread |
| Save/ownership | Persistence components, native calls, third-party reader | profile/world distinction; selected SaveGame fields | CARRYOVER_AND_BUILD; engine migration/recovery undocumented |
| UI/inspect/focus | UI and UI2 | Root counts below | A06 partial, no render; complete interaction model undocumented |
| AI/encounter behavior | character state machines, controllers, AIData, EQS | State-machine suffix matches below | A05 partial; full combat planner undocumented |
| Items/craft/economy/relics/prisms | world item roots, Events/Paragon | Root/type census only | A12 partial; full craft/economy/prism rules undocumented |
| Survival/DLC/editor/test payload | SurvivalMode, World_DLC*, editor/test roots | Root counts below | Presence only; no activation or player availability claim |

Top three deeper reads by relevance are generation/identity, portable faculties, and dialogue with consequences. See DEEPER_SYSTEMS. Existing lanes may cite this dossier; this lane did not modify a synthesis or claim their reviews.

## Naming-pattern census

Exact regular expressions and raw path matches can be regenerated with `tools/census.py` in the assigned work area. These counts omit differently named assets and include unused or DLC payload.

| Pattern family | Matches |
|---|---:|
| story_definitions | 11 |
| injectable_definitions | 35 |
| side_dungeon_definitions | 23 |
| boss_definitions | 9 |
| archetype_definitions | 14 |
| trait_definitions | 43 |
| ring_definitions | 225 |
| amulet_definitions | 104 |
| mod_definitions | 82 |
| state_machines | 371 |
| tile_sets | 15 |
| spawn_tables | 469 |

## All observed top-level content roots

Each row is an indexed subsystem/content family. Unless explicitly documented above, its internals are UNREAD. Speech sample exports are animation sequences, not proof of 17,279 dialogue lines. WwiseAudio paths include localization and media; their count is not unique spoken content. Editor/Developers/Tests roots are retained in inventory without treating them as shipped play.

| Root under Remnant2/Content | Unique export paths | Read status |
|---|---:|---|
| Campaign_Main | 119 | selected partial reads |
| Characters | 9702 | UNREAD internals; indexed only |
| Developers | 41 | UNREAD internals; indexed only |
| Environment | 64 | UNREAD internals; indexed only |
| Events | 257 | UNREAD internals; indexed only |
| GunfireEditor | 33 | UNREAD internals; indexed only |
| HoudiniEngine | 1 | UNREAD internals; indexed only |
| Items | 60 | UNREAD internals; indexed only |
| Maps | 13 | UNREAD internals; indexed only |
| Marketplace | 623 | UNREAD internals; indexed only |
| Materials | 5 | UNREAD internals; indexed only |
| Movies | 6 | UNREAD internals; indexed only |
| RemnantEditor | 1 | UNREAD internals; indexed only |
| Shared | 1118 | UNREAD internals; indexed only |
| Slate | 4 | UNREAD internals; indexed only |
| Sound | 35 | UNREAD internals; indexed only |
| Speech | 17279 | selected partial reads |
| SurvivalMode | 217 | UNREAD internals; indexed only |
| Tests | 6 | UNREAD internals; indexed only |
| UI | 705 | selected partial reads |
| UI2 | 1864 | UNREAD internals; indexed only |
| VFX | 1208 | UNREAD internals; indexed only |
| World_Base | 9045 | selected partial reads |
| World_City | 3490 | selected partial reads |
| World_DLC1 | 4567 | selected partial reads |
| World_DLC2 | 4524 | selected partial reads |
| World_DLC3 | 4741 | selected partial reads |
| World_DLC4 | 26 | UNREAD internals; indexed only |
| World_Fae | 14582 | selected partial reads |
| World_Jungle | 15712 | selected partial reads |
| World_Labyrinth | 1437 | selected partial reads |
| World_Nerud | 8357 | selected partial reads |
| World_Root | 1632 | selected partial reads |
| WwiseAudio | 409672 | UNREAD internals; indexed only |
| _Core | 1894 | selected partial reads |

## Every emitted export type in the selected reads

Counts span all sample outputs and may repeat an asset across passes. An export type with no focused analysis elsewhere is UNDOCUMENTED beyond this census. Unknown/unversioned values remain partial even when JSON exists. Private package-audit.json binds package errors; types.json gives this complete count table.

| Export type / subsystem locator | Emitted count |
|---|---:|
| `EventTreeNode_Dialog` | 8952 |
| `Branch_Random` | 3234 |
| `Branch_DialogOption` | 2207 |
| `DialogLine` | 1905 |
| `SCS_Node` | 1057 |
| `EventTreeNode_ExecTrigger` | 981 |
| `SoundEntry` | 784 |
| `EventTreeNode_DialogOptions` | 752 |
| `Function` | 749 |
| `HasItemCondition` | 741 |
| `EventTreeNode_Trigger` | 608 |
| `Branch_Switch` | 590 |
| `EventTreeNode_RandomBranch` | 523 |
| `EventTreeNode_Exit` | 449 |
| `RemnantQuestEntity` | 317 |
| `EventTreeNode_Event` | 313 |
| `EventTreeNode_StageShot` | 275 |
| `EventTreeNode_ShowMenu_C` | 239 |
| `DialogEntry` | 238 |
| `EventTreeNode_Delay` | 215 |
| `SoundID` | 211 |
| `EventTreeNode_HideMenu_C` | 208 |
| `EventTreeNode_Switch` | 196 |
| `RemnantQuestSubQuest` | 161 |
| `EventTree` | 127 |
| `RemnantQuestZoneLink` | 126 |
| `Branch_ContextualDialogEntry` | 114 |
| `EventTreeNode_QuestReward_C` | 98 |
| `BlueprintGeneratedClass` | 92 |
| `SceneComponent` | 80 |
| `RemnantQuestTile` | 79 |
| `EventTreeNode_RemoveItem_C` | 78 |
| `EventTreeNode_LevelSequence` | 76 |
| `QuestStateCondition` | 75 |
| `RemnantQuestTrigger` | 72 |
| `EventTreeNode_SoundSet` | 71 |
| `EventTreeNode_ProximityTrigger` | 70 |
| `EventTreeNode_LookAt_C` | 69 |
| `EventTreeNode_SetMultipleSpeakers` | 69 |
| `QuestObjective` | 67 |
| `RemnantQuestLink` | 61 |
| `EventTreeNode_ContextualDialogTrigger` | 61 |
| `SimpleConstructionScript` | 53 |
| `PersistenceComponent` | 50 |
| `TagCondition` | 46 |
| `Quest_Waypoint_C` | 42 |
| `PlayersNearbyCondition` | 36 |
| `RemnantQuestAIDirector` | 33 |
| `RemnantQuestZone` | 32 |
| `Branch_SequenceOption` | 30 |
| `Image` | 28 |
| `EventTreeNode_Emote` | 28 |
| `VariableComponent` | 27 |
| `EventTreeNode_ChallengeReward_C` | 24 |
| `EventTreeNode_Stage` | 23 |
| `SpawnTableItem` | 21 |
| `InheritableComponentHandler` | 20 |
| `ComponentDelegateBinding` | 18 |
| `GridSlot` | 18 |
| `Quest_Checkpoint_C` | 16 |
| `TileSet` | 15 |
| `EventTreeNode_DoInteractive_C` | 15 |
| `EventTreeNode_IndividualReward_C` | 14 |
| `RemnantQuestEventRegion` | 12 |
| `EventTreeNode_ActivateObjective` | 12 |
| `CustomCondition` | 12 |
| `VerticalBoxSlot` | 10 |
| `EventTreeNode_CompleteObjective` | 10 |
| `QuestObjective_Siege_C` | 9 |
| `SpawnTable` | 9 |
| `CanvasPanelSlot` | 9 |
| `OverlaySlot` | 9 |
| `MovieSceneBuiltInEasingFunction` | 8 |
| `ActorStateTransition` | 8 |
| `VariableStatementsCondition` | 7 |
| `Branch_QuestSwitch` | 7 |
| `QuestObjective_Talk_C` | 6 |
| `AnimSequence` | 6 |
| `HorizontalBoxSlot` | 6 |
| `ActorState` | 6 |
| `CooldownStateDecorator` | 6 |
| `SoundSet` | 6 |
| `QuestLoreItem_C` | 5 |
| `SpawnTableAccountAward` | 5 |
| `Texture2D` | 5 |
| `Border` | 5 |
| `VerticalBox` | 5 |
| `EventTreeNode_TriggerNamedObjects_C` | 5 |
| `DataTable` | 4 |
| `BorderSlot` | 4 |
| `CanvasPanel` | 4 |
| `MovieScene` | 4 |
| `MovieSceneCompiledData` | 4 |
| `WidgetAnimation` | 4 |
| `WidgetBlueprintGeneratedClass` | 4 |
| `WidgetTree` | 4 |
| `HorizontalBox` | 4 |
| `EventStateDecorator` | 4 |
| `InCombatCondition` | 4 |
| `ActorCustomizationEffectEntry` | 3 |
| `ActorCustomizationSetEffect` | 3 |
| `ParticleCustomizationEffect` | 3 |
| `AnimNotify_PlaySoundSetSound` | 3 |
| `SpawnTableLink` | 3 |
| `MovieSceneFloatSection` | 3 |
| `MovieSceneFloatTrack` | 3 |
| `Overlay` | 3 |
| `HealthCondition` | 3 |
| `StateElapsedCondition` | 3 |
| `EventTreeNode_ForcePlayerIntoEventRegion_C` | 3 |
| `EventTreeNode_BinkCinematic` | 3 |
| `AnimNotify_ForceFeedback` | 2 |
| `AnimNotify_StateSound` | 2 |
| `Dialog_Dialogue_C` | 2 |
| `AdvTextBlock` | 2 |
| `Widget_ButtonEx_C` | 2 |
| `FocusButtonSlot` | 2 |
| `FocusButtonWidget` | 2 |
| `MapTileInfoAsset` | 2 |
| `SpawnTableCharacter` | 2 |
| `StaticMeshComponent` | 2 |
| `StatsComponent` | 2 |
| `RangeToTargetCondition` | 2 |
| `GridPanel` | 2 |
| `SizeBox` | 2 |
| `SizeBoxSlot` | 2 |
| `EventTreeNode_SetCooldown` | 2 |
| `EventTreeNode_SetState` | 2 |
| `VariableCondition` | 2 |
| `EventTreeNode_Fade_C` | 2 |
| `EventTreeNode_TutorialPrompt` | 2 |
| `HasItemByTypeCondition` | 2 |
| `Quest_Story_TheCore_C` | 1 |
| `Quest_Story_IAmLegend_C` | 1 |
| `Quest_Story_AllFather_C` | 1 |
| `Quest_Story_Asylum_C` | 1 |
| `Archetype_Archon_C` | 1 |
| `Archetype_Archon_UI_C` | 1 |
| `Archetype_Challenger_C` | 1 |
| `Archetype_Challenger_UI_C` | 1 |
| `ActorCustomizationID` | 1 |
| `ActorCustomizationSet` | 1 |
| `ActorCustomizationSetSlot` | 1 |
| `ParticleCustomization` | 1 |
| `Archetype_Alchemist_UI_C` | 1 |
| `Archetype_Alchemist_C` | 1 |
| `Archetype_Engineer_UI_C` | 1 |
| `Archetype_Engineer_C` | 1 |
| `Quest_Story_Empress_C` | 1 |
| `Quest_Story_Ravager_C` | 1 |
| `Quest_AdventureMode_DLC2_C` | 1 |
| `Quest_AdventureMode_DLC2_OneShot_C` | 1 |
| `Quest_Story_DLC2_OneShot_C` | 1 |
| `Quest_Story_DLC2_C` | 1 |
| `Quest_Story_DLC3_OneShot_C` | 1 |
| `Quest_AdventureMode_DLC3_OneShot_C` | 1 |
| `Quest_AdventureMode_DLC3_C` | 1 |
| `Quest_Story_DLC3_C` | 1 |
| `Quest_Story_Labyrinth_C` | 1 |
| `Quest_AdventureMode_OTK_C` | 1 |
| `Quest_Story_OneTrueKing_OneShot_C` | 1 |
| `Quest_AdventureMode_OTK_OneShot_C` | 1 |
| `Quest_Story_OneTrueKing_C` | 1 |
| `InputDebugKeyDelegateBinding` | 1 |
| `Quest_Story_Intro_C` | 1 |
| `Quest_Campaign_Main_C` | 1 |
| `Quest_AdventureMode_Nerud_C` | 1 |
| `Quest_AdventureMode_Fae_C` | 1 |
| `AnimNotify_ItemEvent` | 1 |
| `BP_Archetype_C` | 1 |
| `Quest_AdventureMode_Jungle_C` | 1 |
| `SpawnTableTrait` | 1 |
| `Quest_RootEarth_Zone2_C` | 1 |
| `Quest_RootEarth_TowerBoss_C` | 1 |
| `Quest_RootEarth_Zone1_C` | 1 |
| `FocusGroup` | 1 |
| `MovieScene2DTransformSection` | 1 |
| `MovieScene2DTransformTrack` | 1 |
| `Spacer` | 1 |
| `Widget_Dialogue_C` | 1 |
| `RemnantCursorPanel` | 1 |
| `ScaleBox` | 1 |
| `ScaleBoxSlot` | 1 |
| `TextBlock` | 1 |
| `Widget_Trait_Mini_C` | 1 |
| `Widget_Trait_Base_C` | 1 |
| `Action_Ring_BandOfAccord_C` | 1 |
| `Ring_BandOfAccord_C` | 1 |
| `Action_Amulet_TwistedIdol_C` | 1 |
| `Amulet_TwistedIdol_C` | 1 |
| `Trait_Vigor_C` | 1 |
| `ActorContextCondition` | 1 |
| `CooldownCondition` | 1 |
| `LastAttackCondition` | 1 |
| `StateMachine` | 1 |
| `BillboardComponent` | 1 |
| `BoxComponent` | 1 |
| `BP_Nerud_DeathFog_C` | 1 |
| `PostProcessComponent` | 1 |
| `Action_DeathFog_BuildUpHandler_C` | 1 |
| `Mod_RottedArrow_C` | 1 |
| `Widget_DialogueOption_C` | 1 |
| `Widget_Game_Button_Flex_Background_C` | 1 |
| `Speaker_TalRatha_C` | 1 |
| `LoreItem_DryzrMusician_C` | 1 |
| `LoreItem_TalRatha_Log02_C` | 1 |
| `LoreItem_SleeplessDream_C` | 1 |
| `LoreItem_Ghost_in_the_Machine_C` | 1 |
| `LoreItem_TalRatha_Log01_C` | 1 |
| `LoreItem_TalRatha_Log04_C` | 1 |
| `LoreItem_TalRatha_Log03_C` | 1 |
| `LoreItem_Apostech_SecondusMolto_C` | 1 |
| `LoreItem_Precept_Surus_Log01_C` | 1 |
| `LoreItem_Precept_Surus_Log02_C` | 1 |
| `LoreItem_Epirus_Calca_C` | 1 |
| `LoreItem_LoveLorn_C` | 1 |
| `Speaker_OldVaunnt_C` | 1 |
| `Speaker_Ravager_C` | 1 |
| `Speaker_Meidra_C` | 1 |
| `Speaker_Uuqul_C` | 1 |
| `Speaker_RootSightline_C` | 1 |
| `Speaker_PrivateDriver_C` | 1 |
| `Speaker_Lydusa_C` | 1 |
| `Speaker_TheGardener_C` | 1 |
| `Speaker_Perseverance_C` | 1 |
| `Speaker_Curiosity_C` | 1 |
| `Speaker_Robin_C` | 1 |
| `Speaker_Gemini_C` | 1 |
| `LoreItem_AudioLog_ShiftingCitadel_DLC3_C` | 1 |
| `LoreItem_AudioLog_CropLab_DLC3_C` | 1 |
| `LoreItem_AudioLog_GasChamber_DLC3_C` | 1 |
| `LoreItem_AudioLog_Podcheck_DLC3_C` | 1 |
| `LoreItem_AudioLog_ShaHala_DLC3_C` | 1 |
| `LoreItem_AudioLog_MachineUprising_DLC3_C` | 1 |
| `LoreItem_AudioLog_SecurityDrone_DLC3_C` | 1 |
| `LoreItem_AudioLog_ASparkofInspiration_DLC3_C` | 1 |
| `Speaker_Impaler_C` | 1 |
| `Speaker_Impaler_Base_C` | 1 |
| `Speaker_BridgeWarden_C` | 1 |
| `Speaker_OneTrueKing_C` | 1 |
| `Speaker_TowerDran_C` | 1 |
| `Speaker_MumblingDran_C` | 1 |
| `Speaker_F_MumblingDran01_C` | 1 |
| `Speaker_Dran_Elowen_C` | 1 |
| `Speaker_PreacherDran_C` | 1 |
| `Speaker_M_MumblingDran01_C` | 1 |
| `Speaker_M_MumblingDran02_C` | 1 |
| `Speaker_Leywise_C` | 1 |
| `Speaker_DocksDran_C` | 1 |
| `EventTreeNode_QuestSwitch` | 1 |
| `ChanceCondition` | 1 |

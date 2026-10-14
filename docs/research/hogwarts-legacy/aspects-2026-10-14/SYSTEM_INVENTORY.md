# Hogwarts Legacy system inventory

2026-10-14. Fresh census of every table in both shipped SQLite databases. Ship: 530 tables. Game: 633 tables. Both integrity checks pass. Counts include empty templates, defaults, tests, development and gated content. A count is not proof of a functioning subsystem.

The union has **633 distinct table names**. The family summary below covers all of them. The full table inventory preserves separate Ship/Game counts, so development-only definitions stay visible. Every table was schema-read, counted and fully archived privately; only named selections were semantically read.

## System families

| Family | Distinct tables | Documentation in this pass |
|---|---:|---|
| Dialogue/ambient response | 13 | A01; DEEPER_SYSTEMS DS1 |
| Knowledge/reveal | 29 | A10; DEEPER_SYSTEMS DS2 |
| Social action/stations | 37 | DEEPER_SYSTEMS DS3 |
| Crime/investigation | 9 | A12, schema only |
| Quests/story/mail | 36 | A02 |
| Time/schedules/population | 87 | A09 |
| Enemy/combat | 85 | A05/A08; prior deep AI |
| Spell/ability/progression | 29 | A08; prior progression |
| Care/room/production | 71 | A12; prior care digest |
| Economy/gear/stock | 52 | A12; prior extras |
| World/travel/spawning | 85 | A12/A09 |
| Input/UI/tutorial/collections | 29 | A06/A10/A11/A12 |
| Actors/identity/other runtime defaults | 71 | Inventory only unless cited |

## Asset families beyond SQLite

The retained effective IoStore path listing is a read-only snapshot copied into this lane. The seven fresh extracted DB/text/config files match retained hashes, but the whole current IoStore index was not regenerated. Counts below are unique .uasset paths under Phoenix/Content by first directory, not class counts or live feature counts. Table-free systems include animation, rendering, audio, cinematics, AI trees, input widgets and plugins. Asset names/prefixes are discovery evidence only.

| Content directory | Unique package paths in retained index | Read depth / lane |
|---|---:|---|
| `Animation` | 50976 | INVENTORY ONLY; internals unread |
| `Chaos` | 7 | INVENTORY ONLY; internals unread |
| `Cinematics` | 13823 | Selected conversation/preset graphs fresh; prior deep selected graphs |
| `Data` | 4921 | Selected conversation/preset graphs fresh; prior deep selected graphs |
| `DbAssetMaps` | 23 | INVENTORY ONLY; internals unread |
| `Editors` | 132 | INVENTORY ONLY; internals unread |
| `Environment` | 54824 | INVENTORY ONLY; internals unread |
| `Experimental` | 53 | INVENTORY ONLY; internals unread |
| `Gameplay` | 12611 | Fresh autosave trigger/component/interface; prior selected utilities |
| `Levels` | 13512 | Prior deep selected event director data; most maps unread |
| `MaterialFunctions` | 101 | INVENTORY ONLY; internals unread |
| `Movies` | 139 | INVENTORY ONLY; internals unread |
| `Pawn` | 3390 | Prior deep selected behavior trees/blackboards; not freshly reparsed |
| `PermutedMaterials` | 1856 | INVENTORY ONLY; internals unread |
| `RiggedObjects` | 18050 | INVENTORY ONLY; internals unread |
| `Sky` | 15 | INVENTORY ONLY; internals unread |
| `UI` | 7790 | Fresh save/load widget; prior talent/loom/input selections; visual layout unread |
| `VFX` | 9386 | INVENTORY ONLY; internals unread |
| `WWise` | 7369 | INVENTORY ONLY; internals unread |

| Plugin directory | Unique package paths | Documentation |
|---|---:|---|
| `Able` | 2 | INVENTORY ONLY; internals unread |
| `ActorMeshStates` | 1 | INVENTORY ONLY; internals unread |
| `Ambulatory` | 1 | INVENTORY ONLY; internals unread |
| `AnimatedLights` | 4 | INVENTORY ONLY; internals unread |
| `AnimationArchitect` | 15 | INVENTORY ONLY; internals unread |
| `AvaRenderTech` | 24 | INVENTORY ONLY; internals unread |
| `ConsoleMacros` | 1 | INVENTORY ONLY; internals unread |
| `CustomizableCharacter` | 5 | INVENTORY ONLY; internals unread |
| `DayNight` | 137 | INVENTORY ONLY; internals unread |
| `DirectorCam` | 81 | INVENTORY ONLY; internals unread |
| `EditorUtilityAssetsPlugin` | 14 | INVENTORY ONLY; internals unread |
| `EnvironmentalGlobals` | 7 | INVENTORY ONLY; internals unread |
| `FXUtil` | 32 | INVENTORY ONLY; internals unread |
| `Flow` | 137 | INVENTORY ONLY; internals unread |
| `GlobalLightGroups` | 1 | INVENTORY ONLY; internals unread |
| `GlobalLightRig` | 49 | INVENTORY ONLY; internals unread |
| `HiveMind` | 15 | INVENTORY ONLY; internals unread |
| `HoudiniNiagara` | 4 | INVENTORY ONLY; internals unread |
| `HoverDrone` | 29 | INVENTORY ONLY; internals unread |
| `ImpostorBaker` | 1 | INVENTORY ONLY; internals unread |
| `LerpVolumes` | 2 | INVENTORY ONLY; internals unread |
| `LightCulling` | 18 | INVENTORY ONLY; internals unread |
| `Mastermind` | 7 | INVENTORY ONLY; internals unread |
| `MaterialPermuter` | 3 | INVENTORY ONLY; internals unread |
| `Mercuna` | 6 | INVENTORY ONLY; internals unread |
| `ModSupport` | 248 | Fresh tutorial save class and interface text only; load order/API unread |
| `NiagaraStarField` | 28 | INVENTORY ONLY; internals unread |
| `Odyssey` | 10 | INVENTORY ONLY; internals unread |
| `PSOCaching` | 2 | INVENTORY ONLY; internals unread |
| `PeevesPlugin` | 2 | INVENTORY ONLY; internals unread |
| `RenderSettings` | 50 | INVENTORY ONLY; internals unread |
| `Runtime` | 3 | INVENTORY ONLY; internals unread |
| `SceneRig` | 2 | INVENTORY ONLY; internals unread |
| `SimplifyRockGeneration` | 1 | INVENTORY ONLY; internals unread |
| `SkinFX` | 9 | INVENTORY ONLY; internals unread |
| `StencilManager` | 69 | INVENTORY ONLY; internals unread |
| `StreamingComplexityTool` | 1 | INVENTORY ONLY; internals unread |
| `TickSequencer` | 1 | INVENTORY ONLY; internals unread |
| `WImguiFriendlyStats` | 1 | INVENTORY ONLY; internals unread |
| `WWise` | 44 | INVENTORY ONLY; internals unread |
| `Weather` | 93 | INVENTORY ONLY; internals unread |
| `Wind` | 2 | INVENTORY ONLY; internals unread |
| `WorldFX` | 18 | INVENTORY ONLY; internals unread |
| `cfcore_ui` | 218 | INVENTORY ONLY; internals unread |

Native /Script/Phoenix, /Script/Engine, Hermes, TimeRig/SceneRig and Articy provider references occur in decoded exports. Their complete native module inventory, audio record grammar, rendering, streaming/performance and platform services are unread. Native exports are not exhaustively counted here.

## Full database inventory

`Prior` means an exact table-name mention in a previously read dossier .md file, excluding private material and this folder. A mention is not a semantic audit or lane completion. `NO PRIOR MENTION` explicitly marks candidates for follow-up; the three selected families are read in DEEPER_SYSTEMS. `not in DB` differs from zero rows. This is an inventory rather than a dump of table contents.

| Table | Ship rows | Game rows | Prior exact-name mention | Current disposition |
|---|---:|---:|---|---|
| `AchievementChallengeCategory` | 5 | 5 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `AchievementChallenges` | 24 | 24 | PROGRESSION_DIGEST.md, deep/XP_DIGEST.md | A06/A10/A11/A12; schema census is not consumer proof |
| `AchievementCriteria` | 241 | 241 | PROGRESSION_DIGEST.md, SPELL_AND_LESSON_DIGEST.md | A06/A10/A11/A12; schema census is not consumer proof |
| `AchievementDefinition` | 276 | 276 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `AchievementDynamic` | 0 | 0 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `AchievementRewardCategory` | 8 | 8 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `AchievementRewardTypes` | 10 | 10 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `AchievementRewards` | 217 | 217 | PROGRESSION_DIGEST.md | A06/A10/A11/A12; schema census is not consumer proof |
| `AchievementTypes` | 8 | 8 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `AcknowledgementDynamic` | 0 | 0 | **NO PRIOR MENTION** | A01; DEEPER_SYSTEMS DS1; schema census is not consumer proof |
| `AcknowledgementMissionDisablesVO` | 20 | 20 | **NO PRIOR MENTION** | A01; DEEPER_SYSTEMS DS1; schema census is not consumer proof |
| `AcknowledgementMissionStats` | 64 | 64 | **NO PRIOR MENTION** | A01; DEEPER_SYSTEMS DS1; schema census is not consumer proof |
| `AcknowledgementNPCType` | 8 | 8 | **NO PRIOR MENTION** | A01; DEEPER_SYSTEMS DS1; schema census is not consumer proof |
| `AcknowledgementRules` | 219 | 219 | **NO PRIOR MENTION** | A01; DEEPER_SYSTEMS DS1; schema census is not consumer proof |
| `ActivityCriticalResult` | 4 | 4 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `ActivityDefinition` | 1320 | 1320 | REPORT.md | A09; schema census is not consumer proof |
| `ActivityRecurrenceTypes` | 5 | 5 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `ActivityTypes` | 21 | 21 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `ActorDefinition` | 734 | 734 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `AmbientChatterTopicsDynamic` | 89 | 89 | **NO PRIOR MENTION** | A01; DEEPER_SYSTEMS DS1; schema census is not consumer proof |
| `AmbientCreatureDefinition` | 12 | 12 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `AmbientCreatureFrequencyDefinition` | 7 | 7 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `AmbientCreatureGroup` | 11 | 11 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `AmbientCreatureGroupDefinition` | 49 | 49 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `AncientMagicLocations` | 20 | 20 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `AvatarFullBodyPresetsDynamic` | 11 | 11 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `BanditCampLocations` | 47 | 47 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `BeaconDataDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `BeaconDefinition` | 21 | 21 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `BeastDenLocations` | 56 | 56 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `BiomeType` | 9 | 9 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `BrewingSiteDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `BrewingUICategories` | 6 | 6 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `BroomActionSplineDynamic` | 0 | 0 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `BroomRaceDefinition` | 5 | 5 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `BroomRaceTimesDynamic` | 15 | 15 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `BuffActionType` | 26 | 26 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `BuffAttributeType` | 223 | 223 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `BuffDefinition` | 3 | 3 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `BuffFocusType` | 83 | 83 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `BuffSlotsDynamic` | 0 | 0 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `BuffsDynamic` | 0 | 0 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `CharacterDefinition` | 450 | 450 | BLUEPRINT_PASS.md, REPORT.md | Inventory only unless cited; schema census is not consumer proof |
| `CharacterEmoteVoices` | 2 | 2 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `CharacterItemTypes` | 9 | 9 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `CharacterLoadoutsDynamic` | 0 | 0 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `CharacterLookOverrideDynamic` | 0 | 0 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `CharacterOutfitTypes` | 8 | 8 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `CharacterVoices` | 48 | 48 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `CharactersDynamic` | 0 | 0 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `CollectionActions` | 743 | 743 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `CollectionCategories` | 11 | 11 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `CollectionDynamic` | 0 | 0 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `CollectionItems` | 640 | 640 | REPORT.md, PROGRESSION_DIGEST.md | A12; prior extras; schema census is not consumer proof |
| `CollectionStates` | 3 | 3 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `CollectionSubcategories` | 8 | 8 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `CombatVolumeGroupDynamic` | 0 | 0 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `CompanionBondingLevels` | 6 | 6 | REPORT.md, deep/DIALOGUE_DIGEST.md | Inventory only unless cited; schema census is not consumer proof |
| `CompanionStatsConditionDefinition` | 1 | 1 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `CompanionStatsTriggerTypes` | 3 | 3 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `CompanionStatsTriggersDynamic` | 0 | 0 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `ConjurationCategory` | 26 | 26 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `ConjurationContext` | 6 | 6 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `ConjurationContextDefinition` | 48 | 48 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `ContainerMaxSlots` | 8 | 8 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `ConversationDynamic` | 0 | 0 | deep/DIALOGUE_DIGEST.md | A01; DEEPER_SYSTEMS DS1; schema census is not consumer proof |
| `ConversationExclusiveDynamic` | 0 | 0 | deep/DIALOGUE_DIGEST.md | A01; DEEPER_SYSTEMS DS1; schema census is not consumer proof |
| `ConversationThreadDynamic` | 0 | 0 | deep/DIALOGUE_DIGEST.md | A01; DEEPER_SYSTEMS DS1; schema census is not consumer proof |
| `CreatureAttributeFacts` | 13 | 13 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `CreatureColorVariation` | 14 | 14 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `CreatureColorVariationBreeding` | 73 | 73 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `CreatureColorVariationDefinition` | 78 | 78 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `CreatureDefinition` | 47 | 47 | SMALL_TOUCHES.md | A12; prior care digest; schema census is not consumer proof |
| `CreatureDefinitionMap` | 4 | 4 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `CreatureFamilies` | 13 | 13 | BLUEPRINT_PASS.md, CARE_TO_CRAFT_DIGEST.md | A12; prior care digest; schema census is not consumer proof |
| `CreaturePersistenceDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `CreatureUIDMappingDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `CrimeEnforcementMatrix` | 36 | 36 | **NO PRIOR MENTION** | A12, schema only; schema census is not consumer proof |
| `CrimeMiscData` | 1 | 1 | **NO PRIOR MENTION** | A12, schema only; schema census is not consumer proof |
| `CrimeSceneDurations` | 15 | 15 | **NO PRIOR MENTION** | A12, schema only; schema census is not consumer proof |
| `CrimeSceneInvestigationDurations` | 5 | 5 | **NO PRIOR MENTION** | A12, schema only; schema census is not consumer proof |
| `CrimeSceneInvestigationRadius` | 5 | 5 | **NO PRIOR MENTION** | A12, schema only; schema census is not consumer proof |
| `CrimeSceneMaxInvestigators` | 10 | 10 | **NO PRIOR MENTION** | A12, schema only; schema census is not consumer proof |
| `CrimeSeverityMatrix` | 2 | 2 | **NO PRIOR MENTION** | A12, schema only; schema census is not consumer proof |
| `CurriculumDynamic` | 0 | 0 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `CurriculumEOYRewards` | 18 | 18 | REPORT.md | Inventory only unless cited; schema census is not consumer proof |
| `CurriculumProfessorDynamic` | 0 | 0 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `CurriculumRewards` | 0 | 0 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `CurriculumTurnInDefinitions` | 1 | 1 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `CurriculumTurnInDynamic` | 0 | 0 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `CurriculumTurnInTypes` | 4 | 4 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `CurriculumTypes` | 17 | 17 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `CurriculumYear` | 6 | 6 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_ActivityChoiceTypes` | not in DB | 13 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DEV_ActivityChoices` | not in DB | 43 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DEV_ActivityDesignMetaData` | not in DB | 16 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DEV_ActivityRewards` | not in DB | 57 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DEV_ActivityStationActions` | not in DB | 4 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `DEV_AltScheduleForChairDemo` | not in DB | 21 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DEV_AltScheduleForDeskDemo` | not in DB | 191 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DEV_AltScheduleForHallDemo` | not in DB | 8 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DEV_AltScheduleHoloDwain` | not in DB | 8 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DEV_AltScheduleHoloEvil` | not in DB | 9 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DEV_AltScheduleHoloLiam` | not in DB | 1 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DEV_AltScheduleHolo_AITest` | not in DB | 12 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DEV_AltScheduleNPC` | not in DB | 3 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DEV_AltScheduleStationTest` | not in DB | 3 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `DEV_AltScheduleWorldEvents` | not in DB | 5 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DEV_AmbientCreatureSpawnLocations` | not in DB | 390 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `DEV_BanditCampLocations` | not in DB | 1 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `DEV_BroomTestPaths` | not in DB | 1387 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_BroomTestPathsMetadata` | not in DB | 13 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_CharacterDesignMetaData` | not in DB | 39 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_CharacterDesignMetaDataTypes` | not in DB | 4 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_CharacterSpawnLocations` | not in DB | 685 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `DEV_ClusterLocations` | not in DB | 0 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `DEV_DataAnalysisMetaData` | not in DB | 61 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_DbValidationTests` | not in DB | 5 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_DungeonEntrances` | not in DB | 39 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `DEV_DungeonMinimaps` | not in DB | 52 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `DEV_ExplorerClubTorchLocations` | not in DB | 0 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `DEV_FastTravelLocations` | not in DB | 85 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `DEV_ItemSemanticRelationship` | not in DB | 105 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `DEV_KnowledgeCardSementicRelationship` | not in DB | 0 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `DEV_KnowledgeDistribution` | not in DB | 2076 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `DEV_KnowledgeInvestigatable` | not in DB | 0 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `DEV_LevelConfig` | not in DB | 24 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_LockProgression` | not in DB | 94 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `DEV_MiscDataOperationLogDynamic` | not in DB | 0 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_MiscLocations` | not in DB | 8572 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `DEV_MissionArchitects` | not in DB | 16 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `DEV_MissionBeaconIcons` | not in DB | 82 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `DEV_MissionDependencyTypes` | not in DB | 2 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `DEV_MissionExtraDependencies` | not in DB | 117 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `DEV_MissionOwners` | not in DB | 608 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `DEV_MissionScaffoldingCommands` | not in DB | 59 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `DEV_MissionSkipsAdditionalLocks` | not in DB | 2 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `DEV_MissionTeams` | not in DB | 11 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `DEV_MissionsAndLocations` | not in DB | 1184 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `DEV_MountZoneLocationVolumes` | not in DB | 16179 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `DEV_MountZoneLocations` | not in DB | 750 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `DEV_OverlandNavPathIntersections` | not in DB | 0 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_OverlandNavPaths` | not in DB | 0 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_OverlandNavPathsGroups` | not in DB | 0 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_PointsOfInterest` | not in DB | 417 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `DEV_RaceGates` | not in DB | 71 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_RaceSplines` | not in DB | 71 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_Races` | not in DB | 3 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_SGX_Characters` | not in DB | 4 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_SGX_Emotions` | not in DB | 20 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_SGX_EmotionsForMarkup` | not in DB | 20 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_SGX_Languages` | not in DB | 9 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_SGX_Line_Overrides` | not in DB | 4371 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_SanctuaryStationInfos` | not in DB | 31 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `DEV_ScheduleCoreMechanics` | not in DB | 26 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DEV_ScheduleForPathingDemo` | not in DB | 10 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DEV_ScheduleStudentCombat` | not in DB | 10 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DEV_Schedule_BanditCamp` | not in DB | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DEV_Schedule_HoloFatLady` | not in DB | 1 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DEV_Schedule_HoloMarkB` | not in DB | 16 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DEV_Schedule_HoloTwookes` | not in DB | 1 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DEV_Schedule_Holo_SancElf_UnitTest` | not in DB | 2 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DEV_SemanticCompareMeanScore` | not in DB | 11 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_SocialActionImpactActorDynamic` | not in DB | 0 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `DEV_SocialActionImpactSemanticsDynamic` | not in DB | 0 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `DEV_SocialActionTargetWeights` | not in DB | 76 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `DEV_SocialActorAttitudes` | not in DB | 4249 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `DEV_SocialCapitalThresholds` | not in DB | 447 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `DEV_SocialConnections` | not in DB | 114 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `DEV_SocialEvilResponseChoices` | not in DB | 223 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `DEV_SocialFabric` | not in DB | 4936 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `DEV_SocialFabricDynamic` | not in DB | 3 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `DEV_SocialGrapevineDynamic` | not in DB | 0 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `DEV_SocialIdentityFavorChoices` | not in DB | 24 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `DEV_SocialItemSemantics` | not in DB | 0 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `DEV_SocialSemanticsNetImpactDynamic` | not in DB | 37 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `DEV_SocialStatusKnowledgeProbability` | not in DB | 8 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `DEV_TableOwners` | not in DB | 551 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_TextEditorRegistryColumnFilters` | not in DB | 4 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `DEV_TransfigTest_GoboAttractiveSanctuary` | not in DB | 677 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `DEV_TransfigTest_ManyDodos` | not in DB | 395 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `DEV_TransfigTest_StateOfPlay` | not in DB | 360 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `DEV_TransfigTest_StateofPlay_RORDecorated_PerfectSpace_Welcome` | not in DB | 360 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `DEV_TransfigTest_StressTest` | not in DB | 1460 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `DEV_TransfigTest_gtstate` | not in DB | 719 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `DEV_UDSHints` | not in DB | 39 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `DEV_UI_FrontendLevelsList` | not in DB | 2 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `DEV_UI_HUDElementGroups` | not in DB | 48 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `DEV_UI_UsabilityMissionList` | not in DB | 13 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `DEV_UsedLocations` | not in DB | 1 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `DEV_UserEditPermissions` | not in DB | 997 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `DEV_WorldEventLocationDescriptors` | not in DB | 3273 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `DEV_WorldEventLocationMetaData` | not in DB | 1631 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `DEV_WorldEventLocations` | not in DB | 1631 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `Dev_Schedule_HoloRaph_Mission_01` | not in DB | 0 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `Dev_Schedule_Ned` | not in DB | 130 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `DoorStates` | 4 | 4 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `DoorsDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `DuelTechniqueCategory` | 6 | 6 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniqueDifficulty` | 3 | 3 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniqueFirstState` | 4 | 4 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniqueRequirementFunction` | 4 | 4 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniqueRules` | 10 | 10 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniqueSelectionMaxEncounterWeight` | 3 | 3 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniqueStatsDynamic` | 0 | 0 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniqueSubtype` | 15 | 15 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniques` | 73 | 73 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniquesEncounterDynamic` | 0 | 0 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniquesEnemyEncounterWeightOverrides` | 9 | 9 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniquesEnemyIDRequirement` | 126 | 126 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniquesEnemyProperties` | 6 | 6 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniquesEnemyPropertyRequirement` | 21 | 21 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniquesLocks` | 3 | 3 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniques_ComboColumns` | 7 | 7 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniques_CountGoalOverrides` | 26 | 26 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniques_CustomEventColumns` | 19 | 19 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniques_DamageColumns` | 11 | 11 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniques_DepulsoColumns` | 5 | 5 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniques_OppugnoColumns` | 2 | 2 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniques_ReactionColumns` | 11 | 11 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniques_SpellEffectColumns` | 4 | 4 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniques_TimedEncounterOverrides` | 18 | 18 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DuelTechniques_TimedJuggleColumns` | 2 | 2 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `DungeonChestLocations` | 0 | 0 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `DungeonDataDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `DungeonEntrances` | 47 | 47 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `EavesdropCharacters` | 45 | 45 | **NO PRIOR MENTION** | A01; DEEPER_SYSTEMS DS1; schema census is not consumer proof |
| `EavesdropConversations` | 215 | 215 | **NO PRIOR MENTION** | A01; DEEPER_SYSTEMS DS1; schema census is not consumer proof |
| `EavesdropLocations` | 10 | 10 | **NO PRIOR MENTION** | A01; DEEPER_SYSTEMS DS1; schema census is not consumer proof |
| `EconomicExpiryDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `EncounterExclusions` | 26 | 26 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `EncounterInclusions` | 397 | 397 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `EncounterInstance` | 1649 | 1649 | deep/EXTRAS_DIGEST.md | A12/A09; schema census is not consumer proof |
| `EncounterScoreModifier` | 6 | 6 | deep/EXTRAS_DIGEST.md | A12/A09; schema census is not consumer proof |
| `EncounterSpawnZones` | 1745 | 1745 | deep/EXTRAS_DIGEST.md | A12/A09; schema census is not consumer proof |
| `EnemyAccuracyParams` | 4 | 4 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyAggressivenessParams` | 23 | 23 | deep/AI_DIGEST.md | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyAgilityParams` | 18 | 18 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyAttackData` | 336 | 336 | deep/AI_DIGEST.md | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyAttackExecuteCooldownScale` | 2 | 2 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyAttackIDs` | 167 | 167 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyAttackModifier` | 1 | 1 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyAttackParams` | 49 | 49 | deep/AI_DIGEST.md | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyAttackScore` | 1 | 1 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyAttackScoreLevel` | 6 | 6 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyAttackSelectionData` | 51 | 51 | deep/AI_DIGEST.md | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyAttackSelectionWeights` | 46 | 46 | deep/AI_DIGEST.md | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyAttackTicket` | 49 | 49 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyAttackTicketLevel` | 3 | 3 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyAttackWeights` | 154 | 154 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyCombatPositioningParams` | 22 | 22 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyCombatThreatLevels` | 5 | 5 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyConfigurationOverrides` | 24 | 24 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyDamageLevels` | 18 | 18 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyDamageParams` | 7 | 7 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyDefenseParams` | 64 | 64 | deep/COMBAT_SHIELD_DIGEST.md | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyDefinition` | 158 | 158 | REPORT.md, deep/AI_DIGEST.md | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyDefinitionDuelTechniqueCachedProperties` | 77 | 77 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyDefinitionFallback` | 32 | 32 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyDefinitionGroup` | 0 | 0 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyDefinitionMap` | 46 | 46 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyDefinitionNamed` | 28 | 28 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyDefinitionRedirect` | 94 | 94 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyDenLocations` | 33 | 33 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyDifficultyScaling` | 4 | 4 | deep/XP_DIGEST.md, deep/AI_DIGEST.md | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyIdle` | 16 | 16 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyIdleParams` | 0 | 0 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyInteractionTypes` | 12 | 12 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyLevelParams` | 11 | 11 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyLevelTicketCooldownScale` | 1 | 1 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyParryCounter` | 2 | 2 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyParryCounterStyle` | 4 | 4 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyParryData` | 0 | 0 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyParryDodge` | 6 | 6 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyParryResponse` | 4 | 4 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyParryStep` | 3 | 3 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyPerceptionScoreType` | 3 | 3 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyPerceptionScores` | 3 | 3 | REPORT.md, deep/AI_DIGEST.md | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyPersistenceDynamic` | 0 | 0 | deep/EXTRAS_DIGEST.md | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyShieldBreaker` | 10 | 10 | REPORT.md, SPELL_AND_LESSON_DIGEST.md | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyShieldTypes` | 10 | 10 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemySize` | 8 | 8 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyStatus` | 7 | 7 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemySubtypeData` | 5 | 5 | deep/AI_DIGEST.md | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyTargetSelection` | 6 | 6 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyTicketCooldownScale` | 7 | 7 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyTicketLevelDiffScale` | 1 | 1 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnemyVulnerableDamageMods` | 84 | 84 | deep/COMBAT_SHIELD_DIGEST.md, deep/EXTRAS_DIGEST.md | A05/A08; prior deep AI; schema census is not consumer proof |
| `EnvironmentObstacleTypes` | 3 | 3 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `EquippedGearDynamic` | 2 | 2 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `EvilEffectivenessItems` | 1 | 1 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `ExpansionTentNPCs` | 0 | 0 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `ExpansionTents` | 3 | 3 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `ExperienceActions` | 115 | 115 | REPORT.md, PROGRESSION_DIGEST.md | A08; prior progression; schema census is not consumer proof |
| `ExperienceLevels` | 40 | 40 | TOOLING.md, REPORT.md | A08; prior progression; schema census is not consumer proof |
| `FastTravelLocations` | 176 | 176 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `FastTravelRegions` | 11 | 11 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `FastTravelSaveLocations` | 2 | 2 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `FertilizerDefinition` | 1 | 1 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `FilterPopulation` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `ForcedGearAppearanceDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `ForegeableCategoryDefinition` | 19 | 19 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `GameEventIntensity` | 4 | 4 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `GameFeaturesDynamic` | 0 | 0 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `GearAbilityDefinition` | 25 | 25 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `GearAbilityWeights` | 10 | 10 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `GearAppearanceItems` | 465 | 465 | REPORT.md, deep/EXTRAS_DIGEST.md | A12; prior extras; schema census is not consumer proof |
| `GearGeneration` | 5 | 5 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `GearItems` | 1124 | 1124 | REPORT.md, PROGRESSION_DIGEST.md | A12; prior extras; schema census is not consumer proof |
| `GearItemsDynamic` | 8 | 8 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `GearPowerLevels` | 40 | 40 | REPORT.md, PROGRESSION_DIGEST.md | A12; prior extras; schema census is not consumer proof |
| `GearPowerStats` | 500 | 500 | PROGRESSION_DIGEST.md, deep/XP_DIGEST.md | A12; prior extras; schema census is not consumer proof |
| `GearSlotTypeMapping` | 21 | 21 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `GearSlotTypes` | 6 | 6 | PROGRESSION_DIGEST.md | A12; prior extras; schema census is not consumer proof |
| `GearStatIncrease` | 9 | 9 | PROGRESSION_DIGEST.md | A12; prior extras; schema census is not consumer proof |
| `GearStatUpgrade` | 38 | 38 | CARE_TO_CRAFT_DIGEST.md, PROGRESSION_DIGEST.md | A12; prior extras; schema census is not consumer proof |
| `GearTraitRecipeDefinition` | 75 | 75 | CARE_TO_CRAFT_DIGEST.md, deep/EXTRAS_DIGEST.md | A12; prior extras; schema census is not consumer proof |
| `Genders` | 3 | 3 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `GoldChestInfo` | 1 | 1 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `GroupDefinition` | 56 | 56 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `GroupMembers` | 364 | 364 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `GroupTypes` | 2 | 2 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `HamletLocations` | 11 | 11 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `HoboGeneralTraffic` | 94 | 94 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `HogsmeadeMapLocations` | 17 | 17 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `HogwartsExpressSchedule` | 2 | 2 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `HogwartsMapIconTable` | 37 | 37 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `Houses` | 5 | 5 | REPORT.md, SIMILAR_GAMES.md | Inventory only unless cited; schema census is not consumer proof |
| `IdentityTypes` | 11 | 11 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `InfirmaryDynamic` | 0 | 0 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `InventoryCapacity` | 61 | 61 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `InventoryDynamic` | 22 | 22 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `InventoryHolderDefinition` | 16 | 16 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `InventoryHolderSlotExpansions` | 4 | 4 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `InventoryQuality` | 4 | 4 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `InventorySlotDefinition` | 5 | 5 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `InvestigatableDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12, schema only; schema census is not consumer proof |
| `ItemDefinition` | 1852 | 1852 | REPORT.md, deep/EXTRAS_DIGEST.md | A12; prior extras; schema census is not consumer proof |
| `ItemKnowledgeCardMap` | 0 | 0 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `ItemTypes` | 50 | 50 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `ItemUsageTypes` | 12 | 12 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `ItemUseRestrictionDefinition` | 3 | 3 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `ItemUseRestrictionTypes` | 2 | 2 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `ItemUsesAndSources` | 15 | 15 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `ItemsDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `KnowledgeActions` | 42 | 42 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `KnowledgeApplicability` | 2 | 2 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `KnowledgeCardPerks` | 0 | 0 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `KnowledgeCategories` | 22 | 22 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `KnowledgeDynamic` | 16 | 16 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `KnowledgeFactTypes` | 103 | 103 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `KnowledgeFacts` | 987 | 987 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `KnowledgeHogwartsFacts` | 0 | 0 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `KnowledgeInvestigatable` | 236 | 236 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `KnowledgeLevels` | 10 | 10 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `KnowledgeLocationFacts` | 5 | 5 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `KnowledgeLocations` | 140 | 140 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `KnowledgeMiscFacts` | 1 | 1 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `KnowledgeSubjectTables` | 11 | 11 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `KnowledgeSubjects` | 386 | 386 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `KnowledgeTutorialFacts` | 13 | 13 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `KnowledgeVendorFacts` | 33 | 33 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `LocationNamedVolumes` | 112 | 112 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `Locations` | 4718 | 4718 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `LockDefinition` | 4757 | 4757 | REPORT.md | A12/A09; schema census is not consumer proof |
| `LockMessages` | 19 | 19 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `LockProgression` | 77 | 77 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `LockStates` | 2 | 2 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `LockTypes` | 2 | 2 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `LockableComponentsDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `LocksDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `LootCategories` | 352 | 352 | deep/EXTRAS_DIGEST.md | A12; prior extras; schema census is not consumer proof |
| `LootCategoryTypes` | 13 | 13 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `LootContainerContents` | 835 | 835 | deep/EXTRAS_DIGEST.md | A12; prior extras; schema census is not consumer proof |
| `LootDropComponentDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `LootGenerationType` | 2 | 2 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `LootItemsDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `LootRollTypes` | 2 | 2 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `LootTrackingDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `MailDynamic` | 0 | 0 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `MapGreaterRegions` | 5 | 5 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `MapHogwartsLocations` | 42 | 42 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `MapHogwartsRegions` | 8 | 8 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `MapLocationDataDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `MapLocationHints` | 4 | 4 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `MapMarkup` | 183 | 183 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `MiscDataDynamic` | 62 | 62 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `MiscLocations` | 1682 | 1682 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `MissionContainerDynamic` | 0 | 0 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `MissionDefinition` | 725 | 725 | SPELL_AND_LESSON_DIGEST.md, deep/EXTRAS_DIGEST.md | A02; schema census is not consumer proof |
| `MissionDynamic` | 0 | 0 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `MissionKnowledgeSubjects` | 3 | 3 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `MissionLighthouseGoals` | 13 | 13 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `MissionLighthouseSubgoals` | 44 | 44 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `MissionLines` | 7 | 7 | REPORT.md | A02; schema census is not consumer proof |
| `MissionNamedGroups` | 190 | 190 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `MissionPlatforms` | 3 | 3 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `MissionRewardTypes` | 4 | 4 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `MissionRewardUICategories` | 6 | 6 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `MissionRewards` | 111 | 111 | REPORT.md, SPELL_AND_LESSON_DIGEST.md | A02; schema census is not consumer proof |
| `MissionStatuses` | 7 | 7 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `MissionSteps` | 15886 | 15886 | REPORT.md, SMALL_TOUCHES.md | A02; schema census is not consumer proof |
| `MissionTaskKeywordType` | 177 | 177 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `MissionTaskTypes` | 155 | 155 | deep/AI_DIGEST.md, deep/EXTRAS_DIGEST.md | A02; schema census is not consumer proof |
| `NPCLevelScaling` | 127 | 127 | deep/COMBAT_SHIELD_DIGEST.md | A05/A08; prior deep AI; schema census is not consumer proof |
| `NPCMultiplierCurveData` | 100 | 100 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `NPCMultiplierData` | 3 | 3 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `NPCSpellLoadouts` | 44 | 44 | **NO PRIOR MENTION** | A05/A08; prior deep AI; schema census is not consumer proof |
| `NamedCreatureDefinition` | 44 | 44 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `Noise` | 6 | 6 | deep/AI_DIGEST.md | A05/A08; prior deep AI; schema census is not consumer proof |
| `NurturingCreatureDynamic` | 0 | 0 | CARE_TO_CRAFT_DIGEST.md, REPORT.md | A12; prior care digest; schema census is not consumer proof |
| `NurturingSpaceDefinition` | 7 | 7 | CARE_TO_CRAFT_DIGEST.md, SMALL_TOUCHES.md | A12; prior care digest; schema census is not consumer proof |
| `ObjectAndOwner` | 406 | 406 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `ObjectLocations` | 3 | 3 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `OutfitItemTypes` | 30 | 30 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `OutfitTypes` | 6 | 6 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `PerkCategories` | 2 | 2 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `PerkDefinition` | 56 | 56 | REA_TRIAL.md, REPORT.md | A08; prior progression; schema census is not consumer proof |
| `PerkDynamic` | 0 | 0 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `PerkStates` | 3 | 3 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `PerkTypes` | 10 | 10 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `PlantDefinition` | 8 | 8 | CARE_TO_CRAFT_DIGEST.md, SMALL_TOUCHES.md | A12; prior care digest; schema census is not consumer proof |
| `PlantPersistenceDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `PlantSizes` | 3 | 3 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `PlantSources` | 4 | 4 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `PlantUses` | 2 | 2 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `PlayerHealthLevelMap` | 40 | 40 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `PlayerStatsDynamic` | 0 | 0 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `PlotDefinition` | 9 | 9 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `PlotDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `PointsOfInterest` | 1 | 1 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `PointsOfInterestDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `PostDeathCleanUpEffects` | 3 | 3 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `PostDeathCleanUpModes` | 2 | 2 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `PostDeathParams` | 3 | 3 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `PostDeathSortingModes` | 3 | 3 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `PotionDefinition` | 7 | 7 | CARE_TO_CRAFT_DIGEST.md, SMALL_TOUCHES.md | A12; prior care digest; schema census is not consumer proof |
| `PotionTypes` | 16 | 16 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `PotionUnitTypes` | 6 | 6 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `ProductIDs` | 20 | 20 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `RPGAbilityDurationDefinition` | 14 | 14 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `RPGAbilityDynamic` | 0 | 0 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `RPGItemAbilityDynamic` | 0 | 0 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `RPGPermaAbilityDynamic` | 2 | 2 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `RPGSystemCooldownDefinition` | 1 | 1 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `RPGSystemCooldowns` | 1 | 1 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `RarityTierType` | 6 | 6 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `Registry` | 4920 | 4920 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `RegistryTypes` | 26 | 26 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `RichPaperDefinition` | 334 | 334 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `RichPaperDynamic` | 0 | 0 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `RichPaperTypes` | 20 | 20 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `RuinLocations` | 40 | 40 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `SancFeedingStationDynamic` | 0 | 0 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `SanctuaryAreas` | 5 | 5 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `SanctuaryBiomeDefinition` | 5 | 5 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `SanctuaryBiomeDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `SanctuaryExpansionDefinition` | 7 | 7 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `SanctuaryHousekeepingDefinition` | 4 | 4 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `SanctuaryHousekeepingDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `SanctuaryHousekeepingZones` | 8 | 8 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `SanctuaryInitialCustomizationChoices` | 5 | 5 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `SanctuaryItemGeneratorData` | 4 | 4 | CARE_TO_CRAFT_DIGEST.md | A12; prior care digest; schema census is not consumer proof |
| `SanctuaryItemGeneratorDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `SanctuaryNamedChestDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `SceneRigCompletedDynamic` | 0 | 0 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `ScheduleDynamic` | 0 | 0 | deep/EXTRAS_DIGEST.md | A09; schema census is not consumer proof |
| `ScheduleEntryTypes` | 2 | 2 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Azkaban` | 4 | 4 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Cairn_Dungeon_2` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Cairn_Dungeon_20` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Cairn_Dungeon_21` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Cairn_Dungeon_3` | 8 | 8 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Cairn_Dungeon_8` | 4 | 4 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Castle_Dungeon_1` | 2 | 2 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Castle_Dungeon_10` | 7 | 7 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Castle_Dungeon_11` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Castle_Dungeon_15` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Castle_Dungeon_19` | 6 | 6 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Castle_Dungeon_22` | 3 | 3 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Cav_Dungeon_01` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Cav_Dungeon_02` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Cav_Dungeon_05` | 1 | 1 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Cav_Dungeon_08` | 4 | 4 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Cav_Dungeon_12` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Cavern_Dungeon_10` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Cavern_Dungeon_19` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Cavern_Dungeon_24` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Cavern_Dungeon_26` | 2 | 2 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Cavern_Dungeon_33` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Cavern_Dungeon_34` | 2 | 2 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_DeathHallows_Dungeon` | 2 | 2 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Default` | 20 | 20 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Empty` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_GeneratedDefaults` | 206 | 206 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_GeneratedLocationIds` | 38 | 38 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_GeneratedLocations` | 1514 | 1514 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_GobMine_Dungeon_07` | 2 | 2 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_GobMine_Dungeon_13` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Gobmine_Dungeon_01` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Gobmine_Dungeon_06` | 2 | 2 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Gobmine_Dungeon_11` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Gobmine_Dungeon_12` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_HM_ExtortionistHideout` | 6 | 6 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_HOG_Dungeon_01` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_HauntedShop_Dungeon_02` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_HauntedShop_Dungeon_03` | 2 | 2 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Hogsmeade_Dungeon_02` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Hogwarts_Dungeon_02` | 2 | 2 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Hogwarts_Dungeon_Evil` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Intro` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Marketing` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Overland` | 618 | 618 | REPORT.md, deep/AI_DIGEST.md | A09; schema census is not consumer proof |
| `Schedule_Pensieve_Tomb_2` | 2 | 2 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_PoacherHideout` | 0 | 0 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_RootLevel` | 12 | 12 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_SancStudy` | 2 | 2 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_Sanctum_Dungeon_Cavern2` | 2 | 2 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_SpawnOnly` | 131 | 131 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_ThievesHideout` | 2 | 2 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Schedule_ZZS_TrollFight` | 1 | 1 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `SchedulesForLevels` | 461 | 461 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `Seasons` | 6 | 6 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `SeatFillerSchedule` | 369 | 369 | **NO PRIOR MENTION** | A09; schema census is not consumer proof |
| `SecretFactsDefinition` | 380 | 380 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `SkeletonTypes` | 9 | 9 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `SocialActionDefinition` | 178 | 178 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `SocialActionDynamic` | 0 | 0 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `SocialActionObserverTypes` | 3 | 3 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `SocialActionSemantics` | 400 | 400 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `SocialActionType` | 9 | 9 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `SocialCapitalStatuses` | 8 | 8 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `SocialConnectionStatuses` | 7 | 7 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `SocialEconomicStatuses` | 3 | 3 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `SocialHeritageStatuses` | 4 | 4 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `SocialInteractionData` | 5 | 5 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `SocialInteractionDisplayStatuses` | 10 | 10 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `SocialInteractionTypes` | 14 | 14 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `SocialSemanticTypes` | 7 | 7 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `SocialSemantics` | 67 | 67 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `SocialStationActionChoices` | 301 | 301 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `SpawnGroupDefinition` | 825 | 825 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `SpawnGroupEconomy` | 0 | 0 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `SpawnLocationTypes` | 19 | 19 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `SpawnRestrictionCategories` | 12 | 12 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `SpawnRestrictionTypes` | 51 | 51 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `SpawnRestrictions` | 216 | 216 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `SpellCategories` | 6 | 6 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `SpellDefinition` | 162 | 162 | TOOLING.md, REPORT.md | A08; prior progression; schema census is not consumer proof |
| `SpellImpactTypes` | 21 | 21 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `SpellKnowledge` | 164 | 164 | REPORT.md, SPELL_AND_LESSON_DIGEST.md | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `SpellMappingForLoadouts` | 28 | 28 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `SpellObjectPropertyTypes` | 5 | 5 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `SpellSizes` | 7 | 7 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `SpellUpgradeAttributes` | 13 | 13 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `SpellUpgrades` | 164 | 164 | SPELL_AND_LESSON_DIGEST.md | A08; prior progression; schema census is not consumer proof |
| `SpellsDynamic` | 4 | 4 | **NO PRIOR MENTION** | A08; prior progression; schema census is not consumer proof |
| `SphinxPuzzleDefinition` | 16 | 16 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `SphinxPuzzleDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `SphinxPuzzleInstance` | 304 | 304 | REPORT.md | A12/A09; schema census is not consumer proof |
| `SphinxPuzzleLocations` | 95 | 95 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `StationCollisionType` | 8 | 8 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `StationPropClasses` | 14 | 14 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `StationPropTypes` | 69 | 69 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `StationSiteVicinityScale` | 0 | 0 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `StatsDynamic` | 1363 | 1363 | deep/EXTRAS_DIGEST.md | Inventory only unless cited; schema census is not consumer proof |
| `StoryGraphPersistenceDynamic` | 0 | 0 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `SubjectDefinition` | 28 | 28 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `SubjectOfTheDayKnowledgeCards` | 131 | 131 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `SubjectTypes` | 5 | 5 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `SublevelWorld` | 6 | 6 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `SubtypeInteraction` | 229 | 229 | **NO PRIOR MENTION** | DEEPER_SYSTEMS DS3; schema census is not consumer proof |
| `Subtypes` | 204 | 204 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `TabooItemList` | 6 | 6 | **NO PRIOR MENTION** | A12, schema only; schema census is not consumer proof |
| `TentLocations` | 2 | 2 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `TerrainAnchorGroups` | 5 | 5 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `TerrainAnchorSpawnGroups` | 2 | 2 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `TerrainAnchors` | 3 | 3 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `TileForegeableSpawning` | 602 | 602 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `TransfigurationClasses` | 33 | 33 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `TransfigurationColors` | 8 | 8 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `TransfigurationDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `TransfigurationExpansionDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `TransfigurationGroups` | 3 | 3 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `TransfigurationNamedObjectsDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `TransfigurationObjectGroups` | 3 | 3 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `TransfigurationObjectLocks` | 843 | 843 | SPELL_AND_LESSON_DIGEST.md | A12; prior care digest; schema census is not consumer proof |
| `TransfigurationObjectStatsCategories` | 9 | 9 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `TransfigurationObjects` | 310 | 310 | CARE_TO_CRAFT_DIGEST.md, SMALL_TOUCHES.md | A12; prior care digest; schema census is not consumer proof |
| `TransfigurationSlotPoolExpansions` | 2 | 2 | CARE_TO_CRAFT_DIGEST.md | A12; prior care digest; schema census is not consumer proof |
| `TransfigurationSlotPools` | 9 | 9 | CARE_TO_CRAFT_DIGEST.md, SMALL_TOUCHES.md | A12; prior care digest; schema census is not consumer proof |
| `TransfigurationSnapping` | 5 | 5 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `TransfigurationSocketCategories` | 4 | 4 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `TransfigurationStatsCategories` | 38 | 38 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `TransformationGroups` | 8 | 8 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `TransformationOverlandResults` | 44 | 44 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `TransformationOverlandTargets` | 42 | 42 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `TransformationStreamingPriority` | 3 | 3 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `TransformationStyles` | 5 | 5 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `TriggeredEffectTypes` | 3 | 3 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `TriggeredEffects` | 11 | 11 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |
| `TutorialQueuePersistenceDynamic` | 0 | 0 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `UDSAlternativeMissionNames` | 12 | 12 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `UDSAlternativeTaskNames` | 668 | 668 | **NO PRIOR MENTION** | A02; schema census is not consumer proof |
| `UIActionGroupDynamic` | 67 | 67 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `UIActionItem` | 6 | 6 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `UIActionModes` | 2 | 2 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `UIInputActions` | 24 | 24 | deep/EXTRAS_DIGEST.md | A06/A10/A11/A12; schema census is not consumer proof |
| `UIKeyBindingsDynamic` | 42 | 42 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `UIKnowledgeCategories` | 34 | 34 | **NO PRIOR MENTION** | A10; DEEPER_SYSTEMS DS2; schema census is not consumer proof |
| `UILoadingScreenBackgrounds` | 26 | 26 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `UILoadingScreenTips` | 43 | 43 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `UIQuickActionsDynamic` | 220 | 220 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `UITwitchActions` | 4 | 4 | **NO PRIOR MENTION** | A06/A10/A11/A12; schema census is not consumer proof |
| `UIWorldActions` | 47 | 47 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `UnresolvedDoorStatesDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `VanishmentStyles` | 2 | 2 | **NO PRIOR MENTION** | A12; prior care digest; schema census is not consumer proof |
| `VaultLocations` | 113 | 113 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `VendorConversationsDynamic` | 0 | 0 | **NO PRIOR MENTION** | A01; DEEPER_SYSTEMS DS1; schema census is not consumer proof |
| `VendorStocks` | 26 | 26 | deep/EXTRAS_DIGEST.md | A12; prior extras; schema census is not consumer proof |
| `VendorStocksDynamic` | 0 | 0 | deep/EXTRAS_DIGEST.md | A12; prior extras; schema census is not consumer proof |
| `VendorUnavailableStock` | 0 | 0 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `VirtualContainerContents` | 4625 | 4625 | deep/EXTRAS_DIGEST.md | A12; prior extras; schema census is not consumer proof |
| `VirtualContainerList` | 573 | 573 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `VirtualContainerTypes` | 13 | 13 | **NO PRIOR MENTION** | A12; prior extras; schema census is not consumer proof |
| `WorldAdjustments` | 10 | 10 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `WorldEventsDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `WorldEventsPersistenceDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `WorldObjectDefinition` | 156 | 156 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `WorldObjectDynamic` | 0 | 0 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `WorldRegionAdjustments` | 14 | 14 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `WorldRegions` | 14 | 14 | **NO PRIOR MENTION** | A12/A09; schema census is not consumer proof |
| `sqlite_sequence` | 2 | 2 | **NO PRIOR MENTION** | Inventory only unless cited; schema census is not consumer proof |

# System inventory

Inventory boundary: every named System class found in the six prior decompiled assemblies, registered runtime systems, each namespace module, and all 112 shipped content tables. This is a source inventory, not a claim that all methods or third-party dependency internals were read. Three UI types were newly read; full UI type census is inherited from the prior UI-types list. Source paths are relative to the prior extract root in TOOLING.

## Runtime registration and persistence

Registered through Repository.InitializeRootObject: 48. RootObject.GetAllSystems serialized order: 47. The difference is AllowanceSystem. Its role must be distinguished from a missing-save bug; this pass does not infer one from array membership alone.

| System | Source | Source lines | Registered | Root save position | Documentation state |
|---|---|---:|---|---:|---|
| AISystem | GameLogic.dll/Academagia.AI/AISystem.cs | 805 | True | 47 | This aspect pass, bounded coverage |
| AbilitySystem | GameLogic.dll/Academagia.GameSystems/AbilitySystem.cs | 227 | True | 3 | UNDOCUMENTED implementation; inventoried only |
| ActionScheduler | GameLogic.dll/Academagia.Scheduler/ActionScheduler.cs | 463 | True | 1 | Prior lane, bounded coverage |
| ActionSystem | GameLogic.dll/Academagia.GameSystems/ActionSystem.cs | 876 | True | 2 | UNDOCUMENTED implementation; inventoried only |
| AllowanceSystem | GameLogic.dll/Academagia.Allowance/AllowanceSystem.cs | 48 | True |  | Prior lane, bounded coverage |
| ArtificingSystem | GameLogic.dll/Academagia.GameSystems/ArtificingSystem.cs | 829 | True | 4 | UNDOCUMENTED implementation; inventoried only |
| AstrologySystem | GameLogic.dll/Academagia.GameSystems/AstrologySystem.cs | 328 | True | 5 | UNDOCUMENTED implementation; inventoried only |
| BaseSystem | GameLogic.dll/Academagia.GameSystems/BaseSystem.cs | 34 | False |  | UNDOCUMENTED implementation; inventoried only |
| BlackmailSystem | GameLogic.dll/Academagia.GameSystems/BlackmailSystem.cs | 65 | False |  | UNDOCUMENTED implementation; inventoried only |
| BonusSystem | GameLogic.dll/Academagia.GameSystems/BonusSystem.cs | 180 | False |  | UNDOCUMENTED implementation; inventoried only |
| CharacterCreationSystem | GameLogic.dll/Academagia.GameSystems/CharacterCreationSystem.cs | 420 | True | 6 | UNDOCUMENTED implementation; inventoried only |
| CharacterSystem | GameLogic.dll/Academagia.GameSystems/CharacterSystem.cs | 480 | True | 7 | UNDOCUMENTED implementation; inventoried only |
| ChargeSystem | GameLogic.dll/Academagia.GameSystems/ChargeSystem.cs | 341 | True | 8 | UNDOCUMENTED implementation; inventoried only |
| ClazzSystem | GameLogic.dll/Academagia.GameSystems/ClazzSystem.cs | 267 | True | 9 | Prior lane, bounded coverage |
| CliqueSystem | GameLogic.dll/Academagia.GameSystems/CliqueSystem.cs | 585 | True | 10 | Prior lane, bounded coverage |
| CombatConditionSystem | GameLogic.dll/Academagia.GameSystems/CombatConditionSystem.cs | 113 | False |  | UNDOCUMENTED implementation; inventoried only |
| CombatSystem | GameLogic.dll/Academagia.GameSystems/CombatSystem.cs | 441 | True | 11 | UNDOCUMENTED implementation; inventoried only |
| CompeteSystem | GameLogic.dll/Academagia.GameSystems/CompeteSystem.cs | 370 | True | 12 | UNDOCUMENTED implementation; inventoried only |
| ContextStoreSystem | GameLogic.dll/Academagia.GameSystems/ContextStoreSystem.cs | 113 | False |  | UNDOCUMENTED implementation; inventoried only |
| ControlSystem | GameLogic.dll/Academagia.GameSystems/ControlSystem.cs | 162 | False |  | UNDOCUMENTED implementation; inventoried only |
| DateAndTimeSystem | GameLogic.dll/Academagia.GameSystems/DateAndTimeSystem.cs | 93 | True | 13 | Prior lane, bounded coverage |
| DeusExMachinaSystem | GameLogic.dll/Academagia.GameSystems/DeusExMachinaSystem.cs | 129 | True | 14 | UNDOCUMENTED implementation; inventoried only |
| DuelSystem | GameLogic.dll/Academagia.GameSystems/DuelSystem.cs | 443 | True | 15 | UNDOCUMENTED implementation; inventoried only |
| EffectSystem | GameLogic.dll/Academagia.GameSystems/EffectSystem.cs | 130 | True | 16 | UNDOCUMENTED implementation; inventoried only |
| EmotionSystem | GameLogic.dll/Academagia.GameSystems/EmotionSystem.cs | 148 | True | 18 | UNDOCUMENTED implementation; inventoried only |
| EnchantSystem | GameLogic.dll/Academagia.GameSystems/EnchantSystem.cs | 867 | True | 17 | UNDOCUMENTED implementation; inventoried only |
| ExamSystem | GameLogic.dll/Academagia.GameSystems/ExamSystem.cs | 415 | True | 19 | Prior lane, bounded coverage |
| ExistenceConditionDictionarySystem | GameLogic.dll/Academagia.GameSystems/ExistenceConditionDictionarySystem.cs | 116 | False |  | UNDOCUMENTED implementation; inventoried only |
| FamiliarSystem | GameLogic.dll/Academagia.GameSystems/FamiliarSystem.cs | 182 | True | 20 | UNDOCUMENTED implementation; inventoried only |
| FavorSystem | GameLogic.dll/Academagia.GameSystems/FavorSystem.cs | 239 | True | 21 | Prior lane, bounded coverage |
| FeedbackSystem | GameLogic.dll/Academagia.GameSystems/FeedbackSystem.cs | 161 | True | 22 | UNDOCUMENTED implementation; inventoried only |
| FirstLevelSystem | GameLogic.dll/Academagia.GameSystems/FirstLevelSystem.cs | 99 | False |  | UNDOCUMENTED implementation; inventoried only |
| GameController | GameLogic.dll/Academagia.GameSystems/GameController.cs | 474 | False |  | This aspect pass, bounded coverage |
| GiftSystem | GameLogic.dll/Academagia.GameSystems/GiftSystem.cs | 170 | True | 23 | UNDOCUMENTED implementation; inventoried only |
| GraduationSystem | GameLogic.dll/Academagia.GameSystems/GraduationSystem.cs | 42 | True | 24 | UNDOCUMENTED implementation; inventoried only |
| IllegalSystem | GameLogic.dll/Academagia.Inventory/IllegalSystem.cs | 53 | False |  | Prior lane, bounded coverage |
| InUseExistenceConditionDictionarySystem | GameLogic.dll/Academagia.GameSystems/InUseExistenceConditionDictionarySystem.cs | 27 | False |  | UNDOCUMENTED implementation; inventoried only |
| InformationSystem | GameLogic.dll/Academagia.GameSystems/InformationSystem.cs | 381 | True | 25 | This aspect pass, bounded coverage |
| InventorySystem | GameLogic.dll/Academagia.GameSystems/InventorySystem.cs | 196 | True | 26 | Prior lane, bounded coverage |
| LockSystem | GameLogic.dll/Academagia.GameSystems/LockSystem.cs | 104 | True | 27 | UNDOCUMENTED implementation; inventoried only |
| MediaSystem | GameLogic.dll/Academagia.GameSystems/MediaSystem.cs | 307 | False |  | This aspect pass, bounded coverage |
| MonsterSystem | GameLogic.dll/Academagia.GameSystems/MonsterSystem.cs | 129 | True | 28 | UNDOCUMENTED implementation; inventoried only |
| PrerequisiteSystem | GameLogic.dll/Academagia.GameSystems/PrerequisiteSystem.cs | 99 | True | 29 | UNDOCUMENTED implementation; inventoried only |
| PreventSystem | GameLogic.dll/Academagia.GameSystems/PreventSystem.cs | 151 | True | 30 | UNDOCUMENTED implementation; inventoried only |
| PurchaseSystem | GameLogic.dll/Academagia.GameSystems/PurchaseSystem.cs | 236 | True | 31 | UNDOCUMENTED implementation; inventoried only |
| RelationshipSystem | GameLogic.dll/Academagia.GameSystems/RelationshipSystem.cs | 589 | True | 39 | Prior lane, bounded coverage |
| ReprimandSystem | GameLogic.dll/Academagia.GameSystems/ReprimandSystem.cs | 523 | True | 40 | Prior lane, bounded coverage |
| ResearchSystem | GameLogic.dll/Academagia.GameSystems/ResearchSystem.cs | 118 | True | 41 | This aspect pass, bounded coverage |
| ResolvingSystem | GameLogic.dll/Academagia.GameSystems/ResolvingSystem.cs | 360 | True | 46 | UNDOCUMENTED implementation; inventoried only |
| RimbalSystem | GameLogic.dll/Academagia.GameSystems/RimbalSystem.cs | 526 | True | 38 | UNDOCUMENTED implementation; inventoried only |
| RollSystem | GameLogic.dll/Academagia.GameSystems/RollSystem.cs | 1168 | True | 42 | Prior lane, bounded coverage |
| SkillSystem | GameLogic.dll/Academagia.GameSystems/SkillSystem.cs | 1238 | True | 37 | Prior lane, bounded coverage |
| SpellSystem | GameLogic.dll/Academagia.GameSystems/SpellSystem.cs | 401 | True | 32 | This aspect pass, bounded coverage |
| StatisticSystem | GameLogic.dll/Academagia.GameSystems/StatisticSystem.cs | 121 | True | 33 | UNDOCUMENTED implementation; inventoried only |
| StorySystem | GameLogic.dll/Academagia.GameSystems/StorySystem.cs | 1284 | True | 35 | Prior lane, bounded coverage |
| StressSystem | GameLogic.dll/Academagia.GameSystems/StressSystem.cs | 432 | True | 34 | Prior lane, bounded coverage |
| StudySystem | GameLogic.dll/Academagia.GameSystems/StudySystem.cs | 259 | False |  | Prior lane, bounded coverage |
| SystemObjects | GameLogic.dll/Academagia.GameSystems/SystemObjects.cs | 138 | True | 36 | Prior lane, bounded coverage |
| VendettaSystem | GameLogic.dll/Academagia.GameSystems/VendettaSystem.cs | 220 | True | 43 | UNDOCUMENTED implementation; inventoried only |
| VisitSystem | GameLogic.dll/Academagia.GameSystems/VisitSystem.cs | 300 | True | 44 | Prior lane, bounded coverage |
| WeatherSystem | GameLogic.dll/Academagia.GameSystems/WeatherSystem.cs | 124 | True | 45 | UNDOCUMENTED implementation; inventoried only |

## Namespace modules

Type declarations count classes, interfaces, enums and structs, including nested declarations. It is a size signal, not a count of independent gameplay systems. Namespace modules named Effects, Resolving, CombatAndDuel, Rimbal, Feedback, Inventory and Reprimand contain substantial subflows even when their root System is documented.

| Assembly | Namespace / module | C# files | Type declarations | Coverage |
|---|---|---:|---:|---|
| GameLogic.dll | Academagia | 3 | 3 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.AI | 28 | 31 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Ability | 1 | 1 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Allowance | 1 | 1 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Astrology | 2 | 2 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.CombatAndDuel | 27 | 29 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Common | 1 | 1 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.DateAndTime | 9 | 9 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Effects | 43 | 43 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Effects.Param | 1 | 1 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Favor | 1 | 1 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Feedback | 94 | 95 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Game | 1 | 1 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.GameSystems | 85 | 102 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Inventory | 2 | 2 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Objects | 2 | 2 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Prevent | 1 | 1 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Reprimand | 4 | 4 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Resolving | 25 | 28 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Resolving.Constraints | 26 | 26 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Resolving.Rules | 4 | 4 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Resolving.Selectors | 7 | 6 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Resolving.Strategy | 9 | 11 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Rimbal | 18 | 23 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Roll | 6 | 6 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Scheduler | 7 | 7 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Statistic | 26 | 27 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Storage | 21 | 29 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Story | 3 | 3 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Vendetta | 1 | 1 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Academagia.Wrappers | 57 | 61 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | ContentModel | 7 | 9 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | Properties | 1 | 0 | Partial: source inventory; selected methods in dossiers |
| GameLogic.dll | RepositoryCache | 7 | 7 | Partial: source inventory; selected methods in dossiers |
| ContentModel.dll | ContentModel | 179 | 188 | Content schema decoded; semantics vary |
| ContentModel.dll | ContentModel.Common | 1 | 1 | Content schema decoded; semantics vary |
| ContentModel.dll | Properties | 1 | 0 | Content schema decoded; semantics vary |
| Storage.dll | Properties | 1 | 0 | Partial: serializers/selection trees |
| Storage.dll | Storage | 101 | 105 | Partial: serializers/selection trees |
| Storage.dll | Storage.DB | 1 | 1 | Partial: serializers/selection trees |
| Storage.dll | Storage.Publish | 7 | 9 | Partial: serializers/selection trees |
| Common.dll | Academagia.Common | 1 | 1 | Partial: interfaces/command bus/app entry; other helpers unread |
| Common.dll | Academagia.Common.Commands | 11 | 12 | Partial: interfaces/command bus/app entry; other helpers unread |
| Common.dll | Academagia.Common.View | 4 | 4 | Partial: interfaces/command bus/app entry; other helpers unread |
| Common.dll | Common | 22 | 20 | Partial: interfaces/command bus/app entry; other helpers unread |
| Common.dll | Common.Collections | 3 | 3 | Partial: interfaces/command bus/app entry; other helpers unread |
| Common.dll | Common.Logger | 4 | 4 | Partial: interfaces/command bus/app entry; other helpers unread |
| Common.dll | Properties | 1 | 0 | Partial: interfaces/command bus/app entry; other helpers unread |
| Common.dll | Steamworks | 350 | 356 | Partial: interfaces/command bus/app entry; other helpers unread |
| Academagia.Core.dll | Academagia.Core | 5 | 5 | Partial: interfaces/command bus/app entry; other helpers unread |
| Academagia.Core.dll | Academagia.Core.Adapters | 5 | 5 | Partial: interfaces/command bus/app entry; other helpers unread |
| Academagia.Core.dll | Academagia.Core.Data | 9 | 9 | Partial: interfaces/command bus/app entry; other helpers unread |
| Academagia.Core.dll | Academagia.Core.Interfaces | 7 | 7 | Partial: interfaces/command bus/app entry; other helpers unread |
| Academagia.Core.dll | Properties | 1 | 0 | Partial: interfaces/command bus/app entry; other helpers unread |
| Academagia.exe | Academagia | 3 | 3 | Partial: interfaces/command bus/app entry; other helpers unread |
| Academagia.exe | Academagia.Properties | 2 | 2 | Partial: interfaces/command bus/app entry; other helpers unread |
| Academagia.exe | Properties | 1 | 0 | Partial: interfaces/command bus/app entry; other helpers unread |

## Full shipped table census

Counts for patches use source-compatible no-deletion unions, each separately over base. They are not live selected cache counts. Presence does not prove an active consumer. All full rows and field text remain in the private prior content streams; committed table is an aggregate.

| Table | Base rows | Content rows | Summer rows | Coverage |
|---|---:|---:|---:|---|
| Ability | 2753 | 3288 | 3288 | UNDOCUMENTED semantics; decoded rows retained |
| Action | 511 | 551 | 552 | UNDOCUMENTED semantics; decoded rows retained |
| ActionType | 54 | 54 | 54 | UNDOCUMENTED semantics; decoded rows retained |
| Adventure | 1555 | 3022 | 3030 | Prior dossier, bounded semantics |
| Affinity | 141 | 155 | 155 | UNDOCUMENTED semantics; decoded rows retained |
| AIEffect | 3387 | 3556 | 3556 | This pass, selected deeper-system semantics |
| AIGoal | 0 | 0 | 0 | This pass, selected deeper-system semantics |
| Article | 0 | 0 | 0 | UNDOCUMENTED semantics; decoded rows retained |
| Attribute | 1470 | 1540 | 1540 | UNDOCUMENTED semantics; decoded rows retained |
| Background | 117 | 147 | 147 | UNDOCUMENTED semantics; decoded rows retained |
| BackgroundType | 9 | 9 | 9 | UNDOCUMENTED semantics; decoded rows retained |
| Benefit | 15231 | 26053 | 26269 | Prior dossier, bounded semantics |
| BreedType | 77 | 81 | 81 | UNDOCUMENTED semantics; decoded rows retained |
| CalendarEffect | 360 | 360 | 360 | UNDOCUMENTED semantics; decoded rows retained |
| CalendarWeather | 360 | 360 | 360 | UNDOCUMENTED semantics; decoded rows retained |
| Catalog | 125 | 129 | 129 | UNDOCUMENTED semantics; decoded rows retained |
| CharacterSkill | 1316 | 1399 | 1399 | UNDOCUMENTED semantics; decoded rows retained |
| Clazz | 17 | 17 | 17 | Prior dossier, bounded semantics |
| ClazzPerk | 170 | 193 | 193 | UNDOCUMENTED semantics; decoded rows retained |
| ClazzSkill | 1192 | 1192 | 1192 | Prior dossier, bounded semantics |
| Clique | 0 | 0 | 0 | UNDOCUMENTED semantics; decoded rows retained |
| CliqueName | 98 | 103 | 103 | UNDOCUMENTED semantics; decoded rows retained |
| College | 7 | 7 | 7 | Prior dossier, bounded semantics |
| CompeteSkill | 0 | 0 | 0 | UNDOCUMENTED semantics; decoded rows retained |
| Complication | 1068 | 1548 | 1549 | Prior dossier, bounded semantics |
| ComplicationType | 114 | 114 | 114 | UNDOCUMENTED semantics; decoded rows retained |
| Constellation | 39 | 39 | 39 | UNDOCUMENTED semantics; decoded rows retained |
| ConstellationAbility | 269 | 269 | 269 | UNDOCUMENTED semantics; decoded rows retained |
| Continuance | 6567 | 11708 | 11749 | Prior dossier, bounded semantics |
| DateAM | 360 | 360 | 360 | Prior dossier, bounded semantics |
| Display | 0 | 0 | 0 | UNDOCUMENTED semantics; decoded rows retained |
| DuelEffect | 0 | 0 | 0 | UNDOCUMENTED semantics; decoded rows retained |
| Effect | 47202 | 65257 | 65516 | Prior dossier, bounded semantics |
| EffectCondition | 59546 | 79199 | 79463 | UNDOCUMENTED semantics; decoded rows retained |
| Emotion | 45 | 55 | 55 | UNDOCUMENTED semantics; decoded rows retained |
| Enchantment | 9 | 9 | 9 | UNDOCUMENTED semantics; decoded rows retained |
| EnchantmentAbility | 10 | 10 | 10 | UNDOCUMENTED semantics; decoded rows retained |
| Exit | 7592 | 12838 | 12897 | Prior dossier, bounded semantics |
| Familiar | 111 | 117 | 117 | UNDOCUMENTED semantics; decoded rows retained |
| FamiliarType | 26 | 29 | 29 | UNDOCUMENTED semantics; decoded rows retained |
| FavorEffect | 47 | 47 | 47 | UNDOCUMENTED semantics; decoded rows retained |
| ForceEffect | 12297 | 13895 | 13900 | UNDOCUMENTED semantics; decoded rows retained |
| GambitEffect | 0 | 0 | 0 | UNDOCUMENTED semantics; decoded rows retained |
| Geas | 0 | 0 | 0 | UNDOCUMENTED semantics; decoded rows retained |
| GiftPreference | 124 | 125 | 125 | UNDOCUMENTED semantics; decoded rows retained |
| GoalAIGoal | 415 | 435 | 435 | UNDOCUMENTED semantics; decoded rows retained |
| GoalAITable | 83 | 87 | 87 | This pass, selected deeper-system semantics |
| Ingredient | 1464 | 1464 | 1464 | UNDOCUMENTED semantics; decoded rows retained |
| Instructor | 21 | 21 | 21 | UNDOCUMENTED semantics; decoded rows retained |
| InterestsAITable | 83 | 87 | 87 | This pass, selected deeper-system semantics |
| Investigation | 2251 | 2826 | 2828 | Prior dossier, bounded semantics |
| Investiture | 0 | 0 | 0 | UNDOCUMENTED semantics; decoded rows retained |
| Item | 1265 | 1475 | 1475 | UNDOCUMENTED semantics; decoded rows retained |
| ItemAbility | 1122 | 1349 | 1349 | UNDOCUMENTED semantics; decoded rows retained |
| ItemInstance | 935 | 996 | 997 | UNDOCUMENTED semantics; decoded rows retained |
| ItemType | 113 | 114 | 114 | UNDOCUMENTED semantics; decoded rows retained |
| Location | 452 | 547 | 547 | Prior dossier, bounded semantics |
| LocationType | 10 | 10 | 10 | UNDOCUMENTED semantics; decoded rows retained |
| Lore | 4113 | 4748 | 4748 | UNDOCUMENTED semantics; decoded rows retained |
| Memory | 1640 | 2120 | 2127 | UNDOCUMENTED semantics; decoded rows retained |
| Merit | 34 | 36 | 36 | Prior dossier, bounded semantics |
| Monster | 16 | 16 | 16 | UNDOCUMENTED semantics; decoded rows retained |
| MonsterSkill | 91 | 91 | 91 | UNDOCUMENTED semantics; decoded rows retained |
| MonsterType | 22 | 22 | 22 | UNDOCUMENTED semantics; decoded rows retained |
| Music | 12 | 12 | 12 | UNDOCUMENTED semantics; decoded rows retained |
| NamedText | 0 | 0 | 0 | UNDOCUMENTED semantics; decoded rows retained |
| NewspaperIssue | 20 | 20 | 20 | UNDOCUMENTED semantics; decoded rows retained |
| Nickname | 0 | 0 | 0 | UNDOCUMENTED semantics; decoded rows retained |
| PersistEntityRef | 0 | 0 | 0 | UNDOCUMENTED semantics; decoded rows retained |
| PersonalAITable | 83 | 87 | 87 | This pass, selected deeper-system semantics |
| Personality | 85 | 89 | 89 | This pass, selected deeper-system semantics |
| PersonalityPreference | 813 | 823 | 823 | This pass, selected deeper-system semantics |
| Pheme | 629 | 664 | 664 | This pass, selected deeper-system semantics |
| PhemeEffect | 1201 | 1286 | 1286 | This pass, selected deeper-system semantics |
| PhemeSpellType | 2156 | 2229 | 2229 | This pass, selected deeper-system semantics |
| Player | 0 | 0 | 0 | UNDOCUMENTED semantics; decoded rows retained |
| Portrait | 28 | 28 | 28 | UNDOCUMENTED semantics; decoded rows retained |
| Prerequisite | 31050 | 45554 | 45678 | Prior dossier, bounded semantics |
| PrerequisiteItem | 6784 | 9659 | 9758 | Prior dossier, bounded semantics |
| Recipe | 1265 | 1475 | 1475 | UNDOCUMENTED semantics; decoded rows retained |
| ReferenceColumn | 257 | 276 | 276 | UNDOCUMENTED semantics; decoded rows retained |
| ReferenceTable | 59 | 77 | 77 | UNDOCUMENTED semantics; decoded rows retained |
| Region | 5 | 5 | 5 | UNDOCUMENTED semantics; decoded rows retained |
| RelationshipRumorDescription | 0 | 0 | 0 | UNDOCUMENTED semantics; decoded rows retained |
| Roll | 11338 | 15034 | 15059 | Prior dossier, bounded semantics |
| RollBonus | 148 | 148 | 148 | UNDOCUMENTED semantics; decoded rows retained |
| RollContext | 0 | 0 | 0 | UNDOCUMENTED semantics; decoded rows retained |
| RollEffectRelation | 1263 | 1439 | 1439 | UNDOCUMENTED semantics; decoded rows retained |
| RollInitiator | 12740 | 16445 | 16470 | UNDOCUMENTED semantics; decoded rows retained |
| RollTarget | 12740 | 16445 | 16470 | UNDOCUMENTED semantics; decoded rows retained |
| RumorDefaultDescription | 1 | 1 | 1 | UNDOCUMENTED semantics; decoded rows retained |
| RumorDescription | 2 | 2 | 2 | UNDOCUMENTED semantics; decoded rows retained |
| SelectionItem | 137310 | 181523 | 182257 | Prior dossier, bounded semantics |
| Skill | 364 | 386 | 386 | Prior dossier, bounded semantics |
| SkillLevelThreshold | 6540 | 7070 | 7050 | This pass, selected deeper-system semantics |
| SkillPerk | 6986 | 7964 | 7962 | UNDOCUMENTED semantics; decoded rows retained |
| SkillRumorDescription | 0 | 0 | 0 | UNDOCUMENTED semantics; decoded rows retained |
| Sound | 0 | 0 | 0 | UNDOCUMENTED semantics; decoded rows retained |
| Spell | 639 | 679 | 679 | This pass, selected deeper-system semantics |
| SpellType | 714 | 753 | 753 | UNDOCUMENTED semantics; decoded rows retained |
| Story | 0 | 0 | 0 | UNDOCUMENTED semantics; decoded rows retained |
| StoryActor | 3632 | 6666 | 6679 | Prior dossier, bounded semantics |
| StoryActorLink | 28779 | 39738 | 39849 | Prior dossier, bounded semantics |
| Student | 83 | 87 | 87 | Prior dossier, bounded semantics |
| StudiesAITable | 84 | 88 | 88 | This pass, selected deeper-system semantics |
| Topic | 290 | 321 | 319 | This pass, selected deeper-system semantics |
| University | 1 | 1 | 1 | UNDOCUMENTED semantics; decoded rows retained |
| VendettaAIGoal | 199 | 204 | 204 | UNDOCUMENTED semantics; decoded rows retained |
| VendettaAITable | 83 | 87 | 87 | This pass, selected deeper-system semantics |
| Visualization | 1547 | 1764 | 1764 | UNDOCUMENTED semantics; decoded rows retained |
| WeatherType | 10 | 10 | 10 | UNDOCUMENTED semantics; decoded rows retained |
| WeatherTypeChance | 874 | 874 | 874 | UNDOCUMENTED semantics; decoded rows retained |

## Top three by payoff

D1 NPC scheduling/adaptation: daily activity can connect personality, available methods, skill growth and relationships. D2 Research: accumulated failed attempts and threshold perks give a distinct learning route. D3 Component spell interactions: full knowledge, component multiplicity, opposing components, delayed execution and absorption support source-specific counters. These were gaps in the prior dossiers, not claims that all three were absent from the game. See DEEPER_SYSTEMS.md.

Other undocumented priorities remain item crafting/enchantment, full duel/range math, Rimbal play formulas, gifts/affinities, astrology, discipline/vendetta entry, exact per-college merit rewards and full creation UI. This pass inventories these and does not silently promote them to required YAIRPG work.

## Additional UI and installed dependency surface

The prior UI type list contains 237 Class entries, including nested/generated types. Only three story-view classes were read in this pass. The type-list signal does not prove layout behavior.

| UI namespace | Class entries | Coverage |
|---|---:|---|
| <Module> | 1 | Targeted storyline types or UNREAD implementation |
| <PrivateImplementationDetails> | 1 | Targeted storyline types or UNREAD implementation |
| Academagia.UI | 3 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Controls | 25 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Properties | 2 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Utilities | 15 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.ValueConverters | 2 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.ViewModels | 3 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views | 8 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Artificing | 2 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.ButtonsPanel | 1 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Calendar | 9 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.CharacterControlScheduler | 2 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Clique | 2 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Clock | 1 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Common | 22 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Common.DragManager | 6 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Confirmation | 11 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Display | 11 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Duel | 9 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Enchant | 2 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.EntityInformation | 2 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Familar | 2 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Feedback | 5 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Information | 1 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Information.ActionEntityBaseInformation | 1 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Information.CharacterInformation | 1 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Information.EmotionInformation | 1 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Information.InstructorInformation | 1 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Information.ItemInformation | 1 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Information.LocationInformation | 1 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Information.MonsterInformation | 1 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Information.PhemeInformation | 1 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Information.SkillInformation | 3 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Inventory | 2 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.LeftPanel | 8 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.LocationInventory | 1 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Lore | 2 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Menu | 4 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Portrait | 1 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Relations | 7 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.RightPanel | 3 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Rimbal | 13 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Scheduler | 1 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Shop | 2 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Storyline | 14 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Storyline.HtmlToXaml | 7 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Windows | 5 | Targeted storyline types or UNREAD implementation |
| Academagia.UI.Views.Wizard | 7 | Targeted storyline types or UNREAD implementation |
| XamlGeneratedNamespace | 1 | Targeted storyline types or UNREAD implementation |

Top-level installed DLL inventory below records deployment modules, not independent game systems. Six managed assemblies were decompiled by the prior lane, UI had a prior type list and three targeted reads here. Other dependency internals are UNREAD. File presence is not an active gameplay consumer.

| Installed DLL | Bytes | Coverage |
|---|---:|---|
| Academagia.Core.dll | 20480 | Prior decompile; bounded reads |
| Academagia.UI.dll | 39060480 | UI type list plus three targeted reads |
| Castle.DynamicProxy.dll | 77824 | UNREAD dependency internals |
| Common.dll | 310784 | Prior decompile; bounded reads |
| ContentModel.dll | 310784 | Prior decompile; bounded reads |
| FirebirdSql.Data.FirebirdClient.dll | 692224 | UNREAD dependency internals |
| FontLibrary.dll | 451584 | UNREAD dependency internals |
| GameLogic.dll | 834048 | Prior decompile; bounded reads |
| Iesi.Collections.dll | 32768 | UNREAD dependency internals |
| NHibernate.dll | 1085440 | UNREAD dependency internals |
| NVorbis.OpenTKSupport.dll | 14848 | UNREAD dependency internals |
| NVorbis.dll | 68608 | UNREAD dependency internals |
| OpenTK.dll | 3996160 | UNREAD dependency internals |
| Storage.dll | 863232 | Prior decompile; bounded reads |
| System.Linq.Dynamic.dll | 47616 | UNREAD dependency internals |
| log4net.dll | 270336 | UNREAD dependency internals |

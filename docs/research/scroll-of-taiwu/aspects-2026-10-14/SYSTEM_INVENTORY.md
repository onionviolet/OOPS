# Taiwu system inventory

Metadata census of the installed build, with mechanism coverage marked separately. Sources: `prior:GameData.types.txt`, `prior:Shared.types.txt`, `deep:frontend.types.txt`, new ArchiveData/Serializer/Common type lists and private `system_inventory.json`. Counts exclude nested classes containing `+`; they include top-level helpers, special effects and generated support types. They are not counts of unique player actions or reachable content.

This is an exhaustive inventory of the21 domain families and306 Config table/item pairs detected by the named metadata rules, plus all17 Backend GameData assembly names found on disk. It is **not** an exhaustive semantic inventory of every method, nested feature, asset or dynamically loaded mod. Table names identify further subsystems even where behavior is unread. No system is labeled absent merely because it was not traced.

## Domain families and discovered subsystems

| Family in GameData.dll | Top-level class signal | Systems/subsystems found | Documented coverage |
|---|---:|---|---|
| TutorialChapter | 1 | Guiding world, chapters, forced movement and function reveal | A10; new body read |
| SpecialEffect | 1490 | Combat/passive/world effects and cache influence | Prior selected effects only; most handlers undocumented |
| Mod | 1 | Plugin/config/event-package loading and callbacks | A07; new loader body read |
| Merchant | 3 | Cash trade, libraries/book exchange, buyback, dealer favor, caravans | D2 new; full price/economy partial |
| LifeRecord | 2 | Typed living/dead actor records and query/persistence | A02/A04 new |
| Information | 11 | Ordinary information, private occurrences, reception/dissemination, broadcasting and consequences | D1 new; transfer previously documented |
| Global | 4 | Archive orchestration, versions, settings, global state and achievements | A04 new; full achievement roster undocumented |
| Combat | 316 | Battle state, attack/defense, weapons, movement, wounds, AI, minigames | Broad metadata only; complete combat mechanism undocumented |
| CombatSkill | 4 | Method instances, study/breakthrough bonuses, force and requirements | Prior/deep mechanism digests; every effect unread |
| Map | 19 | Areas, blocks, navigation, exploration, destination and population interfaces | Prior map hooks only; deep topology undocumented |
| TaiwuEvent | 82 | Generated events, expression functions, conditions, selection and trigger routing | Prior/deep grammar/gates; A01/A03 expanded |
| Taiwu | 29 | Player party, succession, study, force, village access, career data | Prior/deep; D3 careers new |
| Organization | 16 | Sects, settlement roles, support, factions, marriages, crime, prisons and treasuries | Prior/deep selected handlers; full office/treasury policy partial |
| Building | 5 | Sites, construction, maintenance, shops, workers, training/facility effects | Prior village digest; all building effects unread |
| Adventure | 8 | Spatial instances, element movement, major-event nodes, generation and cleanup | Deep adventure/grammar digest |
| World | 4 | Date/month phases, world/version settings, event/notification collections | Prior/deep; A04/A09 save boundary expanded |
| Item | 32 | Ownership, inventory, equipment, durability, pages, making/repair, drugs/poison and crickets | Prior/deep selected custody/manual methods; complete making/repair undocumented |
| LegendaryBook | 2 | Legendary-book ownership, behavior and special rules | Prior transfer hook only; dedicated system undocumented |
| Extra | 4 | Careers, work orders, special traditions, cooldowns, village roles and auxiliary world systems | Prior/deep selected handlers; D3 new; remaining auxiliary policies undocumented |
| Story | 13 | Story campaign state, main-story milestones and special cast | Metadata and cited hooks; complete campaign undocumented |
| Character | 169 | Bodies, needs, skills, plans, social ties, genetics, birth/death and estates | Prior/deep mechanisms; full genetics/population undocumented |

D1 information circulation, D2 trade custody/settlement and D3 career advancement are ranked by payoff to existing people/knowledge/item/skill owners. Earlier passes mention them but do not give dedicated end-to-end mechanism digests. Their deeper reads are in DEEPER_SYSTEMS.md. Combat, legendary books and whole genetics are substantial lower-ranked future research, not required YAIR implementation gates.

## Backend modules

Sizes are actual assembly bytes, not decompiled lines or source complexity. All entries were found read-only; only named modules/types were decompiled.

| Assembly | Bytes | Known role / coverage |
|---|---:|---|
| GameData.ActionPlanning.ActionImpl.dll | 217600 | Planner and concrete actions; prior deep pass selected semantics |
| GameData.ActionPlanning.dll | 32256 | Planner and concrete actions; prior deep pass selected semantics |
| GameData.Adventure.dll | 145408 | Authored protobuf adventure data; prior deep grammar read |
| GameData.ArchiveData.dll | 30208 | Custom binary archive and embedded DB; A04 body read |
| GameData.Combat.Animation.dll | 5120 | Metadata/file inventory only; module body mostly unread |
| GameData.Combat.Chicken.dll | 15360 | Metadata/file inventory only; module body mostly unread |
| GameData.Combat.Cricket.dll | 32256 | Metadata/file inventory only; module body mostly unread |
| GameData.Combat.Math.dll | 18944 | Metadata/file inventory only; module body mostly unread |
| GameData.Common.Algorithm.dll | 24576 | Metadata/file inventory only; module body mostly unread |
| GameData.Common.dll | 7680 | Metadata/file inventory only; module body mostly unread |
| GameData.SecretInformation.dll | 10752 | Metadata/file inventory only; module body mostly unread |
| GameData.Serializer.dll | 40448 | Serialization support; type inventory, selected callers read |
| GameData.Shared.dll | 23540224 | Main domains/shared definitions; selected bodies and table census |
| GameData.Utilities.Reflection.dll | 8192 | Metadata/file inventory only; module body mostly unread |
| GameData.Utilities.Structure.dll | 19456 | Metadata/file inventory only; module body mostly unread |
| GameData.Utilities.dll | 96768 | Metadata/file inventory only; module body mostly unread |
| GameData.dll | 9170432 | Main domains/shared definitions; selected bodies and table census |

Additional discovered libraries: CompDevLib.Interpreter for expressions, MoonSharp.Interpreter for a separate Lua route, SQLite for working records, Google.Protobuf for adventure data, TaiwuModdingLib for plugins, Unity frontend and mod/editor tools. Library presence alone does not prove a gameplay consumer. Frontend views cover events, maps, shops, people, study, career, village, collections/minigames, modding and archive selection; actual screen layout remains unread.

## All detected compiled config tables

Each entry has a table class plus Item schema in GameData.Shared.dll. A numeric row signal means constructor enumeration in an available private extract, not semantic review. “Mentioned” means the exact identifier appears in earlier committed mechanism notes; it is not an acceptance claim. “New” means documented here. “Undocumented” marks metadata-only discovery. These306 rows retain the full subsystem search surface without copying proprietary table contents.

| Config table | Size signal | Documentation |
|---|---|---|
| Accessory | 1 table/item schema pair; rows unread | Undocumented behavior |
| AchievementInfo | 1 table/item schema pair; rows unread | Undocumented behavior |
| AdvancingMonthFormula | 1 table/item schema pair; rows unread | Undocumented behavior |
| AdvancingMonthState | 1 table/item schema pair; rows unread | Undocumented behavior |
| Adventure | 1 table/item schema pair; rows unread | Mentioned in prior dossier; detailed coverage varies |
| AdventureGenerateCondition | 93 numeric constructors | Mentioned in prior dossier; detailed coverage varies |
| AdventureItemDropRate | 1 table/item schema pair; rows unread | Undocumented behavior |
| AdventureLifeSkillRequirement | 1 table/item schema pair; rows unread | Undocumented behavior |
| AdventureRemakeBlockEffect | 1 table/item schema pair; rows unread | Undocumented behavior |
| AdventureRemakeMapBlock | 1 table/item schema pair; rows unread | Undocumented behavior |
| AdventureRemakePerformanceEffect | 1 table/item schema pair; rows unread | Undocumented behavior |
| AdventureRemakePerformanceEffectParam | 1 table/item schema pair; rows unread | Undocumented behavior |
| AdventureTerrain | 1 table/item schema pair; rows unread | Undocumented behavior |
| AdventureType | 1 table/item schema pair; rows unread | Undocumented behavior |
| AgeEffect | 1 table/item schema pair; rows unread | Undocumented behavior |
| AiAction | 1 table/item schema pair; rows unread | Undocumented behavior |
| AiCondition | 1 table/item schema pair; rows unread | Undocumented behavior |
| AiData | 1 table/item schema pair; rows unread | Undocumented behavior |
| AiGroup | 1 table/item schema pair; rows unread | Undocumented behavior |
| AiNode | 1 table/item schema pair; rows unread | Undocumented behavior |
| AiParam | 1 table/item schema pair; rows unread | Undocumented behavior |
| AiRelations | 1 table/item schema pair; rows unread | Undocumented behavior |
| Animal | 1 table/item schema pair; rows unread | Undocumented behavior |
| Armor | 1 table/item schema pair; rows unread | Undocumented behavior |
| AvatarClothColors | 1 table/item schema pair; rows unread | Undocumented behavior |
| AvatarElementPosition | 1 table/item schema pair; rows unread | Undocumented behavior |
| AvatarElements | 1 table/item schema pair; rows unread | Undocumented behavior |
| AvatarExtraParts | 1 table/item schema pair; rows unread | Undocumented behavior |
| AvatarEyeballColors | 1 table/item schema pair; rows unread | Undocumented behavior |
| AvatarFaceElementScore | 1 table/item schema pair; rows unread | Undocumented behavior |
| AvatarFeatureColors | 1 table/item schema pair; rows unread | Undocumented behavior |
| AvatarHairColors | 1 table/item schema pair; rows unread | Undocumented behavior |
| AvatarHead | 1 table/item schema pair; rows unread | Undocumented behavior |
| AvatarLipColors | 1 table/item schema pair; rows unread | Undocumented behavior |
| AvatarSkinColors | 1 table/item schema pair; rows unread | Undocumented behavior |
| BecomeEnemyType | 1 table/item schema pair; rows unread | Undocumented behavior |
| BehaviorType | 1 table/item schema pair; rows unread | Undocumented behavior |
| BigEventKey | 1 table/item schema pair; rows unread | Undocumented behavior |
| BlockButton | 1 table/item schema pair; rows unread | Undocumented behavior |
| BodyPart | 1 table/item schema pair; rows unread | Undocumented behavior |
| Boss | 1 table/item schema pair; rows unread | Undocumented behavior |
| BuildingBlock | 319 numeric constructors | Mentioned in prior dossier; detailed coverage varies |
| BuildingFormula | 1 table/item schema pair; rows unread | Undocumented behavior |
| BuildingScale | 1 table/item schema pair; rows unread | Undocumented behavior |
| Carrier | 1 table/item schema pair; rows unread | Undocumented behavior |
| CatchThiefLevel | 1 table/item schema pair; rows unread | Undocumented behavior |
| CatchThiefPlace | 1 table/item schema pair; rows unread | Undocumented behavior |
| ChallengeMode | 1 table/item schema pair; rows unread | Undocumented behavior |
| Character | 1 table/item schema pair; rows unread | Mentioned in prior dossier; detailed coverage varies |
| CharacterAlertnessRecord | 1 table/item schema pair; rows unread | Undocumented behavior |
| CharacterDeathType | 1 table/item schema pair; rows unread | Undocumented behavior |
| CharacterFeature | 1 table/item schema pair; rows unread | Undocumented behavior |
| CharacterFilterRules | 1 table/item schema pair; rows unread | Undocumented behavior |
| CharacterMapBlockButton | 1 table/item schema pair; rows unread | Undocumented behavior |
| CharacterMatcher | 1 table/item schema pair; rows unread | Undocumented behavior |
| CharacterMenuFunctionControl | 1 table/item schema pair; rows unread | Undocumented behavior |
| CharacterMission | 1 table/item schema pair; rows unread | Undocumented behavior |
| CharacterPropertyDisplay | 1 table/item schema pair; rows unread | Undocumented behavior |
| CharacterPropertyReferenced | 1 table/item schema pair; rows unread | Undocumented behavior |
| CharacterTable | 1 table/item schema pair; rows unread | Undocumented behavior |
| CharacterTableElement | 1 table/item schema pair; rows unread | Undocumented behavior |
| CharacterTitle | 1 table/item schema pair; rows unread | Undocumented behavior |
| Chicken | 1 table/item schema pair; rows unread | Undocumented behavior |
| Choosy | 1 table/item schema pair; rows unread | Undocumented behavior |
| Clothing | 1 table/item schema pair; rows unread | Undocumented behavior |
| CombatConfig | 1 table/item schema pair; rows unread | Undocumented behavior |
| CombatDifficulty | 1 table/item schema pair; rows unread | Undocumented behavior |
| CombatEvaluation | 1 table/item schema pair; rows unread | Undocumented behavior |
| CombatItemUse | 1 table/item schema pair; rows unread | Undocumented behavior |
| CombatScene | 1 table/item schema pair; rows unread | Undocumented behavior |
| CombatSkeleton | 1 table/item schema pair; rows unread | Undocumented behavior |
| CombatSkill | 955 numeric constructors | Mentioned in prior dossier; detailed coverage varies |
| CombatSkillProperty | 1 table/item schema pair; rows unread | Undocumented behavior |
| CombatSkillType | 1 table/item schema pair; rows unread | Undocumented behavior |
| CombatState | 1 table/item schema pair; rows unread | Undocumented behavior |
| CommonTip | 1 table/item schema pair; rows unread | Undocumented behavior |
| ConsummateLevel | 1 table/item schema pair; rows unread | Undocumented behavior |
| CraftTool | 1 table/item schema pair; rows unread | Undocumented behavior |
| Cricket | 1 table/item schema pair; rows unread | Undocumented behavior |
| CricketAffixes | 1 table/item schema pair; rows unread | Undocumented behavior |
| CricketParts | 1 table/item schema pair; rows unread | Undocumented behavior |
| CricketPlace | 1 table/item schema pair; rows unread | Undocumented behavior |
| CricketPolymorphEvent | 1 table/item schema pair; rows unread | Undocumented behavior |
| CricketSkill | 1 table/item schema pair; rows unread | Undocumented behavior |
| DebateComment | 1 table/item schema pair; rows unread | Undocumented behavior |
| DebateEvaluation | 1 table/item schema pair; rows unread | Undocumented behavior |
| DebateNodeEffect | 1 table/item schema pair; rows unread | Undocumented behavior |
| DebateRecord | 1 table/item schema pair; rows unread | Undocumented behavior |
| DebateReference | 1 table/item schema pair; rows unread | Undocumented behavior |
| DebateStrategy | 1 table/item schema pair; rows unread | Undocumented behavior |
| DebateStrategyEffect | 1 table/item schema pair; rows unread | Undocumented behavior |
| DebateStrategyTarget | 1 table/item schema pair; rows unread | Undocumented behavior |
| DemandInteraction | 1 table/item schema pair; rows unread | Undocumented behavior |
| DemonSlayerTrial | 1 table/item schema pair; rows unread | Undocumented behavior |
| DemonSlayerTrialLevel | 1 table/item schema pair; rows unread | Undocumented behavior |
| DemonSlayerTrialRestrict | 1 table/item schema pair; rows unread | Undocumented behavior |
| DestinyType | 1 table/item schema pair; rows unread | Undocumented behavior |
| DevelopmentTeam | 1 table/item schema pair; rows unread | Undocumented behavior |
| DlcEventArgKey | 1 table/item schema pair; rows unread | Undocumented behavior |
| EncyclopediaTipLink | 1 table/item schema pair; rows unread | Undocumented behavior |
| EnemyNest | 1 table/item schema pair; rows unread | Undocumented behavior |
| EquipmentEffect | 1 table/item schema pair; rows unread | Undocumented behavior |
| EventActionKey | 1 table/item schema pair; rows unread | Undocumented behavior |
| EventActors | 1 table/item schema pair; rows unread | Undocumented behavior |
| EventArgument | 1 table/item schema pair; rows unread | Undocumented behavior |
| EventBoolState | 1 table/item schema pair; rows unread | Undocumented behavior |
| EventCgTexture | 1 table/item schema pair; rows unread | Undocumented behavior |
| EventCommonOption | 1 table/item schema pair; rows unread | Undocumented behavior |
| EventConditionOperator | 1 table/item schema pair; rows unread | Undocumented behavior |
| EventCutscene | 1 table/item schema pair; rows unread | Undocumented behavior |
| EventFunction | 972 numeric constructors | Mentioned in prior dossier; detailed coverage varies |
| EventOptionConsumeType | 1 table/item schema pair; rows unread | Undocumented behavior |
| EventOptionTipsInfo | 1 table/item schema pair; rows unread | Undocumented behavior |
| EventScriptType | 11 numeric constructors | Undocumented behavior |
| EventTriggerParameter | 1 table/item schema pair; rows unread | Undocumented behavior |
| EventTriggerType | 1 table/item schema pair; rows unread | Undocumented behavior |
| EventValue | 1 table/item schema pair; rows unread | Undocumented behavior |
| ExchangeTask | 1 table/item schema pair; rows unread | Undocumented behavior |
| ExtraNameText | 1 table/item schema pair; rows unread | Undocumented behavior |
| FameAction | 1 table/item schema pair; rows unread | Undocumented behavior |
| Feast | 1 table/item schema pair; rows unread | Undocumented behavior |
| Food | 1 table/item schema pair; rows unread | Undocumented behavior |
| GuidingChapter | 1 table/item schema pair; rows unread | Undocumented behavior |
| GuidingChapterClass | 1 table/item schema pair; rows unread | Undocumented behavior |
| GuidingChapterTrigger | 1 table/item schema pair; rows unread | Undocumented behavior |
| HotKeyDisplay | 1 table/item schema pair; rows unread | Undocumented behavior |
| ImplementedDlc | 1 table/item schema pair; rows unread | Undocumented behavior |
| Information | 1 table/item schema pair; rows unread | Mentioned in prior dossier; detailed coverage varies |
| InformationInfo | 1 table/item schema pair; rows unread | Undocumented behavior |
| InformationType | 1 table/item schema pair; rows unread | Undocumented behavior |
| InstantNotification | 1 table/item schema pair; rows unread | Undocumented behavior |
| InteractAlertnessFormula | 1 table/item schema pair; rows unread | Undocumented behavior |
| InteractCheck | 1 table/item schema pair; rows unread | Undocumented behavior |
| InteractCheckTip | 1 table/item schema pair; rows unread | Undocumented behavior |
| InteractionEventOption | 150 numeric constructors | Undocumented behavior |
| ItemFilterRules | 1 table/item schema pair; rows unread | Undocumented behavior |
| Jiao | 1 table/item schema pair; rows unread | Undocumented behavior |
| JiaoNurturance | 1 table/item schema pair; rows unread | Undocumented behavior |
| JiaoProperty | 1 table/item schema pair; rows unread | Undocumented behavior |
| JiaoRecord | 1 table/item schema pair; rows unread | Undocumented behavior |
| JieqingGameLevel | 1 table/item schema pair; rows unread | Undocumented behavior |
| JieqingGamePeace | 1 table/item schema pair; rows unread | Undocumented behavior |
| LandFormType | 1 table/item schema pair; rows unread | Undocumented behavior |
| Legacy | 749 numeric constructors | Mentioned in prior dossier; detailed coverage varies |
| LegacyPoint | 53 numeric constructors | Mentioned in prior dossier; detailed coverage varies |
| LegacyPointType | 8 numeric constructors | Mentioned in prior dossier; detailed coverage varies |
| LegendaryBookPropertyBonusType | 1 table/item schema pair; rows unread | Undocumented behavior |
| LegendaryBookSlot | 1 table/item schema pair; rows unread | Undocumented behavior |
| LifeLinkFeatureEffect | 1 table/item schema pair; rows unread | Undocumented behavior |
| LifeRecord | 1 table/item schema pair; rows unread | Undocumented behavior |
| LifeSkill | 1 table/item schema pair; rows unread | Undocumented behavior |
| LifeSkillCombatEffect | 1 table/item schema pair; rows unread | Undocumented behavior |
| LifeSkillCombatTalk | 1 table/item schema pair; rows unread | Undocumented behavior |
| LifeSkillType | 1 table/item schema pair; rows unread | Undocumented behavior |
| LoadingTips | 1 table/item schema pair; rows unread | Undocumented behavior |
| Loong | 1 table/item schema pair; rows unread | Undocumented behavior |
| Luohan | 1 table/item schema pair; rows unread | Undocumented behavior |
| MainMenuButton | 1 table/item schema pair; rows unread | Undocumented behavior |
| MainStoryLineProgress | 1 table/item schema pair; rows unread | Undocumented behavior |
| MainUiCustomButton | 1 table/item schema pair; rows unread | Undocumented behavior |
| MakeItemSubType | 1 table/item schema pair; rows unread | Undocumented behavior |
| MakeItemType | 1 table/item schema pair; rows unread | Undocumented behavior |
| MapArea | 1 table/item schema pair; rows unread | Undocumented behavior |
| MapBlock | 1 table/item schema pair; rows unread | Undocumented behavior |
| MapBlockCharCustomButton | 1 table/item schema pair; rows unread | Undocumented behavior |
| MapBlockCharCustomInfo | 1 table/item schema pair; rows unread | Undocumented behavior |
| MapBlockMatcher | 1 table/item schema pair; rows unread | Undocumented behavior |
| MapElementDisplayRuleGroup | 1 table/item schema pair; rows unread | Undocumented behavior |
| MapElementDisplayRuleItem | 1 table/item schema pair; rows unread | Undocumented behavior |
| MapLegend | 1 table/item schema pair; rows unread | Undocumented behavior |
| MapPickups | 1 table/item schema pair; rows unread | Undocumented behavior |
| MapRoute | 1 table/item schema pair; rows unread | Undocumented behavior |
| MapState | 1 table/item schema pair; rows unread | Undocumented behavior |
| Material | 1 table/item schema pair; rows unread | Undocumented behavior |
| Medicine | 1 table/item schema pair; rows unread | Undocumented behavior |
| Merchant | 1 table/item schema pair; rows unread | Undocumented behavior |
| MerchantType | 1 table/item schema pair; rows unread | Undocumented behavior |
| MiniGameYuanshan | 1 table/item schema pair; rows unread | Undocumented behavior |
| MinionGroup | 1 table/item schema pair; rows unread | Undocumented behavior |
| Misc | 1 table/item schema pair; rows unread | Undocumented behavior |
| MixPoisonEffect | 1 table/item schema pair; rows unread | Undocumented behavior |
| Month | 1 table/item schema pair; rows unread | Mentioned in prior dossier; detailed coverage varies |
| MonthlyActions | 1 table/item schema pair; rows unread | Undocumented behavior |
| MonthlyEvent | 1 table/item schema pair; rows unread | Undocumented behavior |
| MonthlyNotification | 1 table/item schema pair; rows unread | Undocumented behavior |
| MonthlyNotificationSortingGroup | 1 table/item schema pair; rows unread | Undocumented behavior |
| Music | 1 table/item schema pair; rows unread | Undocumented behavior |
| MysteryEffect | 1 table/item schema pair; rows unread | Undocumented behavior |
| NeiliAllocationEffect | 1 table/item schema pair; rows unread | Undocumented behavior |
| NeiliAllocationStatus | 1 table/item schema pair; rows unread | Undocumented behavior |
| NeiliType | 36 numeric constructors | Mentioned in prior dossier; detailed coverage varies |
| NewFunctionUnlock | 1 table/item schema pair; rows unread | Undocumented behavior |
| NormalInteraction | 1 table/item schema pair; rows unread | Undocumented behavior |
| NpcRandomWords | 1 table/item schema pair; rows unread | Undocumented behavior |
| Organization | 1 table/item schema pair; rows unread | Undocumented behavior |
| OrganizationMember | 1 table/item schema pair; rows unread | Undocumented behavior |
| OtherActionType | 1 table/item schema pair; rows unread | Undocumented behavior |
| PersonalNeed | 1 table/item schema pair; rows unread | Undocumented behavior |
| PlanningAction | 389 numeric constructors | Mentioned in prior dossier; detailed coverage varies |
| PlanningGoal | 276 numeric constructors | Mentioned in prior dossier; detailed coverage varies |
| PlanningParameter | 1 table/item schema pair; rows unread | Undocumented behavior |
| PlanningState | 1 table/item schema pair; rows unread | Undocumented behavior |
| Poison | 1 table/item schema pair; rows unread | Mentioned in prior dossier; detailed coverage varies |
| PredefinedLog | 1 table/item schema pair; rows unread | Undocumented behavior |
| PrioritizedActions | 1 table/item schema pair; rows unread | Undocumented behavior |
| Profession | 19 numeric constructors | New D3; selected progression body |
| ProfessionFormula | 1 table/item schema pair; rows unread | Undocumented behavior |
| ProfessionSkill | 76 numeric constructors | New D3; selected progression body |
| ProtagonistFeature | 1 table/item schema pair; rows unread | Undocumented behavior |
| PunishmentSeverity | 1 table/item schema pair; rows unread | Undocumented behavior |
| PunishmentType | 1 table/item schema pair; rows unread | Undocumented behavior |
| Puppet | 1 table/item schema pair; rows unread | Undocumented behavior |
| QiArtStrategy | 1 table/item schema pair; rows unread | Undocumented behavior |
| QiDisorderEffect | 1 table/item schema pair; rows unread | Undocumented behavior |
| RandomEnemy | 1 table/item schema pair; rows unread | Undocumented behavior |
| RanshanGiveupLegendaryBook | 1 table/item schema pair; rows unread | Undocumented behavior |
| ReadingStrategy | 1 table/item schema pair; rows unread | Undocumented behavior |
| RefiningEffect | 1 table/item schema pair; rows unread | Undocumented behavior |
| RelationDisplayType | 1 table/item schema pair; rows unread | Undocumented behavior |
| ResourceCollection | 1 table/item schema pair; rows unread | Undocumented behavior |
| ResourceDisaster | 1 table/item schema pair; rows unread | Undocumented behavior |
| ResourceType | 1 table/item schema pair; rows unread | Undocumented behavior |
| SamsaraPlatformRecord | 1 table/item schema pair; rows unread | Undocumented behavior |
| Season | 1 table/item schema pair; rows unread | Undocumented behavior |
| SecretInformation | 1 table/item schema pair; rows unread | Undocumented behavior |
| SecretInformationAppliedContent | 1 table/item schema pair; rows unread | Undocumented behavior |
| SecretInformationAppliedRelation | 1 table/item schema pair; rows unread | Undocumented behavior |
| SecretInformationAppliedResult | 1 table/item schema pair; rows unread | Undocumented behavior |
| SecretInformationAppliedSelection | 1 table/item schema pair; rows unread | Undocumented behavior |
| SecretInformationAppliedStruct | 1 table/item schema pair; rows unread | Undocumented behavior |
| SecretInformationDetailedFilter | 1 table/item schema pair; rows unread | Undocumented behavior |
| SecretInformationDissemination | 1 table/item schema pair; rows unread | Undocumented behavior |
| SecretInformationEffect | 1 table/item schema pair; rows unread | Undocumented behavior |
| SecretInformationGeneralFilter | 1 table/item schema pair; rows unread | Undocumented behavior |
| SecretInformationParameterType | 1 table/item schema pair; rows unread | Undocumented behavior |
| SecretInformationReception | 1 table/item schema pair; rows unread | Undocumented behavior |
| SecretInformationSectPunish | 1 table/item schema pair; rows unread | Undocumented behavior |
| SecretInformationSpecialCondition | 1 table/item schema pair; rows unread | Undocumented behavior |
| SectApprovingEffect | 15 numeric constructors | Mentioned in prior dossier; detailed coverage varies |
| SectMainStory | 1 table/item schema pair; rows unread | Undocumented behavior |
| SectMainStoryEventArgKey | 1 table/item schema pair; rows unread | Undocumented behavior |
| SensitiveWords | 1 table/item schema pair; rows unread | Undocumented behavior |
| SettlementPrisonEventEffect | 1 table/item schema pair; rows unread | Undocumented behavior |
| SettlementPrisonRecord | 1 table/item schema pair; rows unread | Undocumented behavior |
| SettlementTreasuryEventEffect | 1 table/item schema pair; rows unread | Undocumented behavior |
| SettlementTreasuryRecord | 1 table/item schema pair; rows unread | Undocumented behavior |
| ShopEvent | 1 table/item schema pair; rows unread | Undocumented behavior |
| SkillBook | 1 table/item schema pair; rows unread | Undocumented behavior |
| SkillBreakBonusEffect | 1 table/item schema pair; rows unread | Undocumented behavior |
| SkillBreakBonusEffectImplement | 1 table/item schema pair; rows unread | Undocumented behavior |
| SkillBreakEffectDisplay | 1 table/item schema pair; rows unread | Undocumented behavior |
| SkillBreakGridList | 1 table/item schema pair; rows unread | Undocumented behavior |
| SkillBreakGridType | 1 table/item schema pair; rows unread | Undocumented behavior |
| SkillBreakOutlineEffect | 1 table/item schema pair; rows unread | Undocumented behavior |
| SkillBreakPageEffect | 10 numeric constructors | Mentioned in prior dossier; detailed coverage varies |
| SkillBreakPageEffectImplement | 1 table/item schema pair; rows unread | Mentioned in prior dossier; detailed coverage varies |
| SkillBreakPlate | 1 table/item schema pair; rows unread | Undocumented behavior |
| SkillBreakPlateGridBonusType | 1 table/item schema pair; rows unread | Undocumented behavior |
| SkillGradeData | 1 table/item schema pair; rows unread | Undocumented behavior |
| SmarterChicken | 1 table/item schema pair; rows unread | Undocumented behavior |
| SolarTerm | 1 table/item schema pair; rows unread | Undocumented behavior |
| SortItem | 1 table/item schema pair; rows unread | Undocumented behavior |
| SpecialEffect | 1 table/item schema pair; rows unread | Undocumented behavior |
| SpecialEffectDataField | 1 table/item schema pair; rows unread | Undocumented behavior |
| StatInfo | 1 table/item schema pair; rows unread | Undocumented behavior |
| StoryScroll | 1 table/item schema pair; rows unread | Undocumented behavior |
| SuccessorOfXiangshu | 1 table/item schema pair; rows unread | Undocumented behavior |
| SwordTomb | 1 table/item schema pair; rows unread | Undocumented behavior |
| TaiwuBeHuntedEvent | 1 table/item schema pair; rows unread | Undocumented behavior |
| TaiwuLifeSummaryGroup | 1 table/item schema pair; rows unread | Undocumented behavior |
| TaiwuLifeSummaryType | 1 table/item schema pair; rows unread | Undocumented behavior |
| TaiwuVillageStoragesRecord | 1 table/item schema pair; rows unread | Undocumented behavior |
| TaskChain | 1 table/item schema pair; rows unread | Undocumented behavior |
| TaskCondition | 1 table/item schema pair; rows unread | Undocumented behavior |
| TaskHint | 1 table/item schema pair; rows unread | Undocumented behavior |
| TaskInfo | 1 table/item schema pair; rows unread | Undocumented behavior |
| TeaHorseCaravanEvent | 1 table/item schema pair; rows unread | Undocumented behavior |
| TeaHorseCaravanTerrain | 1 table/item schema pair; rows unread | Undocumented behavior |
| TeaHorseCaravanWeather | 1 table/item schema pair; rows unread | Undocumented behavior |
| TeaWine | 1 table/item schema pair; rows unread | Undocumented behavior |
| TeammateBubble | 1 table/item schema pair; rows unread | Undocumented behavior |
| TeammateCommand | 1 table/item schema pair; rows unread | Undocumented behavior |
| TravelSkeleton | 1 table/item schema pair; rows unread | Undocumented behavior |
| TravelingEvent | 1 table/item schema pair; rows unread | Undocumented behavior |
| TrickType | 1 table/item schema pair; rows unread | Undocumented behavior |
| TutorialChapters | 1 table/item schema pair; rows unread | Undocumented behavior |
| TutorialFunctionType | 1 table/item schema pair; rows unread | Undocumented behavior |
| TutorialVideo | 1 table/item schema pair; rows unread | Undocumented behavior |
| TwelveImmortals | 1 table/item schema pair; rows unread | Undocumented behavior |
| UpdateLog | 1 table/item schema pair; rows unread | Undocumented behavior |
| VillagerRole | 1 table/item schema pair; rows unread | Undocumented behavior |
| VillagerRoleActionRecord | 1 table/item schema pair; rows unread | Undocumented behavior |
| VillagerRoleArrangement | 1 table/item schema pair; rows unread | Undocumented behavior |
| VillagerRoleAutoAction | 1 table/item schema pair; rows unread | Undocumented behavior |
| VillagerRoleFormula | 1 table/item schema pair; rows unread | Undocumented behavior |
| Weapon | 1 table/item schema pair; rows unread | Undocumented behavior |
| WeaponUnlockEffect | 1 table/item schema pair; rows unread | Undocumented behavior |
| Weather | 1 table/item schema pair; rows unread | Undocumented behavior |
| WesternRegion | 1 table/item schema pair; rows unread | Undocumented behavior |
| WorldCreation | 15 numeric constructors | Mentioned in prior dossier; detailed coverage varies |
| WorldCreationGroup | 1 table/item schema pair; rows unread | Undocumented behavior |
| WorldFavorability | 1 table/item schema pair; rows unread | Undocumented behavior |
| WorldResource | 1 table/item schema pair; rows unread | Undocumented behavior |
| WorldState | 57 numeric constructors | Mentioned in prior dossier; detailed coverage varies |
| WugKing | 1 table/item schema pair; rows unread | Undocumented behavior |
| ZhujianCombatSkillToWeapon | 1 table/item schema pair; rows unread | Undocumented behavior |

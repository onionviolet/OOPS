# System inventory

Scope: all 280 data assets found in the decoded master bundle, plus recovered code groups, localized resources and catalog-only systems. This inventories what the static pass found, not every live behavior. Full 94,614 catalog entries and 12,898 type names are preserved privately. A table asset can define a subsystem or be one of many datasets for the same subsystem. Every decoded master asset is listed below so undigested data is visible.

| System family | Location | Size signal | Coverage |
|---|---|---|---|
| Items, inventory, upgrades, synthesis | Master/Item; ItemData descendants; RF5ItemData | 1,174 item, 1,152 strengthening, 567 equipment rows | Feature F1/F5, digest |
| Recipes, material categories, knowledge supply | RecipeData; CraftGenre/Type; RecipePan tables | 663 recipe, 66 genre, 18 type rows | Feature F1/F2, deeper D1 |
| Skill actions, progression, status | Master/Character; SkillManager; RF5PlayerData | 411 actions, 39 skills, five curves | Feature F2, skill digest |
| Dialogue, events, relationship | Event and Character masters; AdvMain; English pack | 204 subevents, 2,628 unlock rows, 23,778 offsets | Feature F3; command decoding open |
| Farm crops and helper work | Farm masters; FarmSupportMonsterController | 185 crop rows, helper phases and six progress/placement fields | Feature F4 partial; crop math undigested |
| Co-work and partner contributions | Facility/DualWork, DualSmith; EquipItemData | 26 actor bonus rows, eight gauge and eight smith rows | Deeper D2 |
| NPC schedules and lifecycle lottery | Event/NpcLifeCycleTable; Text/Event/NpcLifeCycleLottery | Two schedule samples; 30 lottery assets catalogued | Deeper D3 partial |
| Save roots, options and recovery | RF5SaveData family; SaveDataManager | Readers 0000..0007, header/footer | Feature F5, A04 partial |
| Orders and quest rewards | Event/Order/OrderMasterDataTable | 267 NPC, 111 Police, 111 Tantei records | Table schema sampled; consumers undigested |
| Combat, monster actions, drops, projectiles | Monster, Bits, Bullets, HitSystem tables | Listed individually below; native consumers unread | Preserved, largely undigested |
| Shops, construction, furniture, facilities | Master/Shop, Facility, Furniture | Listed individually below | Preserved; recipe shop subset read |
| Fishing, festivals, weather, field spawning | Master/Fishing, Festival, Field | Listed individually below | Preserved, largely undigested |
| Audio, effects, localization, animation, UI | Addressables catalog, English masters, resources.assets | Master bundle 462 objects; resources inventory saved | Data/assets inventoried; runtime UI unread |

## Every decoded master data asset

All live under the master bundle above; full named JSON lives in `../private/fs-rune-factory-5/tables/`. Counts list every top-level array, rather than pretending nested arrays are the same unit. Scalar-only assets show zero arrays. Method and runtime behavior remain outside these counts.

| Asset/system data | Bytes | Top-level row counts | Dossier coverage |
|---|---:|---|---|
| ActorDataTable | 1096 | ActorDatas: 66 | UNDOCUMENTED mechanics; full data saved |
| AdvOneImageDataTable | 3032 | Data: 186 | UNDOCUMENTED mechanics; full data saved |
| AdvScriptDefCountData | 2380 | ScriptType: 5, Params: 37 | UNDOCUMENTED mechanics; full data saved |
| AracneBossDataAsset | 428 | _MadnessEffectBoneList: 4 | UNDOCUMENTED mechanics; full data saved |
| AriesBossDataAsset | 356 | _MadnessEffectBoneList: 4 | UNDOCUMENTED mechanics; full data saved |
| AudmuraBossDataAsset | 504 | _MadnessEffectBoneList: 3 | UNDOCUMENTED mechanics; full data saved |
| BaffamoFestivalMasterDataTable | 116 | BaffamoFestivalDataList: 3 | UNDOCUMENTED mechanics; full data saved |
| BasiliskBossDataAsset | 468 | _MadnessEffectBoneList: 4 | UNDOCUMENTED mechanics; full data saved |
| BattleConst | 1024 | scalar fields | UNDOCUMENTED mechanics; full data saved |
| BeanSowingActionDataTable | 5256 | ActionTermList: 118 | UNDOCUMENTED mechanics; full data saved |
| BeanSowingMasterDataTable | 96 | BeanDataList: 4 | UNDOCUMENTED mechanics; full data saved |
| BirthTalkData | 1204 | datas: 32 | Discussed at schema/table level |
| BitDataTableArray | 212 | DataTables: 3 | UNDOCUMENTED mechanics; full data saved |
| BlacksmithShop2Table | 1360 | ShopCatalogPages: 1, ShopNpcTalks: 10 | UNDOCUMENTED mechanics; full data saved |
| BlacksmithShopTable | 5380 | ShopCatalogPages: 11, ShopNpcTalks: 20 | UNDOCUMENTED mechanics; full data saved |
| BuildDataTable | 23440 | BuilderItemDatas: 96, FurnitureItemDatas: 61 | UNDOCUMENTED mechanics; full data saved |
| BuilderTable | 1372 | ShopCatalogPages: 0, ShopNpcTalks: 20 | UNDOCUMENTED mechanics; full data saved |
| BulletDataTableArray | 110656 | DataTables: 310 | UNDOCUMENTED mechanics; full data saved |
| BustupDataTable | 4992 | Datas: 46, DefaultMouthTables: 52 | UNDOCUMENTED mechanics; full data saved |
| ButtonGuideDatas | 2948 | DataSet: 84 | UNDOCUMENTED mechanics; full data saved |
| CerberusBossDataAsset | 192 | _MadnessEffectBoneList: 3, AttackPriorityList: 4, MadnessAttackPriorityList: 2 | UNDOCUMENTED mechanics; full data saved |
| CharaVoiceDataTableArray | 45100 | DataTables: 39 | UNDOCUMENTED mechanics; full data saved |
| CharacterCallingData | 4024 | datas: 32 | UNDOCUMENTED mechanics; full data saved |
| CharacterMoveSetting | 780 | scalar fields | UNDOCUMENTED mechanics; full data saved |
| CheerVoiceDataTable | 1240 | PlayerCheerVoiceData: 14, CheerVoiceDatas: 89 | UNDOCUMENTED mechanics; full data saved |
| ClothShopDataTableArray | 268 | DataTables: 13 | UNDOCUMENTED mechanics; full data saved |
| ConstData | 104 | DataTables: 14 | UNDOCUMENTED mechanics; full data saved |
| ConstFarm | 120 | scalar fields | Discussed at schema/table level |
| ConstMonster | 92 | scalar fields | UNDOCUMENTED mechanics; full data saved |
| CostumeDataTableArray | 380 | DataTables: 40 | UNDOCUMENTED mechanics; full data saved |
| CraftCategoryDataTable | 2892 | CraftCategoryDatas: 23 | Discussed at schema/table level |
| CraftGenreDataTableArray | 1724 | DataTables: 66 | Discussed at schema/table level |
| CraftTypeTableArray | 320 | DataTables: 18 | Discussed at schema/table level |
| CropDataTableArray | 49692 | DataTables: 185 | UNDOCUMENTED mechanics; full data saved |
| CrystalDataTableArray | 100 | DataTables: 5 | UNDOCUMENTED mechanics; full data saved |
| CrystalShop2Table | 1324 | ShopCatalogPages: 1, ShopNpcTalks: 10 | UNDOCUMENTED mechanics; full data saved |
| CrystalShopTable | 3404 | ShopCatalogPages: 4, ShopNpcTalks: 20 | UNDOCUMENTED mechanics; full data saved |
| DLCClothDataTable | 224 | DataTables: 12 | UNDOCUMENTED mechanics; full data saved |
| DeadtreeBossDataAsset | 332 | _MadnessEffectBoneList: 4, ActionList: 3, ExistBurrActionList: 4, MadnessActionList: 5, ExistBurrMadnessActionList: 5, DamageActionList: 3 | UNDOCUMENTED mechanics; full data saved |
| DeployCharDataTable | 232 | Chars: 22 | UNDOCUMENTED mechanics; full data saved |
| DeployTypeDataTable | 108 | Types: 13 | UNDOCUMENTED mechanics; full data saved |
| DeployWeatherDataTableArray | 220 | DataTables: 13 | UNDOCUMENTED mechanics; full data saved |
| DifficultyDataTable | 200 | DataTables: 4 | UNDOCUMENTED mechanics; full data saved |
| DirectSignDataTable | 1676 | datas: 6 | UNDOCUMENTED mechanics; full data saved |
| DoorDataTableArray | 960 | DataTables: 15 | UNDOCUMENTED mechanics; full data saved |
| DragonSisterBossDataAsset | 540 | _MadnessEffectBoneList: 4 | UNDOCUMENTED mechanics; full data saved |
| DropCapDataTableArray | 1276 | DataTables: 152 | UNDOCUMENTED mechanics; full data saved |
| DropSeedDataTableArray | 436 | DataTables: 47 | UNDOCUMENTED mechanics; full data saved |
| DualSkillDataTableArray | 396 | DataTables: 28 | Discussed at schema/table level |
| DualSmithActorDataTableArray | 1416 | DataTables: 26 | Discussed at schema/table level |
| DualWorkConst | 52 | scalar fields | Discussed at schema/table level |
| DualWorkDataTableArray | 284 | DataTables: 8 | Discussed at schema/table level |
| DualWorkSmithDataTableArray | 320 | DataTables: 8 | Discussed at schema/table level |
| EffectDataTableArray | 19784 | DataTables: 822 | UNDOCUMENTED mechanics; full data saved |
| EnemyPatrolData | 260 | PatrolParameterList: 3 | UNDOCUMENTED mechanics; full data saved |
| EnvironmentSoundDataTableArray | 2120 | DataTables: 27 | UNDOCUMENTED mechanics; full data saved |
| EquipItemDataTableArray | 214476 | DataTables: 567 | Discussed at schema/table level |
| EquipSubAttributeDataTableArray | 1332 | DataTables: 79 | UNDOCUMENTED mechanics; full data saved |
| EventConst | 48 | scalar fields | UNDOCUMENTED mechanics; full data saved |
| EventCycleData | 10280 | datas: 23 | UNDOCUMENTED mechanics; full data saved |
| EventFlagProgressData | 684 | datas: 12 | Discussed at schema/table level |
| EventPointData | 11400 | datas: 225 | UNDOCUMENTED mechanics; full data saved |
| EventUnlockData | 609748 | datas: 2628 | Discussed at schema/table level |
| FemaleNameDataTable | 332 | TextIDList: 69 | UNDOCUMENTED mechanics; full data saved |
| FesNpcScoreData | 1716 | datas: 26 | UNDOCUMENTED mechanics; full data saved |
| FestivalParamter | 80 | scalar fields | UNDOCUMENTED mechanics; full data saved |
| FieldFocusObjectDataTableArray | 452 | DataTables: 24 | UNDOCUMENTED mechanics; full data saved |
| FieldHideItemSpawnDataTableArray | 3716 | DataTables: 228 | UNDOCUMENTED mechanics; full data saved |
| FieldItemSpawnDataTableArray | 49744 | DataTables: 1380 | UNDOCUMENTED mechanics; full data saved |
| FieldRandomTreasureBoxSpawnDataTableArray | 26720 | DataTables: 555 | UNDOCUMENTED mechanics; full data saved |
| FieldSceneDataTable | 15528 | Datas: 127 | UNDOCUMENTED mechanics; full data saved |
| FieldTeleportDataTableArray | 31120 | DataTables: 256 | UNDOCUMENTED mechanics; full data saved |
| FieldUniqueTreasureBoxSpawnDataTableArray | 8868 | DataTables: 227 | UNDOCUMENTED mechanics; full data saved |
| FieldWoodBoxSpawnDataTableArray | 7820 | DataTables: 323 | UNDOCUMENTED mechanics; full data saved |
| FishData | 3116 | DataTables: 48 | UNDOCUMENTED mechanics; full data saved |
| FlowerShopTable | 2480 | ShopCatalogPages: 3, ShopNpcTalks: 10 | UNDOCUMENTED mechanics; full data saved |
| FocusObjectDataTableArray | 7708 | DataTables: 160 | UNDOCUMENTED mechanics; full data saved |
| FootStepDataTableArray | 15372 | DataTables: 29 | UNDOCUMENTED mechanics; full data saved |
| FriendNPCActionBehaviorDataTable | 12008 | CommandParameterList_Bool: 11, CommandParameterList_Int: 160, CommandParameterList_Float: 387, CommandParameterList_String: 30, CommandParameterList_Vector2: 0, CommandParameterList_Vector3: 0, DataList: 201 | UNDOCUMENTED mechanics; full data saved |
| FriendNPCBehaviorDataTable | 53388 | DataTables: 29 | UNDOCUMENTED mechanics; full data saved |
| FriendNPCFindTargetDataTable | 1648 | DataTables: 66 | UNDOCUMENTED mechanics; full data saved |
| FriendParamDataTableArray | 436 | DataTables: 31 | Discussed at schema/table level |
| FurnitureData | 3276 | DataTables: 62 | UNDOCUMENTED mechanics; full data saved |
| FurnitureTable | 1376 | ShopCatalogPages: 0, ShopNpcTalks: 20 | UNDOCUMENTED mechanics; full data saved |
| GandageBossDataAsset | 1404 | _MadnessEffectBoneList: 1 | UNDOCUMENTED mechanics; full data saved |
| GansekiDragonBossDataAsset | 580 | _MadnessEffectBoneList: 5 | UNDOCUMENTED mechanics; full data saved |
| GateDataTableArray | 17120 | DataTables: 602 | UNDOCUMENTED mechanics; full data saved |
| GateStatusDataTableArray | 58872 | DataTables: 607 | UNDOCUMENTED mechanics; full data saved |
| GimmickLayoutDataTableArray | 9376 | DataTables: 1164 | UNDOCUMENTED mechanics; full data saved |
| GluttonBonusDataTable | 100 | GluttonBonusList: 10 | UNDOCUMENTED mechanics; full data saved |
| GluttonDataTable | 388 | GluttonDataList: 5 | UNDOCUMENTED mechanics; full data saved |
| GluttonLotteryDataTable | 732 | TermList: 14 | UNDOCUMENTED mechanics; full data saved |
| GomiData | 124 | DataTables: 5 | UNDOCUMENTED mechanics; full data saved |
| HarinezumiBossDataAsset | 456 | _MadnessEffectBoneList: 4 | UNDOCUMENTED mechanics; full data saved |
| HasibirokouBossDataAsset | 452 | _MadnessEffectBoneList: 4 | UNDOCUMENTED mechanics; full data saved |
| HekatonkeilBossDataAsset | 424 | _MadnessEffectBoneList: 3 | UNDOCUMENTED mechanics; full data saved |
| HintDataTable | 1228 | DataTable: 55 | UNDOCUMENTED mechanics; full data saved |
| HitOptionParamDataTableArray | 103572 | DataTables: 229 | UNDOCUMENTED mechanics; full data saved |
| HitSoundDataTableArray | 636 | DataTables: 18 | UNDOCUMENTED mechanics; full data saved |
| HospitalTable | 2576 | ShopCatalogPages: 1, ShopNpcTalks: 30 | UNDOCUMENTED mechanics; full data saved |
| HotSpringDataTableArray | 428 | DataTables: 6 | UNDOCUMENTED mechanics; full data saved |
| HumanActionDataTableArray | 10640 | DataTables: 401 | UNDOCUMENTED mechanics; full data saved |
| HumanDataTable | 20168 | HumanDatas: 39 | UNDOCUMENTED mechanics; full data saved |
| HumanParamDataTableArray | 13476 | DataTables: 43 | UNDOCUMENTED mechanics; full data saved |
| InosisiBossDataAsset | 392 | _MadnessEffectBoneList: 4 | UNDOCUMENTED mechanics; full data saved |
| ItemConst | 56 | scalar fields | UNDOCUMENTED mechanics; full data saved |
| ItemDataTableArray | 163196 | DataTables: 1174 | Discussed at schema/table level |
| ItemLevelData | 272 | DataTables: 11 | UNDOCUMENTED mechanics; full data saved |
| ItemLevelWeightDataTableArray | 572 | DataTables: 9 | UNDOCUMENTED mechanics; full data saved |
| ItemLotteryDataTableArray | 4264 | DataTables: 40 | UNDOCUMENTED mechanics; full data saved |
| ItemLotteryWeightDataTableArray | 5244 | DataTables: 106 | UNDOCUMENTED mechanics; full data saved |
| ItemStrengtheningDataTableArray | 931704 | DataTables: 1152 | Discussed at schema/table level |
| KamereonBossDataAsset | 428 | _MadnessEffectBoneList: 4 | UNDOCUMENTED mechanics; full data saved |
| KrakenBossDataAsset | 488 | _MadnessEffectBoneList: 4 | UNDOCUMENTED mechanics; full data saved |
| KurageBossDataAsset | 504 | _MadnessEffectBoneList: 4 | UNDOCUMENTED mechanics; full data saved |
| KyubiBossDataAsset | 376 | _MadnessEffectBoneList: 4 | UNDOCUMENTED mechanics; full data saved |
| LastBossBossDataAsset | 588 | _MadnessEffectBoneList: 4 | UNDOCUMENTED mechanics; full data saved |
| MAS_Aracne_ActionCodeArray | 53108 | ActionCodeDataTables: 28 | UNDOCUMENTED mechanics; full data saved |
| MAS_Aries_ActionCodeArray | 131380 | ActionCodeDataTables: 45 | UNDOCUMENTED mechanics; full data saved |
| MAS_Audmura_ActionCodeArray | 60344 | ActionCodeDataTables: 36 | UNDOCUMENTED mechanics; full data saved |
| MAS_Baffamo_ActionCodeArray | 29796 | ActionCodeDataTables: 11 | UNDOCUMENTED mechanics; full data saved |
| MAS_Basilisk_ActionCodeArray | 114556 | ActionCodeDataTables: 29 | UNDOCUMENTED mechanics; full data saved |
| MAS_BigMash_ActionCodeArray | 17172 | ActionCodeDataTables: 11 | UNDOCUMENTED mechanics; full data saved |
| MAS_Cat_ActionCodeArray | 7816 | ActionCodeDataTables: 8 | UNDOCUMENTED mechanics; full data saved |
| MAS_Cerberus_ActionCodeArray | 68420 | ActionCodeDataTables: 25 | UNDOCUMENTED mechanics; full data saved |
| MAS_Chirori_ActionCodeArray | 25440 | ActionCodeDataTables: 13 | UNDOCUMENTED mechanics; full data saved |
| MAS_Cokehohho_ActionCodeArray | 21228 | ActionCodeDataTables: 11 | UNDOCUMENTED mechanics; full data saved |
| MAS_Deadtree_ActionCodeArray | 162984 | ActionCodeDataTables: 40 | UNDOCUMENTED mechanics; full data saved |
| MAS_Dog_ActionCodeArray | 14416 | ActionCodeDataTables: 8 | UNDOCUMENTED mechanics; full data saved |
| MAS_DragonSister_ActionCodeArray | 40932 | ActionCodeDataTables: 23 | UNDOCUMENTED mechanics; full data saved |
| MAS_Duck_ActionCodeArray | 16648 | ActionCodeDataTables: 12 | UNDOCUMENTED mechanics; full data saved |
| MAS_Elepan_ActionCodeArray | 23768 | ActionCodeDataTables: 13 | UNDOCUMENTED mechanics; full data saved |
| MAS_Fairy_ActionCodeArray | 42716 | ActionCodeDataTables: 25 | UNDOCUMENTED mechanics; full data saved |
| MAS_Flower_ActionCodeArray | 18952 | ActionCodeDataTables: 12 | UNDOCUMENTED mechanics; full data saved |
| MAS_Gandage_ActionCodeArray | 96272 | ActionCodeDataTables: 49 | UNDOCUMENTED mechanics; full data saved |
| MAS_GansekiDragon_ActionCodeArray | 72620 | ActionCodeDataTables: 32 | UNDOCUMENTED mechanics; full data saved |
| MAS_Ghost_ActionCodeArray | 22404 | ActionCodeDataTables: 17 | UNDOCUMENTED mechanics; full data saved |
| MAS_Goblin_ActionCodeArray | 23944 | ActionCodeDataTables: 21 | UNDOCUMENTED mechanics; full data saved |
| MAS_Golem_ActionCodeArray | 22048 | ActionCodeDataTables: 15 | UNDOCUMENTED mechanics; full data saved |
| MAS_Griffon_ActionCodeArray | 14456 | ActionCodeDataTables: 12 | UNDOCUMENTED mechanics; full data saved |
| MAS_Harinezumi_ActionCodeArray | 164336 | ActionCodeDataTables: 20 | UNDOCUMENTED mechanics; full data saved |
| MAS_Hasibirokou_ActionCodeArray | 64948 | ActionCodeDataTables: 34 | UNDOCUMENTED mechanics; full data saved |
| MAS_Hekatonkeil_ActionCodeArray | 176836 | ActionCodeDataTables: 55 | UNDOCUMENTED mechanics; full data saved |
| MAS_Hornet_ActionCodeArray | 20740 | ActionCodeDataTables: 15 | UNDOCUMENTED mechanics; full data saved |
| MAS_Ignis_ActionCodeArray | 50496 | ActionCodeDataTables: 36 | UNDOCUMENTED mechanics; full data saved |
| MAS_Inosisi_ActionCodeArray | 100552 | ActionCodeDataTables: 21 | UNDOCUMENTED mechanics; full data saved |
| MAS_Insect_ActionCodeArray | 13016 | ActionCodeDataTables: 8 | UNDOCUMENTED mechanics; full data saved |
| MAS_Kamereon_ActionCodeArray | 37652 | ActionCodeDataTables: 15 | UNDOCUMENTED mechanics; full data saved |
| MAS_Kerori_ActionCodeArray | 12944 | ActionCodeDataTables: 11 | UNDOCUMENTED mechanics; full data saved |
| MAS_Kraken_ActionCodeArray | 79068 | ActionCodeDataTables: 40 | UNDOCUMENTED mechanics; full data saved |
| MAS_Kurage_ActionCodeArray | 67780 | ActionCodeDataTables: 28 | UNDOCUMENTED mechanics; full data saved |
| MAS_Kyubi_ActionCodeArray | 36092 | ActionCodeDataTables: 19 | UNDOCUMENTED mechanics; full data saved |
| MAS_LastBoss_ActionCodeArray | 82172 | ActionCodeDataTables: 31 | UNDOCUMENTED mechanics; full data saved |
| MAS_MiniDragon_ActionCodeArray | 41552 | ActionCodeDataTables: 27 | UNDOCUMENTED mechanics; full data saved |
| MAS_Mocomoco_ActionCodeArray | 9664 | ActionCodeDataTables: 5 | UNDOCUMENTED mechanics; full data saved |
| MAS_Monsterbox_ActionCodeArray | 10364 | ActionCodeDataTables: 11 | UNDOCUMENTED mechanics; full data saved |
| MAS_Mummy_ActionCodeArray | 68340 | ActionCodeDataTables: 43 | UNDOCUMENTED mechanics; full data saved |
| MAS_Ork_ActionCodeArray | 22880 | ActionCodeDataTables: 19 | UNDOCUMENTED mechanics; full data saved |
| MAS_Ouroboros_ActionCodeArray | 88344 | ActionCodeDataTables: 41 | UNDOCUMENTED mechanics; full data saved |
| MAS_Palmcat_ActionCodeArray | 17692 | ActionCodeDataTables: 10 | UNDOCUMENTED mechanics; full data saved |
| MAS_Panther_ActionCodeArray | 23416 | ActionCodeDataTables: 11 | UNDOCUMENTED mechanics; full data saved |
| MAS_Pengi_ActionCodeArray | 14988 | ActionCodeDataTables: 10 | UNDOCUMENTED mechanics; full data saved |
| MAS_Reviatan_ActionCodeArray | 66500 | ActionCodeDataTables: 30 | UNDOCUMENTED mechanics; full data saved |
| MAS_Salene_ActionCodeArray | 22416 | ActionCodeDataTables: 17 | UNDOCUMENTED mechanics; full data saved |
| MAS_Sasquatch_ActionCodeArray | 47936 | ActionCodeDataTables: 24 | UNDOCUMENTED mechanics; full data saved |
| MAS_Sheila_ActionCodeArray | 14712 | ActionCodeDataTables: 14 | UNDOCUMENTED mechanics; full data saved |
| MAS_SkullDragon_ActionCodeArray | 101364 | ActionCodeDataTables: 23 | UNDOCUMENTED mechanics; full data saved |
| MAS_Slime_ActionCodeArray | 10752 | ActionCodeDataTables: 8 | UNDOCUMENTED mechanics; full data saved |
| MAS_Spider_ActionCodeArray | 15124 | ActionCodeDataTables: 14 | UNDOCUMENTED mechanics; full data saved |
| MAS_Troll_ActionCodeArray | 20364 | ActionCodeDataTables: 15 | UNDOCUMENTED mechanics; full data saved |
| MAS_Wizard_ActionCodeArray | 32576 | ActionCodeDataTables: 25 | UNDOCUMENTED mechanics; full data saved |
| MAS_Wolf_ActionCodeArray | 20104 | ActionCodeDataTables: 11 | UNDOCUMENTED mechanics; full data saved |
| MAS_WoodGolem_ActionCodeArray | 45984 | ActionCodeDataTables: 25 | UNDOCUMENTED mechanics; full data saved |
| MAS_Yadokari_ActionCodeArray | 105080 | ActionCodeDataTables: 32 | UNDOCUMENTED mechanics; full data saved |
| MAS_YasaiMonster_ActionCodeArray | 52912 | ActionCodeDataTables: 33 | UNDOCUMENTED mechanics; full data saved |
| MagicDataTableArray | 22988 | DataTables: 247 | UNDOCUMENTED mechanics; full data saved |
| MagicParamDataTableArray | 198252 | DataTables: 349 | UNDOCUMENTED mechanics; full data saved |
| MainEventFlagProgressData | 4560 | datas: 281 | Discussed at schema/table level |
| MaleNameDataTable | 348 | TextIDList: 73 | UNDOCUMENTED mechanics; full data saved |
| MineTypeDataTableArray | 2696 | DataTables: 29 | UNDOCUMENTED mechanics; full data saved |
| MiningDataTableArray | 23540 | DataTables: 422 | UNDOCUMENTED mechanics; full data saved |
| ModelScaleDataTable | 296 | ModelScaleDataList: 30 | UNDOCUMENTED mechanics; full data saved |
| MonsterActionBehaviorDataTable | 7088 | CommandParameterList_Bool: 19, CommandParameterList_Int: 137, CommandParameterList_Float: 207, CommandParameterList_String: 4, CommandParameterList_Vector2: 0, CommandParameterList_Vector3: 0, DataList: 100 | UNDOCUMENTED mechanics; full data saved |
| MonsterBehaviorDataTableArray | 160028 | DataTables: 209 | UNDOCUMENTED mechanics; full data saved |
| MonsterDamageInfoDataTableArray | 76828 | DataTables: 505 | UNDOCUMENTED mechanics; full data saved |
| MonsterDataTableArray | 121192 | DataTables: 273 | UNDOCUMENTED mechanics; full data saved |
| MonsterDropItemDataTableArray | 15724 | DataTables: 238 | Discussed at schema/table level |
| MonsterFootStepEventDataTableArray | 5592 | DataTables: 60 | UNDOCUMENTED mechanics; full data saved |
| MonsterModelDataTable | 10500 | MonsterModelDatas: 261 | UNDOCUMENTED mechanics; full data saved |
| MonsterParamDataTableArray | 5160 | DataTables: 26 | UNDOCUMENTED mechanics; full data saved |
| MonsterUIDataTable | 33544 | datas: 239 | UNDOCUMENTED mechanics; full data saved |
| MoveParamDataTable | 2488 | scalar fields | UNDOCUMENTED mechanics; full data saved |
| MovieRoomDataTable | 4244 | MovieRoomDataList: 39 | UNDOCUMENTED mechanics; full data saved |
| MummyBossDataAsset | 360 | _MadnessEffectBoneList: 4 | UNDOCUMENTED mechanics; full data saved |
| NPCSkillLevelDataTableArray | 7120 | DataTables: 42 | Discussed at schema/table level |
| NPCUIDataTable | 628 | datas: 36 | UNDOCUMENTED mechanics; full data saved |
| NicknameDataTable | 316 | TextIDList: 65 | UNDOCUMENTED mechanics; full data saved |
| NpcStatusDataTable | 17116 | NpcStatusDatas: 30 | Discussed at schema/table level |
| OrderMasterDataTable | 133852 | NpcDatas: 267, PoliceDatas: 111, TanteiDatas: 111 | UNDOCUMENTED mechanics; full data saved |
| OuroborosBossDataAsset | 420 | _MadnessEffectBoneList: 4 | UNDOCUMENTED mechanics; full data saved |
| PartnerNPCWeaponBehaviorDataTable | 296 | DataTables: 14 | UNDOCUMENTED mechanics; full data saved |
| PersonalMotionDataTableArray | 1492 | DataTables: 29 | UNDOCUMENTED mechanics; full data saved |
| PetNpcPetDataTable | 520 | DataList: 29 | UNDOCUMENTED mechanics; full data saved |
| PlayerActionScriptDataTable | 880556 | ActionCodeDataTables: 697 | UNDOCUMENTED mechanics; full data saved |
| PlayerParameterDataTableArray | 39268 | DataTables: 200 | UNDOCUMENTED mechanics; full data saved |
| PointData | 19104 | DataTables: 339 | UNDOCUMENTED mechanics; full data saved |
| PresentItemCategoryLotteryDataTableArray | 1348 | DataTables: 37 | Discussed at schema/table level |
| PresentItemParamDataTableArray | 42892 | DataTables: 193, PresentMonsterCategoryTables: 26 | Discussed at schema/table level |
| RecipeData | 26060 | RecipeDatas: 663 | Discussed at schema/table level |
| RecipePanCountDataTableArray | 160 | DataTables: 8 | Discussed at schema/table level |
| RecipePanShopDataTableArray | 184 | DataTables: 6 | Discussed at schema/table level |
| RestaurentTable | 1956 | ShopCatalogPages: 1, ShopNpcTalks: 20 | UNDOCUMENTED mechanics; full data saved |
| ReviatanBossDataAsset | 436 | _MadnessEffectBoneList: 5, RecoveryPercents: 4 | UNDOCUMENTED mechanics; full data saved |
| SasquatchBossDataAsset | 404 | _MadnessEffectBoneList: 4 | UNDOCUMENTED mechanics; full data saved |
| ScenarioTalkData | 692 | datas: 16 | Discussed at schema/table level |
| SeedSupportDataTableArray | 160 | DataTables: 4 | UNDOCUMENTED mechanics; full data saved |
| SeriousEventScriptsData | 6352 | datas: 4 | UNDOCUMENTED mechanics; full data saved |
| ShopRandomItemTable | 6268 | RandomIdLists: 15, datas: 17 | UNDOCUMENTED mechanics; full data saved |
| SkillActionDataTableArray | 47924 | DataTables: 411 | Discussed at schema/table level |
| SkillDataTableArray | 8012 | DataTables: 39 | Discussed at schema/table level |
| SkillLevelupTypeDataTableArray | 2088 | DataTables: 5 | Discussed at schema/table level |
| SkullDragonBossDataAsset | 308 | _MadnessEffectBoneList: 5, ActionList: 4, FilledTailDamageActionList: 4, MadnessActionList: 6 | UNDOCUMENTED mechanics; full data saved |
| SnowballDataTable | 180 | SnowballDataList: 5, MocomocoDataList: 2 | UNDOCUMENTED mechanics; full data saved |
| SnowballObjectSpawnDataTable | 12352 | SpawnTermList: 6 | UNDOCUMENTED mechanics; full data saved |
| StampDataTable | 5732 | StampDataList: 81 | UNDOCUMENTED mechanics; full data saved |
| StrengtheningEtcDataTableArray | 8132 | DataTables: 42 | Discussed at schema/table level |
| SubEventData | 69408 | Datas: 204 | Discussed at schema/table level |
| SubEventFlagProgressData | 852 | scalar fields | Discussed at schema/table level |
| SubtitleHud | 77256 | datas: 6434 | UNDOCUMENTED mechanics; full data saved |
| SubtitleMovie | 2764 | datas: 39 | UNDOCUMENTED mechanics; full data saved |
| SubtitleVoiceComment | 12048 | datas: 34 | UNDOCUMENTED mechanics; full data saved |
| TalkDataTable | 1004 | scalar fields | UNDOCUMENTED mechanics; full data saved |
| TimeConst | 48 | scalar fields | UNDOCUMENTED mechanics; full data saved |
| TimeScaleDataTableArray | 664 | DataTables: 5 | UNDOCUMENTED mechanics; full data saved |
| TrackingCameraSetting | 276 | scalar fields | UNDOCUMENTED mechanics; full data saved |
| TutorialUnlockData | 1040 | datas: 82 | UNDOCUMENTED mechanics; full data saved |
| UILoveEventConvTextData | 10476 | CharaID: 520, GameFlagID: 520, Number: 520, STEP: 520, TextID: 520 | Discussed at schema/table level |
| UIMainEventConvTextData | 1188 | ConvertTextTable: 282 | UNDOCUMENTED mechanics; full data saved |
| UINextTargetData | 1180 | ConvertTextTable: 282 | UNDOCUMENTED mechanics; full data saved |
| UISubEventConvTextData | 3800 | GameFlagID: 233, Number: 233, STEP: 233, TextID: 233 | UNDOCUMENTED mechanics; full data saved |
| UseParamDataTableArray | 211812 | DataTables: 346 | UNDOCUMENTED mechanics; full data saved |
| VaccinationDataTableArray | 540 | DataTables: 7 | UNDOCUMENTED mechanics; full data saved |
| VarietyShop2Table | 1276 | ShopCatalogPages: 1, ShopNpcTalks: 10 | UNDOCUMENTED mechanics; full data saved |
| VarietyShopTable | 5752 | ShopCatalogPages: 4, ShopNpcTalks: 50 | UNDOCUMENTED mechanics; full data saved |
| VoiceCommentDataTable | 196 | VoiceCommentDataList: 34 | UNDOCUMENTED mechanics; full data saved |
| VoiceGroupDataTableArray | 908 | DataTables: 106 | UNDOCUMENTED mechanics; full data saved |
| WantedDatas | 1496 | wantedDatas: 15, randomWantedForestDatas: 3, randomWantedVolcanoDatas: 3, randomWantedIcyDatas: 3, RewardDatas: 15, RandomRewardDatas: 48 | UNDOCUMENTED mechanics; full data saved |
| WarpPointData | 14964 | datas: 94 | UNDOCUMENTED mechanics; full data saved |
| WoodGolemBossDataAsset | 468 | _MadnessEffectBoneList: 5 | UNDOCUMENTED mechanics; full data saved |
| YadokariBossDataAsset | 396 | _MadnessEffectBoneList: 3 | UNDOCUMENTED mechanics; full data saved |
| motiontable_10 | 95360 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_11 | 95328 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_12 | 95836 | PatrolPointMotionDatas: 496 | UNDOCUMENTED mechanics; full data saved |
| motiontable_13 | 95488 | PatrolPointMotionDatas: 496 | UNDOCUMENTED mechanics; full data saved |
| motiontable_14 | 92684 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_15 | 89988 | PatrolPointMotionDatas: 491 | UNDOCUMENTED mechanics; full data saved |
| motiontable_16 | 95344 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_17 | 95344 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_18 | 92548 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_19 | 92548 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_2 | 93076 | PatrolPointMotionDatas: 497 | UNDOCUMENTED mechanics; full data saved |
| motiontable_20 | 92748 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_21 | 95460 | PatrolPointMotionDatas: 496 | UNDOCUMENTED mechanics; full data saved |
| motiontable_22 | 92740 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_24 | 92740 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_26 | 93772 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_27 | 92684 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_28 | 92692 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_29 | 92696 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_3 | 93164 | PatrolPointMotionDatas: 497 | UNDOCUMENTED mechanics; full data saved |
| motiontable_30 | 92696 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_31 | 92696 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_32 | 92804 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_33 | 92804 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_4 | 92788 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_5 | 92740 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_6 | 93060 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_7 | 92768 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_8 | 95360 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |
| motiontable_9 | 95168 | PatrolPointMotionDatas: 495 | UNDOCUMENTED mechanics; full data saved |

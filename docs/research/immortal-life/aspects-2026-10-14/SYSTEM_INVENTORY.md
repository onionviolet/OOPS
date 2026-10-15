# System inventory

2026-10-14. Discovery census: 296 TextAssets (291 JSON parsed),1,261 dialogue graphs and203 top-level application manager/controller types. Counts describe discovered assets/types, not played systems. Every discovered table is listed below, including empty, legacy/test and parse-gap assets. Every discovered application manager/controller is also listed; UI widgets are represented by their parent systems rather than claimed as independent mechanics. Full class census stays private.

No whole-build semantic completeness claim: scene-only components, unrecovered message graphs and native indirect callers can add subsystems. Status remains PARTIAL.

## System families and prior coverage

| Code | System/subsystem | Location and size signal | Documentation state |
|---|---|---|---|
| S01 | Conversations, choice memory, localization | Dialog275; Language19775;1261 graphs; DialogController/PanelNPCInteractNew | Prior schema fragments; A01 deepened here |
| S02 | Quests, triggers, journals, letters, timelines | Task393; Trigger413; PaperBird264; TaskHandBook58; SceneTimelines | Prior selected events; A02 structure; letter graphs unread |
| S03 | Persistence and compatibility | SaveManager; MapoTofu.SaveData; controller SaveData calls; version data | Previously no native digest; A04 deepened here |
| S04 | Realm, preparation, professions, courses | Level7; LifeSkillLevel90; Course20; Study14; Exercise6 | Prior cultivation and80-entry deep pass |
| S05 | NPC schedules, work, favor, roommate stays | NPC67; NPCSchedule371; Marry12; MarryEvent60; Behaviour | Prior selected native paths; A01 extends remembered dialogue |
| S06 | Combat, monsters, equipment, elements, effects | FightSkill158; Weapon; CollectMonster; FiveElements6; BattleBuffData344; BattleFX | Prior trial wave path; most combat unread |
| S07 | Farming, crop quality, pest, magic plants, irrigation | Crop37; CropPack; SeedQuality; InsectPest; MagicPlant6; AutoWater4 | Prior irrigation mention; most consumers undocumented |
| S08 | Gathering, mines, realms, travel and maps | Collect/CollectArea_*; SecretArea_*; New_Karst*; Mining; Scenes112; Path; Portals; Teleport | Prior discovery; full encounter semantics undocumented |
| S09 | Cooking, intermediate workstations, quality, hosted meals | Cooking83; CookingGame61; CookingMiddleware283; CookingProcessing9; Treat*; MenuInn | D2 new; hosted meals remain partial |
| S10 | Alchemy control, oven modifiers, mutation, quality | AlchemyRecipe65; AlchemyOven21; Alchemy18; AlchemyMiddleware70 | D1 new; older system and all payout consumers partial |
| S11 | Smelting, fuel, cancel/refund, queued output | SmelterRecipe3; SmelterLevel2; Fuel4; SmelterManager | D3 new; fuel refill/affordability/persistence acceptance unread |
| S12 | Workshop, production buildings and forging | Build16; BuildProduction4; ProductionTool; Forge; WorkShopController | Prior categories; detailed native consumers undocumented |
| S13 | Animals, cocoons, hives, honey, pets | Cocoonery; HiveConfig; Honey*; Pet1; SpiritAnimalConfig | Inventory only; mostly undocumented |
| S14 | Housing, decoration, styles, placement, save points | Room; RoomStyle; Decoration; Decorate; Build; SavePoint6 | Prior roommate access; placement/Decorate parser unread |
| S15 | Economy, storage, shops, exchanges, orders, offers | Item1849; Storage; Bag; Shop; NoFixedShop; ExchangeShop; OrderTask; *OfferReward | Inventory/schema only; most contracts undocumented |
| S16 | Sect, salary, renown, contribution, routes, specialists | School; SchoolDevelopment4; SchoolSalary64; SchoolRenown5; AlienMinister; BusinessRoad; Delegation3 | Prior selected data/native realm reporting; not a war economy |
| S17 | Prayer, blessings, deity progression | Pray11; GodnessLevel12; GodnessManager | Prior data; probability/duration consumers undocumented |
| S18 | Fishing, rods, points, QTE | Fishing59; FishingRod; FishingPoint; FishingQTE; FishingRule | Inventory only; undocumented mechanics |
| S19 | Collections, handbook, achievements and unlocks | HandBook1219; HandBookObjectType; SteamAchievements72; SchoolUnlockGroup42 | A10/A12 inventory; full completion semantics unread |
| S20 | Calendar, festivals, races, quizzes, minigames | Solarterm; Hour; TimeInterval; DragonBoatRace*; Question72; FindDifference*; CraneGame; Plumber* | Prior puzzle distinction; others mostly undocumented |
| S21 | Presentation, controls, audio, cameras, rendering | Input13; KeyIcon; FX43; LoadingImage; ComicSequence; InControl; CriWare; Cinemachine | A06/A11 static surfaces; played UI/performance unread |
| S22 | Authoring, condition interpreter and command dispatch | JsonAsset/HashKey; ConfigManager; GameExpression; ICommander; GUID graphs | A03/A07 deepened; editor/mod API unread |

## Every recovered TextAsset

Locations are resources.assets plus the path ID. Size signal is root-entry count for parsed JSON, not always record rows. The complete field list and SHA256 are in private extract/table-inventory.json. Prior selected means data/schema coverage in the first lane, not native or whole-table semantics.

| Asset/table | Path ID | Root entries | State |
|---|---:|---:|---|
| Alchemy | 17251 | 18 | UNDOCUMENTED: discovery only |
| AlchemyConfig | 17217 | 4 | D1-D3 selected data/native |
| AlchemyGrade | 17121 | 4 | UNDOCUMENTED: discovery only |
| AlchemyMiddleware | 17221 | 70 | UNDOCUMENTED: discovery only |
| AlchemyOven | 17004 | 21 | D1-D3 selected data/native |
| AlchemyProcessing | 17053 | 5 | UNDOCUMENTED: discovery only |
| AlchemyRecipe | 16983 | 65 | D1-D3 selected data/native |
| AlienMinister | 17032 | 4 | UNDOCUMENTED: discovery only |
| AnswerReward | 17109 | 4 | UNDOCUMENTED: discovery only |
| AutoWater | 17173 | 4 | prior selected data/schema |
| Bag | 17128 | 17 | UNDOCUMENTED: discovery only |
| Barrier | 17213 | 33 | UNDOCUMENTED: discovery only |
| BattleBuffData | 17046 | 344 | UNDOCUMENTED: discovery only |
| BattleFX | 17244 | 404 | UNDOCUMENTED: discovery only |
| Bed | 17130 | 10 | UNDOCUMENTED: discovery only |
| Behaviour | 17161 | 215 | UNDOCUMENTED: discovery only |
| Billboard | 16986 | 10 | UNDOCUMENTED: discovery only |
| BillboardTypeWeight | 17160 | 3 | UNDOCUMENTED: discovery only |
| Breakthrough | 17039 | 9 | prior selected data/schema |
| BreakthroughMapConfig | 17077 | 4 | prior selected data/schema |
| BreakthroughMaps | 17016 | 4 | prior selected data/schema |
| Buff | 17233 | 9 | UNDOCUMENTED: discovery only |
| Build | 17250 | 16 | UNDOCUMENTED: discovery only |
| BuildProduction | 17059 | 4 | UNDOCUMENTED: discovery only |
| BusinessRoad | 17222 | 15 | UNDOCUMENTED: discovery only |
| CanFangSetting | 17097 | 9 | UNDOCUMENTED: discovery only |
| CanToJian | 17164 | 1 | UNDOCUMENTED: discovery only |
| ChangableSceneObject | 17013 | 32 | UNDOCUMENTED: discovery only |
| ChangeLog | 16965 | 51 | UNDOCUMENTED: discovery only |
| ChangeStyle | 17138 | 31 | UNDOCUMENTED: discovery only |
| ClassSchedule | 17105 | 4 | prior selected data/schema |
| Cocoonery | 17030 | 4 | UNDOCUMENTED: discovery only |
| Collect | 17114 | 64 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst1 | 17200 | 12 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst10 | 17118 | 22 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst11 | 17093 | 22 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst12 | 17018 | 24 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst13 | 17181 | 24 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst14 | 17102 | 23 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst15 | 17124 | 23 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst1_0 | 17025 | 8 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst1_1 | 17218 | 9 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst1_10 | 17041 | 9 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst1_2 | 16993 | 9 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst1_3 | 17064 | 9 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst1_4 | 17127 | 9 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst1_5 | 17169 | 9 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst1_6 | 17219 | 9 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst1_7 | 17040 | 9 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst1_8 | 17107 | 9 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst1_9 | 17006 | 9 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst1_boss | 17063 | 9 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst1_lobby | 17159 | 9 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst2 | 16995 | 21 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst3 | 17184 | 24 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst4 | 17158 | 19 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst5 | 17091 | 20 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst6 | 17153 | 25 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst7 | 17106 | 25 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst8 | 17170 | 24 | UNDOCUMENTED: discovery only |
| CollectArea_ Karst9 | 17150 | 18 | UNDOCUMENTED: discovery only |
| CollectArea_ Xiezhaolin_1 | 17078 | 4 | UNDOCUMENTED: discovery only |
| CollectArea_ Xiezhaolin_2 | 16999 | 5 | UNDOCUMENTED: discovery only |
| CollectArea_ Xiezhaolin_5 | 16971 | 15 | UNDOCUMENTED: discovery only |
| CollectArea_Cave1 | 17067 | 11 | UNDOCUMENTED: discovery only |
| CollectArea_duzhao_1 | 17022 | 9 | UNDOCUMENTED: discovery only |
| CollectArea_Karst8_Boss | 16979 | 8 | UNDOCUMENTED: discovery only |
| CollectArea_Lake1 | 17113 | 4 | UNDOCUMENTED: discovery only |
| CollectArea_Mine1 | 17082 | 10 | UNDOCUMENTED: discovery only |
| CollectArea_Mine1_1 | 17205 | 10 | UNDOCUMENTED: discovery only |
| CollectArea_Mine1_2 | 16957 | 10 | UNDOCUMENTED: discovery only |
| CollectArea_Mine1_3 | 17000 | 10 | UNDOCUMENTED: discovery only |
| CollectArea_Mine2_1 | 17224 | 8 | UNDOCUMENTED: discovery only |
| CollectArea_Mine2_2 | 17225 | 8 | UNDOCUMENTED: discovery only |
| CollectArea_Mine2_3 | 17223 | 8 | UNDOCUMENTED: discovery only |
| CollectArea_Mountain1 | 17092 | 15 | UNDOCUMENTED: discovery only |
| CollectArea_Woods1 | 17043 | 12 | UNDOCUMENTED: discovery only |
| CollectMonster | 17019 | 104 | UNDOCUMENTED: discovery only |
| CollectPoint | 16975 | 244 | UNDOCUMENTED: discovery only |
| ComicSequence | 17024 | 1 | UNDOCUMENTED: discovery only |
| Cooking | 16991 | 83 | D1-D3 selected data/native |
| CookingGame | 17144 | 61 | D1-D3 selected data/native |
| CookingGrade | 17087 | 4 | D1-D3 selected data/native |
| CookingLevelCoefficient | 17216 | 15 | D1-D3 selected data/native |
| CookingMiddleware | 17036 | 283 | D1-D3 selected data/native |
| CookingProcessing | 17137 | 9 | D1-D3 selected data/native |
| Course | 17176 | 20 | prior selected data/schema |
| CourseRule | 16962 | 7 | prior selected data/schema |
| CraneGame | 17068 | 2 | UNDOCUMENTED: discovery only |
| Crop | 17187 | 37 | UNDOCUMENTED: discovery only |
| CropPack | 17208 | 1 | UNDOCUMENTED: discovery only |
| Decorate | 17243 | unparsed | parse gap, retained raw |
| Decoration | 17186 | 760 | UNDOCUMENTED: discovery only |
| Delegation | 17079 | 3 | prior selected data/schema |
| Description | 17157 | 14 | UNDOCUMENTED: discovery only |
| Dialog | 17185 | 275 | aspect structure/count read |
| DragonBoatRace | 17171 | 8 | UNDOCUMENTED: discovery only |
| DragonBoatRaceDeploy | 17099 | 3 | UNDOCUMENTED: discovery only |
| DragonBoatRaceRank | 16968 | 3 | UNDOCUMENTED: discovery only |
| DragonBoatRaceRule | 17147 | 13 | UNDOCUMENTED: discovery only |
| Dress | 17142 | 142 | UNDOCUMENTED: discovery only |
| EffectiveItem | 16966 | 18 | UNDOCUMENTED: discovery only |
| ExchangeShop | 17125 | 10 | UNDOCUMENTED: discovery only |
| Exercise | 17149 | 6 | prior selected data/schema |
| FavourLevels | 17066 | 6 | prior selected data/schema |
| FavourLv | 17083 | 4 | prior selected data/schema |
| FestivalFindDifference | 17095 | 2 | UNDOCUMENTED: discovery only |
| Fight | 17084 | 4 | UNDOCUMENTED: discovery only |
| Fight_Test | 17174 | 55 | UNDOCUMENTED: discovery only |
| FightSkill | 17111 | 158 | prior selected data/schema |
| FindDifference | 17002 | 16 | UNDOCUMENTED: discovery only |
| FindDifferenceReward | 16987 | 5 | UNDOCUMENTED: discovery only |
| Fishing | 17069 | 59 | UNDOCUMENTED: discovery only |
| FishingPoint | 17180 | 11 | UNDOCUMENTED: discovery only |
| FishingQTE | 17098 | 9 | UNDOCUMENTED: discovery only |
| FishingRod | 17249 | 3 | UNDOCUMENTED: discovery only |
| FishingRule | 17071 | 11 | UNDOCUMENTED: discovery only |
| FiveElements | 17172 | 6 | UNDOCUMENTED: discovery only |
| Forge | 17238 | 2 | UNDOCUMENTED: discovery only |
| Fuel | 16984 | 4 | D1-D3 selected data/native |
| FX | 17132 | 43 | aspect structure/count read |
| GlobalMapItem | 17101 | 7 | UNDOCUMENTED: discovery only |
| GlobalSettings | 16988 | 24 | prior selected data/schema |
| GodnessLevel | 17211 | 12 | prior selected data/schema |
| Grade | 17027 | 3 | prior selected data/schema |
| Guild_Old_XuanJiGe_Fight | 17163 | 1 | UNDOCUMENTED: discovery only |
| HandBook | 17145 | 1219 | aspect structure/count read |
| HandBookObjectType | 17065 | 13 | UNDOCUMENTED: discovery only |
| HandBookTaskInfo | 17055 | 111 | UNDOCUMENTED: discovery only |
| HiveConfig | 17033 | 1 | UNDOCUMENTED: discovery only |
| HomeCollect | 16980 | 52 | UNDOCUMENTED: discovery only |
| Honey | 17148 | 7 | UNDOCUMENTED: discovery only |
| HoneyPlant | 17122 | 5 | UNDOCUMENTED: discovery only |
| HoneyStar | 17202 | 25 | UNDOCUMENTED: discovery only |
| Hour | 17131 | 24 | UNDOCUMENTED: discovery only |
| Input | 17129 | 13 | aspect structure/count read |
| InsectPest | 17042 | 1 | UNDOCUMENTED: discovery only |
| InteractionAction | 17123 | 155 | UNDOCUMENTED: discovery only |
| InteractionKey | 17108 | 83 | UNDOCUMENTED: discovery only |
| Interactions | 17054 | 18 | UNDOCUMENTED: discovery only |
| Item | 17021 | 1849 | UNDOCUMENTED: discovery only |
| ItemPackages | 17034 | 4 | UNDOCUMENTED: discovery only |
| JianToSi | 17060 | 2 | UNDOCUMENTED: discovery only |
| KeyIcon | 17134 | 0 | UNDOCUMENTED: discovery only |
| Language | 17112 | 19775 | aspect structure/count read |
| Level | 16989 | 7 | prior selected data/schema |
| LifeSkill | 17135 | 4 | prior selected data/schema |
| LifeSkillLevel | 17075 | 90 | prior selected data/schema |
| LineBreaking Following Characters | 17245 | unparsed | parse gap, retained raw |
| LineBreaking Leading Characters | 17199 | unparsed | parse gap, retained raw |
| LoadingImage | 17183 | 17 | UNDOCUMENTED: discovery only |
| MagicPlant | 16970 | 6 | UNDOCUMENTED: discovery only |
| MagicPlantDecoration | 17015 | 16 | UNDOCUMENTED: discovery only |
| Marry | 17096 | 12 | prior selected data/schema |
| MarryEvent | 17073 | 60 | prior selected data/schema |
| MeditationPoint | 16976 | 2 | prior selected data/schema |
| MenuInn | 17175 | 83 | UNDOCUMENTED: discovery only |
| Mining | 17195 | 3 | UNDOCUMENTED: discovery only |
| MutaID | 17047 | 5 | UNDOCUMENTED: discovery only |
| New_Karst1 | 17193 | 19 | UNDOCUMENTED: discovery only |
| New_Karst2 | 17110 | 12 | UNDOCUMENTED: discovery only |
| New_Karst3 | 17179 | 16 | UNDOCUMENTED: discovery only |
| New_Karst4 | 17126 | 15 | UNDOCUMENTED: discovery only |
| New_Karst5 | 16956 | 17 | UNDOCUMENTED: discovery only |
| New_Karst6 | 17188 | 25 | UNDOCUMENTED: discovery only |
| New_Karst7 | 17212 | 22 | UNDOCUMENTED: discovery only |
| New_Karst8_Boss | 17010 | 10 | UNDOCUMENTED: discovery only |
| NoFixedItem | 16964 | 110 | UNDOCUMENTED: discovery only |
| NoFixedItems | 17001 | 18 | UNDOCUMENTED: discovery only |
| NoFixedShop | 17196 | 94 | UNDOCUMENTED: discovery only |
| NormalOfferReward | 17058 | 95 | UNDOCUMENTED: discovery only |
| NormalOfferRewardWeight | 16990 | 5 | UNDOCUMENTED: discovery only |
| NPC | 17031 | 67 | aspect structure/count read |
| NPCEvent | 17156 | 0 | prior selected data/schema |
| NPCSchedule | 17061 | 371 | prior selected data/schema |
| NPCTeleport | 17248 | 2 | UNDOCUMENTED: discovery only |
| OrderTask | 17178 | 64 | UNDOCUMENTED: discovery only |
| PaperBird | 17239 | 264 | aspect structure/count read |
| Path | 17072 | 3 | UNDOCUMENTED: discovery only |
| Pet | 17051 | 1 | UNDOCUMENTED: discovery only |
| PlayerInitialData | 17206 | 75 | prior selected data/schema |
| PlayerValueVersionModify | 17088 | 1 | prior selected data/schema |
| PlumberBoxConfig | 17207 | 14 | UNDOCUMENTED: discovery only |
| PlumberBoxOperation | 17104 | 7 | UNDOCUMENTED: discovery only |
| PlumberGameConfig | 17226 | 5 | UNDOCUMENTED: discovery only |
| Portals | 17192 | 223 | UNDOCUMENTED: discovery only |
| Pray | 17166 | 11 | prior selected data/schema |
| PrizeDisplay | 17152 | 181 | UNDOCUMENTED: discovery only |
| ProductionTool | 17133 | 6 | UNDOCUMENTED: discovery only |
| ProjectileData | 17190 | 164 | UNDOCUMENTED: discovery only |
| Question | 17007 | 72 | UNDOCUMENTED: discovery only |
| Room | 17017 | 5 | UNDOCUMENTED: discovery only |
| RoomStyle | 17076 | 60 | UNDOCUMENTED: discovery only |
| SangYeConfig | 16963 | 3 | UNDOCUMENTED: discovery only |
| SavePoint | 17143 | 6 | aspect structure/count read |
| SceneMapItem | 16958 | 45 | UNDOCUMENTED: discovery only |
| SceneObjects | 17070 | 267 | UNDOCUMENTED: discovery only |
| ScenePoints | 17177 | 300 | UNDOCUMENTED: discovery only |
| Scenes | 16994 | 112 | UNDOCUMENTED: discovery only |
| SceneTeleporters | 17151 | 51 | UNDOCUMENTED: discovery only |
| SceneTimelines | 17189 | 1 | UNDOCUMENTED: discovery only |
| School | 17236 | 7 | prior selected data/schema |
| SchoolCookingGames | 17052 | 52 | UNDOCUMENTED: discovery only |
| SchoolDevelopment | 17146 | 4 | prior selected data/schema |
| SchoolRenown | 17229 | 5 | prior selected data/schema |
| SchoolSalary | 17037 | 64 | prior selected data/schema |
| SchoolShop | 17044 | 356 | UNDOCUMENTED: discovery only |
| SchoolTabType | 17035 | 6 | UNDOCUMENTED: discovery only |
| SchoolUnlockGroup | 17085 | 42 | prior selected data/schema |
| SchoolUnlockType | 17026 | 6 | UNDOCUMENTED: discovery only |
| SecretArea_canghaicheng_01 | 17062 | 19 | UNDOCUMENTED: discovery only |
| SecretArea_canghaicheng_02 | 17214 | 23 | UNDOCUMENTED: discovery only |
| SecretArea_canghaicheng_03 | 17162 | 27 | UNDOCUMENTED: discovery only |
| SecretArea_canghaicheng_04 | 17014 | 62 | UNDOCUMENTED: discovery only |
| SecretArea_canghaicheng_05 | 16974 | 14 | UNDOCUMENTED: discovery only |
| SecretArea_fanhuagu_01 | 17074 | 17 | UNDOCUMENTED: discovery only |
| SecretArea_fanhuagu_02 | 17009 | 24 | UNDOCUMENTED: discovery only |
| SecretArea_fanhuagu_03 | 16961 | 29 | UNDOCUMENTED: discovery only |
| SecretArea_fanhuagu_04 | 17011 | 20 | UNDOCUMENTED: discovery only |
| SecretArea_fanhuagu_05 | 17012 | 16 | UNDOCUMENTED: discovery only |
| SecretArea_guxuecheng_01 | 17182 | 16 | UNDOCUMENTED: discovery only |
| SecretArea_guxuecheng_02 | 17155 | 16 | UNDOCUMENTED: discovery only |
| SecretArea_guxuecheng_03 | 17005 | 26 | UNDOCUMENTED: discovery only |
| SecretArea_guxuecheng_04 | 17116 | 40 | UNDOCUMENTED: discovery only |
| SecretArea_guxuecheng_05 | 17057 | 11 | UNDOCUMENTED: discovery only |
| SecretArea_guxyecheng_01 | 17117 | 0 | UNDOCUMENTED: discovery only |
| SecretArea_guxyecheng_02 | 17191 | 0 | UNDOCUMENTED: discovery only |
| SecretArea_guxyecheng_03 | 17056 | 0 | UNDOCUMENTED: discovery only |
| SecretArea_guxyecheng_04 | 17220 | 0 | UNDOCUMENTED: discovery only |
| SecretArea_guxyecheng_05 | 17029 | 0 | UNDOCUMENTED: discovery only |
| SecretArea_mingyueguan_01 | 17141 | 21 | UNDOCUMENTED: discovery only |
| SecretArea_mingyueguan_02 | 16992 | 25 | UNDOCUMENTED: discovery only |
| SecretArea_mingyueguan_03 | 16998 | 27 | UNDOCUMENTED: discovery only |
| SecretArea_mingyueguan_04 | 17048 | 28 | UNDOCUMENTED: discovery only |
| SecretArea_mingyueguan_05 | 17081 | 17 | UNDOCUMENTED: discovery only |
| SecretArea_qingqiu01 | 16997 | 2 | UNDOCUMENTED: discovery only |
| SecretArea_reshaling_01 | 16981 | 21 | UNDOCUMENTED: discovery only |
| SecretArea_reshaling_02 | 17204 | 51 | UNDOCUMENTED: discovery only |
| SecretArea_reshaling_03 | 17194 | 31 | UNDOCUMENTED: discovery only |
| SecretArea_reshaling_04 | 16972 | 35 | UNDOCUMENTED: discovery only |
| SecretArea_reshaling_05 | 17210 | 27 | UNDOCUMENTED: discovery only |
| SecretArea_shanzhuang_01 | 17168 | 19 | UNDOCUMENTED: discovery only |
| SecretArea_shanzhuang_02 | 17140 | 18 | UNDOCUMENTED: discovery only |
| SecretArea_shanzhuang_03 | 17234 | 20 | UNDOCUMENTED: discovery only |
| SecretArea_yanyancheng_01 | 17090 | 12 | UNDOCUMENTED: discovery only |
| SecretArea_yanyancheng_02 | 17100 | 12 | UNDOCUMENTED: discovery only |
| SecretArea_yanyancheng_03 | 17242 | 20 | UNDOCUMENTED: discovery only |
| SecretArea_yanyancheng_04 | 17003 | 24 | UNDOCUMENTED: discovery only |
| SecretArea_yanyancheng_05 | 17028 | 12 | UNDOCUMENTED: discovery only |
| SecretArea_yuhuawu_01 | 16959 | 21 | UNDOCUMENTED: discovery only |
| SecretArea_yuhuawu_02 | 16985 | 24 | UNDOCUMENTED: discovery only |
| SecretArea_yuhuawu_03 | 17094 | 25 | UNDOCUMENTED: discovery only |
| SecretArea_yuhuawu_04 | 17198 | 24 | UNDOCUMENTED: discovery only |
| SecretArea_yuhuawu_05 | 17231 | 31 | UNDOCUMENTED: discovery only |
| SecretArea_zixiaogong_01 | 17240 | 15 | UNDOCUMENTED: discovery only |
| SecretArea_zixiaogong_02 | 17241 | 28 | UNDOCUMENTED: discovery only |
| SecretArea_zixiaogong_03 | 17227 | 35 | UNDOCUMENTED: discovery only |
| SecretArea_zixiaogong_04 | 17050 | 25 | UNDOCUMENTED: discovery only |
| SecretArea_zixiaogong_05 | 17232 | 13 | UNDOCUMENTED: discovery only |
| SeedPack | 16960 | 3 | UNDOCUMENTED: discovery only |
| SeedQuality | 17115 | 6 | UNDOCUMENTED: discovery only |
| SeniorPromote | 16977 | 3 | UNDOCUMENTED: discovery only |
| SensitiveWords | 17038 | unparsed | parse gap, retained raw |
| Shop | 16969 | 9 | UNDOCUMENTED: discovery only |
| Skill | 17237 | 11 | UNDOCUMENTED: discovery only |
| SmelterLevel | 16973 | 2 | D1-D3 selected data/native |
| SmelterRecipe | 16996 | 3 | D1-D3 selected data/native |
| Solarterm | 17023 | 72 | UNDOCUMENTED: discovery only |
| SpecialExchange | 17215 | 14 | UNDOCUMENTED: discovery only |
| SpecialInteractive | 17080 | 2 | UNDOCUMENTED: discovery only |
| SpecialOfferReward | 17139 | 4 | UNDOCUMENTED: discovery only |
| SpiritAnimalConfig | 17167 | 4 | UNDOCUMENTED: discovery only |
| StaffList | 17136 | 84 | UNDOCUMENTED: discovery only |
| StarTypeConfig | 17203 | 15 | UNDOCUMENTED: discovery only |
| SteamAchievements | 16982 | 72 | aspect structure/count read |
| Storage | 17235 | 50 | UNDOCUMENTED: discovery only |
| Study | 17049 | 14 | prior selected data/schema |
| Talent | 17247 | 27 | UNDOCUMENTED: discovery only |
| Task | 17008 | 393 | aspect structure/count read |
| TaskHandBook | 17086 | 58 | UNDOCUMENTED: discovery only |
| Teleport | 17246 | 8 | UNDOCUMENTED: discovery only |
| TestShaderWithOldMetaFormat.pbs | 17120 | 2 | UNDOCUMENTED: discovery only |
| TimeInterval | 17228 | 24 | UNDOCUMENTED: discovery only |
| TimelineSceneTrigger | 16978 | 0 | UNDOCUMENTED: discovery only |
| Tip | 17045 | 37 | aspect structure/count read |
| Tool | 17154 | 20 | UNDOCUMENTED: discovery only |
| Treat | 17197 | 4 | UNDOCUMENTED: discovery only |
| TreatDoll | 17209 | 24 | UNDOCUMENTED: discovery only |
| TreatEvaluate | 16967 | 996 | UNDOCUMENTED: discovery only |
| TreatNpcTarget | 17230 | 48 | UNDOCUMENTED: discovery only |
| TreatRule | 17165 | 16 | UNDOCUMENTED: discovery only |
| TreatTarget | 17201 | 4 | UNDOCUMENTED: discovery only |
| Trigger | 17089 | 413 | aspect structure/count read |
| UpgradeElixir | 17119 | 6 | UNDOCUMENTED: discovery only |
| Weapon | 17020 | 15 | UNDOCUMENTED: discovery only |
| 骑鹤比赛动作信息 | 17103 | unparsed | parse gap, retained raw |

## Application service inventory

Assembly-CSharp begins at TypeDef9500. The method count below is the recovered direct RVA declaration count; generic-only declarations are not included. A native read is a finite selected method slice, not the whole class. Remaining entries are deliberately marked undocumented unless the earlier dossier gave a specific system account.

| Service type | TypeDef | Direct method count | Documentation state |
|---|---:|---:|---|
| NewAlchemy.AlchemyManager | 13386 | 80 | this pass: selected native methods |
| AnswerController | 10623 | 17 | UNDOCUMENTED: declaration/discovery only |
| AttributeUIManager | 12189 | 35 | UNDOCUMENTED: declaration/discovery only |
| AudioManager | 11184 | 36 | UNDOCUMENTED: declaration/discovery only |
| BagController | 10628 | 72 | UNDOCUMENTED: declaration/discovery only |
| BagHarvestManager | 11044 | 9 | UNDOCUMENTED: declaration/discovery only |
| BarrierController | 10649 | 11 | UNDOCUMENTED: declaration/discovery only |
| BattleEffectManager | 9770 | 2 | UNDOCUMENTED: declaration/discovery only |
| BattleFXManager | 9771 | 8 | UNDOCUMENTED: declaration/discovery only |
| BattleSkillManager | 9760 | 3 | UNDOCUMENTED: declaration/discovery only |
| BattleUnitAnimatorController | 9776 | 3 | UNDOCUMENTED: declaration/discovery only |
| BattleUnitController | 9777 | 113 | UNDOCUMENTED: declaration/discovery only |
| BattleUnitManager | 9788 | 55 | UNDOCUMENTED: declaration/discovery only |
| BlackScreenManager | 12246 | 4 | UNDOCUMENTED: declaration/discovery only |
| BreakBattleManager | 9795 | 14 | prior selected native/data digest |
| BreakResultUIManager | 12250 | 5 | UNDOCUMENTED: declaration/discovery only |
| BubbleWordManager | 11198 | 8 | UNDOCUMENTED: declaration/discovery only |
| BuildGradeUpController | 9835 | 45 | UNDOCUMENTED: declaration/discovery only |
| BuildGradeUpUIManager | 9839 | 37 | UNDOCUMENTED: declaration/discovery only |
| BuildManager | 12563 | 7 | UNDOCUMENTED: declaration/discovery only |
| BuildingController | 10654 | 36 | UNDOCUMENTED: declaration/discovery only |
| CalenderController | 10669 | 11 | UNDOCUMENTED: declaration/discovery only |
| CameraManager | 12161 | 11 | UNDOCUMENTED: declaration/discovery only |
| CanvasManager | 11201 | 15 | UNDOCUMENTED: declaration/discovery only |
| ChangeStyleController | 10673 | 15 | UNDOCUMENTED: declaration/discovery only |
| ClassScheduleController | 10675 | 6 | UNDOCUMENTED: declaration/discovery only |
| CocooneryController | 10677 | 29 | UNDOCUMENTED: declaration/discovery only |
| CocooneryManager | 12255 | 7 | UNDOCUMENTED: declaration/discovery only |
| CocooneryUIManager | 12261 | 10 | UNDOCUMENTED: declaration/discovery only |
| CocooneryUI_InsideManager | 12264 | 6 | UNDOCUMENTED: declaration/discovery only |
| CollectController | 10681 | 26 | UNDOCUMENTED: declaration/discovery only |
| CollectDropManager | 12272 | 5 | UNDOCUMENTED: declaration/discovery only |
| CollectInteractiveUIManager | 12300 | 6 | UNDOCUMENTED: declaration/discovery only |
| CollectUIManager | 12301 | 11 | UNDOCUMENTED: declaration/discovery only |
| CompassArrowManager | 11207 | 9 | UNDOCUMENTED: declaration/discovery only |
| ConfigManager | 11211 | 5 | UNDOCUMENTED: declaration/discovery only |
| ConsoleManager | 9896 | 4 | UNDOCUMENTED: declaration/discovery only |
| ConsoleUIManager | 9916 | 19 | UNDOCUMENTED: declaration/discovery only |
| CookingController | 10687 | 27 | UNDOCUMENTED: declaration/discovery only |
| CookingManager | 12332 | 23 | this pass: selected native methods |
| CoroutineManager | 11214 | 3 | UNDOCUMENTED: declaration/discovery only |
| CourseController | 10694 | 63 | UNDOCUMENTED: declaration/discovery only |
| CraneController | 12462 | 32 | UNDOCUMENTED: declaration/discovery only |
| CraneManager | 12464 | 25 | UNDOCUMENTED: declaration/discovery only |
| CraneUIManager | 12467 | 17 | UNDOCUMENTED: declaration/discovery only |
| CreatRoleDataManager | 9920 | 11 | UNDOCUMENTED: declaration/discovery only |
| CreatRolePlayerController | 9923 | 15 | UNDOCUMENTED: declaration/discovery only |
| CreatRoleUIManager | 9929 | 23 | UNDOCUMENTED: declaration/discovery only |
| CriAtomListenerManager | 11215 | 9 | UNDOCUMENTED: declaration/discovery only |
| CropPackManager | 12630 | 4 | UNDOCUMENTED: declaration/discovery only |
| CurtainManager | 11565 | 9 | UNDOCUMENTED: declaration/discovery only |
| DebuffManager | 9938 | 4 | UNDOCUMENTED: declaration/discovery only |
| DebugManager | 9939 | 7 | UNDOCUMENTED: declaration/discovery only |
| DecorationController | 10715 | 26 | UNDOCUMENTED: declaration/discovery only |
| DelayGameCommandManager | 10084 | 7 | UNDOCUMENTED: declaration/discovery only |
| DelegationController | 9948 | 28 | UNDOCUMENTED: declaration/discovery only |
| DemoDBTimelineController | 9502 | 2 | UNDOCUMENTED: declaration/discovery only |
| DemoManager | 9955 | 3 | UNDOCUMENTED: declaration/discovery only |
| DevelopmentController | 10722 | 8 | UNDOCUMENTED: declaration/discovery only |
| DialogController | 10726 | 7 | this pass: selected native methods |
| DragonBoatRaceController | 10733 | 23 | UNDOCUMENTED: declaration/discovery only |
| DragonBoatRaceManager | 11159 | 18 | UNDOCUMENTED: declaration/discovery only |
| DressController | 10736 | 22 | UNDOCUMENTED: declaration/discovery only |
| DropManager | 9957 | 6 | UNDOCUMENTED: declaration/discovery only |
| EditBuildingController | 12575 | 14 | UNDOCUMENTED: declaration/discovery only |
| EditDecorateController | 12576 | 19 | UNDOCUMENTED: declaration/discovery only |
| EditManager | 12577 | 21 | UNDOCUMENTED: declaration/discovery only |
| EditSceneManager | 9564 | 3 | UNDOCUMENTED: declaration/discovery only |
| EffectiveItemController | 10741 | 6 | UNDOCUMENTED: declaration/discovery only |
| ErrorManager | 11216 | 3 | UNDOCUMENTED: declaration/discovery only |
| ExchangeBagManager | 12468 | 3 | UNDOCUMENTED: declaration/discovery only |
| ExchangeShopController | 10743 | 19 | UNDOCUMENTED: declaration/discovery only |
| ExclamationManager | 9972 | 2 | UNDOCUMENTED: declaration/discovery only |
| ExerciseManager | 12470 | 9 | UNDOCUMENTED: declaration/discovery only |
| ExerciseUIManager | 12472 | 9 | UNDOCUMENTED: declaration/discovery only |
| EyeController | 11391 | 6 | UNDOCUMENTED: declaration/discovery only |
| FightLineManager | 9982 | 3 | UNDOCUMENTED: declaration/discovery only |
| FindDifferenceController | 10748 | 11 | UNDOCUMENTED: declaration/discovery only |
| FishingController | 10750 | 7 | UNDOCUMENTED: declaration/discovery only |
| FishingDataManager | 12504 | 5 | UNDOCUMENTED: declaration/discovery only |
| FishingManager | 12510 | 14 | UNDOCUMENTED: declaration/discovery only |
| FishingPlayerController | 12511 | 26 | UNDOCUMENTED: declaration/discovery only |
| FishingRuleManager | 12517 | 13 | UNDOCUMENTED: declaration/discovery only |
| FishingUIManager | 12520 | 12 | UNDOCUMENTED: declaration/discovery only |
| ForgeController | 10753 | 6 | UNDOCUMENTED: declaration/discovery only |
| ForgeManager | 12537 | 9 | UNDOCUMENTED: declaration/discovery only |
| GameController | 10756 | 9 | UNDOCUMENTED: declaration/discovery only |
| GameMapManager | 11679 | 9 | UNDOCUMENTED: declaration/discovery only |
| GameTimeManager | 11220 | 83 | prior selected native/data digest |
| GlobalEffectManager | 9808 | 3 | UNDOCUMENTED: declaration/discovery only |
| GodnessManager | 9941 | 60 | UNDOCUMENTED: declaration/discovery only |
| GroundCollectManager | 12560 | 8 | UNDOCUMENTED: declaration/discovery only |
| GroundController | 12614 | 23 | UNDOCUMENTED: declaration/discovery only |
| HandBookController | 10758 | 36 | UNDOCUMENTED: declaration/discovery only |
| HomeCollectManager | 12287 | 3 | UNDOCUMENTED: declaration/discovery only |
| HomeManager | 11005 | 2 | UNDOCUMENTED: declaration/discovery only |
| HomeStyleChangeUIManager | 11030 | 22 | UNDOCUMENTED: declaration/discovery only |
| IL3DN.IL3DN_SimpleFPSController | 13414 | 12 | UNDOCUMENTED: declaration/discovery only |
| InputController | 10774 | 5 | UNDOCUMENTED: declaration/discovery only |
| InputManager | 11229 | 28 | UNDOCUMENTED: declaration/discovery only |
| InteractTimeline.Runtime.InteractTimelineManager | 12871 | 16 | UNDOCUMENTED: declaration/discovery only |
| InteractionManager | 12152 | 19 | UNDOCUMENTED: declaration/discovery only |
| InteractiveObjectManager | 11235 | 12 | UNDOCUMENTED: declaration/discovery only |
| ItemController | 10777 | 62 | UNDOCUMENTED: declaration/discovery only |
| JoystickManager | 11048 | 62 | UNDOCUMENTED: declaration/discovery only |
| LanguageManager | 11237 | 8 | UNDOCUMENTED: declaration/discovery only |
| LoadingBlackScreenManager | 12249 | 5 | UNDOCUMENTED: declaration/discovery only |
| MagicPlantController | 10802 | 10 | UNDOCUMENTED: declaration/discovery only |
| MagicPlantManager | 11168 | 16 | UNDOCUMENTED: declaration/discovery only |
| MarkManager | 11241 | 2 | UNDOCUMENTED: declaration/discovery only |
| MarryController | 10806 | 28 | prior selected native/data digest |
| MarryManager | 11302 | 1 | UNDOCUMENTED: declaration/discovery only |
| MeditationUIManager | 12654 | 20 | UNDOCUMENTED: declaration/discovery only |
| MenuBackController | 11305 | 2 | UNDOCUMENTED: declaration/discovery only |
| MenuBackManager | 11308 | 4 | UNDOCUMENTED: declaration/discovery only |
| MiningController | 10810 | 7 | UNDOCUMENTED: declaration/discovery only |
| MiningManager | 12662 | 12 | UNDOCUMENTED: declaration/discovery only |
| MiningUIManager | 12666 | 5 | UNDOCUMENTED: declaration/discovery only |
| ModelsCameraManager | 9932 | 7 | UNDOCUMENTED: declaration/discovery only |
| MountSwordManager | 11313 | 8 | UNDOCUMENTED: declaration/discovery only |
| MountSwordSafePointManager | 11316 | 7 | UNDOCUMENTED: declaration/discovery only |
| NPCConsoleManager | 11325 | 5 | UNDOCUMENTED: declaration/discovery only |
| NPCEffectManager | 9566 | 8 | UNDOCUMENTED: declaration/discovery only |
| NPCScheduleController | 10815 | 14 | prior selected native/data digest |
| NavMeshManager | 11242 | 10 | UNDOCUMENTED: declaration/discovery only |
| NewSignController | 10819 | 53 | UNDOCUMENTED: declaration/discovery only |
| NewStudyUIManager | 11895 | 2 | UNDOCUMENTED: declaration/discovery only |
| NoFixedShopController | 10821 | 26 | UNDOCUMENTED: declaration/discovery only |
| _MyImmortalLife.Scripts.NewNpc.NpcManager | 12902 | 69 | prior selected native/data digest |
| NpcScheduleManager | 9586 | 32 | prior selected native/data digest |
| OfferRewardController | 10835 | 32 | UNDOCUMENTED: declaration/discovery only |
| OfferRewardUIManager | 12679 | 12 | UNDOCUMENTED: declaration/discovery only |
| OperationController | 10853 | 27 | UNDOCUMENTED: declaration/discovery only |
| OrderTaskController | 10865 | 9 | UNDOCUMENTED: declaration/discovery only |
| PanelPitUIManager | 12265 | 2 | UNDOCUMENTED: declaration/discovery only |
| PaperBirdController | 10871 | 57 | UNDOCUMENTED: declaration/discovery only |
| PaperBirdManager | 11247 | 11 | UNDOCUMENTED: declaration/discovery only |
| PathManager | 9576 | 5 | UNDOCUMENTED: declaration/discovery only |
| PetController | 10889 | 15 | UNDOCUMENTED: declaration/discovery only |
| PetManager | 11360 | 14 | UNDOCUMENTED: declaration/discovery only |
| PlantController | 10894 | 39 | UNDOCUMENTED: declaration/discovery only |
| PlantLinkManager | 12647 | 3 | UNDOCUMENTED: declaration/discovery only |
| PlantManager | 12648 | 3 | UNDOCUMENTED: declaration/discovery only |
| PlayerController | 10902 | 271 | prior selected native/data digest |
| PlayerPrefsManager | 11249 | 12 | UNDOCUMENTED: declaration/discovery only |
| PlayerTriggerManager | 11251 | 17 | UNDOCUMENTED: declaration/discovery only |
| PlumberUIManager | 12684 | 4 | prior selected native/data digest |
| PrecipitationManager | 9518 | 7 | UNDOCUMENTED: declaration/discovery only |
| PressManager | 11432 | 2 | UNDOCUMENTED: declaration/discovery only |
| PrizeDisplayManager | 12700 | 28 | UNDOCUMENTED: declaration/discovery only |
| PrizeDisplayUIManager | 12707 | 12 | UNDOCUMENTED: declaration/discovery only |
| ProductionBuildingController | 11434 | 95 | UNDOCUMENTED: declaration/discovery only |
| ProductionBuildingUIManager | 11461 | 22 | UNDOCUMENTED: declaration/discovery only |
| PromptManager | 11467 | 9 | UNDOCUMENTED: declaration/discovery only |
| QuickGrownManager | 11047 | 8 | UNDOCUMENTED: declaration/discovery only |
| ResourceManager | 11255 | 6 | UNDOCUMENTED: declaration/discovery only |
| RoleTalentSetupController | 11476 | 15 | UNDOCUMENTED: declaration/discovery only |
| RoleTalentSetupUIManager | 11479 | 38 | UNDOCUMENTED: declaration/discovery only |
| RoomController | 10915 | 37 | UNDOCUMENTED: declaration/discovery only |
| RoomManager | 12710 | 6 | UNDOCUMENTED: declaration/discovery only |
| RoomStyleManager | 11256 | 16 | UNDOCUMENTED: declaration/discovery only |
| RoomUIManager | 12713 | 10 | UNDOCUMENTED: declaration/discovery only |
| SafePointManager | 11487 | 6 | UNDOCUMENTED: declaration/discovery only |
| SangYeUIManager | 9856 | 30 | UNDOCUMENTED: declaration/discovery only |
| SaveManager | 11265 | 20 | this pass: selected native methods |
| SceneCollectManager | 12294 | 6 | UNDOCUMENTED: declaration/discovery only |
| SceneObjectManager | 11268 | 9 | UNDOCUMENTED: declaration/discovery only |
| ScenePathEditorUIManager | 9596 | 6 | UNDOCUMENTED: declaration/discovery only |
| ScenesManager | 11280 | 24 | UNDOCUMENTED: declaration/discovery only |
| SchoolController | 10918 | 46 | prior selected native/data digest |
| SchoolShopController | 10929 | 48 | UNDOCUMENTED: declaration/discovery only |
| SearchManager | 11289 | 3 | UNDOCUMENTED: declaration/discovery only |
| SensitiveWordManager | 12714 | 4 | UNDOCUMENTED: declaration/discovery only |
| SettlementController | 10945 | 5 | UNDOCUMENTED: declaration/discovery only |
| SettlementManager | 11290 | 5 | UNDOCUMENTED: declaration/discovery only |
| ShopController | 10947 | 17 | UNDOCUMENTED: declaration/discovery only |
| ShopManager | 12716 | 9 | UNDOCUMENTED: declaration/discovery only |
| SkillController | 10953 | 8 | UNDOCUMENTED: declaration/discovery only |
| SmelterManager | 11524 | 26 | this pass: selected native methods |
| SoundManager | 11292 | 35 | UNDOCUMENTED: declaration/discovery only |
| StateManager | 9832 | 8 | UNDOCUMENTED: declaration/discovery only |
| SteamAchevementManager | 12021 | 16 | UNDOCUMENTED: declaration/discovery only |
| SteamManager | 9523 | 10 | UNDOCUMENTED: declaration/discovery only |
| StorageBoxController | 10957 | 27 | UNDOCUMENTED: declaration/discovery only |
| StorageController | 10965 | 33 | UNDOCUMENTED: declaration/discovery only |
| StudyManager | 12730 | 8 | UNDOCUMENTED: declaration/discovery only |
| StudyUIManager | 12733 | 19 | UNDOCUMENTED: declaration/discovery only |
| TargetInteractiveController | 10974 | 11 | UNDOCUMENTED: declaration/discovery only |
| MyImmortalLife.Tasks.TaskController | 12788 | 69 | UNDOCUMENTED: declaration/discovery only |
| TaskManager | 11293 | 11 | UNDOCUMENTED: declaration/discovery only |
| TeleportController | 10977 | 11 | UNDOCUMENTED: declaration/discovery only |
| NewAlchemy.TestAlchemyController | 13403 | 2 | UNDOCUMENTED: declaration/discovery only |
| TestQueueTimelinePlayer.TestController | 12746 | 3 | UNDOCUMENTED: declaration/discovery only |
| TimelinePauseManager | 11541 | 7 | UNDOCUMENTED: declaration/discovery only |
| ToolController | 10979 | 23 | UNDOCUMENTED: declaration/discovery only |
| TreatController | 10988 | 61 | UNDOCUMENTED: declaration/discovery only |
| TreatDisplayManager | 11947 | 21 | UNDOCUMENTED: declaration/discovery only |
| TriggerManager | 11295 | 10 | UNDOCUMENTED: declaration/discovery only |
| UniqueInputManager | 12080 | 4 | UNDOCUMENTED: declaration/discovery only |
| VersionManager | 11300 | 2 | UNDOCUMENTED: declaration/discovery only |
| WorkShopController | 12134 | 52 | UNDOCUMENTED: declaration/discovery only |
| WorkShopUIManager | 12140 | 61 | UNDOCUMENTED: declaration/discovery only |
| ZhuJianGuoUIManager | 9858 | 15 | UNDOCUMENTED: declaration/discovery only |

# System inventory

Shown: installed build 17074448. This is an exhaustive directory and recovered-type inventory at the granularity below, not exhaustive semantic coverage. File counts include inherited definitions and support files, not unique live records. The table below counts original encrypted wrappers; all 64 were subsequently decoded privately. DIALOGUE_STRUCTURE.md/json records the decoded structural scan without claiming full prose coverage. Private `notes/content-inventory.json` records per-file sizes, wrapper state and XML element counts. `notes/installed-inventory.json` also indexes DLLs and mod examples.

## System map and prior coverage

| System | Location | Coverage |
| --- | --- | --- |
| Cultivation, law stages, breakthrough | `Settings/Practice` | Prior selected trace; advanced bodies/God/Fu and most laws unread |
| Production, alchemy, artifacts, physical labels | `Settings/ThingDef; Practice; World/ItemPhysicalLable` | Prior selected trace; not whole production tree |
| Actors, social memories, work | `Settings/Behaviour; JobDef; Npc; NpcStories` | Prior selected trace; pet decision trees unread |
| Knowledge, sect archive, travel | `Settings/Esoterica; World; MapStories` | Prior selected trace |
| Discovery, finite production, alerts | `Settings/Ui; MsgShow` | Prior selected trace |
| Panda/Bamboo and Wudang | `DLC-marked definitions and scripts` | Prior selected two traces; full DLC unread |
| RPG dialogue graphs and Jianghu information | `Settings/RPG/Dialogues; Jianghu/Talk; DlgMgr; Wnd_JianghuTalk` | Previously undocumented detail; deeper D1 and DIALOGUE_STRUCTURE.md |
| Spatial rooms and fengshui | `AreaRoom; FengshuiItemData; Settings/World/FSItemSpecial` | Previously named priority, not traced; deeper D2 |
| Regional agencies, policies and relief | `OutspreadMgr; Settings/Outspread` | Previously not traced; deeper D3 |
| Persistence, migrations and clock phase | `SaveMgr; SL_GAME; VersionCorrect; IManagerModule_LoopInterval` | New SAVE_AND_ARCHITECTURE.md |
| Teaching, UI locks and contextual help | `TeachingMgr; Settings/Teaching; Ui` | New A06/A10 selected source |
| Trade, auction, economy | `Settings/Trade` | Inventory only; unread full settlement chain |
| Mutation, challenge variants and achievements | `Settings/Mutation; World/Immortal` | Inventory only; unread rule chains |
| Epilogue and generated display text | `Settings/NpcBiography; Display` | Inventory only; unread prose and generation consumers |
| Environment, weather, biomes, ecology | `Settings/Weather; Biomes; PlantGroups; ElixirGas` | Prior weather selection; rest mostly unread |
| Combat, formations, boss and skills | `Settings/Fight; Zhen; Boss` | Inventory only beyond prior artifact path |
| Content loading, localization, mods | `ModsMgr; Mods/Readme_EN.txt` | New A07 source/documentation selection |

## Every copied Settings/Scripts directory with direct files

Directories with no direct files are represented by their children. Every row below is a discovered authoring subsystem or support directory. Unless the system map above says otherwise, it is UNDOCUMENTED semantically.

| Directory | Files | Bytes | Encrypted | XML elements in readable files |
| --- | ---: | ---: | ---: | ---: |
| `Mods` | 1 | 11042 | 0 | 0 |
| `Scripts` | 7 | 45745 | 0 | 0 |
| `Scripts/BossWarning` | 4 | 13461 | 0 | 0 |
| `Scripts/BuildMode` | 1 | 603 | 0 | 0 |
| `Scripts/Content` | 1 | 3581 | 0 | 0 |
| `Scripts/Event` | 1 | 1152 | 0 | 0 |
| `Scripts/Fabao` | 1 | 2037 | 0 | 0 |
| `Scripts/FightMap` | 2 | 3845 | 0 | 0 |
| `Scripts/FightMap/class` | 1 | 492 | 0 | 0 |
| `Scripts/FightMap/class/Places` | 13 | 10831 | 0 | 0 |
| `Scripts/FightMap/class/Schools` | 13 | 8164 | 0 | 0 |
| `Scripts/Jianghu` | 2 | 1974 | 0 | 0 |
| `Scripts/Jianghu/TalkAction` | 2 | 1941 | 0 | 0 |
| `Scripts/Job` | 2 | 2228 | 0 | 0 |
| `Scripts/Job/Jobs` | 1 | 1809 | 0 | 0 |
| `Scripts/LsFindJob` | 2 | 3880 | 0 | 0 |
| `Scripts/LsFindJob/class` | 29 | 13132 | 0 | 0 |
| `Scripts/Magic` | 2 | 2116 | 0 | 0 |
| `Scripts/Magic/class` | 49 | 69246 | 0 | 0 |
| `Scripts/MapStory` | 1 | 44430 | 0 | 0 |
| `Scripts/Misc` | 1 | 5080 | 0 | 0 |
| `Scripts/Modifier` | 2 | 1789 | 0 | 0 |
| `Scripts/Modifier/class/animal2human` | 1 | 233 | 0 | 0 |
| `Scripts/Modifier/class/boss` | 6 | 7614 | 0 | 0 |
| `Scripts/Modifier/class/lingshou` | 1 | 2060 | 0 | 0 |
| `Scripts/Modifier/class/other` | 3 | 739 | 0 | 0 |
| `Scripts/Modifier/class/yaoshou` | 1 | 3543 | 0 | 0 |
| `Scripts/Mutation` | 2 | 989 | 0 | 0 |
| `Scripts/Mutation/Class` | 2 | 939 | 0 | 0 |
| `Scripts/RPG` | 3 | 20531 | 0 | 0 |
| `Scripts/RPG/DlgNode` | 2 | 1165 | 0 | 0 |
| `Scripts/RPG/DlgNode/Nodes` | 2 | 3262 | 0 | 0 |
| `Scripts/RPG/World` | 2 | 4350 | 0 | 0 |
| `Scripts/RPG/World/Event` | 6 | 11038 | 0 | 0 |
| `Scripts/RPG/World/Map` | 34 | 78747 | 0 | 0 |
| `Scripts/RPG/World/MapEffect` | 1 | 1123 | 0 | 0 |
| `Scripts/RPG/World/MapEffect/effects` | 20 | 5435 | 0 | 0 |
| `Scripts/RPG/World/MapSkill` | 1 | 2619 | 0 | 0 |
| `Scripts/RPG/World/MapSkill/skills` | 5 | 4357 | 0 | 0 |
| `Scripts/RPG/World/Operation` | 1 | 375 | 0 | 0 |
| `Scripts/RPG/World/Worlds` | 7 | 24029 | 0 | 0 |
| `Scripts/Skill` | 2 | 1726 | 0 | 0 |
| `Scripts/Skill/class/bodypractice` | 1 | 504 | 0 | 0 |
| `Scripts/Skill/class/jiaolong` | 1 | 713 | 0 | 0 |
| `Scripts/Skill/class/lingshou` | 4 | 3485 | 0 | 0 |
| `Scripts/Skill/class/other` | 1 | 568 | 0 | 0 |
| `Scripts/Skill/class/xiongfeng` | 1 | 632 | 0 | 0 |
| `Scripts/Skill/class/zhen` | 18 | 13874 | 0 | 0 |
| `Scripts/Skill/class/zhulong` | 5 | 5718 | 0 | 0 |
| `Scripts/SkillAction` | 2 | 1616 | 0 | 0 |
| `Scripts/SkillAction/class` | 1 | 257 | 0 | 0 |
| `Scripts/SkillAction/class/enian` | 1 | 1054 | 0 | 0 |
| `Scripts/SkillAction/class/jiaolong` | 18 | 25984 | 0 | 0 |
| `Scripts/SkillAction/class/shannian` | 1 | 1520 | 0 | 0 |
| `Scripts/SkillAction/class/xiongfeng` | 17 | 29938 | 0 | 0 |
| `Scripts/SkillAction/class/zhulong` | 16 | 32732 | 0 | 0 |
| `Scripts/SkillAction/class/zhulongSp` | 3 | 5170 | 0 | 0 |
| `Scripts/Thing` | 2 | 3588 | 0 | 0 |
| `Scripts/Thing/Class` | 15 | 50720 | 0 | 0 |
| `Scripts/UILogicMode` | 1 | 2775 | 0 | 0 |
| `Scripts/UILogicMode/modes` | 5 | 7568 | 0 | 0 |
| `Scripts/Window` | 3 | 3653 | 0 | 0 |
| `Settings` | 2 | 17 | 0 | 0 |
| `Settings/Animal2Monster` | 1 | 62 | 0 | 0 |
| `Settings/AreaTypeDef` | 1 | 1496 | 0 | 32 |
| `Settings/Behaviour` | 1 | 0 | 0 | 0 |
| `Settings/Biomes` | 6 | 37822 | 0 | 1132 |
| `Settings/Biomes/Maps` | 5 | 10614 | 0 | 271 |
| `Settings/BiomesReplaceR` | 1 | 5879 | 0 | 224 |
| `Settings/CommandDef` | 6 | 17948 | 0 | 391 |
| `Settings/Comment` | 12 | 60012 | 0 | 1298 |
| `Settings/Display` | 2 | 14604 | 0 | 0 |
| `Settings/Display/ArtItem` | 2 | 7315 | 0 | 71 |
| `Settings/Display/ClothesColor` | 1 | 2510 | 0 | 0 |
| `Settings/Display/EsotericaName` | 6 | 2399 | 0 | 0 |
| `Settings/Display/FabaoName` | 2 | 1483 | 0 | 0 |
| `Settings/Display/NpcName/JYAnimal` | 13 | 1248 | 0 | 0 |
| `Settings/Display/NpcName/RaceName` | 15 | 6048 | 0 | 0 |
| `Settings/Display/NpcName/TradeName` | 8 | 3238 | 0 | 0 |
| `Settings/Display/NpcTitle` | 8 | 4510 | 0 | 0 |
| `Settings/Display/RaceSpecialMod` | 2 | 9385 | 0 | 225 |
| `Settings/Display/RandomGong` | 5 | 14555 | 0 | 0 |
| `Settings/Display/SpecialName` | 4 | 88868 | 0 | 1797 |
| `Settings/ElixirGas` | 2 | 16503 | 0 | 397 |
| `Settings/Esoterica` | 13 | 310835 | 0 | 6142 |
| `Settings/Fight` | 2 | 16761 | 0 | 99 |
| `Settings/Fight/Driver` | 6 | 10601 | 0 | 123 |
| `Settings/Fight/FightSkillTemplate` | 15 | 62706 | 0 | 1943 |
| `Settings/Fun` | 1 | 2075 | 0 | 56 |
| `Settings/HumanoidEvolution/Combine` | 1 | 847 | 0 | 30 |
| `Settings/HumanoidEvolution/Feature` | 1 | 231 | 0 | 2 |
| `Settings/HumanoidEvolution/Race` | 2 | 12897 | 0 | 306 |
| `Settings/HumanoidEvolution/Rule` | 1 | 1298 | 0 | 45 |
| `Settings/HumanoidEvolution/ThinkFragment` | 4 | 52229 | 0 | 1617 |
| `Settings/IllustratedHand/IHMapStories` | 1 | 1054 | 0 | 0 |
| `Settings/Input` | 1 | 2624 | 0 | 0 |
| `Settings/Jianghu/Hobby` | 1 | 5167 | 1 | 0 |
| `Settings/Jianghu/Npc` | 2 | 11550 | 2 | 0 |
| `Settings/Jianghu/Secret/Clue` | 1 | 22235 | 1 | 0 |
| `Settings/Jianghu/Secret/Type` | 1 | 16623 | 1 | 0 |
| `Settings/Jianghu/Talk` | 8 | 71740 | 8 | 0 |
| `Settings/JobDef` | 8 | 23308 | 0 | 598 |
| `Settings/Language` | 1 | 723 | 0 | 14 |
| `Settings/Language/OfficialEnglish` | 3 | 968435 | 0 | 2550 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_BaiMan1_Cave_QianShi/map` | 2 | 150 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_BaiMan2_Abyss_WanShe/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_BaiMan3_Cave_Beast/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_BirthPlace11_Villa_NanPing/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_BirthPlace12_Mount_YueLun/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_BirthPlace13_Mount_Liang/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_BirthPlace14_Mount_TongLing/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_BirthPlace15_Remains_TaiYi/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_CentralPlains1_Mount_Yun/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_CentralPlains2_Peak_LianDan/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_CentralPlains3_Mount_PingDing/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_CentralPlains4_Villa_WuHua/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_CentralPlains5_Villa_LuXu/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_DanXia1_Cave_ShangQing/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_DanXia2_Cliff_DanXia/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_DanXia3_Pond_WuLong/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_Desert2_Plain_HuanSha/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_Desert3_Cave_Ember/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_Desert4_Villa_MingSha/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_FertileField1_Villa_HanShan/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_FertileField2_Villa_LuoXia/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_FertileField3_Villa_DaoXiang/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_FertileField4_Mount_Gui/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_FertileField5_Mount_Lu/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_HeHuan1_Island_LiHen/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_HeHuan2_Pond_DuLong/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_JiuHua1_Villa_JiuHua/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_JiuHua2_Abyss_QianLong/map` | 2 | 569 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_JiuHua3_Cliff_FengQi/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_KunLun1_Platform_DengXian/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_KunLun2_1_Cave_Strange/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_KunLun2_Cave_LongMai/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_LongHu1_Fall_FeiLiu/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_Shu1_Cliff_NingBi/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_Shu2_Cave_FeiLei/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_Shu3_Cave_CanXia/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_Shu4_Cave_YuQuan/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_Shu5_Cave_Cemetery/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_Snowfield1_Valley_TianLuo/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_Snowfield2_Pond_YuJing/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_Snowfield3_Plain_XueFeng/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_TianJi1_Rift_FeiYun/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_TianJi2_Rift_JueTian/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_WuDang_NanYanGong/map` | 2 | 285 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_WuDang_Taizipo/map` | 2 | 293 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_WuDang_ZiXiaoGong/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_WuLian1_Pond_TianChi/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/Place_XianKong1_Cave_Endless/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/School_BaiManShan/map` | 2 | 2549 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/School_DanXiaDongTian/map` | 2 | 16218 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/School_HeHuanPai/map` | 2 | 4050 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/School_JiTianGong/map` | 2 | 3303 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/School_KunLun/map` | 2 | 1620 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/School_QiQianWu/map` | 2 | 2718 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/School_QiSha/map` | 2 | 5170 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/School_QiXiaDongTian/map` | 2 | 3570 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/School_QingLianJianZong/map` | 2 | 7081 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/School_WanYao/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/School_WuDang/map` | 2 | 509 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/School_ZhengYiDao/map` | 2 | 2615 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/FightMap/School_ZiXiaoZong/map` | 2 | 2984 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Assets/Resources/TeachSave` | 2 | 186383 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Arena/map` | 2 | 51715 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Arena/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Arena_YingTian/map` | 2 | 79948 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Arena_YingTian/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_DaoYingZhiTan/map` | 2 | 83464 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_DaoYingZhiTan/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_0/map` | 2 | 24090 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_0/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_1/map` | 2 | 49376 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_1/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_10/map` | 2 | 22987 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_10/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_11/map` | 2 | 9136 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_11/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_12/map` | 2 | 12995 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_12/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_13/map` | 2 | 9338 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_13/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_14/map` | 2 | 49933 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_14/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_15/map` | 2 | 627 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_15/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_16/map` | 2 | 6021 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_16/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_17/map` | 2 | 33826 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_17/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_18/map` | 2 | 121765 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_18/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_19/map` | 2 | 7574 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_19/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_2/map` | 2 | 77831 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_2/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_20/map` | 2 | 61472 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_20/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_21/map` | 2 | 10940 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_21/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_22/map` | 2 | 11639 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_22/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_23/map` | 2 | 8894 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_23/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_24/map` | 2 | 6393 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_24/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_25/map` | 2 | 36247 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_25/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_3/map` | 2 | 10097 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_3/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_4/map` | 2 | 46036 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_4/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_5/map` | 2 | 21053 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_5/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_6/map` | 2 | 16775 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_6/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_7/map` | 2 | 20586 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_7/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_8/map` | 2 | 40324 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_8/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_9/map` | 2 | 19616 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_9/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_Base/map` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_Base/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_N/map` | 2 | 3250 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/Rpg_Tower_N/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/firstfightmap/map` | 2 | 5546 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/firstfightmap/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/test1/map` | 2 | 231 | 0 | 0 |
| `Settings/Language/OfficialEnglish/SL/Settings/RPG/Maps/test1/size` | 2 | 0 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/CommandDef` | 1 | 1072 | 0 | 27 |
| `Settings/Language/OfficialEnglish/Settings/Comment` | 12 | 35702 | 0 | 639 |
| `Settings/Language/OfficialEnglish/Settings/Display/ArtItem` | 2 | 8520 | 0 | 111 |
| `Settings/Language/OfficialEnglish/Settings/Display/EsotericaName` | 6 | 3257 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Display/FabaoName` | 2 | 2437 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Display/NpcName/Human` | 3 | 7431 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Display/NpcName/JYAnimal` | 13 | 2073 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Display/NpcName/RaceName` | 15 | 7523 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Display/NpcName/TradeName` | 8 | 4353 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Display/NpcTitle` | 8 | 6515 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Display/RandomGong` | 5 | 20819 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Display/SpecialName` | 4 | 110600 | 0 | 1797 |
| `Settings/Language/OfficialEnglish/Settings/ElixirGas` | 1 | 4909 | 0 | 95 |
| `Settings/Language/OfficialEnglish/Settings/Esoterica` | 13 | 218562 | 0 | 1985 |
| `Settings/Language/OfficialEnglish/Settings/Fight` | 1 | 3864 | 0 | 77 |
| `Settings/Language/OfficialEnglish/Settings/Fight/FightSkillTemplate` | 14 | 12872 | 0 | 239 |
| `Settings/Language/OfficialEnglish/Settings/Fun` | 1 | 568 | 0 | 16 |
| `Settings/Language/OfficialEnglish/Settings/HumanoidEvolution/Combine` | 1 | 369 | 0 | 10 |
| `Settings/Language/OfficialEnglish/Settings/HumanoidEvolution/Race` | 2 | 4773 | 0 | 71 |
| `Settings/Language/OfficialEnglish/Settings/HumanoidEvolution/Rule` | 1 | 521 | 0 | 8 |
| `Settings/Language/OfficialEnglish/Settings/HumanoidEvolution/ThinkFragment` | 4 | 16227 | 0 | 323 |
| `Settings/Language/OfficialEnglish/Settings/IllustratedHand/IHMapStories` | 1 | 1443 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Input` | 1 | 2537 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Jianghu/Hobby` | 1 | 6851 | 1 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Jianghu/Npc` | 2 | 3894 | 2 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Jianghu/Secret/Clue` | 1 | 29723 | 1 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Jianghu/Secret/Type` | 1 | 22619 | 1 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Jianghu/Talk` | 8 | 79116 | 8 | 0 |
| `Settings/Language/OfficialEnglish/Settings/JobDef` | 8 | 12981 | 0 | 325 |
| `Settings/Language/OfficialEnglish/Settings/LingShou/Action` | 1 | 8741 | 0 | 222 |
| `Settings/Language/OfficialEnglish/Settings/LingShou/ActionType` | 1 | 1359 | 0 | 29 |
| `Settings/Language/OfficialEnglish/Settings/LingShou/Extra` | 1 | 8135 | 0 | 87 |
| `Settings/Language/OfficialEnglish/Settings/LingShou/FoodType` | 1 | 227 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/LingShou/Fun` | 1 | 330 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/LingShou/Jobp` | 1 | 23318 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/LingShou/LsRace` | 3 | 7706 | 0 | 76 |
| `Settings/Language/OfficialEnglish/Settings/LingShou/RebornBuild` | 3 | 1560 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/LingShou/Talk` | 3 | 30370 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/MapStories` | 25 | 152261 | 0 | 2090 |
| `Settings/Language/OfficialEnglish/Settings/Modifiers` | 28 | 134151 | 0 | 2256 |
| `Settings/Language/OfficialEnglish/Settings/Modifiers/BodyPractice` | 4 | 12463 | 0 | 203 |
| `Settings/Language/OfficialEnglish/Settings/Modifiers/Boss` | 5 | 8054 | 0 | 135 |
| `Settings/Language/OfficialEnglish/Settings/Modifiers/GodPractice` | 1 | 1509 | 0 | 23 |
| `Settings/Language/OfficialEnglish/Settings/MsgShow/Event` | 1 | 1668 | 0 | 41 |
| `Settings/Language/OfficialEnglish/Settings/MsgShow/Rule` | 2 | 13367 | 0 | 178 |
| `Settings/Language/OfficialEnglish/Settings/Mutation/MutationCondition` | 1 | 19653 | 0 | 315 |
| `Settings/Language/OfficialEnglish/Settings/Mutation/MutationConstantCard` | 1 | 11248 | 0 | 128 |
| `Settings/Language/OfficialEnglish/Settings/Mutation/MutationEffect` | 5 | 74049 | 0 | 1075 |
| `Settings/Language/OfficialEnglish/Settings/Mutation/MutationExtent` | 1 | 653 | 0 | 14 |
| `Settings/Language/OfficialEnglish/Settings/Mutation/MutationTrigger` | 1 | 3127 | 0 | 34 |
| `Settings/Language/OfficialEnglish/Settings/Mutation/MutationType` | 1 | 556 | 0 | 11 |
| `Settings/Language/OfficialEnglish/Settings/Npc/Backstories` | 1 | 130455 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Npc/Body` | 14 | 94025 | 0 | 1017 |
| `Settings/Language/OfficialEnglish/Settings/Npc/Damages` | 3 | 11328 | 0 | 262 |
| `Settings/Language/OfficialEnglish/Settings/Npc/Experience` | 2 | 27977 | 0 | 202 |
| `Settings/Language/OfficialEnglish/Settings/Npc/Favour` | 1 | 11996 | 0 | 219 |
| `Settings/Language/OfficialEnglish/Settings/Npc/Features` | 9 | 35680 | 0 | 612 |
| `Settings/Language/OfficialEnglish/Settings/Npc/Moods` | 11 | 76328 | 0 | 1250 |
| `Settings/Language/OfficialEnglish/Settings/Npc/Race` | 10 | 17331 | 0 | 377 |
| `Settings/Language/OfficialEnglish/Settings/Npc/Reincarnate` | 1 | 13496 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Npc/Relation` | 2 | 3553 | 0 | 79 |
| `Settings/Language/OfficialEnglish/Settings/NpcBiography/Content` | 1 | 69706 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/NpcBiography/TxtDef` | 1 | 3366 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/NpcStories` | 8 | 132394 | 0 | 907 |
| `Settings/Language/OfficialEnglish/Settings/Outspread/Build` | 4 | 9971 | 0 | 115 |
| `Settings/Language/OfficialEnglish/Settings/Outspread/BuildSkill` | 1 | 257 | 0 | 5 |
| `Settings/Language/OfficialEnglish/Settings/Outspread/Disaster` | 1 | 353 | 0 | 10 |
| `Settings/Language/OfficialEnglish/Settings/Outspread/Landform` | 1 | 341 | 0 | 10 |
| `Settings/Language/OfficialEnglish/Settings/Outspread/Point` | 2 | 2875 | 0 | 66 |
| `Settings/Language/OfficialEnglish/Settings/Outspread/Policy` | 2 | 3609 | 0 | 46 |
| `Settings/Language/OfficialEnglish/Settings/Outspread/PolicyStory` | 1 | 8692 | 0 | 122 |
| `Settings/Language/OfficialEnglish/Settings/Outspread/Region` | 2 | 1598 | 0 | 35 |
| `Settings/Language/OfficialEnglish/Settings/PlantGroups` | 3 | 162 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Practice/BodyPractice/Attitude` | 2 | 1367 | 0 | 21 |
| `Settings/Language/OfficialEnglish/Settings/Practice/BodyPractice/QuenchingLabel` | 1 | 64126 | 0 | 393 |
| `Settings/Language/OfficialEnglish/Settings/Practice/BodyPractice/QuenchingMethod` | 2 | 5427 | 0 | 56 |
| `Settings/Language/OfficialEnglish/Settings/Practice/BodyPractice/SuperPart` | 17 | 51894 | 0 | 669 |
| `Settings/Language/OfficialEnglish/Settings/Practice/FabaoHelian` | 1 | 7414 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Practice/GodPractice` | 1 | 1989 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Practice/GodPractice/City` | 2 | 12068 | 0 | 147 |
| `Settings/Language/OfficialEnglish/Settings/Practice/GodPractice/Guard` | 2 | 17529 | 0 | 239 |
| `Settings/Language/OfficialEnglish/Settings/Practice/GodPractice/Wish` | 1 | 4369 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Practice/Gong` | 17 | 50823 | 0 | 489 |
| `Settings/Language/OfficialEnglish/Settings/Practice/Gong/Body` | 4 | 5550 | 0 | 56 |
| `Settings/Language/OfficialEnglish/Settings/Practice/Gong/God` | 3 | 6464 | 0 | 61 |
| `Settings/Language/OfficialEnglish/Settings/Practice/Magic` | 10 | 40957 | 0 | 486 |
| `Settings/Language/OfficialEnglish/Settings/Practice/RandomGong` | 1 | 6833 | 0 | 69 |
| `Settings/Language/OfficialEnglish/Settings/Practice/Spell` | 2 | 13497 | 0 | 179 |
| `Settings/Language/OfficialEnglish/Settings/Practice/Tree` | 13 | 41786 | 0 | 970 |
| `Settings/Language/OfficialEnglish/Settings/Property` | 7 | 40430 | 0 | 690 |
| `Settings/Language/OfficialEnglish/Settings/RPG/Dialogues` | 19 | 33125 | 19 | 0 |
| `Settings/Language/OfficialEnglish/Settings/RPG/Event` | 1 | 1239 | 0 | 29 |
| `Settings/Language/OfficialEnglish/Settings/RPG/Info` | 1 | 919 | 0 | 14 |
| `Settings/Language/OfficialEnglish/Settings/RPG/Operation` | 1 | 778 | 0 | 22 |
| `Settings/Language/OfficialEnglish/Settings/RPG/RPGInput` | 1 | 2010 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/RPG/Things` | 1 | 2248 | 0 | 55 |
| `Settings/Language/OfficialEnglish/Settings/Reward` | 2 | 676 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Reward/Animals` | 1 | 250 | 0 | 5 |
| `Settings/Language/OfficialEnglish/Settings/Sacrifices/Display` | 1 | 279 | 0 | 8 |
| `Settings/Language/OfficialEnglish/Settings/Secrets` | 2 | 24340 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Tang` | 1 | 1141 | 0 | 17 |
| `Settings/Language/OfficialEnglish/Settings/Teaching` | 1 | 161464 | 0 | 1549 |
| `Settings/Language/OfficialEnglish/Settings/TerrainDef` | 2 | 2805 | 0 | 64 |
| `Settings/Language/OfficialEnglish/Settings/ThingDef` | 1 | 127 | 0 | 4 |
| `Settings/Language/OfficialEnglish/Settings/ThingDef/Building` | 15 | 74058 | 0 | 1167 |
| `Settings/Language/OfficialEnglish/Settings/ThingDef/Item` | 42 | 248866 | 0 | 2964 |
| `Settings/Language/OfficialEnglish/Settings/ThingDef/Plant` | 10 | 14791 | 0 | 220 |
| `Settings/Language/OfficialEnglish/Settings/ThingDef/RSThingType` | 3 | 2533 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/ThingDef/Rock` | 3 | 2190 | 0 | 39 |
| `Settings/Language/OfficialEnglish/Settings/Trade/Auction` | 5 | 24660 | 0 | 239 |
| `Settings/Language/OfficialEnglish/Settings/Trade/GoodPool` | 17 | 26685 | 0 | 281 |
| `Settings/Language/OfficialEnglish/Settings/Trade/SchoolTask` | 1 | 10181 | 0 | 113 |
| `Settings/Language/OfficialEnglish/Settings/Trade/Talk` | 13 | 12871 | 0 | 197 |
| `Settings/Language/OfficialEnglish/Settings/Ui` | 3 | 41431 | 0 | 38 |
| `Settings/Language/OfficialEnglish/Settings/Ui/CustomItemUI` | 1 | 4966 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Ui/Help` | 1 | 99871 | 0 | 281 |
| `Settings/Language/OfficialEnglish/Settings/Ui/MainList` | 3 | 34331 | 0 | 942 |
| `Settings/Language/OfficialEnglish/Settings/Ui/MiniTip` | 2 | 4256 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Ui/NpcUIEvent` | 1 | 15225 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Weather` | 5 | 18031 | 0 | 356 |
| `Settings/Language/OfficialEnglish/Settings/World` | 3 | 28617 | 0 | 26 |
| `Settings/Language/OfficialEnglish/Settings/World/DufficultyLabel` | 2 | 21188 | 0 | 396 |
| `Settings/Language/OfficialEnglish/Settings/World/Events` | 3 | 61881 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/World/FSItemSpecial` | 1 | 6078 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/World/Immortal/Constraint` | 2 | 17712 | 0 | 320 |
| `Settings/Language/OfficialEnglish/Settings/World/Immortal/ImmortalLevel` | 1 | 780 | 0 | 20 |
| `Settings/Language/OfficialEnglish/Settings/World/Places` | 6 | 33931 | 0 | 290 |
| `Settings/Language/OfficialEnglish/Settings/World/Schools` | 2 | 6001 | 0 | 0 |
| `Settings/Language/OfficialEnglish/Settings/Zhen/Node` | 7 | 29341 | 0 | 646 |
| `Settings/Language/OfficialEnglish/Settings/Zhen/NodeLevelInfo` | 1 | 429 | 0 | 12 |
| `Settings/Language/OfficialEnglish/Settings/Zhen/Props` | 1 | 3680 | 0 | 77 |
| `Settings/Language/OfficialEnglish/Settings/Zhen/Propvalue` | 1 | 6697 | 0 | 36 |
| `Settings/Language/OfficialEnglish/Settings/Zhen/SlotSuit` | 2 | 20737 | 0 | 293 |
| `Settings/Language/OfficialEnglish/Settings/Zhen/Suit` | 1 | 10902 | 0 | 146 |
| `Settings/LingShou/Action` | 1 | 25900 | 0 | 758 |
| `Settings/LingShou/ActionType` | 1 | 1136 | 0 | 29 |
| `Settings/LingShou/CD` | 1 | 133 | 0 | 0 |
| `Settings/LingShou/CValue` | 1 | 10675 | 0 | 0 |
| `Settings/LingShou/Event` | 1 | 807 | 0 | 0 |
| `Settings/LingShou/Extra` | 1 | 34111 | 0 | 1127 |
| `Settings/LingShou/Flag2Action` | 1 | 4152 | 0 | 0 |
| `Settings/LingShou/FoodNutrition` | 3 | 7671 | 0 | 0 |
| `Settings/LingShou/FoodType` | 1 | 270 | 0 | 0 |
| `Settings/LingShou/Fun` | 1 | 291 | 0 | 0 |
| `Settings/LingShou/Job2Action` | 1 | 4314 | 0 | 0 |
| `Settings/LingShou/Jobp` | 1 | 22154 | 0 | 0 |
| `Settings/LingShou/Justice` | 1 | 1397 | 0 | 0 |
| `Settings/LingShou/LsRace` | 3 | 12773 | 0 | 308 |
| `Settings/LingShou/RebornBuild` | 3 | 1285 | 0 | 0 |
| `Settings/LingShou/State` | 1 | 95 | 0 | 0 |
| `Settings/LingShou/Talk` | 3 | 26670 | 0 | 0 |
| `Settings/LingShou/Tree` | 4 | 86795 | 0 | 0 |
| `Settings/MapStories` | 24 | 925219 | 0 | 6591 |
| `Settings/Modifiers` | 32 | 447785 | 0 | 10087 |
| `Settings/Modifiers/BodyPractice` | 4 | 51089 | 0 | 1088 |
| `Settings/Modifiers/Boss` | 5 | 36481 | 0 | 750 |
| `Settings/Modifiers/GodPractice` | 4 | 41351 | 0 | 965 |
| `Settings/MsgShow/Event` | 1 | 1665 | 0 | 46 |
| `Settings/MsgShow/Rule` | 2 | 9971 | 0 | 146 |
| `Settings/Mutation/MutationCondition` | 1 | 56765 | 0 | 1034 |
| `Settings/Mutation/MutationConstantCard` | 1 | 19422 | 0 | 285 |
| `Settings/Mutation/MutationEffect` | 5 | 253838 | 0 | 4560 |
| `Settings/Mutation/MutationExtent` | 1 | 2864 | 0 | 48 |
| `Settings/Mutation/MutationTrigger` | 1 | 5605 | 0 | 114 |
| `Settings/Mutation/MutationType` | 1 | 1641 | 0 | 29 |
| `Settings/Mutation/UI` | 1 | 537 | 0 | 12 |
| `Settings/Npc/Backstories` | 1 | 132689 | 0 | 0 |
| `Settings/Npc/Body` | 15 | 165338 | 0 | 2502 |
| `Settings/Npc/Damages` | 3 | 34767 | 0 | 1146 |
| `Settings/Npc/Experience` | 2 | 37161 | 0 | 542 |
| `Settings/Npc/Favour` | 1 | 21481 | 0 | 577 |
| `Settings/Npc/Features` | 9 | 82708 | 0 | 1686 |
| `Settings/Npc/Moods` | 11 | 106102 | 0 | 2508 |
| `Settings/Npc/NpcRolepaint` | 1 | 67 | 0 | 0 |
| `Settings/Npc/Race` | 10 | 202021 | 0 | 4976 |
| `Settings/Npc/Reincarnate` | 1 | 12861 | 0 | 0 |
| `Settings/Npc/Relation` | 2 | 9510 | 0 | 260 |
| `Settings/Npc/SpDrop` | 1 | 14362 | 0 | 520 |
| `Settings/NpcBiography/Content` | 1 | 50396 | 0 | 0 |
| `Settings/NpcBiography/TxtDef` | 1 | 2302 | 0 | 0 |
| `Settings/NpcRolepaint` | 1 | 15758 | 0 | 0 |
| `Settings/NpcStories` | 8 | 128900 | 0 | 1180 |
| `Settings/Outspread/Build` | 4 | 35072 | 0 | 754 |
| `Settings/Outspread/BuildSkill` | 1 | 411 | 0 | 10 |
| `Settings/Outspread/BuildType` | 1 | 367 | 0 | 14 |
| `Settings/Outspread/Disaster` | 1 | 1801 | 0 | 46 |
| `Settings/Outspread/DisasterTrigger` | 1 | 995 | 0 | 20 |
| `Settings/Outspread/GoOutspread` | 1 | 297 | 0 | 12 |
| `Settings/Outspread/Landform` | 1 | 299 | 0 | 10 |
| `Settings/Outspread/Point` | 2 | 7965 | 0 | 174 |
| `Settings/Outspread/Policy` | 2 | 11976 | 0 | 231 |
| `Settings/Outspread/PolicyStory` | 1 | 9443 | 0 | 170 |
| `Settings/Outspread/Product` | 3 | 1405 | 0 | 48 |
| `Settings/Outspread/Region` | 2 | 8896 | 0 | 200 |
| `Settings/PlantGroups` | 3 | 750 | 0 | 0 |
| `Settings/Practice/BodyPractice/Attitude` | 2 | 2124 | 0 | 33 |
| `Settings/Practice/BodyPractice/LabelCache` | 1 | 33534 | 0 | 338 |
| `Settings/Practice/BodyPractice/QuenchingLabel` | 1 | 88376 | 0 | 1311 |
| `Settings/Practice/BodyPractice/QuenchingMethod` | 2 | 11037 | 0 | 212 |
| `Settings/Practice/BodyPractice/SuperPart` | 19 | 144650 | 0 | 3156 |
| `Settings/Practice/DanFormula` | 2 | 14177 | 0 | 424 |
| `Settings/Practice/FabaoFormula` | 2 | 8284 | 0 | 226 |
| `Settings/Practice/FabaoHelian` | 1 | 10228 | 0 | 0 |
| `Settings/Practice/GodPractice` | 1 | 1147 | 0 | 0 |
| `Settings/Practice/GodPractice/City` | 2 | 34952 | 0 | 851 |
| `Settings/Practice/GodPractice/Guard` | 2 | 26270 | 0 | 427 |
| `Settings/Practice/GodPractice/Wish` | 1 | 4634 | 0 | 0 |
| `Settings/Practice/Gong` | 17 | 83610 | 0 | 1800 |
| `Settings/Practice/Gong/Body` | 4 | 14322 | 0 | 339 |
| `Settings/Practice/Gong/God` | 3 | 12740 | 0 | 299 |
| `Settings/Practice/Magic` | 10 | 81383 | 0 | 1682 |
| `Settings/Practice/RandomGong` | 1 | 19495 | 0 | 367 |
| `Settings/Practice/Spell` | 2 | 23303 | 0 | 440 |
| `Settings/Practice/Tree` | 14 | 213285 | 0 | 5835 |
| `Settings/Property` | 21 | 148234 | 0 | 3274 |
| `Settings/RPG/Dialogues` | 19 | 196621 | 19 | 0 |
| `Settings/RPG/Event` | 1 | 1981 | 0 | 43 |
| `Settings/RPG/Info` | 1 | 1199 | 0 | 30 |
| `Settings/RPG/Maps/Rpg_Arena` | 2 | 1335749 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Arena_YingTian` | 2 | 1149917 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_DaoYingZhiTan` | 2 | 1027172 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_0` | 2 | 179656 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_1` | 2 | 699022 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_10` | 2 | 305500 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_11` | 2 | 503026 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_12` | 2 | 251007 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_13` | 2 | 479902 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_14` | 2 | 787307 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_15` | 2 | 91995 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_16` | 2 | 112852 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_17` | 2 | 405717 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_18` | 2 | 561507 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_19` | 2 | 625985 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_2` | 2 | 642961 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_20` | 2 | 455300 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_21` | 2 | 579900 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_22` | 2 | 246932 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_23` | 2 | 332395 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_24` | 2 | 112255 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_25` | 2 | 2510497 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_3` | 2 | 184867 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_4` | 2 | 479336 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_5` | 2 | 280145 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_6` | 2 | 463270 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_7` | 2 | 216595 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_8` | 2 | 447234 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_9` | 2 | 344023 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_Base` | 2 | 60254 | 0 | 0 |
| `Settings/RPG/Maps/Rpg_Tower_N` | 2 | 119555 | 0 | 0 |
| `Settings/RPG/Operation` | 1 | 2294 | 0 | 67 |
| `Settings/RPG/RPGInput` | 1 | 2006 | 0 | 0 |
| `Settings/RPG/Things` | 1 | 3275 | 0 | 114 |
| `Settings/Reward` | 2 | 14300 | 0 | 0 |
| `Settings/Reward/Animals` | 1 | 933 | 0 | 25 |
| `Settings/Sacrifices/Display` | 1 | 566 | 0 | 14 |
| `Settings/Sacrifices/Pools` | 2 | 32920 | 0 | 1157 |
| `Settings/Secrets` | 2 | 40567 | 0 | 0 |
| `Settings/Tang` | 1 | 3327 | 0 | 67 |
| `Settings/Teaching` | 1 | 359973 | 0 | 8331 |
| `Settings/TerrainDef` | 3 | 14902 | 0 | 396 |
| `Settings/ThingDef` | 5 | 6205 | 0 | 79 |
| `Settings/ThingDef/Building` | 16 | 448765 | 0 | 13008 |
| `Settings/ThingDef/Item` | 44 | 863432 | 0 | 20614 |
| `Settings/ThingDef/Plant` | 10 | 84814 | 0 | 2078 |
| `Settings/ThingDef/RSThingType` | 3 | 2367 | 0 | 0 |
| `Settings/ThingDef/Rock` | 4 | 16649 | 0 | 480 |
| `Settings/Trade/Auction` | 5 | 34808 | 0 | 839 |
| `Settings/Trade/GoodPool` | 26 | 114348 | 0 | 2952 |
| `Settings/Trade/Rule` | 1 | 7733 | 0 | 186 |
| `Settings/Trade/SchoolTask` | 1 | 17629 | 0 | 350 |
| `Settings/Trade/SchoolTrade` | 13 | 19054 | 0 | 550 |
| `Settings/Trade/Talk` | 13 | 12677 | 0 | 286 |
| `Settings/Trade/TradeCount` | 1 | 1329 | 0 | 44 |
| `Settings/Trade/TradePrice` | 17 | 18813 | 0 | 604 |
| `Settings/Trade/WalkTrader` | 1 | 3521 | 0 | 109 |
| `Settings/Ui` | 6 | 36504 | 0 | 38 |
| `Settings/Ui/CustomItemUI` | 1 | 4377 | 0 | 0 |
| `Settings/Ui/Help` | 1 | 82177 | 0 | 281 |
| `Settings/Ui/MainList` | 3 | 49198 | 0 | 356 |
| `Settings/Ui/MiniTip` | 2 | 3258 | 0 | 0 |
| `Settings/Ui/NpcUIEvent` | 1 | 14633 | 0 | 0 |
| `Settings/Weather` | 5 | 77451 | 0 | 2054 |
| `Settings/World` | 4 | 62096 | 0 | 235 |
| `Settings/World/DufficultyLabel` | 2 | 16959 | 0 | 330 |
| `Settings/World/Events` | 3 | 80400 | 0 | 0 |
| `Settings/World/FSItemSpecial` | 1 | 8634 | 0 | 0 |
| `Settings/World/Immortal/Achievement` | 1 | 6787 | 0 | 237 |
| `Settings/World/Immortal/Constraint` | 2 | 31513 | 0 | 870 |
| `Settings/World/Immortal/ImmortalLevel` | 1 | 1044 | 0 | 38 |
| `Settings/World/ItemPhysicalLable` | 1 | 10998 | 0 | 265 |
| `Settings/World/Places` | 6 | 93084 | 0 | 2229 |
| `Settings/World/Schools` | 2 | 10409 | 0 | 0 |
| `Settings/World/SingleTxt` | 3 | 899 | 0 | 0 |
| `Settings/Zhen/Node` | 7 | 95153 | 0 | 2588 |
| `Settings/Zhen/NodeLevelInfo` | 1 | 328 | 0 | 7 |
| `Settings/Zhen/NodeTypeInfo` | 1 | 1566 | 0 | 30 |
| `Settings/Zhen/Props` | 1 | 5887 | 0 | 149 |
| `Settings/Zhen/Propvalue` | 1 | 7044 | 0 | 105 |
| `Settings/Zhen/Rule` | 1 | 121 | 0 | 5 |
| `Settings/Zhen/Slot` | 1 | 9037 | 0 | 242 |
| `Settings/Zhen/SlotSuit` | 2 | 52718 | 0 | 1357 |
| `Settings/Zhen/Suit` | 1 | 15103 | 0 | 375 |

## Managed namespace and module inventory

Counts are recovered C# files, not independent systems. UI generated bindings and vendor libraries inflate counts. Private extraction retains every recovered filename; only selected classes were read. Unmatched or opaque types remain unread.

| Namespace/directory | C# files | Bytes |
| --- | ---: | ---: |
| `.` | 520 | 3881309 |
| `Assets.UWA` | 1 | 1969 |
| `DigitalRuby.WeatherMaker` | 72 | 264285 |
| `Es.InkPainter` | 5 | 38180 |
| `Es.InkPainter.Effective` | 4 | 13836 |
| `Es.InkPainter.Sample` | 7 | 12207 |
| `Es.Utility` | 1 | 1413 |
| `FairyGUI` | 1 | 410 |
| `FairyGUI.Utils` | 1 | 9157 |
| `JP` | 7 | 16891 |
| `MagicArsenal` | 6 | 7163 |
| `Properties` | 1 | 188 |
| `STB` | 1 | 759 |
| `STBImage` | 1 | 1527 |
| `TriLib` | 64 | 263723 |
| `TriLib.Extras` | 4 | 14925 |
| `TriLib.Samples` | 17 | 34331 |
| `Tutorial` | 6 | 3012 |
| `UnityEngine.UI` | 1 | 24177 |
| `XLua` | 46 | 3123733 |
| `XLua.CSObjectWrap` | 5 | 23343 |
| `XLua.Cast` | 12 | 1243 |
| `XLua.LuaDLL` | 3 | 20711 |
| `XLua.TemplateEngine` | 5 | 5070 |
| `XLuaTest` | 12 | 6443 |
| `XiaWorld` | 1410 | 5252706 |
| `XiaWorld.EventDriver` | 28 | 24451 |
| `XiaWorld.Fight` | 41 | 179258 |
| `XiaWorld.JsonConver` | 13 | 17267 |
| `XiaWorld.LSBTree` | 63 | 106605 |
| `XiaWorld.Magic` | 2 | 1573 |
| `XiaWorld.McCheck` | 16 | 3491 |
| `XiaWorld.Modifier` | 20 | 47636 |
| `XiaWorld.SaveLoad` | 76 | 35261 |
| `XiaWorld.ThingStep` | 16 | 20137 |
| `XiaWorld.UI.InGame` | 691 | 813209 |

Firstpass: `SevenZip.SevenZipHelper`, `GFileUtil` and `Assets.USecurity.AES` were recovered and selected spans read in this pass. Other managed DLLs, Unity native internals, resource packs, shaders, audio and visual assets are inventoried at install level only, not semantically audited. No claim that an undiscovered packed subsystem is absent.

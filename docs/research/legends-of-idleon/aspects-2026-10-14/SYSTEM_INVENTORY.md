# legends-of-idleon: system inventory

Status: PARTIAL. Every distinct family found in the inspected build/export is routed below, followed by a complete discovered source-unit index. This is an inventory of the available snapshot, not a claim to identify every behavior hidden in unparsed scenes, native bodies or server code. A class/helper/asset is a size signal, not necessarily an independent gameplay system. UNDOCUMENTED means no full semantic trace was located, even where a prior lane mentioned its name.

| Family | Where it lives | Size signal | Prior/new documentation |
|---|---|---|---|
| Conversation, quests and achievement joins | `DialogueDefGET, NPCdialogue, QuestComplete, AccountWideQuests` | Client maps plus quest callbacks | NEW selected A01/A02 |
| Cloud bridge and initialization | `beginSave, typed addSaveEntry, AddNewStuff` | CSver33.05; character/account fields | NEW selected A04; host/server unread |
| Actors, classes, talents and roster | `PlayerDATABASE, NewCharLvReq, actor event classes` | 251 scripts.* registrations total; 11 playable slots in prior pin | Prior selected; full combat undocumented |
| Gathering and manufacture | `Mining, Smithing/Anvil, Choppin, Fishing, Catching` | Custom-block identifier census below | Prior world map; full chains undocumented |
| W2 Alchemy and economy | `Alchemy/Cauldron tables, shops, stamps, statues` | Wiki generated tables and bundle handlers | Prior selected scope; full balance undocumented |
| W3 infrastructure | `Construction, Refinery, Worship, Trapping, samples/printing` | Separate boards/handlers | Prior world map; full chains undocumented |
| W4 pets, meals and occupancy | `Breeding, Cooking, Laboratory` | Producer/consumer and actor occupancy | Prior selected |
| W5 long projects | `Sailing, Gaming, Divinity` | Separate production/assignment systems | Prior selected; divine mapping unresolved |
| W6 work teams | `Farming, Sneaking, Summoning` | Separate rosters/producers | Prior world map; full chains undocumented |
| W7 research and exploration | `Research, Spelunking, CoralReef, JellyOperation` | Frozen handlers and article/table census | Prior selected; new-handler depth undocumented |
| Collections, achievements, events, minigames | `Cards, Tasks, StarSigns, Obols, events and additional helpers` | Exhaustive discovered helper-name index below | Mixed prior mentions; full semantics undocumented |
| AFK, time and reference UI | `AwayTimers, AFKgains, HourlyKillRate, QuickRef` | Different calculations per activity | Prior selected; A09 extends time bridge |

Top three deeper reads: [DEEPER_SYSTEMS.md](DEEPER_SYSTEMS.md). Exact remaining gaps: [CHECKPOINT.md](CHECKPOINT.md).

## Discovered source-unit index

Every unit below is structurally indexed. Semantic coverage is restricted to the cited A01-A12 paths and prior selected traces. Units with no such citation remain undocumented in depth. Counts for repeated IDs are per asset. No raw prose or source bodies are included.

| Unit / locator | Bytes, rows or references | Coverage limit |
|---|---|---|
| `scripts.ActorEvents_1` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_10` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_112` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_114` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_116` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_119` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_12` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_122` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_124` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_131` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_140` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_148` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_167` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_179` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_189` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_198` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_20` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_201` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_203` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_209` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_229` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_232` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_24` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_245` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_262` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_266` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_29` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_290` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_293` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_31` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_312` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_34` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_340` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_345` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_356` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_358` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_38` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_40` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_44` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_47` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_478` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_481` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_498` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_510` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_53` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_548` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_573` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_575` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_577` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_579` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_623` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_67` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_670` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_672` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_683` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_69` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_7` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_713` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_741` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_81` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_83` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_91` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ActorEvents_93` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.CustomLists` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.CustomLists2` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.CustomLists3` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.CustomMaps` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.CustomMapsREAL` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.Design_23_23_EveryScene` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.DialogueDefinitions` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.DialogueDefinitions2` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.DialogueFactory` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.DialogueFactory2` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ItemDefinitions` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ItemDefinitions2` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ItemDefinitions3` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ItemDefinitions4` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ItemDefinitions5` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.ItemDefinitions6` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.LanguageLists` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.LanguageLists2` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.LanguageLists3` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.LanguageNPClist` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.LanguageNPClist2` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.LanguageNPClist3` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.LanguageNPClist4` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.LanguageNPClist5` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.MonsterDefinitions` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.MouseScroll` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.MyScripts` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_0` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_1` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_10` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_100` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_101` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_102` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_103` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_104` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_105` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_106` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_107` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_108` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_109` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_11` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_110` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_111` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_112` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_113` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_114` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_115` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_116` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_117` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_118` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_119` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_12` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_120` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_121` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_122` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_123` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_124` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_125` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_126` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_127` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_128` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_129` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_13` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_130` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_131` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_132` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_133` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_134` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_135` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_136` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_137` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_138` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_139` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_14` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_140` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_141` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_142` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_143` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_144` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_145` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_146` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_147` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_148` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_149` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_15` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_150` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_151` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_152` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_153` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_154` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_155` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_156` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_157` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_158` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_159` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_16` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_160` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_161` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_17` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_18` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_19` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_20` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_21` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_22` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_23` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_24` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_25` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_26` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_27` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_28` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_29` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_3` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_30` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_31` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_32` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_33` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_34` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_35` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_36` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_37` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_38` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_39` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_4` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_40` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_41` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_42` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_43` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_44` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_45` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_46` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_47` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_48` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_49` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_5` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_50` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_51` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_52` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_53` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_54` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_55` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_56` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_57` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_58` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_59` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_6` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_60` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_61` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_62` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_63` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_64` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_65` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_66` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_67` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_68` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_69` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_7` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_70` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_71` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_72` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_73` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_74` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_75` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_76` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_77` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_78` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_79` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_8` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_80` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_81` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_82` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_83` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_84` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_85` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_86` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_87` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_88` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_89` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_9` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_90` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_91` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_92` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_93` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_94` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_95` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_96` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_97` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_98` | 1 | script registration references; behavior units, not semantic system count |
| `scripts.SceneEvents_99` | 1 | script registration references; behavior units, not semantic system count |
| `_customBlock_1second` | 3 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_2inputs` | 15 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_5sec` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_AFKcode` | 11 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_AFKfoodsTimeRedux` | 6 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_AFKgainrates` | 108 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_AFKgains` | 5 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_AchieveStatus` | 140 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ActionBlock` | 119 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ActionWaitTime` | 16 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_AddBuffType` | 37 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_AddChest` | 4 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_AddPetEffect` | 23 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_AddStatusToMonster` | 206 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_AdjustImgInst` | 1365 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_AnvilNumbers` | 1 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_AnvilProduceStats` | 40 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ArbCode2Input` | 3 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ArbitraryCode` | 722 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ArbitraryCode5Inputs` | 51 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ArcadeBonus` | 83 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ArcadeRewardGive` | 1 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ArcaneType` | 227 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_AtomCollider` | 55 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_AutoRespawnTime` | 3 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_AwayTimers` | 4 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_BinaryTXT` | 1 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Breeding` | 254 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Bubbastuff` | 220 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_CalcAwayKills` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_CaptBonusCalc` | 10 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_CaptainStatDisplay` | 4 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_CardBonusREAL` | 93 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_CardSetBonuses` | 18 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_CastAttack2` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_CastAttackofID1` | 17 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_CauldronStats` | 106 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_CheckQuests` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ClearLocalData` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ClickNode` | 18 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_CloudSAVE` | 11 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ColosseumAction` | 7 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ColosseumStuff` | 1 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_CommaNotation` | 485 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_CompLV2` | 17 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Companions` | 196 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ConsumeFoods` | 10 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_CookingR` | 110 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_CreateDmgPixel` | 54 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_CreateMonster` | 429 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_CritChance` | 7 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_CritDamage` | 12 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_DamageDealed` | 71 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_DamageMultipliers` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_DealDmgToPlayer` | 41 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_DialogueETC` | 360 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_DistanceEqn` | 152 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Divinity` | 103 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_DoActionOnActor` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Dreamstuff` | 225 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_DropItem` | 1 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_DropOdds` | 10 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_DropSomething` | 330 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_DungAction` | 32 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_DungeonCalc` | 154 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_DungeonStat` | 109 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Dungon` | 182 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_EXPconverter` | 7 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_EtcBonuses` | 139 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ExpMulti` | 46 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_FamilyBonsuesREAL` | 6 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_FamilyBonuses` | 1 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_FarmingStuffs` | 370 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_FishingToolkit` | 51 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_FlurboShop` | 14 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_FontyType` | 4 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_FoodBonuses` | 39 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ForgeEtcDetails` | 5 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ForgeInterval` | 9 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ForgeSpeeed` | 8 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ForgeStats` | 29 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ForgeUpdateCosts` | 8 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_FormatBonuses` | 16 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_FriendsListREALz` | 7 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Gallery` | 79 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_GamingStatType` | 358 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_GemShop` | 18 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_GenerateMonsterDrops` | 34 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_GetBribeBonus` | 53 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_GetBuffBonuses` | 88 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_GetFonto` | 1 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_GetSetBonus` | 53 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_GetTalentNumber` | 661 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_GiveItem` | 207 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_GoldFoodBonuses` | 19 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_GrowImgInst` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_GrowImgInstREAL` | 937 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_GuildBonuses` | 28 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_GuildSorting` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Hitscanning` | 25 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Holes` | 981 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Holes2` | 257 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_HourlyKillRate` | 98 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_IfmapisEmpty` | 1 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_IncreaseExpREQ` | 6 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_InputsTxtAndNUM` | 14 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_IsPointInPolygon` | 5 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_IsXYmouseWithinBounds` | 1580 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ItemUsed` | 4 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_JellyOperation` | 242 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_JumpRange` | 1 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_KilledMonsterType` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_LANGUAGEfont` | 75 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Labb` | 124 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Language` | 410 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_LevelUp` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_LimbRotation` | 4 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_LoadPlayerInfo` | 3 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Log2` | 15 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_MainframeBonus` | 119 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_MaxCapacity` | 84 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_MealBonus` | 64 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Minehead` | 301 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_MiningChance` | 20 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_MonsterDamage` | 12 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_MonsterKill` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_MovementBlocker` | 433 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_NetworkMove` | 535 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Ninja` | 409 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_NotateNumber` | 993 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_OfficeboxOrders` | 9 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_OnPlayStart2` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_OnPlayStart3` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_OnPlayStart4` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Pathfinder` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_PetSetInfo` | 79 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_PetStuff` | 163 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_PlaySound` | 271 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Player` | 311 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_PlayerAccTot` | 14 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_PlayerHPmax` | 68 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_PlayerMPmax` | 23 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_PlayerReach` | 11 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_PlayerSPDname` | 32 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_PlayerSpeed` | 6 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_PlayerSpeedBonus` | 40 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_PostOfficeINFO` | 8 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ProgressStarsign` | 29 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_QuestComplete` | 3 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_QuestStarted` | 3 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_RNGitemdrop` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_RandomEvent` | 41 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Refinery` | 40 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Reg_ach_add_status` | 235 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_RemoveQuestFromHelper` | 7 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ResearchStuff` | 274 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ResourceGather` | 5 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ReturnClasses` | 42 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_RiftStuff` | 157 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_RomanNumeralDisp` | 3 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_RoyalG` | 356 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_RunCodeOfType` | 58 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_RunCodeOfTypeXforThingY` | 338 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Sailing` | 192 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_SaltLick` | 26 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_SaveGamee` | 62 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ScaleImgInst` | 1 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_ServerName` | 151 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Shrine` | 32 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_SinTime` | 28 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_SkillStats` | 284 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Spelunk` | 461 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_StampBonusOfTypeX` | 143 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_StampCostss` | 20 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_StampDetails` | 46 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_StampOverLevel` | 4 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_StarSigns` | 7 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_SteamAchievements` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Stuff2` | 22 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Summoning` | 1071 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Summoning2` | 94 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_SushiStuff` | 272 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_TalentCalc` | 88 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_TalentEnh` | 25 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_TaskProgress` | 245 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_TaskStuff` | 23 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Teleport` | 18 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Thingies` | 483 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_TimerDisplay` | 39 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_TotalFoodBonuses` | 14 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_TotalStats` | 160 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_TotalTalentPoints` | 7 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Tower2Stats` | 5 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_TowerStats` | 31 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_TrappingStuffs` | 81 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Trigg` | 477 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_UnlockHint` | 62 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_WeeklyBoss` | 133 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_WhenUPressPlayButton` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_Windwalker` | 601 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_WorkbenchStuff` | 208 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_WorshipStuff` | 184 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_addImgInst` | 5751 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_add_new_player_to_database` | 15 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_afkAttackBonses` | 5 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_cauldronp2wbonuses` | 61 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_changemonsterDEF` | 5 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_chipBonuses` | 48 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_contributeGP` | 7 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_cos` | 1 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_dungeonKill` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_eventStatus` | 25 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_expReqQTY` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_fontorealz` | 54 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_getLOG` | 198 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_getbonus2` | 91 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_givReward` | 25 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_giveEXP` | 42 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_imginstACTOR` | 32 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_initialize1` | 6 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_initialize2` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_initialize3` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_initialize4` | 2 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_keychainn` | 17 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_killmonsterQuest` | 4 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_linesofText` | 156 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_organizeCoinTXT` | 13 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_performETCaction` | 14 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_playerfitsinshape` | 12 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_prayerbonuses` | 1 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_prayersReal` | 72 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_removeitems` | 38 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_resetQuest` | 57 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_skillstats2` | 9 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_steamachieve` | 94 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_timeDisp2` | 17 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |
| `_customBlock_totalcointypes` | 15 | helper occurrences; UNDOCUMENTED unless A01-A12 or prior dossier cites it |

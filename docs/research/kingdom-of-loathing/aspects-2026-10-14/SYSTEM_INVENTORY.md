# System inventory

This is a static inventory of the available pinned artifacts, not an inventory of unavailable live server builds. Size signals are physical source lines or indexed objects, not gameplay scope. Identified-only rows are **UNDOCUMENTED** behavior. The private full tracked-file/hash census is `~/.codex/research/asp-text/extract/SOURCE_CENSUS.json`. No semantic completeness is claimed for every source file.

| System | Location | Size signal / prior coverage |
|---|---|---|
| Choice chain manager | `src/main/java/net/sourceforge/kolmafia/session/ChoiceManager.java` | 2553 source lines across 1 files; new deep read |
| Choice parser | `src/main/java/net/sourceforge/kolmafia/utilities/ChoiceUtilities.java` | 694 source lines across 1 files; new deep read |
| Preference durability | `src/main/java/net/sourceforge/kolmafia/preferences/PreferencesFile.java` | 369 source lines across 1 files; new deep read |
| Reset scopes | `src/main/java/net/sourceforge/kolmafia/preferences/Preferences.java` | 943 source lines across 1 files; new deep read |
| Quest states | `src/main/java/net/sourceforge/kolmafia/persistence/QuestDatabase.java` | 1239 source lines across 1 files; new deep read |
| Journal response | `src/main/java/net/sourceforge/kolmafia/request/QuestLogRequest.java` | 271 source lines across 1 files; new deep read |
| Shared modifier context | `src/main/java/net/sourceforge/kolmafia/ModifierExpression.java` | 165 source lines across 1 files; prior grammar pass |
| ASH runtime | `src/main/java/net/sourceforge/kolmafia/textui/AshRuntime.java` | 537 source lines across 1 files; identified |
| JavaScript runtime | `src/main/java/net/sourceforge/kolmafia/textui/javascript/JavascriptRuntime.java` | 500 source lines across 1 files; identified |

## Available build census

| Snapshot | Tracked files | Commit |
|---|---:|---|
| kolmafia | 3954 | `d6747f7af98605b14eaeb2c63e11daa9532e1152` |

## Discovered module and subsystem catalogue

Rows below are mechanically named modules. Size and existence are SHOWN; behavior is UNDOCUMENTED unless a row links to an aspect or prior digest. Deeper payoff is ranked in [DEEPER_SYSTEMS.md](DEEPER_SYSTEMS.md).

| Module / subsystem | Path | Size signal | Documentation |
|---|---|---:|---|
| AdventureDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/AdventureDatabase.java` | 1002 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| AdventureQueueDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/AdventureQueueDatabase.java` | 294 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| AdventureSpentDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/AdventureSpentDatabase.java` | 222 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| Aliases | `src/main/java/net/sourceforge/kolmafia/persistence/Aliases.java` | 155 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| AscensionSnapshot | `src/main/java/net/sourceforge/kolmafia/persistence/AscensionSnapshot.java` | 470 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| BountyDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/BountyDatabase.java` | 256 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| BuffBotDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/BuffBotDatabase.java` | 347 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| CafeDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/CafeDatabase.java` | 106 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| CandyDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/CandyDatabase.java` | 605 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| CoinmastersDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/CoinmastersDatabase.java` | 448 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| ConcoctionDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/ConcoctionDatabase.java` | 2988 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| Consumable | `src/main/java/net/sourceforge/kolmafia/persistence/Consumable.java` | 187 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| ConsumablesDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/ConsumablesDatabase.java` | 1385 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| CupOf13sDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/CupOf13sDatabase.java` | 50 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| DailyLimitDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/DailyLimitDatabase.java` | 299 physical lines | selected aspect / prior grammar |
| DateTimeManager | `src/main/java/net/sourceforge/kolmafia/persistence/DateTimeManager.java` | 27 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| DebugDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/DebugDatabase.java` | 4294 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| EffectData | `src/main/java/net/sourceforge/kolmafia/persistence/EffectData.java` | 156 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| EffectDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/EffectDatabase.java` | 738 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| EquipmentDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/EquipmentDatabase.java` | 933 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| FactDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/FactDatabase.java` | 528 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| FamiliarDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/FamiliarDatabase.java` | 965 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| FaxBotDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/FaxBotDatabase.java` | 574 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| FlaggedItems | `src/main/java/net/sourceforge/kolmafia/persistence/FlaggedItems.java` | 328 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| HeartstoneDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/HeartstoneDatabase.java` | 35 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| HolidayDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/HolidayDatabase.java` | 1107 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| ItemDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/ItemDatabase.java` | 2604 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| ItemFinder | `src/main/java/net/sourceforge/kolmafia/persistence/ItemFinder.java` | 707 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| MallPriceDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/MallPriceDatabase.java` | 292 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| ModifierDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/ModifierDatabase.java` | 1800 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| MonsterDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/MonsterDatabase.java` | 1099 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| MonsterDrop | `src/main/java/net/sourceforge/kolmafia/persistence/MonsterDrop.java` | 63 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| NPCStoreDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/NPCStoreDatabase.java` | 670 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| PocketDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/PocketDatabase.java` | 863 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| ProfileSnapshot | `src/main/java/net/sourceforge/kolmafia/persistence/ProfileSnapshot.java` | 668 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| QuestDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/QuestDatabase.java` | 1239 physical lines | selected aspect / prior grammar |
| RestoresDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/RestoresDatabase.java` | 418 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| Script | `src/main/java/net/sourceforge/kolmafia/persistence/Script.java` | 183 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| ScriptManager | `src/main/java/net/sourceforge/kolmafia/persistence/ScriptManager.java` | 140 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| ShrunkenHeadDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/ShrunkenHeadDatabase.java` | 66 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| SkillDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/SkillDatabase.java` | 1816 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| StandardRewardDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/StandardRewardDatabase.java` | 265 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| TCRSDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/TCRSDatabase.java` | 1817 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| WardrobeOMaticDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/WardrobeOMaticDatabase.java` | 450 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| WitchessSolutionDatabase | `src/main/java/net/sourceforge/kolmafia/persistence/WitchessSolutionDatabase.java` | 188 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| ActionBarManager | `src/main/java/net/sourceforge/kolmafia/session/ActionBarManager.java` | 46 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| AutumnatonManager | `src/main/java/net/sourceforge/kolmafia/session/AutumnatonManager.java` | 200 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| BadMoonManager | `src/main/java/net/sourceforge/kolmafia/session/BadMoonManager.java` | 588 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| BanishManager | `src/main/java/net/sourceforge/kolmafia/session/BanishManager.java` | 635 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| BastilleBattalionManager | `src/main/java/net/sourceforge/kolmafia/session/BastilleBattalionManager.java` | 1115 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| BatManager | `src/main/java/net/sourceforge/kolmafia/session/BatManager.java` | 852 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| BeachManager | `src/main/java/net/sourceforge/kolmafia/session/BeachManager.java` | 416 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| BeretManager | `src/main/java/net/sourceforge/kolmafia/session/BeretManager.java` | 59 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| BlackAndWhiteApronManager | `src/main/java/net/sourceforge/kolmafia/session/BlackAndWhiteApronManager.java` | 176 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| BreakfastManager | `src/main/java/net/sourceforge/kolmafia/session/BreakfastManager.java` | 1001 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| BuffBotManager | `src/main/java/net/sourceforge/kolmafia/session/BuffBotManager.java` | 966 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| BugbearManager | `src/main/java/net/sourceforge/kolmafia/session/BugbearManager.java` | 228 physical lines | selected aspect / prior grammar |
| ChibiBuddyManager | `src/main/java/net/sourceforge/kolmafia/session/ChibiBuddyManager.java` | 203 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| ChoiceAdventures | `src/main/java/net/sourceforge/kolmafia/session/ChoiceAdventures.java` | 9690 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| ChoiceControl | `src/main/java/net/sourceforge/kolmafia/session/ChoiceControl.java` | 10271 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| ChoiceManager | `src/main/java/net/sourceforge/kolmafia/session/ChoiceManager.java` | 2553 physical lines | selected aspect / prior grammar |
| ChoiceOption | `src/main/java/net/sourceforge/kolmafia/session/ChoiceOption.java` | 59 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| ClanManager | `src/main/java/net/sourceforge/kolmafia/session/ClanManager.java` | 759 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| ConsequenceManager | `src/main/java/net/sourceforge/kolmafia/session/ConsequenceManager.java` | 332 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| ContactManager | `src/main/java/net/sourceforge/kolmafia/session/ContactManager.java` | 246 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| CryptManager | `src/main/java/net/sourceforge/kolmafia/session/CryptManager.java` | 378 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| CrystalBallManager | `src/main/java/net/sourceforge/kolmafia/session/CrystalBallManager.java` | 356 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| CursedMagnifyingGlassManager | `src/main/java/net/sourceforge/kolmafia/session/CursedMagnifyingGlassManager.java` | 48 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| DadManager | `src/main/java/net/sourceforge/kolmafia/session/DadManager.java` | 322 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| DailyDungeonManager | `src/main/java/net/sourceforge/kolmafia/session/DailyDungeonManager.java` | 72 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| DaylightShavingsHelmetManager | `src/main/java/net/sourceforge/kolmafia/session/DaylightShavingsHelmetManager.java` | 36 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| DemonName14Manager | `src/main/java/net/sourceforge/kolmafia/session/DemonName14Manager.java` | 269 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| DisplayCaseManager | `src/main/java/net/sourceforge/kolmafia/session/DisplayCaseManager.java` | 221 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| DreadScrollManager | `src/main/java/net/sourceforge/kolmafia/session/DreadScrollManager.java` | 351 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| DvorakManager | `src/main/java/net/sourceforge/kolmafia/session/DvorakManager.java` | 290 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| ElVibratoManager | `src/main/java/net/sourceforge/kolmafia/session/ElVibratoManager.java` | 391 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| EncounterManager | `src/main/java/net/sourceforge/kolmafia/session/EncounterManager.java` | 672 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| EquipmentManager | `src/main/java/net/sourceforge/kolmafia/session/EquipmentManager.java` | 1898 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| EquipmentRequirement | `src/main/java/net/sourceforge/kolmafia/session/EquipmentRequirement.java` | 46 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| EventManager | `src/main/java/net/sourceforge/kolmafia/session/EventManager.java` | 148 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| FamiliarManager | `src/main/java/net/sourceforge/kolmafia/session/FamiliarManager.java` | 136 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| GameproManager | `src/main/java/net/sourceforge/kolmafia/session/GameproManager.java` | 164 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| GoalManager | `src/main/java/net/sourceforge/kolmafia/session/GoalManager.java` | 225 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| GourdManager | `src/main/java/net/sourceforge/kolmafia/session/GourdManager.java` | 35 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| GreyYouManager | `src/main/java/net/sourceforge/kolmafia/session/GreyYouManager.java` | 866 physical lines | selected aspect / prior grammar |
| GrimstoneManager | `src/main/java/net/sourceforge/kolmafia/session/GrimstoneManager.java` | 283 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| GuildUnlockManager | `src/main/java/net/sourceforge/kolmafia/session/GuildUnlockManager.java` | 143 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| HaciendaManager | `src/main/java/net/sourceforge/kolmafia/session/HaciendaManager.java` | 435 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| HeistManager | `src/main/java/net/sourceforge/kolmafia/session/HeistManager.java` | 137 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| InventoryManager | `src/main/java/net/sourceforge/kolmafia/session/InventoryManager.java` | 2216 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| IslandManager | `src/main/java/net/sourceforge/kolmafia/session/IslandManager.java` | 1362 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| JickSwordManager | `src/main/java/net/sourceforge/kolmafia/session/JickSwordManager.java` | 128 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| JourneyManager | `src/main/java/net/sourceforge/kolmafia/session/JourneyManager.java` | 186 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| JuneCleaverManager | `src/main/java/net/sourceforge/kolmafia/session/JuneCleaverManager.java` | 104 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| LeafletManager | `src/main/java/net/sourceforge/kolmafia/session/LeafletManager.java` | 788 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| LeprecondoManager | `src/main/java/net/sourceforge/kolmafia/session/LeprecondoManager.java` | 438 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| LightsOutManager | `src/main/java/net/sourceforge/kolmafia/session/LightsOutManager.java` | 77 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| LimitMode | `src/main/java/net/sourceforge/kolmafia/session/LimitMode.java` | 305 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| LocketManager | `src/main/java/net/sourceforge/kolmafia/session/LocketManager.java` | 199 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| LoginManager | `src/main/java/net/sourceforge/kolmafia/session/LoginManager.java` | 287 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| LogoutManager | `src/main/java/net/sourceforge/kolmafia/session/LogoutManager.java` | 160 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| LostKeyManager | `src/main/java/net/sourceforge/kolmafia/session/LostKeyManager.java` | 62 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| LouvreManager | `src/main/java/net/sourceforge/kolmafia/session/LouvreManager.java` | 305 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| MailManager | `src/main/java/net/sourceforge/kolmafia/session/MailManager.java` | 132 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| MallPriceManager | `src/main/java/net/sourceforge/kolmafia/session/MallPriceManager.java` | 841 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| MayamManager | `src/main/java/net/sourceforge/kolmafia/session/MayamManager.java` | 49 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| MonorailManager | `src/main/java/net/sourceforge/kolmafia/session/MonorailManager.java` | 80 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| MonsterManuelManager | `src/main/java/net/sourceforge/kolmafia/session/MonsterManuelManager.java` | 572 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| MushroomManager | `src/main/java/net/sourceforge/kolmafia/session/MushroomManager.java` | 881 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| NemesisManager | `src/main/java/net/sourceforge/kolmafia/session/NemesisManager.java` | 284 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| NumberologyManager | `src/main/java/net/sourceforge/kolmafia/session/NumberologyManager.java` | 166 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| OceanManager | `src/main/java/net/sourceforge/kolmafia/session/OceanManager.java` | 463 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| PingManager | `src/main/java/net/sourceforge/kolmafia/session/PingManager.java` | 196 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| PortableLaughingStockManager | `src/main/java/net/sourceforge/kolmafia/session/PortableLaughingStockManager.java` | 119 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| PvpManager | `src/main/java/net/sourceforge/kolmafia/session/PvpManager.java` | 224 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| QuestManager | `src/main/java/net/sourceforge/kolmafia/session/QuestManager.java` | 2993 physical lines | selected aspect / prior grammar |
| RabbitHoleManager | `src/main/java/net/sourceforge/kolmafia/session/RabbitHoleManager.java` | 1424 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| ResponseTextParser | `src/main/java/net/sourceforge/kolmafia/session/ResponseTextParser.java` | 1012 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| ResultProcessor | `src/main/java/net/sourceforge/kolmafia/session/ResultProcessor.java` | 3139 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| RufusManager | `src/main/java/net/sourceforge/kolmafia/session/RufusManager.java` | 561 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| RumpleManager | `src/main/java/net/sourceforge/kolmafia/session/RumpleManager.java` | 751 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| SafetyShelterManager | `src/main/java/net/sourceforge/kolmafia/session/SafetyShelterManager.java` | 108 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| SorceressLairManager | `src/main/java/net/sourceforge/kolmafia/session/SorceressLairManager.java` | 1066 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| SpadingManager | `src/main/java/net/sourceforge/kolmafia/session/SpadingManager.java` | 150 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| StillSuitManager | `src/main/java/net/sourceforge/kolmafia/session/StillSuitManager.java` | 80 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| StoreManager | `src/main/java/net/sourceforge/kolmafia/session/StoreManager.java` | 756 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| TavernManager | `src/main/java/net/sourceforge/kolmafia/session/TavernManager.java` | 398 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| TowerDoorManager | `src/main/java/net/sourceforge/kolmafia/session/TowerDoorManager.java` | 602 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| TrackManager | `src/main/java/net/sourceforge/kolmafia/session/TrackManager.java` | 435 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| TrainsetManager | `src/main/java/net/sourceforge/kolmafia/session/TrainsetManager.java` | 214 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| TurnCounter | `src/main/java/net/sourceforge/kolmafia/session/TurnCounter.java` | 460 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| UnusualConstructManager | `src/main/java/net/sourceforge/kolmafia/session/UnusualConstructManager.java` | 97 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| ValhallaManager | `src/main/java/net/sourceforge/kolmafia/session/ValhallaManager.java` | 367 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| VampOutManager | `src/main/java/net/sourceforge/kolmafia/session/VampOutManager.java` | 169 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| VioletFogManager | `src/main/java/net/sourceforge/kolmafia/session/VioletFogManager.java` | 631 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| VolcanoMazeManager | `src/main/java/net/sourceforge/kolmafia/session/VolcanoMazeManager.java` | 1398 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| VoteMonsterManager | `src/main/java/net/sourceforge/kolmafia/session/VoteMonsterManager.java` | 139 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| VotingBoothManager | `src/main/java/net/sourceforge/kolmafia/session/VotingBoothManager.java` | 102 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| WitchessManager | `src/main/java/net/sourceforge/kolmafia/session/WitchessManager.java` | 68 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| WumpusManager | `src/main/java/net/sourceforge/kolmafia/session/WumpusManager.java` | 1248 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| YouRobotManager | `src/main/java/net/sourceforge/kolmafia/session/YouRobotManager.java` | 792 physical lines | selected aspect / prior grammar |
| TCRS.astral_consumables | `src/main/resources/data/TCRS.astral_consumables.txt` | 165 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| TCRS.astral_pets | `src/main/resources/data/TCRS.astral_pets.txt` | 825 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| adventures | `src/main/resources/data/adventures.txt` | 806 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| bookoffacts | `src/main/resources/data/bookoffacts.txt` | 90 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| bounty | `src/main/resources/data/bounty.txt` | 64 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| buffbots | `src/main/resources/data/buffbots.txt` | 14 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| cafe_booze | `src/main/resources/data/cafe_booze.txt` | 34 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| cafe_food | `src/main/resources/data/cafe_food.txt` | 46 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| classskills | `src/main/resources/data/classskills.txt` | 1942 physical lines | selected aspect / prior grammar |
| coinmasters | `src/main/resources/data/coinmasters.txt` | 1834 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| combats | `src/main/resources/data/combats.txt` | 613 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| concoctions | `src/main/resources/data/concoctions.txt` | 3111 physical lines | selected aspect / prior grammar |
| consequences | `src/main/resources/data/consequences.txt` | 199 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| cultshorts | `src/main/resources/data/cultshorts.txt` | 713 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| cup_of_13s | `src/main/resources/data/cup_of_13s.txt` | 5536 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| dailylimits | `src/main/resources/data/dailylimits.txt` | 442 physical lines | selected aspect / prior grammar |
| defaults | `src/main/resources/data/defaults.txt` | 3898 physical lines | selected aspect / prior grammar |
| encounters | `src/main/resources/data/encounters.txt` | 313 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| equipment | `src/main/resources/data/equipment.txt` | 3881 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| fambattle | `src/main/resources/data/fambattle.txt` | 372 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| familiars | `src/main/resources/data/familiars.txt` | 370 physical lines | selected aspect / prior grammar |
| faxbots | `src/main/resources/data/faxbots.txt` | 8 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| foldgroups | `src/main/resources/data/foldgroups.txt` | 30 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| fullness | `src/main/resources/data/fullness.txt` | 1180 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| inebriety | `src/main/resources/data/inebriety.txt` | 814 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| items | `src/main/resources/data/items.txt` | 12373 physical lines | selected aspect / prior grammar |
| journeyman | `src/main/resources/data/journeyman.txt` | 1080 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| modifiers | `src/main/resources/data/modifiers.txt` | 16114 physical lines | selected aspect / prior grammar |
| monsterparts | `src/main/resources/data/monsterparts.txt` | 2354 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| monsters | `src/main/resources/data/monsters.txt` | 2971 physical lines | selected aspect / prior grammar |
| nonfilling | `src/main/resources/data/nonfilling.txt` | 33 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| npcstores | `src/main/resources/data/npcstores.txt` | 481 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| ocean | `src/main/resources/data/ocean.txt` | 251 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| outfits | `src/main/resources/data/outfits.txt` | 198 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| packages | `src/main/resources/data/packages.txt` | 13 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| pulverize | `src/main/resources/data/pulverize.txt` | 542 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| questscouncil | `src/main/resources/data/questscouncil.txt` | 612 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| questslog | `src/main/resources/data/questslog.txt` | 136 physical lines | selected aspect / prior grammar |
| restores | `src/main/resources/data/restores.txt` | 176 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| shoprows | `src/main/resources/data/shoprows.txt` | 1760 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| shops | `src/main/resources/data/shops.txt` | 150 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| spleenhit | `src/main/resources/data/spleenhit.txt` | 266 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| standard-pulverized | `src/main/resources/data/standard-pulverized.txt` | 27 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| standard-rewards | `src/main/resources/data/standard-rewards.txt` | 147 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| statuseffects | `src/main/resources/data/statuseffects.txt` | 3150 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| tcrs | `src/main/resources/data/tcrs.txt` | 420 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| volcanomaze | `src/main/resources/data/volcanomaze.txt` | 38 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| wereprofessor | `src/main/resources/data/wereprofessor.txt` | 60 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| witchess_solutions | `src/main/resources/data/witchess_solutions.txt` | 152 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| zapgroups | `src/main/resources/data/zapgroups.txt` | 227 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| zonelist | `src/main/resources/data/zonelist.txt` | 215 physical lines | **UNDOCUMENTED** in this aspect pass; identified only |
| Java module AdventureResult.java | `src/main/java/net/sourceforge/kolmafia/AdventureResult.java` | 1 files / 1613 lines | **UNDOCUMENTED** remainder |
| Java module AreaCombatData.java | `src/main/java/net/sourceforge/kolmafia/AreaCombatData.java` | 1 files / 2018 lines | **UNDOCUMENTED** remainder |
| Java module AscensionClass.java | `src/main/java/net/sourceforge/kolmafia/AscensionClass.java` | 1 files / 279 lines | **UNDOCUMENTED** remainder |
| Java module AscensionPath.java | `src/main/java/net/sourceforge/kolmafia/AscensionPath.java` | 1 files / 261 lines | **UNDOCUMENTED** remainder |
| Java module BuffBotHome.java | `src/main/java/net/sourceforge/kolmafia/BuffBotHome.java` | 1 files / 330 lines | **UNDOCUMENTED** remainder |
| Java module CakeArenaManager.java | `src/main/java/net/sourceforge/kolmafia/CakeArenaManager.java` | 1 files / 170 lines | **UNDOCUMENTED** remainder |
| Java module CoinmasterData.java | `src/main/java/net/sourceforge/kolmafia/CoinmasterData.java` | 1 files / 1594 lines | **UNDOCUMENTED** remainder |
| Java module CoinmasterRegistry.java | `src/main/java/net/sourceforge/kolmafia/CoinmasterRegistry.java` | 1 files / 247 lines | **UNDOCUMENTED** remainder |
| Java module CreateFrameRunnable.java | `src/main/java/net/sourceforge/kolmafia/CreateFrameRunnable.java` | 1 files / 283 lines | **UNDOCUMENTED** remainder |
| Java module DeadlockDetector.java | `src/main/java/net/sourceforge/kolmafia/DeadlockDetector.java` | 1 files / 55 lines | **UNDOCUMENTED** remainder |
| Java module DebugModifiers.java | `src/main/java/net/sourceforge/kolmafia/DebugModifiers.java` | 1 files / 211 lines | **UNDOCUMENTED** remainder |
| Java module EdServantData.java | `src/main/java/net/sourceforge/kolmafia/EdServantData.java` | 1 files / 556 lines | **UNDOCUMENTED** remainder |
| Java module Expression.java | `src/main/java/net/sourceforge/kolmafia/Expression.java` | 1 files / 796 lines | **UNDOCUMENTED** remainder |
| Java module ExpressionOverrides.java | `src/main/java/net/sourceforge/kolmafia/ExpressionOverrides.java` | 1 files / 60 lines | **UNDOCUMENTED** remainder |
| Java module FamiliarData.java | `src/main/java/net/sourceforge/kolmafia/FamiliarData.java` | 1 files / 1745 lines | **UNDOCUMENTED** remainder |
| Java module FamiliarTool.java | `src/main/java/net/sourceforge/kolmafia/FamiliarTool.java` | 1 files / 186 lines | **UNDOCUMENTED** remainder |
| Java module ImageCachingEditorKit.java | `src/main/java/net/sourceforge/kolmafia/ImageCachingEditorKit.java` | 1 files / 56 lines | **UNDOCUMENTED** remainder |
| Java module KoLAdventure.java | `src/main/java/net/sourceforge/kolmafia/KoLAdventure.java` | 1 files / 4658 lines | **UNDOCUMENTED** remainder |
| Java module KoLCharacter.java | `src/main/java/net/sourceforge/kolmafia/KoLCharacter.java` | 1 files / 6289 lines | **UNDOCUMENTED** remainder |
| Java module KoLConstants.java | `src/main/java/net/sourceforge/kolmafia/KoLConstants.java` | 1 files / 676 lines | **UNDOCUMENTED** remainder |
| Java module KoLDesktop.java | `src/main/java/net/sourceforge/kolmafia/KoLDesktop.java` | 1 files / 373 lines | **UNDOCUMENTED** remainder |
| Java module KoLGUIConstants.java | `src/main/java/net/sourceforge/kolmafia/KoLGUIConstants.java` | 1 files / 131 lines | **UNDOCUMENTED** remainder |
| Java module KoLMailMessage.java | `src/main/java/net/sourceforge/kolmafia/KoLMailMessage.java` | 1 files / 137 lines | **UNDOCUMENTED** remainder |
| Java module KoLmafia.java | `src/main/java/net/sourceforge/kolmafia/KoLmafia.java` | 1 files / 1943 lines | **UNDOCUMENTED** remainder |
| Java module KoLmafiaASH.java | `src/main/java/net/sourceforge/kolmafia/KoLmafiaASH.java` | 1 files / 320 lines | **UNDOCUMENTED** remainder |
| Java module KoLmafiaCLI.java | `src/main/java/net/sourceforge/kolmafia/KoLmafiaCLI.java` | 1 files / 1027 lines | **UNDOCUMENTED** remainder |
| Java module KoLmafiaGUI.java | `src/main/java/net/sourceforge/kolmafia/KoLmafiaGUI.java` | 1 files / 314 lines | **UNDOCUMENTED** remainder |
| Java module KoLmafiaTUI.java | `src/main/java/net/sourceforge/kolmafia/KoLmafiaTUI.java` | 1 files / 46 lines | **UNDOCUMENTED** remainder |
| Java module Modeable.java | `src/main/java/net/sourceforge/kolmafia/Modeable.java` | 1 files / 195 lines | **UNDOCUMENTED** remainder |
| Java module ModifierExpression.java | `src/main/java/net/sourceforge/kolmafia/ModifierExpression.java` | 1 files / 165 lines | **UNDOCUMENTED** remainder |
| Java module ModifierType.java | `src/main/java/net/sourceforge/kolmafia/ModifierType.java` | 1 files / 96 lines | **UNDOCUMENTED** remainder |
| Java module Modifiers.java | `src/main/java/net/sourceforge/kolmafia/Modifiers.java` | 1 files / 1772 lines | **UNDOCUMENTED** remainder |
| Java module MonsterData.java | `src/main/java/net/sourceforge/kolmafia/MonsterData.java` | 1 files / 2477 lines | **UNDOCUMENTED** remainder |
| Java module MonsterExpression.java | `src/main/java/net/sourceforge/kolmafia/MonsterExpression.java` | 1 files / 66 lines | **UNDOCUMENTED** remainder |
| Java module PastaThrallData.java | `src/main/java/net/sourceforge/kolmafia/PastaThrallData.java` | 1 files / 511 lines | **UNDOCUMENTED** remainder |
| Java module PokefamData.java | `src/main/java/net/sourceforge/kolmafia/PokefamData.java` | 1 files / 362 lines | **UNDOCUMENTED** remainder |
| Java module RequestEditorKit.java | `src/main/java/net/sourceforge/kolmafia/RequestEditorKit.java` | 1 files / 2706 lines | **UNDOCUMENTED** remainder |
| Java module RequestLogger.java | `src/main/java/net/sourceforge/kolmafia/RequestLogger.java` | 1 files / 1326 lines | **UNDOCUMENTED** remainder |
| Java module RequestThread.java | `src/main/java/net/sourceforge/kolmafia/RequestThread.java` | 1 files / 358 lines | **UNDOCUMENTED** remainder |
| Java module RestoreExpression.java | `src/main/java/net/sourceforge/kolmafia/RestoreExpression.java` | 1 files / 51 lines | **UNDOCUMENTED** remainder |
| Java module RestrictedItemType.java | `src/main/java/net/sourceforge/kolmafia/RestrictedItemType.java` | 1 files / 24 lines | **UNDOCUMENTED** remainder |
| Java module SpecialOutfit.java | `src/main/java/net/sourceforge/kolmafia/SpecialOutfit.java` | 1 files / 560 lines | **UNDOCUMENTED** remainder |
| Java module Speculation.java | `src/main/java/net/sourceforge/kolmafia/Speculation.java` | 1 files / 299 lines | **UNDOCUMENTED** remainder |
| Java module StaticEntity.java | `src/main/java/net/sourceforge/kolmafia/StaticEntity.java` | 1 files / 699 lines | **UNDOCUMENTED** remainder |
| Java module VYKEACompanionData.java | `src/main/java/net/sourceforge/kolmafia/VYKEACompanionData.java` | 1 files / 604 lines | **UNDOCUMENTED** remainder |
| Java module ZodiacSign.java | `src/main/java/net/sourceforge/kolmafia/ZodiacSign.java` | 1 files / 88 lines | **UNDOCUMENTED** remainder |
| Java module chat | `src/main/java/net/sourceforge/kolmafia/chat` | 19 files / 3692 lines | **UNDOCUMENTED** remainder |
| Java module combat | `src/main/java/net/sourceforge/kolmafia/combat` | 8 files / 2295 lines | **UNDOCUMENTED** remainder |
| Java module equipment | `src/main/java/net/sourceforge/kolmafia/equipment` | 2 files / 131 lines | **UNDOCUMENTED** remainder |
| Java module listener | `src/main/java/net/sourceforge/kolmafia/listener` | 7 files / 376 lines | **UNDOCUMENTED** remainder |
| Java module maximizer | `src/main/java/net/sourceforge/kolmafia/maximizer` | 13 files / 6086 lines | **UNDOCUMENTED** remainder |
| Java module modifiers | `src/main/java/net/sourceforge/kolmafia/modifiers` | 16 files / 2458 lines | **UNDOCUMENTED** remainder |
| Java module moods | `src/main/java/net/sourceforge/kolmafia/moods` | 9 files / 3541 lines | **UNDOCUMENTED** remainder |
| Java module objectpool | `src/main/java/net/sourceforge/kolmafia/objectpool` | 9 files / 7946 lines | **UNDOCUMENTED** remainder |
| Java module pages | `src/main/java/net/sourceforge/kolmafia/pages` | 4 files / 91 lines | **UNDOCUMENTED** remainder |
| Java module persistence | `src/main/java/net/sourceforge/kolmafia/persistence` | 45 files / 33847 lines | **UNDOCUMENTED** remainder |
| Java module preferences | `src/main/java/net/sourceforge/kolmafia/preferences` | 4 files / 1390 lines | **UNDOCUMENTED** remainder |
| Java module request | `src/main/java/net/sourceforge/kolmafia/request` | 319 files / 96771 lines | **UNDOCUMENTED** remainder |
| Java module scripts | `src/main/java/net/sourceforge/kolmafia/scripts` | 12 files / 3149 lines | **UNDOCUMENTED** remainder |
| Java module session | `src/main/java/net/sourceforge/kolmafia/session` | 96 files / 68101 lines | **UNDOCUMENTED** remainder |
| Java module shop | `src/main/java/net/sourceforge/kolmafia/shop` | 4 files / 1590 lines | **UNDOCUMENTED** remainder |
| Java module swingui | `src/main/java/net/sourceforge/kolmafia/swingui` | 152 files / 45905 lines | **UNDOCUMENTED** remainder |
| Java module textui | `src/main/java/net/sourceforge/kolmafia/textui` | 372 files / 57120 lines | **UNDOCUMENTED** remainder |
| Java module utilities | `src/main/java/net/sourceforge/kolmafia/utilities` | 34 files / 5510 lines | **UNDOCUMENTED** remainder |
| Java module webui | `src/main/java/net/sourceforge/kolmafia/webui` | 20 files / 10059 lines | **UNDOCUMENTED** remainder |

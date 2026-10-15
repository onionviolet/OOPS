# ngu-idle: system inventory

Status: PARTIAL. Every distinct family found in the inspected build/export is routed below, followed by a complete discovered source-unit index. This is an inventory of the available snapshot, not a claim to identify every behavior hidden in unparsed scenes, native bodies or server code. A class/helper/asset is a size signal, not necessarily an independent gameplay system. UNDOCUMENTED means no full semantic trace was located, even where a prior lane mentioned its name.

| Family | Where it lives | Size signal | Prior/new documentation |
|---|---|---|---|
| State, save, platform, migration | `Character, PlayerData, SaveData, ImportExport, OpenFileDialog` | 342 C# units in total; family spans several controllers | Prior selected; A03/A04 extend |
| Encounter narrative and portraits | `BossNameStory, BossController, TextAssets` | 301 boss assets, 19 empty; 27 other TextAssets | NEW A01/A02 |
| Combat and special enemies | `EnemyAI, AI, Enemy, AdventureController` | 7 ordinary dispatch modes plus specials | NEW selected A05; full semantics undocumented |
| Run growth and resets | `Training, Augments, TimeMachine, BloodMagic, Challenges` | Several distinct allocations and challenge controllers | Prior selected |
| Retained progression | `NGU, Beards, Hacks, Wishes` | 4 named growth families | Prior reset/unlock selected |
| Fruit, diggers, quests and ITOPOD | `Yggdrasil, Diggers, BeastQuest, ITOPOD` | Separate models/controllers | Prior gates only; full formulas undocumented |
| Inventory, loadouts and crafting-like transformations | `Inventory, Equipment, Item, Loadout` | Source-unit counts below | Prior selected; full content undocumented |
| Collections and late boards | `AchievementList, Bestiary, Portraits, Cards, Cooking` | Separate retained models in PlayerData | Inventory only outside selected offline paths |
| Daily rewards and purchases | `Daily, Pit, LootBoxes, Arbitrary` | Source-unit counts below | Undocumented in depth |
| UI, number formatting and help | `NumberOutput, TutorialPanel, controllers/tooltips` | 27 support TextAssets; controller census below | Prior selected, A06/A11 extend |

Top three deeper reads: [DEEPER_SYSTEMS.md](DEEPER_SYSTEMS.md). Exact remaining gaps: [CHECKPOINT.md](CHECKPOINT.md).

## Discovered source-unit index

Every unit below is structurally indexed. Semantic coverage is restricted to the cited A01-A12 paths and prior selected traces. Units with no such citation remain undocumented in depth. Counts for repeated IDs are per asset. No raw prose or source bodies are included.

| Unit / locator | Bytes, rows or references | Coverage limit |
|---|---|---|
| `AGAPI.cs` | 11807 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AI.cs` | 85 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AchievementController.cs` | 1760 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AchievementList.cs` | 904 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AdvancedTraining.cs` | 1627 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AdvancedTrainingController.cs` | 9320 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Adventure.cs` | 9835 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AdventureController.cs` | 161795 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AdventureFruitController.cs` | 8245 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AdventureMapIcon.cs` | 616 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AdventurePurchases.cs` | 39528 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AllAchievementsController.cs` | 22325 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AllAdvancedTraining.cs` | 5028 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AllArbitraryController.cs` | 4135 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AllAugsController.cs` | 5055 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AllBeardsController.cs` | 15397 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AllBloodMagicController.cs` | 2876 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AllChallengesController.cs` | 8770 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AllCustomButtons.cs` | 374 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AllDaycareController.cs` | 3571 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AllDefenseTraining.cs` | 689 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AllGoldDiggerController.cs` | 17474 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AllItemListController.cs` | 35981 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AllNGUController.cs` | 38648 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AllOffenseTraining.cs` | 1054 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AllSettingsController.cs` | 2390 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AllSpellsController.cs` | 286 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AllYggdrasil.cs` | 6667 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ApPackDisplay.cs` | 24862 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Arbitrary.cs` | 4827 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ArbitraryController.cs` | 108337 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ArbitraryHover.cs` | 894 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AttackDefense.cs` | 951 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Aug.cs` | 3443 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AugTooltipTrigger.cs` | 474 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AugmentController.cs` | 21340 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Augmentation.cs` | 1456 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AutoAdvance.cs` | 458 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `AutoMergeTooltip.cs` | 1486 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Bar10Click.cs` | 260 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Bar1Click.cs` | 258 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `BasicChallengeController.cs` | 10530 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `BasicSample.cs` | 3810 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Beard.cs` | 356 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `BeardController.cs` | 12039 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Beards.cs` | 726 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `BeastMode.cs` | 2413 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `BeastQuest.cs` | 1423 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `BeastQuestController.cs` | 25820 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `BeastQuestPerkController.cs` | 25106 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `BeastQuestPerkUIController.cs` | 3906 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Bestiary.cs` | 440 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `BestiaryController.cs` | 6516 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `BestiaryIconController.cs` | 1768 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `BestiaryInfo.cs` | 122 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `BinaryFormatterExtensions.cs` | 1191 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `BlackHole.cs` | 451 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `BlindChallengeController.cs` | 10785 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Block.cs` | 1910 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `BloodMagic.cs` | 1038 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `BloodMagicController.cs` | 11013 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `BootsController.cs` | 3423 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Boss.cs` | 2350 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `BossController.cs` | 15348 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `BossInfoDisplay.cs` | 917 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `BossNameStory.cs` | 135 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ButtonShower.cs` | 23868 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `CUIColorPicker.cs` | 6163 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `CanvasSampleOpenFileImage.cs` | 799 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `CanvasSampleOpenFileText.cs` | 787 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `CanvasSampleOpenFileTextMultiple.cs` | 1084 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `CanvasSampleSaveFileImage.cs` | 1007 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `CanvasSampleSaveFileText.cs` | 669 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Card.cs` | 1423 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `CardBonusListUI.cs` | 888 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Cards.cs` | 1358 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `CardsController.cs` | 57947 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Challenge.cs` | 1728 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ChallengeController.cs` | 291 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Challenges.cs` | 2556 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Character.cs` | 133731 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Charge.cs` | 2239 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ChestController.cs` | 3433 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ConfirmationBox.cs` | 1712 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Cooking.cs` | 1417 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `CookingController.cs` | 21961 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Crypto.cs` | 2087 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `CurrentAttackHover.cs` | 130 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `CurrentChallengeInfo.cs` | 4727 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `CustomButton1Controller.cs` | 13024 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `CustomButton2Controller.cs` | 1169 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `DailyReward.cs` | 354 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `DailyRewardController.cs` | 38423 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `DaycareItemController.cs` | 9205 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `DeckPodUI.cs` | 5164 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `DefenseBuff.cs` | 2556 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `DefenseClickAdd.cs` | 373 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `DefenseClickCap.cs` | 257 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `DefenseClickRemove.cs` | 269 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `DefenseTraining.cs` | 12544 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `DeselectDropdown.cs` | 265 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `DiggerLevelUpButton.cs` | 469 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `DisabledButtonTooltip.cs` | 819 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `DiscordLink.cs` | 2002 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `DishProperty.cs` | 154 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `DragPageChanger.cs` | 312 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Enemy.cs` | 1308 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `EnemyAI.cs` | 46331 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Energy.cs` | 5275 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `EnergyInputController.cs` | 5906 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `EnergyNextSpeed.cs` | 952 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `EnergyPurchases.cs` | 25109 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `EnergySpeed10Click.cs` | 271 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `EnergySpeedClick.cs` | 268 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Epoch.cs` | 402 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Equipment.cs` | 14872 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `EquipmentDisplay.cs` | 1131 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ExpDisplay.cs` | 360 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ExpStatDisplay.cs` | 524 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Fart.cs` | 432 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `FightButton.cs` | 527 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `FilterToggle.cs` | 643 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Fruit.cs` | 1213 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `FruitController.cs` | 37133 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Generic3Toggle.cs` | 1729 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `GenericFruitController.cs` | 134 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `GenericInputSetting.cs` | 2491 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `GenericMultiSettings.cs` | 2164 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `GenericPanelSwap.cs` | 658 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `GenericToggleSettings.cs` | 4613 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `GenericTooltipMessager.cs` | 440 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `GoldDigger.cs` | 268 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `GoldDiggerUIController.cs` | 6789 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `GoldDiggers.cs` | 582 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `GoldFruitController.cs` | 7549 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `HPBar.cs` | 774 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Hack.cs` | 205 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `HackProperties.cs` | 242 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `HackUIController.cs` | 4354 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Hacks.cs` | 507 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `HacksController.cs` | 16013 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `HeadController.cs` | 3413 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Heal.cs` | 2185 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Hour24ChallengeController.cs` | 11894 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `HoverTooltip.cs` | 17809 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `HoverTooltipSmall.cs` | 1469 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `HpTooltipTrigger.cs` | 710 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `HyperRegen.cs` | 1990 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ITOPOD.cs` | 885 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `IdleAttack.cs` | 1593 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ImportExport.cs` | 59971 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `InfoButtonShower.cs` | 128 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `InfoDisplay.cs` | 8877 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `InfonStuffController.cs` | 10507 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Ingredient.cs` | 375 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `IngredientPodUI.cs` | 1519 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `IngredientProperty.cs` | 227 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Inventory.cs` | 13603 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `InventoryController.cs` | 154843 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `InventoryMenuInfo.cs` | 446 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ItemController.cs` | 38063 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ItemList.cs` | 16652 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ItemListController.cs` | 25461 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ItemListDisplayController.cs` | 433 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ItemNameDesc.cs` | 323529 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ItopodNameListController.cs` | 2796 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ItopodPerkController.cs` | 48550 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ItopodPerkUIController.cs` | 6211 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `KartridgeAPI.cs` | 25580 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `KnowledgeFruitController.cs` | 7847 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `KongregateAPIBehaviour.cs` | 45558 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `LaserSwordChallengeController.cs` | 10789 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `LegsController.cs` | 3421 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `LevelChallenge10KController.cs` | 10883 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `LittleRebirthTimer.cs` | 343 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `LoadButtonHover.cs` | 814 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Loadout.cs` | 1051 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `LoadoutController.cs` | 21645 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `LoadoutDisplayController.cs` | 4523 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `LoadoutLabelController.cs` | 532 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `LootBoxController.cs` | 1590 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `LootBoxes.cs` | 298 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `LootDrop.cs` | 226392 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `LootFilterType.cs` | 3663 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `MachineGoldMultiTrigger.cs` | 494 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `MachineSpeedTrigger.cs` | 486 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Magic.cs` | 735 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `MagicDisplay.cs` | 5051 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `MagicPurchases.cs` | 20633 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `MainMenuController.cs` | 11532 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Mana.cs` | 192 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ManaUI.cs` | 164 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `MegaBuff.cs` | 2999 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `MenuIDSwapper.cs` | 177 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `MenuSwapper.cs` | 3325 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `MiscPurchases.cs` | 10789 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `MiscStatsDisplay.cs` | 2515 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Move69.cs` | 2245 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `MultiLoadoutController.cs` | 3708 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `NGU.cs` | 978 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `NGUChallengeController.cs` | 9997 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `NGUController.cs` | 23869 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `NGUMagicController.cs` | 21720 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `NGUResolutions.cs` | 5567 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `NUMBERSSGOUP.cs` | 888 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `NewBehaviourScript.cs` | 130 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `NewbiePackChecker.cs` | 620 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `NoAugsChallengeController.cs` | 10253 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `NoEquipmentChallengeController.cs` | 10751 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `NoRebirthChallengeController.cs` | 11490 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `NukeInfo.cs` | 509 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `NumberDisplaySettings.cs` | 1055 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `NumberFormat.cs` | 6118 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `NumberOutput.cs` | 8808 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `OSType.cs` | 59 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `OffenseBuff.cs` | 2612 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `OffenseClickAdd.cs` | 373 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `OffenseClickCap.cs` | 257 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `OffenseClickRemove.cs` | 269 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `OffenseTraining.cs` | 12598 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Office.cs` | 137 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `OfflineProgressSplashScreen.cs` | 1407 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `OhShit.cs` | 2176 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `OpenFileDialog.cs` | 50065 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Paralyze.cs` | 2056 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Parry.cs` | 2187 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Perk.cs` | 508 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Perks.cs` | 2058 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `PiercingAttack.cs` | 2245 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Pit.cs` | 545 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `PitController.cs` | 39280 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `PlayerController.cs` | 27405 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `PlayerData.cs` | 2335 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `PlayerLog.cs` | 1553 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `PlayerPortraits.cs` | 668 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `PlayerSettings.cs` | 6664 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `PlayerTime.cs` | 2813 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `PomegranateController.cs` | 7482 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `PossibleSpinRewardController.cs` | 997 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Properties/AssemblyInfo.cs` | 130 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Purchases.cs` | 2429 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `QuickloadHover.cs` | 949 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `QuicksaveHover.cs` | 1719 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Rebirth.cs` | 24867 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `RebirthAttackHover.cs` | 577 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `RebirthButtonHover.cs` | 1881 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `RebirthPowerDisplay.cs` | 6331 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `RebirthPowerSpell.cs` | 17653 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `RebirthReminders.cs` | 1937 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `RecyclerTooltip.cs` | 575 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `RegularAttack.cs` | 2128 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Resource3.cs` | 1395 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Resource3Display.cs` | 7537 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Resource3Purchases.cs` | 22531 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Ritual.cs` | 2283 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `SFB/ExtensionFilter.cs` | 186 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `SFB/IStandaloneFileBrowser.cs` | 720 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `SFB/StandaloneFileBrowser.cs` | 2825 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `SFB/StandaloneFileBrowserWindows.cs` | 4264 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `SFB/WindowWrapper.cs` | 223 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `SaveButtonHover.cs` | 1290 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `SaveData.cs` | 219 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `SeedIconHover.cs` | 1047 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `SelfSwap.cs` | 91 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ShakeySalesPanel.cs` | 2199 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `SpecialController.cs` | 1280 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `SpendExpButtons.cs` | 2918 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `SpendExpTooltipTrigger.cs` | 618 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `StartMenu.cs` | 1146 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `StatBoostPurchases.cs` | 8332 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `StatFruitController.cs` | 7537 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Stats.cs` | 807 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `StatsDisplay.cs` | 88440 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `SteamManager.cs` | 52320 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `StopButton.cs` | 455 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `StoredCharacter.cs` | 124 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `StoredStats.cs` | 595 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `StrongAttack.cs` | 2229 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `TagUI.cs` | 132 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `TestEquip.cs` | 121 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ThreeChoiceBox.cs` | 1984 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `TimeMachine.cs` | 4009 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `TimeMachineChallengeController.cs` | 11298 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `TimeMachineController.cs` | 21244 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `TimerUp.cs` | 1030 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `TitanFilterToggle.cs` | 657 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `TitanHPBars.cs` | 672 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `TooltipDisplay.cs` | 1830 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `TooltipLog.cs` | 672 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `TooltipToggle.cs` | 672 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `TotalTimePlayed.cs` | 500 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Training.cs` | 4009 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Trash.cs` | 3487 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `TrollButton.cs` | 333 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `TrollChallengeController.cs` | 24442 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `TutorialPanel.cs` | 5129 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `UIThemeController.cs` | 3804 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `UltimateAttack.cs` | 2313 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `UltimateBuff.cs` | 2599 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `UnlockTooltipDisplay.cs` | 402 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `UpdateChecker.cs` | 3894 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `UpgradeTooltipTrigger.cs` | 482 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `VersionNumbering.cs` | 383 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `WTFController.cs` | 1227 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `WaldoSaysUnlocker.cs` | 3127 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Wandoos98.cs` | 1743 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Wandoos98Controller.cs` | 19415 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `WandoosBootupTooltip.cs` | 486 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `WandoosEnergyTooltip.cs` | 482 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `WandoosMagicTooltip.cs` | 480 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `WeaponController.cs` | 3449 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Wish.cs` | 323 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `WishPodUIController.cs` | 3455 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `WishProperties.cs` | 291 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `WishSpeedCompare.cs` | 223 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Wishes.cs` | 711 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `WishesController.cs` | 32829 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `XmasController.cs` | 1678 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `Yggdrasil.cs` | 2622 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `YggdrasilChallengeController.cs` | 4559 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `YggdrasilDisplay.cs` | 488 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `YggdrasilEXPPurchases.cs` | 3138 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ZoneBackwardsClick.cs` | 546 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ZoneForwardClick.cs` | 9408 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `ZoneSelector.cs` | 1641 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `bestiaryType.cs` | 46 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `cardBonus.cs` | 204 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `cardType.cs` | 46 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `challengeType.cs` | 121 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `difficulty.cs` | 53 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `enemyType.cs` | 639 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `filterBy.cs` | 46 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `itopodPerk.cs` | 273 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `manaType.cs` | 69 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `orderPerks.cs` | 60 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `orderQuirks.cs` | 61 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `orderWish.cs` | 59 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `part.cs` | 131 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `perkType.cs` | 74 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `platform.cs` | 56 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `rarity.cs` | 85 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `specType.cs` | 637 | C# source unit; prior/new semantic coverage only where cited in A01-A12 |
| `resources.assets / 834 / Rebirth` | 1463 | TextAsset inventory; selected texts only |
| `resources.assets / 835 / Cooking` | 2133 | TextAsset inventory; selected texts only |
| `resources.assets / 836 / Itopod` | 1753 | TextAsset inventory; selected texts only |
| `resources.assets / 837 / Beards` | 1514 | TextAsset inventory; selected texts only |
| `resources.assets / 838 / Number` | 1495 | TextAsset inventory; selected texts only |
| `resources.assets / 839 / Adventure` | 825 | TextAsset inventory; selected texts only |
| `resources.assets / 840 / Hacks` | 2218 | TextAsset inventory; selected texts only |
| `resources.assets / 841 / BasicInfoStandalone` | 1816 | TextAsset inventory; selected texts only |
| `resources.assets / 842 / Inventory` | 6459 | TextAsset inventory; selected texts only |
| `resources.assets / 843 / Training` | 1335 | TextAsset inventory; selected texts only |
| `resources.assets / 844 / NGU` | 747 | TextAsset inventory; selected texts only |
| `resources.assets / 845 / MacGuffins` | 1469 | TextAsset inventory; selected texts only |
| `resources.assets / 846 / BasicInfo` | 1415 | TextAsset inventory; selected texts only |
| `resources.assets / 847 / Wishes` | 1761 | TextAsset inventory; selected texts only |
| `resources.assets / 848 / Exp` | 429 | TextAsset inventory; selected texts only |
| `resources.assets / 849 / Diggers` | 1392 | TextAsset inventory; selected texts only |
| `resources.assets / 850 / TooltipText` | 4032 | TextAsset inventory; selected texts only |
| `resources.assets / 851 / Yggdrasil` | 855 | TextAsset inventory; selected texts only |
| `resources.assets / 852 / PatchNotes` | 3195 | TextAsset inventory; selected texts only |
| `resources.assets / 853 / SplashSubtitle` | 252 | TextAsset inventory; selected texts only |
| `resources.assets / 854 / BloodMagic` | 2069 | TextAsset inventory; selected texts only |
| `resources.assets / 855 / AdvancedTraining` | 434 | TextAsset inventory; selected texts only |
| `resources.assets / 856 / Augmentation` | 1009 | TextAsset inventory; selected texts only |
| `resources.assets / 857 / Questing` | 2412 | TextAsset inventory; selected texts only |
| `resources.assets / 858 / TimeMachine` | 996 | TextAsset inventory; selected texts only |
| `resources.assets / 859 / CARDS` | 3578 | TextAsset inventory; selected texts only |
| `resources.assets / 860 / Wandoos` | 1877 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2184 / boss (293)` | 490 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2185 / boss (175)` | 440 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2186 / boss (276)` | 0 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2187 / boss (35)` | 169 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2188 / boss (177)` | 653 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2189 / boss (117)` | 1131 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2190 / boss (268)` | 458 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2191 / boss (65)` | 564 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2192 / boss (290)` | 312 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2193 / boss (73)` | 720 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2194 / boss (17)` | 1925 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2195 / boss (158)` | 1003 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2196 / boss (218)` | 424 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2197 / boss (27)` | 157 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2198 / boss (43)` | 312 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2199 / boss (174)` | 1475 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2200 / boss (164)` | 423 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2201 / boss (20)` | 59 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2202 / boss (256)` | 1082 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2203 / boss (134)` | 672 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2204 / boss (113)` | 314 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2205 / boss (145)` | 550 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2206 / boss (259)` | 721 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2207 / boss (74)` | 2018 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2208 / boss (298)` | 207 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2209 / boss (181)` | 808 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2210 / boss (129)` | 378 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2211 / boss (168)` | 420 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2212 / boss (229)` | 754 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2213 / boss (116)` | 2199 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2214 / boss (120)` | 667 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2215 / boss (30)` | 1436 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2216 / boss (36)` | 314 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2217 / boss (197)` | 450 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2218 / boss (34)` | 152 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2219 / boss (7)` | 628 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2220 / boss (245)` | 494 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2221 / boss (173)` | 432 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2222 / boss (160)` | 713 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2223 / boss (44)` | 450 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2224 / boss (128)` | 942 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2225 / boss (118)` | 62 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2226 / boss (262)` | 421 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2227 / boss (133)` | 417 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2228 / boss (84)` | 1793 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2229 / boss (225)` | 636 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2230 / boss (25)` | 109 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2231 / boss (60)` | 124 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2232 / boss (96)` | 445 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2233 / boss (198)` | 306 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2234 / boss (132)` | 1551 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2235 / boss (138)` | 390 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2236 / boss (207)` | 594 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2237 / boss (126)` | 608 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2238 / boss (67)` | 311 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2239 / boss (31)` | 96 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2240 / boss (24)` | 316 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2241 / boss (83)` | 813 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2242 / boss (233)` | 191 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2243 / boss (29)` | 138 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2244 / boss (237)` | 1260 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2245 / boss (183)` | 851 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2246 / boss (79)` | 53 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2247 / boss (99)` | 463 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2248 / boss (278)` | 0 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2249 / boss (166)` | 1832 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2250 / boss (153)` | 331 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2251 / boss (80)` | 640 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2252 / boss (93)` | 281 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2253 / boss (157)` | 138 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2254 / boss (226)` | 370 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2255 / boss (294)` | 166 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2256 / boss (97)` | 460 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2257 / boss (69)` | 211 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2258 / boss (171)` | 541 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2259 / boss (178)` | 1083 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2260 / boss (143)` | 630 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2261 / boss (148)` | 1123 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2262 / boss (274)` | 0 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2263 / boss (52)` | 746 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2264 / boss (71)` | 248 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2265 / boss (170)` | 1357 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2266 / boss (214)` | 509 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2267 / boss (48)` | 2400 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2268 / boss (32)` | 469 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2269 / boss (87)` | 89 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2270 / boss (180)` | 559 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2271 / boss (243)` | 466 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2272 / boss (258)` | 989 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2273 / boss (282)` | 0 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2274 / boss (270)` | 0 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2275 / boss (186)` | 835 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2276 / boss (201)` | 460 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2277 / boss (257)` | 314 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2278 / boss (155)` | 385 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2279 / boss (200)` | 1741 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2280 / boss (191)` | 345 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2281 / boss (212)` | 629 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2282 / boss (210)` | 591 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2283 / boss (13)` | 321 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2284 / boss (252)` | 1427 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2285 / boss (208)` | 2164 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2286 / boss (203)` | 475 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2287 / boss (0)` | 237 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2288 / boss (130)` | 651 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2289 / boss (101)` | 223 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2290 / boss (103)` | 806 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2291 / boss (49)` | 490 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2292 / boss (261)` | 701 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2293 / boss (14)` | 169 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2294 / boss (141)` | 173 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2295 / boss (287)` | 0 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2296 / boss (108)` | 2671 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2297 / boss (295)` | 2476 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2298 / boss (249)` | 857 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2299 / boss (154)` | 482 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2300 / boss (11)` | 326 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2301 / boss (149)` | 873 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2302 / boss (263)` | 611 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2303 / boss (184)` | 729 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2304 / boss (193)` | 330 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2305 / boss (260)` | 874 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2306 / boss (159)` | 308 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2307 / boss (23)` | 293 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2308 / boss (22)` | 210 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2309 / boss (66)` | 1599 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2310 / boss (247)` | 669 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2311 / boss (81)` | 624 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2312 / boss (292)` | 116 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2313 / boss (238)` | 605 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2314 / boss (167)` | 479 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2315 / boss (86)` | 965 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2316 / boss (94)` | 418 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2317 / boss (114)` | 777 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2318 / boss (62)` | 266 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2319 / boss (217)` | 321 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2320 / boss (19)` | 104 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2321 / boss (90)` | 1271 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2322 / boss (6)` | 257 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2323 / boss (227)` | 274 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2324 / boss (70)` | 128 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2325 / boss (161)` | 258 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2326 / boss (182)` | 1733 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2327 / boss (123)` | 764 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2328 / boss (55)` | 337 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2329 / boss (142)` | 514 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2330 / boss (45)` | 641 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2331 / boss (279)` | 0 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2332 / boss (28)` | 180 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2333 / boss (18)` | 235 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2334 / boss (15)` | 388 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2335 / boss (239)` | 741 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2336 / boss (12)` | 246 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2337 / boss (176)` | 542 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2338 / boss (38)` | 473 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2339 / boss (47)` | 1291 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2340 / boss (265)` | 476 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2341 / boss (220)` | 363 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2342 / boss (91)` | 374 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2343 / boss (222)` | 554 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2344 / boss (206)` | 842 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2345 / boss (57)` | 462 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2346 / boss (192)` | 405 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2347 / boss (151)` | 599 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2348 / boss (2)` | 267 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2349 / boss (213)` | 417 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2350 / boss (105)` | 405 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2351 / boss (119)` | 764 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2352 / boss (297)` | 504 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2353 / boss (110)` | 946 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2354 / boss (41)` | 293 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2355 / boss (187)` | 390 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2356 / boss (109)` | 690 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2357 / boss (244)` | 407 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2358 / boss (89)` | 477 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2359 / boss (250)` | 640 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2360 / boss (235)` | 624 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2361 / boss (136)` | 964 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2362 / boss (269)` | 1840 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2363 / boss (211)` | 292 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2364 / boss (61)` | 97 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2365 / boss (190)` | 2973 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2366 / boss (196)` | 411 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2367 / boss (58)` | 3678 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2368 / boss (264)` | 653 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2369 / boss (152)` | 931 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2370 / boss (162)` | 728 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2371 / boss (78)` | 291 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2372 / boss (135)` | 306 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2373 / boss (189)` | 194 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2374 / boss (285)` | 0 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2375 / boss (205)` | 493 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2376 / boss (21)` | 102 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2377 / boss (216)` | 1810 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2378 / boss (121)` | 1138 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2379 / boss (16)` | 543 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2380 / boss (289)` | 610 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2381 / boss (283)` | 0 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2382 / boss (219)` | 272 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2383 / boss (156)` | 1387 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2384 / boss (5)` | 318 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2385 / boss (98)` | 38 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2386 / boss (204)` | 377 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2387 / boss (215)` | 575 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2388 / boss (63)` | 117 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2389 / boss (26)` | 134 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2390 / boss (291)` | 142 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2391 / boss (234)` | 270 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2392 / boss (277)` | 0 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2393 / boss (112)` | 369 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2394 / boss (266)` | 571 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2395 / boss (223)` | 1181 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2396 / boss (46)` | 612 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2397 / boss (59)` | 168 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2398 / boss (50)` | 679 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2399 / boss (240)` | 2519 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2400 / boss (144)` | 863 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2401 / boss (1)` | 292 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2402 / boss (92)` | 916 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2403 / boss (77)` | 227 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2404 / boss (75)` | 553 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2405 / boss (42)` | 179 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2406 / boss (246)` | 871 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2407 / boss (275)` | 0 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2408 / boss (273)` | 0 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2409 / boss (9)` | 192 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2410 / boss (280)` | 0 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2411 / boss (253)` | 1198 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2412 / boss (284)` | 0 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2413 / boss (102)` | 386 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2414 / boss (54)` | 582 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2415 / boss (146)` | 658 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2416 / boss (232)` | 2491 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2417 / boss (127)` | 627 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2418 / boss (10)` | 279 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2419 / boss (95)` | 275 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2420 / boss (230)` | 898 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2421 / boss (254)` | 927 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2422 / boss (169)` | 523 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2423 / boss (39)` | 396 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2424 / boss (195)` | 525 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2425 / boss (139)` | 988 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2426 / boss (281)` | 0 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2427 / boss (251)` | 1728 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2428 / boss (221)` | 544 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2429 / boss (209)` | 962 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2430 / boss (122)` | 423 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2431 / boss (33)` | 154 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2432 / boss (165)` | 349 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2433 / boss (231)` | 807 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2434 / boss (271)` | 0 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2435 / boss (236)` | 502 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2436 / boss (40)` | 542 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2437 / boss (163)` | 535 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2438 / boss (185)` | 725 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2439 / boss (286)` | 0 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2440 / boss (296)` | 1901 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2441 / boss (248)` | 1684 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2442 / boss (224)` | 1358 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2443 / boss (53)` | 84 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2444 / boss (115)` | 687 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2445 / boss (255)` | 601 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2446 / boss (188)` | 693 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2447 / boss (300)` | 1358 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2448 / boss (106)` | 341 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2449 / boss (137)` | 1987 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2450 / boss (172)` | 274 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2451 / boss (150)` | 2731 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2452 / boss (3)` | 338 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2453 / boss (179)` | 362 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2454 / boss (56)` | 198 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2455 / boss (194)` | 634 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2456 / boss (124)` | 1475 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2457 / boss (140)` | 508 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2458 / boss (228)` | 818 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2459 / boss (267)` | 327 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2460 / boss (76)` | 286 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2461 / boss (147)` | 666 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2462 / boss (100)` | 987 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2463 / boss (288)` | 0 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2464 / boss (88)` | 555 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2465 / boss (242)` | 598 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2466 / boss (72)` | 30 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2467 / boss (104)` | 438 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2468 / boss (68)` | 76 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2469 / boss (107)` | 611 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2470 / boss (64)` | 178 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2471 / boss (272)` | 0 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2472 / boss (51)` | 553 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2473 / boss (82)` | 2638 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2474 / boss (111)` | 243 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2475 / boss (131)` | 529 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2476 / boss (37)` | 2726 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2477 / boss (299)` | 358 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2478 / boss (125)` | 780 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2479 / boss (202)` | 582 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2480 / boss (199)` | 1653 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2481 / boss (241)` | 562 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2482 / boss (4)` | 208 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2483 / boss (85)` | 398 | TextAsset inventory; selected texts only |
| `sharedassets0.assets / 2484 / boss (8)` | 465 | TextAsset inventory; selected texts only |

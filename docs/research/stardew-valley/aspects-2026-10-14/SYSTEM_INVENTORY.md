# Installed system inventory

Scope: complete discovered non-nested class namespace census from main DLL, plus every parsed GameData class declaration used to derive model schema. A class count is a size signal, not system completeness. Runtime/compiler helper classes are included in census but are not treated as gameplay. Full type names and schema remain private. No additional assembly was executed.

## Feature systems

| System | Where | Size signal | Documented |
|---|---|---|---|
| Item destinations/economy | Object, Farm, ShopMenu, ShippingMenu | 807 object records, 77 shops parsed | DESTINATIONS, partial economy |
| Machines | Object, MachineDataUtility, Cask; Data/Machines | 39 definitions; five traced | MACHINES |
| Recipes / skill learning | Farmer, CraftingRecipe, LevelUpMenu, TV, LetterViewerMenu | 150 crafting, 81 cooking, 32 TV rows | LEARNING; mail enqueue unread |
| Dialogue / events / social state | NPC, Dialogue, Event, Preconditions, Friendship | 48 character records, 240 selected dialogue, 67 events | DIALOGUE_AND_EVENTS; selected streams only |
| Contributions / bundles | Bundle, JunimoNoteMenu, CommunityCenter | 31 bundle rows | DESTINATIONS; rewards/other sets partial |
| Save/versioning | SaveGame, SaveSerializer, migration namespaces | Fields/callers inspected | SAVE; full migrations unread |
| Information / knowledge UI | ProfileMenu, SocialPage, CraftingPage, ItemGrabMenu | Four main quote/disclosure paths | ASPECTS A06 |
| Time and schedules | Game1 clock, NPC schedule, Object/Cask updates | Ten-minute and day dispatch | A09 covered, A05 partial |

## Every discovered namespace

Where: installed main DLL; private `notes/TYPE_CENSUS.json` lists every member. Root namespace includes world, clock, save, items, farmers, characters, utility, input and event dispatch. Lower namespaces are distinct found subsystems, including ones not covered in feature traces.

| Namespace | Non-nested class count | Coverage |
|---|---|---|
| `<>f__AnonymousType0`5` | 1 | Undocumented mechanically; inventoried only |
| `<>f__AnonymousType1`2` | 1 | Undocumented mechanically; inventoried only |
| `<>f__AnonymousType2`2` | 1 | Undocumented mechanically; inventoried only |
| `<Module>` | 1 | Undocumented mechanically; inventoried only |
| `<PrivateImplementationDetails>` | 1 | Undocumented mechanically; inventoried only |
| `ContentManifest` | 2 | Undocumented mechanically; inventoried only |
| `ContentManifest.Internal` | 9 | Undocumented mechanically; inventoried only |
| `DontLoadDefaultSetting` | 1 | Undocumented mechanically; inventoried only |
| `Force.DeepCloner` | 1 | Undocumented mechanically; inventoried only |
| `Force.DeepCloner.Helpers` | 9 | Undocumented mechanically; inventoried only |
| `FrameRateCounter` | 1 | Undocumented mechanically; inventoried only |
| `Ionic.Crc` | 2 | Undocumented mechanically; inventoried only |
| `Ionic.Zlib` | 17 | Undocumented mechanically; inventoried only |
| `LWJGL` | 1 | Undocumented mechanically; inventoried only |
| `Microsoft.CodeAnalysis` | 1 | Undocumented mechanically; inventoried only |
| `Netcode` | 52 | Undocumented mechanically; inventoried only |
| `Netcode.Validation` | 4 | Undocumented mechanically; inventoried only |
| `ObjToStr` | 1 | Undocumented mechanically; inventoried only |
| `Sickhead.Engine.Util` | 1 | Undocumented mechanically; inventoried only |
| `StardewValley` | 122 | selected core only |
| `StardewValley.Audio` | 7 | Undocumented mechanically; inventoried only |
| `StardewValley.BellsAndWhistles` | 34 | Undocumented mechanically; inventoried only |
| `StardewValley.Buffs` | 3 | Undocumented mechanically; inventoried only |
| `StardewValley.Buildings` | 12 | Undocumented mechanically; inventoried only |
| `StardewValley.Characters` | 9 | Undocumented mechanically; inventoried only |
| `StardewValley.Companions` | 4 | Undocumented mechanically; inventoried only |
| `StardewValley.ConsoleAsync` | 3 | Undocumented mechanically; inventoried only |
| `StardewValley.Constants` | 3 | Undocumented mechanically; inventoried only |
| `StardewValley.Enchantments` | 44 | Undocumented mechanically; inventoried only |
| `StardewValley.Events` | 11 | Undocumented mechanically; inventoried only |
| `StardewValley.Extensions` | 8 | Undocumented mechanically; inventoried only |
| `StardewValley.Hashing` | 1 | Undocumented mechanically; inventoried only |
| `StardewValley.Internal` | 8 | Undocumented mechanically; inventoried only |
| `StardewValley.Inventories` | 2 | Undocumented mechanically; inventoried only |
| `StardewValley.ItemTypeDefinitions` | 16 | Undocumented mechanically; inventoried only |
| `StardewValley.Locations` | 58 | CommunityCenter selected; others unread |
| `StardewValley.Logging` | 2 | Undocumented mechanically; inventoried only |
| `StardewValley.Menus` | 112 | selected crafting/quotes/contribution/profile only |
| `StardewValley.Minigames` | 20 | Undocumented mechanically; inventoried only |
| `StardewValley.Mods` | 2 | Undocumented mechanically; inventoried only |
| `StardewValley.Monsters` | 31 | Undocumented mechanically; inventoried only |
| `StardewValley.NativeClipboard` | 4 | Undocumented mechanically; inventoried only |
| `StardewValley.Network` | 40 | Undocumented mechanically; inventoried only |
| `StardewValley.Network.ChestHit` | 3 | Undocumented mechanically; inventoried only |
| `StardewValley.Network.Compress` | 2 | Undocumented mechanically; inventoried only |
| `StardewValley.Network.Dedicated` | 1 | Undocumented mechanically; inventoried only |
| `StardewValley.Network.NetEvents` | 5 | Undocumented mechanically; inventoried only |
| `StardewValley.Network.NetReady` | 1 | Undocumented mechanically; inventoried only |
| `StardewValley.Network.NetReady.Internal` | 3 | Undocumented mechanically; inventoried only |
| `StardewValley.Objects` | 29 | Cask/TV only |
| `StardewValley.Objects.Trinkets` | 7 | Undocumented mechanically; inventoried only |
| `StardewValley.Pathfinding` | 6 | Undocumented mechanically; inventoried only |
| `StardewValley.Projectiles` | 3 | Undocumented mechanically; inventoried only |
| `StardewValley.Quests` | 15 | Undocumented mechanically; inventoried only |
| `StardewValley.SDKs` | 1 | Undocumented mechanically; inventoried only |
| `StardewValley.SDKs.GogGalaxy` | 5 | Undocumented mechanically; inventoried only |
| `StardewValley.SDKs.GogGalaxy.Internal` | 1 | Undocumented mechanically; inventoried only |
| `StardewValley.SDKs.GogGalaxy.Listeners` | 11 | Undocumented mechanically; inventoried only |
| `StardewValley.SDKs.Steam` | 4 | Undocumented mechanically; inventoried only |
| `StardewValley.SDKs.Steam.Internal` | 2 | Undocumented mechanically; inventoried only |
| `StardewValley.SDKs.WeGameRail` | 1 | Undocumented mechanically; inventoried only |
| `StardewValley.SaveMigrations` | 5 | Undocumented mechanically; inventoried only |
| `StardewValley.SaveSerialization` | 4 | SaveSerializer adapter; vector details unread |
| `StardewValley.SpecialOrders` | 1 | Undocumented mechanically; inventoried only |
| `StardewValley.SpecialOrders.Objectives` | 10 | Undocumented mechanically; inventoried only |
| `StardewValley.SpecialOrders.Rewards` | 7 | Undocumented mechanically; inventoried only |
| `StardewValley.TerrainFeatures` | 13 | Undocumented mechanically; inventoried only |
| `StardewValley.Tests` | 3 | Undocumented mechanically; inventoried only |
| `StardewValley.TokenizableStrings` | 2 | Undocumented mechanically; inventoried only |
| `StardewValley.Tools` | 15 | Axe/Pickaxe removal only |
| `StardewValley.Triggers` | 3 | Undocumented mechanically; inventoried only |
| `StardewValley.Util` | 10 | Undocumented mechanically; inventoried only |
| `StardewValley.WorldMaps` | 6 | Undocumented mechanically; inventoried only |
| `System.Runtime.CompilerServices` | 2 | Undocumented mechanically; inventoried only |

## Every discovered GameData model

Each row is a distinct authored model/subsystem found in the statically exported GameData assembly. Public field count excludes ignored/static fields; inheritance can add more. Model declaration coverage means schema, not all evaluator consumers. Full tables and model schemas remain private.

| Model | Own serializable members | Feature coverage |
|---|---|---|
| `StardewValley.GameData.AudioCueData` | 7 | Schema only; evaluator unread |
| `StardewValley.GameData.BigCraftables.BigCraftableData` | 12 | Schema only; evaluator unread |
| `StardewValley.GameData.Buffs.BuffAttributesData` | 18 | Schema only; evaluator unread |
| `StardewValley.GameData.Buffs.BuffData` | 11 | Schema only; evaluator unread |
| `StardewValley.GameData.Buildings.BuildingActionTile` | 3 | Schema only; evaluator unread |
| `StardewValley.GameData.Buildings.BuildingChest` | 9 | Schema only; evaluator unread |
| `StardewValley.GameData.Buildings.BuildingData` | 52 | Schema only; evaluator unread |
| `StardewValley.GameData.Buildings.BuildingDrawLayer` | 11 | Schema only; evaluator unread |
| `StardewValley.GameData.Buildings.BuildingItemConversion` | 7 | Schema only; evaluator unread |
| `StardewValley.GameData.Buildings.BuildingMaterial` | 2 | Schema only; evaluator unread |
| `StardewValley.GameData.Buildings.BuildingPlacementTile` | 2 | Schema only; evaluator unread |
| `StardewValley.GameData.Buildings.BuildingSkin` | 11 | Schema only; evaluator unread |
| `StardewValley.GameData.Buildings.BuildingTileProperty` | 5 | Schema only; evaluator unread |
| `StardewValley.GameData.Buildings.IndoorItemAdd` | 5 | Schema only; evaluator unread |
| `StardewValley.GameData.Buildings.IndoorItemMove` | 5 | Schema only; evaluator unread |
| `StardewValley.GameData.Bundles.BundleData` | 8 | Schema only; evaluator unread |
| `StardewValley.GameData.Bundles.BundleSetData` | 2 | Schema only; evaluator unread |
| `StardewValley.GameData.Bundles.RandomBundleData` | 4 | Schema only; evaluator unread |
| `StardewValley.GameData.Characters.CharacterAppearanceData` | 10 | Character table parsed; dialogue/social consumers selected |
| `StardewValley.GameData.Characters.CharacterData` | 61 | Character table parsed; dialogue/social consumers selected |
| `StardewValley.GameData.Characters.CharacterHomeData` | 5 | Character table parsed; dialogue/social consumers selected |
| `StardewValley.GameData.Characters.CharacterShadowData` | 3 | Character table parsed; dialogue/social consumers selected |
| `StardewValley.GameData.Characters.CharacterSpousePatioData` | 4 | Character table parsed; dialogue/social consumers selected |
| `StardewValley.GameData.Characters.CharacterSpouseRoomData` | 2 | Character table parsed; dialogue/social consumers selected |
| `StardewValley.GameData.Crafting.TailorItemRecipe` | 7 | Schema only; evaluator unread |
| `StardewValley.GameData.Crops.CropData` | 21 | Schema only; evaluator unread |
| `StardewValley.GameData.FarmAnimals.AlternatePurchaseAnimals` | 3 | Schema only; evaluator unread |
| `StardewValley.GameData.FarmAnimals.FarmAnimalData` | 62 | Schema only; evaluator unread |
| `StardewValley.GameData.FarmAnimals.FarmAnimalProduce` | 4 | Schema only; evaluator unread |
| `StardewValley.GameData.FarmAnimals.FarmAnimalShadowData` | 3 | Schema only; evaluator unread |
| `StardewValley.GameData.FarmAnimals.FarmAnimalSkin` | 5 | Schema only; evaluator unread |
| `StardewValley.GameData.Fences.FenceData` | 12 | Schema only; evaluator unread |
| `StardewValley.GameData.FishPonds.FishPondData` | 11 | Schema only; evaluator unread |
| `StardewValley.GameData.FishPonds.FishPondReward` | 3 | Schema only; evaluator unread |
| `StardewValley.GameData.FishPonds.FishPondWaterColor` | 5 | Schema only; evaluator unread |
| `StardewValley.GameData.FloorsAndPaths.FloorPathData` | 14 | Schema only; evaluator unread |
| `StardewValley.GameData.FruitTrees.FruitTreeData` | 7 | Schema only; evaluator unread |
| `StardewValley.GameData.FruitTrees.FruitTreeFruitData` | 2 | Schema only; evaluator unread |
| `StardewValley.GameData.GarbageCans.GarbageCanData` | 4 | Schema only; evaluator unread |
| `StardewValley.GameData.GarbageCans.GarbageCanEntryData` | 3 | Schema only; evaluator unread |
| `StardewValley.GameData.GarbageCans.GarbageCanItemData` | 5 | Schema only; evaluator unread |
| `StardewValley.GameData.GenericSpawnItemData` | 18 | Machine/shared model read; other consumers unread |
| `StardewValley.GameData.GenericSpawnItemDataWithCondition` | 1 | Machine/shared model read; other consumers unread |
| `StardewValley.GameData.GiantCrops.GiantCropData` | 9 | Schema only; evaluator unread |
| `StardewValley.GameData.GiantCrops.GiantCropHarvestItemData` | 4 | Schema only; evaluator unread |
| `StardewValley.GameData.HomeRenovations.HomeRenovation` | 10 | Schema only; evaluator unread |
| `StardewValley.GameData.HomeRenovations.Rect` | 4 | Schema only; evaluator unread |
| `StardewValley.GameData.HomeRenovations.RectGroup` | 1 | Schema only; evaluator unread |
| `StardewValley.GameData.HomeRenovations.RenovationValue` | 3 | Schema only; evaluator unread |
| `StardewValley.GameData.IncomingPhoneCallData` | 10 | Schema only; evaluator unread |
| `StardewValley.GameData.JukeboxTrackData` | 3 | Schema only; evaluator unread |
| `StardewValley.GameData.LocationContexts.LocationContextData` | 17 | Schema only; evaluator unread |
| `StardewValley.GameData.LocationContexts.PassOutMailData` | 5 | Schema only; evaluator unread |
| `StardewValley.GameData.LocationContexts.ReviveLocation` | 4 | Schema only; evaluator unread |
| `StardewValley.GameData.LocationContexts.WeatherCondition` | 3 | Schema only; evaluator unread |
| `StardewValley.GameData.Locations.ArtifactSpotDropData` | 5 | Schema only; evaluator unread |
| `StardewValley.GameData.Locations.CreateLocationData` | 3 | Schema only; evaluator unread |
| `StardewValley.GameData.Locations.FishAreaData` | 4 | Schema only; evaluator unread |
| `StardewValley.GameData.Locations.LocationData` | 29 | Schema only; evaluator unread |
| `StardewValley.GameData.Locations.LocationMusicData` | 3 | Schema only; evaluator unread |
| `StardewValley.GameData.Locations.SpawnFishData` | 24 | Schema only; evaluator unread |
| `StardewValley.GameData.Locations.SpawnForageData` | 2 | Schema only; evaluator unread |
| `StardewValley.GameData.LostItem` | 4 | Schema only; evaluator unread |
| `StardewValley.GameData.Machines.MachineData` | 27 | Machine dossier for five machines; remaining models schema only |
| `StardewValley.GameData.Machines.MachineEffects` | 7 | Machine dossier for five machines; remaining models schema only |
| `StardewValley.GameData.Machines.MachineItemAdditionalConsumedItems` | 3 | Machine dossier for five machines; remaining models schema only |
| `StardewValley.GameData.Machines.MachineItemOutput` | 10 | Machine dossier for five machines; remaining models schema only |
| `StardewValley.GameData.Machines.MachineLight` | 2 | Machine dossier for five machines; remaining models schema only |
| `StardewValley.GameData.Machines.MachineOutputRule` | 8 | Machine dossier for five machines; remaining models schema only |
| `StardewValley.GameData.Machines.MachineOutputTriggerRule` | 6 | Machine dossier for five machines; remaining models schema only |
| `StardewValley.GameData.Machines.MachineSoundData` | 2 | Machine dossier for five machines; remaining models schema only |
| `StardewValley.GameData.MakeoverOutfits.MakeoverItem` | 4 | Schema only; evaluator unread |
| `StardewValley.GameData.MakeoverOutfits.MakeoverOutfit` | 3 | Schema only; evaluator unread |
| `StardewValley.GameData.MannequinData` | 8 | Schema only; evaluator unread |
| `StardewValley.GameData.Minecarts.MinecartDestinationData` | 9 | Schema only; evaluator unread |
| `StardewValley.GameData.Minecarts.MinecartNetworkData` | 5 | Schema only; evaluator unread |
| `StardewValley.GameData.ModFarmType` | 8 | Schema only; evaluator unread |
| `StardewValley.GameData.ModLanguage` | 14 | Schema only; evaluator unread |
| `StardewValley.GameData.ModWallpaperOrFlooring` | 4 | Schema only; evaluator unread |
| `StardewValley.GameData.MonsterSlayerQuestData` | 12 | Schema only; evaluator unread |
| `StardewValley.GameData.Movies.CharacterResponse` | 3 | Schema only; evaluator unread |
| `StardewValley.GameData.Movies.ConcessionItemData` | 8 | Schema only; evaluator unread |
| `StardewValley.GameData.Movies.ConcessionTaste` | 4 | Schema only; evaluator unread |
| `StardewValley.GameData.Movies.MovieCharacterReaction` | 2 | Schema only; evaluator unread |
| `StardewValley.GameData.Movies.MovieCranePrizeData` | 1 | Schema only; evaluator unread |
| `StardewValley.GameData.Movies.MovieData` | 13 | Schema only; evaluator unread |
| `StardewValley.GameData.Movies.MovieReaction` | 5 | Schema only; evaluator unread |
| `StardewValley.GameData.Movies.MovieScene` | 9 | Schema only; evaluator unread |
| `StardewValley.GameData.Movies.SpecialResponses` | 3 | Schema only; evaluator unread |
| `StardewValley.GameData.Museum.MuseumDonationRequirement` | 2 | Schema only; evaluator unread |
| `StardewValley.GameData.Museum.MuseumRewards` | 8 | Schema only; evaluator unread |
| `StardewValley.GameData.Objects.ObjectBuffData` | 9 | Object table parsed; item consumers selected |
| `StardewValley.GameData.Objects.ObjectData` | 22 | Object table parsed; item consumers selected |
| `StardewValley.GameData.Objects.ObjectGeodeDropData` | 3 | Object table parsed; item consumers selected |
| `StardewValley.GameData.Pants.PantsData` | 11 | Schema only; evaluator unread |
| `StardewValley.GameData.PassiveFestivalData` | 13 | Schema only; evaluator unread |
| `StardewValley.GameData.Pets.PetAnimationFrame` | 8 | Schema only; evaluator unread |
| `StardewValley.GameData.Pets.PetBehavior` | 24 | Schema only; evaluator unread |
| `StardewValley.GameData.Pets.PetBehaviorChanges` | 7 | Schema only; evaluator unread |
| `StardewValley.GameData.Pets.PetBreed` | 9 | Schema only; evaluator unread |
| `StardewValley.GameData.Pets.PetData` | 18 | Schema only; evaluator unread |
| `StardewValley.GameData.Pets.PetGift` | 2 | Schema only; evaluator unread |
| `StardewValley.GameData.Pets.PetSummitPerfectionEventData` | 5 | Schema only; evaluator unread |
| `StardewValley.GameData.PlantableRule` | 5 | Schema only; evaluator unread |
| `StardewValley.GameData.Powers.PowersData` | 6 | Schema only; evaluator unread |
| `StardewValley.GameData.QuantityModifier` | 5 | Machine/shared model read; other consumers unread |
| `StardewValley.GameData.Shirts.ShirtData` | 12 | Schema only; evaluator unread |
| `StardewValley.GameData.Shops.ShopData` | 13 | Shop table parsed; recipe/sale consumers selected |
| `StardewValley.GameData.Shops.ShopDialogueData` | 4 | Shop table parsed; recipe/sale consumers selected |
| `StardewValley.GameData.Shops.ShopItemData` | 15 | Shop table parsed; recipe/sale consumers selected |
| `StardewValley.GameData.Shops.ShopOwnerData` | 7 | Shop table parsed; recipe/sale consumers selected |
| `StardewValley.GameData.Shops.ShopThemeData` | 23 | Shop table parsed; recipe/sale consumers selected |
| `StardewValley.GameData.SpecialOrders.RandomizedElement` | 2 | Schema only; evaluator unread |
| `StardewValley.GameData.SpecialOrders.RandomizedElementItem` | 2 | Schema only; evaluator unread |
| `StardewValley.GameData.SpecialOrders.SpecialOrderData` | 15 | Schema only; evaluator unread |
| `StardewValley.GameData.SpecialOrders.SpecialOrderObjectiveData` | 4 | Schema only; evaluator unread |
| `StardewValley.GameData.SpecialOrders.SpecialOrderRewardData` | 2 | Schema only; evaluator unread |
| `StardewValley.GameData.StatIncrement` | 4 | Machine/shared model read; other consumers unread |
| `StardewValley.GameData.TemporaryAnimatedSpriteDefinition` | 17 | Machine/shared model read; other consumers unread |
| `StardewValley.GameData.Tools.ToolData` | 16 | Schema only; evaluator unread |
| `StardewValley.GameData.Tools.ToolUpgradeData` | 5 | Schema only; evaluator unread |
| `StardewValley.GameData.TriggerActionData` | 9 | Schema only; evaluator unread |
| `StardewValley.GameData.TrinketData` | 9 | Schema only; evaluator unread |
| `StardewValley.GameData.Weapons.WeaponData` | 20 | Schema only; evaluator unread |
| `StardewValley.GameData.Weapons.WeaponProjectile` | 15 | Schema only; evaluator unread |
| `StardewValley.GameData.Weddings.WeddingAttendeeData` | 5 | Schema only; evaluator unread |
| `StardewValley.GameData.Weddings.WeddingData` | 2 | Schema only; evaluator unread |
| `StardewValley.GameData.WildTrees.WildTreeChopItemData` | 3 | Schema only; evaluator unread |
| `StardewValley.GameData.WildTrees.WildTreeData` | 26 | Schema only; evaluator unread |
| `StardewValley.GameData.WildTrees.WildTreeItemData` | 2 | Schema only; evaluator unread |
| `StardewValley.GameData.WildTrees.WildTreeSeedDropItemData` | 1 | Schema only; evaluator unread |
| `StardewValley.GameData.WildTrees.WildTreeTapItemData` | 4 | Schema only; evaluator unread |
| `StardewValley.GameData.WildTrees.WildTreeTextureData` | 3 | Schema only; evaluator unread |
| `StardewValley.GameData.WorldMaps.WorldMapAreaData` | 8 | Schema only; evaluator unread |
| `StardewValley.GameData.WorldMaps.WorldMapAreaPositionData` | 10 | Schema only; evaluator unread |
| `StardewValley.GameData.WorldMaps.WorldMapAreaPositionScrollTextZoneData` | 3 | Schema only; evaluator unread |
| `StardewValley.GameData.WorldMaps.WorldMapRegionData` | 3 | Schema only; evaluator unread |
| `StardewValley.GameData.WorldMaps.WorldMapTextureData` | 5 | Schema only; evaluator unread |
| `StardewValley.GameData.WorldMaps.WorldMapTooltipData` | 9 | Schema only; evaluator unread |

## Unparsed content families

Everything outside the sixteen selected XNB files remains unread: maps/graphics/audio, crop and fish tables, NPC schedules, most location event/dialogue files, animals/buildings, random bundle pools, crafting/cooking localized variants, festivals, special orders, quests, mastery/books, collections and minigame data. Presence from classes/models is not proof of full gameplay support. The top three donor systems by this lane's payoff are expanded in [DEEPER_SYSTEMS](DEEPER_SYSTEMS.md).

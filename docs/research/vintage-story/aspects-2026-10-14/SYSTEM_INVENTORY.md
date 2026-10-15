# Source system inventory

Inventory scope: all 1,829 C# files in the three acquired modules, grouped by every source-containing directory (197 rows). Counts are file counts, not class counts. This is a complete directory census of the acquired source and a partial semantic system map, not every subsystem in a paid build. Parent counts exclude descendants. Legacy and refactored paths are listed separately. No paid asset row counts are known. Documentation coverage means this lane read at least a named mechanism in that area; it never means every file was audited. No other Vintage Story dossier existed at lane start.

Top initial documentation gaps by payoff were dialogue state, ambient transition clocks and component propagation. They are now traced in [DEEPER_SYSTEMS.md](DEEPER_SYSTEMS.md). Remaining directories marked unread are preserved as discoverable gaps, not proposed follow-up obligations.

| Module / source directory | Size signal | Lane coverage |
|---|---:|---|
| `vssurvivalmod/.` | 2 C# files | Unread: source inventory only |
| `vssurvivalmod/Block` | 167 C# files | Partial: BlockClayForm.cs |
| `vssurvivalmod/BlockBehavior` | 46 C# files | Unread: source inventory only |
| `vssurvivalmod/BlockBehavior/Crop` | 1 C# files | Unread: source inventory only |
| `vssurvivalmod/BlockEntity` | 82 C# files | Partial: BEAnvil.cs, BEClayForm.cs, BEForge.cs |
| `vssurvivalmod/BlockEntity/Firepit` | 2 C# files | Unread: source inventory only |
| `vssurvivalmod/BlockEntity/Unfinished` | 2 C# files | Unread: source inventory only |
| `vssurvivalmod/BlockEntityBehavior` | 22 C# files | Unread: source inventory only |
| `vssurvivalmod/BlockEntityRenderer` | 18 C# files | Unread: source inventory only |
| `vssurvivalmod/CollectibleBehavior` | 14 C# files | Partial: BehaviorWearable.cs |
| `vssurvivalmod/Entities` | 16 C# files | Unread: source inventory only |
| `vssurvivalmod/Entity/AITask` | 12 C# files | Unread: source inventory only |
| `vssurvivalmod/Entity/Behavior` | 22 C# files | Unread: source inventory only |
| `vssurvivalmod/Gui` | 16 C# files | Unread: source inventory only |
| `vssurvivalmod/Inventory` | 9 C# files | Partial: InventorySmelting.cs |
| `vssurvivalmod/Item` | 71 C# files | Partial: ItemWorkItem.cs |
| `vssurvivalmod/Legacy` | 2 C# files | Unread: source inventory only |
| `vssurvivalmod/Legacy/Block` | 6 C# files | Unread: source inventory only |
| `vssurvivalmod/Legacy/BlockEntity` | 7 C# files | Unread: source inventory only |
| `vssurvivalmod/Legacy/Item` | 4 C# files | Unread: source inventory only |
| `vssurvivalmod/Lore` | 1 C# files | Unread: source inventory only |
| `vssurvivalmod/Lore/Devastation` | 11 C# files | Unread: source inventory only |
| `vssurvivalmod/Lore/Devastation/Timeswitch` | 2 C# files | Unread: source inventory only |
| `vssurvivalmod/Lore/Lazaret` | 1 C# files | Unread: source inventory only |
| `vssurvivalmod/Lore/ResoArchives` | 19 C# files | Unread: source inventory only |
| `vssurvivalmod/Lore/ResoArchives/Eidolon` | 3 C# files | Unread: source inventory only |
| `vssurvivalmod/Lore/Village` | 5 C# files | Unread: source inventory only |
| `vssurvivalmod/Properties` | 1 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems` | 15 C# files | Partial: Core.cs, Journal.cs |
| `vssurvivalmod/Systems/Auction` | 5 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/Barrel` | 3 C# files | Partial: BEBarrel.cs, GuiDialogBarrel.cs |
| `vssurvivalmod/Systems/Boats` | 8 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/Character` | 2 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/Cooking` | 9 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/Cooking/Clayoven` | 3 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/Dialogue` | 4 C# files | Partial: BehaviorConversable.cs, VariablesModSystem.cs |
| `vssurvivalmod/Systems/Dialogue/Component` | 6 C# files | Partial: DialogueComponent.cs, DlgTalkComponent.cs |
| `vssurvivalmod/Systems/Elevator` | 3 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/EntityActivitySystem` | 9 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/EntityActivitySystem/Action` | 23 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/EntityActivitySystem/Conditions` | 17 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/Farming` | 7 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/FruitTree` | 10 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/Handbook` | 3 C# files | Partial: CollectibleBehaviorHandbookTextAndExtraInfo.cs |
| `vssurvivalmod/Systems/Handbook/Gui` | 11 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/Handbook/Tutorial` | 9 C# files | Partial: FirstStepsTutorial.cs, PlayerReceiveItemWatcher.cs |
| `vssurvivalmod/Systems/JonasDevices` | 9 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/Liquid` | 6 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/LocatorMaps` | 2 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/Loot` | 7 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/MechanicalPower` | 1 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/MechanicalPower/Block` | 18 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/MechanicalPower/BlockEntity` | 8 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/MechanicalPower/BlockEntityBehavior` | 16 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/MechanicalPower/Network` | 6 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/MechanicalPower/Renderer` | 9 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/Microblock` | 16 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/Microblock/ChiselMode` | 8 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/Prospecting` | 2 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/Prospecting/OreMapLayer` | 4 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/Recipe` | 6 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/Recipe/Barrel` | 3 C# files | Partial: BarrelRecipe.cs, BarrelRecipeIngredient.cs |
| `vssurvivalmod/Systems/Riding` | 8 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/Rifts` | 4 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/SupportBeams` | 5 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/TemporalStability` | 4 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/TiledDungeon` | 10 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/Trading` | 13 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/WorldGen` | 1 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/WorldGen/Standard/ChunkGen/4.GenBlockLayers` | 1 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/WorldGen/Standard/ChunkGen/6.GenStructures` | 1 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/WorldGen/Standard/ChunkGen/6.GenStructures/Story` | 1 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/WorldGen/Standard/ChunkGen/8.GenVegetationAndPatches/Treegen` | 1 C# files | Unread: source inventory only |
| `vssurvivalmod/Systems/WritingSystem` | 4 C# files | Unread: source inventory only |
| `vsessentialsmod/.` | 4 C# files | Unread: source inventory only |
| `vsessentialsmod/Block` | 2 C# files | Unread: source inventory only |
| `vsessentialsmod/BlockBehavior` | 5 C# files | Unread: source inventory only |
| `vsessentialsmod/BlockEntity` | 2 C# files | Unread: source inventory only |
| `vsessentialsmod/BlockEntityBehavior` | 2 C# files | Unread: source inventory only |
| `vsessentialsmod/CollectibleBehavior` | 5 C# files | Unread: source inventory only |
| `vsessentialsmod/Entities` | 4 C# files | Unread: source inventory only |
| `vsessentialsmod/Entity/AI` | 6 C# files | Partial: AiTaskManager.cs |
| `vsessentialsmod/Entity/AI/Tasks` | 13 C# files | Unread: source inventory only |
| `vsessentialsmod/Entity/AI/Tasks/Guard` | 5 C# files | Unread: source inventory only |
| `vsessentialsmod/Entity/AI/TasksRefactored` | 20 C# files | Unread: source inventory only |
| `vsessentialsmod/Entity/Behavior` | 31 C# files | Unread: source inventory only |
| `vsessentialsmod/Entity/Pathfinding` | 4 C# files | Unread: source inventory only |
| `vsessentialsmod/Entity/Pathfinding/Astar` | 5 C# files | Unread: source inventory only |
| `vsessentialsmod/EntityRenderer` | 5 C# files | Unread: source inventory only |
| `vsessentialsmod/Gui` | 2 C# files | Unread: source inventory only |
| `vsessentialsmod/Inventory` | 2 C# files | Partial: InWorldContainer.cs |
| `vsessentialsmod/Legacy` | 1 C# files | Unread: source inventory only |
| `vsessentialsmod/Loading` | 13 C# files | Unread: source inventory only |
| `vsessentialsmod/Properties` | 1 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems` | 10 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/Cloth` | 4 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/ParticleEntity` | 5 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/ParticleEntity/Types` | 6 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/Weather` | 19 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/Weather/Model` | 4 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/Weather/Model/Impl` | 3 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/Weather/Newclouds` | 3 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldGen/Standard` | 12 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldGen/Standard/ChunkGen` | 4 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldGen/Standard/ChunkGen/0.GenMaps` | 9 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldGen/Standard/ChunkGen/0.GenMaps/MapLayer` | 19 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldGen/Standard/ChunkGen/0.GenMaps/NoiseGen` | 1 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldGen/Standard/ChunkGen/1.GenTerra` | 4 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldGen/Standard/ChunkGen/2.GenRockStrata` | 5 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldGen/Standard/ChunkGen/2.GenRockStrata/GeoProv` | 3 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldGen/Standard/ChunkGen/3.GenCaves` | 1 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldGen/Standard/ChunkGen/4.GenBlockLayers` | 3 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldGen/Standard/ChunkGen/5.GenDeposits` | 6 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldGen/Standard/ChunkGen/5.GenDeposits/Generators` | 7 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldGen/Standard/ChunkGen/6.GenStructures` | 8 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldGen/Standard/ChunkGen/6.GenStructures/Story` | 1 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldGen/Standard/ChunkGen/7.GenPonds` | 2 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldGen/Standard/ChunkGen/8.GenVegetationAndPatches` | 4 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldGen/Standard/ChunkGen/8.GenVegetationAndPatches/Tree` | 5 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldGen/Standard/ChunkGen/8.GenVegetationAndPatches/Treegen` | 8 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldGen/Standard/Datastructures` | 4 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldMap` | 6 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldMap/ChunkLayer` | 4 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldMap/EntityLayer` | 4 C# files | Unread: source inventory only |
| `vsessentialsmod/Systems/WorldMap/WaypointLayer` | 4 C# files | Unread: source inventory only |
| `vsapi/Client` | 2 C# files | Unread: source inventory only |
| `vsapi/Client/API` | 21 C# files | Unread: source inventory only |
| `vsapi/Client/Audio` | 10 C# files | Unread: source inventory only |
| `vsapi/Client/Input` | 6 C# files | Unread: source inventory only |
| `vsapi/Client/MeshPool` | 4 C# files | Unread: source inventory only |
| `vsapi/Client/Model/Mesh` | 12 C# files | Unread: source inventory only |
| `vsapi/Client/Model/Tesselation` | 1 C# files | Unread: source inventory only |
| `vsapi/Client/Render` | 21 C# files | Unread: source inventory only |
| `vsapi/Client/Render/PerceptionEffects` | 6 C# files | Unread: source inventory only |
| `vsapi/Client/Texture` | 7 C# files | Unread: source inventory only |
| `vsapi/Client/UI` | 17 C# files | Unread: source inventory only |
| `vsapi/Client/UI/Dialog` | 7 C# files | Unread: source inventory only |
| `vsapi/Client/UI/Elements` | 2 C# files | Unread: source inventory only |
| `vsapi/Client/UI/Elements/Impl` | 1 C# files | Unread: source inventory only |
| `vsapi/Client/UI/Elements/Impl/Interactive` | 9 C# files | Unread: source inventory only |
| `vsapi/Client/UI/Elements/Impl/Interactive/Controls` | 16 C# files | Unread: source inventory only |
| `vsapi/Client/UI/Elements/Impl/Interactive/Inventory` | 5 C# files | Unread: source inventory only |
| `vsapi/Client/UI/Elements/Impl/Interactive/Text` | 7 C# files | Unread: source inventory only |
| `vsapi/Client/UI/Elements/Impl/Interactive/Text/Richtext` | 10 C# files | Unread: source inventory only |
| `vsapi/Client/UI/Elements/Impl/Misc` | 5 C# files | Unread: source inventory only |
| `vsapi/Client/UI/Elements/Impl/Static` | 12 C# files | Unread: source inventory only |
| `vsapi/Common` | 17 C# files | Unread: source inventory only |
| `vsapi/Common/API` | 26 C# files | Unread: source inventory only |
| `vsapi/Common/API/ChatCommand` | 5 C# files | Unread: source inventory only |
| `vsapi/Common/API/ChatCommand/Legacy` | 1 C# files | Unread: source inventory only |
| `vsapi/Common/Assets` | 6 C# files | Unread: source inventory only |
| `vsapi/Common/Collectible` | 24 C# files | Partial: Collectible.cs, TransitionableProperties.cs |
| `vsapi/Common/Collectible/Block` | 28 C# files | Unread: source inventory only |
| `vsapi/Common/Collectible/Block/Crop` | 3 C# files | Unread: source inventory only |
| `vsapi/Common/Collectible/Item` | 3 C# files | Unread: source inventory only |
| `vsapi/Common/Combat` | 6 C# files | Unread: source inventory only |
| `vsapi/Common/Controls` | 4 C# files | Unread: source inventory only |
| `vsapi/Common/Crafting` | 7 C# files | Partial: RecipeBase.cs |
| `vsapi/Common/Effect` | 1 C# files | Unread: source inventory only |
| `vsapi/Common/Entity` | 28 C# files | Unread: source inventory only |
| `vsapi/Common/Entity/Physics` | 1 C# files | Unread: source inventory only |
| `vsapi/Common/Entity/Physics/Normal` | 7 C# files | Unread: source inventory only |
| `vsapi/Common/Entity/Physics/Player` | 2 C# files | Unread: source inventory only |
| `vsapi/Common/Entity/Player` | 8 C# files | Unread: source inventory only |
| `vsapi/Common/EntityBehavior` | 2 C# files | Unread: source inventory only |
| `vsapi/Common/IO` | 1 C# files | Unread: source inventory only |
| `vsapi/Common/Inventory` | 24 C# files | Partial: InventoryBase.cs |
| `vsapi/Common/Model/Animation` | 19 C# files | Unread: source inventory only |
| `vsapi/Common/Model/Shape` | 6 C# files | Unread: source inventory only |
| `vsapi/Common/Particle` | 13 C# files | Unread: source inventory only |
| `vsapi/Common/Platform` | 1 C# files | Unread: source inventory only |
| `vsapi/Common/Playstyle` | 2 C# files | Unread: source inventory only |
| `vsapi/Common/Registry` | 2 C# files | Unread: source inventory only |
| `vsapi/Common/Text` | 3 C# files | Unread: source inventory only |
| `vsapi/Common/Texture` | 3 C# files | Unread: source inventory only |
| `vsapi/Common/Worldproperty` | 4 C# files | Unread: source inventory only |
| `vsapi/Config` | 5 C# files | Unread: source inventory only |
| `vsapi/Datastructures` | 27 C# files | Unread: source inventory only |
| `vsapi/Datastructures/AttributeTree` | 19 C# files | Unread: source inventory only |
| `vsapi/Datastructures/AttributeTree/Other` | 6 C# files | Unread: source inventory only |
| `vsapi/Datastructures/Dictionary` | 7 C# files | Unread: source inventory only |
| `vsapi/Datastructures/Net` | 2 C# files | Unread: source inventory only |
| `vsapi/Datastructures/Tags` | 4 C# files | Unread: source inventory only |
| `vsapi/Documentation` | 2 C# files | Unread: source inventory only |
| `vsapi/Localization` | 3 C# files | Unread: source inventory only |
| `vsapi/Math` | 22 C# files | Unread: source inventory only |
| `vsapi/Math/Cuboid` | 4 C# files | Unread: source inventory only |
| `vsapi/Math/Matrix` | 10 C# files | Unread: source inventory only |
| `vsapi/Math/Noise` | 6 C# files | Unread: source inventory only |
| `vsapi/Math/Rectangle` | 3 C# files | Unread: source inventory only |
| `vsapi/Math/Size` | 2 C# files | Unread: source inventory only |
| `vsapi/Math/Vector` | 20 C# files | Unread: source inventory only |
| `vsapi/Properties` | 1 C# files | Unread: source inventory only |
| `vsapi/Server` | 12 C# files | Unread: source inventory only |
| `vsapi/Server/API` | 11 C# files | Unread: source inventory only |
| `vsapi/Server/Worldgen` | 7 C# files | Unread: source inventory only |
| `vsapi/Util` | 23 C# files | Unread: source inventory only |

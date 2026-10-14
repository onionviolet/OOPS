# Rogue Legacy 1 released FNA source: system inventory

No build was installed or launched. This is the census of distinct systems found in the acquired public source or selected guides, with mechanical source coverage below. It is not an exhaustive commercial-build census. For guide-only games, unknown internal systems remain UNREAD. File counts establish size, not semantic coverage. Prior documentation labels refer to this game's earlier REPORT/CHECKPOINT and, for Rogue Legacy, COVERAGE.json.

| System/subsystem | Where it lives | Size signal | Documentation status |
|---|---|---|---|
| Dialogue/localization | `Managers/DialogueManager.cs; LocaleBuilder.cs; Resources/*.resx` | 106 registrations; 329 pages; 8 locales | NEW depth; full prose privately captured |
| Journal discovery/browser | `DiaryRoomObj.cs; DiaryEntryScreen.cs` | constant 25 | NEW depth |
| Save/profile/backup | `Managers/SaveGameManager.cs` | 5 binary domains | NEW depth |
| Lineage/classes/traits | `Screens/LineageScreen.cs; Types/TraitType.cs` | trait IDs 0..37 + Adopted sentinel | Prior; bounded refresh |
| Manor/skills | `SkillSystem.cs; SkillObj.cs` | global price increase 10 | Prior; formula refreshed |
| Equipment/runes/spells | `EquipmentSystem; PlayerObj; Types` | source files below | Prior selected paths |
| Room generation/map | `LevelBuilder; ProceduralLevelScreen` | room families below | Prior selected paths |
| Fairy objectives/bosses | `Game Objects/RoomObjs` | source files below | Prior selected paths |
| Enemy combat AI | `Game Objects/EnemyObjs` | enemy classes below | Prior; ShieldKnight refreshed |
| Physics/logic objects | `DS2DEngine` | source files below | UNREAD full engine |
| Screens/input/options | `Screens; InputSystem` | source files below | Dialogue subset; rest UNREAD |
| Tween/audio/particles | `Tweener; Managers; Game Objects` | source files below | UNREAD full semantics |
| Carnival/minigames/challenges | `RoomObjs; Screens` | source paths indexed | UNREAD beyond prior examples |
| Achievements/Steam/config | `Achievements; Game.cs` | source paths indexed | UNREAD |
| Content assets | `README exclusion` | not shipped in source | UNREAD; no build census |
| Original level editor | `README link to flibitijibibo/RogueCastleEditor` | external repository not acquired | UNREAD; compatibility warning |

Top three new/extended systems are described in [DEEPER_SYSTEMS.md](DEEPER_SYSTEMS.md).

## Complete mechanical source index

Pinned repo `RogueLegacy1` has 344 tracked paths; 291 C/C++ headers, C#, schedule, schema and JSON paths are indexed below. Excluded prose/assets/build files remain available in the private clone. Every path below was enumerated and hashed; most were not semantically read. Any file not cited in ASPECTS or DEEPER_SYSTEMS is **UNREAD by this pass**. A cited file still has unread ranges unless the row explicitly says full contract. Filename-derived subsystem labels are candidates, not asserted behavior.

| Source path | Lines | Declaration signal | Read status |
|---|---|---|---|
| `.vscode/launch.json` | 32 | 0 | UNREAD semantic content |
| `DS2DEngine/src/AI Logic/Actions/ChangePropertyLogicAction.cs` | 47 | 1 | UNREAD semantic content |
| `DS2DEngine/src/AI Logic/Actions/ChangeSpriteLogicAction.cs` | 119 | 1 | UNREAD semantic content |
| `DS2DEngine/src/AI Logic/Actions/ChangeStateLogicAction.cs` | 38 | 1 | UNREAD semantic content |
| `DS2DEngine/src/AI Logic/Actions/ChangeWeightLogicAction.cs` | 33 | 1 | UNREAD semantic content |
| `DS2DEngine/src/AI Logic/Actions/ChaseLogicAction.cs` | 160 | 3 | UNREAD semantic content |
| `DS2DEngine/src/AI Logic/Actions/DebugTraceLogicAction.cs` | 37 | 1 | UNREAD semantic content |
| `DS2DEngine/src/AI Logic/Actions/DelayLogicAction.cs` | 128 | 1 | UNREAD semantic content |
| `DS2DEngine/src/AI Logic/Actions/MoveDirectionLogicAction.cs` | 90 | 1 | UNREAD semantic content |
| `DS2DEngine/src/AI Logic/Actions/MoveLogicAction.cs` | 99 | 3 | UNREAD semantic content |
| `DS2DEngine/src/AI Logic/Actions/Play3DSoundLogicAction.cs` | 45 | 1 | UNREAD semantic content |
| `DS2DEngine/src/AI Logic/Actions/PlayAnimationLogicAction.cs` | 157 | 1 | UNREAD semantic content |
| `DS2DEngine/src/AI Logic/Actions/PlaySoundLogicAction.cs` | 31 | 1 | UNREAD semantic content |
| `DS2DEngine/src/AI Logic/Actions/RunFunctionLogicAction.cs` | 87 | 1 | UNREAD semantic content |
| `DS2DEngine/src/AI Logic/Actions/StopAnimationLogicAction.cs` | 39 | 1 | UNREAD semantic content |
| `DS2DEngine/src/AI Logic/Actions/TeleportLogicAction.cs` | 61 | 1 | UNREAD semantic content |
| `DS2DEngine/src/AI Logic/Base Objects/LogicAction.cs` | 64 | 1 | UNREAD semantic content |
| `DS2DEngine/src/AI Logic/Base Objects/LogicBlock.cs` | 148 | 1 | UNREAD semantic content |
| `DS2DEngine/src/AI Logic/Base Objects/LogicSet.cs` | 129 | 1 | UNREAD semantic content |
| `DS2DEngine/src/CDGMath.cs` | 259 | 1 | Selected ranges/contract cited; remaining scope partial |
| `DS2DEngine/src/Camera2D.cs` | 141 | 1 | UNREAD semantic content |
| `DS2DEngine/src/Circle.cs` | 55 | 1 | UNREAD semantic content |
| `DS2DEngine/src/CollisionMath.cs` | 615 | 1 | UNREAD semantic content |
| `DS2DEngine/src/Consts.cs` | 25 | 1 | UNREAD semantic content |
| `DS2DEngine/src/DS2DPool.cs` | 132 | 1 | UNREAD semantic content |
| `DS2DEngine/src/DebugHelper.cs` | 39 | 1 | UNREAD semantic content |
| `DS2DEngine/src/EngineEV.cs` | 22 | 1 | UNREAD semantic content |
| `DS2DEngine/src/FrameSoundObj.cs` | 65 | 1 | UNREAD semantic content |
| `DS2DEngine/src/GameObjs/BackgroundObj.cs` | 162 | 1 | UNREAD semantic content |
| `DS2DEngine/src/GameObjs/BlankObj.cs` | 224 | 1 | UNREAD semantic content |
| `DS2DEngine/src/GameObjs/CollisionBox.cs` | 255 | 1 | UNREAD semantic content |
| `DS2DEngine/src/GameObjs/GameObj.cs` | 838 | 2 | UNREAD semantic content |
| `DS2DEngine/src/GameObjs/Interfaces/IAnimateableObj.cs` | 30 | 0 | UNREAD semantic content |
| `DS2DEngine/src/GameObjs/Interfaces/IClickableObj.cs` | 34 | 0 | UNREAD semantic content |
| `DS2DEngine/src/GameObjs/Interfaces/IDisposableObj.cs` | 13 | 0 | UNREAD semantic content |
| `DS2DEngine/src/GameObjs/Interfaces/IDrawableObj.cs` | 18 | 0 | UNREAD semantic content |
| `DS2DEngine/src/GameObjs/Interfaces/IKillableObj.cs` | 12 | 0 | UNREAD semantic content |
| `DS2DEngine/src/GameObjs/Interfaces/IPoolableObj.cs` | 13 | 0 | UNREAD semantic content |
| `DS2DEngine/src/GameObjs/Interfaces/IStateObj.cs` | 12 | 0 | UNREAD semantic content |
| `DS2DEngine/src/GameObjs/Interfaces/ITriggerableObj.cs` | 12 | 0 | UNREAD semantic content |
| `DS2DEngine/src/GameObjs/ObjContainer.cs` | 589 | 1 | UNREAD semantic content |
| `DS2DEngine/src/GameObjs/PhysicsObj.cs` | 411 | 1 | UNREAD semantic content |
| `DS2DEngine/src/GameObjs/PhysicsObjContainer.cs` | 481 | 1 | UNREAD semantic content |
| `DS2DEngine/src/GameObjs/SpriteObj.cs` | 604 | 1 | UNREAD semantic content |
| `DS2DEngine/src/GameObjs/TextObj.cs` | 436 | 1 | UNREAD semantic content |
| `DS2DEngine/src/MoveToLogicAction.cs` | 62 | 1 | UNREAD semantic content |
| `DS2DEngine/src/ParticleObj.cs` | 132 | 1 | UNREAD semantic content |
| `DS2DEngine/src/ParticleSystem.cs` | 355 | 1 | UNREAD semantic content |
| `DS2DEngine/src/Physics/IPhysicsObj.cs` | 53 | 0 | UNREAD semantic content |
| `DS2DEngine/src/Physics/PhysicsManager.cs` | 280 | 1 | UNREAD semantic content |
| `DS2DEngine/src/RectangleTree.cs` | 343 | 4 | UNREAD semantic content |
| `DS2DEngine/src/SafeArea.cs` | 84 | 3 | UNREAD semantic content |
| `DS2DEngine/src/Screens/Screen.cs` | 123 | 1 | UNREAD semantic content |
| `DS2DEngine/src/Screens/ScreenManager.cs` | 161 | 1 | UNREAD semantic content |
| `DS2DEngine/src/SoundManager.cs` | 556 | 2 | UNREAD semantic content |
| `DS2DEngine/src/SpriteFontArray.cs` | 13 | 1 | UNREAD semantic content |
| `DS2DEngine/src/Triggers/Actions/ChangeSpriteTriggerAction.cs` | 43 | 1 | UNREAD semantic content |
| `DS2DEngine/src/Triggers/Actions/DelayTriggerAction.cs` | 56 | 1 | UNREAD semantic content |
| `DS2DEngine/src/Triggers/Actions/MoveObjTriggerAction.cs` | 66 | 1 | UNREAD semantic content |
| `DS2DEngine/src/Triggers/Actions/RunFunctionTriggerAction.cs` | 62 | 1 | UNREAD semantic content |
| `DS2DEngine/src/Triggers/Base Objects/TriggerAction.cs` | 44 | 1 | UNREAD semantic content |
| `DS2DEngine/src/Triggers/Base Objects/TriggerSet.cs` | 169 | 1 | UNREAD semantic content |
| `DS2DEngine/src/Triggers/Base Objects/TriggerSystem.cs` | 44 | 1 | UNREAD semantic content |
| `DS2DEngine/src/TxtToBinConverter.cs` | 33 | 1 | UNREAD semantic content |
| `DS2DEngine/src/Types.cs` | 24 | 3 | UNREAD semantic content |
| `DS2DEngine/src/XMLCompiler.cs` | 94 | 1 | UNREAD semantic content |
| `InputSystem/InputManager.cs` | 616 | 4 | UNREAD semantic content |
| `InputSystem/InputMap.cs` | 227 | 1 | UNREAD semantic content |
| `InputSystem/InputReader.cs` | 124 | 1 | UNREAD semantic content |
| `InputSystem/TouchGamepad.cs` | 165 | 2 | UNREAD semantic content |
| `RogueCastle/LocaleBuilder.cs` | 388 | 1 | Selected ranges/contract cited; remaining scope partial |
| `RogueCastle/Properties/AssemblyInfo.cs` | 34 | 0 | UNREAD semantic content |
| `RogueCastle/Resources/LocStrings.Designer.cs` | 14634 | 8 | UNREAD semantic content |
| `RogueCastle/src/ChestConditionChecker.cs` | 81 | 1 | UNREAD semantic content |
| `RogueCastle/src/Crepuscular Rays/BasePostProcess.cs` | 54 | 1 | UNREAD semantic content |
| `RogueCastle/src/Crepuscular Rays/BasePostProcessingEffect.cs` | 78 | 1 | UNREAD semantic content |
| `RogueCastle/src/Crepuscular Rays/CrepuscularRays.cs` | 99 | 1 | UNREAD semantic content |
| `RogueCastle/src/Crepuscular Rays/LightRay.cs` | 53 | 1 | UNREAD semantic content |
| `RogueCastle/src/Crepuscular Rays/LightSourceMask.cs` | 51 | 1 | UNREAD semantic content |
| `RogueCastle/src/Crepuscular Rays/PostProcessingManager.cs` | 73 | 1 | UNREAD semantic content |
| `RogueCastle/src/Crepuscular Rays/ScreenQuad.cs` | 63 | 1 | UNREAD semantic content |
| `RogueCastle/src/EVs/EnemyEV.cs` | 238 | 1 | UNREAD semantic content |
| `RogueCastle/src/EVs/GameEV.cs` | 205 | 9 | UNREAD semantic content |
| `RogueCastle/src/EVs/GlobalEV.cs` | 19 | 1 | UNREAD semantic content |
| `RogueCastle/src/EVs/LevelEV.cs` | 127 | 1 | UNREAD semantic content |
| `RogueCastle/src/EVs/PlayerEV.cs` | 58 | 1 | UNREAD semantic content |
| `RogueCastle/src/EVs/SpellEV.cs` | 435 | 1 | UNREAD semantic content |
| `RogueCastle/src/EnemyBuilder.cs` | 123 | 1 | UNREAD semantic content |
| `RogueCastle/src/EquipmentSystem.cs` | 244 | 1 | UNREAD semantic content |
| `RogueCastle/src/FrameRateCounter.cs` | 69 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/BlacksmithObj.cs` | 53 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/BorderObj.cs` | 302 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/BreakableObj.cs` | 217 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/CharacterObj.cs` | 140 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/ChestObj.cs` | 442 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/DialogueObj.cs` | 41 | 1 | Selected ranges/contract cited; remaining scope partial |
| `RogueCastle/src/Game Objects/DoorObj.cs` | 96 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyHUDObj.cs` | 136 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj.cs` | 1272 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_BallAndChain.cs` | 538 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Blob.cs` | 960 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_BouncySpike.cs` | 363 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Chicken.cs` | 284 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Dummy.cs` | 115 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Eagle.cs` | 147 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_EarthWizard.cs` | 872 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Energon.cs` | 470 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Eyeball.cs` | 913 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Fairy.cs` | 894 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_FireWizard.cs` | 535 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Fireball.cs` | 707 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_HomingTurret.cs` | 358 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Horse.cs` | 611 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_IceWizard.cs` | 562 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Knight.cs` | 659 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_LastBoss.cs` | 1904 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Mimic.cs` | 336 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Ninja.cs` | 569 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Plant.cs` | 400 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Platform.cs` | 164 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Portrait.cs` | 510 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_ShieldKnight.cs` | 454 | 1 | Selected ranges/contract cited; remaining scope partial |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Skeleton.cs` | 500 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_SkeletonArcher.cs` | 524 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Spark.cs` | 456 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_SpikeTrap.cs` | 189 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Starburst.cs` | 392 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_SwordKnight.cs` | 460 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Turret.cs` | 166 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Wall.cs` | 176 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Wolf.cs` | 394 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyObj_Zombie.cs` | 401 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyObjs/EnemyTemplate.cs` | 87 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyOrbObj.cs` | 27 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnemyTagObj.cs` | 26 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/EnergonProjectileObj.cs` | 94 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/FairyChestObj.cs` | 264 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/HazardObj.cs` | 144 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/HoverObj.cs` | 47 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/IDealsDamageObj.cs` | 12 | 0 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/ItemDropObj.cs` | 178 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/KeyIconObj.cs` | 219 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/KeyIconTextObj.cs` | 250 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/KingObj.cs` | 52 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/LightSourceObj.cs` | 74 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/LineageObj.cs` | 787 | 2 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/MapObj.cs` | 578 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/NpcObj.cs` | 124 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/OptionsObjs/BackToMenuOptionsObj.cs` | 89 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/OptionsObjs/ChangeControlsOptionsObj.cs` | 545 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/OptionsObjs/DeadZoneOptionsObj.cs` | 95 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/OptionsObjs/DeleteSaveOptionsObj.cs` | 65 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/OptionsObjs/ExitProgramOptionsObj.cs` | 46 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/OptionsObjs/FullScreenOptionsObj.cs` | 104 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/OptionsObjs/LanguageOptionsObj.cs` | 167 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/OptionsObjs/MusicVolOptionsObj.cs` | 88 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/OptionsObjs/OptionsObj.cs` | 84 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/OptionsObjs/QuickDropOptionsObj.cs` | 89 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/OptionsObjs/ReduceQualityOptionsObj.cs` | 106 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/OptionsObjs/ResolutionOptionsObj.cs` | 181 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/OptionsObjs/SFXVolOptionsObj.cs` | 88 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/OptionsObjs/SteamCloudOptionsObj.cs` | 89 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/OptionsObjs/UnlockTraitorOptionsObj.cs` | 107 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/Player/PlayerHUDObj.cs` | 389 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/Player/PlayerObj.cs` | 4304 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/Player/PlayerStats.cs` | 396 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/PlayerStartObj.cs` | 21 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/ProjectileIconObj.cs` | 105 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/ProjectileObj.cs` | 660 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RaindropObj.cs` | 166 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Bonus Rooms/ArenaBonusRoomObj.cs` | 191 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Bonus Rooms/BonusRoomObj.cs` | 23 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Bonus Rooms/CarnivalShoot1BonusRoom.cs` | 505 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Bonus Rooms/CarnivalShoot2BonusRoom.cs` | 593 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Bonus Rooms/ChestBonusRoomObj.cs` | 274 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Bonus Rooms/DiaryRoomObj.cs` | 112 | 1 | Selected ranges/contract cited; remaining scope partial |
| `RogueCastle/src/Game Objects/RoomObjs/Bonus Rooms/JukeboxBonusRoom.cs` | 204 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Bonus Rooms/PortraitRoomObj.cs` | 81 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Bonus Rooms/RandomTeleportRoomObj.cs` | 110 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Bonus Rooms/SpecialItemRoomObj.cs` | 233 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Bonus Rooms/SpellSwapRoomObj.cs` | 179 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Bonus Rooms/VitaChamberRoomObj.cs` | 96 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Boss Rooms/BlobBossRoom.cs` | 203 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Boss Rooms/BossRoomObj.cs` | 267 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Boss Rooms/EyeballBossRoom.cs` | 114 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Boss Rooms/FairyBossRoom.cs` | 135 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Boss Rooms/FireballBossRoom.cs` | 188 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Boss Rooms/LastBossRoom.cs` | 361 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/CastleEntranceRoomObj.cs` | 393 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Challenge Boss Rooms/BlobChallengeRoom.cs` | 418 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Challenge Boss Rooms/ChallengeBossRoomObj.cs` | 534 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Challenge Boss Rooms/EyeballChallengeRoom.cs` | 187 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Challenge Boss Rooms/FairyChallengeRoom.cs` | 231 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Challenge Boss Rooms/FireballChallengeRoom.cs` | 189 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/Challenge Boss Rooms/LastBossChallengeRoom.cs` | 237 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/CompassRoomObj.cs` | 60 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/EndingRoomObj.cs` | 475 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/IntroRoomObj.cs` | 316 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/RoomObj.cs` | 1048 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/StartingRoomObj.cs` | 1010 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/ThroneRoomObj.cs` | 157 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/RoomObjs/TutorialRoomObj.cs` | 445 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/SkillObj.cs` | 161 | 1 | Selected ranges/contract cited; remaining scope partial |
| `RogueCastle/src/Game Objects/SkyObj.cs` | 240 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/TeleporterObj.cs` | 82 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/TerrainObj.cs` | 81 | 2 | UNREAD semantic content |
| `RogueCastle/src/Game Objects/WaypointObj.cs` | 26 | 1 | UNREAD semantic content |
| `RogueCastle/src/Game.cs` | 1612 | 3 | Selected ranges/contract cited; remaining scope partial |
| `RogueCastle/src/GameUtil.cs` | 18 | 1 | UNREAD semantic content |
| `RogueCastle/src/GaussianBlur.cs` | 310 | 3 | UNREAD semantic content |
| `RogueCastle/src/ImpactEffectPool.cs` | 1138 | 1 | UNREAD semantic content |
| `RogueCastle/src/LevelBuilder2.cs` | 2476 | 2 | UNREAD semantic content |
| `RogueCastle/src/LevelParser.cs` | 414 | 1 | UNREAD semantic content |
| `RogueCastle/src/Lighting Effect/LightArea.cs` | 42 | 1 | UNREAD semantic content |
| `RogueCastle/src/Lighting Effect/QuadRenderComponent.cs` | 69 | 1 | UNREAD semantic content |
| `RogueCastle/src/Lighting Effect/ShadowmapResolver.cs` | 166 | 2 | UNREAD semantic content |
| `RogueCastle/src/LogicActions/CheckWallLogicAction.cs` | 48 | 1 | UNREAD semantic content |
| `RogueCastle/src/LogicActions/DelayObjLogicAction.cs` | 121 | 1 | UNREAD semantic content |
| `RogueCastle/src/LogicActions/FireProjectileLogicAction.cs` | 48 | 1 | UNREAD semantic content |
| `RogueCastle/src/LogicActions/GroundCheckLogicAction.cs` | 50 | 1 | UNREAD semantic content |
| `RogueCastle/src/LogicActions/JumpLogicAction.cs` | 41 | 1 | UNREAD semantic content |
| `RogueCastle/src/LogicActions/LockFaceDirectionLogicAction.cs` | 43 | 1 | UNREAD semantic content |
| `RogueCastle/src/Managers/DialogueManager.cs` | 820 | 1 | Selected ranges/contract cited; remaining scope partial |
| `RogueCastle/src/Managers/ItemDropManager.cs` | 152 | 1 | UNREAD semantic content |
| `RogueCastle/src/Managers/ProjectileManager.cs` | 476 | 2 | UNREAD semantic content |
| `RogueCastle/src/Managers/SaveGameManager.cs` | 2276 | 4 | Selected ranges/contract cited; remaining scope partial |
| `RogueCastle/src/Managers/TextManager.cs` | 201 | 1 | UNREAD semantic content |
| `RogueCastle/src/Program.cs` | 189 | 1 | UNREAD semantic content |
| `RogueCastle/src/ProjectileIconPool.cs` | 164 | 1 | UNREAD semantic content |
| `RogueCastle/src/SWManager.cs` | 136 | 2 | UNREAD semantic content |
| `RogueCastle/src/Screens/Base Objects/RCScreenManager.cs` | 599 | 1 | UNREAD semantic content |
| `RogueCastle/src/Screens/BlacksmithScreen.cs` | 1094 | 2 | UNREAD semantic content |
| `RogueCastle/src/Screens/BlitWorksSplashScreen.cs` | 119 | 1 | UNREAD semantic content |
| `RogueCastle/src/Screens/CDGSplashScreen.cs` | 159 | 1 | UNREAD semantic content |
| `RogueCastle/src/Screens/CreditsScreen.cs` | 1437 | 1 | UNREAD semantic content |
| `RogueCastle/src/Screens/DeathDefiedScreen.cs` | 156 | 1 | UNREAD semantic content |
| `RogueCastle/src/Screens/DemoEndScreen.cs` | 78 | 1 | UNREAD semantic content |
| `RogueCastle/src/Screens/DemoStartScreen.cs` | 68 | 1 | UNREAD semantic content |
| `RogueCastle/src/Screens/DialogueScreen.cs` | 507 | 1 | Selected ranges/contract cited; remaining scope partial |
| `RogueCastle/src/Screens/DiaryEntryScreen.cs` | 319 | 1 | Selected ranges/contract cited; remaining scope partial |
| `RogueCastle/src/Screens/DiaryFlashbackScreen.cs` | 296 | 1 | UNREAD semantic content |
| `RogueCastle/src/Screens/EnchantressScreen.cs` | 857 | 1 | UNREAD semantic content |
| `RogueCastle/src/Screens/GameOverBossScreen.cs` | 345 | 1 | UNREAD semantic content |
| `RogueCastle/src/Screens/GameOverScreen.cs` | 677 | 1 | UNREAD semantic content |
| `RogueCastle/src/Screens/GetItemScreen.cs` | 705 | 1 | UNREAD semantic content |
| `RogueCastle/src/Screens/LineageScreen.cs` | 1076 | 2 | UNREAD semantic content |
| `RogueCastle/src/Screens/LoadingScreen.cs` | 479 | 1 | UNREAD semantic content |
| `RogueCastle/src/Screens/MapScreen.cs` | 470 | 1 | UNREAD semantic content |
| `RogueCastle/src/Screens/OptionsScreen.cs` | 469 | 1 | UNREAD semantic content |
| `RogueCastle/src/Screens/PauseScreen.cs` | 518 | 2 | UNREAD semantic content |
| `RogueCastle/src/Screens/ProceduralLevelScreen.cs` | 3362 | 1 | UNREAD semantic content |
| `RogueCastle/src/Screens/ProfileCardScreen.cs` | 1031 | 2 | UNREAD semantic content |
| `RogueCastle/src/Screens/ProfileSelectScreen.cs` | 522 | 1 | UNREAD semantic content |
| `RogueCastle/src/Screens/SkillScreen.cs` | 1284 | 1 | UNREAD semantic content |
| `RogueCastle/src/Screens/SkillUnlockScreen.cs` | 306 | 1 | UNREAD semantic content |
| `RogueCastle/src/Screens/TextScreen.cs` | 174 | 1 | UNREAD semantic content |
| `RogueCastle/src/Screens/TitleScreen.cs` | 763 | 1 | UNREAD semantic content |
| `RogueCastle/src/SkillBuilder.cs` | 1398 | 1 | UNREAD semantic content |
| `RogueCastle/src/SkillSystem.cs` | 326 | 2 | UNREAD semantic content |
| `RogueCastle/src/SleepUtil.cs` | 50 | 2 | UNREAD semantic content |
| `RogueCastle/src/Types/BonusRoomTypes.cs` | 23 | 1 | UNREAD semantic content |
| `RogueCastle/src/Types/BossRoomTypes.cs` | 19 | 1 | UNREAD semantic content |
| `RogueCastle/src/Types/ChestConditionType.cs` | 22 | 1 | UNREAD semantic content |
| `RogueCastle/src/Types/ChestType.cs` | 17 | 1 | UNREAD semantic content |
| `RogueCastle/src/Types/ClassType.cs` | 281 | 3 | UNREAD semantic content |
| `RogueCastle/src/Types/EnemyType.cs` | 47 | 1 | UNREAD semantic content |
| `RogueCastle/src/Types/EquipmentType.cs` | 487 | 6 | UNREAD semantic content |
| `RogueCastle/src/Types/FamilyTreeNode.cs` | 34 | 1 | UNREAD semantic content |
| `RogueCastle/src/Types/GameTypes.cs` | 95 | 9 | UNREAD semantic content |
| `RogueCastle/src/Types/GetItemType.cs` | 19 | 1 | UNREAD semantic content |
| `RogueCastle/src/Types/InputMapType.cs` | 47 | 1 | UNREAD semantic content |
| `RogueCastle/src/Types/ItemDropType.cs` | 38 | 1 | UNREAD semantic content |
| `RogueCastle/src/Types/LanguageType.cs` | 20 | 1 | UNREAD semantic content |
| `RogueCastle/src/Types/LineageTypes.cs` | 36 | 1 | UNREAD semantic content |
| `RogueCastle/src/Types/OrbType.cs` | 15 | 1 | UNREAD semantic content |
| `RogueCastle/src/Types/PlayerPart.cs` | 55 | 1 | UNREAD semantic content |
| `RogueCastle/src/Types/RoomType.cs` | 22 | 1 | UNREAD semantic content |
| `RogueCastle/src/Types/ScreenType.cs` | 49 | 1 | UNREAD semantic content |
| `RogueCastle/src/Types/SkillType.cs` | 167 | 3 | UNREAD semantic content |
| `RogueCastle/src/Types/SkillUnlockType.cs` | 75 | 1 | UNREAD semantic content |
| `RogueCastle/src/Types/SpecialItemType.cs` | 92 | 1 | UNREAD semantic content |
| `RogueCastle/src/Types/SpellType.cs` | 171 | 1 | UNREAD semantic content |
| `RogueCastle/src/Types/TraitType.cs` | 499 | 1 | Selected ranges/contract cited; remaining scope partial |
| `RogueCastle/src/VirtualScreen.cs` | 140 | 1 | UNREAD semantic content |
| `RogueCastle/src/WordBuilder.cs` | 40 | 1 | UNREAD semantic content |
| `RogueCastle/src/XMLCompiler.cs` | 78 | 2 | UNREAD semantic content |
| `SpriteSystem/SpriteLibrary.cs` | 515 | 1 | UNREAD semantic content |
| `SpriteSystem/SpritesheetObj.cs` | 183 | 5 | UNREAD semantic content |
| `Tweener/Ease.cs` | 265 | 11 | UNREAD semantic content |
| `Tweener/Tween.cs` | 305 | 1 | UNREAD semantic content |
| `Tweener/TweenObject.cs` | 296 | 1 | UNREAD semantic content |

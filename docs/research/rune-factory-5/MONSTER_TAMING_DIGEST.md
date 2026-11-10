# Rune Factory 5 monster taming digest (CPR22)

Paraphrased from the private capture (`private/fs-rune-factory-5/tables/`) and
class signature dumps (`~/.codex/research/fs-rune-factory-5/extract/classes/`).
Labels: **SHOWN** = a table value or declared constant; **STATED** = a UI string
or enum name says so; **INFERRED** = reading from names, bodies not decompiled.
Class dumps carry signatures and constants only, so every method body below is
INFERRED from its name and fields. Locators are table and field names. Donor
facts, not YAIRPG proposals; see the companion palette rows CPR14-CPR24 in
[the companions considerations](../../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md).
Extends F6/F7 in [DIALOGUE_AND_HELPERS_DIGEST.md](DIALOGUE_AND_HELPERS_DIGEST.md).

## M1. One species row, three jobs (SHOWN)

`MonsterDataTableArray.DataTables` has 273 rows. One row decides whether a species
can be a friend, a capture, a mount and a producer:

| Field | Meaning | Spread across rows |
|---|---|---|
| `CanFriend`, `CanFriendInitPercent` | befriend allowed, base percent | 188 can; base percents vary 8-20+, most common 1 (46 rows) |
| `CanCatch`, `CanCatchInitPercent` | capture allowed, base percent | 158 can; base 5-40, most common 30 (59 rows) |
| `RideCount`, `RideMaxSpeedRate`, `RideAnimationType` | mount seats (1 or 2), speed multiplier | 149 rideable (87 one seat, 62 two); speed 1.3-2.2 |
| `YieldPercent`, `YieldItemIDArray` | daily product chance and items | 40 species; 31 at 100 percent, others 13-78 |
| `FavoriteItemData.ItemIDArray` / `LikePointArray` | liked items and points | 188 rows; 1-4 items; points mostly 5, rare 8, 10, 15 |
| `DefeatBonus_HP/STR/INT/VIT` | stat bonus a partner gets from kills of this kind | per species |
| `CharaParam` (`StartLevel`, `HPRate`, `AtkRate`, `StrRate`...) | growth multipliers | per species |
| `DefenceRestraint`, `ReleaseRestraintRate` | capture-restraint resistance | 100 on sampled rows |

Cross-tab (SHOWN): 157 species can be both friend and catch, 31 friend only,
1 catch only, 84 neither (bosses, scenery). So "tame" and "capture" are two
separate doors on one record: one makes a partner, the other a farm resident
(INFERRED from `JoinIn` and `CanCatch` use; the doors share the `FriendMonsterStatusData` record).

## M2. Befriending is a rate built from care acts (SHOWN constants, INFERRED formula)

`ConstMonster` holds the whole taming budget. `MonsterTameRateController`
(fields `BrushCount`, `PresentItemCount`, `FavoritePresentItemCount`,
`FavoritePresentItemRate`, `TakeDamageLoveAttributeCount`; methods `GetRate`,
`TryBrush`, `TryPresentItem(item, out isFavorite)`, `IsFavorite`,
`TryTakeDamageLoveAttribute`) reads it:

| Constant | Value | Reading (INFERRED) |
|---|---|---|
| `Tame_UpRate_Brushing` / `Tame_MaxCount_Brushing` | 0.75 / 15 | each brushing adds 0.75 points to the rate, counted up to 15 times |
| `Tame_UpRate_Present` / `Tame_MaxCount_Present` | 2.0 / 10 | each gift adds 2.0, up to 10 gifts; liked items tracked separately |
| `Tame_UpRate_SkillLevel` / `Tame_Max_SkillLevel` | 0.1 / 200 | taming skill level adds 0.1 per level, up to level 200 (so up to 20) |
| `Tame_UpRate_LoveAttributeAttack` / `...MaxCount` | 0.1 / 100 | hitting a monster with a love-element attack adds 0.1 per hit, up to 100 hits |
| `Tame_DownRate_DiffLevel` | 2.0 | rate falls with the level gap between player and monster |
| `Tame_HalfRate_Max_SameMonsterCount` | 4 | owning that many of the same species halves the rate (`SameMonsterCount`) |
| `Tame_Min_Rate` / `Tame_Boss_Max_Rate` | 1.0 / 10.0 | a floor, and a cap for bosses |

Mechanism worth keeping (SHOWN shape, INFERRED exact formula): the species base
percent (`CanFriendInitPercent`) is raised by capped, per-act counters, and
every channel has its own cap, so no single act (spamming gifts) wins. The skill
text (STATED, `english/SkillUIDiscriptData`) says the taming skill rises from
taming, brushing and gifting, and in turn makes befriending slightly easier and
lifts partner attack, defense and intelligence.
The rate is an in-fight state on a live monster (`MonsterControllerBase` owner),
so befriending happens during an encounter, not at a menu (INFERRED).

## M3. Friendship is a 0-10 level with an overflow tail (SHOWN)

`MonsterLovePoint` constants: `POINT_MAX` 65535, `LV_MAX` 10, `LV_10_EXP` 255,
`OVER_LV_EXP` 64, `LV_OVER_MAX` 1000, `PRESENT_ITEM_PLUS_MAX` 5, a special
`LoveDrinkID` item (2009). Two arrays, `LovePointTable` and `LovePointRiseTable`,
hold the level thresholds and per-act rise; they are runtime-initialized and not in
the table capture (gap).

Love changes by `FluctuationType` (SHOWN enum): Present, PresentFavorite, Esa
(feed), Partner (adventuring together), Partner_Miss (a negative route, name only),
Brushing, LoveDrink. `GetAddMonsterSkillLevel` suggests the taming skill scales
the gain (INFERRED). Present gifts also grant stat bonuses by item
(`PresentStatusUp_Item`) or by item category (`PresentStatusUp_Category`), and a
favourite doubles up on a flag (`isFavorite`).

Past level 10 the game keeps counting, up to `LV_OVER_MAX` 1000 points over, and
`FriendParamDataTableArray` (31 rows, `LoveLevel` 0-30) maps love level to flat
partner `Atk` and `Def`:

| LoveLevel | 0 | 1 | 3 | 5 | 8 | 10 | 15 | 20 | 25 | 30 |
|---|---|---|---|---|---|---|---|---|---|---|
| Atk | 0 | 5 | 21 | 48 | 116 | 164 | 256 | 400 | 532 | 720 |
| Def | 0 | 2 | 9 | 20 | 44 | 64 | 150 | 256 | 400 | 600 |

(SHOWN.) Levels 11-30 are the overflow tail; friendship is both a threshold
ladder (work unlocks) and a smooth stat curve.

## M4. Per-monster record (SHOWN)

`FriendMonsterStatusData` fields: `DataID`, `Name` (player-named), `MonsterDataID`,
`LovePoint`, `TimeStamp`, `FarmId`, `HouseId`, `RoomId`, `PartyNo`,
`PartnerMovementOrderType` (None, FollowClose, FollowMiddle, Wait),
`FarmMonsterOrder` (None, FarmWork, FarmWorkWithSeed), `FarmFieldWorkArea`
(None, Left, Center, Right), daily flags `IsBrushed`, `IsPresent`, `EsaGet`,
`IsWorkedToday`, `IsSeededToday`, `IsYieldToday`, and per-monster stat bonuses
`Bonus_HP/STR/INT/VIT`. `FriendMonsterStatus` adds `LoveLV`, `BrushCount`,
`PresentCount`, `AddLovePoint(type, likePoint)`, `AddDefeatBonus`, `Present`.

Reading: one record covers party member, farm resident and worker; each care act
has a once-a-day flag (brushed, gifted, fed) that resets in `FriendMonsterManager.Morning`
and `OnDayCarry(days)` (INFERRED). Care is a daily chore with a cap, not a
free-spam button (matches `Tame_MaxCount_*`).

## M5. Barn capacity, roaming, feed (SHOWN)

- `FriendMonsterManager`: `MONSTERHUT_ROOM_CAPACITY` 4, `MONSTERHUT_HOUSE_CAPACITY` 20
  (so five rooms a house). Counts by farm, house and room (`EmptyCountRoom`,
  `GetBelongMonsterCount`). `JoinIn` adds a monster, `Leave` releases one.
  `FarmIn` and `FarmOut` spawn and despawn the residents when the player enters
  or leaves a farm: residents are records first, bodies only on screen (INFERRED).
- `OneDayEsaCost()` is a per-day feed cost across all residents; `ConstFarm.Esa_Power`
  4 is the feed strength. Feed is a bulk daily cost with a `EsaGet` flag per monster.
- Hut behaviour (`ConstFarm`, SHOWN): `MonsterHut_AppealLoveLevel` 8,
  `MonsterHut_FriendLoveLevel` 3, `MonsterHut_EscapeLoveLevel` 0. State enum
  `FarmMonsterHutState`: Escape, Wander, Appeal. Reading (INFERRED): a monster
  at love 0-2 flees you, 3-7 wanders and tolerates you, 8+ comes to appeal for
  attention. Related: wander range 30, escape range 5, appeal range 1, wait 0-1 s,
  `MonsterHut_TiredHPPercent` 50 (below half HP the monster is tired).
- Idle behaviour (`ConstFarm`): `NotTask_WanderRate` 3 to `NotTask_WaitRate` 7
  (wander three parts in ten), wait 3-5 s. Sheep wool: `MaxRandomCutWoolDropCount_Friend`
  5, `_Enemy` 3 (a friend yields more wool per cut than a wild one).
- UI: `UIMonsterHutBlock`, `UIMonsterHutMenu`; behavior-tree variable
  `SharedFarmMonsterHutState` (`CompareSharedFarmMonsterHutState`,
  `SetSharedFarmMonsterHutState`) drives the hut behavior from data tables.

## M6. Helper work (SHOWN gates, INFERRED rules)

- Gates: `MonsterLovePoint.CAN_FARMWORK_LV` 3 (can farm-work) and
  `CAN_SOWINGSEED_LV` 8 (can sow seed). The same numbers as the hut's
  friend and appeal levels: friendship unlocks what the monster will do.
- Order: the player sets `FarmMonsterOrder` (work, or work with seed) and a
  `FarmFieldWorkArea` slot, Left, Center or Right. `GetFreeFarmFieldWorkArea`
  and `IsExistFarmSupportMonster` guard a slot, so a farm has three helper
  slots (INFERRED from the three enum values).
- Runtime: `FarmSupportMonsterData` (`FriendMonsterDataID`, `State`, `WorkTime`,
  `CellIndex`, position) is the saved progress. `FarmSupportState` names
  Room, OutHut, InHut, InRoom, Clean, Water, Crop, Seed. Work is windowed:
  `WorkTimeStart`, `WorkTimeStart_Seed`, `_Water`, `_Crop`, `WorkTimeEnd` (values
  are runtime-initialized; gap).
- Costs: `ConstFarm.WorkCost_MaxHpRatio` 8 (work costs a share of max HP),
  `Farm_WorkCost` 0, `Farm_WorkSeedCost` 1000, and a `MoneyBias` constant 0.005
  in `FarmSupportMonsterManager`; `GetPlantSeed` and `CanBuySeedList` (from
  `SeedShopItemDataTable`) show a seeding helper picks seeds from the shop list
  and the 1000 is probably the money cost per planting (INFERRED; units unverified).
- `UpdateDay(elapsedTime)` runs catch-up for days away; `IsWorkedToday`,
  `IsSeededToday` stop double work (INFERRED).
- `SeedSupportDataTableArray` (IDs 1-4) is four timeline-ID sequences for the
  seed-sowing animation, not a rules table.

## M7. Products and riding (SHOWN)

- Products: 40 species have `YieldItemIDArray` (30 with one item, 10 with three)
  and a `YieldPercent`; with `IsYieldToday` that is one roll per monster per day
  (INFERRED). Most producers are a flat 100 percent, a few probabilistic.
  Gating on love level is not in the table; the item IDs are the only route.
- Riding: `MonsterRideManager` (`DoRide(monster, riders[])`, up to two riders
  `m_Rider1`, `m_Rider2`, a saddle `m_Saddle`), species fields `RideCount`
  (1 or 2), `RideMaxSpeedRate`, `RideCameraYOffset`, `FriendMoveParamID`.
  Mounting is a state that swaps the controller (`UpdateMonsterSaddle`,
  `EndRide`). Two-seat species carry a companion NPC too.

## M8. Fighting partners (SHOWN)

- Partner level steps: `MonsterParamDataTableArray` (26 rows, `Level` 0-50001)
  gives `MaxHp`, `Attack`, `Defense`, `MagicAttack`, `MagicDefense` and `Exp` per
  level: e.g. L10 HP 100 / Atk 20 / Exp 95, L50 HP 1200 / Atk 240 / Exp 700,
  L100 HP 4500 / Atk 550 / Exp 4200. Species `CharaParam.*Rate` scale this.
  `FriendParamDataTableArray` adds love-level flat stats (M3).
- `FriendNPCBehaviorDataTable` (29 rows) and `FriendNPCFindTargetDataTable`
  (66 rows) are the behavior-tree tables for partner NPCs (target choice by
  comparison), not for tamed monsters; tamed monsters use `MonsterBehaviorDataTableArray`
  (209) with `FriendBehaviorWaitRate`, `FriendMovementOrderCloseRange/LeaveRange`.
- `PartyNo` and `PartnerMovementOrderType` give party slots and follow style.
- Kills grant `DefeatBonus_*` once per species kind (`AddDefeatBonus` returns a
  bool, so likely a one-time per-kind grant per monster, INFERRED).
- `MAS_Monsterbox_ActionCodeArray` (11 entries: Attack_1-5, FarmAction, Laser_01-03,
  Arrow_01) is an animation/action script for a box-monster enemy; not a taming
  table. Pet NPCs (`PetNpcPetDataTable`: `ActorID`, two `MonsterDataID`s, `Gender`)
  give each villager one or two companion species; `PetManager` runs a pet
  festival contest (`AsyncChallange`, result states).

## Gaps

Love and rise tables, work window times, the tame-rate formula's combination
(sum vs product), yield amounts by love level and per-species favourite names
are not in the committed capture; they need method bodies or runtime reads.

## Reusable shapes for YAIRPG (proposal, default and dial)

1. Taming as capped per-channel counters on a base chance (M2).
2. Friendship ladder with unlock thresholds and a smooth stat tail (M3, M6).
3. Daily care flags that bound each act per day (M4).
4. A room/house capacity pair for held beings (M5).
5. Helper slots plus work gates by friendship and HP cost (M6).

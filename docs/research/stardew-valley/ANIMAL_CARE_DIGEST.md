# Stardew Valley animal and pet care digest (CPR23)

Sources and labels. **SHOWN** = a value decoded from the installed game's
`Data/FarmAnimals.xnb` and `Data/Pets.xnb` (decoded with the repo's read-only
XNB reader to a scratch folder, not committed) or a declared default in
`GameData.cs`. **STATED** = the decompiled schema's own documentation comment,
which describes what the evaluator does. **INFERRED** = my reading. The
evaluator classes themselves (`FarmAnimal`, `Pet`, `AnimalHouse`, `PetBowl`)
are not in the capture, so per-day formulas other than the ones the schema
documents are gaps. The schema is in
[SYSTEM_INVENTORY.md](aspects-2026-10-14/SYSTEM_INVENTORY.md)
(`FarmAnimalData`, 62 fields; `PetData`, 18). Locators below are field names.

## A1. An animal is a data row with a growth clock and a produce clock (SHOWN, STATED)

`FarmAnimalData` fields, grouped:

- Home and cost: `House`, `RequiredBuilding`, `PurchasePrice` (half the real
  price; negative disables purchase), `SellPrice`, `UnlockCondition`,
  `AlternatePurchaseTypes` (variants picked at random on purchase),
  `EggItemIds` plus `IncubationTime` (default 9000 in-game minutes; dinosaur
  18000) for hatching from an item.
- Growth: `DaysToMature` (3 chickens, 5 duck/cow/goat, 4 sheep, 6 rabbit, 10 pig,
  7 ostrich), `CanGetPregnant` (cows, goats, sheep, pigs true; poultry false;
  births are the other route to new animals).
- Production: `DaysToProduce` (gap in days: chicken 1, duck 2, rabbit 4, goat 2,
  sheep 3, cow 1, pig 1, ostrich and dinosaur 7), `ProduceItemIds`,
  `DeluxeProduceItemIds`, `HarvestType` (DropOvernight, HarvestWithTool,
  DigUp), `HarvestTool` (Milk Pail, Shears), `ProduceOnMature` (sheep, wool the
  day they grow up).
- Care: `GrassEatAmount` (2 for poultry, 4 for barn animals), `HappinessDrain`
  (per-day drop when not petted or no winter heater: 7 White/Brown/Blue Chicken,
  5 duck/rabbit/goat/sheep/ostrich, 6 cow, 4 pig, 10 Golden Chicken, 3 dinosaur,
  5 Void Chicken).
- Boosts by profession: `ProfessionForHappinessBoost` (easier to befriend),
  `ProfessionForQualityBoost`, `ProfessionForFasterProduce` (sheep only; with
  `FriendshipForFasterProduce` 900).
- Misc: `CanEatGoldenCrackers` (doubles output), `CanSwim`, `BabiesFollowAdults`,
  pet hit-box sizes, sounds, skins.

Reading (INFERRED): production is a countdown that restarts on harvest, the
"mature" gate is a separate countdown, and a row can declare a different
produce set with a condition (condition text is optional per produce entry).

## A2. Quality and the deluxe roll (STATED formula, SHOWN constants)

The schema documents the "deluxe" (large) product roll. Given friendship and a
happiness modifier:

- happiness above 200: modifier = happiness x 1.5; above 100: 0; otherwise
  happiness minus 100 (negative when unhappy).
- chance = (friendship + modifier) / `DeluxeProduceCareDivisor`, plus
  daily luck x `DeluxeProduceLuckMultiplier`.
- Needs `DeluxeProduceMinimumFriendship` (default 200).

Constants (SHOWN): divisor 1200 for most animals, 4750 for duck, 5000 for
rabbit; luck multiplier 0 by default, about 1.01 for duck and 1.02 for rabbit.
So friendship matters most for ordinary animals and daily luck matters for
the rare producers; the documented example is friendship 102, happiness 150
giving 8.5 percent. Selling price scales with friendship from 0.3 times
`SellPrice` at zero to 1.3 at max (STATED, `SellPrice` comment). Friendship
points reach 1000 at the top (STATED by the pet gift threshold default and
the sell-price comment; per-day gains are a gap).

## A3. Products by species (SHOWN ids, INFERRED names)

Item IDs from the decoded rows; names are vanilla item identities from the
IDs (INFERRED): chickens produce egg 176 or 180 with large version 174 or 182;
void chicken 305 and golden chicken 928 with no deluxe set; duck 442 with
444; rabbit 440 with 446; cow 184 with 186; goat 436 with 438; sheep 440
(no deluxe); pig 430 by digging; ostrich 289; dinosaur 107. Only ordinary chicken
and cow/goat/duck/rabbit rows have a deluxe item; the rare ones trade
quality-roll for being rare.

## A4. Friendship and happiness as separate meters (STATED, INFERRED)

Two numbers drive an animal: friendship (long-term, drives sell price,
deluxe odds and faster produce) and happiness (daily, drains by
`HappinessDrain` unless petted, and enters the deluxe formula above only
through the modifier). Petting is a once-per-day state: a `wasPet` flag is
checked before a pet click or a touch registers, and the same `pet` method
is called for an automatic petter object with an `is_auto_pet` argument
(`GameLocation` hit-box tests; the `(BC)272` machine case in `Object`),
so a machine can substitute the daily chore (SHOWN code, INFERRED which
object). Gains per pet and the happiness refill are a gap.

## A5. Pets: a different record with a different loop (SHOWN)

`Data/Pets` has three entries (Cat, Dog, Turtle). Fields: `MoveSpeed` 2 for all,
sleep placement chances checked in order (`SleepOnBedChance`,
`SleepNearBedChance`, `SleepOnRugChance`; cat 0.75/0.3/0.5, dog 0.05/0.3/0.5,
turtle 0/0.3/0.5), else a random empty spot, else beside its bowl (STATED);
`GiftChance` 0.2 per day when petted (all three); `Gifts` list (items with
`MinimumFriendshipThreshold` default 1000 and relative `Weight`), `Behaviors`
(a state machine of named states: cat Walk, sit, blink, lick, Leap, Flop; dog
Walk, Sprint, sit, pant, bark, wag), `Breeds` (cosmetic; 5, 5 and 2),
adoption event id and location (cat and dog; turtle has no adoption event id
here), summit and sound fields.

Gift lists (SHOWN): cat 7 entries, mostly fish drawn from named locations
and random item ranges; dog 10 entries including foraged items, stacked
stones and random ranges; turtle 9 entries (aquatic and cave items).
Entries carry weights (1.0 down to 0.05) and some stack minimums (2-4).
So a pet is a daily weighted gift table gated on friendship, not a production
animal, and each pet kind has a different taste in what it brings.

## A6. Pet bowl and water (SHOWN)

The farm starts with a Pet Bowl building (`Farm.AddDefaultBuilding("Pet Bowl", ...)`,
placed by a map property). `Game1` day-start code sets the bowl's `watered`
flag on every outdoor location where it is raining, the same sweep that
waters crops, so rain fills the bowl for free; otherwise the player waters it
by hand (INFERRED). A pet that ends up stuck in a building tile is warped back
to its bowl (`Farm.cs`), and the bowl tracks an assigned pet (`HasPet`,
`AssignPet`). Effects of an empty bowl on the pet's friendship are a gap.

## Reusable shapes for YAIRPG (proposal, default and dial)

1. Two clocks per animal, maturity and produce interval, as data (A1).
2. A care roll from friendship plus a happiness modifier over a divisor, with
   luck as a dial that matters only for rare producers (A2).
3. Happiness drains daily unless a chore resets it; the chore is automatable (A4).
4. Pets as a weighted daily gift table gated on friendship, with a kind-specific
   taste (A5).
5. A water bowl that rain refills, tying a care chore to weather (A6).

## Gaps

`FarmAnimal.pet`, per-day friendship and happiness gain, feed and hay
consumption, pregnancy and birth timers, quality tier thresholds and the
sleep/outside rules sit in method bodies that are not in the capture;
reading them needs the full decompile of the `Characters` and `Buildings`
namespaces.

# Care-to-craft recipe digest

2026-10-14, installed Steam build 20773316. SHOWN means values in extracted data, not played behavior. Source root: `~/.codex/research/hogwarts-legacy/extract/base/`. Main database: `Phoenix/Content/SQLiteDB/PhoenixShipData.sqlite` (DB below). Names joined to `Phoenix/Content/Localization/WIN64/MAIN-enUS.bin`; descriptions below are paraphrases. Raw tables remain private.

## Stations and finite room resources

SHOWN: `TransfigurationObjects` ties station class, placement category, Moonstone/material inputs and budget cost to an object family. `TransfigurationSlotPools` stores separate instance caps, with expansions in TransfigurationSlotPoolExpansions. A render budget is not the same as Moonstone spent.

| Station family / lookup | Class | Placement inputs |
|---|---|---|
| Beast Feeder / `Biome_BeastFeedingStationLarge` | BiomeAutomation | 8 Moonstone |
| Breeding Pen / `Biome_CreaturePen` | BiomeDen | 15 Moonstone |
| Hog Planter Small1 / `Hog_PlanterSmall1` | SancGameplayTables_Herb | none |
| Chopping Stations / `Sanc_ChoppingStation` | SancChoppingTable | 20 Moonstone |
| Dung Composters / `Sanc_DungComposter` | SancDungComposter | 10 Moonstone |
| Hopping Pot / `Sanc_HoppingPot` | SancHoppingPot | 30 Moonstone |
| Enchanted Loom / `Sanc_Loom` | SancLoom | 8 Moonstone |
| Material Refiner / `Sanc_MaterialRefiner` | SancMatRefiner | 15 Moonstone |
| Table with a Large Pot / `Sanc_PlanterLarge1` | SancGameplayTables_Herb | 10 Moonstone |
| Potting Table with Two Large Pots / `Sanc_PlanterLarge2` | SancGameplayTables_Herb | 30 Moonstone |
| Tables with a Medium Pot / `Sanc_PlanterMedium1` | SancGameplayTables_Herb | 8 Moonstone |
| Potting Table with Two Medium Pots / `Sanc_PlanterMedium2` | SancGameplayTables_Herb | 15 Moonstone |
| Potting Tables with Three Medium Pots / `Sanc_PlanterMedium3` | SancGameplayTables_Herb | 30 Moonstone |
| Potting Table with a Small Pot / `Sanc_PlanterSmall1` | SancGameplayTables_Herb | 2 Moonstone |
| Potting Table with Three Small Pots / `Sanc_PlanterSmall3` | SancGameplayTables_Herb | 8 Moonstone |
| Potting Table with Five Small Pots / `Sanc_PlanterSmall5` | SancGameplayTables_Herb | 20 Moonstone |
| Medium Potions Station / `Sanc_PotionStationMedium` | SancGameplayTables_Pot | 10 Moonstone |
| Small Potions Station / `Sanc_PotionStationSmall` | SancGameplayTables_Pot | 2 Moonstone |
| T-Shaped Potions Station / `Sanc_PotionStationT` | SancGameplayTables_Pot | 20 Moonstone |

| Slot pool | Initial count |
|---|---|
| `BeastFeederSlot` | 1 |
| `ChoppingTableSlot` | 3 |
| `DeskDescriptionSlot` | 1 |
| `DungComposterSlot` | 3 |
| `HoppingPotSlot` | 3 |
| `MatRefinerSlot` | 3 |
| `ToyboxSlot` | 1 |
| `WorkstationSlot_Herb` | 1 |
| `WorkstationSlot_Pot` | 1 |

## Potion recipes

SHOWN: all seven `PotionDefinition` rows. Ingredients and quantities use Ingredient1..6/Quantity1..6, times use TimeToBrewSec, output count uses Yield, unlock uses LockID. Names are localized, including internal AMFillPotion meaning Focus Potion. This is a digest of recipe relationships, not copied descriptions.

| Potion / recipe ID | Inputs | Seconds | Yield | Unlock |
|---|---|---|---|---|
| Focus Potion / `AMFillPotion` | 1 Lacewing Flies, 1 Fluxweed Stem, 1 Dugbog Pellet | 60 | 1 | `Potion_AMFillPotion` |
| Thunderbrew / `AutoDamagePotion` | 1 Leech Juice, 1 Shrivelfig Fruit, 1 Stench Of The Dead | 90 | 1 | `Potion_AutoDamagePotion` |
| Edurus Potion / `Edurus` | 1 Ashwinder Eggs, 1 Mongrel Fur | 30 | 1 | `Potion_Edurus` |
| Felix Felicis / `FelixFelicis` | 1 Lacewing Flies, 1 Fluxweed Stem | 60 | 1 | `Potion_FelixFelicis` |
| Invisibility Potion / `InvisibilityPotion` | 1 Leaping Toadstool Caps, 1 Knotgrass Sprig, 1 Troll Bogeys | 60 | 1 | `Potion_InvisibilityPotion` |
| Maxima Potion / `Maxima` | 1 Leech Juice, 1 Spider Fang | 30 | 1 | `Potion_Maxima` |
| Wiggenweld Potion / `WoundCleaning` | 1 Horklump Juice, 1 Dittany Leaves | 15 | 1 | none |

## Plant production

SHOWN: all eight `PlantDefinition` rows; plot size, unlock, first growth and repeat harvest are independent fields. A table row alone does not prove its recipe is purchasable or planted by the player.

| Plant / ID | Plot | First / repeat sec | Planted / foraged yield | Multiple harvests |
|---|---|---|---|---|
| Chinese Chomping Cabbage / `ChompingCabbage_Plant` | Medium_Plant | 720 / 720 | 1 / 1 | 1 |
| Dittany / `Dittany` | Small_Plant | 600 / 600 | 5 / 1 | 1 |
| Fluxweed / `Fluxweed` | Large_Plant | 900 / 900 | 5 / 1 | 1 |
| Knotgrass / `Knotgrass` | Small_Plant | 600 / 600 | 5 / 1 | 1 |
| Mallowsweet / `Mallowsweet` | Small_Plant | 600 / 600 | 5 / 1 | 1 |
| Mandrake / `Mandrake` | Small_Plant | 600 / 600 | 1 / 1 | 1 |
| Shrivelfig / `Shrivelfig` | Medium_Plant | 720 / 720 | 5 / 1 | 1 |
| Venomous Tentacula / `VenomousTentacula` | Large_Plant | 900 / 900 | 1 / 1 | 1 |

## Creature care and breeding

SHOWN: each of four NV_Biome rows in `NurturingSpaceDefinition` allows 12 creatures and 4 species. Class spaces have their own smaller caps. `NurturingCreatureDynamic` is an empty shipped template with separate fed, interaction, happiness, production-progress, pregnancy, parent and simulation fields. It is not a user save. INFERRED: care, harvest readiness and breeding are separate state, not one affection meter. Exact Boolean combination for production must be read in the consumer.

| Adult / ID | Product | Count | Production sec |
|---|---|---|---|
| Diricawl / `Diricawl` | Diricawl Feather | 3 | 1500.0 |
| Fwooper / `Fwooper` | Fwooper Feather | 3 | 1500.0 |
| Giant Purple Toad / `GiantPurpleToad` | Toad Warts | 3 | 1500.0 |
| Graphorn / `Graphorn` | Graphorn Horn | 3 | 1500.0 |
| Hippogriff / `Hippogriff` | Hippogriff Feather | 3 | 1500.0 |
| Jobberknoll / `Jobberknoll` | Jobberknoll Feather | 5 | 1500.0 |
| Kneazle / `Kneazle` | Kneazle Fur | 3 | 1500.0 |
| Mooncalf / `Mooncalf` | Mooncalf Fur | 5 | 1500.0 |
| Niffler / `Niffler` | Niffler Fur | 3 | 1500.0 |
| Phoenix / `Phoenix` | Phoenix Feather | 3 | 1500.0 |
| Puffskein / `Puffskein` | Puffskein Fur | 3 | 1500.0 |
| Thestral / `Thestral` | Thestral Hair | 3 | 1500.0 |
| Unicorn / `Unicorn` | Unicorn Hair | 3 | 1500.0 |

SHOWN: `CreatureFamilies` supplies adult, offspring and egg relationships. All rows store ChildhoodDurationSecs=-1. Do not report that sentinel as a measured negative duration or universal physical law. Phoenix has no offspring ID in its row; its timer fields alone do not establish a breeding route.

| Adult | Offspring defined | Egg defined | Pregnancy / hatch sec |
|---|---|---|---|
| Diricawl | True | True | 900 / 900 |
| Fwooper | True | True | 900 / 900 |
| Giant Purple Toad | True | True | 900 / 900 |
| Graphorn | True | False | 1800 / 0 |
| Hippogriff | True | True | 900 / 900 |
| Jobberknoll | True | True | 900 / 900 |
| Kneazle | True | False | 1800 / 0 |
| Mooncalf | True | False | 1800 / 0 |
| Niffler | True | True | 900 / 900 |
| Phoenix | False | False | 900 / 900 |
| Puffskein | True | False | 1800 / 0 |
| Thestral | True | False | 1800 / 0 |
| Unicorn | True | False | 1800 / 0 |

## Exact trait recipes

SHOWN: all 75 `GearTraitRecipeDefinition` rows are 25 families at three ranks. Inputs below preserve every populated Component1..6/Quantity1..6 pair; unlocking uses LockID and is separate from owning the material. These are gear traits, not new spells.

| Trait / recipe ID | Exact inputs | Unlock |
|---|---|---|
| Protego Shielding I / `Gear_Armor_DarkWizard_1` | 1 Puffskein Fur | `GearTrait_Armor_DarkWizard_1` |
| Protego Shielding II / `Gear_Armor_DarkWizard_2` | 1 Diricawl Feather | `GearTrait_Armor_DarkWizard_2` |
| Protego Shielding III / `Gear_Armor_DarkWizard_3` | 1 Kneazle Fur | `GearTrait_Armor_DarkWizard_3` |
| Amphibial Protection I / `Gear_Armor_Dugbog_1` | 1 Puffskein Fur | `GearTrait_Armor_Dugbog_1` |
| Amphibial Protection II / `Gear_Armor_Dugbog_2` | 1 Diricawl Feather | `GearTrait_Armor_Dugbog_2` |
| Amphibial Protection III / `Gear_Armor_Dugbog_3` | 1 Kneazle Fur | `GearTrait_Armor_Dugbog_3` |
| Goblin-Silver Resistance I / `Gear_Armor_Goblin_1` | 1 Puffskein Fur | `GearTrait_Armor_Goblin_1` |
| Goblin-Silver Resistance II / `Gear_Armor_Goblin_2` | 1 Diricawl Feather | `GearTrait_Armor_Goblin_2` |
| Goblin-Silver Resistance III / `Gear_Armor_Goblin_3` | 1 Kneazle Fur | `GearTrait_Armor_Goblin_3` |
| Necromantic Protection I / `Gear_Armor_Inferi_1` | 1 Puffskein Fur | `GearTrait_Armor_Inferi_1` |
| Necromantic Protection II / `Gear_Armor_Inferi_2` | 1 Diricawl Feather | `GearTrait_Armor_Inferi_2` |
| Necromantic Protection III / `Gear_Armor_Inferi_3` | 1 Kneazle Fur | `GearTrait_Armor_Inferi_3` |
| Anti-Venom I / `Gear_Armor_Spider_1` | 1 Puffskein Fur | `GearTrait_Armor_Spider_1` |
| Anti-Venom II / `Gear_Armor_Spider_2` | 1 Diricawl Feather | `GearTrait_Armor_Spider_2` |
| Anti-Venom III / `Gear_Armor_Spider_3` | 1 Kneazle Fur | `GearTrait_Armor_Spider_3` |
| Cushioning I / `Gear_Armor_Troll_1` | 1 Puffskein Fur | `GearTrait_Armor_Troll_1` |
| Cushioning II / `Gear_Armor_Troll_2` | 1 Diricawl Feather | `GearTrait_Armor_Troll_2` |
| Cushioning III / `Gear_Armor_Troll_3` | 1 Kneazle Fur | `GearTrait_Armor_Troll_3` |
| Lupus Protection I / `Gear_Armor_Wolf_1` | 1 Puffskein Fur | `GearTrait_Armor_Wolf_1` |
| Lupus Protection II / `Gear_Armor_Wolf_2` | 1 Diricawl Feather | `GearTrait_Armor_Wolf_2` |
| Lupus Protection III / `Gear_Armor_Wolf_3` | 1 Kneazle Fur | `GearTrait_Armor_Wolf_3` |
| Unforgivable I / `Gear_Dark_SpellDamage_1` | 1 Puffskein Fur | `GearTrait_Dark_SpellDamage_1` |
| Unforgivable II / `Gear_Dark_SpellDamage_2` | 1 Diricawl Feather | `GearTrait_Dark_SpellDamage_2` |
| Unforgivable III / `Gear_Dark_SpellDamage_3` | 1 Kneazle Fur | `GearTrait_Dark_SpellDamage_3` |
| Concentration I / `Gear_GenDam_HeavySpell_1` | 1 Puffskein Fur | `GearTrait_GenDam_HeavySpell_1` |
| Concentration II / `Gear_GenDam_HeavySpell_2` | 1 Diricawl Feather | `GearTrait_GenDam_HeavySpell_2` |
| Concentration III / `Gear_GenDam_HeavySpell_3` | 1 Kneazle Fur | `GearTrait_GenDam_HeavySpell_3` |
| Ambush I / `Gear_GenDam_StealthSurprise_1` | 1 Puffskein Fur | `GearTrait_GenDam_StealthSurprise_1` |
| Ambush II / `Gear_GenDam_StealthSurprise_2` | 1 Diricawl Feather | `GearTrait_GenDam_StealthSurprise_2` |
| Ambush III / `Gear_GenDam_StealthSurprise_3` | 1 Kneazle Fur | `GearTrait_GenDam_StealthSurprise_3` |
| Ancient Magic Focus I / `Gear_Generic_FocusModifier_1` | 1 Puffskein Fur | `GearTrait_Generic_FocusModifier_1` |
| Ancient Magic Focus II / `Gear_Generic_FocusModifier_2` | 1 Diricawl Feather | `GearTrait_Generic_FocusModifier_2` |
| Ancient Magic Focus III / `Gear_Generic_FocusModifier_3` | 1 Kneazle Fur | `GearTrait_Generic_FocusModifier_3` |
| Fangs I / `Gear_Herb_CabbageDamage_1` | 1 Puffskein Fur | `GearTrait_Herb_CabbageDamage_1` |
| Fangs II / `Gear_Herb_CabbageDamage_2` | 1 Diricawl Feather | `GearTrait_Herb_CabbageDamage_2` |
| Fangs III / `Gear_Herb_CabbageDamage_3` | 1 Kneazle Fur | `GearTrait_Herb_CabbageDamage_3` |
| Herbology I / `Gear_Herb_PlantDamage_1` | 1 Puffskein Fur | `GearTrait_Herb_PlantDamage_1` |
| Herbology II / `Gear_Herb_PlantDamage_2` | 1 Diricawl Feather | `GearTrait_Herb_PlantDamage_2` |
| Herbology III / `Gear_Herb_PlantDamage_3` | 1 Kneazle Fur | `GearTrait_Herb_PlantDamage_3` |
| Venom I / `Gear_Herb_VenomousDamage_1` | 1 Puffskein Fur | `GearTrait_Herb_VenomousDamage_1` |
| Venom II / `Gear_Herb_VenomousDamage_2` | 1 Diricawl Feather | `GearTrait_Herb_VenomousDamage_2` |
| Venom III / `Gear_Herb_VenomousDamage_3` | 1 Kneazle Fur | `GearTrait_Herb_VenomousDamage_3` |
| Ancient Magic I / `Gear_Hero_AncientDamage_1` | 1 Puffskein Fur | `GearTrait_Hero_AncientDamage_1` |
| Ancient Magic II / `Gear_Hero_AncientDamage_2` | 1 Diricawl Feather | `GearTrait_Hero_AncientDamage_2` |
| Ancient Magic III / `Gear_Hero_AncientDamage_3` | 1 Kneazle Fur | `GearTrait_Hero_AncientDamage_3` |
| Explosive I / `Gear_SpecDam_Bombarda_1` | 1 Puffskein Fur | `GearTrait_SpecDam_Bombarda_1` |
| Explosive II / `Gear_SpecDam_Bombarda_2` | 1 Diricawl Feather | `GearTrait_SpecDam_Bombarda_2` |
| Explosive III / `Gear_SpecDam_Bombarda_3` | 1 Kneazle Fur | `GearTrait_SpecDam_Bombarda_3` |
| Destruction I / `Gear_SpecDam_Confringo_1` | 1 Puffskein Fur | `GearTrait_SpecDam_Confringo_1` |
| Destruction II / `Gear_SpecDam_Confringo_2` | 1 Diricawl Feather | `GearTrait_SpecDam_Confringo_2` |
| Destruction III / `Gear_SpecDam_Confringo_3` | 1 Kneazle Fur | `GearTrait_SpecDam_Confringo_3` |
| Cruelty I / `Gear_SpecDam_Crucio_1` | 1 Puffskein Fur | `GearTrait_SpecDam_Crucio_1` |
| Cruelty II / `Gear_SpecDam_Crucio_2` | 1 Diricawl Feather | `GearTrait_SpecDam_Crucio_2` |
| Cruelty III / `Gear_SpecDam_Crucio_3` | 1 Kneazle Fur | `GearTrait_SpecDam_Crucio_3` |
| Laceration I / `Gear_SpecDam_Diffindo_1` | 1 Puffskein Fur | `GearTrait_SpecDam_Diffindo_1` |
| Laceration II / `Gear_SpecDam_Diffindo_2` | 1 Diricawl Feather | `GearTrait_SpecDam_Diffindo_2` |
| Laceration III / `Gear_SpecDam_Diffindo_3` | 1 Kneazle Fur | `GearTrait_SpecDam_Diffindo_3` |
| Disarming I / `Gear_SpecDam_Expelliarmus_1` | 1 Puffskein Fur | `GearTrait_SpecDam_Expelliarmus_1` |
| Disarming II / `Gear_SpecDam_Expelliarmus_2` | 1 Diricawl Feather | `GearTrait_SpecDam_Expelliarmus_2` |
| Disarming III / `Gear_SpecDam_Expelliarmus_3` | 1 Kneazle Fur | `GearTrait_SpecDam_Expelliarmus_3` |
| Manipulation I / `Gear_SpecDam_Imperio_1` | 1 Puffskein Fur | `GearTrait_SpecDam_Imperio_1` |
| Manipulation II / `Gear_SpecDam_Imperio_2` | 1 Diricawl Feather | `GearTrait_SpecDam_Imperio_2` |
| Manipulation III / `Gear_SpecDam_Imperio_3` | 1 Kneazle Fur | `GearTrait_SpecDam_Imperio_3` |
| Scorching I / `Gear_SpecDam_Incendio_1` | 1 Puffskein Fur | `GearTrait_SpecDam_Incendio_1` |
| Scorching II / `Gear_SpecDam_Incendio_2` | 1 Diricawl Feather | `GearTrait_SpecDam_Incendio_2` |
| Scorching III / `Gear_SpecDam_Incendio_3` | 1 Kneazle Fur | `GearTrait_SpecDam_Incendio_3` |
| Deafening I / `Gear_SpecDam_Mandrake_1` | 1 Puffskein Fur | `GearTrait_SpecDam_Mandrake_1` |
| Deafening II / `Gear_SpecDam_Mandrake_2` | 1 Diricawl Feather | `GearTrait_SpecDam_Mandrake_2` |
| Deafening III / `Gear_SpecDam_Mandrake_3` | 1 Kneazle Fur | `GearTrait_SpecDam_Mandrake_3` |
| Control I / `Gear_SpecDam_Oppugno_1` | 1 Puffskein Fur | `GearTrait_SpecDam_Oppugno_1` |
| Control II / `Gear_SpecDam_Oppugno_2` | 1 Diricawl Feather | `GearTrait_SpecDam_Oppugno_2` |
| Control III / `Gear_SpecDam_Oppugno_3` | 1 Kneazle Fur | `GearTrait_SpecDam_Oppugno_3` |
| Binding I / `Gear_SpecDam_StealthTakedown_1` | 1 Puffskein Fur | `GearTrait_SpecDam_StealthTakedown_1` |
| Binding II / `Gear_SpecDam_StealthTakedown_2` | 1 Diricawl Feather | `GearTrait_SpecDam_StealthTakedown_2` |
| Binding III / `Gear_SpecDam_StealthTakedown_3` | 1 Kneazle Fur | `GearTrait_SpecDam_StealthTakedown_3` |

## Exact loom stat-upgrade costs

SHOWN: all 38 `GearStatUpgrade` rows, grouped by rarity, stat and upgrade. This is separate from trait application.

| Rarity | Stat | Upgrade | Inputs |
|---|---|---|---|
| Epic | 0 | 1 | 2 Jobberknoll Feather |
| Epic | 0 | 2 | 2 Jobberknoll Feather, 1 Niffler Fur |
| Epic | 0 | 3 | 2 Jobberknoll Feather, 1 Niffler Fur, 1 Toad Warts |
| Epic | 1 | 1 | 2 Mooncalf Fur |
| Epic | 1 | 2 | 1 Fwooper Feather, 2 Mooncalf Fur |
| Epic | 1 | 3 | 1 Fwooper Feather, 2 Mooncalf Fur, 1 Thestral Hair |
| Legendary | 0 | 1 | 3 Jobberknoll Feather |
| Legendary | 0 | 2 | 3 Jobberknoll Feather, 1 Niffler Fur, 1 Toad Warts |
| Legendary | 0 | 3 | 1 Graphorn Horn, 1 Hippogriff Feather, 3 Jobberknoll Feather, 1 Niffler Fur, 1 Toad Warts |
| Legendary | 1 | 1 | 3 Mooncalf Fur |
| Legendary | 1 | 2 | 1 Fwooper Feather, 3 Mooncalf Fur, 1 Thestral Hair |
| Legendary | 1 | 3 | 1 Fwooper Feather, 3 Mooncalf Fur, 1 Phoenix Feather, 1 Thestral Hair, 1 Unicorn Hair |
| Rare | 0 | 1 | 1 Jobberknoll Feather |
| Rare | 0 | 2 | 2 Jobberknoll Feather |
| Rare | 0 | 3 | 1 Diricawl Feather, 2 Jobberknoll Feather |
| Rare | 1 | 1 | 1 Mooncalf Fur |
| Rare | 1 | 2 | 2 Mooncalf Fur |
| Rare | 1 | 3 | 1 Fwooper Feather, 2 Mooncalf Fur |

SHOWN: `SanctuaryItemGeneratorData.GenerationTimeSec` adds four timed support stations, independent of potion/plant recipes.

| Generator | Seconds | Loot category |
|---|---|---|
| `Sanc_ChoppingStation` | 540 | `SANCT_ChoppingStation` |
| `Sanc_DungComposter` | 240 | `SANCT_DungComposter` |
| `Sanc_HoppingPot` | 720 | `SANCT_HoppingPot` |
| `Sanc_MaterialRefiner` | 600 | `SANCT_MaterialRefiner` |

Open: runtime wall-clock versus game-clock treatment of unloading/offline time; station consumer caps after expansion; whether fed and interaction flags are both consumed on harvest. No timer was observed in play. Native inspection is conditional on the Blueprint pass locating a native-only gap.

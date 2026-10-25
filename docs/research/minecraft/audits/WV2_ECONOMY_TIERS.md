# Economy deep dive: one value scale (ProjectE) versus a growth tier ladder (Mystical Agriculture, Additions) (2026-10-23)

Research and proposals only. Nothing here is an accepted decision, and no code was built or run. Source is static reading of three shallow clones (gitignored) under `docs/research/minecraft/private/search-2026-10-23/`, all MIT (license files read). Each finding names a mechanism to re-implement, not code to copy. Format follows [GT_GREGTECH_DEEP_DIVE](GT_GREGTECH_DEEP_DIVE.md) and [TB_MEKANISM_AE2_IE_THERMAL](TB_MEKANISM_AE2_IE_THERMAL.md).

**Versions read, as the files state them.**

| Mod | Commit | Version in gradle files | Minecraft in gradle files |
|---|---|---|---|
| ProjectE | f432b0c6 | `projecte_version=1.1.0` | `minecraft_version=1.21.1` (NeoForge 21.1.148) |
| Mystical Agriculture | 3478be19 | `version = '26.1.2-9.0.11'` (build.gradle) | `minecraft_version=26.1.2` |
| Mystical Agradditions | 87025e1c | `version = '26.1.2-9.0.4'` (build.gradle) | `minecraft_version=26.1.2` |

ProjectE and the Mystical pair are on different Minecraft versions. Numbers below are from those trees only.

Labels: **shown** = read in source or data (class#method or file), **stated** = author text (config comments, changelog, javadoc), **inferred** = my arithmetic or reading. Paths: `PE` = `projecte/src/src/main/java/moze_intel/projecte/`, `PEdata` = `projecte/src/src/datagen/`, `MA` = `mysticalagriculture/src/src/main/java/com/blakebr0/mysticalagriculture/`, `MAdata` = `mysticalagriculture/src/src/main/resources/data/mysticalagriculture/`, `AD` = `mysticalagradditions/src/src/main/`.

Design framing follows AGENTS.md: each donor question is default, dial, reason (the in-world cost). Idea tables are palettes, not specs. **No Minecraft economy lane exists in `audits/`** (checked: DC, EP, GL, GT, MR, SR, SYNTHESIS, TA, TB, WC only), so this file links the repo's own economy owners instead: [ECONOMY_CORE_AUDIT](../../../audits/ECONOMY_CORE_AUDIT.md), [economy rules ECR1-ECR33](../../../DOMAIN_RULES.md#economy-rules), [ECONOMY_AND_TRADE_CONSIDERATIONS](../../../ECONOMY_AND_TRADE_CONSIDERATIONS_2026-10-18.md), [TECHNOLOGY_AND_PROGRESSION](../../../TECHNOLOGY_AND_PROGRESSION.md) (TE1-TE8, CT1-CT5), [MAKING_RULES](../../../MAKING_RULES.md) (MR21-MR28), [ABUSE_AND_LIMITS](../../../ABUSE_AND_LIMITS.md).

## Top findings

1. **ET1** ProjectE's value of a thing is the minimum cost over every recipe that makes it, solved from a small hand-pinned seed table (about 280 entries) by repeated relaxation, not a price list.
2. **ET2** Rounding makes recombination lose value: division floors at every step once a value reaches 1, so a split-and-recombine loop cannot mint value in the cases the unit tests cover. This is the quiet anti-exploit rule, and it is arithmetic, not a check.
3. **ET3** Its explicit loophole branch zeroes an item only if the item is not pinned; pinned items just log a warning. Most dupe fixes in the changelog were implementation bugs, not pricing.
4. **ET4** Buy and sell are the same number by default (`covalenceLoss` 1.0, range 0.1 to 1.0), the opposite of this repo's asymmetric default (ECR8). The dial exists.
5. **ET5** Income is EMC per second from sunlight (collectors 4/12/40) plus relay bonuses; relays do not chain to relays, so "chains" are buffers, not daisy chains.
6. **ET6** Mystical Agriculture prices its goods on a 4-to-1 essence ladder (tier N+1 = 4 of tier N plus a reusable crystal), and a hand-written table converts essence to vanilla goods (iron 8 essence for 6 ingots, diamond 9 for 1).
7. **ET7** Those hand-set essence prices disagree with ProjectE's EMC for the same goods by 3x to 48x, so two "fair" price systems for one game do not sit on a line.
8. **ET8** Farmland tier changes yield, not whether a crop grows (growth gating is off by default); inferium yield is exactly `0.5 x tier + 0.5` expected per harvest.
9. **ET9** Growth accelerators scale reach, not speed (inferred from one tick per cooldown on the first plant in a column); fertilizer is an instant-ripen sink that cannot sustain itself.
10. **ET10** Additions' tier 6 closes the loop: a keystone block two below the crop, no secondary drops, no fertilizer by default, and a payback measured in dozens of harvests per crafted star.

## Part A. ProjectE: one value scale

**ET1 (shown, `PE emc/SimpleGraphMapper#generateValues`, `emc/EMCMappingHandler#map`, `emc/mappers/recipe/CraftingMapper`).**
Mappers feed a graph: nodes are items, tags, fluids and fake nodes; edges are conversions "N of output from a bag of ingredients". Seeds are `setValueBefore` pins. The solver loops: when an item gets a value, every conversion that uses it is recomputed as `(sum of ingredient values x counts) / outputCount`, and the output keeps the smaller of its stored and new value. After the queue empties it re-scans all conversions for exploits (ET3), then loops again until nothing changes. A conversion needing an ingredient with no value yields nothing, so values appear only where a path from seeds exists. Cycles resolve harmlessly (the unit tests `testGenerateValuesCycleRecipe` and `testGenerateValuesBigCycleRecipe` give every member of a cycle the seed's value).
- Recipe sources: every recipe type in the registry that a recipe-type mapper accepts (crafting, smelting, smithing and so on, `CraftingMapper#addMappings` logs handled and unhandled counts per type), plus a brewing mapper (3 inputs + reagent = 3 outputs), an oxidization mapper (each copper stage maps to the other at 1:1, both ways, because scraping reverses it), waxing, a tag mapper registered last, and a JSON custom-conversion mapper.
- **Alternatives take the cheapest member (shown, `CraftingMapper$NSSFakeGroupManager`).** An ingredient that accepts several items becomes a fake node with one conversion from each member; the graph's minimum rule then prices the slot at the cheapest allowed item.
- Port: derive a suggested price for every recipe-made good from its cheapest recipe at design time, from a few pinned anchors. Do not port the run-time requirement that all value comes this way.
- Donor question (YAIRPG): default: prices are authored per world basket (ECR6), with the recipe graph as a designer's starting point and sanity check only. Dial: a world whose law is equivalence (alchemy, a System shop, a guild ledger) uses the derived value as its actual yardstick. Reason/cost: the yardstick is a thing someone issues (ECR12, ECR13), so using it costs a fee or a visit, and it stops at the world's border.

**ET2 (shown, `PE emc/arithmetic/HiddenBigFractionArithmetic#div`, `emc/generator/BigFractionToLongGenerator#generateValues`; test `HiddenFractionSpecificTest#nuggetExploits`).**
Values are exact fractions internally. After each division: if the result is at least 1, the fraction is dropped (floor); if it is below 1 it is kept as a fraction. The final conversion to a long drops anything below 1. In the unit test, ingot = 2048 and nugget (9 per ingot) = 227, not 227.55, so nine nuggets are worth 2043, less than the ingot. Intermediate steps never round up, so a loop of "split, then recombine" cannot gain.
- Port: floor division at each derivation step is a free, structural loss on any split-and-recombine chain.
- Donor question: default: splitting a good into parts and re-forming it returns slightly less than it cost, by rounding rather than by a tax. Dial: coarser or finer units per world. Reason/cost: smaller units lose proportionally more, which is why fine-grained work is priced by skill, not by loops.

**ET3 (shown, `SimpleGraphMapper#generateValues` second loop and `canOverrideZero`; stated, Changelog.txt).**
The exploit branch: if a conversion's ingredients cost less than the output's current value (`isLessThan(resultValueConversion, resultValueActual)`), and the output is not pinned (`fixValueBeforeInherit` null or zero), the output is set to 0, which removes its value and, on the next pass, everything priced from it. If the output is pinned, the code only logs "EMC Exploit". A second rule zeroes any item whose every conversion is dead ("all conversions dead"). `fixValueAfterInherit` entries are applied after the loop and do not propagate. A config flag logs found exploits (Changelog.txt line 198, "Config option to log possible EMC exploits"). Raw ore and ore tags are pinned to 0 before and after (`OreBlacklistMapper`, `RawMaterialsBlacklistMapper`), so ore-to-ingot smelting cannot price an ingot.
- Changelog lines about dupes (Condenser, Klein Star, Gem of Eternal Density, transmutation GUI, End bug duplicate knowledge) are mostly container and mod-interaction bugs, not value-table loops (stated; I did not read each fix).
- Design caution: this is out-of-fiction hardening. AD22, ECR30 and ABUSE_AND_LIMITS Part 3 point the other way for a solo player.
- Donor question: default: a value table that would produce profit from a loop is reported to the designer, and the loop stays if it is a payoff. Dial: a world with an equivalence law zeroes the value, or keeps it and lets an in-world agent respond. Reason/cost: the pushback comes from a character or institution that notices (an auditor, a guild, the law of the world), with a consequence, not from a silent zero.

**ET4 (shown, `PEdata common/PECustomConversionProvider`, generated `pe_custom_conversions/defaults.json` and `metals.json`).**
The pinned seed table (v1.1.0 data, EMC):

| Group | Values |
|---|---|
| Bulk terrain and plants | cobblestone, dirt, sand, netherrack, end stone, snow, ice, short and tall grass, kelp, leaves, snowball: 1. planks 8, logs 32, saplings 32, stick 4. gravel, flint 4. cactus, vine 8. small flowers 16, tall flowers 32 |
| Food and farm | wheat seeds, beetroot seeds, melon slice, berries 16. wheat, nether wart 24. apple 128. pumpkin 144. meat and fish 64 each. honey bottle 48 |
| Mob drops | string 12. rotten flesh, slime ball, egg 32. feather 48. bone 144. spider eye 128. phantom membrane, gunpowder 192. rabbit foot 128. ender pearl 1,024. blaze rod 1,536. breeze rod 2,304. shulker shell 2,048. ghast tear 4,096. skulls 256. trident 16,398 |
| Ores and minerals | redstone 64. coal 128. quartz 256. lapis 864. glowstone dust 384. iron ingot 256. diamond 8,192. emerald 16,384. netherite scrap 12,288. nether star 139,264. heart of the sea 32,768. dragon egg 262,144. obsidian 64, crying obsidian 768 |
| Rare finds | music discs 192 to 40,960 by rarity. smithing templates 7,497 to 57,345 ("based on fractional amounts of the duplication recipe cost and how rare the trim is", stated in a code comment). heavy core 40,960. sculk catalyst 8,040 |

Derived anchors in `metals.json`: copper = iron / 2 (128), tin = iron (256), bronze = (3 copper + 1 tin) / 4 (160), gold = 8 iron (2,048), silver, lead, osmium = 2 iron (512), nickel = 4 iron (1,024), aluminum = iron / 2, platinum = 16 iron (4,096), uranium pinned 4,096, cyanite = uranium / 4. Mod metals are tied to iron by tag, so a new mod's ingot gets a value without an entry (`propagateTags`).
- Shape of the table: values roughly track "how many minutes of normal play it costs", not a formula. Many entries are plain judgment (48 for a feather, 192 for gunpowder). The recipe graph then prices everything else.
- Donor question: default: a world pins a few dozen anchors (a day's wage, a loaf, a tool, one rare drop, one legendary) and lets the recipe graph propose the rest. Dial: how many anchors, and whether mod-style materials inherit from an anchor by category. Reason/cost: an anchor is a statement about the world ("iron is common here"), which is the in-world reason prices differ elsewhere.

**ET5 (shown, `PE config/ServerConfig$Difficulty`, `utils/EMCHelper#getEmcSellValue`, `gameObjs/block_entities/CondenserBlockEntity#condense`, `RelayMK1BlockEntity#tickServer`).**
`covalenceLoss` is a double in 0.1 to 1.0, default 1.0, and sale value is `floor(value x covalenceLoss)`, rounded up to 1 if `covalenceLossRounding` (default true). Condensers and relays take items in at the sell value and condensers pay out at the full value. At 1.0, the cycle is exactly neutral (modulo ET2 rounding). At 0.1, it loses up to 90% per pass.
- This is the cleanest contrast with this repo: ECR8 keeps buying and selling asymmetric by default so money does not replace making. ProjectE ships symmetric and lets the server owner add the asymmetry.
- Donor question: default: asymmetric, per ECR8. Dial: a world's exchange spread (0 to 90% here), per merchant or changer (ECR6 says rates belong to the changer with a spread). Reason/cost: the spread is the changer's living, so a world of free conversion has a very kind changer or none.

**ET6 (shown, `PE gameObjs/block_entities/CollectorMK1BlockEntity#updateEmc`, `gameObjs/EnumCollectorTier`, `EnumRelayTier`, `EmcBlockEntity#sendToAllAcceptors`, `RelayMK*#getBonusToAdd`; arithmetic inferred).**
Collectors add `genRate x sunLevel / 320` every tick, where sunLevel is block light + 1 capped at 16 (the Nether, `ultraWarm`, counts as 16). At full light that is `genRate / 20` per tick, so genRate is EMC per second: MK1 4, MK2 12, MK3 40; stores 10,000 / 30,000 / 60,000. Relay stores 100,000 / 1,000,000 / 10,000,000 with a per-tick transfer limit 64 / 192 / 640. Each tick a collector is sending, every adjacent relay gains a fractional bonus: 0.05 / 0.15 / 0.5 EMC (1 / 3 / 10 per second per adjacent collector). In `sendToAllAcceptors`, a relay does not pair with another relay (comment: "to prevent thrashing"), so a chain of relays does not pass EMC along. At 4 EMC/s one MK1 produces an iron ingot's value (256) in 64 seconds and a diamond (8,192) in about 34 minutes (inferred); an MK3 does the diamond in about 205 seconds.
- Collectors can instead upgrade fuel items: `FuelMapper` sorts the `collector_fuel` tag by EMC, and a collector upgrades an item to the next fuel for the value difference (`upgradeCost = value(result) - value(input)`).
- Port: income is a small, sun-scaled flow per producer, buffered locally, with a flat bonus for adjacency. Big outputs are a matter of how many producers you built, not a rate you can speed up by other means.
- Donor question: default: passive income per producer is slow and tied to a world condition (light, tide, season). Dial: producer tier (here 10x between MK1 and MK3), buffer size, adjacency bonus. Reason/cost: the producer is a build with a footprint that something can disturb (shade, weather, a raid).

**ET7 (shown, `PE gameObjs/block_entities/CondenserBlockEntity`, `CondenserMK2BlockEntity#condense`).**
A condenser locks to one target item. It accepts any item with a value, adds its sell value to a store, and when the store holds at least the target's value, it pays out one target (MK1: one per tick, 91 input slots; MK2: repeats while there is space, whole stacks per tick, 42 input and 42 output slots). When the target's value changes after a reload, `loadIndex` forces a recheck. Changelog lines for "Energy condensers duping items infinitely after user EMC value change" and "A dupe bug with the Condenser" show where this was fragile (stated).
- Port: a converter that turns any pile of value into one chosen good at that good's price is a single rule, not a recipe list. It reads as a market with one merchant and no stock limit.
- Donor question: default: a convertor needs an input the target is made of (a mechanism), not any valued item (AD38). Dial: how general the convertor is. Reason/cost: the more general the machine, the rarer its parts and the more it costs to run.

**ET8 (shown, `PE impl/capability/KnowledgeImpl`, `gameObjs/container/inventory/TransmutationInventory#handleKnowledge`, `gameObjs/container/slots/transmutation/SlotConsume`; sell value on burn inferred).**
Player EMC is a `BigInteger` pool (no cap). Learning happens by placing one sample item in the table: `handleKnowledge` adds its "persistent info" (the item without incidental data) to a set, once. From then on any amount of that item can be made from pool EMC at the item's value. A Tome of Knowledge sets `fullKnowledge`, after which every valued item is known. Stored-EMC data, durability and enchantments are handled by "data component processors" (priority on `DamageProcessor`: value x remaining durability / max durability; `EnchantmentProcessor`: +5,000 / rarity weight per level, off by default). The learning gate is "have you ever held one", not a recipe.
- Port: knowledge unlocks items one at a time by consuming a single sample; the pool is shared and typed as plain value.
- Donor question: default: a character learns to make a thing by studying a sample and keeps what they learned across the world (MR22 says repeats teach nothing new; this is one sample, one lesson). Dial: whether the lesson survives a death or a rebirth (ECR27, carriers). Reason/cost: the sample is lost, and the lesson sits in the person or a book, so it can be stolen or forgotten.

**ET9 (stated, Changelog.txt; shown, `PE emc/FuelMapper`, `emc/mappers/CustomEMCMapper`).**
Custom values and conversions are data (JSON `pe_custom_conversions`, a `custom_emc` config), so a modpack author re-balances without code. The mod ships a spreadsheet link in a comment for smithing trims and a TODO ("figure out how we actually calculated the above ones in terms of an equation"), so even the author lost the formula for some pinned numbers.
- Port: keep anchors as data with a one-line reason field.

## Part B. Mystical Agriculture: a tier ladder of grown goods

**ET10 (shown, `MA api/crop/CropTier`, `lib/ModCorePlugin`, `lib/ModCrops`; counts inferred by tallying `new Crop(` lines).**
Tiers: Elemental and 1 (value 1, inferium), 2 prudentium, 3 tertium, 4 imperium, 5 supremium. A tier carries a color, a farmland block, an essence item, a fertilizable flag, a secondary-seed flag and a base secondary chance (default 0.1). 136 crop definitions in `ModCrops` (many are mod-gated compat entries): Elemental 4, tier 1: 6, tier 2: 28, tier 3: 37, tier 4: 40, tier 5: 21. Examples: tier 1 stone, dirt, wood, ice, deepslate; tier 2 coal, honey, amethyst, farm animals; tier 3 iron, copper, quartz, redstone, obsidian, zombie; tier 4 gold, lapis, end, experience, blaze, ghast, enderman; tier 5 diamond, emerald, netherite, wither skeleton. Mob crops use soul jars; resource crops use a material.
- Donor question: default: a grown or found resource sits on a rung chosen by how hard its real counterpart is to get. Dial: rung count (5 here, 6 with Additions) and the width of each rung. Reason/cost: the rung is the world's statement of rarity, and each rung up needs the previous rung's output in bulk.

**ET11 (shown, `MAdata recipe/{prudentium,tertium,imperium,supremium}_essence.json`, `*_essence_uncraft.json`, `infusion_crystal.json`, `ModConfigs.INFUSION_CRYSTAL_USES`; crystal wear inferred).**
Tier N+1 essence is shaped `#/#X#/#`: four tier-N essence around one infusion crystal. The uncraft recipe gives four back. So one essence is worth 4^(tier-1) inferium: prudentium 4, tertium 16, imperium 64, supremium 256, and Additions' insanium 1,024 (`AD recipe/insanium_essence.json`, four supremium + crystal). The crystal is a durable (config `infusionCrystalUses` default 1000) made of 4 prosperity shards, 4 inferium essence and a diamond. Prosperity shards come from prosperity ore (world generation). Growth accelerators, farmland, gemstones, ingots and armor reuse the same essence of each tier.
- Port: a currency family where one coin of rank N+1 is exactly four of rank N, convertible both ways without loss. Rank prices are an arithmetic series in the exponent, so tier 5 vs tier 1 is 256:1.
- Donor question: default: ranked goods trade at a fixed integer ratio and can be broken back down. Dial: ratio (4 here), loss on breaking down (none here). Reason/cost: the catalyst (crystal) is a durable you must own and keep from wearing out; its source is found, not grown.

**ET12 (shown, `MA crafting/DynamicRecipeManager#makeSeedRecipe`, `#makeReprocessorRecipe`, `lib/ModCorePlugin` lines for `CropType.RESOURCE/MOB`, `MAdata recipe/prosperity_seed_base.json`).**
A crop's seed is made at the infusion altar (input = type base seed, plus 8 pedestal ingredients alternating material, tier essence: 4 material + 4 tier essence). An optional vanilla crafting recipe has the same ingredients, but `seedCraftingRecipes` defaults to false. The base seed for resource crops is a prosperity seed base (4 prosperity shards and one wheat seed, shaped `#/#X#/#`); mob crops use a soulium seed base. The altar recipe takes 100 ticks (`InfusionAltarTileEntity#tick`: `progress++` per tick, completes at 100). The seed reprocessor turns any seed into 2 of its crop's essence (recipe built for every crop).
- Gate: you need the tier's essence in bulk, so the tier below must already be farmed; and 4 units of the real material, so you need the real thing once.
- Port: a "seed" is a one-time capital cost paid in the real good and in tier essence; the seed is not consumed by harvest (ET14), and can be reversed for 2 essence.
- Donor question: default: planting a high-tier resource needs a stake of the real resource plus lower-tier produce. Dial: stake size (4 and 4 here), reversibility (2 essence back). Reason/cost: the stake is held up for the whole life of the plot and can be lost to a raid or a blight.

**ET13 (shown, `MAdata recipe/essence/minecraft/*.json`; arithmetic inferred).**
Essence converts back to vanilla goods by hand-written shaped recipes, one per item, and the essence counts are the economy's prices. A representative table (E = the crop's own essence, shape count read from the pattern):

| Good | Essence in | Out | Tier of crop | Inferium-equivalent per item |
|---|---|---|---|---|
| cobblestone | 8 (stone) | 24 | 1 | 0.33 |
| coal | 8 | 12 | 2 | 2.7 |
| redstone | 8 | 12 | 3 | 10.7 |
| iron or copper ingot | 8 | 6 | 3 | 21.3 |
| lapis | 8 | 12 | 4 | 42.7 |
| ender pearl (enderman essence) | 8 | 4 | 4 | 128 |
| gold ingot | 8 | 4 | 4 | 128 |
| ghast tear | 8 | 2 | 4 | 256 |
| netherite ingot | 8 | 1 | 5 | 2,048 |
| diamond or emerald | 9 | 1 | 5 | 2,304 |

Other examples: nether star = 27 essence (Additions: 9 essence per shard, 3 shards per star); dragon egg the same. The cost per item is set by hand per item, and it also sets a per-harvest value: a crop that yields 1 essence per harvest yields about 1/9 diamond.
- Donor question: default: converting grown stock into finished goods is a per-good table, set by the designer's sense of rarity. Dial: how steep the table is. Reason/cost: the table is the exchange rate of the "magic farm" against ordinary trade, so a world can make it generous (a blessing) or stingy (a tax).

**ET14 (shown, `MA block/MysticalCropBlock#getDrops`, `api/crop/Crop#getSecondaryChance`, `config/ModConfigs`).**
At full age: 1 essence and 1 seed. A second essence rolls with chance `c`, and a second seed rolls separately with the same `c` (if `secondarySeedDrops`, default true). `c` = 0 on plain farmland; 0.1 on any essence farmland (`baseSecondaryChance`, `IEssenceFarmland`); +0.1 if the farmland is the crop's own tier (and the crop `respectsEffectiveFarmland`); capped at 1; tier 6 sets secondary drops off. A fertilized essence drops with `fertilizedEssenceChance` 0.1. `requiresEffectiveFarmland` defaults to false, so a crop grows on any farmland unless a world turns that on; Additions' crops still need their crux (ET18).
- Port: a yield of 1 per harvest plus small bonus chances that scale with how well the ground matches the crop. The seed returns every time, so the plot is a perpetual machine whose cost is the stake.
- Inferred payback for a diamond plot: stake 4 diamonds + 4 supremium essence + one base seed; each harvest on matching farmland returns about 1.2 essence (1 + 0.2), so about 7.5 harvests per diamond and about 30 harvests to repay the 4 diamonds. I did not read vanilla crop timing, so wall-clock time per harvest is open.

**ET15 (shown, `MA block/InferiumCropBlock#getDrops`).**
The inferium crop is the root crop (grows from wheat seeds + 8 inferium essence; also drops from mobs at `inferiumDropChance` 0.2). Its yield depends on the farmland under it: `crop = int(0.5 x tier + 0.5)`, plus one more at 50% if the tier is even and above 1. Expected yield per harvest: tier 1: 1, tier 2: 1.5, tier 3: 2, tier 4: 2.5, tier 5: 3, tier 6: 3.5. Farmland is made by combining a hoe, dirt and a tier essence, or shapeless essence + farmland.
- Port: the root resource scales with infrastructure quality (farmland tier), linearly; every higher tier needs the root.
- Donor question: default: the root resource scales linearly with the quality of land you improved. Dial: slope (0.5 per tier here) and ceiling. Reason/cost: improving land costs the tier's own essence, so the root climbs only as fast as your last rung did.

**ET16 (shown, `MA block/GrowthAcceleratorBlock#tick`, `init/ModBlocks`, `config`; speed claims inferred).**
Accelerators are placed under the farmland. Every `growthAcceleratorCooldown` seconds (default 10, with a random 0.9 to 1.1 multiplier and an int cast, so 180 or 200 ticks) the block scans the column from 2 above itself to `range + 2` above and gives one random tick to the first bonemealable block it finds. Ranges: inferium 9, prudentium 18, tertium 27, imperium 36, supremium 45, awakened supremium 54. Recipe: 3 per craft from 4 tier essence, 4 stone and the tier gemstone (prosperity gemstone + 2 essence).
- Inferred: one plant is ticked at a time, so a higher tier raises reach (more floors of farms in a column), not speed per plant.
- Donor question: default: a speed device scales with how many plots it serves, not with how fast it runs one. Dial: reach per tier. Reason/cost: reach needs height, building and a per-tier gemstone.

**ET17 (shown, `MA item/MysticalFertilizerItem#applyFertilizer`, `MAdata recipe/mystical_fertilizer*.json`).**
Fertilizer sets a crop straight to full age (it also grows saplings and vanilla bonemealable plants) if the crop's tier is `fertilizable`. Recipe: 4 bone meal, 4 inferium, a diamond makes 4; the improved recipe swaps bone meal for fertilized essence and makes 8. Harvests drop fertilized essence at 10%.
- Inferred: 8 fertilizer applied to 8 harvests returns about 0.8 fertilized essence against 4 needed for the next batch, so it is a sink bounded by a diamond per batch, not a loop.
- Donor question: default: instant ripening is a consumable that costs a durable gem. Dial: fertilizable per tier (Additions' tier 6 defaults to off, `fertilizableTier6Crops` false). Reason/cost: the gem makes the shortcut an expense that only high-value plots repay.

**ET18 (shown, `MA lib/ModMobSoulTypes`, `api/soul/MobSoulType`).**
Mob crops need a filled soul jar as their "material"; a jar's capacity per mob is the `soulRequirement`: pig, chicken, cow, sheep, enderman, wither skeleton 8; squid, turtle, armadillo, phantom, rabbit, thermal mobs 6; creeper and blaze 10; breeze and ghast 4. Fish, slime, zombie, skeleton and spider types accept several entity ids (a family).
- Port: a living resource's gate is a kill count of that creature, not a recipe cost. Tier of the crop gives the essence cost; the mob gives the stake.

## Part C. Mystical Agradditions: tier 6

**ET19 (shown, `AD java/.../lib/ModCropTiers`, `lib/ModCrops`, `lib/ModCorePlugin`, `config/ModConfigs`, `MA block/MysticalCropBlock#canGrow`).**
Adds tier 6 (value 6, insanium farmland and essence, `fertilizable` from config default false, `secondarySeedDrop` false) with crops nether star, dragon egg, and mod-gated Gaia spirit, awakened draconium, neutronium, nitro crystal. It disables the base mod's dynamic seed recipes for its own crops and ships explicit infusion, crafting and reprocessor recipes for each. Each crop has a crux block (`setCruxBlock`): `canGrow` returns false unless the block two below the crop is the crux.
- Crux recipes: nether star crux = 4 insanium essence + 2 nether stars + 2 withering souls + 1 diamond block; dragon egg crux = 4 insanium + 4 dragon scales + 1 diamond block. Withering soul drops from the Wither at 35%; dragon scales 8 per dragon (configs).
- Seed = 4 real material + 4 insanium essence + the resource base seed (same infusion shape as ET12). Essence to goods: 9 essence per shard, 3 shards per star (27 per star).
- Inferred payback for a nether star plot: stake 4 stars + crux 2 stars = 6 stars, and at 1 essence per harvest with no secondary drops and no fertilizing, 27 harvests per star, so 162 harvests to repay the stars alone. Plus insanium cost: each insanium essence is 256 x 4 = 1,024 inferium.
- Donor question: default: the top rung asks for a one-time keystone in the ground, in addition to the stake, and gives no bonus rolls. Dial: whether the keystone is consumed, how many rungs share one, and whether top-rung plots can be hurried at all. Reason/cost: the keystone is itself built from the rarest drops, so the top of the ladder depends on killing the rarest creatures once, and then waiting.

**ET20 (shown, `MA lib/ModCorePlugin` line 16: `AWAKENED_SUPREMIUM_TIER = new CropTier(resource("5"), 6, ...)`).**
Awakened supremium is a side branch: a farmland and essence at value 6 that reuses the id "5". It is made at an awakening altar from supremium inputs (recipe `awakening_altar`: soulstone, gold, wool; the awakening recipe type needs up to four essence "vessels" at pedestals, `AwakeningRecipe`); I did not read the altar's numbers (left open).

## Part D. The two sides compared

**ET21 (inferred, from ET1-ET20).**
- **ProjectE gives every item one price, and economy is a flow.** Value comes from rarity seeds and the recipe graph; the player holds a pool; the sink is the item you want. Throttles: sun-scaled income, learning gate (one sample), and optional spread. Missing: any distinct goods that cannot be turned into each other, and any reason to be somewhere.
- **Mystical Agriculture gives each good its own essence on a ladder, and economy is a stock of rungs.** Value comes from a fixed 4:1 conversion and a hand-set essence table; the sinks are seeds, farmland, accelerators, fertilizer and gear of each tier. Throttles: stake in the real good, tier essence in bulk, land tier, keystones at the top. Missing: a way to price anything not in the table, and any link between rungs and the outside economy.
- **The two price systems disagree.** For the same good, EMC per inferium-equivalent (ET13 vs ET4, inferred) is: iron 12 (256 vs 21.3), copper 6 (128 vs 21.3), gold 16 (2,048 vs 128), diamond 3.6 (8,192 vs 2,304), emerald 7.1 (16,384 vs 2,304), coal 48 (128 vs 2.7), redstone 6 (64 vs 10.7), lapis 20 (864 vs 42.7), ender pearl 8 (1,024 vs 128), ghast tear 16 (4,096 vs 256), cobblestone 3 (1 vs 0.33). Taking netherite's EMC as 4 scrap + 4 gold = 57,344 (my arithmetic from the vanilla recipe, not read in data), it is 28. No fixed exchange rate would line up both.
- **Lesson for this repo:** a world should pick one pricing logic and say what produces it. Mixing a derived scale with an authored ladder inside one world (as a combined modpack does) leaves arbitrage by design. Under AD27 and ECR1 that is acceptable, since arbitrage is allowed, but it should be a stated feature (a market with a spread) and not an accident of two tables.

**ET22 (mapping to limit adjectives, AGENTS.md "limits are adjectives").** The knobs both mods expose, framed as default, dial, reason:

| Knob | Adjective | ProjectE | Mystical |
|---|---|---|---|
| spread | how costly | covalenceLoss 0.1 to 1.0 | none (conversion lossless at 4:1) |
| income rate | how fast | genRate 4/12/40, sun/320 | 1 essence per harvest, +0.1 to +0.2 chance |
| bonus roll | how sure | relay bonus 0.05/0.15/0.5 | secondary chance 0.1 to 0.2, tier 6 zero |
| learning | how known | one sample unlocks all of an item, Tome unlocks all | seed recipes (altar), all known on pickup |
| gating | how wide | pool is global | tier essence + stake + keystone |
| reversibility | how long | condenser both ways at spread | uncraft 1:4 without loss; seed to 2 essence |
| hurrying | how fast | none for pool | accelerator reach, fertilizer (gem cost) |

**ET23 (donor questions, default / dial / reason with in-world cost).**
- **Q-yardstick.** Default: local baskets (ECR6, ECR14); the recipe graph is a designer's price proposer and loop detector, with anchors written as data and a reason line. Dial: a world has a ledger-currency whose value is derived by recipe (an alchemy guild, a System shop). Reason/cost: it has an issuer, a fee and a border; holding a lot makes you known (ECR17).
- **Q-ladder.** Default: tiers of a grown or found good with a fixed integer ratio and lossless breakdown. Dial: ratio, loss, and the catalyst's durability. Reason/cost: a catalyst the player must own, found in the world (prosperity ore) and worn by use.
- **Q-stake.** Default: planting something rare needs a stake of the real thing, returned on the plot's end or salvaged at a loss. Dial: stake size and salvage rate (2 essence back for 4+4 spent here). Reason/cost: the stake is exposed to blight and raids for as long as the plot lives.
- **Q-keystone.** Default: top-rung plots need a placed object two below, made from the rarest drops, in addition to the stake. Dial: consumed or not; one per plot or per field. Reason/cost: it ties the endgame to killing the rarest creatures once, and to defending the field.
- **Q-learn.** Default: study one sample to make that thing for life. Dial: sample consumed or returned; knowledge in the head, in a book, or in an institution. Reason/cost: lost samples cannot be studied again; the lesson can be stolen or forgotten (MR22).
- **Q-hurry.** Default: hurrying a plot costs a rare gem per plot and usually stops short of the top rung. Dial: per-tier eligibility. Reason/cost: makes the rare gem the pacing gate, which the idle economy can display as a sink (ECR30: grow sinks, don't throttle income).

**ET24 (relation to this project's trade and crafting balance).**
- ECR6 (per-world basket) and ECR14 (value follows recognition and usability) mean EMC's single global scale is a dial for a few worlds, not a default. ProjectE's own default is also the cleanest example of ECR8's failure mode (a full purse replaces gathering and making): buy equals sell at 1.0.
- ECR15 and ECR30 already say money engines are payoffs and pushback comes from in-world agents. ET3 shows what the opposite looks like (silent zeroing). Do not port it; port the logging (report loops to the designer) instead.
- MR21 (skill improves control, not truth) and MR22 (new attempts teach) fit ET8: one sample, one lesson. MR27 (supply has many forms) fits Mystical's roots (ore, mob drop, found shards) feeding a farmed amplifier. TE1 (self-competition) and TE2 (obsolescence) map onto ET10-ET13: once a world has a plot of tier-5 essence, hand-mined diamonds lose their price unless the table makes them dear on purpose.
- CT1 (separate capability from workmanship) suggests keeping the ladder (capability: what you can grow) apart from quality (what a made good is worth).
- The repo's [Technology and progression TT scale ladder](../../../TECHNOLOGY_AND_PROGRESSION.md) could take the ET11 ratio as an example of one rung family; no change proposed here.

## Not read or open

- **ProjectE:** the Philosopher's Stone, rings, Alchemical Bags and world-transmutation JSON (`pe_world_transmutations`); all `*Provider` datagen other than conversions; the generated `defaults.json` was matched against the Java provider by its data, not diffed line by line; the per-item final derived EMC (cannot run the solver; only seeds are exact); the sell-value use in transmutation burning (inferred from condenser and relay code); pregenerated EMC and recipe-type mappers beyond Crafting/Brewing/Oxidization/Base; `EMCMappingHandler` config paths.
- **Mystical Agriculture:** augments, tinkering, enchanter, soul extractor, soulium spawner, essence furnace, harvester, essence vessel, tool and armor stats, the awakening altar's numbers, ore-infuser machine rates (ore infusion recipes exist: stone + 3 coal essence makes coal ore; counts per ore vary), per-machine operation time, and the dynamic recipe list for all 136 crops (only the template and a sample were read).
- **Additions:** the apples, essence coal, paxel, Tinkers' compat; per-crop seed recipes beyond nether star.
- **Time:** vanilla crop growth timing was not read, so wall-clock harvest times are open; the payback figures in ET14 and ET19 are in harvests, not hours.
- **Verification state:** source reading only. No code was built or run. Version mismatch between ProjectE (1.21.1) and the Mystical pair (26.1.2) is as the files state it; I did not check whether the numbers differ in other branches.
- **Not touched:** PROJECT.md and other owners. No commit.

# R4: Proto23 crafting, vendors, actions, combat, UI builders vs YAIRPG

Coverage: Proto23 `index.html` (rev e93a8cd) lines 8335-11500 read in full in 400-line chunks (every line of the range). Out-of-range callers were grepped for context and are labeled "outside range" (jobs L12300+, bed/sleep L12859, tick loop L13840-13880, `lvlup`/`giveExp`/`giveSkExp` L13710-13765, `You` object L7313-7370, `Creature` L7410-7470, ability/dmg L7930-7942, `rand` L14423). YAIRPG side: `src/crafting_recipes.js`, `src/trade.js`, `src/components/trader_component.js`, `src/data/traders.js`, `src/activities.js`, `src/data/locations.js` (activity block), `src/combat_math.js`, `src/models/combat.js`, `src/main.js` (use_recipe, do_resting, do_sleeping, kill_player, use_stamina, use_item), `src/data/storage.js`, `src/native_storage_transaction.js`, `src/display.js` (log_message), `src/proto23_world_*.js`. Labels: SHOWN = read directly in code; INFERRED = deduced from code; UNKNOWN = not determinable in range. Source line numbers are Proto23 unless a file is named. No code is pasted.

Headline: Proto23's range is a hand-tuned, deterministic-ish "life-sim crafting" game (62 recipes, no failure except two cooking recipes, XP that stops paying at a per-recipe skill cap, copper-priced shops with a single global price multiplier, energy-meter-as-hunger, a per-second combat tick with multi-hit speed bursts). YAIRPG's base game is a quality/success-rate crafting game with a stamina bar, market-saturation selling and a 60-subtick cooldown combat loop. Almost nothing is SAME beyond the idea of "recipe consumes items, gives item" and "hit chance from agility".

---

## 1. Recipes

### 1.1 Data model (SHOWN)
- A `Recipe` has name, `rec` (ingredient list of item+amount), `res` (result list, optionally min..max range via `amount_max`), `type` bucket, `allow` (reveal result name), `have`, tool-requirement text list `srect` with matching predicate list `srec`, and either an `onmake` hook (grants XP) or a `cmake` hook that replaces the whole result step. L8324-8335.
- Type buckets map to the UI filters: 1 FOD, 2 MED, 3 WEP, 4 EQP, 5 MAT. L9701-9705, L13778-13786 (`rsort`). Count in range: 29 food, 3 medicine, 1 weapon, 22 equipment/accessory, 6 material, 1 debug (`Test`, id 101, L8337-8340: two Discount Tickets -> 991 Small Bones).
- Recipes are ids 101-162, 62 total (SHOWN, L8337-8838). Discovery is by `giveRcp` (L10892-10898), called from books (L5447, L5469, L5542), item pickup thresholds (e.g. 5 raw meat unlocks Roasted Meat, L2631), skill level-up milestones (cooking lv1 unlocks Roasted Meat and Scrambled Eggs L1915; alchemy lv1 unlocks Lesser Healing Potion L1935), and a starting set at L5289. Locked recipes are not listed. Message on unlock: "New blueprint unlocked".
- The first unlock flips the "assemble" tab from `???????` to a real button (L10893, L9232).

### 1.2 canMake / make (SHOWN, L8841-8909)
- `canMake(rc, times)` checks each ingredient by stack count (`scan2`: same id and amount >= needed*times). Equipment-slot ingredients (unique gear instances) are counted via `findworst`, which sorts copies by lowest durability first (L14078). Special requirements are evaluated into a 0/1/2 array; success requires no "2". 
- `make` consumes ingredients (skips any marked `return`, i.e. non-consumed tools, none used in the catalog) and, for gear ingredients, consumes the worst-durability copies first. Then runs `cmake` if present, else gives every result (random amount if `amount_max`) and calls `onmake`. Supports a `times` loop but the UI only ever passes 1.
- Crafting is instant per click; there is no craft timer. Repeat crafting (a toggle shown only once Crafting skill >= 1) re-fires the recipe on a timer of 5000 ms minus 350 ms per Crafting level minus 150 ms per Patience level, floored at 300 ms (L10638, L10699). It stops when materials run out or when any choice button is clicked (L11133), and gives Patience skill XP 0.05 per repeat. `_fcraft` (L10727) refuses while sleeping, fighting, reading or busy with an action.
- Ingredient names are hidden as `?????????` until the item has been discovered; result names are hidden unless `allow` is true (L10651, L10673).

### 1.3 Skill gating and XP (SHOWN)
- `giveCrExp(skill, amount, levelCap)` (L8304-8306) grants XP only while the skill level is below the cap (no cap = always). So each recipe is a self-limiting "tutorial grind": e.g. Roasted Meat pays Cooking XP with no cap in its custom `cmake` (L8396), Scrambled Eggs only until Cooking 2, Batter Fried Fish until 5. XP is then multiplied by the skill's `p` rate in `giveSkExp` (L13747).
- There is no general "recipe level" gate. The only skill gate is Steak: tool text "Cooking lvl: 3", but the predicate tests level exactly equal to 3 (L8579-8580), so it greys out at 4+ (SHOWN quirk, probably a bug).
- Other tool gates: "Nearby firesource" = `you.mods.ckfre > 0` (L8374 and the whole cooking set); "Any sharp tool" = any carried item with edged class level >= 2 (L8349-8351, Sharpened Stick, Wood Effigy, Bone Doll); "Tailoring tool lvl: 1" = any carried item with `tlrq >= 1` (L8734-8737).
- Failure exists only in two recipes: Roasted Meat succeeds when a random roll plus 0.1 per Cooking level reaches 0.30 (so 70% at level 0, 100% from level 3) else a burnt-meat item (L8396); Bread succeeds when random plus 0.05 per Cooking level reaches 0.25 (75% at level 0, 100% from level 5) else burnt bread (L8569). Both still give cooking XP and show "It didn't turn out very well".
- The Crafting skill description says it makes autocrafting faster (L1928; matches the repeat timer in 1.2). Tailoring has a second skill, `tlrng`, on the clothing/blanket recipes.

### 1.4 Recipe catalog (SHOWN, L8337-8838)

Type: F=food, M=medicine/tool, W=weapon, E=equipment/accessory, T=material. Tool column: FIRE = nearby fire source, SHARP = any sharp tool, TAILOR = tailoring tool. XP column: skill amount (until skill level N = no more XP at or above N). Result is x1 unless stated.

| Id | Recipe (result) | T | Inputs | Tool | XP | Line |
|---|---|---|---|---|---|---|
| 101 | Test (Small Bone x991) | - | Discount Ticket x2 | - | none | 8337 |
| 102 | Sharpened Stick | W | A Stick | SHARP | Craft 0.5 (<1) | 8342 |
| 103 | Straw Pendant | E | Strand of Straw x5 | - | Craft 0.1 (<1) | 8353 |
| 104 | Low-grade Healing Powder | M | Cure Grass x3 | - | Alch 0.2 (<1) | 8360 |
| 105 | Boiled Rice (Steamed Rice) | F | Rice x2, Water x2 | FIRE | Cook 0.5 (<1) | 8367 |
| 106 | Boiled Egg | F | Egg, Water x2 | FIRE | Cook 0.2 (<1) | 8376 |
| 107 | Trinity | E | Mana Stone x2, Silver Ring, Blood Stone | - | none | 8385 |
| 108 | Roasted Meat | F | Raw Meat | FIRE | Cook 0.2 always; 70%+ success | 8391 |
| 109 | Scrambled Eggs | F | Egg x2 | FIRE | Cook 1 (<2) | 8400 |
| 110 | Bacon and Eggs | F | Egg x2, Bacon | FIRE | Cook 5 (<3) | 8409 |
| 111 | Morning Set | F | Egg x2, Bread | FIRE | Cook 8 (<3) | 8418 |
| 112 | Lunch Set | F | Egg x2, Bread, Raw Meat | FIRE | Cook 10 (<4) | 8427 |
| 113 | Onion Rings | F | Flour x2, Onion | FIRE | Cook 8 (<4) | 8436 |
| 114 | Cooked Fish | F | Fish | FIRE | Cook 2 (<2) | 8445 |
| 115 | Batter Fried Fish | F | Fish Fillet, Flour, Egg, Salt | FIRE | Cook 12 (<5) | 8454 |
| 116 | Fried Nori | F | Nori, Salt | FIRE | Cook 4 (<4) | 8463 |
| 117 | Steamed Bun | F | Water, Salt, Dough | FIRE | Cook 5 (<3) | 8472 |
| 118 | Dough | F | Water, Flour x3 | - | Cook 0.5 (<2) | 8481 |
| 119 | Flour (x2) | F | Wheat | - | Cook 0.2 (<2) | 8488 |
| 120 | Small Wood Bundle (Firewood) | T | Wood Splint x25 | - | Craft 0.5 (<1) | 8495 |
| 121 | Star Shell | E | Sun Charm, Moon Charm | - | Craft 10 always | 8502 |
| 122 | Lesser Healing Potion | M | Slime, Low-grade Healing Powder x2 | - | Alch 1 (<2) | 8509 |
| 123 | Hippo Cookie | F | Flour, Hazelnuts, Sugar, Milk | FIRE | Cook 7 (<4) | 8516 |
| 124 | Straw Effigy | E | Straw x50 | - | Craft 3 (<2) | 8525 |
| 125 | Maneki-Neko | E | Cat Figurine, Lucky Coin | - | Craft 25 always | 8532 |
| 126 | Wood Effigy | E | Wood Splint x40 | SHARP | Craft 3 (<2) | 8539 |
| 127 | Soul Puppet | E | Wood Effigy, Straw Effigy, Bone Doll, Life Shard x5 | - | Craft 5 (<2) | 8550 |
| 128 | Tea | F | Tea Leaves, Water | - | Cook 1 always | 8557 |
| 129 | Bread | F | Dough | FIRE | Cook 2 (<3); 75%+ success | 8564 |
| 130 | Steak | F | Salt, Raw Meat, Black Pepper | FIRE + Cook exactly 3 | Cook 7 always | 8573 |
| 131 | Cinnamon Bun | F | Sugar, Butter, Cinnamon, Wheat | FIRE | Cook 6 (<5) | 8582 |
| 132 | Broth | F | Water x2, Raw Meat | FIRE | Cook 0.5 (<2) | 8591 |
| 133 | Egg Soup | F | Broth, Egg x2, Salt, Scallion | FIRE | Cook 5 (<4) | 8600 |
| 134 | Creamy Chowder | F | Milk, Cheese, Raw Meat, Potato | FIRE | Cook 15 always | 8609 |
| 135 | Magic Ink | E | Quill, Black Ink | - | Craft 2.5 (<4) | 8618 |
| 136 | Mushroom Soup | F | Water x2, Mushroom x2, Potato, Onion | FIRE | Cook 4 (<3) | 8625 |
| 137 | Grand Gelatin | E | Life Jelly, Stamina Jelly, Vital Jelly | - | Craft 15 always | 8634 |
| 138 | Straw Kasa (hat) | E | Straw x30 | - | Craft 3 (<2) | 8641 |
| 139 | Bone Doll | E | Small Bone x30 | SHARP | Craft 3 (<2) | 8648 |
| 140 | Straw Basket | T | Straw x40 | - | Craft 3 (<2) | 8659 |
| 141 | Healing Stew | F | Water x2, Cure Grass x28 | FIRE | Cook 1 (<2) | 8666 |
| 142 | Bone Cracker | F | Small Bone x25 | FIRE | Cook 1.7 (<3) | 8675 |
| 143 | Boiled Carrot | F | Carrot, Water | FIRE | Cook 0.3 (<2) | 8684 |
| 144 | Jelly Sandwich | F | Jelly, Bread, Lettuce | - | Cook 0.8 (<2) | 8693 |
| 145 | Discount Card | E | Discount Ticket x5 | - | Craft 16 always | 8700 |
| 146 | Wastebread | F | Assorted Grains x3 | - | Cook 0.5 (<3) | 8707 |
| 147 | Stake Shield | E | Sharpened Stick x4 | - | Craft 2.5 (<2) | 8714 |
| 148 | Clover Pin | E | Lucky Clover x7 | - | Craft 77 always | 8721 |
| 149 | Patchwork Coat | E | Cheap Cloth x11, Thread x4 | TAILOR | Craft 3 (<2), Tailor 2 (<1) | 8728 |
| 150 | Patchwork Pants | E | Cheap Cloth x9, Thread x3 | TAILOR | Craft 2 (<2), Tailor 3 (<1) | 8739 |
| 151 | Ragwork Blanket | T | Cheap Cloth x40, Thread x18 | TAILOR | Craft 4 (<2), Tailor 7 (<1) | 8750 |
| 152 | Straw Pillow | T | Cheap Cloth x15, Thread x8, Straw x80 | - | Craft 3 (<2), Tailor 4 (<1) | 8761 |
| 153 | Basic Alchemy Set | E | Mortar and Pestle, Retort, Alembic | - | Craft 15 (<2) | 8768 |
| 154 | Adhesive Bandage | E | Bandage, Water x5, Cure Grass x50, Slime x10 | - | Alch 2 (<2) | 8775 |
| 155 | Medicated Bandage | E | Adhesive Bandage, Vitamins, Lesser Healing Potion x8 | - | Alch 3 (<2) | 8782 |
| 156 | Yarn Ball | T | Thread x200 | - | Craft 4 (<2) | 8789 |
| 157 | Firewood Pile | T | Firewood x60 | - | Craft 5 (<2) | 8796 |
| 158 | Family Heirloom+ | E | Straw Pendant, Family Heirloom | - | Craft 5 (<2) | 8803 |
| 159 | Apple Juice (+ Juice Pulp) | F | Apple x3 | - | Cook 0.5 (<2) | 8810 |
| 160 | Bandage | M | Cheap Cloth, Water x3 | FIRE | Craft 0.5 (<2) | 8817 |
| 161 | Wolf Fang Necklace | E | Wolf Fang x5, Thread | - | Craft 5 (<3) | 8826 |
| 162 | Wolf Array | E | Wolf Fang Necklace x3 | - | Craft 10 (<3) | 8833 |

Observations (SHOWN): 18 of 29 food recipes need fire; there is no durability/quality/rarity on outputs, no multi-skill-level scaling of yield, and no output ranges anywhere except the unused `amount_max` path (L8904). "Accessory" crafts are symbolic stat items (charms, effigies, dolls, pins) built from drops, not from refined materials. Several recipes absorb absurd quantities (28 Cure Grass for Healing Stew, 200 Thread for Yarn Ball, 50 Cure Grass + 10 Slime for Adhesive Bandage), which makes crafting a sink for common drops.

### 1.5 YAIRPG equivalent and difference
- YAIRPG: `src/crafting_recipes.js:15-130` defines `Recipe`/`ItemRecipe` with a `[min,max]` success chance that scales with skill level inside a `recipe_level` window and with crafting-station tier (`get_success_chance`, L79-83); `get_recipe_xp_value` (L395-440) scales XP with recipe level and cuts it to the floor once the skill is 6-10 levels above the recipe; `use_recipe` in `src/main.js:3618-3790` does batch crafting with fractional success, partial result scaling and a loop until the next skill level. About 147 recipe constructors, 24 cooking and 12 alchemy item recipes (grep count). Components/equipment recipes carry quality caps (`get_crafting_quality_caps` L26-31). Stations: `current_location.crafting.tiers[category]` (main.js:3624).
- Classification: **DIFFERENT-DESIGN**.
  - Proto23: ingredients and outputs are fixed, results are always exactly what the label says, difficulty = "do I have the stuff and the fire". Power curve comes from XP caps and from bulk ingredient demands. Play feel: crafting is a short, readable puzzle of "what can I cook with today's groceries", then it goes quiet.
  - YAIRPG: results have quality, failure and station scaling, crafting skills are leveled by repetition, and batches are processed at once. Play feel: crafting is a long-run skill/gear-quality economy.
  - **PROTO23-ONLY**: recipe XP caps per recipe (`giveCrExp`), unlock-by-book/milestone with hidden ingredient names, equipment-instance ingredients consuming the worst-durability copy, symbolic accessory crafts, repeat-craft that speeds up with Crafting+Patience, two recipes with a skill-scaled burn chance.
  - **YAIRPG-ONLY**: success-rate window, quality, component/equipment assembly, station tiers.
  - **SAME**: "recipe consumes counted items, adds counted items" and XP flows to the relevant skill.
- Fork module covering the same idea: `src/proto23_world_content.js:22-154` already adopts a Proto23-flavored world (counted furnishings, offcuts, sap, paper, ink) and routes it through the native crafting and storage host; it does not reproduce this recipe catalog. `src/crafting_component_filling.js`, `src/crafting_visibility.js`, `src/field_workshop.js` and `src/audited_workshop_*.js` are fork additions on crafting (names only; not read in depth for this report).

---

## 2. Vendors and shops

### 2.1 Mechanics (SHOWN)
- Currency: copper-base integer wealth. 1 silver = 100 copper, 1 gold = 10,000 copper (L172). The money bar shows copper, silver and gold, plus a fourth glyph tier at 100,000,000 (L11120-11125). There is no sell-back to vendors in this range. Selling is done in specific NPC scenes outside the range: forest firewood buyer at 15 copper per bundle (L12008-12022), straw baskets at a market stall (L12374-12376); both are fixed prices.
- `Vendor` (L8912-8921): `items` (template rows `{item, p price, c chance, min, max}`), live `stock` rows `[item, count, price]`, `data.time` countdown, `timeorig`, `data.rep`.
- Restock (L8958-8963): shuffle the template list, then each row enters stock when a uniform roll is at most its chance `c` (and any `cond` passes), with a uniform integer count in [min,max]; stock sorted by item id. Vendors tick once per in-game day (L13854: every vendor's `onDayPass`). When the day countdown hits zero the vendor restocks, resets the countdown to `timeorig`, and `extra()` runs (a 20% chance to reset a per-shop `data.gets[0]` flag on the shop scene; the flag's purpose is outside range).
- Cadence (SHOWN): Street Vendor and Child Trader every day (default timeorig 1, L8916). Grocery every 3 days (L8933). General Store: the code sets `vendor.gens1.time` and `timeorig` to 3, but the countdown lives in `data.time`, so its first restock is next day and afterwards every 3 days (L8942, L8920). Herbalist likewise: first next day, then every 2 (L8951). Save load restocks any vendor with no saved stock (L372).
- Two simple vendors (Street Food Stand, Child Trader, L12439-12470, outside range but SHOWN there): flat listed prices in copper, click to buy 1 at a time, stock rows decrement, while the restock timer ejects the player from the scene ("we're restocking, step out"). Template fields `infl`, `repsc` are absent on the Child Trader (not used there).
- Three full shops (Grocery, General, Herbalist; `chs_spec(4)` L11182-11201, `rendershopitem` L11250-11317):
  - Price shown = ceil(base price x (1 - Trading skill x 0.005 stored as `infsrate - skl.trad.use()` where `infsrate` starts at 1 and is lowered by Discount Ticket/Card/other accessories) x vendor inflation x reputation discount x global evil-index). L11256.
  - Vendor inflation `infl`: Grocery 1.15, General 1.2, Herbalist 1.25 (L8933, L8942, L8951). `dfl` (0.2-0.3) is declared but never read in the range (INFERRED unused; a sell-side leftover).
  - Reputation discount = 1 - ((sqrt(rep)^1.3 + 0.05) x 0.01). Rep starts at 10 (Grocery) and 5 (General, Herbalist) and is capped at 100; at rep 100 the discount is about 20%, at rep 10 about 4.5%, at rep 5 about 3.2% (computed from the formula; INFERRED figures).
  - Global evil index (`global.offline_evil_index`) starts at 1 (L181), rises 0.00008 per in-game day (L13855), and is loaded from the save. `offline_a()` (L10023-10038) is defined and would compute about 2.0, but it is never called (grep finds only the definition), so in this build it does nothing. Price drift is therefore negligible per play session (SHOWN; the call-site absence is verified).
  - Buying: click the name for 1, or hover for buttons 1, 5, 10, Max. Each buy spends the money, gives items, adds Gred (greed) skill XP of 5% of base price per unit, Trading XP of base^(1+0.1 x rarity) x 0.05 per unit, and raises reputation by base price x 0.0004 x vendor `repsc` (Grocery 8, General 4, Herbalist 6; bulk buys get a small bonus). Each single-unit buy has 0.08% chance to give a Discount Ticket ("Thank you for your patronage!"); 5-pack 0.4%, 10-pack 0.8%, Max 0.08% per unit (L11281-11302). 5 tickets craft a Discount Card (-5% infsrate) while each ticket worn is -1% (L7005-7015).
  - Out-of-money rows turn red; sold-out rows grey. Prices refresh live when money, Trading level or reputation changes (`recshop`, L11244).
- Buying only: this range has no sell price ratio. The copper price is the vendor price, not a ratio of a stored "item value" (the `item.val` seen on food is energy restored, not price; L2641-2652).

### 2.2 Vendor stock tables (SHOWN)
Each row: base price (copper) / stock chance / count range. Lines: Street L8925, Child L8929, Grocery L8935, General L8944, Herbalist L8953.

Street Vendor (daily, flat price, no formula): Steamed Bun 6 / 80% / 1-4; Strawberry 8 / 1% / 1-8; Red Bean Bun 7 / 50% / 1-4; Bread 5 / 100% / 4-8.

Child Trader (daily): Pebble 1 / 100% / 10-50; Clay Milk Cap 2 / 30% / 6-16; Spoiled Bread 3 / 80% / 2-8; Rotten Onigiri 11 / 20% / 2-5. (joke junk stock; these are cheap fodder and curiosities.)

Grocery Shop (every 3 days; infl 1.15; rep 10; repsc 8): Rice 4 / 100% / 40-50; Egg 7 / 100% / 8-32; Onion 8 / 100% / 5-12; Salt 25 / 30% / 2-7; Garlic 14 / 15% / 1-8; Wheat 5 / 100% / 13-29; Lettuce 8 / 60% / 3-6; Milk 10 / 40% / 2-4; Apple 5 / 80% / 5-20; Bread 12 / 85% / 3-10; Baguette 17 / 35% / 1-6; Raw Meat 31 / 25% / 4-8; Assorted Grains 8 / 20% / 10-30; Water 2 / 85% / 20-70.

General Store (3 days after first; infl 1.2; rep 5; repsc 4): Firewood 25 / 100% / 8-20; Charcoal 80 / 50% / 2-5; Guide to Living by Yourself (book) 360 / 20% / 1; Dollmaker book 390 / 15% / 1; Wastebread 16 / 70% / 5-11; Wooden Sword 35 / 60% / 1-3; Rain Cap 60, Rain Shoes 70, Tunic 56 each 30% / 1-3; Sandals 32 / 30% / 1-6; Blunt Sword 100 / 30% / 1-2; Spear 130 / 30% / 1-3; One-year Wine 116 / 20% / 1-7; Rope 100 / 65% / 1-6; Book of Fairy Tales 110 / 25% / 1-4; Wooden Tableware 130 / 65% / 1-4; Plain Bed 500 / 45% / 1; Candle 200 / 55% / 1-2; Cheap Cloth 7 / 85% / 15-50; Thread 2 / 85% / 3-70; Wooden Needle 50 / 73% / 1-15.

Herbalist (2 days after first; infl 1.25; rep 5; repsc 6): Low/Mid/High-grade Spirit Pill 20 / 230 / 690 at 100% / 80% / 70%, counts 3-15 / 2-10 / 1-5; Bandage 6 / 90% / 5-15; Vitamins 150 / 50% / 1-3; Mortar and Pestle 100 / 80% / 1-6; Retort 480 / 60% / 1; Alembic 600 / 40% / 1; Lesser Healing Potion 20 / 100% / 8-35; Herbal Antidote 40 / 70% / 4-13; Poison Ward 400 / 25% / 2-5; Stomach Medicine 70 / 75% / 2-8; First Aid Manual (book) 150 / 75% / 1.

Design notes (INFERRED from the tables): staple raws are always in stock in bulk and almost never run out, so food crafting is gated by money and fire, not by supply. High-value one-offs (bed 500, books 360-390, alchemy kit pieces 100-600) are the "buy once, owned forever" progression. The Herbalist sells Lesser Healing Potion at 20 while the recipe needs 2 Powder + Slime, so the shop undercuts crafting for early alchemy.

### 2.3 YAIRPG equivalent and difference
- YAIRPG: `src/trade.js:1-510`, `src/components/trader_component.js:20-175`, `src/data/traders.js`, `src/data/inventory_templates.js`. Traders have `profit_margin` (village 4, suspicious 6, swamp 7, cafes 18-20), `refresh_time` default 4 days, optional weekday shift, inventory templates of grouped TradeItems with per-item chance, count range and quality range. Price = item value x market margin (1 + (margin - 1) x (1 - Haggling bonus) x (1 - min(1000,reputation)/2000)) (`getProfitMargin` L140-145), buying **and** selling use a market-saturation curve per group/tier/region (`src/market_saturation.js`, caps 500 items / 200 equipment; recovery and regional trickle at `main.js:6643`). Trade is a two-column cart with a quote fingerprint that must match at accept time (`trade.js:78-95`). 
- Classification: **SIMILAR-DIFFERENT-TUNING** for restock (both: template, per-item chance, [min,max] count, day-based cadence) and for skill+reputation discounts; **DIFFERENT-DESIGN** for pricing; **PROTO23-ONLY**: per-vendor fixed copper price per row, patronage ticket mini-drop, Discount Ticket/Card as a worn accessory that lowers all prices, Gred (greed) and Trading skills from buying, shop kicks you out on restock; **YAIRPG-ONLY**: selling to vendors, market saturation and regional recovery, quality-ranged stock, cart + quote validation, multiple regions.
- Play feel: in Proto23 you cannot "farm and dump loot", income comes from jobs, a handful of fixed NPC buyers and monster coin drops, so money feels scarce and every purchase is a decision. In YAIRPG selling loot is the main money loop, throttled by saturation.
- Adopt/avoid: a fixed-price "staples + one-off big buys" shop list with tiny reputation discounts is a cheap way to give the fork's Village a food economy; but Proto23's price formula ships dead variables (`dfl`, `offline_a`) and a broken `gens1.time`, so copy intent, not code.

---

## 3. Actions, rest, sleep, jobs, training

### 3.1 Action system (SHOWN, L8974-9058, L9268-9294)
- `Action` type 1 = toggle (only one active at a time, tracked in `global.current_a`), type 2 = instant use, type 3 = placeholder. Selecting a new toggle deactivates the previous one; moving between locations deactivates it (L11469). Dying deactivates it (L7352).
- Learned via `giveAction` ("You learned a new action"), first call unhides the "actions" tab (L9055). Only two toggles exist in the range plus one dev action.
- **Run** (id 1): unlocked by Walking level 1 (L1863). Allowed only out of combat, in a civil area, outside, not sleeping/reading/shopping/working (L8998). Each real second: flat +0.5 EXP with no efficiency scaling, Walking skill +1.5 if energy > 0 else +0.5, legs armor loses 0.005 durability (L9000-9004). Energy drain rises from 0.1/s to 0.2/s (x `runerg`), and star-dust find chance rises (`stdstps` +0.5) (L9007). Titles reduce the added drain (L512, L547).
- **Investigate** (id 2): unlocked by a story beat (L12816). Needs light in the dark. Every second it asks the current location and its sectors whether anything is scoutable (`canScout`), fires `onScout` hooks, and stops itself with "nothing of interest" or "already explored" (L9032-9043). It is an exploration lever for hidden passages, treasure and secrets, not an XP grind.
- **Selfharm** (id -3, type 2): applies Bleeding for 10 (L9046-9052). Never granted anywhere (only `act.demo` and `act.scout` are given), so it is a dev tool.
- Training in the sense of repetitive skill grinding is done by actions and by doing the thing (fighting trains Fighting, resting trains Meditation at 0.0065/s idle, L13853). Jobs are location scenes outside range (e.g. gate guard, L12300-12335: Patience XP 0.08/s, small coin-drop chance per second, ends at 20:00 with salary and quest finish).

### 3.2 Energy, rest and sleep (SHOWN for the formulas; outside range for the ticks)
- Energy (`sat`) max 200 at start (L7323). Passive drain `sdrate` 0.1/s each game tick (L7322, L13869), tripled (reduced by Water Resistance) when wet, plus a cold surcharge. At zero energy you gain Famine skill XP 0.1/s instead.
- `efficiency()` = (0.8 - famine) x sat/satmax + (0.2 + famine) + bonus, with famine bonus capped at 0.6 (L7321). So energy 0 = 20% to 80% efficiency. Efficiency multiplies EXP gain (0.4 + 0.6 x eff, L13735), hit chance and damage, and drives crit chance (below).
- Sleeping is a location/furniture state (`chss.hbed`, L12859): sets sleep mode, timescale x5 (time runs 5 game minutes per tick), applies the Sleep effect. Different bedding variants are shown as `[z]`, `[zp]` pillow, `[zb]` blanket hotkeys in the furniture list (L11213-11221). Sleep recovery magnitudes are outside range: UNKNOWN.
- Food restores energy by its `val` (e.g. Raw Meat 11 with 15% chance of food poisoning L2625-2640; Steamed Rice 18; Scrambled Eggs 20; Steak 50; Lunch Set 58). Items perish (rot ranges per item) and can be inspected with the survival-info skill (L10982-10999).

### 3.3 YAIRPG equivalent and difference
- YAIRPG: `src/activities.js:1-222` defines Job/Training/Gathering classes (fieldwork, patrolling; running, weightlifting, balancing, swimming, meditating, climbing, enduring; mining, digging, woodcutting, herbalism, animal care, harvesting, fishing). Locations attach activities with payment, working period (e.g. fieldwork 120 ticks, 06:00-20:00, three seasons, pay 15 + up to 25 by Farming level, `data/locations.js:1832-1845`), skill XP per tick and gather tables (`main.js:6880-6930`). Rest: `do_resting` heals max(1% HP, 2) and max(stamina/120, 2) per tick (`main.js:2308-2326`); sleep heals max(4% HP, 5) and max(stamina/30, 5) per tick, scaled by Sleeping and Regeneration (`main.js:2328-2344`). Resource is **stamina** consumed by attacking and **no hunger meter**: `use_stamina` and "persistence" XP when at zero (`main.js:3240-3270`). Defeat: lose consciousness, return to bed or parent location, "Recovering" debuff cuts XP to 20% for a short span (`main.js:3223-3238`, `active_effects.js:475-483`).
- Classification: **DIFFERENT-DESIGN**.
  - Proto23 uses a continuous energy meter as hunger plus efficiency multiplier (always-on pressure), instant toggled actions for XP trickle, and a time-compression sleep. YAIRPG uses stamina as a burst resource only in combat/gathering, resting as an explicit healing tick, and activity-based jobs with pay per working period.
  - **PROTO23-ONLY**: efficiency tied to fullness, food as the pacing mechanic, wet/cold drain modifiers, Run as a free-form toggle, Investigate as a discovery toggle, shop-gated survival.
  - **YAIRPG-ONLY**: gathering jobs with tools, seasonal availability windows, payment per work period.
  - **SIMILAR**: death/defeat sends you home and nerfs progress. Proto23 cuts energy by up to 45% (reduced by Death skill) and gives a death item (see 4.6); YAIRPG applies an XP debuff.
- Play feel: Proto23 punishes ignoring food steadily; YAIRPG punishes spending stamina in a fight. Anything built on the fork's `energy_resources.js` (fork addition) would be the natural hook to model Proto23's meter (not read in depth here).

---

## 4. Combat

### 4.1 Tick structure (SHOWN, L10379-10426; tick at L13853)
- One round runs per real-time game tick (1 s at the default speed) via `fght(you, monster)`. Dead sides abort the round. A "smoke" flag skips a round (L10386).
- Initiative: whoever has the higher speed is "inn" (ties and attackers with speed <= 0 favor the attacker). A running `s_l` budget accumulates the absolute speed gap between the sides across rounds while both have speed above zero, otherwise it equals the current gap (L10390-10394).
- If the faster side's speed is positive and `s_l / slower speed >= 2`, it performs a multihit burst of ceil(s_l / slower speed) attacks in one go (stopping if the target dies), and the budget is reduced modulo the slower speed. A "one-shot" stat counts a burst that deals at least the target's max HP (L10400-10413). Otherwise the faster side attacks once. Then, 500 ms later, the slower side attacks once if the fight continues (L10421-10425). So speed does not change attack frequency below a 2x gap; above it, it multiplies hits per round.
- The log condenses multihits into a single "-> xN (M) for total" line.

### 4.2 Hit chance (SHOWN, L10574-10585, L10428-10458)
- Player hit % = (player AGL + half of summed equipment AGL) x efficiency / (monster speed + monster AGL + monster eva) x 130 + 5, not clamped in the roll. `rand(100) < hit` is the roll (rand rounds, so 0..100 with half-weight endpoints, L14423).
- Monster hit % against you = monster AGL / ((your speed + your AGL + half equipment AGL) x efficiency) x 100 + 10 - Evasion skill level, and the UI shows "dodge chance" as 100 minus that (L9957-9962). There is an extra flat dodge `ddgmod` check (L10457).
- Darkness multiplies your hit % by 0.3 + 0.07 x Night Sight unless you carry light or Night Sight 12+ (L10435, L13909).
- Attack target body part for monster hits: a random equipment slot index 2 to 6 (head, body, two arms, legs) with a rounded roll; so middle slots are hit more often (INFERRED from the rounding; L10432). That piece's durability and your shield drop by 0.008 per hit taken (L10467).

### 4.3 Damage (SHOWN, L10488-10529)
- Player physical: (STR x efficiency + weapon STR x durability fraction x 0.9 + 0.1) x affinity multiplier (weapon element, class mastery, monster-type affinity, your own element affinity, each step +10% per point) minus defender STR x (1 + defender resist x 5% per step) plus 1. Unarmed fists get class and affinity values from your level (L10496, L10865). Worn weapons deal 10% of their STR at zero durability.
- Monster physical on you: monster STR x affinity multiplier minus a flat defense term built from your STR x efficiency plus the hit armor piece's STR x durability, further reduced by shield STR (scaled by Shield skill) and by your resistances to the attack element and class (L10498). Magic uses INT in the same shape (L10500-10505).
- Tarnish effect makes your gear 30% worse, Prostasia makes it 30% better (L10492).
- Damage is multiplied by the defender's physical resistance and, when the monster hits you, by (1 - Pain Resistance x 0.004 per level) (L10518).
- Final non-crit damage: ceil(dmg x attacker damage multiplier x random 0.9..1.1), floor zero (L10528).

### 4.4 Crits (SHOWN, L10506-10527)
- Crit chance = base crit x (2 - 2 x (energy fraction + energy bonus)) + base crit) x luck factor (1 + luck/25 physical, /20 magic; monsters use 1) + Sharp Eye level x 0.003 (player only) + flat crit mod. Base crit 0.008 (L7330). At full energy the energy term vanishes and chance = base crit; at empty energy chance triples. The formula uses the player's energy even for monster attackers, and adds the player's flat crit bonus to monsters too (SHOWN, likely unintended).
- Crit damage: base damage plus base damage x random 0.95..1.05 x crit power (x War skill bonus for the player; reduced by Danger Sense for monsters) added on top, then multiplied by damage mult and variance, then +1..5 flat (L10525-10527). Minimum crit damage is 1-5. Net crit multiplier is roughly 2x. Screen shakes on crits (L10521).

### 4.5 Throwing (`tattack`, L10473-10486, SHOWN)
- Used by thrown items (hit = (AGL + half equipment AGL) x efficiency / (monster speed x 5 + monster AGL) x 130 + 5 + throwing skill hit bonus). Damage = ((1 + STR x 0.05) x (efficiency + 1) x item power x (throw skill factor + 1)) / 2. Trains Throwing (item-specific amount) and Fighting (5 x throwing level + 1). It uses no weapon durability and ignores defense. Monster death goes through the same `onDeath`.
- YAIRPG has no throwing action in the files read. Closest is ranged/bow classes inside the stance system (UNKNOWN beyond `combat_stances.js`).

### 4.6 Rewards, upkeep and defeat (SHOWN)
- Weapon loses 0.008 durability per swing (L10463); legs armor 0.08 per room move and 0.005/s running (L9003, L11462). Weapon and armor stats scale by durability fraction, so gear wears out as a soft penalty rather than breaking (floors at 10% / 15%).
- XP per hit: Fighting by monster rank, mastery skill of the weapon class by 1 (0.5 if the weapon is broken), Shield skill 0.2 per attack taken with a shield, Evasion 0.5 per dodge, Pain Resistance 1 per damaging hit, Toughness from bare-slot hits, Night Sight in dark, Stealing on a successful hit when the steal buff is active.
- Kill: bestiary count, EXP with a level-difference divisor, loot via `dropC`, optional coin drop if an equipped item grants it, area size decremented to spawn the next enemy until the area clears (L7431-7452, outside range).
- Level up stats: STR, AGL, INT +random between 1x and 2x growth per level (potential per stat); HP +random scaled by log(level) up to level (L13710-13731, outside range). Levels cost level x (2 x level)^2 + level^2 EXP (L7314).
- **Death (outside range, SHOWN L7348-7362)**: with Death resistance the roll may avoid it and leave you at 10% HP; otherwise you die: energy is reduced to 55% x (1 - Death skill factor) of current, you get a Death item, the stat and last-casualty record are updated, all effects are removed, any active action/read/job is stopped, and you are moved home (or the neighbor spot if the house is smoked out). No gold or gear loss.

### 4.7 YAIRPG equivalent and difference
- YAIRPG: `src/combat_math.js:1-59` and `src/models/combat.js:1-503`. Hit chance = attack_points / (attack_points + evasion) mapped through a piecewise curve (0 below 10% ratio, 97% at ~80%) (combat_math.js:1-24), evasion includes sqrt(intuition); `combat.js:343-344`. Damage rolls are attack power x 1.2-0.4*random per hit, minus armor with a 5% floor of the hit and a minimum of 1 (combat_math.js:29-38). Block: chance first, shield strength subtracts or fully absorbs, Shield blocking skill reduces damage (combat.js:320-340). Crit: single chance and multiplier from stats (default 5% and 1.3x, `stat_haver.js:29-30`). Speed: attack cooldown = 1/attack_speed seconds divided by stamina efficiency, 60 sub-ticks per attack (combat.js:95, 130-175, 205-215). Multi-target factors: evasion x n^(-1/3), hit x n^(-1/4) (combat.js:268-273). Stances cost stamina per swing (`combat_stances.js`). Defeat: "lost consciousness", relocation, Recovering debuff, no item loss (`main.js:3223-3238`).
- Classification:
  - Hit chance: **SIMILAR-DIFFERENT-TUNING** (both compare attacker accuracy-type stat to evasion; Proto23's linear, unclamped formula vs YAIRPG's S-curve).
  - Damage: **DIFFERENT-DESIGN** (subtractive-with-affinity multipliers vs rolled attack power minus armor).
  - Speed: **DIFFERENT-DESIGN** (burst multihit when speed gap >= 2x vs independent cooldown timers).
  - Block/dodge: **SIMILAR** (YAIRPG has block + evade as separate rolls; Proto23 has body-part targeting and a separate flat dodge but shield blocking is folded into the subtraction).
  - Crits: **DIFFERENT-DESIGN** (Proto23 ties crit chance to fullness and luck and adds flat bonus; YAIRPG a fixed rate).
  - Equipment wear: **PROTO23-ONLY** per-use durability that scales stats; YAIRPG has item quality and tier instead.
  - Throwing: **PROTO23-ONLY** (tattack).
  - Death penalty: **SIMILAR** (home + penalty, no gear loss). Proto23 penalizes energy and drops a death item; YAIRPG uses an XP debuff.
- Play feel: Proto23 combat is slower and more legible (one visible exchange per second, log lines like "-> x3 for 24"), with food and gear wear acting as hidden dials; YAIRPG's cooldown loop is faster, number-heavier and stamina-tuned.

---

## 5. UI builders and state plumbing

### 5.1 Inventory and messages (SHOWN)
- Inventory: single `inv` array; stackables hold an `amount`, equipment items are separate copies with a unique id (`giveItem`, L10917-10945). Sort modes: category filter ALL/WPN/EQP/USE/OTHER (stype 1-5) and sort by A-Z, amount, type (L9892-9951). No capacity or weight check appears in `giveItem` or the container code (INFERRED unlimited).
- Per-item hotkeys: hover an item and press a letter/number key to bind; pressing the key later uses that item and shows `{key}` in the name; Delete unbinds (L10947-10968).
- Item actions on hover: throw away (x) for non-important equipment with a confirm if worn, gives Recycling XP and Throwing XP (L11015-11031); disassemble (∥) only when a toolbox is owned, yielding listed parts scaled by Disassembly skill and halved at zero durability (L11041-11065, L13821-13830); L/R arm toggles for arm gear (L11033-11040).
- New items blink "new" until hovered; rarity colors; item tooltip shows STR/DEF/AGL/INT/SPD lines, durability bar, class, kills for weapons, "tried/never" flag for food, "read/never" for books, and an optional rot estimate with the survival skill (L10040-10171, L10982-10999).
- Message log: `msg(text, color, tooltip, tooltipType, bg)` with a configurable cap (1-100), "freeze log", "stop combat log" and clear (L9864-9890, L10296-10312). Special "pause next battle / resume" buttons sit under the monster panel (L9167-9177).
- Journal: Quests (rarity stars, objectives, repeatable flag), Bestiary (name, rank, kills, hover drop table whose item names are revealed only when discovered and shown with exact percent chances), Statistics (about 45 counters: jobs, saves, food, deaths, damage totals, kills by monster class and weapon class, books read, money earned/spent; L9356-9677). Settings: message cap, background color/presets, export/import save as base64 text or file (L9707-9855).
- The monster panel shows rank, STR/AGL/INT/SPD (L10008-10015), the hit/dodge line and critical chance line (L9957-9962, L10463).

### 5.2 Effects (SHOWN)
- `giveEff(target, effect, duration, y, z)` re-uses the effect object for the player but clones it for monsters, only when in battle for monsters, refreshes duration if already active, and renders status icons (L10774-10783, L10808-10817). `removeEff` clears icon and list (L10786-10796). `effdfix` shrinks the equipment panel and compacts effect icons once 21+ effects are active (L10798-10806). New monsters spawn Wet or Cold if the weather flags are on and the area is outdoors (L10766-10769).

### 5.3 Furniture and the Home screen (`chs_spec`, L11142-11206) (SHOWN)
- Case 1: the house cat sheet (name, sex, birthday, age, coat pattern/color from 12x12 lists, two likes from 33, L11137-11139, L11144-11153). Case 2: furniture list with a "home rating" that sums each piece's value (multiplied by count for stackables) (L11160-11165). Case 3: trunk (storage). Case 4: shop.
- `giveFurniture` (L11477-11484) stacks by id; furniture items in the inventory are "Use to add to the furniture list" and show owned yes/no (L10140-10148). Removable furnishings can be removed one at a time; the last removal deactivates and destroys the object. Active furniture runs `use()` every tick (L13856). Bed, pillow, blanket and tableware show hotkeys (L11213-11221).

### 5.4 Trunk / storage (SHOWN, L8310-8322, L11331-11452)
- A single home chest `container.home_strg` with an item list (L8318-8322). Two-pane UI: carried items left, chest right; click moves one, the hover `>>`/`<<` button moves the whole stack; equipment copies get a new uid and keep their durability. Items can carry `onTIn`/`onTOut` hooks, so stored goods can change behavior (e.g. perishables; UNKNOWN which items use them). No capacity cap seen. UI only reachable when the home is open (`global.menuo === 3`).
- YAIRPG: `src/data/storage.js` and `src/native_storage_transaction.js` make the chest an inventory owner whose moves go through staged, sequence-checked transactions (stale-request refusal, equipped-only protection, counts verified). Classification: **SAME** concept (chest as second inventory, move items both ways), **YAIRPG-ONLY** transaction safety and quantity validation, **PROTO23-ONLY** per-item transfer hooks and gear-instance durability preserved across the move.

### 5.5 Logging
- YAIRPG's `log_message` (display.js:767+) sorts messages into combat, unlock, loot, event, background and crafting categories with per-category counters and filter toggles (main.js:1370+). Proto23 has a single flat log with a size cap and two toggles. **SIMILAR-DIFFERENT-TUNING**; YAIRPG's filters are better; Proto23's condensed multihit line and colored fragment messages are a small readability win.

---

## 6. Comparison table

| System | Proto23 (lines) | YAIRPG (file:line) | Class | Play-feel consequence |
|---|---|---|---|---|
| Recipe model | fixed in/out, type buckets, tool predicates (8324-8335, 8841-8909) | success window + quality + station (`crafting_recipes.js:15-130`) | DIFFERENT-DESIGN | Proto23 crafting is a deterministic cook-what-you-have; YAIRPG is a quality grind |
| Recipe XP | per-recipe XP with skill cap (8304-8306) | XP value tapering above recipe level (`crafting_recipes.js:395-440`) | SIMILAR-DIFFERENT-TUNING | Both self-limit grinding; Proto23 hard-stops, YAIRPG tapers |
| Failure | only Roast Meat and Bread (8396, 8569) | per-recipe success chance (`:79-83`) | DIFFERENT-DESIGN | Proto23 rarely wastes materials |
| Unlock path | books, milestones, pickup counts (10892-10898) | `is_unlocked` flags via availability component (`:30-50`) | SIMILAR | Both reward finding things |
| Repeat craft | timer speeds with Crafting/Patience (10699) | batch quantity in one action (`main.js:3618+`) | DIFFERENT-DESIGN | Idle-friendly either way |
| Gear as ingredient | uses worst durability (8895) | n/a in item recipes | PROTO23-ONLY | Rewards keeping spares |
| Vendor stock | template rows with chance/count, daily or n-day restock (8958-8963) | template groups with chance/count/quality, 4-day refresh (`trader_component.js:68-97`) | SIMILAR-DIFFERENT-TUNING | Very close in structure |
| Pricing | fixed copper x multipliers (11256) | value x margin x saturation (`trade.js`, `trader_component.js:140`) | DIFFERENT-DESIGN | Proto23 flat, YAIRPG market-reactive |
| Selling | fixed-price NPC buyers (12008, 12374) | open sell with saturation | YAIRPG-ONLY | Proto23 income is scarce |
| Rep/skill discounts | Trading 0.5%/lvl, rep up to ~20%, tickets/cards (11256) | Haggling and reputation (`trader_component.js:140-145`) | SIMILAR | Same lever |
| Currency | copper/silver/gold 1:100:10000 (172) | single integer money | SIMILAR-DIFFERENT-TUNING | Display only |
| Actions | Run, Investigate toggles (8994-9044) | Training/gathering/jobs (`activities.js`) | DIFFERENT-DESIGN | Proto23 free toggles vs YAIRPG scheduled work |
| Hunger/energy | energy meter drives efficiency (7321, 13869) | stamina only (`main.js:3240`) | PROTO23-ONLY | Food is a pacing system in Proto23 |
| Rest / sleep | timescale x5 in bed (12859) | heal per tick (`main.js:2308-2344`) | DIFFERENT-DESIGN | Proto23 sleep skips time |
| Jobs | scenes with salary at end of shift (12317) | working periods, payment ticks (`main.js:6880-6930`) | SIMILAR | Pay for time in both |
| Combat tick | 1 s round, speed-gap bursts (10379-10426) | cooldown loops, 60 subticks (`combat.js:130-215`) | DIFFERENT-DESIGN | Proto23 readable, YAIRPG busier |
| Hit chance | linear AGL ratio +5 (10578) | piecewise curve (`combat_math.js:1-24`) | SIMILAR-DIFFERENT-TUNING | Proto23 can exceed 100% |
| Damage | subtractive with affinities (10488-10529) | rolled power minus armor (`combat_math.js:29-38`) | DIFFERENT-DESIGN | Proto23 gear shaped by affinities |
| Crit | fullness- and luck-scaled (10506) | flat rate, 1.3x (`stat_haver.js:29-30`) | DIFFERENT-DESIGN | Proto23 crit is a status mechanic |
| Block/dodge | body-part target, flat dodge (10432, 10457) | separate block and evade rolls (`combat.js:320-360`) | SIMILAR | Both have shield and evasion skills |
| Throw | `tattack` (10473) | none found | PROTO23-ONLY | Cheap ranged option |
| Equipment wear | durability per hit (10463) | quality/tier only | PROTO23-ONLY | Soft maintenance loop |
| Death | energy loss + death item, home (7348) | unconscious + XP debuff (`main.js:3223`) | SIMILAR | No gear loss either way |
| Storage | trunk with hooks, no cap (11331-11452) | staged chest transactions (`native_storage_transaction.js`) | SAME / YAIRPG-ONLY | Same player action |
| Furniture | counted list, home rating, hotkeys (11210-11242) | housing unlock + fork world furnishings (`proto23_world_content.js`) | SIMILAR | Fork already carries the concept |
| Message log | one log, cap, freezes (10296) | typed filters (`display.js:767+`) | SIMILAR-DIFFERENT-TUNING | YAIRPG easier to scan |

---

## 7. Gaps and unknowns

- **UNKNOWN**: sleep recovery numbers, `effect.slep` mods beyond display (effect tables are outside the range), exact `canScout`/`onScout` contents, jobs other than the gate guard, what `onTIn`/`onTOut` do for specific items, which items set `ckfre` (fire source) besides the fireplace (L12300-12330 shows fireplace fuel use; read only as context), and whether the shop's `data.gets` flag is read elsewhere.
- **Not read for this report**: YAIRPG fork modules `energy_resources.js`, `field_workshop.js`, `crafting_component_filling.js`, `crafting_visibility.js`, `audited_workshop_*`, `village_*`, `combat_stances.js` internals, `market_saturation.js` curves beyond constants. Their classification as "fork additions" is by filename only.
- **Counted by grep, not exhaustively read**: YAIRPG's 147 recipe constructors and 24 + 12 cooking and alchemy item recipes.
- **Possible Proto23 bugs recorded as SHOWN, not as intent**: Steak level gate uses exact equality (L8580); General Store and Herbalist restock timers set `.time` instead of `.data.time` (L8942, L8951); `dfl` unused; `offline_a` never called; monsters use the player's energy and flat crit bonus in their crit formula (L10506); the combat tick at L13853 passes the result of `fght(...)` into `setTimeout` instead of the function, so the round runs immediately once per tick (same observable cadence).
- **Verification state**: this is a source read only. Nothing was run in a browser; numbers computed from formulas (reputation discount percentages, Roasted Meat and Bread success rates) are derived by hand and labeled INFERRED. No YAIRPG code was changed.
- **Sealed secrets**: not touched by this reader.

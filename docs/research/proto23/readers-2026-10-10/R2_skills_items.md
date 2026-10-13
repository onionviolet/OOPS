# R2: Proto23 skills and items vs YAIRPG

2026-10-13 correction: the “first XP” reveal claim in 1.1 below is incorrect.
The insertion into `you.skls` is inside `giveSkExp`'s level-up branch, so the
default skill appears at level 1 after 51 XP. The historical wording is retained;
[exact-function proof and current adoption map](../SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md)
own the correction and supersede this report's dated fork-absence claims.

Coverage: Proto23 `index.html` (rev e93a8cd) lines 1700-5595 read in full with the Read tool (skills 1691-2183, Item constructor and items 2189-5588, quest/giveQst tail 1600-1700 for context). Outside-range helpers read to resolve calls: `giveSkExp` 13747, `giveExp` 13734, `giveTitle` 13760, `canRead` 13796, reading timer `chss.trd.sl` 12676-12691, `giveItem` 10917, rot planner 14122-14138, player `efficiency()` 7321, `mods` 7322, weapon-skill XP in the hit loop 10432-10477. YAIRPG side: `src/models/skill.js`, `src/data/skills.js`, `src/items.js` (Book/BookData 1093-1160, `book_stats` 1262-1400, consumables 4165+), `src/main.js` (reading 2362-2430, skill XP 3278, consumable use 4102-4150), `src/misc.js:47`, `src/active_effects.js`, `src/config.js`. There is no `src/character.js`; the character model is `src/data/character.js` (not studied beyond grep). Gear (`Eqp`, 5595+) belongs to another reader.

Labels: SHOWN = read directly in code at the cited line. INFERRED = reasoned from nearby code. UNKNOWN = not in my range or not found.

---

## 1. Skill engine (Proto23)

### 1.1 Skill object and XP curve
- `Skill()` fields: name, desc, exp, lvl (starts 0), type, `p` (EXP multiplier, default 1), optional `sp` font size, `expnext`, `onLevel`, `onGive`, `use` (1691-1702). SHOWN.
- Per-level cost: `round(50 + (lvl+1)^ln(9*lvl+1))` (1698). SHOWN. I computed it: L0 51, L1 55, L2 75, L3 151, L5 1,003, L8 12,470, L10 49,890, L12 168,277, L15 823,099, L20 about 7.5M. The exponent itself grows with level, so this is super-exponential (about 2x per level at L5-8, 1.35x per level at L12-15), not a fixed ratio. About 48k cumulative XP reaches L10.
- No level cap anywhere in the constructor or `giveSkExp`. UNKNOWN whether any cap lives outside my range (a grep for max-level terms found none). Skill data stops where milestone lists stop (highest milestone is L13, Gluttony 1887-1899).
- Level-up flow `giveSkExp(skill, exp, res)` (13747-13758) SHOWN: exp is multiplied by `skill.p` unless `res===false`; on overflow the skill's level goes up, `onLevel()` fires, the next cost is recomputed, any milestone with `lv===skill.lvl && !g` fires its `f()` and shows an "NEW PERK UNLOCKED" message, and leftover XP carries over through a recursive call with `res=false`. The first XP to a new skill adds it to `you.skls` with a "New Skill Unlocked!" toast (13752), so skills are discovered by first XP. `onGive(exp)` fires on every gain (used by the absorption skills to accumulate Ki, 2046 etc.).
- `p` is the single tuning lever. Books add to it (`+.05`, `+.15`), and many milestones add to *other* skills' `p` (cross-skill XP webs). It never decays and is additive (0.05 steps) with no cap seen.
- Milestone objects: `{lv, f, g:false, p:"text"}`; `f` is a free closure, so rewards are arbitrary: flat stat adds (`you.stra/agla/inta/hpa/sata/spda/luck`), `exp_t` (global character-EXP multiplier), `mods.sbonus` ("Energy Effectiveness"), `mods.cpwr` (crit damage), `res.ph` (resistance), `ccls[]`/`cmaff[]` (class/element defence), `aff[0]` (ATK), `stat_p[]` (training potential for HP/STR/AGL), title grants, recipe grants, action unlocks.

### 1.2 Catalog of all 60 skills (ids 101-160)
Type codes (from `.type`): 1 combat mastery, 2 combat util, 3 combat/perception, 4 life/body, 5 crafting, 6 resistance, 7 ki absorption, 8 gathering, 9 misc, 10 leisure. These are UI-grouping labels (INFERRED, the grouping UI is outside my range).

| id | key | name | type | what trains it | use() / effect | milestones | lines |
|---|---|---|---|---|---|---|---|
| 101 | fgt | Fighting | 1 | every player attack gives `def.rnk` XP (10434) | dmg bonus = STR x lvl x 2% (1707) | 9: L2 EXP+2%; L5 STR+1 + title; L8 EXP+2%; L10 EXP+5%, Energy Eff +1%, title; L11 all masteries `p`+10%; L12 STR+1, War `p`+5%, title; L13 AGL+2; L14 EXP+6%; L15 EXP+8%, masteries `p`+10%, title | 1704-1717 |
| 102 | unc | Unarmed M | 1 | hit with fists, 1 XP (0.5 if weapon broken) (10443) | +6% STR per lvl when unarmed (1724) | 5: STR/AGL, EXP, Eff +2%, Fighting `p`+3% at L11 | 1720-1730 |
| 103 | srdc | Sword M | 1 | hit with sword | +5% STR per lvl (1735) | 6 (L1,3,5,8,10,11) | 1731-1742 |
| 104 | knfc | Knife M | 1 | hit with knife | +5% STR/lvl; L10 crit dmg +10% | 6 | 1744-1755 |
| 105 | axc | Axe M | 1 | hit with axe | +5% STR/lvl; L5 HP+30 blunt DEF+1; L10 STR training potential +5% | 6 | 1757-1768 |
| 106 | plrmc | Polearm M | 1 | hit with spear | +5% STR/lvl; L5 pierce DEF+1; L10 phys resist +1% | 6 | 1770-1781 |
| 107 | hmrc | Hammer M | 1 | hit with hammer | +5% STR/lvl; L10 STR+3, EXP+3% | 6 | 1784-1795 |
| 108 | stfc | Staff M | 1 | UNKNOWN | +5% INT/lvl (1801) | none | 1797-1801 |
| 109 | shdc | Shield M | 1 | calling `use` gives XP to itself (1807) | +5% STR, +3% INT per lvl | 6 (L2,4,5,8,10,11): HP+12, +30, Pain Resist `p`, Fighting `p`+8% | 1803-1814 |
| 110 | sleep | Sleeping | 4 | 1 XP per sleep tick x `sq` (bed quality) (1819); slumber pill gives 0.1 per minute for 18 hours (2435) | sleep heal = 5 x lvl x bed quality | 10 (L2-12): mostly HP +2 to +50 per level, L5/L9 Patience `p`, L10 Death `p`, titles | 1816-1830 |
| 111 | seye | Sharp Eye | 3 | UNKNOWN | crit chance +0.3%/lvl | 7 (L1-8): crit dmg, Perception `p`, Evasion `p`, War `p`, all masteries `p`+5%, phys ATK+5 at L8 | 1832-1843 |
| 112 | pet | Patting | 10 | petting animals (UNKNOWN trigger) | "makes animals love you" | 8: Luck+1, HP+33, Beast class DEF+3, EXP+10%, INT+3 | 1845-1857 |
| 113 | walk | Walking | 4 | 1.5 per step when `sat>0`, else 0.5 (9002); 0.25 per location move (11461) | none | 9 (L1-10): L1 unlocks the "demo" action, HP and SAT (energy cap) every level, EXP+3/3/6%, SPD+1 at L10, titles | 1859-1872 |
| 114 | dice | Gambling | 10 | rolling dice item (5770), pinecones (4962) | none | 2: Luck+1, AGL+2 | 1874-1881 |
| 115 | glt | Gluttony | 4 | every food item calls `skl.glt.use(n)` for n XP (n = 1 to 100 per food, see section 3) | none (returns lvl) | 13 (L1-13): every level +5 to +25 SAT cap and +5 to +70 HP; L4/L9 Survival `p`; L10 "EXP +13%" | 1883-1899 |
| 116 | rdg | Literacy | 4 | 1 XP per reading tick (12683) | reading time divisor (section 4) | 4: INT+1, EXP+2/2/3%, titles | 1901-1909 |
| 117 | cook | Cooking | 5 | UNKNOWN (cooking action not in range) | lowers failed-product chance | 2: L1 recipes roasted meat + scrambled eggs, INT+1, AGL+1; L2 recipes boiled carrot + bone cracker, STR+1, EXP+5% | 1911-1919 |
| 118 | mdt | Meditation | 4 | 0.0065 x (1+Patience lvl x .15) per idle tick, doubled with incense (13866) | none | none | 1921-1924 |
| 119 | crft | Crafting | 5 | UNKNOWN | autocraft speed | none | 1926-1929 |
| 120 | alch | Alchemy | 5 | UNKNOWN | none | 1: INT+1, recipe lesser healing potion | 1931-1935 |
| 121 | thr | Throwing | 2 | throwing pebbles / clay caps (4971, 5036) | throw delay shrinks (`500/lvl` ms), dmg +5/lvl | none | 1937-1940 |
| 122 | bwc | Ranged M | 1 | UNKNOWN | +5% STR/lvl | none | 1942-1946 |
| 123 | ntst | Nightsight | 3 | `use` gives XP | lessens dark hit penalty (hit x (.3+.07 lvl)) (10435); lvl 12 = see in the dark (13909) | none | 1948-1951 |
| 124 | evas | Evasion | 3 | UNKNOWN | dodge | none | 1953-1956 |
| 125 | gred | Greed | 4 | UNKNOWN | flag only | none | 1958-1961 |
| 126 | dngs | Danger Sense | 3 | UNKNOWN | less crit damage taken | 5: EXP, Pain Res `p`, Fighting `p`+10%, Evasion `p`+10%, Sharp Eye `p`, titles | 1963-1972 |
| 127 | painr | Pain Resistance | 6 | taking damage (919: 170 per hit, 300 on death) | damage reduction 0.4%/lvl | 4 | 1974-1982 |
| 128 | poisr | Poison Resistance | 6 | poison ticks (1024, 1050) | avoid-poison chance 1%/lvl | none | 1984-1987 |
| 129 | fdpnr | Survival | 4 | each food-poison tick (1171) | less energy lost to food poisoning | 7 (L1-8), +STR, +HP100 (text), Elusion `p`+15% | 1989-2000 |
| 130 | war | War | 3 | UNKNOWN | crit dmg 0.5%/lvl | none | 2002-2005 |
| 131 | stel | Stealing | 3 | UNKNOWN | 5%/lvl | none | 2007-2010 |
| 132 | dth | Death | 4 | dying (919: 100 XP) | less energy lost on death | 6 (L1,3,5,7,9,10) | 2012-2022 |
| 133 | rtr | Elusion | 3 | UNKNOWN | escape | none | 2024-2027 |
| 134 | fmn | Famine | 4 | UNKNOWN | raises the low-energy efficiency floor (`efficiency()` 7321) | 6 (L1-10) | 2029-2039 |
| 135-140 | abw/abf/aba/abe/abl/abd | Water/Fire/Air/Earth/Light/Dark Absorption | 7 | standing wet / by fire (1188, 1203); Ki gain via `onGive` | `onLevel`: element defence `cmaff[k] += ceil(lvl/3+1)` | none | 2041-2081 |
| 141-143 | hvt/glg/mng | Foraging / Geology / Mining | 8 | UNKNOWN | lvl read by gather code | none | 2083-2096 |
| 144-145 | mntnc/rccln | Maintenance / Temperance | 9 | UNKNOWN | repair / resist greed | none | 2098-2106 |
| 146 | bledr | Bleeding Resistance | 6 | bleeding ticks (1257) | bleed damage -1%/lvl | none | 2108-2111 |
| 147 | twoh | Two Handed M | 1 | `use` gives 1 XP | dmg +1.25% STR/lvl (10373) | none | 2113-2117 |
| 148 | trad | Trading | 3 | UNKNOWN | shop prices shift 0.5%/lvl; `onLevel` rebuilds shops | none | 2119-2123 |
| 149-150 | swm/dssmb | Swimming / Disassembly | 3 | UNKNOWN | dssmb scales deconstruct yield (`am*(1+q*lvl)`, 13824) | none | 2125-2133 |
| 151 | tghs | Toughness | 2 | UNKNOWN | `onLevel` phys defence `cmaff[0] += ceil(lvl/3+1)` | none | 2135-2139 |
| 152-156 | drka/tpgrf/ptnc/scout/jdg | Drinking / Topography / Patience / Perception / Judgement | 4 | Drinking from alcohol (section 3); Perception from scouting (13814) | scout chance x(1+.15 lvl) (13816) | none | 2141-2164 |
| 157 | tlrng | Tailoring | 5 | `use` | none | none | 2166-2169 |
| 158 | crptr | Corruption Resistance | 6 | corruption ticks (1359) | corruption dmg -5%/lvl | no `use` defined | 2171-2173 |
| 159 | hst | Harvesting | 8 (bug: sets `skl.hvt.type` at 2175) | UNKNOWN | area loot chance | none | 2175-2178 |
| 160 | coldr | Cold Resistance | 6 | cold ticks (1376, 1414) | less energy loss when cold | none | 2180-2183 |

Counts: 60 skills; 22 have milestone tables; 8 have `onLevel` hooks (6 absorptions, Toughness, Trading). SHOWN.

### 1.3 Observations that matter for design
- Skill training is almost entirely incidental: you gain skill XP by doing the thing (hit, eat, walk, be hit, die, sleep, read, scout). There is no "train this skill" button in my range. SHOWN for the sources above, UNKNOWN for the rest of the "UNKNOWN" trains.
- Milestone rewards are the main character-power curve. They hit global `exp_t` (character EXP rate), flat stats, and other skills' `p`. `Fighting` L11 and L15 both raise *all* mastery `p` by +10% (1712, 1716).
- Two apparent typos change behavior: Gluttony L10 and Death L5 add to `you.eqp_t` (1896, 2018) while the text promises "EXP Gain"; every other milestone uses `you.exp_t`. INFERRED bug (reward is silently missing). Harvesting copies the Foraging `type` (2175).
- Food-poison skill Survival L6 text claims HP +100 but code adds STR+2 and a `p` boost only (1997). INFERRED text/code drift.

---

## 2. Item engine (Proto23)

- `Item()` has name, desc, eff, `data` (dscv, plus per-item `time/timep/finished/read` for books), amount, `type`, `stype` (inventory tab), `rar` (0 junk, 1 default, 2 uncommon, 3 rare, 4 epic-ish colour tier), new/have flags, `onGet`, `use` (2189-2203). SHOWN.
- Items are singletons with a stack count (`amount`), not instances (stackables), per `giveItem` (10934-10936). Equipment with a `slot` is copied per instance (10919-10926).
- Id ranges: 1-222 food/drink (id 64 unused), 3000-3035 medicine/boosters/tools, 5000-5065 misc/material/key/furniture-items, 9000-9027 books. Total: 341 `new Item()` in range. SHOWN by count.
- `onGet` is a *discovery trigger*: many materials grant a recipe when the stack reaches a threshold (Cure Grass 50 -> Healing Stew recipe 2223; Carrot 20 -> Boiled Carrot 2595; Raw Meat 5 -> Roasted Meat 2631; Lucky Clover 7 -> Clover Pin recipe 2314; Bandage 5 -> Medical Bandage 2342; Small Bone 50 -> doll recipe 4745; Straw 30/40/50 -> straw recipes 4760; Wood Splint 10/50 -> 4841; Firewood 60 -> Firewood Pile 4990; Thread 100 -> Yarn 5142; Wolf Fang 10 -> 5253; Assorted Grains 10 -> Wastebread 4661). The hook then replaces itself with a no-op.
- Spoilage: only 5 items carry `rot=[a,b,c,d]` (Bread 2579, Raw Meat 2629, Roasted Meat 2888, Rotten Meat 4703, Juice Pulp 4720). The rot planner adds `randf(rot[0],rot[1])/seasonMod` per tick; at >=1, a fraction `randf(rot[2],rot[3])` of the stack spoils and converts through `onChange` (Bread -> Spoiled Bread 2584; Raw Meat -> Rotten Meat 2638). Winter slows it, summer speeds it (14129-14135; `wmod` 0.5 in season 2, 2.5 in season 4, different table for home storage 14146). SHOWN.
- Sell value: NOT in my range (items have `val` only for food/heal amounts). UNKNOWN whether a global price table or per-shop pricing is used; no `price/sell` field matched in the grep.

### 2.1 Item category catalog

| Category | Count | Pattern / examples | Lines |
|---|---|---|---|
| Food and drink (ids 1-222) | 221 | `val` = energy restored, plus a hidden Gluttony XP amount. Range of `val`: 1 (Sugar, Wheat, Flour) to 100 (five named wines), 88 Giant Nigiri, 800 Kikatsugan (rar 4). Western staples 1-62, cooked dishes 15-68, Eastern/izakaya dishes (ramen, soba, sushi, yakisoba) 24-88 | 2566-4737 |
| Alcohol with Drunk | 14 | give Drinking XP and a Drunk effect with duration scaling by strength: Draft Beer 52, Cheap wine 55-60, Scotch 140, Premium Sake 380 (3057) | 2929-3057, 3673, 3803-3813, 3988-4010, 4184, 4733 |
| Spoiled / junk food | 8 | Spoiled Bread (40% food poisoning, 3 Gluttony XP at 17), Rotten Meat (45%), Bad Rice (75%), Rotten Onigiri (80%), Burnt Bread/Meat, Prison Food | 2706, 3377, 4569, 4701 |
| Medicine / healing (3001-3004, 3010, 3025-3028) | 9 | hp heal: Cure Grass 7, Healing Powder 16, Lesser Potion 50, Minor 450, Healing Potion 2,100, Major 7,900 (rar 2). Antidote cuts poison duration by 30; Stomach Medicine cuts food poisoning by 30; Bandage cuts bleed duration by 20 | 2214-2262, 2299-2306, 2459-2484 |
| Permanent boosters | 12 | Life Shard +2 max HP, Life Stone +25 HP, Life Drop +40 HP and HP-training potential +3%, Moonbloom +2 max SAT, Morgia +1 STR, Springsweed +1 SPD, Clearbane +1 INT, Drakevine +1 AGL, Asura Mushroom +5 STR (rar 4), Lucky Clover +1 LUCK (rar 4) | 2290-2297, 2344-2353, 2449-2457, 2486-2493, 2514-2552 |
| EXP pills | 4 | Low/Mid/High Spirit Pill = 500 / 2,500 / 15,000 character EXP; Spirit Opening Powder 95,000 EXP and `exp_t`+1% permanently (rar 2). Fei Pill is the failed-alchemy product: poison now, raw Ki later | 2263-2290, 2382-2390, 2505-2512 |
| Tactical consumables | 7 | Smoke Bomb skips current enemy and shrinks area size by 1; Monster Powder adds +5 to area size; Skeleton Vial summons a level-10 skeleton fight; Slumber Pill sleeps 18 hours instantly; Candle and Incense Stick apply timed effects (incense doubles Meditation and cultivation gain); Smoke Pellet Cluster clears the basement of pests | 2364-2437, 2554-2563 |
| Repair / thrown | 3 | Grey Whetstone repairs weapon durability (DP) +2; Pebble (+5 throw dmg) and Clay Milk Cap (+9) thrown in combat, throw delay `500/Throwing lvl` ms | 2321-2329, 4966-4973, 5031-5038 |
| Currency | 6 | Penny/Nickel/Dime/Quarter/Large Copper Coin turn into wealth 1/5/10/25/20 (5004-5008); Woven Wallet opens the money UI and spawns coins (4937-4947) | 4776-4947 |
| Materials / misc (stype 5) | about 40 | Small Bone, Salt, Slime, Tea Leaves, Coal, Charcoal, Rope (knot-tying flavour with a 140-name list, 5021-5029), Skull, Essences of the six elements (rar 2), Toolbox (enables deconstruction), Corpse Dust, Cheap Cloth, Thread, Bait, Wolf Fang, Stardust | 4739-5282 |
| Keys / quest props | 12 | 7 coloured keys (empty desc), Rusty Key (home basement), Travel Permit, Hunter's Crate/Bag, Herbalist's Satchel, Tattered Painting, Teruterubozu | 4880-4955, 5195-5234 |
| Furniture-as-item | 8 | carry-to-place items bound to `furniture.*`: Straw Basket, Wooden Tableware, Ragwork Blanket, Straw Pillow, Yarn Ball, Firewood Pile, Plain Bed, Book (5056-5262) | 5056-5262 |
| Cat gifts | 2 | Dead Mouse, Dead Bird (rar 0) | 5265-5280 |
| Books and manuals (9000-9027) | 28 | see section 4 | 5284-5586 |

Food `val` values are small in the same units as `satmax` (energy), and the milestone tables of Walking and Gluttony keep adding to that cap (SAT +5 to +25 each level). So food growth is meant to scale alongside the cap rather than exceed it. INFERRED from 1865-1899.

### 2.2 How food works (exact)
- Every food `use` is the same pattern: `sat = min(sat + val, satmax)`, `skl.glt.use(n)`, `fooda++` (or `foodb++` for drinks), decrement stack, toast "Restored N energy" (e.g. Apple 2570-2574). SHOWN. About 220 copies of this code are in the file, so tuning is data-in-code.
- `skl.glt.use(n)` calls `giveSkExp(Gluttony, n)` and returns lvl (1886). The `n` is a hidden "how hard was it to eat" score: junk and strong food give the most (Kikatsugan 390 at 2674, Mebaspa Sandwich 66, Infernal Pepper Dumpling 62, Valens-type wines 100; Burnt Bread 12 for 4 energy, Spoiled Bread 17 for 8; Sugar 1, Carrot 1). So Gluttony levels *fastest by eating bad or huge food*. SHOWN.
- Gluttony in this range does not scale food restoration. Its payoff is milestone stat adds (+SAT cap, +HP). UNKNOWN whether outside code multiplies `val` by Gluttony level.
- Food poisoning chance per item is a literal `random()<p` followed by `giveEff(fpn, rand(15,35))` or extends it by `rand(5,25)`: Potato 10%, Raw Meat 15%, Fish 10%, Fish Fillet 5%, Spoiled Bread 40%, Acorn 40%, Rotten Meat 45%, Bad Rice 75%, Rotten Onigiri 80% (2603, 2634, 3191, 3201, 2711, 3001, 4705, 3382, 4574). Cooking removes it: Roasted Meat, Steamed Rice and Boiled Egg exist as the safe forms. 9 items carry it. SHOWN.
- The stomach-ache loop: poison ticks give Survival XP (1171); Survival milestones raise Pain, Poison, Gluttony `p` (1993-2000). Eating bad food is a deliberate training route.
- Efficiency ("energy effectiveness"): `efficiency = (.8-g)*sat/satmax + (.2+g) + sbonus` where `g = min(.6, Famine level x 1%)` (7321). Character EXP gain is scaled by `0.4 + 0.6*efficiency` (13735). So a full stomach nearly doubles EXP vs empty, and Famine moves the floor up. Hunger therefore drives progression speed directly. SHOWN.
- Alcohol: `giveSkExp(Drinking, x)` plus `drunk` effect duration `base`, extended by a smaller amount if already drunk (e.g. Premium Sake 150 XP, 380 min / +190, 3057-3058). Some pure-flavour wines (Valens etc.) have no Drinking XP or effect, only 100 energy and 100 Gluttony XP (2949-2994). SHOWN.
- Aspha Herb: eating attempt succeeds only at 0.5% chance (rar 2); on success grants Gluttony XP `rand(100, 355*(lvl*.2+1))` and reduces sat to 20% (2360-2362), a "diet vegetable" gag and a Gluttony grind route. 200 ms self-debounce. SHOWN.

---

## 3. Books and manuals (Proto23)

### 3.1 Reading mechanic
- Start: `use()` on a book calls `canRead()` (13796): blocked in battle ("too dangerous"), while already reading, working, busy, in a shop, or sleeping. Otherwise it launches `chss.trd.sl(book)` (12677). SHOWN. (Note `global.flags.civil.btl` at 13797 reads a property of a boolean, so the in-battle check never fires. INFERRED bug.)
- The book keeps `data.timep` (elapsed minutes of reading, persistent across Stop/resume) and `data.time` (base minutes; HOUR constant is 60, line 171). Each real second (1 s timer) is one game-minute tick: `timep++`, `giveSkExp(Literacy, x||1)` where `x` is the per-book XP rate passed by the book (0.2 for Idea paper, 0.5 for P-skillbooks, 1 default) (12683). SHOWN.
- Required time: `cmax = time * (1/(1+lit/10)) / rdgrt - ((1/(1+lit/10)) - 1)/rdgrt` where lit is Literacy level and `mods.rdgrt` is a reading-rate modifier (12678). So each Literacy level shaves about 1/(1+lvl/10): L5 reads in 67% of base time, L10 in 50%, and `rdgrt` multiplies on top. Display shows hours or minutes to finish. SHOWN.
- On finish: `b.use()` runs the payoff, `reduce(b)` removes the book, `timep` resets (12687). Most books spawn a generic `Book` furniture item (`bookgen`, 5256-5263) when finished, i.e. read books can be placed at home (bookshelf count mechanic). SHOWN.

### 3.2 Book catalog (28 items)

| id | name | base read time | payoff | lines |
|---|---|---|---|---|
| 9000 | "Idea paper" | 1 h | unlock 4 recipes (straw, healing powder, steamed rice, boiled egg); Literacy XP rate 0.2 | 5284-5292 |
| 9001-9006 | P Skillbooks (Swords, Knives, Axes, Spears, Hammers, Martial) | 4 h | +150 mastery XP, mastery `p`+5%; Literacy rate 0.5 | 5294-5347 |
| 9017-9022 | Manuals (Bladesman, Assassin, Axeman, Lancer, Clubber, Brawler) | 14 h | +3,250 mastery XP, `p`+15% (Axeman manual 9019 grants only 150 XP and +5%, code copy of tier-1: INFERRED bug 5502) | 5477-5535 |
| 9007 | "Animalis Vicipaedia" (rar 2) | 17 h | unlocks Bestiary tab (`flags.bstu`) | 5349-5357 |
| 9008 | "The Art of Teabrewing" (rar 2) | 26 h | recipe Tea | 5359-5367 |
| 9009 | "Book of Fairy Tales" | 6 h first, then re-randomized 2-10 h | random character EXP 500-10,000 first read (then 500-5,000), random flavor blurb from 19 lines; repeatable reward book | 5369-5396 |
| 9010 | "Cooking with Poison" (rar 2) | 30 h | no payoff in code (flavor only, only spawns bookgen) | 5398-5406 |
| 9011 | "First Aid Manual" | 12 h | recipes bandage, medical bandage, lesser healing potion | 5408-5417 |
| 9012 | "Dollmaker's Handbook" | 12 h | five doll/yarn recipes | 5419-5428 |
| 9013 | "Ragged Parchment" | 3 h | recipe lesser healing potion | 5430-5439 |
| 9014 | "Rotten Illustration" | 2 h | recipe sharpened stick | 5441-5451 |
| 9015 | "Pamphlet" | 3 h | unlocks marketplace location (`mkplc1u`) | 5453-5462 |
| 9016 | "Guide To Living By Yourself" | 12 h | 9 recipes (boiled carrot, bone cracker, healing stew, roasted meat, scrambled eggs, jelly sandwich, apple juice, blanket, pillow) | 5464-5475 |
| 9023 | "Your First Bread" | 7 h | recipes flour, dough, bread | 5537-5546 |
| 9024 | "Beggar Fashion" | 4 h | recipes patch pants, patch coat | 5548-5557 |
| 9025 | "Property Deed" (rar 2) | 30 min | unlocks the home inventory view | 5559-5567 |
| 9026 | "Street Fighting" | 6 h | Fighting `p` +15% | 5569-5577 |
| 9027 | "Empty Journal" | 4 h | unlocks Journal tab | 5579-5586 |

Total: 28 books. Books are **progression gates and recipe teachers** first, flat XP/`p` boosters second. Several unlock *UI features* (Bestiary, Journal, Home view, Marketplace). Payoff is per-book code, no shared data model. Reading time spans 30 min to 30 h; repeating a skillbook keeps stacking `p` (no one-time guard seen in the item, since the book is consumed; sources of duplicates UNKNOWN).

---

## 4. YAIRPG equivalent and difference per system

### 4.1 Skill engine
- YAIRPG: `src/models/skill.js` `Skill` class (constructor 18-100), data in `src/data/skills.js` (69 `skills["..."]` entries incl. tool/fork skills; base game about 55), XP added through `add_xp_to_skill` in `src/main.js:3278` and `Skill.add_xp` (`models/skill.js:175`).
- Curve: geometric. Total XP to level n = `base_xp_cost * (1 - s^(n+1)) / (1 - s)`, default base 40, s 1.8 (`skill.js:22,30,204`). Per-level cost is about 40 x 1.8^L, so L10 about 14k, L15 about 270k (my arithmetic, not read from a table). Cooking/Alchemy use s=1.5, Sleeping base 1000, s 2 (`skills.js:2200-2215, 1269-1280`). Hard `max_level` (default 60, Literacy 10, Gluttony 30, Sleeping 10).
- Per-hit XP is capped at 10% of the next level's XP (`config.js:29`), so grinding by one large dump is disallowed (crafting 25%, `config.js:30`). Proto23 has no such cap; a 150,000-XP book or 390-XP junk meal dumps straight in. DIFFERENT-DESIGN.
- Rewards: YAIRPG milestones are declarative data (`stats` flat/multiplier, `xp_multipliers`, `unlocks`), applied through `get_bonus_stats` (`skill.js` ~170 region); Proto23's are free closures with text written by hand. Plus the whole-skill multiplier `max_level_coefficient` (e.g. Swords x8 at L60, `skills.js:972`) gives a smooth passive scale that Proto23 lacks. Proto23 instead has per-level linear effects in `use()` (+5% STR per level). SIMILAR-DIFFERENT-TUNING.
- Cross-skill XP web: YAIRPG has `xp_multipliers: {hero, all, all_skill, "<skill>": x}` including parent skills (`parent_skill`, `parent_multiplier`, `Weapon mastery`/`Gathering mastery`/`Crafting mastery`); Proto23 uses additive `p` bumps on named skills, and no parents. Same idea (milestone feeds other skills) in different form. SIMILAR-DIFFERENT-TUNING.
- Discovery: Proto23 reveals a skill on first XP; YAIRPG has `visibility_treshold`, `is_unlocked`, `xp_gain_conditions`. SIMILAR. Fork modules `skill_discovery.js`, `skill_discovery_native.js` and `skill_expansion_*.js` extend discovery/expansion (read-only presentation of owner snapshots; I did not read them in depth).

**Per-skill mapping (what exists where)**

| Proto23 skill | YAIRPG equivalent | Class |
|---|---|---|
| Fighting | "Combat" (`skills.js:28`) | SIMILAR (YAIRPG multiplies AP; P23 adds STR-scaled damage) |
| Sword/Axe/Hammer/Polearm/Knife/Staff/Unarmed M | Swords, Axes, Hammers, Spears, Daggers, Staffs/Wands, Unarmed (`skills.js:931-1170, 270`) under "Weapon mastery" | SIMILAR; P23 has no parent and no Wands |
| Two Handed M, Ranged M, Shield M | Shield blocking (191) only | P23-ONLY (Two-handed, Ranged); Shield SIMILAR |
| Sleeping | Sleeping (1269) | SIMILAR: both raise HP on sleep; P23 HP flat per level, YAIRPG healing multiplier + max HP at even levels |
| Meditation | Meditation (1354), `is_unlocked:false` | SIMILAR |
| Walking | Running (1464) | SIMILAR-DIFFERENT (P23 grants HP/SAT; YAIRPG stamina) |
| Gluttony | Gluttony (2661) | DIFFERENT-DESIGN: YAIRPG multiplies food effect; P23 trains by eating hard food and grants cap+HP |
| Literacy | Literacy (2539), max 10 | SIMILAR; YAIRPG gives all-XP multipliers, P23 gives reading speed + small stats |
| Cooking, Alchemy | Cooking, Alchemy (2200-2215) | SIMILAR; P23's Cooking lowers failure chance, YAIRPG's has no failure |
| Crafting, Tailoring | Crafting, Woodworking, Smelting, Forging (2155-2260) | SIMILAR; Tailoring P23-ONLY |
| Pain Resistance, Toughness, Bleeding/Cold/Poison Res | Fortitude, Iron skin, Cold resistance (889-896), Poison resistance (2583), Heat resistance | SIMILAR; Bleeding and Corruption resist P23-ONLY (YAIRPG fork may cover in effects, not checked) |
| Perception, Sharp Eye, Danger Sense, Nightsight | Perception (2470), Night vision (538), Spatial awareness/Presence sensing | SIMILAR |
| Evasion, Elusion | Evasion (122), Scrambling | SIMILAR |
| Foraging, Mining, Geology, Harvesting | Herbalism, Mining, Digging, Woodcutting (1955-1995), Gathering mastery | SIMILAR; Geology P23-ONLY |
| Trading | Haggling (2930) | SIMILAR |
| Throwing | none found | P23-ONLY (YAIRPG keyword search for "throw" found only fork modules, not a base skill) |
| Patting (pets), Gambling, Drinking, Greed, Temperance, Judgement, Topography, Patience | none in base (Animal handling 1995 is gathering) | P23-ONLY |
| Six Ki Absorption skills | none | P23-ONLY (fits cultivation/element worlds) |
| Death, Famine, Survival (food-poison), Stealing, War, Disassembly, Maintenance | none | P23-ONLY (YAIRPG has a fork "death" system in other modules; not compared here) |
| Weight lifting, Climbing, Swimming, Equilibrium, Breathing, Regeneration, Farming, Butchering, Medicine, Giant slayer, Pest killer, Heavy strike family | YAIRPG-ONLY (Swimming exists in both) | YAIRPG-ONLY |

Play-feel consequences:
1. Proto23 levels are slower late and sharper early. A fresh skill pops in seconds (L1-3 about 50-150 XP each), so the first hour is a stream of "NEW PERK" toasts. YAIRPG's early levels cost about 40 to 130 XP and a cap on single gains slows dumping.
2. Proto23 has no skill cap; the formula blows past 100M XP by about L25. YAIRPG's `max_level` plus `max_level_coefficient` yields a visible endpoint.
3. Because Proto23 rewards are a closure per level, every milestone is custom and flavourful (a title, a recipe, a stat); YAIRPG's declarative form is safer for the fork's save/migration rules (AGENTS.md "persistence") but less varied.

### 4.2 Titles
Proto23 skill milestones call `giveTitle` (13760) freely; titles also push talents (`title.talent`). YAIRPG has no base title system in `skills.js`; fork modules exist for identities/rewards (UNKNOWN which). Not a core skill-system equivalent. Class: PROTO23-ONLY (as skill reward).

### 4.3 Item engine and food
- YAIRPG: `Item` classes in `src/items.js` (Book 1114, UsableItem, OtherItem, Weapon/Armor/etc.), 334 `item_templates[...]` entries, usage via `use_item` (`main.js:4102`). Item `value` is the shop price, not a restore number. Foods are `UsableItem` with `effects: [{effect: "Basic meal", duration: N}]` and `tags: {food: true}` (`items.js:4165-4200`). The "Basic meal" effect is a timed stamina-regeneration buff (+0.5 flat, `active_effects.js:114-122`). Food poisoning is a timed effect (`active_effects.js:270`). Cooked food has a longer duration (Cooked carrot 150 vs Carrot 10).
- Gluttony linkage: `misc.js:47` maps `Gluttony -> "food"` tag; `main.js:4136-4140` gives XP `(value/10)^0.6667` per use. So YAIRPG trains by price, not by a hand-picked per-food number. Gluttony then multiplies *additive effects of foods by value squared and multiplicative ones by value* (`skills.js:2661-2672`).
- Difference: **instant refill vs timed buff**. P23 food restores energy at once (`sat += val`, clamped to `satmax`), and energy drives EXP rate (13735, 7321). YAIRPG food never restores a bar instantly; it adds stamina regeneration over time. The food ladder (Sugar 1 to Kikatsugan 800) in P23 is a stat-sheet progression; in YAIRPG it's a duration ladder. DIFFERENT-DESIGN. Play-feel: P23 eating is a loud, constant micro-economy where hunger throttles EXP, so many cheap foods and a "feed it constantly" idle loop; YAIRPG stamina buffs favour a handful of recipes.
- Quantity: P23 has 221 foods and drinks vs YAIRPG about 30 food-tagged `UsableItem`s. P23's long tail is mostly Japanese restaurant dishes with near-identical code; low design value but a strong "world has a lot of stuff" texture. PROTO23-ONLY (volume).
- Spoilage: Proto23 rots 5 foods on a timed planner, winter vs summer (14129). A keyword search of `src/` for spoil/rot/decay found nothing in the base game or fork module names, only text in `data/locations.js` and book prose. PROTO23-ONLY.
- Alcohol and Drunk: P23 has 14 drinks with Drinking skill. YAIRPG: "drunk" appears only as text in `data/locations.js`; no Drinking skill or Drunk effect. PROTO23-ONLY.
- Medicine: YAIRPG medicine is `tags: {medicine: true}` UsableItems giving timed regen effects (Healing powder 240-300 min, Healing potion 10 min burst, `items.js:4210-4260`) and trains the Medicine skill (value-scaled XP). P23 medicine is instant HP (7 to 7,900) plus status cures (Antidote -30 poison, Stomach Medicine -30 food poisoning, Bandage -20 bleed). SIMILAR-DIFFERENT-TUNING. YAIRPG fork `field_care_content.js` handles bandage-like care. Antidote/bleed/poison cures: YAIRPG-lacking (no "Antidote" item found) apart from fork modules (UNKNOWN).
- Permanent boosters (Life Shard, Morgia, Springsweed, Clearbane, Drakevine, Asura Mushroom, Lucky Clover, Moonbloom): no base-YAIRPG equivalent. The fork has "permanent" language in `feature_expansion_book_cultivation.js` and `audit_remainder_*` modules; I did not read them. Class: PROTO23-ONLY at base-game level; potential fork overlap UNKNOWN.
- EXP pills (Spirit Pills 500/2500/15000/95000): YAIRPG has no flat character-XP consumable in the base. PROTO23-ONLY. Proto23's "Book of Fairy Tales" random-EXP book likewise.
- Tactical consumables (Smoke Bomb, Monster Powder, Skeleton Vial, Slumber Pill, Candle, Incense, Whetstone, thrown pebbles): none in YAIRPG base or fork by keyword search (smoke bomb, incense, whetstone: no hits). PROTO23-ONLY. They interact with area size and enemy count (area sectors have a `size`), which YAIRPG's location model does not mirror, so porting requires a combat-encounter design decision.
- Keys, coins, wallet: YAIRPG has money as a number plus `OtherItem` quest items. PROTO23-ONLY detail (coin items convert to wealth on use).
- Furniture-as-item: YAIRPG has fork home/furnishing content and `proto23_world_*.js` (see 4.5). SIMILAR via fork.
- Item rarity `rar`: Proto23 uses 0-4 for junk to epic, as color tier. YAIRPG items have `quality` for equippable and no rarity tier in `UsableItem` (UNKNOWN for fork). DIFFERENT-DESIGN.
- Discovery triggers (`onGet` at stack thresholds): YAIRPG teaches recipes through books, skills (`milestones.unlocks.recipes`) and location unlocks, not by hoarding stacks. PROTO23-ONLY, and a nice natural-discovery idea that matches the fork's "sealed discovery" ethos.

### 4.4 Books
- YAIRPG: `BookData` and `Book` (`items.js:1093-1160`), `start_reading` / `do_reading` (`main.js:2362-2430`), `book_stats[...]` (1262-1400, 12 base books + fork books). Reading is a progress bar; Literacy XP per tick is `literacy_xp_rate` (1 to 6); payoff is permanent **XP multipliers** (`all: x1.2`, `Combat: x1.5`, `Evasion: x1.5`) plus rewards (recipes, skills, skill XP, activities). A code comment confirms reading speed does **not** scale with Literacy (`items.js:1135` "maybe make it go faster").
- Difference:
  - Reading time: P23 divides time by `1 + lit/10` (and `rdgrt`); YAIRPG constant. DIFFERENT. Play-feel: Literacy in P23 directly saves hours of the 26 to 30 h books; YAIRPG's Literacy only boosts XP.
  - Unit: P23 4 h, 14 h, 30 h books (240-1800 min); YAIRPG 90 to 420 min with 4 to 12 books. SIMILAR-DIFFERENT-TUNING, P23 more extreme.
  - Payoff: P23 mastery books add `p`+5% (tier 1) or +15% (tier 2) and lump XP 150 or 3,250. YAIRPG gives x1.5 for specific skills. Both use "multiply the skill's XP rate". SIMILAR.
  - Unlock-style books (Bestiary, Journal, Pamphlet -> marketplace, Deed -> home view): YAIRPG books can unlock skills, recipes, activities (`BookData.rewards`); UI features are in fork modules. SIMILAR.
  - Repeatable randomized book (Fairy Tales: 500-10k EXP re-rolling blurbs and time): no YAIRPG equivalent. PROTO23-ONLY.
  - Book consumption: P23 consumes the book on finishing and returns a generic "Book" furniture item (5256); YAIRPG keeps the book as finished state and shows it in the anthology. DIFFERENT-DESIGN.
  - Fork coverage: `book_care_*.js`, `book_world_*.js`, `feature_expansion_book_*.js` extend books (care, world-bound effects, cultivation). Same idea space as skillbooks; none mirrors reading-speed scaling (a `reading_speed` grep found nothing).

### 4.5 Fork modules that already touch these ideas
- `src/proto23_world_*.js` (6 files, content 154 lines): an original village branch inspired by Proto23 (Village Center, Dojo, reading, counted furnishings), explicitly copying no source runtime, pupil, or assets (`proto23_world_content.js:4`). It does not port Proto23's skill tree, food list or books. Confirmed by size and by `grep` for Skillbook/Manual/Gluttony/Spirit Pill (1 hit only).
- `field_care_content.js`: bandage care. `skill_discovery*.js`, `skill_expansion_*.js`: skill presentation and expansion. `feature_expansion_book_cultivation.js`: contains "permanent" and "tea" wording. None checked in depth.

---

## 5. Comparison table (summary)

| System | Proto23 | YAIRPG | Class |
|---|---|---|---|
| Skill XP curve | `50+(L+1)^ln(9L+1)`, no cap | `base*s^L` geometric, cap 60 default, per-gain cap 10% | DIFFERENT-DESIGN |
| Skill rewards | free closures per milestone (stat, title, recipe, other skills' `p`) | declarative stats and `xp_multipliers`, plus `max_level_coefficient` | SIMILAR-DIFFERENT-TUNING |
| Skill count | 60 (22 with milestones) | 69 (about 55 base) | SIMILAR |
| Skill discovery | first XP creates it | visibility threshold and `is_unlocked` | SIMILAR |
| Weapon masteries | 7 + Two-handed + Ranged + Shield, +5%/lvl STR | 7 under parent "Weapon mastery", multiplicative coefficient x8 at max | SIMILAR |
| Gluttony | trained by hard food, gives cap+HP | trained by value, multiplies food effect | DIFFERENT-DESIGN |
| Ki Absorption x6, Patting, Gambling, Drinking, Greed, Throwing | exist | none | PROTO23-ONLY |
| Food | 221 instant-restore foods, hunger throttles EXP | about 30 timed-buff foods | DIFFERENT-DESIGN |
| Spoilage | 5 rotting foods, seasonal | none | PROTO23-ONLY |
| Alcohol and Drunk | 14 drinks, Drinking skill | none | PROTO23-ONLY |
| Medicine | instant HP and status cures | timed regen effects, Medicine skill trained by value | SIMILAR-DIFFERENT-TUNING |
| Permanent boosters | 12 | none in base | PROTO23-ONLY |
| EXP pills | 4 (500 to 95,000) | none | PROTO23-ONLY |
| Tactical consumables | 7 | none | PROTO23-ONLY |
| Books | 28, 0.5 to 30 h, Literacy shortens | 12 base books, constant time, multiplier payoff | SIMILAR-DIFFERENT-TUNING |
| Rare/rar tier | 0-4 colour | none on usables | DIFFERENT-DESIGN |
| Stack-threshold recipe discovery | `onGet` hooks | recipes from books and skill milestones | PROTO23-ONLY |
| Items vs equipment | stackable singletons; gear copies | stackables via keyed inventory; gear instances with quality | SIMILAR |
| Sell/price values | UNKNOWN (outside range) | `value` field per item | UNKNOWN |

---

## 6. Gaps
- Sell prices and shop tables: not in lines 1700-5595. UNKNOWN. Needs the shop section reader.
- What trains a dozen Proto23 skills (Stealing, War, Evasion, Cooking, Alchemy, Crafting, Trading, Mining, Swimming, Greed, Sharp Eye, Staff, Ranged, Pet) lives in other ranges. UNKNOWN.
- `skl.*.p` stacking: no cap found, but I did not read player-state code to rule out a cap elsewhere.
- Equipment (`Eqp`, 5595+), recipes (`rcp.*`), titles (`ttl.*`), effects (`effect.*`) are other readers' ranges; I cite them only where a skill or item calls them.
- YAIRPG fork modules I only grepped, not read: `skill_expansion_*`, `skill_discovery*`, `book_care_*`, `book_world_*`, `feature_expansion_book_*`, `field_care_content.js`. A keyword grep cannot prove absence of an idea implemented under other names.
- YAIRPG character stat model (`src/data/character.js`) was not read; comparisons of "flat stat adds" to P23's `stra/agla/inta/hpa/sata` assume equivalent roles (strength, agility, intuition, max health, max stamina).
- I did not run either game; all play-feel statements are inferred from code and my XP arithmetic.

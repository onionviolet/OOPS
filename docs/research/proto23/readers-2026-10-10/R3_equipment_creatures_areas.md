# R3: Proto23 equipment, creatures, abilities, areas vs YAIRPG

Coverage: Proto23 `index.html` (rev e93a8cd) lines 5595-8335, every line read in 400-line chunks (Eqp constructor to the start of Recipe). Supporting functions read outside the range: `attack` 10428, `dmg_calc` 10488, `hit_calc` 10574, `fght` 10375-10427, `area_init` 10744, `mon_gen` 10763, `equip`/`unequip` 10819/10861, `lvlup` 13710, `giveExp` 13734, `dropC` 13656, `roll` 13675, `scoutGeneric` 13812, `disassembleGeneric` 13821, `planner.itmwear` 14160, `rand` 14423, mastery skills 1720-1800, `item.wstn1` 2321, `item.lsrd/lsstn` 2290/2486, `effect.snch` 1091. YAIRPG side read: `src/items.js`, `src/enemies.js`, `src/combat_math.js`, `src/combat_stances.js` (head), `src/models/location.js`, `src/data/locations.js` (grep), `src/main.js` (kill/clear paths), `src/models/combat.js` (xp lines), `src/data/skills.js` (weapon_type map). Labels: SHOWN = read in code, INFERRED = my reading of code, UNKNOWN = not determined. No runtime was executed. Source is read-only and not committed; all text below is paraphrase.

Scope note: this range is 90% data. The combat math that consumes it lives outside the range; I summarize only what is needed to say what the stats do.

---

## 1. Equipment: Eqp record (5595-5628)

One class (`Eqp`) serves every slot. SHOWN fields:

| Field | Meaning | Line |
|---|---|---|
| `str`, `agl`, `int`, `spd` | flat bonuses; weapon `str`/`int` is the damage term, others feed hit and speed | 5598-5601 |
| `dp`, `dpmax` | durability points, default 15 | 5602-5603 |
| `cls=[edge,pierce,blunt]` | class affinity: a weapon's attack bonus, an armor's resist, by attack class | 5606 |
| `aff=[phys,air,earth,fire,water,light,dark]` | seven-element affinity (comment on 5608 says p,a,e,f,w,l,d; creature comment 7405 says phy air eth fir wtr lgt drk) | 5608 |
| `atype`, `ctype` | the weapon's own element index and class index | 5612 |
| `wtype` | 0 unarmed, 1 sword, 2 axe, 3 knife, 4 spear, 5 club/hammer, 6 staff, 7 bow (UI names at 10099-10110) | 5613 |
| `slot` | 1 weapon, 2 shield, 3 head, 4 body, 5/6 hands, 7 legs, 8-10 accessory (10105-10120, 10864-10875) | 5619 |
| `rar` | 1-6, indexes a colour table `wecs` (187) and glow style in `equip` | 5615, 10834-10841 |
| `twoh` | two-handed: equipping unequips the shield (10831) | 5949 etc. |
| `eff[]`, `oneq`, `onuneq`, `onGet`, `onDegrade`, `degrade` | effect hooks; accessories carry nearly all special behavior as closures | 5604, 5623-5626, 5692-5696 |
| `dss` | disassembly yield list (7247-7255) | |
| `important`, `new`, `cond`, `req` | flags; `req` checked on equip (10821) | |

No random affixes, no per-item quality roll, no upgrade or enchant system in this range. Items are fixed-stat singletons (cloned inventory entries carry only `dp` and `data`, 349-352). Stat growth is by buying/crafting a better named item. Two "alive" weapon mechanics exist: Sword of Evolution (`evob`) and a kill counter (below).

### 1.1 Durability and repair (SHOWN, mostly outside range)

- Each player hit that lands drops the weapon's `dp` by .008 (10463); each enemy hit that lands drops the targeted armor piece and the shield by .008 each (10467). So a 15-dp stick lasts roughly 1,900 landed hits; a 99-dp weapon about 12,000.
- Durability scales damage: weapon `str` is multiplied by `dp/dpmax*.9+.1`, so a broken weapon still gives 10% (10497). Armor uses `.85+.15` (10498). Unarmed (id 10000) ignores the durability factor.
- Zero `dp` does not destroy gear. Only weapons with a `degrade` rate (torch, .03 per planner tick) are removed at zero (14160-14167), via `planner.itmwear` (10833).
- Repair: whetstone item gives +2 dp to the equipped weapon (2321-2327); skill "Maintanence" exists as a placeholder (2099). UNKNOWN: other repair routes in the crafting range.
- Disassembly (7247-7255, 13821-13830): returns components, scaled by `dp/dpmax` for equipment (`am/(2-c)`), plus per-level-of-skill bonus `q`.

### 1.2 Weapons, 57 declarations, 56 distinct keys (5630-6034)

`skknf` is declared twice (5721 Scramasax, 5781 Soul Kiss) so the first is overwritten; id 10012 is lost. Only 27 weapons carry real stats; about 30 are named-and-described stubs (no `str`, `slot` often unset, so 12 cannot even equip).

| Class (wtype) | Count | Real-stat examples (str / cls edge,pierce,blunt / dp) |
|---|---|---|
| Club/hammer (5) | 4 | Stick `stk1` 2 / 0,0,1 / 13 (5630-5636); Torch `trch` 2, fire +10, light +1, burns out, dp 10 at .03/tick (5685-5696); Log `log` 48, two-handed, AGL -15, blunt 6, dp 68 (5946-5953); Ekimnekuwa stub |
| Spear (4) | 3 | Sharpened Stick `stk2` 5 / 0,3,0 / 16, recipe unlock at 4 copies (5638-5648); Spear 11 / 2,4,1 / 26 (5955-5961); Guard Spear 27 / 2,5,2 / 44 (5963-5969) |
| Knife (3) | 19 | Wooden Knife 4 (5650-5656); Rusty Dagger 7, AGL -1, dp 11 (5658-5665); Dagger 11 / 4,2,0 / 22 (5707-5713); Kitchen Knife 24, +15% cooking XP (5902-5910); Shears 40, two-handed, AGL -11 (6004-6012); about 14 stubs (Battle Knife, Dirk, Kris, Stiletto, Jamadhar, Soul Kiss, Glacialdra rar3...) |
| Sword (1) | 17 | Rusty Katana 15, AGL -2 (5667-5674); Red Katana 42 (5676-5683); Wooden/Bamboo/Fake/Takemitsu swords str 7-35 with blunt-heavy cls (5818-5860); Short Sword 55 (5834-5840); Crappy Sword 40; Marked Wakizashi 40, rar 2, `important` (6036-6042); Scissor swords below; about 12 stubs (Heiyoto, Kotesaki, Cristo, Kuruma, Harusame, Kosugi, Shiran...) |
| Staff (6) | 1 | Dry Twig: INT 3, light +3, dark +5, `atkmode` 2 (magic damage path) (5698-5705) |
| Unarmed (0) | n/a | `eqp.dummy`; gets levelled cls/aff on lvlup (13729) and unequip (10865) |

Elemental/rare weapons: Red Hand str 54, cls 10,7,3, fire +25 water -35, rar 3, dp 75 (5971-5980); Blue Hand str 52 (5982-5991); Fate Cutters str 108, two-handed, dark +30, rar 4, dp 99 (5993-6002). Sword of Evolution: str 1 at start, rar 4; every kill adds a sliver of the victim's STR/AGL/INT to the sword and extends its `dp` (6014-6034). That is the one growth-by-kills weapon, via `callback.onDeath` attach/detach on equip.

Weapon-class mastery link (SHOWN, outside range): a successful player hit gives XP to the mastery skill matching `wtype` (10442-10450), at half XP if the weapon is at 0 dp. Each mastery's `use()` raises STR by `lvl*5%` (swords, knives, axes, polearms, hammers, 1720-1790), unarmed `lvl*6%`. Milestone perks at levels 1/2/3/5/8/10/11 grant flat stat, EXP-gain, titles.

Per-weapon kill counter: `you.eqp[0].data.kills` increments on each kill (7436). Used by display tooltips (UNKNOWN beyond that).

### 1.3 Armor, 31 pieces (6044-6374)

| Slot | Count | Examples |
|---|---|---|
| Head (3) | 14 | Bandana STR 3 dp 11; Neck Guard STR 7 phys 3 and -3 all else; Headguard STR 14 phys 5, others -4, dp 28; Junk Helmet STR 18 phys 8, others -5; Rain Cap water 14; Straw Kasa fire 13; Reed Hood fire 13; six elemental masks (below) |
| Body (4) | 7 | Linen Vest, Tunic, Burnouns STR 33 AGL -4 (fire/water/dark all high, light -15, dp 41), Overalls, Prison Uniform STR 40 cls 10,10,5, Prison Apparel (rar 2, AGL +5), Patchwork Coat |
| Hands (5) | 3 | Bandage (INT +3), Gauntlet STR 10, Knuckles (+4 unarmed STR via `undc` mod, 6336-6344) |
| Legs (7) | 7 | Dojo Pants, Sandals, Yukker (earth 15), Rain Shoes (water 14), Worker Shoes, Knit Knee-Highs, Patchwork Pants |

Design pattern (SHOWN): armor trades `aff` slots against each other. Metal head pieces give high physical affinity and negative elemental affinity (6182, 6245, 6266); cloth and rain gear gives elemental protection. `Wolf/Frog/Cat/Dog/Fox/Devil` masks (rar 2, dp 30, cls 5,5,5) each add +20 to one `caff` slot (air, earth/"Bravery", fire, water, light, dark) via `caff` applied in `oneq` (6104-6174); `Yellow Hood` is a stub. All armor sits at tier "stype 3" (equipment) and `dp` 11-41. No two-slot gloves: slot 5 and 6 are both "Hands" (10107-10108) but save code remaps (350).

### 1.4 Shields, 17 declarations, 16 keys (6376-6511)

Four real: Buckler STR 5 aff 2 all, dp 36; Targe STR 9, dp 38; Pelta STR 15, dp 41; Stake Shield STR 7, Physical ATK +4 (6501-6511). Twelve stubs (Tower, Kite, Heater, Round, Oval, Spiked...) and four rar-4 stubs (Knight, Hoplite, Jazeraint, Dread). `kit` key is declared twice (6441, 6448) so Kite is overwritten by Casserole. Stake Shield is crafted from sharpened sticks (stk2 `onGet` 5645-5648). Shield in damage: block is not a roll; the shield's `str` times skill and durability is subtracted inside the enemy damage formula (10498), and shield mastery XP is given when enemies hit you (10456).

### 1.5 Accessories, 89 (6513-7227)

Rarity split: 49 rar 1, 28 rar 2, 11 rar 3, 1 rar 4. 54 have `oneq` behavior; 10 are `desc='proc'` placeholders (moon/sun/celestial stones, six medals, Grand Gelatin 6964-7069) with no function. Categories (SHOWN):

| Group | Items | What they do |
|---|---|---|
| Base stats | Straw Pendant (+50 SAT, SPD +1), Gourd (+150 SAT), Fighter Insignia (STR +20 AGL +5), Quill/Black Ink/Magic Ink (AGL +5 / INT +3 / INT +8 AGL +10, the latter a recipe from the first two), Family Heirloom (HP +2) and Heirloom+ (HP +5, SAT +25, SPD +1) | 6513-6520, 6720-6749, 7105-7111, 7135-7227 |
| Jelly set | Life Jelly HP +400, Stamina Jelly SAT +100, Vital Jelly SPD +2 with extra hunger, Grand Gelatin placeholder | 6938-6969; dropped by slimes at .05% (7673, 7922) |
| Day/night | Sun Charm / Moon Charm via `eff[0]` (day: +5 STR/AGL/INT, +1 SPD, +100 HP/SAT, 1091-1102) | 6523-6543 |
| Gem pairs | 6 elements + Titan/Talos + 2 tiers, 12 gems, rar 2/3, all `oneq` empty; only descriptions (UNKNOWN whether stats are applied elsewhere) | 6592-6688 |
| Class defense | Wolf Fang Necklace (Beast DEF +15, 3 copies unlock Wolf Array +30), Bag of Salt (Undead DEF +12, ATK +8), Bone Doll, Straw/Wood Effigy, Soul Puppet (3-way merge recipe) | 6690-6709, 6760-6841, 7178-7184 |
| Resist | Vitamins poison -5%, Adhesive Bandage bleed -5%, Medicated Bandage both -8%, Alchemical Flask phys -3%, Plague Flask phys -4% dark +35, Stupa +2% to avoid death (`res` values are multipliers, lower is better) | 6858-6936, 7113-7119 |
| Crit/evade | Coin of Deceit crit +3%, Ruin Medallion +6%, Silencing Sheath crit damage +15%, Mirage Mirror dodge +10% | 7064-7095 |
| Economy/luck | Rabbit Foot LUCK +2, Lucky Coin +3, Maneki-Neko luck +4 and energy +10% (recipe from Coin + Cat Figurine), Coin Ring and Ring of Greed (chance for money drops), Discount Ticket/Card/Ring of Greed (shop price -1/-5/-10%), Penny of Wealth (extra coin per pick), Clover Pin (1% duplicate drop, rar 4) | 6751-6794, 6990-7024, 7121-7159 |
| Crafting tools | Mortar and Pestle, Retort, Alembic (alchemy XP and `alchq`), Basic Alchemy Set (+50%, quality 2, INT +15), Wooden Needle (tailoring), Kitchen set (cooking +200%, cook anywhere), Pet Brush (+200% petting XP) | 6849-6919, 7221-7227, 7144-7168 |
| Utility | Umbrella (no rain), Sword Medal (all mastery XP +10%, EXP +25%, 7197-7203), Chalice (collects blood from kills as a bar, `checksd` hook 7185-7195) | |

Several have bugs or inert text: Airia Hair Ornament promises Magic DEF +15 with an empty `oneq` (7097-7103); Mirage Mirror claims reduced aggro but only sets dodge (7089-7095); alchemy-set unlock condition tests `acc.mhhst` without `.have` so it is always true (6856, 6892, 6901). These are design signals: accessories are the game's "build slot" and the most designed content in this range.

---

## 2. Creatures (7393-7928)

### 2.1 Creature record and growth

`Creature()` (7393-7449): `type` 0-5 (comment: humanoid, beast, undead, evil, plant?, dragon; code uses 1 beast, 2 undead, 3 evil/default, 4 and 5 special; spirits counter treats 2 and 4 specially, 7437), `lvl`, `exp`, `stat_p=[hp,str,agl,int]` growth weights, base `hp_r`, `str_r`, `agl_r`, `int_r`, `spd_r`, `eva`, `cls`/`aff` (defense profile), `eqp[0].aff/cls` (the creature's "weapon" profile), `atype/ctype`, `rnk`, `pts`, `drop[]`, `battle_ai`.

Level scaling (SHOWN, 13710-13721): spawning at level N calls `lvlup(creature, N-1)` in one step. Per-level STR/AGL/INT gain is a random value between 1x and 2x of `stat_p`; HP gain is random between `1.8 ln(lvl)*t*hp_p` and `2.2*lvl*t*hp_p`. Creature XP is `exp*(1+t/5)+1`. So the same creature id spans a level band (e.g. rabbit L1-8) with stats rising roughly linearly.

Kill flow (7431-7449): fire `callback.onDeath` hooks; update `global.bestiary` entry `{id,kills}` (7434-7435); `global.stat.akills`, point total `pts`; per-weapon-class kill stats (`wpndiestt` 10600); player XP; `dropC`; money drop if a Coin Ring-type mod is active (7441); area counter decrement; achievement checks at 10k/50k/200k/1M/5M kills (7269-7273). Player XP formula: `exp + exp*lvl/10`, divided by a penalty `df` when the enemy is below player level (sqrt of level gap plus 0.1 times gap squared, 7439), times player EXP multiplier and a hunger-efficiency term, minus `(player lvl -1)` flat, minimum 1 (13734-13735). Player XP to next level `4*lvl^3 + lvl^2` (7319). After a kill, `onDeathE` grants War skill XP scaled by rank (7450-7452).

Hit chance (SHOWN, 10574-10585): player `((AGL+gear AGL/2)*efficiency)/(enemy SPD + AGL + eva)*130+5` percent; enemy `enemy AGL/((SPD+AGL+gear/2)*efficiency)*100+10-evasion skill`. Speed difference gives multi-hits: if the faster side's SPD gap over the slower side is at least 2x, it gets `ceil(gap/slow SPD)` attacks (10399-10416). Damage: attacker STR (or INT for `stt` 2 abilities) times hunger efficiency plus weapon STR times durability, multiplied by (100 + 10 x (weapon elem aff + ability aff + weapon class + monster-type bonus + player aff))%, minus defender STR scaled by 5 x (aff + cls). Armor on the player is an absolute subtraction, not a percentage (10498).

### 2.2 Catalog (22 filled, 14 stub names)

Filled: `stat_p` listed as hp,str,agl,int.

| id | Name | Type | Notable | Drops (chance) |
|---|---|---|---|---|
| 101 | Bat | beast rnk3 | HP 39, AGL 10, air +25; blood .0852 | bone .1, apple .06 |
| 104 | Attic spider | beast rnk3 | HP 26; 30% Poison Bite | thread .1, item `ltcc` .01 |
| 103 | Training dummy | rnk1 | earth +15, fire -25, light -666, dark +666 (defense affinity); .1% rusty stab | knife1 .01, bandage-hands .03 (while lvl<=20), herb .02 |
| 102 | Straw dummy | rnk1 | same affinities, weaker stat_p | straw .085, herb .02 |
| 112 | Wooden dummy | rnk1 | STR 3, earth/water high | pants, vest, bandana (<=lvl20), wood chunk .03, Bamboo Training Sword .002 |
| 120 | Skeleton | undead rnk7 | HP 132, STR 17, AGL 19, dark 51 | none; debug test area |
| 121-122 | Blue/Green Slime | beast rnk2 | HP 65/70, eva 6, light 25 | water, slime, jelly; Green drops Stamina Jelly .0005 |
| 123 | Wild Rabbit | beast rnk2 | eva 40, AGL 10, blood .108 | bone, raw meat, carrot, Rabbit Foot .00004 |
| 124 | Cyan Slime | rnk3 | HP 120, eva 15 | water .03, slime .05, jelly .02 |
| 125 | Clear Slime | rnk3 | HP 95, eva 20, class blunt 28 | jelly .06 |
| 126 | Scarecrow | rnk10 | HP 100; spawn-only | |
| 127-130 | Straw/Reinforced Straw/Paper/Attack Golem | rnk4-5, `un` flag | HP 500/700/400/730; exp 50-120; pts 200-800; Attack Golem 20% Bash | 13-25 straw + Life Shard guaranteed (100%); Paper Golem 4 Life Shards + cloth; Attack Golem drops a Life Stone |
| 131 | Nightmare | | HP 1e8, cls 9999, never attacks (intro wall) | |
| 132 | Locked Rock | rnk11 | HP 9000, cls 90/120/60, never attacks | |
| 133 | Lamp Spirit | rnk10 | copy of Scarecrow stats | |
| 136 | Weakened Wolf | beast rnk4 | HP 400, STR 20, eva 25, 30% Bite, 10% Scratch (note: calls `abl.scratch` but the ability is `abl.scrtch`, so that branch errors at runtime) | bone .15, raw meat .06, Wolf Fang Necklace .005 |
| 137 | Blue Slime (deep) | rnk3 | HP 220, eva 22, 15% Bash | water, jelly .07, Vital Jelly .0005 |

Stubs (name and flavor only, id reserved, no stats): Cave bat 109, Stirge 110, Puppet 105, Battle Puppet 106, Doll 107, Necro doll 108, Quicksilver 111, Zombie 113, Mummy 114, Ghoul 115, Ghast 116, Zombie Fighter/Knight/Mage 117-119, Disaster Corpse 134, Unchanging Skeleton 135 (7484-7879). These sketch a later catacomb tier (dark effector, `cata1` sector 8293).

Shared-object hazard (INFERRED, not run): every creature starts with `eqp=[eqp.dummy, eqp.dummy]` (7401) and each definition then writes `.eqp[0].aff/.cls` (e.g. 7474-7475, 7916-7917). `copy()` is shallow (14211-14215), so all creatures plus the player's empty slots probably share one `eqp.dummy` object; the last writer (Blue Slime 137) wins and `lvlup` of an unarmed player also edits it (13729). If true, per-creature "weapon" profiles do not actually differ. Needs a browser check before anyone copies the pattern.

### 2.3 Abilities (7934-8012)

`Ability(id)` has `cls`, `aff`, `affp`, `stt` (1 STR path, 2 INT path), and `f(att,def,z)`. Seven abilities, used by enemies only (the player's attack is the default path):

| Ability | Effect (SHOWN) |
|---|---|
| Bite 1 | x1.15 dmg; 15% roll to inflict bleed, stacks duration (7945-7954) |
| Selfharm/rusty stab 2 | x1.1 dmg, adds poison (7956-7963) |
| Scratch 3 | x1.1, 5% bleed (7965-7975) |
| Spark 4 | INT path, elec +25, x1.2 (7977-7984) |
| Double Stab 5 | two hits of x0.7 (7986-7993) |
| Poison Bite 6 | x1.15, 25% poison (7995-8004) |
| Bash 7 | blunt x1.3 (8006-8012) |

AI is a probability gate in `battle_ai` per creature (e.g. spider 30% poison bite 7511-7514, wolf 30% bite, 10% scratch 7901-7905). No cooldowns, no telegraphs, no player-visible intents.

### 2.4 Drops and luck (SHOWN, 13656-13662)

For each kill: (1) creature table, each entry rolled independently with chance `c + c*luck/100`, optional `min/max` stack and `cond()` (7510 etc.); (2) global lucky-clover drop at 4.8e-6 (7258); (3) area drop table, with a hunting-skill bonus `+c/75*skill level` (13660); (4) a rank-tier table for Life Shard/Life Stone (7259-7263: rank 1-3 L Shard .026%, 4-6 .05%, 7-9 .098% plus L Stone .023%, 10+ none). Clover Pin can duplicate a drop (13657). Discovered-drop flags per creature are recorded in `global.drdata` (13658) for the bestiary to show "??????" for unseen drops (13669).

---

## 3. Areas, sectors, spawning (8014-8307)

### 3.1 Area (a "zone", the fight pool)

`Area()` (8052-8060): `pop[]` of `{crt, lvlmin, lvlmax, c, cond}`, `size`, `drop[]`, `onEnd`, `onDeath`. `z_bake` (8198-8207) normalizes weights so `c` need not sum to 1. `area_init` (10744-10761) picks a creature by weighted roll, spawns a copy at a random level in the band, and rerolls if the `cond` fails. `size > 0` counts kills down to "Area cleared" and `onEnd`; `size = -1` is an endless grind; `size = 1` is a boss/duel (7442). Field `protected=true` blocks item use there (2423).

Catalog (17 areas):

| id | Name | Population (levels) | Size | Notes |
|---|---|---|---|---|
| 101 | Somewhere (`nwh`) | placeholder | 1 | no-combat sink |
| 102 | Training Grounds (`trn`) | Straw 1-9, Training 4-8, Wooden 3-5 | 10000 | onEnd gives title; typo sets id 107 on `area.trn` (8074), so `trnf` has id 0 |
| 107/103-105 | Training tutorials | Straw/Training dummies lvl 1-5 | 10/20/50 | scripted onEnd moves story, onDeath sets fail flag |
| 106 | Damp cellar | Bat 1-4, Spider 2-4 | 33 | first dungeon, quest completes on end |
| 108 | Test | Skeleton | -1 | debug |
| 109 | Western forest hunting | Rabbit 1-5, Blue Slime 1-6, Green Slime 1-6 | 60, re-rolled to 30-99 after clear | clear drops a bundle of rolled items |
| 110 | Your basement | Bat/Spider 10-17 | 10 | high-level home dungeon, rare Penny of Wealth |
| 111, 113, 114, 117 | Golem trials | Straw L20, Reinforced L23, Paper L25, Attack L28 | 1 each | 4 rungs; final grants a title |
| 112 | Forest hunting 2 | adds Cyan Slime | 50 | unlocks next area on clear |
| 115 | Forest hunting 3 | all slimes + rabbit, 3-9 | -1 | endless, tiny area drop table incl. weapons, herbs |
| 116 | Hidden area | Clear Slime 9-11 | 25 | secret |
| 118 | Southern forest | Weakened Wolf 7-8 (25%), deep Blue Slime 10-11 (75%) | 48 | next tier |

Respawn: there is no timer. A cleared sized area resets size by script (e.g. `this.size=rand(40)+30`, 8124) and bundles loot at the end (8121-8123, 8146-8150, 8191-8194). Each fight is a fresh monster; death returns the player to bed and sets the current area to "Somewhere" (7359).

### 3.2 Sector (the building/room layer)

`Sector()` (8212-8222): `group` (location ids), `data`, hooks `onEnter/onLeave/onStay/onMove/onScout`, optional `effectors` (8026-8046: `dark` blocks sight unless Torch or Night-Sight level 12, `shop` flag). A location can belong to many sectors (`addtosector`, 8224-8227). Instances: `home` (fire/furniture, smoke, cat gifts, at-home timers, 8233-8276), `vcent` (village chatter, 8278-8283), `forest1` (scout total 7000, +.1 per fight tick, completion gives 7000 EXP and a message, 8285-8291), `cata1` (dark, scout total 11000, 8293), `vmain1` (commented out).

### 3.3 Scouting (8304-8306 and 13806-13819)

`scoutGeneric`: each Scout action rolls one entry from the location's `scout` table (`c` chance, `cond`, `f` payload, `exp`), adds progress `2*(1+scout skill*.2)`, and at the total gets 5x chance. Chance scales `(1+skill*.15)*(1+gotmod*.2)`, where `gotmod` is the count of finds already made (so repeated finds get easier). Each entry fires once per place (`gets[idx]`). It stops itself with a message when nothing is left. Cannot scout in the dark without light (13813). The forest sector also fills "explored" by fighting (8288).

`giveCrExp(skill, am, lvl)` grants skill XP only below a level cap (8304-8306).

---

## 4. Comparison with YAIRPG

| System | Proto23 | YAIRPG | Class | Play-feel consequence |
|---|---|---|---|---|
| Item model | Fixed singleton `Eqp`, hand-tuned per item (5595-5628) | Component-built `Equippable` with quality 0-250%, rarity multiplier (items.js:11-21, 56-64, 497-510) | DIFFERENT-DESIGN | P23 loot is a named collection; YAIRPG loot is a crafted-quality ladder |
| Slots | weapon, shield, head, body, 2 hands, legs, 3 accessory slots (UI 10864-10875) | weapon, off-hand, head, torso, arms, legs, feet, cape, amulet, ring, artifact, tool (items.js:466, 724, 742, 758, 1012, 1055, 1074) | SIMILAR-DIFFERENT-TUNING | YAIRPG adds feet and cape and tools; P23 has more accessory slots |
| Weapon classes | wtype 0-7: unarmed, sword, axe, knife, spear, club, staff, bow with mastery skills (10099-10110, 1720-1790) | weapon_type derived from head+handle: spear, axe, hammer, dagger, sword (items.js:947-972), mapped to skills (skills.js:13-18; person.js:320-327) | SIMILAR-DIFFERENT-TUNING | P23 has staff and bow slots and knife-vs-dagger depth; YAIRPG classes come from parts |
| Mastery link | hit grants XP to class skill; STR +5%/lvl; perk at levels 1-11 (10442-10450) | per-class skill multiplies damage and AP^(1/3) (person.js:326-327) | SIMILAR-DIFFERENT-TUNING | P23 has discrete milestone perks and titles; YAIRPG is smooth |
| Damage types | Phys class edge/pierce/blunt plus 7 elements, resist is armor `aff` and `cls` | Single physical damage, "TODO" for types (enemies.js:134-143) | PROTO23-ONLY | Armor choice matters per enemy in P23; in YAIRPG it is one number |
| Hit/defence | percent from AGL, SPD, eva; armor absolute-subtracts STR (10498, 10574) | AP vs EP curve (combat_math.js:1-23); defense subtracts with 5% floor (:27) | SIMILAR-DIFFERENT-TUNING | YAIRPG caps defense advantage; P23 armor can fully negate a weak hit |
| Durability | dp per item, damages armor per hit, scales damage 10-100% (10463-10467, 10497) | None in base items.js (no durability field; fork hits for "durab" are unrelated comments) | PROTO23-ONLY | P23 has a gear-upkeep loop; YAIRPG gear is permanent |
| Repair | whetstone +2 dp; Maintenance skill stub (2321, 2099) | none | PROTO23-ONLY | |
| Upgrade/enchant | none; accessories merge by recipe (6767, 6776, 7004) | none in items.js; fork has `alloy_equipment.js` and `artifact_workshop` (UNKNOWN depth, not read) | PROTO23-ONLY (alloy: YAIRPG-ONLY) | |
| Item special effects | `oneq`/`onuneq` closures, `eff[]`, `onGet`, `onDegrade` (5623-5626) | `Equippable.getStats` data only; stats/skill-bonus fields (items.js:517-560) | PROTO23-ONLY | P23 items can do anything (Chalice, Sword of Evolution); YAIRPG items are pure stats |
| Accessories | 89 with luck, crit, economy, crafting tool effects | Amulet, Ring: stats only, `use_quality` false (items.js:1052-1090) | DIFFERENT-DESIGN | P23 accessory = utility/build; YAIRPG accessory = stat stick |
| Set/combine unlocks | duplicate-count and pair-count `onGet` triggers recipes (5645, 6697, 6767) | none | PROTO23-ONLY | Collecting multiples is rewarded |
| Creature stats | levelled bands per id, `stat_p` weights, random roll per level (13710-13721) | fixed template per id, optional +/- variation per zone (enemies.js:60-90, location.js:296-387) | DIFFERENT-DESIGN | P23: one rabbit grows with player; YAIRPG: new template per tier |
| Creature count | 22 real + 14 stubs | 34 templates incl. ~8 non-bestiary challenge units (enemies.js:610-690) | SIMILAR-DIFFERENT-TUNING | YAIRPG has more finished enemies |
| Creature tags/size | type 0-5, rank, `pts` | tags (`beast`,`monster`...), size small/medium/large, skills react to tags (enemies.js:20-30, 69-95) | SIMILAR-DIFFERENT-TUNING | YAIRPG has "Pest killer" / "Giant slayer" style tag skills; P23 uses class defense accessories |
| Abilities | 7 named, per-creature probability gates (7945-8012) | enemy `on_hit/on_damaged/on_death` hooks, `bufotoxin` (enemies.js:98-101, 218) | SIMILAR-DIFFERENT-TUNING | Both thin; P23 effects are bleed/poison; YAIRPG uses status list |
| Multi-attack | speed gap yields multi-hit (10399-10416) | `attack_count`, `attack_speed`, stances target counts (enemies.js:310, combat_stances.js) | SIMILAR-DIFFERENT-TUNING | |
| Enemy AI | `battle_ai` per creature | none (hit pattern from stats) | PROTO23-ONLY | |
| Drops | per-entry chance + luck, area table with hunting skill, rank table, global clover (13656-13662) | per-entry `chance` times skill modifier ("Butchering" for beasts), `count` ranges (enemies.js:164-200) | SIMILAR-DIFFERENT-TUNING | P23 has luck/hunting bonuses and area drops; YAIRPG only tag-skill |
| Kill counts / bestiary | `{id,kills}` list, per-creature drop-discovered flags (7434, 13658) | `enemy_killcount[name]`, bestiary entry on first kill, tooltip updates when drop first found (main.js:3186-3192, enemies.js:36) | SAME | |
| Player XP from kills | exp * level band * efficiency, penalty for low-level foes (7439, 13734) | skill XP only (Combat, stance skill, tag skills), per attack (combat.js:217, 277) | DIFFERENT-DESIGN | P23 has a character level; YAIRPG progress is skills |
| Area structure | `pop` weights, levels, size/kill count (8052-8207) | CombatZone: `enemies_list` or `enemy_groups_list`, group size, `enemy_count`, `first_reward`, `repeatable_reward` (location.js:225-387) | SIMILAR-DIFFERENT-TUNING | YAIRPG zones fight in groups of up to 8; P23 is one monster at a time |
| Clear/respawn | size counter, script reset, -1 endless (7442, 8124) | `enemy_groups_killed % enemy_count` reward each cycle, endless by default (main.js:3146-3159) | SIMILAR-DIFFERENT-TUNING | YAIRPG repeats rewards automatically |
| Scouting | per-sector table with find ramp (13812-13819) | no direct equivalent in base. Fork has scouting in `expedition_content.js`, `frontier_campaign.js`, `town_content.js` (not read) | PROTO23-ONLY (fork: UNKNOWN) | |
| Sectors | rooms with hooks, effectors, shared groups (8212-8283) | `location_types` with stages and xp per tick, temperature, light level (location.js:81-150, locations.js:18-45) | DIFFERENT-DESIGN | P23 sectors are scripted places; YAIRPG types are tag-based environment |
| Light/dark | Torch or night-vision skill needed to see/hit well (10434-10435, 13909) | `light_level` bright/dark from type (location.js:318-327) | SIMILAR-DIFFERENT-TUNING | |
| Fork overlap | `proto23_world_content.js` is a village visitor branch (steward, tutor, install bed/hearth) with no creature or gear content (proto23_world_content.js:1-154) | n/a | n/a | the fork took the village and reading, not the combat data |

---

## 5. Design observations worth acting on (opinion, label INFERRED)

1. P23's best idea in this range is the accessory slot as a build/economy slot (luck, price, drops, crit, cook anywhere). It costs almost no combat balance. YAIRPG's Amulet/Ring are stats-only; adding `oneq`-style effects would be a cheap import.
2. Two growth loops P23 has that YAIRPG lacks: gear durability with a cheap whetstone repair, and Sword of Evolution kill-growth. Both depend on a persistence decision (items need `dp` saved).
3. Level-banded creatures with `stat_p` weights give difficulty smoothing without new templates; YAIRPG's `enemy_stat_variation` is the nearest hook but is a random +/-%, not a level.
4. Content quality: the weapon and shield lists are mostly stubs. Do not treat counts as shipped content. Shipped: 27 weapons, 31 armor, 4 shields, about 80 accessories, 18 creature entries.

## Gaps

- `chss` locations, `item.*` definitions, `rcp.*` recipes, `effect.*` bodies (except `snch`), and `skl.*` bodies were outside the range. Gem accessory stats (6592-6688), `aihomnt`, `mirgmirr` aggro effect, and several `desc='proc'` items might be applied in files I did not read.
- Shared `eqp.dummy` mutation (2.2) is INFERRED only; not run.
- Crit formula parts (`skl.seye`, `you.crt`, `luck`) read only as far as shown at 10506. Abilities `scratch` vs `scrtch` mismatch (7903 vs 7965) is SHOWN by names but the runtime effect is not tested.
- YAIRPG: `alloy_equipment.js`, `artifact_workshop_*`, scouting in `expedition_content.js`/`frontier_campaign.js`, and the other ~340 fork files not audited for equipment or creature overlap; only grep for durability/scouting/bestiary done. `locations.js` counted by grep (about 26 `new CombatZone` constructs, 61 location constructs) not read in full.
- Player level exists in P23; I did not confirm that YAIRPG has no character-level XP outside `combat.js` (only the skill XP paths were read).

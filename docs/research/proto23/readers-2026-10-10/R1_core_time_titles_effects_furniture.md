# R1: Proto23 core state, time, titles, weather, effects, furniture, quests vs YAIRPG

Source: Proto23 `index.html` rev e93a8cd (read-only copy in the session scratchpad). Line numbers below are Proto23 lines unless prefixed with a YAIRPG path. Labels: SHOWN = read in code; INFERRED = deduced; UNKNOWN = not established.

## Coverage

Lines 1-1700 read in full with the Read tool, in chunks of 400, 300, 400, 300 and 300 lines (1-400, 401-700, 701-1100, 1101-1400, 1401-1700). Lines 1-142 are CSS (UI skin only, no mechanics). Lines 143-425 hold globals, save and load. Lines 427-880 hold Titles. Lines 883-923 hold Weather. Lines 953-965 hold Time. Lines 972-1423 hold Effects. Lines 1429-1583 hold Furniture. Lines 1590-1673 hold Quests, with Skill() beginning at 1691.

Out-of-range code was grepped only where a range mechanic calls it: `giveEff`/`removeEff` (10774-10794), `giveTitle` (13760), title trigger tables (7262-7304), `wManager`/`setWeather`/`onSeasonTick` (13207-13628), time helpers (13630-13656), `ontick` (13844-13880), `sector.home` (8234-8280), `chss.hbed` (12845-12865), `giveFurniture` (11477), quest givers (12030-12320), and the Sun/Moon charm items (6524-6545). Statements about those lines are SHOWN but are not a full read of them.

YAIRPG files read: `src/game_time.js` (whole top 140 lines), `src/weather.js` (whole), `src/active_effects.js` (weather block and an effect list), `src/quests.js` (class and manager), `src/home_furnishing_content.js`, `src/home_furnishing_host.js`, `src/proto23_world_content.js` (skimmed), and the relevant `src/main.js` and `src/data/character.js` parts.

## 1. Global state and save format (143-425)

- SHOWN: one global bag of registries (`dom, area, quest, ttl, skl, furniture, effect, weather ...`, 144-166) plus arrays `inv, furn, qsts` and objects `you, home` (168). Constants: YEAR 518400, MONTH 43200, DAY 1440, WEEK 10080, HOUR 60 minutes (171). A year is 12 months of 30 days. Currency: 1 silver = 100 copper, 1 gold = 10000 copper (172).
- SHOWN: `global.stat` (180) is a very large lifetime counter bag: ticks, kills (`akills`), money gained (`moneyg`), food counters, deaths (`deadt`), time at home (`athme` and `athmec`), lightning strikes (`lgtstk`), cat pats (`cat_c`), shop items bought (`buyt`), `coldnt` (a cold accumulator), and `wsnburst/wsnrest` (a winter gust timer). Many title unlocks read these counters.
- SHOWN: `save()` (199-276) serialises to one pipe-delimited base64 string in localStorage key "v0.3". The sections are: player, effects (id, remaining duration, power), skills, skill exp, globals (including time.minute and weather id/duration), recipes, inventory by type, area sizes, discovery lists, furniture, vendor stock, titles, home slots, quests, actions, sectors, containers, choice-nodes, and a trailing list of titles whose talents were already granted. Saving unequips everything, snapshots stats, then re-equips (204-228), and deactivates and reactivates home furniture (205, 269).
- SHOWN: `load()` (285-425) rebuilds from those slices. A failed parse shows a "SOMETHING BROKE" banner and advises deleting the save (293). Loading re-applies title talents that were not yet granted (389). A one-time starter chest is stocked into `home.trunk` with a glove, an accessory, a bamboo sword, a toolbox, a shield and a bone item (404-412). There is a "patch things" block at 420-422 that retro-grants titles and recipes.
- Autosave: every 30000 ms when the flag is set (418).
- YAIRPG equivalent: save pipeline is wholly different (`src/save_files.js`, `main.js` `create_save` around 4392-4843; `character.titles` serialised at main.js:4392). DIFFERENT-DESIGN (structured JSON, versioned, import/export file; YAIRPG also has an export that ends the life, main.js:7583). Not a design-feel difference for play.

## 2. Time (953-965 and helpers 13630-13656, 13844-13880)

- SHOWN: one `time.minute` integer is the master clock (961). Initial value 338144100 minutes (962) which equals about year 652. Year, month, day and hour are all derived by integer division of that one number (13641-13646).
- SHOWN: `ontick()` runs every `1000/fps` ms, adds `global.timescale` minutes per tick, calls `wManager()` and the effect loop (13844-13880). Timescale is 1 normally and set to 5 while in the home bed (12859, 12862). A manual sleep loop runs a fixed number of `ontick()` calls inside a loop sized `HOUR*18` (2434-2435; exact count rules UNKNOWN beyond that line).
- SHOWN: date display is `year/month/day hour:minute` with weekday name; a weekday toggle supports English long/short and Japanese kanji (963-965, 13630). Day of week is `time.day % 7` (13630).
- SHOWN: moon phase is `(time.day % 62.64 / 7.83)` floored, giving 8 phases (13633, names at 188-190). The moon icon is only displayed at night (398). It is cosmetic in the range read; INFERRED no mechanic reads it (not grepped beyond this).
- SHOWN: seasons by `time.month % 12 + 1`: months 3-5 Spring, 6-8 Summer, 9-11 Autumn, 12/1/2 Winter (13633-13640 region; seen at the getSeason function).
- YAIRPG: `src/game_time.js:7-197`. `Game_Time` uses explicit year/month/day/hour/minute fields and a `day_count` (starting 1 = Monday, line 11) for weekday. 30-day months, 12-month years are SAME. Season mapping differs: months 1-3 Spring, 4-6 Summer, 7-9 Autumn, 10-12 Winter (`game_time.js:55-63`, `seasons` at 193). Night is hours 21-4 for the simple split (`:78`) and `night_time` 20-4 for light (`:3`). Moon: `day_count % 29.5 / 29.5`, four named phases (`:110-117`). YAIRPG sleep speedup is a config (`time_speedup_when_sleeping`, main.js:6540).
- Classification: SIMILAR-DIFFERENT-TUNING (calendar shape is the same; Proto23 starts at ~year 652 in Spring-Mar-equivalent, a 1-sec = 1-min tick, sleep at 5x; YAIRPG starts at its own configured date). Moon phase is SIMILAR (both cosmetic-leaning, 8 vs 4 phases). Season shifted by two months.
- Design consequence: Proto23 winter (Dec-Feb) lasts 90 played days and is when its cold system bites; YAIRPG winter is Oct-Dec. Neither has long-term calendar consequences beyond weather, so the offset is invisible to play except at fork migration.

## 3. Titles (431-880, plus unlock tables 7262-7304 and giveTitle 13760)

SHOWN mechanics:
- A Title has name, description, `rar` (rarity colour 1-5, default 1), optional `talent()` (a permanent stat tweak applied once, tracked by `tget`), optional `tdesc`, `onGet()` hook, and a hidden flag `rars` (rarity-secret) used for some achievements (431-438).
- `giveTitle` (13760-13767): adds to `global.titles`, makes it the current `you.title`, runs its talent once, fires `onGet`, then re-checks the "number of titles" milestone chain. Message "New Title Earned!" unless suppressed. Duplicate grants are ignored.
- Total defined: 108 entries, ids 0-107 (440-880). Several entries are unfinished stubs (blank descriptions or placeholder names: `ttl.spn` desc "s" at 552, `ttl.aaa` 563, `ttl.shpt2/3`, `ttl.mone3`, `ttl.geti1-4`, `ttl.tghs1-3`, `ttl.jbs1-3`, `ttl.dth3/4`, `ttl.sld4/5`, `ttl.axc3`, `ttl.indkill`, `ttl.ttsttl4` desc "100", `ttl.hstr4` desc "1000"). So SHOWN real content is closer to 80 titles; stubs show intended future tiers.
- Only five titles carry a real mechanical talent in range: Walker (-5% run energy, 511-513), Jogger (-15% run energy, 546-548), Iron Stomach (survival-info flag to guess rot time, 621-622), Quartermaster (dummies may drop something special, 631-632), plus the "rars" ones that are silent. Every other title is flavour that records a milestone; the actual stat rewards come from the skill perk that grants the title (e.g. skill level 5 perk "STR +1, New Title", lines 1709-2038 grepped). So titles are a log of skill milestones, not a power system.
- Unlock families (grepped tables): lifetime kills 10k/50k/200k/1M/5M (7269-7273); lifetime gold 1 gold (7277); title-count 10/25/50 (7282-7284); shop items bought 500 (7288); cat pats 9999 (7293); hand strength punch tests 100/250/500 kg (7296-7298); time at home continuously 1/5/10 years (7301-7303, reset on leaving home at 8250); dojo tutorial/Apprentice/Initiate via area completion (8071, 8185, 11584); Quartermaster after returning 300 items to the dojo (11660); Safehouse for reaching level 20 with zero deaths (13730); Glass Bones for losing to the weakest enemy at level 1 (7266); Cat/pet, sleep, hunger, rot-food, pain, danger-sense and weapon-mastery families via skill perks.
- YAIRPG: base `Hero` has `this.titles = {}` (`src/models/hero.js:25`) and the base game carries titles through save data (main.js:4392, 4782) but the base does not define a title catalogue. The fork has a simulation-level title grant effect (`src/simulation_effects.js:301-304`) used as facts (`title.<id>`, `:101`). Fork-specific: `src/proto23_world_content.js` only uses the word "title" in design text.
- Classification: PROTO23-ONLY as a content catalogue and unlock set. YAIRPG has the structure to hold titles but no equivalent list. DIFFERENT-DESIGN: Proto23 titles come from counters (kills, time at home, items bought) and are surfaced as a flavour log; YAIRPG ties identity to skills and bodies and uses titles in the simulation layer as granted-by-issuer facts.
- Design consequence: the "long-tail milestone" titles (1M kills, a decade at home, 9999 cat pats, zero deaths to level 20) are cheap to add and give idle play visible long-horizon goals with no balance risk because they do not give stats. The "Hikikomori to Hermit" chain is notable: it rewards doing nothing at home, which is an anti-adventure achievement.

## 4. Weather (883-923, 13207-13628)

SHOWN mechanics:
- 14 weather types (ids 100-113): Sunny, Cloudy, Stormy, Overcast, Storm, Thunderstorm, Rain, Heavy rain, Misty, Foggy, Drizzle, Clear, Snow, Snow Storm (888-901). Flags: `frain` (rain), `fsnow` (snow), colours for the UI.
- A Markov-like state machine `wManager()` (13207): each time a weather's duration reaches 0, roll 1-100 and choose the next weather from a per-season, per-current-state table with ranges and new durations in minutes (for example sunny to cloudy at 10 percent for 120-220 min). It uses `getHour()` gates (day 5-16 gives sunny, otherwise clear). Season tables are 4 separate switch blocks (spring 13209, summer ~13291, autumn ~13333, winter ~13420). There is an obvious logic bug: the condition `getHour()<5&&getHour()>16` can never be true, so the night branch of that choice never fires (many places, for example 13214-13216).
- Rain-class weathers (`storm, rain, heavyrain, drizzle`, 903-909): while outdoors (`global.flags.inside===false`) give the player and the current enemy the Wet effect for 5 ticks unless the player has the rain-proof mod (`rnprtk`). Thunderstorm (911-923): same Wet plus a 0.09 percent per tick lightning strike (random<.0009) that deals `200/(1+0.05*Abandonment-skill level)` damage and can kill; it also feeds Pain/Death/Anti-body skills (916-920).
- Winter tick (13607-13628, `onSeasonTick` case 4): outdoors it gives Cold, extends it by 1-3 per tick (3-7 in snow), adds 5-10 if Wet (and strips 5 off Wet), and runs a "gust" cycle of 200-1300 ticks active then 20-100 ticks rest (`wsnburst/wsnrest`).
- Weather duration is in ticks of minutes, so a sunny spell lasts 200-400 game minutes (3 to 7 hours).
- YAIRPG: `src/weather.js:1-256`. Weather is deterministic, not a state machine. Temperature = 20 C base + season (Winter -20, Spring -5, Summer 0, Autumn -8) + time-of-day (+3 afternoon, -8 pre-dawn) + a 11-day pseudo-random table + a 13-day rain table, scaled by a per-location range modifier (`weather.js:5-90`). Rain is simply `rain_cycle[day_count % 13] < 0` (`:155`). A smoothed temperature interpolates between the 05:00 and 14:00 anchor points (`:100-150`). Under-roof locations ignore it. Light level is computed from the night window (`:157-182`). No snow vs rain flag; sub-zero temperature plays the snow animation (main.js:6656-6700).
- Classification: DIFFERENT-DESIGN. Proto23 has named, stochastic weather states with flavour (fog, thunder, lightning) and durations. YAIRPG has numeric temperature plus rain boolean. SIMILAR in outcome: both turn rain into a Wet status, and both turn cold temperature into a cold debuff.
- Design consequence: Proto23 weather is a visible event stream (you notice thunder, snow storms, fog). YAIRPG weather is predictable and plannable (a 13-day cycle), which suits a player who wants to schedule expeditions but offers less moment-to-moment drama. Proto23 lightning gives rare lethal risk outdoors; nothing in YAIRPG base does.

## 5. Effects (972-1423; plumbing at 10774-10794, 13864)

SHOWN framework: Effect objects have a `type` (1 on-attack, 2 on stat-refresh, 3 on-tick, 4 decor/flag, 5 stat-mod, 6 tick-stat; comment at 974), a `use()` called each tick for types 3, 5, 6 (13864-13865), `onGive/onRemove`, `duration`, a status icon glyph (`x`), colours, and `mods()` for type-5 stat modifiers. `giveEff` stacks duration or power depending on each effect's `onGive` (10774-10784). Effects are saved by id, remaining duration and power (215), except those marked `save=false` (fireplace aura).

Catalogue (id, mechanic, line):
- Poison (1, 1008-1032): 5 ticks default; each tick deals `power` (default 1) damage reduced by Poison Resistance (`dmg*=ceil(1-poisr)`), feeds Poison and Pain Resistance, can kill and records death cause [2,1]. Re-application averages power and adds 0.7 of new duration. Venom (2, 1034-1058): 15 ticks, reduction scaled by 0.3, re-apply averages /1.5 and adds 0.5 duration. Works on monsters too and counts `indkill` (indirect kills).
- Poison block (3) and Venom block (4): 600-tick immunity to weak/severe poisons (1060-1080), given by items (2241).
- Immortality (5): empty placeholder (1082-1089).
- Sun blessing (6) and Moon blessing (7) (1091-1162): charm accessories (Sun Charm item 6528, Moon Charm 6539). While worn and during day (sun) or night (moon): STR +5, AGL +5, INT +5 (base and display), SPD +1, max HP +100, max satiety +100, current satiety +100, applied once and removed at the other half of the day. A 1000 ms setInterval polls the day flag. Lines 1099-1102 look bugged: INFERRED `agl_d` and `int_d` are set twice in different orders, and `.un()` only refunds 100 satiety, not the stat buffs (rely on `stat_r()` recomputation, 1120).
- Food poisoning (8, 1164-1175): 30 ticks; each tick drains 1-3 satiety scaled by (1 - Food Poison Resistance) and trains that skill.
- Wet (9, 1177-1193): 5 ticks base. Outdoors in rain it gains +6 per tick, capped at 600; drying is 1 per tick, or 15 per tick next to a lit fireplace; trains Anti-Wet (abw).
- Fireplace Aura (10, 1195-1208): follows the home fireplace's fuel; duration is set to the fuel count each tick; increases cooking quality (`ckfre`); trains Anti-Fire (abf); not saved.
- Candlelight (11, 1210-1220): +1 light for 360 ticks.
- Sleep (13), Running (18), Investigating (21): flag effects (type 4) with no logic of their own (1233-1240, 1296-1301, 1328-1333).
- Bleeding (14, 1242-1261): 5 ticks; per tick `power` damage randomised 60-140 percent, reduced by Bleed Resistance; stacking adds 20 percent power plus 1 and 0.9 of duration.
- Tarnished (15) and Prostasia (16): -30 percent and +30 percent equipment usability (used in item durability maths at 10492).
- Incense Aroma (17, 1286-1294): 600 ticks; doubles meditation skill exp (13866).
- Inebriated (19, 1303-1314): a stat-mod effect; AGL divided by (1 + 0.4 - 0.03*Drinking lvl), STR multiplied by (1.2 + 0.02*lvl), INT divided by (1.5 - 0.04*lvl); 15 ticks default but alcohols set it to 40-380 ticks (2930-4734 by items).
- Virus (20, 1316-1326): AGL and STR /1.1, satiety -70.
- Invigorate (22, 1335-1346): +30 percent AGL multiplier.
- Fei poisoning (23, 1348-1363): 60 ticks of cultivation-pill purification damage `power*5*(1-0.05*Corruption-Resist lvl)` each tick; if you survive the full duration, grants a large EXP reward `power*5000 (+15 percent bonus for power>1)`; death message "You fail to purify the pill". That is a risk/reward cultivation loop.
- Cold (24, 1365-1382): 5 ticks base, a type-5 stat mod (AGL /1.1, STR /1.1, HP /1.1, SAT /1.05). Winter makes it grow; a lit fireplace drains it 15 per tick; `coldnt` accumulates (+6 wet, +2 dry per tick, decays 1) and at 460 triggers Hypothermia.
- Smoke (25, 1384-1401): home smoke event; 10 percent per tick of a cough that costs 5-35 plus 1-5 percent HP when HP is above 50.
- Hypothermia (26, 1403-1423): AGL /1.15, STR /1.2, HP /1.2, SAT /1.1; 30 percent per tick lose 5-20 HP above 50 HP; 900 cap; fire drains 5 per tick. Unsaved test effects: `test1`, `bk1` (30 percent beast kill bonus), `strawp` (+50 sat) and `tst2` are dev leftovers (988-1006, 1223-1231).

YAIRPG equivalent: `src/active_effects.js`. `ActiveEffect` class with stat multipliers and flats, tags (buff, debuff, food, medicine, poison), and `group_tags` for priority (`active_effects.js:12-35`). Weather effects: Wet gives -5 cold tolerance (`:40-47`). Cold tiers by temperature: Cold (14 C), Very cold (8), Freezing (2), Hypothermia (-4) (`data/character.js:16-19`); a counter for each tier must pass 60 ticks (20 if Wet) before the effect applies (`main.js:6747-6752`). Cold stat penalties are heavier and graduated: for example Cold gives stamina efficiency x0.8 and STR x0.9; Hypothermia gives stamina efficiency x0.1, STR x0.4, regen x0.2 and all XP x0.3 (`active_effects.js:49-111`). Poisons and food buffs: 'Slight food poisoning' (health loss flat -0.5/tick), Tipsy (AGL x1.1, DEX x0.8), Paralysing/Convulsive/Dragonfly venoms and others (`:271-471`).
- Wet: SIMILAR-DIFFERENT-TUNING. Proto23: duration drying. YAIRPG: tolerance penalty plus a rain counter (`time_until_wet = 10`, `data/character.js:10`).
- Cold/Hypothermia: SIMILAR-DIFFERENT-TUNING. Proto23 has Cold then Hypothermia via an accumulator (460) and winter gust; YAIRPG has four tiers from numeric temperature and 60-tick onset, plus Cold resistance skill (main.js:6759).
- Poison/Venom/Bleed/Food poisoning/Smoke: YAIRPG has poison variants (necrotizing, paralysing, convulsive, dragonfly) and a food poison effect; Bleeding as a distinct stackable DoT, Smoke and Fei poisoning are PROTO23-ONLY. Poison itself is SIMILAR.
- Drunk: SIMILAR (Tipsy in YAIRPG). Proto23's Drunk scales with Drinking skill, YAIRPG's is flat.
- Sun/Moon charms: PROTO23-ONLY (time-of-day equip buffs). YAIRPG has night/day effects on stats via `is_night` (main.js:6539-6552) and the Cold-based one, so a time-of-day stat flip exists but not as a worn charm; INFERRED only.
- Fireplace Aura: Proto23 effect with fuel. YAIRPG fork has a fixed "hearth" action (proto23_world_content.js:78-85) that dries material, not an aura. DIFFERENT-DESIGN.
- Candlelight/Incense: PROTO23-ONLY in this range; YAIRPG has darkness/light levels (`weather.js:157-182`) and a lamp concept (UNKNOWN beyond `light` use).

Design consequence: Proto23 effects are mostly single-tick hooks that call into skills (each damage effect trains a resistance skill). That ties effects to the skill economy. YAIRPG effects are declarative stat blobs with explicit penalty tables, which are easier to balance but give fewer emergent interactions between skills.

## 6. Furniture (1429-1583; giveFurniture 11477, home sector 8234-8280, bed 12845-12865)

SHOWN mechanics:
- A Furniture record has `data.amount` (count owned), `sq` (quality tier for slot competition), `v` (home rating value), optional `removable`, and `activate/deactivate` hooks that apply passive bonuses only when the player is in the home sector (`activatef` 11486; sector enter 8234; leave 8252-8256).
- Home slots (`home.bed, home.tbw, home.blkt, home.pilw`): best-quality furniture of a slot wins on `onGive` (for example 1465, 1487, 1529, 1542). Home rating is the sum of `v` values shown in the furniture UI (11477-11484).
- Items (15 entries, ids 2-15):
  - Cat (2): growing companion; age +timescale per tick; mood recovers 0.002 per tick, cap 1; pet-name chosen once and it can bring gifts via the home scout table (8240-8250; cat is a bonus to bed regen: +5 vs +1 at 12848).
  - Fireplace (3): fuel counter that drops 1 per tick (`use`, 1456-1458); fuel above 0 triggers the Fireplace Aura; fuel is replenished by logs.
  - Straw Bedding (4, quality 0.1, v 1), Plain Bed (5, quality 1, v 5, removable). Bed sleeping: heal per tick `5*sleepLvl*bed.sq` plus 1 or 5 (cat) plus 1 (12848, skl.sleep.use at 1819); the bed also trains Sleep with `sq` as the exp multiplier.
  - Wooden/Clay/Ceramic Tableware (6-8): wooden gives +5 percent Gluttony skill exp (1482-1485); clay and ceramic are placeholders with `v` 9 and 21 and no effects.
  - Straw Basket (9) removable, no effect. Storage Box (10) gives home container access (12729). Ragwork Blanket (11): +50 percent Sleep exp (1524-1527). Straw Pillow (12): +30 percent Sleep exp (1537-1540). Yarn Ball (13): +15 percent Patting exp and +0.25 passive patting exp per tick (1550-1553). Firewood Pile (14): auto-feeds the fireplace +30 fuel when it drops to 2 or less, consuming one pile charge; capacity is 5 per owned pile and refilled from firewood items (1566-1571, 8274). Book (15): each owned copy adds +1 percent Literacy exp, stacking (1580-1583).
- Furniture is acquired from item use (`item.<x>.isf`, for example 5058-5261), is lost by "Remove" (returns the item) when `removable`, and is saved with its `data`.
- Staying at home: `athmec` rises per tick; leaving resets it (8252), and it feeds the Hikikomori titles. A smoke-in-room event (`smkp`) forces the cat outside and applies Smoke damage.
- YAIRPG: base game has no furniture system. The fork has two separate things. (a) `src/home_furnishing_*.js`: a one-time paid "fit-out survey" at the earned Shack workshop that unlocks two fixtures (a drying rack and a drafting bench), each built through site-project phases that cost logs, sap and stamina, then used to dry offcuts or draft staves (`home_furnishing_content.js:17-106`). (b) `src/proto23_world_content.js`: an original "Proto23 village" world with three installable fixtures (plain bed, hearth, bookstand) sold by a steward; the bed grants a four-minute rest that restores up to four stamina, the hearth consumes one log to dry material, and the bookstand compares personal results with no passive XP (`:54-89`, descriptions at `:117-119`). Both explicitly forbid passive/global multipliers.
- Classification: DIFFERENT-DESIGN. Proto23 furniture is a passive-bonus collection (a +% to skills, +heal, +rating), earned by buying or crafting items and placing them. The YAIRPG fork restates the same idea as consumable-cost job stations with no passive bonuses, by design principle. The Cat, Yarn Ball, Book and Blanket-type XP boosters are PROTO23-ONLY. Home rating is PROTO23-ONLY.
- Design consequence: Proto23 rewards owning a pile of cheap objects (stack books for Literacy gain, keep a cat for regen). YAIRPG's fork rejects stacked passive bonuses, so equivalent items must pay their way through time and materials each use.

## 7. Quests (1590-1683; givers 11939-12320)

SHOWN mechanics:
- `Quest` has `data{started,done,pending,toup}`, `init/tracker/fpending/rwd/goals/goalsf` callbacks, `rar`, `loc`, optional `repeatable` (1590-1601). `giveQst` (1677) starts and lists a quest; `finishQst` (1681) marks done, prints "Quest completed", runs `rwd`, increments `qstc`.
- 5 quests only: test (dev), Firewood Gathering (id 2, 10 firewood for hunter Yamato; reward karma +1, 100 copper, a shield, 15000 raw exp), First Hunt (3, 10 raw meat; karma +1, 130 copper, 10 jerky, 12000 exp), Guarding Duty (4, repeatable; hours 7-10 window to accept, stand until 20:00; 65 copper, 3000 exp, trains Patience and Sharp Eye with a small passerby-coin chance per tick, 12290-12330), Monster Eradication (5, kill 35 wolves; reward 300 copper, a spear and a neck guard, 18000 exp; at 35 kills a story event triggers; uses an onDeath callback hook, 1651-1673). Quest 5 unlocks only after quests 2 and 3 are done and the player has completed dojo training (12030-12036).
- Rewards go through plain functions; EXP is awarded as "raw" values (`giveExp(x,true,true,true)` skips the normal multiplier).
- YAIRPG: `src/quests.js`. Declarative `Quest` and `QuestTask` classes with tasks run in order, event-driven task conditions (`any`/`all` with kill, item etc., `quests.js:12-60, 102-200`), rewards objects, hidden quests and tasks, repeatable flag, availability components saved through the common system. Base questline "Lost memory" (5 tasks) and about 14 more (`quests.js:304-556`) vs Proto23's four live quests.
- Classification: SIMILAR-DIFFERENT-TUNING. Both support repeatable and gated quests. YAIRPG is data-driven and has multi-task chains; Proto23 is code-driven, one goal each. Proto23's Guarding Duty is a timed job (accept 7-10 AM, hold until 8 PM, 65 copper) that is a clean idle-friendly repeatable quest pattern; YAIRPG's job system is different and not compared here (outside range).
- Design consequence: Proto23 quests are tutorial-sized and mix gather, kill and "wait out a shift"; YAIRPG's structure supports deeper chains but ships fewer wait-shift jobs.

## Comparison table

| System | Proto23 lines | YAIRPG equivalent | Class |
|---|---|---|---|
| Master clock, calendar | 171, 961-962, 13641 | `src/game_time.js:7-100` | SIMILAR-DIFFERENT-TUNING (season offset two months; weekday and moon differ) |
| Moon phase | 188-190, 13633 | `src/game_time.js:110-117` | SIMILAR-DIFFERENT-TUNING (8 vs 4 phases, cosmetic) |
| Sleep timescale | 12859 | `main.js:6540` (config) | SIMILAR-DIFFERENT-TUNING (Proto23 5x) |
| Titles catalogue (108) | 431-880 | none (only `hero.js:25`, `simulation_effects.js:301`) | PROTO23-ONLY |
| Title milestones by counters | 7262-7304 | none | PROTO23-ONLY |
| Weather states (14, Markov) | 883-901, 13207-13600 | `src/weather.js` (deterministic temperature + rain table) | DIFFERENT-DESIGN |
| Lightning strike | 911-923 | none found | PROTO23-ONLY |
| Rain gives Wet | 903-909 | `main.js:6656-6670`, `active_effects.js:40-47` | SIMILAR-DIFFERENT-TUNING |
| Cold and Hypothermia | 1365-1423, 13607-13628 | `active_effects.js:49-111`, `data/character.js:16-19` | SIMILAR-DIFFERENT-TUNING (YAIRPG 4 tiers) |
| Poison / Venom | 1008-1058 | `active_effects.js:406-471` | SIMILAR-DIFFERENT-TUNING |
| Bleeding DoT | 1242-1264 | none found | PROTO23-ONLY |
| Fei poisoning (pill purification) | 1348-1363 | none found | PROTO23-ONLY |
| Smoke / candle / incense | 1210-1220, 1286-1294, 1384-1401 | none found (light levels in `weather.js`) | PROTO23-ONLY |
| Sun / Moon charm buffs | 1091-1162 | none (night checks exist) | PROTO23-ONLY |
| Inebriated | 1303-1314 | `active_effects.js:333-342` (Tipsy) | SIMILAR-DIFFERENT-TUNING |
| Furniture with passive bonuses | 1429-1583 | `home_furnishing_content.js`, `proto23_world_content.js` (job-station design) | DIFFERENT-DESIGN |
| Cat companion | 1444-1450 | none found | PROTO23-ONLY |
| Home rating | 11477-11484 | none | PROTO23-ONLY |
| Quest engine | 1590-1683 | `src/quests.js` | SIMILAR-DIFFERENT-TUNING |
| Save format | 199-425 | `src/save_files.js`, `main.js` | DIFFERENT-DESIGN |

## Gaps

- Out-of-range definitions not read in full: `Skill()` (1691 onward), `You()`, item and creature tables. Titles' stat rewards come from skill perks I grepped but did not read in full.
- UNKNOWN: whether YAIRPG has a night or day equipment-buff system beyond `is_night` stat refresh (`main.js:6539-6552`). I did not read that function.
- UNKNOWN: whether YAIRPG has any companion or pet other than the fork's party system. I did not grep party files.
- UNKNOWN: how weather season tables behave in autumn and winter in detail; I read spring, summer and sampled winter via grep. Exact probabilities for autumn were not tabulated.
- INFERRED: the `getHour()<5&&getHour()>16` condition (never true) means night-time "clear" results never trigger as written; confirmed by reading the condition but not by running the game.
- INFERRED: Sun/Moon charm `un()` does not refund every buff; relies on `stat_r()`. Not run.
- No in-game verification of any Proto23 behavior; static read only.

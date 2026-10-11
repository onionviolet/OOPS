# R5: Proto23 map, dialogue, weather, time, save and tick vs YAIRPG

Coverage: Proto23 `index.html` (rev e93a8cd) lines 11500-14768 read in full (11500-14768, 100%). Out-of-range lines read for dependencies only: 143-425 (globals, save, load), 883-965 (weather defs, `time`), 1611-1681 (quests), 2425-2437 (slumber pill), 8040-8300 (areas, sectors), 9005-9040 (scout action), 9795-9850 and 9970-9995 (export, import, autosave), 10023-10038 (`offline_a`), 11127-11135 (`chs`), 11454-11475 (`smove`). YAIRPG files read: `src/game_time.js`, `src/weather.js`, `src/save_files.js`, `src/save_migration.js`, `src/world_rhythm.js`, `src/village_content.js`, `src/proto23_world_*.js` (ids, actions, content head), and the relevant parts of `src/data/locations.js`, `src/data/dialogues.js`, `src/data/npcs.js`, `src/main.js`. Not exhaustively read: the other ~340 fork files, item/creature/vendor definitions on the Proto23 side, tests.

Labels: SHOWN = read directly in the cited line. INFERRED = my reading of what the code does at runtime. UNKNOWN = not determinable from the source. All Proto23 line numbers are `index.html`. All dialogue is paraphrased.

---

## 1. Headline differences

1. **Proto23 is a menu-driven screen game, YAIRPG is a travel-graph game.** A Proto23 "location" is a `Chs` screen whose `sl()` rebuilds a clickable choice list (11520-11529, 11127-11135). Moving is instant (`smove`, 11459). YAIRPG locations are graph nodes with `connected_locations` and `travel_time` minutes (`src/data/locations.js:376,409,494`; `models/location.js:200`).
2. **Proto23 weather is a 13-state per-season Markov chain** with durations in game minutes (13207-13552). YAIRPG has no weather state, only a deterministic temperature formula plus a 13-day rain cycle (`weather.js:9,37,194`).
3. **No real offline progress in either game.** Proto23 `offline_a()` (10023) is defined and never called (INFERRED from grep: only the definition and `global.zone_a_p` setup exist). The name `offline_evil_index` is a shop price multiplier, not an offline tick (11199, 11256).
4. **Proto23 save is one base64 string of `|`-separated JSON blobs in localStorage key "v0.3" with no migration layer**; load is tolerant via `||` defaults and fails to a "SOMETHING BROKE" banner (199-276, 285-425). YAIRPG has a validated envelope, versioned migration, a 4 MB quota guard, import preflight and rolling backups (`save_files.js`, `save_migration.js`, `main.js:1314-1318`).
5. **Proto23's Catacombs are an unreachable 26-room maze** (12917-13204): nothing in the file links to `chss.catamn` (grep: only self-references). No enemies, no scout tables. Treat as unfinished.
6. **The dojo is Proto23's whole progression spine** (training tiers, golems, level-gated rewards every 5 levels, skillbooks, free Sunday meal). YAIRPG has no dojo; its Village hub is built around the elder/rats/mill/bridge quest line.
7. **Scouting is a different system.** Proto23: a per-location hidden-loot table rolled once a second by the "Investigate" toggle, with a rising-chance schedule. YAIRPG: single `GameAction`s ("explore", "search for boars") with Perception thresholds that unlock a location.

---

## 2. Time

### 2.1 Proto23 (SHOWN)

| Item | Mechanic | Line |
|---|---|---|
| Unit | `time.minute` is the master counter; year/month/day/hour derived by integer division | 13641-13646 |
| Constants | YEAR 518400, MONTH 43200, DAY 1440, WEEK 10080, HOUR 60 min. So 12 months x 30 days, 24 h | 171 |
| Tick | `setTimeout` chain at `1000/global.fps`, fps = 1; each `ontick` adds `global.timescale` minutes (1 by default) | 13846, 13879-13881, 187, 181 |
| Real-time scale | 1 real second = 1 game minute; 1 game day ≈ 24 real minutes; a 90-day season ≈ 36 real hours; a year ≈ 6 real days (INFERRED from the constants) | 171, 13846 |
| Sleep | entering the bed screen sets `timescale = 5` and the Slumber effect; leaving resets to 1 | 12859-12863 |
| Slumber Pill | runs `ontick()` 1080 times in a loop (18 h), no real-time wait | 2433-2435 |
| Start date | default `time.minute = 338144100` = year 652, month 4, day 13, 07:00, Monday (INFERRED arithmetic) | 961-963 |
| Week | `time.day % 7`, index 0 = Monday | 13630, 962 |
| Seasons | months 3-5 spring, 6-8 summer, 9-11 autumn, 12/1/2 winter | 13634-13639 |
| Moon | `(day % 62.64 / 7.83) << 0`: 8 phases, ~62.6-day cycle | 13633, 188-190 |
| Display | clock click cycles 3 weekday display modes (`tmmode`) | 9226, 13605, 13848 |
| Daily proc | when `floor(minute/DAY)` changes: daily plans, every vendor `onDayPass`, moon icon, season label, `offline_evil_index += 0.00008` | 13852-13856 |
| Weekly proc | weekly plans (`plans[2]`), e.g. basement infestation `+5..15` rats | 13858-13860, 14177-14181 |
| Day/night flag | `isday` for hour 6-21; at night outdoors, 0.002% per tick (x `stdstps`) of a "star particle" item | 13862-13863 |
| Per tick extras | effect ticks, creature effects, battle step (`fght`) or Meditation XP, furniture `use()`, satiety drain, sleep time stat | 13864-13876 |
| Satiety drain | `sdrate`; x3/(1+0.03*Water-resist skill) when wet; plus cold duration/1000/(1+0.05*Cold-resist) when winter | 13869-13872 |
| Decay (planner) | item rot rolls daily; rate divisor 0.5 in summer, 2.5 in winter (carried items); 0.25 / 1.25 for the home storage box (as coded) | 14106-14158 |

### 2.2 YAIRPG

| Item | Mechanic | Line |
|---|---|---|
| Calendar | 12 months x 30 days, 24 h, `day_count` for weekday; start year 999, month 4, day 1, 08:00 | `game_time.js:18-39,195` |
| Seasons | months 1-3 spring, 4-6 summer, 7-9 autumn, 10-12 winter | `game_time.js:63-75` |
| Moon | 4 named phases on a 29.5-day cycle | `game_time.js:110-117` |
| Time of day | Night 21-04, Dawn, Day, Dusk labels; `night_time` 20..4 | `game_time.js:77-83,5-8,185` |
| Tick | `tickrate = 1`/s; adaptive `setTimeout` with drift correction | `main.js:1322-1325, 6611-6620, 7055-7072`; `config.js:19` |
| Sleep | 6 game minutes per tick | `config.js:23`; `main.js:6540` |
| Time sinks | `progress_time` also advances for travel, actions, reading | `main.js:6578-6580` |

### 2.3 Comparison

| System | Class | Play-feel consequence |
|---|---|---|
| 1 s = 1 game min, 30-day months, 12 months | SAME | Same pacing grammar. A player used to YAIRPG's clock feels at home. |
| Sleep multiplier 5 vs 6 | SIMILAR-DIFFERENT-TUNING | Trivial. |
| Season month mapping (spring Mar-May vs Jan-Mar) | SIMILAR-DIFFERENT-TUNING | YAIRPG's default start month 4 is **summer**; Proto23's start month 4 is **spring**. If a YAIRPG Proto23 branch imitates Proto23 weather by season, align the mapping explicitly. |
| Moon 8 phases / 62.6 d vs 4 phases / 29.5 d | SIMILAR-DIFFERENT-TUNING | Proto23 uses the new moon for a night-only herb (11903). |
| Daily/weekly plan hooks (`plans[1]`, `plans[2]`) | PROTO23-ONLY (as a generic registry) | Cheap way to run "once per day/week" events; YAIRPG does recurring availability by pure calendar math instead (`world_rhythm.js:15-30`). |
| Slumber pill instant 18 h loop | DIFFERENT-DESIGN | YAIRPG routes long waits through `progress_time`. |
| Item rot scaled by season | PROTO23-ONLY | Summer food spoils faster, winter slower (carried), a real pantry-planning lever. |

---

## 3. Weather and seasonal effects

### 3.1 Proto23 (SHOWN)

- **States (13):** Sunny, Cloudy, Stormy, Overcast, Storm, Thunderstorm, Rain, Heavy rain, Misty, Foggy, Drizzle, Clear, Snow, Snow Storm (ids 100-113) (888-901). Rain-type flag `frain`, snow flag `fsnow`.
- **Engine:** `wManager()` decrements `w_manager.duration` by `timescale` each tick; at zero it rolls `rand(1,100)` against a per-season, per-current-state table and calls `setWeather(state, duration)` with durations of roughly 11-900 game minutes (13207-13552, `setWeather` 13595-13601). One switch block per season: spring (13211), summer (13298), autumn (13384), winter (13472).
- **Season shape (SHOWN):** spring cycles most freely (all states except snow); summer prefers long Sunny/Clear stretches (sunny 300-500 min, 13303) and thunder is rare (heavy rain → thunder only 3%, 13347); autumn is wetter (cloudy → stormy 30%, → rain 30%, 13394-13396; heavy rain → thunder 25%, 13434); winter has only sunny, cloudy, overcast, rain, misty, foggy, drizzle, clear, snow, snow storm (no stormy/storm/heavy rain/thunder, 13472-13548) and cloudy → snow 30% (13487).
- **Fall-through:** any state with no case in the current season (e.g. snow in spring) hits `default` and becomes Clear for 30-60 (13295, 13381, 13469, 13549).
- **Bug (INFERRED):** the night branches test `getHour()<5 && getHour()>16`, which can never be true (e.g. 13217, 13226, 13302). The "Clear at night" outcomes are dead and the roll falls through to the last `else` (a short Sunny).
- **Cosmetic labels:** the weather box is renamed by hour (Sunrise, Dusk, Bright Night, Night, Rainy Night, Misty Morning, Starry Night, etc.) (13556-13591). The sunrise test `(hour>4 && minute>=30) && hour<=6` only matches minutes 30-59 of hours 5 and 6 (13558).
- **Gameplay effects:**
  - Rain family (storm, thunder, rain, heavy rain, drizzle): outdoors applies the Wet effect to player (unless `rnprtk`) and the current enemy (903-919).
  - Thunderstorm: 0.09% per tick outdoors for a lightning strike, 200 / (1+0.05 * Abnormal-resist level) damage, can kill and records cause of death (911-922, `getlastd` 13987).
  - `israin`/`issnow` flags and a 🌧 / ❄ icon (13599).
  - Winter: while outdoors a Cold effect accumulates every tick; snow/blizzard adds more, being wet adds more; cold comes in random bursts (`wsnburst` 200-1300 ticks) separated by rests (`wsnrest` 20-100 ticks) (13607-13626).
  - Satiety drains faster when wet or cold (13869-13872).
  - Village Center flavor text switches by weather (12200-12204); children sing, or throw snowballs in winter (8278-8284).
  - Moonbloom herb only spawns 00:00-03:59 on a new moon in the hidden grave (11903).
  - Unknown: interaction of weather with combat accuracy or hunting (not in range; UNKNOWN).

### 3.2 YAIRPG

- Temperature = 20 + season offset (winter -20, spring -5, summer 0, autumn -8) + day/night offset + a pseudo-random day-count term + rain term, then a location multiplier (`weather.js:9-13,15-18,21-33,37-51,75-96`). Smoothed between 05:00 and 14:00 anchors (`weather.js:100-186`).
- Rain is a fixed 13-day cycle: `day_count % 13` in {4,5,6,7,11} means rain (`weather.js:37-51,194-196`).
- Light level: night shift with 30-minute ramps, or a staged "dark" location type (`weather.js:198-248`).
- Effects: rain adds a counter toward Wet; snow soaks slower (`main.js:6656-6680`); cold status tiers come from temperature (`data/character.js:19`); several activities are season-gated (`locations.js:1846,1866,1921`).

### 3.3 Comparison

| System | Class | Play-feel consequence |
|---|---|---|
| Per-season weather Markov chain with durations | PROTO23-ONLY | Weather feels alive and unpredictable (storms build, fog burns off). YAIRPG's rain is a calendar you can memorise. |
| Lightning death risk | PROTO23-ONLY | Real stakes outdoors in thunder; YAIRPG has none (UNKNOWN whether a fork module adds one). |
| Numeric temperature and cold tiers | YAIRPG-ONLY | Proto23 has one binary Cold effect in winter; YAIRPG's gradient is more simulation-like. |
| Wet from rain | SAME | Both soak you outdoors. |
| Snow and snow storm | SIMILAR-DIFFERENT-TUNING | Proto23 has named snow states; YAIRPG shows a snow icon when temperature is below 0 during rain-cycle days. |
| Winter cold bursts / rests | PROTO23-ONLY | Cold arrives in waves, not continuously. |
| Time-of-day weather labels | SIMILAR-DIFFERENT-TUNING | Both show Night/Dusk; Proto23 fuses them with weather names. |
| Moon-gated herb | PROTO23-ONLY | Small "come back at the right hour" hook. |
| Season-gated work | YAIRPG-ONLY here (`availability_seasons`) | Proto23 gates by hour/weekday, not season, in this range. |

---

## 4. Map graph and location catalog

### 4.1 Graph (SHOWN)

Hub: **Village Center** (`lsmain1`, id 106, 12198). Exits: Message Board, Dojo, Southern Forest (gated), Western Woods (gated), Marketplace (unlocked by pamphlet), Home, Food stand, Shady Kid (15% chance per visit, 12240), Cat (until adopted). Leaf rules: every `sl()` ends with a "Return" choice. Sectors (`addtosector`, 8224-8227) group screens for shared hooks (home, vcent, forest1, cata1, vmain1; 8233-8296). `smove` also costs 0.08 durability on the boots slot (index 6) and gives 0.25 Walking XP at most once per 500 ms (11461-11462).

Gates: Western Woods requires level 6 (12217). Southern Forest requires `frst1u`, set only by accepting Monster Eradication, which needs level 20 and the second dojo course done (12033-12036, 12212). Marketplace requires reading the "Pamphlet" (12222; pamphlet appears 40% per Village visit after the first dojo reward, 12251-12253; reading takes 3 h, 5453-5459). Herbalist appears only after Yamato's bag errand (`phai1udt`, 11958, 12267). Hidden grave needs a 0.8% scout hit in the Underbushes (12159). Basement door needs the dojo-gift key, then the basement is infested until cleared (12713-12716, 12792-12794). Catacombs: no inbound link found (see headline 5).

### 4.2 Location catalog

Format: name (id), line, what it offers. "Area" = combat zone initialised by `area_init` (10744).

| Location (id) | Lines | Offers |
|---|---|---|
| Dojo intro (101) | 11532-11551 | Opening scene: one-click chain, one game day passes, UI panes unlock, you receive a stick weapon and 15 cure grass, then Difficulty screen. Only runs when `gameone === false`. |
| Dojo difficulty (102) | 11553-11576 | Pick Easiest/Easy/Normal training dummy course (areas trn1/trn2/trn3: 10/20/50 dummies; 8082-8103). Entry auto-resets to a neutral area. |
| Dojo reward (103) | 11577-11586 | Per-course reward (course 1: 4 apples + 5 herbs; course 2: 2 bread + 5 herbs + sandals; course 3: vest at 70% durability, + 10 copper coins if flag). Finishing all three grants title Initiate and goes to lobby. |
| Dojo lobby (104) | 11588-11753 | The hub: skillbook pick (6 weapon families, one time), Infoboard, "Destroy more dummies" (endless area), 4 golem challenges (levels 20, 23, 25, 28), turn in dojo gear for copper, free Sunday meal, Level Advancement rewards every 5 levels (5-30), crate delivery, second skillbook pick. |
| Dojo infoboard (160) | 11758-11799 | Four flavor notices plus a hand-strength test (punch dummy, formula at 13681). |
| Golem aftermath (124/125/126/162) | 11801-11831 | Instructor reward lines: 10 minor potions; fake sword + accessory; low-tier scroll; finish second course. |
| Free training (105) | 11833-11840 | Endless dummies (area trn, 10000; trnf after Instructor's gift). |
| Western Woods gate (113) | 11842-11857 | Lodge, "Delve inside", "Hunt indefinitely" (after discovery), back. |
| Yellow Path (114) / Shaded Path (120) / Underbushes (115) | 11870-11897, 12133-12173 | Hunting loops (areas frstn1a2, frstn2a2, 60 and 50 enemies; rabbits and slimes lvl 1-8); each clear grants loot rolls and respawns. Underbushes has the scout table and the secret passage. |
| Hunt indefinitely (130) | 11859-11868 | Endless hunting area (size -1, protected). |
| Round Branches / hidden grave (161) | 11870-11905 | Ambush with level 9-11 slimes first (20-24 enemies), then a story beat: bury the skeleton → sword, +3 karma, +1 luck. |
| Hunter's Lodge (118) | 11908-11962 | Yamato: first-meeting talk, jobs, "tell me something", firewood sale, satchel/crate errands. |
| Lodge sub-screens (164, 163, 121, 119) | 11964-12131 | Knowledge menus (ranks, monster classes); firewood shop (15 copper each); job board (Firewood, Hunt, Eradication). |
| Southern Forest gate (168), Foliage (169) | 12175-12195 | Hunting loop (wolves lvl 7-8, slimes lvl 10-11; 48 enemies). |
| Village Center (106) | 12198-12256 | Hub, see 4.1. Flavor line keyed to weather. |
| Marketplace (127) | 12258-12305 | Grocery, General Store, Herbalist (if unlocked), Nervous Guy (dead-end NPC), Guard job; ambient overheard-chatter messages every second at 10% (12298-12301). |
| Entry gate (159) | 12307-12332 | Guard job: stand idle, Patience XP, rare coin drops; ends at 20:00; pays 65 copper + 3000 EXP; repeatable. |
| Nervous Guy (165) | 12334-12340 | Flavor only. No quest hook exists in this range (UNKNOWN beyond). |
| Grocery (128), General Store (129), Herbalist (166) | 12343-12440 | Shops with restock timers, small scouted coin find (1%), General Store buys straw baskets (15 each) and sells the basement smoke bomb (5 silver); Herbalist buys cure grass in bundles of 50 (15 copper) with a 7-sale gift. |
| Street Food Stand (116) | 12443-12457 | Food seller; can be removed by a skill-gated, 20% rumor roll that he left town (12228-12239). |
| Child Trader (123) | 12459-12520 | Shop plus two one-off hidden-stash books (3 silver after Fight level 5; 5 silver after 1000 lifetime copper earned). |
| Cat (107) | 12544-12598 | Petting minigame; 100 pets recruits the cat to your home. |
| Message Board (108) | 12602-12641 | Random flavor notices; unlocks Guard job (Notice #4) and Southern Forest ban notice after the first Yamato rewards. Dollmaker kid quest trigger. |
| Xiao Xiao (167) | 12643-12674 | Doll-gift quest (4 doll types, only the soul doll satisfies; reward accessory and a small price-multiplier drop). |
| Reading (109) | 12676-12691 | Not a place: book reading tick loop; time shrinks with Reading skill. |
| Home (111) | 12693-12785 | Free bag items once, stash items once, rest, furniture list, fireplace, storage box, cat check-in, basement door. |
| Basement (158) | 12790-12837 | Dark effect; infestation encounter (area hmbsmnt) or exploration; carry the large chest up (+1 STR permanently); unlocks Investigate action. |
| Bed (112) | 12839-12863 | Sleep at 5x speed; heals; bed quality and cat modify. |
| Fireplace (117) | 12865-12902 | Burn firewood, coal, charcoal, sticks; light with wood pile. |
| Storage box (131) | 12904-12911 | Container UI. |
| Catacombs (132-157) | 12913-13204 | 26 nodes: entryway, then a one-way-looking maze with directional arrows and random ambient lines; named rooms (e.g. "Son's Last Visit"). No encounters, loot, or entrance. UNKNOWN intended design. |
| Test screens (-1) | 12522-12542 | Developer stubs. |

### 4.3 YAIRPG map

SHOWN `src/data/locations.js`: about 138 `locations["..."]` entries (SafeLocation, CombatZone, ChallengeZone), linked by `connected_locations.push({location, travel_time | custom_text})`. Core spokes from "Village": Shack (10 min, 376), Eastern mill (30, 409), Infested field (15, 470), Infested woods (40, 494), Nearby cave (60, 524), Forest road and Downstream/Riverbank (743, 1386, 1410), with Cave → Mountain camp (140 min, 1351), Forest → Town outskirts → Slums/Farms/Town square → guilds and cafes (966-1296), Riverbank → Lake beach → Waterfall → Swamp tribe (1388-1657), plus ChallengeZone spars. Safe locations hold `activities` (work, gathering, exercise; `availability_time/seasons`) and `actions` (one-shot or repeatable quest steps). Sample Village activities: fieldwork 06-20 Spring-Autumn (1838-1848), swimming/fishing seasonal, patrolling with Tessa (the patrolling activity after swimming). Crafting is a per-location `LocationCrafting` tier table (`locations.js:348-360`).

### 4.4 Comparison

| System | Class | Play-feel consequence |
|---|---|---|
| Screen-per-place menus vs graph with travel minutes | DIFFERENT-DESIGN | Proto23 feels like an interactive fiction book; every click is a decision. YAIRPG's travel costs time and invites route planning. |
| Dojo training ladder | PROTO23-ONLY | Clear early tutorial arc and 5-level reward cadence, strong sense of institutional belonging. |
| Hunting loops as repeating `Area`s with `onEnd` loot rolls | SIMILAR-DIFFERENT-TUNING | YAIRPG combat zones also repeat (enemy_count, groups killed). Proto23 hands out a fixed bundle each clear, YAIRPG uses per-kill drops (UNKNOWN full parity). |
| Levels as hard gates (6, 20) | SIMILAR-DIFFERENT-TUNING | YAIRPG gates by quest flags and skill checks rather than character level. |
| Unlock-by-reading-a-pamphlet (Marketplace) | PROTO23-ONLY | Discovery through an inventory item; a lightweight "knowing the town" mechanic. |
| Home with fireplace, bed, cat, storage, basement | SIMILAR-DIFFERENT-TUNING | YAIRPG has Shack, housing and furniture (`LocationHousing`; fork modules). The cat (earned by 100 pets) is PROTO23-ONLY. |
| Catacombs maze | PROTO23-ONLY (unfinished) | YAIRPG has cave/tunnel zones with real combat. Do not copy the maze without a design pass. |
| Random sub-visibility (Shady Kid 15%, Pamphlet 40%) | PROTO23-ONLY | Makes the hub feel unpredictable at near-zero cost. |
| Existing fork Proto23 branch | YAIRPG-ONLY | `src/proto23_world_*.js` is an original, independent visitor branch (Village Center, Dojo lobby, cottage) with a steward and tutor, not a port of any screen above. |

---

## 5. NPCs, dialogue and quest hooks

### 5.1 Proto23 NPC table (SHOWN)

| NPC | Where | Lines | Role and hooks |
|---|---|---|---|
| Instructor (unnamed) | Dojo | 11533-11830 | Intro scolding; rewards; golem coaching; gear buyback (copper values 1-3 per item); free meal on Sundays; crate delivery; all the level rewards. |
| Head Hunter Yamato | Lodge | 11908-12131 | Quest giver (fwd1 firewood, hnt1 meat, lmfstkil1 wolves). Reacts to the skeleton's sword. Sends you to the notice board, herbalist, and dojo with parcels. |
| Herbalist | Marketplace | 12402-12435 | Buys herbs, recognises you from the dojo, gives parcel reward and a return package for Yamato. |
| Old Lady (grocer) | Marketplace | 12343-12356 | Shop only. |
| Sleeping Old Man | Marketplace | 12364-12395 | Shop; basket buyer; basement smoke-bomb seller. |
| Street Merchant Ran | Village Center | 12443-12457 | Food stand; vanishes after a trading-skill rumor roll (12228-12239). |
| Shady Kid | Village Center (15%) | 12459-12520 | Child trader; two hidden-stash books gated by Fight level and lifetime copper. |
| Xiao Xiao | Message board | 12604-12674 | Appears 15% of visits when you carry any doll between 09:00 and 19:59; wants the soul doll. |
| Lookout Guard | Marketplace gate | 12274-12293, 12307-12332 | Job giver, hour-gated. |
| Gate Guard | Village Center | 12212-12217 | Gate text: refuses by level or permit. |
| Paper Boy | Village Center | 12251-12255 | Gives the pamphlet. |
| Nervous Guy | Marketplace | 12334-12340 | Placeholder. |
| Passerby | Village Center | 12232-12236 | Explains the food stand left. |
| Cat | Village Center / Home | 12544-12598, 12734-12773 | Pet 100 times to adopt; one-time rename (blocks "Kiri" prefix with a joke line, 12743); cat brings gifts daily 3% to the home sector (14183-14190). |
| Head of the Guard Hitoshi | Message board | 12630-12631 | Signed warning about the south. |
| Dein (offscreen) | Skeleton story | 11915-11917 | Missing deputy chief; returned sword pays 300 copper (11923). |

Quest hooks (definitions out of range 1611-1672, SHOWN as far as read): `fwd1` Firewood (10 bundles; reward 100 copper, buckler, EXP 15000), `hnt1` First Hunt (10 raw meat; 130 copper, 10 jerky), `grds1` Guarding Duty (repeatable; 65 copper, 3000 EXP), `lmfstkil1` Monster Eradication (35 wolves; 300 copper, spear, neck guard, 18000 EXP; a death callback also triggers a "piercing wail" teaser at 35 kills).

### 5.2 Dialogue mechanics (SHOWN)

- Imperative click chains: each response is `chs(text,false).addEventListener('click', ...)` nested inside the previous one (e.g. 11909-11930). `chs(text,true)` clears the panel and sets the NPC line (11127-11129).
- Branching is local: menus return with `smove(sameScreen,false)` which re-runs `sl()`; persistence is by `global.flags.*` and `quest.*.data`, not by a dialogue-state object.
- Conditions are inline (item `.have`, level, hour, weekday, flags, random). Examples: Sunday meal (11671), hour windows for the guard (12275), `random()<.15` Shady Kid (12240).
- Text is random-selected from short arrays for flavor (11579, 12345, 13885).
- Knowledge menus: Yamato's "Tell me something" teaches six monster categories and ten monster ranks (G to SSS) (11964-12003). A one-line aside says the village has never seen anything above E rank (11969).
- Saved state: `chss[*].data` is saved if non-empty (265-266), but dialogue progress itself is flags, not stored per-line.

### 5.3 YAIRPG

SHOWN `src/data/dialogues.js:10-80`, `data/npcs.js:63-85`, `components/dialogue_component.js:45`, `quests.js`: dialogue is a persistent `DialogueComponent` of `Textline`s with `is_unlocked`, `locks_lines`, `rewards: {textlines, quest_progress, locations, activities, ...}`; text lives in locale keys (e.g. `"elder hello answ"`). 15 dialogue NPCs (elder, guard, craftsman, millers, suspicious man, slum woman, gate guard, farm supervisor, nekomimi proprietress, swamp chief/cook/tailor/tanner/scout, cute rat) plus 5 traders; 12 quests (`quests.js`, e.g. "Lost memory", "The Infinite Rat Saga", "It won't mill itself"). Starting location also gets NPC list via `npcs: [...]` (`locations.js:345`).

### 5.4 Comparison

| System | Class | Play-feel consequence |
|---|---|---|
| Inline nested click dialogue vs data-driven textline graph | DIFFERENT-DESIGN | Proto23 reads faster and is easier to improvise, but cannot be localised, validated or inspected. YAIRPG's data model fits the fork's tooling and migration rules. |
| One strong mentor NPC who steers the tutorial (Instructor / Yamato) | PROTO23-ONLY | Early game has a person who tells you what to do next. YAIRPG's elder does a similar job but with fewer small errands. |
| Parcel relay chain (hunter → herbalist → hunter → dojo → key) | PROTO23-ONLY | Cross-NPC errand that doubles as a map tour. |
| Quest give/turn-in with item counts | SIMILAR-DIFFERENT-TUNING | YAIRPG quests use tasks with progress; same shape. |
| Randomised appearances (Shady Kid, Xiao Xiao, Paper Boy) | PROTO23-ONLY | Surprise encounters; YAIRPG NPCs are fixed. |
| Ambient overheard market chatter | PROTO23-ONLY | Cheap texture (25 lines, random colours, 12299-12300). YAIRPG has `getBackgroundNoises` per location (`locations.js:313`). SIMILAR in spirit. |
| Moral choice (bury the body) with karma/luck | PROTO23-ONLY | One-off decision with a permanent stat reward; fits YAIRPG's life-sim goals as a small beat. |
| Pet bonding (100 pets) | PROTO23-ONLY | Self-paced affection loop; leads to a companion with presents. |

---

## 6. Scouting and discovery

### 6.1 Proto23 (SHOWN)

- **Action:** `act.scout` "Investigate" (9015-9040). Unlocked by `giveAction(act.scout)` in the basement (12816). Needs light (`cansee`), civil state, not sleeping/reading. Ticks once per second via `timers.actm`. Tells you "You sense something" if something remains (9025).
- **Engine:** `scoutGeneric(chs)` (13812-13819): picks a random entry from the location's `scout[]`; adds `2*(1+0.2*scoutLvl)` to a `scout` counter; when it reaches `scoutm` the counter resets and the next roll gets x5; a hit requires `random() <= c * m * (1+0.15*scoutLvl) * (1+0.2*gotmod)`, where `gotmod` = how many finds that location has produced (so each find raises later chances). XP to the Scout skill: 0.3 per roll, plus `exp` or `0.5/c` on a hit. Ends with "nothing of interest left" when all entries are collected (13817-13818).
- **Tables SHOWN:**

| Location | Lines | Finds (chance per roll) |
|---|---|---|
| Underbushes (115) | 12157-12161 | Hidden passage to the grave (0.8%). |
| Hidden grave (161) | 11900-11905 | Half-buried pouch with 3 Moonbloom (0.9%); Moonbloom at 00:00-03:59 on new moon (0.05%). |
| Grocery / General / Herbalist | 12357-12361, 12396-12400, 12436-12440 | Coin on the ground (1% each, scoutm 200). |
| Home (111) | 12780-12785 | Old knife (0.6%), coin in the floor (1%), plus cat-gift entry in sector table (8240-8244). |
| Basement (158) | 12828-12837 | Coin pouch (1%), firewood and charcoal (3%), journal book (3%) with a narrative blurb. |
| Forest sector | 8285-8291 | Passive "Area Explored" counter of 7000 gives 7000 EXP; counts in combat or scouting (+0.1/tick). |

### 6.2 YAIRPG

SHOWN `data/locations.js:2847-2884, 2995-3029`: `GameAction`s with `attempt_duration`, `success_chances: [low, high]` interpolated between two Perception thresholds, rewards that unlock a location or action and give Perception XP. Fork additions: `village_content.js:22-30` "Investigate the disused waypost" (single search, 3 min, quicker with Perception 3).

### 6.3 Comparison

| System | Class | Play-feel consequence |
|---|---|---|
| Toggleable background search, persistent hidden table per room | PROTO23-ONLY | A "fidget" loop that makes every safe room worth a few idle minutes; rewards small but frequent. |
| Growing chance with each find (`gotmod`) | PROTO23-ONLY | Odd: success raises later success; keep in mind if porting. |
| One-shot Perception-gated discoveries | YAIRPG-ONLY (core) | Clean skill gate, no luck-only loops. |
| Skill-scaled search speed and chance | SIMILAR-DIFFERENT-TUNING | Both reward Perception/Scout skill; formulas differ. |
| Area-level passive explore meter | PROTO23-ONLY | Rewards time spent hunting. |

---

## 7. Titles (as granted in range)

SHOWN: `giveTitle` (13760-13767): pushes to `global.titles`, makes it current, runs `talent()` once, `onGet()`, and announces. Granted in this range: Initiate after all three dummy courses (11584); Quartermaster after returning 300 dojo items (11660); the "no death by level 20" title (13730). Others referenced by area end hooks (`thr`, `aptc`; 8075, 8165). YAIRPG: `character.titles` saved in `create_save` (`main.js:4392`); no equivalent dojo-style ladder in core. Class: SIMILAR (achievement titles), DIFFERENT-TUNING.

---

## 8. Save, load, import and export

### 8.1 Proto23 (SHOWN)

| Item | Mechanic | Line |
|---|---|---|
| Storage | `localStorage["v0.3"]` | 273, 286 |
| Format | one string: segments joined by `|` — player, effects, skills, skill XP, globals+stats+flags, recipes, inventory by type, area sizes, discovery, furniture, vendors, titles, home pointers, quests, actions, sectors, containers, per-location data, the literal `savevalid`, title talents — then UTF-8 → custom Base64 | 207-272 |
| Save-time hack | unequips and re-equips gear, temporarily freezes monsters and removes type-5 effects to get true base stats | 204-215, 228, 269-270 |
| Autosave | opt-in checkbox, every 30 s (`save(true)`) | 418, 9976-9977 |
| Manual save | `Game Saved` message | 274 |
| Export | text or file download, filename includes name/version/timestamp/"[Proto23]" | 9795-9806 |
| Import | text box or `.txt` file; requires substring `savevalid`; writes to **`"v0.2a"`**, then calls `load(t)` | 9825-9850 |
| Delete | `localStorage.clear()` (whole origin) | 9994 |
| Load | restores everything field by field, with `||` defaults for newer fields; re-resolves items by id; rebuilds vendor stock, quests, sectors; calls `smove(lastLocation,false)` | 285-425 |
| Failure | an error div is shown first and removed only at the end; a thrown exception mid-load leaves it on screen advising to delete the save | 289-293, 417 |
| Version | `global.ver = 470` stored only as a stat (`lastver`); there is no migration step | 173, 180 |
| Combat on load | combat state is dropped; always loads in the safe `area.nwh` | 365 |

INFERRED: because Import writes "v0.2a" but the boot loader reads "v0.3" (197, 286), an imported save is live in memory until the next save overwrites "v0.3"; reloading before saving would restore the previous slot. UNKNOWN whether a separate "v0.2a" migration exists elsewhere.

### 8.2 YAIRPG (SHOWN)

| Item | Mechanic | Line |
|---|---|---|
| Storage key | `"save data"`, dev `"dev save data"`, backup `"backup save"` | `main.js:307-310` |
| Autosave | every 60 ticks (~60 s) and a backup every 3600 ticks | `main.js:1314-1318, 7012-7035` |
| Format | JSON (game version, current time, flags, character, inventories, quests, expansion state, pack state, ...) | `main.js:4369-4400` |
| Export | `YAIR-UTF8-1:` + base64 of UTF-8; older Latin-1 files still read | `save_files.js` decode/encode |
| Import | `importSaveFile`: decode, validate envelope, real-loader preflight, only then write | `save_files.js` |
| Validation | version ordering, per-world envelopes, XP/hero consistency, availability flags | `save_files.js: validateSaveEnvelope` |
| Migration | `prepareV06Save` upgrades pre-0.6 saves and legacy kits | `save_migration.js:1-26` |
| Guards | 4 MB quota, `ownsSave` single-tab lock, failures never delete the old save | `save_files.js`, `main.js:484` |

### 8.3 Comparison

| System | Class | Play-feel consequence |
|---|---|---|
| Local-first, base64 string, manual export | SIMILAR | Both let the player move saves by text or file. |
| Pipe-delimited segments, positional | DIFFERENT-DESIGN | Proto23's save breaks if a segment order changes (hence its warning screen); YAIRPG's structured JSON survives schema growth. |
| No migration, "delete the save" fallback | PROTO23-ONLY | Do not adopt. AGENTS.md requires a migration or explicit compatibility decision. |
| Opt-in 30 s autosave | SIMILAR-DIFFERENT-TUNING | YAIRPG autosaves by default at 60 s. |
| Combat resets on load | SIMILAR | Not confirmed for YAIRPG (UNKNOWN). |
| Delete via `localStorage.clear()` | PROTO23-ONLY | Wipes everything on the origin, a risk YAIRPG avoids. |

---

## 9. Offline progress and tick rate

- **Proto23:** No catch-up on load or tab return (SHOWN: load sets `time.minute` to the saved value, 337; `update()` ticks once per call, 13879-13881). Backgrounded tabs will run slower because browsers throttle timers (INFERRED, not code). `offline_a()` (10023-10038) models "docile vs predator vs forest" populations over time and would feed `offline_evil_index`, but nothing calls it, so the value only drifts +0.00008/day (13856) or -0.002 after the doll quest (12668). It multiplies shop prices (11199, 11256, 11319), so prices creep up slowly. Initial 1, loaded from save (334).
- **YAIRPG:** No wall-clock catch-up in core either (grep of `offline`, `bonus`, `visibilitychange` found none in `main.js`). The only time warp is sleeping (6 min per tick) and `progress_time` for travel and actions. The fork's `backlog_expansion_*` "offline packing" is a user-armed, escrowed batch of minutes, not a catch-up (`backlog_expansion_time.js:25-43`). Tick drift is actively corrected (`main.js:7055-7072`).

| System | Class | Play-feel consequence |
|---|---|---|
| No offline gains | SAME | Both are "played in an open tab" games. |
| Hidden economy drift (`offline_evil_index`) | PROTO23-ONLY (dormant) | A slow-rising shop price is a quiet inflation rule; port only with a visible explanation. |
| Drift-corrected tick | YAIRPG-ONLY | Steadier clock in long sessions. |

---

## 10. Startup and misc

- On `window.load` the game calls `load()`; with no save it keeps the defaults, runs the dojo intro if `gameone===false` (197, 11549-11551), seeds the home with a fireplace and bed (11550) and fills the home storage box once with starter gear (404-412). The load overlay fades in 5 steps (424).
- The first call to `wManager()` and `setWeather(clear,600)` happen at definition time (13601, 13605).
- Debug helpers left in: `_dbgspawn`, `_drawmap`, `_drawmwindow` (mastery constellation tree with link unlocks), `giveall` stub, a hidden 1e-8 per tick laugh sound (13875). Masteries (14297-14420) are a skill-tree prototype with unlock links (`linkfrom`/`linkto`); no content gating in this range. UNKNOWN whether released builds expose it.
- RNG is a Mersenne Twister seeded from the clock (14439-14598), used by `random()`; save does not store the seed (INFERRED).

---

## 11. Master comparison table

| # | Proto23 system | YAIRPG equivalent | Class |
|---|---|---|---|
| 1 | Chs screens, instant moves (11520, 11459) | Graph with `travel_time` (`locations.js:376`) | DIFFERENT-DESIGN |
| 2 | Village hub with ~9 exits (12198) | Village hub with NPC list and ~15 connections (`locations.js:297`) | SIMILAR-DIFFERENT-TUNING |
| 3 | Dojo ladder and golems (11588) | None in core; fork Proto23 branch uses an original tutor (`proto23_world_content.js`) | PROTO23-ONLY |
| 4 | Hunter's Lodge jobs (11908) | Farm supervisor, mill, adventurer guild jobs (`dialogues.js:996`, `locations.js:1235`) | SIMILAR-DIFFERENT-TUNING |
| 5 | Marketplace shops with restock (12343) | `traders.js` plus `market_saturation.js` | SIMILAR-DIFFERENT-TUNING |
| 6 | Hour-gated guard job (12274) | `patrolling` activity and `availability_time` (`locations.js:1846`) | SIMILAR-DIFFERENT-TUNING |
| 7 | Sunday free meal (11671) | `world_rhythm.js` recurring windows | SIMILAR-DIFFERENT-TUNING |
| 8 | Pet the cat, adopt (12544) | Cat cafe and nekomimi content (`locations.js:1178,1196`) | DIFFERENT-DESIGN |
| 9 | Home with fireplace, bed, cellar (12693) | Shack/housing, furniture (fork) | SIMILAR-DIFFERENT-TUNING |
| 10 | Catacombs maze (12913) | Cave/tunnel zones with combat | PROTO23-ONLY (unfinished) |
| 11 | 13-state seasonal weather (13207) | Temperature plus rain cycle (`weather.js`) | DIFFERENT-DESIGN |
| 12 | Lightning damage (911) | None | PROTO23-ONLY |
| 13 | Winter cold bursts (13607) | Cold tiers from temperature | SIMILAR-DIFFERENT-TUNING |
| 14 | Lunar herb (11903) | Moon phase exists but no gameplay hook found (UNKNOWN) | PROTO23-ONLY |
| 15 | 1 s = 1 min, 30-day months (171, 13846) | Same (`game_time.js`) | SAME |
| 16 | Sleep 5x (12859) | Sleep 6x (`config.js:23`) | SIMILAR-DIFFERENT-TUNING |
| 17 | Investigate toggle with hidden tables (13812) | One-shot Perception actions (`locations.js:2847`) | DIFFERENT-DESIGN |
| 18 | Titles on milestones (13760) | Titles in save (`main.js:4392`) | SIMILAR |
| 19 | localStorage base64 pipe string, no migration (199) | Validated JSON, migration, backups (`save_files.js`) | DIFFERENT-DESIGN |
| 20 | Opt-in 30 s autosave (9976) | Default 60 s plus rolling backup (`main.js:1314`) | SIMILAR-DIFFERENT-TUNING |
| 21 | No offline catch-up, dead `offline_a` (10023) | None in core | SAME |
| 22 | Price drift index (13856) | Market saturation (`config.js:8-10`) | DIFFERENT-DESIGN |
| 23 | Imperative nested dialogue (11909) | Textline graph (`dialogue_component.js:45`) | DIFFERENT-DESIGN |
| 24 | Item rot by season (14106) | Not found in the files read (UNKNOWN) | PROTO23-ONLY |
| 25 | Randomised NPC appearances (12240, 12251) | Fixed NPC lists per location | PROTO23-ONLY |

---

## 12. Ideas worth carrying (proposals, not decisions)

Labelled as proposals; none is accepted. They stay compatible with AGENTS.md (no code copied, original text):

- P1: A small **seasonal weather state chain** layered over YAIRPG's temperature, so rain and fog have duration and mood without replacing the temperature model. Keep the sealed-secret and migration rules in mind: it needs a saved state field.
- P2: **Hour/weekday windows** are already in YAIRPG (`availability_time`, `world_rhythm.js`); the dojo meal and guard shift show how much character a single recurring service gives.
- P3: **Per-room idle search** as an optional opt-in "look around" that never gates progress. The rising-chance feedback loop (`gotmod`) would need a cap.
- P4: **Rare hub encounters** (15% / 40%) as seeds for one-off scenes.
- P5: Do not copy the **pipe-delimited save**, the **import key mismatch**, or `localStorage.clear()`.

---

## Gaps

- Catacombs: no entrance in the lines read; UNKNOWN whether a later build links it (file is a single revision).
- Quest definitions beyond line 1672, item stats, creature stats, vendor stock lists, `chs_spec` shop UI, `giveItem` side effects: not read.
- `act.scout.use` tail (after 9040), `area_init` beyond line 10760, and the `mon_gen` / `fght` combat code: not read.
- Whether any YAIRPG fork module (beyond the files named) gives weather states, lightning, a lunar gameplay hook, or season-scaled item spoilage: not grepped exhaustively (371 source files).
- Counts of YAIRPG locations (138) came from a line-prefix grep of `src/data/locations.js` only; fork-added locations in other files are not included.
- Nothing was run in a browser. All runtime consequences marked INFERRED are from reading code.
- The Proto23 file is one revision (e93a8cd); later revisions may differ.

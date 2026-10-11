# Proto23 vs YAIRPG: full source audit

2026-10-10. Research only. Nothing here is an accepted decision, and no
gameplay changed.

## 1. Sources and coverage

- **Proto23**: the published single file at https://23html.github.io/,
  revision `e93a8cd617932fb698ff889b968a32f9a20d48f3`, SHA256
  `a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`
  (837,656 bytes, 14,768 lines). The live file fetched today matches that
  hash. All game code is inline JS from line 143, with no external scripts
  and no network calls. The only other assets are `ctst.png` and
  `laugh6.wav`. The copy was kept in the session scratchpad and is not in
  git.
- **Read in full**: all 14,768 lines, split across five Sonnet readers by
  line range. Each reader read its range line by line and grepped outside
  it only for context. Their reports, with line locators for every claim,
  are in [readers-2026-10-10/](readers-2026-10-10/):
  - [R1](readers-2026-10-10/R1_core_time_titles_effects_furniture.md),
    lines 1-1700: state, titles, weather, time, effects, furniture, quests
  - [R2](readers-2026-10-10/R2_skills_items.md), lines 1700-5595: 60
    skills, items, food, books
  - [R3](readers-2026-10-10/R3_equipment_creatures_areas.md), lines
    5595-8335: equipment, creatures, areas, scouting
  - [R4](readers-2026-10-10/R4_crafting_vendors_actions_combat.md), lines
    8335-11500: recipes, vendors, actions, combat, storage
  - [R5](readers-2026-10-10/R5_map_dialogue_time_save.md), lines
    11500-14768: map, NPCs, weather manager, save, tick
- **YAIRPG side**: the base systems in `src/` (items, skills, combat_math,
  enemies, locations, weather, game_time, crafting_recipes, trade, quests,
  save_files, main.js), read at the points the readers cite. The fork's
  roughly 300 expansion modules were only grepped by keyword, so
  "YAIRPG has none" means "none found in core or by keyword".
- **Not done**: neither game was run. Every play-feel statement is an
  inference from code.

Spot-checked directly by the main session: the skill XP curve and
milestone loop (1698, 13747), the uncalled `offline_a` ecology sim (10023),
the night weather branch that can never fire (18 sites, 13217 onward), the
`eqp_t` typo (1896, 2018), the import key mismatch (9831, 9849), the
unreachable Catacombs (only self-references to `chss.catamn`, 12917), the
durability wear of .008 per hit (10467), the Steak exact-level gate (8580),
and YAIRPG death being a `Recovering` XP ×0.2 effect
(`src/main.js:3223`, `src/active_effects.js:475`).

Correction to R3 (found 2026-10-10 after first save): YAIRPG does have a character level fed by kill XP; R3 said it did not. F2 and the system table are fixed.

Correction to R2: cumulative XP to skill level 10 is about 48k and to level
15 about 1.15M (cost of level 14→15 alone is about 498k). R2 gave 823k for
level 15.

## 2. The short answer: how they differ

| Code | Difference | Proto23 | YAIRPG |
|---|---|---|---|
| F1 | Core philosophy | Hand-scripted. Every item, skill perk and place is a closure that can do anything (`oneq`, `onGet`, `onLevel`). | Data-driven. Items and skills are declarative stat tables run by shared engines. |
| F2 | Character growth | Player level from kill XP, plus 60 skills with discrete milestone perks. Perks are the main power curve. XP cost grows superpolynomially with no cap. | A character level also exists, fed by kill XP (`src/models/combat.js:436`) and quest/location rewards (`main.js:2474`), but skills carry most of the power. About 69 skills with smooth multiplicative bonuses, a geometric curve, a level cap and a per-gain cap. |
| F3 | Food and hunger | 221 foods refill an energy meter. Fullness scales character XP (0.4 + 0.6×efficiency), hit chance and crit. Bad food trains Survival and Gluttony. | About 30 foods give timed stamina-regen buffs. No hunger meter. |
| F4 | Gear | About 140 fixed, hand-tuned pieces with durability (−.008 per hit, damage scales 10-100%), whetstone repair, 3 physical classes plus 7 elements, and 89 build accessories (luck, prices, drops, cook anywhere). | Component-built gear with a quality ladder. No durability, one physical damage number, stat-only rings and amulets. |
| F5 | Combat | One monster at a time, one round per second. A 2× speed gap gives multi-hit bursts. Creatures scale by level band. | Groups of up to 8, independent attack cooldowns, fixed templates with ± variation, stances. |
| F6 | World structure | Instant menu screens around a Village hub. The Dojo course ladder is the whole early spine. No travel time. | A location graph with travel minutes and a quest chain (elder, rats, mill, bridge). |
| F7 | Living-world texture | A 14-state seasonal weather Markov chain with lightning, seasonal food spoilage, 108 titles for lifetime counters (9999 cat pats, a decade at home), random hub encounters (15%), a cat that becomes a pet. | Deterministic temperature plus a 13-day rain cycle. A titles field exists in the save (`main.js:4392`) but there is no title catalog or grant system. |
| F8 | Economy | Vendors mostly only sell, at fixed copper prices. Selling happens through a few fixed-price NPC buyers, so income is scarce. | Open selling with market saturation and reputation and haggling discounts. |
| F9 | Engineering | One base64 pipe string in localStorage with no migration. Opt-in 30 s autosave. Many stubs and bugs (section 6). | Validated save envelope, migrations, backups, default autosave. |

Same in both: 1 real second is 1 game minute, months are 30 days, there is
no offline catch-up in core, and kill counts drive the bestiary. Seasons
are offset by two months: month 4 is spring in Proto23 and summer in
YAIRPG.

## 3. System table

Classes: SAME, SIMILAR (different tuning), DIFFERENT (design),
P23-ONLY, YAIR-ONLY.

| System | Proto23 | YAIRPG | Class |
|---|---|---|---|
| Clock, calendar | 1 s = 1 min, 30-day months, 8 moon phases | same clock, 4 phases | SIMILAR |
| Sleep | 5× time in bed, bed quality and cat modify healing | 6× (`config.js:23`) | SIMILAR |
| Weather | 14 states, per-season Markov durations, lightning, winter cold bursts | temperature formula plus rain table | DIFFERENT |
| Effects | tick scripts that train resistance skills: bleed, smoke, Fei pill poisoning, sun and moon charms | declarative stat effects, 4 cold tiers | DIFFERENT |
| Titles | 108 slots, about 80 real, counter triggers, a few perks | saved field, no catalog | P23-ONLY |
| Skills | 60, incidental XP, milestone closures | about 69, declarative, capped | DIFFERENT |
| Unusual skills | Ki Absorption ×6, Patting, Gambling, Drinking, Greed, Throwing | none | P23-ONLY |
| Food | 221 instant-restore foods, hunger scales XP, food poisoning chances | about 30 timed buffs | DIFFERENT |
| Spoilage, alcohol, EXP pills, permanent boosters | present | none in core | P23-ONLY |
| Books | 28 books, 0.5-30 h, Literacy shortens reading, some unlock UI (Bestiary, Journal), read books become home furniture | 12 base books, constant time, multiplier payoff | SIMILAR |
| Recipe discovery | stack thresholds (e.g. Cure Grass ×50), books, milestones | books, milestones, flags | SIMILAR |
| Crafting | fixed in and out, almost never fails, XP stops at a set level | success chance, quality, stations, tapering XP | DIFFERENT |
| Equipment | fixed pieces, closures, durability | components, quality, pure data | DIFFERENT |
| Damage types | 3 physical plus 7 elements | single physical | P23-ONLY |
| Creatures | 22 real plus 14 stubs, level bands, per-creature AI | 34 templates, tags, sizes | DIFFERENT |
| Player level | kill XP with low-level penalty | kill XP plus quest/location rewards (`combat.js:436`, `main.js:2474`) | SIMILAR |
| Death | sent home, lose up to 45% energy, no gear loss | unconscious, `Recovering` XP ×0.2 | SIMILAR |
| Vendors | template stock, restock timers, fixed prices, three-tier coins | template stock, 4-day refresh, saturation | SIMILAR |
| Selling | fixed NPC buyers | open with saturation | YAIR-ONLY |
| Scouting | "Investigate" toggle rolls hidden per-room tables each second, chance rises with each find | one-shot Perception-gated actions | DIFFERENT |
| Jobs | guard shift (65 copper plus 3000 EXP, ends 20:00), lodge errands | farm, mill, guild, patrol | SIMILAR |
| Storage | trunk, uncapped | chest transactions | SAME |
| Furniture | passive bonuses (each book +1% Literacy XP, blanket +50% Sleep XP), home rating | fork fixtures are deliberately job stations, not passive buffs | DIFFERENT |
| Dialogue | imperative nested menus | textline graph | DIFFERENT |
| Save | pipe base64, no migration | envelope, migration, backups | DIFFERENT |

## 4. Proto23-only ideas, ranked by fit (proposals)

Ranked by how cheaply each one adds texture to YAIRPG without breaking its
data-driven engine. None of these is accepted. Each needs Weibao's call,
and any persistence change needs a migration.

| Code | Idea | Why it fits | Cost |
|---|---|---|---|
| O1 | **Titles for lifetime counters** (pats, years at home, deathless levels) | YAIRPG already saves `character.titles` and tracks `game_stats`. This adds a catalog and grant hooks, mostly data. Fits the life-sim north star. | Low. Save field exists. |
| O2 | **Hunger that scales efficiency** | Gives food a pacing role instead of being a buff vendor, and makes cooking matter daily. | Medium. A new resource meter that has to be balanced against stamina. |
| O3 | **Build accessories** (luck, price, drop, cook-anywhere effects) | Proto23's best gear idea. Utility, not raw stats, so combat balance barely moves. | Medium. Needs effect hooks on equip. |
| O4 | **Seasonal weather states** layered over the temperature model | Rain and fog with duration and mood. YAIRPG's temperature model stays. | Medium. Saved state. |
| O5 | **Gear durability plus cheap repair** | A soft maintenance loop that rewards spares. Proto23 even uses the worst-durability copy as a crafting input. | Medium-high. Every equipment instance gains a saved field. |
| O6 | **Bad-food and resistance training** (poison trains Survival, which raises resistances) | Turns setbacks into progress. Fits "skills from doing". | Low-medium. |
| O7 | **Idle "look around" per room** with rising find chance | Cheap discovery texture. Needs a cap on the rising chance. | Low. |
| O8 | **Random hub encounters** and **a recurring service** (Sunday free meal) | Character for little content. `world_rhythm.js` already supports windows. | Low. |
| O9 | **Elemental affinities** on gear and creatures | Makes armor choice per enemy matter. Biggest rework, so last. | High. |

## 5. Where YAIRPG is ahead

- Save safety: envelope, migration, backups. Proto23's import writes key
  "v0.2a" while load reads "v0.3", and there's a one-click
  `localStorage.clear()`.
- Group combat, stances and tag skills ("Pest killer"-style) give more
  tactical variety per fight.
- The component and quality crafting ladder gives long-term gear goals.
  Proto23 crafting is a flat cook-what-you-have.
- A real economy: open selling, saturation, haggling.
- Travel time and a location graph make geography matter.
- Content is finished. Proto23's counts include many stubs.

## 6. Proto23 bugs and unfinished parts (don't copy)

- Catacombs: 26 rooms with no entrance from outside and no encounters or
  loot.
- `offline_a` (10023) is a predator/prey forest ecology sim that is never
  called. `offline_evil_index` only nudges prices.
- Night weather branch: the hour condition is `<5 && >16`, which is never
  true (18 sites).
- Gluttony L10 and Death L5 perks write `eqp_t` instead of `exp_t`, so the
  promised EXP gain never applies (1896, 2018).
- Steak crafts only at Cooking exactly level 3 (8580).
- General Store and Herbalist restock timers set the wrong field (8942,
  8951, per R4).
- Creatures all start with the shared `eqp.dummy` object (7344, 7401).
  Mutation side effects are inferred, not run.
- Equipment lists are padded with name-only stubs: about 30 weapons, 13
  shields and 14 creatures have no stats.
- Food `use` logic is copied about 220 times, so retuning means editing
  each copy.

## 7. What our Proto23 branch already took

The fork's `proto23_world_*` branch (see
[IMPLEMENTATION_STATUS](../../worlds/proto23/IMPLEMENTATION_STATUS.md)) took
the village-life side: paid work, reading or tutoring, handling practice,
counted furniture as job stations, and a home kit. It took no creature,
gear, title, hunger or weather content. The fork deliberately chose
**fixtures without passive bonuses**, which is the opposite of Proto23's
furniture. That choice stands until Weibao says otherwise. The branch is
still implemented-unverified.

## 8. Gaps that would change the design

- Neither game was played. Pacing claims (hunger pressure, the XP curve in
  practice, durability drain) need a browser session.
- What trains about 14 Proto23 skills (Stealing, Mining, Alchemy, etc.) was
  not pinned down. Their trainers may be in code paths no reader traced.
- The fork's expansion modules were grepped, not read. A fork module might
  already cover an "ONLY" row under another name.
- This is one Proto23 revision. A later build may have finished the
  Catacombs or offline mode.

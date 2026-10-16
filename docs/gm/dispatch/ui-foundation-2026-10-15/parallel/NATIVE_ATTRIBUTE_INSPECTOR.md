# Native player attribute inspector audit

2026-10-15. Read-only source audit for root after the user's All stats / secondary-modifier feedback. No runtime, engine, persistence, build, browser or save edits. This is an original YAIR adapter proposal; no Minecraft/Apotheosis behavior, code or stat catalog is imported. Desktop-first, UR41–UR48 and existing ownership apply. Root remains writer of the shared UI files.

## Outcome

**P1, ACT NOW:** replace the twelve-row-only meaning of “All stats” with a compact named native attribute browser. Keep routine You concise. The expanded view can list native primary, offense, defense, recovery and learning rows with a stable selected row and a selected attribute's existing contributor explanation. Do not enlarge the routine summary into another giant table. Native model supports meaningful secondary stats now, without adding mechanics.

**P2, ACCOUNT FOR NOW:** distinguish base value, computed pre-multiplier total, aggregate source categories, final model value and effective current value. AP/EP and attack damage have formula dependencies. A generic `(base + sum) × product` explanation is wrong for several keys and for current vitals. Shield strength is an equipment-derived getter, not the raw full-stat field.

**P3, LATER:** movement/work speed and imported affix attributes are not generic native character stats. Keep activity output/time in its actual service projection. Inactive authored keys can appear in an explicitly inactive/schema section if the director wants an exhaustive view; do not imply they currently improve combat.

## Actual owner and public APIs

`src/data/character.js` constructs `new Hero(...)` from `src/models/hero.js`. Hero extends `Person`, whose private levelable component is `src/components/levelable_component.js`, extending `src/models/stat_haver.js`. `display.js` already imports this current player singleton at line22. There is no `src/character.js` owner.

The public getters return live model objects: **read/copy only, never mutate**.

| API | Meaning / qualification |
| --- | --- |
| `character.getBaseStats()` | Exact 35-key native base-stat object below. Race, height and leveling generally live in separate flat/multiplier buckets, so “base” is not an unmodified birth identity. |
| `character.getFullStats()` | Current computed model totals, including mutable health/stamina/mana. Attack power and speed here omit the extra exhaustion factor applied by their effective getters. |
| `character.getStats()` | `{full,total_flat,total_multiplier,flat,multiplier}`. Contributor buckets are already public and are used by native tooltips. `total_flat` means pre-multiplier total, not just additive bonuses. |
| `character.getAttackPower()` / `getAttackSpeed()` | Effective values: corresponding full value × `getStaminaMultiplier()`. Exhaustion is `0.5 + Persistence level bonus` when stamina is zero, otherwise1. Use these in the default effective value column. |
| `character.hasShield()` / `getBlockStrength()` | Shield presence and actual shield strength × skill multiplier, except native ignore-skill shields. Getter falls back to1 without a shield; gate display by hasShield rather than presenting that fallback as usable blocking. |
| `getHealthRegenerationTotal()`, `getHealthLossTotal()`, `getStaminaRegenerationTotal()`, `getManaRegenerationTotal()` | Native derived flat + maximum × percent/100 helpers. Health-loss-percent sign needs the caveat below. |
| `getXPBonuses()` / `getTotalXPMultipliers()` | Aggregate contributor buckets and target multipliers. `all`, `hero`, `all_skill`, plus skill IDs/category keys. Show only already-known skill names. |
| `getMainXPGain()`, `getSkillsOveralXPGain()`, `getSkillXPGain(id)` | Effective XP multipliers; specific skill getter also includes person skill XP factor and skill can-level status. Native config.global_xp_multiplier applies later at XP execution, so label these native personal multipliers, not guaranteed award totals. |
| `getBonusSkillLevels()` / `getTotalSkillLevel(id)` | Bonus level totals and learned+bonus total per skill. Do not blindly enumerate every skill ID and disclose unknown names. `getTotalSkillLevel` reaches `getSkillXPObject`, which lazily creates missing progress entries; do not call it across unseen skills just to inspect them. Reuse the already-populated known-skill projection/list. `getLevelableComponent().bonus_skill_levels.flat` has equipment/active_effects/skills aggregates if a known-skill contributor drilldown is later needed. |

## Exact native keys, units, useful grouping and consumers

There are **35 base/full keys**. “Active” below means a concrete native source consumer was traced, not a browser or gameplay claim. Core stats have native tooltips in `display.js`; recovery detail also exists in the bars.

| Group | Exact keys | Display units and consumer |
| --- | --- | --- |
| Primary | `strength`, `agility`, `dexterity`, `intuition` | Points. Strength scales weapon/unarmed attack power; agility/intuition produce evasion; dexterity/intuition produce AP. Active `Person.#updateStats` and native combat. |
| Primary, inactive | `magic` | Points; authored/modelled and shown by existing UI, but no magic-based combat/spell consumption found in the inspected native route. Do not label this spell damage. |
| Offense | `attack_power`, `attack_speed` | Native damage value and attacks per second. Effective getters account for stamina exhaustion; native combat consumes them. Keep raw model totals available in detail. |
| Offense | `attack_points` | AP rating, not a hit percentage. Derived sqrt(intuition) × dexterity × Combat coefficient, then native multipliers/base. Target-specific chance is a separate combat projection. |
| Offense | `attack_count` | Hits rolled per attack; native `rollBaseCombatDamage` argument, not number of selected enemies. Do not conflate with stance target count. |
| Offense | `crit_rate`, `crit_multiplier` | Probability ×100 as %, and damage factor × (native old UI uses percent for factor, but label it explicitly). Combat compares crit_rate to roll, then multiplies damage by crit_multiplier. |
| Offense | `unarmed_power` | Native unarmed base damage coefficient/value; used with strength/10 and attack-power multipliers when no weapon. Do not display as a weapon-independent flat bonus to every attack. |
| Offense, authored but inactive | `armor_penetration` | Authored point value on equipment, aggregated into stats. Whole-src search found no combat/mitigation reader, only schema/item definitions/label. Show “No native combat consumer traced” in audit; an inactive UI label must not promise armor bypass. |
| Defense | `defense` | Native defense value consumed by takeDamage/mitigation. Not a percentage. |
| Defense | `evasion_points` | EP rating, not dodge%. Formula agility × sqrt(intuition) × Evasion coefficient plus model base/multipliers. Shield use changes actual defensive route. |
| Defense | `block_chance` | Fraction ×100 as %. Derived from config.base_block_chance + Shield blocking bonus before multipliers (plus base field per general model). Only actionable with shield. |
| Defense | `block_strength` | **Raw full field is not actual shield damage blocked**: base defaults0; skill multiplier is stored in total_multiplier.block_strength; native combat instead multiplies equipped shield.getShieldStrength(). Display actual strength through hasShield/getBlockStrength; explain weapon/shield base and only applied multiplier. |
| Health | `health`, `max_health` | Current/max hp. Current health is mutable and recomputation preserves missing health, so it is not a normal base+modifiers attribute. Max health has ordinary contributor breakdown. |
| Health recovery | `health_regeneration_flat`, `health_regeneration_percent` | hp per native tick/second UI; % of max hp per tick respectively. `main.js` consumes these; bars label totals /s. Flat and percentage components should retain distinct labels. |
| Health loss | `health_loss_flat`, `health_loss_percent` | Signed native flat loss component and percentage component. Negative flat is damage. Percent convention has a tooltip versus tick discrepancy, below. Do not silently reinterpret positive/negative as the same rule for both. |
| Stamina | `stamina`, `max_stamina` | Current/max stamina. Same mutable-current caveat. |
| Stamina recovery | `stamina_regeneration_flat`, `stamina_regeneration_percent` | stamina/s and % max stamina/s in native UI. Main tick consumes them except while chronicle session owns its resource loop. Avoid promising actual net recovery during every special mode. |
| Stamina efficiency | `stamina_efficiency` | Factor ×, not a percent cost reduction. Native `use_stamina` divides cost by this factor. E.g.×2 means half base stamina cost. Stance affordability uses it; Running skill contributes it. |
| Mana | `mana`, `max_mana` | Current/max mana. Native schema comments say currently useless, but the tick does update recovery. No meaningful native spending/ability consumer was traced here. Present as currently unused capacity, not a spell system. |
| Mana recovery | `mana_regeneration_flat`, `mana_regeneration_percent` | mana/s and % max mana/s by the same native recovery convention. Tick consumers exist despite stale schema “currently useless” comments. |
| Mana, inactive | `mana_efficiency` | Factor ×; no spending consumer found. Do not claim cost reduction currently works. |
| Environment | `cold_tolerance` | Temperature **difference** in °C, not an absolute temperature or resistance percentage. Native threshold compares temperature + tolerance to cold thresholds. If converting for preference, apply a delta conversion, not absolute Fahrenheit conversion. |
| Environment, inactive | `heat_tolerance` | Temperature-difference-like native authored value/getter, but no heat penalty consumer found. Do not promise heat protection. |

### Computed totals and explanations

`Person.#updateStats` generally writes `(base_stats[stat] + flat sum) × multiplier product`. Exceptions:

* AP, EP and block chance replace the normal flat sum with explicit formulas. Their effective pre-multiplier total is `stats.total_flat[key]`. Do not additionally sum source flats and pretend they explain the formula.
* Attack power is overwritten after the loop with `(full.strength/10) × weapon.getAttack() × attack_power multiplier`, or the corresponding unarmed base. Its total_flat is then recomputed from this value. The existing native breakdown already uses “weapon * str/10”.
* Health/stamina/mana preserve the missing resource amount; no generic modifier decomposition should claim to reproduce their current balances.
* Effective attack power/speed include getStaminaMultiplier after full computation. Add “Current stamina state ×…” as a separate **derived condition**, not an invented stored modifier bucket.
* Shield strength ignores all skill multipliers when the actual shield has ignore_skill. Use the getter and display only the applied factors. Do not multiply raw full.block_strength or include a non-applied factor.

### Contributor labels safe to expose

Stat buckets: `race` → Race, `height` → Height, `level` → Level, `skills` → Skills, `equipment` → Equipment, `skill_milestones` → Skill milestones, `books` → Books, `titles` → Titles, `light_level` → Light, `environment` → Environment, `stance` → Stance, `active_effects` → Active effects. Not every category exists for both flat and multiplier.

XP buckets: race, **levels** (plural exact key), skills, books, titles, active_effects. Bonus skill-level buckets: equipment, active_effects, skills. Keep these aggregate labels: attribution is category-level, not per item/title/book/effect. Reverse-engineering individual owners by matching equal numbers would fabricate provenance and can disclose unknown content. To name individual contributors later, extend the actual producer with observer-safe identities.

Existing `display.js:create_stat_breakdown(stat)` already reads base, nonzero flats and nonidentity multipliers for any native key, with special attack_power/attack_points/defensive_points branches. `update_health_bar_tooltip`, `update_stamina_bar_tooltip`, `update_xp_bar_tooltip`, and `create_xp_bonus_breakdown` own related explanations. Reuse or adapt those helpers through an original structured projection rather than scrape hidden/internal DOM or build a competing truth model. Explicit `evasion_points` and `block_chance` calls need new derived-pre-total handling, because current helper handles those only through its defensive_points alias.

## Important gaps to preserve

**G1, health percent loss:** `LevelableComponent.getHealthLossTotal` and the health tooltip add max_health × health_loss_percent/100 to the signed balance. The main tick adds that percentage to health_to_subtract, which `update_health` subtracts. For nonzero percent this differs in sign. This audit does not repair it. Display raw native components with an explicit caveat or defer combined net-rate claims pending a focused owner decision/test. The common flat negative-loss case is consistent.

**G2, work/movement:** no generic movement_speed/work_speed/travel_speed stat was found. Actual gathering uses `LocationActivity.getActivityEfficiency()`: current activity's skill modifier controls time, yield and chance, with optional quality range. It belongs to the selected activity's public projection, not an unconditional character “work speed” number. Running is a stamina-efficiency contributor, not proof of a universal movement-speed stat.

**G3, inactive values:** armor penetration, heat tolerance, magic and mana efficiency exist as data but lack an active traced consumer in this route. Mana regeneration has a real tick consumer but no proven useful spend loop. Do not copy named affixes or damage types from Minecraft mods to fill empty sections.

## Concrete adapter recommendation in display.js

Add one **read-only player projection** next to existing stat breakdown helpers, e.g. `readPlayerAttributeInspector()`. The UI caller consumes copied plain rows, not character refs. Whitelist all35 native keys with explicit labels, group, unit and status; omit unknown runtime-added keys by default instead of exposing internal world state. Suggested shape:

`{groups:[{id,label,rows:[{id,label,unit,value,base,preMultiplier,totalMultiplier,sources:[{label,flat,multiplier}],description,availability}]}]}`

Use actual effective getters for attack power/speed and shield strength, and explicit recovery getters where sound. Mark live current resources separately. For formula rows show native pre-total and a formula explanation rather than a false additive reconstruction. Existing `create_stat_breakdown` may supply initial descriptions; expose only aggregate safe labels. For XP show global/personal/skill-wide factors, and add rows for already-known skills using the same knowledge owner as the visible native Skills list. No engine, main, save or persistence change is necessary for core native stats.

The browser UI should put a compact attribute list and stable detail region inside the existing You full-stat scope, keeping the routine summary short and gear/inventory/combat/log readable. At 1366×768 and actual14/17.5/21px, allow the stat list/detail to scroll locally, retain tabs/filter and local return, and do not rebuild the focused row on every400ms tick. On wider panes show more groups concurrently only when legible. A group does not need an oversized permanently framed card.

Fresh rebuilt checks required: no shield/shield+ignore_skill; stamina positive/zero; active regen/loss; flat+multiplier equipment; title/book/skill aggregate; unknown skill omission; 1366×768 at14/17.5/21px plus1920×1080 and3600×1906. Compare effective values to native getters, copied contributor values to current model, and gameplay state before/after inspection. No browser proof or visual acceptance is claimed by this report.

## Input hashes

| Path | SHA-256 |
| --- | --- |
| `src/data/character.js` | `5535366f4b2c8874137ba589ef3682dc92c68223adfe174515cda3d40eb6b622` |
| `src/models/hero.js` | `964ac0e23c42f3ad758c2322931ffc486d97e041ef50472e69c7a81256a2d777` |
| `src/models/person.js` | `6bb8bfa30d23e0bbfc3f4e31acee71fd400dc74e832c3b9e300e51570a19763f` |
| `src/models/stat_haver.js` | `7f6f721b92e881abf3a9d2e4bfeef1f934d301b1ba9ea9d042bcdd25e8cee2ac` |
| `src/components/levelable_component.js` | `d48f4a9e411dab0a0e7f45ac47f6413a5c0a3cce20b41ed8d3acb7b7b73d62a4` |
| `src/models/combat.js` | `1356a62fdb97732d25b879a8324560bcc58cacfd12d42bea3ac6cf5d9654ad2e` |
| `src/models/location.js` | `d3181798b406b964f3a94e792aa5c0f89bf5f2f28ca75a1276dfb23a7b2ca56b` |
| `src/display.js` | `685c322350702a48512f2b8d7260108c51ba56b3aaacb31e3ba5c5b6f081d1e4` |
| `src/main.js` | `dfe9fbcc4b87e70f6993c3578b7fc789fb23a1700ffa3980e1dc75f3492d7b71` |
| `src/misc.js` | `fb68556cee90d303cf980d992b637d37c46bd14501d14436df35d990ba6ac510` |
| `src/data/skills.js` | `c42ea72d7d712d2623d1dd683796ba705405f51bf559ce603f327f767c3e7f7c` |
| `src/items.js` | `b5e80a1406855e1d733386cd4c5253bad01bc3c9e35f6ef17d682d56a517b520` |

Live dirty inputs read only. Hashes are a receipt, not a lock on the root owner. No memory file used by this lane.

## R10 implementation and handback

Root explicitly transferred sole `src/display.js` ownership after R9 source/build pin. Implemented exported `readPlayerAttributeInspector()` beside the existing breakdown helpers. It returns the agreed copied38-row projection:35 whitelisted native attributes and3 personal XP factors, all eight named groups, explicit units/formatting, numeric values/base/pre-multiplier/multiplier, copied source-category contributors, descriptions, availability status/note and structured hasModifiers. No source IDs or individual hidden contributors are exposed.

Current resource balances have null base/pre-multiplier/total-multiplier and no modifier badge merely for depletion. Formula AP/EP/block-chance/attack-power rows suppress unused stored flats and explain the native formula. Effective attack getters remain authoritative; an exceptional zero-stamina player with no Persistence progress entry uses the same pure native coefficient calculation to avoid the getter's lazy progress initialization. Shield strength uses hasShield/getBlockStrength, returns null/“No shield” without one, and omits non-applied factors for ignore_skill shields. Recovery components remain separate; percentage health-loss discrepancy is a reference caveat, not a net calculation or engine repair. Latent values stay reference status. There is no skill enumeration, hidden-skill probe, game-state mutation, DOM write or new action in this export.

Checks: `node --check src/display.js` passed. Five source-projection fixtures in `/tmp/r10-attribute-source-check.cjs` passed:38 unique rows; copied-source isolation; current resources; non-neutral fractional multiplier badge; reference caveats; no shield/normal shield/ignore-skill shield; zero stamina with and without preexisting Persistence. Fixtures evaluate the actual extracted projection with real StatHaver defaults and mocked current-player getters; they are SOURCE checks, not browser, native gameplay or taste acceptance. One first harness extraction failed because it left the tail of a comment as JavaScript; the extraction was corrected, with no runtime edit for that harness error.

Before hash: `685c322350702a48512f2b8d7260108c51ba56b3aaacb31e3ba5c5b6f081d1e4`.
After hash: `4e86bc337ba608720e840342bbf7d9f51fd5429a8c376755e59272b51e060335`.
Exact before/after diff is recoverable from `/tmp/r10-display-attribute-before.js` versus current `src/display.js`. Only the original projection block was added by this worker. No build was run. Root owns integration and fresh-origin browser/preservation proof. **display.js ownership handed back to root after this receipt.**

# Balance: where tunable numbers live and who owns them

Index only. This file adds no numbers; it points at the owner of each dial, quotes the target if one is written down, and labels each value. Created 2026-10-30. Everything about status below is an agent reading of the working tree on top of `d415ef656` (several source files had uncommitted edits from other sessions, so cite by name, not by line). Not human-reviewed.

**Stance (default, dial, reason).** Weibao is essentially the only player (AD22), so balance means feel and pacing, not exploit hardening. Default: a number is a dial with an in-world or play reason, set per world (AD46, AD5). Dial: a world, option or skill may move it; the owner below says where. Reason: limits are adjectives, and the firm lines are save integrity and real-world guardrails (AD22). A bug or reload exploit is fixed; a profitable loop is a payoff unless Weibao says otherwise (ECR30). Changing a value that a saved life already used needs a migration or an explicit compatibility decision (AGENTS.md Safety).

**Status words used below.** *Rule* = an accepted rulebook line that fixes a shape or default, with its AD or code. *Implemented default* = a value in source that runs today; no record of Weibao reviewing the number was found. *Proposal* = agent-authored and adjustable (AD32). *No target* = no written target for the felt outcome was found in the owner docs or code comments; the first person to tune it should record one in the owner, not here.

## 1. Combat

Owners: [Combat rules CBR1-CBR30](DOMAIN_RULES.md) and the [combat palette](COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md) (design); [equipment stat dimensions ESD1-ESD16](EQUIPMENT_STAT_DIMENSIONS_CONSIDERATIONS_2026-10-20.md) (gear numbers, proposal); code in `src/combat_math.js`, `src/gear_dimensions.js`, `src/damage_types.js`, `src/enemies.js`, `src/config.js`.

| Dial | Where | Default and reason | Target | Status |
|---|---|---|---|---|
| Hit chance curve | `get_hit_chance` in `combat_math.js` | Piecewise curve on attack/(attack+evasion); steep near even, flat at the extremes so skill matters most when matched | No target | Implemented default (predates this pass) |
| Flat defense, then chip floor | `mitigateCombatDamage`, `BASE_MIN_DAMAGE_SHARE` (0.05) in `gear_dimensions.js` | Armor subtracts first; a hit keeps at least a small share so armor cannot make a fight pointless | No target | Implemented default; ESD1 order is a proposal |
| Percent layer | `damage_taken` with `DAMAGE_TAKEN_FLOOR` (0.5) | Multiplier after flat defense; the floor stops stacked gear from erasing damage | No target | Implemented default; the floor is stated as a dial in ESD |
| Crit and block | `config.enemy_crit_chance` (0.1), `enemy_crit_damage` (2), `base_block_chance` (0.75, plus skill), `CRIT_RESISTANCE_CAP` (0.75) | Inherited feel dials | No target | Implemented defaults |
| Damage type scalar | `damage_types.js` (new 2026-10-30, untracked): attack mix weight x defender multiplier, applied after the percent layer | Undeclared attacks are all `physical` and undeclared defenders are 1, so old content, saves and the saved-battle engines behave as before (CBD1) | No target | Proposal |
| Weapon mix | `WEAPON_MIX`, `UNARMED_MIX` | How each weapon family bites (for example sword mostly slashing, some piercing) | No target | Proposal values (CBD2) |
| Armor protection | `ARMOR_PROTECTION` by item name, `PROTECTION_CAP` (0.5), `WEAKNESS_CAP` (3) | Per-piece fraction turned away, summed over six worn slots and capped so four pieces do not make a type irrelevant | No target | Proposal values (CBD2) |
| Enemy declarations | `attack_types`, `defense_types` in enemy data, enemy stat blocks in `enemies.js` | Declared per enemy; where absent the defaults above apply | No target | Proposal for the new declarations; older stat blocks are implemented defaults |
| "Resisted" display threshold | CBD3 in the combat palette | The hit line names resisted, weak spot or no effect once protection moves a hit 5% or more | A display threshold, not a balance target | Proposal |

Opponent numbers are learned and your own are exact (AD8), so tuning an enemy changes what the player discovers, not what a tooltip admits.

## 2. Economy and standing

Owners: [Economy rules ECR1-ECR33](DOMAIN_RULES.md) (shape), [economy and trade palette](ECONOMY_AND_TRADE_CONSIDERATIONS_2026-10-18.md); code in `src/components/trader_component.js`, `src/economy_standing.js` (the `DIALS` table carries its own reason per row), `src/lotm_price_map.js`, item `value` fields in `src/items.js` and world packs, `src/config.js`.

| Dial | Where | Default and reason | Target | Status |
|---|---|---|---|---|
| Item prices | Item `value`, per-world price maps | Each price follows a per-good, per-place curve with a stated reason (ECR3); each world prices from a reference basket of meal, lodging, day's wage and basic tool (ECR6) | The basket method is the target; no numbers are written | Rule (ECR3, ECR6; the ECR family is accepted 2026-10-18, see AD27); individual prices are implemented defaults |
| Trader margin | `profit_margin` (3) on the trader component, scaled by Haggling and regional reputation | A trader's markup shrinks with skill and standing (ECR4 asks for one reconciled quote formula) | No target | Implemented default |
| Market saturation | `trade_price_recovery_flat` (5), `trade_price_recovery_ratio` (1/360), `market_saturation_trickle_rate` (0.2) | Selling a lot lowers the price; it recovers by the larger of the flat or ratio term and leaks to neighbouring markets daily | No target | Implemented defaults |
| Standing tiers and terms | `DIALS` in `economy_standing.js`: tier cuts, region reputation (0.004, cap 0.06), term and grace days, late-rate ratchet, overdue sell and buy marks, rumour truth rate, insurance rate | Five bands from dislike to vouched-for; forgiving credit with dated terms (ECR21, AD19) | Reasons are written per row in code; no felt-outcome target | Implemented defaults with in-code reasons; the numbers have no recorded review |
| Buy and sell asymmetry | Convention | Buying and selling stay asymmetric by default so a full purse does not replace gathering and making (ECR8); a System-shop world may loosen it | Qualitative | Rule (ECR8) |
| Income and sinks | World data | Every world with money has an honest baseline income tied to its basket (ECR26); grow the sinks rather than throttle income (ECR30) | Qualitative | Rule (ECR26, ECR30) |

## 3. XP and skill pacing

Owners: [Skill and learning rules SLR1-SLR43](DOMAIN_RULES.md), [skills palette](SKILLS_AND_LEARNING_CONSIDERATIONS_2026-10-18.md), [SKILLS_AND_TALENTS](SKILLS_AND_TALENTS.md); code in `src/models/skill.js`, `src/config.js`, `src/skill_overflow_domain.js`.

| Dial | Where | Default and reason | Target | Status |
|---|---|---|---|---|
| Skill XP curve | `base_xp_cost` (40) and `xp_scaling` (1.8) per skill; `config.base_xp_cost` (10) for levelable actors; `global_xp_multiplier` (1) | Geometric cost per level; learning rate is an adjective per world, body, skill and talent, with no universal formula (SLR7) | No target | Rule for the shape (SLR7); curve values are implemented defaults |
| Per-gain cap | `skill_xp_gains_cap` (0.1), `crafting_skill_xp_gains_cap` (0.25) | One gain cannot exceed that share of the next level's cost, so a level takes at least ten gains (four for crafting). `skill.js` rejects a `base_xp_cost` below 1/cap | The one written target: "need to gain it at least 10 times" (code comment in `config.js`) | Implemented default |
| Gain overflow | `SKILL_GAIN_OVERFLOW` per world; `SKILL_EVENT_OVERFLOW` per event | Excess practice is banked in `base.frontier` (one level, full drain) and lost elsewhere, each with a stated reason; an original-world row converts surplus insight to practice minutes (5 per minute) | No target | Implemented defaults; the converted row is a Proposal (GTR29) |
| Rust and decay | Per-world dial | Off by default; when on it hits fluency with a stated reason (SLR10) | Qualitative | Rule (SLR10) |
| Drill caps | World data | A cap names its next route: a harder drill, a teacher, a text or insight (SLR29) | Qualitative | Rule (SLR29) |
| Away learning | Recap | Batched into one recap, not many toasts (SLR26, AD17) | Qualitative | Rule (SLR26) |

## 4. Hunger and pacing options

Owners: [hunger and bodily needs considerations](HUNGER_AND_BODILY_NEEDS_CONSIDERATIONS_2026-10-13.md), [body and health rules BHR1-BHR30](DOMAIN_RULES.md); code in `src/absorb_e1/pacing.js`, `config.time_speedup_when_sleeping` (6).

| Dial | Where | Default and reason | Target | Status |
|---|---|---|---|---|
| Hunger on or off | `hungerEnabled` in `pacing.js` | Off by default; an option, not a rule, because bodies are real (AD13) but recovery stays forgiving (AD19) | None | Proposal (the module calls itself original optional home-world pacing proposals) |
| Hunger drain | `fullness - minutes/4.8` | One full bar lasts eight played hours; sleep and travel use the same clock; other-world calls do not advance it | Eight played hours is the stated figure | Proposal |
| Fullness and XP | Hunger doc | Ordinary XP efficiency ranges 80% to 100% with fullness | The 80-100% range is the stated figure | Proposal; the hunger doc reports it as a source observation, not a runtime claim |
| Weather cycle | `WEATHER_STATES`, `weatherDuration` | Six phases of 90 to 210 minutes with seasonal offsets; fog trims efficiency to 0.95 | None | Proposal (weather is a second option beside hunger) |
| Sleep speed-up | `time_speedup_when_sleeping` | Sleep runs the clock faster so it does not stall idle play | None | Implemented default |

## 5. World dials

Owners: [world dials and interpreter considerations](WORLD_DIALS_AND_INTERPRETER_CONSIDERATIONS_2026-10-19.md) (WDI), AD46 (each world chooses its own version of each system), AD5 (limits are adjectives). A dial is a `parameter` effect on a target through the existing rule resolver (WDI6), so the receipt explains it. Per-world rows already live in `SKILL_GAIN_OVERFLOW`, the standing `DIALS`, price maps and world packs. Caution (WDI44): the resolver does not yet filter parameters by target, so admitting a second target without a filter changes the first target's value.

## Cross-system interactions to watch

Not defects found; these are the places where a change to one owner moves another, so a retune should check them. Each uses a short code.

- **X1. Damage types x armor protection x shop prices.** Protection is matched to the item *name* (chainmail, shell, alligator, hide, pelt, leather), and shop price comes from the item's `value`. Any generated or bought item whose name matches gains protection with no price tied to it, and a cheap hide set can out-protect its price. Check: price per protection point across shops, and how generated names (GR rules) interact with the regex.
- **X2. Layer stack on the defender.** Flat defense, the 0.05 chip floor, `damage_taken` (floor 0.5), then the typed scalar (protection up to 0.5, weakness up to 3). A fully geared defender can sit near a quarter of raw damage while a declared weakness triples it, so one enemy declaration can swing fight length by a large factor. Longer fights spend more healing and food, which feeds prices (X1) and hunger (X3).
- **X3. Hunger x skill caps x overflow.** With hunger on, XP efficiency falls to 80% while the per-gain cap and a `lost` overflow row discard the excess, so check whether the efficiency multiplier applies before or after the cap, since a `lost` row discards what the cap trims. Sleep and travel drain the same bar and sleep runs 6x, so check which clock the sleep drain reads.
- **X4. Standing x trader margin x saturation.** The trader margin, regional reputation, standing-tier marks and market saturation each change one quote. ECR4 asks for a single reconciled formula; check that a new factor joins it rather than multiplying beside it.
- **X5. Crafting cap 0.25 x crafting income.** Crafting levels faster than other skills, and crafted goods feed sale prices (X4). A recipe that sells above its inputs is a payoff (ECR30), but the faster cap can make it the main income unless the world's baseline income (ECR26) competes.
- **X6. Per-world overflow and dial rows vs the default row.** Unlisted worlds fall to the `lost` default; a world pass that adds an overflow, price or standing row changes pacing there only, so compare against the default before judging it.
- **X7. Dials through the shared resolver (WDI44).** A second parameter target needs the target filter first, or an unrelated dial value shifts.

## Gaps noted

- No felt-outcome target is written for combat length, price levels, income per hour or XP per hour. Setting one is Weibao's call (AD32); until then the dials above are implemented defaults or proposals.
- The hunger doc says PROJECT.md records the hunger proposal; a search of PROJECT.md found no hunger or pacing line (2026-10-30), so that cross-reference is stale.

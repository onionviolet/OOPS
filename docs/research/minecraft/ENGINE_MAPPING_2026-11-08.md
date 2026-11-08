# Minecraft research mapped onto the engines, 2026-11-08

D-F in the [long-term atlas](../../audits/PROGRESS_ATLAS_2026-11-07_LONG_TERM.md#engine-growth-as-a-gap-finder-and-the-minecraft-mapping-2026-11-08) (XM27). Each mechanism in the 17 audits under [audits/](audits/) is classified once against the game's engines: DATA (fits an existing engine as law or content rows), GAP (needs a part no engine has) or OUT (does not fit a life sim of one person in book worlds). GAP rows feed the D-E gap ledger below. Nothing here is accepted design (AD32); it is a map for choosing what to build.

**Method and limits.** Four sonnet readers, one per shard, read the audits in full against a shared engine list (the brief is kept in this session's scratch, not the repo). They did not open `src/`, so every fit is a judgment from the engine's stated purpose. The merger spot-checked eight GAP claims with a grep of `src/`; three were partly wrong (see corrections). Shard C classified a few GT, TB and RM rows from synthesis headlines only, so some rows overlap with shards A and B. Docs only; no runtime file changed and nothing was run.

| Shard | Audits | DATA | GAP | OUT |
|---|---|---|---|---|
| A, magic and research | MR, SR, WV2_RITUAL_MAGIC, SYNTHESIS, DC | 130 | 28 | 12 |
| B, tech and automation | GT, TA, TB | 58 | 24 | 16 |
| C, economy, quests, factions | WV2_ECONOMY_TIERS, WV2_QUESTS_LOGISTICS, WV2_WORLD_FACTION, EP, SYNTHESIS_2026-10-23 | 96 | 30 | 9 |
| D, gear, colonies, survival, late game | GL, WC, WV2_SURVIVAL_COUPLING, WV3 | 125 | 20 | 13 |
| Total | 17 audits | 409 | 102 | 50 |

Reading: about three quarters of what the Minecraft corpus does already fits the engines as data. The engines' shape holds up against a source unlike either book. The 102 GAP rows collapse into 18 missing parts.

## Gap ledger (D-E)

Each row is one missing part. "Pulled by" names the lead caller or source row that would use it; under D-E a part with a puller can be built now, and the rest stay logged until one appears. Callers marked "likely" are inferences from the books' known content, not checked against a census.

| Code | Missing part | Owner | Sources (examples) | Pulled by |
|---|---|---|---|---|
| MG1 | **Overdraw into the body.** Spending past a pool spills into a battery, then health or injury, then lockout; the deeper branch can be gated on a learned fact | E-POW with harm state | Hex overcast, Psi overflow, Blood Magic overdraft, low-pool ritual nausea | Likely Klein: spirituality running low. Reshaped by XC16 in the long-term atlas: by default an empty pool refuses use and a low one strains stats; spilling into the body is a per-world dial |
| MG2 | **Standing procedures with upkeep.** A procedure that stays active, pays per pulse and refuses in grades when funds run low | E-PROC | Blood Magic standing rituals, rituals as upkeep (C) | Likely wards and ongoing rites in both leads |
| MG3 | **Recorded spell methods.** Ordered or wired compositions saved as items, run with device caps; rote mastery makes known parts cheap to assemble | E-POW | Hex, Psi, Ars-style glyphs, Rote | Logged; likely Mother of Learning spell formulae. Mastery already lowers failure (`power_grammar.js`), but cheaper assembly is missing |
| MG4 | **Conduit networks.** Capacity, loss per hop, overload that breaks the weakest part, rate limit with back-pressure, a second conserved motion field | E-FIELD | GT wires and voltage, TB transfer, Embers, Create rotary | Logged; no lead pulls it |
| MG5 | **Regional trace and hazard fields.** Emitted residue that decays and spreads above a floor with stacked harm thresholds; point hazards with falloff and shielding; zone corruption with cleanup | E-FIELD with harm state | GT pollution, TB radiation, smog, restoration campaigns (D) | Logged. Partly present: `field_layer.js` already spreads fire and gas across edges, so this is an extension |
| MG6 | **Station-level making.** Structure templates with typed parts, wear faults with cures, a per-station failure policy, momentum and seasoning counters, progress that falls when supply stops, an ordered modifier pipeline | E-MAKE | GT multiblocks and maintenance, IE, TA, seasoning (D) | Likely Village workshop and later smithing (XC9) |
| MG7 | **Plan before you make.** A recursive demand tree showing what is in stock, what to make and what is missing, with reservation | E-MAKE | AE2 and RS planning, TB, C | Helpful to any batch craft, including the Potions bench |
| MG8 | **Material families.** One material row derives its products and recipes (ingot, plate, wire), alloy recipes from a formula, and prices solved over the recipe graph from a few pinned anchors | E-TRAIT with E-ECON | GT material system, ProjectE-style pricing | XC13 exotic alloys; also a designer tool for prices |
| MG9 | **Hidden-code discovery.** A per-save secret combination with graded feedback on each failed attempt | E-TRAIT | Thaumcraft-style aspects, informative waste | Partly present in `mixture_discovery`; generic alchemy (XC8). Seed stays sealed |
| MG10 | **Research mechanics.** Study odds with burned materials, display stand-ins until a fact is known, paid hints, a locked-recipe readout, bucketed affinity with decay, diminishing return on repeated practice, misfiring relics with a stability ladder | E-RES | Thaumcraft, Ars, Mystical, artifacts (A) | XC14 and XC15 research map; Klein's acting method fits the affinity buckets (likely) |
| MG11 | **Gear growth.** A conserved build budget on parts, stats that change at wear thresholds, a use-counted honing meter, point budgets with handicap refunds, a luck input to weighted draws | E-GEAR | Tinkers, Silent Gear, living armor | Logged; no lead pulls it soon |
| MG12 | **Body needs.** Effort-charged need meters, felt climate lagging the place, a nutrition window, exposure counters, staged infection with a cure window, a world meter replacing hunger | harm state with E-FIELD | Survival mods (D), faction meters (C) | Deferred by direction (hunger doc C4). Logged, not built |
| MG13 | **Goods over time and standing orders.** Spoil dates with preservation, standing orders that count in-flight goods, request chains that end at the player, compressed bulk goods | E-ECON | Create trains, AE2 restock, colony requests (D) | Likely Klein's household and shop errands later |
| MG14 | **Household progress and storage.** Shared progress with per-reward claim scope and merge on join or leave, household permissions, room lanes, chores with reach, storage capped by count and kind | E-HOME | FTB Quests team mode, storage mods, colonies | Logged; pulled once a lead has a household (heirs, spouse) |
| MG15 | **NPC places that grow.** Weighted settlement growth with fallbacks, place stock that feeds construction, traders moving goods by demand, relation drift between places, a culture-level reputation layer with echo | world development with E-REP | MineColonies, Millénaire, faction mods | Logged; the reputation layer extends W3e when a world needs it |
| MG16 | **Built and kept companions.** Companions made from parts, a downed companion that becomes a repair item keeping upgrades, an assignment token apart from the worker, weighted happiness factors | E-COMP | Golems, colonies, Book of Calling | Logged |
| MG17 | **Quest gate grammar.** Policy inheritance across arc levels, foreshadow levels separate from gates, exactly-one and all-but-one gates, early work that counts | quests | FTB Quests, BQ | Helpful to story windows (calibration of arc gates) |
| MG18 | **Trials and threat pacing.** A staged trial with split pay and a defined failure list, raid pacing that adapts to losses | conflict frame with world events | Wave defense, colony raids | Logged |

## Corrections from the spot-check

| Reported gap | What `src/` shows | Now |
|---|---|---|
| No mastery part in the power grammar (A, Rote) | `power_grammar.js` has `perMastery`, which lowers failure with mastery | Narrowed to cheaper assembly of known parts (MG3) |
| Deposits never deplete (B, GT6, GT19, TB15) | `gathering_model.js` tracks site stock, depletion and regrowth per day | Mostly DATA. The remaining gap is an exhaustion floor dial and a survey readout |
| Fields don't spread (B, D) | `field_layer.js` spreads fire and gas across edges each minute | MG5 is an extension of the field layer, not a new layer |

Five other GAP claims (gear budget, field networks, standing upkeep, spoilage, study odds) found no matching words in their named files. That supports the gap but doesn't prove it.

## Suggested next picks (proposals)

Ranked by D-E, a lead caller first:

1. MG1 as reshaped by XC16 (refusal and strain first), with Klein's spirituality as the caller.
2. MG7, plan before you make, on the Potions bench and Neil's brew.
3. MG2, standing procedures, once a rite or ward in either lead runs over time.

## Shard tables

The four readers' tables follow unchanged, with their unmapped residue.

## Shard A: MR_MAGIC_RESEARCH, SR_SPELLS_RITUALS, WV2_RITUAL_MAGIC, SYNTHESIS, DC_SOURCE_IDENTITY

Engine fit is judged from the brief's engine list and file names only; no src file was opened. Treat DATA rows as "fits by the engine's stated purpose".

| Mechanism | Sources | Class | Engine | Row or missing part / reason |
|---|---|---|---|---|
| Two-currency knowledge (seen vs thought about); stage needs both | MR1, N02 | DATA | E-RES | Two bars (understanding, usability) already; stage row demands both counts per discipline |
| Observation by scanning: points per unit from aspect sums | MR1, MR | DATA | E-RES | material_insights row: observe a material yields understanding points |
| Theory table card game: bounded inspiration, 2-card draws, aids seed cards | MR2 | GAP | E-RES | Bounded study-session minigame with drawn options and aid items; inquiry_study owns it |
| Study project gamble: visible odds bar, odds fall with completions, materials burn on failure | MR3, N02, MR | GAP | E-RES | Odds-per-attempt with visible bar and burn-on-fail; inquiry_study should own it |
| Project material needs grow with completed count | MR3, N02 | DATA | E-RES | Per-discipline completion stat feeding requirement counts |
| Research entry stages gated by knowledge points, stat counts, items, expertise, other research | MR, N02, MR5 | DATA | E-RES | Dependency map rows with mixed requirement kinds |
| Hidden research entries appear when parent known; scan-result entries | MR | DATA | E-RES | Dependency map visibility flag |
| Per-discipline expertise level | N02 | DATA | E-RES | Understanding bar per discipline |
| Cloaked objects: same record, shown as a stand-in until a fact is known | MR4, N01, MR | GAP | E-RES | Per-fact display alias on a held item or block; material_insights should own it (sealed-secret friendly) |
| Advancement-gated unlock (do a thing, gate flips) | MR4, MR5, SR1, SR7, X1, MR | DATA | E-RES | Unlock-by-fact rows in dependency map; skill_discovery owns triggers |
| Paid hint pages (materials buy a "where to look" page, hint chain gated by milestone) | MR4, N01 | GAP | E-RES | Cost-to-ask teacher/hint item; no paid-hint part in inquiry |
| Tier gates as plain advancement facts (cast cantrip, reach level, kill boss) | MR5 | DATA | E-RES | Recipe-tier gate row naming a fact |
| In-world block listing what is locked and how to unlock | MR5 | GAP | E-RES | Locked-recipe readout with unlock hint; research_view should own it |
| Short research with notes from tool use on a target, tasks drawn per star | MR6 | DATA | E-RES | Inquiry row: note-taking on a target, three task kinds per star |
| Codex entries locked by sign, fact, research or deity reputation; empty slots | MR, MR6 | DATA | E-RES | research_view visibility rows keyed to facts and standing |
| Local passive field: baseline, signed drain spots, thresholds flip effects both ways | MR7, N05 | DATA | E-FIELD | Field over places with threshold law rows (surplus grows crops, deficit kills grass, explodes) |
| Alternate refill routes for a field (blooms, generators, drain pass) | MR7, N05 | DATA | E-FIELD | Source rows that add to field value |
| Spread/balance effect moving field toward emptiest neighbour | MR7, N05 | DATA | E-FIELD | Diffusion law row; confirm field_layer supports neighbour flow |
| Warp: three debt buckets (temporary, normal, permanent), periodic event roll vs total | MR8, X8 | GAP | E-REP | Personal debt with buckets that decay or stick plus severity roll; harm state or owed ledger should own it |
| Warp added by research stage, half permanent half normal | MR8, MR | DATA | E-RES | Stage row with debt payload |
| Warp event ladder by tier (sounds, text, hunger, cultists, void) | MR, MR8 | DATA | storylet deck | Severity-banded event rows |
| Warding/gear/mask modifying warp event strength | MR | DATA | E-GEAR | Affix rows that modify debt roll |
| Hexerei: open guide, physical loop just (no knowledge gate) | MR9, N43 | DATA | E-MAKE | Counterexample world: recipes with no research gate |
| Affinity buckets (permanent, induced capped, temporary decaying) summed vs thresholds 30/60/90 | MR10, MR11, X12 | GAP | E-RES | Multi-bucket affinity ladder with decay and per-source suppress switch; no engine has bucketed affinity |
| Affinity thresholds unlock passive perks just, with discovery-gated chat line | MR12 | DATA | E-POW | Passive ability records unlocked at ladder steps |
| Ambrosia: raise one source, lower all others, tier caps | MR11 | DATA | E-MAKE | Consumable whose effect row moves affinity buckets (needs the GAP above) |
| Temporary affinity from mana spent, decaying | MR11 | DATA | E-POW | Cast effect adds to practice bucket |
| Linguistics adjacency grid: nodes open next to opened ones, vocabulary bought with XP | MR13 | GAP | E-RES | Adjacency board unlock structure; research_view dependency map could host |
| Study books at a table to gain vocabulary | MR13 | DATA | E-RES | Study action row cost in effort/resources |
| Chunk aura: vis and flux share one cap; flux blocks refill | MR14, X11 | DATA | E-FIELD | Two fields over a place with shared capacity law |
| Moon phase sets refill speed, cap and flux creep | MR14, RM13 | DATA | E-GATH | World calendar rhythm feeding field law |
| Over-full and over-drained aura turn to flux | MR14 | DATA | E-FIELD | Threshold law rows |
| Flux spreads to calmer neighbours | MR14 | DATA | E-FIELD | Diffusion law |
| Rift: probability above 75% cap, spawn rules, growth, weighted unstable events, collapse gives warp | MR15 | DATA | E-FIELD | Threshold-triggered world event rows with weights |
| Taint spreads just near live seeds, eats flux, seed starves | MR16 | DATA | E-FIELD | Spreading-hazard law with seed entities as sources and sinks |
| Flux sources (crafting waste) and sinks (rifts, taint, condenser) | MR16, MR | DATA | E-MAKE | Craft waste writes to field; craft_process effect row |
| Mana spreaders: burst per receiver-not-full, buffers, loss after range | MR17 | OUT | none | Block logistics geometry for a base builder; no one-person-life fit |
| Generator rhythms (rain bonus, lifetime, cooldown, anti-duplicate penalty) | MR18 | DATA | E-GATH | Per-source rhythm rows with repeat penalty (also SRP7) |
| Streak/variety factor and digestion cooldown penalising repeats | MR, MR18 | DATA | E-GATH | Repeat-penalty multiplier rows |
| Spell cost = complexity x factor; cooldown from complexity, cut by rote; residue left in place | MR19, N38 | DATA | E-POW | power_grammar cost row; residue writes to E-FIELD |
| Rote: repeated casting makes parts free to assemble in a book | MR19, N38 | GAP | E-POW | Mastery-by-repetition that lets spells be assembled cheaply; no mastery part in power_grammar |
| Opposing affinity pairs speed learning of own element | N38 | DATA | E-RES | Affinity rows (needs bucket GAP) |
| Faction choice swaps casting resource (mana, souls, brimstone, fire, ice) | N38 | DATA | E-POW | Per-world resource type on ability record |
| Mana regeneration over time scaled by saturation | N38, SR6 | DATA | E-POW | Pool regen row |
| Hexerei brewing: heated cauldron recipes, whole tank converts, moon phase condition | MR20, N43 | DATA | E-PROC | Procedure with Condition (heat, moon) and batch volume; thermal in craft_process |
| Eidolon wand recharge by ritual, consumable fed, not time | N37 | DATA | E-PROC | Recharge procedure restoring wand state |
| Charged object use is item damage | N37 | DATA | E-GEAR | Wear/charge counter on gear |
| Thaumcraft research tree categories unlocked by spiky entries | MR | DATA | E-RES | Dependency map category entries |
| Hex: spell as ordered list of typed patterns, run on stack machine | SR1, N07 | GAP | E-POW | Stored ordered verb list with typed stack evaluation; power_grammar has grammar but no stack/value-passing |
| Patterns as values, saved, edited, cast by item | SR1, SRY1 | GAP | E-POW | Recorded method as item; links to E-MAKE casting items |
| Action names encode stack shape | SR1 | OUT | none | Language-implementation detail, not a life-sim mechanic |
| Graded typed failure (garbage, yank, half health, harmless blast, lose sight) | SR2, SRY2 | DATA | E-POW | Failure-kind table with bounded consequences; harm state for effects |
| Operation cap ("lost in thought") | SR2 | DATA | E-POW | Cap row on method length |
| Overcast to health only after failing and learning | SR3, SR6, SRP3, SRY3 | GAP | E-POW | Gated body-payment branch (unlocked by fact); needs harm state hook |
| Great spells gated behind enlightenment; world-seeded strokes | SR3, X2 | DATA | E-RES | Gated ability + per-world seed using mixture_discovery pattern |
| Media units: dust/shard/crystal denominations, exact change phials | SR3 | DATA | E-ECON | Typed currency denominations |
| Casting item battery | SR3, SR22 | DATA | E-GEAR | Charge store on gear |
| Circuit blocks: impetus, slates, directrix, made by consuming villager profession | SR4 | GAP | E-HOME | Automated trigger installation with condition kinds; no automation owner |
| Ambit range 32 blocks, bound-player exception | SR4 | DATA | E-POW | Range row on method |
| Spellbook pages and focus storage tiers | SR4 | OUT | none | Inventory capacity of a modded item |
| Psi: 9x9 data-flow grid, selectors/operators/tricks, evaluation order | SR5, N07 | GAP | E-POW | Wired composition from known verbs; power_grammar needs a grid/slots composer |
| Compile-time stats (complexity, potency, cost, projection, bandwidth) capped by device | SR5, X4, SRP2, SRY4 | GAP | E-POW | Visible budget caps from carried device; part owns caps by equipped item |
| Visible budget before use / show bottleneck by name | SR5, SRP2, X3 | DATA | E-POW | action_legibility readout of cost/cap |
| Personal pool with overflow into battery then health then lockout until refill | SR6 | GAP | E-POW | Overdraw cascade with lockout; shares the body-payment part |
| Trick cost scales with chosen magnitude | SR6, SR22 | DATA | E-POW | Cost-formula row (power^2 etc) |
| Use-to-learn vocabulary: first execution unlocks group | SR7, SRP1 | DATA | E-RES | Unlock-by-use rows via skill_discovery |
| Occultism ritual: pentacle tier + bowl contents + activation book + optional sacrifice | SR8 | DATA | E-PROC | Procedure with Material, Condition (footprint tier), Agent (spirit) parts |
| Pentacle footprints scale with spirit rank | SR8, SRY5 | DATA | E-PROC | ritual_conditions graded condition by tier |
| Ritual runs 40-160 s, consumes bowls one at a time, interruptible, cue particles | SR8 | DATA | E-PROC | Ordered resumable steps with interrupt state |
| Top chalk needs essence from killing unbound spirit | SR8, SRP1 | DATA | E-PROC | Material gated behind a hazardous prior ritual |
| Job spirits: fixed job, rank scales speed and output | SR9, SR9a, X5 | DATA | E-COMP | companion_roster duty row with rank multipliers |
| Work area, deposit target via Book of Calling; re-bind if lost | SR9, SR21, N04 | GAP | E-COMP | Assignment token object (area, deposit, filter) separate from worker; duties owner |
| Spirit time limit, expiry drops whole inventory | SR9, SR21, N04 | DATA | E-COMP | Lifespan row plus drop on end |
| Idle backoff after finding no work | SR9, SR21 | OUT | none | Pathfinding AI timing detail |
| Task eligibility by recipe and tier window | SR21, N04 | DATA | E-COMP | Duty rows with min/max rank per recipe |
| Dimensional miners as item with operation durability | SR9, SR9b | DATA | E-GEAR | Gear with ops durability and rank table |
| Familiars: owner buffs, stored in jewellery, tradable master | SR10, N04 | DATA | E-COMP | companion_roster with passive stored form |
| Familiar upgrade levels, tablet config | SR10 | DATA | E-COMP | Stage rows |
| Resurrect rituals for spirits/familiars | N04 | DATA | E-PROC | Procedure producing companion state |
| Malum spirits: typed material (8 types) mapped to mobs, consumed | SR11, N03 | DATA | E-TRAIT | Typed reagent traits on creature drops |
| Altar: one carrier + quantity vector of typed inputs + building speed bonuses | SR11, N03, SRY6 | DATA | E-MAKE | defineCastMaking recipe with trait counts; nearby buildings via E-FIELD/home modifiers |
| Crucible focusing, soul binding, runeworking, void favor, tool repair with spirits | SR11 | DATA | E-GEAR | Gear work rows (gear_work, rune_grammar) |
| Totem rites: ordered spirit stack matched bottom up, corrupt base variant | SR12 | DATA | E-GEAR | rune_grammar ordered sequence row with paired variant |
| Rite pulse every 5 s, radial buffs, no consumption, toggle | SR12, SR20 | DATA | E-FIELD | Standing field effect over place |
| Locus rite: roving spark with tiered attributes and routable anchors | SR12, SR20 | GAP | E-FIELD | Moving effect that travels a path and is modified by anchors; field_layer is static |
| Stone ward damage factor (uncertain reading) | SR20, SRG13 | DATA | E-POW | Damage-cut effect row; value unresolved |
| Goety: one focus per spell, staff element bonus | SR13 | DATA | E-GEAR | Equipment decides available abilities |
| Soul energy pool filled by kills in a store | SR13, N08 | DATA | E-POW | Resource pool with act-filled income |
| Per-spell servant caps and cooldown | SR13, N08, X5 | DATA | E-COMP | Cap and cooldown rows |
| Soul cost multiplier stack (robes, place, enchant, summon-down) | SR18 | DATA | E-POW | Cost modifier rows incl. place-favoured (E-FIELD/biome) |
| Summon-down: repeat summoning taxes cost and weakens servants | SR18, SRP7 | DATA | E-POW | Repeat-penalty row on recent-use counter |
| Casting near witnesses lowers opinion | SR18 | DATA | E-REP | Per-audience reputation hit on visible casting |
| Servants expire by bleeding, crowns/robes stop or heal | SR19, N08 | DATA | E-COMP | Lifespan with decay damage; gear rows |
| Servant recall by sneak-cast | SR18 | OUT | none | Input binding detail |
| Altar rituals tiered by craft type and structure, research-gated recipes | SR13 | DATA | E-PROC | Condition by structure; research gate E-RES |
| Roots: plants to mortar powder carrying component and three counts | SR14, N06 | DATA | E-MAKE | Craft output with parameter counts (potency/efficiency/size) |
| Sideways-item modifiers (dusts, runes, obelisks) tune base effect | SRP6, SR14 | DATA | E-MAKE | Optional Material parts with effect modifiers |
| Staff uses and mana per cast divided by efficiency | SR14 | DATA | E-GEAR | Uses counter and cost formula |
| Roots rituals (bowls + incense) make tools, standing stones | SR14 | DATA | E-PROC | Procedure rows |
| Totemic: three-state machine, selection window, 13 ceremonies by instrument order | SR15, N36 | GAP | E-PROC | Multi-participant performance with state machine; no group procedure part |
| Per-instrument music caps force several contributors | SR15, N36, SRY7 | GAP | E-PROC | Contribution caps per source type across actors; groups seam |
| Startup time limit fails attempt | SR15 | DATA | E-PROC | Timed step with fail |
| Ceremony effects (buffs, weather, convert animal, cure, growth, sun dance hp cost) | SR23 | DATA | E-POW | Effect rows incl. participant cost |
| Carved pole boons scale with repeats and stored music; decaying meter | SR15, SR23, N36 | DATA | E-HOME | Installation with decaying meter; field effect |
| Music meter drains over time (upkeep) | SR15 | DATA | E-FIELD | Decay law |
| ElementalCraft: four elements, shrines draw from buffer at rate/period/range | SR16 | DATA | E-FIELD | Element field with shrine consumer rows |
| Shrine upgrades with per-upgrade caps; runes trade preservation vs speed | SR16 | DATA | E-GEAR | Upgrade/rune dimension rows |
| Tool infusion, one per tool | SR16 | DATA | E-GEAR | gear_affixes with slot limit |
| Natural source exhausts, refills only when empty; artificial source breaks | SR24 | DATA | E-FIELD | Source with exhaust-refill hysteresis law |
| Rarer source traits by distance from spawn | SR24 | DATA | E-GATH | Gathering node rarity by distance |
| Pipe throughput by tier, min along path | SR24 | OUT | none | Base logistics network |
| Idle shrine costs nothing; upkeep only when work happens | SR24, SRP8 | DATA | E-FIELD | Consumption-on-action rule |
| Biomancy living tool with nutrient store; refuses at zero | SR17, N09, SRY8 | DATA | E-GEAR | Fuel meter on gear; refuse at empty |
| Self-feeding routes (hotbar, food bar) | SR17 | DATA | E-GEAR | Refill route rows with body cost |
| Nutrient machines (decomposer, digester, forge, lab) | SR17, SR25 | DATA | E-MAKE | Craft recipes with nutrient fuel |
| Machine progress rises on fuel and falls twice as fast when starved | SR25, RM5 | GAP | E-MAKE | Regressing progress on stalled supply; native_craft_transaction has no decay-on-stall |
| Serums: one-shot body changes | SR17 | DATA | E-MAKE | Consumable effect rows (body state) |
| Gate by failure or ritual, not points (four unlock currencies) | SRP1 | DATA | E-RES | Unlock-by-fact variants |
| Persistent installation vs consumable | SRP4 | DATA | E-HOME | Two row kinds |
| Actors with caps, lifespans, custody token | SRP5, X5 | DATA | E-COMP | See Book of Calling GAP |
| Penalise repetition instead of forbidding | SRP7 | DATA | E-POW | Repeat-penalty rows |
| Blood Magic soul network: per-person account shared by bound items, ticket log of 16 | RM1, RMY1 | GAP | E-ECON | Personal typed-currency account read by all bound objects; ledger exists, bound-object reader does not |
| Vessel tier sets account ceiling not income | RM1 | DATA | E-GEAR | Ceiling row on vessel item |
| Income by bodily sacrifice, floor at 10% health, incense multiplier | RM2 | DATA | E-POW | Income route row with body cost (harm state) |
| Empty account converts to injury at fixed rate; toggles keep draining | RM3, RMY1 | GAP | E-POW | Injury overdraft; same part as overcast cascade |
| Altar tiers as footprints; rune counts as dials with formulas | RM4, RMY2 | DATA | E-HOME | home_model improvements with counted add-on blocks and printed formulas |
| Altar recipe: syphon total, consume/drain rate, min tier, batch price | RM5, RMY3 | DATA | E-MAKE | Craft with LP bill and min station tier |
| Standing ritual: activation fee, pulse fee, nausea-and-skip on low funds | RM6, RM12b, RMY4 | GAP | E-PROC | Standing procedure with periodic upkeep and graded refusal; making_procedure is run-to-completion |
| Ritual pause keeps fee; layout break needs new activation | RM6 | DATA | E-PROC | Procedure state resume rule |
| Crystal tier gates nothing (absence) | RM7 | OUT | none | Version finding, no mechanism |
| Rune colours; ritual area regions with cap that depends on demon will | RM8 | DATA | E-FIELD | Region cap law keyed to a field value |
| Demon will: typed per-chunk resource from kills, drained by crystals, sqrt yield, 50 threshold | RM9, RM10 | DATA | E-FIELD | Typed field with kill source, consumer sink, threshold law |
| Soul forge: carried minimum and drain rate | RM10 | DATA | E-MAKE | Condition requiring carried vessel level |
| Living armor point budget, use-unlocked levels, negative-cost handicaps refund | RM11, X4 | GAP | E-GEAR | Point-budget build with handicap refunds; gear_dimensions has no budget ledger |
| Sigil costs per use or per 100 ticks | RM12b | DATA | E-POW | Cost table rows |
| Starlight yield = quality x moon/constellation x night ramp x structure bonus | RM12, RMY5 | DATA | E-GATH | Product-of-factors income law |
| Transmission loss per node, split among links | RM12 | OUT | none | Power-network routing |
| Moon-phase calendar chooses which sources exist tonight, per-world seed | RM13, RMY6 | DATA | E-GATH | World calendar rows with soft fall-off |
| Lightwell: catalyst makes liquid, sub-linear yield, breaks over time | RM14 | DATA | E-MAKE | Catalyst Material with wear and slow output |
| Attunement choice: once, gated by night, structure, discovery, standing still | RM15 | DATA | E-PROC | Procedure with Conditions; one-time flag; reset by consumable |
| Research tiers; altar recipes name tier; consumed focus item | RM16 | DATA | E-RES | Tier gate and consumed Material |
| Perk levels cheap then steep (1.2 growth), gain per event capped | RM17 | DATA | E-RES | Level curve rows; cap per event |
| Five behavior roots feeding progress | RM17, RMY7 | DATA | E-RES | skill_discovery practice by act |
| Diminishing multiplier on spam, regains with pace | RM17 | GAP | E-RES | Time-based diminishing return on practice gain; no such part named |
| Perk removal needs crafted nullifier | RM17 | DATA | E-MAKE | Consumable reset item |
| Lumen: typed worn fuel consumed by action kind | RM18 | DATA | E-GEAR | Worn binding with typed fuel burn per action |
| Focal transmutation of world blocks over long window | RM19 | DATA | E-FIELD | Site transformation procedure with focus |
| Starlight infuser: item next to fluid, per-tick consumption chance | RM19 | DATA | E-MAKE | Craft process with chance consumption |
| Artifact: hidden conditions, stability ladder, penalties, stabilizes into component | RM20, RMY8 | GAP | E-RES | Misfiring relic with hidden conditions and escalation ladder; mixes E-PROC and discovery |
| Forge: four typed tanks capped by tier; ritual = item bill + essence bill + tier | RM21, RM24 | DATA | E-MAKE | Craft with typed resource bill and station tier |
| Started rite cannot be touched; interference loses inputs, essences gone | RM22 | DATA | E-PROC | Procedure fail rule with loss set |
| Essence income channels (damage nearby, bottles, souls, XP) | RM23 | DATA | E-GATH | Source rows per behavior |
| Transmute-in-place ladder, each rung consumes previous | RM24 | DATA | E-GEAR | Gear upgrade chain rows |
| Station upgrades itself by ritual; needs full rare tank | RM25, RMY9 | DATA | E-HOME | home_purchase improvement with tank-full condition |
| Enhancer lowers gate, not bill; keep gate and bill separate | RM26, RMY10 | DATA | E-PROC | ritual_conditions graded condition vs spend as two numbers |
| Time-window enhancer (crescent moon) | RM26 | DATA | E-GATH | Calendar condition modifier |
| Player essence pool regenerates by worn set; item declares cost | RM27 | DATA | E-POW | Regen from gear; cost on ability |
| No corruption meter; risk is process loss (absence) | RM28 | OUT | none | Version finding; world names its own agent |
| Applied item modifiers via smithing reagent, exclusive lists | RM29 | DATA | E-GEAR | gear_affixes with incompatibility list |
| Essence-transform recipes spending essence on input | RM29 | DATA | E-MAKE | Craft row with essence bill |
| Wand parts as data (accuracy, damage, speed) | RM29 | DATA | E-GEAR | gear_dimensions part rows |
| Worlds assert local law on imported things | X6 | DATA | E-FIELD | Per-world law rows |
| Commitments recoverable at a price (salvage, regen) | X7 | DATA | E-MAKE | Salvage/refund recipes |
| Wear and debt as compounding risk | X8 | DATA | E-GEAR | Break chance growth past lifetime |
| Informative-failure puzzles (right and placed vs misplaced), per-world code | X2 | DATA | E-TRAIT | mixture_discovery feedback rows |
| Small typed budgets cap growth | X4 | GAP | E-GEAR | Slot/integrity budget ledger (shares living-armor GAP) |
| Outcome fixed before roll is seen; grades just go up | X10 | DATA | E-MAKE | craft_failure_ledger fair-random seed rule |
| Quest book as market and graph | X9 | OUT | none | Quest-pack structure; not a one-person-life mechanism |
| License/source ledger, decompile counts, pack manifests, tool versions | DC | OUT | none | Provenance bookkeeping about mods, not a game mechanism |
| Vault Hunters / Ultimate Alchemy manifest-only gap | DC, G1 | OUT | none | Acquisition note |

### Unmapped residue

- DC_SOURCE_IDENTITY has no mechanisms; everything is provenance and licensing, folded into the last two rows.
- SYNTHESIS lane table, G2 to G5 gap bullets and the pass 2 corrections list were not mapped (bookkeeping). X-patterns were mapped only where they add a distinct mechanism (X2, X4, X6 to X10).
- Thaumcraft per-category theory penalty ("lower categories lose a third") folded into the theorycraft GAP row.
- Blightfall research changes (aspect caps, MineTweaker research, HQM autopsies) and Botania per-flower numbers beyond MR18 not individually mapped; Botania lexicon gating was folded into the advancement-gate row.
- Spectrum 839 advancements and trigger-type mix: treated as one advancement-gate row, trigger types not itemised.
- Ars Nouveau appears just in the SR comparison table (not re-read); not mapped.
- Needs confirmation that field_layer supports neighbour diffusion and signed spots, and that E-COMP duties can hold an assignment token. Marked DATA/GAP on the brief's descriptions just.

## Shard B: GT_GREGTECH_DEEP_DIVE, TA_TECH_AUTOMATION, TB_MEKANISM_AE2_IE_THERMAL
| Mechanism | Sources | Class | Engine | Row or missing part / reason |
|---|---|---|---|---|
| Material as capability blocks that auto-add prerequisites and emit a product family | GT1 | GAP | E-TRAIT | capability-block generator: material row derives ingot/plate/wire/tool-head recipes; making_traits has traits but no derive-family step |
| Hazard property on material (trigger, PPE slot, derivatives) | GT1 (Hazard note) | DATA | E-TRAIT | trait row "hazardous" with trigger + condition; protection gear as E-GEAR affix; harm via harm state |
| Process time derived from mass x process scalar, with override | GT1b | DATA | E-MAKE | craft_process_* duration formula row; per-material override field |
| Optional consumable speeds a process (noble-gas ladder) | GT1c | DATA | E-MAKE | catalyst/aid row on craft_process_thermal: ratio + rarity |
| Alloy shortcut recipe derived from formula, gated by machine | GT1d | GAP | E-MAKE | formula-derived recipe generator from alloy components (mixture_rules has no auto-derive) |
| Tier ladder (one number gates machine, conduit, part, recipe) | GT2, GT11 | DATA | E-MAKE | era tier number on recipes and stations; one comparison gate; per-world step dial |
| Transformers, diodes, per-hop loss (concentrate flow in fewer links) | GT2b, TB13 | GAP | E-FIELD | conduit network with capacity, loss per hop, converters; no network layer exists |
| Overclock ladder (power for speed, perfect/standard) | GT3, GT12, GT15, TA5, TB12, TB35 | DATA | E-MAKE | craft_process rate rule: ratio per station class; fixed energy bill, variable rate |
| Tier skip (run one tier above rating) | GT12 | DATA | E-MAKE | recipe-gate row with allowed skip + penalty |
| Recipe modifier pipeline (ordered pure modifiers, cancel with reason) | GT3b | GAP | E-MAKE | ordered modifier list over a base recipe with named cancel reason; resolver has fixed stages |
| Parallel batching clamped by inputs and output space | GT3b | DATA | E-MAKE | craft_batch_goal quantity clamp row |
| Named recipe conditions (weather, biome, Y, adjacent, cleanroom) pause work with reason | GT3c | DATA | E-PROC | ritual_conditions graded condition rows; field_layer supplies weather/place |
| Chanced outputs with half-banked pity | GT3d, TB36 | DATA | E-MAKE | chance row + pity carry in craft_failure_ledger |
| Typed part layout multiblock; parts set traits (coil, hatch, filter) | GT4, GT4b, TA18, TB16, TB4 | GAP | E-MAKE | structure template with typed part slots, all-or-nothing validation, one state object; home_model has furnishing but no template validator |
| Coil ladder feeding several machine formulas | GT4b, GT15 | DATA | E-GEAR | part-grade ladder rows; one grade value read by several craft_process rules |
| Port power contract; over-voltage destroys weakest part | GT4c, GT7, TB13, TB14 | GAP | E-FIELD | overload consequence on a conduit (heat, burn, sacrifice part); needs power network |
| Warm-up as stored state, decays idle | GT4d | DATA | E-FIELD | heat field on station place with decay; recipe start-heat row |
| Steam boiler hazard (dry then refill explodes), throttle, rotor wear | GT4e, TB19 (generators) | DATA | E-FIELD | pressure/heat field rows + harm event; rotor as wear part |
| Ordered-input assembly line + data-item research unlock | GT4f, GT16 | DATA | E-PROC | making_procedure ordered steps; data item as a material from E-RES insight |
| Computation flow with grace window then loss | GT16 | OUT | n/a | machine compute stream; no one-person analogue |
| Ore stage graph with byproduct slot per stage | GT5, GT18 (ore), TB2, TB37 | DATA | E-MAKE | craft_process_separation chain rows; byproduct slot per route |
| Reagent-grade ladder (yield step per grade, new reagent line) | TB2, TB3 | DATA | E-MAKE | processed_materials grade rows; reagent crafted by E-MAKE; dilution loops as recipes |
| Large vein deposits with surface tells and weighted lottery | GT5b, GT19 | DATA | E-GATH | gathering_model node rows: weight, density, surface tell; prospecting via E-RES |
| Depleting deposit toward floor or true exhaustion | GT6, GT19, TB15 | GAP | E-GATH | deposit depletion counter with floor/exhaust dial and survey readout |
| Higher-tier rig: faster yield, slower depletion | GT6 | DATA | E-GATH | tool/rig row modifying yield and depletion rate |
| Pipe/container limits (heat, phase, acid, cryo) | GT7b | DATA | E-TRAIT | container trait rows vs material_corrosion; leak consequence |
| Covers: per-face attachments with tier-set rates | GT7c, TB40 | OUT | n/a | machine face automation UI |
| Maintenance fault set (six bits or six tools) blocks or degrades work | GT8, GT14, TA2 | GAP | E-MAKE | station wear/fault state with cures (consumable or tool), compounding break roll, quality tiers, auto-restock |
| Maintenance bypass by cross-system resource | GT20 | DATA | E-ECON | cost row: pay another system's resource to remove chore |
| Circuit/wafer quality ladder; yield multiplied by cleanliness | GT9 | DATA | E-TRAIT | grade trait on intermediate; cleanliness as place field; yield multiplier rule |
| Program-number slot selects recipe variant | GT9, GT18 (plastics) | DATA | E-MAKE | variant selector on a recipe row |
| Pollution ledger per region, spread, decay, thresholds | GT10, GT13, TB5 | GAP | E-FIELD | regional trace layer: emit, decay, diffuse above floor, stacked threshold harms, mitigation parts |
| Hazard from handling: point sources, falloff, log-scale effect, shielding | TB5, TB14 | GAP | E-FIELD | point-source hazard field (same part as pollution) plus harm state |
| Hub with module slots opened by part grade, fixed parallels | GT17 | OUT | n/a | late-game megastructure; no one-person scale |
| Long graded chains with success chance and recycle boost | GT18 (water, bauxite, nanites) | DATA | E-MAKE | chained recipe rows with chance; recycled stream as input |
| Optional catalyst/gas as efficiency dial | GT18 (plastics), TB36 | DATA | E-MAKE | catalyst record rows (see catalyst record) |
| Upgrade needs prior tier of same machine | GT18 (nanites) | DATA | E-GEAR | gear_workshop upgrade prerequisite row |
| Authored chapter per tier with side lines | GT11 | DATA | E-RES | research_view dependency map: one node per era |
| Pacing aids (first contact quest, discovery cheapens staple) | GT20 | DATA | E-RES | dependency map edge / world event |
| Informative-failure alchemy (hidden code, waste item records hits) | TA1 | GAP | E-TRAIT | per-save hidden recipe code and feedback counts on waste result; mixture_discovery is nearest |
| Shared cap budget, UI prints each cap (min over named caps) | TA3, SP1 | DATA | E-MAKE | stall-reason rows listing every limiting cap in craft quote |
| Operating-condition gates (min pressure, temperature window) | TA4, TA9, TA16 | DATA | E-FIELD | field_layer heat/pressure reading as recipe condition rows |
| Air/pressure over danger -> explosion chance with warning | TA4 | DATA | E-FIELD | pressure field + harm event row |
| Manual boost items (catalyst, lubricant) for timed speed | TA5 | DATA | E-MAKE | boost agent in making_procedure (Agent part) |
| Efficiency ramp climbing per batch, decaying on underpower | TA5 | GAP | E-MAKE | per-station momentum counter across batches |
| Rotary power as conserved pool; heat/rotary convert | TA6 | GAP | E-FIELD | second conserved field (motion) plus converter; heat exists just |
| Part errors stored, shown, deactivate then reactivate on change | TA7, TA21 | DATA | E-MAKE | status/failure ledger entries with reason text |
| Retained object with few numbers edited by consumables to a cap | TA8, SP6 | DATA | E-TRAIT | item trait bag with bounded bonuses (material_treatment) |
| Hot-air flow: temperature in/out, stacking order puzzle | TA9 | DATA | E-FIELD | heat field with per-station loss rows |
| Guided unlock by discovery; teaching book/ponder | TA11, SP5 | DATA | E-RES | insight-gated unlock entries |
| Train schedule: OR columns, ordered AND, retry cooldown | TA12 | GAP | E-ECON | standing-order primitive (wait conditions, retry); obligations_ledger holds debts just |
| Cheapest-path station choice with occupancy penalties | TA13, SP7 | OUT | n/a | rail routing and signals |
| Address-matched packages, promise-aware restock gauges | TA14, SP8, TB26 | GAP | E-ECON | standing restock order counting in-flight orders as stock |
| Drone program VM with visible trace | TA15 | GAP | E-COMP | simple pointer-and-label routine for a companion; lowest priority |
| Heat network (capacity, resistance, clamp to equilibrium) | TA16 | DATA | E-FIELD | field_layer heat exchange rows |
| Upgrade adjacency, distance falloff, all-copies-off over limit | TA17, SP9 | DATA | E-GEAR | gear_affixes limit rule per-world adjective |
| Multiblock rematch on block update, hatch claim | TA18 | GAP | E-MAKE | same template validator as structure row |
| Beam of four numbers classified by ratio into alignments | TA19, SP10 | DATA | E-TRAIT | trait ratio classifier rows (mixture_rules style) |
| Shared-heat-pool mixture, reaction windows, catalyst not consumed | TA20, TA16 | DATA | E-TRAIT | mixture_rules reaction rows with temperature window and catalyst |
| Lazy cached expression validation | TA21 | OUT | n/a | in-game programming language |
| Exact nuclear-tier conservation (fusion/fission pairs) | TA10 | OUT | n/a | element table; conservation not a life-sim need |
| Item tier not mass-balanced (ore 32 units, block 144) | TA10 | DATA | E-TRAIT | processed_materials unit-yield rows |
| Ember emitter rate limit + back-pressure | TA1 (donor N12) | GAP | E-FIELD | rate-limited transfer with back-pressure check (network layer) |
| Upgrade chips as exponent dials with caps | TB1, SP-B1 | DATA | E-GEAR | gear_affixes dial row: cap, speed exponent, energy exponent |
| Chips as typed numeric bags, per-stat stacking, recompute on change | TB33 | DATA | E-GEAR | gear_dimensions stat recompute from slot list |
| Every boost carries a compounding tax | TB34, TB30 | DATA | E-GEAR | affix row pairs gain with cost multiplier |
| Rebuild-safe multiblock merge, overflow rejected | TB4 | GAP | E-MAKE | content-preserving rebuild rule in structure validator |
| Shared buffer transmitters; merge refusal for mixed contents | TB7 | OUT | n/a | pipe network internals |
| Item transport routing with cost and colour filters | TB8, TB20 | OUT | n/a | conveyor routing |
| Two-axis storage (count cap, kind cap, overhead per kind) | TB9, TB22 | GAP | E-HOME | container with kind-count and size budget (home furnishing storage); Q6 unowned |
| Priority storage, asymmetric insert/extract | TB23 | OUT | n/a | network storage routing |
| Digital miner radius and cost multipliers, filters | TB10 | DATA | E-GATH | gathering rule row: area cost multiplier, filter list |
| Environmental-rate rules (evaporation, solar, biome) | TB11, TB19, TB39 | DATA | E-GATH | site quality row from weather/biome/season; E-FIELD for heat |
| Site-scanned ambient producers, co-location penalty | TB19, TB39, SP-B6 | DATA | E-GATH | gathering node yield with neighbour penalty rows |
| Fission risk loop with hysteresis and meltdown | TB6 | DATA | E-FIELD | heat field + damage accrual + harm event; world-specific |
| Wire tiers, rationing, loss per length, burnout | TB13 | GAP | E-FIELD | same conduit network part as GT2b |
| Finite vein with attempts count, site-quality roll, honest readout | TB15 | GAP | E-GATH | same depletion part as GT6; survey readout in E-RES |
| Lump energy, power sets speed; starved machine pauses | TB12, TB35 | DATA | E-MAKE | station failure policy (pause/reset) row |
| Speed bought in power with constant fuel per item | TB17 | DATA | E-MAKE | craft_process_thermal rule: fuel per item invariant |
| Blueprint category held to unlock group of recipes; cloneable find | TB18, TB31 (presses) | DATA | E-RES | knowledge item unlocking recipe tag; duplication recipe |
| Tool upgrades as predicates on tool | TB18 | DATA | E-GEAR | gear_work upgrade rows |
| Kit batching: release only when quotas met | TB20 | DATA | E-PROC | making_procedure Material step with all-quotas condition |
| Channels as tree bandwidth allocation | TB21, TB29 | OUT | n/a | ME network bandwidth |
| Plan before run: recursive demand tree, missing-items list | TB24, TB25 | GAP | E-MAKE | plan-tree quote showing missing inputs and "craft less"; craft_batch_goal is flat |
| Crafting CPU memory vs accelerators (two dials) | TB25 | OUT | n/a | compute scheduler |
| Pattern slot attached to workstation, blocking mode | TB26 | OUT | n/a | AE2 automation |
| Cards buy integer throughput; idle polling backoff | TB27 | OUT | n/a | engine tick tuning |
| Pocket space priced convexly with build-quality discount | TB28 | OUT | n/a | spatial storage; no book-world fit unless world has pocket spaces |
| Short-code wormholes attuned by showing item | TB29 | DATA | E-POW | power_grammar linking effect row, if a world has it |
| Self-decaying crystal farm; once-per-region find | TB31 | DATA | E-GATH | gathering node with decay per harvest; world event for find |
| Shared power pool, burst limit, brownout hysteresis | TB32 | OUT | n/a | grid power; fold into conduit GAP if wanted |
| Catalyst five-number record; unlisted chance locked at 100% | TB36 | DATA | E-MAKE | catalyst row {primary x, secondary x, energy x, min chance, burn chance} |
| One recipe schema, self-feeding byproduct loop | TB37 | DATA | E-MAKE | craft_recipes schema already one shape; byproduct feeds catalyst |
| Demand-following generators; auto-priced fuel by attributes | TB38 (Q13) | DATA | E-ECON | derived value rule from item traits (AD38) |
| Face roles; capacity vs throughput stats separate | TB40, SP-B3 | OUT | n/a | machine face config UI |
| Failure policy as a station property shown at station | SP-B2, Q15 | DATA | E-MAKE | failure policy field on station + action_legibility line |
| Plan, reserve, run (job inventory) | SP-B4 | GAP | E-MAKE | job reservation; same part as plan-tree |
| Finite sources measured in attempts | SP-B5 | DATA | E-GATH | counter on node (see depletion GAP) |
### Unmapped residue
- Part-level details skimmed in the audits' own "not read" lists (Mekanism fusion, QIO crafting, AE2 terminals, IE sawmill/mixer, Thermal crafter/brewer, Create train physics, MI nuclear) are not mapped; the audits did not read them.
- GT19 ore seeding geometry (3x3-chunk cells) and layered generators: just the weighted-deposit idea was mapped; chunk geometry is OUT.
- GT17 module parallel numbers and GT11 per-tier amp limits are unverified in the source and were not mapped beyond their shape.
- TB4 "items drop near the nearest player" is world-side overflow behavior; folded into the rebuild-safe row.
- Ember activator yields and Create ponder/advancement counts (TA11) mapped just as unlock-by-discovery.

## Shard C: WV2_ECONOMY_TIERS, WV2_QUESTS_LOGISTICS, WV2_WORLD_FACTION, EP_PACK_PROGRESSION, SYNTHESIS_2026-10-23

Source prefixes: ET/QL/WF/EP are the lane codes of the first four files; X, C, RM, SV, GT, TB codes come from SYNTHESIS (their lane files are other shards). "quests" = src/quests.js plus native_unlock_transaction, storylet deck. "harm" = harm state seam. "worldev" = world events seam.

| Mechanism | Sources | Class | Engine | Row or missing part / reason |
|---|---|---|---|---|
| Price derived as cheapest recipe path from a few pinned anchors (design-time proposer, auto-price unlisted goods) | ET1, X13, TB38/Q13, ET23 Q-yardstick | GAP | E-ECON | Recipe-graph price solver (min over recipes); use as designer tool and as an equivalence-law world's yardstick |
| Floor rounding makes split-and-recombine lose value | ET2 | DATA | E-MAKE | craft_resolver law row: integer floor per split step, unit size per world |
| Loop-profit detection, silent zeroing of exploit values | ET3, ET24 | OUT | none | Anti-exploit hardening; solo player (AD22). Keep just "report loops to designer" as a check |
| Pinned anchor table with a reason line, inherit by category | ET4, ET9 | DATA | E-ECON | Anchor rows (good, price, reason); category inheritance row |
| Buy/sell spread per changer, symmetric as a dial | ET5, ET22 | DATA | E-ECON | Per-merchant spread value; economy_standing exchange row |
| Passive producer income scaled by light, buffered, adjacency bonus, no relay chaining | ET6, ET22 | DATA | E-HOME | Home improvement row: producer tier, buffer, world-condition scaler (light, tide, season), adjacency bonus |
| Universal converter: pile of value into one chosen good | ET7, ET21 | DATA | E-ECON | Equivalence-law world exchange row; default needs a mechanism input (AD38) |
| Learn by studying one sample, kept for life | ET8, Q-learn | DATA | E-RES | inquiry_study row: sample consumed or returned, lesson in head, book or institution |
| Tier rungs of grown or found goods by rarity | ET10, X14 | DATA | E-GATH | Rung rows per good; rung count and width per world |
| Fixed integer ratio ladder, lossless breakdown, durable catalyst | ET11, X14, C8 | DATA | E-MAKE | Recipe rows both ways; catalyst as a durable with uses; ratio per world |
| Planting stake of real good plus lower-tier produce, held for plot life, reversible at a loss | ET12, ET23 Q-stake, X22 | GAP | E-GATH | Plot with a held stake exposed to blight or raid, and salvage rate |
| Essence-to-goods hand-set exchange table (magic farm vs trade) | ET13, ET22 | DATA | E-ECON | Per-good exchange rows; steepness as dial |
| Yield 1 per harvest plus bonus chance by ground match; seed returns | ET14 | DATA | E-GATH | gathering_model yield row with ground-match bonus chance |
| Root yield linear in land tier | ET15 | DATA | E-HOME | Improvement tier row feeding E-GATH yield slope |
| Growth accelerator scales reach (plots served), not speed | ET16 | DATA | E-HOME | Improvement row: reach per tier, gem cost |
| Instant-ripen fertilizer as a gem-costed consumable | ET17, Q-hurry | DATA | E-MAKE | Consumable recipe; per-tier eligibility; sink not throttle (ECR30) |
| Living resource gated by kill count of a creature (soul jar) | ET18 | DATA | E-MAKE | Material row: filled jar, capacity per creature family |
| Top-rung keystone placed two below plot, from rarest drops | ET19, Q-keystone, X22 | DATA | E-PROC | ritual_conditions Condition: required placed object, consumed or not |
| Awakening altar side branch, vessels at pedestals | ET20 | DATA | E-PROC | Procedure with Agent and vessel Materials |
| One pricing logic per world; mixed tables = stated market with spread | ET21, ET24, C1 | DATA | E-ECON | World basket declares its price source; arbitrage allowed as market feature |
| Limit knobs as adjectives (spread, rate, sureness, gating, reversibility, hurry) | ET22, C5 | DATA | E-ECON | Per-world dial values; no engine change |
| Quest/arc node policy inherited file > chapter > node with tristate | QL1, X18 | GAP | quests | Policy inheritance with explicit "inherit" state for arc nodes |
| Visible, startable, complete as separate questions; foreshadow levels (lock, shape, hidden) | QL2, QL10, EP6 note, SP6 | GAP | quests | Per-node foreshadow level independent of gate |
| Gate vocabulary: all/one/count, AND NAND OR NOR XOR XNOR, min_required | QL2, QL10 | GAP | quests | Gate rule with exactly-one and all-but-one forms |
| Linear vs flexible progression: work done early counts | QL3 | GAP | quests | Per-arc flag; needs record of when work happened (work ledger) |
| Choose-one-path branches, max N children, cut-off branches stop counting | QL4, C7, X18 | DATA | quests | Exclusive-branch receipt exists (ENGINE_AUTHORING); add N and downstream cut-off rule as data |
| Task catalogue (have, do N, be there, see, checkmark, stage, advancement) | QL5 | DATA | quests | Task type rows; observation timer and manual checkmark are small additions |
| Reward kinds and claim flags (give, choose, roll, command, auto-claim) | QL6 | DATA | quests | Reward type rows in native_unlock_transaction |
| Weighted reward table: weights, nothing weight, draws, weight 0 = guaranteed, shown odds | QL7, Q4, EP table (E6 loot-table rewards) | DATA | storylet deck | Table row shape; write every field explicitly in authored data |
| Shared household progress; per-reward household vs personal claim; claim-to-reset repeat | QL8, Q3, EP2 | GAP | E-HOME | Household-scoped arc progress and claim scope; groups seam |
| Join/leave merges progress (max progress, earliest time, keep claims) | QL9 | GAP | E-HOME | Merge rule for household arc when heir or spouse joins or leaves |
| Global first-in-realm quests; shared completion | QL11 | GAP | worldev | World-scope claimable milestone seen by all actors |
| Time-aligned repeats (market day), repeat cooldown from reset | QL8, QL11 | DATA | E-GATH | World calendar rhythm row on a repeatable arc |
| Simultaneous-task rule; progress accumulates while locked | QL11, EP quest locks | DATA | quests | Flags on task group; lockedProgress as record-early (see flexible row) |
| Hardcore lives counter attached to a book | QL11, Q5 | OUT | none | Lives stake is a game mode; harm and death already own consequences |
| Party sharing decided by each task type; shared kill credit within a time window | QL12, EP17, Y9 | DATA | E-COMP | Contribution window row on conflict frame; companions and helpers share credit |
| Authored content, progress and party data stored separately | QL13 | DATA | content packs | Already matches pack vs save split and save privacy rule |
| Rescue layer: emergency stock with cooldown, named cost to skip | QL14, EP14, N23, Y6, Q5 | DATA | E-ECON | story_requests receipt: relief grain as an obligation with cost (obligations_ledger) |
| Tier as a data record; speed = slowest piece on route; nine services per corridor; mixed tiers allowed | QL15, Q9 | DATA | E-HOME | Lane or carrier tier rows; min-of-segments rule |
| Per-room carrying routes: colour lanes, priority, round-robin, filters, no pathfinding | QL16, Q8, X19 | GAP | E-HOME | Home lane between rooms (optional layer per ECR2); waiting-because line |
| Tuning part with a level scaling speed, buffer, efficiency (L squared, linear, stepped) | QL17, QL18, Q6 | DATA | E-MAKE | craft_process_* rate/capacity as formula over a part trait (E-TRAIT) |
| Machine does nothing without its tuning part (required part gate) | QL17 | DATA | E-PROC | Condition: required tool or part, no substitute |
| Power draw browns out a small source | QL18 | OUT | none | Electrical grid; use fuel and staff time in book worlds |
| Found parts: random base, one or two specialty stats whose override replaces base | QL19, Q7 | DATA | E-GEAR | gear_affixes roll table; chance of second and third specialty |
| Flat storage disks, capacity as one integer | QL20 | DATA | E-HOME | Furnishing row: capacity |
| Plan before craft: tree, to-craft / from-stock / missing list, loop refusal, timeout | QL21, Q9, X19, TB24/25 | GAP | E-MAKE | Plan preview over craft_batch_goal showing missing inputs; loop guard |
| Waiting states on a stalled job (ready, locked, no machine, does not accept) | QL22, X15 | DATA | E-PROC | making_procedure step status vocabulary |
| Crafter speed upgrades by slot; processing node pushes input sets to machines | QL22 | DATA | E-GEAR | Upgrade rows on a workstation; flat interval table |
| Upgrade cards each with printed flat cost, no curve | QL23 | DATA | E-GEAR | Fitted-part rows with fixed upkeep |
| Per-person permissions and "who last touched this" on shared storage | QL24 | GAP | E-HOME | Household permission set and last-changed record; positions seam |
| Keep-in-stock standing order, lock/unlock a crafter by signal | QL25, X19 | DATA | E-MAKE | craft_batch_goal standing target with threshold |
| Grid UI: search prefixes, sort, filter tabs, merged preview table | QL25 | OUT | none | Pure inventory UI polish; preview content is covered by plan-preview row |
| Kit batching and quotas as a release rule | X19, Q14 | DATA | E-ECON | owed_ledger_sources / duty release rule row |
| Channel bandwidth with nearest-first allocation | X19, TB21/Q7 | OUT | none | Network-tech scarcity; lane tier covers the useful part |
| In-flight promises counted as stock | X19, TA14 | DATA | E-ECON | obligations_ledger promised deliveries (MF19/MF26 exist) |
| Culture as a folder of typed records with merge rule per family | WF11, WQ1 | DATA | content packs | Pack record families; missing family falls back to neutral default |
| Settlement growth: layout slots by role, tier order, weighted pick, upgrade priority far below new | WF1, WQ2 | GAP | worldev | Settlement growth engine for NPC places (tiered weighted project pick, one at a time) |
| Unaffordable project replaced by affordable fallback; sleep/cooldown | WF1 | GAP | worldev | Part of settlement growth engine |
| Build bill derived from plan parts with free-block list and any-local-wood wildcard | WF2, WQ3, X13 | DATA | E-HOME | home_purchase improvement bill computed from parts; world free list |
| Place maturity rises with distance from start; spacing; activity radius | WF12, WQ4 | DATA | sites | Site maturity ramp rows (start, end, max share) |
| Worker day as priority list from stock gaps; per-item caps; hour windows; household need outranks shop work | WF13, WQ5 | GAP | E-ECON | NPC production loop driven by stock gap and cap; duties seam |
| Price catalog with place overrides, reputation-locked goods, donation mode 4x | WF4, WQ6 | DATA | E-ECON | Good rows: sell, buy, reserve, target, min standing; place override rows |
| Place stock doubles as construction supply (selling a village timber speeds it) | WF4, WQ6, WF1 | GAP | worldev | Shared stock between market and settlement growth |
| Travelling trader moves stock to friendly places that need it | WF14, WQ7, F2 | GAP | worldev | NPC trader that picks destination by demand and relation; war removes it |
| Standing = spending; culture echo of one tenth; two-layer reputation | WF3, WQ8, X21 | GAP | E-REP | Second reputation layer above region (people/culture) with echo ratio; gain from trade value |
| Nightly relation drift with sticky extremes; rate-limited player nudge scaled by log of standing | WF6, WQ9 | GAP | worldev | Place-to-place relation state with drift odds; diplomacy points |
| Trade volume teaches a people's language; thresholds gate speech and prices | WF15, WQ10 | DATA | E-RES | Study bar per language fed by trade acts; usability gates dialogue |
| Timed tag-gated quest chains offered by chance, deadline, failure standing cost | WF16, WQ11 | DATA | storylet deck | Storylet rows with chance per hour, min standing, step deadline; obligations_ledger penalty |
| Landmark as slow community project with named helpers | WF17, WQ12 | DATA | E-ECON | obligations_ledger shared long project; helper tag and reward |
| Raids and bandit raids | WF18 | OUT | none | Not implemented in the source; take numbers from MineColonies lane instead |
| Player funds a place's next building; wealth cannot skip supply | WF19, WQ13 | DATA | E-HOME | home_purchase/economy row: price, standing floor, buyable list |
| Faction = tag set + level cap + skill trees + tasks; leaving costs level | WF20, WQ14, WF28 | DATA | rule_modules | Faction record with tags; identity laws by world; leave cost row |
| Advancement by distinct physical acts per path; structure points around altar; passive early levels | WF8, WQ15 | DATA | E-PROC | Procedure per rank with Materials, Condition (structure size), Agent |
| Rank-ups as data tasks naming the opposing group (counted kills, captures, stats) | WF21, WQ16 | DATA | quests | Task rows with unlocker by rank |
| Skill trees as data segments; points per level; cost 1-3; typed effect (action, attribute, hook, unlock); costly respec | WF22, WQ17 | DATA | E-POW | Ability records with prerequisites; respec as costed event |
| Station opens by learned skill and burns a fuel | WF9, WQ18, X21, C6 | DATA | E-PROC | ritual_conditions Condition: required skill; station fuel Material |
| Faction meter replaces hunger; cap by level; burn depends on place; controls healing | WF7, WQ19, X21 | GAP | harm | Custom body meter replacing hunger with place-dependent burn; hunger rules are deferred (C4) |
| Environmental exposure counter with grace, rank-phased penalties, named counters (roof, water, umbrella) | WF23, WQ20 | GAP | harm | Exposure counter on a field value with grace timer and rank-phased penalties |
| Bane field built and fuelled by the opposing faction (garlic strength by area) | WF24, WQ21 | DATA | E-FIELD | Field over places with strength steps and fuelled source |
| Creature blood values; bite takes a fraction; sleeping safer; witnesses cost standing | WF25, WQ22 | DATA | E-TRAIT | Value-per-creature tag; bite as action; witness rule in reputation_view |
| Timed staged conversion with visible stages and cure window | WF26, WQ23 | GAP | harm | Staged timed condition (infection) with cure interrupt |
| Refinement: paired buff and penalty bundles by rarity, three slots | WF10, WQ24 | DATA | E-GEAR | gear_affixes rows with built-in trade-off; rarity table |
| Followers capped by rank x rate, level tracks, faction-bound upgrades, offline slowdown | WF27, WQ25, F3 | DATA | E-COMP | companion_roster cap row; stat tracks; offline mode multiplier |
| Faction rule differences table (hunger, sun, garlic, water, crafting, disguise) | WF28, WF7-WF9, X21 | DATA | rule_modules | Per-faction rule_modules rows |
| Item-flow ordering: made intermediate part gates next machine, no flag | EP1, SP1, Y2, N24, EP11 | DATA | E-MAKE | Recipe rows requiring a made part (sequenced assembly as procedure) |
| Quest book as repeatable shop: coins in, card out, card is catalyst in machine recipe | EP2, EP8, SP2, Y3 | DATA | E-MAKE | Card as catalyst Material; coin placement as recipe shape; denomination knowledge hooks |
| Hidden per-world code with Mastermind feedback on failed items; accelerators keep a right reagent | EP3, Y4 | GAP | E-TRAIT | Seeded secret combination with graded feedback; owner mixture_discovery / craft_experiment_log; keep seed sealed |
| Transmutation loses 25% or 50% by catalyst grade | EP3 | DATA | E-TRAIT | mixture_rules loss by catalyst trait |
| Seven stage families; stage by action (use item, output milestone, rescue, advancement) | EP1, EP5, EP6, Y1, SP1 | DATA | quests | native_unlock_transaction effect granted by an act; one milestone per stage |
| Single-parent stage tree; one key node runs the stage function | EP5 | DATA | quests | Stage node with effect list (swap mob tier, grant research) |
| Exists / observable / understood / usable / offered split per stage; ore hidden until stage | EP5 N19 | DATA | E-RES | Two bars plus world_knowledge; stage hides via knowledge not recipe removal |
| Feature-boolean mode table (Normal/Hard/Expert) written as per-player stage | EP6, EP7, N26, Y5 | DATA | content packs | World option rows; stage per feature |
| Tier wall as one gate quest with 2-3 prerequisites | EP9 | DATA | quests | Gate node row |
| Skip-token quests priced in raw intermediates | EP10, Y8 | DATA | E-ECON | Shortcut recipe or fee priced in intermediates |
| Quests as supply lines: completing pays next step's inputs | EP11, SP5 | DATA | quests | Reward rows paying inputs of next arc step |
| Dimension gating by ingredient entanglement (parts from other realms in recipes) | EP12, N25 | DATA | E-MAKE | Recipe rows needing a crossing-sourced Material |
| Mastery by cumulative output with decay forcing upkeep | EP13, N20, Y7 | DATA | E-RES | Practice milestone rows; decay as upkeep step in procedure |
| Era gate: one story flag drives spawns, loot, danger (danger by gate not distance) | EP18, EP19, Y10, SevTech mob stages | DATA | worldev | World event table keyed to a story milestone |
| Single highest-priority active scripted quest per player | EP18 | DATA | storylet deck | Deck priority tiers (recovery above events above default) |
| Elite patrols after grace, cooldown and roll; greater elites start dormant | EP19 | DATA | worldev | Event row: grace, cooldown, chance, dormant start |
| Recruit-on-defeat; infamy stat per kill | EP19 | DATA | E-COMP | Downed-claim option on conflict frame; infamy as E-REP audience value |
| Tiered extra loot pools injected into chests | EP19 | DATA | E-GATH | Pool rows by tier and place |
| Antimatter decompose/combine tables, conservation by author convention | N22 | DATA | E-TRAIT | mixture_rules paired entries |
| Hand-crush / no-quest recipe rewrite of an early game | N21 | DATA | E-MAKE | Hand-processing recipe rows |
| Tag unification (many ingredients, one tag) | EP recipe categories | DATA | E-TRAIT | tag_store tag rows |
| Recipe removal, JEI hiding, tooltip explanation of chains | EP recipe-script table | OUT | none | Pack editing hygiene; knowledge reveal is E-RES |
| Quest graph shape stats (chain depth, fan-in, optional share, reward counts) | EP15, SP3, SP4, SP6, SP7 | OUT | none | Authoring statistics, not a mechanism |
| Pack provenance (Cabricality vs CAB, missing JAR, sources not read) | EP4, EP16, G1-G7, N27, N44 | OUT | none | Audit provenance |
| One authored material row fans out into items, wires, tools, prices | X13, GT1, GT15 | GAP | E-TRAIT | Material row that derives a product family and prices |
| Tier gate with asymmetric failure (too high destroys, too low just slows); voltage x4 | X14, GT2, GT11, C2, C8 | GAP | E-PROC | Graded condition with failure policy per direction |
| Tier opens slot counts (elevator motor 6/12/15/18/24) | X14, GT17 | DATA | E-HOME | Improvement tier row: slots |
| Heat/coil tier row gates recipe eligibility | X14, GT3, GT15 | DATA | E-MAKE | craft_process_thermal tier row |
| Station failure policy field (pause, reset, destroy, degrade) shown in status | X15, C2, TB SP-B2/Q15 | GAP | E-MAKE | Per-station failure-policy field |
| Graded fault set: each fault -10%, stops just at six | X15, GT14, C3 | GAP | E-MAKE | Maintenance faults as stacked efficiency penalty |
| Fixed per-world limits printed with the short input and cost | X15, MR5 | DATA | E-PROC | Legibility field on procedure status (action_legibility exists) |
| Soul-network account, shortfall paid in HP | X16, RM1, RM3 | DATA | E-POW | Power cost type: health when pool short |
| Rituals as standing upkeep; low pool nauseates and skips a pulse | X16, RM6, RM7 | GAP | E-POW | Ongoing-upkeep ritual with graded failure |
| Typed per-chunk will drained by crystals | X16, RM9, RM10 | DATA | E-FIELD | Typed field value over a place |
| Up-front essences, destructive failure if setup changes mid-ritual | X16, RM21, RM22 | DATA | E-PROC | Procedure Condition checked each step with destroy-on-change |
| Enhancers lower the gate, not the spend | X16, RM26 | DATA | E-PROC | Condition substitute rows |
| Chore bought off with a rare resource | X16, GT20 | DATA | E-ECON | Duty with buy-off cost |
| Armor budget with negative-cost downgrades funding more | RM11 | DATA | E-GEAR | gear_dimensions budget with negative-cost rows |
| Purity tiers, -8% per miss | RM12 | DATA | E-PROC | Graded condition with step penalty |
| Once-per-life attunement; undo needs a consumable | RM15, C7 | DATA | E-POW | Commitment row declaring who can undo and cost |
| Regenerating personal pool | RM27 | DATA | E-POW | Pool with regen rate |
| One integer clock, sub-seasons, sleep moves time, moon phase, body temperature by season | X17, SV11-SV18, RM12 | DATA | E-GATH | world_calendar rows; body read of season (small harm hook) |
| Binary fertility per season, off-season chance 1 in 6 | X17, SV13 | DATA | E-GATH | gathering_model season yield row |
| Lagging temperature state, water provenance, thirst | X17, SV1-SV10 | GAP | harm | Needs/temperature state; deferred by hunger doc C4, may sit under BHR rules |
| Local residue ledger: smooth decay, spread floor, stacked harm thresholds (smog) | X20, GT13, C4 | GAP | E-FIELD | Per-place residue field with decay, spread floor, thresholds |
| Source strength falls off with distance (radiation) | X20, TB5/Q10 | DATA | E-FIELD | Field source falloff row |
| Depletion shapes (trickle floor, true end, bucket count, per-growth decay) | C4, GT6, GT19, TB15, TB31 | DATA | E-GATH | Depletion row: declared cause and clock (SR20) |
| Plan/reserve/run accounting; handcart depot, reserved cargo | X19, MF19, MF26 | DATA | E-ECON | Exists in modular production owners |
| Hub grows by physical modules | X22, GT17 | DATA | E-HOME | Improvement chain rows |
| Quest engines gate display and payout; skill gating for real means | C6 | DATA | quests | Use quest shape for world knowledge, skill Condition for means |
| Illustrative numbers are per-world adjectives | C5, C8 | DATA | E-ECON | No engine change; dial values only |

### Unmapped residue

- Sections skimmed: EP "Per-target coverage" and "Gaps" (provenance just, folded into one OUT row). EP quest graph and recipe-script count tables were treated as authoring statistics. SYNTHESIS RM, SV, GT and TB rows are classified just from its headline text; their lane files (other shards) hold the detail, so those rows may duplicate theirs.
- WF28 note: village capture by totem (`capture_village`) was unread in the source, so no row. Faction guards by tag likely maps to groups/duties.
- WF11 "no hot reload" and ET14 wall-clock harvest time: not mechanisms.
- QL12 BQ task and reward semantics are in a repo the audit did not read (C2); task sharing row is a seam just.
- GAP rows marked E-HOME for household arcs, E-ECON for NPC production and worldev for settlement growth assume no current owner; confirm against group and world-event seams.
- I did not open any src file; engine fit comes from the brief and the SYNTHESIS "game has" cells.

## Shard D: GL_GEAR_LOOT, WC_WORLDS_COLONIES, WV2_SURVIVAL_COUPLING, WV3_REACTORS_SPACE_TREES_DRAGONS
| Mechanism | Sources | Class | Engine | Row or missing part / reason |
|---|---|---|---|---|
| Gear budget: provides vs costs, build blocked past budget | GL1, GL19, GL20, GL46, GLF1 | GAP | E-GEAR | Conserved integrity scalar on parts (gain/cost per part); check gear_dimensions first |
| Typed slot counts for upgrades/abilities, slot-waiving upgrades, one addon per type | GL15, GL18, GL31, GL46, W3-14 | DATA | E-GEAR | Slot-count rows per gear type; waiver flag on an upgrade |
| Part-role composition: material stat block per role, default plus per-role trait list | GL9, GL10, GL15, GL16, GL17, GLF2 | DATA | E-GEAR / E-TRAIT | Per-role material rows in gear_dimensions plus trait rows in making_traits |
| Trait levels with max level and level-indexed effect table | GL11 | DATA | E-TRAIT | making_traits level table |
| Material category tags and grade tier | GL10 | DATA | E-TRAIT | tag_store rows |
| Stat blend order (weighted avg, max, pct, multiply, flat, clamp) | GL52 | DATA | E-TRAIT | Fold order in making_traits |
| Alloy synergy: similar families raise, mismatches lower, clamped | GL13, GL51 | DATA | E-TRAIT | mixture_rules synergy row |
| Compound ratio windows with visible bounds | WC2 | DATA | E-TRAIT | mixture_rules window rows per alloy |
| Wear-keyed traits: stats recalc at damage thresholds (growth by wear) | GL12, GL47, GL61, GLF3 | GAP | E-GEAR | Durability-state step trigger that recomputes item stats; gear_work |
| Use-countdown improvement meter (honing) and settling | GL21, GL47, GL62, GLF3 | GAP | E-GEAR | Per-item use-weighted meter that unlocks one improvement; gear_work |
| Magic capacity / gilding raises a cap, overflow costs | GL21 | DATA | E-GEAR | Capacity budget row on rune_grammar |
| Item-fed incremental modifier levels (fractional levels) | GL18, GL65 | DATA | E-MAKE | dose_process accumulating inputs to a level |
| Module-pair synergies unlock an action or variant | GL22 | DATA | E-GEAR | gear_affixes combo rows |
| Modifier effect hooks: reinforced, severing, haste | GL65 | DATA | E-GEAR | Affix/effect rows over a few hook types |
| Material grading with catalyst, rolled grade kept only if better (ratchet) | GL14, GL60 | DATA | E-MAKE | Grade row on craft_materials; catalyst process with keep-if-better rule in craft_resolver |
| Repair kits, broken-not-vanished state | GL14, GL61 | DATA | E-GEAR | gear_work repair and broken state rows |
| Salvage/refund of parts, rarity material, modifier removal, unwinding keeps the item by default | GL3, GL14, GL18, GL27, GL49, GL64, GLF5 | DATA | E-GEAR | gear_workshop_domain salvage rows; yield scaled by remaining durability |
| Rarity as a rule list per tier (stat count, effects, sockets, durability) | GL2, GL23, GLF4 | DATA | E-GEAR | gear_affixes rarity rule rows, per-world adjectives |
| Affix pool: category sets, exclusion sets, weight, range per rarity, uniform level roll | GL23, GL24, GL59 | DATA | E-GEAR | gear_affixes rows |
| Luck-slope weighted draw (weight + luck x quality) | GL24, GL55 | GAP | E-GEAR | A luck input into weighted draws; no luck stat known |
| World tier dial unlocked by wearing prior-rarity gear plus a boss kill | GL2, GL25 | DATA | world events | Tier flag with weight tables per tier; unlock condition row |
| Higher tier buffs enemies and rewards | GL25 | DATA | conflict frame | Scale rows per tier |
| Gems and sockets: class-keyed bonuses, purity ladder | GL26 | DATA | E-GEAR | rune_grammar socket and gem rows |
| Cost ladder: each step multiplies cost and mixes tiers; gem cutting; gem dust | GL27 | DATA | E-MAKE | craft recipes with tiered input multiples |
| Reforge: material sets rarity, three seeded previews at 1x/2x/3x, preview stable until taken | GL27, GL63 | DATA | E-GEAR | gear_workshop_domain reroll with saved seed |
| Augment: upgrade affix by quarter range, reroll one affix | GL27, GL64 | DATA | E-GEAR | Workshop actions with cost rows |
| Affixed item sources: elites, flat chance on ordinary mobs, item loot entries | GL28 | DATA | conflict frame | Loot rows on encounters |
| Constructed companion from material x body-part shares | GL8, GL29, GL30, GLF8, N42 | GAP | E-COMP | Companion built from parts and materials (part-share stat sheet) |
| Companion gear wears; equipment is real | GL32, GL58 | DATA | E-GEAR | gear_work wear applied to companion-held items |
| Dead companion becomes a repair item that keeps upgrades; retrieval | GL8, GL32, GL49 | GAP | E-COMP | Down-to-item state that preserves upgrades |
| Care by feeding the body material (metal golem heals with ingot) | GL32 | DATA | E-COMP | Care action row |
| Rarity weight tables per context (terranean vs aquatic) and chest pools | GL33, GL48 | DATA | storylet deck | Weighted pool rows |
| Locks and keys: category, rarity band, master keys, lists of keys that work | GL4, GL34, GLF6, N41 | DATA | E-PROC | ritual_conditions condition with substitutes (master key = broad substitute) |
| Lock pick odds, key breakage, wrong key | GL34 | DATA | E-PROC | Graded condition with probability and failure row |
| Priced access reset (wishing well strips locks, costs well plus blast) | GL4, GL35, GL66 | DATA | E-PROC | Effect part with cost; blast via field_layer |
| Wishing well: coin/gem rarity picks a table, one item uniformly | GL35, GL66 | DATA | E-ECON | Offering-to-table row |
| Guard mobs for chests (mimic, bound soul) | GL35 | DATA | conflict frame | Encounter rows |
| Per-player loot instancing, team scope, storage | GL5, GL36, GL56, GL57 | OUT | n/a | Multiplayer storage; keep an opened-by-actor flag by default (below) |
| Opened-by-actor flag, optional timed refresh of a container | GL37, GL56 | DATA | E-GATH | Per-spot refresh timer row |
| Loot break modes, statistics advancements, save mode | GL37 | OUT | n/a | Server/config options |
| Bounty offers from profession decree: pools with worth, rewards first, objectives sized to worth | GL6, GL38, GL53, GLF9, N15 | DATA | E-ECON | obligations_ledger offer generator with worth rows and issuer stock |
| Bounty rarity and discount from reputation | GL39, GL53 | DATA | E-REP | Reputation tier weights |
| Bounty timers, expiry, rush achievements | GL40, GL53 | DATA | E-ECON | Time rows on obligation |
| Wave trial: per-wave pay, completion pay, defined failure list, lives, queue lost on failure | GL7, GL42, GL43, GL44, GL54, GLF7, N17 | GAP | conflict frame | Staged trial with split settlement, idempotent payout, failure effects |
| Endless escalation every N waves with caps | GL45 | DATA | conflict frame | Escalation rows on the trial |
| Context-keyed tables (one definition, per-context values) | GL50 | DATA | E-TRAIT | Design pattern; per-context columns |
| Tier ladder reached by local ore, rock, climate; same profession differs by place | WC1, N13 | DATA | E-GATH | Place yield rows gate material tiers |
| Iron as multi-step process (bloom, work, pig, steel) | WC3 | DATA | E-PROC | making_procedure ordered steps with craft_process_thermal |
| Anvil work: ordered rules, workable heat band, overshoot ruins, quality tier carried | WC4 | DATA | E-PROC | Ordered steps, thermal band condition, quality grade output |
| Real-time hit-marker anvil game | WC4 | OUT | n/a | Action UI minigame |
| Perishable goods with spoil date, preservation modifiers, container bonuses | WC5 | GAP | E-ECON | Expiry clock on stock with preservation multipliers |
| Rolling-window nutrition across five food groups, effects on max health | WC5 | GAP | harm state | Nutrition window state; needs seam |
| Crop climate bands (temp, hydration) and favored nutrient | WC6 | DATA | E-GATH | Crop rows with band and nutrient |
| Knapping patterns per rock class | WC7 | DATA | E-MAKE | Recipes keyed on material tag |
| Short-month calendar, year clock tied to world time (sleep moves it), pauses offline option | WC61, SV11, SV12, SV-Q7 | DATA | E-GATH | World calendar rows; offline rule is a dial |
| Calendar read API: state, change event, sensor, almanac item | SV18, SV-Q8 | DATA | E-GATH | Season-change event and almanac note |
| Temperature = base band + season + daily noise - altitude | WC62 | DATA | E-FIELD | Heat field terms over places |
| Rain as world event filtered by local wetness; Koppen classes | WC63 | DATA | E-GATH | Region weather profile rows |
| Sub-season table: melt, temperature shift, rain gaps | SV15 | DATA | E-GATH | Season rows per region |
| Tropical wet/dry calendar from same clock | SV16 | DATA | E-GATH | Region profile reads clock with offset |
| Season fertility per crop (grow slow, none, or die out of season) | SV13, SV27, SV-Q6 | DATA | E-GATH | Crop-season list rows and out-of-season mode dial |
| Greenhouse, cellar, biome exemptions to season | SV14 | DATA | E-HOME | Home improvement that lifts season gate |
| Season as a term in felt climate | SV17 | DATA | E-FIELD | Season term row |
| Parent-pair breeding recipe graph | WC8 | DATA | E-LINE | Pair-to-offspring rows |
| Trait inheritance: roll between parents, ratchet, calm-only temper | WC9, WC64 | DATA | E-LINE | lineage_traits inheritance rule |
| Traits learned by exposure (weather, night) | WC9, WC65 | DATA | E-LINE | Exposure counter to trait rows |
| Extractable gene items with purity, combine, apply with odds | WC9, WC65 | GAP | E-LINE | Transferable trait item with purity |
| Wild nests by biome, conversion by feeding, flower requirements, hive capacity | WC10 | DATA | E-GATH | Spawn/conversion rows |
| Produce table per creature scaled by productivity rank | WC11 | DATA | E-GATH | Output rows with rank multiplier |
| Typed-need request chain ending at player (building, warehouse, crafter, retry, player) | WC12, WC54 | GAP | E-ECON | Resolver chain for a need with level gate; owner obligations_ledger |
| Tool/equipment level gated by workplace level | WC13 | DATA | E-PROC | Condition with level grade |
| Skills capped by home level; job primary/secondary skills | WC14 | DATA | E-COMP | Skill cap rows keyed to home tier |
| Population limited by beds; children grow at home | WC19 | DATA | E-HOME | Home capacity rows |
| Happiness as weighted named factors with decay to complain and demand | WC15 | GAP | E-COMP | Weighted factor satisfaction with timed decay ladder |
| Adaptive raid pacing by losses, culture by biome | WC16 | GAP | world events | Threat pacing that adapts to losses |
| Item-paid research tree gated by building level, exclusive children | WC17, WC24 | DATA | E-RES | inquiry nodes with item cost and building condition |
| Research group costs rise with unlock count | WC24 | DATA | E-RES | Cost scaling row |
| Quest schema: triggers, branching dialogue, parents, random rarity | WC18, WC27, WC36, WC44 | DATA | storylet deck | Storylet rows with triggers |
| Upgrade needs staged build steps and materials from schematic | WC53, WC56 | DATA | E-HOME | home_purchase improvement as making_procedure steps |
| Colony builder queue, claim/priority, distance, build speed, bucket delivery | WC51, WC52, WC55 | OUT | n/a | Colony worker management, not one-person life |
| Guard huts, patrol/hold/follow, threat table, sleeping guards | WC57, WC58, WC59, WC60 | OUT | n/a | Colony defense AI |
| Timed run into generated vault, portal exit, objective by level | WC20 | OUT | n/a | Roguelite run frame; idle/offline conflict |
| Risk budget: modifiers add instability, curse chance | WC21 | DATA | E-MAKE | craft_failure_ledger risk accumulation |
| Persistence between runs, prestige tree, saved builds, god reputation | WC22 | OUT | n/a | Prestige palette owned elsewhere |
| Downed bleed-out timer, revive, death item loss | WC23 | DATA | harm state | Down state with timer; revive by companion |
| Depth-banded themes and per-difficulty loot weights | WC25 | DATA | E-GATH | Site tables by depth |
| Restoration campaign: per-zone corruption flag, spread, lagging symptoms | WC26, WC40, WC41, WC46 | GAP | E-FIELD | Zone corruption state with spread rate and cleanup that follows flag |
| Cleansing scale ladder (wand, potion, bloom, totem, machine) | WC42 | DATA | E-POW | Same verb at several scales and costs |
| Power as discount not requirement; aspect costs halved by extra energy | WC38, WC39 | DATA | E-MAKE | Cost modifier rows on a process |
| Progress against baseline per zone, badges | WC43 | DATA | E-RES | research_view style bar with baseline |
| Reputation as spendable supply budget, tier unlocks, lose line | WC45 | DATA | E-REP | Standing spent on requests; tier rows |
| Foreign gear locally weakened (speed, fire, food rot) with whitelist | WC29, N39 | DATA | E-TRAIT | rule_modules world law rows over imported items |
| Exertion-charged need meters with buffer, thresholds, decay, repetition fatigue | WC30, WC31, SV4, SV7, SV-Q3 | GAP | harm state | Need meters charged by effort with capability thresholds |
| Pocket spaces: private, public, dungeon; lazy remembered links; limbo failure | WC32, N40 | DATA | positions | Place rows with link memory |
| Pocket decay spreading | WC33 | DATA | E-FIELD | Spread rule over a field |
| Talent tree with exclusive branches and per-artifact trees | WC34, WC35 | DATA | E-POW | power_grammar exclusive node rows |
| Artifact trees fed by remnants; one bond; respec scroll | WC47, WC48 | DATA | E-GEAR | Bond flag and XP item rows |
| Appearance separate from stats | WC37 | OUT | n/a | Cosmetic transmog |
| Level bands unlocked by story gates; incoming damage scales with level | WC49 | DATA | E-RES | Gate rows; XP-deletion variant conflicts with idle, bank instead |
| Era-split shops and flag-gated trades | WC36 | DATA | E-ECON | Trade rows with flag condition |
| Reward chest pre-rolled at open, id marked spent | WC50 | DATA | E-ECON | Reward record with spent id |
| Pack scripts gating research and recipes | WC28 | OUT | n/a | Modpack configuration |
| Felt climate: five-step body state lagging environment, source-capped delays | SV1, SV2, SV9, SV-Q1, SV-Q2 | GAP | E-FIELD | Body comfort state that lags place climate; owner field_layer plus harm state |
| Heat damage clock vs cold borrowing existing freeze | SV3 | DATA | harm state | Condition rows per extreme |
| Drink record: thirst, buffer, sickness chance by source | SV5, SV-Q4 | DATA | E-TRAIT | Trait values on drink item |
| Water provenance by source; filter consumable; rain collector | SV6 | DATA | E-LINE | Source quality lineage plus purify process in E-MAKE |
| Climate zone from fueled device, roofed flood fill, capped cells, upkeep by volume, breach | SV8, SV-Q5, W3-28, W3-30 | DATA | E-FIELD | field_layer region with fuel upkeep and cell cap |
| Comfort via gear capped (no immunity), shifts target by steps | SV9 | DATA | E-GEAR | Trait rows on clothing |
| New-player climate grace | SV10 | DATA | E-FIELD | Timed grace condition |
| Cooking pot: tag-bag ingredients, container, heat from below, fixed dish, heat loss decays progress | SV19, SV-Q10 | DATA | E-MAKE | defineCastMaking with tag ingredients and heat condition |
| Meal effect that pauses need drain; duration by ingredient count | SV20, SV21, SV-Q9 | DATA | E-POW | Timed effect row; depends on need meters |
| Tool-gated processing with chance results | SV22 | DATA | E-MAKE | Recipe with tool condition and chance outputs |
| Compost stages with activators to enriched soil | SV23, SV-Q11 | DATA | E-MAKE | craft_process staged, inputs and light/water |
| Renewable harvest crop (partial or full take) | SV24 | DATA | E-GATH | Crop with partial-harvest rows |
| Fast single-item cooking route | SV25 | DATA | E-MAKE | Second recipe route with time rule |
| Shared feast servings; animal full-care feed | SV26, SV-Q12 | DATA | E-HOME | Household event with person_ties credit; companion care row |
| Plot fertility 0 to 15 spent by growth, refilled by fertilizer; favored nutrient | WC6, W3-32, SV23 | GAP | E-GATH | Per-plot fertility state in gathering_model |
| Heat-driven output that brakes rather than destroys, by default | W3-01, W3-09, D1 | DATA | E-FIELD | Output curve on heat; coolant as divisor |
| Geometry superlinear output from few shape numbers | W3-02 | DATA | E-MAKE | Formula over shape rows |
| Seasoning stat: grows with output, decays when running, near-frozen idle, divides input cost | W3-03, D2 | GAP | E-MAKE | Persistent burn-in counter on a process |
| Staged conversion with resonance sweet spot | W3-04 | DATA | E-MAKE | craft_process stages with curve row |
| By-product of tier N is input of tier N+1 | W3-05, W3-31, W3-13 | DATA | E-PROC | By-product output plus gate condition |
| Material property table (four numbers per material) | W3-06 | DATA | E-TRAIT | making_traits rows |
| Time-sliced sampling simulation | W3-07, C1 | OUT | n/a | Runtime fidelity trick, owned by architecture rules |
| Tier multiplier rows for active vs passive families | W3-08 | DATA | E-TRAIT | One curve rows per family |
| Expensive-to-restart craft: input change resets progress | W3-10 | DATA | E-PROC | Reset rule on a step |
| Wireless shared storage bought with consumed batteries | W3-11 | OUT | n/a | Energy network |
| Site-placed passive power from block below | W3-12 | DATA | E-FIELD | Source heat reads place field |
| Tier opens a new resource loop (frames, augments) | W3-13, W3-22 | DATA | E-PROC | Gate by earned loop |
| Chore footprint grows with range tier, swept one tile per cycle | W3-15, D12 | GAP | E-HOME | Household chore with reach and sweep time |
| Free base rate plus paid multiplier with streak bonus | W3-16 | DATA | E-GATH | Gather row with streak counter |
| Output grows with variety of inputs | W3-17 | DATA | E-MAKE | Formula on distinct-input count |
| Mob duplication costing essence from health | W3-18, C4 | OUT | n/a | Creature-farming loop; flip for named creatures |
| Weighted resource draw steered by lens items; multiplication ladder | W3-19 | DATA | E-GATH | Weighted rows with catalyst bonus |
| Black hole storage units | W3-20 | OUT | n/a | Unread, storage tech |
| Workbench tier by recipe size; each bench built from previous | W3-21, W3-22, W3-08 | DATA | E-MAKE | craft_recipes tier condition; bench as home improvement |
| Delegated crafting priced by time and draw | W3-23 | DATA | E-MAKE | craft_batch_goal with cost row |
| Typed bulk commodity compressed from stockpile with catalyst | W3-24, D11 | GAP | E-ECON | Stack-compression item type in economy_domain |
| Collection-completion capstone | W3-25 | DATA | E-PROC | Condition needing one of each |
| Ambient helpers shorten ritual, linear with floor | W3-26 | DATA | E-PROC | ritual_conditions graded condition |
| Vessel tier at or above destination plus flat cost | W3-27, D3 | DATA | E-PROC | Condition and cost rows |
| Hazard gear axes (air, cold, heat) over full set | W3-29 | DATA | E-GEAR | Trait rows per axis |
| Resource ladder keyed to hazard ladder | W3-31 | DATA | E-GATH | Place yield rows |
| Species parameter bundle yields shape and timber | W3-33 | DATA | E-GATH | Species rows; yield formula |
| Climate fit matrix as penalty not ban | W3-34 | DATA | E-GATH | Fit table rows |
| Counted accelerants spend plot fertility | W3-35 | DATA | E-MAKE | dose_process pulses |
| Die-back by missing support | W3-36 | DATA | E-GATH | Neglect state rows |
| Seeds self-plant, felling drops tree | W3-37 | DATA | E-GATH | Spread and harvest rows |
| Five growth stages, stats lerp, time-skip item | W3-38 | DATA | E-COMP | companion_stage rows |
| Stage-gated verbs with named dead zone | W3-41, D7 | DATA | E-COMP | Stage-to-verb rows |
| Incubation from cumulative exposure to element | W3-39 | DATA | E-PROC | Resumable condition with field element |
| Inheritance rule chosen per species | W3-40, D8 | DATA | E-LINE | Rule flag per species |
| Corpse as stepped harvest scaled by age | W3-42 | DATA | E-GATH | Stepped node rows |
| Top making needs owned same-element creature as agent | W3-43, D9 | DATA | E-PROC | Agent part is a companion |
| Bestiary filled by manuscripts, offered chapters | W3-44 | DATA | E-RES | inquiry source items with offers |
| Faction stance one number, three thresholds, asymmetric moves | W3-45 | DATA | E-REP | Standing thresholds |
| Colony lifecycle: queen, egg, caste mix, population cap | W3-45 | DATA | E-COMP | Lifecycle rows |
| Taming by creature-specific action | W3-other | DATA | E-COMP | Per-species taming rows |
### Unmapped residue
- X1 couplings (WV2) and C1/C2/C5/C6 considerations (WV3) are cross-notes; not rows.
- Several rows pick the engine by judgment. I did not open src/ files, so DATA claims for gear_dimensions, gear_work and companion_stage rest on the brief's one-line descriptions. Check these before building: integrity budget, honing meter, wear-step recalc.
- Gem socketing code, Tinkers 222 modifiers, key breakage code, black hole units: the audits did not read them.
- Anvil quality tier and compost activators assume craft_process can hold ordered or staged steps.


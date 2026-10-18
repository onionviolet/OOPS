# Five connected rule paths and their limits

These are static traces against retained build `24557528`. “Shown” means readable source/data expresses the rule. “Inferred” means the fields join through matching identifiers or suggest a consequence. “Unresolved” means the native consumer or gameplay result was not inspected. Original full source and numeric tokens remain in the private archive linked by [REPORT.md](REPORT.md).

Source locators below are relative to `/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/readable/`. [SOURCE_INDEX.json](SOURCE_INDEX.json) resolves every file to an absolute retained path and SHA256. Line ranges refer to decoded original files; CRLF is preserved in the retained bytes.

## DF-C18: Anatomy, tissue, attack surface and clinical cleanup

**Shown:** `data/vanilla/vanilla_creatures/objects/creature_standard.txt:5–90` defines the dwarf with the same body/material vocabulary used for other creatures. `BODY` composes humanoid segments, organs, joints, nerves and fingers/toes. `STANDARD_MATERIALS`, `STANDARD_TISSUES` and `VERTEBRATE_TISSUE_LAYERS` provide separate material, tissue and placement stages. The creature then adds eyebrow/eyelash and nail layers, selects heart and throat tissue for major arteries, adds tendon and ligament material with rate 200, and declares blood, nerves, wound infection and infection-from-rot capabilities.

The full body plan is not a single hit-point list. `vanilla_bodies/objects/body_default.txt:26–52` connects upper arms to lower arms to hands with `GRASP`, and upper legs to lower legs to feet with `STANCE`. Body part categories can be reused by attacks and layer selection. The arms-as-stance plan at 74–86 explicitly gives hands both `GRASP` and `STANCE`. Category, geometry and functional role are separable fields. Not every creature with a hand-shaped name necessarily uses the same role flags.

`vanilla_bodies/objects/b_detail_plan_default.txt:5–71` maps local material/tissue names to reusable templates. At 206–274 the vertebrate layer plan substitutes its five arguments into regional layers. Limbs use bone/muscle/fat/skin weights 25/25/5/1; the body uses muscle/fat/skin 50/5/1. Spine uses nerve and bone, brain uses brain tissue, and throat uses skin. These are declaration weights, not measured armor thickness, damage percentages or millimeters.

`vanilla_bodies/objects/tissue_template_default.txt:5–69,218–286` separates the following inputs:

| Tissue | Selected declared rules | Cleanup meaning actually established |
| --- | --- | --- |
| Skin | Scars; healing rate 100; vascular 1; pain receptors 5 | Has a healing rate and scar flag; exact wounds and permanent scar mechanics are native |
| Fat | Thickens on energy storage; insulation 100; healing 100; vascular 3 | Storage changes and thermal behavior are separate declared inputs |
| Muscle | Thickens on strength; arteries; muscular; relative thickness 3; healing 100; vascular 5 | Strength-linked anatomy and vascularity can coexist |
| Bone | Structural; connective anchor; healing 1000; vascular 3; pain 50; settable and splintable | Supports distinct clinical capabilities; does not prove a successful hospital job |
| Nerve/brain | Functional; scars; no explicit healing-rate token in these selected records | Absence of a token is not proof of “never heals”; default/native behavior remains unresolved |
| Lung/heart | Functional and structural; healing 100; vascular 8/10 | A tissue can have both a mechanical and functional role |

The file explicitly comments that lower healing-rate values are faster. This establishes author intent for ordering, not a formula or exact number of ticks to heal.

**Attack combination:** `creature_standard.txt:217–242` selects grasp for punch, stance for kick, and finger nail layers for scratch. Punch has contact 100 and prepare/recover 3/3; kick has 100 and 4/4 plus bad-multiattack flag. Hand loss, tissue damage, role flags and attack choices therefore share selectors. The exact native process for disabling attacks after injury remains unresolved.

**NPC applicability:** `vanilla_entities/objects/entity_default.txt:5–35` binds `MOUNTAIN` to `DWARF`; 227–230 permits diagnostician, bone setter, suturer and surgeon professions. This connects a population's physical model and available clinical occupations. The declarations do not reveal diagnostic priority, patient selection, pathfinding, resource reservations, skill success or whether a worker actually treats anyone.

**Cleanup limits:** Regrowing a part, repairing nerves, healing tissue, ending bleeding, curing infection and reducing pain are distinct operations. The healing generator explicitly lists them separately, as DF-C21 records. No claim that one scalar heal restores all these states, removes scars, replaces equipment or clears reservations is supported here. Native wound topology, blood loss thresholds, severed-part lifetime, death order and treatment cancellation remain unread.

**Inference for emergence:** Damage to a particular body structure can constrain more than combat because grasp/stance, tissue state and occupations use the same actor model. A concrete native story such as an injured worker failing a production job still needs the missing scheduler and anatomy consumers.

## DF-C19: Crop, container, brewing and physiology feedback

**Shown:** `vanilla_plants/objects/plant_crops.txt:5–50` gives single-grain wheat distinct structural, drink, flour, leaf and seed materials. Structural material maps `DRINK_MAT` and `SEED_MAT` to local material IDs. Drink inherits `PLANT_ALCOHOL_TEMPLATE`; flour has material value 20 and the seed value 1 while the plant value is 2. The plant has tropical grassland/savanna biomes, dry condition and four seasons. This record supplies no explicit grow-duration token in the reviewed span. Do not infer crop time from the season list.

`vanilla_reactions/objects/reaction_other.txt:265–297` consumes an unrotten plant or plant growth with `DRINK_MAT`. It also requires an empty food storage container, marked preserved and excluded from product-amount determination. Output declares five drink units with dimension 150 and routes drink into that specific reagent container. It separately emits a seed output using `SEED_MAT`. `BREWING` is the reaction skill. The fruit version repeats the same structure for `PLANT_GROWTH`.

**Limits and combinations:** Available raw plant does not by itself admit brewing. Rot state, material mapping, facility and usable empty carrier are separate predicates. Preserving a carrier does not leave it empty after successful filling. The seed output provides a declared return path toward planting, but planting, growth, yield, seed allocation and whether another job consumes the seed are native consumers not read here. No infinite-resource or exact farming equilibrium claim follows.

`vanilla_materials/objects/material_template_default.txt:2441–2497` gives plant alcohol physical properties as well as a syndrome. It declares ignition 10800, melting 9850 and boiling 10150 in the game's raw temperature scale, heat/cold damage points `NONE`, density 789 and separate mechanical fields. No conversion to real-world units or proof of heat simulation is supplied.

The syndrome has identifier `INEBRIATION`, affected class `GENERAL_POISON`, ingestion and injection routes, no-hospital flag and concentration added 100 with maximum 1000. Its complete reviewed effect rows are:

| Effect | Severity or changes | START / PEAK / END | Other declared fields |
| --- | --- | --- | --- |
| Nausea | 35 | 120 / 480 / 1200 | PROB100, SIZE_DILUTES, DWF_STRETCH4 |
| Dizziness | 50 | 20 / 240 / 600 | Same flags |
| Unconsciousness | 25 | 120 / 480 / 1200 | Same flags |
| Personality | Bashful−50, privacy−50, bravery+25, confidence+25, politeness−25, thoughtlessness+25 | 10 / 120 / 480 | Same flags |
| Euphoria | 75 | 10 / 120 / 480 | Same flags |
| Erratic behavior | 50 | 10 / 120 / 480 | Same flags |

These timings remain raw values, not seconds. `PROB:100` describes a field, not a universal claim that every dose produces maximum severity. Dilution, exposure, size, resistance, concentration and native scheduling are separate unresolved consumers.

**Actor combination:** `creature_standard.txt:289–301` gives dwarves alcohol dependence, `SYNDROME_DILUTION_FACTOR:INEBRIATION:150`, and personality ranges including immoderation and stress vulnerability. `GENERAL_POISON` membership appears at 77. This establishes identity joins between a consumable's syndrome and a species-specific response. It does not prove dependence satisfaction or exact dose response.

**NPC applicability:** Entity jobs at 207–216 permit cook, miller, planter, herbalist, brewer and soap maker. Production can emit consumables and seeds that other permitted jobs could use. Actual autonomous consumption preferences, starvation/thirst thresholds, memory, stress, need priorities and work interruption remain native-unread.

**Cleanup limits:** Syndrome rows declare finite `END` fields and concentration bounds. They do not show native removal, restoration of personality contributions, source overlap, refresh/reexposure, suspended actors, offscreen time or save/reload transitions. A no-hospital flag is not immunity to all care. The item container remains a real carrier whose empty/filled state matters independently of the drinker's syndrome.

## DF-C20: Metallurgy, mechanical fields and cancellation boundaries

**Shown:** `vanilla_reactions/objects/reaction_smelter.txt:139–158` declares pig iron from one iron-bar amount 150, one flux boulder and coal-bar amount 150, plus a separate `FUEL` flag. Steel uses iron 150, pig iron 150, a flux boulder and coal 150 to produce two bars of dimension 150, again with `FUEL`. Both require a smelter and `SMELT`. Entity permissions at `entity_default.txt:274–290` admit the named steel/pig-iron reactions for `MOUNTAIN`.

The coal reagent and general fuel flag are distinct declarations. Exact fuel consumption, magma handling, partial stacks, reagent matching, hauling, reservation timing and work-order scheduling are not shown by these rows.

`vanilla_materials/objects/inorganic_metal.txt:8–48,326–405` gives iron, steel and pig iron separate strength/temperature/crafting fields. Iron and steel both have solid density 7850 and maximum edge 10000, while steel's declared impact yield/fracture are 1505000/2520000 versus iron's 542500/1085000. Steel shear yield/fracture are 430000/720000 versus iron's 155000/310000. Steel's material value is 30 versus iron's 10. Pig iron has lower declared strength values and its selected record does not carry iron/steel's explicit weapon/armor item flags. Template inheritance still has to be resolved before making a universal crafting prohibition claim.

`vanilla_items/objects/item_weapon.txt:16–59` specifies battle axe size 800, two-handed threshold 47500, minimum size 42500 and material size 4. Its edge attack has contact 40000, penetration 6000 and velocity multiplier 1250. The hammer uses size 400, thresholds 37500/32500 and blunt contact 10, penetration field 200, velocity multiplier 2000. Short-sword attacks separately declare slash, stab, flat and pommel modes. The source comment says penetration size currently matters only for edged attacks.

**Inference for emergence:** Same geometry with another material can change several inputs at once; a different attack mode uses a different contact/penetration/velocity tuple. “Higher material value means more damage” does not follow. Exact native collision math, quality multipliers, attacker size/skill/strength and defensive layers remain unread.

**Cleanup limits:** Recipe rows distinguish preserved tools/carriers from consumed material in other reactions, but show no atomic transaction. `reaction_other.txt:26–81` preserves lye/oil containers, excludes them from amount scaling, routes plaster into a preserved empty bag, and preserves a hammerstone while converting another rock. Interruption, refund, reservation release, container destruction and failed product insertion require native consumers. No cancellation safety claim is made from `PRESERVE_REAGENT` alone.

## DF-C21: Temporary transformations, healing, undead roles and overlap

**Shown:** `vanilla_procedural/scripts/generators/interactions/curse.lua:20–50` constructs a temporary body-transformation syndrome with START0/PEAK0/END8400/ABRUPT. It admits natural animals, excludes small races, large predators, non-air-breathers, land-immobile, learning and several supernatural categories, and requires a fast effortless gait field. It separately adds no-aging/no-eat/no-drink tags for the same declared interval. Comments call the duration one week. Those comments are not a global engine tick conversion.

At 53–96, the vampire generator requires a learning creature with blood, excludes not-living and supernatural targets and six syndrome classes. It emits a `VAMPCURSE` class; bloodsucker, physiological exemptions and no physical attribute gain/rust; strength/agility/toughness modifiers; material-force and reserved-blood interaction fields; presentation changes; a tooth appearance modifier conditional on a drinking-blood counter; and sensing of `GENERAL_POISON`. Most rows have START0/ABRUPT and no explicit END. This differs from the finite beast transformation. No native lifetime, stacking or cure guarantee is inferred from absent END.

`interactions/blessing.lua:101–130` defines a healing syndrome as twelve separate CE rows: stop bleeding, close wounds, heal tissues, heal nerves, reduce pain, reduce swelling, cure infection, reduce paralysis, reduce dizziness, reduce nausea, reduce fever and regrow parts. Each declares severity100/probability100/start0/peak0/end12/abrupt. Separate flags show intended granularity. They do not prove that every wound state, scar, severed appendage, equipment slot and underlying source is repaired in the native engine.

`interactions/disturbance.lua:50–129` constructs a corpse resurrection path requiring resurrection fitness, learning and speech, while rejecting several curse/undead syndrome classes. It emits `DISTURBED_DEAD` and `DISTURBANCE_CURSE`, changes attributes/personality and removes blood/trance/mischief tags while adding a wider set of physiological exemptions. It grants interaction definitions referencing the same generated prefix/index: curse at range25, maximum one target and wait20; corpse animation at range25/wait10; another raising interaction at range10/wait10. Curse targeting adds `DISTURBER_ONLY`. These are target and ability declarations, not an autonomous decision trace.

**Combinations and limits:** Exclusion classes explicitly constrain coexistence; physiological exemptions, body changes and actor identity are not one universal “undead” boolean. Different templates remove or retain different properties. Generated IDs connect grants to generated interactions. A generated row requires successful generator loading, selection, registration and native admission before it can affect an actor.

**Cleanup unresolved:** No retained Lua here implements restoration of old anatomy, ownership of overlapping stat/tag contributions, removal of generated abilities on cure, equipment remapping after transformation, cleanup on death, duplicate-resurrection protection under races, relation restoration, reanimation limits or save migration. Native syndrome and actor lifecycle code owns these. “Finite END” is not proof that every side effect rolls back. The independent audit separately checks generator reachability and dormant paths.

## DF-C22: Stable candidate evaluation, world provenance and repeat calls

**Shown:** `data/init/globals.lua:1–66` implements sorted key iteration and empty-safe random selection. Conditional selection builds a candidate array in sorted key order, then picks from it. `generate_from_list` at 258–283 evaluates every generator in sorted order, keeps nonnil results, adds their weights, then rolls and subtracts weights across the results. A result without a weight is logged and counted with default1, but later subtraction still reads `v.weight`; that logging branch is not complete protection against malformed generators. An empty result set reaches the random-call path before the final nil fallback, so native `trandom(0)` behavior also matters.

Generating all candidates consumes their RNG and can have side effects before one is selected. Sorted order stabilizes an ordering input; it does not prove every generator is side-effect-free or the overall simulation is deterministic. `pick_weighted_from_table` at 172–195 has a separate caller-sorted assumption and also directly subtracts weights.

`data/init/generators.lua:248–301` appends `GENERATED` and, when nonnegative, source historical-figure/entity IDs. `generate()` calls preprocess each time, conditional early/main hooks, materials, items, languages under main-world gating, creatures, interactions, entities and postprocess. The source warns that repeated generate calls are not predictable to mods. `380–407` further gates mythical material and healing-substance registration on native parameter flags, then registers inorganic output.

**NPC/world use:** Source figure/entity IDs can preserve provenance through generated definitions. Actual history simulation, actor spawning, assignment, encounter frequency and generated-power selection are native or unread paths. No played world generation was run.

**Cleanup limits:** Repeated preprocessing and registration are explicit lifecycle seams. The selected source does not establish idempotence, rejection/replacement semantics, collision handling, removal of orphan generated references, failure rollback or persistence of RNG state. Retaining only the winning raw object would lose the evaluated-candidate order and some possible random consumption; the archive therefore keeps full generator sources.

## What remains unread

The exact file/range ledger is [SOURCE_INDEX.json](SOURCE_INDEX.json), not this short priority list. The following named consumers are still the highest-value gaps:

| Gap | Why it changes the interpretation | State |
| --- | --- | --- |
| Native syndrome apply/remove/expiry | Determines stacking, restoration and cleanup, especially multiple sources | Unrecovered |
| Native job scheduler and needs | Determines actual NPC choices, interruption and work/resource feedback | Unrecovered |
| Native combat/anatomy consumer | Converts geometry, material fields and injury into real damage/function | Unrecovered |
| Native recipe transaction | Determines reservations, consumed inputs and cancellation cleanup | Unrecovered |
| Native actor transformation/resurrection | Determines identity, equipment, references and death cleanup | Unrecovered |
| Native offscreen clock/save transactions | Determines whether local durations carry across unloaded contexts and reloads | Unrecovered |
| Other object records and Lua windows | Broad ecology, institutions, history, generated body variants and content remain | Retained, exact unread ranges indexed |

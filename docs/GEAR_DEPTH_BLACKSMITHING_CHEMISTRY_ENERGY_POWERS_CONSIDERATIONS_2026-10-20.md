# Gear depth: blacksmithing, chemistry, energy and powers

Considerations round, 2026-10-20. Palette, not a spec; every item is a proposal
unless it cites an accepted line. Triggered by Weibao's instruction (2026-10-20),
after the equipment stat slice, to incorporate Silent Gear and similar mods,
blacksmithing, deeper details, chemistry, energy and superpowers. Extends
[equipment stat dimensions](EQUIPMENT_STAT_DIMENSIONS_CONSIDERATIONS_2026-10-20.md)
(ESD1-ESD15 and its L2 slice record). Codes: GDP (prefix unused in the repo,
checked 2026-10-20 with `git grep`).

Applies: AD5 (both, depending on the world), AD38 (mechanisms, not allowed-outcome
lists), AD6-AD8 and UR40 (shown numbers and sources), MR1-MR36 (especially MR5,
MR8, MR16, MR17, MR21, MR22, MR29, MR32), AR1-AR16, GR1-GR17, CBR, and the
2026-10-17 deferred old-save decision. Reference only: Minecraft mod data gives
structure and vocabulary; all names, numbers and records here are native and
nothing is copied (ESD15). Mod-level evidence with paths and lines is private, in
`docs/research/minecraft/private/gear-depth-2026-10-20/NOTES.md` (gitignored).

## What was read, and what was not

| Source | Read | Not read |
|---|---|---|
| Silent Gear 4.2.3 (decompiled Java and data under `docs/research/minecraft/private/decomp/silent-gear/`) | Stat recompute order, part types and part records, a material record with per-part properties, trait stacking and conditions, trait effect data samples, grader station, repair kit, anvil repair and upgrade handling | Number-property compute internals beyond the earlier lane's formula notes, most trait effect classes, curio and JEI compat |
| Tetra 6.17.0 | Module and material records, integrity fields, honing flags and counters, settled and workable improvement data | Workbench UI, schematic execution, synergy data |
| Tinkers' Construct 3.11.2 | Part stat application, slot kinds, melting, alloy and fuel records (temperature, rate, duration) | Modifier recipe execution, smeltery multiblock, casting time |
| Alchemistry (extracted source and data) | Dissolver, combiner and fusion recipe shapes, recipe counts | Machine code, energy costs; ElementalCraft not opened |
| Fork code | `src/crafting_component_filling.js`, `src/items.js` (component stats and identity), `src/gear_dimensions.js`, `src/absorb_e2/durability.js`, `src/energy_resources.js`, `src/power_models.js`, `src/craft_resolver.js` (law shapes), `src/backlog_expansion_body.js` (fuel row), `src/active_effects.js` (head) | The structured ability runtime's effect list in full; whether ability effects can write gear stat keys (unverified) |
| Fork docs | ESD doc and L2 record, MKR palette, MR rules, CRAFTING_ENGINE Rounds 3, 6, 7 (PR, IX), WDI Round 5 (meters), RESEARCH_ALTERNATIVE_POWER taxonomy, TECHNOLOGY_AND_PROGRESSION TG5/LB3, Discord notes P12-P16 (private) | The other MODULAR_PRODUCTION and PROCEDURAL_CRAFTING rows were read as headings and greps only |

Earlier lane GL already catalogued the Silent Gear material table, tool part lists
and the synergy formula (private `audits/gl/`); this round adds the resolution
order, grading, repair, trait stacking and heat data it did not cover.

## Part A. Silent Gear and blacksmithing depth

### What the mods do (paraphrase)

- **Recompute is three passes.** Base stats come from the parts, then traits add
  bonus modifiers (they see how worn the item is), then a final pass writes the
  result. Everything is recomputed whenever the parts, wear or wielder change.
- **A part is a typed role, a material fills it.** Core parts (blade, plates)
  carry their own base numbers; add-on parts (tip, binding, coating, grip,
  lining, setting) are removable and carry none, so the material supplies
  everything. A material record has different property sets per role: absolute
  values for the main part, multipliers and extra traits for a shaft.
- **Traits have levels, conditions, scope and a cost.** A trait names its level
  per material, optional conditions (fraction of parts that carry it, gear type,
  and, or, not), a maximum level and its effect family (durability chance, slot
  attribute, property modifier scaled by wear, timed stage, self repair). Many
  traits pair a gain with a loss (a light armor trait speeds the wearer; a heavy
  one slows; a hard tool trait trades ranged damage).
- **Trait levels dilute.** When several materials contribute one trait, levels
  are summed and divided by a number that grows with how many parts lack it, so
  one strong material in a mixed item is watered down and a trait shared by all
  keeps its strength.
- **Grade is a lot-level quality ladder,** separate from rarity, bumped by a
  station that spends a catalyst, only upgrades, and works on the weakest
  material inside a part.
- **Repair spends material units.** A kit stores units by material; repair
  restored equals material repair value times item efficiency times kit
  efficiency, spends only what is needed, and the anvil path is slightly better.
- **Upgrades are removable parts with a cap** applied at a station, and Tetra
  adds an integrity budget (parts cost or give capacity) and honing: use counts
  down a progress value, and when it reaches zero the item earns an improvement
  at the workbench.
- **Tinkers separates heat from fuel quantity.** Melting and alloy recipes carry
  a temperature; each fuel carries a temperature, a burn rate and a duration per
  unit; a recipe runs only when fuel temperature reaches it. Alloys are
  fixed-ratio mixtures that conserve volume.

### Mapping to the fork

| Mod idea | Already in the fork | L2 slice added | New if adopted |
|---|---|---|---|
| Parts with typed roles | Component types per material, interiors versus outer parts (`crafting_component_filling.js:20-33` header, type lists per material) | Hard outer parts and soft inner parts read different properties (`gear_dimensions.js` shell and padding) | Removable add-on roles after crafting (GDP2) |
| Material properties per role | Strength, weight, warmth, handling, tier per material, impact tables per component type | Hardness read as strength over 100 | Role-specific modifier kinds and a separate toughness (GDP3, GDP15) |
| Stats with sources | `stats.flat/multiplier[source][stat]` | Three dimensions through it | Trait and affix sources (ESD3 and L3), material-supplied traits (GDP4) |
| Trait stacking | Multiplier product and flat sum (`items.js:563-575`) | Soft caps as dials (ESD2) | Dilution rule for shared tags (GDP5) |
| Wear feeds stats | Condition scales stat getters when enabled (`absorb_e2/durability.js:47,61`) | None | Traits that read wear (GDP7); wear rate by material (GDP16) |
| Grade | Item quality and rarity multipliers; sources have quality bands | None | Lot grade by test or process (GDP8) |
| Repair | Coin-cost full repair and per-instance condition cap (`durability.js:146-150`) | None | Material-unit repair and kits (GDP9) |
| Part swap | Items key their components into identity (`items.js:252`), so a changed part is a different key | None | Swap that keeps instance history (GDP13) |
| Smithing steps | MKR-WC3, WC8, WC10, WC11 (proposals), skill "Smelting" gates | None | Heat grade gate (GDP14, GDP27) |

### Materials to stats (feeds ESD1-ESD15)

One row per property; each needs an existing consumer (MR32). Defaults are proposals
with a reason; worlds set the dial.

| Property | Fork source today | Feeds (existing consumer first) | Default, dial and reason |
|---|---|---|---|
| Strength | `material_properties.strength`, also the L2 hardness | Weapon damage, shield block, shell dimensions (`damage_taken`, `min_damage_share`) | Default: one number reads as both until a toughness exists. Dial: split per world with the in-world reason that rigid does not mean tough |
| Weight | `material_properties.weight` | Attack speed, stamina efficiency, agility cost (ESD6) | Default: weight costs stay readable per piece. Dial: worlds with strength-boosted wearers lower the cost |
| Hardness | Not separate (equals strength / 100) | Chip floor (`min_damage_share`), edge life, what can cut what (ESD7) | New axis proposed, GDP15; reads against an attacker's own hardness |
| Toughness | None | Wear per hit and the chance a hit damages the part instead of the wearer; shatter versus bend (MKR-WC3) | New axis proposed, GDP15; the first consumer is wear rate |
| Warmth | `material_properties.warmth` | Cold tolerance, `crit_resistance` padding (L2) | Exists; add its mirror, heat tolerance, when heat gates arrive (GDP27) |
| Handling | `material_properties.handling` | Dexterity on clothing | Exists; extend to grip parts only if a weapon reader asks for it |
| Heat resistance | None | Which fires a part survives, forge and kiln parts, fire damage | New, GDP27; shares the heat grade with fuel |
| Reactivity | None | Corrosion and oxidation timers, vessel compatibility (Part B) | New, GDP22; a tag plus an amount, not a table of pairs (IX8) |
| Repair value | Implied by value and tier | Material-unit repair (GDP9) | Derived from durability-like mass, not a separate stored number |

### Considerations

| Code | Item | Default, dial and reason |
|---|---|---|
| GDP1 | **Recompute order is part of the contract.** Base from parts, then trait and affix bonuses (which may read wear and wielder), then caps. Document it once next to ESD1 so the Attributes view lists the layers in that order. | Order is fixed per engine for legibility; layers are per world. Reason: players read "why" top down |
| GDP2 | **Add-on part roles.** Roles such as coating, grip, lining, setting and a capped upgrade slot attach after crafting, remove at a station, and carry no base numbers: the material supplies them. Extends MKR-IM2 typed sockets; gems are the setting role. | Default: removable with a small loss; dial: some roles are fused by process (a weld). Reason: customization without remaking |
| GDP3 | **Material properties per role.** A material declares what it does as a head (absolute), a shaft (multiplier), a lining (warmth) and so on, as data, not code. | Default: derive per-role values from the base properties; dial: authored overrides for notable materials |
| GDP4 | **Material traits as affix records.** A trait is an ESD4 record (class, type, operation, range, exclusive set) whose source is the material; fields add level, optional conditions (part ratio, gear class) and a max level. This is ESD3's "source defaults to mechanism". | Default: traits follow from properties (a soft metal bends); dial: authored traits for rare materials. Reason: causes before rolls |
| GDP5 | **Dilution for shared traits.** When several parts supply one trait, combine levels by a stated rule so a lone strong part is diluted and a shared trait keeps its strength; the rule is a dial (average, sum with a cap, strongest). | Default: average with a floor of one level. Reason: mixed builds should not stack every best trait |
| GDP6 | **Traits come with their cost.** Pair gains and losses (light speeds and exposes; hard holds an edge and chips) so a stat has a visible price (ESD6). | Default: paired; dial: pure bonuses on rare or magical items with a reason and a visible cost elsewhere |
| GDP7 | **Wear feeds traits.** A trait may scale with condition (a worn edge cuts less, a seasoned grip holds better). The fork already scales stat getters by condition when the durability option is on. | Default: only traits that declare it read wear. Reason: avoids a hidden global penalty |
| GDP8 | **Grade is lot quality from process or a test.** Use IX7's vocabulary (tier ranks the kind, grade ranks within a tier). Default: grade follows from purity and preparation of the lot; a test (assay, ring test, MKR-WC11) reveals it; a random catalyst grader is a dial for worlds that want it. Grade improves by better process, not by luck alone. | Dial: random or deterministic; reason: both fit different worlds (AD5) |
| GDP9 | **Repair spends material.** Restored condition equals the matching material's repair value times the item's repair efficiency times the method's efficiency; a field kit stores a few units at lower efficiency, a station repairs better; stored units are lots (so grade carries). Today repair is a coin cost. | Default: matching material; dial: a compatible substitute at lower efficiency (a mechanism, AD38). Reason: ties repair to supply and salvage |
| GDP10 | **Four distinct verbs: repair, reinforce, refit, upgrade.** Repair restores condition; reinforce adds a protective coating role; refit changes fit to the wearer (MKR-AR3); upgrade adds a capped role. Each declares its state change (MR16). | Per world which verbs exist |
| GDP11 | **Integrity budget.** Parts cost or add capacity on an item; exceeding it adds a stated downside (unstable, loud, slow) instead of blocking the build. Links carrier capacity (MKR-RN3). | Dial: budget size by tier and maker skill; reason: depth without a hard slot count |
| GDP12 | **Use-earned improvement.** Carrying an item through use eventually earns the right to improve it at the bench (honing); a countdown of meaningful use, not purchases (MR22). Pairs with MKR-WC8 and the old-family-blade history. | Dial: threshold and who may spend it; reason: a bonded weapon is earned |
| GDP13 | **Part swap keeps the instance.** Swapping a part creates a new component set but keeps the item's instance id, condition history and name, so repair and fame follow the item (MKR-WC10). Because inventory keys embed components, the swap is a key rewrite with a receipt. | Default: keeps history; dial: a reforge that resets it by design |
| GDP14 | **Smithing steps are verbs with declared effects.** Heat the workpiece, work it (shape, fold), quench in a medium, temper, finish; each step changes a stated property (MR16, MR17) and windows exist only where a rule reads them. Extends MKR-WC3. | Depth is quick, guided or deep per MR18; skill narrows variance (MR21) |
| GDP15 | **Split hardness and toughness.** Hardness resists denting and holds an edge; toughness resists breaking. Derive both from strength today, then diverge per material, with heat treatment (MKR-WC3) moving one against the other. | Default: toughness follows strength inversely for rigid metals; dial: per material. Reason: rigid and tough are different |
| GDP16 | **Wear rate by material.** The durability proposal uses one wear rate for every item; let toughness and hardness scale it per instance (soft edges wear faster; brittle shatters rather than wears). | Default: one scaling function; dial: per world. Consumer exists: `wearItem` |
| GDP17 | **Salvage returns lots.** Dismantling returns material units at a loss and keeps grade; a part flagged unsalvageable (fused, enchanted) returns waste. Conserved (MR5). | Per world loss and what counts as fused |
| GDP18 | **Gear card shows contributions.** Item view lists parts, their material, each trait, its source and the layer it acts in (ESD11, UR40). | Standing; extends the Attributes view |
| GDP19 | **Maker and tool also have grades.** A hammer, tongs or anvil has properties that bound what can be worked (a hard metal needs a harder hammer). | Default: tool tier gates workability; dial: skill compensates partly. Reason: MR21 skill improves control, not truth |
| GDP20 | **Provenance as a record.** Steel quenched in a particular water, folded by a named smith, carries that as source text for rumor and appraisal (MKR-SB5, SB7) and may carry an affix cause (ESD3). | Dial: which records matter per world |

### Disposition (Part A)

**ACT NOW (this round).** Private notes written; this doc saved; the
materials-to-stats table fixes that strength currently doubles as hardness
(`gear_dimensions.js`), which the L2 record states but the ESD doc did not
flag as a limit.

**ACCOUNT FOR NOW.** GDP1 (layer order documented with ESD1), GDP4 (a trait is
an affix record, so L3's data format should leave room for conditions and a max
level), GDP13 (identity keys embed components, so a part-swap feature needs a
key rewrite), GDP15 (name toughness as a future axis so hardness reads do not
spread further).

## Part B. Chemistry

Existing owners reused, none restated: [CRAFTING_ENGINE](CRAFTING_ENGINE.md)
Rounds 3, 6, 7 (PR1-PR7 stages, IX1-IX24 law families, relation graph, difference
facts, tier-gap laws, vessel and rest, conserved separation), `src/craft_resolver.js`
(reactions with station, catalyst, priority, limit; mass conserved or the batch
fails, lines 24-26), `src/craft_materials.js` (axes, tags, generated batches),
`src/mixture_state.js` (seeded Village mixture with retained revisions),
[procedural materials and alchemy audit](PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md),
fermentation owners MV5 (time as ingredient, modular production), LB3 (fermentation
and microbes, [technology](TECHNOLOGY_AND_PROGRESSION.md)) and TQ105 (growing
tools, [tools](TOOLS_AND_INSTRUMENTS_CONSIDERATIONS_2026-10-17.md)), and
Weibao's fermenting notes P12-P16 (private Arcanum notes). The fork has no
fermenting code, so fermentation remains an owner question, not a bug.

**Answer.** A mechanism-based chemistry layer mostly exists as law shapes. A
reagent is a material with fraction axes; a reaction consumes reactants and
yields products and byproducts, with a station, a catalyst and a priority; purity
is an impurity axis; an alembic is a station tag. What is missing is the link to
heat and to gear, not a second chemistry system.

| Code | New angle | Default, dial and reason |
|---|---|---|
| GDP21 | **Heat grade as a gate.** A reaction or operation declares the minimum heat grade it needs, and a station or fuel supplies a grade (ordinal, not a temperature number in the UI). Tinkers' melting and alloy data shows the shape: recipe temperature versus fuel temperature, with separate rate and duration. The resolver already has stations and op levels; a heat grade is one more level on the station, shared with smithing (GDP14) and the energy layer (GDP26). | Grades per world (three, five, none). Reason: heat decides which reactions and which metals exist at all, an AD38 mechanism |
| GDP22 | **Vessels and tools are gear.** An alembic, crucible or flask is a part graph (body, closure, heat contact) with materials, so a vessel's reactivity, heat resistance and fragility matter: acid eats iron, glass cracks on a cold shock, clay is porous. Uses the same property table as gear (reactivity, heat resistance) and ESD7's mechanism matching, instead of per-pair rules. | Default: tags plus amounts decide compatibility; dial: a world lists absolute exclusions only with an in-world reason |
| GDP23 | **One conserved alphabet, optional probabilistic yield.** Alchemistry reduces items to an element set and back. The fork already conserves along axes; adopt the lesson as "decompose and recombine over the same axes", with deterministic fractional yield by default (purity and skill set the fraction) and an execution draw (MR2) as a dial for worlds with random yield. | Dial: deterministic or drawn; reason: both fit (AD5) |
| GDP24 | **Quench and coating are reactions on gear.** A quench medium is a reaction between a hot workpiece and a fluid (changes hardness and toughness, may crack); a coating part resists a reactivity tag; oxidation is a timed stage on reactive parts. This joins Part A to Part B through the same axis names and gives GDP15 its cause. | Per world; ambient humidity and salt are optional site adjectives (MKR-SB4) |
| GDP25 | **Fermenting and aging stay law families.** P12-P14 already say it: sealed vessel, sugar source, yeast, temperature window, lazy resolve on opening with a start timestamp. Add only the heat window from GDP21 and spoilage as the dial; no new owner. | Per world; AR rules decide the lazy-resolve boundary before any build |

### Disposition (Part B)

**ACCOUNT FOR NOW.** Any chemistry slice adds laws and axes, not a new resolver
(MR8, MR29); a vessel property table reuses the gear property names (GDP22)
rather than a second material schema.

**LATER / DELEGATE.** See the table below (L4, L5).

## Part C. Energy

Existing owners reused: `src/energy_resources.js` (integer reserve and capacity,
maximum output and control, efficiency as numerator over denominator, strain and
limit, recovery as an ordinary frozen job; lines 6-9 per WDI46),
[ENGINE_EXPANSION](ENGINE_EXPANSION.md) energy row and its P1 proposal,
[WDI Round 5](WORLD_DIALS_AND_INTERPRETER_CONSIDERATIONS_2026-10-19.md#round-5-per-world-meters-bars-2026-10-20)
(meter kinds WDI49-WDI60, extending energy policies, no parallel store),
TG5 in [technology](TECHNOLOGY_AND_PROGRESSION.md) (energy tiers change what can
run), MX2 in modular chains (harvest, store, transmit, spend), and the body side
(stamina, food, `person.vitals`). The one physical-fuel example in code is
`src/backlog_expansion_body.js:63`: one owned log fuels two pressure uses, and
only when the chamber is empty.

**Answer.** Do not merge physical energy with stamina or food. The body keeps its
own meters and its own owner; the body acts as a converter in a chain (food to
stamina, with efficiency), and devices and fires sit in a separate chain. The
existing energy policy already models a method's reserve, output, control,
efficiency loss and strain, so a physical layer reuses it for devices and adds
what it lacks: an energy grade next to the quantity, and fuel and storage as
items.

| Code | Consideration | Default, dial and reason |
|---|---|---|
| GDP26 | **Quantity and grade are different.** A fuel item carries an amount per unit, a burn rate and a grade; a consumer needs a minimum grade and draws at a rate. Wood fire reaches soft work, coal reaches iron, a bellows or a better fuel reaches steel. Same shape as GDP21; one grade scale for heat. | Grades and fuels per world; reason: what can run at all is what a tier means (TG5) |
| GDP27 | **Heat is the first energy kind.** The minimum world dial: a world declares which energy kinds exist (heat, motion, charge, mana, none), each as an energy policy plus a grade scale; default is heat only, through fuel items for forge, kiln and still. A world with no machines declares none. | Dial: kinds, losses, storage leakage |
| GDP28 | **Conversion loses by stated fractions.** Each converter (fire to steam, wheel to grind) names an efficiency fraction like the existing energy policy; chains multiply; the loss goes somewhere declared (waste heat, noise, spent fuel) per MR5. | Default: a small number of named converters; dial: worlds with cheap energy raise efficiency (TT7) |
| GDP29 | **Storage is a part.** A battery, boiler, flywheel or gem is a gear part with capacity and leakage, resolved lazily (a stored-at time and a leak rate, like aging) so offline time costs no per-tick work (ESD13). Gems as batteries is MKR-OM1; the socket is GDP2's setting role. | Dial: leakage and failure on overcharge (strain) with a reason |
| GDP30 | **Idle fit.** Fuel burns during a job, not per tick: the job quotes fuel, grade and duration when it starts and settles on completion or interruption (AR7, MR1 application). | Standing; fuel shortage stops a job with a named reason |
| GDP31 | **Power and gear meet at energy.** Gear dimensions can include conduction and insulation (how much of a power output passes through a held item, how much heat reaches the wearer), reading the same material table (GDP22). A conductor focus is a part of the stack, not a special slot. | Per world; reason: why a gem focus differs from a plain staff |

### Disposition (Part C)

**ACCOUNT FOR NOW.** Extend `energy_resources.js` records; do not add a second
resource model (WDI46, AR3). Energy kinds are data; GDP26 and GDP21 share one
grade scale, so name it once.

## Part D. Superpowers on the same stack

Existing owners reused: `src/power_models.js` (practice, design, investment,
authority and hybrid models; capacity and cost scale from owned state; no mandatory
slots or universal ceiling), `src/structured_ability_runtime.js` (function families,
acquisition kinds innate, learned, borrowed and acquired, execution kinds, optional
conditions), [RESEARCH_ALTERNATIVE_POWER](RESEARCH_ALTERNATIVE_POWER.md) (18 families
and acquisition-to-retention map), [ABILITY_AUTHORING](worlds/ABILITY_AUTHORING.md),
[SKILL_MECHANISMS_AND_MEANS](worlds/SKILL_MECHANISMS_AND_MEANS_2026-10-13.md),
[WORLD_RULE_GRAMMARS](WORLD_RULE_GRAMMARS_AND_DERIVED_DETAIL_2026-10-19.md) and
[WDI](WORLD_DIALS_AND_INTERPRETER_CONSIDERATIONS_2026-10-19.md) (meters,
constitutions, per-world dials), `src/active_effects.js` (effects with a stats
block, the same flat and multiplier shape gear uses).

**Answer.** Powers, gear and potions can share one stat pipeline with sources,
which most of the existing docs imply but none states. A power is a source whose
modifiers appear in the same layers (ESD1) with a "Power: name" source line.
The new part is the shared vocabulary of cost, limit and side effect, not a
second power engine.

| Code | Consideration | Default, dial and reason |
|---|---|---|
| GDP32 | **A power writes dimension modifiers with a source.** While held or active, a power adds flat and multiplier entries (including the new gear dimensions: damage taken, minimum hit share, crit resistance, conduction) through `stats.flat/multiplier[source]`, so Attributes explains it like gear. Active effects (potions) already use this shape; wiring the structured power runtime to it is unverified. | Default: through the same pipeline; dial: a power with its own hidden layers when a world's rules say so, with a reason |
| GDP33 | **Slot and integrity budgets for powers.** The `design` model already caps designed functions by capacity and optional slots; read that as the same integrity idea as GDP11. A character's body or a source has a budget; each function costs some. | Per power source; no universal slot count |
| GDP34 | **Costs are meters (WDI49).** A pool (energy or spirit) that depletes, an accumulator (strain) that climbs and bleeds, a clock (digestion, debt) that only advances; the energy policy already carries reserve and strain. Side effects are affixes with negative dimensions and a cause, not random debuffs (GDP6). | Default: a visible cost per use; dial: free powers carry a visible cost elsewhere (ESD6) |
| GDP35 | **Limits are adjectives.** How strong, how long, how often, how sure and who can learn it vary per world; training moves them through the `practice` model's mastery bands. Same wording as AD5 and ABUSE_AND_LIMITS. | Per world and per power |
| GDP36 | **Gear and powers modify each other through mechanism.** A focus raises conduction, an insulated glove lowers it, a gem stores charge, armor against fire reads heat resistance. Counters and synergies come from properties (ESD7, GDP22), not a pairing list (AD38). | Per world |
| GDP37 | **Powers can be affixes with causes.** A scar from a fight, a mutation, a patron's mark or a borrowed gift grants a dimension modifier with a source and a price, mapped to the acquisition kinds the runtime already names (innate, learned, borrowed, acquired). | Dial: how a world grants and removes; reason: ownership records already exist |
| GDP38 | **Same stack for enemies.** People and at least one creature now use the shared equipment-to-stats aggregation; the Forest den Direwolf carries a crafted-shape chestplate with saved affix values and its damage mitigation reads the same dimensions. | First creature slice done; human browser encounter still open because the fresh start leaves Forest den locked. Four other battle models and companions remain separate readers. |
| GDP39 | **One reader per power dimension.** A power that writes a stat names the consumer (combat math, crit, wear, energy draw); a write-only power is not done (MR32). | Standing |

### Disposition (Part D)

**ACCOUNT FOR NOW.** Do not add a power engine; extend the existing models and
record which stat keys each writes. A power effect that writes stats
names the reader (GDP39). GDP38 now has a first shared creature example, with
its remaining reader and browser gates recorded below.

## Disposition (whole round)

**ACT NOW (done in this round).** This doc, the private notes with paths and
lines, one hunk each in USER_VISION and PROJECT.md summarising it, and one
router row in the rules index.

**ACCOUNT FOR NOW.** GDP1, GDP4, GDP13, GDP15 (Part A); GDP22 (vessel table
reuses gear property names); GDP26 with GDP21 (one heat grade scale); GDP32 and
GDP39 (powers write through the stat pipeline and name readers). No code
authorized by this doc.

**LATER / DELEGATE** (none authorized to start).

| Item | Level | Effort | Done check |
|---|---|---|---|
| L1. Split toughness from hardness as data on materials; toughness scales wear per hit through the existing durability option | Medium to high | Small to medium | Focused tests for wear scaling and shell reads; rebuilt browser check at 1920x1080: two materials of equal strength wear at different rates, Attributes shows both; `npm run build && npm test`, `check:arch`, `check:rules` |
| L2. Part census: list every consumer of material properties (strength, weight, warmth, handling) before any new axis | Medium | Small | A list with file and line; no second summation path |
| L3. Heat grade and fuel items for one smelting recipe: grade on a fuel item, a minimum grade on a recipe, a job that quotes fuel | High | Medium | Browser check: a recipe fails with a named reason on low-grade fuel and runs on higher; interruption settles fuel (AR7); save, reload, import |
| L4. Chemistry law family: quench as a reaction on a hot workpiece, writing hardness and toughness | High | Medium to large | After L1 and L3; golden snapshots for three seeds (MR34) |
| L5. Material-unit repair and a field kit replacing the coin repair for one tool class | Medium to high | Medium | Condition quote consumes lots; refunds and previews consume nothing (MR4) |
| L6. Read Tinkers casting time and smeltery heat rules; ElementalCraft; Alchemistry machine energy costs | Medium | Small | Notes in the private lane; unread items above resolved |
| L7. Verify whether structured ability effects can write stat keys; if not, design the bridge | Medium | Small | A note naming the effect types and the one file that would change |
| L8. Add-on part roles (GDP2) with the L3 affix data format | High | Large | After the L3 affix work lands and MKR-IM2 is accepted |

### Recommended next implementation slice

**L1, hardness and toughness.** It feeds consumers that already exist (shell
dimensions read hardness; the durability option already scales stats by
condition and has a wear function), needs no persistence change (properties are
material data, so saves derive them), and gives GDP16, GDP24 and heat treatment
a place to land. Target viewport 1920x1080 (laptop widths also checked), visible
outcome "two gear pieces of equal strength show different wear and reads in
Attributes", mobile deferred. One check is open before starting: trace which
code calls `wearItem` in play, since only the stat-scaling side was found
reading condition.

Open for Weibao: build order among L1, L3 (heat grade, the first physical
energy) and L7, and whether enemies read the new dimensions (GDP38). The
Minecraft evidence is structure only; none of it is copied.

## Sources

Silent Gear, Tetra, Tinkers' Construct and Alchemistry source under the private
research folder (local archives; see
[modpack scout](research/MINECRAFT_MODPACK_SCOUT_2026-10-14-report.md) and its
[expanded catalog](research/MINECRAFT_MODPACK_SCOUT_2026-10-14-expanded.md) for
URLs and licenses; reuse boundary A4: original translations only). Private notes:
`docs/research/minecraft/private/gear-depth-2026-10-20/NOTES.md` and
`docs/research/discord-arcanum/private/ARCANUM_DISCORD_NOTES_2026-10-20.md`.

## Results and corrections, 2026-10-20 (L1, L3, L6, L7 returns)

Each ran as its own session; branches are not merged here. Evidence is each session's own report;
this doc has not re-run their checks.

| Item | Result | Where |
|---|---|---|
| L1 toughness vs hardness | Built and committed as `fb8b87574` on branch `claude/trusting-hamilton-9e04c1` | That branch's task record in the equipment doc |
| L3 heat grade and fuel | Iron ingot smelting needs fuel of grade 2 or better; a log fails with a named reason, Charcoal and Coal run. Commit `a92deb672` on `claude/interesting-ritchie-0389d6`. Reported: build, 2283 tests, `check:arch`, `check:rules`, and a 1920x1080 browser check pass; not exercised: a timed job and a literal Export/Import file round trip | That branch |
| L6 remaining reads | Done; private `NOTES_L6_L7.md`. Tinkers melting time follows a sub-linear power of temperature and the square root of volume; the fuel row has temperature (gate), rate (speed) and duration; burn rate scales with smeltery surface area | Private lane |
| L7 power-to-stat bridge | Powers cannot write gear stat keys today; the shape `stats.flat[source][stat]` exists for active effects only, so a stat-modifier effect seam is needed first | Private lane |

Corrections to the claims above. **C1** Tinkers uses numeric temperatures with a derived time, not
ordinal grades; grades are the fork's choice (GDP21, GDP26). **C2** add burn scaling with structure size
to GDP26. **C3** ElementalCraft has no storage leakage; leakage in GDP29 is a fork design choice.
**C4** No mod read confirms conduction or insulation on held items (GDP31 is a fork proposal).
**C5** GDP32 and GDP36 depend on a new stat-modifier effect seam (L7); until then powers do not modify
gear stats. Still unread: smeltery geometry, alloy ratios, ElementalCraft rune effects, Alchemistry
dissolver probabilities and the reactor code.

## GDP38 first shared creature slice, 2026-10-20

The user's direction is one capable crafter/person and one enemy on the same gear pipeline, with each
world's rules defining what makes gear good. Applied codes: GDP38, ESD1, ESD3, ESD14, ESD16
(presentation proposal), CBR, AR1-AR16, AD5, AD36, AD38.

- `src/equipment_stats.js` is the shared gear aggregation. `Person.addAllEquipmentBonus()` and
  `Enemy.init()` both use it. Direwolf's template carries an instance reconstructed from the same
  leather/steel chestplate key and four affixes seen in the browser crafting gate; `Enemy.takeDamage()`
  applies the gear's `damage_taken` and `min_damage_share` through common mitigation math.
- Combat lane browser check (1440x900, fresh origin, rebuilt bundle) compared the ordinary player
  wearer path: one hit did 33.8 damage bare and 11.4 with Steel chainmail. The current fresh-start
  browser keeps Forest den locked, so a live Direwolf encounter was not entered. Enemy gear is
  implemented, but its browser encounter remains an acceptance gate.
- `npm run build && npm test`: 2298/2298 passed on the clean rerun. The earlier run had one timeout
  in the unrelated alloy equipment fixture; its focused rerun passed 5/5. `npm run check:arch`,
  `npm run check:rules`, and the focused equipment/affix/dimension tests (15/15) passed.
- Quality references point to different axes: workmanship grades in Dwarf Fortress and RimWorld,
  rarity versus named modifiers in Path of Exile, and rarity-driven affix sets in Apotheosis. The
  proposed response is ESD16 in the equipment dimensions owner: separate workmanship, rarity and
  concrete effects, while letting each world define its own standard. This is not an accepted UI
  decision.

## Native connected slice, 2026-10-21

Implementation evidence: [gear-depth checkpoint](gm/dispatch/gear-depth-2026-10-21/CHECKPOINT.md). ACT NOW: native gear processes, typed settings, paid reforge, capable maker service, shared item effects, and processed-material cohort lineage are source-implemented and exercised on rebuilt desktop fixtures with persistence. ACCOUNT FOR NOW: native key/count/clock/transaction owners remain authoritative; hidden true age is not a player appraisal, and legacy inputs gain no invented origin. LATER: GX8 connected chemistry/energy/power readers, CRL44 conditional salvage, and CRL24/25 spatial consequence require their own playable consumers and checks. These remaining proposals do not block the verified native gear/material slice or become accepted world laws. Combined-master full gates and merge belong to the integration coordinator.

## Connected journeys and more to consider, 2026-10-23

Weibao selected O1–O5 complementary work, then requested parallel chats and
“more to consider”. [Execution and exact evidence](gm/dispatch/complementary-journeys-2026-10-23/CHECKPOINT.md)
own the current slice. This round extends the palette; it does not turn the
choices below into universal world rules or authorize their later features.
Rules: AD5/6–8/11/15–19/36/38, AR3/6–8/10–12, MR4/5/16/20/23/32.

O1 now connects the existing fuel and oil treatment to the actor's learned
Measured Focus reserve. Quench and temper can use the existing focus policy for
additional process control; the completed item carries its physical treatment,
and native stat/wear readers consume that treatment. This is a bounded GX8
application, not the full chemistry, energy and powers palette. O2/O3 verify
existing life and reviewed-packing consumers; O4/O5 have separate parallel
ownership and verification in the execution record.

| Code | Disposition | Additional interaction and reason | Capability / effort / done check |
|---|---|---|---|
| GDP40 | ACT NOW, done and rebuilt-browser verified | At full hand control, the capped focus contribution had no effect but still charged reserve and strain. The quote now tells the maker to work by hand and spends nothing. The final rebuilt browser proves the refusal, unchanged stock/reserve and subsequent successful hand quench separately from the earlier O1 proof. | Existing coordinator / small / PASS: focused regression and `o1-full-control-browser.cjs`; exact input in the execution checkpoint |
| GDP41 | ACCOUNT FOR NOW | Precision, forge heat and chemical medium have separate owners. Focus does not supply thermal grade or replace oil. The treatment is a lasting material result, so it should not disappear when the maker later rests or changes body; a continuously sustained enchantment would need its own active source reader. | Current slice constraint / no extra feature / existing fuel, oil, focus and saved item checks remain distinct |
| GDP42 | ACCOUNT FOR NOW | Recovery and travel consume played time, so recovering focus after heating can let a workpiece cool. Preparation comes before heating by default; the commit rechecks the actual hot window. A late rejection must preserve focus, oil and item custody. | Current slice constraint / small / cooling rejection plus unchanged costs; no second heat timer |
| GDP43 | ACCOUNT FOR NOW | The O2 worker's private rent and earnings are separate from the institution's treasury, supplies and staff wages. Equipment owned privately does not become household stock just because its maker holds office. Succession transfers the agreed institutional resources, while public reports describe the actual new holder's review. | Current slice constraint / bounded / paid-rent-to-office journey retains private purse and conserves institutional funds |
| GDP44 | ACCOUNT FOR NOW | General absence, an explicitly funded packing interval and a body/heir transition are different boundaries. Existing prepaid packing pauses ordinary play and requires review; its successful proof does not establish general offline wages or transferable mastery. Pending work, living duty holders and available supplies need the owning world's policy before a broader routine can advance. | Current scope boundary / no new policy / preserve the finite packing report and the distinct body/heir evidence |
| GDP45 | LATER / DELEGATE, proposal | A capable NPC could spend its own learned energy on commissioned treatment. Use that maker's policy, reserve, strain, fee and recovery opportunity, rather than lending the player's reserve or inventing a separate NPC result. Today's optional focus route is the player's own work. | Sol / medium / two makers run the same quote/resolver with different actual reserves; commission cancellation and save failure conserve both purses and energies; rebuilt player/NPC comparison |
| GDP46 | LATER / DELEGATE, proposal | Fuel choice can become a meaningful preparation decision. Grade and quantity already act; a future timed treatment could also read burn rate and apparatus, with a player-selectable usable alternative when the cheapest eligible fuel is short. Keep this in the existing heat and job owners rather than a second heat bank. | Sol / medium / two fuels on one real staged consumer show distinct time/cost consequences, adequate alternatives work, interrupted work and import settle once |

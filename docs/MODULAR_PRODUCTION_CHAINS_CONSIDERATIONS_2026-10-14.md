# Modular production chains: harvesting to crafting and beyond

Claude (root), 2026-10-14. A palette, not a spec. Nothing here is selected for a
build. Request: "modularity at every level and more? from harvesting, to
extracting resources to crafting and more? procedural rules and more? Use more
to consider" (recorded in [USER_VISION](USER_VISION.md)).

Standing rules apply: true properties work whether known or not, reload never
rerolls, no fixed "once" limits, sealed secrets by ID only, same rules for NPCs
and player, comfortable idle play, desktop first, one realm for the first
milestone.

## What already exists (read first, not restated)

Each stage of the chain already has an owner. What is missing is the chain
itself: one shape that every stage shares, so harvesting, refining, making,
using and salvaging plug together.

| Owner | Covers |
|---|---|
| [Gathering and resource uses](GATHERING_AND_RESOURCE_USES.md) | Five resource families, what makes finds differ |
| [Materials and alchemy audit](PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md) | Five records (material, batch, process, product, knowledge), `resolveBatch` contract |
| [P8 resources](gm/dispatch/procgen-2026-10-13/p8/REPORT.md) | Deposits, yields, ecology, logistics, idle gathering |
| [P6 creation systems](gm/dispatch/procgen-2026-10-13/p6/REPORT.md) | Smithing, cooking, repair/salvage, buildings, M1-M11 domains |
| [Crafting and consumables](PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md) | CO-PR palette, II1-II7, AB1-AB7 |
| [Weaponcraft and runes](WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md) | Item identity, inscription grammar |
| [Generation foundation rules](GENERATION_FOUNDATION_RULES_2026-10-14.md) | GR1-GR17, GA1-GA10 (address, draw, table, overlay) |
| [World core kit](worlds/WORLD_CORE_KIT_2026-10-14.md) | K2 world laws, K9 items and craft, AX1-AX19 |
| [Rules from scratch](RULES_FROM_SCRATCH.md) | No free carries, no generic conversion |

## Findings from the live code (verified 2026-10-14, `codex/gameplay-foundations`)

| Code | Finding | Consequence |
|---|---|---|
| MDF1 | `src/tag_store.js` (TagRegistry, TagStore, `tagFacts`) has **zero importers** outside its test. | GR7 "tables select by tag query" has a built engine and no reader yet (GR12). A chain is a natural first reader. |
| MDF2 | `src/rules.js` (`evaluateRule`, all/any/not, eq/gte/lte) has **one consumer**, `action_legibility.js`. It already returns `known` and `reasons`. | A good seed for rule modules: it separates "unknown" from "false" and explains failures. It lacks tag selectors, effects and priority. |
| MDF3 | Making lives in **at least seven parallel paths**: `crafting_recipes.js` (2126 lines, upstream), `mixture_state.js`/`mixture_native.js` (P2), `alloy_equipment.js`, `field_workshop.js`, `artifact_workshop_*`, `systems_workshop_*`, `world_completion_materials_*`. `native_craft_transaction.js` is used only by `main.js`. | Every new chain stage added per path multiplies save code and balance passes. The fix is a shared operation shape, not merging the paths in one sweep. |
| MDF4 | Mixture ingredients are a fixed list (II6), and gathering hooks into recipes through `registerMixtureGathering`. | Harvest output is coupled to one consumer. A material catalogue keyed by tags decouples them. |

## ML. Modularity at every level

The same few ideas repeat at every scale: a thing has **properties**, **tags**,
**slots** that accept other things, **condition** that wears, and a
**provenance** trail. If each level uses that shape, a new level costs data,
not code.

| Code | Level | Examples | What modularity buys |
|---|---|---|---|
| ML1 | Substance | Iron, mana essence, sugar, venom, qi | Properties combine by rule, not by recipe list |
| ML2 | Material batch | 3 kg wet hide, a vial of tincture | Quantity, purity, contaminants, age |
| ML3 | Part | Blade, grip, lens, rune plate, gear | Swappable; each carries its own material and quality |
| ML4 | Item | Sword, potion, lantern | Assembly of parts in slots; stats derive from parts |
| ML5 | Assembly | Cart, armor set, golem, ritual circle | Items as parts; failure of one part degrades, not deletes |
| ML6 | Structure | Forge, greenhouse, wall, ship | Rooms and fixtures as slots; a station is a structure that unlocks operations |
| ML7 | Site | Mine, farm, village workshop row | Structures plus a resource node plus workers |
| ML8 | Network | Trade route, guild supply, sect pill pavilion | Sites joined by transport and contracts |
| ML9 | Living bodies | Monster parts, nonhuman starts, constructs, grafts | Bodies are assemblies too; organs and limbs are parts (links the [nonhuman starts](worlds/NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md) and [genetics](GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md) palettes) |
| ML10 | Techniques and spells | Rune sequences, pill formulas, martial forms | A technique is an assembly of moves or glyphs in slots, so the same slot rules apply to invention |

Cross-level rules worth deciding once:

- **ML-A Stats roll up, rules roll down.** An item's stats derive from parts; a
  world law applies down to every part it selects.
- **ML-B Break and salvage follow the tree.** Breaking an assembly yields its
  parts at reduced condition, not a generic "scrap".
- **ML-C Identity stays shallow.** Only gameplay-relevant state forms a stack
  key (P3 rule). Otherwise modular parts explode inventory into unique items.

## MS. The chain as stages

Every stage is one **operation**: inputs, actor, tool or station, conditions,
time, outputs, byproducts, waste, knowledge. Harvesting is an operation whose
input is a living thing or the ground. Crafting is the same operation with
batches as input.

| Code | Stage | Distinct pressure |
|---|---|---|
| MS1 | Survey and find | Knowledge gate: you cannot harvest what you cannot see (spirit sense, prospecting, appraisal cheats) |
| MS2 | Access and claim | Ownership, permits, guild rights, monster lairs, sect territory |
| MS3 | Harvest and extract | Method choice changes yield and quality: pick vs uproot, mine vs blast, kill vs milk vs shear |
| MS4 | Stabilize and preserve | Freshness clocks; drying, salting, sealing, spirit jade boxes |
| MS5 | Transport and store | Weight, volume, spoilage, theft, storage rings that break "no free carries" only by world rule |
| MS6 | Process and refine | Crush, smelt, distill, tan, spin, ferment, purify; each yields intermediates and byproducts |
| MS7 | Intermediate goods | Ingots, thread, reagents, planks: the tradable middle layer |
| MS8 | Assemble | Parts into slots (ML3-ML5) |
| MS9 | Finish and empower | Temper, enchant, inscribe, consecrate, awaken |
| MS10 | Use | Consume, wield, install, feed |
| MS11 | Maintain and repair | Wear by use and by time; repair is an operation with parts as input |
| MS12 | Salvage, recycle, waste | Back to parts or substances; waste with consequences (slag, curse residue, pollution) |
| MS13 | Return to the world | Regrowth, depletion, ecology shifts (P8) |

The chain closes into a loop at MS12-MS13. Byproducts from MS6 should feed
some other chain (GR12: no output without a reader), or count as waste with a
cost.

## MV. A small verb set

Operations draw from a short list of physical verbs, so a new recipe is a
sequence, not new code. Worlds add verbs through rule modules.

| Code | Verbs | Notes |
|---|---|---|
| MV1 | Cut, crush, grind, shape | Change form and surface; tool quality matters |
| MV2 | Heat, cool, burn | Need fuel (P6 M1); temperature bands matter |
| MV3 | Dissolve, mix, separate, filter, distill | P2 mixture already covers mix |
| MV4 | Join, bind, sew, weld | Assembly verbs; joints are weak points |
| MV5 | Wait, age, ferment, grow, cure | Time as an ingredient; idle-friendly |
| MV6 | Infuse, inscribe, refine qi, consecrate | Power-system verbs; per-world |
| MV7 | Observe, test, assay | Produce knowledge, not goods (GR5) |

## MR. Procedural rules

"Procedural rules" can mean three different things. All three fit one module
shape: **selector** (tag query) + **effect** + **priority** + **scope** + 
**knowledge status** + **receipt**.

| Code | Kind | Examples |
|---|---|---|
| MR1 | **World laws as modules** | "Cold iron disrupts fae", "impurities accumulate in pills", "metals remember their smith" (K2). Each world loads a set; overlays (GA4) add or remove by world, region, person or item |
| MR2 | **Generated rules per save** | Which herbs react, which ore veins carry spirit, which beast part cures which sickness. Drawn from a rule grammar at a stable address (GR2), frozen on reveal (GR3). Discovering them is the science loop. Some may be sealed secrets |
| MR3 | **Social rules** | Guild monopolies, taboos, sumptuary laws, sect bans on certain pills. Same module, enforced by institutions (K7) instead of physics |
| MR4 | **Rules about rules** | Priority and conflict policy: specific beats general, world beats core, later overlay beats earlier, ties need an explicit order. A rule that forbids beats a rule that permits unless stated |
| MR5 | **Discovered rule knowledge** | The player learns a rule partly ("seems to work at night") with confidence; truth applies regardless (AB3 observer-scoped knowledge) |
| MR6 | **Player-made rules** | Late game: formations, wards, domains, laws of a pocket realm (`pocket_realm_rules.js` exists) that patch chain operations inside an area |
| MR7 | **Cheats that edit rules** | Rewriting a local law, "everything I touch is pure", a system shop that sells rule overrides. Scoped and receipted so saves stay coherent |

Rule evaluation must stay pure (`rules.js` already promises this): no spending,
no draws, no saved writes.

## MX. And more: other chains with the same shape

| Code | Chain | Stages that map |
|---|---|---|
| MX1 | Food | Forage, hunt, farm, butcher, cook, preserve, eat; ties to hunger |
| MX2 | Energy | Fuel, mana, qi, electricity: harvest, store, transmit, spend |
| MX3 | Monster parts | Kill or tame, dismantle, cure, refine into cores, pills, gear |
| MX4 | Information | Observe, record, copy, translate, publish, rumor decay |
| MX5 | Knowledge | Experiment, theory, technique, teaching, lineage |
| MX6 | People and labor | Recruit, train, assign, rest, retire; workers are actors on operations (AB4) |
| MX7 | Bodies and lineage | Breeding, grafting, cultivation as refining the self |
| MX8 | Souls and essences | Where a world permits: harvest, bind, refine, release |
| MX9 | Money and credit | Mint, lend, tax, debase; prices as a chain output, not a constant |
| MX10 | Construction | Quarry, haul, build, maintain, demolish, reuse stone |

## MT. Subtle interactions

| Code | Detail | Why it matters |
|---|---|---|
| MT1 | **Units and conservation** | Mass in, mass out plus waste. Without it, chains become "generic conversion" that rules-from-scratch rejects |
| MT2 | **Byproduct pressure** | Every refine step makes extras. Unread byproducts bloat saves; read ones create economies |
| MT3 | **Tools are a chain too** | Making a better pick needs a pick. Bootstrap order must be reachable from a fresh start in every world |
| MT4 | **Quality propagates, with a cap** | Bad inputs cap output; great skill cannot fully rescue them. Avoid multiplying quality across ten stages into nonsense |
| MT5 | **Time per stage** | Idle catch-up should resolve a whole chain in closed form per stage, not tick by tick (GR17, performance doc) |
| MT6 | **Bottleneck legibility** | With modular chains the player must see which stage stalls and why |
| MT7 | **Seasons and place** | Harvest windows, regional laws, station location (crafting RX) |
| MT8 | **Depletion and regrowth** | Nodes recover on game time; over-harvest changes ecology and NPC reactions |
| MT9 | **NPC chains compete** | NPC makers buy the same ore (GR13), so shortages are real |
| MT10 | **Old saves** | Items crafted before parts existed need a migration: treat them as single-part assemblies |

## MC. Cheats and debug views

| Code | Tool | Kind |
|---|---|---|
| MC1 | **Chain inspector**: pick any item, see its provenance tree back to the harvest | Read only |
| MC2 | **Operation receipt**: "yield 62% because tool worn, wet season, rule MR2-7" | Read only (AX15) |
| MC3 | **Rule trace**: which modules matched, priority, what each changed | Read only |
| MC4 | **Material sandbox**: run operations on a scratch copy; no spend, no draw advance | Isolated (TL1) |
| MC5 | **Pin a generated rule** to test a chain path (GA5) | Mutating, receipted |
| MC6 | In-fiction cheats: appraisal eye, system crafting menu, "see every vein" | Gameplay |

## MA. Abstractions (earn it twice, AXR1)

| Code | Abstraction | Earned by | Maps to |
|---|---|---|---|
| MA1 | **Operation** (generalizes the audit's Process record): inputs, actor, station, verbs, conditions, time, outputs, byproducts, waste, knowledge | Harvest, refine, mix, repair, salvage | Audit P2 process, AB4 maker actor |
| MA2 | **Slot and part**: typed slots on an item, assembly or body | Weapons, armor, constructs, bodies, techniques | Weaponcraft identity, AB1 |
| MA3 | **Rule module**: selector, effect, priority, scope, knowledge, receipt | World laws, generated rules, social rules, cheats | Extend `rules.js`; GA4 overlay; K2 |
| MA4 | **Material catalogue on tags** | Gathering, mixture, smithing, cooking | II6, GA3, gives `tag_store.js` its reader |
| MA5 | **Chain plan**: a saved sequence of operations for idle automation | Automation (crafting AU), NPC workshops, staff | Later; earns its place only after MA1 has three users |

Do not build a universal crafting engine first. MA1 and MA4 earn their keep on
the first proof; MA2, MA3 and MA5 wait for second consumers.

## MI. Implementation implications

| Code | Implication |
|---|---|
| MI1 | Route new stages through the existing staging and publication seam (II4, `stageMixtureAction`/`commitMixturePlan`), not new per-path save code |
| MI2 | Leave `crafting_recipes.js` (upstream) alone; wrap its outputs as single-part items at the boundary, preserving attribution |
| MI3 | Harvest yields become batches with tags (MA4), so gathering stops calling one consumer directly (MDF4) |
| MI4 | Rule evaluation reads facts from batches and stations; rule effects are applied by the operation resolver, never by the rule evaluator |
| MI5 | Persistence: any new batch or part field needs a migration or an explicit compatibility decision (AGENTS.md safety) |
| MI6 | Verification follows GR16 per generated rule set: seed sweep, golden snapshot, save/reload/import gives the same next value |

## Smallest playable proof (proposal)

One Village chain end to end, inside the first milestone's realm:
**harvest herb (method choice) -> dry it (wait verb, freshness) -> mix (existing
P2) -> drink -> rinse and reuse the vial (salvage)**, with one generated rule
(MR2) and one world law (MR1) shown in the receipt (MC2) and the chain
inspector (MC1). That proves MA1 and MA4, gives `tag_store.js` its first reader,
and touches harvest, process, use and salvage without new families.

## Risks

| Code | Risk | Guard |
|---|---|---|
| MRK1 | Abstraction before consumers | MA build order above; GR12 |
| MRK2 | Inventory explosion from modular parts | ML-C shallow identity |
| MRK3 | Chain tedium in an idle game | Chain plans (MA5) and one-click repeat after first manual run |
| MRK4 | Rule conflicts that nobody can explain | MR4 policy plus MC3 trace |
| MRK5 | Seven making paths diverge further | MI1 shared seam for every new stage |

## LATER / DELEGATE (suggested, not dispatched)

| Code | Unit | Level | Done check |
|---|---|---|---|
| MD-L1 | Build the smallest proof above on `codex/gameplay-foundations` | Strong, medium-high effort (cross-system, persistence) | Rebuilt browser run at 1366x768: harvest, dry, mix, drink, salvage; save/reload/import keeps batches and rule; GR16 tests pass |
| MD-L2 | Map the seven making paths (MDF3) to MA1 operation fields: what each already has, what is missing | Balanced, medium | Table in this doc's fold section, one row per path, file and function cited |
| MD-L3 | Draft the rule module schema extending `rules.js` with tag selectors, effects and MR4 priority, tests only | Balanced, medium | Pure tests: conflict ordering, unknown vs false, receipt reasons |
| MD-L4 | Per-world chain sketches for three existing worlds (which verbs, laws and MR2 grammars each adds) | Balanced, medium | One table per world, linked from K9 |

## Round 2 (2026-10-14): more to consider, lanes sent

Request: "Send out more to consider, consider accordingly and more?"

### Correction first

Round 1 missed an owner. The [harvest modules wave](gm/dispatch/harvest-modules-2026-10-14/PLAN.md)
(HM1-HM11, same day) already covers the harvest end of this chain:

- **HV2** (done, docs) wrote the [modular harvest model](gm/dispatch/harvest-modules-2026-10-14/hv2/MODEL.md):
  one operation contract (source, part template, operation, output batch,
  observation), body-plan templates, harvest verbs, four grade axes and five
  ranked build slices B1-B5. That contract **is** the owner of what round 1
  called MA1 for the source side. MA1 now means "extend HV2 M1 downstream to
  refine, assemble, repair and salvage", not a second operation shape.
- **HV1** (code, still running on `proc/hv1-carcass`, not merged) builds wolf-rat
  carcass processing in `src/harvest.js` with graded parts.
- So MS1-MS5 and MV1 defer to HV2 and P8. Round 1's smallest proof should start
  from HV1's carcass or a plant adapter (HV2 B3), not a fresh harvest path.

### FL. Chains are graphs, not lines

| Code | Shape | Consideration |
|---|---|---|
| FL1 | **Split** | One input, many outputs (carcass to hide, meat, bone; crude oil to fractions). Every branch needs a reader or a waste cost (GR12) |
| FL2 | **Merge** | Tanning needs hide (creature chain) plus bark (plant chain) plus lime (mineral chain). Cross-chain inputs are where chains become an economy |
| FL3 | **Loop** | Catalysts, solvents, molds and reusable vials return. Loss per loop is a tunable per world |
| FL4 | **Substitution** | Slots accept by tag query, so oak bark or a generated bark both tan. Substitutes shift quality, not just yes or no |
| FL5 | **Depth budget per world** | A village world has short chains; a tech or alchemy world has deep ones. Depth is a world adjective, not a global constant |
| FL6 | **Cascade** | One shortage propagates downstream. The player should see which upstream stage starved |

### SR. Scale changes the representation

| Code | Regime | Representation |
|---|---|---|
| SR1 | Hand work | Individual specimens and parts with full provenance |
| SR2 | Workshop | Batches with averaged grade and a sampled provenance |
| SR3 | Manufactory or sect pavilion | Rates per game day, closed-form catch-up (GR17) |
| SR4 | Industry, nation, magic mass production | Flows and stockpiles summarized per site or network (ML7-ML8) |

Rule: the same chemistry and laws apply at every regime; only resolution changes
(P32 level of detail). Moving down a regime (inspecting one item from a flow)
promotes an address to a frozen record (GR3, GR4).

### AG. Who does each stage

| Code | Actor | Notes |
|---|---|---|
| AG1 | Player hands | Skill XP, full choice, slowest |
| AG2 | Hired worker, apprentice, companion | Wages, loyalty, their own skill; AB4 maker actor |
| AG3 | Market | Buying an intermediate is outsourcing a stage; provenance becomes "bought from X" |
| AG4 | Commission | A named NPC runs the stage under their own rules, can cheat or steal |
| AG5 | Construct, golem, automaton | Built in the same chain (ML5); maintenance is its own chain |
| AG6 | Cheat or system | Skips stages at a declared cost (CS below) |

### KS. Knowledge per stage

| Code | Consideration |
|---|---|
| KS1 | **Tacit versus written.** A recipe tells the steps; know-how sets quality. Reading a manual raises the floor, practice raises the cap |
| KS2 | **Trade secrets.** A guild or sect hides one stage. The product is visible, the step is not |
| KS3 | **Reverse engineering.** Salvage (MS12) can reveal parts and hint at rules; this is a discovery route, not a free recipe |
| KS4 | **Copy drift.** Copied recipes lose detail per copy unless the copier understands it (links crafting KN) |
| KS5 | **Stage-specific skills feed broad ones.** Skinning feeds Butchering; smelting feeds Smithing (HV2 SKILLS covers the harvest side) |

### MR round 2. More rule kinds

| Code | Rule kind | Example |
|---|---|---|
| MR8 | **Conservation laws** | Equivalent exchange in an alchemy world (public franchise rule, not sealed); mass and energy accounting by default |
| MR9 | **Local fields** | Formations, holy ground, dead-magic zones and ley lines change operation results by place |
| MR10 | **Timed rules** | Moon phase, season, festival, eclipse windows |
| MR11 | **Spreading rules** | A discovered technique spreads to NPC makers over game time, changing prices and competition |
| MR12 | **Exploits as play** | A solo player finding a loop that breaks the economy is a find, not a bug, unless it breaks saves. Limits are per-world adjectives |
| MR13 | **Rule cost budget** | Rule matching is indexed by tag and route (audit P3), never every rule against every batch every tick |

### GC. Generating the chains themselves

| Code | Consideration |
|---|---|
| GC1 | A generated material brings generated processing needs (a generated ore needs a flux, a temperature band, a by-product) |
| GC2 | **Solvability lint.** Every generated material must have at least one reachable chain from a fresh start in its world, or fall back (GR6). Count fallbacks |
| GC3 | **No dead ends by accident.** A generated byproduct with no reader is either given one or marked waste with a cost |
| GC4 | Chain shape freezes on reveal (GR3); unseen materials may regenerate on table revisions |

### CS. Cheats that skip or reshape stages

| Code | Cheat | Declared cost |
|---|---|---|
| CS1 | System crafting menu: one click, no stages | Loses byproducts, stage knowledge and stage XP |
| CS2 | Inventory pocket space | Breaks MS5 transport limits only by its own world rule; capacity has a cost curve |
| CS3 | "Perfect harvest" touch | Completeness max, but leaves a trace (NPCs notice) |
| CS4 | Rule rewrite in an area (MR7) | Scoped, timed, receipted; leaving the area ends it |
| CS5 | Chain sight: see the whole graph for any item | Information only (MC1 in fiction) |

### OP. Overarching principles (proposal)

| Code | Principle |
|---|---|
| OP1 | Each stage offers a real choice, or it is automatable after the first manual run |
| OP2 | Depth must earn its tedium: a stage exists because it changes an outcome |
| OP3 | Everything is traceable back to a source, an actor and a rule |
| OP4 | Every output has a reader or a declared waste cost |
| OP5 | Same law at every scale and for every actor (SR, GR13) |

### MT round 2. Subtle details

| Code | Detail |
|---|---|
| MT11 | Integer units with remainders kept, never rounded away; partial batches persist |
| MT12 | Containers are items with identity; a potion without a vial does not exist |
| MT13 | Units differ by world (jin, stones, ingots); conversion lives in the catalogue, display uses the world's unit |
| MT14 | Byproduct naming should reveal origin ("rat-hide shavings") so the player can trace them |
| MT15 | A failed operation still produces something: ruined batch, slag, lesson (KS) |

### Lanes dispatched (round 2)

Folder: `docs/gm/dispatch/modular-chains-2026-10-14/`. Docs only, one writer per
lane folder. Session ids in `SESSIONS.md` there.

| Lane | Question | Effort |
|---|---|---|
| PC1 | Crosswalk: the seven making paths (MDF3), HV1 `src/harvest.js` and P2 mixture mapped onto HV2 M1 roles extended downstream; owners round 1 and 2 missed | medium |
| PC2 | Procedural rule modules: schema extending `src/rules.js`, conflict policy (MR4), per-save rule grammars (MR2), social and local rules, discovery, cheats, test table, first reader | high |
| PC3 | Assembly at every level: slots and parts across items, structures, sites, bodies and techniques, reconciled with weaponcraft identity, P6 buildings, CR1 bodies and genetics | medium |
| PC4 | Idle chains and references: automation, logistics, bottleneck display, closed-form catch-up and NPC competition, from games such as Factorio, Dwarf Fortress, RimWorld, Vintage Story, GregTech, Oxygen Not Included and Melvor | medium |
| PC5 | Per-world chains and stress journeys: four existing worlds (one comic) walked end to end; contradictions across HV2, materials audit, crafting palette and this doc | medium |

## Round 3 (2026-10-14): lane returns PC1-PC5 folded, plus a more-to-consider pass

All five lanes finished (docs only). Reports: [PC1 crosswalk](gm/dispatch/modular-chains-2026-10-14/pc1/REPORT.md),
[PC2 rule modules](gm/dispatch/modular-chains-2026-10-14/pc2/REPORT.md),
[PC3 assembly](gm/dispatch/modular-chains-2026-10-14/pc3/REPORT.md),
[PC4 idle chains](gm/dispatch/modular-chains-2026-10-14/pc4/REPORT.md),
[PC5 world journeys](gm/dispatch/modular-chains-2026-10-14/pc5/REPORT.md).
Read them for detail; this section keeps corrections, the shared verdict and
a cross-lane ranking.

### Corrections to rounds 1 and 2 (root was wrong or overstated)

| Code | Root claim | Correction | Source |
|---|---|---|---|
| X1 | MDF2: `rules.js` has one consumer | Four production importers: `action_legibility`, `simulation_contracts`, `expansion_engine`, `capabilities`. It also has caller-draw outcome selection and a resolution receipt. Extend it; do not start a second interpreter | PC1-F2, PC2-F1 |
| X2 | MDF3: seven parallel making paths | Seven content families, but most share the same simulation and publisher. Divergence is representation, identity and receipt depth, not seven save engines. PC1 found nine more paths (P16-P24), including an existing multi-stage chain: feature objects cut, dry, match, kit | PC1-F3, PC1-P16 |
| X3 | MDF4: gathering coupled to the mixture consumer | It only registers two herb supply IDs; there is no runtime gather-to-mix call. Tags help selection but cannot supply composition, units or reserves | PC1-F4 |
| X4 | ML: "a new level costs data, not code" | Overstated. Substance is composition, a network is connectivity, a body is a recipient with agency, a technique is a program. Share references, typed interfaces, exclusive custody and explanations; keep domain reducers separate | PC3-F2 |
| X5 | ML-A: stats roll up | Capabilities derive through **domain reducers** (charge conserves, throughput bottlenecks, coverage is spatial); a law reaches only the carriers it selects | PC3-F3 |
| X6 | ML-B: break yields parts | Accounting principle, not a refund. Detach returns surviving parts; shatter or remelt returns fractions or waste. Never refund original ingredients for worn or upgraded assemblies | PC3-F4 |
| X7 | ML-C: identity stays shallow | A shallow **key** referencing complete validated truth, never a shallow truth record or a second identity registry | PC3-F5 |
| X8 | ML3-ML4: parts and slots are new | `src/items.js` already has typed weapon components, head and handle assembly, armor components. The missing piece is saved mutable parts, custody, fit and restoration | PC3-F1 |
| X9 | ML10: techniques as assemblies | `invention_planner.js` plans prerequisites; it spends nothing and executes nothing. It is not a spell compiler | PC3-F6 |
| X10 | MT4: quality propagates with a cap | Cap a **named response** with a law and revision, not all material truth by one scalar | PC5-C1 |
| X11 | SR2: averaged grade, sampled provenance | Average only properties whose consumers accept averaging; sample provenance for display only; keep exact identity where gameplay reads it (two half pelts never make a whole one) | PC4-F2, PC5-C2 |
| X12 | MT5/SR3: whole-chain closed-form catch-up | Closed form only within a proven constant segment; advance shared causal boundaries; keep unsettled time. This is not authorization for closed-browser progress | PC4-F1, PC5-C5 |
| X13 | MR4: one priority ladder | Separate physics, institutional rules and knowledge first; then explicit override permission; then deterministic priority. A ban has consequences without making cutting impossible. Overlay order selects content, it never bypasses eligibility | PC2-F4, PC5-C3 |
| X14 | GC4/MR2: freeze on reveal | Also freeze at **causal commitment**: an unseen rule a worker already used has changed stock | PC5-C4 |
| X15 | MR6: pocket realm rules | `pocket_realm_rules.js` builds a doorway; it is not a law editor. Player-made rules need new owners | PC2-F3 |
| X16 | MT10/MI2: wrap old items as single-part assemblies | Readers only. Never infer recoverable parts, age or genealogy for old items | PC5-C6 |
| X17 | MT12: a potion without a vial does not exist | Needs per-family applicability and real container custody; a carrier ID is not a reusable vial | PC5-C7 |
| X18 | Maintenance and upkeep costs | Default to pausing or reducing optional production with notice; harsh consequences are per-world dials. No new mandatory survival chores (accepted food direction) | PC4-F5 |
| X19 | HV1 state | HV1 is **finished** on `proc/hv1-carcass` (13/13 focused, 1377/1380 full, desktop browser and literal import per its checkpoint), not merged. Take-one discards the remainder; auto overflow settles at once; the receipt is latest-only | HV1 CHECKPOINT, PC4-H2 to H5 |

### Shared verdict across the five lanes

Every lane reached the same answer from a different angle: **no universal
crafting, rule or assembly engine.** Extend existing owners (HV2 M1, P2
mixture, `rules.js`, `items.js` components, simulation publisher), add a
shared piece only after two real consumers exercise it, and give every new
saved domain an opt-in revision with old saves unchanged. Rounds 1 and 2 stand
as a palette under that rule.

### Cross-lane top picks (proposal, ranked)

| Rank | Pick | Why first | Save change | Executor |
|---|---|---|---|---|
| T1 | Merge HV1 (`proc/hv1-carcass`) through the merge sweep | Every later chain step builds on it; merge-before-dispatch rule. Flagged to the merge-sweep session | Its own, already gated | Merge-sweep owner |
| T2 | Read-only chain inspector: project HV1, P2 and the cut-dry-kit chain onto HV2 M1 roles, and show HV1 auto concurrency and overflow as they are (PC1-A1 + PC4-N1) | Cheap, no new save bytes, makes every later slice debuggable (MC1, MC2) | None | Medium; high review on native hooks |
| T3 | First rule reader at Village mixing: one world law and one generated per-save law change the actual brewed dose (PC2-A1 + A2) | Proves rule modules with a real reader (GR12); P2 is already merged | Opt-in new product revision; revision-1 products untouched | High, one owner |
| T4 | Bind the existing cut, dry, match, kit chain to a shared plan and receipt (PC1-A2) | The live code's clearest multi-stage chain; tests the downstream contract without new content | Optional receipt refs; old jobs keep revision 1 | High |
| T5 | One-recipe repeat order after a manual run (PC4-N2) | Idle comfort without a chain-plan engine (MA5 stays later) | Optional order domain | High |

Supersedes round 1's "smallest playable proof": harvest already exists via HV1,
and vial reuse needs container custody first (X17). T3 is the first playable
chain slice; T2 is its inspector.

Deferred, with owners: rich lots and preservation (HV2 B4, PC1-A4), part swap
and repair (PC3-A1, A2), NPC makers competing for inputs (PC4-N3), causal
catch-up (PC4-N4), rate representation (PC4-N5), institution and field rules
(PC2-A3, A4), prosthetic mounts (PC3-A5), exact-copy salvage refresh (PC1-A5).

### More to consider on this round

**Act now (done in this round):** corrections X1-X19 folded; HV1 flagged to the
merge-sweep session instead of merged here (lane owners merge their own work).

**Account for now:**

| Code | Consideration |
|---|---|
| R3-1 | **Saved-domain sprawl.** T3, T4, T5, HV2 B1-B4 and PC3 each add an optional revisioned owner. Each build packet must name its domain in the existing native envelope validator and literal-import path, and say how a missing domain behaves. Watch the count; the engine runtime palette (DA rows) is the place to set a ceiling or a registry |
| R3-2 | **Hot shared files.** Nearly every pick touches `src/main.js`, and research-tech B1/B2 are building in worktrees now. Reserve writers before dispatch; one integrator per slice |
| R3-3 | **Twenty-five ranked rows across five lanes** is a backlog, not a plan. Only T1-T5 are candidates; one playable slice at a time per AGENTS.md |
| R3-4 | **Rule effects stay in resolvers.** PC2's schema puts effects in the operation resolver; the inspector (T2) must read the same trace, not recompute it, or debug views will drift from play |
| R3-5 | **Inspector is a lens, not a cheat.** T2 shows truth only to a debug or explicitly granted lens; in-fiction views go through knowledge projection (GR5) so sealed IDs never leak |

**Later / delegate:** save this topic as a repeatable core audit
([modular chains core audit](audits/MODULAR_CHAINS_CORE_AUDIT.md), created
this round). A build dispatch for T2-T5 needs Weibao's go-ahead per slice.

## Round 4 (2026-10-14): the game research wave as new evidence, triggers rerun

Request (Weibao, 2026-10-14): "modularity at every level and more? from
harvesting, to extracting resources to crafting and more? procedural rules
and more? ... save and extend accordingly ... Send out codex as useful".

Root, using the more-to-consider pass. Rounds 1-3 converged on a shared
verdict (no universal engine; extend owners; a shared piece after two real
consumers). What is new since round 3 is evidence, not angles: 21 game passes
and per-game aspect passes in the [game research wave](gm/dispatch/game-research-wave-2026-10-14/runs/SESSIONS.md),
and two fired [rerun triggers](audits/MODULAR_CHAINS_CORE_AUDIT.md#rerun-triggers).

### Triggers fired

| Code | Trigger | Rerun |
|---|---|---|
| TR1 | HV1 merged (`4f853c24`) | PC1 crosswalk and PC4 idle catch-up deltas, in lane TW-C below |
| TR2 | T3 rule reader (`proc/cb-t3-rules`, includes T2 inspector) is a new `rules.js` consumer; merged this round after a full test pass | PC2 delta in TW-C |

### New evidence to fold (game wave, to be checked by TW-C)

| Code | Source | Angle for chains | Owner it touches |
|---|---|---|---|
| GW1 | HoI4 production lines | Efficiency that grows with a steady line and partly survives a switch (H-P3), matches re-audit U02 same-batch continuity. *Corrected round 5 (FC2): retention constants shown, native evaluator unread* | P6 workshops, T5 repeat order |
| GW2 | Vagrus trip quotes | Quote a chain's full cost before committing: inputs, wages, supplies, delay reserve | T2 inspector, receipts |
| GW3 | Idleon | Show rate and blocker beside each queued step, and a receipt for settled work | PC4 idle chains |
| GW4 | Immortal Life | Skilled work earns trial applications; shared repairs unlock services | HV2 roles, maintenance (X18) |
| GW5 | Taiwu village and manuals | Damaged inputs stay useful (a torn manual teaches part of a skill), mirrors X6 accounting | Salvage, knowledge |
| GW6 | Warsim generators | One faction trait read by economy, diplomacy and descriptions; name pools reused across roles. *Corrected round 5 (FC2): a proposed multi-reader proof, not shown by table breadth* | GR rule modules, procgen |
| GW7 | KoL | Rules that check the actual action taken, not a flag set beside it | PC2 rule readers |
| GW8 | Prestige Tree community | A layer contract (identity, clock, persistence, reset effect) as the module boundary | R3-1 saved-domain registry |
| GW9 | URR | Culture traits that make recognition useful (who makes what, where). *Corrected round 5 (FC2): objects shown; usefulness is UR-P1's proposal* | Materials provenance |
| GW10 | Re-audit U01 | Toolkit energy and recycling as a chain stage. *Corrected round 5 (FC2): source not ready for acquisition, admission, sacrifice or completion* | HV2, salvage |

### Modularity at every level, consistency check (new)

| Code | Angle |
|---|---|
| ML-R4a | The round 3 verdict (shared references, typed interfaces, exclusive custody, explanations; separate domain reducers) should read the same in the body, technology and world-kit palettes. Lane TW-L checks the four palettes and `docs/research/ABSTRACTION_INVENTORY_2026-10-14.md` for contradictions |
| ML-R4b | A level table for knowledge (observation, technique, discipline, institution) and for bodies (tissue, organ, body, lineage, population) beside ML1-ML10, each naming its reducer and its live owner, so "every level" means the same thing everywhere |
| ML-R4c | Procedural rules at every level: a law selects carriers at its own scope (X5, X13); list which scopes have a live reader after T3 (Village only) and which have none |

### Little stuff (new, route through lane TW-S)

The wave saved 20 or more small touches per game (about 500). Route chain-
relevant ones (stack labels, receipt wording, overflow notices, tool wear
lines) to the crafting, harvest and inspector owners, deduplicated against
existing micro rows.

### Lanes this round

Dispatch: [topic wave 2026-10-14](gm/dispatch/topic-wave-2026-10-14/COMMON.md).
TW-C (chains, triggers and sources), TW-L (levels consistency), TW-S (little
stuff routing). Docs only, two owned files each.

## Round 5 (2026-10-14): TW-C, TW-L, TW-S and synthesis returns folded

Request (Weibao, 2026-10-14): "Fold the topic-wave and synthesis returns into
the four root palettes, corrections first, then pick the next playable slice."
Sources: [TW-C](gm/dispatch/topic-wave-2026-10-14/tw-c/OUTPUT.md), [TW-L](gm/dispatch/topic-wave-2026-10-14/tw-l/OUTPUT.md),
[TW-S](gm/dispatch/topic-wave-2026-10-14/tw-s/OUTPUT.md), [cross-game synthesis](research/cross-game-synthesis-2026-10-14/REPORT.md).

### Corrections (root was wrong or overstated)

| Code | Root claim | Correction | Source |
|---|---|---|---|
| FC1 | X19 and round 4 TR2: HV1 and T3 branch state | HV1, T2 and T3 are all on HEAD (T3 merge `9c4602a9`). PC1-P15's branch-only notes are dated history | TW-C01 |
| FC2 | GW1, GW6, GW9, GW10 as evidence | GW1 retention constants shown, native evaluator unread; GW6 a proposed multi-reader proof; GW9 objects shown, usefulness proposed; GW10 source not ready. Marked in place | TW-C02 |
| FC3 | T4 "cut, dry, match, kit" as one line | The graph branches: cut, wet, dry, sound, then fitting or kit. Matching is not a kit prerequisite. First plan uses the useful dry to kit branch | TW-C03 |
| FC4 | T5 needs a repeat-order engine | P2's learned finite repeat and the audited kit reserve already overlap it; T5 must name one unmet target-order gap and extend those owners | TW-C04 |
| FC5 | MDF1 "tag store has zero readers" | One domain reader now: Village mixing builds a tag registry that `rule_modules.js` reads. One consumer, not two; no general material catalogue on this basis | TW-L01 |
| FC6 | ML-R4c "rule readers by scope" | Only `mixture_rules.js` reads `rule_modules.js` in production, fixed to world plus generated per-save law at Village `mix@2`, selecting declared inputs to one dose response. Institution, knowledge and NPC channels are test fixtures, not live readers. No extraction, drying, tanning or distilling reader exists | TW-C14 to C17, TW-L04 |
| FC7 | Mixing controls as missing little stuff | Mixing already renders stock, held inputs, remaining batches, cancel and stale-quote refusal (`src/mixture_ui.js`, `src/mixture_native.js`). Touches extend them | TW-S-C2 |

### Shared verdict holds, now with live evidence

TW-L ranks the shared pieces that already have two real consumers: rule
predicates (`rules.js`), seeded decisions (`seeded_streams.js`) and
world-instance records (`world_instances.js`); counted acquisition is the
runner-up. Domain reducers stay separate. New rule: demand across imagined
worlds earns a candidate, two distinct real callers earn a landing (TW-L45).

### Chain picks after T3 (proposal, ranked by TW-C)

1. T4 narrowed to dry, kit, useful use. 2. T5 only for its unmet gap.
3. One usable preserve or refine lot from one source family. 4. Exact-copy
salvage to a useful recovered input. 5. A second procedural reader (one local
drying law) after T4. Causal catch-up, multi-maker allocation and full
distilling stay reachable later; none gates T4.

### Next playable slice: P01 work feedback on the Village mixing panel

Picked this round (proposal; build needs Weibao's go-ahead). Why first: the
synthesis ranks it 1 for payoff and 1 for seam reuse; TW-S puts four of its
top five touches here (blocker beside the action, batch cost with held and net
spend, one rate line with units, the input or capacity that stopped work);
it sits on the just-merged T3 reader and T2 inspector; it adds no save field.
Ready prompt: [NEXT_SLICE_P01](gm/dispatch/topic-wave-2026-10-14/NEXT_SLICE_P01.md).
T4 follows it, and the technology NEXT_SLICE (craft cue plus village
sentence) can run after or beside it on disjoint files.

## Round 6 (2026-10-15): feature scout and deep systems sweep folded

Weibao, 2026-10-15: "Fold and commit and push accordingly". Sources: [feature scout fold proposal](research/feature-game-scout-2026-10-14/FOLD_PROPOSAL.md)
section 3 (codes FS1 to FS9 adopted as written there) and the
[deep systems sweep](gm/dispatch/deep-systems-2026-10-14/runs/SESSIONS.md).

### Corrections and cautions

| Code | Correction | Source |
|---|---|---|
| FS1 | One interruption rule for all stages is wrong. TerraFirmaCraft shows three policies in one mod (early unseal resets elapsed time with inputs kept; rain resets wet brick drying; an invalid pit kiln burns fuel and keeps contents). Vintage Story blocks early barrel opening. Give each stage its own declared policy | FOLD_PROPOSAL FS1 |
| FS2 | Round 5 pick 5 "one local drying law" must attach climate only to stages whose predicate reads it; TFC hides ignore season, only brick drying checks rain | FS2 |

### New evidence that shapes T4 (dry, kit, useful use)

| Code | Constraint for T4 | Source |
|---|---|---|
| FS3 | Progress belongs to the lot: settle elapsed change, then move | Vintage Story |
| FS4 | Passive change (drying on world time) is separate from staffed work (firing, cooking); containers return | Sapiens |
| FS5 | Real branch points by method, job-specific clocks, weather-sensitive racks | Project Zomboid |
| FS6 | Name consumed inputs, recoverable custody and uncollected output separately; choose cancel rules explicitly | Stardew Valley |
| FS7 | A part carries selected properties into the kit; declare a per-part output contract | TFC, Vintage Story |

### Deep systems sweep, chain-relevant picks

Production custody and layouts that change output (Immortal Life RP1, RP3);
retained crafting receipts, material-based repair and salvage, commissions
shaped by local conditions (Taiwu D1 to D3); material-to-tool production
(Academagia DS-P1); deferred repair (Naev P1); useful processes that respond to
local conditions (HyperRogue HRD-P1). These extend T4, salvage (pick 4) and the
second processing reader (pick 5); none changes the round 5 order.

## Core-rule reconciliation, 2026-10-18

T4/T5 remain selected by their existing unmet consumer gap. Apply MR5/MR29,
AR3/AR7/AR12 and AD16–AD18/AD38 at the chosen stage boundary: reserve once,
spend only performed work, retain the intermediate product's custody, and resume
or abandon explicitly. A harvest/craft/trade chain cannot each claim the same
input stock or unused time. Drying/aging advances on the process's actual clock;
it does not infer activity in a paused world. No new repeat-order engine is
required where the existing learned finite repeat already suffices.
Later selected-case done check: interrupt one useful dry → kit → use chain,
resume through the real owners and verify stock/current-state persistence. Level:
strong runtime agent; medium only when that chain is authorized. See G27/G28.

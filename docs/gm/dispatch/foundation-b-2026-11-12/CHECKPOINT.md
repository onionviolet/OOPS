# Foundation B · Brewing and chemistry · checkpoint

*Chat B of the [procedural foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md). Phase 1 (inventory, before K and W v0). Started from 9bbc51363 on branch `claude/fdn-b-brewing-afd93a`. Everything below is evidence plus proposals under AD56; nothing here is accepted direction. Codes BI (inventory), BC (conservation), BG (grammar), BQ (quantities), BX (could not express) and BN (next) are local to this chat and continue in later rounds.*

## Status

- Phase 1 inventory: done (this file). No runtime code changed, so no fingerprint re-pin; `book_hp_pack.js` is untouched.
- Save compatibility (MC4): unchanged.
- Embedding waits for K and W v0 on master (MC2).

## PFP2 counts (2026-11-12)

How counted: a canon case "runs as data" when a data row reaches play through code that names no potion. A "bespoke module" is a file whose logic exists for one named potion or scene.

| Count | Value | Rows |
| --- | --- | --- |
| Canon recipes as data, runnable | **27** | 23 LOTM bench rows (`lotm_formula_rows` through `book_world_lotm_bench`), 3 Hogwarts workroom recipes (Love Potion fixation, Alihotsy relief by treacle, Flobberworm thickening in `potion_working_rules`), 1 Mother of Learning balm salve |
| of which the data drives chemistry (amounts, reactions, effects) | **4** | The 3 Hogwarts workroom recipes and the Cyoria salve. The 23 LOTM rows are timers: slots debit at start, one dose mints at collect, quantities are display text |
| Canon recipes as data, not runnable | **31** | 20 LOTM inspect-only rows, 6 LOTM aid preparations and 5 LOTM potion rules in `lotm_potion_rule_rows` (all marked owner-needed) |
| Canon recipes run by bespoke code | **5** | Seer, Corpse Collector, Polyjuice, Draught of Peace, Cure for Boils |
| Bespoke potion modules | **10** | `lotm_seer_brew`, `book_world_lotm_brew`, `book_world_lotm_be_seer`, `hp_brewing_state`, `hp_brewing_formula`, `hp_polyjuice_duration`, `hp_potion_reactions`, `hogwarts_potion_workshop`, `hp_companion_potions`, `hp_ingredient_substitution` (plus `hp_lead_making`, owned by the paused lead life, not B) |
| Separate "a brew" shapes | **7** | See BI3 |

## Inventory (BI)

### BI1 · Recipes known to code

| Recipe | World | Where | Data or bespoke | What the rules actually read |
| --- | --- | --- | --- | --- |
| Polyjuice | HP | Formula and ingredients in `world_packs/book_hp_pack.js` (6 slots, stew 21 days, full-moon fluxweed, 3 doses, cauldron wear); run by `hp_brewing_state.resolveBrew` | Data row, bespoke runner. `slotGrade` hard-codes the `lacewing` slot id; the finish plan lives in `hp_polyjuice_duration` | Slot match grades (ok, near, bad), cauldron condition, donor sample at the glass. No amounts, heat or volume |
| Draught of Peace (classroom) | HP | `hp_potion_reactions.brewWorkshopDraught` | Bespoke function. Uses `craft_resolver` for one `admit` reaction; storage loss, crush or slice yield and stir counting are inline arithmetic | Bean units, storage days, stroke string L/R |
| Blended antidote (original) | HP | `hp_potion_reactions.brewWorkshopAntidote` and `method_program` | Data law over `craft_resolver` (heat degrades binder, warm or catalysed cool binding); cases are original | Amounts, op order, catalyst tag |
| Cure for Boils | HP lead | `hp_lead_making` (not B's file) | Law row over the craft engine, scene-specific module | Op order (quills on or off the fire) |
| Love Potion fixation | HP | `potion_working_rules` hogwartsRoom | Data over `potion_workings` | Ashwinder egg, rose oil, extract then steep |
| Alihotsy relief and hysteria | HP | `potion_working_rules` | Data | Treacle cancels alihotsy (dose rules) |
| Flobberworm thickening, chalk suspension | HP | `potion_working_rules`, `hp_companion_potions` | Data law, bespoke action table | Thickener axis, glass settling |
| Ashwinder egg | HP | `hp_companion_potions.ashwinderEggStage`, duplicated as actions in `potion_workings` (fire, collect, freeze, clear) | Bespoke stage clock in two hosts | Minutes since fire |
| Abrasive Bonemeal suspension (original) | HP | `hp_ingredient_substitution` and `hp_brewing_state` | Original law, bespoke plan | Lot preparation, quantity, settle vs stir |
| Seer (Sequence 9 Fool) | LOTM | `lotm_seer_brew` | Formula as a data array; law (charge 1 : binding 5, madness from unbound charge) hand-written for this one potion; run as procedure steps on Neil's stock | Blood ml and crystal g only; the five supplements are read by nothing |
| Corpse Collector (Sequence 9 Death) | LOTM | `book_world_lotm_brew` | `dose_process` row with its own command file, kept byte-identical by a golden test | One frog, 120 minutes |
| 23 brewable pathway potions | LOTM | `lotm_formula_rows` (43 rows from the pathway table) through `book_world_lotm_bench` | Data over one generator | Slot holdings and minutes. Main and auxiliary quantities ("10 ml", "50 g") are text |
| 6 aid preparations, 5 potion rules | LOTM | `lotm_potion_rule_rows` | Data, no consumer | Nothing yet |
| Village mixture (original) | Frontier | `mixture_*` (7 files) | Its own engine | Exact-mass fractions, steep or boil availability |
| Cyoria balm salve | MoL | `potion_working_rules` | Data over `potion_workings` with a press, mesh, cake drain and residue | Leaf, mesh, oil, op order |

### BI2 · Process rules known to code

| Rule | Owner | Shared or local |
| --- | --- | --- |
| Composition: inputs times property per basis, ordered reactions with limits, catalysts, priority | `craft_resolver.resolveBatch` | Shared (Seer, HP reactions, potion workroom, Frontier crafting, LOTM amulets) |
| Separation, contact, evaporation, air reaction, transfer, cleaning over phased constituents | `craft_process_separation` | Shared leaf; callers are the potion lining and the Paradise environment |
| Vessel lining history (film retain and release, wash) with replay validation | `potion_vessel_history` | Potion-local, on the separation law |
| Thermal kinetics: warm-up curve, extraction and degradation residence, fuel, stop and resume, yield partition | `craft_process_thermal` | Shared leaf with **no runtime caller** (tests and cue fixtures only) |
| Process envelope: slots, minutes, bench, price, ritual, route, gaps, readiness | `dose_process` | Shared (LOTM bench, Corpse Collector, Polyjuice adapter, cast making) |
| Timed procedure with participants and refund on interruption | `making_procedure` | Shared (Seer, cast making) |
| Ordered method binding and draft editor | `method_program`, `method_editor` | Shared with Cyoria light research |
| Dose cancellation (remedy against condition) | `craft_dose_rules` | Shared with Frontier |
| Slot grade to canon, degraded or original product (MR7) | `hp_brewing_state` | Local to Polyjuice |
| Cauldron wear as a scalar condition, scouring | `hp_brewing_state` | Local |
| Freshness and spoilage of lots | `spoilage`, read in `slotGrade` | Shared |
| Trait substitution ranker (physical, functional, symbolic layers) | `lotm_ingredient_catalogue` | Pure leaf with **no runtime caller** |
| Classroom brew chance (50 percent plus 2 per Alchemy xp, cap 95) | `book_world_hp_lessons` | A bare roll, not a working (PFP19 gap) |

### BI3 · Seven shapes for "a brew"

1. `craft_resolver` law plus the `potion_workings` host (Hogwarts and Cyoria workrooms).
2. `hp_brewing_state` slot grading (Polyjuice).
3. `dose_process` timer envelope (LOTM bench, Corpse Collector, Polyjuice adapter).
4. `making_procedure` timed steps (Seer).
5. `mixture_state` (Village).
6. `method_program` ordered binding (antidote editor).
7. `craft_process_thermal` (unused).

Embedding (phase 3) should collapse these onto K's working: composition from 1, ordered steps from 4 and 6, the envelope fields from 3, kinetics from 7, with 2 and 5 retired into data.

## Matter conservation (BC)

Checked by reading the transfer, residue and interruption paths and by a probe of the lining and separation laws (scratch script, not committed). The leaves conserve; the hosts leak.

**Holds**

- `craft_resolver` reactions and `craft_process_separation` contact reactions refuse a law whose reactant and product sums differ. Material conversions on contact are one to one.
- Lining: after two brews and a wash, added 12 = held 9 + used 0 + washed 3 + film 0 (probe). Replay validation rejects a tampered save.
- Separation decant of 100 mass: product 54 + residue 40 + film 6 = 100 (probe). Dose division gives the matter to the doses, never a duplicate pool.
- Thermal yield partitions the active pool into usable, degraded and unextracted with no loss.
- HP split and merge of doses conserve counts; merge refuses different batches.
- Village mixture rejects any batch whose fractions do not sum to its mass; split and dilution are exact rationals.

**Breaks**

| Code | Where | What breaks | Kind |
| --- | --- | --- | --- |
| BC1 | `craft_process_separation.exposeProcessVessel` | Evaporated `exit` (volume and volatile mass) is returned and dropped by every caller. In the probe 10 volume and 10 mass left with no destination | Transfer: matter leaves the world |
| BC2 | `cleanProcessVessel`, `planLiningWash` | Rinse water and its washed film go to "a separate jar" that no owner holds. This is the missing first link of the rinse-water-to-field chain | Residue: no destination |
| BC3 | `craft_process_separation` take and film | Volume and mass are separate ledgers: settled solids occupy no volume (probe: residue volume 0 holding 40 mass) and film retention removes mass without volume | Transfer: volume not conserved with matter |
| BC4 | `potion_workings` press | `pressResidue` is a constant from the world rule (400), not the leaf's mass; wiping with cake or cloth deletes it; cake runoff "goes to the waste tray" with no amount | Residue minted and deleted |
| BC5 | `hp_brewing_state` cauldron | Residue is a scalar condition that drops 150 per brew whatever was brewed; scouring resets it for coins with no waste; a treatment dose's lifted residue vanishes | Residue is not matter |
| BC6 | `hp_brewing_state` brew | Input lots are deleted at start and three doses appear at the end; no amount, volume or partial state between | Transfer by count |
| BC7 | Every brew host (HP bench, `potion_workings`, LOTM bench, Corpse Collector) | Inputs are spent at start and the job is a deadline. There is no stop: a brew cannot be interrupted, so the LT31 case (support leaves partway) has nowhere to land. Only `making_procedure` (Seer) refunds a reservation, and it refunds the whole reservation rather than settling what was already done | Interruption missing |
| BC8 | `craft_process_thermal` | Has the right interruption model (stop keeps residence and spent fuel, resume is a paid segment) but no caller, and released heat is not published anywhere | Heat not conserved into the place |
| BC9 | `hp_potion_reactions` Draught | Storage loss subtracts bean units with no product; the lost beans are then counted as "solids" | Residue relabelled |
| BC10 | LOTM bench and Seer | The cup is a set of facts (`seer`, `madness`), not matter; bench quantities are text; supplements are debited from Neil's stock but read by nothing | Transfer by fact |
| BC11 | Sources in `potion_workings` and the HP routes | Supply mints one unit with no supplier stock; the LOTM bench sells from tier stock counts | Boundary minting (acceptable until M owns supply) |
| BC12 | Dose effects | Effects land on a workshop-local `effects` map, an HP slice `effect` and `condition`, or LOTM facts, never on one body owner (OS5) | Delivery has no body |

## Brewing grammar of parts, draft for P (BG)

Proposal. The grammar is the parts a brew is built from and the rules for combining them. Canon rows are instances; a generated brew must run through the same laws (PFP16).

**BG1 · Ingredient.** `material` (catalogue id) with `properties` (axis amounts per basis; axes are world data, MR37), `phase` (dissolved, suspended, settled, surface, vapor), `form` and `preparation` (raw, stewed, powdered fine or coarse, shredded, crushed, sliced; preparation sets a grade or a particle size), `provenance` (lot, harvest event, moon, donor, supplier; truth kept apart from the maker's claim), `traits` in three layers (physical, functional, symbolic, as in `lotm_ingredient_catalogue`), `age` (read by spoilage) and `role` in a recipe.

**BG2 · Roles.** solvent, active, main, auxiliary, binder, catalyst (retained), identity (bound at delivery, such as a Polyjuice sample), fuel. A role says what a rule reads; substitution matches on the property the reading rule uses and keeps the rest (FG2-B).

**BG3 · Process step.** `op` from the world's vocabulary (admit, extract, crush, slice, steep, simmer, heat, take off fire, cool, stir with direction and count, stew for a duration, fog or settle, strain, decant, skim, distill, divide, bottle), with `conditions` (temperature window, closure, prior op, presence of the right participant), `reactions` (reactants to products with limit, catalyst and priority, mass conserved), `duration` and `costs` (fuel, work, attention, coins).

**BG4 · Vessel.** material, capacity, closure (open, sealed, reflux), mesh size, surface area, thermal mass, heat transfer, condenser efficiency, films (history), condition, and the station's tools (heater limits, agitation tool).

**BG5 · Delivery.** route (oral, topical, assay, beyonder, spirit), what binds at use (donor, recipient, a live ritual contribution as in Marionettist), dose size and what remains in custody if delivery is interrupted before ingestion.

**BG6 · Output.** effect axes with `per` and `mode` (total or concentration), a product grade by formula match (canon, degraded, original under MR7), tolerance windows on main ingredients (LOTM: slightly under tolerated, slightly over harms), and hazards as their own axis (unbound charge to madness).

**BG7 · Combination rules.** Mass is conserved in every reaction; order matters only where a step's condition reads a prior state; a formula is an attractor, so a near miss is degraded and a far miss is original, never another named potion (MR7); world packs set axes, ops and numbers, the law names no world (PFP3).

**BG8 · Canon test set.** Hold out and rebuild from parts: Polyjuice (6 slots plus donor), Seer (7 inputs, 3 ops), Draught of Peace (preparation, stir pattern), Cure for Boils (quills off the fire), Corpse Collector, and the 22 other brewable LOTM rows once their quantities are parsed from text. Corpus for weights (PFP18): `docs/research/hogwarts-potion-evidence-2026-11-11/` (725 catalogue entries, 190 observations, dictionary) and the 43-row LOTM pathway table.

## Quantities B reads and writes, for W (BQ)

Units are authored game units unless a source states one (TSW9). R = reads, W = writes.

| Code | Quantity | On | R/W | Today's owner |
| --- | --- | --- | --- | --- |
| BQ1 | Constituent amount by id and phase | batch, vessel film, dose | R/W | `craft_process_separation`, `craft_resolver` |
| BQ2 | Volume | batch, vessel capacity, dose | R/W | separation law, lining |
| BQ3 | Mass and specific heat of a load | batch | R | thermal |
| BQ4 | Temperature | batch, vessel, place ambient | R/W | thermal (ambient is a law constant today; should be a W read) |
| BQ5 | Heat released or drawn | place | W | none (BC8) |
| BQ6 | Fuel | heater stock | R/W | thermal quote |
| BQ7 | Extraction and degradation residence | batch portion | R/W | thermal |
| BQ8 | Residue and film | vessel | R/W | lining, `pressResidue`, cauldron condition (three owners) |
| BQ9 | Waste water and its contents | place | W | none (BC2) |
| BQ10 | Vapor exit | place air | W | none (BC1) |
| BQ11 | Air exposure units | vessel headspace | R | separation law (budget supplied by caller) |
| BQ12 | Potency per effect axis | dose | W | resolver outputs |
| BQ13 | Hazard (madness, toxicity) | dose, then body | W | LOTM inbox, HP afflictions |
| BQ14 | Vessel condition and wear | vessel | R/W | HP cauldron |
| BQ15 | Ingredient age and freshness | lot | R | spoilage |
| BQ16 | Moon phase, season, day | place and time | R | W (OS6); HP reads the moon from context |
| BQ17 | Maker attention and work | actor | R/W | thermal agitation, LOTM supervisor attention |
| BQ18 | Effect on a body (dose received, condition, duration) | L's body | W | scattered (BC12); OS5 says L owns the body |

Effects B would publish into a place (O3): heat released, vapor released, rinse water poured, spill (Cure for Boils burns through the cauldron), and noise or smell if a world reads them.

## What the rules could not express (BX), backlog rows

- **BX1** A brew interrupted partway with stored heat still working (LT31, PFP7). Only the unused thermal leaf models it.
- **BX2** Text quantities on 43 LOTM rows ("10 ml", "pair", "a large amount") are not amounts; the bench cannot tell a short measure from a full one.
- **BX3** Hogwarts wandwork in a preparation (source-backed in general, step unresolved).
- **BX4** A live ritual contribution at delivery (Marionettist song) versus a recording (FG2-D, FG2-E).
- **BX5** Digestion after drinking is progression (R) reading conduct, not a property of the dose.
- **BX6** Polyjuice sample forms (nail versus hair), partial doses and overlapping transformations.
- **BX7** Spills and vessel failure as matter leaving into the place (Neville's cauldron).
- **BX8** The five Seer supplements and Polyjuice amounts: the source gives participation, not a quantity rule.

## Checks run

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/potion_workings.test.js tests/hp_brewing.test.js tests/lotm_seer_brew.test.js tests/craft_process_thermal.test.js tests/hp_ingredient_substitution.test.js tests/hogwarts_potion_workshop.test.js tests/lotm_brew.test.js tests/hp_lead_life.test.js` at 9bbc51363 | 81 pass, 0 fail | Baseline only; no code changed. Includes the `book.hp` pack fingerprint test |
| Conservation probe (lining two brews and a wash; separation decant; open evaporation) via a scratch script | Lining and decant conserve; evaporation exit has no destination | Scratch, not a regression test; BN3 turns it into one |
| Full `npm test`, build, `check:arch`, `check:rules` | Not run | Docs-only change; the integrator runs the full suite at merge |

## Next phase (BN), after K and W v0 merge

- **BN1** Re-express Seer, Corpse Collector and Polyjuice as data rows on one brewing law over K's working, and delete `book_world_lotm_brew`'s command file and `slotGrade`'s hard-coded slot.
- **BN2** Parse LOTM text quantities into amounts with units and run the 23 bench rows through the composition law, so a short measure changes the dose.
- **BN3** Give BC1, BC2 and BC4 a destination through W (vapor, rinse water and press waste become place effects), and add a conservation regression that totals inputs against product, residue, film, waste and exit.
- **BN4** Wire `craft_process_thermal` into the brew host so a brew can stop, keep its residence and resume (the LT31 join with G).
- **BN5** Move dose effects onto L's body owner (OS5) and pick the done check's substitution case (coarse horn grade or LOTM related-pathway substitution).

Requests to other chats: W, quantities BQ4, BQ5, BQ9, BQ10, BQ16 and the place effects above; L, a body that receives a dose (BQ18); K, a working with a stop that settles completed steps (BC7); P, the grammar above as the first potion draft on its contract.

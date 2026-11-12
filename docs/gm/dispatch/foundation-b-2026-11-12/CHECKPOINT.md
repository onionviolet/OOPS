# Foundation B · Brewing and chemistry · checkpoint

*Chat B of the [procedural foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md). Phase 1 (inventory) and phase 2a (brew law on K and W v0). Started from 9bbc51363 on branch `claude/fdn-b-brewing-afd93a`. Everything below is evidence plus proposals under AD56; nothing here is accepted direction. Codes BRI (inventory), BRC (conservation), BRG (grammar), BRQ (quantities), BRX (could not express) and BRN (next) are local to this chat and continue in later rounds.*

```receipt
build: n/a
route: n/a
state: built
viewport: n/a (no UI; no host calls the brew law yet)
persistence: unchanged
tests: tests/brew_law.test.js 8 pass; phase 1 baseline 8 focused potion and lead-life files, 81 pass
review: none
surface: new leaves src/brew_law.js and src/world_packs/lotm_brew_pack.js; zero registration lines
```

## Status

- Phase 1 inventory: done (sections below, kept as written).
- Phase 2a: done at the law level, **implemented, below floor** (AD43: no host calls it and no player route crosses it yet). Agent-verified, not human-reviewed.
- Save compatibility (MC4): unchanged. The brew is a `kernel.working@1` record, so it inherits K's save shape and migration path when a host adopts it.
- `book_hp_pack.js` untouched; no fingerprint re-pin.

## Phase 2a · Brew law on the kernel working (2026-11-12)

Merged master at ea6a170dd (K v0.1, W v0, P v0). Built on them, nothing forked:

- **`src/brew_law.js`** (B's domain law, names no world). A brew is a K working (`defineWorkingLaw`) with five operations: `admit` (a lot's amount enters the batch, split by its properties, the rest as that material's matrix), `react` (conserved reactions with fractional extent, catalysts and priority), `heat` (runs the thermal leaf `craft_process_thermal` for the step's seconds: the active constituent splits into extract, degraded and untouched; fuel is recorded), `divide` (doses, with the vessel's film share) and `rinse` (film to waste water). The facts carry one ledger: `in`, `batch`, `film`, `out.vapor`, `out.waste`, `out.spill`, `doses`. `brewBalance` checks admitted equals held plus released. Effects are W `publish` ops (`heat_released`, `vapor`, `rinse_water`, `spill`) addressed to the vessel's place, plus `debit` ops for the lot's inventory owner.
- **`src/world_packs/lotm_brew_pack.js`** (LOTM world pack). All 43 formula rows from `lotm_formula_rows` as brew methods, with the table's text quantities parsed into amounts. LOTM law as default, dial and reason: the first main material carries the Beyonder charge, other mains bind it in their formula proportion, bound charge is the dose's power, unbound charge is the hazard; a single-main formula binds at most its formula amount. Auxiliaries are matrix and read by nothing (Neil: the first five barely matter).
- **Canon test.** The Seer row (`fool_9`) on the shared law reproduces `lotm_seer_brew.brewSeer` power and madness exactly at five measures (10/48, 11/48, 10/50, 10/40, 12/50). That module's law can now retire into data when its host moves (BRN1).
- **Not touched:** `kernel_working.js`, `world_substrate.js`, `brew_steam.js` (W hands it to B at embed; its steam-to-humidity contact case stays as W built it, and BRN6 below joins it to the brew law), every host.

### BRC fixes and their regressions (law level)

| Break | Status | Regression in `tests/brew_law.test.js` |
| --- | --- | --- |
| BRC1 vapor exit | Fixed in the law: evaporated matter goes to `out.vapor` and publishes `vapor` into the place; a sealed vessel keeps it | "BRC1, BRC2, BRC8" |
| BRC2 rinse water | Fixed in the law: `rinse` moves the film to `out.waste` and publishes `rinse_water` with its contents; W accepts it into a real place with no join code | same |
| BRC3 volume vs mass | Open. The ledger counts amounts; volume is not tracked separately | none yet |
| BRC4 press residue | Open until the Cyoria and Hogwarts workroom host moves | none yet |
| BRC5 cauldron residue as a score | Open; the law's film is the replacement (BRN1) | none yet |
| BRC6 brew by count | Fixed in the law: amounts move by milli-units into doses | "every known LOTM formula" |
| BRC7 no interruption | Fixed in the law: a stopped or binding-failed brew keeps every settled step's matter; one jump equals minute steps; save and restore keep it | "BRC7", "a lot that is gone" |
| BRC8 thermal unused, heat unpublished | Fixed: `heat` runs the thermal leaf and publishes `heat_released` | "BRC1, BRC2, BRC8" |
| BRC9 Draught storage loss | Open until `hp_potion_reactions` moves | none yet |
| BRC10 cup as facts | Fixed in the law for LOTM: the dose is matter with power and hazard read from it | "Seer canon test" |
| BRC11 boundary minting | Open (M owns supply; `admit` emits `debit` for the inventory owner) | none yet |
| BRC12 effects with no body | Open (BRN5, needs L's body door) | none yet |

The hosts still leak until each moves onto the law; "fixed in the law" means the shared rule now conserves, not that play does.

Mutation check: dropping the last dose's remainder fails 3 tests; dropping the vapor bucket fails the vapor test. Both reverted.

### PFP2 counts, before and after phase 2a

| Count | Before (phase 1) | After (phase 2a) |
| --- | --- | --- |
| Canon recipes as data on a shared law that reads their amounts | 0 (Hogwarts and LOTM) | **43** LOTM rows (all known formulas), in tests; **0 in play** until the bench host moves |
| LOTM rows offered at a bench | 23 (timer only) | 23 (unchanged; the 20 others lack auxiliaries in the notes, a knowledge gap, not a law gap) |
| Canon recipes run by bespoke code | 5 | 5 (Seer now has a matching data row; retires at embed) |
| Bespoke potion modules | 10 | 10 |
| Separate "a brew" shapes | 7 | 8 counting the brew law; the seven retire as hosts move (BRN1) |

### What the LOTM rows cannot express yet

- 20 rows have no auxiliaries in the notes. The law runs them; a brewer cannot follow them until the formula is known, so the bench keeps them inspect-only.
- One quantity, "a large amount" (Scholar of Yore records), is read as one portion. Fifty slots state no amount and are read as one portion per qty.
- Rituals at drinking (Marionettist, Bizarro Sorcerer and others) are delivery conditions (BRG5), not brewing; digestion is R's (SC4).
- Alternate main materials (the OR lines) use the first one listed.

### Next (phase 2b onward)

- **BRN1** Move the LOTM bench and the Seer scene onto the brew law (dose power and hazard from matter), then retire `book_world_lotm_brew`'s command file and the Seer law.
- **BRN6** Join `brew_steam.js` to the brew law: a heat step's steam writes humidity through W, and humidity or draft reaches the batch (W-B7), so the PFP7 chain "the batch finishes weaker" comes from the rules.
- **BRN7** Hogwarts evidence catalogue rows (`docs/research/hogwarts-potion-evidence-2026-11-11/`) as brew rows where the evidence gives participants and steps, listing the rest.
- Then BRN2-BRN5 as below, a stated-reason substitution, potion effects as effect-grammar sentences with P, and medicine and poison through L.

### Requests (relay through the coordinator)

- **W:** declare `vapor` and `waste_water` quantities (or say effect detail is enough) so places can hold what a brew releases; W-B2 diffusion for heat between batch and room.
- **L:** the body door for a dose: `{body, dose contents, route}` in, condition out (BRC12, CFC7 uses the same door for hits).
- **K:** KB9 (costs on the quote) would let the brew quote show the lot debits; nothing blocks B now.
- **P:** the brew method shape (`brewMethod`: slots then process steps with options) is ready for PGB2 nested step parts and a second canon test (Seer, Polyjuice).

## PFP2 counts (2026-11-12)

How counted: a canon case "runs as data" when a data row reaches play through code that names no potion. A "bespoke module" is a file whose logic exists for one named potion or scene.

| Count | Value | Rows |
| --- | --- | --- |
| Canon recipes as data, runnable (Hogwarts and LOTM) | **23** | 23 LOTM bench rows (`lotm_formula_rows` through `book_world_lotm_bench`). One of them, `fool_9` Seer, is also brewed by the bespoke Neil scene, so 22 are data only. Corpse Collector (`death_9`) is a bench pointer, not one of the 23 |
| of which the data drives chemistry (amounts, reactions, effects) | **0** | The 23 LOTM rows are timers: slots debit at start, one dose mints at collect, quantities are display text |
| Canon ingredient relations with original methods, runnable as data | **3** | Hogwarts workroom rows in `potion_working_rules` (Love Potion fixation, Alihotsy relief by treacle, Flobberworm thickening). The ingredients and effects are source-pointed; the composed methods and numbers are original, so these are not canon recipes. They do drive chemistry through `craft_resolver` |
| Outside scope, for reference | 1 | Mother of Learning balm salve on the same workroom host (data, drives chemistry) |
| Canon recipes as data, not runnable | **31** | 20 LOTM inspect-only rows, 6 LOTM aid preparations and 5 LOTM potion rules in `lotm_potion_rule_rows` (all marked owner-needed) |
| Canon recipes run by bespoke code | **5** | Seer (also a bench row, above), Corpse Collector, Polyjuice, Draught of Peace, Cure for Boils |
| Bespoke potion modules | **10** | `lotm_seer_brew`, `book_world_lotm_brew`, `book_world_lotm_be_seer`, `hp_brewing_state`, `hp_brewing_formula`, `hp_polyjuice_duration`, `hp_potion_reactions`, `hogwarts_potion_workshop`, `hp_companion_potions`, `hp_ingredient_substitution` (plus `hp_lead_making`, owned by the paused lead life, not B) |
| Separate "a brew" shapes | **7** | See BRI3 |

## Inventory (BRI)

### BRI1 · Recipes known to code

| Recipe | World | Where | Data or bespoke | What the rules actually read |
| --- | --- | --- | --- | --- |
| Polyjuice | HP | Formula and ingredients in `world_packs/book_hp_pack.js` (6 slots, stew 21 days, full-moon fluxweed, 3 doses, cauldron wear); run by `hp_brewing_state.resolveBrew` | Data row, bespoke runner. `slotGrade` hard-codes the `lacewing` slot id; the finish plan lives in `hp_polyjuice_duration` | Slot match grades (ok, near, bad), cauldron condition, donor sample at the glass. No amounts, heat or volume |
| Draught of Peace (classroom) | HP | `hp_potion_reactions.brewWorkshopDraught` | Bespoke function. Uses `craft_resolver` for one `admit` reaction; storage loss, crush or slice yield and stir counting are inline arithmetic | Bean units, storage days, stroke string L/R |
| Blended antidote (original) | HP | `hp_potion_reactions.brewWorkshopAntidote` and `method_program` | Data law over `craft_resolver` (heat degrades binder, warm or catalysed cool binding); cases are original | Amounts, op order, catalyst tag |
| Cure for Boils | HP lead | `hp_lead_making` (not B's file) | Law row over the craft engine, scene-specific module | Op order (quills on or off the fire) |
| Love Potion fixation | HP | `potion_working_rules` hogwartsRoom | Data over `potion_workings`; canon ingredient pointers, original method | Ashwinder egg, rose oil, extract then steep |
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

### BRI2 · Process rules known to code

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

### BRI3 · Seven shapes for "a brew"

1. `craft_resolver` law plus the `potion_workings` host (Hogwarts and Cyoria workrooms).
2. `hp_brewing_state` slot grading (Polyjuice).
3. `dose_process` timer envelope (LOTM bench, Corpse Collector, Polyjuice adapter).
4. `making_procedure` timed steps (Seer).
5. `mixture_state` (Village).
6. `method_program` ordered binding (antidote editor).
7. `craft_process_thermal` (unused).

Embedding (phase 3) should collapse these onto K's working: composition from 1, ordered steps from 4 and 6, the envelope fields from 3, kinetics from 7, with 2 and 5 retired into data.

## Matter conservation (BRC)

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
| BRC1 | `craft_process_separation.exposeProcessVessel` | Evaporated `exit` (volume and volatile mass) is returned to the caller and no host owns it. No runtime caller evaporates today (the lining uses contact and decant; `book_world_paradise_environment_inputs` uses `separateProcessBatch` only), so this breaks the first time a host heats an open vessel. In the probe 10 volume and 10 mass left with no destination | Transfer: matter leaves the world |
| BRC2 | `cleanProcessVessel`, `planLiningWash` | Rinse water and its washed film go to "a separate jar" that no owner holds. This is the missing first link of the rinse-water-to-field chain | Residue: no destination |
| BRC3 | `craft_process_separation` take and film | Volume and mass are separate ledgers: settled solids occupy no volume (probe: residue volume 0 holding 40 mass) and film retention removes mass without volume | Transfer: volume not conserved with matter |
| BRC4 | `potion_workings` press | `pressResidue` is a constant from the world rule (400), not the leaf's mass; wiping with cake or cloth deletes it; cake runoff "goes to the waste tray" with no amount | Residue minted and deleted |
| BRC5 | `hp_brewing_state` cauldron | Residue is a scalar condition that drops 150 per brew whatever was brewed; scouring resets it for coins with no waste; a treatment dose's lifted residue vanishes | Residue is not matter |
| BRC6 | `hp_brewing_state` brew | Input lots are deleted at start and three doses appear at the end; no amount, volume or partial state between | Transfer by count |
| BRC7 | Every brew host (HP bench, `potion_workings`, LOTM bench, Corpse Collector) | Inputs are spent at start and the job is a deadline. There is no stop: a brew cannot be interrupted, so the LT31 case (support leaves partway) has nowhere to land. `making_procedure` (Seer) is the partial exception: all costs sit on step one, an unfinished step is a refundable job and completed steps stay as facts. So a stop during step one refunds every input, a stop during a later step refunds nothing, and the work done inside the unfinished step is neither kept nor settled | Interruption missing |
| BRC8 | `craft_process_thermal` | Has the right interruption model (stop keeps residence and spent fuel, resume is a paid segment) but no caller, and released heat is not published anywhere | Heat not conserved into the place |
| BRC9 | `hp_potion_reactions` Draught | Storage loss subtracts bean units with no product; the lost beans are then counted as "solids" | Residue relabelled |
| BRC10 | LOTM bench and Seer | The cup is a set of facts (`seer`, `madness`), not matter; bench quantities are text; supplements are debited from Neil's stock but read by nothing | Transfer by fact |
| BRC11 | Sources in `potion_workings` and the HP routes | Supply mints one unit with no supplier stock; the LOTM bench sells from tier stock counts | Boundary minting (acceptable until M owns supply) |
| BRC12 | Dose effects | Effects land on a workshop-local `effects` map, an HP slice `effect` and `condition`, or LOTM facts, never on one body owner (OS5) | Delivery has no body |

## Brewing grammar of parts, draft for P (BRG)

Proposal. The grammar is the parts a brew is built from and the rules for combining them. Canon rows are instances; a generated brew must run through the same laws (PFP16).

**BRG1 · Ingredient.** `material` (catalogue id) with `properties` (axis amounts per basis; axes are world data, MR37), `phase` (dissolved, suspended, settled, surface, vapor), `form` and `preparation` (raw, stewed, powdered fine or coarse, shredded, crushed, sliced; preparation sets a grade or a particle size), `provenance` (lot, harvest event, moon, donor, supplier; truth kept apart from the maker's claim), `traits` in three layers (physical, functional, symbolic, as in `lotm_ingredient_catalogue`), `age` (read by spoilage) and `role` in a recipe.

**BRG2 · Roles.** solvent, active, main, auxiliary, binder, catalyst (retained), identity (bound at delivery, such as a Polyjuice sample), fuel. A role says what a rule reads; substitution matches on the property the reading rule uses and keeps the rest (FG2-B).

**BRG3 · Process step.** `op` from the world's vocabulary (admit, extract, crush, slice, steep, simmer, heat, take off fire, cool, stir with direction and count, stew for a duration, fog or settle, strain, decant, skim, distill, divide, bottle), with `conditions` (temperature window, closure, prior op, presence of the right participant), `reactions` (reactants to products with limit, catalyst and priority, mass conserved), `duration` and `costs` (fuel, work, attention, coins).

**BRG4 · Vessel.** material, capacity, closure (open, sealed, reflux), mesh size, surface area, thermal mass, heat transfer, condenser efficiency, films (history), condition, and the station's tools (heater limits, agitation tool).

**BRG5 · Delivery.** route (oral, topical, assay, beyonder, spirit), what binds at use (donor, recipient, a live ritual contribution as in Marionettist), dose size and what remains in custody if delivery is interrupted before ingestion.

**BRG6 · Output.** effect axes with `per` and `mode` (total or concentration), a product grade by formula match (canon, degraded, original under MR7), tolerance windows on main ingredients (LOTM: slightly under tolerated, slightly over harms), and hazards as their own axis (unbound charge to madness).

**BRG7 · Combination rules.** Default: mass is conserved in every reaction. Dial: a world law field can declare a source or sink (a Beyonder characteristic that is more than its matter, a conjured ingredient) with its in-world reason and cost, and the receipt records it. Reason: conservation is what lets residue, spills and rinse water reach the place; a declared exception keeps that readable; order matters only where a step's condition reads a prior state; a formula is an attractor, so a near miss is degraded and a far miss is original, never another named potion (MR7); world packs set axes, ops and numbers, the law names no world (PFP3).

**BRG8 · Canon test set.** Hold out and rebuild from parts: Polyjuice (6 slots plus donor), Seer (7 inputs, 3 ops), Draught of Peace (preparation, stir pattern), Cure for Boils (quills off the fire), Corpse Collector, and the 22 other brewable LOTM rows once their quantities are parsed from text. Corpus for weights (PFP18): `docs/research/hogwarts-potion-evidence-2026-11-11/` (725 catalogue entries, 190 observations, dictionary) and the 43-row LOTM pathway table.

## Quantities B reads and writes, for W (BRQ)

Units are authored game units unless a source states one (TSW9). R = reads, W = writes.

| Code | Quantity | On | R/W | Today's owner |
| --- | --- | --- | --- | --- |
| BRQ1 | Constituent amount by id and phase | batch, vessel film, dose | R/W | `craft_process_separation`, `craft_resolver` |
| BRQ2 | Volume | batch, vessel capacity, dose | R/W | separation law, lining |
| BRQ3 | Mass and specific heat of a load | batch | R | thermal |
| BRQ4 | Temperature | batch, vessel, place ambient | R/W | thermal (ambient is a law constant today; should be a W read) |
| BRQ5 | Heat released or drawn | place | W | none (BRC8) |
| BRQ6 | Fuel | heater stock | R/W | thermal quote |
| BRQ7 | Extraction and degradation residence | batch portion | R/W | thermal |
| BRQ8 | Residue and film | vessel | R/W | lining, `pressResidue`, cauldron condition (three owners) |
| BRQ9 | Waste water and its contents | place | W | none (BRC2) |
| BRQ10 | Vapor exit | place air | W | none (BRC1) |
| BRQ11 | Air exposure units | vessel headspace | R | separation law (budget supplied by caller) |
| BRQ12 | Potency per effect axis | dose | W | resolver outputs |
| BRQ13 | Hazard (madness, toxicity) | dose, then body | W | LOTM inbox, HP afflictions |
| BRQ14 | Vessel condition and wear | vessel | R/W | HP cauldron |
| BRQ15 | Ingredient age and freshness | lot | R | spoilage |
| BRQ16 | Moon phase, season, day | place and time | R | W (OS6); HP reads the moon from context |
| BRQ17 | Maker attention and work | actor | R/W | thermal agitation, LOTM supervisor attention |
| BRQ18 | Effect on a body (dose received, condition, duration) | L's body | W | scattered (BRC12); OS5 says L owns the body |

Effects B would publish into a place (O3): heat released, vapor released, rinse water poured, spill (Cure for Boils burns through the cauldron), and noise or smell if a world reads them.

## What the rules could not express (BRX), backlog rows

- **BRX1** A brew interrupted partway with stored heat still working (LT31, PFP7). Only the unused thermal leaf models it.
- **BRX2** Text quantities on 43 LOTM rows ("10 ml", "pair", "a large amount") are not amounts; the bench cannot tell a short measure from a full one.
- **BRX3** Hogwarts wandwork in a preparation (source-backed in general, step unresolved).
- **BRX4** A live ritual contribution at delivery (Marionettist song) versus a recording (FG2-D, FG2-E).
- **BRX5** Digestion after drinking is progression (R) reading conduct, not a property of the dose.
- **BRX6** Polyjuice sample forms (nail versus hair), partial doses and overlapping transformations.
- **BRX7** Spills and vessel failure as matter leaving into the place (Neville's cauldron).
- **BRX8** The five Seer supplements and Polyjuice amounts: the source gives participation, not a quantity rule.

## Checks run

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/potion_workings.test.js tests/hp_brewing.test.js tests/lotm_seer_brew.test.js tests/craft_process_thermal.test.js tests/hp_ingredient_substitution.test.js tests/hogwarts_potion_workshop.test.js tests/lotm_brew.test.js tests/hp_lead_life.test.js` at 9bbc51363 | 81 pass, 0 fail | Baseline only; no code changed. Includes the `book.hp` pack fingerprint test |
| Conservation probe (lining two brews and a wash; separation decant; open evaporation) via a scratch script | Lining and decant conserve; evaporation exit has no destination | Scratch, not a regression test; BRN3 turns it into one |
| `npm run check:rules` after adding the receipt block | Exit 0; receipts 42 checked, 0 problems | One pre-existing TMR1 warning in `book_world_hp_exams.js`, not this change. The first run failed on this file's missing receipt block, now fixed |
| Code prefix check: `grep -rlE` for BRI, BRC, BRG, BRQ, BRX, BRN in docs, src and tests | 0 hits before this file | BC and BX were already used in CHEAT_RULES, CHEAT_COSMOLOGY and the companions palette, so this chat uses BR prefixes |
| Full `npm test`, build, `check:arch` | Not run | Docs-only change; the integrator runs the full suite at merge |
| Phase 2a: `node --test tests/brew_law.test.js` | 8 pass, 0 fail | Law-level only; no host |
| Phase 2a: `npm run check:arch` | Exit 0; main.js growth -1 (from master) | |
| Phase 2a: `npm run check:rules` | Exit 0; 53 receipts, 0 problems | Pre-existing TMR1 warning |
| Phase 2a: build, full `npm test`, browser | Not run | Nothing in the bundle imports the new files; the integrator runs the full suite |

## Next phase (BRN), after K and W v0 merge

- **BRN1** Re-express Seer, Corpse Collector and Polyjuice as data rows on one brewing law over K's working, and delete `book_world_lotm_brew`'s command file and `slotGrade`'s hard-coded slot.
- **BRN2** Parse LOTM text quantities into amounts with units and run the 23 bench rows through the composition law, so a short measure changes the dose.
- **BRN3** Give BRC1, BRC2 and BRC4 a destination through W (vapor, rinse water and press waste become place effects), and add a conservation regression that totals inputs against product, residue, film, waste and exit.
- **BRN4** Wire `craft_process_thermal` into the brew host so a brew can stop, keep its residence and resume (the LT31 join with G).
- **BRN5** Move dose effects onto L's body owner (OS5) and pick the done check's substitution case (coarse horn grade or LOTM related-pathway substitution).

Requests to other chats: W, quantities BRQ4, BRQ5, BRQ9, BRQ10, BRQ16 and the place effects above; L, a body that receives a dose (BRQ18); K, a working with a stop that settles completed steps (BRC7); P, the grammar above as the first potion draft on its contract.

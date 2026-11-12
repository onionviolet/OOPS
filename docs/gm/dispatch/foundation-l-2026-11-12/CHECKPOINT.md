# Foundation L · Living things: phase 1 inventory

*Chat L in the [procedural foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md) (OS5 scope: people, animals, Gu-as-creatures and plants). Phase 1, before K and W publish v0: inventory only. Started 2026-11-12 from commit 9bbc51363 on branch `claude/fdn-l-living-dd64ac`. Everything below the inventory is a proposal under AD56, adjustable. Rules applied: PFP1-PFP3, PFP10, PFP16-PFP19, CR1-CR17 and FG1 from the [creature root rules](../../../research/CREATURE_ROOT_RULES_2026-11-11.md), AR3, LVR13, BHR16.*

## Headline

1. **One library, fourteen stores.** `creature_lifecycle.js` (371 lines, family `creature_lifecycle@1`) is already the shared library for 19 host modules. But 14 of those hosts call `restoreCreatureLifecycle` on their **own** save record, so every pen, glade and nest has its own identity counter, revision and clock. `gu_hosted_wolf.js` requires exactly one individual in its store. The previous lane's checkpoint says identity is "scoped to the host save record". The plan's done check ("pet, livestock, wild cohort and Gu-as-creature all read one lifecycle") turns on a **shared store and a species catalogue**, not on more imports.
2. **No species catalogue.** Species are string literals inside host modules (`'lightning-wolf'` in two files, `'reed-terrapin'`, `'insight-moth'`, `army-ant-${caste}`, `'reed-construct'`, `'house_cat'`, `'sheep'`). The only per-body data table is `needs.js` `BODIES` with 5 rows (human, gu, sheep, house_cat, construct), whose keys do not match most lifecycle species. Canon living kinds that run as data rows through shared rules: effectively zero.
3. **The body model is thin and split.** Breeding has three paths (`household_brood.js` beside the lifecycle), injury four owners and hunger four forms (see Duplicates). The lifecycle holds one injury slot that heals only while care is active. Hunger lives elsewhere (`needs.js`, `living_upkeep.js`) and each host reads it itself. There is no condition or vitality scalar, no illness, no poison response, no death by age, and plants and the player body are entirely off the lifecycle.

## PFP2 counts

Counting rule, rerunnable:

- **Bespoke scene hosts:** `grep -rlE "creature_lifecycle\.js'" src | grep -v '^src/creature_lifecycle.js$' | wc -l` gives **19**; of those, `grep -rc "restoreCreatureLifecycle(" src` shows **14** holding their own store. Each hard-codes its species, habitat literals and law constants.
- **Canon living kinds as data:** rows in a catalogue that shared lifecycle rules run with no host code. **0** (no catalogue exists). The nearest data, `needs.js` BODIES, has **5** rows and only drives food rate.

| Count | Value at 9bbc51363 | Direction |
| --- | --- | --- |
| Canon living kinds run as data | 0 | rises |
| Body-data rows (`needs.js` BODIES) | 5 | rises, merges into the catalogue |
| Lifecycle host modules | 19 | falls as hosts become catalogue rows plus a thin consumer |
| Separate lifecycle stores | 14 | falls to 1 per save (or per world if W scopes stores) |
| Living-body modules off the lifecycle | `household_brood`, plants (4 sites), player and NPC bodies | fall as they become kinds |

## Inventory: modules that model a living body

### Lifecycle core (owned by L)

| File | Stores | Time | Notes |
| --- | --- | --- | --- |
| `creature_lifecycle.js` | `cohorts{species, habitat, stock}`, `individuals{serial, origin, species, habitat, keeper, traits, bornAt, matureAt, experience{actor:{bond 0-100, lastAt, training{skill:count}}}, health{lastAt, careUntil, injury{kind, at, required, remaining, healedAt}}}`, `broods{parents[2], dueAt, growthMinutes, traits}`, `habitats{interval, nextAt, births, losses}`, `revision`, `nextIdentity` | Played minutes, lazy projection; optimistic revision check per action; wild windows settle up to 64 per call | Pure (AR3). Inheritance: per-trait coin flip between two parents, drawn at brood start by `address('creature-inheritance', broodId, trait)`. One offspring per brood. Prey dependency via `habitat.preyRequirements` |
| `creature_methods.js` | none (pure planner) | none | `measureCreatureCapability` (sum or max of sourced contributions) and `planCreatureMethod` (ordered typed-role steps, max 12). One of the four "ordered steps over typed inputs" shapes K is comparing |
| `creature_layers.js` | `base`, `layerDefs` on a body | none | Removable template layers (add, set, tag, untag), PF1 calibration. Not wired to the lifecycle |
| `living_regulator.js` | `{clock, humidity, inlet, pending}` | Played minutes, 64-window bound | Chamber feedback for the terrapin. Device state, not body state |
| `habitat_care.js` (+ `_ui`) | Village pen: site, `lifecycle`, sheep, ram, lamb, brood ids, hay and wool | Native calendar minutes, lazy | Livestock consumer. LVR rules say not to copy it |
| `meadow_wildlife.js` | copse store (rabbit, fox) | Wild habitat windows | Wild cohort consumer |
| `meadow_shell_state.js` | terrapin store + regulator | Minutes | Care, work and combat read one projected condition (CR17) |
| `meadow_courier.js`, `meadow_fleece.js`, `meadow_shell_combat.js` | reed construct; wool plan; shell guard | Minutes | Construct uses the lifecycle for custody only |

### Shared need seams (not owned by L, read by L)

| File | Stores | Time | Notes |
| --- | --- | --- | --- |
| `needs.js` | `NEED_KINDS` (food only, four stages with work and heal multipliers), `BODIES` (5 rows: rate, heal, strength, rationMinutes, selfFed) | Pure; callers pass minutes since meal | Default: low need slows, does not kill (BHR16, LVR15). Only 2 importers |
| `living_upkeep.js` | Compiles diets into ambient event rows (`upkeep@1`): reset, meal, hunger, death | Ambient simulation events | Gu keeper diets. Condition falls one step per missed meal; `lethal` opt-in |

### Gu as creatures (lifecycle hosts; Gu semantics owned by G)

| File | Lifecycle use | Bespoke content |
| --- | --- | --- |
| `gu_liquor_worm.js` | acquire, practice, cohort, transfer | Wine lure, familiarity |
| `gu_moonlight_stock.js`, `gu_keeper_moonlight_trial.js` | acquire, health, cohort, transfer | Loan stock, trial |
| `gu_keeper_colony.js`, `gu_colony.js` | acquire, health, injure, care; wild windows | Star firefly farm, ordinary-to-Gu emergence (G owns emergence) |
| `gu_army_ants.js`, `gu_keeper_ant_nest.js` | occupancy, cohort | Castes as species strings |
| `gu_hosted_wolf.js`, `gu_wolf_scouting.js`, `gu_wolf_ridge.js`, `gu_crown_flight.js` | acquire, injure, care, transfer | Lightning wolf host body, single-individual store |
| `gu_keeper_cooperation.js` | own store | Insight moth cohort |
| `gu_keeper_wild.js`, `gu_workshop.js` | restore only | Composition of the above |
| `gu_keeper_vitality.js`, `gu_vitality_grass.js` | none | A living plant Gu as a world fact string: grow leaf (15 min), harvest, treat |

### Pet

| File | Lifecycle use | Notes |
| --- | --- | --- |
| `absorb_p23/household/model.js` | Moss the house cat: doorstep cohort, practice (bond +10, `chase`), transfer into the home | Legacy bond migrates lazily. Self-fed through `needs.js` |

### People and the player body (not on the lifecycle)

Swept by a read-only sonnet agent; the file sizes, `household_brood` and affliction-catalogue claims were spot-checked.

| File | Stores | Time | Notes |
| --- | --- | --- | --- |
| `models/person.js`, `components/levelable_component.js` | Native `stats.full.health/stamina/max_*` and regen stats in the main save | Real-time regen ticks | Player vitals authority. Mirrored into `simulation.people[id].vitals` through `native_gameplay_adapter.js` (`publishNativeVitals`) with `hpToFull`/`staminaToFull` offsets. The ~215 `vitals` files are readers of that bridge |
| `simulation.js` `people[id]` | `{life, bornAt, vitals?, body?, lifePolicy?, lifeCause}` | Played minutes; old age ends a life at `bornAt + lifespan` | Generic over pack-declared people |
| `harm_state.js` (273), `harm_engine.js` | Save key `harm`: `backlash`, `parts{rung, cause, care}` with rungs shaken to dying | Pure, caller clock | Data-driven world rows; wired only for LOTM, tempo fight and combat UI |
| `affliction_track.js` (174), `affliction_catalogue.js` (66) | Track `{since, stage}` carried by the consumer; d20 stages | Pure, minutes (`DAY`, `WEEK`) | **Generic illness seam with no src consumer of its catalogue** (only `hp_companion_potions` uses tracks) |
| `active_effects.js`, `craft_dose_rules.js` (`craft.dose@1`) | Native timed effects incl. poison; tolerance and overdose ledger | Real time; dose per intake | B's side of dose, L's side of response is missing |
| `body_progression.js`, `body_figure.js` | Conditions `body.sore_hands`, `body.underfed`, `frail_frame` and others as simulation conditions | Per command, `expiresAt` | Bespoke to `base.frontier` |
| `status_care_*`, `book_care_*`, `field_care_*` | Short care conditions (`warmed`, `braced`, field venoms list) | Fixed 12-20 min durations | Three bespoke Village and Paradise modules sharing facts, not code |
| `aging_contact.js` + `chronicle.js` (351) | Wear from age 40, floors; `life{initialAge, lifespan, mode, endedAt}` | `GAME_YEAR` from minutes | Dialled per world, only `base.frontier` registered |
| `npc_lives.js` (86), `village_family.js`, `life_events*` | Village people `{birthYear, deathYear, parents, spouseId}`, pregnancies | Whole years, 270-day gestation | Bespoke: one household |
| `craft_body_treatment.js`, `home_medicine.js` | Body-bound treatment `{binding, conditioning, impurity, capacity, job}`; the manor copy for four NPCs as facts | Job `due` on the clock | `home_medicine` duplicates the player treatment for NPCs |
| `hp_companion_potions.js`, `hp_animal_features.js` | Patient affliction track; animal features with week stages | Minutes | Bespoke HP pack |

### Breeding and kin outside the lifecycle

| File | Stores | Notes |
| --- | --- | --- |
| `household_brood.js` (65) | Cloudseed beetles `{clock, roster, food, breeding, pair, births}`, incubation 60, maturity 120 | **A second creature breeding path that does not use `creature_lifecycle`** |
| `lineage_traits.js` (174), `lineage_domain.js` | Alleles per member, `breed()`, `phenotype()` | Generic genetics with 7 importers (cultivation root, village family, household brood). A better inheritance law than the lifecycle's coin flip, not wired to it |
| `companion_roster.js`, `companion_stage.js` | Bond stages `[0,1,3,6,10]`; roster a view over Lio's vitals | Bonds separate from lifecycle `experience.bond` |
| `heir_inheritance.js`, `family_tree.js` | Estate and reputation succession | Not a body; out of L scope except lineage edges |

### Plants and crops (no owner)

| File | Stores | Notes |
| --- | --- | --- |
| `management/shipping_farming.js`, `hired_hands_plot.js` | Actor facts `mg.cropStage` (planted, tended, ready), `mg.cropType` | One courtyard plot, two crops |
| `hp_brewing_state.js` | `fluxweedBed{parentLotId, plantedAt, readyAt}` | One HP bed |
| `gu_vitality_grass.js`, `gu_keeper_vitality.js` | JSON fact `{plant{kind, alive, leaves, injured}, grownAt, treatedAt}` | One Gu grass |
| `spoilage.js` | `PERISHABLES` (4 rows), pure | The only generic decay reader |
| `field_layer*`, `field_works*`, `planar_drying_field.js` | Material and fire levels, apparatus pulses | **Not living**: physical models. `field_layer_factory` hurts a person directly, a further injury path |

### Duplicates the foundation should fold

- **Injury, four owners:** `harm_state` parts, lifecycle `health.injury`, the Gu record's `injured` boolean, and native `takeDamage` plus `field_layer_factory` hazards. `affliction_track` also stages wounds.
- **Hunger, four forms:** `needs.js`, `body_progression` `UNDERFED`, ad-hoc hunger in `enemies.js`/`items.js`/`main.js`, and `household_brood.food`.
- **Breeding, three paths:** lifecycle broods, `household_brood`, and `village_family` with `lineage_traits` for people.
- **Life end, three owners:** `simulation.js` `lifePolicy`, `chronicle.js` `endedAt`, `npc_lives.js` `deathYear`; `harm_state` and `defeat_domain` each keep a death-cause list.
- **Age computed in five places:** `chronicle`, `life_experience`, `aging_contact`, `village_family`, `lineage_traits`.
- **Clocks:** played minutes (dominant), chronicle years, native calendar days, real-time native ticks, local module clocks (`household_brood`, `owned_place_clock`), and the Gu integer day (`fedThrough`).

## Grammar of parts for living things (draft for P)

A living thing is assembled from four parts plus a projection. Each part has one owner and its own clock (FG1 "read the creature in layers"). Canon creatures become catalogue rows that fill these parts; generated ones fill the same slots and must run through the same laws (PFP16).

| Part | Holds | Settled by | Canon test question |
| --- | --- | --- | --- |
| **Lineage** (kind and inheritance) | Kind row: body plan, diet, stages, lifespan band, reproduction roles (sexual, parthenogenetic, fission, budding, emergence), heritable traits with alleles or ranges, compatibility with other kinds. Individual: inherited potential, contributor per offspring, lineage edges | Conception or commitment boundary (world dial: conception, birth or another point) | Given two parents or a source, does the kind rebuild a canon offspring's traits? |
| **Body** (development and condition) | Stage (egg, juvenile, adult, elder, host body), size and mass, parts and attachments (grafts, implants, a hosted Gu), vitality, wounds (several, each with kind, site, required recovery), illnesses and poisons as courses with an onset and a response, needs by kind, temperature tolerance | Elapsed exposure and paid support to the next boundary (CR14) | Does a canon creature at a given age and care reach the source's stated size, stage or recovery? |
| **Environment fit** (habitat) | Supported conditions (humidity, temperature, light, essence where Gu), prey and supply dependencies, capacity use, what the body releases into the place (heat, noise, residue, light) | Place quantities from W, read at settlement | Does a canon habitat support or fail the kind for the source's stated reason (CR2)? |
| **Learned behavior** (experience) | Per actor: bond, training by skill with cue and context, fears and aversions, carried-forward lessons across development (CR7), context-gated extinction (CR8) | Practice events at their real time | Does a canon trained response survive the development or context change the source shows? |
| *Projection* (not stored) | What it can do now: capabilities with sources (`measureCreatureCapability`), work and heal multipliers from needs and wounds | Read on demand by care, work, combat, Gu activation | One cause read by many consumers without multiplying it (CR17) |

Combination rules to write (P contract, L's grammar):

- **G1 · Inheritance is a law per kind, not a coin flip per trait.** The current per-trait 50/50 draw is one rule; `lineage_traits.js` already has alleles and phenotype and is the likelier base; kinds may declare blending, dominance, mutation rate or no inheritance (emergent Gu). Contributors are per offspring (FG1-A), so a brood of several can have different sires.
- **G2 · Stages swap body parts, not identity** (CR1, CR6). A stage row changes diet, size, hazards, habitat needs and affordances; the individual id, lineage and learned history persist unless the stage row says a lesson is lost.
- **G3 · Afflictions are courses.** Start from the existing generic `affliction_track.js` rather than a new shape. Injury, illness and poison share one shape: onset, a dose or severity, a response curve that care, medicine (B) or the body's own heal multiplier moves, and an outcome (healed, chronic, scar, death with a dial). B owns dose composition; L owns the response (CR4).
- **G4 · Kinds are rows, hosts are consumers.** A Gu-as-creature is a kind row with `body: gu` and an essence need; its refinement, activation and uniqueness stay with G. A plant is a kind with no locomotion, growth in stages and yield as a harvest part. A person is a kind with lifespan, aging stages and learned behavior read by A.
- **G5 · Corpus fit (P5).** Weights for kind rows come from the source: the RI index for Gu-as-creature diets and habitats, the HP care texts for creature stages, real biology only as a contrast, never as a book fact.

## Quantities L reads and writes (request to W)

Proposed names; W decides the vocabulary in v0. Unit, clock and direction are what L needs. Essence semantics belong to G; L reads essence only as a body need of a Gu.

| Quantity | Unit | Clock | L | Current owner | Notes |
| --- | --- | --- | --- | --- | --- |
| `vitality` | 0..max per body | Played minutes, settled at boundaries | writes (bodies), reads (consumers) | none (only injury `remaining`) | The condition scalar every consumer projects from |
| `hunger` (need level by kind: food, water, essence, sleep) | fraction of ration, or minutes since meal | Played minutes at body rate | writes | `needs.js` (food only), `living_upkeep.js` | Supply comes from W stocks (hay, prey cohort, essence) |
| `food stock` / supply | item count or ration-minutes | per meal | reads and debits | inventory, host save | Prey cohorts already count as supply (`preyRequirements`) |
| `temperature` | degrees (world unit) | ambient process | reads (tolerance), writes (body heat released) | none for bodies; B and W for vessels | First emergence chain: brew heat warming a Gu |
| `humidity` | 0..100 | regulator minutes | reads | `living_regulator.js` (device state) | Move ownership of ambient humidity to W; device keeps its inlet |
| `light` (moonlight, starlight) | world unit | sky process (OS6) | reads (Gu habitat), writes (firefly brightness) | `gu_colony` literals | Third emergence chain: firefly colony attracts starlight feeders |
| `essence by kind` | Gu world unit | G's rates | reads as a Gu body need | G | L does not define it |
| `residue` (dose in tissue or crop) | mass by substance | per exposure | reads intake, writes uptake | none | Second chain: rinse water into a field into sheep |
| `occupancy` / capacity | count | per settlement | writes | `creature_lifecycle` habitat checks | Place owns capacity; L reports use |
| `noise`, `scent` | effect, not stock | per event | writes (published effects) | none | O3 contact: "the noise drew the wolf" |

## First readers of one lifecycle

Proposed order for the embed phase, cheapest first because they already share call shapes (`settleCohortStock`, `acquireCreature`, `transferCreature`, `creatureHealth`):

1. **Livestock:** `habitat_care.js` (sheep, ram, lamb, brood, injury and care). Most of the lifecycle API exercised; browser receipts exist.
2. **Pet:** `absorb_p23/household/model.js` (Moss: bond, practice, transfer into the home).
3. **Wild cohort:** `meadow_wildlife.js` (rabbit and fox windows), with `gu_colony.js` as the Gu-side wild cohort.
4. **Gu-as-creature:** `gu_moonlight_stock.js` (acquire, health, transfer) first, then `gu_liquor_worm.js` (adds practice).
5. **Player body:** second wave. Its authority is native `Person` stats mirrored into `simulation.people[].vitals` by offsets, with injury in `harm_state` and life end in `chronicle`. Moving it means a vitals authority decision with K and W (OS8 save contract), not a host swap. Before that, the person kinds (`human` body row, Village NPCs from `npc_lives`) can become catalogue rows that the player body reads later.

The embed for 1-4 is: one lifecycle store per save under one key, kind rows in a catalogue that replaces host species literals, hosts reduced to their place and law constants, then one task consumer reading the lifecycle through K's working.

## What the rules cannot express yet

- Multi-offspring broods and per-offspring contributors (FG1-A); the brood shape is two parents, one offspring.
- Rediscovery of a precommitted wild slot without minting a duplicate (FG1-B).
- Cross-store and cross-clock transfer: an animal moving between two host stores, or between a minute clock and a day clock (FG1-C).
- More than one injury at a time, injury that heals without active care, illness, poison, chronic conditions, scars.
- Death by age, lifespan, aging stages beyond `matureAt`.
- Needs other than food, and needs settled by the lifecycle rather than read by each host.
- Plants and crops as living kinds (growth stages, yield, uptake) on the same lifecycle.
- A body with attached living parts (host and hosted Gu, graft) settled atomically (CR12, the "hard case").
- Inheritance laws other than a per-trait coin flip; mutation; emergence as a lineage edge.

## Checks run

| Command | Result | Gaps |
| --- | --- | --- |
| `git merge --ff-only 9bbc51363` | worktree started at c25fd396d, behind the stated start; fast-forwarded cleanly | none |
| Read-only sonnet sweep of person, medicine, plant and kin modules | rows folded above; spot-checked `household_brood` (no lifecycle import), `affliction_catalogue` (0 src importers), fluxweed bed fields, file sizes | importer counts in the sweep are approximate |
| `grep` counts above | 19 hosts, 14 stores, 5 BODIES rows | counts are text-based; a host that builds the lifecycle by another name would be missed |
| Code changes | none, so no focused tests were needed | no data-only addition was made: the natural one (species rows in `needs.js` BODIES) is outside L's files |

## Next phase

Embed waits for K and W v0 on master. Then, in order: (1) a living-kind catalogue file owned by L with rows for the 10 or so species now hard-coded in hosts, plus the grammar fields above; (2) one shared lifecycle store per save and a migration line (MC4); (3) move the four first readers onto it and delete their species literals; (4) afflictions as courses (G3) on `affliction_track` with B's dose as input, and `household_brood` folded in; (5) one task consumer through K. Requests out: W for the quantity names above; G to confirm `body: gu` rows read essence as a need only; B for the dose shape L will read; `needs.js` owner (not in any chat's table yet) to fold BODIES into L's catalogue.

```receipt
build: n/a
route: n/a
state: drafted
viewport: n/a
persistence: unchanged
tests: docs only
review: diff-scoped
surface: living-things inventory, grammar draft and W quantity request; no runtime change
```

## Phase 2a: catalogue, one body read, aperture organ, substrate pack, care on the kernel (2026-11-12)

Started after merging master at ea6a170dd (K v0, W v0, P v0 and every phase-1 checkpoint). Rules applied: PFP1, PFP3, PFP10, PFP21 (section by mechanism), SC4 and SC7 (a Gu is rows on L's lifecycle under one identity), KW3, KW5, KW8, KW11, WSC1, WSC2, WSC7, CR4, CR17, FG1-A, BHR16, LVR13. Everything below is a proposal under AD56.

### What landed

| File | What it is | Answers |
| --- | --- | --- |
| `src/living_kinds.js` (new) | 18 kind rows for every species a host names today, plus `guLivingRows(catalogue)`, which turns each of G's 78 catalogue kinds into a gu-class body row. The catalogue is passed in, not imported (PFP10). `habitatFromKinds` builds a habitat's prey needs from kind rows (the fox row says it eats rabbits; the place says how many). | Done check (catalogue half), G's request ("L runs the body") |
| `src/living_body.js` (new) | `readLivingBody`: one read of vitality, hunger stage, injury, condition list, Gu feeding state (`fedThrough` against the day), organs, traits and learned behavior. `livingBodyFacts` gives the same read as `self.<name>` facts in W's `substrateFacts` shape. `applyBodyHarm` is the one door for C's hits and R's backlash (points become owed recovery minutes on the lifecycle). `apertureOrgan` reads a world pack's aperture law. | A's body read, C's CFC7 door, R's capacity facts and backlash inbox, SC table aperture |
| `src/creature_lifecycle.js` | Optional `organs` on each individual (key strings and whole numbers, defaults to empty on restore, so old saves load). `setCreatureOrgan`. `aggravateCreatureInjury`, so a second hurt worsens an open wound instead of being refused. | Aperture as a body organ, one wound slot that stacks |
| `src/world_substrate_packs/living_body.js` (new) | Pack `l.living_body`: every body tagged `living.body` carries `satiety` (ration-minutes), draining at its kind's whole food rate. For a body on the substrate, satiety is the hunger authority: `readLivingBody` takes `{amount, emptySince}` and gives the same stage a host's minutes-since-meal would (tested before and after the body runs empty), so this is not a fifth hunger form. It is unwired in live play. It publishes `living.hungry` once when a body runs empty, and keeps a `living.harm` inbox per body that the host drains through `applyBodyHarm`. | W embed, first L quantity and effects |
| `src/living_workings.js` (new) | `LIVING_CARE_LAW` (`l.care@1`: feed, tend) and `careRoutine`, a method row. Each step rereads the body at its own time. | "One task consumer reads it through the kernel" |
| `docs/AREA_GUIDE.md` | Care and upkeep entry names the new entry points and test (hunk only) | AR rule: update the guide when a seam's entry points change |

The handed-over `world_substrate_packs/shell_regulator.js` (pack `l.shell_regulator`, written by W) is unchanged; L now owns it.

### PFP2 counts, before and after

| Count | Before (9bbc51363) | After (this phase) | Note |
| --- | --- | --- | --- |
| Living kinds as identity rows | 0 | **96** (18 L rows + 78 Gu rows from G) | Each passes the registry. The Gu rows are as thin as G's own (G counts them as identity data, 7 runnable): label equals id, one stage, no ration, so a Gu's hunger reads `unknown` without the host's diet |
| Living kinds exercised by shared rules in tests | 0 | **6** (sheep, house cat, rabbit, fox, liquor worm, person) | Plus the reed construct in the substrate test |
| Living kinds read by live play through the new modules | 0 | **0** | No host calls them yet (phase 2b) |
| Body-data rows (`needs.js` BODIES) | 5 | 5 | Not L's file; folding it into kind rows is a request |
| Lifecycle host modules | 19 | 19 | No live host moved yet (phase 2b) |
| Separate live lifecycle stores | 14 | 14 | One store holding pet, ewe, ram, wild cohort, Gu and person is proven in `tests/living_foundation.test.js`, not yet in live saves |
| Bespoke breeding paths off the lifecycle | `household_brood`, `village_family` | same | Phase 2c |

### Plan done check for L, where it stands

- **Pet, livestock, wild cohort and Gu-as-creature all read one lifecycle:** met in a test fixture (one store, one identity counter, one body read, kind rows for each). Not met in live play: the 14 hosts still restore their own stores. Implemented, below floor (AD43).
- **Inheritance, development, learned behavior and condition change independently:** met in a test. A brood keeps the parents' traits; the mother's wound and lesson stay hers; the lamb is born with no lesson and no wound, and matures on its own clock.
- **One task consumer reads it through the kernel:** met in a test. The care routine quotes and settles to the same effects across a save and reload, and a change of keeper partway through leaves the feed step standing and refuses the tend step.

### Checks run

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/living_foundation.test.js tests/creature_lifecycle.test.js tests/habitat_care.test.js tests/needs.test.js tests/world_substrate.test.js tests/kernel_working.test.js tests/gu_colony.test.js tests/meadow_shell_state.test.js` | 67 pass, 0 fail | Focused only; the integrator runs the full `npm test` |
| After the placeholder and satiety fixes: `node --test tests/living_foundation.test.js tests/creature_lifecycle.test.js tests/habitat_care.test.js tests/world_substrate.test.js` | 40 pass, 0 fail | same |
| `npm run check:arch` | exit 0 (main.js unchanged, no new cycles) | none |
| `npm run check:rules` | exit 0 after rewording one reason string the player-text lint flagged | One pre-existing TMR1 warning in `book_world_hp_exams.js`, not mine |
| Browser | not run | Nothing player-facing changed; no host reads the new modules yet |

Save compatibility (MC4): **unchanged for live saves.** The lifecycle accepts an optional `organs` field and defaults it on restore. No new save key.

### Requests (for the coordinator to relay)

- **W:** promote `satiety` into `world_quantities.js` once A or M reads it (WSC2 says two packs first). Effect kinds `living.hungry` and `living.harm` are a first entry for the effect-kind list W's backlog names.
- **G:** add `insight-moth` (used by `gu_keeper_cooperation.js`) to `gu_catalogue` so its row comes from G. L's row is marked `placeholder` and gives way to G's row with the same id (tested), so adding it does not clash. Richer Gu body fields (label, stages, diet and ration per kind) on catalogue rows would make those 78 rows runnable bodies, not identity rows. Supply the aperture law for the Reverend Insanity pack (`rankCapacity`, `grades` with sea percent, `conditions`) as world-pack data; L's test uses a fixture of that shape, not canon numbers. When re-expressing the ten Keeper scenes, read Gu bodies through `readLivingBody` and pass the Gu record's `fedThrough` as `feeding`.
- **C:** land hits by publishing `living.harm` with `{target, kind, amount}`, or call `applyBodyHarm` directly at settlement. Either way the wound lands on the lifecycle, so care and work read it.
- **R:** aperture facts are `self.aperture.grade`, `self.aperture.rank`, `self.aperture.capacity` from `livingBodyFacts`. Backlash goes through `applyBodyHarm` with a kind such as `backlash`.
- **A:** `readLivingBody` is the body read you asked for; `livingBodyFacts` is the same read as facts. Pass `sinceMeal` and `ration` from the diet owner.
- **B:** a dose landing on a body is the next L piece (afflictions as courses on `affliction_track`, G3). Until then, a dose that hurts can use `applyBodyHarm`.
- **`needs.js` owner (unassigned):** a ration length for `human` and `gu` bodies. Today a person's or Gu's hunger reads `unknown` unless the host passes its diet's ration.

### What the rules still cannot express

- A live shared store: one lifecycle per save under one namespaced slice, with each host's record migrated in (phase 2b).
- More than one wound at a time (the slot stacks, it does not split by part or kind); illness and poison as courses; death by age.
- Satiety and the lifecycle are two records joined by the host. A body's satiety on the substrate and its wound on the lifecycle settle in the same host call, not in one atomic settlement.
- Plants have kind rows and a stage read, but their growth is still each host's timer (fluxweed bed, courtyard plot, vitality garden).
- Multi-offspring broods and per-offspring contributors (FG1-A) are unchanged.

### Next phase (2b, then 2c)

2b hazards to settle first: every host store starts at `nextIdentity: 1` (the sheep and Moss are both `creature:1`) and brood ids are `brood:<revision>`, so a merge needs a remap of `sheepId`, `ramId`, `lambId`, `broodId`, brood parents and household `creatureId`, or an explicit reset with a reason (old saves are disposable by standing direction; MC4 still wants the line). `absorb_p23/household/model.js` is not in L's file list, so 2b starts with the pen and the copse (one host) and asks the coordinator about the household file. The slice gets a schema id so a later move under W's `holders[id].state[packId]` is one migration step.

2b: one live lifecycle store per save through the domain registry (one new namespaced slice, AR1-AR16), with migrations that pull in the stores of `habitat_care` (livestock), `absorb_p23/household/model.js` (pet) and `meadow_wildlife` (wild cohort). The Gu hosts move when G re-expresses them (request above). Then hosts read species from kind rows and drop their literals, with a browser pass on the meadow pen and Moss at 1920×1080.

2c: afflictions as courses on `affliction_track` with B's dose; `household_brood` onto the lifecycle with `lineage_traits` as the alleles law; plant growth onto kind stages; PG1 people and creature generation on P's grammar once P publishes phase 2.

## MS1: creatures coverage ledger (2026-11-12)

Merged master at 2fff2285e ("Making all achievable": CV1-CV4, MS1-MS7, PFP25). Built `docs/coverage/creatures.jsonl` with `scripts/coverage_creatures.mjs` (deterministic, from `living_kinds.js` and G's `gu_catalogue.js`; `--check` fails when the ledger is stale). P's shared `check:coverage` and the README counts table are P's; this script only writes L's ledger.

| State | Rows | Rule used |
| --- | --- | --- |
| `runs-authored` | 18 | Every L kind row. The test "every L kind reads through one body read" puts one of each kind in one store and reads its class, first stage, grown stage and hunger source. Book kinds (lightning wolf, army ants, ordinary starlight firefly, fluxweed) are authored too, because no cited scene states their living values |
| `blocked:gu-body-fields` | 78 | Every Gu kind in G's catalogue. A Gu body runs only with a diet, ration and stage timing, and those are Keeper scene constants, not catalogue fields (G's GB7). The note names each kind's living roles |
| `runs-canon` | 0 | Nothing yet runs with source-backed living values |
| `not-a-thing` | 0 | Every catalogue Gu is a living Gu |
| `unclassified` | **0** | MS1 done for this ledger |

Correction: phase 2a's count of 17 L rows was wrong; there are 18 (the three army ant castes are three rows). Identity rows total 96.

Requests: **G**, unblocking GB7 (diet, ration minutes, stage minutes on catalogue rows) moves up to 78 rows from `blocked` to `runs-canon` or `runs-authored` with no L code. **P**, fold this ledger into the shared counts table and `check:coverage`.

| Command | Result | Gaps |
| --- | --- | --- |
| `node scripts/coverage_creatures.mjs` then `--check` | 96 rows, 0 unclassified, check passes | none |
| `node --test tests/living_foundation.test.js` | 7 pass | focused |

## MS5: the shared lifecycle in play, at the floor (2026-11-12)

Route: the Village meadow pen, desktop target 1920×1080 (UI priority: desktop first; mobile deferred). The pen already ran on `creature_lifecycle`. Now it also reads the ewe through the shared body read and the kind catalogue, and the copse takes its predator and prey link from kind rows.

| Change | File | What the player sees or meets |
| --- | --- | --- |
| The welfare line reads the ewe's projected vitality from `readLivingBody` | `src/habitat_care.js` | "Welfare: Safe in suitable shelter with clean water; she is weak." while the rescued ewe's cut is open, then "...she is in full health." once it heals. The bands (90, 60) are a Village dial |
| The injury line and the breeding gate read the wound from `readLivingBody` | `src/habitat_care.js` | "Let the ewe recover before breeding." now comes from the shared read (FLR4: a gate, not only a display) |
| The copse habitat is built by `habitatFromKinds` | `src/meadow_wildlife.js` | Same copse; the fox's prey now comes from the fox row, and the copse keeps its own number (3 rabbits per fox) |
| Proof asserts both welfare lines | `scripts/modular_seams_browser.cjs` (lifecycle block only) | |
| Regression | `tests/habitat_care.test.js` | Welfare weak at minute 100, vitality 91 with one of six minutes owed, full health at minute 106; the old exact welfare string updated |

Voice sample kept from the pen (PRS7): "Brush and inspect sheep."

### Floor (AD43)

| Line | State |
| --- | --- |
| FLR1 Build | Bundle SHA-256 `8ea62bea4eff1254d0d566be4dc3a95e7e6d26ea7dd6d8bdab9d42a6d427cc09`, built with `BUILD_OUT` in the session scratchpad |
| FLR2 Route | From a fresh life by earned steps in a headless Chrome at 1920×1080 (`PROOF_LIFECYCLE=1 node scripts/modular_seams_browser.cjs`). Gap: no yairpg-game MCP walk first. The Moss leg uses the script's named owned-Shack fixture |
| FLR3 Shown | The welfare line changes with the ewe's condition; the breeding refusal names the reason |
| FLR4 Used | The breeding gate reads the body read |
| FLR5 Kept | Save, reload, Export download and literal Import ran in the proof; the persisted meadow pen matched after each |
| FLR6 Labelled | Agent-verified, not human-reviewed. Route kind: earned walk plus a named fixture for Moss |

Receipt: [ms5_receipt.json](ms5_receipt.json) (summary; the full 1.2 MB receipt with synthetic saves stays in the scratchpad). Environment note: the worktree has no gitignored private fonts, so I copied three of them from the primary checkout into the scratchpad build only. The first run, before the copy, failed only on those 404s.

Save compatibility (MC4): **unchanged.** No save key changed; the lifecycle's optional `organs` defaults to empty.

### PFP2 after MS5

| Count | Before MS5 | After |
| --- | --- | --- |
| Living kinds read by live play through the new modules | 0 | **3** (sheep through the body read; rabbit and fox through `habitatFromKinds`) |
| Separate live lifecycle stores | 14 | 14 (a shared live store is 2b) |
| Coverage ledger | 96 rows, 0 unclassified | unchanged |

### Checks run

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/habitat_care.test.js tests/living_foundation.test.js tests/creature_lifecycle.test.js tests/meadow_shell_state.test.js` | 34 pass | Focused |
| `node --test tests/habitat_care.test.js tests/living_foundation.test.js` after the gate change | 21 pass | Focused |
| `npm run check:arch`, `npm run check:rules` | exit 0 | The one TMR1 warning is pre-existing (`book_world_hp_exams.js`) |
| Headless proof on the final bundle | exit 0, page errors 0, 404s 0 | No MCP walk |

`meadow_shell_state.js` was not touched (handed to W for this phase).

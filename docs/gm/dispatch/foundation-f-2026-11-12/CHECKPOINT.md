# Foundation F · Fabrication · checkpoint

*Chat F of the [procedural foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md). Phase 1 (inventory, before K and W v0). Started from 9bbc51363 on branch `claude/fdn-f-fabrication-44a523`. Everything below is evidence plus proposals under AD56; nothing here is accepted direction. Codes FBI (inventory), FBG (grammar parts), FBC (combination rules), FBQ (quantities), FBD (decisions), FBX (could not express) and FBN (next) are local to this chat and continue in later rounds. Rules applied: MR1-MR36, MR37-MR44 as prompts, AD38, AD51, AD56, PFP1-PFP20, MC2, MC4, MC9.*

```receipt
build: n/a
route: n/a
state: drafted
viewport: n/a (inventory, no UI)
persistence: unchanged
tests: 10 focused crafting, lineage, gear, amulet, salvage and transaction files, 108 pass, 0 fail, at 9bbc51363
review: none
```

## Status

- Phase 1 inventory: done (this file). No runtime code changed.
- Save compatibility (MC4): unchanged.
- Embedding waits for K and W v0 on master (MC2).

## PFP2 counts (2026-11-12)

How counted. A case **runs as data** when a row reaches play through code that names no world, item or scene. A **bespoke module** is a file whose logic exists for one named item, scene or world. A **world branch** is a line inside a shared fabrication file that names a world or item id; it counts against generality the same way.

| Count | Value | What |
| --- | --- | --- |
| Native recipe rows, generic `Recipe` classes (Village / `base.frontier`, original world) | **167** | crafting 24 items, 8 components, 18 equipment; cooking 27; smelting 9; forging 11 items, 13 components; alchemy 12; butchering 26; woodworking 14 items, 5 components. These are data rows, but quality, stats and joins run through the type-switched code in FBI2-FBI4 |
| Book-canon fabrication cases run as data through a generic law | **2** | Hogwarts practice pane (`hp.practice-pane` r1, refinement r2 with clear and wired glass); Cyoria formula carrier (`mol.formula-carrier`). Both in `book_craft_workings.js` on `craft_resolver` |
| Book-canon cases whose law is data but whose host is bespoke | **1** (3 variants) | Tingen silver amulet: `lotm.two-faced-inscription` law and `lotm.misfortune-amulet` recipe are data; `resolveAmuletInscription` hard-wires blank, offcut and marked materials and the step sequence. Standard, reversed and reworked amulets |
| Bespoke scene or item modules | **7** | `lotm_amulet_crafting`, `lotm_amulet_protection`, `artifact_refining` (ACS trace), `mistglass_artifact_refining`, `absorb_p23/salvage/salvage` (one leather vest), `absorb_p23/living_gear/index` (4 items), `material_apprentice` (Village mender) |
| World branches in shared fabrication files | **41 lines in 6 files** | `processed_materials` 24, `book_craft_workings` 5, `gear_work` 4, `gear_workshop_domain` 3, `book_craft_simulation` 3, `crafting_recipes` 2. The cores (`craft_resolver`, `craft_recipes`, `craft_materials`, `material_lineage`, `craft_working`, `making_procedure`, `durability`) have none |
| Uncounted | private pack | The LOTM cast pack's `pack.making` rows come from `private_packs/`, absent from this worktree |

Reproduce (from the worktree root):

```bash
node --input-type=module -e "import {loadNative} from './tests/helpers/native_loader.mjs'; const {recipes}=await loadNative('import \"./src/data/expedition_items.js\"; export {recipes} from \"./src/crafting_recipes.js\"; export {item_templates} from \"./src/items.js\";',{prefix:'fdnf-count-'}); let t=0; for(const [s,c] of Object.entries(recipes)) for(const [k,v] of Object.entries(c)){const n=Object.keys(v).length;t+=n;console.log(s,k,n);} console.log('total',t);" 2>/dev/null
```

```bash
grep -cE "'base\.frontier'|\"base\.frontier\"|book\.hp\.school\.world|MOL_IDS\.world|BRACE_ID|'Iron ingot'|'Lamp oil'|'Charcoal'|Tingen|Mistglass|MISTGLASS|TINGEN|AXE_HEADS|HANDLE_WOOD|MEDIUM_HANDLES|IRON_ORES" src/crafting_recipes.js src/crafting_component_filling.js src/gear_work.js src/gear_workshop_domain.js src/gear_component_lineage.js src/gear_dimensions.js src/processed_materials.js src/material_lineage.js src/craft_resolver.js src/craft_recipes.js src/craft_materials.js src/craft_working.js src/making_procedure.js src/book_craft_simulation.js src/book_craft_workings.js src/craft_state.js src/absorb_e2/durability.js
```

Target direction for later phases: the first and second rows rise, the bespoke and branch rows fall.

## 1. Inventory: every fabrication rule in code today

Two read-only sweeps (one per layer) plus direct reads. Data means a row or table read by generic code; bespoke means per-id or per-world code.

### FBI1 · Two parallel stacks

| Stack | Files | Shape |
| --- | --- | --- |
| Native (upstream-derived) | `crafting_recipes.js`, `crafting_component_filling.js`, `items.js` equipment classes, `gear_work.js`, `gear_workshop_domain.js`, `gear_component_lineage.js`, `gear_dimensions.js`, `gear_affixes.js`, `absorb_e2/durability.js` | Station recipes with success and quality formulas; components filled from a material table; equipment classes join fixed component slots |
| Procedural engine | `craft_materials`, `craft_recipes`, `craft_resolver`, `craft_working`, `craft_state`, `making_procedure`, `material_lineage`, `processed_materials`, plus leaf engines `craft_process_thermal`, `craft_process_separation`, `craft_agitation` | Catalogues with fraction and scalar axes, laws of ops, conversions and reactions, conserved composition, exact-lot lineage |

The bridge between them is `processed_materials.js` (lineage on native keys) and `gear_work.js` (treatments on native equipment). The bridge is where most world branches live.

### FBI2 · Recipes (inputs to outputs)

| Rule | Where | Kind |
| --- | --- | --- |
| Item, component, equipment recipe rows | `crafting_recipes.js` (154 literal rows), registrars `frontier_bow`, `fork_fort_content`, `absorb_c1/accessories`, `native_rendering_recipes` (loops over tables) | Data |
| Fuel slot `heat:` | `find_recipe_material` `crafting_recipes.js:326` | Bespoke branch |
| Brace amulet stats | `ComponentRecipe.getResult` `:191-195`, `BRACE_ID` | Bespoke branch |
| Rendering unlock override | `native_rendering_recipes.js` per instance | Bespoke |
| Success chance | `get_success_chance` `:70`, geometric between two rates by skill and station tier | Data formula, one for all |
| Quality range and caps | `get_quality_range` `:79`, caps `:45` | Data formula, one for all |
| Procedural laws | 14 `defineCraftLaw` specs: frontier brew, layered brew, conditioning tablet, slake; HP pane r1 and r2, HP potion reactions, companion potions, `hogwartsLaw`, lead-making; Cyoria formula carrier, `cyoriaLaw`; LOTM two-faced inscription, Seer brew | Data. Potion laws belong to B; F's are the pane, formula carrier and inscription |
| Named procedural recipes | `village.salt-steep`, `lotm.misfortune-amulet`, HP grit suspensions (generated), HP lead-making row, player-authored workings (`craft_working`, `craft_state`) | Data |
| Seeded discovery recipes | `generateRecipe` with `tonicGrammar`, `binderGrammar` (`craft_content_frontier`) | Data grammar, per seed |
| Artifact refinement | `artifact_refining.js`: rank-squared energy, chance and attack formulas in code | Bespoke |

### FBI3 · Joins and assembly

| Rule | Where | Kind |
| --- | --- | --- |
| Equipment from two components | `EquipmentRecipe.components` pair of type strings; `getResult` `:261-296` if-chain by item type (weapon head and handle, armor internal and external, shield base and handle) | Data slots, bespoke per class |
| Component class from result tags | `ComponentRecipe.getResult` `:178-199` | Bespoke per class |
| Add-on roles grip, lining, coating, setting | `GEAR_WORK_LAWS['base.frontier'].roles` `gear_work.js:19`; gates `:168-171` | Data table, bespoke gates |
| Socket needs iron ingot | `gear_work.js:175` | Bespoke id |
| Axe head plus handle with lot lineage | `processed_materials.js:43-106` (`AXE_HEADS`, `HANDLE_WOOD`, `MEDIUM_HANDLES`) | Bespoke maps |
| Procedural joins as reactions | `join-glass` (HP), `join-both-faces` (Tingen), `bind-fixative` | Data |
| Joint record (fit, constraint, capacity) | not found | Missing |

### FBI4 · Load, stats and weight

| Rule | Where | Kind |
| --- | --- | --- |
| Material property table (tier, weight, strength, toughness, warmth, handling) | `crafting_component_filling.js` `material_properties` | Data |
| Component stats by type | `fill_components` switch over short blade, long blade, axe, hammer, shield parts, interiors, exteriors, each with its own formula; inline shoe and glove special cases | Bespoke per type |
| Equipment totals | `items.js` `Equippable.getStats` `:595-780` | Generic over stat names, branches per stat category |
| Dimensions, toughness, wear scale | `gear_dimensions.js` | Data formulas |
| Affixes | `gear_affixes.js` rows | Data |
| Add-on contributions | `workContributions` `gear_work.js:66`, per role constants | Bespoke |
| Vessel load and batch ceiling | thermal and agitation `maxLoad`; `law.limits` | Data (B's vessels) |
| Structural load through an assembly | not found | Missing |

### FBI5 · Wear, durability and condition

| Rule | Where | Kind |
| --- | --- | --- |
| Condition 0-100 per instance, `wearPerHit` 0.04, `wearPerUse` by verb (mine, chop, dig, cut, fish) | `absorb_e2/durability.js:26` | Data |
| Wear scaled by material | `gear_dimensions.wearScale`, `items.js:546-563` | Data formula |
| Output scaled by condition, floors 0.1, 0.15, 0.15 | `durability.js` `bindFromKey` | Bespoke constants |
| Cold-soak extra wear | `gear_work.js:94` from `GEAR_WORK_LAWS.coldSoak` | Data, one world |
| Tool max condition and repair failure | `tools_domain.js`, `tool_profiles.repairRequirements` | Data |
| Corrosion by material class | `material_corrosion.js` (`CORRODES` rust, tarnish, rot) | Data, no fabrication caller |
| Living gear tempering by worn time | `absorb_p23/living_gear/index.js`, 4 ids | Bespoke |
| Amulet protection waning over a year | `lotm_amulet_protection.js` | Bespoke |

### FBI6 · Repair

| Rule | Where | Kind |
| --- | --- | --- |
| Workshop and field repair | `gear_work.js:252-264`: same material label full, same family half, `repairUnit` 20, field efficiency 0.5 | Data constants, bespoke compatibility rule |
| Tool hand repair | `tools_domain.js` | Data table |
| Village mender | `material_apprentice.js:14`, wrapped by `gear_workshop_domain.quoteRepairer` | Bespoke, one place |
| Glass repair | HP pane law | Data |
| Amulet rework | `lotm_amulet_crafting.js` rework command | Bespoke |

### FBI7 · Salvage, reclaim and remainders

| Rule | Where | Kind |
| --- | --- | --- |
| Component recovery on salvage or swap | `gear_work.js:241-268`: quality times condition times `salvageShare` 0.5; fittings return whole | Data constants, generic |
| Recovered-part history | `gear_component_lineage.js` | Data |
| Forge offcut, scale, slag, reclaimed ingot | `processed_materials.js:22-36`, `forgeAxeHeadOutputs`; `crafting_recipes.js:1225` reclaim row | Partition is data; the per-item maps are bespoke |
| Material partition with losses | `material_lineage.planMaterialPartition` | Data, generic |
| Leather vest dismantle | `absorb_p23/salvage/salvage.js` | Bespoke, one item |
| Fort unravel and recycle | `fork_fort_content.js` | Data rows |
| Worn loot recovery | `gear_acquisition.recoveredEquipmentLoot` | Data chance |
| Amulet practice scrap | `lotm_amulet_crafting.js` | Bespoke |

### FBI8 · Process steps and order

- Generic: `craft_resolver` ops with conversions, reactions (catalyst, `after`), directions and one thermal op per law; `craft_working` compiles player workings with versioned parts; `making_procedure` splits a timed command into agent steps.
- Leaf engines with no fabrication caller: `craft_process_thermal` (no src importer at all; B also flagged its stop and resume model), `craft_process_separation` (B's).
- Bespoke order: `gear_work` treatment stages cold, heated, shaped, quenched, tempered, with "hot" as a stage plus a `hotMinutes` window, not a temperature; Tingen's face sequence in `resolveAmuletInscription`.

## 2. FBD1 · `book_craft_transaction.js`: keep until embed, then delete

Evidence. Only `tests/craft_working.test.js:135` imports it. The live route for the same trials is `book_craft_simulation.js` (Hogwarts staged trial, Cyoria timed job), called from `main.js:6`. The transaction file calls `native.*` host hooks that nothing in `src` provides. It does hold the only craft code path that re-quotes at settlement and rejects a changed quote, and it rolls back materials, means and craft memory together through `beginNativeCraftTransaction`. Its test proves that.

Decision (proposal): do not wire a second runtime route to it now, and do not delete it in this phase. Hand its quote, re-quote, compare and atomic settle shape to K as a v0 input (note left in the shared folder). At embed, move the Hogwarts and Cyoria trials onto K's settle with the stale-quote check, move the rollback test into K's suite, and delete the file. Done check for the deletion: `grep -rn book_craft_transaction src tests` is empty and the moved test passes.

## 3. Fabrication grammar of parts (draft for P)

F writes this on P's contract once P publishes one; these are F's shapes for P to map. Brewed mixtures stay with B (BG1-BG8), living subjects with L.

| Code | Part | What it holds | Exists today as |
| --- | --- | --- | --- |
| FBG1 | **Material** | A world catalogue entry: fraction axes, scalar properties (hardness, toughness, density, purity), tags, phase, revision. Properties belong to the world (MR37), not the recipe | `craft_materials.defineCatalogue`; `material_properties`; native item ids |
| FBG2 | **Lot** | One exact holding of a material with amount in the world's conserved unit and lineage: family, born, origin world, quality, completeness, treatment, process history with inputs | `material_lineage` keys |
| FBG3 | **Step** | Verb, station or fixture, tool role, retained support (knife, wand), spent support (fuel, energy, spirituality), the state predicate it needs (hot, aligned, marked), the state it changes, duration, conversions and losses | `craft_resolver` ops; `gear_work` actions; `making_procedure` steps |
| FBG4 | **Part** | A made piece with a role in an arrangement (head, handle, blade, face, pane, bracket), its lot, shape, measured units and condition | native components; `gear_component_lineage` |
| FBG5 | **Join** | Parts bound by a method (socket, wedge, rivet, weld, lashing, inscription seam, charm join) with fit, constraint, the direction of demand it carries, its capacity and its failure modes | Missing as a record; implicit in `EquipmentRecipe` pairs and `join-*` reactions |
| FBG6 | **Arrangement** | A versioned topology of parts and joins: what carries load to what, support points, and the surfaces a use reads (edge, strike face, grip, inscribed face) | Missing; equipment classes hard-code head and handle |
| FBG7 | **Use profile** | What a consumer reads: attack, defence, tool power, protection, legibility, fragment retention, wear per use verb | `get_component_stats`, `gear_dimensions`, durability, amulet protection |
| FBG8 | **Remainder** | Offcut, slag, scale, practice scrap, recovered part: a lot with lineage, or a recorded loss | `planMaterialPartition` outputs and losses |

**Combination rules**, each a law the shared rules run, world numbers in packs:

- **FBC1 · Conservation.** Inputs equal products plus remainders plus recorded loss in the world's unit (MR5). Spent supports are costs outside the balance. Exists: `planMaterialPartition`.
- **FBC2 · Order through state.** A step runs when its predicate holds (hot, aligned, both faces marked), not because it is step N (MR17). Exists bespoke in `gear_work` and Tingen.
- **FBC3 · Properties flow by a declared rule.** A part takes its material's properties through the step's rule (mass-weighted, limiting or unmixed). A join's capacity is its own local limit for the demand direction, not the sum or the best part (considerations FG4-B).
- **FBC4 · Fit before capacity.** Parts join only when their interfaces fit (size, shape, tag); a misfit fails before any load is tested.
- **FBC5 · Load follows the arrangement.** Demand passes through joins to supports; the first part or join to reach its limit is where it fails (FG4-A, FG4-B).
- **FBC6 · Wear lands on the piece that carried it.** Each use adds wear to the part or join that took the demand, scaled by its material. Inspection reveals evidence, not truth (MR1).
- **FBC7 · Repair and salvage are steps.** Repair restores condition with real parts and work and keeps the instance; salvage partitions owned material into reusable lots, scrap and loss, and never turns borrowed parts into owned stock (FG4-D).
- **FBC8 · Canon is a point.** A canon recipe is one arrangement; a near miss is a nearby arrangement the same rules score lower (MR7, MR35, MR42).

**Canon test set** (held out for P's harness, proposal): Village iron and steel chopping axes, the Village forged and quenched dagger, the reclaimed iron ingot, the Tingen amulet, the Tingen back-first amulet, the Hogwarts practice pane. Given only materials and steps, the grammar should rebuild each product and its use profile.

**Ten recipes for the F done check** (re-expressed with no bespoke code at embed): iron chopping axe, steel chopping axe, iron axe head, steel axe head, medium handle, iron smelting with slag, reclaim forge offcuts, leather vest dismantle, Tingen amulet, Hogwarts practice pane. **A changed part that fails at a different point by the rules alone:** an incompatible handle fails at fit (FBC4); a compatible but weaker handle passes fit and fails at load (FBC5); a Tingen undersized offcut fails at conservation (FBC1); a missing knife fails at admission.

## 4. Quantities F reads and writes (for W)

Names follow what B, L and C already asked W for, so W keeps one vocabulary. Scope: thing, body or place. "Far" means it must settle the same in one jump or many.

| Code | Quantity | Unit | F reads or writes | Scope | Today's owner | Far |
| --- | --- | --- | --- | --- | --- | --- |
| FBQ1 | **Temperature** of a workpiece | degrees or world heat grade | writes (heat, quench), reads (shape, quench windows) | thing | `gear_work` stage plus `hotMinutes` window (a boolean, not a temperature); `craft_process_thermal` unused | yes: cooling over idle time |
| FBQ2 | **Ambient temperature** | same | reads (cooling rate, cold-soak wear) | place | `gear_work` `coldSoakNeed` takes it as an argument | yes |
| FBQ3 | **Heat released** | heat units | writes (forge, smelting) as an effect into the place | effect | `heat_grades.quoteHeat` spends fuel; nothing publishes it | no |
| FBQ4 | **Material amount** | world unit per lot (Village: 100 forge units per ingot) | reads and writes on every step | thing | `planMaterialPartition` | no |
| FBQ5 | **Load** on a part or join | force units per demand direction | reads per use and per test; writes nothing lasting except wear | thing | none; new | no |
| FBQ6 | **Condition (wear)** | 0-100 per instance | writes per use, repair and salvage; reads for output scaling | thing | `absorb_e2/durability` | yes: idle tool use accrues per cycle |
| FBQ7 | **Corrosion** by material class | condition loss | reads ambient humidity and exposure | thing | `material_corrosion` (no fabrication caller) | yes |
| FBQ8 | **Spent supports**: fuel, stamina, spirituality (Tingen), refining energy (ACS rank squared times 500) | per account | debits | body or thing | scattered per world | no |

- **Provenance is an attribute, not a quantity.** Every lot and quantity carries where it came from (O2 asks for "units and provenance"). F's existing carrier is the `material_lineage` key; W should accept it as the provenance field rather than a parallel one.
- FBQ8 should draw from C's proposed W3 accounts (stamina, essence by kind, focus) instead of per-world reserves.
- Custody (owned, borrowed, reserved) stays with inventory and K, not W.

## 5. MC9 · Second world: Lord of the Mysteries, Tingen amulet making

Default (proposal): the Tingen silver amulet workings (English v1 ch83) are F's second consumer besides the Village frontier and Hogwarts ones.

- It is the only book world whose fabrication already exercises the done check's hard part: off-route fixtures exist for reversed face order, completing too early, an undersized practice offcut and a missing knife or reserve, so "a changed part fails at a different point" can be tested on canon.
- It covers rules the Village axe does not: an inscription as a join (FBG5), a retained tool and a spent body reserve (FBQ8), a remainder that is practice scrap (FBG8), and wear as protection waning over a year (FBQ6).
- Its law and recipe are already data; the bespoke host (`resolveAmuletInscription`, `lotm_amulet_protection`) is the module the embed phase should delete.
- Klein's lead life is a paused consumer of these rows (MC5), so their tests gate the embed.
- Not chosen: Mistglass and ACS artifact refinement (an original world and a game trace, not book canon; they stay as a third consumer); `lotm_seer_brew` (B's); Gu refinement as making (G's second consumer for F under MC9, not F's pick).

## 6. FBX · What the rules could not express

- **FBX1 · Joins have no record.** No fit, constraint, capacity or failure mode exists per join; equipment classes hard-code slot pairs.
- **FBX2 · No load path.** Nothing carries demand through an assembly; FG4-A to FG4-C are paper only.
- **FBX3 · Heat is a stage plus a timer.** No workpiece temperature, so cooling cannot read ambient temperature or settle over idle time.
- **FBX4 · Component stats are per type.** `fill_components` writes one formula per component type instead of properties flowing by a declared rule (FBC3).
- **FBX5 · Wear is one number per item.** It cannot say which part or join carried the use (FBC6), so a weak join and a worn head look the same.
- **FBX6 · Two quality systems.** Native quality ranges and procedural composition never meet; the bridge is item-id maps in `processed_materials`.
- **FBX7 · Salvage per item.** The leather vest dismantle and the forge offcut maps are written per item rather than from the part and its condition.
- **FBX8 · Private pack rows uncounted.** `pack.making` is not in the worktree.

## 7. Requests to other chats

- **K:** take `book_craft_transaction`'s re-quote compare and atomic rollback across several owners into the v0 settle (FBD1). Agrees with B's ask for a stop that settles completed steps (a quenched blade interrupted mid-temper keeps the quench).
- **W:** FBQ1-FBQ8 with the names above; provenance as a field accepting lineage keys; heat released as a published effect.
- **P:** FBG1-FBG8, FBC1-FBC8 and the canon test set above.
- **G:** Gu refinement as making reads FBG3 steps and FBQ8 spent essence; living identity stays with G and L (MR41).

## 8. FBN · Next phase (after K and W v0 on master)

- **FBN1 · Join and arrangement records** in `gear_*` with the FG4-A and FG4-B paper cases as tests. Done check: a compatible stronger join moves the first failing point to the anchor (total load 12), and a misfit fails before load.
- **FBN2 · Re-express the ten recipes** through one assembly law; delete `absorb_p23/salvage/salvage.js` and the `processed_materials` item maps they replace. Done check: the PFP2 branch count falls from 41 and the ten recipes keep their saved keys or record a reset (MC4).
- **FBN3 · Tingen on the shared host.** Replace `resolveAmuletInscription` with the law plus an arrangement of two faces; protection waning reads FBQ6. Done check: the off-route fixtures pass unchanged and Klein's ch83 tests stay green.
- **FBN4 · Delete `book_craft_transaction.js`** per FBD1.

## Phase 2a · One fabrication law on K, Village rows as data (2026-11-12)

Merged master (K v0.1, W v0, P v0, every phase-1 checkpoint) into this branch first. Read the plan's sectioning (SC1-SC10, PFP21), separate-but-connected (SB1-SB6, NV1-NV5, EF1-EF8, PFP22-PFP24) and broad-systems sections, and every sibling checkpoint. Only one request names F: C's CB-4 (hits on items such as disarm have no item-side owner); recorded as FBX9 below.

**What landed**

- **`src/craft_assembly.js`**, one world-free fabrication law: partition processes that conserve a world's unit with a declared loss rule (per batch, per failed attempt, or the balance), joins that check fit before capacity (FBC4), load paths whose first limiting element fails (FBC5, beam and direct geometry, exact fractions), wear by carried share of capacity (FBC6), salvage by condition that refuses borrowed parts (FBC7), and a practiced working as input (SC8). The same operations run as one kernel law, `FABRICATION_LAW` (`f.fabrication@1`: `partition`, `join`, `load`, `refine`), so a making quotes and settles through `kernel_working` with each step rereading its bound thing.
- **`src/craft_assembly_village.js`**, the Village pack: families, the mining source, four processes (forge axe head with offcut and scale, medium handle, log preparation, iron smelting with slag and trapped metal), part interfaces and capacities, the hafting join and the two chopping-axe arrangements. **`src/craft_assembly_packs.js`** registers Village, Tingen (families, from `TINGEN_FABRICATION` in `lotm_amulet_crafting.js`) and Mistglass (family).
- **`src/processed_materials.js`** now reads the packs. Its `AXE_HEADS`, `HANDLE_WOOD`, `MEDIUM_HANDLES`, `IRON_ORES`, `CHOPPING_AXES` and `FAMILIES` maps, the per-function `world !== 'base.frontier'` gates and its direct Tingen and Mistglass imports are gone. Every export keeps its name and output.
- **Recipes re-expressed as data on the shared law, live in play:** 13 native recipes' material accounting (three axe heads, four medium handles, four prepared woods, two ingots), plus iron mining lots. Their native quality and stat formulas still come from `crafting_recipes.js` (FBX4).

**Save compatibility (MC4): unchanged.** A one-off byte comparison of the old and new `processed_materials` exports matched 71 of 71 cases: families for 23 ids, forge (three grades, two quality mixes, stale stock, mixed grades, another world), handles, logs, smelting success and failure, bad yield, gathering and lot pooling, error messages included. The old file was copied in temporarily for the comparison and removed; the script stays outside the repo.

**A changed part fails at a different point by the rules alone** (`tests/craft_assembly.test.js`). One method (forge, haft, test under load 20) run as a kernel working: a hickory handle completes; a simple handle fits and gives way at the load step; a short-tang handle swapped in before the join stops at the join, and the forged head and offcut stand. FG4-A and FG4-B: reactions 2 and 6; a stronger seat moves the first limit to the anchor at total 12, not 13 1/3. FG4-D: 10 units at condition 70 give 7 reusable, 2 scrap, 1 loss. One jump, steps every 7 minutes and save and reload mid-run give the same record and effects (KW5, KW7).

**SC8 for G.** A `refine` step binds a role of kind `working` and reads the bound record: it refuses an unfinished method or one practiced fewer times than the row's `minPractice`, and publishes `fabrication.refined` otherwise. G's move-to-Gu rows can be pack rows of this shape (`{id, method, minPractice, product}`); the Gu law keeps what the refined Gu is.

**PFP2, before and after**

| Count | Before | After |
| --- | --- | --- |
| Native recipe rows on shared classes | 167 | 167 |
| Native recipes whose material accounting runs from pack rows on the shared law | 0 | 13 grade variants of 4 process rows (corrected in 2b: see the ten-recipe table there) |
| Book-canon cases as data through a shared law | 2 | 2 |
| Bespoke scene or item modules | 7 | 7 |
| World branch lines in shared fabrication files | 41 in 6 files | **19 in 6 files** (`processed_materials` 24 to 2, both in the harvest adapter's fixed world id); `craft_assembly.js` has none |

**Phase 2a checks**

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/craft_assembly.test.js` | 8 pass | New file |
| 15 focused files: assembly, processed materials, lineage, native craft transaction, interaction native, gear workshop, amulet crafting and protection, artifact refining, craft working, salvage, craft engine, kernel working, material inspector, distinct world paths | 144 pass, 0 fail | |
| Paused lead-life and LOTM cast (MC5): `book_world_lotm_cast`, `lotm_cast_energy_act`, `lotm_cast_tier`, `lotm_cast_week`, `gu_lead_life`, `hp_lead_life`, plus alloy, accessory and living gear | 141 pass, 0 fail | |
| Byte parity script (scratchpad, old versus new) | 71/71 identical | One-off; covered going forward by `processed_materials.test.js` |
| `npm run check:arch` | pass, main.js growth -1 | |
| `npm run check:rules` | pass; existing HP time-rule warning | |
| Browser | not run | No player-visible change: same keys, same grants. Implemented, below floor (AD43) for the new law, which has no player route yet |

**More the rules could not express**

- **FBX9 · Hits on items** (C's CB-4): disarm, sundering and corrosion from a blow have no item-side owner. Proposal: a blow is a demand on the arrangement through `carryLoad`, and wear lands by FBC6; disarm is a custody change, not F's.
- **FBX10 · Live wear is still one number.** `durability.js` keeps one condition per item; `wearFromUse` per element has no live caller yet.

**Next (phase 2b onward)**

- Retire one making stack: move the `processed_materials` adapters' callers onto `FABRICATION_LAW` records through the native craft transaction, so the native forge and the procedural engine share one settle.
- Tingen on the shared host (FBN3): two faces as joins, protection waning on FBQ6; delete `resolveAmuletInscription`'s hard-wired materials.
- Leather vest dismantle and gear salvage onto `planSalvage` rows; delete `absorb_p23/salvage/salvage.js`.
- `book_craft_transaction.js` per FBD1, once the Hogwarts and Cyoria trials settle through K.
- Fabrication grammar on P's contract with the canon test set, then NV1 and NV4 objects through the five checks.

## Phase 2b · Derived capacities, declared practice, play proof (2026-11-12)

**What changed**

- **One authority for material strength.** The native component material table (component types, the weapon and armour part lists and `material_properties`) moved verbatim from `crafting_component_filling.js` into `src/component_materials.js` (structural move, AR9 and AR10: no behavior change). All 874 item templates hash the same before and after the move. The Village pack's parts now name their material (`iron`, `hickory`, ...) and take `capacity` from that row by `CAPACITY_RULE` (mean of strength and toughness, times tier, times `perTier` 0.1), with `wearScale` from `gear_dimensions`. No capacity is typed per item. The hafting join's capacity (30) stays a fixture number: joins have no material row yet.
- **SC8 practice is declared by the row.** `practicedWorkingFits` reads practice the way the row says: by default the count of completed performances of the method, each its own kernel record (`{from: 'runs'}`), or a fact a performance writes (`{from: 'fact', name}`). Not done for G yet: no G move record is the bound input in a test. Request below.

**The ten recipes in FBN2, honestly**

"Re-expressed" here means the recipe's material accounting (what is consumed, what is made, remainders and loss, lineage) and its assembly rows. Native quality and stat formulas stay in `crafting_recipes.js` and `crafting_component_filling.js` for now (FBX4). Reason: those formulas feed every equipment number in play, and changing them is a balance change for Weibao to see, not a foundation refactor.

| Recipe | State |
| --- | --- |
| Iron axe head, steel axe head | On the shared law, live (`forge.axe_head`) |
| Medium handle (four woods) | On the shared law, live (`woodworking.medium-handle`) |
| Iron smelting with slag | On the shared law, live (`smelting.iron`) |
| Iron and steel chopping axes | Family and arrangement rows in the pack; fit and load run in tests through K; no live caller (assembly still the native `EquipmentRecipe`) |
| Reclaim forge offcuts | Native data row on the native class, not on the law |
| Leather vest dismantle | Bespoke (`absorb_p23/salvage/salvage.js`), untouched |
| Tingen amulet | Family row only; bespoke host |
| Hogwarts practice pane | Data on `craft_resolver`, not on this law |

So 4 of 10 run live on the shared law, 2 have unwired rows, 4 are untouched. Done check item (2) is not met yet.

**Play evidence (AD43, PFP8).** Rebuilt to a scratch `BUILD_OUT` (tracked `dist/` untouched), served it on localhost and ran the existing headless drivers from the procedural-crafting dispatch folder at 1920x1080. All three passed on bundle `13fed22bffc1998b`, with no page errors, each with native Save, reload, Export and literal-file Import. Receipts are in [receipts/](receipts/), not `/tmp` (review F5).

```receipt
build: 13fed22bffc1998b
route: fixture(cave and skill admission, pickaxe, fuel, handles or a steel axe; twenty ingots for the forge route)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 8 assembly tests; 74 gear, crafting and material tests after the structural move
review: none
surface: processed_materials on craft_assembly packs; component_materials split
```

| Driver | What it plays | Receipt |
| --- | --- | --- |
| `mine-axe-browser.cjs` | Mine iron, smelt four ingot lots, forge a head, assemble, equip, chop | [village-mined-axe.json](receipts/village-mined-axe.json) |
| `mine-axe-browser.cjs` with `NATIVE_HANDLE=1` | The same with handles cut from harvested wood | [village-mined-axe-native-handle.json](receipts/village-mined-axe-native-handle.json) |
| `forge-browser.cjs` | Forge heads with offcuts and scale, assemble, reclaim offcuts to an ingot, equip | [village-forged-axe.json](receipts/village-forged-axe.json) |

Agent-verified, not human-reviewed.

**PFP2, before and after 2b**

| Count | Before | After |
| --- | --- | --- |
| Ten-recipe set on the shared law, live | 4 | 4 |
| Per-item typed capacities | 7 | 0 (derived from the material table) |
| World branch lines in shared fabrication files | 19 | 19 |
| Bespoke scene or item modules | 7 | 7 |

**Rescope of "retire one stack" (reason).** Retiring the 167-row native station classes is not phase-sized and would change every equipment number. The finishable move that leaves one settle path is the one FBD1 already names: move the Hogwarts pane and Cyoria trials onto a kernel law built from `book_craft_workings`, keep the stale-quote check and the rollback test, delete `book_craft_transaction.js` and the parallel settle in `book_craft_simulation.js`, and route the native forge and smelt partitions through `FABRICATION_LAW` records inside the native craft transaction. That is phase 2c. Tingen on the shared host follows (its off-route fixtures are the canon proof of the changed-part check), and vest salvage comes last.

**Phase 2b checks**

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/craft_assembly.test.js` | 8 pass | |
| 10 gear, crafting and material files (dimensions, workshop, processed materials, alloy, interaction native, crafting runtime, affixes, cohort gear, material vocabulary, assembly) | 74 pass | |
| Item template hash before and after the material table move | 874 templates, identical hash | One-off script in scratchpad |
| `npm run check:arch` | pass, main.js growth -1 | |
| `npm run check:rule-routes -- --message` | runtime-code and making-systems areas touched; codes cited in the commit | |
| `npm run check:rules` | pass after a follow-up commit; 7ed85b926 itself failed the player-text lint on the word "fixture" in the capacity reason string | |
| Three headless browser drivers on the rebuilt bundle | 3 PASS | Fixture admission as each driver states |

## Milestones MS1-MS7: where F stands (2026-11-12, master 2fff2285e and later, merged as 11737bfa2)

- **MS5 · Works in play: met for F, agent-verified.** The phase 2b receipts are one reachable making route at the AD43 floor: mine, smelt, forge a head with offcut and scale, assemble, equip and chop, plus forge-and-reclaim. Each has native Save, reload, Export and literal Import, headless at 1920x1080 ([receipts/](receipts/)). Two limits: each driver grants admission and starting tools as its receipt states, and the bundle `13fed22bffc1998b` predates this merge. The combined browser pass belongs to the integrator and E.
- **GL3 · Composition: not started on P's contract.** F's recipes and assemblies are composition. The canon test set is listed in section 3. It cannot run as a P grammar until nested parts (GL6, P's PGB2) ship; P v0 on master has no nested slot yet. Meanwhile composition runs through K: `FABRICATION_LAW` methods bind parts to roles in order, and fit and load decide the outcome (`tests/craft_assembly.test.js`). When GL6 lands, the held-out rebuild is: given materials, parts and joins, rebuild the axe heads, handles, smelting, both chopping axes, the Tingen amulet in both face orders and the Hogwarts pane, and run each through K.
- **SC8 feeds G's MS4.** F's `refine` step takes a practiced working as input (by completed runs or a declared fact). It closes when a G move record is the bound input (request to G below).
- **MS1 ledgers.** CV3 lists no fabrication corpus. Proposal, for the coordinator to accept or drop: a `docs/coverage/fabrication.jsonl` with one row per native recipe (167) and per book-canon made thing (pane, formula carrier, Tingen amulet variants), using the CV2 states, so the ten-recipe count above becomes the `runs` share.
- **Merge check:** 9 focused files, 85 pass after the merge.

## Requests (relayed by the coordinator)

- **G:** which record shape is a practiced move? F's `refine` step reads either completed kernel working records of the move's method (default) or a fact a performance writes. A G move record as the bound input closes SC8 for both of us. Your move-to-Gu rows can then be F pack rows `{id, method, minPractice, practice, product}`; the Gu law keeps what the refined Gu is.
- **K:** FBD1 still stands: F will move the Hogwarts and Cyoria trials onto a kernel law and needs the stale-quote compare (KB9 territory) or will keep it in F's host if K prefers.
- **C:** FBX9: a blow on an item can be a demand through `carryLoad` with wear landing by `wearFromUse`; disarm is custody, not F's.
- **W:** FBQ5 load and FBQ6 condition per element are now computed by F's law (`carryLoad`, `wearFromUse`); F keeps them as thing state until W wants them as quantities.

## Checks

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test --test-reporter=tap tests/material_lineage.test.js tests/craft_working.test.js tests/gear_workshop.test.js tests/lotm_amulet_crafting.test.js tests/lotm_amulet_protection.test.js tests/salvage.test.js tests/processed_materials.test.js tests/craft_engine.test.js tests/native_craft_transaction.test.js tests/artifact_refining.test.js` | 108 pass, 0 fail | Baseline only; nothing changed |
| Native recipe count (command above) | 167 rows | Counts registry keys after native load, not registrars called later at runtime |
| World branch count (command above) | 41 lines in 6 files | Pattern list is fixed; a new id outside it is missed |

# Family: process crafts (Wave 12)

*Proposal throughout (AD32), 2026-11-12. Branch `codex/w12-process`. Forging, tempering, brewing, cooking, refining, distilling, firing and curing, read as one mechanism (PC98). Engine first (PC95): proven in `tests/process_law.test.js` and the headless engine world, with no game wiring. Codes here are local: PCF findings, PCD decisions, PCR risks, PCN next.*

## The mechanism (PCD1-PCD6)

- **PCD1 · A workpiece is state, a craft is a path of exposures.** `src/process_law.js` is one kernel working law, `f.process`, with two operations: `hold` (a piece sits in a medium for some minutes) and `work` (the same, while a tool delivers work). Forge, quench, temper, bake and scorch are pack methods built from those two with different media and tools. The law names no quantity and no world.
- **PCD2 · State is the piece's structure and scalars.** `shares` are conserved parts of the whole (the fixture's steel pack calls them soft, hot, hard, tempered; the kitchen pack raw, cooked, charred). `scalars` are free quantities (grain, moisture). Temperature follows the medium in closed form. The `path` of settled steps is kept with the piece and is part of the result.
- **PCD3 · Change comes from rows, by time in a temperature band.** A pack row moves a share to another share, or drifts a scalar toward a target, with a relaxation time, while the piece is inside the row's band. A row may need something present (in the medium, the shares or the scalars) and may be driven by a tool property. Rows that draw on one source compete by rate. So quench speed is nothing but minutes spent in the band where hot structure softens: 0.07 in water, 0.99 in oil, 9.9 in still air.
- **PCD4 · Nothing is refused for being unwise.** A wrong order, a weak tool, a cool fire or a slow medium settles with a different state, and each row that stood still says why ("nothing of hard present", "no drive", the unmet need). Checks fail on malformed data alone. Ways around are other rows of the same data: a slower medium, a weaker tool for longer, a rescue method started from an interrupted piece, or a different path that reaches the same properties (straight from the forge into a low oven hardens and tempers in one hold).
- **PCD5 · Other laws read projected properties (PC70).** A pack projection turns state into outward properties as weighted sums. On a method's last step they land on the piece's holder as whole-level `property` ops, the world substrate's own shape. `src/load_law.js` is a separate 21-line reader that compares any thing's properties with a force and a shock; neither file imports the other.
- **PCD6 · Brewing and forging: one kernel shape, two laws, for now.** The brew law keeps a conserved ledger of many lots moving between buckets (extensive amounts, doses, film, vapor). A workpiece is one body whose internal state moves (intensive). Forcing either into the other would add a mode switch to both. They share the kernel working, receipts, save record and the closed-form thermal idea. The overlap that can fold later is listed below; the honest merge point is brew's `heat` and `cool`, which are exposures of the batch to a medium.

## What the fixture proves

| Point | Test | Evidence |
| --- | --- | --- |
| 1 Forge, quench, temper | test 1 | Tempered: hardness 76.8, toughness 76.8. Untempered: 97.6 and 14.3. Under force 40, shock 50 the tempered piece holds and the untempered one breaks |
| 2 Order matters, with cause | test 2 | Temper first on cold stock: 39.9 minutes in band, moved 0, reason "nothing of hard present"; the piece ends as the untempered one and breaks. Forge then straight to the low oven: 75.3 and 75.9, holds |
| 3 A way around | test 3 | Oil gives hardness 71.8, air 30.4, each completes, with band minutes as the cause. A quarter-impact stone reaches the hammer's grain in four times the minutes |
| 4 Not forging alone | test 4 | The kitchen pack on the same law: baked nourishment 117.7; baked then scorched 0.5, cause "Excess heat chars the cooked portion" |
| 5 Another law reads it | test 5 | One `applyLoad` call reads four processed pieces and one plain thing with no process behind it |
| 6 One settlement or several, save and restore | test 6 | Settled once and minute by minute: deep-equal records and effects. Restored mid-method: same final record. In the engine world, settled at each deadline on the world clock, landed, saved and restored: properties read back equal |

Also: an interrupted quench keeps its piece and a fresh method tempers it to the same state as the uninterrupted run.

## What it could absorb later (not done; PC94)

| Existing | How it would be expressed | What stays with its owner |
| --- | --- | --- |
| `gear_work.js` heat, hot work, quench, temper stages (authored stage changes) | Pack methods on `hold` and `work`; first parity candidate | Stock costs, equipment identity, stat landing |
| `craft_process_thermal.js` extraction and degradation windows | Two band rows | Apparatus quoting, paid fuel, yield accounting |
| `craft_agitation.js` | Tool-driven rows | Its own suspension and air quantities, until read |
| Brew `heat` and `cool` | Exposure of the batch to a medium | Lot ledger, fuel, steam publication |
| Native cooking, smelting and forging recipe classes (FBI1) | Methods plus rows per material | Recipe discovery, station UI |

## Risks and next (PCR, PCN)

- **PCR1 · Chained rows are sliced, not solved exactly.** A row fed by another row in the same segment is integrated in up to 256 slices (dial `MAX_SLICES`). Single rows and competing rows stay exact. Lead fix after review; the first version made a fed row wait for the next band crossing, which made an order test pass for the wrong reason.
- **PCR2 · Landed properties are rounded to whole levels**, because the substrate's `level` type holds whole numbers. The pack's weights choose the unit. The exact state stays in the working's facts.
- **PCR3 · Fuel, vessel capacity and the maker's skill are not in this law yet.** Media are bound things with a temperature; nothing is spent to keep a forge hot. Fold (layer count) and aging over days are also absent, here and in the census.
- **PCR4 · Engine-only.** No game route, build, browser or full-suite evidence. Agent-verified, not human-reviewed.
- **PCN1** Parity fixture for `gear_work.js` stages (moves G5). **PCN2** Fuel and maker control as needs and drives. **PCN3** A refining pack where flux in the medium is the need. **PCN4** Pace (PC99) multiplying a holder's delivered work.

## Census of Making (2026-11-12)

Scope is the 71 matching files directly under `src/`, as specified by the brief. No `forge*` or `assembly*` files exist there. Header comments and exports supply the inventory descriptions. Step entries describe causal behavior or pack rows, with projections and adapters marked `none`. Reachability was checked per file with `node scripts/reachable.mjs --is src/<file>`.

| File | What it does (one line) | Shape | On kernel | Process steps | Game loads |
| --- | --- | --- | --- | --- | --- |
| `craft_agitation.js` | Moves mixing, suspension, air and damage by delivered agitation | process | no | stir, work | yes |
| `craft_assembly.js` | Plans conserved partitions, fitted joins, loads, wear and salvage | process | kernel | work | yes |
| `craft_assembly_packs.js` | Registers the fabrication content packs | data | no | none | yes |
| `craft_assembly_village.js` | Supplies frontier fabrication materials and process rows | data | no | none | yes |
| `craft_batch_goal.js` | Keeps a display intent for native craft batches | state owner | no | none | yes |
| `craft_body_treatment.js` | Retains body conditioning and medicinal residue | process | no | none | yes |
| `craft_content_frontier.js` | Supplies original material, recipe and reaction data | data | no | heat, grind | yes |
| `craft_cues.js` | Projects expertise-dependent process cues | view | no | none | yes |
| `craft_depth_domain.js` | Owns dose and experiment-log save slices | state owner | no | none | yes |
| `craft_dose_rules.js` | Resolves dose tolerance, cancellation and overdose | process | no | none | yes |
| `craft_experiment_log.js` | Keeps trials and deduces from observed evidence | state owner | no | none | yes |
| `craft_failure_ledger.js` | Records failed batches and forecasts from that record | state owner | no | none | yes |
| `craft_grudge.js` | Charges spoiled-steep consequences through obligations | helper | no | none | yes |
| `craft_ingredient_selection.js` | Compares observer-projected ingredient choices | view | no | none | yes |
| `craft_item_name.js` | Formats and parses composition and process names | helper | no | none | yes |
| `craft_ledger_domain.js` | Owns the native craft-failure ledger adapter | state owner | no | none | yes |
| `craft_material_fit.js` | Grades material properties against authored profiles | helper | no | none | yes |
| `craft_materials.js` | Defines catalogues, property queries and seeded materials | helper | no | none | yes |
| `craft_process_cues.js` | Projects process knowledge, rescue and repeat plans | view | no | none | no |
| `craft_process_separation.js` | Moves constituents through separation, contact and exposure | process | no | separate, dry | yes |
| `craft_process_thermal.js` | Settles thermal residence, extraction and degradation | process | no | heat, cool | yes |
| `craft_product_registry.js` | Routes product keys to their truth owners | helper | no | none | yes |
| `craft_recipes.js` | Defines and matches recipe roles and generated recipes | helper | no | none | yes |
| `craft_reference.js` | Plans reference access, learning and demonstrated repeats | helper | no | none | yes |
| `craft_reference_content.js` | Supplies carried frontier method references | data | no | none | yes |
| `craft_resolver.js` | Resolves ordered conversions and conserved reactions | process | no | heat, grind | yes |
| `craft_sources.js` | Resolves gathering, depletion and regrowth | process | no | none | yes |
| `craft_state.js` | Owns frozen materials, products and observer knowledge | state owner | no | none | yes |
| `craft_working.js` | Compiles saved verbs and material-role allocations | helper | no | none | yes |
| `crafting_component_filling.js` | Constructs native component templates and stats | data | no | none | yes |
| `crafting_detail.js` | Renders the selected craft and its requirements | view | no | none | yes |
| `crafting_domain.js` | Routes native craft commands to their operation owner | state owner | no | none | yes |
| `crafting_frontier_runtime.js` | Plans frontier gathering, batches, doses and firing | scene | no | heat | yes |
| `crafting_home.js` | Builds the crafting workspace shell | view | no | none | yes |
| `crafting_native_items.js` | Registers native generated-material and product carriers | helper | no | none | yes |
| `crafting_recipes.js` | Defines native recipes, matching and quality calculations | recipe table | no | none | yes |
| `crafting_selection_detail.js` | Renders native part and material inspection | view | no | none | yes |
| `crafting_visibility.js` | Projects recipe availability and makeability | view | no | none | yes |
| `gear_acquisition.js` | Freezes generated equipment truth at acquisition | helper | no | none | yes |
| `gear_affixes.js` | Defines affix data, generation and stat contributions | helper | no | none | yes |
| `gear_component_lineage.js` | Retains and replaces component inventory keys | helper | no | none | yes |
| `gear_dimensions.js` | Calculates material, armor and wear dimensions | helper | no | none | yes |
| `gear_item_facts.js` | Projects native tooltip facts | view | no | none | yes |
| `gear_native_content.js` | Registers original frontier gear material content | data | no | none | yes |
| `gear_work.js` | Plans native hot working, treatment and finishing | process | no | heat, work, quench | yes |
| `gear_workshop_domain.js` | Owns native workshop quotes and transactions | state owner | no | none | yes |
| `gear_workshop_panel.js` | Renders native workshop controls | view | no | none | yes |
| `lineage_domain.js` | Owns the inherited-traits save slice and tests | state owner | no | none | yes |
| `lineage_traits.js` | Models alleles, kinship, offspring and inheritance | helper | no | none | yes |
| `material_apprentice.js` | Plans original local repair-work actions | scene | no | work | yes |
| `material_choice_view.js` | Renders exact-key native material selection | view | no | none | yes |
| `material_corrosion.js` | Resolves property-driven corrosion damage | process | no | none | no |
| `material_insights.js` | Projects bounded material and encounter inferences | view | no | none | yes |
| `material_inspector.js` | Explains observer-projected material evidence | view | no | none | yes |
| `material_lineage.js` | Plans processed cohorts, splits, merges and heirlooms | helper | no | none | yes |
| `material_lineage_domain.js` | Validates lineage envelopes on native inventory keys | helper | no | none | yes |
| `material_treatment.js` | Plans original hide preparations with retained treatment | process | no | none | yes |
| `mixture_destinations.js` | Projects alternative native mixture destinations | view | no | none | yes |
| `mixture_discovery.js` | Projects observed vials and learned effects | view | no | none | yes |
| `mixture_feedback.js` | Projects stock, requirements and retained outcomes | view | no | none | yes |
| `mixture_native.js` | Plans and commits native mixture transactions | helper | no | none | yes |
| `mixture_rules.js` | Defines the original seeded frontier mixture law | scene | no | none | yes |
| `mixture_state.js` | Owns retained mixture products and exposures | state owner | no | none | yes |
| `mixture_ui.js` | Renders the native mixture counter | view | no | none | yes |
| `vessel_forks.js` | Allocates practice among retained attention patterns | process | no | none | yes |
| `vessel_forks_ui.js` | Renders attention-pattern practice controls | view | no | none | yes |
| `vessel_geometry.js` | Arranges existing circulation nodes and projects bonuses | helper | no | none | yes |
| `vessel_geometry_ui.js` | Renders circulation-node arrangement | view | no | none | yes |
| `vessel_mantras.js` | Composes practice patterns from understood laws | helper | no | none | yes |
| `vessel_thread.js` | Retains a body-bound paid preparation on equipment | helper | no | none | yes |
| `vessel_thread_domain.js` | Connects named equipment to retained preparation | state owner | no | none | yes |

Total files: 71.

Process files: 12.

Game loads: 69 reachable, 2 unreachable (`craft_process_cues.js`, `material_corrosion.js`).

Kernel use: `craft_assembly.js` imports `kernel_working.js`; no matching file imports `craft_working.js`.

Steps present: heat, quench, cool, work, grind, stir, separate, dry; absent as causal craft steps: fold, cure and age. Hide preparation retains a smoke/oil treatment and quality shift, without curing kinetics. Material lineage retains birth times and age-based heirloom value, without an aging craft step. Temper is present in `gear_work.js`, as a discrete treatment stage. Quench is also present there, with authored stage/property changes. Thermal residence is modeled in `craft_process_thermal.js`.

Other kernel law callers outside the census: `agency_household.js`, `agency_wild.js`, `brew_law.js`, `contest.js`, `gu_coupled_working.js`, `gu_move_roles.js`, `gu_working_law.js`, `kernel_compose.js`, `living_workings.js`, `market_trade.js`, `progression_path.js`, `spell_law.js`, `spell_working.js` (definition in `kernel_working.js`).

Other process leaves: census includes `craft_process_cues.js`, `craft_process_separation.js`, `craft_process_thermal.js`, `craft_agitation.js`; outside it are `dose_process.js`, `making_procedure.js`, `absorb_e2/durability.js`.

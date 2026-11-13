# Procedural crafting foundation, November 11

```receipt
build: 9f4ba8c46fd6d3b7be669b8c00c83f41d0f9513e678841e1a41f5b521b6a5ae7
route: fixture(Village dagger and fuel, Mistglass pelt stock)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 29 focused tests passed for the ordered-work and partition integration slice
review: diff-scoped
surface: gear_work and mistglass_path_work, zero new registration lines or import cycles
```

Active goal in chat 01a1c96a-fb11-7273-984f-12196dc83eab. Baseline master b92e1e87f with concurrent edits. Use the primary checkout and scoped tests. Preserve the shared 64,500-credit reserve. The first live account read returned 67,242.83 credits with ordinary usage exhausted. No reset or purchase requested. Use existing pinned research.

## Seam map

| Responsibility | Existing owner | Boundary |
| --- | --- | --- |
| Source, trait, evidence | craft_sources, craft_materials, material_lineage | Node gates and regrowth already exist. Catalogue truth, exact stock keys and the character's knowledge each carry different facts. |
| Known methods, alternatives | craft_recipes, craft_material_fit, craft_experiment_log | Exact and property slots, consumed/retained allocation and truth recognition already exist. Workshop trials need observable differences and actual consumers. |
| Ordered work and product laws | craft_resolver, craft_process_thermal, making_procedure | The resolver orders transforms and conserves composition. Simulation jobs own played time. Recipe recognition does not prove work was done. |
| Produced parts, upkeep | material_lineage, gear workshop, native crafting, salvage | The lineage planner returns one output and exact debits. Its yield ceiling does not record co-products or loss. Keep structural assembly and condition with their equipment owners. |
| Publication | crafting domain and native craft transaction | Atomically commit costs and grants with the existing save owner. Compare plan/requote, failed saves and replay before relying on it. |

Rules MR1–MR36, AD36/38/43/49/51, AR3/9/10/11, WPR30–32. Canon-first and book worlds retain priority. Use original fixture values for mechanism tests and keep them distinguishable from pinned reference facts.

## Source and acceptance matrix

| Case | Bounded evidence | Observable checks |
| --- | --- | --- |
| Ordinary forge, then assemble | [Vintage Story W1–W3](../../../research/vintage-story/PROCESSING_DIGEST.md#portable-anvil-work-versus-placed-clay) establishes workpiece shape/temperature across removal and reheating. [Elin craft trace](../../../research/elin/readers/CRAFT.md) establishes material/quality consumers, with axe-head example proposed. | Gather a real lot, shape it with a fixture and retain scrap, compare a workable replacement and its grade, assemble with a separate part, then use the result. Wrong order and cold work should explain the missing condition. Reheat preserves paid shaping. |
| Advanced artifact conversion | [ACS selected artifact chain](../../../research/amazing-cultivation-simulator/traces/production.md#selected-artifact-chain), P06–P24 and P35. One existing object, workspace and energy, with source-derived attack traits and actual committed-failure costs. | Compare success and committed failure using the same source item. A different viable source object should change a real output property or cost. Failure must account for the spent object once. Keep the published reference's quantities distinct from YAIR tuning. |
| Rework and persistence | Vintage Story W1–W3 establishes shape retention. Salvage recovery rates remain unknown there. | Rework the same piece, repair by condition, account for recovered scrap and unrecovered matter. Reject duplicate/overallocated inputs and an unbalanced outcome. Save mid-work, reload, finish, Export and Import at an isolated origin. Check one-time settlement. |

First slice ownership is the pure lineage planner and its focused test. The shared resolver and live workshop adapters are busy integration seams. No Gu, potion or spell files are part of this slice. Carry exact custody and separate spend, retained support and output/loss contracts to discussions with those owners. Magical energy, living identity and fluid constituents remain world/domain laws. Wiring follows the contrasting foundation cases. Later UI acceptance targets rebuilt desktop at 1920×1080.

## First foundation slice

`planMaterialPartition` in `src/material_lineage.js` reuses exact stock selection and immutable provenance. One debit list covers the whole stage. Each product carries the event's exact input and support keys. The law supplies a common unit and per-item measures. The planner rejects unbalanced or stale requests and can describe total committed loss with zero product. Spent supports such as fuel are costs outside the primary material balance. Any substance that becomes part of a product belongs in primary inputs. Existing single-output lineage uses the same preparation and key encoding. No save schema added. The partition event and balance are a plan receipt. A native publisher still needs to own durable settlement and any persisted failure receipt.

- Focused Node tests for material lineage, craft engine, allocation, lineage traits, processed materials, making procedure and native craft transaction passed 73/73 on the current source. The new cases cover forge yield plus scale, artifact success and total loss, and a chain through alternate handles and salvage. Numbers and item names are illustrative fixture data. This proves accounting and provenance, with JSON key round trips. It does not establish native gameplay, substitution grades, measured process behavior or browser save/import.
- `npm run check:arch` passed on the shared candidate. No composition root growth or new import edges in the slice. Scoped diff whitespace check passed. The initial unscoped diff check reported pre-existing generated bundle whitespace in the shared checkout. Avoid writing the shared bundle for this isolated change.
- Highest state is focused agent verification, implemented below AD43 floor. No commit, push or published build. Account read after the initial implementation showed 67,214.75 credits, shared and above reserve.

## Resume

Extend the existing ordered-process tests with real state predicates and outputs for the contrasting cases. Start from the Village native Axe head row and Iron chopping axe consumer. Preserve the four-ingot legacy route and exact component equipment keys. For the advanced case, find a priority book-world route with a genuine source-derived effect. The existing Village prism chain is a useful comparison for assembly and recovery but belongs to the same world and cannot close the contrasting-world gate. Before wiring, settle weight/quantity mappings, which observations teach a method, and who owns failure receipt and unfinished work. At integration, use existing native transaction and jobs, stage a headless isolated build and prove earned routes, cancellation, stale admission, save rollback and literal save/import.

## Ordered work and first production caller

- Village's existing gear workshop now preserves a shaped workpiece on reheating. Cooling still blocks quenching, fuel is paid for reheating, and the hot piece can be quenched without repeating the paid shaping. This follows Vintage Story W1–W3's separated heat and progress. The exact worked item key carries the existing treatment fields and instance, so legacy records load with the current schema.
- Mistglass's existing Flow-cut and Set-grain now publish the partition planner's exact debit and credit rows through their established host. Its local conserved unit is one hide workpiece. Charge preparation still owns energy and dose cost. The exact legacy output key, including origin time and frozen control, is preserved. This is an original setting mechanism and a contrasting native consumer, not proof of the ACS artifact source route.
- Focused Node run `node --test tests/gear_workshop.test.js tests/distinct_world_paths.test.js tests/vessel_thread.test.js tests/material_lineage.test.js` passed 29/29. `npm run check:arch` and scoped diff whitespace passed. Isolated `BUILD_OUT` build passed, leaving shared dist alone.
- Village browser receipt at `/tmp/yair-procedural-proof.cRcE5H/village-reheat-NJvIwF/village-reheat.json` verifies paid shaping, cooldown refusal, reheating, repeated-shape refusal and paid quench through native UI, with literal import before reheating and after quench. The original dagger and fuel were fixture stock.
- Mistglass browser receipt at `/tmp/yair-procedural-proof.cRcE5H/w4-paths-EFqsDo/w4-paths.json` verifies paid preparation and both finished routes with native Save/reload/Export/literal Import. The diagnostic driver omitted a separate foreign-world round trip after the first run stalled waiting for Play on that step. It retained the foreign reserve and clock assertions. The original pelts were fixture stock.
- The repository-wide rules command reached the receipt checker and reported missing headers here and in the concurrent creature-lifecycle checkpoint. This checkpoint now has its header. Keep the unrelated receipt with its own writer.

Next production gap is the native forge-to-assembly path. Its current component handler spends the selected ingot key and grants by result ID and quality. Carry partitioned output and residue through that same atomic craft transaction, then follow the exact resulting component into the equipped axe. Use world-authored material measures and a meaningful substitute tradeoff. The existing worked-dagger route proves the heat/shape transition but does not exercise the ingot-to-component path. The broader goal still needs the book-world advanced artifact case, live co-products and failure receipts, discovery from actual outcomes and the remaining acceptance matrix.

The autoplay-aware diagnostic also stalled at the foreign-world Play gate. This is reproducible on the current combined build and remains open. The named production route and prepared/finished imports passed in the direct fixture run. Targeted receipt lint passed; the repository receipt lint then reported only the concurrent creature-lifecycle header.

## Village forge, assembly and reclaim

```receipt
build: 485b9164e808d937f600110d409dec00622048248070cb92ec25eda6f7e68f03
route: fixture(Village ingots, handles, fuel and native Forging admission)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 37 focused model and loader tests, 2 native interaction tests
review: diff-scoped
surface: existing native recipe transaction and lineage validation; zero new registration lines or cycles
```

- Village axe-head forging publishes actual material-specific heads and one mixed forge offcut per native four-ingot attempt. The original accounting dial is 100 units per ingot, 360 in a head, 20 in an offcut and 20 lost as scale. Pinned Vintage Story evidence supports recoverable smithing material as a mechanism. It supplies no verified recovery percentage. The five-offcut reclaim recipe spends ordinary forge fuel for one lower-grade iron ingot.
- Fixed Iron and Steel chopping axe assembly can carry actual head and handle cohort keys into the native tool. When a batch assembly uses a provenance-bearing part, the receipt describes the whole consumed batch. Separate causal allocations for success and failed attempts within a mixed batch remain open. Old keys without lineage still resolve. New carrier IDs and families validate through the existing lineage owner, with no save slice.
- Focused model/native-loader run passed 37/37. `node --test tests/interaction_native.test.js` passed 2/2, including a refused storage write that restores the exact ingots and publishes neither head nor offcut, then a successful retry. `npm run check:arch` passed, main 3 lines under baseline. The scoped diff whitespace check passed. Full rule check still stops at the concurrent creature-lifecycle checkpoint's missing receipt. It also emits the existing HP exams time-rule warning.
- Headless browser at 1920×1080 ran native components, assembly, reclaim and equip. Save/reload/Export/literal Import round-tripped the assembled axe, head and reclaim stock before equipping, then the native equip action retained the provenance in the saved character. Receipt `/tmp/yair-forge-proof.zz6kMo/village-forged-axe-XgIk3m/village-forged-axe.json`; replay driver `forge-browser.cjs`. The fixture supplies known ingots and handles, fuel and Forging admission, so natural gathering, the smelt-to-ingot history and actual chopping remain open.
- Balance last read at 66,992.56 shared credits. No reset, spend action, commit, push or shared build replacement.

Next close the Village natural acquisition and chopping consumer, then choose an earned advanced artifact route in a separate world with a physical item, local energy/tool predicates and a consumed effect. Existing Mistglass charge work is a useful original-world comparison. It does not replace the advanced book-world artifact acceptance. Keep the ordered-work, discovery, novel substitution, failure and rework matrix active.

## Mined ore to equipped axe

```receipt
build: c6f391b03b5ae82df04e9818e5d720fb821333c06cf0af357923357be377fa2d
route: fixture(cave and skill admission, pickaxe, fuel, handles)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 28 focused planner, lineage, transaction and native interaction tests
review: diff-scoped
surface: existing gathering, recipe and lineage owners, no registration lines or cycles
```

- Actual Village-world iron mining awards dated ore lots with the source vein, location and activity. Normal smelting consumes the exact allocated ore lots and fuel, records both, and publishes slag even for a failed firing. Original dial per firing is five ore at 25 units each, one ingot at 100 on success and one slag at 25. The 100 unrecovered units on a failed reduction are recorded in the slag receipt. These are explicit YAIR accounting choices.
- A selected axe-head material now spends that exact ingot lot first and fills from other spendable lots of the same grade in stable order. The picker shows the combined availability and order. The head and offcut preserve each exact lot key. Other component recipes still use their selected lot. Separate ingot firings matter because the native availability code can resolve only one attempt from a fragmented ore selection.
- `node --test tests/processed_materials.test.js tests/material_lineage.test.js tests/native_craft_transaction.test.js tests/interaction_native.test.js` passed 28/28, including denied stock, failed reduction lineage and native forge write rollback. `npm run check:arch` passed. Scoped whitespace and checkpoint receipt lint passed.
- Rebuilt browser at 1920×1080 mined iron from zero ore stock, smelted four distinct ingot lots, forged one head with all four in its receipt, assembled an axe, equipped it and gained wood from actual chopping. Save/reload/Export/literal Import passed before equip and with the axe equipped. No page errors on that pass. Evidence `/tmp/yair-mine-proof.wTYVYZ/village-mined-axe-w06CFE/village-mined-axe.json`, driver `mine-axe-browser.cjs`.
- A direct equip immediately after the travel/craft sequence hit a missing Village travel-time entry during the location redraw in the earlier browser run. The passing route includes the explicit pre-equip persistence round trip. Natural cave and skill unlocks, mined-route direct equip without the reload, and a harvested handle remain unverified. The last live shared balance was 66,833.66 credits.

Advanced candidate narrowed by current evidence. The other arc already verified Klein buying two blanks (ch69), physical engraving from the reserve (ch83), cancellation and retry, then gifting both amulets (ch87). See [the arc receipt](../cross-world-systems-2026-11-07/CHECKPOINT.md#four-arcs-resumed-november-9-2026). Use that route and existing custody instead of minting another supplier, item family or reserve. Inspect its own mutable-file custody before any write. The next gap is to drive the actual inscription result from the common material and ordered-process contracts, distinguish a failed inscription from a cancelled reservation, and prove a real protection consumer. Gifting alone proves custody and a social result. Recipe discovery and the novel viable combination matrix still need native evidence.

## Tingen engraving law

- English v1 ch83 P033–P047 explicitly establishes the quiet office, knife, silver, guided spirituality, the required placement of inscriptions on both faces, damaged practice scraps, and limited, waning protection. P045 gives a one-year maximum for ordinary amulets and distinguishes high-level ritual work. The existing KJ3AP receipts establish the exact native knife/desk staging, two spent practice scraps, two purchased blanks, and one point of spirituality per carving. No source probability or specific averted accident is known.
- The existing amulet place-act rows now pass through `lotm_amulet_crafting.js` at cast load. The catalogue supplies face area, the ordered resolver marks and joins both faces, the recipe recognizes the known method, and the partition checks the conserved silver workpiece. Both live rows lower to the original item grant, cost, duration, command and effect shapes, preserving accepted jobs and later gifting. No Gu, brewing or spell source files or private pack source rows were edited.
- Off-route fixtures cover reversing the face order successfully, completing too early, an undersized practice offcut, missing knife or reserve, and stale silver. Area fractions and the success threshold are authored. The actual canon job keeps its existing scripted sequence and ordinary inventory carrier. It does not persist this new law receipt or expose the off-route workbench choices.
- Focused Node checks for amulet crafting, cast validation, place acts and LOTM cast energy passed 22/22. The current private pack was read once and both carving rows produced byte-compatible native terms. Architecture and rules passed with existing time-rule and stale-glob warnings. Shared balance read 66,734.36, above reserve.
- The isolated current-bundle KJ3AP replay is in progress at `/tmp/yair-amulet-proof.mX6NXs`; exec session 31597, process 44909 at launch. It loaded the earned predecessor. Treat it as running until its receipt or terminal result is observed.

### Remaining acceptance

The named Tingen route still needs rebuilt proof for this candidate. Bring the exact blank/inscription receipt, successful or flawed state, and any completion age into the existing item and job owners before exposing choices. Bind waning protection to a local, source-consistent avoidable hazard and show its result by comparing a carried and an absent or expired amulet. Preserve the existing purchaser, sibling recipients and finite supply. Existing gifts establish social use. Actual avoidance remains an open consumer.

The Village still needs a natural admission route and direct equip after travel without the redraw error, plus a fully exercised preparation-to-handle chain. Across both worlds, retain discovery through observed work, recoverable flaws, rework and repair with actual consumers, and a live novel method with visible tradeoffs. The workbench prototype outcomes and the two current host routes do not certify those gates. Shared contracts for Gu and brewing stay limited to ordered inputs, material/stock custody, structured loss/return, outcome receipts and separated observation. Each own world law retains its catalyst, living identity, energy and activation rules.

Current replay observations on bundle `abb29bbbcd1f9a55e28d7ee5c6e63c2b69c56245c24112b2a0541c18455bdd4f`: the office finished at clock 23532 and the practice at 23552. The same live process was still running on the next poll. Resume by polling exec session 31597 and inspecting its current receipt before rebuilding or rerunning.

## Direct equip and durable Tingen workshop notes

- The first mined-axe browser route reproduced a missing travel cache entry in native redraw on equip. `reload_normal_location` now rebuilds pathing only when the current location has no cached route table. The direct replay removed the pre-equip reload. At 1920×1080, it mined, smelted, forged, assembled, equipped and chopped in sequence, then passed Save/reload/Export/literal Import of the equipped exact axe. Build `dd3ad84c2585763b233d55ef0cbf538aad14dff8125bb4148e1c0fd86dfe218d`, receipt `/tmp/yair-axe-direct.wpjTuf/village-mined-axe-F8Y7us/village-mined-axe.json`. Original admission, pickaxe, fuel and handle fixtures remain.
- The first amulet browser replay on `abb29bbbcd1f9a55e28d7ee5c6e63c2b69c56245c24112b2a0541c18455bdd4f` reached all seven actual workshop actions, including the pending first carve reload, cancellation/refund and retry. Both amulets and the reserve, purse and accepted office outcome assertions passed. The historical harness stopped before its final round trip because it expected the entire story arc to be done. The current pack correctly exposes the next banquet task. Terminal evidence `/tmp/yair-amulet-proof.mX6NXs/failure.json`, with next-step assertion separated from the proven action outcomes.
- The Tingen Notebook now reads the same existing durable completion observation and recorded clock for each completed amulet. It reconstructs the exact known-method material receipt for inspection without duplicating stock, creating a save owner or changing the saved job. Cancelled and still-pending work have no completed record. Source variant or flaw details remain test-only. Completed items still share the legacy carrier key and this record describes the work, so the notes do not identify a particular held copy or establish protection.
- Focused amulet/cast tests passed 7/7 after the Notebook join. Architecture and rules passed with the existing HP time rule and private-packs glob warnings. The rebuilt Notebook and corrected full route are running against bundle `56934d36303f24627454f74781ebb843571f625a64aa6e10c80bb70d3707b014`, under `/tmp/yair-amulet-notebook.s5emsK`. Poll exec sessions 6747 (Notebook) and 58555 (full route); the full route loaded the exact predecessor. The older earned endpoint is the separate Notebook inspection fixture.
- Last live balance 66,601.20 shared credits. No source pack or other task's Gu, potion or spell files edited. No commits, pushes, personal save access or shared build publication.

The first Notebook run reached both visible notes before and after import, then failed a whole-save comparison because exporting awards the existing Spark of Inspiration. The corrected harness compares the clock, stock, completed commands and knowledge across import, and compares the whole snapshot within each read-only inspection. Corrected Notebook exec session 8455 (PID 60921 on last poll). The full route session 58555 (PID 57850) reached practice at 23552 on its last live poll. Continue polling both handles and their logs.

## Harvested handle and Notebook proof

```receipt
build: 9fb9b39eb63e9e04835a9f64d7b5284e8e946f7b9a605d0766bbc280423c18d0
route: fixture(cave and forest admission, skill levels, existing pickaxe and steel axe, fuel)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 20 focused processed-material and material-lineage tests
review: diff-scoped
surface: native log preparation, medium handles and axe assembly, zero registration lines or cycles
```

- Village log preparation accounts for the three stock units in each native log. Successful portions carry the consumed log key and the existing grade. A partially productive batch accounts for unrecovered stock. Medium-handle work uses two processed pieces, can fill from other available lots of the same grade, and preserves the exact inputs and native output quality. The fixed chopping axe reads the actual handle and head records. Raw logs retain their existing exact stock keys, which other native jobs expect. The output record thus reaches the raw log key; the dated forest location is verified by the route and is not persisted on the raw log.
- `NATIVE_HANDLE=1` rebuilt desktop run started without ore or a medium handle, gathered both ore and ordinary wood through the native activities, smelted and shaped the head, prepared the log and shaped the handle, assembled and equipped the axe, and chopped with it. Equipped axe and both input branches passed Save/reload/Export/literal Import with zero page errors. Receipt `/tmp/yair-handle-proof.As1tuS/village-mined-axe-XAUGLC/village-mined-axe.json`. The baseline supplies tool and skill admission; neither the steel gathering axe nor the unlocks were earned in this run.
- Focused processed-material and lineage checks passed 20/20. Architecture and scoped whitespace passed. The wider native save/craft/interaction slice is running in exec session 57049, log `/tmp/yair-handle-proof.As1tuS/tests.log`.
- The corrected Notebook inspection passed at 1920×1080 on build `56934d36303f24627454f74781ebb843571f625a64aa6e10c80bb70d3707b014`. Both records were visible before and after literal import. Each inspection left the whole snapshot unchanged, and clock, stock, completed commands and knowledge matched across import. Receipt `/tmp/yair-amulet-notebook.s5emsK/notebook-result.json`; the earned KJ3AP endpoint supplied the fixture. The earlier full replay again reached every carving and office outcome. It stopped at a mistyped expected next ID in the harness (the live suffix is `.dress`). The exact-ID correction is now running in exec session 9016, log `/tmp/yair-amulet-notebook.s5emsK/play-final.log`; loaded predecessor observed.
- The existing LOTM backlash reducer applies to harmful ritual settlement. Ch83's avoidable misfortune calls for a local hazard reader with its own causal predicate, not a general reduction in ritual backlash. Remaining work includes this protection consumer, a live alternate inscription result and the shared discovery, rework and salvage checks. The Village modular weapon axe already accepts handle alternatives; audit its exact component lineage on assembly and replacement before using it to prove substitution.

The wider native save/craft/interaction slice finished 21/21, including legacy save loading and denied forge publication. Last live balance 66,466.13 shared credits. The shared tracked bundle was preserved.

## Modular parts through fitting and salvage

```receipt
build: e83bba3429f75a8d33cce88bc11a5847f74320a5b70657c1e42a7a545faef65a
route: fixture(three traced components and Village workshop admission)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 35 focused native saves, crafting transaction, workshop, processed materials and native interaction tests
review: diff-scoped
surface: existing native equipment keys and material lineage owner, no new save slice or registration lines
```

- The assembled equipment key retains traced parts by structural slot. Older untraced components keep their existing representation. Replacing a component updates just its slot, returns the exact displaced cohort at degraded quality, and preserves other fitted keys. Salvage consumes the equipment and returns each fitted part through its own history. The recovery grade is bounded by both assembled quality and original traced part grade, then reduced by actual condition and the existing salvage share. The rough wood versus ash fixture verifies the native higher-tier substitution and exact ownership, not a hardness or attack improvement. Both of those values matched in the tested combination.
- The first browser run exposed that the stock loader reconstructed the modular axe from templates and dropped its fitted keys. The existing lineage domain now claims those equipment keys at load. Equipped slots also decode the exact key when durability instance IDs are disabled. The final 1920×1080 browser run checked live stock after import, Save/reload/Export/literal Import of the equipped axe with durability disabled, handle replacement, destructive salvage and live salvaged stocks after import. No page errors. Receipt `/tmp/yair-modular-lineage.l1GzvV/village-modular-axe-jt6bcE/village-modular-axe.json`, driver `modular-axe-browser.cjs`.
- Focused suites passed 35/35. Architecture and scoped whitespace passed. Deep cycles of reusing salvaged lineaged parts still use the existing material ancestry depth limit and need a bounded representation audit before this can be generalized to long rework chains.
- Corrected full Tingen replay completed on bundle `56934d36303f24627454f74781ebb843571f625a64aa6e10c80bb70d3707b014`, starting with the earned consultation save. It exercised pending first-carve reload, refund and retry, then finished both carvings, reached the banquet offer, and passed final Save/reload/Export/Import at 1920×1080 with zero page errors. Receipt `/tmp/yair-amulet-notebook.s5emsK/browser-result.json`. This and the earlier Notebook proof close the currently authored successful Tingen route. Actual amulet protection and alternate live methods remain open.
- The last shared balance was 66,364.96 credits. Preserve the 64,500 reserve. No commits, pushes or shared bundle publication.

Next work should target actual protection and learnable alternatives in Tingen, with explicit local hazard and custody terms. Village material substitution now has actual native assembly and refitting evidence for traced parts. Broader alternate costs, experiment-derived discovery, and repeatable age/ancestry handling remain open.

## Repeat recovery and reassembly

```receipt
build: d00a45c9874b4ef3ec5fcc281ea85d100f7370cd6e3bf75c8e48e5d7a46ec911
route: fixture(three traced components and Village workshop admission)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 35 focused workshop, lineage and processed material tests
review: diff-scoped
surface: gear component recovery and existing post-assembly refresh, no new owner or save slice
```

- First recovery retains the original fitted item key. Further recoveries retain that original parent and append a dated event with the preceding part's grade, facts and actual assembly condition. The prior entry in the same history carries its lineage. This removes recursive growth from repeated recovery. Twenty-four alternating recoveries passed native item decoding and save validation, retained the event chronology and original source, and stayed under 10,000 key characters. The existing 64-entry history ceiling still applies.
- The first repeated native browser run assembled the recovered parts but found a stale, empty carried-gear picker. Native equipment assembly now refreshes through the existing domain lifecycle after durable settlement. The rebuilt browser assembled, equipped, refitted, salvaged, reassembled and salvaged the same traced parts. It verified both recovery events and the first source, with Save/reload/Export/literal Import and a live inventory check after the second salvage. Evidence `/tmp/yair-repeat-recovery.oH4zQ5/village-modular-axe-UhrxdF/village-modular-axe.json`; no page errors.
- Workshop, lineage and processed-material suites passed 35/35. Architecture, scoped whitespace and receipt lint passed. Last live balance 66,303.17 shared credits.
- Tingen protection seam still open. Native place jobs freeze numeric effects, while the exact LOTM pending-job validator compares authored and admitted effects. A dynamic hazard needs a compatible effect/receipt owner and an actual worn or otherwise physically bound item. The current undifferentiated carried stock and Notebook records cannot prove which copy is worn. Existing ritual backlash is a different causal mechanism. No protection or alternate Tingen action was added in this slice.

## Worn silver and protection check

```receipt
build: d0c1a2504b4cebf05dbc604e6dd24ddf67a72630ccdf5389e779175342d595de
route: fixture(earned two-carving Tingen checkpoint, durability enabled)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 6 focused amulet crafting and protection tests
review: diff-scoped
surface: native amulet slot, legacy gift stock key and equipped save loading
```

- The rebuilt browser equipped one of the two earned silver amulets, verified the remaining gift stock, imported a file save with the amulet equipped, and returned it to the exact gift stock on unequip. Driver `amulet-wear-browser.mjs`, receipt `/tmp/yair-worn-amulet.Jnlcw4/wear-result.json`.
- The seeded check accepts a caller-supplied ordinary avoidable incident in Tingen. The proposed tuning adds two points to the roll when fresh, one after half a year, and zero after a year. Legacy stock copies share one key, so the current age anchor is the oldest known completed carving. The focused test verifies the same draw changes outcome when wearing fresh silver. No live hazard calls the check yet. Alternate native inscriptions and experiment-derived discovery remain open.
- Focused tests passed 6/6. The isolated build, architecture and rules checks passed. Rules reported the existing HP time lint and stale private-packs glob. Last live balance 66,168.53 shared credits. No commits, pushes or shared bundle publication.

## Blackthorn departure

```receipt
build: 0a2f473843220ea623d425896bd3e83368d97b0800868159a8fd9b2de0aaa8ce
route: fixture(earned two-carving Tingen checkpoint, waited on the native clock for the paired marginal draw)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 7 focused amulet crafting and protection tests
review: diff-scoped
surface: native walk settlement, stamina and existing cast observation
```

- MR1–MR36, AR3, AD43. The first eligible walk out of Blackthorn after a completed carving can now encounter a parcel rolling off a handcart. This is an original Tingen incident. It checks the actual equipment slot. The outcome note is written in the existing cast situation in the same save as the departure. The saved note prevents the incident from playing a second time.
- The first browser run exposed missing situation attribution on the new note. The corrected 1920×1080 rebuild used the same departure, seed and minute in both branches. With the amulet carried but unworn the marginal result cost two stamina. Wearing it averted the cost. The observation survived literal file import and rendered in the panel DOM. No page errors. Driver `amulet-mishap-browser.mjs`, receipt `/tmp/yair-parcel.T7Ib6W/mishap-result.json`. The roll itself is available to the check caller and the save stores the observed consequence.
- Seven focused amulet tests, isolated build, architecture, scoped whitespace and rules passed. The existing HP time lint and stale private-packs glob remain.
- Next independent Tingen gap is paid, optional reverse-order or flawed inscription and its observation. The source sequence is canonical. The existing cast making offers are separate from the next-task place-act filter, but their stock, spirituality, completion, cancellation and consumer all need an explicit binding before exposing a choice. No Gu, potion or spell file edits, commit, push or shared bundle publication. Last observed balance 66,077.09 shared credits.

## Paid Blackthorn trials

```receipt
build: fbb3b5d20ff46f2fb0ec3c6c1c1c21510a802bbc4e1fd5de33c04081a4742e57
route: fixture(earned two-carving Tingen checkpoint, native order and Cogitation)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 34 focused cast making, lead seat and amulet tests
review: diff-scoped
surface: timed paid trials, alternate product, failed scrap and durable observation
```

- MR1–MR36, AR3, AD43. After the two source carvings, Klein can order a separate two-blank lot from the silver stall, then experiment at the prepared office desk. The runner, 12-soli price and timings are original dials. The first browser attempt found that the stall address was absent from native departures, so the order now delivers to the desk. The rebuilt run verified payment and receipt of both blanks, then recovered two points through the existing Cogitation action.
- Back-first and premature-completion methods use the same material and ordered process law, reserve a trial blank and one point of spirituality, and publish either a separately keyed wearable amulet or a practice scrap. A settled job writes a dated Notebook observation. The trial amulet's age uses its own successful observation. This authored lot has one successful back-first job. Provenance is recorded in the observation, with no per-piece lineage key on the practice scrap.
- Isolated build, 34 focused tests (making adapter, lead seat and amulet suites), architecture, rules and scoped whitespace passed. Existing build and rule warnings remained. Driver `amulet-trial-browser.mjs`, evidence `/tmp/yair-trial.FXizCQ/trial-result.json`. The pending trial survived literal import. Cancellation returned the exact blank and spirituality. Finishing the early attempt produced one scrap and its observation. The other blank produced a separate back-first amulet without spending either gift amulet. The alternate was equipped and survived literal import, both trial observations were visible in the Notebook, and the route had zero page errors.
- The wider source and acceptance matrix remains open, including repeatable discovery-driven work, actual recovery or rework of the failed trial stock, and the ACS source-case comparison. No Gu, potion or spell files edited, no commit, push or shared bundle publication. Last observed balance 66,041.36 shared credits.

## Reworking the failed trial

```receipt
build: 22764260314fdf0c7e63787a977ac8699cfc3d252397f5901ab8520fdd31055a
route: fixture(earned two-carving checkpoint, paid trial lot and native Cogitation)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 30 focused lead seat and amulet tests
review: diff-scoped
surface: discovery-driven rework and distinct wearable result
```

- MR1–MR36, AR3, AD43. A new early trial retains a distinct full-size piece with the front already marked. The rework reads that composition through the shared law, needs the exact marked stock and a fresh point of spirituality, and engraves the remaining face before binding. The rework offer appears after observing the intact piece. The product has a separate wearable identity and its own completion age.
- The earlier trial remains registered for pending saves and its old undersized scraps retain their stock representation. The new offer uses a new command ID, so pending effects and refunds do not change shape. Exact per-instance ancestry and repeat supply remain open.
- Thirty focused lead-seat and amulet tests, isolated build, architecture, rules and scoped whitespace passed. Rules reported the existing HP time lint and stale private-packs glob. The rebuilt browser verified paid supply, Cogitation, pending import, cancellation and refund, and failure leaving the front-marked piece. Its observation revealed the rework offer. Rework consumed that exact stock key, produced one complete amulet and left the spare blank, which made the separate back-first piece. The reworked amulet stayed equipped after literal import. All three observations were visible in the Notebook, with zero page errors. Driver `amulet-trial-browser.mjs`, evidence `/tmp/yair-rework-silver.YRwFta/trial-result.json`.
- The ACS comparison still needs a native conversion owner. P06–P24 and P35 specify paid rank-squared entry, a committed loss path and source-carried attack/recovery properties. The Village resonance frame's existing recipes cover reversible assembly and disassembly. They do not supply that conversion. Preserve the other writers' Gu, potion and spell files. No commit, push or shared bundle publication. Last observed balance 65,983.55 shared credits.

## ACS ordinary refinement foundation

- MR1–MR36, AR3, AD43. [Selected artifact trace](../../../research/amazing-cultivation-simulator/traces/production.md#selected-artifact-chain), P13–P20 and P35, supports committing a chosen ordinary object and rank-squared energy at work entry, work time shaped by skill and the input, paid destruction on failure or after-entry interruption, and combat properties inherited from shape and material. `src/artifact_refining.js` expresses these in the shared partition owner. The success coefficients, trait tuning, rank range and use of played minutes are YAIR dials. No parity with measured ACS runtime rates or timing is claimed.
- Admission proposes the exact stock debit, energy cost, due time and deterministic result together. The successful output key preserves the source object and material parameters. Failed completion and post-entry interruption record the whole paid workpiece as loss with no item output. The output reader takes attack, recovery and element from the produced key. Same-rank hard and soft examples trade attack against recovery, and a blunt input loses the edge contribution.
- `node --test tests/artifact_refining.test.js tests/material_lineage.test.js tests/craft_engine.test.js tests/gear_workshop.test.js tests/distinct_world_paths.test.js` passed 54/54. Architecture passed. This is foundation evidence. The serializable proposal is not a native job, and the strike reader has no native fight caller yet.
- Mistglass has an existing bound workshop body, reserve, atomic native stock publication and world-advance path. Use that owner as a candidate, with actual carried ordinary stock selection, supported source traits and one durable job. The paid start must validate current stock and reserve; completion must consume the pending job once, validate the saved outcome and hand off the resulting item to a native attack consumer. Demonstrate the same physical object type in both result branches and a genuine material comparison. Village's Vela frame owner is reversible assembly and does not prove this conversion. No Gu, potion or spell edits, commit, push or shared bundle publication. Last observed balance 65,972.99 shared credits.

## Native Mistglass refinement

```receipt
build: 6afeb8433fc9eb844c4c71e410183d146232082942b4bb596c9727e4d7fdee2c
route: fixture(played Mistglass endpoint, seeded sword and condensate, paired outcome seeds)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 19 focused artifact, paths and material tests
review: diff-scoped
surface: conservatory refining, native stock and weapon loader
```

- MR1–MR36, AR3, AD43. Mistglass now offers paid sword refining on its existing conservatory panel. It uses the actual sword's components and quality, the same native condensate reserve, and the existing world clock boundary. Save validation replays the accepted source and due time. Leaving before completion consumes the already-paid inputs. One finished job can grant at most one sword.
- The native weapon loader retains the exact product key, reads attack and recovery from its refining history, and passes those values into the existing weapon attack and attack-speed paths. Element is stored as lineage and still needs a native damage consumer. The first native binding recognizes ordinary iron and steel blades with the two named short handles. The local rank, skill mapping, speed multiplier and physical conversion are original.
- Nineteen focused artifact, path and material tests passed, including native item loading and the three settlement branches. Isolated build `6afeb8433fc9eb844c4c71e410183d146232082942b4bb596c9727e4d7fdee2c`, architecture, rules and scoped whitespace passed with existing warnings. The browser driver needed to open the full Projects disclosure chain before keyboard activation. At 1920×1080 the rebuilt browser verified exact payment and pending literal import, completion, equip and equipped literal import, and a committed failure with the same source sword key and no output. Driver `mistglass-refine-browser.mjs`, evidence `/tmp/yair-native-refine.j871sW/refine-result.json`. The earlier played endpoint supplied location and method. The driver added an ordinary sword and reserve. Actual combat, element behavior and a naturally acquired material comparison remain pending.
- No Gu, potion or spell edits, commit, push or shared bundle publication. Last observed balance 65,922.64 shared credits.

## Refined weapon in native combat

```receipt
build: ed022604e872dcbe8a18d9707b159a7a92525f428d9bc121f5b2dbb78c274ecd
route: fixture(played Mistglass endpoint, seeded sword and reserve, Infested field admission)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 16 focused artifact, damage-type and world-path tests
review: diff-scoped
surface: refined item strike and native typed combat
```

- MR1–MR36, AR3, AD43. The refined weapon factory uses the saved source element in the native weighted strike. Mistglass's metal binding currently carries 60% metal, 28% slashing and 12% piercing. Chainmail's metal protection and those weights are original dials. No added damage engine or change to the optional incoming-affinity rule. The focused tests verify weighted mitigation against a declared resistance and the existing ordinary attack mix.
- The rebuilt browser imported the pending success, equipped and imported the completed sword, returned to the Village, and landed a native Infested field hit for 6.9 metal damage. A separate paid failure on the same ordinary sword key again produced no artifact. Isolated build, 16 focused tests, architecture, rules, and scoped whitespace passed. The fixture supplied the input, reserve, and field admission. Evidence `/tmp/yair-refine-combat.czk7dr/refine-result.json`.
- The market route initially used the legacy trader ID and then hit stale UI immediately after trade closed. Using the current NPC ID and advancing one native tick after trade fixed the harness. The passing run spent coin at Dunstan’s shop, obtained a 60-quality cheap iron sword, returned to Mistglass, and committed that exact purchased key to a new refining job. This branch stops at paid entry. The iron-versus-steel material comparison remains focused evidence. Existing Village forging can produce steel long blades. Ordinary steel acquisition and comparative battle still need native proof. No Gu, potion or spell edits, commit, push or shared bundle publication. Last observed balance 65,893.23 shared credits.

## Purchased iron and steel through combat

```receipt
build: d702aa1b08302854ae16bd6abf7dac08ec9c13dbf67c9f2d044e026825d4b899
route: fixture(played Mistglass admission, road and field access, starting purse and deterministic market/outcome seeds)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 16 focused artifact, damage-type and world-path tests
review: diff-scoped
surface: native travel, Slums purchase, mist exposure, refinement, equipment and combat
```

- MR1–MR36, AR3, AD43. The rebuilt browser traveled from Mistglass through the Village and Town outskirts to Quill's Slums shop, bought the two normal vendor swords with coin, then returned to Mistglass. Both purchases were within the same quality band. No sword or condensate was added by the driver. The refinement branches inherited the same purchased stock and earned any missing reserve with played mist exposure.
- Each branch paid with the exact bought sword key and returned one successful artifact linked to that input. Both artifacts were equipped and landed an actual metal strike in the Infested field. The comparison reads the stored attack and recovery directly, alongside the native stat panel and landed hit. The fixture supplies travel/combat admission and the purse. The market and successful refinement draws are deterministic fixture choices.
- The first market shelf lacked steel. The corrected route chose a normal keyed shelf with both swords. The harness then switched from row positions to exact item keys because moving one offer into the basket reordered the rows. Driver `mistglass-material-browser.mjs`, receipt `/tmp/yair-refine-material.AVLU52/material-result.json`. The paired comparison reloads the earned stock at branch entry. Pending and equipped literal import are covered by the preceding Mistglass receipts.
- Next open scope includes repeatable discovery-driven Tingen work with per-piece ages and custody, and final verification of the combined slice against the full matrix. No Gu, potion or spell edits, commit, push or shared bundle publication. Last observed balance 65,848.71 shared credits.

## Repeat Tingen work and dated amulets

```receipt
build: bedc9421ef8510f916989e84c3f4358e5d6e78ceed268f2bea620e81d396f0f2
route: fixture(earned two-carving checkpoint, two native paid orders and Cogitation)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 40 focused amulet, lead-seat and material-lineage tests
review: diff-scoped
surface: repeat supply, dated finished lineage and equipped identity
```

- MR1–MR36, AR3, AD43. The same paid supplier order, back-first method and rework can now run again. The timed job retains the authored reservation/effects. Successful binding settles its native grant with a lineage key carrying the paid source key, method, binding minute and unique simulation cause. There is no new save slice. Plain older variants keep their first observation as the age anchor while subsequent work updates a separate Notebook observation.
- The actual equipped lineage key supplies age. Focused tests cover two dates, an expired older piece, a fresh newer piece and the unchanged legacy anchor. Forty focused amulet, lead-seat and lineage tests, isolated build, architecture and rules passed. Existing HP time lint and stale private-packs glob remain.
- The first run's whole-note comparison failed when the existing cast provenance pass annotated the old note. The corrected run verified that its date and job cause were unchanged and checked the full resulting note across import. The rebuilt route paid 288 pence for two orders, retained distinct older and newer back-first pieces, exercised pending import/refund and rework, then imported the exact equipped reworked key and checked the visible Notebook. Zero page errors. Driver `amulet-trial-browser.mjs`, evidence `/tmp/yair-repeat-silver.g8LMtW/trial-result.json`.
- The original gift jobs and their exact stock keys remain the historical authored route. Trial blanks and front-marked inputs still use stack cohorts. Selection of individual unfinished pieces and the full combined acceptance pass remain open. No Gu, potion or spell edits, commit, push or shared bundle publication. Last observed balance 65,781.03 shared credits.

## Trial silver custody and combined verification

```receipt
build: 419ffc841a0abc37f4d77a64f9c877b06ef3a6f6cb983f76e1bde6fba37fe054
route: fixture(earned Tingen carving and Mistglass play, Village tool and skill admission)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 114 combined crafting, material, native transaction and combat tests
review: diff-scoped
surface: exact trial custody plus same-build ordinary forge and artifact routes
```

- MR1–MR36, AR3, AD43. Each paid delivery enters native inventory as its own two-blank cohort. A failed binding carries its exact reserved delivery key into one front-marked piece. Rework carries that exact piece into the finished amulet. Paid actions choose the oldest matching carried stock and disclose this in the cost line. The older plain inputs remain accepted for saves and reservations.
- The normal simulation reservation freezes the chosen key in the job's costs. The Tingen save validator accepts only the declared plain item or the matching processed family and process, and otherwise compares the full costs and effects. No parallel inventory or job owner. The focused regression covers two delivery cohorts, exact selection, a wrong rework source and the chain through binding.
- The 41 focused Tingen/lineage tests, 114 combined crafting, material, native-transaction and combat tests, isolated build, architecture, rules and scoped whitespace passed. Existing HP time lint and stale private-packs glob remain. Six isolated routes passed at 1920×1080 on the same rebuilt bundle. Tingen exercised paid delivery, exact reservation and refund after pending import, marked-stock ancestry through rework, repeat delivery, and equipped import. Mistglass exercised purchased iron/steel and actual combat, plus paired paid success/failure, pending import, and equipped import. Village exercised mined material and chopped wood through the completed axe, reheat and quench, and repeated modular recovery. The first Village harness run compared the served isolated bundle against the checkout bundle. Its corrected run used the isolated working directory and linked the existing fixture docs.

- Evidence lives under `/tmp/yair-silver-custody.9OTFHS`: `trial-result.json`, `material-result.json`, `refine-result.json`, `village-mined-axe-tTY1kH/village-mined-axe.json`, `village-modular-axe-u2Tb3q/village-modular-axe.json`, and `village-reheat-Rlzfis/village-reheat.json`. Verified each receipt's status, build hash and viewport.
- Current custody uses two interchangeable blanks per purchase, distinct marked and finished objects, and oldest eligible stock selection. The original source gifts retain their legacy pooled stock. Condition-based repair and failed-save rollback passed at the native host test level. The same-build browser routes exercised rework and persistence, with no standalone browser repair or injected failed-save comparison. Close the full matrix audit against the original delegated scope before marking the goal complete. No Gu, potion or spell edits, commit, push or shared bundle publication. Last observed balance 65,726.88 shared credits.

## Repair, failed save and completion audit

```receipt
build: 5843031be9c8fc8b0e1b5aa080861be1d5c31208407abc25e0430c91f264ee43
route: fixture(earned modular axe, seeded damage and compatible component)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 114 combined crafting, material, native transaction and combat tests
review: diff-scoped
surface: condition repair and durable rollback on the native workshop
```

- The rebuilt Village workshop quoted and executed a compatible one-component repair from 50 to 70 condition. It preserved the same equipment instance and both fitted lineage keys. Native Save, reload, Export and literal Import retained the result. Before successful retry, a denied browser storage write left live inventory, durability and sequence equal to their prior values and the durable save byte-for-byte unchanged. Driver `repair-rollback-browser.cjs`, evidence `/tmp/yair-repair-proof.mVGJZ8/village-repair-rollback-VK4Bdu/village-repair-rollback.json`. The driver applied damage and supplied the compatible repair part to the axe already earned in the modular route.
- The final build and previous six-route bundle differ in eight bundled sources. Compared both source maps and the changed shared registration hunks. All differences concern concurrent Gu content or its registration and validation. The affected crafting, repair, combat, inventory and Tingen sources are identical between those bundles. The combined 114 focused tests passed again, along with architecture and rules. The existing HP time lint and private-packs glob warning remain. Full `npm test` is the repository's pre-commit gate. This delivery remains in the shared worktree.

| Original requirement | Verified evidence |
| --- | --- |
| Start with independent read-only owner map and source/test matrix, then prove contrasting foundation cases before wiring | The initial sections identify owners and pinned sources. First partition tests establish forge output plus scale and exact-parent artifact success versus committed loss. Native joins follow in the dated checkpoint. |
| Gathering, material traits and provenance, preparation, tools, fixtures, ordered work and assembly | Village mined and chopped their native inputs, used tools and station operations, and equipped the axe with exact head and handle ancestry. The cold/refusal and paid reheat route proves order and preserved shaping. Tingen uses the prepared desk, knife, paid silver and spirituality. |
| Known methods, substitutions, quality and flaws, experiments, discovery and novel combinations | Source Tingen carving was replayed through the existing method. Paid early binding exposed an intact marked piece and revealed rework. Back-first binding worked, and repeat batches kept distinct custody and dates. Village refitting retained the substitute part and provenance. Purchased iron and steel in the same quality band produced different attack and recovery values and landed native strikes. |
| Rework, repair, salvage, paid failure, byproducts and conservation | Tingen reworked the exact marked input. Village repaired by condition, recovered fitted parts, and generated/reclaimed measured offcuts with scale accounted for. Smelting records slag and unrecovered input. Mistglass consumed the source exactly once on paid failure and no artifact was granted. Combined tests reject stale or unbalanced matter, and native rollback preserved exact live and durable state. |
| Persistence, ordinary play in contrasting worlds, reusable contracts and scope | The linked receipts name fixture admission and verify literal save/import at 1920×1080. Village, Tingen and Mistglass all exercise actual use. Shared contracts for brewing and Gu are ordered work, exact stock custody, costs and retained support, structured output/loss, and observations separate from truth. Reserve, catalyst, living identity, activation and outcome law stay with their world owners. |

The scoped foundation and play gates are met. Agent-verified. No human review, commit, push or shared bundle publication. Other tasks' Gu, potion and spell files were outside the write scope. The final observed shared balance was 65,696.88 credits, above the 64,500 reserve.

## November 13 handoff for PC95 fabrication and enchantment

Weibao asked to hand this work off and resume another day. This section belongs to the separate PC95 goal in chat `01a1d28c-5793-7643-89af-5a5a05a005b3`. Resume the full fabrication and item-enchantment scope there. [PC95](../../../PROCEDURAL_CARRY_OUT.md#engine-first-tie-in-later-pc95-2026-11-12) sets headless engine settlement and restore as the current target. Game tie-in follows in its own phase.

- **F1 · Fabrication.** Start with the [fabrication owner](../../../CRAFTING_ENGINE.md#procedural-making-audit-reconciliation-2026-11-04) and its latest PC95 evidence rows. These exercise timed process and assembly, exact part and material lineage, paid interruption, service, refit, separation, salvage and reuse through workshop consumers. The evidence is per case. Keep each family's remaining reopen conditions with its owning row.
- **F2 · Enchantment.** The [checklist and armor trial](../../../WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md) own the per-effect evidence. The latest [passive edge result](../../../WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md#enf1-enf15-and-enf20-inscribe-a-blade-to-deepen-its-cut) includes restore during inscription and a saved contest, competing jobs, loss of custody, and removing the blade during the windup. The same armor fixture already compares cut, fire and mixed hits before and after fitting, removal and restore.
- **F3 · Evidence and custody.** The last runtime batch passed 326 tests across 20 focused files on `db81f1f117cde9f65ebed260fad5f6361c48d8a2` plus shared working inputs. Isolated build, architecture, coverage and rules passed. The docs check failed on five unrelated acceptance claims. Full-suite evidence for this shared candidate remains open. The workspace contains modified and untracked workshop source and tests, including `gear_ward.js`, `workshop_contest.js`, `strike_enchantment.js`, `fire_resistant_lining.test.js` and `strike_enchantment.test.js`. Preserve the primary checkout and recheck Git and file ownership. No commit or push was authorized.

**Resume first.** Coordinate with the current contest owner before changing `src/contest.js` or `src/contest_resolvers.js`. On the inspected revision `ports.profile` is a read seam. `applyMeeting` owns landing, interruption, `contest.blow` and end checks. Agree on a pre-damage hook that takes a successful strike's typed packets and returns the remaining damage and updated ward state, then reuse `catchGearHit`. Prove the same saved mixed hit with the ward worn, removed during windup, exhausted and recharged. Check charge and damage together, then check what interruption and the published blow see. Decide how far contests, which buffer effects in `record.pending`, and odds quotes account for the same protection before claiming parity.

**Next.** Coordinate with the engine host owner on timed maintenance. `engine_records.js` already carries `landImpact`'s updated `stored` map forward across spell effects. That port is restricted to instantaneous vitality removal. A timed maintenance job needs a route from the kernel effect to `rechargeStored` or `renewStored` with live custody and an atomic payment, charge and receipt update before the next impact. Verify restore during the job, competing jobs and custody loss. The continuation inspected these shared seams and left their code untouched. After both gaps, audit the original fabrication and enchantment owners requirement by requirement before marking the goal complete.

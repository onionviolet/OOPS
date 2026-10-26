# Procedural crafting, brewing and adjacent making: inventory and audit

2026-10-26. Request: “inventory our procedural crafting and brewing and more, and audit?” with sharpen and more-to-consider. This is a source inventory, focused verification and proposal pass. No gameplay edits, release, installation, commit or push. Existing dirty work and personal saves were preserved.

## Result and authority

The project has several real making mechanisms, with different degrees of freedom. Computed composition is implemented; a general cross-world making loop is not established by that fact. The immediate reproduced defect is named-method preview/commit disagreement. The most useful broader next step is one connected second-world making journey, chosen within the existing book-world/menu priority, rather than another catalogue or a wholesale engine rewrite.

Owners: [systems map](../systems/MAKING_ITEMS_ECONOMY.md), [crafting palette](../CRAFTING_ENGINE.md), [systems register](../SYSTEMS_REGISTER.md). Rules applied: MR1–MR36, especially MR4/6–8/11/18/21/29–32; AD5–AD9, AD32–AD34, AD36, AD38, AD42–AD43; GR1–GR17; AR3/7/10/11; WPR19/21–25/27. The later compatibility override in MAKING_RULES governs old state; old compatibility is not reinstated as a universal gate. Existing Minecraft implementation lanes retain their ownership and L8 integration evidence. This audit does not redirect those lanes or authorize a new implementation wave.

Evidence labels: **SHOWN** means source read; **CHECKED** means the named automated check ran; **INFERRED** is a consequence of those facts; **PROPOSED** is future work. Source wiring does not establish rebuilt desktop appearance or natural pacing. No sealed truth is disclosed here.

## Inventory

“Procedural” has four distinct meanings here: generated material truth, computed product behavior, generated discovery recipes, and selection/composition of authored parts or commands. A data row or random affix is not proof of arbitrary material chemistry.

| ID | System and actual freedom | Producer → resolver → consumer | Current boundary and evidence |
|---|---|---|---|
| I1 | Generated materials and supply: family ranges, correlations, tags, regional variants, stock/regrowth and game-time harvest addressing | `craft_materials.js`, `craft_sources.js` → frozen `craft_state.js` → Village gathered inventory keys | Engine supports more source forms than the live Village verge exposes. Three-root/sweep and conservation checks exist in `craft_engine.test.js`; runtime source checks passed. |
| I2 | Composition brewing: ratios, operations, conversions, catalysts and reactions compute outputs without one item template per combination | `craft_content_frontier.js` → pure `resolveBatch` in `craft_resolver.js` → registry/native carrier → oral regeneration, harm, binding and dose response | Real computed chemistry. Live owner admits `base.frontier` at Village, a fixed catalogue and named law revisions. Not a general arbitrary-world adapter. `crafting_runtime`, engine and depth checks passed. |
| I3 | Layered formulation and tablets: ingredient order, heat, control, impurity and body-bound conditioning | Frontier layered/tablet laws → same batch resolver → `craft_body_treatment.js`, depth state and body/progression readers | More than cosmetic grades: tests cover order-dependent outputs, fuel, thermal residue, body replacement, channels and exposure. Current dirty implementation is included in the frozen snapshot; no new desktop claim. |
| I4 | Recipes and knowledge: exact/tag/property/compound selectors, generated discovery grammar, carried access versus learned method, training and examination | `craft_recipes.js`, `craft_reference.js` → `craft_reference_content.js`, `crafting_frontier_runtime.js` → `crafting_home.js` method selector and Literacy grant | Book/slate/primer are wired. One authored salt-and-herb method uses tag slots live; generated discovery recipes remain engine-level here. Preview parity defect F1. |
| I5 | Older Village mixtures and responsive laws: authored inputs with computed dose and frozen causal law locks | `mixture_*` and `rule_modules.js` → mixture owner → native oral adapters and saved effects | Separate functioning product path, not evidence that all ordinary items enter I2. `mixture_state` and rule-module checks passed. |
| I6 | Legacy cooking, alchemy, smelting, components and equipment | `crafting_recipes.js` → native recipe executor → ordinary consumables, components and equipment | Mostly authored result IDs, with component/quality/chance calculations. Cooking has a real property-fit pilot: `native_material_catalogue.js` + `craft_material_fit.js` + `native_rendering_recipes.js` change meat costs for Animal fat. Bridge/rendering checks passed; not automatic arbitrary substitution. |
| I7 | HP brewing: prepared lots, provenance, stewing, cauldron condition, samples, assay and graded outcome | Pack formula → `hp_brewing_formula.js` shared process descriptor + `hp_brewing_state.js` local state machine → bottled doses and transformation/condition outcome | Exact/near/bad grading is implemented. Off-formula attempts can resolve as original, but original currently has no transformation effect; this is not free-form computed potion invention. HP checks passed. |
| I8 | LOTM brewing: a purchased formula, actual input, paid supervision and elapsed game time | `book_world_lotm_brew.js` → `dose_process.js` timing + simulation commands → the existing allocated dose and separate ingestion route | A narrow Corpse Collector Sequence 9 route exists. Exact-key one-slot process, not general pathway brewing or symbolic substitution. LOTM brew checks passed. The older “no brewing verb” claim is superseded. |
| I9 | Gear, smithing and inscriptions: roles, heat, shaping, quenching, tempering, finishing, repair, component swap, salvage and selected affix reroll | `gear_work.js`, `gear_workshop_domain.js`, material treatment/lineage → native transaction → equipment stats, condition, tool identity and stock | Material roles and history matter; authored world laws and actions bound the space. Old craftsman commission snapshots and a real service fee are present. Gear checks passed. |
| I10 | Alloy use: authored Springsteel material profile changes the brace and equipment-sensitive techniques | `alloy_equipment.js` → existing gear/technique readers | Bounded functional material pilot, not a generic metallurgy solver. Alloy checks passed, including native equipped clock/travel/reload after the fixture dependency was supplied. |
| I11 | Runes and talismans: adjacent ordered/unordered pairs, fallback discord, learned pair record, timed effects and charged modes | `rune_grammar.js` + `pledges_content.js` → `pledges.js`/domain → stats and charged-use readers | Actual pattern composition, not chemistry. The rune file's “Not wired yet” comment is stale. Rune/pledges checks passed; charged additions were source-inspected, not separately exhaustively tested in this pass. |
| I12 | Assembly and production: exact-piece frames, finite staged workshop projects, paid inputs, tools/energy, helper teaching and supply | `artifact_collection.js`, `artifact_workshop_content.js`, `field_workshop.js`, `systems_workshop_content.js` → simulation jobs/transactions → kit production, equipment or local installation/use | Real authored assembly/production with cancellation and custody rules. Not arbitrary machine design. Field/systems-workshop and saved-job checks passed. Existing Minecraft/MF owners retain broader production-chain scope. |
| I13 | Preservation, spoilage and storage | Harvest age/quality, `owned_place_clock.js` larder, `systems_workshop_runtime.js` ordinary ration/parcel expiry versus preservation → recovery, loss or usable provisions | Several local mechanisms exist, including expiry across player/chest/recipient custody in the systems workshop. The older claim of just three freshness mechanisms is incomplete. No shared all-material decay law established. |
| I14 | Constructs and invention adjacent to making | `temporary_construct.js` → simulation effect/clock/contract owners → temporary copies, held contents and expiring capability supply; `invention_planner.js` → QA/receipt tooling | Construct lifecycle is real runtime infrastructure, not a general construct-building craft. Planner handles authored AND/OR dependencies and estimates; searches found consumers in invention QA/receipt tooling, not a live manufacturing route. Neither was included in the focused test set. |

Formation/enchanting terminology appears in broader palettes and ability/content systems. This pass did not establish a general spatial formation resolver or an arbitrary enchanting craft loop. Rune/talisman patterns and gear inscriptions are concrete related implementations; do not count every proposal heading as another completed system.

## Findings, ranked

| Code | Evidence and consequence | Disposition |
|---|---|---|
| F1 | **CHECKED defect:** `quoteCrafting` resolves the batch in its craft branch without `checkMethod`; `stageCrafting` does check it. Missing method access and an owned book with missing salt both return `eligible:true` at quote and reject at commit. `crafting_home.js` submits the method in the request. Source supports an enabled-action/refusal inconsistency; desktop appearance was not exercised. The probe shows input owners remain unchanged. | First repair candidate, small. Move/reuse method validation in the craft quote with its actual lots. Keep free experimentation independent of whether a named method fits. No runtime repair authorized or made by this audit. |
| F2 | **CHECKED latent defect:** the treatment quote branch calls `checkMethod(..., lots)` although `lots` is scoped to the craft branch. A funded apparatus request with a recipe returns `lots is not defined`. The ordinary UI treatment request was not shown to include recipe, so this has lower reach than F1. | Same bounded repair can remove the misplaced validation; verify real treatment still quotes/commits normally. |
| F3 | **SHOWN structural boundary:** composition runtime scope, location, carriers, references and validator revisions remain Frontier-specific. A second making world needs explicit adapter work despite a reusable pure resolver. | Account for now. Reuse the registry and process envelope; prove one second-world producer/use/save route before designing a universal registry refactor. |
| F4 | **SHOWN documentation drift:** the October 25 systems map says references have no live caller, matching is never live and LOTM cannot brew. Current imports and command definitions contradict those claims. `SYSTEMS_REGISTER` repeats the matcher claim. | ACT NOW in this audit: reconcile those current pointers, retaining dated source history. |
| F5 | **CHECKED boundary, not a newly declared defect:** qualities 40 and 60 for the same generated material resolve to identical products. `materialFromKey` reads quality; `inputLots`/`batchRequest` omit it. CE4 already documents this choice. | Account for now. Decide a physical meaning such as recoverable yield or contamination before making quality matter. Do not multiply truth by a generic quality number. |
| F6 | **SHOWN flexibility ceiling:** HP grades against one formula and LOTM mints one existing dose. `dose_process.js` validates selector shapes but current holdings resolve by exact key. The native rendering fit pilot does not establish symbolic matching, provenance equivalence or whole-formula attractors across worlds. | Account for now. Distinguish represented selectors from executing selectors in any implementation brief. |
| F7 | **SHOWN lifecycle split:** product laws preserve revisions, but knowledge, expiry, stages, stock and body effects have different owners across these mechanisms. Those differences can be legitimate. Generic spoilage, common quantity units and directional foreign-world compatibility were not established in the inspected routes. | Follow explicit material/clock/compatibility mechanisms where needed. No wholesale consolidation or new compatibility gate inferred. |

## More to consider: round 14, PC1–PC6

These extend the existing [crafting palette](../CRAFTING_ENGINE.md), rather than replacing its earlier rounds. Proposals remain proposals.

**ACT NOW:** correct the stale inventory claims and preserve the F1/F2 reproductions. Audit artifacts and owner links are complete. Runtime fixes remain proposed because this request asked for an inventory and audit.

**ACCOUNT FOR NOW:**

| Code | Additional angle | Constraint for the next selected slice |
|---|---|---|
| PC1 | A product is a path through material truth, preparation, container, observer and consumer, not merely a generated name. | Inventory each transition: acquired lot → spent/held input → product → actual use → stored aftermath. Give every transition one state owner. |
| PC2 | A discovered method is a reproducible envelope of conditions, not just a recipe ID. | Record what was actually demonstrated, tolerances supported by evidence, apparatus and known substitutions. Quick repetition consumes the same truth as guided/deep play; it cannot acquire knowledge from the UI alone. |
| PC3 | Splitting, stacking and transfer can erase meaningful differences. | Before adding freshness or concentration, specify whether age/purity/volume belongs to a cohort, dose or container. Test mixed-age merge and partial transfer, including a recipient or chest, with conserved contents. |
| PC4 | “Original” is an outcome category, not proof of interesting invention. | For a new world, include one useful off-formula product with a real reader, one near miss and one inert/harmful outcome. Choose local mechanisms and source status; do not force identical chemistry on HP and LOTM. |
| PC5 | Large combinatorial spaces can become hard to learn rather than deep. | Compare two trials that differ in one meaningful variable; show observer-safe costs, observed differences and uncertainty. A developer inspector can expose causal traces in test fixtures while player views preserve discovery. |
| PC6 | A process can become unsupported while already running. | Name the law/process revision and committed stage facts needed to finish, recover or reject it explicitly. Test travel/interruption, clock boundary, save/import and a changed definition. Atomic work can stay atomic. |

**LATER / DELEGATE, not dispatched:**

| Order | Proposal | Capability / effort | Done check |
|---|---|---|---|
| A1 | Repair F1/F2 together in the existing runtime seam. | Sol / small implementation | Focused regression proves quote and commit agree for missing access, wrong lots and incompatible process; free mixing and funded treatment still work. Rebuilt 1920×1080 method journey for any UI behavior claim, with AD43 receipt. |
| A2 | Extend one chosen book-world process through acquisition, making, useful off-formula output and use. | Sol / medium, world-law-dependent | Named route and source status, shared envelope where it fits, useful consumer, deterministic frozen input and Save/reload/Export/Import. Book/menu priority retained. |
| A3 | Add one cross-system material loop using existing cooking/gear readers. | Sol / medium | A property changes one real preparation and its downstream use; waste and held catalysts settle; equal known facts do not reveal hidden identity through names/prices/sort. |
| A4 | Probe cohort/container lifecycle before generalizing decay or quantity conversion. | Luna / bounded inspection, Sol if implementation selected | Reproduce or rule out mixed-age merge, partial transfer and restart loss with artificial fixtures; propose the smallest owning seam. |

## Verification and limits

Inputs are a copied dirty-tree snapshot, not HEAD alone. Context HEAD was `712eaf7d7247bdc1369fa02f35b1a4df3335c994`; exact file hashes, aggregate identity and dependency route are in [input identity](procedural-making-2026-10-26/input-identity.json). Later fixture additions did not change copied source/tests. Existing `node_modules` was reused, without installation. A final source comparison found seven concurrently changed source/test files, listed in the document check record; this report’s test evidence belongs to the frozen snapshot, not the later combined tree. Audit scripts used generated materials and named synthetic fixtures, not private saves.

| Check | Result and gap |
|---|---|
| `node --test` with the 22 explicit files listed in [check commands](procedural-making-2026-10-26/commands.txt) | [Focused log](procedural-making-2026-10-26/focused-tests.tap): 167 passing, one unable to load an external fixture script. Earlier attempts lacked copied scripts/packages/static JSON; their logs are retained as harness failures, not gameplay regressions. |
| `node --test --test-name-pattern='equipped native brace' tests/alloy_equipment.test.js`, after supplying its fixture script and data | [Recheck](procedural-making-2026-10-26/alloy-fixture-recheck.tap): one passing. Together 168 distinct focused tests passed across runs; this is not a clean full-suite result. |
| `node .../probes.mjs <snapshot>` | [Probe output](procedural-making-2026-10-26/probes.json): F1/F2 reproduced and equal-chemistry quality boundary confirmed. Script is [retained](procedural-making-2026-10-26/probes.mjs). |
| Targeted local Markdown link check; `git diff --check -- <four changed documentation paths>` | 15 links resolved, no whitespace errors. [Document check record](procedural-making-2026-10-26/document-checks.json). Docs-only edits do not require runtime completion gates. |

Highest state: source-inspected and focused automated checks, including a native headless Save/reload test. No browser screenshots, packaged build, app adoption, natural progression/pacing or human review was performed. No new gameplay was implemented. Future runtime work must meet the existing completion floor; this audit adds no new universal gate.

## Expansion follow-up, 2026-10-26

The requested world differences, interchangeable ingredients and stirring expansion
is saved in [crafting round 15](../CRAFTING_ENGINE.md#round-15-2026-10-26-interchangeable-ingredients-causal-process-and-world-differences):
PC7–PC26 cover role equivalence, blended substitutes, staged processing, causal
stirring, per-world distinctions and adjacent uses; A5–A8 are bounded future
proposals. Current source boundaries were checked, with no runtime edits or new
gameplay verification. This extends the palette, not this audit's test coverage.

The subsequent [foundation round 16](../CRAFTING_ENGINE.md#round-16-2026-10-26-material-foundations-tagging-and-laws-that-consume-them)
adds PC27–PC43 and proposed steps A9–A12: tag implication versus relationships,
typed properties, world semantics, owned lot state, preparation, knowledge,
quantity accounting, authoring support and inspectors. It clarifies the historical
TQ7/TQ10 shorthand without changing standing direction or runtime behavior.

[Round 17](../CRAFTING_ENGINE.md#round-17-2026-10-26-weather-environment-lore-and-where-to-find-ideas)
adds PC44–PC60 for weather/exposure, ecology, lore and targeted idea sources,
plus A13–A15 proposals and the requested independent other-systems audit chat.
The source scout is a bounded entry-point/mechanism check, not new gameplay proof.

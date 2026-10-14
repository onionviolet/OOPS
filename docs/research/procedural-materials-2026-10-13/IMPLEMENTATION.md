# Procedural materials: implementation seams and bounded architecture

2026-10-13. Independent SOURCE audit for the requested parallel research. Owns only this document. Runtime, bundles, private saves and other dirty files were untouched; no build, browser run, commit or publication. The inspected working tree contains active crafting UI and many unrelated documentation/runtime edits, so implementation must recover current writers before reserving files. Line numbers below describe this inspection.

Authority: live `AGENTS.md`, `PROJECT.md`, `docs/USER_VISION.md`, E4/E4B material owners and `docs/PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md`. Original materials and sourced exact ingredients can coexist. Unknown properties operate normally; knowledge governs predictions. One realm and one prestige layer remain the milestone. This report contains proposals, not accepted gameplay rules or an implementation dispatch.

## Verified findings

| Code | Fact and exact source seam | Consequence |
|---|---|---|
| F1 | `Recipe` accepts `getResult` (`src/crafting_recipes.js:45–77`); component/equipment paths already construct results. Ordinary item crafting calls `selected_recipe.getResult()` with no inputs (`src/main.js:4188`) and inserts `item_templates[result_id].getInventoryKey()` (`:4259`). | A computed-result callback alone cannot implement ingredient-dependent consumables. Selection, result contract and publication need adapters. |
| F2 | `find_recipe_material` (`src/crafting_recipes.js:314`) matches ID or `material_type`, sorts variants by base price and can aggregate several stacks. Ordinary crafting consumes the returned stack keys (`src/main.js:4235–4246`). | A chemistry-aware route must retain an explicit allocation of actual variant keys and quantities. Silent cheapest-stock substitution would alter the brew between repetitions. |
| F3 | `Item.createInventoryKey` (`src/items.js:237`) encodes ID/components/quality. `nativeGetItemFromKey` (`:1217`) destructures only those fields. `InventoryComponent.addToInventory` reconstructs a newly seen key through the decoder (`src/components/inventory_component.js:38–44`). | Adding arbitrary composition fields to JSON does not preserve generated behavior. Instance objects passed around during crafting cannot substitute for a complete decoder. |
| F4 | `validateItemKey` (`src/gameplay_transactions.js:27`) checks basic shape, ID/components and quality, while allowing other fields. | A malformed generated extension could pass ownership validation but be ignored by decoding. Two distinct keys could represent the same template behavior. Generated-key shape, canonicalization and reference integrity require explicit validation. |
| F5 | `use_item` reads food/effects/recovery from `item_templates[id]` (`src/main.js:4645–4680`). `add_active_effect` requires named templates and compares their `group_tags` (`:4777–4813`). Restore reconstructs from template and saved duration (`:6706–6707`). | The earlier audit correctly identified three distinct adapters: selected-product use, effect-family policy and complete effect restoration. Merely saving a resolved payload is insufficient. |
| F6 | Trade and chest staging preserve complete keys through `stageAcquisition` (`src/native_trade_transaction.js:7`, `src/native_storage_transaction.js:7`, `src/acquisition.js:39`). Acquisition history aggregates by base ID (`src/acquisition.js:19`). | Do not replace existing transfer machinery. Supply a valid decoder and reference owner. Base acquisition history is not a procedural discovery notebook. |
| F7 | `persistExpansionPlan` validates staged state, copies the envelope, writes owners/native publication, validates the envelope and stores once (`src/expansion_persistence.js:7`). `prepareContextualBalmNative` has separate write/publish steps (`src/contextual_balm_native.js:11`). | Existing durable-first publication is the preferable reusable boundary. The balm adapter is deliberately specific and does not already support arbitrary generated effects. |
| F8 | `beginNativeCraftTransaction` snapshots explicitly supplied owners and rejects Map/Set/internal-slot objects (`src/native_craft_transaction.js:4`). `use_recipe` names its captured owners (`src/main.js:4117`). | A newly added product/knowledge owner is not automatically rolled back. Prefer staged plain records; explicitly enlist owners if extending the mutable native craft route. |
| F9 | `WorkPlans` schema 2 validates finite registered command IDs/revisions and exact terms (`src/feature_expansion_work_plan.js:49,68,86`). Retort hosts freeze accepted reservations and offer a finite three-batch plan (`src/factorio_retort_host.js:44,161`). Shared jobs handle capacity/refunds (`src/simulation.js:238,298`). | Scheduling, reservation and pause/refund mechanisms exist. Player-generated saved procedures do not yet have a compatible work-plan definition or accepted-job reader. |
| F10 | `deriveBraceStats` reads an authored alloy profile (`src/alloy_equipment.js:5`); `SPRINGSTEEL` is fixed. | Reusable material-to-output formulas exist, but this is not evidence of arbitrary alloy chemistry. |

## Prioritized architecture proposal

**P1: Optional, validated product records before new chemistry.** Use a carrier template plus a canonical product reference in the item key. A saved owner holds complete resolved composition, effect payload and revision. Equal gameplay state may share a record; player names, learned labels and observation history do not affect physical identity. Resolve references before reconstructing inventory. Validate every carried, stored, vendor and reserved reference against that owner during full-envelope import. Garbage collection must account for all those holders and active exposures, not just the player's bag.

Separate material definition revision, product-record schema and resolver revision. Preserve old resolved products under their retained semantics unless an explicit migration changes them. Unknown schemas/references must produce a recoverable compatibility response, not fallback to a plain vial with lost behavior. Old saves with no product owner remain unchanged.

**P2: Pure batch resolver and explicit rule contract.** Proposed input:

`resolveBatch({allocations, procedure, station, worldRules, retainedDraws})`

Return debits, catalyst returns, products, waste, dose payloads, observations and an internal cause trace. Inputs are immutable snapshots of actual owned batches. Preview runs the resolver without spending, teaching or drawing randomness. Publication revalidates sequence, exact allocations, access and capacity, then stages all owners and saves once. The trace feeds observer-filtered explanations; it must not reveal hidden truth automatically.

Each reaction rule needs stable ID/revision, world scope, route/operation, positive selectors, optional exact identities, reactant quantities, catalyst conditions, process conditions, products and conflict/priority policy. Use declared units and fixed-point quantities for the first slice. Preserve every constituent, including inert material and trace hazards. Arbitrary magical creation/destruction is possible when an authored world rule explicitly declares it; mundane dilution cannot generate active substance.

Resolve ordered process steps, apply matching rules against available reactants, debit each amount once and retain leftovers. Index candidate rules by operation and relevant material/property. Detect ambiguous overlapping consumption and nonterminating cycles before commit. Computational limits protect execution, not fictional potency. Do not implement an unrestricted scripting language or a universal average of tag strengths first.

**P3: Route-specific use and exposure adapter.** Keep authored effect families, generate validated dose parameters within those mechanisms. Drinking, coating and topical application select different consumers. Define whether each family replaces, accumulates or interacts, including cumulative exposure across repeated doses. Active records retain potency, timing and family revision through reload; expiry remains on the shared game clock. Food and bottle recovery need the same instance-aware boundary. Avoid one permanent global effect-template entry per potion variant.

**P4: Learned procedures over existing timed jobs.** Save ordered operations, exact allocations or declared acceptable selector policies, method revision and desired batch count. At each batch admission bind real available keys; reserve those ingredients, apparatus and receivers through existing scheduler ownership. Freeze accepted terms so changing future preferences does not rewrite an in-flight batch. Cancellation returns actual reservations; shortage pauses with a specific reason. A new finite generated-procedure adapter can compile to the shared scheduler. It should not sneak arbitrary context fields into today's strictly validated WorkPlans cursor.

**P5: Extend only through useful consumers.** A coating can reuse composition but needs combat transfer/durability rules. An alloy can reuse fractions but needs component-stat formulas and thermal treatment. Food needs nourishment and spoilage adapters; inks need inscription rules. Sharing batch facts does not mean copying all properties onto every output. Every process defines retention, destruction or transformed availability.

## Design reconciliation

**C1:** E4's property-only rules conflict with exact ritual identity and the later substitution research. Support exact-ID, profile and mixed-role selectors. Physical fit does not grant canon ritual equivalence.

**C2:** E4B's later user correction and `USER_VISION.md:303–317` resolve half-understood substitution. Known-safe filtering and permissive trials can coexist; no extra ignorance penalty follows.

**C3:** E4's count-weighted averages/top-tag outputs and “drop unknown tags” loading proposal are inadequate for saved procedural products. Presentation summaries can be compact; effect-bearing truth needs complete retained records. Old fixed schema suggestions are not authority over the live save readers.

## Finite acceptance probes

| Code | Probe |
|---|---|
| A1 | Two distinct products and one equal product: exact decoder/key consistency, correct stack merging, storage split/merge, vendor transfer and full-envelope import. Old-save absence stays inert; dangling references reject recoverably. |
| A2 | Ratio and operation-order controls: one documented desired effect and side effect change for explained reasons; dilution/splitting conserve active amounts and trace hazards. Repeated preview changes no inventory, knowledge or RNG. |
| A3 | Product use affects real native vitals/stats; repeated dose, conflict, expiry and active-payload save/reload/import agree. Topical/oral controls differ only under declared route rules. |
| A4 | An admitted repeated method survives reload, refunds exact held inputs on cancellation, pauses on shortage and cannot double-produce after retry or failed persistence. |
| A5 | Rebuild and play one complete paid acquisition → mixing → observation → useful use → repeated production journey at 1366×768 and a wider desktop. Save/reload and literal-file import are required. Mobile and unrelated world expansion stay deferred. |

Ran `node --test tests/native_craft_transaction.test.js tests/contextual_balm.test.js tests/native_storage_transaction.test.js tests/acquisition.test.js tests/fa11_retort.test.js`: **44 passed, zero failed**. These verify existing SOURCE rollback, staged treatment, ownership/trade, chest and retort contracts. They do not verify proposed composition, procedural effects or rebuilt gameplay. A1–A4 are parts of one playable slice, not separate claims of completion.

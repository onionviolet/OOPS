# Procedural materials and alchemy: implementation audit and deeper proposal

Date: 2026-10-13. Scope: live source inspection and design reconciliation. No gameplay changes, build, browser run, private save access, commit or publication. Findings describe the inspected working tree, which already contains unrelated edits and active crafting-screen work. This audit owns only this file. Proposals are not accepted decisions or an implementation dispatch.

User request: audit implementation and deeper ideas, including procedural potions from mixing types of things so every small outcome does not require a separately authored item.

Follow-up: Weibao explicitly requested subagent audits covering procedural rules, broad materials, book/non-book/wiki sources and related crafting systems. The [joined research report](research/procedural-materials-2026-10-13/REPORT.md) integrates five disjoint lanes and qualifies the additional source evidence. This initial audit remains a source/design snapshot, not a competing implementation specification.

## Direction and authority

[User vision](USER_VISION.md), [materials design](emergent/E4B_MATERIALS_AND_NOITA.md), [tags draft](emergent/E4_TAGS_AND_RULES.md), [granular interactions](GRANULAR_SYSTEMS_AND_INTERACTIONS.md#G3-materials-and-logistics-need-owned-usable-outputs) and [Noita substitution research](research/noita/ALCHEMY_AND_SUBSTITUTION.md) are the relevant owners. The tags draft is explicitly a proposal. Noita findings support research, not proof of YAIR implementation.

Standing direction: true properties operate whether known or unknown; experimenting with partly understood materials is allowed by default, subject to local lore/permission. Knowledge changes predictions, not physical truth. Exact canon ingredients and functional substitutes can coexist. Cross-world strength needs relevant local compatibility rather than one universal grade. Preserve old saves and original items. First milestone remains one realm and one prestige layer.

If UI is implemented, target 1366×768 laptop first, with a wider desktop check. Visible outcome: ingredient quantities, useful process choices, known predictions and uncertain observations, then an owned usable product. Mobile optimization is deferred. Existing crafting-screen work must be reconciled before reserving overlapping runtime files.

## Verified implementation findings

| Code | Live source finding | Implication |
|---|---|---|
| F1 | `src/items.js/Item` carries category tags, material type, quality and components. `src/crafting_recipes.js/find_recipe_material` matches ID or material type. | Reusable selection foundations exist, but this is not a numeric property-profile resolver. |
| F2 | The alchemy catalogue in `src/crafting_recipes.js` names fixed ingredients and fixed `result_id` outputs. Recipe has a `getResult` hook; component/equipment subclasses compute results. | Computed outputs have precedent. The ordinary consumable path still needs a complete generated-item adapter, not merely a new callback. |
| F3 | `src/main.js/use_item` reads `item_templates[id].effects` and recovery chances rather than the selected instance's resolved chemistry. | Two generated variants under the same base item ID would otherwise apply the same template effects. Changing the tooltip alone would misrepresent gameplay. |
| F4 | `src/main.js/add_active_effect` requires an entry in `effect_templates`, including group comparisons. Save writes active effect objects, but load reconstructs them from template plus duration. | Saving a dynamic effect object alone is insufficient: its payload can be lost or unsupported on reload. Application, conflict handling and restoration need one compatible contract. |
| F5 | `src/items.js/createInventoryKey` normally serializes ID/components/quality. `nativeGetItemFromKey` decodes those fields; `src/components/inventory_component.js` reconstructs through that decoder. Special measured-material and durability bindings exist. | Extra JSON fields are not general support for generated mixtures. Distinct composition must survive reconstruction, storage, trade, reservations and imports. |
| F6 | `src/native_craft_transaction.js` and `src/main.js/use_recipe` support rollback before durable native craft publication. Contextual balm has staged native-effect handling. | Reuse publication patterns, but explicitly include new mixture/effect/knowledge owners. Existing transactions do not automatically capture an added registry or private owner. |
| F7 | Inspection found authored material-use/assay systems and contextual care, but no general composition-to-generated-potion pipeline in the inspected source. | These are useful patterns, not evidence that procedural chemistry already exists. |

### Design conflicts to reconcile before implementation

| Code | Historical wording | Current interpretation |
|---|---|---|
| C1 | E4 says interaction rules never name things; Noita substitution research supports identity and property selectors. | Permit exact-ID rules, profile rules and mixed-role recipes. Ritual identity is not interchangeable merely because physical properties match. |
| C2 | E4B's earlier subsection requires understanding a checked property before substitution; its later Q14 answer and user correction allow trials. The older research note still calls Q14 open. | Safe recommendation filters known fits; trial accepts unknown fits where permitted and resolves true properties. Q14 is answered. |
| C3 | E4's proposed compact/top-tag item representation and averaging can discard constituents. | Retain full composition amounts, including trace hazards and inert fractions. Derive presentation tags without replacing material truth. |
| C4 | Old drafts name fixed future engine schema numbers and compatibility assumptions. | Choose the next schema against live code at implementation time. Unsupported meaningful records require a clear compatibility response, never silent property loss. |

These are findings for the owners, not edits to their accepted direction.

## What should be procedural?

P1: Author reusable mechanics, then generate combinations from them. Three distinct mechanisms matter:

| Mechanism | What changes | What remains authored |
|---|---|---|
| Derived mixture | Ingredients, ratios and process produce resolved behavior | Material properties, process operators and effect laws |
| Seeded material generation | Regional species, deposits or batches receive a stable property bundle | World-compatible families, correlations, rarity and acquisition routes |
| Seeded discovery recipe | A world's selected secret has persistent ingredient roles and conditions | Allowed recipe grammar, lore constraints and worthwhile output |

The first needs no random outcome assignment. Identical inputs and process under identical conditions should have identical chemistry. Skill-dependent procedural variation can be a separate saved draw. Randomized worlds can change underlying material truth once, rather than rerolling it each experiment.

We still author what healing, sedation, corrosion or an affinity actually does. Combinatorial generation removes the need for a separately coded item for each combination; it cannot invent implemented mechanics from arbitrary words.

## Proposed composition and resolution contract

P2: Keep five records separate:

| Record | Minimum meaningful contents |
|---|---|
| Material definition | Stable ID/revision, origin, phase, functional properties, route responses and relevant exclusions |
| Owned batch | Actual material fractions and amounts with units, condition, purity/contaminants and any generated property overrides |
| Process | Ordered operations, actual station/tool access, heat/time/pressure when relevant, catalyst roles and reservations |
| Resolved product | Remaining constituents, useful active compounds, waste/byproducts, route-specific effect payload, resolver revision and provenance |
| Knowledge | Who observed which property/result, procedure and confidence; never a second chemistry state |

For initial measurements use fixed declared units and exact integer quantities where practical. Do not compare one leaf with one barrel by count or assume every material has the same density. The material catalogue supplies any needed conversion.

Proposed pure resolver:

`resolveBatch(ownedInputs, procedure, stationContext, worldRules, committedDraws)`

returns `inputDebits, retainedCatalysts, product, byproducts, observations, causeTrace`. It computes a proposed state only. The existing publication layer revalidates ownership, reserves/consumes inputs, stages outputs and knowledge, then writes all together. Failed persistence restores all included owners. A preview must neither spend inputs nor advance random draws.

Resolution order: validate access/quantities; execute ordered process steps; match applicable exact/profile reaction rules; consume each reactant once; retain leftovers and catalysts; resolve route-specific dose behavior; construct the stable product identity. Define rule priority and conflicting consumption explicitly. Reject an unresolved computational loop before commitment rather than consuming resources and returning a silently truncated product. Bound computation, not the permitted scale of an authored fictional effect.

P3: Store products under a base carrier such as a prepared vial plus a canonical product reference. The saved product catalogue contains the full validated record. Identity includes relevant composition, procedure outcome and resolver version; dose/container state belongs to the appropriate batch or instance. Equivalent products can share a stack when their gameplay-relevant state is identical. Naming and player knowledge must not alter physical identity. A reference must be resolvable after transfer or full-envelope import, and never point only to a session-local cache.

Resolve material changes when events occur or at the next meaningful game-time boundary. Avoid scanning every possible material pair every tick. Index rules by route and positive selector; cache stable products and invalidate only relevant changes.

## Worked fictional potion example

P4: Use invented ingredients here; these are illustrative rules, not existing YAIR material properties or real chemistry.

An herb contains a restorative fraction and a sedating fraction. A mineral can neutralize one irritating fraction. Water supplies solvent and affects concentration. A binder slows delivery. Heating can improve extraction but destroy a heat-sensitive fraction.

| Input/process change | Derived consequence |
|---|---|
| More water, same active amount | Lower concentration per sip; more total volume. Whole-batch active amount stays accounted for. |
| More herb per vial | More restorative dose and more sedation unless a process separates them. |
| Controlled extraction | Better recovery of the desired fraction under its declared process rule. |
| Excess heat | Heat-sensitive active fraction converts to an authored byproduct; lower desired effect and possibly a new side effect. |
| Binder | Slower delivery and longer duration if compatible; not free additional total healing. |
| Specific neutralizer | Consumes the matching irritating fraction and leaves an accounted byproduct. It does not remove all bad properties by category. |

One set of ingredient/process/effect rules yields diluted, concentrated, sedating, slow-release and damaged brews without separately creating every potion template. A failed useful reaction may leave an inert mixture or recoverable material rather than deleting everything. Some combinations produce no reaction; coexisting constituents can still have independent effects when used.

Dose response can be nonlinear. Specify onset, total effect, duration, saturation, overdose and interactions per effect family. Multiple small doses and one large dose need coherent cumulative exposure. Drinking, skin application, coating a blade, inhalation and pouring are distinct routes; a topical benefit is not automatic oral healing.

## Deeper systems enabled by the same foundation

| Code | Idea | Useful behavior and constraint |
|---|---|---|
| P5 | Separation and purification | Filter, distill, settle, bind or extract a useful fraction. Track recovered fractions and actual waste; repetition cannot create free mass or duplicate catalysts. |
| P6 | Order and apparatus | Heating before mixing can differ from heating afterward. Grind size, sealed/open vessel and station capability matter only when a rule consumes those facts. Avoid empty controls. |
| P7 | Material families and regional generation | Generate coherent local herbs, salts or ores from families and environmental modifiers. Correlated traits make research transferable; do not randomly attach unrelated powers to ordinary plants. Canon specimens retain canon rules. |
| P8 | Research as inference | Sample trials reveal specific observations. A notebook can compare two experiments, propose a property and preserve uncertainty. A failed test teaches only what that test distinguishes. Repeated identical observations do not grant endless research XP. |
| P9 | Discovered production methods | Save exact procedure plus acceptable substitutions, expected yield and stop conditions. Timed/queued work repeats a learned method with actual stock and station access. This supports idle progression without repeated manual experimentation. |
| P10 | Reliable manufacture versus improvisation | Known method offers predictable work; experimentation changes selected variables. Skill improves control, extraction or precision through authored mechanics rather than secretly changing true material properties. |
| P11 | Cross-system products | The same substrate supports salves, inks, coatings, alloys, fertilizers, food and fuel through separate process/consumer adapters. Do not auto-copy every ingredient trait into every output; rules decide retention, destruction and release. |
| P12 | Context-sensitive use | Body state, species, immunities, exposure route and world rules affect response. Potion benefit and side effect can coexist. An imported material's unfamiliar origin alone neither disables it nor proves compatibility. |
| P13 | Trade and reputation | Vendors value useful identified batches, guaranteed quality or authenticated origin. Unknown mix value is not automatically the sum of valuable tag names. Local certification and fraud only matter where authored. |
| P14 | Spoilage and changed state | Age, light, heat or contamination alter only materials with relevant laws. Save absolute game-time boundaries and resulting composition; avoid universal upkeep on every object. |
| P15 | Rare reactions and lore exceptions | Authored rare material/rule combinations can have extreme consequences. Rarity and lore provide discovery structure; ignorance does not introduce an unrelated danger roll or secret safety cap. Refer to sealed discoveries only through allowed routes. |

## Implementation hazards and decisions

| Code | Hazard | Required treatment |
|---|---|---|
| R1 | Product works before reload but loses behavior afterward | Versioned complete product/effect records and loaders; save active exposure payload and timing, not duration alone. |
| R2 | Identical-looking stacks erase meaningful differences | Canonical identity and a complete decoder; audit sorting, favorites, sale/storage, acquisition log and reservations against selected full keys. |
| R3 | Generated names reveal unknown traits | Derive descriptions from the observer's knowledge. Unidentified products retain neutral observed descriptions; internal truth stays private. |
| R4 | Mixing, splitting or dilution creates resources or erases trace poison | Conservation checks for every constituent or explicit authored transformation. Preserve small fractions independently of UI rounding. |
| R5 | Generated effect IDs bypass existing stacking | Effect-family policy for replacement, accumulation, synergy and cumulative exposure. Do not register arbitrary permanent templates for each vial. |
| R6 | Updates change old recipes/products | Save resolved records with revisions. Explicit migration or retained version semantics; do not recompute old truth from a new catalogue silently. |
| R7 | Irrelevant draws or repeated previews reroll chemistry | Stable world/batch identities and purpose-specific committed draws. Deterministic chemistry separate from execution variation. |
| R8 | Output combinations make inventory/UI unusable | Group comparable variants, offer a readable summary and expandable composition, and retain exact selection. Computation/UI limits must not silently discard effect-bearing constituents. |
| R9 | Solver makes every substitute work everywhere | Functional profiles, exact ritual requirements, availability, lore and meaningful property exclusions. Keep ordinary recipes viable. |

Balance should consider useful dose, acquisition effort, delivery time, apparatus, stability and side effects. Do not use a single additive tag score to price or strengthen everything. Procedural outcomes require designed rules and selected interaction coverage; they do not remove all content work.

## Recommended bounded build sequence

| Code | Slice | Observable completion gate |
|---|---|---|
| A1 | Optional material/batch owner, canonical product identity and reconstruction | Distinct variants round-trip through native inventory, storage and full-envelope import; old saves remain compatible. No new chemistry claim yet. |
| A2 | One Village mixing process, several fictional ingredients, ratio-sensitive output and one process distinction | Two input combinations derive different usable products without separate result templates; preview and failed save leave stock/draws unchanged. |
| A3 | Generated effect application and restoration | Product use changes an actual native stat/vital or supported condition; side effect, dose, expiry, stacking and save/reload/import retain the exact effect. |
| A4 | Discovery and repeatable timed production | One unknown property is learned from an actual experiment; a saved learned method repeats with exact input choice and stops on shortage. |
| A5 | One further adapter after that slice is playable | For example a coating or regional substitute uses the same batch facts and a different route, with its own meaningful native outcome. |

A1–A4 are pieces of one first playable slice, not independent completed waves. A torch remains a useful smaller identity/substitution probe, but it would not demonstrate procedural potion composition, dose or generated effect restoration. No whole-world chemistry, mobile gate or new prestige layer is required for this slice.

## Checks and evidence limits

Ran `node --test tests/native_craft_transaction.test.js tests/contextual_balm.test.js`: 21 tests passed, 0 failed. This checks existing rollback/publication and authored contextual-treatment behavior only. It does not test a generated potion, a new resolver or native browser acceptance.

Static inspection covered recipe selection/results, item identity/reconstruction, inventory insertion, native crafting rollback, consumable application, active-effect stacking and active-effect restoration, plus the linked design/research owners. Runtime files were not edited. Current line numbers may move because other work is active.

Required future checks: constituent conservation across mix/split/dilute; independent rule-order and process-order cases; exact/profile slot cases; hazardous trace retention; preview purity; cancellation and persistence failure; deterministic world generation and saved revisions; complete product/effect restoration; old-save absence; knowledge without truth leakage. Then rebuild and exercise the whole paid acquisition → mixing → discovery → use → repeat-production journey on a fresh laptop-sized browser origin, including Save/reload and literal-file export/import. Human taste and balance acceptance remain distinct from those technical gates.

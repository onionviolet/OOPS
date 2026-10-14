# W4 report: implementation implications and abstractions

2026-10-14. **DOCS COMPLETE / PROPOSALS ONLY.** Scope: read-only live-code audit
and contract comparison. Owns exactly `IMPLEMENTATION.md` and this report.
No source, bundle, test, save or private-pack edits; no runtime tests/build/browser,
staging, commit or push. Unrelated dirty state and concurrent lane writes were
preserved. No sealed files or private novels were opened.

## Written

| Code | Artifact | Contents |
|---|---|---|
| W4-A | [IMPLEMENTATION](IMPLEMENTATION.md) | CHECKPOINT, five source findings; individual IM1–IM12 and AB1–AB12 comparisons; shared records/owners; P38/P39/P40 and foundations reconciliation; illustrative item envelope and five migration steps; combat adapter path; six proposed performance budgets; ten determinism hazards; five ordered playable slices and their gates. |
| W4-B | This report | Evidence boundary, source inventory, verification and unresolved joins. |

## Main findings

| Code | Finding | Implication |
|---|---|---|
| F1 | Live weapons already have template parts, weapon-type selection and computed scalar attack (`src/items.js:939-1008`, `src/crafting_recipes.js:255-289`). | Add instance truth and real consumers through this path. A new separate weapon engine is unnecessary for the first blade. |
| F2 | P1 streams/P2 mixture code now exists in main (`src/main.js:1-8`, `src/mixture_state.js:15-98`). Older materials/P6/root status wording describes an earlier read. | Refresh integration and proof before implementing; do not treat source presence as rebuilt acceptance or redo a presumed missing merge. Owners were read-only and were not corrected by W4. |
| F3 | Decoder and equipped-item loader differ; optional E2 wear wraps methods and acts per landed hit (`src/items.js:1217-1268`, `src/main.js:5696-5722`, `src/absorb_e2/durability.js:42-77`, `src/models/combat.js:402-406`). | Generated state needs all-holder restoration; wear/profile composition must have exactly one selected owner. IM5 batching is a new compatibility decision, not today's semantics. |
| F4 | Derived snapshot prototype is a world-event fact module; P38 now proposes definition/lot/copy refs and one settled log. | Use purity/revision precedent and shared refs. Do not claim a ready item-cache API or create a competing maker biography log. |
| F5 | Scheduler stops each advance at 512 causal boundaries, while host begins a synchronous remainder drain (`src/expansion_engine.js:599-640`, `src/main.js:1251-1255`). | That count protects causal work, not browser responsiveness. Runtime millisecond/save-size budgets in W4 are unmeasured candidate gates. |

## Sources read

Repository-relative paths; source locators in IMPLEMENTATION refer to the
working tree, not an installed build. Large owners were read at their relevant
sections. This inventory is read evidence, not a claim to have executed them.

| Code | Owner / contract inputs |
|---|---|
| O1 | `COMMON.md` first; root `AGENTS.md`, `PROJECT.md`, `~/.claude/user-preferences.md`; `docs/USER_VISION.md` accepted direction; `docs/WEAPONCRAFT_RUNES_AND_MAKER_ARTS_CONSIDERATIONS_2026-10-14.md`. |
| O2 | `docs/gm/dispatch/procgen-2026-10-13/p6/SMITHING.md`, `PATTERNS.md`, `REPORT.md`, `COATINGS.md`, `REPAIR_SALVAGE.md`, `CONSTRUCTS.md`, `TOOLS_TEXTILES.md`; `docs/PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md`; `docs/PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md`; relevant assembly/quality/craft/knowledge sections of `docs/worlds/PROGRESSION_AND_ASSEMBLY.md` and `docs/TECHNOLOGY_AND_PROGRESSION.md`. |
| O3 | P38/P39/P40 briefs and checkpoints; P38 `ENTITY_REFS.md`, `RECEIPT_LOG.md`, final-refresh relevant sections of `STORE_OWNERS.md`, `RETENTION.md`, `MIGRATION.md`, `DUPLICATES.md`; P39 `REGISTRY.md`, `BUDGETS.md`; P40 `SOURCE_SNAPSHOT.json`, `FINDINGS.md`; root BI/BJ/BK/BL sections in `docs/PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md`. |
| O4 | `docs/gm/dispatch/derived-snapshots-2026-10-14/GOAL.md`, snap/saveshape/offline `runs/*.last.md`; `docs/research/PROFILE_AND_BRANCH_SAVE_SHAPE_2026-10-14.md` and `OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md` relevant sections. Reported tests there are sibling evidence, not W4 checks. |
| O5 | Core-foundations `COMMON.md`, A1–A5 briefs; `docs/CORE_FOUNDATIONS_SCORECARD_2026-10-14.md`; world-core K rows and `docs/worlds/world-core-kit-2026-10-14/W6_ENGINE_TEMPLATE.md` owner/adapter sections. |

| Code | Live code inputs |
|---|---|
| S1 | `src/items.js`: keys, component types, quality/stat composition, weapons/armor naming, factory/decoder; `src/crafting_recipes.js`: material-result selection, component/equipment output/quality, authored material rows; `src/alloy_equipment.js` and `src/artifact_collection.js`. |
| S2 | `src/models/combat.js`, `src/combat_math.js`, `src/combat_stances.js` searches; `src/enemies.js` loot; `src/models/person.js`, `src/components/levelable_component.js`, `src/components/equipment_component.js` and `inventory_component.js`; `src/structured_equipment_runtime.js`; `src/absorb_e2/durability.js`. |
| S3 | `src/main.js`: craft stream/rollback, scalar native contexts, equipment/save/load, mixture publication, scheduler host; `src/native_craft_transaction.js`, `src/native_equipment_transaction.js`, `src/gameplay_transactions.js`; `src/save_files.js`, `src/save_migration.js`, `src/save_compatibility.js`. |
| S4 | `src/mixture_state.js`, `src/mixture_native.js`, `src/seeded_streams.js`, `src/misc.js`; `src/expansion_engine.js`, `src/simulation.js`, `src/simulation_contracts.js`, `src/simulation_effects.js`, `src/people_knowledge.js`, `src/world_knowledge.js`, `src/chronicle.js` relevant store and knowledge paths. |

## Checks and remaining joins

W4 performed static reads and 24 row-by-row contract comparisons. No runtime
suite was run, consistent with the read-only task. Document validation passed all 12 IM and 12 AB rows, local Markdown link
targets and prohibited-punctuation checks. Git status shows exactly these two
owned outputs as untracked; neither was staged. Runtime behavior, new migration, conservation properties,
performance measurements, rebuilt browser play, Save/reload/literal-file Import
and director acceptance are all **OPEN** for these proposals.

| Code | Open join / proposal default | Owner / acceptance |
|---|---|---|
| Q1 | Entity/store/retention/migration proposals appeared during this run and were refreshed. Default follow P38's `{kind,id}`, definition/lot/copy model, knowledge façade and transitive pins, with existing holders and one outcome log. | P38 and core A1 choose wire versions/integrator; no W4 schema number or competing store. |
| Q2 | Item profile module/API and cache owner are not provided by the world-anchor prototype. Default pure consumer projection keyed by every dependency revision. | Family owner + native consumer integrator; full/incremental/legacy-control and withdrawal tests, then rebuilt play. |
| Q3 | Preserve E2 legacy per-hit wear by default; select batched wear only for an explicit law with equivalent partitioned outcomes or a declared compatibility change. | P6 repair/assembly + combat/save owner; no double wear, exact identity/condition and pending-strike resume proof. |
| Q4 | Final refresh found P39 BUDGETS and P40 FINDINGS. W4 now aligns 0.25 ms hot maker, 1.5 ms combined new consumers and 256 KiB combined pilot targets; maps relevant P40 hazards. Finished waves/reports and core lane results still need refresh before dispatch. | Refresh sibling outputs before source dispatch; measure the chosen laptop fixture and reconcile phases, storage and yield behavior. |
| Q5 | Default first useful slice is P6 S3-A braces, then actual repair, scalar blade combat, lawful appraisal and the P6 work lamp. Broader geometry/runes/canon/offline remain selectable dials. | Coordinator/director selection; finish each paid native use and persistence journey before calling its slice playable. |

These are integration questions with proposed defaults, not requests for Weibao
to repeat standing direction and not implementation authorization.

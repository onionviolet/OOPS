# W4: maker implementation against live code

## CHECKPOINT

2026-10-14. COMPLETE read-only source/design audit; proposals only. Owns exactly
this file and `W4_REPORT.md`. No runtime edits, tests, build, browser run, save
access, staging, commit or push. Resume by refreshing source locators and the
in-flight P38/P39/P40 outputs before reserving any implementation files.

Read snapshot: branch `codex/gameplay-foundations`, observed HEAD
`e07fc507b23100361a0a27a95042c338de73ec18`; the checkout has extensive unrelated
changes and concurrent writers. HEAD is context, not a fingerprint of dirty
source. Locators below refer to actual working-tree reads in this lane.

Evidence: **SHOWN** means read source or owner text with a locator; **INFERRED**
means W4's proposed design. All suggested APIs, shapes, budgets and slice choices
are INFERRED, not allocated schemas or implemented functions. “Tested against
code” below means a static contract comparison, not an executed test suite.

## Direction and main findings

[COMMON](COMMON.md), [root palette](../../../WEAPONCRAFT_RUNES_AND_MAKER_ARTS_CONSIDERATIONS_2026-10-14.md),
[USER_VISION](../../../USER_VISION.md), [PROJECT](../../../../PROJECT.md) and
[AGENTS](../../../../AGENTS.md) govern this lane. Preserve one realm and one
prestige layer, useful queued/idle play, truth independent of knowledge,
reload-stable outcomes and sealed discoveries by ID. The broad menu is not a
required implementation gate. Proposed visible target: two differently made
objects with different useful outcomes at **1366×768**, plus **1600×1000**;
mobile optimization and general closed-browser catch-up remain deferred.

| Code | Finding and evidence | Consequence |
|---|---|---|
| F1 | SHOWN: weapons already combine head/handle templates, choose five weapon types and derive scalar attack (`src/items.js:939-1008`); recipes construct those objects (`src/crafting_recipes.js:255-289`). | The palette's “weapons are authored items” is incomplete. Reuse this path; missing pieces are generated per-part truth, interface records, geometry and mutable identity, not the first component-based weapon. |
| F2 | SHOWN: P1 streams and P2 mixtures are present in main (`src/main.js:1-8`, `src/seeded_streams.js:23-39`, `src/mixture_state.js:15-98`). | The materials audit F7 and P6 REPORT F2 describe an older snapshot. The palette's merge-first suggestion needs a refreshed integration/proof check, not an assumed absent dependency. Source presence does not establish browser acceptance. |
| F3 | SHOWN: keys normally encode ID/components/quality (`src/items.js:231-253`), identical keys share one item/count entry (`src/components/inventory_component.js:40-52`). Equipped weapons load through a separate component reconstruction (`src/main.js:5696-5722`). | Appending arbitrary JSON fields is insufficient. A complete decoder and all-holder restore are the largest change. A stack cannot carry several different histories or wear states. |
| F4 | SHOWN: optional durability adds `e2_instance`, retains a condition ledger and wraps attack/defense methods (`src/absorb_e2/durability.js:7-15,22-77`). Native hits update wear and recompute player stats (`src/models/combat.js:402-406`). | IM5's proposed batching conflicts with current per-landed-hit behavior. Preserve legacy semantics; a new selected law needs its own batched accounting and must avoid double wear. |
| F5 | SHOWN: combat reads actor scalar stats and shield strength; armor also has an authored body/coverage projection (`src/models/person.js:287-305,318-327,627-633`, `src/models/combat.js:353-427`, `src/structured_equipment_runtime.js:43-90`). | Scalar adaptation can ship early. Reach and cut/thrust need named combat consumers; body coverage facts do not prove a native hit-location damage model. |

## IM1–IM12: static contract tests

“Partial” identifies reusable source, not acceptance of the proposed feature.

| Code | Exists today, SHOWN | Needed, INFERRED | Conflict / gate |
|---|---|---|---|
| IM1 | ID/components/quality key; P2 product catalogue + key references (`src/items.js:238-253,1217-1268`; `src/mixture_state.js:61-74`). | Optional versioned definition/lot/copy envelope; per-part material and structural state; patterns and charge only when used; refs to bond and receipts. | Player equipment saves objects, NPC slots save keys (`src/main.js:5003-5014,5100`; `src/native_equipment_transaction.js:26-29`). Validate and decode both before publication. |
| IM2 | Closed component-type checks and head/handle combinations (`src/items.js:398-426,954-975`). | Family interface registry with typed mounts, tolerances, child-copy refs and lawful swap/removal. | Existing assembly discards input-copy identities in favor of template IDs (`src/crafting_recipes.js:263-287`). Do not represent a worn child by its template name. |
| IM3 | Memoized attack; pure authored brace/armor projection (`src/items.js:987-1004`; `src/alloy_equipment.js:5-8`; `src/structured_equipment_runtime.js:43-91`). | Pure item/actor/technique/law projection and revision-keyed cache; invalidate on supported mutations. | Existing cache has no dependency key. World anchor snapshots are a different input/output contract, see C3 below. |
| IM4 | Artifact compilation rejects recipe cycles, validates exact stock, reserves carrier (`src/artifact_collection.js:50-75,100-112`). | Typed executable ports, finite operator registry, topology/trigger evaluator and one real energy payer. | Recipe DAG is not a signal graph. Fixed disassembly refunds original ingredients (`:90-97`); applying it to a worn/consumed graph would recreate matter. |
| IM5 | Exact optional worn copy and staged coin repair (`src/absorb_e2/durability.js:103-152`). | Per-law use counters/receipts, fractional residuals and settlement at declared boundaries. | Wear changes current attacks per hit. Batch only a law proven equivalent or explicitly selected as new; offline aggregation must preserve failure thresholds. |
| IM6 | Item acquisition summary (`src/items.js:99-116`); P2 exact-product oral observation (`src/mixture_native.js:16-22`); simulation staged knowledge (`src/simulation_effects.js:281-285`). | Subject/property/protocol knowledge view, observer, basis, fidelity, time and revision; reveal grants write there. | Product observation is not general material mastery. Existing `seen/interpreted/understood` stages (`src/simulation_contracts.js:66,249`) are not numeric F0–F5 tiers. Use an explicit mapping, no automatic upgrade. |
| IM7 | Legacy decoder plus special mixture and durability handling (`src/items.js:1217-1268`). | Read-only legacy definition views; copy promotion only for a selected mutable consumer. | “Wrap, not migrate” means retain old wire meaning. Do not eagerly allocate IDs for every fungible copy or alter old quality/rarity/brace effects. |
| IM8 | Pure `unitDecision`; stateful draw/keyed APIs; seeded craft view (`src/seeded_streams.js:46-77,102-110`); native recipe uses craft stream (`src/main.js:4214,4254-4266`). | Paid job/cause ID plus purpose/operator revision; freeze execution inputs/draws with admission. | Craft stream is global (`src/seeded_streams.js:42-44`); keys name recipe, not a future job. `keyedUnit` writes diagnostics, so it is not a pure preview API. |
| IM9 | `getAttack` → Person full attack power → stamina-adjusted accessor → Combat (`src/items.js:987-1004`; `src/models/person.js:627-633`; `src/components/levelable_component.js:328-333`; `src/models/combat.js:206-208,353`). | One profile adapter at stat composition, followed by a typed strike context only for newly consumed axes. | Technique fit must not stack skill/stance multipliers twice. Reach is absent from this path. Pending attack loops freeze attack power (`src/models/combat.js:211-217`), so restore needs an explicit boundary policy. |
| IM10 | Weapon prefix/type names, armor composed names; P2 knowledge-filtered text (`src/items.js:916-935,1007-1008`; `src/mixture_state.js:75-79`). | Observer-safe grammar from known properties and witnessed condition; cache on knowledge/condition revision. | Truth-derived title, sort, price or comparison can leak an unknown flaw. Grammar does not grant an observation. Preserve authored names as defaults. |
| IM11 | Keyed inventories; native slot snapshots; all-envelope mixture reference traversal (`src/components/inventory_component.js:13-15`; `src/native_equipment_transaction.js:9-10`; `src/mixture_state.js:84-89`). | Owner/location indexes, visible-page projection, lazy derivation and dependency indexes. | Current traversal is linear at validation; do not repeat it each render. A hidden filter must apply before counts/pagination, as P38 BI2.3 proposes. |
| IM12 | Existing mixture/stream/equipment/save test files are present; conservation checks in `src/mixture_state.js:53-70`; import preflight (`src/save_files.js:195-201`). | Envelope golden fixtures, conservation properties, failure injection, replay and exploit sequences below. | No new suite was run by W4. Existing tests cannot prove the new envelope, graph or native combat. Source, persistence, rebuilt play and taste remain separate gates. |

## AB1–AB12: shared records and owners

Owner here means the existing design/contract owner to extend. It does not grant
that lane exclusive runtime write ownership. Runtime integration needs one
explicitly assigned writer for each shared file; no new owner is selected here.

| Code / record | Present source, SHOWN | Proposed shared owner / users, INFERRED | Missing or conflicting contract |
|---|---|---|---|
| AB1 Process plan / execution | P2 `steep/boil`, exact reservations/due (`src/mixture_state.js:47-62`; `src/mixture_native.js:23-35`). | [Materials five records](../../../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md#proposed-composition-and-resolution-contract), [P6 C9–C14](../procgen-2026-10-13/p6/REPORT.md): smithing, brew, cook, inscription, tanning. | Finite ordered operators with units, frozen means, skill terms, law revision, cancellation boundary and job draw refs. P2's oral packs are not a universal process interpreter. |
| AB2 Assembly / interfaces | Two-component weapons/armor and exact authored artifacts (`src/crafting_recipes.js:255-289`; `src/artifact_collection.js:80-97`). | [P6 SMITHING](../procgen-2026-10-13/p6/SMITHING.md), [assembly lifecycle](../../../worlds/PROGRESSION_AND_ASSEMBLY.md): weapons, armor, tools, devices. | Nested child identity, single physical parent/holder, tolerance and reversible refit; templates cannot substitute for actual installed parts. |
| AB3 Pattern / channels | Authored carrier uses only (`src/artifact_collection.js:100-112`). | [P6 PATTERNS](../procgen-2026-10-13/p6/PATTERNS.md): runes, arrays, traps, lamp. | Separate pattern definition from carrier, fuel and installed state. Signal cycles require an explicit delayed/feedback operator law, not an unbounded loop or universal recipe-cycle ban. |
| AB4 Material / batch / response | Authored alloy profile (`src/alloy_equipment.js:1-8`); retained P2 fractions (`src/mixture_state.js:17-37`). | Materials audit L1 and P6; family adapters own response tables. | Units and full trace accounting; process/damage responses per family. Do not turn the four oral fractions into blade cut/heat responses. |
| AB5 Condition / wear | E2 scalar 0–100 ledger; structured fit/maintenance flags (`src/absorb_e2/durability.js:22-40`; `src/structured_equipment_runtime.js:55-58`). | [P6 repair](../procgen-2026-10-13/p6/REPAIR_SALVAGE.md), assembly lifecycle; body/building owners retain their domains. | Sparse typed vector (edge, cracks, joints, inscription as supported), law/revision and use residuals. No single universal durability scalar or mandatory upkeep. |
| AB6 Knowledge / fidelity | Simulation knowledge and separate P2 owner (`src/simulation_contracts.js:249`; `src/mixture_state.js:39-40`). | [P38 STORE_OWNERS](../procgen-2026-10-13/p38/STORE_OWNERS.md) owns the proposed `knowledge_state` façade; appraisal/cheat and material owners own routes. | Default one observer read interface over existing stores first. Map subject/property/fidelity/basis, do not duplicate truth or erase typed legacy knowledge. A2 tags are classification/visibility, not proof of knowledge. |
| AB7 Consumer profile | Brace work hook and structured armor native effect (`src/alloy_equipment.js:10-27`; `src/structured_equipment_runtime.js:85-90`). | P6 owns family semantics; derived-snapshots offers purity/revision precedent; native combat/work/social/travel owners own consumers. | A new item-profile contract is needed. No exported item cache in the world-event prototype. Preserve native stat ownership and effect withdrawal. |
| AB8 History / receipt refs | P1 bounded draw log (`src/seeded_streams.js:59-62`), simulation bounded histories (`src/simulation_contracts.js:321`). | [P38 BI2](../procgen-2026-10-13/p38/RECEIPT_LOG.md): item, person, place biography. | Reference one canonical outcome, with retained manufacture/repair pins; do not copy receipt bodies into every item or use the RNG diagnostic ring as biography. Current domain state remains authoritative. |
| AB9 Bond / attunement | Actor relationship staging/dedup (`src/simulation_effects.js:289-292`). | Companions' bond design + P38 relationship owner; local world defines attunement. | Typed actor↔item relation, compatibility/cost/revision, not an item numeric stat or interchangeable person relationship. Fixed authored identity remains lawful for a first slice. |
| AB10 World law adapter | Explicit local mixture consumer revision; structured body/custody checks (`src/mixture_state.js:62-70`; `src/structured_equipment_runtime.js:31-57`). | [World core K2/K9/K18](../../../worlds/WORLD_CORE_KIT_2026-10-14.md), [W6](../../../worlds/world-core-kit-2026-10-14/W6_ENGINE_TEMPLATE.md), core A1 registry proposal. | Register finite enabled operators, response resolver and import policy. No arbitrary world JS in saved objects; revisions alone do not retain executable old laws. |
| AB11 Station / capacity | One mixture job/vessel (`src/mixture_native.js:24-26`); simulation sites/jobs (`src/simulation_contracts.js:218,230`). | Crafting RX4 + P6 apparatus/site contracts; existing simulation site/job owner. | State/capability, exclusive slot lease, condition, location and actual operator means. Recipe station tier (`src/crafting_recipes.js:169-172`) is not a live forge thermal state. |
| AB12 Entity refs | Native item strings/slots; separate native/simulation authority (`src/native_equipment_transaction.js:3-10`). | [P38 BI1](../procgen-2026-10-13/p38/ENTITY_REFS.md): all record joins. | `{kind,id}` plus lineage/scope resolution and authority binding; item definition/lot/copy distinction. Saved allocation counter, no random/name IDs; preserve destroyed-object tombstones and exact executable payload pins. |

## Reconcile existing contracts before a source dispatch

| Code | Existing contract / current status | W4 reconciliation |
|---|---|---|
| C1 | Materials audit five records; P6 C8–C15 and S3-A/S6-A are proposals. P2 now lives in main (`src/mixture_state.js:15-98`). | Keep material, owned batch, process, resolved product and knowledge distinct. Extend representation only for the selected consumer; retain P2 revision-1 identity/normalization and oral effect semantics. Do not update its audit or P6 from this lane. |
| C2 | P38 ENTITY_REFS/RECEIPT_LOG were available during the first read; STORE_OWNERS/RETENTION/MIGRATION/DUPLICATES appeared and their relevant sections were read at final refresh. All remain proposals. | Adopt proposed definition/lot/copy distinction and `{kind,id}` refs, not a second `makerItemId` directory. IM1 receipt log becomes refs/index queries, not duplicated biography payload. Common log proposal points at `expansion.loreHistory`; no new W4 log owner. Follow the now-available [STORE_OWNERS](../procgen-2026-10-13/p38/STORE_OWNERS.md) knowledge façade, [MIGRATION](../procgen-2026-10-13/p38/MIGRATION.md) additive bindings and [RETENTION](../procgen-2026-10-13/p38/RETENTION.md) capability/pin closure; refresh final reports before coding. |
| C3 | [Derived dispatch GOAL](../derived-snapshots-2026-10-14/GOAL.md) specifies `deriveSnapshot(world,at,{branch})`, event facts and incremental equivalence. `runs/snap.last.md` reports pure-module tests in a separate worktree. | Useful precedent for pure projections and revision rejection, not an item/wielder/technique API and not proof of integration in this checkout. Item caches belong to consumer adapters with exact dependency keys. |
| C4 | [Profile/branch proposal](../../../research/PROFILE_AND_BRANCH_SAVE_SHAPE_2026-10-14.md) keeps the complete native envelope inside the first branch. [Offline audit](../../../research/OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md) separates played, instance and narrow prepaid wall time. | Item records stay inside that complete branch save; no global player inventory or implicit cross-life bond/knowledge carry. Scope refs prepare compatibility without requiring profile/branch rollout for the first brace. Played-time queue first; generic offline progress is not inherited. |
| C5 | P39 REGISTRY and, at final refresh, [BUDGETS](../procgen-2026-10-13/p39/BUDGETS.md) exist. Its descriptor proposal preserves existing owners; budgets are proposals without timing measurements. | Declare read/write domains, streams, due boundary, phase and observer-safe panel; use existing native publication seams. No new maker bootstrap registry. One integrator owns main/save/simulation joins. Current scheduler budget is not a host yield guarantee. |
| C6 | P40 checkpoint/source snapshot and, at final refresh, [FINDINGS](../procgen-2026-10-13/p40/FINDINGS.md) exist. Snapshot records an older HEAD. Core A1–A5 briefs exist; completed lane reports were unavailable. | Treat these as active work, not passed dependencies. Share hazards below with P40/A5 replay and A1 migration; A2 tags/A4 relationship view are pure proposals, not live item services. P40 F02/F09/F12/F19 support DH2/DH5/DH9/DH3 below; F03 additionally identifies wall-paced native combat chronology and F04 locale-dependent mechanical ordering. Seeded numbers do not prove turn-order replay; new graph/job tie-breaks need stable machine-ID ordering. Re-read final reports before implementation. |

## IM1/IM7 save shape and migration

**INFERRED shape, illustrative names.** The containing location and version are
chosen by the save integrator with P38/core A1. No expansion/fork schema number
is reserved here.

```text
itemEnvelope = {
  schema, revision,
  definitions: {definitionId: {
    definitionRef, materialRefs?, assemblyDefinitionRef?, patternDefinitionRefs?,
    resolvedStructure?, resolvedResponses?, lawRef, resolverRevision
  }},
  lots: {lotRef: {definitionId, manufactureReceiptRef?, quantityUnit, retainedTruth}},
  copies: {copyRef: {
    definitionId, lotRef?, stateRevision, assemblyBindings?, patternBindings?,
    condition?, chargeReservoirRef?, bondRefs?, manufactureReceiptRef?, lastUseRef?
  }}
}
InventoryKey = {id: <registered carrier family>, instance: <copy ref>}
```

Fields are sparse. The shared entity directory supplies lineage/scope and
binding; it is not another balance ledger. Native inventories/equipment,
simulation owners/custody and installed parent mounts remain the authoritative
holders. A child stored as installed cannot also count as loose stock. Slot
references are possession, while title/custody can name a different legal owner.
Charge belongs to one reservoir; a pattern/bond only references it. Homogeneous
fungible products retain type/lot quantities; only a mutable individual uses
count 1. Receipt text, known labels, cache, price and current actor fit do not
enter physical key equality. A compact definition handle requires full saved
payload equality and a collision-safe lookup, not a hash-only reconstruction.

| Code | Ordered migration step, INFERRED | Acceptance |
|---|---|---|
| M1 | Back up exact stored bytes through the owning save route, stage a detached migration. Absent new owner stays absent. Supply read-only legacy views for ID/components/quality without changing old keys or values. | Old saves with/without expansion, P2 and optional E2 restore exactly; no new wear, craft grant, reroll or default enrollment. Backup storage fits the shared origin budget. |
| M2 | Validate generated definitions/material/pattern/operator revisions first; bind the entity directory and copies next; then all inventories, player/NPC/simulation equipment, storage/trader/chest holders, escrow, installed children, custody/title, exposures and receipt pins. | Reject dangling refs, duplicate copy holders, count>1 copies, cross-scope refs, missing laws and unsupported meaningful future fields before mutation/write. Enumerate holder adapters; P2's recursive whole-envelope validator is a useful fallback, not proof of copy uniqueness. |
| M3 | Route a new registered family through `getItemFromKey`, inventory insertion and player equipped-item load **before** the legacy weapon branch (`src/items.js:1217-1268`; `src/main.js:5696-5722,5985-6018`). Native projections are hydrated from retained truth. | Equipped/stored/traded/reserved copies retain key and condition. Player object serialization and NPC key serialization both decode. No warnings-and-skip fallback for required generated objects. |
| M4 | Promote a legacy copy only at a supported mutation: atomically debit one stack unit, allocate a directory copy and transfer exact state. Preserve existing `e2_instance` key/condition binding or map it bijectively under an explicit compatibility step. Keep optional wear setting. | Two identical old swords remain two; one promoted sword does not alias the other. E2 worn equipment reloads unchanged and is not assigned two condition owners. Repair/removal returns the same current child, not a fresh template. |
| M5 | Each owner version step is pure/idempotent, registered with core A1's eventual chain. Persist owner mutations, escrow, streams, receipt/knowledge refs and native projections in one guarded write, then publish. | Failure injection leaves old bytes and live owners unchanged. Literal-file import runs the real decoder preflight first (`src/save_files.js:195-201`). Missing interpreter blocks affected load with preserved prior save, not silent recomputation under newest law. |

Current migration is distributed: `prepareV06Save` handles biography and kit
counters (`src/save_migration.js:3-25`); foundation compatibility retains retired
content (`src/save_compatibility.js:10-53`); the native loader also handles old
components/quality (`src/main.js:5698-5722`). W4 does not replace those paths.
Store complete old resolved truth and an executable retained-law path. A saved
revision/seed cannot recover missing code. Derived cache may be discarded and
rebuilt; manufacture truth and a paid job's frozen terms may not.

## IM3/IM9 combat adapter path

**INFERRED smallest path:** resolve item truth once, then adapt it at existing
actor stat composition. Keep `getAttack/getStats/getBonusSkillLevels` for legacy
items, and make a generated item facade read a cached profile. Person already
composes equipment stats, weapon-type skill and strength; retain those
responsibilities (`src/models/person.js:287-327,627-633`). The facade supplies
weapon base attack and equipment stats, not already strength/skill/stance/stamina
multiplied final damage. Supported weapon families must map to an existing skill
or explicitly add an authored mapping, rather than passing an unknown type.

| Code | Step / consumer | Gate |
|---|---|---|
| CP1 | `deriveItemProfile(retainedTruth,copyState,actorBody,technique,law)` returns typed base attack, speed/fit modifiers and supported responses plus dependency revisions. No DOM, RNG, stock or knowledge writes. | Equal inputs → equal profile; input immutability; old scalar profile matches native formulas. Key includes item/definition/state, body, technique, law/resolver and bond revisions, not just the last receipt ID. |
| CP2 | Recompose actor at committed equip/unequip/refit/body/condition/bond/technique changes, then invalidate affected UI DTOs. Structured armor projection contributes its native effect once (`src/structured_equipment_runtime.js:85-90`). | Swap/body change withdraws old effect; no duplicate defense or wear multiplier. Legacy E2 wrapper stays authoritative for legacy items; generated condition is applied by one selected owner. |
| CP3 | First generated blade demonstrates an actual attack/speed tradeoff through `Person.getAttackPower` and Combat. Keep existing block/evasion/crit/damage order (`src/models/combat.js:353-427`) and decision scopes. | Two paid blades cause reproducibly different native results under controlled equal actor/target state; legacy weapon control unchanged. Preview/render does not draw. |
| CP4 | Add reach/cut/thrust only with an explicit strike context: selected technique chooses damage channel, material response reads it, reach changes a named targeting/hit/timing rule. Saved NPC battles need the same consumer semantics through their adapter, not only native player combat. | Each shipped axis changes a target rule and survives resume. Scalar first slice makes no claim about reach or hit locations. Body armor facts alone cannot accept this step. |
| CP5 | Pin profile/definition/state revision in an admitted pending strike, or declare changes effective at the next attack boundary. Current pending loops save attack power and targets (`src/models/combat.js:211-217`; `src/seeded_streams.js:127-133`). | Save mid-loop → reload → same strike/draw/wear/result as uninterrupted play. No retroactive refit of a pending attack, no duplicated hit receipt on resume. |

Wear settlement is a separate state mutation, not a side effect of profile
calculation. IM5's fight-end aggregation needs hit-count/weapon identity and exact
residuals; splitting a fight into save segments must not change rounding, threshold
breakage or total wear. If a selected law changes effectiveness during combat,
settle at that law's threshold/boundary rather than postponing every change to the
end. General offline swing replay remains outside the first slice.

## IM11 performance budgets

These are **INFERRED candidate budgets**, not measurements or fictional limits.
Default + Dial + Reasonably: start with small Village graphs and played-time
work; worlds can enroll larger graphs through a reviewed budget class. Exceeding
an execution budget preserves remaining work or rejects admission before spend;
it must not silently discard constituents, nodes, outcomes or time.

| Code | Proposed budget / measurement gate | Basis and dial |
|---|---|---|
| PB1 | Align P39: each hot maker generator ≤0.25 ms p95, all new generation/receipt consumers combined ≤1.5 ms within the whole simulation ≤4 ms p95. No full inventory derivation per render; measure p50/p95/p99/max and active-job counts. | Dirty revisions + active dependency indexes. Targets need profiling; not achieved here. Bigger worlds use cold/dormant items and scheduler budgets. |
| PB2 | First assembly ≤16 nodes/32 edges and lamp ≤16 operators/32 edges in its authored family; O(V+E) validation/evaluation, bounded per-boundary propagation. Profile 1/100 active devices. | Engineering admission class, not a universal power/slot cap. Explicit delay/cycle law; queue overflow retains causal work. Large arrays use another tested class. |
| PB3 | Preserve the existing **512 boundaries per advance call** and `remaining/budgetExhausted` (`src/expansion_engine.js:599-640`). Proposed host chunks ≤8 ms with resumable detached plan state. | `src/main.js:1251-1255` begins a synchronous drain loop, so 512 is not a yield guarantee. Host yielding needs separate transaction/clock review before catch-up claims. |
| PB4 | UI projects ≤50 known rows per page; derive only visible rows, equipped items and admitted work inputs. Fixture 10,000 cold copies/100 definitions/100 active jobs; each row must stay exact-selectable. | Page size and cache capacity are dials; forbid key/name-based truth leaks. Index by actual holder and location, invalidate on transfer/install. |
| PB5 | Use 1,000 simple copies + 100 definitions as a stress fixture. P38/P39 propose ≤256 KiB UTF-8 for all participating new owners combined, not a maker-only allocation; measure the maker share plus UTF-16/full-origin total. | Existing guard is **4 MiB shared origin**, including other keys (`src/save_files.js:204-223`). Receipts are refs to P38, not 1,000 embedded logs. P39 proposes ≤64 KiB/year total routine post-compaction growth, overlapping all lane shares, not additive budgets. Larger worlds may need an archive/backend proposal; do not switch storage in this lane. |
| PB6 | Save/validate target ≤50 ms p95 for the PB4 fixture; report growth per 100 crafts/repairs and per played game-year, with definitions, exact pins and pending jobs separated. | Never prune required executable payload or exact biography proof to hit a budget. Retention follows P38 capabilities/pins; allocation/operation dedup survives compaction. Expensive histories need lawful admission/storage policy. |

## IM8/IM12 determinism and exploit hazards

| Code | Hazard / source, SHOWN unless noted | Proposed check / mitigation, INFERRED |
|---|---|---|
| DH1 | Stateful `keyedUnit` remembers diagnostics; `streamSeed` can initialize missing streams (`src/seeded_streams.js:56-77`). | Preview uses a detached validated owner and pure `unitDecision`, not live `gameKeyedRandom` or initialization. Compare full state before/after repeated preview. |
| DH2 | Committed recipe quality uses seeded proxy, original methods use `random_range` → `Math.random` (`src/crafting_recipes.js:204-206,300-302`; `src/misc.js:68-69`; `src/main.js:4214`). | Trace new code through the committed path; frozen job-purpose draws and operator revision. Cosmetic random preview must not select authoritative output or reveal a future draw. |
| DH3 | JSON keys depend on field order; component serialization iterates keys; P2 equality uses JSON (`src/items.js:245-253`; `src/mixture_state.js:37,61-74`). | Retain old codecs. New codec uses specified field/key order, exact units and collision-checked payloads. Permuted input keys → same new truth/key, with old P2 fixtures unchanged. |
| DH4 | P2 uses exact integer mass but floating dose arithmetic (`src/mixture_state.js:53-70`); E2 rounds each hit (`src/absorb_e2/durability.js:103-109`). | Golden law revisions; compare full versus partitioned wear/process runs. Carry fractional remainders, overflow checks and exact trace conservation rather than UI rounding. |
| DH5 | P2 repeat settles one batch, then sets next due to current supplied clock+3 (`src/mixture_native.js:29-33`). | Played-time and scheduler integration must specify boundary traversal. Large advance versus small advances must agree before adopting offline equivalence. Do not silently change P2 timing from W4. |
| DH6 | Native craft rollback captures enumerated owners/private bindings; item/component kinds only use this wrapper (`src/main.js:4160-4175`; `src/native_craft_transaction.js:4-25`). | Include every new registry/ID counter/receipt/knowledge/condition owner, or use detached plans. Equipment route needs its own audit; no assumption this wrapper already protects every craft. Inject failed write and post-write render failure. |
| DH7 | Recipe artifact disassembly returns exact initial parts (`src/artifact_collection.js:90-97`); worn-copy identity can survive in another ledger. | Fuzz assemble/use/wear/remove/salvage/sell/import/retry; exclusive holder and declared losses. Never duplicate installed children or recharge by disassembly. |
| DH8 | Attack loops retain base attack and timing; body/fit/charge may change elsewhere (`src/models/combat.js:211-217`; `src/structured_equipment_runtime.js:54-58`). | Pin revisions/boundary policy, stage charge once, test save mid-strike and depletion/removal withdrawal. Receipt invalidation alone misses non-receipt body/skill/law dependencies. |
| DH9 | Raw item getters expose template stats/names; P2 has only one known-dose projection (`src/items.js:987-1008`; `src/mixture_state.js:75-79`). | All UI routes use observer DTOs, including facets, prices, compare, disabled reasons and forecasts. Sealed fixture tests refer by ID/status only; no truth in errors/telemetry. |
| DH10 | Proposed receipt retention and cross-branch refs can lose a law, child or deed needed by an item (P38 BI1.4/BI2.2). | Pins declare exact executable versus historical capability. Tombstones keep identity, not usable material. Missing pack preserves previous save; branch crossing remaps declared refs and never copies stock implicitly. |

IM12 future suite: golden legacy/P2/E2/new-envelope versions; malformed/future
imports; all-holder copy uniqueness; conserved material/source/sink; operation
ordering; input permutation; full/incremental projections; repeated preview;
stream rollback; partitioned time/wear; job cancel before/after irreversible work;
receipt replay/compaction; assembly cycles; reservoir depletion/shared modes;
unknown-property projections; sell/storage/loan/refit/import exploit sequences.
These are proposed test cases, all NOT RUN for new maker behavior.

## Ordered smallest playable slices

Default: complete one row's useful journey before starting the next. Dial:
choose another P6 family with the same owned-output/consumer/save gates when it
better fits the world. Reasonably: shared foundations may be steps inside a row;
an empty envelope or passing pure-module suite is not a separate playable wave.
No blanket P38/P39/core rewrite is required to finish one bounded original item.

| Code / order | Smallest visible journey and dependencies | Acceptance, all OPEN |
|---|---|---|
| PS1 | **P6 S3-A, two braces.** One fictional alloy family, two ratios and one cooling distinction; retain definitions/copies; equip/swap; actual paid pack-drive consumer reads exact profile. Depends on refreshed P1/P2 integration and minimal AB1/4/7/12, not combat geometry. | SOURCE: conservation/waste, process order, preview purity, atomic failure, legacy codec. NATIVE: paid inputs → two different owned braces → changed work cost/yield and withdrawal on swap; old Springsteel control unchanged. Save/reload/literal-file import for equipped, stored and reserved copies. |
| PS2 | **One actual repair/refit, P6 S5-A boundary.** Use independently owned compatible/incompatible offcuts; hold actual tool, repair, perform paid kit work; salvage another damaged practice tool into reusable stock. Builds on PS1 identity/material and minimum AB2/5/8. | SOURCE: custody/child uniqueness, incompatible rejection before spend, cancel both sides of irreversible boundary, repeated settlement. NATIVE: same tool restored → useful work, salvage stock actually reused, no free alloy/charge rewrite. Mid-job/final reload/import; legacy wear-off baseline unchanged. |
| PS3 | **One generated blade pair.** Reuse alloy/process/copy adapter; choose two supported part/geometry treatments that change base attack or recovery speed in actual native combat. Adds CP1–CP3; no general armor/body overhaul. | SOURCE: pure dependency cache, equal legacy formulas, single condition multiplier, skill map, pending-strike policy, deterministic draws. NATIVE: natural paid craft/equip/fight A/B/control at equal declared context; effect withdrawal; mid-combat save/resume/import. Reach/cut/thrust claims wait for CP4's own consumers. |
| PS4 | **RC1 + RC10 on those items.** Obtain a lawful observation/appraisal route; exact uses-left only where that law grants exactness, otherwise qualitative condition. Minimal AB6 read adapter over existing knowledge; receipt-backed history. | SOURCE: truth unchanged by reveal, fidelity/basis mapping, no leaks via counts/sort/value/errors. NATIVE: before/after knowledge changes visible inspection while the same hidden property already affects use; forecast spends/draws nothing. Knowledge/condition reload/import exact. |
| PS5 | **P6 S6-A, original work lamp.** One carrier, light/control operators, two meaningful layouts and one reservoir; actual reading/work benefit. Adds AB3/11, not a universal rune language. | SOURCE: typed ports, bounded trigger trace, energy accounting, incompatible layout before spend, real exclusive carrier. NATIVE: paid install → useful work → depletion/removal withdrawal → lawful recharge; queued inscription works. Dormant/active/partial charge and pending-work Save/reload/literal-file import; invalid graph and missing-law import preserve previous save. |

Each row additionally requires a fresh-origin rebuilt **1366×768** browser
journey and **1600×1000** check, supported native actions without synthetic setup
being mistaken for natural acquisition, and separate director fiction/balance/feel
acceptance. Wider world/canon adaptations, weapon laws, formations, ranged
families and general absent time remain reachable proposals with their own gates.

## More to consider

| Code | Additional consequence, INFERRED | Default + Dial + Reasonably |
|---|---|---|
| MC1 | A regrind preserves copy identity but changes retained geometry and mass; remelting destroys structure and creates a new batch. | Default explicit transformation receipt. Dial local world identity law. Reasonably distinguish repair/replacement/reforge rather than retaining every property by sentiment. |
| MC2 | Wear or maker history may make formerly stackable objects distinct. | Default promote at first meaningful per-copy consumer. Dial provenance-sensitive lots. Reasonably anonymous stock needs no invented biography. |
| MC3 | Observation and fit depend on who looks or wields. | Default actor-scoped knowledge/projection. Dial bond/technique/world law. Reasonably change cached views without redefining physical product identity. |
| MC4 | Shared charge and installed parts connect craft, combat and ordinary work. | Default one reservoir/holder and explicit use boundary. Dial reserve/throughput/trigger classes. Reasonably a powered blade cannot spend its lamp mode's same charge twice. |
| MC5 | Missing old laws can strand an executable generated item even when its definition survives. | Default retain resolver support for admitted versions. Dial explicit migrated response with compatibility decision. Reasonably retain identity-only history where no executable promise depends on it. |

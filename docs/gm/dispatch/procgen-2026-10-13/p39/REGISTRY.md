# BJ3/BJ4: generator, content, consumer and panel registry

**Current seam qualification, 2026-10-18:** the October 14 source snapshot
below predates the existing `src/domain_registry.js` and its crafting consumer.
Follow [AR1–AR16](../../../../ARCHITECTURE_RULES.md) and the
[modular checkpoint](../../modular-seams-2026-10-16/CHECKPOINT.md) before
selecting a registry slice. Reuse actual native domain/panel/content owners;
this proposal does not require a parallel bootstrap, receipt store or scheduler.
Existing source imports corroborate a seam, not current native acceptance.

2026-10-14. Proposal only. This is a host integration contract, not a new entity, receipt or save schema. [P38 entity refs](../p38/ENTITY_REFS.md), [receipt log](../p38/RECEIPT_LOG.md), [store owners](../p38/STORE_OWNERS.md) and [retention](../p38/RETENTION.md) own those proposal schemas and and [migration](../p38/MIGRATION.md) plus its [final report](../p38/REPORT.md) were read during the refresh. No P39 schema version is reserved. [P11 context](../p11/CONTEXT.md), [P22 retained revisions](../p22/CONTENT_PACKS.md), [P15 admission](../p15/AUTHORING_PIPELINE.md) and the existing registries remain the owners to extend.

## F1: wiring today, shown by source

Locators describe the read snapshot recorded in [INPUT_SNAPSHOT.json](INPUT_SNAPSHOT.json), not installed or rebuilt gameplay.

| Seam | Locator in main checkout | Actual wiring and proposed extension |
|---|---|---|
| Imports | `src/main.js:1-25,288-308` | Explicit imports for streams, mixing, storylets, panels and content-pack maps. New modules currently require joins here. Replace repeated future joins with one bootstrap import; preserve existing import order until equivalence is proved. |
| Content registry | `src/expansion_engine.js:303` and `src/expedition_content.js:17,39-72` | Existing `createContentRegistry` consumes worlds/actions/opportunities/capabilities/sources/rollTables/techniques/simulation; expedition content assembles several world modules eagerly. Extend its validation/registration, do not create a competing world/action registry. |
| Optional packs | `src/main.js:304-308,5337-5344`; `src/content_packs.js:55,76,88,137,152` | Pack maps, definition validation, loading, registration and save preparation already exist. Reuse these compatibility seams; current pack loading is not proof of per-world lazy code chunks. |
| Command routing | `src/main.js:1283-1307,4696-4708` | Central guards route special command families; mixing stages its own native envelope and publishes after the write. Descriptor dispatch must retain those guards and transactional order. |
| Native projections | `src/main.js:455,777-803,859-888` | Explicit effect readers, context composition and post-plan reconciliations. Add declared typed adapters, not callbacks with unrestricted live-state access. |
| Scheduler | `src/expansion_engine.js:607,623-626`; `src/simulation.js:468-559` | Central boundary-minimum selection and an ordered chain of advances. A registry needs next-boundary and detached advance hooks with deterministic phase order. |
| Save/load | `src/main.js:5195-5196,5337-5347`; `src/save_files.js:45-47,109,195-201` | Optional mixture owner serialized; validation and restore are explicit. Literal-file import validates and runs loader preflight before a guarded write. Descriptor adapters must plug into that existing path. |
| Panels | `src/main.js:8304-8371,8409-8417,8493-8505` | Explicit panel construction plus workspace registration list. Reuse `registerWorkspaceModule`, which already validates ID/node/home and supports discovery/critical actions (`src/workspace_layout.js:3-16,89-99`). |
| Opt-in precedent | `src/storylet_deck.js:8-21,50,83-92` | `storylets.enabled` gates generation and saved decks retain state. This is a precedent, not a generic feature-flag system or proof of safe disabling every owner. |

## BJ3.1: four registration types

Use new proposed files `src/generation/{manifest.generated,registry,bootstrap,host_adapters,panel_host}.js`; modules live under `src/generation/features/<namespace>/`. Existing owners keep their names and state locations. Registration executes no draw, enrollment, stock change, timer or DOM mutation. Imports must be inert.

| Kind | Descriptor fields and permitted role |
|---|---|
| Generator | `id`, `revision`, `worldScopes`, `requires`, `ownerAdapters`, `streamScopes`, `clockDomain`, `phase`, `after`, `nextBoundary(read)`, `stageAdvance(read,due)`, `admissionPolicy`, `budgetClass`, `contentRefs`. Pure stage returns a detached plan to the host. No direct storage or native publication. |
| Content pack | `id`, `revision`, `digest`, `sourceMode`, source-ledger locator, `worldScopes`, `reservedRefs`, `provides`, `requires`, loader locator, validated definitions. Distinguish original, source-qualified and explicit AU mode. Meaningful contradictions prevent admission unless declared nonessential to this consumer. No raw book prose. |
| Receipt consumer | `id`, `revision`, input kinds/index queries, `projectionPolicy`, `pins`, owner adapter, `stage(receipts,read,cursor)`. Cursor and derived state commit with owner state; settled receipt replay is idempotent. An award consumer requires real treasury/source authority; a text consumer has none. |
| Panel | `id`, title discovery function, host/dock/focus policy, `criticalWhen`, `mount({knownRead,preview,dispatch})`, `render(invalidation)`, `destroy()`. The panel receives observer-safe DTOs, never unrestricted store or registry enumeration. Registers its returned node with the existing workspace registry. |

Illustrative descriptor, not executable code or a save-schema reservation:

```js
export const feature = {
  id: 'village.return-report', revision: 1,
  worldScopes: ['base.frontier'],
  requires: ['receipt.query@1', 'known.project@1'],
  ownerAdapters: ['loreHistory.read', 'reportNotes.write'],
  streamScopes: [], clockDomain: 'played-expansion',
  consumers: [{ id: 'village.return-report.completed-work',
    receiptKinds: ['work.settled'], projectionPolicy: 'observer-known',
    stage: stageReturnReport }],
  panels: [{ id: 'return-report', mount: mountReturnReport }]
};
```

P38 proposes `{kind,id}` refs qualified by saved lineage/scope, authoritative owner bindings, operation/receipt identities and retained query capabilities. Descriptor read/write sets name those owners. Pins declare required fields/capabilities and release predicates; indexes are views over the shared log. Use no feature-private outcome copy. The exact receipt kind and adapter names resolve against P38 and the accepted P34 owner, not this sketch. A known report can be deterministic and need no stream.

## BJ3.2: adding files without editing main.js

A small build-time manifest scanner enumerates a fixed repository directory, validates exported descriptors and emits a sorted, reproducible manifest into a disposable build area. No arbitrary filesystem or player-supplied JS is evaluated. A feature adds its own descriptor, content, tests and panel file; it does not edit `main.js` or a shared handwritten feature list. The scanner rejects duplicate IDs, cycles, absent required interfaces, undeclared writes/streams and unavailable consumers. Sort by explicit ASCII/code-point IDs, never locale or discovery order. Pin revision and digest in admitted work through P38/P22 compatibility adapters.

Runtime uses the generated manifest to build one immutable registry. Dependencies topologically sort; stable ID breaks ties. Boundary ordering uses played due time, declared phase, owner ordering and stable ID. It must preserve legacy order and same-boundary causality; do not insert a new hook by alphabetizing existing native phases blindly. Consumers stage after settlement; projections run after committed owner publication. New derived receipts carry parent IDs and cannot recursively trigger an unbounded same-boundary chain. Index cursor/query scope prevents rescanning the entire log.

One host adapter owns native purse, inventory, skill, effect, actor and guarded-save capabilities. Descriptors declare the narrow subset they need; a grant cannot manufacture body faculty, source access, funds or recipient knowledge. Preview and render have no writer and no RNG capability. All affected owners, stream cursors, escrow and receipt state enter one durable envelope before publication. If a descriptor fails, discard the whole staged transaction. A post-write render failure cannot refund already committed stock.

This is a trusted repository composition mechanism, not a security sandbox for arbitrary JS. Player-authored data uses P15/P22 quarantine validation and supported operators; optional prose remains P15's separate expression-only route.

## BJ4.1: per-save admission control

P38 owns where flags and content locks live. Proposed semantics: each feature has explicit enabled/disabled/dormant admission state plus pinned revision; old absent-owner saves remain absent. The visible off switch stops **new admissions**. It neither deletes truth nor cancels promised work, removes consumed-source effects, rerolls stock or grants a refund. Pending work remains reachable in a critical recovery panel and settles under its retained law, or follows a separately declared lawful cancellation policy. Disabling display-only texture can take effect immediately.

A required pack missing at restore must be fetched and validated before the loader mutates native state. If it cannot be supplied, preserve the prior save and offer a clear unavailable-content state; do not silently drop owners. Unsupported future data rejects before writes. Dormant preservation requires an explicit P38 migration contract, not a blanket catch-and-ignore. Re-enable resumes the existing stream/cursor. World eligibility and observation remain independent of the switch. No fixed once cap is introduced.

## BJ3.3: incremental migration, each with a playable end

| Step | Bounded change | Gate |
|---|---|---|
| R0 | Freeze integrated-main/P34 APIs and reconcile P38 adapters; capture representative old/pending/final fixtures | Source snapshot plus specific compatibility inventory, no guesses about main/branch proof |
| R1 | Add inert descriptors/build manifest, wrapping one existing storylet panel and one read-only receipt consumer; one root writer makes bootstrap joins | Same natural card response, exact pending state/next draw, pure preview and unchanged guarded publication; no new feature prerequisite |
| R2 | Move that feature's panel construction/workspace list entry to descriptor; dispose its timer/listeners through mount lifecycle | Same desktop route/focus, no double timer/mount; final build at 1366x768 and 1600x1000 |
| R3 | Register one new return-report consumer in its own files with P38-approved owner adapter | Useful receipt-backed report and next-step link, no main/save/simulation edit by the feature lane |
| R4 | Move new-generation scheduler/validation joins behind adapters, then migrate selected legacy systems one at a time | Stepped/jump/resume/import parity and old flags/versions preserved; no broad main.js rewrite or wholesale legacy storage move |

R1/R2 need root edits to shared files. Later feature additions avoid them only after their capabilities exist. A genuinely new native effect, save owner or clock still needs one reviewed host adapter; the registry cannot eliminate that cost. Keep source-qualified world packs and richer crafting/NPC consumers reachable through extensions instead of pretending P2 already supports them.

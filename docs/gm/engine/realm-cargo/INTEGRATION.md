# Exact native cargo and lender consent

Status2026-10-04: implemented-unverified pure engine module. The narrow native traveler adapter now consumes exact references; save fields, commands, host, UI, bundle and gameplay verification remain root-owned and unchanged by this worker. Root owns integration. Existing simulation custody remains the sole loan owner.

Source: [realm_cargo.js](../../../../src/realm_cargo.js). Native consumers: [doorway host](../../../../src/pocket_realm_host.js), [traveler adapter](../../../../src/native_realm_traveler.js), [route cargo gate](../../../../src/realm_connections.js), [equipment publication](../../../../src/native_equipment_transaction.js), [chest transaction](../../../../src/native_storage_transaction.js).

## Exports and inputs

| Export | Contract |
|---|---|
| `REALM_CARGO_SCHEMA` | `1`; detached snapshot/consent/permission schema, no expansion-schema claim. |
| `nativeCargoStockId(actorId, container, itemKey, slot=null)` | Injective fixed-width UTF-16 encoding of the exact complete inventory key and equipment slot. `container` is `bag` or `equipment`. No ordinal, parsing of rendered names or content filters. |
| `realmCargoCustodyBinding(custodyId, custody)` | Canonical material binding for the actual `{owner,holder,key,count,at,cause?}` record. It is not a fabricated persistent loan revision. |
| `buildNativeRealmCargoSnapshot(input)` | Reads one actor's actual bag, equipment and simulation custody. Returns complete exact references and material binding. |
| `validateRealmCargoSnapshot(snapshot)` | Checks exact source/slice identity, counts, holder/body/class/equipped refs, native stock domain, material binding and custody totals. |
| `validateRealmCargoConsent(consent)` | Validates a caller-bound actual lender receipt. Shape validation alone does not prove that a lender consented. |
| `validateRealmCargoPermission(permission)` | Validates an optional record copied from actual consent, with exact consent provenance. |
| `previewRealmCargoPermission(snapshot, consent, request, context)` | Deterministic issuance proposal. Returns `permission:null` when rejected, plus stale/material guards and `effects:[]`. |
| `previewRealmCargoPassage(snapshot, connection, request, context)` | Complete cargo policy/purpose/endpoint/actual-consent gate. Returns connection-compatible cargo with exact references, allowed/reasons, guards, `effects:[]`. Does not check body, opening, boundary, resources or native publication. |

Builder input is `{actorId,bodyId,sequence,revision,inventory,equipment,custody,classifications?,allocations?}`. `inventory` is the actual count map from `context.gameplay[actorId].inventory`; equipment is the actual occupied slot/key map from `context.equipment[actorId]`; custody is the existing `state.simulation.custody` map. Empty maps are explicit. Zero bag entries are validated then omitted; occupied equipment must be an exact valid item key. Root supplies a positive read revision such as `state.sequence+1`; the material binding additionally detects native equipment/inventory changes that do not advance that sequence.

Optional classifications are `[{itemKey,classId,transferable}]`; the current reversible default is `carried/true`, matching the doorway policy. Root must supply specific classes for future forbidden/bound items. Classification does not grant lender consent. Complete sources contain `{id,container,slot,itemKey,count,revision,classId,transferable}`. Cargo slices add `{itemId,sourceId,ownerId,holderId,holderBodyId,equipped,stockRef,custodyRef,custodyBinding}`. `stockRef.domain` stays `native_inventory` or `native_equipment`, including loaned items, because borrowed physical stock is still held in that native container. `sourceId` groups owned and loan slices without cloning or moving physical stock.

Multiple custody records for one key are counted independently. The native contract has no serial identity for identical copies; this module promises exact stock/slice references, not invented object identities. A unique matching physical container can receive the existing loan count. If the same key is in bag and/or multiple equipment slots, a held loan requires explicit `allocations:[{custodyId,container,slot,count}]` for that loan, with `slot:null` for bag. These allocations must come from actual root equipment/custody publication, not guessed copy placement. Counts must equal actual custody and fit actual source stock. Missing stock, ambiguity, duplicate allocations, unsafe JSON and invalid shapes throw; root converts these errors into unavailable action reasons. It must never fall back to `cargoComplete:true` or fabricate owned cargo.

## Explicit permission proposal

Actual lender consent shape:

```js
{
  schema:1, id:'consent.<actual-id>', revision:1, active:true,
  lenderId:'<actual-owner>', holderId:'player',
  custodyId:'<existing-loan-id>', custodyBinding:'<exact current material binding>',
  purposeId:'<authored-purpose>', connectionId:'<actual-route-id>',
  from:{worldId,instanceId,regionId,layerId},
  to:{worldId,instanceId,regionId,layerId},
  maxCount:1, at:0, expiresAt:null
}
```

Root must create this receipt through a successful explicit lender command and its durable transaction. A knowledge record, title, offered gauge, interpreted statement, scene visibility or observation is not consent. Current Iona loan receives no grant from this module. `previewRealmCargoPermission` copies exact terms into `{schema,id,revision,active,...terms,consentRef:{domain:'lender_consent',id,revision}}` only when the current held custody matches. Request is `{id,revision,expectedSequence,expectedSnapshotRevision,expectedSnapshotBinding,expectedConsentRevision}`; context is `{sequence,clock}`. Creation does not alter or return custody.

Passage request is `{expectedSequence,expectedRevision,expectedSnapshotRevision,expectedSnapshotBinding,purposeId,from,to,duration?,cargo?}`. `expectedRevision` binds the actual connection. Context is `{sequence,clock,permissions:[],consents:[]}` read from actual owners. The complete manifest is selected by default. Explicit selection must exactly equal all carried bag/equipment slices and counts; partial selection requires a prior actual deposit/transfer. Each permission requires its live matching active consent receipt, same exact custody binding, directed endpoints, purpose and route ID, and capacity for the entire held loan. Return direction requires a separately scoped actual consent receipt. Time validity uses played clock and requires expiry strictly after arrival; zero-duration is the current doorway default. Root must refresh time validity at resolution, alongside exact connection/snapshot/consent/permission guards, and revoke via actual lender command rather than editing a preview.

Deterministic permission selection sorts by ID. `authorizedConnectionIds` is populated only after this purpose/endpoint/consent gate, so root must run it for the particular passage and keep the resulting cargo manifest local to that request. Never cache the authorization array as general permission. Plans may contain diagnostic cargo when rejected; root must require `allowed` before passing any authorization forward.

## Root integration and publication

1. Replace `pocket_realm_host.routeContext` index cargo construction with the builder and this passage preview, using actual endpoint direction and an authored purpose. Route `cargoComplete` comes from the successfully built full snapshot; reject both cargo and boundary reasons. No imports into sibling new worker modules are required.
2. The worker replaced `native_realm_traveler` ordinal splitting with `itemKey`, `stockRef`, owner and holder-body references from the manifest, and rereads actual stock to reject stale/missing/duplicate references. The adapter returns a rejected preview for borrowed cargo; preserving that restriction is valid until root binds actual return obligations. Borrowed traveler support additionally needs the existing custody owner reference, a real obligation ID, current lender destination consent and actual stock bindings. Do not invent a return obligation from cargo shape alone.
3. Before commit and at resolution, reread native bag/equipment and simulation custody, rebuild the snapshot, rerun passage/permission preview and compare every guard. Sequence alone does not guard a native equipment change. Root still checks opening, route/layer/body availability, costs and native busy state. Cargo remains in its original native bag/equipment through passage; no item grants/transfers or `realm.*` effects are emitted here.
4. If explicit consent UI is desired, select an additive optional saved owner for consent/permission records, validate on import, default absent arrays to empty, and persist before publication through root's existing durable writer. Old simulation custody schema/records stay unchanged. Native equipment/chest/custody publication must maintain or invalidate optional exact allocations; absent allocations fail closed for ambiguous borrowed copies. Consent custody binding becomes invalid after return/reloan/count/owner/holder/cause changes.
5. Keep new gameplay labelled implemented-unverified. Later acceptance backlog: exact reordered/zero-count keys; worn plus bag spare; same-key multi-loan totals; missing/overallocated custody; real lender refusal/grant/revoke/expiry; outbound versus return purpose; stale bag/equipment without sequence change; complete selection/capacity; old-save absent optional records; durable failure and visible return. Per implementation-first steering none of these scenarios or suites was run here.

## Source review and checks

Reviewed actual `native_realm_traveler`, `pocket_realm_host`, `realm_connections`, `simulation_contracts/effects`, `native_gameplay_adapter`, `gameplay_transactions`, and native equipment/storage publication. The present host filters zero stock after indexing; the traveler re-indexes a sorted map, so omitted/filtered entries can identify a different item. Equipment indexes depend on insertion order. The host also uses the first custody key match to label a whole stack, whereas simulation custody has exact counts and may have several loan records. These are source findings, not behavioral proof.

`node --check src/realm_cargo.js` passed. Dynamic ESM import passed and enumerated the nine exports. Source review tightened owned binding validation, aggregate custody integer checks, native item identity checks and permission arrival expiry. No tests, planner/scenario calls, browser, save/failure suites or build were run. Root remains sole build writer.

## Narrow native binding delivery, revision2

Root explicitly regranted `src/native_realm_traveler.js`. It now exports `buildNativePocketCargo` as well as `previewNativeRealmTraveler`. Exact root call:

```js
const inside = !!activeRealmVisit(state);
const connection = state.realmPrototype.connection;
const from = inside ? connection.to : connection.from;
const to = inside ? connection.from : connection.to;
const cargoPlan = buildNativePocketCargo(state, context, {
  from, to, connectionId: connection.id
});
// In the route context, use cargoPlan.cargo and cargoPlan.cargoComplete.
// Keep cargoPlan.guards for commit/resolution checks and require allowed.
// Add cargoPlan.reasons to the host's action rejection reasons.
```

The actual context must contain `gameplay.player.inventory`, `equipment.player` (including explicit empty occupied-slot map) and actual simulation custody. Missing owners or ambiguous references return `{allowed:false,reasons,cargo:[],cargoComplete:false,guards:null}`. Successful source binding returns the full cargo passage plan `{schema,allowed,reasons,cargo,cargoComplete,units,guards,effects:[]}`. Helper reads the actual saved connection with the matching ID, scopes the fixed current native purpose `native.pocket.physical_passage`, and supplies empty consent/permission lists. It never enrolls optional permission records and never authorizes existing loans. Connection duration and directed actual endpoints reach the pure preview.

The traveler additionally rebuilds the current native snapshot and verifies full source ID, key, stock reference, revision, exact count, ownership, holder/body, equipment slot, class and custody-free state against the supplied manifest. It returns rejected reasons for an incomplete/stale manifest or any actual held loan rather than relying on prior boundary success. The current host's ordinal manifest must be replaced before this stricter adapter can admit entry. No host file was edited by this worker.

Both files passed syntax checks; native traveler ESM import exposed its two exports. No planner cases or behavioral suites ran.

## Root binding source review, revision3

Read-only review2026-10-04 of current root cargo integration found no concrete cargo blocker in the current immediate, zero-duration, owned-only doorway flow. Reviewed `pocket_realm_host.routeContext`, entry/exit preview and commit, `main` panel/command context supply and durable publication, native adapter/equipment reader, gameplay count reader and the exact native cargo helper. No observer/clock lane review, code mutation, planner call, test, browser or build was performed.

Verified from source:

- Both root panel read and `actPocketRealm` supply fresh `campaignContext()` gameplay/vitals and an equipment map extracted from actual `simulationNativeContexts()`. An empty occupied player equipment map is truthy and survives this extraction. The native adapter reads actual character bag entries through `readGameplayActor` and actual occupied slots through `readNativeEquipment`, so the helper receives counts and exact keys rather than rendered labels or duplicate simulation inventory.
- Host chooses authored origin/interior endpoints according to actual active visit, supplies the fixed actual connection ID and uses the helper's exact cargo and `cargoComplete`. Entry/exit preview includes `cargoReasons`; commit reruns the source-bound route and rejects nonempty cargo reasons before the native receipt. Borrowed loans remain rejected even where the route gate would otherwise produce a nominal passage. Builder errors produce an incomplete empty manifest, so passage fails closed.
- Opening/closure use their own route planners and do not inspect cargo reasons or call the traveler. The route-context helper may describe borrowed cargo or fail its cargo preview, but these operations do not move a body and their planners do not resolve that cargo. This preserves the intended ability to open/close while holding the existing gauge.
- Traveler rebuilds the same actual count/equipment/custody snapshot synchronously and matches the complete exact manifest. `commitSimulationCommand` copies these actual gameplay/equipment domains; main prepares gameplay/equipment publication and persists the complete envelope before publishing native state. Passage receipt commands do not grant, clone, consume or transfer carried stock.

Follow-through limitation: root currently drops `cargoPlan.guards` from route context. This is not a demonstrated failure in the present synchronous immediate owned-only command: preview and commit both rebuild current inputs, and no delayed cargo resolution or permission publication is selected. Before timed passage, cached preview execution or optional lender permissions are enabled, carry and compare snapshot/connection/consent guards through that publication path and revalidate at arrival. Do not describe current source review as proof of those future capabilities.

Reviewed hashes: host `c3e07b9c7dd70fe4b6e7187b80ff8b1c2c5aeadba23127fe2ea06c1387c5734c`, main `052dfc85581261726774057f13903a71ed8ad90577d16d75a5b6694e9c9ad8ca`, native helper/traveler `9c06b1fb6381781e000e6187220e9e005cd40b13eb356402a3bd9b52e48b9c51`. Root may continue changing its host/main files after this read snapshot. Gameplay remains implemented-unverified under the deferred-check policy.

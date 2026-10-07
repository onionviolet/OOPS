# Realm activity clock delivery

Status2026-10-04: implemented-unverified pure module plus narrowly regranted native realm-state/scheduler adapters. Root owns paid activation, persistence publication and UI. No behavioral planner cases, tests, browser, save, failure or build suites were executed in this lane.

## Scope and owners

New [realm_clock_leases.js](../../../../src/realm_clock_leases.js) unions actual body visits with explicitly admitted supported observation/work activity over the existing joined played-minute interval. [world_instances.js](../../../../src/world_instances.js) and its schema1 instance remain unchanged. Local elapsed time advances once for any unioned minute and freezes during unsupported/absent minutes. No wall clock, timer, offline catch-up, calendar change, NPC aging/loss/debt, remote body visit, cargo/source transfer or enrollment is created.

The implementation reuses existing World instance/endpoint/visit validators and the standalone realm JSON/ID helpers. It imports neither new cargo nor observation-channel modules. Their host adapters can project actual current support into this planner.

## Exports and shapes

All planners take `(instance, ledger, request, definition, context)`. They return detached JSON proposals and never mutate inputs. Malformed shapes/duplicate overlapping records throw, as the existing World validators do; stale/backward/unauthorized planning requests return `allowed:false`. Denied output has no partial next instance/ledger.

- `REALM_CLOCK_LEASE_SCHEMA = 1`.
- `createRealmClockLedger(instance, definition, sequence)` explicitly constructs an empty record, with no active lease/history.
- `validateRealmClockLedger(ledger, instance, definition)` validates guards, endpoint bindings, lease times and repeated-contact overlap.
- `planRealmClockLeaseOpen(...)` and `planRealmClockLeaseClose(...)` propose exact current-time enrollment/closure.
- `planRealmActivityClock(...)` returns unioned `advancedBy` and complement `absentBy`; `realmClockActivation(instance, ledger, definition, context)` returns current local scheduling support only.

Ledger is `{schema:1,instanceId,revision,sequence,leases:[]}`. `sequence` is the last host sequence reflected in this ledger, not an independent clock. Every lease has:

```text
schema:1, id, revision, instanceId, endpoint,
purpose:'observation'|'work', policyId, causeId, issuerId, ownerId,
sourceId, anchorId, contactId, clockAuthorized:true,
openedAt, closedAt:null|playedMinute, expiresAt, lastSupportedAt,
status:'active'|'closed'
```

Every ID is a stable explicit reference. Endpoint remains `{worldId,instanceId,regionId,layerId}`. The source may represent a host-owned ordinary viewing device; it does not imply a newly granted magical faculty. `ownerId` is the operating owner and `issuerId` the host-declared authorizer. The host must bind these to actual owners and an actual legal cause. A declaration alone proves neither payment nor lawful source/contact. `lastSupportedAt` records the latest accepted support endpoint and does not authorize continuity after that point.

Common request: `{expectedRevision,expectedLeaseRevision,expectedSequence,playedAt}`. These respectively guard World instance revision, clock ledger revision and actual host sequence. The host context, supplied separately from the player request, is:

```text
{sequence, policyIds:[], supports:[], pendingBoundaryAt:null|playedMinute}
```

`policyIds` is the currently admitted policy allowlist, not a player-selected list. `pendingBoundaryAt` is required and must be the earliest pending simulation boundary when one exists. Root must project this from the same scheduler it will run; `null` explicitly means none. No new source/provider/time service is supplied by this module.

Each support is:

```text
{leaseId,leaseRevision,endpoint,policyId,causeId,issuerId,ownerId,
 sourceId,anchorId,contactId,from,through,
 sourceActive,anchorActive,contactActive,clockAuthorized}
```

Binding identity and revision must match the actual lease. All four booleans must be true for an admitted slice. One slice per lease prevents overlapping/double-counted submitted support. Missing support means freeze, even if the stored lease is active and unexpired. A false or mismatching submitted slice is denied rather than silently counted. Host can omit a currently unsupported lease from the support array.

Opening adds `request.lease` with `{id,endpoint,purpose,policyId,causeId,issuerId,ownerId,sourceId,anchorId,contactId,expiresAt}`. Root first reconciles the clock to the opening minute. Opening requires exactly one zero-duration support for that proposed ID at revision1 and that minute. It cannot retroactively enroll. A duplicate lease ID is denied; overlapping historical/active records for the same owner, purpose, contact and endpoint are invalid even under another cause ID.

Advancement adds `request.visits`, the actual body-visit ledger. The module validates every visit identity/status/time and rejects one body's overlapping histories across instances. Only visits to this instance contribute intervals. Matching live support slices must start at or after prior `observedAt` and end exactly at requested `playedAt`, without exceeding expiry. Root must reconcile before any support change, so a current support snapshot never pretends that a contact existed during an unobserved past gap.

Closure adds `request.leaseId` and `request.leaseRevision`. Root reconciles while the old support still holds, then closes at exactly current `observedAt`, then physically shuts/removes contact in the same staged durable action. Closing does not change instance facts/sites/claims/actors, people, stock or evidence. Clock reconciliation at expiry closes the expired lease automatically at the exact expiry boundary; this is clock authorization termination only.

Allowed result is `{allowed:true,reasons:[],expected,nextInstance,nextLeases,...}`. `nextLeases` is the full proposed ledger, not an array. `expected` is `{instanceId,instanceRevision,observedAt,leaseRevision,sequence}`. Open/close add `leaseId`; advance adds `advancedBy,absentBy`. Crossing the earliest active lease expiry or the supplied pending simulation boundary returns denied with `nextBoundaryAt`; caller must reconcile that point and settle due simulation before proceeding.

`realmClockActivation` uses matching zero-duration live support at current `observedAt` and returns `{instanceId,observedAt,sequence,supportedActivity,leaseIds}`. Root can union `supportedActivity` with real bodily presence for local resident scheduling. This return is never a player endpoint, contact capability, cost exemption, legal command authorization, stock projection or knowledge receipt.

## Root integration and compatibility proposal

1. Select an optional root-owned ledger namespace, for example `realmPrototype.activityClock`. Missing older saves retain absence and the existing body-only planner; reading a save must not invent an active slit or history. If choosing empty additive normalization, explicitly record that decision and construct only an empty ledger at the actual current host sequence. Preserve World instance schema1.
2. Pay the real activation cost through the existing durable publication envelope, bind the observation channel/device/contact owners, reconcile the clock, and stage lease opening with the exact live proof. Publish native payment, channel and ledger together. IDs and paid duration remain original proposals.
3. Route all subsequent local-clock advancement through this module when the optional ledger exists, including departure. Calling the old body-only departure planner after an unsynced remote activity interval would drop the lease activity. Reconcile first, then use old departure only at an unchanged joined minute. Keep all lease revision proofs current after each proposal.
4. Root projects actual live support, scheduler's earliest boundary and actor activation separately. Run local Joss scheduling while supported, retaining player Village world/location. Shutter, expiry or source/anchor/contact loss first reconciles valid prior support, settles pending work and then ends/withdraws support. Ending a lease does not cancel committed work, delete local history or spend another payment.
5. Keep later verification backlog: root binding/syntax/build is useful now; generated body-plus-viewing union, unsupported freeze/resume, stale/overlap rejection, expiry/event ordering, atomic failed publication and old/new save-reload acceptance remain unexecuted. Rebuilt browser must show the real paid slit and unchanged native Village body before calling gameplay verified.

Root must not call the body-only planner for the same unconsumed interval, count unioned local minutes again in simulation, or update global time from this local elapsed proposal. A scheduler boundary at `observedAt` must be settled before attempting positive advancement; rejection at that point is intentional.

## Source review and checks

Read live AGENTS/PROJECT, [master refresh protocol](../../../GAME_MASTER_PROMPT.md#context-pressure-and-refresh), [engine specialist assignment](../../dispatch/ENGINE_SPECIALISTS.md), existing World validators/clock planner and root realm-state/pocket host. Current dirty unrelated source and bundled state were preserved. Earlier memory served only as a pointer to vanilla continuity; live project files govern this work.

Passed: `node --check src/realm_clock_leases.js`; import-only module/export discovery. No exported planner or constructor was invoked. Report links are checked for existing local destinations. This is syntax/import evidence, not behavior acceptance.

See [checkpoint](CHECKPOINT.md) for source fingerprint and recovery state.

## Native integration regrant

Root explicitly regranted [realm_state.js](../../../../src/realm_state.js) and [expansion_engine.js](../../../../src/expansion_engine.js) for this finite adapter goal. Missing `realmPrototype.activityClock` keeps the original body-only clock. `openRealmObservationClock(state)` creates an optional empty ledger only after the paid staged observer activation, then opens the exact current supported lease. No old-save read/migration enrolls a viewer. `closeRealmObservationClock(state)` reconciles and closes the active exact observation lease; call it before manual shutter/support-owner mutations.

The observer GM owns [pocket_observation.js](../../../../src/pocket_observation.js), with pure `pocketObservationSupport(state,playedAt=state.clock)`, `nextPocketObservationBoundary(state)`, `expirePocketObservation(state)` and `validatePocketObservation(state)` exports. Support returns an `active` summary plus `clockBinding` containing the planner's exact metadata. Realm state supplies current clock-lease revision and interval endpoints itself. Prior-interval support is evaluated at prior observed played time with unchanged actual owner/source/body/anchor/channel records. Root must reconcile before changing those owners, because support queries do not reconstruct lost history.

`syncRealmClock(state,pendingBoundaryAt=null)` now routes through the unioned planner whenever its optional ledger exists. The common scheduler supplies its earliest causal boundary, now including `nextRealmActivityBoundary(state)`, reconciles prior support, then `expireRealmObservation(state)` applies observer cutoff before new resident decisions. It preserves the scheduler state identity while consuming the observer's detached state proposal. Native publication at an unchanged joined minute needs no extra scheduler import; realm state does not import the engine/simulation scheduler, preventing a new cycle.

`realmSimulationContexts` activates Joss when a real visit exists or the current reconciled ledger has actual supported observation. It changes only Joss's busy predicate and local facts. The player's world/location/body/target legality and co-location remain their actual host state.

`validateRealmEnvelope` additionally rejects an active viewing lease unless the saved native `current location` is Village. Root guards ordinary travel and physical pocket entry until manual closure. This preserves actual native body truth without silently relocating an imported viewer.

Root selected the narrow policy: already-reserved paid simulation jobs retain joined-clock absolute `due` values and settle before actor decision eligibility. Local elapsed time and new resident decisions freeze without a real body visit or supported live observation. This wave makes no job-clock migration and does not claim complete frozen native-world simulation. Private research completion remains Joss-owned knowledge/log audience; the actual co-located offer/report commands still govern disclosure. Real costs, once/completed guards, current job occupation and site capacity still gate new commitments. No new NPC lifespan/aging policy is added.

Native release checks passed: syntax on both regranted adapters, import-only load of both against observer's saved helper file, discovery of all four narrow integration exports, and local report links. No planner or behavioral scenarios were invoked. Root received shared-writer release and exact fingerprints in [checkpoint](CHECKPOINT.md).

## Read-only connected source review

Reviewed current root-wired pocket host, realm state, common scheduler, main native publication/travel guard and latest observer adapter. No runtime cases/tests/planners/build/browser/save calls. Shared source ownership remains released.

The current authored path has no observed source-level double-clock or partial native publication defect: host clones, synchronizes then closes the clock ledger before executing manual shutter; activation completes paid observer/sample/detection/notice staging then opens the activity ledger; main's existing envelope writer validates and persists the complete plan before publishing native money/body/location. Main replay exits before any writer. Ordinary travel and physical entry reject an active observation lease. Old departure consumes the already-reconciled same joined minute. Scheduler takes the minimum pending/chronicle/simulation/view boundary, reconciles prior support and closes expiry before new resident decisions; already-paid due jobs retain the selected settlement policy. Private trial knowledge/log audience and co-located disclosure remain unchanged.

One concrete import-consistency gap was reported to root: `validateRealmState` validates observer and clock ledgers separately, while `validateRealmEnvelope` currently checks active viewing's native Village location only. A structurally valid active observer record can therefore be imported without its corresponding clock lease, yielding a live view that cannot advance/activate the interior despite the selected policy. Conversely, individually valid split identities/causes can survive import until the next clock advance rejects their support match. Add a final-envelope exact active observation/clock correspondence check for this same-build namespace, keeping old saves with both absent supported. Enforce at envelope publication/import, not intermediate state validation: paid activation temporarily has observer-before-clock, and shutter intentionally stages clock-close-before-observer-close. This finding is source reasoning; no malformed save was constructed or imported.

The observer's latest detached trusted-native-location projection fixes stale stored player location before activation; no silent save-import relocation was introduced by this lane. No other concrete joined-clock/publication/closure defect found in the currently wired finite path. Behavior acceptance remains deferred.

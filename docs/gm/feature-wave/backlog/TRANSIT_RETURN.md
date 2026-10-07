# Nested carrier and clock return

Status: source released, implemented-unverified. Reserved writer `/root/nested_carriers` owns only `src/backlog_expansion_transit.js` and this return. Shared native/save/UI/build remains Features-owned. No new campaign namespace is allocated here. Features' [nested campaign interface](../features/nested-campaign/INTERFACE.md) and `NESTED_FOOTPRINTS` now provide the selected hub/Saltworks/Archive owners; this module does not invent them.

## Frozen interface v1 for Features

The initial book-world interface had no hub/mission binding, so this queue published the required shape immediately. The selected adapter now accepts existing-owner snapshots through `context.carrierTransit`, with no enrollment from a view:

```js
{
  schema: 1, revision: 1,
  actorId: 'player',
  body: {id: 'native.player.body', revision: 1, ownerId: 'player', controllerId: 'player', form: 'human'},
  endpoint: {worldId, instanceId, regionId, layerId},
  nativeLocation: actualNativeLocation,
  connection: actualDirectedRealmConnection,
  routeContext: actualRealmContextWithEndpointBindings,
  mission: null, // or actual {id, revision, actorId: 'player', issuerId, destination, status}
  worlds: [{definition, instance, visits, nativeOwnerIds}], // existing owners, visits for this instance only
  externalEndpoints: [{endpoint, revision, nativeLocation, nativeOwnerIds}], // existing native Village reference, no synthetic instance
  nativeOwners: [{id, revision, value}], // full actual people/stock/shop/quest/calendar owners
  carrierOwners: [{id, kind, revision, value}],
  // kinds: memory, method, source, fuel, office, credential, duty, debt, curse, observer, ally
  policies: [{id, revision, from, to, qualification, carriers}],
  // All 13 kinds require a directed rule; absence fails closed.
  clocks: [{id, kind, revision, value, policy}],
  // kind: native, hub, local, subjective, transit; absent rates never imply equivalence.
  deadlines: [{id, clockId, at, kind}],
  // kind: return, extraction, settlement; use the declared owner clock only.
  permissions: [], consents: [], // actual realm cargo lender owners when explicitly supported
}
```

Native body/reference revisions may increase, while ID/owner/controller/form and values stay unchanged. All owner wrappers guard exact IDs/values and require nondecreasing resulting revisions. Input body/route context must use the same complete body object. Full snapshot binding is a canonical ephemeral seal of all relevant private owners. Never save it, put it in UI, or append it to a mission history.

The source module exports exactly:

- `CARRIER_TRANSIT_SCHEMA = 1`
- `carrierTransitContext(state, context, binding)` and `buildCarrierTransitSnapshot(state, context)`
- `previewCarrierTransit(state, context, request)` and `stageCarrierTransit(plan, context, request, hooks)`
- `previewCarrierClock(state, context, request)` and `stageCarrierClock(plan, context, request, hooks)`
- `validateCarrierTransitRecord(intent, state = null, context = null)`, `summarizeCarrierTransitIntent(intent)` and `carrierTransitView(state, context, request = null)`

`carrierTransitContext` returns the caller's context plus the binding. It reads existing player knowledge, learned techniques/powers, owned sources/faculties, resources/native vitals, actual held claims, Eda's current credential/two-seal duty/personal debt and separate observer knowledge/relationships. It imports no replacement constants and allocates no owner. Extra local debt/curse/ally/source/office owners are supplied by Features with their actual IDs/values. Required ordinary context: `gameplay.player.inventory`, `equipment.player`, `vitals.player`, `nativeAlive`, `busy`, and the actual state/simulation owners. Existing cargo `classifications`/`allocations` may be supplied in the binding; the existing cargo codec owns their interpretation.

For a snapshot `s`, an instant handoff request is:

```js
{expectedSequence: s.sequence, expectedRevision: s.revision, expectedBinding: s.binding,
 direction: 'forward', purposeId: actualPurposeId, policyId: actualDirectedPolicyId,
 missionId: actualPlayerMissionIdOrNull} // optional exceptionId only with owned actual operating means
```

A clock request uses those same three expected guards plus `{minutes, offline: false}`. Minutes are explicit supported played time, 0–120; no wall-clock read or ambient offline credit occurs. A stale owner/stock/custody/body/mission/policy fails closed. Preview errors return an ineligible result with the actual reason, and stage errors leave the caller plan unchanged because hooks receive a detached draft.

## Qualified edge and clock declarations

Each directed `policies` row requires its own `from`/`to`, ID/revision, and `qualification: {kind: 'original_prototype' | 'source_qualified', evidenceIds: []}`. Source-qualified declarations require analytical locator IDs. These original native hub/mission policies should use `original_prototype`; qualified Paradise design framing does not verify invented native rules as Paradise canon.

`carriers` requires these separate keys: `body`, `cargo`, `memory`, `method`, `source`, `fuel`, `office`, `credential`, `duty`, `debt`, `curse`, `observer`, `ally`. Each rule is `{passage: 'retain' | 'block', use: 'none' | 'unavailable' | 'local_support' | 'jurisdiction_required' | 'fuel_required'}`. Missing keys are unknown and block passage. A blocked carrier must be settled/deposited with its real owner before attempting the edge; this adapter never drops a carrier to obtain admission. No fate entitlement kind exists.

Positive local use needs exact `supports: [{ownerId, path: ['actual','field'], op: 'eq' | 'gte', value}]` queries over actual carrier-owner values. Mere owner existence grants no usable control/fuel. A missing owner/path/query is unknown; an observed failed predicate is blocked. `fuel_required` requires at least one positive numeric `gte` predicate. Office/credential use additionally requires `jurisdictionInstanceIds` containing the actual destination. Same-body transport preserves the actual office and duty, while a foreign office ID in route authorities is rejected without destination jurisdiction. Native power/authority/source executors still own execution; these predicates grant nothing. Acquired passage source/method requirements additionally check actual player source/faculty/learned-method ownership.

Each `clocks` row has an explicit `policy: {id, revision, mode, rate: {numerator, denominator}, qualification}` and actual `value: {elapsed, observedAt, unit: 'played_minutes', absence: 'freeze'}`. Distinct hub/local instances use their actual `instance.clock`, instance revision and `instanceId`. `presence` delegates to `planWorldClock` with actual visits; `freeze` supplies no visits. `supported` delegates to `planRealmActivityClock` with the existing `ledger` and exact `leaseContext` supports. Hub/local world owners currently admit only the existing explicit 1/1 rate. Other rates stay unsupported for those existing owners, rather than being silently approximated.

The `native` lane is the authoritative common state clock with explicit `common` 1/1 policy. `subjective` and `transit` are separate optional existing-owner lanes. Their explicitly declared rates may differ; an interval without an integral result/remainder owner is rejected. Presence requires actual `present`; supported non-world lanes require `support: {ownerId, revision, policyId, from, through, active}` for the complete interval. Missing/expired support advances no elapsed time and reconciles only its observation cursor. No absence injury/death/growth is generated. Return, extraction and settlement deadlines remain separate, evaluate only their declared clock, and reject advancement past a boundary. Reaching a boundary returns `due` without auto settlement; the parent owns the actual choice, withdrawal, breach or recovery.

Native calendars may be separate `nativeOwners` rows with `kind: 'calendar'`, `clockId`, and the actual six-field `Game_Time` value `{year, month, day, hour, minute, day_count}`. Clock sync derives the exact resulting calendar with the existing `Game_Time.goUp`, never a second calendar implementation. Other native owner rows remain exact.

## Unpublished host hooks

`stageCarrierTransit` requires `hooks.stageNativePassage(plan, quote)` and `hooks.readContext(plan)`. The passage hook is Features' actual native move/visit seam: end the prior visit, add one actual destination visit, update the same actor world/person native location, and emit both `nativeLocation` and `nativePatch['current location']`. It must create no native owner, inventory/reward, XP, mission, body or clock. The module checks actual resulting body/controller, complete cargo and custody, source/method/fuel/office/duty/debt/recognition, all retained native owner values, instance IDs/populations/unique claims/branch and visit histories. No overlapping native-body visits or erased ended visits are admitted. Native owners publish only after the existing durable publisher succeeds.

The actual `feature_expansion_nested_host.js` now has `moveWorld`, `prepareNestedArrival`, three actual instance records and the real existing Frontier endpoint `{worldId: 'base.frontier', instanceId: 'frontier.main', regionId: 'frontier.village', layerId: 'surface'}`. Bind Frontier as an `externalEndpoints` row with `nativeLocation: 'Village'`, nonzero reference revision and exact existing native location/person/stock owner IDs already present in `nativeOwners`; no fake Frontier `WorldInstance` is required. Actual nested `visits` is one ledger, so filter it by each instance when supplying `worlds[].visits`. Reconcile `syncNestedCampaignClock` and other actual local observation cursors on the unpublished plan **before** constructing the snapshot/request. Its subsequent call inside `moveWorld` must then be a clock no-op, followed only by the bare movement. Existing nested mission terms/history/offers/settlement and dormant Tidemark/Glasshouse state are also sealed, so a passage cannot reset their unique goods or prior history. `prepareNestedArrival` changes mission stage and arrival knowledge, so expose its bare existing move internally for the guarded callback and apply those ordinary parent effects afterwards.

This is deliberately a conservative **instant, no-fee carrier handoff**. Paid passage and 2/3-minute extraction are ordinary host commitments; wait/recovery/cost staging precedes the handoff. Reconcile actual local clock observation cursors on the unpublished plan before constructing the snapshot/request; the bare move then calls the existing sync as a no-op. Arrival/mission/discovery knowledge and receipt effects occur after the guarded bare move in the same parent plan. The selected finite adapter rejects an occupied or installed Backlog prototype body and retains existing bell-loop/prepaid-packing/view locks; that is an unqualified finite edge, not a universal metaphysical body ban. Unapproved borrowed cargo is rejected by the existing full manifest/lender permission codec.

`stageCarrierClock` requires `hooks.advancePlan(plan, minutes)`, `hooks.syncClocks(plan, quote)` and `hooks.readContext(plan)`. Return a full unpublished existing plan or mutate/return the draft. Shared advancement must reach the exact common target, with no `stoppedAtChoice`, positive `remaining` or exhausted budget. Normal shared advancement may complete legitimately funded NPC work and change stock/facts/beliefs. The adapter seals that actual result immediately after advance; the subsequent sync may change only the declared clocks/calendars, preserving the scheduler's actual owners/history. Apply only `worldPlan.nextInstance.clock` and its exact leases to the current post-advance owner, rather than replacing the pre-advance full instance and losing causal changes. If ordinary shared advance already synchronized these clocks, the sync can be a validated no-op. `readContext` must project fresh resulting state/native transaction snapshots, including actual proposed calendars, rather than reread stale live owners before publication.

Staged plans carry `carrierTransitIntent` or `carrierClockIntent` as ephemeral fields. `validateCarrierTransitRecord` validates these full guarded intents; optional live state/context validation checks the exact current seal. It is **not** a new durable receipt/save schema. `summarizeCarrierTransitIntent` strips the seals, all inventories, memories and private beliefs, keeping only IDs, revisions, body/controller identity, endpoints, mission/policy IDs, common time and clock scalar deltas/deadline flags. Parent-owned `nestedCampaign` may consume that compact result in its existing bounded receipt schema and drop the full intent. Expansion7/nestedCampaign1 remain Features-owned; this module does not upgrade Backlog2 or expansion6/7 and does not create a namespace on rendering/loading.

## Static checks and later gates

Allowed checks completed: new module `node --check`, cold ESM import/export inventory, existing world-definition validation for all three `NESTED_FOOTPRINTS`, and scoped whitespace check. No unit/gameplay/browser/save/reload/failure/keyboard/regression/director checks, private save, source-library access, dependency installation, shared edit, commit or build ran in this worker.

Actual context/native/clock/publisher/player-view joins and matched build are now inspected in [AMENDMENT_BUILD_ADMISSION.json](AMENDMENT_BUILD_ADMISSION.json), bundle `11aaa9cbfc69`; worker source-release hashes remain in INTEGRATION.json. Later playable acceptance remains: conservation and failed-publication behavior; NPC completion while clock-syncing; body/loop/offline/borrowed stock rejection; mission assignee/ID separation; timed extraction interruption/recovery; once-only rewards/unique goods; changed revisit retaining native people/shops/quests/stock/knowledge; known methods with missing local fuel; destination-specific jurisdiction and directed observer correction; source-fiction/pacing review. Source code is implemented-unverified until those deferred playable checks are run.

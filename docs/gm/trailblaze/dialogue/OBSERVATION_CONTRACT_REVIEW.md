# Glasshouse observation contract review

2026-10-04, static snapshot through 19:06:34 UTC (15:06 EDT). Sole write: this report. Bind **one independent bidirectional view connection plus a separate Joss listener boundary check**. Keep the physical doorway, both actor positions, inventories/purses and absence clock as their existing owners. The shapes below are original `O` proposals for existing exported APIs, not claims of implemented adapters or book canon.

## Actual blockers and minimum declaration changes

The four declarations remain omitted from native registration (`src/pocket_realm_host.js:21-26`). Direct registration is insufficient:

- `notice_sample`/`send_notice` require `glasshouse.instanceClockActive`, which is false without an actual visit (`src/pocket_realm_scenes.js:118-126`, `:252-269`). Remove that requirement **only from these zero-duration reactive actions**. Their existing actual faculty/body/anchor/sample/return predicates remain. Qualify those predicates from the current view event and planner results; do not set the ordinary clock predicate true.
- `cooperate`/`replay` inherit Glasshouse world/location, Joss target and co-location, plus the instance predicate (`src/pocket_realm_scenes.js:47-58`, `:129-136`). For this Village interface, declare `worldId: "base.frontier"`, `location: "Village"`, omit `targetId`, set `coLocated: false`, and replace instance visibility/access with the player's actual known notice and, for cooperation, current qualified contact/return support. Preserve the real one-coin debit, Joss credit, claimed-role wording and once-only cooperation. Replay needs only the stored player notice, even after shutter/source loss.
- Removing `coLocated` alone does not solve remote targeting: **every supplied target must share the actor's world**, and participating actors have the same guard (`src/simulation.js:55-67`). Use null command context targets/no cross-world participants; the independently verified realm contact receipt identifies the remote recipient. Do not weaken these guards or move Joss to Village. NPC notice commands already omit a target and can retain Joss's actual world.

Register the listener proposal's source definition, then select its existing NPC acquisition effects only through an explicit, once-only, staged local calibration/assent action with the real Joss and repaired frame (`src/pocket_realm_scenes.js:212-219`; `src/simulation_effects.js:207-218`). The source's `origin: "trained"`, zero fuel and narrow notice function are `O` scope choices. This action records the grant on Joss, not the viewer. Neither reading, rendering, connection creation nor importing missing fields grants it. A saved pre-existing source may be restored through ordinary validated persistence; import must not run a grant initializer.

## Exact planner shapes

Use the actual existing endpoints:

```js
const F = {worldId:"base.frontier", instanceId:"frontier.main",
  regionId:"frontier.village", layerId:"material"};
const G = {worldId:"pocket.folded_glasshouse", instanceId:"glasshouse.main",
  regionId:"glasshouse.room", layerId:"material"};
const J = "glasshouse.main.caretaker";
const V = "exchange.glasshouse.view"; // Proposed separate observation edge.
const A = "glasshouse.main.glasshouse.frame"; // Actual mapped frame site.
const L = "glasshouse.main.glasshouse.scenes.frame_listener";

const view = createRealmConnection({id:V, revision:1, from:F, to:G,
  kind:"view", controllerId:"player", bidirectional:true,
  duration:0, lifetime:null, costs:[], openingCosts:[],
  requirements:{id:"glasshouse.frame_view", revision:1,
    operations:["view","sense","contact"], bodyForms:["human"],
    anchorId:A, costs:[]},
  chronology:{mode:"present"},
  layerPolicy:{passage:false, manifestation:false, contact:false},
  cargoPolicy:{allowed:false, maxUnits:0, allowEquipped:false, classes:[]},
  observationPolicy:{sense:true, identify:false, reach:false,
    contact:true, identification:"none"}, flows:["light","sound"]});

const listenerRule = {id:"glasshouse.frame_listener.boundary", revision:1,
  operations:["sense","contact"], bodyForms:["human"],
  sourceId:L, anchorId:A, costs:[]};
```

The channel rule intentionally has no listener source requirement: otherwise `planRealmOpening` would require the **player** to own Joss's source (`src/realm_connections.js:191-203`). For Joss's `sense` and return `contact`, AND the connection preview with `evaluateRealmBoundary(listenerRule,jossContext,operation)` and quote any returned costs. A single connection-wide source requirement cannot express these different operator owners. This composition uses real exports and leaves the physical doorway's authored binding unchanged (`src/pocket_realm_rules.js:4-9`).

Store the separate view connection under one optional realm-owned subrecord, with its own `realmConnectionBinding` derived from trusted authored constants. Validate saved immutable fields using `validateRealmConnectionBinding`, not a binding derived from the incoming save (`src/realm_connections.js:50-61`). The new subrecord needs an explicit absence/old-record compatibility rule; missing data means no configured/live view, never an automatic source/channel enrollment. Bind actual endpoint availability to the existing room, not a promise to create it.

Each context is plain JSON with actual `actorId`, current staged `sequence`/joined `clock`, real endpoint/life/body, `busy`, `knownConnectionIds`, `sources`, `resources`, `anchors` and `bindings`. Both endpoint bindings must supply `positions: []` for these nonmovement operations; no fabricated arrival slot is needed (`src/realm_connections.js:64-74`, `:170-173`). Player remains F; Joss remains G. Every request uses the current staged sequence and connection revision:

```js
{expectedSequence:ctx.sequence, expectedRevision:view.revision,
 direction:"forward", operation:"view"} // Player.
// Joss uses direction:"reverse", operation:"sense" or "contact".
```

Project Joss's source snapshot from the actual `actors[J].sources[L]`, matching registry revision and `simulation.faculties[J][L]`; require awakened/active, unsuppressed, unexpired ownership. Only then supply `{id:L, ownerId:J, revision, owned:true, active:true, suppressed:false, operations:["sense","contact"], bodyForms:["human"], ...actualRecoveryAndExpiry}`. The API checks owner, operation, body form and recovery/expiry (`src/realm_boundary_rules.js:75-80`, `:100-120`). Read `body.frameSense` from Joss's actual body. His current declaration has hands/vitals but no form reference; Engine must bind an authored actual body profile/reference, or explicitly add its `human` form in the staged `O` setup. Do not infer a body form merely to pass a guard.

Project `{id:A, revision:instance.revision, available}` from the actual frame site and repaired-frame facts in `realmPrototype.instances["glasshouse.main"]`, plus the selected installation's own receipt. It is a reference to that existing frame, not another anchor owner or a saved duplicate availability flag. A registry label alone is insufficient. Source/body suppression or anchor loss makes the next use unavailable.

The host creates a sampling record only from a successful player `view` plan:

```js
{id:`glasshouse.sample.${ctx.sequence + 1}`, connectionId:V,
 connectionRevision:view.revision, active:true,
 observerId:"player", subjectId:J, cause:viewPlan.cause}
```

Put this actual record in `jossContext.observation`. `sense` requires matching connection/revision, active sample, Joss as subject and a real observer ID (`src/realm_connections.js:139-147`). Host checks also resolve the subject/observer to existing live actors at the real endpoints, and tie the sample to the successful view receipt/current terminal use. Internal actor IDs stay author-facing; the public result reveals only an anonymous trace. `identify` is deliberately unavailable; a later role claim is a received claim, not verified historical identity.

For each signal direction supply an actual immediate contact receipt:

```js
{id:`glasshouse.signal.${ctx.actorId}.${ctx.sequence + 1}`, actorId:ctx.actorId,
 targetId:recipientId, connectionId:V, connectionRevision:view.revision,
 targetEndpoint:destination, validThrough:ctx.clock,
 channel:"material_signal"}
```

This is `ctx.contact`, not a simulation target. Derive it from the active paired terminal and actual live recipient; do not fabricate it from remembered speech. Joss's reverse recipient is player at F; player's forward recipient is Joss at G. `previewRealmPassage(...,"contact")` checks the connection/revision, actor, destination, duration and expiry; **the host must additionally verify that target ID's real endpoint/life**, because the planner only validates the receipt shape (`src/realm_connections.js:161-175`). Both directions are zero-duration, same material layer and information signals; no body/item passage or remote inventory access is granted.

## Native publication contract

| Native action | Existing APIs and required authoritative result |
| --- | --- |
| Configure with Joss | New authored local setup command through `commitSimulationCommand`; apply the proposal's actual Joss source/body effects once, after local consent and actual frame support. Save source/installation receipts on existing owners. |
| Open anonymous view | `planRealmOpening` then forward `previewRealmPassage` with operation `view`, recomputing request revision after opening. Commit connection/sample and player observation evidence through the durable publisher; create no visit, body relocation or stock. |
| Reactive detect and one deliberate notice | Explicitly stage only `notice_sample`, then `send_notice`, after current reverse `sense`/`contact` plans plus `listenerRule` qualify. Check Joss's actual willingness/availability, current sample recipient and source/body/anchor again. Preserve their once completions and NPC-private detection record; only the actually delivered notice becomes player knowledge. Reference the detection cause to this sample, not an old `detected` record. |
| Paid role claim | Qualify forward player `contact` and Joss's supported return/instruction path. Debit exactly one actual native `money`, credit exactly one Joss-owned `coins`, and publish the two attributed records/directed memory in one settlement. `quoteRealmCosts([{ownerId:"player",resourceId:"money",amount:1}],playerCtx)` can quote means; do not charge it again after the simulation cost. This selects an original service-payment settlement between the existing purses, not physical coin/item transport through a view. If physical coin transport is wanted, that requires another authored means. |
| Shutter / replay | Shutter: `planRealmClosure(view,playerCtx,{expectedSequence,expectedRevision,reason:"manual"})`, with actual reachable Village control/body support. Commit only that view connection closed and sample inactive; retain the room, physical door, people, stock, knowledge and prior fees. Replay: read only `knowledge.player` through `pocketRealmSceneView`/the targetless empty-effect declaration; it needs no live channel/source and publishes no new sample/payment/source. |

`realm.observation_open`, `realm.interaction` and `realm.connection_replace` are **planner data**, not supported simulation effect types (`src/realm_connections.js:3`, `:175-186`, `:206-233`; `src/simulation_contracts.js:37-40`). Engine needs a narrow allowlisted publication adapter that rechecks the real guards, maps the expected connection/sample/recipient receipts and applies the existing simulation knowledge/resource effects. Do not pass `realm.*` directly to `applySimulationEffects`. Stage all substeps on one plan and publish once; refresh staged sequence/revision between substeps. A failed view/cooperation/storage publication must expose none of the staged changes.

Preserve the absence policy: no active visit means `planWorldClock` advances local elapsed time by zero (`src/world_instances.js:308-344`). The two reactive commands run at the **current joined clock without advancing it**. Their specific context may omit the synthetic absence `busy` flag while retaining actual actor/job occupancy; it does not alter `realmSimulationContexts`, `activeVisitId`, ordinary clock facts, controller schedules or private-research job clocks (`src/realm_state.js:63-66`). Do not add view-opened visitors or set `glasshouse.instanceClockActive=true`. Private research and its disclosure continue to pause outside real visits.

The native action projection also needs an explicit Village observation branch: current generic scene visibility requires `inside`, and `pocket.*` unknown actions fall into the doorway handler (`src/pocket_realm_host.js:64-80`). Register the four declarations only after the remote metadata changes; route their observation entry points independently, with null simulation targets. Show only player-granted observation records and known edge snapshots. Existing knowledge attribution can reuse the already-begun actual repair situation from meeting; its historical context remains valid after travel (`src/causal_situations.js:22`, `:42`, `:52-56`). A new cross-world `situation.begin` would currently fail its same-world participant guard.

## Snapshot and limits

SHA256 values at the last source snapshot:

| File | SHA256 |
| --- | --- |
| `src/pocket_realm_scenes.js` | `7cd3c515d1291c3120d9d5e7e83dce135aa1e1ebef1349ec7cf3af7f6be93a3c` |
| `src/pocket_realm_rules.js` | `97f0c8caa828294c8d1b4139503c48a1b6ef44f87c2b660b52df2cebf3a4d862` |
| `src/pocket_realm_host.js` | `ce848e93db9273c4384e46cc36a711672e130e9ec2286a42a360fc6cea10caca` |
| `src/realm_state.js` | `6a16f70369bc8de16fa2355b1b7641090cc4fef41ddec2851551e083009e43c3` |
| `src/realm_boundary_rules.js` | `d219f58f725609a6d3c661065daa7a5112108170209532e50f23dc836413abe2` |
| `src/realm_connections.js` | `e33ef4f41f0530d529a855d4b58b602c55deb678836516b361ce55b145281710` |

Static numbered reads and hashes only; no hypothetical shapes were executed or validated by tests/imports. No suites, scenarios, browser/save checks, source/shared/global/book/save writes, private-save/book reading, descendants or messages. Engine's concurrent build was not awaited. This report specifies the remaining bounded dependency; ordinary registration alone does not complete the observation objective.

## Narrow contract clarification, 2026-10-04

These selections supersede the earlier bidirectional-view and empty-effect replay alternatives; this is an append-only clarification, not a new source review.

- **Set the visual edge's `bidirectional: false`.** `previewRealmPassage` admits reverse `sense`/`contact` interactions even for a nonbidirectional edge, while rejecting an ordinary reverse `view` (`src/realm_connections.js:134-135` in the reviewed snapshot). Joss's qualified return signal therefore does not open a reverse picture of the observer. Retain the source/body/anchor, current sample, actual recipient and signal receipt checks in both interaction directions.
- **Replay bypasses durable action dispatch entirely.** The UI reads only `pocketRealmSceneView(content, state.simulation?.knowledge.player ?? {})` and displays the retained observer records. Do not call `commitSimulationCommand`, the normal native action dispatcher or the save publisher for replay: even an empty-effect command increments sequence and records completion/log (`src/simulation.js:114`, `:164-172`). Registering a replay declaration or adding `readOnly` metadata alone does not establish this behavior. No new receipt, record time, payment, source or live sample is produced by reading stored text.
- **Keep one configured demonstration/sample per actual instance.** Configuration, initial view sample, detection and notice retain their initial once semantics; no ordinary doorway reopening resets them. Bind the `detected` and `notice` causes to that one actual sample's ID, connection/revision and qualified delivery receipts. Old known text can be replayed but cannot authorize current contact after the view is shuttered, its support is lost or the recipient leaves the terminal. The physical doorway and its reopen history remain independent.
- **Select the payment fiction explicitly as `O`.** At the authored local setup/assent step, establish that a later accepted one-coin calibration clears the player's existing native `money` and Joss's existing scalar `coins` balances. Root must select and disclose this service-payment interpretation before wiring the debit/credit. It is not a promise that physical cash or inventory crosses a visual edge, and it creates no second currency account, holder or claim owner. The later role claim/payment remains a separate explicit acceptance, published once against actual means and current qualified contact.

The parent's announced source work will supply a local, once-only NPC listener setup: Joss's own kit/stamina, four minutes, actual player participant and bench reservation, then the selected NPC source/body effects. A co-located spare-kit supply option uses actual owned stock to avoid a legitimate spent-stock deadlock; it must not mint or replenish stock on setup/view/reentry. Initialize Joss's selected `human` form only when his actual form is missing or already human; reject or separately author support for a different existing form instead of overwriting it. Existing ordinary IDs remain stable. These are announced implementation selections, not source changes or executed checks by this reviewer.

Narrow clarification gate reached. Only this report was appended; no source reread, source/shared writes, descendants, tests, scenarios or build wait occurred in this clarification packet.

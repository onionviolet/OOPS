# Selected Glasshouse observation adapter

2026-10-04: [pocket_observation.js](../../../../src/pocket_observation.js) is implemented-unverified. Root granted this additional exclusive source after the detached planner delivery. No planner cases, tests, browser, build, save or failure suite ran. Syntax and ESM import passed. Root owns actual dispatch/save/registry/UI/build. The clock GM owns clock ledger enrollment and cutoff integration.

## Root binding contract

Import `pocketObservationDefinitions` (commands and powers), `pocketObservationSources` (Frame listener), `pocketObservationActions`, `POCKET_OBSERVATION_IDS`, `POCKET_OBSERVATION_CHANNEL`, `POCKET_OBSERVATION_CONNECTION_BINDING`.

- `pocketObservationContext(state,context)` adds actual derived predicates. Pass root's `pocketContext` first so native owned inventory, current location, external money, and actual `glasshouse.handsUsable` are bound. It imports neither simulation nor realm-state/expansion-engine. No import grants source/device/stock. Before simulation enrollment public previews return invisible. In base world, player previews/context use a detached projection of trusted host `context.facts.location` (actual native current_location); commit stages that actual location before planner snapshots. NPC contexts never relocate player, and imported save metadata is not a current-location authority.
- `previewPocketObservationAction(state,registry,id,context,previewCommand)` injects ordinary `previewSimulationCommand`.
- `commitPocketObservationAction(state,registry,id,context,execute,expectedSequence=state.sequence)` injects ordinary `commitSimulationCommand`. Root dispatches public `pocket.observation.*` actions; hidden internal sample/detect/notice must not be general user controls. It returns the accumulated common executor plan. Replay returns a copied unchanged state/external/gameplay plus scoped display and empty effects/rewards.
- `pocketObservationView(state)` returns owned device, active/expiry/remaining and player-scoped replay projection. It exposes `lastSampleAt` and labels the last sampled image with its recorded played minute. Sample text contains only public frame repair, bench/shelf appearance and Joss presence, never private stock/plans. An open lease supports local time but does not automatically refresh the stored image. It omits operator/body/source bookkeeping from UI. Frame detection stays anonymous. Ordinary native travel and pocket entry must first close the active view, under root's selected actual body policy.
- `validatePocketObservation(state)` accepts missing optional namespace without enrollment, validates authored connection/channel bindings and retained bounded history, and returns state unchanged. Root save validation calls it. Optional owner is exactly `state.realmPrototype.observation={connection,channel,state}`. Missing means none; closed records stay retained. New optional saves require the matching build; root selects compatibility/envelope binding.

## Played sequence

First complete the real frame/bench, packing instruction, fitted calibration shelf and Joss's separately paid private research. The local `earn_listener` command requires those actual records, player/Joss co-location and willing participants. Player pays one coin to Joss through the common executor. Joss receives actual `frameSense` body faculty, trained source acquisition receipt and learned owned notice power. The player receives no source or power.

Crafting uses the player's owned unencumbered native sealing template, two logs, one kit and two stamina. It requires actual packing instruction, calibrated Joss and supported hands; the template remains reusable. The crafted non-transferable prototype device lives in its owning player fact, plus completed craft and attributed causal knowledge. A label or memory alone does not satisfy ownership.

Outside in the Village, activation costs exactly one native money. The planner quote validates the cost; the common activation command spends once. In the same joined clock: execute activation, commit actual sample, execute Joss detection, then execute Joss's actual owned notice power. Each gets its own actual common executor sequence/cause. NPC `targetId` is null; only knowledge explicitly addressed to player crosses the information channel. No cross-world co-location, transfer, coin gift, physical effect or source copying occurs. Empty detector/notice costs and cooldown zero are declared zero-fuel scope, not fabricated recovery.

View connection is separate, typed `view`, present chronology, human body support, light/sound permeability, sense/reach only. Identify/contact and body/cargo flows are disabled. Channel lifetime is twelve joined played minutes; physical door remains separate/manual. Existing four detached scene observation commands are replaced by these selected actual controls. Do not bind their draft live/return flags from labels.

Manual shutter requires the alive Village body, actual device and usable hands. Expiry and actual support loss close the channel with retained receipt and connection closure cause. Same room, Joss, stock, old evidence and source ownership persist. A deliberately sent artisan claim is at most once per lease and uses a second actual sample at current time. It is never verified identity. Local paid cooperation costs one coin only with actual Glasshouse co-location, owned device, Joss's actual listener/anchor and earlier notice evidence.

Prototype finite history policy: at most32 retained activations, at most two sample receipts and one claim per lease, maximum224 total receipts. At the cap activation gives a truthful unavailable reason. No old causal evidence is silently deleted.

## Clock GM frozen interface

`pocketObservationSupport(state,playedAt=state.clock)` always returns an object:

```js
{active,instanceId:'glasshouse.main',leaseId,expiresAt,leaseRevision,
 connectionRevision,reasons,
 clockBinding: active ? {leaseId,policyId:'glasshouse.live_observation',
  causeId:activationReceipt.cause,issuerId:caretakerId,ownerId:'player',
  sourceId,anchorId,contactId:leaseId,endpoint:channel.to,expiresAt} : null}
```

Actual current player Village body, Joss Glasshouse body, alive human support, acquired awake/active/not-suppressed listener source, owned notice power, repaired shelf/frame anchor, crafted device, exact live edge/lease revision and retained actual sample relation are required. `playedAt` permits prior interval sampling `[oldObservedAt,expiry)` before closure. Stable contactId is lease ID. Continuing live relation does not manufacture repeated detection/notice receipts.

`nextPocketObservationBoundary(state)` returns absolute unexpired active lease cutoff or null. `expirePocketObservation(state)` returns supplied state if nothing closes, otherwise a copied state with an expired/support-lost lease, actual connection closure and one host sequence increment. Clock GM captures that return, preserves elapsed work through exact cutoff, then closes residual ledger observation lease before further resident decisions. It creates no timer/offline advancement and no new actor/source/device.

After actual paid activation root calls the clock GM's selected observation enrollment. Before manual shutter root settles/closes the observation clock at actual joined time. The observation helper closes only its information edge and keeps physical route/room ownership separate. Current selected clock policy preserves already paid jobs' absolute joined due times; absence freezes local elapsed and new resident decisions.

## Remaining gate

Root registry/dispatch/context/save/UI/build integration and later generated-save/manual/expiry/support-loss/privacy/replay/co-location verification. Prior tests do not prove changed code; source review is not behavioral verification.

## Root integration source review, 2026-10-04

Read-only review after root registration/dispatch/UI/envelope wiring. No source edits, build, tests, planner cases, browser or save checks in this review. Verified in current source: all compiled observer commands use `glasshouse` group; generic action list excludes their prefix and adds selected public controls; actual replay returns before native writer; ordinary native travel and physical pocket entry require closing the view; final saved envelope requires one exact live supported view/clock contact, saved native Village and matching cause/source/anchor/contact/expiry/endpoint metadata. UI labels stored image/record minute, exposes only player recipient replay projection and includes close-before-travel instruction.

Current `liveMeans` and `pocketObservationSupport` reject an explicit non-human player body form; `acquiredListener` rejects an explicit non-human Joss form. The conventional absent native form uses the existing `human` fallback. This is an authored native baseline, not a newly acquired shape or support from a source label.

Concrete repair reported to root: player non-human mutation makes `pocketObservationSupport` false, but `expirePocketObservation` then calls `planObservationClosure(... reason:'support_lost')`, whose probe inspects generic liveSupport and subject sense/reach support without operator view bodyForms. If the current player remains alive at Village with owned device, and Joss/anchor/flows remain valid, the closure probe sees no actual loss and throws. Root should add operator `evaluateRealmBoundary(connection.requirements,host.operator,'view')` reasons to generic live support or closure support-loss probe, without charging its costs again. This restores actual closure for the same unsupported body change already denied by clock support. Source writer remained released; no repair or behavioral pass claimed by this review.

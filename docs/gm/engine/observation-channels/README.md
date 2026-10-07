# Observation-channel integration packet

Status: implemented-unverified, 2026-10-04. Exclusive worker owns `src/observation_channels.js` and this directory. Root owns all durable/native/save/UI/registry/build integration. No behavior/planner invocation, tests, browser or save checks executed. `node --check` and ESM import succeeded. Reviewed [existing live/replay content](../../../../src/observation_content.js), [connections](../../../../src/realm_connections.js), [boundary rules](../../../../src/realm_boundary_rules.js), [Glasshouse scenes](../../../../src/pocket_realm_scenes.js), and source acquisition/query code. No sibling sources changed.

## Exact exports and records

`createObservationChannel(definition)`, `validateObservationChannel(channel)`, `observationChannelBinding(channel)`, `validateObservationChannelBinding(channel, trustedBinding)` use an exact authored binding:

```js
{schema:1, id, revision, connectionId, from, to, subjectId,
 listener:{sourceId,sourceRevision,bodyFaculty,anchorId,noticePowerId,noticePowerRevision},
 flows:{sample:['light'],return:['light']},
 activationCosts:[{ownerId:'$actor',resourceId:'money',amount:1}],
 sampleCosts:[], detectionCosts:[], noticeCosts:[], lifetime:12}
```

IDs, price and lifetime are proposals. `from`/`to` are exact `{worldId,instanceId,regionId,layerId}` records. Bind the existing room and a separate `kind:'view'`, present chronology edge, with an operating sensory flow, suitable operations/observation policies and an actual anchor. Do not reuse the physical doorway as this view edge. Imported channel binding must equal the host's trusted authored binding.

`createObservationChannelState()` proposes an additive optional namespace under root's durable realm owner: `{schema:1, sequence:0, leases:{}, receipts:{}}`. `validateObservationChannelState` checks retained lease/receipt references, unique causes/sequences, body endpoints/references and scoped recipients. Absence means empty state, no enrollment or reward. Root must explicitly select compatibility and validate namespace on save/load. Do not create a second copy of actor, room, source, stock, time or connection truth.

`planObservationActivation`, `planObservationSample`, `planObservationDetection`, `planObservationNotice`, `planObservationIdentity`, `planObservationClosure` all take `(state,channel,connection,host,request)`. Return `{allowed,reasons,cause,expectedSequence,expectedHostSequence,channelId,channelRevision,connectionId,connectionRevision,costs,guards,executionRequest,knowledgeReceipts,nextState,informationOnly:true}`. Blocked plans carry no costs/knowledge/execution request/next state. Costs are positive debits, aggregated with actual realm boundary/route costs; root must not debit both the planner quote and a separately published realm preview.

Host is trusted actual snapshot data, never player/imported metadata:

```js
{clock,sequence,operator:realmContext,subject:realmContext,
 closureAuthority:{actorId,channelId,connectionId,connectionRevision,cause,at,
                   endpoint,shutterReachable:true}}
```

Each realm context carries the existing `validateRealmContext` fields, `sequence/clock` matching host, the actual endpoint, and `body:{id,revision,form,endpoint,faculties:{[bodyFaculty]:true}}`. Operator and subject differ; subject matches `subjectId`. NativePlayer remains outside until actual passage. Sample target does not relocate either body. For activation/sample, operator context also supplies actual `bindings`, discovery and resources for `previewRealmPassage`.

Subject `sources` extends the existing actual realm-source projection with `receiptId`, `acquiredAt`, `awakened`, derived from `actors[id].sources[sourceId]` and `simulation.faculties[id][sourceId]`. Require owner, revision, owned/awake/active/not suppressed, body form, operations, availability/expiry. Do not infer ownership from source registry labels. Subject `anchors` adds exact `endpoint`; require same-endpoint real available anchor. Subject `powers` contains `{id,revision,ownerId,owned,receiptId}`, projected from actual learned executable powers. No fabricated cooldown: empty detection/notice costs are explicitly valid zero-fuel policies.

Request always carries `{cause,receiptId,expectedSequence,expectedHostSequence,expectedChannelRevision,expectedConnectionRevision}`. Activation adds fresh `leaseId`. All other live operations add `leaseId,expectedLeaseRevision`. Cause/receipt must be fresh; root rechecks host snapshot/guards before committing. Lease revision increments on each receipt.

## Required executor bindings

1. Explicitly acquire Joss's source/body faculty and learn the notice power through the actual common executor after selecting the scene proposal. Declare source operations `sense`/`reach`, body form and anchor from actual supported means. Register no remote attack/contact/cargo effect. Activation pays its declared actual resource costs and stores a finite lease. Activation itself is not a sample.
2. Commit sample, detection and notice in that order at the same joined played clock. Each may increment host and observation sequence. Sample receipts include sender/subject bodies, target endpoint and anonymous routing. One detection and notice per lease; a later current sample may replace `sampleId` while prior evidence remains. Notice's `executionRequest` must execute the actually owned power through the common executor before adopting `nextState`. Root maps positive costs, private/witnessed knowledge and namespace changes into one durable staged publication. Do not apply planner records as direct simulation effects.
3. Derive `liveSampleReceived` from an active unexpired exact-revision lease/current sample plus real body/flow support. Derive return-path availability from real listener, anchor and reach support; replay never sets either. Root clock adapter may explicitly admit this active supported observation lease for the existing interior clock. This module creates no timers and does not enroll clocks.
4. `planObservationIdentity` with `{kind:'claim',disclosedBy:operatorId,recipientId:subjectId,text}` records deliberate claimed identity only. Verified identity requires `qualified_source` policy, an actually acquired identifying source and subject `identityEvidence:[{id,actorId,recipientId,channelId,leaseId,sampleId,at,cause,sourceId,sourceRevision}]`, matching current clock/sample. Frame listener does not automatically supply identity. Local paid cooperation inside remains the actual co-located scene command, separate from seeing/disclosure. Seeing cannot transfer payment/stock or copy a source.
5. Close with reason `manual`, `expired` or `support_lost`. Manual requires actual local shutter authority/reach; expiry requires elapsed finite lease; support-loss recomputes edge/body/flow/listener/anchor/boundary support. Adopt closure through root publisher, then independently close only the view edge using its real owner/planner if selected. Physical doorway stays separate. Old leases/receipts, people and stock remain. `observationReplayView(state,recipientId,leaseId=null)` returns only this recipient's stored `{id,kind,at,text,cause,leaseId}`, no sampling/cost/lease update.

Receipt actor/body IDs are internal causal bookkeeping. Publish only scoped text/basis to recipients; replay projection deliberately omits hidden operator metadata. A detected anonymous trace is not an identity disclosure. This code has no storage, DOM, timers, singleton state, physical effects, time rewrite, cargo/coin transfer or imports from cargo/clock modules.

Remaining acceptance backlog: root integration/build, later generated save/reload and failure checks, one paid outside view with zero-fuel notice, real shutter/expiry/support-loss closure, private identity boundary, replay without new sampling/cost, actual local cooperation after passage. Existing pre-change checks do not qualify this new module.

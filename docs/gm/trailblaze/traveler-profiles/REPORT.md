# Traveler, body and origin planning prototype

Implemented **unverified traveler prototype**, 2026-10-04. Sole runtime output of this lane: [realm_traveler_profiles.js](../../../../src/realm_traveler_profiles.js). The module has no imports, native mutations, DOM, timers, random draws, save writes, origin/life reset, rewards or automatic source/actor enrollment. Engine now imports its planner through the native one-body Glasshouse enter/exit adapter; [current integration](INTEGRATION.md) owns that live/deferred state. Projection/shared/alternate-body execution remains detached. Engine chat `01a1056b-d82c-7ef2-babb-d8316c45f396` owns integration and every shared native/save/registry/UI/build/global write. [Checkpoint](CHECKPOINT.md), [input fingerprints](INPUTS.json) and [bounded static review](REVIEW.md) preserve this lane's return.

The current human [test deferral](../../dispatch/TRAILBLAZE_PARALLEL.md) and [independent pool policy](../../dispatch/GM_CAPACITY_AND_SUCCESSION.md) govern this delivery. Existing dirty work, private saves, source/library files, attribution and configured primary defaults were preserved. One qualified read-only internal worker was useful; no extra chats, successor, batch, commits, publication, automation or book/Calibre changes were created.

## Actual exports and contract

| Export | Result |
|---|---|
| `REALM_TRAVELER_SCHEMA`, `REALM_TRAVELER_MODES` | Detached schema 1; `physical`, `projection`, `alternate_body`, `shared_body` |
| `validateRealmTraveler(profile)` | Checks JSON snapshot shape, distinct ownership, body/pool/cargo references and explicit embodiment policy; throws on malformed snapshots |
| `validateRealmTravelerSupport(support)` | Checks a specific source's supported mode, forms, functions, count, costs and noninventory manifestations |
| `previewRealmTraveler(profile, context, request)` | Returns eligibility/reasons, source-only costs, support/owner refs, guards, retained domains, proposed arrival/intents and required native bindings |
| `planRealmProjection(profile, context, request)` | Same planner restricted to projection/alternate/shared-body modes |
| `realmTravelerView(profile, viewContext)` | Self inspection or another viewer's specifically attributed observations; other observers get no private mind/memory/fuel/source/cargo data |
| `realmTravelerCases()` | Fresh copies of three original author examples; these are inputs, not registrations or passed tests |

All input/output records are plain JSON. Validation rejects cycles, symbols, getters, hidden properties and sparse/custom arrays before cloning or evaluating field data. Returned plans contain **`prototype: "implemented_unverified"`, `nativeExecutable: false`**. `allowed`/`eligible` mean supplied snapshots satisfy this planner, never that the current game can execute it. Failed eligibility leaves `arrival:null` and no intents. There is no executor or receipt ledger here.

Endpoint is exactly `{worldId, instanceId, regionId, layerId}`. The authored examples now match inspected World-lane literals: Frontier `base.frontier/frontier.main/frontier.village/material`; Glasshouse `pocket.folded_glasshouse/glasshouse.main/glasshouse.room/material`. Bench/pane position IDs, source/body/pool/stock/consent IDs and display item keys remain **unbound original proposals**, not claims of existing native objects. There are no imports of moving World or Conceptual interfaces.

### Snapshots and authority

An owner ref is `{domain,id,revision}`. `profile` is a **read snapshot of existing authoritative owners**, not a second saved traveler inventory. The host must create it from live actor/body/source/resource/custody/knowledge records. Handwritten `allowed:true`, acquired booleans, owner mappings or author definitions are insufficient authority in integrated gameplay.

| Profile field | Distinction retained |
|---|---|
| `identityRef`, `mindRef`, `actorId` | One person/controller; body copies reference these rather than acquiring new identities |
| `memories` | `{id,revision,ownerId,kind,subjectId,stage:"remembered"}`; role/experience/description is information and grants no execution |
| `methods` | `{id,revision,ownerId,sourceId,stage}`; `learned` and `fragment` stay distinct |
| `sources` | Acquired/active/suppressed, supported existing `bodyIds`/`supportIds`, `intrinsicControlIds`, actual `availableAt`/`expiresAt`; external service loss is not automatically source loss |
| `bodies` | `{id,revision,ownerId,identityId,mindId,form,endpoint,life,available,functions,poolIds,conditionRef}`; each body has independent condition/vital ownership |
| `pools` | `{id,revision,ownerId,ownerRef,balances:[{resourceId,amount}]}`; current fuel is read once from a unique actual reserve owner, referenced by bodies/presences |
| `cargo` | One actual stock ref/item/count/owner/holder; `owned` or `loaned`; loans retain lender, destination permission, expiry and return obligation |
| `companions`, `obligations`, `embodiment` | Independent companion identity/mind/body and exact consent; duties retain their owner/state and explicit blocked modes; multiple bodies require an acquired `exclusive` or `shared` embodiment policy |

`context` contains `{sequence,clock,supports,ownerBindings,stockBindings,access}`. `clock` is an integer joined played-clock unit, not elapsed wall time. `ownerBindings` supplies `{domain,id,revision,ownerId,available}` from actual owners; identity/mind/condition/pool reads compare against it. Selected cargo compares its ref revision, owner, holder, key and full count against actual `stockBindings`. Duplicate underlying stock is rejected across holders, and duplicate reserve aliases are rejected.

`access` is a **host-reconciled boundary-plan snapshot**, `{id,revision,actorId,bodyId,sequence,duration,mode,from,to,allowed,reasons,expiresAt,cargoIds,companionIds,presenceIds,presencePositions}`. This proposed adapter shape is not today's Connection API. Match body, actor, endpoints, mode, sequence, duration and admitted owner/presence IDs. Boundary/source expiry is checked through the planned duration. Individual new-presence positions are explicitly bound. Physical travel must include every held cargo record; leaving an item behind requires an actual prior custody transfer.

`request` freezes `{mode,bodyId,expectedRevision,expectedSequence,duration,to,supportId,targetBodyId,presenceIds,presencePositions,cargoIds,companionIds}` plus `presenceForm` for new presences. Presence positions are `{presenceId,positionId}`. Alternate bodies already exist and retain their own pools/conditions/equipment; only exclusive control switches. The narrow source planner uses living available controlled bodies and does not implement body death, resurrection, infancy, plant physiology, unconscious remote controllers or family/origin generation.

### Source support and stronger exceptions

Support explicitly defines `{id,revision,sourceId,methodId,mode,originForms,arrivalForms,requiredFunctions,grantedFunctions,poolIds,sharedSourceIds,maxBodies,setupCosts,sustainCosts,material,permitsCargoTransfer,manifestations}`. `methodId:null` is allowed only when the actual acquired source declares that support in its `intrinsicControlIds`; remembering a protagonist still cannot create the source or guidance. A learned method must reference the actual operating source.

There is no generic rank normalization or mandatory fairness counter. Source-specific forms, functions, simultaneous-body count, shared sources, genuine zero costs and intrinsic guidance can be superior when explicitly supported. Costs aggregate by actual pool/resource: setup per requested presence plus sustain per presence per planned clock unit. Exclusive switches can pay from an actual current-body pool while the destination body's pools remain independent. `costScope:"traveler_source_only"` matters: the master must aggregate boundary and native costs with these before reserving once.

Projection retains the existing home body and admits no physical cargo. Material source bodies retain one declared mind/pool/source reference set, get independent position and future condition owners, and start without held stock. A defined Attribute coat is a noninventory manifestation, not a duplicated weapon. This narrow prototype supports explicit stock transfer to one new material body only; multi-presence distribution requires a later exact assignment contract. Companion projection/body-sharing is unsupported here, rather than assumed consent.

Plans retain all identity/memory/method/source references and duties, list home-body/resource owners, and propose a single receipt key without granting identities, methods, inventory or rewards. Sustain end and interruption require native resolution. There is no implicit refund, recall, destruction of cargo or return teleport; resolve actual custody before ending a material body. Reentry/history/reward ownership stays with existing World/Engine owners.

## Three authored cases

| Case | Actual proposed decision and retention |
|---|---|
| Ordinary cargo/companion passage | The same owned Survey rope and lender-owned Fitting gauge cross with the current body; separately consenting Mara moves as her own person/body. The gauge return duty remains. No source or power is granted by the remembered hero role. |
| Projection with retained home body | An acquired prism-link faculty plus learned execution supplies a light/signal presence at one admitted pane. Home body, physical stock and original identity/mind remain. Proposed two-unit support uses one focus pool. |
| Source-qualified shared bodies | An original Sevenfold conduit supplies two independently positioned work bodies, one mind and the same essence/focus pool. Each can manifest a source coat; the one held Work blade stays at home. No duplicated sword, fuel, identity or reward appears. |

Names, forms, costs, guidance, seven-body capacity and functions are reversible author choices. By reading the authored numbers, projection would quote 3 focus; the two-body case would quote 6 essence and 4 focus over two units. **These are hand-derived expectations, not executed case results.** The exported inputs have not been run through planners during this test-deferred wave.

## Evidence, inference and original choices

Inspected [Shadow Slave source notes](../../../research/novels/shadow-slave/observation-emergence/SOURCE_NOTES.md#immediate-theft-to-return-gap-closed-1582-1584) and [synthesis](../../../research/novels/shadow-slave/observation-emergence/SYNTHESIS.md), not book prose. Supplied English compilation hash is `2faa3640bfc84043d1821b935c42bd4d22a9c7af3b65a985b3595ed0b519c0b6`; original authenticity remains uncorroborated. This lane adds **zero fresh chapter reading** and claims no whole-series fidelity.

- **Observed in the inspected notes:** OE15, 1583 p1-62, records six embodied shadow copies and independently moved bodies alongside Sunny.
- **Reported experiments:** OE16, 1584 p1-44, describes one consciousness/soul/essence reserve, mental burden and sustain support. 1584 p28 distinguishes Attribute armor manifestations from a singular held Memory weapon needing individual supply.
- **Inference boundary:** failed summons do not establish destroyed/transferred item ownership. Shared viewpoints are not independent witnesses. Losing an external service/name condition is distinct from deleting a held faculty.
- **Separate transit evidence:** [1586-1588 reader notes](../../../research/novels/trailblaze-reading/realm-transit/NOTES.md) report observed refugee gate entry, Sunny's attributed Spell-bearer travel account, and no tested post-banishment round trip by Sunny. These do not prove our projection/body/cargo rules or universal cross-world access.
- **Original implementation choice:** prism and conduit examples, player body/controller/pool IDs, consenting Mara passage, finite focus/essence costs and source-coat functions are authored proposals. Sevenfold is source-informed inspiration, not Sunny's registered canon mechanics.

## Integration and verification gate

Required host bindings are returned with every plan: one actor/identity/controller; independent native body position/senses/condition/actions; reconciled exact boundary access; real shared resource/source/control/sustain ownership; actual stock/custody and companion consent; one durable guarded publisher/receipt. Existing `native_gameplay_adapter.js`, `energy_resources.js`, `simulation.js`, storage transactions and persistence/publication offer partial foundations. They do **not** currently implement this body/presence contract or accept returned intents as simulation effects.

Next concrete Engine action: read actual exports and reconcile the host `access`/owner/stock adapter against the returned Connection/World contracts; first bind one ordinary passage's complete native cargo and consenting independent people before registering any remote body. Match item keys/position IDs to real owners. Preserve source superiority instead of deriving a universal power rank.

No traveler-owned save field/schema compatibility is selected: Engine's imported ordinary-body adapter supplies ephemeral snapshots/eligibility and does not persist these profiles/intents. Engine owns the optional pocket instance/visit compatibility decision separately. Persisting remote body/presence/controller/pool references requires Engine's explicit additive/version/migration decision. Private saves remain untouched.

Completed evidence: final source syntax and dynamic ESM import/export discovery passed; local document links/anchors, JSON fingerprints and scoped whitespace checked. One read-only source reader qualified; its bounded static ownership review found three defects, all repaired and reread. This establishes parsable/importable code and inspected repairs only, not planner, physiology, gameplay, save or human acceptance.

Deferred gates, all not run:

1. Planner positive/negative cases: memory-only versus learned/intrinsic control, body/source/form/expiry/fuel, exact positions/admissions, private observer knowledge and superior sources.
2. Native physical inventory, loans, companion consent and independent body/vital/pool binding; no hidden stock, held-weapon duplication or shared-resource aliasing.
3. Joined source/route/native cost reservation, sustain/attention, interruption/source suppression/expiry/termination and custody resolution; no implicit refund, teleport or erased duty.
4. Stale/replay/duplicate settlement, failed-save/quota publication, old/new/mid/projection/return import and reload after an explicit compatibility decision.
5. Rebuilt visible ordinary enter/return and supported projection/shared-body flow, usable discovery/focus and human fiction/numbers/game-feel review.

The old stop-at-packet gate is superseded by the human [until-completion policy](../../dispatch/AUTONOMOUS_GOALS_AND_FULL_BOOKS.md). Continue the finite traveler objective through current integration/ownership dependencies recorded in [INTEGRATION](INTEGRATION.md), without expanding it into unrelated origins, a new catalogue or a deferred test batch.

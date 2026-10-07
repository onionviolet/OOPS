# Conventional Glasshouse integration source review

2026-10-04. Reviewer `/root/boundary_review`; parent `/root` owns `realm_boundary_rules.js` and `realm_connections.js`. Engine owns caller/native/state/publication sources; traveler GM owns its detached profile module. Scope is read-only integration reasoning under the autonomous-goal/test-deferred instruction. Sole write is this review. No planners, cases, tests, imports, syntax/build, browser, personal saves or failure suites were invoked. Integration remains implementation-unverified.

Inspected snapshots:

| Source | SHA256 |
| --- | --- |
| `src/pocket_realm_host.js` | `06b31ac0ac0cd6c084bb8a3c9bf4add0e81d262652a97553836f86c7470d8ff9` |
| `src/native_realm_traveler.js` | `10211b786234115a35e78ebb67f0fa5cfde45d4ae95b1bd347a2c0feb4815300` |
| `src/realm_state.js` | `5a2eb8ff8a9343c8d9fd7f9c3fd754fad345504329280e12bce798b37c5aa364` |
| `src/realm_traveler_profiles.js` | `8e9cccd40eb14f978d2eea290f41da5ccda073a9ebcfa3606aa77bd7b0086775` |
| `src/realm_boundary_rules.js` | `c5ba620b907884f2d912258e2215bb984a18e6f9b2b7ed21444bb9d690ab0769` |
| `src/realm_connections.js` | `32f964f8533735b58f16cb00c55f1c0d3acfbe01f21ca2fc77643328f19405de` |

## Material Engine-owned gaps

1. **P2: Accepted route records exceed the cost/timing contract actually published.** `pocket_realm_host.js:92-102` computes and admits a planner quote, then commits a separate fixed receipt command without applying or matching `quoted.costs`, `quoted.duration`, guards or effects. The receipt costs at `pocket_realm_host.js:31-34` charge exactly one money unit for opening and nothing for travel. `native_realm_traveler.js:20-26` likewise substitutes duration zero and expiry null rather than mapping the admitted passage interval. `realm_state.js:16` accepts general valid connection requirements/costs/durations without enforcing the fixed conventional seed's contract. Thus an accepted route with a larger opening debit, a passage debit or nonzero duration can pass the planner while the host undercharges or moves immediately. **Current generated seed is aligned** at `pocket_realm_host.js:89-90`: opening cost1, no other costs, duration0 and no lease. For this slice, reject unsupported saved contract variations before use/import or assert exact quote/receipt agreement; broader routes need actual quoted debit aggregation, timed commitment and resolution guards before publication. No change to the pure planners is required.

2. **P2: Imported route identity is only partially reconciled.** `validateRealmState`, `realm_state.js:16`, checks connection ID plus origin/destination instance IDs, but does not require the authored world/region/layer fields or the fixed physical/controller/direction contract. For example, a destination with `instanceId: glasshouse.main` and a different region/world remains a valid detached connection and passes this realm-state check. Later `routeContext` binds only the authored full endpoints (`pocket_realm_host.js:52-55`), so `previewRealmPassage` rejects it at `realm_connections.js:105-107`; an already active pocket save can then have no usable return. Reject unsupported endpoint combinations during state validation using all four frozen IDs. Keep broader route kinds/direction/control unsupported until their actual native actions exist.

These are accepted-record/native-contract defects, not observed failures of the current fixed seed. No planner/source execution or save modification was used to establish them.

## Earlier mapping gaps resolved in current source

| Mapping | Source evidence and practical limit |
| --- | --- |
| Bag indices with zero-count entries | The suspected mismatch is absent now. `pocket_realm_host.js:50` numbers the full sorted inventory before selecting count>0; `native_realm_traveler.js:8-11` indexes the same full sorted list and has no positive-count filter. Zero entries therefore preserve the same index on both sides. |
| One native player/body/vitals owner | `native_realm_traveler.js:6-19` ties identity/mind to native player, one existing body to its native condition owner and one health/stamina pool. Actual health/life/busy/mobility determine physical eligibility. `realm_traveler_profiles.js:68-87` and `265-282` validate identity/body/pool bindings. Revision1 references are suitable only for the current immediate reread; they are not a generic delayed-body guard implementation. |
| Cargo and equipment | `pocket_realm_host.js:49-54` supplies complete positive bag and worn cargo with custody-derived owners; `native_realm_traveler.js:10-13,23` binds item keys/counts to native bag/equipment domains. Native equipment is outside bag stock (`native_storage_transaction.js:16`). Traveler validation checks actual stock/count/owner at `realm_traveler_profiles.js:124-138,370-391`. Borrowed cargo is deliberately rejected because this doorway supplies no loan-route permission. Native inventory is retained rather than copied on enter/exit. |
| Root/pocket endpoint and durable instance | Content uses `{base.frontier, frontier.main, frontier.village, material}` and `{pocket.folded_glasshouse, glasshouse.main, glasshouse.room, material}` (`pocket_realm_content.js:29-30,66-68`). Planner and traveler compare all four fields. `realm_state.js:13,17-19` binds the pocket's external parent, active player visit and actor world/body location; `pocket_realm_host.js:98-102` changes that same actor/location on entry/return. Same material layer does not collapse the distinct worlds/instances. |
| Cost and durable publication for the fixed seed | Its one-coin receipt uses `commitSimulationCommand` and actual resource effects (`simulation.js:119,156-162`), then existing persistence stages envelope money/native location before writing (`expansion_persistence.js:15-16,36-48`). Main publishes native owner data and location after save (`main.js:336-356`). This resolves the fixed seed's payment path, while finding1 covers the broader accepted-record mismatch. |

## Our module ownership and remaining limits

No new concrete defect was found in our two planner modules for the conventional fixed mapping. They correctly validate complete four-part endpoints, distinct views/body passage, actual quote aggregation, borrowed custody and compatible arrival positions; they return plans rather than performing native publication. Do not cross-import Engine/world/traveler modules into them to solve caller ownership.

`doorway.arrival` is still a fixed declared free position (`pocket_realm_host.js:55`), and the host publishes a native location rather than an independently occupied position. That is a narrow conventional one-body binding, not proof of multiple bodies or spatial occupancy. Sources, methods, anchors, projections, companions and loan permissions are explicitly absent from this native profile; generic faculty/cargo/presence execution remains outside its contract. Independent body physics, source sustain, active-channel closure, historical causation and generic route timing remain unsupported. Tests/browser/save/reload/interruption/quota/physical-acceptance evidence is deferred, not passed. No source/shared/global file changed by this reviewer. Stopping at this read-only result.

## Focused authored-binding addendum

2026-10-04. Source-only review of `realmConnectionBinding` / `validateRealmConnectionBinding` (`realm_connections.js:9-10,43-54`) and the JSON descriptor change (`realm_boundary_rules.js:14-17`). Fresh SHA256: connections `471789a1d23547443a155c20243ce025cd063dc3c4008e20e0b93a6ef26f4bc6`; boundary rules `c5ba620b907884f2d912258e2215bb984a18e6f9b2b7ed21444bb9d690ab0769`. No cases/planners, tests, imports, syntax/build/browser/save execution or shared source edits.

No new concrete defect found in these additions. The binding includes all four endpoint fields, kind/control/direction, costs/duration/lifetime and nested support/channel policies. It excludes mutable revision/opening/closure/lease receipts deliberately. Object-key canonicalization avoids property-order mismatches while retaining array order; binding shape is exact and both compared inputs undergo JSON validation. The descriptor check now rejects non-enumerable hidden data as well as symbols/accessors, with the normal array `length` descriptor allowed; dense/extra-property array checks remain.

**Required Engine caller contract:** derive the binding once from a trusted authored route created from current source definitions, never from the imported/saved connection. Then validate each imported/live connection against that independently derived binding before admitting this fixed native slice. Deriving both sides from saved data is a tautological check. Mutable receipt chronology/lease consistency and actual native debit/duration publication remain separate host responsibilities; helpers do not call themselves or execute a quote. The earlier Engine-owned findings remain open in this review because caller/native/state files were not rescanned in this focused task, and adding helpers alone does not establish their use. Sole write remains this addendum; review stops here.

## Focused lease/closure invariant review

2026-10-04. Source-only review of `validateRealmConnection:18-39`, `createRealmConnection:43-47`, `planRealmOpening:191-211` and `planRealmClosure:215-234` in `realm_connections.js`, the current conventional seed (`pocket_realm_host.js:94-95`) and Engine realm validation (`realm_state.js:15-27`). SHA256: connections `e33ef4f41f0530d529a855d4b58b602c55deb678836516b361ce55b145281710`; boundary rules `c5ba620b907884f2d912258e2215bb984a18e6f9b2b7ed21444bb9d690ab0769`; Engine realm state `41e58e85b0c04e0a58876cb04c0e455c07acc4d5b7978977dd4eba0a4b94dc7d`; Engine pocket host `17d53c94fbd6afc4f1aadb48dbb8b180d60276e4b6afeb6f356a24981f71b814`. No cases/planners/tests/imports/syntax/build/browser/save execution or source edits.

No new concrete defect found in the owned invariant repair. An unopened or permanent route has null expiry; a finite opened route must retain the exact safe `openedAt + lifetime` lease. A real closure is closed, follows its opening, and requires an elapsed lease when its reason is expiry. A previously opened closed route needs its closure receipt. The create path's defaults fit these rules. Opening computes the exact new lease and deletes the prior closure; closing preserves that lease and records current played time. Shared request-time checks prevent plans from producing closures earlier than their supplied opening. The current Glasshouse seed uses lifetime null/duration0 and remains source-compatible with these invariants. Execution compatibility is unverified.

**P2, Engine-owned: an active conventional visit still accepts a closed/null return route.** `realm_state.js:24` validates a connection only when truthy; lines25-27 require the active player's world/body location but never require that connection to exist and be open. Consequently an active pocket record with null/missing connection, or a valid closed receipt, still satisfies these checks. The current host's conventional inside path offers return through that connection and no inside reopening/alternate exit. For this fixed prototype, require an actual open, chronologically usable return connection matching the trusted authored binding whenever the player visit is active. This is a host-state invariant; the generic connection module correctly permits closed routes whose interiors persist.

The earlier Engine cost/duration and partial-endpoint findings remain open in the inspected source: `realm_state.js:24` still checks only connection/instance IDs, and `pocket_realm_host.js:97-101` still commits a fixed receipt after admitting the quote. This review does not reclassify those behaviors as executed failures. Sole write is this addendum; review stops here.

Final source-order follow-up, 2026-10-04: `validateRealmCosts`, `realm_boundary_rules.js:39-43`, now runs descriptor-aware JSON validation before iterating or reading cost owner/resource/amount fields. The requested direct-helper accessor-order repair is present; no new concrete defect found in this focused adjustment. Final owned hashes: connections `e33ef4f41f0530d529a855d4b58b602c55deb678836516b361ce55b145281710`; boundary rules `d219f58f725609a6d3c661065daa7a5112108170209532e50f23dc836413abe2`. No cases/tests or other execution. Parent reports the active-visit/open-return condition has been sent to Engine; implementation/rebuild was not inspected or confirmed here.

## Authored-door caller reconciliation

2026-10-04. Re-read actual rules/state/host/native traveler and durable-publication source. All three earlier Engine findings are **resolved by source inspection for the fixed conventional doorway**, superseding their open status above. No planners/cases/tests/imports/build/browser/personal saves or shared source edits. Runtime/gameplay evidence remains deferred.

`pocket_realm_rules.js:4-9` now creates the trusted authored route independently of incoming state and derives `POCKET_DOOR_BINDING` from it. `realm_state.js:25` requires a connection and compares it against that binding, covering all world/instance/region/layer endpoints plus physical kind, controller, direction, costs, duration, lifetime and support policies. Accepted saved records are therefore constrained to the one-coin opening, zero passage/support debit, duration0 and permanent manual lease that `pocket_realm_host.js:37-40` and `native_realm_traveler.js:20-26` actually publish. This closes the wider accepted-record cost/timing gap without claiming generic timed/faculty routes are executable. Host creation uses the same `createPocketDoorConnection` (`pocket_realm_host.js:1,96`). Its open/close caller admits the planner and stores `quoted.nextConnection` before returning a fully validated plan (`pocket_realm_host.js:98-102,111`). `realm_state.js:28` now requires open=true for an active player visit, resolving closed/null return admission.

Durable ordering still agrees: `expansion_persistence.js:8,15-16,36-48` validates state, stages expansion/money/native location in one envelope, validates that envelope and writes storage. `main.js:327-356` waits for persistence success before assigning expansion/money, publishing native inventory/equipment/vitals/ownership and changing native location. This is source-order evidence, not executed quota/reload/publication proof.

**Remaining P2, Engine-owned: imported doorway receipts can still be ahead of the joined clock.** The final reread of `realm_state.js:23-29` requires correct authored binding and an open return but does not compare `connection.openedAt` or `connection.closure.at` with `state.clock`. Those mutable fields are correctly excluded from the static binding. A future receipt can therefore pass import state validation while a later planner rejects it via `requestReasons` (`realm_connections.js:80-84`). Reject future opening/closure receipts during realm-state validation, including active visits, to prevent an accepted save with temporarily unusable doorway actions. Parent already sent this exact condition to Engine; it had not landed in the final inspected snapshot.

Current SHA256:

| Source | SHA256 |
| --- | --- |
| `src/pocket_realm_rules.js` | `97f0c8caa828294c8d1b4139503c48a1b6ef44f87c2b660b52df2cebf3a4d862` |
| `src/realm_state.js` | `3e971a2b3d159850e6ddab1cc5ad158b4f1dc382b9795b37df5f0f3c8c2671ff` |
| `src/pocket_realm_host.js` | `4b4493c092c2ed24dab0e544fe9bfc5cac45671537ff2e5257276c4cc7b7f742` |
| `src/native_realm_traveler.js` | `10211b786234115a35e78ebb67f0fa5cfde45d4ae95b1bd347a2c0feb4815300` |
| `src/expansion_persistence.js` | `57cb4f38c8023dbb796ab23ae4a790e01d3a0ca12a2863c9c7fe3cc87060b2e0` |
| `src/main.js` | `052dfc85581261726774057f13903a71ed8ad90577d16d75a5b6694e9c9ad8ca` |
| `src/realm_connections.js` | `e33ef4f41f0530d529a855d4b58b602c55deb678836516b361ce55b145281710` |
| `src/realm_boundary_rules.js` | `d219f58f725609a6d3c661065daa7a5112108170209532e50f23dc836413abe2` |

No new owned-planner defect found in this caller reconciliation. Broader body/source/position/generic timing adapters and deferred runtime checks remain outside this fixed slice. Sole write is this addendum; review stops here.

## Final import chronology readback

2026-10-04. Confirmed `realm_state.js:26` immediately follows authored binding validation and rejects non-null opening or present closure times ahead of `state.clock`. The last Engine-owned source finding is resolved in the current file, SHA256 `6a16f70369bc8de16fa2355b1b7641090cc4fef41ddec2851551e083009e43c3`. This supersedes the pending chronology status above. All concrete findings raised by this bounded review are now addressed by source inspection for the conventional doorway.

No tests/cases/planners/imports/build/browser/personal-save execution or shared source edits. Engine's final bundle/source-map matching gate is outside this reviewer task; no claim is made that it passed. Deferred runtime/save/reload/publication proof and broader native adapters remain separate. Sole write is this final readback; review complete.

## Bounded new-consumer contract review

2026-10-04. Inspected the interoperability seams of `realm_cargo.js`, `observation_channels.js`, `realm_clock_leases.js` and their Engine integration notes, rather than auditing every implementation detail. No new concrete defect found in the frozen `realm_connections.js` / `realm_boundary_rules.js` API. All earlier caller findings retain their resolved status. No planners/cases/tests/build/imports/browser/personal saves or shared edits; sole write is this addendum.

Five specific root binding requirements remain relevant:

1. **Keep information and physical edges independently authored.** `observation_channels.js:98-105,202-205,220-223` requires a separate present `kind:'view'` connection and instantaneous view planning. Bind its exact endpoints, sensory flows, actual body endpoint/faculties, destination availability and trusted static contract. Its finite channel lifetime is distinct from physical travel and from the route's own lifetime. Our view effect keeps the operator's body at its original endpoint; admitting observation never authorizes contact, material passage, cargo, a second body or a source grant. Match the chosen channel lifetime against the view route's actual lease; keep the conventional physical door unchanged.

2. **Execute real means before publishing scoped observation evidence.** Subject context must project acquisition receipt/time, owned/awake/active/not-suppressed source, supported body faculty/form, exact anchor endpoint/revision and learned owned notice power (`observation_channels.js:164-184,247-253`). Commit activation, actual current sample, detection and notice in causal order at the same joined minute, using current sequences/revisions. Aggregate channel plus boundary/route costs once. Execute the notice power through the common executor before adopting `nextState`/knowledge; a proposed `executionRequest` is not an execution. Receipts contain hidden operator/body IDs for causality, while replay (`313-318`) projects only recipient-scoped text. Publish that projection, not raw receipt metadata. Anonymous detection does not identify the operator; claimed identity and qualified verification remain separate. These are compatible extensions of our plain-JSON context, not automatic ownership from registry IDs.

3. **Close each admitted relationship through its own owner.** Channel closure (`observation_channels.js:285-307`) proposes retained evidence/lease status; it does not itself close a realm connection or an activity-clock lease. Root must reconcile prior supported time, settle the relevant clock lease, adopt channel closure and close only the view edge through actual controller/authority and an admitted route-closure reason. Our route reasons are `manual`, `expired`, `anchor_lost`; do not pass the channel's `support_lost` label directly as a realm closure reason or fabricate anchor loss. Preserve the physical door/interior/residents/stock. Apply expiry/support loss before further sampling or new resident decisions, with atomic durable receipts. Replay is a read and must not recreate support, extend leases or charge again.

4. **Carry exact cargo consent guards across the coarse route gate.** `realm_cargo.js:187-223` requires the complete exact bag/equipment manifest, current material/custody binding, purpose, directed endpoints, route ID/revision, duration and actual lender consent. Only an allowed per-request result may supply `cargo`, `cargoComplete` and `authorizedConnectionIds` to `previewRealmPassage`. Our borrowed-cargo check intentionally reads route IDs only, so it cannot preserve purpose/direction/consent semantics on its own. Rebuild and compare snapshot/connection/permission/consent guards before commitment and any timed resolution; never cache outbound authorization for return. Return requires its own directed consent. Native traveler needs the rich original `itemKey`/`stockRef`/custody manifest, rather than our compact arrival cargo projection. Missing/ambiguous owner inputs must remain unavailable, never become an invented complete owned bag. Current owned-only immediate travel can retain its deliberate loan rejection.

5. **Use joined played time for intervals and local elapsed for local decisions.** `realm_clock_leases.js:122-149,179-209,214-226` opens/closes authorization only at reconciled `observedAt`, unions actual visits with qualified supported intervals once, caps the next lease/simulation boundary and reports scheduling support without body/contact permission. Project current source/anchor/contact authorization and exact lease revision; reconcile old support before changing or losing those owners because a later boolean snapshot cannot reconstruct past support. Route local time through this union whenever the optional ledger exists, including departure; avoid a second body-only increment. Preserve the declared narrow policy that already reserved jobs retain joined-clock absolute due times, while local elapsed/new decisions freeze without presence/support. A clock activation flag alone cannot authorize a remote player command, identify Joss's private work, move stock or relocate the native Village body.

The live checkout advanced beyond the initial task snapshot: `pocket_realm_host.js:3,13-14,60-64` now imports exact cargo and observation adapters; `realm_state.js` imports observation/activity-clock adapters, and `native_realm_traveler.js` has moved off ordinal parsing. The focused source reads establish that wiring exists; they do not establish that every adapter, registry/save/UI/bundle path is complete or behaves correctly. Helper existence/import and worker syntax reports are not native gameplay delivery or browser/save acceptance. The cargo packet also records that guards are not yet carried through the root context; that remains a specific prerequisite before cached/timed/lender-permission execution, not a demonstrated failure of synchronous owned-only travel.

Snapshot SHA256:

| Source | SHA256 |
| --- | --- |
| `src/realm_cargo.js` | `8895fc5c0a0e6224182e64b4e976c6496ea4a598f0e5756fed6e7cefa1dcabaa` |
| `src/observation_channels.js` | `fa1ae671a2d4864c4589f185e47884b9feb0fa74908bf0c24e567b1f11fb0314` |
| `src/realm_clock_leases.js` | `2daa0cd9778f52e5e2d69834fe65aa87b643d14f3ec7f49f8aae3a5c7718cb3e` |
| `src/realm_connections.js` | `e33ef4f41f0530d529a855d4b58b602c55deb678836516b361ce55b145281710` |
| `src/realm_boundary_rules.js` | `d219f58f725609a6d3c661065daa7a5112108170209532e50f23dc836413abe2` |
| `src/pocket_realm_host.js` | `50b77fd59c32a6f4c41728732503bc042f9ee7aaeebb7bba2af1ceff0f1055cf` |
| `src/native_realm_traveler.js` | `9c06b1fb6381781e000e6187220e9e005cd40b13eb356402a3bd9b52e48b9c51` |
| `src/realm_state.js` | `cf3e0436ab669df71a7373190a3ff2015fec9801177073750d029715e4ca0846` |

Bounded consumer review complete. Root retains all integration/publication decisions and deferred execution gates; our source remains frozen.

# Systems map: shared foundations and local consumers

2026-10-11. Specialist source inspection for SC01–SC10. Planning only. No build,
browser, save, reload or import was exercised. Every capability below is
**source-only support** unless explicitly labelled partial/new consumer. None
certifies delivery, fidelity, integration or director acceptance.

## Input identity and reservation

Only this file is assigned to this specialist. `git status --short` showed
numerous pre-existing modified canonical docs and untracked dispatch/research
areas; no source modification appeared in that snapshot. Preserve them all.
Source revision: `53dc1df15889be6ebb1bae403497041f0672db46`.

Material dirty/read owners at inspection:

| Input | SHA-256 |
|---|---|
| PROJECT.md | `5fa867b61f122a01223ced9ee5f65abc97dc9ea6b993d00d7b5276428c6de46f` |
| docs/GAME_MASTER_PROMPT.md | `9524d382c81a981af02bd2cf9288f410fe9a09b9c6f8d99f7075c6245653de56` |
| docs/gm/FIRST_LEVEL_BREADTH_EXTENSION_2026-10-11.md | `aceda441fe1c71a110a22bdea286adbc029be2d13ccfbf4f4e7ab1168de75bca` |

Read current project summary, GM authority/refresh protocol, breadth criteria,
IDEA_INDEX routing and prior engine report. The assignment's prior
`idea-expansion-2026-10-11/REPORT.md` was absent. Its actual
[engine report](../idea-expansion-2026-10-11/engine/REPORT.md) is available;
its historical claims were checked against selected source rather than treated
as runtime proof. Other specialists/the integrating GM own detailed criteria
and idea reconciliation.

## Common foundations and their actual limits

Paths below are repository-relative. Line numbers identify inspected symbols,
not an inferred test result. Re-read against current source before implementation.

| ID | Foundation, symbol and source | Supported contract | Missing selected binding or scope |
|---|---|---|---|
| SM01 | `previewSimulationCommand`, `src/simulation.js:81`; `commitSimulationCommand`, `:231` | Preview validates actor/role, world/location, selected target, co-location, living participants, occupancy, once/claim/site gates, actual power ownership/execution/cooldown/world support, costs and positive-weight candidate effects. Commit rejects stale sequence and returns a staged plan. | A selected supernatural promise needs an actual command and target/effect adapter. Generic target co-location is optional on the definition, not universal supernatural contact support. Native host quotes exist for specific groups; setting a fact alone cannot impersonate one. |
| SM02 | `startCommand`, `src/simulation.js:144`; `applySimulationEffects`, `src/simulation_effects.js:125`; `prepareSimulationEffects`, `src/simulation_resolution.js:11` | Ordered effects, actual costs, acquired claims, frozen participant context and saved jobs; spawn aliases require a prior spawn in the ordered effect list. Amounts are resolved from facts/model. | Chained/copy/retroactive powers need explicit ordered semantics, target legality and atomic publication; a text saying “doubles reward” does not supply a consumer. No universal arbitrary-effect evaluator was inspected. |
| SM03 | `createSimulationState`, `src/simulation_contracts.js:205`; `validateSimulationState`, `:209`; inventory/equipment/custody branches, `src/simulation_effects.js:203–224,306–316` | People, native versus simulation owners, equipment, custody, knowledge, claims, faculties, powers, progression, titles, jobs/events/controllers/programs/sessions and causes have state owners. Native and simulated stock use distinct bound stores. | A System inventory should select an existing owner or introduce one explicit storage owner and publication binding; cosmetic counters cannot hold objects. Instance-scoped namespaces and capacity rules require local contracts. |
| SM04 | `stageAcquisition`, `src/acquisition.js:39`; `applyGameplayEffect`, `src/gameplay_transactions.js:48`; custody branch `src/simulation_effects.js:217–223` | Stage consumes/grants/transfers against actual inventory; loan custody records distinguish owner and holder and validate return identity/count. XP/reputation effects consume gameplay bindings. | Storage, wagers, trades and boxes need real item identities, custody/disposition rules and receivers. A borrowed object is not automatically legally exportable. Selected consent/escrow UI is a new consumer where absent. |
| SM05 | Power/source/progress/title effects, `src/simulation_effects.js:266–305`; `advancePowerProgression`, `src/simulation.js:330`; `previewPowerModel`, `src/power_models.js:5` | Source faculty development, acquired power mastery/fragments, copy/transfer, constituent requirements and fusion; branch/exclusive-group/parent/receipt progression. Practice, design, investment, authority and hybrid models calculate local legal output/cost. | These fields support authored progression, not arbitrary automatic evolution. Source loss and power loss are separate effect branches. A specific passive cheat needs its actual ongoing consumer; no mastery meter is necessary when its function stays fixed. |
| SM06 | `simulationFacts`, `src/simulation_effects.js:64`; knowledge branch `:225`; `validateKnowledgeBasis`, `src/causal_situations.js:52`; `worldIdentityView`, `src/world_knowledge.js:3`; `knownPeopleView`, `src/people_knowledge.js:12` | Actor knowledge has seen/interpreted/understood stages and optional attributed basis; actor-specific facts expose learned values. World name/branch are projected only when actor facts permit them. People projection uses introductions/received accounts. | Analysis, appraisal, future sight and an in-fiction System's inspection pane need selected observation channels and actor-safe projections. Author registry and raw hidden state must not become the display merely because the provider is called omniscient. |
| SM07 | `planObservationActivation/Sample/Detection/Notice/Identity/Closure`, `src/observation_channels.js:195,215,228,239,260,285`; replay view `:313` | Typed observation channel lifecycle, bindings, leases and recipient replay projection. | Exact sight, predictions and identification require source-local information reach and actual current host connection. A channel contract alone does not prove any selected acquisition/discovery journey. |
| SM08 | Weighted resolution `src/simulation_resolution.js:36`; `startCommand`, `src/simulation.js:172–204`; seed validation `src/simulation_contracts.js:211` | Nonnegative finite positive-total weights; selection draws from saved simulation seed at admission, advances the seed and freezes chosen effects, roll and outcome ID into the job. Preview computes candidate outcomes without selecting one. | Pool revision/pity/duplicate/exchange/reroll policies are selected content/state contracts. Command draws share a simulation stream; unrelated-stream isolation is not established. Box creation-time commitment needs a persisted box outcome/custody record, not opening-command commitment. |
| SM09 | Native RNG consumers, `src/main.js:2617,3857,3869,3906,7105`; simulation event scheduling `src/simulation_effects.js:322` | Native reward chance, crafting and gathered resources still use `Math.random`; simulation checks carry independently derived seed records. | Deterministic entry/history/crafting/fortune promises must bind their affected draws. Reusing saved simulation RNG does not make the whole native game deterministic. No blanket RNG rewrite is needed for an isolated committed draw. |
| SM10 | `nextSimulationBoundary`, `src/simulation.js:440`; `advanceSimulationBoundary`, `:449`; program/pause/resume `:311,321,325`; joined budget `src/expansion_engine.js:619,630` | Timed jobs settle in due/sequence order; conditions/controllers/events/programs join causal boundaries; joined advance stops at 512 boundaries and reports unspent time/budget exhaustion. | Offline policy, many-NPC scaling and automation interruption/stop rules need finite measurements and selected contracts. A running controller is not proof of a simulated economy or closed-browser aging. |
| SM11 | `createWorldInstance/Bindings/Visit`, `src/world_instances.js:271,136,286`; `planWorldClock/Departure/InstanceUpdate`, `:310,347,365`; `syncRealmClock`, `src/realm_state.js:93`; `planRealmActivityClock`, `src/realm_clock_leases.js:179` | Versioned instance/continuity/era IDs, parent instance, actual played-minute anchor, bound travelers/visits and staged updates. Generic clock sums joined visit intervals; Glasshouse has a specific supported activity-clock consumer. | Worlds, dreams and simulations must select reality/autonomy/transfer promises. Parent ID does not create population, transferable goods, subjective time or autonomous absence. Existing actors/claims/sites often use global keys; arbitrary duplicate campaigns need compiled namespaced owners and native projection. |
| SM12 | `createSimulationPanel`, `src/simulation_ui.js:6`; `createExpansionQuests`, `src/expansion_quest_ui.js:9`; actual initialization `src/main.js:7803,7923` | Generic simulation panel previews actionable authored controls and renders reasons; many specialized groups are deliberately excluded. Expansion quest cards are read-only selected view adapters and share native completed filtering. | New command registration alone may be hidden or excluded. An in-fiction System needs its reachable issuer/interface with knowledge-safe presentation and action bindings. Quest cards do not issue quests or publish rewards. |
| SM13 | `Rewards`, `src/rewards.js:3`; `Quest/QuestTask/questManager`, `src/quests.js:11,54,102`; `process_rewards` native chance `src/main.js:2617` | Native quest condition/progress/reward objects and manager exist; native reward categories cover XP, money and content unlocks. | No generalized fictional provider/authority lifecycle, arbitrary dynamic quest issuance or upgrade shop was established by these selected reads. Use native quest progress or a bounded saved contract; rewards must pass the actual transactional owner appropriate to the new slice. |
| SM14 | `persistExpansionPlan`, `src/expansion_persistence.js:7`; actual call/publication `src/main.js:811–823`; envelope/import/size `src/save_files.js:36,178,188–201` | Validate staged expansion, copy current/replacement envelope, bind gameplay/ownership/native patches, validate envelope and write storage before publication. Actual main host stages native writers then publishes only after successful save. Import requires preflight; size guards exist. | Every new state namespace needs validation plus migration/compatibility decision. Failed-write/retry/reload/import proof remains required. Storage guards and sequence checks do not certify every newly authored grant as idempotent. |

## Stable service IDs for the integrating ledger

Each promise receives its own classification. `source-only` means the inspected
code supports that bounded contract; it does not establish exercised runtime.
`partial` means a real foundation exists but the requested family needs selected
binding. `new-adapter` and `new-service` describe proposed missing work, not APIs.

| Stable ID | Promise | Classification | Actual consumer / pointer |
|---|---|---|---|
| SS01 | Ordered staged command execution and concrete effects | source-only | SM01/02: `previewSimulationCommand` / `commitSimulationCommand`, `simulation.js:81,231`; `applySimulationEffects`, `simulation_effects.js:125`. |
| SS01 | Arbitrary cheat effect changing an otherwise unbound native subsystem | new-adapter | Select actual target subsystem and join its existing durable host; effect label alone is insufficient. |
| SS02 | Actor identity, native/simulation ownership and owner-versus-holder custody | source-only | SM03/04: `simulation_contracts.js:205,232`; `stageAcquisition`, `acquisition.js:39`; loan branch `simulation_effects.js:217`. |
| SS02 | In-fiction provider identity, jurisdiction, grant authority and revocation | partial | Authority power model `power_models.js:28`; selected provider/lifecycle consumer still needed. |
| SS03 | Power mastery, fragments, copy/transfer/fusion and branching advancement receipts | source-only | SM05: `simulation_effects.js:279`; `advancePowerProgression`, `simulation.js:330`. |
| SS03 | Selected cheat evolution, ordinary bridge or passive output | new-adapter | Connect its exact acquisition and changed function to actual work/battle/body/research consumer. |
| SS04 | Played causal job/controller/program boundaries and bounded joined advancement | source-only | SM10: `simulation.js:311,440,449`; budget `expansion_engine.js:619,630`. |
| SS04 | Closed-browser aging or autonomous arbitrary world time | new-adapter | Explicit selected clock policy and native integration; none follows from existing played clocks. |
| SS05 | Attributed actor knowledge and bounded observation channel lifecycle | source-only | SM06/07: `simulation_effects.js:225`, `causal_situations.js:52`, `observation_channels.js:195,215`; identity `world_knowledge.js:3`. |
| SS05 | Exact System analysis, appraisal, prediction or hidden-source identification | new-adapter | Bind selected information reach and actor-safe views, not raw registry state. |
| SS06 | Weighted command draw frozen into saved admitted job; seeded event checks | source-only | SM08/09: `simulation.js:172–204,483–500`; events have optional authored `guaranteeAfter`, miss/attempt/occurrence counts. This is a local event guarantee, not generic lootbox pity. |
| SS06 | Creation-time box outcome, isolated chosen streams, start/history rolls | partial | Need explicit selected receipt/store/init consumers; inspect native `Math.random` paths in SM09. |
| SS07 | Staged actual resource/item/XP grants with durable native publication | source-only | SM04/14: `gameplay_transactions.js:48`; `expansion_persistence.js:7`; main consumer `main.js:811–823`. |
| SS07 | Dynamic System quests, point-shop purchases, wager settlement or box exchange | new-adapter | Saved offers/progress/claim receipts and selected purchase/settlement consumers; quest cards `expansion_quest_ui.js:9` only display. |
| SS08 | Authored priority NPC controllers choose only eligible registered actions | source-only | `advanceSimulationBoundary`, `simulation.js:505–523`; candidate predicates and real command preview gates precede start. |
| SS08 | Autonomous economy, general long-term planning or adaptive social inference | new-service | No generalized solver was established by this pass. Use a bounded authored controller until a selected promise needs more. |
| SS09 | Versioned world instances, visits, staged changes and supported local activity clock | source-only | SM11: `world_instances.js:136,271,286,310,347,365`; `realm_state.js:93`; `realm_clock_leases.js:179`. |
| SS09 | Arbitrary duplicate authored worlds and player law/population creation | partial | Instance IDs exist; compiled namespaced native stock/quest/actor/history binding and creator authority remain selected work. |
| SS10 | Native panels preview current commands and selected read-only quest projections | source-only | SM12: `simulation_ui.js:6`; `main.js:7803,7923`; specialized groups use separate hosts. |
| SS10 | Reachable fictional System UI, provider/upgrade/storage/companion controls | new-adapter | Selected native panel/actions, knowledge-safe claims and consumer ownership. |
| SS11 | Envelope validation, guarded storage/import and durable-before-publication host | source-only | SM14: `persistExpansionPlan`, `expansion_persistence.js:7`; `main.js:811–823`; `save_files.js:36,178,188–201`. |
| SS11 | Compatibility for newly saved provider/box/quest/generated-world namespaces | new-adapter | Validate namespace, defaults/migration, stable definition revision and unavailable-content recovery explicitly. |
| SS12 | Typed definition validation and limited optional pack registration | source-only | `createSimulationRegistry`, `simulation_contracts.js:93`; `validatePack/registerPack/loadContentPacks`, `content_packs.js:23,42,54` check selected families/conflicts. |
| SS12 | Source-qualified complete authored book world or arbitrary generated setting | partial | Bounded source/law/continuity plus actual authored starts, people, means and native gameplay remain content work. Pack metadata is not whole-world delivery. |

## Minimum consumers by expansion family

These are proposed minimum seams, not an engine-wide prerequisite set.

| Family | Minimum actual bindings | Additional service only if promised |
|---|---|---|
| SC01 | SM01/02 action → SM04 real XP/item/standing → SM05 selected progression → SM12 visible consequence → SM14 | Property/body/world-specific source adapters where that route uses them. |
| SC02 | SM05 acquired/retained function plus SM01/02 actual uses; SM06 learned meaning; SM14 | Passive-effect consumer, copy-target reach, evolution or transfer adapter matching its function. |
| SC03 | Ordinary work SM04 → learned/material prerequisite SM06 → SM05/02 new capability → continuing ordinary consumer | New supernatural service only if the bridge's output cannot use current effects. |
| SC04 | SM08 selected committed draw and receipts, SM06 information exposure, SM14; inspect SM09 affected native paths | Start initializer/history generator or stream isolation only for selected domains. |
| SC05 | SM04 funded stakes/custody, SM01/02 accepted rules and settlement, SM08 chance, SM06 opponent information, SM14 | Escrow/multi-round wager state and cheating/detection/fortune adapters. An isolated one-round coin wager can use a bounded staged command; it cannot claim deeper play. |
| SC06 | Real cache item SM04, SM08 commitment decision, SM02 opening/grant, SM06 appraisal, SM14 | Box instance record for creation-time outcomes, dynamic pool revisions, pity/exchange where selected. |
| SC07 | Authored registries SM01/05, actual native starts/actions/UI SM12, source-qualified local adapters, SM14 | New world/era initializer if selected; full arbitrary-world machinery is unnecessary for an existing world slice. |
| SC08 | SM11 explicit instance/visit/clock, SM04 assets, SM06 creator/inhabitant knowledge, SM12 controls, SM14 | Creation authority, law editing, autonomous population, economy or conversion only where promised. |
| SC09 | Specific joins among SM03/04/06/10/11, with shared settlement/publication SM14 | Bounded NPC decision/economy service or offline policy with tested limits, not unlimited background simulation by default. |
| SC10 | SM05 host authority/provider state, saved offer/progress/reward receipt, SM02/04 actual grants, SM06 observation, SM12 interface, SM14 | General provider/quest generator/shop only when the selected System promises them. Companions use real people/controllers; storage uses real ownership; title bonuses need actual consumers. |

## Proposed connected first slice

A local original “work ledger” System can begin without random-world starts:
accept a measurable craft commission, reserve its real materials, complete the
work, claim a single durable reward, spend earned ledger points on a selected
power function, then use that function in a second real craft or field action.
A point balance is a staged actor resource or explicitly validated System store,
not a second money engine. Issuer authority, offered/accepted/earned/claimed
states and receipts are new bounded consumer state. The quest UI is a read-only
projection. The grant and upgrade run through the durable command/publication
path. A later fixed-function storage variant can reuse actual inventory owners.

Proposed proof must show repeat claim denial, insufficient-input denial,
failed-write no publication, fresh UI access, useful upgraded output and
save/reload/import continuity. These are proposed acceptance cases only.

## Overlaps and handoff

Active pre-existing dispatch areas include minigames, starts/talents/continuity,
wider gameplay, body/lineage, world1, lore/timelines and dual GM. Their presence
is an ownership warning, not proof that a worker is alive. This specialist makes
no implementation assignment or shared edit. Reuse the current engine requirement
cards and selected packets; integrator should reconcile new SC cards with those
owners before assigning any overlapping source/UI/persistence changes.

Checks performed here: working-tree inspection; source revision lookup; targeted
symbol/body reads; owner SHA-256 snapshot. No gameplay completion claim. A memory
registry quick pass reinforced reuse of existing owners (MEMORY.md:49); all
support claims above were independently qualified against current source.

## Integration boundaries

[Detail ledger](DETAIL_LEDGER.json) binds SS01–SS12 to each selected candidate.
[Packets](PACKETS.md) sequence only their required consumers. Historical browser
receipts in PROJECT belong to their exact waves; this source inspection confirms
no current expanded journey. Native XP repair, source-world expansion and other
active dispatches retain their reservations. Future implementation must recover
their current checkpoints and reserve shared main/save/registry paths once.

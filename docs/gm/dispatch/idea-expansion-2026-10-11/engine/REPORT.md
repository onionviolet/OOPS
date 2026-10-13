# G5 engine actionability, 2026-10-11

Status: planning-reviewed-by-worker. Revision 1. No runtime claim.

Current code already owns commands, bodies, knowledge, stock, claims, jobs,
world instances and durable native publication. The main gap is connecting
ambitious starts, duplicate histories and exceptional functions to these real
owners. A new parallel engine would duplicate work and split authority.

This pass returns 12 cross-cutting requirement cards and five provisional
packets in [REQUIREMENTS.json](REQUIREMENTS.json). It qualifies inspected source
interfaces only. Final G1–G4/G6/G7 detail reconciliation awaits their finalized
outputs and the parent integration pass. It does not qualify browser behavior,
source fidelity or a completed world.

## Findings and reusable owners

**F1. Random start selection needs actual initialization.**
`createExpansionState(seed)` initializes `base.frontier` and the player there.
`chooseSimulationOrigin` settles `origin.selected` and authored effects. Neither
is an arbitrary world/era/body/native opening initializer. A start transaction
must bind the installed qualified candidate pool, native character creation,
location/access/quests/stock/skills, body, actor knowledge and prior world causes
before one durable publication. No candidate catalog needs to appear to the
player. Actual first actions and continuing pursuits must work without
Frontier wages, elder contact or other inherited opening assumptions.

**F2. World records exist; arbitrary duplicate-world isolation does not follow.**
`createWorldInstance`, `createWorldBindings`, `validateWorldRecords`,
`worldInstanceFacts`, `createWorldVisit` and departure/clock/update planners are
real exports. Current Pocket, destination, nested, book and Proto23 hosts consume
these contracts. Simulation people, claims, owners and many sites/events remain
globally keyed, while generic world facts use `state.worlds[worldId]`. Arbitrary
parallel instances require instance-scoped compiled bindings and exact native
quest/stock/history projections. A distinct era ID alone does not construct its
historical population or actual prior causes.

**F3. Time and exceptional powers have useful bounded support.**
Generic `world_instances` constructor/`planWorldClock` supports active visits and
freeze-only absence. This is a statement about that generic contract, not a
universal rule for current worlds. Glasshouse `syncRealmClock` already consumes
`planRealmActivityClock`, supported paid observation leases and exact expiry
boundaries to advance activity beyond occupied visits. Extend those hosts for
selected local policies rather than pretending all absence is frozen or already
autonomously simulated.

`rewindScenario` restores scenario state while retaining actors/worlds/RNG and
receipts. The Backlog time implementation additionally demonstrates a finite
actual local person/body/fact restore under a stock seal. Those scoped mechanisms
cannot stand in for arbitrary world regression, exact future sight or independent
histories. Every stronger function needs its declared included and retained owner
domains, causal order and target consumer.

**F4. Native ownership and knowledge contracts should be extended.**
`stageAcquisition`, gameplay envelope transactions, simulation custody/claims and
`persistExpansionPlan` already stage actual stock and native effects before live
publication. Pocket cargo uses real inventory/equipment/custody snapshots; its
current native passage rejects borrowed cargo and supplies no consent grants.
Pure permission planners do not prove a consent UI or loan export journey.
`knownPeopleView`, `worldIdentityView` and observation channel planners provide
knowledge-qualified projections. Selected social or cheat actions should use
these observed means and registered commands, not expose full hidden state.

Body props and native vitals have existing consumers, including finite body,
installed-component and consenting-host examples. `previewNativeRealmTraveler`
is a conventional single-body physical passage projection. Infant, object,
rooted, hive and system-entity options still need actual viable native action,
care/controller and presentation adapters as selected by G1/G2.

**F5. Fidelity, scale and compatibility remain explicit gates.**
Expansion and simulation have saved random streams/checks; native `main.js`
still contains `Math.random` consumers for actions, combat, crafting and rewards.
The moving absorption `advanceLocalLife` signature also defaults to `Math.random`.
A selected deterministic history/start/temporal mechanism must inspect and bind
its affected draws. This is not an instruction to rewrite all native randomness.

The shared scheduler returns unspent time after 512 causal boundaries;
`save_files` guards a 4 MiB origin storage budget. Many-instance/actor/history
content needs measured finite workload evidence, not an assertion that these
bounds guarantee acceptable performance. Legacy optional packs retain opaque
state when unavailable but currently fall back to Village/base.frontier. New
suspenseful starts need a deliberate compatible recovery decision rather than
silently adopting that legacy fallback or rerolling the beginning.

## Detail contracts

| Requirement | Selected scope and observable obligation |
|---|---|
| G5-01 | Join every selected leaf to current owner, revision, consumer and remaining evidence; preserve distinct variants. |
| G5-02 | Commit opaque random selection and coherent actual native/simulation starting snapshot once. |
| G5-03 | Isolate actor/claim/stock/quest/history/cause bindings across instances of one world. |
| G5-04 | Declare played/calendar/local/activity clock policy and exact causal boundaries per consumer. |
| G5-05 | Connect actual body/controller/identity/means to form-specific usable actions. |
| G5-06 | Execute real exceptional functions with exact target, rollback/isolation/retention and consequences. |
| G5-07 | Use holder-specific knowledge and means for NPC commands and public projections. |
| G5-08 | Conserve stock/rights/money/custody/claims across work/trade/travel and failed writes. |
| G5-09 | Give each promised device/craft/facility actual inputs, operating outputs and later consumers. |
| G5-10 | Persist selected draws and receipts without read-time reroll or duplicate settlement. |
| G5-11 | Preserve old/dormant/private-pack state with additive admission and explicit missing-content policy. |
| G5-12 | Freeze finite revision and verify native journeys, storage/time bounds, usability and distinct acceptance levels. |

Concrete cards contain source pointers, existing consumers/gaps, dependencies,
positive and counterexample acceptance cases, proposed extensions and open work.
They cover S00–S14 where relevant. They are a shared contract palette, not
universal fictional costs, lifespan, absence policies, slots or power ceilings.

## Provisional packet order and ownership

| Packet | Finite follow-on work | Gate and dependencies |
|---|---|---|
| G5-P1 | Qualify a generic local-world dossier; compile start/instance/native bindings and additive admission. | Two synthetic duplicate-instance native projections; old-save/no-new-grant cases. |
| G5-P2 | One suspenseful committed start with supported body/first actions/knowledge/RNG. | P1; rebuilt fresh-origin start/use/save/reload/import/failed-write cases; author-only candidate review. |
| G5-P3 | One selected local temporal/event/absence function joined to prior history. | P1; exact boundary/support/retention/isolation cases; no presumed universal policy. |
| G5-P4 | One connected material/social livelihood or exceptional-function journey with aftermath. | P2 and any relevant P3 adapter; acquire/use/develop/respond/retain plus refusal/lost-support/custody cases. |
| G5-P5 | Close selected section and cross-section evidence with workload/usability/director review. | P2–P4; every selected leaf verified or explicit open acceptance gate. |

This order is provisional until the finalized lane outputs identify the selected
leaves and their exact dependencies. P3 and disjoint content authoring can proceed
alongside P2 after compatible contracts are fixed. Each runtime wave ends with a
playable checkpoint before another slice starts.

A future integrator owns shared `main.js`, simulation/contracts/effects,
expansion state, native loading/persistence, registry composition and build.
Narrow builders own selected authored definition/host modules by exact file
reservation. Current absorption writers retain their areas. No file is reserved
for runtime by this report, and no parallel save/reward owner is proposed.

## Compatibility and private content

M1: New start/instance fields are proposed optional additive state. Loaded lives
and completed origins retain their original beginning. M2: Existing frozen jobs
and receipts keep their meaning; unsupported new schemas preserve the original
envelope. M3: Missing content needed by a new starting snapshot requires a chosen
suspend/recovery/explicit alternate-arrival policy. M4: Stronger rollback or
parallel-instance admission declares all included and retained native owner
domains and content revisions before migration.

`content_packs` schema1 has scalar local values and one active local activity;
namespace collision checks and registration exist. Its current local model is not
a general whole-world function schema. Richer private direct-source packs should
bind public generic execution/knowledge/state infrastructure, while their source
specific definitions remain outside public git/bundle. This pass did not open
private packs, sealed truths, novels, personal saves or acquired external sources.

## Verification and remaining coverage

JSON parsing, unique requirement IDs, all input/source path existence and internal
G5 dependency pointers passed. The final file whitespace check passed. No gameplay
source, tests, build, browser, private saves or prior intake file was changed.

`REQUIREMENTS.json` records exact sampled coverage and SHA-256 hashes for inspected
inputs. The source tree is dirty and concurrent absorption edits native main/save/
build and related modules. These hashes are an end-of-inspection moving snapshot,
not immutable integrated delivery. Runtime selection must compare hashes and
re-read affected exports before accepting these interface statements.

Open coverage: finalized lane joins, all 396 public research artifacts' content
extraction, exact selected native craft/market/combat/lifecycle consumers, whole
source fidelity and all runtime/browser/save/director evidence. The parent owns
shared reconciliation. This output does not promote inventory or source inspection
to C2 gameplay or C4 world completion.

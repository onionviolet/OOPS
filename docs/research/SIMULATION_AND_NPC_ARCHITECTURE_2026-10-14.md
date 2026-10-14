# Simulation and NPC architecture, 2026-10-14

## CHECKPOINT

ER8 survey and architecture proposal complete. Covers all requested references,
current actor/resident/simulation owners, stores, scheduler hooks, LOD, knowledge,
save shape and phased trials. Evidence is READ or STATED; fit, complexity estimates
and recommendations are INFERRED. No runtime benchmark, source edit, build, browser
journey, migration, install, commit or push. Resume for a named evidence gap or a
selected trial, not an assumed engine rewrite. Sources checked 2026-10-14.

## Judgment and authority

**ER8-F1 / AI1–AI6, RT2, RT6, RT7:** extend the existing simulation with a
hybrid: schedules supply routine intent, utility chooses among legal options,
reserved jobs execute them, social situations coordinate participants, and a
separate director selects eligible storylets. Keep generated history separate
from live simulation. This is an INFERRED recommendation, not a selected design.

This extends the [root palette](../ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md#i-simulation-and-npc-architecture-ai).
The [E1–E10 review](../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md) retains save,
ownership and acceptance contracts; the [offline audit](OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md)
retains clock policy. [ER1](RUNTIME_HOTSPOT_AUDIT_2026-10-14.md) covers measured
workload and hotspots, [ER2](PROFILE_AND_BRANCH_SAVE_SHAPE_2026-10-14.md) covers
branch/profile ownership, and [ER3](TECH_STACK_OPTIONS_2026-10-14.md) covers tools,
workers and storage choices. A new AI algorithm does not settle those questions.

READ `PROJECT.md:307-315`: one realm and one prestige layer sequence delivery;
vanilla opening and opt-in expansion remain. READ `PROJECT.md:31-56`: comfortable
unfed play, no hunger death, condition-based idle progression, desktop/laptop
priority and deferred mobile work. READ `docs/LIFE_SIM_NORTH_STAR.md:1-21,122-140,194-221,1108-1130,2317-2333`:
the north star is largely a proposal, with causal lives, a paced director, coarse
people and mixed discovery as relevant considerations. Its early absence claims
are dated history, not a current source inventory. READ
`docs/CHARACTERS_AND_WORLD_EVENTS.md:156-180`: one person across roles, actual means,
directed information/ties and preserved identity on promotion/demotion. None of
these references selects a universal need list, opinion formula or whole-world
autonomy. This lane writes only its research document and report. No `SECRETS*`
files, private packs or personal saves were opened.

## Current code: the incumbent

READ means inspected source, not proof of rebuilt behavior. Line ranges below are
from the live checkout on 2026-10-14; concurrent lanes can move them.

| Code | READ evidence | Architectural consequence, INFERRED |
| --- | --- | --- |
| ER8-F2 | `src/expansion_engine.js:73-79`; `src/simulation.js:35-40,48-73`; `src/simulation_contracts.js:217-250`. Expansion owns clock/sequence/RNG and actor domains; simulation adds persistent people, stock owners, equipment, custody, knowledge, relationships, claims, sites, jobs and controllers. Native inventory is explicitly a different owner. | Extend these keyed stores. A second pawn database with copied inventory or facts would create competing truth. Enrollment is not player discovery. |
| ER8-F3 | `src/simulation.js:175-216`; `src/simulation_contracts.js:256-262,295`. Commands spend/reserve inputs, resolve and save an outcome, freeze effects/context and retain due time, revision, participants and cancellation. Participant overlap and site reservation are validated. | Choice policy should propose a command, not mint output. Multi-step work should retain these legal gates and once-only settlement rather than become an independent task executor. |
| ER8-F4 | `src/simulation.js:456-461,474-551`; `src/expansion_engine.js:598-640`. Next-boundary selection scans several stores. Jobs settle by due/sequence, followed by conditions/life endings, offer expiry, event checks, pursuits/situations, controllers and routines. Controllers choose the first eligible action in priority order. The outer loop stops at choices and returns a remainder after 512 boundaries. | The current policy is a useful small priority selector. Utility can be an optional selection mode at the controller seam. Preserve phase/tie order when changing scheduling; the causal cap is not a wall-time budget. |
| ER8-F5 | `src/audit_remainder_home_content.js:79-85,155-193`; `src/audit_remainder_home_host.js:57-62`. One opt-in resident has a body, finite attention, own stock/purse, supplied invitation, occupancy claim, registered service and independent controller. Departure waits for work to end and retains identity/property. | A bounded resident is a better first architecture trial than generating a city. Do not replace its paid terms, rights or finite choices with a needs score. Its one-minute controller cadence is a content choice, not a universal NPC tick. |
| ER8-F6 | `src/npc_lives.js:5-42`; `src/main.js:419-420,5189,5307,8355-8358`. The optional household stores a predetermined seeded family timeline and filters reached public events by saved native year. This is separate from simulation people. | It is a coarse-life precedent, not emergent marriage/population AI. Keep its existing IDs and save domain; add an explicit bridge only if a household person becomes an interactive simulation actor. Name similarity is not identity. |
| ER8-F7 | `src/simulation_effects.js:103-113,281-293`; `src/causal_situations.js:16-31,52-56`; `src/people_knowledge.js:6-15,28-55`. Knowledge is per actor, has stage/value/time/cause and optional attributed situation basis; situations retain private truth separately. Relationship effects deduplicate causes and retain 32 recent memories. Public people views exclude private axes, jobs and possessions. | Reuse provenance and projection boundaries. Current stages measure understanding, not truth probability. The single value per key cannot express simultaneous conflicting claims. Fixed memory trimming does not prove safe compaction of future history-dependent play. |
| ER8-F8 | `src/simulation.js:623-636`; `src/simulation_effects.js:108-113,152-158`. An external proposal may choose a registered command at an expected sequence but cannot prescribe effects/costs/code. Choice inspection uses command previews; internal facts include world/custody and some target information. | Keep a planner-facing observation projection separate from internal legality facts. An internal preview is not an omniscience-safe NPC belief API. Expected-sequence checks and legal commit remain after planning. |
| ER8-F9 | `src/expansion_persistence.js:8-20,30-50`; `src/models/npc.js:8-49`. The publisher stages expansion and native envelope changes before synchronous storage write. Native NPC is a Person with dialogue/trader/availability components and default zero XP multipliers. | Keep publication as the final authority. A new agent store does not automatically make native traders learn, travel or fight as companions. Adapt stable IDs and native bindings before extending those roles. |

## Survey: data, cost and fit

STATED entries below describe the cited author's paper, talk abstract, development
report or code. They are historical mechanisms, not claims about every current
release. No cited title was benchmarked here. All asymptotic costs and suggested
scaling rules are INFERRED unless explicitly marked STATED. A source's timing is
not MEASURED by ER8. Symbols: A = due actors, C = candidate actions, K = score
inputs, R = rules, P = scene participants, H = retained events. Expensive queries,
cloning, validation, serialization and rendering can dominate these estimates.

| Code / palette | Core data model and source, STATED | Tick cost and scaling | Repo fit and plug-in, INFERRED |
| --- | --- | --- | --- |
| ER8-S1 / AI1 | **The Sims needs/advertisements.** Motives describe current need; objects offer interactions and advertised satisfaction. Don Hopkins's firsthand [2006 implementation account](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/will-wright/sources/2006-11-06-thesims-ai-test/don-reply-to-mats-knutsen.md) describes object behavior contexts, scoring candidates and choosing among a small top set. It is an archived excerpt, not a benchmark or current Sims source. | A naive decision evaluates O(CK) per actor plus lookup/travel. Filter reachable, usable objects before scoring; update analytic need decay at a decision/threshold boundary. Candidate locality is the useful scaling idea; do not add a thread or timer per object. | Advertise registered command benefits from sites/items, while costs and eligibility stay in `previewSimulationCommand` (`src/simulation.js:86-147`). Store only exercised NPC needs. Meals can offer comfort/benefits; this does not reinstate player starvation or daily maintenance chores. |
| ER8-S2 / AI1, AI2 | **Utility AI, Dave Mark and Kevin Dill.** [GDC 2010 talk overview](https://www.gdcvault.com/play/1012410/Improving-AI-Decision-Modeling-Through) describes response curves, distributions and weighted selection instead of hard binary transitions. Model an option with considerations and a score; infeasible actions remain excluded. Only the public overview was read, not the video. | O(ACK) over due decisions if input queries are bounded. Cache shared inputs for one state revision, cap candidates and wake on changed dependencies. Hysteresis/commitment prevents repeated switching; that is a proposed safeguard, not a measured property of this talk. | Optional controller policy at `src/simulation.js:522-543`, leaving fixed-priority content intact. Add authored preference/goal weights to definitions and selected intent to saved controller state. Utility decides what to try; it cannot override ownership, body, support or consent checks. |
| ER8-S3 / AI2, new AI8 | **GOAP, F.E.A.R.** Jeff Orkin's [GDC 2006 paper](https://www.gamedevs.org/uploads/three-states-plan-ai-of-fear.pdf) separates goals from actions with preconditions/effects/costs, searches with A*, and uses a small execution state machine. Sensors maintain local valid cover candidates for squad coordination. | Search grows with branching and plan depth; O(b^d) is a rough worst-case search-tree bound, not F.E.A.R.'s tick time. Bound depth/expansions, reuse a still-valid plan, refresh candidate facts on invalidation. Sensor maintenance is part of the cost, not free planning. | Trial only for a named NPC with several genuinely interchangeable routes. Planner returns registered command IDs through `acceptActorProposal` (`src/simulation.js:631-636`); use a declarative planning abstraction of commands, never execute preview effects. Existing frozen random jobs mean uncertain actions need explicit replan policy after real outcomes. |
| ER8-S4 / AI2, AI8 | **Behavior trees.** Selector/sequence/control nodes combine conditions with action leaves returning success/failure/running. [Halo-style GDC session](https://www.gdcvault.com/play/1014116/) establishes the reference; semantics and nonblocking action handling are supported by the open [BehaviorTree.CPP docs](https://behaviortree.dev/docs/learn-the-basics/BT_basics/) and [asynchronous guide](https://behaviortree.dev/docs/guides/asynchronous_nodes/). This is a design reference, not a C++ dependency recommendation. | O(nodes visited) per wake; a reactive tree can revisit many branches. Keep running action state, wake at completion or an interrupt and implement halt/cleanup. Memoryful and reactive sequences differ; do not treat all trees as equivalent or run blocking leaves on the browser thread. | Useful for an authored procedure such as prepare, work, hand over. Leaves submit jobs; saved job IDs own completion, and halting calls supported cancellation (`src/simulation.js:302-322`). Existing finite programs (`:545-551`) are cheaper when there is no branching procedure to express. |
| ER8-S5 / AI2, AI3 | **RimWorld storyteller and jobs.** Tynan Sylvester's [GDC 2017 slides](https://media.gdcvault.com/gdc2017/Presentations/Sylvester_Tynan_RimWorld_Contrarian_Ridiculous.pdf) frame a story generator with loss/recovery and long relevance. The developer [RimWorld page](https://ludeon.com/blog/) identifies its AI storyteller. A mod author's [Alpha 12d executable job tutorial](https://ludeon.com/forums/index.php?topic=16405.0) exposes ThinkTree → Job → JobDriver → Toil, reservations and failure conditions. The latter is primary evidence for that author's example, not a current official engine specification. | Routine execution can be cheap; searching jobs/targets and checking failures costs more. Reserve shared targets before work; avoid repeated global job search for busy pawns. Director work belongs on its own cadence, not per pawn. No current RimWorld job frequency or milliseconds were verified. | Keep jobs/sites/participants (`src/simulation_contracts.js:256-262,295`); add optional staged procedures only where needed. A director sits above existing event checks (`src/simulation.js:501-514`), choosing eligible content using pacing/cooldowns. Do not copy wealth-scaled enemy escalation into a game where actual actor builds must remain causal. |
| ER8-S6 / AI4, AI5 | **Dwarf Fortress history and off-screen sim.** Tarn Adams's [2019 firsthand Q&A](https://www.gamedeveloper.com/design/q-a-dissecting-the-development-of-i-dwarf-fortress-i-with-creator-tarn-adams) describes history as a record of a large autonomous strategy simulation. [Bay 12's 2019 log](https://www.bay12games.com/dwarves/dev_2019.html) describes abstract world-generation investigation with witnesses, evidence and leads; the [2013 log](https://www.bay12games.com/dwarves/dev_2013.html) discusses abstract site conflicts and transition to local scenes. | Coarse entities/sites and sparse events avoid simulating every local movement. Broad wars, family links and event histories still grow work/storage. A regional pass costs roughly the eligible entities/interactions it examines, with no portable DF tick bound established here. | Borrow retained cause/entity IDs and explicit promotion from abstract to detailed state. Use situation context (`src/causal_situations.js:24-31`), instance clock adapters and bounded life events, not a global zero-player campaign. Off-screen is a detail level, not permission to advance frozen worlds. |
| ER8-S7 / AI4 | **CK3 character/opinion model.** Official [Bastion developer diary](https://store.steampowered.com/news/posts/?appids=1158310&enddate=1664452457&feed=steam_community_announcements) ties personalities, relationship reasons and retained memories to content. Official [Tours and Tournaments release notes](https://store.steampowered.com/news/posts/?appids=1158310&enddate=1687345457&feed=steam_community_announcements) describe personality-based vassal stances and temporary opinion changes. Character traits, ties and contextual opinion effects are separate inputs. | Dense all-pairs social state would grow O(N²); sparse directed ties scale with stored edges. Evaluate modifier sums on queries or expiry/change boundaries, not every minute for every pair. This is our proposed scaling approach; proprietary CK3 internals and exact opinion update cadence were not inspected. | Extend directed `relationships[actor][target]`, attaching cause-qualified temporary modifiers only for scenes that use them (`src/simulation_effects.js:285-293`). Do not replace trust/respect/debt with a universal favor number. Relationship reasons can inform known scene offers through `knownPeopleView`; private opinion remains private. |
| ER8-S8 / AI4, AI6 | **Prom Week / Comme il Faut.** [McCoy et al., AIIDE 2011](https://ojs.aaai.org/index.php/AIIDE/article/download/12454/12313/15982) models traits, statuses, relationships/social networks, cultural knowledge, social-fact history, influence rules and exchanges. Initiator intent, responder acceptance, effect selection and social fallout are distinct stages. Its open successor [Ensemble](https://github.com/ensemble-engine/ensemble) has schema, volition, triggers, actions and history. | Role binding can dominate: O(RP^v) for rules with v unbound roles is a rough bound. Ensemble code recursively binds cast roles and caches pairwise volition. Restrict cast to actual contacts/scene participants and invalidate affected rules. A cache without revision/dependency semantics is unsafe here. | Small scene-specific influence rules feeding registered social commands and `situations`, with actual refusal and once-only consequences. No global all-pairs social sweep. The paper's shared social state is not automatically a witness-limited belief model; apply repo information rules separately. See ER8-C1 for pinned code inspection. |
| ER8-S9 / AI4, AI6 | **Versu.** [Evans and Short, 2014](https://cs.uky.edu/~sgware/reading/papers/evans2014versu.pdf) uses autonomous agents plus social practices as joint reactive plans that offer actions without taking away actor choice. [Short/Evans's conversation account](https://emshort.blog/2013/02/26/versu-conversation-implementation/) describes roles, selected speaker/topic/speech act and meaningful norm violations. | Cost depends on active practices, participants and rule evaluation, not just NPC count. Bind only relevant practices and wake on a speech act/phase change. A long-lived practice gives continuity without scoring every possible conversation. Exact runtime budget not published in the inspected material. | Use `situations` for shared phase/roles and controllers for individual acceptance/refusal. Reuse receipts/context rather than introduce a second scene state machine. Practice norms are content preferences, not hard restrictions on player expression. Rich conversation authoring is a later trial after one useful social consequence. |
| ER8-S10 / AI3 | **Fallen London storylets.** Failbetter's [StoryNexus diary](https://www.failbettergames.com/news/storynexus-developer-diary-2-fewer-spreadsheets-less-swearing) describes small interactive stories gated by qualities and changing those qualities. [Quality parsimony](https://www.failbettergames.com/news/narrative-snippets-parsimony-2) argues for fewer reusable qualities. Data: eligibility, choices, state effects and repeat/progress control. | A naive query costs all storylet predicates; index by changed quality/location/actor and reevaluate candidates. Selection happens at a content boundary, not a frame. Predicate dependency indexing is a proposed optimization, not verified StoryNexus internals. | Reuse event definitions, `requires`, visibility, response gates and occurrence/cooldown state (`src/simulation.js:501-514,422-454`). Director pacing is separate from storylet eligibility. Story availability should not silently reveal a private predicate or pay an effect during rendering. |
| ER8-S11 / AI2 | **Stardew schedules.** The game's hosted [schedule-data guide](https://wiki.stardewvalley.net/Modding:Schedule_data) documents per-character files keyed by weather/date/season and timed location, facing, animation and dialogue waypoints, including fallback/home behavior. This is hosted community format documentation, not a verified current CPU profile or a claim to original source access. | Choose a daily variant, then process waypoint boundaries. Candidate cost is schedule selection plus route queries; continuous movement adds its own cost. A text location graph can retain departure/arrival without tile-by-tile walking. No Stardew off-screen algorithm is claimed from this page. | A schedule definition can enqueue controller wakeups or registered move/rest/work commands, mapped through the world's calendar adapter. Person location stays in `simulation.people` (`src/simulation.js:53-58`). Schedules need interrupts, missing-location fallback and overdue handling; they cannot teleport a busy resident or fulfill unpaid work. |
| ER8-S12 / AI2, AI5, AI6 | **Shadows of Doubt off-screen citizens.** Cole Jefferies's [2018 city-simulation devblog](https://colepowered.com/shadows-of-doubt-devblog-8-simulating-a-city/) describes jobs/preferences, planned daily journeys, live deviations and sighting memories that become less precise. It states daily planning took roughly 10–15 seconds in that historical build. His [2022 development retrospective](https://colepowered.itch.io/shadows/devlog/354045/shadows-of-doubt-devblog-30-the-top-shadows-of-doubt-development-challenges-part-i) explains object relocation authority and broad evidence preservation. | STATED timing above is not ER8 measurement or a current-release target. Daily batch planning trades frame work for a burst; sighting checks can dominate if all pairs are checked. Bucket by location/time, compute only actual witness contacts and yield batch work. | Preserve a named NPC's committed itinerary and actual witness receipts even when unseen. Use location/contact indices, `knowledge` attribution and `owners/custody`; store causal observations, not full daily movement prose. Preserve case-relevant property. Do not assume a hidden person is frozen merely because their model is not rendered. |
| ER8-S13 / AI5, new AI9 | **Caves of Qud history generation.** Jason Grinblat's [GDC 2018 overview](https://www.gdcvault.com/play/1024990/Procedurally-Generating-History-in-Caves) describes generating historical events, rationalizing them afterward and using replacement grammars rather than a full historical simulator. The public overview supports this distinction; full generator source/video was not inspected. | Generation is bounded work at world/content creation, roughly events plus grammar expansion under chosen caps. Retain consequential facts and seeds/revisions; no per-minute historical replay is needed. Those cost bounds are proposals, not Qud benchmarks. | Generate a small past tied to existing actor/place/item IDs, then disclose it through books, gossip and sites. It supplies initial causes/lore; live jobs and transfers still execute through the scheduler. Never regenerate an established truth when a player meets a person again or revise past events to force drama. |

**ER8-C1 / AI4, PF6, LB1:** READ external open code at Ensemble revision
`8b74bdec4ba2ef4e14795b7591df3b5d73f283e3`:
[RuleLibrary.js:27-116](https://github.com/ensemble-engine/ensemble/blob/8b74bdec4ba2ef4e14795b7591df3b5d73f283e3/ensemble/RuleLibrary.js#L27)
iterates rules and recursively binds character roles;
[Volition.js:154-183](https://github.com/ensemble-engine/ensemble/blob/8b74bdec4ba2ef4e14795b7591df3b5d73f283e3/ensemble/Volition.js#L154)
sorts pair scores and retains a cache;
[socialRecord.js:173-216](https://github.com/ensemble-engine/ensemble/blob/8b74bdec4ba2ef4e14795b7591df3b5d73f283e3/ensemble/socialRecord.js#L173)
copies eligible records across time steps and expires durations. These are useful
mechanisms and concrete warnings about role/time-step scaling. No code was copied,
installed or timed. The project README states BSD-4-clause licensing; any selected
code reuse would first read the exact license and keep its notices. Pattern
adaptation through existing stores is the present proposal.

## Proposed engine shape

All ER8-P rows are INFERRED considerations. Names and fields below are illustrative,
not new save contracts or an implementation work order. Existing content and native
acceptance gates remain with their owners.

### Stores and boundaries

| Code / palette | Proposed owner and data | Boundary and first useful consumer |
| --- | --- | --- |
| ER8-P1 / AI1, AI2, E8 | Retain `actors[id]` for resources/facts/powers and `simulation.people[id]` for life, body, inventory binding and location. Add a small optional `agents[id]` policy record: controller definition/revision, clock binding, need samples/cursors, goal commitments, schedule cursor, selected intent and decision RNG. | No duplicate native purse, stock, technique or body. References must resolve to the same actor. Start with one existing opt-in resident and one already registered choice. Body-specific need definitions come from the selected world, not a universal human template. |
| ER8-P2 / AI2, RT6, PF6 | Keep `jobs`, `sites.reservations`, `claims`, participant bindings and frozen outcome records authoritative. Add derived indices for actor → current job, location → actor IDs and definition → legal candidate IDs. A due-work index can be rebuilt from saved deadlines. | Policy asks for candidates, then previews/commits one. Never score all registry commands for every actor via `inspectActorChoices` on every minute. A task stage is a saved registered command/job reference with interruption policy, not an arbitrary callback. |
| ER8-P3 / AI4, AI6, E4 | Retain sparse directed relationships and shared situations. Add cause-qualified opinion modifiers or durable obligation/event references only where content uses them. Keep exact unpaid debts, unresolved claims and witnessed outcomes apart from disposable recent prose. | An expired mood modifier can disappear; an unresolved debt cannot disappear because a recent-memory buffer filled. A social exchange gets its actual initiator/recipient/witness set and one causal receipt. No automatic global faction reputation update. |
| ER8-P4 / AI3, AI7, RT6 | A small director record per eligible world/life: policy revision, recent categories, next check, cooldowns, event receipt references and independent RNG. Economy/faction processes, if selected, are separate slow owners that propose legal transfers/events. | Choose from eligible storylets without silently changing their truth, stock or NPC strength. Distinguish actor-driven events, canon barriers and pacing suggestions. AI7 is a later extension; no generic faction economy implementation is recommended for the first trial. |
| ER8-P5 / AI5, AI9, DA3 | Sparse history records with stable event/entity IDs, occurred time/context, causes and effects; separate observation references and generated initial past. Archive exact facts used by gameplay and compact only presentation under a declared retention rule. | A biography is a projection of events known to its reader. A generated past is committed once under its content revision; coarse live settlements append actual outcomes. Do not save every mundane greeting or turn latent population into detailed sheets without a use. |

### Scheduler hooks

**ER8-P6 / RT6, RT8, AI2:** extend `nextSimulationBoundary` and
`advanceSimulationBoundary`, not browser `setInterval` per NPC. Proposed wake causes
include schedule edges, completed jobs, new observations, changed resources/body,
offer expiry and need thresholds. Sampling a need can use saved value plus elapsed
eligible local time; process a threshold before an action whose availability depends
on it. Clamp and retain fractions under the selected definition. Do not decay against
wall time, an absent frozen instance or a different branch's clock.

Keep existing settlement/expiry/decision phases from ER8-F4. A proposed indexed
queue orders by clock binding, due time, existing phase, existing sequence/ID tie
rule and generation/version. Equal-time actors compete through the same reservation
gate. A stale index entry is ignored only after matching authoritative state; queue
loss must not lose a job. Local deadlines require an explicit mapping to common
eligible time, not numerical comparison of unrelated clocks. Use an adapter for each
instance clock and its visit/lease policy.

Initially keep current scans as a reference path. Instrument due actors, examined
candidates, predicate reads, queue maintenance and total transaction cost. A heap
may reduce selecting work to O(log Q) per enqueue/pop, but does not remove broad
validation/copy/save work or relationship queries. Only replace scans when a named
synthetic workload proves value and tie-order equality.

**ER8-P7 / AI8:** policy order could be authored hard interrupts, retained legal
commitment, schedule preference, then utility among eligible choices. A failed
preview wakes later on a relevant dependency change or bounded retry deadline.
Hysteresis keeps a chosen plan until meaningful change; emergency interrupts still
use declared cancellation/refund/forfeit rules. Seeded variety is optional and
committed once, never consumed by render/preview. BT/GOAP remain alternative policy
modules for a selected actor, not competing authoritative schedulers.

### LOD: detail and time are two separate axes

**ER8-P8 / AI5, RT7:** choose detail from causal relevance, not viewport visibility
alone. A distant lender, witness or reserved worker can be important. Proposed tiers:

| Code | Detail tier | Advancement and promotion consideration |
| --- | --- | --- |
| ER8-L1 | Engaged: current encounter, participant or observed scene | Exact registered work and relevant body/knowledge/relationship effects. Wake at causal boundaries; no requirement for frame simulation. |
| ER8-L2 | Named and relevant: known peer, contract party or reachable witness | Persist exact identity, property, commitments and selected itinerary. Resolve supported boundary work without rendering every action. Promote before an interaction changes outcomes. |
| ER8-L3 | Background population/site cohort | Aggregate only equivalent unobserved activity. Persist named links and consequential births/deaths/transfers when generated. Split off a named actor with conservation of cohort counts and allocated property; never also leave their assets in the cohort. |
| ER8-L4 | Dormant world/branch | Preserve current freeze policy unless a later selected adapter says otherwise. No extra life output, research or random draws just because time passed outside this owner. The clock audit owns exceptions such as observation leases. |

Demotion leaves reservations, injuries, debts, resolved RNG outcomes and exact
witness evidence intact. Unsupported interactions promote to detail or stop for
explicit review rather than approximate a unique consequence. Analytic need decay
or repeated identical production can be batched only until the next eligibility,
resource, contact, canon or choice boundary. Promotion samples only uncommitted
detail, using retained generation identity; it cannot reroll known facts or recreate
spent stock. A city-sized off-screen simulation is deferred.

### Knowledge: do not confuse understanding with truth

**ER8-P9 / AI6, E9:** keep world/situation truth separate from observation,
interpretation and report. The existing `{stage,value,at,cause,basis}` record supports
simple known facts but overwrites each key and orders understanding stages. A
possible additive claim record would retain `claimId`, observer, subject/predicate,
claimed value, world/instance/continuity, event reference, observed/received time,
basis/source and supersession/dispute links. Reliability is an authored estimate,
not a proof that the claim is true. Unknown must stay distinct from false.

Retain the current compact knowledge keys for old content; an optional claims domain
can project a selected understood fact without erasing contradictory reports. The
same physical event may have several observers and interpretations. Rumor delivery
needs a real contact/channel, source chain, elapsed boundary and receipt so it cannot
spread to every actor or pay twice. Store important contradictions; cap disposable
rumor chatter by policy without dropping evidence used by a dispute.

Planner input contains the actor's current observations, beliefs, own means, known
contacts and known offers. Internal legal validation may inspect truth, but that is
not information the planner may use to choose an action. Failed legality should
produce only a supported observation; it must not become a secret oracle through
reasons, candidate counts, utility traces or exact hidden-stat errors. Player views
continue through `knownPeopleView` and other explicit discovery projections.
Debug fixtures use synthetic IDs and no sealed truths. Raw local saves are not
cryptographic secrecy; player-facing reports still respect discovery routes.

### Save shape and migration considerations

**ER8-P10 / DA2, DA3, E1–E9:** proposed additions live inside the existing expansion
simulation domain rather than a parallel localStorage key. An illustrative agent
record could be:

```text
agents[actorId] = {
  policy: {definitionId, revision},
  clockBinding: {worldId, instanceId, continuityId, unit},
  needs: {needId: {value, sampledAtLocal, fractionalRemainder}},
  schedule: {definitionId, revision, variantId, cursor, nextDueLocal},
  intent: {goalId, commandId, jobId, selectedAt, receiptId},
  decision: {nextDueLocal, rng, lastCause}
}
```

This is a shape sketch. Persist consequential selections, cursors, fractional
progress, RNG and content identity; derive utility scores, candidate lists, contact
indices and queue layout. Jobs already save due time, outcome, participant/cost
context and revision. Do not save a second version inside `intent`; keep references
and validate them together. Director, claims and history additions need their own
version/retention rules if selected. Branch ownership follows ER2; worldId alone is
not a branch identity. Generated actors require a compatible generated-definition
registry before the existing validator can accept them.

Old saves default to no new agents/directors, preserving existing controller
behavior. Upgrade only selected content: no invented past need decay, regenerated
possessions, retroactive opinion expiry or newly simulated household history.
Validate definitions and bindings before rebuilding indices; preserve unsupported
data and block affected writes rather than drop a person/job. Keep household
`npc_lives` separate unless an explicit identity bridge is adopted.

Agent choices, reservations, costs, knowledge, relationship causes, RNG, director
receipt and eligible clock advancement publish in the same staged envelope through
`persistExpansionPlan`. A failed write must not expose a successful live choice.
Saving every decision independently may be costly; batching changes recovery
semantics and belongs to the existing persistence owner, not an AI shortcut.

## Ranked first steps, all proposals

Rank is expected value per effort, INFERRED. Each cost is stated once. These phases
are optional trials with proposed gates, not new mandatory scope for the current
Foundation work or a replacement milestone.

| Rank / code / disposition | Smallest phase and visible result | Cost | Proposed evidence gate and palette |
| --- | --- | --- | --- |
| 1 / ER8-A1 / Adapt incumbent | Trace one opt-in resident's legal candidate, chosen intent, reserved work and observed later consequence. Keep current priority policy as baseline; expose only a known reason such as waiting for supplied materials. | Low to moderate local instrumentation/projection work. | Synthetic replay produces the same job, stock, purse and receipts as the incumbent; traces disclose no private reasons. If implemented as UI, rebuilt 1366×768 desktop proof shows the useful later consequence, then Save/reload/literal-file Import. AI2, AI6, RT4, PF1. |
| 2 / ER8-A2 / Trial schedule + utility | One authored recurring peer gets a short schedule and two supported choices with one preference or comfort need. Add relevant-change wakeups and commitment hysteresis while keeping existing paid jobs. | Moderate policy, clock and authoring work. | Compare split/jump/yielded advance, ties at a shared site, blocked inputs, refusal/interrupt and render-no-RNG. Same elapsed supported time gives equal consequential state; resting world earns no progress. AI1, AI2, RT6, RT7. |
| 3 / ER8-A3 / Trial sparse social claims | One witnessed agreement and one attributed contradictory report change a later known offer or response. Use a small participant set and preserve actual obligations. | Moderate provenance, migration and content work. | Uninformed third party stays uninformed; source/receipt survives reload/import; repeated report does not duplicate favor or delivery; old understood keys still work. AI4, AI6, DA3, E9. |
| 4 / ER8-A4 / Trial director | A few eligible local storylets use independent pacing/cooldowns and saved selection. Include ordinary helpful/quiet events, not only crises. | Moderate content and balancing work. | Repeated preview/reload cannot reroll; an ineligible event cannot fire; actual canon/choice boundary stops progression; a director cannot invent an NPC resource/build to force a beat. AI3, AI7, AI9, RT8. |
| 5 / ER8-A5 / Park broad sim; measure a bounded LOD trial | Use synthetic busy/idle casts to compare current scans and derived due indices, then one named actor's coarse/exact advancement where equivalence is demonstrable. GOAP/BT trial only if A2 cannot express a selected procedure clearly. | High cross-owner invariants and profiling work. | Record decision and full transaction timings/bytes separately. Promotion/demotion conserves inventory/claims and exact history; no skipped witness/contact barrier. Retain reference scheduler equality and failed-publication proof. AI5, AI8, RT6, RT7, PF6, DA3. |

New palette considerations: **AI8** is choice-policy/executor separation, including
optional BT/GOAP and actor-limited planning inputs. **AI9** is generated historical
truth versus live simulation and disclosed lore. Neither implies a new dependency
or engine migration. Keep ESM/browser delivery while these trials remain small;
ER3 owns any later worker/storage/tool decision.

**ER8-S5a / AI3:** In a [published developer interview](https://www.pcgamer.com/games/strategy/the-challenges-of-developing-the-colony-sim-from-dungeon-keeper-to-dwarf-fortress-and-beyond/),
Tynan Sylvester describes story watchers collecting colony state and incident
generators responding to it, with a rising/falling pacing curve. This is a primary
developer account within a reported interview, not inspected engine code. Its
useful data split is observed state, incident definitions and pacing state.
Selecting incidents and executing a pawn's job are different systems. No exact
director tick frequency or current scaling formula was established here.

## Evidence limits and open questions

| Code | Open item | What would resolve it |
| --- | --- | --- |
| ER8-Q1 | How many causally relevant actors and candidate rules should one realm actually need? No population or millisecond budget is accepted here. | Choose one playable scene first, then synthetic scale fixtures and a current full-transaction profile. Existing historical performance figures are not new measurements. |
| ER8-Q2 | Which local clock/absence policy should a selected recurring peer use? LOD cannot answer that. | Its world owner chooses eligible time using the existing clock adapter. Preserve freeze defaults until then. |
| ER8-Q3 | What social evidence must survive indefinitely for obligations, inheritance or history-aware powers? | A selected scene names exact retained causes and shows semantic equality across compaction. No blanket claim that 32 memories is enough. |
| ER8-Q4 | External implementation detail is uneven. GDC pages supplied public abstracts, not watched talks; the historical Stardew format is hosted community documentation. Current proprietary CK3/RimWorld/SoD internals and exact tick costs remain unverified. | A named implementation uncertainty can use supplied source or a selected synthetic trial. No invented FPS/cadence claims are needed to compare the mechanisms now. |

The original Sims PDF was inaccessible through the web fetch, so the survey used
Hopkins's published firsthand account. The oversized F.E.A.R. course mirror was
replaced by a readable copy of Orkin's paper. The Paradox forum failed, so official
Steam developer posts supplied the CK3 route. Incorrect case in raw Ensemble paths
returned 404; GitHub API inventory supplied exact paths and a pinned revision. No
login retry, password prompt or native computer control was used.

Checks for this lane are documentation/source/link-structure checks only, recorded
in [ER8 report](../gm/dispatch/engine-runtime-2026-10-14/ER8/REPORT.md). No gameplay,
performance improvement, save compatibility or human acceptance is claimed.

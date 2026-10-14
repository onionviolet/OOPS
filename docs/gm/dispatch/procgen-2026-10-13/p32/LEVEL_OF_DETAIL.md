# AM1-AM2: detail follows relevance, history stays fixed

2026-10-14. **PROPOSAL ONLY.** Extends [root AM1-AM2](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#am-simulation-level-of-detail). [P18 hygiene](../p18/HYGIENE.md) owns revision/retention/query parity; [P19 contract](../p19/CONTRACT.md) owns people and directed social state; [P20 settlements](../p20/SETTLEMENTS.md) owns place evolution. P32 proposes scheduling/detail adapters, not another population, history, inventory or clock store. Field names and budgets below are not existing exports or reserved schemas.

## AM1.1: source baseline, read-only

SHOWN/SOURCE means inspected code, not executed behavior. STATED means a worker report; INFERRED means this proposal. Locators describe this read and can drift with concurrent work. Main HEAD was `cc5fa556`; P2 HEAD `f8fe6994`; P4 HEAD `09403f5c`. Main lacked `src/mixture_state.js` and `src/generated_people.js` at inspection. Dirty main files remain untouched. Worktree paths below are relative to `.claude/worktrees/proc-p2-mixing/` or `proc-p4-people/` as labelled.

| ID | Shown source / stated evidence | Cost or continuity implication, inferred |
|---|---|---|
| F1 | Main `src/simulation.js:40,48-73` clones plans, enrolls registry people/sites/checks/controllers; `:456-461` computes boundaries by scanning jobs/checks/controllers/events/conditions/lifespans | No inspected general LOD layer. More registered people add scans even when distant; physical proximity alone is not a scheduling index. |
| F2 | Main `src/simulation.js:474-515,522-554` settles due jobs, iterates conditions/people/events, sorts checks/controllers, previews candidates and starts routines | Work scales with stored owners, due controllers and candidate complexity. An event count alone misses cloning, validation and native publication. |
| F3 | Main `src/expansion_engine.js:588-640` clones state, finds common boundaries, validates final state, stops after 512 boundaries and returns `remaining`/`budgetExhausted` | A boundary cap is not an inner-loop or millisecond cap. One boundary can contain many due jobs/controllers. Never skip remainder to make a benchmark pass. |
| F4 | Main `src/main.js:1234-1255` drains exhausted chronicle plans in a synchronous loop; `:7226-7249,7688-7691` recursively schedules the main timeout and renders panels; `src/config.js:19-23` defaults to one tick/sec and sleeping acceleration 6 | No inspected cooperative browser yield inside chronicle draining. Default tick cadence is not a frame-latency guarantee or offline policy. |
| F5 | Main `src/main.js:2520-2556` has a separate action interval at `100/tickrate` ms; `:8347,8457` adds 250/500 ms panel polling; `:7630-7656` performs ordinary and backup saves | Do not add one timer per NPC/site. Account render/polling/autosave bursts separately from domain work. |
| F6 | Main `src/npc_lives.js:5-22,24-37,39-42` creates a bounded authored family and reveals scheduled annual events; max 32 people/64 events/16 news | Cheap annual projection, not autonomous P19 lives. The precomputed future must not be exposed as public history or generic birth/death law. |
| F7 | P4 `src/generated_people.js:12-40` fixes exactly three generated people with names/traits/needs/purses/supplies; `:43-60` calculates the final hourly action in O(people); `:68-79` checks presence and settles a supply goal | Endpoint projection does not record all intermediate contacts/jobs. Traits/keepsakes are not backstories, registered tools or full actors. New detail needs a compatible extension. |
| F8 | P4 `src/generated_people_ui.js:4-5,15-28,34,51` restores/snapshots the optional store, writes before publication and polls a pure projected view once/sec | Preserve separate identity and stock authority. A read adapter is possible; blindly spawning a new simulation person would duplicate them. |
| F9 | P2 `src/mixture_state.js:15-45,47-74,84-98` retains profiles/products/methods/exposures and validates catalogue products by resolving them; `src/mixture_native.js:5-35,38-43` clones/stages and writes the player envelope | Product count affects validation/save work; an exposure can pin a consumed product. Product identity contains recipe JSON and is repeated in keys, not a compact fixed-length ID. |
| F10 | P2 `src/mixture_native.js:29-33`; `src/mixture_ui.js:37` settle one due batch on a 500 ms ready/visible poll, then date the next batch from supplied clock | This is not catch-up equivalence or offscreen NPC manufacture. Reuse the resolver through [CR4 NP1](../cr4/NPC_CRAFTERS.md), not its hero-only writer or UI timer. |
| F11 | Main `src/save_files.js:194-215` measures UTF-8 JSON and UTF-16 storage; uses 4 MiB shared-origin guard and preserves last save on quota failure. `src/main.js:5189-5197` includes household advancement in serialization | Save size is whole-envelope and origin-wide, including backup/other keys. Row counts and compressed exports cannot establish runtime storage fit. |

P2/P4 [branch reports](../../../../../.claude/worktrees/proc-p2-mixing/docs/gm/dispatch/procgen-2026-10-13/p2/REPORT.md) and [P4 report](../../../../../.claude/worktrees/proc-p4-people/docs/gm/dispatch/procgen-2026-10-13/p4/REPORT.md) state their technical results. P32 did not rerun or inherit those counts as acceptance. P4's native hourly transition remains open in its report.

## AM1.2: four tiers, independently selected per subsystem

Detail is computational relevance, not narrative worth. A far person can be hot because a promise is due; a nearby crowd member can stay summarized. Distance is one input beside visibility, dependency, active command, relationship, incoming message and supported world clock.

| Tier | People | Places | Stories | Work trigger |
|---|---|---|---|---|
| T0 anchored | Stable identity capsule for an introduced individual; explicit coverage for an unnamed cohort | Authored node/site identity, rights and retained transitions | Closed/potential thread refs, canon windows and reservations | Actual external cause or query requiring promotion; no decorative tick |
| T1 summarized | Exact current life/location, important directed bonds and obligations; aggregate routine under an authored sufficient transition law | P20's independently caused dimensions with coverage; actual facilities/custody remain owned | Open thread due dates and causes, compact routine episodes | Next meaningful boundary, optionally hourly/daily under local clock |
| T2 detailed | Supported personal goals, contacts, knowledge and funded plans | Staff/site queues and local transitions read by actual actions | Admitted hooks/choices/callbacks with exact bindings | Sparse due queue; evaluate only affected readers |
| T3 foreground | Exact supported actor/body/job interaction | Actual selected station/room/visit | Current response/encounter and outcome publication | Existing command/boundary APIs; immediate revalidation |

A person's combat can be T0 while their debt is T2. Every executable deadline remains exact at every tier. T0 is not deleting a named actor or freezing time that its world says runs. Conversely, a resting instance remains frozen if its clock owner says so. Local coarseness never selects wall-clock aging, destruction or production. An unimplemented transition is unresolved, not an invitation to invent a plausible result.

## AM1.3: promotion, demotion and fair scheduling

**Promotion triggers:** entering a supported interaction; a incoming causal dependency; an appointment/message reaching its boundary; deliberate follow/bookmark relevance; or a domain reader requiring unavailable detail. Following raises scheduling priority without revealing secret identity or guaranteeing new scenes. Canon reservations/era still filter all detail.

Proposed promotion transaction: qualify owner/instance/incarnation → synchronize only supported eligible time to the exact observation boundary → collect constraints/pins → expand required detail under AM2 → validate cross-owner mappings and continuity → durably commit new detail/cursor → publish one identity. Read-only display may use already retained detail but never creates a backstory, person, draw or job. For a long catch-up, show a neutral preparing state while other independent supported work remains usable; block only dependent actions.

**Demotion:** at a safe boundary after relevance remains below the selected threshold for two local review windows. This hysteresis is a tuning suggestion, not a world rule. No demotion during an unresolved foreground choice, disputed custody transfer, in-progress irreversible operation or promotion transaction. A distant active job can use a cheaper scheduler representation if that representation preserves exact escrow/due/result. It need not stay fully rendered. Demotion drops caches first and summarizes only unpinned routine history using P18 F3; it neither rerolls nor erases a recognized person.

Keep a causal due queue ordered by local due time, declared producer precedence and stable ID. For independent equally due optional work, use a saved rotating cursor to avoid starvation. Dependent work cannot overtake its prerequisite. Performance time selects when to yield, never which outcome/actor gets the last herb. Save target time, unfinished phase/entity cursor and remainder through the accepted owner; do not advance the visible causal clock beyond unfinished required work. No whole-population pair scan: P19 contact neighborhoods and actual channel edges generate candidates.

## AM2.1: what a capsule must retain

The capsule references authority; it does not duplicate all its data. Root selects schema placement with each owner. Minimum retained semantics:

| Group | Required retained facts / limits |
|---|---|
| Identity | Qualified person/place/thread ref, instance/incarnation, actual name/aliases, reserved role, generator/table/law/source revisions and explicit known/unknown/unresolved fields |
| Time | Local coverage start/end, clock mapping, exact actual birth/departure/destruction transitions where supported, next executable deadline/cursor; no invented pre-enrollment history |
| Means | Current life/presence, custody/stock/right/skill/source references, open reservations and commitments; not a duplicate purse |
| History | Exact causal anchors used by callbacks, recognition and evidence; count/latest summaries only for readers that request those dimensions; claim/belief kept apart from truth |
| Latent detail | Retained resolved family axes/background decisions, committed draw receipt and constraint mask, expansion algorithm/table revision; unresolved slots explicitly unfilled |
| Disclosure/closure | Observer-known refs, source quality/contradiction IDs, live consumer pins, settlement tombstones and closure capacity; unknown is never absent or safe |

### AM2.2: a consistent backstory without rerolling

An original summarized mender is already known to have repaired a bridge at local date D, spent a specific tool, returned at D+2 and promised a lesson. Promotion preserves those anchors. Fill only previously unspecified detail: a compatible former workplace or reason for travel. It cannot add an overlapping three-year apprenticeship, relocate the repair, recover the spent tool or make the lesson already delivered.

Prefer storing a compact resolved background outline at first introduction, then expand it into P14 accounts/P15 prose. If deferred detail needs selection, enumerate the constraint-compatible domain in stable order from its pinned revision and commit one named draw/assignment once at the declared admission boundary. Persist the chosen assignment before showing it. No rejection-sampling loop until a more interesting history appears; no seed-only recreation from today's table. Repeated promotion, reload, different panel order and updated grammar retain the assignment. Two revealed fields must share one consistent temporal constraint system, not unrelated lazy choices.

If no compatible assignment exists, retain the verified anchors and mark the optional slot unresolved. Use a neutral original line or defer that detail; record a contradiction ID for author review. A disputed witness account may remain disputed without changing event truth. Only an explicitly sourced time/identity exception or selected AU overlay can change the apparent rule. Never invent an exception as error recovery. Old saves enroll prospectively; do not manufacture the hero's past or transform P4's keepsake into an earned capability.

## AM1.4: browser work budget, not a fictional population cap

Illustrative allocation for one 60 Hz foreground frame: **4 ms incremental P32/P19/P20 domain work**, **2 ms changed-view preparation**, with the existing native work/render/save measured separately. This is a target on a named future laptop/build, not measured feasibility. A one-second game tick does not justify blocking its input thread for a second. Proposed ordinary slice limit: 32 due entity updates, 64 total candidate evaluations, at most 8 new social episodes, and a yield request after 4 ms. Essential work exceeding this amount continues through an exact cursor; content is not dropped. One atomic operation still needs a bounded cost or explicit overrun measurement.

| Allocation in one illustrative slice | Count × assumed unit CPU cost | Total |
|---|---|---|
| Individual due updates | 32 × 0.025 ms | 0.80 ms |
| P19 contact/plan candidates | 24 × 0.030 ms | 0.72 ms |
| P20 site/cohort transitions | 8 × 0.060 ms | 0.48 ms |
| Thread deadline checks | 16 × 0.020 ms | 0.32 ms |
| Continuity required-ref checks | 12 × 0.030 ms | 0.36 ms |
| Index/dispatch housekeeping | 24 × 0.020 ms | 0.48 ms |
| Arithmetic total / remaining margin | Assumed, not benchmarked | **3.16 / 0.84 ms** |

Candidate evaluations total 24+16+12=52, leaving 12 to the proposed 64 limit. This illustrative work ignores clone/validation/publication, so it cannot establish a total runtime bound. Benchmark those costs independently and include them before accepting the allocation. P19's proposed 5 ms p95/20 ms p99 social envelope is not an extra allowance atop P32: here social and settlement work share 4 ms; a future root must reconcile/tune the stricter target, not add overlapping envelopes.

Initial load fixture: 64 detailed individual refs, 256 cold capsules, 256 directed active edges; P20 reads 8 detailed sites and 32 summarized settlement/cohort refs. These are workload tiers, not canon population, friendship, building or gameplay maxima. Scale can grow via summaries, background workers, larger storage or deliberate slower catch-up. A worker may compute detached proposals, but the main authority still validates/persists before publication; rendering and worker scheduling never spend gameplay draws. P19/P20 retain their domain writers and summaries. [CR4 NP1-NP3](../cr4/NPC_CRAFTERS.md) production stays exact through actor-aware jobs, even if the maker's social routine is summarized.

## AM1.5: save arithmetic and authoritative measurement

P19's C4 estimate is **663,552 B + 128 KiB = 794,624 B = 776 KiB** incremental decoded JSON, before proving assumed row sizes. Reuse that social state once. An additional illustrative P32/P20 allowance is 40 place refs ×256 B +64 LOD metadata refs ×128 B +64 pending cursor/dependency refs ×192 B +32 KiB retained constraint/manifest overhead = **63,488 B = 62 KiB**. Combined planning total **858,112 B = 838 KiB**, not measured and not added again to each shared history owner.

For ASCII-heavy JSON, UTF-16 storage can be roughly twice these decoded UTF-8 figures. One 838 KiB increment in ordinary and backup copies could approach **3,432,448 B = 3.2734375 MiB** by itself, leaving less than 0.73 MiB of the live 4 MiB guard for native state/keys/other origin data. Unicode, envelope structure, encoding and other owners change this. Thus P19's ≤1 MiB decoded target does not prove origin fit. P2's unbounded inspected catalogue map further needs measured growth and query-aware retention; do not delete an old product still used by a method/exposure/holder.

Use [P18 M9](../p18/METRICS.md#f1m9-save-growth-per-game-year-f3) on synthetic complete envelopes, plus P18 long-run cases, not a second runner. Compare cold/detailed/all-pinned fixtures and total origin ordinary+backup storage. Required queries/settlement IDs survive compaction; reserve closure space before paid admission. At capacity pause optional new texture with a neutral reason, keep existing obligations intact and offer selected storage/archive paths. Never replace individually promised history with a nameless cohort merely to meet a number.

Future gates, all OPEN: split/jump/yield/reload/import same committed history and next draw; promotion/demotion/panel-order invariance; no named/cohort duplication; deferred detail satisfies all retained anchors; zero missing required refs/settlement replay; fair independent backlog; measured p95/p99 and largest atomic slice; actual whole-origin bytes/quota recovery; rebuilt 1366x768 and 1600x1000 return-to-person/place journey. Human continuity and freshness remain separate acceptance.

# F1: headless story QA harness

2026-10-14. **PROPOSAL ONLY.** Read-only source audit, no execution. Extends
[root F1](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#f-quality-scale-and-safety).
Contracts below are proposed, not existing APIs. Main checkout observed on
`codex/gameplay-foundations`, HEAD `6e03e972932c6b7b199d454b59cff528f39c2462`;
dirty work existed. HEAD alone does not identify those bytes. Root must capture
module/content digests when implementing or running this plan.

## F1.1: inspected infrastructure and evidence limits

Shown/SOURCE means code inspected here, without running it. Stated means an
owner/report asserts a result; inferred means this packet's interpretation.

| ID | Locator | Shown or stated | Proposed use / gap |
|---|---|---|---|
| H1 | `package.json:6-10`; `tests/simulation.test.js:14-29` | Shown: Node test runner; factory, synthetic registry, enrollment, command, advance and reload helpers | Build a CLI from pure modules. Existing fixtures are SOURCE fixtures, not natural acquisition proof |
| H2 | `src/expansion_engine.js:588-640` | Shown: integer duration; detached state/budgets/gameplay; due-boundary scheduling; 512-boundary return with `remaining`, `budgetExhausted`, `stoppedAtChoice` | Drain returned time, preserving all returned owners. Never set the clock directly to the requested target |
| H3 | `tests/simulation.test.js:183-195`; `tests/expansion_engine.test.js:81-87,103-115` | Shown: hidden/known decisions, budget continuation, split/jump and choice-stop checks | Extend to long runs and policies, including zero elapsed time with legal same-time work |
| H4 | `tests/simulation_extensions.test.js:96-130` | Shown: helpers, split/reloaded equality, failed-write isolation, departed controllers and private event settlement | Reuse invariants. Read-only inspection of these tests does not establish their current pass status |
| H5 | `scripts/scheduler_profile.mjs:1-27` | Shown: 64-helper synthetic benchmark, split/jump equality, pathological 10,000-minute request, external fixture file | Reuse performance shape. Default input points outside repo to an earlier proof; never run it against an unknown/private file. Its helper `p95` uses the maximum of five samples, unlike a general percentile estimator |
| H6 | `scripts/field_scale.mjs:1-22` | Shown: self-contained 64-actor/480-minute finite-work benchmark and expansion hydration | Good independent fixture-factory pattern. Not a many-year story metric or full native-envelope benchmark |
| H7 | `scripts/engine_profile.cjs:1-19,128-138`; `scripts/simulation_browser.cjs:1-39` | Shown: pure timing plus Playwright/DOM routes and external/generated save fixtures | Keep browser acceptance separate from no-DOM runner; historical viewport/fixture/schema assumptions need refresh |
| H8 | `src/simulation.js:395-410,418-449,452-510` | Shown: frozen occurrences, legal response preview/commit, expiry and independently seeded automatic checks | Shared legal-action seam; emit telemetry at commitment/settlement before terminal pruning |
| H9 | `src/simulation_resolution.js:4-32`; `src/simulation_effects.js:200-205,281-292,376-378` | Shown: derived seeds, frozen spawn templates, knowledge basis, relationship receipts, caused checks | Retain exact identities and cause links. These are not an arbitrary story generator or universal context adapter |
| H10 | `src/causal_story_ids.js:2-13`; `src/causal_story_core.js:170-189,228-298,318-320`; `src/causal_story_host.js:437-503` | Shown: strict optional ledger, bounded receipts, source/native revisions, caller-owned strike RNG, actual-completion receipts and observer-limited presentation | Include authored causal cases as regression scenarios, not procedural diversity evidence. Their strict validators are authoritative |
| H11 | `src/causal_story_actors.js:33-39,84-87`; `src/causal_story_content.js:223-244`; `src/causal_story_native.js:203-206,370-457` | Shown: authored people/controllers, native constructor/read/stage/snapshot bindings | A pure fixture may model retained data; it cannot assert native binding merely by setting `bound:true`. Native-backed scenarios need the actual adapter or remain unsupported |
| H12 | `src/causal_story_scenes.js:38-47,63-103`; `src/causal_story_ui.js:61-83`; `src/simulation_ui.js:5-13`; `src/event_feed_ui.js:1-12` | Shown: known-account scene projection and DOM UI constructors | Import pure projections where possible; exclude UI/main from the headless entry point. No fake DOM to disguise dependency leaks |
| H13 | `src/event_feed.js:3-6,87-103`; `src/people_knowledge.js:6-39,88-105`; `src/life_record.js:1-15,32-58`; `src/world_visit_history.js:6-58` | Shown: observer-specific, bounded display; lossy biography; reconciled reference-aware visit compaction | Do not count stories or reconstruct causes from the final feed. Test safe projections and reference retention independently |
| H14 | `src/save_files.js:186-207`; `tests/save_files.test.js:20-56`; `tests/life_record.test.js:6-41` | Shown: preflight before import write, shared-origin size budget and lossy-history tests | In-memory storage fault injection plus exact envelope roundtrip. Source encoding/import is not literal browser file-input proof |

P3/P4 are read-only branch inputs. Their [P3 report](../../../../../.claude/worktrees/proc-p3-storylets/docs/gm/dispatch/procgen-2026-10-13/p3/REPORT.md)
and [P4 report](../../../../../.claude/worktrees/proc-p4-people/docs/gm/dispatch/procgen-2026-10-13/p4/REPORT.md)
state built/native checks; P18 did not rerun them. Root has not established their
integration here.

| ID | Branch locator, relative to named worktree | Shown/SOURCE capability and limit |
|---|---|---|
| H15 | P3 `src/storylet_deck.js:10-17,29-40,48-73,77-96` | Saved deck streams, eligibility/cooldown/once filters, lifetime seen damping, family pity, quiet slot, three-open pacing, twenty receipts with only top-three weights |
| H16 | P3 `tests/storylet_deck.test.js:11-20,22-90` | Real enrollment factory, deterministic draws, pure previews, callback requirements, safe expiry, ordinary decision pause, all-card free-response checks, corrupt import rejection. Seven deck test declarations match the report; one separate UI test is also reported. Refresh executed counts when selecting, do not copy the report count as current proof |
| H17 | P4 `src/generated_people.js:12-41,43-79`; `tests/generated_people.test.js:6-29`; `tests/name_grammar.test.js:3-10` | Three saved people, retained names/traits/funds, O(people) final hourly projection, legal meeting/supply/settlement; catchup/restore/import/failure checks. Final projection does not enumerate intervening actions |

## F1.2: deterministic execution contract

Proposed entry point `scripts/story_qa.mjs`, pure runner `src/story_qa_harness.js`
and test helpers, owned by a future selected slice. Never import `src/main.js`
or UI constructors. Start with a public original fixture factory using
`createExpansionState` / registered content / enrollment APIs. Fixture-awarded
stock is explicitly `SOURCE_SYNTHETIC`; add a separate recorded legal action
journey later. Private source packs run locally with ID-only public results.

One run manifest binds: seed, start/fixture revision, module digests, pack/table
revisions, world/instance/continuity/era/overlay, calendar mapping, scheduler
version, policy and storyteller revisions, action sequence, stop reason, target
and actual elapsed minutes. Include Node/platform for performance only. No
personal save path, hero data, source text or secret mapping in public manifests.

Three clocks stay distinct:

- F1.2a **Expansion minute**: scheduler `state.clock`; integer causal time.
- F1.2b **Native calendar**: explicit start anchor plus supported elapsed time,
  through owning adapters. `src/game_time.js:35-41` has twelve 30-day months;
  `src/life_record.js:3,60-65` maps that calendar. P4 takes calendar minutes,
  not an arbitrary copy of expansion clock. Unsupported mappings report N/A.
- F1.2c **Recorded session/absence signal**: supplied fixture input, never current
  `Date.now()`. A performance timer measures runner speed only. Activity and
  absence inputs are stamped if they affect selection. Wall passage alone adds
  no game time to the current P3/P4 baseline.

Resolve [P11 context](../p11/CONTEXT.md) from fresh returned owners after every
boundary or commit. Missing required body/stock/law support rejects that scenario;
unknown is not zero. Refresh external money, exact inventory keys, XP, equipment,
vitals, custody and native projection patches atomically. Carrying only `state`
would lose real transfers. Do not overwrite a returned owner with a stale fixture
context or invent a native capability to keep the run moving.

## F1.3: fast-forward under the current budget

Illustrative pseudocode, not runnable current API:

```text
target = start.expansionMinute + requestedMinutes
while current.expansionMinute < target or supportedDueWorkExists:
    old = semanticFingerprint(current, streamPositions, dueOwners)
    plan = advanceSimulation(current, target - current.expansionMinute,
                             freshOwnerContext(current))
    validateAndPersistToMemoryThenPublishAllOwners(plan)
    if plan.stoppedAtChoice:
        choice = policy.previewLegalKnownResponses(current)
        if choice exists: commitThroughOwningHost(choice)
        else: return unresolvedChoiceWithIdAndRemainingTime
    else if lifeEndedOrAdapterUnsupported(plan): return classifiedStop
    else if plan.budgetExhausted: continueWithReturnedRemaining
    else if targetReachedAndNoDueWork: break
    if same fingerprint repeats without legal work: return noProgressFailure
    yield to CLI periodically; enforce call/time/trace budgets
```

Use the real `advanceSimulation` signature in H2 during implementation. A
512-boundary return is a yield, not a defect. Never discard `remaining`, restart
from the original plan, skip a boundary, or answer a choice by changing status.
Progress can be a same-time receipt/sequence/queue change; comparing only clock
would falsely flag legal zero-duration responses. Conversely sequence increases
alone can hide a livelock: track repeated semantic states and excessive same-time
commits with a finite diagnostic cap. All early stops mark the run censored.

For telemetry, register an optional observational sink at event emission,
response/expiry, thread transitions and committed owner deltas. Buffer provisional
records on the detached plan and flush only after successful publication. The
sink cannot draw RNG or execute effects. Capture before `simulation.js:405-407`
prunes terminals. Sampling only at 512-boundary returns can miss many events.
P3's twenty-receipt ring and top-three weights cannot prove complete eligibility
or explain total selection probabilities; store full private candidate decisions
in a bounded test trace plus compact ID-only aggregates.

P4's O(people) routine projection can be fast-forwarded for endpoint equality.
Action frequency/drama telemetry requires a separate hourly observer adapter
consistent with the same pure resolver, or label those metrics unsupported.
Do not infer 200 hourly choices from one final action.

## F1.4: E1 standing-policy test profiles

Extend [root E1](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#e-player-control-and-idle-fit)
and [E2 standing orders](../../../../emergent/E2_STORYLETS.md#standing-orders-o2).
Profiles are harness inputs until the production policy owner is selected.
Calling legal response APIs headlessly does not implement player policy controls.

| Policy ID | Deterministic choice / expenditure | Diagnostic purpose |
|---|---|---|
| E1.Q0 safe-ignore | P3 offers/flagged decisions use saved safe expiry; legacy blockers stop and report | Genuine baseline for unattended storylets; no paid action or fake response |
| E1.Q1 neighbor-help | Match known help-tagged affordable responses, total money cap 5 per occurrence and declared session reserve; otherwise free help/decline | Test actual helping, cumulative budget and no invisible spending |
| E1.Q2 never-extort | Reject extortion payment; prefer supported stand/leave/free response by stable priority | Test values, coexistence of nonpaid routes and downstream consequences |
| E1.Q3 curious | Prefer known study/investigation under configured cost/resource floors | Test knowledge acquisition and mysteries without reading truth |
| E1.Q4 route-explorer | Breadth-first legal known actions, deterministic ID tie break, separate path budgets | Reachability witness search, not a player default or omniscient policy |

Match explicit enabled rules by priority then stable rule ID. Preview all costs,
actual means and current response prerequisites before commit; retry stale quote
by re-preview without redrawing the event. Equal choices use explicit stable
response order, no hidden random draw. Only a policy specifically naming an
irreversible choice can authorize it in a selected supported fixture. Log
policy/rule revision, auto/manual/expiry status and actual debit. Cap spending
cumulatively within a declared policy window, including all supported currencies
and item reservations; a per-occurrence cap alone can drain a purse. Caps are
player policy preferences, not world-wide anti-repetition rules.

No applicable legal answer means safe authored expiry if supported, or an
unresolved choice classification. Legacy seen decisions remain blockers in the
baseline (`simulation.js:82,455,494`); they cannot be made nonblocking by QA.

## F1.5: run matrix and future gates

Proposed tiers, relative to a future measured runtime budget:

| Tier | Initial matrix | Evidence |
|---|---|---|
| Smoke | Seeds 1, 17, 73, 0xffffffff; opted-out/enrolled; Q0/Q1; 1 played day | Determinism, no-DOM import, conservation, choice/expiry paths |
| Sweep | 32 fixed seeds; Q0-Q3; 30 played days; each implemented local style including pass-through | Metrics with per-seed distributions, identical initial causes and logged actions |
| Soak | 8 fixed seeds; 10 game-years; 1 seed at 100 years; small/64-actor workloads | Save growth, reference integrity, repeated opportunities, runtime/heap bounds; natural life ends are classified and duration censored |
| Reachability | Each authored card/response/required pair and each supported source-profile boundary | A legal witness path or bounded unknown with missing prerequisite; seeded state injection is a separate gate probe |
| Metamorphic | Small ticks vs budget-drained jump; reload/import midway; different UI inspection counts; compaction on/off; unrelated RNG stream activity | Same committed outcomes where policy/context timing is equal; current consumer queries and next draws preserved |

Sample active policies at the same declared decision boundaries in split and jump
runs. Otherwise differing action opportunities confound the comparison. Clamp
comparison to a common elapsed-time horizon and report life-end/unsupported
censoring rather than silently respawning. A repeated-life scenario needs an
explicit selected transition and retention law.

Hard future gates: no unhandled errors, unresolved required reference, duplicate
settlement, unauthorized debit, sealed exposure, hunger death or absence-created
punishment; exact same-seed replay and budget-drain parity; save/import before
publication; opt-out compatibility. Style/novelty/drama targets are calibration
proposals in [METRICS](METRICS.md), never mandatory fun scores.

Implement and test one original storylet consumer first. Canon-first gameplay
priority remains with root; this fixture is a QA specimen, not a compulsory
Village opening. Then use source-qualified P9/P10 profile adapters for quiet,
school, military, loop and story-powered cases. Unimplemented laws remain N/A.
No universal world simulator is implied. Long-run SOURCE proof is followed by
rebuilt fresh-origin browser proof at 1366x768 and 1600x1000, Save/reload and
Export/literal-file Import for changed runtime/UI/persistence. All future gates
are **NOT RUN** in P18.

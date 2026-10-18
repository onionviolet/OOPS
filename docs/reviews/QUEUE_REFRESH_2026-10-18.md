# Queue and status refresh, 2026-10-18

User request: "update ques and stuff and more with the latest info".
Interpretation: reconcile existing queues, indexes and next-step summaries with
the latest saved project records. Documentation only. Rules: AD32/AD35/AD36/AD38,
authority order in RULES_INDEX, shared-worktree hunk discipline and sealed-secret
boundaries. No new accepted mechanics or runtime priority is created here.

## Findings and corrections

| Code | What was stale | Correction / source |
|---|---|---|
| F1 | IDEA_INDEX's opening current implementation routing and PROJECT's Next step led with October 4/11 snapshots. | Added [current routing](../IDEA_INDEX.md#current-queue-routing-2026-10-18), surfaced it in PROJECT, and labelled the older snapshots historical. Original detail and failed/open gates remain. |
| F2 | Acquisition queue opening required another go-ahead for owned read-only research, contradicting its own standing task. Buy/install rows preceded later payload and research results. | [Acquisition routing](../research/FUTURE_ACQUISITION_QUEUE_2026-10-13.md#current-routing-2026-10-18) follows the [wave results](../gm/dispatch/game-research-wave-2026-10-14/runs/SESSIONS.md). PARTIAL source coverage and unverified present entitlement remain explicit. Purchases/downloads are not authorized by this edit. |
| F3 | A1/A2 names collide across engine conditions/claims and UI inventory/nearby context. | Separate QR1/QR2 routes. [Engine owner](../research/reincarnated-in-a-shounen-manga/YAIR_CONSIDERATIONS_2026-10-16.md) records both engine-only deliveries. RS26 retains the UI merge and Weibao play gate. |
| F4 | Older UI checkpoint starts before later released leaf reports. | Route to [UIL7](../gm/dispatch/ui-foundation-2026-10-15/next-parts/UIL7_REPORT.md), [UIL8](../gm/dispatch/ui-foundation-2026-10-15/next-parts/UIL8_REPORT.md), [inventory leaf](../gm/dispatch/ui-foundation-2026-10-15/next-parts/GRIPES_A1_REPORT.md), [nearby leaf](../gm/dispatch/ui-foundation-2026-10-15/next-parts/GRIPES_A2_REPORT.md) and their integration checkpoint. Candidate-specific technical evidence does not establish a combined pass or human acceptance. Active integration records were not rewritten. |
| F5 | Direction summary and old machine-readable queues lacked current compatibility/authority routing. | Added current overrides in [direction summary](../DIRECTION_SUMMARY.md#current-rule-and-queue-overrides-2026-10-18) and routingReview metadata in the existing audit/absorption queues. Preserved every historical packet, delivery state and reservation field. The metadata grants no lease or dispatch. |

## Coverage and remaining gates

Reviewed selected sections of PROJECT, USER_VISION, RULES_INDEX, IDEA_INDEX,
DIRECTION_SUMMARY, acquisition queue, game-research wave session results,
plan/rule reconciliation, modular checkpoint, shounen engine delivery sections,
UI integration checkpoint and four leaf reports. Inspected audit/absorption JSON
and the two October 11 implementation queue structures. This is a bounded routing
refresh, not a complete audit of all nested queues or a new source research pass.

M3's later resume/merge/post-merge records supersede its stopped summary. M4 is
unstarted per its checkpoint and is separately selected. No new build was made
here. The latest saved evidence can lag ongoing writers; recover exact current
inputs before using it for execution or accepting a combined candidate.

Current selected UI work retains 1920×1080 primary and 1366×768 floor with its
14px/21px matrices; mobile deferred. Combined rebuilt browser/current-state
persistence and Weibao's visual/play acceptance stay with the integration owner.
World1's paused full-completion horizon is unchanged. New audit proposals and
filename-only plan inventory rows do not become prerequisites.

## Verification

Task-local link/anchor checks, JSON parse/retained-field comparisons, preserved
baseline-line checks and whitespace checks are recorded in the companion
[check receipt](QUEUE_REFRESH_CHECKS_2026-10-18.json). `npm run check:rules` is
run for current rule routing. No runtime tests, build, browser, live Steam/tool
inventory, source acquisition, dispatch, commit or push is part of this refresh.

## Superseded routing text retained for history

Only replaced routing fragments follow. Their current replacements are above.

### PROJECT.md

```text
## Next step
```

### docs/IDEA_INDEX.md

```text
[Design session resume point](gm/PROJECT_LOG.md#design-session-resume-point-2026-10-04) provides the compact current capture and proposed next execution action. It links the detail owners below; it is not another feature specification.
## Current implementation routing, 2026-10-04
```

### docs/DIRECTION_SUMMARY.md

```text
Updated 2026-10-15. Navigation summary of accepted direction, not a new
```

### docs/research/FUTURE_ACQUISITION_QUEUE_2026-10-13.md

```text
2026-10-13. Type: QUEUE, proposal only. Lists reference games that have no research lane yet, or whose lane names a follow-up pass. Being listed does not authorize a purchase, download, install or decompile; each one needs Weibao's go-ahead. Follow [reverse-engineering tool fit](REVERSE_ENGINEERING_TOOL_FIT_2026-10-13.md): run a pass only to answer a named mechanic question, not to have a full export.
**Last inventory run, 2026-10-13:** none of the 12 queued paid games is owned or installed, so no decompile pass ran. Installed games already have lanes. Local RE tools: Ghidra 12.1.4 (Homebrew, with keg-only openjdk@21), `strings`, `otool`. Not installed: dotnet, ILSpy/ilspycmd, a runnable Cpp2IL, AssetRipper, Java decompilers, UndertaleModTool. A .NET or Unity pass would first need dotnet plus ilspycmd.
## Short list
## Follow-ups from the 2026-10-13 lanes
## Unlogged candidates, ranked by expected design payoff
```

## Round 2: other queues and plans, 2026-10-18

User: "What about the other queues and plans we have? Check those for stale info
too and update accordingly, more to consider?" AD32/AD35/AD36/AD38 and AR1/AR3/
AR6–AR8 guide the corrections. This is documentation reconciliation, not a new
runtime wave, ownership transfer or acceptance decision.

### ACT NOW: completed corrections

| Code | Drift | Corrected owners and evidence |
|---|---|---|
| F6 | Research/technology PLAN/STATUS/next prompt still describe an undispatched first slice or research-only wave. T12/T13 checkpoints stayed at started despite complete reports. | [Wave STATUS](../gm/dispatch/research-tech-2026-10-14/STATUS.md), PLAN, NEXT_SLICE_PROMPT and the two leaf checkpoints now lead with final dispositions. Chronological dispatch instructions remain labelled as history. |
| F7 | October 6 depth queues could imply their original unread lists and hashes describe the sum of research today. | [Game-source queue](../gm/dispatch/game-source-research-2026-10-06/DEPTH_QUEUE.json) now routes five games to later bounded reports, with report hashes. [Idle/social queue](../gm/dispatch/idle-social-gms-2026-10-06/DEPTH_QUEUE.json) and [discovery queue](../research/game-discovery-2026-10-06/DEEPER_QUEUE.json) point there before a repeated pass. Questions are not marked answered by association. Discovery entryPaths are external-game-relative, not missing OOPS files. |
| F8 | Technology CN rows looked unstarted even after distinct deliveries. | [Technology owner](../TECHNOLOGY_AND_PROGRESSION.md#current-build-routing-and-cn-follow-through-2026-10-18) now distinguishes B1's shared source commit `667fbe118` and prior seeded-native proof, B2 fixtures, B3 design-only inspector, B4 restored provenance and B5 prepared prompts. No fresh gameplay or human acceptance inferred. |
| F9 | Foundation checkpoint opens with no runtime gate passed, before its final technical-closure report. The separate FA chain is still incomplete. | [Foundation checkpoint](../gm/dispatch/foundation-completion-2026-10-12/CHECKPOINT.md) now surfaces its [final finite report](../gm/dispatch/foundation-completion-2026-10-12/REPORT.md) and ownership release while retaining intermediate failures and the separate FA horizon. |
| F10 | PLAN-P3 still queues the original capped-XP defect for reproduction/repair. | [Idea implementation queue](../gm/dispatch/idea-expansion-2026-10-11/IMPLEMENTATION_QUEUE.json) now records current `Number.isFinite` source and shared commit `252661721`, linking MICRO-P1's isolated native proof. A present defect must be established before another repair. [Starts queue](../gm/dispatch/starts-talents-continuity-2026-10-11/IMPLEMENTATION_QUEUE.json) retains isolated first-slice delivery and integration/director gates, with later start/body owners. |
| F11 | Procedural plan/waves/graph still use active/unmerged P34 language; the registry proposal predates the actual domain registry. | [Procedural status map](../PROCEDURAL_GENERATION_STATUS_2026-10-13.md), original PLAN and P39 WAVES/GRAPH/REGISTRY now route to `759dd393`, the existing modular seam and retained B1–B3 gaps. NPC-heavy/layout deferrals qualify new selection. No proposed graph was turned into mandatory build order. |
| F12 | An old integration JSON and crosswalk can imply paused World1 grants current writes. Historical engine and nonhuman plans can imply universal hold/absence/frozen-time requirements. | [World1 integration plan](../gm/dispatch/world1-full-completion-2026-10-11/INTEGRATION_PLAN.json) explicitly follows paused STATE; [foundation crosswalk](FOUNDATIONS_DIALOGUE_AND_ABSORPTION_PLAN_2026-10-12.md), [engine resume](../ENGINE_GM_NEXT_CHECKPOINT.md) and [nonhuman roadmap](../worlds/NONHUMAN_SYNTHESIS_AND_ROADMAP_2026-10-14.md) route new work to current owners and decisions. No paused goal resumed. |

### Coverage and unchanged dispositions

All **seven public `*QUEUE.json` owners** were structurally inspected and their
repository-relative reference strings checked. Five queues received additional
current routing; the two first-pass audit/absorption queues already had it and
retained their packet states. JSON arrays such as P39 SLICE_INDEX remain in their
existing schema; current reuse qualification lives in the owning wave/graph docs.

A filename/text scan covers **748 plan/status/brief/checkpoint Markdown records**,
excluding private/novel/history directories. **135** contain candidate wording
such as unmerged, waiting, not dispatched or sole writer. Those matches include
valid historical statements and unresolved work. They are not 135 defects.
The [coverage inventory](QUEUE_PLAN_COVERAGE_2026-10-18.json) distinguishes
section-reviewed owners, corrected owners and text-scanned-only records. It
stores paths and candidate line numbers rather than raw/sealed content.

Additional checked owners with no new correction needed: modular M3/M4 and
its later reconciliation; paused World1 checkpoint/STATE; current LOTM plan;
quiet-continuation checkpoint; body-lineage, harvest and traveler plans already
qualified by another reconciliation; core-foundation/nonhuman COMMON notes;
wiki lane status, completed UI density prompt qualification and sci-fi/JoJo plan.
Their existing limits remain. No assertion of a full semantic review of all 748
records or renewed external source verification is made.

### ACCOUNT FOR NOW: further considerations

| Code | Constraint saved for the next selected queue item | Consequence |
|---|---|---|
| QRC1 | **Track scope and verification separately.** A completed Foundation horizon, incomplete FA horizon and paused whole-world horizon coexist. | A later incomplete chain does not reopen every older gate; an older pass does not close the larger chain. |
| QRC2 | **Carry a reason with each dependency.** Distinguish a missing API, an unverified consumer, a human play gate, an authoring choice and stale status. | Existing modules can discharge infrastructure dependencies without discharging native integration or play acceptance. |
| QRC3 | **Old pins identify historical proof.** New report hashes route later research; changed bytes alone do not invalidate every older scoped claim. | Before a reread, compare the named unanswered question and source/build identity, then inspect only the relevant gap. |
| QRC4 | **An owner record is not a current lease.** Old thread IDs, preview ports and worktree paths can outlive their processes or cleanup. | Recover current input/ownership before execution; missing preview does not erase a delivered report. No server or worktree was relaunched here. |
| QRC5 | **Keep source locators based correctly.** An external game's src path is not an OOPS path, and a generated graph is not a dispatch queue. | Validate links according to their schema and use the owning plan's current qualification. Avoid false missing-file/unfinished-work findings. |

### LATER / DELEGATE: proposals, not launched

| Code | Trigger and useful next work | Level / effort / done check |
|---|---|---|
| QRL1 | When maintaining queue tooling is selected: a small report for owner links, stale starting claims and evidence-class omissions, using existing JSON/doc checks. | Tooling agent, small. Done: flags a known stale fixture and accepts a historical resolved entry without writing acceptance state or spawning workers. |
| QRL2 | When a particular older plan is selected or conflicts with live behavior: follow its concrete dependency chain through current consumers and settle that row. | Domain agent, bounded medium. Done: owner records the exact current dependency/evidence and remaining player-visible gate. This is not an automatic backlog-wide reread. |

### Round 2 verification

`npm run check:rules`, task-added links/anchors, all queue JSON parsing,
packet-preservation comparisons, task-hunk whitespace/conflict checks and
[superseded-text preservation](QUEUE_PLAN_SUPERSEDED_2026-10-18.md) are recorded in
[round-2 checks](QUEUE_PLAN_CHECKS_2026-10-18.json). New report/coverage artifacts
are documentation. Existing baseline link failures outside changed hunks are
not silently relabelled as introduced failures. No runtime test, rebuild,
browser play, acquisition, worker/chat dispatch, staging, commit, merge or push.

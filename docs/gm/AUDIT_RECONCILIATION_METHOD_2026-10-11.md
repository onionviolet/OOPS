# Reconcile audits into deep playable work

Status: proposed method, 2026-10-11. This is a bounded review of routing and
representative existing owners, not a completed reconciliation of every audit,
a new accepted design rule, or a runtime dispatch.

Follow-up direction: [the completion standard](../WORLD_COMPLETION_STANDARD.md)
now owns the proposed sections, detail contract, ledger and random-start coverage.
Frontier is optional. References below to a first local journey sequence are
delivery examples, not a required player opening. The earlier merge observation
is a dated snapshot; the current absorption checkpoint owns its live progress.

## Observed starting point

[PROJECT.md](../../PROJECT.md) owns accepted direction. [IDEA_INDEX](../IDEA_INDEX.md)
routes design families; [USER_VISION](../USER_VISION.md) retains request provenance.
[Audit candidates](../research/AUDIT_CANDIDATES_2026-10-10.md) inventories research
candidates, not all implemented ideas.

Existing synthesis should be reused: the [implementation plan](world-implementation/IMPLEMENTATION_PLAN.md),
[reconciliation](world-implementation/second-pass/absorption-incorporation/RECONCILIATION.json),
[engine packets](world-implementation/second-pass/absorption-incorporation/ENGINE_PACKETS.md),
[dependency map](world-implementation/second-pass/integration/IMPLEMENTATION_DAG.json)
and [feature matrix](feature-wave/repositories/IMPLEMENTATION_MATRIX.json).
These have different scopes and dated delivery states. The feature matrix
explicitly labels its admissions gameplay-unverified. Its labels do not establish
current behavior across the project.

The [Proto23 audit](../research/proto23/PROTO23_VS_YAIRPG_2026-10-10.md)
explicitly limits the fork-side inspection to core reads and keyword searches
across expansion modules, and says neither game was run. Its absence claims need
current owner/source verification before implementing replacements.

At inspection, git reports an unresolved merge in `src/main.js` and
`src/crafting_recipes.js`, with additional staged/unstaged work. The
[current absorption assignment](dispatch/absorb-2026-10-11/ASSIGNMENT.md)
already orders Parts A–E and requires a playable checkpoint per part.
This method does not change those files, finish the merge, or claim those parts
are delivered.

## P1. Account for every audit idea once

First enumerate the in-scope research reports, source ledgers, implementation
packets, design owners and acceptance backlogs. Record exact revisions and
coverage limits; historical copies link to their current owner. Work in bounded
tranches, with an explicit unread remainder. Extract meaningful individual
ideas and requirements rather than making one row per report or broad topic.

Use one coverage map that links detail owners rather than copying specifications.
Each row needs a stable ID, source audit/claim locators, user-request provenance,
current owner, intended player consequence, actual code/UI consumer, disposition,
dependencies, source/code/browser/human evidence and next missing proof. Preserve
the original source IDs when several ideas merge. Sealed rows expose only safe
IDs, route/status and an agent-only detail pointer, never their hidden truth.

Useful dispositions: existing and verified; existing but incomplete/unverified;
merge with a named row; distinct world/player variant; queued implementation;
source question unresolved; superseded; unsuitable with a concrete reason.
Every source idea must map somewhere, and every claimed delivery must have
evidence. A merged row must still cover each distinct source consequence.
There is no need for a new saved gameplay meter for atmospheric detail.

## P2. Resolve disagreement before scheduling dependent work

Use authority appropriate to the question. Weibao's latest explicit decision
controls design; pinned primary evidence controls a source-fidelity claim;
current source/build/browser evidence controls what actually works. Report
dates, votes and confident wording cannot substitute for these.

Classify each apparent conflict as a duplicate, stale statement, incomplete
implementation, genuine design disagreement, source disagreement, or compatible
variant. Preserve useful variants in the relevant world, origin, situation or
player choice. Do not impose a setting just because two sources differ.
Irreconcilable choices that materially change the project remain explicit
questions for Weibao; independent work can continue.

Concrete example: furniture bonuses are now allowed by PROJECT.md and the current
absorption assignment, replacing the prior no-passive-bonus design. That settles
permission for bonuses, not all numbers, stacking rules or game feel. The older
Proto23 statement about no title catalog needs inspection of current `src/titles.js`
and its consumers before treating titles as a missing system. Distinguish an
absent mechanic from an existing mechanic missing content or browser proof.

## P3. Sequence by shared dependencies and complete journeys

Refresh existing dependency packets against live owners. Reuse native stock,
skills, jobs, clocks, knowledge and save publication; extend only a demonstrated
missing contract. A shared primitive may serve several ideas, but each world's
meaning, acquisition and consequences remain distinct.

The current absorption run already has priority within its authorized scope:
follow its live checkpoint, complete remaining compatibility/playable gates, then
continue Parts A–E in their assigned order without repeating completed parts.
Broader depth work can be mapped to that run as overlap, prerequisite or later
work rather than starting a competing source writer. Beyond it, select one
connected local journey at a time. One realm and one prestige layer remains the
first milestone; wider coverage stays queued and visible.

Where parallel work is later authorized, use disjoint file ownership and one
integrator. Research/content can proceed independently after contracts are
settled. Do not assign several workers competing ownership of saves, clocks,
inventory or shared UI. This document dispatches no workers.

## P4. Define depth as consequential use

For each selected idea, specify acquisition/discovery, the real effect, useful
choices and combinations, growth or changed uses, NPC/world response where
relevant, retention/return rules, and native UI feedback. Define constraints,
failure and interruption only where they follow from the actual mechanic.
Strong abilities need no invented weakness; not every decorative detail needs
this entire mechanical treatment.

Example proposed furniture journey: acquire or craft a station with real stock,
place it in an owned home, show its derived bonus, use it in actual work, combine
it with a learned method, and preserve ownership/effects across reload/import.
An upgrade or alternative station changes a meaningful use. Storage, portable
accessories and borrowed fixtures retain their own ownership and scope. Check
that selling, removing or moving a station removes its applicable bonus and
that repeat loads never multiply it. Specific effects remain implementation
proposals until selected and reviewed.

Start with a complete narrow journey, then deepen its interactions and author
more situations using the same working contracts. A declarative tag, debug
command, menu entry or larger multiplier alone cannot prove a promised function.

## P5. Close implementation and acceptance separately

Each wave records the exact changed behavior, build revision, relevant checks,
fresh-origin native browser journey, and remaining acceptance cases. Persistence
changes include an explicit migration/compatibility decision, old-save loading,
save/reload/import and relevant duplication/interruption cases. Keep private
user saves untouched and test with generated fixtures.

For the current absorption wave, its explicit gate is `npm test`,
`npm run build`, a fresh-origin browser journey, then save/reload/import.
Other historical test deferrals are not blanket authority to skip this gate,
nor blanket authorization to run every older wave's deferred suite.

Update the coverage map with the actual evidence. Source edited, tested, built,
browser verified, human accepted and committed remain separate states. Human
review settles proposed fiction, balance and feel. Unplayed branches remain in
the owning acceptance backlog. Continue the next wave after the present playable
checkpoint; retain the long-term remainder without pretending it is finished.

## Completion standard

All ideas accounted for means no audited idea has disappeared without a
disposition. All selected ideas implemented in depth means their promised
functions and connected journeys have explicit evidence. It does not mean
copying every reference feature, adopting contradictory global rules, treating
known source bugs as features, or calling source coverage gameplay completion.

Validation for this document: inspected the linked routing owners and current
git status; checked local Markdown link targets and this file's whitespace.
No gameplay files changed and no gameplay tests were run for this proposal.

## Core-rule follow-through, 2026-10-18

Use [RULES_INDEX](../RULES_INDEX.md) and the topic playbook's
[core-rule pass](../audits/TOPIC_EXPANSION_AUDIT_PLAYBOOK.md#core-rule-reconciliation-pass-2026-10-18)
for the current tranche. The [plan coverage report](../reviews/PLAN_RULE_RECONCILIATION_2026-10-18.md)
records current-owner corrections separately from historical filename inventory.
Resolve stale statuses and compatibility/viewport overrides from actual later
owners, rather than reopening accepted direction or adopting old launch/commit
instructions. No whole-world coverage or gameplay acceptance is claimed by a
cross-plan document pass.

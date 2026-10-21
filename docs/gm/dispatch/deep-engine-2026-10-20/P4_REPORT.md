# P4 native repair completion, 2026-10-21

Current state: selected P4 implementation and rebuilt native gates pass. This is the renewed P4 task, not a new
repair system or general transaction/clock rewrite. Exact user instruction and
ownership are in [P4 status](P4_STATUS.md). Rules AR1–16, AD6–8/15–18/32–38/41,
MR1/4/5/21–23/28–31/33 and UR61/63. Desktop target1920×1080 at14/21px;
mobile deferred. No personal saves, commit or push.

## What was wrong and what changed

F1. Start compared only spent materials and result-band figures. A sub-rounding
condition change, repaired-tool history, location or borrowed custody could
escape that comparison. Quotes now bind the complete public request/result,
exact instance condition/cap/history/use count and location, and check writable
save/custody before reserving inputs. Equal-name tools never substitute.

F2. Completion changed tool condition/history and the keyed RNG log outside the
native rollback/save boundary. Start, progress, cancel and completion now use
the existing native transaction and existing persistence port. The tools state,
durability closure and native item/RNG owners roll back on rejected writes.
Only a durable completion publishes a success/failure message. Post-durable
observer failures retain the accepted result; retry cannot double-spend,
double-refund or draw/repair again.

F3. Progress had no saved cursor tying it to the already committed native clock.
The job now retains `lastClock`, supplied by the existing calendar reader through
`native_tool_domains`, so a rejected work write can retry the already elapsed
interval without losing or reusing it. Paused intervals update the cursor while
preserving remaining work. A changed target or custody displays a pause with
explicit cancel/requote guidance rather than applying an old result.

The accepted restore/chance/material/failure bands stay frozen. Existing repair
costs, chance/failure defaults, keyed draw identity, cancellation refund, and
missing-tool end-without-result policy remain. Native occupation still blocks
ordinary departure/new activities; restored-away or busy jobs retain their
existing pause behavior. No travel-policy exception was added.

## Persistence and proof boundaries

The schema-1 job adds optional `target` and `lastClock` fields, validated within
the existing tools slice. Existing schema-1 jobs without those fields still
load: the first interval adopts its existing elapsed-time policy without
inventing past work or a historical condition snapshot. New jobs round-trip the
snapshot/cursor exactly. Field ordering in imported target objects has no
mechanical meaning. No envelope version or separate save writer changed.

The isolated candidate starts from master3ce24d9cb plus the three P4 production
files. Later concurrent home-system edits are deliberately not overwritten or
represented as tested by this snapshot. Source edits are in the primary checkout;
its generated bundle belongs to the concurrent writer. P4's rebuilt candidate is
identified in [continuation inputs](P4_EVIDENCE/CONTINUATION_INPUTS.json).
No P4 build writes to shared dist/index, no primary output is promoted over that
writer, and no personal saved game is read.

The fixture supplies funds, ingots and access. The tool itself is bought from the
native merchant, equipped with the real inventory control and worn by real cave
mining before quoting. The scenario facade wraps native UI controls and the
existing clock/save APIs; it adds no repair resolver or production test hook.
Actual native travel refusal is tested. Away-pause uses a disposable interrupted
save derived from a real pending job; it does not claim an ordinary departure
through the travel guard. Save/reload/Export/literal Import cover pending,
restored-away, cancelled and finished states. Segmented requests settle the same
repair result. Natural acquisition pacing and human visual/play judgment remain
separate.

Native Start/Cancel are also exercised by keyboard Enter. A retained divider
crossed the center of the Cancel button in one pointer attempt; the accessible
keyboard route succeeds. This report does not claim that every saved divider
geometry has pointer coverage. Earlier harness diagnostics (quality-bearing
item keys, travel argument shape, omitted empty tools slice and intercepted
pointer center) are retained separately from the final receipt. An initial
candidate copy also omitted the SRD test importer and two rule-link root docs;
those inputs were restored before final gates. No product change was inferred
from those setup failures.

## Coverage reconciliation

The [current recovered coverage](../title-rules-implementation-2026-10-21/COVERAGE.md)
now cites the combined baseline, later gear L1 and latest UI release rather than
repeating the first title continuation's open labels. The original table is
preserved verbatim as dated history. CRL27/36 bounded specimen observations,
CRL37 selected processed-material lineage, CRL31 optional-widget containment,
CRL29/39 component-preview isolation and CRL33 typography/details are delivered
at their evidence's scope. Their source-lane reports and continuation checkpoint
now point to that later proof. PROJECT and the queue/engine routing retain the
same distinction. No proposal is newly accepted by this reconciliation.

Conditional salvage opportunity CRL44, spatial landing situations, general
product deterioration and broader chemistry/energy/power conversion remain
unfinished. Human visual judgment and natural progression/pacing remain open.
The baseline and gear/UI receipts certify their named snapshots; this task does
not rerun unrelated completed journeys or claim the active home feature is done.

## Final gates

| Gate | Result |
|---|---|
| Pre-fix reproduction | New contract against original tools source: 6 of 7 groups fail; retained baseline log |
| Final full suite | `npm test`: 2,451/2,451 pass; zero failed/skipped/cancelled/TODO |
| Focused contracts | 15/15 pass across tools commit/domain/panel checks |
| Build | `npm run build` passes on frozen master + P4 candidate |
| Architecture | Pass; main 10,275 vs 10,310 baseline; no new import cycles |
| Rules | Pass, zero warnings; no rule semantics changed, so no rule-behavior rerun |
| Rebuilt browser | 12 scenario groups pass at 1920×1080, actual 14/21px; zero page/console errors |
| Persistence | Native pending, away-paused, cancelled and completed Save/reload/Export/literal Import pass |
| Source identity | Candidate sourcemap matches every embedded project source; P4 production files match primary |
| Shared preservation | No P4 write to primary generated files; unrelated home/field/cleanup paths retained |

[Final identity and check summary](P4_EVIDENCE/FINAL_CHECKS.json),
[full-suite summary](P4_EVIDENCE/tests-final.txt),
[browser receipt](P4_EVIDENCE/browser/browser-receipt.json),
[scenario consequences](P4_EVIDENCE/browser/scenario-receipts.json),
[pending](P4_EVIDENCE/browser/pending-1920.png),
[changed-target pause at21px](P4_EVIDENCE/browser/changed-target-1920-21.png).
All three final desktop screenshots (pending14px, completed21px and changed-target
pause21px) were visually inspected. No human taste/pacing acceptance is inferred.

[Documentation checks](P4_EVIDENCE/DOC_CHECKS.json) confirm zero dropped nonblank
lines in PROJECT/IDEA_INDEX/USER_VISION and no broken scoped links. The current
primary rules check passes with one warning for the concurrent home writer's
untracked checkpoint; the frozen candidate check above has zero warnings.
Shared meter moved69% to70%, below the74% run ceiling, without task attribution.

All P4 source/test reservations are released. Completion is source + frozen-build
technical/native/persistence proof, not commit, push, player-window adoption or
verification of concurrent home/field work. The active shared bundle can change
under its own writer; use this candidate's identity for the P4 evidence.


## Publication authorized, 2026-10-21

Weibao: "Commit P4 and the coverage updates to master, then push our fork without
losing the other chats’ unfinished work." This authorizes the selected P4 source,
verified generated build and coverage documentation on master and origin/master
(onionviolet/OOPS). The earlier no-commit/no-push statements record the prior
implementation run. A private index selects only this task, with shared-document
hunks reconstructed from fresh HEAD; active home/field work remains in primary.
The published runtime must match the existing2,451-test/12-scenario input identity;
no unrelated runtime changes are selected. Actual local/remote commit identity
and preservation checks are reported after the guarded update and normal push.

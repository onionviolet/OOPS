# P12 environmental absorption and purification, 2026-10-14

Status: **IMPLEMENTED_UNVERIFIED**, awaiting P00 native joins and an integrated
candidate. Not eligible for a final gameplay merge under COMMON. Implementation commit: `508169ad40d0e9b06caf12c797c1245ef5054bb1`. No push/merge.
Base `0216ccdefcfce79877378f8cb0ee41129fe11c5d`; assigned branch
`absorb-all/p23-world-adaptation`, clean on entry. Coordinator's current assignment
explicitly reserved port 18831 and authorized isolated wave-2 implementation
without waiting for wave 1. Live runs/SESSIONS lists this lane as
`01a138b8-fb99-7fd2-9d02-ceeb1e4198df`. No P00/shared game files edited.

F1: The missing loop was native environmental absorption plus a useful paid
purification trial. The existing book cultivation module is unactivated authoring
input; book_world_effects projects narrow authored conditions. Neither supplies
this original native loop. New module rules and transaction plans live in
`src/absorb_p23/world_adaptation/`, with exact joins in
[HOST_CONTRACT.md](../../../../../src/absorb_p23/world_adaptation/HOST_CONTRACT.md).

F2: This is an original, opt-in test-world proposal, not a canon system. The
profile explicitly binds actual human body and world instance, requires taught
knowledge, and has no Frontier/default enrollment. Integer native energy subunits
preserve fractional idle accrual; a real owned dose and native resource debit
start a saved-clock trial. The saved draw is never exposed by public projection.
Success publishes native XP through P00; failure publishes a timed native
condition. Repeated paid occurrences remain reachable, with no lifetime once cap.
P18 growth curves, permanent tonic and concurrency policy remain its own scope.

F3: Target 1366x768 desktop. P00 must show known resource/rate, paid preview/risk,
pending countdown and actual receipt through the existing UI owners. Effects-off
suppresses the optional cue. Mobile optimization is deferred. This lane adds no
UI or claim of changed native gameplay. Baseline browser evidence is distinct
from module tests and native acceptance.

## Row dispositions

| Row | Decision | Landing/evidence | Native gate |
| --- | --- | --- | --- |
| R13 | Adapt-next implemented as original proposal | `prepareTrial`, frozen saved draw/deadline, paid transaction plans, success/failure receipt; focused source checks | OPEN: native paid dose, resource custody, pending/success/failure and persistence |
| N02 | Adapt-next implemented as original proposal | `prepareAdvance`, fractional native-energy policy, explicit condition/body/world controls, idle accrual, useful trial consumer | OPEN: native played-idle exposure, actual energy resource and useful expenditure |
| d49cb911 / 379007d7 UI features | Already adopted upstream of base; untouched | P23 UI-polish report read as it landed; no duplicate Vivid/crafting/settings/panel work | Existing gates remain with their owners |

## Compatibility and P00 request

D1: Optional schema-1 `worldAdaptation` family is absent on old saves. No automatic
migration, body enrollment, reward or resource pool. Reject null, extra fields,
unsupported schema/profile, invalid counts/deadlines/receipts and unsafe numbers
before mutation. JSON source roundtrips pass; full native save-envelope joins and
literal-file import remain OPEN. Native energy policy uses integer subunits with
zero strain and unit conversion; no universal Ki pool or replacement skill engine.

D2: P00 alone registers original location/body placement and known teaching,
native shop acquisition, exact dose item, native resource policy, native rawness
condition, saved-clock deadline callbacks, native XP and save envelope. Concrete
signatures, expected revisions/reserve checks, effect mapping and full-envelope
preflight are in HOST_CONTRACT.md. Stage custody/resource/RNG/family/reward/save
atomically; stale plans reject, and failed persistence must publish nothing.

D3: The clock must split at trial deadlines and all applicability/condition
boundaries; skipping a trial deadline rejects. Advance old context before a world
or body switch and then evaluate new context at the same clock. This prevents
retroactive exposure and skipped rawness intervals. Restore never rerolls or
publishes a receipt twice. Unsupported callback paths stay OPEN, never get a
fixture replacement.

## Source qualification

Read COMMON, AGENTS, PROJECT/current accepted direction, relevant USER_VISION and
LIFE_SIM_NORTH_STAR direction, book_world_effects, cultivation authoring/evaluator,
native integer energy and skill host owners. Current food/passive direction was
read from main's HUNGER_AND_BODILY_NEEDS_CONSIDERATIONS_2026-10-13.md (read-only;
not present at the base). R1/R2 plus R3-R5 reader summaries and relevant mod notes
were checked. Pinned HTML SHA-256 matches audit ledger:
`a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`.
Direct R13/N02 ranges inspected. Proto23/mod source and assets are inspiration
only; none copied. No raw source, user save or original/audit ledger changed.
No sealed world truth is included in this packet.

## Verification

Check artifacts: `../checks/p23-world-adaptation/` in the assigned worktree until candidate integration.

| Check | Result |
| --- | --- |
| Focused `node --test tests/p23-world-adaptation*.test.js` | 18/18 pass, 0 failures; `focused-tests.log` |
| `npm run build` | PASS, Ink parity and esbuild; `build.log` |
| Initial full `npm test` | 637/638 pass, 1 failure: existing alloy-equipment subprocess exceeded its 60000ms timeout; `full-tests.log` |
| Isolated alloy timeout recheck | 1/1 pass in 5.6s; `alloy-recheck.log`; no source repair |
| Final full `npm test` | 639/639 pass, 0 failures, 44.96s; `final-full-tests.log` |
| Fresh-origin Playwright baseline | PASS, 1366x768 disposable Chrome context, Village, zero page errors; `browser.json`, `baseline-desktop.png` |
| Served rebuild hash | `598e02f54fe7db4c9a35bc79c75a754a7f8dc42eccf9fab828de8fd82e97b615`, served bytes match local dist |
| Changed native loop | OPEN: no P00 host imports/registrations; not exercised |
| Native Save/reload/export/literal-file import | OPEN: optional family not connected to native save envelope |

The first browser harness attempt had an incorrect relative helper path, corrected.
Playwright's bundled headless executable was absent; switched to installed Chrome
in a disposable headless profile. No native foreground control or browser install.
The rebuilt bundle does not include this module until P00 imports it. Build and
baseline checks are therefore base-host proof only, not proof of the new loop.
Generated dist/source-map artifacts are excluded from commits.

## Ownership and acceptance

Only new feature directory, lane tests/checks and own report/ledger are changed.
P00 integration overlaps are explicit dependencies rather than cross-edits.
Wave-1 UI-polish report is available/read; other wave-1 merges are not required
for this isolated module. No claim to own their files, registrations or proof.
Coordinator may assemble a candidate stack; it must not final-merge this lane as
passing gameplay until P00's changed-loop and exact native persistence gates pass.
After those technical gates, the authoritative remaining acceptance is Weibao's
play/taste. This report makes no creative acceptance claim.

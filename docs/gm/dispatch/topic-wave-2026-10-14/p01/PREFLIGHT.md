# P01 preflight: stopped on missing retained stop fact

2026-10-14. STOPPED before runtime edits under NEXT_SLICE_P01.md's explicit
"Any row needs a new saved field. Report the exact missing fact instead" gate.
User dispatch authorizes this worktree and commits; no merge or push.

## F1: Work row cannot recover the actual repeat-stop cause

`src/mixture_native.js:46-47` clears the finished job and places the failed
next-reservation reason only in `plan.message`. `commitMixturePlan` persists
state, inventory, money and optional effects/expansion, not that message.
`src/mixture_ui.js` keeps it only in a DOM notice. Neither the mixture owner
nor the current frame retains the stopped order, remaining goal or cause.

[Reproduction](checks/retained-stop.mjs) stages an ordinary mix, experiment and
learn, then compares a one-batch successful queue with a two-batch queue stopped
by River bellleaf shortage. Their messages differ, but their complete retained
contexts and JSON round-trips are identical. Same frame, owner and quote cannot
project different historical causes. Current shortage after later purchases
would not establish which input stopped the earlier run.

Exact missing fact: a durable structured record of the stopped repeat and its
actual admission failure, including the input ID and missing amount at that
boundary. This is a scope/compatibility decision for root and Weibao, not an
authorized field addition here. Alternatively, root can explicitly revise the
work row to allow historical stop reason unavailable after notice loss. Neither
alternative was implemented or selected.

## F2: Last-result receipts have a narrower meaning

`src/product_appearance_state.js:30-37` retains acquisition product, revision,
time and sequence only on appearance enrollment/new-type acquisition. It returns
early for already-present product types, so this ledger is not a completion
history. Product definitions retain recipe inputs, not an event-level consumption
receipt. `lastObservation` records use, not manufacture. The dispatch already
allows missing receipt fields to read unavailable; that allowance must also
prevent presenting first acquisition as the latest finished batch. No prose was
parsed and no new receipt was added.

## V1: Recovery and checks

Clean worktree at entry, branch `slice/p01-mixing-feedback`, base `215af66c`.
Read AGENTS.md, PROJECT.md priorities, USER_VISION direction surfaced there,
chains rounds 3 and 5, P01 packet, TW-S S01-S07, T3 REPORT/BACKLOG and source.
Recovered five latest commits on all six listed source paths, worktree inventory,
all three dispatch STATUS files and topic-wave runs/SESSIONS.md. There is no
root `runs/SESSIONS.md`; the topic-wave record is under its dispatch folder.
Records identify T2/T3 as merged and topic-wave lanes as research; no listed live
runtime writer was identified. Main checkout's six listed paths were clean.
No main-checkout writes, package installs or source edits.

[Probe result](checks/retained-stop.json): 4 assertions pass, SOURCE ONLY.
[Existing mixture-native suite](checks/mixture-native.tap): 7 tests pass, 0 fail.
These are retained-state/source checks, not browser or native persistence proof.

Build and full npm test were not run because the dispatch stop gate fired before
implementation. dist/ was neither rebuilt nor committed. Browser evidence:
none. Native Save/reload/Export/literal Import evidence: none. Screenshots: none.
The JSON round-trip above does not stand in for those gates.

## Open acceptance

P01 is not implemented; nothing is labelled implemented-unverified. All P01
build, full-suite, browser and native persistence gates remain OPEN. Target
viewports remain 1366x768 and 1600x1000, with all four rows and Mix visible
without scrolling at the laptop size; mobile and human taste remain deferred.
Root must resolve F1 in the dispatch before a runtime continuation. This report
records a blocker and options, not an accepted design change. No runtime area
remains held by this stopped worker.

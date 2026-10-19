# Gripes A1/A2 implementation checkpoint, 2026-10-18

User authority: “Start A1 and A2 accordingly, check the plans accordingly, more
to consider first? Send in parallel to implement in each part? More to consider?”
These are A1/A2 from the [Claude chat review](../../../../reviews/CLAUDE_CHAT_GRIPES_AND_NEXT_STEPS_2026-10-18.md),
not the unrelated ability/claims A1/A2. No commit or push requested.

## Scope and direction

Deliver one coherent desktop UI candidate and one nearby-service interaction
slice. Targets: 1920×1080 primary, 1366×768 floor, both 14px and 21px. Mobile
deferred. Visible outcome: useful screen composition with a compact inventory
and its inspectable detail, plus Around you retaining nearby context while a
subject/service is inspected and used. Full Reports column remains usable.

Authority: USER_VISION/PROJECT; rules AD5/AD6–AD8/AD32/AD34/AD36/AD38,
UR1–UR58, AR1–AR16; SR knowledge/access rules if the selected route needs them.
Existing plan owners: [surface plan](surface-manifest-and-ui-flow-2026-10-18.md)
UIP1–UIP6/UIL7–UIL9, [Around you](around-you.md) AYF7–AYF13,
[R21 feedback](r21-feedback-2026-10-17.md) BX4/BX5/BX8/BX9/BX14.
Do not repeat the full post-build audit before its existing start gate.

## More-to-consider pass, before implementation

ACT NOW: recovered active writers and dirty state. UIL7 (chat
01a14dab-204e-79d3-aa09-ec8db0d1b164) owns layout/resize files; UIL8 (chat
01a14dab-44f6-7761-9ed7-3cc89948a344) owns proto23_shell/stat/Condition and
village weather changes. Both were sent coordination notices. Reuse their work.

ACCOUNT FOR NOW:

- M1: one split per job. Around you uses list/detail; place prose discloses
  locally rather than creating a competing wide prose column (AYF R2).
- M2: actual available width and text size, not viewport alone, decide when a
  split stacks. Saved gutter choices prevail; larger text is never shrunk.
- M3: keep selection, focus and scroll stable through ticks and service return.
  Inspection stays free, and existing action/transaction owners commit commands.
- M4: classify known people/services, never infer hours, danger, populations or
  sealed routes. Existing disclosed data and native eligibility decide content.
- M5: selected-item detail must not duplicate or displace nearby-subject detail.
  Keep the existing controller, module IDs and reset boundary. New display state
  gets an explicit transient/browser-local owner. Current-state persistence is
  checked; old-save compatibility is currently deferred by USER_VISION.

LATER: maps, schedules, attention/away digest, simulation/economy, genetics,
crowd redesign, new crafting systems. No new feature bundle or rulebook.

## Ownership and parallel work

Root owns integration, this checkpoint, shared owner-document hunks, index.html
stylesheet hooks, final build and complete gates. Existing UIL7/UIL8 writers
retain their reservations until release. Workers initially implement new leaf
modules/CSS/tests, then supply narrow integration hooks for root or obtain root's
explicit file release. No worker edits layout_spec, workspace_layout,
shell_composition, shell_layout_edit, proto23_shell, village_workspace,
shell_chrome or shell_layout while another writer owns them.

| Lane | Outcome and seam | Exclusive files | Failure case / done check |
|---|---|---|---|
| A1 / UIL9 | Inventory composition via existing shell inventory/detail mounts and layout spec, preserving native row/actions and controls | src/inventory_composition.js, styles/inventory_composition.css, tests/inventory_composition.test.js, check-gripes-a1.cjs, GRIPES_A1_REPORT.md | Selected row disappears or filter changes while inspected; compact list and reachable detail remain truthful, selection safe, no clipped row/actions at 21px |
| A2 / AYF first slice | Nearby grouped list/detail through village_workspace public frame, panel registry and native open/choose callbacks | src/nearby_context_view.js, styles/nearby_context_view.css, tests/nearby_context_view.test.js, check-gripes-a2.cjs, GRIPES_A2_REPORT.md | Inspect person then use existing service then Back/Esc: nearby rows/context remain or restore; no extra command, hidden subject or stale selection |

Scripts and reports live in the existing UI dispatch / next-parts respectively.
Subject to source inspection, reversible details are worker choices. If extra
files are necessary, request ownership from root; do useful disjoint work first.
Workers do not spawn descendants, commit, push, change branches or user saves.
Builds/tests use isolated snapshots/ports or root's scheduled shared build.

## Budget and input identity

AU1–AU15: root plus two bounded implementation workers, maximum two generated
invocations total and two concurrent, no descendants/successors/paid fallback.
Use host-supported gpt-6.1-sol medium for both coupled UI implementations.
Return <=300 words plus report paths; deep evidence on disk. Usage start: 6% of
the reported 10080-minute included window; AU7 default stop signal 11%, reserving
room for in-flight work. This is shared-account metering, not task attribution.
No whole-book reads. Relevant HEAD and dirty file hashes are in
[GRIPES_A1_A2_INPUTS.json](GRIPES_A1_A2_INPUTS.json); do not treat HEAD alone as
the baseline. Existing active UIL7/UIL8 work predates this two-worker plan.

## Verification and acceptance

Choose meaningful focused regression checks during implementation. Root runs
build, npm test, check:arch, check:rule-behavior and applicable existing UI checks
on the integrated candidate after the active writers release inputs. Reuse valid
evidence only for unchanged inputs. Fresh-origin populated browser journeys at
both desktop targets/font sizes: inspect item/filter/action, inspect multiple
nearby subjects, open/use/return from one existing service, switch combat/idle,
and saved layout reload/Export/Import where changed preferences apply. Record
candidate hashes and screenshot paths. Browser fixtures may seed known content;
do not call them natural progression. Human visual/play acceptance remains open.

## Dispatch and later steering

Two workers started in parallel: `/root/a1_inventory` and `/root/a2_nearby`,
gpt-6.1-sol medium, bounded fresh contexts. Existing UIL7/UIL8 owners retain
reserved files. Root will integrate new hooks after their release.

Weibao's additional direction: “Consider narrowing the inventory, giving the
stuff more color based on proto 23 or better ideas, other stuff and more? I just
feel like the representation of around you is off”. A1 must visibly narrow
Inventory where content/text permit and reinforce kind/selection hierarchy.
A2 represents a place and nearby actors/services rather than equal generic
buttons; use one coherent list/detail split with place prose disclosed.

Source correction: the currently read village frame has no admitted connected
route list. Ways out is deferred rather than inventing exits, danger or travel
quotes. Keep Projects reachable in its existing canonical navigation home.

Status: integrated candidate complete for technical review; human visual/play acceptance OPEN.


## Final checkpoint

A1 and A2 were implemented by two parallel workers; root integrated and refined
the candidate after UIL7/UIL8 source release. [Final report](GRIPES_A1_A2_REPORT.md).
Build, 2,152 passing tests (3 TODO), architecture and 36 rule-behavior checks
pass. All four desktop/font inventory cases and all four native service/persistence
journeys plus combat pass. Input hashes and [verification receipt](../evidence/gripes-a1a2/verification.json)
are saved beside screenshots. The report records failed checks and their fixes.

File ownership released. No follow-up feature wave started. Live candidate:
http://127.0.0.1:19642/ (server PID 49653, tool session 41953). In-app browser open
was queued. Personal saves untouched. No commit/push. Human visual/play acceptance
is the remaining gate. Shared allowance was observed at 6% start and 9% at the
last reading, within the 11% ceiling; that is not attributed task consumption.

## Post-release plan qualification, 2026-10-18

The coordinator's final entry above releases its files. The four completed
"target/font cases" mean 1920×1080 and 1366×768 at 14px/21px, not four
viewport sizes. Under current UI_RULES, the actual MacBook viewport (about
1800×1040 CSS pixels) and 1536×864 at both text sizes are also required for
full target-set coverage. Those extra checks are not established by this audit.
Retain the existing passing matrix as its exact input-bound evidence; human
visual/play acceptance is still open. Recover final relevant inputs, including
later UIL8 edits, before reusing candidate results (AD36).

The round-2 proposed amendment is now folded as a documentation constraint.
Browser-local placement/resize preferences need reload/context/reset checks in
their actual owner; game Export/Import only proves state serialized by that
path. No new preference serialization is required to satisfy a misplaced test.
No runtime changes, rerun, worker, merge, commit or push in this qualification.

## Integration re-verification, 2026-10-19

Target viewport: desktop, 1920×1080 primary and 1366×768 floor at 14px and 21px.
Visible outcome: compact inventory with inspectable detail, Around you keeping
nearby context through service use, adjustable panels (UIL7), Condition/stat tiers
(UIL8). Deferred: mobile; the 1800×1040 MacBook and 1536×864 targets were not
re-run (implemented-unverified). Rules applied: UR1–UR49 desktop-first, AR1–AR16,
AD36 (existing checks first; no new regression added, one existing one corrected).

Leaves were already merged on this branch. Defects found and fixed:

- `src/proto23_shell.js` called `checkVisibility()` unguarded (item-detail preview
  and `fitSecondary`); it threw in the headless DOM and failed
  `crafting_native_reload`. Now uses `panel_reveal.rendered`. Browser behavior is unchanged.
- `check-gripes-a1.cjs` asserted the You column keeps its width. Since R22b You
  stacks in the inventory column at 1920 (336 vs 501 before the leaf CSS), so the
  assertion now accepts "unchanged or stacked in the inventory column". Check was stale, product unchanged.

Results on the rebuilt bundle (fresh browser context per target): `npm run build`
ok; `npm test` 2226 tests, 2223 pass, 0 fail, 3 TODO; `check:arch` exit 0;
`check:rules` PASS; `check:rule-behavior` pass. Browser: check-gripes-a1,
check-gripes-a2, check-gripes-integration (inspect, service use and return,
panel gutter, save, reload, Export, literal Import, combat), check-uil7 (after and
LEGACY_ONLY), check-uil8, check-uil8-r2 all pass with no page errors.
Screenshots refreshed under `evidence/gripes-a1`, `gripes-a1a2`, `uil7`, `uil8`.
Fixtures are seeded, not natural progression. Human visual/play acceptance OPEN.

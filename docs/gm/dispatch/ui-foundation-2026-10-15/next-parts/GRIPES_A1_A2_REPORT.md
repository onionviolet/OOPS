# A1/A2 integrated UI candidate, 2026-10-18

Status: integrated candidate implemented, rebuilt and technically verified at
the four declared cases: 1920×1080 and 1366×768, each at 14px/21px. The full
current UI_RULES target set also includes the MacBook viewport and 1536×864;
those additional checks are not established by the recorded four-case matrix.
Weibao's visual/play acceptance remains open. No commit or push made.
[Scope and ownership](GRIPES_A1_A2_CHECKPOINT.md) ·
[original complaints](../../../../reviews/CLAUDE_CHAT_GRIPES_AND_NEXT_STEPS_2026-10-18.md)

## What was wrong and what changed

F1: The populated 1920/14 Inventory occupied about 501px, while equipment slot
labels wrapped to a second line. A1 narrows the default bottom-left inventory,
reclaims space for the activity area and composes names, slots, quantities and
quality compactly. Equipment, usable items, components, books and other items
reuse existing kind tokens across native rows, category counts and item details.
Kind is distinct from quality. Saved UIL7 sizes retain precedence.

F2: Native item inspection replaced Around you and caused the upper row to grow,
leaving blank Character space. The integrated candidate uses LAYOUT_SPEC to put
idle/travel item details beside the lower activity area, temporarily using the
Journal companion space. Nearby context remains visible. Combat and expanded
service inspection retain their existing homes; Close item restores the companion.
The existing item selection, native controls and full-reference route remain.
Short inspectors scroll the complete card with a sticky action footer, rather
than clipping commands below the panel. While a stable item inspector is visible, row hover does
not open an overlapping preview over its facts or actions.

F3: Around you mixed people, stations and Projects as equal chips, then replaced
the list entirely on inspection. A2 separates admitted People and Services &
stations, discloses the native place description, and keeps stable subject/action
nodes. At sufficient actual width, groups share the overview and a selected
subject gets list/detail columns. Narrower panels use Previous/Next and a labelled
overview return. List/detail scroll independently beneath the place context.
Back/Esc restore the row's keyboard focus. Selection executes no command.
Nearby command/name text inherits the actual chosen font size; the native
generic-control 14px override is explicitly superseded on this surface.

F4: The visible Around you header had Focus/Current target control labels. The
shell now uses an observer-safe nearby summary and Around you collapse/pin labels
without changing the internal `focus` identity. Native combat still renders its
opponent board and clears the nearby summary. Projects stays in canonical nav.

## Integration and direction

Reused the existing UIL7 resizing and UIL8 Condition/stat/weather work after their
reports explicitly released source ownership. This task's two workers wrote
disjoint new leaf modules, styles, focused tests, harnesses and reports. Root
integrated imports/mounts/render/lifecycle hooks in proto23_shell/village_workspace,
the header summary in workspace_layout, one contextual placement in layout_spec,
and stylesheet links in index.html. No new main.js join, gameplay transaction,
simulation timer, secret registry or save slice.

The final layout expectations intentionally update the older R16/UIL4 assertions
that item details follow Around you. Other region assignments remain covered by
the existing tests; service and combat homes have explicit coverage.

Targets: 1920×1080 primary and 1366×768 floor, both 14px and 21px text. Mobile
remains deferred. Proto23 influence here uses the project's existing palette and
composition owners; no fresh reference-game parity or source-gameplay claim.

## Evidence

Build: `node build.js`, exit 0. Candidate served on fresh loopback origin
`http://127.0.0.1:19642/`; before rebuilt on 19641 from released UIL7/UIL8 source
before this task's hooks. Personal saves were not loaded or modified. Browser
checks use the existing populated fixture in disposable contexts; this is seeded
native behavior, not natural progression.

- `npm test`: 2,152 pass, 0 fail, 3 TODO, 2,155 total. The first routing-change run
  retained two superseded layout expectations; updated them for the intentional
  inspector-home change and reran the full suite successfully.
- `node --test tests/layout_spec.test.js tests/inventory_composition.test.js tests/nearby_context_view.test.js tests/condition.test.js tests/ui_contract.test.js`:
  26 pass. Protects the changed placement, native kind mapping, observer-safe
  projection and disappearing selection, with existing Condition/contracts.
- `npm run check:arch`: pass, existing 7 main imports/297 cyclic edges unchanged.
- `npm run check:rule-behavior`: 36/36 pass, limited to its named rule slices.
- A2 isolated view checks: all four target/font cases pass. They prove the leaf's
  split/drilldown, keyed focus, action delegation and missing-subject handling;
  native integration is a separate gate below.

`check-gripes-a1.cjs`: all four target/font cases pass, including folded-category
controls, free inspection, stable selected detail, consistent kind colors,
preserved quality, no row-hover preview over a stable inspector and an actual
native held-item Use. Inventory widths: 501→336px (1920/14), 501→415px
(1920/21), and 349→293px at both floor text sizes.

`check-gripes-integration.cjs`: all four target/font cases pass, including actual
nearby-button text size, free selection, next/back/Esc focus, a native mixing-counter
ingredient purchase, service return, keyboard gutter resize, Save/reload/Export/
literal Import and restored browser-owned sizing. The combat fixture preserves
its native opponent board and clears the nearby summary. Actual travel and
natural progression are not claimed.

[Verification receipt](../evidence/gripes-a1a2/verification.json) records commands
and results. The final full run passed after the failures below were investigated.
Harness fixes during verification: scope the collapse selector to the actual
focus module, open Inventory's existing control box when categories fold, and
settle after changing the stylesheet for before/after measurement. A genuine
floor-width error in the first inventory CSS used the wide-screen baseline
proportion; corrected it to the existing floor proportions. Visual inspection
also exposed an old high-specificity rule hiding Focus during item inspection;
the new scoped companion rule explicitly preserves it. At 1366/21, visual QA
also caught 14px nearby buttons and an item footer below its clip boundary.
Corrected the font inheritance and inspector scrolling, then extended native
checks to assert the real button font size, suppress row-hover previews over a
stable inspector and use a native held item through the short inspector. The UI
contract rejected explicit `font-family:inherit`; used the existing `font:inherit`
convention without adding an exemption. One full run also hit the unrelated R51
cooldown test, whose stub uses real `Date.now()` while asserting a very tight
ratio. The isolated named test passed, combat source was unchanged, and the final
full retry passed. No combat/test hardening was added to this UI scope.

Screenshots and machine-readable observations:
[combined evidence](../evidence/gripes-a1a2/) ·
[inventory evidence](../evidence/gripes-a1/) ·
[A1 worker report](GRIPES_A1_REPORT.md) · [A2 worker report](GRIPES_A2_REPORT.md).
Input identity is recorded by before-inputs.json and candidate-inputs.json in
the combined evidence directory; dirty input hashes, not HEAD alone, bind proof.
Baseline snapshots were refreshed after existing writers released their inputs.

## Remaining acceptance and limits

Weibao's visual/play acceptance remains open. This is a reversible candidate,
not acceptance of every palette proposal. Ordinary desktop behavior is the target;
mobile and special display palettes/hardware interactions have no new claim.

Ways out, spatial maps, schedules, attention dots and new simulation mechanics
remain deferred. The currently supplied frame has no admitted exits, so the UI
does not manufacture travel quotes, danger or routes. Service entries come from
the existing public frame; their data completeness is not a new world simulation.
Old-save compatibility remains deferred; new display behavior reuses the existing
browser-owned placement and native game save paths.

## Post-release evidence scope, 2026-10-18

The plan audit folded PA2-F1 into the released checkpoint. Earlier pass counts
and screenshots remain dated evidence for their exact candidate. This document
edit does not verify the additional viewport cases, later UIL8 inputs or human
feel. Browser-local layout preferences and native game-save persistence remain
different owners; use their actual serialization/reload paths when selecting a
persistence check. No passing test is retracted or broadened by this correction.

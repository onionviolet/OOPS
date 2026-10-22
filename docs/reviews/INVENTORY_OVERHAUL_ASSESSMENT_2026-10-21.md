# Inventory overhaul assessment, 2026-10-21

**Later instruction:** Weibao selected implementation, combined Electron delivery, merge and push. The [current execution owner](../gm/dispatch/inventory-overhaul-2026-10-21/CHECKPOINT.md) supersedes the proposal-only boundary below; this assessment is retained as starting evidence.

Execution owner: [matched desktop comparison](PROTO23_DESKTOP_COMPARISON_2026-10-21.md).
Direction: AD40, UR12/21/27/34/45/49/59–64; preserve native owners under AR3/6/7.
Target: desktop1920×1080,1800×1040,1536×864 at14px and21px.
Mobile remains deferred. This is a current coverage assessment and proposed next
slice, not a claim that a whole inventory overhaul is delivered or accepted.

## What is already in the combined Electron release

F1. Native categories with stack/unit counts, search, sorting, favorites, explicit
empty states and remembered view choices. Search and tabs filter the native rows;
these are not a parallel inventory. See `src/inventory_tabs.js`,
`src/ui_components.js` and `src/shell_control_boxes.js`.

F2. Stable item inspection, exact variant actions, direct worn-slot inspection,
ordinary equipment comparisons, keyboard/context actions and loadouts already
exist. Book/component/equipment kinds receive native-derived captions and colors.
See `src/proto23_shell.js`, `src/inventory_composition.js`,
`src/equipment_comparison.js`, `src/row_context_menu.js`, `src/loadouts.js`.
The inspector is not simply a hover tooltip, and current comparisons are not absent.

F3. A paired carried/chest exact-stack view and native quantity/transfer commands
already exist. Current proof includes deposit, withdrawal and equipment persistence.
See `src/storage_comparison.js` and the earlier six-case Electron receipt.
The native expanded inventory route also exists; another expansion controller or
stock cache would duplicate it.

## What is still missing from an overhaul claim

| Code | Gap and consequence | Proposed bounded implementation / done check |
| --- | --- | --- |
| I1 | Dense-stock evidence was missing. Previous mid/crowded performance fixtures each held only five inventory keys, despite their other system complexity. That did not establish variant-heavy inventory usability. | ACT NOW: exercise actual native quality variants on the released frozen build at all six desktop/text combinations, search and inspect exact variants; save screenshots/measurements. This review does that, not a claim of natural acquisition. |
| I2 | “Usable” combines books and consumables; “Other” combines materials, components and loot. Individual detail captions distinguish some types, but the navigation does not expose each useful native kind directly. | LATER: add optional kind facets over existing metadata and native categories; retain counts/search/favorites and keyboard focus. Medium effort, implementation lane. Done: mixed known stock, empty/no-match recovery, tick/reload stability and21px desktop proof. |
| I3 | Similar names across many quality variants still require repeated inspection. Search matches names, not an explicit quality/condition criterion. A compact list and an expanded workbench need different useful density. | LATER: refine existing expanded view with aligned known quantity/quality/condition facts and exact selected-variant comparison. Preserve the deliberately narrower compact inventory and useful Focus space. Medium effort, UI lane. Done:30+ distinct keys, last-row keyboard selection, sort/filter changes, stable inspector and no row/action collision at21px. |
| I4 | Structured equipment explicitly declines item-only comparison because fit, coverage, custody and condition affect the worn result. A generic bigger-number score would be misleading. | ACCOUNT FOR NOW: retain the truthful explanation. LATER: project the actual effective worn result through the existing body/equipment consumer, including blockers and unknown facts. Substantive judgment plus runtime lane, medium/high effort. Done: two same-role candidates with different fit/condition, pure inspection and actual equip result agreement. |
| I5 | Current per-stack quantity/transfer controls do not establish a complete multi-selection stock workflow across carried/chest/party/cargo ownership. | LATER: compose existing transfer/quote owners for a bounded carried↔local-chest batch action first; show exact holders, reserved/equipped/favorite constraints and revalidate before mutation. Medium/high effort, runtime lane. Done: stale selection, partial capacity, cancel and reload preserve exact stock without duplicate movement. Broader party/freight routing remains its own owner. |

## Adjacent details to retain

ACCOUNT FOR NOW: known-only item facts and per-holder custody, keyboard target
identity through redraw, search/category counts that state what they count,
inspection without mutation, and controls that remain useful at larger text.
The current inventory narrowing was intentional in
[gripes A1/A2](../gm/dispatch/ui-foundation-2026-10-15/next-parts/GRIPES_A1_A2_REPORT.md);
“overhaul” is not authority to consume all Focus space or replace native owners.

LATER: richer mixed-stock scenarios should add worn/damaged and named variants,
books/components, merchant/chest context and meaningful long names. The current
quality-heavy review proves a specific pressure case, not every inventory state.
No new category taxonomy, bulk transaction mechanism or item power score is
accepted by saving this assessment. The useful next slice is I2+I3 on the existing
expanded view, followed by effective structured comparison and owner-aware batch
operations when their actual consumers are ready.

## Evidence

[Dense-stock receipt](proto23_desktop_2026-10-21/inventory/receipt.json) and adjacent
screenshots use31 native stacks, including29 quality variants of ordinary pants,
plus food/material stock. [Runner](../../scripts/playtest/inventory-crowded-review.mjs).
[Combined delivery](proto23_desktop_2026-10-21/integration/main-receipt.json)
identifies the actual normal Electron build. Existing full equipment/storage
journeys remain in the matched-comparison report. All six cases pass search29→1→29, exact last-variant inspection and horizontal
containment. Fully visible variant rows at1920/1800/1536 widths are24/23/17
at14px and7/6/5 at21px. Source evidence establishes
current capability boundaries; human play/visual acceptance remains open.

# Will the UI design become modular? More to consider, 2026-10-17

Weibao during R21: "Will UI design become modularized? more to consider?" Codes UM1–UM10, unused
elsewhere. Extends the [Ground-up restructure](round-15-whole-plan.md#ground-up-restructure-more-to-consider-2026-10-16)
pass (GU1–GU8) and the [R21 feedback](r21-feedback-2026-10-17.md) (BX). Proposals unless marked.

**Answer:** yes, and it is partly there. Panels already register through one kit and one registry,
layout decisions live in one spec, and R21 adds movable boxes, named slots and one shared control
box. What is not modular yet is the styling (about 310 rules in `styles/ui_tokens.css` keyed to
panel IDs and native element IDs) and a few hard-coded lists in the workspace host.

## Where it stands (read from source, 2026-10-17)

| Layer | Modular today | Still fixed |
| --- | --- | --- |
| Panels | `definePanel` (`src/panel_kit.js`) registers 13 modules' panels with role, discovery, eligibility, empty text and panel settings | Several panels read native DOM instead of a projection (GU8, NX22) |
| Placement | `src/layout_spec.js` names regions, boxes (R21), slots (R21), companions per context, top-row fit | Grid areas and column fractions are CSS (`ui_tokens.css:641–643`); region list and DOM order are hard-coded in `mountWorkspace` |
| Controls | `src/ui/control_box.js` (R21) is one component for Inventory, Reports, the bar's Menu and More | Skills, Quests and Crafting strips are still per-panel (CTL1, UX24) |
| Chrome | `src/game_bar.js` (R21) owns the bar and moves native nodes with placeholders | The native footer and nav remain the source nodes |
| Styling | Tokens (`--p23-*`, `--ui-*`) for color; one stylesheet per round since PP3 | Panel look is keyed to IDs per panel; no per-box skin contract |
| Preview | `ui-preview.html` mounts real panels on fixtures (R17) | Fixtures are hand-built per round |

## ACT NOW (done in R21)

| Code | Evidence | Done |
| --- | --- | --- |
| UM1 | **stated:** R21's first draft kept the box-to-lead-panel map in both `layout_spec.js` and `workspace_layout.js` | Boxes declare `lead` in the spec; the host derives its map. One authority (AR3) |

## ACCOUNT FOR NOW (constraints on the next rounds)

| Code | Consideration | Proposed default, dial and reason | Done check |
| --- | --- | --- | --- |
| UM2 | **A box is the unit of design.** Players already move boxes (MB1); styles still target panel IDs and regions | New styling targets a box's role (`data-panel-role`, the spec box) and shared anatomy (header, rows, control box), not its ID or region. A box looks the same in any slot | Move Inventory to the top row: same header, rows and control box styling as at home |
| UM3 | **Slots, not hand-placed regions.** The grid is five CSS areas | The spec owns each composition's grid (areas, column shares, min widths, WX12) and the host writes it as CSS variables; CSS keeps one generic rule. Contexts (idle, fight, merchant, reading) choose a grid by name | A test composition with a sixth region needs no CSS edit |
| UM4 | **Region list and Tab order from the spec.** `mountWorkspace` hard-codes `['player','focus','inventory','actions','log']`, which is also the Tab order (MB9) | The spec lists regions in reading order; the host builds them from it. Changing order changes Tab order on purpose, with a check | Spec reorder in a test moves Tab order and nothing else |
| UM5 | **One control vocabulary.** Control box, tabs, toggles and row buttons | Every new strip uses the control box or the shared tab strip; the census counts one-off controls so the number only falls (CTL1) | Census count of bespoke strips per round |
| UM6 | **Panels read projections.** Native-DOM readers break when the native markup moves | New panels read registry projections (AR8, GU8); old readers convert when touched | A panel works in the preview from a fixture projection with the native node absent |
| UM7 | **Worlds and cheats bring boxes as data** (GU7, WB5) | A world pack names a box, its lead panel, its slots and its skin tokens; the host places it with zero layout code | A test pack adds a companion to one slot with no host edit |

## LATER / DELEGATE

| Candidate | Level / effort | Trigger and done check |
| --- | --- | --- |
| UM8: lift grid areas into the spec (UM3, UM4) | Strong, medium (shared host) | Next structural round, before context compositions beyond idle and fight. Done: check-r17-identical style proof that the default grid is pixel-identical before and after |
| UM9: style contract per role (UM2) | Strong, medium | With R24 polish; move ID-keyed rules for moved boxes onto role selectors. Done: ID-keyed rule count in `ui_tokens.css` falls and the moved-box screenshots match |
| UM10: box gallery in the preview | Balanced, small | After UM2. The preview lists every box in every slot at the target set from fixtures, so a new panel is reviewed without playing to it. Done: one page shows each box at 1920 and 1366 |

## Evidence limits

Counts come from `grep` over `styles/ui_tokens.css` and `src/*.js` at the R21 branch. Nothing in
ACCOUNT FOR NOW or LATER is built.

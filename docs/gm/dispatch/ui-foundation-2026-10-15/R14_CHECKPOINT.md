# R14 checkpoint, 2026-10-15

Owner: Codex chat 01a142a5-3a62-7c12-b07b-ae846d45528a. Candidate proposal, visual acceptance open.

Recovered branch codex/gameplay-foundations, HEAD 58b34e6a0 (R1–R11), ancestor 94f5059a5 (R12). R13/dedupe dirty as expected. Other lanes' dirty files preserved. Live Codex listing shows reconciliation idle; continuation reservation released; NAV/Shell handoff releases and R13 report recovered. No new runtime worker launched. Source reservation for this slice: src/display.js, styles/crafting_detail.css, task harness/docs; shared build outputs only during rebuild/freeze. No main/save/clock/simulation/combat changes.

Before source edit: rebuilt working tree, frozen before runtime at ~/.codex/candidates/yair-ui-r14-before-2026-10-15; baseline source hashes in evidence/r14/baseline-inputs.json. Matrix extends check-r13-sweep.cjs, synthetic fixtures only. Current baseline served 19255.

## Scope and acceptance

P1 / B5: make native item-recipe readiness visible in the list without selecting every row. Surface: place-service task in existing Crafting home, shared center controller and R13 yield untouched. Targets: 1366×768 at14/17.5/21px and1920×1080 at21px. Visible outcome: available attempt count or observer-safe blocked summary alongside each unlocked recipe; readable names, native output quantity separate; Craft/Back remain reachable. Counts are attempts, not guaranteed outputs. Inspection changes no native state. Rows refresh after craft, filter, station and inventory changes through existing status owner.

Keep K1–K9, selected recipe, keyboard navigation, Makeable now, explicit native guarded Craft, unknown-name boundaries, Reports and default/Existing layouts. No new recipe model/store, category system, navigation manager or knowledge grant.

Deferred: category filters, inventory tabs, equipment fitter, log enrichment, station-tab redesign, global nav grouping/labels and Settings reflow. After matrix/ranking, source change remains bounded to P1; findings may revise priority before editing. Technical gate: matched before/after, counts agree with native detail and changes after explicit craft; blocked inspection unchanged; unknown names absent; required regressions and clean-export full suite. Human visual/play acceptance remains open.

## Technical close

[R14 report](R14_REPORT.md) records completed matrix,64matched pairs and playable frozen candidate19256. Native readiness/refresh/knowledge checks pass at all4sizes; required regressions and clean-export full suite pass. Source ownership released, human acceptance open. Next ranked P2/A5+B8; no commit authorization.

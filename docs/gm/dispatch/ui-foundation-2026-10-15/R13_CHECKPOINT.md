# R13 regions with a job (Claude)

2026-10-15. Approved by Weibao ("then start R13") from
[PARITY_INTENT](PARITY_INTENT_2026-10-15.md) B1 + B2 + B11. Foundation committed first
as `58b34e6`. One writer (this session); no workers.

## Trigger and evidence

Top-bar sweep at 1366×768 14px, populated save, R12 frozen build
([sweep.json](evidence/r13/sweep/sweep.json), screenshots local):

| ID | Finding |
| --- | --- |
| S1 | Every destination except Stats opens in the 216px lower-center pane: Inventory needs 616px, Settings 744, Journal family 348. "Around you" above stays empty |
| S2 | "Around you" is empty at idle because `village_workspace.js` redraws Focus only when its content signature changes, and the signature omits the presentation. The first render runs before the Proto23 shell flag is set, so the place overview is never drawn |
| S3 | Inventory nav pulls the list out of its own visible left panel into a cramped center box; the left panel goes blank |
| S4 | Expanded panels show "Return" (the relabelled Expand toggle) beside the "← Village" Back bar: two backs (UR9) |
| S5 | Native area progress exists (`enemy_count_div` "Enemy groups left", `clear_count_div` "Clears") but is not on the opponent panel |

## Scope

Write paths: `src/village_workspace.js`, `src/center_modes.js`, `src/workspace_navigation.js`,
`styles/ui_tokens.css`, `styles/crafting_detail.css`, rebuilt `index.html`/`dist`, this
directory. No main/save/clock/simulation/combat-engine edits.

1. **B2** Idle Focus shows the place card: name, description, known people and things
   as inspect chips. Fix S2's signature.
2. **B1** One rule: while a center task or reference is open outside combat and Focus
   has no subject, Focus yields and the task takes the full-height right-center column;
   Inventory widens. Replaces R12's Crafting-only rule.
3. **S3** Inventory nav focuses the visible inventory in place; Expand still offers the
   full view.
4. **S4** Inside the center view, the header Expand/Return toggle hides; the Back bar is
   the one way back.
5. **B11-lite** Opponent toolbar shows native "groups left" and "Clears" when present.
   Trip tally (loot/XP per trip) is deferred: it needs a log projection.

Target 1366×768 at 14/17.5/21px and 1920×1080 21px. Mobile deferred.

## Acceptance gate

Rebuilt fresh origin: idle Focus shows place and people; selecting a person swaps in the
subject and Esc returns the place card; every sweep destination gets ≥ 2× its R12 height
with no page scroll; Inventory nav leaves the left list in place and focused; one Back
control per view; three-enemy fight keeps cards and shows native progress text; leaving
any view restores the original grid; inspection changes no native state; R11 fit/modes
and R12 journey still pass.

## Result

Implemented and verified; see [R13_REPORT](R13_REPORT.md). Candidate on 19253, human
acceptance OPEN, not committed.

# R22c checkpoint: fill the center and color the inventory, 2026-10-18

Weibao's go: "Yes, build R22c on top of R22b, then show me before merging." Plan row R22c, FC1–FC19
in the [Round 15 plan](next-parts/round-15-whole-plan.md#fill-the-center-and-color-the-inventory-2026-10-18).
Same branch as R22b (`claude/ui-r22b-screen-use`, on top of `1cee63d31`), so both merge together.
Rules: UR11, UR17, UR37, UR52, UX18 (FC13 dial); AR1, AR3; AD36. Targets as R22b; mobile deferred.

## Scope

| Code | Change |
| --- | --- |
| FC11 | Names only on rows and log lines; Appearance setting *Opponent letters* off (default), on hover, always. Rows ordered by kind, then slot |
| FC12 | Hovering a combat line highlights its opponent's row (current wave only), and a row highlights its lines |
| FC13 | With letters off, adjacent same-text lines from one kind collapse to ×N; the list names each occurrence ("Wolf rat 2 of 3") |
| FC2, FC14 | Fight top centre splits: Target card (name, HP bar, cycle, facts) and Encounter (opponents, defeated, groups left, clears; the full tally is R22d) |
| FC3 | Fight: Stances under the actions in the left column |
| FC4 | Idle: a selected item's detail opens beside the actions instead of over Around you |
| FC5–FC7 | Inventory tabs in their kind colors, a "new" marker (browser-local seen set), inventory region tint |
| FC17 | A fight opens Inventory on Usable and restores the idle tab after |

Not in scope: R22d Encounter tally (FC15, FC16, FC18), save format.

## Failure scenarios

8-mixed fight: log lines must not lose countability (×N list = events); hovering never moves rows
(UR52); 1366 floors no page scroll; check-r20/r22/r22b updated only where the change is deliberate.

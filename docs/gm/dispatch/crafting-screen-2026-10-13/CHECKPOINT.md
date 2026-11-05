# Crafting screen checkpoint (2026-10-13)

Owner: Claude Code session (coordinator) for Weibao. Workers are this
session's subagents. Owned paths: GOAL.md Constraints. Gate frozen in
GATE.sha256 (copy in coordinator scratchpad); proved failing on current code
for the intended reasons (C9 tightened to fail without a detail). Fixtures use
one documented save edit standing in for clearing Infested field (fixtures
README). No commit. Next goal after this: settings pass.

## Complete 2026-10-13
Worker passed C1-C9, then stopped on a session rate limit before the full run.
Coordinator ran full `check.sh` after the last edit: exit 0, C1-C9 PASS, Vivid
regression 10 items PASS, npm test 609/609 (other writer fixed the old
baseline failure). Gate manifest unchanged. Coordinator visual check at
1366×768 (Vivid, Woodworking): list beside detail, blocked reason and missing
row in blocked color, Craft with 5/10/All together. Polish noted: the detail
column scrolls internally and cuts the XP line at 1366×768. Deferred by the
worker: component/equipment recipes keep their in-row pickers (detail hidden
there); equipment crafts still skip the receipt. Files: new
src/crafting_detail.js, styles/crafting_detail.css; src/display.js,
src/crafting_visibility.js, src/work_ledger_system.js, src/workspace_layout.js,
index.html. Interaction change for Weibao's review: click selects, Craft
button crafts. No commit.


## Current source follow-through, 2026-11-04 (B87)

The [research map correction](research/CRAFTING_MAP.md#later-checkpoint-and-current-selected-source-2026-11-04-b87) reconciles the initial no-detail/partial-output/equipment gaps against later selected source. Equipment’s missing receipt is no longer a current source claim; that does not rerun this checkpoint’s C1–C9, native transaction failure or present UI geometry. The recorded Infested-field substitute remains a declared fixture, and old viewport/test totals remain tied to their bundle. Human review is optional under AD42; the old next-settings suggestion is not current runtime authorization (AD32/AD36).

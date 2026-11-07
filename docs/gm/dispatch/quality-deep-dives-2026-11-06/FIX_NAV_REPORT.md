# FIX_NAV report (2026-11-07)

CHECKPOINT: done for the four named controls (desktop-first). Title-only 3 -> 0 on village, book.hp.school, lotm.probationer. Nothing committed; `dist/` not rebuilt.

Claims (CLAIMS.md, NAV): src/workspace_navigation.js (OPENINGS's one-line mixing-label edit left intact), src/locked_control.js (new), styles/ui_tokens.css (appended rule), src/proto23_shell.js (Latest only), src/workspace_layout.js (collapse/hide only), src/workspace_views.js (jump only), tests/locked_control.test.js (new).

## Mechanism (UIV1, UR62, UR52)
A native `disabled` button cannot be clicked or focused, so it cannot answer. Locked controls now use `aria-disabled="true"` plus `data-disabled-reason`; the owner's handler returns early and calls `sayReason`. Focus also says it. The reason shows in one polite `role=status` line (`#ui_locked_reason`, `position:fixed` under the control, clears after 6 s or on blur), so no neighbour moves. The tooltip still repeats it.

## Fixed (SHOWN: headless click, then read the status line)
- Nav "Crafting" (workspace_navigation.js): click shows "No crafting station is available here. Reach one, or finish the conversation first." Mixing and module-locked routes use the same path (their own reason). Alt+key skips locked routes as before; pane buttons and the overflow list mirror the lock.
- "Latest" (proto23_shell.js): at the newest message it is locked, click shows "You are already at the latest message."
- "▾" collapse and Hide on critical panels (workspace_layout.js): click shows "Vitals stays open so you can always see it."
- "Open local controls" (workspace_views.js): click now also says "Opened local controls. The first action there has focus." (or the waiting-response line, or "Nothing here is ready to act on yet.").

## Checks
- `node scripts/check_feedback.mjs --probe-disabled --start village`: 5 sampled, 5 inline, 0 title-only (was 3). book.hp.school: 12/12 inline. lotm.probationer: 12/12 inline.
- `node --test tests/locked_control.test.js tests/feedback_check.test.js tests/ui_components.test.js tests/observer_view.test.js tests/ui_contract.test.js tests/headless/lotm_dose_label.test.js`: pass.
- `tests/headless/npc_calendar.test.js` and `village_wave2.test.js` (2 tests): fail with "No clickable element with text village elderVillage neighbor" in scenarios.mjs prepareVillage. INFERRED not mine: NPC name text, and the NAMES lane has uncommitted edits to src/data/npcs.js. Not confirmed against a clean tree.

## Left
- The probe counts `data-disabled-reason` as inline, so it sees the lock statically; the words appear on click/focus, not persistently, because the nav is one nowrap overflow-hidden row. A persistent per-route note would need a bar layout call.
- Not exercised in a browser pane (headless only); rebuild needed before `dist/` shows it. Mobile deferred.

# FIX_FEEDBACK report (2026-11-07)

CHECKPOINT: partial. Four real defects fixed and proven headlessly; the rest classified as policy artifacts or left with reasons. Baseline updated, backlog regenerated. lotm.* traces could not be re-recorded (see Left). Nothing committed.

Claims: scripts/check_feedback.mjs, src/proto23_shell.js, src/main.js, src/lineage_domain.js, tests/feedback_check.test.js (all FEEDBACK in CLAIMS.md). All were clean in git before I edited, except check_feedback and its test (new files of the FBK lane).

## Fixed (SHOWN: reproduced with scripts/headless/runner.mjs, then re-run)

1. Equipment slot press with a center view open (mixing counter, dialogue, trade). Before: the Item details dock was hidden, so "head · Empty" changed nothing on screen (only the hidden panel title). After: the press opens the details as a center view, the route "Full item ›" uses. Player now sees: "head slot · empty", "Empty · head", "No carried equipment fits this slot. Find or buy fitting gear, then inspect it here.", and a "← Village mixing counter" back button. In the plain dock the same text appears in place. src/proto23_shell.js `chooseSlot` / `showDetailsIfHidden`. Both slot buttons (worn summary and slot grid) use it.
2. "Tools" disclosure opened to nothing. Cause: the shell read only `#character_equipment_div`, but axe, pickaxe, sickle, shovel and fishing rod slots sit in `#character_tools_div` (index.html:713). src/main.js read(): selector now includes both. Player now sees after opening Tools: "axe · Empty", "pickaxe · Empty", "sickle · Empty", "shovel · Empty", "fishing · Empty"; pressing one shows its slot detail. A fallback line "No tool slots on this body yet." covers an empty group.
3. "Full item ›" in the hover preview footer was silent in all starts. Cause: the closed popover stayed in the tree (the headless DOM does not model `:popover-open`), and its handler does nothing without a hovered row. Real players cannot reach it closed. Fix: `preview.hidden` is true while closed, false while shown. The Full item button inside the Item details pane (real control) was checked: from the dock it opens the center view with "← Village".
4. "Test this body's latent circulation affinity · 6 coins" (Family qualities) was enabled with no chronicle and a click showed nothing (the notice rendered after an early return). src/lineage_domain.js: with no chronicle the button is disabled and the status reads "The test waits for a life chronicle."; when coins are short the status adds "The test costs 6 coins."

## Policy artifacts (not fixed in the game, check not changed: FBK_REPORT names none of these as a false-positive class)

- "Other known panels" = cultivation-insights, research, gear-workshop, shell-detail: the options are disabled in a real select and carry their reason in the text ("Research · Ask around for someone to teach you"). The trace's `fill` bypasses `disabled`. Proposed hunk for the PAC owner of trace.mjs line 315: add `&& !o.disabled` to the panel filter. Village cultivation-insights does open ("← Village").
- "Actions" (scene-local tab): the only visible tab, already `aria-pressed=true`; re-pressing a selected tab is a no-op. "Here" (nav button for the view already shown), "Practice" notebook tab (answers when not selected: "Years & company"), attribute row "Strength" (already the selected row): same class, re-selecting the chosen item. FBK3 dial says such a no-op names itself; the pressed state is the name. Not changed.
- "legs · <item>" worn-item buttons: two buttons for one slot, the second re-selects the same detail.

## Left

- "Open local controls" (workspace_views.js): its answer is focus and scroll, which the trace cannot see.
- Nav bar "Crafting" disabled with the reason in `title` only (FBK4 probe finding, plus "Latest" and the "▾" collapse). Needs a layout call in the bar; owner workspace_navigation.
- New leads from the changed policy path, not hand-checked: trader item rows and conversation "Open to review" summaries in village and soldier.p01, "Show me" button. Baseline records them.
- lotm.* fresh recording errors in the current tree (another session's edits; log in scratchpad), so the lotm baseline entries (including slot buttons and Tools) come from older traces. Hand probe in lotm.probationer shows the slot press now answers ("arms slot · empty ... ← Tingen workroom"). Re-record after that tree settles and run `--update-baseline`.
- Reproduction note: the old village slot silence did not reproduce in a plain dock; it reproduced only with a center view open.

## FBK4 probe (new, in check_feedback.mjs)

`node scripts/check_feedback.mjs --probe-disabled [--start id]` boots a start, samples up to 12 disabled controls, attempts a click, and classifies where a reason shows (inline / title-only / none). Pure `disabledReasonKind` exported and tested with fake nodes. Result on village, book.hp.school, lotm.probationer: 29 sampled, 26 inline, 3 title-only (Crafting, Latest, ▾), 0 none. Not ratcheted.

## Checks

- `node --test tests/feedback_check.test.js`: 9 pass (+ new probe test; count shown by runner earlier as 10 with the headless file).
- `node --test tests/headless/feedback_controls.test.js` (new: preview hidden, Tools slots, slot in dock and in center view): pass.
- `node --test tests/shell_composition.test.js tests/shell_item_description.test.js tests/shell_strip_boxes.test.js tests/lineage_traits.test.js`: 23 pass.
- `node scripts/check_feedback.mjs --update-baseline --backlog`, then plain: 15 starts, 43 flagged controls, 0 regressions. Gaps: the 30 pre-update "regressions" were newly reached presses (policy path shifted), not caused by these edits.
- Not run: npm run build / npm test (coordinator).

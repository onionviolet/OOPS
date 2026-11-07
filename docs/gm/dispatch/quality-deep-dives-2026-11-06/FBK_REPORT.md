# FBK report: feedback after every action (2026-11-06)

CHECKPOINT: done for the trace part and the rulebook. Static refusal scan skipped (reason below). Nothing committed.
Rules: [FEEDBACK_RULES](../../../FEEDBACK_RULES.md) (FBK1-FBK8, proposed). Backlog: [FEEDBACK_BACKLOG](../../../feedback/FEEDBACK_BACKLOG.md).

## Sweep (SHOWN: I ran it)

- 15 starts, trace params seed 1, 100 actions, 960 game minutes, dt 10 (the shared PAC cache; the lotm.* traces that had
  errored were re-recorded after the PAC enrol fix, all 15 now end ok). 1,472 presses classified.
- Per press: about 55 visible, 6 weak, 0 state-only, 0 refused; the rest silent. Silent is high in book starts (up to 71 of 100)
  because the policy presses scene chrome and re-presses; read "silent" as "no new text, no Reports line", not "dead control".
- 25 controls flagged (no press of them was visible) across the 15 starts; 0 generic acknowledgements ("Done." and kin);
  0 shared lines (one line from 3+ controls). Findings are rolled up by control, many repeat across starts.
- Refusals: 0 in every trace. The policy presses only enabled controls, so refused-with-reason and refused-silent are NOT measured
  by this sweep. A hand or scenario route (press a disabled control, a too-costly buy) is the open gap for FBK4.

## Hand checks (before claiming)

- Crafting recipe rows (`[data-recipe_id=...]`, 17 silent in the first trace): SHOWN by code (display.js, "components" rows):
  the handler acts only when the click lands on the name or icon, and the policy clicks the row. Policy artifact, now filtered.
- Headings, paragraphs, `div.message_common` Reports lines, `#ui-disabled-N` notes, `#..._div` containers: the menu lists any
  `[tabindex]` element. Filtered as artifacts (`ARTIFACTS` in the script, with reasons).
- Time-driven buckets (`dnd_phandalin`, `active_effects`, `expansion`, `economy_standing`) changed on nearly every press
  (293 false "state-only" steps before the filter), so they count as passive.
- "Full item ›" in the Village (hand): the click changed only the clock text and wrote one time line. Confirms the trace.
- "Actions" (hand, Village): opens a shortcuts panel (13 new blocks), but the book-start traces show it silent. Not reproduced
  in a book start; treat backlog row 2 as a lead, not a defect.
- Equipment slot buttons ("arms · Empty" and kin): silent in the trace; in the older bundle SHOWN by code that the slot had no click
  handler, only a hover tooltip (display.js update_displayed_equipment). Not re-checked on the new buttons.
- Panel opens (cultivation-insights, research, gear-workshop, shell-detail): silent in book traces at panelDt 1. Not hand-checked;
  could be a deferred render. Lead only.

## Files written

- `scripts/check_feedback.mjs`, `scripts/feedback_baseline.json`, `docs/FEEDBACK_RULES.md`, `docs/feedback/FEEDBACK_BACKLOG.md`,
  `tests/feedback_check.test.js`, this report. Scratch scripts stayed in the session scratchpad.
- Uses `check_pacing.mjs` exports (`traceFor`, `PARAMS`, `parseJsonl`) and reads any cached trace of matching params from
  any bundle build (`--fresh` forces the current bundle). Did not touch trace.mjs or any PAC/OPN file.

## Check and test

- `node scripts/check_feedback.mjs`: 15 starts measured, 25 controls without a visible answer, 0 regressions, exit 0 (cached traces,
  seconds; first run records missing traces, about 5 minutes each).
- `node --test tests/feedback_check.test.js`: 9 pass (classes, flagging, artifacts, key masking, errored trace pending, ratchet,
  backlog ranking and hash-only book text, baseline shape, cached traces pass against the baseline).

## Static part: skipped

About 500 lines in src/ set `disabled` or aria-disabled in many shapes (title, a sibling reason node, `data-disabled-reason`,
a pinned box). A regex cannot tell a missing reason from a sibling that carries it, so precision would be low. A precise route
needs a runtime probe: press each disabled control's quote path. Proposed as a later lane, not check:rules.

## Proposed owner hunks (coordinator applies)

- package.json scripts: `"check:feedback": "node scripts/check_feedback.mjs"`, `"check:feedback:update": "node scripts/check_feedback.mjs --update-baseline"`.
  Game-driven, so not in `check:rules` (AD36).
- RULES_INDEX: register FBK1-FBK8 and a router row "Feedback after an action: FEEDBACK_RULES".
- UI_RULES: no new row; FEEDBACK_RULES links UR35, UR57, UR62, UIV1, UR73 instead of restating them.

## Top five backlog items (by presses met, then starts)

1. "Full item ›" (button, 15 presses, 15 starts incl. Village): changes only the clock. Needs a visible result or a reason when nothing is selected (FBK3, FBK4).
2. "Actions" (button, 13 presses, 5 book starts, first step 1): silent in book starts; opens shortcuts in the Village. Check in a book start (FBK3).
3. Panel opens `cultivation-insights` and `research` (8 presses each, 8 starts): no new text on open (FBK1, FBK7). Possibly deferred render.
4. Equipment slot buttons ("arms · Empty", ring, weapon, off-hand, legs, feet, amulet, artifact, cape; 7 presses each, 7 to 15 starts): click shows nothing; detail lives in a hover tooltip (FBK3, UIV1).
5. "Tools" summary (7 presses, 7 starts incl. Village): expanding shows nothing new (FBK1).

## Open questions as defaults

- Raise the policy's press budget or add a work-aware route for book starts: default yes, owned by PAC (they share the recorder).
- Add a scenario probe for refusals (disabled controls and unaffordable buys): default later lane, would also carry the static idea.
- Treat the 5 lotm starts as one for ranking: default yes, they share the same first 90 presses of scene chrome.

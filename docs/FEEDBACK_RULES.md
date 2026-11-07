# Feedback rules

Proposed 2026-11-06 (AD32); run authorized by Weibao, lines not yet accepted.

Every click should answer back: a Reports line, a number moving, a panel opening, or a reason when the
game says no. These lines name what counts as an answer and how the check counts silent clicks. They add
no new UI law; they point at the owners and add the measurement.

Owners and neighbours (linked, not restated): [UI rules](UI_RULES.md) UR35 (actions are explicit, native
action controls execute once), UR57 (review the journey in changing state, including failure recovery),
UR62 (local reactions follow the settled occurrence), UIV1 (a disabled action shows its reason without
hovering), UR73 (no developer words); Reports lines follow RPT1-RPT14 (RPT3 compact subject-first lines,
RPT8 written once by the settling event, RPT12 varied wording); player text follows [PROSE_RULES](PROSE_RULES.md).
Check: `node scripts/check_feedback.mjs` (plays the game; not part of `check:rules`). Recorder:
`scripts/headless/trace.mjs`. Backlog: [FEEDBACK_BACKLOG](feedback/FEEDBACK_BACKLOG.md).

| Code | Rule | Default, dial, reason |
| --- | --- | --- |
| FBK1 | **An answer is something the player can read.** A new Reports line, new text on screen, a changed visible number, a panel or choice that opens. | Default: those four. Dial: a world adds its own (a bound sigil glows, a shelf fills). Reason: a changed save path nobody sees is not an answer (PAC1 uses the same line for payoffs). |
| FBK2 | **A control that changes only saved state needs a visible face.** If a press changes the save but no line, number or panel shows it, the press is state-only. | Default: the settling event writes one Reports line (RPT8) or the number it changed is on screen. Dial: a bookkeeping press (sorting, a layout toggle) may stay quiet if its result is visible in place. Reason: the player cannot tell it worked, and a repeat press looks like a retry. |
| FBK3 | **A press with no answer at all is a defect or a missing reason.** | Default: every enabled control answers within the same press. Dial: a deliberate no-op (re-selecting the chosen option) names itself ("Already selected"). Reason: silence reads as broken (PAC7 says the same of waits). |
| FBK4 | **A refusal carries its reason where the player is looking.** | Default: the reason is inline or in the pinned box next to the control (UIV1), and the same words appear in Reports when the player pressed it. Dial: a disabled control may show only the inline reason if it cannot be pressed. Reason: a tooltip-only reason is easily missed; a refusal with no words is the worst answer. |
| FBK5 | **No bare acknowledgements.** "Done.", "OK.", "Success." and their kin say nothing the control did not already say. | Default: name the subject and the result ("The kettle is on; tea in ten minutes"), per PRS and RPT3. Dial: a one-word receipt is fine when the control and the number beside it carry the detail. Reason: a receipt that fits every outcome identifies none. |
| FBK6 | **Different outcomes get different lines.** One line produced by three or more different controls in a start is a shared line. | Default: each control writes its own wording (RPT12 pools are for routine flavour). Dial: a family of controls that really do the same thing (nudge a number up) may share one line that carries the number. Reason: the player learns what happened from the words. |
| FBK7 | **Feedback lands where the control is.** The answer appears in the panel the player pressed in, or the panel says where it went. | Default: in place, with Reports as the record. Dial: a press that opens another panel names it ("Opened Skills"). Reason: a change off screen is the same as none. Not measured by the check yet (the trace has no geometry). |
| FBK8 | **Feedback is ratcheted, not remembered.** `scripts/feedback_baseline.json` records each start's controls with no visible answer; a new one fails, a fixed one asks to retire its entry. | Default: findings keyed by start and control selector. Dial: `--update-baseline` after a real change. Reason: the trace presses each control once, so a finding is a lead to check by hand, and the ratchet keeps new ones from piling on. |

## Measuring

SHOWN by `scripts/check_feedback.mjs`. Each click, repeat and panel-open step in a start's trace is one of:
visible (a new Reports line or never-seen text), visible-weak (only seen text came or went), state-only (a
non-passive save path, money, item, skill level or unlock changed, nothing else), silent, refused-with-reason,
refused-silent. A control is flagged when none of its presses were visible, weak or refused with a reason.
Passive buckets (`levels`, `skillRecords`, `absorb_local_life`) tick on their own and never count as change.
Limits: the policy presses a control once, then lets time pass, so a flagged control may need a precondition
the policy lacks; check one by hand before changing the game. The check cannot see geometry (FBK7) or the
inline reason beside a disabled control (FBK4 is seen only when a click throws).

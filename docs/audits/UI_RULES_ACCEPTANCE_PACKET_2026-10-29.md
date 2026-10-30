# UI rules acceptance packet, 2026-10-29

Everything below is proposed and waiting on Weibao. Nothing here binds until
he says yes ([UI audit round 9](UI_DESIGN_CORE_AUDIT.md#round-9-2026-10-29-the-rulebook-itself-reconciliation-and-improvement), UIX4).
Agents cite these as "proposed" until then.

**How to answer:** "yes to all", or "yes except P3, P9" with any edits. A yes adds
the rule or wording to [UI_RULES](../UI_RULES.md), widens the
[rules index](../RULES_INDEX.md) range, and records his words in USER_VISION.

**Already binding for scenes.** SUI1-SUI19 and RPT1-RPT12 (binding defaults since
Weibao's "Sure" on 2026-10-28, CL281) already cover parts of this list for scenes
and Reports: SUI5 (untaken options say what is missing) is P8 for scenes, SUI6
(quote before commit) is P11 for scenes, SUI7 (upcoming strip) is part of P10, and
RPT6 ("While you were away" digest) is part of P6. A yes on those items extends
the scene rule to every system; it does not create a second rule. Until round 9 the
UI rulebook and its path rule did not point at SUI or RPT; the rules index and
`.claude/rules/player-ui.md` now do.

## New rules (from the [UI coverage plan](../gm/dispatch/ui-coverage-2026-10-27/PLAN.md#8-proposed-standing-rules-proposed-2026-10-27-awaiting-weibaos-yes), 2026-10-27)

| Item | Rule in one line | What changes on a yes | Recommendation |
| --- | --- | --- | --- |
| P1 · UR76 | Fill a one-page UI contract (home, shape, every state's text) before building a system's UI. | Each new system brief, cast lives first, names an existing home before any panel is written. | Recommend yes. Costs a paragraph per system; stops new screens per feature. |
| P2 · UR77 | Budget the homes in numbers: 20 routes, 5 regions, 4 center modes, about 7 Local actions, 7 tabs per route. | Adding a route or tab needs a merge or demotion and your yes. | Recommend yes with an edit: also count panels per home, and hidden panels load on first open (UIX6, 83 panels today). |
| P3 · UR78 | Rows, lines, chips and tabs inside an accepted surface are content, not a promotion. | Small additions ship without a Projects-drawer stop; new routes and Local actions still go through UR2. Also settles that tuned numbers carry no "(a proposal)" tag (UIX3). | Recommend yes. |
| P4 · UR79 | One shape per kind of information: ledger, timeline, note, policy row. | No more systems inventing their own list layout; a new shape needs two users. | Recommend yes. |
| P5 · UR80 | Overlays and debug views narrow, by default, what the player already knows. | Restates AR8 and sealed secrets for UI lenses. | Recommend yes. |
| P6 · UR81 | Stops, missed clocks and returns after absence each explain themselves in a note line. | The return note (coverage plan B1) becomes required behavior, not a nice-to-have. | Recommend yes. |
| P7 · UR82 | By default a system shows in a life once that life has something attached to it. | Book, travel and cheat layers stop appearing in lives that never met them. | Recommend yes. |

## Defaults from earlier rounds

| Item | Default | What changes on a yes | Recommendation |
| --- | --- | --- | --- |
| P8 · UIV1 | A disabled action shows its reason without hovering; a tooltip may repeat it but never holds it alone. | Tooltip-only reasons become a defect to fix. | Recommend yes. |
| P9 · UIV2 | When a system first becomes reachable, the Journal says where and the place view shows its entrance. | "All panels" stops being the sole way into new features. | Recommend yes. |
| P10 · UIV3 | Everything under way lives in one list on the work line, with time left and what travel does to it. | Timed jobs get one home (coverage plan B4). | Recommend yes. |
| P11 · UIV4 | What a preview shows is what commit does; a change in between is stated or refused. | Becomes part of the choice-row build (B3). | Recommend yes. |
| P12 · UIV6 | One shared look for known, guessed and unknown, extending UR36 beyond combat. | Assays, forecasts and inspectors use one marker. | Recommend yes. |
| P13 · UIV7 | Schedule UI review after source lanes in that area have landed. | Process line; no runtime effect. | Recommend yes. |

## Rulebook upkeep (round 9)

| Item | Change | What changes on a yes | Recommendation |
| --- | --- | --- | --- |
| P14 · UIX1 | Add a one-screen checklist at the top of UI_RULES and order the body by task. Every code and its wording stays. | Agents read twelve lines for a small fix instead of 6,840 words. | Recommend yes. Structural; codes and wording stay. |
| P15 · UIX5 | Give UR6, UR7, UR8 and UR13 a one-clause dial (for example, UR6: add a token first, then use it). | Same meaning; matches "default, dial, reason". | Recommend yes. |
| P16 · UIX7 | Evidence also names which app it ran on: dev build hash, the frozen app you play, or the screenshot mirror. | Reports say whether a fix has reached the app you play. | Recommend yes. |

UIV5 (compare visible text across save and import) is a check, not a rule, so it
is not in this packet; it stays on the round 7 LATER list.

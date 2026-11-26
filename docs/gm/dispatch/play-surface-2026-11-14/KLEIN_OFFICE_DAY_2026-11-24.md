# Klein’s office day

| Preflight | Scope |
| --- | --- |
| Reading and authority | Weibao asked to compare Klein’s shifts and Seer practice, put pay and rent in view together, and show what changed on return. |
| Ordinary route | Open Work & merit from Tingen or a Ready now shift row. Compare the desk, archives and Chanis Gate with the available Seer lessons or readings. See next week’s take-home after rent and collect pay when it is due. |
| Player words | Existing sample: “You have already worked a shift today. The office expects you again tomorrow.” |
| Mechanism and ring | Use the shift, divination, wage and standing-order owners. Show saved observer records for the recap. Record a paid rent receipt with the existing purse settlement. |
| Screen | Desktop 1920×1080. Build inside the existing Work & merit tab, using the shared kit. Fit the comparison and budget there. Other leads and mobile are deferred. |
| Failure scenario | A blocked or running activity explains itself. Rent is due on its own clock, withholding is counted before rent, and a reloaded life sees the earned recap without receiving any duplicate payout. |
| Rules | [UI rules](../../../UI_RULES.md), UR70–UR75, UR100–UR127, UR158, UR163, UR178. [Architecture](../../../ARCHITECTURE_RULES.md), AR2–AR5, AR7. [Prose](../../../PROSE_RULES.md), PRS4–PRS7. AD38, AD43, ACR4, ACR6. |

| Element | Normal | Alternate state |
| --- | --- | --- |
| Shift and practice rows | Action and duration with the existing route | Closed or blocked reason, or a route to running work |
| Pay and rent | Weekly gross, deductions, take-home, rent, remainder and both clocks | Pay available, advance cleared, no rent duty, or arrears |
| Office recap | Latest result at a glance, earlier results on request | Hidden until a result exists |

## Rebuilt desktop walkthrough

The private cast and earned checkpoint were unavailable. A composed public test cast supplied Blackthorn, the flat and the Divination Club. The developer start made the Klein life. Setup placed it at the office late in the pay week with the contract, advance and standing order in force. The game’s controls handled the lesson, shift and pay collection. A localhost clock hook advanced the lesson’s existing timer.

| Check | Result |
| --- | --- |
| FLR1 build | `npm run build` passed in the isolated Windows tree after recompiling the Ink artifact from LF source there. Bundle SHA-256 `52b5e0e00b7c8201f19388a379df4ca4aede82de9fa998e5e0e7d62c60cd60ea`. |
| FLR2 route | Headless Chromium at 1920×1080, fresh browser storage. Opened Blackthorn and Work & merit. The chart practice link focused the existing lesson control. Played the lesson, took the Chanis Gate shift across the rent and pay deadlines, and collected the first due wage. |
| FLR3 shown | Desk and archives each quoted four hours and showed their closed start windows. Chanis Gate quoted six hours. Both Seer lessons quoted 45 minutes. The running lesson showed its remaining time. Pay and rent fit in the office view with separate countdowns, 5 soli 6 pence rent, and 1 pound 4 soli 6 pence left after one week’s rent. [Comparison](../../../representations/evidence/klein-office-day-2026-11-24/compare.jpg) |
| FLR4 used | The chart lesson recorded the learned method. The shift advanced 360 minutes. Rent withdrew 66 pence automatically. Pay collection added 360 pence after the advance withholding, leaving 774 pence in the purse. The recap showed pay first when rent, shift and collection shared a minute. Earlier results retained all three preceding outcomes. [Return recap](../../../representations/evidence/klein-office-day-2026-11-24/returned.jpg) |
| FLR5 kept | Saved and reloaded through Chromium. The footer’s Export produced the file used by the Import control from a fresh origin on the same bundle. The four recap entries, 774 pence purse and one collected pay week held through both walks. |
| FLR6 review | Agent-verified on the composed route, with zero browser page errors and human visual review open. |
| Focused tests | 33 passed across office rows, wage, rent by home, Seer acting, standing orders, and panel gaps. The scoped player text scan found no new findings. |
| Architecture | The checker with Windows path normalization passed against the architecture baseline. No new cycle edges, main imports or registration lines. |
| Wider gates | `check:rules` stopped on 13 existing rules-index status and local-path problems. The Windows-adapted flow walk covered 16 routes and four additional game states on the prior candidate. It reproduced the six Connection, Settings and Skills findings from the Fang Yuan walk and kept the two baseline strays. |

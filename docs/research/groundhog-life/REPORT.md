# Groundhog Life: source audit (2026-10-13)

**Answer first.** Groundhog Life's per-skill "relearn faster" carry is already covered by our Progress Knight lane. What is new for YAIRPG is the **24-hour day as the resource** (F2): homes cost chores minutes, helpers buy minutes back, and a happiness score built from sleep, work-life balance, spending and home expectations multiplies every XP gain (F3). Close behind are **knowledge checks with deadlines inside a life** (F8), where "QM level 50 by age 28" turns a failed life into the next life's plan, and a **soft loop end** where time dilation replaces death (F7).

Findings and packets are proposals, not accepted decisions.

Labels: verified (code) = read in the public itch.io HTML5 build's JS; verified (page) = store or dev page; later build = third-party GitHub mirror of a later build, authorship unconfirmed; inferred = this lane's assessment.

| Code | Label | Finding |
|---|---|---|
| F2 | verified (code) | Day budget: 1440 minutes split into Sleep 480, Work 480, Research 0, Eat 180, Chores (set by the home), Slacking 180 and Free Time (remainder). The player moves time in 60 or 240 minute steps to or from Free Time, so the total stays 1440. XP/day = XP/h x hours. One game day is 300 ms real time. |
| F3 | verified (code) | Happiness is the sum of four parts. Home is worth up to 0.6, and the expected home quality rises one step every 5 years of age. Sleep is worth up to 0.5 at 9 h; under 4 h sets happiness to zero. Spending ratio is worth up to 0.3. Work-life balance is worth up to 0.6, scored 216/max(work+research+chores minutes, 360). Happiness multiplies energy, and energy multiplies all work and research XP. Each part has a one-line voice ("I want a nicer home.", "I'm overworked."). |
| F8 | verified (code) | Deadline gates: a year-10 (age 28) email checks QM level 50 or more. A pass unlocks the Dark Plateau career; a fail says "Level 50 required at age 28". The final chain has another deadline: firing the cannon after year 41 is "too late". There are two victory routes, cannon (kills millions) or communication (needs research level 1100). |
| F7 | verified (code) | No death. From day 15330 (age 60) each day lasts 1.0005^n times longer, capped at 10x, with a "time dilation" warning, then "Reply groundhog" restarts. Reset: money, home, job, schedule, boosts, book completion, levels. Kept: each job's and research area's best level, reread counts, achievements, story flags. A "You just turned 18. Again." banner shows for 100 days. |
| F6 | verified (code) | Research: 4 fields, one active area at a time. Each level gives a passive bonus (+1% energy, +1% research, +2% work XP, -1% slacking that compounds). Books sit in a reading-list queue, give one-off effects and unlock in a chain. A reread takes original time / (1 + times completed). |
| F5 | verified (code) | Career ladders of 9, 10 and 10 rungs. Each promotion needs level 10 in the previous rung, and some rungs also need a research level. Auto Promote is a setting. Ladder XP is spread over an intended time: 365 x XP/day x years in total, divided geometrically across rungs. |
| F4 | verified (code) | 10 homes, each with rent, upfront cost, 30 to 300 chore minutes a day and a quality score. Helpers: cleaner -60 chore minutes, servant -300, research assistant +50% research, secretary +50% work XP. Savings earn compounding investment returns. Negative money triggers austerity: research cut, back to the parents' basement, helpers fired, all free time to work, plus an alert. |
| F1 | verified (code/page) | Each skill's Groundhog Factor is 1 + best level this loop / 10. A Grand Prestige (after averting the anomaly) clears the factors, raises the loop counter and multiplies base energy by (times averted + 1). |
| F9 | verified (code) | Cooldown boosts: Caffeine 2x energy for 60 days (730-day cooldown), Organize 90/1095, Spa 120/1460, Conference 2x research for 180/1825. Unlocked by research; a notice appears when one comes off cooldown. |
| F10 | verified (code) | Offline catch-up is on by default and shows "N days left". Optional auto-pause on a new life. Autosave every 15 s, with import/export. |
| F11 | verified (code) | Returning a stranger's wallet leads to a $50,000 inheritance 10+ years later; keeping it gives $10. |
| F12 | later build | Adds Health (an age curve, a roughly 5-year moving average of sleep, food quality) and Exercise. A Minimalism perk slows the rise in home expectations. A third layer, the Loop Trap, turns the Groundhog Factor x efficiency into a permanent additive multiplier. Also a war pane, auto-promote/research/boost with a "Just Pause" option, and paused or offline time banked as Turbo ticks. The premium Market was discontinued. |
| F13 | verified (page) | itch.io 4.3/5 from 90 ratings; Kongregate 4.2. Praised as a "real life simulator"; complaints are repetition and too few careers, plus one request to speed up time. The developer rebalanced the ladders. Thin sample; Reddit was not reachable. |
| F14 | inferred | The F1 carry is Progress Knight's pattern ([open-idle-games lane](../open-idle-games-2026-10-09/PROGRESS_KNIGHT.md)), banked time is Idle Loops', and skill carry matches [Increlution P3](../increlution/IMPLEMENTATION_PACKETS.md). The reset dials in [death and reset considerations](../DEATH_AND_RESET_CONSIDERATIONS_2026-10-10.md) already cover trigger, carry and exit. F2, F3, F8, F4 austerity, F6 rereads and F11 are new. |

Packets: [IMPLEMENTATION_PACKETS.md](IMPLEMENTATION_PACKETS.md). Small touches: [SMALL_TOUCHES.md](SMALL_TOUCHES.md). Coverage and future pass: [CHECKPOINT.md](CHECKPOINT.md).

## Sources

- [itch.io page](https://mogron.itch.io/groundhog-life) and [community](https://mogron.itch.io/groundhog-life/community)
- [Public HTML5 build](https://html-classic.itch.zone/html/465947/)
- [Kongregate page](https://www.kongregate.com/games/egosummo/groundhog-life)
- [Later-build mirror](https://github.com/tcztzy/groundhog-life) (GPL-3.0 file added by the mirror owner, not confirmed from the author)

# Harry’s school day

| Preflight | Scope |
| --- | --- |
| Reading and authority | Weibao asked for one view of classes, homework, spell practice, upcoming lessons and results on return, with the whole loop tested at 1920×1080. |
| Ordinary route | A sorted Harry opens his Hogwarts day. See the class taking pupils and what follows, attend, write the homework the class leaves, and practise a learned charm. |
| Player words | Existing voice sample: “The charms master corrected your wrist and your pronunciation. You know the levitation charm now; getting a feather to rise takes practice.” |
| Mechanism and ring | Use the existing timetable, class-slot, structured work, held homework and spell owners. Read the same native action quotes and saved knowledge for results. |
| Screen and elements | Place service at desktop 1920×1080. Add a School day section at the top of the existing Harry panel. Put the primary class and feather controls there. The library, exams and advanced practice bench keep their own sections. Mobile and timetable changes are deferred. |
| Failure scenario | An upcoming class cannot start early. No homework can be written before it is assigned. In-flight work retains time and stop control after its class window closes. A completed cast updates practice and the return recap survives reload. |
| Rules | [UI rules](../../../UI_RULES.md), UR70–UR75, UR100–UR127, UR158, UR163, UR178. [Architecture](../../../ARCHITECTURE_RULES.md), AR2–AR5, AR7. [Prose](../../../PROSE_RULES.md), PRS4–PRS7. AD38, AD43, ACR4, ACR6. |

| Element | Available | Other states |
| --- | --- | --- |
| Classes | Start the class whose window is open and read the next two starts | Closed classes show day, hour and room. Running work shows the remaining time and its stop route. |
| Homework | Compare held assignments and their time | Empty until assigned, or remaining time and stop after work starts. |
| Spell practice | Quote the feather cast’s cost and current odds from its spell owner | Explain the Charms prerequisite or route to the Great Hall. |
| Return results | Show the latest saved class, homework or practice outcome | Earlier results are one disclosure away. |

## Rebuilt desktop walkthrough

The composed `hp-term-jinx` fixture began Harry’s public life through Beginning and supplied Hogwarts arrival, Sorting, the Great Hall and a Monday in term. Setup marked the public household opening complete and set the clock to 08:59. The private earned checkpoint was absent here. The game’s controls adopted the timetable and played every school action. The localhost test hook advanced the existing clock.

| Check | Result |
| --- | --- |
| FLR1 build | `npm run build` passed in an isolated Windows tree with the Ink artifact rebuilt from LF source there. Bundle SHA-256 `b3814a9016afba222215363d1d95898a17b3ca431087d677eba92b94f2c895a4`. |
| FLR2 route | Headless Chromium, fresh browser storage, 1920×1080. Opened Hogwarts, adopted the timetable, attended Charms, cast on a feather, attended History of Magic, wrote its homework, and cast a second time. |
| FLR3 shown | Charms showed a one-minute countdown at 08:59 and became actionable at 09:00. After the first 30-minute lesson, the entry window stayed open through 09:59. History was shown in progress even after its entry window closed. At 15:00 the 1-hour assignment, the feather cast quote and the next morning’s 09:00 Herbology shared one screen. [Comparison capture](../../../representations/evidence/harry-school-day-2026-11-24/compare.jpg) |
| FLR4 used | Charms taught Levitation. Both feather casts added practice. The quoted chance rose from 40% to 60%, at 1 stamina per cast. History supplied notes and one set assignment. Writing it used up the assignment and produced one marked piece. [Return capture](../../../representations/evidence/harry-school-day-2026-11-24/returned.jpg) |
| FLR5 kept | Save and reload, then the Export button and file Import in a fresh context, preserved the next class, all three recap outcomes, the marked essay, and two practice steps. |
| FLR6 review | Agent-verified on the composed route, with zero page errors. Human visual review remains open. |
| Focused tests | 48 passed, one skipped for the missing private journey checkpoint. Covers the timetable, the original lesson windows, calendar, public life, school arrival, practice and exams. |
| Architecture | The checker with Windows path normalization passed against the existing baseline. No new cycles, main imports or registration lines. |
| Rules | `check:rules` stopped at 13 existing rules-index metadata and local-path findings. The scoped player text scan found no new findings. |
| Wider UI flow | The Windows-adapted walk used the rebuilt bundle. It covered 16 routes and four additional game states and reproduced the six Connection, Settings and Skills findings from the previous lead-day walks. The two baseline strays matched. |
| Docs | `check:docs` and `git diff --check` passed. All five receipt links resolve. |

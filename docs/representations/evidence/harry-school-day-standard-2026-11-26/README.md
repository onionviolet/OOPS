# Harry's school day, November 26

In **Hogwarts > School day**, lessons, homework, spell practice and recent results use the [shared UI standard](../../../../DESIGN.md#shared-ui-standard). The framed panel adapts to its available width. Rows keep the work, terms and reasons together. Running work marks **Stop work** and shows the remaining time.

| Viewport | Before | After |
| --- | --- | --- |
| 1366×768 | [At rest](before-1366-rest.png), [active](before-1366-active.png), [ended](before-1366-ended.png) | [At rest](after-1366-rest.png), [active](after-1366-active.png), [ended](after-1366-ended.png) |
| 1920×1080 | [At rest](before-1920-rest.png), [active](before-1920-active.png), [ended](before-1920-ended.png) | [At rest](after-1920-rest.png), [active](after-1920-active.png), [ended](after-1920-ended.png) |

| Element | States on this route |
| --- | --- |
| Lessons | A class lists its next time and room, then offers entry while open. The running class has a marked Stop control and time remaining. |
| Homework | The empty line points to attending class. The assigned essay offers its writing time. After writing, the marked piece appears in inventory and the result is kept in the recap. |
| Feather practice | The row points to Charms before the spell is learned. Once learned, it offers the cast with its stamina cost, estimated chance and attempt count. |
| Results | The latest result appears directly. Earlier results open through a disclosure. |

Each run used a fresh local origin and the same composed `hp-term-jinx` fixture. Setup put a sorted Harry in the Great Hall at 08:59 on a term Monday. Through the normal entry, the run opened the timetable, attended Charms, cast on a feather, attended History of Magic, wrote its homework and cast again. The two tries raised the quoted odds from 40% to 60%. The clock advanced through the game's test stepper. The desktop after run preserved the school results and practice through Save, reload, Export and file Import.

The first baseline run exposed two extensions claiming the same saved homework result. The before captures use the prior layout rebuilt with that validation fix, which lets ordinary homework finish with only the school timetable admitted. The record keeps the same save format and content pins. Agent verified. [Before proof](before.json) · [After proof](after.json) · [School-day walkthrough](../../../gm/dispatch/play-surface-2026-11-14/HARRY_SCHOOL_DAY_2026-11-24.md)

Both active captures show a pre-existing timer discrepancy. At 14:12, the school row correctly shows 48 minutes left in History of Magic, while the global status line shows 1 h 48 min.

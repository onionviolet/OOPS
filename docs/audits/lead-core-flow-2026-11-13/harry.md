# Harry Potter lead life: core flow audit (2026-11-13)

Read-only play audit. No source, test or doc was edited. Findings are quoted from the screen unless marked "(source)".

## Setup

- Scenario used: `hp-exam-week` (DEV fixture, composed). It is the last fallback. `hp-w7-halloween`, `hp-w7-flying`, `hp-w7-duel` and `hp-w6` all failed to load: "Restore the exact school extension content" (the private school content is not present in this headless build). `hp-w6` said "Restore the exact beginning content".
- Build kind: live headless worker. Session `audit-harry`.
- Game calls used: about 75, including two boots, one 5-day step that timed out at 300 s and killed the session (reported once with game_report_limit), and a reboot.
- Days actually played: day 322 to 324 (three in-game days), not seven. About 45 s of wall time per game day made seven days with probes unaffordable after the timeout. The C1 verdicts below rest on three days plus the whole of exam week. Treat them as strong for "what is on offer" and weak for "what happens on day 5".
- The fixture starts in exam week, with all seven papers open. It is not a mid-term ordinary day, so "attend class" never appeared as an action at all. That is itself a finding: no timetable was visible.
- Not exercised: classes, spell practice, brewing at a bench, flying, house points, Quidditch, library, the first-year book route (all need the private extensions or were not offered).
- Places reachable: Great Hall, Gryffindor first-year dormitory. Nothing else appeared.

## C1 Blank-day test

| Link | Verdict | Evidence |
|---|---|---|
| (a) Something to do that is not a book event | Missing | Great Hall offered only "Sit the Transfiguration paper · 90 min" (then Charms, Herbology, Potions, Astronomy, Defence Against the Dark Arts, History of Magic, one at a time). Dormitory offered "Settle into your bed and trunk" (one-time) and "Go down to the Great Hall". No class, library, meal, rest, talk or explore action showed. Local actions panel showed only "Patrol blocked: return the loaned kit". |
| (b) It costs something real | Partial | Each paper costs 90 minutes of clock. Nothing else was charged: "no money of your own", no stamina or points shown. A "Cold" debuff (Sta eff. x0.8, 1h) appeared during the first paper with no cause shown. |
| (c) Result read by a later action | Partial | Papers feed "Marks are read on the last day of term" and "Read your marks on the board · 10 min". But no paper's result depended on any earlier action; I did no prep and none was offered. |
| (d) Reason to come back tomorrow | Partial | Only the exam queue and "Term ends in 8 days (25 June)". After all papers were sat there was no timetable, homework or clock; the next draw was the marks board on the last day. |
| (e) Visible improvement with repetition | Missing | Skills panel showed only "Cold resistance", "Patience", "Night vision" (village skills gained by idling: "Night vision: +960 XP"). No spell, potion or study skill. Notebook "Practice" tab was empty. |

Story advance by time alone: exam papers did not expire when a day passed (I skipped one evening; "Sit the Potions paper" was still there the next day). Term-end text counts down. Nothing forced a story stage during three days. Idle time did unlock Statistics, Continuing insight, Skills & practice and the skills above.

Nothing useful to click: yes. After the last paper the hall offered only "Go up to your dormitory"; in the dormitory the only action after settling was "Go down to the Great Hall". Free-day state was a two-room loop.

## Day-by-day notes

- Day 322, 09:00 to 13:30: sat Transfiguration, Charms, Herbology back to back (90 min each). Cold debuff appeared and expired. Mixing and Crafting buttons both refused.
- Day 322 night (stepped a whole day without sitting papers): nothing was forced, nothing was lost, no meal or sleep prompt. Reports showed only "Unlocked new skill: Cold resistance".
- Day 323, 13:30 to 19:30: sat Potions, Astronomy (at 15:00, no night gating), Defence Against the Dark Arts, History of Magic. "Deed done: Marks on the Board". Marks button appeared with 10 min cost.
- Day 324, 19:30: nothing to do except the marks board; "Unlocked new skill: Night vision" after a passive day.
- Second boot, day 322 to 323 00:00 in the dormitory: stepped 900 min. Only a "Cold" debuff and three insight panels unlocked. No sleep, rest or night action.
- Not played: days 325 to 330 (timeout).

## C2 Off-book probes

| # | Plan | Class | Evidence |
|---|---|---|---|
| 1 | Skip the rest of the exam day | WORKED | Stepped a day; papers still open next day, nothing punished. (Arguably too soft: no house or teacher reaction.) |
| 2 | Practise a spell not yet taught | FAILED, reason partly shown | "Spellbook · not here" in the panel list, greyed. In source the casts require "Learn the charm in Charms first" (source, not seen on screen). |
| 3 | Brew a potion outside class | FAILED WITH IN-WORLD REASON | Mixing: "No mixing bench here." (Great Hall). No bench was found in the dormitory either, via the Here/Mixing shortcut not retried there. |
| 4 | Craft something | FAILED WITH IN-WORLD REASON | Crafting: "No crafting station is available here. Reach one, or finish the conversation first." |
| 5 | Study in the library for another subject | NO ROUTE | No library place. "Study · Ask around for someone to teach you" is greyed. |
| 6 | Wander at night | NO ROUTE | Only Great Hall and dormitory; stepped to 00:00 with no outing action. |
| 7 | Befriend a student of another house | NO ROUTE | "No one else is here" in both rooms; Known things > "Open People" click changed nothing. |
| 8 | Lose or earn house points on purpose | NO ROUTE | No points display or action seen. |
| 9 | Buy or trade something | FAILED WITH IN-WORLD REASON | Inventory: "no money of your own"; Ledger greyed "Take a commission to start one". |
| 10 | Rest or sleep to recover from Cold | NO ROUTE | No sleep or rest action; the debuff expired on its own. |
| 11 | Use a learned spell on a different problem | NO ROUTE | No spell owned and no spell panel here. |
| 12 | Eat in the Great Hall | NO ROUTE | The Great Hall has no meal action. |
| 13 | Open Known things > People | SILENT | Button exists, click produced no change. |
| 14 | Read the Patrol notice at Local actions | SILENT (not clicked) | Shows "Patrol blocked: return the loaned kit" with no kit Harry holds; wrong-world text. |

Counts: WORKED 1, FAILED WITH REASON 3 (plus 1 partly shown), NO ROUTE 7, SILENT 2.

## C3 Improvable aspects

| Repeatable action | How it improves |
|---|---|
| Sit an exam paper | None found (single sitting; no prep link seen) |
| Read marks on the board | None found |
| Go between hall and dormitory | None found |
| Settle into bed and trunk | None found (one-time) |
| Idle time | Village skills (Cold resistance, Patience, Night vision) level, but they are not school skills and nothing reads them |

## C3b Systems gap

| System | Used by the ordinary day? | Cost of its absence |
|---|---|---|
| Time/schedule | Partial. A clock and "Term ends in 8 days" exist; no timetable. | Day has no rhythm; "School holiday" shows during exam week. |
| Knowledge | No. Study greyed; Known things empty. | Nothing to learn and nothing to revise before papers. |
| Relationships and standing | No. "No one else is here"; no house points, teachers or friends shown. | Papers have no social stakes. Ron is named only in the dorm text. |
| Livelihood/money | No. "no money of your own". | No small purchases, no reason to earn. |
| Brewing/potions | No. "No mixing bench here." | A Potions paper with no potion practice behind it. |
| Crafting/items | No. "No crafting station is available here." Inventory shows "You carry nothing of your own." (the screen's item count says 6 items but lists none) | Nothing to prepare or carry. |
| Spellcraft | No. "Spellbook · not here". | Charms paper with no spell practice. |
| Creatures | No. Known things > Creatures empty. | No pets or lessons. |
| Flying | No. | Not offered in this fixture (source shows an excursion for it). |

## Other things seen that look wrong

- The household panel header shows the Dursley schedule inside Hogwarts: "Dudley's birthday" and "Next: Get up and dress".
- Raw id on screen: "Away: book.hp.lead.dormitory."
- Village-hero leaks: "Your body here is not the Village hero's sheet", "Cold resistance" skill, "Patrol blocked: return the loaned kit", "Defeat an enemy and it is recorded here."
- Exam papers carry no time-of-day gate: Astronomy was sat at 15:00.
- The inventory header says 6 items yet "You carry nothing of your own."

## Top five gaps

1. No timetable or class actions: nothing gives the day a shape, a place to be at an hour, or a reason to come back.
2. No in-day practice that the papers read: study, spell practice and brewing are all absent or greyed, so a paper result cannot depend on what Harry did.
3. No people to talk to: "No one else is here" in both rooms; no friends, rivals, teachers or house points, so there is no standing to gain or lose.
4. No meals, sleep or rest actions: the day has no recovery or upkeep loop, and the free-day state is a two-room click loop.
5. Village-hero leftovers (Dursley day header, Patrol notice, village skills, raw id) crowd the screen and hide that the real school actions are missing.

Caveat: fixture is exam week from a composed save, and the private school extensions did not load, so some gaps may be content that exists in a full build. I could not tell which from the screen.

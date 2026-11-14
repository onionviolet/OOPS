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

## Mid-life rerun, 2026-11-13 (save hp-w7-halloween)

Read-only headless play. First pass (`harry-mid`) was replaced after the coordinator pointed to the hidden panel; this is the replay (`harry-mid2`, seed 1). No code, test or other doc edited. What I saw on screen unless marked "(inference)".

### Findability

The first pass found nothing to do because Harry's life actions sit in `#structured_pack_panel`, a collapsed workspace module that a player reaches through the top-bar "Beginning" button (or Notebook > "Your beginning"). Local actions showed only "Patrol blocked: return the loaned kit", a leftover from another life, and the Here tab was empty. A new player has no cue that the real actions are under "Beginning", which is titled like a backstory page. The panel is long: its text begins with the Dursley and Hagrid backstory and the action rows come after it.

### Setup

- `hp-w7-halloween` loads, day 93 18:21, Great Hall, 11 Galleons, wand and broom. Days played: day 93 18:21 to day 95 12:15, about 1.7 in-game days, stepped in minutes and one 850 and one 1110 minute step. Page errors: none.
- At boot the panel offers 4 enabled things: Continue to the first Quidditch match (not chosen), Go up to the dormitory, Sit with Ron in the common room (30 min), and a Charms practice bench choice. 75 more rows sit under "Not available yet (75)", mostly completed sorting-day rows ("This action has already been completed").
- The save carries no school people in the People panel (8 entries, all pre-term), and Ron never appeared there even after five sessions with him (inference: his ties live only in the Beginning panel).

### C1 Blank day

| Link | Verdict | Evidence |
|---|---|---|
| (a) Something to do that is not a book event | Present | Day 94: sit with Ron (30 min, evening day 93), attend the first Charms lesson (30 min, enabled 09:02), practise the levitation charm in Charms (30 min, enabled 09:33), attend Potions (45 min, enabled 10:04), then a three-step brew (simmer 30 min, take off the fire 5 min, add the quills 30 min) and "Hand in your flask" (5 min), then practise with Ron (20 min, repeatable). Ordinary school actions, none a book event. |
| (b) It costs something real | Partial | Time: each action has a quoted duration. Ingredients: the brew used 5 of the 14 items the Potions lesson gave. A feather is used up by "Float your feather over to Ron". Stamina: no cost seen. The Cold debuff (stamina x0.8, "Very cold" x0.6 by the morning of day 95) came from the empty hall overnight, not from a choice. |
| (c) Result something else reads | Partial | Lessons unlock the practice and the potion actions (Charms lesson unlocked the practice bench, practice and Cast; Potions unlocked the brew). Ron lines get appended to Ron's entry in the Beginning panel ("grumbled at his feather with you", "took turns with the charm"). Stamina rose +1 then +2. I did not see any later action change because of the brew, the flask hand-in or Ron. |
| (d) Reason to come back tomorrow | Missing | On day 95, 09:04 to 12:15, no lesson came back: the first Charms lesson shows "already been completed", Potions and the practice bench showed only "required knowledge, means or circumstances are missing". Only Ron practice, Go to dormitory, Cast the charm and Float the feather stayed. No timetable text was seen (inference: lessons may recur on a weekly schedule not reached in 1.7 days). |
| (e) Something improves with repetition | Partial | The practice row states "Each try, lifted or dropped, adds one step of practice, and the chance of lifting it rises with practice" (read from the row), but I ran it once and the Reports log showed no result line, so I did not see the number or the chance. Ron practice repeated 5 times with a flavour line each time and nothing readable changed. |

### C2 Off-book probes

Done through the panel where an action exists.

| # | Plan | Label | Evidence |
|---|---|---|---|
| 1 | Practise a spell alone | WORKED (silent result) | "Practise the levitation charm in Charms" ran for 30 min after the first lesson; no result line, no chance shown. Disabled before the lesson and again after about 10:04 ("The required knowledge, means or circumstances are missing"). |
| 2 | Skip a class | WORKED | Day 95: no class was taken, nothing was lost or said. Lessons I skipped that day simply did not appear. |
| 3 | Study in the library | NO ROUTE | No library place; "Revise Transfiguration, 90 min" is present but disabled with the generic blocker, and I found no way to enable it. Flamel in the library is behind the Christmas continuation. |
| 4 | Brew outside class | WORKED | The brew's steps ran in the Great Hall after the Potions lesson (Simmer, Take off the fire, Add the quills, Hand in your flask). Brewing without the lesson was not enabled before it. |
| 5 | Spend time with someone other than Ron | NO ROUTE | No other person has an action. |
| 6 | Visit Hagrid | NO ROUTE | Not in the panel. |
| 7 | Explore a corridor | NO ROUTE | Only Great Hall and dormitory exist; Go up / Go down take 0 minutes. |
| 8 | Write home by owl | FAILED WITH REASON | "Send back your answer" exists in the list as "already been completed". |
| 9 | Buy something | NO ROUTE | 11 Galleons, no shop or price anywhere. |
| 10 | Break curfew | NO ROUTE | No curfew and no night action. |
| 11 | Sit with Ron again | FAILED WITH REASON | "This action has already been completed" (the sit is one-off); Ron practice is the repeatable one. |
| 12 | Use the charm on something else | SILENT | "Cast the levitation charm on a feather" ran, no message, no change I could read. |

Counts: WORKED 3, FAILED WITH REASON 2, NO ROUTE 6, SILENT 1. The failed-reason lines are the panel's own text; its blocker line for a disabled lesson or practice is always the same generic sentence, so it never says what to do (right place, right hour or a prerequisite).

### C3 Improvable aspects

- Charms practice (30 min): meant to raise the chance of lifting, per its own row. I could not read the chance or step count; no result line.
- Practise together with Ron (20 min, repeat 3 times): a flavour line each time; nothing visible changes.
- Brew then hand in the flask: ingredients go in and one flask comes out (the item count rose then fell on hand-in); the hand-in is silent. No speed, yield or quality change seen.
- Attend Potions (45 min, "Repeat 3 times"): gave 5 items (14 from 9) once; not tried twice.
- Cast and Float the feather: the float uses up the feather; no change read.
- Idle Village skills still rise (Cold resistance, Breathing) but nothing reads them.

### Other things seen

- Raw-id or other-life leftovers: Local actions "Patrol blocked: return the loaned kit"; Other worlds offers a Lion Legion posting (first pass); the Ledger row "To hp lead school" (first pass); the Beginning panel opens with the Dursley backstory and "Today is Dudley's birthday" in the text above the school actions (the earlier "Dudley's birthday" is this panel text, not the household panel).
- "Repeat ... 3 times" on Ron practice kept running past the three (about 60+ min), and I could not find "Stop repeated work" by text (inference: wording or timing).
- The Cold debuff returns each night in the Great Hall; going to the dormitory and back took 0 minutes and changed nothing I could see.

### What changed from exam week

- The actions exist. In exam week the only choices were seven papers; here day 94 offers a Charms lesson, a practice window, Potions, a three-step brew and practice with Ron, all as optional ordinary time.
- Lessons look one-off or windowed, not a timetable: the first Charms lesson is "already completed", Potions and the practice bench were enabled only in the morning of day 94, none came back on day 95 up to 12:15 (inference for a later week).
- Results are silent or flavour-only: charm practice, cast, flask hand-in and Ron sessions give no number a player can read.
- Same people gap, same other-life leftovers, and the first pass's findability failure is the main new finding.

## C4 cold reader, 2026-11-13 (save hp-w7-halloween, tree 0f53ba3f0)

A cheap agent with only the screen text, 15 actions a goal. One run.

| Goal | Result | What happened |
|---|---|---|
| Find your next lesson and where | Not reached, about 14 actions | "Actions" opened the "Your beginning" recap. The only lesson text was "Learn the Levitation Charm in Charms first", with no time or room. "Local actions 12 entries" read as collapsed and its header did nothing. |
| Find a spell you know and practise it | Not reached, 15 actions | Skills said "4 / 4 skills" under three collapsed categories with no names. Find "Charm" gave 0 of 4. Stats showed Magic 0, Mana 0. "Spellbook · not here" could not be opened. |
| Spend time with a friend and see what changed | Reached, 2 actions | Beginning, then "Sit with Ron in the common room · 30 min". A story line about Ron's family appeared. People and Notebook did not change, and Ron is not listed in People. |

Most confusing: "Actions" opens a story recap; skills have no visible names; Capability runs lists Fang Yuan, Klein and Su Xiao in Harry's life. Clear: time with a friend is one named action with a timer.

# Klein Moretti core-flow audit, 2026-11-13

Read-only audit. No source, test or existing doc was edited. Screen quotes are from the headless game; anything marked (source) or (inferred) was not seen on screen.

## Setup

- Asked for `lotm-kjw37`. It failed to load. `lotm-kjw36`, `lotm-kjw33` and `lotm-kjw38` failed the same way: "Optional item restoration needs an explicit migration." A rebuild of kjw37 through `scenarios.mjs build` succeeded, but importing that file failed ("Import did not reload"). So the quiet-fortnight state was never reached.
- Used `lotm-klein-wanted` (day 1, Moretti flat, constables latch set), then a fresh "Developer playthrough: Be Klein Moretti" start from the Tingen panel. Both are the book's opening, not a settled life.
- Build kind "live". About 55 game calls used.
- Hard blocker: the clock stops. Every `game_step` (1 minute, 600 minutes, 1 day) fails with "Invariant failed at minute 3359: expansionError: Unknown simulation participant book.ri.keeper.moon." The header reads "Day 1, evening · 23:59" and stays there. The cause looks like a Gu-keeper pack participant (`book.ri.keeper.*`) missing from this life's actors (source: `person()` in `src/simulation_effects.js` asserts on it). It reproduced on both boots.
- Because of that, the seven-day blank-day test (C1) could not be run. Only about 1.4 in-game days (Day 1 night to Day 1 23:59) were reachable. C1 verdicts below rest on that slice plus the action lists, and are labelled.
- Also seen: the screen header reads "Day 1, night 00:01" while the status clock reads hour 8 (an 8 hour offset between two clock displays).
- Not exercised: buying, selling, work shifts, brewing, moving house, anything after the pause.

## C1 Blank-day test

| Link | Verdict | Evidence |
|---|---|---|
| a. Something to do that is not a book event | Missing | The single "Next" task is "Look over the desk", then "Read the open notebook". Household talks are book beats ("Ask why your sister walked to school", "Explain the family budget and the value of study time"). "Rest and meals" holds 31 entries that are book scenes ("Eat the club breakfast", "Dress for the dinner invitation"). "Making" has one action: "Burn the notes". The only open-ended ordinary items are "Wait until dawn" and Thoughts. |
| b. It costs something real | Partial | Rent is real: "This week's rent of 5 soli is due in 7 days", with standing orders (pay, late, part, dispute, skip) and stated consequences. An expense application "shuts in 7 days". Almost every action says "no stock spent" or "stock cost not recorded". Time costs are 1 minute. |
| c. Its result is read by a later action | Partial | "weigh work options and choose path" gives "I choose private detective work as my way to earn income. Your intention: active". Nothing visible reads that flag (no job, no income). Looking at the desk unlocks "Read the open notebook". That is a story chain, not a consequence. |
| d. A reason to come back tomorrow | Partial | Rent clock (7 days), expense deadline (7 days), "Wait until the day of your interview · 1441 min", "Trains out of Tingen are halted today. · today only". These are clocks, but none is tied to something I am building. |
| e. A visible way it gets better with repetition | Missing | No skill, tool or routine meter on any action on screen. Thoughts are one-minute actions that stay available after use with no change seen. |

- Story stages advancing from time alone: no. Waiting six hours to dawn did not fire the constables. It only added "The Tingen police are asking after you by name. (about 6 hours ago)". The first task stayed on "Look over the desk" until clicked. (seen)
- Nothing useful to click: yes, after the pause. Every action reads "Progress paused: Unknown simulation participant book.ri.keeper.moon." including "Look over the desk" and "Wait until night · 1 min". Before the pause the day had a handful of live actions.

## Day-by-day notes

- Day 1 00:00: only live actions were "Look over the desk" (1 min), Thoughts, "Burn the notes", talks, "Wait until dawn". Desk look unlocked "Read the open notebook".
- Day 1 dawn (waited 357 min): "While you were away" note about the police; no event fired. "Wait until morning · 120 min" appeared.
- Day 1 dawn: 56 Thoughts listed, many for later book chapters ("decide to brew Faceless Man potion tonight", "plan to probe Sun about Sauron family"), live on day one.
- Day 1 evening to 23:59: stepping forward crossed fog weather lines, then the clock stopped.
- Days 2 to 7: not reachable.

## C2 Off-book probes

| Plan | Class | Evidence |
|---|---|---|
| Divination for strangers for money | NO ROUTE | "Rites and questions" has 21 fixed questions, each named for a book subject ("Bogda Jones's liver operation", "Riel Bieber", "the proposed iron-mine investment", "Joyce Mayer"). No open client or fee action. They also read "The required knowledge, means or circumstances are missing." |
| Learn and practise Cogitation | FAILED WITH AN IN-WORLD REASON SHOWN | "Learn Cogitation from Neil first." (Neil is a book contact.) |
| Open Spirit Vision | FAILED WITH AN IN-WORLD REASON SHOWN | "You need the Seer potion in you and a rested mind." |
| Study a different subject | SILENT | "What do the Tingen papers say about how…" is 60 min, disabled with "The papers are kept in the reading room at the university area." After the pause it reads "Use the writable game tab to study." That reason is about the tool, not the world. |
| Skip rent | WORKED (offer only) | The standing order lists "skip it (pay nothing; misses pile up toward a fine and goods taken)". The consequence was not observed because time stopped. |
| Borrow money | NO ROUTE | No loan, lender or advance action found on Work & merit, People or the flat list. Work & merit only lists "You owe nighthawks a duty, no set date." |
| Sell an ingredient or potion | NO ROUTE | Inventory is "1 penny", nothing in it. Mixing panel exists but the day offers no ingredient or sale action. (not exercised) |
| Make and sell charms | NO ROUTE | "Making" has only "Burn the notes". Amulet carving belongs to later book chapters (kjw31 summary). |
| Move house | NO ROUTE | "Make the flat your home in this life" is the only housing item. Lease talk is "Discuss ending the old lease" under Benson, a book beat. |
| Tell someone a secret | NO ROUTE | People lists Melissa and Benson, "No agreement or shared event yet". Talk entries are fixed topics ("Tell Benson about the Lamd Town trip"). |
| Buy a weapon and practise | NO ROUTE | A revolver sits on the desk. No shop, no practise action on the flat. No travel list: "You know no other places yet." |
| Skip work | NO ROUTE | No work to skip on day 1. Expense paperwork exists ("Hand it in"), not shifts. |

Counts: WORKED 1 (offer visible only), FAILED WITH AN IN-WORLD REASON 2, NO ROUTE 8, SILENT 1.

## C3 Repeatable actions and how they improve

| Action | Way it gets better |
|---|---|
| Look over the desk, read notebook | None found (one-shot chain). |
| Thoughts (56 one-minute entries) | None found. They stay clickable with no change seen after "private detective work" was chosen. |
| Cogitate quietly (10 min) | Locked until Neil teaches it. Improvement unknown. (inferred from the lock text) |
| Rites and divinations | None found. Fixed questions with fixed targets. |
| Talk to Benson / Melissa | None found. "1 entry" each; no relationship meter seen. |
| Meals, rest, nap, bath | None found. "Food and portions not recorded." |
| Wait | None. |
| Rent standing order | Choice of policy only. |
| Expense application | None found. |

## C3b Systems gap

| System | Used by the ordinary day? | What its absence costs |
|---|---|---|
| Time and schedule | Partly. Waits and clocks exist (rent, interview, "today only"). The clock then stops with an unknown-participant error. | The day has no shape of its own; a hard stop ends all play. |
| Knowledge | Partly. Thoughts and notebook are knowledge records. | They are readable on day one for chapters Klein has not met, so knowledge does not gate anything. |
| Relationships and standing | Barely. People shows two names with "No agreement or shared event yet". | Nothing to nurture or spend; talks are one-offs. |
| Livelihood and money | Partly. Rent and an expense file exist. Money is "1 penny". | No income route, no wage, no way to earn the 5 soli. |
| Brewing and potions | No. Mixing panel exists; no ingredient or recipe action in the day. | No crafting loop for a potion path. |
| Crafting and items | No. "Making" is "Burn the notes". | No make-and-sell loop. |
| Spellcraft and rituals | Partly. 21 rites and 6 altar items are listed. | They are fixed book questions, so there is no everyday casting. |
| Gray fog | No. "reflect on grey fog and the Diviner pathway" is only a Thought. | The lead's cheat has no daily use. |
| Mind and losing control | No. No sanity or control meter on the Condition panel ("No active effects"). | No pressure or risk from practice. |

## Other defects seen

- Disabled reasons print raw internal ids: "Return to lotm.place.cast-3880fe8426077c71d45b." (dozens of them in Rest and meals, Thoughts).
- "Look over the desk" clicked from the nearby shortcut did nothing visible until clicked a second time from the local list (first call showed an unchanged screen, clock unchanged). (seen once)
- After a re-boot the same pause appears, so it is a fixture-independent state problem, not a one-off.

## Top five gaps

1. The clock stops. `book.ri.keeper.moon` is missing from this life's actors, so no step or wait works. Nothing else can be judged until this is fixed.
2. No income loop. Rent is real and priced, but there is no work, shift, commission or sale to pay it. "I choose private detective work" sets a flag that nothing reads.
3. No open-ended divination. Rites are 21 named book questions. A paid reading for a stranger, which the world plainly allows, has no route.
4. Making and brewing have no ordinary use. "Making" is one burn action and Mixing has nothing to mix, so no ingredient, potion or charm can be made and sold.
5. Nothing improves with repetition. No skill, tool or relationship meter shows on any action. Thoughts and meals repeat identically, and later-chapter Thoughts and meals are live on day one.

## Mid-life rerun, 2026-11-13 (save lotm-kjw37)

Read-only rerun of C1, C2 and C3 through the game MCP (session `klein-mid`, seed 1). The save loaded with no error: header "Day 53, morning · 08:55 at Moretti flat", 1498½ pence, a "While you were away · about 7 weeks" note, rent already paid in absence ("Rent and dues paid: 1 pound 15 soli"), and the current task "Join your first group case" blocked on "Wait until Wednesday afternoon". About 2.3 in-game days played (day 53 morning to day 55 afternoon, status clock 4 to 5 hours of drift from the header). C4 not run. Things I did not see are marked (inference).

### C1 blank day

| Link | Verdict | Evidence |
|---|---|---|
| a. Something to do that is not a book event | Partial | Real ordinary actions exist: hand in the weekly expense application to Captain Dunn, buy furniture at the Lettuce and Meat market (blanket 30p, tea crate 6p, shelf 48p), fit it at home, coin divination at the tent, Spirit Vision, ask Melissa to wash the dishes. But no work shift, no pay and no job exists. The Blackthorn office, Hound Tavern and Fortune-telling tent each showed no local action of their own. The one scheduled "job" is the Wednesday combat practice, which is a book task. |
| b. A real cost | Partial | Money fell 1498½ to 1492½ for the crate. The expense chit says "It shuts in 4 days. Missed 6 times." Rent is 5 soli a week with a five-choice standing order and stated consequences. Spirit Vision showed a countdown (1h, then 50m). Walks cost 2 min each. Cogitation and thoughts spend only minutes, no stamina or stock ("No stock spent"). Rent deduction itself did not land inside my window (inference). |
| c. A result something else reads | Present | After the chit, Dunn's line changed to "warmer toward you since you hand in your weekly expense application on time" and the People web showed manner "warmer". Home Storage went from 10 to 16 units once the crate was fitted. Night vision rose to level 4 by itself. Dunn also holds a gate: he answers a question once he has signed two of your weekly applications. |
| d. A reason to come back tomorrow | Partial | Clocks exist: rent "due in 4 days" counting down, the chit window, Wednesday practice. But two and a half days of waiting produced only ambient lines (ferry horn, church bell, neighbour on the stairs, fog). No person arrived, no event fired, nothing asked for me. Melissa read "Away; return time and place are not known." Around you read "No one else is here." at home and at the office, while the People web marked Dunn and Rozanne "here" at the office. |
| e. Something that improves with repetition | Partial | Night vision reached level 4 during idle time (a skill report, not a choice). Dunn's two-application gate is a repetition reward I did not reach. Fitting the flat has a visible ladder (Sleep done, Storage done, Study and practice empty, one room to build). Practice itself showed no stat or skill change that I could see; STR stayed 12.6 on the stat card before the session ended. |

### Day notes

- Day 53 morning: chit handed in, six places walked, crate bought and fitted, coin divination tried.
- Day 53 noon to day 55: time stepped at home. No event fired by time alone. Thoughts, meals and talks stayed available but never moved the day.
- Day 55 afternoon: "Go to Wednesday combat practice" became ready, ran 80 min in one block and returned "You finish practice and change. You think your potion may be digested by next week. Henry expects to finish the chimney search this week." Notebook count rose 1537 to 1540. At Gawain's house nobody was listed and the walk list said "You know no other places yet."

### C2 off-book probes

| Plan | Class | Evidence |
|---|---|---|
| Take a second job or earn some other way | NO ROUTE | No job, shift or commission at the office, tavern, market or flat. The thought "weigh work options" only sets an intention flag (seen in the opening run). |
| Sell a reading on my own | NO ROUTE | Rites list is 22 fixed questions for named book subjects. No open client or fee action. |
| Skip work | NO ROUTE | No shift to skip. Missing the weekly chit is possible (the screen shows "Missed 6 times") but I did not test the penalty. |
| Spend savings on something odd | WORKED | Bought a lidded tea crate, 6 pence off, then "Installed Lidded tea crate", storage 10 to 16 units. |
| Go to practice early | FAILED WITH REASON | Task blocker "Wait until Wednesday afternoon." |
| Ask a colleague for training | FAILED WITH REASON | Old Neil is "busy with the books; nobody he trusts has spoken for you lately", and the button is disabled. Dunn's answer waits for two signed applications. |
| Save money for a week | SILENT | Waiting changed nothing on the money line over 2.3 days and said nothing about saving. Rent is auto-paid while away. |
| Gamble | NO ROUTE | Tavern had no actions at all. |
| Write to a mentor | NO ROUTE | No letter or message action found in the flat, office or Talk lists (the 14 Dunn talks were not opened one by one). |
| Practise a ritual alone (Cogitate quietly) | SILENT | Ran 10 min, no report line, no visible change. Its disabled text read "You need the Seer potion in you and a rested mind." even while the button ran. |
| Open Spirit Vision | WORKED | Condition panel gained "Spirit Vision on 1h" and counted down. The same wrong "needs the Seer potion" line sat on the disabled twin. |
| Ask the coin about returning home | FAILED WITH REASON | Ran through three one-minute steps, then "The answer will not settle; nothing you know bears on this question yet." |
| Ask Melissa to wash the dishes | WORKED | Text confirmed, she carried the basin out, then showed "Away" with no return time. Nothing else read it (inference from nothing changing). |

Counts: WORKED 3, FAILED WITH REASON 3, NO ROUTE 5, SILENT 2 (13 probes).

### C3 improvable aspects

- Weekly expense chit: Dunn's manner improves and a question unlocks after two signed chits. Visible, and the only repetition ladder I found that ties to a person.
- Home fittings: three slots plus one room, each with a named empty state. Buying and fitting raises storage. Improves by spending.
- Divination coin: the three-step coin flow can be replayed, but the answer was gated on knowledge I lack; I did not see it improve.
- Spirit Vision: timed buff, no improvement seen.
- Cogitation: silent, no meter.
- Night vision: levelled by passing time, not by any action.
- Thoughts, meals, rest, talks: identical on repeat. No skill or relationship meter.
- Combat practice: one run, no visible gain.

### Broken or untidy

- Clicking "Spend 1 h of banked time" (the notice under "While you were away") returned no change lines, moved the status clock about 11 minutes, then every `game_step` failed with "Cannot nest advanceTicks." until `game_reload`. Reload restored the autosave at day 54 evening. Reported through `game_report_limit`.
- Raw ids on screen: disabled reasons like "Return to lotm.place.cast-7351aa6540a4ac426acf." and "Return to lotm.anchor.place.b8c463e1934e7742." in Rest and meals and Thoughts. Also "Away: cast 266d12fc010442f95bac." on the rented-flat row at Gawain's house.
- Another life's leftover: the office showed "Patrol blocked: return the loaned kit · Open Patrol & custody".
- Later-book Thoughts and Rest entries are live on day 53 (for example "decide to brew Faceless Man potion tonight", the house-price estimate). The thought text is fixed and did not read my savings.
- The header clock ("Day 53, morning · 08:55") and the status clock (16:55) differ by 8 hours throughout.
- Headless pacing: a one-minute step cost 17 to 25 s of wall time, long steps about 2 game minutes per second. About 500 minutes per call is the safe ceiling, so one day costs roughly 12 minutes of wall time.
- No page errors were reported by the game status.

### What changed from the opening

- The clock runs. The opening run's stop ("Unknown simulation participant book.ri.keeper.moon") did not appear on this save, so that bug is specific to the opening starts or already fixed (inference).
- A mid-life Klein has actual ordinary hooks the opening lacked: a weekly chit that moves Dunn's attitude, a market with prices, a home with fittable slots, a rent that is auto-paid, a Wednesday task. C1(c) moves from partial to present.
- The same holes remain: no income or pay for Nighthawk work, no divination for strangers, no repetition ladder for the potion or practice, people absent at home, and nothing fires from time alone.
- Raw ids, other lives' leftovers and later-chapter Thoughts still show.

## C4 cold reader, 2026-11-13 (save lotm-kjw37, tree 0f53ba3f0)

A cheap agent with only the screen text, 15 actions a goal. One run.

| Goal | Result | What happened |
|---|---|---|
| Find your money and what you owe | Reached, about 7 actions | Inventory header gave "1498½ pence". Work & merit gave "This week's rent of 5 soli is due in 4 days". Reports also said "Rent and dues paid: 1 pound 15 soli", and another notice said the rent was "due 3 days ago". |
| Find how to earn or do your job today | Not reached, 9 actions | The job step was blocked ("Wait until Wednesday afternoon"). "Ask Captain Dunn how the funding request works" showed as text that could not be clicked. Handing in the expense application said "Handed in." with no amount. |
| Do one divination and read the result | Not reached, about 5 actions | The walk to the fortune-telling tent and "Open your Spirit Vision" showed in one panel state only; "Open nearby actions" and "Back to Moretti flat" swapped between two states and the list would not stay open. |

Most confusing: the rent reads paid, due and overdue at once; local actions swap in and out; pence, soli and pounds appear with no conversion. Clear: Work & merit states the weekly expense deadline and the rent with its payment choices.

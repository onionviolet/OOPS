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

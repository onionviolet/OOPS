# Lead core-flow audit, 2026-11-13

Status: findings and proposals (AD32). Nothing here is accepted direction.
Agent-verified by headless play on the live tree, not human-reviewed. Revised the
same day: the first pass judged stand-ins because the lead saves would not load;
after the [G1 repair](#g1-repair-2026-11-13) the checks were rerun on real mid-life
saves. **Read [the mid-life rerun](#mid-life-rerun-2026-11-13) first; it supersedes
G2 to G7 and the proposal order below it.** Two repairs changed game code (G1, G12).

Weibao asked what is wrong with the game as it stands and how to improve it
before he plays, with Klein, Harry and Fang Yuan ahead of the other leads
([his words](../gm/USER_VISION_LOG_2026-11.md#three-leads-first-and-the-core-flow-checks-2026-11-13)).
This run applied four checks to each of the three:

- **C1 blank day.** A week of ordinary actions with no book event. Five links: something to do, a real cost, a result something else reads, a reason to return tomorrow, a way it improves.
- **C2 off-book probes.** About ten plans the book never took but the mechanisms should allow.
- **C3 improvable aspects.** Each repeated action and how it gets better.
- **C4 cold reader.** A cheap agent with only the screen text and three goals.

Per-lead detail: [Klein](lead-core-flow-2026-11-13/klein.md),
[Harry](lead-core-flow-2026-11-13/harry.md),
[Fang Yuan](lead-core-flow-2026-11-13/fang-yuan.md).

## What the run could and could not reach

| Lead | Intended save | What loaded | Days played |
|---|---|---|---|
| Klein | `lotm-kjw37` | none of kjw33, 36, 37, 38, 49; used `lotm-klein-wanted` and a fresh "Be Klein Moretti" start, both at the book's opening | under one |
| Harry | `hp-w7-halloween` | none of hp-w6, w7-flying, w7-duel, w7-halloween, w11-farewell; used `hp-exam-week` | three |
| Fang Yuan | `ri-fang-yuan-class-chair` | none of five `ri-fang-yuan-*`; used the Gu keeper life `gu-fed-second`, which says on screen it is not Fang Yuan's life | about seven |

So this audit judged the edges of each life, not its middle. The middle is
unreachable today, which is finding G1.

C4 ran for Fang Yuan only. The Klein and Harry cold readers stopped at the load
failure and were not rerun.

## Findings

| Code | Finding | Evidence | State |
|---|---|---|---|
| G1 | **The earned lead saves do not load on the current tree.** Klein and Fang Yuan saves stop with "Optional item restoration needs an explicit migration." Harry saves stop with "Restore the exact school extension content." | Coordinator reproduced `lotm-kjw49` and `hp-w11-farewell` through the game MCP. Agents saw the same on 14 further saves. | Verified, then repaired the same day: see [G1 repair](#g1-repair-2026-11-13). |
| G2 | **No lead has an ordinary day.** Klein and Harry have nothing to do that is not a book event. | Klein C1(a) missing; Harry C1(a) missing, the Great Hall offered only the seven papers. | Seen at the book's opening (Klein) and exam week (Harry) only. |
| G3 | **The Gu keeper life is the one working loop.** Feed, tend, refine, starve: all five links present or partial. Its weak link is the reason to return: larders last 5 to 9 days, so skipping a day costs nothing. | Keeper C1: a, b, c present; d soft; e partial (a Gu grew fond, tend yield rose 2 to 3). | Seen in play. It is not yet Fang Yuan's day: no academy, clan, rivals, foreknowledge or Cicada. |
| G4 | **Most off-book plans have no route.** 20 of 38 probes found no action anywhere. | Klein 8 of 12, Harry 7 of 14, keeper 5 of 12 had no route. Worked: 1, 1 and 5. | Seen in play. |
| G5 | **Little improves with repetition.** Klein and Harry: nothing found. Harry's only gains were Village skills (Cold resistance, Night vision) from idling. | C1(e) missing for both. | Seen in play. |
| G6 | **Each life shows other lives' leftovers.** Harry's dormitory showed "Dudley's birthday" (a fixture fault, not a leak: see the revised G6) and "Patrol blocked: return the loaned kit". The keeper life listed Trade standing, Potioneering and Patrol & custody. Raw ids reach the screen ("Away: book.hp.lead.dormitory"). | Harry audit, Fang Yuan cold reader. | Seen in play. |
| G7 | **A new player cannot find their Gu.** The cold reader spent 15 actions and did not find which Gu it owned or what they eat. The answer sits in Notebook, "Your beginning". Inventory rows and Find results are not clickable. | Fang Yuan cold reader, goal 1 not reached. | Seen in play, one run. |
| G8 | **Actions give no result line.** A Moonblade throw spent 4 essence and reported nothing. Essence regenerated overnight at the cap is lost without a note. | Fang Yuan cold reader goal 3; keeper C2 silent case. | Seen in play. |
| G9 | **Headless play is slow.** About 5 game minutes per wall second, so one in-game day takes about 45 seconds and a multi-day step passes the 300 second call limit. | Coordinator step receipt (870 minutes in 161 s); two agent sessions killed by timeouts. | Verified. This is why a week-long test is expensive. |

One agent claim did not reproduce at first: the Klein audit reported that the clock stops and every time step fails with
"Unknown simulation participant book.ri.keeper.moon". The coordinator's first check stopped at day 2 00:31, hours short of
it. A second check reproduced it at day 2 07:59 on a fresh Klein start. The agent was right; see G12 for cause and repair.

## G1 repair, 2026-11-13

Weibao said to fix the saves. Two separate causes, both tracked changes made after the saves were played:

| Leads | Cause | Repair |
|---|---|---|
| Klein, Fang Yuan (and every save that carries the keeper registration) | The Gu keeper pack gained four items on 2026-11-12 and 13 (lamp moss, the essence vial, Little Light Gu, a second light Gu) without declaring them. The loader refuses a save whose recorded item list differs. | Declared as registration additions beside the definition in `src/world_packs/book_gu_keeper.js` (`declareRegistrationAdditions`), the loader's existing meaning for added items, kept out of the definition because every keeper continuation pins its content hash. |
| Harry | His life's content hash moved. A 2026-11-10 speed change made each story act require only the act before it (same order of play), and the exam commands joined the life. Saves and the nine local continuations pin the old hash. | New declared route: `compatibility.identityAliases` rows map an acknowledged new hash to the pinned one (`src/structured_native_registration.js`, declared in `src/book_world_hp_lead_pack.js`). A further change breaks the match again on purpose, so someone looks before re-declaring. Proposal, adjustable. |

Checks: `tests/lead_saves_load.test.js` boots `lotm-kjw49`, `hp-w11-farewell` and `ri-fang-yuan-class-chair` and plays an hour
(skips on a checkout without the private checkpoints); two fast regressions sit in `tests/content_pack_provenance.test.js`.
`hp-w11-farewell` also booted through the game MCP at day 330 with Harry's belongings and no page errors. Agent-verified, not
human-reviewed. Not checked: the other 90-odd earned saves one by one, and Zorian's.

Standing consequence: adding an item or place to a pack, or changing what a structured life compiles to, needs its
declaration in the same change, or the lead-save test fails.

## Mid-life rerun, 2026-11-13

Run after the saves loaded again, on tree `0f53ba3f0`. C1 to C3 by one sonnet agent per lead; C4 by a haiku cold reader
per lead. Detail is in each lead file under "Mid-life rerun" and "C4 cold reader".

| Lead | Save | Days played | Note |
|---|---|---|---|
| Klein | `lotm-kjw37` (the quiet fortnight) | about 2.3 | Steps slowly on this save, about 0.6 wall seconds a game minute. |
| Harry | `hp-w7-halloween` (ordinary weeks before the first match) | about 1.7, played twice | The first pass looked only at Local actions and found nothing; the replay went through his own panel. |
| Fang Yuan | `ri-fang-yuan-class-chair` | about 3 | His own life, not the keeper stand-in. |

`lotm-kjw49` and `hp-w11-farewell` were not used for the blank day: the first is the newest slice and the second stands at
King's Cross with the year over, so neither has ordinary days ahead. Both load (see the repair section).

### The five blank-day links, per lead

| Link | Klein | Harry | Fang Yuan (own life) | Gu keeper (first pass) |
|---|---|---|---|---|
| (a) Something to do that is not a book event | partial: the weekly expense chit, furniture, fitting the flat, coin divination. No work shift. | present: lessons, charm practice, brewing after Potions, time with Ron | **missing**: one enabled control, the next story step | present |
| (b) A real cost | partial: money, rent, the chit deadline, a timed Spirit Vision | partial: time, and brewing used 5 of 14 ingredients. No stamina cost seen. | **missing**: four days passed with no cost | present |
| (c) A result something else reads | present: Dunn's manner went "warmer" after the chit; a crate took storage from 10 to 16 | partial: a lesson unlocks practice and brewing rows; nothing later read the brew or Ron | partial: passive skills only | present |
| (d) A reason to come back tomorrow | partial: clocks count down, nothing fired from time alone | **missing**: nothing recurred the next day | **missing** | soft: larders last 5 to 9 days |
| (e) Improves with repetition | partial: Dunn answers a question after two chits; divination is 22 fixed questions | partial: the practice row says each try raises the lift chance, no number shown | partial: passive skills from time alone | partial |

What this says for build order: link (d) is missing or soft in all four lives, so nothing yet makes tomorrow matter. Fang
Yuan's own life is the thinnest (three links missing) while the keeper life beside it is the fullest, and the two are not
joined. Klein and Harry have things to do mid-life; what they lack is a day that repeats (a work shift and pay, a timetable).

### Off-book plans, mid-life

| Lead | Probes | Worked | Failed with a reason | No route | Silent |
|---|---|---|---|---|---|
| Klein | 13 | 3 | 3 | 5 | 2 |
| Harry | 12 | 3 | 2 | 6 | 1 |
| Fang Yuan | 13 | 0 | 2 | 8 | 3 |
| All | 38 | 6 | 7 | 19 | 6 |

Half still have no route (19 of 38; the first pass had 20 of 38). The difference mid-life is that Klein and Harry each
have three that work.

### Cold reader

| Lead | Goals reached | What stopped it |
|---|---|---|
| Klein | 1 of 3 | Could not find paid work or reach a divination; the rent read paid, due and overdue at once. |
| Harry | 1 of 3 | Could not find a lesson's time or room, or any spell he knows; "Actions" opened a story recap. |
| Fang Yuan (own save) | 1 of 3 | Could not find his Gu or anything to practise; only the next story step. |
| Gu keeper, after the UI chat's fix | 3 of 3 | Found its Gu and their food with no clicks (15 failed clicks on the first pass). The result of putting a Gu to work was still unclear. |

### Findings, revised

| Code | State after the rerun |
|---|---|
| G1 | Repaired and tested (repair section). |
| G2 | **Revised.** Klein and Harry do have ordinary things to do mid-life. What is missing is the repeating day: no work shift or pay for Klein, no timetable for Harry, and nothing recurs tomorrow for either. |
| G3 | Stands. The keeper life is still the one full loop. |
| G4 | Stands: 19 of 38 mid-life probes had no route. |
| G5 | Softened to partial for all three (see link e). |
| G6 | Stands and widened: "Patrol blocked: return the loaned kit" sits in Local actions in all three lead lives (it shows the moment `hp-w7-halloween` boots). Also seen: Capability runs listing Fang Yuan, Klein and Su Xiao inside Harry's life; "A Soldier's Life" and "Elemental preparation" offered; raw ids "Return to lotm.place.cast-7351aa6540a4ac426acf.", "Away: cast 266d12fc010442f95bac." and "To hp lead school". **Corrected:** "Dudley's birthday" is not another life's leftover. It is Harry's own household sequence, shown because the composed `hp-exam-week` fixture never recorded those weeks as done (traced by the UI chat). The fixture now records them and the line is gone; it never appeared on an earned save. "Patrol blocked" was guarded by the UI chat in 20d96a7cc. |
| G7 | **Fixed for the keeper life** by the UI chat (1fc151270): the cold reader found its Gu with no clicks. Not fixed for Fang Yuan's own save, where Gu named in the story are not in the Inventory. |
| G8 | Stands and is wider than fights: see G16. |
| G9 | Stands. `lotm-kjw37` steps at about 0.6 wall seconds a game minute. |
| G10 | **New. A lead's actions sit in a hidden, collapsed panel.** Harry's 161 controls and Fang Yuan's 206 live in the "Beginning" panel (`#structured_pack_panel`), which starts collapsed, while Local actions shows only another life's leftover. A sonnet agent played Harry for 2.5 days and reported nothing to do. Coordinator confirmed by inspecting the save. |
| G11 | **New. Fang Yuan's own life has none of the keeper's Gu care.** His save holds a refined Liquor Worm, 132 stones and 8 petals and offers no feed, tend, work or hunt action; of 206 controls one is enabled, the next story step. Coordinator confirmed the count. |
| G12 | **New, repaired. The clock stopped a day into a fresh Klein start** with "Unknown simulation participant book.ri.keeper.moon". This is the open claim from the first pass, now reproduced. Cause: every life is enrolled in every automatic event, and the keeper's daily care events (added 2026-11-12/13) name a Gu that other lives do not hold. Repair: an event whose subject is not in this life waits its interval (`src/simulation.js`), with a regression in `tests/simulation.test.js`. A fresh Klein start now runs three days with no error. Mid-life saves were not affected in play. |
| G13 | **New. Klein's screen contradicts itself.** Rent reads "paid", "due in 4 days" and "due 3 days ago" together; "No one else is here" while People marks Dunn and Rozanne as here; the header clock and status clock differ by 8 hours; "You need the Seer potion…" shows on Spirit Vision and Cogitate, which both ran. One agent run each, not rechecked. |
| G14 | **New, fixed by the coordination chat's worker in 86a0404d8 (not rechecked here). Spending banked time wedged stepping.** After "Spend 1 h of banked time", every later step failed with "Cannot nest advanceTicks." until a reload. Seen once, headless only; not rechecked in a browser. |
| G15 | **New. The Beginning panel lists the whole road ahead.** About 88 future step titles for Fang Yuan, and Harry's later continuations by name. Klein's day 53 carries thoughts about late-book matters. |
| G16 | **New. Ordinary actions give no result line.** Harry's charm practice, cast and flask hand-in; Fang Yuan's story step ("Command saved."); the keeper's "Put the Moonlight Gu to work · 1 essence, 1 stone", where the stone is a gain and the label reads as a cost. |

Where these go: G6, G7, G10, G13, G15 and G16 are screen findings for the UI chat (through the coordination chat); the
fight part of G8 is with the combat chat. G11 and the link table feed P3 and P4.

## What the three leads share

The same three things are absent in all three lives, and they are the systems
the [November 10 rulebooks](../RULES_INDEX.md) already describe:

| Missing in the day | Klein | Harry | Fang Yuan (keeper) | Planned owner |
|---|---|---|---|---|
| A shape to the day | no work day | no timetable or classes | no reason to open it today | time (TMR) |
| A way to earn | no income to meet the 5 soli rent | none ("no money of your own") | not exercised | livelihoods (LVR) |
| People | "No one else is here." | "No one else is here." | only the steward | relationships (TIE), standing (STN) |
| Practice that improves | divination is 21 fixed book questions | no spell, study or brew practice | partial | knowledge (KNW), the making systems |
| The lead's cheat | not in the day | n/a | foreknowledge and the Cicada absent | cheats (CHT) |

## Proposed order

Proposals for Weibao, ranked. Revised after the mid-life rerun: P1 and P2 are done, P3 changed, P6 is new.

| Code | Revision |
|---|---|
| P1 | Done (repair section). |
| P2 | Done (mid-life rerun section). |
| P3 | **Changed: join Fang Yuan's own life to the keeper loop** before adding to either. His save already holds the Gu, stones and petals (G11); the feed, tend, work and refine actions exist one pack over. Then add the academy schedule, a rival and a daily cost. Done when his blank day passes links (a), (b) and (d). |
| P4 | Narrowed by the link table: the shared gap is **a day that repeats and a reason to return** (link d), then income (Klein's work shift and pay, Harry's allowance or none by choice), then people present. Practice that improves exists in part and needs its number shown. |
| P5 | Widened: also open a lead's own actions where the player looks first (G10), and stop listing the road ahead (G15). With the UI chat. |
| P6 | **New: every ordinary action says what it did** (G16). With the UI chat; the fight half is with the combat chat. |

The first-pass table follows for the record.

| Code | Step | Why here | Done when |
|---|---|---|---|
| P1 (done 2026-11-13, see the repair section) | Make the earned saves load again, and add a check that fails when a tracked change strands them. | Every other step needs a mid-life save. 49 Klein slices and Harry's Book 1 are unreachable until this is fixed. | `lotm-kjw49`, `hp-w11-farewell` and `ri-fang-yuan-class-chair` boot through the game MCP; the check runs with the fixtures. |
| P2 | Rerun C1 to C4 on those three mid-life saves. | This audit saw only the opening, exam week and a stand-in. G2 may be milder mid-life. | Three updated lead files and the two missing cold-reader runs. |
| P3 | Give the Gu keeper loop Fang Yuan's day: the academy schedule, stones as income, one rival, and a daily cost that makes skipping a day matter. | It is the only loop that already works (G3), so it is the cheapest place to prove a full day. | The blank-day test passes all five links in a Fang Yuan save. |
| P4 | Build the shared day for all three: time shape, one way to earn, people present, one practice that improves. | The same four gaps appear in every lead (table above), so one foundation serves three lives. | Klein and Harry each pass link (a), (d) and (e). |
| P5 | Scope each life's screen to that life, and put each owned thing's state and actions on its own row. | G6 and G7 are cheap and visible. | A cold reader finds its Gu, class or money in five actions. |

## Limits of this audit

- First pass: three sonnet agents and three haiku agents, six at once (the repo default is two). Rerun: three sonnet and three haiku, two at a time. One coordinator. No human play.
- The first pass judged stand-in saves; the rerun used one mid-life save per lead, played 1.7 to 3 days each, short of the week C1 asks for.
- C4 has one run per lead. A cold reader is a cheap model, so "not reached" shows the screen did not lead it there, not that no route exists.
- The first Harry rerun was wrong in an instructive way (G10); the replay corrected it. Fang Yuan's count was checked the same way. Klein's G13 and G14 were not rechecked.
- C2 probes are a sample chosen by the agents, not a census.

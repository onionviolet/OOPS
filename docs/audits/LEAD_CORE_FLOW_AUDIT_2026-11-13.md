# Lead core-flow audit, 2026-11-13

Status: findings and proposals (AD32). Nothing here is accepted direction and no
game code changed. Agent-verified by headless play on the live tree, not
human-reviewed.

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
| G6 | **Each life shows other lives' leftovers.** Harry's dormitory showed "Dudley's birthday" and "Patrol blocked: return the loaned kit". The keeper life listed Trade standing, Potioneering and Patrol & custody. Raw ids reach the screen ("Away: book.hp.lead.dormitory"). | Harry audit, Fang Yuan cold reader. | Seen in play. |
| G7 | **A new player cannot find their Gu.** The cold reader spent 15 actions and did not find which Gu it owned or what they eat. The answer sits in Notebook, "Your beginning". Inventory rows and Find results are not clickable. | Fang Yuan cold reader, goal 1 not reached. | Seen in play, one run. |
| G8 | **Actions give no result line.** A Moonblade throw spent 4 essence and reported nothing. Essence regenerated overnight at the cap is lost without a note. | Fang Yuan cold reader goal 3; keeper C2 silent case. | Seen in play. |
| G9 | **Headless play is slow.** About 5 game minutes per wall second, so one in-game day takes about 45 seconds and a multi-day step passes the 300 second call limit. | Coordinator step receipt (870 minutes in 161 s); two agent sessions killed by timeouts. | Verified. This is why a week-long test is expensive. |

One agent claim did not reproduce. The Klein audit reported that the clock stops
near midnight of day one and that every time step fails with "Unknown simulation
participant book.ri.keeper.moon". The coordinator stepped `lotm-klein-wanted`
from day 1 08:01 to day 2 00:31 with no page error. The claim may hold for the
fresh "Be Klein Moretti" start, which was not rechecked. Treat it as open.

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

Proposals for Weibao, ranked. P1 is a repair; P2 to P5 are build order.

| Code | Step | Why here | Done when |
|---|---|---|---|
| P1 (done 2026-11-13, see the repair section) | Make the earned saves load again, and add a check that fails when a tracked change strands them. | Every other step needs a mid-life save. 49 Klein slices and Harry's Book 1 are unreachable until this is fixed. | `lotm-kjw49`, `hp-w11-farewell` and `ri-fang-yuan-class-chair` boot through the game MCP; the check runs with the fixtures. |
| P2 | Rerun C1 to C4 on those three mid-life saves. | This audit saw only the opening, exam week and a stand-in. G2 may be milder mid-life. | Three updated lead files and the two missing cold-reader runs. |
| P3 | Give the Gu keeper loop Fang Yuan's day: the academy schedule, stones as income, one rival, and a daily cost that makes skipping a day matter. | It is the only loop that already works (G3), so it is the cheapest place to prove a full day. | The blank-day test passes all five links in a Fang Yuan save. |
| P4 | Build the shared day for all three: time shape, one way to earn, people present, one practice that improves. | The same four gaps appear in every lead (table above), so one foundation serves three lives. | Klein and Harry each pass link (a), (d) and (e). |
| P5 | Scope each life's screen to that life, and put each owned thing's state and actions on its own row. | G6 and G7 are cheap and visible. | A cold reader finds its Gu, class or money in five actions. |

## Limits of this audit

- Three sonnet agents and three haiku agents, one coordinator. No human play.
- Each lead was judged on a stand-in save (see the first table).
- C4 has one completed run.
- C2 probes are a sample chosen by the agents, not a census.
- Nothing was committed by this run.

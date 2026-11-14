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
| G13 | **New, unconfirmed. Klein's screen may contradict itself.** The UI chat could not reproduce these at load on `lotm-kjw37`, and the record is thin. Rent: the cold reader saw "This week's rent of 5 soli is due in 4 days" in Work & merit and "Rent and dues paid: 1 pound 15 soli" in Reports at load, which can both be true (past weeks paid while away, this week still due); its "due 3 days ago" notice has no panel recorded. Clocks: the 8 hour gap is between the on-screen header and the game MCP's status readout, so it is probably the harness and not the screen. Seer potion line: on "Cogitate quietly" and on a disabled twin of Spirit Vision, after about a day of play; place not recorded. "No one else is here": at the Moretti flat, with People marking Dunn and Rozanne as here; step count not recorded. |
| G14 | **New, fixed by the coordination chat's worker in 86a0404d8 (not rechecked here). Spending banked time wedged stepping.** After "Spend 1 h of banked time", every later step failed with "Cannot nest advanceTicks." until a reload. Seen once, headless only; not rechecked in a browser. |
| G15 | **New. The Beginning panel lists the whole road ahead.** About 88 future step titles for Fang Yuan, and Harry's later continuations by name. Klein's day 53 carries thoughts about late-book matters. |
| G16 | **New. Ordinary actions give no result line.** Harry's charm practice, cast and flask hand-in; Fang Yuan's story step ("Command saved."); the keeper's "Put the Moonlight Gu to work · 1 essence, 1 stone", where the stone is a gain and the label reads as a cost. |
| G17 | **New (from the UI chat, checked here 2026-11-14). Klein's charged rent is not the book's.** `src/book_world_lotm_duties.js` charges a flat 5 soli a week, marked `basis: 'assumed'` with a comment that the source gives no figure. The local cast, built from the book, gives two: the old flat at 5 soli 6 pence a week, and 2 Daffodil Street at 12 soli a week plus 3 pence for furniture after Benson's bargaining (first quote 13 soli and 5 pence, deposit 2 pounds), paid weekly on a one-year lease. Klein's notebook in `lotm-kjw37` already records 12 soli 3 pence. Under AD49 the charge should follow the source. Not changed here: the amount is one fixed number read by the duty, the collector, the household line and about a dozen tests, and the right fix makes it follow where he lives (66 pence before the move, 147 after). No pinned hash moves and saves hold miss counts, not amounts, so no alias is needed; arrears in old saves would be re-priced. Listed as P7. |

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
| P7 | **New: charge Klein the book's rent, by home** (G17): 5 soli 6 pence a week at the old flat, 12 soli 3 pence at 2 Daffodil Street. Small runtime slice in the duties seam; it also makes his week about 2.4 times dearer after the move, which sharpens the missing income in P4. |

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

## Ordinary-day round, 2026-11-14 (map and loops)

Status: findings and proposals (AD32). Asked by Weibao on 2026-11-14 ("Daily day to day actions? more gameplay loops?",
[direction log](../gm/USER_VISION_LOG_2026-11.md#play-surface-ui-per-feature-combat-across-worlds-daily-loops-2026-11-14)).
It reopens the 2026-11-03 daily-life pause for the three leads only. The "today" column reuses the mid-life rerun and G1 to
G17 above rather than replaying them; one new probe was run (Fang Yuan at his endpoint, below).

### Endpoint saves

| Lead | Endpoint asked | Save that stands there | Note |
|---|---|---|---|
| Klein | Tingen through ch129 | `lotm-kjw42` (harbor emergency); `kjw43` starts at ch130 | Earned saves run on to `kjw49` (ch163). Days were judged on `kjw37`, the quiet fortnight. |
| Harry | Book 1 | `hp-w11-farewell` | Year over, no ordinary days ahead. Days were judged on `hp-w7-halloween`, the ordinary weeks before the first match. |
| Fang Yuan | Qing Mao departure, ch140 | `ri-fang-yuan-ice-crystal` | Earned saves run on to ch171 (`ri-fang-yuan-lycan`). |

New probe, `ri-fang-yuan-ice-crystal` through the game MCP (seed 1): day 219, winter, Clan academy. He holds 792 primeval
stones, Moonglow Gu, Four Flavours Liquor Worm, White Jade Gu, Stealth Scales Gu, Plunder Gu, Earth Communication Ear Grass,
25 jars of green bamboo wine, 8 Moon Orchid petals, 30 battle merit and 6 hidden lightning wolf eyes. His essence pool is
3 of 44 parts. Every one of these is an inert row: no feed, buy, draw-a-stone, exchange or patrol verb anywhere, and the
Beginning panel offers only story steps. G11 holds at the endpoint, not only at the class chair.

### The ordinary day: canon, game, gap

| Lead | What the ordinary day holds in canon at the endpoint | What the game offers today | Gap |
|---|---|---|---|
| Klein | Office hours at Blackthorn Security (reception, copying, the archives); mysticism lessons with Old Neil; the Wednesday combat practice with Gawain; turns on the Chanis Gate watch; acting as a Seer to digest the potion; rent, Benson's and Melissa's household, savings toward a better house. Weekly wage £3 (£2 10s plus a 10s allowance), the £12 advance repaid at half pay, rent 12s 3d a week at Daffodil Street. | Weekly expense chit that warms Dunn (G2, link c present); rent as a standing order at an assumed 5 soli (G17); furniture and fitting; coin divination over 22 fixed questions; Spirit Vision; Wednesday practice as a story task. | No work shift and **no pay at all** on the lead life (the wage exists only for the civil-clerk entry, `book_world_lotm_livelihoods.js`), so savings only drain. Practice gives no number (G5). People absent at home (G13). |
| Harry | A weekly timetable (Potions double on Friday, Astronomy at midnight, Herbology, Transfiguration, Charms, flying on Thursday), homework, the library, meals in the Great Hall, house points won and lost, time with Ron and Hermione, Quidditch practice once on the team. | Lessons, charm practice, brewing after Potions and sessions with Ron, all inside the collapsed Beginning panel (G10). A weekly class slot exists as a duty (`book_world_hp_duties.js`) but the lessons themselves are one-off rows. | Nothing recurs the next day (link d missing). Practice says it improves but shows no number (G16). No library, other people or house-point use. |
| Fang Yuan | Feed each Gu on its own clock (Moonlight line two petals twice a day; a jar of wine lasts the Liquor Worm four days; White Jade eats eight liang of jade rock every twenty days), buy their food in the village (ten petals a stone, a jar two stones), draw stones to refill his sea, and during the wolf tide go out for battle merit (a wolf eye is ten merit, 25 merit a stone). About 5 stones a day for four Gu, living and cultivation (ch64). | Nothing. The keeper life one pack over has feed, tend, work and refine (G3) but his own life has none of it (G11). | The thinnest of the three: links (a), (b) and (d) missing. Largest gap, so built first. |

Canon figures for Fang Yuan come from the repo's own source notes (`docs/research/novels/reverend-insanity/`, the
`RANKS_ECONOMY` tables, and the lead packs' item text). Not found there: what Moonglow, Four Flavours, Stealth Scales,
Plunder and Ear Grass eat, essence per stone, and the estate's rent.

### Proposed loops

Granularity is a dial per lead (ACR1, ACR3): one action per meal or purchase where the timing is the choice, a routine
where it is not.

| Lead | Day loop (verbs) | Longer loop it feeds | Built on |
|---|---|---|---|
| Fang Yuan | Feed each Gu when its meal comes due; buy petals, wine and jade rock with stones; draw a stone into the sea; hand in wolf eyes and exchange merit; go out on a wolf-tide patrol. | Patrols earn merit, merit becomes stones, stones buy food and refill the sea, and the surplus is saved for the next refinement or rank. A hungry Gu will not cut, so a skipped meal blocks the day's patrol (link d). | `living_upkeep.js` diets and the needs seam (LVR13), a structured extension on his own life (no pinned hash moves), LVR18/LVR19. |
| Klein | Go to the office (a shift with a choice of desk, archive or watch); collect the week's pay from the accountant; lessons with Old Neil; practise acting as a Seer. | Wage to rent to savings: £3 a week in, the advance repaid at half pay for eight weeks, rent by home (P7), savings toward Daffodil Street and ingredients. Acting as a Seer digests the potion (the improving aspect). | `recurring_duties.js` (the civil report and guard shift already use it), `book_world_lotm_lives.weeksOwed`, `livelihoods.js`, P7. |
| Harry | Attend the day's lessons by timetable; homework or library study; practise a spell with its chance shown; meals and time with friends. | Study to marks to exams (the June papers already exist), and house points from lessons and conduct to the House Cup. | `HP_DUTIES` class slot widened to a timetable, `book_world_hp_lessons.js`, `book_world_hp_exams.js`, the practice bench extension. |

Constraints, as default, dial and reason:

- **Meals.** Default: canon diet where stated; a Gu with no stated diet eats like the Gu it was made from (Moonglow as
  Moonlight, Four Flavours as Liquor Worm). Dial: each row of the diet table. Reason: AD49 fixes the stated numbers, and a
  fused Gu's parent is the nearest evidence.
- **Hunger.** Default: a hungry Gu does not work and nothing dies (LVR15). Dial: a world or a later canon slice can make a
  long-starved Gu degenerate (the book shows it, ch105). Reason: the book's consequence exists but its timing is unstated.
- **Income.** Default: a patrol pays a fixed 50 merit (two stones); figures not in the source are labelled authored. Dial:
  per patrol and per wolf-tide phase. Reason: enough to cover a day's upkeep with little spare, so saving takes choices.
- **Not done here.** Klein's and Harry's loops are proposals until built; the live fight stays with the combat chat, so a
  patrol is a compressed routine (ACR1) that a fight can replace.

### Build state

Recorded in the [build note below](#ordinary-day-build-2026-11-14) once a loop is playable.

## Ordinary-day build, 2026-11-14

Fang Yuan first, as the largest gap. Proposal under AD32; agent-verified, not human-reviewed. State: was below floor on FLR3; met since the UI chat's b00b56374 and 2d48e8948, rechecked on this save in Chrome (follow-up below).

**What is playable.** On his saves from Rank Two on, the Beginning panel offers "Keep your own day: feed your Gu,
draw stones, earn merit". Adopted, it adds ten repeatable actions at the clan academy:

- feed the Moonglow (two petals, morning and evening), the Four Flavours Liquor Worm (a jar every four days) and the White
  Jade (a parcel of jade rock every twenty days);
- buy petals (ten for a stone), wine (two stones) and jade rock (six stones, authored);
- draw a whole stone into his sea (one stone, up to 30 parts);
- hand in a hidden wolf eye (+10 merit) and exchange 25 merit for a stone;
- go out on a wolf-tide patrol (3 h, 10 parts, +50 merit, authored).

Proven in play on `ri-fang-yuan-ice-crystal` only. All 22 earned saves from `ri-fang-yuan-rank-two` on stand at the academy, where the actions run (checked by reading each save's location, not played). A Gu fed recently refuses food. A Gu that misses a meal is hungry, and a hungry Moonglow blocks the patrol until it is fed.
A patrol also needs the essence that drawing a stone restores. Feeding is the day loop; patrols, merit and stones are the
longer one.

**Seam.** `src/ri_lead_day_facts.js` holds the diet rows on `living_upkeep.validateDiet` and reads hunger through
`dietNeed` (LVR13). The last meal is the `at` of the feed note, so the slice adds no save key. One facts line sits in
`simulation_effects.buildSimulationFacts`. The verbs are a command extension (`src/world_packs/book_gu_lead_day.js`, one
registration line), adopted like any continuation, so no pinned hash moves and old saves load unchanged.

**Floor (AD43).**

| Line | State |
|---|---|
| FLR1 build | Bundle built from `6231596d7` plus the four source paths and served from a private tree, because other sessions rebuild the shared `dist/` mid-run. `dist/bundle.js` sha256 begins `981a1ddf2895305d`; the committed bundle is rebuilt the same way at commit time. |
| FLR2 route | Earned private save `ri-fang-yuan-ice-crystal` (ch140), not a fresh life. Headless journey first, then headless Chrome at 1920×1080 from a fresh origin. |
| FLR3 shown | **Below floor.** Every action names its cost in the label, and a blocked action carries its reason ("Your Moonglow Gu is hungry and will not cut. Feed it first."; "The Moonglow Gu ate recently and will not take more yet."; "You need 10 parts of essence in your sea."). But in Chrome a blocked action moves to the "Not available yet" list, which shows only the next three entries (`NOT_YET_SHOWN`, the G15 cap), and the shut story steps take those slots. So the blocked patrol vanishes with its reason (card `hidden=true`, seen at 1920×1080); the reason was asserted only in the headless DOM. Sent to the UI chat (it edited `structured_pack_ui.js` today): exempt repeatable actions from the cap. Also: completed actions leave no Reports line (G16), only the status note and the Inventory. |
| FLR4 used | Stones, petals, wine, merit and essence are the same items and pool his story steps already read (fusion stone costs, parts gates). The Moonglow's hunger is read by the patrol gate. The Liquor Worm's and White Jade's hunger is shown and charged but **nothing reads it yet**. Next: a reader from canon, for example the worm's refining of essence or the jade skin's defence, not an invented gate. |
| FLR5 kept | Chrome: adopt, feed, draw (essence 3 to 33), patrol (merit 30 to 80), save, reload (all held), 900 minutes unfed (patrol blocked), Export, Import (adoption, items and the hunger block held), feed (patrol open). No page errors. |
| FLR6 labelled | Agent-verified, not human-reviewed. Route kind: earned save. |

Checks: `node --test tests/ri_lead_day.test.js` (5 pass), `tests/ri_lead_day_journey.test.js` (slow tier, 1 pass, 55 s;
skips without the private checkpoint), `check:arch` (no growth), `check:rules`. In `check:rules` the receipts step fails on
`docs/gm/dispatch/play-surface-2026-11-14/CHECKPOINT.md`, which is not this lane's file. The steps after it pass when run
on their own.

**Compatibility.** The extension's labels and descriptions carry the dials and diet text, so they are part of its content hash. Tuning any number in `ri_lead_day_facts.js` (patrol merit, jade price, stone parts, a diet) changes the hash, and a save that adopted revision 1 stops loading with "Restore the exact school extension content" (the G1 trap). `lead_saves_load` does not catch it because no earned checkpoint has adopted the day. A dial change therefore needs a revision bump with an `identityAliases` row, or a stated break (old saves are disposable).

**Limits and next.** Meals restart from the first feed after adoption (dial: anchor at adoption). Stealth Scales, Plunder
and Ear Grass do not eat yet: the source notes give no diet, and the Earth Communication Ear Grass item text names ginseng
with no amount. The patrol is a fixed routine, not the live fight (combat chat). Actions sit in the Beginning panel, which
starts collapsed (G10, UI chat). Klein's wage loop is next (proposed loops above).

### Follow-up: a sea that refills and a patrol that can go many ways, 2026-11-14

Weibao asked whether stones are the only way to refill, and asked for random encounters and wolf attacks on patrols
(through the coordinator: "Is primeval stones the only way to do that? Radon encounters or some wood attaches during the
patrols?", read as random encounters and wolf attacks). Adjustable defaults (AD56, AD38).

- **Natural recovery.** His seat had none: the lead life compiles no regeneration event, and its base hash is pinned. Now his
  sea refills by itself at his aptitude's pace, which `gu_aperture.js` states for C grade as 4 points of the aperture an hour
  (ch10): one part every 15 min, so an empty 44-part sea fills in 11 h. A stone is still the fast route.
  - The settling runs in a domain `stage` hook (`src/ri_lead_sea_domain.js`) that every expansion write passes through.
  - One long write equals many short ones, so banked time spent later gains what played time would (TMR4). A full sea banks
    nothing.
  - Save slice `ri_lead_sea` = {schema 1, at}. A save without it starts recovery at load, with no back pay.
  - Default: on from his first act of the ordinary day, so verified story replays keep their numbers. Dial: the grade row.
  - The rate is stated on the day's description and on the stone action.
- **Patrol encounters.** The patrol is now a walk (3 h, up to 15 parts) and a report to the board. The report is a seeded
  draw from the save's seed, through the engine's own outcome roll, over eight authored rows:
  - a quiet watch, a small pack and a large pack (bigger packs pay more merit and keep more of the 15 parts);
  - carcasses with two eyes, or a wild Gu;
  - an injury, which blocks patrols until "Bind your wound and rest · 6 h";
  - a scout from another clan;
  - a wolf attack.
  Each row leaves a result note, about 49 merit a patrol on average. `RI_PATROL_FIGHT_ROWS` (the wolf attack) and the fact
  `book.ri.lead.day.last_fight` are the hook where the combat lane can swap in the live fight; until then it is a compressed
  routine (ACR1).
- **Floor.**
  - FLR1: bundle built from `2d48e8948` plus five source paths and served from a private tree (sha256 begins `33ca07ca299fe862`).
  - FLR2: earned save `ri-fang-yuan-ice-crystal`; headless journey test, then Chrome at 1920×1080.
  - FLR3 met: a blocked patrol keeps its reason in the day list (UI chat, b00b56374). The report's line shows the night,
    for example "Done: Report the watch to the alliance board. A wolf got under your blade and opened your arm. …" (UI chat,
    2d48e8948).
  - FLR4: merit, eyes, essence and the injury gate are read; the wild Gu has no reader yet.
  - FLR5: save, reload, Export and Import kept the adoption, the merit, the wound and the sea's settlement. The sea went from
    41 to 44 in two idle hours after a reload. No page errors.
  - FLR6: agent-verified, not human-reviewed.
  - Checks: `tests/ri_lead_day.test.js` 7 pass; `tests/ri_lead_day_journey.test.js` pass; `test:changed` 3611 pass, 0 fail;
    `check:arch` no growth; the rules checks pass.
- **Seen.** This save's seed opens with two injury draws in a row; over 2,000 draws the shares match the weights. The
  extension is now a bundled continuation (instant outcomes need it). Nothing had adopted revision 1 outside tests, so no
  alias is needed.
- **Wolf at the wall (later the same day).** The coordinator asked that a wolf-attack night call the combat lane's live hunt
  (`ri.wolf.tide`, ea9cbe543), passing essence, wound and merit in and applying what comes back. The interface, proposed to
  the combat lane, uses one fact as the handoff:
  - The wolf row no longer pays or wounds. It sets `book.ri.lead.day.wolf_at_wall`, published as `wolf_waiting`.
  - While the wolf waits, the patrol is blocked ("A wolf is still at the wall…").
  - Either the live hunt settles it, or the compressed fallback "Let the watch drive the wolf off · +25 merit, a bite" does.
  - The hunt already reads the essence pool, the hunger fact and the wound. The proposal adds: clear the fact, and pay
    `RI_WOLF_AT_WALL.killMerit` (75) for a kill or set the wound on a loss.
  - Numbers have one authority, `RI_WOLF_AT_WALL` in `ri_lead_day_facts.js`.
  - The combat lane's side is theirs to land; the standalone hunt is unchanged.
  - Proof: the wolf is reached by DEV setup (the save's draw seed set to 14848, whose next draw is the wolf row; no
    other state edited). The first 20 draws on this save's own seed hold no wolf.
  - Headless: the report line reads "A lightning wolf leapt the wall…", and driving it off pays 25 merit, clears the wolf
    and sets the wound.
  - Chrome at 1920×1080 (bundle from `ff2f94063` plus two paths, sha256 `33378431…`): the patrol shows the wolf reason, and
    the drive-off result held through reload and Import. No page errors.

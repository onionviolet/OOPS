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
| G18 | **New (2026-11-14, wage slice). Late LOTM saves stall headless Chrome at PLAY.** kjw42 (ch129) and kjw33 leave the renderer above 100% CPU, and no JavaScript pause point is reached. This held on the HEAD tree too. kjw33 reached a usable page on 2026-11-10 (WIN2). Every Klein-side browser proof waits on it. **Fixed 2026-11-14 (UI chat, UIC203, bb822ec5f).** A CPU profile showed no infinite loop: the navigation polls the panel list every 500 ms, the list asked each panel's `discovered()` twice, and the Tingen panel answered by building its whole workroom view (every cast command quoted, about 0.75 s on kjw42), so the page never went idle. The workroom now answers from the life itself, and the list asks once. A load follow-up (UIC205) dropped the backlog of stale timer ticks HackTimer queued during the boot and three more costly polls. In the rebuilt bundle at 1920×1080, kjw42 and kjw33 now open in about 14 s from a fresh browser context, and save, reload and import keep the world, with no page errors. Details are in the UI audit's G18 section. |

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

### Klein's weekly wage, 2026-11-14

Loop K1 from the table above: £3 a week in, with the advance repaid at half pay. Rent by home (P7) is not part of this slice.

- **What plays.** Under Here, a "Weekly pay" block appears once his save holds the Nighthawk contract note
  (`book.lotm.kj3f.contract.terms`).
  - "Draw your weekly pay" starts the weeks.
  - Each closed week can then be collected: "Collect your pay · 1 pound 10 soli". The block names what is kept against the
    advance and what is still owed.
  - After eight weeks the advance is repaid, and the full £3 comes through.
- **Default, dial, reason** (`WAGE_DIALS` in `src/book_world_lotm_wage.js`):
  - The weekly pay (720 pence), the advance (2,880 pence) and the kept share (half) are stated by the contract and the
    advance slip.
  - The weeks count from his own first draw. The reason: the story replay pays the canon weeks it shows as scenes and never
    takes the advance back, so the whole advance is still owed when the ordinary weeks begin.
  - A save without the advance slip is paid in full.
- **Shape.** It copies the money seam's `book_world_lotm_pay.js`:
  - one purse effect per collection;
  - progress kept as a SET fact (`book.lotm.wage.paid`), so a replay cannot pay twice;
  - elapsed weeks derived from the `.at` of the start note `book.lotm.wage.start`.
  No save slice and no second money counter. The host verbs are `startWage` and `collectWage`, beside the guard's pay.
- **Why not a `registerPayLine` row.** A pay line pays one fixed figure per week, one week per collection. This wage keeps a
  share against a debt until the debt is cleared, and pays every closed week in one draw. Both need a running view of the
  advance, so the wage is a sibling of that seam rather than a row in it. Folding the advance into the pay seam as a
  "kept against" step is a possible later merge.
- **Compatibility.** Additive. An old save shows the start offer, and nothing is paid until it is taken.
- **Not done.**
  - The advance has no row in Ledger > Owed yet.
  - Rent is still the flat 5 soli (G17, P7). The book gives 5 soli 6 pence at the old flat and 12 soli 3 pence at 2
    Daffodil Street after the lease ends (`kj3n.franky.deal`).
  - Charging rent by home needs the duty set's defs read per state in `duties_domain.js`. Today the amount is a frozen
    number, read in five places.
- **Checked.**
  - `tests/lotm_wage.test.js` covers the canon figures, eight weeks at half, the full wage after, one SET per draw and no
    advance slip.
  - Headless on his ch129 save (lotm-kjw42):
    - The offer, Start and the first week's countdown play.
    - From a DEV setup a week into the wage (start note backdated three weeks, one week already paid; no other state
      edited), collecting pays 720 pence for weeks 2 and 3 and keeps 3 pounds. The block then reads "7 pounds 10 soli still
      owed".
    - That result holds through reload and through Export then Import.
  - A live seven-day step was stopped after 11 CPU minutes without finishing. Under the headless runner a late LOTM life
    ticks very expensively.
- **Below floor: the browser gate (FLR) is not met.**
  - In headless Chrome at 1920×1080 the page never got past PLAY on late LOTM saves (kjw42 at ch129, kjw33). This held with
    four launch routes: the fixture opener, a forced click, the playtest `Session` with a frozen wall clock, and the
    restamped save.
  - The renderer sits above 100% CPU, and no JavaScript pause point is reached in two minutes. That suggests layout or
    style work rather than script, but it is not confirmed.
  - The HEAD tree without this change stalled the same way for at least six minutes before it was stopped.
  - kjw33 reached a usable page in Chrome on 2026-11-10 (WIN2), so this is a likely regression since then. It blocks every
    Klein-side browser proof, P7's included, and is recorded as finding G18.
- **Browser gate met (later the same day), after G18's fix (bb822ec5f).** Chrome at 1920×1080 on kjw42, playtest `Session` (frozen wall
  clock), bundle from HEAD `66f9b67e2`, sha256 `48e3a43a…`:
  - The offer reads "Your Nighthawk wage is 3 pounds a week…". After Start: "Nothing owed now. The next week closes in 7 days."
  - From the same DEV setup a week into the wage, the block reads "Owed now: 3 pounds for 2 weeks (3 pounds kept against the
    advance)". Collecting adds 720 pence and leaves 7 pounds 10 soli owed.
  - That held through reload and through Export then Import. No page errors.
  - The slice is at the floor: agent-verified, not human-reviewed.
  - Friction seen (PS8): Home still names the Moretti flat, with rent at a flat 5 soli. That is P7.

### Follow-up: wolf parts instead of merit, 2026-11-14

Weibao, through the coordinator: "Rather than merit immediately it could be like part of the wolf drops and then I can trade that in
for merit or something." These are adjustable defaults (AD56, AD38) under the play-surface round's PS2 to PS4.

- **Source check (AD49).** The clan credits wolf-tide kills by eyeballs handed in at the merit board: one lightning wolf eye is
  10 merit, 25 merit is a stone, and 5 merit is 500 g of rice (ch127, ch132). So the eye as the proof is canon. Everything else
  below is authored and labelled as such in `RI_DAY_DIALS`.
- **What plays.**
  - A patrol night yields parts: eyes, a lightning wolf hide, wolf meat by the jin, and watch tallies for kills shared with the
    watch. It never yields merit.
  - Merit is paid only at the alliance board:
    - "Hand a wolf eye in" pays 10 merit (canon).
    - "Hand a watch tally in" pays 10 merit (authored: the share of a kill you did not finish).
  - A hide sells at the stalls for 2 stones. Fresh meat sells to the village kitchens, 3 jin for a stone. Both prices are
    authored.
  - Meat keeps about three days (a `PERISHABLE_LOTS` row in `spoilage.js`, clocked from the `book.ri.lead.day.meat_got` note).
    After that it cannot be sold and is thrown to the dogs; nothing vanishes on its own (ITM22).
  - "Let the watch drive the wolf off" now gives a watch tally and a bite, with no merit.
- **One merit writer (PS3).**
  - `GU_LEAD_DAY_BOARD` names the two board commands.
  - `tests/ri_lead_day.test.js` checks that they are the only day commands that add merit, and that no runtime module outside the
    day names the merit item.
  - The one known exception is the combat lane's hunt hook (`KNOWN_MERIT_WRITERS`), until it drops parts.
- **The interface with the combat lane** (agreed 2026-11-14):
  - Part names and counts belong to `RI_WOLF_PARTS` in the foundation run's `ri_wolf_tide.js`.
  - The items belong to `RI_WOLF_PART_ITEMS` here.
  - A kill adds the parts and writes the meat note.
  - A drive-off, a held-back fight or a fled wolf gives one tally (`RI_WOLF_AT_WALL.tally`).
  - `killMerit` and `driveOffMerit` stay exported, deprecated, until that hook lands.
- **Compatibility.** The day extension is now revision 2, so its content hash moved. A save that adopted revision 1 needs the
  extension adopted again. Old saves are disposable (standing decision), so no alias was added.
- **Not done.**
  - ~~The patrol weights are still static.~~ Done in [the tide follow-up](#follow-up-the-patrol-follows-the-wolf-tide-2026-11-14).
  - Meat added to a spoiled lot restarts the lot's clock.
  - No flesh-eating Gu is in his kit, so meat has no feeding use yet.
  - A kept eye has no refinement use in the day yet.
- **Checked.**
  - `tests/ri_lead_day.test.js` covers the one merit writer, the parts on a large-pack night, the meat lot's three days and its
    sell and throw gates.
  - `tests/ri_lead_day_journey.test.js` (his ch140 save) checks that a reported night pays no merit, and that an eye handed in
    pays 10.
  - Chrome at 1920×1080, on the ri-fang-yuan-ice-crystal fixture with the day's seed set to 7680 (DEV setup: the next draw is
    the large pack; nothing else edited). Bundle: HEAD `3e971853c` plus three paths, sha256 `91383f87…`.
    - The report took eyes from 6 to 9, a hide to 1, meat to 6 jin and tallies to 2, with merit unchanged at 30. Inventory
      names "Lightning wolf hide", "Wolf meat · jin" and "Watch tally".
    - The eye hand-in took merit from 30 to 40, and the tally from 40 to 50.
    - The hide sold for 2 stones, and 3 jin of fresh meat for 1.
    - Three days on, selling was refused ("The meat has spoiled. Nobody will buy it; throw it out."), and the last 3 jin were
      thrown out.
    - A second run with the same setup held all counts through reload and through Export then Import. No page errors.
- **UI friction seen on his screen (PS8, for the UI chat):**
  - Eyes from a patrol join the story's "Hidden lightning wolf eye" stack, so a fresh eye reads as hidden.
  - Every item in his Inventory reads "0 coins".
  - The panel header says "Calendar unknown here".
  - The day's result line does not show in the panel's status after a report; only the "Last watch" status row carries it.

### The shared day shape (PS5) and Harry's school week, 2026-11-14

Every lead's ordinary day is built to one contract, so a later "keep my day" routine (PS9) and other lives can reuse it.
Proposal under AD32 and AD56; the parts restate ACR1, ACR6, ACR8 and LVR19.

| Part | What it is | Why |
|---|---|---|
| Day verbs | Each verb is one command with a place, a duration, its costs, one gate per reason (with the words saying how to open it) and one result note. | ACR2: a verb uses actual means and the local clock. A routine reads the same gate a player reads. |
| Clock | The life's own clock and calendar owner. No new minute counter. | One authority per fact (AR3). |
| Longer loop | What the verbs build up, kept by an owner that already exists (an item, a SET fact, a power, a skill, a purse), and read by one later consumer. | LVR19: work done, output and pay stay separate facts. |
| Result line | A knowledge note per verb, shown as an extension status row. | ACR5: the player sees what changed. |
| Routine hook | Gates stop at a decision (hunger, a wound, a wolf at the wall, a class missed). A policy names which verbs to repeat and when. | ACR8: compression splits at a decision boundary. The routine itself is PS9. |

Filled in for the three leads:

| | Fang Yuan | Klein | Harry |
|---|---|---|---|
| Form | Command extension (`book_gu_lead_day.js`) | Host ports in the LOTM domain (`book_world_lotm_wage.js`), because the wage is a money seam | Command extension (`world_packs/book_hp_lead_day.js`) |
| Verbs | Feed, buy food, draw a stone, patrol, report, hand in, sell | Start drawing pay, collect the closed weeks | Go to a class on its hour, write its homework |
| Clock | Diet clocks from the feed note's `at` | Weeks from the start note's `at` | The lead lesson clock and term gate (`hpLeadMinute`, `hpInTerm`) |
| Longer loop | Parts to merit to stones to food and essence | Pay against the advance, then savings | Class notes and marked homework to the June paper |
| Owner of the count | Items and the board's merit | Purse, paid weeks as a SET fact | Items, read by `hpExamInputs` |
| Routine stops | Hungry Moonglow, a wound, a wolf at the wall | None needed (one verb a week) | A class past its quarter hour of grace |

Klein's wage is the one lead built as host ports rather than commands. It stays that way, since money goes through the
purse seam.

**Harry's week (loop H1).**

- **What it is.**
  - Charms and Potions keep their Monday hour and the class-slot duty.
  - Five subjects get a timetable (`HP_TIMETABLE`, `book_world_hp_day.js`). Each is a weekly window on `lessonAvailability`
    with a quarter hour's grace:
    - Herbology: Tuesdays, Thursdays and Fridays at 09:00.
    - Transfiguration: Tuesday 10:00 and Thursday 14:00.
    - Defence: Wednesday and Friday at 10:00.
    - History of Magic: Monday and Friday at 14:00.
    - Astronomy: Wednesday at 23:00.
  - A class takes an hour and leaves a set of class notes. A piece of homework is owed per class held; writing it takes an
    hour and gives a marked piece.
  - The June paper for each of the five subjects reads what Harry holds:
    - Fluency is his notes against 24 classes.
    - Understanding is his marked homework against 12 pieces.
  - Before this change those papers had no play behind them.
- **Source.**
  - Stated in PS ch8: Herbology three times a week in the greenhouses, and Astronomy at midnight on Wednesdays.
  - The book has double Potions on Friday. This life already teaches Potions on Monday (an earlier proposal), so Friday
    morning is Herbology and Defence.
  - Every other hour is authored.
- **Dials, with reasons.** All are in `HP_DAY_DIALS`: the late allowance, class and homework lengths, and the counts for full
  fluency and understanding.
- **Compatibility.**
  - The extension pins the hash of the life it is registered on, as the Charms practice bench does. Harry's life hash
    does not move, and no identity alias is needed.
  - It adopts like any continuation.
  - With no notes held, exam chances equal the old baseline.
- **Why items.** Command extensions may not write actor resources (`structured_pack_definitions.js` allowedEffect). Notes
  he loses or gives away are also gone from his revision, which is the item's own mechanism.
- **Not done.**
  - House points. No owner holds a count, and the House Cup is a fixed canon result in the finale, so a tally would contradict
    it. This is the next longer loop.
  - Meals and friends are not part of the day yet.
  - Missed classes cost nothing beyond the lost notes.
  - The duty ledger still covers only Monday's slot.
  - No "next class" line on screen; the times are in the extension's description and in each gate's reason.
  - No ordinary player start reaches this (PS12).
- **Checked.**
  - `tests/hp_lead_day.test.js` covers: windows and grace, no class on Monday morning, in the holidays or before the
    Sorting; homework owed against notes held; notes and marked pieces raising the Herbology paper; every gate reading a
    published fact with a reason.
  - `tests/hp_lead_day_journey.test.js` (slow tier, his Halloween save): Herbology shut on Sunday night, open Tuesday 09:02,
    one class and one homework, both kept through a reload. It passed headless in 119 s on the working tree.

### Follow-up: the patrol follows the wolf tide, 2026-11-14

- **What changed.**
  - The Gu-world time session dated the tide (`riWolfTidePhase`: off, early, peak, ebb; RWT24-RWT27).
  - `ri_lead_day_tide.js` publishes `riEncounterWeights` as one fact per patrol row. The report's eight outcomes weigh those
    facts instead of the static table. Day extension revision 5.
  - A peak night brings more packs and fewer quiet watches. A thinned or ebbing wall brings more quiet watches. Finds and the
    scout are unchanged.
  - A life with no date, or a date outside the tide, keeps the static weights, because the `off` phase is neutral.
- **Compatibility.** Revision 5 moves the extension's hash. A save that adopted revision 4 adopts the day again. Old saves are
  disposable, so no alias was added.
- **Not done.**
  - The report line does not name the phase. The tide's own event book carries the date.
  - Prices stay fixed. The eye's ten merit is canon (ch132). A tide-season price for meat and hides would be authored, so it
    waits for a reason to exist.
- **Checked.**
  - `tests/ri_lead_day.test.js`: the report reads one weight fact per row, a dateless life equals the static weights, and other
    lives publish nothing.
  - `tests/ri_calendar_tide.test.js` (theirs) covers the shift by phase.
  - `tests/ri_lead_day_journey.test.js` passed headless (67 s), so the runtime resolves the fact weights.
  - `riEncounterWeights` costs about 0.05 ms a call, so it is safe in the per-frame facts build.
  - Chrome was not rerun for this change, so the tide's shift has not been seen on screen: implemented, below floor for
    browser evidence.

### Follow-up: places that change, and pursuits that look promising (PS143, PS150), 2026-11-15

- **PS143, built (51baec80d).**
  - `place_descriptions.js` lets a world add a line to a place's description.
  - Fang Yuan's clan academy reads the tide in the tide's own words: quiet, early, peak, ebb, and a line once the watch has
    thinned the wall.
  - Fang Yuan has no wall place to stand on, so the academy, where his day is kept, carries it.
  - **Not done.**
    - The box redraws when the place is drawn (arrival, a move, a load), not as the date passes while he stays put.
    - On a dated day before the first tide, the line says the packs "have gone back", which assumes a tide already passed. That
      wording belongs to the tide's owner.
    - Klein's streets after an event need an owner for "what happened here" in Tingen. None exists yet.
- **PS150, proposed and not built.**
  - Its home is the inquiry read side (`inquiryView`, `confidenceWord`, `effortMet`; ACR5 known coverage). It already tracks
    effort and coverage without the answer, which is "still promising, payoff hidden".
  - The first fit is Harry's library study or Klein's research, shown as a lead or rumour line beside the study.

### Klein's office day (loop K2), 2026-11-16

- **What it is.** `book_world_lotm_shift.js`: one shift a day while he holds the Nighthawk contract.
  - The reception desk at the Blackthorn Security front: 4 h from a 09:00 to 13:00 start.
  - The archives: 4 h from 09:00 to 15:00.
  - A turn at Chanis Gate: 6 h from 19:00 to 23:00.
  - The hours pass through the host clock (the cells-sentence route), then one result line goes to his knowledge and to Reports.
  - The line is seeded per day and kind, mostly quiet, never a case or a sealed truth. It counts shifts for the pay week, and the
    "Office hours" block shows the count.
- **Pay is untouched.** Pay is the weekly salary (`book_world_lotm_wage.js`). A shift pays nothing on its own and never gates pay.
- **Source.** Stated: the security front, archive reading, and the team's turns at Chanis Gate. The hours, lengths and lines are
  authored. Each dial keeps `why` in code and `say` for the panel (PRS1).
- **Open question for Weibao (a limit under AD56).** Should a week with no shifts cost something, such as a word from the captain
  or a docked week? Today it costs nothing.
- **Not done.**
  - A shift does not require walking to the office. The office place sits in the private cast pack.
  - A shift is a clock jump, not a job with progress and cancel (ACR7).
  - Export then Import on lotm-kjw49 was refused ("no room to safely keep this life"), with or without a shift: the import's size guard measured plain text, not the codec's stored form. Fixed 2026-11-16 (main.js `lifeSaveStorage` passes the codec measure through; tests/save_import_size.test.js); the shift now holds through Export then Import in Chrome.
  - The UI lane's Ready rows (`lotm_work_day.js`) can list the shifts from `shiftRead` and declare `uses` for "Next:" links.
  - Rent by home (P7) and the streets (PS143) are still open.

#### Office shift discovery follow-up, 2026-11-24

Klein can compare office shifts in Ready now and follow a choice to its control (AD44, AD51, PS57). “Keep the reception desk · 4 h” quotes the cost. The existing reason “You have already worked a shift today. The office expects you again tomorrow.” gives the tone for a closed shift (UR70–UR75, PRS4, PRS6).

Ready now reads the Tingen host's shift quote and opens the corresponding row in Work & merit. The office controls, count and last result move there from Here. Ready rows open a keyboard-focused action. Closed rows open its reason. A life without a contract has no shift rows. The office control still advances the same clock and records the result (AD38, AR3, CLR7, CLR8, UR100–UR127). This pass covers discovery, comparison, blocked reasons and working a shift. Travel to the office, mobile layout and other protagonists are outside the pass.

| Check | Evidence |
|---|---|
| FLR1 Build | `npm run build` passed in an isolated copy with the Ink inputs and notice file restored to LF. Chrome ran bundle SHA-256 `530713cc8b96978298ace0dd388b7fa1c4834515e495e724a1b404b13d0be00f`. |
| FLR2 Route | Composed Tingen office contract fixture. Started the public probationer life, advanced its clock to 10:00, and added the cast-adjacent seat and contract for setup. Clicked the pinned Ready now rows in Chrome at 1920×1080. |
| FLR3 Shown | Both morning choices quote four hours. The night watch quotes six and shows its 19:00 opening. Opening either row spends zero minutes. The ready link focuses the original control. |
| FLR4 Used | Working the archive shift spends 240 minutes, records one shift and one Reports entry, and closes the rest of the day's shift choices. |
| FLR5 Kept | Existing save schema. Save, reload, Export and Import into a fresh browser context preserved the shift count and observed result. |
| FLR6 Labelled | Agent-verified on the composed cast-adjacent route. The private protagonist pack is absent from this checkout, so the earned Be Klein route was not exercised. |
| Change surface | Tingen host, domain, work row projection and panel. No new registration lines, main imports or cycle edges. |
| Gates | 33 focused tests passed. The architecture comparison passed with paths normalized for Windows. The full flow check stopped at the Windows symlink permission error. The rules check stopped on register and local-path errors in untouched files. |

### Klein's streets: proposed event owner (PS143 for Tingen), 2026-11-16

- **Owner, proposal.** The Tingen event book (`lotmEventBook` in `book_world_lotm_events.js`, on `world_events.js`) records what
  happened at a place. A record gains a `place` (a Tingen place id) and a `lineKey`, and the place hook (`place_descriptions.js`)
  adds that line to the street's description on the days it covers.
  - The book already drives restrictions and the upcoming strip, so a street cannot disagree with a closure.
- **Found.** The private event pack holds one event (an early rail halt), and nothing in it carries a place, so there is nothing to
  show yet.
- **Wiring needed.** Tingen locations are created in three places, and each would pass `placeDescriber`:
  - `book_world_lotm_domain.js` line 10 (public places) and line 31 (cast places).
  - `cast_location_restore.js`, which resets `getDescription` to static text.
- **Built, 2026-11-16 (proposal, AD32, AD56).** Three street records in `src/lotm_street_events.js`, each with a place, a line and
  the hours of the Tingen day it shows. All three are recurring and authored:
  - A market day at the street market, weekly, 06:00 to 14:00.
  - A parish soup kettle on Iron Cross Street, every 5 days, 11:00 to 15:00.
  - A coal cart beside the Blackthorn office, every 3 days, 08:00 to 12:00.
  - `lotmEventBook` merges them with the private pack (or stands them alone without it). `lotmStreetLine` reads them. They close
    nothing, so restrictions and the upcoming strip are unchanged.
  - Wired: public places (domain `register`), cast places (`cast_location_restore.js` gained a `describe` option), and the domain
    tick redraws the place box when the street line changes with the hour.
  - Dial for later: the frequencies and hours are authored. A Tingen week calendar (TMR2) would put the market on a named weekday.

### Klein's rent follows his home (P7), 2026-11-16

- **Was.** The rent was a flat 5 soli a week (an assumed figure) wherever he lived.
- **Now (book figures, stated).**
  - The old flat costs 5 soli 6 pence a week.
  - After the move (`book.lotm.kj3n.moved`), 2 Daffodil Street costs 12 soli plus 3 pence for the furniture.
- **How it works.**
  - One duty id covers both homes. The duty set gained an optional `resolve(defs, state)` view (`duties_domain.js`), and
    `lotmRentDefs` picks the home's week, so the standing order, the arrears, the collector and the household all read one rent.
  - Duty items now carry `amount`.
  - The household line shows pence instead of rounding them away.
- **Dial, proposal.** Arrears from the old flat carry over to the new rent under the same id, counted in weeks. Pricing them at the
  old week, or ending them with Mr. Franky's lease, would need a per-week amount in the ledger.

### Handover from the daily-loops lane, 2026-11-16

- **Done this wave.** All Chrome-proven at 1920x1080, without dist.
  - D5 tide readout: 88d113af7.
  - PS150 study leads: bce6c5dde.
  - Harry's homework set and the "Next:" link: b66a13469.
  - Klein's office shifts: 683ebf416. The import size fix: 79aab1e06.
  - Klein's streets: dd8afb107.
  - Rent by home: 2d408371a.
- **Open, in order.**
  1. **D5 patrol count and merit ledger (Fang Yuan). Built 2026-11-16 (proposal, AD32, AD56).**
     - `src/ri_tide_ledger.js` counts from the engine's completion counts (patrol reports, eyes and tallies handed in), since each tide
       opened. A saved slice `ri_tide_ledger` keeps the open tide's base and the last 5 closed tides.
     - The academy reads "This tide you have reported N patrols and the board has credited you M merit", and between tides, the last tide.
     - Merit is priced from the board's dials, so a dial change re-prices past tides. A tide first seen part-way through counts from then.
     - `place_descriptions.js` now redraws a place box on the registry's refresh when its text changed (`refreshPlaceDescription`), so the
       line moves after a report, and the same refresh replaced the LOTM-only tick redraw for Klein's streets.
  2. **Harry's further days.**
     - **Next class, built 2026-11-16 (proposal).** The school hall names the next class through the place hook
       (`hpNextClassLine` in `book_world_hp_day.js`). It covers Monday's Charms and Potions and the week's timetable, says "today",
       "tomorrow" or the weekday, and says when a class has started and how long the door stays open. It is hidden out of term,
       before the Sorting, and away from school.
       Verified: unit tests, check:arch, check:rules. In Chrome on hp-w7-halloween the page text read "Charms, tomorrow at 09:00"
       and, 15 hours on, "Potions, today at 10:00". That run printed the wait in words; the committed line uses `formatDuration`
       ("14 h 39 min", UR161), which is unit-tested only. The 1920x1080 capture was not retaken (the lanes were stopped).
     - **House points: proposed owner (proposal under AD56, not built).**
       - Today two places write points as their own world facts: the Halloween pack's award keys, and the Quidditch courtyard
         deduction. `book_world_hp_positions.js` notes that no count exists.
       - Proposal: one module, `book_world_hp_house_points.js`, owns the count. It holds a registry of point sources
         (`registerHousePoints(fn)`; each source returns rows `{house, label, delta, at}`). The Halloween awards and the deduction
         register as the first two sources, and day-loop awards (a marked essay, lateness) write facts under `hp.lead.points.*`,
         which the module reads as one more source.
       - The module returns per-house totals plus the rows, and the lead panel's points section reads it in place of the
         Halloween-only list.
       - Dial: canon fixes who wins the Cup at the finale, so his own points move Gryffindor's total and the finale's awards apply
         on top. Whether his points can change the winner is a limit question for Weibao.
     - **Still open.** Meals (the Great Hall's breakfast, lunch and supper as day rows with hunger) and friends (time with Ron and
       Hermione as a day row that feeds the existing ties).
  3. **Klein.**
     - Ready rows from `shiftRead` belong to the UI lane (`lotm_work_day.js`).
     - The open shift question above (line "Open question for Weibao") waits on him.
     - The street hours are authored; a Tingen week calendar (TMR2) would put the market on a named weekday.
  4. **Rent arrears dial.** On Weibao's list in `docs/gm/dispatch/play-surface-2026-11-14/HANDOFF.md`.


## November 25 decision: what creates the most playable options?

**Recommendation (proposal under AD32 and AD38). Build a return visit with two ways forward before expanding the activity catalogue.** A genuine new option changes something the player can do, when they can do it, who helps, or what they must give up. Two buttons that settle into identical circumstances give a weaker reason to replay.

### The loop in the current build

| Timescale | What the player can do now | Where to put the next connection |
|---|---|---|
| One encounter | Klein can recover the office letter through an ordinary inquiry or trained divination. The paid case puts eight pence into the same purse that everyday life uses. On the event-chart case, guessing spends spirituality and can leave the answer unclear. | Tell the player what the known methods cost and what remains uncertain. Leave room for an ordinary inquiry when spirituality runs low. [Letter](../gm/dispatch/play-surface-2026-11-14/KLEIN_LETTER_CASE_2026-11-25.md) and [returning visitor](../gm/dispatch/play-surface-2026-11-14/KLEIN_RETURN_VISITOR_2026-11-25.md) |
| One afternoon | In Harry's term fixture, three hours of library study changes the chance of success within two feather attempts from 60% to 70%. Another cast takes it to 80%. For Fang Yuan, paying for a leaf opens another watch after injury. Zorian's correction can affect exam preparation. | Put the next commitment beside the immediate action when the character knows about both. A useful comparison is whether a library session leaves time for an arranged practice. Preserve rest, paid work and exploration as reasonable choices. [Harry](../gm/dispatch/play-surface-2026-11-14/HARRY_READING_2026-11-25.md), [Fang Yuan](../gm/dispatch/play-surface-2026-11-14/FANG_LEAF_TREATMENT_2026-11-25.md), [Zorian](../worlds/mother-of-learning/LIGHT_FORMULA_CORRECTION_2026-11-25.md) |
| A later day | The returning-client fixture retains fee, favor, case outcome and referral through import. The older earned-life audit found working household duties, trade, office shifts and patrols. These make a day matter materially. | Give one particular person a reason to act differently after that saved encounter. Test whether a player can find and use the changed opportunity after leaving and returning. The November 25 case evidence came from a composed route. A fresh player's ability to discover it is a separate question. [Client view](../../src/book_world_lotm_be_clients.js) and the mid-life rerun above |

### What to take from other games

| Reference | Mechanism worth taking | Adjustment for this game |
|---|---|---|
| Citizen Sleeper | Assigning a limited daily resource to work or a relationship while a visible clock advances gives two positive ambitions a cost. | Use Klein's actual hours, appointments and spirituality, or Harry's timetable. Show the next known change near the relevant action. A blanket action-dice budget would erase differences between the worlds. [Developer description](https://store.steampowered.com/app/1578650/Citizen_Sleeper/) |
| Streets of Rogue | Different character abilities can solve a common problem through different interactions in the same place. | Let a witness, an ordinary search and divination produce evidence with different certainty, time and consequences. A designer can add a new working method by connecting its evidence to the existing situation. [Developer description](https://store.steampowered.com/app/512900/Streets_of_Rogue/) |
| Wildermyth | History attached to a particular person changes which later events and outcomes fit them. | Keep the client, what they experienced, and any obligation. One next encounter should read those facts. Add a more general relationship system when a second world needs the same operation. [Official data and event overview](https://www.wildermyth.com/wiki/Data_Format_Overview) |
| Proto23 and the local Village work | Ordinary time, trade and commitments can feed public accomplishments and open the next stop. | Keep repeated activity useful and visible. Test whether a learned method changes where the player can go or whom they can help next. The Village remains a test bed under current direction. [Local comparison and implementation notes](../PROTO23_VILLAGE_LIFE_LOOPS_2026-10-14.md) |

### Build order and test

1. **D1. Make a client remember.** At the next appropriate visit, the event-chart client can offer practical help rooted in the earlier service. A public-record route can yield the same lead at a different cost. Paid work, courtesy and an unclear answer should leave intelligibly different circumstances. Keep exact terms as authored defaults until the slice is played.
2. **D2. Make the opportunity findable.** At the point of decision, show the person or place, the known timing, and why it matters. After choosing, surface who or what changed and a way to revisit it. Reuse Here, People and the existing report. Keep unknown outcomes undisclosed. If new players cannot see a second reasonable action, prioritize this before adding more follow-ups.
3. **D3. Give practice another use.** Try Harry next. Arrange an application for a practiced charm outside the exercise, alongside a classmate's help or a slower mundane method. Contrast the resulting time, relationship or obligation on the next school day. This is the first test of whether the approach transfers to another world.
4. **D4. Let routine work carry the player to the interesting interruption.** Use existing queues, schedules and stop conditions to offer a bounded repeat through familiar work. Stop at the first known appointment, action that becomes impossible or actual interruption, with the elapsed time and result. Add this after observing repeated low-choice clicks in a real route.
5. **D5. Hand evidence from the Atlas to one gameplay consumer.** For a source-backed method, follow its locator to a condition, cost, effect and later use. The Slumber charm and its upkeep make a concrete first example. A reading count is research progress. An extra option in a real situation is gameplay progress.

**First experiment.** Start from two matching Klein lives. In one, ground the chart and choose courtesy. In the other, take a different settlement or leave the reading unresolved. Leave the office, let the day advance, then seek the same practical lead. Record the available methods, game minutes, resource or favor spent, and which person remembers. Reload and import one result and repeat the visit to check that the same favor cannot pay twice. Play one return without consulting a guide. If the next day differs only in report text or a balance, revise the consequence. If both paths work but players miss the opportunity, improve the return cue. Expand to further worlds after the second setting demonstrates reuse.

A bigger quest board would expose more titles immediately. More authored chapters would advance the book faster. Neither addresses the cheaper experiment of giving current choices another consequence. A pure sandbox of undisclosed interactions would allow experimentation but would make the existing discoverability question harder to answer. This ordering preserves the leads, source-backed details and desktop-first priorities in [PROJECT](../../PROJECT.md).

**Fresh ordinary entrance check.** On the rebuilt 1920×1080 route, PLAY → Village → Tingen Cross → Nighthawk probationer offers copying and watching. From one earned reporting checkpoint, two 30-minute copy jobs yielded two merit plus Copying hand, mastery 4 and desk-pool progress 1/8. A single 60-minute watch yielded two merit and needed one start. The opening offers concealed the learning benefit until the first copy finished. The ordinary Tingen crossing enters a different life from the seeded Lawson or Klein cases. This directly supports D2 and gives the UI lane a concrete repair independent of D1.

**D2 ordinary-offer slice completed, 2026-11-25.** The existing job rows now explain copying practice before the first choice, and the watch's one-start advantage at the actual quoted time and merit. Undiscovered practice rewards stay undisclosed. Rebuilt desktop proof replayed both branches from that same earned checkpoint with the outcomes above unchanged: [offers](../representations/evidence/fresh-first-decisions-2026-11-25/improved-ordinary-work-offers.png), [branch results and bundle hash](../representations/evidence/fresh-first-decisions-2026-11-25/ordinary-work-choice-result.json). Build, 15 focused tests, architecture and UI/style ratchets passed. Persistence is unchanged. Agent-verified, not human-reviewed; this completes the ordinary-offer affordance, not D2's wider return cues or D1's client consequence.

**D1 and D3 playable results.** Klein's next visit now reads the client's memory. The courtesy route takes five minutes and the independent ledger search takes forty-five. Each produces instructions the player can use to correct the same two-pence dispatch. Harry's levitation goes beyond practice. He can retrieve an Astronomy reference book by ladder or spell, copy the chart, and use his notes to cut assigned homework from sixty minutes to thirty. Rebuilt desktop sessions exercised the alternate methods and persistence for both lives. [Klein's client](../gm/dispatch/play-surface-2026-11-14/KLEIN_CLIENT_MEMORY_LOOP_2026-11-25.md) and [Harry's library work](../gm/dispatch/play-surface-2026-11-14/HARRY_LIBRARY_WORK_2026-11-25.md).

**D4 ordinary repeat.** From the same ordinary Tingen workroom, the player can start two copy assignments with one choice and see the finite stopping point. A rebuilt desktop run paid each job when it finished, paused the active program on Stop and retained the midpoint and stop through save restoration. [Ordinary work evidence](../gm/dispatch/play-surface-2026-11-14/ORDINARY_WORK_REPEAT_2026-11-25.md).

**What the choices now buy.** The repeat control lets an ordinary Tingen player commit one hour to either watch or copying with one start. Copying still trains the hand. The next useful watch improvement is an observation tied to who actually visits during that hour, provided an existing actor and downstream use support it. Fang's patrol tally now buys either its board merit or a healing leaf. Zorian's practiced classroom correction now yields a faster low-angle draft that spends three stamina, and its light can reveal incisions. [Fang](../gm/dispatch/play-surface-2026-11-14/FANG_HEALER_WORK_2026-11-25.md) and [Zorian](../worlds/mother-of-learning/LIGHT_FORMULA_CORRECTION_2026-11-25.md).

**The watch now has that return.** When Hale is present at handover, a completed watch can introduce a public duty contact. A player who misses the encounter can spend two hours studying public papers and a minute on the lookup. Both lead to paid work at the docks. This is the pattern to give other backlog ideas first consideration: a method the player can earn, a second way to reach the same opportunity, and a later decision that uses what happened. [Watch and directory playthrough](../gm/dispatch/play-surface-2026-11-14/ORDINARY_WATCH_CONTACT_2026-11-25.md).


### D6: change the method without losing the problem, November 25

**Design recommendation under AD32, not accepted direction or a build dispatch.** The earlier comparison already covered remembered clients, useful practice, return cues, finite repeats and a source-to-game handoff. This extension examines the moment *after* an attempt fails or the player stops it: can they change approach to the same unfinished problem, understand what remains spent, and still reach its downstream use? It does not reopen D1–D5 or recommend another activity catalogue.

Preflight: coordinator requested design synthesis over verified Harry, Klein, RI and Village loops, two published-game comparisons and a reusable next change. AD32, AD38, AD43, AD51, CX1–CX3, ACR4/6 and UR70–UR75 apply. The evidence below is existing receipt review plus bounded current consumer-code inspection, not fresh play of four lives or either reference game. Numerical costs are incumbent game contracts, not new novel-source claims. Any later UI experiment targets1920×1080 in existing activity groups; mobile and new shared persistence are deferred. No runtime or shared checkpoint changed for this extension.

#### What is already real, and what remains uncertain

| Finding | Verified loop and retained consequence | What a changed plan must respect |
|---|---|---|
| D6-F1 · Harry | Ladder or practiced Levitation brings down the same chart-book; copying returns it and creates Harry's notes. Notes enable30-minute homework beside the original60-minute method, consuming the actual assignment and producing the same marked work. A fizzle spends stamina and adds practice; loss of notes during homework returns the reserved assignment. [Library receipt](../gm/dispatch/play-surface-2026-11-14/HARRY_LIBRARY_WORK_2026-11-25.md), [current-pack replay](../representations/evidence/harry-library-current-pack-2026-11-25/README.md), [current consumer](../../src/hp_library_work.js). | Failed magic is not erased by choosing the ladder. The book's position, assignment and owned notes decide what remains possible. The current-pack replay on default build `9a960b…` uses fresh school composition with the actual installed HP pack, real Charms/class-wand commands and clock-only setup. Its full opening-to-school progression is unverified; the older receipt's absent-pack statement is historical. |
| D6-F2 · Klein | The remembered client's5-minute docket and independent45-minute ledger search yield the same usable dispatch reference; the15-minute runner reserves2pence and cancellation refunds them. Separately, the genuine response case now supports continued replacement or the actual lender's release, with future compensation kept as intention. [Client receipt](../gm/dispatch/play-surface-2026-11-14/KLEIN_CLIENT_MEMORY_LOOP_2026-11-25.md), [reviewed lender receipt](../gm/dispatch/procedural-crafting-2026-11-11/LOTM_LENDER_RELEASE_2026-11-25.md). | Missing a person need not delete the problem. A resolved dispatch or released loan must not be settled again through a sibling method. The lender case has genuine cast and late prerequisites setup, not a proved full earned life. |
| D6-F3 · Fang Yuan | The same Vitality Leaf can come from2stones, a real patrol tally that sacrifices its10-merit board payout, or45minutes of herb work. Treatment consumes it and clears the incumbent injury. Stopped work gives no leaf; a spent tally cannot also earn board merit. [Healer receipt](../gm/dispatch/play-surface-2026-11-14/FANG_HEALER_WORK_2026-11-25.md), [current offers](../../src/world_packs/book_gu_lead_healer_work.js). | Switching from labor to cash preserves elapsed time and the existing injury until treatment actually happens. The leaf is a means, not the final success. Evidence starts from a composed prior-patrol fixture. |
| D6-F4 · Village | Actual orchard apples feed the existing grain-cart problem: two apples and30minutes substitute for the skill/strength routes. Stop keeps the apples and partial work; successful delivery feeds the millers' existing reward and training access. [Native receipt](../gm/dispatch/play-surface-2026-11-14/VILLAGE_GRAIN_METHOD_2026-11-25.md), [current method](../../src/village_grain_cart.js). | Retained progress belongs to the method that earned it; another method need not inherit those minutes. One delivered cart closes the alternatives and yields one existing mill receipt. Setup supplies progressed access, not apples or the tested production. Village stays the standing test bed, not a new depth priority. |

**D6-F5, synthesis:** these loops already have materially different alternatives and actual consumers. We have not established a general shortage of methods, nor reproduced an inaccessible recovery control across all four worlds. The uncovered question is whether an unaided player, returning after interruption or failure, can identify the same problem, see the remaining alternatives and complete its consumer. Existing sibling buttons may already suffice. A new generic quest or negotiation engine is not justified by this evidence.

#### Two first-party reference mechanisms

| Reference evidence, scope checked November25 | Source fact | OOPS inference and transfer boundary |
|---|---|---|
| D6-P1 · [FTL developer/publisher description](https://store.steampowered.com/app/212680/ftl_faster_than_light/), About This Game / Key Features | Subset describes a disabled-shield encounter with alternatives including reallocating power to escape, adding weapons or boarding. Players can pause combat, assess and issue orders. | Preserve the ability to reconsider the *current situation* with remaining means. This supports a readable decision boundary, not a claim that OOPS needs FTL's ship power, real-time combat, random galaxy or death policy. No FTL refund or exact escape formula was checked. |
| D6-P2 · [Against the Storm: Explorer's Choice developer notes, March30,2023](https://eremitegames.com/explorers-choice-update/) | Eremite's historical update changed glade events from chiefly selecting a reward to selecting an approach with its own required goods/working effects and associated reward. Choice tags could also feed perks and orders. | Compare approaches by what the player gives and what later reads the result. The selected method may produce a different social/world consequence rather than the same payout. These dated notes establish that design change, not every rule of the latest build or permission to cancel an active event freely. [Official Steam announcement mirror](https://store.steampowered.com/news/posts/?enddate=1680187204&feed=steam_community_announcements). |

Neither reference proves that more alternatives automatically improve OOPS. FTL makes revision inside an unfolding situation useful; Against the Storm makes the chosen approach consequential. Together they suggest testing a change of plan against the *same surviving state*, rather than adding buttons whose costs and consequences vanish when the player changes screens. This is our inference, not a quoted developer prescription.

#### Next options weighed

| Proposal | Player choices it could improve | Cost, uncertainty and disposition |
|---|---|---|
| D6-O1 · A goal-preserving return after Stop/failure | From a stopped/failed method, open the existing group for that exact book, injury, dispatch or cart; show retained/spent means, currently known sibling methods and the next actual consumer. | **Recommended smallest reuse experiment.** Reuse existing quotes, stop policies, object facts and focus controls. No new save store, automatic retry or invented equivalence between worlds. If current controls already achieve this unaided, keep them and add no wrapper. |
| D6-O2 · A helper takes over actual work | A capable, consenting person contributes real time/materials to the unfinished job; the player can supply, pay, wait or continue personally. This changes the means available, not merely their display. | A genuinely different mechanical direction. Klein's supplied mentor-making is a bounded existing example, not proof of a universal helper system. Another world needs an actual available helper, capability, terms and displaced time. Prefer a named service over a generic relationship bonus. More consequential and source-dependent than O1. [Existing mentor route](../gm/dispatch/procedural-crafting-2026-11-11/LOTM_LENDER_STOCK_2026-11-25.md). |
| D6-O3 · Spend the next slice on one new downstream consequence | Let an existing output change a later person's offer or solve a second practical problem, while keeping the current method UI. | Strong when the bottleneck is useful consequence rather than recovery/discovery. D1/D3 already test this direction. Choose it instead of O1 if unaided players recover comfortably but do not value the result; do not call another copy of that work an uncovered finding here. |

**D6-R1, recommendation:** the smallest reusable next change is a *navigation and quote connection from an interrupted method back to its same unfinished problem*. Its source of truth is the existing world's outcome state, not a new global goal counter. A small world-local adapter can name the outcome's existing key, the known method control IDs and the consumer control ID. Quote again from current stock/time/access after Stop; do not turn an old quote into a promise. It adds no physical capability by itself. Its potential value is making already earned alternatives usable at the moment the first plan stops working, across four different loops.

**First learn, then build.** Run one uncoached Harry recovery after a paid fizzle and one RI recovery after stopped herb work, from the previously proved prerequisites. Ask the player to finish the assignment or treat the injury without a guide. Record whether they find the alternate method and downstream action, what they believe remains spent, and whether they mistake cancellation for undo. This is a proposed design experiment, not another gate on the current wave. If the existing groups are clear, reject the new return connection. If the failure is missing access to the consumer, repair that exact route rather than masking it with a new dashboard.

**Bounded observable experiment if a gap is reproduced:** link the Harry result/stop back to that chart-book's existing methods, then use RI as the distinct second setting. Preserve Harry's spent stamina/practice and RI's elapsed herb time; no notes/leaf appears from Stop. Complete the alternative, use its output on the assignment/injury, and verify that the original outcome guards still prevent duplicate settlement. Reload/import before changing method and revisit after success. A useful result is a player reaching a different existing method and its real consumer with correct resource expectations. Faster clicking alone, another status label, or a second payout would not support extending the design. Broader helper cooperation remains O2, reopened when a named world case has the actual actor/capability/terms to test it.

Verification of this extension: existing receipts and four named consumer modules read; first-party FTL description and dated Eremite developer notes checked. The Eremite article's later full-page fetch timed out, so the official Steam announcement/search excerpt supplied the bounded claims; no community guide or wiki was used as authority. The ten new local Markdown destinations resolve; three first-party web links are cited. Scoped whitespace passes. The final whole-checkout document-slip scan reports no new hits; the earlier separate RI-note findings were resolved by their owner. No runtime, shared checkpoint, source-reading receipt or accepted rule was changed (AD32).

**D6-V1 · Observed Harry access check, November25.** A bounded 1920×1080 replay captured served bundle `4d14cb3c865682abdd1428d9ddd37b627cb0f2ace8db85f055009f1c78ced84c` in two fresh contexts using the existing current-pack school fixture. After the first ordinary paid fizzle and after stopping ladder work at three minutes, Library work and Homework stayed visible together: ladder/cast enabled, copying visible with its shelf prerequisite, ordinary one-hour homework enabled, and notes-based half-hour homework visible with its missing-notes reason. Fizzle retained its one stamina cost and practice gain; Stop retained elapsed time and granted no completion. Earlier separate consumer branches completed the same assignment through ladder/notes and ordinary homework, with their served-build limitation preserved. No access defect was reproduced and no return wrapper was added. This is scripted agent observation, not an unaided-player or human-usability result. [Detailed receipt and branch-scoped evidence](../gm/dispatch/play-surface-2026-11-14/HARRY_INTERRUPTED_METHOD_2026-11-25.md) also qualify the lightweight existing RI capture/code comparison. The broader D6 proposal remains a proposal under AD32.

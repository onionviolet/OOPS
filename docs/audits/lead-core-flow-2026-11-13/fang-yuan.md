# Fang Yuan core-flow audit, 2026-11-13

Read-only headless audit. No source, test or existing doc was edited. Nothing committed.

## Setup

- Build: live headless build at HEAD a352a9d01 (working tree had unrelated doc edits).
- **Every Fang Yuan scenario failed to boot.** Tried `ri-fang-yuan-class-chair`, `-middle-stage`, `-assessment-lineup`, `-second-gu`, `-first-gu`. Each gave: "Optional item restoration needs an explicit migration." That is the check at `src/content_packs.js:181` (inferred from source: the private checkpoint `completed-checkpoint.json`, dated 2026-11-09, lists pack items that no longer match the current pack). Logged once with `game_report_limit`.
- So this audit does **not** play Fang Yuan's academy life. The two surfaces I could play:
  1. `gu-fed-second` (the original Gu keeper life, `book.ri.keeper`). Its own screen says: "this is not Fang Yuan's life or an earned awakening." It has a Moonlight Gu and a Liquor Worm, primeval stones, essence, a clan steward and a weekly stipend. It is the closest live stand-in for the ordinary Gu day. There is no academy, no classmates, no Spring Autumn Cicada, no Fang Yuan foreknowledge.
  2. The "Capability runs" panel, run "Fang Yuan · Liquor Worm" (academy sparring), from a `fresh` scenario.
- Game calls: about 86 of 170. Sessions used: `audit-fangyuan` (keeper life) and `audit-fangyuan-cap` (capability run). Both closed.
- Days played: the keeper life, 6 in-game days in a first session (it was killed by a 300 s step timeout on a 3-day step, so I rebooted) and 6 more in a second session. Day-by-day notes below merge both and say which is which.
- Not exercised: any of Fang Yuan's real life (academy, dorm, assessment, caravan, class chair, hearing, second Gu choice, Spring Autumn Cicada). All findings about the "Fang Yuan day" are therefore about the Gu-keeping loop that his life would sit on, not his life.

## C1 Blank-day test (keeper life as stand-in)

| Link | Verdict | Evidence |
|---|---|---|
| (a) Something to do that is not a book event | **Present** | Daily verbs on the Beginning panel: "Put the Moonlight Gu to work · 1 essence, 1 stone", "Moonblade: hunt boars · 60 min, 1 essence, 1 stone", "Do clan Gu house chores · 120 min, 1 stone", "Sit and gather essence · 60 min, up to 3 units", buy petals/lees, feed. None is story-gated. Dozens of story lines ("Choose Follow a lightning wolf's trail") sit beside them and are clearly separate. |
| (b) It costs something real | **Present** | Essence ("10/12 primeval essence" after one work), stones (buy lees "4 jars for 1 stone"), time (60 and 120 min jobs lock the panel: "Finish your current work before admitting this continuation"), food stock ("8 Moon Orchid petals · 2 meals"). |
| (c) Result read by a later action | **Present** | Fed or unfed sets condition, and condition gates work: "sound", "works through hunger at risk", "starved out · feed it to recover". Stones from work buy food. Refining the Moonlight Gu changed its meal ("eats 3" not "eats 4") and its tie ("It remembers you: even", later "fond"). Learning the pairing unlocked a new move: "Little Light moonblade: hunt boars · 30 min, 2 essence, 2 stones". |
| (d) Reason to return tomorrow | **Present, soft** | Meal clocks ("Starved out in 4.8 days if unfed", "18 hours · eats 4"), weekly stipend countdown ("Next payment in 2.8 days"), essence that refills at +1/hour. No alarm or nudge; you only see it if you open the panel. Larder days are long (5 to 9 days), so skipping a day costs nothing. |
| (e) Visible improvement with repetition | **Partial** | Standing orders remove chores (below). The refined Moonlight Gu's tend yield rose "2 Moon Orchid petals" to "3 Moon Orchid petals ... (fond toward you: one more)" over three days. Passive skills appear from time alone ("Unlocked new skill: Night vision", "Breathing", "Cold resistance", "Night vision level 2"). But doing the verbs by hand has no skill, and essence stays capped at 12. |

Other asked items:
- **Story stages advance from time alone?** Not in the keeper life. Story lines stayed "Choose ..." and locked behind prerequisites ("Open the Thunder Potato workbench first"). Only the stipend, passive skills and Gu meals advanced. Unknown for Fang Yuan's real life.
- **Does a Gu suffer when unfed?** Yes, visibly. Unfed Liquor Worm: "missed its meal", then condition "2 of 4", then after working it hungry "1 of 4 ... Starved out now: feed it to recover". Feeding it restored the meal clock ("2 jars of spirit lees · 2 meals"). I did not see condition climb back to 4 within the day I stepped (only the larder fix was confirmed).
- **Nothing useful to click?** Not blocked, but the day is thin. Essence sits at "12/12 ... The sea is full at your aptitude cap" every morning, so a player who acts once a day wastes most regeneration. With standing orders set, every morning had stones coming in but little new to decide.
- **Wall-time warning:** a 1-day step took 37 to 83 s, a 2-day step up to 167 s. Not a game flaw, a tool limit.

## Day-by-day notes

Session 1 (orders and refinement):
- D1 (14:00): worked Moonlight Gu (+1 stone), hunted boars 60 min (+1 stone, boar item), bought lees (1 stone), fed worm, worked worm. Stones 2, essence 9.
- D2: sea full overnight, "Moonlight Gu ate (about 7 hours ago)". Set tend order (moon) and fetch order (worm). Hunted again. Stones 3.
- D3: stones 4. "Unlocked new skill: Night vision". Bought lees and steeped the Moonlight Gu: refined, tied, "It remembers you: even". Tried White Jade Gu with 4 stones: button disabled.
- D3 to D4: gave the worm back to the steward (no refund seen), took it back for 1 essence. Moon tend "fond toward you: one more".
- D4: started the repeated boar hunt. After a 2-day step it was still showing "busy" and I had to press "Stop repeated work" (see gaps).
- D6: stones 6. Bought dried petals, fed the poorer food (larder "17 Moon Orchid petals + 12 dried petals · 7 meals"). Learned the Moonlight pairing, took in Little Light Gu (2 stones): new 30-minute move appeared. Little Light Gu showed "Starved out in 2.6 days".
- Step of 3 days then timed out (session lost).

Session 2 (starvation):
- D1 to D3: no action. Worm "missed its meal (about 6 hours ago)". Stones 0, essence 12/12.
- D5: Moonlight Gu "Starved out in 4.8 days if unfed", worm 2/4 "works through hunger at risk", stones 0. Worked the hungry worm: +1 stone, worm 1/4 "Starved out now". Bought lees (stones back to 0), fed worm.
- D6: moon larder "4 Moon Orchid petals · 1 meal", still 0 stones, 12/12 essence. Stones only come if I act.

## C2 Off-book probes

Counts: WORKED 5, FAILED WITH REASON 1, NO ROUTE 5, SILENT 1 (plus one item in the capability run).

| # | Plan | Class | Evidence |
|---|---|---|---|
| 1 | Starve a Gu on purpose | WORKED | Worm went "2 of 4", then "1 of 4 ... Starved out now: feed it to recover". |
| 2 | Feed the wrong food | NO ROUTE for a truly wrong food (no action to feed petals to the worm). WORKED for the listed "poorer food" | "Feed the Moonlight Gu poorer food: 12 dried petals" worked ("7 meals"). |
| 3 | Sell a Gu or stones | NO ROUTE | Only "Give the Liquor Worm Gu back to the clan steward": no stones came back (stones unchanged). No sell action seen. |
| 4 | Moonblade on a non-combat target | NO ROUTE in the keeper day | Only "hunt boars". In the capability run only mortal, Gu master and higher-rank body targets exist (all combat). |
| 5 | Skip the academy | NO ROUTE (untestable) | No academy in the playable surface. Real academy life not booted. |
| 6 | Hunt outside for stones or food | WORKED | "Moonblade: hunt boars" gave a stone and a boar item. The boar item had no visible use (I did not find a sell or feed action for it). |
| 7 | Lend or borrow stones | NO ROUTE | No lend action. Taking the 6-stone White Jade Gu with 4 stones was a disabled button. |
| 8 | Refine a second Gu early | FAILED (disabled), reason not read | White Jade Gu button disabled at 4 stones, enabled at 6. I did not read the on-screen reason text; source says "the clan does not lend against the stipend" (inferred). Little Light Gu (2 stones) and the worm worked. |
| 9 | Pick a fight with a classmate | NO ROUTE | No classmates in the keeper life; real life not booted. |
| 10 | Give a Gu away | WORKED | "Give the Liquor Worm Gu back" and "Take the Liquor Worm Gu back from the steward · 1 essence". |
| 11 | Work a starving Gu anyway | WORKED | "Work the hungry Liquor Worm Gu anyway · ... risk of harm" gave a stone and cost condition. |
| 12 | Let essence sit overnight | SILENT | "The sea is full at your aptitude cap; more rest cannot raise it." Regen is lost with no note. |
| 13 | Capability run: skip feeding, step a day | SILENT | Food read "718 min of food left" before and after a 1440 min step. Gu food did not drain with the clock in that panel. |

## C3 Improvable actions

| Action | How it gets better |
|---|---|
| Work a Gu for stones | Gu condition (feed it). A refined, tied Gu: "fond" raised tend yield 2 to 3 petals. Hand work itself: none found. |
| Moonblade hunt | New pairing: Little Light moonblade halves time and doubles yield (30 min, 2 boars). Needs steward knowledge, a second Gu and moss upkeep. |
| Chores (120 min, 1 stone) | None found. |
| Sit and gather essence | Capped by aptitude (12 of 24). None found. |
| Feed Gu | Standing feed order; poorer food as fallback; refinement lowers meal size (4 to 3). |
| Refine (steep in lees) | One-time. Risk of injury on failure. |
| Buy food | None found. |
| Standing orders (tend, fetch, feed) | Set once, then run. This is the routine improvement. |
| Passive skills (Night vision, Breathing) | Rise with time, not with any action. |
| Capability run: spar and refine essence | Middle-stage essence per Moonblade is 2 parts, initial is 4. Refining 2 to 1 is the improvement. |
| Fang Yuan real life actions | Not tested. |

## C3b Systems gap (what the stand-in day visibly uses)

Statements about Fang Yuan's real day are inferred from source file names (`book_gu_lead_*.js`) and not seen on screen.

| System | Used by the ordinary day? | Cost of its absence |
|---|---|---|
| Time and schedule | Partly. Jobs are 30, 60 or 120 min and block the panel. There is no day plan, no academy hours, no "this morning, this afternoon" structure. | The day has no shape. One player action per day is as good as ten. |
| Knowledge, including past-life foreknowledge | No. Only "Ask the steward what pairs with a Moonlight Gu" (one-off, unlocked a move). No Fang Yuan memory use seen. | His main edge never reaches the ordinary day. |
| Relationships and standing | Barely. The steward is the only person. The Gu tie ("even" to "fond") is the one relationship that moved. No clan, elders or rivals appear. | Nothing to maintain, nobody to lose to, no reason to be seen. |
| Livelihood and primeval stones | Yes. Chores, Gu work, hunting, weekly stipend ("6 stones every 7 days"), food prices. | Present but small and flat: stones are worth 1 each, everything costs 1. |
| Gu keeping and feeding | Yes, the strongest system here. Real hunger clocks, condition, standing orders. | If absent the day would be empty. It is also the one part that punishes neglect. |
| Gu refinement and crafting | One action (steep in lees) and a few story-gated lines. | No ordinary refine loop. Essence grades appear only in the capability run. |
| Fights | Boar hunting as a timed job. Capability run has a sparring table. | No sparring partner or rival in the day; fights live in the story lines. |
| Spring Autumn Cicada (the cheat) | No. Not present in the keeper life or in the capability run. | The lead's defining mechanism is absent from any ordinary day I could play. |

## Capability run note

Run "Fang Yuan · Liquor Worm" (from `fresh`): feed the Moonlight Gu (2 petals), feed the Liquor Worm (1 wine jar), refine green-copper essence (2 initial to 1 middle), spar with either grade, and "Test Moonblade against three targets".
- It is a self-contained rehearsal. Starting food "4 petals · 2 wine jars" and essence "12 initial-stage" make it a one-shot puzzle that ends when stock runs out (essence 12 to 8 to 6 in three actions, no regeneration seen).
- Meals gave "720 min of food left" (Moonlight) and "5760 min" (Worm). The numbers only fell by 1 per action, not with a 1440 min step. So it has hunger numbers but no hunger clock tied to game time (observed).
- The comparison table is the best read-by-later-action example I saw: initial essence 4 parts vs middle 2 parts against a mortal, a Jade Skin Gu master and a reinforced higher-rank body, with guard values and outcomes ("Forearm fracture · rush stopped · can flee · bleeding"), and a follow-up "Stabilize the forearm wound".
- Verdict: richer on combat consequences, weaker as an ordinary loop than the keeper life. It is not a better daily loop.

## Top five gaps (ranked by how much each would improve an ordinary day)

1. **The Fang Yuan checkpoints do not load.** I could not audit his real day at all. Rebuild the private checkpoints for the current pack, or add a migration for the item list.
2. **Nothing gives the day a shape or a reason to open it today.** Meals last 5 to 9 days and every verb can wait. Add dated, small commitments (a class, a debt, a meal that does spoil) so tomorrow differs from today.
3. **Essence regeneration is wasted overnight** ("The sea is full at your aptitude cap") with no note. Give spare essence a sink that is not the same stone chore, or tell the player what they lost.
4. **No people and no standing in the ordinary day.** Only the steward exists. Fang Yuan's clan, elders and rivals should show up in routine choices, not only in story lines.
5. **Foreknowledge and the Spring Autumn Cicada never touch routine actions.** Neither appeared in any playable ordinary day. A repeatable way to use them (a costed foresight on a hunt or a trade) would turn his cheat into a daily tool.

Smaller notes: a repeated boar hunt kept the panel "busy" through a 2-day step and needed "Stop repeated work"; yields from that loop were unclear; the boar item had no visible use; stones per hour of work stay flat at 1, so repetition only improves things via new Gu and standing orders.

## Mid-life rerun, 2026-11-13 (save ri-fang-yuan-class-chair)

Read-only headless rerun of C1 to C3 on his own save. `ri-fang-yuan-class-chair` loaded on the first try (seed 1, session `fy-mid`), with no page errors. It opens on day 59, 19:45, at the Clan academy. Days played: days 59 to 62 (three one-day steps, then one story step and a 10 minute step). No source was edited. Not run: C4, and the "Fang Yuan · Liquor Worm" capability run (it was only listed). Not opened: the Trade standing, Potioneering and Study panels (the panel select would not take them; see Broken things).

What the save holds, as seen: 132 primeval stones plus three partly drawn ones, 25 jars of green bamboo wine, 8 Moon Orchid petals, a refined Liquor Worm (an inventory row), 5 stale bread, and "102 coins (denominations unfamiliar)". Stones and the Worm show "0 coins" as value. Stats show no essence and no aperture figure anywhere. Local actions held one line, "Patrol blocked: return the loaned kit · Open Patrol & custody". "Around you" said "No one else is here."

### C1 blank day

| Link | Verdict | Evidence |
|---|---|---|
| (a) Something to do that is not a book event | **Missing** | Local actions never held a verb. The Beginning panel offered exactly one button ("Choose Fang Yuan at the clan hearing", then one step at a time: "Go with the academy elder", then "Let the witnesses finish"). Crafting said "No station", Mixing said "no mixing bench here", Ledger said "Take a commission to start one". No feed, tend, practice, class or cultivate action in any panel I opened. |
| (b) A real cost | **Missing** | Four days passed with no cost shown. Stones stayed 132, no hunger or essence meter, no food clock for the Worm. The 8 minute story step cost only its 8 minutes. |
| (c) A result something else reads | **Partial** | Only passive skills moved: Night vision (level 1 on day 60, level 2 with a "new milestone" on day 62), Breathing (day 61), Patience, and max stamina 40 to 41. Nothing else in the game read the stones, Worm or wine. |
| (d) A reason to come back tomorrow | **Missing** | No timetable, meal, debt or class. The only tomorrow-hook is the story button, which does not expire. "Calendar unknown here" shows where a schedule would sit. |
| (e) Improves with repetition | **Partial** | Passive skills level from idling alone (Night vision +480 XP on the first day, +480 per day after; Breathing and Patience likewise). No action of his improves. |

Items asked about, as seen: feeding and tending Gu absent (clicking the Liquor Worm row did nothing); primeval essence absent from every panel; stones present as 132 but with no use or spend; academy classes absent (the room is described, nobody is in it); Moonblade practice absent (it exists only as a capability-run rehearsal, not run); aperture cultivation absent; rivals and clan people absent ("No one else is here."); Liquor Worm present as an inert row; foreknowledge and the Spring Autumn Cicada not visible anywhere (inference: they live in story lines only, none seen).

### C2 off-book probes

Counts: WORKED 0, FAILED WITH REASON 2, NO ROUTE 8, SILENT 3.

| # | Plan | Class | Evidence |
|---|---|---|---|
| 1 | Skip the academy or refuse the summons | NO ROUTE | The summons step had one button, "Go with the academy elder". |
| 2 | Sell a Gu or stones | NO ROUTE | Rows show "0 coins"; no sell action; Ledger empty. |
| 3 | Buy a different Gu | NO ROUTE | No shop or trade action in Local actions or Beginning. Trade standing not opened. |
| 4 | Extort classmates again | NO ROUTE | "No one else is here." |
| 5 | Hunt for food | NO ROUTE | Local actions empty. |
| 6 | Refine something risky | FAILED WITH REASON | "No crafting station is available here." |
| 7 | Mix or brew with the wine | FAILED WITH REASON | "Mixing: no mixing bench here." |
| 8 | Hoard stones for days | SILENT | Four days: stones stayed 132, no line either way. |
| 9 | Befriend someone | NO ROUTE | Nobody present, no people action. |
| 10 | Leave the village | NO ROUTE | Worlds offers only "A Soldier's Life" (not entered). No place to walk to. |
| 11 | Starve a Gu on purpose | NO ROUTE | No feed verb to withhold; four days gave no hunger line for the Worm. |
| 12 | Click the Liquor Worm row (feed or tend) | SILENT | Click ran, nothing reported. |
| 13 | Click the Moon Orchid petals (feed a Gu) | SILENT | Click ran, nothing reported. |
| 14 | Cultivate the aperture / Moonblade practice | NO ROUTE | No action; no essence figure shown. |

### C3 improvable aspects

- Passive skills (Night vision, Breathing, Patience): improve with elapsed time only, no action needed. Night vision hit level 2 and a milestone by day 62.
- Max stamina: 40 to 41 over two days, from the same passive gain.
- Story steps: each is a one-shot; none repeat or improve.
- Everything else in the keeper findings (feeding, tending, standing orders, refinement, tie growth): not present for him, nothing to improve.

### Fang Yuan's own life against the keeper life

His save has the keeper's raw materials (a refined Liquor Worm, stones, petals) but none of its verbs: the feed, tend, work, hunt and standing-order loop that made the keeper's C1 pass is not offered to him, so his life is the thinner of the two. In his save the ordinary day is empty and the book rail is the only route, one button per step. Everything the keeper had at least partly (cost, meal clocks, ties, a stipend) is absent, and so is what only he should have (class schedule, rivals, foreknowledge, the Cicada). Stones sit at 132 with no sink and no source. Inference: the keeper loop is scoped to `book.ri.keeper` and was never wired to the lead's items.

### Broken or odd

- Panel select (`panel:` parameter and the All panels list) refused "Study", "Known things" and "Family qualities" with "No available player option". Several panels listed under All panels are other lives' (Phandalin, Tingen workroom, Spellbook, Patrol & custody, Potioneering): leftovers.
- Local actions text is a leftover: "Patrol blocked: return the loaned kit · Open Patrol & custody".
- "Go with the academy elder" ran for 8 minutes and left no Reports line; Reports only showed skill notices and the "Across the Threshold" deed.
- The Beginning panel lists all 88 future story titles in plain text, and the item keys carry raw ids (`book.ri.lead...`); on screen only action keys, not labels, showed them.
- Backup button read "Load the backup autosave [2025-12-31 19:00:00]", a date that does not match the game's day 62 summer.
- No page errors. The clock advanced normally (about 43 to 50 game minutes per wall second; one day about 30 s).

## C4 cold reader, 2026-11-13 (tree 0f53ba3f0)

A cheap agent with only the screen text, 15 actions a goal. One run on each save. The keeper run retests the UI chat's fix in 1fc151270.

Gu keeper life (`gu-fed-second`):

| Goal | Result | What happened |
|---|---|---|
| Find which Gu you own and what they eat | Reached, 0 actions | Inventory lists "Moonlight Gu · Food: Moon Orchid petals, 4 a day" and the Liquor Worm with its food. On the first audit this goal failed after 15 actions. |
| Feed one Gu | Reached, 4 actions | Feeding is a standing order that fires as time passes. Nothing confirmed the click; a day later petals went 24 to 20. |
| Use a Gu and read the result | Reached, result unclear | "Put the Moonlight Gu to work · 1 essence, 1 stone": essence 12 to 11, stones 0 to 1, so the label reads as a cost and the stone was a gain. Reports said nothing. |

Fang Yuan's own save (`ri-fang-yuan-class-chair`):

| Goal | Result | What happened |
|---|---|---|
| Find which Gu you own and your stones | Not reached, 8 actions | Inventory shows "Primeval stone x132" and "Liquor Worm · refined" as plain rows. The story names Little Light, White Boar, Moonglow and Black Boar Gu that are nowhere in the Inventory. |
| Find practice, study or Gu care for today | Not reached | Notebook's Practice tab was empty. Local actions showed truncated text with nothing to click. |
| Find the next step and do it | Reached, 2 actions | Beginning, then "Choose Fang Yuan at the clan hearing". The screen said "Command saved." and showed no result. |

Most confusing on his own save: Beginning lists about 88 future steps; Local actions has text and no buttons; "Study · Ask around for someone to teach you" shows in a header and cannot be reached. Clear: the next story step is pinned at the top of Beginning.

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

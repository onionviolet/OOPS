# Fight view projection · 2026-11-13

One view shape for a fight, with a projection from the tempo fight and one from the contest. This carries out [CBD202 and CBD204](../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md) from round 26 of the combat palette. Everything here is a proposal, not an accepted decision.

**State reached.** Implemented and unit-tested, below the AD43 floor, not played. No screen reads the view, no fight changed, and no save shape changed.

**What exists.**

- [src/fight_view.js](../../src/fight_view.js): the shape (`FIGHT_VIEW_SCHEMA` `fight.view@1`), `validateFightView`, `projectTempoFight`, `projectContest`, `fightViewCoverage` and the stance table `FIGHT_STANCES`.
- [tests/fight_view.test.js](../../tests/fight_view.test.js): a saved revolver street fight in fog (tempo) and the Gu pit duel stepped to Fang Yuan's choice with a move in flight (contest) both project to a valid view. The test prints the table below and asserts it.

**How it was checked.** `node --test tests/fight_view.test.js`: 8 pass, 0 fail (7 before the more-to-consider round). `npm run -s check:arch`: no new cycle, no import of `main.js`. The full suite was left to the merge gate. The new test file has no entry in `tests/duration_budget.json` (an existing file, left alone); it runs in under a second.

## The shape

| Part | Holds |
| --- | --- |
| `aim` | A line of text when the engine has one, plus the ways the fight can end as rows of "when" and "outcome" |
| `you` | Means (amount and full amount when known), held things, wounds, what you are in the middle of |
| `people` | Spots, each with the people standing there: name, relation (you, ally, foe), a state word, what they are doing, and known facts with how each is known ([CBD84](../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md)) |
| `things` | Things in the scene with their spot |
| `around` | Conditions of the scene, and onlookers |
| `coming` | Who acts next, in how many seconds, and what they are doing and at whom when that is known |
| `choices` | Rows that answer CBD77's four questions: what, time, cost, likely result. Each row also has a blocked reason, the policy mark, the people it can be aimed at, and the answer shape of CBD193 (verb, subject, means, manner) |
| `log` | Lines, each with a sentence, or data when the engine has no sentence |

Each view also carries `parts` (a state per part: filled, reduced or absent) and `missing` (what is left out, per part). The validator refuses a reduced or absent part that `missing` does not name, and refuses an absent part that holds anything but null. An unknown cost is null and a free move is an empty list, so a blank reads as a blank.

## F1 · Filled, reduced and absent, from the test

| Part | Tempo (LOTM) | Contest (Gu) |
| --- | --- | --- |
| Aim | Reduced: the fight title | Reduced: endings as data, no sentence |
| You | Filled: health, stamina, loaded and carried rounds, wounds | Reduced: quantities, held things, wounds; Gu sit in the pack's own profile |
| People | Reduced: one spot | Reduced: numbered positions on a line, ids for names, no knowledge filter |
| Things | Absent | Reduced: dropped items |
| Around | Reduced: conditions line, no onlookers | Reduced: place and sunlight, no onlookers |
| Coming | Reduced: who is next and when, not what | Filled: move, target and time of each running working |
| Choices | Reduced: strikes have no odds word and no stamina cost | Reduced: no likely result, no labels, blocked reasons worked out in the projection |
| Log | Filled: sentences | Reduced: data rows |

The Hogwarts spell stack was not projected in this pass. CBD202 named two projections, and [CBD200](../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md) is the route for the third.

## F2 · Where the table under CBD192 differs

| Code | Palette cell | What the code has |
| --- | --- | --- |
| P1 | Tempo aim: "From the opener" | The saved battle keeps an id and a title. An opener writes no aim line and no wanted ending, so the aim is the title. |
| P2 | Tempo around: "Witness memory, after the fact" | The record (`worst`) is the struck fighter's own memory of the striker, written when the fight ends. No bystander is in the battle, so onlookers are absent. |
| P3 | Tempo things: "Stock alone" | Rounds are a means of the player's and show under You. The scene has no things. |
| P4 | Tempo choices: "Moves, aims, orders with odds words" | Odds words exist for back away, yield, fire and orders. The two strikes have none, and their stamina cost is not in `tempoView`. |
| P5 | Contest around: "Absent" | Onlookers are absent. The place and its sunlight are there, and this shape puts scene conditions under Around for both engines. The palette listed tempo's light and fog under Spots. |
| P6 | Contest choices: "Move rows with reasons" | A move row has a design note (`why`) and the chooser gives a reason for its one pick. The test for whether a move can start is private to the engine, so the per-row blocked reason is rebuilt in the projection. |
| P7 | Contest means: "Essence, Gu, held things" | Essence and held things project. Gu are entries in `profile.gu`, a shape the Gu pack owns, and are not listed. |
| P8 | No log row | Tempo logs sentences. The contest logs data rows (actor, move, target, outcome, landed) and has no sentence for them. |

The other cells match: a line with reach, one spot with light and fog, dropped item positions, running workings with timing, next three to act.

## F3 · Stance mapping (CBD204)

Stance names are CBD109's. The tempo column is a name in `TEMPO_POLICIES`. The contest column is a patch on an entrant's `wants`, read by `defaultChoice`. The numbers are proposal dials; 0.35 is the health share at which tempo's safe policy backs away.

| Stance | Tempo policy | Contest `wants` | Spell stack |
| --- | --- | --- | --- |
| Careful | `safe` | `fleeAt: 0.35`, `guards: true`, `pursues: false` | No chooser |
| Steady | `steady` | The defaults | The scripted `advanceStudentExchange` is the nearest |
| All in | `aggressive` | `fleeAt: 0`, `yieldAt: 0`, `guards: false`, `pursues: true` | No chooser |
| Quiet | None | None | None |
| Sparing | None. A filter that drops `shoot` from the policy pick would do it (CBD194) | None in `wants`. `defaultChoice` takes a `canUse` filter, and policy rows in `contest_choice.js` can skip moves with a cost | None |
| Merciful | None. The floor a foe can be beaten down to is set by the opener | `acceptsSurrender: true`, `pursues: false`, plus a `canUse` filter that drops moves marked `lethal` | The disarm drill is merciful by its own rules |

- The live hand-over (`handOverTempoFight`) plays safe moves alone, so Careful is the one stance the live game can run for the player today. Steady and All in run through the headless driver.
- Quiet has no home in any engine because no engine models being seen (gap G2 in the [sizing audit](COMBAT_WORLD_SIZING_2026-11-13.md)).
- The spell stack has no named policies. Joining it through the contest (CBD200) would give it the contest column.

## F4 · Pause triggers (CBD56, CBD195, CBD113)

Each trigger compares the current view with what the policy last handled for this kind of fight. "Store" means the knowledge store of CBD196, which does not exist yet.

| Code | Trigger | View field it would read | Tempo today | Contest today |
| --- | --- | --- | --- | --- |
| T1 | A new kind of foe | `people[].who[]` with relation foe: `known`, compared with the store | No kind on a fighter in the view (tags stay in the battle) | No kind; the id is all there is |
| T2 | A lost or dropped means | `you.means`, `you.held`, `things`, and a choice whose `blocked` reason is new | Yes: rounds at zero, "The chamber is empty." | Yes: a held slot gone, a dropped item in `things`, "needs a bow in hand" |
| T3 | A risk of lasting harm | `you.wounds`, the share left in `you.means`, `coming[]` aimed at you | Part: wounds and health; no incoming move to read | Part: wounds, vitality, and a running move aimed at the seat; nothing says how hard it would land |
| T4 | A changed objective | `aim` | No: the aim is the title | Part: the endings list is fixed for the fight; the seat's `wants` can change but is not an aim |
| T5 | An opening the policy has no answer for | `choices`: no row marked `policy`, or the marked row is blocked | Yes for a stance with no policy; the three policies otherwise return a move every time | Yes: `defaultChoice` returns nothing or `wait` |
| T6 | An arrival | `around.onlookers`, a new id in `people` | No | No |
| T7 | An act that cannot be taken back (CBD113's ask-first list) | The chosen row's `answer` and `cost` | Part: firing a round is visible as a cost; ending a life is not marked | Part: costs are visible; `lethal` on the move row is not carried into the choice |

Triggers no engine can supply yet: T1 (no foe kind in either view, and no store), T4 on tempo, T6 on both, and the "seen by others" half of T7 on both.

## Requests to the engines

Nothing was changed in an engine. These are what a fuller projection would ask for.

| Code | Engine | Request |
| --- | --- | --- |
| R1 | Tempo | `tempoView` carries the conditions line and place. The projection reads `b.conditions` from the saved battle for now. |
| R2 | Tempo | `tempoView.next` carries fighter ids and time until ready. The projection uses the exported `actingOrder` and the saved `ready` values for now. |
| R3 | Tempo | Strike rows carry an odds word and their stamina cost. |
| R4 | Tempo | An opener can write an aim line and the ending it wants into the battle. This is a save-shape change, so it needs a schema step. |
| R5 | Tempo | Foes in the view carry a kind (from `tags`) for T1. |
| R6 | Contest | Export a per-move quote for an entrant: can it start, the reason when it cannot, its ticks at the entrant's speed, and the targets in position. `affordable` and `methodFor` are private, so the projection repeats that arithmetic, as `contest_choice.js` already does. |
| R7 | Contest | A likely result per move, and the chance of getting away. `quoteContestOdds` quotes the whole fight. |
| R8 | Contest packs | A label for each move, quantity and entrant, a sentence for each log row, and a way to list carried powers such as Gu. These belong to the world pack, so the contest still names no world. |
| R9 | Both | Carry `lethal` and "cannot be undone" marks onto the choice row for the ask-first list. |
| R10 | Outside both | The knowledge store (CBD196). Until it exists the contest view shows the engine's truth about other entrants, marked as such on each known fact. |

## Reading

- The two engines are closest on You, Choices and Coming, which is where a shared screen would spend most of its space.
- The contest is ahead on scene (positions, things, moves in flight). Tempo is ahead on words (labels, sentences, odds words, reasons). A shared screen needs both, and each engine's gap is the other's strength.
- Aim and Around are thin in both. An aim line and onlookers are new state for either engine and are worth designing once, outside both (CBD197, CBD198).
- CBD203 (render one LOTM street fight from this view) can start from the tempo projection as it stands. R1 to R3 would make it read better and none of them blocks it.

## More to consider, round 1 (2026-11-13)

Asked by Weibao after the first report. Proposals; the two ACT NOW items are done in the new files, and the test is at 8 pass, 0 fail.

### ACT NOW (done)

- **M1 · The view says whose knowledge it shows.** A tempo view is already filtered to what the player saw (the log drops unnoticed concealed moves, foes show a hurt word and learned fields). A contest view shows the engine's truth about every entrant, including the move a foe has in flight. A screen that drew a contest view as it stands would show the player things the character cannot know. Each view now carries `knowledge: 'seat'` or `'engine'`, and the validator requires it, so a renderer or the pause rule can refuse or filter an engine-truth view until the knowledge store (R10) exists.
- **M2 · The policy mark follows the chooser the fight is run with.** The contest mark came from `defaultChoice` alone. A fight run on policy rows or the scored chooser (`contest_choice.js`) would have shown a mark on a move the policy would not take. `projectContest` now takes the chooser as `choose` and asks it on a copy of the record, because the policy chooser writes its cursor onto the record it is given.

### ACCOUNT FOR NOW

- **M3 · A choice row's id is the key back to the engine; the answer shape is for reading.** A contest row's `answer.means` is the tool when the move has one (the bow, not `bow_shot`), so the answer alone cannot be turned back into a command. Whatever takes the player's pick (CBD203) keys on the row id plus a chosen subject and manner.
- **M4 · A tempo fight has no finished view.** The session is deleted in the same commit that ends the fight, so `result` is null in every tempo view that can exist. The itemised result (CBD197) needs its own record from the publisher and cannot be read from this view.
- **M5 · Seconds are exact for the contest and approximate for tempo.** Contest ticks are tenths of a second. Tempo costs are "about seconds", scaled by speed and by injury: the fixture's shot shows 6 where the move table says 3, because the player was slowed. A shared timeline that mixes both in one fight (CBD200) would need one clock first.
- **M6 · A manner changes time and odds, and the view does not say so.** Aiming a tempo strike adds one time unit and makes the blow easier to avoid (`LOCATION_DIALS.aimCost`, `aimHitPenalty`). `tempoView` lists aims without either number. Request R11: aims carry their time and odds change.
- **M7 · The view is derived and is not a save shape.** `fight.view@1` versions the shape for its readers. Nothing stores a view, and the engines stay the one authority for fight state (AR3).
- **M8 · The Hogwarts contest rows already project.** The Harry and Draco club bout goes through `projectContest` unchanged, with the referee's hit limit showing as one way the fight ends. What stays unprojected is the spell stack in `hp_duelling_club.js`, which is where the places, the wand and the proctor are.

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| M9 | A view difference function for the pause rule (CBD195): given the last handled view and the current one, return which of T1 to T7 fired. Pure, in a new file beside `fight_view.js`. | Sonnet, small | On the two test fixtures: emptying the chamber fires T2, dropping the bow fires T2, a stance with no policy fires T5, and an unchanged view fires nothing. |
| M10 | Answer to command, both engines: a row id with subject and manner becomes a `commitTempoMove` command or a contest `{move, target}`, and an answer the engine cannot take returns CBD97's fourth reply. | Sonnet, small, before CBD203 | Every usable row of both fixtures round-trips to a command the engine accepts; a blocked row is refused with its reason. |
| M11 | Project the spell stack (`hp_duelling_club.js`) as a third projection. It is the one engine that would fill People by named spot, Things and an onlooker. | Sonnet, medium | The disarm drill projects to a valid view with four named spots, the wand as a thing and the proctor under Around; the coverage table gains a third row. |
| M12 | Apply R1 to R3 in `tempoView` (conditions, ids and time in `next`, strike odds and stamina cost). Small, no save change, and it lifts three tempo parts. | Sonnet, small, needs the tempo owner's lane | Tempo's Around conditions come through `tempoView`, and the Choices gap for strikes leaves the missing list. |
| M13 | Register this write-up, add the fights entry line to the area guide, add the test to the duration budget, and mark CBD202 and CBD204 in the palette. These are edits to shared files that this session was told to leave alone. | Haiku, small, at merge | The four files name `fight_view.js` and this doc. |

### Suggestions (separate from the list)

- M9 and M10 together are what CBD203 needs beyond drawing. Doing them first keeps the rendering lane to layout.
- M11 would test the shape harder than either projection so far, since the spell stack is the engine that has what the shape was drawn from (CBD75's mock).

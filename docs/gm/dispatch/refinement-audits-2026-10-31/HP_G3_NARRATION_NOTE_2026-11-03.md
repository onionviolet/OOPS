# HP G3 and G8: narration grain and fame as knowledge asymmetry (proposal, 2026-11-03)

Proposal under AD32; nothing here is an accepted decision. Follows [the gap probe](HP_LEAD_RUN_START_2026-11-03.md) (G3, G8) and the [whole-world plan](HP_WHOLE_WORLD_PLAN_2026-11-03.md). Rules read: AR8, LSD199, LSD209, CLR1-CLR3, AD44. Source locators just; no canon text is quoted.

## G3: the prologue and the ten-year skip

**Problem.** Book 1 chapter 1 is narrator point of view with no lead scene (all 8 scenes of shard hp1c001 are chapter 2), and the book then skips nearly ten years. A lead run built from the book can leak chapter 1 into Harry's notebook, because the reader holds it and he does not.

**Existing owners (nothing new).**
| Owner | What it gives | Where |
| --- | --- | --- |
| LSD209 narration grain | Narration (reported events, description, anything the lead is not in) becomes journal, knowledge and texture, not a played step (default; dial: zoom into steps) | `LEAD_LIFE_SYSTEMS_DESIGN.md` |
| LSD199 | What the lead knows then versus what the narrator tells: script from evidence kind | same |
| Knowledge `basis` | Every knowledge write names a kind (observation, instruction, recollection, inference), who it came from and the situation; `validateKnowledgeBasis` in `causal_situations.js` | `src/causal_situations.js` |
| AR8 and `knowledge_view.js` | The Knows page reads the seat's own knowledge just, so a fact he has not received has no path to the page; provenance reads "You saw it", "You were told", "You remember it", "You worked it out" | `src/knowledge_view.js` |
| Act `participants` | An act starts just if the named people are at its place, which is the record of who was there | `src/place_acts.js` |

**Default, dial and reason.**
- Default: Harry's knowledge enters through act effects with a basis he could have. Chapter 1 and the skip produce no act and no knowledge entry; what he remembers of those years is a `recollection` written from a chapter 2 or later paragraph (window 1 does this for the dream and the strangers). Reason: the narrator's facts have no seat in his life, so the safe place for them is research notes, not the pack.
- Dial: a spectator seat may see chapter 1 as a separate narration card that does not write the lead's knowledge. Reason: it is a different seat. Not built; a later lane under LSD199.
- Dial: what Hagrid and others tell him later arrives (default, reason: he cannot check it) as `instruction` attributed to them, so a claim he cannot check shows as told, not as known fact.
- Reader-just items in the chapter 1 slice (locators just): the night scene `en b1 c1`, the people who left him, the animal sightings. Window 3 keeps these out although Hagrid mentions that night (`en b1 c4 p104`): Harry learns just what Hagrid says, as told.

**Done check.** A leak regex on Harry's knowledge after every act, listing words he cannot hold yet. Windows 1 and 2 ran it (chapter 1, prologue, wizard, school, owl and similar); window 3 changes the list because Hagrid legitimately supplies those words, and checks the chapter 1 just items instead. Each window states its list in its receipt.

## G8: fame as knowledge asymmetry

**Problem.** Strangers know him and he knows nothing of them. The first full bite is the crowd at the shopping street in window 4 (chapter 5); window 3 just needs the telling.

**What window 3 needs.**
- Harry is told he is famous (`en b1 c4 p45`, p83, p101, p121). It is an `instruction` from Hagrid, and Harry doubts it (p114), so no act marks it as fact. He does not learn who knows him, or how many.
- No projection of other people's view of Harry is built here. That arrives with window 4 as an observer projection plus event news, using the existing world_events reader (`src/world_events.js`); not built in window 3.
- Window 1's night act already holds the strangers as a `recollection` with no explanation; nothing to change.

**Back-test: it cannot leak to an NPC who was not there.**
1. Knowledge is stored per actor. The runner asserts that after the last act no actor except the player holds a key starting with the window's prefix.
2. The Dursleys leave the room at `en b1 c4 p128`. Acts after that list just the keeper as participant, and the runner confirms the three Dursleys are in the other room when they start, so the act rule is the witness.
3. A unit test in `tests/hp_lead_window3.test.js` writes a player-just knowledge entry through an act and checks that a co-located NPC's knowledge is empty.

**Not decided.** How NPC-side fame is stored (a view per observer versus a fact about Harry that people may hold) is a window 4 question; this note sets the test it must pass.

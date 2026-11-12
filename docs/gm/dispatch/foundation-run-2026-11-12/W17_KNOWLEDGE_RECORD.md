# W17 knowledge record: a believed side beside a true side

*Proposal, 2026-11-12, Wave 17 lane E2. Engine work under PC95; all of it is a proposal. Sources: GKM247 to GKM250 in the [Gu abilities and killer moves considerations](../../../GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md) (Reverend Insanity ch. 2118, paraphrased there) and the Wave 15 recipe-truth lane (`b63d5096f`), whose scenes are the acceptance cases. Code: `src/knowledge_record.js`, `src/world_substrate_packs/knowledge.js` (pack `n.knowledge`, registered in the engine world), `tests/knowledge_record.test.js`. Codes KR1 to KR10 are local to this note.*

## The idea

A holder's knowledge of one thing is one record with two sides of the same shape. The true side is what the record really is: the steps a holder carries out when he follows it, or, for a fact, where the world keeps the answer. The believed side is what he takes it to be. He acts on the believed side: the quote he is shown binds it and reads the world through his own beliefs. Settlement binds the true side through `composeWorking` and the fillers' own laws, so the module decides no outcome. Records are the pack's state on the holder, written by the pack alone when a learn, teach or check effect lands in his place.

## Proposed defaults

| Code | Default | Dial | Reason and cost |
| --- | --- | --- | --- |
| KR1 | A record is `{id, subject, true, believed, source, doubts, checks}`; `source` is a basis in the four kinds of KNW2 (recollection, observation, instruction, inference) with who and what it came from. A composition record names a filler per slot on each side, and the believed side lists the conditions the holder knows of. A fact record points at one quantity or property of a holder and carries the believed value. With no believed side given, a record believes its own steps | Subject kinds can grow (an assay of a creature would be a fact record on its holder) | GKM247. One shape serves recipes, formulas, blueprints and rumours |
| KR2 | The quote shown to a holder (`quoteRecord`) binds the believed side, reads through `believedRead` and is refused by the closures he knows of. It does not bind the true side | A host may show less | Closes the Wave 15 gap where a free kernel quote showed the failure |
| KR3 | `believedRead`: a holder sees himself, his place and what is in it; anything farther he knows through a fact record or not at all. A belief about a thing stands over what he sees of it until he checks | Which properties are plain to the eye is a world row, not built | KW17. The cost is that a holder standing in a place can still be wrong about it |
| KR4 | Use (`beginRecord`) binds the true side as an ordinary working. The same call serves a move, a brew and a made thing | None | AD38: a false step fails or underperforms the way that step does under its own law |
| KR5 | Checking is a kernel working (`KNOWLEDGE_LAW` `check`) with a route row: evidence kind, price, minutes, miss rate. Each thing the evidence shows is missed on its own addressed draw. What is found moves belief to the truth; a disagreement between two sources moves it to doubt | Routes are world rows; `seed` is a world dial | GKM248. Trusting without checking is free |
| KR6 | Evidence kinds: `dry` (work it through in the head: a failing, absent or extra step and a condition written into a step), `trial` (a real use beside the quote shown before it), `second` (another holder's record), `watch` (the steps another holder was seen to do), `look` (go and see a fact) | A deeper `dry` that compares outcomes | A trial is an ordinary use with its own real backlash; a copy from the same forger agrees with the lie |
| KR7 | Teaching is a working. The record travels as the student's true side. `side: 'true'` hands it over as it is; `side: 'believed'` retells it from the teacher's understanding. `cover` names another of the teacher's records to present it as; `slots` withholds steps; `say` is the value told for a fact | Lesson price and minutes are world rows | GKM249. A retelling drops a flaw or an improvement the teller does not know of |
| KR8 | A record arriving under an id already held fills the slots the first leaves out; the first keeps its steps and provenance. Two tellings of a fact that disagree leave the first in doubt | Which copy wins could be the holder's choice | Withheld last step, two halves of an inheritance |
| KR9 | A condition is a row on a filler. Closing one (`close`) is a working that adds a `condition.closed` law field on the target with its own end, and the closer has to hold a record that lists the condition. `conditionAuthority` refuses the step with the lapse price, or charges the forgo price | All four prices are world data | GKM250. The substrate ends the closure, so no second clock |
| KR10 | A holder with the mind owner's `mind_memory` set holds a record while its id is in the set. The pack announces a new record with `effect.add.memory`, which `mind.js` now answers | None | An effect that takes a memory takes the knowledge, and one that lapses gives it back |

## Relation to the knowledge rules

The [knowledge rules](../../../KNOWLEDGE_RULES.md) KNW1 to KNW26 govern the live game's store (`simulation.knowledge[actor]`, written by the `knowledge` effect). This pack is the engine world's counterpart and follows the same lines: truth, knowledge and display stay apart (KNW1); one writer per store (KNW2); every record has a basis (KNW4); a lie writes a wrong belief and leaves the world's truth alone (KNW11); a failed trial teaches (KNW14); a teacher passes on what he holds (KNW15); a retelling loses detail (KNW18); nothing is forgotten without an outside mechanism (KNW19); what a holder is shown leaks no truth (KNW22). Three differences are open for the tie-in: the engine world has no three-stage ladder (KNW3), a told thing is believed at once where KNW10 keeps an account apart from a belief until trust or a test, and the two stores are not yet one.

## What the fixture shows

All scenes are data rows played by one runner in the test; none has code of its own. The holder's rule is in the runner: he takes the first option whose own quote holds.

1. The taught false move. Trusting disciple: own move closed, taught move quotes 64, fails on its second step, 18 vitality published against him. With one extra row (an hour of thought, 12 mental effort) his belief moves, the same quote fails, and he pays 40 essence to work his own move without the trigger. A missed check costs the same and changes nothing.
2. A potion formula with a wrong step on `BREW_LAW` (dross, found by tasting) and a blade from a miscopied blueprint on `PROCESS_LAW` (harder and less tough than promised).
3. Annotated (quoted 64, does 70; handed on it keeps the note, retold it loses it), incomplete (8 of force, 4 turned back), backdoored (30 vitality when the author closes the mark; a holder who found the mark sees it closed and declines), withheld last step (charge held until a second scroll arrives).
4. Rumours: a price (unknown market cannot be planned on; told 30, sells at 12; a second source brings doubt; a visit brings 12) and a place (a cave said to swallow backlash).
5. Every scene ends in the same saved world, workings, costs and quotes by one jump, minute by minute, and with a save and restore after every change.

## Limits and open points

- **Costs are published, not debited.** Rows are `{holder, quantity, amount}` on the receipt (KW15). The backlash of a failed step is such a row, so the disciple's vitality does not drop in the world until the cost owners (E1) debit it.
- **The shared case runner cannot run these yet.** `runCaseData` computes `blocked:runner-working-case` for workings. The scenes run in the lane's own test runner; it needs a working action there to become coverage cases.
- **No staleness.** A fact believed last year reads as firmly as one seen today. A decay toward doubt is a clock law this pack does not have.
- **A check can miss but cannot mislead.** A check that finds something false (a false alarm) is not built.
- **Denial does not test reach.** The closer has to know the condition; whether he can reach the target belongs to the scene.
- **A holder's choice rule lives in the test runner.** The actor chain (E7) is the place for it.
- **`recordsOf` returns both sides.** A host shows a holder `viewRecord`, which leaves the true side out.

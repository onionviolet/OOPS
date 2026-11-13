# Contest contract

*Version 0.1 (v0), 2026-11-12. Owner: chat C in the [procedural foundation plan](PROCEDURAL_FOUNDATION_PLAN.md) (OS2). Module: [`src/contest.js`](../src/contest.js), resolvers [`src/contest_resolvers.js`](../src/contest_resolvers.js), bodies [`src/contest_bodies.js`](../src/contest_bodies.js). Tests: [`tests/contest.test.js`](../tests/contest.test.js) (contract), [`tests/contest_consumers.test.js`](../tests/contest_consumers.test.js) (FC1 to FC3). A proposal under AD56: it widens what fights can do and every number is a default with a dial. Changes are versioned requests to chat C. Inventory and reasoning: [phase 1 checkpoint](gm/dispatch/foundation-c-2026-11-12/CHECKPOINT.md).*

## What a contest is

Several actors' workings meeting. Each move an entrant makes is a [kernel working](KERNEL_WORKING_CONTRACT.md) whose last step releases it against a target. The contest orders those workings on one readiness clock, decides each meeting through a resolver the world pack names, lands what hits on bodies in the [world substrate](WORLD_SUBSTRATE_CONTRACT.md) and ends with typed outcomes. It never says what a Gu, a spell or a bite does (SC9): moves are rows the world pack supplies.

```
law    = defineContestLaw({id, revision, moves, endings?, lethal?, dials?, resolvers?})
record = beginContest(law, {id, seed, place, entrants, sides?, limits?, detail?, at?}, world)
{record, world} = stepContest(law, record, substrateRules, world, ports?)   // one actor acts or finishes a step
{record, world} = runContest(law, record, substrateRules, world, ports?, {until?})
odds   = quoteContestOdds(law, spec, substrateRules, world, {samples?})
move   = {resolver, steps: [ticks...], power?, aim?, notch?, type?, costs?: {q: n}, requires?: {q: n},
          effects?: [{verb: 'remove'|'add', object: q, amount?}], lethal?, staggers?, kind?: 'guard', block?: {q: n}}
entrant = {id, side, body, profile: {attack, evasion, armor, notch, resist, layers}, moves, speed?, perception?, stealth?,
           wants?: {fleeAt, yieldAt, yieldAtSideHurt, acceptsSurrender, pursues, guards, kite, target}, lifecycle?}
```

## Rules (CFC1 to CFC16, v0 as built; codes kept from the phase 1 proposal)

| Code | Default | Dial and reason |
| --- | --- | --- |
| CFC1 | **Workings that meet.** Two or more sides; each entrant's move is one kernel working with roles `actor` and `target`, both of kind `entrant`, read at the step's time (KW3). | Any number of sides. Wolves and rivals do not take sides by rule. |
| CFC2 | **A named resolver per move.** `strike` (upstream hit chance and damage spread, flat armor), `notch` (logistic on a notch gap), `layers` (a packet through Gu defense layers). A law can add its own. | A gun can use `notch` in a `strike` world. Worlds differ in how fights feel (AD5). |
| CFC3 | **Moves are rows.** Steps in ticks (a tenth of a second), costs and requirements on body quantities, effects as verb plus object (the plan's effect grammar, SB3). | A canon technique costs a row (PFP1). |
| CFC3a | **Entrants bring sentences and their own workings (SC9).** `moveFromSentence(sentences, {resolver, steps, quantityOf})` builds a move from effect-grammar sentences (verb, object, target, time, carrier, cost): every verb but `add` lowers the object's body quantity, `block` sentences make a guard, and `quantityOf` maps grammar objects onto a world's body quantities. A move with a `bridge` `{law, method, bindings, facts, ports, effects, spent}` runs the entrant's own kernel working (a Gu activation, a composed killer move) unchanged on its own law at release; the contest reads its effects as sentences and debits what it spent. A working that stops fails the move with its own reason; the chooser quotes it first. | The bridge runs the foreign working to its end at one contest step; its own minutes are its own clock (CB-15). |
| CFC4 | **One readiness clock.** The entrant with the earliest next time acts; ties go by id (the fixed order KB8 asks the kernel to own). Speed scales step ticks (100 is the reference). | Per entrant. |
| CFC5 | **The opening comes from noticing.** Best perception plus up to `noticeSpread` (10) of keyed luck against the other side's best stealth; an unaware side starts `surpriseDelay` (20 ticks) late. | Per law. |
| CFC6 | **A working can be cut.** A hit of at least `interruptShare` (0.15) of the target's vitality, or a `staggers` move, interrupts a multi-step working the target has not finished (KW8). Costs are paid when the working begins and are not refunded by default. | Per law; a refund row is KB3 on the kernel side. |
| CFC7 | **Hits land on bodies in W.** Each landed effect is an `add` on the target body's quantity with source `contest:<id>:<meeting>`, plus a `contest.blow` effect into the place; a body whose ending quantity reaches zero publishes `contest.down`. Control falls by fifths of vitality lost (`impairment` 1, 0.9, 0.75, 0.5, 0.2, 0.1, the harm_state ladder; CBR22). | Body quantities `vitality` and `stamina` are declared by the contest pack until W adopts them (request W4). |
| CFC8 | **Costs and side effects land on W.** Essence, ammunition, a wand in hand are body quantities a move costs or requires. | A world pack declares its own quantities. |
| CFC9 | **Lethality is a dial.** A law is lethal or not; in a lethal law a `lethal` move that downs a body kills it, any other knocks it out. | Default not lethal (AD19). |
| CFC10 | **Typed outcomes.** Loser outcomes are the defeat publisher's list (`DEFEAT_OUTCOMES`, CBR2, test-pinned); winner outcomes follow CBR3. A law maps each ending quantity to an outcome (`endings`), plus `noMeans` for an entrant with no affordable move. | Per law. |
| CFC11 | **Leaving and yielding are attempts.** `withdraw` succeeds with `leaveBase` (0.55) plus `leaveSpeed` (0.004) per speed point over the fastest opponent; a failed try gives that opponent a free blow; success records pursuers that want to follow (for `pursuit.js`). `yield` is accepted only if every standing opponent accepts surrender. A side with `breakAt` routs when that share of it has fallen. | All dials, with tempo_exit's base as the reference. |
| CFC12 | **Far is the same rule.** `detail: 'far'` runs the same steps and draws, keeps hits as pending totals per body and lands them once with one `contest.settled` effect. Outcomes and body totals equal the near run (tested). Odds for a chooser come from the same rule on `oddsSamples` (24) keyed seeds. | Equality holds while nothing in the place answers a blow mid-fight; with reactors, far trades mid-fight reactions for cost. |
| CFC13 | **Fights are evidence for both sides** (proposal kept from phase 1). Not built in v0: the log and the world chain hold what happened; writing what each side observed into knowledge owners waits for N (MC8, CBR15, CBR16). | |
| CFC14 | **Conflict is wider than fighting** (proposal kept from phase 1). Not built in v0: a debate or trial would be a law whose moves use `notch` and land on standing or composure, as the Hogwarts rows already land on composure (CBR30). | |
| CFC15 | **The same chooser for everyone.** `defaultChoice` reads wants (flee, yield, side morale, guard when threatened, crowding: `crowd` 3 attackers per target, `kiteCrowd` 1 when the target is faster and moving) and is used for the player's auto-play and every other actor (PFP11). A's chooser replaces it through `ports.choose`. | Per law and per entrant. |
| CFC16 | **Saves.** The record (`conflict.contest@1`) holds entrants, their running kernel records, the clock and the log. `restoreContest` validates it and each nested working. A reload mid-fight continues to the same end (tested). | Budget: `maxMeetings` (400) meetings, then a stalemate. |

The Wang Er fixture exercises optional saved positions on a local axis, held and dropped tool IDs, and per-entrant injuries written with the existing harm ladder. The chooser reads reach and availability. Release rereads both entrants, and visible projectiles check the place's sunlight and the target's direction toward the attacker. The Gu row supplies the close-and-cast and cross-over tactics. The position rules are shared across contest laws. Bridged Gu costs settle at release, including a miss, while ordinary declared costs still debit at action start. [Fixture receipt](gm/dispatch/foundation-run-2026-11-12/RUN.md#wang-er-fight-and-one-gu-swap)

The remaining v0 backlog includes multi-target shapes, social contests on standing, mass fights and joint settlement in the kernel (KB8). The local-axis proof leaves integration with native place geometry, body parts and equipment custody open.

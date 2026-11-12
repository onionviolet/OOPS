# W15 recipe truth: knowledge that can be wrong

*Proposal, 2026-11-12, Wave 15 lane. Engine fixture work under PC95; nothing here is accepted direction. Source: GKM247 to GKM250 in the [Gu abilities and killer moves considerations](../../../GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md) (Reverend Insanity ch. 2118, paraphrased there). Code: `src/recipe_truth.js`, `tests/recipe_truth.test.js`. Codes RT1 to RT9 are local to this note.*

## The idea in one paragraph

A holder keeps a record of a composition: which filler goes in which slot, and which activation conditions it has. The record is what the holder believes. What works is decided elsewhere, by the fillers' real laws and the world they run in. Using a record binds it through `composeWorking` and settles it under those laws, so a false record fails the way any working with that filler fails. The module decides no outcome. It adds three things around the kernel: the record, a priced way to check it, and condition rows another holder can close.

## Proposed defaults

| Code | Default | Dial | Reason and cost |
| --- | --- | --- | --- |
| RT1 | A record (`defineRecipe`) is data: composition id, filler key per slot, the condition ids it discloses, holder, source and the checks made on it. A learner's record equals the truth unless someone made it differ | Who may alter a record is the teaching owner's question | GKM247. A teacher, a forged inheritance or a damaged manual all produce the same thing: a record with another filler key |
| RT2 | Truth is the book the caller passes: compositions, fillers with their laws, and the fillers' true condition rows. There is no stored "correct answer" per recipe | A world may hold several working fillers per slot | An annotated manual can beat the official recipe (row 3), so "official" is one record among others and the law is the judge (AD38) |
| RT3 | Activation is `bindRecipe` plus the kernel's begin and settle. A false filler fails at its own step; the backlash is what that failed step charged (`backlashOf` reads the receipt's costs) | Backlash size belongs to each law | GKM8, GKM247. The fixture shows the same receipt shape for a false record and for a true record with a part too weak to carry it |
| RT4 | A record may leave slots out. The working is composed from the slots it fills | A world can make a slot hard to do without by what its law does when the step is absent | Covers an incomplete manual and a withheld last step with one mechanism. Part strength and the side effect both come from the law, since the missing step never ran |
| RT5 | A second record can supply what the first lacks (`mergeRecipes`); the first keeps its own steps | Which record wins a conflict could be a choice for the holder | Withheld last step, two halves of an inheritance |
| RT6 | Checking (`checkRecipe`) is an act with a price, a duration and a miss rate, by route. Trusting without checking is free | Routes, prices and miss rates are world rows; more routes can be added as kinds | GKM248 |
| RT7 | A condition is a row on a filler: kind, role, `deny` (cost to the denier and how long the closure lasts), optional `lapse` (what the user pays when refused) and optional `forgo` (the price of working without it) | All four are world data | GKM250. The kernel's authority port (KW35) carries the refusal and the costs |
| RT8 | A backdoor is a condition the record does not disclose, cheap for its author to close | The author's price and the lapse cost | GKM249 needs no new mechanism: teaching, denial and pressure |
| RT9 | Records and denials save as plain JSON under `recipe.truth@1`; a running activation saves as an ordinary kernel working and restores against the same record's fillers | None yet | The composed law ref already names every filler, so a save cannot resume under another record |

## The three check routes

- **Deduce.** Reads the method against a scene without doing it: a dry run through the kernel's quote, plus slots left out and conditions the record does not list. Costs time and mental effort. It finds a step that would fail. It does not find a step that works badly, such as a potion step that finishes and makes dross.
- **Trial.** Does it for real in a scene the caller picks. A small push in a warded place makes the backlash small, and the backlash is still paid. It sees what happened there, so a backdoor nobody closed during the trial stays hidden.
- **Compare.** Reads a second record and reports where the two differ. It leaves open which copy is right, and a copy from the same forger agrees with the lie.

Each fault is missed on its own draw against the route's miss rate. The draw is addressed by check id, so the same check gives the same result after a restore. The result has a holder's side (found faults, costs, backlash, the record with the check added) and a truth side (`missed`) that a host keeps off the page.

## What the fixture shows

1. A teacher's false move: under pressure the disciple's own move has its spoken trigger closed (the teacher pays attention for it), he uses the taught move, it fails on its second step and he takes 18 health. Where he checked first, an hour of thought finds the fault for 12 mental effort, and he pays 40 essence to work his own move without the trigger.
2. A potion formula on the brewing law (`src/brew_law.js`) with the same record, check and difference functions. A wrong reaction finishes and makes dross; a step that cannot be done fails and leaves the batch in the vessel.
3. Better, incomplete, backdoored and withheld recipes are four records over the same book, with no code of their own.
4. One jump equals minute by minute, and a save after the first step with a denial already made reaches the same end.

## Limits and open points

- **A kernel quote is the truth.** `quoteWorking` on a bound record shows the failure for free. A host should show a holder the record's own claim, or a quote only after a check, or it gives away what RT6 prices. Not built here; it is a host rule for tie-in.
- **Deduction is blind to bad-but-working steps.** Judging "this works worse than promised" needs the record to carry a promised result to compare with. Left out to keep the slice small.
- **Denial does not check that the denier knows the condition or can reach the target.** That belongs to the knowledge owner and the scene. The fixture passes the row directly.
- **A check is one act with a finish time**, not a working of its own. If checks should be interruptible, make the route a kernel method later.
- **GKM248 names two more routes** (watch the teacher use it, ask someone whose attainment covers the path). Both fit as new route kinds; neither is built.
- **Costs are published as rows** (`{holder, quantity, amount}`). No owner debits them yet; the fixture reads them.

## Hot files

No change needed in the kernel, the engine world or the procedural docs. One candidate for a later kernel line: `composeWorking` could accept a composition with optional slots, which would replace the sub-composition built in `bindRecipe`.

# Agency contract

*Version 0.1 (v0), 2026-11-12. Owner: chat A in the [procedural foundation plan](PROCEDURAL_FOUNDATION_PLAN.md) (OS1). Module: [`src/agency.js`](../src/agency.js). Consumers: [`src/agency_household.js`](../src/agency_household.js) (a person) and [`src/agency_wild.js`](../src/agency_wild.js) (a wild creature on the world substrate). Tests: [`tests/agency.test.js`](../tests/agency.test.js). A proposal under AD56: it widens what every actor can do, and every line is an adjustable default. Changes are versioned requests to chat A.*

## What it does

An actor (a person, a creature, a Gu, a process) picks a working from what it wants, what it knows and what it can bind. Every candidate is quoted by the kernel's own quote ([KW4](KERNEL_WORKING_CONTRACT.md)) with the actor's knowledge as the reader, which is the same call the player's quote makes. The score is a sum of labelled terms, and the two strongest become the cause line the player can read.

```
agent    = defineAgent({id, revision, label, wants: {want: {weight, label}}, thrift?, latitude?, novelty?, pressureAt?})
quote    = actorQuote(law, method, {id, bindings, at, knows, authority?, facts?})   // player and NPC alike
needs    = {want: {urgency 0-1, why}}                                               // read live from body, place and knowledge
candidate= {id, label, law, method, bindings, serves(quote) -> {want: gain -1..1}, cost?(quote), costWhy?, riskWhy?, bias?}
choice   = chooseWorking({agent, needs, candidates, at, knows, authority?, facts?, root?, invent?})
         -> {choice, label, score, quote, cause: {line, terms}, passed: [{id, reason}], pressure, invented, scored}
```

## Rules (AGC)

| Code | Default | Dial and reason |
| --- | --- | --- |
| AGC1 | **An agent is data.** Weighted wants plus four dials, under one id and revision. | A world pack names its own wants (a Gu's hunger for its food, a Beyonder's acting pressure). The vocabulary is per world, not a fixed list (backlog AGB1). |
| AGC2 | **Wants are weights; needs are readings.** A want's weight is who the actor is; a need's urgency is how it is now, with the reason the actor would give. | Needs read the actor's body (L), its place (W) and what it knows (N, `simulation.knowledge` until then). Mood and fear are read live, never stored meters (MND5); the worm's fear is derived from who is present. |
| AGC3 | **One quote for everyone.** `actorQuote` is the only quote call; the player's quote and an NPC's quote for the same bindings and knowledge are deep-equal (PFP11, SPR26). | An NPC may skip display work, never the rule. |
| AGC4 | **Choice reads belief; settlement reads truth.** The quote's reader is the actor's knowledge. A wrong belief still drives the choice and is corrected when the actor sees the truth (SPR31, route `seen`). | A mindless process (weather) may read the truth directly. |
| AGC5 | **A candidate is a working plus what it serves.** `serves(quote)` maps the quote to gains per want, so whatever moves the quote (stock, price, reach) moves the choice. A risk is a negative gain with its own reason. | Cost is computed by A from the quote's facts until K's quote carries a cost field (KB9). |
| AGC6 | **Score is a sum of labelled terms.** `weight x urgency x gain` per want, `-thrift x cost`, and `bias` for authored priority. | Bias alone reproduces the existing controllers' fixed priority order, so the 58 controllers can move with no behavior change. |
| AGC7 | **Ineligible candidates drop with their reason.** A quote that fails is kept in `passed` with the kernel's reason, so "why didn't they" is readable. Ties keep candidate order. | |
| AGC8 | **Invent under pressure (NV4).** When the strongest want pulls at least `pressureAt` and no eligible candidate serves it, an agent with `novelty` above 0 asks its `invent` port for one new candidate (cause kind `pressure`). The candidate goes through the same quote and score; it counts only if it runs (PFP16). An actor keeps an invented routine in its own state. | `invent` is usually P's `generate` keyed at `address(agency.invent, actor, clock)`; one attempt per decision, within P's draw budget. |
| AGC9 | **Banded inputs, watched edges.** A choice on the world substrate reads only banded quantities (`bandOf`) and declares every band edge as a watch (`bandWatches`), and dwell or travel time as a horizon. `decide` returns nothing unless the choice or a belief changes. Then far places settle an agent in a few segments with the same totals as minute-by-minute play (PFP12, SPR28, WSC5-WSC6). | Bands are per want; finer bands cost more segments. |
| AGC10 | **Every choice has a cause line** (SPR32, PFP13). The two strongest positive terms, said in the actor's own reasons; when the strongest want goes unserved, the line leads with why the working that would have served it dropped out. | The line says only what the actor knows. |
| AGC11 | **Receipts are bounded.** Each actor keeps its last `CHOICE_RING` (8) choices with time, choice, cause and any invention (SPR30). | Ring size per world. |
| AGC12 | **Latitude is a keyed draw.** A temperament with `latitude` above 0 may take any option within that score of the best, drawn at `address(agency.choice, actor, clock)` (GR17), so a reload replays it. | Default 0: deterministic best. |

## The two consumers

| | Cook (person, original Village manor) | Liquor Worm (wild creature, RI) |
| --- | --- | --- |
| Law | `a.household@0`: cook, buy, repair, dry, rest | `a.forage@0`: go, feed, search, stay |
| Wants | feed 1, mend 0.6, dry 0.5, rest 0.2; thrift 0.5 | drink 1, safety 0.9, rest 0.1; novelty 0.5, pressureAt 0.2 |
| Needs read | Pantry and house (seen), stall stock and price (heard) | Satiety band (its body), people present (its place), wine at places it has seen |
| Scarcity that changes the choice | Raw meat gone: cook drops out, buy wins. Believed price past the purse: buy drops out. A dear but affordable price lowers buy by a cost term | A cellar it knows is dry keeps it home. One it wrongly believes stocked draws it out, and seeing it dry sends it home with the reason |
| Old rule kept | `household_fortunes_domain.routineNeed` as the `ROUTINE_NEED` table: default wants score a routine above 0 exactly when the old rule runs it | `gu_keeper_wild` numbers (1440-minute meal, 60-minute trip) as a data row; the scene's fixed timer becomes a choice |
| Runs on | K only (quote) | K quote, on a W pack `a.wild_agency` |

## What v0 cannot express yet (backlog)

| Code | Gap | Default proposal | Owner |
| --- | --- | --- | --- |
| AGB1 | No shared want vocabulary | World-pack data, named against NMR, once three worlds use it | A |
| AGB2 | One-step choice; no plan of several workings (save coin to buy a Gu) | Bounded search over composed workings once K's binding search (KB4) lands | A with K |
| AGB3 | Group choice (a pack, a sect, a crowd) | After M v0; `crowd.js` goal weights are the start | A with M |
| AGB4 | Three mood owners (`mood_thoughts.moodOf`, `everyday_life` conditions, `tempo_allies.allyFear`) | `moodOf` as the one read port; the other two write thoughts into it | Request to their owners |
| AGB5 | Loss of control as a mind state overriding wants | Through LotM's carriers first (MND9, MND10) | A with R |
| AGB6 | The controller loop in `simulation.js` still orders by fixed priority | Opt-in `agency` field on a controller definition that scores candidates through this contract; priority becomes AGC6's bias; nothing changes for controllers without it | A, next phase |
| AGB7 | A travelling worm stays on its departure place until it arrives | A `route` holder or in-transit place from X | X |
| AGB8 | Cost is computed by A from quote facts | K's quote cost field (KB9) | K |
| AGB9 | Neither consumer is live: no host calls them, no save slice | Wire the cook through the manor routine and the worm through the Keeper scene when W embeds into live state | A with G and the household owner |

# Event dispatch and one petition

SHOWN means inspected native instructions, mapped jump tables or selected
pseudocode in build 25097075. Fractions are nominal draw-slot weights. C rand
and modulo do not promise ideal uniformity; caller frequency and rejection
change realized event frequencies. Every preferred-image address is static.

## E1: RandomTurnEvent

Entry `0x1408cc665` draws `rand()%120`. A separate `rand()%6` selects a report
phrase. Before the mechanic switch, nonzero `Ungovernable` forces event 29.
The actual switch accepts only 0..59; 60..119 skip to cleanup. Its 60-entry
relative-address table at `0x140ef5554` has 47 distinct targets. Slots 56 and
57 also go straight to cleanup. Thus at least 62/120 normal draw slots are
quiet before other eligibility failures. This is deliberate quiet capacity,
not 120 unique encounters.

| Shared slots | Nominal dispatch weight | Inspected target |
|---|---:|---|
| 7..11 | 5/120 | Shared family with a further 15-way draw |
| 19, 49..51 | 4/120 | Militia-arrival family |
| 30, 42..44 | 4/120 | Goblin treasure-gift family |
| 52, 53, 59 | 3/120 | Refugee-arrival family |
| 56, 57 plus 60..119 | 62/120 | Direct quiet/cleanup |

Other individual slots have 1/120 before their own gates. For example slot 0
removes one knight only when the army has a knight. Rejection here does not
loop back for a new top-level event. The displayed benefit rate therefore
cannot be computed by renormalizing only eligible events.

Caller `TurnReport` has policy-dependent call bursts, including a
`RandomEventMode` branch and forced per-faction Ungovernable calls. The per-call
weights above are not a per-year event rate. Complete caller policy and all
branch cooldowns remain open.

A recovery warning matters: REA's original pseudocode mis-nested slot 1's
opinion checks. Assembly shows opinion above 29 grants one knight; its later
above-69 check lies under the opposing path and is unreachable there. Do not
silently repair that into a guessed intended 3..7-knight high-opinion award.
That is static code evidence, not a played bug report.

## E2: RandomExploreEvent

Entry `0x14090809d` handles `Aimless==1` first, clears it, displays region-aware
quiet exploration, and returns after that path. The ordinary path loops until
a local handled flag becomes 1. Each attempt draws `rand()%35`, with 35
distinct top-level targets at table `0x140f019d0`.

Unlike turn events, an ineligible ordinary explore selection can leave the
handled flag zero and redraw. For the inspected travelling-merchant slot,
eligibility requires `TravM==0`, `WagonMan==1`, a nonzero trade post and region
other than 15. Its accepted result sets `TravM` to 1 or 2. Several later
encounters test other geography, law or existing actor flags. This is rejection
sampling over stateful routes, not an external weight file.

`RefreshPhase` reads TravM, but a complete expiry/reset chain was not traced.
Call this a state gate, not a proven one-turn cooldown or a permanent once-only
encounter. Nominal accepted probabilities require the full current eligibility
set; 1/35 is only the raw candidate weight.

## E3: ProcGenExplo

Entry `0x140c000ac` draws `rand()%24`, initializes local generator/encounter
state and calls MonsterMaker before dispatch. Nonzero `FORCELANDBEYOND`
replaces the selected index. Its relative table `0x140fac120` has 24 slots but
19 distinct entry points: 0..3 share one target (4/24) and 14..16 share another
(3/24); the other 17 slots each have 1/24. These families contain their own
subdraws and authored content. A 24-way draw is not 24 equal encounters.

REA reported this function as `ok` while its unresolved jump table omitted
most family bodies. The slot/target counts above come from native assembly
and direct signed-offset table parsing, not that incomplete pseudocode.
Full family predicates, exits, repetition and cooldown consumers remain open.

## E4: livestock-aid petition, end to end

This petition is in `main`, separately from the three functions above.
Private receipts: `petition-select.asm`, `petition-dispatch.asm`,
`petition-jumptable.asm`, `petition-1401cb617-annotated.txt`,
`throne-end.asm`, `_Z8Reactionv-annotated.txt` and `notes/petition-slot.json`.

| Stage | SHOWN behavior / locator |
|---|---|
| Visitor loop | `0x14018b1b9`: requires positive ThroneVisitors, initializes handled flag and ordinary pool size 185 |
| Candidate selection | `0x14018b3a8`: ordinary `rand()%185`; celebration and explicit-choice routes can replace it |
| Dispatch | Table `0x140ea007c` maps slot 44 to `0x1401cb49c`; table admits debug/forced indices up to 999 |
| Eligibility | `0x1401cb49c`: draw `rand()%15`, require residue 0, NoBegging=0, NoRabble=0, SlaveKingdom=0 |
| Presentation | `rand()%3` selects farmer, guard or peasant account; farmer is residue zero; a human face is generated, shared request is 100 gold |
| Pay | Choice 1 requires YourGold above 99, subtracts exactly 100, sets ReactBonus=40, ReactorType=0, ReactionFrom=5 and calls Reaction at `0x140b1cd5f` |
| Insufficient funds | Choice 1 with less than 100 gold sets ReactionFrom=3; no 100-gold deduction |
| Refuse / imprison / trapdoor | Choices 2 / 3 / 4 call reaction contexts 2 / 1 / 4; trapdoor path requires MoonDoor=1 |
| Reaction | Context 5 ordinary-person branch draws 30 wording variants, uses bonus 40 for payment acknowledgment and receipt; the inspected opinion-award clauses test other bonus IDs, so payment does not automatically earn +1 opinion |
| Completion | Petition sets handled=1 at `0x1401cb953`; shared cleanup at `0x14024fbd3` redraws on an unhandled attempt, otherwise decrements ThroneVisitors once at `0x14024fc18` |

Nominal farmer candidate weight is `1/(185*15*3)=1/8325` for an ordinary
attempt with the three policies allowing it. That is not its share of accepted
visitors: rejected attempts redraw, celebration overrides and explicit choice
alter the route. No distinct cooldown flag is written by this petition. It
is repeatable through the visitor loop, subject to state and selection.

The code proves a request, treasury cost, reaction and visitor consumption.
It does not prove a modeled herd, rebuilt watchtower or saved children as a
subsequent world-state change. Acknowledgment text alone should not be ported
as a causal consequence.

## Proposed adaptation

Use the existing generation/simulation owners to declare candidate weight,
eligibility, quiet outcome, repeat state and caller cadence separately.
For YAIRPG, validate eligible pools rather than depending on unbounded redraws;
keep every reasonable repeat route reachable. A petition needs an actual
recipient, transfer and downstream changed fact, with the event feed reading
only discovered receipts. These remain proposals, not new standing gates.

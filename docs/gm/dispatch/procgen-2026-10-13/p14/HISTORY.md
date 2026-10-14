# P14: generating the past

2026-10-14. **PROPOSAL ONLY.** Nothing here is implemented or accepted. Evidence status and delivery scope are in [REPORT](REPORT.md); typed records and retention are in [CONTRACT](CONTRACT.md).

## H1: extend the existing history owner

[P5 D8](../p5/D8_LORE_GRAMMAR.md) already proposes the fact/account split, saved grammar, one remembered deed and a later callback. [E6 sections 7–9](../../../../emergent/E6_LORE_LAYER.md#7-facts-shape-naming-and-compaction) cover fact queries, annual highlights and callback chains. P14 adds **how a coherent past is created, what its survivors are, and how that past remains readable**. It does not create another name generator, fact registry, quest scheduler or calendar.

The Dwarf Fortress legends-style inspiration requested by Weibao is a design reference: let someone browse an era, follow a person to a battle, then follow an heirloom into a later life. No claim about that game's internal algorithm is made here. A smaller implementation can deliver that experience with a causal graph and a few meaningful eras. Years of synthetic activity are not a prerequisite for a good start.

| Historical category | Proposed writer and constraint | What a reader may see |
|---|---|---|
| Authored past | Selected source/anchor owner and declared AU overlay | Source-qualified account if known, never automatic character foreknowledge |
| Generated background | World creation or reserved lazy expansion under H3 | Clearly distinguished from player-earned deeds |
| Lived past | Actual committed domain outcomes, including independent NPC actions | Witnessed events, received reports and later established evidence |
| Told past | Claim/account editions and transmission receipts | Attributed interpretations, errors, omissions and corrections |
| Counterfactual | Simulator or branch owner, isolated from actual history | Labelled imagined/forecast/other-branch story, with its own knowledge route |

An era name is a label, not an event. An event is not necessarily famous. A surviving inscription is not necessarily true. A blank source interval is **unknown**, not proof it contained no consequential activity.

## H2: original-world era generation

Use [P10 original-world factory](../p10/ORIGINAL_WORLD_FACTORY.md) for world-family selection and laws; use [P7](../p7/GUIDELINES.md) for identities. Proposed pipeline:

1. **Bind the starting conditions.** Freeze world/instance/continuity, calendar, grammar and law revisions, authored geography, institutions, ordinary productive means, unique-role reservations and source horizon. Existing Frontier campaign facts remain authored. New-original world creation may supply its own anchors through the factory's selected scope.
2. **Generate a causal skeleton.** Draw era spans and eligible actor projects, succession, trade, construction, disputes, migration or disturbances. Each transition needs prior conditions and actual means or a declared original background abstraction. Track who holds land, objects, offices and debts after each event. A chronicle cannot merely roll “a kingdom fell” with no predecessor or successor state.
3. **Derive the present.** Resolve surviving actors, ages/kinship, custodians, abandoned works, contested rights, local grievances and public institutions. Validate dates, lifespans, custody, role occupancy, event dependencies and allowed world laws together before publishing the start.
4. **Produce historical evidence.** Create only plausible surviving witnesses, records, material traces and attributed accounts. Different survival and access policies create different historical knowledge. Generate texts from those accounts via [RETELLING](RETELLING.md), not from unrestricted truth.
5. **Commit and expose.** Save the skeleton, materialized details and draw state atomically with the admitted start. The initial view shows known surroundings and useful actions. Further research can uncover more without rewriting the existing past.

These are dependency stages, not a requirement to simulate every resident each year. An original background abstraction can record a town's pooled construction budget without claiming that a runtime economy actually operated before enrollment. Its resulting assets and ownership must still reconcile. Births and deaths can be background facts under a selected original-world rule; this does not enable unsolicited runtime aging or offscreen deaths.

Era descriptors might be prosperous, itinerant, fractured, stable, forgotten, heavily recorded or deliberately censored. They influence eligible projects and evidence survival. They do not force every era into a rise/war/collapse cycle, impose a scarcity penalty on every gift, or require a catastrophe before history becomes interesting. A long peaceful era can leave schools, tools, roads and enduring friendships.

**Original example, not canon:** an admitted settlement ledger funds a shared storehouse; a later flood damages that exact storehouse; two households contribute differently to repairs; the current custodian holds a repaired tool and an unsettled contribution claim. One account praises cooperation, another disputes credit. The present has a usable storehouse, a provenance-bearing tool and a negotiable obligation. It does not need a generated map or an invented royal dynasty.

## H3: lazy detail without retroactive invention

[E7](../../../../emergent/E7_OBSERVATION_AND_MYSTERY.md#lore-behind-objects-depth-on-demand) proposes depth on demand. For ordinary fixed history, reserve the event's time, participants/identity slots, outcome constraints and object custody at creation. Lazy expansion uses that **frozen** dependency snapshot and pinned generator revision, with a world/entity/domain key. It never uses the player's current inventory, level or suspicions to choose a convenient culprit or ancestor.

A reserved gap may have several consistent refinements. At its declared commitment point, save the selected refinement and all newly consequential bindings. Later writers must honor it. If current source data leaves no legal refinement, return “record incomplete,” retain a contradiction record and leave the unsatisfied optional lead unresolved. Do not retry until a favorable past appears. A source-supported observation-created or rewritten past is a separate E7 K3 or temporal-law operation with explicit scope and receipts, not this default.

Prehistory is allowed to include unnamed groups and coarse date intervals. Generating an exact personal biography later must remain within those intervals and reservations. Newly naming an old owner does not mint a living actor, an heir, current funds or a genealogical relationship. Each needs its own admitted identity and surviving-state check.

## H4: canon gaps and authored facts

[P13 checkpoint](../p13/CHECKPOINT.md), [P9 profile rules](../p9/PROFILE_RULES.md) and [timeline T1–T5](../../../../TIMELINES_AND_DIVERGENCE.md#implementation-planning-starts-histories-and-parallel-worlds-2026-10-11) retain canon/divergence authority. P14 consumes their selected event graph and gap permissions.

Proposed gap permission: `sourceSnapshotRef, continuity, era/window, authoredPlaceRefs, reservedPeople/roles/events, allowedKinds, allowedImpact, disclosurePolicy, conflictRefs`. Generate mundane custody, local livelihoods, ordinary institutional records and canon-unnamed people only inside that permission. Unknown author intent is not permission to invent a famous person's parent, secret motive, death, lost technique, foundational war or unique relic.

Three useful depths coexist: incidental texture with no state claim; background history whose survivors enter actual state; lived branch history caused by play. A fictional play can contradict a historical fact as an in-world fiction or lie. That does not contradict the **authoritative event**. Conversely, a verified intervention can change future canon dependencies. The later event is re-evaluated; the narrator cannot force the source ending through missing causes. “Canon reserved” protects source identity from random replacement, not every future outcome from agency.

Unknown chronology remains an interval or unresolved ordering. Keep SHOWN scenes, STATED narrator/actor claims and INFERRED synthesis separately sourced. Where editions disagree, select a continuity or record an unresolved conflict. No blended timeline silently treats every version as true. [WORLD_FIT](WORLD_FIT.md) routes world-specific cases.

## H5: history that opens play

| Surviving consequence | Concrete generated opportunity | Actual acceptance condition |
|---|---|---|
| Ruin or abandoned work | Investigate an existing authored site's former function; repair or arrange access | Historical cause names that site/object; real access/repair changes its supported function. No procedural geometry implied |
| Heirloom | Compare a maker mark, recover a loan, trace an actual object through holders | Exact object/custody remains coherent; known provenance can change a willing collector's offer |
| Grudge | Meet an informed survivor or successor and negotiate, contest, compensate or cooperate | Directed belief and grievance have a cause and knowledge route; no compulsory inherited hatred |
| Inherited debt/right | Audit who owes whom, what survives succession and who recognizes the claim | Actual issuer/jurisdiction, eligible recipient and backed liability; a story alone imposes no charge |
| Lost instruction/infrastructure | Find a surviving edition, recruit an expert, reconstruct with current tools or invent another method | P6/P11 learning and work owners resolve real capability, material and permissions |
| Commemoration | Attend, prepare, study, perform or ignore a local anniversary | P11 occasion owner funds/hosts the occurrence; repeat years remain possible under local rules |

[P11 N1](../p11/REQUESTS_AND_MARKETS.md#n1-generated-requests-and-quests-from-actual-needs) owns needs, terms and funded work; [P12 checkpoint](../p12/CHECKPOINT.md) owns arcs and plotting. P14 supplies the retained historical cause and evidence. It never creates a second objective/reward resolver. Texture may have no reward; opportunities must state their actual consumer.

## H6: later lives and branches

Reuse [intro rounds 9–12](../../../../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md#round-10-story-world-timelines-and-branches-2026-10-14): BW fresh canon/continued branch, TB7 local versus player records, BR10 branch chronicle, DV7 evidence and OT5 return summary. These are linked proposal surfaces; they do not establish implemented branch/offline behavior.

A continued branch can contain the previous life's tool, taught pupil, grave, promise, book or ordinary gossip. Retain the former person's ID, life ID and branch; recognition requires evidence. A new protagonist does not own that person's assets or inherit their friends' memories automatically. A fresh canon instance shares immutable source definitions, not those mutable traces. Player-layer comparisons can show known life records without sending that knowledge into a new character.

Rewind, regression, memory erasure, resurrection and historical forgery each need an explicit carrier/retention table from the timeline/identity owner. A fictional archive burning can destroy a **world copy** while the private player-layer receipt remains, unless a selected mechanic deliberately scopes character memory too. No effect deletes the real save. [P16 in PLAN](../PLAN.md#slices) owns loop/crossover/meta execution; P14 supplies traceable past and retellings.

Future proof: two coherent original histories yield different surviving evidence and one different useful action; canon gap generation preserves every authored constraint; a continued-life trace and a fresh-canon negative control remain isolated through Save/reload/Export/literal-file Import. All NOT RUN.

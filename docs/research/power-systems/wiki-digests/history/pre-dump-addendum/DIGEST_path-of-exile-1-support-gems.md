# Path of Exile 1 support gems wiki digest

State: revision_digest_available. Checked 2026-10-10 UTC.

This is a mechanics research record, not an accepted design or gameplay change. Wiki statements are secondary evidence. All E8 mappings are analyst inference; all takeaways are proposals.

## Revision-reviewed mechanics

**P01 Support gem / Mechanics.** Tags alone do not establish support compatibility. One support can modify several compatible linked skills; several supports can modify one skill. [Support gem r1680417](https://www.poewiki.net/index.php?title=Support+gem&oldid=1680417).

Mapping: E8B composition: reinforces existing typed-contract proposal. Proposal: Validate an effect contract and its socket group before composition.

**P02 Support gem / Mechanics and Greater supports.** Duplicate supports do not simply stack. Stronger versions can replace ordinary versions on the same skill. [Support gem r1680417](https://www.poewiki.net/index.php?title=Support+gem&oldid=1680417).

Mapping: E8B composition: precedence and exclusion families. Proposal: Resolve a replacement family before applying modifiers.

**P03 Support gem / Mechanics.** Two copies of the same skill in different support groups can provide distinct usable versions. [Support gem r1680417](https://www.poewiki.net/index.php?title=Support+gem&oldid=1680417).

Mapping: E8 object: configuration instance. Proposal: Give each configured skill instance its own identity.

**P04 Skill gem / Overview.** Leveling a gem strengthens it but can also raise its character-level and attribute requirements. [Skill gem r1492929](https://www.poewiki.net/index.php?title=Skill+gem&oldid=1492929).

Mapping: E8C gate: moving host requirement. Proposal: Growth can improve an item while making its current host unable to use it.

**P05 Gem tag / Mechanics.** Gem tags belong to the item. A single gem can grant two skills with different behavior and support eligibility. [Gem tag r1595540](https://www.poewiki.net/index.php?title=Gem+tag&oldid=1595540).

Mapping: E8 object: carrier labels versus payload behavior. Proposal: Separate labels on the carrier from capabilities of each granted effect.

**P06 Trigger / Mechanics.** Adding two trigger conditions to the same skill disables it. Different skills can still form a chain with one trigger each. [Trigger r1702121](https://www.poewiki.net/index.php?title=Trigger&oldid=1702121).

Mapping: E8 trigger: arity constraint. Proposal: Validate each trigger node instead of rejecting or allowing the whole chain by one broad tag.

**P07 Trigger / Interactions.** A triggered effect is not counted as a manual use or cast for effects that listen for those events. [Trigger r1702121](https://www.poewiki.net/index.php?title=Trigger&oldid=1702121).

Mapping: E8D breach watchers: semantic event kinds. Proposal: Retain event kind and origin when a reaction creates another event.

**P08 Trigger / Mechanics and Multiple triggered skills.** Triggered effects still pay costs. Their cooldowns belong to skills; some systems fire independently while others select one eligible skill at a time. [Trigger r1702121](https://www.poewiki.net/index.php?title=Trigger&oldid=1702121).

Mapping: E8B reactive: arbitration policy. Proposal: Describe automatic delivery, scheduling, cost and cooldown separately.

**P09 Reservation / Overview.** Reservation locks part of a resource while an effect stays active without reducing the resource maximum. [Reservation r1697378](https://www.poewiki.net/index.php?title=Reservation&oldid=1697378).

Mapping: E8 price: reservation versus expenditure. Proposal: Track capacity, locked budget and spendable balance separately.

**P10 Reservation / Reservation Efficiency.** A modifier to ordinary spending cost does not necessarily reduce reservation; their calculations differ. [Reservation r1697378](https://www.poewiki.net/index.php?title=Reservation&oldid=1697378).

Mapping: E8 price: operation-specific modifiers. Proposal: Bind discounts to a named cost operation.

## Source attempts

| Host or route | Outcome |
|---|---|
| www.poewiki.net | API revisions acquired; see sources below |

[Support gem r1680417](https://www.poewiki.net/index.php?title=Support+gem&oldid=1680417). Response SHA-256: `58fcd6b679abfaa6a56c5d89cf4fc0736fca27bf934ee8804b7f281b9e737277`.

[Skill gem r1492929](https://www.poewiki.net/index.php?title=Skill+gem&oldid=1492929). Response SHA-256: `e60322dc95140149a60aef972808ed1a0caca07694cbd1b9d3e9c76ea6e12900`.

[Gem tag r1595540](https://www.poewiki.net/index.php?title=Gem+tag&oldid=1595540). Response SHA-256: `50d21a14752c8212f55e8f0e32e9d0e077d44b60d10d0e38c824948e5c42fa3f`.

[Trigger r1702121](https://www.poewiki.net/index.php?title=Trigger&oldid=1702121). Response SHA-256: `366514111203d98c6cfd84c50d8c386e62748a1978d9db2085d189514ea79509`.

[Reservation r1697378](https://www.poewiki.net/index.php?title=Reservation&oldid=1697378). Response SHA-256: `1fc2d94019b45aa0b761358933dac3c0108e147399d11c5b64f93e39e9ce002a`.

[Item socket r1702220](https://www.poewiki.net/index.php?title=Item+socket&oldid=1702220). Response SHA-256: `f3eddcfd7410261778e17e35492cccd79c5548a950c3d069c73e45e0f119ca32`.

[Item socket r1702220](https://www.poewiki.net/index.php?title=Item+socket&oldid=1702220). Response SHA-256: `921d4136e4738402d412e954cb3c3ba76d07bcae7e274b788e2c93148291a87a`.

[Ascendancy class r1697030](https://www.poewiki.net/index.php?title=Ascendancy+class&oldid=1697030). Response SHA-256: `433ed91b57a970379457289d732adc40b75b6a080aa168fb8cecad5081a1ae00`.

[Unique item r1699287](https://www.poewiki.net/index.php?title=Unique+item&oldid=1699287). Response SHA-256: `54f882b093092d38189fde2673a271ee2f54b42c913afb4fe3cc5583b36be79d`.

[Currency r1697406](https://www.poewiki.net/index.php?title=Currency&oldid=1697406). Response SHA-256: `e2349140adb9a7d568be804848327b1a2971c758dbe944c93b7f937dca1e0bbd`.

Scope: page introduction and named mechanics sections only. Templates and linked chapters were not expanded or fetched. The long catalogs are not claimed complete.

## Earlier lane mappings, not verified by lane W

Input: [western poe](../western/SERIES.json). Existing evidence labels stay with that row.

| E8C part | Prior mapping, unverified here |
|---|---|
| currency | Mana, gems and linked equipment |
| steps | Gem growth and build assembly |
| gate | Compatible support and linked slots |
| risk | Unaffordable skill or invalid link |
| shape | Composed technique web |
| branching | Swap supports within means |
| grader | Actual support restrictions |
| ceiling | Equipment/skill bounds, not shared world rank |

E8B families: Conditions, Marks and stacks, Element control, Delay. Sources: Item-bound, Trained.

| E8 axis | Prior mapping, unverified here |
|---|---|
| object | Linked skill, not whole character |
| mechanism | Behavior modifier |
| trigger | Supported use |
| certainty | Compatibility must be resolved |
| scope | Socket group |
| price | Changed cost |
| limit | Explicit support restrictions |
| visibility | Link can be inspected |
| persistence | Equipment-bound |
| growth | Parts and mastery |

| E8D slot | Prior mapping, unverified here |
|---|---|
| swearer | unknown |
| restriction | Meet support restrictions |
| object | Skill operation |
| scope | unknown |
| duration | unknown |
| benefit | Modified behavior |
| consequence | Invalid support gives no effect |
| witness | unknown |
| condition | unknown |
| ramp | unknown |
| stake | unknown |
| counterparty | unknown |
| release | unknown |
| visibility | unknown |
| inheritance | unknown |
| interpretation | unknown |
| coercion_clause | unknown |

No absent slot implies that this source forbids it. Source penalties and loopholes require a checked scene or revision.

## Fresh mapping amendments

E8C: gems grow through use while host gates can rise; a build is a socket graph and passive/ascendancy branch, not one universal level. Costs include per-use spending and reserved capacity.

E8B: item-bound, trained and composed effects have separate carrier, payload and link-group states. A trigger does not turn these into a vow.

E8 axes: object separates gem and skill instance; mechanism checks effect capabilities; trigger has a local one-source constraint; certainty comes from compatibility; scope follows the link group; price distinguishes spend and reserve; limit includes host requirements; visibility is a tooltip with limited semantics; persistence follows item and build custody; growth follows gem level and configuration.

E8D: no promise, witness or breach sanction is established by these pages. Costs and trigger constraints do not by themselves make a contract. Proposal: breach watchers should distinguish a manual cast from a triggered effect (P07).

Rule abuse: several skills can share supports, while duplicate supports replace rather than multiply; multi-step triggers can be valid even though two triggers on one node fail. No comedic scene checked.


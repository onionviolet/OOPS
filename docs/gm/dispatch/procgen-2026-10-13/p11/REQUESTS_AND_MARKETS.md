# Need-based requests and local markets

Status: PROPOSALS, 2026-10-14, expanded 2026-10-16. Original examples. Use [CONTEXT](CONTEXT.md) and [shared future gates](REPORT.md#future-gates). Proposed extensions are not implemented or accepted; existing source foundations are distinguished below.

**Current disposition, 2026-10-16:** Weibao subsequently deprioritized NPC-heavy
work in favor of ruins/world consideration. This analysis is retained for later;
its first-slice and ranked recommendations are not the current procedural priority.
[Accepted direction](../../../../USER_VISION.md#procedural-focus-ruins-and-world-first-2026-10-16),
[current ruin/world consideration](DUNGEON_CONTENT.md#ruins-and-world-first-consideration-2026-10-16).
No implementation is authorized.

## N1: generated requests and quests from actual needs

**Value:** turn actual shortages, damaged property, missing expertise and obligations into work with remembered consequences. A request should have an answer to “why this person, here, now?” It can lead to coin, reciprocity, access, instruction, public reputation or relief without all requests paying every kind of reward.

**Cost:** medium for one request, high for multi-actor chains. Joins need revisions, inventory/fund custody, accessible routes, cancellation and history. Extends [P5 X4](../p5/EXTRA_IDEAS.md) and [P4](../P4.md), rather than creating another generic quest scheduler. Shown/SOURCE: `src/simulation.js:423-438` settles frozen responses; P4 worktree `src/generated_people.js:75` settles an actual saved supply request. Stated: P4 REPORT documents funds moving out of that person's purse. Neither establishes arbitrary generated objectives.

**Dependencies:** integrated P1/P3/P4, exact stock/custody adapter; [P8](../P8.md) for resource requests, [P6](../P6.md) for creation commissions. D8 adds remembered outcomes; it is optional for a first local receipt.

**Contract:** `request = {id, causeRef, requesterRef, needRef, needRevision, requestedOutcome, acceptableMeans[], rewardReservationRef, locationRef, terms, expiryPolicy, status, settlementRef}`. Derive requested quantity from actual deficit and accessible supply, not hero inventory alone. Generate response routes from supported means: provide, make, repair, transport, find qualified help, negotiate, investigate, wait or decline. Avoid text that promises an unavailable route. A need can have several overlapping requests only when outstanding reservations cannot overfill/pay twice for the same deficit. Duplicate settlement guards a receipt; future replenishment/changed circumstances can cause another request under world-local frequency adjectives.

**First slice:** an introduced original traveler lacks one supported repair supply and reserves a modest fee from their purse. Hero can deliver stock, make an accepted substitute where P6 supports it, or recruit a willing qualified helper. First implementation need only deliver and decline, while data retains other valid route hooks. Completion moves the actual item/funds and records the repair; a later job references the same person and repair receipt. This extends P4's request beyond a random item label by reading a concrete cause and accessible means.

**Gates:** mutate the need before admission and reject a stale quote without a draw; change it after admission and follow declared cancellation/reduced-deficit terms without a replacement roll. Prove inventory/fee conservation, helper ownership/consent, repeated new needs, partial work, expiry, travel and durable-write failure. No unfunded reward, impossible destination or unique-item demand without a reachable alternative. Save/reload/import pending reservations and exact completed outcome. Decline preserves future reasonable opportunities.

**More reachable forms:** commissions, missing-person enquiries, translations, escorts, legal testimony, local research, recovery, invitations and mutual aid. Authored important story quests remain authored; generated jobs attach only to permitted roles and actual causes. A report of need can be mistaken or deceitful, with claimant belief kept separate from actual deficit.

## N2: markets, prices and merchant behavior

**Value:** different regions, seasons, events and relationships change useful buying, selling and sourcing decisions. A merchant has an actual business, supplies and recognized customers; rarity labels alone do not create an economy.

**Cost:** medium for one quoted commission market; high for independent trade networks. Shown/SOURCE: `src/components/trader_component.js:69-98,113-125,141-145` has scheduled refresh, random template stock and reputation/haggling margins; `src/market_saturation.js:76-105,159-176` has recovery, region trickling and a downward saturation modifier. P1's branch claims seeded stock, not supply-chain simulation. Preserve these existing consumers.

**Dependencies:** integrated P1 market stream, trader/inventory owner, N1 needs, [P8](../P8.md) supply provenance and context. P4 identity for a persistent generated merchant; authored merchants remain themselves. Do not require D9 or a macroeconomy for local terms.

Final ownership join: [P8 TRADE_SUPPLY](../p8/TRADE_SUPPLY.md) owns supplier lots, physical manifests, shipments and supply-managed refill. N2 owns demand/recognition and the buy-order consumer. Both feed one reconciled quote calculation and existing trader owner; there is no parallel replenishment or price state here.

**Contract:** separate merchandise, personal gear, purse/credit, demand, known quality and valuation. `quote = {id, merchantRef, stockRevision, marketRevision, itemRefs, quantity, currencyRef, buyOrSell, unitTerms, taxesOrFees, validUntil, reservationRef?, causeRef}`. Cost inputs may include actual logistics, local stock/need, documented law, public scarcity and negotiated terms. A seller who cannot appraise latent properties cannot quote a hidden-potency premium, which would leak P2 truth. Do not stack a new scarcity factor on existing saturation/haggling without one reconciled formula. Use safe integer currency units and declared rounding.

**First slice:** one original merchant offers a dated buy order for a supported repair input during a real local shortage. Compare ordinary demand and a resolved shortage receipt. Their finite purse funds the order. Current stock prices remain under their old formula; this new order quotes separately with explicit terms. Known reputation adjusts willingness or deposit where declared, without making every stranger recognize the hero.

**Gates:** total quoted cost equals final charged cost; stock/purse revision invalidates a nonbinding quote with a visible requote; an accepted binding order retains reserved terms. Repeated panel opens/reload draw nothing. Prove real supply effect, depletion/recovery, expiry, concurrent attempts, corruption/write-failure rollback and exact price/stock/RNG import continuation. Buying and selling an unchanged item at unchanged terms must have the intended accounting result. Productive arbitrage and powerful cheats can remain possible where authored, rather than being blocked by a universal anti-profit rule.

**Further options:** bargaining style, credit, consignment, auctions, barter, counterfeit appraisal, insurance, shipping risk, price news and ethical/illegal goods by actual jurisdiction. Merchant moods can affect future quotes but cannot retroactively change a signed order. Qualitative cheap/scarce/volatile/generous profiles stay per world. A festival demand jump must cite a real occasion and end through its saved lifecycle.

## Deeper commissions and bounties consideration, 2026-10-16

**Authority and scope:** Weibao requested deeper consideration of commissions and
bounties, their links to crafting, harvesting, markets and reputation, and which
questions matter most. Explicitly **no implementation yet**. This extends N1/N2,
linked from the [PG1 palette](../../../../PROCEDURAL_AND_GENERAL_OPPORTUNITIES_2026-10-16.md).
All new mechanics, examples and defaults below are proposals. Existing priorities,
canon boundaries, [making rules](../../../../MAKING_RULES.md) and
[current direction](../../../../DIRECTION_SUMMARY.md) retain authority.

### C1–C5: the five most important design questions

1. **C1 Does solving it change someone's life or work?** A need should come from
   a blocked activity, desired improvement, obligation or threat. Completion
   changes stock, capability, safety, access or an actual plan. If delivering
   medicine only erases a quest marker, real need has become decorative text.
   The first design task is choosing one useful downstream consequence.
2. **C2 What is the problem, what is believed, and what was promised?** Keep actual
   circumstances, requester diagnosis and contract terms distinct. Someone can
   sincerely buy the wrong remedy. A notice can be a false accusation. A customer
   can accept a specified product that fails to solve the underlying problem.
   Settlement, actual efficacy and eventual blame can therefore happen separately.
3. **C3 What choices change the solution?** Buying, harvesting, making, repairing,
   negotiating and seeking qualified help should be possible when supported.
   Different means must change cost, time, suitability, risk, relationships or
   learning. Do not require crafting merely because this is a crafting feature.
4. **C4 Why ask this person, and on what terms?** An actual need does not always
   become a public job. The NPC may use their own stock, wait, hire a familiar
   worker, seek help privately or abandon the plan. Funding, trust, privacy,
   urgency, alternative suppliers and willingness to accept uncertainty explain
   the offer and its reward. Full autonomous economic planning is unnecessary.
5. **C5 Can the player decline and still have a good game?** Requests should create
   opportunities and chosen responsibilities. Avoid an endless chore queue,
   compulsory public service or a universal quest ladder. A known accepted duty
   can have consequences; an unopened notice is not a promise by the player.

### N3: one causal chain, with separate owners

Proposed chain: **circumstance → NPC plan/need → perception → asking decision →
terms → chosen work → delivery/proof → settlement → actual use → remembered effect**.
Steps may coincide for a simple request, but they must not imply one another.

| Part | What it owns or reads | Meaningful consequence |
|---|---|---|
| Need | Beneficiary, blocked/desired activity, deficit or threat and cause | A repaired tool restores a supported work action; supplied medicine can be administered |
| Request | Issuer, beneficiary, known diagnosis, acceptable result/means and funding | Public commission, private favor, institutional order or open bounty |
| Harvesting | Accessible site, custody/access, available yield, travel and processing | Gather an input with useful known qualities, or choose a different source |
| Making | Actual inputs, process, maker means, product identity and observed quality | Make to a declared purpose; preserve exact canon identity where required |
| Market | Existing stock, source lots, quote, merchant knowledge and purchasing budget | Buy a finished substitute or input, sell surplus, fulfill an actual buy order |
| Delivery/verification | Exact delivered goods or evidence, receiver knowledge and agreed test | Ownership moves; a claim becomes accepted, rejected, disputed or awaiting a test |
| Use | Real recipient action and product/repair effect | The underlying deficit changes, independently of whether a fee was already paid |
| Reputation | Attributed outcome, witness/report route, audience and judgment | A specific person changes future terms, referrals, willingness or trust |

Needs may concern comfort, taste, research, art, ambition, prestige or preparation,
not only survival shortages. A collector can genuinely want a particular object;
an affluent customer need not be damaged to justify hiring a craftsperson.
Institutions may have inventory targets and actual replenishment budgets. Keep
such demand explicit rather than inventing shortages whenever a board is opened.

**Truth does not certify an issuer's story.** For an ordinary honest shortage, an
actual deficit is the cause. For a deceptive or mistaken job, the real cause may
be a person's belief, agenda or manipulation. The interface must not expose which
class it is before discovery. This qualifies the palette's shorthand “no quest
unless a real need does”; it does not authorize an omniscient truth-checking board.

### N4: making commissions worth crafting for

| Contract type | Suitable acceptance rule | Choice it supports |
|---|---|---|
| Exact procurement | Named identity, quantity, condition and lawful/required provenance | Source an exact ingredient or canon product; a functional imitation may be insufficient |
| Functional commission | Declared use, substrate/recipient compatibility, tolerances and unacceptable side effects | Make a different original product that meets the purpose, if the buyer agrees |
| Repair/service | Restore a named function, with supported method constraints and test | Repair, replace or hire a specialist rather than hand in an unrelated item |
| Research/sample | Record specified observations or deliver a sample with provenance | Explore or experiment; a documented negative result may count if terms allow |
| Bespoke/artistic work | Agreed material, style, audience and revision terms | Craft for preference, meaning or status without reducing art to hidden potency |

Separate **minimum fitness**, optional premium qualities and **buyer taste**.
More potency is not always better: it may be incompatible, wasteful or introduce
side effects. An unknown property does not vanish from the product, but the buyer
cannot appraise it without supported means. Avoid a hidden exact numeric target
that can only be found by repeatedly opening the offer or wasting batches.

A buyer might provide a reference sample, a paid assay or a trial order. State
whether testing consumes a sample, who owns residue, who pays for a failed
prototype, and whether a staged payment covers materials. A deterministic
published test can support acceptance; later wear or efficacy needs its own
consumer. Neither a normal quote nor acceptance preview consumes an RNG draw.

Harvesting gains purpose from requirements the player can reason about: fresh
versus dried material, a tool-compatible fiber, lawful access, a safe route or a
known processing step. Do not demand an obscure regional variant without any
reachable lead or declared alternative. Unknown feasibility can be a labeled
research contract, not an ordinary delivery promise disguised as certainty.

Buying a suitable finished good is legitimate for a procurement job. A personal
craft commission can require the named maker, attribution or supervision when
stated. Learning rewards follow what was actually done; buying and delivering a
salve does not teach its manufacture. Valuable experimentation should produce
usable knowledge even when the commission is declined.

### N5: markets, funding and NPC independence

Commission rewards reflect the buyer's available means, alternatives, expected
benefit, urgency, relationship and risk. They need not be universally fair. An
unaffordable need can lead to barter, sponsorship, pooled funds or a favor if
those means exist; it does not print coins. A promise of future payment differs
from funded escrow and should be visible as credit risk.

Delivery to a private patient does not automatically restock a merchant. Delivery
to a merchant's stock can affect availability and subsequent quotes; a delivery
to a workshop must enter its supplies before supporting production. Generic
consumption/despawn is an explicit abstraction with a named purpose, not proof
of a repaired person or functioning business. Avoid counting the same item as
delivered, retained by the player and available for merchant resale at once.

Use the existing [supply owner](../p8/TRADE_SUPPLY.md). Supplier lots, owned stock
and supported external-source budgets can stay coarse. Every NPC need does not
require a minute-by-minute household simulation. If a rival worker can settle a
need, that must be a modeled permitted action with real resource effects. Do not
announce an imaginary competitor merely to remove a player's accepted order.

A public buy order and ordinary stock prices share real demand but are different
offers. Reserve deficit against accepted orders, including partial fulfillment,
so several contractors cannot all claim the full shortage. Name who carries
surplus or cancellation risk. Large contracts may use milestones; the first
slice needs only one delivery and one funded fee.

Profitable routing, trade and strong cheats can be intended play. Inspect
**where goods, money and recurrent demand come from**, rather than universally
forbidding resale or player-created demand. Damaging an object then offering to
repair it creates real harm and possibly a profitable deception; consequences
depend on evidence and observers. A hidden global morality detector is not a
substitute for those causes. Repeated contracts also need genuine renewed demand
or declared external spending, not a reload-generated reward faucet.

### N6: bounties need more than a kill counter

Distinguish issuer, payer, beneficiary, target, alleged problem and jurisdiction.
A public notice is a claim backed by someone's authority or purse, not automatic
permission from every faction. Wildlife may not be the underlying cause of crop
loss; an accused person need not be guilty. Do not require every notice to be a
mystery, but preserve that possibility without revealing which ones are false.

| Bounty purpose | Possible supported resolutions | What must be established |
|---|---|---|
| Protect crops/stores | Remove pests, seal access, relocate them or change storage | Relevant damage or access problem changes, rather than unrelated kills anywhere |
| Recover property | Retrieve, identify, return or negotiate release | Exact ownership/identity and handover; a matching appearance may be insufficient |
| Locate someone | Report a location, deliver a message, rescue or escort if commissioned | Current useful evidence and the actual requested outcome; locating does not imply killing |
| Capture/stop a threat | Capture, incapacitate, negotiate or kill if terms and means support it | Correct target, permitted outcome, proof and aftermath |
| Learn/verify | Survey, investigate or provide a qualified report | Provenance, freshness and agreed evidence; uncertainty may be an acceptable deliverable |

These are capability options, not promises that all routes already exist.
Objective resolution can earn the agreed fee while leaving someone angry about
the method. Conversely a dangerous target's death can fail a live-capture order.

**Proof and payment differ from truth.** A trophy proves what the receiver can
infer from it, not every hidden fact about a kill. A copied mark, stolen trophy
or false witness can deceive an unqualified evaluator. Magical verification needs
actual world-specific means and may have limits. Settlement can be mistaken;
later evidence can cause a dispute without rewriting the earlier event.

Multiple notices about one target share causal references. If two issuers really
promise separate fees, collecting both can be legitimate; deduplicate accidental
duplicate settlement, not all overlapping rewards. A changed target, prior
death, surrender, another worker's success, withdrawn funds or lost issuer must
follow declared terms. Preserving a target's identity across such changes matters
more than generating twenty bounty adjectives.

### N7: reputation as remembered, interpreted work

Read existing deed/history and information owners, including
[identity and recognition](IDENTITY_AND_CULTURE.md) and
[information transmission](INFORMATION_AND_LIBRARIES.md). A useful first model
need not add universal reputation dimensions. Save the attributed fact, audience
and actual consequence; derive only the judgments a consumer needs.

| What an audience learns | Example future consequence | Important distinction |
|---|---|---|
| You delivered as agreed | A known customer accepts a smaller deposit | Reliability differs from craft expertise |
| You made an effective original repair | A referral for similar work or a better workshop introduction | Actual maker attribution differs from merely delivering |
| You kept a private problem confidential | More willingness to discuss sensitive work | Trust can grow without public fame |
| Your method harmed another party | Restricted access, retaliation or conflicting accounts | One client's approval is not universal approval |
| You honestly reported an unsuccessful experiment | Repeat research work on clearer terms | Failure can demonstrate care or knowledge rather than incompetence |

Information travels through witnesses, reports, institutions and rumors. A stranger
does not instantly know a local repair. Customer satisfaction, factual outcome,
public belief and title authority remain distinct. Credit helpers and makers
according to observed/claimed contribution. A pseudonym can earn local trust
without revealing a hidden identity. Confidential work must not leak through
recognition counts, reward labels, job recommendations or generated news.

Skillful delivery need not automatically award supernatural power. The
[titles owner](../../../../emergent/TITLES_ACHIEVEMENTS_AND_META_RULES_2026-10-15.md)
retains world/cheat-specific progression. Avoid a single rising reputation score
that turns every client into the same source of escalating rewards and damage.

### N8: lifecycle, absence and honest choices

| Transition | Proposed ordinary behavior to design for |
|---|---|
| Discover/read | Show only known cause, issuer, terms and reachable leads; reading is not acceptance |
| Accept | Confirm exact obligation, reserved fee/deficit and disclosed tests or deadlines |
| Prepare/work | Preserve owned materials, maker choices and pending job state; optional updates expose relevant changed circumstances |
| Need changes | Distinguish unaccepted notice from accepted promise; honor binding terms or declared renegotiation/cancellation, including paid preparation |
| Deliver/prove | Recheck exact goods/evidence and authority; support partial fulfillment only if modeled |
| Settle/use | Publish ownership/payment once; then perform supported use and record its independent result |
| Refuse/fail/dispute | Distinguish decline, withdrawal, honest failure, deception and breach; apply actual terms and audience knowledge |

Routine work can be queued under chosen policies: acceptable substitutions,
maximum spend, destination, receiver and stop conditions. Unanticipated terms or
important choices pause according to accepted OD4 direction. Do not silently
accept jobs while the player is away. A job's disclosed world-calendar deadline
differs from a real-time login penalty. Time, ordinary production and deadlines
must follow the accepted current-world pause; inactive worlds do not quietly
advance these obligations by default.

Unaccepted work can change as the world acts. Declining is normally neutral;
breaking a promise or refusing an existing duty is a different situation. Do not
freeze every farmer forever for player convenience, and do not simulate a village
collapse merely because the player ignored an optional board. Use bounded local
consequences, declared persistence and the world's actual clocks.

Save request terms, need and content revisions, reservations, accepted products,
target identity, execution commitments and settlement/history references. Delivery,
payment and completion form one durable transaction; use/follow-up can be a later
saved action. Reload/import must not mint a new need, pay twice, lose a deposit,
reroll a result or forget a disputed claim. No new universal contract framework is
required to discuss or later prove one such transition.

### N9: make the choice readable before adding more generation

Proposed desktop target: **1366×768**, following [UI rules](../../../../UI_RULES.md).
Home: a person or place service for offered work, with accepted commitments in
the existing obligations/notebook surface. A board aggregates local information
through a plausible publisher; it is not an omniscient global quest feed.

The visible decision needs issuer/beneficiary, known purpose, accepted result,
payment/funding status, known costs/risks and any deadline. Expand terms and
evidence progressively. Show a known shortage or reason for rejection rather than
an unexplained disabled button. Record uncertainty, and explain what a test or
appraisal would establish. Do not reveal hidden suitability by sorting offers,
changing a checkmark or showing a price before the observer can know it.

Completion feedback should say what changed and point back to the person or
service: “the repaired tool is back in use” only after that consumer acts.
Keep the log column and explicit Back/Esc routes. This is a proposed flow, not
browser-verified UI. Mobile, a dedicated board dashboard and new panel frameworks
remain outside this consideration.

### N10: a concrete first candidate and useful later depth

**Original proposed repair example:** a known traveler has a supported damaged
carrying fixture that blocks their next supported task. They offer a funded fee
for a specified replacement binding or agreed repair. The player can buy one,
gather and process a suitable material, or make an agreed substitute if the making
law supports it. The inspected purpose and known tolerances make the choice
legible. Delivery moves the actual product and fee. A separate repair/use action
restores the function. The traveler remembers who supplied or made it; a later
supported task can refer to that same repair. No new landmark, full household
simulation or generated combat target is necessary.

This example requires an actual modeled repair/use reader. If only procurement
is supported, describe it as procurement and leave repair proof open rather than
claiming the full chain. Current [story_requests.js](../../../../../src/story_requests.js)
supports one ordinary item from `Stale bread`, `Rat pelt` or `Rat tail`, real NPC
funding, acceptance/decline, exact delivery and a remembered outcome. It does not
already support arbitrary crafted products, functional assays or bounties.
The [crafting owner](../../../../CRAFTING_ENGINE.md) still records live wiring gates.

**ACCOUNT FOR NOW, ranked:**

1. **A1:** choose a real use consequence and distinguish it from payment/completion.
2. **A2:** define acceptable outcome, buyer knowledge, substitutions and one honest
   alternative to making. Check actual available means rather than promise routes.
3. **A3:** preserve funding, stock, custody, need changes and exact settlement.
4. **A4:** make refusal, preparation risk, absence and scope of recognition legible.
5. **A5:** prove the small loop before expanding generated offers or job types.

**LATER, separate feature families:** bespoke orders and milestone funding;
guild brokers, arbitration and escrow; apprentices/helpers and subcontracting;
collaborative jobs, regional shipping and standing orders; investigation bounties,
target jurisdiction and disputed proof. None is a prerequisite for one funded
delivery. Distinct world rulebooks can later change issuing authority, appraisal,
payment, acceptable methods or verification. Specific canon adaptations require
their source qualification; generic genre assumptions are not canon rules.

**Future acceptance proposal:** play the actual supported need → acquisition →
making or purchase → delivery → payment → use → remembered consequence at the
desktop target. Compare two meaningful supported approaches where feasible.
Check stale terms, a changed need, decline, exact settlement once, unknown-property
projection and pending/final save/reload/import. Use SOURCE fixtures for specific
inaccessible negatives and label them. Feel review asks whether the choice was
worth considering, whether costs were readable, and whether the result mattered;
test counts cannot answer those questions.

**This pass:** owner/source inspection and design proposals only. No runtime
edits, implementation, build, test execution, save access, commit or push.

## Selling, merchant sinks and money fun, consideration round 1, 2026-10-18

**Prompt (Weibao, 2026-10-18):** selling may not need a deep economy; a shopkeeper
or any merchant could buy. Does the 40th sale have to pay less than the first?
What about fast-cycling goods in constant demand, shopkeepers with huge budgets,
"anyone can buy anything" to keep things easy, stock markets and other trade, and
how to balance capability against fun? This round is a palette and proposals,
not accepted rules. It builds on N2 and N5 above rather than replacing them.

**Shown in source today:** [market_saturation.js](../../../../../src/market_saturation.js)
applies one downward saturation curve to every good (ordinary items fall to about
a tenth near 1,000 sold, equipment near 200), recovers over time and trickles
between linked regions. [trader_component.js](../../../../../src/components/trader_component.js)
has no merchant purse. So today every merchant already has an unlimited budget
and every good already saturates the same way.

### M1: selling to a merchant is the default sink

The default sale is to a local merchant, so moving goods means the player's own
trip and nothing sits in transit. Transit custody, route risk and cross-market
supply only matter once a world or player chooses to move goods between local
economies (AD27). Then [P8 TRADE_SUPPLY](../p8/TRADE_SUPPLY.md) owns them.

### M2: the price response is a per-good curve, not a rule that sales fall

Saturation comes from the player's volume compared with how fast the market uses
the good up. It is a dial per good and per place, with a reason:

- **Fast-cycling staples:** bread, arrows, healing draughts in a garrison town,
  lamp oil. Consumption refills demand faster than one maker can supply it, so the
  price stays flat in ordinary volumes. The curve only bites at industrial scale,
  and even then it may stay flat if the town really does eat that much.
- **Slow durables:** swords, furniture, rare reagents. Each buyer needs one, so
  the price falls quickly and recovers slowly.
- **Rising curves:** a maker's name becomes known (reputation premium), a trend
  catches on, collectors want a full set, or a good that others now depend on
  (a standard tool, a medicine people trust) commands loyalty. Volume can raise
  the price until a rival, a copycat or a guild reacts (an in-world agent with a
  reason, never an invisible cap).
- **Event shifts:** war, plague, festival or winter move a good's absorption rate
  for a saved, dated reason (N2's festival rule).

One reconciled quote formula carries this, not a new factor stacked on the
existing saturation (N2 contract).

### M3: buyer tiers trade convenience against value

- **Universal buyer:** "anyone buys anything" at a modest fixed fraction. In-world
  forms: a general store, a pawnbroker, a System shop in LitRPG worlds, a temple
  that takes donations for credit, a guild clearing house. It is the easy default
  and is never forbidden.
- **Specialist buyer:** an apothecary for potions, a smith for ore. Pays more,
  wants specific goods and can judge quality.
- **Deep-pocketed buyers:** a royal quartermaster, an army before a campaign, a
  trading company, a sect treasury or an interworld broker. They can absorb huge
  volume at steady prices because they really spend that much. A village trader's
  purse runs dry and a broker's doesn't; both are true per world.

The fun comes from choosing between convenience and value. The universal buyer
needs to stay useful and never strictly better than a specialist.

### M4: other ways to turn work into money

All of these avoid transit logistics unless noted:

- **Consignment:** leave goods with a merchant and get paid as they sell. It fits
  idle play and offline time naturally.
- **Standing orders:** "20 draughts a day to the garrison." This turns making into
  steady idle income, with a renewed need behind it (N5).
- **Own shop or stall:** property (AD31) plus a hired or companion seller. Prices
  are yours and customers come to you.
- **Auctions:** for rare one-offs, so a unique find gets a dramatic price.
- **Barter, favors and patronage:** for worlds or people short on coin (N5).
- **Investment:** stakes in a merchant, a caravan, a ship or a workshop pay
  dividends and can fail. Commodity bets (buy grain before winter) and, in modern
  or urban worlds, an actual stock market. A transmigrator who knows the canon
  holds a real trading edge (AD2): betting on events they foresee pays until
  their own disturbance changes the course. Insider foreknowledge is a feature,
  and divergence is its risk.
- **Currency exchange between worlds:** shared currencies come only through
  means (AD27). A converter, broker or cheat is a trade form of its own.
- **Arbitrage and caravans:** the one form that needs logistics (P8).

### M5: balancing capability and fun

Weibao is essentially the only player (AD22), so balance serves fun rather than
fairness. Proposed defaults:

1. **Grow the sinks, don't throttle income.** Money stops being fun when there is
   nothing worth buying, not when the player has a lot. Each scale of wealth should
   open new purchases: property, staff, funding research or expeditions,
   investments, commissions to great makers, cross-world exchange.
2. **Every sale channel should be a real choice.** A channel that loses in every
   case is dead weight, and one that wins in every case removes the choice.
   Diminishing returns only create a decision when an alternative exists (another
   product, buyer or market).
3. **A broken money engine is a payoff.** Building an engine that floods the market
   is a legitimate idle-game climax. After that, an in-world response follows:
   rivals copy the recipe, guilds want dues, a lord taxes, thieves notice. The
   player gets a new problem instead of a nerf.
4. **Readable cause beats hidden math.** The player can see why a price moved
   ("the garrison left", "your name is known in Riverside"). Unexplained decay
   feels like a penalty, while an explained one gives information.
5. **The pace is a dial per world and setting** (AD19–AD22), not one global curve.

### ACT NOW (done this round)

- Saved M1–M5 here. Linked the economy row in the [rules index](../../../../RULES_INDEX.md)
  to this round.

### ACCOUNT FOR NOW

- **A6:** a finite merchant purse changes save shape. Adding one needs a migration
  that defaults existing traders to their current unlimited behavior (AGENTS safety).
- **A7:** a buyer that appraises perfectly (a System shop) works as an
  identification means. Its quote can reveal hidden potency or sealed truths, so
  treat it deliberately as a means under AD6–AD8 and MEANS_AND_APPRAISAL, never
  as an accidental leak through price.
- **A8:** consignment, standing orders and dividends earn while the player is
  away. They must use the same offline/idle accounting as other progress
  (AD15–AD18), with a recap line showing where the money came from.
- **A9:** replacing the uniform curve with per-good absorption touches the existing
  trader and saturation consumers. Keep one reconciled formula (N2) and a
  regression that buying and reselling an unchanged item still gives the intended
  result.

### LATER / DELEGATE

| Code | Item | Level | Effort | Done check |
|---|---|---|---|---|
| L1 | Per-good absorption rate and direction in the saturation data (staple, durable, rising) | mid coder | S–M | Staple price flat over 100 sales, durable falls, quote shows reason text; existing saturation tests pass |
| L2 | Universal buyer plus one specialist with a better price | mid coder | S | Same potion sells for less at the general store than at the apothecary at 1366×768 and 1920×1080 |
| L3 | Standing order as idle income | mid coder | M | An order pays daily offline, shows in recap, survives save/reload/import |
| L4 | Consignment shelf | mid coder | M | Goods leave inventory, coin arrives as they sell, cancel returns unsold stock |
| L5 | Investment stake with dividends and failure | strong designer + coder | M–L | A stake pays over time, can fail for a stated reason and is saved exactly |
| L6 | Canon foreknowledge trading in one adapted world | designer | M | A foreseen event pays, and a disturbed course shows a visible divergence loss |
| L7 | Finite merchant purses by settlement size | mid coder | S–M | Migration keeps old saves unlimited; a village purse empties and refills over time |

## Selling, merchant sinks and money fun, consideration round 2, 2026-10-18

**Prompt (Weibao, 2026-10-18):** "more to consider, then address things." Round 1
codes (M1–M5, A6–A9, L1–L7) stay; this round adds new angles only.

**Shown in source today:** [native_trade_transaction.js:12](../../../../../src/native_trade_transaction.js)
rejects any price, money total or debit above `Number.MAX_SAFE_INTEGER` (about
9×10^15) with "Invalid trade price." The sold goods move into the vendor's owned
stock (`ownership.vendor`), so a sold item stays buyable from that merchant until
its stock changes. [trade.js](../../../../../src/trade.js) builds sell lists item
by item, and no batch or rule-based sell exists.

### M6: selling must stay easier than buying everything

"Anyone buys anything" (M3) is safe. "Anyone sells anything" at fair prices is
the one that would empty gathering and making of meaning, because a full purse
would replace every recipe. Default: buying and selling stay asymmetric. Merchants
mark up, specialists stock limited quantities, and rare inputs and made-to-order
quality come through making, commission or finding. A world can loosen this with
a reason, such as a System shop that sells everything (common in LitRPG). In that
case making earns its place through quality, custom traits or price, and the shop
stays a convenience.

### M7: money is local, so each world's engine is its own

**Correction, 2026-10-18 (Weibao):** M7 overstated the limit. Universal currencies
exist wherever an issuer or network spans worlds, and carrying gold or other
valuables works wherever the destination values them. Cheats bridge the rest.
Locality is the default, not a wall; round 3's M13–M16 replace the framing
below, which is kept as history.


Under AD27, coin from one world doesn't spend in another without a means. This is
the strongest built-in balance tool: a fortune in one world is a fresh start in the
next. Exchangers, portable valuables (gems, gold by weight, rare reagents) and
cheats become the cross-world bridges, each with a rate and a cost. Treat this as
a feature to show the player ("this coin is no good here; gold by weight is"),
not a wall.

### M8: selling chores fit an idle game badly

Clicking dozens of sales by hand fights the genre. Proposed default: sell rules
at the same depth as other idle automation, such as "sell everything tagged junk",
"keep 5, sell the rest" and "send surplus potions to the apothecary daily".
In-world forms include a porter or apprentice who hauls for a cut, a guild drop
box, a System auto-sell, or a familiar. A rule that runs while the player is away
follows A8 (offline accounting and recap).

### M9: undo through the merchant's real stock

Selling the wrong item is the most common shop regret. Because sold goods already
sit in the vendor's stock, the default fix is in-world: the merchant still has it
and sells it back, at their price or at the sale price for a short grace period.
It never disappears into a void. A quest-critical, unique or sealed item gets a
confirmation before sale and lands with the merchant or a collector afterward,
so it can be recovered. A lost story item is a choice the player made knowingly.

### M10: sell services, knowledge and information, not only goods

Healing, teaching, hauling, guarding, appraisal, map copies (a map is an
information artifact, SR), recipe licenses (a buyer learns a formula under MR's
knowledge rules) and translations all turn capability into money with no stock or
saturation of goods. Their limits are time, reputation and how many people need
the service.

### M11: market knowledge is a skill

What sells where, each good's absorption rate and buyer purses can start hidden
(AD3, AD6–AD8) and be learned through trading experience, a merchant friend,
gossip, a ledger or a System panel. Mastery shows more of the market and improves
haggling, which already exists in the trader code. It never changes the market
itself, matching MR's rule that mastery improves control, not truth.

### M12: money across lives and rebirth

Investments, shops, consignments and standing orders persist after the character
does unless a world's continuation rules say otherwise (AD10–AD14). An heir, a
bank, a guild account or a buried cache are carryover means with their own costs.
Each needs a stated carryover outcome per continuation type, or a prestige reset
could silently delete a whole economy.

### ACT NOW (done this round)

- Saved M6–M12 and the source facts above.

### ACCOUNT FOR NOW

- **A10:** the safe-integer ceiling is real for long idle growth. Any income
  that compounds (L3–L5, M8) needs either an in-world denomination step (bank
  notes, gold bars, a higher-tier currency) or a later BigInt/decimal migration.
  It must not overflow into "Invalid trade price" errors. Display large numbers
  in compact form.
- **A11:** sell rules (M8) act on the player's inventory while unattended, so they
  must skip equipped, locked, quest, unique and sealed items by default. Their
  runs need to be logged like other idle actions (clean log rules, UR41–UR48).
- **A12:** buyback (M9) depends on vendor stock surviving the refresh. Today a
  scheduled refresh can replace it. Any grace-period promise must define what the
  refresh keeps.
- **A13:** maker reputation (M2 rising curves) needs saved state per good and per
  place. Reuse N7's reputation record rather than adding a parallel one.
- **A14:** carryover of shops and investments (M12) is a save-shape decision.
  Decide per continuation type before L5 ships.

### LATER / DELEGATE

| Code | Item | Level | Effort | Done check |
|---|---|---|---|---|
| L8 | Sell rules: junk tag, keep-N, daily surplus to a named buyer | mid coder | M | Rule sells only eligible items, skips locked/quest/equipped, logs once per run, survives save/reload/import |
| L9 | Buyback from vendor stock with a sale-price grace window | mid coder | S | Sell then buy back at sale price within the window; after refresh the defined outcome holds |
| L10 | Confirm and recover path for unique or quest items | mid coder | S | Selling a quest item asks first; the item is later findable at the merchant or a collector |
| L11 | Large-number money plan (denomination step or BigInt) | strong coder | M–L | A save with money near 9×10^15 trades without errors; display stays readable at 1366×768 |
| L12 | Market inspector debug view (absorption, purse, curve per good) | mid coder | S | Inspector shows live values and changes nothing; matches quoted prices |
| L13 | One service sale (appraisal or healing) as income | designer + coder | M | Service pays from a funded NPC purse with no item moved |

## Currencies and value per world, consideration round 3, 2026-10-18

**Prompt (Weibao, 2026-10-18):** universal currencies exist, and cheats or carrying
gold help accordingly. Currencies have to fit the world: mortal currencies,
world-specific ones and more. A mana crystal may be worth little in a tech world
unless adequate analysis shows it is useful. Consider the little details for
each world. This extends the cross-world owner
[MULTIVERSE_STRUCTURES OD11, EC1–EC5](../../../../worlds/MULTIVERSE_STRUCTURES.md#od11-local-economies-and-cross-world-value-2026-10-15)
without repeating it. Proposals only.

**Shown in source today:** the runtime has one `character.money` number
(`add_money_to_character` in `src/main.js`). Newer content writes "native coins"
into named purses. N2's quote contract already reserves a `currencyRef`.

### M13: kinds of money, a palette

Each kind gets its value from a different source, and that source decides
whether the money travels:

| Kind | Examples | Value comes from | Travels? |
|---|---|---|---|
| Mortal coin | copper, silver, gold coins, taels | the issuer's reach and trust, plus metal | Outside its realm, only as metal by weight or as a curio |
| Paper and accounts | banknotes, bank balances, letters of credit | the issuer still existing and recognizing you | Poorly. A dead kingdom's notes are curios, and accounts need identity |
| Commodity money | gold, salt, grain, furs, ammunition, bottle caps, cigarettes | use and ubiquity | Best of all, wherever the commodity is useful |
| Power-bearing money | spirit stones, mana crystals, monster cores, essence | use as fuel or material under that world's laws | Only where the mechanism to use it exists or can be built |
| Institutional credit | sect contribution points, guild merit, adventurer rank points | one institution's ledger | No. Spent only with that issuer or its branches |
| System currency | System points, shop credits, XP as currency | the System as issuer | Wherever that System reaches, which can be many worlds (a real universal currency) |
| Social money | favors, debts, reputation, secrets | relationships and memory | With the people who hold them |
| Metaphysical money | lifespan, memories, years, names, merit, faith, incense | that cosmology's rules | Inside cosmologies that honor it |

Power-bearing money is also fuel. Spirit stones that cultivators burn leave
circulation, so a sect war or breakthrough season can drive their price up.
Mortals who cannot use them see only pretty stones.

### M14: value is recognition times usability times access

An item's local price follows three separate things: whether anyone there
recognizes what it is, whether its use works under that world's mechanisms
(AD38, world laws per WA), and whether a buyer can reach and afford it.

A mana crystal in a tech world shows the stages:

1. **Curio:** sold to a jeweler or collector on looks alone. The price is that of
   an odd gemstone.
2. **Anomaly:** someone measures something strange about it. Labs and collectors
   pay for a sample, and attention starts.
3. **Identified use:** analysis shows what it does in that world. If the world's
   laws let it release energy without a mage, it's worth a fortune and draws
   governments, companies and thieves. If no local mechanism can draw on it, it
   stays a curio however rich it is in its home world.

The analysis can be the player's appraisal shared or sold, the local world's own
science, or a cheat. Proving a use is its own step (EC2: remembering, proving and
operating at scale are different). The reverse works too: penicillin, a lighter
or a steel saw in a low-tech world is recognized by use quickly. Medicine needs
proof before people trust it.

### M15: little details per world, a palette

Pick what fits each world. None of these is a rule for every world.

- **Cultivation (xianxia):** spirit stones graded low, mid, high and supreme, burned
  for cultivation and formations. Sect contribution points buy techniques and
  cave time. Pills circulate as currency among cultivators. Silver taels serve
  mortals, and cultivators sneer at them but still pay innkeepers with them.
- **System and LitRPG:** System credits, a shop that may buy anything at its own
  valuation (EC4), automatic loot conversion, a System fee, and local coin that
  still matters to NPCs who can't see the System.
- **Western fantasy:** copper, silver and gold with fixed ratios, guild letters of
  credit, gems as portable wealth, monster cores, clipped and debased coins,
  money changers at borders and temples.
- **Modern and urban:** bank accounts need ID, which an isekai'd or reincarnated
  character may lack. Selling gold asks for receipts, and money-laundering rules
  act as an in-world agent. Pawnshops, cash and crypto fill the gaps.
- **Sci-fi:** account credits, energy units, licensed identity. Physical gold is a
  collector's item or an industrial input.
- **Post-apocalyptic:** clean water, ammunition, medicine, canned food, bottle caps.
- **Gift and tribal:** no coin. Trade is gifts, obligation and prestige, and selling
  in the market sense may itself be rude.
- **Underworld and divine:** merit, incense and faith. Joss paper burned in the
  mortal world arrives as real money below. That is a natural cross-world bridge,
  with an exchange rate set by the burner's sincerity or the paper's grade.
- **Fae:** names, memories, years and promises. Fae gold turns to leaves by
  morning, which makes it counterfeit by nature unless bound.

### M15b: everyday frictions that make money feel real

- **Change:** a gold bar can't buy bread when the baker can't make change.
  Village traders refuse large notes. Small denominations are worth carrying.
- **Weight:** a thousand gold coins weigh about 10 kg, which is why banks, letters
  of credit, gems and storage cheats exist.
- **Authenticity:** an unknown mint looks counterfeit. Foreign coin sells at melt
  value minus suspicion until a changer vouches for it.
- **Dumping:** selling a mountain of gold lowers the local gold price. M2's curves
  apply to money-goods too.
- **Inflation and debasement:** a crown that debases its coin, or a System patch
  that changes credit rates, moves prices for a dated, saved reason.

### M16: bridges between currencies

Each bridge has a spread, a cost or a risk:

- **Carrying valuables** whose value survives the trip (gold, gems, useful goods),
  subject to carryover and inventory rules for that crossing.
- **Exchangers:** money changers at gates or ports, multiversal guilds or brokers,
  each taking a spread.
- **Universal issuers:** a System, a god, or a guild spanning worlds.
- **Cheats:** a currency converter, a wallet that crosses worlds, a System shop.
- **Knowledge and services:** sell what you know or can do where that is rare
  (M10, EC2).
- **Goods arbitrage:** convert through goods that are cheap here and valued there
  (EC1).

### ACT NOW (done this round)

- Corrected M7 with a dated note and saved M13–M16.

### ACCOUNT FOR NOW

- **A15:** one `character.money` number cannot hold several currencies. A purse
  keyed by currency ID needs a save migration that maps existing money to the
  home world's coin. Foreign coin can stay an item until a world needs it as money.
- **A16:** "does this world recognize and use this item" is world knowledge, kept
  separate from item truth (MR truth/knowledge split, MEANS_AND_APPRAISAL). A
  world's hidden use for an item may be a sealed secret: refer to it by ID and route.
- **A17:** show the purse for the current world's currencies, and show foreign
  money as items with a melt or curio value. Don't crowd the money display
  (UI rules, clean hierarchy).
- **A18:** currency scales differ (copper versus supreme spirit stones). Store each
  currency in integer minor units per currency, which also eases A10's ceiling.

### LATER / DELEGATE

| Code | Item | Level | Effort | Done check |
|---|---|---|---|---|
| L14 | Multi-currency purse with migration (home coin keeps old money) | strong coder | M | Old save loads with the same amount in home coin; a second currency adds, saves, reloads and imports |
| L15 | Foreign coin as item with melt and curio value | mid coder | S | Foreign coin sells at melt value to a changer and less to a stranger |
| L16 | Recognition stages for one cross-world item (curio, anomaly, identified use) | designer + coder | M | The same crystal's quote rises only after a recorded analysis; without a usable mechanism it stays a curio |
| L17 | Per-world currency card field (kinds, ratios, frictions) in the world core kit | designer | S | Each pack names its currencies and at least one friction; no blanket rule is stated |
| L18 | Change-making friction and denominations | mid coder | S | Paying with a large coin at a small trader fails or leaves credit, explained in text |

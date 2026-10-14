# Need-based requests and local markets

Status: PROPOSALS, 2026-10-14. Original examples. Use [CONTEXT](CONTEXT.md) and [shared future gates](REPORT.md#future-gates). Nothing here is implemented, tested or accepted.

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

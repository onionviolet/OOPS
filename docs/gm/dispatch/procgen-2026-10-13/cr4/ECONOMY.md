# Crafted goods, demand and competing makers

2026-10-14. **PROPOSAL ONLY.** Extends root EC1-EC5, MK5/MK6 and NP2 in the [crafting palette](../../../../PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md). [P8 supply](../p8/TRADE_SUPPLY.md) owns physical lots/manifests/refill; [P11 N1/N2](../p11/REQUESTS_AND_MARKETS.md) owns actual needs, funded orders and quotes; [P21 economy](../p21/ECONOMY_STORIES.md) and [ventures](../p21/VENTURES.md) own economic episodes and partnership. CR4 adds crafted-product discovery, perceived quality and competitive production. No second bank, price engine or merchant population.

## EC1: a new product finds a use and paying demand

EC1.1: Novelty is audience-relative. A product new to this town may be ordinary elsewhere. Keep physical product reference, functional demand class, brand/edition, local awareness and each buyer's evidence distinct. Tiny ratio changes do not automatically create independent markets. Conversely, two chemically similar products can have different recognized presentation or provenance where a buyer actually values that distinction.

EC1.2: A market opening requires an unmet useful need or taste, feasible delivery, recipient compatibility and actual budget/barter. Demonstrations, gifts, practitioner recommendations, trade fairs and repeat purchases can spread awareness through real contact. A skeptical introduction can be cheap; a trusted specialist may command a premium immediately. Slow adoption is a world adjective, not a universal mandatory penalty for innovation.

EC1.3: Separate awareness, belief in a claim, trial, experienced result and willingness to pay. A buyer may believe exaggerated marketing; that belief changes their quote, not the vial. Actual use can revise future demand. High quality alone supplies neither a customer's money nor unlimited repeat orders. Relief of a need can close that order while another person's new need remains eligible.

First slice: one introduced buyer reserves a fee for a dose within published ranges. Two different supported mixtures qualify. Receiving the actual product closes the deficit and transfers payment. A later new deficit can generate another funded order; completing the same receipt twice cannot pay twice. [MAKERS MK6](MAKERS.md) owns spec matching, not a second quest record.

## EC2: copycats have an information and production path

EC2.1: A rival first learns the product exists through sale/contact, obtains a real sample, pays for scoped assay or practice and builds a hypothesis/method edition. Perfect copying is not guaranteed by knowing the brand name. A public manual can make copying easy; exact-identity ingredients, specialized apparatus or skill may still constrain it. Cheap copying or duplication remains possible if the selected world supports it.

EC2.2: Run the copied method through the same resolver with the rival's actual inputs, station and supported execution terms. A lower-priced version, improved local variant, honest compatible substitute or failed attempt can result. Keep independent discovery distinct from information theft. Copying instructions creates no original maker's mastery or material stock.

EC2.3: Competition changes actual bids, supply and recognized differentiation through P11/P21. It need not always eliminate the player's edge: reputation, reliable delivery, customer-specific fit, cooperation, open licensing or a distinctive local source can matter. Protect a formula, sell it, teach everyone, contract production, partner, innovate or keep ordinary work all remain available. No fixed innovation cooldown or compulsory patent minigame.

## EC3: counterfeits and adulteration separate goods from claims

EC3.1: A lot's contents/provenance remain truth. Its advertised maker, grade, purity or effect are attributed claims. Adulteration is an actual supported dilution/substitution operation with accounted outputs; an ordinary mark copy does not alter chemistry. A genuine marked product can also be stale, poorly stored or unsuitable for the recipient. Authenticity and fitness are different questions.

EC3.2: Buyers assess through available protocols: compare visible seal, trace custody, request maker testimony, test a sample, use appraisal, seek a trusted broker or knowingly buy an uncertain discount. An assay of one fraction is not proof of every hazard or mark. Magical authentication needs CR2's sourced local law; a forged ordinary seal should not be rejected by omniscient UI code.

EC3.3: Detection writes observed evidence and a belief update, then follows supported refund, restitution, mediation, boycott, legal or criminal consequences. A false accusation stays a claim. Offscreen NPC knowledge comes through P19/P11 channels. World-authored fraud can support the player's or NPC's plots; no universal moral penalty or automatic courtroom is added.

## EC4: fads, seasons and urgent needs have causes

EC4.1: A festival can increase demand for appearance, taste, gifts or ceremonial provenance. A cold season can create supported heating/storage needs. An illness creates body-specific treatment demand only when CR1's illness/response consumer exists. The root plague research race remains available; P2 regeneration alone cannot be relabeled a cure for an undefined disease.

EC4.2: Save occasion, affected audience, communication, budget, demand lifecycle and actual end conditions. Fashion can emerge from known influential adoption and copying, with an optional saved taste draw at a real boundary. It is not an independent price roll whenever the shop opens. Some buyers ignore fashion, some favor tradition, some want yesterday's fad at a discount.

EC4.3: A fad can end without deleting goods. Repurpose stock, seek another audience, mature it, donate, export through supported routes or store it. World-adjectival scarcity/volatility can create serious losses, but no mandatory response chore or hunger death. Refusing a trend preserves ordinary useful play.

## EC5: stockpiling, speculation and promises

EC5.1: Actual inventory, in-transit cargo, forecast harvest, reservation, prepaid order and transferable delivery promise are separate. Forecasts cite dated source evidence and may be wrong. Holding herbs gives exposure to their real storage/aging law; owning a contract does not create herbs early.

EC5.2: Offer spot buying, consignment, forward orders, pooled procurement or auctions where their owners and capital exist. A forward order binds supplier, buyer, quantity, quality predicate, applicable currency, delivery clock, collateral/deposit, substitution and breach policy. Speculation profit follows actual price and delivery differences. Futures clearing, short sales or insurance are further institutional consumers, not inferred from a quote table.

EC5.3: Supply control can induce shortages, attract competitors, invite substitutes or provoke institutions only through real causes and local authority. Productive arbitrage, cheap powerful creation and generous repeat profit can be lawful gameplay. Do not invent an anti-profit once limit. Infinite debt is not replaced with a finite-credit assumption; where that requested cheat/law is selected, its explicit issuer/resource behavior must coexist with finite ordinary actors.

## Source seams and accounting gate

| Finding | SHOWN/SOURCE | Proposed consequence |
|---|---|---|
| F1 template stock | Main `src/components/trader_component.js:69-86,113-129` refills authored groups using `Math.random`, while retaining explicitly conserved campaign keys. | One selected supply-managed group must stop template refill and use real manifests; other legacy traders stay unchanged. Root/P1 seeding is a separate integration gate. |
| F2 margin | Main `src/components/trader_component.js:141-145` reads haggling and regional reputation. | Maker-line reputation becomes an admitted known input to future terms, never a hidden global replacement modifier. |
| F3 saturation | Main `src/market_saturation.js:76-89,96-149,159-178` recovers/trickles sold pressure and only lowers price. | No independent scarcity multiplier layered on top until P8/P11/P21 reconcile one calculation. A funded buy order can be a narrower first consumer. |
| F4 identity/value | Main `src/items.js:237-252,255-276` uses ID/components/quality and existing value/saturation. P2 worktree `src/items.js:1220-1225,4533-4534` gives generated vials fixed value 12. | P2 fixed value avoids a hidden-potency oracle. New demand/brand terms need actor evidence and explicit family grouping, not one brand-new saturation pool per renamed or slightly varied vial. |

Original arithmetic witness, specified not run: a buyer reserves 30 coins for three accepted vials at 10 each; maker pays 18 for actually available inputs and 3 for an assisted step. Delivery moves three vials and the reserved 30, leaving net cash change +9 before other declared costs. A second 30-coin payout needs a distinct funded need/order. Rejected unaccepted vials remain with their actual custodian. Counter purchase stock in P2 is an abstract source, so this example cannot claim a conserved NPC supply web until that counter has a selected supply adapter.

OPEN: quantity/currency rounding, budget and stock conservation, no overlapping refill, known-quality appraisal, family-level saturation, exact quote/fund/claim/provenance persistence, real copycat sample/experiment, canceled/partial delivery, stale quotes and failed writes. Price and reputation previews reveal no sealed truths through text, sorting, discounts or candidate counts. All native and director gates remain open in [REPORT](REPORT.md).

# Societies and markets contract

*Version **v0**, 2026-11-12, chat M of the [procedural foundation plan](PROCEDURAL_FOUNDATION_PLAN.md#other-systems-the-foundations-need-2026-11-11) (OS4, MC15). Built on the [kernel working contract](KERNEL_WORKING_CONTRACT.md) v0.1 and the [world substrate contract](WORLD_SUBSTRATE_CONTRACT.md) v0. A proposal under AD56: it widens play, and every number is a default with a dial and an in-world reason. Changes are versioned requests to chat M. Inventory and the reasoning behind each line: [M checkpoint](gm/dispatch/foundation-m-2026-11-12/CHECKPOINT.md).*

Code: [`src/market_substrate.js`](../src/market_substrate.js) (goods, want, supply, price), [`src/market_trade.js`](../src/market_trade.js) (trade on K), [`src/market_word.js`](../src/market_word.js) (word of prices as knowledge). Tests: [`tests/market_foundation.test.js`](../tests/market_foundation.test.js) (M1-M8).

## The rules (SMK)

| Code | Default | Dial and reason | v0 |
| --- | --- | --- | --- |
| SMK1 | **Stock is a quantity on a holder.** A good is the W quantity `stock.<good>` (unit `unit`); coin is `coin`. A shelf, a storehouse, a larder and a person's pack are holders. | Goods are pack-local names (WSC2); a second pack that reads one declares the same unit and bounds. A price must read the same stock a brew or a sheep consumes (PFP10). | Built |
| SMK2 | **Want is a rate a shelf carries.** `wantPerDay` is what the shelf's usual customers use; the usual stock (`par`) is want times `coverDays` (2) unless a row states `par`. | Per world and season. Scarcity is stock against want, not a shelf number alone. | Built (shelf-level; per-actor want waits for A and L) |
| SMK3 | **Supply is a stated delivery from a producer.** At `deliveryMinute` (360) a shelf takes up to `perDay` units, spending `perUnit` of its supplier's input quantity each. No input, no delivery. | A failed harvest written by another domain reaches the shelf with no join code. The baker's making moves to F or B as a working when they own it. | Built |
| SMK4 | **Near is shelves, far is rates.** Deliveries and the day's use cut segments at their minutes, so a far shelf settles three days in seven segments and gives the totals minute steps give. | `deliveryMinute`, `useMinute` per world. | Built (M2, M5) |
| SMK5 | **A price is a projection, never saved.** `worth = base x world factors x scarcityFactor(stock, par)`, margin 1.3 on buy, bid share 0.75 on sell, the rounding of `regional_prices.unitPrice`. | World factors (place, season, a keyed local event) are rows with a reason. One authority per fact; a reload cannot drift a price. | Built (M1 matches the staple stall at every stock) |
| SMK6 | **One curve.** The shelf factor is `regional_prices.scarcityFactor`; saturation folds into want when a world opts in. | `market_saturation` stays for original-game loot until then. Two price factors for one cause is what R4 found. | Built for shelves; saturation fold is the next fold step |
| SMK7 | **Standing is a separate multiplier with its own owner.** `terms` multiply after the market price; the trade reader takes `terms(holder)`. | A friendly keeper and a short shelf are two reasons the player can read. | Port built; standing owners not yet joined |
| SMK8 | **Anyone trades.** Trade is the kernel law `m.trade@0`: roles buyer and seller of kind `trader`, any two holders carrying coin. Settlement returns substrate ops the host applies (KW11). | Hold dial: `agreed` keeps the quoted price through settlement, `current` refuses when the price moved (the native fingerprint rule). | Built (M3, NPC to NPC) |
| SMK9 | **A group is a record with charter, doctrine, ranks, holdings and rivals** on `organizations@1`. | Doctrine as a new charter dial set; ranks read by R; holdings as W stock; rivals with a backlash share. | Proposal |
| SMK10 | **Standing is held by an audience about a subject**, written through one seam with a named cause; R owns rank thresholds over it. | The eight current standing owners become sources or readers. | Proposal (request to R) |
| SMK11 | **Law reads who knew.** Statutes apply where `authorityOver` gives claim and reach; heat is an authority's standing raised through knowledge. | No second enforcement table. | Proposal |
| SMK12 | **A rumour is a knowledge row.** A sighting is the existing `knowledge` effect with basis `observation`; a retelling has basis `reported`, route `told`, `attributedTo` the teller, and keeps the sighting's time. No truth flag beside the claim. | The truth stays with the shelf. `economy_standing.drawRumour` moves onto this when folded. | Shape built; reaches the native writer through `toNativeKnowledge` (M8, MB8) |
| SMK13 | **Spread follows people.** `marketTalk`: people in one place tell each other every price the listener lacks or knows from an older sighting, in fixed order. | Default deterministic; a temperament or density-of-talk dial (as `gossipStep` uses) is the next step. A shortage is known first where it happened. | Built |
| SMK14 | **Choices read beliefs, not truth.** `believedPrice` gives the remembered price, its age, basis and teller; past `memoryDays` (20) it is stale. | A stale or false price sends someone to the wrong market, and the cause line says who told them. | Built (read port for A) |

## The first chain (M4, M5)

A failed harvest sets the village mill's grain low (an outside op standing in for L). The village shelf's dawn delivery falls to zero, its price rises from 5 to 9, and Hessa, who heard from Orr that slums bread is cheaper, walks to the slums and buys there through `m.trade`. Vale, who saw no shelf, hears Hessa's account (reported, attributed to Hessa) and chooses the slums too. Without the failed harvest both buy at home. The world, the beliefs and both choices are identical after one jump, minute steps or a reload. The chooser in the test is a labelled stand-in for A's scored candidates (A5) until A v0 lands.

Second consumer (M7, MC9): a clan storehouse of moon orchid fed by a nest's yield prices higher in a lean season by the same pack. Numbers are authored proposals; G calibrates canon.

## What v0 cannot express yet

| Code | Gap | Default proposal | Owner |
| --- | --- | --- | --- |
| MB1 | Walking the shelf: a trade of several units is priced at one agreed unit price, while `regional_prices.lineValue` walks the shelf per unit | A per-unit walk as a trade step option | M, when a consumer buys in bulk |
| MB2 | Live purse: substrate `coin` is not `character.money` | At embed the player's coin keeps one authority (AR3): the trade host debits through `economy_domain`, or the purse moves onto the substrate; pick one of the two (one authority per fact) | M with the money owner |
| MB3 | Per-actor want: want is a shelf's background demand; a household's own hunger and choice are separate | Want rates read from L's bodies, choices from A | A and L |
| MB4 | Price memory has two stores: `economy_standing` price memory and `market_word` sightings | Fold the memory onto knowledge rows | M (next fold) |
| MB5 | Custody and claims for a Gu (SC4 table): v0 has trade custody, not claims, lending or theft | Claims on SB1 identity rows | M with G |
| MB6 | Groups, standing and law (SMK9 to SMK11) are proposals with no code yet | Organizations doctrine dials first | M |
| MB8 | The native knowledge writer keeps `value` as text and its basis kinds are observation, recollection, instruction and inference, each with `attributedTo` and a `situationId`. M's structured rows (price, sighting time, basis `reported`) fail that contract; `toNativeKnowledge` turns them into native rows (text value, recollection for a retelling), so the structured part stays in M's rows. `world_events_knowledge.js` also writes basis `reported`, which the same validator refuses | A `data` field on knowledge entries, or M keeps structured beliefs in its own slice keyed by the knowledge key; and one basis vocabulary | Knowledge owner (N, or K until then) |
| MB7 | The shelf law counts days from the substrate root clock, as `world_sky.js` does (TMR1) | Read `dayIndex` when W-B4 lands | W, then M |

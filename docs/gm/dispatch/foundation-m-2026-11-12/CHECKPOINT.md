# Foundation M · Societies and markets: checkpoint, phase 1 (inventory)

*Chat M in the [procedural foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md) (OS4, MC15). Branch `claude/fdn-m-markets-8ff00f`, fast-forwarded to the wave base 9bbc51363 (the worktree had been cut at c25fd396d, an ancestor). Date 2026-11-12. Everything below is a proposal under AD32 and AD56: it widens play and stays adjustable. No runtime file changed in this phase.*

**State:** phase 1 done (inventory and contract proposal). Embedding waits for K and W v0 on master. Agent-verified, not human-reviewed.

## 1. Inventory: who stores what, and how prices and standing move

Read from source headers, exports and the [area guide](../../../AREA_GUIDE.md) sections on people, standing, money, regional prices, duties and institutions. Line counts from `wc -l`; importer counts from `grep -rlE "from ['\"].*/<name>(\.js)?['\"]" src`.

### 1a. Prices and stock

| Module | Lines / importers | Stores | How a price moves |
| --- | --- | --- | --- |
| `trade.js` | 732 / 2 | Native merchant UI and staging; stock is `inventories.trader` | Native margin x `market_saturation`, except listed staples, which go to `regional_prices` |
| `regional_prices.js` | 174 / 3 | Nothing (pure leaf) | `unitPrice`: base value x place x season x a keyed local event x the actual shelf count, margin 1.3 on buy, bid share 0.75 on sell. Stock is conserved; restock is a stated delivery per cycle. Two original-world stalls (Village, Slums), three goods |
| `market_saturation.js` | 303 / 8 | Module-global `loot_sold_count[region][group][tier]` (saved by the host) | Upstream rule: each sale lowers that group's price by a capped curve; counts recover over time and trickle to linked regions (Village to Slums and Swamp) |
| `native_trade_transaction.js` | 49 / 2 | Nothing; stages one native transaction | Settle refuses a quote whose fingerprint changed; transfers run between `vendor` and `player` and no other pair |
| `shop_restock.js`, `shop_locks.js`, `shop_greeting.js`, `trade_notice.js` | 8, 9, 92, 9 | `shop_locks` keeps a module-global preference slice | No price effect; keep requested items, keep-plans, keeper lines |
| `economy_standing.js` + `_domain.js` | 390 + 151 / 3 | Slice `economy_standing`: faction standing, loans, claims, insurance, deeds, price memory per region, rumours, dated price causes, customers | Standing tier multiplies buy and sell (hostile 1.12 / 0.88 to honoured 0.92 / 1.08); dated causes (pity and others) move a quote for a few days; overdue debt marks prices; whole-district reputation adds a small capped tint |
| `economy_domain.js`, `money.js`, `currency_subunits.js`, `coin_ladder.js`, `number_format.js` | 72, -, 54, 18 | `character.money` (one purse seam, named source on every write); grain per world | Not prices; the money authority and display |
| `lotm_price_map.js` | 88 / 0 (a test imports it) | Nothing | Read-only crosswalk of LOTM registry price rows to pence; a coverage proxy, not a market |
| `institution_store.js` | 64 / 3 | Nothing; world adapter keeps balances | Store rows with fixed prices and stock in the institution's own currency (merit, contribution) |
| `home_market_actions.js` | 22 / 2 | Nothing | Lists home purchase, loan and instalment offers from `HOME_PLACES` at fixed prices |
| `exchange.js`, `exchange_content.js`, `exchange_ledger.js` | 20, -, 29 | Simulation custody | One clerk scene; the ledger is conserved-units accounting for making, not a market |
| `gu_keeper_potato_market.js` | 82 / 4 | Simulation owners and the propagation row | One steward buys one fruit for one stone; prices are the transfer list itself |
| `book_world_lotm_broker.js` | 88 | World adapter | Authored lots, fees and a cut at Tingen's scale; barter compares stated pence |
| `world_packs/book_gu_lead_relic_market.js`, `book_gu_lead_caravan.js` | 168, 192 | Structured pack facts | Prices written into scene steps (five hundred stones, two thousand stones, ten each) |

### 1b. Standing, reputation and heat

| Module | Stores | How standing moves |
| --- | --- | --- |
| `reputation.js` + `reputation_state.js` | `hero.reputation`, signed integer per original region | `add_reputation` from native gameplay; throws for an unknown region |
| `faction_rank.js` (93 / 7) | Nothing; derived from `hero.reputation` | Named band over the region number (Stranger at 0 to Honoured at 1000) |
| `economy_standing.js` | `economy_standing` | `shiftStanding` per faction; a rival faction moves the other way by 0.6 of the amount |
| `persona_standing.js`, `peer_standing*.js`, `person_standing.js` | `personas`, `peer_standing`, none | Per persona, per peer group, derived over memory episodes |
| `heat.js` (209 / 4) + `heat_grades.js` | `heat@1` per authority | Rises from acts the authority knows about (the default; an unknown act adds nothing); decays linearly; missed duties add derived heat until paid; collector and fine are state, not draws |
| `authority.js` (91 / 9), `authority_sources*.js`, `world_society_sheet.js` | Nothing | `authorityOver`: claim, knowledge, reach; knownness from your own acts with a half-life per authority |
| `reputation_view.js` | Nothing | The one shared read: an audience's observer-safe account over eight registered `STANDING_OWNERS` |

### 1c. Groups, posts, duties and law

| Module | Stores | What it does |
| --- | --- | --- |
| `organizations.js` (248) + `organizations_domain.js` | `organizations@1`: founded groups, members, treasury, dues, ground claims | Kind palette (household business, church team, hidden gathering...), `CHARTER_DIALS` admission, dues, secrecy, rhythm. No doctrine, ranks or rivals field. World sources: LOTM (2 record kinds), management courtyard |
| `positions.js` + `positions_domain.js` | `positions@1` keeps exits; rows derived | Posts with term, pay, duties, exit kinds. Sources: LOTM, HP, organizations |
| `institution_store.js`, `institution_access.js` | World adapters | Contribution ledger and store rows; scoped expiring grants (MOL library) |
| `recurring_duties.js` + `duties_domain.js` | `duties@1` | Scheduled duties, dues, seizure, bribe. LOTM 4 rows, HP 1 |
| `obligations_ledger.js` (77 / 10) | Record shape, not yet the writer | Coin, favor, grievance, duty rows read by adapters |
| `jurisdiction_rules.js`, `law_case.js` | Nothing | Statutes per place, detection, nested jurisdiction. `law_case` has no src importer |
| `livelihoods.js` + sources | Nothing | Stage records of how a life earns |
| `family_tree.js`, `family_figure.js`, `village_family.js`, `npc_lives.js` | Village family and bond statuses | Original-game households; not book-world |

### 1d. Ties, offers and word of mouth

| Module | Stores | What it does |
| --- | --- | --- |
| `person_ties.js` (131 / 7) | `simulation.relationships[holder][subject].axes` through the `relationship` effect | Five tie kinds (trust, debt, affection, rivalry, duty) with offers. LOTM 5 ties, HP 5 |
| `person_memory.js` + `person_memory_effects.js` | `person_memory` episodes | Derived bond; `gossipStep` retells a flagged episode to a listener by keyed draw and temperament |
| `audit_remainder_offers_*` | Simulation situations | FG7.2 timed funded offer (escrow, deadline, presence) |
| `economy_standing.drawRumour` | `rumours[]` in `economy_standing`, each row carrying `honest` | At most one price rumour a day from something seen; a quarter invented; appraisal reads its sureness |
| `world_events_knowledge.js`, `beat_knowledge.js` | Nothing; emit `knowledge` writes | News spread is knowledge: heard is 'seen' with a reported basis naming the route |
| `social_contest.js` (98 / 1) | Nothing | Persuade, deceive, read people with one keyed draw |

## 2. PFP2 counts

**Counting rule** (so the next round recounts the same way). A *case as data* is a row a shared world-neutral rule settles, declared in a world adapter or pack, not its own file. It is *canon-sourced* when the row carries a source locator, otherwise an *authored proposal* (WPR5). A *bespoke scene module* is a file whose prices or transfers are written as its own steps and that imports none of `regional_prices`, `market_saturation`, `economy_standing`, `institution_store`. Check: `grep -cE "regional_prices|market_saturation|economy_standing|institution_store" <file>` returns 0, and `grep -cE "transfer|price|stone|pence|coin"` is above 0.

| Count | Value | Rows |
| --- | --- | --- |
| Market rows on a shared price rule | 6, canon 0 | `regional_prices` STAPLES: 2 original stalls x 3 goods |
| Institution store rows | 7, canon-sourced 3 | LOTM merit 4 (authored prices), Primordial credit 3 (36 percent, ten-year schedule, 1,000 and 300 CP prices sourced) |
| Group, post and duty rows | 2 group kinds, 4 posts, 5 duties; canon names, authored terms | LOTM and HP adapters |
| Tie rows | 10 | LOTM 5, HP 5 (FG7, K's for now) |
| Standing and faction rows in a lead world | 0 | `economy_standing` FACTIONS and `faction_rank` ladders are original-game Village, Slums, Town |
| Statutes in use | 0 | `law_case` unwired |
| **Bespoke market scene modules** | **6** | `gu_keeper_potato_market`, `book_gu_lead_relic_market`, `book_gu_lead_caravan`, `book_world_lotm_broker`, `exchange` (+content), `feature_expansion_society` |
| Separate standing stores | 8 | `STANDING_OWNERS`; one shared read, no shared write |
| Separate rumour routes | 3 | `drawRumour`, `gossipStep`, `world_events_knowledge` |

Canon market cases running as data: **0**. Every lead-world price today is a scene step or an authored store row.

## 3. What the rules cannot express today

- **R1 · NPCs have no trade path.** `stageNativeTrade` moves goods between `vendor` and `player` and no other pair. An NPC buying bread, a rival refiner buying a Gu or a steward selling to another steward has no shared path. This blocks PFP11 (everyone acts on the same rules) and the first chain.
- **R2 · Module-global market state.** `loot_sold_count` and `shop_locks` live in module variables. A one-jump settle, many steps and a reload are not guaranteed the same totals (PFP12), and two worlds share one table.
- **R3 · No lead world reaches the price rule.** Tingen has no shops; Gu prices live in pack steps; Hogwarts has none. `regional_prices` is the right shape but has two original stalls.
- **R4 · Two price factors.** Saturation and shelf scarcity are separate causes; staples skip saturation to avoid double counting. The area guide already forbids a factor beside `unitPrice`.
- **R5 · Want has no owner.** `regional_prices` has `use` per cycle as a shelf drain, but no actor wants anything: demand is not tied to who eats, burns or refines.
- **R6 · A rumour stores its truth on the row.** `drawRumour` keeps `honest` beside the claim: the flag-like case. `gossipStep` and `world_events_knowledge` already write knowledge with a source.
- **R7 · Standing has eight writers.** Region reputation, persona, peer, economy, person, memory, heat and rank each move by their own rule; `reputationView` is the one shared read.
- **R8 · Groups lack doctrine, ranks and rivals.** `organizations` has charter dials (admission, dues, secrecy, rhythm), members, treasury and ground, but no doctrine, no rank ladder and no rival. `economy_standing` FACTIONS have a rival but are not groups. Sects and clans (Gu clan contribution, Nighthawks merit) exist today as institution stores and nothing more.
- **R9 · Law is unwired.** Statutes, detection and enforcers exist as a pure model with no caller; heat does its own enforcement.

## 4. Contract proposal (SMK1 to SMK14)

Written as needs from K and W, not as their shape, since neither v0 exists yet. Each line is a default, a dial and a reason.

**Goods and scarcity as W quantities**

- **SMK1 · Stock is a quantity on a holder in a place.** Default: every good is a W quantity `stock(good, holder, place)` with units and provenance; a shelf, a granary, a Gu keeper's tray and a clan storehouse are holders. Reason: price must read the same stock a brew or a sheep consumes (PFP10). Seed: `regional_prices` conserved shelf, `inventories.trader`, simulation owners.
- **SMK2 · Want is a rate an actor carries.** Default: an actor or household publishes a want rate per good kind (bread per day, coal per winter day, primeval stones per Gu fed), read from L's bodies and the domain's upkeep. Dial: per world and season. Reason: scarcity is stock against want, not a shelf number alone (R5).
- **SMK3 · Supply is a flow from a producer.** Default: a delivery is a W effect from an actor's settled working (the baker's batch, the farm's harvest, a Gu nest's yield), not a restock timer. Reason: a failed harvest in L then moves the cart with no join code.
- **SMK4 · Near is shelves, far is rates.** Away from the player, a market settles as stock plus net flow per day and gives the same totals (PFP12, MC16).

**Prices from supply and want**

- **SMK5 · A price is a projection, never saved.** Default: `price = worth(good, place) x scarcity(stock, want) x season x keyed local event x standing terms`, extending `unitPrice`. Dials carry their reasons as `regional_prices.DIALS` already does. Reason: one authority per fact; reloads cannot drift.
- **SMK6 · Saturation folds into want.** Default: selling many of one thing raises the holder's stock against a fixed local want, which is what saturation approximated. `market_saturation` stays for original-game loot until a world opts in. Reason: R4, one cause per price move.
- **SMK7 · Standing is a separate multiplier with its own owner.** Default: tier terms from `economy_standing` apply after the market price, and K's settlement reads them through the quote fingerprint. Reason: a friendly keeper and a short shelf are two different reasons the player can read.
- **SMK8 · Anyone can trade.** Default: a trade is a K working with roles buyer, seller, goods, payment and place, settled through one native transaction for any two holders. Reason: R1, PFP11. Request to K.

**Groups with doctrine, ranks and holdings**

- **SMK9 · A group is a record with charter, doctrine, ranks, holdings and rivals.** Extend `organizations@1`: doctrine as a new dial set (what members must, may and may not do, and what the group wants more of), ranks as a ladder read by R, holdings as W stock and places the group holds, rivals with a backlash share as `economy_standing` FACTIONS use. Canon groups (a Gu clan, the Nighthawks, a Hogwarts house) become rows.
- **SMK10 · Standing is held by an audience about a subject.** Default: M owns the standing number per (audience, subject), written through one seam with a named cause; the eight current owners become sources that call it or stay readers. R owns the rank thresholds read over it (`faction_rank` moves to R's ladder rule). Reason: R7 and OS3.
- **SMK11 · Law reads who knew.** Default: statutes from `law_case` apply where `authorityOver` gives claim and reach; heat is the authority's standing about the subject, raised only through knowledge. Reason: R9; no second enforcement table.

**Word spreads through knowledge, not flags**

- **SMK12 · A rumour is a knowledge row with a source, confidence and route.** Default: price talk, gossip and news all write through the existing `knowledge` effect with `basis` (seen, told, heard) and `attributedTo`; the truth stays with its owner. `drawRumour` becomes a source that writes these rows and drops the stored `honest` field. Reason: R6, GR5. Owner question for N (see section 6).
- **SMK13 · Spread follows people.** Default: word moves when a holder meets a listener (schedules, markets, duties), at a rate set by temperament and the claim's weight, as `gossipStep` does. Dial: a world's density of talk. Reason: a scarcity is known first where it happened.
- **SMK14 · Choices read beliefs, not truth.** Default: an actor's quote uses the price it believes (seen or heard, with age), so a stale or false rumour sends someone to the wrong market. Reason: emergence and readable cause chains (PFP13).

**Save shape (MC4):** phase 1 changes nothing. SMK9 and SMK12 change `organizations@1` and `economy_standing.rumours`; old saves are disposable by standing direction, so the embed phase records reset or migrate per key.

## 5. First chain after K and W v0 (blocked on W v0 and A v0)

**Bread shortage moves a baker's customer.** One seeded test, no join code:

1. L settles a poor wheat harvest (a crop quantity falls).
2. The baker's batch working (K) draws less flour, so the delivery to the Village shelf (SMK3) is smaller.
3. The Village bread quote rises by SMK5 as stock falls against the household want rate (SMK2).
4. An NPC household's A-chosen working changes: it buys in the Slums, or substitutes stale bread, from the price it believes (SMK14).
5. A second NPC who was not present gets a `knowledge` row with basis `told` and `attributedTo` the first (SMK12, SMK13), and later shifts their own choice.

**Asserts:** the price, the choice and the knowledge row are identical after one jump, many steps and a save and reload; each step's cause is readable in the chain inspector. Second consumer (MC9): the same rule with primeval stones and Gu feed in the Gu world, where a short nest yield raises the clan storehouse price.

## 6. Requests to other chats (also in the shared notes folder)

- **To K:** a trade working for any two holders (SMK8); settlement reads standing terms through the quote fingerprint (SMK7). Ties and offers (FG7) stay K workings; M reads them.
- **To W:** quantities `stock(good, holder, place)` and `want(good, actor)` with units and provenance; delivery as an effect; far settlement as rates (SMK1 to SMK4). Market state must not live in module globals (R2).
- **To A:** a choice reads a believed price and a want; a changed quote changes the choice (OS1 done check).
- **To R:** split proposal: M owns the standing number and its holder, R owns rank thresholds over it, including `faction_rank`.
- **Word of mouth owner:** N (OS9) has no chat in this wave. M holds SMK12 and SMK13 as a proposal that writes through the existing `knowledge` effect and adds no store; N or K can take it later.

## 7. Checks run

| Command | Result | Gaps |
| --- | --- | --- |
| `git merge --ff-only 9bbc51363` | Fast-forwarded from c25fd396d | None |
| Line and importer counts (section 1 grep) | Recorded above | Relative-path importers outside `src/` not counted |
| Bespoke-module grep (section 2 rule) | 6 files match | Counts are per file, not per price |
| No tests run | Docs-only phase | No runtime changed, so no focused test applies |

## 8. Next phase

After K and W v0 merge to master: embed SMK1 to SMK8 on `regional_prices` and `native_trade_transaction` first, then build the section 5 chain as M's focused test, then fold the six bespoke market scenes into rows. Done check stays the plan's OS4 row.

```receipt
build: n/a
route: n/a
state: drafted
viewport: n/a
persistence: unchanged
tests: docs only
review: diff-scoped
surface: societies and markets inventory and contract proposal; no runtime change
```

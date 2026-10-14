# Caravan economy and travel

**SHOWN**, build 25598304. Source locators use private `extract/code/`; table locators use private `extract/AirTable.json`. Prior F31-F35/F44-F46 are retained and extended, not presented as new reads of every old effect.

## Goods and markets

58 Goods rows include **37 non-collection goods**. Collection rows are selectors, not 21 extra tradable commodities. Examples cover raw materials, food, metals, luxury goods and contraband. Goods hold stack size, base price, rarity, profit tuning, supply conversion and source-level references per settlement. Supplies stack to 250; low-volume valuable goods and bulky basic goods create different cargo choices. All Goods rows were structurally indexed; this pass does not claim every market pair was evaluated.

The market pipeline is:

```text
settlement/near-market resolution
 -> good's local source category + rarity + base price + stack size
 -> local and import conditions, stock range, demand absorption range
 -> local production price or delivered import candidates
 -> optional import blend / own-producer cascade
 -> normalized price
 -> stock-sensitive dynamic buy price
 -> local sell spread
 -> quantity-sensitive trade quote and actual stock/cargo/money changes
```

`Node.GetWareAtDayGoods:3780-3881`; `GetDynamicPrice:3883-3945`; `MarketUI.UpdateGoodsPrice:1151-1226`.

**SHOWN:** import cost factor is `max(1, 1 + max(0,mp-3)^0.95 * stackWorthFactor / 14.5)`, with invalid-input and ceiling guards. The value factor is further damped for high-value goods. Default `UseLiveTravelDistance=false` means the composed static distance path is authoritative here. `ImportBlendPricing=true`, `ImportCascade=true`, and `NearMarketPricing=true` are code defaults, not a runtime settings observation. Built crossings have a separate trade-distance switch. `MarketTweak:31-55,612-637`; `DistanceModelFlags`; `Node.TryGetDeliveredImportPrice:4325+`.

**SHOWN:** if the cheapest delivered source is also nearest, blending returns it directly. Otherwise eligible sources no farther than that cheapest source receive weights proportional to source-category rank times settlement level, divided by `(mp+50)` and squared relative delivered price. A producing node can blend its own price downward toward cheaper neighbors. This is richer than a flat distance surcharge, but not proof of individual NPC trade caravans. `Node.BlendCandidates:4434-4484`, `GetCascadedOwnPrice:4295+`.

**SHOWN:** ordinary stock changes price only outside the target band. Scarcity raises price; glut lowers it. Elasticity, stack size, rarity, source category and settlement demand absorption affect the curve. Glut has a settlement floor and scarcity a ceiling. Sell rates differ by source category: base 0.52 at MainSource through 0.82 at FullyDependent, 0.86 OnDemand and 0.37 NotOnDemand, plus settlement-level adjustment. Sell quotes round and cannot equal the same buy price in the reviewed helper. Faction products take their own route and are skipped by ordinary UpdateGoodsPrice. `MarketTweak.GetBaseSellRate/GetPriceSellRate/GetSellPrice`; `Node.GetDynamicPrice`.

**SHOWN:** quantity quotes evaluate price along stock changes, so multiplying the first displayed unit price by a large quantity is unsafe. `MarketUI.UpdateGoodsPrice` averages marginal prices at decreasing stock for buys and increasing stock for sales; low normalized prices have a distinct rounding path.

**SHOWN:** full regeneration occurs on first generation, lost/empty generated products, forced generation, or **more than 30** elapsed turns. Ordinary refresh uses elapsed-day stock updates and fractional `restockCarry`. Rarity default restock multipliers run 2.0 Ample, 1.5 Common, 0.8 Limited, 0.4 Rare, 0.28 VeryRare, 0.033 UltraRare. Stock inside its default range uses a one-day refresh step instead of full elapsed days. Refresh is stochastic, clamped nonnegative, with different faction/equipment rules. `Node.IsNeedGenerateProducts:4847+`, `RefreshProductQtys:5178-5312`, `GenerateOrRefreshProducts:5314+`; `MarketTweak:17,75-87`.

## Company costs and capacity

| Input | Recovered rule | Evidence |
|---|---|---|
| Daily food | Sum category and named-character consumption; ration debit rounds total consumption times ration/100 | Caravan.GetConsumptionBase; Camp.GetRatedConsumption:955-958 |
| Estimate | Supply days uses integer supplies/total consumption, with divisor-one fallback. It is not the selected-ration or delay-risk forecast | Caravan.GetSupplyDays:6187-6194 |
| Wages | Category count times loaded crew upkeep, plus named companions. Deferred obligations accumulate; a double-pay promise doubles relevant accrual | Caravan.GetUpkeepBase:5955-5974; Camp.GetUpkeepPromise:591-598 |
| Camp | Pay or defer, defense cost, ration/rest impacts, promise, encouragement, crew ledger, consumption, hunting/foraging, optional event, next-day continuation | Camp.EndCamp:1196+ and ContinueEndCamp:1038+ |
| Morale/vigor | Ration/camp impacts and encouragement mutate actual properties. Encouragement consumes Resourcefulness and has a next-eligible day | Camp.EndCamp:1216-1240 |
| Cargo | Category capacity plus companions/leader, free mounts and outriders, capped by cargo holder maximum. Physical capacity and slot fit are separate checks | Caravan.GetTotalCargoCapacity:737-778; MarketProduct.GetAvailSlot |
| Labor | Crew rows supply workforce and labor demand. Ratio feeds difficulty-dependent understaffing severity | Crew rows; TweakFunctions.CalculateWorkforceRatio/GetUnderstaffedSeverity |
| Companion exception | Base pay plus Prowess and assigned-role increments has status/story exceptions; Sedarias consumption differs | prior F38; GameCharacter.GetUpkeep/GetConsumption:506-537 |

Raw Crew table tuning: workers have 6 cargo, 2 food, 0.9 workforce; enslaved workers have 9 cargo, 1 food, 0.9 workforce and zero wage. This explicit economic advantage is part of Vagrus, not an accepted YAIR labor model. Do not flatten these categories into consensual companions.

Beasts make real trade-offs before effects: insectoid beast 400 cargo/9 food/4.5 labor need/8 move/8 march; reptile 400/16/2.8/9/3; mammal 350/12/3.7/8/6. These are row coefficients, not final travel stats. Food, staff and animal price can outweigh cargo gain. All 12 crew rows were inspected; wages in raw tables use a different denomination from loaded integer money and must not be shown directly as whole coins.

## Routes and a profitable loop

**SHOWN:** an edge's movement cost multiplies geometric length, map distance scale, terrain, road, close-up scale and optional twilight factor. Base movement selects mounts if all mounted, otherwise beast movement if beasts are present, otherwise the slowest applicable crew. Actual remaining move/march clamps maximum plus a stored offset. Movement debit spills beyond ordinary move into march. `Line.UpdateDistance:880-908`; `Caravan.GetMaxMoveBase/GetMaxMarchBase:11690-11800`, `SubtractMovementPoints:6416-6433`.

**INFERRED accounting model**, not a computed winning route:

```text
loop net = sum(actual sale receipts) + contract pay
           - actual purchase receipts - supplies - wages - camp/defense costs
           - route tolls/fees where authored - expected losses
return per day = loop net / total travel + camp + delay days
feasible load = enough slots/weight for cargo AND supplies AND required equipment
```

An invented arithmetic probe buys 10 units at 100, sells at 140 and pays 250 overhead: net 150. One extra 200-cost delay turns it into -50. It validates the accounting distinction only, not those prices in Vagrus. [Probe receipt](STATIC_PROBES.json).

A robust loop has useful exports and return cargo, sufficient destination demand, fresh price information, enough supplies to survive a detour and wages that do not consume the spread. Risks include stock depletion raising the purchase quote, glut lowering sale receipts, rarity slowing restock, costly beasts and labor shortages, forced march/rest, contraband gates, hostile encounters and contract deadlines. Contract completion can freeze elapsed time before eventual turn-in, per prior F39. No exact best route, live prices, end-to-end hunt yield, or difficulty balance is claimed.

**PROPOSAL:** a Village merchant itinerary should quote useful reserves and actual funded orders. Food support should follow YAIR's comfortable unfed ordinary play and no hunger-death direction, rather than silently importing Vagrus's survival balance. Queueing may advance on YAIR's explicit clock; no offline clock is established by this source.

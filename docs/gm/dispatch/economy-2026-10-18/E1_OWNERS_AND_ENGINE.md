# E1: economy, trade, money and property, owner map and engine fit (read-only, 2026-10-18)

CHECKPOINT: lane E1 complete, read-only. HEAD df5c6e682 plus uncommitted edits by other sessions
(root palette docs/ECONOMY_AND_TRADE_CONSIDERATIONS_2026-10-18.md is untracked). Only this file was written.
Proposals only; nothing here is an accepted decision (AD27 and AD31 are the accepted anchors).

Labels: SHOWN = read directly in this pass; STATED = a doc says so; INFERRED = deduced.
Search basis (SHOWN): grep over docs/*.md, excluding research/novels, `private/` and `evidence/`, for
merchant, currency, saturation, barter, arbitrage, purse, AD31, furniture, appraisal, commission (about 110
files hit; the tables keep owners of a rule, decision or seam). Code searched under src/ for money, trader,
saturation, purse, coin, inheritance.

## Part A. Owner map

### A1. Accepted direction and rulebooks

| Code | Doc:line | Prefix | Owns |
|---|---|---|---|
| E1-O1 | docs/RULES_INDEX.md:155 | AD27 | "**Economies are local; trade and arbitrage are intended.** Shared currencies come through means or cheats." (source OD11) |
| E1-O2 | docs/RULES_INDEX.md:159 | AD31 | "**Owned things such as furniture may give passive bonuses.**" (origin PROJECT.md:1071, 2026-10-11, Proto23) |
| E1-O3 | docs/RULES_INDEX.md:80 | router | Row "Economy, trade, property" = AD27, AD31, MR5, SR15, SR19 only. No economy rulebook prefix exists in the register (SHOWN, register lines 36-55). |
| E1-O4 | docs/MAKING_RULES.md:26 | MR5 | "Conserve what is conserved": mass, identity and exact canon substances go somewhere declared. Touches salvage-for-coin and sell loops. |
| E1-O5 | docs/SITE_AND_EXPLORATION_RULES.md:49, :53, :32-33 | SR15, SR19, SR8, SR9 | SR15 custody and allocation; SR19 "Access, discovery and repair do not establish ownership or issuing authority"; SR8 buying information grants only what the channel supports; SR9 protect sealed facts across "names, prices, sorting, counts". |
| E1-O6 | docs/RULES_INDEX.md:112 | AD38 | "Things work by how they work": a plan that reasonably works by the mechanisms in play works; relevant to cheat-driven arbitrage and unconventional selling. |
| E1-O7 | docs/RULES_INDEX.md:132-135, :70 | AD19-AD22 | Forgiving recovery and "no hidden game-over": M18 cites these for credit, debt and default consequences. |
| E1-O8 | docs/ARCHITECTURE_RULES.md:27-31, :37-40 | AR1-AR16 | Engine constraints (see Part B5). |
| E1-O9 | docs/BODY_AND_HEALTH_RULES.md:69 | BHR26 | "Free rest and basic care stay workable beside faster paid options." The only body rule that sets a money floor (INFERRED applicable to any paid service). |
| E1-O10 | docs/COMBAT_RULES.md:25 | CBR3 | Loot and harvest follow the fight's outcome; touches loot-to-coin faucet (SHOWN row text). |
| E1-O11 | docs/UI_RULES.md (UR34, UR51 hit only) | UR | No UR code owns a shop, price or currency display (SHOWN: grep of UR rows for money, price, trade, shop, currency returns only layout rows). Gap, not a conflict. |
| E1-O12 | docs/ABUSE_AND_LIMITS.md:27, :61, :165 | T, F | "In-fiction abuse ... Allowed, with consequences. The world notices, prices and reacts." Limits are adjectives; only save integrity is firm (AD22). Governs arbitrage and sell-farming. |

### A2. Economy palettes and design owners

| Code | Doc:line | Prefix | Owns |
|---|---|---|---|
| E1-O13 | docs/gm/dispatch/procgen-2026-10-13/p11/REQUESTS_AND_MARKETS.md:1-343 | N1-N10 | Need-based requests, N2 "markets, prices and merchant behavior" with quote contract `{id, merchantRef, stockRevision, marketRevision, itemRefs, quantity, currencyRef, ...}` (:28-44). N3-N10 commissions, funding, bounties, reputation. 980 lines. |
| E1-O14 | same, :343-480 | M1-M5, L1-L7 | Round 1: "The default sale is to a local merchant" (M1); "the price response is a per-good curve" (M2); buyer tiers universal, specialist, deep-pocketed (M3). |
| E1-O15 | same, :481-594 | M6-M12, L8-L13 | Round 2: sell chores, M7 (corrected: locality is a default, not a wall), M9 undo through merchant stock, M12 money across lives. |
| E1-O16 | same, :595-735 | M13-M16, L14-L18 | Round 3: currencies palette, "value is recognition times usability times access" (M14), bridges. |
| E1-O17 | same, :736-872 | M17-M24, L19-L24 | Round 4: buying, credit (M18), safety, taxes and tolls (M20), gambling, endgame money. |
| E1-O18 | same, :873-980 | M25-M28, L25-L29 | Round 5: wealth as information (M25), optional institutions (M26), carryover exchange (M27). |
| E1-O19 | docs/ECONOMY_AND_TRADE_CONSIDERATIONS_2026-10-18.md:1-169 | ECC, ECX, ECL | Root palette of this audit (untracked, in progress). ECC-B property (:65), ECC-J implementation (:152). Points to docs/audits/ECONOMY_CORE_AUDIT.md, which does not exist yet (SHOWN). |
| E1-O20 | docs/worlds/MULTIVERSE_STRUCTURES.md:147-209 | OD11 EC1-EC5, GW4 | Cross-world value: abundance (EC1), knowledge (EC2), demand and information (EC3), commerce cheats (EC4, corrected), history and claims (EC5). |
| E1-O21 | docs/USER_VISION.md:3490-3532 | OD11 entries | Weibao's words: "each world has its own economy, but shared currencies and cross-world trade should be possible depending on our means and cheats"; 3516-3532 correction that "selling cheats" means commerce-oriented cheats. Also :5044-5050 lists "economy and trade (G4)" as a survey gap "not started". |
| E1-O22 | docs/gm/dispatch/procgen-2026-10-13/p8/TRADE_SUPPLY.md:1-17 | D1, D2 | Supplier lots, manifests, delivery clocks, import laws; D2 price inputs (saturation, stock, demand, delivery, seller knowledge, margin). "Template refresh remains legacy behavior outside opt-in supply-managed groups." |
| E1-O23 | docs/MEANS_AND_APPRAISAL.md:88-145 | AP, MN1 | Appraisal levels and types; :139 "Markets: Merchant ... Real price, scarcity, who's buying"; :143 "Specialists beat generalists in their domain." Basis for specialist-buyer pricing (L2). |
| E1-O24 | docs/SUBSYSTEM_SCOPE_LADDERS_2026-10-16.md:71, :150, :176, :193, :215 | Consumers dial, SSD58, SSD71, SSD96 | Consumers ladder: fixed sale, local saturation, orders, regional prices, cross-world trade. SSD71 "Pools, not entities": `market_saturation.js` counts may already be the shared pool shape. |
| E1-O25 | docs/CHEAT_LIBRARY.md:640, :711, :856 | AQ7, ST14, CT9 | Bought or bargained cheats (price can be years or memories), costed starts (fewer coins, debt, patron lien), "Market sight" (true prices, demand, liars). |
| E1-O26 | docs/worlds/WORLD_CORE_KIT_2026-10-14.md:66, :196-198, :1689 | K8, K8.1, MW5 | K8 "Daily life and economy": local money, 2-3 jobs, price list; K8.1 price anchors; MW5 special currencies and ratings are laws (who issues, revokes). Per-world K8 rows in docs/worlds/world-core-kit-2026-10-14/W3_PEOPLE_INSTITUTIONS_LIFE.md:117, :205, :229 (TT1 pound ledger, TT5 gate scrip, ML crowns). There is no currency field on the card yet (SHOWN; L17 proposes one). |

### A3. Owners the root audit may have missed (not in the ECC owner table, :11-27)

| Code | Doc:line | Prefix | Owns |
|---|---|---|---|
| E1-O27 | docs/gm/dispatch/procgen-2026-10-13/p21/ECONOMY_STORIES.md:1-109 | J1-J2 ext. | "Supply cycles, merchant competition and partnership" (PROPOSAL ONLY). Third economy owner next to P8 and P11. |
| E1-O28 | docs/gm/dispatch/procgen-2026-10-13/cr4/ECONOMY.md:1-58 | EC1-EC5 (crafting palette, a different EC set) | "Crafted goods, demand and competing makers." Its EC1-EC5 collide with MULTIVERSE_STRUCTURES EC1-EC5 (INFERRED code clash; qualify as CR4-EC or OD11-EC). |
| E1-O29 | docs/gm/dispatch/procgen-2026-10-13/p31/SECRETS_AS_CURRENCY.md:1-81 | AK1, AK2 | Information as currency: holders, evidence, audiences. Owns M10/M25 selling knowledge. |
| E1-O30 | docs/worlds/paradise-hub/HUB_LIFE_ECONOMY_AND_PEOPLE_2026-10-14.md | none | Hub economy research for the Paradise world (points, shops, missions). WORLD_CARDS.md:302 "Shops and currency: points from missions". |
| E1-O31 | docs/worlds/NONHUMAN_SOCIETY_LAW_AND_ECONOMY_2026-10-14.md | none | Nonhuman law and economy, INFERRED proposals. Supports non-coin value forms (M13). |
| E1-O32 | docs/gm/dispatch/procgen-2026-10-13/p20/HOME.md:1-45 and docs/gm/dispatch/procgen-2026-10-13/p6/BUILDINGS.md | H5.1 | Home as place with usable things; the nearest property/furniture design owner for AD31 (ECC-B cites none). Code seed: src/home_furnishing_content.js (original reversible fit-out proposals, "creates no home, resident, native item ... or persistence domain"). |
| E1-O33 | docs/MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md:142, :295 | MX9, MR11 | "Money and credit: Mint, lend, tax, debase; prices as a chain output, not a constant"; MR11 techniques spread to NPC makers and change prices. Collides with the code letter MR (making rules MR1-MR36) as a prefix (INFERRED). |
| E1-O34 | docs/LIFE_SIM_NORTH_STAR.md:323, :351 | economy over a lifetime | "Prices drift with wars, harvests and decades"; crafter or merchant path. North star for the long run. |
| E1-O35 | docs/EMERGENT_SYSTEMS.md:192, :284-290 | needs, resources | `money` as a need and finite resource for generated actors; "Pay part of the debt for them" choice cost. |
| E1-O36 | docs/gm/dispatch/absorb-all-2026-10-14/reports/p23-market-life.md and src/absorb_p23/market_life/HOST_CONTRACT.md | P09 | The only implemented market-life layer: customer coupons (5 purchased units earn a 5-coin coupon) and a bread supply discount. Owner of save key `p23_market_life`. |
| E1-O37 | docs/gm/dispatch/procgen-2026-10-13/p11/WORKSHOP_AND_NATURAL_SITE_JOURNEYS_2026-10-16.md | journeys | Same folder as N1/N2; sale of workshop and site outputs (not read in depth; INFERRED relevant to sell sinks). |
| E1-O38 | docs/research/ur-quan-masters/TRAVEL_AND_ECONOMY.md, docs/research/vagrus/pass-2026-10-14/ECONOMY_TRAVEL.md, docs/research/hearts-of-iron-iv/ECONOMY_DIGEST.md, docs/research/warsim/pass-2026-10-14-rea/ECONOMY_AND_BATTLE_DIGEST.md, docs/research/power-systems/wiki-digests/DIGEST_markets-and-multiverses.md, DIGEST_losing-money-to-be-a-tycoon.md | source digests | Reference material for E2; none is a decision owner. |
| E1-O39 | PROJECT.md:879-886, :1071-1080, :1187-1189, :1327-1336, :1362 | decisions | OD11 summary; AD31 origin; kit debt of 50 coins with no new loan until paid (village career, :1189); paid mentor default 60 coins; E2 durability repair 1-5 coins (:1362). The village career already contains a lender-style debt (see Part B). |
| E1-O40 | src/heir_inheritance.js:83 and src/chronicle.js:27-30, :295 | inheritance | Money carryover already exists in code: `inheritance.money`, `debtsPaid`, `obligations`. The M12/M27 carryover rounds do not mention it. |

Which existing rule codes touch economy (summary, INFERRED from above): AD27, AD31, AD38, AD19-22, MR5, SR8, SR9, SR15, SR19, BHR26, CBR3, AR1-AR16. UR has none. No BHR/CBR rule prices a service or loot value, and no rule code owns currency, purse, credit or property. The router row (RULES_INDEX:80) lists five codes and omits AD38, SR8, SR9, ABUSE_AND_LIMITS, MEANS_AND_APPRAISAL and the P8, P21, CR4 owners.

## Part B. Engine fit

### B1. Current money and trade seams (all SHOWN unless marked)

| Seam | File:line | What it does | Reads / writes | Save key |
|---|---|---|---|---|
| Player money | src/main.js:3857-3860 `add_money_to_character` (just `character.money += n` plus display) | Single number, one currency, no cap, no sign check | Writers: 1902 (plan publish), 2194, 3434, 3448-3452, 3549, 4081, 5942, 6835 (load), 8894-8896, 9525 (debug), 9714, 9764; src/expansion_persistence.js:16; src/generated_people_ui.js:30; src/heir_inheritance.js:83; src/mixture_native.js:58; src/story_requests.js:63 | `save.character.money` (main.js:6308); load at 6835 multiplies by 10 for saves older than v0.3.5 |
| Money transaction path | src/expansion_persistence.js:14-20 | Durable publish: rejects non-finite or negative `plan.external.money`, writes `envelope.character.money`; main.js:1902 then sets `character.money` | All staged plans pass `external:{money}` | same |
| Native trade | src/native_trade_transaction.js:8-48; main.js:2008-2031 `commitNativeTrade` | Fingerprint check of quote (line 9), range check against `Number.MAX_SAFE_INTEGER` (line 12) for buyValue, sellValue, money, buyDebit, balance check (line 15, `balance < 0` or above safe max), builds owner transfers (vendor to player, player to vendor), mutates cloned market (lines 20-31, errors at 1e13 sold), Haggling XP, history event `native.trade`, returns `{external:{money:balance}, market, ownership:{vendor}, itemLog}` | Reads quote, money, market, gameplay, item owners; writes via `persistExpansion` | writes `loot_sold_count`, `inventories.trader.<npc>`, `expansion` history (last 100 events), `item_log` |
| Trade UI/quote | src/trade.js:20-21 (`to_sell`, `to_buy`), :82-92 `readTradeQuote`, :94 `accept_trade`, :325-491 `calculate_total_values`, :508 `get_item_value` | Builds a quote from selected rows; sells in tier-sorted order (`sort_traded_items` :519); buying computes with trader margin; clones whole `loot_sold_count` into each quote (:91) | Reads `character.money`, NPC trader component, `current_location.market_region`; calls `commitNativeTrade` | none (UI state) |
| Saturation | src/market_saturation.js:4 `loot_sold_count[region][group_key][tier] = {sold, recovered}`; constants :15-21; modifier :159-176; tier blending :205-225; add/remove :271-295 | Price multiplier `param/(param+sold)` floored at 0.1 at the cap (500 items, 200 for equipment groups `type_*`); lower tiers count at 0.1^k up to cap/8, higher tiers count 1:1. Prices never rise above base (comment line 175) | Written by `stageNativeTrade` (sell adds, buy removes), daily `recover_item_prices` (flat 5, ratio 1/360) and `trickle_market_saturations` (0.2) at main.js:8703-8704; config in src/config.js:7-10 | `save_data.loot_sold_count` (main.js:6504), validated only as an object (src/save_files.js:192); `set_loot_sold_count` (:53) clamps counts above 1e13 to 1000 on load |
| Market regions | src/market_saturation.js:9-12 | Only one mapping, Village linked to Slums and Swamp | read by trickle | none |
| Item value | src/items.js:260-281 `getBaseValue`, `getValue`; :231 `getMarketSaturationGroup` (default `{group_key: id, group_tier: 0}`); :291-313 `getValueOfMultiple`; :195 `saturates_market` (default true; false for some, e.g. items.js:499, 1130); src/misc.js:105 `round_item_price` | Base value x quality x rarity; selling price = base value with saturation, buying = base x trader margin with saturation. No sell fraction exists | read by trade.js | per-item `value` in content, not saved |
| Trader | src/components/trader_component.js:73-100 `refresh`, :116 `fillInventoryFromTemplate`, :150 `getProfitMargin`; src/data/traders.js (margin 4, 6, 7, 20 for named traders), src/data/inventory_templates.js | Stock refreshes on a day cadence from a template, seeded by `gameKeyedRandom(STREAMS.market, ...)`; `refresh` empties the whole inventory except conserved campaign keys (:80-93). Margin = `1 + (m-1) * (1 - Haggling bonus) * (1 - rep/2000)`, then `accessoryTradeMargin`. No purse. | Stock in `InventoryComponent`; sold items are added to it by the transfer | `save.inventories.trader.<npc_key>` (main.js:6450-6457); `save.npcs.<npc_key>.trader.last_refresh` (main.js:6415-6421) |
| Market life (P09) | src/absorb_p23/market_life/market_life.js:3-96; main.js:1452, 1896, 2013-2029, 6548, 6677 | Village-only coupon and bread discount, schema 1, strict `normalizeMarketLife` | Village trader only (`renderP23MarketQuote` eligible check, trade.js:493) | `p23_market_life` |
| NPC purses | src/generated_people.js:29, :45 `possessions.coins`; src/story_requests.js:55 (`p.possessions.coins-=reward`), :60 (escrow `held`), :71 (`kind:'coin'` receipt deltas keyed 'wood'); src/lore_history_state.js:30 allowed kinds `item`, `coin`, `skill` | Generated travelers already carry finite coins (reward + 2 + draw(8), capped at reward + 20); request fee is moved from the issuer's purse into escrow, then to the player or back | Writes `generated_people` and `expansion.loreHistory` receipts | `generated_people.storyRequests`, `people.people[].possessions` |
| Actor resource purse | src/backlog_expansion_replacement.js:14, :80 | A clerk's `PURSE` resource in the expansion simulation pays 1 coin wages | `plan.external.money++` | inside `expansion` |
| Requests | src/story_requests.js:1-76 | One request family (village traveler supply asks), 16-record cap, `held` escrow, expiry is "played-time defer; no absence penalty" | reads `generated_people`, writes `character.money` in a detached envelope clone | `generated_people.storyRequests` |
| Debt | src/main.js:3434-3452 (kit debt of 50 coins, tuition 5 coins) | One-off authored debt, paid with `add_money_to_character(-50)` | village career | `village_career` |
| Inheritance | src/heir_inheritance.js:83; src/chronicle.js:27-30, :294-305 | Money passes to the next life as `inheritance.money`; `debtsPaid` and obligations tracked | `leftovers.money` | `expansion.chronicle.life.experience.inheritance` |
| Accessory margin | src/absorb_c1/accessories.js:88-93 | Amulet reduces markup only ("never create buy/sell arbitrage below base value") | called without an equipment argument from trader_component.js:154, so it reads the native amulet slot via `equipmentReader()` | none |
| Domain registry | src/domain_registry.js:17-41; registered: crafting, meadow_pen, harvest, tools, combat-opponents | Per-domain `save`, `validate`, `migrate`, `load` slices stored at `envelope[domain.id]` | none of money, market or trader is registered (SHOWN: grep of `registerDomain(`) | n/a |

### B2. Where the economy lives, in one line (INFERRED)

Money, trader stock and saturation are legacy native state owned by main.js and market_saturation.js (module-level singletons), committed through one durable path (`stageNativeTrade` then `persistExpansion`). Newer economy code (people purses, escrow, coupons, inheritance) lives in `expansion`/`generated_people`/`p23_market_life` slices with strict validators. There are three money shapes today: a native number, actor `resources`/`possessions.coins`, and receipt deltas with `kind:'coin'`.

### B3. Cheapest implementation steps, per proposal

Ranking is by smallest change surface (AR13). Effort uses the palette's own S/M/L.

**L1, per-good absorption curve (S-M).**
- Seam: `get_loot_price_modifier` (market_saturation.js:159) and group data on items (`market_saturation_group` at items.js:210). Today every good shares one curve with `capped_at` 500 or 200 by key prefix `type_`.
- Step 1: add optional `absorption: {cap, direction}` to the saturation group definition; read it in `get_loot_price_modifier`, `get_total_tier_saturation` (:186-203, the cap choice by prefix at :196) and `trade.js` lines 390 and 442 (these duplicate the cap choice; replace both with one helper to avoid drift, see C-gaps). Default stays the current values so old saves price identically.
- Step 2: "rising" curves (modifier above 1) need a different data form: `{sold, recovered}` cannot go negative and line 175 states "prices don't go above the starting values". Cheapest: keep counts, add a per-group `ceiling` > 1 and let recovery overshoot via an offset field. This changes the sell/buy symmetry that `remove_from_sold` relies on, so rising is a separate later step.
- Risks: quote fingerprint embeds the whole market clone (trade.js:91), so any new field is part of staleness checks. Save: counts remain `{sold, recovered}`; new data is content, not saved, so no migration for step 1. Arbitrage: staple goods with a flat curve plus the base-value sell price makes buy-low-sell-high impossible only because buy price includes margin >= 1; keep that invariant (accessories.js:89 comment).

**L2, universal vs specialist buyer (S).**
- Seam: `getValueOfMultiple` is called from trade.js:355-362 with `price_multiplier` only for buying (:402); selling uses full base value. Add a per-trader `buy_fraction` and optional `specialties` (tags) on `TraderComponent` (constructor, trader_component.js:36), applied as a sell-side multiplier in `calculate_total_values`.
- Note: the existing system is a universal buyer at 100 percent of base value for every trader (SHOWN: no check of what a trader accepts anywhere in trade.js or native_trade_transaction.js). L2 therefore lowers generalist prices; it is not additive. A 100 percent universal buyer with a specialist bonus above 100 would break the "no arbitrage below base" invariant against margin >= 1 traders only if bonus x margin crosses 1; check per trader.
- Save: none (trader config is content). Risk: existing players lose sale income; label as default-with-dial per world, and pick values so the village trader keeps today's numbers.

**L7, finite merchant purse (S-M, needs migration).**
- Seam: add `purse` to the trader's saved record. Safest owner: a new key beside stock, `save.npcs.<npc_key>.trader.purse` (main.js:6415-6421 already saves `last_refresh` there), or a registered domain per AR2.
- Migration: a missing key means unlimited (STATED by L7 done check: "Migration keeps old saves unlimited"); represent as `null` = unlimited, never 0. Load path: main.js around 6677 pattern for `p23_market_life` (absent = `undefined`, present = strict normalize) is the in-repo model to copy.
- Transaction: `stageNativeTrade` already computes `balance` for the player; add a vendor purse check on `quote.sellValue` and return the new vendor purse in the plan, persisted in the same `persistExpansion` call with the vendor inventory (`itemsByOwner`). The same atomic plan keeps coin conserved (ECC4). Refill: day tick next to `recover_item_prices` at main.js:8703 (AR3: no second timer).
- Risks: quote fingerprint must include purse (JSON.stringify of quote at native_trade_transaction.js:7; add `vendorPurse` to `readTradeQuote`). UI: partial sale ("they can pay only N") needs a quote that trims `sell` entries, which trade.js currently does not support. NPC purse precedent exists at generated_people.js:29, so the shape (non-negative integer) and validator style are established.

**L14, multi-currency purse (M, strong coder).**
- Seam: `character.money` is a scalar in 14+ write sites (B1). Cheapest safe form: keep `character.money` as the home-coin balance forever and add `character.purse = {<currencyId>: n}` for others, so no migration is needed for old saves (STATED by L14 done check "Old save loads with the same amount in home coin").
- A single new owner module should wrap reads and writes; the quote needs `currencyRef` (already in the N2 contract, REQUESTS_AND_MARKETS:36) and `stageNativeTrade` must be generalised from `money` to `{currencyId, amount}`. Receipt deltas already carry a `key` for coin (story_requests.js:71 uses 'wood'), so the lore history shape tolerates multiple currencies.
- Risks: ECC25 "no feature writes `character.money` directly" is false today (12 writers listed in B1); a rule check or wrapper must come first. The money-validation in `persistExpansionPlan` (expansion_persistence.js:15) and `save_files.js:155` accept only the scalar. Display: `update_displayed_money` is a single field.

**L8, sell rules (M).**
- Seam: needs an eligibility test per item. Existing guards to reuse: `assertNativeItemDisposition(expansionState, key)` is already called per sold item in `commitNativeTrade` (main.js:2012), so quest/locked disposition is already enforced at commit; `favourite_items` (runtime_state, saved at main.js:6330) is the lock/keep mark. Equipped items: not in `character.getItems()` stack (INFERRED).
- Step: a rule list stored in `game_options` or a new slice, evaluated into a normal `to_sell` selection and sent through the same quote and `commitNativeTrade`; do not add a second sale path (AR3, AR7). Per-run log goes to the existing history event (`native.trade`, native_trade_transaction.js:41).
- Risk: automatic selling inside the idle loop must run only when a trader is present or via a named consignment; selling needs a current `current_trader` (trade.js:49-57), so rules need an explicit "visit" or proxy buyer (L3/L4 territory). Offline: AD33 defers NPC-heavy work.

**L9, buyback (S).**
- Seam: already partly true. Sold items transfer to `vendor` stock (native_trade_transaction.js:18-19) and buying reduces `sold` (lines 26-30), so buyback at trader price exists until the next stock refresh. But `TraderComponent.refresh` (trader_component.js:78-93) wipes stock except conserved campaign keys, so a sold item can vanish at refresh, contradicting M9 ("never disappears into a void").
- Step 1 (cheapest): a vendor-owned `sold_by_player` ledger `{key: {count, price, at}}` beside stock, retained across `refresh`, plus a grace-window price equal to the recorded sale price in `calculate_total_values`. Save under `save.npcs.<npc_key>.trader.buyback` (absent = empty). Step 2: when the window ends, merge into normal stock instead of deleting.
- Risk: buyback at sale price while buying also removes saturation (lines 26-30) lets a player probe prices for free within the window; set the window short and make the buyback not reduce saturation until the window closes, or require the restore to be exact (reverse the same count). Haggling XP is paid on `(buyValue + sellValue)/10` (main.js:2019), so sell-and-rebuy loops farm XP; M9 and ABUSE_AND_LIMITS allow this with consequences, but note it.

**L25, known wealth per place (M).**
- Seam: no existing field (SHOWN: grep). Cheapest owner: a small slice `{place: level, at}` fed by the same `native.trade` history event (value of the sale, region). Region key is `current_location.market_region` (trade.js:84); fading rides the daily tick that already calls recovery (main.js:8703).
- Consumers: `reputation[region]` already modifies trader margin (trader_component.js:152); known wealth can reuse that region key. Response (L26) can be a Village-trader line first, matching P09's Village-only scope.
- Risk: AD33 defers NPC-heavy systems; keep this as a number per place, not per person (M25 says so). Save: new key, absent = zero, so no migration. Must not become hidden information used against the player without a visible cause (SR9, AD6-AD8).

**Smaller steps worth ordering first (INFERRED).** L12 debug inspector (read-only; projection style per AR8) lets every later change be checked; wrap the 14 money write sites behind one function before L14 or L7; centralise the cap-by-prefix choice before L1.

### B4. Save-key map (SHOWN)

| Data | Key | Writer | Validation |
|---|---|---|---|
| Money | `character.money` | persistExpansionPlan, load, legacy paths | number (save_files.js:155), non-negative checked only in persistExpansionPlan |
| Saturation | `loot_sold_count` | `stageNativeTrade`, daily tick | object only (save_files.js:192); load clamps >1e13 |
| Trader stock | `inventories.trader.<npc>` | trade transfer, `refresh` | inventory loader (main.js:7316-7324) |
| Trader refresh time | `npcs.<npc>.trader.last_refresh` | `refresh` | none known (INFERRED) |
| Market life | `p23_market_life` | trade commit | strict `normalizeMarketLife` |
| Items bought | `item_log` | `recordAcquisitions` | log |
| Traveler purses and requests | `generated_people.people[].possessions`, `.storyRequests` | story_requests.js | `validateStoryRequests` |
| Inheritance | `expansion.chronicle.life.experience.inheritance` | heir_inheritance.js | chronicle validator |
| Kit debt | `village_career` | main.js:3434-3452 | career validator |

### B5. Architecture constraints (STATED, docs/ARCHITECTURE_RULES.md)

- AR1: main.js is a composition root; an economy feature adds at most one registration line each to main.js, save_files.js, display.js. Every proposal above must land through `registerDomain` (AR2) with its own slice (AR6). Money and market are not registered yet; the first step of any larger change is a read-only domain with a `projection`.
- AR3: one authority per fact. Quote -> `stageNativeTrade` -> `persistExpansion` is the single money path; do not add a second timer, save writer or transaction owner. Purse refill ticks off the existing daily tick.
- AR5: nothing imports main.js; trade.js currently does (trade.js:9, `commitNativeTrade, get_context, previewP23MarketPurchase`), an existing baseline cycle (SHOWN), so new economy modules must not add to it.
- AR6: a missing key means an older save and loads untouched with defaults; unlimited purse (null) and zero known wealth follow this.
- AR7: quote, then revalidate before mutating (already implemented at trade.js:94-106 and native_trade_transaction.js:9). New terms (purse, buyback price, rules) must be in the fingerprint.
- AR9: structural moves (e.g. wrapping the 14 money writers, moving trade.js state out of main) are separate rounds from behavior changes, proven on a rebuilt bundle with save, reload, export and import.
- AR10: a pure module with unit tests is "engine ready", not integrated; each proposal needs a rebuilt-browser journey.
- AR12: world variety stays in the domain; currency kinds and frictions are world data (L17), the shared layer only does custody and transactions.

## Part C. Contradictions and gaps (docs against code, and doc against doc)

| Code | Finding | Evidence | Status |
|---|---|---|---|
| E1-X1 | ECC25 says "No feature writes `character.money` directly." Code has at least 12 direct write sites. | grep list in B1: main.js:1902, 2194, 3434, 3448, 3549, 4081, 5942, 6835, 8896, 9714, 9764; expansion_persistence.js:16; generated_people_ui.js:30; heir_inheritance.js:83; mixture_native.js:58; story_requests.js:63. Several bypass `persistExpansion` (detached envelope clones are the save-time ones; main.js:3549 and 4081 apply earnings live). | SHOWN. ECC25 is a target, not a fact; needs an ECX correction or a wrap step. |
| E1-X2 | M3 says a universal buyer pays "a modest fixed fraction" and a specialist pays more. Code has no buy fraction: every trader buys every item at 100 percent of base value times the saturation modifier; prices are limited only by margin on the buy side. | trade.js:325-401 (sell side passes no price_multiplier), items.js:260-313; no accept-list in trade.js or native_trade_transaction.js. | SHOWN. L2 would lower today's sale income; the default universal fraction is not 1.0 in the doc but is 1.0 in code. |
| E1-X3 | M9 says sold goods "sit in the vendor's stock ... It never disappears into a void." The trader refresh empties stock and refills from the template, retaining only conserved campaign keys. | trader_component.js:78-93 vs REQUESTS_AND_MARKETS.md:529-537. | SHOWN. Sold goods are lost to the player at the next refresh (and to everyone, as stock is regenerated). L9 must add retention. |
| E1-X4 | M1/M7 correction vs AD27 text: AD27 still reads "Shared currencies come through means or cheats", while the 2026-10-18 M7 correction says universal currencies exist wherever an issuer spans worlds and locality is a default, not a wall. RULES_INDEX was not touched. | RULES_INDEX.md:155 vs REQUESTS_AND_MARKETS.md:504-509. | SHOWN. Weibao's 2026-10-18 correction is not reflected in the AD27 line; reconcile the line to "local by default; shared currencies via an issuer or network, or through means/cheats". Needs his sign-off since AD27 is accepted text. |
| E1-X5 | L16/N2 and the quote contract include `currencyRef`, but no currency concept exists in code except the receipt key 'wood' for `kind:'coin'` deltas and a clerk `PURSE` resource. `character.money` is the only player currency. | story_requests.js:71, backlog_expansion_replacement.js:14. | SHOWN. 'wood' as a coin key is unexplained (INFERRED: a placeholder for the base coin; check before naming currency ids). |
| E1-X6 | Docs treat merchant purse as new (L7), but NPC purses already exist for generated travelers, with escrowed fees, and the village traveler request pays from them. Only trader purses are missing. | generated_people.js:29, :45; story_requests.js:55-62. | SHOWN. L7 should copy the generated-people shape and validator, not invent a new one. |
| E1-X7 | Carryover (M12, M27, L27-L29) is described as unbuilt, but money inheritance, `debtsPaid` and obligations already run in the chronicle. | heir_inheritance.js:83; chronicle.js:27-30, :294-305; PROJECT.md heir lines (inheritance record). | SHOWN. M27 exchange rates should build on `inheritance.money` instead of a new carrier. |
| E1-X8 | Lender-style debt already exists: a 50-coin kit debt, no second loan until paid. L20 and M18 describe "one lender" as new. | main.js:3448-3451; PROJECT.md:1187-1189. | SHOWN. L20 can extend the village-career debt shape. |
| E1-X9 | N2's cited lines (trader_component.js:69-98, 113-125, 141-145; market_saturation.js:76-105, 159-176) are stale by a few lines in the working tree (refresh is :73, margin :150). | trader_component.js:73, 150. | SHOWN, minor. Re-cite before any lane brief leans on them. |
| E1-X10 | SSD58 maps "Trade, shopkeeping" to `src/exchange.js`. That file is the exchange-clerk parcel/loan simulation (gauge, template, loan custody), not trade; trade is trade.js, native_trade_transaction.js and market_saturation.js. | src/exchange.js:1-20 imports `EXCHANGE_CLERK, EXCHANGE_LOAN`; SUBSYSTEM_SCOPE_LADDERS:176. | SHOWN. Wrong pointer in a ladder row. |
| E1-X11 | Two cap choices by key prefix are duplicated. `get_total_tier_saturation` picks `equipment_capped_at` for `type_` keys (market_saturation.js:196); trade.js repeats the same test twice (lines 390 and 442). A per-good cap (L1) must change all three or quotes drift from the committed prices. | market_saturation.js:196 (and :263); trade.js:390 and :442. | SHOWN. |
| E1-X12 | Prefix collisions in economy docs: EC1-EC5 (MULTIVERSE_STRUCTURES OD11) and EC1-EC5 (cr4/ECONOMY.md); MR1-MR36 (MAKING_RULES) and MR11 (production chains); ECC (root palette) vs EC. Cite with the doc name until one is renamed. | MULTIVERSE_STRUCTURES.md:158-179; cr4/ECONOMY.md:5; MODULAR_PRODUCTION_CHAINS:295. | SHOWN. |
| E1-X13 | The root palette links docs/audits/ECONOMY_CORE_AUDIT.md, which does not exist yet; the ECC owner table (:11-27) omits P21 ECONOMY_STORIES, CR4 ECONOMY, SECRETS_AS_CURRENCY, HOME (H5), the Paradise hub economy and the implemented P09 market-life layer. | ls docs/audits; ECONOMY_AND_TRADE_CONSIDERATIONS:11-27. | SHOWN. Add to the owner table when the root folds lanes in. |
| E1-X14 | Money validation is weak: `save_files.js:155` only checks a number, while `persistExpansionPlan` rejects non-finite or negative values. A hand-edited save with fractional, negative or huge money loads; `stageNativeTrade` rejects above MAX_SAFE_INTEGER (line 12) at the next trade. L11 (large-number plan) is consistent with this limit. | save_files.js:155; expansion_persistence.js:15; native_trade_transaction.js:12-15. | SHOWN for the code lines; the effect on load is INFERRED. AD22 allows only save integrity hardening, so a stricter validator fits. |
| E1-X15 | No rule code covers shop/price UI (UR), and the router row lists only five codes. A trade-screen change currently has no UR rule beyond general panel rules. | UI_RULES grep; RULES_INDEX:80. | SHOWN. |

## Findings recap (for the root)

1. Missed owners: P21 ECONOMY_STORIES, CR4 ECONOMY, SECRETS_AS_CURRENCY (AK1-AK2), Paradise hub economy, nonhuman society economy, H5 home owner for AD31, P09 market-life (implemented), inheritance code.
2. Money has no single authority: 14+ direct writers of `character.money`; ECC25 should be reframed as a goal.
3. Docs call L7 purse and L20 lender new, but traveler purses, escrow and a 50-coin kit debt already exist.
4. Code sells at 100 percent of base value to every trader (universal buyer, no fraction); L2 reduces current income.
5. Trader refresh deletes sold goods, contradicting M9 and blocking L9 until retention is added.
6. AD27 text lags Weibao's 2026-10-18 M7 correction.
7. Saturation cap is chosen in three places by key prefix; fix before L1.
8. Cheapest order: L12 inspector, wrap money writers, L1 and L2 (content only), L9, L7, L8, L25, L14 last.

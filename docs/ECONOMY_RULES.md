# Economy rules

**Proposal, 2026-10-18. Not accepted until Weibao says so (AD32).** Drafted for
every agent that designs or builds money, prices, merchants, trade, currencies,
credit, property, wealth and carryover of wealth. Weibao, 2026-10-18: "we might
want a core rules audit for rules accordingly", after five rounds in the
[markets palette](gm/dispatch/procgen-2026-10-13/p11/REQUESTS_AND_MARKETS.md).

Each rule names the mistake it prevents. Rules marked **(accepted)** restate an
existing accepted decision and bind now through it; the rest are proposals.
Sources: AD lines in the [rules index](RULES_INDEX.md), the markets palette
(N, M, A codes), [OD11 EC1–EC5](worlds/MULTIVERSE_STRUCTURES.md#od11-local-economies-and-cross-world-value-2026-10-15)
and the [economy palette](ECONOMY_AND_TRADE_CONSIDERATIONS_2026-10-18.md) (ECC).
Every rule is a default; a world may state an exception with an in-world reason
and cost (AD5).

## Markets and prices

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| ECR1 | **Economies are local; trade and arbitrage are intended (accepted, AD27).** Cross-world value moves through means, carriers or cheats. (EC1, M16) | Prices normalized across worlds, or arbitrage treated as an exploit |
| ECR2 | **Selling to a local merchant is the default sink.** Transit, route risk and supply chains are added only where a world or player moves goods between markets. (M1) | A logistics simulation required before anything can be sold |
| ECR3 | **Price response is a per-good, per-place curve with a stated reason:** flat for fast-cycling staples, falling for durables, rising with reputation or trend, shifting for dated events. (M2) | One downward saturation curve for every good |
| ECR4 | **One reconciled quote formula** carries every price input; nothing stacks a new factor beside it. (N2, A9) | Saturation, haggling and scarcity multiplying into nonsense |
| ECR5 | **A price movement shows its cause** as the player knows it. (M5.4) | Unexplained decay that reads as a penalty |
| ECR6 | **Prices follow a reference basket per world** (meal, lodging, day's wage, basic tool). Exchange rates belong to each merchant or changer with a spread; comparing baskets only gives a designer's starting point. (ECC2, ECC3, ECX6) | Prices invented item by item, or one global rate that canon contradicts |

## Buyers and channels

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| ECR7 | **Several channels can offer real choices:** convenience buyers, specialists, volume buyers, services, consignment and standing orders. Which wins follows local mechanisms; dominant means remain possible (AD28, AD38). (M3, M4, M10, M5.2) | Identical channels with no useful distinction, or forced balance overriding world law |
| ECR8 | **Buying and selling stay asymmetric by default,** so a full purse does not replace gathering and making. Worlds such as System shops may loosen this, and making then earns its place through quality and custom work. (M6) | Crafting made pointless by a shop that sells everything at fair prices |
| ECR9 | **Merchants price from what they can judge or believe.** Knowingly valuing a hidden property needs appraisal; bundle pricing, speculation and mistakes remain possible. A quote does not certify hidden truth. (N2, A7, AD6–AD9) | Prices leaking sealed truth or merchants acting omniscient |
| ECR10 | **Selling never destroys an item silently.** Sold goods enter the buyer's stock and can be bought back, and unique or quest items ask first and stay recoverable. Today a trader refresh deletes sold goods, so retention comes first. (M9, ECX3) | One misclick permanently losing a story item |
| ECR11 | **Repetitive selling can be automated** with rules that skip equipped, locked, quest and unique items and log their runs. (M8, A11) | An idle game with a manual-sale chore |
| ECR32 | **A merchant who can't buy says why** and names the alternatives (come back, consign, sell elsewhere). Purse state is shown as far as the player knows it. (ECC27) | Hidden caps that feel like bugs |

## Money and currencies

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| ECR12 | **Money is whatever a world treats as money:** coin, commodity, power-bearing, institutional credit, System currency, social or metaphysical. Each states where its value comes from, and that decides whether it travels. (M13) | Every world defaulting to gold coins |
| ECR13 | **Universal currencies exist where an issuer or network spans worlds;** carried valuables keep value wherever the destination values them. (M7 correction, M16) | Treating locality as a wall |
| ECR14 | **Value depends on recognition, usability and access.** An item's price changes when a world learns what it is and whether its mechanism works there. (M14, AD38) | A mana crystal priced the same in a world with no way to use it |
| ECR15 | **Every monetary creation/destruction has a cause; transfers settle actual currency and custody once.** Intended money engines, asymmetric valuation and arbitrage remain allowed. This is accounting, not a universal conservation law for economic value. (ECC4, N5, AD22, AD27) | Coin/items duplicated or lost through publication; profitable trade mistaken for a bug |
| ECR16 | **One money authority:** one purse per currency and transactions through one seam. Use exact units appropriate to that currency and a plan for very large values. (ECC25, ECX1, A10, A15, A18; a target: 14+ direct writes exist today) | Features writing money directly, rounding loss and overflow in long idle runs |
| ECR33 | **Each currency states its time horizon** (now, this life, next life), and each reset states what happens to every horizon. (ECC29, ECC21) | A prestige reset silently deleting an economy |

## Wealth, exposure and safety

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| ECR17 | **Wealth is information first.** Someone has to see or hear of it, the knowledge spreads within a scope and at a rate, and belief can differ from truth. (M25, SR) | Automatic theft rolls on carried gold |
| ECR18 | **Known wealth has many responses,** and theft needs an agent with motive, means and opportunity. A safe world can have none. (M25, M19 correction) | Thieves as a universal tax on success |
| ECR19 | **Losses move goods to a recorded destination** (thief, fence, lender, collector), and offline losses always appear in the recap. (A20, A8) | Silent drains while the player is away |

## Institutions, credit and law

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| ECR20 | **Institutions are world data, and absence is valid.** Taxes, tolls, banks, guilds and changers exist where a world's society made them. (M26, M20 correction) | Every world getting a tax collector |
| ECR21 | **Credit has dated terms and forgiving defaults.** Missing a payment has in-world consequences, never a hidden game over. (M18, AD19) | Debt as an unannounced fail state |
| ECR22 | **A promise binds through its enforcer:** handshake, contract, guild, oath or System. With no enforcer, reputation is the only one. (ECC15, AD14) | Contracts that enforce themselves with no in-world agent |
| ECR23 | **Fraud and counterfeits write wrong beliefs, not wrong truth** (AD7). Appraisal and experience defend. (ECC16) | Scams implemented as hidden stat changes |

## Property and work

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| ECR24 | **Owned things may give passive bonuses (accepted, AD31).** Ownership, custody and use stay separate, and property has upkeep and income. (ECC5, ECC6) | A deed acting as if you were standing in the house |
| ECR25 | **Property and wealth left in a world stay in that world** (AD4), changed only for dated reasons. (ECC7, M27) | A returning player finding their house reset or deleted |
| ECR26 | **Every world with money has an honest baseline income** tied to its basket, and other ways of earning compete with it. (ECC8) | A world where crafting is the only way to afford anything |

## Carryover and progression

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| ECR27 | **Wealth crosses a life or world only through a carrier (accepted, AD11),** at the carrier's own valuation, with modest carryover by default and better carryover earned. (M27, continuation owner) | Free full carryover, or none at all |
| ECR28 | **Before an ending, the player sees what is likely to carry** as far as they know it; after it, the new start names what came from the old life. (M28, SC4) | Endings that feel like deletion |
| ECR29 | **Cross-save legacy starts are labelled settings,** read only an export and never touch the source save. (M27, A26, AGENTS safety) | A meta feature that corrupts or reads private saves |

## Balance and fun

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| ECR30 | **Grow the sinks, don't throttle income.** Each scale of wealth opens new things worth buying, a broken money engine is a payoff, and pushback comes from in-world agents with reasons (AD22, AD38). (M5, M24, ECC20) | Nerfs and invisible caps instead of new play |
| ECR31 | **The economy is optional to living.** A character can thrive without commerce, and economic depth is chosen per world and activity (CX1–CX8). (ECC1) | A life sim that requires running a business |

## Cross-audit application, 2026-10-18

ECR7's "none wins in every case" describes a useful ordinary design, not forced
balance: a world or exceptional means may produce a dominant channel (AD28,
AD38). ECR9 means merchants cannot knowingly price a hidden property without
appraisal; they may still pay for a bundle, rumor, option or mistaken belief.
A high quote alone does not certify the hidden truth (AD6–AD9, MR31).

ECR15 conserves transferred money/goods through one owner; creation, destruction
or conversion follows the actual mechanism and its source/sink, not a universal
ban on profitable or free outcomes (AD22/AD27). ECR16 integer units belong to
currencies whose divisibility supports them, not a forced coin model for every
metaphysical currency. Deferred sales/services settle spent versus reserved
value on interrupt (AR7); current atomic trades need no staged-job conversion.
Refresh/expiry uses the market's owning clock, and an away stop must not reveal
a merchant's hidden appraisal or purse (AR8). Proposed mechanisms retain their
status. See [G26–G30](reviews/SUBTLE_RULE_GAPS_2026-10-18.md#round-4-latest-audits-together-2026-10-18).

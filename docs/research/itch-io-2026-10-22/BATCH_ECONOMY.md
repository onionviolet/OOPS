# BATCH_ECONOMY: trade, faith and institutions (itch.io, 2026-10-22)

Genre lane: merchant and trade sims, shops and credit, guilds and taxes, gods
and churches, small-scale politics. Static reads only (brief:
[DECODE_BRIEF](DECODE_BRIEF.md)). Everything here is a proposal (AD32). Raw
notes, hashes and line locators: `private/economy-*/` (gitignored).

Screened from itch tag pages (trading, merchant, shopkeeper, kingdom, politics,
god-game, religion, economy; web builds): about 150 titles listed, 30 judged on
page text, 8 opened. Most of `trading` is stock-market toys and most of
`religion` is interactive fiction, so the useful yield is small and
concentrated.

Dedupe: no title here appears in earlier batches (checked against the screen and
`BATCH_*.md`; Trader Life, God of Ashes, Waterworks and Marketfield were skipped
because earlier batches own them). Repo coverage: `ECONOMY_AND_TRADE_CONSIDERATIONS`
and DOMAIN_RULES ECR17-ECR23 already state the policy (institutions are world
data, credit has dated terms, fraud writes wrong beliefs). `src` has no
mechanism for faction tiers with rivals, bills of exchange, insurance, rumour
trust, agent-held market memory or scheduled consequences (grep of `src` found
none). Those are the gaps below.

## Decoded

### E1: The Debt Ledger (NEXT (HARD) STEP)

- Build: html-classic 19049613, plain multi-file JS (about 300 KB, Russian
  developer comments), 20-50 minute runs. No license stated (ideas only).
- Systems (source):
  - **E1-a Price knowledge is a record of where you stood.** The chart holds
    only observed days. The game also logs every market every day in a hidden
    ledger, and a wandering trader or a desert nomad sells you a good's history
    for a fee, which merges the true record into your chart. Information is a
    bought, true, dated thing, not a rumour roll. Owner: ECR17, AD7.
  - **E1-b Rumours carry a trust flag set by the dice.** A rumour is either
    drawn from a real price skew or invented at a configured lie rate; one
    difficulty shows the flag, others do not. Owner: ECR23.
  - **E1-c An institution with a ratchet.** The merchants' guild issues duties
    you cannot decline. Failing one pays a fine into the debt, raises the
    creditor's daily rate for the rest of the run, and drops that good's sale
    price for five days. The developer's comment says the first version only hit
    one good and players dodged it by not trading that good, so the penalty was
    moved to the one lever nobody can avoid. Owner: ECR21 (dated terms), AD19.
  - **E1-d A customs official prices by how much you need the cargo.** Bribe
    multiplier is 0.8 on free cargo, 1.2 on cargo committed to a contract, 1.5
    on cargo committed to a guild duty. If you lack cash the bribe goes onto the
    debt. Owner: ECR20, AD38.
  - **E1-e Market impact with explicit exploits closed.** Volume moves price
    with a free band, a slope, and a clamp (1.7 up, 0.55 down); comments record
    each hole found by playtest (split sales to dodge impact, cheap local buy
    plus delivery to a waiting contract). Buying where a contract waits costs at
    least 115 percent of the contract unit pay. Owner: ECR15, AD27.
  - **E1-f Counterfeits bought at a discount.** Elite goods carry a fake chance
    that rises as the quoted price falls under base; an appraiser fee finds fakes
    in the unchecked lots; fakes are sold on at 8 percent. Owner: ECR23.
  - **E1-g Revisions.** Fixed days check debt against a limit; the game warns
    three days ahead and computes the cash needed with interest. Owner: ECR21.
- Representations: scrolling news line that tags rumours trusted/doubted;
  balance chart as one point per day; difficulty changes pay multiplier as well
  as pressure.
- Improvements the comments explain: gold contracts once per good per run (a
  fallback to repeat goods caused double golds); "Batch" buys 75 percent of the
  max so one click cannot flood the hold.
- Worth playing? Yes, 25 minutes. Confirm: do the bought price histories
  (E1-a) change which route you take, or are they a tax on a solved game.

### E2: Silver Way (oguzyasinbas)

- Build: itch html 18642709, Godot 4.6.2 web (22 MB pack, 36 scripts decoded,
  0 errors, JSON data plain). Turkish source strings with translations. No
  license stated.
- Systems (source):
  - **E2-a Factions are tiered cost levers with rivals.** Five standings
    (merchants' guild, court, bankers, road brotherhood, steppe lords), each
    from -100 to 100 with tiers at -60/-20/20/60. Each tier is a row in a
    table of multipliers on concrete costs: guild pay and warehouse rent,
    court road tax and license price (plus edict warning days at high tiers),
    bankers' interest, credit limit and bill premium, brotherhood road danger
    and crew wage, steppe toll and bandit chance. Every faction names a rival,
    and a shift moves the rival by -0.6 of the amount (`RIVAL_BACKLASH`).
    Owner: Reputation and institutions; ECR20; no `src` equivalent.
  - **E2-b Reputation moves by named deeds, not a score.** A table maps
    sixteen deeds to shifts, so one act can pay two factions: smuggling is -5
    court, +4 steppe; paying bandits is +3 steppe, -2 brotherhood; beating
    bandits is the reverse; defaulting costs bankers 6; tax dodged is -4 court,
    +3 steppe. Owner: ECR22.
  - **E2-c Licensed goods.** Six goods need a purchased license; carrying one
    without it risks seizure (stated in the license text; the seizure path was
    not traced). Owner: ECR20.
  - **E2-d Bills of exchange.** Pay 1 percent to deposit cash in one city and
    redeem in another at a premium of 0.035 percent per km, capped at 15
    percent, scaled by the bankers' tier. Redeeming at home returns the face
    value. Owner: ECR12 (institutional credit).
  - **E2-e Cargo insurance priced by route danger.** Rate is 5 percent times
    (1 + 8 x route danger x world-event multiplier), pays 75 percent of lost
    value, one policy at a time.
  - **E2-f Forward contracts.** A 0.82 price for delivery in 30 or 60 days.
  - **E2-g Hired agents hold market memory.** An agent in a visited city costs
    400 up front and 3 a day, refreshes that city's prices daily, and the
    price table marks entries stale after 20 days. Quit if you cannot pay the
    wage. This makes "what you know" a payroll. Owner: ECR17.
  - **E2-h Donations buy local discounts and reputation** (fountain 1 percent,
    bridge 2, school 3, priced 1.5k/4k/10k).
  - **E2-i Local stock economy.** Per-city production and consumption with an
    equilibrium stock, price from stock, seasons, and events that multiply
    production (drought, locusts, mine collapse, new copper vein) with 18-40
    day durations and a printed news line. Matches AD27. Owner: AD27.
- Representations: wealth titles (peddler to trade lord) separate from guild
  ranks (stranger to guildmaster); a faction overview sorted by standing.
- Worth playing? Yes, 30 minutes. Confirm: whether the 0.6 rival backlash makes
  the five factions a real trade-off or one dominant strategy.

### E3: Dash Realms (demo) (Dash Lamperough)

- Build: html-classic 19578406, Vite bundle with Three.js (1.3 MB, formatted
  only). Demo; license unstated.
- Systems (source):
  - **E3-a You cannot command, only price.** Heroes choose bounties by reward
    x (0.4 + 1.2 x greed) / (1 + distance/55); attack bounties are scaled by
    the hero's power versus the target's power (below 0.55 they decline, and
    each other claimant raises their confidence by 45 percent); party members
    double the pull; a named rival hero raises it 1.4x; gold in hand lowers
    appetite by 0.04 per coin; rogues like exploration bounties; the threshold
    is 32. A flag can be taken by several heroes, so one bounty is a crowd
    decision. Owner: companions and household autonomy; no `src` equivalent.
  - **E3-b Closed gold loop.** Heroes earn from monsters, bounties and
    treasure, spend in your shops, and tax collectors (walking units that can
    be killed with the gold they carry) bring tax to the palace. Owner: ECR26.
  - **E3-c Heroes leave when morale is low** ("I have had enough of this
    realm") and walk away from the palace.
  - **E3-d Eight guilds, each producing one class; personality draws four
    traits plus piety.** Guild is the institution that spawns people.
- Worth playing? Maybe. Confirm: is the bounty-pricing feel (E3-a) readable to
  the player, i.e. can you predict who takes the flag.

### E4: Fivefold Crown (Aygun)

- Build: html-classic 19580606, Phaser bundle (1.9 MB, formatted), Turkish and
  English event text. Roguelite card choices. License unstated.
- Systems (source):
  - **E4-a Scheduled consequences.** A choice can schedule an event with a
    minimum and maximum delay. From the minimum turn, the event's weight ramps
    from 1 to 3 across the window, so a promise matures stochastically instead
    of on a timer. Owner: DEEP_WORLD_WORKFLOW; ECR21.
  - **E4-b Event eligibility from flags and how old they are.** Events require
    flags and become eligible N turns after the flag was set; a recent-tags
    penalty stops three of one kind in a row; state relevance weights an event
    by how extreme the relevant stats or relations are. Arcs add a stage lock.
  - **E4-c Neighbors act without you.** Each pair of kingdoms stores trade,
    cooperation, war and a `favorOwed` flag naming who owes whom. A world
    director picks AI-versus-AI actions weighted by relation, treaties lapse
    when stale, war has cooldowns, and the world log records significance.
    Owner: Reputation; world history (AD4). Strongest match to "institutions
    with their own goals and memory".
- Worth playing? Yes, 20 minutes. Confirm: do the delayed events feel
  authored-as-consequence of the choice, or random.

## Attempted, not read

| Code | Game | Result | Check in play |
| --- | --- | --- | --- |
| E5 | [DOGMA++](https://vmtbits.itch.io/dogma) | Build redirects to `modestus.name` login and register server (multiplayer). Accounts are out of bounds. Page claims: 14 opposing powers that cancel, followers abandon on mismatch, holy wars between temples (stated-not-found). | Whether powers that cancel create real belief trade-offs. |
| E6 | [GOD Inc.](https://soupsarah.itch.io/god-inc) | Godot 4.7 pack format 4; the shared `extract_pck.py` only supports format 3, so unread. Page: win converts on hex planets, rival god's non-believers. | Whether conversion is a flow or a flat count. |
| E7 | [GOD HELP ME](https://inheogames.itch.io/god-help-me) | Unity with PlayMaker; typetrees stripped, content not recoverable by strings. Page: prayers where you see sins, reputation as wise/forgotten/worse. | Whether refusal has lasting social consequence. |
| E8 | [Levers of Democracy](https://phil42.itch.io/levers-of-democracy) | Unity WebGL, not opened. Page: three voting systems, 28 cultural traits, procedural newspapers. | Whether policies act through district traits. |

## Screened by page text only (not decoded)

Worth a look if the above pays off: [Ea-Nasir's Shop](https://paulrb.itch.io/ea-nasir-shop-game)
(haggling by customer personality, three interactions per customer, Unity),
[The Gods are Hungry](https://jamespatton.itch.io/the-gods-are-hungry) (work
versus prayer against disasters; page lists no web build), [Burgher 1400](https://marktundmacht.itch.io/burgher-1400)
(medieval economy and power, paid), [Duke to King](https://boatboat-games.itch.io/duke-to-king),
[The Parish](https://tortoisesimon.itch.io/the-parish) (vicar week, hidden
choices), [Socratic Democracy](https://pedrorns.itch.io/democracia-socratica),
[Bulk Trader 1990](https://trading-game-maker.itch.io/bulk-trader), [Royal Merchant](https://badim.itch.io/merchant),
[Sugar, Tea and Rum](https://cherrybrackets.itch.io/sugar-tea-and-rum),
[Store Galore](https://munro.itch.io/store-galore), [Pax Astra](https://ben-cardino.itch.io/paxastra),
[Minor Reign](https://olisdoom.itch.io/minor-reign), [Odd Merchant](https://toulou.itch.io/odd-merchant),
[Shop Around](https://voidgazerbon.itch.io/shop-around), [A Merchants Balance](https://rugnirviking.itch.io/a-merchants-balance).
Passed over as stock-market toys or thin: Paper Market, Margin Calls, Kabutocho,
Trade Empire, Star Ledger, Bear and Bull and similar.

## YAIR mapping

| Code | Proposal | Owner | In `src`? |
| --- | --- | --- | --- |
| E2-a/b | Faction ledger: standing -100..100, five tiers that multiply named costs, rival backlash, deed table where one act pays two groups. World data per ECR20. | ECR20, ECR22, AD27 | No faction tier code found (`src` has per-world standing in `book_world_*` only). |
| E1-c | Institution ratchet: a failed obligation raises a standing rate for the run, in-world dated, never a hidden fail state. | ECR21, AD19 | No. |
| E1-a, E2-g | Price knowledge as a purchased, dated, true record; agents on payroll refresh a city's memory and entries go stale. | ECR17 | No `marketMemory`. |
| E2-d/e/f | Bills, insurance and forwards as three small financial instruments scaled by a banker standing. | ECR12 | No. |
| E4-a/c | Scheduled consequences with a weight ramp; pair state with `favorOwed`; AI actions among institutions when the player is away. | AD4, ECR21 | No scheduler found. |
| E3-a | Autonomous people choose among posted prices (bounty crowd choice), so the only lever is money. | Household and companion autonomy | Not as a pricing model. |
| E1-d | Official prices by dependency of the cargo. | ECR20, AD38 | No. |

## Top findings

1. **Faction tiers with rivals and a deed table (E2-a/b).** Smallest design that
   gives institutions memory and a cost to every alliance, and it is data, not
   code per world.
2. **Failed obligations ratchet a standing rate (E1-c).** The developer found
   that penalizing one good was easy to dodge; the fix targets the unavoidable
   lever.
3. **Scheduled consequences with a rising weight, plus neighbor pair state
   with `favorOwed` (E4).** Cheap to build, fits the chronicle.
4. **Knowledge as a payroll and a purchase (E1-a, E2-g).** Agents refresh a
   city's memory; entries go stale; histories can be bought.
5. **Bills, insurance, forwards (E2-d/e/f).** Three instruments whose prices
   come from distance and route danger, not from a menu.

## Verification

Read: Debt Ledger `economy.js`, `contracts.js` in full, `world.js` and
`data.js` at the cited ranges, Silver Way `data/*.json` (factions, licenses,
donations, titles, events), decoded `factions.gd`, `finance.gd`, `intel.gd`,
and constants in `economy.gd`; Dash Realms hero, bounty and tax-collector
code; Fivefold Crown event, diplomacy and world-director code (formatted
bundles). Not read: GOD Inc., GOD HELP ME, Levers (engine-compiled or format
unsupported), DOGMA++ (server login), Ea-Nasir (Unity, not fetched), the
license seizure path in Silver Way, Dash Realms shop spending, and
full-game play. No game code was executed. Tools: curl for 8 itch pages and
CDN files at 1-5 s spacing (no 429), `esbuild` as formatter, the shared
`extract_pck.py` (wrapped with an 8-byte trailer for a standalone pack) and
`decode_gdc.py`, UnityPy open on one data file. About 55 tool calls. Nothing
committed.

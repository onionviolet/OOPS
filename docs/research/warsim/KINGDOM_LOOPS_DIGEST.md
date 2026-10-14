# Kingdom loops: intended rules versus flavor

These are read-only static findings. Binary offsets refer to `Warsim.exe` file
bytes, not loaded virtual addresses. Strings prove embedded menu/report text;
exact arithmetic, reachability and current bugs need resolver inspection.

| ID / loop | SHOWN menus or data | Mechanically meaningful number or gate | Flavor and limit |
|---|---|---|---|
| L1 Economy | Wages at `0x00ce22f0`; harvest upgrades `0x00d1c258`; road upgrades `0x00d1c660`; longer harvest `0x00d16a68` | Menus specify soldier wages 1-5 and knight wages 3-15 per unit per year; road and tool income bonuses; longer-work policy | Voice of the scribe is presentation; wage effects and modifier order not traced |
| L2 Productive force | Recruitment description `0x00cd9958`; harvest report `0x00f69ef8`; exhaustion report `0x00f15a90` | Peasants contribute to fighting and harvest; prolonged work advertises losses | Current casualty-to-harvest formula unknown; historical developer account in SOURCES.md supplies context |
| L3 Army | Native `BattlePrep`, `BattleSim`, `BattleDamage`, `BattleTroopReturn`, `BattleEvents`; core race table troop scores | Unit count, tier score and actual casualties are intended state; preparation and return are separate helpers | No exact formula or guaranteed score-ratio victory asserted |
| L4 Trade | Trade post requirement `0x00cf3cf8`; route formation `0x00cf4210`; termination `0x00cf52b0` | Trade infrastructure gates a route, route can be ended | Route is not evidence of simulated commodity supply/demand |
| L5 Vassals | Tribute tiers `0x00cfd0b0` onward; tribute-free relation gain `0x00cd4f98`; revolt warning `0x00cd5eb0` | Menu offers 20-80 percent tribute levels; extractive policy and revolt are connected by report text | Exact revolt threshold, timing and income base unread |
| L6 Diplomacy | `DiplomacyRelation`, `IndieDiplo`, `GenerateRelations`; diplomat skill text `0x00ce7388`; annex gate `0x00cfcf78` | Embedded text specifies skill-related safety/success changes and a 10x military-score annex requirement | Intended thresholds only; no claim one opinion score determines every deal |
| L7 Arena | Bet menus `0x00d6f888`, `0x00d70f30`; subsidy `0x00d13f00`; closed/fight-count gates `0x00d6f7e0`, `0x00d6f8b0` | Ordinary fight menu advertises 1.5x bet, champion menu double; subsidy costs 1,000 per year and raises max bet | Gross versus net payout interpretation and all resolver branches unread; no present exploit claim |
| L8 Events | `RandomTurnEvent`, `TurnReport`, `RandomExploreEvent`, `ProcGenExplo`; visitor-limit text `0x00cd71b0` | Events can change annual income, troop size, bet limits or visitor counts; explicit visitor budget | Event weights and no-repeat rules unread; symbols do not prove a data-driven universal storylet engine |
| L9 Heroes | Hero-story selector, `ChampionHire`, `ChampionChallenge`, `RandChampHire` | Hero strength and hiring are distinct from biography text | Authored story is not demonstrated simulated origin or quest state |

**L10 INFERRED:** the intended turn loop combines policy and hiring choices,
conflict and local activity, then annual income, expenses, casualties and
reports. Exact execution order is OPEN. Kingdom scale changes the available
choices as well as the totals. A worker who is also a troop creates an
opportunity cost that a second independent combat counter would miss.

**L11 INFERRED:** shared identity makes local detours meaningful: a champion
has a name and strength, and a competition can produce a reputation or hiring
hook. Local side income also risks dominating the governing loop. Neither
observation warrants removing profitable play or enforcing a solo-player cap.
Let world rules, counterpart liquidity and stated difficulty settings govern it.

**L12 PROPOSAL:** YAIRPG should carry consequence receipts from a quoted
mobilization, wage or agreement into the known report. Show work displaced,
actual payment, casualties and returned workers. Test that the report reads
resolved state instead of calculating a second approximate answer.

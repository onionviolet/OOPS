# Daily-life gap table for the BE-seat Klein life (2026-11-03; source reading, not played; proposals under AD32)

Question: which loops of an ordinary day already run on native mechanisms in `src/`, and which are missing, for the BE seat (`beyonderTrack:false`, `book.lead.be@1`, canon run). Context: [Round 3 and the day-of-life probe](DEPTH_DIAL_PROPOSAL.md), [backlog](MECHANISM_BACKLOG.md), [B1 receipt](B1_IMPLEMENTATION_RECEIPT.md), LSD209/LSD217 in the lead-life systems design. Evidence class: source and pack reading plus the earlier agent-played probe. I did not step a day in this session (the pinned KJ3E bundle was not exercised; no game MCP run), so every "works" below means "code and authored rows exist", not "seen running". Reading of the private cast pack is from `kj3k-ch23-2026-11-02/cast-before.json`.

## Why the canon run holds Klein, and why idle days produce nothing

- **The hold is one beat, not a freeze.** "restored (a coincidence carried the day to where you stood)" is the fate agent of the canon-pull beat `lotm.v1.pull.b1` ([canon_pull_host.js](../../../../src/canon_pull_host.js) lines 11-18). It fires when day 3 turns and Klein is away from his scheduled slot: the beat's own precondition is "present at the scheduled place", fate restores it (budget 1), and the sign is shown. The probe stepped from Day 2 16:21 across the day-3 boundary, so it hit exactly that beat. After it is done the hold is spent. No other pull beat exists today.
- **The day is made of authored acts, not routines.** In the BE seat the pack supplies 680 place acts (`householdActs.acts`), 82 `routines` (mostly other people's), 18 `worldHours`, 77 schedule slots (Klein's own slots are `recurrence:"once"` canon windows), and `bodyCare` acts that are one-shot per scene. Time passing between acts runs only the clock, the cast schedule and day-rollover reports ([book_world_lotm_cast_host.js](../../../../src/book_world_lotm_cast_host.js) `planLotmCastBeats`, [book_world_lotm_events.js](../../../../src/book_world_lotm_events.js) `settleLotmEvents`). No recurring row exists for Klein himself.
- **Canon-mode action gate.** `canonActionDecision` (cast_host line 435) checks every player action's resource/fact/item changes against the pack's reservation store when `runMode==='canon'`. A recurring income or bill therefore has to be a player-chosen act (checked against canon like any other) or an engine-owned event that does not pretend to be a canon claim; either way it must not change money on its own in a canon run, or KJ3K/kjw2 exact money figures (2760, 2744 pence) break.
- **CA2-CA5.** I found no rulebook with those codes for ordinary-life automation. The matches in `docs/` are cheat-library and comic-world presentation codes, unrelated. The nearest native owners are listed in the table below (ambient events and controllers in the simulation contracts, `living_upkeep.js` diets, `agreed_duty_*`, Tingen's `weeksOwed`). Treat "CA2-CA5 supply routines" as unconfirmed; the user's brief may mean a different doc.

## Table (works / partial / missing)

Locator column is the first chapter or window that needs the row, from the briefs and receipts I read; "unverified" means I did not find the chapter that first needs it.

| Loop | Status | Owner file (what exists) | Consumer locator / first need | Note |
| --- | --- | --- | --- | --- |
| Clock, waiting, walking, timed acts | **Works** | `clock_owner.js`, `simulation_clock.js`; cast host `nextCastBeatTime` (waits split at authored scene starts) | every window | Probe: walks and "wait until evening" run. |
| Scheduled people (where Benson, Melissa, others are) | **Works** | `cast_schedule.js`, `book_world_lotm_cast_days.js` (`lotmCastSchedule`) | ch1 onward | Canon slots only; background routines (82) mostly `usable:false`. |
| Money in the purse, exact prices, change | **Works** | native `money` resource; `money()` kit effect; place-act costs | KJ3K ch23 (cane, change); kjw2 ch24 P035 fares | One-shot spends. Verified by KJ3K script asserts (money after each act). |
| Buying at shops | **Works (as authored acts)** | pack place acts + `lotm_price_map.js`; exchange rows `defineCastExchanges` | ch23 cane; ch27 P021 market (kjw3) | Menus, no haggling mechanism needed for routine buys (LSD466). |
| Meals | **Partial** | `bodyCare` meal acts (authored per scene); shared household stock `household.opening.bread.portions`; `household_meal_items.js`; `living_upkeep.js` diets (living items, not Klein) | ch3 bread; ch29 P017 breakfast (kjw4) | Eating is an act that spends a stock; nothing makes Klein hungry or sets a meal time. Hunger is off by default (probe). |
| Household stock and bills | **Partial** | opening gas-meter act (`household_pay`, 1 penny, one fact) | ch2 P20 | A one-time fact, not a recurring bill. |
| Rent | **Missing** | none (no landlord person, no rent fact or event in pack or src) | unverified; Klein's flat is the opening setting | Not needed by ch24-29 content I read; no canon amount found in the briefs. |
| Job wage (Nighthawk contract, 2 pounds 10 soli + 10 soli weekly) | **Missing** | Tingen civil life has `weeksOwed` + `collect_pay` ([book_world_lotm_lives.js](../../../../src/book_world_lotm_lives.js)); the BE seat has no equivalent. KJ3F/KJ3G receipts: "no wage mechanism exists", terms recorded as knowledge, money unchanged | contract signed ch17 (KJ3F, fact `book.lotm.kj3f.contract.signed`); first payday chapter unverified | The only money-in loop the canon text promises. |
| Siblings and family | **Partial** | cast people Melissa and Benson exist; scene acts (`kj3c.greet_sister`, `dinner`, `kj3k.errand`); knowledge keys | ch5-6 onward; kjw3 ch26-27 | Presence and talk are authored per scene; no household obligation, chore or allowance loop. |
| Study/practice time | **Partial** | `kj3c.study` act; Seer chain B1 below floor (no pack row grants it) | ch32 P010 (B1) | |
| Weekly rhythm (day names, day off) | **Partial** | `clockClaims` (weekly-meeting 'T' proposed Monday 15:00), `dayoff.unchosen` fact (KJ3G) | ch24 P034 Monday withdrawal visit | Day names are text claims; no weekday clock in src consumed by Klein's life. |
| Monday gathering clock | **Missing** (for the BE seat) | `gathering_*.js` is resource gathering, not the Tarot meeting; remote-presence view exists (`place_remote_presence.js`); backlog R4/U2 | ch58 P018 (backlog R4) | Queued in the backlog; not a daily loop before ch58. |
| Nighthawk duty shifts | **Missing** | `agreed_duty_*` is a home-agreement system for another pack; `book_world_lotm_districts.js` shifts belong to Tingen probationer lives; KJ3G: "no standing-duty scheduler" | duties named ch19-20 (KJ3G); Slate order | Investigation as a duty routine (Round 3 F2) has no owner. |
| Idle day producing events (a "day of life") | **Missing** | engine has the pieces: ambient `events` with `interval`, `requires`, `effects` and `controllers` ([simulation_contracts.js](../../../../src/simulation_contracts.js) 154-160, 169-178; `simulation.js` `occur`); `living_upkeep.js` compiles meals/hunger into such rows | Round 3 F2 | Native route exists and is unused by any lead-life row. |
| Day-rollover reporting | **Works** | `book_world_lotm_events.js` `settleLotmEvents` | all | Reports news and witnessed beats only. |

## What the earliest unbuilt window needs

kjw2 (ch24 P034-ch26) and kjw3 (ch26-ch29) need only one-shot money, fares, purchases, scenes and talk; the briefs give exact pence and name no wage, rent or duty mechanism. They are content-only and are not blocked by anything below. The first row the Klein life needs that the engine does not carry and the book promises is the weekly wage (contract signed at ch17, money unchanged since). Rent and meal-time pressure are unsupported by any figure in the text I read.

## Proposed order (proposal, not accepted)

1. **Weekly wage for the BE seat** (this lane's phase 2): pull model like Tingen's `weeksOwed`, so a canon run does not change money unless the player collects.
2. Meals/hunger as an opt-in ambient row set, reusing `living_upkeep.js` `compileUpkeepEvents` for the lead.
3. Weekday clock fact for the lead (day names), then duty-shift routines.
4. Rent only when a figure or a scene needs it.

Open questions: the first payday chapter and amount per week beyond the contract terms; whether the user's "CA2-CA5" refers to a doc I did not find.

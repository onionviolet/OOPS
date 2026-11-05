# Progress atlas, 2026-11-04

Whole-project view built from live owners on 2026-11-04, master at `f15a37f90` with a heavily dirty shared checkout (other writers active). This is a map of existing evidence, not a tracker or completion score. Proposals here change no priority (AD32). Visual: rendered inline in the Claude session that made this file; panels match the sections below.

**Inspected:** PROJECT.md, master playability plan (outcome P1-P5, F1-F5), Klein campaign plan (KJ1-KJ8, B0-B7), mechanism backlog (B1-B12 board), HP whole-world plan (W1-W10), release reconciliation RP1-RP6, git merge state of the two mechanism branches, commit counts 2026-11-01 to 11-04. **Not inspected:** source code per system, cultivation/Frontier/Mistglass depth, UI rounds, ideas inventory, browser replay. Every status below is the owner's recorded evidence level, not a fresh run.

## Where things stand

Dimensions are independent: built in code, proven (agent-native run), integrated with other systems, delivered (reachable by a player on a normal install).

| Area | Built | Proven | Integrated | Delivered | Owner |
|---|---|---|---|---|---|
| Klein lead life, ch1 to ch69 P082 (KJ1-KJ3AE) | yes, 28 slices | native, agent-verified | uses B1-B6, B12 | private-pack delivery scope (AT6) | Klein plan, KJ3AE receipt |
| Klein KJ4-KJ8 (Backlund to ending) | no | n/a | n/a | n/a | Klein plan |
| LOTM mechanisms B1-B6, B12 | yes | partly (B1/B4/B5/B6 first native use in KJ3AA) | yes | as above | mechanism backlog |
| LOTM mechanisms B8 firearms (below floor), B10 cast energy, B11 persistent cast | partial | no | no | no | mechanism backlog |
| Harry lead life W1-W4 (cupboard to wand shop) | yes | agent-verified | partial | private packs | HP plan |
| Harry W5-W10 (train to end of year 1) | no | n/a | n/a | n/a | HP plan |
| Combat/health | L2b fixture at floor | fixture scope | below floor beyond fixture | unknown | L2b receipt |
| Ordinary player starts and second lives (B5-B7) | no | n/a | n/a | deferred by direction | Klein plan, WER owner |
| Cultivation, HP school/trade, Village, Frontier, Mistglass | earlier slices | earlier receipts (F1-F4) | partial | last app adoption Luminous Gothic | master plan |
| Release | committed, CI-equivalent full suite pass | yes | n/a | installed app not rechecked | release reconciliation |

## Gaps and findings

| ID | Finding | Kind | Consequence | Next check or action |
|---|---|---|---|---|
| AT1 | Fixed 2026-11-05: mechanism backlog said B2/B3 and B4/B5 are "not merged"; both branches are ancestors of master. | Stale owner | Agents may redo or wait on merged work. | Update B2-B5 rows in MECHANISM_BACKLOG to merged with their receipt state. |
| AT2 | B8 firearms is implemented below floor (no native proof; shared-pack proof acts still open per KJ3AE), B11 persistent cast is not built, and combat has floor evidence on the health fixture. B7 brewing was scoped observation, so it is not a gap. | Missing connection / verification gap | The Tingen climax and later KJ arcs need fights; these share one blocker. | Bring B8 to floor with a native fight before the Tingen climax window. |
| AT3 | Klein is at ch69 of a volume ending ch213; arcs 2-5 have probe rows (partial, unverified) but no packets. | Depth gap | The spine is moving, about 40 Klein commits on Nov 3-4, but the remaining volume-1 runway is mostly mechanism-gated. | Read the "Build order after probes #3-#5" section before the next window. |
| AT4 | Harry W5-W10 proposed; 3 HP commits since Nov 1 against about 40 Klein. | Stalled lane | Second-focus world is waiting, not failing. | W5 (calendar, G5) is the next ready window; W8 needs semantic shard review. |
| AT5 | Ordinary starts and second lives (B5-B7) wait on Klein's ending by schedule, not by logic. | Deferred by direction | P2 "different kinds of lives" stays unmet for a non-developer start. | Direction choice only; no action unless Weibao moves it. |
| AT6 | Campaign content lives in private packs; a fresh public install cannot reach it (RP section). | Delivery gap | Published repo shows engine, not the Klein or Harry lives. | Recorded delivery state; no new acceptance inferred. Note when release state changes (AD32). |
| AT7 | Installed app last adopted at Luminous Gothic; no current-master recheck was recorded in the inspected owners. | Verification gap | What Weibao plays in the app may lag the agent-proven bundle by weeks. | Rebuild and adopt, then one native smoke in the app. |
| AT8 | Every slice is agent-verified, none human-reviewed (AD42 allows this). | Unknown | P1-P5 "fun and comfortable" are unjudged; pacing and taste have no evidence. | Optional: one play session on the KJ3AE checkpoint. |

## What blocks what

- B8 firearms to floor + combat beyond fixture → Tingen climax (KJ3 end) → KJ4-KJ8 (required).
- B9 time carry was fixed 2026-11-03 (`6717c38e7`); corrected 2026-11-05, earlier wording called it open.
- B11 persistent cast → recurring people like Glacis acting in place (helpful; text roles cover it today).
- Klein ending → ordinary starts B5-B7 (scheduled, not logical; hypothetical dependency).
- HP W8 shard semantic review → W8-W10 (required for that order).
- App adoption → anything Weibao plays in the installed app (required for human review).

## Momentum (commits by day)

Nov 1: 7 total. Nov 2: 14 (3 Klein). Nov 3: 171 (32 Klein, 2 HP). Nov 4: 54 (5 Klein, 1 HP). Klein spine is the moving lane; HP and mechanism rows move slowly; most Nov 3 volume was depth-dial, overnight, cast-lives and UI-direction work.

## Next moves

Standing priority ([PROJECT current focus](../../PROJECT.md), AD32): Klein full journey, then Harry beside it, book-world depth, three-worlds proposal, playability plan.

Suggestions, ranked: (2) AT2 B8 to floor plus combat, since it gates the rest of Klein. (3) AT4 Harry W5. (4) AT7 app adoption so play is possible. (5) AT8 optional play session.

## Shared foundations (follow-up, 2026-11-05)

Question: what foundational work would help every world, ammunition included? Source checked by grep and by reading the B8 firearm header; no runtime run. Proposals only (AD32).

| ID | Foundation | What source shows | Worlds it helps | Proposal |
|---|---|---|---|---|
| FD1 | Long time skips (sleep, travel, waiting) | Corrected 2026-11-05: B9 was fixed in the LOTM cast host on 2026-11-03 (`6717c38e7`, `metByActs`), and `reservationDecision` in `src/constraint_store.js` has one caller, that host, so no other world hits it today | Any future world whose lead life uses constraint packs | Done 2026-11-05, below floor: refusals return `freeMinutes` for runners (player text unchanged, observer-safe), test in `tests/constraint_store.test.js`. LATER: move beat settlement out of the LOTM host when a second world adopts constraint packs |
| FD2 | Notch contest as one engine option | Three contest engines exist by design: dice (`check_contract.js`, used by D&D Phandalin and `person_memory.js`), upstream attack/evasion (`combat_math.js`), LOTM notches | Klein fights; first non-LOTM consumer would be HP W7 (troll, duel) | Done 2026-11-05, below floor: LOTM-free core moved to `src/notch_contest.js`; `book_world_lotm_bands.js` delegates with its calibrated dials; `tests/notch_contest.test.js`. Rejected: one unified engine, rerouting L2b combat (AD5, no consumer asked) |
| FD3 | Ready stock: carried, loaded, spent per use | B8 keeps rounds as LOTM BE-seat keys (`book.lotm.be.carried.*`, `loaded.*`); crafting already makes arrows as items | Bullets, arrows, bolts, talismans, potion doses, spell slots, wand charges where a world has them | Generic counted stock with an optional ready slot and reload time; B8 becomes its first consumer |
| FD4 | Persistent recurring people | B11 open: Glacis and others stay text roles | Klein's colleagues, HP classmates and teachers | Wake a pack role into an enrolled person at first repeat use |
| FD5 | Practice that turns into skill | B8 aim steps by rounds fired are local to firearms | Shooting, flying, spells, crafts | Shared "practice count to notch" ladder; check against existing skill XP before building |

| FD6 | Purse and pay per owner | Harry's purse goes through shared `own_holdings.js` + `coin_ladder.js` (`book_world_hp_lead_domain.js:24-43`); Klein's pay is a private ledger (`book_world_lotm_pay.js:9-60`, keys `book.lotm.pay.*`, weekly `payCollectRequires`) and no LOTM file registers `own_holdings`. Shared `money.js` has 10 importers, none LOTM/HP | Klein wages, B12 expenses, C1 client fees, G3 pay lines, G4 staged commission; HP W4 vault, W7 house points | Done 2026-11-05, below floor: `own_holdings.purseEffect`/`purseBalance` is the shared coin-move seam; Klein's pay and commissions emit through it (native pence purse, effect shape and `book.lotm.pay.*` keys unchanged, so saves load as before; `tests/own_holdings.test.js`, `tests/lotm_pay.test.js`, check:arch pass). Not done: Harry's vault draw and a world-neutral wage ledger still unwired, no native route exercised |
| FD7 | Walking inside a place | `book_world_lotm_districts.js:64-83` builds a walk command for every place pair as a timed job; world-neutral `travel_legs.js` (quote/settle, fares, hazards) is used only by intercity `book_world_lotm_cities.js` | Klein's Tingen days, Hogwarts corridors, Diagon Alley, Village, cultivation sects | Done 2026-11-05, below floor: Tingen walks quote through `quoteRoute` as zero-fare foot legs (`lotmWalkQuote`); command ids and durations unchanged; Hogwarts walks not moved |
| FD8 | Recurring duties and fixed slots | `obligations_ledger.js` header: pure, "not wired into save or gameplay"; `world_rhythm.recurringWindow` is used by HP facts and cast schedules only as a display window | G1 skip or swap a weekly slot with notice, B12, G4 staged payments, G11 household hire; HP timetable and detentions (W6-W9) | Done 2026-11-05, below floor: `world_rhythm.dutyState`, `recurring_duties.js` (slice `duties@1`, migration, miss counting, ledger duty rows) and `book_world_lotm_duties.js` (Klein weekly expense claim) tested in `tests/recurring_duties.test.js`; not yet registered as a domain, not in the owed panel, no HP class or swap/notice effect. Original: L2, M-L: wire the ledger as save-backed records keyed to `world_rhythm`, with miss, swap and notice effects. Done: Klein misses one Monday gathering with notice and Harry misses one class, each leaving a record the next day reads |
| FD9 | Weather and light by world clock | `weather.js` imports native `game_time` (`current_game_time`, `night_time`); no LOTM or HP file imports `weather`, and LOTM night fog lives in event text (`book_world_lotm_events.js`) | Tingen fog, night work, Quidditch weather, Village farming, travel hazards | Done 2026-11-05, below floor: `src/world_light.js` (pure `worldLight(dayFraction, profile)`, per-world night and fog dials, Tingen proposal profile) read by `lotmLight` in `book_world_lotm_events.js`; `weather.js` untouched so Village reading is unchanged; focused tests only, no browser or UI consumer yet |
| FD10 | Who knows what about whom | `people_knowledge.js` is nominally shared but imports `book_world_lotm_cast_host.js` and `book_world_mol_content.js` directly (lines 1-3) | HP G8 fame (strangers know Harry), Klein's cover roles, any world with secrets about a person | Done 2026-11-05, below floor: `people_knowledge.js` has no world import; MoL and LOTM cast register via `src/people_sources.js` (output unchanged, 60 focused tests pass, check:arch no new cycle). Next: HP registers a source for G8 (strangers know Harry) |
| FD11 | Lessons from a teacher | `teacher_window.js` (LP5, availability only) has one importer; Klein's Old Neil lessons and HP classes are written as acts | Klein's mysticism lessons, HP flying and potions (W6-W7), cultivation masters | Done 2026-11-05, below floor: `src/lesson.js` (availability helper plus knowledge-fact and `xp` effects); `teacher_window.js` and Klein's Old Neil divination lesson (`beDivMethodLearnEffects`) use it with identical effects; `tests/lesson.test.js`, be_seat and teacher_window tests pass, `check:arch` passes. No Neil act exists in code, so HP classes (next consumer) and a browser run are not done. |

Checked and not gaps: injury goes through shared `harm_state.js` (`book_world_lotm_harm.js:1`); Spirit Vision exhaustion is a shared stacking state (`book_world_lotm_be_seer.js:52`); clearance and coin subunits use shared `clearance.js` and `currency_subunits.js`. Unchecked: carrying capacity (`carry_ledger.js` is cross-world boundary carry, not weight), tool wear, disguise (no shared module found; Klein's cover roles would be the first consumer).

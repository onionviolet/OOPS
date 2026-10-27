# Village loop checkpoint (village-loop session, 2026-10-27)

Owner: `village-loop` session ([COMMON.md](COMMON.md), brief section 2 in [BRIEFS.md](BRIEFS.md)). GM_PLAN.md was not written when this slice started, so the slice comes from the playability survey below (brief fallback route).

## AD38 / scope reading

The Village is the home base the travel loop returns to (TL4) and the first loop to establish (Weibao, 2026-10-27). The 2026-10-26 "Frontier and Mistglass get no new depth" line still holds outside this loop; this slice adds no new Frontier content, places or items. Things work by how they work: neighbours notice who keeps their watch and carries their parcels, so steady service moves the existing Village reputation.

## Survey: what is playable now (MCP walk, fresh life, seed 7, live bundle)

| Loop | State | Note |
| --- | --- | --- |
| Watch | Playable | Accepted 08:02, stepped to 20:02, paid 12 coins + 3 Perception XP. Rows sit under Local actions → Options → Local life. |
| Weekly market | Playable | Day 1 09:00-17:00 window shown with countdown; one Stale bread. |
| Courier | Playable | Met on the first idle Village step (40% roll); pamphlet row unlocks relay. |
| Relay | Playable, gated | Needs the Eastern mill (Cave room + elder report-back); rows and Quests say so. |
| Search exhaustion | Playable | "1 find remains" / "0 finds remain", disabled after the find. |
| Runner | Playable | Appeared during the watch; help/decline rows. |

TL1 steps (live, earn, carry, apply, react, return): live, earn, carry and return exist. **React is the weakest step**: 30 watch shifts or 20 relays change nothing about how the Village treats you. Apply is thin but present (coins spend at the native trader).

## Slice VL1: the Village notices steady service

- **Outcome (PRF2).** Completing a watch shift reads "Village watch complete: 12 coins, 3 Perception XP and +2 Village reputation." A relay receipt adds +3. Crossing a rank band (Known Face at 10, Neighbour at 50) says so once. The watch and relay rows name the reputation gain before you accept.
- **Consumer (FLR4).** Existing Village reputation: the trade price breakdown part "Village reputation (n)" (`economy_standing.js` regionRep, 0.4%/point, capped 6%), the rank ladder (`faction_rank.js`) and native reputation conditions.
- **Cost.** Unchanged: 13 idle hours in Village for a watch; three handoffs across Village and Eastern mill for a relay.
- **Mechanism.** Neighbours see you serve. Dial: `VILLAGE_STANDING` in `local_life.js` (watch 2, relay 3); a world or village with a different temper sets other numbers. Interrupted shifts earn nothing, as their pay.
- **Seam.** `src/absorb_c2/local_life.js` (reward plan gains `native.reputation`); `src/main.js` `stageLocalLifeResult` applies it as a native gameplay reputation effect and reuses `faction_rank.js` `rankChange`/`promotionText` for a band crossing; the persist path refreshes the native reputation row after publication. No new save field; reputation is native and already persisted by gameplay publication. Local-life schema unchanged.
- **Files.** `src/absorb_c2/local_life.js`, `src/main.js` (one import name, one line in `stageLocalLifeResult`, one call on the existing `publication.publish()` line; no registration line), `tests/local_life.test.js`, this checkpoint, `evidence/`.
- **Failure scenario.** Reputation granted on an interrupted shift, twice on one completion, on a restore/replay step, or by the plan without reaching `character.reputation` (message says +2 but trade breakdown unchanged).
- **Finish check.** Focused `node --test tests/local_life.test.js`; rebuilt bundle; MCP fresh life: watch to 20:00, Village reputation shows 2 and the trader breakdown shows the reputation part; Save, reload, Export, Import keep it; committer gates (build, npm test, check:arch, check:rules).

## Slice VC3a: say what leaving costs; the place remembers (GM_PLAN section 18, card 2)

- **Outcome (PRF2).** The watch rows and messages name the actual forfeit: leaving Village or other work before 20:00 loses the 12 coins, 3 Perception XP and +2 Village reputation, while Persistence XP already earned stays. Relay rows say the parcel waits while you travel or rest (nothing is lost). The Village description gains one sentence from standing once you are a Known Face or above, naming your service. Arriving back in Village from elsewhere logs one note of what is waiting (open market, midday bread, an accept window for the watch, the courier's pamphlet, a waiting runner).
- **Consumer (FLR4).** Village place description (`src/data/locations.js` via the existing `readVillageLedgerSentence` reader), the main log (UF6 return note), Local life rows.
- **Cost.** None new.
- **Mechanism.** Places keep visible consequences. Dial: the description sentence follows `faction_rank.js` feelings; another village's ladder changes its words. The return note reads current windows, so it never claims a change it cannot see.
- **Seam.** `local_life.js` (row and message text, a pure `villageStandingSentence`, arrival note inside `advanceLocalLife` on an observed move only); `src/main.js` line 464 (existing reader joins the standing sentence; no new registration line) and the existing `publication.publish()` line (re-renders the place description when a reputation change landed, so the sentence appears without leaving). No save field.
- **Deviation from the card.** The card names `change_badges.js` and `event_feed.js`. Both read other owners (panel rows; expansion state), and local-life state is not in either, so the return note goes to the main log as UF6 assigns. The note reports what is waiting on arrival (open windows, unread pamphlet, waiting runner, expected receipt), not a diff since departure, because local life keeps no departure stamp and a new save field was not worth it here; the pamphlet and runner reminders repeat on each hop while they stay true. Recorded, not widened.
- **Files.** `src/absorb_c2/local_life.js`, `src/main.js` (one existing line), `tests/local_life.test.js`, this checkpoint, `evidence/`.
- **Failure scenario.** Forfeit text names pay that is not lost, or misses pay that is; the arrival note fires on load, on a repeated clock or while staying in Village; the description sentence appears for a Stranger or names service the player did not do.
- **Finish check.** Focused test; rebuilt bundle; fresh life: accept watch, leave mid-shift and read the forfeit; leave mid-relay and read "nothing lost"; return to Village and read the note; reach Known Face and read the description sentence; 1920×1080 and 1536×864.

## Verification (VC3a)

| Check | Result | Gaps |
| --- | --- | --- |
| `node --test tests/local_life.test.js` | 22/22; new test covers forfeit row and messages (leave and interrupt), relay "nothing is lost" only mid-relay, arrival note only on an observed move into Village (not on load, repeated clock or staying), description silent for a Stranger and naming actual service at Known Face, Neighbour and Distrusted | |
| Rebuilt desktop browser, fresh origin `localhost:19927` (storage cleared), shared-tree bundle `6a1995df…`, 1920×1080 | Accept row: "…12 coins, +2 Village reputation; leaving early forfeits them"; leave after 60 minutes: "You leave the watch after 60 minutes: 12 coins, 3 Perception XP and +2 Village reputation forfeited. Persistence XP already earned stays"; Wild willow stand and back: "Back in Village: The weekly market is open; a supply runner is waiting by the well." (`evidence/vc3a-forfeit-return-1920.jpg`) | MCP walk skipped: the full-screen view per call is too large for this walk; limit already filed |
| Same life, five shifts (days 2-6) | "Standing rises in Village: Known Face" once; on return the description ends "People nod when you pass. They remember your 5 watch shifts." Save and reload keep it with no false return note | |
| Live description refresh, bundle `7e76982e…` | Found during the walk: the sentence appeared only on the next arrival. Fixed on the publish line; a sixth shift completed in place and the description read "6 watch shifts" without leaving | |
| 1536×864 | Description in Around you (`evidence/vc3a-description-known-face-1536.jpg`); the longest row "Leave watch (60 minutes served; forfeits 12 coins, 3 Perception XP and +2 Village reputation)" fits one line at 14 px (`evidence/vc3a-leave-watch-row-1536.jpg`) | 21 px not checked |
| Relay mid-step text and the "craftsman expects your receipt" return branch | Unit-tested only | Below floor until one relay walk (needs Cave room and mill); that walk also closes VL1's relay gap |
| Committer gates, run in the clean tree (bundle `336b32b1…`) | `npm run build` ok; `npm test` 3501/3501; `check:arch` pass (main.js under baseline, no new cycles); `check:rules` PASS | |
| Committed bundle | Built from clean HEAD `fa64b3a1` plus this slice's three source files (`336b32b1…`), because other sessions had uncommitted `src` edits in the shared tree; index.html changes only the bundle line | Walk ran on shared-tree bundles that also held those foreign UI edits; this slice's code is identical |

## Slice VC2n: standing opens what already exists (GM_PLAN section 18, card 3)

- **Outcome (PRF2).** Two watch shifts into a fresh life you become a Known Face in Village, and the elder offers the parcel relay directly, without needing the courier's pamphlet. Before that, Village shows a closed row: "Elder's parcel work: Needs Known Face standing in Village (4 reputation); you are Stranger. The visiting courier's pamphlet also opens it." Nothing that is open today closes.
- **Why this row.** The courier is a 40% roll on each arrival in Village. A player who stays for watch shifts gets one roll, so the relay can stay unreachable for a whole watch-only life. Standing gives a second, earned route to existing content.
- **Consumer (FLR4).** The existing parcel relay rows, elder advice and quest entry; `faction_rank.js` `rankAllows` for the gate and its reason.
- **Cost.** Two completed watch shifts (26 idle hours over two days), or one relay plus one shift. The relay's own cost and its Eastern mill gate are unchanged.
- **Mechanism and dial (WD2, still open for Weibao).** People trust those they have seen serve. Proposal default: the Village ladder puts Known Face at 4 (`REGION_LADDERS.Village`), two shifts at +2. Rung indices are unchanged, so `rank.Village` facts and the discount at Neighbour stay as they were. Another village keeps the default 10. Reverting is one line.
- **Seam.** `faction_rank.js` (Village ladder override); `local_life.js` (relay open = pamphlet read, or already started or run, or Known Face; closed row with the `rankAllows` reason; elder text); `src/main.js` `localLifeContext` gains `villageReputation` (existing function, no registration line). No save field. Once a relay has started, falling below Known Face does not close it.
- **Closed reason.** The reason sits in the row label text, so it is visible without hover. The UIV1 primitive is not needed or edited.
- **Files.** `src/faction_rank.js`, `src/absorb_c2/local_life.js`, `src/main.js`, `tests/local_life.test.js`, `tests/faction_rank.test.js` if needed, this checkpoint, `evidence/`.
- **Failure scenario.** The gate closes the courier route; the row opens below Known Face or stays closed at it; a started relay closes when standing falls; the Known Face change moves the Neighbour discount or rank indices; the promotion message fires twice.
- **Finish check.** Focused tests (`local_life`, `faction_rank`); fresh life in the rebuilt browser with no courier read: the closed row before, Known Face after the second shift, the elder's parcel row then, save/reload keeps it; 1920×1080 and 1536×864.

## Verification (VC2n)

| Check | Result | Gaps |
| --- | --- | --- |
| `node --test tests/local_life.test.js tests/faction_rank.test.js` | 31 + 8 pass; new test: closed row and its reason for a Stranger, action refused, courier route still open for a Stranger, Known Face at +4 opens row, elder line and quest, a begun relay stays open after standing falls; ladder test pins Village 4 / Town 10 | |
| Rebuilt desktop browser, fresh origin (storage cleared), bundle `9f2633e6…`, 1920×1080 | Day 1: "Elder's parcel work: Needs Known Face standing in Village (4 reputation); you are Stranger. The visiting courier's pamphlet also opens it." (disabled, inline). Second shift (day 2, 20:00): "Standing rises in Village: Known Face." once; row became "Parcel relay 1/3: Collect the elder's parcel in Village. Clear the Cave room…"; elder: "You have kept our watch; I can trust you with a parcel…"; description "They remember your 2 watch shifts." (`evidence/vc2n-closed-row-1920.jpg`, `evidence/vc2n-known-face-opens-1920.jpg`) | The opened relay still waits on the Eastern mill (Cave room), an existing gate |
| Save and reload, 1536×864 | Opened row kept; label wraps to two lines and stays readable (`evidence/vc2n-reload-1536.jpg`) | 21 px not checked |
| Committer gates, clean tree (HEAD `59eb19de` plus this slice; bundle `94c459ce…`) | build ok; `npm test` 3502/3502; `check:arch` pass; `check:rules` PASS | |

Effect on VL1 evidence: Known Face in Village now comes at 4 reputation (second shift), not 10 (fifth). The VL1 rows above are kept as dated history.

## Slice VC12: an evening with a surprise (GM_PLAN section 18, card 4)

- **Outcome (PRF2).** After opting in through the elder (existing "Begin Village encounters"), a Village evening (17:00 on) can draw a card fitted to what you are doing. On watch, the lamplighter asks you to steady her ladder; helping makes her a contact, and a later evening offers her paid wick-trimming job (2 coins), a choice that did not exist before. After a relay, the mill cart driver leaves bread. At Known Face, a neighbour asks you to supper. A Village temper dial (Calm, Usual, Lively) in the encounters panel changes how often anything draws.
- **Consumer (FLR4).** Existing storylet decks and event responses, the encounters panel, money, items and relationship effects.
- **Cost.** The card's own response costs; none on pass.
- **Mechanism and dial.** Salience: cards require the current activity (`village.watching`, `village.relays`, `rank.Village`, `day.hour`). The temper scales the deck's quiet weight (Calm ×3, Usual ×1, Lively ×0.3); the default is Usual, so existing draws are unchanged. Another village can set its own temper default.
- **Seam.** `storylet_content.js` (four card rows and three temper command rows, data only); `storylet_deck.js` (quiet weight reads the saved actor fact `storylets.temper`); `local_life.js` exports `localLifeFacts`; `src/main.js` spreads it into the existing expedition facts object (no registration line); `storylet_ui.js` shows the temper buttons. No new save field: the temper is a simulation actor fact, already saved and imported. No new deck, so saved deck validation is unchanged.
- **Files.** `src/storylet_content.js`, `src/storylet_deck.js`, `src/storylet_ui.js`, `src/absorb_c2/local_life.js`, `src/main.js`, `tests/storylet_deck.test.js`, this checkpoint, `evidence/`.
- **Failure scenario.** A fitted card draws off watch or before evening; a reload rerolls a drawn card; the Usual temper changes existing draws; Lively draws fewer than Calm; the follow-up card appears without its contact.
- **Finish check.** Focused `storylet_deck` test: one on-watch evening at Usual draws the lantern card; the contact opens the follow-up; Lively > Usual > Calm over a fixed-seed 30-day run; restore gives identical next draws. Browser on a fresh origin: opt in, watch into the evening, see a fitted card and respond; set the temper; save/reload; 1920×1080 and 1536×864.

## Verification (VC12)

| Check | Result | Gaps |
| --- | --- | --- |
| `node --test tests/storylet_deck.test.js` (+ `storylet_ui`, `story_spine_qa`, `traveler_lint_hint`) | Pass. New tests: the lantern card is a candidate only on watch from 17:00; one on-watch evening at Usual (seed 73) draws it; restore gives identical cards and next draws; helping opens `lamplighter_wicks`; relay and Known Face cards fit their facts; Usual keeps existing deck draws byte-identical; over a fixed-seed 30-day run Lively > Usual > Calm; temper needs opt-in. Card-count pin moved 14 → 18 | |
| Found by the full suite | The story lint flagged `watch_lantern` as self-locked (its `not(lamplighter.known)` requirement); removed: the lamplighter is a regular and the ask recurs on its 1440-minute cooldown | Browser walk ran before this change; it only lets the ask return on later evenings |
| Rebuilt desktop browser, fresh origin, bundle `77025966…`, 1920×1080 | Met the elder, "Begin Village encounters", watch accepted 08:55; at 17:06 the encounters panel showed "Offer · Dusk at the watch post. The lamplighter asks you to steady her ladder…"; "Steady the ladder" resolved and the watch kept running (510 minutes); temper set to Lively; save and reload kept "(lively temper)"; at 18:31 the follow-up "The lamplighter has a spare job: trim the wicks…" drew and "Trim the well lamps · 2 coins" moved the purse 10C 6W → 10C 8W (`evidence/vc12-lantern-card-1920.jpg`) | Mill-cart and supper cards unit-tested only |
| 1536×864 | Temper row and Lively deck in the encounters panel (`evidence/vc12-temper-lively-1536.jpg`) | 21 px not checked |
| Committer gates, clean tree (HEAD `63c6393a` plus this slice; bundle `95429446…`) | build ok; `npm test` 3504/3504; `check:arch` pass; `check:rules` PASS | |

Found in passing, not this lane's: the elder's first dialogue shows a line "text not found, id: 'Ask about the moonlit herb b…" (a missing dialogue text id). The encounters panel lives in the parked "Notes, practice & people" module (Notebook → People), so a player must open it there to see cards; card arrival does not surface in Village actions.

## Seams left for the cross-world loop (TL1-TL8) and a Proto23 pack

Recorded per the coordinator's 2026-10-27 scope notes; no travel or Proto23 work done here.

- **React output is generic.** Any local-life plan can set `native.reputation[region]`; the host applies it, names a rank change and refreshes the row. A TL3 import hook (knowledge carried from Tingen and used for neighbours) can pay standing through the same field with no new state.
- **Pull to return (TL5).** Rank is derived on read (`rankFacts` gives `rank.Village`), so later Village content can gate on Known Face / Neighbour without a save change.
- **Home base (TL4).** Standing is what piles up and shows in the Village while you are away; it already colours every Village price through `economy_standing.js`.
- **Proto23 pack (WV1-WV12).** A faithful pack's own standing or fame scale needs either a mapping into `character.reputation` regions (the transaction rejects unknown regions, so a new region must be added to the native map with a save default) or its own ladder entry in `REGION_LADDERS`. Its watch/courier equivalents would emit through this field rather than a second reputation owner.

## Verification (VL1)

| Check | Result | Gaps |
| --- | --- | --- |
| `node --test tests/local_life.test.js` | 21/21 pass; new test covers watch +2 once, no grant on interrupted/replayed steps, relay +3 on receipt only, row/message text | |
| MCP fresh life, frozen bundle `8b51cd72…` then `809b2e84…` (manifest `29185e8e…`) | Accept watch 08:02 → 20:02: "Village watch complete: 12 coins, 3 Perception XP and +2 Village reputation." | Relay not walked (needs mill via Cave room) |
| MCP Save → Export → Import → re-Export | Exported character reputation `Village:2`, `watchShifts:1`; same after Import | |
| Rebuilt desktop browser, fresh origin `localhost:19927`, bundle `4797799b…` (dist sha), 1920×1080 | Three shifts across days 3-6: reputation 2 → 4 → 6; Data row "Village reputation Stranger (6)" updated live; trade breakdown "Village reputation (2): selling +0.8%, buying −0.8%"; page reload kept the active watch and the value | 21 px text size not checked; screenshots at 14 px in `evidence/` |
| 1536×864 | Rows and report text fit (`evidence/vl1-watch-complete-1536.jpg`) | |
| MCP fresh life (seed 11), frozen bundle `809b2e84…` (manifest `31dec920…`), five watch shifts days 1-5 | Fifth completion logged once: "Standing rises in Village: Known Face. People nod when you pass." | |
| GM_PLAN card 1 double-count check | No double count: `market_circle` standing moves only through `tradeDeed`, debt payment and missed debt (`economy_standing.js:124,170,196`); hero reputation is a separate read-only price part, so no rival backlash fires. Browser breakdown showed "Market Circle · Neutral (0)" beside "Village reputation (2)". | |
| Relay +3 Village reputation | Unit-tested on the action-dispatch path; not walked in play (needs the Eastern mill via Cave room) | Implemented, unit-tested, not walked |
| Committer gates (bundle `4797799b…`) | `npm run build` ok; `npm test` 3500/3500 pass; `check:arch` pass (main.js 10085 vs baseline 10115, no new cycles); `check:rules` PASS | |
| Found and fixed during the walk | Native reputation row only refreshed on load; first refresh call sat before publication and read the old value; moved after `publication.publish()` | |

Review state: agent-verified, not human-reviewed. Route: earned from a fresh life (watch), no fixture. The watch path meets the AD43 floor; the relay grant is implemented and unit-tested, not walked.

Tool note: the browser `advanceTicks` hook stayed locked ("Cannot nest advanceTicks") after a tool-side timeout during a `render:true` advance; a page reload cleared it. MCP limits filed once through `game_report_limit`.

## Log

- 2026-10-27: survey done; VL1 recorded before editing.
- 2026-10-27: VL1 committed in `09d77f22` (watch path at the AD43 floor; relay grant unit-tested, not walked). Follow-up: Known Face walk and the card 1 double-count check recorded. Next card per GM_PLAN section 18: VC3a (say what leaving costs; the place remembers).
- 2026-10-27: coordinator relayed Weibao's order: VC3a, then VC2n, then VC12. VC3a recorded before editing.
- 2026-10-27: VC3a committed (watch forfeit, return note and description sentence walked; relay text unit-tested only).
- 2026-10-27: VC2n recorded, implemented and committed (Village Known Face dial 10 → 4 as a WD2 proposal; elder's parcel work opens at Known Face).
- 2026-10-27: VC12 recorded, implemented and committed (four evening cards, Village temper dial). Order from the coordinator is complete; next in GM_PLAN section 18 is VC7a.

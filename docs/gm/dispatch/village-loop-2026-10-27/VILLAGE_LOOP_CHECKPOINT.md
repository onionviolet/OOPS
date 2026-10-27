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

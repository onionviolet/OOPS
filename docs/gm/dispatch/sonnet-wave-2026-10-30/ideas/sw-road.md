# Idea intake: sw-road

Append-only. Format and rules: [QUEUE](../QUEUE.md#idea-intake).

## 2026-10-30, slices 1-5 (volumes 1-3 shape; mechanisms only)

**ACT NOW (done)**
- v1/v2: region kit, travel legs, jurisdiction rulings, persona standing, gatherings (all world-neutral), Backlund pack. Authored hours and fares carry `hoursEvidence`/`fareEvidence`.
- v3: sea city pack (`private_packs/lotm-baiyam/`), one ticket across two sea legs (fare on leg one, zero on leg two), hazards cited to customs (a hostile-ship sighting, fog and storm). `loadCities()` loads every listed city pack.

**ACCOUNT FOR NOW**
- GM39 creatures: the volume 3 CRE rows are abilities (summoned messengers, transformations), not creatures met on a route, so no creature hazard was invented. The hazard `kind` field stays open (`creature` is allowed) for a later volume that cites one.
- GM37 languages: volume 1 and 3 LNG rows are writing and translation abilities; the default is still "skip unless a path needs it".
- A price stated as a share (bounty cut, 15 to 30 percent) is stored as `unstated` with basis `formula`, not a made-up number.

**LATER**
- L1. Stopover as a mini region: a port the ticket stops at (the middle landfall) needs hours (arrival at dusk), a custom (stay in on fog nights) and a telegraph office. Level: seam. Effort: low. Done check: `quoteRoute` names the stop and a service there reads open or closed at arrival hour.
- L2. Ticket class as a fare tier (third class, first class, cabin rooms) so one leg quotes several classes with different comforts and risk exposure. Level: seam. Effort: low-medium. Done check: two quotes for one leg differ in fare and in one stated consequence.
- L3. A share-of-sum price type (`{pct:[15,30], of:'bounty'}`) in the region kit so the bounty cut reads as a range. Level: seam. Effort: low. Done check: `readRegion` shows a range string from a bounty value.
- L4. Identity papers as a gate on services and statutes (GM24 and GM23): a persona holds or lacks papers and a statute row's evidence reads them. Level: mechanism. Effort: medium. Done check: one act is refused for a persona without papers and allowed with them.
- L5. Reputation carry between cities: standing in a second city starts at Stranger but a rumour from the first (L14 news spread) can lift or lower the start. Level: seam. Effort: medium. Done check: the same person arrives with different starting standing after a dated public event.
- L6. Pirate-kind institutions (fencing and supply trade, bounty-as-status) as a faction type in the kit, with rank by bounty. Level: content plus a small rank ladder. Effort: medium. Done check: a service in the kit gates on a bounty-rank rung.

## 2026-10-30, improvement pass on slices 1-5

**ACT NOW (done)**
- Authored hours replaced where a cited row exists: the first train leaves at 7 (a station row, label I), so the Tingen leg has a service window and `hoursLocator`. The bank had no cited hours, so its fabricated 9-17 is gone and it reads "hours not recorded" (`hoursUnstated`, `hoursKnown: false`). No row cites a fare or a duration for the Tingen train or the two sea legs; those stay authored (I) with `minutesBasis` naming the nearest cited order of magnitude ("many hours", another city pair).
- Unread fields now read: `readRegion` returns `era`, `dial` and `statutes`; gatherings gained `nextMeeting` so the schedule `hour` is read.
- Hazard provenance checked: leg hazards carry evidence and locator in `city.provenance`; two earlier wrong locators were fixed in slice 5.

**ACCOUNT FOR NOW**
- `trade(g, state, ...)` keeps a `state` parameter it does not read (the host owns balances); region `customs[].effect` and `parent` are stored, not consumed; both wait for a consumer (see L7, L8).

**LATER**
- L7. Wire a customs `effect` (stay-in, evacuate-deck) to the calendar curfew reader in `world_events.js` so a custom closes outdoor services at night. Level: seam. Effort: low. Done check: a service reads closed on a fog night.
- L8. A real `hours` range for a last train needs a source row; until then the quote's wait only knows the first departure. Level: content. Effort: low (a Luna search per later volume). Done check: the leg's `hoursEvidence` becomes S or T.

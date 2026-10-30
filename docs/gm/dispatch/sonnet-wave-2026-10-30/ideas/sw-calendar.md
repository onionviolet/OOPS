# Idea intake: sw-calendar

Append-only. Format and rules: [QUEUE](../QUEUE.md#idea-intake).

- 2026-10-30, v1: news spread is knowledge; `eventKnowledgeWrites` emits the beat_knowledge write shape, one writer stays the host's. ACT NOW (done, `src/world_events_knowledge.js`). [folded: done in slice]
- 2026-10-30, v1-8: scene dates form independent frames, so any dated feature needs a per-frame day binding by the host. ACCOUNT FOR NOW (in the design note). [folded: kept in the design note]
- 2026-10-30, all: a missed-event digest could also say how it reached you ("the paper", "a friend"), from the route. LATER; level: Reports wording; effort: small; done check: digest line names the route class without ids. [folded: QR6e]
- 2026-10-30, v2-8: later volumes have no scene frames; news placed by chapter band (`ch.<N>` ordinal beats). ACT NOW (below). [folded: done in slice]
- 2026-10-30, all: rumour spread between ordinary people (a heard event re-told) needs `knownVia` chains from the person-memory owner. LATER; level: engine; effort: medium; done check: a second-hand listener learns a day after the first. [folded: GM47]

## Improvement pass on slices 1-4 (2026-10-30)

Checked: Luna model in lane.json for all 11 later-volume lanes is gpt-6-luna. Spot-check of 13 placed events (one or two per classified file) against cited paragraphs, plus a count over all 2,568 non-fact rows.
- **Defects found and fixed (one commit):**
  - Private events leaked through open channels (67 rows had a private scope and an open route). The reader now delivers a private event only through a named carrier or presence. ACT NOW (done).
  - 93 rows had a named audience and no carrier, so the route was open to anyone with that channel. The builder now drops the spread. ACT NOW (done).
  - 459 witnessed or overheard rows had a route no one holds and no place, so nobody could witness them. They now carry `witnessedByLead`; `loadEventPack(..., {leadId})` puts the lead present when the host binds the beat. ACT NOW (done).
  - `frameBindings` only bound frame roots, so volume 2-8 chapter beats never got a day. It now binds any reached ordinal beat. ACT NOW (done).
  - 19 curfew-kind rows produced no curfew (no effects listed). A curfew-kind event is now its own curfew over its window. ACT NOW (done).
  - Rows that only record a reading act with no stated content (9) are dropped. The `chapter` field nothing read (WA41) is gone.
- **Not fixed, accounted for:** 1 of 13 sampled rows has a locator that does not support its text (a war-declaration paragraph cited for an airship row), so locators can drift by a few paragraphs; event text stays pack data from the row, and an inspector check against cited paragraphs stays LATER (level: tooling; effort: small; done check: a script lists rows whose cited paragraph shares no names with the row). Private-scene incidents sometimes carry a public scope from the extraction row; with the private gate this only affects who may hear it by an open route, which is now closed.

- 2026-10-30, GM35: second-hand spread done: a `via` route waits for the carrier to learn by any route, chains allowed and loop-guarded; `whoKnows` answers "who could I ask by day D". ACT NOW (done). Existing person books already label a `reported` basis as a received account, so no change to `people_knowledge.js`.
- 2026-10-30, GM35: a person's knowledge of an event can go stale (a rumour corrected by a later notice). LATER; level: engine; effort: small; done check: a later event with `supersedes: id` replaces the line's value in the knowledge write for people who learn both.
- 2026-10-30, GM35: ordinary gossip links between named people come from the cast's relationships, not the pack; the host should generate `via` entries from relationship edges at bind time. LATER; level: host; effort: medium; owner: sw-wire with the person-memory lane.

- 2026-10-30, GM38: only 11 of 155 placed city-scale rows are real restrictions; most war and raid news is just news. Region-wide effects load as enforced; text-only scopes load `unmapped` (shown, never enforced). ACT NOW (done). LATER: map `scopeText` to place and institution ids with the region pack (sw-absorb data line / sw-road); level: data; effort: small; done check: a closure closes a named institution in `region_kit` on its day.
- 2026-10-30, v1: the merged volume 1 scenes are 316, not 338; 291 are the lead's own beats (the cast owns them), 25 happen without the lead and now run as world events with `present`. The 338 in the ledger counts raw beat rows before merging. ACCOUNT FOR NOW.

## Morning block (L14, last commit)
- **Committed:** `ae77aafda` reader and note, `650d3e775` volume 1 pack, `a2dc5ce6c` knowledge writes, `699a87eb6`/`f4b04a599` volumes 2-8, `bdc9de9b6` improvement pass, `9c7fb2ece` second-hand spread and `whoKnows`, `d9ce26b8b` restrictions, `1868f12ba` scene presence, and the final restriction-merge commit. 20 focused tests pass. Nothing pushed.
- **Waiting on others:** host wiring (`sw-wire`), `scopeText` to place ids (region pack), `ctx.presence` and `ctx.channels` per person.
- **Codex:** 30% at the last launch; one Luna lane this round.

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

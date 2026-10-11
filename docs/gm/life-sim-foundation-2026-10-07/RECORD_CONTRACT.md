# Life record interface, foundation proposal v1

Foundation writer: `src/life_record.js`, `src/life_record_ui.js`, save code. Experience writer: `src/event_feed*.js`, life-stage/director modules. Consumer acknowledgment pending; this contract is available for coordination, not an assertion of agreement.

Save field: optional top-level `life_record`, schema 1. Expansion schema 11 unchanged. Absent record migrates at load to an empty record with an honest opening at the loaded date, without inventing earlier events. Existing native/expansion history remains untouched.

API: `createLifeRecord()`, `validateLifeRecord(record)`, `appendLifeMilestone(record, {year, at, worldId, kind, text})`, `compactLifeRecord(record, year)`, `lifeRecordView(record)`. Pure APIs return new records. `at` is native calendar minutes (year * 518400 + zero-based month/day offset + hour/minute), not expansion clock. `year` is native calendar year. Worlds retain their ID. Kinds are bounded in the module; consumer additions require writer coordination.

Shape: `{schema:1, nextId, recent: [{id,year,at,worldId,kind,text}], years:[{year,count,worlds:[IDs], kinds:{kind:count}, first,last, highlights:[text]}], earlier:{throughYear,count}, observed:{worldId}}`.

Bounds: 64 recent milestones, 200 yearly summaries, four highlights/year, eight worlds/year, text 240 code units. Older years become an honest count/range, not fabricated prose. Current/recent-year overflow also folds into that year's summary. Counts preserve total events; exact old wording is intentionally summarized. No event effects, rewards or eligibility may depend on this lossy view.

Playable E: the character can remember the current day in the existing side log. Beginnings and world crossings are recorded automatically on save. Experience may later take over the presentation after explicit writer handoff.

## Experience consumer acknowledgment, 2026-10-07
Experience GM acknowledges proposal v1 above for this slice. Full response, host-hook request and ownership exclusions: [EXPERIENCE_ACK.md](EXPERIENCE_ACK.md). Record/save ownership remains foundation; event-feed and chronicle mechanic ownership remains experience. Please reconcile the pending-ack status in your checkpoint after reading this response. Main.js save hooks remain your reservation; the B heir transition awaits your pristine-start/storage integration or an explicit area handoff.

# Experience lane coordination, 2026-10-07

Experience GM is active. Exclusive ownership: src/life_experience*.js, src/event_feed*.js, tests/life_experience*.test.js, experience task folder. Reading workers own only READING_C1.md and READING_C2.md there.

Please publish the life-record module's API and save field shape here before I write consumers. Proposed interface: append a milestone with stable id, at, worldId, kind, text; read compact milestones/year summaries. Legacy record must retain one learned lesson, a bounded grave with milestone epitaph, and current generation. Experience will not edit your record module or save paths.

Need host integration: can you add callbacks/hooks in main.js for life-experience durable commands and youth native skill XP multiplier? I will supply exact module API and insertion recipe. Prefer one writer for main.js, already dirty. Also need lifespan-end modal to allow an opt-in heir, while preserving native inventory/progress compatibility (no power reset claimed in this first slice). I'll own chronicle.js/chronicle_ui.js only if you do not; please signal ownership/API here.

Experience now reserves chronicle.js and chronicle_ui.js (not listed in foundation ownership). New metadata proposed under chronicle.life.experience, only bounded teaching/selected lesson/grave, not a competing milestone record. Foundation should ingest chronicle.log notes into its shared record or expose append API. Existing saves omit experience; lazy optional initialization, no retroactive age/deeds. Please reserve main.js integration hooks to foundation and publish response.

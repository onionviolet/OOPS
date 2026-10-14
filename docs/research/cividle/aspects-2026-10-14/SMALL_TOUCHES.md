# cividle: twenty small original touches

These are YAIR proposals, not twenty claims that the source has these features. Rows T01-T12 use the game-specific aspect takeaways. T13-T20 are recurring cross-game design checks; they should be deduplicated by the coordinator, not counted as twenty unique mechanics per game. All remain unselected and have the packet gates in [IMPLEMENTATION_PACKETS](IMPLEMENTATION_PACKETS.md).

| Code | Original touch / owner | Inspiration and evidence limit |
|---|---|---|
| T01 | PROPOSAL: Keep multiplayer-like notices separate from an NPC conversation record. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A01; absent |
| T02 | PROPOSAL: Use a dated local achievement record without inventing witnessed scenes. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A02; partial |
| T03 | PROPOSAL: Derive visible bonuses from named sources in the existing simulation. Owner: src/feature_expansion_work_plan.js; src/simulation.js. | A03; covered |
| T04 | PROPOSAL: Declare transit snapshot policy and review checksum mismatch behavior at every loader. Owner: src/save_files.js; src/save_compatibility.js. | A04; covered |
| T05 | PROPOSAL: An institutional production queue can use explicit priorities without claiming autonomous worker lives. Owner: src/npc_lives.js; world CAMPAIGN.md. | A05; partial |
| T06 | PROPOSAL: At 1440x900, keep local work and city totals in separate useful panels. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A06; covered |
| T07 | PROPOSAL: Add author-time recipe reachability checks to the technology owner if selected. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md. | A07; covered |
| T08 | PROPOSAL: Expose marginal cost and source-labelled diminishing bonuses. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md. | A08; partial |
| T09 | PROPOSAL: Keep absence policy and cache freshness separate; no YAIR offline policy change follows. Owner: src/feature_expansion_work_plan.js; src/simulation.js. | A09; covered |
| T10 | PROPOSAL: Tie instruction completion to an actual action result. Owner: src/native_discovery_policy.js; src/observation_channels.js. | A10; covered |
| T11 | PROPOSAL: Show the source of a multiplier and distinguish work stopped from work disabled. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A11; covered |
| T12 | PROPOSAL: Treat a local institution and its durable rewards as distinct from city reset state. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md. | A12; partial |
| T13 | PROPOSAL: Show a scene as encountered only after its delivery route succeeds. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A01/A02; inferred adaptation, not a source feature claim |
| T14 | PROPOSAL: Keep a known scene available for rereading without replaying its reward. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A02/A04; inferred adaptation, not a source feature claim |
| T15 | PROPOSAL: Show the last successful save time separately from a failed attempt. Owner: src/save_files.js; src/save_compatibility.js. | A04; inferred adaptation, not a source feature claim |
| T16 | PROPOSAL: Give a restored backup a visible loss-of-recent-progress notice. Owner: src/save_files.js; src/save_compatibility.js. | A04; inferred adaptation, not a source feature claim |
| T17 | PROPOSAL: Preserve the intended work target when a missing input pauses it. Owner: src/feature_expansion_work_plan.js; src/simulation.js. | A03/A09; inferred adaptation, not a source feature claim |
| T18 | PROPOSAL: Label a rate estimate as projected and a settlement as actual. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A08/A09; inferred adaptation, not a source feature claim |
| T19 | PROPOSAL: Expose the source of one active modifier beside its effect. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A06/A08; inferred adaptation, not a source feature claim |
| T20 | PROPOSAL: Keep owned, assigned and currently usable support distinct in one local row. Owner: src/npc_lives.js; world CAMPAIGN.md. | A05/A12; inferred adaptation, not a source feature claim |

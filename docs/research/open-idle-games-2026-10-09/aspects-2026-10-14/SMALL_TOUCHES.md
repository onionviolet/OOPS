# open-idle-games-2026-10-09: twenty small original touches

These are YAIR proposals, not twenty claims that the source has these features. Rows T01-T12 use the game-specific aspect takeaways. T13-T20 are recurring cross-game design checks; they should be deduplicated by the coordinator, not counted as twenty unique mechanics per game. All remain unselected and have the packet gates in [IMPLEMENTATION_PACKETS](IMPLEMENTATION_PACKETS.md).

| Code | Original touch / owner | Inspiration and evidence limit |
|---|---|---|
| T01 | PROPOSAL: Store narrative availability and reading separately from completed work. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A01; partial |
| T02 | PROPOSAL: Retain compact story IDs and facts, with known text reconstructed from its versioned source. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A02; covered |
| T03 | PROPOSAL: Use the incumbent finite work-plan interface rather than importing a fork architecture. Owner: src/feature_expansion_work_plan.js; src/simulation.js. | A03; covered |
| T04 | PROPOSAL: Save stable completion IDs and rejoin current definitions without copying authored content. Owner: src/save_files.js; src/save_compatibility.js. | A04; covered |
| T05 | PROPOSAL: Keep worker quantities distinct from the state of named people. Owner: src/npc_lives.js; world CAMPAIGN.md. | A05; partial |
| T06 | PROPOSAL: At 1440x900, display current execution beside the next editable plan and mark projections. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A06; covered |
| T07 | PROPOSAL: Validate action IDs, localized text keys and prerequisites before content enters a campaign. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md. | A07; partial |
| T08 | PROPOSAL: Expose which retained skill changes a work rate without collapsing all advancement into one tier. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md. | A08; partial |
| T09 | PROPOSAL: Declare action time, lifespan time and banked acceleration separately. Owner: src/feature_expansion_work_plan.js; src/simulation.js. | A09; covered |
| T10 | PROPOSAL: Separate seen, learned, equipped and affordable states in a local work row. Owner: src/native_discovery_policy.js; src/observation_channels.js. | A10; covered |
| T11 | PROPOSAL: Make planned versus actual results explicit and retain a keyboard route to routine controls. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A11; covered |
| T12 | PROPOSAL: Keep optional mature paths reachable while selecting only one playable local slice. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md. | A12; partial |
| T13 | PROPOSAL: Show a scene as encountered only after its delivery route succeeds. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A01/A02; inferred adaptation, not a source feature claim |
| T14 | PROPOSAL: Keep a known scene available for rereading without replaying its reward. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A02/A04; inferred adaptation, not a source feature claim |
| T15 | PROPOSAL: Show the last successful save time separately from a failed attempt. Owner: src/save_files.js; src/save_compatibility.js. | A04; inferred adaptation, not a source feature claim |
| T16 | PROPOSAL: Give a restored backup a visible loss-of-recent-progress notice. Owner: src/save_files.js; src/save_compatibility.js. | A04; inferred adaptation, not a source feature claim |
| T17 | PROPOSAL: Preserve the intended work target when a missing input pauses it. Owner: src/feature_expansion_work_plan.js; src/simulation.js. | A03/A09; inferred adaptation, not a source feature claim |
| T18 | PROPOSAL: Label a rate estimate as projected and a settlement as actual. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A08/A09; inferred adaptation, not a source feature claim |
| T19 | PROPOSAL: Expose the source of one active modifier beside its effect. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A06/A08; inferred adaptation, not a source feature claim |
| T20 | PROPOSAL: Keep owned, assigned and currently usable support distinct in one local row. Owner: src/npc_lives.js; world CAMPAIGN.md. | A05/A12; inferred adaptation, not a source feature claim |

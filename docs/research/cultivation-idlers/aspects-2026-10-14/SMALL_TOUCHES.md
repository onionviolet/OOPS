# cultivation-idlers: twenty small original touches

These are YAIR proposals, not twenty claims that the source has these features. Rows T01-T12 use the game-specific aspect takeaways. T13-T20 are recurring cross-game design checks; they should be deduplicated by the coordinator, not counted as twenty unique mechanics per game. All remain unselected and have the packet gates in [IMPLEMENTATION_PACKETS](IMPLEMENTATION_PACKETS.md).

| Code | Original touch / owner | Inspiration and evidence limit |
|---|---|---|
| T01 | PROPOSAL: Archive encountered scene IDs/facts and preserve the distinction from durable progression. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A01; covered |
| T02 | PROPOSAL: Let everyday local texture be readable without forcing it to award currency. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A02; covered |
| T03 | PROPOSAL: Keep one authoritative simulation and use render projections for scenes/status. Owner: src/feature_expansion_work_plan.js; src/simulation.js. | A03; covered |
| T04 | PROPOSAL: Persist compact IDs/facts and preserve last-good data across failed migration. Owner: src/save_files.js; src/save_compatibility.js. | A04; covered |
| T05 | PROPOSAL: Distinguish persistent learned companion forms from the one currently expressed. Owner: src/npc_lives.js; world CAMPAIGN.md. | A05; partial |
| T06 | PROPOSAL: At 1440x900, keep current regional activity, progress and history readable in independent panels. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A06; covered |
| T07 | PROPOSAL: Validate discovery IDs and persistent sections whenever a campaign adds content. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md. | A07; partial |
| T08 | PROPOSAL: Make local advancement constraints visible without imposing a universal cultivation ladder. Owner: docs/worlds/ABILITY_AUTHORING.md. | A08; partial |
| T09 | PROPOSAL: Keep life age, work time, paused narrative and outside elapsed time distinct. Owner: src/feature_expansion_work_plan.js; src/simulation.js. | A09; partial |
| T10 | PROPOSAL: Reveal a reachable choice without making every existing option disappear after a missed scene. Owner: src/native_discovery_policy.js; src/observation_channels.js. | A10; covered |
| T11 | PROPOSAL: Use explicit recovery-loss notices and a manual reading override during idle play. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A11; covered |
| T12 | PROPOSAL: Use institutions, preparation and local history as parallel meaningful paths. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md. | A12; partial |
| T13 | PROPOSAL: Show a scene as encountered only after its delivery route succeeds. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A01/A02; inferred adaptation, not a source feature claim |
| T14 | PROPOSAL: Keep a known scene available for rereading without replaying its reward. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A02/A04; inferred adaptation, not a source feature claim |
| T15 | PROPOSAL: Show the last successful save time separately from a failed attempt. Owner: src/save_files.js; src/save_compatibility.js. | A04; inferred adaptation, not a source feature claim |
| T16 | PROPOSAL: Give a restored backup a visible loss-of-recent-progress notice. Owner: src/save_files.js; src/save_compatibility.js. | A04; inferred adaptation, not a source feature claim |
| T17 | PROPOSAL: Preserve the intended work target when a missing input pauses it. Owner: src/feature_expansion_work_plan.js; src/simulation.js. | A03/A09; inferred adaptation, not a source feature claim |
| T18 | PROPOSAL: Label a rate estimate as projected and a settlement as actual. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A08/A09; inferred adaptation, not a source feature claim |
| T19 | PROPOSAL: Expose the source of one active modifier beside its effect. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A06/A08; inferred adaptation, not a source feature claim |
| T20 | PROPOSAL: Keep owned, assigned and currently usable support distinct in one local row. Owner: src/npc_lives.js; world CAMPAIGN.md. | A05/A12; inferred adaptation, not a source feature claim |

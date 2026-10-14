# bitburner: twenty small original touches

These are YAIR proposals, not twenty claims that the source has these features. Rows T01-T12 use the game-specific aspect takeaways. T13-T20 are recurring cross-game design checks; they should be deduplicated by the coordinator, not counted as twenty unique mechanics per game. All remain unselected and have the packet gates in [IMPLEMENTATION_PACKETS](IMPLEMENTATION_PACKETS.md).

| Code | Original touch / owner | Inspiration and evidence limit |
|---|---|---|
| T01 | PROPOSAL: Deliver a local letter with a distinct heard/read/rumor consequence; do not silently equate it with joining a faction. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A01; covered |
| T02 | PROPOSAL: Keep a readable known-document shelf alongside the action panels. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A02; covered |
| T03 | PROPOSAL: Keep visible finite work costs and cancellation in the existing routine owner. Owner: src/feature_expansion_work_plan.js; src/simulation.js. | A03; covered |
| T04 | PROPOSAL: Explain export format and last successful write without treating a toast as validation of every loader. Owner: src/save_files.js; src/save_compatibility.js. | A04; covered |
| T05 | PROPOSAL: Reject an asynchronous NPC choice if its world state changed while deciding. Owner: src/npc_lives.js; world CAMPAIGN.md. | A05; partial |
| T06 | PROPOSAL: At 1440x900, show the routine, its budget and actual result beside current work; retain separate reading/log regions. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A06; covered |
| T07 | PROPOSAL: Use declarative content IDs for local research; do not add executable closures to YAIR content. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md. | A07; partial |
| T08 | PROPOSAL: Label measured versus predicted rates and state the confidence boundary. Owner: src/feature_expansion_work_plan.js; src/simulation.js. | A08; partial |
| T09 | PROPOSAL: Separate saved plan ownership from current eligibility to run. Owner: src/feature_expansion_work_plan.js; src/simulation.js. | A09; covered |
| T10 | PROPOSAL: Teach one real local action and reveal its next usable consequence. Owner: src/native_discovery_policy.js; src/observation_channels.js. | A10; covered |
| T11 | PROPOSAL: Use precise stop controls and a save preview with useful identity fields. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A11; covered |
| T12 | PROPOSAL: Keep mini-games optional and attach rewards to named local means. Owner: docs/worlds/ABILITY_AUTHORING.md. | A12; partial |
| T13 | PROPOSAL: Show a scene as encountered only after its delivery route succeeds. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A01/A02; inferred adaptation, not a source feature claim |
| T14 | PROPOSAL: Keep a known scene available for rereading without replaying its reward. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A02/A04; inferred adaptation, not a source feature claim |
| T15 | PROPOSAL: Show the last successful save time separately from a failed attempt. Owner: src/save_files.js; src/save_compatibility.js. | A04; inferred adaptation, not a source feature claim |
| T16 | PROPOSAL: Give a restored backup a visible loss-of-recent-progress notice. Owner: src/save_files.js; src/save_compatibility.js. | A04; inferred adaptation, not a source feature claim |
| T17 | PROPOSAL: Preserve the intended work target when a missing input pauses it. Owner: src/feature_expansion_work_plan.js; src/simulation.js. | A03/A09; inferred adaptation, not a source feature claim |
| T18 | PROPOSAL: Label a rate estimate as projected and a settlement as actual. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A08/A09; inferred adaptation, not a source feature claim |
| T19 | PROPOSAL: Expose the source of one active modifier beside its effect. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A06/A08; inferred adaptation, not a source feature claim |
| T20 | PROPOSAL: Keep owned, assigned and currently usable support distinct in one local row. Owner: src/npc_lives.js; world CAMPAIGN.md. | A05/A12; inferred adaptation, not a source feature claim |

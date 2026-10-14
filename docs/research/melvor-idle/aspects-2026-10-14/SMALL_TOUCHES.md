# melvor-idle: twenty small original touches

These are YAIR proposals, not twenty claims that the source has these features. Rows T01-T12 use the game-specific aspect takeaways. T13-T20 are recurring cross-game design checks; they should be deduplicated by the coordinator, not counted as twenty unique mechanics per game. All remain unselected and have the packet gates in [IMPLEMENTATION_PACKETS](IMPLEMENTATION_PACKETS.md).

| Code | Original touch / owner | Inspiration and evidence limit |
|---|---|---|
| T01 | PROPOSAL: Keep a gated known-lore shelf and a separate conversation owner. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A01; partial |
| T02 | PROPOSAL: Recheck actual known requirements when presenting a readable document. Owner: src/native_discovery_policy.js; src/observation_channels.js. | A02; partial |
| T03 | PROPOSAL: Reuse stable IDs and the common publisher; declarations are an interface reference only. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md. | A03; partial |
| T04 | PROPOSAL: Preserve unresolved content identity and show import metadata before replacement. Owner: src/save_files.js; src/save_compatibility.js. | A04; partial |
| T05 | PROPOSAL: Keep enemy combat controller claims separate from world NPC simulation. Owner: src/npc_lives.js; world CAMPAIGN.md. | A05; partial |
| T06 | PROPOSAL: At 1440x900, use separate action, support and actual settlement views if selected. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A06; partial |
| T07 | PROPOSAL: Validate references and missing content without creating a second inventory/publisher. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md. | A07; partial |
| T08 | PROPOSAL: Keep recipe mastery and currently supported modifiers distinct. Owner: docs/worlds/ABILITY_AUTHORING.md. | A08; partial |
| T09 | PROPOSAL: Separate declared cap from proven offline settlement. Owner: src/feature_expansion_work_plan.js; src/simulation.js. | A09; partial |
| T10 | PROPOSAL: Tie tutorial completion to native action events and save its stage identity. Owner: src/native_discovery_policy.js; src/observation_channels.js. | A10; partial |
| T11 | PROPOSAL: Name actual gained/lost resources and failed capacity in a settlement view. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A11; partial |
| T12 | PROPOSAL: Keep discovered, owned, equipped and supported means distinct when extending a local system. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md. | A12; partial |
| T13 | PROPOSAL: Show a scene as encountered only after its delivery route succeeds. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A01/A02; inferred adaptation, not a source feature claim |
| T14 | PROPOSAL: Keep a known scene available for rereading without replaying its reward. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A02/A04; inferred adaptation, not a source feature claim |
| T15 | PROPOSAL: Show the last successful save time separately from a failed attempt. Owner: src/save_files.js; src/save_compatibility.js. | A04; inferred adaptation, not a source feature claim |
| T16 | PROPOSAL: Give a restored backup a visible loss-of-recent-progress notice. Owner: src/save_files.js; src/save_compatibility.js. | A04; inferred adaptation, not a source feature claim |
| T17 | PROPOSAL: Preserve the intended work target when a missing input pauses it. Owner: src/feature_expansion_work_plan.js; src/simulation.js. | A03/A09; inferred adaptation, not a source feature claim |
| T18 | PROPOSAL: Label a rate estimate as projected and a settlement as actual. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A08/A09; inferred adaptation, not a source feature claim |
| T19 | PROPOSAL: Expose the source of one active modifier beside its effect. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A06/A08; inferred adaptation, not a source feature claim |
| T20 | PROPOSAL: Keep owned, assigned and currently usable support distinct in one local row. Owner: src/npc_lives.js; world CAMPAIGN.md. | A05/A12; inferred adaptation, not a source feature claim |

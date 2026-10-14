# trimps-antimatter: twenty small original touches

These are YAIR proposals, not twenty claims that the source has these features. Rows T01-T12 use the game-specific aspect takeaways. T13-T20 are recurring cross-game design checks; they should be deduplicated by the coordinator, not counted as twenty unique mechanics per game. All remain unselected and have the packet gates in [IMPLEMENTATION_PACKETS](IMPLEMENTATION_PACKETS.md).

| Code | Original touch / owner | Inspiration and evidence limit |
|---|---|---|
| T01 | PROPOSAL: Separate earned dialogue eligibility, witnessed speech and replay history. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A01; covered |
| T02 | PROPOSAL: Give a known scene a reread route while leaving unseen text out. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A02; covered |
| T03 | PROPOSAL: Prefer a small existing plan vocabulary before selecting a full script language. Owner: src/feature_expansion_work_plan.js; src/simulation.js. | A03; covered |
| T04 | PROPOSAL: Separate parse, compatibility review and state replacement; retain a last-good route. Owner: src/save_files.js; src/save_compatibility.js. | A04; covered |
| T05 | PROPOSAL: Name policies as automation and avoid presenting counters as individual lives. Owner: src/npc_lives.js; world CAMPAIGN.md. | A05; partial |
| T06 | PROPOSAL: At 1440x900, make current policy, local rule and actual result visible together. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A06; covered |
| T07 | PROPOSAL: Give a finite native routine a validated command set and explicit unsupported operations. Owner: src/feature_expansion_work_plan.js; src/simulation.js. | A07; covered |
| T08 | PROPOSAL: Use domain-specific display formats without silently changing units or clipping persistence. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md. | A08; partial |
| T09 | PROPOSAL: Persist plan position only with an explicit restart/revalidation policy. Owner: src/feature_expansion_work_plan.js; src/simulation.js. | A09; partial |
| T10 | PROPOSAL: Keep an owned tool visible when a local rule blocks its use and name the rule. Owner: src/native_discovery_policy.js; src/observation_channels.js. | A10; covered |
| T11 | PROPOSAL: Offer reduced-motion and readable logs without losing content access. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A11; covered |
| T12 | PROPOSAL: Make a later local challenge change action rules, not just add a bigger number. Owner: docs/worlds/ABILITY_AUTHORING.md. | A12; partial |
| T13 | PROPOSAL: Show a scene as encountered only after its delivery route succeeds. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A01/A02; inferred adaptation, not a source feature claim |
| T14 | PROPOSAL: Keep a known scene available for rereading without replaying its reward. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js. | A02/A04; inferred adaptation, not a source feature claim |
| T15 | PROPOSAL: Show the last successful save time separately from a failed attempt. Owner: src/save_files.js; src/save_compatibility.js. | A04; inferred adaptation, not a source feature claim |
| T16 | PROPOSAL: Give a restored backup a visible loss-of-recent-progress notice. Owner: src/save_files.js; src/save_compatibility.js. | A04; inferred adaptation, not a source feature claim |
| T17 | PROPOSAL: Preserve the intended work target when a missing input pauses it. Owner: src/feature_expansion_work_plan.js; src/simulation.js. | A03/A09; inferred adaptation, not a source feature claim |
| T18 | PROPOSAL: Label a rate estimate as projected and a settlement as actual. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A08/A09; inferred adaptation, not a source feature claim |
| T19 | PROPOSAL: Expose the source of one active modifier beside its effect. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. | A06/A08; inferred adaptation, not a source feature claim |
| T20 | PROPOSAL: Keep owned, assigned and currently usable support distinct in one local row. Owner: src/npc_lives.js; world CAMPAIGN.md. | A05/A12; inferred adaptation, not a source feature claim |

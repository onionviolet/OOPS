You are a lane for nonhuman player starts in a browser idle RPG (YAIRPG, a text life-sim across many worlds). Read /Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/nonhuman-starts-2026-10-14/COMMON.md, /Users/weiwei/code/yet-another-idle-rpg/AGENTS.md and /Users/weiwei/code/yet-another-idle-rpg/docs/worlds/NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md (all rounds, including SB1-SB12, OT1-OT25) first and follow them. The research corpus is docs/worlds/NONHUMAN_*_2026-10-14.md and docs/worlds/paradise-hub/*_2026-10-14.md; also /Users/weiwei/code/yet-another-idle-rpg/docs/COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md (another session's owner for traveling companions) and /Users/weiwei/code/yet-another-idle-rpg/docs/CORE_FOUNDATIONS_SCORECARD_2026-10-14.md. Reference existing codes instead of repeating content. Do not edit any of them.
Also read /Users/weiwei/code/yet-another-idle-rpg/PROJECT.md (top sections), /Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/foundation-adoption-next-2026-10-13/CHECKPOINT.md, /Users/weiwei/code/yet-another-idle-rpg/docs/SHARED_FOUNDATIONS_AUDIT_2026-10-12.md, package.json, the tests/ folder layout and the engine spec's touch list. Read code you cite.

You are the IMPLEMENTATION IMPLICATIONS lane. Write /Users/weiwei/code/yet-another-idle-rpg/docs/worlds/NONHUMAN_IMPLEMENTATION_IMPLICATIONS_2026-10-14.md:
1. What changes in existing systems if nonhuman starts land (stats, skills, equipment, combat, travel, housing, dialogue, heirs, saves, UI), with blast radius per touch group and file:line.
2. Sequencing against active work: the foundation adoption chain, status window, structured starts, other open gates; what nonhuman Slice 1 should wait for, can run beside, or would unblock. No reprioritizing; describe dependencies.
3. Save and compatibility: migrations, version bumps, old-save behavior, export/import gates, rollback.
4. Testing: unit fixtures (N32), lint (N33), regression slices for human play, browser journeys at 1366x768, cost of each.
5. Performance and save size with many bodies (OT15), and caps.
6. Content cost: authoring hours per body kind, per world start, per cheat, relative sizes.
7. Risk register (IM-R1..) and decision points that need Weibao only where they change his direction (IM-Q1..).
8. A minimum viable path: the fewest changes for one playable nonhuman start that preserves existing saves, as a step list.
Keep CHECKPOINT.md in /Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/nonhuman-starts-2026-10-14/implications/.

Lane A1: headless playtest sweep of YAIRPG (2026-10-25). Authority: Weibao asked to send out parallel Codex work tonight to use spare usage. Coordinator: Claude session "Codex lanes" in the primary checkout.

Read AGENTS.md and docs/RULES_INDEX.md first (router row for playtests/reviews). Then use the `yairpg-game` MCP (game_new, game_look, game_click, game_step, game_save, game_load, game_export) to play the current build as a player would.

Goal: find what a real player hits. Play several fresh lives, each for multiple in-game days, covering: the Frontier/village start and ordinary livelihood, crafting/workshop and gear, household/manor and home staff, Mistglass cultivation (condensation, vessel geometry, seedbed, brood, formulation/medicine, trials), combat and the combat review, continuation into a new life (law memory, baggage), and the LOTM Tingen branch (both Sequence 9 pathways, districts). Exercise save, load and export at least once per life.

Log every defect, dead end, softlock, misleading or unexplained label, number that looks wrong, missing feedback, and pacing stall (long stretches with nothing worth doing). For each: short code (P1, P2...), area, exact reproduction steps from game_new, what you expected, what happened, severity (blocker / bug / confusing / pacing / polish). Also list what felt good. When an MCP limit blocks or slows you, call game_report_limit once and continue with a workaround.

Write the report to docs/reviews/PLAYTEST_SWEEP_2026-10-25.md (create it; you own only this file plus scratch under docs/gm/dispatch/codex-parallel-2026-10-25/a1-scratch/). Start the report with the git HEAD and a note that the primary checkout has other agents' uncommitted runtime edits in flight, so findings are against that live state. Update the report as you go so partial results survive.

Hard limits: read-only on src/, tests/, dist/ and every other doc. Do not fix anything. Sealed secrets: never write a secret's truth into the report; refer by ID and route. No commits, stash, reset or branch changes. No pkill -f. Finish with a one-paragraph summary ranking the top five findings.

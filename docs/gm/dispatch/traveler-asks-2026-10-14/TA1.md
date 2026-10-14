# TA1: Village traveler asks v2 (code)

Read COMMON.md and PLAN.md in `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/traveler-asks-2026-10-14/` first. Worktree `.claude/worktrees/ta1-village-asks`, branch `proc/ta1-village-asks`, port 22420. Lane folder `docs/gm/dispatch/traveler-asks-2026-10-14/ta1/` inside the worktree.

Goal: a new Village save gives travelers asks a fresh player can reasonably fill, that fit who the traveler is and the frontier Village, with a fee that matches the effort. Covers PLAN TA-A1 to TA-A5 and TA-C1, TA-C2, TA-C5. Keep TA-C4 possible.

Stages (commit per stage, update CHECKPOINT each time):
1. **Obtainability index.** Pure module reading live data (Village trader stock, gather actions, known starting recipes, starting inventory, common drops with rate) that returns, per item, its routes, earliest stage and rough effort minutes. Unit tests on real tables. Report which current asks fail.
2. **Ask table.** Per-template, tagged ask entries (item, quantity range, fiction line, optional season/weather tag) drawn only from items with a fresh-player route. Keep Rat pelt or Rat tail only as rarer, better-paid asks if they stay; never the common case. Fee from trader price or effort minutes, integer coins, unit-tested.
3. **Contract rev 2.** Bump generation and request contract revisions. Rev-1 travelers and requests still validate and play exactly as before; new enrollments use rev 2. Revisioned stream address for new draws. Validators accept `quantity` above 1 for rev 2 only. No rewrite of saved goals.
4. **Lint and replay.** Extend `scripts/lint_story_spine.mjs` so an unreachable or mispriced ask fails, and `scripts/run_story_spine.mjs` so same-seed replay stays exact. Add a known-source hint on the request line when the player has seen that source (no reveal otherwise).
5. **Browser proof.** Fresh profiles, several seeds: meet travelers, take and deliver a rev-2 ask through its ordinary route (buy or gather), read recap, Save/reload, Export and literal Import. Also load a rev-1 save fixture made with the current game code and show its request still settles. Desktop viewports only.

Done when: `npm test` and build pass; lint shows every rev-2 ask reachable; natural proof delivers at least two different rev-2 asks across seeds; rev-1 compatibility proven; REPORT lists the ask table so Weibao can judge it.

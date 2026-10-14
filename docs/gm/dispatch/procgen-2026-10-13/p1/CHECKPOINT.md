# P1 seeded core loop checkpoint

Local completion: 2026-10-14 EDT, within the 2026-10-13 dispatch. Writer: this P1 task; worktree `proc-p1-streams`, branch `proc/p1-streams`, port 19310. Initial working tree clean. Main checkout read-only.

Authority: COMMON/PLAN and the user's P1 dispatch; [E1](../../../../emergent/E1_SEEDED_STREAMS.md) is the design input. Core migration complete. Cheats and other workers' systems deferred. Desktop proof at 1366x768 and 1600x1000 passed; mobile deferred.

Eight focused SOURCE checks and 629 full-suite tests PASS. Build and served-bundle hash PASS. Seeded-native pending fight, positive loot replay, next lineup, trader epoch replay, Save/reload and UI Export/literal Import PASS. Manual Save writes verified. See [REPORT](REPORT.md), [browser evidence](BROWSER_EVIDENCE.json), [checks](CHECKS.json), [BACKLOG](BACKLOG.md).

Compatibility: root derives once from saved expansion RNG; pre-expansion saves use native fallback seed 1 without changing legacy expansion RNG. Stream schema 1 is additive. Native encounters save enemy health/stats/identity and pending per-fighter turns, including the valid last-kill/clear boundary. Existing expansion, simulation and seeded duel generators remain unchanged.

Next: root integrates this branch, reconciles shared `main.js`/`save_files.js` edits and updates owning status. No worker merge or push. Rebuilt `dist/` and `index.html` stay unstaged. Report artifacts are synthetic fixtures only; browser profiles are in `/private/tmp`.

You are lane `air-workshop` of the absorb-all wave. Follow `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/absorb-all-2026-10-14/COMMON.md` exactly; it holds the authorization and rules.
Worktree: `/Users/weiwei/code/yair-air-absorb-20261013/systems-cheats-completion (branch absorb/air-systems-cheats-completion)`. Assigned port: 18701. Report: `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/absorb-all-2026-10-14/reports/air-workshop.md`.

Finish the Air systems-cheats-completion absorb. Read `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/air-absorb-2026-10-13/SYSTEMS-CHEATS-COMPLETION.md` (its compatibility decision stands) and the prior report `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/air-absorb-2026-10-13/reports/systems-cheats-completion.md`.
1. Symlink node_modules from the main checkout. Merge `codex/gameplay-foundations` (0216ccde) into your branch and resolve conflicts preserving current behavior.
2. Fix the six failing workshop tests by adapting the workshop to the current simulation eligibility and clock/receipt validation APIs. Do not weaken validation to pass.
3. Run its browser scripts with the Playwright path in COMMON.md, then the full gate: fresh-origin 1366x768 workshop loop; old save (made on 0216ccde without workshop) loads unchanged; new save with workshop state survives save/reload/export/import.
Also update the old report's status line in your new report.

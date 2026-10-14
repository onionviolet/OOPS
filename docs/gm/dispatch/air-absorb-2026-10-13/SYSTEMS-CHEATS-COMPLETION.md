# Absorb systems-cheats-completion

Follow `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/air-absorb-2026-10-13/COMMON.md` exactly.

Worktree: `/Users/weiwei/code/yair-air-absorb-20261013/systems-cheats-completion/` (branch `absorb/air-systems-cheats-completion`). Report: `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/air-absorb-2026-10-13/reports/systems-cheats-completion.md`.

Snapshot(s): `/Users/weiwei/MacTransferArchive/yair-private-work-20261013-extract/.codex/worktrees/systems-cheats-completion/yet-another-idle-rpg/`. Base commit `53dc1df158`. Inventory sections: `## systems-cheats-completion` in `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/air-absorb-2026-10-13/INVENTORY.txt`.

## Authorization (2026-10-13, second attempt)

The first attempt (`reports/systems-cheats-completion.attempt1.md`) stopped for want of an authorizing record. Weibao has since directed, in this session, that the Air worktrees be absorbed. That is the authorization: port the systems workshop and irrigation model as a labelled **proposal** feature (Weibao is creative director; AGENTS.md lets agents make reasonable reversible prototype choices, labelled as proposals). Compatibility decision, made here: all new state is optional and absent from older saves; loading an old save must leave it untouched and behave exactly as before until the player opens the workshop. Exports from a new save that contain workshop state must import cleanly; envelope validation must accept saves without it. Keep it opt-in from the UI, desktop/laptop first.

Adapt the snapshot's workshop files and its tests to the current simulation APIs instead of copying the snapshot's broad `main.js`/`save_files.js`/`index.html`. Gate: rebuild, focused tests plus `npm test`, fresh-origin desktop browser run of the workshop loop, and save/reload/export/import with both an old save and a new save. Anything not exercised is implemented-unverified in your report. Commit on your branch only.

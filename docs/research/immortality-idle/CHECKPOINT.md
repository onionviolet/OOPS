# Immortality Idle checkpoint

**Status: COMPLETE, source-only.** 2026-10-13. No YAIR source, repository-bank or PROJECT edits by this lane. No commit.

## Source

`immortalityidle/immortalityidle.github.io` main @ `c7231bae717b67a8e4dba2a3775d58bfbfadbdd6` (2026-10-13), v2.0.0. Shallow clone in session scratch, read-only; no npm install, scripts or build. License: none (README informal permission). Code reuse not permitted without author permission; ideas only.

Suggested [repository bank](../repository-bank/README.md) entry, not yet added: Immortality Idle, progression / life-sim lane, head `c7231bae717b`, no license (ideas-only). Seed files: `src/app/game-state/activity.service.ts`, `character.service.ts`, `home.service.ts`, `game-state.service.ts`.

## Coverage

| Area | State |
|---|---|
| Schedule, triggers, spirit activity, apprenticeship, family specialty | Read (activity.service.ts core loop and requirement code) |
| Aging, death, reincarnation, aptitude curve, ascensions | Read (character.service.ts) |
| Workstations, equipment crafting, feng shui, home tick | Read (home.service.ts selected functions) |
| Followers aging, triggers, reset | Read (followers.service.ts selected functions) |
| Manuals, achievements, memories | Sampled (about 40 manuals listed; 8 of 130 achievements read) |
| Contemplation concepts | Read structure and discovery |
| Family techniques | Read generation, growth, archive |
| Impossible tasks | Read |
| Hells | Structure plus 3 of 19 read |
| Offline/main loop | Read |
| Save/import/export/avatar challenge | Read |
| Layout | Panel list, default layout, grid template |
| YAIR comparison | Survey plus direct spot checks of chronicle.js, simulation.js, titles.js, life_experience.js, technique_content.js, models/location.js |

## Unread or partial

- 109 activity definitions: about 5 read in full.
- battle.service.ts (4.6k lines): combat math, enemies, formations.
- 16 of 19 hells; pantheon gods and duels; Yama.
- farm.service.ts beyond field aging.
- inventory.service.ts beyond food and auto-entry shapes.
- Location unlock rules per location; distant realms.
- All UI components except layout and life summary; the mobile layout.
- The classic and experimental builds in `docs/`.
- No gameplay or browser run.

## Future pass

No download or decompile needed: the full source is public. A follow-up would read the unread areas above, starting with the hells (rule zones) and battle code if F11 or F12 is wanted.

## Remaining gates

The packets are proposals. Any build needs Weibao's authorization, a migration or compatibility decision for persistence, and rebuilt desktop browser evidence per AGENTS.md.

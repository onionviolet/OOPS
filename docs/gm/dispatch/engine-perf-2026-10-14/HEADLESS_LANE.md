# Headless full-game runner (wave C), 2026-10-14

Branch `claude/wave-c-headless-0f7b1d`. Code: `scripts/headless/` (usage in its
README). Test: `node --test tests/headless/*.test.js`. No `src/` edits.

## What it is

The real `src/main.js` bundle (native game, every expansion, presentation code)
boots in Node against an in-process DOM parsed from `index.html`, the linked
stylesheets' visibility rules, in-memory storage, seeded `Math.random`/`crypto`
and a frozen `Date`. Time moves only through the engine's `advanceTicks`. Actions
are user clicks on the same selectors Chrome uses, or the `window` functions the
markup calls. Save, export and import run the real paths, including the import
preflight `<iframe>`, which runs as a second game instance in a swapped realm.

## Evidence

| Check | Result |
| --- | --- |
| Village route parity (elder, craftsman, equip axe, 60 min woodcutting, buy coal, smelt, 30 min) | Chrome and headless saves canonically identical at all 4 checkpoints (det.cjs form), twice. Headless 5-8 s, Chrome 20-24 s. |
| Route determinism | Two headless runs give the identical final save. |
| save -> load | Exact after the first load (see F2). export -> import through the real preflight frame: exact. |
| Tests | 5/5 pass, 32 s wall at load average ~120. |

## Speed (game minutes per wall / CPU second)

Measured at load averages 80-180 on 18 cores; not a quiet host.

| Fixture | min / wall s | min / CPU s | 24 h projected |
| --- | --- | --- | --- |
| fresh (1440 min run) | 31 | 37 | 46 s wall, 39 s CPU |
| natural-final-save (workshop, clock 66) | 11 | 11 | ~130 s |
| mid.json | 11 | 11 | ~130 s |
| crowded.json | 3 | 3 | ~8 min |

The 30 s target for 24 game hours is **not met** on this host. Profiles show
stepping is ~98% inside the engine's own tick (`update_timer` -> `persistExpansion`,
`featureWaveContext`, `campaignContext`, `worldCompletionFacts`, structuredClone,
autosave `setItem`); the harness DOM is ~2%. Fresh is ~30 ms CPU per tick,
developed ~90-130 ms. Faster stepping needs engine work, not runner work. Chrome
pays the same tick cost plus browser overhead, and headless runs in parallel
processes without Chrome's cores.

## Command entry points

`node scripts/headless/entry_points.mjs` lists them statically: 82 `window`
functions, 82 inline handler names, 41 data-* action attribute families. The
runner reaches all of them generically (`click`, `call`, `fill`, `key`);
`clickables()` lists what is visible and enabled now, as a bot menu.
Exercised by the route and tests: location choice dropdowns, `data-dialogue`,
`data-textline`, `end_dialogue`, inventory `[equip]` delegation, `data-activity`,
`end_activity`, `data-trader`/`startTrade`, trader item delegation,
`acceptTrade`, `exitTrade`, `openCraftingWindow`, `switchCraftingRecipesPage`,
recipe selection, `data-craft-commit`, `closeCraftingWindow`, `saveProgress`,
`save_to_file`, `load_progress`, PLAY and hero-creation Confirm.

## Findings

- **F1 (bug, src owner):** a fresh game that takes the Village patrol job throws
  after two game hours: `update_gathering_tooltip` reads
  `activity.gained_resources.skill_required` on a Job (display.js, called from
  main.js's activity tick). Reproduced identically in Chrome's dev stepper and
  headless; the live tick likely halts the clock the same way (inferred, not run).
  The route avoids the patrol.
- **F2 (info):** a fresh game's first save omits default zeros that load fills
  in (735 NPC skill-XP entries, `options.disable_combat_autoswitch`). After one
  load, save -> load is a fixed point.
- **F3 (info):** dialogue textline `p23 moon bed` shows "text not found" in the
  English locale (visible as the elder's first option).

## Seams (none required; all worked around)

- **S1 (proposed, main.js):** `advanceTicks(n, {render:'skip'})` that discards
  deferred renders instead of flushing them. On developed saves one flush costs
  ~1 s; bulk simulation could render once at the end. Workaround: larger
  `step(..., {chunk})`.
- **S2 (proposed):** a supported internals export. The runner appends a
  `__headless` getter object to main.js at bundle time (never on disk).

## Limits

No layout (geometry is zero), no CSS beyond display/visibility, desktop
1366x768 media only. One live game per Node process. `console` output from the
game goes to `game.logs` until `game.close()`.

# UI density audit evidence (2026-10-13)

Evidence for [the audit report](../../UI_DENSITY_AND_ORIGINAL_COMPARISON_AUDIT_2026-10-13.md).

## Contents

- `screenshots/`: paired captures named `<State>_<variant>_<viewport>_<build>.png`.
  - Builds are `original` (v0.5.5.30 `e3356432`), `v06` (dev base `25afe1a8`), `current` (`dd3efe33`, bundle `451be34e`) and `proto23` (live site).
  - `@150pct` marks emulated 150% zoom.
  - `Z_loading_*` is the PLAY blocker.
  - `S1_findwork_open_*` shows Local actions after opening Find work.
- `measurements.json` contains:
  - `fingerprint`;
  - `states` (how each state was built);
  - `rows` (metric records with build, state, viewport, zoom, metric ID, value, units, method and uncertainty);
  - `t1` (opening-screen detail);
  - `a11y_probe`;
  - `proto23_live`;
  - `s1_findwork`;
  - `zoom_play_blocker`.
- `scripts/`: the Playwright drivers used. They expect the three builds served at `127.0.0.1:18801` (current), `:18802` (original) and `:18803` (v0.6), and Google Chrome at its standard macOS path. Paths to the scratch save fixtures are hard-coded and must be regenerated.

## Reproducing the states

1. Serve each build on its own port, so each gets its own fresh origin.
   - Original and v0.6 run from scratch `git worktree`s.
   - Current runs from the shared checkout, read only.
2. Run `steps.cjs <build> "click:Talk to someone" "any:village elder" autotalk "click:Talk to someone" "any:village elder" autotalk save:<file>`. This produces the post-elder save through the UI.
3. Run `patch.py`. It adds the same disposable state to each save:
   - 29 inventory stacks drawn from item IDs common to both item tables;
   - money 5000;
   - crafting and gathering flags;
   - XP in 14 skills (Meditation excluded; its reward crashes the original loader).
4. Run `states.cjs` and `reach.cjs` with `PLAN` set to a JSON job list. They load the save into a fresh origin, click the route, screenshot and measure.
   - The 150% zoom jobs need the scripted PLAY click in `lib.cjs`. That is an artificial step, because PLAY is unreachable at that zoom (finding F5).

No personal save was opened or copied. Save fixtures were kept out of this directory because the expansion envelope lists content IDs.

Build: not run; this lane adds a static checker.  
Route: Q7 / IPC61 / FND1; GR1, GR11, GR12, GR16.  
State: checker and fixture committed; agent-verified, not human-reviewed.  
Viewport: not applicable.  
Persistence: not changed.  
Tests: focused checker fixture passed; `npm run check:arch` and `npm run check:rules` passed.  
Review: source-level census only; detector signals need manual inspection.  
Surface: scripts, package entry, fixture, and report.

Added [check_generators.mjs](/Users/weiwei/.codex/worktrees/q7-generator-census/yet-another-idle-rpg/scripts/check_generators.mjs) and the `check:generators` npm entry. The first-run table is in [GENERATOR_CENSUS_2026-10-26.md](/Users/weiwei/.codex/worktrees/q7-generator-census/yet-another-idle-rpg/docs/reviews/GENERATOR_CENSUS_2026-10-26.md). It covers the addressed helper family exported by `gen_kit.js`; the deliberately unshaped fixture appears as an excluded row. The script returns non-zero for missing signals only with `--strict`.

Checks run:

- `node --test tests/check_generators.test.js`: passed.
- `npm run check:arch`: passed.
- `npm run check:rules`: passed.
- `git diff --check`: passed.

One earlier malformed test invocation started the repository test script; I did not rely on it as verification. No generator source was changed.

Branch `codex/q7-generator-census-2026-10-26`, commit `3631ecd37fb9201460e79dce896c5e219e8171c5`. The untracked dispatch directory remains untouched. No build, gameplay, or persistence claim is made. The shared-worktree contract says never push.


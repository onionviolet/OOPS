build: `4987a62a2f3b22f1f31b574f2e5ef0f35379db11142873a6407c6ccfbd98ee8f` (SHA-256 of `dist/bundle.js`)
route: fixture(`tests/build_output.test.js`)
state: built
viewport: n/a
persistence: unchanged
tests: `tests/build_output.test.js`
review: diff-scoped
surface: `build.js`; 0 new cycle edges; 0 registration lines paid

**Changed:** `BUILD_OUT=<dir>` writes a bundle, source map and page copy to that directory, with the page’s bundle link pointing to its own build. Added the lane build and serve commands to [SHARED_WORKTREE_PRACTICE.md](/Users/weiwei/.codex/worktrees/q1-lane-build/yet-another-idle-rpg/docs/gm/SHARED_WORKTREE_PRACTICE.md).

**Checks:**

- `node --test tests/build_output.test.js` passed: two output directories built back to back; `index.html` and `dist/` stayed clean.
- Compared the no-variable build with the original builder from this branch: generated HTML and every `dist/` file matched byte-for-byte.
- `npm run check:arch` passed.
- `npm run check:rules` passed.
- `git diff --check` passed.

Committed as `4bb8d9aa` on `codex/q1-lane-build-2026-10-26`. The untracked queue dispatch directory remains untouched and uncommitted. No gameplay browser route was exercised; this lane changed build tooling only.
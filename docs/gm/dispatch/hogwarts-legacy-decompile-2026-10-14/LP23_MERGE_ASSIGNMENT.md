# LP2 + LP3 merge reconciliation

Dispatched 2026-10-14 by Claude Code under Weibao's "merge passing LP
slices with build/test/smoke and push" authorization. You are the
reconciliation lane. Read LP_COMMON.md (below) for gates and rules.

## State

- Worktree `.claude/worktrees/hl-integration`, branch `hl/integration`.
  It is at the merged tip of `codex/gameplay-foundations` (2e166ce6) plus
  `Merge LP2 slice` (clean) and `Merge LP3 slice; tests pending
  reconciliation`.
- Coordinator's resolution in `src/lever_lesson.js`: practice command keeps
  LP2's `revision:2` and `returned` requirement AND LP3's brace cost and
  label; task-record sentence names the brace. `tests/lever_lesson.test.js`
  took LP2's header (frozen v1 LP1 definitions).
- Read LP2_REPORT.md (its M1 merge note) and LP3_REPORT.md in
  `docs/research/hogwarts-legacy/`.
- `node --test tests/lever_lesson.test.js tests/lever_assignment.test.js
  tests/lp3_practice_supply.test.js`: 9 pass, 7 fail. Each slice's tests
  assume only its own requirement (LP2 tests lack a brace; LP3 tests lack
  LP2's evidence and return; one LP1 test calls an undefined `fixture()`).

## Task

1. Make the combined behavior correct: real practice needs LP2's evidence,
   return and rule check AND LP3's brace. Fix source only if the combined
   rule is actually wrong; otherwise fix the tests' fixtures/helpers so each
   test supplies the other slice's prerequisites. Keep every test's
   original intent. Keep LP1 frozen-v1 and pre-LP3 compatibility tests.
2. Old saves: an LP1-learned or LP1-pending save, and a pre-LP3 pending
   practice, still load and behave as each report promised.
3. Gates on this branch: `npm run build`, focused tests, full `npm test`
   (0 fail), and a combined fresh-origin browser run at 1366x768 on port
   **8203** of the whole path: LP3 brace from the bench, LP2 evidence in
   both orders and return, LP1 practice consuming the brace, then the
   changed task, plus Save/reload/Export/literal Import mid-practice.
   Reuse the lanes' browser scripts where possible.
4. Commit on `hl/integration` (no Co-Authored-By, no push, no merge into
   gameplay-foundations; the coordinator lands it). Rebuild `dist/` and
   commit it as the final commit. Append results to
   `docs/gm/dispatch/hogwarts-legacy-decompile-2026-10-14/INTEGRATION.md`
   on this branch.

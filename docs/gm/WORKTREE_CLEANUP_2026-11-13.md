# Worktree and branch cleanup, 2026-11-13

Execution receipt under AD41 and the
[primary-checkout procedure](SHARED_WORKTREE_PRACTICE.md#primary-checkout-default-2026-10-21),
on Weibao's instruction in chat ("Yes, retire them", then "Archive"). Not a new
cleanup rule.

## Before and after

| | Before | After |
| --- | --- | --- |
| Worktrees (with the primary checkout) | 30 | 4 |
| Local branches (with master) | 92 | 6 |
| `.claude/worktrees` on disk | 61 GB | 4.5 GB |

## What was done

- **Branches:** 86 deleted with `git branch -d` after each tip was checked as an
  ancestor of master (`a352a9d01`). Every tip is kept at
  `refs/archive/2026-11-13/<branch>`.
- **Worktrees:** 26 removed with plain `git worktree remove`: `yair-codex-g1` and
  25 lane worktrees under `.claude/worktrees/`. No force, reset or stash.
- **Sessions:** the 25 lane sessions were archived in the desktop app first, which
  stopped their processes. Their conversations stay in the Archived list.
- **Local changes cleared before removal:** rebuilt `dist/bundle.js`, its map and
  `index.html` (regenerable) in 17 worktrees, plus five untracked evidence files
  that were archived first (below).
- **Processes:** a process-cwd scan ran before each removal. Two probe runs left
  over from 2026-11-10 (`deeds-probe.mjs`, `canon-pull-probe.mjs`, each with a
  headless Chrome) were stopped by PID.

## Kept

| Item | Reason |
| --- | --- |
| `achievements-deeds-cea6d7` worktree and branch | Its session woke when its stale probe was stopped and started a new probe and `npm test`; archive refused |
| `fdn-s-spellcraft-ec4a66` worktree and branch | Archive refused: the app reports live work in the session |
| `yair-merge-1113b` and `claude/merge-2026-11-13b` | Today's merge worktree, at master's tip |
| `codex/contest-choice`, `codex/reconcile-foundation-worktrees` | Committed today |

Thirteen older sessions whose worktree folders were already gone were not touched.

## Recovery

Private directory, outside the repo: `/Users/weiwei/.codex/research/worktree-cleanup-2026-11-13`.

- `branches-deleted.txt`: branch and tip for every deleted branch.
- `worktrees-removed.txt`: folder and HEAD for each removed lane worktree.
- `news-travels-01dae3-untracked.tar.gz` (1 file) and
  `wave-integration-a25dc0-untracked.tar.gz` (4 files), with `SHA256SUMS`.

To bring a branch back: `git branch <name> refs/archive/2026-11-13/<name>`. To
restore evidence, make a worktree at the recorded HEAD and unpack the tarball in it.

## Checks

- `git worktree list`: 4 registrations, all 26 removed paths absent.
- `git for-each-ref refs/archive/2026-11-13`: 86 refs.
- Runtime build and tests are not evidence for this filesystem operation; no
  gameplay file was changed by it.

# Lane branch and worktree reconciliation (2026-11-07)

Status: inventory done; retirement carried out 2026-11-07 on Weibao's "continue accordingly" (see
[Outcome](#outcome-2026-11-07)). Nothing merged or pushed. Authority: [primary-checkout practice](SHARED_WORKTREE_PRACTICE.md#primary-checkout-default-2026-10-21).
Master at `778396479`. Upstream untouched.

## Method (three independent checks per branch)

1. **Files**: every file the branch added or changed since its merge-base exists on master.
2. **Lines**: each added line (trimmed) searched in master's version of the same file. "Absent"
   counts lines not on master; most absent lines are generated `dist/bundle.js*`, `index.html`
   registration lines and files master later edited.
3. **Commits**: every non-merge branch commit subject searched on master. `git cherry` reported 17
   branches with unapplied patches because the lanes landed as re-made commits, not by SHA.

Result: all 22 branches are content-landed. No branch carries unlanded work. The one-off
subject mismatches were checked by hand (see notes A and B).

## Table

Verdict key: **Landed** (content and commit subjects on master), **Landed, evolved** (master changed
the same files later, so branch versions are older), **Landed, merge-only** (branch is merge commits
plus work already on master).

| Branch | Worktree | Ahead / behind | Verdict | Evidence |
| --- | --- | --- | --- | --- |
| `bk-land-batch1` | none | 19 / 453 | Landed, merge-only | 3/3 non-merge subjects on master; 94 of 137 files identical, rest evolved; 170 of 3,536 added lines absent (ui_directions.css retokenized on master `2cac9c038`) |
| `claude/bk-land-ecb3eb` | none | 6 / 551 | Landed, evolved | 1/1 subject on master (`b177a2474`); Shadow Slave trial files last touched on master by `0d02a5302` (neutral names CLR3), so the 190 absent lines are the older wording |
| `claude/great-ritchie-bf0b79` | none | 3 / 809 | Landed, evolved | 3/3 subjects on master (L10 `cab7262b3`, `a5c5a3a09`; walk fix `ec5162e69`); ability_records and lotm_advancement later revised |
| `claude/rep-body-6297cb` | none | 3 / 830 | Landed | 3/3 subjects; 109 absent lines, 77 are `dist/bundle.js` |
| `claude/rep-character-sheet-860fe6` | `.claude/worktrees/rep-character-sheet-860fe6` now holds `claude/gifted-satoshi-29351f` at master | 3 / 821 | Landed | 2/3 subjects; third (drop duplicate stylesheet link) is already true on master (note A). **Worktree reused by another session: keep** |
| `claude/rep-combat-0445ef` | none | 8 / 831 | Landed | 8/8 subjects; 107 absent, 78 in dist bundle |
| `claude/rep-crafting-c0b04e` | `.claude/worktrees/rep-crafting-c0b04e` (1 dirty file) | 7 / 457 | Landed | Diff vs merge-base empty; 3/4 subjects, the fourth is an evidence PNG already on master (note B). Dirty `style.css` is a token cleanup already on master (note C) |
| `claude/rep-economy-24e336` | none | 2 / 828 | Landed | 2/2 subjects; 25 of 842 lines absent |
| `claude/rep-family-tree-b87ca8` | none | 2 / 832 | Landed | 2/2 subjects; 10 of 550 absent (registration lines) |
| `claude/rep-first-hour-31ff38` | none | 2 / 837 | Landed | 2/2 subjects; 0 of 256 lines absent |
| `claude/rep-items-6f02d9` | `.claude/worktrees/rep-items-6f02d9` (3 untracked gallery builds) | 2 / 767 | Landed | 2/2 subjects; 7 of 473 absent. Untracked `dist/item-card-gallery.*` are build output |
| `claude/rep-knowledge-b16f3d` | `.claude/worktrees/rep-knowledge-b16f3d` now holds `claude/infallible-villani-4c7d22` at master | 3 / 828 | Landed | 3/3 subjects; 7 of 774 absent. **Worktree reused by another session: keep** |
| `claude/rep-maps-be2acb` | none | 4 / 830 | Landed | 4/4 subjects; 13 of 692 absent |
| `claude/rep-mixing-6a1576` | none | 3 / 816 | Landed | 3/3 subjects; 1 of 489 absent |
| `claude/rep-organizations-09fe68` | `.claude/worktrees/rep-organizations-09fe68` (dist bundle modified) | 2 / 816 | Landed | 2/2 subjects; 7 of 512 absent |
| `claude/rep-research-e34f54` | `.claude/worktrees/rep-research-e34f54` (dist, index.html, gallery modified) | 2 / 813 | Landed | 2/2 subjects; 11 of 766 absent |
| `claude/rep-rituals-70a5e6` | `.claude/worktrees/rep-rituals-70a5e6` (dist, index.html, gallery modified) | 3 / 831 | Landed | 3/3 subjects; 14 of 905 absent |
| `claude/rep-spacetime-466c46` | none | 5 / 811 | Landed | 5/5 subjects; 2 of 317 absent |
| `claude/rep-talk-d8d734` | `.claude/worktrees/rep-talk-d8d734` (dist, index.html modified) | 2 / 767 | Landed | 2/2 subjects; 4 of 610 absent |
| `claude/rep-time-8afe25` | `.claude/worktrees/rep-time-8afe25` (dist, index.html, gallery modified) | 4 / 830 | Landed | 4/4 subjects; 14 of 909 absent |
| `claude/rep-worlds-173cee` | none | 3 / 829 | Landed | 3/3 subjects; 90 absent, 80 in dist bundle |
| `claude/zealous-joliot-b457ad` | `.claude/worktrees/zealous-joliot-b457ad` (1 dirty: SOURCE_LIBRARY_CATALOGUE.md, +750 lines) | 5 / 190 | Landed, merge-only | 4/4 subjects on master; master merged the MoL Zorian slice at `d22bd2362`. Absent lines are earlier states of files master kept editing (be_clients registry `b306310d5`). Dirty catalogue is a regenerated file, not branch work |

Not in the 22 but seen: `claude/zorian-s1-slice-ce2f91` (worktree, 3 dirty files, 0 commits ahead of
master, tip also contained in two other branches) and `work/perf-cpu-20261107/checkout` (detached
at `04c5fd798`, another session's perf run: leave alone).

## Notes

- **A.** `figure-gallery.html` on master has no `character_sheet.css` link; the branch commit only
  removed that duplicate.
- **B.** `workshop-panel-21px-partial-1920.png` is already on master at the same path.
- **C.** Master `style.css` already has the `var(--ui-space-3)` form of the `.workshop_scene` rule
  that the crafting worktree has uncommitted.
- Every "dist/bundle.js" absence is a generated file; rebuild, do not merge.
- Weakness of the check: line-presence is not proof of identical behavior. It would miss a branch
  line that master has elsewhere in the same file but with different surroundings. Subject and file
  checks agree on every branch, and no branch has files missing from master.

## Retirement proposal (Weibao decides; nothing done)

- **Safe to retire, no worktree (12 branches):** `bk-land-batch1`, `claude/bk-land-ecb3eb`,
  `claude/great-ritchie-bf0b79`, `claude/rep-body-6297cb`, `claude/rep-combat-0445ef`,
  `claude/rep-economy-24e336`, `claude/rep-family-tree-b87ca8`, `claude/rep-first-hour-31ff38`,
  `claude/rep-maps-be2acb`, `claude/rep-mixing-6a1576`, `claude/rep-spacetime-466c46`,
  `claude/rep-worlds-173cee`.
- **Safe to retire after worktree removal** (dirty files are generated bundles or already on master):
  `rep-crafting-c0b04e`, `rep-items-6f02d9`, `rep-organizations-09fe68`, `rep-research-e34f54`,
  `rep-rituals-70a5e6`, `rep-talk-d8d734`, `rep-time-8afe25`, `zealous-joliot-b457ad`
  (check its catalogue diff is disposable first).
- **Do not touch now:** the `rep-character-sheet-860fe6` and `rep-knowledge-b16f3d` worktree
  folders (other sessions use them; the old `claude/rep-character-sheet-860fe6` and
  `claude/rep-knowledge-b16f3d` branch names themselves are landed and retirable).
- Merge candidates: none.

## Outcome (2026-11-07)

Weibao, after this report: "continue accordingly". Carried out, reversibly:

- **Worktrees removed (8):** `rep-crafting-c0b04e`, `rep-items-6f02d9`, `rep-organizations-09fe68`,
  `rep-research-e34f54`, `rep-rituals-70a5e6`, `rep-talk-d8d734`, `rep-time-8afe25`,
  `zealous-joliot-b457ad`. None had a running process, lock or file change in two days. Their
  dirty state (tracked diff, untracked files, status) is saved in `.git/archive/2026-11-07/<name>/`.
- **Branches dropped (all 22 in the table):** each tip is kept as `refs/archive/2026-11-07/<name>`
  and listed in `.git/archive/2026-11-07/branches.txt`. Restore one with
  `git branch <name> refs/archive/2026-11-07/<name>`.
- **Kept:** the `rep-character-sheet-860fe6` and `rep-knowledge-b16f3d` worktree folders (other
  sessions run there on `claude/gifted-satoshi-29351f` and `claude/infallible-villani-4c7d22`),
  `claude/zorian-s1-slice-ce2f91` and the perf checkout, all outside this pass.

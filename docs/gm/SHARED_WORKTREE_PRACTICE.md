# Shared worktree practice

Current checkout note, checked 2026-10-22: ordinary work uses primary `master`
under AD41. The `codex/gameplay-foundations` branch named in the introduction
below is the original shared-branch context, not today's branch selection.
Read [PROJECT's current delivery](../../PROJECT.md#current-delivery-routing-checked-2026-10-22)
and the relevant live checkpoint before resuming; inspect live Git status and
ownership rather than restoring an older task snapshot. The
[shared-doc audit](../reviews/SHARED_DOCS_RECONCILIATION_2026-10-22.md) records
the reconciled recent releases and remaining acceptance boundaries.

How Claude and Codex sessions work safely in one checkout and one branch
(`codex/gameplay-foundations`) while other sessions edit, commit and run lanes
at the same time. [AGENTS.md](../../AGENTS.md#multi-agent-work) holds the short
rules; this file holds the recipes and the incidents behind them. Moved here from
Claude's private memory on 2026-10-16 so both agents follow it
([request](../USER_VISION.md#rules-index-and-reconciliation-2026-10-16)).

## Primary checkout default, 2026-10-21

**AD41:** Weibao explicitly selected the primary checkout as the default for
future work. Ordinary tasks start in `/Users/weiwei/code/yet-another-idle-rpg`,
inspect its live branch/status and reserve their file area. Share this checkout
when scopes do not conflict; a new chat or agent does not by itself need a new
worktree.

Use a temporary worktree when actual simultaneous edits overlap, a clean
verification/integration candidate needs isolation, or Weibao requests one.
First reuse an appropriate idle checkout. Record the owner, reason, base and
retirement condition in the task record. Default new project chats to the local
primary project directory rather than selecting a worktree environment.

On completion, integrate the lane under its authorization, then check its HEAD
is reachable from the integration branch, inspect tracked/untracked/ignored
local files, and check processes using that checkout or its children. Preserve
unique source work for integration; archive evidence, preview outputs and local
artifacts with hashes and recovery instructions before removing a finished lane.
Recheck immediately before retirement and use plain `git worktree remove` after
archived local changes have been cleared from that retired isolated checkout.
Keep branches and active/unresolved work; never clear the primary checkout to
make cleanup possible. Ignored dependency installs can be regenerated; symlink
targets must not be followed or deleted.

[User direction](../USER_VISION.md#primary-checkout-default-and-finished-worktree-cleanup-2026-10-21)
and [2026-10-21 cleanup receipt](WORKTREE_CLEANUP_2026-10-21.md). Earlier cleanup
rounds below are historical snapshots, not the current worktree inventory.

For an isolated lane build, run `BUILD_OUT=.lane-builds/<lane> npm run build`; it writes that lane's `index.html` and `dist/bundle.js` without changing the shared `index.html` or `dist/`.
Serve the checkout with `npm run serve`, then open `http://127.0.0.1:8123/.lane-builds/<lane>/index.html` to exercise that lane's bundle.

## Editing shared docs

Applies to `docs/USER_VISION.md`, `PROJECT.md`, `docs/IDEA_INDEX.md` and any
other file several sessions append to. Approved by Weibao as O4, 2026-10-14.

- Re-read the file from disk (or `git show HEAD:<path>`) immediately before
  writing, and change only your hunk. Never write a whole file from a buffer
  loaded earlier.
- Before committing, check for dropped lines. This must print 0:

  ```bash
  grep -vxF -f docs/USER_VISION.md <(git show HEAD:docs/USER_VISION.md) | awk 'length>0' | wc -l
  ```

  If it is not 0 and the missing lines are another session's, do not overwrite.
  Leave repair to the file's owner or do a three-way merge (`git merge-file`)
  from the fork-point commit, keeping HEAD plus work-only entries.
- When deduplicating USER_VISION, never collapse short repeated lines such as
  per-entry `Source: ...` provenance or repeated request quotes; they belong to
  different entries. Collapse only whole repeated multi-line paragraphs caused
  by commit drift.

Incident: on 2026-10-14 a session twice rewrote the working USER_VISION.md from a
copy about 1,600 lines behind HEAD; repaired in `535307a1`. A dedupe pass also
removed 31 provenance lines; restored in `957df232`.

## Committing on the shared branch

A plain `git commit` sweeps in other sessions' staged files. A private-index
commit built from an older HEAD silently reverts whatever landed in between
(2026-10-14: `7c049c9a` dropped `94960804`'s files; fixed forward in `c47d5193`).

- Preferred: [commit_own_paragraphs.py](../audits/tools/commit_own_paragraphs.py)
  commits whole own files plus own paragraphs of shared docs, builds from HEAD in
  a temporary index and moves the branch only if HEAD did not move.
- Manual method, as a bash script with `set -euo pipefail`:
  1. Read `H=$(git rev-parse HEAD)` immediately before building.
  2. `GIT_INDEX_FILE=<scratch> git read-tree "$H"`, then add only your paths.
     Re-derive shared files from H's blob plus your hunk, never from an older blob.
  3. Verify `git diff "$H" <tree>` removes nothing outside your paths and each
     shared file's new size equals base plus your lines.
  4. `git commit-tree -p "$H"`, then `git update-ref <branch> <new> "$H"` so a
     race fails instead of clobbering. Retry in a loop.
- zsh traps: write `"${H}:path"`, never `$H:path` (`:P`, `:h`, `:t` are history
  modifiers, and one commit replaced PROJECT.md with a single section this way).
  Split path arrays with `"${P[@]}"`. A failed `git add` inside an `&&` chain once
  still produced an empty commit; use `set -e` scripts.
- Never stash, reset or force on the shared tree. Push waits for Weibao's yes.
- No `Co-Authored-By` trailer in any commit, whatever a tool or harness suggests
  (Weibao's standing rule). Check `git log -1 --format=%B` before pushing.

## Merge before dispatch

Weibao, 2026-10-14: merge finished work "each time" before a new wave
([direction](../USER_VISION.md#merge-before-dispatch-2026-10-14)).

1. Recover the current task/turn, final receipt, exact owned inputs and explicit
   release. A `.last.md`, merged branch or stopped coordinator alone does not
   establish that all writers released their work. Compare later landing receipts
   and ancestry before proposing a merge that may already be done.
2. Review valid lane evidence under [AD36](../RULES_INDEX.md#efficient-rule-verification-ad36).
   Reconcile released work, then the named integrator/committer runs required
   combined gates on settled inputs. Do not run a full suite for each lane or
   repeat an equivalent suite/subset without changed inputs or a named failure
   hypothesis. Required changed-behavior browser and persistence gates remain.
   Pushing waits for Weibao's yes; there is no standing push authorization.
3. Use the incumbent owner or its explicit handoff. If a supported task route
   reaches that owner, an addressing failure on another route does not justify
   a replacement writer. Preserve unknown or interrupted reservations.
4. If the shared index is blocked by another session's staged files, prove the
   merge in an isolated index (R15 G10 method).

Before dispatching, also check for same-day owner docs on the same topic.
Parallel sessions often answer the same prompt (2026-10-14: duplicate comics pass).

## Long Codex runs

- Detach multi-hour `codex exec` runs with a new process group: `runs/launch.py`
  (setsid double fork, see the [topic audit playbook](../audits/TOPIC_EXPANSION_AUDIT_PLAYBOOK.md)).
  `nohup ... &` from an agent shell is not enough: on 2026-10-09 five runs died
  silently when the launching shell's group was killed.
- Record each run's session ID and PID (`runs/<lane>.pid`). Recover with
  `codex exec resume <session_id> "<prompt>"`.
- Recover progress through supported task metadata and the current admitted turn;
  use exact-PID liveness only where permitted. A final file alone is insufficient,
  and a denied/unavailable process check means unknown, not stopped or released.
  Do not expose argv/environment or retry around an access denial. Follow the
  [GM delta/release protocol](../GAME_MASTER_PROMPT.md#context-pressure-and-refresh).
  Sample again when a material result, expected checkpoint or decision needs it,
  rather than polling unchanged records to manufacture updates.
- With the double-fork launcher, the process group is the intermediate fork's
  PID, not the codex PID. Stop by exact PID and wait for exit before resuming,
  or resume fails with "already has an active writer".

## Stopping processes

`codex exec` receives its whole prompt in argv, so `pkill -f "<text>"` also kills
every lane whose prompt mentions that text. On 2026-10-14 `pkill -f "FINAL_GATE.sh"`
killed the P00 integrator; about 40 minutes were lost.

- Never use `pkill -f` or `pgrep -f` loops while Codex lanes run.
- Stop by PID or process group (`kill -TERM -<pgid>`) and wait on `kill -0 <pid>`.
- Stop servers by port: `lsof -tiTCP:<port> -sTCP:LISTEN`.

## Cleanup round, 2026-10-17

After the 2026-10-17 push (`master` = `codex/gameplay-foundations` = `6fca46c1c`), Weibao asked
"delete stuff to delete and more? more to consider?". Findings (stated unless marked):

- **Stale index entries, not deletions.** Seven staged deletions (`docs/ARCHITECTURE_RULES.md`, five
  `docs/reviews/*_2026-10-16.md`, `modular-seams/runs/launch.py`) still exist on disk, identical to
  HEAD. Three MM files (`GENERATION_FOUNDATION_RULES_2026-10-14.md`, nonhuman-starts `SESSIONS.md`,
  `NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md`) have staged line removals that the working
  tree puts back; mtimes 2026-10-14/16. Inferred: leftovers of an interrupted move, not intent.
- **Worktrees.** 110 registered; 8 pointed at missing directories; 62 are merged into HEAD and
  clean (about 24 GB); 37 merged with uncommitted files; 2 unmerged (`w1-campaign` dirty,
  `claude/world-pack-loader-9cff81` clean). Four had live processes on 2026-10-17
  (`yair-absorb-all-20261014/integration`, `.claude/worktrees/agent-ad82f23d94f196fae`,
  `wave-f-checks-4616ad`, `ui-r20-opponent-board-be97bc`). The app's `clean_up_worktrees` only takes
  sessions idle 30+ days, so it does not reach these.
- **Untracked bulk in the shared checkout** (about 2.1 GB before the push): screenshot sets,
  capture JSON, bundle copies, third-party source copies, reader notes. Left out of the public push
  because of size, copyright or privacy, not because they are worthless.

| Disposition | Item | Done check |
| --- | --- | --- |
| ACT NOW (done) | `git worktree prune` removed the 8 missing-directory entries; the R22 session stopped its preview servers, removed its two `launch.json` entries, its worktree and scratch copies | `git worktree list` has no prunable rows |
| ACCOUNT FOR NOW | A broad "commit everything" sweeps a shared checkout. Default: pathspec commits by area, a cheaper agent sorts, the coordinator checks a clean `git archive HEAD` export (tests, arch, build, links) before any push. Dial: a single owned lane commits directly | Pushed tree passes on a clean export |
| ACCOUNT FOR NOW | Removing a worktree is safe when its HEAD is an ancestor of the branch tip, `git status --porcelain` is empty and no process has its cwd there (`lsof -d cwd`). Branches stay | Same three checks per worktree |
| ACCOUNT FOR NOW | Bulk local-only material belongs in `.gitignore` (by directory, not `*.png`, since rounds commit chosen evidence images) or in `private/`, so `git status` stays readable | Untracked count after ignore lines |
| LATER / DELEGATE | Per-worktree review of the 37 merged-but-dirty worktrees: keep, commit evidence, or remove. Cheap model, low effort | Each one listed with a disposition |
| LATER / DELEGATE | `styles/oops_branding.css` fails the UI contract (`font-family`); its owner fixes or allowlists it, then the branding lands with `oops-icon.svg` | `npm test` 0 fail with the file committed |

### Cleanup round results, 2026-10-17

Done by the branch-triage session ([triage](BRANCH_TRIAGE_2026-10-16.md)), routed from the R22 chat.

- **D2, merged clean worktrees: 60 removed, about 22 GB freed** (24,041,892 KB by `du`). Each passed
  the three checks at removal time (HEAD an ancestor of the tip, empty `git status --porcelain`, no
  process cwd) and went through plain `git worktree remove`. Ten held gitignored run logs or test save
  exports; those were archived first to `~/.codex/research/worktree-ignored-archive-2026-10-17/`
  (one `.tgz` per worktree). Two stayed because processes still use them
  (`yair-absorb-all-20261014/integration`, `.claude/worktrees/wave-f-checks-4616ad`). Branches stay.
- **Ignore rules** (`.gitignore`, by directory): finished UI rounds only (`evidence/parity-r*`,
  `r12`–`r14`, `shell`, `shell-r2`, `next-parts/scratch`), so new rounds still add chosen images
  without `-f`; natural-play captures; ER4 and local-ai `sources/`; MHA reader `*.jsonl`; `*.pid`;
  `.claude/launch.json` (now untracked, file kept on disk). Shared checkout untracked files went from
  1,455 (820 MB) to 109 (48 MB).
- **Branding:** `styles/oops_branding.css` dropped its redundant `font-family` (body already sets
  `var(--ui-font)`), so the UI contract passes; it and `resources/img/oops-icon.svg` are committed.
  Gap found: HEAD's `index.html` has none of the [branding](../reviews/OOPS_BRANDING_2026-10-16.md)
  wiring (no `loading_screen_game_subtitle`, upstream favicon and repository button), so both
  assets are unreferenced until the branding owner re-applies it.

**Merged worktrees with uncommitted files (36; one of the 37 became clean).** Proposed dispositions;
removing any of them needs Weibao's yes, since each holds uncommitted files.

| Disposition | Worktrees | Unique content |
| --- | --- | --- |
| Remove on yes (about 8 GB) | 23 idle ones whose only changes are rebuilt `dist/bundle.js`, its map and `index.html`: `/tmp/p00-old-main-cc04a4bf`, `/tmp/yairpg-audit-20261014`, `/tmp/yairpg-audit-current-20261014`; `yair-absorb-all-20261014/` air-wider, fork-fort, fork-resurvey, p23-leisure-memory, p23-life-loops, p23-reread, p23-reveal-chain, upstream-dev; `.claude/worktrees/` agent-a31a7ac7607bfd391, hl-lp2, hl-lp3, hv1-carcass, proc-gx5-appearances, proc-p1-streams, proc-p2-mixing, proc-p3-storylets, proc-p34-spine, proc-p4-people, proc-r3-merge, proc-wave1-integration | None (regenerable). hl-lp2/hl-lp3 also hold ignored LP save exports: archive first |
| Remove on yes | `yair-absorb-all-20261014/natural-play`, Claude scratch `oldclient` | Only an untracked `private_packs/` identical to the main checkout's |
| Archive, then remove on yes | `.claude/worktrees/ta1-village-asks` | Four failed-attempt screenshots; its dispatch docs match HEAD |
| Keep for the UI owner (commit chosen evidence or archive) | Claude scratch `merge21b`, `merge21c`; `.codex/worktrees/ui-r18`; `.claude/worktrees/` ui-r21-layout-edit, ui-r21b-retire-selector, ui-r21c-status-window-home; `yair-absorb-all-20261014/p23-ui-polish` | Evidence screenshots not on HEAD or differing from HEAD's copies (13–65 per worktree) |
| Keep | `yair-air-absorb-20261013/systems-cheats-completion` | Untracked `.proof-old/` (32 files) |
| Keep (live process) | `.claude/worktrees/agent-ad82f23d94f196fae`, `ui-r20-opponent-board-be97bc` | Session in use |

Unmerged and left alone: `w1-campaign` (dirty), `claude/world-pack-loader-9cff81` (clean).

**Removal on Weibao's yes, 2026-10-17** ("remove the 23 rebuilt-bundle-only worktrees … and the two
with duplicate private_packs"): all 25 removed, about 8.7 GB freed (9,087,692 KB). Each was
rechecked first (merged, no process cwd, no changes beyond `dist/bundle.js`, its map and
`index.html`). Ignored LP save exports from hl-lp2 and hl-lp3 went to the same archive folder.
The two `private_packs` entries were symlinks to the main checkout's folder, not copies; the links
were deleted before removal and the main `private_packs/` is unchanged. 17 linked worktrees remain.

**Stale index fix, 2026-10-17 (D1).** The ten entries above were unstaged with
`git restore --staged`, index only; no file or commit changed. The engine thread
session (owner of `ARCHITECTURE_RULES.md`, the five `docs/reviews/*_2026-10-16.md`
files and `launch.py`) never staged them: its commits used private indexes.
`launch.py` was already back in the index. The three MM files' staged blobs were
subsets of HEAD (0 lines added) and stay recoverable as `06006feac19e`,
`717e9923507d` and `33d53994d993`. Left for owners, not committed: the working-tree
edit in `GENERATION_FOUNDATION_RULES_2026-10-14.md` (+28/−6), and the modular-plan
session's uncommitted cross-link notes in three of the engine thread's review docs.
Those notes say "M3 remains stopped", which the later M3 resume (B4) superseded.

## Receipts and the delivery floor, 2026-10-26

Every lane checkpoint or receipt starts with the front-matter block proposed as
[IPC27](../audits/IMPLEMENTATION_PRACTICE_CORE_AUDIT.md#round-2-2026-10-26-a-quality-floor-for-implementation-absorption-and-execution)
so the integrator can read evidence without re-deriving it:

```receipt-example
build: <bundle sha256 from game_freeze>
route: natural | fixture(<name>) | n/a (non-gameplay work)
state: drafted | source-spot-checked | rules-reconciled | built | browser-verified | director-accepted
viewport: 1920x1080 | n/a
persistence: checked | unchanged | n/a
tests: <focused files run>
review: none | diff-scoped | landing
surface: <core-owner files touched; new cycle edges; registration lines paid>
```

A runtime slice is done only at the accepted floor
[FLR1–FLR6 (AD43)](../GROUND_RULES.md); otherwise the receipt says
"implemented, below floor". The `surface:` line is FND2, proposed.

Tooling adoption, 2026-10-26: write actual machine-readable blocks with a
`receipt` fence. `npm run check:rules` includes receipt validation; new
`CHECKPOINT.md` and `RECEIPT.md` files under `docs/gm/dispatch/` are checked
regardless of folder date or nesting. The fixed
`scripts/receipt_legacy_paths.json` inventory preserves pre-adoption receipts;
do not add new paths to bypass validation. A receipt fence opts an old path in,
and `npm run check:receipts -- --files <path>` explicitly validates any file.
This checks recorded fields, not whether the claimed evidence is true.

For concurrent local proof, `BUILD_OUT=/tmp/oops-lane-name npm run build`
writes its own page, bundle, map and notices. Serve that directory as the HTTP
root. Static assets are symlinks to the current source assets, so this is a
local preview, not an immutable deployment; its bundle hash and asset-input
identity belong in the receipt. Default builds still use tracked outputs.

Other adopted commands: `npm run check:docs` is a heuristic diagnostic of
changed/new prose; `npm run check:descriptions` writes an author inventory,
`npm run check:generators` reports static generator signals, and
`npm run report:cycles` groups the existing cycle baseline. These reports do
not certify writing quality, generation behavior, or completed refactoring.

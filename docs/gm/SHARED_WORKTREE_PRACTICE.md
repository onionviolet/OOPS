# Shared worktree practice

How Claude and Codex sessions work safely in one checkout and one branch
(`codex/gameplay-foundations`) while other sessions edit, commit and run lanes
at the same time. [AGENTS.md](../../AGENTS.md#multi-agent-work) holds the short
rules; this file holds the recipes and the incidents behind them. Moved here from
Claude's private memory on 2026-10-16 so both agents follow it
([request](../USER_VISION.md#rules-index-and-reconciliation-2026-10-16)).

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

## Merge before dispatch

Weibao, 2026-10-14: merge finished work "each time" before a new wave
([direction](../USER_VISION.md#merge-before-dispatch-2026-10-14)).

1. Check `git branch` for finished lanes: a `.last.md` exists and the process is gone.
2. Merge those that pass their gates (build, `npm test`, smoke) and push under
   the existing push authorization.
3. Lane owners merge their own work. Message idle owner sessions first; take over
   only with an explicit handoff.
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
- Check progress by confirming the process is alive (`ps`, `kill -0 <pid>`), not
  only that output files exist.
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

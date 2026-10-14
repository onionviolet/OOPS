# Absorb-all wave, 2026-10-14: common rules

## Authorization

Weibao, 2026-10-14, after a status answer listing the open Proto23 ledger, the
unfinished Air workshop lane, upstream dev `200f1ba6` and the stale fork survey:

> absorb all of them accordingly, send out codex accordingly, reaudit the
> rejected and not applicable and more? also unpark the stuff accoriddingly?

This authorizes: finishing the Air workshop absorb; absorbing upstream dev
`200f1ba6`; a fresh fork re-survey and absorption; implementing the Proto23
"adapt-next" rows; re-auditing every rejected, not-applicable and parked row
(Proto23 ledger, fork ledger, Air "not restored" verdicts) and unparking what
fits. New mechanics land as labelled, reversible **proposals**; Weibao is
creative director and accepts taste later. Standing direction still governs:
[USER_VISION.md](../../../USER_VISION.md), [PROJECT.md](../../../../PROJECT.md),
desktop/laptop first (1366x768 is the target viewport), "everything possible,
reasonably" (keep reasonable options reachable rather than cutting them), no
fixed "once" limits for a solo player beyond save safety.

## Paths

- Main checkout: `/Users/weiwei/code/yet-another-idle-rpg` (branch
  `codex/gameplay-foundations`, base `0216ccde`). It is dirty with other
  agents' docs and about 25 other Codex runs are live. **Never edit it**
  except your own files under this folder:
  `docs/gm/dispatch/absorb-all-2026-10-14/reports/<lane>.md` and, for
  audit lanes, the outputs your prompt names.
- Implementation lanes own exactly one worktree under
  `/Users/weiwei/code/yair-absorb-all-20261014/<lane>/` on branch
  `absorb-all/<lane>` (the Air lane keeps its existing worktree). Write only
  there. `node_modules` is a symlink to the main checkout's; do not run
  `npm ci` or install packages into it.
- Playwright: `require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')`.
  Example harness: `docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/browser.cjs`
  (note its Node 22 fetch workaround). Serve with
  `python3 -m http.server <your port> --bind 127.0.0.1` from your worktree;
  use only your assigned port.

## Rules

1. Read AGENTS.md, PROJECT.md and the owners your prompt names before editing.
   Check current HEAD first: some ledger rows already landed in `d49cb911`
   and `379007d7` (Vivid default, new-item dot, coin float, first-fight
   combat reveal, crafting screen, settings, panel kit). Do not redo them;
   mark them adopted with the commit.
2. Adapt to current code. Never paste whole foreign files over newer ones.
   Proto23 and forks without a license are inspiration only: reimplement,
   copy no code or assets. YAIRPG forks are MIT: keep the upstream notice and
   cite fork/commit in a source comment for any adapted code.
3. Persistence: new state optional, absent from old saves, old saves load
   unchanged. Record the compatibility decision in your report. Unsupported
   schemas reject rather than corrupt.
4. Gate for every behavior change: `npm run build`, focused tests, full
   `npm test` (report the count and name any pre-existing failures), a
   fresh-origin desktop (1366x768) Playwright run of the changed loop, and
   save/reload plus export/import when persistence changed. Anything not
   exercised is **implemented-unverified** in the report.
5. Commit on your branch in small commits with plain messages. No
   `Co-Authored-By` trailer. No push, no merge into gameplay-foundations, no
   edits to remotes, other branches, user saves or `docs/research/novels/`
   sources. Do not commit rebuilt `dist/` unless your prompt says so; note
   the bundle hash you tested.
6. Sealed secrets (AGENTS.md) apply to every report and commit message.
7. Stop and record a blocker rather than guessing on save formats or on a
   conflict with USER_VISION.md.

## Report

`reports/<lane>.md`: what you absorbed, a row table (source item, decision,
where it landed or why not), checks with exact results, implemented-unverified
items, merge risks against the other lanes listed in SESSIONS.md, and the
one remaining acceptance gate (Weibao's play/taste).

## Merge authorization (2026-10-14)

Weibao, after dispatch: "merge when they're done". The coordinator (Claude
session that launched this wave) merges each lane that passes its gate into
an integration branch `absorb-all/integration`, reruns build + `npm test` +
browser smoke there, then merges into `codex/gameplay-foundations` in the main
checkout. Git refuses a merge that overlaps dirty files owned by other
sessions; on refusal the coordinator waits, never stashes, resets or forces.
Lanes still do not merge themselves. A lane with failing gates is not merged;
its report names the blocker.

Push authorization (2026-10-14): Weibao, "push after merging too". After each
successful merge into `codex/gameplay-foundations`, the coordinator pushes that
branch to `origin` (the public fork). Never `upstream`, never force.

Wave 2 authorization (2026-10-14): Weibao, "launch wave 2 without waiting for my
ok". The coordinator launches the unpark/restore packets written by
p23-reaudit and air-reaudit as soon as they land, each in its own
`absorb-all/<packet>` worktree under these rules, then merges and pushes them
under the same authorization.

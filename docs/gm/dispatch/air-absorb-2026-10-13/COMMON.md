# Air worktree absorption, 2026-10-13: common rules

Weibao asked to absorb the Air's dirty Codex worktrees. Source: `~/Private Mac Transfer/yair-private-work-20261013.tar.zst` (SHA-256 verified against its manifest), extracted read-only to `/Users/weiwei/MacTransferArchive/yair-private-work-20261013-extract/.codex/worktrees/<name>/yet-another-idle-rpg/`. The snapshots have no `.git`; their base commit is `53dc1df158` (`8a4c82d902` for micro-p1-xp), both ancestors of the current `codex/gameplay-foundations`. `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/air-absorb-2026-10-13/INVENTORY.txt` lists every file that differs from base: `UNIQUE` (not on the current branch's HEAD or working tree), `same-as-HEAD` (already landed byte-for-byte), `ignored` (git-ignored, mostly bundles, research and private files).

The Pro moved on since base (about 35+ commits, including foundation adoption R1-R15). Some Air work landed under other commits in different form. Your job is to find what is genuinely missing and absorb only that.

## Your worktree

You own exactly one isolated git worktree under `/Users/weiwei/code/yair-air-absorb-20261013/<name>/` on branch `absorb/air-<name>` (base: current gameplay-foundations HEAD at setup). Write only there, plus your own report file `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/air-absorb-2026-10-13/reports/<name>.md` in the main checkout `/Users/weiwei/code/yet-another-idle-rpg`. Never edit the main checkout otherwise, the extracted snapshots, other absorb worktrees, user saves, remotes or other branches. No push, no merge into gameplay-foundations. Run `npm ci` or link `node_modules` from the main checkout read-only if you need it.

## Method

1. Read `/Users/weiwei/code/yet-another-idle-rpg/AGENTS.md`, `/Users/weiwei/code/yet-another-idle-rpg/PROJECT.md` and the snapshot's own task records (its `docs/gm/dispatch/` checkpoints and reports that differ from base) to learn what the Air task was building and how far it got.
2. For each UNIQUE file, diff snapshot vs base (`git show <base>:<path>`), then compare that intent with the current HEAD. Classify each hunk: already landed (cite the commit), superseded by a later design (cite it), or missing.
3. Port the missing work onto your branch, adapted to current code. Never paste whole Air files over newer ones. Preserve unrelated current behavior. Persistence changes need a migration or an explicit compatibility note, per AGENTS.md.
4. Rebuild (`npm run build`), run `npm test` and the snapshot's own new tests, and exercise changed gameplay in a browser from a fresh origin at desktop width when behavior changed (AGENTS.md Verification). Label anything not exercised as implemented-unverified.
5. Ignored files: list Air-only private research or packs that are missing from the main checkout's ignored paths. Copy them into your report's "private files to restore" list; do not copy them yourself.
6. Commit on your branch in small commits with plain messages. No `Co-Authored-By` trailer.
7. Write your report: what the Air task was, a hunk classification table, what you ported, checks run with results, what remains open, and merge risks against the other absorb branches (`a5-native-audit`, `micro-p1-xp`, `minigame-management`, `systems-cheats-completion`, `structured-packs`).

Sealed secrets rule from AGENTS.md applies to reports. Stop and record a blocker rather than guessing on persistence formats or design direction conflicts with `docs/USER_VISION.md`.

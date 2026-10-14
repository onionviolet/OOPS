# Tooling and source identity

No game or source code executed. No source dependency install, build, tests or browser session. Only analysis scripts ran. Ideas only; no LICENSE/LICENCE found in the pinned tree.

Upstream: https://github.com/immortalityidle/immortalityidle.github.io

Fresh clone: `/Users/weiwei/.codex/research/idle-depth/repos/immortality-idle-pinned/`, commit `c7231bae717b67a8e4dba2a3775d58bfbfadbdd6`, commit date 2026-10-13T12:34:57-06:00. This is a fresh independent clone of the prior lane's pinned upstream snapshot, not a claim to have audited a newer live HEAD.

The initial `git clone --depth 1` from GitHub into `repos/immortality-idle/` was deliberately stopped after slow transfer of large deployed bundles. No fetch error or login occurred. Its incomplete directory is retained, not used as evidence. Switched route to the available pinned local snapshot with:

```sh
git clone --no-hardlinks /private/tmp/claude-501/immortality-idle-src/repo /Users/weiwei/.codex/research/idle-depth/repos/immortality-idle-pinned
git -C /Users/weiwei/.codex/research/idle-depth/repos/immortality-idle-pinned rev-parse HEAD
```

Read the old snapshot while the network transfer ran, then verified byte-for-byte equality of hell, battle, activity, item-repo and character services against the fresh clone. Hashes: `/Users/weiwei/.codex/research/idle-depth/extract/HASHES.txt`. The fresh clone is clean.

Read methods: `rg -n`, `sed -n`, `wc -l`, Python 3 with `-I` for mechanical inventories and compact local logic extracts. `activities-compact.txt` omits prose/log calls; direct full sections supply context. `ACTIVITIES.md` contains only identifiers/locators, not copied function bodies. Own script files live under `notes/` and target only the assigned pass dirs.

## Exact source links

- [hell.service.ts](https://github.com/immortalityidle/immortalityidle.github.io/blob/c7231bae717b67a8e4dba2a3775d58bfbfadbdd6/src/app/game-state/hell.service.ts)
- [battle.service.ts](https://github.com/immortalityidle/immortalityidle.github.io/blob/c7231bae717b67a8e4dba2a3775d58bfbfadbdd6/src/app/game-state/battle.service.ts)
- [activity.service.ts](https://github.com/immortalityidle/immortalityidle.github.io/blob/c7231bae717b67a8e4dba2a3775d58bfbfadbdd6/src/app/game-state/activity.service.ts)
- [item-repo.service.ts](https://github.com/immortalityidle/immortalityidle.github.io/blob/c7231bae717b67a8e4dba2a3775d58bfbfadbdd6/src/app/game-state/item-repo.service.ts)
- [character.service.ts](https://github.com/immortalityidle/immortalityidle.github.io/blob/c7231bae717b67a8e4dba2a3775d58bfbfadbdd6/src/app/game-state/character.service.ts)
- [Hell UI template](https://github.com/immortalityidle/immortalityidle.github.io/blob/c7231bae717b67a8e4dba2a3775d58bfbfadbdd6/src/app/hell-status-panel/hell-status-panel.component.html)

Tool install shared by this two-game lane: Acorn 8.19.0 at `tools/static-parser`, for Groundhog static AST inspection only. See its TOOLING. No install in the checkout.

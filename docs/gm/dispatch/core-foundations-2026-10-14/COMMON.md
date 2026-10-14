# Core foundations lanes, 2026-10-14: common rules

Authority: Weibao, 2026-10-14: "How well are the core foundational stuff?
more to consider? other stuff and more? save and extend accordingly Send out
codex as usesful?" Root audit (Claude owns it, read only for you):
[core foundations scorecard](../../../CORE_FOUNDATIONS_SCORECARD_2026-10-14.md)
(U01-U15, K1-K5, F1-F5, M1-M12, lanes A1-A5). Extend its codes.

Coordinator: the Claude session that owns this folder. Workers are Codex CLI
runs. Everything you produce is a proposal until root and Weibao review it.

## Rules for every lane

- Read `AGENTS.md`, `PROJECT.md` top sections and `~/.claude/user-preferences.md`
  first. Style: plain short words, no em dashes and no " -- ".
- Write only the files your lane prompt names. Many other agents are active.
- Code lanes work only in their own worktree and branch (named in the lane
  prompt). Add new files; do not edit existing `src/` files unless the lane
  says so. Run `npm test` (or the targeted `node --test` files) in your
  worktree, never in the main checkout. Commit on your own branch with a
  plain message and no Co-Authored-By trailer. Do not merge, push, rebuild
  `dist/` or touch saves or private packs.
- Docs lanes write in the main checkout only under
  `docs/gm/dispatch/core-foundations-2026-10-14/<lane>/`. Do not stage.
- Code claims cite `file:line` from a read you actually did. Label claims
  SHOWN (read in code), INFERRED (your proposal) or UNKNOWN.
- Any proposed save shape change names its migration or compatibility
  decision. Keep user saves private and untouched.
- Sealed secrets: never open files named `SECRETS*`; refer by ID.
- Do not duplicate owned work: nonhuman-starts engine lane (bodies, senses,
  control), procgen wave 1 (`proc/p1-streams` seeded streams, mixing,
  storylets, people), derived-snapshots (snapshots, offline time),
  world-core-kit W6 (per-world engine template). Cross-link them.
- Keep `CHECKPOINT.md` in your lane folder (`docs/gm/dispatch/core-foundations-2026-10-14/<lane>/`
  in the main checkout) so a resumed run continues. Finish with `REPORT.md`
  there: what changed, tests run with counts, what stays open. Never claim
  gameplay works; these are foundations and tests.

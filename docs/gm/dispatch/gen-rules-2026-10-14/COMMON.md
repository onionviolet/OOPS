# Generation rules lanes, 2026-10-14: common rules

Authority: Weibao, 2026-10-14: "procedural generation/foundation generation
rules to make everything else easier? more to consider? other stuff and more?
save and extend accordingly Send out codex as usesful? Subtle stuff too?"
Root doc (Claude owns it, read only for you):
`docs/GENERATION_FOUNDATION_RULES_2026-10-14.md` (GR1-GR17, SB1-SB17,
MC1-MC12). Extend its codes; do not restate them.

Coordinator: the Claude session that owns this folder. Workers are Codex CLI
runs. Everything you produce is a proposal until root and Weibao review it.

## Rules for every lane

- Read `AGENTS.md`, `PROJECT.md` top sections and `~/.claude/user-preferences.md`
  first. Style: plain short words, no em dashes and no " -- ".
- Write only the files your lane prompt names. Many other agents are active;
  machine load is high, so keep test runs targeted.
- Code lanes work only in their own worktree and branch. Add new files; do
  not edit existing `src/` files. Run targeted `node --test` files in your
  worktree, then `npm test` once at the end. Commit on your own branch with a
  plain message and no Co-Authored-By trailer. Do not merge, push, rebuild
  `dist/` or touch saves or private packs.
- Docs lanes write in the main checkout only under
  `docs/gm/dispatch/gen-rules-2026-10-14/<lane>/`. Do not stage or commit.
- Code claims cite `file:line` from a read you actually did. Label claims
  SHOWN (read in code), INFERRED (your proposal) or UNKNOWN.
- Unmerged generator branches are read-only references, at
  `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/` `proc-p1-streams`,
  `proc-p2-mixing`, `proc-p3-storylets`, `proc-p4-people`, `proc-p34-spine`.
  Never write there. `proc/wave1-integration` is being integrated by another
  session; read it with `git show`, do not check it out.
- Do not duplicate owned work: E1 seeded streams and P1 (stream storage),
  core lane A2 (tag store), A5 (determinism harness and ratchets), P18
  (headless story QA), P32 (level of detail), P22 (director tools), P15 (batch
  lint). Cross-link them.
- Any proposed save shape change names its migration or compatibility
  decision. Sealed secrets: never open files named `SECRETS*`; refer by ID.
- Keep every reasonable option reachable; limits are per-world adjectives,
  never fixed "once" rules.
- Keep `CHECKPOINT.md` in your lane folder
  (`docs/gm/dispatch/gen-rules-2026-10-14/<lane>/` in the main checkout) so a
  resumed run continues. Finish with `REPORT.md` there: what changed, checks
  run with counts, what stays open. Never claim gameplay works.

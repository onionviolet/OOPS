# Foundation current checkpoint

R15 active, 2026-10-13. Weibao asked to resume the chain on the open gates and
commit/push to master as work lands. Root coordinator is the Claude Code
session in the main checkout. [R15 brief](rounds/r15/BRIEF.md) owns scope and
the seeded-test-state verification method; R14's stopped checkpoint is preserved
verbatim in [rounds/r15/CHECKPOINT_BEFORE_R15.md](rounds/r15/CHECKPOINT_BEFORE_R15.md).

Groups G1–G5 run in separate worktrees; root merges, rebuilds, runs the full
suite and pushes to master per landed group. FA19/21/22/23 stay with their
owners; World1 stays paused.

## Progress, 2026-10-13 evening

Merged and pushed to master: G7 FA21 site editor, G5 FA17 heir, G6 FA22
courtyard minigames, G1 FA07 balm and FA18 runner (master `b0461b75`).
G2, G3 and G4 stopped on a Claude API session limit; per Weibao ("use codex
accordingly") they continue as detached Codex runs in their existing worktrees
`.claude/worktrees/agent-{a31a7ac7607bfd391,aedda304f5f9605f0,ad82f23d94f196fae}`.
Codex sessions: G2/G3/G4 `01a13839-5825-74b2-abaf-85d18bd3f0b6`,
`01a13839-5825-7bf2-a33e-60626ada367a`, `01a13839-583c-7261-b778-8455e70d53c1`
(launch order G2, G3, G4; confirm the mapping from each run log's workdir).
Resume with `codex exec resume <id> "<prompt>"`. FA23 UI joined as G8 under the
UI session, which runs its own Codex workers.

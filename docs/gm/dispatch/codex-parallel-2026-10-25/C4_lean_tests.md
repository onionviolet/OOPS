Lane C4: apply the lean-tests proposals on a branch (2026-10-25). Follow docs/gm/dispatch/codex-parallel-2026-10-25/COMMON.md in the primary checkout.

Authority: the standing lean-tests direction in AGENTS.md Verification (2026-10-22: organize tests by system, not delivery wave; delete or merge tests that only pinned a reworked shape) plus AD36. Lane B5's audit, docs/reviews/TEST_SUITE_LEANNESS_AUDIT_2026-10-25.md in the primary checkout, holds the proposals. Its proposals are not accepted decisions; apply only the ones that clearly fit the standing rule and keep every invariant covered.

Worktree: ~/.codex/worktrees/lean-tests/yet-another-idle-rpg, branch codex/lean-tests-2026-10-25 from master 9b997ea60.

Steps: 1) Run the full `npm test` at the branch base, record the count and time, and triage any failures already present at HEAD (fix only genuine test bugs; report runtime bugs). 2) Apply merges, renames into system files and deletions in small commits. Every removed assertion must point to the test that still covers its invariant (put a mapping table in the checkpoint). Use subagents for per-slice equivalence checks; review their claims yourself. 3) Run the full `npm test`, check:arch and check:rules after the last commit; compare the count and runtime with step 1.

Skip any test file that the primary checkout has uncommitted edits to (check with `git -C /Users/weiwei/code/yet-another-idle-rpg status --short tests/`) and list those as deferred. Checkpoint: docs/gm/dispatch/lean-tests-2026-10-25/CHECKPOINT.md in the worktree. Never touch master or the primary checkout; no push.

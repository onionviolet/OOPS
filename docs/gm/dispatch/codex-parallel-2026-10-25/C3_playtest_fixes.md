Lane C3: fix the gameplay defects the playtest found (2026-10-25). Follow docs/gm/dispatch/codex-parallel-2026-10-25/COMMON.md in the primary checkout.

Worktree: ~/.codex/worktrees/playtest-fixes/yet-another-idle-rpg, branch codex/playtest-fixes-2026-10-25 from master 9b997ea60. The untracked game MCP (scripts/mcp/) was copied in so you can reproduce.

Targets, from docs/reviews/PLAYTEST_SWEEP_2026-10-25.md in the primary checkout: P2 village patrol time-step throws (bug); BFA3 "Success 100%" trial yields no preparation (confusing); BHB2 private-storage count and chest copy disagree (confusing); plus any other bug-severity finding in the B1 top ten that lives in game source. For each: reproduce at HEAD (focused test or a headless MCP run), find the root cause, fix it in its owner per AR1-AR16 and the UI rules (UR codes; desktop first), and add a regression that protects the invariant. Do not fix MCP-tool findings; lane C2 owns scripts/mcp.

Collision check: before editing any file, run `git -C /Users/weiwei/code/yet-another-idle-rpg status --short <file>`. If the primary checkout has uncommitted edits to that file from another lane, still fix it on your branch, but list the overlap in your checkpoint so the merger knows.

Verify: focused tests while editing, then `npm run build && npm test`, `npm run check:arch` and `npm run check:rules` once on the final branch tree, plus a headless rebuilt-browser check of each fixed journey from a fresh origin. Commit each fix on the branch. Checkpoint: docs/gm/dispatch/playtest-fixes-2026-10-25/CHECKPOINT.md (in the worktree), one line per check. Never touch master or the primary checkout; no push.

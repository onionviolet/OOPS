Lane D2: engine and modularity improvements (2026-10-25). Follow docs/gm/dispatch/codex-parallel-2026-10-25/COMMON.md and COMMON_W4.md in the primary checkout (/Users/weiwei/code/yet-another-idle-rpg). Port 5102.

Worktree: ~/.codex/worktrees/engine-modularity/yet-another-idle-rpg, branch codex/engine-modularity-2026-10-25 from current master.

Owners: .claude/rules/runtime-code.md, docs/ARCHITECTURE_RULES.md (AR1-AR16), docs/ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md, docs/ENGINE_EXPANSION.md, docs/ENGINE_AUTHORING.md, docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md, the world-pack loader dispatches, and the import-cycle note in docs/tools/GAME_MCP_LIMITS.md (person.js / inventory_component.js through items.js).

Scope: 1) Measure first: tick cost, save size and serialize/deserialize time, bundle size, startup time, and the npm test wall time at master. 2) Fix the known import cycle and any other cycles (madge or an equivalent script; no new dependency without a reason). 3) Find the highest-value modularity seams: duplicated logic, owners leaking state, god modules. Use up to 4 Luna subagents for per-area scans and verify their claims yourself. 4) Implement the clearly safe wins in small commits with regressions: cycle breaks, extracted seams with real consumers, hot-path performance fixes with measured gains. Save compatibility is required: persistence changes need a migration or an explicit compatibility note. 5) Re-measure and record the deltas.

Checkpoint: docs/gm/dispatch/engine-modularity-2026-10-25/CHECKPOINT.md (measurements before and after, AR codes, one line per check). Run build, check:arch, check:rules and the full npm test once at the end.

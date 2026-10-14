# A2 checkpoint, 2026-10-14

Owner: Codex Lane A2, worktree `.claude/worktrees/core-a2-tags`, branch
`core/a2-tags`. Explicit lane assignment authorizes only new
`src/tag_store.js`, `tests/tag_store.test.js` and this lane's documents.
Initial worktree was clean at `30a2671e`. Other workers are active.

Authority read: COMMON.md, scorecard K1/U14/M12, AGENTS.md, PROJECT.md top
sections, user preferences, USER_VISION.md standing direction,
ABILITY_AUTHORING.md foundations section, E4 and E4B proposals.
Source read: rules.js, items.js tag constructor, crafting_recipes.js material
lookup, simulation_effects.js facts, people_knowledge.js and world_knowledge.js.

INFERRED implementation choices: boolean presence only; immutable registry
with parent implication; per-tag observer filters; unknown facts omitted;
snapshot schema 1 retains definitions and revisions, with unknown IDs kept
and reported. This supersedes E4's proposed drop-on-load only for this lane,
as the explicit user request requires preservation. No gameplay wiring,
engine schema change, world code, dist build, saves, merge or push.

Status: lane implementation complete as a proposal. Branch commit `d666e20f`
contains only the two named new files; post-commit worktree is clean. Targeted
`node --test tests/tag_store.test.js tests/rules.test.js`: 21/21 pass (17 new,
4 existing). Staged whitespace check passed. First run's one fixture-index
failure was fixed before the passing run.

[REPORT.md](REPORT.md) owns the API/compatibility contract, three ranked first
consumers with source references, counts and limits. Main-checkout documents
remain unstaged. Write ownership is released for coordinator review and
integration; no further A2 writes are pending. Integration and actual
gameplay/save acceptance remain OPEN, outside this lane's wiring exclusion.

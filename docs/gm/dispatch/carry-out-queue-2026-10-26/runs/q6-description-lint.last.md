Implemented the description lint and generated the report. The **commit is blocked** because this worktree’s Git metadata points into the primary checkout, where the sandbox denied creating `index.lock`. No files were staged or committed.

The checker scans 1,397 descriptions from the authored registries and built-in structured pack factories, flagging empty or short text, raw IDs or snake_case tokens, placeholder markers, and formula-only text. It found one flagged definition. It does not rewrite descriptions.

Checks passed: `node --test tests/check_descriptions.test.js`, `npm run check:descriptions`, `npm run check:arch`, `npm run check:rules`, and `git diff --check`.

Changed files: [checker](/Users/weiwei/.codex/worktrees/q6-description-lint/yet-another-idle-rpg/scripts/check_descriptions.mjs), [test](/Users/weiwei/.codex/worktrees/q6-description-lint/yet-another-idle-rpg/tests/check_descriptions.test.js), [generated report](/Users/weiwei/.codex/worktrees/q6-description-lint/yet-another-idle-rpg/docs/reviews/DESCRIPTION_LINT_2026-10-26.md), and `package.json`. The report notes that combined registry rows lack per-module provenance, so they’re grouped under `src/expedition_content.js`.

One authority gap remains: the checked-in UI rules and index end at UR69, despite the task referencing UR70–UR75. The packet also references a missing `docs/GROUND_RULES.md`. I followed the mechanical criteria in your task without inventing or registering new accepted rules. The requested branch is `codex/q6-description-lint-2026-10-26`; commit and head SHA remain pending.
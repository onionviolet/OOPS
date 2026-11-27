# Lane brief: audit the atlas platform proposals and pick the canvas technology (2026-11-24)

Coordinator: Claude session (atlas platform). Model: Codex Astra, low. Reason for the frontier route: Weibao asked for Astra to audit ideas, and the canvas choice is a consequential, cross-system decision. Read-only except for the one output file.

## Why

Weibao: "For more capable canvas we can consider whats most optimal, it doesnt need to look like the original for now" and "use astra to audit ideas and more as needed". The proposals are in the [atlas platform note](../../../reviews/WORLD_ATLAS_PLATFORM_2026-11-24.md), rounds 3 and 4 (R5-R18, T1-T4, the Fold, the path into the game, FR1-FR6, L1-L3, DC1-DC4).

## Do

1. **Audit the proposals adversarially.** For each coded item, check its evidence against the current tree (files, counts, owners) and say: holds, holds with a correction, or wrong. Flag anything that conflicts with accepted rules ([RULES_INDEX](../../../RULES_INDEX.md) authority order, [DESIGN.md](../../../../DESIGN.md), [UI rules](../../../UI_RULES.md), [shared worktree practice](../../SHARED_WORKTREE_PRACTICE.md)), anything that duplicates an existing owner, and anything missing that would change the plan.
2. **Choose the canvas technology.** Requirements: the atlas shows aggregates over about 73,000 coverage rows (`docs/coverage/*.jsonl`) and opens rows on demand; smooth pan and zoom with level of detail; runs on the 8 GB older-laptop target (PROJECT.md); ideally the same pieces can serve the game later (`src/ui/figure.js`, `figure_graph.js`, `walk_map.js`, `walk_topology.js`, `inspector.js`). The look does not have to match the original references. Compare at least: extending the atlas's `prototypes/world-atlas/canvas.mjs`; extending the game's figure primitive; a WebGL graph renderer (for example sigma.js); Cytoscape.js; and one option you think is missing. Judge by measured or well-sourced performance, bundle size, offline use, fit with the token contract (`tests/ui_contract.test.js`) and maintenance cost. Cite sources for any external claim. If a quick local benchmark settles it, write it under `prototypes/world-atlas/bench/` and report the numbers; do not wire it into the atlas.
3. Write `docs/audits/ATLAS_PLATFORM_AUDIT_2026-11-24.md`: a verdict table per coded item, then the canvas recommendation with the runner-up and why, then at most five decisions for Weibao, ranked.

## Rules

- Owned files: the audit file and anything under `prototypes/world-atlas/bench/`. Touch nothing else, commit nothing.
- A proposal is not a decision (AD32). Separate verified facts from inference.
- Do not spend on reading batches or any paid API.

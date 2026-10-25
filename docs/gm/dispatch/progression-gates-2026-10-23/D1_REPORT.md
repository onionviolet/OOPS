# D1 report: gate dependency transfer (2026-10-23)

Receipt: [D1_INPUT_RECEIPT](D1_INPUT_RECEIPT.md) sha256 `b6965629e7703e971bc0d4f1639c100283cd3e38c9f196bfe1398738b835c50b` (HEAD 547209e82). Package: [d1-package](d1-package/MANIFEST.md). Worktree `.claude/worktrees/d1-gate-deps-7a78e1`, branch `claude/d1-gate-deps-7a78e1`. No commits.

## Files
Seven tracked patches (levelable_component, display, reveal_chain, chain_inspector, chain_inspector_ui, micro_p1_xp test, chain_inspector test) and six new files (progression_gates, skill_overflow_domain, their two tests, PROGRESSION_GATE_RULES, PROGRESSION_GATE_OVERFLOW). Closure includes the `reveal_chain.js` exports behind F1. All dirty hunks in those seven files were gate hunks; excluded owners are named in the receipt.

## Checks (in a clean HEAD worktree with only the package applied)
- `git apply --check` then apply ALL_TRACKED.patch: clean.
- `node --test` progression_gates, skill_overflow, chain_inspector, micro_p1_xp, pledges, progression_pledges: 24/24 pass.
- `npm run build`: success (dist/index.html churn reverted in this worktree).
- `npm run check:arch`: exit 0, display.js growth -50.
- Not run: full `npm test`, browser checks (receiving owners' combined gate; no behaviour change by D1).

## Messages
D3 (local_764c576a, id found via list_sessions after the receipt was written; queued, delivery unconfirmed), O/F/A owner (delivered) and Qud owner (queued), each with path, hash and results.

## Remaining gates
- D3 and Qud messages were queued, not confirmed read.
- Integration owners run their own combined gate once after integrating.
- Weibao plays GTL6; commit and push await his yes.

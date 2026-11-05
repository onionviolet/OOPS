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


## Content reconciliation B478: retained D1 closure and original owner routing

The complete39-line copied input receipt and complete transfer report were read. This is D1 progression-gate dependency closure evidence retained under Qud, not a Qud mechanic/source audit. The copy retains original D1-relative brief/checkpoint/audit links; unresolved copied-relative paths do not establish those owners absent. The [original D1 checkpoint](../../../gm/dispatch/progression-gates-2026-10-23/CHECKPOINT.md) supplies later integration/release history, while [Qud CURRENT](../CURRENT.md) owns research continuation. B476 already reconciles the original receipt's source snapshot; no new module is implied by this retained copy.

The packet's seven tracked patches, six new files, clean apply/build/arch and24 focused tests support the frozen dependency candidate, not receiver gameplay, a clean full suite or current main. Queued messages were not confirmed reads; a message cannot transfer actual integration/custody by itself. The later original checkpoint records source landing, separately from push and combined gates. Preserve snapshot hashes, exclusions and the changed-doc hash reason; do not replay ALL_TRACKED.patch over today's dirty checkout. AD36/AD43 and AD42 optional review govern any selected consumer; the old human/commit/watcher instructions grant no current action. No patch payload, source code, branch/ref, message, worktree, test/build/browser, private or personal save was newly accessed or changed.

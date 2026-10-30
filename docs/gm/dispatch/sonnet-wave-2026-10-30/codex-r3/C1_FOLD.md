# C1 fold: validate, review aliases, fold, spot-check (Sol)
Model: gpt-6.1-sol medium. Parent: [C1](C1_L10_COST_AND_SLUGS.md). The seven Luna outputs `l10/slug-cluster/out_1..7.jsonl` have returned. Lane 4 reported one oversized tool read, with no prose copied. Check it.
Do exactly the procedure in [c1/fold.md](c1/fold.md):
- validate the outputs;
- review aliases across slices (private `aliases.json`);
- fold to the private `folded.json`;
- spot-check 15 rows per family (cost inference and slug clustering), keeping the private receipt.
Split any bad merge. Re-launching readers is not yours: list unread or conflicting slugs for the coordinator instead.
Weibao's note (2026-10-30): "we shoudnt hardcode a specific path, sonce there is multiple possibilities". Canonical slugs name the mechanism and must stay pathway-neutral unless the book ties the fact to a pathway.
Owned paths: the private `l10/slug-cluster/` and `l10/cost-infer/` folders, and `codex-r3/c1/FOLD_REPORT.md` (tracked; ids and counts only).
Done check: `fold.mjs --validate-only` passes; `folded.json` written; both spot-check receipts have 15 rows, with pass and correction counts in FOLD_REPORT.md; `node --test tests/ability_cost_infer.test.js docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c1/fold.test.mjs` passes. No commits.

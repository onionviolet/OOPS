# C1 slug slice 6

Model: gpt-6-luna medium. Coordinator launches; do not spawn agents.

Work in /Users/weiwei/code/yet-another-idle-rpg. Read AGENTS.md. Own exactly ONE private output: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l10/slug-cluster/out_6.jsonl`. No other edits, commits, web, host wiring or source promotion.

Input: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l10/slug-cluster/in_6.json` (225 fact slugs, each with count, one-line meaning, all extracted labels and ability/volume/role/locator uses). Snapshot: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l10/cost-infer/manifest.json`; run `node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c1/prep.mjs --check` first. Meanings are extraction hints, not verified source claims.

Cluster synonyms or differently named states with the same causal mechanism. Propose a short existing snake_case canonical slug. Keep different mechanisms, target types, scope, rank requirements, negation and knowledge apart; a similar word is insufficient. Condition/blocker roles stay at their original usage sites. Same-slug conflicting uses need review, not a forced merge. Unmatched reviewed slugs may form singleton groups. Do not assume person ids denote the same person. Codes: AD5, AD38, AR3, AR8, WA48; this is proposed data, not runtime behavior.

Read source paragraphs for each resolved member, using its locators and ability id. Batch ids with:

`node scripts/lead_run/cite_paragraphs.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27 --merged docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/merged --id <ability-id> --context 3 --max 8`

Use bounded calls; inspect help for locator filters if an id has many passages. Budget: at most 12,000 source words and six model responses, then retire; stop before exceeding the budget and mark remaining slugs unread. A cited id alone does not prove its label: read the matching locator window. If conflicting extracted meanings cannot be resolved within budget, mark the slug unread with the exact unresolved occurrence locators in the final report. No guessed, placeholder or unread groups.

Output JSONL, one group per line:

`{"canonical":"existing_slug","members":[{"slug":"input_slug","evidence":[{"id":"ability-id","locator":"exact locator actually read"}]}],"reason":"own English explanation of shared mechanism"}`

Final line REQUIRED, including when empty: `{"unread":["remaining_input_slug"]}`. Every row must come from paragraphs actually read; unread ids go in that final line. For this task ids are input slug ids. Each input slug occurs exactly once across members and unread; no foreign slugs. All members need matching input occurrence evidence. If a slug has materially different labels, inspect them before resolving it. Never paste book prose into tracked files or stdout; keep source details in this private output.

Done check: count distinct covered slugs = 225; no duplicates; every resolved member has actually read matching id/locator evidence. Run `node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c1/fold.mjs --validate-only --lane 6`. Report counts and exact unread slugs only.

# C1 R3b b15: slug remainder

Work in `/Users/weiwei/code/yet-another-idle-rpg`; read AGENTS.md. Model: gpt-6-luna medium, fresh context, coordinator launch only. No subagents, commits, web, runtime promotion or edits outside your ONE named private output. Rules: AD36/AD38, WPR4-WPR8, WPR18-WPR23, AU5-AU6/AU10-AU15. This brief replaces a portion of the old remainder assignment; do not run its old oversized parent too.

Input: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l10/slug-cluster/r3b/in_b15.json` (40 assigned rows). Own exactly `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l10/slug-cluster/out_b15.jsonl`. Source details and sealed truths stay private; final report gives counts, IDs and gaps. Input metadata is an index, not source proof. No placeholders: output rows come from text actually read. Stop at six responses or 12,000 source words (Chinese characters count as words), or before context limits (<60k target, 80k stop including overhead). Unread IDs belong in a REQUIRED final `{"unread":[...]}` trailer, including an empty array when complete.

Batch `cite_paragraphs` calls in small groups (start with two IDs), each with `--context 1 --max 2`. Set tool output limits to hold the whole batch. If output truncates, treat hidden text as unread and reduce the batch/window before continuing. Avoid whole-input dumps; load metadata in pieces of at most ten IDs. Read each matching locator, not an unrelated first mention. Standard route:

```sh
node scripts/lead_run/cite_paragraphs.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27 --merged docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/merged --id <source-id> --context 1 --max 2
```

Cluster synonyms with the same causal mechanism. Input is a small JSON array retaining all labels, occurrences, roles and locators for each slug. Meanings are extraction hints. Keep different mechanisms, targets, scope, rank, negation and knowledge separate; preserve conflicting uses as unread, not forced merges. Propose an existing snake_case canonical slug. **Pathway-neutral naming:** name the mechanism rather than hardcoding one pathway unless the source ties the fact to that pathway (Weibao, 2026-10-30). Unmatched source-reviewed slugs can be singleton groups. Do not merge person IDs on names. Codes also AR3/AR8/WA48. Proposed data only.

Read matching source paragraphs for every resolved member and inspect materially different occurrence meanings. Output one JSON group per line, exactly the C1 schema:

```json
{"canonical":"existing_slug","members":[{"slug":"input_slug","evidence":[{"id":"ability-id","locator":"exact input locator actually read"}]}],"reason":"English explanation of shared mechanism"}
```

Every assigned slug appears exactly once across members and unread; no foreign slugs. A matching evidence pointer alone does not establish source support. Condition/blocker roles remain at their usage sites. Missing/conflicting occurrence locators stay explicit in private gaps/final report. No guessed or unread groups. The new fold reads `out_b*.jsonl`; run `node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c1/fold.mjs --validate-only` after writing. Report resolved/unread counts and source-word/budget gaps, at most 200 words.

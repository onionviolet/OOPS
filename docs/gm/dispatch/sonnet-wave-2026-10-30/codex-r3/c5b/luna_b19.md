# C5 R3b b19: summary remainder

Work in `/Users/weiwei/code/yet-another-idle-rpg`; read AGENTS.md. Model: gpt-6-luna medium, fresh context, coordinator launch only. No subagents, commits, web, runtime promotion or edits outside your ONE named private output. Rules: AD36/AD38, WPR4-WPR8, WPR18-WPR23, AU5-AU6/AU10-AU15. This brief replaces a portion of the old remainder assignment; do not run its old oversized parent too.

Input: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/wb-families-texture/r3b/in_b19.tsv` (500 assigned rows). Own exactly `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/wb-families-texture/out_b19.tsv`. Source details and sealed truths stay private; final report gives counts, IDs and gaps. Input metadata is an index, not source proof. No placeholders: output rows come from text actually read. Stop at six responses or 12,000 source words (Chinese characters count as words), or before context limits (<60k target, 80k stop including overhead). Unread IDs belong in a REQUIRED final `{"unread":[...]}` trailer, including an empty array when complete.

Batch `cite_paragraphs` calls in small groups (start with two IDs), each with `--context 1 --max 2`. Set tool output limits to hold the whole batch. If output truncates, treat hidden text as unread and reduce the batch/window before continuing. Avoid whole-input dumps; load metadata in pieces of at most ten IDs. Read each matching locator, not an unrelated first mention. Standard route:

```sh
node scripts/lead_run/cite_paragraphs.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27 --merged docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/merged --id <source-id> --context 1 --max 2
```

This is classification of extracted summaries, not a new source read. Read the taxonomy `docs/gm/dispatch/sonnet-wave-2026-10-30/WB_TAXONOMY.md`. Input is a pre-cut TSV with at most 500 rows, no header: local n, stable synthetic row ID, original kind, summary, empty field, occurrence count. n is newly numbered for THIS slice. Do not reuse old shard n or classify by ID/keywords alone. Preserve OTH when it fits; do not infer from nearby summaries or outside canon. Rules-other rows are intentionally included in this texture-family pass.

Project only n and summary in pieces of at most 50 rows, with an output token limit sufficient for each piece. A 500-row slice is not an instruction to print 500 rows at once. Load each piece fully; reduce piece size if any output truncates. A summary read is sufficient for unambiguous classification and does not count as raw paragraph reading. Keep a private output row only for a summary actually read.

Output one `n<TAB>CODE` line per classified row, sorted by local n. Existing three-letter codes come from the taxonomy. `NEW:<kebab-slug>` is permitted only if no existing code fits, at most eight new slugs, with a concrete reason in the final JSON line: `{"unread":["stable-row-id"],"new_reasons":{"NEW:<slug>":"why existing families fail"}}`. Every input n must appear once as a label or its stable ID once in unread, never both. No placeholders, duplicate/foreign n or invented OTH for unread rows.

Ambiguity fallback: use `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/wb-families-texture/source_rows.jsonl` filtered by exact stable ID to obtain original `row.about` and locator. Synthetic IDs are not citation-tool IDs. Consult at most ten ambiguous IDs, at most eight paragraphs per ID, within the shared 12,000-word raw-source budget. Batch citation calls as above with --max 2; verify the exact anchor. If unreachable, classify only what the summary supports or leave unread.

Coordinator runs `node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c5/fold.mjs --allow-pending --validate-only`. The fold maps new local n through stable IDs into original shards, replacing unread coverage without altering old answers. Final report: output path, labelled/unread counts, summary versus paragraph coverage and truncation/context gaps, at most 200 words. Fifteen-row-per-family source review remains with the coordinator.

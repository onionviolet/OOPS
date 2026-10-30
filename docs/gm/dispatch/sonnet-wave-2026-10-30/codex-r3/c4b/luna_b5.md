# C4 R3b b5: methods remainder

Work in `/Users/weiwei/code/yet-another-idle-rpg`; read AGENTS.md. Model: gpt-6-luna medium, fresh context, coordinator launch only. No subagents, commits, web, runtime promotion or edits outside your ONE named private output. Rules: AD36/AD38, WPR4-WPR8, WPR18-WPR23, AU5-AU6/AU10-AU15. This brief replaces a portion of the old remainder assignment; do not run its old oversized parent too.

Input: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus/r3b/in_b5.jsonl` (35 assigned rows). Own exactly `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus/out_b5.jsonl`. Source details and sealed truths stay private; final report gives counts, IDs and gaps. Input metadata is an index, not source proof. No placeholders: output rows come from text actually read. Stop at six responses or 12,000 source words (Chinese characters count as words), or before context limits (<60k target, 80k stop including overhead). Unread IDs belong in a REQUIRED final `{"unread":[...]}` trailer, including an empty array when complete.

Batch `cite_paragraphs` calls in small groups (start with two IDs), each with `--context 1 --max 2`. Set tool output limits to hold the whole batch. If output truncates, treat hidden text as unread and reduce the batch/window before continuing. Avoid whole-input dumps; load metadata in pieces of at most ten IDs. Read each matching locator, not an unrelated first mention. Standard route:

```sh
node scripts/lead_run/cite_paragraphs.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27 --merged docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/merged --id <source-id> --context 1 --max 2
```

Family: **methods**. Each ID has one reader across all volumes; preserve volume/date variants and uncertain aliases. Addresses in this slice follow the C4 fold: `bNs`/`wNs` are volume-one reading waves, not book numbers. Explicit book locators and `lotmNc` shard prefixes determine later volumes, including registry `shards` plural. Do not rerun old prep or restore its incorrect census.

For exact assigned occurrence windows, batch at most two calls to the existing helper:

```sh
node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c4/cite_input.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus/r3b/in_b5.jsonl --id <assigned-id> --occurrence 0
```

Increment occurrence index for additional anchors; check its printed book/anchor against this corrected slice. Missing or unparseable anchors are gaps. For partial IDs record checked/unchecked locators, and `usable:false` when the missing material affects the method. Never claim later occurrences from an earlier one.

Before classifying repeats, consult the private known-method catalogue `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus/already_authored.jsonl` in bounded pieces or by relevant IDs. It indexes prior extractions, not verified runtime methods. Keep prior occasions separate from new variants. Use only the schema for this brief's family below.

## Procedure output, when family is methods

Group IDs that show the same procedure into one JSON line. Preserve dates/volumes and distinct variants. Schema:

```json
{"family":"ritual_other","ids":[],"label":"","locators":[],"conditions":[],"inputs":[],"performers":[],"steps":[{"kind":"prepare","text_en":"","minutes_stated":null}],"outcomes":[{"when":"unknown","stated":""}],"products":[],"costs":[],"limits":[],"consequences":[{"trigger":"","response":"","by":""}],"scale":null,"tags":[],"gaps":[],"usable":false}
```

`family`: divination | summons | ritual_other | potion_rule | aid_preparation | craft | occasion_of_known_method | no_content. Step kind: prepare | rite | call | response | attempt | interpret | craft | finish | use | outcome. Evidence uses S (shown), T (told), I (inferred) on claim objects or an added field-path `evidence` map. Each inference also carries `inferred:true` and its basis. English paraphrases, no invented quantities, times, odds, conditions or mechanics. Use null and gaps for missing facts. State constraints as the cited default, variation and reason rather than inventing universal restrictions. `usable:true` requires conditions or inputs, at least one supported step and a stated outcome.

Repeated procedures from the already-authored list below are `occasion_of_known_method` with the earlier method ID/name in tags. A materially new variant keeps its own supported steps and names the earlier method plus the delta. `no_content` means the paragraph was read and shows no relevant procedure, not a placeholder for an unread ID.

## Artifact output, when family is gm33

One line per input ID, schema:

```json
{"id":"","label":null,"holder_by_date":[],"effect":[],"cost_or_drawback":[],"containment":[],"access_route":[],"gaps":[]}
```

Every populated fact includes S/T/I evidence and locator (use `{text_en,label,locator}` objects; dated holders also include `date_or_order`, `holder`, and volume). If no calendar date is stated, use a cited chapter/order anchor and explicitly say the exact date is unknown. Effects, costs, containment and access need their own evidence; a known holder does not establish player access. Known source labels may appear in this private output. Sealed IDs remain IDs in tracked documents/chat; put any actual sealed truth solely in the private output. Keep inferred organization marked `inferred:true` with a basis. No invented ongoing costs or handling rules. Candidate selection deliberately includes possible incidental mentions: read first, then reject a nonartifact with empty fact arrays and a source-supported explanation in `gaps`; do not silently drop it. Do not merge IDs based on similar names. `sealed:true` in the input is a conservative handling flag, not a claim the item is a canon Sealed Artifact.


Done: every assigned ID occurs exactly once in a procedure `ids` array or artifact `id`, or in the final unread trailer. No foreign IDs; no empty rows for unread text. `no_content` requires a real source read. Run `python3 docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c4/fold.py --validate-only` after writing. Report supported/unread ID counts, actual locator coverage and budget gaps, at most 200 words. Coordinator source review remains required before promotion.

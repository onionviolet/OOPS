# C4 Luna @NUMBER@: @FAMILY@

Run from `/Users/weiwei/code/yet-another-idle-rpg`. This is a bounded private extraction, not an implementation pass. Model: gpt-6-luna medium, launched by the coordinator. Rules: AGENTS.md, WPR4–WPR8, WPR18–WPR23, AD38. Source is the local Chinese LOTM edition already indexed in the lead-run shards. No web, commits, subagents or edits elsewhere. Do not alter host/runtime files or other readers' files.

Input: `@INPUT@` (@COUNT@ distinct IDs, @OCCURRENCES@ metadata occurrences). Write exactly ONE file: `@OUTPUT@`. Input metadata is an index, not proof. Rows group all assigned occurrences of an ID across volumes so each ID has one reader. Record volume-specific differences instead of collapsing later changes into earlier dates. Preserve uncertain aliases as separate IDs. Source wording and detailed truths stay in this private output. Final chat gives counts and gaps, with IDs for sealed content.

Use this standard citation route for an ID, batching several IDs per shell call:

```sh
node scripts/lead_run/cite_paragraphs.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27 --merged docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/merged --id <id> --context 3 --max 8
```

The standard route caps the whole result, and may show an earlier volume or unrelated mention first. Check the printed anchor against the input's `occurrences`. To open an exact assigned occurrence, use the C4 helper (zero-based occurrence index; one context window per call):

```sh
node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c4/cite_input.mjs @INPUT@ --id <id> --occurrence 0
```

Increment `--occurrence` to read additional assigned anchors. The private `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus/anchor_check.json` lists currently missing/unparseable anchors. Missing anchors go in gaps; a missing book prefix is resolved from the occurrence's volume and marked inferred by the helper. A reading budget is at most 12,000 source words (Chinese characters count as words) and six model responses per fresh reader. This assignment's metadata count is not a claim all source fits that budget. Stop at the budget and explicitly record unread IDs; the coordinator can assign the exact remainder to a fresh context. Do not claim later occurrences checked from an earlier one. For partially read IDs, record checked and unchecked locators in `gaps` and mark `usable:false` when the unexamined material affects the method.

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

## Already authored

Private catalogue with method labels, source output file and line: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus/already_authored.jsonl`. Read it before classifying repeats. It includes every method-bearing group in prior volume 1–3 Luna outputs, including known-method occasions. It excludes the explicitly named placeholder output, no_content and unread trailers. This list identifies earlier extracted methods, not source review or runtime integration. IDs for every group follow; labels stay private:

@KNOWN@

## Done check and placeholder warning

Every input ID appears exactly once, in a procedure `ids` array or artifact `id`, or in the final unread trailer. Produce valid JSON per nonblank line. IMPORTANT: a previous lane wrote placeholders without reading paragraphs. Every row must come from paragraphs actually read. If you cannot finish, write fewer supported rows; unread IDs go in a final {"unread":[...] } line (without the space before `}` in the actual JSON). Canonical trailer form: `{"unread":[...]}`. Do not create empty procedure rows for unread IDs. Source words read, actual locator coverage and budget exhaustion belong in the final report or each row's gaps, not invented facts. The coordinator runs `python3 docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c4/prepare.py --outputs` after all reader files exist, then reviews source support separately.

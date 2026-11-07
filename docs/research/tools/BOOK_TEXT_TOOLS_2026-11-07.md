# Book text tools: silent-loss fixes (2026-11-07)

Scope: the EPUB-to-text chain in `docs/research/tools/book_deep_dive/` and
`scripts/library_coverage.py`, which AR36b gap decisions rely on
([source acquisition tools](../SOURCE_ACQUISITION_TOOLS.md)). Trigger: idea audit
F16 ([write-up](../../audits/idea-audit-2026-11-06/COMPLETION_10_SOURCE_PLAYBOOK.md#f16-extractor-identity-can-silently-lose-distinct-bodies),
[probe](../../audits/idea-audit-2026-11-06/EPUB_IDENTITY_PROBE.json)) and the
volume-locator collision in F11
([LOTM gap denominators](../../audits/idea-audit-2026-11-06/COMPLETION_04_LOTM_GAP_DENOMINATORS.md)).
No book was acquired or modified. Regression fixtures are generated ZIPs; real
held EPUBs were only read, read-only, for the before/after counts below.

## What changed

| Code | Defect (measured) | Fix | Fixture |
|---|---|---|---|
| BT1 | **F16.** `epub_to_json` keyed by basename: `vol1/part.xhtml` and `vol2/part.xhtml` became one member, exit 0 | Keys are full archive paths | `test_f16_same_basename_in_two_folders_keeps_both_bodies` |
| BT2 | **F16, merger.** A volume restart kept just the later Chapter 1 and called it a "duplicate", with 0 missing | The merger keeps each distinct body. A restart switches all keys to `vNNchNNNNN`. A split chapter becomes `chNNNNN-2`. A duplicate means a whitespace-identical body. Missing chapters are counted per volume | `test_f16_volume_restart_keeps_both_chapter_ones`, `test_true_duplicate_*`, `test_split_chapter_*`, `test_restart_inside_one_compilation_*`, `test_basename_clash_across_folders_is_not_a_duplicate` |
| BT3 | Archive-name order, not reading order. HTML outside the spine was not flagged | The OPF spine comes first, then non-spine HTML (reported on stderr). With no OPF, the tools fall back to name order and warn | `test_spine_order_*`, `test_html_outside_spine_*`, `test_no_container_*` |
| BT4 | HTML noise. Regex tag-stripping kept `<title>`, `<style>` and `<script>` text in the body (one line of the first three was the book title). Inline tags split sentences (`He <i>said</i> no` came out as three lines) | One block-element parser: `<head>`, `<style>` and `<script>` are dropped, and inline tags stay inside their paragraph | `test_head_style_and_title_*`, `test_inline_tags_*` |
| BT5 | Encoding. `decode("utf8", "ignore")` dropped bytes with no warning, and GBK members came out empty | BOM, then the XML or meta declaration, then UTF-8. Bytes that still fail to decode are replaced and reported | `test_declared_gbk_*`, `test_undecodable_bytes_are_reported` |
| BT6 | The merger matched case-sensitively and did not recognise Chinese-numeral headings. Unnumbered members (prologues, side stories) vanished without a trace | Lowercase/uppercase `chapter`, `第十二章` and volume-prefixed headings are recognised. Unnumbered members are reported with their character counts | `test_chinese_numeral_*`, `test_volume_prefixed_*`, `test_unnumbered_text_is_reported` |
| BT7 | Contents and notes pages ("Content from Chapter 1 … to Chapter 95") were read as chapters. The old merger got them right by accident, because the later member overwrote them | Headings must be anchored at the line start. A page with a contents title, or with three or more headings in its first lines, is skipped and reported | `test_contents_and_notes_pages_*`, `test_index_page_*`, `test_long_real_heading_*` |
| BT8 | `library_coverage`: `ch` inside a word ("Branch 40", "March 12") and filename titles (`ch001.xhtml`) counted as chapters. A `set()` collapsed restarted numbering. Chinese headings were not counted. Gaps were hidden under 20 chapters | Word-bounded pattern, with a dot or space required after a bare `ch`. Spine order. Short body-heading fallback. Per-part count plus `restarts`. Gaps per volume segment | `LibraryCoverage.*` (6 tests) |
| BT9 | `grep_ctx` sorted keys as strings, so `"10"` came before `"2"` and spine order was lost | File order, numeric sort for all-digit keys, and volume taken from `vNN` keys | `test_grep_ctx_*` |
| BT10 | `json_range` crashed on `chNNNNN` keys, and its docstring named `ttks_range.py` | Accepts bare, `chNNNNN` and `-N` part keys. `vNN` keys require `--vol N` | `test_json_range_*` |
| BT11 | `keyword_scan` printed "hits 0" when no member matched `_NNNN`. The same serial in two folders collided. A member with `<div>` text and no `<p>` was skipped | It reports unmatched members, exits 1 when none match, and keeps the second serial as `NNNNb`. A member with no `<p>` is read by blocks. Members that have `<p>` keep their old numbering, so earlier `[SERIALpN]` locators still hold | `test_keyword_scan_*` |

`merge_volumes.py`, `keyword_scan.py` and `library_coverage.py` import one parser
(`epub_to_json.read_members`, `chapter_number`, `is_contents`, `decode`), so the
tools can no longer disagree about what a chapter is. Running `--help` on
`epub_to_json` or `merge_volumes` now prints usage and writes no file.

## Real-library before/after (read-only, counts only)

| Held EPUB | Old result | New result |
|---|---|---|
| Shadow Slave compilation (2faa3640bfc8) | merger: 1840 chapters, **16 "duplicates"** (contents and notes pages) | 1840 chapters, 0 duplicates, 0 missing, 24 front-matter members reported |
| Shadow Slave Vol 11 (b1151c9f2e7a) | coverage: **false gaps 2888, 2889** (titles without the word "Chapter"). Merger: **2852 missing** (lowercase heading) | coverage and merger both 2721-3000, 0 gaps |
| Lord of the Mysteries OldTL (a3a660b7cb04, 2c8e3803cad8) | coverage: **1-1467** (counted `ch001.xhtml` file names) | 1-1430, which agrees with the merger. 38 unnumbered members (foreword, volume covers, guides; 101,975 characters) are now reported |

An AR36b gap scan on the old coverage output could have queued a download for
Vol 11 chapters 2888-2889, which are already held.

## Checks (task record)

- Input identity: built on base `93dcc52c9`, fix commit `64bbc2655`. `epub_to_json.py` sha256 was `ef6da1b1…` (it matches the F16 probe) and is now `6c2428c3…`. `merge_volumes.py` was `aac8efbf…` and is now `3b311f73…`.
- `python3 -I tests/book_text_tools_test.py` on the fixed tools: 34 of 34 pass.
- `BOOK_TOOLS_DIR=<HEAD~ copies of the five book_deep_dive tools> python3 -I tests/book_text_tools_test.py`: 24 of the 28 tool tests fail (21 failures, 3 errors), both F16 tests included. The 6 coverage tests load the current `library_coverage.py`. On the old coverage tool, each of the first draft's four coverage tests failed.
- The real-library before/after above came from the HEAD copies of the tools in the scratchpad against the new ones. Outputs were deleted, and no text was printed beyond headings.
- `npm run check:docs`: no slips in this report or the three edited research docs. Other files still have slips, all in other sessions' paths.
- `npm run check:rules`: FAIL on two problems outside this lane. `docs/CONTINUITY_RULES.md` and `docs/NAMING_RULES.md`, both untracked and owned by another session, have no register row. This lane touched no rules-index input.
- Not run: `npm test`, `build`, `check:arch`. No runtime JS changed, and the Python tests are not wired into `npm test`.

## Open

- O1, F11 runtime: `sceneVolumeChapter` in `scripts/lead_run/build_event_cards.mjs` still ignores the shard. It admits 157 legacy cards where the audit expects 66. The audit holds a proposed patch, and that patch changes lead-run content, so it belongs to the lead-run owner, not this tool lane. Volume-qualified merger keys (BT2) give that consumer a collision-free locator.
- O2: unnumbered side stories and interludes are reported but not kept in the merged JSON. A reader who needs them should use `epub_to_json` output, which keeps every member.
- O3: `hit_context_shards.py` still uses `sys.path.insert(0, …)`. The other tools now append. It is unchanged, so this is low risk.
- O4: the tracked 2-byte file `book_deep_dive/--help` is junk left by an old run of `--help`. It is left for its committer to remove.
- O5, exposure: the private corpus under `docs/research/novels/` holds zero merged `chNNNNN` JSON files. The 139 member-keyed JSONs come mostly from the fork's spine-based intake. A few flat EPUBs have root-level members, where the basename is the full path. This scan found zero F16-damaged outputs. The scan read headings and keys, not prose.
- O6: `hit_context_shards.py` consumes `keyword_scan.members()`, which now has the `NNNNb` suffix and the block fallback. No test chains scan into shards yet.
- O7: the report links into `docs/audits/idea-audit-2026-11-06/`, which the paused audit has not committed yet. Those links resolve on disk but not in the fork until it does.
- O8, tool gap, not built: no current consumer needs a merged-JSON key for unnumbered members, or a volume-aware `grep_ctx` filter. Build either when a reader asks for it.

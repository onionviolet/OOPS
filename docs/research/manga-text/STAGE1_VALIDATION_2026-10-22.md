# Stage 1 validation, 2026-10-22

Stage 1 of the plan in [MANGA_OCR_AND_VISION_OPTIONS_2026-10-22.md](../MANGA_OCR_AND_VISION_OPTIONS_2026-10-22.md)
(D4), approved by Weibao for the three benchmark chapters only. The bulk run was not
started. Tool and usage: [scripts/manga_text/README.md](../../../scripts/manga_text/README.md) (the code moved there on 2026-10-23; commands below use the old `tool/` paths). Outputs are in the
git-ignored `private/` folder (confirmed with `git check-ignore`).

Scope: JJK chapter 1 (58 pages, hash `ccdc7b29...`), chapter 10 (20 pages, `0d3b80d6...`)
and chapter 16 (25 pages, `1fa46fcd...`), the same pages as the benchmark. The downloader
kept running throughout (the catalogue grew from 973 to 1,423 assets meanwhile); nothing in
the Source Library, `catalogue.sqlite` (read-only), its config or its processes was touched.
Runs were `nice 10`, one chapter at a time, no visible windows.

**Gold caveat (repeated on purpose).** The gold transcriptions and the hand panel orders
were typed by a vision model (Claude) reading the page images, not by a human checker. They
share failure modes with any vision model, and the sample is small.

## Results (pass/fail per check)

| Check | Result | Evidence |
|---|---|---|
| V1 Page counts and member order match CBZ and catalogue | **PASS** | All three chapters: page count (58, 20, 25), member order, page numbering and every page SHA-256 equal the catalogue `page_members` and the CBZ contents. |
| V2 Word recall and precision on gold pages | **PASS with caveat** | ch10 p10 recall .99, precision .94; ch16 p8 .95, .94; ch1 p13 .92, .88. These equal the benchmark's whole-page Apple Vision scores (same engine), so they confirm the pipeline did not lose or duplicate text, not that OCR improved. Action page ch1 p46 by item: both speech items found, 0 of 4 sound effects found (consistent with the benchmark: Vision misses or garbles large stylized effects). Scoring excludes sound-effect words. |
| V3 Reading order against 5 hand-ordered pages | **PASS, limited** | 163 of 168 cross-panel pairs in the right order (97.0%) over 5 pages (ch10 pp6, 10, 12; ch1 p13; ch16 p14), plus 1 hand item that did not match any output item. The alternative 12%-band heuristic scored 162 of 168 (96.4%); `overlap` was chosen as the default before comparing, and the gap is one pair, so neither is shown better. Misorders: 2 pairs on ch1 p13 and 3 on ch10 p12, both pages with two side-by-side panels whose bubbles sit at different heights (a lower bubble of the right panel lands after an upper bubble of the left panel). Order inside a panel was not scored because I could not fix a hand ground truth I trusted. Fixing the two-panel case needs panel detection. |
| V4 Flags, empty pages, spreads, runtime, memory | **PASS (reported)** | See the tables below. |
| V5 Five literal FTS queries | **PASS** | See the query table. Results include the expected locations I knew from the gold pages. |
| Idempotence | **PASS** | Re-running the three chapters printed `skip ... (unchanged)` for each, and the output files and index (979 indexed items, 3 chapters) were unchanged. A version bump (0.1 to 0.2, after fixing one box coordinate) correctly re-processed all three. |

## V4 detail

| Chapter | Pages | Items (with text) | Empty pages | Spread pages | Seconds per page | Peak memory |
|---|---|---|---|---|---|---|
| 1 | 58 | 600 (563) | 0 | 3 | 0.36 | 0.63 GB |
| 10 | 20 | 213 (208) | 0 | 0 | 0.50 (0.82 on the first, cold-start run) | 0.61 GB |
| 16 | 25 | 220 (208) | 1 (p4, full-art page) | 1 | 0.43 | 0.63 GB |

Timings are niced, with the downloader running, and include the one-off detector load per
process. Roughly 0.4 s per page means the queue (about 46,000 pages) is about 5 hours, a little
above the 4 hours predicted from the separate benchmark timings.

Flag rates, as a share of items (an outside-box item is a single Vision line, so these rates
are higher than the 3% of lines outside boxes seen in the benchmark):

| Flag | ch1 | ch10 | ch16 |
|---|---|---|---|
| `low_confidence` | 9.7% | 13.1% | 7.7% |
| `very_low_confidence` | 9.7% | 13.1% | 7.7% |
| `outside_text_box` | 14.2% | 8.9% | 7.3% |
| `no_text_in_box` | 6.2% | 2.3% | 5.5% |
| `spread_split` | 1.5% | 0 | 3.2% |

`low_confidence` and `very_low_confidence` are identical because Apple Vision's per-line
confidence in this setup is almost two-valued (1.0, or 0.5 and below), so the second flag adds
nothing. Page numbers are tagged `page_number` (21 in ch1, 3 in ch16, 0 in ch10).

Spread handling: 4 spreads in total (ch1 pp7, 40, 53; ch16 p10), each split into right half then
left half, both with source-pixel boxes. On ch1 p40 the right-half items got reading order 1 to 2
and the left-half items 3 to 5, as intended. One left-half box had a coordinate of -2 in the first
run; boxes are now clamped to the page (tool version 0.2). Spread OCR accuracy was not hand-scored.

## V5 literal search queries (locators only)

| Query | Hits | Locators (chapter, page, number of boxes) |
|---|---|---|
| "occult research club" | 10 | ch1 p9 (2), p13 (4), p19 (2), p20 (1), p29 (1) |
| "goodwill event" | 6 | ch10 p11 (3), ch16 p8 (2), ch16 p15 (1; confidence 0.9) |
| "senpai" | 7 | ch1 p20, ch10 p8, ch10 p10 (3), ch10 p11, ch16 p17 |
| "salmon" | 2 | ch10 p10 (free text), ch10 p12 |
| "sukuna" | 11 | ch1 p4-7 and p43, ch10 p1, p6 and p18, ch16 p25 (2 free-text boxes) |

Each hit prints chapter, page (with `/right` or `/left` on a spread), box id, reading order,
kind, confidence and the source-pixel box. The gold pages confirm the "goodwill event" hits on
ch16 p8 (it appears twice there) and the "occult research club" hits on ch1 p13.

## Gaps and risks

- G1 `panel` is null and order is box-level only; side-by-side panels with offset bubbles can
  misorder (V3).
- G2 Sound effects are largely lost or garbled (0 of 4 on the action page). Stage 1 does not
  type items as speech, thought or sound effect.
- G3 The gold and order references are model-made, few (4 text pages, 1 action page, 5 order
  pages) and all from JJK. Do not read the percentages as a calibrated error rate.
- G4 Vision confidence is nearly binary here, so it is a weak sort key; flag counts show where to
  look, not how bad it is.
- G5 Spread accuracy, raw Japanese, other series' lettering, databook pages and webtoon strips are
  untested. Right-to-left half order assumes manga reading direction.
- G6 `text` equals `text_raw`; no cleanup, speaker or scene data exist until stage 2.
- G7 The tool needs macOS (Vision framework), Xcode command line tools and the venv in
  `~/.local/share/manga-text/`; the `tools` block in each output records the macOS build, so an OS
  update triggers a re-run.
- G8 `--all` takes every CBZ-kind asset in the catalogue, including any non-manga CBZ; use
  `--series` to scope it. The chapter list is fixed at start.

## Exact command for the downloaded queue (not run)

```bash
nice -n 10 ~/.local/share/manga-text/venv/bin/python docs/research/manga-text/tool/stage1.py run --all
```

It skips finished chapters, so it can be interrupted and restarted. Expect about 5 hours for
about 46,000 pages, 0.6 GB of memory and no model tokens. Run `tool/validate.py` afterwards for
the page-hash check (it covers only the three benchmark chapters until extended). Stop and show
Weibao a search sample before any stage 2 (LLM) work.

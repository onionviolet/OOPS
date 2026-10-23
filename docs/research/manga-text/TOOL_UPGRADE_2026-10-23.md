# Tool upgrade round, 2026-10-23

Private research aid; outputs stay in the git-ignored `docs/research/manga-text/private/`. Hand labels and orders were made by a
vision model (me), not a human, on 3 to 5 pages; every figure below is a small-sample check, not a calibrated rate.
Code: `scripts/manga_text/` (README there). Schema 3, `stage1-0.3`, `webtoon-0.9`.

## What changed and how it was checked

| Change | Check and result |
|---|---|
| Sound-effect and kind typing (`speech`, `caption`, `sfx`, `page_number`, `unknown`) | 68 hand-labelled items on 5 pages: 57 right (84%); sound effects 10 of 10, speech 45 of 51, captions 1 of 6 (name cards in text boxes and speech outside balloons are the misses). A variant rule (text boxes without a balloon as captions) scored the same, so it was not adopted. |
| Panels for manga (gutter cuts, `panel` number, panel-first reading order) | Exact panel count on 2 of 7 hand-counted pages (5 of 5 twice; others off by one or two: a white caption box inside a panel, diagonal gutters, text over gutters, a full-bleed layout read as one panel). Cross-panel reading order on 5 hand-ordered pages: 164 of 168 pairs (97.6%) against 163 of 168 before. Gain is marginal; the panel ids are the real addition. |
| Calibrated flags (`risk`, `high_risk`; the near-binary confidence is kept but no longer the only signal) | 50 items on 3 gold pages, 10 with a real error: ranking AUC 0.69 against 0.59 for Apple's confidence alone; the top 10 by risk held 5 of the 10 errors, by Apple confidence 3. A threshold flags few (most errors are single dropped letters or apostrophes), so use the ranking, not the flag. |
| Overlap-strip duplicate suppression (box overlap or same text at the same height and column) | Unit test with invented lines: shifted copies removed, a genuine repeat far away kept. |
| Resumable chapters and no repeated OCR | OCR results cached by image bytes plus helper hash (`private/cache/ocr.sqlite`); unit test: two strips read, the "interrupted" run resumes with only the third read, a third call reads nothing. |
| Schema version and migration | Header and tool block carry `schema` 3; README has the migration note (a re-run rewrites chapters, OCR comes from cache). |
| Markdown per chapter, `verify`, `summary`, `query`, `slice` | Tested on an invented chapter: summary has counts and locators only, query returns text only with `--snippet`, slice honours `--max-chars`, export writes `chapter.md`, verify catches a tampered catalogue hash. Smoke-run on the real library. |
| Local LLM page reads with a cache | `read-page` (loopback Ollama only; cache key CBZ hash, page or strip, model, prompt id). Tested with a fake transport: same key read once, another model, page or prompt reads again, unknown prompt and non-loopback endpoint refused. No page was read with a model in this round. |
| Persistent Vision helper | Measured, not adopted: 103 pages took 7.2 s in batches of 40, 7.0 s through one warm persistent process, 18.4 s with one process per page (the first cold run 33 s). `avision --serve` is available. |
| Rebuild on a fresh machine | `bootstrap.sh`, pinned `requirements.txt`, `models.json` with sha256 of the three detector files at a pinned revision, `fetch-models`, `doctor` checks the checksums, tests run at the end. Not rehearsed on a second machine. |
| Watcher: PAUSE, STOP, worker cap | Integration test on a synthetic library (processing, pause, resume, stop, `OCR_MAX_WORKERS`). A macOS build change alone no longer re-queues chapters (unit-tested). |

All unit tests use invented images: 40 pass. A full re-run of the library with the new versions was started through the watcher
(about 546 chapters, roughly 5 seconds per manga chapter).

## Gaps

Caption typing is weak; panel cuts fail on diagonal or full-bleed layouts; risk is a ranking aid with a small calibration sample;
speaker data stays empty until a selected-pages LLM pass; the fresh-machine bootstrap was not run on another Mac.

## Book mode: scanned PDFs and fixed-layout EPUBs (added 2026-10-23)

Same rules: local only, zero model tokens, private outputs, nothing translated. Code `scripts/manga_text/books.py`, `tables.py`,
`pdfpages.swift`, profile `databook`; command `manga_text.py book`; the watcher reads the governor queue and a local list, books first,
one at a time, pause-aware. Hand checks were done by a vision model, not a human.

**What was run (watcher, 07:21 to 07:36 UTC, all at low priority):**

| Book | Pages | Route | Items / regions | Time |
|---|---|---|---|---|
| JJK official guide (English item, image-only) | 156 | OCR 156 | 1,718 / 25 | 60 s |
| Fate/Grand Order material I (Japanese scan) | 357 | OCR 357 | 1,966 / 36 | 142 s |
| Fate/Grand Order material II (Japanese scan) | 337 | OCR 337 | 1,798 / 43 | 243 s |
| Harry Potter: Page to Screen | 534 | text layer 434, OCR 100 | 471 / 1 | 99 s |
| Tabletop: Imperium Maledictum, Path of the Planebreaker, AoS Soulbound | 368, 242, 352 | text layer (4, 1, 10 pages OCR) | 496, 247, 457 / 0, 0, 1 | 10, 4, 12 s |
| Tabletop: WFRP 4e core, 40K 9th core, Numenera Into the Outside, The Strange character options | n/a | damaged files | reported as errors | 0 |

The Naruto Databook 4 and the JJK Japanese fanbook were not in the queue yet; the queue is re-read every cycle.

**Validation.**
- Synthetic scanned Japanese databook (invented, 2 pages, tilted and noisy): headings and paragraph exact, 5 of 5 table rows exact as key-value pairs,
  4 of 4 framed-box rows (`Key：Value`) exact, English line exact. Unit tests cover this and a fixed-layout EPUB.
- Real Japanese stat page (FGO material I, page 52): Japanese body text about 99% right (one wrong character in about 250), skill titles
  with ranks right. The label-chip stat block over artwork came out as a messy table: 8 of 14 fields right (class, true name, gender, source,
  attribute, height, strength, endurance, agility, magic read; region and weight garbled, luck and noble phantasm missing), and keys are merged
  with values because chips have no colon.
- Real English guide pages (JJK guide, pages 95 and 118): English paragraphs and dialogue lines complete (page 118 all four text blocks, page
  95 every dialogue line, with a few slips such as "Episoce"); printed Japanese quiz lines read, some cut off at balloon edges; handwritten
  Japanese on storyboard sheets is garbage; the storyboard table was found for 1 of 3 sheets with garbled rows.

**Failure modes.** Vertical Japanese columns came back empty in the synthetic test (not tested on a real vertical page). Handwriting and text
over art fail. Tables need ruled lines; chip-style stat blocks need a label list instead. Page-sized frames and panel grids first produced
123 false regions in the guide; guarding for page size and for mostly empty cells cut that to 25. A Vision call hung once for an hour; helper calls
now have timeouts with a per-image retry.

**Left.** A chip-label parser for Servant-style blocks, a vertical-text route, and a hand check on the Naruto Databook and the JJK fanbook
when they arrive.

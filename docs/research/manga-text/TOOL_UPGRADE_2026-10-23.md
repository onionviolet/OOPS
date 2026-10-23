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

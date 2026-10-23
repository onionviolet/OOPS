# manga_text

Searchable, citable text from Source Library CBZ chapters, plus panel clips for webtoon/manhwa
interface windows. Private research aid: outputs stay in the git-ignored
`docs/research/manga-text/private/` folder and are never committed or quoted at length.

- Manga pages: Apple Vision lines grouped by a comic text/bubble detector, spreads split (right half first).
- Webtoon chapters (many scroll slices): slices stitched, cut into 2400 px strips with 400 px overlap, text blocks per strip,
  plus a profile-driven panel step (status windows, scenario/quest cards, system notices, hexagon messages, timers).
  Each panel gets a record with key-value rows and a tight PNG clip.
- The pipeline is chosen per chapter from slice shape and edge continuity (not from the title).
- One FTS5 index over everything, a `CATALOG.json` and a human-readable `INDEX.md`.

Reports: [benchmark and decision](../../docs/research/MANGA_OCR_AND_VISION_OPTIONS_2026-10-22.md),
[stage 1 validation](../../docs/research/manga-text/STAGE1_VALIDATION_2026-10-22.md),
[webtoon panels](../../docs/research/manga-text/STAGE1_WEBTOON_PANELS_2026-10-23.md).

## Safety

Reads CBZs under `~/.local/share/source-platform/library/` and opens `catalogue.sqlite` with `mode=ro`; never writes there
and never touches the downloaders, their lock or config. Writes only to the private folder and `~/.local/share/manga-text/`
(venv, compiled Swift helper). Runs at `nice 10`, one chapter at a time. No page images are kept except the panel clips.

## Setup

```bash
scripts/manga_text/bootstrap.sh           # venv, pinned requirements, checksummed detector, doctor, tests
PY=~/.local/share/manga-text/venv/bin/python
$PY scripts/manga_text/manga_text.py doctor
```

`doctor` checks macOS and Python, modules, `swiftc`, a live Apple Vision read of a synthetic image, the cached detector,
read-only catalogue access, the library folder, a writable private folder, FTS5 and that the private folder is git-ignored.
Environment overrides: `MANGA_TEXT_PRIVATE`, `MANGA_TEXT_LIBRARY`, `MANGA_TEXT_CATALOGUE`, `MANGA_TEXT_HOME`.

## Commands

```bash
M=scripts/manga_text/manga_text.py
$PY $M run --series "Jujutsu Kaisen" [--chapters 1,10,16] [--force]     # explicit pass
$PY $M run --all --progress docs/research/manga-text/private/runs/run_progress.json
$PY $M watch [--interval 600] [--max-workers N] [--pause-file PATH]      # one instance; STOP or PAUSE file
$PY $M search "literal phrase" --series "Omniscient Reader" --kind "panel_scenario_card" [--chapter 10-20] [--limit 20] [--loose]
$PY $M catalog | reindex | profiles | shape --hash <cbz sha256> | doctor | fetch-models
$PY $M verify --series X [--chapter N]       # re-check page hashes: CBZ on disk vs catalogue vs chapter files
$PY $M export --series X [--chapter N]       # chapter.md per chapter (private, text only)
$PY -m unittest discover -s scripts/manga_text/tests      # 40+ synthetic-fixture tests (run from the repo root)
```

`search` prints locators only. `--kind` takes `speech`, `caption`, `sfx`, `page_number`, `unknown`, `text` (webtoon blocks), or
`panel_<type>` (`panel_*` for all panels). `--loose` ignores case, accents, spaces and line-break hyphens.

## Books: scanned PDFs and fixed-layout EPUBs

```bash
$PY $M book --path FILE.pdf [--title T] [--lang ja|en|ja,en] [--ocr auto|always|never] [--force]
```

Local only, zero model tokens. Pages are rendered read-only from the file (PDFKit; EPUB spine images), PDF text layers are used when a page
has 40 or more characters (`auto`), other pages go through Apple Vision with Japanese and English recognition (automatic language
detection). Output is `private/<title>/x-book/chapter.jsonl` with `format: "book"`, `file_sha256` (also in `cbz_sha256`, so the same
index, `summary`, `query`, `slice`, `export` and `verify` work), one `page` record per page, `book_text` items (`text_raw` is never
altered; `lang` is `ja`, `zh-or-ja`, `en` or `other`; nothing is translated), and `book_table` / `book_profile` regions with
`key_values` (ruled tables, ruled boxes and framed boxes; `Key：Value` and two-column rows). Damaged files (no page tree or trailer) are
reported as an error, not guessed. The `databook` profile (`profiles/databook.json`) holds the region settings.

The watcher reads the governor queue `~/.local/share/source-platform/governor/books/ocr_queue.json` (list or `{items: [...]}` of
paths or `{path|file|final_path, title, ocr, lang}`) plus `private/runs/book_queue_local.json`, processes new books first, one at a
time, and skips finished books by file hash and tool block. The queue file is only read.

## Token-light access for other agents (hard rule: no model tokens per page or chapter)

Bulk work is deterministic and local (Apple Vision, the detector, OpenCV, SQLite FTS, plain Python/Swift). Agents never receive page
images or raw OCR dumps; they ask for counts and locators, then fetch a bounded slice only where needed:

```bash
$PY $M summary --series X [--chapter N]                 # counts by kind, flag, panel type; riskiest locators; no text
$PY $M query "term" --series X [--chapter 10-20] [--kind K] [--limit 20] [--snippet 0]   # total, per-chapter counts, locators
$PY $M slice --series X --chapter N --loc P [--max-chars 1500]   # text of ONE page (manga) or strip (webtoon), bounded
```

A vision LLM (local Ollama on loopback only) runs only on pages someone selects, and each result is cached by
(CBZ hash, page or strip, model, prompt id) in `private/cache/llm.sqlite`, so nothing is read twice:

```bash
$PY $M read-page --series X --chapter N --loc P --model gemma4:31b-mlx [--prompt page-json-v1|visual-notes-v1] [--show --max-chars 1500]
```

Apple Vision results are cached too (`private/cache/ocr.sqlite`, keyed by image bytes plus the helper source hash), which makes an
interrupted chapter resume from its finished strips and makes a re-run after a pipeline change skip OCR. Vision helper speed,
measured on 103 pages: batches of 40 per call 7.2 s, one warm persistent process 7.0 s, one process per page 18.4 s (a cold
first run is slower), so the batch call stays; `avision --serve` exists for a persistent process.

### Watcher


`watch` takes `private/runs/watch.lock` (a second instance exits), polls the catalogue every 10 minutes, processes every CBZ chapter
that is not done (done = same CBZ hash and same tool block, which includes the macOS build, detector revision and panel profile
hash; a macOS build change alone does not invalidate a chapter), logs to `private/runs/watch.log`, writes
`private/runs/watch_progress.json` and regenerates the catalog. Create `private/runs/STOP` (or `docs/research/manga-text/STOP`) to end it
after the current chapter. If `~/.local/share/source-platform/governor/PAUSE` exists it finishes the current chapter, takes no new work,
releases its `caffeinate` assertion (it holds one only while processing) and idles until the file is gone. `--max-workers N` or env
`OCR_MAX_WORKERS=N` sets parallel chapter workers (default 1); `OCR_THREADS=N` caps OpenCV/BLAS threads. No LaunchAgent is installed;
the watcher does not survive a reboot (see the audit file for an optional LaunchAgent description). Chapters whose CBZ is missing on disk are retried next cycle; a chapter that
errors three times in one watcher run is left alone until restart. Profile files are re-read every cycle; code changes need a
restart.

## Output layout (stable paths for citing)

```
private/
  CATALOG.json  INDEX.md  index.sqlite  runs/ (logs, progress, lock, STOP)
  <series slug>/<chNNNN[.frac]>/chapter.jsonl           # header, page|strip records, item and panel records
  <series slug>/<chNNNN[.frac]>/panels/pNNN.png|json    # webtoon panel clip and its record
```

Chapter folders are `ch` plus the zero-padded chapter number (`ch0129.5`), or `x-<slug>` for extras. Cite a text span as
`cbz_sha256` + page (or strip) + `bbox`; panel ids restart on every re-run of a chapter, so cite `canvas_y` and `bbox` for panels.

### Schema versions and migration

`schema` is in every header and in the `tools` block. 1: manga items (stage1-0.2). 2: webtoon strips and panels. 3 (current): manga
items get `panel` (gutter cuts, with `panel_method`), `risk` (0 to 1, sorts likely OCR errors first), `in_balloon`, and `kind` is now
`speech | caption | sfx | page_number | unknown` (was `bubble | free | ...`); the `very_low_confidence` flag is gone and `high_risk`
replaces it; page records carry a `panels` list. Migration is a re-run: the tool block differs, so the watcher (or `run --force`)
rewrites the chapter, reusing cached OCR. Old files stay valid readers' input until rewritten (`kind` values differ).

### Record fields

`header`: cbz_sha256, series, chapter, format (`manga` | `webtoon`), page_count or slice_count, tools (tool, ocr, detector,
order, profile), created_utc, run (seconds, memory), stats.
`item`: series, chapter, page (or strip, strip_y_offset, canvas_y, bbox_in_strip, source_slices), bbox, panel, reading_order, kind
(`speech`, `caption`, `sfx`, `page_number`, `unknown`; webtoon blocks use `text`), text, text_raw, confidence (Apple's, nearly two-valued),
risk, flags, speaker and speaker_source (null in stage 1). Coarse typing was 57 of 68 right on hand-labelled gold items (sound effects
10 of 10, speech 45 of 51, captions 1 of 6); `risk` ranked the 10 items with errors at AUC 0.69 against 0.59 for Apple's confidence
(50 items, three pages; small).
`panel` (webtoon): panel_id, type, shape, text_color, frame, rows, key_values, lines, confidence, detect, layout_description,
story_function (a type note, not a per-panel reading), flags, crop_file.
Flags: low_confidence, high_risk, outside_text_box, no_text_in_box, spread_split, panel_inferred, crosses_strip, weak_frame_ring,
oversized_region, touches_chapter_edge.

## Panel profiles (new manhwa without code changes)

`profiles/*.json` hold finder switches and thresholds, strip size, OCR text-mask settings, and ordered classification rules.
`default.json` is generic; a profile with `"series": ["Name"]` and optional `"extends": "default"` overrides only what it lists
(rules lists replace, other dicts merge). Rules match on `text_regex`, `source` (outline, frame, black_fill, color_window),
`shape` (polygon, rectangle), `color`, `frame` (jagged, plain) and `min_kv`; first match wins. The profile name and hash are part of the
done-check, so editing a profile makes the watcher redo that series on the next cycle. Look at the panel clips, then tune the
profile: it needs no code edit.

## Audit helpers (pilots)

`audit.py` works on the index: `terms` (first appearance and spread of literal terms), `claims` (ledger claims to term hits with
locators and short contexts for a reader to judge), `kv` (panel key-value rows as a table), `numbers` (numbers next to a pattern,
by chapter). Term matching is loose by default (line-break hyphens, accents, spacing). Outputs go to `private/audits/`.
Findings and pilot results: [AUDIT_USES_2026-10-23.md](../../docs/research/manga-text/AUDIT_USES_2026-10-23.md).

## Known limits

Books: vertical Japanese text was not read in a synthetic test; handwriting and busy backgrounds (label chips over art) are read
poorly; tables are only found when they have ruled lines; storyboard-style sheets come out garbled.

Sound effects are largely missed by Apple Vision; side-by-side panels with offset bubbles can be misordered; stylized system
fonts garble OCR (keys and values need a crop look); no speaker or scene data in stage 1; panel `story_function` is a type-level
note. English-language text only.

# Watcher, package and registry status, 2026-10-23

Private research aid; outputs stay in the git-ignored `docs/research/manga-text/private/`. Nothing here is committed. The checker for
every hand check mentioned is a vision model, not a human.

## Watcher

`scripts/manga_text/manga_text.py watch` is running detached in its own process group at `nice 10`, with `caffeinate -i -w` on it.
One instance only (lock `private/runs/watch.lock`; a second start exits). It polls the catalogue read-only every 600 s, decides the
pipeline per chapter from slice shape and edge continuity (not the title), skips chapters whose CBZ hash and tool block (tool version,
macOS build, detector revision, panel profile hash) are unchanged, writes `private/runs/watch.log` and `watch_progress.json`, and
regenerates `CATALOG.json` and `INDEX.md`. `private/runs/STOP` ends it after the current chapter. First cycle: of 536 catalogue
chapters it processed 242 (Bleach 214, Omniscient Reader 27 and Pepper&Carrot 1), 0 errors, about 25 minutes niced; the 277 JJK chapters
were carried over from the earlier bulk run. It restarted at 05:17 and 05:29 UTC to load final code (PID 13813 now, caffeinate 13814); each
restart redid only chapters whose profile or tool block changed. Later restarts (for the v3 upgrade, PAUSE support and the worker cap) left it at PID 17774, and the whole library is being re-run with the new tool versions (reusing no OCR cache the first time). The watcher holds `caffeinate -i -w` itself only while it processes chapters and releases it when idle or paused. Profile edits apply next cycle; code edits need a restart (create the STOP file, wait for exit, relaunch).

Chapter format is decided per chapter by edge continuity of adjacent slices plus slice geometry. Measured: JJK and Bleach chapters with 35
or more pages (only 4 exist) scored at most 0.033; the 40-chapter JJK sample peaked at 0.11 and ORV chapters were at least 0.11 (median
0.30). A weak score (0.08 to 0.2) now needs 40 or more slices and at least three distinct slice heights to count as webtoon, so a long manga
chapter with uniform pages stays manga. Hunter x Hunter and Fullmetal Alchemist are not yet measured. New chapter headers record
`shape` (continuity score and slice count); older chapters do not have it. Pepper&Carrot (a Western webcomic) and the 10-slice ORV
chapter 0.5 are routed to the page pipeline.

Downloader observation (05:28 UTC): the earlier `series*.py`, `queue*.sh` and manhwa script processes were no longer running; the
Suwayomi, Komga and source-library services were, and the catalogue kept growing (541 chapters at 05:29, 546 later). I did not touch
any of them; the parent session owns the downloaders.

Start command (also in the package README): create a launcher like `private/runs/launch_watch.py` or run
`nice -n 10 ~/.local/share/manga-text/venv/bin/python scripts/manga_text/manga_text.py watch`.

## Output layout

`private/CATALOG.json`, `private/INDEX.md`, one FTS index `private/index.sqlite` (series, chapter, kind filters),
`private/<series>/<chNNNN[.frac]>/chapter.jsonl`, webtoon clips at `private/<series>/<chNNNN>/panels/pNNN.png|json`.
Search: `manga_text.py search "phrase" --series X --kind panel_scenario_card [--chapter 10-20] [--loose]`, printing locators only.
Totals at the last catalog refresh: 4 series, 539 chapters, 14,627 pages or slices, 77,409 items, 860 panels (ORV still being added).

## Package

`scripts/manga_text/`: `manga_text.py` (doctor, run, watch, search, catalog, reindex, profiles, shape), `common.py`, `pages.py`,
`webtoon.py`, `audit.py`, `validate_gold.py`, `avision.swift`, `access.py`, `llm.py`, `models.py`, `models.json`, `panels.py`, `profiles/`, `requirements.txt` (pinned), `bootstrap.sh`, `README.md` and
`tests/` (40 unit and integration tests on invented fixtures, no real pages; `python -m unittest discover -s scripts/manga_text/tests`, all passing, two tests
need `swiftc`). `doctor` passes all checks, including a live Apple Vision read of a synthetic image and the pinned detector checksums. The older `docs/research/manga-text/tool/`
folder was removed after the move (its code was new in this work).

## Panel profiles

`profiles/default.json` (generic finders, thresholds, ordered classification rules) and `profiles/omniscient_reader.json` (extends
the default with scenario, timer, skill and channel rules). A new manhwa adds a JSON file with a `series` list and only the
overrides it needs; the profile hash is part of the done-check, so editing it redoes that series. A unit test builds a profile in a
temporary folder and shows classification and thresholds change without code edits.

## Other manhwa (Lout of the Count's Family, Eternally Regressing Knight, SSS-Class Suicide Hunter)

None of the three was in the catalogue when this was written (catalogue series: Jujutsu Kaisen, Bleach, Omniscient Reader, plus a
fixture and Pepper&Carrot), so no strip run, hand check or profile was possible for them. The watcher will process them with the default
profile as soon as chapters appear. The next step then: look at 5 to 10 strips each, list new window types, and add a profile if
classification is wrong. This is untested on a second manhwa; do not treat the ORV recall figure as general.

## Registry

Added entry `manga-text` to `scripts/toolsets/registry.json` (20 inserted lines after `tesseract`, probe `doctor`) and one routing row to
`docs/TOOL_REGISTRY.md` (after the local library/PDF/OCR/media row). Both files were clean at HEAD when edited; the zero-loss check printed 0
dropped lines for each, `toolsets.py doctor --probe manga-text` passed, and the toolset tests pass (8). Uncommitted.

Upgrade round (sound-effect typing, panels, risk ranking, caches, token-light access, verify, export, bootstrap): see
[TOOL_UPGRADE_2026-10-23.md](TOOL_UPGRADE_2026-10-23.md).

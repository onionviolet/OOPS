# JJK bulk run and webtoon panel step (ORV), 2026-10-23

Follows [STAGE1_VALIDATION_2026-10-22.md](STAGE1_VALIDATION_2026-10-22.md). Tool usage and flags are in
[scripts/manga_text/README.md](../../../scripts/manga_text/README.md) (the code moved there on 2026-10-23; the commands in sections 1 and 4 use the old `tool/` paths). Everything below lives in the git-ignored `private/` folder; nothing is
committed, no existing file was edited, no visible windows were opened, and all runs were `nice 10`.
The downloaders, the Source Library, `config.json` and the catalogue were not touched (catalogue read-only).

**Checker caveat.** Every hand check below was done by a vision model (Claude) reading strip images, not
by a human. The panel notes are likewise a vision model's reading and are not human-verified.

## 1. JJK bulk run

| Item | Result |
|---|---|
| Scope | `--series "Jujutsu Kaisen"`: 277 chapters, 5,479 pages (the chapter list is read once at start) |
| Process | detached in its own process group, PID 91446, log `private/runs/jjk_bulk.log`, progress `private/runs/jjk_progress.json`, `caffeinate -i -w` PID 91447 |
| Timing | 03:45 to 04:08 UTC (about 22 minutes, 0.25 s per page niced, peak 1.1 GB); both processes have exited |
| Outcome | 274 chapters processed and 3 skipped (the validated benchmark chapters), 0 errors; index holds 277 JJK chapters, 31,647 text items |
| Rerun check | A second run printed `skip` for all 277 chapters |
| Quality signals | 33,691 items; 6.4% of pages (351) had no text; 317 spread pages split; flag rates per item: low confidence 12%, outside text box 9.8%, no text in box 6.1%, spread split 5.4% |
| Validation re-run | `tool/validate.py` still passes on the three benchmark chapters (hashes, 97.0% order, same gold scores), since their outputs were untouched |

Extras (side stories, databooks) keep arriving: the chapter list is fixed at start, so rerun the same command later; finished
chapters skip. Command:

```bash
nice -n 10 ~/.local/share/manga-text/venv/bin/python docs/research/manga-text/tool/stage1.py run --series "Jujutsu Kaisen"
```

## 2. Webtoon strips and the panel step (Omniscient Reader)

Source shape: each ORV CBZ holds 10 to 118 slices, 800 px wide and 7 to 1,500 px tall (a few chapters mix widths). Chapter 1 is
158,312 px tall. Many pages use a black background, so black windows blend into the page.

**Strips.** The tool stacks every slice into one canvas (width = most common slice width; other widths are rescaled and the
scale is recorded), cuts 2,400 px strips with 400 px overlap, and writes a `strip` record per strip. Each text item and panel
carries `strip` (the first strip fully containing it), `strip_y_offset`, canvas `canvas_y` and `bbox`, `bbox_in_strip`, and the
source slice members it overlaps. Overlap duplicates are merged (kept copy is the one farther from its strip edge). Page hashes
are verified against the catalogue first.

**Panel step (separate from the bubble detector).** Four finders, merged, then OCR on 2x crops (the colour crop and a
white-text mask, whichever reads better); a candidate with no text, or an outline with under 5% text coverage, is dropped:
closed bright outlines around a dark interior (hexagon, jagged and stepped boxes); thin bright rectangular frames; black
rectangles with a bright ring; filled blue or cyan windows. Each panel record has type, shape, text colour, frame style, rows,
`key_values` (colon rows, wide-gap column rows, trailing values, and rows whose colon was misread when two or more clean colon rows
exist), confidence, flags, a mechanical `layout_description`, and a type-level `story_function` (my words). The crop is saved as
`private/panels/Omniscient_Reader_ch<N>/pNNN.png` with a 10 px margin, next to `pNNN.json`.

### Panel types seen (my reading, in our own words; candidate UI patterns, not accepted decisions)

| Type | Layout | What it does in the story |
|---|---|---|
| `narration_caption` | boxed line on a dark page, white or yellow text | narrator's commentary and pacing; no rule content |
| `system_notice` | red text in a black box with jagged corners over a busy scene | announces a world event in one or two lines, like a log line |
| `hexagon_message` | hexagon outline with spiked tails; red text for a speaking character, glowing blue on navy for channel traffic | voice from outside the scene (speech or broadcast), not a menu |
| `scenario_card` | cyan window with title bar, window icons, centred objective and key-value rows (type, difficulty, time limit, reward, failure penalty) | sets the stakes of a challenge; closest thing to a quest panel |
| `timer_window` | translucent blue window with large digits, repeated at falling values | shows time pressure for the challenge |
| `system_window` | translucent blue rectangle with bracketed system text | achievement, reward, understanding and trait notices |
| `skill_card` | blue window with a skill name and a level or level change | records a skill gaining levels |

### Hand check on 10 strips (and a first round before fixes)

Method: I rendered strips with the detected boxes drawn on, read each strip image, counted every window (framed caption,
hexagon or jagged message, blue card, timer) as ground truth, and judged each detected crop: whole window with frame, no
neighbouring text.

| Round | Strips | Windows present | Found | Recall | Notes |
|---|---|---|---|---|---|
| 1, first version (black rectangles and frames only) | ch2 strips 4, 15, 22, 43, 45, 49; ch3 strips 7, 37 (8 strips) | 15 | 8 | 53% | missed joined hexagon pairs, a jagged red notice on art, plain captions on black pages; one blue crop swallowed neighbouring text |
| 2, after adding the outline finder and masking outlines out of the colour finder | ch2 strips 3, 14, 23, 41, 44, 50; ch3 strips 36, 39, 58, 60 (10 strips, different from round 1) | 16 | 14 | 87.5% | 1 false positive (a blue-tinted speech bubble); 2 misses |

Round 2 is not independent evidence of generalisation: the outline finder was added after round 1's failures, and the checker is a
vision model. It is a check that the fix works on strips that were not used to design it.

Crop quality (round 2, 14 found plus the false positive): 13 of 14 crops contained the whole window with its frame and no
neighbouring text. One hexagon crop (ch3 strip 60) included the lower edge of a neighbouring glowing sound-effect label. Several
hexagon crops include a band of artwork behind the tail (no text). Blue-window crops include their glow and a few pixels of art.
The scenario card (ch2) crop was complete, with all five rows on one crop.

Failure modes: the upper hexagon in ch2 strip 14 (its outline merges with the white fur of the art behind it) was missed; a
full-width zoomed timer without a frame (ch3 strip 36) was missed; a blue-tinted speech bubble is read as a panel. OCR on the
stylized system font drops or garbles words ("Difficulty" read with an extra letter and a comma), so keys and values need the
`low_confidence` flag and a crop look.

Key-value extraction on the scenario card: 5 of 5 rows recovered (type, difficulty, time limit, reward, failure penalty), 2 via the
misread-separator rule, 1 key with an OCR error. Across 13 ORV chapters the tool wrote 75 key-value rows; only the cards and
skill windows have the stat-sheet shape. No status sheet or rank table has been clearly seen yet in chapters 0 to 11 (one `rank_table` guess
needs a crop look).

### Bulk run on the ORV chapters available now

13 chapters (0, 0.5 and 1 to 11), 701 strips, about 140 seconds in total (8 to 16 seconds per chapter, 0.2 s per strip), peak
2.7 GB (the stitched canvas). 1,503 text items and 252 panels: 86 hexagon messages, 71 system windows, 53 narration
captions, 24 scenario cards, 7 timers, 7 skill cards, 3 other, 1 rank table guess. Flags: 38 `oversized_region` (blue regions over
450,000 px², likely art with a blue tint), 25 `low_confidence`, 2 `weak_frame_ring`. A rerun skipped chapters 0 to 10 and picked up chapter 11,
which had just downloaded, showing the idempotence and late-arrival path.

## 3. Gaps

- G1 The type labels (and the 71 `system_window` and 7 `skill_card` guesses) were looked at, not scored against ground truth.
- G2 The 38 oversized blue regions need a crop look; some are probably art, which would inflate the panel counts.
- G3 Recall (87.5%) comes from 10 strips of two chapters; later chapters add skill sheets, status sheets and rank tables that this
  tool has not been tested on.
- G4 Hexagon and jagged outlines that touch bright art are fragile; stepped caption pairs now work as one panel, not two.
- G5 `story_function` is a type-level note, not a per-panel reading; per-panel notes need a reader pass.
- G6 OCR of the stylized system font drops or garbles words; keys and values are not reliable without the crop.
- G7 Only English-text ORV chapters were run; panel ids restart every run, so cite `cbz_sha256` plus `canvas_y` and `bbox`.

## 4. Commands

```bash
PY=~/.local/share/manga-text/venv/bin/python
# JJK (rerun later for side stories; finished chapters skip)
nice -n 10 $PY docs/research/manga-text/tool/stage1.py run --series "Jujutsu Kaisen"
# ORV: every downloaded chapter, idempotent
nice -n 10 $PY docs/research/manga-text/tool/webtoon.py run --all --progress docs/research/manga-text/private/runs/orv_progress.json
# one chapter again
nice -n 10 $PY docs/research/manga-text/tool/webtoon.py run --series "Omniscient Reader" --chapters 2 --force
```

Next step if Weibao wants the UI designs studied: a reader pass over `private/panels/*/p*.png` and `.json` for the `scenario_card`,
`skill_card` and `system_window` types (about 100 crops so far), writing per-panel notes in our own words.

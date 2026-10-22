# Manga OCR and vision options (benchmark and decision), 2026-10-22

Question: what is the best way to turn the downloaded manga CBZs in the Source Library
into searchable, citable text, and when is visual understanding worth its cost? Serves
SM3 and SM-L2 in the [source deep dive playbook](SOURCE_DEEP_DIVE_PLAYBOOK.md), L4 in the
[media scout](SOURCE_MEDIA_ACQUISITION_SCOUT_2026-10-21.md) and the budget rules in
[agent usage rules](../AGENT_USAGE_RULES.md). Findings and proposals here are not accepted
decisions.

## Recommendation (D1)

1. **Run Apple Vision on every page, with a bubble/text-region detector alongside it.**
   Apple Vision gave 0.92 to 0.99 word recall on three hand-checked pages at about
   0.14 s per page and 0.15 GB of memory. The detector (an RT-DETR comic model) groups
   lines into bubbles and tags free text, also at about 0.15 s per page. The whole
   current queue (about 46,000 pages) costs roughly 4 hours of background compute and no
   model tokens.
2. **Do not run a vision LLM over whole series.** A full-page read costs 55 to 130 s
   per page on this Mac (about 23 to 70 days of continuous running for the queue), and
   its speaker and scene facts need checking. Use it on sampled or selected pages only, and on the databook.
3. **Skip Tesseract, PaddleOCR, manga-ocr and Surya for English scans.** Tesseract is
   weaker, Paddle is about 80 times slower for no gain over Apple Vision, and manga-ocr
   is a Japanese-only model that returns nothing on English. Keep manga-ocr only for a
   future raw-Japanese raw pass.
4. **Stop point:** build and validate stage 1 (below) on 3 chapters, then run it on
   the downloaded queue; stop and show Weibao a search sample before any stage that
   uses a vision LLM.

## What was run

Host: Apple M5 Pro, 64 GB, macOS (Darwin 27.2). The downloader was running throughout;
nothing in the Source Library, `catalogue.sqlite` (opened read-only), its config or its
processes was touched. CBZs were unzipped into the session scratchpad only.

Pages: JJK chapter 1 (58 pages, intro and action, includes 3 double-page spreads),
chapter 10 (20 pages, dialogue heavy, introduces second-year characters through name
captions) and chapter 16 (25 pages, dialogue and training). All 103 pages went through
Apple Vision. A 30-page subset (ch10 pp5-14, ch16 pp1-10, ch1 pp8-17) went through the
detector. Four **gold pages** were hand-checked: ch10 p10 (dialogue and name-caption
page), ch16 p8 (dense dialogue with sound effects) and ch1 p13 (caption box, mixed
bubbles, stylized sound effects). The fourth is ch1 p46, a pure action page (two speech
bubbles, four large sound effects, no caption text). No databook page exists yet, so
ch1 p13 is only the densest caption page available, not a true databook stand-in, and
it holds fewer words (98) than ch16 p8.

**How accuracy was checked.** I looked at each gold page image and typed its dialogue,
caption and narration text into a private scratch file (about 309 words on the first three, sound
effects listed separately and excluded from scoring; the action page was checked by
item, not by word score). **The gold was made by a vision model (me), not by a human
checker, so it shares failure modes with the LLMs scored against it and the near-1.00
LLM scores are inflated beyond memorization alone.** Each engine's output was scored as
case- and punctuation-insensitive word-bag recall (share of gold words found) and
precision (share of output words that are in the gold). Three pages is a small sample;
treat differences under about 5 points as noise. Order, speaker and scene claims were
judged the same way, with no second annotator.

## Benchmark table

| ID | Option | Recall / precision on gold pages (ch10 p10, ch16 p8, ch1 p13) | Seconds per page | Peak memory | Install footprint |
|---|---|---|---|---|---|
| B1 | Apple Vision, whole page, English | .99/.94, .95/.94, .92/.88 | 0.14 (103 pages; 3 s warm-up on the first) | 0.15 GB | none (OS framework, 69 KB Swift binary) |
| B8 | Detector alone (`ogkalu/comic-text-and-bubble-detector`, RT-DETR on MPS) | n/a, 29 to 40 boxes per gold page (bubble, text_bubble, text_free) | 0.15 (30 pages) | 0.7 GB | 803 MB env (torch) + 172 MB model |
| B9 | `gemma4:31b-mlx`, whole page, JSON transcription, thinking off | .99/.96, .99/.98, .98/.95 | 79 to 127 (about 12 output tokens/s) | about 21 GB (Ollama ps, ctx 8192) | already installed (19 GB) |
| B10 | `qwen3.8:27b`, same prompt | 1.00/1.00, .98/.97, .99/.98 | 43 to 63 | model is 18 GB; not measured separately | already installed |
| B11 | Hybrid: Apple Vision lines grouped by detector boxes, then gemma gets the page image plus the numbered text and returns speaker/type only | text is Apple's, so same as B1; speaker pass below | 74 for the LLM step on ch16 p8 (615 output tokens) on top of B1+B8 | about 21 GB | none beyond B1, B8 |

**Dropped as weak** (kept only as a one-line record; the rows were cut on Weibao's
2026-10-22 request). Tesseract on whole pages scored recall .57 to .88 with precision as low
as .43, and .76 to .93 on detector crops with .72 to .76 precision. PaddleOCR matched Apple Vision
(.95 to .99 recall) but took 9 to 13 s per page and 3.9 GB. manga-ocr returned nothing on English
text (Japanese-only model). Surya OCR 2 needs a llama.cpp or vLLM server and a 1.37 GB vision
model, the same class as the Ollama models. Magi v2 is 2.06 GB and the detector already gives
boxes. Apple Vision per detector crop gave no recall gain over whole page and added duplicates.
Scratch environments for these can be deleted on request.

Notes on the numbers:

- Apple Vision scored 3.6% of 3,171 lines (114) below 0.9 confidence over all 103 pages, and
  the low scores clustered on sound effects and stylized lettering, so confidence is a
  usable "check me" flag. Its precision loss is mostly sound effects and a few
  hallucinated glyph runs, not wrong dialogue.
- Apple Vision lines landed inside a detected text box 96.8% of the time (1,054 of
  1,089, 30-page subset), so detector grouping covers nearly everything. The 3% outside
  are mostly free sound effects and page numbers.
- B5 does not beat B1 on recall and adds duplicates where boxes overlap. Cropping helps
  Tesseract (B2 to B4) and does nothing useful for Apple Vision.
- LLM OCR scores (B9, B10) are the highest, but a famous series may be partly
  recalled from training data. Three pages cannot separate reading from remembering, so
  do not treat them as proof for unknown or lesser-known sources. The exact same caveat
  applies to the speaker names below.
- Timings were taken with the downloader running, so absolute figures are somewhat
  pessimistic. Ollama figures include no model load except the first call per model.

## Action page result (ch1 p46)

Gold: 2 speech bubbles and 4 large sound effects. Apple Vision returned both speech
bubbles at full confidence, read one effect with a wrong first letter, returned a
fragment of another and missed the two largest effects. qwen 3.8 returned all six items
correctly typed (speech versus sfx) in 23 s. So on action pages Apple Vision loses
the effects (a loss only if effects matter for searching) and an LLM recovers them; for
dialogue search the loss is small.

## Failure modes seen

- **Sound effects.** Every engine reads them inconsistently. Apple Vision splits large
  stylized effects into fragments ("RAHH" read as "ERAHH", "GRR" as "GRR.") with
  confidence 0.5. The LLMs read them cleanly but type them as speech or thought
  sometimes. Treat sound effects as a separate `kind` and never trust them for search.
- **Stylized or italic lettering.** Name captions and caption boxes with condensed type
  scored lower confidence ("INUMAKI", "YUJI" read as "YUSI" or with a stray dash).
- **Speaker and type labels.** In gemma's whole-page read on ch16 p8, the named
  speakers matched my reading of the page for the lines I could attribute (I did not keep
  a line-by-line tally), but several of Yuji's spoken lines were typed "thought". On ch10 p10, where name captions sit beside the characters,
  gemma labelled almost everything "unknown". Qwen 3.8 labelled nearly everything
  "unknown" on all three pages. In the hybrid pass (B11) gemma dropped one numbered
  bubble from its answer and attributed a name-only bubble to a character without
  evidence either way. Its four "fix" edits were not compared against Apple's raw
  text, so I do not know whether they corrected errors or rewrote correct text. Names are plausibly coming from series knowledge, which is a risk for
  lesser-known sources.
- **Scene descriptions.** gemma's one-line-per-panel notes were short, mostly right
  and vague about who is who (it described the speaking boy in one panel as a man
  speaking to him). Qwen's notes included a clear error (it said one character pats
  another on the head; the page shows him pointing) and an invented nickname reading.
  Visual output needs a spot check against the page, always.
- **Reading order.** Apple Vision returns lines in no bubble order. Panel order in
  these scans is right to left, top to bottom, while the text inside an English bubble
  reads left to right. My simple band heuristic (12% of page height, then right to
  left) was enough for grouping but I did not score it against a true panel order;
  that is an open check.
- **Double-page spreads.** 4 of 103 pages (about 4%) are 2133x1600 spreads (ch1 pp7, 40, 53
  and ch16 p10). They need splitting into right half then left
  half before ordering. I did not benchmark spread accuracy.
- **Furigana-free English scans versus raw Japanese.** All of the above is English
  scanlation text. Raw Japanese changes the answer: Apple Vision's Japanese recognizer
  (`ja-JP`, vertical text) and manga-ocr on detector crops become the main candidates,
  and Tesseract and Paddle English models are irrelevant. Untested here.
- **Databook (JJK Official Character Guide) would change the answer.** Stat tables,
  small print and mixed layouts reward a layout-aware pass: Apple Vision per region or
  per table crop plus a vision-LLM check of tables, not bubble detection. Expect the
  LLM cost to be justified on those pages (hundreds, not tens of thousands) because they
  hold rule-like numbers. Re-run this benchmark on 10 databook pages when it arrives.
- **Detector.** On gold pages it found 29 to 40 boxes, with `bubble` boxes
  duplicating `text_bubble` ones; only `text_bubble` and `text_free` were used.
  Missed or split boxes were not hand-counted.

## Output schema proposal (D2)

One JSON Lines file per chapter CBZ, one record per text item, with a header record.

```
header: {schema: 1, cbz_sha256, series, title, page_count, created_utc,
         tools: {ocr: "apple-vision@<macOS build>", detector: "ogkalu/comic-text-and-bubble-detector@<rev>",
                 llm: null | "gemma4:31b-mlx@<digest>"}, reading_direction: "rtl-panels"}
item:   {cbz_sha256, volume, chapter, page, page_member: "00010.jpg", page_sha256,
         spread_half: null | "right" | "left",
         panel: null | int, panel_confidence: null | float,
         bbox: [x0, y0, x1, y1] in source-image pixels,
         group_id, line_ids: [..],
         reading_order: int,
         kind: speech | thought | narration | caption | sfx | page_number | databook_cell | unknown,
         text, text_raw, confidence (OCR mean), detector_label, detector_score,
         speaker: null | name, speaker_source: null | caption | llm | human,
         flags: [low_confidence, fragmented_sfx, outside_text_box, spread_split, llm_changed_text, unverified],
         tool_versions: {...}}
```

Rules: keep `text_raw` (OCR) beside any LLM-cleaned `text`; never overwrite. The locator
quoted in any note is `cbz_sha256:page_sha256:group_id`, which survives re-downloads.
Visual notes go in a separate `visual` record per page (`page_sha256`, `panel_notes`,
`model`, `prompt_id`, `checked: false` until a human or frontier review confirms it).

Storage: `docs/research/manga-text/private/` is **already ignored**
(`.gitignore` line 41, `/docs/research/*/private/`), confirmed with `git check-ignore`.
Proposed layout: `private/<series>/<cbz_sha256>.jsonl` plus `private/index.sqlite`
(FTS5 over `text` with item locators) and `private/visual/`. The Source Library stays
read-only. No images are stored; page images remain in the CBZs.

## Does vision add enough beyond OCR? (D3)

Yes for a narrow set of questions, no as a bulk pass.

| Question | OCR alone | Needs vision | Verdict |
|---|---|---|---|
| What was said (searchable dialogue and captions) | yes | no | Stage 1, all pages |
| Who is speaking | partly (name captions, vocatives) | yes for tail attribution | gemma matched my reading on one page (no formal tally), but recalled names from series knowledge are unverifiable; use only on sampled pages and mark `speaker_source` |
| Character introductions and name captions | yes (caption text) | no | Stage 1 text search finds them |
| Which technique is shown | dialogue and effect names mostly | yes for unnamed visuals | selected pages only, with a frontier spot check |
| Panel-level scene facts, geography, objects | no | yes | selected pages, 30 to 125 output tokens per page keeps it near 30 s |
| Databook tables and stats | yes if layout is clean | check cell alignment | stage 3 |

At 30 to 130 s per page, a full-queue vision pass is 16 to 69 days of continuous GPU
use and would also block other local Ollama work. Visual notes should be a small budgeted
line (SM-B9, AU rules), triggered by a text query hit or a design question, not run
because the pages exist.

## Cost and time for the whole current queue (about 2,200 chapters)

Assumption: JJK averages 20.9 pages per chapter (93 chapters, 1,945 pages in the
catalogue at check time), so the queue is about 46,000 pages (range 40,000 to 50,000
for series with shorter or longer chapters). Per-page seconds are the measured figures
above; no queueing or model-load overhead is included.

| Option | Whole-queue compute | Model tokens charged | Comment |
|---|---|---|---|
| Apple Vision (B1) | about 1.8 h | 0 | does not need GPU contention with Ollama |
| Apple Vision + detector (B1 + B8) | about 3.7 h (both sequential; less if overlapped) | 0 | recommended stage 1 |
| gemma whole-page JSON (B9) | about 42 to 68 days | local, free | not feasible for everything |
| qwen whole-page JSON (B10) | about 23 to 34 days | local, free | not feasible for everything |
| Hybrid LLM speaker pass (B11) | about 40 days | local, free | not feasible for everything |
| gemma, short visual notes only | about 15 days | local, free | selective only |
| Selective vision on 3% of pages (about 1,400 pages) | 12 to 40 hours | local, free | affordable, sample-driven |

## Manhwa, webtoons and games-style panels (D5, proposal, untested)

Weibao's direction: if we target manhwa and similar sources where status windows, skill
cards, quest popups, rank tables and system notices appear, we could absorb those
specific UI shapes and panels into the game (for example into the UI patterns
under [UI rules](../UI_RULES.md)). Nothing in the catalogue is a manhwa yet, so every
statement here is inference from this benchmark, not a measurement.

- **Why they are easier to read.** System panels use clean digital fonts on flat
  boxes, which is the case where Apple Vision was strongest (high confidence, few
  fragments). They also hold rule-like content (stats, skill costs, cooldowns, ranks),
  the same value as a databook.
- **Different job from bubbles.** Do not use the bubble detector for these. Add a
  panel-region step: find the box (a simple contrast/edge pass or a small detector fine
  tuned on a few labelled examples), OCR it with Apple Vision using its line boxes, then
  parse into key-value records (`panel_type: status | skill | quest | notice`,
  fields, values, units). A vision LLM checks layout and alignment on those pages only,
  because column alignment is where plain OCR gets table cells wrong.
- **Format changes.** Webtoons are long vertical strips, not pages. Slice with 10 to 15%
  overlap, de-duplicate lines in the overlap by text and position, and store
  strip offsets instead of page numbers (the scout's L4 note on coordinates). Reading
  order is simply top to bottom and left to right, no right-to-left spread logic. Color
  art lowers contrast for text over images, so expect more low-confidence flags.
- **What to absorb.** Store each distinct panel as a record with its screenshot-free
  description (layout, fields, grouping, what changes between appearances) so the UI can
  be redesigned in original form, not copied. Keep the page and strip locator for each.
  Record, per series, what the panel does for the story (a level-up reveal, a quest
  rule), which feeds the design owners rather than becoming a rule.
- **Cost.** A panel pass runs only on pages where the region step fires, probably 2 to
  8% of strips (unmeasured), so the Apple Vision plus selective LLM cost stays in the
  hours-to-days range.
- **Next check, small.** When a manhwa chapter is available, take 10 strips with
  panels, run Apple Vision plus the region step, and hand-check field extraction. Stop
  there before building the parser.

## Staged plan with stop point and reader split (D4)

Reading cost rules: AU1-AU15 apply; page text goes to readers as bounded chapter shards
(about 12,000 words), not as images.

- **Stage 0 (done, scratchpad only).** This benchmark.
- **Stage 1: structural pass, no LLM.** A small script (a Swift or pyobjc Apple Vision
  call and the detector, run one chapter at a time at low priority, writing the schema
  above to `private/`). Split spreads, group lines by detector box, set flags, build the
  FTS index. Validate on the three benchmark chapters and recheck the order heuristic
  against 5 hand-ordered pages before the bulk run. **Stop point:** report page counts,
  flag rates and a search sample to Weibao before running the queue; the run itself is
  about 4 hours. Not started; this task made no changes beyond the report.
- **Stage 2: cleanup and attribution on chosen chapters only.** For chapters selected by
  a design question, gemma (default; qwen is faster but labelled almost nothing) reads
  page image plus numbered text (B11) to fill `speaker`, `kind` and obvious `fix`es,
  always keeping `text_raw` and a `speaker_source` of `llm`. Spot check 5 pages per
  chapter against the images.
- **Stage 3: databook.** On arrival, benchmark 10 pages, then Apple Vision per region
  plus a vision LLM check of tables and numbers. This is where model reading earns its
  cost, since the content is rule-like.
- **Stage 4: visual notes.** Per question, on pages named by a stage 1 text hit or by
  Weibao, with the short visual prompt and a frontier spot check. Output only to
  `private/visual/`, in our words, no images committed.
- **Haiku-reader division of labour.** Stage 1 needs no readers (deterministic).
  Haiku readers take bounded chapter text shards from `private/` for extraction (rule
  statements, technique names, character facts), each returning at most 200 words plus a
  path with locators. Sonnet does synthesis across shards and checks conflicts. A
  frontier or vision-capable model is reserved for spot checks of stage 2 and 4 output
  and for table checks in stage 3. No agent reads page images in bulk.

## Open checks and gaps

- Reading order and bubble grouping were not scored against a true panel order.
- Spread pages, raw Japanese and databook pages were not benchmarked.
- Memory for qwen and tesseract was not measured; detector box misses were not counted.
- Surya and Magi were not run (reasons in B12 and B13).
- The 30-page subset covers only the detector and Apple Vision grouping figures; the
  per-engine accuracy numbers come from the three gold pages.

## Reproducibility

Everything lives in the session scratchpad, outside the repo: the Swift Apple Vision
tool, the RT-DETR detector and crop scripts, isolated Python 3.13 environments for
manga-ocr, PaddleOCR, torch/transformers and Surya, the hand transcriptions, and raw
outputs. PaddleOCR cached 133 MB of models in `~/.paddlex`, and Hugging Face downloads
(manga-ocr, detector) are in `~/.cache/huggingface`. Nothing was committed or pushed.

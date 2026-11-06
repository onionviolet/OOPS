# Library atlas, 2026-11-06

A view of the book library against what the project needs from it. It adds no new tracker: holdings live in [LIBRARY_INDEX](LIBRARY_INDEX.md), wants in [the wishlist](DOWNLOAD_WISHLIST_2026-10-30.md), rules for runs in [source acquisition tools](SOURCE_ACQUISITION_TOOLS.md). Findings and proposals here are not accepted decisions.

**Inspected:** Source Library database (3,500 assets: 1,594 cbz, 1,006 epub, 900 pdf, 21 GB), Calibre catalogue (232), wishlist queue script, index headings and the Wandering Inn and Hunger Games receipts, the novels working dir (157 folders, 43 with a private prepared copy, 11 GB), disk and quota state at 2026-11-06 ~15:00 UTC. **Not inspected:** file contents (no book opened), per-series reading state in run files, the manga runner's logs, the 32 world folders beyond their names.

**Verification states kept apart.** Everything fetched on 2026-11-04/05 is downloaded and md5-checked (epub/cbz inspected on intake). None of it is screened (PDFs), read, committed or packaged.

## What you can do now

Acquisition is no longer the bottleneck. The library holds the main series Weibao named (Wandering Inn 1-19, Hunger Games 5 books, Riordan, Re:Zero, Slime, Overlord, Frieren, Witch Hat Atelier 1-14, most Royal Road favourites that have ebooks) plus a broad tabletop shelf (5e 2024 core, Pathfinder and Forgotten Realms settings, Shadowrun, Call of Cthulhu, WFRP, Glorantha rules, The Dark Eye and more). What is thin is the step after holding: screening, text access and reading.

## Findings

| ID | Kind | Finding | Consequence | Locator | Next check or action |
|---|---|---|---|---|---|
| F1 | Missing connection (**closed 2026-11-06**: 26 rows written back; queue now 44 open, 46 partial) | Wishlist write-back was never done for the 2026-11-04/05 rounds. `wishlist_queue.py` reports 64 open and 26 partial rows, but DL67-71, DL75-76, DL79-80, DL83, DL87-89 and part of DL81 are held per the index receipts | The next run follows step 1 of the wishlist procedure, picks "open" rows that are already held, and spends quota on them or on duplicates | `DOWNLOAD_WISHLIST_2026-10-30.md` lines 18-34, queue output | Strike through held rows with date; owner is the wishlist |
| F2 | Verification gap, leverage | 900 PDFs, ~150 of them new this week: no screening record in the index for these, and no text index. Held rule books can not be searched by the rules and world work that wants them | Tabletop acquisition has produced files, not usable references; hidden text is unchecked | `pdf-screen` skill; index has no per-file screen state | Run `pdf-screen` on the new PDFs, then extract text to a private searchable store in the same pass |
| F3 | Verification gap (**closed 2026-11-06**: word counts about 102k, 101k and 101k for books 1-3, so the small sizes are compression, not truncation) | *Catching Fire* is 0.46 MB and *Mockingjay* 0.44 MB beside 2.3-3.0 MB for the other three Hunger Games books | Possibly truncated or image-light copies; Hunger Games world work may sit on thin text | Source Library metadata | Open both: spine and word count against book 1 |
| F4 | Missing item | Wandering Inn book 20, *Memory's Flame*, released 2026-11-03; held coverage ends at 19. Books 18-19 are web compilations, not retail | The prime series is one book behind | `LIBRARY_INDEX.md` Wandering Inn receipt | Search Anna's and Z-Library after the quota reset |
| F5 | Defect | `acquire` for Z-Library collects only `*.epub`, so a PDF or CBZ download fails with `unexpected_download_outputs` but still spends quota | Quota loss on non-epub Z-Library fetches (3 lost on Frieren 11-13) | `source_platform.py` ~line 1529 | Patch the glob, or route non-epubs to Anna's fast |
| F6 | Constraint | Anna's fast is at 0 of 50 and Z-Library 1 of 30 until 00:00 UTC. Free routes (slow queue, free SRDs DL72-74 and DL92-94) were not run this round | Quota is the daily cap, but free items wait on nothing | Receipts 28-29; `desktop-status` | Queue the free routes while quota is out |
| F7 | Risk | Disk 37 GiB free (was about 46 GB earlier today); the manga governor pauses at 30; staging holds 2,355 entries / 1.0 GB | About 7 GiB of headroom, roughly 20-60 more large PDFs | `df`, `source-platform/staging` | Inspect staging for stale entries; do not delete without a go |
| F8 | Unknown | Reading depth: 43 of 157 novel folders carry a private prepared copy; per-series reading state lives in run files not reconciled here | Cannot say how much of the 1,006 epubs has been read; the library may be bigger than the reading | `novels/*/private`, `BATCH_READING_WORKFLOW.md` | Reconcile once, from the run files |
| F9 | Open gaps | Not found on either route: Torg Eternity (English), The Strange core, GURPS Low-Tech Companion 3, Monster Manual 2025, Night's Black Agents core, HârnMaster core, Mystara GAZ1-14, Ptolus core, Empire of the Petal Throne, M&M 3e GM's Guide, the English JJK fanbook, Naruto databooks, Mark of the Fool 11+, Slime 23, Re:Zero 30, clean Fate/strange Fake 3/6/7 | These stay missing unless another route exists | Index "Quota spend" and "Tabletop" paragraphs | Publisher or DriveThru purchase is Weibao's call; alternative scans on other Anna's md5s |
| F10 | Unknown | Manga runner carries `prior_job_requires_review`, never investigated | Unknown whether manga intake is paused or wrong | runner state | Read the runner's last job record |

## Where it is strong, thin or unknown

| Domain | Held | Verified | Read | Notes |
|---|---|---|---|---|
| Royal Road and web serials | Strong: hundreds of epubs plus S1-S10 captures | Epub checks only | Partial (43 prepared folders overall) | Most shelf favourites are RR-only with no ebook; partial series are listed in the index |
| Canon novels (Wandering Inn, Hunger Games, Riordan) | Strong | Epub intake only | Unknown | F3, F4 |
| Light novels (Re:Zero, Slime, Overlord, Irregular, Fate) | Strong | Epub intake only | Unknown | Tail volumes and Fate/strange Fake text are the gaps |
| Manga (cbz) | 1,594 volumes | Intake only | Not applicable | F10; Naruto and JJK companions missing |
| Tabletop rules and settings (pdf) | Broad; 900 PDFs | **Not screened** | Not read | F2, F9 |

## Opportunities beyond filling gaps

- **O1 (F2).** One extraction pass that screens each PDF and writes text to a private index would turn the tabletop shelf from storage into a lookup tool; it is also the safety gate.
- **O2 (F6).** The free SRDs (Level Up A5E, Tales of the Valiant, Starfinder 2e, Worlds and Stars Without Number, OSE) cost no quota and fill DL72-74, DL92-94.
- **O3.** A single weekly "what is new" check for ongoing series (Wandering Inn, Mark of the Fool, Shadow Slave, A Soldier's Life) replaces ad hoc discovery.
- **O4.** Official companions for held manga (databooks, fanbooks) are the thinnest area relative to how many volumes are held.

## Next moves

Accepted priority (wishlist, 2026-10-31): Royal Road continuations and full published series first, then rulebooks. Under that, F4 and the partial RR series come first after reset. F1 is cheap and should precede the next run. Everything else here is a suggestion.

## Tooling update, 2026-11-06 (source-library; edited, test slices passing, not committed)

**Changed** (repo `/Users/weiwei/code/source-library`, scripts and tests):

- **F5 (edited, tested with fakes).** `acquire` now collects epub, pdf and cbz from a Z-Library download (mobi still rejected); md5, size-cap and dedupe checks are unchanged. A failed collect returns `quota_likely_spent` and the staged file names. No real quota was spent in testing.
- **F2 (tool tested; run on 14 PDFs).** `scripts/pdf_text_pass.py` screens registered PDFs with the `pdf-screen` scanner and stores reading text, quarantine text and a slim report per sha256 under `~/.local/share/source-platform/pdf-text/` (private, outside git). It records clean, flagged or failed in `pdf-text/screen.sqlite`. It is resumable, disk-guarded (31 GiB) and never writes library files. Run it with the pdf2md Python, since the library venv lacks PyMuPDF.
- **F10 (investigated, nothing cleared).** `prior_job_requires_review` is a per-candidate guard in `acquire`, not a runner pause: a candidate whose earlier job ended `interrupted` or `issued` is never re-fetched automatically. The catalogue holds 77 interrupted jobs and 1 stale `issued` job (`suwayomi:chapter-3541`). Four Z-Library keys (5282224, 5783653, 16594219, 18548309) are blocked by the old F5 bug and would retry under the fix, but each retry spends quota, so they stay blocked until Weibao says.
- **Held check.** `scripts/held_check.py` looks up md5 (definitive, file must exist) and title (hint only) read-only; exit 0 means held, skip the download.

**Screen result, receipts in `wave-2026-11-04/receipts*.jsonl` (the only PDF receipts found: 14, not the ~150 the atlas estimated):** 14 screened, 1 clean, 13 flagged, 0 failed. 4,745 pages, about 13 MB of reading text. Flags are layout heuristics (low-contrast, tiny or off-page text, which styled rulebooks produce), not verdicts. 5 of the 13 also carry an `instruction_hint`; those pages need a look at the page images before the text is trusted. The one "clean" file is a 209-page scan with almost no text (all pages text-poor), so it needs OCR (`pdf-screen --ocr`) before it is searchable. Time was 2.8 min per PDF.

**Remains:** 886 registered PDFs are unscreened (a full run is roughly 40 hours at this speed; run in `--limit` slices). The 5 instruction-hint files need visual review. The scan needs OCR. The 4 blocked Z-Library keys need a decision. Full `npm`-side gates were not run (docs-only change here); nothing is committed.

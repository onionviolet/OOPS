# Library index: where each prime book is (start here)

2026-10-28. **The main source of truth for "do we have this book, and what is missing?"** Other documents link here and must not keep their own holdings or missing-source lists. Check here before searching, asking Weibao or acquiring anything. Two book stores exist, each with a generated list: [Calibre](CALIBRE_CATALOGUE.md) (232 books) and the Source Library at `~/.local/share/source-platform` ([SOURCE_LIBRARY_CATALOGUE](SOURCE_LIBRARY_CATALOGUE.md), about 1,890 assets, mostly tabletop rulebooks). Loose files also sit in `~/Downloads` and `~/Downloads/Books_Reading` (80 books). Regenerate both lists with `python3 -I scripts/library_catalogue.py`. Older import evidence: [LOCAL_LIBRARY](novels/LOCAL_LIBRARY.md) (private, gitignored). Reading procedure and keys: [BATCH_READING_WORKFLOW](BATCH_READING_WORKFLOW.md). Machine-readable registry: [`books.json`](../gm/dispatch/batch-reading-2026-10-27/plans/books.json).

Source text stays outside tracked files. Never modify the library; convert into a gitignored private copy.

## Prime books

| Book | Language | Source | Chapters on disk | Batch keys |
|---|---|---|---|---|
| Lord of the Mysteries 诡秘之主 (Ai Qian Shui De Wu Zei) | zh | Calibre 1, EPUB with `nav.xhtml`, 8 volumes (chapters restart per volume) | volumes 1-8 | `lotm2`-`lotm8` (volume 1 read by the older wave plans) |
| Lord of the Mysteries, English (Webnovel official translation) | en | Loose in `~/Downloads` (2026-10-30, Weibao): `Lord.of.the.Mysteries.-.Webnovel.Default.epub` (official) and `...OldTL.Default.epub` (the same text with 114 chapters swapped or edited; only chapter 1 and the side story "A Day in The Year 1346" differ substantially, median similarity 1.0). Publisher tag "LOTM-Reader", 328 webp illustrations, a pathways guide and an image gallery. Not imported to Calibre or a private copy yet | 1-1394 in 8 volumes, same per-volume counts as the Chinese; side stories as chapters 1395-1430, plus 2 side stories and 2 bonus chapters. Fills the 3 chapters missing from the Chinese shards (volume 3 ch 231, volume 4 ch 62, volume 8 ch 7) | overlay for `lotm*` (LSD469-LSD470), no reading key |
| Circle of Inevitability, "Lord of Mysteries 2" (the sequel by 爱潜水的乌贼 / Cuttlefish That Loves Diving, lead Lumian Lee) | en | Calibre 34, English web-scrape EPUB (file names credit the author; embedded metadata does not). Chinese text not yet downloaded, see pending. A complete edition is loose in `~/Downloads` (2026-10-30): `Circle.of.Inevitability.-.Webnovel.Default.epub`, 1-1179 with no gaps, 5 volumes, a side story and the afterword; the `...Webnovel.Legacy.epub` beside it has text identical to Default in all 1,192 files | 1-1179 (Calibre 34 skips 1026 and cuts the afterword; the Downloads edition has both) | `coi` |
| Shadow Slave (Guiltythree) | en | Calibre 16 (chapters 1-1840, NCX), 35 "Vol 9 - Throne of War" (1841-2260), 36 Vol 10 (2261-2720, NCX), 37 Vol 11 (2721-3000, no NCX, read as `html`) | 1-3000 | `ss`, `ss9`, `ss10`, `ss11`. Not on disk: 3001+ |
| Mother of Learning (nobody103) | en | Calibre 21, EPUB | 1-106 plus epilogue | `mol` |
| Harry Potter 1-7 (Rowling) | en | One omnibus PDF in `~/Downloads` (also Calibre author folders `J. K. Rowling`) | books 1-7 | `hp1`-`hp7` |
| A Soldier's Life (Always RollsAOne / Erick Thiemke) | en | Calibre 55, 56, 57, 58, 112; book 4 only as a `.mobi` in `~/Downloads` (converted copy in the private folder) | 1-384 (books 1-6) | `asl1`-`asl6`. Books 7+ not on disk |

## Batch-registered hero works (2026-10-28, run files pending Weibao's go)

Registered in `books.json` from Calibre or a Royal Road capture, converted to a private `Chapter N: Title` copy under `docs/research/novels/<slug>/private/source/` (the converter for the Calibre EPUBs is `scripts/lead_run/normalize_epub_chapters.py`). Run files `plans/overnight_2026-11-01-<world>.json` are `approval: PENDING`. All November plans (these, `coi` and the five TTKS books, Reverend Insanity and A Regressor's Tale of Cultivation) were regenerated at schema 1.4 on 2026-10-28 (`make_book_plans.mjs --schema 1.4`); ceilings are about 0.75 of each true-bound cap.

| Book | Source | Chapters | Batch keys | Run file (ceiling) |
|---|---|---|---|---|
| Worm (John McCrae) | Calibre 32, EPUB; every spine file is a chapter, numbered 1-304 in reading order (bonus interludes included) | 304 | `worm` | `2026-11-01-worm` ($33) |
| You Are Summoned 1-5 (Dean Henegar) | Calibre 48, 49, 51, 52, 53 | 80 (incl. Introduction as 0), 61, 76, 71, 69 | `yas1`-`yas5` | `2026-11-01-yas` ($15) |
| Wish Upon the Stars 1-8 (Malcolm Tent) | Calibre 54, 59-65; untitled chapters carry the number word as title | 42, 70, 54, 74, 75, 73, 74, 65 | `wus1`-`wus8` | `2026-11-01-wus` ($33) |
| Godclads 1-2 (OstensibleMammal) | Calibre 76, 77 | 62 (incl. Prologue as 0), 89 | `gc1`, `gc2` | `2026-11-01-gc` ($10) |
| The Perfect Run (Royal Road capture, listing 36735) | `perfect-run/source-preparation-2026-10-11/prepared/main-*.json` in manifest order | 130 | `pr` | `2026-11-01-pr` ($10) |
| The Perfect Run: Bad Runs (3 what-if chapters, not main continuity) | same capture, `bad-runs-*.json` | 3 | `prb` (book 2 of world `pr`) | same file |
| Super Supportive (Royal Road capture, 2026-10-25) | `super-supportive/source-2026-10-25/super-supportive-merged.json`, renumbered 1-314 | 314 | `sup` | `2026-11-01-sup` ($32) |
| Reverend Insanity (Gu Zhen Ren), English | Calibre 15, EPUB (`chapter_N.xhtml`, headings `Chapter N - Title`, about 4.86M words); the 24 "volumes" are the copy's own 100-chapter blocks (volume 24 has 34), not the author's volumes. Converted per volume by `normalize_epub_chapters.py ri` into private `ri1.epub`-`ri24.epub` under `reverend-insanity/private/source/` | 2,334 (volume 1 = 1-100 ... volume 24 = 2301-2334; site numbering kept) | `ri1`-`ri24` | `2026-10-29-ri1-pilot-ri` ($3.40, volume 1 alone); `2026-11-01-ri` ($88.10, volumes 2-24) |
| A Regressor's Tale of Cultivation (Tremendous) | Calibre 17, EPUB (`chapterN.html`, no headings in the text; titles from `toc.ncx`, about 2.17M words). Calibre 43 is a byte-identical duplicate (same md5), not registered. Converted by `normalize_epub_chapters.py rtoc` (ad, Discord and translator lines dropped) | 640: Prologue as 0, then 1-639 renumbered in reading order (the site's own number is kept in the title as `[site ch N]` where it differs; 4 "Author's Q&A" files skipped) | `rtoc` | `2026-11-01-rtoc` ($40.60) |

## The five TTKS books

"TTKS" is the site ttks.tw (a Taiwanese mirror), not one novel. Weibao's TTKS shelf is five books, captured on 2026-10-10 into `docs/research/novels/ttks-novels-2026-10-10/B1`-`B5` (gitignored). Always name them by title; the B-codes and keys are only handles. English titles below are glosses, not official.

| Code | Title (as printed) | English gloss | Author | Platform | Chapters | Keys |
|---|---|---|---|---|---|---|
| B1 | 巫师你好，我是伪人 | Wizard, Hello, I'm an Imposter | 软糖鸢尾蓝 | Qidian | 111 | `ttks1` |
| B2 | 一年抽取一词条，模拟的也可以？ | One Entry a Year, and a Simulated One Counts? | 六大六子 | Fanqie | 665 (1-10 official free text, simplified) | `ttks2` |
| B3 | 咒回：特级的我去死灭打宿傩了！ | Jujutsu Kaisen: Special-Grade Me Goes to Fight Sukuna | 皮卡堂布拉特 | Fanqie | 429 (1-10 official free text) | `ttks3` |
| B4 | 全人类的继承者 | Heir of All Humanity | 万里万雪 | Qidian | 206 | `ttks4` |
| B5 | 废土边境检查官 | Wasteland Border Inspector | 斤斤斤 | Qidian | 668 | `ttks5` |

Two further ttks captures, registered nowhere yet: 我有一个修仙模拟器 (author 不是星期天, 285 chapters, `woyouyigexiuxianmoniqi/`; not the same as 我有个修仙模拟器 by another author) and 凡人：从极阴岛开始的修仙模拟器 (44 chapters, `fanrencongjiyindao-moniqi/`). Do not confuse the simulator-cultivation books with each other.

## Wave 1 acquired 2026-10-29 (Source Library, Z-Library `provider_api`; not batch-registered, not read)

Eleven English EPUBs from the 10-26 discovery shortlist (C4, C7, C9-C11, C13), one edition each. Checks: SHA-256 matched the job record, zip CRC clean, TOC readable. Not run: EPUB preparation, reading, `books.json` registration. Files sit in the Source Library; the Calibre library is untouched.

| Work | Held | Notes |
|---|---|---|
| Elydes (Drew Wells) | Books 1-3 | A New Dawn, Tides of Change, Whispers of the Isles |
| Street Cultivation (Sarah Lin) | Books 1-3 | Trilogy complete |
| The Books of the Raksura (Martha Wells) | One omnibus, 85 TOC entries | Contains The Cloud Roads, The Serpent Sea and The Siren Depths (the Cloud Roads edition is the omnibus, not a single novel) |
| The Steerswoman (Rosemary Kirstein) | Books 1-2 | The Steerswoman, The Outskirter's Secret; books 3-4 not fetched |
| Vita Nostra (Dyachenko) | One novel | Harper Voyager edition; translator not exposed by provider metadata |
| Dragon's Egg (Robert L. Forward) | One novel | Del Rey edition |

## RR priority wave acquired 2026-10-29 (same route and checks; not batch-registered, not read)

Weibao picked these three over the other RR options. 19 files; the daily quota ran out on the 20th request (Tree of Aeons 7).

| Work | Held | Still to fetch |
|---|---|---|
| Mark of the Fool (J.M. Clarke) | Books 1-7 | Book 8 |
| Tree of Aeons (Spaizzzer) | Books 1-6 | Books 7-8 |
| The Legend of Randidly Ghosthound (puddles4263 / Noret Flood) | Books 1-6 | Books 7, 9-13; Book 8 not found on Z-Library |

## Not on disk, or unverified (the one pending list)

Source Library search of 2026-10-28 (metadata only, local and Z-Library providers, nothing downloaded). Z-Library results are premium-tier and `owned: false`; a download needs Weibao's go and the usual pacing.

| Item | Search result | Next step |
|---|---|---|
| Circle of Inevitability in Chinese (宿命之环, 爱潜水的乌贼) | **Exists on Z-Library**: about ten Chinese epub editions, e.g. `zlibrary:121534267:ee13ae` 宿命之环(校对版全本)(诡秘世界第二部), `zlibrary:115227440:e31db3` 完结版 无番外, `zlibrary:119795152:c9b7d7` 精排版 | Download one full edition on request (prefer 校对版全本) and register it as a `zh` book; the English `coi` stays as the cross-check |
| Circle of Inevitability, other English editions | Z-Library has the eight-volume set by "Cuttlefish That Loves Diving" (vol 1 chapters 1-109, vol 2 110-263, vol 3 264-494, vol 4 495-735, vol 5-8) and a "full" file. Our copy (Calibre 34) is the Light Novel World scrape, 1,178 chapters | Compare chapter counts before spending anything; the set may be the same translation |
| Shadow Slave chapters 3001+ | No volume 12 on Z-Library (a "Volume 12" query returns volumes 1-8, a 1-9 omnibus and "1-1925" files); our volumes 9-11 are the newest | Wait for a release; recheck monthly |
| A Soldier's Life book 7 and later | Z-Library lists books 2-6 only. Book 7 (The Otherworlders) exists as a Patreon draft | Recheck when a Kindle release appears |
| Shadow Slave Vol 9 ("Throne of War"), Circle of Inevitability | The Calibre copies are byte-identical to the originals in `~/Downloads/Books_Reading` (same hashes), whose Z-Library names credit Guiltythree and Cuttlefish That Loves Diving; the text is a web scrape, so the edition and translation stay unverified | None unless a quality problem shows |
| ttks captures woyouyigexiuxianmoniqi and fanrencongjiyindao | On disk, not registered for batch reading | Register on request |
| Books captured 2026-10-10 are snapshots of ongoing serials | B2-B5 may have grown since | Recapture only on request, under the polite-scraper rules |

Reading state (what has been read, spent or merged) lives in the run files and `BATCH_READING_WORKFLOW.md`, not here.

## Other things on disk, not batch-registered

Er Gen's settings (`er-gen-haul-2026-10-09`: A Will Eternal, Beyond the Timescape and others, Calibre 71-73), Reincarnation Paradise (13), I Am the Fated Villain (14), Omniscient Reader's Viewpoint (18), Labyrinth of the Mad God (19, 20), Solo Leveling (46), Second Life Ranker (85) and about 200 more: see the catalogue.

## Keeping this current

A new book arrives: add its row here (and in `books.json` if it will be batch-read) in the same change. A search that finds nothing is recorded in `BATCH_READING_WORKFLOW.md` "Known gaps".

## Related documents (what each owns)

| Document | Owns |
|---|---|
| [SOURCE_ACQUISITION_TOOLS](SOURCE_ACQUISITION_TOOLS.md), [TOOL_REGISTRY](../TOOL_REGISTRY.md) | How to acquire: Source Library CLI, polite scraper, Calibre routes |
| [BOOK_CANDIDATES_2026-10-22](BOOK_CANDIDATES_2026-10-22.md), [BOOK_DISCOVERY_2026-10-26](BOOK_DISCOVERY_2026-10-26.md), [FUTURE_ACQUISITION_QUEUE](FUTURE_ACQUISITION_QUEUE_2026-10-13.md) | What we might acquire next (proposals, history) |
| [BOOK_ACQUISITION_RECEIPT_2026-10-24](BOOK_ACQUISITION_RECEIPT_2026-10-24.md), [SOURCE_ACQUISITION_RECEIPT_2026-10-26](SOURCE_ACQUISITION_RECEIPT_2026-10-26.md) | What was downloaded, dated, with checks (history; this index is the live answer) |
| `novels/LOCAL_LIBRARY.md` and `.json` (private) | The 2026-10-03 Calibre import evidence; not updated since |
| `novels/ttks-novels-2026-10-10/` (private) | The five TTKS captures and their per-book notes |


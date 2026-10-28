# Library index: where each prime book is (start here)

2026-10-28. **The main source of truth for "do we have this book, and what is missing?"** Other documents link here and must not keep their own holdings or missing-source lists. Check here before searching, asking Weibao or acquiring anything. Two book stores exist, each with a generated list: [Calibre](CALIBRE_CATALOGUE.md) (232 books) and the Source Library at `~/.local/share/source-platform` ([SOURCE_LIBRARY_CATALOGUE](SOURCE_LIBRARY_CATALOGUE.md), about 1,890 assets, mostly tabletop rulebooks). Loose files also sit in `~/Downloads` and `~/Downloads/Books_Reading` (80 books). Regenerate both lists with `python3 -I scripts/library_catalogue.py`. Older import evidence: [LOCAL_LIBRARY](novels/LOCAL_LIBRARY.md) (private, gitignored). Reading procedure and keys: [BATCH_READING_WORKFLOW](BATCH_READING_WORKFLOW.md). Machine-readable registry: [`books.json`](../gm/dispatch/batch-reading-2026-10-27/plans/books.json).

Source text stays outside tracked files. Never modify the library; convert into a gitignored private copy.

## Prime books

| Book | Language | Source | Chapters on disk | Batch keys |
|---|---|---|---|---|
| Lord of the Mysteries 诡秘之主 (Ai Qian Shui De Wu Zei) | zh | Calibre 1, EPUB with `nav.xhtml`, 8 volumes (chapters restart per volume) | volumes 1-8 | `lotm2`-`lotm8` (volume 1 read by the older wave plans) |
| Circle of Inevitability, "Lord of Mysteries 2" (the sequel by 爱潜水的乌贼 / Cuttlefish That Loves Diving, lead Lumian Lee) | en | Calibre 34, English web-scrape EPUB (file names credit the author; embedded metadata does not). Chinese text not yet downloaded, see pending | 1-1179 (1026 skipped by the edition; afterword cut) | `coi` |
| Shadow Slave (Guiltythree) | en | Calibre 16 (chapters 1-1840, NCX), 35 "Vol 9 - Throne of War" (1841-2260), 36 Vol 10 (2261-2720, NCX), 37 Vol 11 (2721-3000, no NCX, read as `html`) | 1-3000 | `ss`, `ss9`, `ss10`, `ss11`. Not on disk: 3001+ |
| Mother of Learning (nobody103) | en | Calibre 21, EPUB | 1-106 plus epilogue | `mol` |
| Harry Potter 1-7 (Rowling) | en | One omnibus PDF in `~/Downloads` (also Calibre author folders `J. K. Rowling`) | books 1-7 | `hp1`-`hp7` |
| A Soldier's Life (Always RollsAOne / Erick Thiemke) | en | Calibre 55, 56, 57, 58, 112; book 4 only as a `.mobi` in `~/Downloads` (converted copy in the private folder) | 1-384 (books 1-6) | `asl1`-`asl6`. Books 7+ not on disk |

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

Er Gen's settings (`er-gen-haul-2026-10-09`: A Will Eternal, Beyond the Timescape and others, Calibre 71-73), Reincarnation Paradise (13), I Am the Fated Villain (14), Reverend Insanity (15), A Regressor's Tale of Cultivation (17), Omniscient Reader's Viewpoint (18), Labyrinth of the Mad God (19, 20), Solo Leveling (46), Second Life Ranker (85) and about 200 more: see the catalogue.

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


# Library index: where each prime book is (start here)

2026-10-28. One page for "do we have this book?". Check here before searching, asking Weibao or acquiring anything. Two book stores exist, each with a generated list: [Calibre](CALIBRE_CATALOGUE.md) (232 books) and the Source Library at `~/.local/share/source-platform` ([SOURCE_LIBRARY_CATALOGUE](SOURCE_LIBRARY_CATALOGUE.md), about 1,890 assets, mostly tabletop rulebooks). Loose files also sit in `~/Downloads` and `~/Downloads/Books_Reading` (80 books). Regenerate both lists with `python3 -I scripts/library_catalogue.py`. Older import evidence: [LOCAL_LIBRARY](novels/LOCAL_LIBRARY.md) (private, gitignored). Reading procedure and keys: [BATCH_READING_WORKFLOW](BATCH_READING_WORKFLOW.md). Machine-readable registry: [`books.json`](../gm/dispatch/batch-reading-2026-10-27/plans/books.json).

Source text stays outside tracked files. Never modify the library; convert into a gitignored private copy.

## Prime books

| Book | Language | Source | Chapters on disk | Batch keys |
|---|---|---|---|---|
| Lord of the Mysteries 诡秘之主 (Ai Qian Shui De Wu Zei) | zh | Calibre 1, EPUB with `nav.xhtml`, 8 volumes (chapters restart per volume) | volumes 1-8 | `lotm2`-`lotm8` (volume 1 read by the older wave plans) |
| Circle of Inevitability, "Lord of Mysteries 2" (the sequel, lead Lumian Lee) | en | Calibre 34, English web-scrape EPUB, author unknown | 1-1179 (1026 skipped by the edition; afterword cut) | `coi` |
| Shadow Slave (Guiltythree) | en | Calibre 16 (1-1840 and 2261-2720 per the registry, NCX), 35 "Vol 9" (1841-2260), 36 Vol 10, 37 Vol 11 (2721-3000) | 1-3000 | `ss`, `ss9`, `ss10`, `ss11`. Not on disk: 3001+ |
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


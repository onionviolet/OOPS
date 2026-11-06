# Library index: where each prime book is (start here)

Current routing, reconciled2026-11-05; the dated sections preserve their original receipt scope. **The main source of truth for recorded holdings and source coverage.** Other documents link here and must not keep their own holdings or missing-source lists. Check here before searching, asking Weibao or acquiring anything. Two book stores exist, each with a generated list: [Calibre](CALIBRE_CATALOGUE.md) and the Source Library at `~/.local/share/source-platform` ([SOURCE_LIBRARY_CATALOGUE](SOURCE_LIBRARY_CATALOGUE.md)). Their generated counts are snapshots; use read-only current metadata and the exact source receipts when selecting work. Loose files also sit in `~/Downloads` and `~/Downloads/Books_Reading` (80 books). Regenerate both lists with `python3 -I scripts/library_catalogue.py`. Older import evidence: [LOCAL_LIBRARY](novels/LOCAL_LIBRARY.md) (private, gitignored). Reading procedure and keys: [BATCH_READING_WORKFLOW](BATCH_READING_WORKFLOW.md). Machine-readable registry: [`books.json`](../gm/dispatch/batch-reading-2026-10-27/plans/books.json).

Source text stays outside tracked files. Never modify the library; convert into a gitignored private copy.

## Prime books

**The Wandering Inn current holdings:** main-series coverage through book 19 plus the four newer split editions of books 1-2. Books 18-19 are web-text compilations with validated chapter-range coverage and separate repaired reader copies, not verified retail editions. See [the full-series receipt](#wandering-inn-published-run-acquisition-2026-10-31); this supersedes earlier partial-holdings snapshots.

| Book | Language | Source | Chapters on disk | Batch keys |
|---|---|---|---|---|
| Lord of the Mysteries 诡秘之主 (Ai Qian Shui De Wu Zei) | zh | Calibre 1, EPUB with `nav.xhtml`, 8 volumes (chapters restart per volume) | volumes 1-8 | `lotm2`-`lotm8` (volume 1 read by the older wave plans) |
| Lord of the Mysteries, English (Webnovel official translation) | en | Loose in `~/Downloads` (2026-10-30, Weibao): `Lord.of.the.Mysteries.-.Webnovel.Default.epub` (official) and `...OldTL.Default.epub` (the same text with 114 chapters swapped or edited; only chapter 1 and the side story "A Day in The Year 1346" differ substantially, median similarity 1.0). Publisher tag "LOTM-Reader", 328 webp illustrations, a pathways guide and an image gallery. Calibre import is not established here; later KJ2_SOURCE_PREPARATION records a bounded prepared English extraction, so the old no-private-copy status is superseded for that scope | 1-1394 in 8 volumes, same per-volume counts as the Chinese; side stories as chapters 1395-1430, plus 2 side stories and 2 bonus chapters. Fills the 3 chapters missing from the Chinese shards (volume 3 ch 231, volume 4 ch 62, volume 8 ch 7) | overlay for `lotm*` (LSD469-LSD470), no reading key |
| Circle of Inevitability, "Lord of Mysteries 2" (the sequel by 爱潜水的乌贼 / Cuttlefish That Loves Diving, lead Lumian Lee) | en | Calibre 34, English web-scrape EPUB (file names credit the author; embedded metadata does not). Chinese 宿命之环 is now confirmed registered with an existing location by exact receipt prefix `f76f8c412e2f` (B626); edition completeness was not reread. The early pending search is historical. A complete edition is loose in `~/Downloads` (2026-10-30): `Circle.of.Inevitability.-.Webnovel.Default.epub`, 1-1179 with no gaps, 5 volumes, a side story and the afterword; the `...Webnovel.Legacy.epub` beside it has text identical to Default in all 1,192 files | 1-1179 (Calibre 34 skips 1026 and cuts the afterword; the Downloads edition has both) | `coi` |
| Shadow Slave (Guiltythree) | en | Calibre 16 (chapters 1-1840, NCX), 35 "Vol 9 - Throne of War" (1841-2260), 36 Vol 10 (2261-2720, NCX), 37 Vol 11 (2721-3000, no NCX, read as `html`) | 1-3000 | `ss`, `ss9`, `ss10`, `ss11`. Not on disk: 3001+ |
| Mother of Learning (nobody103) | en | Calibre 21, EPUB | 1-106 plus epilogue | `mol` |
| Harry Potter 1-7 (Rowling) | en | One omnibus PDF in `~/Downloads` (also Calibre author folders `J. K. Rowling`) | books 1-7 | `hp1`-`hp7` |
| A Soldier's Life (Always RollsAOne / Erick Thiemke) | en | Calibre 55, 56, 57, 58, 112; the original book4 MOBI/reader binding is historical; the current selected Source Library check also finds managed EPUBs1–6 including4 | 1-384 (books 1-6) | `asl1`-`asl6`. The selected current registered matches cover1–6; this is not a current publication or whole-machine absence check for7+ | <!-- slip-ok: Named author attribution and bounded metadata/location observation, not a gameplay absolute. -->

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
| Mark of the Fool (J.M. Clarke) | Books 1-8 (8 via Anna's Archive, 2026-10-30) | None known |
| Tree of Aeons (Spaizzzer) | Books1–8 recorded by the later October31 continuation receipt | Earlier book8 gap closed; later publications not assessed here | <!-- slip-ok: Factual holdings, staging or title metadata at this snapshot; not a world design restriction. -->
| The Legend of Randidly Ghosthound (puddles4263 / Noret Flood) | Books1–15 recorded by the later October31 continuation receipt | Earlier book13 gap closed; later publications not assessed here | <!-- slip-ok: Factual holdings, staging or title metadata at this snapshot; not a world design restriction. -->

Continuations via Anna's Archive (2026-10-30, same route, MD5 taken from the queued Z-Library edition's metadata so each file is that exact edition): Millennial Mage 3-8 (now 1-8), Dungeon Life 3 (now 1-3). Same day through Anna's member API (key in the macOS Keychain item `annas-archive`, 50 fast downloads a day; `scripts/annas_route.py member`): Dungeon Life 4 (now 1-4), Chrysalis 2-5 and 7 (now 1-5, 7), Beneath the Dragoneye Moons 2, 4-6, 8-9 (now 1-2, 4-6, 8-9), Azarinth Healer 2-6 (now 1-6), Threadbare Complete Trilogy (books 1-3), Cinnamon Bun 1.

Found later the same day by searching Anna's in Weibao's Chrome, then the member API: Chrysalis 6 (now 1-7), Dragoneye Moons 3 and 7 (now 1-9), Randidly Ghosthound 13 (another copy; now 1-13), Forge of Destiny 3 (now 1-3), Path of Ascension 12, Chaotic Craftsman Worships the Cube (chapters 1-604 compilation), The Daily Grind (a 7 MB Royal Road compilation), Super Minion, The Steerswoman 4 *The Language of Power*. Two downloads were the wrong book: both Anna's copies titled *The Lesser Kindred* are Elizabeth Kerner's novel, not Steerswoman 3; they sit in Source Library and are not Kirstein.

Historical route note superseded by later receipts: Tree8, Azarinth7, Threadbare4–6 and Path9 are recorded as held. Do not repeat those old pending requests.

Anna's Archive files (2026-10-30) came through Weibao's Chrome by the free slow-partner route, then `curl` and the scratch intake script: MD5 matched Anna's record, zip CRC clean, registered in the Source Library catalogue. Where the file is the same Z-Library edition, its Z-Library key is marked complete so it is not fetched twice.

## Tutorial and reset fiction, 2026-10-31

Anna's member API, matched to Z-Library edition MD5s, added *A Gamer's Guide to Beating the Tutorial* by Palt, books 2 (*Lust*, SHA-256 `ee7bfee95945`) and 3 (*Gluttony*, `0adff61adfdc`). Book 1 (`e60e896b7dd8`) was already held. All three are registered in Source Library. Books 2-3 passed MD5, SHA-256 and ZIP CRC checks; text is populated but was not prepared for batch reading or read in this run. The old harvest reuse index RH4 predates books 2-3; check the live Source Library as well.

Reading continuity check, 2026-10-31: book 3's EPUB TOC finishes at Floor 25. Palt's [Royal Road contents](https://www.royalroad.com/fiction/73205/a-gamers-guide-to-beat1ng-the-tut0rial) resumes at chapter 230, Floor 26, and lists through chapter 417 in the checked snapshot. Chapter 230 is therefore a plausible next place to start; edition revisions and exact continuity were not compared. The public TOC labels chapter 370 onward *Greed*; it did not list a *Wrath* chapter in this snapshot. Palt's [members-only Patreon post](https://www.patreon.com/AuthorPalt/posts/gamers-guide-4-5-134883260) separately names PDFs for steps 4 and 5. It does not establish the boundaries or availability of the full PDFs on Royal Road.

*The Tutorial Is Too Hard* by Gandara: one English anthology (`d9e940cd199c`, Anna's MD5 `7d8fadc31423be5aeee56aa5c5c3b621`) is registered. Its embedded metadata calls the author `---`; opening front matter credits Gandara and Light Novel Bastion. The TOC lists main chapters 1-380 and side stories 1-53, with no missing integers; chapter 230 and 233 have decimal subparts. This is TOC coverage, not a text or translation-quality audit. The EPUB passed MD5, SHA-256 and ZIP CRC checks; it was not prepared or read for this run.

*Death After Death* by DWinchester is not registered in the checked local holdings. The Z-Library metadata search did not identify a matching edition. On 2026-10-31 a background search in Weibao's existing signed-in Chrome tab on Anna's returned no exact result for title plus author; an author search listed only *Tenebroum*. These searches do not prove absence under other metadata. The author-posted Scribble Hub route closed on HTTP 403 in the shared polite transport; Royal Road was already closed there. No chapters acquired. Author reading page: <https://www.royalroad.com/fiction/58180/death-after-death-roguelike-isekai>. Do not reset the transport or reroute that refusal through a browser collector.

## Not on disk, or unverified (the one pending list)

Source Library search of 2026-10-28 (metadata only, local and Z-Library providers, nothing downloaded). Z-Library results are premium-tier and `owned: false`; a download needs Weibao's go and the usual pacing.

| Item | Search result | Next step |
|---|---|---|
| Circle of Inevitability in Chinese (宿命之环, 爱潜水的乌贼) | **Exists on Z-Library**: about ten Chinese epub editions, e.g. `zlibrary:121534267:ee13ae` 宿命之环(校对版全本)(诡秘世界第二部), `zlibrary:115227440:e31db3` 完结版 无番外, `zlibrary:119795152:c9b7d7` 精排版 | Superseded pending action: B626uniquely resolves receipt prefix `f76f8c412e2f` to registered 宿命之环 with an existing location. Do not reacquire from a zero literal-title match; completeness/translation comparison remains unverified here |
| Circle of Inevitability, other English editions | Z-Library has the eight-volume set by "Cuttlefish That Loves Diving" (vol 1 chapters 1-109, vol 2 110-263, vol 3 264-494, vol 4 495-735, vol 5-8) and a "full" file. Our copy (Calibre 34) is the Light Novel World scrape, 1,178 chapters | Use the prime EnglishCOI row and later compilation coverage first; the older Calibre1026/title gap is not a new volume-acquisition request, and edition/text equivalence remains separate |
| Shadow Slave chapters 3001+ | No volume 12 on Z-Library (a "Volume 12" query returns volumes 1-8, a 1-9 omnibus and "1-1925" files); our volumes 9-11 are the newest | Wait for a release; recheck monthly |
| A Soldier's Life book 7 and later | Z-Library lists books 2-6 only. Book 7 (The Otherworlders) exists as a Patreon draft | Recheck when a Kindle release appears |
| Shadow Slave Vol 9 ("Throne of War"), Circle of Inevitability | The Calibre copies are byte-identical to the originals in `~/Downloads/Books_Reading` (same hashes), whose Z-Library names credit Guiltythree and Cuttlefish That Loves Diving; the text is a web scrape, so the edition and translation stay unverified | None unless a quality problem shows |
| ttks captures woyouyigexiuxianmoniqi and fanrencongjiyindao | On disk, not registered for batch reading | Register on request |
| Books captured 2026-10-10 are snapshots of ongoing serials | B2-B5 may have grown since | Recapture only on request, under the polite-scraper rules |

Reading state (what has been read, spent or merged) lives in the run files and `BATCH_READING_WORKFLOW.md`, not here.

## Other things on disk, not batch-registered

Er Gen's settings (`er-gen-haul-2026-10-09`: A Will Eternal, Beyond the Timescape and others, Calibre 71-73), Reincarnation Paradise (13), I Am the Fated Villain (14), Omniscient Reader's Viewpoint (18), Labyrinth of the Mad God (19, 20), Solo Leveling (46), Second Life Ranker (85) and about 200 more: see the catalogue.

## Translator-site captures, 2026-10-30

Fan translations captured through the polite transport (`lncrawl.polite.transport.Client`, no browser), text private and out of git. Registered files are in Source Library (`library/<sha>/source.epub`); staged files are in `~/.local/share/source-platform/staging/translator/`. The LN and WN of Re:Zero arc 4 (and the arc 3 interludes) were already held, as were Fate/Zero 1-4 and Re:Zero LN 1-10 (Calibre 150, 160, 161).

| File | Chapters | Source | Label | State |
|---|---|---|---|---|
| Re:Zero Web Novel Arc 5 - Stars What Make History | 84 (index: 84) | witchculttranslation.com/table-of-content/ | WN | registered `b1bfb8f6ccef` |
| Re:Zero Web Novel Arc 8 - Vincent Vollachia | 76 (76) | same | WN | registered `85d8c6be215f` |
| Re:Zero Web Novel Arc 9 - Light of a Nameless Star | 62 (62) | same | WN | registered `f2dc129a2220` |
| Re:Zero Web Novel Arc 10 - The Land of the Lion Kings (ongoing) | 27 (27, through Chapter 26) | same | WN | registered `91bbcc411cc1` |
| Re:Zero Web Novel Arc 6 - Hall of Memories | 91 (complete) | Witch Cult, plus translationchicken.com (3) and eminenttranslations.com (2, saved from Weibao's Chrome 2026-10-30 at his request) | WN | registered `bfc232bd8c65`; replaces `0048ebcb3e3e` (89 chapters) and the partial `dfac593c9e59` |
| Re:Zero Web Novel Arc 7 - The Land of Wolves | 116 (ch 63 Sparka added 2026-11-03, BC2) | same | WN | registered `6559e2bf05ab`; replaces `0b9b3695d836` (115 chapters) |
| Re:Zero Web Novel Arc 1 - A Tumultuous First Day | 24 (24) | same | WN | staged only (LN 1 held) | <!-- slip-ok: Factual holdings, staging or title metadata at this snapshot; not a world design restriction. -->
| Fate/Zero Volumes 2, 3, 4 and Another Story (Heart of Freaks) | 20, 19, 33, 1 | baka-tsuki.org/project/index.php?title=Fate/Zero | LN fan translation | staged only; alternate translation, not registered. Chapter = act part from the Full Text pages; Vol 4 adds the Translator's Notes page | <!-- slip-ok: Factual holdings, staging or title metadata at this snapshot; not a world design restriction. -->

Done except as listed (the Arc 6 chapters 89–90 and Arc 7 chapter 63 gaps named below were closed on 2026-11-03, see BC2 and BC5). Weibao approved four reopenings of the Witch Cult closure (all logged in the transport `requests.jsonl`). The table of contents carries wrong post dates, so the last two runs took live URLs from the site's `post-sitemap.xml` by slug. The fourth closure was my own local `UnicodeEncodeError` on a non-ASCII URL; the final run percent-encoded every path, dry-validated all URLs, and finished with no further closure. Missing: Arc 6 chapters 89 and 90 (Eminent Translations; its robots.txt disallows GPTBot) and Arc 7 chapter 63 "Sparka" (no sitemap slug, so not requested); each EPUB's front matter lists them. Arc 6 and 7 chapter counts: 89 of 91 and 115 of 116 index entries. The earlier partial Arc 6 (`dfac593c9e59`, 61 chapters) stays registered but is replaced by `0048ebcb3e3e`. Arc 2 is hosted on eminenttranslations.com and most of Arc 3 on kagurojp.wordpress.com, not Witch Cult. No Game No Life: the Baka-Tsuki page is marked abandoned and taken down, with no chapter links left; NGNL 1-3 stay on Anna's.

## Keeping this current

A new book arrives: add its row here (and in `books.json` if it will be batch-read) in the same change. A search that finds nothing is recorded in `BATCH_READING_WORKFLOW.md` "Known gaps".

## Related documents (what each owns)

| Document | Owns |
|---|---|
| [SOURCE_ACQUISITION_TOOLS](SOURCE_ACQUISITION_TOOLS.md), [TOOL_REGISTRY](../TOOL_REGISTRY.md) | How to acquire: Source Library CLI, polite scraper, Calibre routes |
| [DOWNLOAD_WISHLIST_2026-10-30](DOWNLOAD_WISHLIST_2026-10-30.md) (current ranked to-download list), [BOOK_CANDIDATES_2026-10-22](BOOK_CANDIDATES_2026-10-22.md), [BOOK_DISCOVERY_2026-10-26](BOOK_DISCOVERY_2026-10-26.md), [FUTURE_ACQUISITION_QUEUE](FUTURE_ACQUISITION_QUEUE_2026-10-13.md) | What we might acquire next (proposals, history) |
| [BOOK_ACQUISITION_RECEIPT_2026-10-24](BOOK_ACQUISITION_RECEIPT_2026-10-24.md), [SOURCE_ACQUISITION_RECEIPT_2026-10-26](SOURCE_ACQUISITION_RECEIPT_2026-10-26.md) | What was downloaded, dated, with checks (history; this index is the live answer) |
| `novels/LOCAL_LIBRARY.md` and `.json` (private) | The 2026-10-03 Calibre import evidence; not updated since |
| `novels/ttks-novels-2026-10-10/` (private) | The five TTKS captures and their per-book notes |


## RR continuation round, 2026-10-31

Weibao directed RR books, continuations and all published volumes before rulebooks or
more openers. Anna's member route acquired 28 EPUBs: He Who Fights with Monsters 2-12,
Dungeon Crawler Carl 2-7, The Menocht Loop 2-6, and Cinnamon Bun 2-7. With the already-held
first volumes, holdings now cover 1-12, 1-7, 1-6 and 1-7 respectively. Each new file
passed exact edition MD5, SHA-256 and EPUB ZIP CRC checks and was registered in Source
Library, with its matching Z-Library edition key linked. Not prepared or read in this run;
archive integrity does not establish editorial completeness or translation quality.

He Who Fights with Monsters 13 (`zlibrary:129279895:58a5ab`) and Dungeon Crawler Carl 8
(`zlibrary:126735302:4bc91a`) returned `annas_api_Record_not_found`. Keep these two as
continuation gaps for the next available route, without same-day Anna's retry. The
[author's HWFWM page](https://hewhofightswithmonsters.com/) gives October 6, 2026 for book
13; [Dinniman's books page](https://mattdinniman.com/books/) lists book 8. Other series'
latest publication boundaries were not exhaustively audited. Menocht 6 and Cinnamon 7
are the highest volumes found in this round's catalogue searches.

Before the priority correction, Eberron: Rising from the Last War was acquired and
verified (`9aa844f587e5`); Strixhaven was interrupted during transfer and is not held.
Ravnica and Theros were not requested from Anna's. Last API response reported 10 left
before the final successful request, so approximately 9 remained afterward; no separate
balance check was issued. Private edition receipts and the bounded runners are in
`novels/annas-2026-10-31-next/`. No subscription purchase, reading batch or gameplay
change was made.

## Worldview acquisition round, 2026-10-31

Weibao authorized further RR/LN/world-rich acquisition using LOTM and Reverend Insanity
as comparison gates, including the free slow route. Ranking and evidence are in
[download wishlist W9](DOWNLOAD_WISHLIST_2026-10-30.md#w9-lotm--reverend-insanity-comparison-round-2026-10-31).
Recommendations concern acquisition usefulness, not verified literary parity or a
new gameplay implementation order. No full-source reading was performed.

| Source | Newly acquired | Current verified local coverage / limitation |
|---|---|---|
| A Practical Guide to Sorcery, Azalea Ellis | Main books 2-6 | Book 1 already held as A Conjuring of Ravens (`dbdd8c5e9257`); now main books 1-6. Bonus material not inventoried; book 7 is preorder on the checked author store |
| Virtuous Sons, Y.B. Striker | Book 2, The Tyrant Riot (`ed432b884633`) | Main books 1-2 held; no book 3 found in this catalogue search, not a serial completeness claim |
| Deep Sea Embers, Yuan Tong | English compilation (`54f0982cb93e`) | 851 leaf TOC entries, numbered 1-850 then 852. No separate 851 member. Publisher's [Embers of the Deep](https://www.webnovel.com/book/24233205105935405) ends with the corresponding ending labeled 851, so this may be numbering rather than absent story text. Exact edition alignment remains unresolved; do not label a confirmed missing chapter or text completeness |
| Embers Ad Infinitum, Cuttlefish That Loves Diving | English compilation (`478f0fe47f0a`) | TOC chapter numbers 1-953, no integer gaps; matches the [publisher's 953-entry listing](https://www.webnovel.com/book/18555275806275805). This is TOC coverage, not a full-text audit |
| Throne of Magical Arcana, Cuttlefish That Loves Diving | English c1-910 compilation (`ce30d3016be7`) | 910 leaf TOC entries, numbered 1-910 with no integer gaps; matches [publisher listing](https://www.webnovel.com/book/6838665602002005). Chapter text not read |

All nine new EPUBs passed exact selected-edition MD5, SHA-256 and ZIP CRC checks and
were registered in Source Library. Matching Z-Library keys were linked so later runs
can reuse them. Not prepared for reading, batch-registered or read in this run.
Private receipts, coverage checks, bounded runners and 18 Wandering Inn continuation
candidates (books 2-19, subtitle matching still required) are under
`novels/worldview-2026-10-31/`. These candidates are not acquired files.

The member API then explicitly returned `annas_api_No_downloads_left` for the selected
Forty Millenniums of Cultivation compilation and The Wandering Inn 2. Neither was
acquired; neither response establishes mirror absence. Stop further member calls until
reset. The free slow route for Wandering Inn 2 reached DDoS-Guard's manual browser
check in the existing signed-in Chrome tab. User was notified; the check was not
solved or bypassed. No slow transfer completed. Browser account UI describes usage
in a last-18-hours window; no reset time was independently established.

### Wandering Inn slow-route proof, 2026-10-31

The signed-in browser's automatic DDoS-Guard check completed without manual input on
a later member-session attempt. The slow partner supplied a direct file URL. The
Wandering Inn book 2, Fae and Fare, is now acquired (`c160409e975c`), exact MD5
`13388d14bee6db9ae56261b10e82990e`, SHA-256 and EPUB ZIP CRC verified, registered in
Source Library with `zlibrary:117224558:a49eb6` linked. Holdings now include books 1-2;
3 onward remain candidates, not acquired. No full-source read or reading preparation.
Receipt: `novels/worldview-2026-10-31/wandering2_slow_receipt.json`. The earlier slow
stop above is historical; route now has one verified transfer. Cause of the earlier
manual-check failure remains unresolved. Next priority is Wandering Inn continuations,
with LOTM and RI comparisons concerned with world depth and possibilities overall.

## Wandering Inn published-run acquisition, 2026-10-31

Weibao explicitly requested the rest of The Wandering Inn, everything published,
through slow downloads. **Acquired this run: main books 3-19 and the four newer split
editions of books 1-2**, 21 retained source EPUBs. With the previously held original
books 1-2, the library has main-series story coverage through 19. The author’s
[book catalogue](https://wanderinginn.com/books-2/) lists through 19;
[Podium's book 20 page](https://www.podiumentertainment.com/titles/108158/memorys-flame)
dates Memory's Flame November 3, 2026, after this run. The main web serial continues
beyond collected ebooks; it was not captured here. No audiobook or spinoff was acquired.

| Coverage | Actual state |
|---|---|
| Main books 3-17 | Registered source EPUBs passed exact selected-edition MD5, SHA-256 and ZIP CRC checks, XML package parsing, real spine-target checks and populated chapter-member checks. Book 8 uses alternate edition `zlibrary:117224526:1eed31`, as the initially selected edition had no slow partner copy |
| Book 15 replacement | The first source (`9c60bfd53f10f1e07b3213eae1be9b43`) has malformed OPF XML (unbound prefix), so it was not registered or counted. Original download retained unchanged. Replacement `zlibrary:126534653:7f0ea0`, SHA-256 `31fd8b5e70dd`, passed intake and structural checks |
| Main book 18 | Downloaded raw compilation `0b41836ca6aa`; 19 chapter files correspond to the author’s book-18 mapping, 7.29 B through 7.42 M with interludes. Raw manifest/TOC refer to hundreds of absent chapters from the larger original compilation. Separate reader derivative `8b35c961039d` removes stale references; every non-package/non-NCX ZIP member is byte-identical to the original |
| Main book 19 | Downloaded raw compilation `db6863339fd9`; 14 chapter files correspond to the author’s book-19 mapping, 7.43 G through 7.55 E with its interlude. Same stale manifest/TOC defect; separate reader derivative `bbd3d9d6d0c9` removes stale references with chapter payload unchanged |
| Current split editions | Book One Part One `37f2f568269d`; No Killing Goblins (Book One Part Two) `eeea0284b528`; Fae and Fare (Book Two Part One) `5f17e89a6de1`; Immortal Games (Book Two Part Two) `775023587ed7`. Kept as separate editions, not counted as four additional main-series story installments |

Books 18-19 cover the author’s [published-book chapter map](https://wanderinginn.com/table-of-contents/),
but the available files are web-text compilations. **Retail editorial equivalence,
retail bonus material and text-by-text completeness remain unverified.** Do not label
them retail copies or claim every published word was compared. The raw assets carry
quality notes and pointers to the reader derivatives. No prose was recreated or edited.
No book was full-read or prepared for a paid reading batch in this run.

Raw browser downloads remain in `~/Downloads/annas-arch-<md5-prefix>.epub` and are
registered in Source Library. Reader derivatives live under the private lane's
`reader-copies/`. Exact locators/hashes/source keys, original failures, derivation
proof and the 21-item structural check report are in
`novels/worldview-2026-10-31/wandering_slow_receipts.jsonl`,
`wandering_verified_queue.json`, `wandering_reader_repairs.json` and
`wandering_structure_checks.json`. Matching Z-Library jobs are linked for reuse.

Checks: `register_browser_downloads.py` registered 21 retained source EPUBs;
`repair_container.py` proved unchanged chapter payload for two derivatives;
`check_wandering_structure.py` passed for all 21 reader editions (raw sources except
the two explicitly repaired ones), with no missing spine targets and populated text.
The first book-15 parse failure and the first book-18/19 structural failures were
investigated before replacements/derivatives. Source hashes establish transfer identity,
not full-text accuracy. Catalogues regenerated; document whitespace check passed.

Browser behavior: the earlier manual DDoS-Guard check later cleared automatically in
the same paid browser session, without a manual challenge interaction or security
setting change. Why it first failed was not isolated. Stale session recognition and
a transient protection failure remain hypotheses. This run had queued slow downloads
and occasional browser observation timeouts during automatic page refresh, distinct
from manual verification failure. Temporary wait tabs were closed afterward. Fast
quota was not used. The no-wait partner for book 4 was materially slower; the remaining
transfers used the proven queued slow partner, one transfer at a time per server.

Useful companions, proposals only: [The Singer of Terandria](https://wanderinginn.com/book/huntsong-the-singer-of-terandria-book-2/)
for additional viewpoints and institutions, and [The Last Tide](https://www.cloudscapecomics.com/last-tide/)
for a fisher's life at the world's edge. Current published main-series collection takes
precedence; ebook/web versions and web continuation remain separate source scopes.

## Innverse companion acquisition, 2026-10-31

Later explicit authorization covered Singer of Terandria and The Last Tide through
slow downloads. Registered three unchanged source files in Source Library:

| Title | Acquired state |
|---|---|
| Gravesong | Yonder compilation EPUB, SHA-256 `00e09574cfff`; catalogue title explicitly qualifies edition |
| Huntsong | Yonder version EPUB, SHA-256 `8ecb4bf68563`; current retail equivalence unverified |
| The Last Tide: Book One | PDF, SHA-256 `71f074a0f856`; exact MD5 matched, qpdf passed, 172 measured pages; cover and interior render checked |

**Singer is not recorded as a complete current retail set.** The
[official collection](https://store.wanderinginn.com/collections/thesingerofterandriaseries)
lists Gravesong, Huntsong and Ghostsong. Current retail Huntsong/Ghostsong were not
found in checked title/ISBN searches. Ghostsong draft/preview records were excluded.
Yonder compilation overlap does not establish retail equivalence or bonus coverage.
The [official Last Tide page](https://store.wanderinginn.com/products/the-last-tide)
describes Book One as the complete story published so far; Kickstarter reward prose
and edition extras were not inventoried or acquired.

Both EPUBs passed exact MD5, SHA-256, ZIP CRC, package XML, spine-target and populated
text checks. No full-source reading or chapter-by-chapter retail comparison occurred.
PDF catalogue metadata says 171 pages; the actual file has 172. A separate alternate
PDF transfer timed out and its partial file remains unregistered; the original browser
transfer finished successfully. Raw retained downloads remain under `~/Downloads/`.
Private receipts: `novels/innverse-companions-2026-10-31/epub_receipts.json`,
`pdf_receipt.json` and `acquisition_status.json`.

A separate user-requested research chat `01a19404-22af-7c10-9d13-894a5f8fb41b`
considers next acquisitions, with its report owned at `DOWNLOAD_SCOUT_NEXT_2026-10-31.md`.
Weibao subsequently authorized that chat to acquire continuations and its three new RR picks; purchases remain outside scope. See the receipt below.


## RR continuation and new-source intake, 2026-10-31

Weibao authorized continuations and the scout's three new RR picks, complete available
runs where possible. This section supersedes earlier partial-holdings and pending-gap
snapshots for these titles. The original Innverse acquisition chat finished before
this writer updated the shared index and regenerated the catalogues.

| Source | New files this run | Resulting bounded coverage |
|---|---|---|
| Bog Standard Isekai | 2–5 | 1–5 held, through Warbound. Published run identified in the scout; ongoing serial/revisions remain distinct |
| Mage Errant | 2–7 plus The Gorgon Incident and Other Stories | Main books 1–7 plus anthology held. Catalogue calls anthology “8”; it is not a new main-story installment |
| Peculiar Soul | One RR compilation | 132 numbered chapters, 1–132 without integer gaps in NCX; 134 spine entries including front matter. Matches the author's listed completed-serial chapter count, not a text-by-text comparison with RR |
| Mark of the Fool | 10 | Books 1–10 held. [Author final ebook launch](https://www.patreon.com/jmclarke/posts/mark-of-fool-10-135310195) is July 30, 2025; the older wishlist “not released” note is stale |
| Reborn as a Demonic Tree | 4–9 | Books 1–9 held; this closes the catalogue-discovered continuation run, not the later web serial |
| The Legend of Randidly Ghosthound | 15 | Held through 15 |
| Tree of Aeons | 8 | Held through 8 |
| Azarinth Healer | 7 | Published editions held through 7; original serial and revised retail coverage are distinct |
| Threadbare | 4–6 | Held 1–6, with earlier 1–3 in the complete-trilogy asset |
| Millennial Mage | 11 Flockbound, 13 Homebound | Held 1–13. Fused/book 6 was already registered under a title without the series name. [Author confirms Flockbound is book 11 and available](https://www.jlmullins.com/flockbound); a number-only catalogue search missed it |
| He Who Fights with Monsters | 13 | Held through 13 |
| Dungeon Crawler Carl | 8 A Parade of Horribles | Held through 8 |
| Labyrinth of the Mad God | 3 | Held 1–3 |

**30 new unchanged EPUBs, all verified and registered in Source Library.** The table
states exact held boundaries, not a claim of the latest serial coverage for every
ongoing work. Bog Standard 2 used the slow browser route; 29 others used the
independent authenticated Z-Library desktop route after Chrome blocked the slow
partner host. No attempt bypassed that browser block. The other chat's Singer and
Last Tide transfers were not duplicated.

All 30 match selected MD5s, have recorded SHA-256 hashes, pass ZIP CRC and package
XML parsing, and have real spine/navigation targets and populated text. Peculiar
Soul has all 132 numbered NCX chapters, matching the author's completed-serial count;
text-by-text completeness remains unverified. No full-source reading or paid reading
batch was performed. Shared download jobs link exact source keys for future reuse.

**Still unacquired:** Memories of the Fall and Immovable Mage. No matching
compilations were found in checked Z-Library/Anna's searches. Rith's author EPUB
post advertises volumes 1–3 / chapters 0–145 but requires membership access. The
existing RR polite capture route remains closed after HTTP 403; it was not replaced
by a browser chapter collector. These are route/access gaps, not proof of source absence.

The old wishlist's “not released” statements about Mark of the Fool 10 and
Millennial Mage 11 are superseded: both were released and are now held; the latter
is Flockbound and was found by subtitle. Fused/book 6 and Path of Ascension 9 were
already held, so no duplicate requests were made for them.

Evidence and source/version caveats: [scout and acquisition report](DOWNLOAD_SCOUT_NEXT_2026-10-31.md#authorized-follow-up-30-epubs-acquired-2026-10-31).
Exact paths, hashes, keys and checks: `novels/rr-next-2026-10-31/verified_intake.json`;
provider receipts under `novels/zlibrary/rr-next-2026-10-31/sources/.acquisitions/`.
Raw assets remain in that private source folder, with Bog Standard 2 in Downloads.


### Next ranked RR shelf attempt, 2026-10-31

The later S1–S8 acquisition request produced **no new assets**: no matching ebook
was identified in the checked Z-Library/Anna's catalogues, and no accessible
author EPUB export was established. The same-title Farmer Mage result credits
Timothy Ellis, not S.C. King, and was excluded. Public serials remain available to
browse, but the project's existing RR capture route is durably closed after 403.
The [attempt record and proposed route](DOWNLOAD_SCOUT_NEXT_2026-10-31.md#s1s8-acquisition-attempt-2026-10-31)
preserve exact scope, TOC counts, checks and the policy decision needed before
signed-in chapter capture. Previous 30-file intake remains unchanged.


## Ranked RR signed-in captures, 2026-10-31

Weibao explicitly authorized the paced signed-in capture, starting with Department
of Otherworld Rescue and then S2–S8 in ranked order. **Eight new EPUB snapshots,
1,360 public TOC entries, all captured, checked and registered in Source Library.**
This supersedes the earlier unheld/zero-transfer states for these eight works.

| Code | Source | Public TOC entries captured | EPUB SHA-256 prefix |
|---|---|---:|---|
| S1 | [Department of Otherworld Rescue](https://www.royalroad.com/fiction/126289/department-of-otherworld-rescue-litrpg-isekai) | 198 | `e38776366cf9` |
| S2 | [Hocus, Pocus, Hypothesis](https://www.royalroad.com/fiction/118886/hocus-pocus-hypothesis-a-scientific-isekai) | 304 | `0be8c5d886e9` |
| S3 | [[Farmer] Mage](https://www.royalroad.com/fiction/86267/farmer-mage) | 166 | `d83fd774a7ca` |
| S4 | [Just Add Mana](https://www.royalroad.com/fiction/125163/just-add-mana) | 211 | `8ad1d75f11a3` |
| S5 | [Those Who Return at Dawn](https://www.royalroad.com/fiction/129408/those-who-return-at-dawn-greek-myth-progression) | 201 | `88c6c579e052` |
| S6 | [Faith in Numbers: Ring Around the Rose](https://www.royalroad.com/fiction/192068/faith-in-numbers-ring-around-the-rose-cult-building) | 51 | `d5be47ae1aa1` |
| S7 | [In a Civilized Manner](https://www.royalroad.com/fiction/55691/in-a-civilized-manner) | 180 | `29bad1f8ac04` |
| S8 | [The Story Mage](https://www.royalroad.com/fiction/104998/the-story-mage-litrpg-kingdom-building-and-politics) | 49 | `3b3471dd970b` |

These are **Royal Road web-edition snapshots**, complete against each saved public
TOC manifest, not retail editions or claims that the ongoing stories have ended.
The last two works were marked inactive, not completed. Patreon-ahead, locked or
removed chapters are not implied coverage. Chapter-content bodies, tables and
available chapter images are included; author notes outside that DOM region are
excluded. No paid reading batch or full-source reading was performed.

Each title was finished and packaged before proceeding to the next. All 1,360
source URLs are unique within their manifests; every expected capture exists and
its hash matches its receipt. All eight EPUBs match recorded SHA-256s and live
registered locations. ZIP CRC, package XML, spine and navigation targets passed.
Visible text matches the captures with whitespace and U+FFFD rendering artifacts
normalized. Numeric entities that were literal in visible source text were
preserved as literals rather than decoded into different characters. The first
book's separate comparison identified only 62 replacement-character artifacts;
raw HTML and text remain unchanged. [Farmer] Mage's one chapter image is embedded
and also preserved as a separate unchanged asset.

Private owner: `novels/rr-ranked-browser-2026-10-31/`. Each S-code folder has
`toc.json`, immutable `chapters/*.json`, its EPUB, `receipt.json` and
`preserved_assets.json`; `final_inventory_check.json` joins all eight. Source TOC
snapshots were taken between 2026-10-31 22:47 UTC and 2026-11-01 00:45 UTC
(October 31 local time). Later serial updates are outside those pinned boundaries.

The authorized route used background signed-in browser controls, one chapter at a
time with at least 4.2 seconds between chapter responses and subsequent requests.
The old polite transport's 403 closure was not reset. No manual challenge, paid
access, purchase, account/security-setting change or other chat's download was
involved. Chapter navigation may affect RR history; no Set Progress or library
membership controls were clicked. The local loopback intake only persisted DOM
data and never fetched RR itself. Temporary capture tabs and local intake server
were closed after the run.

The prior 30-file intake remains separate. The earlier Memories of the Fall and
Immovable Mage gaps were outside this S1–S8 capture scope and remain unacquired.
[Route, authorization and outcome report](DOWNLOAD_SCOUT_NEXT_2026-10-31.md#authorized-paced-rr-browser-capture-2026-10-31).


## Two further RR snapshots, 2026-11-01

Weibao explicitly requested Memories of the Fall and Immovable Mage through the
same paced signed-in capture. This supersedes the earlier unacquired state for
Memories; Immovable has a preserved partial capture, not a registered EPUB yet.

| Code | Source | Verified current coverage | EPUB SHA-256 prefix / state |
|---|---|---|---|
| S9 | [Memories of the Fall](https://www.royalroad.com/fiction/36051/memories-of-the-fall), Rith | All 210 entries of the Nov 1 04:31 UTC public TOC, including book sections and other chapters | `aeb701ee25cd`, registered |
| S10 | [Immovable Mage](https://www.royalroad.com/fiction/39344/immovable-mage), ImmovableMage | 263 of 323 pinned public entries saved, contiguous ordinals 1–263; next 264, remaining 60 | Partial raw capture; no EPUB/completeness claim |

S9 passed TOC coverage, unique URLs, populated content, raw-file hash checks,
visible-text equivalence with whitespace/U+FFFD artifacts normalized, ZIP CRC,
package XML and spine/navigation targets. Final hash and live Source Library
location were rechecked. First-capture HTML truncation in 51 long entries was
corrected in separate immutable captures; original files remain preserved.
RR's CSS-uppercase spoiler control labels are preserved in the derivative.
This is a public web-edition snapshot, not retail equivalence, story completion,
full-source reading or reader-app acceptance. Outside author notes are excluded.

Private owner remains `novels/rr-ranked-browser-2026-10-31/`: S9 has its EPUB,
`receipt.json`, selected source hashes and `chapters-corrected/`. S10 has its
`toc.json`, 263 immutable `chapters/*.json` and hashed `checkpoint.json`.
Browser control became disabled in Work settings after interruption, blocking the
last 60 requests. The loopback intake is no longer listening. Resume from the
checkpoint after browser access is restored; do not repeat successful entries.
The old transport closure and the other chat's downloads remain untouched.

**RTOC is already held:** A Regressor's Tale of Cultivation, Tremendous,
Calibre 17/duplicate 43 and prepared `rtoc` reader source. The held Calibre 17
EPUB passed physical ZIP CRC and SHA-256 checks (`798bfee32222`); the existing
owner records 640 normalized reading entries. A focused search found no RR
edition. The [translator page](https://wetriedtls.com/series/a-regressors-tale-of-cultivation)
listed 893 chapter entries at this check, suggesting continuation work, but local
reading-order numbering, extras and access boundaries need alignment before an
exact gap can be stated. No new RTOC download or paid reader run was started.
[Findings and more-to-consider round](DOWNLOAD_SCOUT_NEXT_2026-10-31.md#nov-1-follow-up-memories-immovable-mage-and-rtoc).


## RTOC numbering alignment and missing material, 2026-11-01

Weibao explicitly authorized alignment and acquisition of missing available
chapters without duplicating the held material. **Two new verified EPUBs,
248 new public entries; 645 current TOC identities mapped to held material;
all 893 records of the pinned translator TOC accounted for.** The original
Calibre 17 and prepared `rtoc` reader source were not replaced or renumbered.

| Package | Newly acquired coverage | Entries | SHA-256 prefix |
|---|---|---:|---|
| RTOC | Linked continuation after original site chapter 640 through 874, including intervening supplementary entries and the combined 807 + 808 page | 238 | `866408d63472` |
| RTOC-GAPS | Missing chapter 211 plus nine distinct pre-640 supplementary entries: tidbit 1, pre-revision chapter 148 IF, Q&A 6–8, TMI 2–4 and the pre-revision chapter 410 blogpost | 10 | `acd035e41583` |

**Numbering:** the old file has 644 NCX entries, comprising prologue, 639 numbered
files and four Q&A files. Its numbered labels reach 640. The second “142” is
*Madman (3)* and maps to source chapter 143; it is not another missing chapter.
Chapter 211, *Lightning Flash (5)*, was genuinely absent by the TOC alignment and
is now supplied separately. Q&A 1–3 are bundled in old `chapter201.html`; Q&A 4
and 5 are in `chapter233.html` and `chapter265.html`. Those were reused, not
redownloaded. The additional older Q&A3-labelled file remains distinct. The old
640 normalized reading entries excluded Q&A files and were never a site cutoff.

The translator's source index is also not a chapter number: Q&A 11 uses index
735.0 while chapter 735 uses 735.5. The 807–809 jump is a combined 807 + 808 page.
The current [translator series](https://wetriedtls.com/series/a-regressors-tale-of-cultivation)
TOC contains 893 records, all marked public and price 0 at capture. This mapping
accounts for identities/coverage against the existing older edition; it does not
claim that held chapters were refreshed to their current revised text or full-read.

**Offline-image limitation:** all selected text passed conversion checks. Three
images, one in the continuation and two maps in TMI 2, remain explicit external
EPUB resources with original source URLs. Their media host disallowed the polite
transport through robots; its durable stop was preserved, with no alternate
fetch. These image bytes are not available offline. The EPUB manifests and
metadata record this qualified coverage rather than claiming complete image intake.

**Verification:** 248 unique source URLs and unique new bodies; every selected raw
hash, final EPUB SHA-256, ZIP CRC, package XML, spine/navigation targets and live
Source Library location passed. Visible text matched the captures with whitespace
and U+FFFD artifacts normalized. Original Calibre 17 SHA-256 was rechecked unchanged
(`798bfee32222`). No unmapped TOC identities remain. No paid reader batch was run.

Private owner: `novels/rtoc-continuation-2026-11-01/`. `full_toc.json` joins all nine
public API pages; `held_numbering.json` and `held_reader_map.json` preserve the old
numbering; `checkpoint.json` and `gaps_checkpoint.json` preserve selection and
transport receipts. Each package has immutable raw captures, EPUB and receipt;
`final_coverage.json` maps all 893 identities and verifies hashes/live locations.
The existing `lncrawl.polite.transport.Client` and normal transport root supplied
all translator requests with its 4–8 second spacing; no refusal was reset.

**Immovable Mage remains partial:** Chrome and the explicitly requested extension
route still reported “Local browser use is disabled in Work settings,” including
at the final recheck. No new RR chapter request was issued this turn. Its 263/323
checkpoint is intact; next entry 264, remaining 60. A connected extension alone has
not restored this tool's browser capability. The saved state is not an RR rejection.
[Resumption and Anna's free-route findings](DOWNLOAD_SCOUT_NEXT_2026-10-31.md#resumed-request-and-annas-free-route-2026-11-01).


## Anna’s gap round, 2026-11-01

Weibao authorized continuing the ranked reading-download queue and checking Anna’s.
**17 newly covered volumes across three series, 18 unchanged source EPUBs retained**
(two editions of Twelve Kingdoms 3), plus six separate repaired reader copies.
14 source files came through Anna’s existing member API; four through the independent
Z-Library desktop route. Original source bytes were preserved.

| Source | Newly acquired | Resulting coverage |
|---|---|---|
| Arcane Ascension, Andrew Rowe | Books 2–6 | Books 1–6 held. This closes the discovered catalogue continuation set; later publication/serial coverage is not implied |
| Slumrat Rising, Warby Picus | Books 1–6 | Continuous 1–6 held. Book 5 is **The Dislocated Man**, found by subtitle; the earlier unresolved book-5 gap is superseded |
| The Twelve Kingdoms, Fuyumi Ono | Seven Seas books 1–6 | Current released Seven Seas sequence through 6 held. Book 7 is dated Nov 24, 2026 by the publisher. Older fan/other numbering is distinct; no complete-original-series claim |

**Remaining:** Anna’s exact-title searches found no Immovable Mage ebook, no Bioshifter
beyond the held 1–3, and only Ghostsong preview/2023 material and the already-held
Huntsong Yonder edition. No retail-equivalence claim or duplicate companion intake.
Immovable Mage’s 263/323 checkpoint remains unchanged: its existing browser tab is
claimed by the earlier capture chat, so this chat did not take ownership or issue new
RR requests. This supersedes the old browser-disabled diagnosis only for this chat’s
working Anna’s browser access; it does not establish the other chat’s capture status.

**Routes:** the initially displayed account page was stale (50/50 used); the member
API subsequently returned 50 available at the first successful request. Anna’s
book-4 request later returned invalid JSON; no retry was made. Twelve Kingdoms 6
returned record-not-found, then came from Z-Library. Books 4–5 also used Z-Library
after the Anna’s failure. No purchase or membership change.

**Checks:** exact source MD5s/SHA-256s, live registered paths, ZIP CRC, package XML,
populated text, spine and navigation checked. Six original editions contained dangling
packaging/navigation references: Slumrat 2/3/5/6 and Twelve Kingdoms 5/6. Separate reader
copies remove those references, with all other ZIP member bytes unchanged. Twelve
Kingdoms 6’s missing spine ID is `jnov_xhtml_jnovels`; no missing story text was invented.
Both Twelve Kingdoms 3 files passed these structural checks; the newer desktop edition
is retained separately, with no text-equivalence claim. Reader-app acceptance and
sentence-level/translation completeness remain unverified; no full reading or paid
reader batch ran.

Private evidence: `novels/annas-gaps-2026-11-01/verified_intake.json` records all 18
source hashes and selected usable reader paths; `reader_repairs.json` records the six
repairs. Anna’s JSON receipts live beside them; desktop receipts are under
`novels/zlibrary/annas-gaps-2026-11-01/sources/.acquisitions/`.
Publisher boundary: [Seven Seas catalogue](https://sevenseasentertainment.com/series/the-twelve-kingdoms-novel/)
and [release calendar](https://sevenseasentertainment.com/release-dates/).


## RR full-run continuation round, 2026-11-01

Weibao: “Continue with the next useful RR series and continuations, get full
available runs and use the remaining Anna’s downloads.” **41 new source EPUBs,
41 unique hashes, all acquired and registered.** Used the remaining 36 Anna’s
fast downloads; five Primal Hunter continuations used the existing Z-Library
desktop allowance after Anna’s reached zero. No purchase or membership change.

| Code | Source | New volumes | Now held / bounded result |
|---|---|---|---|
| RR-A1 | The Weirkey Chronicles, Sarah Lin | 2–11 | 1–11, through Deadgold. The author’s June 18 release post supersedes the stale series page calling 11 Patreon-only |
| RR-A2 | Battle Mage Farmer, Seth Ring | 3–9 | Main novels 1–9, through Culmination. Tales of the Ecclesia is a separate game/adventure supplement, not main novel 10, and was not acquired |
| RR-A3 | This Used to Be About Dungeons, Alexander Wales | 1–3 | Published volumes 1–3; later web text is a separate boundary |
| RR-A4 | Blue Core, Inadvisably Compelled | 1–3 | Three-book set held. Author marks the web story completed; no chapter-by-chapter web/retail equivalence claim |
| RR-A5 | Sagewood, Blake Arthur Peel and Kimberly Ann Peel | 1–4 | Publisher’s four-book sequence held, through Restore the Balance |
| RR-A6 | The Primal Hunter, Zogarth | 3–16 | 1–16 held. Anna’s supplied 3–11, Z-Library 12–16. Publisher confirms 16 released; this does not cover later Royal Road/Patreon text |

**Preflight correction:** live Source Library already held Heretical Fishing 1–5
and Cinnamon Bun 1–7, beyond the older wishlist snapshot. They were excluded from
this round. Author/title and exact MD5 checks ran before each transfer; no held
opening volume or matching file was fetched just to consume allowance. Discovery
also found Forge of Destiny edition changes and later Dragoneye candidates, but
those were not acquired or counted; version/numbering alignment remains open.
Defiance of the Fall continuations remain a useful later queue.

**Verification:** all 41 expected MD5s and SHA-256s matched live registered files;
ZIP CRC, package XML, real spine IDs/targets, parseable spine XML, populated text
(over 50,000 text characters each), and NCX/EPUB3 navigation targets passed.
Zero structural gaps were found; no repairs or reconstructed story text were
needed in this round. Shared acquisition jobs record the selected edition keys.
These are acquisition/container checks, not full reading, translation-quality,
internal story-completeness, or reader-app acceptance checks. No paid reading
batch, gameplay edit, commit or push.

Private owner: `novels/annas-rr-runs-2026-11-01/`. `candidates.json` and
`primal-candidates.json` preserve selected metadata; MD5-named receipts preserve
provider results; `verified_intake.json` gives exact paths/hashes/checks;
`summary.json` gives totals. `verify.py` is the local repeatable intake check.
Z-Library originals and its transfer receipts remain under `desktop-sources/`.

Boundary sources: [Weirkey author updates](https://sarahlinauthor.blogspot.com/),
[Weirkey series page, stale on book 11](https://sarahlinauthor.blogspot.com/p/the-weirkey-chronicles.html),
[Battle Mage Farmer author catalogue](https://sethring.com/book-series/battle-mage-farmer-series/),
[Dungeons author homepage](https://alexanderwales.com/),
[Blue Core author afterword](https://www.royalroad.com/fiction/25082/blue-core/chapter/824910/author-afterword),
[Sagewood publisher series](https://aethonbooks.com/book/a-way-home/), and
[Primal Hunter 16 publisher](https://aethonbooks.com/book/the-primal-hunter-16/).


## Z-Library remainder round, 2026-11-02

Weibao: “use zlib for the rest”. The live desktop account had **21 downloads
remaining** before intake and **0 remaining (30/30 used)** afterward, checked
Nov 2 at 07:28 UTC. **21 new source EPUBs acquired and registered**, with 21
unique hashes. One separate repaired reader copy was also registered.

| Code | Source | New volumes | Now held / boundary |
|---|---|---|---|
| ZR1 | Defiance of the Fall, TheFirstDefier / JF Brink | 3–16 | 1–16 held. Book 17 has a catalogue candidate, but the publisher dates release to Dec 2, 2026; that candidate was not acquired or counted as a released edition |
| ZR2 | Paranoid Mage, Inadvisably Compelled | 1–5 | Five-book set held, through Sovereign Mage. Author’s RR page marks the story completed; web/retail text equivalence was not audited |
| ZR3 | The Iron Teeth, Scott Straughan / ClearMadness | 1–2 | A Goblin’s Tale and City of Daggers held. Book 1’s metadata truncates the author to “Scott”; internal author credit confirms Scott Straughan. This is the identified retail pair, not a claim of complete later web coverage |

The exact edition MD5 and live catalogue/job ledger were checked before each
transfer; no held opening volume was repeated. Downloaded files retain their
original bytes. ZIP CRC, package XML, spine IDs/targets, populated text, navigation
targets, hashes and live registration passed for selected reading paths.

**Reader-copy exception:** Defiance 8’s cover XHTML repeated the `alt` attribute
on one image. A separate copy removes the generic `alt="Image"` and retains the
descriptive alt text. All other ZIP members are byte-identical; the original
source SHA-256 is unchanged. Twenty source EPUBs pass unchanged, and the repaired
Defiance 8 copy passes. No story text was reconstructed. Structural checks do not
establish sentence-level completeness, full reading or reader-app acceptance.

Private evidence owner: `novels/zlib-rest-2026-11-02/`. `candidates.json` and
`iron-candidates.json` preserve selected metadata; MD5-named receipts and
`sources/.acquisitions/` preserve transfer evidence; `verified_intake.json` records
all paths/hashes/checks and preferred reader paths; `reader_repairs.json` records
the one repair. `verify.py` repeats the source-container checks.

Queue update: Defiance’s earlier continuation gap is closed through 16.
Dragoneye/Forge version alignment, Immovable Mage’s earlier capture ownership,
and the Innverse retail-equivalence gaps remain separate outstanding work.
No purchase, account change, paid reader batch, gameplay edit, commit or push.

Boundary sources: [Defiance 17 publisher date](https://aethonbooks.com/book/defiance-of-the-fall-17/)
and [Paranoid Mage author listing](https://www.royalroad.com/fiction/49879/paranoid-mage).


## Anna’s slow RR round, 2026-11-02

Weibao: “Use Anna’s slow downloads for the remaining useful RR series and
continuations. Get full available runs and avoid duplicates.” **12 new source
EPUBs acquired and registered through Anna’s slow links, 12 unique hashes.**
No member-API or Z-Library allowance was used in this round. Two selected runs
are closed; Dragoneye retains one explicit acquisition gap.

| Code | Source | New files | Resulting held boundary |
|---|---|---|---|
| SD1 | Beneath the Dragoneye Moons, Selkie Myth | 10–14 and 16 | 1–14 and 16 held; **15 Rise from the Ashes remains unacquired**, so this is not a complete 1–16 run |
| SD2 | Vainqueur the Dragon, Maxime J. Durand / Void Herald | 1–4 | Full four-book published set held, through The Last Adventure |
| SD3 | Commerce Emperor, Maxime J. Durand / Void Herald | 2–3 | Full three-book publisher set held; reused book 1 |

**Version mapping:** Dragoneye 10 is Under Ashen Skies, 11 Mandate of Heaven,
12 The Phoenix Peaks, 13 Moonfall, 14 Immortal War, 15 Rise from the Ashes and
16 Of Gods and Dragons. Older chapter/web collections and renamed editions were
not substituted for those volumes. The selected book 16 catalogue title has
misordered words; its exact candidate MD5 and physical intake are preserved.

**Route and limit evidence:** signed-in background Chrome exposed the ordinary
slow-partner pages. Book 10 arrived through the browser despite its download-event
notification timing out; book 11 arrived later and was verified before registration.
Subsequent files used the existing `annas_route.intake` helper on URLs actually
shown by those pages. An initial overlap of transfers preceded one HTTP 429 on
book 15. The partner page explicitly says one file at a time per server; subsequent
transfers were serialized and the refused request was not repeated. Overlap as the
cause is inferred, not established by the 429 body.

Anna’s separately offered waitlist partner for book 15 was allowed to count down.
It repeatedly returned through the automatic DDoS-Guard check and restarted its
countdown, with no download link. One observation followed 17 seconds, 7 seconds,
zero/no wait text, the browser check, then a fresh wait. No challenge was solved,
stop state reset, header/domain variant tried, or browser warning bypassed. The
actual 429 receipt and independent waitlist evidence remain separate. All started
file transfers finished; no downloader is left running. Book 15 is the remaining
gate for this selected Dragoneye run.

**Duplicate checks:** compared title/author aliases with the live catalogue, Calibre
and loose Downloads names, then checked each exact MD5 and shared job before transfer.
Held Dragoneye 1–9 and Commerce Emperor 1 were reused. Source originals remain
unchanged. All 12 new MD5s/SHA-256s, live registered locations, ZIP CRC, package XML,
spine IDs/files/XML, populated text and NCX/EPUB3 navigation targets passed. No
reader-copy repairs were needed. These are acquisition/container checks, not full
reading, sentence-level completeness, retail/web equivalence or reader-app acceptance.

Private owner: `novels/annas-slow-2026-11-02/`. The three
candidate files preserve selected editions; MD5-named receipts preserve individual
outcomes, including the refused book 15; `verified_intake.json` lists the 12 actual
files and hashes; `route_observations.json` and `summary.json` preserve gaps and totals.
`offered_urls.json` is private, temporary retrieval evidence and is not a durable
resume URL registry. `intake_one.py` reuses the existing helper, and
`register_downloads.py` registers browser transfers after hash verification.

The Gods Are Bastards search also exposed mixed older web-book and edited-retail
candidates; none was acquired or counted, and their version map remains unresolved.
No purchase, account change, paid reading batch, gameplay change, commit or push.

Boundary sources: [Dragoneye series numbering](https://www.audible.co.uk/series/Beneath-the-Dragoneye-Moons-Audiobooks/B091V2KW16),
[Vainqueur author listing and four-book links](https://www.royalroad.com/fiction/26534/vainqueur-the-dragon),
and [Commerce Emperor publisher’s complete-series listing](https://aethonbooks.com/book/commerce-emperor-3/).

## Anna’s slow follow-up, 2026-11-02

Weibao: “Try another slow partner for Dragoneye 15, then continue with the
remaining useful RR series and continuations. Full available runs, no duplicates.”
**10 new source EPUBs, 10 unique source hashes**, acquired through ordinary
Anna’s slow-partner links. Two separate reader derivatives were also registered;
they are repairs, not additional volumes. No fast/member API or Z-Library download
allowance was used. This supersedes the preceding Dragoneye acquisition gap.

| Code | Source | Added | Resulting coverage and remaining gap |
|---|---|---|---|
| SF1 | Beneath the Dragoneye Moons, Selkie Myth | 15, Rise from the Ashes | **1–16 held**, closing the earlier internal gap |
| SF2 | The Chronicles of Emberstone Farm, L. Meili | 1–3 | **All three publisher-listed books held**; web/Patreon continuation is separate |
| SF3 | Meadowreach Homestead, G. A. Jensen | 1–4 | Entire run found in Anna’s title search held. **5–9 remain missing**: desktop metadata finds 5–8, Anna’s search shows only 1–4, and the author has announced the ninth-book finale |
| SF4 | The Gods Are Bastards, D. D. Webb, current Podium editions | 1–2 | **Current retail 3, This Town Ain’t Big Enough, remains missing**. Its selected MD5 has no Anna’s record; title search finds the older 2020 web book 4. That was not substituted. Podium dates current book 3 to Sept 29, 2026 and book 4 to March 30, 2027 |

**Routes:** the old partner-1 link for Dragoneye 15 returned 403. A fresh URL
actually offered by slow partner 2 succeeded; the original 429 and failed-link
receipts remain intact. Emberstone 1’s no-wait partner stalled at 1,085,126 bytes,
unchanged for over 19 minutes. Its exact process was stopped, the partial retained,
and independently offered partner 2 completed it. Subsequent transfers were
serialized through partner 2, respecting countdowns. Gods 2’s wait restarted once
through the automatic browser check, then produced a working link. No manual
challenge, warning bypass, guessed retrieval URL, header variant or stop reset.

**Reuse and verification:** local title/author aliases, Calibre, registered assets,
loose filenames and exact candidate MD5/job states were checked before transfers.
The ten successful receipts report new downloads. Originals retain their source
MD5/SHA-256. ZIP CRC, package XML, real spine IDs/files/XML, populated text and
NCX/EPUB3 navigation were checked. Eight sources pass unchanged. Both current
Gods books have an NCX “Cover” entry pointing to nonexistent `OEBPS/c0.xhtml`;
separate reader copies remove that one dangling entry. Every other ZIP member is
byte-identical, and both source hashes remain unchanged. All ten preferred reading
paths pass. This does not establish full reading, sentence-level completeness,
retail/web equivalence or reader-app acceptance.

Private evidence owner: `novels/annas-slow-followup-2026-11-02/`. Four candidate
manifests preserve exact edition identity; MD5-named receipts preserve completed
transfers; suffixed receipts preserve failures; `preflight.json`,
`route_observations.json` and `summary.json` retain discovery and gaps.
`verified_intake.json` includes actual locations, hashes and preferred reader paths;
`reader_repairs.json` records the two repairs. `verify.py` validates all ten again.
Temporary `offered_urls.json` links are historical evidence, not a resume registry.
All intake processes and the waiting serial worker have ended. No paid reading,
purchase, gameplay edit, commit or push.

Boundary sources: [Emberstone publisher list](https://aethonbooks.com/book/emberstone-farm/),
[Meadowreach author’s book-nine announcement](https://www.reddit.com/r/litrpg/comments/1wm9jtm/book_9_finale_of_cozy_litrpg_slice_of_life_with_a/),
[Gods author’s Podium-edition notice](https://tiraas.net/),
[current Gods book 3](https://www.podiumentertainment.com/titles/109204/this-town-aint-big-enough)
and [book 4’s future date](https://dev.podiumentertainment.com/titles/116124/jewel-of-the-west).

Checks: source-library venv `verify.py` reports 10 checked, two original NCX gaps
and zero preferred-reader gaps; live hash/location checks pass for all ten.
`python3 -I scripts/library_catalogue.py` reports Calibre 232, Source Library 2,350
(includes the two new reader derivatives). Local Markdown destination checks and
`git diff --check` on the four touched library documents pass. Acquisition/docs
only; no runtime test or build claim.

## Anna's slow: Percy Jackson and Hunger Games, 2026-11-02

Weibao: "Anna slow, with seperate wave for free webserials", after asking for
Percy Jackson and Hunger Games. **15 new source EPUBs, 15 unique MD5s**, through
ordinary Anna's slow-partner links in signed-in Chrome (one tab, closed after),
one file at a time, each fetched by the existing `annas_route.intake` helper. No
member API, Z-Library allowance, purchase, or browser-check interaction (the
automatic DDoS-Guard check cleared on its own). Not held before: no catalogue,
Calibre or index entry matched either series.

| Code | Series | Held |
|---|---|---|
| PH1 | Percy Jackson and the Olympians, Rick Riordan | 1-5 (Lightning Thief to Last Olympian) |
| PH2 | The Heroes of Olympus, Rick Riordan | 1-5 (Lost Hero to Blood of Olympus) |
| PH3 | The Hunger Games, Suzanne Collins | 1-3, *The Ballad of Songbirds and Snakes*, *Sunrise on the Reaping* |

Not taken: Percy Jackson side books (*Demigod Files*, *Trials of Apollo*, later
arcs), by scope. Top-ranked retail-style hit per title was chosen; each file's
embedded title and author match, ZIP CRC passed and text is populated. This is
acquisition and container checking, not reading or edition-equivalence. Private
owner: `novels/annas-slow-riordan-collins-2026-11-02/` (MD5-named receipts,
`intake_one.py`). Run it with `source-library/.venv/bin/python`; system python
lacks `httpx`. No commit or push.

## Wildbow trio, free web serials, 2026-11-02

Weibao: "Wildbow trio" as the free web-serial wave after Percy Jackson and
Hunger Games. **Three EPUBs registered** (Worm was already held, Calibre 32).

| Code | Source | Route and result |
|---|---|---|
| WB1 | Pact | Captured from the author's public WordPress table of contents through the existing polite transport (`lncrawl.polite.transport.Client`): 145 distinct chapter pages, 1.01 to 16.12, no refusal, no cap hit. Assembled by a local script into one EPUB (6.2 MB of chapter text), XML-validated. This is a **capture**, not a retail file; comments and sharing widgets are stripped, images are not kept |
| WB2 | Twig | Anna's slow partner, `Twig: Complete` (zlib 2017 upload, 346 files, about 10 MB text), ends with the author's closing note *An End to the Twig Experiment* |
| WB3 | Ward | Anna's slow partner, `Ward` (lgli 2020, 295 files, about 11.7 MB text), Arc 1 Daybreak through Epilogue VII |

**Why two routes:** the first polite run guessed Twig's table-of-contents URL
wrong, got HTTP 404, and the transport closed that host durably. `parahumans.net`
(Ward's site) answered 403 to robots.txt and closed too. Neither was retried,
reset or approached another way; both came from Anna's instead. Closed hosts stay
closed in `novels/wildbow-2026-11-02/transport/state.json`.

**Checks:** Twig and Ward pass ZIP CRC, with title and author in the OPF; chapter
completeness was judged from the table of contents and final files, not read.
Pact's 145 chapters are those the table of contents lists; whether the author
posted anything outside it is unchecked. No sentence-level or retail-equivalence
claim. Private owner: `novels/wildbow-2026-11-02/` (`toc.py`, `fetch_pact.py`,
`assemble_pact.py`, `anna/` receipts). No purchase, commit or push.


## Anna's fast + local Z-Library round, 2026-11-03

Weibao: "use the local zlib, download stuff on anna's accordingly, check the fast download"
and "also download all the Re:Zero IFs". Quota read live: Anna's member API 50/50 at
start (**1 left** after), local Z-Library 30/30 at start (3 used, **27 left**). **53 new
source EPUBs, 53 unique hashes**, ZIP CRC and populated-text checked, registered.
Anna's fast first; Z-Library only where Anna's had no copy (Ex 6, Overlord 14, 16).

| Code | Series | Volumes | Boundary |
|---|---|---|---|
| RA1 | Ishura (Keiso) | 1–10 | Through vol. 10 (2026 release) |
| RA2 | Infinite Dendrogram (Kaidou) | 1–16 | Edition availability beyond 16 not checked |
| RA3 | Overlord (Maruyama) | 1–16 | Complete through the Yen Press 16 |
| RA4 | Re:Zero Short Story Collection | 1–5 | Official English SS; stories are not individually tagged "IF" here |
| RA5 | Re:Zero Ex | 1–6 | Side-story novels |

Interpretation: "Re:Zero IFs" was first read as the Short Story Collection plus Ex volumes;
Weibao then clarified he meant the web-novel IF routes (next section). The main-line Re:Zero
volumes 11+ are not part of this round.
Not downloaded: Irregular at Magic High School (candidates found, lower priority), Forty
Millenniums of Cultivation. Receipts and runners: `novels/anna-zlib-2026-11-03/`.
Catalogue regenerated (source-library 2421). Nothing committed.


## Re:Zero web-novel IF routes, 2026-11-03

Weibao: "I meant the Web novel if arcs and stuff, like the wrath". Source: Witch Cult
Translations' table of contents ("Re: Zero IF Stories", seven routes), captured through the
polite transport (robots checked, paced, shared state dir; no closure). **All seven held**,
registered as separate fan-translation files (label WN-side, not LN).

| Code | Route | Source | Held as | Size |
|---|---|---|---|---|
| IF1 | Oboreru IF (Wrath) | Witch Cult, 1 post | EPUB `01ba90a65f1f` | ~25.0k words |
| IF2 | Rem IF (Sloth), Re:IF Starting Life in a Different World: prologue, ch. 1–6, interlude, epilogue, plus the two Fortune extras (Fish-Head Tree, Setsubun Hollow) | Remonwater | EPUB `238bc38a06e8` | ~92.8k words, 11 posts |
| IF3 | Ayamatsu IF (Pride), April Fools 2017 | Witch Cult PDF upload | PDF `1830fedad59a` | about 42 pages; stored unchanged, not read or screened beyond header check |
| IF4 | Lust route, The Butterfly Dream | Eminent Translations | EPUB (registered 2026-11-03) | ~8.6k words, 8 sections, read from Weibao's Chrome at his request (Eminent's robots.txt disallows the polite client, so the transport stayed closed; one page, one tab). Eminent's reader also lists a next IF, *Re: Mistaking Life in Another World from Zero I (Genderbent)*, not captured |
| IF5 | Kasaneru IF (Greed) | Witch Cult | EPUB `fdeb0c9271e4` | ~20.3k words |
| IF6 | Tsugihagu IF (Gluttony) | Witch Cult | EPUB `5ebe34a3b7df` | ~23.6k words |
| IF7 | Azamuku IF (Vollachia), plus the Azamuku Supplement post | Witch Cult | EPUB `b154980eba0f` | ~32.7k words (28.1k + 4.6k) |

Checks: ZIP CRC and every XML part parse clean; word counts per post recorded in
`novels/rezero-if-2026-11-03/assemble_report.json`. Captures are the fan translators' web
text (footnotes kept, images and comments dropped), not retail files. Rem IF's chapter list
comes from Remonwater's own table of contents; the IF2 stop point is that list's last IF row.
Not captured: the Harem What-if (Rem's part) and other Remonwater extras outside the IF list.
Witch Cult's Side Content page is marked unavailable on the site. No purchase, commit or push.

### Duplicate cleanup and library reconcile, 2026-11-03

Weibao: "delete duplicates" and a library reconcile. Method: same-title EPUB groups compared by
extracted-text hash. Deleted six exact-text copies, keeping the original source in each case:
Cradle books 4, 5, 8, 9 (second managed copy), Deadman Running repair v1 (v2 kept) and the
Dungeon Crawler Carl derived "reviewed-spine" copy. Kept on purpose: the Archmage's Ire and
Couriers Outbound and Gods Are Bastards reader-repair copies (same text, fix reader container
errors) and the distinct editions (Lord of the Mysteries, Circle of Inevitability, Ascendance
Part 5.2, Lesser Kindred). Manifest of deleted hashes and paths:
`novels/dedupe-2026-11-03/manifest_before_delete.json`; `source-harvest-2026-10-25` ledgers
still name the deleted Cradle hashes as history.

Reconcile result (Source Library, read-only checks on the live DB and disk): 2,422 assets, every
one has a location that exists; no unregistered file under `library/`; no location without an
asset. Calibre catalogue 232 equals `metadata.db`. Both catalogues are generated from the live
databases, so they match by construction. Not checked: byte-level corruption beyond today's ZIP
CRC checks, and whether older entries match their index rows.


## Browser captures, Riordan round and Arc cleanup, 2026-11-03

Weibao: "open in browser for anything that would fix it ... go ahead and get stuff accordingly".

**Browser (Weibao's Chrome, one tab, about 7 s per page; Eminent and Witch Cult both disallow or
closed the polite client, so the transport stayed closed and nothing was retried through it).**

| Code | Item | Result |
|---|---|---|
| BC1 | Re:Zero WN Arc 2, Eminent, chapters 1–19 | EPUB, 75.9k words, registered `1875457f6f79`. Eminent text, not Witch Cult |
| BC2 | Re:Zero WN Arc 7 chapter 63 "Sparka" | The table-of-contents link was mis-slugged (301). Browser followed it to `/chapter-63-sparka/`; inserted after chapter 62, so Arc 7 is **116 of 116**, registered `6559e2bf05ab` (replaces the 115-chapter file) |
| BC3 | Eminent Genderbent IF, "Mistaking ... I" | EPUB, 13.9k words, `6542a6a3c911`. Only part I was reached; any later parts were not looked for |
| BC4 | Re:Zero Academy: First Period | EPUB, 9.2k words, `65b65dcfac6c` (it sat next in Eminent's IF Stories list; not an IF route) |
| BC6 | Re:Zero WN Arc 2, chapters 20–49 | Weibao approved the host 2026-11-03. Eminent's Arc 2 list links chapters 20–49 to pandemoniumtranslations.com (chapter 50 returns 404, so 49 is the end of the live list, not a verified end of the arc). One Chrome tab, one fetch every 6.5–7 s, 30 pages. Combined EPUB chapters 1–49 (49 chapters, 197k words, ZIP and XML checked), `95325d69544e`; the 19-chapter `1875457f6f79` stays registered as a subset. Pandemonium's robots.txt could not be read from the tab; text only, not compared with Witch Cult. Scripts and raw JSON: `novels/rezero-if-2026-11-03/build_arc2_full.py` and `~/Downloads/pandemonium_rezero_arc2_20-49_2026-11-03.json` |
| BC7 | JJK novels and two Riordan extras (Z-Library desktop; Anna's fast returned `annas_api_No_downloads_left`, quota roll-off expected about 17:00 EST) | Four EPUBs, ZIP CRC clean, registered: *Jujutsu Kaisen: Summer of Ashes, Autumn of Dust* (30k words) and *Jujutsu Kaisen: Thorny Road at Dawn* (32k; VIZ English novels, so the 2026-10-22 "no official JJK novels" line is superseded), *Daughter of the Deep* (89k), *Camp Half-Blood Confidential* (25k). Not read. Runner and receipts: `novels/jjk-riordan-2026-11-03/` |
| BC8 | Classics, Z-Library desktop (Anna's fast still empty) | Four EPUBs, ZIP CRC clean, registered, not read: *The Wheel of Time Omnibus* (Jordan; 18 MB, 951 parts, about 4.5M words, which fits the 14 main books but the book list was not checked), *The Books of Earthsea: Complete Illustrated Edition* (452k words), *His Dark Materials: The Complete Trilogy* (381k), *Ender's Game* (112k). Not fetched: Discworld (41 novels; a "Discworld Omnibus" hit has unknown contents), Forty Millenniums (only partial 1-2711 and 1-1145 files), Irregular at Magic High School (vol 1-6 exist, lowest rank), Gods Are Bastards 3-4 (2019 web-edition numbering only). Runner and receipts: `novels/classics-2026-11-03/`. Same day, later: Bookracy in Chrome failed (its API at api.bookracy.com returned "failed to fetch", a backend outage, not a human check); Z-Library then reported `daily_quota_exhausted` before issuing any request for the Ender sequels (*Speaker for the Dead* `3751901:8bc3f0`, *Xenocide* `3767336:6c021d`, *Children of the Mind* `18764408:9154dc`, *Ender's Shadow* `3799981:cdaaa7`, *Ender in Exile* `115720409:543abc`), so none came through Z-Library. **All five were then fetched the same day through Anna's free slow route** (MD5 from the Z-Library metadata, Weibao's Chrome one tab, partner server #9 with no waitlist, DDoS-Guard cleared on its own in about 18 s, then `annas_route.py intake --url --key`): *Speaker for the Dead* (139k words), *Xenocide* (186k), *Children of the Mind* (120k), *Ender's Shadow* (143k) and *Ender in Exile*; all ZIP CRC clean, registered, not read, and the Z-Library keys are linked. Bookracy's own search in Chrome failed on its backend, so it was not used. The runner prints `True` even when the inner acquire fails; read `via_zlib.ok` in the receipts, not the console line |
| BC9 | Tier 2 round, 2026-11-03, **historical mixed partial receipts; see B626 reconciliation** | Anna's free slow route (links collected in Chrome, one tab; transfers run serially in a detached worker, because Source Library's single download lock makes a second parallel transfer fail with `SourceError`, and the partner server delivers about 20 KB/s, so a 5–9 MB EPUB takes 5–7 min). 35 files resolved from Z-Library metadata (no quota): Tensura 1–3, 5–7, 9–15, 17–20 (4 and 8 not found; 16 already held), No Game No Life 1–3, 5, 7–12 (4 held; 6 not found), El-Melloi II Case Files 1–3, 6 (4 held; 5 not found), Fate/strange Fake English 4–5 (1–3 not found in English), Re:Zero web novel Arc 3 (Z-Library `25245389`), and the Chinese *宿命之环* 校对版全本 (`121534267`). Use actual receipts for recorded outcomes: `novels/tier2-2026-11-03/receipts.jsonl` (runner, queue and resolved list beside it). Not found anywhere searched (Z-Library, Anna's search in Chrome, Komga, CLU; Bookracy and Suwayomi were down): JJK Modulo, JJK Official Fanbook (JP or EN), JJK Official Character Guide, *Delicious in Dungeon World Guide*. Cuttlefish's other works (灭运图录, 一世之尊, 武道宗师) surfaced as Chinese-edition candidates in that dated search; 长夜余火 is our English *Embers Ad Infinitum* and 奥术神座 is *Throne of Magical Arcana* (zh Wikipedia work list, English titles unverified) |
| BC10 | Manga queue, 2026-11-03 (Weibao: "grab the mangas") | The governed manga/manhwa downloader already queues Naruto (701), Gaiden, Boruto, Naruto extras, Hunter x Hunter, FMA, Bleach, JJK side and guide/Modulo chapters, plus about 50 more series (Chainsaw Man, JoJo parts, Dungeon Meshi, Frieren, Demon Slayer, Mushoku Tensei, Solo Leveling and others). It had been stopped since 2026-10-29. I moved the manga ahead of the manhwa (backup `governor/queue.json.bak-2026-11-03-manga-first`) and restarted the governor loop (`governor.py start`); it downloads only inside 18:00 to 08:20, on AC or at 50% battery or more, and pauses below 30 GB free disk. Nothing downloaded yet. Existing text: `scripts/manga_text/` (Apple Vision OCR plus bubble detector, no speaker labels) has JJK 277, Bleach 214 and Omniscient Reader chapters as `chapter.jsonl` in `docs/research/manga-text/private/`; its watcher picks up new CBZs |
| BC5 | Arc 6 | Already complete at 91 chapters (`bfc232bd8c65`, chapters 89–90 from the 2026-10-30 Chrome saves). The "chapters 89–90 missing" lines above are stale. The partial (61) and 2-missing Arc 6 files were deleted as superseded |

**Riordan round (local Z-Library, 19 EPUBs, all ZIP-CRC checked, registered).** Trials of Apollo 1–5;
Kane Chronicles as *The Complete Kane Chronicles* omnibus (books 1–3 in one file); Magnus Chase 1–3;
Percy Jackson companions: Demigod Files, Chalice of the Gods, The Sun and the Star, Wrath of the
Triple Goddess, Greek Gods, Greek Heroes, Demigod Diaries; Brooklyn House Magician's Manual, 9 From the
Nine Worlds, Hotel Valhalla Guide. Anna's fast had 1 left and did not supply any of them. Not read.
Receipts and runner: `novels/riordan-2026-11-03/`; browser JSON and scripts: `novels/rezero-if-2026-11-03/`.
Nothing committed.


### What "held" means, and compilation coverage, 2026-11-03

Reconcile of the acquisition gap-scan method (owner rule: [AR36 and AR36b](SOURCE_ACQUISITION_TOOLS.md)).
Classification: the 2026-11-03 Shadow Slave recommendation was an incomplete rule plus a skipped check,
not a library defect. Evidence row reached: container facts from the live database and spines (part counts,
chapter numbers read from part titles); no text was read or compared.

| Series | Held coverage (from `scripts/library_coverage.py`) | Gap |
|---|---|---|
| Shadow Slave | Calibre 16 compilation chapters 1–1840 (contiguous); volume 9 chapters 1841–2260; volume 10 2261–2720; volume 11 2721–3000 (spine lacks 2888–2889); volume 2 (96–350) is an alternate edition downloaded before the check | The selected ranges reach3000, but volume11title numbers2888–2889 are unaccounted; this is a container-title question, not a confirmed missing story segment or entire volume |
| Meadowreach Homestead | 1–4, no compilation | 5–8 confirmed real (Z-Library only) |
| Dungeon Crawler Carl | 1–8, no compilation (book 8 is held as *A Parade of Horribles*, found by author, not title) | None; a second copy fetched by Anna's slow was deleted |

Other held multi-chapter EPUBs and their chapter ranges (ledger of 38 in `novels/rr-gap-scan-2026-11-03/compilations.jsonl`):
Reincarnation Paradise 1–4143; Reverend Insanity 1–2334; Lord of the Mysteries 1–1467 (two copies, different
translations); Beyond the Timescape 1–1354; Warlock of the Magus World 1–1200; Circle of Inevitability 1–1190
(two translations) and the Circle of Inevitability novel compilation 1–1180 (missing 1026); Dao of the Bizarre
Immortal 1–1024 (missing 144); Deep Sea Embers 1–852; A Knight Who Eternally Regresses 0–802; Second Life
Ranker 1–800 (7 gaps); A Novel Concept 1–438; Hocus, Pocus, Hypothesis 1–304; The Daily Grind 200–276 only.
About 20 further compilations (for example A Will Eternal, I Shall Seal the Heavens, Absolute Regression)
carry no chapter numbers in their part titles, so their coverage is unmapped and needs a table-of-contents read.
Before listing any gap, run the tool; do not infer holdings from titles or volume numbers.

Anna's slow check, 2026-11-03: Meadowreach Homestead 5, 6, 7 and 8 all return "not found" on Anna's, so they
stay Z-Library only (4 downloads of the 8 left). Battle Mage Farmer 10 (5e adventure) was fetched and kept.

## d20 rules reference collections, 2026-11-03

Not books: Pathfinder 1e pages from d20pfsrd and Pathfinder 2e records from
Archives of Nethys, scoped to afflictions, weapon and armor properties,
conditions, poisons, runes and disguise. Private data in
`docs/research/d20/private/`; scope, counts and hashes in the
[collection receipt](d20/D20_RULES_COLLECTION_2026-11-03.md).
- Pathfinder 1e scope widened 2026-11-04 (browser route, done): 4,251 pages covering weapon and armor abilities, wondrous and cursed items, afflictions, conditions, environment, haunts, skills, crafting, universal monster rules and the full sorcerer/wizard spell list, each tagged with its publisher; see the receipt.

## Wikis and rulebooks: acquired, missing and routes, 2026-11-03

Trigger: Weibao, “for the wiki we can look for other routes, or use chrome extension” and “missing wikis and more, consider rule books and more I can just get”. The wiki registry stays [DUMPS.json](power-systems/wiki-digests/DUMPS.json); this section records what changed and the one pending list for wikis and rulebooks. Raw data stays in `~/.codex/research/wikis/<host>/dump/`. Nothing here is read or folded into a digest unless a row says so.

**Route finding.** The registry's "unavailable" states came from Fandom S3 name guesses only. Two routes the registry had not tried both work:
- WikiTeam text dumps on the Internet Archive, the route already used for Bleach and MHA. An archive search covered all 55 non-ready hosts.
- The Fandom API inside Weibao's Chrome (Claude in Chrome, one tab, serial requests 4-8 s apart, 50 pages per request, saved as one download).

| Wiki | Route | Snapshot | File | Check | State |
|---|---|---|---|---|---|
| Naruto (Narutopedia) | Internet Archive `wiki-narutofandomcom` | 2020-02-23 | `narutofandomcom-20200223-history.xml.7z`, 256 MB (17 GB XML); `current-pages.jsonl.gz`, 16,681 titles at newest revision | md5 matches IA | Bloodline pages read for [AB12](../ABILITY_RULES.md#round-2-2026-11-03-mechanisms-from-one-world-that-serve-all-and-the-adaptation-slice) |
| Lord of the Mysteries | Fandom API in Chrome | 2026-11-03 live | `lotm-wiki-current-pages-2026-11-03.jsonl.gz`, 1,833 articles at their current revision (newest edit 2026-11-03), 10.4 MB raw | the on-disk byte count matches the in-page count | Held, unread |
| Mistborn, Dresden Files, Magic: The Gathering, Tower of God, The S-Classes That I Raised, Lazy Dungeon Master | Internet Archive WikiTeam items | 2020 to 2025 | about 50 MB of text dumps in total | md5 matches IA for all six | Held, unread |
| World Trigger | Internet Archive `wiki-worldtrigger.fandom.com-20231211` | 2023-12-11 | 7.8 MB | the archive returned HTTP 500 twice | Not acquired; retry later, or use the Chrome route |

**Still missing (40 hosts).** No matching archive copy was found in that dated search for: Mother of Learning, Reincarnation Paradise, Undead Unluck, Stormlight Archive, Omniscient Reader's Viewpoint, Mob Psycho 100, Dandadan, Fire Force, Kaiju No. 8, Solo Leveling, A Practical Guide to Evil, He Who Fights with Monsters, Slay the Spire, and 27 smaller web-novel wikis. These archive hits did not count, because they were fan or foreign-language wikis with similar names: Worm, Kagurabachi (Spanish only), Marvel, DC, Hades, VS Battles and the isekai wiki. The Chrome API route worked for LOTM. Other hosts need their own exact access/permission evidence; do not infer universal availability or begin another capture from this list.

**Rulebooks.** As of 2026-11-03 this line read "none are held". That was stale: Calibre holds the D&D 5e 2014 core, Xanathar's, Tasha's, Fizban's, Monsters of the Multiverse, Planescape, Spelljammer, GURPS Powers and Thaumatology, the M&M Hero's Handbook and Blades in the Dark, and later rounds added more (see the [download wishlist](DOWNLOAD_WISHLIST_2026-10-30.md) W2 held line). The scoped Pathfinder data is in the [d20 receipt](d20/D20_RULES_COLLECTION_2026-11-03.md). The licence notes below are from memory, so check each one before fetching. They are ranked by how many AB seams each rulebook feeds.

| Rulebook | How to get it | Feeds |
|---|---|---|
| Ars Magica 5th edition core | Free PDF from Atlas Games (open licence, to verify) | Warping and Twilight (AB14 loss of control), vis as conserved power (AB15), magical bloodline Virtues (AB12), longevity rituals |
| Vampire: The Masquerade 5th edition | Buy | Clans and bloodlines (AB12), Hunger and frenzy (AB14), blood bonds (AB18) |
| GURPS Basic Set and GURPS Powers | Buy (GURPS Lite is free) | The most granular advantage, limitation and resistance pricing: Resistant, Unusual Background (AB11, AB12, AB21) |
| Mutants & Masterminds 3e | Free SRD (OGL, d20herosrd) | Immunity, Enhanced Trait, Variable powers (AB11, AB21) |
| D&D System Reference Document 5.2 | Free (CC-BY-4.0) | Attunement (AB21), conditions, pacts (AB18) |
| Blades in the Dark SRD | Free (CC-BY 3.0) | Progress clocks, stress and trauma (AB14), downtime |
| Call of Cthulhu 7e Quick-Start | Free from Chaosium | Sanity loss (AB14) |
| Fate Core or Fate Condensed SRD | Free (CC-BY) | Aspects and consequences |
| Mage: The Ascension 20th, Exalted 3rd, Nobilis | Buy | Paradox and rule spaces (AB20), Limit Break (AB14), names and domains (AB23) |

**Free rulebooks fetched, 2026-11-03.** Weibao said “Fetch the free ones”. Files are in `~/.codex/research/rulebooks/<slug>/`. None has been read or folded into a seam yet. Screen each PDF with `pdf-screen` before reading it.

| Rulebook | Source | File | Licence | Check |
|---|---|---|---|---|
| D&D System Reference Document 5.2.1 | Wizards' own host, linked from dndbeyond.com/srd | `SRD_CC_v5.2.1.pdf`, 6.0 MB | CC-BY-4.0 | valid PDF; SHA-256 `8974902d109d6e63…` |
| Call of Cthulhu 7e Quick-Start Rules | Chaosium's free PDF (chaosium.com/cthulhu-quickstart) | `CHA23131 … Quick-Start Rules.pdf`, 32 MB | free download from the publisher, not an open licence | valid PDF; SHA-256 `39b6a53915ddf9f4…` |
| Blades in the Dark SRD | `amazingrando/blades-in-the-dark-srd-content`, linked from the official licensing page | one file each as markdown, HTML and TeX (commit `f141ed2`, 2022-04-08) | CC-BY 3.0, credit One Seven Design and John Harper | shallow clone |
| Ars Magica 5th edition, the full open corpus | `OriginalMadman/Ars-Magica-Open-License`, linked from atlas-games.com/openars | 50+ official books as corrected markdown, including the Definitive Edition core rules (commit `6d61e5e`, 2026-10-31) | CC BY-SA 4.0 (the text was machine-extracted, then hand-fixed; the `reviewed` folder is the trusted set) | shallow clone |
| Fate SRD, Fate Condensed included | `fate-srd/fate-srd-content`, the official SRD organisation that Evil Hat endorses (commit `93ed848`, 2025-08-08) | `docs/markdown/Fate-Condensed-SRD-CC-BY.md` plus the Core and Accelerated SRDs | CC-BY 3.0 | shallow clone; its build scripts are never run |
| GURPS Lite 4th edition | free from Steve Jackson Games, but only through a Warehouse 23 checkout with an account | not fetched | free distribution | Weibao's to grab: agents do not create accounts or check out |
| Mutants & Masterminds 3e SRD, scoped | d20herosrd.com through the lncrawl-polite transport: the powers chapter, character creation and the OGL page | 74 pages as text plus `manifest.jsonl` (body SHA-256 per page). They include Immunity, Enhanced Trait, Variable, Modifiers, Descriptors, the effect descriptions and the sample powers | OGL Open Game Content | the run stopped on a 404 from a site-internal link (`/6-powers/effects/sample-powers/mimic`), which closes the host in the transport for good. Seven queued pages were not fetched. Reopening the host needs Weibao's say-so, or the Chrome route |

**Next rulebook wave, 2026-11-03 (not fetched).** Weibao asked for “more rulebooks”. Free status was checked by web search on 2026-11-03; licence pages still need opening before any fetch. Ranked by the AB seams each one feeds ([round 3](../ABILITY_RULES.md#round-3-2026-11-03-in-world-reasons-per-world-ars-magica-read-more-rulebooks)).

| Rulebook | How to get it | Feeds |
|---|---|---|
| Ironsworn, and the Starforged reference guide | Free from the author (shawn-tomkin.itch.io, ironswornrpg.com). The full text is CC BY-NC-SA 4.0; the SRD and the reference guide are CC BY 4.0 | Sworn vows as the core loop: progress tracks, the cost of a broken vow (AB18) |
| Basic Roleplaying ORC Content Document | Free PDF from Chaosium (`content/orclicense/BasicRoleplaying-ORC-Content-Document.pdf`), ORC licence | Sanity and other generic powers, magic and psychic rules (AB14, AB21) |
| Delta Green: Need to Know | Free quick-start from Arc Dream (core rules under OGL) | Sanity with breaking points and bonds that erode (AB14, AB16) |
| Eclipse Phase 1st edition, and the 2nd edition quick-start | Free from the publisher. 1st edition is CC BY-NC-SA; the 2nd edition core is sold | Backups, resleeving and forks: a soul anchor as technology (AB17), body swaps (AB12 carrier mismatch) |
| Cypher System Reference Document | Free under the Cypher open licence (csol or col.montecookgames.com) | Cyphers: one-use power objects with a carry limit (AB15, AB21) |
| Pathfinder 2e beyond the current scope | Archives of Nethys, the browser route already authorized for that site | Sorcerer bloodlines, ancestries and heritages (AB12), curses (AB14) |
| Warhammer Fantasy Roleplay 4e | Buy | Corruption and mutation from exposure (AB14, AB27) |
| Unknown Armies 3e | Buy | Obsession-fuelled magick and five madness meters (AB19, AB14) |
| Shadowrun (any edition) | Buy | Essence lost to implants: capacity as a body budget (AB21) |
| Legend of the Five Rings | Buy | Shadowlands Taint (AB14), clan and family techniques (AB12) |
| Vampire 5e, GURPS Powers, Mage 20th, Exalted 3e, Nobilis 3e | Buy (from round 2) | as above |

**Next-wave free rulebooks fetched, 2026-11-03.** Weibao said “Fetch them”. Files are in `~/.codex/research/rulebooks/<slug>/`. None has been read yet. Screen each PDF with `pdf-screen` before reading it.

| Next-wave rulebook | Source | File | Licence | Check |
|---|---|---|---|---|
| Basic Roleplaying ORC Content Document | Chaosium's own host, from its ORC announcement page | PDF 3.8 MB and RTF 2.4 MB | ORC | valid PDF and RTF; SHA-256 `d38af1fc2c27326b…` (PDF) |
| Cypher Reference Document | col.montecookgames.com/license | `Cypher-Reference-Document-2026-07-29.docx` 8.5 MB, plus the licence PDF dated 2026-07-15 | Cypher Open License | valid docx; SHA-256 `cbc222b131436fef…` |
| Eclipse Phase 2nd edition Quick-Start ("Acrimony", Nov 2023) | eclipsephase.com/qsr | PDF 6.7 MB | CC BY-NC-SA 4.0 (the site's licence page) | valid PDF; SHA-256 `8ba97f45ad34ef69…` |
| Ironsworn rulebook and Assets Master Set | itch.io free download (shawn-tomkin.itch.io/ironsworn) in Weibao's Chrome; no account or payment. The rulebook was already in `~/Downloads` (2026-10-14) and was copied, not moved | rulebook 40.9 MB, about 270 pages; assets 0.46 MB | CC BY-NC-SA 4.0 (full text) | complete PDFs; SHA-256 `c1cfba6573cbd57e…` and `cc16c4eb95d0f782…` |
| Delta Green: Need to Know | free, but only through DriveThruRPG with an account; the Arc Dream pages hold no direct file | not fetched | OGL core rules | Weibao's to grab |
| Eclipse Phase 1st edition core | pay-what-you-want on DriveThruRPG; the publisher's epub mirror returns 404 | not fetched | CC BY-NC-SA | Weibao's to grab |

A stalled duplicate rulebook download, `~/Downloads/Unconfirmed 993474.crdownload` (15.7 MB), is left in place for Weibao to discard in Chrome.

Next steps, ranked:
1. Choose any further purchases explicitly; the two free waves already have their dated fetched/not-fetched rows above. This historical list does not launch another wave.
2. Choose which of the 40 missing wikis to pull through Chrome.
3. Read the held LOTM wiki against the mechanism lane (AB13, AB14), and give a lane owner the go.

## Acquisition round 2026-11-04 (Weibao: "go ahead", "use the rest of today's usage")

Receipts and runners: `docs/research/novels/wave-2026-11-04/` (gitignored: `receipts*.jsonl`, `wave*.py`, search outputs). 72 of 73 receipts verified by file (ZIP CRC for EPUB/CBZ, `%PDF-` header for PDF); the 73rd, Mushoku Tensei 10, failed twice as a corrupt copy and landed from a third copy (ZIP CRC clean). Anna's MD5 matched on every Anna's file. Nothing was opened for reading; PDFs still need `pdf-screen` before any reader. Source Library holds 2,791 assets after regeneration.

| Group | Held now | Route | Notes |
|---|---|---|---|
| Solo Leveling (Chugong) | Official Yen On novels 1-8, plus "Whole Story + Side Stories" web compilation (chapters 1-270) | Anna's fast; vol 3 Z-Library | Keep the web compilation as a separate edition from the official novels. One older "Solo Leveling" record predates this and is unidentified |
| Riordan companions | *Percy Jackson and the Singer of Apollo*, *Camp Jupiter Classified*, *Kane Chronicles Survival Guide*, *Percy Jackson and the Olympians: The Ultimate Guide* | Anna's fast | Rest of Riordan was already held (PJO 1-5, HoO 1-5, Trials of Apollo 1-5, Kane omnibus, Magnus Chase 1-3) |
| Naruto novels | Sasuke's Story: Star Pupil, Shikamaru's Story: Mourning Clouds, Kakashi's Story: The Sixth Hokage and the Failed Prince, Naruto's Story: Uzumaki Naruto and the Spiral Destiny, Sasuke Retsuden | Anna's fast | Itachi/Sasuke/Kakashi/Shikamaru earlier editions were already held as the Shinden/Hiden titles |
| Mushoku Tensei LN | Volumes 1-26 (all English volumes the search returned) | 1-9, 11-16 Anna's fast; 10, 17-26 Z-Library | Embedded titles for 15, 18 and 25 do not carry "Vol."; check by shelf, not title regex |
| Meadowreach Homestead | 1-8 | Z-Library | Supersedes the "Anna's lacks 5-8" note; Z-Library had all four |
| Sword Art Online Progressive | 1-9 | Z-Library | Newly held |
| Pathfinder 2e | Player Core, Player Core 2, GM Core, Monster Core | Anna's fast (GM Core and Monster Core on the second try) | PDF; Kingmaker (145 MB) not fetched |
| Other tabletop | Exalted core (Onyx Path), Pendragon Core Rulebook, GURPS Infinite Worlds (4e), Traveller Core Rulebook Update 2022, Burning Wheel Gold Revised | Anna's fast | PDF; Torg Eternity in English not found |
| JJK / Dungeon Meshi | JJK Modulo 1, 7, 9, 10 (CBZ); JJK Official Character Guide (PDF); Delicious in Dungeon World Guide (CBZ) | Anna's fast | Modulo 2-6 and 8 not fetched. The Dungeon Meshi guide MOBI was rejected by Source Library (unsupported format) and cost a download; take CBZ/PDF/EPUB only |

Corrections to earlier lines in this file: Tree of Aeons 8, Path of Ascension 9 and Overlord 1-3 were already held (the "Still Z-Library only" and "books 5+" lines are stale). Quotas at end of run: Anna's fast 1 of 50 left; Z-Library 4 of 30 left. Not found: Naruto official databooks, Torg Eternity (English), JJK Official Fanbook (English; a Spanish PDF exists).

Operating notes from this run: the manga governor's `source-library download` holds the shared download lock chapter after chapter, so a Z-Library `acquire` starves until `governor.py work-on` pauses it (then `work-off`); the governor's loop, runner and OCR died at 19:47 on 2026-11-03 and were restarted at 22:46 (Naruto at 3626 of the 3376-4076 range, about 36%). Source Library rejects `.mobi`. A wrapper that records `ok` from `acquire` must read the result's own `ok`: `acquire` returns `ok: false` without raising.

## Pathfinder 1e rules data repos, 2026-11-04

Weibao said "clone". Two shallow sparse clones are in `docs/research/d20/private/repos/`: the Foundry VTT PF1 system packs (3,028 spells with class lists, plus feats, classes and items) and PCGen's Pathfinder data. The content is OGL 1.0a. Commits, licences and the spell-coverage counts are in the [d20 receipt](d20/D20_RULES_COLLECTION_2026-11-03.md). Books and settings still to get are in [download wishlist W11](DOWNLOAD_WISHLIST_2026-10-30.md#w11-comprehensive-settings-and-full-pf1-rules-data-2026-11-04) (DL82-DL91), with the 5e gaps under DL8, DL9 and DL13.

## Acquisition round, free route and daily reset, 2026-11-04

Anna's free slow route (browser navigation, one download at a time, links expire in about 2 hours) and the day-2 quotas added these, all md5-checked on arrival and registered as managed assets (downloaded and hash-checked, not screened, not read): D&D 2024 Player's Handbook and Dungeon Master's Guide, Explorer's Guide to Wildemount, Strixhaven, Van Richten's Guide, Mythic Odysseys of Theros, Guildmasters' Guide to Ravnica, Kingmaker Part 2, GURPS Discworld (4e), JJK Modulo 2 to 6 and 8, Witch Hat Atelier 1 to 14 (all fourteen volumes), and Frieren volumes 1 to 13 and Prelude 1 and 2 (volumes 7 to 10 are PDFs of about 100 MB each). Still missing: an English Torg Eternity core book (Anna's has only the French rulebook and Torg-branded supplements), Monster Manual 2025 (only 2014, 3.5 and 4e editions are listed), the JJK official fanbook in English, and the Naruto databooks (one Japanese raw databook, md5 53aed6f032f38587e0ddc8d374f4d79a, 54 MB, is on Anna's but its fast API and slow route both refuse it). Z-Library's copies of Frieren 11 to 13 returned invalid_download, so those came through Anna's fast route (130 MB each). Receipts are in the gitignored `docs/research/novels/wave-2026-11-04/` (receipts6 to receipts12). The PDFs have not been through `pdf-screen`.


## Content reconciliation B626: current routing and dated holdings

This full review covers the complete 1,060-line input, including the newer November4 receipts. The dated sections remain acquisition history; their old “not held,” “still missing,” “running” and quota statements do not override later receipts or prove a current process. Keep one current holdings answer here and exact reading/spending state in the source/run owners.

Selected read-only checks found 232 Calibre records and 3,422 Source Library assets. The generated catalogues are cached snapshots, with the Source Library header still at 3,415; they were not regenerated. Six named coverage queries inspected registered metadata, existing locations and container titles only. Meadowreach has eight matching on-disk files. Soldier’s Life includes a managed book4 EPUB, so the old “MOBI only” binding is stale; three Bookworm substring matches are unrelated. Shadow Slave’s volume11 title scan leaves2888–2889 unaccounted, while the overall compilation ranges reach3000. This does not prove missing story text. English COI editions have different numbered-title sequences; do not merge their counts into one authenticated edition.

The Chinese-title query exposed a lookup limitation: raw JSON stores the title with Unicode escapes, so a literal 宿命之环 search returned zero despite a registered on-disk asset. The Tier2 receipt’s prefix `f76f8c412e2f` uniquely matches that asset and its decoded title. Use exact source keys/hash prefixes and decoded metadata to resolve such a result; zero raw-metadata matches are not library absence. My first exact-key check also used shortened prefixes as complete hashes; its false negatives were corrected before any holdings edit. No source bytes were changed or reacquired.

BC9 is a mixed partial receipt, not 35 completed acquisitions and not wholly unheld:18outcomes contain9downloads,1deduplication and8failures. All10success prefixes uniquely match current registered assets with existing locations: Tensura1/2/3/5/7/10/11, Fate/StrangeFake4/5 and ChineseCOI. No current worker, completion of the remaining planned requests, byte-level rehash, CRC or full-text proof follows. Current ChineseCOI registration supersedes its pending download row; original English/Chinese/retail/web scopes remain distinct.

Later receipts supersede early Tree8, Randidly13, HWFWM13, Carl8, Dragoneye15, Meadowreach5–8, Strixhaven and media/rulebook gaps. Keep the unresolved publication/edition questions separate. RTOC’s893mappedidentities/248newentries, ReZero’s repaired arcs and IF-versus-LN boundaries, WanderingInn’s raw versus repaired/retail editions, Singer companions and untranslated/offline media retain their specific limits. Historical duplicate deletion and explicit transport exceptions grant no new action here.

Later [KJ2 preparation](../gm/dispatch/refinement-audits-2026-10-31/KJ2_SOURCE_PREPARATION.md) records a bounded prepared English extraction, superseding the early no-private-copy assumption. The current campaign receipt supplies its own source window; this review reads no novel prose and authenticates no whole edition. Wiki hits, direct-browser success on one host, license snippets, valid containers, source hashes and structural checks remain different from source reading and runtime proof. Current [source tools](SOURCE_ACQUISITION_TOOLS.md), [reading workflow](BATCH_READING_WORKFLOW.md), exact receipts and selected run authorization govern any future action.


## Content reconciliation B628: Calibre metadata and source requests

B628 reads all232metadata rows of [the generated Calibre catalogue](CALIBRE_CATALOGUE.md). It remains unchanged. Its count agrees with the selected database count, but neither proves every source file is intact or read. Generic/miscredited titles, unnumbered openings, FateZero/ReZero aliases, Bookworm’s separate sequences and omnibuses require the exact source/TOC binding. Same titles and author variants are not authority to delete duplicates; retained reader repairs and distinct editions can be useful. Calibre is one store, so absent continuations here are not total-library gaps.

The complete [source request list](SOURCE_REQUESTS.md), S1–S99, retains useful precise mechanics questions and original access history. Later dumps/source acquisitions supersede selected old Open access labels; they do not automatically complete the requested revision/scene review. Current source tools and exact library/reading owners route a selected request. This review opens no school, medical, personal or fiction body, starts no watcher or acquisition, and changes no library files.

## Acquisition round, quota reset 2026-11-05

Downloaded and md5-checked, registered as managed assets (not screened, not read): No Game No Life 1 and 2, Sword Coast Adventurer's Guide, Lord El-Melloi II Case Files 1 to 3, How to Invent Everything, Fate/strange Fake 1, Re:Zero LN 11 and 12, Slime LN 13 and 14, Ironsworn Starforged Rulebook, RuneQuest Roleplaying in Glorantha, WFRP 4e Core (Cubicle 7), Mutants & Masterminds Hero's Handbook, Kingdom 2nd Edition, Invisible Sun (epub), Forbidden Lands Player's Handbook and Warhammer 40,000 Core Book (9th). Already held, skipped by md5: Traveller Core Update 2022, GURPS 4e Infinite Worlds, the Delicious in Dungeon World Guide CBZ, Fate/strange Fake 4 and 5, Cinnamon Bun 2 and 6, Mark of the Fool 9 and 10, Heretical Fishing 3 to 5. Not found on either route: an English Torg Eternity core book (French only), The Strange core, GURPS Low-Tech Companion 3, Monster Manual 2025, No Game No Life 3. Receipts: `docs/research/novels/wave-2026-11-04/receipts14` to `receipts17`.

Quota spend later on 2026-11-05 (Z-Library, epubs, md5-checked, not screened): Slime LN 1, 4, 6, 8, 9, 12 and 15; Re:Zero LN 13 to 24 except the volumes already held (14, 15, 16 to 24 landed this round); Overlord, Slime 2, 3, 5, 7, 10, 11 and the rest were already held. Not found on Z-Library: Mark of the Fool 11 and up, Fate/strange Fake 2 and 3, Overlord 4, 7 and 9, Infinite Dendrogram 1 to 3. Receipts: `docs/research/novels/wave-2026-11-04/receipts18` to `receipts20`.

Anna's fast route, 2026-11-05 evening: Overlord LN 4 (epub) and four Fate/strange Fake PDF scans (volume 2, 8, 9 and one more whose volume number is unverified, 7 to 12 MB each) are in. Overlord 9 on Anna's is neither a valid epub nor a valid PDF (probably MOBI), so it is not held. Receipts: `docs/research/novels/wave-2026-11-04/receipts21` and `receipts22`. Mark of the Fool 11 and up did not appear on Anna's either.

Recheck pass, 2026-11-05 night: the first search used a title pattern that missed titles like "Vol. 07", so it reported false gaps. After loosening it: Overlord 13 and 14, Slime LN 16 to 22, Irregular at Magic High School 1 to 6 and Re:Zero LN 25 to 29 were added (Anna's fast and Z-Library). Overlord 7, 9, 10 to 12 and 16 and Infinite Dendrogram 1 to 5 and Ishura 1 to 4 were already held. A 2025/26-dated Anna's "Monster Manual" is the 2014 edition (PDF created 2014, 380 pages), so Monster Manual 2025 is still not held. Still not found on either route: Mark of the Fool 11 and 12 (Z-Library lists book 10 as the latest), Fate/strange Fake 3, 6 and 7 as clean text, Slime LN 23, Re:Zero LN 30, English Torg Eternity core, The Strange core and GURPS Low-Tech Companion 3. Receipts: `docs/research/novels/wave-2026-11-04/receipts23` to `receipts25`.

Tabletop setting and rules pass, 2026-11-05 night (Anna's fast, PDFs, md5-checked, not screened; wishlist rows DL75 to DL90): Shadowrun Sixth World Core, Call of Cthulhu 7e Keeper Rulebook, Mothership Player's Survival Guide, Cults of RuneQuest, Pathfinder Lost Omens World Guide, Pathfinder Inner Sea World Guide, Forgotten Realms Campaign Setting (3e), The Grand History of the Realms, The Dark Eye Core Rules (5e) and WFRP 4e Up in Arms. Skipped on size: The Guide to Glorantha (two volumes, 736 MB and 790 MB). Not found as a core book: Night's Black Agents (only the Redacted excerpt), HârnMaster core, Mystara Gazetteers GAZ1 to 14 (one Northern Reaches PDF seen), Ptolus (player's guide only), Empire of the Petal Throne core, Mutants & Masterminds 3e GM's Guide (small fragments). Receipts: `docs/research/novels/wave-2026-11-04/receipts26` and `receipts27`.

**Royal Road favorites pass, 2026-11-05 night.** Against the 2026-10-30 follows/favorites snapshot, 160 of 188 shelf titles had no title match in the library; most are Royal Road-only serials with no ebook. Anna's fast route (9 uses) landed 9 published editions, md5-checked, not screened, not read: Butler to a Core Lord (book 1), Norman the Necromancer (book 3 only), Unwilling Eldritch Horror of Fortune (book 3 only), Corpo Age, Industrial Mage, Ultimate Level 1 (*Ultimate Boundaries*), World Tree Apocalypse (volume 1), Speedrunning the Multiverse (book 2 only) and a PDF of *The First Law of Cultivation: Qi = MC^2*. Super Minion was already held. Later books and earlier volumes of the partial series are not fetched. Other shelf titles with search hits that were short samples or wrong works (Rock Falls, Everyone Dies at 0.1 MB, Lord of Hunger, Godspawn Ascendant sneak peek) were not spent on.

The last fast use of 2026-11-05 landed *Norman the Necromancer* book 1 (md5-checked, not screened; Norman is now 1 and 3). *Unwilling Eldritch Horror of Fortune* book 1 (md5 54e54543a9bf5fbbaeb834ea43e01d9f) was refused with No downloads left, so Anna's fast is at 0 until the reset.

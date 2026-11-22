# Phone library plan (2026-11-22)

Proposal, not an accepted decision. Covers an offline reading copy on iPhone
and Android and a category scheme for the library. Source text stays outside
tracked files; this page holds routing only. Holdings stay in
[LIBRARY_INDEX](LIBRARY_INDEX.md).

## Build receipt (2026-11-22)

Weibao said "Build it". Built by `python3 -I scripts/phone_shelf.py --zip`
from [phone_shelf.json](phone_shelf.json), exit 0.

- **Output:** `~/Documents/Library/Phone Shelf/` (248 books, 723 MB, ten
  shelves) and `Phone Shelf.zip` (724 MB) beside it. `shelf_receipt.json` in
  the folder lists each book's source hash, source path and output hash.
- **Scope:** every volume on disk for the 44 core worlds, plus the books that
  were only on the phone. It covers far more volumes than the reading registry
  (for example Mark of the Fool 1-10, The Wandering Inn 1-20).
- **Checks:** all 247 EPUBs passed the ZIP CRC, mimetype, OPF parse and
  spine-target checks, and no two share a title. One source defect carries
  over: Shadow Slave 11 lists a title page its source never had, so readers
  skip it. The single PDF (Harry Potter omnibus) was copied byte for byte.
- **TTKS:** built as EPUBs from the captures with site ad lines stripped.
  Chapter counts: 111, 665, 429, 206, 668. B2 and B3 chapters 1-10 come from
  the official free text (simplified) and the rest is traditional.
- **Edition choices:** LOTM Chinese uses the phone's complete 1-1432 edition,
  and The Perfect Run uses the phone's completed edition rather than the
  Royal Road capture. The Wandering Inn 17 (Lady of Fire) is placed by
  elimination, and the Dragoneye Moons named volumes have no number. The
  Dragoneye omnibus `467c7d12ad` was left out.
- **Sources:** were only read. 18 catalogue locations under `~/Downloads`
  are stale because the files moved to `~/Downloads/Books_Reading`. The
  builder hashes that folder, but the Source Library catalogue still points at
  the old paths.

## Readest facts (checked in its source on GitHub, 2026-11-22)

- **Grouping:** the library groups by None, manual Group, Series, Author, Tag
  or Subject (`LibraryGroupByType` in `src/types/settings.ts`). Custom
  bookshelves with filter rules and their own grouping also exist
  (`src/types/bookshelf.ts`). Inferred, not tested: Subject reads the EPUB's
  `dc:subject` and Series reads `calibre:series`. Its EPUB parser and series
  tests mention `calibre:series`.
- **Book identity:** Readest matches books by a KOReader-style partial MD5
  that samples byte ranges of the file (`src/utils/md5.ts`). Changing a
  file's bytes therefore makes it a different book, so progress and
  highlights do not follow a re-exported file. Editing metadata inside Readest
  keeps the identity.
- **Shelf tags (rebuilt 2026-11-22, Weibao: "Tag and re-import"):** each EPUB
  now has exactly one `dc:subject`, its shelf name (for example
  `04 LitRPG & Progression`), and any older subjects are dropped. The builder
  also handles OPFs that prefix the OPF namespace (`opf:`, `ns0:`). All 247
  EPUBs re-passed the checks with the right subject, and 242 carry series
  metadata (the five TTKS books have none). The Harry Potter PDF can't be
  tagged. The tagged files replaced `All Books` on the phone: 248 files,
  SHA-256 read back. Group the Readest library by Subject after re-importing.
- **iOS import:** only "From Local File" (multi-select) shows on the phone.
  The staging was flattened into `KyBook 3/Phone Shelf/All Books` (248 files,
  sizes match the Mac).

## Phone check (KyBook 3, 2026-11-22)

The iPhone has KyBook 3, Readest, BookFusion and Apple Books installed. KyBook's
Documents folder was read over USB with `pymobiledevice3` (a scratch venv,
read-only) and copied to `~/Documents/Library/Phone Intake/KyBook 3 2026-11-22/`
along with `hashes.tsv`.

- 66 files: 60 in `Books/Books` and 6 in `Books/Inbox`.
- Exact duplicates on the phone: Beware of Chicken 1 (three copies), Make It
  Stick (two) and The Menocht Loop 1 (two). The Inbox Grokking Algorithms is a
  broken 154-byte stub.
- 20 phone books are byte-identical to library assets. About 35 exist only on
  the phone and are now in the shelf and the intake folder, not the library.
- Skipped: three KyBook sample classics (`.kb`) and a Beware of Chicken 2
  `.azw3` (the library has the EPUB).
- Readest doesn't share its folder over USB (the device refused with
  `InstallationLookupFailed`). With Weibao's choice, the shelf was staged in
  KyBook's `Documents/Phone Shelf/` instead: 248 files, 723 MB, each read back
  and SHA-256 matched. He imports into Readest from Files > On My iPhone >
  KyBook 3 > Phone Shelf.
- Weibao asked to dedupe the phone and remove broken files. Five files were
  deleted from `Books/Inbox`: two extra Beware of Chicken 1 copies, the extra
  Make It Stick, the extra Menocht Loop 1 and the broken Grokking stub. One
  copy of each remains in `Books/Books`, and all five are in the intake
  backup.

## Local duplicates (measured 2026-11-22, nothing deleted)

The Source Library catalogue has exact byte duplicates (same SHA-256 at
several existing paths). The scan found no broken EPUBs: all 1,539 local
EPUBs passed the ZIP CRC and container checks. 107 catalogue locations are
stale (the file is gone).

| Where the copies sit | Groups | Extra space |
|---|---|---|
| Calibre and Source Library managed store | 71 | 1,466 MB |
| Calibre and repo private copies | 57 | 878 MB |
| Books_Reading and Calibre | 72+ | 330 MB |
| Several copies inside `~/Downloads` | 97 | 250 MB |

**Trashed 2026-11-22 (Weibao: "Trash loose copies").** 77 files, 317 MB, from
`~/Downloads/Books_Reading`. Each one was byte-identical (SHA-256 rechecked) to
a kept Calibre copy. They went to `~/.Trash/Library dedupe 2026-11-22/` with a
`MANIFEST.json`; a second copy of the manifest is at
`~/Documents/Library/Phone Intake/books_reading_dedupe_2026-11-22.json`.
Files cited by tracked docs, `books.json` or the shelf receipt were protected.
After the move, the builder still resolves all 248 shelf books (exit 0).

Left alone on purpose: the duplicates inside `~/Downloads`, which are school
and personal PDFs rather than library books, plus Calibre, the Source Library
and the repo private copies. The Source Library catalogue now has 77 more
stale locations (184 in total); it needs a reconcile pass.

## What exists (measured 2026-11-22)

| Store | Size | Contents |
|---|---|---|
| Calibre (`~/Calibre Library`) | 3.9 GB | 232 books: 192 EPUB (2.6 GB), 39 PDF, 1 TXT. Tags are mostly `YAIRPG Research` and `Novel Source`, so they don't sort anything |
| Source Library (`~/.local/share/source-platform`) | 30 GB | 4,653 assets: 1,421 EPUB (11.5 GB, almost all English), 2,144 CBZ comic chapters (13.9 GB), 1,088 PDF (12.9 GB). Stored by hash, so not browsable |
| `~/Downloads/Books_Reading` | 1.3 GB | 80 loose books |

The core set is the 44 worlds registered in
[`books.json`](../gm/dispatch/batch-reading-2026-10-27/plans/books.json).
Their registered sources total about 175 MB, so they fit on any phone.

## Reader

Pick: **Readest** (free, open source, on the App Store and Google Play).
It is the only strong candidate that runs on both iOS and Android with its own
sync of position, highlights and the book files. It also reads OPDS catalogs,
including a Calibre server, if we want that later. Its free cloud is 500 MB,
which covers the core shelf. That figure comes from a user review; check it in the app.

Rejected: Apple Books (no Android), Moon+ Reader (no iOS), KOReader (built for
e-ink, clumsy on phones), Google Play Books (uploads to Google, weak on Chinese
EPUBs), FBReader (sync is paid).

Sources: [Readest](https://readest.com/), [GitHub](https://github.com/readest/readest),
[App Store](https://apps.apple.com/us/app/readest-ebook-reader/id6738622779),
[Google Play](https://play.google.com/store/apps/details?id=com.bilingify.readest),
[Readest vs KOReader](https://readest.com/compare/readest-vs-koreader).

## Delivery

1. Build a generated **Phone Shelf** folder outside the repo (proposed
   `~/Documents/Library/Phone Shelf/`). It holds copies with readable names in
   category folders. Sources are never touched.
2. Import into Readest once. Then either use Readest cloud sync to both phones,
   or AirDrop the zip to the iPhone and copy it to Android by USB or Drive.
3. A script regenerates the shelf from a tracked `shelves.json` manifest, so
   adding a book means adding a manifest line.

## Categories (first cut, core worlds only)

Superseded by [phone_shelf.json](phone_shelf.json), which owns the shelves
now: ten of them, with 07 renamed Supers & Urban and two added, 09 Nonfiction
& Learning and 10 Literary & SF.

Language goes in the file name (`[zh]`), not in its own category.

| Shelf | Worlds |
|---|---|
| 01 Mystery & Occult | Lord of the Mysteries (zh, en), Circle of Inevitability |
| 02 Cultivation | Reverend Insanity, A Regressor's Tale of Cultivation, Beware of Chicken, Street Cultivation, Forge of Destiny, Virtuous Sons |
| 03 Chinese Web Novels | The five TTKS books |
| 04 LitRPG & Progression | A Soldier's Life, You Are Summoned, Wish Upon the Stars, Randidly Ghosthound, Azarinth Healer, He Who Fights with Monsters, Path of Ascension, Mana Mirror, The Runesmith, 12 Miles Below, Beneath the Dragoneye Moons, Elydes, Small Town Hero, Ar'Kendrithyst |
| 05 Dungeons & Monsters | Dungeon Core, Dungeon Life, Tree of Aeons |
| 06 Time Loops | Mother of Learning, The Perfect Run, Stubborn Skill-Grinder |
| 07 Supers & Cyberpunk | Worm, Super Supportive, Godclads |
| 08 Epic & Dark Fantasy | Shadow Slave, The Wandering Inn, A Practical Guide to Evil, Pale Lights, Worth the Candle, Books of the Raksura, Mark of the Fool, Harry Potter |

Later shelves for the full library: Light Novels, Manga & Comics (CBZ),
Rulebooks & Games, History & Nonfiction, Reference, and an Inbox for anything
unsorted.

## Open risks

- **R1 Which file to ship.** Many registry sources are private normalized
  copies (chapter-split, images dropped). The phone copy should use the
  original EPUB, which needs an original-to-world mapping per book.
- **R2 Captures without an EPUB.** TTKS (JSON), Perfect Run and Super
  Supportive (Royal Road JSON) need conversion to EPUB first.
- **R3 Harry Potter is a single omnibus PDF**, which reads badly on a phone.
  Check the Source Library for EPUBs.
- **R4 Duplicates** across Calibre, the Source Library and Downloads (for
  example Calibre 17 and 43). The shelf script should dedupe by hash.
- **R5 "Organize the library."** The index rule says never modify the library.
  So categories live in the manifest and the generated shelf, not in Calibre
  tags. Retagging Calibre would need that rule changed.
- **R6 Cloud sync uploads the books** to Readest's servers. Local import on
  each phone avoids that.

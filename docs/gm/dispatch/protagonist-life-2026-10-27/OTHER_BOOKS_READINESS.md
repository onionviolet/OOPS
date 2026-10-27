# Other books: boundary and readiness notes (2026-10-27)

Status: notes only. No reading of these books has started for the lead-run pipeline. Each
needs its own AU13 plan and Weibao's yes before bulk reading. Rules as in the
[volume 1 plan](VOLUME1_READING_PLAN.md).

## Harry Potter, year 1

| Item | Value |
| --- | --- |
| Local source | Private seven-novel extraction with page locators and an FTS5 index, `docs/research/novels/harry-potter/source-preparation-2026-10-11/` (book-01.txt) [S README] |
| Size | About 78,900 words, 17 chapters [S word count and chapter headings of book-01.txt, 2026-10-27] |
| Boundary | All of book 1 (PLAN 1.3) |
| Shards | About 7 at 12,000 words (the AU cap); chapters run about 4,600 words, so 2-3 chapters per shard [I] |
| Reader language | English source; locators `B1:PDF-pN` (existing format, `src/world_packs/book_hp_pack.js`) |
| Schema changes | Locator pattern for English pages; `nameSource` mostly `repo` or the text itself; no glossary of translations needed |
| Settle first (one bounded reader) | The school-year calendar anchors (term start, feasts, matches, exams) as dated rows; the year itself is not in the text [S PLAN 2, unreachable sources] |
| Cost estimate | 7 x about 140,000 = about 1 million haiku tokens [I, from the LOTM fit; English tokenizes differently, so re-measure on the first shard] |
| Engine notes | A canon school-year calendar beside the abstract 70-day term, without changing existing saves (PL-A3) |

## Mother of Learning

| Item | Value |
| --- | --- |
| Local source | English "All ARCs" EPUB, Calibre ID 21 [S LOCAL_LIBRARY] |
| Size | About 807,000 words over 108 text documents (106 chapters, an epilogue and an afterword) [S member word counts 2026-10-27] |
| Boundary | Not settled: the EPUB has no arc labels [S toc.ncx]. Proposed default: chapter 1 to the end of the first restart, set by one bounded reader |
| Shards | Chapters average about 7,500 words, so **one chapter per shard** under the 12,000-word cap [I]; a 5-10 chapter first arc is 5-10 shards |
| Reader language | English; locators by chapter and paragraph (the pack's existing `c001 p75` form, `docs/research/novels/mother-of-learning/passes-2026-10-23/R1.md`) |
| Schema changes | A `loop` field on scenes (which restart the scene belongs to); the lead's knowledge carries across loops, the world resets (PLAN 18.3) |
| Settle first | The arc boundary; the month's calendar anchors; which loop counts as the canon line for the golden run |
| Cost estimate | About 145,000 tokens per one-chapter shard [I]; the first arc of about 8 chapters is about 1.2 million haiku tokens |

## What every new book needs before reading

1. A boundary with a locator and an edition decision.
2. The locator pattern and any schema delta for its language and structure.
3. An id registry seeded from the repo pack and any wiki or index available.
4. A measured first shard to confirm the cost fit before a plan is approved.

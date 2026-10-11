# C1: Royal Road deep reads through FanFicFare

Read `docs/gm/dispatch/skill-growth-2026-10-10/COMMON.md` first and follow it.

**Goal:** go past early chapters. For each book below, find how growth
and levels work from the bottom to the top of what's published: growth
models (G), level meanings (L), scale shape (S), what counts as "OP",
how the display changes, costs, clashes between systems, and how the
top differs from the bottom.

**Route:** FanFicFare 4.62 (`~/.local/bin/fanficfare`), which already
waits 6 seconds per Royal Road request through `~/.fanficfare/personal.ini`.
It was tested on 2026-10-10 and works. Only one FanFicFare process at a
time. Save EPUBs to
`docs/research/novels/skill-growth-2026-10-10/sources/`. Use chapter
ranges (`-b` / `-e`) to sample: about 10 to 15 early chapters, a middle
band and the latest band, plus any glossary, status or index chapter.
Budget: about 300 chapters total this run. Never refetch what's on disk.

**Books, in priority order (Royal Road fiction IDs):**
1. Godclads (59663)
2. The Game at Carousel (65629)
3. Super Supportive (63759), Weibao's top favorite
4. The Hundred Reigns (139212)
5. Mythshaper (104817)
6. Rift-Runner Returns Home (119140), only 54 chapters, read all
7. The Stubborn Skill-Grinder in a Time Loop (83294)
8. Bloodline Tree (140337)
9. You Have Died Again (98283)
10. Mark of the Fool (41618), public chapters only

If budget runs out, stop at a book boundary and record the rest.

**Output:** `docs/research/skill-growth-2026-10-10/RR_DEEP_READS.md`, with
one section per book (growth, level meaning, scale, bottom vs top,
costs, display, YAIRPG implementation considerations), then a
cross-book synthesis, new codes, and the checkpoint. Also write a
download ledger (`sources/LEDGER.json`: id, chapters fetched, date,
status) in the gitignored folder.

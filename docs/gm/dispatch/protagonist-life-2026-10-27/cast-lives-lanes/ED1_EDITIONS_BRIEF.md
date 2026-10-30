# Lane brief: ED1, book editions store and English alignment (LSD469-LSD470)

Model: `gpt-6-luna`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force or push. Other sessions share this checkout: touch only the files granted below.

**Mandate:** LSD469 and LSD470 in [LEAD_LIFE_SYSTEMS_DESIGN](../LEAD_LIFE_SYSTEMS_DESIGN.md) (read both rows and LSD460, LSD463, LSD465 first). Build a per-book editions store and align the official English LOTM onto the Chinese paragraphs the readings cite. Rules: CLR1-CLR13 in [LEAD_LIFE_RULES](../../../../LEAD_LIFE_RULES.md) section F, AD36, `.claude/rules/research-and-agents.md`. Default, dial and reason, no blanket never/always/only.

## Inputs (private, gitignored; never copy text into tracked files)

- Chinese authority: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/shard_*.txt`, read through `shardIndex()` in `scripts/lead_run/cite_paragraphs.mjs` (keys `book:ch:p`; Chinese volume 1 is book 0, volumes 2-8 are books 2-8).
- English editions: `docs/research/novels/lord-of-mysteries/private/source/en/lotm_en_webnovel_official.epub` (preferred) and `lotm_en_oldtl.epub` (differs in 114 chapters only). Also `docs/research/novels/circle-of-inevitability/private/source/en/coi_en_webnovel_official.epub` (second English edition of a book already read from Calibre 34; its chapter 1026 and afterword are new).
- Measured facts to reproduce first (data probe, CLR2): English volume chapter counts 213, 269, 250, 214, 204, 116, 87, 41 equal the Chinese; side stories are English chapters 1395-1430 plus four titled extras; Chinese shards lack volume 3 ch 231, volume 4 ch 62, volume 8 ch 7; median English/Chinese paragraph ratio 0.89; English chars per Chinese char p1 3.12, p50 3.47, p99 3.87. Stop and report if your counts differ by more than 2%.

## Deliver

1. `scripts/lead_run/book_editions.py` (run with `python3 -I`): EPUB to a normalized edition file, one JSONL row per paragraph `{edition, volume, chapter, p, title, text}` plus an edition header (language, translator or source, route, date, sha256 of the source file). Chapter detection by the volume headings; side stories as volume `side`. Never modify the source EPUB.
2. `scripts/lead_run/align_editions.mjs`: chapter map (Chinese volume V chapter C to English volume V chapter C) and a length-based dynamic-programming paragraph alignment inside each chapter (1:1, 1:2, 2:1, 1:0, 0:1 moves; cost from the length ratio against the book's median; no model). Output an overlay keyed by Chinese paragraph id with n:m groups, and a per-chapter score (share of 1:1 moves, length-band outliers). Fallback order per chapter: official, oldtl, original. Chapters missing on one side are listed, not invented.
3. `tests/book_editions.test.js`: synthetic, name-free fixtures only (generic words, made-up ids): alignment of a merged paragraph, a missing chapter falling back, a score below the floor flagged.
4. Private outputs under `docs/research/novels/lord-of-mysteries/private/editions-2026-10-30/`: the two English edition files, the overlay, `chapter_scores.json`, and a 3-chapter spot-check file (Chinese paragraph beside its aligned English) for volume 1 ch 1, a mid-book chapter, and the lowest-scoring chapter.
5. Same import and a 1:1 alignment of the CoI official edition against the CoI chapters the readings used, if it costs under a fifth of the lane; else name it as a gap.
6. Checkpoint `cast-lives-lanes/ED1_CHECKPOINT.md`: what was built, counts per volume (aligned, low score, missing), the spot-check verdicts in your own words (no quoted source text), below-floor statement, and the next step for the in-game reader.

## Files owned

`scripts/lead_run/book_editions.py`, `scripts/lead_run/align_editions.mjs`, `tests/book_editions.test.js`, `cast-lives-lanes/ED1_CHECKPOINT.md`, and the private `editions-2026-10-30/` folders. Read-only for everything else. No `src/` changes in this lane.

## Done check

`node --test tests/book_editions.test.js` passes; scripts rerun from a clean state reproduce the same overlay hash; the checkpoint prints per-volume counts and the three spot checks. One line per check. Ambiguity default (CLR12): when a chapter's alignment scores under the floor, keep the chapter-level link, mark its paragraphs `chapter-only`, and continue.

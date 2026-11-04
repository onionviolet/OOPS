# ED1 checkpoint: private book editions and LOTM English alignment

**Scope and rules:** LSD469-LSD470; CLR1-CLR3, CLR9-CLR12; AD36. This lane imports supplied editions and builds private overlays. Public scripts and tests contain no canon names or prose. Edition JSONL, overlay, scores, and side-by-side spot checks are private pack/research data under the gitignored source tree.

## Data probe

The official English LOTM EPUB has the expected per-volume chapter counts: 213, 269, 250, 214, 204, 116, 87, 41. Chinese shards contain 1,391 of the 1,394 main chapters; volume 3 chapter 231, volume 4 chapter 62, and volume 8 chapter 7 have no shard paragraphs. Among chapters present on both sides, English/Chinese paragraph-count ratios are p10 0.821, median 0.888, p90 0.975. Per-chapter English characters per Chinese character are p1 3.122, p50 3.473, p99 3.871. All are within 2% of the brief's measurements, so the lane continued.

## Outputs

- `scripts/lead_run/book_editions.py` imports supplied EPUBs read-only into normalized, private JSONL, records edition metadata and source SHA-256, maps LOTM chapters by volume-local number, and supports source numbering for a book whose chapter IDs run across volumes.
- `scripts/lead_run/align_editions.mjs` maps each Chinese volume/chapter to the same English volume/local chapter, aligns paragraph groups by character-length dynamic programming, and prefers official English, OldTL, then Chinese original. The former 1:1, 1:2 and 2:1 move limit forced gaps when an edition combined a chapter into one paragraph. The aligner now also considers 1:N and N:1 groups near the expected cumulative length and at the chapter end, without inventing paragraph boundaries. Unmatched paragraph share above 1% or a chapter character ratio outside 3.12-3.87 marks the chapter below floor; its Chinese paragraph IDs stay linked at chapter level with no paragraph overlay.
- Private LOTM editions: official 1,394 main chapters, 36 numbered side-story chapters and 4 titled extras (104,855 paragraphs); OldTL has the same chapter coverage (104,818 paragraphs). The audio-drama section and reference back matter are excluded from the reading store.
- Private outputs: `editions-2026-10-30/lotm-overlay.json`, `chapter_scores.json`, and `lotm-spotchecks.json`.
- CoI official edition imported as source-numbered chapters (1,180 total, 94,599 paragraphs). Its chapter map covers all 1,178 distinct chapter IDs present in the reading shards, each with an exact 1:1 chapter-number match. The full Calibre 34 EPUB was not among the lane inputs, so this verifies chapter identity coverage, not a full text-to-text comparison.

## LOTM chapter counts

| Volume | Aligned | Below floor | Chinese chapter absent |
|---|---:|---:|---:|
| 1 | 204 | 9 | 0 |
| 2 | 265 | 4 | 0 |
| 3 | 245 | 4 | 1 |
| 4 | 210 | 3 | 1 |
| 5 | 200 | 4 | 0 |
| 6 | 114 | 2 | 0 |
| 7 | 87 | 0 | 0 |
| 8 | 39 | 1 | 1 |
| **Total** | **1,364** | **27** | **3** |

## Spot checks

- Volume 1 chapter 1: 61 of 66 candidate groups are 1:1, with no gaps; its aggregate length ratio is inside the band. This is a length-based mapping, not a semantic verification.
- Volume 3 chapter 215, the middle-book sample: 51 of 60 candidate groups are 1:1, with no gaps; its aggregate ratio is inside the band.
- Volume 5 chapter 135, tied for the lowest 1:1 share, has one Chinese paragraph grouped with 73 English paragraphs and no gaps. Volume 5 chapter 109 has a 1:69 group plus a 1:1 group, also with no gaps. These are coarse group links, not 73 or 69 individual paragraph matches.
- Volume 4 chapter 49 stays chapter-only: its Chinese shard has 162 paragraphs and 6,398 characters; paragraphs 1-80 repeat exactly at 83-162. The English chapter has 10,252 characters, giving a ratio of 1.60. The shard was not changed. Chapters 60 and 61 have 3,338 and 3,812 Chinese characters, respectively, with no exact duplicate paragraphs; their ratios of 3.059 and 3.106 fall just below the configured floor, but those measurements do not establish a shard defect.

## Next step and current limit

The importer and overlay are data tooling only. No in-game reader or paragraph-track integration changed here, so gameplay is not complete. The next reader lane should load the private edition by reached Chinese paragraph ID, show English only for chapters that pass the score floor, keep below-floor chapters at chapter-level links, and retain LSD463's reached-text gate and LSD465's reading cursor behavior. A 1:N group establishes correspondence for the group as a whole; it does not locate each English paragraph inside the Chinese paragraph. Do not reveal any group's English text before its full source span is reached.

## Checks

- `node --test tests/book_editions.test.js` — passed, 4 synthetic tests; the new long-paragraph regression produced 7 gaps before the fix and zero afterward, with a 1:10 group.
- `python3 -I scripts/lead_run/book_editions.py ...` — passed for official LOTM, OldTL, and official CoI EPUBs; source EPUBs remained read-only.
- `node scripts/lead_run/align_editions.mjs` — passed; 1,394 main chapter links, 27 below-floor chapters among chapters with Chinese text, 3 Chinese-source gaps. The private spot-check file contains the opening, midpoint, lowest 1:1 share, volume 5 regression sample and volume 4 source-duplication sample.
- Clean-output rerun plus `shasum -a 256` — passed with identical hashes: overlay `1026e6783e815e1d760a9fe5e7e88daeddc12d6a3e313f3409fa054395c0a703`, chapter scores `3a7c9ec26d171a4eba9fa0ebd434277074d787e7dc045fe7c07a3b57bb5f79ad`.
- An explicit Python trailing-space/final-newline scan of the three resume-owned source/checkpoint files passed. No gameplay, bundle, browser, save, or human-play verification applies to this data-only slice.

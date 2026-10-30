# ED1 resume 1: volume 5 gap failure is an aligner defect

Coordinator review of `chapter_scores.json` (2026-10-30):

- Volume 5 has 52 low-score chapters whose `gapShare` median is 0.941 (almost every paragraph unmatched), while their whole-chapter English/Chinese character ratio is normal: only 4 volume 5 chapters (11, 21, 101, 149) fall outside 3.12-3.87 when the Chinese chapter's total length is compared with the same-numbered English chapter. Other volumes have gap share 0 at p90. So the texts correspond and the dynamic program is failing, not the data. Likely causes to check: a band or beam limit, a cost overflow or cutoff on longer chapters, a paragraph-length outlier that makes the 1:0/0:1 path cheaper, or a Chinese paragraph key ordering issue for book 5 (string versus numeric `p` sort).
- Volume 4 chapter 49 (ratio 1.60) and 60-61 look like a Chinese shard content problem (the Chinese chapter text is shorter than expected), not an alignment one. Report what you see; do not change the shards.

Do: find the cause, fix `align_editions.mjs`, add one synthetic regression to `tests/book_editions.test.js` that reproduces it (generic words only), rerun the alignment, and update `ED1_CHECKPOINT.md`'s counts table, spot checks and checks (new overlay hash). Same file grants and rules as the brief; do not commit.

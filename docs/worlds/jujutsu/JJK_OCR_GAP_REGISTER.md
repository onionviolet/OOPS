# JJK manga OCR gap register (2026-11-03)

*Proposal-round evidence (Task A step 1 of the JJK gap session; not an accepted decision). Locators and counts only: no page text.* Source: `docs/research/manga-text/private/Jujutsu_Kaisen/` (git-ignored), tool block `stage1-0.3` (Apple Vision en-US + comic text/bubble detector). Built by reading each `chapter.jsonl` page and item record directly; `manga_text.py summary --series "Jujutsu Kaisen"` totals agree (277 chapters, 5,479 pages, 33,691 items, `low_confidence` 4,049 = 12.0%, `no_text_in_box` 2,044). `coverage` and `failures` list no JJK gap or final error. Owner rules: [gap rules proposal](../WORLD_ABSORPTION_RULES.md#source-gap-rules-wa61-wa68-proposal-2026-11-03).

## What the held text is

- Chapters 1 to 271.5 are all held (277 chapter records; half chapters 61.5, 129.5, 132.5, 168.5, 262.2, 271.5 included). The task brief's "279" is the older count; 277 is what is on disk. Chapters after 271.5 are not in the library.
- Dialogue, captions and detected sound effects only. No choreography, art, panel action or who-is-speaking (speaker fields are null in stage 1). Sound effects are largely missed by Apple Vision.
- No reader has read this layer; the world ledger still rests on wiki snapshots (`SOURCE_LEDGER.md`).

## Gap classes

| Class | Meaning | Pages | Share of 5,479 |
|---|---|---|---|
| art-only page | Zero text items and no detector box that failed to read. Probably splash, art or sound-effect-only. Unverified until a page look. | 271 | 4.9% |
| likely real miss | Page has no read text but the detector found a text box (`no_text_in_box`), or a page has detector boxes with almost nothing read. Treat as unread dialogue. | 113 | 2.1% |
| low-confidence | Page where at least half of speech and caption items are `high_risk`, at least 3 of them. Read text exists but needs a check before a number or name is relied on. | 63 | 1.1% |

All no-text pages together: 351 of 5,479 (6.4%), matching the triage figure. Item level: 4,049 of 33,691 items are `low_confidence` (12.0%); 5,825 are `high_risk`. The class split is a heuristic from detector flags, not a look at the page; the optional vision pass (below) measures whether it is right.

## Register A: likely real miss (page has no read text, detector saw a box)

| Chapter | Pages | Count |
|---|---|---|
| 5 | 9 | 1 |
| 32 | 17 | 1 |
| 60 | 6 | 1 |
| 71 | 12 | 1 |
| 72 | 2 | 1 |
| 75 | 10 | 1 |
| 76 | 1 | 1 |
| 80 | 11 | 1 |
| 82 | 2 | 1 |
| 84 | 7 | 1 |
| 101 | 15 | 1 |
| 102 | 5 | 1 |
| 108 | 6 | 1 |
| 118 | 3, 11, 17 | 3 |
| 120 | 8, 12 | 2 |
| 123 | 18 | 1 |
| 127 | 2 | 1 |
| 130 | 10 | 1 |
| 137 | 8 | 1 |
| 154 | 7 | 1 |
| 156 | 17 | 1 |
| 158 | 7 | 1 |
| 160 | 6 | 1 |
| 161 | 8 | 1 |
| 162 | 8 | 1 |
| 165 | 9 | 1 |
| 169 | 8 | 1 |
| 170 | 2 | 1 |
| 175 | 5 | 1 |
| 177 | 13 | 1 |
| 186 | 3 | 1 |
| 191 | 12 | 1 |
| 193 | 4 | 1 |
| 198 | 4, 16 | 2 |
| 207 | 4 | 1 |
| 210 | 9 | 1 |
| 214 | 4 | 1 |
| 217 | 11, 13 | 2 |
| 218 | 11 | 1 |
| 219 | 16 | 1 |
| 223 | 15 | 1 |
| 224 | 5, 10, 17, 18, 19 | 5 |
| 225 | 18 | 1 |
| 228 | 7, 16 | 2 |
| 231 | 6 | 1 |
| 232 | 14, 17, 19 | 3 |
| 233 | 9 | 1 |
| 234 | 10 | 1 |
| 249 | 2 | 1 |
| 250 | 18 | 1 |
| 251 | 5 | 1 |
| 252 | 14 | 1 |
| 253 | 6, 13 | 2 |
| 256 | 13 | 1 |
| 257 | 6, 8 | 2 |
| 258 | 12 | 1 |
| 260 | 3, 8, 9 | 3 |
| 262.2 | 11 | 1 |
| 264 | 2, 8, 9 | 3 |
| 266 | 15 | 1 |
| 268 | 4 | 1 |
| 271 | 21 | 1 |

## Register B: boxes found but almost nothing read

| Chapter | Pages | Count |
|---|---|---|
| 2 | 10 | 1 |
| 16 | 13 | 1 |
| 62 | 13 | 1 |
| 70 | 6 | 1 |
| 99 | 17 | 1 |
| 101 | 8 | 1 |
| 115 | 14 | 1 |
| 118 | 8 | 1 |
| 120 | 3, 7 | 2 |
| 129 | 9 | 1 |
| 132 | 3 | 1 |
| 139 | 15 | 1 |
| 151 | 3 | 1 |
| 152 | 3 | 1 |
| 166 | 7 | 1 |
| 175 | 6 | 1 |
| 179 | 10 | 1 |
| 180 | 15 | 1 |
| 186 | 1 | 1 |
| 203 | 10 | 1 |
| 210 | 8 | 1 |
| 234 | 7 | 1 |
| 246 | 9 | 1 |
| 247 | 5 | 1 |
| 250 | 9 | 1 |
| 252 | 9 | 1 |
| 266 | 5 | 1 |
| 271.5 | 5, 11, 12, 15, 17 | 5 |

## Register C: low-confidence pages

| Chapter | Pages | Count |
|---|---|---|
| 8 | 15 | 1 |
| 12 | 7 | 1 |
| 23 | 21 | 1 |
| 24 | 20 | 1 |
| 32 | 2, 16 | 2 |
| 34 | 18 | 1 |
| 46 | 16 | 1 |
| 54 | 10 | 1 |
| 55 | 2 | 1 |
| 61 | 15 | 1 |
| 62 | 14 | 1 |
| 63 | 8 | 1 |
| 77 | 21 | 1 |
| 79 | 10 | 1 |
| 83 | 4 | 1 |
| 106 | 2 | 1 |
| 110 | 10 | 1 |
| 115 | 12 | 1 |
| 122 | 12 | 1 |
| 124 | 17 | 1 |
| 126 | 1, 6 | 2 |
| 137 | 20 | 1 |
| 143 | 13 | 1 |
| 144 | 19 | 1 |
| 150 | 7 | 1 |
| 156 | 18 | 1 |
| 157 | 3 | 1 |
| 158 | 14 | 1 |
| 161 | 16 | 1 |
| 163 | 6 | 1 |
| 173 | 11 | 1 |
| 174 | 14 | 1 |
| 179 | 15 | 1 |
| 181 | 14 | 1 |
| 184 | 4 | 1 |
| 191 | 10, 14 | 2 |
| 195 | 6, 7 | 2 |
| 200 | 3 | 1 |
| 205 | 25 | 1 |
| 210 | 17 | 1 |
| 211 | 17 | 1 |
| 212 | 4 | 1 |
| 223 | 16 | 1 |
| 225 | 15 | 1 |
| 232 | 1 | 1 |
| 234 | 14, 15 | 2 |
| 239 | 17 | 1 |
| 240 | 3 | 1 |
| 245 | 1 | 1 |
| 247 | 11 | 1 |
| 257 | 13 | 1 |
| 258 | 8 | 1 |
| 261 | 3 | 1 |
| 264 | 12, 15 | 2 |
| 270 | 6 | 1 |
| 271 | 23, 25 | 2 |

Highest item-level `low_confidence` counts by chapter (a chapter number and a count): ch1: 58, ch156: 40, ch161: 35, ch17: 31, ch34: 30, ch26: 29, ch62: 29, ch150: 29, ch10: 28, ch25: 28, ch71: 27, ch158: 27, ch2: 26, ch7: 26, ch86: 26. Chapter 1 leads, so it is a poor pilot or calibration chapter.

## Register D: art-only pages (probable, unverified)

| Chapter | Pages | Count |
|---|---|---|
| 6 | 10 | 1 |
| 16 | 4 | 1 |
| 23 | 3 | 1 |
| 25 | 18 | 1 |
| 27 | 12 | 1 |
| 28 | 3, 8 | 2 |
| 35 | 13 | 1 |
| 36 | 11 | 1 |
| 41 | 14 | 1 |
| 43 | 3, 18 | 2 |
| 44 | 20 | 1 |
| 46 | 11, 17 | 2 |
| 47 | 9 | 1 |
| 48 | 8 | 1 |
| 49 | 9 | 1 |
| 51 | 3 | 1 |
| 56 | 16 | 1 |
| 62 | 19 | 1 |
| 65 | 10 | 1 |
| 68 | 12, 14, 15 | 3 |
| 70 | 14, 15 | 2 |
| 71 | 16 | 1 |
| 72 | 3 | 1 |
| 73 | 7, 15 | 2 |
| 74 | 8, 14, 15 | 3 |
| 80 | 8, 20 | 2 |
| 82 | 12 | 1 |
| 85 | 21 | 1 |
| 86 | 15 | 1 |
| 87 | 4, 9 | 2 |
| 88 | 2, 14, 15, 16 | 4 |
| 89 | 9 | 1 |
| 90 | 7 | 1 |
| 92 | 7 | 1 |
| 95 | 7 | 1 |
| 96 | 10 | 1 |
| 97 | 3 | 1 |
| 98 | 17 | 1 |
| 100 | 8, 16, 18 | 3 |
| 101 | 7 | 1 |
| 102 | 6 | 1 |
| 103 | 2, 6 | 2 |
| 105 | 11, 16 | 2 |
| 106 | 4, 5, 13 | 3 |
| 107 | 15 | 1 |
| 108 | 12 | 1 |
| 109 | 9, 10 | 2 |
| 110 | 8, 18 | 2 |
| 111 | 15 | 1 |
| 113 | 12 | 1 |
| 114 | 16 | 1 |
| 115 | 3 | 1 |
| 116 | 8, 9, 10, 11, 12 | 5 |
| 118 | 2 | 1 |
| 120 | 2 | 1 |
| 126 | 5 | 1 |
| 127 | 17 | 1 |
| 129 | 8, 13, 14 | 3 |
| 130 | 4 | 1 |
| 131 | 6, 9, 13, 18, 20 | 5 |
| 132 | 14, 15 | 2 |
| 133 | 12 | 1 |
| 134 | 11 | 1 |
| 136 | 17 | 1 |
| 137 | 3, 4, 11 | 3 |
| 138 | 19 | 1 |
| 139 | 4, 5, 6 | 3 |
| 140 | 3, 7 | 2 |
| 141 | 10, 14 | 2 |
| 142 | 2, 17, 19, 21 | 4 |
| 143 | 12 | 1 |
| 144 | 13 | 1 |
| 146 | 15 | 1 |
| 148 | 15, 16, 17 | 3 |
| 149 | 16 | 1 |
| 150 | 19 | 1 |
| 151 | 2 | 1 |
| 152 | 5 | 1 |
| 155 | 10 | 1 |
| 157 | 4 | 1 |
| 159 | 19 | 1 |
| 160 | 7 | 1 |
| 162 | 15 | 1 |
| 164 | 17 | 1 |
| 165 | 11 | 1 |
| 166 | 8, 9, 10, 14 | 4 |
| 167 | 13 | 1 |
| 169 | 12 | 1 |
| 170 | 3, 14, 16 | 3 |
| 171 | 14 | 1 |
| 173 | 12 | 1 |
| 174 | 11 | 1 |
| 175 | 2, 12, 20 | 3 |
| 176 | 13 | 1 |
| 177 | 9 | 1 |
| 178 | 18 | 1 |
| 179 | 13 | 1 |
| 180 | 8 | 1 |
| 183 | 15 | 1 |
| 184 | 17 | 1 |
| 186 | 11 | 1 |
| 188 | 3, 4, 5, 7 | 4 |
| 189 | 9, 18 | 2 |
| 191 | 13 | 1 |
| 192 | 12, 15 | 2 |
| 193 | 15 | 1 |
| 194 | 2, 16 | 2 |
| 195 | 2 | 1 |
| 196 | 2, 7, 8, 9 | 4 |
| 197 | 2 | 1 |
| 198 | 2, 3 | 2 |
| 199 | 2 | 1 |
| 200 | 2 | 1 |
| 201 | 2, 16 | 2 |
| 202 | 2 | 1 |
| 204 | 2 | 1 |
| 205 | 6, 8, 9 | 3 |
| 206 | 2, 17 | 2 |
| 207 | 2, 11, 12, 18 | 4 |
| 208 | 2, 15, 16 | 3 |
| 209 | 2, 15 | 2 |
| 211 | 2 | 1 |
| 212 | 2 | 1 |
| 213 | 2, 5, 6 | 3 |
| 214 | 2, 3 | 2 |
| 215 | 12 | 1 |
| 216 | 2 | 1 |
| 217 | 2 | 1 |
| 218 | 2, 8 | 2 |
| 219 | 2, 6 | 2 |
| 220 | 2 | 1 |
| 221 | 2 | 1 |
| 222 | 2 | 1 |
| 223 | 2, 14 | 2 |
| 224 | 2, 14, 15 | 3 |
| 225 | 2 | 1 |
| 226 | 2 | 1 |
| 227 | 2 | 1 |
| 228 | 2, 10, 15 | 3 |
| 229 | 2, 7 | 2 |
| 230 | 2, 3 | 2 |
| 231 | 4, 5, 8 | 3 |
| 232 | 2, 3, 4 | 3 |
| 233 | 2 | 1 |
| 234 | 2, 13 | 2 |
| 235 | 2, 6, 17 | 3 |
| 236 | 2, 13 | 2 |
| 237 | 12, 17 | 2 |
| 238 | 2, 13 | 2 |
| 239 | 2 | 1 |
| 241 | 2, 17 | 2 |
| 242 | 2, 15 | 2 |
| 246 | 12, 15 | 2 |
| 247 | 4, 8, 15 | 3 |
| 250 | 6, 11, 12 | 3 |
| 251 | 16 | 1 |
| 252 | 13 | 1 |
| 254 | 8, 9 | 2 |
| 255 | 9 | 1 |
| 256 | 5, 15 | 2 |
| 260 | 6, 10 | 2 |
| 263 | 11, 14 | 2 |
| 264 | 10 | 1 |
| 266 | 13 | 1 |
| 268 | 2 | 1 |
| 269 | 2 | 1 |
| 271 | 20 | 1 |

## Use

- A reader receives Register A to C for its chapter range as "unread or doubtful pages" and must list any claim that touches one as `U` with the locator (WA61). Register D pages are art-presumed; a reader may note "no text read" and does not infer content.
- The register is regenerated by the reproducible query above (page records with `text_items` 0, joined with item flags); rerun it after any re-OCR.
- Gap fill routes: the two VIZ JJK novels ([plan](JJK_GAP_FILL_PLAN.md)) and, where it applies, the model-read layer (separate files, never merged over OCR rows).

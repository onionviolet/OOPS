# MoL G16 coverage pass: AU13 plan and prior-read finding (2026-11-03)

Status: proposal (AD32). **Superseded by the run: see [MOL_G16_COVERAGE](MOL_G16_COVERAGE_2026-11-03.md).** The sections below record the plan and pilot as written before the run; the "Not done" and "0 invocations" lines were true at that time only. Gap: G16 in [the S0/S1 stage record](ZORIAN_S0_S1_STAGE_RECORD_2026-11-03.md).

## F1: the book was already read for c56-c82 and c90-c106 (AR36b)

G16 says these ranges are "keyword windows only". That describes the Zorian scene tables, not the source coverage. The October census read all 106 chapters as shards (see [COVERAGE_CENSUS](COVERAGE_CENSUS_2026-11-03.md), `docs/research/novels/mother-of-learning/private/{wb8-merged-2026-10-30,lead-run-2026-10-28}`, gitignored). Every one of the 44 chapters has census rows, lead-run scene beats and locators. AU6 says each raw range has one reader owner, reused across topics; a new 28-shard pass would re-read the same text.

What the prior read does NOT give the Zorian path: dated events. 432 of 831 scene-beat lines in these chapters (variant files counted, so duplicates inflate both numbers) carry the date `L?-D?` (unknown loop and day). Carry, witnesses, budget and staleness, teacher windows, trust gates and foreknowledge-only actions were not extracted as fields. That residual is the real G16 work.

## AU13 plan (measured)

| Field | Value |
|---|---|
| Edition | Calibre 21, `Mother of Learning - nobody103.epub`, Source Library `e53f95695730`, 110 parts, part number = chapter number (0001-0106, epilogue 0107-0108) |
| W | **334,139 words** in c56-c82 (27 ch) and c90-c106 (17 ch) = 44 chapters, measured by stripping the EPUB's own XHTML (book total 806,857). Largest: c91 13,156, c63 11,367, c103 12,306, c96 10,484 |
| N | ceil(334,139 / 12,000) = **28 shards** (the card's rough 45 was unmeasured; three chapters exceed 12,000 words and need their own shard) |
| Repair | min(3, ceil(0.1 x 28)) = **3** |
| Invocations | 28 + 3 = **31**, concurrency 2, no helpers |
| Model | haiku readers, sonnet merge (AU5). Reader responses max 6 each (AU14), context target under 60k tokens, stop 80k |
| Source exposure ceiling | W + named repair spans (not yet named; reserved for truncated chapters) |
| Result requested | Per chapter: dated events, loop mechanics, teacher windows, ally trust gates, new places and people, foreknowledge-only actions, with locators |
| Reused evidence | Census rows, scene beats and fills for all 44 chapters (F1) |
| Pilot | Not run (see stop condition) |
| Usage meter at start | 5-hour window 42% (resets in 1h24m), weekly all-models 33%, weekly Fable 3% |
| AU7 ceiling | 5 points of any window from the start reading: 5-hour window would stop at 47%, weekly at 38% |
| Stop condition | First exhausted bound: 31 invocations, 334,139 + repair words, or AU7 ceiling |

## Why I stopped before reading

1. The AU7 ceiling is unproven. With the 5-hour window already at 42%, a 5-point ceiling leaves little room for 31 invocations, and no pilot measurement exists to price them. Running the pilot alone would spend source I may not need to re-read.
2. A full-source pass would mostly repeat the October read. The price of the residual (dates, carry, trust gates) is lower if done as targeted extraction.

**Recommended replacement plan (needs Weibao's yes):**
- Step A, 0 readers: join the existing scene beats, dates and locators into the per-chapter table below, and mark each chapter "read at shard level".
- Step B: date anchoring is the first target (432 of 831 beat lines in these 44 chapters are undated). Run the 28-shard pass only on the residual fields, haiku, pilot first, AU7 ceiling checked after the pilot. If the pilot shows the 5-point ceiling cannot cover 31 invocations, shrink to the chapters Weibao plays first (S7 before S8/S9).

## Per-chapter coverage (Step A; evidence from the private census, no model reads)

Columns: source words from the EPUB; census rows with an `en b1 cN` locator in the merged extras; lead-run scene-beat lines (variant files included); beat lines dated `L?-D?` out of all beat lines.

| Chapter | Words | Census rows | Scene-beat lines | Undated beats | Status |
|---|---|---|---|---|---|
| c56 | 6742 | 180 | 24 | 0/24 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c57 | 6092 | 161 | 27 | 3/27 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c58 | 6682 | 165 | 24 | 24/24 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c59 | 8044 | 177 | 18 | 3/18 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c60 | 7997 | 128 | 33 | 33/33 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c61 | 7148 | 253 | 33 | 6/33 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c62 | 7946 | 247 | 24 | 18/24 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c63 | 11367 | 284 | 21 | 21/21 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c64 | 7948 | 199 | 18 | 15/18 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c65 | 9706 | 254 | 30 | 30/30 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c66 | 7574 | 227 | 15 | 15/15 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c67 | 7887 | 132 | 18 | 18/18 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c68 | 8421 | 225 | 24 | 24/24 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c69 | 7952 | 160 | 27 | 27/27 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c70 | 5953 | 165 | 18 | 18/18 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c71 | 7538 | 222 | 21 | 9/21 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c72 | 7318 | 174 | 24 | 0/24 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c73 | 7694 | 229 | 27 | 27/27 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c74 | 9045 | 205 | 33 | 3/33 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c75 | 9613 | 220 | 21 | 0/21 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c76 | 7191 | 200 | 15 | 15/15 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c77 | 6494 | 180 | 12 | 12/12 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c78 | 6859 | 209 | 15 | 0/15 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c79 | 6146 | 172 | 12 | 0/12 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c80 | 7245 | 181 | 9 | 9/9 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c81 | 6387 | 210 | 3 | 3/3 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c82 | 7509 | 186 | 21 | 21/21 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c90 | 8262 | 202 | 15 | 0/15 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c91 | 13156 | 225 | 21 | 0/21 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c92 | 8282 | 259 | 21 | 0/21 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c93 | 7269 | 186 | 21 | 0/21 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c94 | 5958 | 244 | 21 | 0/21 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c95 | 6735 | 194 | 12 | 12/12 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c96 | 10484 | 156 | 9 | 0/9 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c97 | 7027 | 204 | 9 | 9/9 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c98 | 7248 | 201 | 12 | 0/12 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c99 | 5899 | 167 | 21 | 0/21 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c100 | 6635 | 168 | 15 | 0/15 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c101 | 8425 | 172 | 12 | 0/12 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c102 | 7057 | 162 | 9 | 9/9 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c103 | 12306 | 176 | 21 | 21/21 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c104 | 3529 | 106 | 12 | 0/12 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c105 | 6108 | 170 | 27 | 27/27 | read (shard census, Oct 2026); Zorian-field extraction not done |
| c106 | 3261 | 138 | 6 | 0/6 | read (shard census, Oct 2026); Zorian-field extraction not done |

## Sample review (WA48 style, 20 rows against the source)

I drew 20 random scene-beat rows from these chapters (seed 7) and compared each row's locator paragraph with the EPUB text, by eye on the first 220 characters. All 20 locators land on a paragraph that matches the beat's subject (for example c61 p72 the Eldemar visit with Zach's warnings, c60 p64 the lich teleporting at the party, c94 p66 Benisek and the Holakor villages, and one sealed beat, lr.mol.main.10509, referred to by ID only). This checks locator alignment only, not the beat's full claims. Paragraph numbering matches mine when counting from the first body paragraph after the two header lines.

## Not done

- No pilot, no reader launches, no fold into COVERAGE_CENSUS; G16's row is updated to point here.
- Mechanics fields (carry, trust gates, foreknowledge) remain unextracted.

## Pilot ledger (2026-11-03, Weibao's yes to "pilot first")

Shard P1 = c56 + c57, 13,632 words (6% over the 12,000 target; chapter boundaries). Payload with locators: 76,574 characters. Reader: haiku, one source read, one write, 2 tool calls, no truncation, no quotes. Output (private, gitignored): `docs/research/novels/mother-of-learning/private/g16-2026-11-03/pilot_c056-057.md`, 99 items over six fields.

- **Quality.** I checked 11 locators against the EPUB text (c56 p64, p89, p125, p202, p205, p211; c57 p20, p74, p106, p157, p166): all 11 are on the claimed paragraph and support the item. Weak spot: DATED holds relative timing ("two days after", "next three days"), not loop-day numbers, because the chapters give none. The undated beats will mostly stay undated; the gain is in LOOP, TEACHERS, TRUST and FOREKNOWLEDGE.
- **Cost.** Reader tokens reported by the host: 105,068 (input and output, cache split not given). Meter around the pilot: 5-hour window 43% to 44%, weekly all-models 33% to 33%. The meter moves in whole points and my coordinator turns share the window, so this is an upper bound for one shard, not a measurement.
- **Projection.** 28 shards would be about 2.9M reader tokens. If a shard costs up to one point of the 5-hour window, the pass is up to about 28 points there; the weekly cost is below the meter's resolution per shard, likely single-digit points in total.
- **AU7 position.** Starting reading 42% (5-hour); now 44%, so about 2 of the 5 points are gone and about 3 shards fit under the default ceiling. The default ceiling cannot cover 28 + 3 invocations. Stopped under AU7/AU8 for a specific larger ceiling. Remaining: 27 shards + 3 repair.

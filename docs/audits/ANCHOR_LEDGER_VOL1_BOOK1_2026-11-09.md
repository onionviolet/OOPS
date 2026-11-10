# Anchor ledger: volume 1 and book one, 2026-11-09 (LAYX34)

**What.** Per game system, how many source-backed statements exist that a fit could use, and of what kind (LAYX25 kinds plus tolerance). Counted by script unless marked judged.
**Inputs.** Book A: 3643 rule and rule-note rows from 150 private shard files (rules plus rule-note files; the total equals the 3,643 of the [demands pass](../SYSTEM_DEMANDS_VOL1_BOOK1_2026-11-08.md), matched by count, not by row ids). Book B: 528 rows from 18 files (528, also matching).
**Method.** One script (`anchor-ledger-2026-11-09/build_ledger.py`) assigns each row one system group (keyword rules, first match wins) and any number of statement kinds (regex heuristics). A row with no kind is qualitative. Precision per kind was then sampled by hand (judged).
**Limits.** Keyword grouping is approximate; a row sits in one group only. Kinds are heuristics, so raw counts overstate the kinds with low precision. The demands pass used a private scratch table that is gone, so groups were re-derived and the per-group row counts differ from that pass. Rows are the rule and rule-note passes only, not scenes or people.
**Rule for the class column (counted).** Tunable: 3 or more point, band or count/duration rows. Shape only: fewer than 3 of those, but 3 or more order, sequence, tolerance or negative rows. Assumed: neither. Row handles are `shard_file:line` in the private row files.

## Book A: Lord of the Mysteries, volume 1

| System | point | band | order | count/duration | sequence | tolerance | negative | qualitative | total | anchors (point+band+count) | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|
| L-SUMM | 30 | 20 | 3 | 21 | 88 | 4 | 40 | 100 | 221 | 71 | tunable |
| L-DIV | 28 | 16 | 5 | 41 | 71 | 12 | 35 | 167 | 283 | 85 | tunable |
| L-ACT | 1 | 6 | 0 | 7 | 11 | 1 | 3 | 39 | 57 | 14 | tunable |
| L-ADV | 24 | 28 | 9 | 50 | 61 | 5 | 39 | 225 | 376 | 102 | tunable |
| L-CTRL | 0 | 0 | 1 | 2 | 3 | 1 | 6 | 14 | 23 | 2 | shape only |
| L-SEAL | 14 | 14 | 0 | 11 | 23 | 3 | 13 | 48 | 89 | 39 | tunable |
| L-CHARM | 4 | 4 | 1 | 5 | 16 | 1 | 7 | 20 | 40 | 13 | tunable |
| L-INV | 8 | 7 | 0 | 9 | 5 | 0 | 4 | 46 | 65 | 24 | tunable |
| L-CLUB | 5 | 0 | 0 | 2 | 7 | 0 | 2 | 21 | 32 | 7 | tunable |
| L-ORG | 23 | 17 | 6 | 38 | 37 | 2 | 12 | 158 | 248 | 78 | tunable |
| L-LAW | 1 | 3 | 0 | 5 | 5 | 0 | 4 | 20 | 31 | 9 | tunable |
| L-EDU | 5 | 3 | 0 | 13 | 5 | 0 | 1 | 43 | 63 | 21 | tunable |
| L-TRAIN | 7 | 5 | 1 | 9 | 10 | 0 | 3 | 38 | 61 | 21 | tunable |
| L-TRAV | 19 | 14 | 0 | 18 | 16 | 0 | 1 | 48 | 95 | 51 | tunable |
| L-HOME | 34 | 15 | 1 | 22 | 10 | 1 | 10 | 49 | 103 | 71 | tunable |
| L-ECON | 218 | 68 | 5 | 58 | 57 | 4 | 26 | 298 | 618 | 344 | tunable |
| L-SPIR | 3 | 3 | 0 | 16 | 22 | 4 | 13 | 34 | 74 | 22 | tunable |
| L-POWER | 4 | 14 | 1 | 10 | 18 | 5 | 7 | 33 | 73 | 28 | tunable |
| L-ETIQ | 1 | 1 | 0 | 3 | 4 | 0 | 1 | 19 | 26 | 5 | tunable |
| L-TEXT | 29 | 88 | 3 | 134 | 66 | 1 | 10 | 159 | 389 | 251 | tunable |
| L-DAY | 10 | 3 | 0 | 4 | 22 | 0 | 10 | 54 | 87 | 17 | tunable |
| L-SIG | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | not re-derived |
| L-RARE | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | not re-derived |
| L-MISC | 28 | 31 | 2 | 15 | 19 | 3 | 25 | 494 | 589 | 74 | tunable |

Headline (counted): 21 tunable, 1 shape only, 0 assumed, 2 not re-derived or not found.

Class after weighting each kind by its sampled hit rate (counted from judged rates): no change.

Example row handles (counted; drawn from rows that carry a point, band or count/duration where any exist):

- L-SUMM: b5s51_rules:7, w3s38_rules:3, b5s56_rules:10, s2r_rules:1, b6s64_rules_other:2
- L-DIV: w2s23_rules_other:33, w1s12_rules:1, b5s59_rules:3, b4s49_rules:5, w2s20_rules:1
- L-ACT: b4s49_rules_other:5, b5s50_rules:15, b5s53_rules:3, w3s32_rules:1, b5s53_rules_other:6
- L-ADV: b4s45_rules_other:37, w2s23_rules:11, s8v_rules_other:7, w3s33_rules_other:41, b4s48_rules:8
- L-CTRL: s7v_rules:14, w3s30_rules_other:29
- L-SEAL: zw2s25r_rules:7, b7s70_rules:10, w2s25_rules:3, w1s15_rules:7, b4s48_rules:11
- L-CHARM: b4s44_rules:2, w1s16_rules:1, b4s48_rules:5, b4s42_rules:7, w2s24_rules:6
- L-INV: w4s40_rules_other:7, b6s60_rules_other:2, b5s50_rules_other:36, w3s37_rules:16, b5s51_rules_other:61
- L-CLUB: w1s18_rules_other:11, w1s17_rules_other:6, w1s17_rules:6, w1s14_rules:2, b4s44_rules:13
- L-ORG: w3s33_rules_other:3, s3r_rules_other:7, w4s40_rules_other:6, s8v_rules:7, w3s37_rules_other:7
- L-LAW: b6s61_rules_other:25, b4s45_rules:5, b5s58_rules_other:28, w1s17_rules:7, w4s41_rules_other:30
- L-EDU: s6r_rules_other:17, s2_rules_other:8, b4s43_rules_other:27, w1s14_rules_other:15, w1s13_rules:8
- L-TRAIN: b6s63_rules_other:51, w1s10_rules:8, b6s63_rules:6, w1s16_rules_other:5, w1s15_rules_other:16
- L-TRAV: w1s14_rules_other:16, b5s51_rules_other:43, b7s72_rules:12, b5s51_rules_other:50, s9v_rules_other:28
- L-HOME: b4s45_rules_other:8, b4s42_rules_other:19, w4s41_rules_other:24, b6s64_rules:2, w3s33_rules_other:2
- L-ECON: w1s11_rules_other:27, b5s57_rules_other:16, w2s29_rules_other:30, w1s14_rules_other:14, w2s24_rules_other:35
- L-SPIR: w1s19_rules:4, w2s26_rules:5, b5s51_rules_other:35, w1s12_rules:4, w1s16_rules:2
- L-POWER: b4s46_rules_other:11, s3r_rules_other:4, zw3s33r_rules_other:7, w3s30_rules_other:26, b4s43_rules:10
- L-ETIQ: w1s17_rules:4, b5s56_rules:9, zw3s33r_rules:2, w2s20_rules:9, w1s10_rules:1
- L-TEXT: s7v_rules_other:9, s7v_rules_other:12, b6s69_rules_other:26, s5r_rules_other:38, w3s31_rules_other:19
- L-DAY: b4s48_rules:2, w3s34_rules_other:11, w3s32_rules:3, b6s69_rules:1, b4s45_rules_other:5
- L-SIG: not re-derived (its keywords would name a sealed lead-specific power)
- L-RARE: not re-derived (rare late events; keywords would name them)
- L-MISC: w2s28_rules_other:67, b6s65_rules:9, w3s34_rules_other:2, b6s61_rules_other:34, w2s25_rules_other:11

## Book B: Harry Potter, book one

| System | point | band | order | count/duration | sequence | tolerance | negative | qualitative | total | anchors (point+band+count) | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|
| H-CREAT | 9 | 1 | 0 | 5 | 9 | 0 | 4 | 36 | 60 | 15 | tunable |
| H-QUID | 4 | 6 | 1 | 5 | 9 | 2 | 8 | 36 | 57 | 15 | tunable |
| H-WAND | 4 | 0 | 0 | 0 | 3 | 0 | 2 | 10 | 18 | 4 | tunable |
| H-POT | 0 | 0 | 0 | 0 | 2 | 0 | 3 | 8 | 12 | 0 | shape only |
| H-ECON | 5 | 1 | 0 | 2 | 1 | 0 | 0 | 21 | 29 | 8 | tunable |
| H-POST | 3 | 1 | 0 | 0 | 3 | 0 | 1 | 12 | 19 | 4 | tunable |
| H-TRAV | 0 | 2 | 0 | 4 | 2 | 0 | 0 | 5 | 12 | 6 | tunable |
| H-OBST | 1 | 1 | 0 | 0 | 1 | 0 | 1 | 10 | 13 | 2 | assumed |
| H-ITEM | 1 | 0 | 0 | 0 | 1 | 0 | 1 | 17 | 20 | 1 | assumed |
| H-HOUSE | 5 | 1 | 0 | 6 | 4 | 0 | 4 | 18 | 36 | 12 | tunable |
| H-DISC | 1 | 2 | 0 | 2 | 3 | 1 | 3 | 7 | 15 | 5 | tunable |
| H-CLASS | 1 | 1 | 0 | 3 | 2 | 0 | 1 | 13 | 20 | 5 | tunable |
| H-SPELL | 1 | 1 | 0 | 2 | 3 | 2 | 4 | 15 | 22 | 4 | tunable |
| H-HIDDEN | 0 | 0 | 1 | 1 | 1 | 0 | 0 | 3 | 5 | 1 | assumed |
| H-INV | 1 | 1 | 0 | 3 | 0 | 0 | 0 | 3 | 6 | 5 | tunable |
| H-AGE | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 9 | 10 | 1 | assumed |
| H-HOME | 0 | 3 | 0 | 3 | 0 | 0 | 2 | 18 | 26 | 6 | tunable |
| H-SOC | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 4 | 4 | 0 | assumed |
| H-TEXT | 0 | 9 | 0 | 20 | 11 | 0 | 2 | 32 | 61 | 29 | tunable |
| H-DAY | 0 | 1 | 0 | 1 | 1 | 0 | 0 | 7 | 10 | 2 | assumed |
| H-MISC | 4 | 4 | 0 | 2 | 2 | 0 | 4 | 59 | 73 | 10 | tunable |

Headline (counted): 14 tunable, 1 shape only, 6 assumed, 0 not re-derived or not found.

Class after weighting each kind by its sampled hit rate (counted from judged rates): no change.

Example row handles (counted; drawn from rows that carry a point, band or count/duration where any exist):

- H-CREAT: hp1c009_rules_other:44, hp1c005_rules_other:45, hp1c013_rules:5, hp1c003_rules:7, hp1c005_rules_other:6
- H-QUID: hp1c001_rules:1, hp1c009_rules_other:39, hp1c009_rules_other:24, hp1c005_rules:4, hp1c013_rules_other:40
- H-WAND: hp1c005_rules_other:44, hp1c005_rules_other:42, hp1c005_rules_other:40, hp1c005_rules_other:46
- H-POT: hp1c005_rules_other:8, hp1c007_rules:12, hp1c007_rules_other:24, hp1c005_rules:17, hp1c005_rules_other:9
- H-ECON: hp1c005_rules_other:1, hp1c011_rules_other:54, hp1c005_rules:1, hp1c005_rules_other:2, hp1c005_rules_other:15
- H-POST: hp1c009_rules_other:34, hp1c003_rules_other:25, hp1c003_rules_other:29
- H-TRAV: hp1c005_rules:14, hp1c011_rules_other:39, hp1c005_rules_other:12, hp1c017_rules:10, hp1c005_rules_other:27
- H-OBST: hp1c015_rules:7, hp1c011_rules_other:34
- H-ITEM: hp1c009_rules_other:30
- H-HOUSE: hp1c013_rules:8, hp1c013_rules:10, hp1c005_rules:13, hp1c013_rules_other:28, hp1c011_rules:9
- H-DISC: hp1c017_rules:7, hp1c001_rules_other:17, hp1c015_rules:13, hp1c015_rules:10
- H-CLASS: hp1c013_rules_other:31, hp1c003_rules_other:62, hp1c011_rules_other:47, hp1c013_rules_other:27, hp1c013_rules_other:29
- H-SPELL: hp1c001_rules_other:18, hp1c003_rules:3, hp1c009_rules:5
- H-HIDDEN: hp1c005_rules:6
- H-INV: hp1c011_rules_other:84, hp1c013_rules_other:33, hp1c003_rules_other:70
- H-AGE: hp1c003_rules_other:46
- H-HOME: hp1c001_rules_other:24, hp1c001_rules_other:21, hp1c003_rules_other:1, hp1c001_rules_other:19, hp1c001_rules_other:20
- H-SOC: hp1c011_rules_other:16, hp1c011_rules_other:52, hp1c011_rules_other:51, hp1c003_rules_other:58
- H-TEXT: hp1c003_rules_other:81, hp1c003_rules_other:49, hp1c005_rules_other:25, hp1c003_rules_other:30, hp1c009_rules_other:41
- H-DAY: hp1c005_rules_other:31, hp1c011_rules:14
- H-MISC: hp1c013_rules_other:37, hp1c009_rules_other:42, hp1c013_rules_other:43, hp1c009_rules_other:38, hp1c011_rules_other:31

## Sampled precision (judged)

About 15 rows per kind per book were read by hand and judged as really carrying that kind. Hits over sample.

| Kind | Book A | Book B | Note |
|---|---|---|---|
| point | 15/15 | 12/15 | B misses: a spell row and two rows with no figure; the structured-quantity shortcut over-fires. |
| band | 14/15 (12/15 before the rank-number fix) | 15/15 | A misses were rank names such as a range of ranks, now stripped. |
| order | 11/15 | 2/3 | Misses were 'rather than', 'superior' as a job title and 'later than' as a deadline; excluded after sampling (fix not re-sampled). B has only 3 rows. |
| count_or_duration | 13/15 | 13/15 | Misses were counts of steps or crowd sizes, not tries or days. |
| sequence | 15/15 | 12/15 | Broad kind: any rule with 3 or more listed steps counts. B misses were 'before the whole school' and 'after dark' used as time words. |
| tolerance | 4/15 | 2/5 | Poor. Most hits were 'within', 'correct' or 'wrong'; those words were removed after sampling (fix not re-sampled). Treat tolerance counts as unreliable. |
| negative | 14/15 | 14/15 | Misses were place names such as the forbidden corridor and 'lost' meaning wandering. |

Adjustment (judged): One round of regex changes after the first sample (rank-number scrub for band, comparison words trimmed for order, tolerance narrowed, sequence trimmed to before/after/then, negative trimmed). Order, tolerance and sequence precision above is from the re-sample; point and count are from the first sample, whose regexes did not change. Two small last fixes (rather than, and the tolerance words) were applied without a re-sample.

## What this changes

- Book A, lore can tune now (counted, subject to the precision above): L-SUMM, L-DIV, L-ACT, L-ADV, L-SEAL, L-CHARM, L-INV, L-CLUB, L-ORG, L-LAW, L-EDU, L-TRAIN, L-TRAV, L-HOME, L-ECON, L-SPIR, L-POWER, L-ETIQ, L-TEXT, L-DAY.
- Book A, lore can shape only: L-CTRL.
- Book A, stay assumed: none.
- Book B, lore can tune now (counted, subject to the precision above): H-CREAT, H-QUID, H-WAND, H-ECON, H-POST, H-TRAV, H-HOUSE, H-DISC, H-CLASS, H-SPELL, H-INV, H-HOME, H-TEXT.
- Book B, lore can shape only: H-POT.
- Book B, stay assumed: H-OBST, H-ITEM, H-HIDDEN, H-AGE, H-SOC, H-DAY.
- Book A, tunable but thin (fewer than 10 anchors, so one quantity at most; counted): L-CLUB, L-LAW, L-ETIQ.
- Book B, tunable but thin (fewer than 10 anchors, so one quantity at most; counted): H-WAND, H-ECON, H-POST, H-TRAV, H-DISC, H-CLASS, H-SPELL, H-INV, H-HOME.
- The residue groups (L-MISC, H-MISC) are not systems and are left out of the lists above. L-SIG and L-RARE were not re-derived, so they stay as the demands pass left them.
- Almost every system with a price, wage, time or count in its rows clears the three-anchor bar, because the bar is low and the row sets are large. The class column says anchors exist, not that they are enough to fit a curve. A fit should count anchors per quantity it actually tunes. (judged)
- Tolerance anchors are the thinnest kind in both books. Shapes such as 'too much fails' mostly sit in qualitative prose and need a targeted read before a fit relies on them. (judged)
- Rows are the rule and rule-note passes only. Systems fed mainly by scenes or people rows (for example daily life) are undercounted here. (judged)

The counts say where anchors exist, not whether they agree with each other. A fit still needs a read of the anchors it uses (AD49).

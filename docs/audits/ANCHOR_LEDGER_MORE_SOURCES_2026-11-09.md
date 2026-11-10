# Anchor ledger over more sources, 2026-11-09 (LAYX88)

Extends the [volume 1 and book one ledger](ANCHOR_LEDGER_VOL1_BOOK1_2026-11-09.md) to sources already read but not in it. Labels: counted = script output; sampled = my hand check of rows; inferred = reasoning from those.

## 1. What was run

Script: `anchor-ledger-2026-11-09/build_ledger_sources.py` (rerun: `python3 -I docs/audits/anchor-ledger-2026-11-09/build_ledger_sources.py`). It reuses the volume 1 kind classifier and class rule unchanged by reading `build_ledger.py` without running its main. Rows are the rules and rule-note passes only (counted). Per-row text is in the private gitignored folders; this file holds counts, groups, kinds and handles (`file:line`).

| Source | Files | Rows | Review state |
|---|---|---|---|
| Lord of the Mysteries, volumes 2 to 8 | 1184 | 30060 | unreviewed (reader rows, not source-reviewed; the 10-29 overlays are id aliases and spot checks, not qualification) |
| Lord of the Mysteries, extras (book 9 mapped files) | 30 | 100 | unreviewed |
| Harry Potter, books 2 to 7 | 340 | 7762 | unreviewed |
| Reverend Insanity, volumes 5 to 7 (source-review qualified rows only) | 204 | 5420 | qualified by source review (accepted = supported or corrected; corrected rows use the corrected text) |
| Reverend Insanity, volumes 1 to 4 (unreviewed rules rows) | 256 | 6998 | unreviewed (no rules rows from the volume 1 to 3 gap closeouts exist; those gaps were census, scenes, people and texture) |

Reverend Insanity volumes 5 to 7 (counted): the review overlays `audit-5-rules`, `audit-6-extras` and `audit-7-extras` accept 5420 rows and hold 144 across volumes 5, 6, 7 (accepted {5: 976, 6: 2179, 7: 2265}, held {5: 26, 6: 62, 7: 56}). Accepted plus held equals the rules and rule-note rows on disk per volume ({5: 1002, 6: 2241, 7: 2321}), asserted in the script. Only accepted rows are used. A corrected row is used in its corrected form. Held rows are dropped.

Rows by volume (counted): LOTM {2: 7076, 3: 6393, 4: 5696, 5: 4721, 6: 2996, 7: 2254, 8: 924}; HP {2: 814, 3: 867, 4: 1467, 5: 1635, 6: 1289, 7: 1690}; RI 5 to 7 qualified {5: 976, 6: 2179, 7: 2265}; RI 1 to 4 unreviewed {1: 1403, 2: 1771, 3: 1953, 4: 1871}.

## 2. Lord of the Mysteries, volumes 2 to 8

Review state: unreviewed (reader rows, not source-reviewed; the 10-29 overlays are id aliases and spot checks, not qualification). Same L- groups as the volume 1 ledger (fitted to volume 1).

| System | point | band | order | count/duration | sequence | tolerance | negative | qualitative | total | anchors | anchors per 100 rows | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| L-SUMM | 117 | 183 | 22 | 181 | 674 | 34 | 297 | 913 | 1850 | 481 | 26.0 | tunable |
| L-DIV | 68 | 55 | 15 | 96 | 300 | 13 | 132 | 681 | 1125 | 219 | 19.5 | tunable |
| L-ACT | 4 | 32 | 4 | 45 | 85 | 4 | 26 | 147 | 286 | 81 | 28.3 | tunable |
| L-ADV | 172 | 191 | 48 | 153 | 480 | 39 | 294 | 1984 | 2928 | 516 | 17.6 | tunable |
| L-CTRL | 7 | 14 | 4 | 12 | 52 | 1 | 53 | 103 | 195 | 33 | 16.9 | tunable |
| L-SEAL | 12 | 38 | 8 | 23 | 91 | 8 | 64 | 347 | 503 | 73 | 14.5 | tunable |
| L-CHARM | 4 | 17 | 6 | 31 | 67 | 4 | 31 | 79 | 178 | 52 | 29.2 | tunable |
| L-INV | 36 | 25 | 5 | 27 | 79 | 3 | 36 | 520 | 675 | 88 | 13.0 | tunable |
| L-CLUB | 23 | 13 | 4 | 11 | 21 | 2 | 10 | 158 | 218 | 47 | 21.6 | tunable |
| L-ORG | 65 | 73 | 32 | 78 | 200 | 13 | 103 | 988 | 1404 | 216 | 15.4 | tunable |
| L-LAW | 7 | 22 | 3 | 29 | 46 | 3 | 69 | 188 | 312 | 58 | 18.6 | tunable |
| L-EDU | 17 | 21 | 1 | 27 | 37 | 2 | 16 | 181 | 267 | 65 | 24.3 | tunable |
| L-TRAIN | 45 | 30 | 6 | 25 | 98 | 4 | 31 | 498 | 667 | 100 | 15.0 | tunable |
| L-TRAV | 59 | 125 | 9 | 80 | 157 | 2 | 50 | 558 | 900 | 264 | 29.3 | tunable |
| L-HOME | 58 | 36 | 3 | 37 | 59 | 1 | 30 | 323 | 483 | 131 | 27.1 | tunable |
| L-ECON | 935 | 435 | 65 | 266 | 675 | 33 | 358 | 2903 | 4942 | 1636 | 33.1 | tunable |
| L-SPIR | 27 | 32 | 7 | 42 | 131 | 4 | 95 | 381 | 625 | 101 | 16.2 | tunable |
| L-POWER | 32 | 87 | 29 | 94 | 288 | 21 | 165 | 771 | 1263 | 213 | 16.9 | tunable |
| L-ETIQ | 6 | 10 | 4 | 35 | 51 | 1 | 14 | 224 | 309 | 51 | 16.5 | tunable |
| L-TEXT | 114 | 732 | 12 | 884 | 457 | 6 | 62 | 1091 | 2674 | 1730 | 64.7 | tunable |
| L-DAY | 91 | 33 | 2 | 24 | 157 | 4 | 65 | 432 | 695 | 148 | 21.3 | tunable |
| L-SIG | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | not re-derived |
| L-RARE | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | not re-derived |
| L-MISC | 274 | 350 | 37 | 88 | 409 | 22 | 290 | 6305 | 7561 | 712 | 9.4 | tunable |

Headline (counted): 22 tunable, 0 shape only, 0 assumed, 2 not found or not re-derived. Residue group L-MISC holds 25% of rows; the largest real group is L-ECON at 16% (counted fit check).

Class after weighting point, order, tolerance and negative by this source's sampled hit rates (other kinds at 1.0): no change.

Example handles (counted; drawn from rows with a point, band or count where any exist):

- L-SUMM: lotm4c203_rules:9, lotm3c091_rules:5, lotm4c099_rules:3, lotm3c079_rules:3, lotm6c097_rules:7
- L-DIV: lotm2c011_rules:14, lotm4c117_rules:12, lotm7c053_rules:13, lotm2c009_rules_other:1, lotm3c083_rules_other:8
- L-ACT: lotm6c043_rules:3, lotm2c197_rules_other:46, lotm3c003_rules_other:22, lotm2c193_rules:2, lotm2c229_rules_other:49
- L-ADV: lotm4c097_rules:15, lotm4c057_rules_other:51, lotm3c153_rules_other:2, lotm6c039_rules:1, lotm4c093_rules_other:11
- L-CTRL: lotm2c201_rules:1, lotm3c129_rules:3, lotm2c213_rules:10, lotm2c151_rules_other:8, lotm4c097_rules:14
- L-SEAL: lotm7c073_rules:2, lotm7c085_rules:2, lotm4c015_rules_other:9, lotm2c103_rules:4, lotm2c205_rules:10
- L-CHARM: lotm5c043_rules:10, lotm5c179_rules:7, lotm4c171_rules:1, lotm4c209_rules:13, lotm4c133_rules_other:33
- L-INV: lotm2c015_rules:12, lotm2c217_rules_other:3, lotm6c097_rules:10, lotm4c079_rules_other:29, lotm2c029_rules:7
- L-CLUB: lotm5c147_rules:10, lotm4c119_rules:3, lotm7c011_rules_other:4, lotm5c069_rules_other:29, lotm2c041_rules:8
- L-ORG: lotm5c061_rules:12, lotm2c221_rules_other:49, lotm4c095_rules:16, lotm2c037_rules_other:45, lotm2c211_rules:5
- L-LAW: lotm3c003_rules:3, lotm5c157_rules_other:12, lotm3c237_rules:8, lotm7c081_rules:10, lotm7c021_rules:7
- L-EDU: lotm2c001_rules:5, lotm2c129_rules_other:57, lotm2c119_rules_other:31, lotm4c043_rules_other:31, lotm4c025_rules_other:13
- L-TRAIN: lotm2c095_rules:10, lotm4c077_rules_other:2, lotm3c225_rules_other:1, lotm4c011_rules_other:11, lotm3c193_rules:9
- L-TRAV: lotm3c235_rules:1, lotm3c173_rules:10, lotm4c059_rules:1, lotm2c029_rules_other:17, lotm4c013_rules_other:19
- L-HOME: lotm6c015_rules_other:46, lotm4c005_rules:3, lotm4c107_rules_other:15, lotm3c117_rules_other:32, lotm4c129_rules:6
- L-ECON: lotm6c063_rules:3, lotm6c009_rules_other:3, lotm3c221_rules_other:40, lotm2c183_rules_other:44, lotm3c131_rules_other:6
- L-SPIR: lotm3c187_rules:1, lotm4c149_rules:2, lotm5c183_rules:1, lotm6c065_rules_other:16, lotm3c195_rules:1
- L-POWER: lotm5c035_rules:8, lotm5c127_rules:4, lotm2c145_rules_other:35, lotm7c073_rules:4, lotm4c093_rules:16
- L-ETIQ: lotm4c097_rules:8, lotm3c181_rules_other:18, lotm4c095_rules_other:35, lotm4c031_rules_other:15, lotm2c043_rules:8
- L-TEXT: lotm2c083_rules_other:18, lotm4c027_rules_other:6, lotm3c115_rules_other:10, lotm5c177_rules_other:35, lotm5c047_rules_other:44
- L-DAY: lotm4c051_rules:1, lotm2c139_rules_other:23, lotm2c073_rules:2, lotm4c095_rules:12, lotm2c263_rules:8
- L-MISC: lotm2c047_rules_other:63, lotm4c197_rules_other:29, lotm7c081_rules_other:45, lotm3c153_rules_other:47, lotm3c183_rules_other:11

## 2. Lord of the Mysteries, extras (book 9 mapped files)

Review state: unreviewed. Small row set; classes are noisy.

| System | point | band | order | count/duration | sequence | tolerance | negative | qualitative | total | anchors | anchors per 100 rows | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| L-SUMM | 0 | 0 | 0 | 1 | 2 | 0 | 2 | 2 | 7 | 1 | 14.3 | shape only |
| L-DIV | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 1 | 2 | 0 | 0.0 | assumed |
| L-ACT | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 1 | 0 | 0.0 | assumed |
| L-ADV | 0 | 0 | 0 | 1 | 1 | 0 | 1 | 3 | 6 | 1 | 16.7 | assumed |
| L-CTRL | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 0.0 | assumed |
| L-SEAL | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  | not found |
| L-CHARM | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  | not found |
| L-INV | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 5 | 6 | 1 | 16.7 | assumed |
| L-CLUB | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  | not found |
| L-ORG | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 8 | 10 | 0 | 0.0 | assumed |
| L-LAW | 0 | 1 | 0 | 1 | 0 | 0 | 0 | 3 | 5 | 2 | 40.0 | assumed |
| L-EDU | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 0.0 | assumed |
| L-TRAIN | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  | not found |
| L-TRAV | 0 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 2 | 0 | 0.0 | assumed |
| L-HOME | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 0.0 | assumed |
| L-ECON | 1 | 0 | 0 | 2 | 4 | 1 | 4 | 3 | 11 | 3 | 27.3 | tunable |
| L-SPIR | 0 | 0 | 1 | 0 | 6 | 1 | 2 | 3 | 9 | 0 | 0.0 | shape only |
| L-POWER | 0 | 1 | 0 | 2 | 4 | 1 | 2 | 6 | 12 | 3 | 25.0 | tunable |
| L-ETIQ | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 0 | 2 | 0 | 0.0 | assumed |
| L-TEXT | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 1 | 0 | 0.0 | assumed |
| L-DAY | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 2 | 3 | 0 | 0.0 | assumed |
| L-SIG | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | not re-derived |
| L-RARE | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | not re-derived |
| L-MISC | 1 | 0 | 0 | 1 | 2 | 0 | 0 | 17 | 20 | 2 | 10.0 | assumed |

Headline (counted): 2 tunable, 2 shape only, 14 assumed, 6 not found or not re-derived. Residue group L-MISC holds 20% of rows; the largest real group is L-POWER at 12% (counted fit check).

Class after weighting point, order, tolerance and negative by this source's sampled hit rates (other kinds at 1.0): changes for L-ECON (tunable to shape only).

Example handles (counted; drawn from rows with a point, band or count where any exist):

- L-SUMM: lotmxc007L_rules:4
- L-DIV: lotmxc040L_rules:6, lotmxc001L_rules:8
- L-ACT: lotmxc019L_rules_other:3
- L-ADV: lotmxc040L_rules_other:1
- L-CTRL: lotmxc016L_rules:4
- L-INV: lotmxc007L_rules:2
- L-ORG: lotmxc040L_rules:2, lotmxc010L_rules:5, lotmxc040L_rules:9, lotmxc001L_rules:13, lotmxc019L_rules:8
- L-LAW: lotmxc016L_rules:3, lotmxc001L_rules:6
- L-EDU: lotmxc037L_rules:2
- L-TRAV: lotmxc022L_rules:5, lotmxc022L_rules:3
- L-HOME: lotmxc016L_rules_other:1
- L-ECON: lotmxc040L_rules:5, lotmxc037L_rules:1, lotmxc040L_rules_other:2
- L-SPIR: lotmxc025L_rules:1, lotmxc010L_rules:3, lotmxc013L_rules:3, lotmxc013L_rules:8, lotmxc043L_rules:2
- L-POWER: lotmxc040L_rules:4, lotmxc022L_rules:1
- L-ETIQ: lotmxc004L_rules:3, lotmxc022L_rules:2
- L-TEXT: lotmxc013L_rules:2
- L-DAY: lotmxc010L_rules_other:1, lotmxc019L_rules:7, lotmxc010L_rules:1
- L-MISC: lotmxc016L_rules:1, lotmxc010L_rules_other:4

## 2. Harry Potter, books 2 to 7

Review state: unreviewed. Same H- groups as the book one ledger (fitted to book one).

| System | point | band | order | count/duration | sequence | tolerance | negative | qualitative | total | anchors | anchors per 100 rows | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| H-CREAT | 18 | 20 | 3 | 27 | 53 | 2 | 43 | 232 | 344 | 65 | 18.9 | tunable |
| H-QUID | 36 | 25 | 3 | 27 | 58 | 4 | 35 | 222 | 353 | 88 | 24.9 | tunable |
| H-WAND | 14 | 11 | 4 | 26 | 94 | 5 | 75 | 263 | 440 | 51 | 11.6 | tunable |
| H-POT | 10 | 17 | 0 | 18 | 37 | 4 | 23 | 98 | 169 | 45 | 26.6 | tunable |
| H-ECON | 45 | 7 | 1 | 14 | 21 | 0 | 18 | 172 | 262 | 66 | 25.2 | tunable |
| H-POST | 1 | 6 | 1 | 13 | 21 | 1 | 9 | 61 | 98 | 20 | 20.4 | tunable |
| H-TRAV | 3 | 13 | 2 | 12 | 40 | 2 | 16 | 79 | 142 | 28 | 19.7 | tunable |
| H-OBST | 5 | 2 | 1 | 18 | 33 | 1 | 28 | 125 | 189 | 25 | 13.2 | tunable |
| H-ITEM | 9 | 16 | 1 | 20 | 34 | 2 | 38 | 185 | 273 | 45 | 16.5 | tunable |
| H-HOUSE | 42 | 11 | 2 | 32 | 58 | 4 | 36 | 233 | 374 | 85 | 22.7 | tunable |
| H-DISC | 5 | 7 | 0 | 16 | 28 | 1 | 48 | 141 | 222 | 28 | 12.6 | tunable |
| H-CLASS | 8 | 5 | 5 | 40 | 73 | 3 | 25 | 218 | 337 | 53 | 15.7 | tunable |
| H-SPELL | 16 | 22 | 7 | 33 | 93 | 9 | 93 | 347 | 559 | 71 | 12.7 | tunable |
| H-HIDDEN | 9 | 10 | 1 | 12 | 20 | 1 | 16 | 152 | 211 | 31 | 14.7 | tunable |
| H-INV | 0 | 3 | 0 | 3 | 5 | 1 | 1 | 55 | 65 | 6 | 9.2 | tunable |
| H-AGE | 4 | 3 | 0 | 7 | 9 | 0 | 8 | 70 | 96 | 14 | 14.6 | tunable |
| H-HOME | 2 | 6 | 3 | 19 | 22 | 2 | 5 | 100 | 144 | 27 | 18.8 | tunable |
| H-SOC | 0 | 1 | 0 | 3 | 7 | 1 | 4 | 23 | 35 | 4 | 11.4 | tunable |
| H-TEXT | 17 | 190 | 10 | 364 | 197 | 8 | 21 | 455 | 1062 | 571 | 53.8 | tunable |
| H-DAY | 5 | 5 | 0 | 4 | 34 | 2 | 11 | 117 | 162 | 14 | 8.6 | tunable |
| H-MISC | 113 | 100 | 9 | 33 | 141 | 16 | 122 | 1767 | 2225 | 246 | 11.1 | tunable |

Headline (counted): 21 tunable, 0 shape only, 0 assumed, 0 not found or not re-derived. Residue group H-MISC holds 29% of rows; the largest real group is H-TEXT at 14% (counted fit check).

Class after weighting point, order, tolerance and negative by this source's sampled hit rates (other kinds at 1.0): no change.

Example handles (counted; drawn from rows with a point, band or count where any exist):

- H-CREAT: hp4c020_rules_other:46, hp6c005_rules_other:16, hp5c014_rules:6, hp7c006_rules:9, hp4c031_rules_other:42
- H-QUID: hp4c018_rules_other:15, hp5c017_rules_other:5, hp3c009_rules_other:33, hp4c013_rules:3, hp3c013_rules_other:19
- H-WAND: hp5c024_rules:4, hp4c018_rules_other:54, hp7c026_rules_other:16, hp5c004_rules:7, hp6c011_rules:2
- H-POT: hp6c009_rules:3, hp6c020_rules_other:37, hp7c012_rules:6, hp4c036_rules:2, hp2c009_rules:4
- H-ECON: hp6c020_rules_other:24, hp4c017_rules_other:2, hp3c001_rules_other:34, hp2c005_rules_other:15, hp3c013_rules_other:28
- H-POST: hp2c014_rules:1, hp6c020_rules:4, hp6c002_rules_other:4, hp5c015_rules:8, hp3c014_rules:7
- H-TRAV: hp4c010_rules_other:24, hp4c026_rules_other:36, hp6c007_rules:4, hp4c005_rules:5, hp6c030_rules_other:12
- H-OBST: hp7c005_rules:1, hp3c019_rules:5, hp2c018_rules_other:3, hp2c017_rules_other:2, hp7c005_rules_other:1
- H-ITEM: hp5c038_rules_other:16, hp4c023_rules:3, hp6c006_rules:9, hp7c019_rules:1, hp3c010_rules_other:28
- H-HOUSE: hp2c018_rules_other:11, hp4c021_rules_other:15, hp3c013_rules:4, hp2c010_rules_other:22, hp4c003_rules_other:3
- H-DISC: hp5c005_rules_other:32, hp6c015_rules:8, hp6c012_rules:11, hp6c024_rules:7, hp7c005_rules_other:10
- H-CLASS: hp5c012_rules_other:44, hp4c024_rules_other:1, hp4c032_rules_other:22, hp4c009_rules_other:19, hp5c012_rules_other:15
- H-SPELL: hp5c002_rules_other:19, hp7c003_rules_other:26, hp5c008_rules:2, hp7c022_rules_other:15, hp2c001_rules_other:31
- H-HIDDEN: hp5c002_rules_other:12, hp5c022_rules:12, hp4c013_rules:15, hp7c012_rules_other:17, hp4c007_rules_other:5
- H-INV: hp2c013_rules_other:41, hp6c005_rules:5, hp7c011_rules_other:10, hp3c013_rules_other:3, hp3c010_rules_other:3
- H-AGE: hp5c011_rules_other:18, hp2c001_rules_other:17, hp4c001_rules_other:36, hp6c023_rules_other:35, hp7c014_rules_other:6
- H-HOME: hp4c001_rules_other:37, hp5c001_rules_other:18, hp7c006_rules_other:4, hp7c010_rules_other:38, hp5c037_rules_other:19
- H-SOC: hp7c001_rules_other:53, hp6c016_rules_other:14, hp3c006_rules:6, hp7c001_rules_other:37
- H-TEXT: hp3c004_rules_other:14, hp5c005_rules_other:26, hp4c019_rules_other:15, hp6c017_rules_other:21, hp6c006_rules:3
- H-DAY: hp7c030_rules:11, hp3c011_rules:9, hp3c014_rules_other:8, hp5c033_rules_other:15, hp7c019_rules_other:2
- H-MISC: hp4c021_rules_other:38, hp4c026_rules_other:29, hp7c034_rules_other:6, hp3c011_rules_other:27, hp4c001_rules_other:33

## 2. Reverend Insanity, volumes 5 to 7 (source-review qualified rows only)

Review state: qualified by source review (accepted = supported or corrected; corrected rows use the corrected text). New R- groups written for this world; point regex extended (see report).

| System | point | band | order | count/duration | sequence | tolerance | negative | qualitative | total | anchors | anchors per 100 rows | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R-REFINE | 102 | 59 | 16 | 53 | 96 | 12 | 72 | 204 | 425 | 214 | 50.4 | tunable |
| R-FEED | 10 | 4 | 0 | 7 | 13 | 2 | 9 | 34 | 61 | 21 | 34.4 | tunable |
| R-KILLER | 41 | 36 | 10 | 22 | 69 | 5 | 38 | 77 | 176 | 99 | 56.2 | tunable |
| R-APERT | 47 | 41 | 7 | 20 | 53 | 2 | 49 | 206 | 360 | 108 | 30.0 | tunable |
| R-RANK | 141 | 33 | 15 | 41 | 69 | 8 | 43 | 206 | 431 | 215 | 49.9 | tunable |
| R-TRADE | 39 | 18 | 3 | 10 | 34 | 5 | 25 | 131 | 216 | 67 | 31.0 | tunable |
| R-ECON | 50 | 12 | 6 | 17 | 30 | 0 | 11 | 102 | 184 | 79 | 42.9 | tunable |
| R-INHER | 76 | 38 | 16 | 53 | 63 | 6 | 63 | 294 | 491 | 167 | 34.0 | tunable |
| R-BLOOD | 14 | 5 | 3 | 12 | 19 | 1 | 21 | 109 | 159 | 31 | 19.5 | tunable |
| R-CLAN | 42 | 34 | 15 | 23 | 50 | 7 | 35 | 164 | 293 | 99 | 33.8 | tunable |
| R-COMBAT | 140 | 101 | 14 | 65 | 148 | 8 | 64 | 427 | 768 | 306 | 39.8 | tunable |
| R-IMMORT | 78 | 53 | 5 | 58 | 78 | 8 | 70 | 336 | 547 | 189 | 34.6 | tunable |
| R-GUUSE | 83 | 48 | 13 | 36 | 106 | 8 | 52 | 220 | 447 | 167 | 37.4 | tunable |
| R-TIME | 151 | 77 | 0 | 128 | 79 | 2 | 12 | 99 | 345 | 356 | 103.2 | tunable |
| R-MISC | 76 | 63 | 8 | 24 | 1 | 2 | 28 | 350 | 517 | 163 | 31.5 | tunable |

Headline (counted): 15 tunable, 0 shape only, 0 assumed, 0 not found or not re-derived. Residue group R-MISC holds 10% of rows; the largest real group is R-COMBAT at 14% (counted fit check).

Point-regex extension for this source (counted): added {'point': 726} rows beyond the volume 1 classifier.

Class after weighting point, order, tolerance and negative by this source's sampled hit rates (other kinds at 1.0): no change.

Example handles (counted; drawn from rows with a point, band or count where any exist):

- R-REFINE: ri6c572_rules:1, ri7c665_rules_other:55, ri7c662_rules_other:25, ri5c496_rules:4, ri6c555_rules_other:1
- R-FEED: ri7c677_rules:19, ri5c410_rules:2, ri7c635_rules:4, ri7c680_rules:3, ri6c561_rules_other:8
- R-KILLER: ri6c546_rules:7, ri7c674_rules:11, ri5c429_rules:20, ri7c668_rules_other:32, ri6c581_rules:1
- R-APERT: ri7c629_rules:1, ri5c496_rules:7, ri6c575_rules_other:8, ri5c444_rules:5, ri7c632_rules:13
- R-RANK: ri7c674_rules_other:78, ri6c561_rules_other:36, ri7c698_rules:19, ri6c561_rules_other:6, ri7c668_rules_other:12
- R-TRADE: ri5c450_rules_other:1, ri5c475_rules:12, ri5c413_rules_other:9, ri7c665_rules_other:28, ri6c549_rules_other:16
- R-ECON: ri6c519_rules_other:32, ri6c569_rules:1, ri5c417_rules_other:3, ri6c575_rules_other:13, ri6c569_rules:12
- R-INHER: ri6c555_rules_other:10, ri7c615_rules:2, ri6c597_rules_other:9, ri7c601_rules_other:29, ri6c558_rules:4
- R-BLOOD: ri6c567_rules:15, ri5c423_rules:3, ri6c581_rules:20, ri6c587_rules:1, ri7c659_rules_other:7
- R-CLAN: ri6c590_rules_other:30, ri7c689_rules_other:46, ri7c695_rules:8, ri5c499_rules:13, ri6c522_rules_other:1
- R-COMBAT: ri6c513_rules:6, ri5c420_rules:19, ri5c447_rules:9, ri6c516_rules_other:85, ri7c609_rules_other:14
- R-IMMORT: ri7c601_rules:18, ri5c413_rules:3, ri6c569_rules_other:84, ri7c623_rules_other:9, ri5c481_rules_other:12
- R-GUUSE: ri5c447_rules:6, ri5c444_rules:13, ri6c564_rules_other:27, ri6c501_rules_other:28, ri6c531_rules:11
- R-TIME: ri7c680_rules_other:76, ri6c567_rules_other:23, ri6c516_rules_other:89, ri7c668_rules_other:41, ri7c612_rules_other:1
- R-MISC: ri6c581_rules_other:57, ri6c594_rules_other:36, ri7c626_rules_other:48, ri6c578_rules_other:15, ri7c689_rules_other:18

## 2. Reverend Insanity, volumes 1 to 4 (unreviewed rules rows)

Review state: unreviewed (no rules rows from the volume 1 to 3 gap closeouts exist; those gaps were census, scenes, people and texture). Same R- groups.

| System | point | band | order | count/duration | sequence | tolerance | negative | qualitative | total | anchors | anchors per 100 rows | Class |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R-REFINE | 115 | 58 | 10 | 55 | 96 | 9 | 70 | 174 | 386 | 228 | 59.1 | tunable |
| R-FEED | 32 | 15 | 1 | 23 | 15 | 2 | 6 | 43 | 95 | 70 | 73.7 | tunable |
| R-KILLER | 6 | 3 | 0 | 3 | 8 | 1 | 7 | 2 | 13 | 12 | 92.3 | tunable |
| R-APERT | 127 | 49 | 14 | 57 | 82 | 6 | 60 | 334 | 572 | 233 | 40.7 | tunable |
| R-RANK | 220 | 40 | 19 | 53 | 54 | 4 | 46 | 348 | 649 | 313 | 48.2 | tunable |
| R-TRADE | 90 | 29 | 5 | 41 | 45 | 2 | 28 | 194 | 350 | 160 | 45.7 | tunable |
| R-ECON | 209 | 68 | 8 | 34 | 33 | 9 | 21 | 214 | 485 | 311 | 64.1 | tunable |
| R-INHER | 67 | 50 | 7 | 49 | 53 | 2 | 43 | 203 | 370 | 166 | 44.9 | tunable |
| R-BLOOD | 32 | 18 | 2 | 16 | 21 | 1 | 13 | 145 | 202 | 66 | 32.7 | tunable |
| R-CLAN | 147 | 53 | 15 | 95 | 102 | 8 | 88 | 516 | 836 | 295 | 35.3 | tunable |
| R-COMBAT | 163 | 91 | 18 | 98 | 164 | 10 | 108 | 489 | 901 | 352 | 39.1 | tunable |
| R-IMMORT | 53 | 16 | 5 | 36 | 30 | 3 | 33 | 179 | 288 | 105 | 36.5 | tunable |
| R-GUUSE | 160 | 80 | 21 | 88 | 122 | 13 | 113 | 404 | 759 | 328 | 43.2 | tunable |
| R-TIME | 250 | 84 | 9 | 224 | 94 | 1 | 10 | 143 | 505 | 558 | 110.5 | tunable |
| R-MISC | 101 | 67 | 12 | 22 | 1 | 2 | 14 | 401 | 587 | 190 | 32.4 | tunable |

Headline (counted): 15 tunable, 0 shape only, 0 assumed, 0 not found or not re-derived. Residue group R-MISC holds 8% of rows; the largest real group is R-COMBAT at 13% (counted fit check).

Point-regex extension for this source (counted): added {'point': 1252} rows beyond the volume 1 classifier.

Class after weighting point, order, tolerance and negative by this source's sampled hit rates (other kinds at 1.0): no change.

Example handles (counted; drawn from rows with a point, band or count where any exist):

- R-REFINE: ri2c146_rules_other:25, ri1c008_rules_other:39, ri4c356_rules:5, ri2c155_rules_other:17, ri2c161_rules:1
- R-FEED: ri1c099_rules_other:36, ri1c080_rules:4, ri1c039_rules:4, ri3c207_rules_other:21, ri1c068_rules:4
- R-KILLER: ri4c313_rules:2, ri4c313_rules:3, ri4c392_rules:3, ri4c389_rules:2, ri4c392_rules:2
- R-APERT: ri4c377_rules:2, ri2c164_rules:8, ri3c237_rules_other:13, ri2c176_rules_other:15, ri2c185_rules_other:15
- R-RANK: ri1c057_rules_other:20, ri3c255_rules_other:46, ri1c039_rules_other:43, ri4c398_rules_other:25, ri3c291_rules_other:58
- R-TRADE: ri3c261_rules_other:36, ri4c307_rules_other:33, ri2c143_rules:11, ri1c072_rules_other:4, ri3c279_rules_other:32
- R-ECON: ri1c080_rules_other:52, ri3c231_rules_other:54, ri3c243_rules_other:18, ri4c326_rules_other:43, ri4c319_rules_other:60
- R-INHER: ri4c336_rules:6, ri4c356_rules_other:23, ri4c350_rules:3, ri4c368_rules_other:4, ri3c222_rules:12
- R-BLOOD: ri2c182_rules_other:2, ri3c210_rules_other:36, ri1c050_rules_other:23, ri2c155_rules_other:28, ri1c008_rules_other:33
- R-CLAN: ri3c237_rules_other:12, ri4c316_rules_other:6, ri4c319_rules_other:9, ri3c213_rules_other:32, ri1c072_rules:1
- R-COMBAT: ri4c319_rules_other:49, ri3c204_rules:14, ri3c204_rules_other:6, ri1c092_rules_other:10, ri3c219_rules:5
- R-IMMORT: ri2c182_rules:6, ri4c392_rules:5, ri2c146_rules_other:43, ri4c313_rules_other:29, ri3c279_rules:13
- R-GUUSE: ri3c300_rules:7, ri3c210_rules:5, ri4c343_rules_other:43, ri3c270_rules:4, ri3c273_rules_other:65
- R-TIME: ri3c234_rules_other:15, ri1c004_rules_other:21, ri2c125_rules:15, ri3c285_rules_other:35, ri4c316_rules_other:9
- R-MISC: ri4c316_rules_other:17, ri4c333_rules_other:6, ri3c213_rules_other:44, ri4c389_rules_other:13, ri3c255_rules_other:34

## 3. Where the anchors are, per source (counted)

- Lord of the Mysteries, volumes 2 to 8: most point, band and count anchors: L-TEXT 1730 of 2674 rows; L-ECON 1636 of 4942 rows; L-ADV 516 of 2928 rows; L-SUMM 481 of 1850 rows. Densest (20 or more rows): L-TEXT 65 per 100; L-ECON 33 per 100; L-TRAV 29 per 100. No anchors: none.
- Lord of the Mysteries, extras (book 9 mapped files): most point, band and count anchors: L-ECON 3 of 11 rows; L-POWER 3 of 12 rows; L-LAW 2 of 5 rows; L-SUMM 1 of 7 rows. Densest (20 or more rows): . No anchors: L-DIV, L-ACT, L-CTRL, L-ORG, L-EDU, L-TRAV, L-HOME, L-SPIR, L-ETIQ, L-TEXT, L-DAY.
- Harry Potter, books 2 to 7: most point, band and count anchors: H-TEXT 571 of 1062 rows; H-QUID 88 of 353 rows; H-HOUSE 85 of 374 rows; H-SPELL 71 of 559 rows. Densest (20 or more rows): H-TEXT 54 per 100; H-POT 27 per 100; H-ECON 25 per 100. No anchors: none.
- Reverend Insanity, volumes 5 to 7 (source-review qualified rows only): most point, band and count anchors: R-TIME 356 of 345 rows; R-COMBAT 306 of 768 rows; R-RANK 215 of 431 rows; R-REFINE 214 of 425 rows. Densest (20 or more rows): R-TIME 103 per 100; R-KILLER 56 per 100; R-REFINE 50 per 100. No anchors: none.
- Reverend Insanity, volumes 1 to 4 (unreviewed rules rows): most point, band and count anchors: R-TIME 558 of 505 rows; R-COMBAT 352 of 901 rows; R-GUUSE 328 of 759 rows; R-RANK 313 of 649 rows. Densest (20 or more rows): R-TIME 110 per 100; R-FEED 74 per 100; R-ECON 64 per 100. No anchors: none.

## 4. Sampled precision (sampled)

Hits over sample, read by hand. Seed and sample size are in `precision_sources.json`. Kinds not listed were not sampled.

| Kind | LOTM v2-8 | LOTM extras | HP 2-7 | RI 5-7 qualified | RI 1-4 unreviewed |
|---|---|---|---|---|---|
| point | 10/10 | 1/2 (second row was a structured-quantity case with no text to judge) | 9/10 | 8/9 (one structured-quantity row not judgeable) | 8/10 |
| order | 5/10 | 1/1 | 6/10 | 10/10 | 9/10 |
| tolerance | 3/10 | 0/5 | 2/10 | 5/10 | 5/10 |
| negative | 9/10 | 7/10 | 6/10 | 10/10 | 9/10 |

- point misses: RI 1-4: rank labels such as 'number one Rank two' and 'Rank five Gu Masters' trip the unit list (rank, grade); HP: a house-elf row matched 'house' as a unit.
- order misses: LOTM and HP: 'exceeds', 'lower tier', 'faster than expected' and 'fewer than N' used for bounds, labels or expectations rather than two things compared.
- tolerance: Poor everywhere. Most hits were 'exact', 'precise' or 'too' used for 'exact range not stated', 'too late' or 'barely'. Real thresholds ('too few fails', 'too small to condense') are the minority. Treat tolerance counts as unreliable, as in the volume 1 ledger (4/15).
- negative: HP misses: hypothetical 'fail', 'lost track', 'never visited', 'no longer made'.
- sample size: 10 per kind (fewer where fewer rows exist), so each rate has a wide interval; a one-row difference moves it 10 points.
- recall (counted probe): RI: rows naming percent, primeval stones, jin, li or zhang with no point or band after the extension: 115 of 5,420 (qualified) and 296 of 6,998 (volumes 1-4). The sample rows seen were 'primeval stone' with no number, so the real misses are small. Recall of the other kinds was not measured.

## 5. Missing or not found

- LOTM volumes 2 to 8: all seven volumes found (lotm2c... to lotm8c..., 1,184 rules and rule-note files in lead-run-2026-10-27). Nothing missing.
- LOTM extras: the book 9 mapped files are in lead-run-extras-2026-10-30 (lotmxc...L_rules*.jsonl), 30 files and 100 rows. The other extras folders in lead-run-2026-10-27 (x1 to x4) hold mapping notes, not rules rows.
- Harry Potter books 2 to 7: all six found in lead-run-2026-10-28 (hp2c... to hp7c..., 340 files). Nothing missing.
- Reverend Insanity volumes 5 to 7: rows are in lead-run-2026-10-29 (volume 5) and lead-run-2026-10-29/claude-6-7 (volumes 6 and 7). Review overlays are in lead-run-2026-10-29/ri-5-7-review (audit-5-rules, audit-6-extras, audit-7-extras). The overlay for volumes 6 and 7 rules sits in the 'extras' audits, not a rules-named audit.
- Reverend Insanity volumes 1 to 3 gap rows: there are none for the rules pass. The gap closeouts were ri1 census, ri2 scenes and people, ri3 people and texture (audit-5-core). No rules rows from the gaps were reviewed, so none are in the qualified set. Instead the existing volume 1 to 4 rules rows (6,998) are run as a separate unreviewed source. Volume 4 is outside the ask and included only because its rules files sit beside volumes 1 to 3.
- Not found: any review overlay for LOTM 2-8, HP 2-7 or RI 1-4 rules rows. The LOTM reviewed-rows folder holds targeted spot reviews and an id alias map, not qualification of these rows.

## 6. Findings

- AM1 (counted): the class column no longer separates systems. LOTM v2-8 has 22 of 22 re-derived groups tunable, HP 2-7 has 21 of 21, RI has 15 of 15 in both sets. In the volume 1 ledger HP had 7 non-tunable systems; at 10 times the rows all of them clear the bar. Use anchors per 100 rows and the quantity a fit needs, not the class.
- AM2 (counted): anchor density is lower in the later LOTM volumes and HP books than in volume 1 and book one. All rows: LOTM v2-8 23.3 point, band or count anchors per 100 rows against 37.0 in volume 1; HP 2-7 20.4 against 25.6. Inferred: the later passes record more prose-like notes per row; not checked.
- AM3 (counted): the densest groups in every source are the time groups (L-TEXT 65 per 100, H-TEXT 54, R-TIME 103 and 111). These are durations and dates, so they feed schedules, not the systems. Among system groups, LOTM is densest in L-ECON (1,636 anchors, 33 per 100: prices, wages, money), L-TRAV and L-CHARM (29 per 100). HP is densest in H-POT and H-ECON (about 26 per 100) and H-QUID (25). RI qualified is densest in R-KILLER (56 per 100, 99 anchors), R-REFINE (50 per 100, 214 anchors) and R-RANK (50 per 100, 215 anchors), then R-ECON (43 per 100).
- AM4 (counted): thinnest systems with at least 20 rows. LOTM: L-INV (13 per 100) and L-SEAL (14.5), L-CTRL (195 rows, 33 anchors). HP: H-INV (65 rows, 6 anchors), H-DAY (8.6 per 100), H-WAND (11.6 per 100, 51 anchors on 440 rows). RI qualified: R-BLOOD (19.5 per 100, 31 anchors) and R-FEED (61 rows, 21 anchors). No re-derived group has zero anchors in any of the four large sets.
- AM5 (counted, inferred reading): Reverend Insanity volumes 5-7 carry far more quantity per row than LOTM or HP (42.1 per 100 across all rows against 23.3 and 20.4) and the sampled order and negative precision is 10/10 on both. Part of the density is my point-regex extension (726 added rows, point only, sampled 8/9 for point after the extension); without it the gap shrinks but was not recomputed. Gu refinement, rank advancement, killer moves and aperture and essence all have 100 or more anchors in volumes 5-7, so these are the best-anchored RI systems for fitting.
- AM6 (counted): R-FEED is thin in volumes 5-7 (61 rows, 21 anchors, 34 per 100) against volumes 1-4 (95 rows, 70 anchors, 74 per 100). R-KILLER is the reverse: 13 rows in volumes 1-4 and 176 in 5-7. Inferred: Gu upkeep is set up early and killer moves arrive later. For feeding and upkeep, tune from volumes 1-4 rows only after a source review; those are unreviewed.
- AM7 (sampled): tolerance is unusable again: 3/10 LOTM, 2/10 HP, 5/10 RI, 0/5 extras (volume 1 was 4/15). Order is good for RI (10/10 and 9/10) and poor for LOTM (5/10) and HP (6/10). The adjusted-class column barely moves because the class bar is low; the extras source flips ECON to shape only, but it has 100 rows.
- AM8 (counted): L-MISC is 25% and H-MISC 29% of rows, because the v1 keyword lists were fitted to volume 1 and book one. The new RI groups leave 9.5%. For LOTM and HP, group counts in later volumes undercount systems the v1 lists do not name; the MISC rows still hold 712 (LOTM) and 246 (HP) anchors.

## 7. Limits

- Groups are keyword lists, first match wins, so a row sits in one group. The RI groups are broad: R-IMMORT, R-GUUSE and R-COMBAT catch many words, and R-COMBAT is the largest group at 14% (counted). Group sizes are not system sizes.
- Kinds are regex heuristics on row text. Sampling covered point, order, tolerance and negative only, 10 rows each. Band, count or duration and sequence were not sampled, and recall was not measured except a probe on RI quantity words.
- LOTM, extras, HP and RI 1-4 rows are unreviewed reader output. Only RI 5-7 rows passed a source review, and a corrected row was counted in its corrected form. The review checks claims against the source; it does not check that a row is useful for tuning.
- Only rules and rule-note rows are counted, not scenes, people, texture or census. Systems fed mainly by those passes are undercounted.
- The point-regex extension (percent signs, RI currency and measure words) applies to RI only. LOTM and HP use the exact volume 1 classifier, so their counts compare to the committed ledger. The RI densities are not strictly comparable to them.
- Counts say where anchors exist, not whether they agree with each other or are enough for a fit (AD49). Private per-row files: docs/research/novels/<source>/private/anchor-ledger-2026-11-09/rows_classified_<tag>.jsonl.


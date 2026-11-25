# Grammar canon measurement, 2026-11-24

Findings, not decisions. Measured at `8f118edbe` with
`node scripts/grammar_canon_effects.mjs` and `node scripts/grammar_canon_gu.mjs`
(both exit 0, under one second). The target is MS2 in the
[procedural foundation plan](../PROCEDURAL_FOUNDATION_PLAN.md): held-out rebuild
rate of 70% (a dial).

## Numbers

| Measure | Gu | Hogwarts | Held out? |
|---|---|---|---|
| Effect rebuild from labelled parts | 59/61 = 96.7% | 85/109 = 78.0% | No: checks the grammar accepts canon it was fitted on |
| GL2 whole effect predicted from identity, 5 fixed folds | 25/61 = 41% | 12/109 = 11% | Yes |
| GL2 verb alone | 54% (baseline 26%) | 31% (baseline 7%) | Yes |
| RV2 backward search finds the canon route | 52/61 = 85% | 97/109 = 89% | Search from the goal, about 3.9 other routes per target |
| Laws transfer to the other world's canon | Hogwarts laws cover 85% of Gu | Gu laws cover 64% of Hogwarts | Cross-world |
| Explore: new effects passing all checks | 18-26 of 40 per pass | 17-24 of 40 per pass | Generation |

Gu kind grammar (name, rank, path, role): v3 rebuilds 304/304 labelled rows,
but those rows tuned v2 and v3, so this is a fit, not a held-out score. Path
from the name alone is 39.5% (baseline 13%). Only 304 of 1,463 index rows
carry labels; 822 lack a role, 719 a path, 686 a rank.

## Reading

- The fitted rebuild rates clear 70%. The held-out GL2 rates do not: Gu 41%,
  Hogwarts 11%.
- Coverage is the larger gap. The effect test labels 61 Gu effects out of a
  2,206-row source index (about 3%) and 109 spells.
- Gu misses are mostly target and time (area or bound read as self; instant or
  lasting read as sustained). Hogwarts misses are mostly verb and object
  (destructive spells read as transform on form).
- Backward search (85-89%) shows the grammar can reach canon effects from a
  goal. This is the measure closest to "a reasonable plan works".

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

## Correction: stricter held-out scorers already exist

The first version of this note treated GL2 as the held-out score and proposed
building a frozen held-out set and adding incantation roots. Both exist:

- `scripts/generation_fit_report.mjs` (PC11, PSA30) scores fold 0 of 5 once,
  without rotating (the fold is a dial), and prints the trap that flatters each number. That is the
  frozen held-out set.
- `src/spell_heldout.js` tunes on six rows (one per family) and holds out 99.
  It predicts from identity through incantation roots, name words
  (`HP_SPELL_NAME_WORDS`) and a blind gloss lexicon (94 roots, 69 names).
- The "rebuild" rate is also scored across folds, but it is given every part,
  so it checks validity, not prediction. The first version wrongly called it
  a fit on the same rows.

Strict spell held-out (6 tuned, 99 held out), measured today with a scratch
script calling `scoreSpells`:

| Inputs | Outcome | Targeting | Time | Whole sentence |
|---|---|---|---|---|
| Family heading alone | 0/99 | 0 | 0 | 0 |
| Roots lexicon | 28/99 | 14 | 20 | 8 |
| Roots lexicon + name words | 33/99 | 22 | 26 | 9 |

Misses with both: outcome missing data 37 (no gloss names an intent for the
identity), outcome wrong rule 29, targeting wrong rule 12, targeting
undecidable default 9. Runner check: of the 99 predicted sentences run
through `runCaseData`, 13 match the label, 4 mismatch, and 82 cannot run yet
(data 37, mechanism 38, probe 7).

Gu strict companion (`gu_heldout.js`): 53 held out, 18 with an ability, 6 ran.

## Lexicon v2 (wired in)

The v1 lexicon already glossed every root (83) and name word (69). Of the 37
"missing data" misses, 28 had glossed words with an empty intent list, and 9
rows have no identity words at all (dance, dolohov, erecto, fire, portkey,
relash, wand-history, waterproof, wound-countercurse). So the gap was the
gloss-to-intent step, not coverage.

`blind_root_lexicon_v2.json` (beside v1 in
`gm/dispatch/foundation-s-2026-11-12/evidence/`) reruns that step blind for
all 163 entries: a haiku reader given only the word strings and the intent
list, told to pick the nearest intent when the fit is loose. All intents
validate against `INTENT_LAW`.

| Lexicon | Outcome | Targeting | Time | Whole sentence | Outcome + targeting |
|---|---|---|---|---|---|
| v1 | 33/99 | 22 | 26 | 9 | 12 |
| v2 | 45/99 | 33 | 36 | 12 | 20 |

Traps:

- The instruction's examples (light, night, hard) were chosen after seeing
  `lum`, `nox` and `dur` fail. Those three keep their v1 entries in the saved
  file. With them taken from the run, outcome reads 48/99; 45 is the clean
  figure.
- The reader may recognise Harry Potter incantations from the fragments. The
  same holds for v1.
- Misses now: outcome wrong rule 41, outcome missing data 9, targeting wrong
  rule 17. Ranking between candidate intents is the next limit.

`scripts/coverage_report.mjs` (`BLIND_LEXICON`), `scripts/generation_fit_report.mjs`
and `tests/spell_grammar.test.js` now read v2; v1 stays as the record of the
2026-11-12 run. The pinned values in `tests/spell_heldout.test.js` and the GL2
miss list in `tests/spell_grammar.test.js` were moved to the v2 measurement,
which adds a `field-direction` miss (right intent, wrong direction) that v1
never reached. Runner check on v2: 21 match, 2 mismatch, 76 cannot run (v1:
13, 4, 82). `docs/coverage/README.md` is generated and was not regenerated
here; it still names v1 until the next `node scripts/coverage_report.mjs`.

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

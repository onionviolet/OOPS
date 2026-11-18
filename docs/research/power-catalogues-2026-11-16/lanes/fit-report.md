# Lane note: generation fit report (PSA30)

One command prints PC11's four numbers per world for Gu, spells and brews, with the circular trap beside each number:

```bash
node scripts/generation_fit_report.mjs --write   # prints, and writes generation_fit_scores.json beside this folder's README
```

Scores: [generation_fit_scores.json](../generation_fit_scores.json) (deterministic, no timestamp). Arithmetic pinned by `tests/generation_fit_report.test.js`. No paid calls.

## Method (defaults and dials)

- **Fold** (default fold 0 of 5, dial `--fold`): rows hash into folds with the canonTest hash; the grammar fits on the other four and the held-out fold is scored once. Never rotated or averaged, so no rule is tuned against a fold it was scored on. Reason: the `*_heldout` splits tune on 5 to 8 rows by design for the identity rule, too few to fit a generator.
- **Proposals** (default N = 200, novelty 0 and 1, smoothing 0): `proposeEffects` from the train fold; only proposals that assemble count.
- **Pair support**: pairs object+target and object+time (the pairs `grammar_canon_effects.mjs` uses), checked against train rows. Printed beside it: the share of proposals that copy a train sentence.
- **Rediscovery**: held-out (verb, object, target, time) tuples reached. Default headline counts tuples absent from train (reason: a train tuple is a copy); the raw number is printed beside it. Uniform baseline is 1-(1-1/S)^N over the declared slot values, exact.
- **Share shift**: total variation per closed slot against train shares; headline is the worst slot.
- **Executes**: `checkEffect`'s runs check against a probe world (one hall, one yard, one body), through the effect host (PC16). Splits changed-the-world from published-only; lookup-only is printed and excluded; refusals are grouped by the host's own reason so a probe gap reads as a probe gap.
- **Companion lines**: the identity-predicted held-out items of `gu_heldout`, `spell_heldout` and `brew_heldout` through the PSA26 runner (`runCaseData`).

## Traps flagged in the output

T1 labels read from the predicted field (Gu function table, spell lead-text regexes, brew titles and authored readings). T3 smoothing 0: pair support is measured against the generator's own fit. T4 a held-out sentence is a label, not a fresh observation; tuples also in train are copies. E1 a one-body probe world proves the sentence changes it, not that it does what the item does. E2 the test mind owner answers any transform.mind publish, so mind effects pass by publishing (brews: 48 of 116 passes at novelty 0).

## What the first run shows (fold 0, 2026-11-17; read counts, not rates)

- Pair support is 59% to 65% at novelty 0 and 28% to 44% at novelty 1 against the 80% dial; copies of a train sentence are 27% to 40% at novelty 0.
- Rediscovery beats the uniform baseline where a novel tuple exists, but the report has just 1 (Gu), 12 (spells) and 1 (brews) novel held-out tuples. Brews hold out 2 rows in fold 0: small n.
- Share shift passes the 0.25 dial except spell target (0.32 to 0.38) at both levels.
- Executes is 39% to 69%; refusals are mostly the host asking for a channel, a mark or a quantity the probe does not give, so a richer probe is the first lever.

## Not done (default and dial)

- Gu kind identity (the 96.5% grammar in `grammar_canon_gu.mjs`) is a separate grammar and is not in these four numbers; add it as a fourth world if wanted.
- Rotating all five folds would give brews more than 2 held-out rows; it breaks the score-once rule, so it needs Weibao's say or a fresh seed per scoring.
- A computed label-perturbation check (change the suspected field on a cloned row and see whether the label moves) was not built; the traps cite their files instead.

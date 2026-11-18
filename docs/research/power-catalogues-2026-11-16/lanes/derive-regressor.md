# Derive-regressor lane: A Regressor's Tale pills, formations, realm gates (2026-11-17)

Verdict: the held text is too thin to score. No rule was written and no score exists; nothing was guessed.

## Counts (from `docs/coverage/regressors_tale_artifacts_labels.json`, `regressors_tale_artifacts.jsonl`)

- Rows whose id names a pill, elixir, medicine, herb, fruit, formation, array, banner or flag: 55 sheets. 50 are a real thing (not `not-a-thing`).
- Consumable rows (the pill and elixir side): about 20 sheets, and the biggest are generic nouns (`pill`, `pills`, `elixirs`, `medicine`, `herbs`). Named pills are Qi Building Pill, Insect Feeding Pill, reddish pill, forbidden elixir, Dream Lotus Elixir (not-a-thing), Baek Woon elixir (not-a-thing). About 10 formation rows, 5 of them `blocked:formation-field`.
- Stated ingredients or recipes: 0 rows carry an ingredient list, a quantity or a recipe. The three sheets that match "ingredient" or "recipe" only match as words in notes.
- `combines` is `stated: true` on 29 of the 55 sheets, but it is a presence flag with a locator, not content. It gives no ingredient to effect pair.
- Realm or grade gate: `who_may` is `stated: true` on 18 of the 55 sheets, again a flag with a locator. The ledger meta says "label: none: the census states no item rank for this book (unscored)", and the class-guess fold did not beat the majority class.
- The potions-and-recipes cell in `worlds.jsonl` is `missing: paid reader claims 2026-11-01-rtoc`, and the deep dive it points to (`docs/research/novels/regressors-tale/SYSTEMS_DEEP_DIVE_2026-10-10.md`) is local and gitignored, absent from this checkout.

## Why no score

The HP method needs (ingredient set, effect) pairs to fit a property rule and a held-out fold to score it. Here the denominator of pairs is 0. A realm-gate rule needs a stated realm per row; there are 0 stated values, only 18 presence flags. A hash split over ~20 pills with no label would score nothing. The core axioms in `core_rules.json` (PWC84) have no stated recipe to predict, so none can be tested either.

## What would unblock it (defaults, not decisions)

- Default: a stated-field read of the paid reader claims for pills and formations (recipe ingredients, stated realm or grade per pill, formation inputs), through `scripts/label_runner.mjs` batch mode with `--max-usd 2`. The ~35 rows are small, so the cost is well under the cap. Dial: skip it if the claims file is still missing, since the read needs it as input.
- Default: even with the read, expect Regressor's Tale to state few recipes (the story gives pill effects and costs by scene, not by ingredient). If the read returns under about 30 labelled pairs, stay unscored and carry the rows as stated-only.
- Rows to derive later: `rt.item.qi-building-pill` (effect, cost and who-may all flagged stated by wiki speaker) is the best first held-out probe.

No ledger rows, derivation rules, exceptions or `derived` blocks were added; `derivation_rules_backtest.mjs` is untouched.

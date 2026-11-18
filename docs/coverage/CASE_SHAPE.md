# Case shape: one row, one runner (PSA26)

Register status: Proposal (AD32). Cites PC5, PC9, PC10, PSA21, PSA26 and PSA28; no new codes. Lane briefs for field fill, derivation, rule search and label passes link this file instead of describing their own row shape.

## The path

ledger row, then `case` plus `expect`, then `runCase` in [scripts/case_runner.mjs](../../scripts/case_runner.mjs), then `{state, detail, basis, confidence}`. The same function runs canon, authored, derived and generated rows; the row's basis only changes the label (`expressed-canon`, `expressed-derived` and so on).

## Row (ledger line)

`{id, source, state, mechanisms, test, note, case?, derived?}`, as [scripts/coverage_report.mjs](../../scripts/coverage_report.mjs) validates it. Default: those are the row fields, and the validator rejects others. A producer that needs to keep extra data (filled fields, replies, scores) keeps it in its own work file and passes it to an adapter.

- `case`, persisted: `{module, id}`. The module exports `coverageCase(id)`, which returns plain data (`sentence` or `working` or `timeline`, `world`, `expect`); the data shape is documented in the header of `coverage_report.mjs`.
- `case`, in memory: `{id, data}` carries that same plain data inline. Default: use it for rows a pass builds before they have a module, and for tests. Dial: a persisted row names a module so the ledger stays small and reviewable; `parseLedger` rejects `data` in a ledger line.
- `expect`: world terms (quantity, property, belief, position, exists, creationParents, lawField with a direction), at least one change. A rank, a label or a score is not a world term, so a row that claims just one of those carries no case and stays `catalogued`.
- `derived`: `{rule, inputs, confidence?}`. The rule needs a score row in `docs/coverage/derivation_rules.json`.

## Runner output

`runCase(row, {reachable?, rootDir?})` returns `{state, detail, basis, confidence}`.

- `state`: `expressed-<basis>` when the world changed as `expect` says, `runs-<basis>` when the case module is also reachable from `src/main.js`, else a `blocked:runner-*` slug with the reason in `detail`. Tests that must not flip when a pack gains an import pass `reachable: new Set()`.
- `basis`: the case data's `basis`, else the typed state's suffix, else `authored`.
- `confidence` (PSA28): the derivation rule's `{exact, withinBand, n, verdict, version}` read from `derivation_rules.json` when the row has `derived.rule`, else null. It is a column on this output; there is no second file shape.
- `runRow(row)` treats a row with no case as `catalogued` with the same four fields.

## What feeds the runner

| Effort | Reads or emits | Adapter ([scripts/case_adapters.mjs](../../scripts/case_adapters.mjs)) |
| --- | --- | --- |
| Pass runner (PWC18, `label_runner.mjs`) | items from rows with no case; replies become rows | `passItems`, `passRows` |
| Field fill (PWC60, `fields/<slug>.jsonl`) | a row whose required fields both readers confirmed gets the law's case; any unknown field leaves it `catalogued` | `fieldRow` |
| Derivation (PWC80, `derivation_rules_backtest.mjs`) | rule scores read through `confidenceOf`; no change to its file | `runRows`, the runner's `confidence` |
| Law defaults (PSA28, `law_defaults.mjs`) | a law's composed case per blocked row; `take()` returns runner rows with a `take` column (the case was expressed); held-out scores are `law.*` rows in `derivation_rules.json` | none; it calls `runCaseData` and the runner's `confidence` reads the score row |
| Rule search (PWC94, `gu_rank_search.mjs`) | one output row per rule from `final.by`, confidence as a column | `searchOutputRows` |

## Still its own shape

- `scripts/field_fill.mjs` is on branch `claude/slug-fieldfill-6cc15c`, not master; its `fields/<slug>.jsonl` rows (`{id, ledger, f, r}`) go through `fieldRow` when it merges.
- `derivation_rules.json` keeps its score-row file shape; the runner reads it as a column (PSA28).
- `gu_rank_search.json` keeps its fold results; `searchOutputRows` reads it.
- Pass builders write their own sidecar label files (`*_labels.json`); the rows they produce are in this shape.

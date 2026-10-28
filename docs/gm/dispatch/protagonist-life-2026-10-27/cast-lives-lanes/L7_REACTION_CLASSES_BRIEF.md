# L7 brief: classify the slice's reactions (CL112, feeds CL60 and CL56)

Model: `gpt-6-luna`, medium effort. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`, beside L4c
(no shared files). Do not commit; the coordinator commits. Never stash, reset, force or push. Card:
[CAST_LIVES_CARD](../CAST_LIVES_CARD.md) (cite CLR codes). Plan sections 10.2, 14 (CL112), 16.

## Publication class (CLR3)

Private: the per-trigger classification file (it quotes row text) goes under each book's `private/`
folder. Public: only code, synthetic tests and counts.

## Data probe (CLR2; gate counts)

Gate: LOTM chapters 1-24 `reacts` items about 196 and MoL first-loop items about 100 (L1 and L2c
checkpoints). Stop if either is under half. Informational: how many the current `classifyAction` places.

## Work

1. For every slice `reacts` item, assign a trigger class and a response class from the WA25 classes
   (study, practice, research, craft, trade, work, travel, fight, socialize, rest, care, appraise, ritual,
   other) and, where the row or its scene names one, the id of who triggered it (`by`). Read the cited
   paragraph where the row text is unclear (`cite_paragraphs.mjs --id <person id>`); never guess from
   outside knowledge (CLR1). Write `reacts_classified.jsonl` per book (private).
2. Improve `classifyAction` in `scripts/lead_run/build_crosswalk.mjs` from what step 1 found (keywords and
   phrase patterns, still deterministic), so its hit rate rises without false positives; add regression
   cases with synthetic text to `tests/lead_run_crosswalk.test.js`.
3. Measure: the improved classifier's agreement with the step-1 classes, per book.

## Owned files

`scripts/lead_run/build_crosswalk.mjs` (the classifier only), `tests/lead_run_crosswalk.test.js`,
`cast-lives-lanes/L7_CHECKPOINT.md`, private outputs.

## Done check

- Focused test passes; L1's crosswalk output for both books is unchanged (rerun its two commands into a
  scratch folder and compare, excluding the fitness counts that use the classifier).
- Checkpoint: classes per book (counts), share with a `by` id, classifier agreement before and after,
  and a one-line recommendation on CL56 (whether the reading schema still needs `reacts.class`).

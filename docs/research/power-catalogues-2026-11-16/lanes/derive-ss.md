# derive-ss: Shadow Slave rank and class (2026-11-17, proposals, AD32)

Script `scripts/ss_rank_search.mjs` (modelled on `gu_rank_search.mjs`), rule score rows in `scripts/ss_rank_rules.mjs` (one registration line in `derivation_rules_backtest.mjs`), results in `docs/coverage/ss_rank_*.json`. Cites PWC90-PWC95, PWC99, PWC100. Agent-verified, not human-reviewed.

## What the data allows

- Stated tiers exist for 61 creature rows and 27 Memory and item rows, almost all kind names that carry the tier in the name ("Fallen Beast", "Sacred Soul Shard"). Evidence is redacted to `[rank]`, so no rule reads its own answer, but the test is mostly "does story time predict the tier a kind name states".
- Echoes state no tier (0 of 37), so they are unscored. Powers state one only in 17 names (holder stage abilities); no rule reaches enough of them, so powers got no tier rule (gap, default: needs a holder-stage read).
- No paid call was made. The evidence is redacted, so a stated-field read has nothing to read.
- Class (Beast to Titan) does not predict tier: every class pairs with every tier name in the stated rows.

## Method

Five frozen folds (`ss_rank_folds.json`, committed before any scoring, commit 411e079e7): fold 5 is sha1(id)[0] < 0x33 (GKM429). Rules chosen on folds 1-4; fold 5 scored once. Ladder order is the ledgers' class_map order (default; the Sacred/Divine order is a dial and moves within-one only).

## Fold-5 scores (exact, within one tier)

| Pool | n | Chosen set | Set | Baseline (most common) | Resemblance (name stem) | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| Creatures | 12 | source > story3 > klass | 5, 11 | 6, 9 | 6, 9 | fails-baseline (exact below; within-one above) |
| Memories, items | 9 | crossSource > source > story3 | 6, 7 | 0, 4 | 0, 3 | insufficient-held-out (n under the floor of 10) |

Dev folds 1-4, exact: creatures baseline 20/49, story k=3 26/49, source+story3+klass 27/49; artifacts baseline 4/18, story k=3 6/18.

## Facts explained per rule (rows with no stated tier; PWC91)

| Rule | Creatures (304) | Memories, items (405) | Echoes (37) |
| --- | --- | --- | --- |
| story3 (story time, k=3) | 304 | 404 | 37 |
| crossSource (linked creature or Memory) | 0 | 1 | 0 |
| source (same-ledger link) | 0 | 0 | 0 |
| klass (class word) | 0 | 0 | 0 |

The source mechanism (a shard, Memory or Echo shares the tier of the creature it came from) is the right shape but the evidence links to a stated-tier row only 5 times in 365 creature rows and once in 432 item rows, so it has no score. It needs a chapter read that names the source creature per Memory (default: next pass).

## Ledger effect

405 item rows carry `rank`, `rankBasis: derived` and a `derived` block with the rule's confidence (verdict insufficient-held-out). No creature or echo row is written: the creature rule fails its baseline on exact, and PWC100 leaves relabelling to a human. Derived tiers for those rows are in `ss_rank_derived.json`. A rank is not a world term, so none of these rows carries a case (CASE_SHAPE); they stay `catalogued`.

## Named exceptions (`ss_rank_exceptions.json`)

Fold-5 misses of two tiers or more, pinned as a mechanical class (story time lags the stated tier), reason unread. One-tier misses stay in `ss_rank_search.json`.

## Hand-over

- `docs/coverage/derivation_rules.json` here holds the committed file plus the two `ss.rank.*` rows from the builder, spliced by script, because regenerating it on this branch moved the Gu rule versions (the committed Gu rows cite `fe62076e88`, a fresh build gives `fd759c536c`, so the committed file already lags `derive_gu_ranks.mjs`). The coordinator should regenerate it at merge and re-run `node scripts/ss_rank_search.mjs ledger`, which reads the new versions.

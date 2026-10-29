# Lane brief: M2, union every row kind across schema versions (M1 follow-up, MW1, LSD151)

Model: `gpt-6-luna`, low. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`; scripts only, no `src/`.
Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md); [M1_CHECKPOINT](M1_CHECKPOINT.md); batch-reading
[READINESS_AND_SCOPE](../../batch-reading-2026-10-27/READINESS_AND_SCOPE.md) C34, C35. Rules: AD36, AD45, CLR2,
CLR3, CLR4, CLR12.

## Why

M1's `schema_union` merges people (1.4 over 1.3 by person and slot) and the two censuses. The 1.4 rereads also
replaced rules, places, services, news, customs and `*_other` files in place, with old rows in `pre-sv14/` (and
`pre-sv8/`). In Mother of Learning the 1.4 files hold fewer rows than their backups (rules 5,866 vs 6,721;
texture 5,426 vs 6,101), so rows only the older read found are dropped from the merge today.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| MoL files with a `pre-sv14/` backup, per kind | 106 per kind | | yes |
| LOTM files with a `pre-sv14/` or `pre-sv8/` backup, per kind | | | no |
| Rows with an `id` field, per kind (union key) | most | | yes |

## Scope and seam

- **Outcome.** `schema_union.mjs` unions every row kind it finds with a backup, per shard file: key by `id`; rows
  without an id key by kind plus normalized name (same normalization as the census union). Newest present field
  wins, older value survives where newer is silent (CLR4), rows only in the older version are kept, and every row
  records `_from` per field as in M1. Backup folders by version (`pre-sv8/`, `pre-sv14/`, later ones) are found by
  name, newest first (LSD151), not hard-coded.
- **Report.** Per book and kind: rows current, rows backup, rows kept only from backup, fields filled from backup.
  Written into the pipeline output and summarized in the checkpoint.
- **Files owned.** `scripts/lead_run/schema_union.mjs`, `tests/schema_union.test.js`, checkpoint
  `cast-lives-lanes/M2_CHECKPOINT.md`. Pipeline or merge script changes: `M2_INTEGRATION.patch` only if needed.
- **Keep** T1's lean output (write changed files only, link the rest).

## Work and done check

- `node --test tests/schema_union.test.js tests/world_lead_pipeline.test.js` with new synthetic cases: an id row only
  in the backup is kept; a field silent in 1.4 is filled from 1.3; three versions resolve newest first; an id-less
  row dedupes by kind and name.
- Real runs into `/tmp/m2-lotm` and `/tmp/m2-mol` with the commands in `M1_CHECKPOINT.md` and `P1_CHECKPOINT.md`
  (MoL: `--match '^molc[0-9]+m$'`, its overlay and review files). Report the counts table and the consumer fitness
  numbers before and after for both books.
- `node scripts/lane_review.mjs` with grants and paths. Done when tests pass, both runs complete, and the table is
  in the checkpoint. Do not commit; outputs stay outside the private tree and tracked files.

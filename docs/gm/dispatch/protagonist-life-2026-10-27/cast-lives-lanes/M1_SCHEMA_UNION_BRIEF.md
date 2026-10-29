# Lane brief: M1, schema 1.4 and census union stage (CL56, AD44)

Model: `gpt-6-luna`, low. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg` beside B1 (B1 owns `src/`,
`tests/lotm_be_seat.test.js` and `private_packs/lotm-cast/`; this lane touches none of them). Card:
[CAST_LIVES_CARD](../CAST_LIVES_CARD.md); handoff item 6. Rules: AD36, AD44,
`.claude/rules/research-and-agents.md`; batch-reading
[READINESS_AND_SCOPE](../../batch-reading-2026-10-27/READINESS_AND_SCOPE.md) C28, C28r, C29, C30, C34.
CLR codes applied: CLR2, CLR3, CLR4, CLR9, CLR12.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| LOTM v1 shard files with schema 1.4 people rows (private research folder) | 70+ | | yes |
| Matching pre-1.4 backups in `pre-sv14/` and `pre-sv8/` | one per replaced file | | yes |
| Second census files `*x2_census.jsonl` | 31 | | yes |
| MoL ch1-4 1.4 people rows with `pre-sv8/` backups | 4 | | no |

## Scope and seam

- **Outcome.** A new stage `schema_union` runs before `merge_shards` in
  `scripts/lead_run/world_lead_pipeline.mjs` and writes a unioned input folder (in `--out`, never over the
  originals). It does two things:
  1. **1.4 over 1.3 by person and slot.** For each shard, read the current (1.4) rows and the backup (1.3) rows;
     key by person id and slot (field). Take the 1.4 value where the 1.4 row has the field; keep the 1.3 value
     where 1.4 is silent (CLR4: absent is unknown, not "no"). A person present only in 1.3 is kept. Record per
     row which version supplied each field (`_from`).
  2. **Census x1 with x2 (C28).** Union the first census with the `x2` census by normalized name and aliases
     (lowercase, trimmed, punctuation and honorifics folded; alias sets merged). One row per entity; keep every
     alias and both source locators.
- **Files owned.** New `scripts/lead_run/schema_union.mjs`; `scripts/lead_run/world_lead_pipeline.mjs` (add the
  stage and its receipt entry only); new `tests/schema_union.test.js` (synthetic, name-free); checkpoint
  `cast-lives-lanes/M1_CHECKPOINT.md`. `merge_shards.mjs` and other stage scripts: do not edit; a needed change
  goes in `cast-lives-lanes/M1_INTEGRATION.patch`.
- **Publication class (CLR3).** Scripts and test public and name-free. Outputs in the book's private research
  folder or `/tmp`.
- **Do not** use `touchedByLead` as the cast list (Haiku under-marks it); crosswalk presence in lead scenes stays
  the source.

## Work and done check

- **Verification.** `node --test tests/schema_union.test.js`: 1.4 wins on present fields, 1.3 survives where 1.4
  is silent, 1.3-only person kept, census union dedupes an alias pair and keeps both locators, deterministic
  output order (byte-identical on two runs). Then run the pipeline for LOTM v1 into `/tmp/m1-lotm` and report:
  people count before and after the union, census entities x1, x2 and union, rows that gained `recurrence` or
  `reacts` fields, and lead-scene cast count from the crosswalk against the previous records-ready output.
  `node scripts/lane_review.mjs` with grants and explicit paths.
- **Done when.** Test passes; the LOTM run completes all stages; the counts above are in the checkpoint.
- **Stop conditions.** A shard has 1.4 rows but no backup and no way to tell what 1.4 dropped: keep the 1.4 row,
  list the shard, continue.
- **Known ambiguities default (CLR12).** Two values for one slot in the same version: keep both with locators.

Do not commit. Do not regenerate the book pack (waits for B1). Keep canon names and source text out of tracked
files.

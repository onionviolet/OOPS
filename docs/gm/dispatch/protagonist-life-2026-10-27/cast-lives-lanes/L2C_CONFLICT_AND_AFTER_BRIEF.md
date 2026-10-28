# L2c brief: fight contracts and what people did next (CL18, CL61)

Model: `gpt-6-luna`, medium effort. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`, never in
the cloud. Starts after L1's checkpoint reports done; runs alongside L2b (no shared files). Plan:
[CAST_LIVES_PLAN_2026-10-28](../CAST_LIVES_PLAN_2026-10-28.md) sections 8.2, 8.5 (CL18), 10.2 (CL61).

## Goal

Two derived tables the gap probe (L4) needs, both from rows already on disk; no paid call, no re-read.

1. **Fight contracts (CL18).** For every LOTM chapter 1-24 scene with a step of class `fight` (and every
   scene whose outcomes name an injury, escape or capture), build a contract
   `{beat, sides, stakes, means, terrain, outcome, unseen, locators}` from the scene's steps, outcomes,
   present list and motives. Where a field is not in the rows, open the cited paragraphs with
   `node scripts/lead_run/cite_paragraphs.mjs <privateDir> --id <beat or id> --context 2` and fill it in
   your own words with the paragraph locator; if the paragraphs do not say, write `null` with
   `unseen: [...]`, never a guess. Read the source text locally only; never paste it into a committed file.
2. **After-interaction actions (CL61).** For LOTM chapters 1-24 and MoL chapter 1 to the first restart
   (chapter named in L1's checkpoint; stop and report if it is `U`): for each scene where person A acts on
   person B, find B's next scene with A, and record `{trigger class, response class, gap in scenes,
   locators}`. Classes come from the WA25 classifier exported by `build_crosswalk.mjs` (CL77); import it,
   do not copy it.

## Outputs

- `scripts/lead_run/conflict_contracts.mjs` and `scripts/lead_run/after_actions.mjs`, each writing a
  private JSONL under the book's `private/` folder and printing counts.
- `tests/lead_run_conflict_after.test.js` on fixture rows.
- `cast-lives-lanes/L2C_CHECKPOINT.md`: counts only (contracts built, fields filled from rows, from
  paragraphs, left null; after-action pairs per trigger class), one line per check.

## Rules

WA32 (record the conflict, not the choreography), WA35 (stated outcomes are faithful), PL-A46 (no outside
knowledge: if a row's claim is not in its paragraph, drop it), AD36. Do not edit `build_crosswalk.mjs`,
`merge_shards.mjs`, `batch_lib.mjs` or `src/`. Commit only the owned files from a fresh HEAD; no stash,
reset, force or push; no `Co-Authored-By` trailer.

## Done check

- `node --test tests/lead_run_conflict_after.test.js` passes.
- Every fight-step scene in LOTM chapters 1-24 has a contract with an `outcome` and locators.
- The checkpoint states the after-action table's size per book and the share of `reacts` triggers the
  classifier could not place (this number decides CL56).

# Lane brief: P1, one command per book to records-ready (CL272, AD44)

Model: `gpt-6-luna`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`, beside the G1 fix lane
(G1 owns `src/` LOTM files and `src/main.js`; this lane touches none of `src/`). Card:
[CAST_LIVES_CARD](../CAST_LIVES_CARD.md); plan section 28 (CL272) governs. Rules: AD36, AD44,
`.claude/rules/research-and-agents.md`. CLR codes applied: CLR2, CLR3, CLR9, CLR11, CLR12.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Stage scripts in `scripts/lead_run/` the chain needs (merge_shards, build_crosswalk, cast_worksheet, conflict_contracts, after_actions, and the fitness report wherever it lives) | 6 | | yes |
| Books with existing records-ready outputs to compare against (LOTM volume 1 and Mother of Learning, under each book's private research folder) | 2 | | yes |

Record for each stage: its command line as last run for LOTM and MoL (from the L1, L2b, L2c, L6a checkpoints
in this folder and the scripts' own usage), its inputs and its outputs.

## Scope and seam

- **Outcome.** `node scripts/lead_run/world_lead_pipeline.mjs <book> --from <loc> --to <loc> [--out <dir>]`
  runs merge, crosswalk, worksheets, fight contracts, after-actions and the fitness report in order, using
  each script's existing world option and `world_profiles.mjs`, stops at the first failing stage with its
  name, and writes a receipt (stage, command, input hashes, output hashes, seconds).
- **Files owned.** New `scripts/lead_run/world_lead_pipeline.mjs`; new `tests/world_lead_pipeline.test.js`
  (synthetic fixture books only); checkpoint `cast-lives-lanes/P1_CHECKPOINT.md`. Existing stage scripts:
  call them, do not edit them; a needed change to one goes in `cast-lives-lanes/P1_INTEGRATION.patch`.
- **Publication class (CLR3).** The pipeline and test are public and name-free. Outputs go to the book's
  private research folder (local book pack and research, not published), never to tracked paths.
- **Seam.** Stage scripts stay the authority; the pipeline only sequences them and records hashes. No second
  copy of any stage's logic.
- **Save and economy.** None (tooling).
- **Actor parametrization (CL225).** Book and world come only from arguments and `world_profiles.mjs`; no
  book-specific branch inside the pipeline.

## Work and done check

- **Verification.** Focused test over a tiny synthetic two-chapter fixture: all stages run in order; a failing
  stage stops the chain and names itself; the receipt lists every stage. Then the real check: run the pipeline
  for LOTM and for MoL into scratch output folders (`--out` under `/tmp`), and compare each output file with
  the existing records-ready output byte for byte (`cmp`). Record matches and every difference with its cause.
- **Done when.** Focused test passes; LOTM and MoL outputs are byte-identical, or each difference is explained
  (for example a timestamp field) and listed; `node scripts/lane_review.mjs` passes with your grants and
  paths.
- **Stop conditions.** A stage has no world option and cannot run for one of the two books without editing
  it: write the prepared patch, record it, and finish the rest.
- **Known ambiguities default (CLR12).** Where the last real run used a stage flag not visible in a checkpoint,
  take it from the stage's usage text and note it.

Do not commit. Keep canon names and source text out of tracked `scripts/` and `tests/` (CLR3).

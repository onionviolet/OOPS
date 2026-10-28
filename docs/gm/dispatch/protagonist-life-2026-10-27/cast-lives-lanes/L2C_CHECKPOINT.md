# L2c checkpoint, 2026-10-28

Status: derived-table tooling and private outputs complete; agent-verified, not human-reviewed.
Inputs are L1's merged LOTM scenes (chapters 1–24) and MoL scenes (chapter 1 through the first restart waking confirmation, chapter 5 p9). The MoL boundary is named, not `U`.

## Counts

- Fight contracts: 0 scenes selected; fields from scene rows 0, from paragraphs 0, left null 0. The slice has no lead scene with a `fight` step or injury/escape/capture outcome. The first fight-step row found is beyond the chapter 24 boundary. No paragraph fill was needed; no source prose is reproduced.
- After-action pairs: LOTM 5 (`socialize` 3, `study` 1, `trade` 1); MoL 4 (`care` 1, `socialize` 2, `study` 1). Pairs require a targeted person in an option's `needs` plus the next shared lead scene; this reports modeled directed actions, not every possible off-page interaction.
- `reacts` trigger classification: LOTM 117/196 unplaced (59.7%); MoL 63/100 unplaced (63.0%). This is the share the CL77 classifier cannot place.

## Check log

- `node --test tests/lead_run_conflict_after.test.js`: PASS, 2/2 fixture tests; merged private inputs are not test fixtures.
- `node scripts/lead_run/conflict_contracts.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/merged-cast-2026-10-28`: PASS, wrote private JSONL with 0 rows; no qualifying conflict rows to paragraph-check.
- `node scripts/lead_run/after_actions.mjs lotm docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/merged-cast-2026-10-28`: PASS, 5 pairs; gap is that only directed targets explicitly represented by option `needs` are mined.
- `node scripts/lead_run/after_actions.mjs mol docs/research/novels/mother-of-learning/private/lead-run-2026-10-28/merged-cast-2026-10-28`: PASS, 4 pairs through chapter 5 p9; same target representation gap.
- `git diff --no-index --check /dev/null <each owned file>`: PASS, no whitespace errors (exit 1 is expected for new files).
- `git add -- <four owned paths>`: BLOCKED, Git could not create `.git/index.lock` (`Operation not permitted`); no commit made.

## Addendum, 2026-10-28

The earlier counts above are retained as history. The broadened selector finds 5 LOTM chapter 1–24
contract candidates. Three are retained with `notConflict: true` and a reason after paragraph review;
2 remain conflict candidates. The slice contains no `class: fight` step, so every fight-step scene
has a contract vacuously. This is below the addendum's rough 8–12 estimate; review of the specified
step verbs, outcome verbs/facts and `footprint.hazards` found no further candidates. No source prose
is copied here.

- Conflict contracts: 5 candidates; 27 fields filled from rows, 2 filled from cited paragraphs,
  1 left null (`sides` on `lr.lotm.main.306`; source does not identify an active opposing side).
  Paragraph fills: `lr.lotm.main.306` outcome at `zh 第11章 p23`; `lr.lotm.main.402` outcome at
  `zh 第12章 p81`.
- After-action pairs: LOTM 9 (`socialize` 2 option; `study` 1 option + 1 co-presence; `trade` 1
  option; `travel` 2 co-presence; `work` 2 co-presence). MoL 21 (`care` 1 option; `craft` 2
  co-presence; `fight` 2 co-presence; `rest` 2 co-presence; `socialize` 1 option + 3 co-presence;
  `study` 1 option + 8 co-presence; `work` 1 co-presence).
- `reacts` trigger classification unchanged: LOTM 117/196 unplaced (59.7%); MoL 63/100 unplaced
  (63.0%).

## Addendum check log

- `node --test tests/lead_run_conflict_after.test.js`: PASS, 4/4; includes null-class danger cue
  and co-presence fixture cases.
- `node scripts/lead_run/conflict_contracts.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/merged-cast-2026-10-28`: PASS, 5 rows written; source paragraphs reviewed locally, no prose copied.
- `node scripts/lead_run/cite_paragraphs.mjs <privateDir> --merged <mergedDir> --id <beat> --context 2`: GAP, this CLI treats `--id` as an entity ID and returns no paragraphs for beat IDs; selected paragraphs were read locally from the indexed shard using each scene's cited locator. The CLI was not changed because it is outside this lane's owned files.
- `node scripts/lead_run/after_actions.mjs lotm docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/merged-cast-2026-10-28`: PASS, 9 pairs; option and co-presence basis retained.
- `node scripts/lead_run/after_actions.mjs mol docs/research/novels/mother-of-learning/private/lead-run-2026-10-28/merged-cast-2026-10-28`: PASS, 21 pairs through chapter 5 p9; option and co-presence basis retained.
- Node trailing-whitespace scan of the four owned files: PASS; no diagnostics. No runtime, source-library,
  or project-wide checks apply to these local derived-table tools. Files remain uncommitted for the coordinator.

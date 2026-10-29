# Lane brief: X3, generator maps household verbs to H1 act ids

Model: `gpt-6-luna`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; the coordinator
commits. Never stash, reset, force or push. Read first: [H1_CHECKPOINT](H1_CHECKPOINT.md),
[X1](X1_CHECKPOINT.md) and [V2](V2_CHECKPOINT.md) checkpoints, and `scripts/lead_run/build_replay_mapping.mjs`.
Publication class: private research for outputs under the private `x1-be-mapping-*` folder; public code (name-free) for
the script and its synthetic test. Rules: CLR1, CLR2, CLR3, CLR6, CLR7, CLR8, CLR12; AD36.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Act rows in `private_packs/lotm-cast/cast.json` `householdActs` | 9 | | yes |
| ch1-24 steps in the current generated mapping whose verb text is a household verb (look over, pay, light, wash, clean, check, eat, put away, take) | list with counts | | no |
| Steps already mapped to an act control in the V2 control inventory | list | | no |

## Scope and seam

- Outcome: in the generated be-seat mapping, a step whose verb is a household verb at the household place maps to
  the matching act's control (command id `book.lotm.household_*`, from the pack's `householdActs`, the same ids the
  be-seat control inventory lists), carrying the place and object it needs. Unmatched household-looking steps stay
  typed gaps with a reason. Act ids are read from the pack at generation time, never hardcoded in tracked code.
- Files owned: `scripts/lead_run/build_replay_mapping.mjs`, its test (extend the existing X1/X2 test file or add
  `tests/replay_mapping_household.test.js`), `cast-lives-lanes/X3_CHECKPOINT.md`. Do not touch `src/` or
  `private_packs/`.
- Publication: no canon names in tracked files; use pack data and synthetic ids in tests.
- Pipeline run: regenerate chapters 1-24 and 1-3 mappings with `--pack` into a new private folder
  `x3-be-mapping-2026-10-29/` (beside x1's); report counts of mapped acts, walks, talks and gap kinds before and after.
- Failure case: when the pack has no `householdActs`, the generator behaves exactly as before.

## Work and done check

- Verification: focused test passes; mapping regenerated; `node --test tests/lead_replay_score.test.js` still passes.
- Done when: the checkpoint lists, per household act id, how many ch1-24 steps now map, and the remaining household
  gaps by reason. One line per check (command, result, gaps).
- Stop: if fewer than 5 ch1-24 steps are household verbs, record and stop.
- Ambiguity default (CLR12): when a verb fits two acts, pick the one whose object is at the step's place; else leave a gap.

Do not commit. Keep canon names and source text out of tracked files (CLR3).

# Lane brief: X1, map the lead's steps to be-seat controls, then generate the mapping (CL269, ON3, ON5)

Model: `gpt-6-luna`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`; scripts and private data
only, no `src/`. Beside H1 (which owns `src/`). Do not commit; the coordinator commits. Never stash, reset, force or
push. Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md); [V1 checkpoint](V1_CHECKPOINT.md); [M4 checkpoint](M4_CHECKPOINT.md);
design LSD103-LSD125, LSD156-LSD160. Rules: AD36, AD44, CLR1-CLR4, CLR12.

## Why

The be-seat replay runs (V1 driver, fixed by the coordinator on 2026-10-29) but its mapping was written for the
beside seat: 7 rows still say `needs seat: be`, one walk id belongs to the beside panel, and the "wait until dawn"
row is marked missing although the be panel now offers "Wait until dawn". The whole book has 3,444 lead rows
(M4), far too many to map by hand.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Rows in the private L5r mapping | 18 | | yes |
| Be-panel control ids at the start of the be life (from a coordinator run's DOM dump, or from `src/book_world_lotm_ui.js` id builders) | list | | yes |
| Lead rows in `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/` for chapters 1-24 | count | | yes |

## Scope

1. **Re-map chapters 1-3 for the be seat** in a new private mapping file (keep the L5r one): retype the 7
   `needs seat: be` rows to what the be life now offers or to their real gap kind; use be walk ids and the
   intention waits; keep the CLR1 source rejection. Every route cites the control id builder it relies on.
2. **A generator** `scripts/lead_run/build_replay_mapping.mjs`: from M4's lead rows (scene, step verb class, place,
   time band, people present) and the be panel's id rules, emit replay rows for any chapter range: walks for
   place changes (via the crosswalk), "Wait until" for time gaps, talk for people present, and a typed gap for
   anything else, with the step's verb class as the gap's verb. Deterministic, no model calls. Reuse
   `lotm_ui_replay.mjs`'s row format and `GAP_KINDS`.
3. **Option inventory (ON2)**: each generated row records which control the canon step uses and, where the
   scene lists choices the lead did not take, those as locked options (ids only).

## Files owned

`scripts/lead_run/build_replay_mapping.mjs`, `tests/build_replay_mapping.test.js` (synthetic), the new private
mapping files under `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/x1-be-mapping-2026-10-29/`,
checkpoint `cast-lives-lanes/X1_CHECKPOINT.md`. Do not edit `lotm_ui_replay.mjs` (the coordinator owns it now);
write a prepared patch if it needs a change.

## Done check

Focused test passes; the generator runs for chapters 1-24 and prints counts by row kind (walk, wait, talk, gap by
verb class); the checkpoint gives the coordinator's replay command for both the re-mapped 1-3 file and the
generated 1-24 file. Counts only in the checkpoint; no canon names or text. Stop on: probe gate failure, a needed
`src/` change, any paid call.

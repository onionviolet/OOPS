# Lane brief: X2, resolve the lead's places and people to pack ids in the generated mapping (ON6 data gaps first)

Model: `gpt-6-luna`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`; scripts and private data
only, no `src/`, and **do not edit `private_packs/`** (H1 is writing pack rows). Do not commit; the coordinator
commits. Never stash, reset, force or push. Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md); [X1](X1_CHECKPOINT.md),
[M4](M4_CHECKPOINT.md), [R1](R1_CHECKPOINT.md) checkpoints. Rules: AD36, AD44, CLR1-CLR4, CLR12; LSD151.

## Why

X1's generator mapped chapters 1-24 into 1,491 replay steps but matched **0 walks and 0 talks**: the scenes' place
and people strings did not resolve to the pack's place and person ids. Every later replay row depends on this join.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Distinct place strings and person ids in chapters 1-24 lead steps (M4 output) | counts | | yes |
| Pack place and person ids: live pack and R1's candidate `/tmp/r1-pack/cast.json` (92 people) | counts | | yes (stop if neither loads) |
| How the crosswalk (`build_crosswalk.mjs`) keys places and people today | short description | | yes |

## Scope

- Make `build_replay_mapping.mjs` resolve places and people through the existing crosswalk and registry (reader id
  -> pack id), with redirects and aliases; never by fuzzy name guesses. Where a reader place is a sub-place of a
  pack place (a room in a flat, a street in a district), resolve to the nearest pack place that contains it, using
  containment evidence in the merged rows; record the rule used per row.
- Report resolution rates for places and people, before and after, against both the live pack and R1's candidate,
  and the top unresolved places and people by step count (ids and counts only in the checkpoint; names private).
- **Files owned.** `scripts/lead_run/build_replay_mapping.mjs`, `scripts/lead_run/build_crosswalk.mjs` (join
  helpers only), their tests (new cases), private outputs under `.../x2-resolution-2026-10-29/`, checkpoint
  `cast-lives-lanes/X2_CHECKPOINT.md`.

## Done check

Focused tests pass (a sub-place resolves to its containing pack place; an alias resolves; an unknown stays a gap);
the chapters 1-24 mapping regenerates with walk and talk counts; checkpoint with one line per check, counts only.
Stop on: probe gate failure, a needed `src/` or pack change (write it as a proposal in the checkpoint), any paid call.

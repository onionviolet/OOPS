# Lane brief: R3, whole-book people and places in the candidate pack (resolution is the topic-talk bottleneck)

Model: `gpt-6-luna`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force
or push. Read first: [R1_CHECKPOINT](R1_CHECKPOINT.md), [R2_CHECKPOINT](R2_CHECKPOINT.md), [D3_CHECKPOINT](D3_CHECKPOINT.md),
[X2_CHECKPOINT](X2_CHECKPOINT.md), [M4_CHECKPOINT](M4_CHECKPOINT.md), `scripts/lead_run/build_cast_pack.mjs`. Rules: CLR1-CLR5,
CLR12, LSD126 (role tier is cheap), AD36. Publication: scripts and tests public code, name-free; all pack output private
under `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/`. Never write `private_packs/`.

## Why

D3 produced 13 topic rows from 849 whole-book family steps. Rejections: unresolved person 315, ambiguous person 248,
unclear speaker 210, unresolved place 63. The candidate pack holds 204 people and 89 places, built mostly from chapters 1-24.
P6 and P7 made role-tier people cheap, so the pack can hold many more. Resolution, not mechanism, limits yield.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Distinct people and places in the M4 whole-book registry and census (counts by kind, per volume) | thousands | | yes |
| Of those, referenced by a lead-POV step in the family set | count | | no |
| D3 rejections reproduced from the current inputs | 315 / 248 / 210 / 63 | | no |

## Scope

- Files owned: `scripts/lead_run/build_cast_pack.mjs` (and helpers it already owns), `tests/build_cast_pack.test.js` or the
  existing synthetic test file for it, `scripts/lead_run/build_topic_talks.mjs` and its test (only to improve person resolution
  and ambiguous or unclear-speaker handling), `cast-lives-lanes/R3_CHECKPOINT.md`.
- Extend the generator so the whole-book registry yields role-tier people (name, aliases, home/work places where the
  source supports them, no invented lives; fills labelled with a basis, forward-anchor lint passes) and places (with
  `travel` districts when the source supports a district, so they can be walk targets), for every volume, as a new candidate
  `cast-whole-book-candidate-2026-10-29.json` that keeps all existing R1/R2 rows unchanged. Cap at a size the pack
  schema validator accepts; report counts and bytes.
- Re-run D3's topic builder against the new candidate; report how many of the 849 family steps now yield rows and
  the new rejection counts. Where speaker is unclear, use the paragraph (CLR1) to attribute when a named subject or
  a quoted reply makes it explicit; otherwise leave unattributed.
- Do not adopt the pack; the coordinator measures cost and runs the floor.

## Done check

Focused tests pass; pack validator PASS; counts (people, places, walk targets, topic rows, rejections) before and after;
lane review; one line per check. Ambiguity default (CLR12): two candidates for one name stay unresolved.

# Lane brief: J3, journey pack rows from the whole-book travel steps, and the mapper that uses them

Model: `gpt-6-luna`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force or push.
Read first: [T2_CHECKPOINT](T2_CHECKPOINT.md) (row schema for `journeys`, adapter `src/cast_journeys.js`), [D3_CHECKPOINT](D3_CHECKPOINT.md) and
[R3_CHECKPOINT](R3_CHECKPOINT.md) (the topic-row builder and the whole-book candidate it works on),
`scripts/lead_run/build_topic_talks.mjs`, `scripts/lead_run/build_replay_mapping.mjs`. Rules: CLR1-CLR8, CLR12; AD36.
Publication: scripts and tests public code, name-free, synthetic fixtures; canon-bearing outputs private under
`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/`. Never write `private_packs/`.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Whole-book travel-family steps (X4 Resume 1 rules: travel or move 1,107, paid transport 161) | about 1,270 | | no |
| Of those, origin and destination both resolve to pack places in the whole-book candidate | count | | no |
| Of those, with an explicit means, fare or duration in the step | count | | no |

## Scope

- Files owned: new `scripts/lead_run/build_journeys.mjs` and `tests/build_journeys.test.js`, `scripts/lead_run/build_replay_mapping.mjs`
  and its tests (only to map a step to its journey control), `cast-lives-lanes/J3_CHECKPOINT.md`.
- `build_journeys.mjs`: for each lead-scene travel step with resolved origin and destination (origin = the previous resolved place in the
  scene order or the scene's place; CLR1: cite the paragraph), emit one `journeys` row per distinct (origin, destination, means): label in
  plain words, `means`, `minutes` from the step or a labelled fill, `fare` only when the step states one (otherwise none; never invent
  a price), hours only when stated. Crossings into realms that have no walk target become rows too if the schema allows; if not,
  count them separately as a mechanism gap. Stable ids from the step id. Write the augmented pack as
  `cast-whole-book-journeys-candidate-2026-10-29.json` (whole-book candidate plus `journeys`, nothing else changed) in private
  `pack-backups/` with a row report (rows per volume, rejected by reason).
- Mapper: a step with a journey row maps to its exact control id; use the X4 generation command with `--pack` pointing at the new candidate.
- Validate rows with the real `defineJourneys` adapter (loaded in the test, as D3 did with `defineTopicTalks`).
- Forced canon run: one canon row per step; untaken options come later (ON2).

## Done check

Focused tests pass (`node --test tests/build_journeys.test.js tests/build_replay_mapping.test.js tests/build_topic_talks.test.js tests/lead_replay_score.test.js`);
rows validate through the adapter; counts per volume and the fraction of travel-family steps with a control; lane review with your
grants; one line per check. Ambiguity default (CLR12): when origin is unclear, no row.

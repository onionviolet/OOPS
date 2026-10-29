# Lane brief: D3, topic-talk pack rows from the whole-book steps, and the mapper that uses them

Model: `gpt-6-luna`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force
or push. Read first: [D2_CHECKPOINT](D2_CHECKPOINT.md) (row schema: `topicTalks.talks[]` with id, personId, topicId, label,
description, minutes, place, hour, knowledgeKey, choices[] of id, label, report, minutes, effects, costs; adapter in
`src/cast_topic_talk.js`), [X4_CHECKPOINT](X4_CHECKPOINT.md) Resume 1, [X3](X3_CHECKPOINT.md), [R1](R1_CHECKPOINT.md) and
`scripts/lead_run/build_cast_pack.mjs` (how the pack is assembled). Rules: CLR1-CLR8, CLR12; AD36. Publication: scripts and
tests public code, name-free, synthetic fixtures; every canon-bearing output (pack rows, mapping, census) private under
`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/`. Never write `private_packs/` directly.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Whole-book steps in the speak/ask/agree/refuse/direct/information families (X4 Resume 1 rules) | about 1,700 | | no |
| Of those, steps whose person resolves to a pack person id and place resolves to a pack place | count | | no |
| Candidate pack at `pack-backups/cast-r1r2-candidate-2026-10-29.json` (204 people, 89 places) | 204 / 89 | | yes |

## Scope

- Files owned: new `scripts/lead_run/build_topic_talks.mjs`, its synthetic test `tests/build_topic_talks.test.js`,
  `scripts/lead_run/build_replay_mapping.mjs` and `tests/build_replay_mapping.test.js` (only to map a step to its topic
  talk control), `cast-lives-lanes/D3_CHECKPOINT.md`.
- `build_topic_talks.mjs`: for each lead-scene step in the speak/ask/agree/refuse/direct/inform family with a resolved person
  and place, emit one `topicTalks.talks[]` row from the cited paragraph (CLR1): topic label in plain words, minutes from the
  step's duration or a labelled fill, a `knowledgeKey` when the step needs earlier knowledge, and one canon choice whose
  `report` is a short paraphrase (no verbatim book text) and whose effects are only `knowledge` (with basis) and, where
  the step names a stance, a `relationship` delta labelled `fill`. Stable ids from the step id. Unresolved person or place:
  no row, counted by reason. Write the augmented pack to the private `pack-backups/` folder as
  `cast-r1r2-topics-candidate-2026-10-29.json` (candidate plus `topicTalks`, nothing else changed) and a row report.
- Mapper: a step with a topic row maps to the control id `<row.id>.<choice.id>` (the quote ids the be seat shows),
  using the same generation command as X4 with `--pack` pointing at the topics candidate.
- Validate the output by loading it through the real pack schema check if one exists (`build_cast_pack.mjs` validators);
  report row counts per volume and the fraction of the whole book's family steps that now have a control.
- Forced canon run: one canon choice per row; untaken options are added later (ON2 lock), say so in the checkpoint.

## Done check

Focused tests pass (`node --test tests/build_topic_talks.test.js tests/build_replay_mapping.test.js tests/replay_mapping_household.test.js tests/lead_replay_score.test.js`);
rows validate; counts per volume; lane review with your grants; one line per check. Ambiguity default (CLR12): if a step's
speaker is unclear, no row.

# D3: topic rows from whole-book steps

Status: offline pack authoring and mapping completed; agent-verified, not
human-reviewed. No runtime integration, pack adoption, commit or push. Public
tooling and tests use synthetic identities; canon-bearing rows and source
locators are private. Rules applied: CLR1-CLR8, CLR12, AD36.

## Result

`build_topic_talks.mjs` reads the whole-book M4 scenes, registry, crosswalk and
the R1/R2 candidate. It writes a candidate that adds only `topicTalks` and a
private count report. It selects lead-POV steps in the speak/ask/agree/refuse/
direct/inform family only when one non-lead participant is named in the step,
resolves to a pack person, and the scene place resolves. Unclear party or
speaker attribution stays out of the pack. Durations use a positive step
duration when supplied and otherwise a labelled one-minute fill. Resulting
knowledge effects carry the source locator; stance changes are labelled fills.

There are 849 family steps in the whole-book input and 13 qualified rows
(1.53%). Counts per volume are in the private report. All 13 rows mapped to
their exact `<row.id>.canon` replay controls. Only one canon choice is present
per row; untaken choices remain for the later ON2 lock work.

The input has no step-level actor field. The lane therefore does not claim
confirmed lead actions. It uses explicit named non-lead participants as the
conversation target and leaves ambiguous or unresolved cases untouched. The
candidate contains no inferred prerequisite key: no prior-knowledge link was
established from the supplied step fields. This is an authoring gap, not a
runtime failure.

Target surface: offline private pack and replay mapper only. No UI viewport or
player-visible change in this lane; all runtime adoption and player acceptance
remain deferred.

## Checks

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/build_topic_talks.test.js tests/build_replay_mapping.test.js tests/replay_mapping_household.test.js tests/lead_replay_score.test.js` | PASS, 25 tests | Synthetic rows and mapper only; no gameplay proof |
| `node --check scripts/lead_run/build_topic_talks.mjs` | PASS | Syntax only |
| `node --check scripts/lead_run/build_replay_mapping.mjs` | PASS | Syntax only |
| `node scripts/lead_run/build_topic_talks.mjs ...` with the whole-book M4 inputs and R1/R2 candidate | PASS, 13 rows; 849 family steps; eight volume counts recorded | Offline private-data generation; source interpretation remains subject to lane review |
| `defineTopicTalks` against the generated candidate | PASS, 13 rows / 13 commands | Real adapter definition check; not runtime settlement or save proof |
| `node scripts/lead_run/build_replay_mapping.mjs ... --from-locator 'zh 第1章' --to-locator 'zh b8 第40章'` with the generated candidate | PASS, 11,159 steps; all 13 topic rows map; 13/849 family steps (1.53%) | Offline mapper only; input actor attribution remains unknown |

Private outputs:

- `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/cast-r1r2-topics-candidate-2026-10-29.json`
- `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/cast-r1r2-topics-report-2026-10-29.json`

No build or browser replay applies to this offline content lane. Coordinator
review, pack adoption and combined replay checks remain open.

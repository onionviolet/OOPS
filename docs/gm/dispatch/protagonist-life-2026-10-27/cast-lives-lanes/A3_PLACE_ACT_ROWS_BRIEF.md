# Lane brief: A3, place-act rows from observe, inspect, read, handle and rest steps (H1's mechanism, whole-book data)

Model: `gpt-6-luna`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force or push.
Read first: [H1_CHECKPOINT](H1_CHECKPOINT.md) (the `householdActs` schema: objects with seeded facts and resources, acts with
operation, place, minutes, costs, requires, effects, report, knowledgeKey; operations inspect, use, pay, wash, clean, consume, store, take;
adapter `src/place_acts.js`), [X4_CHECKPOINT](X4_CHECKPOINT.md) Resume 1 (families: observe or listen 555, inspect or investigate 530,
handle or move an item 897, read a text 128, rest or personal care 344, make or write 364, change or maintain state 284),
[D3](D3_CHECKPOINT.md) and [J3](J3_CHECKPOINT.md) (how row builders consume the whole-book inputs), `scripts/lead_run/build_topic_talks.mjs`.
Rules: CLR1-CLR8, CLR12; AD36, AD38. Publication: scripts and tests public code, name-free, synthetic fixtures; canon-bearing outputs private under
`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/`. Never write `private_packs/`.

## Why

H1's mechanism already carries fixed, authored local acts with quotes, costs, reports and saves. For a forced canon run, a step such as
looking something over, reading a text, taking or putting away an object, resting or washing at the scene's place is exactly such an act. The
largest remaining families need rows, not a new engine. H1 says dynamic evidence and variable recipes need their own consumers; leave those as typed gaps.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Whole-book steps per family above (apply X4's rule table) | about 3,100 | | no |
| Of those, scene place resolves to a pack place | count | | no |
| Of those, an object noun is present and extractable from the step (the thing looked at, read, taken or stored) | count | | no |
| Existing H1 operations that fit each family | list | | yes |

## Scope

- Files owned: new `scripts/lead_run/build_place_acts.mjs` and `tests/build_place_acts.test.js`, `scripts/lead_run/build_replay_mapping.mjs` and its
  tests (map a step to its act control), `cast-lives-lanes/A3_CHECKPOINT.md`.
- `build_place_acts.mjs`: for each lead-scene step in these families with a resolved scene place and an extractable object, add a
  `householdActs` object (one per place+object, a seeded fact flag, resources only where the step names stock) and an act (operation from the
  family, minutes from the step or a labelled one-minute fill, a plain-words label and a short paraphrased report, no verbatim book text, a
  knowledgeKey so it feeds knowledge, and `requires` only from stated prerequisites). Never invent stock, prices or effects the paragraph
  does not support (CLR1). Keep H1's existing 7 objects and 9 acts unchanged and first. Write as
  `cast-whole-book-acts-candidate-2026-10-29.json` in private `pack-backups/` = whole-book candidate plus the extended `householdActs`
  (nothing else changed) with a row report (rows per family and volume, rejected by reason).
- Mapper: a step with an act maps to its exact control id; use the X4 generation command with `--pack` set to the new candidate.
- Validate rows through the real `definePlaceActs` adapter (loaded in the test, as D3 and J3 did with their adapters), and check JSON-safety
  of every definition (no undefined, NaN or non-plain values; this broke the journeys candidate at page load).
- Forced canon run: one canon act per step; untaken options come later (ON2).

## Done check

Focused tests pass (`node --test tests/build_place_acts.test.js tests/build_replay_mapping.test.js tests/build_journeys.test.js tests/lead_replay_score.test.js`);
rows validate through the adapter and survive a JSON round trip unchanged; counts per family and volume and the fraction of the family steps with
a control; lane review with your grants; one line per check. Ambiguity default (CLR12): when the object or place is unclear, no row.

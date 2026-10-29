# Lane brief: RV5, ingest paragraph-reviewed rows into the pack and the replay mapping

Model: `gpt-6-luna`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force or push. Read first: [RV4 checkpoint](RV4_CHECKPOINT.md)
and the reviewed rows (private) `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/RV4.jsonl` (18 chapters 1-3 steps: 12 rows, 6 gaps) and `RV2.jsonl`
(54 gaps); [X4_CHECKPOINT](X4_CHECKPOINT.md) (builders, ordering, validators); `scripts/lead_run/build_replay_mapping.mjs`. Rules: CLR1-CLR8, CLR12; AD36. Publication: scripts
and tests public code, name-free, synthetic fixtures; outputs private.

## Scope

- Files owned: new `scripts/lead_run/merge_reviewed_rows.mjs` and `tests/merge_reviewed_rows.test.js`, `scripts/lead_run/build_replay_mapping.mjs` and its tests (add `--reviewed <jsonl...>`),
  `cast-lives-lanes/RV5_CHECKPOINT.md`.
- `merge_reviewed_rows.mjs --pack <pack.json> --reviewed <jsonl...> --out <pack.json>`: for every `verdict:"row"` line, add its `row` to the matching pack field (`topicTalks.talks`, `journeys`,
  `householdActs.objects`/`.acts`, by `kind`), skipping ids already present (idempotent) and failing loudly on id collisions with different content. Validate each added row through the three real adapters
  (`defineTopicTalks`, `defineJourneys`, `definePlaceActs`) and the JSON-safety rules (no `undefined`, no empty `requires`, `null` fares when unknown). Report counts added per kind.
- Mapper `--reviewed`: a step with a reviewed row maps to that row's exact control id (route, place anchor) and takes precedence over a generated mapping for the same step; a reviewed `gap` keeps its
  typed gap reason (`actor not the lead` and `not an action` rows are marked `excluded` with that reason so the scorer can leave them out of the denominator if it supports an excluded status;
  if the scorer has no such status, report it as a recommended V-lane change and keep them as gaps).
- Run: pack = `private_packs/lotm-cast/cast.json` (live, read only) -> write `pack-backups/cast-whole-book-reviewed-candidate-2026-10-29.json`; regenerate the chapters 1-3 mapping
  (`x1-be-mapping-2026-10-29/chapters-1-3.json` is the old one; write the new one beside it as `chapters-1-3-reviewed.json`) and chapters 1-24 with `--reviewed` RV4 and RV2.
  Report: controls for ch1-3 before/after, and whether each of the 18 reviewed steps now has an exact control.
- Validate the final pack through the pack validator and the native registry check exactly as X4 did.

## Done check

Focused tests (`node --test tests/merge_reviewed_rows.test.js tests/build_replay_mapping.test.js tests/lead_replay_score.test.js tests/build_place_acts.test.js`); counts; lane review; one line per check. Ambiguity default: id collision means stop and report.

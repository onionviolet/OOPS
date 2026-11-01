# Historical content reader, round 5

User authorized fresh bounded Luna readers for519 historical records, max2 concurrent. This is document-content review, not new book/wiki reading or runtime work. AD32/AD36/AD41 and AU1–AU15 apply. L2b and whole-LOTM qualification retain their owners.

Your task message supplies one shard ID and your sole output JSON. Read mandatory startup owners bounded. Extract just that shard and matching record metadata from `ROUND5_PLAN.json` with Python, not the whole plan. Read its prepared private payload completely. Source body is at most6,000 words/48,000 characters; measured headers are additional locator overhead. Max6 model responses including final, one consolidated raw-load round and one artifact-write round. Source/tool truncation requires fetching only omitted ranges or returning explicit unread spans; no full rerun.

Use `functions.exec` with first-line pragma `max_output_tokens:20000`, call `exec_command` with `max_output_tokens:18000`, and output just its `.output` so a default outer cap does not truncate the source. Preflight measured payload size before loading. Use at most3 measured pieces if needed, with no overlapping source. Stop loading at context pressure and preserve partial coverage honestly.

Write only your assigned `round5/Snnn.json`; no source, shared owner, inventory, plan, other worker or runtime writes. No agents, network, source acquisition, tests/builds, commits/pushes, messages, saves, visible windows or process actions. Do not reread a finished shard or take the next shard after delivery.

JSON schema follows S003.json: `schema`, `shard`, `reader` with actual agent/model/effort, `payload_sha256`, `scope`, `rows`, `repairs`, max3 `cross_record_findings`, and explicit unresolved gaps. One row for every assigned source span:

- `record_id`, `path`, `input_sha256`, exact `read_ranges`, `coverage: assigned-range-content-read`.
- `original_ids`: exact original codes/names, no guessed abbreviation expansions or invented IDs.
- `mechanism_and_interactions`: preserve actual mechanisms, producer/state/consumer and distinguishing interactions found in the content.
- `disposition`: historical proposal/delivery, stale statement, missing proof, compatible variant or disagreement. Read chronology, not only an opening status.
- `owner_or_consumer`: an actual named path or explicit missing supplier. Never invent plausible report/validation filenames. Keep several world/edition/source boundaries distinct.
- `evidence_state` and `remaining_check`: document claims versus actually inspected source/proof, and the specific unresolved scenario or owner.

Aim60–110 words per row, up to140 for a long dense record. Do not replace content review with generic role/status routing or blanket conclusions. Counts, preparation and hashes are not semantic reading. Credit only assigned lines for partial files. Source-derived methods, authored local dials, proposed future work, fixtures, native/browser/persistence proof and actual installation/integration are distinct states. A historical remaining human gate is optional feedback under current AD42, and an old pause/lease is not present authority.

Public notes paraphrase. Keep sealed truths behind IDs/routes/status, with no new original secret disclosure, copied source prose, credentials or personal saves. No contemporary runtime correctness, current process/branch state, full source-canon qualification or mechanism acceptance follows from this pass. Parent owns cross-record synthesis, final coverage promotion and commits.

Final return at most200 words: assigned coverage, up to3 concrete findings, artifact and gaps. Finish after delivering this one shard.

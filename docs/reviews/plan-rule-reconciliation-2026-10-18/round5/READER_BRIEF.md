# Historical content reader, round 5

User authorized fresh bounded Luna readers for519 historical records, max2 concurrent. This is document-content review, not new book/wiki reading or runtime work. AD32/AD36/AD41 and AU1–AU15 apply. L2b and whole-LOTM qualification retain their owners.

Your task message supplies one shard ID and your sole output JSON. Read mandatory startup owners bounded. Extract just that shard and matching record metadata from `ROUND5_PLAN.json` with Python, not the whole plan. Read its prepared private payload completely. Source body is at most6,000 words/48,000 characters; measured headers are additional locator overhead. Max6 model responses including final, one consolidated raw-load round and one artifact-write round. Source/tool truncation requires fetching only omitted ranges or returning explicit unread spans; no full rerun.

The parent preassembles exactly3 small nonoverlapping source parts with explicit continuation context, each under22,000 characters including transport metadata. Read ONE part per separate `functions.exec` response, using first-line pragma `max_output_tokens:20000` and nested `exec_command` `max_output_tokens:16000`; output only its `.output`. Never combine all3 outputs. A transport-part ending is not a record ending. Max6 responses: startup/metadata1, source parts3, consolidated artifact write/check1, final1. No extra progress response. Preflight sizes, then load each part once; if truncated, return exact unread source rather than inventing coverage.

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

Per-row fidelity: use only the assigned SOURCE block for that row. Do not substitute another lane or infer mechanisms from filenames/common rules. An initial checkpoint with promised reports has no completed mechanism/validation outcome. Add `evidence_lines` with1–3 exact assigned line ranges supporting the main mechanism/disposition; no quoted secret text. Original IDs must occur in that assigned block or be explicitly labeled as your descriptive label, not an original code.

Populate `path`, `input_sha256` and assigned ranges programmatically from plan metadata when serializing the JSON. Do not hand-transcribe hashes or paths.

Record delimiters are ONLY `BEGIN_SOURCE Udddd ...` and `END_SOURCE Udddd`. Internal text such as `SOURCE COMPLETE` belongs to the record. New payload parts contain complete line-labeled record fragments, with explicit continuation markers, so part boundaries are not record endings. Check each record against its declared assigned lines; treat a bare historical initial status and a later completion in the same block chronologically.

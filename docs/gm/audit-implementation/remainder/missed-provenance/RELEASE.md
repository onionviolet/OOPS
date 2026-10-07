# MW-03 release

**All19 contracts repaired, source checks passed.** This fixes exported provenance and definition validation; it grants no gameplay, native activation, source authenticity or expanded reading credit.

`CONTRACTS.json` now preserves all available original `ASSEMBLED_ROWS` edition/citation fields, member pins and reviewed-extent authorities. It also provides normalized path/plural-locator/supplied-hash aliases, nonempty reviewedSourceRefs and a stable exact per-contract retrieval binding: assembled repository path, captured SHA-256, canonical row ID, row JSON pointer and source JSON pointer. Existing qualifications, reviewed/pending extents and edition limits stay verbatim, including incomplete/review-pending lanes. Original content has truthful authored-document provenance without an invented book hash.

`book_world_player_agency_contracts.js` keeps existing immutable contracts, alias resolution and result API. Its source-class-aware validator rejects empty available records/fields, dropped edition/source hash/qualification/reviewed extent, missing source-owner paths/locators/review references, conflicting normalized aliases and malformed retained hashes. Only supplied-novel classes require an actual supplied-book hash. The five classes are original1, supplied-novel12, game-reference3, manga/anime-reference2 and bounded-publisher-reference1.

Checks on final source/data inputs:

- `node --check src/book_world_player_agency_contracts.js`, ESM import and integrity: `valid:true,count:19,errors:[]`; every existing alias resolves.
- Definition-only omission review:69 deliberately lossy copies rejected, covering empty edition/citation/reviewed-reference projection for all19 plus missing supplied-source hashes for all12 novel rows. This evaluates definitions only, not gameplay or save state.
- Static comparison: all original available source fields retained, all19 non-source contract objects unchanged, all19 activation flags remain false. All108 distinct repository provenance links exist. Exact input/output hashes and per-row coverage are in BEFORE/COVERAGE/EVIDENCE.

Shared consumer requirement: main currently ignores the returned integrity result. Root should check `.valid` and report/reject errors before consuming the contracts if startup fail-closed enforcement is required; changing main belongs to root. The validator itself already returns `valid:false` for lossy provenance. No other shared consumer change, schema, migration, source-world activation or library reread is needed.

Ownership released: the two assigned files and this evidence directory are ready for root inspection/integration. Historical original-contract receipts remain untouched; this repair supersedes their provenance-completeness assertion only. No shared/canonical/runtime-build/private-save/book-library mutation, dependency install, commit/push/publication/automation or subagent occurred. Gameplay/save/director gates remain deferred and unrun under the root remainder policy.

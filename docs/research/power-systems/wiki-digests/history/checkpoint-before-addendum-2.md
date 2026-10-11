# Lane W checkpoint after dump addendum

IDENTITY: Lane W wiki-research owner, 2026-10-10 UTC. Same authorized task resumed from 01a12449-a934-71d1-b74a-04d4ab00364c. No child agents.
STATE: Authorized API/dump pass and bounded revision review finished. Requested source coverage is not fully acquired or canon-certified; the named access gates remain open. No lane W network or extraction process remains active.
OBJECTIVE: ASSIGNMENT_COMMON.md and ASSIGNMENT_W.md, including its Fandom database dump addendum. Current AGENTS.md, PROJECT.md and GM refresh guidance govern; new data is secondary research and proposals only.
OWNERSHIP: wiki-digests output folder and explicitly authorized Status cells in matching SOURCE_REQUESTS.md rows. Three newly identified dump-source gaps appended as S95-S97. No E8/E9, A-C/D survey, gameplay source, bundle, save, build, commit, publication or lncrawl-polite repository edits.

## Current outcome

- 74 Fandom wiki identities checked through the public S3 pattern. 141 serial HEAD/GET requests across the full same-task pass. At most two distinct database-name keys per wiki. Minimum observed gap: 4.026509 seconds. No 429/throttling occurred, no login or archive restore was attempted, and no failed URL was retried.
- 13 compressed archives acquired and streamed with py7zr 1.1.3. Archive SHA-256, bytes, Last-Modified, XML source identity and selected-page revision/text hashes are in DUMPS.json and DUMP_REVIEW.json. Whole XML was not materialized on disk. Offline candidates are capped at 400 per archive; only the 41 claimed sections were semantically reviewed.
- 41 dated secondary claims across 13 subjects. Together with the prior two API subjects, 15 subjects have bounded revision findings. Shadow Slave is an older-community snapshot, so only 14 of those are the requested current communities. All 119 subjects, including the four addendum-only entries, have digest/coverage files.
- JJK, Harry Potter, Elden Ring, Skyrim and Fallout have source-qualified law-lore sections for E9. RI, HxH, Fate, DCC, DS1 and the historical Shadow Slave snapshot have narrower comparisons. Source-missing LOTM, MoL, Paradise and Cradle remain explicit gates; no new lore was invented for them.
- Nine matching original wiki request rows are covered by dated dumps: S17, S18, S22, S25, S36, S37, S59, S64, S65. Only their Status cells changed. The current Shadow Slave request stays open because dbname shadowslave belongs to shadow-slave.fandom.com. Additional open source requests: S95, S96, S97.

## Artifacts

REPORT.md is the current entry point, with full inventory and remaining gates.
CORRECTIONS.md and NEW_MECHANICS.md compare the evidence with live E8/E9, including already-folded JJK corrections. Existing ideas are labeled corroboration instead of new inventions.
DUMP_MODEL_MAP.json gives source-bounded E8 axes, E8B family/means, E8C path and E8D slot mappings. Unknown values remain unknown.
SOURCES.md gives archive and section attribution. DUMPS.json is acquisition metadata only; no wiki body is tracked.
SERIES.json holds 119 coverage records; REVIEW.json remains the prior 28-claim API ledger; DUMP_REVIEW.json is the 41-claim dump ledger.
DUMP_COVERAGE.json records matching host status edits and new request IDs.
DUMP_VALIDATION.json passed hashes, size, revision/source identity, Skyrim bounds, two-key limit, request pacing/cache uniqueness, no pending request, request IDs, local links, unique digests and historical aggregate hashes.
VALIDATION.json links the current and historical check scopes.

## Constraints and corrections retained

Most missing keys were naming misses or unretrievable DEEP_ARCHIVE objects. HEAD 200 never became a content claim without a successful GET and offline read. LOTM, Chainsaw Man, Undead Unluck, Worm, Stormlight, Mistborn and ORV remain storage gates; MoL and Paradise remain naming gates. Bleach, Naruto, Marvel and DC second keys were also storage gates. Cradle's qualified current wiki is outside this Fandom route. No successful HEAD exceeded the 1.5 GB compressed cap; there is no size-cap skip.

A single Naruto transport close was cached and never retried. Initial code incorrectly stopped unrelated keys on that transport error; it was corrected to continue other keys while retaining global 429/throttling stops. Initial S3 error bodies were hashed and their parsed code/headers saved, not retained whole; they are not article evidence and were not refetched.

Free space fell from roughly 7.2 GiB to about 255 MiB. A generated-index gzip operation failed during the shortage. Complete plaintext originals were retained; failed gzip derivatives were removed only where the complete original remained. Hash-checked hardlinks reclaimed 487,393,865 bytes from eight duplicate generated indexes. All raw compressed archives remain intact; unrelated data was untouched. Four small second-key GETs then used cached HEAD metadata and returned storage errors. No duplicate HEAD fetch.

## Resume

Raw archive/cache state: ~/.codex/research/wikis/. Route receipts: dump-route-state.json. Refined page selections are in each dump's selection-v2/selection-v3 or alternate-db folder. Identical index files may be hardlinked, and complete compressed generated indexes may use .jsonl.gz.

Current renderer: integrate_dumps.py, then validate_dumps.py. The old API-only review_and_render.py is deliberately guarded after dump integration to prevent reverting current evidence. Private dump-tools retains the qualified second-name and offline-refinement helper scripts. Reuse cached data and failed-key receipts; do not reset closed wiki API hosts or refetch dumps.

Remaining acceptance gate: a permitted revision export, newly supplied retrievable offered dump, or primary source for an open source request. For a direct adaptation, choose the source version and resolve explicit conflicts before freezing its law. This research pass does not approve implementation or fictional balance. Claude owns E8/E9 integration.

Historical aggregate hashes and prior artifacts are under history/pre-dump-addendum. The preceding working checkpoint is preserved at history/dump-run-checkpoint-before-final.md. No work remains active under lane W; source gates are visible for the next authorized intake.

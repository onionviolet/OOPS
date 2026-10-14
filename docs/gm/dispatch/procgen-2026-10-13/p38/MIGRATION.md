# Migration from P34 S-2 and live stores

2026-10-14. **PROPOSAL ONLY.** No saves were opened or changed. Root chooses numeric schemas, integration order and current writer reservations. P38 neither implements migrations nor commits/merges branches. Existing `save_files` validation/preflight/write order is the baseline, not an assumed transactional archive implementation.

## MG1: known starting versions

Initial main inspection: HEAD `4e13f97f4dfe43360b6d02ac6dc6bf72737b2add`, the P1-P4 integration merge. P2 branch report's unmerged wording is an earlier snapshot. P34 `proc/p34-story-spine` contains S-2 commit `6b0f1f328aa001664b72d46bea2f141871813a79`; main does not contain that commit at the audited ancestry check. At initial inspection its later request/aftermath producers were dirty; refresh found committed S-3 `6af99aec` and S-4 `364d8300` with subsequent QA/save work dirty. Migration binds committed S-2 bytes first and current producers separately. [SOURCE_AUDIT](SOURCE_AUDIT.md) and [SOURCES.json](SOURCES.json) retain evidence.

P34 S-2 uses optional `expansion.loreHistory` schema 1, `nextId`, `enrolledAt`, `evicted`, and up to 96 receipts. IDs are `story.outcome:<ordinal>`; strict validation requires world `base.frontier`, place `Village`, supported action enum, previous retained history causes and nonzero item/coin/skill deltas. It does not establish whole-life capture or generic world refs. Main already has optional simulation, top-level npc_lives/generated_people/life_record/mixtures and private-content owners with their own validators.

## MG2: additive phases, preserving one authority

| Phase | Change proposed | Preservation gate |
|---|---|---|
| MG2a read façade | Bind legacy qualified refs and expose BI2 availability/coverage over current records; no physical migration needed for first queries | Same names/IDs/terms/resources/clock/draws and observer output; optional owner absence retained |
| MG2b successor history | Convert S-2 records to one root-selected successor schema under the existing loreHistory owner; add scope directory, operation protection and legacy ID aliases | Each retained original row is losslessly recoverable; no payout/draw/account delivery at migration |
| MG2c prospective enrollment | Register only selected producers, query contracts and pins at an explicit activation boundary | Historical gaps marked, no retroactive requests/people/achievements; initial draw state untouched |
| MG2d domain joins | Route new requests/promises/threads/accounts to sole owners, retaining old backing adapters where needed | One funds/custody/axis writer; pending quotes and terms complete under their pinned resolver |
| MG2e compaction/storage | Enable BI4 only after query/operation parity, then optionally introduce archive chunks | Required receipt closure and full export/import portability; missing chunk cannot settle a command |

A physical all-store rewrite is optional. Reference-only P4 and partitioned relationship/knowledge façades remain useful longer-term options. Broader worlds, exact archival mode and a compact Village pilot stay reachable; no one must migrate all story features before one request can work.

## MG3: S-2 field mapping and honest limits

| S-2 field | Successor mapping | Handling |
|---|---|---|
| `id`, `ordinal`, `nextId` | Legacy alias → canonical receipt, append ordinal high-water | Preserve exact ID references and gaps; do not renumber into an apparent complete series |
| `operation` | Legacy producer operation key under bound original scope | Keep full string and prior result; duplicate different payload rejects. Future structured keys use a versioned codec |
| `worldId`, `targetPlace` | Explicit legacy world-instance/place bindings | Map one declared legacy scope, never create a new instance on every load |
| `actor`, `targetPerson` | Qualified simulation/P4/person bindings where supported | Preserve local IDs; no name matching or automatic enrollment |
| `issuer` | Typed person **or definition** role | S-2 falls back to event.definitionId when no target person. Do not invent a person for every card |
| `targetObject` | Legacy item type/key ref, not automatically a physical copy | Retain exact private key. S-2 chooses first changed item; other targets remain in applied deltas |
| `action`, `result`, `producer`, `revision` | Original action/outcome and producer revision | Preserve literal semantics; normalize with reversible adapter, no new fiction |
| `at`, `enrolledAt` | Expansion clock binding and enrollment coverage | Do not assert native calendar date without an actual saved anchor |
| `causeRefs`, `historyCauses` | Qualified cause links / causal receipt parents | Existing non-history cause refs can point to legacy opaque cause capsules; no invented applied effects |
| `audience`, `known.label` | Legacy visibility evidence and frozen safe label | `discoveredBy` shows awareness, not comprehensive eyewitness coverage or a delivered belief for every consequence |
| `applied` | Lossless legacy deltas with owner/kind/key/delta | Capture includes external money plus gameplay inventory/skill XP only; other effects remain unspecified |
| `evicted` | Legacy loss/coverage metadata | Count cannot identify missing receipts, witnesses or dedup keys. Preserve uncertainty |

S-2's coin delta has key `wood` while its data comes from `external.money`. Preserve the original row exactly; attach an adapter annotation `legacyExternalMoney`, with currency semantics verified from the actual native owner before normalizing to a unit. Do not interpret it as a wood-item transfer or silently rewrite it. Its `known` values are labels, not an entire immutable observer disclosure rule.

P34's retained-operation search cannot recover already evicted operations. Activate strengthened operation recording prospectively, and retain all recoverable legacy guards from their owners. Missing old operation identity remains a coverage gap. If an imported legacy command has no trustworthy outstanding/settled disposition, suspend its replay-capable path or use the exact old resolver's guards; never rerun it to discover whether it paid. A scalar `evicted` cannot create a complete replay watermark.

## MG4: live store compatibility matrix

| Existing store | Preserve | Proposed evolution |
|---|---|---|
| simulation | Actors, jobs, events/frozen responses, sites, custody, per-check/deck RNG, causes/claims, axes/knowledge | Add producer hooks after actual effects and before pruning/publication; do not remove legacy guards or alter unrelated once metadata in migration |
| npc_lives | Saved authored people, death years, parent/spouse links, annual event/news behavior | Read-only identity adapter; admit confirmed transitions prospectively. Future scheduled rows are not already occurred deeds |
| generated_people | Three identities/names/traits, purse/supply goal, knowledge, routine/calendar/RNG | Bind refs; old fulfilled boolean remains authoritative for its old supply obligation. No reset to repeat it, duplicate purse or new family |
| people_knowledge | Safe introduced/contact projections | Route lookup through qualified adapters; no new store or load-time introductions |
| life_record | Recent milestones, yearly counts/highlights, earlier totals and loaded-date behavior | Keep legacy biography as display evidence; no mining for exact promises, talent grants or eyewitnesses |
| world_visit_history | Active/reference/mission and retained first/second/latest visits, synchronized clocks | Adopt typed pin strengths only through that owner's accepted schema; maintain validation-before-pruning |
| event_feed | Known opportunities/accounts, eight-news window and links to real controls | Add known shared receipt projection if selected; no global-log dump or settlement on reading |
| save_files/main publisher | Original validation, real loader preflight, guarded write, optional-owner restore, backups/export | Validate successor graph/closure/coverage and complete holder closure before storage mutation |
| P2 mixtures/exposure | Frozen products/knowledge/methods/reserved inputs and consumed-source effects | Directory references existing product keys; per-copy metadata additive. Catalogue/holder validation still uses old law |
| causal-story proof ledgers | Exact strict receipt/closure schemas and recovery capacity | Read adapter or enclosing ref manifest; do not append arbitrary generic fields to proof rows |
| content packs / temporal owners | Definition locks, safe missing-content rules, active visits/carry state | Save supported pinned revisions or explicit dormant preservation. No imaginary fallback source |

Missing optional new owners stay absent. Current legacy migration behavior, including life_record's remembered beginning at loaded date, is preserved; no new generated historic deeds appear. New enrollment starts at the actual current clock with explicit producer coverage. No fees, promotions, births, bonds, knowledge or grant callbacks run while restoring adapters.

## MG5: publication, import and reversibility

Migration is a pure transformation on a detached copy. Validate original, normalize only declared versions, build identity aliases, map each retained receipt, establish pins/operation directory/coverage, validate all participating owner graphs and compare preservation queries. Compute final full-envelope/origin size before write. Publish only after the same durable write used by the host. Failed conversion/write retains the prior slot and native state. Do not delete another save or backup to make it fit.

Keep a migration manifest with from/to schema, source digest, adapter revisions, coverage losses, field mappings and preservation-query results. A compatibility capsule stores only information necessary to reverse selected conversions. Do not permanently keep a second complete history copy in every save and double its size. Rollback after new gameplay is not a trivial reverse map: an old binary that cannot preserve new obligations must reject the new format. The original external export is the supported route back to the original snapshot; creating one is a future user-selected operation, not something P38 did.

Malformed/future schemas, duplicate IDs/operations, unsupported active handlers, mixed-lineage refs, impossible clocks, missing hard chunks and dangling custody/receipt refs reject **before** import writes. A dormant/archive mode can preserve unsupported records only through an explicitly implemented whole-envelope policy; not all live loaders support it. Safe frozen accounts may be readable while their executable commitments are suspended. No reroll, silent strip or partial payment import.

## MG6: future evidence, all NOT RUN

| Gate | Required comparison |
|---|---|
| Legacy absence | Fresh/old disposable fixture with no new owners has unchanged native behavior and next draws |
| S-2 conversion | Pending/open and settled records, deleted ordinal gaps, issuer definition, multiple applied items, external-money key, zero additional grants |
| Capacity/replay | Eviction boundary, all request pins, resolved event still holding historyRef, dangling parent, different-payload duplicate, legitimate new cause, reserve exhaustion |
| Domains | P4 same name as household/simulation contact; exact P2 exposure after consumed vial; old axes/knowledge preserved; future npc event not treated as lived |
| Publication/import | Failed migration/write/preflight/backup, malformed future schema, missing pack/chunk, literal-file roundtrip with complete graph and next draws |
| Retention/LOD | Query parity, negative coverage, promotion/demotion, active deadlines/custody, independent clocks and fork carriers |
| Playable acceptance | Own rebuild then fresh 1366x768 and 1600x1000 request → real result → recap → later callback; Save/reload/Export/literal-file Import before/after migration. Natural/seeded-native/source labels separate |

No runtime tests, builds, browser or persistence proof were run by P38. Human fiction, balance and feel remain separate from these technical gates.

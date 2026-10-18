# Continuation state coverage and compatibility plan, 2026-10-15

Current direction update: [reciprocal connection and optional intentional loops](../worlds/CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md#reciprocal-return-and-intentional-loop-direction-2026-10-15)
are accepted; CP1–CP7 execution is now assigned to the cheat chat. This report
remains the earlier source-inspection/proposal snapshot. Its fingerprints and
implementation-blocker observations are not freshly reverified runtime status.
This chat has no runtime reservation and changes canonical documentation only.

## Result, authority and evidence limit

The slice has useful existing fresh-game, native-save, preflight and guarded
publication seams. **It does not yet have a demonstrated coherent multi-life
store, mastery projection or occupied/incapacitated switch.** These are engineering
blockers, not another broad player-preference interview. This plan is source-
inspected and proposed; no gameplay, migration, build or compatibility test ran.

[Current request](../USER_VISION.md#concrete-continuation-coverage-and-compatibility-request-2026-10-15)
and [worked profile](../worlds/CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md#activation-recovery-profile-and-fresh-life-return-walkthrough-2026-10-15)
own scope. Accepted rules: separate-history fresh life with paused old life;
means-based return; one continuing self; remembered mastery with means-dependent
expression; enduring base-cheat growth; quiet faculty; unconscious-body choice
access subject to actual means/suppression. Ordinary resume, temporal rewind and
fresh history are distinct. First milestone remains one realm/one prestige layer.
The [exclusive cheat brief](CHEAT_ACCESS_DESIGN_DISCUSSION_2026-10-15.md#bounded-implementation-brief-quiet-continuation-and-one-learned-checkpoint)
is a proposal. Its old broad Q1 language cannot reopen later accepted history rules.

Read-only inspection used the dirty shared checkout. Source fingerprints below
identify this inspection, not a build or stable live-worker state. No exclusive
cheat/representation records, runtime/source/styles/tests, user saves, storage,
worker processes or commits were changed. Later implementation must recover actual
write ownership and recheck changed source. All P/T/K recommendations below remain
implementation proposals, not newly accepted product defaults or migrations.

## F1–F8: reusable mechanisms and material source gaps

| Code | Checked source | Finding / consequence |
| --- | --- | --- |
| F1 | [main.js](../../src/main.js), create_save/load; [save_files.js](../../src/save_files.js), validateSaveEnvelope | Current native envelope includes far more than expansion. Direct serializer roots are inventoried below. Whole-life consistency needs native body, stock, NPCs, quests, clocks and extension validators together. |
| F2 | [import_probe.js](../../src/import_probe.js), freshNativeSave/preflightImport/installImportProbe; main fresh-probe boot | A genuine disposable native beginning and real-loader preflight already exist. Reuse them. Fresh probe inherits current URL parameters; explicitly bind/sanitize the selected start/candidate context before using it as B. It is not an arbitrary world/body generator or proof of zero side effects. |
| F3 | [native_authority.js](../../src/absorb_p23/save_time_options/native_authority.js), parse/publish/commitPreparedSave; main activeNativeBytes/lifeSaveStorage | Enrolled root schema 1 has current/previous/release/revision/schema with strict shape. It stores native snapshots, not a life registry/journey/checkpoints. Existing writer lock and one-root checked publication are useful; do not add another independent authority. |
| F4 | main assertAuthorityIdle/authorityOperation/update_timer/save_to_localStorage/load | Existing recovery wrapper refuses combat/activity/action/dialogue/sleep/reading/occupation. It cannot be reused unchanged for accepted occupied/incapacitated continuation. Load restores activity/sleep/reading and can call action starters. A transition needs its own quiescence plus suspended-arrival contract under the same writer, not a blanket free-body restriction. |
| F5 | main create_save; [levelable_component.js](../../src/components/levelable_component.js); [data/skills.js](../../src/data/skills.js) | Player and NPC XP share levelable records; skills can produce stat/effect/parent/level consequences. No general remembered-versus-embodied portability declaration was established in the examined definitions/save format. A blanket sum/max/copy of saved XP is not a mastery implementation. |
| F6 | [life_experience_host.js](../../src/life_experience_host.js); [structured_life_runtime.js](../../src/structured_life_runtime.js) | Heir builder requires ended life and carries selected household/date/property conventions. Structured archive path requires scoped death proof and publishes an independent destination. Neither is a living paused-history resume implementation; reuse validation concepts without inheriting death/heir semantics. |
| F7 | [world_instances.js](../../src/world_instances.js); [seeded_streams.js](../../src/seeded_streams.js); main kill_player | Instances have IDs/revisions/freeze-absence clocks; encounter snapshots have saved turns/loops/enemies and streams. Those are real seams. Generic current_game_action/dialogue/trade callbacks are not equivalent saved continuations. Native defeat logs unconsciousness and relocates/recovers, so total_deaths is not a terminal-body event. CA14 needs an actual durable faculty/choice integration, not a renamed death counter. |
| F8 | main create_save/lifeSaveStorage; [everyday_life.js](../../src/everyday_life.js); [life_record.js](../../src/life_record.js); [npc_lives.js](../../src/npc_lives.js) | Save construction observes life/route knowledge, computes NPC-year state and invokes six native adapters. Persistence also publishes native domains. Treat capture as an owned operation, not an assumed pure clone. Inspection/preview must not enroll/learn/settle merely to prepare a choice. |

## Concrete state disposition register

C1–C19 cover **83 unique direct top-level field names** assigned by create_save
at the inspected source. Extraction removed comments and normalized dot/bracket
assignments; every extracted name is assigned once in this register. This is a
finite serializer inventory, not an AST proof, a complete nested-field audit or
an assertion that every field roundtrips correctly. Conditional adapter roots,
retired data, browser-only state and currently missing continuation records follow.

| Code | Owner group | Direct native fields | Proposed coverage and portability |
| --- | --- | --- | --- |
| C1 | Metadata | `game version`, `fork_schema`, `saved_at` | Native snapshot metadata/version. Track root/content/transition revisions separately; saved_at is not an offline reward entitlement. |
| C2 | Body and effective progression | `character`, `levels` | Split, do not copy wholesale: body/name/equipment/money/HP/character level stay local; learned mastery has an explicit journey mapping and effective-body projection. Preserve original local bytes. |
| C3 | Local clocks and exposure | `current time`, `rain_counter`, `cold_status_counters`, `pacing_e1`, `p23_exposure` | Restore with the history; never catch an inactive life up to the new life's calendar or wall clock. Keep local aging/conditions distinct from journey duration. |
| C4 | Place, campaign and access | `current location`, `locations`, `availabilities`, `global_flags`, `quests`, `last_combat_location`, `last_location_with_bed` | Local exact state, including task/availability/global-flag cross-bindings. Do not copy A's quest, recognition, creation flag or unlocked destinations to B. |
| C5 | Custody and equipment | `inventories`, `npc_equipment`, `equipment_durability` | Local exact owner/key/count/per-copy condition; verify equipment/inventory/NPC bindings together. No physical carryover without means. |
| C6 | Local people and household | `npcs`, `npc_lives`, `generated_people`, `household`, `village_career` | Local exact state and their own calendar/claims/teaching custody; new history initializes actual new people. Do not reuse A's people or advance its lastYear from B. |
| C7 | Work and learning activity | `current_activity`, `books`, `is_reading`, `is_sleeping`, `work_ledger` | Local progress/occupancy/book evidence; separate remembered learning from physical book/custody. Preserve work, but destination/load starts paused, not by replaying start/settlement hooks. |
| C8 | Effects and products | `active_effects`, `mixtures`, `harvest`, `meadow_pen` | Local exact state including expiry, causal source, products/recipes/batches, stock and nested jobs; applicable remembered procedures require declared mapping. |
| C9 | Current tactical stance | `stances`, `current_stance`, `selected_stance` | Local action/effective stance; revalidate supported stance after mastery overlay. No duplicated entry costs or inherited forbidden stance. |
| C10 | Encounter and replay | `native_encounter`, `combatOptions`, `p23EncounterProfile`, `p23EncounterReceipt` | Local exact encounter/turn/loop/receipt context. Restore suspended without live callbacks. See source gaps for unsaved generic UI/action state. |
| C11 | Local economy and observed knowledge | `enemy_killcount`, `item_log`, `loot_sold_count`, `fort_supply`, `absorb_local_life`, `absorb_repeat_search`, `p23_drop_observations`, `p23_market_life`, `field_familiarity_p07`, `p23_leisure_memory` | Mixed local outcomes/stock/exposure and observed knowledge. Preserve local record; project only actual carried knowledge rather than copying every discovery/market/career benefit. |
| C12 | Embodied growth and equipment extensions | `p23_growth_profile`, `p23_growth_earned`, `p23_living_gear`, `p23_salvage` | Local exact by default. Separate any actual remembered learned component from bodily conditioning, worn items and material growth; no generic XP-copy shortcut. |
| C13 | Composite expansion | `expansion` | Full nested native extension owner, not the complete game by itself. Includes independent RNG/jobs/actors/sources/claims; journey overlay is only an explicit mapped subset. |
| C14 | Cheats and content bindings | `cheats`, `content_packs` | Per-means mapping, not all cards/pack state across lives. Base-faculty growth needs an actual owner; strict card schema does not already implement it. Preserve optional pack bindings in A. |
| C15 | Life record | `life_record` | Preserve local chronology; a journey view must identify life/history and not reinterpret old dates. Existing observeLifeSave uses world ID, insufficient by itself to distinguish two histories of that same world. |
| C16 | Historical counters | `total_playtime`, `total_deaths`, `total_crafting_attempts`, `total_crafting_successes`, `total_kills`, `total_crits_done`, `total_crits_taken`, `total_hits_done`, `total_hits_taken`, `strongest_hit`, `gathered_materials` | Preserve local recorded statistics for existing consumers. Do not sum snapshots into journey rewards or use a death counter as a true-death trigger; no new aggregate progression granted. |
| C17 | Comfort and mixed options | `language`, `options`, `display_preferences`, `customization`, `message_filters`, `skill_category_order`, `skill_list_state`, `are_finished_quests_hidden` | Keep current comfort preferences separate from history. options is mixed: whitelist comfort fields; world/gameplay policies stay with their selected scope. Display import honors existing browser settings. |
| C18 | Known local favorites | `favourite_locations`, `favourite_consumables`, `favourite_items`, `faved_stances` | Retain per-life favorites, or filter any shared convenience by actual known/supported content. A remembered preference must not reveal unknown items/places in B. |
| C19 | Export claim timing | `last_rewarded_export` | Carry current anti-repeat export-claim timing across ordinary switches; no export reward from transition or save construction. This preserves existing claim discipline, not a new reward policy. |

**A1, conditional native adapters:** create_save calls snapshot for Tidemark,
nested campaign, Paradise, Mother of Learning, Proto23 and causal-story native
bridges. Preserve each complete emitted metadata domain and its linked inventories,
people, quests, availability, clocks and revision together when present. Source
checks included the bridge snapshot/restore entry points, not every private pack.
Absence must remain absence; no automatic enrollment or source-world acquisition.
Do not execute a resume with a missing adapter/content revision. These are preserved
compatibility domains, not permission to expand the slice into all those worlds.

**A2, dormant and unknown data:** [save_compatibility.js](../../src/save_compatibility.js)
retains retired content through retired_content, including its recorded paths.
Preserve that dormant payload with its native life. validateSaveEnvelope accepts/
migrates registered structures, but create_save constructs a fresh known envelope;
unknown top-level data is not guaranteed to survive ordinary future saves. Keep
original bytes on rejection. A new continuation manifest must either own/preserve
compatible extra fields or reject unsupported execution explicitly. An opaque
archive may remain exportable without being represented as resumable. Never claim
arbitrary forward compatibility by spreading unknown fields into live globals.

**A3, browser/session state:** preserve current local display/workspace comfort and
navigation separately. [display_settings.js](../../src/display_settings.js) has a
browser key and imports only unset preference fields; main saves also export a
display_preferences payload. Do not overwrite current comfort on historical
resume. options mixes comfort and gameplay policy and needs a whitelist. Current
trade basket, open dialogue/menu selection, UI nodes/timers/DOM and message layout
are not world history; release transient UI references without spending/refunding
uncommitted trade or replaying an action. Known favorites cannot leak B's unknowns.

**A4, new records required, not yet implemented:** continuing-self identity and
learning ledger; current base-faculty upgrade/cost state; active embodied-life
pointer; per-history native snapshots and revisions; per-life anchor references;
current pending recovery choice; one transition receipt/expected root revision;
optional standing trigger/destination only if selected; history/source-content
compatibility manifest. Bank continuity is accepted, but implementing a generic
bank is not implied by this slice: preserve any actual supplied journey bank once;
do not mint one or add a parallel bank ledger. Exact new schema/field names remain
an implementation design under the existing authority, not changes made here.

## P1–P7: resolved storage, switching and mastery proposals

**P1, one versioned authority:** keep the existing release/save writer lock and
replace the logical active-save unit through one versioned root. Conceptually it
owns the journey, active-life pointer, native life records, checkpoint references
and latest transition receipt. Native per-life payloads contain no recursively
nested authority, all other histories or previous backup roots. Reuse immutable
content definitions; keep actual mutable histories distinct. Exact root version,
key migration and representation require code, not a second timer/save writer.
Continuation enrollment is explicit and distinct from enabling optional Undo.

Existing schema-1 native authority cannot simply receive extra fields: its strict
parser rejects them. The future reader/writer and export/import routing must be
versioned coherently. An absent continuation root leaves existing saves unchanged;
a present invalid/incompatible root must never trigger legacy fallback/new game.
Legacy keys and original enrolled root bytes remain preserved during adoption.
No overwrite/migration/enrollment is performed by this plan.

**P2, ordinary switch:** quiesce actual gameplay producers at a coherent event
boundary; finish already-committed effects but do not run another tick. Capture A
with its real active work/encounter, stage B or a supported A resume, overlay only
current journey values by explicit bindings, validate/preflight in a disposable
non-saving document, revalidate writer/revision, then publish the complete root
once. On success, reconstruct through a clean document using the committed active
pointer; this avoids pretending that arbitrary in-place load clears all globals.
Failure before publication preserves the old root and source session. Failure to
reload after publication resumes the recorded destination on next boot, without
spending again. Source byte identity is captured after its legitimate boundary
settlement, not before an already landed effect. No post-write rollback sequence
is treated as equal to one-root atomic publication.

**P3, suspended reconstruction:** existing loaders restart jobs/reading/sleep and
may reestablish encounters. Add a transition-specific saved arrival/pause mode
that restores owned progress without issuing start costs, settlements, RNG draws,
combat timers or offline catch-up before the player resumes. This mode must cover
ordinary save/reload of the post-transition result too. Preserve valid occupations;
do not borrow assertAuthorityIdle to drop accepted busy/incapacitated access.
For a transient action whose progress is not currently serialized, explicitly map
its kept-progress fields and reserved inputs, or retain only its actual defined
cancel outcome at the owned boundary. An unclassified paid/in-flight action is an
implementation blocker, not permission for silent loss or a fake completion.

**P4, fresh B:** use freshNativeSave with an explicit allowed context for the
selected start, and validate the genuine output. For this first proposed proof,
two capable ordinary starts in separate histories of one existing world suffice;
this is a specimen, not replacement of guided randomness across eligible starts.
Bind new history/body/life IDs and source/content revision, record the resolved
selected result once and preserve A. Copy only mapped journey learning/faculty
state and whitelisted comfort. Do not copy A's cash, equipment, active pack,
relationships, availability or heir memorial. No hard_reset/removeItem path.
A retry cannot reroll an already committed start. A preflight preview does not
change live RNG or awaken a status-window card as a substitute for the quiet faculty.

**P5, mastery:** declare portability per encountered learning domain: remembered
method/proficiency, embodied development, external entitlement, or mixed. Retain
actual remembered learning by stable acquisition/progress provenance; do not sum
A/B snapshots, indiscriminately take max XP, or subtract unknown level-up side
effects. Derive the current body's executable expression from that learning plus
body/faculties/tools/world means. Native character level/physical conditioning,
owned books/items and NPC XP remain their local owners unless a real transfer
power says otherwise. A returning A keeps its body; later learning expressed there
must not replay XP awards, parent rewards, unlock payouts or material benefits.
The first implementation must map every player-skill/domain it actually exposes;
unknown mixed skills cannot silently reset or become fully portable. Start with
a concrete supported learned-method consumer plus the required mappings for the
selected capable bodies. All-skill/body generality remains unproved until covered.

**P6, replay/chronology:** preserve each history's actual calendar, RNG streams,
encounter loops, pending jobs and local claims. B's wall-clock/time does not advance
A. Current journey memory/upgrade/bank values must not be overwritten by A's older
copy. Ordinary resume uses the departure state; checkpoint rewind uses its explicit
earlier affected-world scope plus current retained journey data. Scenario rewind
is not a whole-world rewind template by itself. Same actual draw may resolve
differently under improved effective skill, consistent with accepted CA12. Native
world-ID-scoped streams must remain inside the correct per-history payload; two
histories sharing base.frontier must not accidentally share one mutable cursor.

**P7, claims and safeguards:** use root revision + transition/event identity for
one settlement. Recovery trigger, selected anchor/profile and any standing fallback
are separate from view/navigation. Preserve current export-claim timing across
ordinary switches; no reward from creating/exporting a candidate. Ordinary automatic arrival pauses; only an explicit selected repeat policy may
start a new supported cycle. Never replay stale callbacks or the same committed
attempt. An intentionally chosen repeat may revisit a dangerous/fatal scenario
under actual means without being mistaken for duplicate processing. Do not invent global anti-loop caps or
numeric carryover percentages. Native unconsciousness remains native recovery;
accepted unconscious-faculty access needs an actual bound condition/choice channel.
True-death integration is separately labeled if its event is not present in the
selected native journey; lack of that event does not remove voluntary/CA14 scope.

## K1–K9: compatibility and failure plan

| Case | Proposed behavior and proof required before release |
| --- | --- |
| K1, existing unadopted save | Existing boot/save/export behavior unchanged. Opening the continuation view grants nothing and does not enroll. Preserve legacy original bytes; optional fields remain absent rather than invent lived history. |
| K2, explicit adoption of a compatible current save | Validate and real-loader-preflight a detached native candidate. Keep exact original save/root bytes. Initialize journey identity from declared actual learning/means and establish a truthful adoption baseline. It is not the historical first-arrival point; do not manufacture earlier rewind. Publish root and active pointer together. |
| K3, existing enrolled Undo root | Handle schema 1 as a distinct input; retain both current/previous originals. Upgrade the authority/boot/normal-save/import/export paths together. Do not implicitly enable Undo, discard its backup or hide a stale legacy fallback. Old readers are not assumed safe just because game-version strings match. |
| K4, older native component/legacy save | Existing prepareV06Save/prepareFoundationSave/native loader migrations remain their owners. Validate canonical candidate and preserve originals; no migration by copying A into a fresh heir. The original calendar/book/XP interpretation is verified with retained fixtures, not inferred from parse success. |
| K5, all-history export/import | A continuation export must carry the complete consistent root: journey, every retained life/checkpoint needed for advertised resume, active pointer, revisions and receipts. Version its routing; existing decodeSaveFile/native-enrolled export alone is insufficient. Validate/preflight every executable native leaf, preserve opaque unavailable records, and publish one root after all checks. Explicit single-life export is labeled partial, not “full journey backup.” |
| K6, ordinary backup/recovery | Restore a coherent backup unit, not only one life while preserving incompatible newer receipts/journey data. Separate player-directed backup restoration from an in-world temporal power. Exact new Undo-root policy must be specified before adoption with Undo; until then preserve/export the old backup and fail unsupported use visibly. |
| K7, absent/changed content or unknown fields | Preserve archived/native bytes and revision/provenance; display record retained but resume unavailable. Do not regenerate the former life, enroll a substitute pack, discard dormant data or overwrite unsupported active roots. A compatible view may list only knowledge-qualified context; technical export remains independent. |
| K8, quota, stale writer, probe timeout or crash | Origin quota checks include all existing storage, retained legacy keys and backup roots. No partial pointer/history/charge update. Before commit old root wins; after commit recorded root wins. Retry sees event/revision rather than spending/drawing again. Probe timeout is inconclusive technical failure, not proof of canon/world incompatibility. |
| K9, older build/upstream/cross-release | Continuation-bearing saves require a reader that understands their exact authority/schema/content semantics. Do not advertise downgrade, upstream or live/dev import until proved. Preserve/export original bytes on refusal; an older build recognizing neither authority nor version is not promised to fail safely. Separate release keys remain separate. |

Existing [save_files.js](../../src/save_files.js) uses a **4 MiB conservative
origin storage budget**, counting other keys in checkSaveSize and handling browser
quota failure. This is a current code constant, not a measured two-history capacity
or product cap. Multiple full native histories plus checkpoints, preserved old
keys and a prior full-root backup may hit it quickly. Measure actual serialized
UTF-8/storage estimates and real write behavior on disposable representative
fixtures before choosing flattening/dedup/compression. No silent archive deletion,
cap/expiry or new IndexedDB migration is authorized to solve a speculative size
problem. If measured support cannot retain the promised slice, return the concrete
storage tradeoff rather than quietly narrowing advertised resume.

## B1–B5: real implementation blockers, not human questions

| Rank | Blocker / source evidence | Resolution that would unblock this slice |
| --- | --- | --- |
| B1 | No demonstrated multi-life/journey root; current native-authority schema is two native snapshots. Autosave/export/Undo/boot all assume that model. | One versioned authority integration and coherent migration/import/export plan, preserving originals and no fallback after invalid enrollment. Not a new unrelated save writer. |
| B2 | Mastery retention lacks a proved per-domain split; native XP reconstruction has real side effects. | Explicit portability/effective-expression bindings for all player learning exposed by the slice, with observed useful carryover and no bodily/physical property leakage. No blanket copy/sum. |
| B3 | Current recovery occupancy gate and loader restart behavior conflict with preserved occupied/incapacitated access. Not every transient activity has a saved continuation. | Owned quiescence/arrival-pause contract; map paid/current actions and encounter timers, persist actual pending faculty choice, and demonstrate native incapacitated access without calling unconscious defeat true death. |
| B4 | Complete serializer/adapters are broad; save construction includes observation and current code can lose unknown unsaved data. Nested mappings are not proved by this 83-root inventory. | Capture/restore coverage with cross-owner validators, side-effect containment and compatible-extra/dormant data policy; actual roundtrip comparisons for selected scenarios. |
| B5 | Storage, old-build behavior and exact content/legacy compatibility are unmeasured for this topology. | Measured disposable roots/checkpoints/backups, version refusal and real-loader/file-import evidence. Preserve all originals; no claimed capacity or blanket downgrade compatibility. |

These are required work before claiming the corresponding behavior, not findings
that every current native save is broken. None needs another global design survey.
Named suppression contests, multiple bodies, Paradise/external settlement, portable
storage and additional worlds remain deferred. No remaining broad preference is
ready from this source pass. A product choice is escalated only if evidence forces
a materially different carryover, involuntary loss, control or recovery rule.

## Representation, execution order and proposed evidence

Keep the existing continuation/reference home and threshold center view from the
worked profile. At 1366×768, readable labels distinguish current, paused/resumable,
ended, retained-but-incompatible and record-only states. Browser Back is navigation,
not world travel. Show known route/retention/body/date and technical compatibility
separately; do not expose raw schema errors, future upgrade lists or sealed causes
as ordinary in-world knowledge. A missing route differs from an incompatible save
or a suppressed faculty. No “Resume” promise for a chronicle-only archive.

Five bounded steps for a future explicitly authorized executor:

1. **T1, ownership and coverage:** recover actual writers/dirty state, pin source/content revisions and fill nested state/learning mappings for the chosen two-history one-realm specimen. Confirm genuine fresh-probe context and native incapacitated trigger. Stop only for a material uncovered domain, not another broad survey.
2. **T2, pure planning:** implement versioned root validation, snapshot/overlay mapping, stable start/event identity and migration/refusal behavior with retained fixtures. No native mutation from preview/preflight. Keep this cohesive with the accepted quiet-faculty/first-checkpoint route.
3. **T3, durable host join:** integrate current writer, occupied-state quiescence, guarded root publication, clean reload/suspended restoration and coherent full-root file import/export. Observe failures before/after publication and stale/double requests.
4. **T4, native connected proof:** a disposable new life learns/uses the faculty, creates initial/later checkpoint as selected, starts B, observes A paused, returns through an actual authored supported means and resumes A. Include meaningful mastery in a real consumer, work/encounter, unconscious access, known blocked return and native save/reload/literal-file import. A fixture-only route does not prove player-acquired access.
5. **T5, compatibility and UI:** current/legacy/enrolled/missing-content/quota fixtures; authoritative active-owner comparisons and dormant-history stability; unchanged versus changed meaningful RNG conditions; rebuilt fresh-origin desktop discoverability. Leave director taste/balance acceptance explicit. No equivalent suite repeats without a specific unresolved failure.

Minimal future comparison covers source money/stock/equipment/HP/effects, local
NPC/task/claim/progress and calendar/streams before departure versus resumed state;
B remains unchanged while paused; journey learning/upgrades/receipts remain current
exactly once. Add unsaved-transient disposition and comfort preservation, not only
JSON parse equality. Stored byte equality is useful for untouched leaves; actual
active reconstruction needs semantic owner checks because loaders recalculate stats
and may normalize legacy formats. Exclude volatile saved_at from semantic identity,
without ignoring real gameplay counters or repeated grants.

Existing tests inspected as leads include
[save files](../../tests/save_files.test.js),
[native authority](../../tests/p23-native-authority.test.js),
[structured life](../../tests/structured_life_runtime.test.js),
[heir inheritance](../../tests/heir_inheritance.test.js),
[streams](../../tests/seeded_streams.test.js) and
[saved fieldcraft jobs](../../tests/fieldcraft_saved_jobs.test.js).
These tests were **not run**. In particular native-authority tests explicitly say
mocked preflight is not native-loader/browser proof. No test count or old delivery
receipt proves this new continuation slice. This source/plan task ends here; T1–T5
are not dispatched and do not authorize source, migrations or user-save changes.

## Source fingerprints and documentation validation

SHA-256 prefixes identify inspected source contents; refresh if a later writer
changes one. They are not a bundle/source-map binding or a runtime receipt.

| Source | SHA-256 prefix |
| --- | --- |
| [main.js](../../src/main.js) | `546f5273c345fd2f` |
| [import_probe.js](../../src/import_probe.js) | `c80ed160a71822fc` |
| [save_files.js](../../src/save_files.js) | `4c4056c3ae8c2e30` |
| [save_compatibility.js](../../src/save_compatibility.js) | `3f54b429eaf93732` |
| [save_migration.js](../../src/save_migration.js) | `feb8d7c31aad7a27` |
| [expansion_persistence.js](../../src/expansion_persistence.js) | `2f658af3fa9d66b2` |
| [expansion_engine.js](../../src/expansion_engine.js) | `d8832839dc266406` |
| [native_authority.js](../../src/absorb_p23/save_time_options/native_authority.js) | `48ae8acb74dcb76c` |
| [world_instances.js](../../src/world_instances.js) | `cf15bd3c1d34153c` |
| [life_experience_host.js](../../src/life_experience_host.js) | `67d347365e40988a` |
| [structured_life_runtime.js](../../src/structured_life_runtime.js) | `ba9d73e064a2fb60` |
| [cheat_cards.js](../../src/cheat_cards.js) | `ae911ffcff848c86` |
| [levelable_component.js](../../src/components/levelable_component.js) | `d48f4a9e411dab0a` |
| [skills.js](../../src/data/skills.js) | `c42ea72d7d712d26` |
| [seeded_streams.js](../../src/seeded_streams.js) | `e64cc495fd13b4ce` |
| [display_settings.js](../../src/display_settings.js) | `d013eabdef786b8f` |
| [life_record.js](../../src/life_record.js) | `21ac5f17fff62794` |
| [npc_lives.js](../../src/npc_lives.js) | `abef56e7d73a0e17` |
| [everyday_life.js](../../src/everyday_life.js) | `e75c44e088e65e98` |

Documentation checks passed: 83 directly assigned native roots mapped exactly
once with no missing/duplicate assignment in C1–C19; 52 new local file/heading
references resolve; 19 inspected source fingerprints still match; exact current
request and eight pre-edit owner/report snapshots checked. Other changes are
scoped documentation edits with accepted direction kept separate from proposed
schemas/contracts. No source/runtime test, build, native loader/browser journey,
actual migration, quota experiment, user-save access, dispatch, message or commit
was performed. These checks verify this plan, not its proposed implementation.

## Coordination scope receipt for continuation implementation, 2026-10-15

Requested by the existing cheat chat `01a13e1b-6f99-79a2-8172-b0b5940e78a6`
while it coordinates CP1–CP7 implementation ownership. This chat is direction/detail
review `01a13e47-e9d3-76a3-ac9c-e21475e8ff96` in the shared
`codex/gameplay-foundations` checkout.

**Reservation status:** this chat has never acquired or exercised an engine,
native-save, main.js, UI/source/style/test, bundle or runtime implementation
reservation. No such reservation is held here and none needs transfer from this
chat. All source inspection has been read-only. No implementation/proof workers
were spawned by this chat; no runtime source worker from this chat requires release.
Canonical direction documentation remains under the current human-authorized
owner; no blanket shared-document write grant is made by this receipt.

**Bounded record check:** targeted reservation/checkpoint searches found no effective
native-save/main reservation identifying this chat or granting the requesting
cheat chat those areas. The existing
[UI foundation checkpoint](dispatch/ui-foundation-2026-10-15/CHECKPOINT.md)
reports its source released to root, and its
[shell transfer](dispatch/ui-foundation-2026-10-15/SHELL_VARIANT_TRANSFER.json)
records its own writer/scope. Those are UI records, not proof of a currently free
native-save seam or authority to take it. No native-save writer identity was
established by this bounded read; live process ownership was not independently
verified. The requester is already coordinating current main/UI ownership with
UI root `01a13dce-7254-7fd1-9059-6e77e4e900dc`.

The plan above is the source/evidence snapshot from the design pass. Later
reciprocal-return/intentional-loop answers in the exclusive cheat record are newer
inputs, not accepted merely by this receipt. Their canonical propagation was
still outstanding at the time of this receipt and is subsequently reconciled
in the continuation owner linked by this report's current-direction update. Do not treat source fingerprints, this absence
of a reservation, or a historical UI release as an effective engine handoff.
Only this scope receipt changed; no inter-chat message, new worker, source edit,
commit, push, save or gameplay action was performed.

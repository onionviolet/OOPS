# Nonhuman implementation implications, 2026-10-14

Status: IMPLEMENTATION IMPLICATIONS lane, source-read audit and **proposal**.
No runtime implementation, acceptance decision, test run, build or browser proof.
Only this report and the [lane checkpoint](../gm/dispatch/nonhuman-starts-2026-10-14/implications/CHECKPOINT.md)
are this lane's write area. Unrelated dirty and staged state was preserved.

Evidence convention throughout: **SHOWN** = inspected source; **STATED** = named
owner's recorded statement, including reported checks this lane did not rerun;
**INFERRED** = implication, proposed contract or cost estimate; **UNKNOWN** = no
current evidence. Table rows inherit their table's explicit evidence label.
Source snapshot: branch `codex/gameplay-foundations`, observed HEAD
`4e13f97f4dfe43360b6d02ac6dc6bf72737b2add`. The checkout was dirty and shared;
locators describe inspected working files, not a clean commit or served bundle.
Refresh them before implementation. No sealed files or private saves were opened.

Authority and vocabulary: [COMMON](../gm/dispatch/nonhuman-starts-2026-10-14/COMMON.md),
[AGENTS](../../AGENTS.md), [PROJECT](../../PROJECT.md),
[USER_VISION](../USER_VISION.md), [requirements](NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md)
(all eight rounds, SB1-SB12 and OT1-OT25),
[engine spec](NONHUMAN_STARTS_ENGINE_SPEC_2026-10-14.md) T1-T10/S1-S12/P1-P9,
[shared foundations](../SHARED_FOUNDATIONS_AUDIT_2026-10-12.md) U01-U15/X01-X15/V06,
and [scorecard](../CORE_FOUNDATIONS_SCORECARD_2026-10-14.md) F1-F5/M1-M12.
Existing codes remain with those owners. `IM-` codes here identify implications,
not a second body specification or new priority list.

## 1. Consequence and blast radius

**IM-F1, SHOWN:** two conflicting reads exist now. `src/main.js:547-549`
returns the physical body with fallback race/hands/mobility, while
`src/main.js:1092` overwrites its form with cosmetic race in structured context.
`src/structured_pack_state.js:49` then demands form equal saved bio race.
A reedling record can therefore be physically distinct yet read as human by
another system. E1/E2/E14 must join readers, validators and publication together.

**IM-F2, SHOWN:** body initialization is entangled with optional enrollment.
`src/simulation.js:49-54` requires no existing simulation, then provisions the
player and services; `src/simulation_contracts.js:223` requires a numeric
`enrolledAt`; `src/main.js:1084` treats any simulation as a joined clock.
Installing the proposed body-only simulation without changing these contracts
would change old-save behavior or prevent later intentional enrollment (B21).
Fresh origin selection also demands no player body
(`src/backlog_expansion_body.js:228-230`). A body bootstrap must preserve this
fresh-only contract or explicitly adapt it without letting existing lives
reselect their origin; installing a compatibility body eagerly would block it.

**IM-F3, SHOWN:** combat already accepts attacker/defender arrays
(`src/models/combat.js:43-45`). Native fighter snapshots still derive shield and
skill behavior from native equipment (`src/native_battle.js:16-19`). The change
is anatomy and controlled-owner routing, not a new combat engine because arrays
were supposedly missing. The spec's corrected B1/B7 governs.

The following is the per-touch-group blast map. **SHOWN** locators identify the
current consumer; impact, scope and sizes are **INFERRED**. S = 4-8 focused
engineering hours, M = 8-16, L = 24-40, including focused unit work, excluding
browser acceptance and merge wait. Rows overlap and are **not additive** estimates.
T10 cuts across every other group. An L row should split at a reviewable seam.

| Group / radius | Inspected consumers | What changes / bounded first touch |
|---|---|---|
| IM-T1 / spec T1, M, high shared reach | `src/main.js:547-549`, `src/main.js:1092`; `src/exchange.js:4-10` | One resolved body view, form independent of race, grip capacity plus injury/fine-control checks. Human compatibility comes from migration, never a missing-function grant. All contexts that copy nativeBody need review; fix the first slice's consumers without claiming every host supports new forms. |
| IM-T2 / T2, M, narrow module but high identity risk | `src/backlog_expansion_body.js:222-242`, `src/backlog_expansion_body.js:344-389`, `src/backlog_expansion_body.js:470-476`, `src/backlog_expansion_body.js:525-533` | Protect reedling's finite sap/origin and Tern's same body, consent, parked body and depleted stamina. Translate compatibility queries while keeping current native activity exclusions. Old explicit forms outrank cosmetic scaffold. See C8/C9 and TX4/TX8/TX16; no new possession lease gameplay in Slice 1. |
| IM-T3 / T3, M per adopted consumer, medium | `src/status_care_facts.js:24-28`; `src/original_frontier_field_content.js:124-126`; `src/foundation_interaction_policy.js:50-58`; `src/foundation_interaction_content.js:38-39`, `src/foundation_interaction_content.js:54-59`; `src/world_completion_lens_facts.js:28-31`, `src/world_completion_lens_facts.js:93-98` | Care/work reads usable means instead of incidental anatomy literals. Keep exact experimental participant IDs, supported treatment and world contracts. A scent-capable hound is not eligible for a human-dose treatment or fine assembly merely because it is a person. Adopt selected Village consumers; World1 exposure adoption remains its own owner. |
| IM-T4 / T4, L, widest mandatory foundation change | `src/capabilities.js:40-69`; `src/simulation.js:49-64`; `src/simulation_contracts.js:60`, `src/simulation_contracts.js:217-241`; `src/simulation_effects.js:232-241`; `src/structured_pack_state.js:48-50` | Versioned body validator/resolver, nested-template reference validation, body-only mode, enrollment upgrade and reserve binding. Current body effects are scalar; a nested function map cannot be pushed through that opcode. Anatomy, source provenance, mastery and suppression remain distinct. Mandatory P1/P2/P4 scope even with one body. |
| IM-T5 / T5, M-L per host, high integration reach | `src/structured_pack_runtime.js:18`, `src/structured_pack_runtime.js:28-45`, `src/structured_pack_runtime.js:62-76`; `src/realm_boundary_rules.js:100-118`; `src/proto23_world_host.js:19-22`; `src/book_world_paradise_host.js:23-25`; `src/book_world_mol_state.js:11`, `src/book_world_mol_state.js:33`; `src/feature_expansion_book_host.js:37-42` | Separate selecting a fresh body from traveling in an established body. Admission currently compares every start to the current form before selecting. Do not enable a mixed-form pool by deleting admission entirely. Keep actual boundary form rules. Slice 1 preserves existing typed starts; beast slice adds one explicit candidate/creation route. Other worlds remain supported under their current contracts until their adapters land. |
| IM-T6 / T6, L for beast, high native reach | `src/models/game_action.js:18-83`; `src/main.js:2171-2183`, `src/main.js:2810-2850`, `src/main.js:3751-3765`, `src/main.js:2141-2146`; `src/models/location.js:18-27` | Declare requirements and recheck at preview/start/finish. Generic walking gate in Slice 1; explicit validated restore/realm relocation stays separate. Beast adds shelter/rest/defeat policy and neutral signaling/greetings. Housing currently means sleeping XP/text; a den can reuse location/facility ownership with a body-compatible rest policy. E5 meals help; no fuel shortage may reintroduce hunger death (C5). |
| IM-T7 / T7, L, medium-high item/custody radius | `src/display.js:219-230`; `src/data/character.js:5`; `src/items.js:128-137`; `src/models/hero.js:288-311`; `src/models/person.js:496-510`; `src/structured_equipment_runtime.js:54-57`, `src/structured_equipment_runtime.js:76`; `src/native_equipment_transaction.js:12-35` | Body slots and item fit must gate DOM, direct equip, staged transaction and restore. Current native transaction verifies item slot, not anatomical fit. Keep actual item ownership/count, and recompute without replaying inventory movement. Human slot adapter survives Slice 1; hound collar/harness needs a real item/acquisition/UI join in P7. |
| IM-T8 / T8, L, high calculation/combat radius | `src/models/stat_haver.js:6-41`; `src/models/person.js:19-24`, `src/models/person.js:116-117`, `src/models/person.js:316-350`; `src/models/combat.js:356-373`; `src/native_battle.js:16-19`; `src/native_gameplay_adapter.js:43-58` | Stat/pool profile, natural attacks, applicable skill bonuses and acting-body reserve. Zero health currently falls through `data.health || 60`; absent human height becomes 170 cm. Avoid these defaults for zero-integrity/bodyless cases. No weapon currently means Unarmed; Running/Weightlifting/Climbing/Breathing bonuses apply generically. Beast must declare which mappings apply (PG1/PG4/PSG1), without deleting retained knowledge XP. Preserve human calculations. |
| IM-T9 / T9, L later, high continuity radius | `src/data/character.js:7`, `src/data/character.js:21`; `src/heir_inheritance.js:32-64`, `src/heir_inheritance.js:81-93`; `src/life_experience_host.js:11-28`; `src/native_gameplay_adapter.js:62-66`; `src/realm_traveler_profiles.js:1-5`, `src/realm_traveler_profiles.js:55-70` | Keep singleton native binding initially, explicitly parked during Tern. Heir builder replaces expansion at line 20, so preserve a selected fresh body through that replacement; inheritance itself transfers goods, not a human body. New-life bodily practice/control does not follow estate by default. N-body registry, body-scoped reservation and attention are later work; detached traveler snapshots do not prove native switching. |
| IM-T10 / T10, L cumulative verification, all-envelope radius | `src/save_files.js:45-52`, `src/save_files.js:73-83`, `src/save_files.js:109-142`, `src/save_files.js:174-201`; `src/main.js:4981-4989`, `src/main.js:5230-5247`, `src/main.js:5335-5360`; `src/expansion_persistence.js:7-50`; `src/import_probe.js:2-33` | Shared migration before body-dependent validation, all writer/reader paths and real-loader reconstruction. Preserve S1-S12 rather than adding another save pipeline. Failed publication/import preserves prior state. Verification must cover full envelope plus old human regressions, not just JSON body roundtrip. |

**IM-F4, INFERRED:** dialogue and UI are cross-cutting, not cheap text substitutions.
E10 needs an executable communication channel and observer evidence before a
reply, trade or rumor. SB1/SB2/SB5/SB6/SB10/SB12 become observations and received
signals; they do not grant private NPC facts. SB3/SB4/SB8/SB9/SB11 need actual
history/items/premise as causes. SB7 changes narration of the same clock, not the
clock speed. Reuse X01/X02 and SU1/SU2/SU7/SU10/SU13/SS1/SS5. OT25 renders one
shared world through qualified views; it is not one duplicated world per body.

**IM-F5, SHOWN + INFERRED:** `src/status_window.js:5-31` renders five core stats
from its supplied snapshot and `:39` refreshes every 250 ms. It must read the
same focused-body projection as vitals/stats. A Body view is ordinary information,
not a cheat grant. Perception/reveal cheats may widen known information through
a real source; ordinary panels remain SU1-qualified. Equipment, work/quote and
local action panels should stay independently useful at **1366x768**. Mobile
optimization stays deferred. SS2's expanded 1920x1080 comparison can follow the
laptop gate; saved layouts/keyboard/text enlargement still need affected checks.

## 2. Sequencing against live work

This table describes dependencies; it dispatches no work and changes no priority.
Historical test counts below are **STATED by their named owner**, not this lane's
verification. Compare evidence dates before using an opening summary as live state.

| Code | Current owner / recorded state | Slice 1 relation and what it can unblock |
|---|---|---|
| IM-D1 | [Foundation checkpoint](../gm/dispatch/foundation-adoption-next-2026-10-13/CHECKPOINT.md), final entry 00:58 EDT: requested G4/G9/G10/CH1 integrated/pushed; G10 reports 634 source passes and 1600x1100 smoke. Natural FA07 acquisition, intermediate WorkPlans proof and source-only extensions retain separate gates. | Wait for an agreed integrated baseline and exclusive runtime ownership before touching shared main/simulation/save paths. The entire FA01-FA23 chain need not be declared complete before isolated P1 fixtures/resolver work. Body migration must preserve finite work, equipment, source and settlement receipts that foundation work uses. These reported gates do not prove body compatibility or 1366x768 nonhuman play. |
| IM-D2 | Same checkpoint: World1 `bc999ea4` branch awaits dirty PROJECT/USER_VISION clearing; campaign incomplete after C01/C02, C03 next; private companions uninstalled. Later checkpoint entries lift the historical pause. | Keep source-only World1 restrictions and carry its data through migration. Do not describe World1 as globally paused from an older paragraph. Its full campaign/companion installation is not a Village Slice 1 prerequisite. Its native body consumer must be retested if shared validators change, under its own owner. |
| IM-D3 | [Status-window GOAL](../gm/dispatch/cheat-status-window-2026-10-13/GOAL.md), R1 hardening: storage atomicity, travel/load/sleep awakening, visible contents and semantic validator. [Audit](../gm/dispatch/cheat-status-window-2026-10-13/AUDIT_REPORT.md) F1-F4 records failures and F6 limits. | Schema/resolver fixtures and authored body data can run beside R1 in separate files/worktrees. Shared main/save/UI integration waits for ownership handoff and rebase. Any changed clock/travel/load path must preserve R1 behaviors. Stage 1 quest/point systems are not body-foundation prerequisites. Do not claim R1 finished from its brief alone. |
| IM-D4 | [Start-records GOAL](../gm/dispatch/start-records-2026-10-13/GOAL.md) and `progress.json`: SR-A through SR-G/G1-G7 reported pass, including actual file input; taste and integration separate, worktree artifact remains noted. | Do not rebuild that picker in this lane. P2/P4 protect selection/lifetime/hash bindings; mixed-form selection is a later explicit adapter. If its branch is to be integrated, reconcile creation wiring first. Slice 1 can preserve existing human starts without waiting for a global picker redesign. |
| IM-D5 | [Scorecard](../CORE_FOUNDATIONS_SCORECARD_2026-10-14.md) F1-F3/M3-M5 and A1 migration/read-view plan; U04 procgen integration owned separately. SHOWN current `src/save_files.js:1-3` imports streams/mixtures/storylets and combat uses keyed block random at `src/models/combat.js:357`. | The scorecard's unmerged-stream snapshot is historical, not proof of current absence. Rebase to live integrations. Use its migration/read API seams where actually landed; a global world-registry refactor is not required to ship one body. Body queries must draw no random values; start/discovery draws use their owner. |
| IM-D6 | E1/E2/E14 and spec P1-P5; N25/N32/N33. | Hard dependency: baseline transition fixtures, one body authority, mode-safe bootstrap, shared migration, complete-envelope restore. These unblock P6-P9 and independent content authoring against a frozen contract. A cosmetic form field alone unblocks none of E3/E4/E11. |
| IM-D7 | [Bonds](NONHUMAN_BONDS_AND_PARTIES_2026-10-14.md) BDS1-BDS5; [companions owner](../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md) GC1-GC8. | Traveling WITH-player pets stay with that session; AS-player bodies stay here. Share templates/actor rules, not a second pet registry. One caretaker offer can run beside scent/gear content once functions/transaction contracts stabilize. Full companion breeding, mortality and seat switching are not prerequisites. BDS3 waits for actual focus/control binding. |
| IM-D8 | [Paradise plan](paradise-hub/CANON_PRIORITY_PLAN_2026-10-14.md) SRP/ARP; [beings](paradise-hub/BEINGS_PETS_AND_BODIES_2026-10-14.md) BS1/PB1-PB5; [missions](paradise-hub/DERIVED_WORLDS_AND_MISSIONS_2026-10-14.md) S4/DM10; [hub life](paradise-hub/HUB_LIFE_ECONOMY_AND_PEOPLE_2026-10-14.md) HL13/HL14. | Body foundation supplies admission/functions/compatibility. Pet-seat gameplay additionally needs bond/support and source-era contract; mission-body N18 waits for C8 lease and once-only return settlement. A mission body is not automatically a safe save sandbox merely because it ends at extraction. Hub routine/source rechecks can proceed independently. Canon-first order, including Paradise, stays unchanged. |
| IM-D9 | TX1-TX16, PG1-PG15, CK1-CK18 and OT15. | Single reversible two-form transition follows a proven single-body route (C11). C9 prohibits focus duplication; N-body, OT13 dual queues and brood automation wait for reserve/custody/attention/reservation and measured budgets. Body lifespan/seasons/offline chapter play are later adapters, not retroactive gates on ordinary human play. |

**INFERRED dependency graph:** N25/N32 fixtures → P1 contract → P2 mode-safe
migration → P3 readers/gate + P4 all-envelope publication → P5 rebuilt journeys
→ P6 selected viable start → P7 function actions/fit → P8 stats/combat/social/rest
→ P9 first-beast acceptance. P3 and P4 can be developed separately only under
explicit file ownership, then tested together. Prototype authoring (OT11/N34),
first-hour scripts and source-era checking can proceed before engine integration.

**STATED direction:** desktop first, useful meals/no hunger death, one realm/one
prestige milestone, canon-first world order. The requirements' C1/C12/NS1 hound
is a proposal for a small original proof; it does not outrank that order. Whole
corpus implementation, mobile polish and every open native gate are not a new
"before nonhuman" condition.

## 3. Save, compatibility and rollback

**IM-S1, SHOWN:** serializer emits `fork_schema=1` at `src/main.js:5235`;
reader admits 1/2 at `src/save_files.js:109`; game version is `v0.6`
(`src/game_version.js:3`). Structured validation happens early at
`src/save_files.js:52`; native load calls it at `src/main.js:5340` before
`prepareV06Save` at `:5350`. A body migration only in the later native loader
cannot fix the first validation rejection. Reuse spec S1-S12 as the path inventory.

**INFERRED version plan:** spec fork 3 / body schema 1 / simulation 7 is a proposed
allocation, not reserved numbers. Check live readers/writers before assigning it;
use a compatible game-version increment so old clients reject future envelopes.
Preserve optional expansion/world versions and absent owners; do not set every
save to one world's newest schema. Existing scalar body effects need a deliberate
nested-record adapter/validator, not permission to write arbitrary JSON.

| Code | Incoming case / transition | INFERRED required behavior and proof |
|---|---|---|
| IM-S2 | Pre-component save; current human with no body; cosmetic race variant | Clone complete envelope, apply legacy biography normalization at a defined order, then add compatibility physical body. Preserve name/race/height/gender/age, numerical values, inventory, skill XP, clocks and mortality opt-ins. Physical human compatibility must not convert cosmetic race into anatomy. Structural body-only mode grants no source, service, NPC, reward or joined-clock advance. Later voluntary enrollment preserves body and upgrades only service mode. |
| IM-S3 | Partial human body flags, explicit reedling, unknown explicit form | Preserve palms/conditions/source flags; fill known legacy base only with a proven binding. Reedling retains identity, sap/woven/claim/source exactly. Never infer human from an explicit unfamiliar form. Unsupported template/revision must retain recoverable data/file and suspend incompatible play with export available; no silent fallback. |
| IM-S4 | Tern offered, active, depleted, returned; reedling parked under Tern | Preserve actual current and parked body IDs, owner/controller, consent, host incapacitation, homeVitals, location and spent clay stamina. Active Tern host has no duplicated body/vitals (`src/backlog_expansion_body.js:357-360`). Parked native Hero projection must not overwrite clay reserves. Idempotent migration changes structure, not visits, grants or resource balances. |
| IM-S5 | Pending/committed structured start, missing old pack, changed template revision | Retain selection seed/index, start/body/life/instance IDs, hashes and once-only origin claim. Separate race comparison from physical validation without weakening lifetime/content binding. Frozen old pack revisions need supported adapters or suspended export; rewriting hashes to current content is not migration. Reject dangling references or conflicting body owners before publication. |
| IM-S6 | Heir/retirement/new shell; body/slot change mid-job | Preserve the selected successor's body through `buildLifeHeirSave` expansion replacement (`src/life_experience_host.js:20`). Count goods once from actual inventory/equipment/estate. Release old control/jobs and apply declared carry manifest (TX3-TX10/PG13/SL15). Incompatible gear stays owned and can be stored/refitted; it cannot give hidden bonuses. Offspring/copy is not automatic same mind or free control (N39/N42). |
| IM-S7 | Manual/autosave/backup, Export, normal load, literal Import, failed storage/preflight | Same prepared envelope contract at each boundary. Existing `persistExpansionPlan` stages/validates before storage (`src/expansion_persistence.js:7-50`); import validates then real-loader preflight then guarded write (`src/save_files.js:196-201`). Body/control/items/vitals/UI publish only after durable success. Export has its existing inspiration/timestamp behavior (`src/main.js:5283-5291`); compare body/economic invariants before/after the documented reward, not blindly require the entire envelope equal. |
| IM-S8 | Rollback after upgrade | Before upgrading test origins, keep a generated pre-migration export and exact old build. New saves cannot be promised readable by old clients. Revert code plus use the pre-upgrade export on an isolated old-build origin; this loses later progress unless an explicitly tested reverse adapter exists. Feature hiding is not schema rollback. Never strip nonhuman fields or flatten body to human to make an old client accept it. Failed upgrade/import keeps original durable bytes; quota failure still permits file preservation. |

**INFERRED persistence matrix:** generated legacy-human, current-human,
partial-trained, reedling, Tern-offered/active/depleted/returned, reedling-parked,
pending structured and committed structured fixtures. Migrate twice with exact
idempotence. Then full writer → reload → UTF-8 Export → literal file Import into
a separate fresh origin → actual loader; compare body identities/functions,
owner/control, native offsets, reserves, stock/custody, XP, origin/visit receipts,
clocks/service mode and absent/dormant/retired owners. Allow only specified export
metadata/reward differences. Check malformed capacities, unknown future schemas,
missing revisions, illicit control, quota failure and preflight failure with zero
write/publication. No private player save is needed for this gate.

## 4. Verification and cost

**SHOWN layout:** `package.json:7-10` builds with `node build.js`, runs
`node --test tests/*.test.js`, and has no body lint command. Inspection found 109
files under tests including helper files, not 109 tests. Top-level Node tests
cover simulation, structured origins/equipment, native transactions, chronology,
heirs and save compatibility. `tests/helpers/cheat_game.mjs:1-38` already builds
test-instrumented native code on an ephemeral origin at 1366x768; its machine-local
Chrome/Playwright paths are helper dependencies, not a portable new body harness.
No tests/scripts matches were found for `reedling`, `possess_clay`,
`return_from_clay` or `realmTravelerCases` during this inspection. This confirms
N25's search gap, not absence of historical browser proof everywhere.

All costs below are **INFERRED hands-on estimates**, not measured wall times.
Fixture writing cost occurs once; execution budget includes investigation and
inspection, not just CPU seconds. Slow natural acquisition must get a separate
finite game-time budget; seeded transition tests do not prove natural access.

| Code | Test slice / named assertions | Initial authoring cost | Later verification budget |
|---|---|---|---|
| IM-V1 / N32 | Shared cloned human, reedling, Tern, hound, rooted sapling and blade fixtures; capacities, incompatible gear, missing channel, template revision, NPC parity. Add old partial-body and no-body negatives. Fixture factories cannot mutate shared defaults or award sources. Existing human numerical baseline remains independently asserted. | 4-8 h | 10-20 min focused run/review |
| IM-V2 / N25 | Reedling fresh-only selection, finite two-sap weave, forbidden retry; consenting Tern enter/spend/blocked travel/return, depleted reserves and parked reedling. Detached traveler validate/evaluate fixtures, clearly separate from native proof. | 6-12 h | 15-30 min |
| IM-V3 / N33 | Static ratchet over new source code for human-form comparisons, fallback hands and hands-count requirements; explain the function query. Baseline existing occurrences, reject newly introduced anatomy assumptions, allow explicitly named admission/compatibility/experimental-policy sites with reason/owner. Parse code where practical; comments and narrative strings are not new gates. Keep real world body-form restrictions (F6/B8). | 4-8 h | 5-15 min incl. triage |
| IM-V4 | Pure migration/full-envelope/fault matrix IM-S2-S7; no auto-enrollment or clock drift, repeated load same receipts, failed publication unchanged. Reuse `tests/save_files.test.js:20-39`, `tests/save_compatibility.test.js:5-32`, `tests/body_progression.test.js:23-30` old unenrolled assertions and `tests/simulation_optional_enrollment.test.js:4-6`. Update representation assertions deliberately while keeping behavioral no-reward/no-service meaning. | 12-24 h | 30-60 min |
| IM-V5 | Human regression: stat/skill bonuses, sword/shield/tool fit and item counts, native walking/rest/defeat, dialogue/creation, pending jobs and finite work, typed starts, heir estate and old imports. Retain `tests/native_equipment_ownership.test.js:9-24`, `tests/structured_origins.test.js:26-46`, `tests/heir_inheritance.test.js:1-36`; select gameplay/native battle/equipment/storage/craft suites by changed imports. | 4-8 h additions | 20-45 min focused; broader npm test/build once after integrated changes |
| IM-V6 | 1366x768 legacy human journey: import generated old save, ordinary travel/work, equipment change, rest, save/reload/export/literal import, optional enrollment still possible. Inspect unchanged numerical/custody results and useful panel visibility. | 4-6 h harness | 30-60 min per clean build |
| IM-V7 | 1366x768 Slice 1 journeys: fresh reedling choice/weave and separate actual Tern consent/enter/clay operation/blocked travel/save cycle/return. Include depleted reserve and failed-write route; capture body/stock/clock snapshots, served-byte hash and screenshots. | 6-10 h harness | 60-120 min bounded seeded journeys; natural access budget additional |
| IM-V8 | 1366x768 first beast journey: select/Confirm, scent trace with real payoff, idle queue/stop/reload, witness signal/refusal, actual exchange, collar fitting, denied human action, bite encounter and shelter recovery. Save cycle at opening, pending job and after combat. An NPC uses the relevant same body rules. SS1/SS2/SS5 accessibility/hidden-DOM and long-label/effects-off checks. | 8-16 h harness | 90-180 min incl. screenshot/snapshot review |
| IM-V9 | OT15 synthetic scale probe: 1/8/32/128 detailed bodies plus 1,000/10,000 cohort headcount, 0/1/2 backup copies. Timed query/boundary/clone/serialize/validate/load and full save bytes; fail at cap+1. Later N-body work only. | 4-8 h | 30-60 min repeated samples |
| IM-V10 | Affected status-window R1 and structured-start integration gates; F6 plus Tab reaches meaningful content, dormant/none remains concealed, body stat row agrees with vitals, travel/load/sleep do not miss awakening, failure does not reveal an unpersisted result. | 2-4 h adapter work | 30-60 min; run against final shared build |

**INFERRED scope total:** P1-P5 foundation roughly 60-100 focused engineering
hours including new unit/fault coverage, plus 6-12 hours first browser harness
and inspection. P6-P9 beast roughly 48-88 additional engineering hours plus
content below and 8-16 hours first browser harness. These are overlapping work
packages; do not sum each test/table row again. Agent execution may shorten typing,
but integration/debugging/source qualification/human taste are not eliminated.
UNKNOWN actual elapsed time, test duration and natural acquisition duration.

**INFERRED done check:** no proof substitution. Rebuild, own fresh disposable
origin and served-byte match; execute declared positive, refusal/missing-means
and failure journeys; persistence exact at each state; affected human source and
native regressions pass. Passing Node fixtures or an instrumented synthetic route
alone leaves native acceptance OPEN. Playable completion and director taste are
separate; remaining gates keep their owner, evidence and next pending action.

## 5. Many bodies: performance, save size and caps (OT15)

**SHOWN:** boundary selection scans jobs/checks/controllers/events/conditions and
people (`src/simulation.js:459-464`); execution sorts events/checks and evaluates
rules (`src/simulation.js:501-519`). `persistExpansionPlan` creates a save, parses
or clones an envelope, validates and stringifies it (`src/expansion_persistence.js:9-49`).
The rolling simulation log retains 100 entries (`src/simulation.js:38`). Current
storage budgeting is **4 MiB of origin UTF-16 storage bytes**, including other
keys, not 4 MiB of JSON UTF-8 file (`src/save_files.js:204-217`). Browser quota can
be lower, with caught failure (`src/save_files.js:219-225`). The import probe has
a bounded 60-second timeout (`src/import_probe.js:27-30`).

**INFERRED complexity:** with B detailed bodies, J jobs, C controllers/checks,
E events and R conditions, boundary scans grow with those records; sorted due
work adds ordering cost. Recomputing full world facts for every body multiplies
existing world coupling. Naive all-pairs bonds add B² relationships and work.
Full-envelope clones/validation/serialization scale with total retained state,
not just focused bodies. These are structural implications, not timings. Do not
claim a seven-body engine cap from F4's sample source or a portable throughput
number from the scorecard's old process count.

Provisional **INFERRED implementation ceilings**, subject to measurement and
world dials, preserve access to large populations through cohorts:

| Code | Default ceiling for a future selected build | Dial / failure behavior |
|---|---|---|
| IM-C1 | Slice 1: one focused body; existing Tern parked/host records under their current invariants. First beast still one focused body. | No new linked-body controls or registry migration in these slices. Existing unrelated NPCs remain. |
| IM-C2 | First actual N-body prototype: 8 individually detailed linked bodies, 1 focused native seat, at most 4 concurrently committing individual jobs. | Source attention/control may be lower. Raising cap requires IM-V9. Extra population stays possible as supported cohorts/rosters; do not quietly delete individuals to meet the active cap. |
| IM-C3 | Cohort record: 1,000 members; 32 active cohorts; 128 live body-related jobs/events across selected detail. No per-member native timer or all-pairs bond update. | Large hive dial chunks into bounded cohorts. Named injured/committed people keep identity and obligations; deactivation freezes or uses explicit summary policy. Cap exhaustion pauses new admission with reason, preserving existing work. |
| IM-C4 | 32 function overrides and 16 slot definitions per template; 32 active conditions and 32 directed relevant ties per detailed body in the prototype. 100 rolling ambient entries; separate pinned milestones/receipts. | Complex worlds can raise measured limits. Never trim an unpaid obligation, unique cargo claim or replay-prevention receipt as "old log"; retain or compact with equivalent validated summary. |
| IM-C5 | Plan for body subsystem delta below 256 KiB UTF-8, warn at 75% of the actual origin budget; fail new state admission before exceeding the 4 MiB guard or browser quota. Target body-added p95 boundary work under 4 ms at the selected cap, no body-added synchronous operation above 50 ms. | These are proposed targets, not current measured guarantees. Measure baseline and delta on the same machine/build with warm samples and browser load. If missed, reduce detail/active jobs or segment supported work before increasing cap; no automatic dropped state or new offline simulation. |

**INFERRED size model for planning only:** assume template reference + mutable
state averages 2 KiB UTF-8 per detailed body (identity/position/reserves/overrides),
and relevant ties/history average another 1 KiB. B=1/8/32/128 adds about
3/24/96/384 KiB before jobs, gear or pinned memories. For mostly ASCII JSON,
UTF-16 storage is about twice that; a 128-body example is roughly 768 KiB per
save, and current + two equal backups roughly 2.25 MiB **before** legacy/world
state. Actual Unicode, inventory and histories change both sizes. Base64 file
encoding adds approximately one third to UTF-8 payload plus prefix, while live
storage uses serialized JSON (`src/save_files.js:185-201`). This is arithmetic
on declared assumptions, not a sampled save measurement.

Default pinned template + overrides follows spec Q4/OT11; resolve immutable
maps once and invalidate only on template/stage/body/condition/source changes.
Cache effective functions in memory with revision keys, never as a second saved
truth. Resolve generated anatomy at selection and retain it (companions GC5),
rather than rerolling from a seed after content updates. OT13 needs explicit
attention/jobs and once-only settlement; two queues do not mean two full rewards
for one action. CK17/BD15 provide the cohort/detail owner; OT5 ecology and OT1/OT2
majority worlds do not require a full food web before one beast start.

## 6. Content cost and relative sizes

All numbers are **INFERRED planning ranges**, focused author/reviewer hours once
E1/E2/E14 and selected required engine seams work. They include template/start
contract, a small useful loop, idle routine, witness response, fit/rest/defeat
wording and content review. They exclude engine implementation, whole-world
source acquisition, release browser QA and director acceptance. New engine
verbs/leases/cohorts add costs in IM-T6-T9; data labels cannot supply them.

| Body-kind owner code | One original playable body package | Relative size / main content burden |
|---|---:|---|
| BK1 hound/wolf | 12-20 h | 1x reference; scent payoff, signal, collar and shelter |
| BK2 slime | 20-36 h | 1.5-2x; absorption eligibility/provenance, product and viable trade |
| BK3 rooted plant | 18-32 h | 1.5x; reach-local work, water/light support, visiting witness |
| BK4 spirit/ghost | 24-40 h | 2x; sensing/contact separation, anchor, banishment/recovery |
| BK5 occupant/possessor | 24-48 h | 2-3x; independent host, lease/return/failure and reserves |
| BK6 sentient object/blade | 24-40 h | 2x; holder/custody, useful waiting, mediated effects |
| BK7 living place/core | 32-56 h | 3x; territory, rooms/visitors, useful local idle building |
| BK8 construct/golem | 18-32 h | 1.5x; parts/fuel/refit/repair without lethal hunger |
| BK9 collective/brood | 40-72 h | 3-4x; cohort assignments, member loss and group continuity |
| BK10 pet/familiar seat | 20-36 h | 1.5-2x; independent partner/support/refusal, separate growth |
| BK11 AI/system/patron | 32-56 h | 3x; zero-body influence, channel/host agreement, waiting work |
| BK12 dependent child | 16-28 h | 1-1.5x; caregiver effort, viable agency and stage |
| BK13 undead/reanimated | 24-40 h | 2x; animating source/body/person distinction and repair |
| BK14 shapeshifter | 28-48 h | 2-3x; two useful forms, one inventory, reversion/fit/carry |
| BK15 clever rat/small animal | 14-24 h | 1x; scale route, stash/carry and witness without omniscience |

Per-world start overlay after body exists: **8-16 h** for a bounded original
Village history/location/means/witness/three first-hour beats; **16-32 h** for a
source-qualified canon start once its exact era/rules are available; add **8-24 h**
if that selected rule still needs rechecking within held research. UNKNOWN extra
cost when required sources are absent. A supported AU variation changing only
history/relationship/era can be **4-8 h**, but body replacement, institution law
or an N18 lease is engine/content scope, not a cheap palette entry. Priority
world catalogs W01-W16, Paradise BS/DM/SRP/ARP remain their own source owners.

Per selected cheat card: **4-8 h** for a narrow known capability/admission grant
using a landed hook and authored cost/receipt; **8-16 h** for a qualified reveal
with channel, fidelity, resistance and memory; **16-32 h** for one bounded
form/lease-changing power with transition and failure terms. Those are content
hours only. Absent cheat hooks, stat adapters or lease runtime can add days of
engineering. A second-body cheat waits for C9/IM-D9. Reference companions GA1-GA7,
GC3-GC4 and J42-J56 for reveal vocabulary; do not duplicate their card library.

**INFERRED minimum content budget:** one hound body package plus original world
start overlay is roughly **20-36 h**, with no new cheat required. Body template,
world start and cheat are separate deliverables, so reusing a body in a second
world saves anatomy work but not local rights, habitat, encounter and source-era
review. Relative sizes are rough multipliers, not equations exact to each range.

Later micro/cross-system coverage, by existing code rather than copied content:
SB1-SB12/MM1-MM7 fit qualified cues with a shared line budget and real causes.
Choose three cues first, allow **2-4 h** for those authored variants and review;
all twelve SB families across every body multiply content checks, not mandatory
Slice 1 state. OT3/OT6/OT20 join CK clocks/calendar; OT7/OT8 need location/afterlife
and transition adapters; OT9/OT23/OT24 need retained milestones/continuity;
OT10/OT25 join linked starts and one qualified shared-world view;
OT4/OT11 join authored/generated templates; OT12/OT14 join effects-off and
accessible qualified text; OT16 joins N37/N38 carriers/habitat; OT17/OT18/OT19/OT21
join real production/support/facility/job contracts; OT22 joins witnessed rumor.
None justifies duplicating whole worlds, rendering sealed truth or making return
to human mandatory. OT1/OT2 and OT5 remain larger content settings; OT13/OT15 are
runtime cost/control dependencies above.

## 7. Risk register and direction decisions

All risks, controls and residual gates are **INFERRED** proposals. Risk register
has twelve entries; it is a reference inventory, not twelve user actions.

| Code | Risk / consequence | Control and remaining gate |
|---|---|---|
| IM-R1 | Race/body disagreement causes false grants or rejects a good save | E1 shared resolver plus early migration; current/legacy/structured/reedling full-envelope matrix. |
| IM-R2 | Body bootstrap enrolls services, changes clocks or blocks opening selection | Explicit versioned mode; audit every simulation-presence enrollment/clock check, preserve fresh-only creation routes and later deliberate enrollment. B21/IM-V4-V7. |
| IM-R3 | Active Tern body duplicated or restored reserves refilled | Single current/parked identity, existing consent/host invariants; depleted roundtrip and failed-write before/after return. C8 and IM-S4. |
| IM-R4 | Hidden human equipment/skill bonuses bypass disabled UI | Enforce at mutation/publication/restore/calculation, not only buttons. Human baseline plus nonhuman no-shield/no-fists/incompatible-slot positives/negatives. |
| IM-R5 | Function query erases world law/admission or grants literacy/casting mastery | Separate anatomy, knowledge/method/source/custody and explicit world rules. N33 reviewed exceptions, retained form exclusions, NPC parity. |
| IM-R6 | New schema invalidates pinned packs/other worlds or loses dormant state | S1-S12 cross-owner review, pinned revisions, suspended export, typed/lifetime/retired fixtures. Do not relabel optional schemas. |
| IM-R7 | Creation completes but first start has no useful money/work/social loop | N34/NP1/C2 contract and actual first-hour journey, alternative means and pause/refusal routes; no forced human endpoint. |
| IM-R8 | Senses/reveal/window leak hidden NPC facts or sealed body truths | SU1 observer-qualified view shared by text/tooltips/DOM/accessibility; stale evidence labeled, sealed content referenced only by IDs. Actual channel loss test. |
| IM-R9 | Offline/chapter/dual queue grants duplicate time, XP or loot | One cursor/receipt, actual executor and input reservation, CK10/PG4/PG7; offline freeze until separately supported. |
| IM-R10 | Brood causes tick stalls, quota failure or irreversible trimming | OT15/IM-C ceilings and IM-V9; cohort detail, no all-pairs tick, measured origin budget, preserve commitments/unique identity. |
| IM-R11 | Heir/reset/copy inherits all body expertise or drops selected new body | Preserve successor selection, estate once, explicit carry manifest and control release; PSG5/IM-S6. Current heir-only code does not narrow future direction. |
| IM-R12 | Concurrent foundation/UI/starts/companions integration overwrites a shared owner | Recover branch/process/reservation/dirty state before code work, one writer per area, rebase to landed baseline and coordinate S1-S12 gates. This report grants no runtime ownership. |

**Weibao decisions:** no answer is needed to finish this research, and none is
needed for routine reversible implementation choices within a later authorized
slice. Template encoding, version allocation, fixture layout, exact collar stats
and provisional limits are implementation-owner decisions with observable gates.
Spec Q1-Q4 do not automatically become user questions.

| Code | Ask only if a proposed change would alter standing direction | Existing direction to preserve until then |
|---|---|---|
| IM-Q1 | If an implementation proposal would move an original beast catalog ahead of the canon-first work, describe the concrete scope and opportunity cost for Weibao to set its place. | IM-D1-D9 are dependency descriptions; C1/C12 hound proof remains a proposal. No automatic reprioritization from this lane. |
| IM-Q2 | If a selected premise would introduce automatic offscreen irreversible loss, forced instinct actions, new hunger death or an additional prestige layer, identify that exact behavioral change for Weibao before building it. | Frozen unsupported offline activity, comfortable unfed play, voluntary default pulls and the current one-prestige milestone. Requested world/premise dials remain reachable without imposing them on ordinary starts. |

These are conditional direction checkpoints, not pending confirmation requests or
an invitation to re-answer established preferences. Specific canon conflicts stay
UNKNOWN with their source owner until that world's selected slice needs them.

## 8. Minimum viable path to one playable start

**INFERRED smallest route under the existing proposals:** P1-P5 is compatibility
foundation, not a new start. It first protects existing human/reedling/Tern play.
Then use one original Village hound (C1/C12/NS1), adapted to P6-P9's existing beast
acceptance breadth. No new cheat, body switching, full world catalog, brood,
offline catch-up, ecology simulation or new prestige currency is necessary.
Keep target **1366x768**; visible outcome is useful scent work, a witness reply,
queue/stop state, fitting gear, natural combat/recovery and intact import.

1. **IM-A1, baseline and compatibility contract:** secure a landed baseline and runtime owner; add N25/N32 fixtures. Freeze human/reedling/Tern templates and pure body query contract (P1). Define service mode and allocate versions from live constants. Content writers can author N34 first-hour record beside this step.
2. **IM-A2, preserve existing lives:** implement P2/P3/P4 together as a reviewable compatibility slice: early cloned migration, no service/reward/clock change, one body read, generic movement gate, selected typed-save and heir-preservation fixes, same storage/preflight/publication contract. Run IM-V1-V5 and retain explicit world restrictions. No stats/XP registry rewrite or new-body namespace required.
3. **IM-A3, prove Slice 1:** rebuild and execute IM-V6/V7 on fresh origins, including depleted Tern return, reedling finite output and exact literal-file import. Record old human behavior/service eligibility and failed-write preservation. If these fail, retain implementation-unverified status and repair the named seam before adding a new start.
4. **IM-A4, add one viable hound start:** P6/P7/P8 with selected-body creation admission, three useful verbs (scent retrieval, local guard circuit, signal/request), one finite reward/custody receipt, a caretaker who can refuse, real collar acquisition/fit, hound skill/stat/bite profile and shelter rest/defeat. Reuse existing person/inventory/job owners and a new revisioned template, not a pet-only save model. Preserve human knowledge but apply only supported bodily bonuses. Add the selected NPC parity and no-duplication cases.
5. **IM-A5, playable acceptance:** rebuild again, IM-V8 plus affected IM-V5/V10; opening, pending queue, after encounter save/reload/export/literal import; visible useful body/work/action panels at 1366x768, effects-off/keyboard and qualified text. Publish a checkpoint with exact passed/open gates for Weibao to play. Stop this slice before another body or world start; taste remains a separate human acceptance gate.

**UNKNOWN remaining:** implementation diffs, current runtime tests, migrations,
body-size/tick measurements, numeric balance, natural acquisition cost, final
integration order and director taste. This report neither closes these gates nor
reopens unrelated previously proved gates. Research completion: 10 touch groups,
9 dependency joins, 8 save/rollback entries, 10 verification slices, 5 provisional
ceiling rows, 15 body-kind estimates, 12 risks, 2 conditional direction points and
5 minimum-path steps. Authoring and browser budgets are estimates throughout.

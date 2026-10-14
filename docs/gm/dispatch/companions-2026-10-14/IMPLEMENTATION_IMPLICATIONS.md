# C13: consolidated companion implementation implications

## CHECKPOINT

2026-10-14. Documentation consolidation complete within the input snapshot in
[C13_REPORT](C13_REPORT.md). Own exactly this file and that report. No gameplay,
bundle, test, save, private pack, canonical owner, commit or push changes.
Resume by refreshing the input inventory, especially C9/C11/C12, then checking
source locators against live code. This is a startable engineering map, not a
selected build scope or an accepted schema.

**F1 [SHOWN].** Existing actors, directed axes, jobs and observation records
provide useful owners. Following, durable companion habits/history, living
custody and general companion offline settlement need additional connected
behavior. Rill already has his own local contract; he is not the proposed stray
(`src/nethack_fieldcraft_content.js:46-57,79-112`).

**F2 [STATED].** Authority remains [COMMON](COMMON.md),
[USER_VISION](../../../USER_VISION.md), [PROJECT](../../../../PROJECT.md) and
[AGENTS](../../../../AGENTS.md). The [root palette](../../../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md)
is WITH-player considerations. Playing AS a companion stays in the nonhuman
owners. One realm and one prestige layer, comfortable unfed play without hunger
death, and desktop/laptop first remain standing direction. Future UI target:
**1366x768 CSS viewport**, with dog task/care/history visible beside player work
and reachable routine controls. Mobile optimization is deferred.

**F3 [INFERRED].** Each layer below is conditional on selecting its behavior.
The minimum state is the state its readers need, not every row in the palette
allocated for every animal. Default: sparse records and shared owners. Dial:
richer world laws and individual detail. Reasonably: an ordinary no-job pet is
complete company; absent mechanics produce no invented reward or tragedy.

Evidence: SHOWN = source or local text inspected with a locator; STATED = an
owner's position; INFERRED = proposed engineering treatment. No external rule is
newly verified here. File:line numbers are a concurrent-checkout snapshot.

## S. State model and owner placement

All proposed fields and placement choices are INFERRED. Existing-code cells are
SHOWN. Resolve final names with the owning implementation lane before adding a
schema. Keep only references where another owner holds the canonical fact.

| Code / state | Minimum information and palette readers | Existing owner or new seam | Save impact and old-save default |
|---|---|---|---|
| S01 Identity/body | Actor ID, definition/revision, body identity, admitted species/template, stable name/aliases and generated origin. A, DH, EC, FJ | `simulation.people` plus `state.actors`; spawn copies body/vitals/lifePolicy, with bornAt set at spawn (`src/simulation_effects.js:200-209`). Shared template/function queries belong to [nonhuman spec](../../../worlds/NONHUMAN_STARTS_ENGINE_SPEC_2026-10-14.md), not another pet body. | Persist resolved generated identity and revision, not seed alone. Existing actors retain IDs. No old save gains a stray, alias or changed anatomy. Cosmetic race is not a pet template. |
| S02 Bond tracks | Directed numeric trust, affection, obedience, understanding, respect only where selected; separate companion→player, player→companion and companion→companion edges. C1-C4/C7, DA/DP/EG/ER/FA/FF | Existing `simulation.relationships[actor][target].axes`; finite numeric axes and 32 recent memories validated (`src/simulation_contracts.js:250`). Writes dedupe cause+actor+target+axis (`src/simulation_effects.js:285-292`). Semantics: [OWNER_MAP OM3](OWNER_MAP.md). | New namespaced axes use explicit baseline readers; missing is a selected neutral baseline, never high loyalty. No unconditional affection-to-obedience conversion. No copy of predecessor edge onto heir. |
| S03 Terms/channels | Grantor, recipient, executor, scope, price, end clauses, revision, consent basis, active/suppressed state, reach and expiry. C5/C6, DM/DT/ES/FG | NEW typed companion agreement/reference adapter under nonhuman bonds/control owners. Work `controllers` are not body control; [nonhuman spec §4](../../../worlds/NONHUMAN_STARTS_ENGINE_SPEC_2026-10-14.md#4-controller-versus-bodies-and-npc-rules). Observation channel precedent below is narrower. | Empty grants by default. Save actual agreement/acquisition causes and revisions. Friendship, adoption and creation confer no control lease or sense channel. |
| S04 Needs/readiness | Selected resources, vitals, conditions, intake/rest policy, funded care coverage and pause reason. E/BD/AH, DF/EH/EP/FE/FI | Existing actor resources, person vitals and `simulation.conditions` (`src/simulation_contracts.js:240,252`); dog satiety/stamina intake precedent (`src/nethack_fieldcraft_content.js:79-83`). Species diet/rest and coverage adapter NEW; shared body owner supplies policies. | Store mutable pools/condition boundaries, derive readiness. Missing need can mean unneeded, unsupported or unknown by policy, not an invented empty bar. No timer drain retrofitted to Rill. No lethal feeding upkeep. |
| S05 Habits with provenance | Habit ID, context/trigger, response, strength or discrete learned level, learning policy revision, source cause refs, last reinforcement, retraining state. DB/DD/DR/ED/EP/FC/FA3, C3:R103 | NEW sparse learned-behavior adapter. Existing Rill `lessons` and learning axes are an example, not a generic habit schema (`src/nethack_fieldcraft_content.js:84-89`). [PROCGEN I2/I8, D](PROCGEN.md) routes generation. | Distinguish authored/generated baseline from learned changes. Bound supporting examples; preserve durable anchors used by open arcs. Old saves have no inferred training from name or food stock. Repeated render never reinforces. |
| S06 Memories/history | Event ID/cause, participants, place, declared clock/iteration, event type, durable summary/facts; separately recall access and observer basis. DD/EF/EK/EL/EN/AF/FK | Recent edge memories exist but truncate to 32 (`src/simulation_effects.js:292`). NEW durable milestone/episode refs for lifelong history and callbacks; observer knowledge already stores stage/value/time/cause (`src/simulation_contracts.js:249`). | Keep event truth, companion recall and player knowledge separate. AF1 lifelong memory and AE5/AF4 forgetting/reset remain both available ([JOURNEYS JX01/JX11](JOURNEYS.md)). No fabricated past in migration; no reward authority in lossy prose. |
| S07 Preferences/wants | Subject/context/value, origin (template, generated, learned), supporting event/source refs, optional current goal. DC/EG/EP/FB/FC, O4 | NEW companion profile adapter, linking real goal/story owners rather than a second quest store. [PROCGEN I1-I3/I6-I8](PROCGEN.md), [BOND_CRAFT BB07](BOND_CRAFT.md). | Persist resolved baseline and changed preferences. Unknown favorite is unknown. Dietary liking is not safe intake; a goal can end without player loot. |
| S08 Life stage/age | Initial adopted age or age interval, biological exposure accumulator/anchor, clock policy/revision, current stage and transition cause, known age estimate. CB/D7/V, DG/DO/EF/FI | Existing `bornAt/lifePolicy` validates and ages on common clock (`src/simulation_contracts.js:238-241`; `src/simulation.js:456-461,487-496`). NEW adopted-age/stage/exposure adapter for selected aging; shared nonhuman E12 owner. | Preserve exposure independently of enrollment date and resets. Never assign a guessed birthday as exact. If using scalar first-slice lifespan, bind remaining eligible lifespan explicitly; do not backdate natural bornAt below zero or quietly change existing semantics. |
| S09 Marks/objects | Stable visible markings tied to template or actual injury/change; object refs for collar, toy, bed, keepsake and known provenance. EC/DK/CD/FH | NEW profile appearance metadata; physical injury/function change belongs to shared body/conditions. Actual objects remain inventory/equipment/custody owners (`src/simulation_contracts.js:243-248`). | Save resolved mark once with change cause. Scar description does not grant injury; bowl text does not spawn a bowl. Existing appearance stays fixed across load/catalogue update. |
| S10 Routines/jobs | Agreed mode (stay/follow/rest/work), accepted assignment, participants, reserves, due boundary, repeats, stop/refusal cause. L2/DB/FB/AJ/BB | Existing `jobs/controllers/programs`, completion support and frozen outcome (`src/simulation.js:210-219,237-248,256-275,522-551`). NEW stay/follow priority and assignment UI adapter. | Store commitments in existing job owner, not a duplicate companion queue. Missing new policy starts off/paused. For independent forage, dog owns job; reserve player only for actual joint effort, allowing concurrent player work. |
| S11 Location/presence | Actual world/location and supported reach/carrier; last observed/reported location separately. DJ/EO/EN/EQ/FA2 | Actual person location, actor world, simulation relocation (`src/simulation_effects.js:210-220`). Native movement boundary exists (`src/main.js:2152-2164`), but needs a selected companion publication join. | No location derived from greeting prose or party membership. Follow only at an admitted route boundary when available. Busy/stay refusal leaves actual dog at its stated location; UI shows dated knowledge when remote. |
| S12 Custody/title | Subject actor ref, nullable legal owner, actual carer/holder, scope/duration, transfer cause, conflicting authority handling. B/CA/AE/BG/FE | NEW living-custody adapter under nonhuman society. Existing `simulation.custody` is item-key/count loans, not living title (`src/simulation_contracts.js:248`; `src/simulation_effects.js:275-278`). | Absent title means no declared title. `createdBy` is spawn provenance, not ownership. Claim transfer, care, affection and body control change separately. One accepted assignment prevents competing carers duplicating work. |
| S13 Observation/cue state | Observer, event/cause, channel/basis, known detail, template/revision, selected variant, issue version, compact cooldown/dedupe history. L/Z/ET and all micro families | Existing knowledge plus observed People projection (`src/people_knowledge.js:6-8,12-28`). NEW replay-safe cue selection ledger. [PRESENTATION B3/B4](PRESENTATION.md) owns proposed restraint. | Persist authoritative notification/cue identity with event, then render purely. Browser tone settings may be local; import-safe dedupe must travel with save. No unknown pet silhouettes/counts or hidden reverse-edge truth. |

Proposed additive adapter sketch, **not an approved schema**:

```text
companion metadata: schema, actor refs, pinned profile/policy revisions
profile[actor]: name/appearance/preferences, habit refs, history refs, life exposure
agreements: typed support/channel refs       living custody: actor claims/care refs
observations: observer-qualified episode refs
presentation: recent cause+observer+surface keys, selected variants, issue versions
```

Bodies, pools, inventories, jobs, directed axes and acquired powers stay in their
current/shared owners. Store no saved effective body or duplicate readiness score.
An implementation may distribute this metadata among approved shared owners;
this diagram identifies missing contracts rather than claiming a new root object
is the right final placement.

## P. Durable pipelines

All P rows are INFERRED connections unless their source cell says SHOWN.
Determinism means the same admitted state/cause/content revision produces the same
result. Reload safety also requires atomic persistence and idempotent admission.

| Code / stage | Proposed event → state → cue → surface contract | Determinism and reload guard |
|---|---|---|
| P01 Admission | Accept an actual feed, rest, training, arrival, injury, task result or disclosure. Validate actor/body/location, funds, permissions and current sequence. | Pure preview consumes no draws and writes no history. Commit rejects stale sequence (`src/simulation.js:242-248`, SHOWN). New play gets a fresh cause; retry of the same accepted cause reuses the receipt. |
| P02 State plan | On detached state, reserve inputs and actual participants; freeze costs/outcome/body/content refs; update only supported pools, edges, habits and episodes. | SHOWN frozen job fields and completionSupport at `src/simulation.js:210-219`; spawn-template freezing at `src/simulation_resolution.js:9-32`. Generated identity needs saved resolved output/revision plus seed. Cosmetic/cue choices must not shift work or identity RNG. |
| P03 Settlement | Advance declared eligible time to boundary; recheck completion means/consent/co-location; refund or pause by saved terms if support is lost. Publish real outcome, episode and observation basis together. | SHOWN completion recheck/refund at `src/simulation.js:256-275`; cause-deduped axes at `src/simulation_effects.js:285-292`. Add habit/milestone idempotence, not just axis receipt reuse. No raw jump past a choice or unresolved loss. |
| P04 Observation | Determine witnesses through real presence/senses or an admitted report channel; create observer-qualified receipts. Private companion history can affect its decision without entering player knowledge. | Save witnessed versus reported versus interpreted basis, sampling time and source. Existing internal target conditions are explicitly not disclosure (`src/simulation_effects.js:145-158`, SHOWN). Never hand internal fact maps directly to UI. |
| P05 Cue eligibility | Read body, readiness, habits, known marks/history and scene. Filter by observer access, selected species cues, tone, spacing and actual context. A cue can describe behavior without declaring its certain motive. | Stable ordered candidates; no candidate means silence. A fictional anomaly needs a world law, not an ethology claim. Habit callback requires a retained event; grief requires known loss, not a silent channel. |
| P06 Cue selection/persist | Choose eligible template by event/actor/observer stable key and pinned revision, or a separate admitted cue stream; save chosen variant and compact dedupe key with its causing plan. | Store selected text where exact archival wording matters, otherwise retained template+safe arguments. Failed persistence publishes neither output nor cue. SHOWN full-envelope staging validates before `storage.setItem` (`src/expansion_persistence.js:5-16,30-50`). This function does not itself call `writeGuardedSave`; integrate the size guard deliberately rather than claiming all transaction writes already enforce it. |
| P07 Text surface | Render saved safe text and known links into inline action result, Background, Events, People/Z1 or history. Passive redraw changes no state and emits no fresh notice. | Use text nodes/escaped arguments for generated names and prose. No reroll on sort, hover, reload or import. One event shared by pair views consumes one notification slot. Reload can display history without re-announcing it. |

Default cue selection is downstream of real actions. Dial: richer authored scenes
or generated callbacks. Reasonably: if a scene changes stock, route, health or
permissions, it returns to P01-P03 as a command; decorative text never performs
that change. A purely observed act may still create its own observation event,
without awarding XP or affection for every sentence.

### P08. State → cheat reveal through observation channels

SHOWN source precedent is narrow: `src/observation_channels.js:6-7` declares
**detached information-only plans**; `:21-30` admits light/sound flows with actual
listener means and finite played lifetime. Stale sequences/duplicate causes are
rejected (`:109-118`); live lease/body/edge and listener source/anchor checks exist
(`:142-177`); detection needs a current committed sample, not replay (`:186-191,
228-236`). This is not a delivered generic animal telepathy or memory-view API.

INFERRED proposed flow for DT/J33, J36, J40 and other reveal candidates:

| Code | Stage | Reload-safe boundary |
|---|---|---|
| O01 Acquisition | Independently earn a named faculty/power through its world route; save actual acquisition cause, source and scope. | Seeing a cue or opening Inspect neither enrolls a channel nor acquires a cheat. High trust alone grants no power. |
| O02 Supported sample | Resolve current observer, companion body/presence, channel, permitted target/fields, reach, cost and time. Admit a lease or local perception receipt. | Recheck at commit and after form change/closure. A new scent/telepathy/memory flow needs validated extension; cannot pass through current light/sound allowlist. |
| O03 Evidence result | Apply selected faculty to a scoped sample: one want, one witnessed episode, a permitted life account or a fallible report. | Persist exact subject/observer/cause/channel revision/time and uncertainty. J36 reveals what it perceived, not all world truth; J40 cannot recreate never-retained memories. |
| O04 Discovery | A legitimate receipt can introduce the known fact or earned power detail. Ordinary cues can offer a discoverable lead without disclosing its hidden cause. | Keep acquisition, detection, identification and disclosure distinct. Sealed truth appears only on its authored discovery route; reports refer to secret ID/route/status. |
| O05 Presentation/replay | Show known result and channel limits in People/Inspect or attributed speech. | Reading stored evidence is not another sample, reward or new identity verification. Channel closure stops new receipts; earlier known evidence remains dated. |

Default: ordinary observation and attributed testimony. Dial: authored truthful
one-line empathy, shared sight, retrospective memories or mistaken translation.
Reasonably: information scope is explicit even for a truthful channel. Neither
closeness nor raw serialized state licenses a public hidden-state dump. [REVEAL_CHEATS](REVEAL_CHEATS.md) RF0-RF6 supplies a fidelity set: cue,
named mood, labelled need, exact field, cause history, private thought and forecast.
Its current file contains the ladder/shared constraints but not the 26 cards
claimed by its checkpoint. Do not invent their missing executors or costs.
C13 supplies these seams.

### P09. Late-input reconciliation, both positions retained

| Code | Documentary positions | INFERRED code treatment, not selection |
|---|---|---|
| CF01 Cue timing | [MICRO_BEHAVIOUR FR02](MICRO_BEHAVIOUR.md) proposes one global line every 3-5 visible real minutes, Quiet 8-12, Lived-in 1-2; [PRESENTATION B1](PRESENTATION.md) proposes standard six/active hour and eight-minute spacing. Neither is a measured engine or animal rate. | Preserve both configurable policy candidates. C9 explores visible texture; C10 budgets scarce log attention. Choose one policy per future slice and test it; do not add their allowances or silently present six/hour as consensus. Pause/hidden time earns no backlog under either. |
| CF02 Save-free cues | Root GC3/HD7 proposes seeded render-time save-free cues; C10 B3 asks for an import-safe saved dedupe/selection record. | A passive current-state caption can be pure and save-free from pinned state/context. A newly emitted line, milestone or historical notification needs durable identity or a proven derivation from existing durable receipts. Saved compact emission metadata is the proposal here; it is not a second hidden-state ledger. Pure seeded text alone cannot prevent replay or preserve rate history. |
| CF03 Reveal-only view | Root GC4 calls reveals views saving card and remembered result; C12 RF ladder permits acquired private-thought/forecast domains. | Pure display of an already-known scan needs no new state. A paid scan, detection, breach or acquisition is an actual command with costs/receipt/replay guard. Forecast is conditional evidence tagged model/time/branch, never a future actor mutation. RF3 numbers disclose target/direction/scale/as-of time. |
| CF04 Species reads | C9 MB03/MB14 and RC rows distinguish visible acts from diagnosis/motive, anatomy from species slogans, baseline from new change. | Cue definitions declare body/species domain, observable act, relevant baseline/context, alternative interpretation and knowledge/channel requirement. Test no inappropriate body parts, no affection from immobility/restraint, no illness or trap identification from a generic sign. Fantasy cues use an authored lexicon. |
| CF06 Per-world tension policy | [TENSION_DEFAULTS](TENSION_DEFAULTS.md) T1-T7 retains memory, fate/clocks, missing/dead, obedience, heirs, groups and aftermath across six authoring lenses; G1-G3 gives quarantine, conflicting-carer and sapience review procedures. | Bind a revisioned world policy for each selected operation. Keep event truth/recall/known evidence independent; preserve necessary care while discretionary orders pause. Add policy fixtures for only the selected lens, including current-iteration consent and group promotion conservation. Lens defaults do not override sourced actor exceptions or accepted no-hunger-death direction. |
| CF05 Root expansion | Root round 10 adds HD abstraction, HE/HF craft/research, HG habits and HH retcon/variant lenses; those later lanes are not selected implementation. | Reuse actor/link/terms/clock owners. Making a companion uses a validated spawn, crafting WITH/FROM uses actual reserves/material provenance; research writes dated evidence, not biology by description. Retcon and variant sight need branch/world-qualified event refs and a permitted cross-branch channel. Same species or coincident generated traits do not prove same individual; root HG4 uniqueness is a design wish, not a mathematical guarantee from seeds. |

## M. Save, migration and size

**M01 [SHOWN].** Current reader admits simulation schemas 1-6 with a numeric
enrollment anchor (`src/simulation_contracts.js:223`) and fork schemas 1/2
(`src/save_files.js:99`). Nonhuman spec proposes fork 3/simulation 7 and nested
body validation; those numbers are proposals, not live contracts. Allocate final
versions from live constants when implementing and coordinate shared migration.
No extra service enrollment merely to store a dog/body.

| Code / incoming case | INFERRED defaults and compatibility treatment |
|---|---|
| M02 No companion metadata | Preserve absence. Introduce dog only through actual future encounter; new habits/history/cues empty, channels absent, automation off. No retroactive feed, birth, trust, elapsed absence or gift. |
| M03 Existing authored actor/Rill | Preserve exact body/resources/lesson axes/location/stock/causes and local restrictions. Optional adapter tags an existing ID with an idempotent origin cause, without spawning another dog or awarding loyalty. |
| M04 Existing generated actor | Preserve resolved names, marks, past, preferences, graph and revisions. Seed-only regeneration after catalogue change is not migration. Keep unknown/suspended content exportable if a safe reader exists; otherwise reject before write. |
| M05 New fields | Validate finite pools/axes, bounded strings/lists, unique causes, permitted clock policies, future-schema rejection, references to actual actors/bodies/items/templates, directed edge endpoints and custody/lease scope. Any inert unknown extension is retained only under explicit non-executable policy. |
| M06 Full entry points | Migrate cloned complete envelope before dependent validators/native publication. Cover normal load, autosave/manual save, export, file import, backup/other-release restore and staged plans. UTF-8 file encoding/decoding and real-loader preflight exist (`src/save_files.js:158-191`, SHOWN); every new owner must reach them. |
| M07 Mid-job/transition | Pending forage includes paid reserve, frozen outcome, due boundary and completion terms; final result carries a durable settlement receipt. Import is restoration, not settlement again. Reset scopes separately declare body/exposure, recall, edges, inventory, custody, grants and work. Safe boundary/paused programs are precedents (`src/simulation.js:559-597`, SHOWN). |
| M08 Heir/loop/world carry | Surviving actor continuity needs explicit manifest and clock conversion. Heir builder replaces expansion rather than copying companions (`src/life_experience_host.js:17-24`, SHOWN). Offspring receive new identity/baseline; contracts and predecessor affection are not inherited grants. Preserve both memory and forgetting dials from JX register. |

### M09. Proposed measurable budgets, including R army scale

All numeric companion budgets below are **INFERRED starting targets**, not
measured limits, content caps or a scope choice. Count incremental bytes across
all owners, including attributable cause/knowledge/job records. UTF-8 JSON bytes
and UTF-16 local-storage bytes differ; actual helper measures both
(`src/save_files.js:194-207`, SHOWN). Encoded export adds base64 overhead, roughly
4/3 of UTF-8 bytes plus its prefix. Measure that file too.

| Code / fidelity | Proposed UTF-8 JSON target | Contents / adjustment dial |
|---|---|---|
| ZB1 Named active companion | ~8 KiB normal, investigate above 16 KiB | Small resolved profile, up to about 8 active habits with compact provenance, recent 32-edge memories, about 24 curated milestones, limited presentation ring, obligations and active work. These are sizing examples; active promises/claims are never dropped to hit a count. |
| ZB2 Archived/departed individual | ~1-2 KiB summary plus live references | Retain stable ID, ancestry, known history, legal/contract duties and material/source refs. Archive access differs from the mind's recall. Dial expanded detail/export archives, with explicit retention compatibility. |
| ZB3 Aggregate troop/herd/colony | ~2 KiB per group plus saved exceptions | Count, species/body-policy revision, location, supplies, aggregate exposure, assignment/loss receipts, membership allocation and promoted refs. Nameless many do not each get a 32-memory ledger. |
| ZB4 Army example | 10,000 units in 100 groups (~200 KiB), 50 named actors (~400 KiB), ~100 KiB shared definitions/receipts: ~700 KiB total target | Illustrative R1/R3 representation, not a tested benchmark or fixed cap. A fully individual 10,000×8 KiB model would already be ~78 MiB before other owners, unsuitable for this save path. Promotion removes exactly one member/count from its group and creates one stable individual with traced provenance. |
| ZB5 Envelope headroom | Companion subsystem aim ≤~1 MiB UTF-8 on army fixture; complete save must pass actual origin check | SHOWN guard uses a conservative 4 MiB **UTF-16 storage** budget including other keys (`src/save_files.js:194-213`). A 700 KiB ASCII subsystem costs roughly 1.37 MiB storage before native save/backup. Available headroom must be measured, not inferred from subsystem budget. |

Default sparse named few/grouped many. Dial more detail when devices/storage and
chosen play justify it. Reasonably: progressive fidelity has deterministic
promotion/demotion and conservation; no arbitrary gameplay population cap.
Compaction removes only redundant/closed detail after preserving any replay
barrier and reference consumers. The global cause map can grow; truncating it
without an equivalent duplicate-proof watermark/receipt scheme is unsafe.

## T. Runtime and offline performance

| Code | SHOWN seam / INFERRED treatment | Measurement or code guard |
|---|---|---|
| T01 Boundary work | Scheduler scans jobs/controllers/conditions/people (`src/simulation.js:456-461,474-495,522-551`). Default add stage/need thresholds as due boundaries; derive smooth values lazily, not per animal per visual frame. | Profile 1/10/100 named actors and R grouped army. Count boundary work, copies, serialization/validation and UI update time. The source scans are not proof of scale. Add indexes/priority queues only for measured bottlenecks. |
| T02 Scheduler budget | SHOWN common advance exposes remaining time and budget exhaustion at 512 boundaries (`src/expansion_engine.js:640`). Default drain supported remaining time in bounded chunks without losing it. | Preserve boundary order, stable tie-breaks and interruption at player choice. Yield to UI; budget exhaustion is unfinished work, never a reason to manufacture settled outputs. Compare split/continuous/save-restored trajectories. |
| T03 Offline settlement | [IDLE_AND_PRESTIGE F4/IE6](IDLE_AND_PRESTIGE.md) records a narrow prepaid packing exception, not companion replay. Default closed browser freezes companion needs/age/work; no wall-time subtraction added to N1. | If selected later: saved reviewed scope, reserve, clock/revision, monotonic anchor, eligible duration cap, stable batch receipt and stop cause. Guard backward clocks/repeated imports. Common-clock credit must state every exposed actor/condition, not just dog outputs. |
| T04 Absent worlds | Lifespan loop has no world filter (`src/simulation.js:487-496`, SHOWN). Default frozen home exposure is a proposal requiring an adapter, not supplied today. | Either connect per-world exposure before enabling away-world lifespan, or keep that behavior outside the selected local slice. Do not say registry retention means care or frozen aging. |
| T05 Cue/line budget | [PRESENTATION B1-B5](PRESENTATION.md) proposes global standard ≤6 ambient lines/active foreground hour, ≥8-minute spacing; quiet 0-2, chatty ≤12 with ≥4-minute spacing. Supported return ≤2 ambient sentences total. | Share budget across animals/families, no paused/hidden backlog, no quota. Real outcomes/issues stay retrievable independent of flavor cap. At most three grouped return outcome rows plus current issue; expand receipts. Preserve first-class work/Stop controls and reading scroll. |
| T06 Many companions | Default evaluate cues only for dirty relevant actors or actual scene participants; index eligible local neighbors and retained callback refs. | Avoid all-pairs bonds/cue comparisons each tick. Sparse edges give O(known ties), groups give O(active groups+named actors), not O(total units²). Pair cues cost one line; virtualize long roster/history as measured, retain keyboard focus. |
| T07 Performance targets | INFERRED laptop starting targets: p95 companion contribution <4 ms in a supported ordinary update, cue projection <2 ms, no synchronous companion task >50 ms. | Record machine/browser/fixture, before/after whole-envelope save bytes and p95 save/import duration. Adjust target to measured baseline and frame budget. These are investigation thresholds, not claimed passing tests or universal timing laws. |

## G. Tests and verification gates for a selected implementation

These are future gates, **all OPEN** here. Use generated fixtures and a disposable
origin, never player saves. Gate depth follows selected behavior; broad body
control, worlds or army support are not prerequisites for a local stray.

| Code / layer | Checks that establish this slice | What they do not establish |
|---|---|---|
| G01 Unit/contracts | Pure previews/projections with no mutation/draw; directed axes; duplicate cause does not relearn/pay; real input conservation; dog-only errand occupancy; lost means/consent/scent at completion refunds or pauses exactly; deterministic habit retraining/stage changes; text escaping; observer/private-state exclusion. | Voice, warmth, natural acquisition or UI readability. Retain Rill and human regression contracts without treating their success as new-stray proof. |
| G02 Save/migration | Old absent/Rill/scalar-body and admitted generated fixtures; migrate twice equally; future/dangling/invalid clocks rejected without overwrite; quota/preflight/write failure leaves live owners unchanged. Pending/cancelled/completed tasks, cue ledger, new/known loss, imports and catalogue revisions preserve exact semantic state and next RNG decision. | Real browser file control or runtime restored UI. Include combined-envelope validation, not only metadata JSON. |
| G03 Headless story QA | Fixed seed/world/stage manifests, legal scheduler advancement, actual event/refusal/callback histories; compare continuous/split/restored runs. Reuse [PROCGEN H1-H5](PROCGEN.md), [JOURNEYS JX](JOURNEYS.md), [BOND_CRAFT BB/BX](BOND_CRAFT.md). Negative controls: renamed identical pets, fabricated memory, omniscient cue, duplicated group promotion. | Human attachment or taste. Track semantic response repetition excluding name/coat/synonyms; calm silence/no-job life is valid. Public reports use safe summaries/secret IDs only. |
| G04 Rebuilt browser | `npm run build` and served candidate identity; own fresh origin at **1366x768**. Naturally meet new stray, pay first and second feed, inspect actual follow/stay/busy location, run dog forage during native player work, obtain one real useful item, observe supported age/quiet cue. | Prebuilt bundle or synthetic fixture success cannot replace changed-positive native journey. Record played route and limitations; missing behavior is implemented-unverified. |
| G05 Persistence in browser | Save/reload, Export, **literal-file Import through real loader** during pending and after completion. Compare ID, body/exposure, needs, directed history, custody, stock, queue, receipts, known evidence and replay behavior. Also negative/refusal and interrupted route where changed. | Clicking Save alone or importing an in-memory object does not prove the file/restore path. No duplicate forage, adoption, notice or new hidden knowledge after import. |
| G06 Desktop/tone | Busy work and combat remain usable; long names, keyboard/focus Inspect, muted ambience, oldest log reading, known loss/remembrance off, grouped return if supported, many-companion roster if selected. | Tests and screenshots do not grant Weibao's fiction/balance/layout acceptance. Mobile stays deferred. Distinguish source, test, rebuilt behavior, persistence and human acceptance in final report. |

## L. Dependency layers from N1 outward

This is a dependency graph in prose and rows, **not a schedule or selection**.
N1 is the requested anchor for implications, not new authorization to build it.
Shared body work is reused where needed, but full N-body control, nonhuman player
start, generic combat and whole-world adoption are not imposed on N1.

| Code / layer | Depends on / concrete deliverable | Palette unlocked when selected and connected |
|---|---|---|
| L00 Shared contracts | Live body/schema choice, actor/clock/observation ownership, deterministic causes, validators and complete-envelope publication | Common backbone for N1; root N, EC stable identity, lawful local care. Either preserve admitted scalar first-actor contract or adopt shared nested migration with its owner; never a pet-only body. |
| L01 N1 local stray | L00 plus authored new dog encounter/two paid feeds, sparse dog→player bond, safe local follow/stay join, dog-owned finite forage, explicit initial age/exposure and roundtrip | B2, C1/C2 subset, E1, L2, D7 readable age, EO presence; one useful item while player works. Root's proposed aging is included if N1 is selected, with nonlethal care and supported clock. No claim that two feeds buys universal obedience. |
| L02 N2 knowledge/cues | L01 observation receipts; S13 cue ledger and species-safe templates. Existing People view extended, optional durable milestone adapter only when history needs it | L1/L3/L4, Z1-Z3, DA/DJ/DP/EK/ET, witnessed micro texture. Cheap derived N2 status need not require full lifelong archive; callbacks do. |
| L03 N3 care and habits | L01 jobs/resources plus optional supported rest/care policy; S05/S07 sparse preference/retraining reader | E6/V played idle, DB/DC/DR/EA/ED/EP/EJ/FB/FC/FH. Known safe finite repeats and visible pause/rest; general offline simulation remains separate. |
| L04 N4/N5 useful senses/carry | L01-L03 as relevant; N4 current scent/training/finite claim; N5 exact object stock/custody and admitted carrying function | DE warning/lead, EM real win, BB1/BB4, G3 local parcel, DK object history, C3:R104/R106. Mount speed, remote postage and living world crossing need extra consumers. |
| L05 History/life/first renewal | Durable S06 events, S08 clock/stage, reset retention adapter and known aftermath; depends on only the selected local behavior | DG/EF/EL/EN/FI, CD/DQ, BB03/BB11, CJ/CK first-prestige fate preview and retained learned method. No automatic heirs/descendants/revival. |
| L06 Typed support and reveal | S03 agreements, shared body functions/reach, acquired source and O01-O05 observation pipeline; optional pair readiness | C5/C6/C10, P communication, DM/DT, J33/J36/J40 within granted scope, BA/ER pair acts. Bodies/control/shared XP remain with nonhuman/progression owners. |
| L07 Later outward branches | Select their prerequisite contracts: mount route/tack/stamina; world passage+habitat+exposure; heir actor manifest; generation locks; evolution/body retention; group membership/conservation | G travel, BF crossing, I succession, M3/W7 lineage, Q form/control, R army. Each branch can stand apart; none silently becomes a first-milestone gate. |

**L08 default/dial.** Default first local dependency surface keeps existing solo
progression viable and uses one realm/one prestige. Dial source-specific familiar,
construct, colony, spirit or speaking ally only with the corresponding owners.
Reasonably: all broad palette routes stay considerations; a finished local slice
ends at playable evidence before another selected slice starts.

## BX. Risks translated into code guards

BX labels retain [BOND_CRAFT](BOND_CRAFT.md)'s IDs. These are INFERRED engineering
guards, scoped to a selected companion promise; source-specific tool/compulsion
roles remain available without pretending they prove affection.

| Code | Guard and useful negative case |
|---|---|
| BX01 Output-only actor | Companion view/scene consumer accepts a no-job/retired actor; history and known presence do not depend on `productivity > 0`. Fixture zero-yield dog retains identity/verbs/history. |
| BX02 Gifts buy obedience | Separate intake, regard, current willingness and typed command permission. Feed handler cannot set all axes or clear grievance/terms. Test liked treat plus declined task, full intake no spend, compulsion without affection. |
| BX03 Rescue settles life | Rescue transition preserves kin/goals/fear/other obligations and records only its selected regard effects. Test rescued ally remains unavailable for an independent duty. |
| BX04 Confession replaces history | Disclosure requires a present event/channel and preserves prior acts; callback needs real event ref. Short intense bonds may use few significant acts, never fabricated years. |
| BX05 Refusal as bug/trap oracle | Typed reason uses fatigue, current duty, preference or dated belief, with uncertainty. Refusal does not auto-set `trapKnown=true`; support failure cannot quietly become successful work. |
| BX06 Goal as reward dispenser | Goal completion can update companion state/availability with zero player reward. Reward executor requires its own actual inputs/output/cause, never generic `goalDone => loot`. |
| BX07 Replacement erases loss | Unique identity/life/branch refs; new name/template never joins old edges automatically. Revival/copy/descendant declares retention independently. Group promotion conserves count/stock and prior member cause. |
| BX08 Closeness gives omniscience | UI consumes allowlisted observer DTOs, not `simulationFacts` or entire actor objects. Sample/channel scope controls disclosed fields. Test high trust with unknown motive/location and sealed lead remains unknown. |
| BX09 Repetition/absence farm | Reinforcement keyed to real learning event/context; cue suppression has saved compact history; no wall-time affection decay by default. Long repeated care can be compressed without dropping actual costs or obligations. |
| BX10 Sacrifice graduation | Loyalty/story templates have peaceful/refusal/retirement alternatives. No `bondMax` requirement depends on lethal sacrifice. Loss needs explicit authored permission/comfort policy, not automatic offline drama. |

Additional risks from [OWNER_MAP G1-G3](OWNER_MAP.md) and [JOURNEYS JX](JOURNEYS.md):

| Code | Guard and conditional dependency |
|---|---|
| RX01 Clock/reset ambiguity | Every mutable age/need/work record names a time basis; migration rebases anchors explicitly. Renewal does not rejuvenate a dog; absent world does not borrow player elapsed time. |
| RX02 Conflicting caregivers | One active accepted assignment/version per actor, priority/hold reason and scoped grants. Revalidate care stock and caregiver effort; competing commands cannot reserve the same dog twice. |
| RX03 Sapience transition | Preserve identity/history and necessary care; pause discretionary grants needing review. New speech neither proves previous consent nor grants control. Keep local law distinct from actor agreement. |
| RX04 Contagion/quarantine | If selected, condition transfer needs actual exposure/contact/channel cause, supported isolation/carer and exit test. A scratching cue cannot infect another actor or confirm disease. No medical/ethology fact asserted by this code proposal. |
| RX05 Performance/lossy history | No renderer writes RNG/state, no frame tick for all army members, no all-pairs social mesh, no pruning replay/obligation refs to meet size goals. Current cause/memory scans need measured scale checks. |
| RX06 Source drift/secrets | Pin template, generator, cue and world law revisions; future edits do not reroll saved facts. Debug public artifacts redact secret truth/trigger mappings, refer by ID. Never use a raw hidden-state dump as a verification screenshot. |

## Q. Unselected implementation seams

| Code | Concrete decision belongs to a later selected packet |
|---|---|
| Q01 | Local follow endpoints, useful finite forage output, adopted age/exposure and exact shared body compatibility schema. These make N1 concrete without changing Rill. |
| Q02 | Durable history/provenance retention, cue ledger placement, template archival policy and measured save/performance baselines. Sparse targets above remain adjustable. |
| Q03 | Selected world terms for custody, comfort/loss, memory disruption, channels and resets. Both sides of OWNER_MAP/JX tensions remain available. |
| Q04 | Completed C11/C12 reports and C12 remaining cards reconciliation when those outputs arrive; input status is in C13_REPORT, not a user approval request. Their rates/lore/route suggestions cannot silently become implementation requirements. |

No reply is needed to use this engineering map. Selection, source implementation,
headless checks, rebuilt native play, persistence and director acceptance remain
separate states.

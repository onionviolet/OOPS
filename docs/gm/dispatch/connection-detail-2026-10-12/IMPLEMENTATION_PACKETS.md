# Five implementation packets

2026-10-12. Proposed future execution only. No writer is dispatched by this file.
This return owns planning files, not the code areas listed below. Current World1,
customization, UI and minigame owners must release or explicitly assign affected
areas before implementation. A selected packet ends in rebuilt native play;
source/build/browser/save/human acceptance remain separate states.

## Frozen dependencies and writer areas

| Packet | Frozen leaves | Dependency order | Proposed exact exclusive area and retained existing owners |
|---|---|---|---|
| CD-P1 | X08-A, X12-A, X18-A/B | First; existing compatible start only, CD-D1 if NPC performs new work | One world author: new `src/connection_local_life_content.js`; root integrator alone `src/main.js`, registry, `src/save_files.js`; current structured/World1 owner keeps existing pack modules |
| CD-P2 | X01-A/B, X02-A/B, X04-A, X14-A | After actual resident/contact from P1 or existing local entry; CD-D2 and MD4/5 only for selected joint task | New `src/connection_shared_life_content.js`, `src/connection_shared_life_state.js`; scheduler integrator alone any `src/simulation.js` change; crush/society and UI areas retained |
| CD-P3 | X05-A/B, X06-A/B, X15-B | After supported local contact/consumer from P1 or existing world; CD-D3 and MD3/5 selected only | New `src/connection_learning_content.js`; knowledge/material integrator alone any effects/native adapter change; Village/Proto23 study owners retained |
| CD-P4 | X11-A, X12-A, X15-A, X14-A | After exact real material consumer from P2/P3 or already present; CD-D4 and MD7/9 | New `src/connection_creation_content.js`; customization owner owns function manifest and its candidate; one stock/main integrator, no copies into others' candidates |
| CD-P5 | X07-A/B, X17-A/B, X18-A | Extract after one concrete packet reveals repeated author issue; parallel documentation can precede P1; CD-D5 diagnostic only | Proposed `docs/authoring/connection-loop-starter/` and narrowly selected `tests/connection_author_contract.test.js`; compiler owner alone `src/structured_pack_definitions.js`; UI owner retains presentation |

Exact new file names are reservation proposals, not permission to claim a file
that another live owner has since created. No packet waits for all other worlds,
universal NPC society or all eighteen families. P1 can be delivery/acknowledgment
using the existing explicit player host; autonomous recipient use has CD-D1.
P2 and P3 can run independently against an already introduced resident. P4 can
consume an existing recipe directly without rebuilding P2/P3. P5 does not block
ordinary authored content.

| Dependency | Owner and exact resolving choice | Reused prior gate |
|---|---|---|
| CD-D1 | Native integrator: select explicit recipient dispatch or enrolled controller at structured origin, with current due/support/restore semantics | G5 invocation and MM actual recipient; controller declaration alone is insufficient |
| CD-D2 | Relationship owner: one durable invitation/answer/commitment descriptor independent of bounded memories, participant occupancy and cancellation policy | MD4/6; no general romance rewrite |
| CD-D3 | Research/material owner: one unsealed question, compatible experiment and actual output/use; actual recipient adoption path | MM09, MD3/5 |
| CD-D4 | Customization/power/material owners: exact acquisition, output item identity/amount, free repeat semantics, actual material consumer and informed order change | MD7/9; no blanket economy or power ceiling |
| CD-D5 | Body/tooling owner: pick one form/channel/target missing consumer and report precisely, or implement that single selected native adapter | MD8; diagnostic may finish without gameplay adapter |
| CD-D6 | Temporal/knowledge owner: one message sent/received/correction carrier, explicit supported clock and equal-time order | MD10–12; broader postal/appointment system not required for P1 |

Every packet's future positive and counterexample cases below are specified,
not run. Persistence adds named local fields only after validators define them;
old saves stay empty for new interactions, with no retroactive romance, wages or
research. Reuse current simulation domains whenever they express the contract.
Missing/mismatched exact content preserves the saved character. No global reset
or silent human conversion is a fallback.

### CD-P1 entry → particular local life

Antecedents: C02–C07, E01/E03/E05/E06, X07/X08/X18, starts P06; MM-P1 MD1/MD3.
Select one owner-approved public local request after a valid committed beginning,
not an all-world generator. The first action introduces one particular resident,
hears their request without accepting it, and can accept/refuse a job or spend a
free quiet moment. Its receipt names actual player/NPC owners, body, place and
local clock. Ordinary native body is the first supported context. Source-bounded
context must use that world's actual pack and body admission; nonhuman starts
remain a body-control adapter dependency, not a hidden human inventory trick.

Existing entry: `main.js:commandStructuredCampaign:1023–1055` durably reserves a
selection before initialization and routes actual action/cancellation through the
simulation/publisher. `structured_pack_runtime.js:planStructuredSelection:36–47`,
`beginStructuredCampaign:52–83` bind body, location, people and origin claim.
`validateStructuredBootstrap:6–25` requires explicitly provisioned simulation
people and validates starts. Admission at 28–32 requires native form/life-stage
compatibility. `structuredCampaignView:86–103` provides discovery-safe controls.

Ordinary life precedent: `feature_expansion_nested_life.js:47–68` has named
recipient, offered finite demand, actual worker input and wage reservation, useful
NPC-owned output, refusal and later account; 64 is a free texture action without
wage or mandatory maintenance meter. Reuse its design pattern, not its exact
native-bound world assumptions or once-only demand as a universal life model.

Exact new work: world owner selects a request already supported by its body's
means, author adds namespaced definitions and knowledge-visible actions. If the
request needs a generic reusable borrowed tool, retain MD2; lens-only custodyUse
cannot be repurposed. New relationship scheduling is CD-P2, not required here.

Future writer reservation: selected world public/private definition owner first;
starts owner reserves its P06 integration; native integrator alone owns main,
registry/save and shared action routing. UI coordinator alone approves layout
changes. This specialist owns none of them.

Save decision: keep current pending/initialized receipt contract; no resample on
failed initialization. Add local namespaced actor/world facts/knowledge/stock to
existing simulation owners; absent fields mean unbegun, not invented history.
Future positive gate: fresh native begin → known introduction → real request →
actual accepted work → NPC-owned useful output → later account, export/reload/import.
Counterexamples: refuse or cancel changes no completed-work reward; wrong body,
wrong participant or missing exact content cannot create half-origin/half-stock;
initialization save refusal retains pending selection for one legitimate retry.

### CD-P2 optional relationship → shared life with independent participants

Antecedents: X01–X04/X09/X13/X14, J01/J04, MM-P2 MD4 and MD6, CC-P01/P03
precedents preserved. Begin with one ordinary shared task and later invitation;
friendship gives the complete task route. Optional romance is a separately offered
scene with its actual participants' answer, not a trust-score reward.

Existing much narrower social loop: `crush_social_content.js:33–73` implements
Tamsin's offer, patient/quick routes, own stamina, declared preference, optional
decline, later account and separately accepted collaboration; 25–29 distinguishes
willingness, practice, body support and completion consent. `crush_social_host.js:
commitCrushSocialAction:21–42` binds allowed commands/cancel/work-plan routes;
`validateCrushSocial:47–62` treats absent facts as inert and requires real previous
meeting and finite named completions. Source evidence establishes these specific
finite interactions, not romance or a general household calendar.

Further actual household precedent: `feature_expansion_society.js:95–124`
separates paid supply, bounded repair agreement and received result. At 128–143
Vale can refuse exclusive service and answer a bounded offer; controllers at
211–219 use actor means. `feature_expansion_society_host.js:25–42` routes accepted
household commands and exact cancellation. Do not recreate this as a new base.

Exact extension: one local joint calendar/commitment descriptor with participant,
invitation/answer cause, accepted scope, own appointment, contact support, due
policy, cancellation and carrier. Durable promises cannot be encoded only in
32-entry relationship memories. A participant declines without player punishment
or erased friendship. A changed body keeps declared identities/knowledge but must
re-establish a usable contact route and current agreement; copies do not inherit
promises without a specific carrier and participant decision.

Native consumer: actual overlapping participant occupancy/reservation determines
whether the task can begin/finish; task output changes a particular owned fixture
or inventory and offers the next known routine. A romance response can change
scene availability without XP, purchases or a global affection threshold.

Future writers: relationship/content owner reserves new namespaced definitions
and contract validation; existing crush/society owners retain those files. The
shared scheduler integrator reserves participant/commitment adapter only if
needed; body owner handles J04; UI coordinator consumes safe projection.
Save decision: optional additive validated commitment owner with migration to
empty on old saves; preserve already received messages/costs under cancellation.
Positive gate: generated save/export, page reload and native import during the accepted appointment must retain participant answers, revision, reserved inputs and pending work exactly. Then invite → actual independent answer → jointly supported task →
recipient uses result → repeat ordinary routine; save during accepted appointment.
Counterexamples: repeated same cause gives no duplicate trust; new gifts cannot
force answer; refusal leaves friendship route; copied/body-changed actor gets no
unqualified restored commitment; absent partner/current consent cancels as disclosed.

### CD-P3 evidence → learned method → actual useful use

Antecedents: X05/X06/X08/X09/X12, J02, MM09 and MM-P1/P2 MD3/MD5; do not invent a
universal research minigame. Ordinary observation/instruction can be the first
loop; canon-bound question remains with world/source owner.

Already distinct owners: `simulation_effects.js:271–274` records evidence basis;
106–116 projects held knowledge versus power/faculty state. `village_career.js:
issueWatchcraft:112`, practice 118, presentation 124 and bonus 129 implement one
native reading/practice/use distinction; teaching 145–174 and named recruit state
140–143 are a bounded Village route, not universal science. `feature_expansion_
society.js:196–206` already provides actual taught ordinary join and power-gated
native log→kit use, with method surviving household closure.

Negative experimental precedent: `game_absorption_assay_content.js:68–103` has a
supported paid trial, conditional results, direct examination and ordinary scraping
that changes actual stock. Purchase is not identification; a negative edge trial
is not free mastery; an ordinary route stays reachable. This is a source seam
example, not disclosure of another world's sealed experiment.

Exact new work: select one unsealed question and two competing observations;
store attributed evidence independently from character interpretation; admit a
replication with actual instrument/sample/time; authorize a local method only
when that world's rule justifies it, and add its actual item/equipment/repair
consumer. Teaching requires named recipient, willingness, compatible means and
received evidence; institutional adoption is another recipient action, not a
world-fact toggle caused by player publication.

Future writers: research/world author reserves local definitions/evidence schema;
materials owner reserves native output/quality consumer (reuse MD5); knowledge
owner owns projection/basis validation. Scheduler/main integrator remains exclusive.
Save decision: local optional additive evidence/interpretation/method records in
existing domains if enough; persistent method carrier must be separately
qualified from knowledge. Old save gains no experiments/mastery. Positive gate:
save/export, page reload and native import with recorded negative evidence and pending replication retain distinct interpretation and method state without granting mastery. Then observe → compare → supported experiment → revise → actual useful use → teach one
willing equipped recipient → their performed result → heard institutional answer.
Counterexamples: hypothesis alone grants no power; failed experiment can remain
negative; witness/teacher note is attributed, not omniscient; recipient lacking
instrument can know but cannot execute; publication alone changes no institution.

### CD-P4 repeated free creation → ownership → bypass → changed aim

Antecedents: X08/X11/X14/X15/X17, J03, MM-P3 MD7/MD9, active customization owner.
Original finite target: held means creates one chosen authored material repeatedly
with zero fabricated resource cost; actual recipient consumes it in one existing
repair/build method. After their supply need is filled, their next offered project
changes. No universal market rewrite or imposed scarcity tax is necessary.

Actual engine: `simulation.js:previewSimulationCommand:118–130` checks held power,
execution predicate and model; `simulation_contracts.js:159–164` admits only
practice/design/investment/authority/hybrid models. `power_models.js:5–43` supports
finite numeric capacity and optional local slots/terms, not literal infinity;
48–54 resolves typed numeric formulas. `simulation_effects.js:244–262` produces
real counted stock and transfer; `structured_pack_definitions.js:60–68` describes
actual identified units and title recipients; container binding at 87–100 is
currently player storage/source-function only.

Do not encode an unlimited source as an infinite number or copy a design model's
slot restriction onto it. Repeatable command with costs:[] and a finite output per
activation already expresses no resource fee and no lifetime production cap. Its
held source availability can be checked with actor faculty facts where the source
rule permits. `power_models` numeric capacity is a representational issue only if
the chosen source truly requires arbitrary scale in a single operation. An exact
adapter would admit requested finite quantity/batch into typed real item effects,
with no invented daily cap, no fixed output ceiling presented as lore and no eval.
Unsupported arbitrary intent must say which target/operation is unsupported.

Recipient-specific effects: transfer to an actual willing holder, consume via
selected existing recipe, retain title/provenance according to MD9. A buyer,
neighbor or institution learns through received goods/inspection/report, not a
universal price adjustment. Material abundance ends that material bottleneck.
Distribution/engineering may remain only when their actual means leave them open;
if the held source also solves them, select those actual effect consumers too.

Future writers: customization GM supplies one exact supported creation function
manifest and output contract; material/stock owner reserves identified output/
recipe join; world/social owner reserves particular recipient's new aim. Native
integrator owns publication, no candidate borrowing without explicit transfer.
Save decision: finite actual stock and cause-based receipts in existing owners;
new optional provenance only if justified, no global counter or fee. Positive gate:
acquire means → create twice legitimately → transfer → native repair use →
recipient reports changed supply/next aim → reload/import retains actual goods.
Counterexamples: same cause retry duplicates nothing; missing source or rejected
publication produces no output; copied certificate/loan rights are not inherited;
free repeated production stays free; no omniscient NPC or universal market reset.

### CD-P5 modular authoring of one honest tiny loop

Antecedents: E01–E08/E10, X04/X07/X17, dependency delivery tool, not prerequisite
rewrite. Extract only repeated author mistakes around command→effect→recipient→
view→durable publication. Existing compiler is the correct first seam.

Existing APIs: `compileStructuredPack(raw,existingRegistry)` at definitions 32;
`mergeStructuredPack(compiled,registry)` at 149; `stageStructuredNativeObjects(d,
{availabilities,makeLocation,makeItem,makeInventory})` at 159. The host must load
through `content_packs.js:loadContentPacks:82–90` and its registerStructured hook;
publication/constructors remain the actual main integrator. No `registerLoop`,
`publishResearch`, universal target parser or per-pack private timer exists.

Exact author deliverable: original fixture plus field-owner table, compatibility
notes and diagnostic reference. Check a real consumer, not just a supported
capability label. Compile catches participant/reference/body/location/collision
errors; add a narrowly selected author diagnostic if a admitted field can lack a
native consumer. The tool may present supported operations, not promise arbitrary
human/nonhuman verbs. UI review reuses center-menu owner.

Future writers: tooling owner exclusively reserves one starter/diagnostic file
area; compiler integrator reserves existing definitions only if required. World
owners keep content; UI/save/native files are a separate shared integrator gate.
Save decision: example pins revision/content hash and uses current exact-content
restore; additive fields need validator/migration and module absence policy.
Positive gate: new author compiles tiny original loop then rebuilt fresh native
begin → inspect → perform → real recipient use → save/reload/import.
Counterexample gate: unknown participant/effect target, conflicting ID, incompatible
body and missing content give precise author error without registering half-content
or replacing saved beginning; unsupported verb reports implementation dependency.


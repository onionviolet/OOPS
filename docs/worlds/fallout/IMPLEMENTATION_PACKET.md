# Water-line integrated proof packet

Status: prepared design packet, not dispatched, 2026-10-03. Requires a later authorized implementation and the named shared prerequisites. [Campaign](CAMPAIGN.md) owns expanded fiction and the [brief](WORLD_BRIEF.md) indexes entry/checkpoint; [local GM role](GM_PROMPT.md) governs delivery. Use the [implementer template](../../GAME_IMPLEMENTER_TEMPLATE.md) for actual assignments.

## Filled assignment

**OUTCOME:** in one isolated Fallout visit, inspect a damaged intake, pay for one preparation, resolve the carrier's valve claim by negotiated reservation or a diagnosed physical bypass, and retain distinct costs, access and witness memory after reload. Refusal/expiry leaves a displaced valve and a costlier later repair, not a reward.

**PARENT:** `world-expansion specialist`, master integrator `/root`; WORLD_BRIEF current checkpoint and campaign authoring v1. **AUTHORITY:** current mode is Develop/Research only. This packet proposes future work; no live implementation authorization is implied.

**BASE:** `/Users/weiwei/code/yet-another-idle-rpg`, HEAD `97c28efece4fd6248b6f075ad0c6927c3d0432df`, extensive preexisting dirty source/docs/bundles. Snapshot source SHA256: `simulation.js c824114398d941db6cf393cf6671c66519e695acff5855590cd406e054a4a056`; `simulation_effects.js e64d422c240a78dfd94410fe73db7b8a95c785136369a5df41918670cc2e5db8`; `expansion_persistence.js 57cb4f38c8023dbb796ab23ae4a790e01d3a0ca12a2863c9c7fe3cc87060b2e0`. Recheck live inputs before dispatch; a commit alone cannot identify the dirty work.

**WRITER:** no implementer is presently assigned. Future proposed local lane: `src/fallout_content.js`, `src/fallout_ui.js`, `tests/fallout_world.test.js`, after master explicitly reserves them. Master owns shared registries, native locations/items/currency, world bindings, save schemas, Events routing, build and combined verification. A worker returns a missing path for reassignment rather than editing it.

**CONTEXT:** original 2287 Water Line arc, three defined actors, uncertain danger, supported imported Load-bearing Step, one workshop bay, present-world played time and frozen absence. Native recovery stays default. Source-derived facts and source limits are indexed by the brief and owned by CAMPAIGN/SOURCE_LEDGER; no canonical faction script or numeric Fallout stat parity is promised.

**DO NOT TOUCH:** private saves, other worlds, unrelated dirty work, upstream attribution/LICENSE, shared adapters or generated bundles without explicit reservation. **ROUTE:** capable integrator settles missing semantics; later local gameplay/UI worker may use master-proposed Luna/high after one representative qualification. No spawning, release or model switching by the leaf.

## Exact existing contracts inspected

| Need | Existing owner/service | Supported use and limitation |
|---|---|---|
| Definitions | `src/simulation_contracts.js:createSimulationRegistry` | Versioned commands, people, sites, events, powers/controllers; validates predicates/costs/effects. Campaign v1 records are not runtime exports. |
| Work and costs | `src/simulation.js:previewSimulationCommand`, `commitSimulationCommand`, `cancelSimulationJob` | Copies a plan, reserves paid inputs, freezes effects/outcome and context, creates `simulation.jobs`; capacity/actor occupancy and cancellation apply. No future-result UI may read frozen effects. |
| Time | `nextSimulationBoundary`, `advanceSimulationBoundary` | Existing joined-clock scheduler advances jobs/controllers/occurrences. Native instance absence clocks are not independently implemented. |
| Items/resources | `src/simulation_effects.js:applySimulationEffects`, `inventory`; `src/acquisition.js:stageAcquisition` | `item`, `transfer`, `custody`, actor `resource`, native money and `vital` effects have real owners. Native players use staged `plan.gameplay`; simulation NPC inventories use `simulation.owners`. Never copy native cargo to a second owner. |
| People/evidence | `knowledge`, `observation`, `relationship`, `fact` effects | `simulation.knowledge[observer]`, directed memories and actor/world facts retain cause/time. `observation` explicitly copies one world fact to an actor; it needs a legitimate discoverable action. |
| Unique outcome | `claim` effect; `simulation.claims`, `simulation.causes`; actor `completed` | Acquire then settle a unique valve/contract claim. Claims/sites/jobs are keyed globally today; instance scoping is an integrator prerequisite. |
| Project | `src/site_projects.js:compileSiteProject`, `projectView` | Compiles paid, capacity-limited phase commands into world facts; public view uses observed/own completions. Do not disclose another worker's hidden project result. |
| Situation | `src/scene_definitions.js:compileSituation` | Compiles caused phase events with response/expiry effects. `simulation.events` saves occurrences and discovered observers; author timing is explicit. |
| Response/discovery | `inspectSimulationEvents`, `discoverSimulationEvent`, `respondSimulationEvent`, `previewSimulationResponse` | Discovery is distinct from occurrence; only known open responses settle. Discovery API itself needs a UI/access gate; same-world existence is not enough evidence. |
| Supported imported power | `src/power_models.js:previewPowerModel`; `src/energy_resources.js:applyEnergyEffect` | Check actual learned/owned method, source/support and charge/strain. Formula/capacity plumbing does not supply local radiation or mechanical-ammunition rules. |
| Concrete imported method | `src/field_workshop.js:fieldDefinitions` | Existing `field.load_step` mastery two supports output three; `field.drive` use output three/control one spends three reserve and one strain. A local command must retain ownership/member prerequisites and explicitly author local execution/recovery; original commands still name base-world locations. |
| Save/publication | `src/expansion_persistence.js:persistExpansionPlan`; `src/gameplay_publication.js:prepareGameplayPublication`; `src/native_gameplay_adapter.js` | Persist the copied native envelope before publishing state/items/vitals/unlocks. Failed storage cannot publish a changed valve, spent cargo or reward. |
| Projections | `src/world_knowledge.js:worldIdentityView`; `src/event_feed.js:eventFeed` | Identity follows known actor facts; news excludes undiscovered events and private simulation log. Events/menu routes still name Village/Shack and need generalized local routing. |

## Proposed state and action sequence

Use one source family plus integrator-selected instance binding. Prefix all local claims/site/actor/command IDs by the chosen durable instance namespace. `fallout.*` names below are author intentions, not registered IDs or item keys.

Store physical access/outcomes as that instance's world facts: `waterline.valveOwner`, `waterline.bypassOpen`, `waterline.intakeTested`, `waterline.carrierDeparted`. Store each actor's discovered evidence in `simulation.knowledge` and private goals/build in author/controller definitions or undisclosed actor facts. Directed relationships remember actual supplied parts, service obligations and witnessed trespass. Keep unique settlement in `simulation.claims`; timed commitments remain `simulation.jobs/events`.

Local consumables require master-registered reconstructable item keys for seal, test cartridge and calibration charge, plus actual NPC supply acquisition. Currency choice needs a declared adapter; do not rename native coins to bottle caps. No content registration silently grants old saves materials, people, knowledge or a valve reward. Test fixtures can provision explicit supplies separately.

1. **Discover and test:** a local inspection grants seen pump evidence; a paid sample job reserves one calibration charge, consumes played time and reveals either the supported fault or failed-test evidence on completion. Start text says “Test the intake,” never its frozen outcome. A failure retains the charge cost and supplies a relevant observation without granting clean-water reward.
2. **Prepare:** once the fault is understood, repair one rig with actual seal/parts or arrange one paid service. Occupy the existing one-bay site; reject a busy mechanic or already-reserved bay. Separate a completed, forfeitable diagnostic charge from the later refundable installation commitment: current cancellation policy applies to an entire job, so mixed refunds require those two boundaries. Never refund the consumed test charge.
3. **Choose approach:** negotiated reservation transfers agreed goods to Orren, consumes any selected service input and records a known local obligation; technical bypass spends rig/parts and actual supported breath-drive use, then changes bypass access. Both settle one valve outcome, with distinct witness memory. Failure to meet support/knowledge/access requirements rejects before costs. No automatic physical victory is inferred from a trait label.
4. **Refuse or expire:** decline explicitly or spend the known window elsewhere in this present instance. One caused carrier event transfers the valve under the selected ownership policy, marks departure and changes restoration cost. Later inspection/report discovers the aftermath; its author effects do not become public merely because time advanced.
5. **Return:** leave at a safe boundary after resolving borrowed goods/active work; freeze the absent instance. Reentry preserves pump state and obligations; a new earlier-era instance has separate claims/people. One later hand-filter service provides useful recovery without replaying the failed objective or settlement reward.

**Threat limit:** this first proof can show a discovered armored gatekeeper and block an unsupported direct attack. It cannot claim full ranged/party combat, radiation damage or lethal outcomes. A later strongly supported attack must receive a real contextual result, not a permanent arbitrary “too powerful” gate.

## Missing integration prerequisites

**Native world isolation:** bind each independent instance to its own native locations/access/quests, shops, people, inventory/equipment projection, history and return snapshot without overwriting `base.frontier`. Existing `state.worlds` and transition planners do not isolate native singleton registries. Select save schema/migration and instance namespacing; never reinterpret old `worldId` strings as new instances.

**Radiation/body adapter:** choose exposure, resistance, accumulated dose, health-cap interaction, treatment/restoration and retained bodily consequences across travel. Current `body`/`condition` metadata and health/stamina deltas cannot establish Fallout-style radiation semantics. First proof may use measured contaminated-water rejection, with no implied radiation damage or immunity.

**Devices/logistics:** declare item charge, per-shot ammunition, device damage/repair and custody across travel, or keep those functions outside the first proof. Native strike/HP services do not consume Fallout ammunition automatically. No flat technological power cap or unsupported magic suppression is the substitute.

**Menus/discovery:** route known local jobs/events/people through the current menu services; remove hardcoded Village/Shack destinations for this content. Constrain `discoverSimulationEvent` by actual report/site access and do not display private survey logs. In-progress outcome projection needs the same protection as existing base content.

**Failure/transition:** native fainting remains default. A later lethal or run-loss mode needs opt-in warning, selected losses/retention, bodily-death versus run-end distinction, failed-return handling and persistence evidence. Safe-boundary requirements must not imply that escape is always available; absent/browser-closed losses remain disabled.

## Gate, checkpoint and return

**GATE, future owned checks:** use explicit synthetic fixtures for each approach and refusal. Verify consumed goods leave the correct owner, Orren receives actual payment, the rig/site becomes usable, memories differ and one unique valve result settles. Missing charge, busy site/NPC, wrong instance, stale sequence/offer and unsupported breath-drive must reject without mutation; custody forbids selling/consuming borrowed rig goods.

Knowledge checks: private survey and actual carrier aftermath stay hidden until inspection/report; an in-progress test never reveals its frozen result; Orren learns only witnessed action or a paid crew report; a previous-life expectation does not grant current-branch understood knowledge. Public danger severity can warn before exact loadout discovery. No guarantee of victory/escape is asserted by the test fixture.

Persistence checks: reload before job completion, immediately after valve settlement and after expiry; costs, cause, RNG, site occupancy, obligations and result must remain stable. A repeated response/collection/import cannot duplicate valve goods, clean-water output, service credit or relationship change. Inject failed `storage.setItem`: no live publication and no partial item/native-vital change. Export/import keeps the same durable owners; reentry resumes the same instance, and 2282 cannot overwrite 2287 or base-world progress.

Combined integrator gate: rebuild source, exercise both routes and delayed discovery in a separate browser origin with synthetic saves, leave/return/reload, and inspect center menu plus Events for hidden results and real destinations. Review strong imported ability execution under actual support. Do not use the prebuilt bundle or personal save to establish success. Human fiction, source roster, danger and numeric balance review remain separate.

**CHECKPOINT:** WORLD_BRIEF current checkpoint is the designated task checkpoint, owned by world GM `world-expansion specialist`. No implementer children or live gameplay changes; no repairs or unknown writes. Current design documents and local source inspection are the evidence. After refresh reread it and reconcile live inputs/reservations before dispatch.

**RETURN:** current status is design changes ready for master review. Docs/source links and source boundaries reviewed; all implementation, migration, unit, build, browser, save/reload and human acceptance checks above are unrun. Next concrete action: master settles the native instance/item/discovery contracts and reserves a bounded implementation lane if this world is selected.

## Expanded campaign staging and current evidence

Read [CAMPAIGN](CAMPAIGN.md), [MODULE_CATALOGUE](MODULE_CATALOGUE.md), [SOURCE_LEDGER](SOURCE_LEDGER.md), [ability contract](../ABILITY_AUTHORING.md) and [continuity](../LORE_AND_CONTINUITY.md) before dispatch. Detailed component numbers remain catalogue-owned. These stages do not authorize implementation, worker creation or all five worlds at once.

| Stage | Concrete result and acceptance dependency |
|---|---|
| 0. Shared instance boundary | Master settles native isolation, absent clocks, state/version namespace and local item/currency publication, with independent 2287/2282 histories and untouched Frontier. |
| 1. Water Line proof | The existing diagnosis/bypass versus service-rights loop below, refusal/expiry, observed report and one valve receipt with full synthetic enter/return/reload. |
| 2. Harbor/farm/refuge links | Paid parts, food and treatment jobs connect at least three contexts; a poor sampler and a developed field operator use different supported costs and service choices. |
| 3. Equipment/support network | Implement selected catalogue parts with real identities/installations, condition/refit, energy and ammunition where needed; radiation/body cap remains a separately selected adapter. |
| 4. Institutional and fixed-threat branch | Public utility versus exclusive corridor persists across return; mature rescue or combat respects actual source support and fixed threat means. General party/lethal/return policies remain integrator gates. |

A bounded Paradise-style expedition can select one campaign scenario without implementing its entire map; local people/projects/claims must still persist and the issuer/hub contract remains a separate shared owner. No novel-specific penalty or residence rule is asserted.

Current design reservation is exactly CAMPAIGN/WORLD_BRIEF/GM_PROMPT/IMPLEMENTATION_PACKET in this directory. The specialist owns the same four filenames in five worlds; module and source writers remain separate. No general world-directory ownership, source/bundle/private-save edits, commits or chat messaging is granted.

Current inspected input fingerprints, 2026-10-03; rediscover affected drift before future build:

- `docs/GAME_MASTER_PROMPT.md` SHA256 `80f615e02151a5c787bdb4351c62b26e6e42a9f99ac93cb6330cb63fe581bbba`.
- `docs/gm/WORLD_EXPANSION_GM_PROMPT.md` SHA256 `f36733e10d8611159e29b3d57e22b5f3955f5e169ab75c945112a1bf5643fffb`.
- `docs/worlds/CAMPAIGN_FRAMEWORK.md` SHA256 `c1c796a29139284bbeda99d9caf2ad57e8ddd797cb11249eb073d146269550f4`.
- `docs/worlds/PROGRESSION_AND_ASSEMBLY.md` SHA256 `35a3ea8aaa3ab4f1336d3617f07c4e7ef5e5287b8dfed4cd7cec7cbc77f37147`.
- `docs/worlds/ABILITY_AUTHORING.md` SHA256 `a6062efad9c196ab069bee910c543bca45f89ad9b74907f5f7cabb900e4b1687`.
- `docs/ENGINE_AUTHORING.md` SHA256 `5051a43423e6ac0cf8ed581d3afec3baf4b36e119187ffc8eff449b13eafd8a3`.
- `src/simulation.js` SHA256 `c824114398d941db6cf393cf6671c66519e695acff5855590cd406e054a4a056`.
- `src/simulation_contracts.js` SHA256 `6dd71c3d5024d22767d8e26d19a22c614f0c71f2f3d1980196f5ed259d18b2af`.
- `src/simulation_effects.js` SHA256 `e64d422c240a78dfd94410fe73db7b8a95c785136369a5df41918670cc2e5db8`.
- `src/power_models.js` SHA256 `cbf6d86aea5cdfd1fda9bb39dddb208944c210e91c60196283f5ea731d3c23b7`.
- `src/energy_resources.js` SHA256 `cc619def4c618a7b7128c43c499864a4ccc306d5f54dc20660f15004bbbb55ef`.
- `src/native_gameplay_adapter.js` SHA256 `41900a2254f3db55fdf9ca8d59c6125ae2797947521756f319fe993f1b7ea8ad`.

Checkpoint: the brief owns the live specialist checkpoint. The inherited opening proof remains a proposed fixture, now stage 1 of the expanded campaign. Local document/link/coverage/evidence-vocabulary checks passed; every runtime/unit/build/browser/save/migration and human gate remains unrun. Verified design evidence: twenty reserved paths, 307 local links/ten anchors resolved, campaign coverage checked, no authored em dashes or trailing whitespace. Runtime acceptance remains unrun.


## Detail audit: sample evidence survives the test, 2026-10-20

WPD-R9, ACCOUNT FOR NOW: WG25's certificate is evidence about a sampled lot at a time under a method, not a permanent clean-water truth flag. Keep the sampled container/lot identity and test receipt attached when a cartridge is consumed. Mixing water, replacing the filter or changing the intake may make that receipt insufficient; a supported new test spends new stock. A failed/old test does not reveal the hidden correct fault through its menu label.

Before selected implementation: decide what the one authored test actually observes and whether the proposed repair changes its target; bind both to existing observation/item/job/publication owners. Level/effort: Luna low for exact record fields and locators; coordinator medium for transaction and observer projections. Done check: test payment, sample custody, attributed conclusion and later recheck remain distinct across current-format pending/final round trips, without another clean-water reward. A full certification market, recall network, radiation/body model and every device's power chemistry stay later depth.

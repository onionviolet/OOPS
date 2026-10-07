# Engine packet: The Returned Gaze

Status: proposed bounded implementation, revision2, 2026-10-04, including future rift/plane gate. This packet has not been registered, built or browser-tested. [DESIGN](DESIGN.md#family-1-the-subject-answers-the-lens) owns fiction and semantics. Engine master `01a1056b-d82c-7ef2-babb-d8316c45f396` selects/reserves actual runtime paths and owns integration. Passing this document gate does not authorize this specialist to edit those paths.

## Goal and base

GOAL: one optional Village lens visibly answers a supported observer because its subject has actual return-gaze means. Ordinary shutter closure, identity-disclosing cooperation and abstention leave different persistent state and later records. No second realm, timeline rewrite, prestige or reset.

BASE: branch `codex/gameplay-foundations`, HEAD `97c28efece4fd6248b6f075ad0c6927c3d0432df`, extensive dirty work. [INPUTS.json](INPUTS.json) records inspected owners/source SHA256. Before coding, compare live source hashes and recover [BRIEF](BRIEF.md#live-checkpoint), [master refresh](../../GAME_MASTER_PROMPT.md#context-pressure-and-refresh), [current run](../WORLD_IMPLEMENTATION_RUN.md) and [engine checkpoint](../../ENGINE_GM_NEXT_CHECKPOINT.md). Treat new master edits as authoritative drift, not permission to reset/revert them.

AUTHORITY: Engine already owns runtime/native/persistence/UI/build/tests/shared owners. This packet proposes reversible current-realm content and explicitly narrow adapters. The specialist's only writes are this directory. No source-book/Calibre/private-save/other dossier writes, commits, publishing, automation or real host access. No child or runtime writer is dispatched here; no smaller route is qualified or batched. A master slot grant and exact exclusive paths are prerequisites to any future leaf.

## Required current seams

| Read first | Integration responsibility |
|---|---|
| [simulation_content.js](../../../src/simulation_content.js), [expedition_content.js](../../../src/expedition_content.js) | Combine disjoint original definitions and source IDs into the existing registry |
| [simulation.js](../../../src/simulation.js): `previewSimulationCommand`, `commitSimulationCommand`, `advanceSimulationBoundary` | Actual paid player/NPC execution, sequence/order and played-time expiry |
| [simulation_contracts.js](../../../src/simulation_contracts.js), [simulation_effects.js](../../../src/simulation_effects.js) | Validate effects, source/body/power/stock and private publication |
| [causal_situations.js](../../../src/causal_situations.js) | Existing schema3 context/phases/deadline/attributed evidence |
| [main.js](../../../src/main.js): `actSimulation`, `persistExpansion` | Carry full staged plans through existing envelope/native publication; expose no debug controls |
| [promise_content.js](../../../src/promise_content.js), [promise_ui.js](../../../src/promise_ui.js), [people_knowledge.js](../../../src/people_knowledge.js) | Pattern for optional introduction, read-only records and later report; do not reuse their IDs/group |
| [simulation_ui.js](../../../src/simulation_ui.js), [event_feed.js](../../../src/event_feed.js) | Exclude observation commands from generic workshop controls and restrict private history |
| [expansion_persistence.js](../../../src/expansion_persistence.js): `persistExpansionPlan` | Persist native money/stamina/inventory and all relational changes before publication |
| [promise_situation.test.js](../../../tests/promise_situation.test.js) | Existing generated fixture and failure/reload pattern, not evidence of this new power |

Proposed new code paths such as `src/observation_content.js`, `src/observation_ui.js` and `tests/observation.test.js` require the master's reservation; they are not created by this GM. Do not edit unrelated gameplay to fit the scene.

## Finite authoring state

All identifiers below are proposed registry values. No function/field named here is assumed installed unless listed in the current seams above.

| Owner | Minimal fields |
|---|---|
| Situation `observation.lens` | Context `base.frontier` / `frontier.main` / `frontier.branch` / `frontier.present` / `frontier.village`; participants player + `observation.ilex`; revision1; deadline opening+3 played minutes |
| Phase receipt | `open` → `answered` → one of `shuttered`, `cooperated`, `unanswered`; suppressed source allows `open` → a terminal phase; optional later-report phases preserve route |
| Private truth | Mechanism `paired_live_lens`, subject `observation.ilex`, initial anonymity true; fixed provenance/support, never directly rendered |
| World facts | `observation.lens.active`, `.shutterInstalled`, `.introductionSent`, `.presetCutoff`; initialized only on deliberate opening |
| Actor `observation.ilex` | Simulation inventory, Village, alive, defined once `provision:false`; living perceptual support, actual one-kit initial stock and coins0; no life-aging policy |
| Source `observation.return_gaze` | Granted to Ilex only, origin inherited, awakened/active; zero per-use fuel and no cooldown by this original rule |
| Power `observation.return_notice` | Owned by Ilex only; model practice capacity1 for one terminal, no damage model; execution requires active faculty, present perceptual support and active finite channel |
| Ilex knowledge | Detection of anonymous link, own sent overlay; claimed identity only after introduction; later source-cut/stock consequences |
| Player knowledge | Instrument/sample and actually returned overlay; their own action receipt; instruction only after paid exchange; later note only after local inspection |
| Stock/claims | One actual Prepared survey kit held by Ilex; no copied kit; one unique exchange claim/terminal receipt; transferred stock stays absent on revisit |

Use registered scalar facts and situation receipts for this one instrument. Do not add unvalidated arbitrary `ObservationRef` objects to the save, claim universal channel support or export hidden `privateTruth` in a view.

Before his actual introduction, player text calls Ilex the visitor/subject behind the glass. Internal participant/basis IDs do not reveal his name. Keep the kit count and source/body details private until an actual supported report demonstrates them. A public introduction can teach a claimed name without certifying his full identity or faculty.

## Commands and order

1. **Deliberate opening.** Visible only after the existing Village introduction/discovery gate. Show the instrument and known three-minute cutoff before commitment. `once:true` creates Ilex, his actual source/power/stock, the caused situation and finite active channel. The wrapped preview is pure and does not reveal the private faculty. An eligible NPC `observation.notice` command executes through `commitSimulationCommand` on the staged plan, checks its actual power/body/source and records detector/overlay effects. Persist all stages once. If the faculty is missing/suppressed in a generated negative fixture, omit the notice rather than forging success or revealing the private reason.
2. **Shutter.** Immediate player command in Village, visible after opening. Recheck open/answered phase, actual active terminal, deadline, player life/native busy/support and owned unborrowed unequipped log. Costs: one Rough wood log and two native stamina, native strength at least6/health at least2. Effects: installed shutter, active=false, phase=shuttered, player observed receipt and Ilex anonymous-link closure evidence. No kit, coin, faculty grant or identity disclosure.
3. **Introduce and exchange.** Immediate player command, current Village terminal, after actual returned overlay and within window. Costs: one native money debit and equal one Ilex coin credit; exactly one kit transfers from Ilex inventory to native player. Effects: active=false, introductionSent=true, phase=cooperated; player understood ordinary provenance instruction, Ilex attributed introduction and exchange memory. A claimed name is not proof of true origin. Acquire/settle the unique exchange receipt once. If Ilex has no kit or is unavailable, reject all costs rather than conjuring stock.
4. **Preset cutoff.** Opening causes a private, nonautomatic one-occurrence ambient event at opening+3. It executes the inner shutter operation Ilex arranged beforehand; no offscreen player action is assumed. Requires actual still-active channel/open or answered phase. Effects: active=false, phase=unanswered, Ilex's local closure evidence only. A short fixed occurrence may reuse existing caused event/check APIs; no parallel timer. Discovering the posted note requires a later local inspection command. A/B's finite host wrapper retires the exact pending cutoff check in the same successful terminal transaction, so no check polls forever or later attempts a duplicate transition.
5. **Return/inspect.** Local read/command discovers the retained route-specific report, dark lens/shutter or Ilex introduction recognition, with no renewed payment, kit or detector activation. Reading a stored impression describes its prior observation time and creates no live link or new NPC knowledge. Never-opening remains no enrollment. A small read-only records view may be free; actual first discovery is a saved command.

The cutoff is a preset instrument operation, distinct from detecting a viewer. Source suppression disables Return Gaze but need not disable a physical shutter already arranged. Ilex's narrative choice to allow a short demonstration is represented by that prior operation, not an invented resource cost.

Atomic opening needs a small host wrapper, not a call to an invented generic API. It checks the caller's expected sequence once, stages optional enrollment and the opening command, internally derives the NPC notice from source truth, carries forward **all** plan state/external/gameplay/vitals/equipment/acquisitions/unlocks, validates, then uses existing `persistExpansion`. Never publish enrollment before opening saves or drop an earlier stage's native publication fields. Intermediate internal sequence increments are allowed; one external request represents this complete atomic action. Preview must neither execute nor reveal the NPC's private eligibility branches.

Player A/B are immediate to avoid frozen delayed effects resolving after source/support changed. If a later integrator turns them into timed work, add an exact completion/interruption support check first; `completeJob` does not supply it. No auto cut during an agreed native battle/paused clock unless the existing common-clock policy advances time.

Deadline order: at `clock >= deadline`, local A/B reject before spending even if the private cutoff event has not been rendered. Scheduled cutoff resolves on the existing clock boundary before a later request. The cutoff's phase transition uses `expected:[open,answered]`; responses cannot restore it. Existing event checks with unmet predicates keep polling until an occurrence happens, so predicates alone cannot clean up an abandoned one-shot. Retire only checks whose registered cutoff definition and saved `cause` match this situation's opening cause, on the cloned A/B result before validation/persistence. Preserve all unrelated checks/streams. A failed terminal write must retain the predecessor's pending cutoff.

## Two small required repairs

**Finite channel guard, O1 subset.** Opening/notice/A/B/cutoff/replay use this one authoritative active flag, situation phase/deadline and supported actor/source. Detection needs the NPC's actual power command, while the viewing player's preview exposes only known requirements. Reject wrong target/terminal/world and stale request. Cloth disguise does not close the channel. Archived replay never creates it. The finite wrapper also retires only this cause-bound check on A/B; do not invent a generic cancel-event effect. This is sufficient for the one fixture, not generic layer/temporal targeting.

**Private publication, O5 subset.** Generic `completeJob` currently assigns private audience only to field/promise NPC jobs; generic workshop UI reads other unspecific log entries. Add a validated generic audience option or a narrow observation-group private policy for the NPC detection/cutoff. Do not piggyback on the promise group. Keep private actor knowledge/stock/faculty out of workshop history, preview reasons and People. Observation controls also need exclusion from `createSimulationPanel`'s broad command enumeration, or they will be duplicated in Craftsman & workshop. A local observation panel/public report should expose only actual received evidence.

The existing event feed already avoids the global simulation log. A cutoff event stays undiscovered/private until the player locally reads its posted note. Do not add a news row solely because author truth says the channel ended. Keyboard focus stays on stable controls; disappearing controls move focus to their actual local summary after a saved result.

## Compatibility decision to preserve

Expansion stays schema5. Beginning this optional situation opts into existing simulation schema3; old unenrolled/schema1/schema2 saves acquire no character, source, stock, reward, identity knowledge, event or clock change. Existing schema3 situations remain intact. New IDs require this registry/build; earlier builds can reject unsupported opted-in content without deleting it. The runtime master must explicitly record this compatibility choice in its owners.

No generic observation/anchor/history schema is needed for this finite proof. Validation must preserve optional nativeBattle, pursuit, existing jobs/RNG, dormant content, native inventory/equipment, chronicle and user progress. No reset, replacement envelope, replay of the vanilla opening or retrospective body/life enrollment.

## Observable acceptance gate

| Criterion | Required check and pass condition | Evidence owner |
|---|---|---|
| Real power and pure preview | Repeated preview/render leave full state/seed/stock/knowledge unchanged; actual opening increments one eligible NPC execution and produces qualified overlay; missing/suppressed support yields no notice | Narrow generated unit fixtures and actual source diff |
| A versus B | Same fixed Ilex source on fresh generated saves: A debits log/stamina, installs shutter, no introduction/kit; B debits/credits1coin, transfers the sole kit, teaches ordinary understanding and identifies only the claimed person | Rebuilt actual browser journeys in PLAYTEST |
| Abstention and useful return | Leave/advance3 played minutes/return; dark instrument and local discovered note, unchanged stock/coins, no debt; leaving before actual note does not reveal it remotely | Browser/save and observer projection fixtures |
| Superior source/negative targets | Cloth fails to block real detection; actual closure works; replay yields no new detection; wrong terminal, unsupported body/source, missing kit/borrowed log/busy player reject before debit | Narrow fixtures; observed valid paths |
| Custody and conservation | Exactly one physical kit moves; native money debit equals NPC credit; A's consumed log becomes installed fixture; unique exchange cannot repeat after log pruning | Exact generated owner snapshots |
| Interruption and order | Close UI/reload mid-open retains channel/deadline/execution once; due cutoff settles once; A/B at or after deadline reject; completed routes remove their exact cutoff check and preserve other checks | Generated mid-open/terminal and boundary fixtures |
| Stale and replay | Old sequence and wrong meaningful request/scene state reject; refreshed terminal action still cannot reacquire unique kit/source; repeated report/replay is informational | Narrow command fixtures |
| Failed storage | Inject quota failure separately at opening, A, B and cutoff; live/durable actor/source/knowledge/money/stamina/inventory/phase remain predecessor state and existing pause applies; recovery retries once | Native save/publication fixture plus isolated browser |
| Migration/import | Generated old schema1/2/current schema3, mid-open and terminal saves import/reload without retroactive enrollment, duplicate stock/activation, clock drift or private leakage | Separate fresh test origin; no personal saves |
| UI/discovery | Optional entry, known requirements/costs/cutoff, no hidden faculty/name leak, no duplicate workshop controls, stable keyboard focus, original opening/quest/menu preserved | Rebuilt browser/DOM and source inspection |

Run the narrow changed-family fixtures first; the Engine master chooses relevant combined regression/build/browser checks once. This specialist did not run the full suite, build or browser, and no parallel equivalent master gate is assigned. Fiction, costs, three-minute timing and game feel remain Weibao's playable acceptance.

## Return and next action

Return actual runtime changed paths/revisions, exact gate results and PLAYTEST links. A small finite proof can pass while O1-O6 remain general gaps. Do not claim time travel, constructed-world escape, conceptual theft or resurrected life from this lens.

Concrete integration action: the Engine GM should reserve the finite lens definitions/host wrapper/UI and O5 private-log/duplicate-control repair, then implement opening → actual NPC notice → A/B/cutoff → local return on generated saves. Review the Shadow GM synthesis as a separate source input; it is not a prerequisite to this original current-realm proof.

## Rift and plane extension packet

AUTHORITY: [dispatcher addendum](../dispatch/RIFT_AND_PLANE_RESEARCH.md) expands Research/Develop, keeping all runtime/source/save/global exclusions and existing master integration. [DESIGN comparison](DESIGN.md#primary-source-comparison-beyond-shadow-slave) records four primary pages plus the separate local Shadow claims; [topology](DESIGN.md#topology-matrix) extends MULTIVERSE_STRUCTURES rather than replacing it. CF01/CF02 are hypothetical original scenes. No new source adaptation, world roster, death/collapse/offline policy or code writer is selected.

FUTURE GOAL: a temporary route can close/reopen while the same finite Cedar Fold interior, resident, materials and obligations persist; an exceptional source can detect/act across a boundary for a real independent reason. Demonstrate useful choices, not only a new travel label.

| Next seam | Actual foundation | Missing behavior before claiming it |
|---|---|---|
| O7 connection/interior | `state.worlds`, actor world refs, situations' frozen context, sites/reservations, commands/caused events/claims, shared played clock | Route/endpoint/lease identity distinct from interior identity; native active-site binding, closure/reopening, independent resident/stock, actual admitted flows/capacity and absence policy |
| O8 layer/body/return | Body/vital/source fields, execution predicates, power models, native snapshot/publication | Layer-qualified body presence/projection, position/occupancy/contact/impact and compatible return reconciliation |
| O4/O6 identity/cargo | Atomic item transfer/custody and persistent actor/source records | Exact continuation/source-instance/specimen support; aliasing/projection must not duplicate bodies/cargo |
| O5 disclosure | Actor-private knowledge, qualified event discovery, local People records | Interior reports do not become player knowledge while the route is closed/actor absent; old evidence remains attributed/stale |

`previewCampaignTransition`/`commitCampaignTransition` in [simulation.js](../../../src/simulation.js) require safe boundaries, can move world refs and retain declared domains. They do not give separate native location/shop/quest/NPC state, arbitrary actor layer movement, route occupancy or closed-door persistence by themselves. The existing `relocate` effect moves a simulation actor's location string; native travel needs actual bindings. A body scalar or authority label does not automatically gate native combat/contact. Do not run a timer outside the common scheduler or invent another bag/save owner.

CF01 IMPLEMENTATION: freeze one same-realm contained site, finite Nera/lamp/material owners, access-only seed and4played-minute route. Exterior cover/drying is A; paid interior cooperation/actual deposit/work/handover is B; abstention creates no agreement. A new route lease references the same interior. Register actual finite material/fixture identities and recipes before native integration. If processing keeps player title while Nera holds material, its transformation authorization/receipt must preserve that title and exact lot. Current whole-item-key custody guards do not supply generic purpose-bound specimen transformation; select disjoint fixture keys or add a precise adapter, never silently consume somebody's other loaned goods.

CF02 IMPLEMENTATION: use that same interior plus one actual compass owner/holder/loan and one Oras continuation in an overlapping layer. Register independent detector and bodily-passage functions, legitimate locator evidence, permitted slit channel and fixed actual support. A returns the real compass; B uses actual Layer Grip/contact/output/stamina to repel without changing compass ownership; abstention allows Nera's selected verified-owner return. Ordinary closed-door/visual-hide predicates do not block independent passage. No blind source transfer or universal auto-success in dialogue. Stable ID, actual presentation/name disclosure and persona knowledge remain separate.

Select a local clock before enabling either scene. Proposed first version: finite jobs advance1:1 with supported played common time even while the route is closed, with no browser-closed progression, retroactive aging or mandatory maintenance loss. The master must explicitly adopt/record that choice or keep the scene deferred. Define stalled jobs from missing lamp fuel/body, paused game, route closure and genuine support loss separately. Nera's interior work does not require the access door to remain open unless a paid job actually uses that edge.

RETURN/INTERRUPTION: preview validates current source, route lease, body/cargo, destination occupancy and departure commitment; commitment stages exact owners and reservations. Closing the UI does not teleport a body or return cargo. Door expiry resolves the declared exit choice/remaining residency, separately from ending a job. Blocked return uses its selected alternate position/route or leaves a retained stranded commitment; no guessed D&D damage, free extraction, owner reset or player death. Costs/knowledge/custody already completed stay completed. Failed entry/exit saves publish none of the pending move; a saved move occurs only once.

NESTING: containment graph is acyclic, route graph can contain cycles. Validate explicit endpoints/visited IDs/hop and work bounds and compose real source permissions along each edge. A closure in an ancestor cuts that edge, not every nested instance. Unsupported cyclic auto-transit rejects; repeated reopening/looping cannot duplicate an item, unique claim, kit/fuel grant, source or elapsed catch-up. New branches/trial resets choose fresh identity and export policy explicitly rather than reusing a pocket visit ID.

ADDITIONAL ACCEPTANCE: generated deposit/mid-work/closed/return/reopened saves must show the same changed interior, actual resident agency, depleted lamp stock and conserved material/compass/body. Test unsupported source/body/cargo, whole-key custody, full site/return occupancy, wrong anchor/era/layer, simultaneous endpoint access, stale lease/source revision, conflicting unique exports, nested interruption and failed storage at each owner move. Report absence-clock choice and no remote knowledge leak. A/B/abstention/return/revisit must be visible on a rebuilt browser build. Neither scene currently passes that runtime gate.

SEQUENCE: keep the first build to Returned Gaze, already mapped above. After real O7/native-site/cargo support, CF01 is the smallest true pocket proof; after O8, add CF02's exceptional layered contact. The current master Exchange increment continues independently. This packet supports later integration, not a request to abandon that work or parallelize a second runtime lane.

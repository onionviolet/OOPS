# Repository workplan helper

2026-10-05. Status: callable source delivered; root/Features native/UI/build admission remains required. New gameplay is **implemented-unverified**. This worker owns only `src/repository_absorption_workplan.js` and this file. No shared files, persistence, UI, package, source bank, mirrors or private saves were written.

## Exact exports

| Export | Contract |
|---|---|
| `REPOSITORY_WORKPLAN_LIMITS` | Frozen `{steps:16, starts:10000}`. These bound an authored request, not long-term progression. |
| `defineRepositoryWorkItinerary(definition, registry)` | Compiles an immutable, schema1 read-only definition with distinct step/command IDs, pinned command revisions, explicit participant targets and a canonical sequence identity. |
| `previewRepositoryWorkItinerary(state, registry, definition, context, expectedSequence=state.sequence)` | Derives absolute completion targets from existing `actors[actorId].completed`. Returns rows, first unfinished `next`, `status`, exact live `quote` for that step, `request` or null, and conditional work-only minutes. It never skips a blocked unfinished step or advances a saved cursor. |
| `defineRepositoryStockBand(definition, registry)` | Compiles an immutable schema1 definition for a registered timed, repeatable command producing one exact deterministic item batch into its real owner's inventory. Rejects one-time/claim/encounter producers and variable or competing changes to the selected stock. Existing power eligibility remains legal. |
| `previewRepositoryStockBand(state, registry, definition, context, control=null, expectedSequence=state.sequence)` | Reads the actual simulation/native inventory binding, completion count and frozen jobs. Returns stock, idle/refilling phase, finite remaining starts, at most one exact live job request, and a transient continuation token. No scheduler, timer, stock grant or saved policy is created. |

Use the full content registry containing `registry.simulation.commands`, not the inner simulation registry alone. Constructors copy and recursively freeze their output. Previews recheck identity and exact pinned revisions. Definition removal/revision mismatch produces a blocked next step; it grants no fallback work.

An itinerary step is `{id, commandId, commandRevision?, targetId?, count?:1}`. The parent is `{id, revision, label, actorId, targetId?, steps}`. Omitted `commandRevision` is resolved and pinned at construction; shipping authored content should supply its retained revision explicitly. `count` is an absolute completion target for that distinct command. Existing completions count, including manually performed work; they do not establish a historical execution order and are never reset. Do not present this helper as an accepted, editable, durable mixed queue.

A stock definition is `{id, revision, label, actorId, ownerId?, targetId?, commandId, commandRevision?, key, lower, upper, batchSize, maxStarts}`. `ownerId` defaults to the acting actor. `batchSize` must match fixed positive item effects of the registered command. `maxStarts` is an absolute lifetime completion budget for that command; existing paid jobs also occupy this budget. It is not replenished by enabling, re-rendering, revisiting or reloading the panel.

The stock continuation is either null or `{identity:definition.identity, phase:'idle'|'refilling', enabled:boolean}`. A fresh null control is idle. Stock **strictly below** `lower` starts refilling; an explicit refilling continuation keeps that phase inside the band; reaching `upper` returns to idle. A whole batch that would exceed `upper` is blocked. A matching frozen job returns `working` and suppresses a second request. Disabling future starts preserves the actual job, costs and due time. The continuation is a caller-owned transient decision input, not a saved cursor; omission restores idle and enrolls no policy. In particular, `lower:0` never activates a fresh idle policy from zero stock.

`costs:null` means no executable quote. `declaredCosts` contains authored declarations and may include unresolved formulas; those are not a total affordability quote. Later itinerary rows remain declarations until they become the next step. Frozen jobs expose their already-reserved costs and remaining due time separately. `stockAfterCommittedWork` is conditional on successful settlement, explicitly tagged by `committedOutputKind`; a failed support check may refund without output. `workMinutes` includes known outstanding work and remaining frozen-job time, excluding travel, waiting, interruption and future eligibility changes; unknown/unsafe totals are null. `maxStartsByBand` is geometric remaining room, not proof that those jobs are funded. Never pass it as an automatic program count.

## Current consumers and exact glue

Root owns `repository_absorption_content.js`, host/UI and admission. Its live content has `repositories.inspect_pump`, `repositories.seal_kit`, `repositories.seal_pair`, `repositories.miri` and native `Wax-sealed survey kit`. The narrow requested itinerary and stock definition are:

```js
const itinerary = defineRepositoryWorkItinerary({
    id: 'repositories.sealing_itinerary', revision: 1,
    label: 'Inspect, practice three sealings, then seal a pair', actorId: 'player',
    steps: [
        {id:'inspect', commandId:'repositories.inspect_pump', commandRevision:1,
            targetId:'repositories.miri'},
        {id:'practice', commandId:'repositories.seal_kit', commandRevision:1, count:3},
        {id:'pair', commandId:'repositories.seal_pair', commandRevision:1},
    ],
}, registry);
const stockBand = defineRepositoryStockBand({
    id:'repositories.sealed_stock', revision:1, label:'A small protected-kit band',
    actorId:'player', commandId:'repositories.seal_kit', commandRevision:1,
    key:REPOSITORY_ABSORPTION_ITEMS.protectedKit,
    lower:1, upper:3, batchSize:1, maxStarts:8,
}, registry);
```

Those IDs are proposed root-owned utility definitions until root registers/imports them. `seal_kit` is timed with a fixed one-kit output, finite native inputs, body/source/power and site support. It does not need `automatable:true` to support one ordinary `commitSimulationCommand`. The utility passes through its live power/participant/stock/site preview rather than inventing a recipe or bypassing its teacher requirement.

Root must expose these projections only under its existing authored public/known-content visibility gate. Utility rows are internal data, not an independent player-knowledge or privacy filter. Do not serialize raw simulation owner objects into the panel. Read-only views may show the live next-step quote, declared future costs with that distinction, actual job remainder and stated work-only duration.

For a selected next step, root recomputes the projection synchronously from live state/context with the request's expected sequence, verifies its metadata, then commits exactly that one existing command through the durable host publisher:

```js
const live = previewRepositoryWorkItinerary(state, registry, itinerary,
    {...context, targetId:command.targetId}, command.sequence);
assert(live.request && ['id','actorId','targetId','commandRevision',
    'projectionId','projectionRevision','projectionIdentity','stepId']
    .every(key => live.request[key] === command[key]), 'The next work step changed.');
const plan = commitSimulationCommand(state, registry, {id:live.request.id},
    {...context, actorId:live.request.actorId, targetId:live.request.targetId}, command.sequence);
// Only the existing persistExpansionPlan/persistExpansion publisher applies plan.
```

Stock uses the same guard and publication route, substituting `previewRepositoryStockBand` and its explicit continuation. It always emits `count:1`; root must not multiply its costs, reserve future jobs or convert the whole band into a blind repeat program. Retaining the returned control in transient panel state gives ordinary hysteresis while the panel is active; persisted/autonomous policy behavior remains Features-owned if later selected. Recompute actual stock/eligibility at every requested start.

Features now owns `src/feature_expansion_work_plan.js` (`WORK_PLAN_SCHEMA=1`, optional `simulation.workPlans`, command/travel/wait steps, accepted real-job receipts and common-clock boundaries) and `societyWorkPlans` in `src/feature_expansion_society.js`. This worker read those live files. Its read-only distinct-command target projection has no `workPlans` write, scheduler boundary, accepted-job receipt or travel implementation, so it does not duplicate that mixed queue. Features may reuse it for a separate all-command completion-goal summary; its saved plan remains the sole durable owner.

## Version and omission policy

The helper's schema1 tags describe compiled definitions only. No expansion/simulation schema change or optional save field is proposed. Missing helper/UI leaves existing individual commands, native state, jobs, same-command programs and Features workPlans untouched. Missing stock continuation means idle, no enrollment and no background start. Progress is read from current authoritative completions/jobs; no copied progress, stock, costs, RNG or clocks are saved.

Retain existing command IDs and meaning. New command meanings require new content IDs/revisions through the actual owner; changing helper definitions changes their identity and invalidates prior transient requests/continuations. Root supplies ordinary command/version activation and source/native/UI/build admission; behavior acceptance still needs the later save/reload/failure/player gates, which this worker did not run.

## Qualified source recheck

Read-only pinned Git object reads used `GIT_NO_LAZY_FETCH=1`; no fetch, checkout, hook, upstream execution or mirror mutation. Five consequential raw hashes matched the qualified audit. These are bounded source inspections, not upstream runtime or whole-repository proof.

| Finding | Rechecked source locator | Raw SHA-256 | Adaptation |
|---|---|---|---|
| RB-PRO-01 | Idle Loops Lloyd `5008c4a1faca102af543b4f9369f6cef4b763823`, `actions.js` 106–137 and 214–244 | `907b51e0cc0f76d00d17ce5740489d3fbd41db39faea8cfd0aa05d690ca6fa34` | Distinct ordered work and finite count/forecast; stop at an unavailable next step rather than copying its skip-ahead behavior. |
| RB-PRO-01 lineage | Idle Loops Omsi `fa21477d424f3aa1f1bf6deb9f6f83c2569770ab`, `loops/actions.js` 103–134 | `664dc86c4fc0e648707ed50f6d6aaa9b693ed4a4117fe1106e1b7daf76f34671` | Independently rechecked next-action eligibility; distinct blob, one shared mechanism family. |
| RB-LIV-03 | DFHack `c872dc4c64c586fe1d320230dfb09d0b3cc7d9d4`, `docs/plugins/workflow.rst` 8–27, 39–48, 60–106 | `51f3367f4b228015a93b7caed62232b5eb5dc921462de2bebc7ea6e6725b333e` | Lower/upper production band with an explicit phase, exact producer and finite starts; existing YAIR previews still validate the actual materials. |
| RB-CAM-02 | QuestJS `72fef6a7315b2d977d8b4f57c358a11ba85d765a`, `rpg/agenda.js` 6–52 and 148–174 | `9c1db8b61e98c0475d7179504dceab9eb82ed291f5eccc07cec7834d66d28282` | Finite authored duties and interruptions; no imported patrol, tactical planner or character object. |
| RB-CAM-02 | Same QuestJS pin, `rpg/npc_templates.js` 81–92 and 454–480 | `5eff4a22c807ea0ee54033a024c792edb99d82e69a9e6434fa8eb8f20fad25b9` | Guarded continuation requires an actual recorded origin; Features owns any durable YAIR cursor. |

This is independently written original code/content utility. Idle Loops code reuse remains unqualified because the inspected roots have no discovered top-level license. No code, labels, story text or assets were copied from Idle Loops, DFHack, CDDA, Evennia or QuestJS. No dependency was added. Existing YAIR attribution/LICENSE stay unchanged. The broader CDDA profession/mission and Evennia server-repeat observations were reused as qualified audit context, not newly rechecked or implemented as independent systems here.

## Checks and handoff snapshot

Performed: source contract review, `node --check src/repository_absorption_workplan.js`, and a clean Node module import enumerating its five actual exports. No planner/preview function or constructor was executed as a behavioral probe. No unit/browser/gameplay/save/reload/failure/keyboard/regression/director checks, shared build or private-save access. Root's admission/build is a separate remaining gate.

Snapshot hashes, observed at this worker handoff:

| Input/output | SHA-256 |
|---|---|
| `src/repository_absorption_workplan.js` | `188e4a9a2888feea98742d3433c487ae9089ebea770f94c72bb28ffe748300c9` |
| Read `src/simulation.js` | `9a74c8c0a059c29427fe574851abeddabbf23b86d23b857b7531512b1ebd8ddd` |
| Read `src/simulation_contracts.js` | `19857973f84085eba9904cd3c9d6fb07ba704735a465a6e040d124c5591eabe5` |
| Read `src/simulation_effects.js` | `615f7dbf2999de167ed73192117f643e98b06b32292465b97246db8f79e12c56` |
| Read `src/power_models.js` | `cbf6d86aea5cdfd1fda9bb39dddb208944c210e91c60196283f5ea731d3c23b7` |
| Read root `src/repository_absorption_content.js` | `6f49bcf057e642cbfdc3b27b1c992d2885418cf242607ffc8a2bfd88feb40aed` |
| Read Features `src/feature_expansion_work_plan.js` | `020d8a01accde412c30d00cfa538efb807a6b975f5225222c056053c51eeb382` |
| Read Features `src/feature_expansion_society.js` | `5fd32de43c57235356f9a8f36a75f1e78ac71005a6b19815e1b65a39eca2ac84` |
| Read Features `INTERFACE.md` | `764b12915648619a84cc86f6907806b340190f42a9549ca1bde20021f2fd472d` |

Live other-owner changes can supersede these read snapshots. This file and the helper are released to root for integration. No worker process or child is left running.

## Current rule-fit qualification, 2026-10-18

This is a released helper contract and source snapshot, not the root's live
implementation queue (AD32/AD36). Its definition limits and `count:1` constrain
this finite API's request shape, not the player's lifetime work or the world's
mechanisms (AD22/AD38). A later batch API needs its own actual settlement proof;
do not silently multiply an existing quote.

Keep AR7/AR8 at preview → revalidation → publication. Read-only roadmaps,
transient continuation tokens and queued intentions are not completed work,
accepted obligations or durable policies. A blocked future step stays a known
blocked/unbuilt step; it does not fabricate world impossibility or spend future
stock. On a selected interrupt, retain already performed work and actual held
costs through the existing owner, without counting pending time twice.
Current-state persistence is required if a selected change adds saved policy;
old-save migration is currently deferred. No helper tests or integration were
rerun and no new planner framework is required.

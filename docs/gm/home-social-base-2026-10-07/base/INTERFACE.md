# Home furnishings integration contract

2026-10-07, revision 1. Parent root `01a114a8-b32c-78b1-9d2f-9b140bb8300c`; continuation worker `/root/home_furnishings_resume`. The prior partial three-file implementation was inspected and preserved, then completed within its original scope. Source is **implemented-unverified**. This document freezes the leaf API; root owns every shared/native/UI/build/persistence join.

## Frozen modules and signatures

| Module | Exports |
| --- | --- |
| `src/home_furnishing_content.js` | `HOME_FURNISHING_IDS`, `HOME_FURNISHING_KEYS`, `homeFurnishingProjects`, `homeFurnishingDefinitions`, `homeFurnishingPublicCommandIds` |
| `src/home_furnishing_facts.js` | `homeFurnishingsEnrolled(state)`, `homeFurnishingWorkshopEarned(state)`, `homeFurnishingMatureRecord(state)`, `exactHomeFurnishingJob(state, job)`, `homeFurnishingFacts(state, context = {})`, `validateHomeFurnishings(state, registry)` |
| `src/home_furnishing_host.js` | `homeFurnishingContext(state, registry, context = {})`, `commitHomeFurnishingCommand(state, registry, command, context, expectedSequence = state.sequence)`, `homeFurnishingPresentation(state, registry, context = {})`, `homeFurnishingPublicCommands()` |

`homeFurnishingDefinitions` contains ten player commands and one situation. It contains no people, sites, item definitions, sources, conditions, routine/controllers, powers, clocks or on-enroll effects. Definitions and project descriptors are deeply frozen. Command group and command type are both `home_furnishings`; namespace is `home_furnishings.`. `homeFurnishingPublicCommands()` returns the immutable command-ID array, not action objects.

## Five root joins

1. **Definition registration.** Merge `homeFurnishingDefinitions` into the existing simulation definition families. Reuse existing `base.frontier`, native `Shack`, owned `field.assembly` capacity 1, native player and existing item keys. Register neither a second site nor a provisioning/enrollment adapter.
2. **Facts and reader.** Add `homeFurnishingFacts(state, context)` to central `simulationFacts`; add `validateHomeFurnishings(state, registry)` to the authoritative expansion reader. The facts module is pure and imports no executor or host. Absent furnishing rows are inert. Existing audit/reference enrollment is required before any furnishing state. No schema bump or `auditRemainder.modules.home_furnishings` owner is admitted.
3. **Completion reservation binding.** In `simulation.js` completion-support context, when `completionGroup === 'home_furnishings'`, pass `{homeFurnishingReservation: job}` for the exact job popped from the scheduler. Supply the existing current native body/alive/facts and staged gameplay/vitals/equipment bindings. This transient parameter is not serialized. Without it, the debited kit/notebook/knife is absent from current inventory and valid accepted work would fail support. No custom completion function is needed; frozen ordinary item/world/fact/knowledge effects and standard claim settlement/refund remain authoritative.
4. **Native command and controls.** Use `homeFurnishingContext` with the existing feature/campaign context; route command type `home_furnishings` to `commitHomeFurnishingCommand`. Supply `actorId:'player'`, current `nativeBody`, `nativeAlive`, `facts.location`, `facts['native.zone.Shack.accessible']`, actual gameplay inventory and actor-keyed vitals/equipment. The host preserves the staged plan and uses no publisher. Existing generic cancel routing accepts the projected `{type:'cancel', id:job.id}` controls. Furnishing action controls carry their current sequence; the commit rejects stale sequence, foreign target, enrollment or command group.
5. **Presentation and build.** Append `homeFurnishingPresentation(...).sections` to the existing feature panel and its public command IDs to existing disclosure/link coverage where applicable. The presentation supplies construction stages, currently accepted work/cancel, first and later drying, mature-notebook gate, adaptation/use and retained typed knowledge records. Root alone rebuilds the integrated source and qualifies source-map/served bytes. Gameplay and save acceptance remain in [the backlog](ACCEPTANCE_BACKLOG.md).

## Exact IDs and paid flow

| Command ID | Costs reserved at acceptance | Duration | Completion |
| --- | --- | --- | --- |
| `home_furnishings.survey` | 2 native coins, 1 held Prepared survey kit, 1 stamina | 3 min | Return kit; record specific survey/right and start the two project flags |
| `home_furnishings.drying_rack.frame` | 2 Rough wood logs, held kit, 2 stamina | 4 min | Return kit; physical frame/receipt |
| `home_furnishings.drying_rack.finish` | 1 log, 1 Tree sap, held kit, 1 stamina | 3 min | Return kit; finished rack/receipt |
| `home_furnishings.first_drying` | 2 Green repair offcuts, 1 stamina | 4 min | 2 Compatible repair offcuts; permanent first-batch receipt |
| `home_furnishings.dry_offcuts` | 2 green offcuts, 1 stamina | 4 min | 2 dry compatible offcuts; repeat only after the first actual batch |
| `home_furnishings.drafting_bench.frame` | 1 log, 1 Sound repair stave, held kit, 2 stamina | 4 min | Return kit; physical frame, after actual first rack batch and mature compilation |
| `home_furnishings.drafting_bench.finish` | 2 compatible dry offcuts, 1 sap, held kit, 1 stamina | 3 min | Return kit; finished fixed-stop home bench |
| `home_furnishings.adapt_notebook` | Held own mature Cyorian annotated design notebook, 1 sap, 1 stamina | 4 min | Return same notebook; own mundane fitting adaptation |
| `home_furnishings.draft_stave` | 2 compatible offcuts, held own mature notebook, 1 stamina | 3 min | Return notebook; 1 Sound repair stave |
| `home_furnishings.draft_kit` | 1 sound stave, 1 sap, held own Field fitting knife and mature notebook, 1 stamina | 3 min | Return notebook unchanged and knife as 1 Dulled field fitting knife; 1 Prepared survey kit |

Survey, construction phases, first drying and adaptation are once-only with unique claims. Later drying, drafted staves and drafted kits are deliberate repeatable jobs. Every timed job uses `field.assembly`, refundable reserved costs, revision 1, `reservationReturns:1`, frozen current support and refund on lost support. None is automatable. A frame grants no fixture use. Costs/durations/original prose remain reversible proposals, not director-accepted balance.

The survey situation is `home_furnishings.fit_out`, immutable `surveyed` phase, player participant and original existing Frontier context. Claims are `home_furnishings.survey_right`, `home_furnishings.first_drying`, `home_furnishings.adaptation`, plus the four compiled `project.home_furnishings.{drying_rack,drafting_bench}.{frame,finish}` claims. Player facts contain only `home_furnishings.right = 'field.assembly'` and `home_furnishings.adapted = true`. Fixture/phase flags live only in the existing `base.frontier` world facts. Existing player completion counts, knowledge and simulation jobs/claims/situation own the remaining records.

## Held notebook and material meaning

The mature-record predicate reuses the pinned existing Mother of Learning source revision and exact `book.mol.compile_notebook` receipt. It also requires the exact earlier tested-lamp receipt, closed local-service account, deposited research account and Ibery's matching actual received-research receipt/cause/time. Compilation must follow those results by its actual five-minute interval. No scalar reputation, notebook count, title, remembered record, lamp or foreign book establishes maturity.

Physical adaptation and every drafted output separately debit the existing owned, unequipped, unborrowed notebook and return it once. Accepted jobs can satisfy the held-tool facts only through their exact revision, participant, site reservation, costs, effects and completion support. The same knife returns in its actual existing dulled variant; cancellation or unsupported completion instead refunds the originally reserved sharp variant because work produced no result.

All nine native item IDs already exist: Rough wood log; Tree sap; Prepared survey kit; Green repair offcut; Compatible repair offcut; Sound repair stave; Field fitting knife; Dulled field fitting knife; Cyorian annotated design notebook. The rack changes two existing green pieces into two existing dry pieces. The bench fitting consumes two dry pieces for one existing stave; kit drafting consumes one stave and sap for one existing native kit. Returned reservations are tagged to avoid treating the tools/book as new product acquisitions. Ordinary staves/kits feed the already defined fitting, crafting, field preparation/commissions, stock offers, transfer and trade consumers; no new market, stock refill, wage or demand is authored here.

## Scope and compatibility

Not accepting a survey has no effect. Canceling before survey completion grants no permission or fixture; canceling a later phase retains earlier actual work. Ordinary Village drying, Eda's permitted bench, portable measuring jig, specialization costs, Neri's existing room/occupation/service and legacy kit jobs retain their own definitions and claims. Home rack use needs no Cyoria visit; the later home drafting route connects an actual retained mature notebook to ordinary materials, never to native casting or source physiology.

Old absent saves remain inert under the same schema. New furnishing rows require this fork's exact reader/definitions. No private save was opened or changed. No migration, new persistence domain, body/source transformation, second room, person, realm/prestige, upkeep, idle refill or calendar is added. Static source/import/definition checks do not establish conservation, cancellation, browser behavior, save compatibility, rollback or game feel.

# P05 host join request for P00

Proposal only; source module is not registered or native gameplay-complete.
Authority: USER_VISION.md, PROJECT.md and absorb-all COMMON.md. Native owners
keep inventory, custody, skills, discovery, calendar and durable publication.
Target: 1366×768 desktop; show read progress, Stop/Resume, settled stories and
long-rest remaining time/Cancel in existing book/Here views. Mobile deferred.

## Registrations and acquisition

Use `REGISTRATIONS` in `content.js` as concrete proposed input, translating it
to native Book/BookData, item, trader and command constructors, not inserting
the descriptor verbatim. Village trader offers Tales of the Lantern Road for
5 coins; stock/availability follows the native trader. Keep the physical book.
Packed long-rest meal is a nonmagical OTHER item. A repeatable four-played-minute
Village preparation at Cooking level 1 consumes two Stale bread and two Cooking
herbs and yields one meal via the native reservation/completion owner. No free
meal at enrollment or render. Cancellation follows native recipe reservations.
At Sleeping level 5, an accessible native sleeping place enables an eighteen
hour rest. Actual meal consumption occurs at rest admission, never refunded
when the player cancels an already started rest. Duration, costs and XP are
original balance proposals; no canon/world rules are invented.

## Signatures and projection

`planReadingCommand(optionalState, {type, draw?}, context) -> {state,effects}`
Types: startRead, stopRead, resumeRead, startRest, cancelRest.
`observeReadingClock(optionalState, context) -> {state,effects}`
`longRestClockRequest(optionalState, context) -> integer minutes (0..5)`
`validateReadingState(optionalState, actualPlayedClock) -> true | throws`
`readingPresentation(optionalState, context) -> known-only view model`

Context inputs must be actual live projections, not saved booleans:

| Input | Native binding |
| --- | --- |
| clock | expansionState.clock; no wall-time or independent clock |
| worldId | live player world; proposal currently base.frontier only |
| nativeBody, alive | actual living native body/control owner |
| safe | noncombat location, no battle or unresolved dangerous/manual choice |
| available | no conflicting occupation, trade, dialogue, activity, journey, practice, expansion job or sealed/paused backlog interval; excludes this feature's own current commitment |
| ownedAnthology | actual held native key ANTHOLOGY_KEY, subtract borrowed/custody counts; physical copy required while reading |
| ownedRestMeal | actual spendable owned REST_KEY after existing reservations/custody |
| housingAccessible | BOTH current native housing and location availability |
| sleepingLevel | character.getTotalSkillLevel('Sleeping') |
| readProgressPerMinute | wave-1 reveal-chain live Literacy/reading-speed projection, not another formula |
| knownAnthology | existing item discovery owner or actual earned ownership |

P00: choose optional namespace `expansion.p23Reading` (schema 1). Missing key
stays absent across load/render/import. Explicit null, extra fields, unknown
schema, changed draws, impossible rest durations/progress, future clocks and
inconsistent receipts reject in preflight before ANY owner mutates. Extend the
existing expansion schema admission, save-file validator and snapshot restore
paths to call `validateReadingState` with envelope expansion.clock. No new
localStorage key or second save engine. Restoring never rerolls, emits effects,
consumes stock or rewards receipts. Derive read/rest occupation from current,
not from a second persisted is_reading/is_sleeping flag. Existing old saves and
all native book progress/bonuses remain unchanged.

For startRead only, obtain one uint32 from the existing saved seeded RNG stream
in the unpublished plan. Supply it as command.draw and publish RNG advance and
new attempt together. No Math.random. Resume keeps original draw and progress.
Draw fixes story, duration (12..24 progress units) and Literacy award (8..16 XP).
The player sees the story only after completion. Stop preserves the attempt;
paused time supplies no progress. Observe accepted time before stop/cancel.

## Atomic native effects and clock join

Each immutable result leaves its input unchanged. Effects are instructions for
P00's unpublished native plan, not callbacks to run after the durable save:

| Effect | Input | Required native output |
| --- | --- | --- |
| consume | key, count:1, eventId | native inventory delta -1 after ownership/reservation preflight |
| skillXp | skill:Literacy, amount, eventId | native gameplay XP planner with ordinary native multipliers/milestones once |
| finishOwnedBook | key, eventId | native BookData reaches its required_time and availability becomes finished; retain physical item, no anonymous furniture conversion |
| story | text, eventId | public remembered receipt/log after successful publication only |

Namespace event identity `p23.reading:<eventId>`, not a shared bare numeric ID.
Publish optional state, RNG, inventory, skill XP, finished book and accepted
calendar/played time in ONE existing guarded durable native publication. Failed
preflight/save leaves all owners unchanged; retry the same unpublished event.
Repeated observe at the same settled state emits no effects. Do not replay
receipts during load/import. Counter safety only, no fixed lifetime read cap.

Intercept this anthology's native start_reading/do_reading path: delegate its
repeatable attempt, including a finished book, to this module. Keep normal
books unchanged. Do not also run native addProgress, literacy_xp_rate or native
finish bonuses for this item. Literacy payoff comes from the module settlement.
After its first completed read BookData stays finished forever for collection
projection; later reads never reset it. N17 remains furnitureProjection's
finished-and-owned distinct count (inventory plus accessible home chest,
borrowed copies excluded); its current visible collection already exists.

On each ordinary active-reading clock plan, pass the accepted *new* played
clock and wave-1 reading rate into observeReadingClock before publication.
Paused reads allow other actions and resume anchors observedAt to current clock.
Prevent transfer/loss of the required physical book during active read or stop
first. If body/location/safety/ownership becomes unsupported, stop the read or
cancel rest at its last accepted boundary before advancing that interval.

Long rest exclusively occupies native sleep. Request at most five minutes per
ordinary asynchronous update via longRestClockRequest, route through existing
joined clock/calendar/effects policy, then observe the actual accepted clock.
Partial/zero native acceptance is valid. Never loop update/ontick synchronously
or replay combat/actions to finish 1080 minutes. Keep Cancel visible. Recheck
safety/body/housing before every batch; native death/manual-choice pauses are
not bypassed. Use ordinary sleeping recovery/XP owners once per actual native
update; this module awards no rest completion XP/vitals. Completion/cancellation
ends the sleep projection. Interrupted meals remain consumed. No offline rest.

## Required integrated acceptance (all OPEN)

P00's stacked candidate, after wave-1 reading/view reports and transfer: earn and
purchase the anthology normally; finish two reads with distinct event IDs;
stop/resume a pending read with exact draw/progress; verify Literacy benefit and
settled story UI. Verify retained physical finished book contributes exactly one
native household collection entry across rereads/copies and leaves normal books
unchanged. Earn Sleeping/Cooking progression, prepare meal through paid native
inputs, start/cancel one rest and prepare/start/finish another; observe consumed
items and correct calendar rollover without combat replay. Verify opposite
safety/ownership/housing/busy controls, Effects-off and desktop legibility.

Save/reload, export and literal-file import pending/paused/settled reads and
pending/cancelled/completed rests exactly, including native inventory, XP,
calendar, collection and RNG state. Unsupported-schema import rejects before
mutation; old absence remains absent. Inject publication failure to prove atomic
no-pay/no-XP/no-RNG/no-clock advance and retry exactly once. A direct module test
or browser import is source evidence only. Rebuild and record served bundle
hash, full tests and native evidence before changing implemented-unverified.
Weibao's play/taste remains a separate final acceptance gate.

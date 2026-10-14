# P18 native host join request for P00

Status: proposal source module, implemented-unverified gameplay. No registration
or native state mutation from this lane. Base: 0216ccde. R21/N04/N30 source owners
remain read-only. World owner: `proto23_world_ids.js` and
`docs/worlds/proto23/WORLD_BRIEF.md`; the W18 growth audit is proposal context,
not registration authority. P12 owns cultivation trials; this is not a trial.

Target: 1366×768 laptop/desktop. Show known profile level, finite pending XP,
owned tonic's exact permanent effect and reading-conditioning enabled/blocked
reason in the existing relevant native panels. Mobile is deferred. This module
introduces no effects; use the native Effects-off master switch if P00 adds
optional feedback, and native discovery for reveal. No hidden body/world facts
may be inferred from `bodySupported`, availability or errors in public UI.

## Functions and data

Import `PROFILE`, `GROWTH_DOMAIN` and exports from `profile.js`.
`PROFILE.id = p23.visitor.study_body`, world = `reference.proto23.village`,
local skill = `p23.study_conditioning`. Author this as an optional learned
visitor method with explicit opt-in, not a replacement for native Running,
Literacy or any capped default. Source curve is original exponential costs
100, 200, 400... and has no configured level maximum. Safe integer XP bounds
are storage limits. An unrepresentable next threshold is `null` in the view,
meaning "beyond current numeric storage", never a claim that level is capped.
The pending award must drain by bounded continuations, with no recursion.

Context shape from live native owners:

```js
{worldId, profileId, bodyId, bodySupported, nativeAlive,
 ownsSave, saveBlocked, nativeEligible, known, idle, clock,
 shopEligible, conditionEligible, resourcesEligible,
 occupation: {kind: 'reading', jobId, eligible},
 conflictingAction, bodyConflict, resourceConflict}
```

Body ID must come from real native body/actor custody, not a UI-generated ID.
`clock` is the native played-minute clock, not Date.now or a second timer.
`known` comes from player knowledge; learn the opt-in method via an existing
visitor tutor offer. `nativeEligible` includes the native availability predicate
and all existing actor/location/preparation restrictions. For XP, call the real
skill eligibility owner (`canGainXP` or equivalent profile-specific predicate)
before `beginAward`, including native body/source/resource rules. Do not merely
pass `true`, disable native tests, or broaden the global busy predicate.
For background work, provide explicit interval eligibility from the real reading
job, current body and resource owner. Combat, travel, trade, sleep and competing
physical work do not become simultaneous actions. Quiet posture/conditioning
needs no consumable resource of its own, but it must respect the receiving
body's resource eligibility and conflicts. Retain native Literacy XP/progress.

- `enrollGrowth(context) -> state`: only opt-in, learned, eligible supported body
  with writable save; refuses unsupported context. Does not modify the envelope.
- `validateGrowthState(optionalState) -> same optionalState`: undefined remains
  undefined. Unsupported schema, extra fields, malformed pending jobs, nonfinite
  numbers and inconsistent XP/level reject before native restore/mutation.
- `quoteTonicAcquisition(state, context, {money,stockCount}) -> {itemId,itemKey,
  count:1,moneyCost:25,stockCost:1}`: register an original native usable tonic
  `Visitor fortifying tonic` in the existing known Proto23 shop with funded stock.
  Let native stock replenishment own future supplies. No inventory/stock in this
  module and no free minting on load, entry or projection. Re-read quote under
  custody just before native trade commit. Native trade event owns acquisition
  idempotency; call its existing transaction, not a new purchase loop.
- `consumeTonic(state,context,{sequence,inventoryCount}) -> plan`: one exact native
  owned item consumed, plus 2 max_health in the persistent profile source.
  `sequence` is an increasing per-body native consumption receipt number. Replay
  or stale sequence costs zero and has zero delta; next real event works again.
  No lifetime once gate. No implicit heal is requested.
- `beginAward(state,context,{sequence,amount}) -> plan`: positive safe integer
  already-quoted final local XP, no automatic global multiplier or cap. The local
  award sequence must monotonically increase for this body/profile across all
  sources. This call freezes the pending amount but grants nothing. Duplicate
  event returns no change; same sequence/different amount rejects. A later event
  waits until pending settles. Native capped defaults and parent XP stay native.
- `settleAward(state,context,maxSteps=8) -> plan`: staged XP and each crossed
  milestone, at most eight steps. Continue after each successful atomic publish
  until `complete`. Initial accepted award is not re-qualified on every reload;
  writable custody, alive supported body are still required. If body/world is
  temporarily unsupported, retain dormant pending progress, do not discard it.
- `setBackground(state,context,boolean) -> plan`: default off; switching advances
  the played-clock anchor without earning blocked time. Restore retains setting.
- `advanceBackground(state,context,sequence) -> plan`: call once per actual played
  minute after native reading qualification, using eligibility for that elapsed
  interval. One local XP per valid minute. Blocked/disabled intervals move anchor
  without reward; no unchecked multi-minute or offline catch-up. Duplicate native
  minute earns zero; a new minute requires fresh award sequence. Drain pending
  large grants before this tick; while pending, conditioning is paused truthfully.
- `growthBonuses(state,context) -> {stats,xp_multipliers}`: absolute native stat
  source projection. Two tonics = +4 max_health. Milestones 2/5/10 give +1
  max_health/+1 max_stamina/+2 max_health. Dormant outside matching body/profile/
  world. No bonus leakage into unsupported bodies. Retain state through departure.
- `growthView(state,context) -> known view or null`: no hidden row for unknown
  profile; `backgroundEligibility` returns known generic blocked reasons, not
  sealed source facts. P00 must filter undiscovered controls before exposing them.

Every mutating operation above returns `{next,nativeDelta,nativeProjection,...}`.
These are pure plans, not persistence or gameplay. Clone native inventory/money/
stock/body stats and optional state together under native custody, preflight all
inputs and schema, commit full native envelope, then publish UI/feedback. Failed
save must publish/consume nothing. Never apply a plan twice to a live object.
Use native revision/job/receipt guard when comparing the snapshot to live state.

## Save and native stat source

Request optional top-level envelope key `p23_growth_profile` schema 1, or an
explicit named optional native domain with exactly this payload. Old saves omit
it; no initializer on ordinary loading. Validate in literal-import preflight
before *any* native mutation. Save contains only safe integers/booleans/strings/
null; BigInt thresholds exist in computation only. Pending and completed
`award` receipts persist. Latest sequence high-water marks avoid unbounded
receipt arrays without imposing a gameplay limit; P00 must provide ordered native
events and never reuse numbers after reload/import.

Add a separate replaceable flat stat source `p23_growth_profile` in the native
levelable stats rebuild. `max_health` and `max_stamina` are native names. Apply
`nativeProjection` as the entire current source at load and after each commit;
never replay `nativeDelta` through `addSkillMilestoneBonus` on restore, and never
serialize a second accumulated copy in the native milestone bucket. Native
recompute handles UI totals, current-vital limits and resource owners. P00 may
use `nativeDelta` only for known feedback after successful publication.

## Integrated acceptance still OPEN

P00 candidate must acquire and consume two separately funded tonics through the
native shop and inventory; unsupported body/profile controls must not charge or
apply effects. Award 150000 finite local XP via an earned native event, observe
milestones 2/5/10 once and drain/reload pending state. Exercise eligible real
reading plus conditioning; combat/physical-work/resource-conflict control must
pause with truthful reason. Save/reload/export and literal-file import old,
pending and complete full envelopes, prove exact native total stats and no bonus
replay. Include failed-save no-charge, known-only and Effects-off checks on rebuilt
fresh origin at 1366×768. Module JSON fixtures do not satisfy these gates.

Build and focused/full source tests run here; native integrations belong to P00
following wave 1 joins. Coordinator must not final-merge this lane as verified
gameplay until the integrated candidate passes. Afterwards the remaining
acceptance gate is Weibao's play/taste, including these proposed numbers.

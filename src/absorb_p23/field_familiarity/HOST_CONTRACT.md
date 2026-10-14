# P07 host contract for P00

Proposal, base 0216ccde. This module has no registrations or live store. P00
alone joins it. Owners: USER_VISION.md, PROJECT.md, LIFE_SIM_NORTH_STAR.md
(proposal), game_time.js, activities.js, models/location.js and C2 local_life.js.
C2/P14 state remains read-only; do not replace their searches or found flags.

## Registration requests

- One original known site: `frontier.village-moon-bed`, at native `Village`.
  A public conversation with the already-met Village elder can explain its
  Golmoon leaf growth, New phase appointment and physical replenishment.
  P00 authors that conversation using the native discovery/fact owner and
  supplies `knownSite` from that earned fact, never from an unlocked location
  alone. This public site is not a sealed route or a franchise secret.
- Register `scouting` as an interruptible Village training action, with no
  extra clear/skill/character XP from this module. Scouting and actual combat
  in native `Infested field` each add one familiarity minute per played
  minute. At 30 minutes, expose `familiar-search`, reducing herb search from
  six to three played minutes. Continued learning remains possible.
- Register `lunar_gathering` as the pending native activity for `gather` or
  `familiar-search`. Do not let ordinary herbalism's working-period resource
  roll also run for this action. Native time/stamina/action eligibility stays
  authoritative. No separate timer, random roll, currency or inventory.
- Native resource is existing `Golmoon leaf` (one per physical bed occurrence),
  useful through existing healing/crafting consumers. No new item needed.
  Stock replenishes at each native New phase, with 00:00–04:00 appointments
  each day in that phase until harvested. No lifetime once gate. Never reset
  a claim on rendering, reload, departure, a clear, or an arbitrary timer.
- Render `fieldView` in Local actions at 1366×768: next date/time and countdown,
  honest picked stock, earned fast search and pending time/Stop. Mobile is
  deferred. There are no VFX emitted by this module. If P00 adds a cue, route
  it through the existing Effects-off master switch and known-only rules.

## Exact APIs

Import from `src/absorb_p23/field_familiarity/index.js`:

`validateFieldFamiliarity(raw)` returns true or throws. Only `undefined`
means absent old state. Present state must be schema 1 with all exact fields;
null, unsupported schemas, invalid numbers, unknown fields and invalid pending
records reject. `normalizeFieldFamiliarity(raw)` returns a fresh validated
state; never publish its default merely because a save was loaded or UI drawn.

`validateFieldSnapshot(raw, {clock, calendar})` returns true or throws. Call
with the incoming save's authoritative played clock and native `current time`
during whole-envelope preflight, before mutation of any native or feature
owner. It rejects claims that are not a native New-phase start day, future
claims, field cursors ahead of the saved clock, or pending records inconsistent
with the saved clock/window. Other native action/discovery validators must also
reject a pending search with wrong location, action, world or unknown site.

`fieldAction(raw, context, id)` returns `{state, native, messages, ok}`. IDs:
`gather`, `familiar-search`, `stop`. Context:
`{worldId, alive, idle, knownSite, location, clock, calendar}`. `clock` is the
existing saved played-minute owner; `calendar` is the native Game_Time snapshot
including day_count, never a Date or a synthetic moon clock. Normal start
eligibility must be validated by P00 before this call. Commit a successful
start together with the corresponding native activity, or do neither. Stop
must also stop native gathering. A failed plan creates no live state or claim.

`advanceFieldFamiliarity(raw, context)` returns `{state, native, messages}`.
Context: `{fromClock, clock, calendar, worldId, alive, knownSite, location,
activity}`. `worldId`, `alive`, `location`, `activity` describe the START of
one actual native played interval. `calendar` and `clock` describe its END.
`activity` is `scouting`, `combat`, `lunar_gathering`, or any other native
activity (ineligible). Even if combat ends in a kill/clear during that step,
pass its start identity. Do not invoke from load/render/export/import/offline
catch-up. Seed an absent cursor at the beginning of the first relevant interval
with a zero-width call, then advance the real interval. Gaps rebase without
credit; duplicate/backward clocks do not replay. Preserve the saved cursor on
reload. While pending, call on every played step including interruption,
travel and death so the module can cancel truthfully. If returned pending is
null, stop the corresponding native lunar activity. No reward for stop.

`native` has `{items:[{item_id,count}],skillXp:{},money:0}`. Scouting/combat
never awards XP. On successful gathering, the plan contains one Golmoon leaf
and its `lastHarvestOccurrence` together. `fieldView(raw, context)` is a pure
known-only projection; `lunarWindow(calendar, lastHarvestOccurrence)` returns
`{open,claimed,occurrence,remaining,nextIn,next}`. `next` is plain native date
fields and nextIn is native minutes, not real seconds. Read-only projections
never settle a reward. A search must finish strictly before 04:00.

## Transaction/custody joins

Use optional native save key `field_familiarity_p07`. Absent old saves retain
absence and load unchanged. Do not silently add defaults to old envelopes.
P00 supplies the existing native prepared-transaction/publisher, actual actor
bag/resource custody and durable save path. Before applying a plan, preflight
schema/snapshot, old-state revision, live clock, location, action eligibility,
known fact and item template/custody. Publish plan state, item addition and
native action stop/start atomically with the full native save. On abort or
stale plan, neither state nor inventory changes. Re-plan after revision drift;
never reuse a paid plan. Ensure callers cannot dispatch twice against the same
old state. Restoring a settled snapshot restores its native inventory; it does
not reapply native.items. Literal file import must validate all families before
mutating any owner. Missing state retains absence; present supported state
roundtrips exactly, including pending progress and claim high-water mark.

## Acceptance P00 must return

Fresh-origin rebuilt native desktop 1366×768: earn public discovery, scout to
partial familiarity, fight native Infested field to threshold without needing
a clear or changing clear XP, use three-minute search and show ordinary
six-minute control. Show actual positive/closed windows and next-window calendar
agreement. Harvest in two distinct native lunar cycles through legitimate
clock progression, show depleted physical stock and reachable next occurrence.
Save/reload/export/literal-file import pending, settled and between-cycle states;
reload/render creates no claim or reward, and a stale/aborted transaction cannot
pay twice. Old envelope absence stays absent and malformed/unsupported schemas
reject before any mutation. Include tested served bundle hash, journey evidence
and exact full-suite results. Until this joins and passes, P07 is
implemented-unverified and not eligible for final gameplay merge. After technical
gates, Weibao's play/taste is the remaining authoritative acceptance.

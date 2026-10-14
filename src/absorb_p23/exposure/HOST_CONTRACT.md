# P02 exposure contract for P00

Source module delivered against 0216ccdefcfce79877378f8cb0ee41129fe11c5d.
Proposal only. No native registrations, save joins, timers or shared-file edits.

## Imports and staging

`stageExposure(rawOptionalState, {start, end}, context)` returns
`{state, skillXp, staminaCost, underfedMinutes, gustMinutes, replayed}`.
`validateExposure(undefined)` returns undefined. Other payloads require schema 1
and valid phase, remaining duration, cursor and sub-cent XP remainders. It throws
before mutation. Module functions return copies, never change their input.

Context must contain:
- `played: true` for native eligible played time, including paid sleep/travel;
  false for offline/restoration. Pause yields a zero interval. No wall timer.
- `homeWorld` from existing `homePacingContext`, not inferred from a label.
- `pacing`: E1 state at the START of the interval, before its drain.
- `needsFood`: explicit current body applicability. Missing/false grants no Famine.
- `exposureEligible`: explicit body/environment applicability. Missing/false freezes hazards.
- `outdoors` and `sheltered`: actual native roof/shelter facts. Unknown shelter is safe.
- `coldResistanceLevel`: native total Cold resistance level; missing means zero.

Clock start/end are contiguous native played-minute coordinates. Cursor is only
an idempotency watermark, not another advancing clock. First invocation must start
at current restored clock, never retroactively catch up an old save. End <= cursor
returns zero deltas; extending overlaps/gaps reject. On clock rewinds, restore the
corresponding saved state with its clock, not only one side. P00 chooses the current
native played clock owner and calls once at its durable settlement boundary.

Split intervals at food consumption, hunger/weather/hazard toggles, body/world,
shelter/location or resistance changes. Do not infer the entire previous interval
from its final snapshot. Stage exposure BEFORE `advancePacing`, using the same
interval. E1 still owns all hunger/ordinary weather rates, native rain and meals.
Threshold <=20, drain 1/4.8 fullness per minute, proposed Famine rate 0.01 XP/minute.
Only the underfed suffix trains, independent of activity. Cent-sized awards plus
persisted sub-cent remainder match `Skill.addXp`'s two-decimal rounding.

## Exact shared joins requested

J1: Register a native `Famine` skill in `src/data/skills.js`, Environmental,
base_xp_cost 10, xp_scaling 1.8, max_level 40, visibility_treshold 0.01. No parent,
extra stat milestones or borrowed title table. Description: adaptation to going
without nourishment. Effect: up to five percentage points of E1's existing optional
hunger XP loss removed at level 40. These numbers are reversible proposals.
Use `famineEfficiency(existingHungerEfficiency, totalLevel, {homeWorld,needsFood,
hungerEnabled})` over the hunger factor only; then apply ordinary weather factor.
Do not increase meal bonuses or normal hunger-off XP above its existing baseline.

J2: Stage `skillXp.Famine` and `skillXp['Cold resistance']` into native skill state
with `use_bonus:false`, no parent XP and no per-action cap/rounding before our cent
award. `main.add_xp_to_skill` applies E1 pacing even when `use_bonus:false`;
do not route these already quantified awards through that unconditional multiplier.
Stage the native character skill owner directly and publish its ordinary discovery
UI only after the durable transaction succeeds. The saved cursor, pending remainders and native totals must publish together
in ONE existing durable transaction. Never award XP after save in a separate
non-atomic call, or settle again on load/toggle. Verify discovery from real awarded
XP using the existing native discovery path. P00 supplies native names to UI only
when those skills are known. If a multiplier is desired later, put it before the
module's quantization and retain tick-equivalence proof.

J3: Add optional top-level `p23_exposure` to native save creation/load/preflight.
Absent fields remain absent and preserve old saves. Preflight all validators
including `validateExposure` BEFORE any game mutation. Runtime can synthesize a
default without inserting it into imported old saves. Reject unknown schemas,
malformed phase/remainders and clock disagreement before applying anything.
Save and restore this with its native clock and native skill/resource states.

J4: Add `staminaCost` through the existing native resource owner, clamped at zero
available stamina, never negative stamina/debt and no HP damage/death. No invented
resource stock. Hazardous switch + E1 weather on + applicable home body are required.
Shelter blocks cold XP/cost/temperature but weather rhythm continues while eligible.
Gust 6 minutes / rest 12 minutes, original deterministic profile, no RNG needed.
Each exposed gust minute costs 0.2/(1+0.05*Cold resistance level) stamina, earns
0.02 Cold resistance XP and applies -3C in gust, zero in rest. Do not add an extra
cold penalty accidentally through both this cost and another hazard consumer.
Use `exposureEffects` for temperature through the native weather projection once.
Turning hazardous mode off freezes phase and applies zero new cost/temperature.

J5: Mount `mountExposurePanel({host,getState,getContext,getKnownSkills,onChange})`
in existing Settings/optional pacing area. `onChange` is synchronous atomic save
with writable custody/import/occupation guards. Set with `setHazardousMode` only
after settling elapsed time in old context; settings change itself earns no XP.
Display status in existing optional pacing panel or via `exposureStatus` without
revealing unknown skill names. Text-only: no FX or master-switch bypass.
Target 1366x768 desktop. Mobile deferred; no new workspace framework.

## Native acceptance still OPEN

Idle underfed versus fed/nonfeeding/paused/offline/world controls; exact threshold
crossing; useful Famine effect; explicit switch and mode-off control; outside vs
roof/shelter; gust vs rest; real native resource/resistance/discovery changes.
For pending remainder and phase, and settled awards: Save/reload, Export then
literal-file Import, replay/idempotency, unsupported-schema rejection before any
mutation, absent-old-save compatibility. Fresh-origin rebuilt desktop evidence
must identify served bundle hash. Module tests and isolated browser fixture do
not close these native gates. Weibao play/taste follows technical acceptance.

# W-C2: local discoveries and Village texture

Original proposal adapted from Proto23 O6/O7/O8. No Xeus24 code or text copied.
Owned paths: `src/absorb_c2/**`, `tests/absorb_c2.test.js`, this note.

## Behavior and bounds

- C2-1: Existing raw Potato and Roasted rat meat retain native Slight food
  poisoning and native resistance scaling. Rat meat already gives consumption
  resistance XP; Potato does not have the poison consumable tag. Additional
  **0.25** Poison resistance XP per actual played poison minute makes enduring
  the harmful effect useful. It never creates a second effect or grants XP on
  render/load. Root binds the pre-step remaining duration, not the post-step
  effect that may already have expired. Cooking/safe food remains the alternative.
- C2-2: Opt-in idle Village/Shack look-around attempts cost five played minutes,
  start at 10%, rise by five percentage points per miss, gain up to ten points
  from Perception and cap at **40%** total. One finite native loose item per
  location, no repeated item printing. Each attempt gives 0.5 Perception XP.
  Stop, movement or other native work cancels searching. One observed clock
  step supplies at most one roll, with no historical replay after clock jumps.
- C2-3: A runner can appear after **15 played minutes** of quiet Village time.
  Chance starts at 20%, rises by ten points per persisted miss, caps at 50%.
  At most one actual contact per game day. Help costs **5 coins** and gives
  2 Perception XP; decline costs nothing and has no penalty. A pending contact
  persists until answered; leaving never gives access to the dialogue elsewhere.
- C2-4: Village midday bread table is available **12:00–14:00** on the native
  calendar. One free native Stale bread per game day, persisted claim; no missed
  day catch-up. Service windows use the existing `world_rhythm.js` owner.
- C2-5: Fitting Xeus24 section 4 ideas: A1 committed balance JSON plus numbers
  checks; A2 live readiness explains current eligibility; A3 a local live-data
  reference paragraph within the native panel. Existing notebook and titles
  remain their own owners. Hidden-tab catch-up/backup changes are out of scope.

## Minimal integration contract (root owns these changes)

Imports:

```js
import {normalizeLocalLife, advanceLocalLife, localLifeAction} from './absorb_c2/local_life.js';
import {createLocalLifePanel} from './absorb_c2/panel.js';
let localLife = normalizeLocalLife(), localLifePanel;
```

Optional top-level save field: `absorb_local_life: localLife` in `create_save`.
Load: `localLife = normalizeLocalLife(save_data.absorb_local_life)`.
Explicit compatibility: absent field defaults empty, no invented exposure,
finds, encounters, meals or claims. Schema 1 is additive and separate from the
shared expansion schema. Persist all normalized state fields, especially
`lastClock`, misses, found flags, pending encounter, `hubDay`, and `mealClaim`.
Supplied nonobject/null/array containers and unsupported schema versions reject
with an error so the host can block the load and preserve the original save;
they never silently turn saved history into an empty record. Undefined/missing
fields retain the empty old-save default. Schema-less object fields normalize
as the current optional record.

Frame shape:

```js
const localLifeContext = () => ({
  worldId: expansionState.actors.player.worldId,
  location: current_location?.id,
  alive: character.is_alive === true,
  idle: !current_combat && !current_activity && !is_sleeping && !is_reading &&
        !current_dialogue && nativeActionReasons(expansionState).length === 0,
  clock: expansionState.clock,
  calendarMinute: calendarMinutes(current_game_time),
  perception: character.getTotalSkillLevel('Perception'),
  money: character.money,
  foodPoisonRemaining: active_effects['Slight food poisoning']?.duration || 0
});
```

Confirm actual variable names for dialogue/reading in root. Bind native idle
only when no pending native or expansion work/travel/visit blocks the player.
Use `foodPoisonRemaining` sampled BEFORE common-clock advancement, then supply
the resulting clock. First tick should initialize `lastClock` before playing
so a new effect starts learning immediately on its first played minute.
There is no additional timer, clock, inventory or publisher in this lane.

Plans:

```js
const plan = localLifeAction(localLife, localLifeContext(), id);
const tickPlan = advanceLocalLife(localLife, {...localLifeContext(), foodPoisonRemaining: preStepPoison});
```

Both return `{state,native:{money,items,skillXp},messages}`; actions also return
`ok`. All functions leave the live input unmodified. `items` uses existing
native `{item_id,count}` records, `skillXp` maps native skill names to amounts.
Stage state, native coin/item/XP changes in root's existing save transaction;
only after successful durable save publish native deltas, assign `localLife =
plan.state`, and log messages. Failed save discards the plan. Never grant a
reward separately then save the claim, nor save the claim without its reward.
Advancement with no rewards may still update state through root's standard
played state publication; preserve lastClock on every actual step.

UI initialization:

```js
localLifePanel = createLocalLifePanel({
  container: document.getElementById('location_actions_div'),
  read: () => ({state: localLife, context: localLifeContext()}),
  act: id => dispatchLocalLifePlan(localLifeAction(localLife, localLifeContext(), id))
});
```

Call `localLifePanel?.render()` with normal native panel refresh and after load,
action, tick and location change. It uses native details/button elements, no
interval. Keep it in the location actions container, outside the notebook's
exclusive panel-routing list, or add its ID to the Here panel registry if
root chooses notebook integration. Readiness gates in plans remain authoritative.

## Verification and playable gate

Worker focused tests: `node --test tests/absorb_c2.test.js`, 8/8 pass (final
source, including no roll on unchanged/load clock). Full `npm test` was started
but root requested interruption because concurrent worker suites overloaded the
host and triggered existing 60-second subprocess timeouts. Only the C2 process
tree was terminated. Full suite remains pending the coordinator's serialized
slot; the interrupted run is not a pass.

Coordinator-assigned exclusive full-suite slot, 2026-10-11: `npm test` passed
**287/287**, zero failures/cancellations/skips, 17.4 seconds, in the isolated C2
checkout at source commit `79e619be`. Log: `/tmp/absorb-c2-serialized-tests.log`.
This closes the worker full-suite gate; integrated browser/save gates below
remain with root after shared hooks and rebuild.

Coordinator review repair: the earlier normalizer silently emptied future-schema
records. It now rejects unsupported schemas and supplied malformed containers.
Focused `node --test tests/absorb_c2.test.js`: 8/8 pass after the repair; the
287/287 full-suite receipt above applies to the earlier source. Root owns the
integrated full-suite rerun and browser/save gate for the repaired source.

Integrated browser repair: native location refresh clears `location_actions_div`,
which removed the panel after its one-time append. `render()` now reattaches its
existing panel to the supplied container before checking its unchanged-view
fingerprint. The minimal DOM-facade regression removes the panel then renders
with an identical snapshot, checking reattachment and no duplicate nodes.
Focused suite after this repair: 9/9 pass; integrated browser recheck stays with root.
Browser gate belongs to root after shared hooks and bundle rebuild: fresh origin,
Village search miss/find, Shack search and movement cancellation; eat native
Potato, observe real effect health loss/XP before and after expiration; runner
help/decline plus insufficient money; noon bread claim/duplicate/next-day;
save, reload, export/import retaining all misses/finds/claims/pending contact.
Also inject failed storage and confirm native rewards and claims remain absent.
This worker alone is implemented-unverified gameplay until that integrated gate.

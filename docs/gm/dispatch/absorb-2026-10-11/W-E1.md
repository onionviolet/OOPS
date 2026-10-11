# W-E1: optional home-world hunger and weather

IDENTITY: bounded implementer `/root/hunger_weather`, parent `/root`, 2026-10-11, revision 1.
BASE: `c83bd8197a2653dca2e11fa862daed7ec8fad312`, branch `codex/absorb-2026-10-11-e1`.
OWNERSHIP: only `src/absorb_e1/`, `tests/absorb_e1.test.js`, this note. Root integrates native code, persistence, UI, bundle and browser gates.
STATUS: source and focused tests complete; native integration and browser/save/reload/import remain implemented-unverified.

## Original proposals

Both settings default **off**, preserving old food economy, native weather and XP pacing. On/off is independent. Disabled state freezes and resumes without reset. Effects and progression require explicit `homeWorld:true`; other worlds retain native behavior. No offline draining, separate timer, inventory or save writer.

Hunger starts at 100/100 and loses one point per 4.8 played minutes (eight hours for a full bar), including common-clock sleep/travel. Earned native XP scales from ×1 at full to ×0.8 at empty, with no HP damage or lethal starvation. Food tagged by the native owner replenishes `min(40,10 + longest native buff duration/12)` fullness. Stale bread restores15 (duration60); Fresh bread22.5 (duration150). Native food buffs, item consumption and Gluttony XP remain native. Nourishment can make food usable even when its native buff is already longer.

Weather proceeds through clear120, breeze90, fog90, rain120, clear180, overcast120 played minutes, with saved phase and remaining time. Summer clear phases last30 longer and rain30 less; Winter clear phases last30 less and rain30 longer; Spring fog lasts15 longer and Autumn fog30 longer. Initial clear starts120, independent of season, to give new opted-in saves a consistent start. Native calendar supplies seasons. In Winter rain displays Flurries. Clear adds0.5°C, breeze subtracts0.5°C, rain subtracts1°C over the native temperature result, only outdoors. Fog gives ×0.95 native earned XP outdoors. Native rain is always retained; optional rain adds to its existing Wet route. Shelter disables optional temperature/XP/rain additions, while weather keeps advancing. Hunger and fog multiply (empty outdoors in fog: ×0.76).

Source evidence: audit sections4/6 and R1/R2/R5 reader reports, not copied source. Original smaller numbers avoid Proto23's harsh floor and unreachable night branch. Native temperature model and rain cycle remain intact.

## Root integration contract

Imports:

```js
import {getPacingState,setPacingState,advancePacing,prepareFood,getPacingEffects} from './absorb_e1/pacing.js';
import {mountPacingPanel,foodPacingDescription} from './absorb_e1/panel.js';
function homePacingContext() {
  return {homeWorld: expansionState.actors.player.worldId === 'base.frontier',
    outdoors: current_location?.is_under_roof === false,
    season: current_game_time.getSeason(), nativeRain: is_raining()};
}
```

If outdoor native locations omit `is_under_roof` instead of setting false, use `!current_location?.is_under_roof` with a current-location existence check, matching native `main.js:6667`.

**Save fields:** additive top-level `pacing_e1` only:

```json
{"schema":1,"hungerEnabled":false,"weatherEnabled":false,"fullness":100,"weather":{"phase":0,"remaining":120}}
```

`main.js:create_save` (4376): `save_data.pacing_e1 = getPacingState();`.
`main.js:load` (4714): `setPacingState(save_data.pacing_e1);` before rendering, but loading XP must not use pacing. Missing field yields defaults. Numbers normalize to bounded safe values, booleans require true, unsupported future schema throws instead of silently erasing it. Preserve the existing guarded import/load path.

**Clock:** advance from actual successfully consumed played minutes exactly once. Native unjoined branch of `update_timer` (6577 vicinity): `setPacingState(advancePacing(getPacingState(), minutes, homePacingContext()));` after successful native calendar advance and before returning minutes. For joined clocks, stage `const pacingNext = advancePacing(getPacingState(), Math.max(0,plan.state.clock-expansionState.clock), homePacingContext())` inside `persistExpansion` and write `envelope.pacing_e1=pacingNext` through that function's native publication `write` before `persistExpansionPlan` accepts storage. Publish `setPacingState(pacingNext)` only after that storage succeeds. This catches joined instantaneous travel and simulation commands as well as ticks without a second save path. Do not additionally advance in `update()` if this hook is used. Optional-pack world clock path intentionally pauses these meters. Zero delta does nothing. Failed storage must leave live meter unchanged.

**XP hooks:** `main.js:add_xp_to_skill` (3285), before character.addXPToSkill:

```js
if (!is_from_loading && !restoringNativeSave) xp_to_add *= getPacingEffects(homePacingContext()).efficiency;
```

`main.js:add_xp_to_character` (3451), before character.addXP:

```js
if (!restoringNativeSave) xp_to_add *= getPacingEffects(homePacingContext()).efficiency;
```

The character XP function restores saved totals at4957/4998. The guard is essential or reload/import would reduce earned XP. These hooks scale the native XP paths, not unrelated book-world simulations.

**Food hook:** `main.js:use_item` (4109): after native disposition assertions and resolving template, prepare:

```js
const nourishment = prepareFood(getPacingState(), item_templates[id], homePacingContext());
let used = nourishment.restored > 0; // replaces existing `let used = false`
```

Keep the existing effects loop and `if(used)` block. Within that block publish `setPacingState(nourishment.state)` after native `character.removeFromInventory([{item_key}])`, then panel.render. This preserves native buffs/Gluttony and allows meaningful eating while an equal/longer buff is active. Fullness100 with nonextendable buff still consumes nothing. A rejected native disposition/absent item must consume nothing. Existing native use_item assumes a valid inventory key; root must keep native inventory validation ahead of the nourishment hook.

**Weather hooks:** at `main.js:6665`, add offset to native result:

```js
const pacingWeather = getPacingEffects(homePacingContext());
const new_temperature = get_current_temperature_smoothed() + pacingWeather.temperatureOffset;
```

At6669 use `if(pacingWeather.raining)`. Existing below-zero snow rendering and rain-counter/Wet progression continue. `weather.raining` facts at main.js518/547 should use the same projection if their native home-world consumers need to react to added rain, retaining nativeRain=true. Do not replace `weather.js` formula.

**UI:** insert panel into native `#options_choices` (index.html693):

```js
const pacingPanel=mountPacingPanel({host:document.getElementById('options_choices'),
  getContext:homePacingContext,
  onChange(next) {
    // Use existing guarded setting-save owner; sample native envelope staging:
    if(!ownsSave || foundationSaveBlocked || importProbeToken || restoringNativeSave)
      throw Error('Pacing changes require the writable game tab.');
    const save=JSON.parse(create_save()); save.pacing_e1=next;
    lifeSaveStorage.setItem(is_on_dev()?dev_save_key:save_key,JSON.stringify(save));
    setPacingState(next);
  }});
```

Call pacingPanel.render after load, clock, food and location changes. Add `foodPacingDescription(item)` to native food tooltip if convenient; it returns empty for nonfood, avoiding price-derived nutrition. Module UI has its own change handling and rolls controls back on save rejection. Root may expose a read-only live status in the current location panel as well, since options are collapsed during normal play.

## Browser fixture journey, root owns execution

Use a rebuilt fresh localhost origin and test-only save fixture, never private saves. Keep authoritative base IDs from the current native fixture builder.

1. Load an old fixture without pacing_e1. Verify both settings off, native earned XP and native temperature unchanged. Toggle each option in Options and verify save owner permits the change.
2. Test fixture with fullness50, hunger on, weather off, home-world actor: earn native character and one native skill XP and compare to declared ×0.9. Use one Stale bread from native inventory: bar50→65, item count decreases1 and native meal effect appears. Repeat with an equal/longer Basic meal active: bar65→80 and exactly one additional bread is consumed. Full bar and nonextendable buff consumes nothing.
3. Fixture weather phase2 remaining1, weather on, fullness100: outdoors XP×0.95 and duration reaches next state after one consumed minute. Rain adds -1°C over native smoothed temperature and progresses native Wet counter. Use native shelter: offset0 and no fog XP penalty. Native-rain fixture phase0 still rains.
4. Exercise actual native travel and accelerated sleep, verifying one pacing advance per consumed minute; pause/read-only rejection cannot drain. Toggle both off, advance, verify retained values freeze; reenable to resume. Enter another world and verify pause/no optional penalty.
5. Save, reload and import exported test data: preserve exact meters/options/weather deadline and native XP totals. Next elapsed minute transitions only once; import must not apply XP multiplier to stored totals. Unsupported future pacing schema rejects safely without overwriting the valid live save.

## Evidence and resume

Focused `node --test tests/absorb_e1.test.js`: 12/12 pass. Covers additive defaults, bounded state/future schema, home-world scope, meal repetition/caps, rain retention, shelter, actual XP/temperature projections, seasonal expiry, large versus segmented played time, fractional duration, JSON roundtrip and panel rejection handling. Full `npm test` result will be appended after completion.

No build, native integration, browser or durable native save journey performed by this worker. Root acceptance backlog retains those gates. Next action: root cherry-picks worker commit, integrates the listed shared hooks and exercises the browser fixture journey.

Full-suite attempt: `npm test` produced one native alloy-equipment browser timeout (`equipped native brace with an open road offer keeps ticking, travelling and reloading`, 60,435ms) while several worker suites ran concurrently. Parent instructed stopping the E1-only suite. By the time the scoped process search ran it had already finished; no process was terminated by the worker and no retry was run. `/tmp/yairpg-e1-tests.log` holds this local attempt evidence. Full-suite final status: **290/291 pass, one timeout failure**, duration175,206ms, not passed. Root owns the serialized combined full-suite retry. Focused E1 12/12 and `git diff --check` remain passed.

Serialized worker retry (2026-10-11): parent provided the exclusive full-suite slot after D completed. `npm test` in the unchanged E1 worker checkout passed **291/291**, zero failures, duration9,259ms. The prior alloy-equipment timeout did not recur. Local complete output: `/tmp/yairpg-e1-serial-tests.log`. This verifies this worker checkout's test slice, not the root integrated bundle or browser/save gates.

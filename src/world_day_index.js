// C1 (TIME_TRAVEL_AND_SEEDED_WORLDS_2026-10-27): one day coordinate for keyed draws.
// Pure and read-only: no save field, no state write, no RNG. Keys hash dayIndex(world),
// never a raw clock. dayIndex is the world's played-calendar `day_count` (1-based).
import {WORLD_CALENDAR_PROFILES} from './world_calendar_content.js';
import {projectCalendar} from './world_calendar.js';
import {check, natural} from './basics.js';

// The two clocks (F6). Documented here so a new key never picks a clock by accident.
export const WORLD_CLOCKS = Object.freeze([
    Object.freeze({name: 'played calendar', source: 'src/game_time.js (Game_Time.day_count)', unit: 'days',
        epoch: 'day_count 1 at the calendar anchor (home: 999-04-01 08:00)', input: '{calendar: {day_count}}'}),
    Object.freeze({name: 'expansion clock', source: 'src/expansion_engine.js (state.clock)', unit: 'played minutes',
        epoch: 'minute `anchor.at` is the calendar `anchor.calendar` (default: clock 0 = the world profile anchor)',
        input: '{clock, worldId?, anchor?: {at, calendar}}'}),
]);

// world: {calendar} reads the played calendar directly. {clock} maps expansion minutes through the
// world's calendar profile (src/world_calendar.js), so both clocks give the same day_count.
export function dayIndex(world) {
    if (world?.calendar != null) {
        const n = world.calendar.day_count;
        check(natural(n) && n > 0, 'Invalid played calendar day.');
        return n;
    }
    const profile = WORLD_CALENDAR_PROFILES[world?.worldId ?? 'base.frontier'];
    const at = world?.anchor?.at ?? 0;
    check(profile && natural(world?.clock) && natural(at) && world.clock >= at, 'Invalid expansion clock.');
    return projectCalendar(profile, {elapsed: world.clock - at, instanceId: world.instanceId ?? 'day_index',
        calendar: world.anchor?.calendar}).day_count;
}

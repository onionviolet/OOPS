// Sky and seasons as substrate (OS6): daylight, moon phase, rain, season and
// the day number are place quantities set by one W law from the root clock, so
// a moon window or a rainy day reaches every domain through the same reads.
// The day, the minute of the day and the season come from the world's calendar
// profile through projectCalendar, the reader dayIndex uses (TMR1, TMR2), so the
// sky agrees with every other day count. Rain follows the native 13-day rain
// calendar on the native weather minute (weather_calendar.js) unless a world
// supplies its own source. Dials per world: the calendar (world id and the root
// minute its anchor sits at), dawn and dusk minute of the local day, moon cycle
// length in days and the rain source.
import {isRainingAtMinute} from './weather_calendar.js';
import {projectCalendar} from './world_calendar.js';
import {WORLD_CALENDAR_PROFILES} from './world_calendar_content.js';
import {WORLD_QUANTITIES as Q} from './world_quantities.js';

const SEASONS = Object.freeze({Spring: 0, Summer: 1, Autumn: 2, Winter: 3});
export const SKY_DEFAULTS = Object.freeze({worldId: 'base.frontier', anchorAt: 0, dawn: 360, dusk: 1200, moonCycleDays: 30, rainAt: isRainingAtMinute});

function profileOf(d) {
    const profile = WORLD_CALENDAR_PROFILES[d.worldId];
    if (!profile) throw new Error(`World sky: no calendar profile for ${d.worldId}.`);
    return profile;
}
const dayLengthOf = profile => profile.units.minutesPerHour * profile.units.hoursPerDay;

/** The sky at a root minute. `season` is -1 where the calendar has none. */
export function skyAt(minute, dials = {}) {
    const d = {...SKY_DEFAULTS, ...dials}, profile = profileOf(d);
    if (!Number.isSafeInteger(minute) || minute < d.anchorAt) throw new Error('World sky: minute before the calendar anchor.');
    const view = projectCalendar(profile, {elapsed: minute - d.anchorAt, instanceId: 'w.sky'});
    const day = view.day_count, within = view.minuteWithinDay;
    const cycle = ((day % d.moonCycleDays) + d.moonCycleDays) % d.moonCycleDays;
    // The native weather minute counts whole days of the played calendar (weatherClockMinute).
    const weatherMinute = day * dayLengthOf(profile) + within;
    return {day, daylight: within >= d.dawn && within < d.dusk ? 1 : 0,
        moon_phase: Math.floor(cycle * 8 / d.moonCycleDays), rain: d.rainAt(weatherMinute) ? 1 : 0,
        season: view.seasonId ? SEASONS[view.seasonId] : -1};
}

// Minutes until the next dawn, dusk or local midnight: the only boundaries where a sky value can change.
function nextChange(minute, d) {
    const profile = profileOf(d), length = dayLengthOf(profile);
    const within = projectCalendar(profile, {elapsed: minute - d.anchorAt, instanceId: 'w.sky'}).minuteWithinDay;
    return Math.min(...[d.dawn, d.dusk, length].map(b => b > within ? b - within : Infinity));
}

export function createSkyPack(dials = {}) {
    const d = {...SKY_DEFAULTS, ...dials}, profile = profileOf(d), length = dayLengthOf(profile);
    if (!(Number.isSafeInteger(d.dawn) && Number.isSafeInteger(d.dusk) && 0 <= d.dawn && d.dawn < d.dusk && d.dusk <= length &&
        Number.isSafeInteger(d.anchorAt) && d.anchorAt >= 0 && Number.isSafeInteger(d.moonCycleDays) && d.moonCycleDays >= 1 &&
        typeof d.rainAt === 'function')) throw new Error('World sky: invalid dials.');
    const names = ['day', 'daylight', 'moon_phase', 'rain', ...(profile.seasons ? ['season'] : [])];
    return {
        id: 'w.sky', revision: 1,
        quantities: names.map(n => Q[n]), reads: names, writes: names,
        publishes: names.filter(n => n !== 'day').map(n => `sky.${n}`),
        laws: [{
            id: 'sky', appliesTo: h => h.kind === 'place' && h.tags.includes('sky'),
            horizon: view => nextChange(view.clock, d),
            decide: (view, id) => {
                const now = skyAt(view.clock, d), ops = [];
                for (const n of names) {
                    if (!view.has(id, n)) continue;
                    const was = view.amount(id, n);
                    if (was === now[n]) continue;
                    ops.push({op: 'set', holder: id, quantity: n, amount: now[n], source: 'w.sky'});
                    if (n !== 'day') ops.push({op: 'publish', kind: `sky.${n}`, place: id, detail: {from: was, to: now[n]}});
                }
                return ops;
            },
        }],
    };
}

/** Starting quantities for a sky place at `minute` (season only where the calendar has seasons). */
export function skyQuantities(minute, dials = {}) {
    const d = {...SKY_DEFAULTS, ...dials}, {season, ...rest} = skyAt(minute, d);
    return profileOf(d).seasons ? {...rest, season} : rest;
}

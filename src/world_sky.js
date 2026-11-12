// Sky and seasons as substrate (OS6): daylight, moon phase, rain and the day
// number are place quantities set by one W law from the root clock, so a moon
// window or a rainy day reaches every domain through the same reads. Defaults
// follow the native 13-day rain calendar (weather_calendar.js). Dials per world:
// dawn and dusk minute, moon cycle length in days, the rain source and the
// epoch (root minute 0 in the world's day count).
import {isRainingAtMinute} from './weather_calendar.js';
import {WORLD_QUANTITIES as Q} from './world_quantities.js';

const DAY = 1440;
export const SKY_DEFAULTS = Object.freeze({dawn: 360, dusk: 1200, moonCycleDays: 30, epoch: 0, rainAt: isRainingAtMinute});

export function skyAt(minute, dials = SKY_DEFAULTS) {
    const d = {...SKY_DEFAULTS, ...dials}, m = minute + d.epoch, day = Math.floor(m / DAY), within = m - day * DAY;
    const cycle = ((day % d.moonCycleDays) + d.moonCycleDays) % d.moonCycleDays;
    return {day, daylight: within >= d.dawn && within < d.dusk ? 1 : 0,
        moon_phase: Math.floor(cycle * 8 / d.moonCycleDays), rain: d.rainAt(m) ? 1 : 0};
}

// Minutes until the next dawn, dusk or midnight: the only boundaries where a sky value can change.
function nextChange(minute, d) {
    const m = minute + d.epoch, within = ((m % DAY) + DAY) % DAY;
    return Math.min(...[d.dawn, d.dusk, DAY].map(b => b > within ? b - within : Infinity));
}

export function createSkyPack(dials = {}) {
    const d = {...SKY_DEFAULTS, ...dials};
    if (!(Number.isSafeInteger(d.dawn) && Number.isSafeInteger(d.dusk) && 0 <= d.dawn && d.dawn < d.dusk && d.dusk <= DAY &&
        Number.isSafeInteger(d.moonCycleDays) && d.moonCycleDays >= 1 && typeof d.rainAt === 'function')) throw new Error('World sky: invalid dials.');
    const names = ['day', 'daylight', 'moon_phase', 'rain'];
    return {
        id: 'w.sky', revision: 0,
        quantities: names.map(n => Q[n]), reads: names, writes: names,
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

/** Starting quantities for a place under the sky at `minute`. */
export const skyQuantities = (minute, dials) => skyAt(minute, dials);

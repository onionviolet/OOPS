// W28 reversible prototype. Pure reads; no clocks, saves or live game bindings.
import {hashStreamSeed, mix32} from './seeded_streams.js';

const freeze = value => {
    if (value && typeof value === 'object') {
        Object.values(value).forEach(freeze);
        Object.freeze(value);
    }
    return value;
};
export const BASE_CLIMATE_PROFILE = freeze({
    id: 'base.frontier.climate', revision: 1, baseTemperature: 20,
    seasons: {Winter: -20, Spring: -5, Summer: 0, Autumn: -8},
    daily: {warmFrom: 14 / 24, coldFrom: 5 / 24, warm: 3, cold: -8},
    temperatureCycle: [0, -1, 0, -2, 3, 6, 1, -2, 0, -5, -1],
    rainCycle: [0, 0, 0, 0, -1, -2, -2, -2, 0, 0, 0, -1, 0],
    seededCycles: false, environment: 'outdoor',
});
// INFERRED numerical proposals, not canon climates or calendar definitions.
// Season IDs and daylight come from W33's calendarEnvironment, never this table.
export const PROPOSED_CLIMATE_PROFILES = freeze({
    highlandSchool: {
        ...BASE_CLIMATE_PROFILE, id: 'proposal.highland-school', revision: 1,
        qualification: 'proposal', baseTemperature: 13,
        seasons: {Winter: -10, Spring: -3, Summer: 2, Autumn: -5},
        seededCycles: true,
    },
    noSeasonDesert: {
        ...BASE_CLIMATE_PROFILE, id: 'proposal.no-season-desert', revision: 1,
        qualification: 'proposal', baseTemperature: 32, seasons: null,
        daily: {warmFrom: 14 / 24, coldFrom: 5 / 24, warm: 6, cold: -12},
        temperatureCycle: [0, 2, -1, 1, 0], rainCycle: [0], seededCycles: true,
    },
    sealedRealm: {
        ...BASE_CLIMATE_PROFILE, id: 'proposal.sealed-realm', revision: 1,
        qualification: 'proposal', baseTemperature: 18, seasons: null,
        environment: 'sealed', indoorTemperature: 18, indoorLight: 60,
    },
});
const requireValue = (ok, message) => { if (!ok) throw new Error(message); };
const finite = Number.isFinite;
const mod = (n, length) => ((n % length) + length) % length;

// Narrow legacy bridge. Keep it separate from W33's future calendar engine.
// day_count and date-day are deliberately distinct, as in Game_Time today.
export function legacyClimateEnvironment(time) {
    requireValue(Number.isSafeInteger(time.day_count) && time.day_count >= 0 &&
        Number.isInteger(time.month) && time.month >= 1 && time.month <= 12 &&
        Number.isInteger(time.hour) && time.hour >= 0 && time.hour < 24 &&
        Number.isInteger(time.minute) && time.minute >= 0 && time.minute < 60,
        'Invalid legacy climate time.');
    const minute = time.hour * 60 + time.minute;
    const fromEnd = minute - 4 * 60 + 30;
    const toStart = 20 * 60 - minute + 30;
    const light = fromEnd > 0 && fromEnd < 60 ? fromEnd :
        toStart > 0 && toStart < 60 ? toStart : time.hour >= 20 ? 0 : time.hour >= 4 ? 60 : 0;
    return {
        absoluteLocalDay: time.day_count, dayFraction: minute / 1440,
        seasonId: ['Spring', 'Summer', 'Autumn', 'Winter'][Math.floor((time.month - 1) / 3)],
        seasonPhase: null, daylight: light / 60,
    };
}

/**
 * clock: existing policy envelope {id, kind, value:{elapsed, unit, absence},
 * policy, environment: calendarEnvironment(...)}. Only the owner-projected
 * environment is read. No rate/absence advancement is performed here.
 * A legacy Game_Time-shaped object is accepted only for the base profile.
 * daylight is a normalized 0..1 light fraction, or null when unknown.
 */
export function deriveWorldClimate(profile = BASE_CLIMATE_PROFILE, place = {}, clock, seed = 0) {
    requireValue(profile && typeof profile.id === 'string' && profile.id.length > 0 &&
        Number.isSafeInteger(profile.revision) && profile.revision > 0 && finite(profile.baseTemperature),
        'Invalid climate profile.');
    requireValue(Number.isInteger(seed) && seed >= 0 && seed <= 0xffffffff, 'Invalid climate seed.');
    const env = clock?.environment ?? (profile === BASE_CLIMATE_PROFILE ? legacyClimateEnvironment(clock ?? {}) : null);
    requireValue(env && Number.isSafeInteger(env.absoluteLocalDay) &&
        finite(env.dayFraction) && env.dayFraction >= 0 && env.dayFraction < 1 &&
        (env.daylight === null || (finite(env.daylight) && env.daylight >= 0 && env.daylight <= 1)),
        'Supply a calendar environment with local day, fraction and daylight.');
    const environment = place.environment ?? profile.environment ?? 'outdoor';
    requireValue(['outdoor', 'indoor', 'sealed'].includes(environment), 'Unknown place environment.');
    const sheltered = environment !== 'outdoor';
    const seasons = profile.seasons;
    const seasonId = seasons === null ? null : env.seasonId;
    const seasonal = seasons === null ? 0 : seasons?.[seasonId];
    requireValue(finite(seasonal), 'Unknown season for this climate profile.');
    const daily = profile.daily;
    requireValue(daily && [daily.warmFrom, daily.coldFrom].every(x => finite(x) && x >= 0 && x < 1) &&
        daily.coldFrom < daily.warmFrom && finite(daily.warm) && finite(daily.cold), 'Invalid daily climate curve.');
    const cycle = (values, channel) => {
        requireValue(Array.isArray(values) && values.length > 0 && values.every(finite), 'Invalid climate cycle.');
        // Pure shared hash/mix helpers, never ensureStreams/drawUnit or a cursor.
        const offset = profile.seededCycles ? mix32(hashStreamSeed(seed,
            JSON.stringify([profile.id, profile.revision, place.regionId ?? place.id ?? '', channel]))) % values.length : 0;
        return values[mod(mod(env.absoluteLocalDay, values.length) + offset, values.length)];
    };
    const rainModifier = cycle(profile.rainCycle, 'rain');
    const dailyModifier = env.dayFraction >= daily.warmFrom || env.dayFraction < daily.coldFrom ? daily.warm : daily.cold;
    const variation = seasonal + dailyModifier + cycle(profile.temperatureCycle, 'temperature') + rainModifier;
    const range = place.temperature_range_modifier ?? 1;
    const flat = place.temperature_modifier ?? 0;
    requireValue(finite(range) && finite(flat), 'Invalid place temperature modifiers.');
    const staticTemperature = place.is_temperature_static || sheltered;
    const temperature = staticTemperature ?
        (place.static_temperature ?? (sheltered ? profile.indoorTemperature : null) ?? profile.baseTemperature) :
        profile.baseTemperature + (flat + range * variation);
    let lightLevel = env.daylight === null ? null : 40 + env.daylight * 60;
    if (sheltered) lightLevel = place.lightLevel ?? profile.indoorLight ?? null;
    const dark = place.types?.find(t => t.type === 'dark');
    if (dark) lightLevel = ({1: 40, 2: 20, 3: 0})[dark.stage] ?? 100;
    requireValue(finite(temperature) && (lightLevel === null || (finite(lightLevel) && lightLevel >= 0 && lightLevel <= 100)),
        'Invalid local temperature or light.');
    return {
        profileId: profile.id, profileRevision: profile.revision,
        absoluteLocalDay: env.absoluteLocalDay, seasonId,
        seasonPhase: seasons === null ? null : env.seasonPhase ?? null,
        temperature, raining: !sheltered && rainModifier < 0,
        rainTemperatureModifier: sheltered ? 0 : rainModifier, lightLevel, environment,
    };
}

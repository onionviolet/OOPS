import {BASE_CLIMATE_PROFILE, deriveWorldClimate} from './world_climate.js';
import {calendarEnvironment} from './world_calendar.js';
// INFERRED display-only proposals. No sourced seasonal curve has been adopted.
export const VISITOR_CLIMATE_PROFILES = Object.freeze({
    'book.mol.cyoria': Object.freeze({...BASE_CLIMATE_PROFILE, id: 'proposal.mol.visitor', revision: 1,
        qualification: 'proposal', baseTemperature: 17, seasons: null, seededCycles: false, indoorTemperature: 18, indoorLight: 60}),
    'book.paradise.goa': Object.freeze({...BASE_CLIMATE_PROFILE, id: 'proposal.paradise.goa', revision: 1,
        qualification: 'proposal', baseTemperature: 28, seasons: null, seededCycles: false, indoorTemperature: 24, indoorLight: 60}),
});
export function worldWeatherWords(worldId, view, location = {}) {
    if (worldId === 'base.frontier') return null; // Existing smoothed home display stays exact.
    if (worldId === 'book.paradise.hub') return 'Weather unknown · Paradise hub';
    const profile = VISITOR_CLIMATE_PROFILES[worldId];
    if (!profile) return null;
    if (!view) return 'Local weather unavailable';
    const climate = deriveWorldClimate(profile, {id: location.id, environment: location.is_under_roof ? 'indoor' : 'outdoor'},
        {environment: calendarEnvironment(view)}, 0);
    const words = climate.environment === 'indoor' ? 'Sheltered' : climate.raining ? (climate.temperature <= 0 ? 'Snow' : 'Rain') : 'Dry';
    return `${words} · ${climate.temperature.toFixed(1)}°C · climate proposal`;
}
// PS33 (2026-11-14): the cold a life feels comes from its own world, not the native calendar. Fang Yuan froze indoors at the clan academy
// because the native cold conditions read the frontier's Winter and ignored the roof. Default (adjustable, AD56): the native world keeps its
// exact smoothed weather. Another world with a climate proposal and a calendar reads deriveWorldClimate for that place (a roof is indoor).
// A world with neither borrows the frontier's weather outdoors, and under a roof it is the frontier's indoor temperature (the sheltered
// rule). Dial: give a world its own profile in VISITOR_CLIMATE_PROFILES. `readView` is called only when it is needed.
export function lifeTemperature(worldId, readView, location = {}, nativeTemperature) {
    if (worldId === 'base.frontier') return nativeTemperature();
    const place = {id: location?.id, environment: location?.is_under_roof ? 'indoor' : 'outdoor'};
    const profile = VISITOR_CLIMATE_PROFILES[worldId], view = profile ? readView() : null;
    if (profile && view) return deriveWorldClimate(profile, place, {environment: calendarEnvironment(view)}, 0).temperature;
    return place.environment === 'indoor' ? (BASE_CLIMATE_PROFILE.indoorTemperature ?? BASE_CLIMATE_PROFILE.baseTemperature) : nativeTemperature();
}

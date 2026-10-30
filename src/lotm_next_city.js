// LOTM's second city as a thin region pack (L11 slice 2, GM22/GM31). This file holds mechanism only: the validator and the loader.
// Names, prices and locators come from the private pack (private_packs/lotm-next-city/region.json), fetched if present like the cast
// supplement and never bundled (sealed-secret and source rules). No host wiring: the integrator registers the supplement path and reads
// nextCity() through readRegion/quoteRoute.
import {defineRegion} from './region_kit.js';
import {defineRoute} from './travel_legs.js';
import {defineGathering} from './gatherings.js';
import {deepFreeze, object} from './basics.js';
export const NEXT_CITY_SUPPLEMENT = 'lotm-next-city/region.json';
// One entry per city on the lead's path, in order (L11). Each is a private supplement with the same row shape.
export const CITY_SUPPLEMENTS = Object.freeze([NEXT_CITY_SUPPLEMENT, 'lotm-baiyam/region.json', 'lotm-afternoon-town/region.json']);
export function buildNextCity(pack) {
    if(!object(pack) || pack.schema !== 1 || !object(pack.region) || !object(pack.route)) return null;
    try {
        const strip = row => {const {locator, evidence, minutesEvidence, hoursEvidence, fareEvidence, hoursLocator, minutesBasis, ...rest} = row; return rest;};
        const region = {...pack.region, arrival: strip(pack.region.arrival), places: pack.region.places.map(strip), customs: (pack.region.customs || []).map(strip),
            institutions: pack.region.institutions.map(i => ({...strip(i), services: i.services.map(strip)})),
            offices: pack.region.offices.map(strip), errands: pack.region.errands.map(strip), prices: pack.region.prices.map(strip)};
        const route = {...pack.route, legs: pack.route.legs.map(l => ({...strip(l), ...(l.hazards ? {hazards: l.hazards.map(strip)} : {})}))};
        const provenance = Object.fromEntries([pack.region.arrival, ...pack.region.places, ...pack.region.institutions, ...pack.region.offices,
            ...pack.region.errands, ...pack.region.prices, ...pack.route.legs, ...pack.route.legs.flatMap(l => l.hazards || [])].map(r => [r.id, {evidence: r.evidence || null, locator: r.locator || null, ...(r.minutesEvidence ? {minutesEvidence: r.minutesEvidence} : {}), ...(r.hoursEvidence ? {hoursEvidence: r.hoursEvidence} : {}), ...(r.fareEvidence ? {fareEvidence: r.fareEvidence} : {}), ...(r.hoursLocator ? {hoursLocator: r.hoursLocator} : {}), ...(r.minutesBasis ? {minutesBasis: r.minutesBasis} : {})}]));
        const g = pack.gathering ? (({locator, evidence, scheduleNote, ...rest}) => defineGathering(rest))(pack.gathering) : null;
        return deepFreeze({region: defineRegion(region), route: defineRoute(route), gathering: g, provenance});
    } catch { return null; }
}
export const loadNextCity = (fetchFile = globalThis.fetch) => loadCity(NEXT_CITY_SUPPLEMENT, fetchFile);
/** Load every listed city pack that the manifest names and that validates; absent ones are skipped. */
export async function loadCities(fetchFile = globalThis.fetch) {
    const cities = await Promise.all(CITY_SUPPLEMENTS.map(path => loadCity(path, fetchFile)));
    return cities.filter(Boolean);
}
export async function loadCity(path, fetchFile = globalThis.fetch) {
    try {
        const manifest = await fetchFile('private_packs/manifest.json');
        if(!manifest.ok) return null;
        const data = await manifest.json();
        if(data.schema !== 1 || !data.supplements?.includes(path)) return null;
        const file = await fetchFile('private_packs/' + path);
        return file.ok ? buildNextCity(await file.json()) : null;
    } catch { return null; }
}

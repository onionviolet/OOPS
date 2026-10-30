// LOTM's second city as a thin region pack (L11 slice 2, GM22/GM31). This file holds mechanism only: the validator and the loader.
// Names, prices and locators come from the private pack (private_packs/lotm-next-city/region.json), fetched if present like the cast
// supplement and never bundled (sealed-secret and source rules). No host wiring: the integrator registers the supplement path and reads
// nextCity() through readRegion/quoteRoute. Pound sums in pence (12 pence to a soli, 20 soli to a pound is the pack's own unit row).
import {defineRegion} from './region_kit.js';
import {defineRoute} from './travel_legs.js';
import {deepFreeze, object} from './basics.js';
export const NEXT_CITY_SUPPLEMENT = 'lotm-next-city/region.json';
export function buildNextCity(pack) {
    if(!object(pack) || pack.schema !== 1 || !object(pack.region) || !object(pack.route)) return null;
    try {
        const strip = row => {const {locator, evidence, minutesEvidence, ...rest} = row; return rest;};
        const region = {...pack.region, arrival: strip(pack.region.arrival), places: pack.region.places.map(strip), customs: (pack.region.customs || []).map(strip),
            institutions: pack.region.institutions.map(i => ({...strip(i), services: i.services.map(strip)})),
            offices: pack.region.offices.map(strip), errands: pack.region.errands.map(strip), prices: pack.region.prices.map(strip)};
        const route = {...pack.route, legs: pack.route.legs.map(strip)};
        const provenance = Object.fromEntries([pack.region.arrival, ...pack.region.places, ...pack.region.institutions, ...pack.region.offices,
            ...pack.region.errands, ...pack.region.prices, ...pack.route.legs].map(r => [r.id, {evidence: r.evidence || null, locator: r.locator || null, ...(r.minutesEvidence ? {minutesEvidence: r.minutesEvidence} : {})}]));
        return deepFreeze({region: defineRegion(region), route: defineRoute(route), provenance});
    } catch { return null; }
}
export async function loadNextCity(fetchFile = globalThis.fetch) {
    try {
        const manifest = await fetchFile('private_packs/manifest.json');
        if(!manifest.ok) return null;
        const data = await manifest.json();
        if(data.schema !== 1 || !data.supplements?.includes(NEXT_CITY_SUPPLEMENT)) return null;
        const file = await fetchFile('private_packs/' + NEXT_CITY_SUPPLEMENT);
        return file.ok ? buildNextCity(await file.json()) : null;
    } catch { return null; }
}

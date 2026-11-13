// A wild sheep can take a meal from forage stock carried by its place.
import {SATIETY} from '../world_substrate_packs/living_body.js';
import {WORLD_QUANTITIES} from '../world_quantities.js';

export const MEADOW_FORAGE = 'stock:meadow-forage';
export const GRAZING_HOME = 'meadow-grazing-home';
export const GRAZING_RANGE = 'meadow-grazing-range';
const forageCapacity = 'meadow-forage-capacity';
const stocked = (view, place) => view.has(place, MEADOW_FORAGE) && view.amount(place, MEADOW_FORAGE) > 0;

function grazingOps(view, id) {
    const place = view.placeOf(id), home = view.property(id, GRAZING_HOME);
    const fed = view.amount(id, 'satiety') > 0;
    if (!fed && stocked(view, place)) return [
        {op: 'add', holder: place, quantity: MEADOW_FORAGE, amount: -1},
        {op: 'add', holder: id, quantity: 'satiety', amount: 4},
    ];
    if (!home || (place === home && fed)) return [];
    const options = {kinds: ['grazing-path'], maxLinks: view.property(id, GRAZING_RANGE) ?? 1};
    const exits = view.exits(place, options);
    const homeward = place === home ? null : view.distance(place, home, options);
    const withinHome = place === home ? null : new Set(view.within(home, options).map(way => way.place));
    // Keep a way home. Reread routes and forage at each step so a closure or
    // another grazer taking the last meal changes the next decision.
    const patch = fed ? null : view.within(place, options)
        .filter(way => way.links > 0 && (!withinHome || withinHome.has(way.place)) &&
            stocked(view, way.place) && view.distance(way.place, home, options))
        .sort((a, b) => a.cost - b.cost || a.links - b.links)[0];
    const nextLink = (patch ?? homeward)?.route[0];
    const exit = exits.find(way => way.link === nextLink);
    return exit ? [{op: 'move', holder: id, to: exit.to}] : [];
}
const regrowth = (view, id) => {
    if (!view.has(id, 'season')) return 0;
    const season = view.amount(id, 'season');
    return season === 0 ? 2 : season === 1 ? 1 : 0;
};
export const MEADOW_GRAZING_PACK = {
    id: 'l.meadow_grazing', revision: 1,
    quantities: [WORLD_QUANTITIES.stock, WORLD_QUANTITIES.season, SATIETY],
    properties: [{id: forageCapacity, type: 'level', min: 0, max: WORLD_QUANTITIES.stock.max},
        {id: GRAZING_HOME, type: 'label'},
        {id: GRAZING_RANGE, type: 'level', min: 1, max: Number.MAX_SAFE_INTEGER}],
    reads: ['stock', 'satiety', 'season', forageCapacity, GRAZING_HOME, GRAZING_RANGE], writes: ['stock', 'satiety'],
    laws: [{
        id: 'regrow',
        appliesTo: place => place.kind === 'place' && Object.hasOwn(place.quantities, MEADOW_FORAGE) &&
            place.properties[forageCapacity] > 0,
        horizon(view, id) {
            const room = view.property(id, forageCapacity) - view.amount(id, MEADOW_FORAGE);
            // Hungry grazers can eat as soon as the first growth lands.
            return room > 0 && regrowth(view, id) > 0 && view.amount(id, MEADOW_FORAGE) === 0 ? 1 : Infinity;
        },
        advance(view, id, elapsed) {
            const room = view.property(id, forageCapacity) - view.amount(id, MEADOW_FORAGE);
            const amount = Math.min(room, elapsed * regrowth(view, id));
            return amount > 0 ? [{op: 'add', holder: id, quantity: MEADOW_FORAGE, amount}] : [];
        },
    }, {
        id: 'graze',
        appliesTo: body => body.kind === 'body' && body.tags.includes('living.body') &&
            body.tags.includes('meadow-grazer') && body.properties.alive !== false &&
            Object.hasOwn(body.quantities, 'satiety'),
        horizon: (view, id) => grazingOps(view, id).length ? 1 : Infinity,
        watches: (_view, id) => [{holder: id, quantity: 'satiety', op: 'lte', value: 0}],
        decide: grazingOps,
    }],
};

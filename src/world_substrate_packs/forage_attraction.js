// L reads a local forage gradient. The world supplies diet profiles and
// directed, traversable connections. W owns location, time and arrival effects.
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from '../world_quantities.js';

export const FORAGE_ATTRACTION = 'l.forage_attraction';
const DIET = 'forage_light';
const validId = value => typeof value === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(value);
const wholePositive = value => Number.isSafeInteger(value) && value > 0;

// E10: exits come from the world's links of `linkKinds` (default path). `connections` is the
// older pack-level list; it is read as one-way links of the first kind through the same reader,
// so a world can declare its ways once as links and pass no connections.
export function createForageAttractionPack({profiles, connections = [], maxNeighbors, linkKinds = ['path']}) {
    if (!wholePositive(maxNeighbors)) throw new Error('Forage attraction needs a positive neighbor budget.');
    const diets = new Map();
    for (const {light, minimum, interval} of profiles) {
        if (typeof light !== 'string' || !/^light:[a-zA-Z0-9][a-zA-Z0-9_.-]*$/.test(light) ||
            !wholePositive(minimum) || minimum > WORLD_QUANTITIES.light.max || !wholePositive(interval) || diets.has(light)) {
            throw new Error('Forage attraction needs unique keyed light profiles with a minimum grade and whole-minute interval.');
        }
        diets.set(light, {light, minimum, interval});
    }

    const neighbors = new Map(), own = [];
    for (const {from, to, open} of connections) {
        if (!validId(from) || !validId(to) || from === to || typeof open !== 'boolean') {
            throw new Error('Forage attraction needs directed connections with explicit access.');
        }
        own.push({id: `own.${own.length}`, kind: linkKinds[0], from, to, oneWay: true, state: open ? 'open' : 'closed'});
        if (!open) continue;
        const exits = neighbors.get(from) ?? new Set();
        exits.add(to);
        if (exits.size > maxNeighbors) throw new Error(`Forage attraction neighbor budget exceeded at ${from}.`);
        neighbors.set(from, exits);
    }
    // The budget is how many exits a forager weighs. Past it, world links are taken in place-id order.
    const exitsFrom = (view, from) => view.neighbours(from, {kinds: linkKinds, also: own}).slice(0, maxNeighbors);

    const lightAt = (view, place, light) => view.has(place, light) ? view.amount(place, light) : 0;
    return {
        id: FORAGE_ATTRACTION, revision: 0,
        quantities: [WORLD_QUANTITIES.light],
        properties: [WORLD_PROPERTIES.alive, {id: DIET, type: 'label'}],
        reads: ['light', 'alive', DIET],
        laws: [{
            id: 'follow-light',
            // Whether the place has an exit is the world's to say (its links), so it is asked in decide.
            appliesTo: holder => holder.kind === 'body' && holder.properties.alive === true &&
                diets.has(holder.properties[DIET]),
            // Due minutes are absolute W clock boundaries. Caller cuts and
            // reloads cannot create an extra opportunity to move.
            horizon: (view, id) => {
                const {interval} = diets.get(view.property(id, DIET));
                return interval - view.clock % interval;
            },
            decide: (view, id) => {
                const {light, minimum, interval} = diets.get(view.property(id, DIET));
                if (view.clock % interval !== 0) return [];

                const from = view.placeOf(id);
                const here = lightAt(view, from, light);
                let to = null;
                let best = here;
                for (const place of exitsFrom(view, from)) {
                    if (view.holder(place)?.kind !== 'place') continue;
                    const grade = lightAt(view, place, light);
                    if (grade < minimum || grade <= here) continue;
                    if (grade > best || (grade === best && place < to)) {
                        to = place;
                        best = grade;
                    }
                }
                if (to === null) return [];
                return [
                    {op: 'state', holder: id, value: {lastMove: {at: view.clock, from, to, light, here, there: best, minimum}}},
                    {op: 'move', holder: id, to},
                ];
            },
        }],
    };
}

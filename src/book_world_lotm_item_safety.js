import {LOTM_IDS} from './book_world_lotm_ids.js';

export const OPERATION_SLOW = 'book.lotm.operation_slowed';
export const operationSlowCondition = Object.freeze({
    id: OPERATION_SLOW,
    revision: 1,
    label: 'Slowed by the item',
    stacking: 'max',
    absence: 'zero',
    bioVisible: true,
    bioDetail: 'Your thoughts and movements slow. A nearby companion can help when they notice the change.',
});

const custodyKey = 'operation.item.custody';
const modeKey = 'operation.item.mode';

// Read the native positions and conditions. Adjacent addresses can declare a
// measured separation for this operation without assigning coordinates to the world.
export function itemSafetyFacts(state, declaration) {
    if (!declaration) return {};
    const world = state.worlds?.[LOTM_IDS.world]?.facts || {};
    const people = state.simulation?.people || {};
    const roster = declaration.roster;
    const live = id => people[id]?.life === 'alive' && state.actors[id]?.worldId === LOTM_IDS.world;
    const watching = id => state.actors[id]?.facts?.['operation.item.watching'] === true;
    const slowed = id => (state.simulation?.conditions?.[id]?.[OPERATION_SLOW]?.intensity || 0) > 0;
    const custody = world[custodyKey];
    const itemPlace = roster.includes(custody)
        ? (live(custody) ? people[custody].location : null)
        : (declaration.setDownPlaces.includes(custody) ? custody : null);
    const mode = world[modeKey];
    const limit = Object.hasOwn(declaration.modes, mode) ? declaration.modes[mode] : 0;
    const distance = (a, b) => {
        if (!a || !b) return Infinity;
        if (a === b) return 0;
        return declaration.separations.find(edge =>
            (edge.from === a && edge.to === b) || (edge.from === b && edge.to === a)
        )?.meters ?? Infinity;
    };
    const inReach = id => live(id) && distance(people[id].location, itemPlace) <= declaration.range;
    const facts = {
        'itemSafety.slots': itemPlace ? Math.max(0, limit - roster.filter(id => inReach(id) && slowed(id)).length) : 0,
        'itemSafety.watchers': live('player') ? roster.filter(id => id !== 'player' && live(id)
            && people[id].location === people.player.location && watching(id) && !slowed(id)).length : 0,
        'itemSafety.playerClear': !!itemPlace && live('player')
            && distance(people.player.location, itemPlace) !== Infinity && !inReach('player'),
    };
    for (const id of roster) {
        facts[`itemSafety.exposed.${id}`] = inReach(id) && !slowed(id);
        for (const helper of roster) {
            if (helper === id) continue;
            facts[`itemSafety.aid.${helper}.${id}`] = live(helper) && live(id) && watching(helper) && !slowed(helper)
                && slowed(id) && people[helper].location === people[id].location;
        }
    }
    return facts;
}

export function validateItemSafety(declaration, people, places) {
    if (!declaration) return;
    const {roster, range, modes, setDownPlaces, separations} = declaration;
    const valid = Array.isArray(roster) && roster.length >= 2 && roster.length <= 12
        && new Set(roster).size === roster.length && roster.includes('player')
        && roster.every(id => id === 'player' || people.has(id))
        && Number.isFinite(range) && range > 0
        && modes && typeof modes === 'object' && !Array.isArray(modes) && Object.values(modes).length > 0
        && Object.values(modes).every(n => Number.isSafeInteger(n) && n >= 0 && n <= roster.length)
        && Array.isArray(setDownPlaces) && setDownPlaces.every(id => places.has(id))
        && Array.isArray(separations) && separations.every(({from,to,meters}) =>
            from !== to && places.has(from) && places.has(to) && Number.isFinite(meters) && meters > 0);
    if (!valid) throw Error('Invalid operation item safety declaration.');
}

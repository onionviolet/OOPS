// Wild creature populations per place (FRC19/FRC41, LVR22 richer rung, LVR1, LVR6, LVR23). Pure: no clock, no storage, no unkeyed randomness.
// Shape taken from table-driven populations (Caves of Qud's PopulationManager: chance, weight, number per entry); no numbers copied.
// A table says who lives at a place: {id, revision, places:[{id, name, creatures:[{id, name, weight, chance, number, cap, refillPerDay}]}]}
//   weight        share among the species present on a given day (which kind the next sighting is)
//   chance        permille that the species is about today at all (a keyed draw per place, species and day)
//   number        [lo, hi] animals in one sighting, never more than are left
//   cap           most that live here; refillPerDay  animals that return per played day
// The count left is a craft_sources node ({stock, updatedAt, carry}) so the refill is the one existing lazy projection (LVR1, LVR6):
// reading never rerolls or grants stock, many short reads equal one long read, and the clock is the caller's own played clock.
// Counted creatures stay pools. A creature that is named or relied on is a person record, not a count here.
import {nodeAt, nodeKey, MINUTES_PER_DAY} from './craft_sources.js';
import {address, drawU32, indexFromU32, pickWeighted} from './gen_kit.js';

const nat = n => Number.isSafeInteger(n) && n >= 0;
const pos = n => Number.isSafeInteger(n) && n > 0;
const fail = m => { throw new Error(m); };
const text = (v, l) => typeof v === 'string' && v.length ? v : fail(`${l} must be non-empty text.`);

export function defineCreatureTable(spec) {
    if(!pos(spec?.revision)) fail('Creature table revision must be a positive integer.');
    const places = {};
    for(const p of spec.places ?? []) {
        const id = text(p.id, 'Place id');
        if(places[id]) fail(`Duplicate place ${id}.`);
        const creatures = {};
        for(const c of p.creatures ?? []) {
            const cid = text(c.id, 'Creature id');
            if(creatures[cid]) fail(`Duplicate creature ${id}.${cid}.`);
            const number = c.number ?? [1, 1];
            if(!nat(c.weight) || !Number.isSafeInteger(c.chance) || c.chance < 0 || c.chance > 1000 || !pos(c.cap) || !nat(c.refillPerDay ?? 0) ||
                !pos(number[0]) || !Number.isSafeInteger(number[1]) || number[1] < number[0]) fail(`Invalid population row ${id}.${cid}.`);
            creatures[cid] = Object.freeze({id: cid, name: text(c.name, 'Creature name'), weight: c.weight, chance: c.chance, number: Object.freeze([...number]),
                cap: c.cap, capacity: c.cap, regenPerDay: c.refillPerDay ?? 0});
        }
        if(!Object.keys(creatures).length) fail(`Place ${id} needs creatures.`);
        places[id] = Object.freeze({id, name: p.name ?? id, creatures: Object.freeze(creatures)});
    }
    return Object.freeze({id: text(spec.id, 'Creature table id'), revision: spec.revision, places: Object.freeze(places)});
}

// State: {schema:1, nodes:{key:{stock, updatedAt, carry, harvests, misses}}}. A species never touched has no node and is at its cap (GR4 lazy),
// so an old save with no state starts every place full.
export const createPopulationState = () => ({schema: 1, nodes: {}});
const keyOf = (table, world, place, species) => nodeKey(world, place, species, table.id);
export function validatePopulationState(state, table, world) {
    if(!state || state.schema !== 1 || typeof state.nodes !== 'object' || Object.keys(state).length !== 2) fail('Invalid population state.');
    for(const [key, n] of Object.entries(state.nodes)) {
        const [w, , place, species] = key.split('/');
        const c = table.places[place]?.creatures[species];
        if(w !== world || !c || key !== keyOf(table, world, place, species)) fail(`Population node ${key} is not in the table.`);
        if(!nat(n.stock) || n.stock > c.cap || !nat(n.updatedAt) || !nat(n.carry ?? 0) || (n.carry ?? 0) >= MINUTES_PER_DAY || !nat(n.harvests) || !nat(n.misses)) fail(`Invalid population node ${key}.`);
    }
    return state;
}

const count = (table, state, world, place, c, at) => nodeAt(c, state.nodes[keyOf(table, world, place, c.id)], at);

// What is at a place now. Rows list every species with the count left (the honest number a hunter can ask about) and whether it is about today;
// `next` is the sighting a hunt would meet: one species by weight among those present, and how many.
export function populationAt(table, state, {root, world, place, at}) {
    const p = table.places[place] ?? fail(`Unknown place ${place}.`);
    const day = Math.floor(at / MINUTES_PER_DAY);
    const rows = Object.values(p.creatures).map(c => {
        const node = count(table, state, world, place, c, at);
        const about = indexFromU32(drawU32(root, address('creature.here', table.id, table.revision, world, place, c.id, {day})), 1000) < c.chance;
        const nextAt = node.stock < c.cap && c.regenPerDay ? at + Math.ceil((MINUTES_PER_DAY - (node.carry ?? 0)) / c.regenPerDay) : null;
        return {id: c.id, name: c.name, left: node.stock, cap: c.cap, about, present: about && node.stock > 0, nextAt};
    });
    const here = rows.filter(r => r.present);
    const key = address('creature.sight', table.id, table.revision, world, place, {day, killed: Object.values(p.creatures).reduce((n, c) => n + (state.nodes[keyOf(table, world, place, c.id)]?.harvests ?? 0), 0)});
    const pick = pickWeighted(here, r => ({weight: p.creatures[r.id].weight, reason: 'weight'}), drawU32(root, address(key, 'kind')));
    let next = null;
    if(pick.value) {
        const c = p.creatures[pick.value.id], [lo, hi] = c.number;
        next = {id: c.id, name: c.name, number: Math.min(pick.value.left, lo + indexFromU32(drawU32(root, address(key, 'number')), hi - lo + 1))};
    }
    return {place: p.name, rows, next, day, at};
}

// One kill (or `n` of them): returns the next state. The count falls and the node keeps the same refill clock, so a kill never resets or
// delays the return of the animals already on their way back.
export function recordKill(table, state, {world, place, species, n = 1, at}) {
    const c = table.places[place]?.creatures[species] ?? fail(`Unknown creature ${place}.${species}.`);
    const k = keyOf(table, world, place, species), node = count(table, state, world, place, c, at);
    if(!pos(n) || n > node.stock) fail('Nothing of that kind is left to take.');
    return {...state, nodes: {...state.nodes, [k]: {...node, stock: node.stock - n, harvests: node.harvests + n}}};
}

// A short player line for a place's state; the cost of an empty place and when it recovers (FLR3).
export function populationLine(view, species) {
    const r = view.rows.find(x => x.id === species);
    if(!r) return '';
    if(r.present) return `${r.name}: sign of ${r.left} about the ${view.place.toLowerCase()}.`;
    if(r.left > 0) return `No ${r.name.toLowerCase()} showing at the ${view.place.toLowerCase()} today; some are about and may come out another day.`;
    const days = r.nextAt == null ? null : Math.max(1, Math.ceil((r.nextAt - view.at) / MINUTES_PER_DAY));
    return days ? `The ${view.place.toLowerCase()} has been hunted out for now; ${r.name.toLowerCase()} should return in about ${days === 1 ? 'a day' : `${days} days`}.` : `The ${view.place.toLowerCase()} has been hunted out.`;
}

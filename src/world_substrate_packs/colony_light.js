// A colony's glow on the world substrate (proposal, AD32). A holder tagged
// `colony.light` that carries a member count gives light to the place it sits
// in: members times a grade that depends on whether the place is in daylight.
// Which count, which light and what grade arrive as profiles from the caller
// (PFP3); this file holds no world numbers and names no creature.
//
// The pack keeps what each colony has given so far and writes only the change,
// so other sources of the same light keep their own ledger lines. It answers a
// change in the count at the next decision and the sky's `sky.daylight` effect
// in the same minute. A place with no daylight reading counts as dark (a cave,
// a cellar). Default not handled yet: a colony carried to another place keeps
// its glow where it was. No other pack is imported (PFP10).
import {WORLD_QUANTITIES} from '../world_quantities.js';

export const COLONY_LIGHT = 'l.colony_light';
const TAG = 'colony.light';
const keyed = (family, name) => typeof name === 'string' && new RegExp(`^${family}:[a-zA-Z0-9][a-zA-Z0-9_.-]*$`).test(name);
const grade = n => Number.isSafeInteger(n) && n >= 0 && n <= WORLD_QUANTITIES.light.max;

/** profiles: [{members: 'stock:<kind>', light: 'light:<kind>', gradePerMember: {dark, daylit}}] */
export function createColonyLightPack({profiles = []} = {}) {
    const seen = new Set();
    for (const {members, light, gradePerMember} of profiles) {
        if (!keyed('stock', members) || !keyed('light', light) || seen.has(members) ||
            !grade(gradePerMember?.dark) || !grade(gradePerMember?.daylit)) {
            throw new Error('Colony light needs one profile per member stock, a keyed light and whole dark and daylit grades.');
        }
        seen.add(members);
    }
    const isColony = holder => holder.kind !== 'place' && holder.tags.includes(TAG);

    // The ops that bring this colony's share of its place's light to what its members give now.
    const settle = (view, id) => {
        const place = view.placeOf(id), state = view.state(id) ?? {given: {}};
        const daylit = view.has(place, 'daylight') && view.amount(place, 'daylight') === 1;
        const wanted = {};
        for (const {members, light, gradePerMember} of profiles) {
            if (!view.has(id, members) || !view.has(place, light)) continue;
            const glow = view.amount(id, members) * (daylit ? gradePerMember.daylit : gradePerMember.dark);
            wanted[light] = Math.min(WORLD_QUANTITIES.light.max, (wanted[light] ?? 0) + glow);
        }
        const ops = [];
        for (const light of [...new Set([...Object.keys(wanted), ...Object.keys(state.given)])].sort()) {
            const amount = (wanted[light] ?? 0) - (state.given[light] ?? 0);
            if (amount) ops.push({op: 'add', holder: place, quantity: light, amount});
        }
        return ops.length ? [...ops, {op: 'state', holder: id, value: {given: wanted}}] : [];
    };

    return {
        id: COLONY_LIGHT, revision: 0,
        quantities: [WORLD_QUANTITIES.light, WORLD_QUANTITIES.stock, WORLD_QUANTITIES.daylight],
        reads: ['light', 'stock', 'daylight'], writes: ['light'],
        hears: ['sky.daylight'],
        laws: [{id: 'glow', appliesTo: isColony, decide: settle}],
        reactors: [{id: 'sky-turn', on: ['sky.daylight'], appliesTo: isColony, react: settle}],
    };
}

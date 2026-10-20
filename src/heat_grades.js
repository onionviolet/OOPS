// Heat grade gate (GDP21, GDP26, GDP30): a fuel item carries an ordinal grade, a
// heat amount per unit and a burn rate; a recipe declares the lowest grade it
// needs and the heat it draws. Pure and read-only: a quote spends nothing (MR4)
// and the craft path re-quotes before it debits (AR7). Inventory stays the only
// fuel store (AR3); there is no heat reserve. Energy policies (energy_resources)
// are per-actor learned reserves, so they do not fit loose fuel items.
import {deepFreeze as freeze, natural} from './basics.js';

// Default scale and fuels for the base world. Grades are ordinal labels, never a
// temperature. Default: three grades. Reason: wood reaches soft work, a charcoal
// forge reaches iron, bellows-driven coal reaches what iron cannot (AD38: the
// fuel decides which reactions exist). A world may declare more, fewer or none.
export const HEAT_WORLDS = freeze({
    'base.frontier': {
        grades: ['open fire', 'forge fire', 'bellows heat'],
        // amount: heat units per item; burn: heat units per minute while it burns.
        // Log amount 2 matches the two uses the brass lung gets from one log.
        fuels: {'Rough wood log': {grade: 1, amount: 2, burn: 2}, 'Wood log': {grade: 1, amount: 3, burn: 2},
            'Charcoal': {grade: 2, amount: 4, burn: 2}, 'Coal': {grade: 3, amount: 4, burn: 4}},
    },
});
export const DEFAULT_HEAT_WORLD = 'base.frontier';
export const heatWorld = id => HEAT_WORLDS[id] || HEAT_WORLDS[DEFAULT_HEAT_WORLD];
export const isFuelId = (id, world = heatWorld()) => Object.hasOwn(world.fuels, id);

const gradeName = (world, grade) => `grade ${grade} (${world.grades[grade - 1] ?? 'unnamed'})`;
const ceilDiv = (a, b) => Math.ceil(a / b);

export function validateHeatWorld(world) {
    if(!Array.isArray(world?.grades) || !world.grades.length) throw new Error('A heat world needs a grade scale.');
    for(const [id, f] of Object.entries(world.fuels)) {
        if(!(natural(f.grade) && f.grade >= 1 && f.grade <= world.grades.length && natural(f.amount) && f.amount > 0 && natural(f.burn) && f.burn > 0)) {
            throw new Error(`Invalid fuel row: ${id}.`);
        }
    }
}

/**
 * Quote one heat requirement against held fuel.
 * @param {{minGrade:number, load:number}} heat recipe need: lowest grade, heat units per craft
 * @param {{id:string,count:number}[]} stacks held items (any items; non-fuel are ignored)
 * @param {{world?:object}} opts
 * @returns {{ok:boolean, reason:string, fuelId:?string, grade:number, unitsPerCraft:number, have:number, minutesPerCraft:number, note:string}}
 * Picks the lowest eligible grade, so a better fuel is not wasted on soft work.
 */
export function quoteHeat(heat, stacks, {world = heatWorld()} = {}) {
    if(!(natural(heat?.minGrade) && heat.minGrade >= 1 && natural(heat?.load) && heat.load > 0)) throw new Error('Invalid heat requirement.');
    const need = gradeName(world, heat.minGrade);
    const held = new Map();
    for(const s of stacks) if(isFuelId(s.id, world) && s.count > 0) held.set(s.id, (held.get(s.id) || 0) + s.count);
    const options = [...held].map(([id, have]) => ({id, have, ...world.fuels[id]}));
    const eligible = options.filter(o => o.grade >= heat.minGrade).sort((a, b) => a.grade - b.grade || (a.id < b.id ? -1 : 1));
    if(!eligible.length) {
        const best = options.sort((a, b) => b.grade - a.grade)[0];
        const reason = best ? `${best.id} only reaches ${gradeName(world, best.grade)}; this needs ${need}.` : `No fuel held; this needs ${need}.`;
        return {ok: false, reason, fuelId: null, grade: best?.grade ?? 0, unitsPerCraft: 1, have: 0, minutesPerCraft: 0, note: reason};
    }
    const pick = eligible[0], unitsPerCraft = ceilDiv(heat.load, pick.amount), minutesPerCraft = ceilDiv(heat.load, pick.burn);
    return {ok: true, reason: '', fuelId: pick.id, grade: pick.grade, unitsPerCraft, have: pick.have, minutesPerCraft,
        note: `${pick.id}, ${gradeName(world, pick.grade)}: ${unitsPerCraft} per craft, burns ${minutesPerCraft} min (needs ${need})`};
}

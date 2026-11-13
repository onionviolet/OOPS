// Kept Gu work orders (CPR15 first caller, FRC55; proposal under AD32, AD56). Pure content: the keeper pack calls these inside
// its per-Gu loop with its own rule helpers, so the order reads the same gate as the hand verb `work_<slot>`. No pack import
// (the pack imports this file). Orders and places are authored for an original keeper life, not canon tables: the Gu house has
// one location, so a place is a named spot of it (the orchid beds, the steward's cellar, the store shelf).
// Leave and come back (CPR18): `return_<slot>` gives a Gu back to the steward, so the claim, control and the tie end; its opinion
// of you stays in its thought rows. `retake_<slot>` takes the same Gu back for 1 essence (no price: you already paid the clan).
import {defineWorkOrder, compileWorkOrder} from './companion_work.js';

// Per Gu: one order. Output: tend puts petals in the Moonlight Gu's own larder (its home), the others earn the steward's pay.
// The Moonlight Gu is the one that can be refined, so it is the one with a mind and an opinion of you (`minded`).
export const GU_ORDERS = Object.freeze({
    moon: {kind: 'tend', place: {id: 'orchid_beds', label: 'the Moon Orchid beds behind the Gu house'}, essence: 1, minded: true,
        output: [{to: 'home', food: 'petals', label: 'Moon Orchid petals', count: 2}],
        why: 'A Moonlight Gu settles among the orchids it eats; the petals it brings in go to its own larder, not your bag.'},
    worm: {kind: 'fetch', place: {id: 'cellar', label: 'the steward’s spirit cellar'}, essence: 1,
        output: [{to: 'keeper', food: 'stone', label: 'primeval stone', count: 1}],
        why: 'The steward pays for jars carried and sniffed for spoilage, the same as the hand work.'},
    jade: {kind: 'guard', place: {id: 'store_shelf', label: 'the clan store shelf'}, essence: 1,
        output: [{to: 'keeper', food: 'stone', label: 'primeval stones', count: 2}],
        why: 'A White Jade Gu’s hard shell sits over the stores; the steward pays its watch like the hand work.'}
});
export const orderFactFor = (ids, slot) => ids(`order_${slot}`);
export const guWorkOrder = (g, {ids, keys, interval}) => {
    const o = GU_ORDERS[g.slot];
    return o ? defineWorkOrder({id: `${g.slot}_${o.kind}`, kind: o.kind, being: ids(g.slot), beingLabel: g.label, place: {id: ids(o.place.id), label: o.place.label}, interval,
        essence: o.essence, minded: !!o.minded && !!g.refinedMeal, why: o.why, output: o.output.map(x => ({to: x.to, key: keys(x.food), label: x.label, count: x.count}))}) : null;
};

// Rows for one Gu. h: the pack's helpers {ids, keys, worldId, location, interval, energy, note, gate, assignGate, flag, item, steward, ready, faculty}.
export function guWorkRows(g, h) {
    const order = guWorkOrder(g, h);
    const commands = [], events = [];
    if(order) {
        const c = compileWorkOrder(order, {worldId: h.worldId, location: h.location, ids: h.ids, orderFact: orderFactFor(h.ids, g.slot), workedFlag: h.ids(`${g.slot}_kept.worked`),
            // Sorts after the Gu's own care rows (a_reset, b_death, c_meal, d_hunger) at a shared boundary: it eats, then it works.
            eventId: band => h.ids(`care.${g.slot}.e_order_${order.kind}_${band}`), gate: h.gate, assignGate: h.assignGate, energy: h.energy, note: h.note});
        commands.push(...c.commands); events.push(...c.events);
    }
    const title = h.ids(`${g.slot}_title`), returned = h.ids(`${g.slot}_returned`), gu = h.ids(g.slot);
    const eq = (fact, value) => ({fact, op: 'eq', value}), all = (...r) => ({all: r.filter(Boolean)});
    const base = {group: 'structured_local', worldId: h.worldId, actorId: 'player', location: h.location, audience: ['$actor'], targetId: gu, coLocated: true, participants: ['$target', h.steward], costs: []};
    commands.push({...base, id: h.ids(`return_${g.slot}`), revision: 1, label: `Give the ${g.label} back to the clan steward`,
        requires: {...all(h.ready, eq(`claim.${title}.owner`, 'player'), eq('target.life', 'alive')), reason: 'Only a living Gu in your care can be given back.'},
        description: `The steward takes the ${g.label} back into the clan house: it stops eating from your food, its orders end and its tie to you lapses. What it thinks of you, it keeps.`,
        effects: [{type: 'transfer', from: 'player', to: h.steward, key: h.keys(g.slot + '_gu'), count: 1}, {type: 'claim', actor: 'player', key: title, operation: 'transfer', target: h.steward},
            {type: 'body', actor: gu, key: 'controllerId', value: gu}, h.flag(g.slot + '_kept', false, gu), h.flag(g.slot + '_returned', true), h.flag('auto_' + g.slot, false),
            {type: 'fact', scope: 'actor', key: orderFactFor(h.ids, g.slot), value: 'none'}, h.note(`You gave the ${g.label} back to the steward.`)]});
    commands.push({...base, id: h.ids(`retake_${g.slot}`), revision: 1, label: `Take the ${g.label} back from the steward · 1 essence`,
        requires: {...all(h.ready, h.faculty, eq(`actor.${returned}`, true), eq(`claim.${title}.owner`, h.steward), eq('target.life', 'alive'), {fact: `energy.${h.energy}.reserve`, op: 'gte', value: 1}), reason: 'Only a Gu you gave back, still alive in the clan house, and 1 essence.'},
        description: `Refine the same ${g.label} back to your control. You already paid the clan for it. It remembers how you treated it before.`,
        costs: [{type: 'energy', energyId: h.energy, operation: 'use', output: 1, control: 1}],
        effects: [{type: 'transfer', from: h.steward, to: 'player', key: h.keys(g.slot + '_gu'), count: 1}, {type: 'claim', actor: h.steward, key: title, operation: 'transfer', target: 'player'},
            {type: 'body', actor: gu, key: 'controllerId', value: 'player'}, h.flag(g.slot + '_kept', true, gu), h.flag(g.slot + '_returned', false), h.note(`The ${g.label} is back in your care.`)]});
    return {commands, events};
}

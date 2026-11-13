// PC95. Chapter 536 establishes the operator count, Gu ranks and combined
// body. The constituent identities, cost, duration and force are authored.
import {defineWorkingLaw} from '../kernel_working.js';
import {resolveThreeHeadsSixArms} from '../gu_coordination.js';
import {guWorldUseReason} from '../gu_world_use.js';

const quantity = 'energy:primeval.formation';
const formation = 'gu.three-heads';
const effort = 'gu.six-arms.effort';
const people = ['lead', 'left', 'right'];
const slots = Array.from({length: 18}, (_, index) => 'gu' + (index + 1));
const roles = {...Object.fromEntries(people.map(role => [role, 'operator'])),
    ...Object.fromEntries(slots.map(role => [role, 'gu']))};
const effortRoles = {lead: 'operator', load: 'load'};
const reject = reason => ({ok: false, reason});

function combine({bound, at, address}) {
    const operators = people.map(role => bound[role]);
    const place = operators[0].place;
    if (!place || new Set(operators.map(row => row.holder)).size !== people.length ||
        operators.some(row => !row.holder || row.place !== place || row.properties?.alive !== true ||
            row.properties.gu_coordination_ready !== true)) return reject('Three willing operators must be present.');
    const reserves = Object.fromEntries(operators.map(row => [row.holder, {primeval: row.quantities[quantity] ?? 0}]));
    const specimens = slots.map(role => bound[role]);
    if (new Set(specimens.map(row => row.holder)).size !== slots.length) return reject('Bind a different Gu in each slot.');
    const stages = [];
    for (const body of specimens) {
        const p = body.properties;
        const operator = operators.find(row => row.id === p?.gu_keeper && row.id === p.gu_controller);
        if (!operator || !body.holder || guWorldUseReason(body, operator.id, place, at)) {
            return reject('A Gu has lost its operator or is committed elsewhere.');
        }
        if (!Number.isSafeInteger(p.gu_rank) || p.gu_rank < 3 || p.gu_rank > 5) return reject('Every Gu needs rank three through five.');
        stages.push({operator: operator.holder, ability: {fuel: 'primeval', cost: 2},
            gu: {id: body.holder, rank: p.gu_rank, alive: p.alive === true, injured: p.injured,
                fedThrough: body.quantities.satiety > 0 ? at : at - 1}});
    }
    if (new Set(stages.map(row => row.operator)).size !== operators.length) return reject('Every operator must contribute Gu.');
    const result = resolveThreeHeadsSixArms({stages, reserves, day: at});
    if (result.outcome !== 'complete') return reject(result.reason);
    const body = result.effects[0];
    return {ok: true, observed: body, costs: body.participants.map(payer =>
        ({quantity, payer, amount: reserves[payer].primeval - result.remaining[payer].primeval})),
    effects: [{op: 'law_add', field: {id: 'six-arms.' + address.replaceAll('/', '.'), kind: formation,
        scope: bound.lead.holder, until: at + 4,
        params: {participants: body.participants, heads: body.heads, arms: body.arms}}}]};
}

const operations = {
    combine: {roles, minutes: 2, settle: combine},
    lift: {roles: effortRoles, minutes: 1, settle({bound: {lead, load}}) {
        if (!lead.holder || !load.holder || lead.place !== load.place) return reject('The load is out of reach.');
        return {ok: true, effects: [{op: 'publish', kind: effort, place: lead.place, by: lead.holder,
            detail: {target: load.holder}}]};
    }},
};

export const GU_THREE_HEADS_LAW = defineWorkingLaw({id: 'gu.three-heads', revision: 1, operations});
export function threeHeadsWorking(operation) {
    if (!Object.hasOwn(operations, operation)) throw Error('Unknown coordination action.');
    const {roles, minutes} = operations[operation];
    return {id: 'gu.three-heads.' + operation, revision: 1, law: GU_THREE_HEADS_LAW.ref, roles,
        steps: [{op: operation, minutes, bindings: Object.fromEntries(Object.keys(roles).map(role => [role, role]))}]};
}

export const guThreeHeadsPack = {
    id: 'g.three-heads', revision: 1,
    properties: [{id: 'gu_coordination_ready', type: 'flag'}, {id: 'gu_load_threshold', type: 'level', min: 1}],
    reads: ['alive', 'gu_coordination_ready', 'gu_load_threshold', 'stock'], writes: ['stock'],
    publishes: [effort], hears: [effort, 'departed', 'arrived'],
    reactors: [{
        id: 'combined-effort', on: [effort], appliesTo: holder => 'gu_load_threshold' in holder.properties,
        react(view, id, event) {
            if (id !== event.detail?.target || !view.has(id, 'stock:lifted') || view.amount(id, 'stock:lifted')) return [];
            const body = view.lawFields(event.by, formation).find(field => field.scope === event.by &&
                field.params.participants.every(member => view.placeOf(member) === event.place &&
                    view.property(member, 'alive') === true && view.property(member, 'gu_coordination_ready') === true));
            const arms = body?.params.arms ?? 2;
            return arms >= view.property(id, 'gu_load_threshold')
                ? [{op: 'add', holder: id, quantity: 'stock:lifted', amount: 1}] : [];
        },
    }, {
        id: 'separation', on: ['departed', 'arrived'], appliesTo: holder => holder.as.includes('operator'),
        react(view, id, event) {
            return view.lawFields(id, formation).filter(field => field.scope === id && field.params.participants.includes(event.by))
                .map(field => ({op: 'law_remove', id: field.id}));
        },
    }],
};

// PC95, ch. 1396. Reuse the Keeper's stages and role-bound backlash.
// The support identities, costs, and control disturbance are fixture dials.
import {defineWorkingLaw} from '../kernel_working.js';
import {fightCharge, spiritRecipe} from '../gu_fighting_spirit.js';
import {runGuProcedure} from '../gu_procedures.js';

const funds = {primeval: 'energy:primeval.spirit', immortal: 'energy:immortal.red-date'};
const soul = 'energy:soul-steadiness';
const spirit = 'gu_fighting_spirit';
const allRoles = {operator: 'operator', thought: 'gu', will: 'gu', fight: 'gu'};
const prepareRoles = {operator: 'operator', thought: 'gu', will: 'gu'};
const releaseMinutes = 2;
const reject = reason => ({ok: false, reason});
const add = (holder, quantity, amount) => ({op: 'add', holder, quantity, amount});

export const GU_SPIRIT_WORLD_PROPERTIES = [
    {id: 'gu_spirit_control', type: 'flag'},
    {id: 'gu_spirit_preparation', type: 'label'},
    {id: 'gu_spirit_prepared_until', type: 'level', min: 0},
];
export const GU_SPIRIT_WORLD_QUANTITIES = [{id: spirit, unit: 'resolve', min: 0, max: 1}];

function owned(body, operator, at) {
    const p = body.properties;
    return body.holder && body.place === operator.place && p?.alive === true &&
        p.gu_keeper === operator.id && p.gu_controller === operator.id &&
        !p.gu_installed_in && !(p.gu_furnace_job && p.gu_furnace_until >= at);
}

function settleBeat({bound, facts, at, address}, index) {
    const {operator} = bound;
    const caster = operator.holder;
    if (!caster || !operator.place) return reject('The operator is unavailable.');
    const job = address.split('/')[0];
    const supports = spiritRecipe.beats[0].roles.map(role => bound[role]);
    const lock = (value, until) => supports.flatMap(({holder}) => [
        {op: 'property', holder, property: 'gu_spirit_preparation', value},
        {op: 'property', holder, property: 'gu_spirit_prepared_until', value: until},
    ]);
    if (!index && supports.some(({properties}) => properties?.gu_spirit_prepared_until >= at &&
        properties.gu_spirit_preparation)) return reject('A support is already preparing another working.');
    if (index && (facts.preparedAt !== at - releaseMinutes || facts.place !== operator.place ||
        !spiritRecipe.beats[0].roles.every(role => facts.supports?.[role] === bound[role].holder &&
            owned(bound[role], operator, at) && bound[role].properties.gu_spirit_preparation === job &&
            !bound[role].properties.injured && bound[role].quantities.satiety > 0))) {
        return reject('The prepared supports are no longer available.');
    }
    if (index && (!(soul in operator.quantities) || !(spirit in operator.quantities) ||
        !Object.hasOwn(operator.properties, 'mind_awake'))) return reject('The operator cannot channel this technique.');
    const beat = spiritRecipe.beats[index];
    const roles = spiritRecipe.roles.filter(role => beat.roles.includes(role.id));
    const available = [];
    for (const role of roles) {
        const body = bound[role.id];
        if (!owned(body, operator, at)) return reject('A bound Gu is unavailable.');
        const core = role.id === 'fight';
        available.push({operator: caster, gu: {id: body.holder, kind: body.properties.gu_kind,
            rank: body.properties.gu_rank, injured: body.properties.injured,
            fedThrough: body.quantities.satiety > 0 ? at : at - 1},
        ability: core ? {fuel: 'immortal', cost: fightCharge} : {fuel: 'primeval', cost: 1}});
    }
    const binding = Object.fromEntries(spiritRecipe.roles.filter(role => bound[role.id])
        .map(role => [role.id, {id: bound[role.id].holder, operator: caster}]));
    if (new Set(Object.values(binding).map(row => row.id)).size !== Object.keys(binding).length) {
        return reject('Bind distinct Gu to the working.');
    }
    const recipe = {roles, beats: [beat], ...(index && {completion: spiritRecipe.completion})};
    const reserves = {[caster]: Object.fromEntries(Object.entries(funds).map(([kind, key]) => [kind, operator.quantities[key] ?? 0]))};
    const result = runGuProcedure({recipe, binding, available, reserves, day: at,
        ...(index && operator.properties.gu_spirit_control !== true && {controlFailedAt: 0})});
    if (result.outcome !== 'complete' && !result.backlash) return reject(result.reason);
    const costs = result.activations.map(({fuel, cost}) => ({quantity: funds[fuel], payer: caster, amount: cost}));
    if (!index) return {ok: true, costs, facts: {preparedAt: at, place: operator.place,
        supports: Object.fromEntries(Object.entries(binding).map(([role, {id}]) => [role, id]))},
    effects: lock(job, at + releaseMinutes), observed: {outcome: 'prepared'}};
    if (result.backlash) {
        const effects = result.backlash.map(row => {
            if (row.kind === 'destroy-gu') return {op: 'lifecycle', act: 'end', holder: row.target};
            if (row.aspect === 'soul') return add(row.target, soul, -row.amount);
            return {sentence: {verb: 'add', object: 'mind', target: 'bound', time: 'instant',
                carrier: 'gu', cost: 'none', limits: []}, details: {target: {shape: 'holder', id: row.target},
                place: operator.place, mind: {faculty: 'pain', amount: row.amount}}};
        });
        return {ok: true, costs, effects, observed: {outcome: 'backlash', lost: result.backlash.filter(row =>
            row.kind === 'destroy-gu').map(row => row.target)}};
    }
    return {ok: true, costs, effects: [...lock(null, null), add(caster, spirit, 1)], observed: {outcome: result.effects[0].kind}};
}

const rallyRoles = {operator: 'operator', site: 'place'};
const operations = {
    prepare: {roles: prepareRoles, minutes: 1, settle: input => settleBeat(input, 0)},
    release: {roles: allRoles, minutes: releaseMinutes, settle: input => settleBeat(input, 1)},
    rally: {roles: rallyRoles, minutes: 1, settle({bound: {operator, site}}) {
        if (!site.holder || !('stock:rallied' in site.quantities) || operator.place !== site.holder || !(operator.quantities[spirit] > 0) ||
            operator.properties.mind_pain > 0 || !(operator.quantities[soul] > 0)) return reject('The operator cannot rally the group.');
        return {ok: true, effects: [add(operator.holder, spirit, -1), add(site.holder, 'stock:rallied', 1)]};
    }},
};
export const GU_FIGHTING_SPIRIT_LAW = defineWorkingLaw({id: 'gu.fighting-spirit-world', revision: 1, operations});

export function fightingSpiritWorking(action = 'cast') {
    if (!['cast', 'rally'].includes(action)) throw Error('Unknown Fighting Spirit action.');
    return {id: 'gu.fighting-spirit.' + action, revision: 1, law: GU_FIGHTING_SPIRIT_LAW.ref,
        roles: action === 'cast' ? allRoles : rallyRoles,
        steps: (action === 'cast' ? ['prepare', 'release'] : ['rally']).map(op => ({
            op, bindings: Object.fromEntries(Object.keys(operations[op].roles).map(role => [role, role])),
        }))};
}

// B5 / HW3. Authored working. Reverend Insanity ch. 714 p12 anchors
// complementary scouting channels, while ch. 138 p57 anchors limited evidence.
import {guBodyHolder} from '../gu_living_body.js';
import {detectGuApproach} from '../gu_senses.js';
import {guWorldUseReason} from '../gu_world_use.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {sharedProperties, sharedQuantities} from '../world_quantities.js';

const recipe = 'gu.combined-investigation';
const reserve = 'energy:primeval';
const roles = {
    core: {channel: 'sight', rank: 1, cost: 1},
    support: {channel: 'spirit', rank: 2, cost: 2},
};
const recipeCost = Object.values(roles).reduce((total, role) => total + role.cost, 0);
const modes = {sweep: {range: 4, penetration: 1}, probe: {range: 1, penetration: 4}};
const fixedRoles = {operator: 'operator', origin: 'place', core: 'gu', support: 'gu'};
const binding = (kind, id) => ({kind, id});

function roleReady(gu, {channel, rank}, operator, at) {
    const p = gu.properties;
    return p.alive === true && !p.injured && p.gu_investigation_channel === channel &&
        p.gu_rank === rank && gu.quantities.satiety > 0 && !guWorldUseReason(gu, operator.id, operator.place, at);
}

function readContacts(subjects, distances, mode) {
    const {range, penetration} = modes[mode];
    const contacts = new Map();
    for (const {place, properties} of subjects) {
        const distance = Object.hasOwn(distances, place) ? distances[place] : Infinity;
        if (distance > range) continue;
        for (const {channel} of Object.values(roles)) {
            const cue = properties[`gu_${channel}_cue`];
            if (!cue || !detectGuApproach({
                senses: {[channel]: {reach: 0, penetration}},
                concealment: [{channel, magnitude: properties[`gu_${channel}_veil`] ?? 0}],
                screens: properties.gu_investigation_screens,
            })) continue;
            contacts.set(`${place}:${channel}`, {place, channel, ...(mode === 'probe' && {cue})});
        }
    }
    return [...contacts.values()];
}

function settleInvestigation({bound: {operator, origin, core, support, ...subjects}, options: {mode, distances}, at}) {
    if (operator.properties.alive !== true || operator.place !== origin.id ||
        !operator.properties.gu_known_moves?.includes(recipe)) return {ok: false, reason: 'The observer cannot use this recipe here.'};
    if (!roleReady(core, roles.core, operator, at)) return {ok: false, reason: 'The sight core cannot start the move.'};
    if (!(operator.quantities[reserve] >= recipeCost)) return {ok: false, reason: 'The observer lacks the essence for both Gu.'};
    const costs = [{quantity: reserve, payer: operator.holder, amount: recipeCost}];
    if (core.id === support.id || !roleReady(support, roles.support, operator, at)) {
        // GKM8 and the keeper recipe precedent. A paid failed attempt lands
        // one point per failed support role on the working core, to a floor of 1.
        const recoil = Math.min(1, Math.max(0, (core.quantities.vitality ?? 0) - 1));
        return {ok: true, costs, effects: recoil ? [{op: 'add', holder: core.holder, quantity: 'vitality', amount: -recoil}] : [],
            observed: {mode, outcome: 'backlash', recoil, contacts: []}};
    }
    const contacts = readContacts(Object.values(subjects), distances, mode);
    return {ok: true, costs, observed: {mode, outcome: 'read', contacts}};
}

export function investigationWorking({mode, bindings, subjects, distances}) {
    if (!Object.hasOwn(modes, mode) || !Array.isArray(subjects) || !subjects.length ||
        (mode === 'probe' && subjects.length !== 1) || new Set(subjects).size !== subjects.length ||
        subjects.includes(bindings.operator.id)) throw Error('Choose sweep subjects or one distinct probe subject.');
    const targetBindings = Object.fromEntries(subjects.map((id, index) => [`subject${index}`, binding('body', id)]));
    const workingRoles = {...fixedRoles, ...Object.fromEntries(Object.keys(targetBindings).map(role => [role, 'body']))};
    // Same law for this shape on restore, even if another mode is started later.
    const law = defineWorkingLaw({id: `${recipe}.${subjects.length}`, revision: 1,
        operations: {investigate: {roles: workingRoles, settle: settleInvestigation}}});
    return {law, bindings: {...bindings, ...targetBindings}, method: {
        id: `${recipe}.${mode}`, revision: 1, law: law.ref, roles: workingRoles,
        steps: [{op: 'investigate', bindings: Object.fromEntries(Object.keys(workingRoles).map(role => [role, role])),
            minutes: 1, options: {mode, distances}}],
    }};
}

const signalProperties = Object.values(roles).flatMap(({channel}) => [
    {id: `gu_${channel}_cue`, type: 'label'}, {id: `gu_${channel}_veil`, type: 'level', min: 0},
]);
const distances = {bank: 0, ford: 1, ridge: 3, beyond: 5};
const sceneBindings = {operator: binding('operator', 'keeper'), origin: binding('place', 'bank'),
    core: binding('gu', 'sight-gu'), support: binding('gu', 'spirit-gu')};
const subjects = ['veiled', 'clear', 'distant', 'out-of-range'];
function gu(id, {channel, rank}) {
    const body = guBodyHolder({id, needs: 'gu'}, {id, place: 'bank', satiety: 60});
    return {...body, properties: {alive: true, gu_rank: rank, gu_keeper: 'keeper',
        gu_controller: 'keeper', gu_investigation_channel: channel}, quantities: {...body.quantities, vitality: 3}};
}
const target = (id, place, properties) => ({id, kind: 'body', place, properties});
const paid = to => ({holder: 'keeper', quantity: reserve, direction: 'down', amount: 3, to});
const coreCondition = (direction, to) => ({holder: 'sight-gu', quantity: 'vitality', direction, to});
const cast = (id, mode, sampled) => ({id: `cast-${id}`, working: {family: 'gu-investigation', id,
    mode, subjects: sampled, bindings: sceneBindings, distances}});
const settled = (id, mode, at, balance, contacts, recoil = 0) => ({
    id, advanceTo: at, expect: [paid(balance), coreCondition(recoil ? 'down' : 'unchanged', recoil ? 2 : 3)],
    expectObserved: {working: id, step: 0, to: recoil ? {mode, outcome: 'backlash', recoil, contacts: []}
        : {mode, outcome: 'read', contacts}},
});

export function coverageCase(id) {
    if (id !== 'combined-investigation') throw Error(`Unknown Gu investigation case ${id}.`);
    return {basis: 'authored', world: {holders: [
        ...Object.keys(distances).map(id => ({id, kind: 'place'})),
        {id: 'keeper', kind: 'body', place: 'bank', as: ['operator'],
            properties: {alive: true, gu_known_moves: [recipe]}, quantities: {[reserve]: 9}},
        gu('sight-gu', roles.core), gu('spirit-gu', roles.support),
        target('veiled', 'ford', {gu_spirit_cue: 'uneven-pulse', gu_spirit_veil: 3, gu_sight_cue: 'moving-outline',
            gu_investigation_screens: ['sight']}),
        target('clear', 'ford', {gu_sight_cue: 'moving-outline'}),
        target('distant', 'ridge', {gu_spirit_cue: 'steady-pulse'}),
        target('out-of-range', 'beyond', {gu_spirit_cue: 'uneven-pulse'}),
    ]}, engine: {packs: ['l.living_body'], shared: {
        quantities: sharedQuantities(['energy', 'vitality']),
        properties: [...sharedProperties(['alive']),
            ...['gu_keeper', 'gu_controller', 'gu_investigation_channel'].map(id => ({id, type: 'label'})),
            ...['gu_known_moves', 'gu_investigation_screens'].map(id => ({id, type: 'set'})),
            {id: 'gu_rank', type: 'level', min: 1}, ...signalProperties],
    }}, timeline: [
        cast('sweep', 'sweep', subjects),
        settled('sweep', 'sweep', 1, 6, [{place: 'ford', channel: 'sight'}, {place: 'ridge', channel: 'spirit'}]),
        cast('probe', 'probe', ['veiled']),
        {id: 'restore-pending-probe', restore: true},
        settled('probe', 'probe', 2, 3, [{place: 'ford', channel: 'spirit', cue: 'uneven-pulse'}]),
        cast('lost-support', 'probe', ['veiled']),
        {id: 'support-leaves', ops: [{op: 'move', holder: 'spirit-gu', to: 'ridge'}]},
        settled('lost-support', 'probe', 3, 0, [], 1),
    ], expect: [
        {...paid(0), amount: 9}, coreCondition('down', 2),
        {holder: 'veiled', property: 'gu_spirit_veil', direction: 'unchanged', to: 3},
    ]};
}

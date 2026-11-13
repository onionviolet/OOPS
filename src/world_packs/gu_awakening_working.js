// PC95 / RIG1–4. The first aperture opens in place on the existing body.
import {APERTURE_LAW, apertureGrade, aperturePool} from '../gu_aperture.js';
import {resolveGuActivation} from '../gu_activation.js';
import {guAbility} from '../gu_working_law.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {apertureHolder} from '../world_substrate_packs/gu_aperture.js';

const initial = aperturePool(1, 'initial');
const rite = {candidate: 'operator', bank: 'place', field: 'place', hope: 'gu'};
const cast = {operator: 'operator', specimen: 'gu', target: 'creature'};
const reject = reason => ({ok: false, reason});
const presentHope = ({hope, field}) => hope.place === field.holder && hope.properties.gu_kind === 'hope' && hope.properties.alive === true;
const hasAperture = holder => 'aperture_wall' in holder.quantities;

export const GU_AWAKENING_PROPERTIES = [
    {id: 'gu_native_aptitude', type: 'level', min: 0, max: 100},
    {id: 'gu_hope_stride', type: 'level', min: 0, max: 50},
    {id: 'gu_walkable_steps', type: 'level', min: 0, max: 50},
    {id: 'gu_crossing_bank', type: 'label'},
    {id: 'gu_crossing_open', type: 'flag'},
];

function cross({bound}) {
    const {candidate, bank, field} = bound;
    if (candidate.properties.alive !== true || candidate.place !== bank.holder || bank.id === field.id ||
        field.properties.gu_crossing_bank !== bank.holder || field.properties.gu_crossing_open !== true || !presentHope(bound)) {
        return reject('The candidate cannot cross to the Hope Gu.');
    }
    if (hasAperture(candidate)) return reject('The first aperture is already open.');
    return {ok: true, effects: [{op: 'move', holder: candidate.holder, to: field.holder}]};
}

function awaken({bound}) {
    const {candidate, field} = bound;
    if (candidate.properties.alive !== true || candidate.place !== field.holder || !presentHope(bound)) {
        return reject('The candidate and the Hope Gu must remain in the field.');
    }
    if (hasAperture(candidate)) return reject('The first aperture is already open.');
    const {gu_native_aptitude: aptitude, gu_hope_stride: stride} = candidate.properties;
    const distance = field.properties.gu_walkable_steps;
    if (aptitude === undefined || stride === undefined || distance === undefined) {
        return reject('The field or the candidate’s response to Hope Gu has no reading.');
    }
    const steps = Math.min(stride, distance);
    if (steps < stride) return reject('The candidate has more of the Hope Gu field to walk.');
    const grade = apertureGrade(APERTURE_LAW, aptitude);
    if (steps < 10 || !grade) return {ok: true, observed: {result: 'unopened', steps}};
    const {quantities, state} = apertureHolder({id: candidate.id, aptitude});
    const accounts = Object.entries(quantities).filter(([quantity]) => !(quantity in candidate.quantities));
    return {ok: true, observed: {result: 'opened', steps, grade: grade.id}, effects: [
        ...accounts.map(([quantity, amount]) => ({op: 'carry', holder: candidate.holder, quantity, amount})),
        ...Object.entries(state).map(([pack, value]) => ({op: 'state', holder: candidate.holder, pack, value})),
    ]};
}

function moonblade({bound: {operator, specimen, target}, at}) {
    const p = specimen.properties;
    if (!operator.place || operator.properties.alive !== true || target.properties.alive !== true ||
        operator.place !== target.place || operator.place !== specimen.place || operator.id === target.id ||
        p.gu_kind !== 'moonlight' || p.gu_keeper !== operator.id || p.gu_controller !== operator.id ||
        !hasAperture(operator) || !(initial in operator.quantities)) {
        return reject('The caster needs a living target here, a controlled Moonlight Gu and initial-stage essence.');
    }
    const profile = guAbility('moonlight');
    const gu = {id: specimen.holder, kind: p.gu_kind, alive: p.alive === true, injured: p.injured,
        fedThrough: specimen.quantities.satiety > 0 ? at : at - 1};
    const ability = {...profile, cost: profile.cost * APERTURE_LAW.measure};
    const result = resolveGuActivation({stages: [{gu, operator: operator.id, ability}],
        reserves: {[operator.id]: {[ability.fuel]: operator.quantities[initial]}}, day: at});
    if (result.outcome !== 'complete') return reject(result.reason);
    return {ok: true, costs: [{quantity: initial, payer: operator.holder, amount: result.activations[0].cost}],
        observed: {specimen: gu.id}, effects: [{
            sentence: {verb: 'remove', object: 'vitality', target: 'bound', time: 'instant', carrier: 'gu', cost: 'none', limits: []},
            details: {target: {shape: 'holder', id: target.holder}, amount: result.effects[0].magnitude},
        }]};
}

export const GU_AWAKENING_LAW = defineWorkingLaw({id: 'gu.awakening', revision: 1, operations: {
    cross: {roles: rite, minutes: 2, settle: cross},
    awaken: {roles: rite, minutes: 3, settle: awaken},
    moonblade: {roles: cast, minutes: 1, settle: moonblade},
}});

const working = (id, roles, operations) => ({id, revision: 1, law: GU_AWAKENING_LAW.ref, roles,
    steps: operations.map(op => ({op, bindings: Object.fromEntries(Object.keys(roles).map(role => [role, role]))}))});
export const guAwakeningWorking = working('gu.hope-ceremony', rite, ['cross', 'awaken']);
export const guAwakenedMoonblade = working('gu.initial-moonblade', cast, ['moonblade']);

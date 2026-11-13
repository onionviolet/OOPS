// PC95. Opt-in forearm contact and care. The world's normal contact and block
// resolution runs first. One landed cut owns both the vitality loss and wound.
import {applyEngineOps} from '../engine_world.js';
import {landEffect} from '../effect_host.js';
import {HARM_WORLDS, healPart, injurePart} from '../harm_state.js';
import {defineWorkingLaw} from '../kernel_working.js';

const pack = 'g.moonblade-harm';
const arm = 'gu_forearm_interposed';
const guardSide = 'gu_forearm_guard_side';
const fractureAt = 'gu_forearm_fracture_at';
const legacyBleeding = 'gu_forearm_bleeding';
const bleeding = {left: 'gu_left_forearm_bleeding', right: 'gu_right_forearm_bleeding'};
const sides = Object.keys(bleeding);
const impairedArm = 'gu_moonblade_impaired_arm';
const bandage = 'stock:bandages';
const splint = 'stock:splints';
const repair = 'gu.forearm.repair';
const strain = 'gu.forearm.strain';
const careMinutes = 60;
const part = 'forearm';
const isSide = side => side === 'left' || side === 'right';
const partFor = side => side === 'left' ? 'left-forearm' : part;
const hands = HARM_WORLDS.default.parts.hands;
const rules = {parts: {[part]: hands, 'left-forearm': hands}};
const blocked = (value, side) => value === side || value === 'both';
const recoveryMinutes = 60 / hands.healPerHour;
const recovery = side => `gu_${side}_forearm_recovery_until`;
const recoveryProperties = sides.map(recovery);
const setRecovery = (holder, side, value) => ({op: 'property', holder, property: recovery(side), value});

export function moonbladeForearmStrain(operator, side, force, at) {
    return force >= 2 && operator.properties[recovery(side)] > at
        ? [{op: 'publish', kind: strain, by: operator.holder, place: operator.place, detail: {side}}] : [];
}

function bleedingOn(properties, side) {
    if (properties[bleeding[side]]) return true;
    return properties[legacyBleeding] === true && side === (properties[impairedArm] === 'left' ? 'left' : 'right');
}

// Resolve the old patient-wide flag before updating one wound. An old case
// with both arms impaired keeps its one bleed on the original right side.
function changeBleeding(holder, properties, side, value) {
    const set = (property, value) => ({op: 'property', holder, property, value});
    const other = side === 'left' ? 'right' : 'left';
    return [...(properties[legacyBleeding] ? [set(legacyBleeding, null),
        ...(bleedingOn(properties, other) ? [set(bleeding[other], true)] : [])] : []), set(bleeding[side], value)];
}

export const guMoonbladeHarmPack = {
    id: pack, revision: 1,
    properties: [{id: arm, type: 'flag'}, {id: guardSide, type: 'label'},
        {id: fractureAt, type: 'level', min: 1},
        ...[legacyBleeding, ...Object.values(bleeding)].map(id => ({id, type: 'flag'})),
        {id: impairedArm, type: 'label'}, ...recoveryProperties.map(id => ({id, type: 'level', min: 1}))],
    reads: ['vitality', legacyBleeding, ...Object.values(bleeding), impairedArm, 'alive', splint, ...recoveryProperties],
    writes: ['vitality', impairedArm, splint, legacyBleeding, ...Object.values(bleeding), ...recoveryProperties],
    publishes: [repair, strain], hears: [repair, strain],
    laws: [...sides.map(side => ({
        id: `${side}-forearm-bleeding`, appliesTo: holder => bleedingOn(holder.properties, side) &&
            holder.properties.alive === true && 'vitality' in holder.quantities,
        rates: (_view, id) => [{holder: id, quantity: 'vitality', perMinute: -1}],
    })), ...sides.map(side => ({
        id: `${side}-forearm-recovery`,
        appliesTo: holder => Object.hasOwn(holder.properties, recovery(side)),
        horizon: (view, id) => Math.max(1, view.property(id, recovery(side)) - view.clock),
        decide(view, id) {
            if (view.clock < view.property(id, recovery(side))) return [];
            const harm = view.state(id)?.harm;
            const limb = partFor(side);
            const ops = [setRecovery(id, side, null)];
            if (view.property(id, 'alive') === true && harm?.parts?.[limb]?.rung === 'wounded') {
                const healed = healPart(harm, rules, limb, {minutes: recoveryMinutes});
                ops.push({op: 'state', holder: id, value: {harm: healed.state}});
            }
            return ops;
        },
    }))],
    reactors: [{
        id: 'reopen-forearm', on: [strain], appliesTo: holder => !!holder.state[pack]?.harm,
        react(view, id, {by, detail}) {
            const {side} = detail ?? {};
            if (id !== by || !isSide(side) || !(view.property(id, recovery(side)) > view.clock)) return [];
            const properties = view.properties(id);
            const harm = injurePart(view.state(id).harm, rules, partFor(side),
                {rung: 'maimed', cause: 'Moonblade strain'}).state;
            return [setRecovery(id, side, null), {op: 'state', holder: id, value: {harm}},
                ...changeBleeding(id, properties, side, true),
                {op: 'property', holder: id, property: impairedArm,
                    value: blocked(properties[impairedArm], side === 'left' ? 'right' : 'left') ? 'both' : side}];
        },
    }, {
        id: 'repair-forearm', on: [repair], appliesTo: holder => !!holder.state[pack]?.harm,
        react(view, id, {by, place, detail}) {
            const side = detail?.side ?? 'right';
            if (detail?.patient !== id || view.placeOf(by) !== place || view.placeOf(id) !== place ||
                !isSide(side) || !view.property(by, 'alive') || !view.property(id, 'alive') ||
                bleedingOn({[bleeding[side]]: view.property(id, bleeding[side]), [legacyBleeding]: view.property(id, legacyBleeding),
                    [impairedArm]: view.property(id, impairedArm)}, side) ||
                !view.has(id, 'vitality') || view.amount(id, 'vitality') <= 0 ||
                !view.has(by, splint) || view.amount(by, splint) < 1) return [];
            const harm = view.state(id).harm;
            const limb = partFor(side);
            const impaired = view.property(id, impairedArm);
            if (harm.parts?.[limb]?.rung !== 'maimed' || !blocked(impaired, side)) return [];
            const healed = healPart(harm, rules, limb, {minutes: careMinutes, treated: true});
            if (healed.record.after === healed.record.before) return [];
            return [
                {op: 'add', holder: by, quantity: splint, amount: -1},
                {op: 'state', holder: id, value: {harm: healed.state}},
                setRecovery(id, side, view.clock + recoveryMinutes),
                {op: 'property', holder: id, property: impairedArm,
                    value: impaired === 'both' ? (side === 'left' ? 'right' : 'left') : null},
            ];
        },
    }],
};

export function moonbladeForearmImpact({engine, effect, landed, cause, by}) {
    if (effect.details?.guImpact !== 'moonblade') return undefined;
    const [hit] = landed.outcomes[0]?.applied ?? [];
    const body = engine.world.holders[hit?.target];
    if (!body || !body.properties[fractureAt] || !(hit.amount < 0)) return undefined;
    const side = body.properties[guardSide] ?? (body.properties[arm] ? 'right' : null);
    if (!isSide(side)) return undefined;
    const landedHit = landEffect(engine.rules, engine.world, effect, {cause, by,
        keys: engine.host.effects.keys, read: engine.host.effects.read});
    const fractured = effect.details.amount >= body.properties[fractureAt];
    const harm = injurePart(body.state[pack]?.harm, rules, partFor(side), {rung: fractured ? 'maimed' : 'wounded', cause: 'Moonblade'}).state;
    const ops = [{op: 'state', holder: body.id, pack, value: {harm}}];
    if (fractured) ops.push(
        setRecovery(body.id, side, null),
        ...changeBleeding(body.id, body.properties, side, true),
        {op: 'property', holder: body.id, property: impairedArm,
            value: blocked(body.properties[impairedArm], side === 'right' ? 'left' : 'right') ? 'both' : side},
    );
    return {...landedHit, world: applyEngineOps({...engine, world: landedHit.world}, ops, cause).world};
}

const roles = {healer: 'operator', patient: 'creature'};
const guardRoles = {defender: 'creature'};
export const GU_FOREARM_CARE_LAW = defineWorkingLaw({id: 'gu.forearm-care', revision: 1, operations: {
    interpose: {roles: guardRoles, minutes: 1, settle({bound: {defender}, options: {side}}) {
        if (!isSide(side) || !defender.properties.alive || moonbladeArmBlocked(defender, side)) {
            return {ok: false, reason: 'The defender needs a usable arm to interpose.'};
        }
        return {ok: true, effects: [{op: 'property', holder: defender.holder, property: guardSide, value: side}]};
    }},
    bindWound: {roles, minutes: 1, settle({bound: {healer, patient}, options}) {
        const side = options.side ?? (bleedingOn(patient.properties, 'right') ? 'right' : 'left');
        if (!healer.properties.alive || !patient.properties.alive || !healer.place || healer.place !== patient.place ||
            !isSide(side) || !bleedingOn(patient.properties, side) || !(patient.quantities.vitality > 0) || !(healer.quantities[bandage] > 0)) {
            return {ok: false, reason: 'The healer needs a bandage and a bleeding patient within reach.'};
        }
        return {ok: true, costs: [{quantity: bandage, payer: healer.holder, amount: 1}],
            effects: changeBleeding(patient.holder, patient.properties, side, null)};
    }},
    splint: {roles, minutes: careMinutes, settle({bound: {healer, patient}, options: {side = 'right'}}) {
        if (!healer.properties.alive || !patient.properties.alive || !healer.place || healer.place !== patient.place ||
            !isSide(side) || bleedingOn(patient.properties, side) || !moonbladeArmBlocked(patient, side) ||
            !(patient.quantities.vitality > 0) || !(healer.quantities[splint] > 0)) {
            return {ok: false, reason: 'Splinting needs a stabilized fracture and a splint within reach.'};
        }
        return {ok: true, effects: [{op: 'publish', kind: repair, place: patient.place,
            by: healer.holder, detail: {patient: patient.holder, side}}]};
    }},
}});
export function guForearmCareFor(side) {
    if (!isSide(side)) throw Error('Unknown bandage arm.');
    return {id: 'gu.bind-forearm', revision: 1, law: GU_FOREARM_CARE_LAW.ref, roles,
        steps: [{op: 'bindWound', bindings: {healer: 'healer', patient: 'patient'}, options: {side}}]};
}
export const guForearmCare = guForearmCareFor('right');
export function guForearmGuard(side) {
    if (!isSide(side)) throw Error('Unknown guard arm.');
    return {id: 'gu.guard-forearm', revision: 1, law: GU_FOREARM_CARE_LAW.ref, roles: guardRoles,
        steps: [{op: 'interpose', bindings: {defender: 'defender'}, options: {side}}]};
}
export function guForearmSplintFor(side) {
    if (!isSide(side)) throw Error('Unknown splint arm.');
    return {id: 'gu.splint-forearm', revision: 1, law: GU_FOREARM_CARE_LAW.ref, roles,
        steps: [{op: 'splint', bindings: {healer: 'healer', patient: 'patient'}, options: {side}}]};
}
export const guForearmSplint = guForearmSplintFor('right');

export const forearmWound = (holder, side = 'right') => holder.state[pack]?.harm.parts?.[partFor(side)] ?? null;

export function moonbladeArmBlocked(operator, arm) {
    return blocked(operator.properties[impairedArm], arm);
}

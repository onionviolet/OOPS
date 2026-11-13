// PC95. A released crescent keeps its launch site and aim. Its reach comes
// from the catalogue activation and its flight meets the current world.
import {guCatalogue} from '../gu_catalogue.js';
import {asBoundGu, guWorkingLaw} from '../gu_working_law.js';
import {guWorldUseReason} from '../gu_world_use.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {moonbladeArmBlocked, moonbladeForearmStrain} from './gu_moonblade_harm.js';

const fuel = 'energy:primeval.rank1';
const middleFuel = 'energy:primeval.rank1.middle';
const actor = {operator: 'operator'};
const activation = {...actor, specimen: 'gu'};
const deflection = {...activation, redirect: 'creature'};
const release = {...activation, target: 'creature'};
const impact = {target: 'creature'};
const refusal = reason => ({ok: false, reason});
const metresPerRange = 10;
const chargeMinutes = 1;
const workingId = address => address.slice(0, address.lastIndexOf('/'));
const setCharge = (holder, working, until) => Object.entries({gu_use_working: working, gu_use_working_until: until})
    .map(([property, value]) => ({op: 'property', holder, property, value}));

function activate(context, kind) {
    const {bound: {operator, specimen}, facts, at, options} = context;
    const p = specimen.properties;
    if (!operator.properties.alive || p.gu_kind !== kind) return refusal('The caster needs the matching Gu.');
    const reason = guWorldUseReason(specimen, operator.id, operator.place, at,
        {allowShared: true, working: options?.charged ? workingId(context.address) : undefined});
    if (reason) return refusal(reason);
    const gu = asBoundGu({id: specimen.holder, kind, rank: 1, alive: p.alive === true, injured: p.injured,
        fedThrough: specimen.quantities.satiety > 0 ? at : at - 1});
    const middle = kind === 'moonlight' && options?.grade === 'middle';
    const pool = middle ? middleFuel : 'primeval';
    const account = middle ? middleFuel : fuel;
    const used = guWorkingLaw.operations.activate.settle({...context, bound: {operator, gu},
        options: middle ? {pool, rank: 1, stage: 'middle', source: 'stored'} : {},
        facts: {...facts, reserves: {[operator.id]: {[pool]: operator.quantities[account] ?? 0}}}});
    if (!used.ok) return used;
    return {ok: true, costs: [{quantity: account, payer: operator.holder, amount: used.observed.cost}],
        facts: {modifiers: used.facts.modifiers}, output: used.effects[0]};
}

function raiseMirror({bound: {operator, specimen, redirect}, at, address}) {
    const p = specimen.properties;
    if (operator.properties.alive !== true || p.gu_kind !== 'crescent-mirror' || p.alive !== true ||
        p.injured || !(specimen.quantities.satiety > 0)) return refusal('A fed Crescent Mirror Gu is needed.');
    const reason = guWorldUseReason(specimen, operator.id, operator.place, at);
    if (reason) return refusal(reason);
    if (redirect && (!redirect.holder || redirect.properties.alive !== true || redirect.holder === operator.holder)) {
        return refusal('Angle the mirror toward another living target.');
    }
    if (!(operator.quantities[fuel] >= 2)) return refusal('Raising the mirror needs two essence.');
    return {ok: true, costs: [{quantity: fuel, payer: operator.holder, amount: 2}], effects: [
        {op: 'law_add', field: {id: 'crescent-mirror.' + address.replaceAll('/', '.'), kind: 'block',
            scope: operator.holder, until: at + 1,
            params: {verb: 'remove', object: 'spell-contact', spellObject: 'vitality', reflect: true,
                ...(redirect && {deflectedTo: redirect.holder})}}},
    ]};
}

export const GU_MOONBLADE_CONTACT_LAW = defineWorkingLaw({id: 'gu.moonblade-contact', revision: 1, operations: {
    brighten: {roles: activation, minutes: 1, settle: context => activate(context, 'little-light')},
    charge: {roles: activation, minutes: 1, settle({bound: {operator, specimen}, at, address}) {
        const reason = guWorldUseReason(specimen, operator.id, operator.place, at, {allowShared: true});
        if (reason) return refusal(reason);
        if (!operator.properties.alive || specimen.properties.gu_kind !== 'moonlight' || !specimen.properties.alive ||
            specimen.properties.injured || !(specimen.quantities.satiety > 0) || !(operator.quantities[fuel] >= 1)) {
            return refusal('Charging needs a fed Moonlight Gu and essence.');
        }
        return {ok: true, costs: [{quantity: fuel, payer: operator.holder, amount: 1}],
            effects: setCharge(specimen.holder, workingId(address), at + chargeMinutes)};
    }},
    loose: {roles: release, minutes: 1, settle(context) {
        const {operator, target, specimen} = context.bound;
        const charged = context.options?.charged;
        if (charged && (specimen.properties.gu_use_working !== workingId(context.address) ||
            specimen.properties.gu_use_working_until !== context.at)) return refusal('The held charge is unavailable.');
        if (target.holder === operator.holder || !target.properties.alive || !target.place) {
            return refusal('The caster needs a living target.');
        }
        const arm = context.options?.arm ?? 'right';
        if (moonbladeArmBlocked(operator, arm)) {
            return refusal('The injured arm cannot guide the Moonblade.');
        }
        const {output, ...used} = activate(context, 'moonlight');
        if (!used.ok) return used;
        const shot = {from: operator.place, aim: target.place, cost: output.range * metresPerRange, amount: output.magnitude};
        const effects = [...(charged ? setCharge(specimen.holder, null, null) : []),
            ...moonbladeForearmStrain(operator, arm, shot.amount, context.at)];
        return {...used, effects,
            facts: {...used.facts, shot, ...(context.options?.reflectable && {releasedBy: operator.holder}),
                ...(context.options?.routed && {routed: true})},
            observed: {released: shot}};
    }},
    'raise-mirror': {roles: activation, minutes: 1, settle: raiseMirror},
    'angle-mirror': {roles: deflection, minutes: 1, settle: raiseMirror},
    impact: {roles: impact, minutes: 1, settle({bound: {target}, facts: {shot, releasedBy, routed}}) {
        if (!shot) return refusal('There is no released blade.');
        if (!target.properties.alive || target.place !== shot.aim) return {ok: true, observed: {contact: 'evaded'}};
        return {ok: true, effects: [{
            sentence: {verb: 'remove', object: 'vitality', target: 'bound', time: 'instant', carrier: 'gu', cost: 'none', limits: []},
            details: {target: {shape: 'holder', id: target.holder}, amount: shot.amount, damageType: 'slashing', guImpact: 'moonblade',
                contact: {from: shot.from, kinds: ['sightline'], links: shot.cost, cost: shot.cost,
                    ...(releasedBy && {releasedBy, deflectable: true}), ...(routed && {turns: []})}},
        }]};
    }},
}});

export const crescentMirrorWorking = {id: 'gu.contact.crescent-mirror', revision: 1, law: GU_MOONBLADE_CONTACT_LAW.ref,
    roles: activation, steps: [{op: 'raise-mirror', bindings: {operator: 'operator', specimen: 'specimen'}}]};

export const angledCrescentMirrorWorking = {...crescentMirrorWorking, id: 'gu.contact.angled-crescent-mirror',
    roles: deflection, steps: [{op: 'angle-mirror', bindings: {operator: 'operator', specimen: 'specimen', redirect: 'redirect'}}]};

export function moonbladeContactWorking({supported = false, grade = 'initial', arm = 'right', charged = false,
    reflectable = false, routed = false} = {}) {
    if (!['initial', 'middle'].includes(grade)) throw Error('Unknown Moonblade essence grade.');
    if (!['right', 'left'].includes(arm)) throw Error('Unknown casting arm.');
    const options = {...(grade === 'middle' && {grade}), ...(arm === 'left' && {arm}), ...(charged && {charged: true}),
        ...((reflectable || routed) && {reflectable: true}), ...(routed && {routed: true})};
    const name = supported ? guCatalogue.moonlight.move.value.id : 'moonblade';
    return {id: 'gu.contact.' + name, revision: 1, law: GU_MOONBLADE_CONTACT_LAW.ref,
        roles: {...actor, blade: 'gu', ...impact, ...(supported && {light: 'gu'})},
        steps: [
            ...(supported ? [{op: 'brighten', bindings: {operator: 'operator', specimen: 'light'}}] : []),
            ...(charged ? [{op: 'charge', bindings: {operator: 'operator', specimen: 'blade'}}] : []),
            {op: 'loose', ...(charged && {minutes: chargeMinutes}), bindings: {operator: 'operator', specimen: 'blade', target: 'target'}, options},
            {op: 'impact', bindings: {target: 'target'}},
        ]};
}

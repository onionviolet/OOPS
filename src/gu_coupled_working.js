// A Gu procedure beat as one K filler (SC6, KW18-KW21). The host reads live
// custody and supplies reserves; the kernel owns time, receipts and restore.
import {check, natural, object} from './basics.js';
import {stableId} from './simulation_ids.js';
import {resolveGuActivation} from './gu_activation.js';
import {defineWorkingLaw, validateWorkingMethod} from './kernel_working.js';

const refuse = reason => ({ok: false, reason});

function settleBeat({bound, facts, options: {participants, effect, scope}, at}) {
    const operator = bound.operator.id;
    const reserve = Object.hasOwn(facts.reserves ?? {}, operator) ? facts.reserves[operator] : {};
    if (!object(reserve)) return refuse('invalid-essence-reserve');
    const stages = [];
    const used = new Set();
    for (const {id, kind, fuel, cost} of participants) {
        const specimen = bound[id];
        if (used.has(specimen.id)) return refuse('duplicate-gu');
        if (specimen.guKind !== kind) return refuse('wrong-gu-kind');
        if (specimen.holder !== operator) return refuse('gu-not-held');
        const balance = Object.hasOwn(reserve, fuel) ? reserve[fuel] : 0;
        if (!Number.isFinite(balance) || balance < 0) return refuse('invalid-essence-reserve');
        used.add(specimen.id);
        // The beat pays to use each body. Its constituent activations have
        // no standalone output; only a successful beat emits the combined intent.
        stages.push({gu: {...specimen, kind: specimen.guKind}, operator, ability: {fuel, cost}});
    }

    const completionEffect = scope ? {...effect, scope: {place: bound.place.id, radius: scope.radius}} : effect;
    const result = resolveGuActivation({beats: [{stages}], reserves: {...facts.reserves, [operator]: reserve},
        day: facts.day ?? at, modifiers: facts.modifiers ?? [], completionEffect});
    if (result.outcome !== 'complete') return refuse(result.reason);
    return {ok: true, facts: {reserves: result.remaining}, effects: result.effects,
        costs: result.activations.map(({fuel, cost, operator}) => ({quantity: `essence.${fuel}`, holder: operator, amount: cost})),
        observed: {activated: result.activations.map(row => row.id)}};
}

// Versioned world data supplies concrete role kinds, charges, minutes and a
// combined effect intent. A scoped intent binds a live place and its authored
// radius. The host decides how to apply the intent to that place.
export function compileGuCoupledBeat({id, revision, grammar, participants, minutes, effect, scope}) {
    check(stableId(id) && natural(revision) && revision > 0 && natural(minutes), 'A Gu beat needs a versioned id and duration.');
    check(Array.isArray(participants) && participants.length >= 2, 'A coupled beat needs at least two Gu.');
    check(object(effect) && stableId(effect.kind), 'A coupled beat needs a combined effect.');
    check(scope === undefined || (object(scope) && Number.isFinite(scope.radius) && scope.radius > 0),
        'A scoped beat needs a positive radius.');

    const roles = {operator: 'operator', ...(scope && {place: 'place'})};
    const charges = participants.map(participant => {
        const {id, kind, fuel, cost} = participant;
        check(stableId(id) && !Object.hasOwn(roles, id) && stableId(kind) && stableId(fuel) && Number.isFinite(cost) && cost > 0,
            'Each Gu beat role needs a unique id, a kind, a fuel and a positive cost.');
        roles[id] = 'gu';
        return {id, kind, fuel, cost};
    });
    const methodId = `gu.coupled.${id}`;
    const law = defineWorkingLaw({id: `${methodId}.r${revision}`, revision: 1, operations: {activate: {roles, settle: settleBeat}}});
    const method = validateWorkingMethod(law, {id: methodId, revision, law: law.ref, roles, ...(grammar !== undefined && {grammar}),
        steps: [{op: 'activate', minutes, bindings: Object.fromEntries(Object.keys(roles).map(role => [role, role])),
            options: structuredClone({participants: charges, effect, ...(scope && {scope: {radius: scope.radius}})})}]});
    return {law, method};
}

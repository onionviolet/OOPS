// G's typed move compiler (SC6, GL3, KW18-KW21). The host owns live reads
// and publishes K receipts. This module does neither search nor world mutation.
import {guCatalogue} from './gu_catalogue.js';
import {guAbility, guMethods, guWorkingLaw} from './gu_working_law.js';
import {composeWorking, defineComposition} from './kernel_compose.js';
import {defineWorkingLaw} from './kernel_working.js';
import {stableId} from './simulation_ids.js';

// One Gu per role, in the recipe's declared activation order. Roles match
// functions and optional path/kind constraints, independent of custody IDs.
export function bindGuMove(recipe, available) {
    return [...iterateGuMoveBindings(recipe, available)];
}

export function guMoveRoleMatches(role, {gu, ability, operator}) {
    return (role.fn === undefined || role.fn === ability.fn) &&
        (!role.path || role.path === ability.path) && (!role.kind || role.kind === gu.kind) &&
        (!role.operator || role.operator === operator) && (role.minRank === undefined || gu.rank >= role.minRank);
}

export function* iterateGuMoveBindings(recipe, available, budget) {
    const choices = recipe.roles.map(role => available.filter(stage => guMoveRoleMatches(role, stage)));
    const chosen = new Map();
    const used = new Set();

    function* visit(index) {
        if (budget && budget.visited >= budget.limit) {budget.truncated = true; return;}
        if (budget) budget.visited++;
        const role = recipe.roles[index];
        if (!role) {
            yield {roles: Object.fromEntries(chosen), stages: [...chosen.values()].filter(Boolean)};
            return;
        }
        for (const stage of choices[index]) {
            const {gu} = stage;
            if (used.has(gu.id)) continue;
            chosen.set(role.id, stage);
            used.add(gu.id);
            yield* visit(index + 1);
            used.delete(gu.id);
            if (budget?.truncated) return;
        }
        if (role.optional) {
            chosen.set(role.id, null);
            yield* visit(index + 1);
        }
        chosen.delete(role.id);
    }

    yield* visit(0);
}

const contextTypes = new Set(['operator', 'place', 'target', 'formation']);

const activate = guWorkingLaw.operations.activate;
const activationLaw = defineWorkingLaw({id: 'gu.move-role.activation', revision: 1, operations: {
    activate: {...activate, settle(context) {
        const {bound: {gu, operator}, options: {kind}} = context;
        if (gu.guKind !== kind) return {ok: false, reason: 'gu-kind-changed'};
        const outcome = activate.settle({...context, options: {}});
        if (!outcome.ok) return outcome;
        return {...outcome, costs: [{quantity: `essence.${guAbility(kind).fuel}`, holder: operator.id, amount: outcome.observed.cost}]};
    }},
}});

function activationFiller(kind) {
    const method = guMethods(kind).activate;
    return {law: activationLaw, method: {...method, law: activationLaw.ref,
        steps: method.steps.map(step => ({...step, options: {kind}}))}};
}

function checkContext(roles) {
    const law = defineWorkingLaw({id: 'gu.move-role.context', revision: 1, operations: {
        check: {roles, settle: () => ({ok: true})},
    }});
    const bindings = Object.fromEntries(Object.keys(roles).map(role => [role, role]));
    return {law, method: {id: 'context', revision: 1, law: law.ref, roles, steps: [{op: 'check', bindings}]}};
}

function resolveRole(role, type, ref, ports, at) {
    if (type !== 'gu' && !contextTypes.has(type)) {
        return {reason: type === 'world-field' ? 'world-field-required' : 'role-unresolved'};
    }
    if (type === 'gu' && !role.kind &&
        !(role.function && typeof role.evidence === 'string' && role.evidence.trim())) {
        return {reason: 'gu-requirement-unknown'};
    }
    if (!ref) return {reason: 'missing-binding'};
    if (ref.kind !== type) return {reason: 'wrong-binding-type'};
    if (!stableId(ref.id)) return {reason: 'invalid-binding-id'};
    const thing = ports.read(ref, at);
    if (!thing || thing.id !== ref.id) return {reason: 'unknown-binding'};
    if (thing.kind !== type) return {reason: 'wrong-binding-type'};
    if (type !== 'gu') return {};
    const kind = thing.guKind;
    const entry = Object.hasOwn(guCatalogue, kind) ? guCatalogue[kind] : null;
    if (role.kind ? kind !== role.kind : entry?.parts?.value.function !== role.function) {
        return {reason: role.kind ? 'wrong-gu-kind' : 'wrong-gu-function'};
    }
    const ability = entry && guAbility(kind);
    return ability ? {kind, ability} : {reason: 'gu-ability-unavailable'};
}

// Input roles may name an exact catalogue kind or explicitly declare a Gu
// function with its substitution evidence. Context roles require live typed
// references. A context check establishes availability; any rule acting on
// the target, place or formation still needs its own mechanism.
// Success returns a normal K law, method and bindings, with the operator
// supplied by the host. Failure returns requirements before a quote can spend.
export function compileGuMove(record, {bindings, ports, at}) {
    const {id, revision = 1, grammar, operator = 'operator', ordered = false} = record;
    const requirements = [];
    const roles = [];
    const roleIds = new Set();
    const guIds = new Set();
    for (const role of [{id: operator, type: 'operator'}, ...record.roles]) {
        const type = role.type ?? (role.kind ? 'gu' : 'unknown');
        if (!stableId(role.id) || roleIds.has(role.id)) {
            requirements.push({role: role.id, type, reason: roleIds.has(role.id) ? 'duplicate-role' : 'invalid-role-id'});
            continue;
        }
        roleIds.add(role.id);
        const ref = Object.hasOwn(bindings, role.id) ? bindings[role.id] : undefined;
        const resolved = resolveRole(role, type, ref, ports, at);
        const reason = resolved.reason ?? (type === 'gu' && guIds.has(ref.id) ? 'reused-gu' : null);
        if (reason) {
            requirements.push({role: role.id, type, reason, ...(role.kind && {kind: role.kind}),
                ...(role.function && {function: role.function})});
            continue;
        }
        if (type === 'gu') guIds.add(ref.id);
        roles.push({...role, type, ref: {kind: ref.kind, id: ref.id}, ...resolved});
    }
    for (const field of record.worldFields ?? []) {
        requirements.push({role: field, type: 'world-field', reason: 'world-field-required'});
    }
    const casts = roles.filter(role => role.type === 'gu');
    if (!requirements.length && !casts.length) {
        requirements.push({type: 'gu', reason: 'no-activation'});
    }
    if (requirements.length) return {ok: false, requirements};

    const fillers = Object.fromEntries(casts.map(role => [role.id, activationFiller(role.kind)]));
    const contextRoles = roles.filter(role => role.type !== 'gu' && role.id !== operator);
    const supportOnly = ({ability}) => !ability.effect && !!(ability.modifier || ability.modifiers);
    const sequence = ordered ? casts : [...casts.filter(supportOnly), ...casts.filter(role => !supportOnly(role))];
    const slots = sequence.map(role => ({name: role.id, needs: fillers[role.id].method.roles,
        bindings: {gu: role.id, operator}, facts: 'shared', minutes: role.minutes}));

    if (contextRoles.length) {
        const context = Object.fromEntries(contextRoles.map(role => [role.id, role.type]));
        // K slot names must be unique. Keep the context slot outside the role names.
        let name = 'context';
        while (Object.hasOwn(fillers, name)) name = `context.${name}`;
        fillers[name] = checkContext(context);
        slots.unshift({name, needs: context, bindings: fillers[name].method.steps[0].bindings, facts: 'shared'});
    }
    const composition = defineComposition({id: `gu.composed-move.${id}`, revision, grammar, slots,
        roles: Object.fromEntries(roles.map(role => [role.id, role.type]))});
    return {ok: true, ...composeWorking(composition, fillers),
        bindings: Object.fromEntries(roles.map(role => [role.id, role.ref]))};
}

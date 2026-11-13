// Chapter 275 flame compositions on the headless world (PC95, GL3).
// The compiler selects the parts. The existing activation law computes their
// contributions. This adapter connects those results to live holders.
import {compileGuMove} from './gu_move_roles.js';
import {guAbility} from './gu_working_law.js';
import {substratePort} from './world_substrate.js';
import {LAYERED_PROTECTION_PACK, PROTECTION_IMPACT} from './world_substrate_packs/layered_protection.js';

export const GU_FLAME_ESSENCE = 'energy:primeval';

function readGu(holder) {
    const {guKind, keeper, fedThrough, alive, injured} = holder.properties;
    return {...holder, guKind, holder: keeper, fedThrough, alive, injured};
}

export function compileGuFlameWorking(engine, recipe, bindings) {
    const read = substratePort(engine.world);
    const compiled = compileGuMove(recipe, {bindings, at: engine.world.clock, ports: {
        read(ref, at) {
            const holder = read(ref, at);
            return holder && (ref.kind === 'gu' ? readGu(holder) : holder);
        },
    }});
    if (!compiled.ok) return compiled;

    const unsupported = recipe.roles.find(role => {
        const ref = compiled.bindings[role.id];
        if (ref?.kind !== 'gu') return false;
        const effect = guAbility(read(ref).properties.guKind).effect;
        return effect && effect.kind !== 'flame';
    });
    if (unsupported) return {ok: false, requirements: [{role: unsupported.id, reason: 'no-flame-delivery'}]};

    const target = bindings.flameTarget;
    if (target?.kind !== 'body' || !read(target)) {
        return {ok: false, requirements: [{role: 'flameTarget', reason: 'needs-a-body-target'}]};
    }

    const {law, method} = compiled;
    const layered = engine.rules.packs.includes(LAYERED_PROTECTION_PACK);
    const operations = Object.fromEntries(Object.entries(law.operations).map(([name, operation]) => {
        if (!operation.roles.gu) return [name, operation];
        return [name, {...operation, roles: {...operation.roles, flameTarget: 'body'}, settle(context) {
            const {operator, flameTarget} = context.bound;
            const liveGu = context.bound.gu;
            if (!liveGu.properties || liveGu.properties.keeper !== operator.id) {
                return {ok: false, reason: 'gu-not-held'};
            }
            const gu = readGu(liveGu);
            const result = operation.settle({...context, bound: {...context.bound, gu},
                facts: {...context.facts, reserves: {[operator.id]: {primeval: operator.quantities?.[GU_FLAME_ESSENCE] ?? 0}}}});
            if (!result.ok) return result;

            return {...result, facts: {modifiers: result.facts.modifiers},
                costs: result.costs.map(cost => ({...cost, quantity: GU_FLAME_ESSENCE})),
                effects: result.effects.flatMap(flame => Array.from({length: flame.count}, () => layered ? {
                    op: 'publish', kind: PROTECTION_IMPACT, place: flameTarget.place, by: operator.id,
                    detail: {target: flameTarget.holder, type: 'fire', amount: flame.magnitude},
                } : {
                    sentence: {verb: 'remove', object: 'vitality', time: 'instant'},
                    details: {target: {shape: 'holder', id: flameTarget.holder}, amount: flame.magnitude},
                }))};
        }}];
    }));

    const boundLaw = {...law, ref: `gu.flame-delivery@1/${layered ? 'layered/' : ''}${law.ref}`, operations};
    return {ok: true, law: boundLaw,
        method: {...method, law: boundLaw.ref, roles: {...method.roles, flameTarget: 'body'},
            steps: method.steps.map(step => operations[step.op].roles.flameTarget
                ? {...step, bindings: {...step.bindings, flameTarget: 'flameTarget'}} : step)},
        bindings: {...compiled.bindings, flameTarget: {kind: target.kind, id: target.id}}};
}

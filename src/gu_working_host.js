// Native hosts publish returned facts and effects. No save keys or scene operations live here (KW11).
import {quoteWorking} from './kernel_working.js';
import {asBoundGu, guMethods, guMoveMethod, guRef, guWorkingLaw} from './gu_working_law.js';

export function runGuStep(kind, operation, {at, facts = {}, options = {}, specimen, id = `gu.host.${operation}`}) {
    const method = structuredClone(guMethods(kind)[operation]);
    if (!method) throw Error(`No ${operation} method for ${kind}.`);
    // Hosts settle one stage at a time against their existing native clock and saved ledger.
    const step = operation === 'refine' ? method.steps[options.action === 'begin' ? 0 : 1] : method.steps[0];
    method.steps = [{...step, minutes: 0, options: {...step.options, ...options}}];
    const bindings = Object.fromEntries(Object.entries(method.roles).map(([name, type]) =>
        [name, type === 'gu' ? guRef(specimen.id) : {kind: 'operator', id: 'player'}]));
    const result = quoteWorking(guWorkingLaw, method, {id, at, facts, bindings,
        ports: {read: ref => ref.kind === 'operator' ? ref : ref.id === specimen?.id ? asBoundGu(specimen) : null}});
    if (!result.ok) throw Error(result.reason ?? `The ${operation} working failed.`);
    return result;
}

// Ordered activations keep modifier carry and native balance/result conventions while using the law.
export function runGuActivations({stages, reserves, day, modifiers = []}) {
    const roles = stages.map((stage, index) => ({id: `gu${index}`, kind: stage.gu.kind}));
    const method = guMoveMethod({id: 'native-host', roles, ordered: true});
    method.steps.forEach((step, index) => {
        const {ability, supply} = stages[index];
        step.options = {ability, ...(supply && {pool: supply.pool, rank: supply.rank,
            stage: supply.stage, source: supply.source})};
    });
    const specimens = Object.fromEntries(stages.map(stage => [stage.gu.id, stage.gu]));
    const operator = stages[0].operator;
    if (stages.some(stage => stage.operator !== operator)) throw Error('Use one operator per Gu working.');
    const bindings = {operator: {kind: 'operator', id: operator},
        ...Object.fromEntries(roles.map((role, index) => [role.id, guRef(stages[index].gu.id)]))};
    const result = quoteWorking(guWorkingLaw, method, {id: 'gu.native-host', at: day,
        facts: {reserves, modifiers, day}, bindings,
        ports: {read: ref => ref.kind === 'operator' ? ref : specimens[ref.id] ? asBoundGu(specimens[ref.id]) : null}});
    return {outcome: result.ok ? 'complete' : 'interrupted', remaining: result.facts.reserves,
        effects: result.ok ? result.effects.map(({source, ...effect}) => effect) : [], modifiers: result.facts.modifiers,
        ...(result.reason && {reason: result.reason})};
}

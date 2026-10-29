import {check} from './basics.js';
import {xorshift32} from './hash_rng.js';

// A structural runner over existing saved sessions. Definitions own admission,
// costs, effects and settlement; the host still owns cadence and publication.
// Nothing from the definition is added to a save, so existing schemas stay exact.
export function createConflictPlan(state,context) {
    return {state:structuredClone(state),external:structuredClone(context.external),gameplay:structuredClone(context.gameplay),
        vitals:structuredClone(context.vitals),acquisitions:[],unlocks:[]};
}

// Compatibility mode for the three pre-frame battles. Their ordinal cursor and
// exact draw count are part of the saved replay contract. New fights should use
// keyed draws supplied by their definition instead of adopting this stream.
export function legacyConflictRandom(battle) {
    return ()=>{battle.seed=xorshift32(battle.seed);return battle.seed/0x100000000;};
}

// Ordered rows allow authored rules to keep their original precedence. An
// already decided result (for example withdrawal or defeat) takes priority.
export function conflictResult(rules,result=null) {
    return result || rules.find(row=>row.when())?.result || null;
}

/**
 * definition: {id, revision, sides, objective, results, random?, createPlan?, prepare, validate?}
 * prepare(frame): {moves:[{id, types?, when?, apply}], settle?}
 * Move rows select existing operations; means/cost checks remain with the
 * battle's current quote and effect owners during this behavior-preserving port.
 * Functions are runtime ports, never persisted content or a second effect DSL.
 */
export function runConflictFrame(definition,{state,context,command,registry,...inputs}) {
    const plan=(definition.createPlan || createConflictPlan)(state,context);
    const session=plan.state.simulation.sessions.player,battle=session.nativeBattle;
    const publishResult=result=>{
        const publish=definition.results[result];
        check(publish,`Unsupported conflict result for ${definition.id}.`);
        publish(plan,registry,result,context);
    };
    const frame={...inputs,state,context,command,registry,plan,session,battle,publishResult,random:definition.random?.(battle,inputs)};
    const step=definition.prepare(frame);
    const move=step.moves.find(row=>(!row.types || row.types.includes(command.type))&&(!row.when || row.when()));
    check(move,`Unsupported conflict move for ${definition.id}.`);
    move.apply();
    step.settle?.();
    definition.validate?.(plan.state,registry);
    return plan;
}

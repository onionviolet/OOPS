import {readFactsFrame} from './facts_frame.js';
import {worldCompletionBridgeFacts} from './world_completion_bridge.js';
import {worldCompletionLifeFacts,validateWorldCompletionLifeState,worldCompletionEnrolled} from './world_completion_life_facts.js';
import {worldCompletionLensFacts,validateWorldCompletionLensState} from './world_completion_lens_facts.js';
import {worldCompletionLearningFacts,validateWorldCompletionLearningState} from './world_completion_learning_facts.js';
import {worldCompletionMaterialsFacts,validateWorldCompletionMaterialsState} from './world_completion_materials_facts.js';
// Callers may carry a single native actor's frame or the staged keyed plan.
// Normalize only this view, without changing the incumbent scheduler context.
export function worldCompletionNativeContext(state,context={}){
    let vitals=context.vitals?.player?context.vitals:context.vitalsByActor;
    if(!vitals?.player&&context.vitals?.health!=null)vitals={player:context.vitals};
    // The publication frame's explicit state revision owns this derived map.
    // Planning/effects without that frame retain eager reads, even at one clock.
    const bodies=readFactsFrame(state,{},worldCompletionNativeContext,()=>Object.fromEntries(
        Object.entries(state.simulation?.people||{}).filter(([,p])=>p.vitals).map(([id,p])=>[id,p.vitals])));
    vitals={...bodies,...vitals};
    const equipment=context.equipment?.player?context.equipment:{player:context.equipment||{}};
    return {...context,vitals,equipment};
}
export function worldCompletionFacts(state,context={}){
    return normalizedWorldCompletionFacts(state,worldCompletionNativeContext(state,context),true,false).result;
}
// collect: also return this family's own facts (the facts-only API).
// owned: normalized.facts is a fresh dictionary the caller made for this call,
// so it is extended in place instead of copied (same keys, values and order).
function normalizedWorldCompletionFacts(state,normalized,collect,owned){
    // Keep the dependency dictionary for the leaf readers, but collect this
    // family's result as it is produced. Native contexts can contain thousands
    // of unrelated facts; do not allocate entries for all of them just to drop
    // them at the end of each read.
    const result={};
    if(collect)for(const key of Object.keys(normalized.facts||{}))
        if(key.startsWith('worldCompletion'))result[key]=normalized.facts[key];
    const bridge=worldCompletionBridgeFacts(state,normalized);
    const facts=owned?Object.assign(normalized.facts,bridge):{...normalized.facts,...bridge},context={...normalized,facts};
    if(collect)Object.assign(result,bridge);
    for(const read of [worldCompletionLifeFacts,worldCompletionLensFacts,worldCompletionLearningFacts,worldCompletionMaterialsFacts])
    {
        const next=read(state,context);
        Object.assign(facts,next);if(collect)Object.assign(result,next);
    }
    return {facts,result};
}
export function worldCompletionContext(state,context={}){
    const normalized=worldCompletionNativeContext(state,context);
    // The dependency dictionary is already a caller-owned merged projection.
    // Reuse it here instead of copying the full native dictionary a second time
    // for every actor context. The facts-only API still returns just its family.
    return {...normalized,facts:normalizedWorldCompletionFacts(state,normalized,false,false).facts};
}
// As worldCompletionContext, for a caller whose context.facts is a fresh plain
// dictionary it made for this one call and does not read again: that
// dictionary is extended in place and becomes the returned facts.
export function worldCompletionOwnedContext(state,context){
    const normalized=worldCompletionNativeContext(state,context);
    return {...normalized,facts:normalizedWorldCompletionFacts(state,normalized,false,true).facts};
}
export function validateWorldCompletionState(state,registry){
    if(state.simulation?.schema===5&&!worldCompletionEnrolled(state))throw new Error('Simulation5 requires explicit connected home-world enrollment.');
    validateWorldCompletionLifeState(state,registry);validateWorldCompletionLensState(state,registry);
    validateWorldCompletionLearningState(state,registry);validateWorldCompletionMaterialsState(state,registry);
}

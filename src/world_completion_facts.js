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
    return normalizedWorldCompletionFacts(state,worldCompletionNativeContext(state,context));
}
function normalizedWorldCompletionFacts(state,normalized){
    const facts={...normalized.facts,...worldCompletionBridgeFacts(state,normalized)};
    for(const read of [worldCompletionLifeFacts,worldCompletionLensFacts,worldCompletionLearningFacts,worldCompletionMaterialsFacts])
        Object.assign(facts,read(state,{...normalized,facts}));
    return Object.fromEntries(Object.entries(facts).filter(([key])=>key.startsWith('worldCompletion')));
}
export function worldCompletionContext(state,context={}){
    const normalized=worldCompletionNativeContext(state,context);
    return {...normalized,facts:{...normalized.facts,...normalizedWorldCompletionFacts(state,normalized)}};
}
export function validateWorldCompletionState(state,registry){
    if(state.simulation?.schema===5&&!worldCompletionEnrolled(state))throw new Error('Simulation5 requires explicit connected home-world enrollment.');
    validateWorldCompletionLifeState(state,registry);validateWorldCompletionLensState(state,registry);
    validateWorldCompletionLearningState(state,registry);validateWorldCompletionMaterialsState(state,registry);
}

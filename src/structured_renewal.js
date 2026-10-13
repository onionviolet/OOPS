import {assert, jsonData, stableId, validatePredicate, meets, validateSimulationState} from './simulation_contracts.js';
import {simulationFacts} from './simulation_effects.js';
import {simulationOccupiesActor, waitingSimulationChoice} from './simulation.js';
import {activePractice} from './techniques.js';
import {causalStoryTravelReasons} from './causal_story_host.js';

// Renewal edits the existing actor and claim owners. Publication remains the
// caller's ordinary durable expansion transaction, including failure rollback.
export function validateStructuredRenewalDefinition(d) {
    if(d.renewal == null)return null;
    const r=d.renewal;jsonData(r);
    const scoped=key=>stableId(key)&&key.startsWith(d.id+'.');
    assert(scoped(r.id)&&[r.methodKey,r.reserveKey,r.legacyKey].every(scoped)&&new Set([r.methodKey,r.reserveKey,r.legacyKey]).size===3,'Invalid structured renewal keys.');
    assert(Number.isSafeInteger(r.masteryThreshold)&&r.masteryThreshold>1,'Invalid structured renewal mastery.');
    assert([r.label,r.description,r.reward].every(text=>typeof text==='string'&&text.trim().length>0),'Invalid structured renewal presentation.');
    assert([r.reset,r.retain].every(rows=>Array.isArray(rows)&&rows.length>0&&rows.every(text=>typeof text==='string'&&text.trim().length>0)),'Invalid structured renewal preview.');
    assert(r.requires&&typeof r.requires==='object','Structured renewal needs earned prerequisites.');
    validatePredicate(r.requires);validatePredicate(r.visibleWhen);
    assert(r.practiceCommandId==null,'Structured renewal practice must remain repeatable.');
    return r;
}

export function previewStructuredRenewal(state,d,context) {
    const r=validateStructuredRenewalDefinition(d);
    if(!r)return {visible:false,eligible:false,reasons:[]};
    const actor=state.actors.player,s=state.simulation;
    assert(context.registry&&s,'Structured renewal needs admitted simulation content.');
    const facts=simulationFacts(state,{...context,actorId:'player'},context.registry);
    const visible=actor.worldId===d.world.id&&meets(r.visibleWhen,facts);
    if(!visible)return {visible:false,eligible:false,reasons:[]};
    const mastery=actor.facts[r.methodKey],reserve=actor.resources[r.reserveKey],legacy=actor.facts[r.legacyKey];
    const reasons=[];
    if(!Number.isFinite(mastery)||mastery<r.masteryThreshold||!Number.isFinite(reserve)||reserve<0||![0,1].includes(legacy))reasons.push('Develop the selected method and its training reserve first.');
    if(legacy===1||s.claims[r.id])reasons.push('This renewal has already been taken.');
    if(!meets(r.requires,facts))reasons.push('Finish the required local consequences first.');
    if(context.nativeAlive!==true||context.nativeReady===false||context.vitals?.player?.health<=0||context.nativeBody?.mobile!==true||s.people.player?.life!=='alive')reasons.push('Recover before renewing your training.');
    if(context.busy||context.activeTechniquePractice||activePractice(actor)||state.pending.length||s.jobs.length||Object.keys(s.sessions).length||simulationOccupiesActor(state,'player')||waitingSimulationChoice(state)||state.chronicle?.session||state.chronicle?.life.endedAt!=null||Object.values(s.pursuits||{}).some(p=>['investigating','moving','searching','waiting','sheltered','encounter'].includes(p.status))||causalStoryTravelReasons(state,'player').length)reasons.push('Finish current work, practice and passage commitments first.');
    return {visible:true,eligible:reasons.length===0,reasons,id:r.id,label:r.label,description:r.description,lost:[...r.reset],retain:[...r.retain],retained:[...r.retain],reward:r.reward,mastery,reserve,renewed:legacy===1,sequence:state.sequence};
}

export function commitStructuredRenewal(state,d,context,sequence=state.sequence) {
    assert(sequence===state.sequence,'The renewal preview changed. Review it again.');
    const preview=previewStructuredRenewal(state,d,context);
    assert(preview.visible&&preview.eligible,preview.reasons.join(' ')||'Renewal is unavailable.');
    const out={state:structuredClone(state),external:structuredClone(context.external),gameplay:structuredClone(context.gameplay),vitals:structuredClone(context.vitals||{}),acquisitions:[],unlocks:[]};
    const r=d.renewal,a=out.state.actors.player;
    a.facts[r.methodKey]=1;a.resources[r.reserveKey]=0;a.facts[r.legacyKey]=1;
    out.state.simulation.claims[r.id]={owner:'player',status:'settled',cause:`renewal:${++out.state.sequence}`,at:out.state.clock};
    validateSimulationState(out.state.simulation,out.state,context.registry.simulation);
    return out;
}

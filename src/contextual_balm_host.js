import {check} from './basics.js';
import {CONTEXTUAL_BALM_IDS as I, CONTEXTUAL_BALM_DEFINITIONS as D,
    CONTEXTUAL_BALM_NATIVE_EFFECT_REQUEST as EFFECT} from './contextual_balm_content.js';
import {contextualBalmContext, contextualBalmFacts, validateContextualBalmState} from './contextual_balm_facts.js';
import {commitSimulationCommand,cancelSimulationJob,simulationOccupiesActor} from './simulation.js';
import {activePractice} from './techniques.js';
import {projectFeatureCommands,featureWorkControls,featureRecordedKnowledge} from './feature_expansion_host.js';

const count=(o,k)=>o?.[k]||0;
export {contextualBalmContext, contextualBalmFacts, validateContextualBalmState};

export function commitContextualBalmCommand(state,registry,command,context,sequence=state.sequence) {
    check(sequence===state.sequence && context.actorId==='player','Review the current hand-care choice.');
    const current=contextualBalmContext(state,context);
    if(command.action==='cancel') {
        const job=state.simulation?.jobs.find(j=>j.id===command.id&&j.actorId==='player'&&j.commandId===I.dress);
        check(job,'Choose the exact pending balm dressing.');
        const out=cancelSimulationJob(state,registry,job.id,current,sequence);
        validateContextualBalmState(out.state,registry); return out;
    }
    check(command.id===I.dress&&!command.targetId,'Choose the current scraped-palm dressing.');
    check(!context.busy&&!simulationOccupiesActor(state,'player')&&!state.pending?.some(j=>j.context?.actorId==='player')&&
        !activePractice(state.actors.player)&&state.simulation?.programs?.player?.status!=='running',
        'Finish current work before reserving a balm.');
    const out=commitSimulationCommand(state,registry,{id:I.dress},current,sequence);
    validateContextualBalmState(out.state,registry);
    return out;
}

export function stageContextualBalmEffectRequest(before,plan,context={}) {
    const completed=count(plan.state.actors?.player?.completed,I.dress)-count(before.actors?.player?.completed,I.dress);
    if(completed<=0) return plan;
    check(completed===1,'One balm dressing can complete per staged transition.');
    const receipt=plan.state.simulation?.knowledge?.player?.[I.receipt];
    const beforeReceipt=before.simulation?.knowledge?.player?.[I.receipt];
    check(plan.state.actors?.player?.facts?.[I.version]===1&&receipt?.stage==='understood'&&
        plan.state.actors?.player?.completed?.[I.dress]>0,'A native effect needs the durable treatment receipt.');
    check(Number.isSafeInteger(receipt.at)&&receipt.at> (beforeReceipt?.at??-1)&&receipt.at<=plan.state.clock,'The treatment receipt is not newer than the staged source state.');
    check(/^simulation:[1-9][0-9]*$/.test(receipt.cause||''),'The treatment receipt lacks its exact simulation cause.');
    const frame=context.nativeCareFrame;
    const frameElapsed=frame&&Number.isSafeInteger(frame.clock)&&frame.clock<=plan.state.clock?plan.state.clock-frame.clock:0;
    const priorDuration=frame?.effects?.[I.effectId]?.duration;
    const remaining=Number.isFinite(priorDuration)?Math.max(0,priorDuration-frameElapsed):0;
    const remainingNewDuration=Math.max(0,EFFECT.duration-(plan.state.clock-receipt.at));
    const effectiveDuration=Math.max(remaining,remainingNewDuration);
    if(effectiveDuration===0) return plan;
    const request={...structuredClone(EFFECT),completedAt:receipt.at,remainingNewDuration,
        expectedExistingDuration:remaining,effectiveDuration,
        expectedExistingEffect:frame?.effects?.[I.effectId]||null,
        durableCause:receipt.cause,receiptAt:receipt.at};
    const already=plan.contextualBalmEffectRequests?.find(r=>r.durableCause===receipt.cause);
    if(already){check(already.receiptAt===receipt.at&&JSON.stringify(already)===JSON.stringify(request),'A repeated treatment request changed its durable receipt or effect terms.');return plan;}
    check(!(plan.contextualBalmEffectRequests||[]).length,'A native effect request is already staged for another treatment.');
    plan.contextualBalmEffectRequests=[...(plan.contextualBalmEffectRequests||[]),request];
    return plan;
}

export function contextualBalmPresentation(state,registry,context={}) {
    if(!state.simulation)return {sections:[]};
    const current=contextualBalmContext(state,context),f=current.facts;
    const job=state.simulation.jobs.find(j=>j.actorId==='player'&&j.commandId===I.dress);
    if(!f['contextualBalm.safePlace']&&!job)return {sections:[]};
    const work=featureWorkControls(state,registry,[I.group],current);
    const actions=projectFeatureCommands(state,registry,current,{groups:[I.group],commandType:I.group});
    const cancels=work.actions.map(a=>({...a,command:{type:I.group,action:'cancel',id:a.command?.id||a.id,sequence:state.sequence}}));
    const records=featureRecordedKnowledge(state,[I.prefix]);
    const receipt=f['contextualBalm.lastTreatment'];
    if(receipt) records.push({id:'contextual_balm.lastTreatment',text:`Latest treatment: ${receipt.value} Native Weak healing balm remaining now: ${f['contextualBalm.currentWeakBalmDuration']} played minutes.`});
    const exact=actions.find(a=>a.id===I.dress);
    if(exact) exact.command.sequence=state.sequence;
    const unavailable=[];
    if(f['contextualBalm.safePlace']&&!f['contextualBalm.scraped'])unavailable.push('No current scrape to dress.');
    if(f['contextualBalm.scraped']&&!f['contextualBalm.balmAvailableCount'])unavailable.push('Carry one unborrowed, unequipped Healing balm.');
    records.push({id:'contextual_balm.effectPolicy',text:`The existing Weak healing balm effect lasts 90 minutes. Current remaining duration: ${f['contextualBalm.currentWeakBalmDuration']} played minutes. Dressing preserves a longer duration and leaves distinct stronger native effects active.`});
    return {sections:[{id:'contextual.balm',label:'Scraped-palm care',description:`A one-minute use of the existing native Healing balm. The existing three-minute free hand rest remains available through Body. This removes only the scrape. Sore hands remain sore and may still block work; permanent marks, learned grip and earlier injury accounts remain.${f['contextualBalm.sore']?' Your hands are also sore, so this treatment may not make every hand-gated action ready.':''}`,
        work:work.work,actions:[...actions,...cancels],
        records:[...records,...(unavailable.length?[{id:'contextual_balm.availability',text:unavailable.join(' ')}]:[])]} ]};
}

export const CONTEXTUAL_BALM_INTERFACE=Object.freeze({
    group:I.group,definitions:D,
    factReader:contextualBalmFacts,context:contextualBalmContext,
    commit:commitContextualBalmCommand,presentation:contextualBalmPresentation,
    validate:validateContextualBalmState,stageEffectRequest:stageContextualBalmEffectRequest,
    effectRequest:EFFECT,
});

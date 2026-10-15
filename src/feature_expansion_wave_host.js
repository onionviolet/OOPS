import {steamAbsorptionPresentation} from './steam_absorption_host.js';
import {contextualBalmPresentation} from './contextual_balm_host.js';
import {coolingRefinementPresentation} from './cooling_refinement_host.js';
import {agreedDutyPresentation,agreedDutyFilterSocietyActions} from './agreed_duty_host.js';
import {gameAbsorptionAssayPresentation} from './game_absorption_assay_host.js';
import {homeFurnishingPresentation} from './home_furnishing_host.js';
import {factorioRetortPresentation} from './factorio_retort_host.js';
import {proto23Presentation} from './proto23_world_host.js';
import {worldCompletionPresentation} from './world_completion_host.js';
import {lorePracticePresentation} from './lore_practice_host.js';
import {bookCarePresentation} from './book_care_host.js';
import {fieldCarePresentation} from './field_care_host.js';
import {statusCarePresentation} from './status_care_host.js';
import {auditRemainderPresentation} from './audit_remainder_host.js';
import {auditRemainderFacts} from './audit_remainder_state.js';
import {artifactWorkshopPresentation} from './artifact_workshop_host.js';
import {featureObjectPresentation, fittingChoiceRecords} from './feature_expansion_objects_host.js';
import {societyPresentation} from './feature_expansion_society_host.js';
import {tidemarkPresentation} from './feature_expansion_destination_host.js';
import {featurePowerPresentation} from './feature_expansion_powers_host.js';
import {projectActionLegibility} from './action_legibility.js';
import {projectFeatureCommands,featureWorkControls,featureRecordedKnowledge} from './feature_expansion_host.js';
import {referenceControlPresentation} from './reference_gameplay_state.js';
import {referenceGameplayPresentation,referenceGameplayContext} from './reference_gameplay_host.js';
import {nethackFieldcraftPresentation} from './nethack_fieldcraft_host.js';
import {auditedWorkshopPresentation} from './audited_workshop_host.js';
import {auditedKitReservePresentation} from './audited_kit_reserve_host.js';
import {workPlanView} from './feature_expansion_work_plan.js';
import {REFERENCE_GAMEPLAY_IDS} from './reference_gameplay_content.js';
import {simulationFacts,simulationOccupiesActor} from './simulation.js';
import {meets} from './simulation_contracts.js';
import {activePractice} from './techniques.js';
const button=(id,label,command,eligible=true,reasons=[])=>({id,label,command,eligible,reasons});

export function featureWavePresentation(snapshot,registry) {
    const {state,context}=snapshot,sections=[];
    sections.push(...steamAbsorptionPresentation(state,registry,context).sections);
    sections.push(...contextualBalmPresentation(state,registry,context).sections);
    sections.push(...coolingRefinementPresentation(state,registry,context).sections);
    const duty=agreedDutyPresentation(state,registry,context);
    if(duty.visible)sections.push({id:'agreed_duty',label:'A jointly agreed next duty',description:'An optional actual joint booking; original duties keep their finite stock, wages and participant consent.',actions:duty.actions.map(a=>({...a,command:{...a.command,type:'agreed_duty',sequence:state.sequence}})),records:[...(duty.agreement?[{id:'duty.agreement',text:duty.agreement.value}]:[]),...(duty.result?[{id:'duty.result',text:duty.result.note}]:[]),...(duty.paused?[{id:'duty.paused',text:duty.pauseReason}]:[])]});
    sections.push(...worldCompletionPresentation(state,registry,context).sections);
    sections.push(...statusCarePresentation(state,registry,context).sections);
    sections.push(...fieldCarePresentation(state,registry,context).sections);
    sections.push(...bookCarePresentation(state,registry,context).sections);
    sections.push(...lorePracticePresentation(state,registry,context).sections);
    const objects=featureObjectPresentation(state,registry,context);
    if(objects.visible) {
        const work=featureWorkControls(state,registry,['feature_objects'],context);
        // Keep old refit IDs registered for exact saved jobs; the new pair is
        // the single visible material choice, without a duplicate guide offer.
        const actions=objects.introduced?projectFeatureCommands(state,registry,context,{groups:['feature_objects']}).filter(a=>!['feature_objects.refit_sharp','feature_objects.refit_dull'].includes(a.id)):[];
        if(objects.canBegin)actions.unshift(button('objects-begin','Meet Eda, the sluice fitter',{type:'objects_begin'}));
        sections.push({id:'objects',label:'Fitting tools & materials',description:[objects.loan?`${objects.loan.label} remains borrowed from Eda. Return its current physical variant to reclaim the deposit.`:'Use, borrow, maintain and fit actual tools and materials.',objects.earnedTracker?.text].filter(Boolean).join(' '),...work,actions:[...actions,...work.actions],records:[...fittingChoiceRecords(state,context),...featureRecordedKnowledge(state,['feature_objects.'])]});
    }
    const society=societyPresentation(state,registry,context);
    if(society.visible) {
        const work=featureWorkControls(state,registry,['feature_society'],context);
        const actions=society.introduced?agreedDutyFilterSocietyActions(state,projectFeatureCommands(state,registry,context,{groups:['feature_society']})).filter(a=>!a.id.startsWith('feature_society.duty.')):[];
        if(society.canBegin)actions.unshift(button('society-begin','Meet the household work circle',{type:'society',action:{type:'begin'}}));
        for(const plan of society.plans)actions.push(button(plan.id,`Follow finite itinerary: ${plan.label} · ${plan.steps} steps`,{type:'society',action:{type:'plan_start',id:plan.id}},plan.eligible,plan.reasons));
        const cursor=society.plan;
        if(cursor)for(const [action,available] of [['pause',cursor.canPause],['resume',cursor.canResume],['cancel',cursor.canCancel],['forget',cursor.canForget&&['complete','cancelled'].includes(cursor.status)]])if(available)actions.push(button(`plan-${action}`,action==='forget'?'Remove ended itinerary':`${action[0].toUpperCase()+action.slice(1)} itinerary`,{type:'society',action:{type:'plan_control',action,cursorId:cursor.id}}));
        const records=[...featureRecordedKnowledge(state,['feature_society.']),...(cursor?.steps||[]).map((step,index)=>({id:`itinerary:${step.id}`,text:`${index+1}. ${step.label}: ${step.status}.`}))];
        sections.push({id:'society',label:'Household work & apprenticeship',description:cursor?`${cursor.label}: ${cursor.status}. ${cursor.reason||''}`:'Each accepted job reserves its own funding and willing participants.',...work,actions:[...actions,...work.actions],records});
    }
    const destination=tidemarkPresentation(state,registry,context);
    if(destination.visible||context.facts['village.elderMet']&&context.facts.location==='Village') {
        const actions=destination.actions.filter(a=>a.visible).map(a=>({...a,command:{type:'tidemark',id:a.id},terms:a.costText||''}));
        if(!state.simulation?.knowledge.player?.['tidemark.chart']&&context.facts.location==='Village')actions.unshift(button('tidemark-chart','Read the terraced harbor chart',{type:'tidemark',id:'tidemark.chart'},!context.busy));
        sections.push({id:'destination',label:destination.label,description:destination.description,work:destination.agreement||'',actions,
            records:destination.records.map(r=>({id:r.key,text:r.text}))});
    }
    const powers=featurePowerPresentation(state,registry,context,snapshot.battleView,{battleRunning:snapshot.battleRunning});
    sections.push(...powers.sections);
    const reference=referenceControlPresentation(state,registry,context);
    sections.push(...reference.sections);
    const cooling=referenceGameplayPresentation(state,registry,context);
    if(cooling.visible) {
        const ctx=referenceGameplayContext(state,registry,context),work=featureWorkControls(state,registry,['reference_gameplay'],ctx);
        const actions=projectFeatureCommands(state,registry,ctx,{groups:['reference_gameplay'],commandType:'reference_workshop'});
        const cursor=workPlanView(state,registry,registry.workPlans,ctx),d=registry.workPlans.get(REFERENCE_GAMEPLAY_IDS.plan);
        const f=simulationFacts(state,ctx,registry),occupied=cursor&&!['complete','cancelled'].includes(cursor.status);
        if(d&&meets(d.visibleWhen,f)&&!cooling.practiceGoalReached) {
            const ready=!occupied&&!context.busy&&!simulationOccupiesActor(state,'player')&&!state.pending.some(j=>j.context.actorId==='player')&&!activePractice(state.actors.player)&&state.simulation.programs.player?.status!=='running'&&meets(d.requires,f);
            actions.push(button(d.id,'Follow Eda’s finite plan to hook control · at most 3 paid trials',{type:'reference_plan_start',id:d.id},ready,ready?[]:['Finish current work and restore the known teacher, source, charged sleeve and funds before practice.']));
        }
        if(cursor?.definitionId===REFERENCE_GAMEPLAY_IDS.plan)for(const [action,show] of [['pause',cursor.canPause],['resume',cursor.canResume],['cancel',cursor.canCancel],['forget',cursor.canForget&&['complete','cancelled'].includes(cursor.status)]])if(show)actions.push(button(`reference-plan-${action}`,action==='forget'?'Remove ended cooling plan':`${action[0].toUpperCase()+action.slice(1)} cooling plan`,{type:'reference_plan_control',action,cursorId:cursor.id}));
        sections.push({id:'reference.cooling',label:cooling.label,description:cooling.mastery==null?'Ordinary cooling and separate paid instruction use Eda’s finite stock.':`Measured cooling mastery ${cooling.mastery}/3. ${cooling.practiceGoalReached?'The hook-control function is available.':'Practice produces mastery; ordinary work produces real materials.'}`,
            work:[work.work,cursor?.definitionId===REFERENCE_GAMEPLAY_IDS.plan?`${cursor.label}: ${cursor.status}. ${cursor.reason||''}`:''].filter(Boolean).join(' '),actions:[...actions,...work.actions],records:cooling.records.map(r=>({id:r.id,text:`${r.basis?.attributedTo===REFERENCE_GAMEPLAY_IDS.teacher?'Eda’s account':'Your observation'}: ${r.text} · minute ${r.at}`}))});
    }
    sections.push(...homeFurnishingPresentation(state,registry,context).sections);
    sections.push(...factorioRetortPresentation(state,registry,context).sections);
    sections.push(...proto23Presentation(state,registry,context).sections);
    sections.push(...nethackFieldcraftPresentation(state,registry,context).sections);
    sections.push(...gameAbsorptionAssayPresentation(state,registry,context).sections);
    sections.push(...auditedWorkshopPresentation(state,registry,context).sections);
    sections.push(...auditedKitReservePresentation(state,registry,context).sections);
    sections.push(...auditRemainderPresentation(state,registry,context).sections);
    if(auditRemainderFacts(state)['auditRemainder.enrolled'])sections.push(...artifactWorkshopPresentation(state,registry,context).sections);
    for(const section of sections)for(const action of section.actions||[])if(!action.legibility){
        const reasons=(action.reasons||[]).map(reason=>typeof reason==='string'?reason:reason?.text||'').filter(Boolean);
        action.legibility=projectActionLegibility({id:action.id,label:action.label,description:action.description,discovered:true,
            preview:{visible:true,eligible:action.eligible,reasons},context,
            disclosure:{reasons:reasons.map(reason=>({known:true,match:reason,text:reason})),costs:action.terms?[{known:true,text:action.terms}]:[]}});
    }
    return {visible:sections.length>0,sections};
}

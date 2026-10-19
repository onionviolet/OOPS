import {check} from './basics.js';
import {STATUS_CARE_IDS as I, statusCareDefinitions as D} from './status_care_content.js';
import {statusCareFacts,statusCareEnrolled,STATUS_CARE_POLICY,projectStatusCareEffects,validateStatusCareState} from './status_care_facts.js';
import {enrollSimulation,commitSimulationCommand,cancelSimulationJob} from './simulation.js';
import {projectFeatureCommands,featureWorkControls,featureRecordedKnowledge} from './feature_expansion_host.js';
import {artifactEquipmentReasons} from './artifact_collection.js';

export function statusCareContext(state,context={}) {
    return {...context,facts:{...context.facts,...statusCareFacts(state,context)}};
}
export function commitStatusCareCommand(state,registry,command,context,sequence=state.sequence) {
    check(sequence===state.sequence&&context.actorId==='player','This care request changed. Review it again.');
    const d=registry.simulation.commands.get(command.id);
    if(command.action==='cancel') {
        const j=state.simulation?.jobs.find(j=>j.id===command.id&&j.actorId==='player');
        check(j&&registry.simulation.commands.get(j.commandId)?.group===I.group,'Choose the actual accepted care job.');
        const out=cancelSimulationJob(state,registry,j.id,statusCareContext(state,context),sequence);
        validateStatusCareState(out.state,registry);return out;
    }
    check(d?.group===I.group&&d.actorId==='player','Choose a known care action.');
    check(!command.targetId||command.targetId===d.targetId,'Choose the actual declared care participant.');
    check(!context.busy,'Finish your current activity before care.');
    const enrollment=command.id===I.begin&&!state.simulation?enrollSimulation(state,registry,context,sequence):null;
    const base=enrollment?.state || state;
    check(command.id===I.begin||statusCareEnrolled(base),'Open the optional care record first.');
    const current=statusCareContext(base,{...context,targetId:d.targetId||null,external:enrollment?.external||context.external,
        gameplay:enrollment?.gameplay||context.gameplay,statusCareHost:true});
    const reasons=artifactEquipmentReasons(d.costs,base,current);
    check(!reasons.length,reasons.join(' '));
    const out=commitSimulationCommand(base,registry,{id:d.id},current,base.sequence);
    if(enrollment){out.acquisitions=[...enrollment.acquisitions,...out.acquisitions];out.unlocks=[...enrollment.unlocks,...out.unlocks];}
    validateStatusCareState(out.state,registry);return out;
}

// Reconcile at the one final publisher, after joined-time native decay was
// calculated. A discarded preflight or cancelled job has no new completion.
export function reconcileStatusCareNative(before,plan,context={}) {
    validateStatusCareState(plan.state);
    const old=before.actors?.player?.completed?.[I.dryOff]||0, next=plan.state.actors.player.completed[I.dryOff]||0;
    if(next<=old)return plan;
    check(statusCareEnrolled(plan.state)&&plan.state.actors.player.facts[I.prefix+'dryReceipt']===true,'Drying needs actual completed care.');
    const wet=context.nativeCareFrame?.effects?.Wet;
    if(wet)plan.effectDurations={...plan.effectDurations,Wet:0};
    plan.nativePatch={...plan.nativePatch,rain_counter:0};
    plan.statusCareNative={resetRain:true};return plan;
}

export function statusCarePresentation(state,registry,context={}) {
    if(!context.facts?.['village.elderMet'])return {sections:[]};
    const current=statusCareContext(state,context), enrolled=statusCareEnrolled(state);
    const here=['Village','Shack'].includes(current.facts.location)&&state.actors.player.worldId===I.world;
    const jobs=state.simulation?.jobs.filter(j=>registry.simulation.commands.get(j.commandId)?.group===I.group)||[];
    if(!here&&!jobs.length)return {sections:[]};
    let actions=[];
    if(!state.simulation) {
        if(!enrolled&&current.facts['statusCare.supportedBody']&&current.facts['statusCare.local'])actions=[{id:I.begin,label:D.commands[0].label,
            eligible:!context.busy,reasons:context.busy?['Finish your current activity first.']:[],command:{type:'status_care',id:I.begin,sequence:state.sequence}}];
    } else actions=projectFeatureCommands(state,registry,current,{groups:[I.group],commandType:'status_care'}).map(a=>{
        const d=registry.simulation.commands.get(a.id), reasons=artifactEquipmentReasons(d?.costs||[],state,current);
        return {...a,eligible:a.eligible&&!reasons.length,reasons:[...(a.reasons||[]),...reasons]};
    });
    const work=state.simulation?featureWorkControls(state,registry,[I.group],current):{actions:[],work:''};
    const cancels=(work.actions||[]).map(a=>({...a,command:{type:'status_care',action:'cancel',id:a.command?.id||a.id,sequence:state.sequence}}));
    const records=Object.values(projectStatusCareEffects(state,registry,current)).map(e=>({id:e.id,text:`${e.name} · ${e.duration==null?'until resolved':e.duration+' played min'} · ${e.description}`}));
    const frame=current.nativeCareFrame;
    if(frame?.effects?.Wet)records.unshift({id:'native.Wet',text:`Wet · ${frame.effects.Wet.duration} native min · Existing wetness lowers cold tolerance; sheltered drying clears it.`});
    for(const id of ['Cold','Very cold','Freezing','Hypothermia'])if(frame?.effects?.[id])records.push({id:'native.'+id,text:`${id} · ${frame.effects[id].duration} native min · Warmth improves tolerance; this native cold effect keeps its own recovery rules.`});
    records.push(...featureRecordedKnowledge(state,[I.prefix]).slice(-4));
    return {sections:[{id:'status.care',label:'Current condition & small preparations',
        description:enrolled?'Care uses real materials, effort and played time. Preparations expire on the common played clock and apply to your supported human body in this realm.':
            'An optional local care record. Read your current condition, dry off, prepare for weather or careful work, and retain the actual results.',
        work:work.work||'',actions:[...actions,...cancels],records}]};
}

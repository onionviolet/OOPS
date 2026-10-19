import {check} from './basics.js';
import {FIELD_CARE_IDS as I,fieldCareDefinitions as D} from './field_care_content.js';
import {FIELD_VENOMS,fieldCareFacts,fieldCareEnrolled,validateFieldCareState} from './field_care_facts.js';
import {enrollSimulation,commitSimulationCommand,cancelSimulationJob} from './simulation.js';
import {artifactEquipmentReasons} from './artifact_collection.js';
import {projectFeatureCommands,featureWorkControls,featureRecordedKnowledge} from './feature_expansion_host.js';
export const fieldCareContext=(state,context={})=>({...context,fieldCareHost:true,facts:{...context.facts,...fieldCareFacts(state,context)}});
export function commitFieldCareCommand(state,registry,c,context,sequence=state.sequence){
    check(sequence===state.sequence&&context.actorId==='player','Review this current field-care choice.');
    if(c.action==='cancel'){const j=state.simulation?.jobs.find(j=>j.id===c.id&&j.actorId==='player');check(j&&registry.simulation.commands.get(j.commandId)?.group===I.group,'Choose the exact current care job.');return cancelSimulationJob(state,registry,j.id,fieldCareContext(state,context),sequence);}
    const d=registry.simulation.commands.get(c.id);check(d?.group===I.group&&!c.targetId,'Choose a known personal field procedure.');
    const enrollment=c.id===I.begin&&!state.simulation?enrollSimulation(state,registry,context,sequence):null,base=enrollment?.state||state;
    check(c.id===I.begin||fieldCareEnrolled(base),'Choose the optional field-care record first.');
    const current=fieldCareContext(base,{...context,external:enrollment?.external||context.external,gameplay:enrollment?.gameplay||context.gameplay});
    const reasons=artifactEquipmentReasons(d.costs,base,current);check(!reasons.length,reasons.join(' '));
    const out=commitSimulationCommand(base,registry,{id:c.id},current,base.sequence);
    if(enrollment){out.acquisitions=[...enrollment.acquisitions,...out.acquisitions];out.unlocks=[...enrollment.unlocks,...out.unlocks];}
    validateFieldCareState(out.state,registry);return out;
}
export function reconcileFieldCareNative(before,plan,context={}){
    const a=plan.state.actors.player;
    for(const [id,effects]of [[I.wipe,['Sticky']],[I.venom,FIELD_VENOMS]]){
        if((a.completed[id]||0)<=(before.actors.player.completed[id]||0))continue;
        for(const effect of effects){
            const native=context.nativeCareFrame?.effects?.[effect];if(!native)continue;
            const remaining=plan.effectDurations?.[effect]??Math.max(0,native.duration-(plan.state.clock-before.clock));
            plan.effectDurations={...plan.effectDurations,[effect]:id===I.wipe?0:Math.ceil(remaining/2)};
        }
    }
    validateFieldCareState(plan.state);return plan;
}
export function fieldCarePresentation(state,registry,context={}){
    const current=fieldCareContext(state,context);if(!current.facts['village.elderMet']&&!fieldCareEnrolled(state))return {sections:[]};
    const jobs=state.simulation?.jobs.filter(j=>registry.simulation.commands.get(j.commandId)?.group===I.group)||[];
    if(!current.facts['fieldCare.safePlace']&&!jobs.length)return {sections:[]};
    let actions=[];
    if(!state.simulation){if(current.facts['fieldCare.supportedBody'])actions=[{id:I.begin,label:D.commands[0].label,eligible:!context.busy,reasons:context.busy?['Finish current activity.']:[],command:{type:I.group,id:I.begin,sequence:state.sequence}}];}
    else actions=projectFeatureCommands(state,registry,current,{groups:[I.group],commandType:I.group}).map(a=>{const d=registry.simulation.commands.get(a.id),r=artifactEquipmentReasons(d.costs,state,current);return {...a,eligible:a.eligible&&!r.length,reasons:[...a.reasons,...r],command:{...a.command,sequence:state.sequence}};});
    const work=state.simulation?featureWorkControls(state,registry,[I.group],current):{actions:[],work:''};
    const cancel=work.actions.map(a=>({...a,command:{type:I.group,action:'cancel',id:a.command?.id||a.id,sequence:state.sequence}}));
    const wound=state.actors.player.facts[I.prefix+'wound'];
    const records=featureRecordedKnowledge(state,[I.prefix]).slice(-5);
    if(wound)records.push({id:I.prefix+'last_wound',text:`Your last observed qualifying cut: Oren’s landed pole hit, action ${wound.action}, ${Math.round(wound.damage*10)/10} resolved strike damage. Treatment does not restore that lost health.`});
    return {sections:[{id:I.prefix+'panel',label:'Field remedies & optional wound consequences',description:'Distinct treatments use real stock and played time. Extra mild wounds apply only to your explicitly accepted next new sluice challenge; existing fights keep their rules.',work:work.work,actions:[...actions,...cancel],records}]};
}

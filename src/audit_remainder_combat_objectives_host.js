// Root routes these controls through the existing durable publisher. No timer,
// reward inventory, save owner or parallel combat adapter is created here.
import {commitSimulationCommand} from './simulation.js';
import {applySimulationEffects} from './simulation_effects.js';
import {referenceGameplayContext} from './reference_gameplay_host.js';
import {projectFeatureCommands,featureWorkControls,featureRecordedKnowledge} from './feature_expansion_host.js';
import {REMAINDER_COMBAT_OBJECTIVES as I,REMAINDER_COMBAT_OBJECTIVE_KEYS as K,remainderCombatObjectivesFacts,
    combatObjectivesModule,fittingCarried,fittingReturnEffect,ownedCombatObjectiveItem} from './audit_remainder_combat_objectives_content.js';
import {acceptRemainderCombatObjective,endRemainderCombatObjective,validateRemainderCombatObjectives} from './audit_remainder_combat_objectives_state.js';
const check=(ok,message)=>{if(!ok)throw new Error(message);};
function currentContext(state,registry,context){const ref=referenceGameplayContext(state,registry,context);return {...ref,facts:{...ref.facts,...remainderCombatObjectivesFacts(state,ref,registry)}};}
export function commitRemainderCombatObjectivesCommand(state,registry,command,context,sequence=state.sequence){
    check(state.sequence===sequence&&state.schema===11&&state.auditRemainder?.schema===1&&context.actorId==='player','This objective control is stale or not explicitly enrolled.');
    if(command.action?.startsWith('withdraw_')){
        const kind=command.action.slice('withdraw_'.length);check(['recovery','supply'].includes(kind),'Choose a current declared objective.');
        const e=combatObjectivesModule(state)?.[kind]?.current;check(e&&command.attemptId===e.id,'This objective attempt changed.');
        const out={state:structuredClone(state),external:structuredClone(context.external||{}),gameplay:structuredClone(context.gameplay||{}),gameplayBefore:structuredClone(context.gameplay||{}),
            vitals:structuredClone(context.vitals||{}),equipment:structuredClone(context.equipment||{}),acquisitions:[],unlocks:[]};
        out.state.sequence++;
        if(kind==='recovery'){
            const b=out.state.simulation.sessions.player?.nativeBattle;
            if(b?.schema===5&&b.combatObjectives.recoveryAttemptId===e.id){b.combatObjectives.recoveryAttemptId=null;b.combatObjectives.recoveryReceipt=null;}
            if(fittingCarried(state,context))applySimulationEffects(out,[fittingReturnEffect()],{actorId:'player'},registry,`remainder-objective:${out.state.sequence}`);
        }
        endRemainderCombatObjective(out,kind,'withdrawn','abandoned');validateRemainderCombatObjectives(out.state,registry);return out;
    }
    const d=registry.simulation.commands.get(command.id);check(d?.group===I.group&&d.actorId==='player','Choose a declared combat-objective workshop command.');
    check(!command.targetId||command.targetId===d.targetId,'The actual fitting owner changed.');
    const out=commitSimulationCommand(state,registry,{id:d.id},currentContext(state,registry,{...context,targetId:d.targetId||null}),sequence);
    if(d.id===I.prefix+'accept_recovery')acceptRemainderCombatObjective(out,'recovery');
    if(d.id===I.prefix+'accept_supply')acceptRemainderCombatObjective(out,'supply');
    // Root advances the exact handoff and supply feat before final validators.
    if(d.id!==I.prefix+'handoff_fitting')validateRemainderCombatObjectives(out.state,registry);
    return out;
}
export function remainderCombatObjectivesAdmissionChoices(state,context={}){
    if(state.schema!==11||state.auditRemainder?.schema!==1)return [];
    return [['guard',K.guard,'Reserve one actual kit brace pad'],['brace_wrap',K.wrap,'Reserve one actual learned brace wrap'],['traversal',K.traversal,'Reserve a traversal lashing and your reusable Survey rope']].map(([id,key,label])=>{
        const eligible=ownedCombatObjectiveItem(state,context,key)&&(id!=='traversal'||ownedCombatObjectiveItem(state,context,K.rope));
        return {id,label,command:{physicalPreparation:id},eligible,reasons:eligible?[]:['Carry the exact owned preparation and any required unencumbered rope.']};
    });
}
export function remainderCombatObjectivesPresentation(state,registry,context={}){
    if(state.schema!==11||state.auditRemainder?.schema!==1)return {visible:false,sections:[]};
    const current=currentContext(state,registry,context),m=combatObjectivesModule(state),actions=projectFeatureCommands(state,registry,current,{groups:[I.group],commandType:'audit_remainder'});
    for(const kind of ['recovery','supply'])if(m?.[kind].current){const e=m[kind].current;
        actions.push({id:`${I.prefix}withdraw_${kind}`,label:`Withdraw ${kind==='recovery'?'fitting recovery':'ordinary-craft supply'} attempt`,
            command:{type:'audit_remainder',lane:I.module,action:`withdraw_${kind}`,attemptId:e.id},eligible:true,reasons:[],
            description:'Close only this optional attempt. Ordinary work or combat keeps its normal paid consequences; a carried owner fitting returns exactly.'});}
    const records=featureRecordedKnowledge(state,[I.prefix]),work=featureWorkControls(state,registry,[I.group],current);
    for(const kind of ['recovery','supply'])for(const e of [...(m?.[kind].history||[]),...(m?.[kind].current?[m[kind].current]:[])])records.push({id:e.id,
        text:`${kind==='recovery'?'Marked fitting gate':'Ordinary-craft supply'} attempt ${e.id.split(':').at(-1)}/3: ${e.status}${e.result?' · '+e.result:''}${e.violation?' · committed '+e.violation.commandId:''}${e.handoff?' · exact fitting handed back; recipe learned':''}.`});
    if(state.referenceGameplay?.feats?.earned?.some(e=>e.id==='ordinary_supply'))records.push({id:'ordinary_supply',text:'Earned: Supply through ordinary craft. Three actual kits were delivered under the accepted finite conduct terms. Ordinary commission payment remains six coins; recognition adds no money.'});
    return {visible:actions.length>0||records.length>0||!!work.work,sections:[{id:I.group,label:'Physical preparation and optional objectives',
        description:'Craft real one-use preparations, preserve an owned reusable rope, recover Eda’s actual fitting or complete the declared ordinary-craft commission. Existing encounters keep their accepted terms.',
        ...work,actions:[...actions,...work.actions],records}]};
}

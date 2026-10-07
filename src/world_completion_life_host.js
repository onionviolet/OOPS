import {WORLD_COMPLETION_LIFE_IDS as I,worldCompletionLifeDefinitions as D} from './world_completion_life_content.js';
import {worldCompletionEnrolled,worldCompletionLifeFacts,worldCompletionKnownAccount,validateWorldCompletionLifeState} from './world_completion_life_facts.js';
import {commitSimulationCommand,cancelSimulationJob} from './simulation.js';
import {projectFeatureCommands,featureWorkControls,featureRecordedKnowledge} from './feature_expansion_host.js';
import {artifactEquipmentReasons} from './artifact_collection.js';
import {worldCompletionLifeRuntimeRegistry,stampWorldCompletionLifeJob} from './world_completion_life_runtime.js';
const check=(ok,text)=>{if(!ok)throw new Error(text);};
export function worldCompletionLifeContext(state,context={}){return {...context,facts:{...context.facts,...worldCompletionLifeFacts(state,context)}};}
export function commitWorldCompletionLifeCommand(state,registry,command,context,sequence=state.sequence){
    check(sequence===state.sequence&&context.actorId==='player','The local account changed. Review its current terms.');
    if(command.action==='cancel'){
        const j=state.simulation?.jobs.find(j=>j.id===command.id&&j.actorId==='player');
        check(j&&registry.simulation.commands.get(j.commandId)?.group===I.group,'Choose the actual accepted local account work.');
        return cancelSimulationJob(state,registry,j.id,worldCompletionLifeContext(state,context),sequence);
    }
    const d=registry.simulation.commands.get(command.id);
    check(d?.group===I.group&&d.actorId==='player','Choose a known home-world account action.');
    check(!command.targetId||command.targetId===d.targetId,'Use the declared actual participant.');
    check(!context.busy,'Finish your current activity first.');
    const current=worldCompletionLifeContext(state,{...context,targetId:d.targetId||null});
    const reasons=artifactEquipmentReasons(d.costs,state,current);check(!reasons.length,reasons.join(' '));
    const out=commitSimulationCommand(state,worldCompletionLifeRuntimeRegistry(state,registry,current),{id:d.id},current,sequence);
    if(out.commitment){const j=out.state.simulation.jobs.find(j=>j.id===out.commitment.id);stampWorldCompletionLifeJob(out.state,j,current);out.commitment=structuredClone(j);}
    if(d.id===I.begin)out.state.simulation.schema=Math.max(5,out.state.simulation.schema);
    validateWorldCompletionLifeState(out.state,registry);return out;
}
export function worldCompletionLifePresentation(state,registry,context={}){
    if(!state.simulation||!context.facts?.['village.elderMet'])return {sections:[]};
    const current=worldCompletionLifeContext(state,context),enrolled=worldCompletionEnrolled(state);
    if(!current.facts['worldCompletion.local'])return {sections:[]};
    const actions=projectFeatureCommands(state,worldCompletionLifeRuntimeRegistry(state,registry,current),current,{groups:[I.group],commandType:'world_completion'});
    const work=featureWorkControls(state,registry,[I.group],current);
    const cancels=work.actions.map(a=>({...a,command:{type:'world_completion',action:'cancel',id:a.command?.id||a.id,sequence:state.sequence}}));
    const records=featureRecordedKnowledge(state,[I.prefix+'life.']);
    const account=worldCompletionKnownAccount(state);
    return {sections:[{id:'world.completion.life',label:enrolled?'Home-world chapter & changed return':'Connect the home-world chapter',
        description:enrolled?'Your field/craft career and local work converge here. Finish or decline the separate commitments, hear actual later accounts and settle the lens obligation. A private record or paid public review closes this chapter while ordinary life continues.':D.commands[0].description,
        work:work.work||'',actions:[...actions,...cancels],records},
        ...(enrolled&&state.actors.player.facts[I.prefix+'life.closed']?[{id:'world.completion.account',label:'Known changes retained',
            description:'Only your performed and received records appear. Current people, native access and owned materials still govern further work.',actions:[],records:account.map(r=>({id:r.id,text:r.text}))}]:[])]};
}

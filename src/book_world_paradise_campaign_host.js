import {PARADISE_IDS as P, PARADISE_LOCATIONS as L} from './book_world_paradise_ids.js';
import {PARADISE_CAMPAIGN_IDS as I, PARADISE_CAMPAIGN_WINDOW as W, paradiseCampaignDefinitions as D, paradiseCampaignWithdrawalEffects, paradiseCampaignPostRescueWithdrawalEffects} from './book_world_paradise_campaign_content.js';
import {paradiseCampaignContext,paradiseCampaignEnrolled,paradiseCampaignFacts,validateParadiseCampaignDepthState,projectParadiseCampaignEffects} from './book_world_paradise_campaign_facts.js';
import {reconcileParadiseCampaignDepthRuntime,validateParadiseCampaignDepthControllers} from './book_world_paradise_campaign_runtime.js';
import {commitSimulationCommand,cancelSimulationJob,answerSimulationEncounter,withdrawSimulationEncounter} from './simulation.js';
import {applySimulationEffects} from './simulation_effects.js';
import {projectFeatureCommands,featureWorkControls,featureEncounterControls,featureRecordedKnowledge} from './feature_expansion_host.js';
import {artifactEquipmentReasons} from './artifact_collection.js';
const check=(ok,message)=>{if(!ok)throw Error(message);};
const F=I.prefix;
export function commitParadiseCampaignDepthCommand(state,registry,command,context,sequence=state.sequence){
    check(command.type==='book_paradise_campaign'&&context.actorId==='player'&&sequence===state.sequence&&
        (command.sequence==null||command.sequence===sequence),'Review the current source branch, body and actual supplies.');
    check(state.bookWorldCampaign&&state.simulation,'Enter the actual optional source branch first.');
    const current=paradiseCampaignContext(state,context);let out;
    if(command.action==='cancel'){
        const j=state.simulation.jobs.find(j=>j.id===command.id&&j.actorId==='player');
        check(j&&registry.simulation.commands.get(j.commandId)?.group===I.group&&j.cancellation==='refund','Choose your actual refundable new campaign work.');
        out=cancelSimulationJob(state,registry,j.id,current,sequence);
    }else if(['response','withdraw'].includes(command.action)){
        const session=state.simulation.sessions.player;
        check(session?.commandId===F+'goa.rescue'&&session.definitionId===I.scene&&session.targetId===P.krieg&&!session.nativeBattle,
            'Choose a response in your actual bounded gate intervention.');
        check(current.facts['paradiseCampaign.supported']===true&&state.simulation.people.player.location===L.gate&&!context.busy,
            'The actual controlled body must remain at the admitted gate scene.');
        const ctx={...current,targetId:session.targetId};
        if(command.action==='response')out=answerSimulationEncounter(state,registry,command.responseId,ctx,sequence);
        else{
            out=withdrawSimulationEncounter(state,ctx,sequence);
            const performed=state.worlds[P.goa].facts[F+'rescueOutcome']==='rescued'&&state.actors[P.hank].facts[F+'rescued']===true;
            applySimulationEffects(out,performed?paradiseCampaignPostRescueWithdrawalEffects:paradiseCampaignWithdrawalEffects,
                ctx,registry,`response:${out.state.sequence}`);
        }
    }else{
        const d=registry.simulation.commands.get(command.id);
        check(d?.actorId==='player'&&d.group===I.group&&D.commands.some(row=>row.id===d.id),'Choose a declared public campaign action.');
        check(paradiseCampaignEnrolled(state)||[F+'hub.begin',F+'goa.begin'].includes(d.id),'Read and adopt the optional extended campaign terms first.');
        check(command.targetId==null||command.targetId===d.targetId,'Meet the actual declared participant.');
        check(!context.busy,'Finish your current native activity first.');
        const ctx=paradiseCampaignContext(state,{...context,targetId:d.targetId||null}),reasons=artifactEquipmentReasons(d.costs,state,ctx);
        check(!reasons.length,reasons.join(' '));out=commitSimulationCommand(state,registry,{id:d.id},ctx,sequence);
    }
    reconcileParadiseCampaignDepthRuntime(state,out,registry);validateParadiseCampaignDepthState(out.state,registry);
    validateParadiseCampaignDepthControllers(out.state,registry);return out;
}
export function paradiseCampaignDepthPresentation(state,registry,context={}){
    if(!state.bookWorldCampaign||!state.simulation)return {sections:[]};
    const current=paradiseCampaignContext(state,context),facts=paradiseCampaignFacts(state,current),world=state.actors.player.worldId;
    const actions=projectFeatureCommands(state,registry,current,{groups:[I.group],commandType:'book_paradise_campaign'}).map(a=>{
        const d=registry.simulation.commands.get(a.id),reasons=artifactEquipmentReasons(d.costs,state,current);
        return {...a,eligible:a.eligible&&!reasons.length,reasons:[...(a.reasons||[]),...reasons],command:{...a.command,sequence:state.sequence}};
    });
    const encounter=featureEncounterControls(state,registry,current,[I.group]);
    const work=featureWorkControls(state,registry,[I.group],current);
    const controls=encounter?encounter.actions.map(a=>({...a,command:{type:'book_paradise_campaign',action:a.command.type,
        ...(a.command.responseId?{responseId:a.command.responseId}:{}),sequence:state.sequence}})):
        work.actions.map(a=>({...a,command:{type:'book_paradise_campaign',action:'cancel',id:a.command.id,sequence:state.sequence}}));
    const records=featureRecordedKnowledge(state,[F]);
    if(paradiseCampaignEnrolled(state)){
        const owned=state.simulation.powers?.player?.[I.method];
        if(owned?.owned)records.push({id:F+'own_control',text:`Your own line procedure · mastery ${owned.mastery} · ${facts['paradiseCampaign.methodFaculty']?'active':'inactive or currently unsupported'}. Control2 permits its bounded protected lift; mastery3 improves your owned bench and shelter construction. Real hands, kit, rope and local support remain required.`});
        if(facts['paradiseCampaign.bench'])records.push({id:F+'own_bench',text:'Your actually built district bench remains yours. Ordinary or mastered work consumes your own timber, effort and played time; district repair orders need the employee’s remaining means.'});
        if(facts['paradiseCampaign.shelter'])records.push({id:F+'own_shelter',text:'Your retained two-person-scale district shelter supports further real-material kit work in the same changed instance. Return does not refill it or reset people, damage, wages or orders.'});
        records.push(...Object.values(projectParadiseCampaignEffects(state,registry,current)).map(e=>({id:e.id,text:`${e.name} · ${e.duration} played min · ${e.description}`})));
    }
    if(!actions.length&&!controls.length&&!records.length||![P.hub,P.goa].includes(world))return {sections:[]};
    return {sections:[{id:F+'section',label:'Goa · craft, rescue and retained aftermath',
        description:`Finite sid20 first-Goa branch and original paid hub services. A personal bench, your own ordinary technique and useful material work continue after the arc. The optional rescue uses an explicitly proposed local ${W.assembly}–${W.deadline} minute window; opposed actors keep their own means. All new behavior remains implemented-unverified.`,
        work:encounter?.work||work.work,actions:[...actions,...controls],records}]};
}

import {check} from './basics.js';
import {BOOK_CARE_IDS as I, BOOK_CARE_CASES as C} from './book_care_content.js';
import {bookCareFacts,bookCareEnrolled,bookCareCondition,validateBookCareState,projectBookCareEffects} from './book_care_facts.js';
import {reconcileBookCareRuntime} from './book_care_runtime.js';
import {paradiseContext} from './book_world_paradise_actions.js';
import {commitSimulationCommand,cancelSimulationJob} from './simulation.js';
import {projectFeatureCommands,featureWorkControls,featureRecordedKnowledge} from './feature_expansion_host.js';
import {artifactEquipmentReasons} from './artifact_collection.js';
export function bookCareContext(state,context={}) {
    const current=paradiseContext(state,context);
    return {...current,facts:{...current.facts,...bookCareFacts(state,current)}};
}
export function commitBookCareCommand(state,registry,command,context,sequence=state.sequence) {
    check(command.type==='book_care'&&sequence===state.sequence&&(command.sequence==null||command.sequence===sequence)&&context.actorId==='player',
        'This book-care request changed. Review your current scene and supplies.');
    check(state.bookWorldCampaign&&state.simulation,'Enter the already admitted source-qualified branch before optional book care.');
    if(command.action==='cancel') {
        const job=state.simulation.jobs.find(j=>j.id===command.id&&j.actorId==='player');
        check(job&&registry.simulation.commands.get(job.commandId)?.group===I.group&&job.cancellation==='refund',
            'Choose your actual accepted refundable book-care job.');
        const out=cancelSimulationJob(state,registry,job.id,bookCareContext(state,context),sequence);
        validateBookCareState(out.state,registry);return out;
    }
    const d=registry.simulation.commands.get(command.id);
    check(d?.group===I.group&&d.actorId==='player','Choose a public known book-care action.');
    check(command.targetId==null||command.targetId===d.targetId,'Meet the actual declared consenting participant.');
    check(!context.busy,'Finish your present activity before care.');
    check(bookCareEnrolled(state)||[I.hubBegin,I.goaBegin].includes(d.id),'Open the optional book-care record first.');
    const current=bookCareContext(state,{...context,targetId:d.targetId||null,bookCareHost:true});
    const reasons=artifactEquipmentReasons(d.costs,state,current);
    check(!reasons.length,reasons.join(' '));
    const out=commitSimulationCommand(state,registry,{id:d.id},current,sequence);
    reconcileBookCareRuntime(state,out,registry);validateBookCareState(out.state,registry);return out;
}
export function bookCarePresentation(state,registry,context={}) {
    if(!state.bookWorldCampaign||!state.simulation)return {sections:[]};
    const current=bookCareContext(state,context),active=C.find(c=>c.world===state.actors.player.worldId&&state.simulation.people.player.location===c.place);
    const jobs=state.simulation.jobs.filter(j=>registry.simulation.commands.get(j.commandId)?.group===I.group);
    if(!active&&!jobs.length)return {sections:[]};
    const actions=projectFeatureCommands(state,registry,current,{groups:[I.group],commandType:'book_care'}).map(a=>{
        const d=registry.simulation.commands.get(a.id),reasons=artifactEquipmentReasons(d?.costs||[],state,current);
        return {...a,eligible:a.eligible&&!reasons.length,reasons:[...(a.reasons||[]),...reasons],command:{...a.command,sequence:state.sequence}};
    });
    const work=featureWorkControls(state,registry,[I.group],current);
    const cancels=work.actions.map(a=>({...a,command:{type:'book_care',action:'cancel',id:a.command.id,sequence:state.sequence}}));
    const records=Object.values(projectBookCareEffects(state,registry,current)).map(e=>({id:e.id,text:`${e.name} · ${e.duration} played min · ${e.description}`}));
    records.push(...featureRecordedKnowledge(state,[I.prefix]).slice(-6));
    if(active&&bookCareEnrolled(state)) {
        const c=active,a=state.actors[c.worker],f=a.facts,ownJob=state.simulation.jobs.find(j=>j.actorId===c.worker&&registry.simulation.commands.get(j.commandId)?.group===I.npcGroup);
        if(f[I.prefix+'requested']&&!f[I.prefix+'surveyDone'])records.push({id:I.prefix+c.slug+'.inspection_state',text:ownJob?`${c.hub?'The service worker':'Rin'} is performing the accepted inspection with their own reserved means.`:'The optional worker inspection waits for their own available body, stock and finite attention.'});
        if(f[I.prefix+'aidOffered'])records.push({id:I.prefix+c.slug+'.consent',text:`${c.hub?'The service worker':'Rin'} completed their own inspection and offers consent to supplied recovery. ${bookCareCondition(state,I.strain,c.worker)?'Their temporary load strain is still active.':'Their temporary strain has eased; their actually spent health/stamina remain spent.'}`});
        if(state.actors.player.completed[I.prefix+c.slug+'.aid_worker']&&!f[I.prefix+'cargoDone'])records.push({id:I.prefix+c.slug+'.cargo_state',text:ownJob?'The recovered worker is securing one actual owned cargo unit.':bookCareCondition(state,I.restored,c.worker)?'The worker can consider the requested cargo with their own remaining stock and attention.':'The disclosed recovered-work window expired before cargo completion; no cargo was granted.'});
        if(f[I.prefix+'cargoDone'])records.push({id:I.prefix+c.slug+'.cargo_done',text:'The worker completed one physical cargo handover from their actual stock. Ask for their local account; it grants no second unit.'});
    }
    return {sections:[{id:'book.care',label:'Ordinary care and prepared work',description:
        'Original optional services inside this retained-body branch. Paid service or physical preparation supports safer work. Real supplied care changes your own or the consenting worker’s body; stock, fees, effort and attention stay finite.',
        work:work.work,actions:[...actions,...cancels],records}]};
}

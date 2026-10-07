import {WORLD_COMPLETION_GROUPS} from './world_completion_content.js';
import {worldCompletionContext,validateWorldCompletionState} from './world_completion_facts.js';
import {commitWorldCompletionLifeCommand,worldCompletionLifePresentation} from './world_completion_life_host.js';
import {commitWorldCompletionLensCommand,worldCompletionLensPresentation} from './world_completion_lens_host.js';
import {commitWorldCompletionLearningCommand,worldCompletionLearningPresentation} from './world_completion_learning_host.js';
import {commitWorldCompletionMaterialsCommand,worldCompletionMaterialsPresentation} from './world_completion_materials_host.js';
import {cancelSimulationJob} from './simulation.js';
import {applySimulationEffects} from './simulation_effects.js';
const lanes=[['world_completion_life',commitWorldCompletionLifeCommand,worldCompletionLifePresentation],
    ['world_completion_lens',commitWorldCompletionLensCommand,worldCompletionLensPresentation],
    ['world_completion_learning',commitWorldCompletionLearningCommand,worldCompletionLearningPresentation],
    ['world_completion_materials',commitWorldCompletionMaterialsCommand,worldCompletionMaterialsPresentation]];
const check=(ok,text)=>{if(!ok)throw new Error(text);};
export function commitWorldCompletionCommand(state,registry,command,context,sequence=state.sequence){
    check(context.actorId==='player'&&sequence===state.sequence&&command.sequence===sequence,'This home-world request changed. Review its current controls.');
    const current=worldCompletionContext(state,context);
    if(command.action==='cancel'){
        const job=state.simulation?.jobs.find(j=>j.id===command.id),group=registry.simulation.commands.get(job?.commandId)?.group;
        check(job&&WORLD_COMPLETION_GROUPS.includes(group),'Cancel only the actual connected-world job.');
        const own=job.actorId==='player',supplied=job.actorId==='remainder_home.neri'&&group==='world_completion_learning'&&
            state.actors.player.completed['world.completion.learning.sponsor']===1&&context.facts?.location===state.simulation.people[job.actorId].location;
        check(own||supplied,'Meet the actual learner before withdrawing supported sponsored work.');
        const out=cancelSimulationJob(state,registry,job.id,{...current,actorId:job.actorId,worldCompletionLensReservation:job},sequence);
        if(supplied&&out.state.worlds['base.frontier'].facts['world.completion.learning.released']!==true){
            const release=commitWorldCompletionLearningCommand(out.state,registry,{type:'world_completion',id:context.facts?.location==='Shack'?'world.completion.learning.release_neri_shack':'world.completion.learning.release_neri',sequence:out.state.sequence},
                worldCompletionContext(out.state,{...current,actorId:'player',external:out.external,gameplay:out.gameplay,vitals:out.vitals,equipment:out.equipment}),out.state.sequence);
            release.acquisitions=[...(out.acquisitions||[]),...(release.acquisitions||[])];release.unlocks=[...(out.unlocks||[]),...(release.unlocks||[])];
            validateWorldCompletionState(release.state,registry);return release;
        }
        validateWorldCompletionState(out.state,registry);return out;
    }
    const group=registry.simulation.commands.get(command.id)?.group,lane=lanes.find(([id])=>id===group);
    check(lane,'Choose a known connected-world control.');
    const out=lane[1](state,registry,command,{...current,worldCompletionHost:true,worldCompletionLensCustody:1},sequence);
    validateWorldCompletionState(out.state,registry);return out;
}
export function worldCompletionPresentation(state,registry,context={}){
    const current={...worldCompletionContext(state,context),worldCompletionLensCustody:1},sections=[];
    for(const [, ,present] of lanes)for(const section of present(state,registry,current).sections||[]){
        section.actions=(section.actions||[]).map(a=>({...a,command:{...a.command,type:'world_completion',sequence:state.sequence}}));sections.push(section);
    }
    const npc=state.simulation?.jobs.find(j=>j.actorId==='remainder_home.neri'&&j.commandId.startsWith('world.completion.learning.'));
    if(npc&&state.actors.player.completed['world.completion.learning.sponsor']===1&&context.facts?.location===state.simulation.people[npc.actorId].location)
        sections.push({id:'world.completion.sponsored_work',label:'Your sponsored learner’s accepted work',description:'Cancel the disclosed unfinished work and release the new agenda. Reservations return to Neri first; only unchanged unearned escrow can be withdrawn separately.',
            actions:[{id:'cancel:'+npc.id,label:'Cancel the sponsored work · return Neri’s reservations',eligible:true,reasons:[],command:{type:'world_completion',action:'cancel',id:npc.id,sequence:state.sequence}}],records:[]});
    return {sections};
}

// Construction contributions and staff orders use the existing simulation jobs.
// Homes keep physical project material custody, never a second due-time queue.
import {HOME_WORLD} from './home_content.js';
import {homeWorkDefinitions} from './home_work_content.js';
import {createSimulationRegistry,createSimulationState} from './simulation_contracts.js';
import {applySimulationEffects} from './simulation_effects.js';
import {commitSimulationCommand,cancelSimulationJob,previewSimulationCommand} from './simulation.js';
export function registerHomeWork(registry) {
    if(!registry)return;const built=createSimulationRegistry(homeWorkDefinitions);
    for(const family of ['people','commands','conditions','events'])for(const [id,d]of built[family]){if(registry.simulation[family].has(id))throw Error('Duplicate home work definition.');registry.simulation[family].set(id,d);}
}
export function ensureHomeSimulation(plan,location,body) {
    plan.state.simulation ||= {...createSimulationState(),enrolledAt:plan.state.clock};
    plan.state.simulation.people.player ||= {life:'alive',inventory:'native',location,bornAt:plan.state.clock};
    if(body&&!plan.state.simulation.people.player.body)plan.state.simulation.people.player.body=structuredClone(body);
}
export function homeJobContext(plan,c,actorId='player') {return {actorId,worldId:HOME_WORLD,external:plan.external,gameplay:plan.gameplay,busy:false,
    facts:{...c.facts,location:actorId==='player'?c.location:plan.state.simulation?.people[actorId]?.location}};}
export function applyHomeSimulationEffects(plan,effects,registry,c) {
    if(!effects?.length)return;ensureHomeSimulation(plan,c.location,c.body);plan.acquisitions ||= [];plan.unlocks ||= [];
    applySimulationEffects(plan,effects,homeJobContext(plan,c),registry,`home:${plan.state.sequence}`);
}
export function stageHomeJob(plan,request,registry,c) {
    ensureHomeSimulation(plan,c.location,c.body);
    const ctx={...homeJobContext(plan,c,request.actor||'player'),targetId:registry.simulation.commands.get(request.id)?.targetId};
    const next=request.cancel?cancelSimulationJob(plan.state,registry,request.cancel,ctx):commitSimulationCommand(plan.state,registry,{id:request.id},ctx);
    Object.assign(plan,{state:next.state,gameplay:next.gameplay,external:next.external});
    plan.unlocks=[...(plan.unlocks||[]),...(next.unlocks||[])];plan.acquisitions=[...(plan.acquisitions||[]),...(next.acquisitions||[])];
}
export function previewHomeJob(plan,request,registry,c) {return previewSimulationCommand(plan.state,registry,request.id,{...homeJobContext(plan,c,request.actor||'player'),targetId:registry.simulation.commands.get(request.id)?.targetId});}

// Shared Gu keeper life-start builder (AD54: tests share life-start builders). Same setup as tests/gu_upkeep.test.js, which can move onto it.
import {createHash} from 'node:crypto';
import {guKeeperLife as raw, kId as id} from "../../src/world_packs/book_gu_keeper.js";
import {createContentRegistry, createExpansionState, advanceSimulation} from '../../src/expansion_engine.js';
import {compileStructuredPack, mergeStructuredPack} from '../../src/structured_pack_definitions.js';
import {planStructuredSelection, beginStructuredCampaign} from '../../src/structured_pack_runtime.js';
import {commitSimulationCommand, cancelSimulationJob, previewSimulationCommand} from '../../src/simulation.js';
import {writeGameplayToEnvelope} from '../../src/gameplay_transactions.js';
export const hash = o => 'sha256:' + createHash('sha256').update(JSON.stringify(o)).digest('hex');
export function setup(seed = 717) {
    const registry = createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]});
    const compiled = compileStructuredPack(raw, registry); mergeStructuredPack(compiled, registry);
    const d = {...compiled.definition, contentHash:hash(raw), starts:raw.starts.map(b => ({...b,snapshotHash:hash(b)}))};
    const base = createExpansionState(seed), nativeBody = {id:'native.body',ownerId:'player',controllerId:'player',form:'human',lifeStage:'adult'};
    const context = {registry,actorId:'player',worldId:'base.frontier',nativeAlive:true,nativeReady:true,nativeBody,busy:false,facts:{location:'Village'},external:{money:0},
        gameplay:{player:{inventory:{},skills:{Woodcutting:{xp:0,enabled:false}},reputation:{}}},vitals:{player:{health:100,max_health:100,stamina:100,max_stamina:100}},equipment:{player:{}}};
    const selected = planStructuredSelection(base,d,context), start = beginStructuredCampaign(selected.plan.state,d,context,null,selected.selection);
    let p = start.plan;
    const ctx = () => ({...context,worldId:d.world.id,nativeBody:p.state.simulation.people.player.body,facts:{location:id('annex')},external:p.external,gameplay:p.gameplay,vitals:p.vitals});
    const publish = out => {const vitals = p.vitals; p = {...out,vitals:out.vitals||vitals}; for(const e of out.unlocks||[])if(e.kind==='skill')p.gameplay.player.skills[e.id].enabled=true;};
    return {registry,d,record:start.record,base,context,ctx,get p(){return p;},
        start(n) {const c=d.simulation.commands.find(c=>c.id===id(n));publish(commitSimulationCommand(p.state,registry,{id:id(n)},{...ctx(),targetId:c?.targetId}));},
        quote(n) {const c=d.simulation.commands.find(c=>c.id===id(n));return previewSimulationCommand(p.state,registry,id(n),{...ctx(),targetId:c?.targetId});},
        step(n) {publish(advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...ctx(),vitals:p.vitals.player,equipment:{}}}));},
        cancel() {publish(cancelSimulationJob(p.state,registry,p.state.simulation.jobs[0].id,ctx()));},
        envelope() {const save={character:{money:0,equipment:{}},expansion:p.state,content_packs:{schema:1,packs:{},structured:start.record},'current location':id('annex'),inventories:{person:{main_character:{}}},levels:{person:{main_character:{}}}};
            writeGameplayToEnvelope(save,p.gameplay,{player:{category:'person',id:'main_character'}});return save;}
    };
}

const reserve = f => f.p.state.simulation.energies.player[id('primeval')].reserve;

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createContentRegistry,createExpansionState,advanceSimulation,loadExpansionState} from '../src/expansion_engine.js';
import {createStructuredNativeRegistration} from '../src/structured_native_registration.js';
import {planStructuredSelection,beginStructuredCampaign,adoptStructuredExtension} from '../src/structured_pack_runtime.js';
import {requireStructuredContent} from '../src/structured_pack_state.js';
import {previewSimulationCommand,commitSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {paradiseLeadLife,paradiseLeadId as baseId} from '../src/world_packs/book_paradise_lead_life.js';
import {registerParadiseLeadRoof,PARADISE_ROOF,paradiseRoofId as id} from '../src/world_packs/book_paradise_lead_roof.js';
async function setup(raw=paradiseLeadLife) {
    const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]}),definitions=new Map();
    const register=createStructuredNativeRegistration({registry,definitions,locations:{},items:{},inventories:{},availabilities:{},
        makeLocation:l=>({...l,connected_locations:[]}),makeItem:i=>({...i}),makeInventory:()=>({})});
    const d=await register(raw),e=await registerParadiseLeadRoof(register,d);
    const initial={registry,actorId:'player',worldId:'base.frontier',nativeAlive:true,nativeReady:true,busy:false,
        nativeBody:{id:'native.body',ownerId:'player',controllerId:'player',form:'human',lifeStage:'adult'},facts:{location:'Village'},external:{money:0},
        gameplay:{player:{inventory:{},skills:{},reputation:{}}},vitals:{player:{health:60,max_health:60,stamina:40,max_stamina:40}},equipment:{player:{}}};
    const selected=planStructuredSelection(createExpansionState(717),d,initial),begun=beginStructuredCampaign(selected.plan.state,d,initial,null,selected.selection);
    let plan=begun.plan,record=begun.record;
    const baseNames=new Set(d.simulation.commands.map(c=>c.id.slice(baseId('').length)));
    const cid=name=>baseNames.has(name)?baseId(name):id(name);
    const context=()=>{const p=plan.state.simulation.people.player;return {...initial,worldId:d.world.id,nativeBody:p.body,facts:{location:p.location},
        external:plan.external,gameplay:plan.gameplay,vitals:plan.vitals||initial.vitals,structuredNative:{...record,bound:true,bodyId:p.body.id}};};
    const run={get state(){return plan.state;},get record(){return record;},get location(){return plan.state.simulation.people.player.location;},
        quote:n=>previewSimulationCommand(plan.state,registry,cid(n),context()),
        act(n){plan=commitSimulationCommand(plan.state,registry,{id:cid(n)},context());},
        step(n=1){plan=advanceSimulation(plan.state,registry,n,plan.external,plan.gameplay,{player:{...context(),vitals:(plan.vitals||initial.vitals).player}});},
        finish(n,t=1){this.act(n);this.step(t);},
        cancel(){plan=cancelSimulationJob(plan.state,registry,plan.state.simulation.jobs[0].id,context());},
        reload(){plan.state=loadExpansionState(JSON.parse(JSON.stringify(plan.state)),registry);requireStructuredContent(record,definitions,plan.state);},
        admit(){const next=adoptStructuredExtension(plan.state,d,record,{id:PARADISE_ROOF,revision:e.revision,contentHash:e.contentHash},context());record=next.record;plan={...plan,...next.plan};}};
    for(const a of ['ask_terms','sign','treatment','awakening','transfer','read_arrival','open_brand'])run.act(a);
    run.finish('read_personal');run.finish('read_trial');
    return run;
}
const known=(r,n)=>r.state.simulation.knowledge.player[id(n)];
test('leaving an unfinished first listen gives no free report, and the same opening remains reachable',async()=>{
    const r=await setup();r.admit();const originalDeadline=r.state.simulation.situations[baseId('trial_time')].deadline;
    r.finish('climb');r.act('listen');r.step();r.reload();r.cancel();r.act('withdraw');
    assert.equal(r.location,baseId('house'));assert.equal(known(r,'heard'),undefined);
    assert.equal(r.state.clock,4);assert.equal(r.state.simulation.situations[baseId('trial_time')].deadline,originalDeadline);
    r.finish('climb');r.finish('listen',2);assert.ok(known(r,'heard'));assert.equal(r.state.clock,7);
    assert.equal(r.quote('listen').eligible,false);
});
test('withdrawing after hearing keeps the attributed clue without establishing territorial ownership or safe passage',async()=>{
    const r=await setup();r.admit();r.finish('climb');r.finish('listen',2);r.act('withdraw');r.reload();
    assert.match(known(r,'heard').value,/claims/);assert.match(known(r,'heard').value,/Toby/);
    assert.equal(r.location,baseId('house'));assert.equal(known(r,'interruption'),undefined);
    assert.equal(r.state.worlds[baseId('world')].facts[id('arrival_observed')],undefined);
    assert.equal(r.quote('climb').eligible,true);assert.deepEqual(r.state.actors.player.resources,{});
});
test('stopping the longer wait does not create the newcomer; completed wait records an unidentified interruption once',async()=>{
    const r=await setup();r.admit();r.finish('climb');r.finish('listen',2);
    r.act('listen_further');r.step();r.reload();r.cancel();
    assert.equal(known(r,'interruption'),undefined);assert.equal(r.state.worlds[baseId('world')].facts[id('arrival_observed')],undefined);
    r.finish('listen_further',3);r.reload();assert.match(known(r,'interruption').value,/not learned who/);
    assert.equal(r.state.worlds[baseId('world')].facts[id('arrival_observed')],true);
    assert.equal(r.quote('listen_further').eligible,false);r.act('withdraw');assert.equal(r.location,baseId('house'));
    assert.equal(r.quote('climb').eligible,true);
});
test('original pre-copy Su identity can admit the continuation and preserve its trial deadline across reload',async()=>{
    const old=JSON.parse(fs.readFileSync(new URL('./fixtures/paradise_opening_before_retrospective.json',import.meta.url),'utf8'));
    const r=await setup(old),pair={hash:r.record.contentHash,start:r.record.snapshotHash},deadline=r.state.simulation.situations[baseId('trial_time')].deadline;
    r.admit();r.reload();r.finish('climb');r.finish('listen',2);r.reload();
    assert.equal(r.record.contentHash,pair.hash);assert.equal(r.record.snapshotHash,pair.start);
    assert.equal(r.state.simulation.situations[baseId('trial_time')].deadline,deadline);
});

import {commitSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createContentRegistry,createExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {compileStructuredPack,mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection,beginStructuredCampaign} from '../src/structured_pack_runtime.js';
import {validateStructuredSelection,requireStructuredSelection,requireStructuredContent,validateStructuredEnvelope} from '../src/structured_pack_state.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
const hash=value=>'sha256:'+createHash('sha256').update(JSON.stringify(value)).digest('hex');
function raw() {
    return {schema:2,id:'origins',revision:1,compatibility:{legacy:'preserve-dormant',origin:'mandatory'},capabilities:['native-stock'],world:{id:'origins.world',label:'Synthetic shared realm'},locations:[{id:'origins.first',label:'First room',description:'Synthetic room.'},{id:'origins.second',label:'Second room',description:'Synthetic room.'}],items:[{id:'origins.tool',label:'Tool',description:'Synthetic tool.'}],simulation:{people:[]},presentation:{people:{},status:[]},starts:[
        {id:'origins.first.start',locationId:'origins.first',description:'First synthetic beginning.',body:{id:'origins.first.body',form:'human',ownerId:'player',controllerId:'player',hands:2},effects:[{type:'item',actor:'player',key:JSON.stringify({id:'origins.tool'}),amount:1}]},
        {id:'origins.second.start',locationId:'origins.second',description:'Second synthetic beginning.',body:{id:'origins.second.body',form:'human',ownerId:'player',controllerId:'player',hands:1},effects:[{type:'resource',key:'coins',amount:5}]}
    ]};
}
function setup(seed=123,input=raw()) {
    const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]}),compiled=compileStructuredPack(input,registry);mergeStructuredPack(compiled,registry);
    const d={...compiled.definition,contentHash:hash(input),starts:compiled.definition.starts.map(b=>({...b,snapshotHash:hash(b)}))};
    const state=createExpansionState(seed),context={registry,actorId:'player',worldId:'base.frontier',external:{money:0},gameplay:{player:{inventory:{},skills:{},reputation:{}}},vitals:{player:{health:10,stamina:10,max_health:10,max_stamina:10}},facts:{location:'Village'},nativeBody:{id:'native.player.body',form:'human',ownerId:'player',controllerId:'player'},busy:false,nativeBody:{form:'human',ownerId:'player',controllerId:'player',lifeStage:'adult'},nativeAlive:true};
    return {d,state,context};
}
const envelope=(plan,selection,record=null)=>({expansion:plan.state,content_packs:{schema:1,packs:{},...(selection?{pendingStructured:selection}:{}),...(record?{structured:record}:{})},'current location':record?.locationId||'Village',character:{money:0},inventories:{person:{main_character:{}}},levels:{person:{main_character:{}}}});
const bindings={player:{category:'person',id:'main_character'}};

test('durable typed selection stages only sequence, publishes no body, stock, actors or world',()=>{
    const f=setup(),before=structuredClone(f.state),{plan,selection}=planStructuredSelection(f.state,f.d,f.context);
    const expected=structuredClone(before);expected.sequence++;
    assert.deepEqual(plan.state,expected);assert.deepEqual(f.state,before);assert.deepEqual(plan.gameplay,f.context.gameplay);
    validateStructuredEnvelope(envelope(plan,selection));
    assert.deepEqual(planStructuredSelection(f.state,f.d,f.context).selection,selection);
    assert.throws(()=>beginStructuredCampaign(f.state,f.d,f.context,null),/durable/);
});

test('both equal seed ranges select genuinely distinct snapshots and restore exact origin',()=>{
    for(const [seed,index] of [[123,0],[0xffffffff,1]]) {
        const f=setup(seed),chosen=planStructuredSelection(f.state,f.d,f.context),{plan,record}=beginStructuredCampaign(chosen.plan.state,f.d,f.context,null,chosen.selection);
        assert.equal(record.schema,2);assert.equal(record.choice,index);assert.equal(record.originSequence,chosen.plan.state.sequence);assert.equal(plan.state.sequence,chosen.plan.state.sequence);
        assert.equal(plan.state.simulation.people.player.body.hands,index===0?2:1);
        assert.equal(plan.state.simulation.people.player.life,'alive');
        assert.equal(plan.nativeLocation,f.d.starts[index].locationId);
        const saved=envelope(plan,null,record);validateStructuredEnvelope(saved);requireStructuredContent(JSON.parse(JSON.stringify(record)),new Map([[f.d.id,f.d]]));
        const restored=JSON.parse(JSON.stringify(saved));validateStructuredEnvelope(restored);
        restored.expansion.simulation.people.player.body.hands=3;validateStructuredEnvelope(restored);
        restored.expansion.simulation.people.player.life='incapacitated';validateStructuredEnvelope(restored);
        restored.expansion.simulation.people.player.body.id='origins.wrong.body';assert.throws(()=>validateStructuredEnvelope(restored),/identity/);
        assert.throws(()=>beginStructuredCampaign(plan.state,f.d,f.context,record,chosen.selection),/unoccupied|initialized/);
    }
});

test('failed selection and initialization writes preserve live state and exact retry receipt',()=>{
    const f=setup(),chosen=planStructuredSelection(f.state,f.d,f.context),baseline=envelope({state:f.state},null),bytes=JSON.stringify(baseline);
    chosen.plan.nativePatch={content_packs:{...baseline.content_packs,pendingStructured:chosen.selection}};
    const options={createSave:()=>bytes,key:'synthetic',bindings,validateEnvelope:validateStructuredEnvelope};
    assert.throws(()=>persistExpansionPlan(chosen.plan,{...options,storage:{setItem(){throw Error('write refused');}}}),/write refused/);
    assert.equal(f.state.sequence,0);assert.equal(JSON.stringify(baseline),bytes);
    let durable;
    persistExpansionPlan(chosen.plan,{...options,storage:{setItem(k,v){durable=v;}}});
    const pending=JSON.parse(durable);validateStructuredEnvelope(pending);requireStructuredSelection(pending.content_packs.pendingStructured,new Map([[f.d.id,f.d]]));
    const begun=beginStructuredCampaign(pending.expansion,f.d,f.context,null,pending.content_packs.pendingStructured);
    begun.plan.nativePatch.content_packs={...pending.content_packs,pendingStructured:null,structured:begun.record};
    assert.throws(()=>persistExpansionPlan(begun.plan,{...options,createSave:()=>durable,storage:{setItem(){throw Error('initialization refused');}}}),/initialization refused/);
    assert.equal(JSON.stringify(pending),durable);
    const retried=beginStructuredCampaign(pending.expansion,f.d,f.context,null,pending.content_packs.pendingStructured);
    retried.plan.nativePatch.content_packs=begun.plan.nativePatch.content_packs;
    assert.deepEqual(retried,begun);
});

test('selection tampering, absent content and incompatible exact snapshots refuse without mutation',()=>{
    const f=setup(),chosen=planStructuredSelection(f.state,f.d,f.context),definitions=new Map([[f.d.id,f.d]]);
    for(const mutate of [r=>r.choice=1,r=>r.bodyId='origins.wrong',r=>r.snapshotHash='sha256:'+'b'.repeat(64),r=>r.startId=f.d.starts[1].id,r=>r.originSequence=2,r=>r.seed=0]) {
        const r=structuredClone(chosen.selection);mutate(r);assert.throws(()=>{validateStructuredSelection(r);requireStructuredSelection(r,definitions);beginStructuredCampaign(chosen.plan.state,f.d,f.context,null,r);});
    }
    assert.throws(()=>requireStructuredSelection(chosen.selection,new Map()),/Restore/);
    const changed={...f.d,contentHash:'sha256:'+'c'.repeat(64)};assert.throws(()=>requireStructuredSelection(chosen.selection,new Map([[changed.id,changed]])),/Restore/);
    const saved=structuredClone(envelope(chosen.plan,chosen.selection));saved.expansion.actors.player.worldId=f.d.world.id;assert.throws(()=>validateStructuredEnvelope(saved),/Pending/);
    assert.equal(chosen.plan.state.actors.player.worldId,'base.frontier');
});

test('compiler checks duplicate starts, arbitrary body patches and unknown first-action references',()=>{
    for(const mutate of [r=>r.starts[1].id=r.starts[0].id,r=>r.starts[0].body.controllerId='someone',r=>r.starts[0].body.hands={value:2},r=>r.starts[0].effects.push({type:'body',key:'id',value:'origins.wrong'}),r=>r.starts[0].effects.push({type:'source',sourceId:'origins.absent',operation:'grant'}),r=>r.starts[0].effects.push({type:'relocate',location:'origins.absent'})]) {
        const r=raw();mutate(r);assert.throws(()=>compileStructuredPack(r));
    }
});

test('legacy single bootstrap keeps schema1 sequence and body contract',()=>{
    const f=setup(),d={...f.d,bootstrap:{...f.d.starts[0]}};delete d.starts;
    const {plan,record}=beginStructuredCampaign(f.state,d,f.context,null);
    assert.equal(record.schema,1);assert.equal(record.originSequence,1);assert.equal(plan.state.sequence,1);assert.deepEqual(plan.state.simulation.people.player.body,f.context.nativeBody);
    requireStructuredContent(record,new Map([[d.id,d]]));validateStructuredEnvelope(envelope(plan,null,record));
});


test('native combat locations require a distinct owned peaceful parent',()=>{
    const r=raw();r.locations[1].combat={enemyIds:['Synthetic existing enemy'],parentId:r.locations[0].id};
    assert(compileStructuredPack(r));
    for(const change of [c=>c.parentId='outside.room',c=>c.parentId=r.locations[1].id,c=>c.enemyIds=[],c=>c.rewards={coins:10}]) {
        const invalid=structuredClone(r);change(invalid.locations[1].combat);assert.throws(()=>compileStructuredPack(invalid),/combat/);
    }
    const invalid=structuredClone(r);invalid.locations[0].combat={enemyIds:['Synthetic existing enemy'],parentId:r.locations[1].id};assert.throws(()=>compileStructuredPack(invalid),/combat/);
});


test('typed selection cannot revive an unconscious body or reissue prior pack actors and sources',()=>{
    for(const mutate of [f=>f.context.nativeAlive=false,f=>f.context.vitals.player.health=0,f=>f.state.actors['origins.person']={},f=>f.state.actors.player.sources['origins.source']={},f=>f.state.simulation={jobs:[],claims:{'origins.title':{owner:'player'}}}]) {
        const f=setup();mutate(f);assert.throws(()=>planStructuredSelection(f.state,f.d,f.context),/living|initialized/);
    }
    const f=setup(),chosen=planStructuredSelection(f.state,f.d,f.context);
    const saved=structuredClone(envelope(chosen.plan,chosen.selection));saved.expansion.actors.player.sources['origins.source']={};assert.throws(()=>validateStructuredEnvelope(saved),/published/);
    f.context.nativeAlive=false;assert.throws(()=>beginStructuredCampaign(chosen.plan.state,f.d,f.context,null,chosen.selection),/living/);
});


test('schema2 permits declared undeployed empty owners, refuses invented stock and keeps legacy strict',()=>{
    const f=setup(),chosen=planStructuredSelection(f.state,f.d,f.context),begun=beginStructuredCampaign(chosen.plan.state,f.d,f.context,null,chosen.selection);
    const record={...begun.record,containerBindings:[{id:'origins.compartment',category:'storage',holder:'player',revision:1}]},saved=envelope(begun.plan,null,record);
    saved.inventories.storage={'origins.compartment':{}};validateStructuredEnvelope(saved);
    saved.inventories.storage['origins.compartment'][JSON.stringify({id:'origins.tool'})]={count:1};assert.throws(()=>validateStructuredEnvelope(saved),/Undeployed/);
    saved.inventories.storage['origins.compartment']={};saved.content_packs.structured.schema=1;assert.throws(()=>validateStructuredEnvelope(saved),/owner/);
});

test('typed admission refuses incompatible native form and authored life stage before selection',()=>{const f=setup();const old=structuredClone(f.state);assert.throws(()=>planStructuredSelection(f.state,f.d,{...f.context,nativeBody:{...f.context.nativeBody,form:'elf'}}),/compatible native/);f.d={...f.d,admission:{forms:['human'],lifeStages:['adult']}};assert.throws(()=>planStructuredSelection(f.state,f.d,{...f.context,nativeBody:{...f.context.nativeBody,lifeStage:'young'}}),/compatible native/);assert.deepEqual(f.state,old);});

test('current selected native lifetime is scoped to committed instance and retained through restoration',()=>{const f=setup(),chosen=planStructuredSelection(f.state,f.d,f.context),begun=beginStructuredCampaign(chosen.plan.state,f.d,f.context,null,chosen.selection);assert.equal(begun.record.lifeId,begun.record.instanceId+'.life');const saved=envelope(begun.plan,null,begun.record);validateStructuredEnvelope(saved);saved.expansion.simulation.people.player.lifeId='origins.other.life';assert.throws(()=>validateStructuredEnvelope(saved),/lifetime/);});

test('timed native route publishes exact arrival only after supported completion and cancellation retains origin',()=>{
 const input=raw();input.simulation.commands=[{id:'origins.travel',revision:1,label:'Travel',worldId:'origins.world',actorId:'player',location:'origins.first',audience:['$actor'],duration:3,cancellation:'refund',completionFailure:'refund',completionRequires:{fact:'body.mobile',op:'eq',value:true},effects:[{type:'relocate',location:'origins.second'}]}];input.starts[0].body.mobile=true;
 const f=setup(123,input),selected=planStructuredSelection(f.state,f.d,f.context),begun=beginStructuredCampaign(selected.plan.state,f.d,f.context,null,selected.selection),context={...f.context,worldId:'origins.world',facts:{location:'origins.first'},gameplay:begun.plan.gameplay,structuredNative:{...begun.record,bound:true}};
 const started=commitSimulationCommand(begun.plan.state,context.registry,{id:'origins.travel'},context);
 const early=advanceSimulation(started.state,context.registry,2,started.external,started.gameplay,{player:context});assert.equal(early.nativeLocation,undefined);assert.equal(early.state.simulation.people.player.location,'origins.first');
 const done=advanceSimulation(early.state,context.registry,1,early.external,early.gameplay,{player:context});assert.equal(done.nativeLocation,'origins.second');assert.equal(done.nativePatch['current location'],'origins.second');
 const cancelled=cancelSimulationJob(started.state,context.registry,started.commitment.id,context);assert.equal(cancelled.state.simulation.people.player.location,'origins.first');
 const changed=structuredClone(started.state);changed.simulation.people.player.body.mobile=false;
 const failed=advanceSimulation(changed,context.registry,3,started.external,started.gameplay,{player:context});assert.equal(failed.state.simulation.people.player.location,'origins.first');assert.equal(failed.nativeLocation,undefined);
});

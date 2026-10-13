import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createFoundationStartContent,FOUNDATION_START_IDS as I} from '../src/foundation_start_content.js';
import {createContentRegistry,createExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {compileStructuredPack,mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection,beginStructuredCampaign} from '../src/structured_pack_runtime.js';
import {previewSimulationCommand,commitSimulationCommand} from '../src/simulation.js';
import {projectStructuredEquipment} from '../src/structured_equipment_runtime.js';
import {previewStructuredRenewal,commitStructuredRenewal} from '../src/structured_renewal.js';
const key=id=>JSON.stringify({id});
const hash=v=>'sha256:'+createHash('sha256').update(JSON.stringify(v)).digest('hex');
function setup(seed=1) {
    const raw=createFoundationStartContent(),registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]});
    const compiled=compileStructuredPack(raw,registry);mergeStructuredPack(compiled,registry);
    const d={...compiled.definition,contentHash:hash(raw),starts:raw.starts.map(b=>({...b,snapshotHash:hash(b)}))};
    const c={registry,actorId:'player',worldId:'base.frontier',facts:{location:'Village'},external:{money:0},
        gameplay:{player:{inventory:{},skills:{},reputation:{}}},vitals:{player:{health:10,max_health:10,stamina:10,max_stamina:10}},
        nativeBody:{id:'native.player.body',ownerId:'player',controllerId:'player',form:'human',lifeStage:'adult',hands:2,mobile:true},nativeAlive:true,nativeReady:true,busy:false};
    const selected=planStructuredSelection(createExpansionState(seed),d,c);
    const {plan,record}=beginStructuredCampaign(selected.plan.state,d,c,null,selected.selection);
    return {d,registry,plan,record,c:{...c,worldId:I.world,facts:{location:I.room},nativeBody:plan.state.simulation.people.player.body}};
}
const context=(f,p=f.plan)=>({...f.c,gameplay:p.gameplay,external:p.external,vitals:p.vitals,nativeBody:p.state.simulation.people.player.body});
const act=(f,id,p=f.plan)=>commitSimulationCommand(p.state,f.registry,{id},context(f,p),p.state.sequence);
const finish=(f,p,min)=>advanceSimulation(p.state,f.registry,min,p.external,p.gameplay,{player:context(f,p)});
const worn=(f,p)=>projectStructuredEquipment({definitions:f.d.items,equipment:{torso:key(I.coat)},state:p.state,
    body:p.state.simulation.people.player.body,facts:Object.fromEntries(Object.entries(p.state.actors.player.facts).map(([k,v])=>['actor.'+k,v]))});

test('two typed living starts compile without native identity changes and admit a useful one-hand alternative',()=>{
    for(const [seed,hands] of [[1,2],[0xffffffff,1]]) {
        const f=setup(seed),body=f.plan.state.simulation.people.player.body;
        assert.equal(body.hands,hands);assert.equal(body.ownerId,'player');assert.equal(body.controllerId,'player');
        assert.notEqual(body.id,'player');assert.equal(f.record.bodyInstanceId,body.instanceId);
        assert.equal(f.plan.external.money,0);assert.equal(f.plan.gameplay.player.inventory[key(I.blank)],2);
        assert.equal(f.plan.nativePatch.character,undefined);
        assert.equal(previewSimulationCommand(f.plan.state,f.registry,I.twoHand,context(f)).eligible,hands===2);
        assert.equal(previewSimulationCommand(f.plan.state,f.registry,I.oneHand,context(f)).eligible,true);
    }
});

test('loss of live hand support stops accepted work, refunds its actual blank and awards no output or practice',()=>{
    const f=setup(),started=act(f,I.twoHand);
    assert.equal(started.gameplay.player.inventory[key(I.blank)],1);
    started.state.simulation.people.player.body.hands=1;
    const stopped=finish(f,started,2);
    assert.equal(stopped.gameplay.player.inventory[key(I.blank)],2);
    assert.equal(stopped.gameplay.player.inventory[key(I.clasp)]||0,0);
    assert.equal(stopped.state.actors.player.facts[I.method],1);
    assert.equal(stopped.state.actors.player.resources[I.reserve]||0,0);
    assert.equal(stopped.state.simulation.jobs.length,0);
});

test('one-hand output is consumed in real refit and changes only actual worn garment protection',()=>{
    const f=setup(0xffffffff),made=finish(f,act(f,I.oneHand),3);
    assert.equal(made.gameplay.player.inventory[key(I.clasp)],1);
    assert.equal(worn(f,made).defenseByKey[key(I.coat)],0.5);
    const noCoat=structuredClone(made);delete noCoat.gameplay.player.inventory[key(I.coat)];
    assert.equal(previewSimulationCommand(noCoat.state,f.registry,I.refit,context(f,noCoat)).eligible,false);
    const fitted=finish(f,act(f,I.refit,made),1);
    assert.equal(fitted.gameplay.player.inventory[key(I.clasp)]||0,0);
    assert.equal(fitted.gameplay.player.inventory[key(I.coat)],1);
    assert.equal(worn(f,fitted).defenseByKey[key(I.coat)],2);
    assert.equal(projectStructuredEquipment({definitions:f.d.items,equipment:{},state:fitted.state}).weight,0);
});

test('earned renewal preserves actual carriers, resets exact practice owners once and allows continued useful work',()=>{
    const f=setup(),made=finish(f,act(f,I.twoHand),2);
    assert.equal(previewStructuredRenewal(made.state,f.d,context(f,made)).eligible,false);
    const fitted=finish(f,act(f,I.refit,made),1),before=structuredClone(fitted);
    assert.equal(previewStructuredRenewal(fitted.state,f.d,context(f,fitted)).eligible,true);
    const renewed=commitStructuredRenewal(fitted.state,f.d,context(f,fitted));
    assert.equal(renewed.state.actors.player.facts[I.method],1);assert.equal(renewed.state.actors.player.resources[I.reserve],0);
    assert.deepEqual(renewed.state.simulation.people,before.state.simulation.people);
    assert.deepEqual(renewed.state.simulation.knowledge,before.state.simulation.knowledge);
    assert.deepEqual(renewed.gameplay,before.gameplay);assert.equal(renewed.state.actors.player.facts[I.legacy],1);
    assert.throws(()=>commitStructuredRenewal(renewed.state,f.d,context(f,renewed)),/already/);
    const continued=finish(f,act(f,I.twoHand,renewed),2);
    assert.equal(continued.gameplay.player.inventory[key(I.clasp)],1);
    assert.equal(continued.state.actors.player.facts[I.method],2);
    assert.equal(continued.state.actors.player.resources[I.reserve],1);
});

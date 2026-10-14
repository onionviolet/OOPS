import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,loadExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {beginBodyRecord} from '../src/body_progression.js';
import {beginFeatureObjects,commitFeatureObjectCommand,featureObjectPresentation,previewFeatureObjectCommand} from '../src/feature_expansion_objects_host.js';
import {cancelSimulationJob} from '../src/simulation.js';
import {FEATURE_OBJECT_KEYS as K,FEATURE_OBJECT_IDS as I} from '../src/feature_expansion_objects.js';
import {earnedDryingTracker,DRYING_REWARD_ID as reward} from '../src/earned_drying_tracker.js';

// Controlled SOURCE fixtures. Native acquisition is checked separately in browser.
const body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
const ctx=p=>({actorId:'player',external:p.external,gameplay:p.gameplay,vitals:p.vitals||{player:{health:100,max_health:100,stamina:100,max_stamina:100}},
    facts:{location:'Village','village.elderMet':true,'village.craftsmanMet':true},nativeBody:body,nativeAlive:true,nativeReady:true});
function base(){return {state:initializeExpedition(createExpansionState(17)),external:{money:100},gameplay:{player:{inventory:{},skills:{},reputation:{}}}};}
function opened(){let p=base();p=beginBodyRecord(p.state,registry,ctx(p));p.state.simulation.people.player.body=structuredClone(body);p=beginFeatureObjects(p.state,registry,ctx(p));p.gameplay.player.inventory[K.wet]=8;return p;}
const act=(p,id)=>commitFeatureObjectCommand(p.state,registry,{id},ctx(p));
const advance=(p,n)=>{const c=ctx(p);return advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});};
const dry=p=>advance(act(p,'feature_objects.dry_shade'),6);
const restore=p=>({...structuredClone(p),state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry)});
const stock=(p,k)=>p.gameplay.player.inventory[k]||0;

test('LP8 SOURCE unseen activity has no tracker or collection action; inspection is pure',()=>{
    const p=base(),before=structuredClone(p);
    assert.equal(earnedDryingTracker(p.state),null);
    assert(!featureObjectPresentation(p.state,registry,ctx(p)).actions.some(a=>a.id===reward));
    assert.deepEqual(p,before);
    const q=opened(),snapshot=structuredClone(q);
    for(let i=0;i<8;i++){featureObjectPresentation(q.state,registry,ctx(q));previewFeatureObjectCommand(q.state,registry,reward,ctx(q));}
    assert.deepEqual(q,snapshot);assert.equal(earnedDryingTracker(q.state).progress,0);
});
test('LP8 SOURCE only paid completed batches count; pending, cancellation and unrelated inspection do not',()=>{
    let p=opened();assert.throws(()=>act(p,reward));
    p=act(p,'feature_objects.dry_shade');assert.equal(earnedDryingTracker(p.state).completed,0);assert.equal(stock(p,K.wet),7);
    p=cancelSimulationJob(p.state,registry,p.state.simulation.jobs[0].id,ctx(p));assert.equal(stock(p,K.wet),8);
    assert.equal(earnedDryingTracker(advance(p,6).state).completed,0);
    p=advance(act(p,'feature_objects.inspect'),2);assert.equal(earnedDryingTracker(p.state).completed,0);
    const stamina=ctx(p).vitals.player.stamina;
    p=act(p,'feature_objects.dry_shade');assert.equal(p.vitals.player.stamina,stamina-2);p=advance(p,6);
    assert.equal(stock(p,K.wet),7);assert.equal(stock(p,K.sound),1);
    assert.equal(earnedDryingTracker(p.state).progress,1);assert.throws(()=>act(p,reward));
});
test('LP8 SOURCE support failure refunds and never counts as completed work',()=>{
    let p=act(opened(),'feature_objects.dry_shade');const c=ctx(p);
    p=advanceSimulation(p.state,registry,6,p.external,p.gameplay,{player:{...c,facts:{location:'Shack'},vitals:c.vitals.player}});
    assert.equal(earnedDryingTracker(p.state).completed,0);assert.equal(stock(p,K.wet),8);assert.equal(stock(p,K.sound),0);
});
test('LP8 SOURCE two completions transfer existing sap; repeat collection and import cannot duplicate it',()=>{
    let p=dry(dry(opened()));assert.equal(earnedDryingTracker(p.state).ready,true);
    const before=structuredClone(p),eda=p.state.simulation.owners[I.miri][K.sap];
    p=act(restore(p),reward);assert.equal(stock(p,K.sap),1);assert.equal(p.state.simulation.owners[I.miri][K.sap],eda-1);
    assert.equal(earnedDryingTracker(p.state).collected,1);assert.equal(earnedDryingTracker(p.state).progress,0);
    for(let i=0;i<3;i++){p=restore(p);assert.throws(()=>act(p,reward));assert.equal(stock(p,K.sap),1);}
    assert.deepEqual(before.state.actors.player.completed,Object.fromEntries(Object.entries(p.state.actors.player.completed).filter(([id])=>id!==reward)));
});
test('LP8 SOURCE further work earns further rewards, finite owner stock blocks an unfunded third reward',()=>{
    let p=opened();for(let i=0;i<2;i++){p=dry(dry(p));p=act(p,reward);}
    assert.equal(stock(p,K.sap),2);assert.equal(earnedDryingTracker(p.state).collected,2);
    p=dry(dry(p));const before=structuredClone(p);assert.throws(()=>act(p,reward));assert.deepEqual(p,before);
    assert.equal(earnedDryingTracker(p.state).ready,true);
});
test('LP8 SOURCE reward supplies actual edge repair, leaving no phantom stock',()=>{
    let p=act(dry(dry(opened())),'feature_objects.buy');p.gameplay.player.inventory[K.log]=1;
    p=advance(act(p,'feature_objects.cut_sharp_own'),4);p=act(p,reward);
    assert.equal(stock(p,K.sap),1);assert.equal(stock(p,K.dull),1);
    p=act(p,'feature_objects.repair_dull_own');assert.equal(stock(p,K.sap),0);assert.equal(stock(p,K.dull),0);assert.equal(stock(p,K.sharp),1);
});
test('LP8 SOURCE pending and earned old saves restore exactly without adding claims or stock',()=>{
    for(const p of [base(),opened(),act(opened(),'feature_objects.dry_shade'),dry(opened()),dry(dry(opened()))]){
        const before=structuredClone(p);assert.deepEqual(restore(p),before);assert(!p.state.actors.player.completed[reward]);
    }
    const invalid=dry(dry(opened()));invalid.state.actors.player.completed[reward]=2;
    assert.throws(()=>restore(invalid),/two actual completed batches/);
});
test('LP8 SOURCE all existing drying routes contribute, unrelated command receipts do not',()=>{
    const p=opened();Object.assign(p.state.actors.player.completed,{'feature_objects.dry_shade':1,'feature_objects.dry_braced':1,'feature_objects.dry_shelf':1,'feature_objects.revisit':20});
    const before=structuredClone(p);assert.equal(earnedDryingTracker(p.state).completed,3);assert.deepEqual(p,before);
});

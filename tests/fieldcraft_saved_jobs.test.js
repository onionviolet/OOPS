import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,loadExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {beginBodyRecord} from '../src/body_progression.js';
import {beginFeatureObjects,commitFeatureObjectCommand} from '../src/feature_expansion_objects_host.js';
import {enrollReferenceGameplay} from '../src/reference_gameplay_state.js';
import {commitReferenceGameplayCommand} from '../src/reference_gameplay_host.js';
import {commitNethackFieldcraftCommand} from '../src/nethack_fieldcraft_host.js';
import {NETHACK_FIELDCRAFT_KEYS as K} from '../src/nethack_fieldcraft_content.js';
const body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
const context=p=>({actorId:'player',external:p.external,gameplay:p.gameplay,vitals:p.vitals||{player:{health:100,max_health:100,stamina:100,max_stamina:100}},
 facts:{location:'Village','village.elderMet':true,'village.craftsmanMet':true,'campaign.anchor':true},nativeBody:body,nativeAlive:true,nativeReady:true});
const advance=(p,n,extra={})=>{const c={...context(p),...extra};return advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});};
const field=(p,id)=>commitNethackFieldcraftCommand(p.state,registry,{id},context(p));
function pending(){
 let p={state:initializeExpedition(createExpansionState(17)),external:{money:30},gameplay:{player:{inventory:{},skills:{},reputation:{}}}};
 p=beginBodyRecord(p.state,registry,context(p));p.state.simulation.people.player.body=structuredClone(body);
 p=beginFeatureObjects(p.state,registry,context(p));p=commitFeatureObjectCommand(p.state,registry,{id:'feature_objects.inspect'},context(p));p=advance(p,2);
 p=enrollReferenceGameplay(p.state,context(p));p=commitReferenceGameplayCommand(p.state,registry,{id:'reference_gameplay.open'},context(p));
 p.gameplay.player.inventory={[K.dull]:1};p=field(p,'nethack_fieldcraft.open');p=field(p,'nethack_fieldcraft.buy_vial');return field(p,'nethack_fieldcraft.trial_dull');
}
const job=p=>p.state.simulation.jobs.find(j=>j.commandId==='nethack_fieldcraft.trial_dull');
const load=p=>loadExpansionState(structuredClone(p.state),registry);
test('fieldcraft accepted work preserves exact terms through partial reload and completion',()=>{
 let p=pending();assert.deepEqual(job(p).nethackFieldcraftWork,{schema:1,startedAt:2});assert.deepEqual(load(p),p.state);
 p=advance(p,1);assert.deepEqual(load(p),p.state);p=advance(p,2);assert.equal(p.gameplay.player.inventory[K.sharp],1);assert.equal(p.state.actors.player.completed['nethack_fieldcraft.trial_dull'],1);
});
test('fieldcraft importer rejects edited reservation, outputs, duration, participants and support',()=>{
 const p=pending();for(const alter of [j=>j.costs[0].amount=-99,j=>j.effects.pop(),j=>j.due++,j=>j.participants.push('feature_objects.miri'),j=>j.context.targetId='feature_objects.miri',j=>j.completionSupport.requires=null,j=>j.reservationReturns=0,j=>j.nethackFieldcraftWork.schema=2]){
  const bad=structuredClone(p);alter(job(bad));assert.throws(()=>load(bad),/fieldcraft|reservation return/i);
 }assert.deepEqual(load(p),p.state);
});
test('legacy fieldcraft work without a start stamp retains exact terms and bounded remaining time',()=>{
 let p=advance(pending(),1);delete job(p).nethackFieldcraftWork;assert.deepEqual(load(p),p.state);
 const bad=structuredClone(p);job(bad).costs[0].amount=-99;assert.throws(()=>load(bad),/fieldcraft|reservation return/i);
 const extended=structuredClone(p);job(extended).due=extended.state.clock+4;assert.throws(()=>load(extended),/fieldcraft/i);
 p=advance(p,2);assert.equal(p.gameplay.player.inventory[K.sharp],1);assert.equal(p.state.actors.player.completed['nethack_fieldcraft.trial_dull'],1);
});
test('fieldcraft loses native living-body support and refunds its actual reservation',()=>{
 const done=advance(pending(),3,{nativeAlive:false});
 assert.equal(done.state.simulation.jobs.length,0);
 assert.equal(done.gameplay.player.inventory[K.vial],1);
 assert.equal(done.gameplay.player.inventory[K.dull],1);
 assert.equal(done.gameplay.player.inventory[K.sharp]||0,0);
 assert.equal(done.gameplay.player.inventory[K.empty]||0,0);
 assert.equal(done.state.actors.player.completed['nethack_fieldcraft.trial_dull'],undefined);
});

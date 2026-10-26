// B2 named synthetic engine probe, based on B1's earned QA profile, not a private save.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {loadExpansionState,advanceSimulation} from '../../../../../src/expansion_engine.js';
import {expeditionRegistry as registry} from '../../../../../src/expedition_content.js';
import {commitBookCareCommand} from '../../../../../src/book_care_host.js';
import {bookCareCondition,projectBookCareEffects} from '../../../../../src/book_care_facts.js';
import {PARADISE_IDS as P,PARADISE_KEYS as K} from '../../../../../src/book_world_paradise_ids.js';
import {BOOK_CARE_IDS as I} from '../../../../../src/book_care_content.js';
const dir=fileURLToPath(new URL('.',import.meta.url)),raw=fs.readFileSync(dir+'native-route-save.json','utf8'),save=JSON.parse(raw);
function fresh() {
 const state=loadExpansionState(structuredClone(save.expansion),registry);
 const gameplay=Object.fromEntries(Object.entries(save.inventories.person).map(([id,inventory])=>[id==='main_character'?'player':id,
  {inventory:Object.fromEntries(Object.entries(inventory).map(([k,v])=>[k,v.count])),skills:{},reputation:{}}]));
 Object.assign(gameplay.player.inventory,{[K.log]:3,[K.rope]:1,[K.ration]:1});
 const vitals=Object.fromEntries(Object.entries(state.simulation.people).filter(([,p])=>p.vitals).map(([id,p])=>[id,structuredClone(p.vitals)]));
 vitals.player={health:60,max_health:60,stamina:40,max_stamina:40};
 return {state,gameplay,vitals,external:{money:save.character.money},nativeBody:structuredClone(state.simulation.people.player.body)};
}
function context(p,id='player') {return {actorId:id,worldId:p.state.actors[id].worldId,nativeAlive:true,nativeBody:p.nativeBody,
 paradiseNative:{bound:true,revision:p.state.bookWorldCampaign.nativeRevision,body:p.nativeBody},
 facts:{location:p.state.simulation.people[id].location},external:p.external,gameplay:p.gameplay,equipment:Object.fromEntries(Object.keys(p.gameplay).map(id=>[id,{}])),vitals:p.vitals,vitalsByActor:p.vitals};}
function command(p,suffix){return {...p,...commitBookCareCommand(p.state,registry,{type:'book_care',id:'book.care.hub.'+suffix},context(p))};}
function advance(p,n) {
 const contexts=Object.fromEntries(Object.keys(p.state.simulation.people).map(id=>[id,{...context(p,id),equipment:{},vitals:p.vitals[id]}]));
 const out=advanceSimulation(p.state,registry,n,p.external,p.gameplay,contexts),vitals=structuredClone(p.vitals);
 if(out.native?.staminaToFull!=null)vitals.player.stamina=vitals.player.max_stamina-out.native.staminaToFull;
 if(out.native?.hpToFull!=null)vitals.player.health=vitals.player.max_health-out.native.hpToFull;
 for(const [id,person] of Object.entries(out.state.simulation.people))if(id!=='player'&&person.vitals)vitals[id]=structuredClone(person.vitals);
 return {...p,...out,vitals};
}
function reload(p){return {...p,state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry)};}
function finish(p){return advance(p,p.state.simulation.jobs.find(j=>j.actorId==='player').due-p.state.clock);}
function advanceBoth(p,n){const batch=advance(p,n);let stepped=reload(p);for(let i=0;i<n;i++)stepped=advance(reload(stepped),1);
 assert.deepEqual(stepped.state,batch.state);assert.deepEqual(stepped.gameplay,batch.gameplay);assert.deepEqual(stepped.vitals,batch.vitals);return batch;}
const observations=[];
// Actual production, common expiry, and the real expired-condition removal owner.
let strained=finish(command(fresh(),'pack_hurried'));
assert.ok(bookCareCondition(strained.state,I.strain));assert.equal(strained.vitals.player.health,58);
const at17=advanceBoth(strained,17);assert.ok(bookCareCondition(at17.state,I.strain));
const at18=advanceBoth(strained,18);assert.equal(bookCareCondition(at18.state,I.strain),null);
assert.equal(at18.state.simulation.conditions.player[I.strain],undefined);assert.equal(at18.vitals.player.health,58);
observations.push('B2a: real hurried-work producer; strain active at expiry-1, absent at exact expiry; HP remains separately spent; batched and stepped/reloaded states agree');
// Current actual body support is lost during admitted supplied recovery.
let recovery=command(strained,'recover');const reserved=structuredClone(recovery);
recovery.nativeBody={...recovery.nativeBody,id:'synthetic.borrowed.body'};
const stopped=advanceBoth(recovery,4);
assert.equal(stopped.state.actors.player.completed['book.care.hub.recover'],undefined);
assert.ok(bookCareCondition(stopped.state,I.strain));
assert.equal(stopped.gameplay.player.inventory[K.ration],1);
assert.equal(stopped.state.actors.player.resources['book.paradise.coin'],strained.state.actors.player.resources['book.paradise.coin']);
assert.equal(stopped.vitals.player.health,58);
assert.deepEqual(projectBookCareEffects(stopped.state,registry,context(stopped)),{});
const restored={...stopped,nativeBody:structuredClone(strained.nativeBody)};
assert.ok(projectBookCareEffects(restored.state,registry,context(restored))['simulation:'+I.strain]);
observations.push('B2b: actual-body identity mismatch during supplied recovery stops completion, refunds ration/fee, keeps strain/HP history, and suppresses projection; restoring matching support re-expresses unexpired strain');
// Preparation must remain active through a real precise-packing completion.
let prepared=finish(command(finish(command(fresh(),'read_terms')),'prepare'));
const expiration=prepared.state.simulation.conditions.player[I.braced].expiresAt;
prepared=advance(prepared,expiration-prepared.state.clock-3);
const packing=command(prepared,'pack_precise'),beforeStock=structuredClone(prepared.gameplay.player.inventory);
const equality=advanceBoth(packing,3);
assert.equal(equality.state.clock,expiration);
assert.equal(equality.state.actors.player.completed['book.care.hub.pack_precise'],undefined);
assert.deepEqual(equality.gameplay.player.inventory,beforeStock);
assert.equal(equality.state.actors.player.resources['book.paradise.coin'],prepared.state.actors.player.resources['book.paradise.coin']);
assert.equal(equality.vitals.player.stamina,prepared.vitals.player.stamina);
assert.equal(equality.state.simulation.jobs.some(j=>j.commandId==='book.care.hub.pack_precise'),false);
observations.push('B2c: brace expiry equals precise-job due; no kit/completion awarded, reserved log/rope/fee/stamina returned once; batched and stepped/reloaded states agree');
console.log(JSON.stringify({fixture:'B2 retained-body lifecycle',fixtureSha256:createHash('sha256').update(raw).digest('hex'),observations,additionalRuntimeCorrection:false},null,2));

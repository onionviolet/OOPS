import test from 'node:test';
import assert from 'node:assert/strict';
import {spineFixture} from './helpers/story_spine.js';
import {planStoryRequest,publishStoryRequest,validateStoryRequests,salientRequestPerson} from '../src/story_requests.js';
import {appendStoryOutcome} from '../src/lore_history_state.js';
import {advanceSimulation} from '../src/expansion_engine.js';
import {bindStoryAftermath,storyAftermathDefinitions,eligibleAftermath,generatedPeoplePresenceFacts,aftermathPersonPresent} from '../src/story_aftermath.js';
import {encodeSaveFile,decodeSaveFile,importSaveFile} from '../src/save_files.js';
const raise=e=>planStoryRequest(e,{action:'raise'}).envelope;
function accepted(seed=43){const f=spineFixture(seed);let e=raise(f.envelope),r=e.generated_people.storyRequests.requests[0];e=planStoryRequest(e,{action:'take',id:r.id}).envelope;return {...f,envelope:e,request:r};}
test('actual deficit and funds cause admission; introduced shared-history actor wins casting',()=>{
 const f=spineFixture(),e=f.envelope,people=e.generated_people,chosen=people.people[1];
 appendStoryOutcome(e.expansion,{operation:'shared:1',worldId:'base.frontier',actor:'player',issuer:chosen.id,targetPerson:chosen.id,targetObject:null,targetPlace:'Village',action:'storylet.response',result:'helped',at:0,producer:'P3',causeRefs:['test:shared'],historyCauses:[],audience:['player'],known:{label:'Shared work'},applied:[]});
 assert.equal(salientRequestPerson(people,e.expansion).id,chosen.id);
 const before=structuredClone(e),offered=raise(e),r=offered.generated_people.storyRequests.requests[0];assert.equal(r.issuer,chosen.id);assert.equal(r.held,r.reward);assert.equal(offered.generated_people.people[1].possessions.coins+r.held,chosen.possessions.coins);assert.deepEqual(e,before);
 for(const p of people.people)p.met=false;assert.throws(()=>raise(e),/Meet a traveler/);
});
test('delivery moves actual stock and escrow once; no free reward on admission or missing stock',()=>{
 const f=accepted(),e=f.envelope,r=f.request,key=JSON.stringify({id:r.item});assert.throws(()=>planStoryRequest(e,{action:'deliver',id:r.id,itemKey:key}),/Bring one/);
 e.inventories.person.main_character[key]={count:2};const before=structuredClone(e),plan=planStoryRequest(e,{action:'deliver',id:r.id,itemKey:key}),next=plan.envelope,p=next.generated_people.people.find(p=>p.id===r.issuer);
 assert.equal(next.character.money,e.character.money+r.reward);assert.equal(next.inventories.person.main_character[key].count,1);assert.equal(p.possessions.supplies[r.item],1);assert.ok(p.goal.fulfilled);assert.deepEqual(e,before);
 const receipt=next.expansion.loreHistory.receipts[0];assert.equal(receipt.targetPerson,r.issuer);assert.equal(receipt.targetObject,r.item);assert.equal(receipt.applied.filter(d=>d.kind==='coin').reduce((n,d)=>n+d.delta,0),0);
 assert.throws(()=>planStoryRequest(next,{action:'deliver',id:r.id,itemKey:key}),/already settled/);
});
test('decline returns reserved funds, keeps ordinary supply and permits another funded request',()=>{
 const f=accepted(),e=f.envelope,r=f.request,p=e.generated_people.people.find(p=>p.id===r.issuer);
 const next=planStoryRequest(e,{action:'decline',id:r.id}).envelope;assert.equal(next.character.money,e.character.money);assert.equal(next.generated_people.people.find(p=>p.id===p.id).possessions.coins,p.possessions.coins+r.reward);
 assert.equal(next.expansion.loreHistory.receipts[0].result,'declined');assert.equal(raise(next).generated_people.storyRequests.requests.length,2);
});
test('stale commands, away travelers and failed durable write publish no stock, coins or history',()=>{
 const {envelope:e,request:r}=accepted(),key=JSON.stringify({id:r.item});e.inventories.person.main_character[key]={count:1};
 assert.throws(()=>planStoryRequest(e,{action:'deliver',id:r.id,itemKey:key,expectedSequence:0}),/changed/);
 const before=structuredClone(e),plan=planStoryRequest(e,{action:'deliver',id:r.id,itemKey:key});let published=0;
 assert.throws(()=>publishStoryRequest(plan,{persist(){throw Error('disk full');},publishSupply(){published++;},publishReward(){published++;}}),/disk full/);assert.equal(published,0);assert.deepEqual(e,before);
 e.generated_people.people.find(p=>p.id===r.issuer).status='on_road';assert.throws(()=>planStoryRequest(e,{action:'deliver',id:r.id,itemKey:key}),/return/);
});
test('real P3 deck draws a frozen receipt-backed aftermath; no settlement means no callback',()=>{
 const f=accepted(),e=f.envelope,r=f.request,key=JSON.stringify({id:r.item});assert.equal(eligibleAftermath(e.expansion),null);e.inventories.person.main_character[key]={count:1};
 const next=planStoryRequest(e,{action:'deliver',id:r.id,itemKey:key}).envelope;
 const out=advanceSimulation(next.expansion,f.registry,60,f.context.external,f.context.gameplay,{player:f.context});
 const event=Object.values(out.state.simulation.events).find(e=>e.definitionId==='village.remembered_supply');assert.ok(event);assert.equal(event.historyRef,next.expansion.loreHistory.receipts[0].id);assert.ok(event.label.includes(r.item));assert.ok(event.label.includes(next.generated_people.people.find(p=>p.id===r.issuer).name));
 const decline=planStoryRequest(e,{action:'decline',id:r.id}).envelope;decline.expansion.clock=12;const bound=bindStoryAftermath(storyAftermathDefinitions.events[0],decline.expansion,generatedPeoplePresenceFacts(decline.expansion,f.context));assert.match(bound.label,/declined/);assert.equal(bound.responses[0].effects[0].amount,4);
});
test('pending/settled full envelopes import exactly; corrupt reserve/ref fails before writes',async()=>{
 const {envelope:e,request:r}=accepted(),loaded=decodeSaveFile(encodeSaveFile(JSON.stringify(e)),'v0.6');assert.deepEqual(loaded.generated_people,e.generated_people);assert.deepEqual(loaded.expansion,e.expansion);
 const bad=structuredClone(e);bad.generated_people.storyRequests.requests[0].held=0;const storage={writes:0,setItem(){this.writes++;}};
 await assert.rejects(importSaveFile(encodeSaveFile(JSON.stringify(bad)),{currentVersion:'v0.6',preflight(){assert.fail();},storage,key:'test'}),/request/);assert.equal(storage.writes,0);
 const key=JSON.stringify({id:r.item});e.inventories.person.main_character[key]={count:1};const settled=planStoryRequest(e,{action:'deliver',id:r.id,itemKey:key}).envelope;
 assert.deepEqual(decodeSaveFile(encodeSaveFile(JSON.stringify(settled)),'v0.6').generated_people,settled.generated_people);
 settled.generated_people.storyRequests.requests[0].receiptId='missing';assert.throws(()=>validateStoryRequests(settled.generated_people,settled.expansion),/request/);
});
test('closed request quota retires old claims, permits repeated real needs and preserves the latest known receipt',()=>{
 let e=spineFixture().envelope;
 for(let i=0;i<100;i++){e=raise(e);const r=e.generated_people.storyRequests.requests.at(-1);e=planStoryRequest(e,{action:'decline',id:r.id}).envelope;}
 assert.equal(e.generated_people.storyRequests.requests.length,16);assert.ok(e.expansion.loreHistory.receipts.length<=96);assert.ok(e.expansion.loreHistory.evicted>0);
 e=raise(e);const r=e.generated_people.storyRequests.requests.at(-1);e=planStoryRequest(e,{action:'take',id:r.id}).envelope;const key=JSON.stringify({id:r.item});e.inventories.person.main_character[key]={count:1};e=planStoryRequest(e,{action:'deliver',id:r.id,itemKey:key}).envelope;
 assert.equal(e.generated_people.storyRequests.requests.at(-1).status,'delivered');validateStoryRequests(e.generated_people,e.expansion);
});

test('remembered callback requires actual traveler presence, including departure/return boundaries',()=>{
 const f=accepted(),e=f.envelope,r=f.request,key=JSON.stringify({id:r.item});e.inventories.person.main_character[key]={count:1};
 const next=planStoryRequest(e,{action:'deliver',id:r.id,itemKey:key}).envelope;
 const context={...f.context,generatedPeopleFrame:{people:next.generated_people,clock:next.expansion.clock}};
 const state=structuredClone(next.expansion);state.clock=12;
 const present=generatedPeoplePresenceFacts(state,context),receipt=eligibleAftermath(state,present);
 assert(receipt);assert(aftermathPersonPresent(state,receipt.id,present));
 state.clock=3*1440;
 const away=generatedPeoplePresenceFacts(state,context);assert.equal(eligibleAftermath(state,away),null);
 assert.equal(bindStoryAftermath(storyAftermathDefinitions.events[0],state,away),null);
 assert.equal(aftermathPersonPresent(state,receipt.id,away),false);
 assert.equal(eligibleAftermath(state),null,'unknown presence never admits the callback');
 state.clock=5*1440;assert(eligibleAftermath(state,generatedPeoplePresenceFacts(state,context)));
 assert.equal(next.generated_people.people.find(p=>p.id===r.issuer).status,'visiting','projection does not mutate the saved schedule');
});

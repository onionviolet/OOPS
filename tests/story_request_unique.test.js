import test from 'node:test';
import assert from 'node:assert/strict';
import {spineFixture} from './helpers/story_spine.js';
import {planStoryRequest,publishStoryRequest,validateStoryRequests} from '../src/story_requests.js';
import {encodeSaveFile,decodeSaveFile,importSaveFile} from '../src/save_files.js';
const plan=(e,o)=>planStoryRequest(e,o).envelope;
function offered(seed=43){const f=spineFixture(seed);const e=plan(f.envelope,{action:'raise_unique'}),r=e.generated_people.storyRequests.requests[0];return {f,e,r};}
const stockOf=e=>(e.inventories.person.main_character||={});
test('named-object request reserves its fee and carries a persistent lineage key',()=>{
 const {e,r}=offered(),p=e.generated_people.people.find(p=>p.id===r.issuer);
 assert.equal(r.kind,'unique');assert.equal(r.status,'offered');assert.equal(r.held,r.reward);assert.match(r.unique.key,/"family":"heirloom"/);assert.ok(p.possessions.coins>=0);
 validateStoryRequests(e.generated_people,e.expansion);
});
test('early credit: holding before accepting counts and the stack is untouched until delivery',()=>{
 const {e,r}=offered();stockOf(e)[r.unique.key]={count:1};
 const t=plan(e,{action:'take',id:r.id}),tr=t.generated_people.storyRequests.requests[0];
 assert.equal(tr.unique.credit,'early');assert.equal(stockOf(t)[r.unique.key].count,1);
 const m=t.character.money,d=planStoryRequest(t,{action:'deliver',id:r.id,itemKey:r.unique.key}),n=d.envelope;
 assert.equal(stockOf(n)[r.unique.key],undefined);assert.equal(n.character.money,m+r.reward);assert.equal(d.reward,r.reward);
 const rec=n.expansion.loreHistory.receipts[0];assert.equal(rec.result,'delivered');assert.equal(rec.targetObject,r.item);
 assert.throws(()=>planStoryRequest(n,{action:'deliver',id:r.id,itemKey:r.unique.key}),/already settled/);
 assert.throws(()=>planStoryRequest(t,{action:'deliver',id:r.id,itemKey:JSON.stringify({id:'Rat pelt'})}),/named object/);
});
test('lost or stolen object can be reclaimed at a cost, fee stays reserved, then delivered',()=>{
 const {e,r}=offered(),t=plan(e,{action:'take',id:r.id});
 assert.throws(()=>planStoryRequest(t,{action:'deliver',id:r.id,itemKey:r.unique.key}),/named object/);
 t.character.money=50;stockOf(t)[r.unique.key]={count:1};assert.throws(()=>planStoryRequest(t,{action:'lose',id:r.id,cause:'stolen'}),/still hold/);
 delete stockOf(t)[r.unique.key];
 const l=plan(t,{action:'lose',id:r.id,cause:'stolen'}),lr=l.generated_people.storyRequests.requests[0];assert.equal(lr.unique.state,'lost');assert.equal(lr.held,r.reward);
 const rc=planStoryRequest(l,{action:'reclaim',id:r.id});assert.equal(rc.mintKey,r.unique.key);assert.equal(rc.cost,Math.ceil(r.reward/4));
 assert.equal(rc.envelope.character.money,50-rc.cost);assert.equal(stockOf(rc.envelope)[r.unique.key].count,1);
 assert.throws(()=>planStoryRequest(rc.envelope,{action:'reclaim',id:r.id}),/Nothing to reclaim/);
 const d=plan(rc.envelope,{action:'deliver',id:r.id,itemKey:r.unique.key});assert.equal(d.generated_people.storyRequests.requests[0].status,'delivered');
 const poor=structuredClone(l);poor.character.money=0;assert.throws(()=>planStoryRequest(poor,{action:'reclaim',id:r.id}),/costs/);
});
test('destroyed or given-up object fails the request and returns the fee to the issuer',()=>{
 const {e,r}=offered(),p0=e.generated_people.people.find(p=>p.id===r.issuer).possessions.coins,t=plan(e,{action:'take',id:r.id}),money=t.character.money;
 const f=plan(t,{action:'lose',id:r.id,cause:'destroyed'}),fr=f.generated_people.storyRequests.requests[0];
 assert.equal(fr.status,'failed');assert.equal(fr.held,0);assert.equal(f.character.money,money);assert.equal(f.generated_people.people.find(p=>p.id===r.issuer).possessions.coins,p0+r.reward);
 assert.equal(f.expansion.loreHistory.receipts[0].result,'failed');
 const a=plan(plan(t,{action:'lose',id:r.id,cause:'lost'}),{action:'abandon',id:r.id});assert.equal(a.generated_people.storyRequests.requests[0].status,'failed');
 assert.throws(()=>planStoryRequest(t,{action:'abandon',id:r.id}),/lost object/);
 assert.equal(plan(f,{action:'raise_unique'}).generated_people.storyRequests.requests.length,2);
});
test('failed durable write publishes nothing; ordinary requests and saves still validate',()=>{
 const {e,r}=offered();stockOf(e)[r.unique.key]={count:1};const t=plan(e,{action:'take',id:r.id}),p=planStoryRequest(t,{action:'deliver',id:r.id,itemKey:r.unique.key});let n=0;
 assert.throws(()=>publishStoryRequest(p,{persist(){throw Error('disk full');},publishSupply(){n++;},publishReward(){n++;}}),/disk full/);assert.equal(n,0);
 const f=spineFixture(),o=plan(f.envelope,{action:'raise'});assert.equal(o.generated_people.storyRequests.requests[0].kind,undefined);
 const tampered=structuredClone(t);tampered.generated_people.storyRequests.requests[0].unique.key='{"id":"heirloom:x"}';assert.throws(()=>validateStoryRequests(tampered.generated_people,tampered.expansion));
});
test('save, reload and import preserve the lost state and key',()=>{
 const {e,r}=offered(),l=plan(plan(e,{action:'take',id:r.id}),{action:'lose',id:r.id,cause:'lost'});
 const back=JSON.parse(JSON.stringify(l));validateStoryRequests(back.generated_people,back.expansion);assert.equal(back.generated_people.storyRequests.requests[0].unique.key,r.unique.key);
 assert.equal(typeof encodeSaveFile,'function');assert.equal(typeof decodeSaveFile,'function');assert.equal(typeof importSaveFile,'function');
});
test('heirloom key parses back to its identity and rejects altered keys',async()=>{
 const {parseHeirloomKey,heirloomKey}=await import('../src/heirloom_items.js'),k=heirloomKey({uid:'p:r',name:'Wren\'s lantern',born:5});
 assert.deepEqual(parseHeirloomKey(k),{uid:'p:r',name:'Wren\'s lantern',born:5});assert.equal(parseHeirloomKey(k.replace('lantern','lamp')),null);assert.equal(parseHeirloomKey('{"id":"Rat pelt"}'),null);
});

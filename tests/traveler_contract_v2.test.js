import test from 'node:test';
import assert from 'node:assert/strict';
import {spineFixture} from './helpers/story_spine.js';
import {createGeneratedPeople,validateGeneratedPeople} from '../src/generated_people.js';
import {planStoryRequest,validateStoryRequests,publishStoryRequest} from '../src/story_requests.js';
import {storyRecap} from '../src/lore_history_view.js';
import {decodeSaveFile,encodeSaveFile} from '../src/save_files.js';
const offered=seed=>planStoryRequest(spineFixture(seed,{revision:2}).envelope,{action:'raise'}).envelope;
test('rev2 saves freeze real routed quantity and fee; multi-item delivery and native publication conserve stock',()=>{
 let e,r;for(let seed=1;seed<50;seed++){e=offered(seed);r=e.generated_people.storyRequests.requests[0];if(r.quantity>1)break;}
 assert.ok(r.quantity>1);assert.equal(e.generated_people.generationRevision,2);assert.equal(r.revision,2);assert.equal(r.needRevision,1);assert.equal(r.grade,null);
 e=planStoryRequest(e,{action:'take',id:r.id}).envelope;const key=JSON.stringify({id:r.item}),original=structuredClone(e);e.inventories.person.main_character[key]={count:r.quantity-1};assert.throws(()=>planStoryRequest(e,{action:'deliver',id:r.id,itemKey:key}),/Bring/);
 e.inventories.person.main_character[key]={count:r.quantity+2};const plan=planStoryRequest(e,{action:'deliver',id:r.id,itemKey:key}),p=plan.envelope.generated_people.people.find(p=>p.id===r.issuer);
 assert.equal(plan.envelope.inventories.person.main_character[key].count,2);assert.equal(p.possessions.supplies[r.item],r.quantity);assert.equal(plan.envelope.character.money,e.character.money+r.reward);
 assert.deepEqual(plan.envelope.expansion.loreHistory.receipts[0].applied.filter(d=>d.kind==='item').map(d=>d.delta),[-r.quantity,r.quantity]);
 assert.match(storyRecap(plan.envelope.expansion,p.id).line,new RegExp(`delivered ${r.quantity}`));
 let published;publishStoryRequest(plan,{persist(){},publishSupply(k,q){published=[k,q];},publishReward(){}});assert.deepEqual(published,[key,r.quantity]);
 assert.deepEqual(decodeSaveFile(encodeSaveFile(JSON.stringify(plan.envelope)),'v0.6').generated_people,plan.envelope.generated_people);
 assert.equal(original.generated_people.people.find(p=>p.id===r.issuer).goal.fulfilled,false);
});
test('revision1 keeps original draws, goals, one-item settlement and rejection of multi-item imports',()=>{
 const expected=createGeneratedPeople(43,0);assert.equal(expected.generationRevision,undefined);assert.deepEqual(expected,createGeneratedPeople(43,0));
 let e=planStoryRequest(spineFixture().envelope,{action:'raise'}).envelope;const r=e.generated_people.storyRequests.requests[0],before=structuredClone(e.generated_people.people);
 assert.equal(r.revision,1);assert.equal(r.quantity,1);assert.ok(r.reward>=3&&r.reward<=6);
 const bad=structuredClone(e);bad.generated_people.storyRequests.requests[0].quantity=2;assert.throws(()=>validateStoryRequests(bad.generated_people,bad.expansion));bad.generated_people.people[0].goal.quantity=2;assert.throws(()=>validateGeneratedPeople(bad.generated_people));
 e=planStoryRequest(e,{action:'take',id:r.id}).envelope;const key=JSON.stringify({id:r.item});e.inventories.person.main_character[key]={count:2};e=planStoryRequest(e,{action:'deliver',id:r.id,itemKey:key}).envelope;
 assert.equal(e.inventories.person.main_character[key].count,1);assert.equal(e.generated_people.people[0].goal.reward,before[0].goal.reward);assert.match(storyRecap(e.expansion,r.issuer).line,/delivered one/);
});
test('v2 corruption, unsupported grades and mixed contracts reject without rewriting saved goals',()=>{
 const e=offered(4),before=JSON.stringify(e);for(const field of ['quantity','reward','grade','needRevision']){const bad=structuredClone(e),p=bad.generated_people.people[0];p.goal[field]=field==='grade'?'unblemished':99999;assert.throws(()=>validateGeneratedPeople(bad.generated_people));}
 const bad=structuredClone(e);bad.generated_people.storyRequests.requests[0].revision=1;assert.throws(()=>validateStoryRequests(bad.generated_people,bad.expansion));assert.equal(JSON.stringify(e),before);
});
test('new revisioned draw cell is separate from legacy, replay exact and previews consume nothing',()=>{
 const a=spineFixture(13,{revision:2}),b=spineFixture(13,{revision:2});assert.deepEqual(a.envelope,b.envelope);
 assert.ok(a.envelope.expansion.streams.cells['world.people:village.generated_people@2@base.frontier']);assert.equal(a.envelope.expansion.streams.cells['world.people:village@base.frontier'],undefined);
 const before=structuredClone(a.envelope.expansion.streams);validateGeneratedPeople(a.envelope.generated_people);assert.deepEqual(before,a.envelope.expansion.streams);
});

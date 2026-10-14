import test from 'node:test';
import assert from 'node:assert/strict';
import {spineFixture} from './helpers/story_spine.js';
import {planStoryRequest} from '../src/story_requests.js';
import {storyRecap,knownStoryOutcomes} from '../src/lore_history_view.js';
import {appendStoryOutcome} from '../src/lore_history_state.js';
import {advanceSimulation} from '../src/expansion_engine.js';
import {respondSimulationEvent} from '../src/simulation.js';
function delivered(){const f=spineFixture();let e=planStoryRequest(f.envelope,{action:'raise'}).envelope;const r=e.generated_people.storyRequests.requests[0];e=planStoryRequest(e,{action:'take',id:r.id}).envelope;const key=JSON.stringify({id:r.item});e.inventories.person.main_character[key]={count:1};return {...f,envelope:planStoryRequest(e,{action:'deliver',id:r.id,itemKey:key}).envelope,request:r};}
test('recap has exact learned deed, basis, deterministic reload and no render draws',()=>{
 const {envelope:e,request:r}=delivered(),before=structuredClone(e),recap=storyRecap(e.expansion,r.issuer);
 assert.match(recap.line,/delivered one/);assert.ok(recap.line.includes(r.item));assert.deepEqual(storyRecap(JSON.parse(JSON.stringify(e.expansion)),r.issuer),recap);
 for(let i=0;i<20;i++)storyRecap(e.expansion,r.issuer);assert.deepEqual(e,before);assert.equal(storyRecap(e.expansion,'unmet'),null);
});
test('known projection and later card cannot read another observer or hidden person fields',()=>{
 const {envelope:e,request:r}=delivered();e.generated_people.people[0].privatePlan='synthetic-sealed-canary';e.expansion.loreHistory.receipts[0].known.private='synthetic-sealed-canary';
 assert.equal(JSON.stringify(knownStoryOutcomes(e.expansion)).includes('synthetic-sealed-canary'),false);assert.deepEqual(knownStoryOutcomes(e.expansion,'unrelatedObserver'),[]);
 const hidden=structuredClone(e.expansion.loreHistory.receipts[0]);delete hidden.id;delete hidden.ordinal;hidden.operation='hidden:receipt';hidden.audience=['privateObserver'];hidden.known={person:'synthetic-sealed-canary',item:r.item};appendStoryOutcome(e.expansion,hidden);
 assert.equal(JSON.stringify(storyRecap(e.expansion,r.issuer)).includes('synthetic-sealed-canary'),false);
});
test('actual later response retains the same person/object and contributes to learned recap',()=>{
 const f=delivered(),out=advanceSimulation(f.envelope.expansion,f.registry,60,f.context.external,f.context.gameplay,{player:f.context});
 const e=Object.values(out.state.simulation.events).find(e=>e.definitionId==='village.remembered_supply');
 const settled=respondSimulationEvent(out.state,f.registry,e.id,'listen',{...f.context,external:out.external,gameplay:out.gameplay});
 const r=settled.state.loreHistory.receipts.at(-1);assert.equal(r.targetPerson,f.request.issuer);assert.equal(r.targetObject,f.request.item);assert.equal(r.action,'aftermath.response');assert.match(storyRecap(settled.state,f.request.issuer).line,/Later, you compared/);
});

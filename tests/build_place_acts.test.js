import test from 'node:test';
import assert from 'node:assert/strict';
import {buildPlaceActs} from '../scripts/lead_run/build_place_acts.mjs';
import {buildReplayMapping} from '../scripts/lead_run/build_replay_mapping.mjs';
import {definePlaceActs} from '../src/place_acts.js';
import {createSimulationRegistry} from '../src/simulation_contracts.js';

const registry=[{id:'reader.place.room',kind:'place',label:'Study'}];
const crosswalk={places:{}};
const pack={leadLife:{actorId:'actor.lead'},places:[{id:'pack.place.room',indexId:'reader.place.room',name:'Study'}],
 householdActs:{objects:[{id:'old.object',place:'pack.place.room',label:'old',facts:{old:true}}],acts:[{id:'old.act',operation:'inspect',place:'pack.place.room',minutes:2,label:'Old',description:'Old act',report:'Old report',knowledgeKey:'old.knowledge'}]}};

test('objectless knowledge acts require a reviewed cited paragraph and a resolved place',()=>{
 const scenes=[{beat:'thought',pov:'lead',place:'reader.place.room',evidence:[{label:'S',locator:'zh 第1章 p2'}],steps:[{verb:'recall',object:'a memory'}]}];
 const args={scenes,crosswalk,registry,pack};
 assert.equal(buildPlaceActs(args).data.acts.length,1);
 const knowledgeEvidence={'thought#1':{locator:'zh 第1章 p2',report:'You recall a prior meeting.'}};
 const result=buildPlaceActs({...args,knowledgeEvidence});
 const row=result.data.acts[1];assert.equal(row.operation,'inspect');assert.equal(row.source.locator,knowledgeEvidence['thought#1'].locator);
 assert.equal(row.minutes,1);assert.match(row.minutesBasis,/fill/);assert.equal(result.data.objects.length,1);
 assert.equal(definePlaceActs(result.data,{worldId:'world.test',group:'group.test',situationId:'situation.test'}).length,2);
 assert.equal(buildPlaceActs({...args,knowledgeEvidence:{'thought#1':{...knowledgeEvidence['thought#1'],locator:'zh 第1章 p3'}}}).data.acts.length,1);
});

test('compiles fixed local object steps, preserves H1 rows first, and maps exact source controls',()=>{
 const scenes=[{beat:'sample',order:1,pov:'lead',place:'reader.place.room',evidence:[{label:'S',locator:'zh 第1章 p2'}],steps:[
  {class:'observe or listen',verb:'look at',object:'the brass key'},
  {class:'read a text',verb:'read',object:'the book',minutes:4},
  {class:'rest or personal care',verb:'wash',object:'hands'},
  {class:'trade or pay',verb:'pay',object:'rent'}
 ]}];
 const result=buildPlaceActs({scenes,crosswalk,registry,pack});
 assert.equal(result.data.objects[0].id,'old.object');
 assert.equal(result.data.acts[0].id,'old.act');
 assert.equal(result.data.acts.length,4);
 assert.equal(result.rowsByFamily['observe or listen'],1);
 assert.equal(result.rowsByFamily['read a text'],1);
 assert.equal(result.rowsByFamily['rest or personal care'],1);
 assert.equal(result.rejected.notFamily,1);
 const definitions=definePlaceActs(result.data,{worldId:'world.test',actorId:'actor.lead',group:'group.test',situationId:'situation.test'});
 assert.equal(definitions.length,4);
 for(const definition of definitions){
  const json=JSON.stringify(definition); assert.doesNotMatch(json,/undefined|NaN/); assert.deepEqual(JSON.parse(json),definition);
 }
 const mapped=buildReplayMapping({scenes,crosswalk,registry,pack:{...pack,householdActs:result.data,journeys:{journeys:[{id:'journey.overlap',sourceStepId:'sample#1'}]}},fromChapter:1,toChapter:1});
 assert.equal(mapped.rows[0].canonicalControl,result.actByStep['sample#1']);
 assert.equal(mapped.rows[1].canonicalControl,result.actByStep['sample#2']);
 assert.equal(mapped.rows[2].canonicalControl,result.actByStep['sample#3']);
 assert.notEqual(mapped.rows[3].canonicalControl,result.actByStep['sample#3']);
});

test('does not turn transport or message actions into fixed place acts',()=>{
 const scenes=[{beat:'separate',order:1,pov:'lead',place:'reader.place.room',evidence:[{locator:'zh 第1章 p2'}],steps:[
  {verb:'take a carriage to the station'}, {verb:'send a letter'}]}];
 const result=buildPlaceActs({scenes,crosswalk,registry,pack});
 assert.equal(result.data.acts.length,1);
 assert.equal(result.rejected.notFamily,2);
});

test('installs generated acts through the real registry with the host guard',()=>{
 const scenes=[{beat:'install',order:1,pov:'lead',place:'reader.place.room',evidence:[{label:'S',locator:'zh 第1章 p2'}],steps:[{verb:'inspect',object:'the key'}]}];
 const result=buildPlaceActs({scenes,crosswalk,registry,pack});
 const generated=result.data.acts.find(row=>row.sourceStepId==='install#1');
 assert.ok(generated);
 assert.equal(Object.hasOwn(generated,'requires'),false);
 const binding={worldId:'world.test',group:'book_lotm',situationId:'situation.test',requires:{fact:'world.profile.be',op:'eq',value:true}};
 const commands=definePlaceActs(result.data,binding);
 const installed=createSimulationRegistry({commands});
 assert.equal(installed.commands.size,result.data.acts.length);
 assert.deepEqual(installed.commands.get(generated.id).requires.all,[binding.requires]);
 const invalid=definePlaceActs({acts:[{...generated,requires:[]}]},binding);
 assert.throws(()=>createSimulationRegistry({commands:invalid}),/Invalid simulation requirement/);
});

test('leaves unresolved places, missing objects, and ambiguous objects as gaps',()=>{
 const scenes=[
  {beat:'unknown',order:1,pov:'lead',place:'missing',evidence:[{label:'S',locator:'zh 第1章 p2'}],steps:[{class:'observe or listen',verb:'observe',object:'a lamp'}]},
  {beat:'gaps',order:2,pov:'lead',place:'reader.place.room',evidence:[{label:'S',locator:'zh 第1章 p3'}],steps:[
   {class:'observe or listen',verb:'observe'},
   {class:'handle or move an item',verb:'put away',object:'the key or letter'}
  ]}
 ];
 const result=buildPlaceActs({scenes,crosswalk,registry,pack});
 assert.equal(result.data.acts.length,1);
 assert.equal(result.rejected.unresolvedPlace,1);
 assert.equal(result.rejected.missingObject,1);
 assert.equal(result.rejected.ambiguousObject,1);
 assert.equal(result.rejectedRows.find(row=>row.reason==='unresolvedPlace').missing[0].kind,'place');
 assert.ok(result.rejectedRows.find(row=>row.reason==='ambiguousObject').otherBlockers.length);
});

test('a generated act is not reused for a different source step merely because words match',()=>{
 const scenes=[{beat:'unrelated',order:1,pov:'lead',place:'reader.place.room',evidence:[{locator:'zh 第1章 p1'}],steps:[{verb:'take the key',object:'key'}]}];
 const generated={id:'place.act.other',sourceStepId:'other#1',operation:'take',place:'pack.place.room',label:'Take key',description:'Take the key'};
 const row=buildReplayMapping({scenes,crosswalk,registry,pack:{...pack,householdActs:{objects:[],acts:[generated]}},fromChapter:1,toChapter:1}).rows[0];
 assert.equal(row.status,'gap'); assert.equal(row.canonicalControl,null);
});

test('maps expanded operation families and retains missing mechanisms as explicit gaps',()=>{
 const seeded=structuredClone(pack);
 seeded.householdActs.objects.push({id:'fixture.stock',resources:[{actor:'player',key:'fixture.grain',amount:1},{actor:'player',key:'fixture.meal',amount:0}],actorFacts:[{actor:'player',key:'fixture.owned',value:true}]});
 const steps=[{verb:'read',object:'a book'},{verb:'cook',object:'a meal',placeAct:{costs:[{type:'resource',actor:'player',key:'fixture.grain',amount:-1}],effects:[{type:'resource',actor:'player',key:'fixture.meal',amount:1}]}},
  {verb:'wake'},{verb:'check',object:'a clock',placeAct:{clock:{fact:'fixture.clock',value:'07:15'}}},{verb:'sit'},
  {verb:'hide',object:'a key',placeAct:{objectId:'fixture.stock',secure:{ownedFact:'fixture.owned',custodyFact:'fixture.custody',concealedFact:'fixture.concealed',container:'fixture.drawer'}}},
  {verb:'wait',minutes:3},{verb:'cook',object:'a meal'},{verb:'check',object:'a clock'},{verb:'wait'}];
 const scenes=[{beat:'operations',pov:'lead',place:'reader.place.room',steps}];
 const result=buildPlaceActs({scenes,crosswalk,registry,pack:seeded});
 assert.deepEqual(result.data.acts.slice(1).map(r=>r.operation),['read','prepare','wake','check time','sit','secure','wait here']);
 assert.equal(result.rejected.missingMechanism,3);
 assert.deepEqual(result.data.acts[0],pack.householdActs.acts[0]);
 assert.equal(createSimulationRegistry({commands:definePlaceActs(result.data,{worldId:'fixture.world',group:'fixture.group',situationId:'fixture.situation'})}).commands.size,8);
 assert.equal(JSON.stringify(seeded.householdActs.objects).includes('fixture.grain'),true);
});

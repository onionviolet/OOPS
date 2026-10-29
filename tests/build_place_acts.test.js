import test from 'node:test';
import assert from 'node:assert/strict';
import {buildPlaceActs} from '../scripts/lead_run/build_place_acts.mjs';
import {buildReplayMapping} from '../scripts/lead_run/build_replay_mapping.mjs';
import {definePlaceActs} from '../src/place_acts.js';

const registry=[{id:'reader.place.room',kind:'place',label:'Study'}];
const crosswalk={places:{}};
const pack={leadLife:{actorId:'actor.lead'},places:[{id:'pack.place.room',indexId:'reader.place.room',name:'Study'}],
 householdActs:{objects:[{id:'old.object',place:'pack.place.room',label:'old',facts:{old:true}}],acts:[{id:'old.act',operation:'inspect',place:'pack.place.room',minutes:2,label:'Old',description:'Old act',report:'Old report',knowledgeKey:'old.knowledge'}]}};

test('compiles fixed local object steps, preserves H1 rows first, and maps exact source controls',()=>{
 const scenes=[{beat:'sample',order:1,pov:'lead',place:'reader.place.room',evidence:[{label:'S',locator:'zh 第1章 p2'}],steps:[
  {class:'observe or listen',verb:'look at',object:'the brass key'},
  {class:'read a text',verb:'read',object:'the letter',minutes:4},
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
});

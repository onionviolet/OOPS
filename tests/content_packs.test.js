import test from 'node:test';
import assert from 'node:assert/strict';
import {createContentRegistry} from '../src/expansion_engine.js';
import {emptyPackState,validatePackState,validatePack,registerPack,loadContentPacks,enterPack,leavePack,actPack,advancePack,preparePackSave} from '../src/content_packs.js';
const fake=()=>({schema:1,id:'testpack',title:'Test workshop',world:{id:'testpack.world',label:'Test workshop'},locations:[{id:'testpack.room',label:'Workroom',description:'An original test room.'}],people:[{id:'testpack.clerk',label:'Test clerk',location:'testpack.room'}],initial:{stock:2,delivered:0,paid:0},activities:[{id:'testpack.delivery',label:'Deliver stock',description:'Two minutes, one stock.',duration:2,requires:[{field:'stock',op:'gte',value:1}],start:{add:{stock:-1}},complete:{add:{delivered:1}}},{id:'testpack.pay',label:'Close receipt',description:'One payment after a delivery.',duration:0,requires:[{field:'delivered',op:'gte',value:1}],start:{add:{delivered:-1}},complete:{add:{paid:3}}}]});
const base=()=>createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]});
test('timed optional duty pauses outside its world and pays exactly once',()=>{
 const d=validatePack(fake()).definition;let state=enterPack(emptyPackState(),d);
 state=actPack(state,d,'testpack.delivery');assert.equal(state.packs.testpack.values.stock,1);
 state=advancePack(state,new Map([[d.id,d]]),1);assert.equal(state.packs.testpack.job.remaining,1);
 state=leavePack(state,d.id);state=advancePack(state,new Map([[d.id,d]]),100);assert.equal(state.packs.testpack.job.remaining,1);
 state=enterPack(JSON.parse(JSON.stringify(state)),d);state=advancePack(state,new Map([[d.id,d]]),1);assert.equal(state.packs.testpack.values.delivered,1);
 state=actPack(state,d,'testpack.pay');assert.equal(state.packs.testpack.values.paid,3);assert.throws(()=>actPack(state,d,'testpack.pay'));
 state=advancePack(state,new Map([[d.id,d]]),10);assert.equal(state.packs.testpack.values.paid,3);
});
test('unavailable pack returns to Village while retaining opaque work and world state',()=>{
 const d=fake();let state=enterPack(emptyPackState(),d);state=actPack(state,d,'testpack.delivery');
 const old={content_packs:state,'current location':'testpack.room',locations:{Village:{},'testpack.room':{}},availabilities:{location:{Village:1,'testpack.room':1}},expansion:{actors:{player:{worldId:'testpack.world'}},worlds:{'base.frontier':{},'testpack.world':{facts:{seen:true},resources:{},completed:{}}},simulation:{people:{player:{location:'testpack.room'}}}}};
 const save=preparePackSave(old,new Map());assert.equal(save['current location'],'Village');assert.equal(save.expansion.actors.player.worldId,'base.frontier');assert(!save.locations['testpack.room']);assert(!save.availabilities.location['testpack.room']);assert(!save.expansion.worlds['testpack.world']);assert.equal(save.content_packs.packs.testpack.domain.facts.seen,true);assert.equal(save.content_packs.packs.testpack.job.remaining,2);assert.equal(old['current location'],'testpack.room');
 state=enterPack(save.content_packs,d);assert.equal(state.packs.testpack.job.remaining,2);assert.equal(state.packs.testpack.values.stock,1);
 assert.deepEqual(preparePackSave({old:true},new Map()),{old:true});
});
test('pack registration validates everything before changing base registries',()=>{
 const registry=base(),locations={Village:{}};const invalid=fake();invalid.people[0].location='missing';assert.throws(()=>registerPack(invalid,registry,locations,x=>x));assert.equal(registry.worlds.size,1);assert.equal(Object.keys(locations).length,1);
 registerPack(fake(),registry,locations,x=>x);assert(registry.worlds.has('testpack.world'));assert(registry.actions.has('testpack.delivery'));assert(registry.simulation.people.has('testpack.clerk'));assert(locations['testpack.room']);
 assert.throws(()=>registerPack(fake(),registry,locations,x=>x));assert.equal(registry.worlds.size,2);
});
test('loader absent, malformed and bad individual packs do not block base content',async()=>{
 const registry=base(),locations={};let errors=[];
 assert.equal((await loadContentPacks({registry,locations,makeLocation:x=>x,fetchFile:async()=>({status:404}),onError:e=>errors.push(e.message)})).size,0);assert.deepEqual(errors,[]);
 assert.equal((await loadContentPacks({registry,locations,makeLocation:x=>x,fetchFile:async()=>({ok:true,json:async()=>({schema:1,packs:['../unsafe/pack.json']})}),onError:e=>errors.push(e.message)})).size,0);assert.equal(registry.worlds.size,1);
 const fetchFile=async path=>({ok:true,json:async()=>path.endsWith('manifest.json')?{schema:1,packs:['broken/pack.json','ok/pack.json']}:path.includes('broken')?{schema:77}:fake()});
 const loaded=await loadContentPacks({registry,locations,makeLocation:x=>x,fetchFile,onError:e=>errors.push(e.message)});assert.equal(loaded.size,1);assert.equal(errors.length,2);
});
test('invalid saved work and overlapping visits are rejected without advancing',()=>{
 const d=fake(),state=enterPack(emptyPackState(),d);state.packs.testpack.job={actionId:'testpack.delivery',remaining:0};assert.throws(()=>validatePackState(state));
 const s=enterPack(emptyPackState(),d);s.packs.second=structuredClone(s.packs.testpack);assert.throws(()=>validatePackState(s));
 assert.throws(()=>advancePack(emptyPackState(),new Map(),-1));
 const unsafe=JSON.parse('{"schema":1,"packs":{"__proto__":{}}}');assert.throws(()=>validatePackState(unsafe));
});

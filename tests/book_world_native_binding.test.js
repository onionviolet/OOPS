import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createMolNativeBindings,validateMolEnvelope,molCalendarAt,molQuestProjection,validateMolNativeMetadata} from '../src/book_world_mol_native.js';
import {createParadiseNativeBindings,validateParadiseEnvelope,paradiseCalendarAt,paradiseQuestProjection,validateParadiseNativeMetadata} from '../src/book_world_paradise_native.js';
import {MOL_FOOTPRINTS,MOL_NATIVE_DOMAIN,molDefinitions,MOL_NATIVE_STOCK} from '../src/book_world_mol_content.js';
import {PARADISE_FOOTPRINTS,PARADISE_NATIVE_DOMAIN,paradiseDefinitions} from '../src/book_world_paradise_content.js';
// Regression for the shared mol/paradise native binding: save slice keys, inventory
// namespaces, serialized shapes and refusal messages must not change when the
// two world files share one implementation. Golden values were captured from
// the pre-extraction modules (2026-10-19). Regenerate only for an intended change.
const goldenPath=new URL('./fixtures/book_world_native_golden.json',import.meta.url);
const fixture=new URL('../docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g4/fixture/TEST-FIXTURE-R15-G4-control-pending.txt',import.meta.url);
const clone=x=>structuredClone(x);
function mocks(){
 class Comp{constructor(){this.is_unlocked=false;this.is_finished=false;this.is_locked=false;}}
 class Inv{constructor(){this.items={};}getItems(){return this.items;}}
 class Trader{constructor(o){Object.assign(this,o);this.inv=new Inv();this.av=new Comp();}getInventoryComponent(){return this.inv;}getAvailabilityComponent(){return this.av;}}
 class QuestTask{constructor(o){Object.assign(this,o);this.av=new Comp();}getAvailabilityComponent(){return this.av;}}
 class Quest{constructor(o){Object.assign(this,o);this.av=new Comp();}getAvailabilityComponent(){return this.av;}}
 class NPC{constructor(o){Object.assign(this,o);this.av=new Comp();}getAvailabilityComponent(){return this.av;}}
 class Loc{constructor(o){Object.assign(this,o);this.av=new Comp();}getAvailabilityComponent(){return this.av;}canBeStarted(){return true;}}
 class Time{constructor(seed){this.t={...seed};}loadTime(t){this.t={...t};}}
 const npcs={};
 const NPCRegistry={getAll:()=>npcs,add:(id,n)=>{npcs[id]=n;},get:id=>npcs[id]};
 return {NPC,NPCRegistry,SafeLocation:Loc,locations:{},InventoryComponent:Inv,inventories:{trader:{}},TraderComponent:Trader,Quest,QuestTask,quests:{},activeQuests:{},
  availabilities:{quest:{},trader:{}},Game_Time:Time,getItemFromKey:k=>({key:k}),getNativeContext:()=>({}),getCurrentLocation:()=>'Village',getNativeBody:()=>null};
}
function skeleton(){return {inventories:{trader:{}},quests:{},availabilities:{quest:{},trader:{},location:{},person:{}}};}
function messages(fn){try{fn();return 'no error';}catch(e){return e.message;}}
function worlds(){return {
 mol:{create:createMolNativeBindings,validate:validateMolEnvelope,validateMeta:validateMolNativeMetadata,calendarAt:molCalendarAt,projection:molQuestProjection,footprints:MOL_FOOTPRINTS,domain:MOL_NATIVE_DOMAIN,defs:molDefinitions,key:'motherOfLearning',ns:'book_world_mol',act:'molActivation',req:'molNativeRequests',stockField:'molStock'},
 paradise:{create:createParadiseNativeBindings,validate:validateParadiseEnvelope,validateMeta:validateParadiseNativeMetadata,calendarAt:paradiseCalendarAt,projection:paradiseQuestProjection,footprints:PARADISE_FOOTPRINTS,domain:PARADISE_NATIVE_DOMAIN,defs:paradiseDefinitions,key:'bookWorldCampaign',ns:'book_world_campaign',act:'paradiseActivation',req:'paradiseNativeRequests',stockField:'paradiseStock'}};}
function synthState(w){
 const people=Object.fromEntries(w.defs.people.map(p=>[p.id,{life:'alive',location:p.location}]));
 return {[w.key]:{instances:w.footprints.map((f,i)=>({id:f.instanceId,clock:{elapsed:30+i*500}})),nativeRevision:0,initializedAt:5},simulation:{people:{player:{location:'Village'},...people}},worlds:{}};
}
const stocks=(m,w)=>Object.fromEntries(Object.entries(m.inventories[w.ns]).map(([k,v])=>[k,v.getItems()]));
function traceWorld(w){
 const t={};
 t.calendars=[0,1,359,360,1439,43200,999999].map(e=>w.calendarAt(e));
 t.calendarError=messages(()=>w.calendarAt(-1));
 t.projectionError=messages(()=>w.projection({},'nope'));
 t.projections=w.footprints.map(f=>w.projection({[w.key]:{},worlds:{[f.worldId]:{facts:{}}}},f.worldId));
 t.projectionAbsent=w.footprints.map(f=>w.projection({},f.worldId));
 const m=mocks(),b=w.create(m);
 t.registerOnlyRead=messages(()=>b.read({}));
 b.register();b.register();
 t.registered={locations:Object.keys(m.locations),npcs:Object.keys(m.NPCRegistry.getAll()),quests:Object.keys(m.quests),invNs:Object.keys(m.inventories[w.ns]),tags:Object.values(m.locations).map(l=>l.tags),
  questMeta:Object.values(m.quests).map(q=>[q.quest_name,q.quest_description,q.questline,q.quest_tasks.length]),shops:Object.keys(m.inventories.trader),
  npcDesc:Object.values(m.NPCRegistry.getAll()).map(n=>n.description),locDesc:Object.values(m.locations).map(l=>l.description)};
 const absent={...skeleton(),inventories:{trader:{},person:{}},expansion:{}};
 t.absentValidate=b.validateEnvelope(clone(absent));
 b.restore(clone(absent));
 t.absentSnapshot=b.snapshot(clone(absent),{});
 t.absentBadStock=messages(()=>b.validateEnvelope({...clone(absent),inventories:{trader:{},[w.ns]:{[w.footprints[0].native.stockOwner]:{x:{count:1}}}}}));
 t.absentBadMeta=messages(()=>b.validateEnvelope({...clone(absent),[w.domain]:{}}));
 t.absentBadLocation=messages(()=>b.validateEnvelope({...clone(absent),'current location':w.footprints[0].native.locations[0]}));
 t.absentBadQuest=messages(()=>b.validateEnvelope({...clone(absent),quests:{[w.footprints[0].native.questId]:{is_active:true}}}));
 t.absentBadPerson=messages(()=>b.validateEnvelope({...clone(absent),availabilities:{person:{[w.defs.people[0].id]:1}}}));
 const state=synthState(w),plan={state,[w.act]:true};
 t.metaGood=w.validateMeta({schema:1,definitionRevision:1,revision:1,initializedAt:5,worldOwners:w.footprints.map(f=>({worldId:f.worldId,instanceId:f.instanceId,calendar:w.calendarAt(state[w.key].instances.find(i=>i.id===f.instanceId).clock.elapsed),stockOwner:f.native.stockOwner,shopOwner:f.native.shopOwner,peopleIds:w.defs.people.filter(p=>p.worldId===f.worldId).map(p=>p.id),questId:f.native.questId}))},{...state,[w.key]:{...state[w.key],nativeRevision:1}});
 t.metaBadShape=messages(()=>w.validateMeta({schema:1},state));
 t.metaBadRevision=messages(()=>w.validateMeta({schema:1,definitionRevision:1,revision:9,initializedAt:5,worldOwners:[]},state));
 t.staleStage=messages(()=>b.stage({state:clone(state),[w.act]:true,[w.req]:[{}]}));
 t.ordinaryDrop=messages(()=>b.stage({state:{},[w.act]:true}));
 const staged=b.stage(plan);
 const env=skeleton();staged.write(env);t.written=env;
 staged.publish();
 t.afterPublish={revision:state[w.key].nativeRevision,read:b.read(state),stock:stocks(m,w)};
 t.readStaleRevision=messages(()=>b.read({...state,[w.key]:{...state[w.key],nativeRevision:77}}));
 t.activeSnapshot=b.snapshot(skeleton(),state);
 t.snapshotStale=messages(()=>b.snapshot(skeleton(),{...state,[w.key]:{...state[w.key],nativeRevision:77}}));
 t.snapshotDropped=messages(()=>b.snapshot(skeleton(),{}));
 t.accessors={ownsPerson:b.ownsPerson(w.defs.people[0].id),ownsNot:b.ownsPerson('x'),personErr:messages(()=>b.getPerson('x')),calErr:messages(()=>b.getCalendar('x')),stockErr:messages(()=>b.getStock('x')),shopErr:messages(()=>b.getShop('x')),questErr:messages(()=>b.getQuest('x')),
  calendar:b.getCalendar(w.footprints[0].worldId).t};
 const cmd=w.defs.commands.find(c=>c[w.stockField]?.length);
 t.hasBuyCommand=!!cmd;
 if(cmd){const row=cmd[w.stockField][0];
  const buy={owner:row.owner,key:row.key,count:row.count,cause:cmd.id,expectedRevision:state[w.key].nativeRevision},paid=[{owner:'player',key:row.key,count:-row.count}];
  t.buyNoAcquisition=messages(()=>b.stage({state:clone(state),[w.req]:[buy],acquisitions:[]}));
  t.buyDuplicate=messages(()=>b.stage({state:clone(state),[w.req]:[buy,buy],acquisitions:paid}));
  t.buyBadShape=messages(()=>b.stage({state:clone(state),[w.req]:[{owner:1}],acquisitions:[]}));
  t.buyStale=messages(()=>b.stage({state:clone(state),[w.req]:[{...buy,expectedRevision:99}],acquisitions:paid}));
  const s2=clone(state);
  const st2=b.stage({state:s2,[w.req]:[buy],acquisitions:paid});
  const env2=skeleton();st2.write(env2);st2.publish();
  t.buy={revision:s2[w.key].nativeRevision,envelope:env2,stock:stocks(m,w)};
 }
 return t;
}
function trace(){
 const out={},W=worlds();
 for(const [name,w] of Object.entries(W))out[name]=traceWorld(w);
 const raw=JSON.parse(Buffer.from(fs.readFileSync(fixture,'utf8').split(':')[1],'base64'));
 const w=W.mol,m=mocks(),b=w.create(m);b.register();
 const f=out.molFixture={validate:b.validateEnvelope(clone(raw))};
 b.restore(clone(raw));
 const target=clone(raw);delete target[w.domain];
 b.snapshot(target,raw.expansion);
 f.snapshot={domainEqual:JSON.stringify(target[w.domain])===JSON.stringify(raw[w.domain]),quests:target.quests,availQuest:target.availabilities.quest,availLoc:target.availabilities.location};
 f.snapshotNativeStockEqualsSave=Object.keys(raw.inventories[w.ns]);
 f.read=b.read(raw.expansion);
 f.calendar=b.getCalendar('book.mol.cyoria').t;
 f.stockAfterRestore=stocks(m,w);
 const bad=clone(raw);bad[w.domain].revision+=1;f.badRevision=messages(()=>b.validateEnvelope(bad));
 const bad2=clone(raw);bad2.inventories[w.ns][Object.keys(bad2.inventories[w.ns])[0]]={x:{count:'a'}};f.badStock=messages(()=>b.validateEnvelope(bad2));
 const bad3=clone(raw);delete bad3.npcs[molDefinitions.people[0].id];f.badNpc=messages(()=>b.validateEnvelope(bad3));
 const bad4=clone(raw);bad4.availabilities.trader[w.footprints[0].native.shopOwner]=1;f.badTrade=messages(()=>b.validateEnvelope(bad4));
 const bad5=clone(raw);bad5.quests[w.footprints[0].native.questId]={is_active:false};f.badQuest=messages(()=>b.validateEnvelope(bad5));
 f.slice={domain:w.domain,ns:w.ns,stock:MOL_NATIVE_STOCK};
 return out;
}
test('mol and paradise native bindings keep their save keys, shapes and messages',()=>{
 const actual=JSON.parse(JSON.stringify(trace(),(k,v)=>v===undefined?null:v));
 if(process.env.UPDATE_GOLDEN){fs.writeFileSync(goldenPath,JSON.stringify(actual,null,1)+'\n');return;}
 assert.deepEqual(actual,JSON.parse(fs.readFileSync(goldenPath,'utf8')));
});
test('golden trace pins the shared save slice keys of both worlds',()=>{
 const g=JSON.parse(fs.readFileSync(goldenPath,'utf8'));
 assert.equal(g.molFixture.validate,true);
 assert.equal(g.molFixture.snapshot.domainEqual,true);
 assert.equal(g.molFixture.slice.domain,'book_world_mol_native');
 assert.equal(g.molFixture.slice.ns,'book_world_mol');
 assert.equal(PARADISE_NATIVE_DOMAIN,'book_world_campaign_native');
 assert.ok(g.paradise.written[PARADISE_NATIVE_DOMAIN]);
 assert.deepEqual(Object.keys(g.paradise.written.inventories).sort(),['book_world_campaign','trader']);
 assert.deepEqual(Object.keys(g.mol.written.inventories).sort(),['book_world_mol','trader']);
});

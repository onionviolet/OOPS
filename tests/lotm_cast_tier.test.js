import {LOTM_IDS as I} from '../src/book_world_lotm_ids.js';
import test from 'node:test';
import assert from 'node:assert/strict';
const evidence={label:'I',locator:'authored fixture'};
const place=(id,name,district)=>({id,name,indexId:id,openingHours:[],...evidence,...(district?{travel:{district,basis:'Authored test district.'}}:{})});
const person=(id,name)=>({id,indexId:id,name,tier:'principal',relations:[],knows:[],wants:[],...evidence});
const row=(id,actor,place,from,to)=>({id,actor,place,day:1,until:1,from,to,recurrence:'once',...evidence});
const fixture={schema:'lotm-cast/1',people:[person('fixture.person.arden','Arden Vale'),person('fixture.person.vela','Vela Reed'),person('fixture.person.remote','Tessa Wynn')],references:[],
 places:[place('fixture.place.home','Willow flat','evernight'),place('fixture.place.shop','Copper shop','machinery'),{...place('fixture.place.remote','Distant cabin'),city:'Copperhaven'}],placeAliases:[],clockClaims:[],beats:[],remoteWhereabouts:[{actor:'fixture.person.remote',place:'fixture.place.remote',...evidence}],anchors:[],
 schedule:[row('fixture.row.a','fixture.person.arden','fixture.place.home',0,100),row('fixture.row.b','fixture.person.arden','fixture.place.shop',100,300),row('fixture.row.c','fixture.person.vela','fixture.place.shop',0,300)],
 host:{profile:{id:'lotm.early_tingen.canon_beside@1',key:'beside',label:'Begin beside the Willow household',beyonderTrack:false,cash:480,home:null,start:'Tingen probationer lodging',blurb:'A resident near the Willow household.'},situation:{label:'Life beside Willow'}},
 bindings:{days:[{scene:'fixture.scene.1',day:1,from:0,to:300,label:'I',basis:'Authored test day.'}],clocks:[],schedule:[],beats:[]}};
fixture.schedule.push({...row('fixture.row.role-visit','fixture.person.vela','fixture.place.home',100,200),source:'canon'});fixture.people[1].tier='role';fixture.people[2].tier='recurring';fixture.bindings.schedule=fixture.schedule;

const actualFetch=globalThis.fetch;
globalThis.fetch=async path=>({ok:true,json:async()=>path.endsWith('manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:structuredClone(fixture)});
const {castNeedsFullContext,syncLotmCast,castSettledPeople}=await import('../src/book_world_lotm_cast_host.js');
const {whenCastLoaded}=await import('../src/book_world_lotm_cast_days.js');
await whenCastLoaded();globalThis.fetch=actualFetch;
const role=fixture.people[1].id;
const state=()=>({clock:1,lotm:{entryProfile:'lotm.early_tingen.canon_beside@1',initializedAt:0},worlds:{[I.world]:{facts:{}}},simulation:{people:{player:{location:'fixture.place.home'},...Object.fromEntries(fixture.people.map(p=>[p.id,{location:'unplaced',inventory:'simulation'}]))},knowledge:{player:{}},jobs:[],sessions:{},controllers:{},programs:{}}});
test('remote role context sleeps between boundaries, explicit work and observation wake it',()=>{
 const s=state();syncLotmCast(s);
 assert.equal(castNeedsFullContext(s,role),false);
 for(const p of fixture.people.filter(p=>p.tier!=='role'))assert.equal(castNeedsFullContext(s,p.id),true);
 s.simulation.people.player.location='fixture.place.shop';assert.equal(castNeedsFullContext(s,role),true);
 s.simulation.people.player.location='fixture.place.home';
 s.simulation.jobs.push({actorId:role});assert.equal(castNeedsFullContext(s,role),true);s.simulation.jobs=[];
 s.simulation.sessions[role]={participants:[role]};assert.equal(castNeedsFullContext(s,role),true);s.simulation.sessions={};
 s.simulation.controllers.test={actorId:role};assert.equal(castNeedsFullContext(s,role),true);s.simulation.controllers={};
 s.clock=300;assert.equal(castNeedsFullContext(s,role),true);syncLotmCast(s);assert.equal(castNeedsFullContext(s,role),false);
 s.clock=0;assert.equal(castNeedsFullContext(s,role),true);
});
test('role cards require both learned identity and a local body',()=>{
 const s=state();syncLotmCast(s);const pack={people:fixture.people};
 s.simulation.knowledge.player[`book.lotm.cast.known.${role}`]={value:'A received account'};
 assert.equal(castSettledPeople(s,{facts:{}},pack).length,0);
 s.simulation.people.player.location='fixture.place.shop';assert.equal(castSettledPeople(s,{facts:{}},pack).length,1);
 delete s.simulation.knowledge.player[`book.lotm.cast.known.${role}`];assert.equal(castSettledPeople(s,{facts:{}},pack).length,0);
});

test('role physical projection changes at its own boundaries and same-clock retries retain the due batch',()=>{
 const s=state();syncLotmCast(s);s.clock=2;s.simulation.people[role].location='fixture.place.detour';
 syncLotmCast(s);assert.equal(s.simulation.people[role].location,'fixture.place.detour');
 s.clock=100;const rejected=structuredClone(s);syncLotmCast(rejected);assert.equal(rejected.simulation.people[role].location,'fixture.place.home');
 syncLotmCast(s);assert.equal(s.simulation.people[role].location,'fixture.place.home');
});

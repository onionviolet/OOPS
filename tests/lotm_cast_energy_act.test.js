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
fixture.householdActs={objects:[],acts:[{id:'fixture.act.drink',operation:'inspect',place:'fixture.place.home',minutes:2,label:'Drink',description:'Drink the fixture draught.',report:'It burns.',knowledgeKey:'fixture.knowledge.drink',
 effects:[{type:'energy',energyId:'book.lotm.be_spirituality',operation:'recover',amount:1,cooling:0}]}]};
const actualFetch=globalThis.fetch;
globalThis.fetch=async path=>({ok:true,json:async()=>path.endsWith('manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:structuredClone(fixture)});
const host=await import('../src/book_world_lotm_cast_host.js');
const {whenCastLoaded}=await import('../src/book_world_lotm_cast_days.js');
const {createSimulationRegistry}=await import('../src/simulation_contracts.js');
const {lotmEnergies}=await import('../src/book_world_lotm_actions.js');
await whenCastLoaded();globalThis.fetch=actualFetch;
test('a cast place-act row may carry a lotm energy effect (B10)',()=>{
 assert.equal(host.castAvailable,true);
 const registry={simulation:createSimulationRegistry({energies:lotmEnergies})};
 assert.doesNotThrow(()=>host.installCast(registry));
 assert.ok(registry.simulation.commands.has('fixture.act.drink'));
});

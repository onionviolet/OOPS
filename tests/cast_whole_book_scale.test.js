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

fixture.leadLife={actorId:'fixture.person.arden'};
for(let n=0;n<1497;n++)fixture.people.push({...person('fixture.person.role'+n,'Role '+n),tier:'role'});
const actualFetch=globalThis.fetch;
globalThis.fetch=async path=>({ok:true,json:async()=>path.endsWith('manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:structuredClone(fixture)});
const {castNeedsFullContext,syncLotmCast,castSettledPeople,castEnrollmentPeople,castPeople,castWalkCommands,castWalkDefinition,castWalkDefinitionById,installCastWalk,castSyncDue,restoreUnavailableCast}=await import('../src/book_world_lotm_cast_host.js');
const {whenCastLoaded}=await import('../src/book_world_lotm_cast_days.js');
await whenCastLoaded();globalThis.fetch=actualFetch;
const role=fixture.people[1].id;
const state=()=>({clock:1,lotm:{entryProfile:'lotm.early_tingen.canon_beside@1',initializedAt:0},worlds:{[I.world]:{facts:{}}},simulation:{people:{player:{location:'fixture.place.home'},...Object.fromEntries(fixture.people.map(p=>[p.id,{location:'unplaced',inventory:'simulation'}]))},knowledge:{player:{}},jobs:[],sessions:{},controllers:{},programs:{}}});

test('whole-book roles stay definitions until scheduled or referenced, without a saved cache',()=>{
 const s=state();s.actors={};s.simulation.owners={};
 s.simulation.people={player:{location:'fixture.place.home'}};
 assert.equal(castPeople.length,1500);assert.equal(castEnrollmentPeople().length,2);
 syncLotmCast(s);
 assert.equal(s.simulation.people[role].location,'fixture.place.shop');
 assert.equal(s.simulation.people['fixture.person.role100'],undefined);
 assert.equal(s.actors['fixture.person.role100'],undefined);
 s.simulation.jobs.push({actorId:'player',targetId:'fixture.person.role100',participants:['player','fixture.person.role100']});
 assert.equal(castSyncDue(s),true);syncLotmCast(s);
 assert.ok(s.simulation.people['fixture.person.role100']);assert.ok(s.actors['fixture.person.role100']);
 assert.deepEqual(Object.keys(s).sort(),['actors','clock','lotm','simulation','worlds']);
 s.clock=100;const rejected=structuredClone(s);syncLotmCast(rejected);syncLotmCast(s);
 assert.equal(s.simulation.people[role].location,'fixture.place.home');
});
test('walk definitions are quoted lazily with stable IDs and exact admitted registry definitions',async()=>{
 assert.equal(castWalkCommands.length,0);
 const from='fixture.place.home',to='fixture.place.shop',def=castWalkDefinition(from,to);
 assert.equal(castWalkCommands.length,1);assert.equal(castWalkDefinition(from,to),def);
 assert.equal(castWalkDefinitionById(def.id),def);assert.equal(def.duration,25);
 assert.equal(castWalkDefinition(from,from),null);assert.equal(castWalkDefinition('unknown',to),null);
 assert.equal(castWalkDefinitionById('book.lotm.cast_walk_bad'),null);
 const {createSimulationRegistry}=await import('../src/simulation_contracts.js');
 const registry={simulation:createSimulationRegistry()};
 const admitted=installCastWalk(registry,from,to);assert.deepEqual(admitted,def);assert.ok(Object.isFrozen(admitted));
 assert.equal(installCastWalk(registry,from,to),admitted);assert.equal(registry.simulation.commands.size,1);
});

test('a seated lead remains the player body and does not trigger repeated missing-body syncs',async()=>{
 const {BE_PROFILE_ID}=await import('../src/seat_profiles.js');
 const s=state();s.actors={};s.simulation.owners={};s.simulation.people={player:{location:'fixture.place.home'}};
 s.lotm.entryProfile=BE_PROFILE_ID;syncLotmCast(s);
 assert.equal(s.simulation.people[fixture.leadLife.actorId],undefined);
 assert.equal(castSyncDue(s),false);
 s.simulation.workPlans={cursors:{'fixture.person.role25':{}}};
 assert.equal(castSyncDue(s),true);syncLotmCast(s);assert.ok(s.simulation.people['fixture.person.role25']);
});
test('a saved lazy walk installs its exact definition in a fresh registry before validation',async()=>{
 const def=castWalkDefinition('fixture.place.home','fixture.place.shop');
 const {createSimulationRegistry}=await import('../src/simulation_contracts.js');
 const registry={simulation:createSimulationRegistry()},s=state();s.simulation.jobs=[{commandId:def.id}];
 restoreUnavailableCast(s,registry);assert.deepEqual(registry.simulation.commands.get(def.id),def);
});

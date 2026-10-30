import test from 'node:test';
import assert from 'node:assert/strict';
import {validateLotmCast,lotmAnchorProbes} from '../src/book_world_lotm_cast.js';
const evidence={label:'I',locator:'authored fixture'};
const place=(id,name,district)=>({id,name,indexId:id,openingHours:[],...evidence,...(district?{travel:{district,basis:'Authored test district.'}}:{})});
const person=(id,name)=>({id,indexId:id,name,tier:'principal',relations:[],knows:[],wants:[],...evidence});
const row=(id,actor,place,from,to)=>({id,actor,place,day:1,until:1,from,to,recurrence:'once',...evidence});
const fixture={schema:'lotm-cast/1',people:[person('fixture.person.arden','Arden Vale'),person('fixture.person.vela','Vela Reed'),person('fixture.person.remote','Tessa Wynn')],references:[],
 places:[place('fixture.place.home','Willow flat','evernight'),place('fixture.place.shop','Copper shop','machinery'),{...place('fixture.place.remote','Distant cabin'),city:'Copperhaven'}],placeAliases:[],clockClaims:[],beats:[],remoteWhereabouts:[{actor:'fixture.person.remote',place:'fixture.place.remote',...evidence}],anchors:[],
 schedule:[row('fixture.row.a','fixture.person.arden','fixture.place.home',0,100),row('fixture.row.b','fixture.person.arden','fixture.place.shop',100,300),row('fixture.row.c','fixture.person.vela','fixture.place.shop',0,300)],
 host:{profile:{id:'lotm.early_tingen.canon_beside@1',key:'beside',label:'Begin beside the Willow household',beyonderTrack:false,cash:480,home:null,start:'Tingen probationer lodging',blurb:'A resident near the Willow household.'},situation:{label:'Life beside Willow'}},
 bindings:{days:[{scene:'fixture.scene.1',day:1,from:0,to:300,label:'I',basis:'Authored test day.'}],clocks:[],schedule:[],beats:[]}};
fixture.bindings.schedule=fixture.schedule;
// Install an invented fetch fixture before importing the static native registry.
const actualFetch=globalThis.fetch;
globalThis.fetch=async path=>({ok:true,json:async()=>path.endsWith('manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:structuredClone(fixture)});
const {bare,hostOver,save,registry,wait}=await import('./lotm_helpers.js');
const {castPeople,castTalkCommands,castPlaces,syncLotmCast,isRemoteCastPerson}=await import('../src/book_world_lotm_cast_host.js');
const {loadPrivateCast,whenCastLoaded}=await import('../src/book_world_lotm_cast_days.js');
await whenCastLoaded();
const {entryAnswers}=await import('../src/book_world_lotm_entry.js');
const {castDivinationCommands,castDivinationOffers}=await import('../src/book_world_lotm_cast_host.js');
const {lotmDivinationFacts}=await import('../src/book_world_lotm_div_supply.js');
test('the typed divination rows install and their support facts follow what the lead holds', async () => {
 assert.ok(castDivinationCommands.some(d=>d.id.startsWith('lotm.div.coin-divination.')),'rows merged into the pack definitions');
 const o=hostOver(bare());o.host.enroll('beside');
 const s=o.box.p.state,c={external:{money:5},gameplay:{player:{inventory:{}}}};
 const f=lotmDivinationFacts(s,c);
 assert.equal(f['actor.lotm.div.means.coin'],true);
 assert.equal(f['actor.lotm.div.contact.return-address'],true);
 assert.equal(f['actor.lotm.div.means.cane'],false,'no item, no means');
 assert.equal(lotmDivinationFacts(s,{...c,external:{money:0}})['actor.lotm.div.means.coin'],false);
 const withCane=lotmDivinationFacts(s,{...c,gameplay:{player:{inventory:{'book.lotm.div.means.cane':1}}}});
 assert.equal(withCane['actor.lotm.div.means.cane'],true);
 assert.equal(lotmDivinationFacts({...s,actors:{player:{worldId:'base.frontier'}}},c)['actor.lotm.div.means.coin'],false);
 await import('../src/book_world_lotm_domain.js');
 const {simulationFacts}=await import('../src/simulation_effects.js');
 const real=simulationFacts(s,{actorId:'player',external:c.external,gameplay:c.gameplay,vitals:{},facts:{location:s.simulation.people.player.location},nativeAlive:true},registry);
 assert.equal(real['actor.lotm.div.means.coin'],true,'the registry facts path carries the supplier');
});

test('grounds facts are held only by lead knowledge of the scene fact, never by money or method', async () => {
    const {lotmDivinationFacts: facts}=await import('../src/book_world_lotm_div_supply.js');
    const base={actors:{player:{worldId:'book.lotm.tingen'}},lotm:{},simulation:{knowledge:{player:{}},powers:{player:{}}}};
    const none=facts(base,{external:{money:5}});
    assert.equal(none['actor.lotm.div.grounds.coin-divination'],false);
    const held=facts({...base,simulation:{...base.simulation,knowledge:{player:{'book.lotm.div.grounds.coin-divination':{value:'x'}}}}},{});
    assert.equal(held['actor.lotm.div.grounds.coin-divination'],true);
    assert.equal(held['actor.lotm.div.grounds.cane-dowsing'],false);
});

// B6 + R9 fixture header copied from lotm_be_seat.test.js (cast pack stub for the be start).
import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {validateKnowledgeBasis} from '../src/causal_situations.js';

const evidence={label:'I',locator:'fixture p1'};
const people=['lead','relative'].map(id=>({id:`fixture.person.${id}`,indexId:`fixture.person.${id}`,name:id,tier:'principal',relations:[],knows:[],wants:[],...evidence}));
const schedule=[{id:'fixture.slot',actor:people[0].id,place:'fixture.place.other',day:1,until:1,from:0,to:100,recurrence:'once',...evidence}];
const beat={id:'fixture.beat',scene:'fixture.scene',actor:people[0].id,place:'fixture.place.other',dayIndex:1,until:1,needs:{fact:'fixture.unmet',value:true},effects:[{fact:'fixture.canon',value:true}],knows:[{key:'fixture.lesson',value:'A lesson.',audience:'actor'}],...evidence};
const fixture={schema:'lotm-cast/1',people,references:[],remoteWhereabouts:[],placeAliases:[],clockClaims:[],beats:[beat],anchors:[],schedule,
 places:[{id:'fixture.place.other',indexId:'fixture.place.other',name:'Other',openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence},{id:'fixture.place.next',indexId:'fixture.place.next',name:'Next',openingHours:[],travel:{district:'evernight',basis:'fixture'},...evidence}],
 host:{profile:{id:'lotm.early_tingen.canon_beside@1',key:'beside',blurb:'Fixture'},situation:{label:'Fixture'}},
 bindings:{days:[{scene:'fixture.scene',day:1,from:0,to:100}],schedule,beats:[beat]},leadLife:{
 actorId:'fixture.person.lead',profile:{id:'book.lead.be@1',key:'be',label:'Be a person',beyonderTrack:false,cash:1,home:null,start:'fixture.place.other',blurb:'Begin at home.'},knownPlaces:['fixture.place.other','fixture.place.next'],history:[{id:'school',value:'A remembered school.',date:'before start',locator:'fixture p1'}],
 relations:[{person:'fixture.person.relative',kind:'relative',date:'before start',locator:'fixture p2'}],
 intentions:[{id:'visit',label:'the day of your visit',offset:200,knowledge:'book.lotm.history.school'}],
 untakenChoices:[{id:'fixture.choice',scene:'fixture.scene',label:'An untaken option',status:'untaken',locator:'fixture p3'}]}};
const savedFetch=globalThis.fetch;
globalThis.fetch=async path=>({ok:true,json:async()=>String(path).endsWith('manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:structuredClone(fixture)});
const {leadLifeEntryEffects,validLeadLife}=await import('../src/book_world_lotm_lives.js');
const {syncLotmCast,castAvailable,planLotmCastBeats,canonActionDecision}=await import('../src/book_world_lotm_cast_host.js');
const {whenCastLoaded}=await import('../src/book_world_lotm_cast_days.js');
const {LOTM_IDS}=await import('../src/book_world_lotm_ids.js');
await whenCastLoaded();globalThis.fetch=savedFetch;
const {bare,hostOver,registry}=await import('./lotm_helpers.js');
const {validateLotmState}=await import('../src/book_world_lotm_state.js');
const {validateSimulationState}=await import('../src/simulation_contracts.js');
const {applyBeatKnowledge}=await import('../src/beat_knowledge.js');
const {applySimulationEffects}=await import('../src/simulation_effects.js');
const {createFreshLifeStart}=await import('../src/fresh_life_start.js');
const {freshNativeSave}=await import('../src/import_probe.js');
// B6 + R9: a paid client session moves the native purse once, records status/receipt/favor as facts, and the services-sold and referral readings derive from them.
const {simulationFacts}=await import('../src/simulation_effects.js');
const {meets,validateSimulationEffect}=await import('../src/simulation_contracts.js');
const {lotmFacts}=await import('../src/book_world_lotm_actions.js');
const C=await import('../src/book_world_lotm_be_clients.js');

function setup(){
 const o=hostOver(bare());o.host.enroll('be',{independent:true});
 const plan=structuredClone(o.box.p),apply=e=>applySimulationEffects(plan,e,{actorId:'player'},registry,'fixture.be.client');
 const facts=()=>{const ctx={actorId:'player',external:plan.external,gameplay:plan.gameplay,facts:{}};
  return {...simulationFacts(plan.state,ctx,registry),...lotmFacts(plan.state,{...ctx,vitals:{player:{health:24,max_health:24,stamina:18,max_stamina:18}}})};};
 return {plan,apply,can:r=>meets(r,facts()),money:()=>plan.external.money};
}

test('B6: a paid session moves the purse once by the net fee and records status, receipt and favor',()=>{
 const {plan,apply,can,money}=setup();
 const eff=C.clientSessionEffects('anna');for(const e of eff)validateSimulationEffect(e);
 assert.deepEqual(JSON.parse(JSON.stringify(eff)),eff,'plain JSON a pack can embed');
 assert.equal(eff.filter(e=>e.type==='resource').length,1,'one money effect, no second counter');
 const before=money();assert.equal(can(C.clientSessionRequires('anna')),true);
 apply(eff);
 assert.equal(money()-before,7,'8 pence less the club eighth (1) = 7');
 assert.equal(can(C.clientSessionRequires('anna')),false,'served once');
 const v=C.beClientView(plan.state);
 assert.equal(v.incomePence,7);assert.equal(v.sold.divination,1);
 assert.deepEqual(v.referrals.angelica,{label:'Angelica',sent:1,paid:1,favor:1});
 assert.equal(v.clients[0].favor,1);
 assert.match(C.clientSessionReport('anna'),/Anna paid 8 pence.*kept 1 pence.*took 7 pence/);
 validateLotmState(plan.state);validateLotmState(JSON.parse(JSON.stringify(plan.state)));
});

test('B6: a session with no stated fee invents none, and a refused client pays and earns nothing',()=>{
 for(const quote of [{basis:'unknown'},null]){
  const {plan,apply,money}=setup(),before=money();
  const eff=C.clientSessionEffects('anna',{quote});
  assert.ok(!eff.some(e=>e.type==='resource'),'no money effect');apply(eff);
  assert.doesNotMatch(C.clientSessionReport('anna',{quote}),/\d+ pence/,'no figure invented');
  assert.equal(money(),before);
  const v=C.beClientView(plan.state);assert.equal(v.incomePence,0);assert.deepEqual(v.sold,{});assert.equal(v.referrals.angelica.paid,0);
  assert.equal(v.clients[0].status,'served_unpaid');validateLotmState(plan.state);
 }
 const {plan,apply,can,money}=setup(),before=money();
 apply(C.clientRefuseEffects('anna'));
 assert.equal(money(),before);assert.equal(can(C.clientSessionRequires('anna')),false,'a refused client cannot then be served');
 const v=C.beClientView(plan.state);assert.equal(v.clients[0].status,'refused');assert.equal(v.referrals.angelica.favor,0);assert.deepEqual(v.sold,{});
 validateLotmState(plan.state);
});

test('B6: quotes in another currency or with bad figures are refused; a session never writes a second money ledger',()=>{
 assert.throws(()=>C.feeNet({pence:5,currency:'halfpence',basis:'stated'}),/exchange quote/);
 assert.throws(()=>C.feeNet({pence:-1,currency:'pence',basis:'stated'}),/positive/);
 assert.throws(()=>C.feeNet({pence:5,currency:'pence',basis:'guess'}),/basis/);
 assert.throws(()=>C.feeNet({pence:5,currency:'pence',basis:'stated',houseCut:{num:3,den:2}}),/fraction/);
 assert.throws(()=>C.clientSessionEffects('nobody'),/Unknown client/);
 assert.equal(C.feeNet({pence:5,currency:'pence',basis:'stated'}).net,5);
 const {plan,apply}=setup();apply(C.clientSessionEffects('anna'));
 const bad=structuredClone(plan.state);bad.actors.player.resources['book.lotm.be.fee.total']=7;assert.throws(()=>validateLotmState(bad),/purse only/);
 const lie=structuredClone(plan.state);delete lie.actors.player.facts['book.lotm.be.client.anna.fee'];assert.throws(()=>validateLotmState(lie),/fee receipt/);
});

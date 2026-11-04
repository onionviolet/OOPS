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

test('B6/C1: Anna pays one soli (12 pence); the club eighth and the halfpenny tip settle once later, so the purse follows the text (+12, then -2 = +10)',()=>{
 const {plan,apply,can,money}=setup();
 const eff=C.clientSessionEffects('anna');for(const e of eff)validateSimulationEffect(e);
 assert.deepEqual(JSON.parse(JSON.stringify(eff)),eff,'plain JSON a pack can embed');
 assert.equal(eff.filter(e=>e.type==='resource').length,1,'one money effect, no second counter');
 const before=money();assert.equal(can(C.clientSessionRequires('anna')),true);
 apply(eff);
 assert.equal(money()-before,12,'the soli note is 12 pence (ch55 P067)');
 assert.equal(can(C.clientSessionRequires('anna')),false,'served once');
 assert.equal(can(C.clientSettleRequires('anna')),true,'2 pence owed: 1.5 club eighth + 0.5 tip');
 const settle=C.clientSettleEffects('anna');for(const e of settle)validateSimulationEffect(e);
 apply(settle);
 assert.equal(money()-before,10,'a penny and two halfpence leave the purse (ch56 P036-P038)');
 assert.equal(can(C.clientSettleRequires('anna')),false,'settled once: the gate refuses a second payment');
 const v=C.beClientView(plan.state);
 assert.equal(v.incomePence,10);assert.equal(v.sold.divination,1);assert.equal(v.clients[0].owedPence,0);
 assert.deepEqual(v.referrals.angelica,{label:'Angelica',sent:1,paid:1,favor:1});
 assert.match(C.clientSessionReport('anna'),/Anna paid 12 pence.*2 pence is still owed/);
 validateLotmState(plan.state);validateLotmState(JSON.parse(JSON.stringify(plan.state)));
});

test('C1: Glacis and Joyce are served from registered data; a client registers without a src edit; a save with an unregistered client still validates and shows',()=>{
 for(const [id,gross,now,net] of [['glacis',8,8,7],['joyce',12,12,10.5]]){
  const {plan,apply,money}=setup(),before=money();
  apply(C.clientSessionEffects(id));assert.equal(money()-before,now);
  apply(C.clientSettleEffects(id));assert.equal(money()-before,net);
  assert.equal(C.feeNet(C.BE_CLIENTS.find(c=>c.id===id).quote).gross,gross);validateLotmState(plan.state);
 }
 assert.throws(()=>C.registerBeClient({id:'glacis',label:'G',service:'x',referrer:'a',referrerLabel:'A'}),/already registered/);
 C.registerBeClient({id:'tester_c',label:'Tester',service:'reading',referrer:'angelica',referrerLabel:'Angelica',quote:{amount:3,currency:'pence',basis:'listed'}});
 const {plan,apply,money}=setup(),before=money();apply(C.clientSessionEffects('tester_c'));assert.equal(money()-before,3);
 assert.throws(()=>C.clientSettleEffects('tester_c'),/Nothing is owed/);
 assert.throws(()=>C.registerBeClient({id:'bad',label:'B',service:'x',referrer:'a',referrerLabel:'A',quote:{amount:2,currency:'florin',basis:'stated'}}),/exchange quote/);
 // load order: a save holds a client the pack has not registered
 const s2=structuredClone(plan.state);s2.actors.player.facts['book.lotm.be.client.late_one']='paid';s2.actors.player.facts['book.lotm.be.client.late_one.fee']=5;
 validateLotmState(s2);assert.equal(C.beClientView(s2).clients.some(c=>c.id==='late_one'&&c.feePence===5),true);
 s2.actors.player.facts['book.lotm.be.client.late_one.fee']=0.3;assert.throws(()=>validateLotmState(s2),/fee receipt/);
});

test('C1: settle pays once across export/import (a retry after reload is refused and the purse does not move)',()=>{
 const {plan,apply,can,money}=setup();apply(C.clientSessionEffects('anna'));apply(C.clientSettleEffects('anna'));
 const m=money(),reloaded=JSON.parse(JSON.stringify(plan.state));
 const ctx={actorId:'player',external:plan.external,gameplay:plan.gameplay,facts:{}};
 const f={...simulationFacts(reloaded,ctx,registry),...lotmFacts(reloaded,{...ctx,vitals:{player:{health:24,max_health:24,stamina:18,max_stamina:18}}})};
 assert.equal(meets(C.clientSettleRequires('anna'),f),false);assert.equal(money(),m);assert.equal(f['lotm.be.client.anna.owed'],0);
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
 assert.throws(()=>C.feeNet({pence:0.25,currency:'pence',basis:'stated'}),/grain/);
 assert.throws(()=>C.feeNet({pence:5,currency:'pence',basis:'guess'}),/basis/);
 assert.throws(()=>C.feeNet({pence:5,currency:'pence',basis:'stated',houseCut:{num:3,den:2}}),/fraction/);
 assert.throws(()=>C.clientSessionEffects('nobody'),/Unknown client/);
 assert.equal(C.feeNet({pence:5,currency:'pence',basis:'stated'}).net,5);
 const {plan,apply}=setup();apply(C.clientSessionEffects('anna'));
 const bad=structuredClone(plan.state);bad.actors.player.resources['book.lotm.be.fee.total']=7;assert.throws(()=>validateLotmState(bad),/purse only/);
 const lie=structuredClone(plan.state);delete lie.actors.player.facts['book.lotm.be.client.anna.fee'];assert.throws(()=>validateLotmState(lie),/fee receipt/);
});

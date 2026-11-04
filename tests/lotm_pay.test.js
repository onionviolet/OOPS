// G3 + G4 fixture header copied from tests/lotm_be_clients.test.js (cast pack stub for the be start).
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
const P=await import('../src/book_world_lotm_pay.js');

function setup(){
 const o=hostOver(bare());o.host.enroll('be',{independent:true});
 const plan=structuredClone(o.box.p),apply=e=>applySimulationEffects(plan,e,{actorId:'player'},registry,'fixture.be.client');
 const facts=()=>{const ctx={actorId:'player',external:plan.external,gameplay:plan.gameplay,facts:{}};
  return {...simulationFacts(plan.state,ctx,registry),...lotmFacts(plan.state,{...ctx,vitals:{player:{health:24,max_health:24,stamina:18,max_stamina:18}}})};};
 return {plan,apply,facts,can:r=>meets(r,facts()),money:()=>plan.external.money,wait:m=>{plan.state.clock+=m;}};
}


const P1={amount:2,currency:'pound',basis:'stated',floor:true};
P.registerPayLine({id:'consult',label:'consultant extra',payer:'the Church',kind:'consultant_extra',steps:[{fromWeek:1,...P1},{fromWeek:13,amount:3,currency:'pound',basis:'stated'}]});
P.registerCommission({id:'tool',label:'the made item',patron:'the craftsman',total:{amount:10,currency:'pound',basis:'stated'},lead:{days:14,basis:'stated'},
 stages:[{id:'deposit',label:'deposit',amount:2,currency:'pound',basis:'stated'},{id:'progress',label:'on progress',amount:null},{id:'final',label:'at completion',amount:null}]});

test('G3: a weekly pay line pays each week once, steps up at the raise, and refuses a replay or an early week',()=>{
 const {plan,apply,can,money,wait,facts}=setup();assert.equal(can(P.payStartRequires('consult')),true);
 apply(P.payStartEffects('consult'));assert.equal(can(P.payStartRequires('consult')),false);
 assert.equal(can(P.payCollectRequires('consult',1)),false,'week not yet passed');
 wait(P.WEEK_MINUTES);assert.equal(can(P.payCollectRequires('consult',1)),true);
 let m=money();const e=P.payCollectEffects('consult',{week:1});for(const x of e)validateSimulationEffect(x);apply(e);
 assert.equal(money()-m,480,'at least two pounds');assert.match(P.payReport('consult',1),/at least 2 pounds/);
 assert.equal(can(P.payCollectRequires('consult',1)),false,'replay refused');assert.equal(can(P.payCollectRequires('consult',3)),false,'weeks are taken in order');
 assert.equal(P.payFor('consult',12),480);assert.equal(P.payFor('consult',13),720,'raise to three pounds');
 validateLotmState(plan.state);validateLotmState(JSON.parse(JSON.stringify(plan.state)));
 assert.equal(facts()['lotm.pay.consult.paid'],1);
});

test('G3: an unstated week pays nothing and invents no figure; bad lines are refused',()=>{
 P.registerPayLine({id:'late',label:'later pay',payer:'x',kind:'k',steps:[{fromWeek:3,amount:1,currency:'pound',basis:'stated'}]});
 assert.equal(P.payFor('late',2),null);assert.throws(()=>P.payCollectEffects('late',{week:2}),/none is invented/);
 assert.throws(()=>P.registerPayLine({id:'bad',label:'l',payer:'p',kind:'k',steps:[{fromWeek:1,amount:1,currency:'florin',basis:'stated'}]}),/exchange quote/);
 assert.throws(()=>P.registerPayLine({id:'bad2',label:'l',payer:'p',kind:'k',steps:[{fromWeek:2,amount:1,currency:'pence',basis:'stated'},{fromWeek:2,amount:2,currency:'pence',basis:'stated'}]}),/increasing/);
});

test('G4: a commission pays each stage once, in order, from the one purse; unknown stages need a stated figure; lead time gates delivery',()=>{
 const {plan,apply,can,money,wait,facts}=setup();
 apply(P.commissionOpenEffects('tool'));apply([{type:'resource',actor:'player',key:'money',native:true,amount:3000}]);assert.equal(can(P.commissionOpenRequires('tool')),false);
 const m=money();
 const dep=P.commissionStageEffects('tool','deposit');for(const x of dep)validateSimulationEffect(x);
 assert.equal(can(P.commissionStageRequires('tool','progress')),false,'earlier stage unpaid');
 apply(dep);assert.equal(m-money(),480,'deposit of two pounds out of the purse');
 assert.equal(can(P.commissionStageRequires('tool','deposit')),false,'deposit pays once');
 assert.throws(()=>P.commissionStageEffects('tool','progress'),/none is invented/);
 apply(P.commissionStageEffects('tool','progress',{pay:{amount:4,currency:'pound',basis:'stated'}}));assert.equal(m-money(),480+960);
 assert.equal(can(P.commissionDeliverRequires('tool')),false,'not ready');wait(14*P.DAY_MINUTES);assert.equal(can(P.commissionDeliverRequires('tool')),true);
 // reload round trip: progress is facts; a retry of a paid stage is refused and the purse does not move
 const re=JSON.parse(JSON.stringify(plan.state));validateLotmState(re);
 assert.equal(can(P.commissionStageRequires('tool','progress')),false);const after=money();
 apply(P.commissionStageEffects('tool','final',{pay:{amount:4,currency:'pound',basis:'stated'}}));
 apply(P.commissionDeliverEffects('tool'));assert.equal(after-money(),960);assert.equal(facts()['lotm.commission.tool.status'],'done');
 const v=P.payView(plan.state);assert.equal(v.commissions[0].stages.every(x=>x.paid),true);assert.equal(v.owed.length,0);assert.equal(m-money(),2400,'ten pounds in all, the stated total');
});

test('G4: a stage the purse cannot cover is refused and records nothing',()=>{
 const {plan,apply,money}=setup();apply(P.commissionOpenEffects('tool'));
 apply([{type:'resource',actor:'player',key:'money',native:true,amount:-plan.external.money+100}]);
 const m=money();assert.throws(()=>apply(P.commissionStageEffects('tool','deposit')),/Insufficient/);
 assert.equal(money(),m);assert.equal(plan.state.actors.player.facts['book.lotm.commission.tool.stage.deposit'],undefined);
});

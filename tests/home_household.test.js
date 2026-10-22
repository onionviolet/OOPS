import {createChronicle,advanceChronicle,lifespanDeadline,GAME_YEAR} from '../src/chronicle.js';
import {deriveHeirLeftovers,applyHeirLeftovers} from '../src/heir_inheritance.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,createContentRegistry,advanceSimulation,validateExpansionState,loadExpansionState} from '../src/expansion_engine.js';
import {planHome,emptyHomes,settleHomes,validateHomes,homeBenefits,homeRestable} from '../src/home_model.js';
import {homeWorkDefinitions,BUILDER,STEWARD,COOK,KEEPER,progressKey} from '../src/home_work_content.js';
import {ensureHomeSimulation,applyHomeSimulationEffects,stageHomeJob} from '../src/home_work.js';
import {applyGameplayEffect} from '../src/gameplay_transactions.js';
import {homeKey as k,HOME_PLACES as P,HOME_SITE,PACKED_TENT} from '../src/home_content.js';
import {isRainingOnDay} from '../src/weather_calendar.js';
import {settleHouseholdRest} from '../src/home_household.js';
import {TUTOR,SUPPLIER} from '../src/home_household_content.js';
import {deriveHomeEstate,applyHomeEstate} from '../src/home_inheritance.js';
const registry=createContentRegistry({worlds:[{id:'base.frontier'}],simulation:homeWorkDefinitions});
function rig(){
 let p={state:createExpansionState(19),external:{money:100},gameplay:{player:{inventory:{},skills:{Literacy:{xp:0,enabled:true}},reputation:{}}}},s={...emptyHomes(),beginning:true},location='Village',rain=false;
 const body={id:'native.player.body',form:'human',hands:2,mobile:true,ownerId:'player',controllerId:'player'};
 const context=()=>({world:'base.frontier',location,clock:p.state.clock,sequence:p.state.sequence,body:p.state.simulation?.people.player?.body||body,ready:!p.state.simulation?.jobs.some(j=>(j.participants||[j.actorId]).includes('player')),writable:true,alive:true,fresh:true,money:p.external.money,inventory:p.gameplay.player.inventory,unspendable:[],weatherAt:()=>({raining:rain}),resources:p.state.actors.player.resources,people:p.state.simulation?.people||{},jobs:p.state.simulation?.jobs||[],staffResources:Object.fromEntries(Object.entries(p.state.actors).map(([id,a])=>[id,a.resources])),staffStock:p.state.simulation?.owners||{},staffFacts:Object.fromEntries(Object.entries(p.state.actors).map(([id,a])=>[id,a.facts])),playerFacts:p.state.actors.player.facts});
 const settle=()=>{s=settleHomes(s,context(),null,e=>applyHomeSimulationEffects(p,e,registry,context()));validateHomes(s,context());validateExpansionState(p.state,registry);};
 const advance=n=>{const contexts=Object.fromEntries(Object.entries(p.state.simulation?.people||{}).map(([id,h])=>[id,{actorId:id,worldId:'base.frontier',facts:{location:id==='player'?location:h.location}}]));const previous=p.state;p=advanceSimulation(p.state,registry,n,p.external,p.gameplay,contexts);settleHouseholdRest(p,previous);settle();};
 return {get p(){return p;},get s(){return s;},context,advance,settle,go:l=>{location=l;if(p.state.simulation)p.state.simulation.people.player.location=l;},rain:v=>{rain=v;},materials:()=>{for(const id of ['Home fallen twigs','Home fallen poles','Home dry grass'])p.gameplay.player.inventory[k(id)]=30;},
 run(r){const c=context(),q=planHome(s,r,c);p=structuredClone(p);p.state.sequence++;for(const i of q.items)applyGameplayEffect(p.gameplay,{type:'item',key:i.key,amount:Math.abs(i.amount)},'player',i.amount<0);p.external.money+=q.money-c.money;applyHomeSimulationEffects(p,q.simEffects,registry,c);if(q.body){ensureHomeSimulation(p,location);p.state.simulation.people.player.body=q.body;}if(q.job)stageHomeJob(p,q.job,registry,c);s=q.state;if(q.location){location=q.location;if(p.state.simulation)p.state.simulation.people.player.location=location;}if(q.minutes)advance(q.minutes);else settle();return q;},
 reload(){p={...p,state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry)};s=JSON.parse(JSON.stringify(s));settle();},
 };
}
test('staff rest uses native occupied intervals, survives reload and leave is an actual refusal',()=>{
 const r=rig();r.run({type:'start',profile:'ducal'});r.run({type:'staff_leave',actor:COOK});assert.throws(()=>r.run({type:'staff_order',service:'cook'}),/leave/);r.reload();r.run({type:'staff_return',actor:COOK});r.run({type:'staff_order',service:'cook'});
 assert.equal(r.p.state.actors[COOK].resources['home.energy'],40);assert.throws(()=>r.run({type:'staff_leave',actor:COOK}),/accepted work/);r.advance(10);assert.equal(r.p.state.actors[COOK].resources['home.energy'],40);r.go('Village');r.advance(7);assert.equal(r.p.state.actors[COOK].resources['home.energy'],47);r.reload();r.advance(100);assert.equal(r.p.state.actors[COOK].resources['home.energy'],60);
 r.p.state.actors[COOK].resources['home.energy']=19;r.go(P.manor.location);assert.throws(()=>r.run({type:'staff_order',service:'cook'}),/resting/);r.advance(1);r.run({type:'staff_order',service:'cook'});const j=r.p.state.simulation.jobs.find(j=>j.actorId===COOK);r.run({type:'cancel_staff',job:j.id});assert.equal(r.p.state.actors[COOK].resources['home.energy'],20);
});
test('coarse and partitioned idle rest agree without recovering during accepted work',()=>{
 const r=rig();r.run({type:'start',profile:'ducal'});r.run({type:'staff_order',service:'cook'});const previous=structuredClone(r.p.state),coarse=structuredClone(r.p),fine=structuredClone(r.p);coarse.state.clock=30;settleHouseholdRest(coarse,previous);
 for(let n=1;n<=30;n++){const prev=structuredClone(fine.state);fine.state.clock=n;settleHouseholdRest(fine,prev);}
 assert.equal(coarse.state.actors[COOK].resources['home.energy'],60);assert.deepEqual(coarse.state.actors[COOK].resources,fine.state.actors[COOK].resources);
});
test('tutor reserves both people, actual fee and real Literacy; cancellation and lost contact refund',()=>{
 const r=rig();r.run({type:'start',profile:'ducal'});r.run({type:'tutor'});assert.deepEqual(r.p.state.simulation.jobs[0].participants,[TUTOR,'player']);assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],56);assert.throws(()=>r.run({type:'family_accept'}),/free body/);r.advance(5);r.reload();r.advance(15);assert.equal(r.p.gameplay.player.skills.Literacy.xp,12);assert.equal(r.p.state.actors[TUTOR].resources['home.wages'],4);assert.equal(r.p.state.actors.player.resources['home.readingPractice'],12);
 r.run({type:'tutor'});const id=r.p.state.simulation.jobs[0].id;r.go('Village');r.advance(20);assert.equal(r.p.gameplay.player.skills.Literacy.xp,12);assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],56);assert.equal(r.p.state.simulation.jobs.some(j=>j.id===id),false);
 r.go(P.manor.location);r.p.state.actors.player.resources['home.readingPractice']=120;assert.throws(()=>r.run({type:'tutor'}),/syllabus/);
});
test('family request can be declined, accepted, cancelled and actually kept once',()=>{
 const r=rig();r.run({type:'start',profile:'royal'});r.run({type:'family_decline'});assert.equal(r.s.properties.manor.access,true);assert.throws(()=>r.run({type:'family_duty'}),/agree/);r.run({type:'family_accept'});r.run({type:'family_duty'});r.advance(5);r.run({type:'cancel_household',job:r.p.state.simulation.jobs[0].id});assert.equal(r.p.state.actors.player.facts['home.familyDutyKept'],false);r.run({type:'family_duty'});r.advance(15);r.reload();assert.equal(r.p.state.actors.player.facts['home.familyDutyKept'],true);assert.throws(()=>r.run({type:'family_duty'}),/unfinished/);assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],120);
});
test('pantry orders reserve finite supplier stock, refund cancellation and deliver from actual funds',()=>{
 const r=rig();r.run({type:'start',profile:'ducal'});r.run({type:'pantry_order'});assert.equal(r.p.state.simulation.owners[SUPPLIER][k('Rat meat chunks')],8);assert.equal(r.p.state.simulation.owners[COOK][k('Rat meat chunks')],4);assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],52);
 r.run({type:'cancel_household',job:r.p.state.simulation.jobs[0].id});assert.equal(r.p.state.simulation.owners[SUPPLIER][k('Rat meat chunks')],12);assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],60);
 for(let i=0;i<3;i++){if(i){r.run({type:'pantry_return'});r.advance(10);}r.run({type:'pantry_order'});r.reload();r.go('Village');r.advance(40);r.go(P.manor.location);}
 assert.equal(r.p.state.simulation.owners[COOK][k('Rat meat chunks')],16);assert.equal(r.p.state.actors[SUPPLIER].resources['home.wages'],24);assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],36);r.run({type:'pantry_return'});r.advance(10);assert.throws(()=>r.run({type:'pantry_order'}),/insufficient|Insufficient|enough|negative|cost|Cost/);
});
test('estate conveys owned home condition and goods, never household title, employees or rank',()=>{
 const r=rig();r.run({type:'start',profile:'homeowner'});r.go('Village');r.run({type:'acquire',home:'rental'});r.go(P.rental.location);r.run({type:'deposit',home:'rental',key:k('Rough wood log')});r.s.properties.cottage.condition.integrity=67;
 const prior={homes:r.s,expansion:r.p.state},estate=deriveHomeEstate(prior),next={inventories:{person:{main_character:{}}}};applyHomeEstate(next,estate);validateHomes(next.homes,{clock:0,sequence:0});assert.equal(next.homes.properties.cottage.condition.integrity,67);assert.equal(next.homes.properties.rental,undefined);assert.equal(next.inventories.person.main_character[k('Rough wood log')].count,1);assert.equal(next.homes.start,null);assert.equal(next.homes.workers,undefined);
 const noble=rig();noble.run({type:'start',profile:'ducal'});const e=deriveHomeEstate({homes:noble.s,expansion:noble.p.state});assert.deepEqual(e.homes.properties,{});assert.equal(e.homes.start,null);assert.equal(e.goods.length,0);
});

test('unearned shared labor pay rejoins the estate before debt settlement and is not paid twice',()=>{
 const r=rig();r.run({type:'start',profile:'builder'});r.materials();r.run({type:'build',home:'shelter'});r.run({type:'hire_builder'});r.run({type:'work',home:'shelter',shared:true});
 const calendar={year:999,month:4,day:1,hour:8,minute:0,day_count:1};let ch=createChronicle(r.p.state.clock,calendar,true);ch.life.initialAge=80-2/GAME_YEAR;const end=lifespanDeadline(ch);ch=advanceChronicle(ch,end);
 const previous={homes:r.s,expansion:{...structuredClone(r.p.state),clock:end,chronicle:ch},character:{money:0,reputation:{}},village_career:{debt:3}};
 const l=deriveHeirLeftovers(previous);assert.equal(l.residences.money,2);assert.equal(l.money,0);assert.deepEqual(l.debts,[{id:'kitDebt',owed:3,paid:2,shortfall:1}]);const next={character:{money:10,reputation:{}},inventories:{}};applyHeirLeftovers(next,l);assert.equal(next.character.money,10);assert.equal(next.homes.properties.shelter,undefined);assert.equal(next.inventories.person.main_character[k('Home fallen poles')].count,4);
});

import {staffQuote} from '../src/home_work_content.js';
test('E2: a gathering errand reserves Toma by person ID, settles exactly its quoted terms once and survives reload',()=>{
 const r=rig();r.run({type:'start',profile:'ducal'});const q=staffQuote('home.staff.gather');
 assert.deepEqual({minutes:q.minutes,funds:q.funds,energy:q.energy},{minutes:30,funds:2,energy:20});
 const before={funds:r.p.state.actors[STEWARD].resources['home.estateFunds'],stock:{...r.p.state.simulation.owners[KEEPER]}};
 r.run({type:'staff_order',service:'gather'});
 const job=r.p.state.simulation.jobs.find(j=>j.commandId==='home.staff.gather');assert.equal(job.actorId,KEEPER);assert.equal(job.due-r.p.state.clock,q.minutes);
 r.s.properties.manor.condition={...r.s.properties.manor.condition,wetness:50};assert.throws(()=>r.run({type:'staff_order',service:'dry'}),/working|current activity|unavailable/);
 assert.throws(()=>r.run({type:'staff_order',service:'gather'}),/gathering|working/);
 r.reload();r.go('Village');r.advance(q.minutes);r.go(P.manor.location);
 assert.equal(r.p.state.simulation.jobs.some(j=>j.commandId==='home.staff.gather'),false);
 for(const y of q.yields)assert.equal(r.p.state.simulation.owners[KEEPER][y.key],(before.stock[y.key]||0)+y.count);
 assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],before.funds-q.funds);
 r.advance(30);for(const y of q.yields)assert.equal(r.p.state.simulation.owners[KEEPER][y.key],(before.stock[y.key]||0)+y.count,'settles once');
 r.run({type:'staff_order',service:'gather'});r.run({type:'cancel_staff',job:r.p.state.simulation.jobs.find(j=>j.commandId==='home.staff.gather').id});
 assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],before.funds-q.funds,'cancellation refunds the reserved wage');
});

// E5b: office fund and policy pass to a successor; personal wages and energy do not.
import {officeDecision,OFFICE_TERMS} from '../src/home_office.js';
import {homeJobContext} from '../src/home_work.js';
test('E5b: the pantry office orders under its disclosed policy, pauses with a reason and passes its fund to a successor',()=>{
 const r=rig();r.run({type:'start',profile:'ducal'});
 const ctx=()=>{const s=r.p.state,sim=s.simulation,ids=[STEWARD,COOK,KEEPER,TUTOR,SUPPLIER];return {people:sim.people,jobs:sim.jobs,staffResources:Object.fromEntries(ids.map(id=>[id,s.actors[id]?.resources||{}])),staffStock:Object.fromEntries(ids.map(id=>[id,sim.owners[id]||{}])),staffFacts:Object.fromEntries(ids.map(id=>[id,s.actors[id]?.facts||{}]))};};
 assert.equal(officeDecision(ctx()).status,'none');
 const treasury=r.p.state.actors[STEWARD].resources['home.estateFunds'];
 r.run({type:'office_establish'});assert.equal(r.p.state.actors[STEWARD].resources['home.officeFunds'],OFFICE_TERMS.establish);
 assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],treasury-OFFICE_TERMS.establish);assert.throws(()=>r.run({type:'office_establish'}),/already exists/);
 assert.equal(officeDecision(ctx()).status,'idle');
 r.p.state.simulation.owners[COOK][k('Rat meat chunks')]=1;const d=officeDecision(ctx());assert.equal(d.status,'order');assert.equal(d.job.actor,STEWARD);
 const order=(job)=>{const p=r.p;p.state.sequence++;stageHomeJob(p,job,registry,{location:P.manor.location,body:p.state.simulation.people.player.body});};
 order(d.job);assert.equal(officeDecision(ctx()).status,'waiting');assert.equal(r.p.state.actors[STEWARD].resources['home.officeFunds'],OFFICE_TERMS.establish-OFFICE_TERMS.orderCost);
 r.reload();r.advance(20);assert.equal(r.p.state.simulation.owners[COOK][k('Rat meat chunks')],1+OFFICE_TERMS.meat,'delivery settles once from the office fund');
 r.run({type:'pantry_return'});r.advance(10);delete r.p.state.simulation.owners[COOK][k('Rat meat chunks')];
 const rowanWages=r.p.state.actors[STEWARD].resources['home.wages']||0,tomaEnergy=r.p.state.actors[KEEPER].resources['home.energy'];
 assert.throws(()=>r.run({type:'office_succeed'}),/available/);
 r.run({type:'staff_leave',actor:STEWARD});const paused=officeDecision(ctx());assert.equal(paused.status,'paused');assert.match(paused.reason,/Rowan is on agreed leave/);
 r.run({type:'office_succeed'});
 assert.equal(r.p.state.actors[KEEPER].resources['home.officeFunds'],OFFICE_TERMS.establish-OFFICE_TERMS.orderCost);assert.equal(r.p.state.actors[STEWARD].resources['home.officeFunds'],0);
 assert.equal(r.p.state.actors[STEWARD].resources['home.wages']||0,rowanWages,'personal wages stay with Rowan');assert.equal(r.p.state.actors[KEEPER].resources['home.energy'],tomaEnergy);
 const next=officeDecision(ctx());assert.equal(next.status,'order');assert.equal(next.job.actor,KEEPER);order(next.job);
 r.advance(20);assert.equal(r.p.state.simulation.owners[COOK][k('Rat meat chunks')],OFFICE_TERMS.meat);assert.equal(r.p.state.actors[KEEPER].resources['home.officeFunds'],0);
 delete r.p.state.simulation.owners[COOK][k('Rat meat chunks')];assert.match(officeDecision(ctx()).reason,/fund holds 0/);
});

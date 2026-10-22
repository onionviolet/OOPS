import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,createContentRegistry,advanceSimulation,validateExpansionState,loadExpansionState} from '../src/expansion_engine.js';
import {planHome,emptyHomes,settleHomes,validateHomes,homeBenefits,homeRestable} from '../src/home_model.js';
import {homeWorkDefinitions,BUILDER,STEWARD,COOK,KEEPER,progressKey} from '../src/home_work_content.js';
import {ensureHomeSimulation,applyHomeSimulationEffects,stageHomeJob} from '../src/home_work.js';
import {applyGameplayEffect} from '../src/gameplay_transactions.js';
import {homeKey as k,HOME_PLACES as P,HOME_SITE,PACKED_TENT} from '../src/home_content.js';
import {isRainingOnDay} from '../src/weather_calendar.js';
const registry=createContentRegistry({worlds:[{id:'base.frontier'}],simulation:homeWorkDefinitions});
function rig(){
 let p={state:createExpansionState(19),external:{money:100},gameplay:{player:{inventory:{},skills:{},reputation:{}}}},s={...emptyHomes(),beginning:true},location='Village',rain=false;
 const body={id:'native.player.body',form:'human',hands:2,mobile:true,ownerId:'player',controllerId:'player'};
 const context=()=>({world:'base.frontier',location,clock:p.state.clock,sequence:p.state.sequence,body:p.state.simulation?.people.player?.body||body,ready:!p.state.simulation?.jobs.some(j=>(j.participants||[j.actorId]).includes('player')),writable:true,alive:true,fresh:true,money:p.external.money,inventory:p.gameplay.player.inventory,unspendable:[],weatherAt:()=>({raining:rain}),resources:p.state.actors.player.resources,people:p.state.simulation?.people||{},jobs:p.state.simulation?.jobs||[],staffResources:Object.fromEntries(Object.entries(p.state.actors).map(([id,a])=>[id,a.resources])),staffStock:p.state.simulation?.owners||{}});
 const settle=()=>{s=settleHomes(s,context(),null,e=>applyHomeSimulationEffects(p,e,registry,context()));validateHomes(s,context());validateExpansionState(p.state,registry);};
 const advance=n=>{const contexts=Object.fromEntries(Object.entries(p.state.simulation?.people||{}).map(([id,h])=>[id,{actorId:id,worldId:'base.frontier',facts:{location:id==='player'?location:h.location}}]));p=advanceSimulation(p.state,registry,n,p.external,p.gameplay,contexts);settle();};
 return {get p(){return p;},get s(){return s;},context,advance,settle,go:l=>{location=l;if(p.state.simulation)p.state.simulation.people.player.location=l;},rain:v=>{rain=v;},materials:()=>{for(const id of ['Home fallen twigs','Home fallen poles','Home dry grass'])p.gameplay.player.inventory[k(id)]=30;},
 run(r){const c=context(),q=planHome(s,r,c);p=structuredClone(p);p.state.sequence++;for(const i of q.items)applyGameplayEffect(p.gameplay,{type:'item',key:i.key,amount:Math.abs(i.amount)},'player',i.amount<0);p.external.money+=q.money-c.money;applyHomeSimulationEffects(p,q.simEffects,registry,c);if(q.body){ensureHomeSimulation(p,location);p.state.simulation.people.player.body=q.body;}if(q.job)stageHomeJob(p,q.job,registry,c);s=q.state;if(q.location)location=q.location;if(q.minutes)advance(q.minutes);else settle();return q;},
 reload(){p={...p,state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry)};s=JSON.parse(JSON.stringify(s));settle();},
 };
}
function build(r,id){r.run({type:'build',home:id});while(r.s.projects?.[id]){r.run({type:'work',home:id});r.advance(5);}}
test('real jobs retain construction, cancel unfinished contribution, resume after travel and reload',()=>{
 const r=rig();r.run({type:'start',profile:'builder'});r.materials();const before=r.p.gameplay.player.inventory[k('Home fallen poles')];r.run({type:'build',home:'shelter'});assert.equal(r.s.properties.shelter,undefined);assert.equal(r.p.gameplay.player.inventory[k('Home fallen poles')],before-4);
 r.run({type:'work',home:'shelter'});r.advance(2);r.reload();assert.equal(r.p.state.simulation.jobs.length,1);r.run({type:'cancel_work',job:r.p.state.simulation.jobs[0].id});assert.equal(r.p.state.actors.player.resources[progressKey('shelter','build')]||0,0);
 r.run({type:'work',home:'shelter'});r.advance(5);assert.equal(r.p.state.actors.player.resources[progressKey('shelter','build')],5);r.go('Village');r.advance(10);assert.equal(r.s.properties.shelter,undefined);r.reload();r.go(HOME_SITE);
 while(r.s.projects.shelter){r.run({type:'work',home:'shelter'});r.advance(5);}assert.ok(r.s.properties.shelter);assert.equal(r.p.state.actors.player.resources[progressKey('shelter','build')],0);r.reload();assert.equal(r.s.properties.shelter.construction.site,HOME_SITE);
});
test('shared labor occupies the actual helper, refunds unearned pay and pays only completed work',()=>{
 const r=rig();r.run({type:'start',profile:'builder'});r.materials();r.run({type:'build',home:'shelter'});r.run({type:'hire_builder'});const coins=r.p.external.money;r.run({type:'work',home:'shelter',shared:true});assert.equal(r.p.external.money,coins-2);assert.ok(r.p.state.simulation.jobs[0].participants.includes(BUILDER));assert.throws(()=>r.run({type:'hire_builder'}),/free body/);r.advance(2);r.run({type:'cancel_work',job:r.p.state.simulation.jobs[0].id});assert.equal(r.p.external.money,coins);assert.equal(r.p.state.actors[BUILDER].resources['home.wages']||0,0);
 r.run({type:'work',home:'shelter',shared:true});r.advance(5);assert.equal(r.p.state.actors.player.resources[progressKey('shelter','build')],10);assert.equal(r.p.state.actors[BUILDER].resources['home.wages'],2);assert.equal(r.p.external.money,coins-2);
});
test('native rain, time partitioning, damaged roof and repairs affect real rest/condition',()=>{
 assert.equal(isRainingOnDay(4),true);assert.equal(isRainingOnDay(3),false);
 const r=rig();r.run({type:'start',profile:'wildbird'});r.materials();build(r,'nest');r.go(P.nest.location);r.run({type:'weave_lining'});r.run({type:'install',home:'nest',key:k('Home nest lining')});const dry=homeBenefits(r.s,r.context()).xp.Sleeping;r.rain(true);r.advance(480);assert.equal(r.s.properties.nest.condition.integrity,99);assert.equal(homeBenefits(r.s,r.context()).xp.Sleeping,undefined);assert.ok(dry>1);
 const coarse=structuredClone(r.s),fine=structuredClone(r.s);let a=coarse,b=fine;const now=r.p.state.clock;a=settleHomes(a,{...r.context(),clock:now+20});for(let i=1;i<=20;i++)b=settleHomes(b,{...r.context(),clock:now+i});assert.deepEqual(a.properties.nest.condition,b.properties.nest.condition);
 r.rain(false);r.run({type:'repair',home:'nest'});while(r.s.projects.nest){r.run({type:'work',home:'nest'});r.advance(5);}assert.equal(r.s.properties.nest.condition.integrity,100);r.advance(1000);assert.equal(r.s.properties.nest.condition.wetness,0);assert.ok(homeBenefits(r.s,r.context()).xp.Sleeping>1);
 r.s.properties.nest.condition.integrity=20;assert.equal(homeRestable(r.s.properties.nest,r.context()),false);
});
test('wet gathering needs drying; outdoor rain slows accepted construction work',()=>{
 const r=rig();r.run({type:'start',profile:'builder'});r.rain(true);r.run({type:'gather',item:'Home dry grass'});assert.equal(r.p.gameplay.player.inventory[k('Home damp grass')],1);assert.throws(()=>r.run({type:'dry_grass'}),/under a sound roof/);r.rain(false);r.run({type:'dry_grass'});assert.equal(r.p.gameplay.player.inventory[k('Home dry grass')],1);
 r.materials();r.run({type:'build',home:'shelter'});r.rain(true);r.run({type:'work',home:'shelter'});const job=r.p.state.simulation.jobs[0];assert.equal(job.due-r.p.state.clock,10);r.advance(5);assert.equal(r.p.state.actors.player.resources[progressKey('shelter','build')]||0,0);r.advance(5);assert.equal(r.p.state.actors.player.resources[progressKey('shelter','build')],5);
});
test('portable structure requires actual carried kit, retains condition and changes camp without moving stored goods',()=>{
 const r=rig();r.run({type:'start',profile:'builder'});r.materials();build(r,'tent');r.go(P.tent.location);r.s.properties.tent.condition.integrity=77;r.run({type:'deposit',home:'tent',key:k('Home dry grass')});assert.throws(()=>r.run({type:'pack_home',home:'tent'}),/collect goods/);r.run({type:'withdraw',home:'tent',key:k('Home dry grass')});r.run({type:'pack_home',home:'tent'});assert.equal(r.s.properties.tent,undefined);assert.equal(r.p.gameplay.player.inventory[k(PACKED_TENT)],1);r.reload();r.go('Village');r.run({type:'pitch_home'});assert.equal(r.s.properties.tent.anchor,'Village');assert.equal(r.s.properties.tent.condition.integrity,77);assert.equal(r.p.gameplay.player.inventory[k(PACKED_TENT)],undefined);assert.throws(()=>r.run({type:'pitch_home'}),/packed shelter/);r.reload();
});
test('noble starts keep household title, finite treasury/allowance, native staff jobs/supplies and hospitality',()=>{
 for(const [profile,funds,allowance]of [['ducal',60,10],['royal',120,20]]){
  const r=rig();r.run({type:'start',profile});assert.equal(r.s.properties.manor.owner,'arlmere.household');assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],funds);assert.throws(()=>r.run({type:'remove',home:'manor',slot:'bed'}),/remain with/);assert.throws(()=>r.run({type:'rename',home:'manor',name:'Mine'}),/your own/);
  const coins=r.p.external.money;r.run({type:'allowance'});assert.equal(r.p.external.money,coins+allowance);assert.throws(()=>r.run({type:'allowance'}),/exhausted/);
  r.run({type:'staff_order',service:'cook'});r.run({type:'staff_order',service:'repair'});assert.equal(r.p.state.simulation.jobs.length,2);assert.throws(()=>r.run({type:'staff_order',service:'cook'}),/current activity/);r.reload();r.go('Village');r.advance(15);assert.equal(r.p.state.simulation.owners[COOK][k('Roasted rat meat')],2);assert.equal(r.s.properties.manor.condition.integrity,95);assert.equal(r.p.state.actors[COOK].resources['home.wages'],2);assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],funds-allowance-5);
  r.go(P.manor.location);r.run({type:'collect_meal'});assert.equal(r.p.gameplay.player.inventory[k('Roasted rat meat')],1);assert.equal(r.p.state.simulation.owners[COOK][k('Roasted rat meat')],1);
  r.run({type:'staff_order',service:'cook'});const job=r.p.state.simulation.jobs.find(j=>j.actorId===COOK);r.run({type:'cancel_staff',job:job.id});assert.equal(r.p.state.simulation.owners[COOK][k('Rat meat chunks')],2);r.reload();
 }
});

test('loss of actual work means stops a shared contribution and returns its unearned wages',()=>{
 const r=rig();r.run({type:'start',profile:'builder'});r.materials();r.run({type:'build',home:'shelter'});r.run({type:'hire_builder'});const money=r.p.external.money;r.run({type:'work',home:'shelter',shared:true});r.p.state.simulation.people.player.body.hands=0;r.advance(5);assert.equal(r.p.external.money,money);assert.equal(r.p.state.actors[BUILDER].resources['home.wages']||0,0);assert.equal(r.p.state.actors.player.resources[progressKey('shelter','build')]||0,0);assert.ok(r.s.projects.shelter);
});
test('weatherproofing changes rain wear and abandoned frames return only unworked materials',()=>{
 const r=rig();r.run({type:'start',profile:'builder'});r.materials();build(r,'shelter');r.go(P.shelter.location);r.run({type:'weatherproof',home:'shelter'});while(r.s.projects.shelter){r.run({type:'work',home:'shelter'});r.advance(5);}assert.equal(r.s.properties.shelter.weatherproof,true);r.rain(true);r.advance(240);assert.equal(r.s.properties.shelter.condition.integrity,99);
 const a=rig();a.run({type:'start',profile:'builder'});a.materials();a.run({type:'build',home:'shelter'});a.run({type:'work',home:'shelter'});a.advance(5);a.run({type:'cancel_project',home:'shelter'});assert.equal(a.s.projects.shelter,undefined);assert.equal(a.s.properties.shelter,undefined);assert.equal(a.p.gameplay.player.inventory[k('Home fallen poles')],29);assert.equal(a.p.gameplay.player.inventory[k('Home dry grass')],29);a.reload();
});

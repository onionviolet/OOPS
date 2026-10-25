import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,advanceSimulation,validateExpansionState} from '../src/expansion_engine.js';
import {createSimulationState} from '../src/simulation_contracts.js';
import {expeditionRegistry as registry,initializeExpedition} from '../src/expedition_content.js';
import {registerMistglassNative,mistglassContext,stageMistglassTravel,stageMistglassTeaching,stageMistglassAdvance,stageMistglassMethod,stageMistglassSluice,mistglassReserve,knownMistglassView,validateMistglassEnvelope} from '../src/absorb_p23/host_joins/world_adaptation.js';
import {mistglassProfile as P} from '../src/absorb_p23/world_adaptation/profile.js';
import {pressureTimingKnown,revelationView,PRESSURE_REVELATION} from '../src/mistglass_revelation.js';
registerMistglassNative(registry);
const body={id:'native.player.body',form:'human',hands:2,mobile:true,ownerId:'player',controllerId:'player'};
const ctx=p=>mistglassContext(p.state,{body,alive:true,location:p.state.actors.player.worldId===P.worldId?P.locationId:'Village'});
function enrolled(seed=72){const state=initializeExpedition(createExpansionState(seed));state.simulation={...createSimulationState(seed),enrolledAt:0};state.simulation.people.player={life:'alive',inventory:'native',location:'Village',body,bornAt:0};const p={state,external:{money:100},gameplay:{player:{inventory:{},skills:{Meditation:{xp:0,enabled:true}},reputation:{Village:0}}}};stageMistglassTravel(p,'enter');stageMistglassTeaching(p,ctx(p),registry);return p;}
const advance=(p,n)=>advanceSimulation(p.state,registry,n,p.external,p.gameplay);
function time(p,n){const c=ctx(p);Object.assign(p,advance(p,n));stageMistglassAdvance(p,c,registry);return p;}
function search(p){return stageMistglassMethod(p,ctx(p),registry,'revelation',{advance});}
const valid=p=>{validateExpansionState(p.state,registry);validateMistglassEnvelope({expansion:p.state,'current location':p.state.simulation.people.player.location});};
test('local visited time and actual unsuccessful searches converge to a learned applied result',()=>{
 let foundFailure=false,foundSuccess=false;
 for(let seed=1;seed<30;seed++){
  const p=enrolled(seed),before=structuredClone(p),q=revelationView(p.state);assert.equal(q.chance,.2);assert.deepEqual(revelationView(p.state),q);assert.deepEqual(p,before);search(p);valid(p);assert.equal(p.state.clock,5);const after=revelationView(p.state);assert.equal(after.attempts,1);assert.equal(after.elapsed,5);
  if(after.known)foundSuccess=true;else{foundFailure=true;assert.equal(after.failures,1);assert.ok(Math.abs(after.chance-.31)<1e-12);assert.equal(p.state.simulation.knowledge.player[PRESSURE_REVELATION].stage,'seen');}
  for(let n=1;!pressureTimingKnown(p.state)&&n<8;n++)search(p);assert.equal(pressureTimingKnown(p.state),true);valid(p);assert.ok(revelationView(p.state).attempts<=8);const saved=structuredClone(p);assert.throws(()=>search(p),/already understood/);assert.deepEqual(p,saved);
  if(foundFailure&&foundSuccess)break;
 }
 assert.ok(foundFailure&&foundSuccess,'real seeded shared-stream outcomes cover both branches');
});
test('time outside this retained region supplies no search evidence; known timing changes actual energy debit',()=>{
 const p=enrolled();time(p,400);assert.equal(revelationView(p.state).chance,1);const elapsed=revelationView(p.state).elapsed;p.state.sequence++;stageMistglassTravel(p,'exit');time(p,1000);assert.equal(revelationView(p.state).elapsed,elapsed);p.state.sequence++;stageMistglassTravel(p,'enter');stageMistglassAdvance(p,ctx(p),registry);const before=knownMistglassView(p.state,ctx(p)).sluice.cost;
 search(p);assert.equal(pressureTimingKnown(p.state),true);const after=knownMistglassView(p.state,ctx(p)).sluice;assert.equal(before-after.cost,100);const reserve=mistglassReserve(p.state),funds=p.external.money;stageMistglassSluice(p,ctx(p),registry);assert.equal(reserve-mistglassReserve(p.state),after.cost);assert.equal(p.state.worldAdaptation.sluice.lastCost,after.cost);assert.ok(p.external.money===funds+after.wageCoins||p.gameplay.player.reputation.Village===1,'actual local origin settlement remains its original wage or standing');valid(p);
});
test('pending work and important-choice boundaries do not draw or grant an observation',()=>{
 const p=enrolled(),before=structuredClone(p);assert.throws(()=>stageMistglassMethod(p,{...ctx(p),choiceWaiting:true},registry,'revelation',{advance}),/waiting choice/);assert.deepEqual(p,before);
 assert.throws(()=>stageMistglassMethod(p,ctx(p),registry,'revelation',{advance:(plan,n)=>({...structuredClone(plan),state:{...structuredClone(plan.state),clock:plan.state.clock+2},stoppedAtChoice:true})}),/full five-minute/);assert.deepEqual(p,before);
 p.state.worldAdaptation.pathWork={schema:1,prepared:{path:'breath',control:1,at:0,energySpent:1000,bodyId:body.id,instanceId:p.state.worldAdaptation.instanceId},completed:0,last:null};const held=structuredClone(p);assert.throws(()=>search(p),/committed path/);assert.deepEqual(p,held);
});

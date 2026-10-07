import test from 'node:test';
import assert from 'node:assert/strict';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {advanceSimulation,loadExpansionState} from '../src/expansion_engine.js';
import {commitSimulationCommand} from '../src/simulation.js';
import {beginExchange,commitExchangeCommand} from '../src/exchange.js';
import {beginObservation,commitObservationCommand,SUBJECT,LENS,GAZE,NOTICE,CUT} from '../src/observation_content.js';
import {joinField,fieldContext,kit} from '../scripts/field_fixtures.mjs';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
const ctx=(p,targetId=null)=>{const c=fieldContext(p);return {...c,targetId,facts:{...c.facts,strength:12,'observation.handsUsable':true}};};
const advance=(p,n)=>advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{facts:ctx(p).facts,vitals:ctx(p).vitals.player}});
const exchange=(p,id)=>commitExchangeCommand(p.state,registry,{id},ctx(p,registry.simulation.commands.get(id).targetId||null));
const ready=()=>{let p=joinField();p.gameplay.player.inventory[kit]=3;p=beginExchange(p.state,registry,ctx(p));p=exchange(p,'exchange.accept');p=exchange(p,'exchange.buy_sound');p=advance(exchange(p,'exchange.fit_kit'),5);p=exchange(p,'exchange.deliver');p=advance(p,3);return exchange(p,'exchange.return');};
const open=p=>beginObservation(p.state,registry,ctx(p));
const command=(p,id)=>commitObservationCommand(p.state,registry,{id},ctx(p,registry.simulation.commands.get(id).targetId||null));
test('atomic opening executes the subject’s owned zero-fuel mode, not a player label',()=>{
 const p=ready(),before=structuredClone(p),v=open(p);assert.deepEqual(p,before);assert.equal(v.state.simulation.situations[LENS].phase,'answered');
 assert.equal(v.state.simulation.powers[SUBJECT][NOTICE].executions,1);assert.equal(v.state.simulation.people[SUBJECT].vitals.stamina,10);assert.equal(v.state.actors[SUBJECT].resources.coins,0);assert.equal(v.external.money,p.external.money);
 assert.ok(v.state.simulation.knowledge.player['observation.return_line']);assert.equal(v.state.simulation.knowledge[SUBJECT]['observation.identity'],undefined);assert.equal(v.state.actors.player.sources[GAZE],undefined);
 assert.deepEqual(v.state.simulation.log.find(e=>e.text.includes('return notice')).audience,[SUBJECT]);assert.equal(v.state.simulation.checks[CUT].cause,v.state.simulation.situations[LENS].receipts[0].cause);
});
test('suppressed source, missing perceptual support or unowned mode cannot return-notice',()=>{
 for(const variant of ['suppressed','body','mode']){let p=ready();p=commitSimulationCommand(p.state,registry,{id:'observation.prepare'},ctx(p));
  if(variant==='suppressed')p.state.simulation.faculties[SUBJECT][GAZE].suppressed=true;if(variant==='body')p.state.simulation.people[SUBJECT].body.perceptualSupport=false;if(variant==='mode')p.state.simulation.powers[SUBJECT][NOTICE].owned=false;
  p=open(p);assert.equal(p.state.simulation.situations[LENS].phase,'open');assert.equal(p.state.simulation.knowledge.player['observation.return_line'],undefined);assert.equal(p.state.simulation.powers[SUBJECT][NOTICE].executions,0);
 }
});
test('ordinary physical closure spends real wood/stamina and retains anonymous evidence/person',()=>{
 const p=open(ready()),wood=JSON.stringify({id:'Rough wood log'}),before=p.gameplay.player.inventory[wood],other=structuredClone(p.state.simulation.checks['village.shower']);
 let closed=command(p,'observation.shutter');assert.equal(closed.gameplay.player.inventory[wood],before-1);assert.equal(closed.state.worlds['base.frontier'].facts['observation.lens_active'],false);assert.equal(closed.state.worlds['base.frontier'].facts['observation.shutter_installed'],true);
 assert.equal(closed.state.simulation.checks[CUT],undefined);assert.deepEqual(closed.state.simulation.checks['village.shower'],other);assert.equal(closed.state.simulation.owners[SUBJECT][kit],1);assert.equal(closed.state.simulation.people[SUBJECT].life,'alive');
 closed=command(closed,'observation.inspect_shuttered');const once=closed.state.simulation.powers[SUBJECT][NOTICE].executions;closed=command(command(closed,'observation.replay'),'observation.replay');assert.equal(closed.state.simulation.powers[SUBJECT][NOTICE].executions,once);assert.throws(()=>command(closed,'observation.shutter'));
});
test('disclosed cooperation conserves the actual kit/coin and teaches provenance, not the faculty',()=>{
 const p=open(ready()),count=p.gameplay.player.inventory[kit],money=p.external.money;let v=command(p,'observation.cooperate');
 assert.equal(v.gameplay.player.inventory[kit],count+1);assert.equal(v.state.simulation.owners[SUBJECT][kit],undefined);assert.equal(v.external.money,money-1);assert.equal(v.state.actors[SUBJECT].resources.coins,1);
 assert.equal(v.state.simulation.knowledge.player['observation.provenance'].stage,'understood');assert.equal(v.state.actors.player.sources[GAZE],undefined);assert.equal(v.state.simulation.checks[CUT],undefined);
 assert.throws(()=>command(v,'observation.cooperate'));v=command(v,'observation.inspect_cooperated');assert.deepEqual(loadExpansionState(JSON.parse(JSON.stringify(v.state)),registry),v.state);
});
test('preset cutoff is independent of detection support and reveals no remote aftermath',()=>{
 let p=open(ready());p.state.simulation.faculties[SUBJECT][GAZE].suppressed=true;p=advance(p,12);
 assert.equal(p.state.simulation.situations[LENS].phase,'unanswered');assert.equal(p.state.simulation.checks[CUT],undefined);assert.equal(p.state.simulation.owners[SUBJECT][kit],1);assert.equal(p.state.simulation.knowledge.player['observation.later'],undefined);
 p=command(p,'observation.inspect_unanswered');assert.ok(p.state.simulation.knowledge.player['observation.later']);assert.equal(p.state.simulation.powers[SUBJECT][NOTICE].executions,1);
});
test('stale opening, deadline equality and invalid actions settle no new costs or power uses',()=>{
 const p=open(ready()),before=structuredClone(p);assert.throws(()=>beginObservation(p.state,registry,ctx(p),p.state.sequence-1));assert.deepEqual(p,before);
 assert.throws(()=>commitObservationCommand(p.state,registry,{id:'observation.notice'},ctx(p)));const late=structuredClone(p);late.state.clock=late.state.simulation.situations[LENS].deadline;const copy=structuredClone(late);assert.throws(()=>command(late,'observation.cooperate'));assert.throws(()=>command(late,'observation.shutter'));assert.deepEqual(late,copy);
});
test('failed opening/closure persistence retains all NPC/source/channel/stock and old native owners',()=>{
 const p=ready(),v=open(p),before=structuredClone(p),env={character:{money:p.external.money},levels:{person:{main_character:{},oldCraftsman:{}}},inventories:{person:{main_character:{},oldCraftsman:{}}},expansion:p.state};
 const persist=plan=>persistExpansionPlan(plan,{createSave:()=>JSON.stringify(env),key:'fixture',storage:{setItem(){throw Error('quota');}},bindings:{player:{category:'person',id:'main_character'},oldCraftsman:{category:'person',id:'oldCraftsman'}}});
 assert.throws(()=>persist(v),/quota/);assert.deepEqual(p,before);const openBefore=structuredClone(v);assert.throws(()=>persist(command(v,'observation.cooperate')),/quota/);assert.deepEqual(v,openBefore);
});

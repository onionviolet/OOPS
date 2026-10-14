import test from 'node:test';
import assert from 'node:assert/strict';
import {HISTORY_LIMIT,appendStoryOutcome,queryStoryOutcomes,validateLoreHistory,recordStoryletOutcome} from '../src/lore_history_state.js';
const record=(operation)=>({operation,worldId:'base.frontier',actor:'player',issuer:'traveler_1',targetPerson:'traveler_1',targetObject:'Stale bread',targetPlace:'Village',action:'request.deliver',result:'delivered',at:0,producer:'P4.request',causeRefs:['need:1'],historyCauses:[],audience:['player'],known:{person:'Test Traveler',item:'Stale bread'},applied:[{kind:'coin',owner:'player',key:'wood',delta:3}]});
test('queryable outcomes deduplicate and restore; optional absence unchanged',()=>{
 const s={clock:0};validateLoreHistory(s);assert.equal(s.loreHistory,undefined);
 const a=appendStoryOutcome(s,record('one'));assert.equal(appendStoryOutcome(s,record('one')).id,a.id);assert.equal(s.loreHistory.receipts.length,1);
 assert.deepEqual(queryStoryOutcomes(JSON.parse(JSON.stringify(s)),{issuer:'traveler_1',result:'delivered'}),[a]);
 const bad=structuredClone(s);bad.loreHistory.receipts[0].historyCauses=['missing'];assert.throws(()=>validateLoreHistory(bad),/retained/);
});
test('retention protects cause chains and callbacks independently of the display feed',()=>{
 const s={clock:0,simulation:{events:{}}};const first=appendStoryOutcome(s,record('need'));
 for(let i=1;i<HISTORY_LIMIT+20;i++)appendStoryOutcome(s,{...record(`card${i}`),action:'storylet.response',historyCauses:i===1?[first.id]:[]});
 assert.equal(s.loreHistory.receipts.length,HISTORY_LIMIT);assert.ok(queryStoryOutcomes(s,{id:first.id}).length);assert.ok(s.loreHistory.evicted>0);
 const full={clock:0};for(let i=0;i<HISTORY_LIMIT;i++)appendStoryOutcome(full,record(`need${i}`));
 assert.throws(()=>appendStoryOutcome(full,record('overflow')),/referenced/);assert.equal(full.loreHistory.receipts.length,HISTORY_LIMIT);
});
test('P3 response writer records applied item/coin/skill deltas, preserves original and pins cause',()=>{
 const before={external:{money:10},gameplay:{player:{inventory:{bread:2},skills:{Perception:{xp:0}}}}};
 const out={state:{clock:2},external:{money:13},gameplay:{player:{inventory:{bread:1},skills:{Perception:{xp:8}}}}};
 const event={id:'occurrence:1',actorId:'player',targetId:'sela',definitionId:'village.demo',label:'Known request',storylet:{},discoveredBy:['player']};
 recordStoryletOutcome(out,event,{result:'deliver',action:'storylet.response',cause:'settle:2',before});
 assert.deepEqual(out.state.loreHistory.receipts[0].applied.map(d=>d.delta),[3,-1,8]);assert.equal(before.external.money,10);
 const hidden=structuredClone(out);delete hidden.state.loreHistory;recordStoryletOutcome(hidden,{...event,storylet:null},{result:'x',action:'storylet.response',cause:'x',before});assert.equal(hidden.state.loreHistory,undefined);
});
test('real P3 card settlement writes history in the detached response plan',async()=>{
 const {createExpansionState,advanceSimulation}=await import('../src/expansion_engine.js');
 const {expeditionRegistry:registry,initializeExpedition}=await import('../src/expedition_content.js');
 const {enrollSimulation,commitSimulationCommand,respondSimulationEvent}=await import('../src/simulation.js');
 const context={actorId:'player',facts:{location:'Village','village.elderMet':true},external:{money:102},gameplay:{player:{inventory:{},skills:{Perception:{xp:0,enabled:true},'Pest killing':{xp:0,enabled:true}},reputation:{}},oldCraftsman:{inventory:{},skills:{},reputation:{}}}};
 let state=enrollSimulation(initializeExpedition(createExpansionState(73)),registry,context).state;
 state=commitSimulationCommand(state,registry,{id:'village.storylets.begin'},context).state;
 const out=advanceSimulation(state,registry,36,context.external,context.gameplay,{player:context});
 const e=Object.values(out.state.simulation.events).find(e=>e.storylet&&e.status==='open');
 const response=e.responses.find(r=>!r.costs.length&&!r.requires);
 const settled=respondSimulationEvent(out.state,registry,e.id,response.id,{...context,external:out.external,gameplay:out.gameplay});
 assert.equal(out.state.loreHistory,undefined);assert.equal(settled.state.loreHistory.receipts[0].result,response.id);
 assert.deepEqual(settled.state.loreHistory.receipts[0].causeRefs,[e.id,e.response?.cause||settled.state.simulation.events[e.id].response.cause]);
});

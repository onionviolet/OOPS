import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultCheatState,seedBeginningCheats,awakenCheats,validateCheatState,carryCheats} from '../src/cheat_cards.js';
import {CHEAT_MODULES} from '../src/cheat_definitions.js';
import {planCheatAction,cheatProjection} from '../src/cheat_mechanisms.js';
import {createHarvest,drawSpecimen,addCarcass,validateHarvest} from '../src/harvest.js';
import {calendarMinutes} from '../src/world_rhythm.js';
import {createStreams,keyedUnit,drawUnit,peekStreamDecision,armStreamCall,scopedStream,validateStreams} from '../src/seeded_streams.js';
import {readCheatSave} from '../src/cheat_save.js';
const time={year:999,month:4,day:3,hour:8,minute:0,day_count:3},clock=calendarMinutes(time);
function fixture(){
 const cheats=awakenCheats(seedBeginningCheats(defaultCheatState(),{at:time}),{dayCount:3,at:time}).state;
 const harvest=createHarvest();harvest.processed=1;
 addCarcass(harvest,drawSpecimen({species:'Wolf rat',key:'specimen-1',clock},()=>.4),{clock,skill:0,tool:0});
 let s={cheats,harvest,'current time':time,expansion:{rng:7,actors:{player:{worldId:'base.frontier'}},streams:createStreams(7)},locations:{Cave:{enemy_groups_killed:1}},levels:{person:{main_character:{skill_xp:{Crafting:1,Perception:1}}}}};
 for(const id of ['recognition','first-victory','first-processing','practised-craft']){s=planCheatAction(s,{type:'claim',id});s=planCheatAction(s,{type:'develop'});}
 return s;
}
test('lived insights claim exactly once and develop real cards without revealing future cards',()=>{
 const s=fixture();assert.equal(cheatProjection(s).cards.length,4);assert.equal(s.cheats.held['quiet-faculty'].card.stages.length,4);
 assert.throws(()=>planCheatAction(s,{type:'claim',id:'recognition'}),/already/);
 const dormant={...s,cheats:seedBeginningCheats(defaultCheatState(),{at:time})};assert.deepEqual(cheatProjection(dormant).cards,[]);
 const poor=structuredClone(s);poor.cheats.held['quiet-faculty'].card.state.points=0;assert.throws(()=>planCheatAction(poor,{type:'develop'}),/Reflect/);
});
test('True Appraisal keeps a timed narrower native observation, even after time changes',()=>{
 const s=fixture(),next=planCheatAction(s,{type:'appraise',species:'Wolf rat',key:'specimen-1'}),card=next.cheats.held['true-appraisal'].card;
 assert.equal(card.state.charges,2);assert.equal(card.state.readings[0].ageEstimate.max,30);assert.equal(card.state.readings[0].at,clock);
 assert.equal(next.harvest.lots['Wolf rat'][0].observations[0].skill,25);validateHarvest(next.harvest,clock);
 next['current time']={...time,hour:9};assert.equal(cheatProjection(next).cards[0].state.readings[0].at,clock);
 assert.equal(s.cheats.held['true-appraisal'].card.state.used,0);
 assert.throws(()=>planCheatAction(s,{type:'appraise',species:'Wolf rat',key:'gone'}),/no longer/);
});
test('Loaded Dice spends one reserve, changes a real native stream decision and survives keyed replay',()=>{
 const s=fixture(),next=planCheatAction(s,{type:'call'}),stream=scopedStream('loot');
 assert.equal(next.cheats.held['loaded-dice'].card.state.charges,1);
 const original=peekStreamDecision(s.expansion.streams,stream,'enemy:drop:0');
 assert.equal(keyedUnit(next.expansion,stream,'enemy:drop:0'),0);
 const receipt=next.expansion.streams.log.at(-1);assert.equal(receipt.orig,original.value);assert.equal(receipt.via,'loaded-dice');
 const restored=JSON.parse(JSON.stringify(next));assert.equal(keyedUnit(restored.expansion,stream,'enemy:drop:0'),0);
 armStreamCall(restored.expansion,stream,{value:0,via:'loaded-dice'});keyedUnit(restored.expansion,stream,'enemy:drop:0');
 assert.ok(restored.expansion.streams.cells[stream].call,'replay cannot spend a newly armed call');
 keyedUnit(restored.expansion,stream,'enemy:drop:1');assert.equal(restored.expansion.streams.cells[stream].call,undefined);
 validateStreams(restored.expansion.streams);
});
test('Fate Ledger is a pure stream peek including a paid call; cursor and receipts do not move',()=>{
 const s=fixture(),stream=scopedStream('loot'),before=structuredClone(s.expansion.streams);
 const next=planCheatAction(s,{type:'peek',key:'native',keyed:false});assert.deepEqual(next.expansion.streams,before);
 const r=next.cheats.held['fate-ledger'].card.state.readings[0];assert.equal(drawUnit(next.expansion,stream,'native'),r.value);
 const armed=planCheatAction(s,{type:'call'}),seen=planCheatAction(armed,{type:'peek',key:'native',keyed:false});
 assert.equal(seen.cheats.held['fate-ledger'].card.state.readings[0].value,0);assert.ok(seen.expansion.streams.cells[stream].call);
});
test('Earned Habit runs the existing finite routine and refuses missing practice without spending',()=>{
 const s=fixture(),next=planCheatAction(s,{type:'routine',target:3});
 assert.deepEqual([next.harvest.routine.target,next.harvest.routine.completed,next.harvest.routine.status],[3,0,'active']);
 assert.equal(next.harvest.auto,true);validateHarvest(next.harvest,clock);
 const unpractised=structuredClone(s);unpractised.harvest.processed=0;
 assert.throws(()=>planCheatAction(unpractised,{type:'routine',target:3}),/by hand/);assert.equal(unpractised.cheats.held['earned-habit'].card.state.charges,3);
});
test('module costs and failures are atomic; repeated arms cannot double-spend; exhausted calls refuse',()=>{
 const s=fixture(),armed=planCheatAction(s,{type:'call'}),before=structuredClone(armed);
 assert.throws(()=>planCheatAction(armed,{type:'call'}),/already waiting/);assert.deepEqual(armed,before);
 const broken=structuredClone(s);broken.cheats.held['loaded-dice'].card.state.charges=-1;assert.throws(()=>validateCheatState(broken.cheats),/module/);
 for(const d of CHEAT_MODULES.filter(d=>s.cheats.held[d.id])){const copy=structuredClone(s);copy.cheats.held[d.id].card.state.extra=true;assert.throws(()=>validateCheatState(copy.cheats),/module/);}
});
test('local quarantine preserves failing entry JSON and retries after reader-compatible repair; import validation stays strict',()=>{
 const s=fixture(),raw=structuredClone(s.cheats.held['true-appraisal']);s.cheats.held['true-appraisal'].card.state.revision=2;
 const bytes=JSON.stringify(s.cheats.held['true-appraisal']);assert.throws(()=>validateCheatState(s.cheats),/module/);
 const read=readCheatSave(s);assert.equal(read.cheats.held['true-appraisal'],undefined);assert.equal(read.cheats_quarantine.entries[0].raw,bytes);
 const twice=readCheatSave(read);assert.deepEqual(twice.cheats_quarantine,read.cheats_quarantine);
 twice.cheats_quarantine.entries[0].raw=JSON.stringify(raw);
 const repaired=readCheatSave(twice);assert.deepEqual(repaired.cheats.held['true-appraisal'],raw);assert.equal(repaired.cheats_quarantine.entries.length,0);
});
test('heir retains learned modules with empty local reserves and the faculty stage record',()=>{
 const s=fixture(),next=carryCheats(s.cheats,defaultCheatState(),{heir:true});
 for(const d of CHEAT_MODULES.filter(d=>s.cheats.held[d.id])){assert.equal(next.held[d.id].card.state.charges,0);assert.equal(next.held[d.id].card.state.used,d.state.charges);}
 assert.deepEqual(next.held['quiet-faculty'].card.stages,s.cheats.held['quiet-faculty'].card.stages);validateCheatState(next);
});

test('committed keyed overrides survive receipt-log eviction and preserve later armed calls',()=>{
 const s=fixture(),stream=scopedStream('loot');const next=planCheatAction(s,{type:'call'});
 assert.equal(keyedUnit(next.expansion,stream,'first'),0);
 for(let i=0;i<40;i++)keyedUnit(next.expansion,stream,`later-${i}`);
 assert.ok(!next.expansion.streams.log.some(r=>r.k==='first'));
 const restored=JSON.parse(JSON.stringify(next));assert.equal(keyedUnit(restored.expansion,stream,'first'),0);
 validateStreams(restored.expansion.streams);
});
test('malformed stages are quarantined before carry; opaque damaged quarantine stays recoverable',()=>{
 for(const stages of [[null],[{id:'unknown',at:1,via:'x',carried:true}],[{id:'true-appraisal',at:1,via:'x',carried:true},{id:'true-appraisal',at:2,via:'x',carried:true}]]){
  const s=fixture();s.cheats.held['quiet-faculty'].card.stages=stages;
  assert.throws(()=>validateCheatState(s.cheats),/stage/);
  const read=readCheatSave(s);assert.equal(read.cheats.held['quiet-faculty'],undefined);assert.ok(read.cheats_quarantine.entries.length);
 }
 const s=fixture();s.cheats_quarantine={schema:1,entries:[{id:'opaque',raw:'{damaged future bytes'}]};
 assert.equal(readCheatSave(s).cheats_quarantine.entries[0].raw,'{damaged future bytes');
});
test('reserves refill through earned insight without exceeding capacity or minting points',()=>{
 let s=fixture();s=planCheatAction(s,{type:'claim',id:'practised-perception'});s=planCheatAction(s,{type:'call'});
 const next=planCheatAction(s,{type:'recharge',id:'loaded-dice'});assert.equal(next.cheats.held['loaded-dice'].card.state.charges,2);
 assert.equal(next.cheats.held['quiet-faculty'].card.state.points,0);assert.equal(next.cheats.held['quiet-faculty'].card.state.spent,5);
 assert.throws(()=>planCheatAction(next,{type:'recharge',id:'loaded-dice'}),/full/);validateCheatState(next.cheats);
});
test('rejected native commit publishes no card cost or stream call',async()=>{
 const {executeCheatAction}=await import('../src/cheat_mechanisms.js');
 const s=fixture(),before=structuredClone(s);let published=false;
 assert.throws(()=>executeCheatAction({capture:()=>s,commit:()=>{throw Error('storage unavailable');},publish:()=>{published=true;}},{type:'call'}),/storage/);
 assert.equal(published,false);assert.deepEqual(s,before);
 const next=executeCheatAction({capture:()=>s,commit:(save,publish)=>{validateCheatState(save.cheats);publish();},publish:()=>{published=true;}},{type:'call'});
 assert.equal(published,true);assert.deepEqual(readCheatSave(JSON.parse(JSON.stringify(next))).cheats,next.cheats);
});

test('accompanying quest system claims a finite native victory once without a points shop',()=>{
 let s=fixture();s.cheats=seedBeginningCheats(s.cheats,{choice:'system-quests',at:time});s.cheats=awakenCheats(s.cheats,{wonFight:true,dayCount:3,at:time}).state;
 const next=planCheatAction(s,{type:'system-claim'});assert.equal(next.cheats.held['system-quests'].card.state.points,1);
 assert.throws(()=>planCheatAction(next,{type:'system-claim'}),/already claimed/);
 assert.equal(s.cheats.held['system-quests'].card.state.points,0);
});

test('incomplete retained readings are quarantined before their UI can dereference them',()=>{
 let s=fixture();s=planCheatAction(s,{type:'appraise',species:'Wolf rat',key:'specimen-1',skill:75});
 assert.equal(s.cheats.held['true-appraisal'].card.state.readings[0].ageEstimate.max,10,'a stronger native eye is not downgraded');
 delete s.cheats.held['true-appraisal'].card.state.readings[0].ageEstimate;
 assert.throws(()=>validateCheatState(s.cheats),/appraisal reading/);
 const read=readCheatSave(s);assert.equal(read.cheats.held['true-appraisal'],undefined);assert.ok(read.cheats_quarantine.entries.length);
});

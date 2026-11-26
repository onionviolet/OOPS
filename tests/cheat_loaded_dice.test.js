import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultCheatState,seedBeginningCheats,awakenCheats,grantCheat,validateCheatState} from '../src/cheat_cards.js';
import {moduleCard} from '../src/cheat_definitions.js';
import {planCheatAction,executeCheatAction,cheatProjection} from '../src/cheat_mechanisms.js';
import {loadedDiceValue,LOADED_DICE_VALUES} from '../src/cheat_loaded_dice.js';
import {createStreams,keyedUnit,scopedStream,validateStreams} from '../src/seeded_streams.js';
import {drawSpecimen,planHarvest} from '../src/harvest.js';
const time={year:999,month:4,day:1,hour:8,minute:0,day_count:1},stream=scopedStream('loot','base.frontier');
function fixture(){let cheats=awakenCheats(seedBeginningCheats(defaultCheatState(),{at:0}),{dayCount:3,at:0}).state;cheats=grantCheat(cheats,moduleCard('loaded-dice'),{route:'fixture',at:0});return{cheats,'current time':time,expansion:{rng:7,actors:{player:{worldId:'base.frontier'}},streams:createStreams(7)}};}
const reserve=s=>s.cheats.held['loaded-dice'].card.state;
test('legacy omitted direction is low; high uses a native endpoint and both retain the unchanged saved shape',()=>{
 const s=fixture(),before=JSON.stringify(s);assert.equal(loadedDiceValue(),0);assert.ok(LOADED_DICE_VALUES.high<1);
 for(const direction of [undefined,'low','high']){
  const next=planCheatAction(s,{type:'call',...(direction?{direction}:{})});assert.equal(reserve(next).charges,1);assert.equal(reserve(next).used,1);
  const cell=next.expansion.streams.cells[stream];assert.deepEqual(cell.call,{value:loadedDiceValue(direction),via:'loaded-dice'});
  const restored=JSON.parse(JSON.stringify(next));validateCheatState(restored.cheats);validateStreams(restored.expansion.streams);
  assert.equal(cheatProjection({...restored,levels:{}}).lootCall.direction,direction==='high'?'high':'low');
 }
 assert.equal(JSON.stringify(s),before);
 for(const direction of ['higher',1,[],['high'],{},null])assert.throws(()=>planCheatAction(s,{type:'call',direction}),/low or high/);
});
test('a real carcass consumer gives different processed quality from the same physical work, with no enemy or tool adjustment',()=>{
 const qualities={};
 for(const direction of ['ordinary','low','high']){
  const s=direction==='ordinary'?fixture():planCheatAction(fixture(),{type:'call',direction});
  const specimen=drawSpecimen({species:'Wolf rat',key:'same-native-decision',clock:100},key=>keyedUnit(s.expansion,stream,key));
  const work=planHarvest(specimen,'pelt',{clock:100,skill:0,tool:0});qualities[direction]=work.outputs[0].quality;
  assert.equal(work.minutes,4);assert.equal(work.outputs[0].count,1);
  if(direction!=='ordinary'){assert.equal(s.expansion.streams.log.at(-1).via,'loaded-dice');assert.equal(s.expansion.streams.cells[stream].call,undefined);}
 }
 assert.equal(qualities.high-qualities.low,10);assert.ok(qualities.ordinary>=qualities.low&&qualities.ordinary<=qualities.high);
});
test('pending, legacy values and keyed replay cannot double-spend; calls stay in their own world',()=>{
 const high=planCheatAction(fixture(),{type:'call',direction:'high'}),before=JSON.stringify(high);
 assert.throws(()=>planCheatAction(high,{type:'call'}),/already/);assert.equal(JSON.stringify(high),before);
 const foreign=scopedStream('loot','book.elsewhere');keyedUnit(high.expansion,foreign,'other-foe');assert.ok(high.expansion.streams.cells[stream].call);
 assert.equal(keyedUnit(high.expansion,stream,'first-foe'),LOADED_DICE_VALUES.high);
 const low=planCheatAction(JSON.parse(JSON.stringify(high)),{type:'call'});assert.equal(reserve(low).charges,0);
 assert.equal(keyedUnit(low.expansion,stream,'first-foe'),LOADED_DICE_VALUES.high);assert.ok(low.expansion.streams.cells[stream].call);
 assert.equal(keyedUnit(low.expansion,stream,'second-foe'),0);assert.equal(low.expansion.streams.cells[stream].call,undefined);
 assert.throws(()=>planCheatAction(low,{type:'call',direction:'high'}),/No charges/);
 const legacy=planCheatAction(fixture(),{type:'call'});legacy.expansion.streams.cells[stream].call.value=.375;validateStreams(legacy.expansion.streams);
 assert.equal(cheatProjection({...legacy,levels:{}}).lootCall.direction,'chosen');assert.equal(keyedUnit(legacy.expansion,stream,'legacy-foe'),.375);
});
test('failed writer publishes no reserve or pending value; retry commits exactly one high call',()=>{
 let s=fixture(),writes=0,published=0;const before=JSON.stringify(s),ports={capture:()=>s,commit:()=>{throw Error('unavailable');},publish:()=>published++};
 assert.throws(()=>executeCheatAction(ports,{type:'call',direction:'high'}),/unavailable/);assert.equal(JSON.stringify(s),before);assert.equal(published,0);
 ports.commit=(next,publish)=>{s=next;writes++;publish();};executeCheatAction(ports,{type:'call',direction:'high'});assert.equal(writes,1);assert.equal(published,1);assert.equal(reserve(s).charges,1);
 assert.throws(()=>executeCheatAction(ports,{type:'call',direction:'low'}),/already/);assert.equal(writes,1);
});
test('existing Fate Ledger can read a committed high value without using or advancing the call',()=>{
 let s=fixture();s.cheats=grantCheat(s.cheats,moduleCard('fate-ledger'),{route:'fixture',at:0});
 s=planCheatAction(s,{type:'call',direction:'high'});const before=structuredClone(s.expansion.streams);
 const seen=planCheatAction(s,{type:'peek',key:'visible-native-decision',keyed:true});
 assert.deepEqual(seen.expansion.streams,before);assert.equal(seen.cheats.held['fate-ledger'].card.state.readings[0].value,LOADED_DICE_VALUES.high);
 assert.equal(seen.cheats.held['fate-ledger'].card.state.readings[0].via,'loaded-dice');assert.equal(reserve(seen).charges,1);
});

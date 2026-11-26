import test from 'node:test';
import assert from 'node:assert/strict';
import {createStreams,armStreamCall,keyedUnit,scopedStream} from '../src/seeded_streams.js';
import {loadedDiceCall,loadedDiceCompletedCall,LOADED_DICE_VALUES} from '../src/cheat_loaded_dice.js';
const stream=scopedStream('loot','base.frontier'),key='observed-carcass',drawKey=`harvest:${key}:specimen`;
const fresh=()=>({cheats:{held:{'loaded-dice':{}}},expansion:{actors:{player:{worldId:'base.frontier'}},streams:createStreams(91)},harvest:{lots:{'Wolf rat':[{key,species:'Wolf rat',condition:'hidden-condition',variant:'hidden-variant'}]}}});
function consume(s,value=LOADED_DICE_VALUES.high,k=drawKey){armStreamCall(s.expansion,stream,{value,via:'loaded-dice'});keyedUnit(s.expansion,stream,k);return s;}

test('only completed consumption is attributed, naming the exact owned specimen without hidden traits',()=>{
 const s=fresh();armStreamCall(s.expansion,stream,{value:LOADED_DICE_VALUES.high,via:'loaded-dice'});
 assert.equal(loadedDiceCompletedCall(s),null);assert.deepEqual(loadedDiceCall(s),{direction:'high'});
 keyedUnit(s.expansion,stream,drawKey);const before=JSON.stringify(s),view=loadedDiceCompletedCall(s);
 assert.deepEqual(view,{direction:'High',subject:'Wolf rat carcass',outputs:[]});assert.equal(loadedDiceCall(s),null);
 assert.equal(JSON.stringify(s),before);assert.doesNotMatch(JSON.stringify(view),/hidden-|specimen|orig|0\.999|observed-carcass/);
});
test('durable override survives log rollover, JSON reload and keyed replay; a new queued call coexists',()=>{
 let s=consume(fresh());for(let i=0;i<40;i++)keyedUnit(s.expansion,stream,'later-observed-'+i);
 assert.equal(s.expansion.streams.log.some(r=>r.k===drawKey),false);
 const view=loadedDiceCompletedCall(s);assert.equal(view.subject,'Wolf rat carcass');
 s=JSON.parse(JSON.stringify(s));armStreamCall(s.expansion,stream,{value:0,via:'loaded-dice'});
 assert.deepEqual(loadedDiceCompletedCall(s),view);assert.deepEqual(loadedDiceCall(s),{direction:'low'});
 keyedUnit(s.expansion,stream,drawKey);assert.deepEqual(loadedDiceCompletedCall(s),view);assert.deepEqual(loadedDiceCall(s),{direction:'low'},'replay does not consume the next call');
});
test('processed feedback requires the same settled specimen and quotes only already visible outputs',()=>{
 const s=consume(fresh());s.harvest.lots={};s.harvest.last={key,specimen:{key,species:'Wolf rat',condition:'hidden-condition'},outputs:[{part:'pelt',count:1,quality:80,completeness:'scraps',draw:.9,integrity:35}]};
 assert.deepEqual(loadedDiceCompletedCall(s),{direction:'High',subject:'Wolf rat carcass',outputs:[{name:'Rat pelt',count:1,quality:80,completeness:'scraps'}]});
 s.harvest.last.specimen.key='different-carcass';assert.deepEqual(loadedDiceCompletedCall(s),{direction:'High',subject:'a loot decision here',outputs:[]});
 s.harvest.job={specimen:{key,species:'Wolf rat'}};assert.equal(loadedDiceCompletedCall(s).subject,'Wolf rat carcass');assert.deepEqual(loadedDiceCompletedCall(s).outputs,[]);
});
test('unmatched and legacy decisions stay generic; foreign worlds and unheld cards reveal nothing',()=>{
 const s=consume(fresh(),.375,'opaque-private-subject:drop:0');
 assert.deepEqual(loadedDiceCompletedCall(s),{direction:'Chosen',subject:'a loot decision here',outputs:[]});
 delete s.expansion.streams.cells[stream].overrides;assert.equal(loadedDiceCompletedCall(s).direction,'Chosen','old bounded-log receipt remains readable');
 s.expansion.actors.player.worldId='book.lotm.tingen';assert.equal(loadedDiceCompletedCall(s),null);
 const foreign=scopedStream('loot','book.lotm.tingen');armStreamCall(s.expansion,foreign,{value:0,via:'loaded-dice'});keyedUnit(s.expansion,foreign,drawKey);
 assert.deepEqual(loadedDiceCompletedCall(s),{direction:'Low',subject:'a loot decision here',outputs:[]},'Frontier carcass names do not attach to another world');
 delete s.cheats.held['loaded-dice'];assert.equal(loadedDiceCompletedCall(s),null);
});

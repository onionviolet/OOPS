import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultCheatState,seedBeginningCheats,awakenCheats,validateCheatState,carryCheats} from '../src/cheat_cards.js';
import {planCheatAction,executeCheatAction,cheatProjection} from '../src/cheat_mechanisms.js';
import {createStreams,keyedUnit,scopedStream} from '../src/seeded_streams.js';
import {readCheatSave} from '../src/cheat_save.js';
const time={year:999,month:4,day:1,hour:8,minute:0,day_count:1};
const setup=()=>({cheats:seedBeginningCheats(defaultCheatState(),{at:time,startingOffer:true}),'current time':time,
 expansion:{rng:7,actors:{player:{worldId:'base.frontier'}},streams:createStreams(7)},locations:{},levels:{person:{main_character:{skill_xp:{}}}}});
const choose=(s,choice)=>planCheatAction(s,{type:'starting-choice',choice});

test('only a newly seeded first-game offer appears; existing cards and older saves receive no offer or credit',()=>{
 const fresh=setup(),view=cheatProjection(fresh);assert.equal(view.visible,true);assert.equal(view.awakened,false);assert.deepEqual(view.cards,[]);assert.equal(view.points,0);
 const older=seedBeginningCheats(defaultCheatState(),{at:time});
 assert.equal(cheatProjection({...fresh,cheats:older}).visible,false);
 assert.deepEqual(seedBeginningCheats(older,{at:time,startingOffer:true}),older);
 assert.equal(older.held['quiet-faculty'].card.state.startingOffer,undefined);
 assert.throws(()=>choose({...fresh,cheats:older},'extra-insight'),/before spending/);
 assert.deepEqual(validateCheatState(JSON.parse(JSON.stringify(older))),older);
 let advanced={...fresh,cheats:awakenCheats(older,{dayCount:3,at:time}).state};advanced=planCheatAction(advanced,{type:'claim',id:'recognition'});advanced=planCheatAction(advanced,{type:'develop'});
 const loaded=readCheatSave(advanced);assert.deepEqual(loaded.cheats,advanced.cheats);assert.deepEqual(seedBeginningCheats(loaded.cheats,{at:time,startingOffer:true}),loaded.cheats);
 assert.equal(cheatProjection(loaded).startingOffer,null);assert.throws(()=>choose(loaded,'extra-insight'),/before spending/);
 assert.deepEqual(readCheatSave({}).cheats,defaultCheatState());
});
test('take, undo and retake preserve ordinary milestones and credit exactly one reversible point',()=>{
 const fresh=setup(),extra=choose(fresh,'extra-insight');assert.equal(extra.cheats.held['quiet-faculty'].card.state.points,1);assert.equal(fresh.cheats.held['quiet-faculty'].card.state.points,0);
 assert.throws(()=>choose(extra,'extra-insight'),/already recorded/);
 const ordinary=choose(extra,'ordinary');assert.equal(ordinary.cheats.held['quiet-faculty'].card.state.points,0);
 const retaken=choose(ordinary,'extra-insight');assert.equal(retaken.cheats.held['quiet-faculty'].card.state.earned,1);
 const awake={...retaken,cheats:awakenCheats(retaken.cheats,{dayCount:3,at:time}).state};
 const lived=planCheatAction(awake,{type:'claim',id:'recognition'}),undone=choose(lived,'ordinary');
 assert.equal(undone.cheats.held['quiet-faculty'].card.state.points,1);assert.deepEqual(undone.cheats.held['quiet-faculty'].card.state.claimed,['recognition']);
 assert.deepEqual(validateCheatState(JSON.parse(JSON.stringify(retaken.cheats))),retaken.cheats);
 assert.deepEqual(carryCheats(retaken.cheats).held['quiet-faculty'],retaken.cheats.held['quiet-faculty']);
});
test('one extra point reaches the real Loaded Dice consumer earlier, while baseline must earn another insight',()=>{
 const paths={};
 for(const choice of ['ordinary','extra-insight']){
  let s=choose(setup(),choice);s.cheats=awakenCheats(s.cheats,{dayCount:3,at:time}).state;
  s=planCheatAction(s,{type:'claim',id:'recognition'});s=planCheatAction(s,{type:'develop'});paths[choice]=s;
 }
 assert.throws(()=>planCheatAction(paths.ordinary,{type:'develop'}),/Reflect/);assert.throws(()=>planCheatAction(paths.ordinary,{type:'call'}),/not been discovered/);
 const developed=planCheatAction(paths['extra-insight'],{type:'develop'}),called=planCheatAction(developed,{type:'call'});
 assert.equal(called.cheats.held['loaded-dice'].card.state.charges,1);
 assert.equal(keyedUnit(called.expansion,scopedStream('loot','base.frontier'),'visible-foe:drop:0'),0);
 assert.equal(called.expansion.streams.log.at(-1).via,'loaded-dice');
 assert.throws(()=>choose(developed,'ordinary'),/before spending/);
 assert.equal(cheatProjection(developed).startingOffer.canChoose,false);
 let pending=setup();pending.cheats=awakenCheats(pending.cheats,{dayCount:3,at:time}).state;
 pending=planCheatAction(pending,{type:'claim',id:'recognition'});pending=planCheatAction(pending,{type:'develop'});
 assert.equal(pending.cheats.held['quiet-faculty'].card.state.startingOffer.choice,'ordinary');
});
test('failed native commitment publishes no credit; retry and reload retain one chosen advantage',()=>{
 let durable=setup(),published=0,writes=0;
 const operations={capture:()=>structuredClone(durable),commit:()=>{throw Error('storage unavailable');},publish:()=>published++};
 assert.throws(()=>executeCheatAction(operations,{type:'starting-choice',choice:'extra-insight'}),/storage/);assert.equal(published,0);assert.equal(durable.cheats.held['quiet-faculty'].card.state.points,0);
 operations.commit=(next,publish)=>{writes++;durable=JSON.parse(JSON.stringify(next));publish();};
 executeCheatAction(operations,{type:'starting-choice',choice:'extra-insight'});assert.equal(published,1);assert.equal(writes,1);
 assert.throws(()=>executeCheatAction(operations,{type:'starting-choice',choice:'extra-insight'}),/already recorded/);assert.equal(writes,1);
 assert.deepEqual(seedBeginningCheats(durable.cheats,{at:time,startingOffer:true}),durable.cheats);
 for(const bad of [{choice:'pending',at:2},{choice:'extra-insight',at:null},{choice:'unknown',at:0}]){const copy=structuredClone(durable.cheats);copy.held['quiet-faculty'].card.state.startingOffer=bad;assert.throws(()=>validateCheatState(copy),/starting insight/);}
});

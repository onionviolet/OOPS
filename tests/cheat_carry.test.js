import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultCheatState,seedBeginningCheats,awakenCheats,carryCheats,validateCheatState} from '../src/cheat_cards.js';
import {buildLifeHeirSave} from '../src/life_experience_host.js';
import {createChronicle,advanceChronicle,GAME_YEAR} from '../src/chronicle.js';
const at={year:999,month:4,day:1,hour:8,minute:0,day_count:1};
const seed=()=>seedBeginningCheats(defaultCheatState(),{at});
test('ordinary beginning has a quiet dormant faculty without a talking system; duplicate seed is inert',()=>{
 const s=seed();assert.deepEqual(Object.keys(s.held),['quiet-faculty']);assert.equal(s.held['quiet-faculty'].card.state.awakened,false);
 assert.deepEqual(seedBeginningCheats(s,{at}),s);assert.equal(awakenCheats(s,{dayCount:2,at}).messages.length,0);
 const awake=awakenCheats(s,{dayCount:3,at});assert.equal(awake.messages.length,1);
 assert.equal(awakenCheats(awake.state,{dayCount:4,at}).messages.length,0);
 assert.equal(awake.state.held['quiet-faculty'].card.ui,'quiet');
});
test('optional talking system is distinct and awakening uses each card message',()=>{
 const s=seedBeginningCheats(defaultCheatState(),{choice:'system-quests',at});
 const result=awakenCheats(s,{wonFight:true,dayCount:1,at});assert.equal(result.messages.length,2);
 assert.notEqual(...result.messages);validateCheatState(result.state);
});
test('heir receives enduring faculty stages without copying points, claim rows or the accompanying system',()=>{
 const s=awakenCheats(seedBeginningCheats(defaultCheatState(),{choice:'system-quests',at}),{wonFight:true,dayCount:1,at}).state;
 s.held['quiet-faculty'].card.stages.push({id:'learned',at,via:'practice',carried:true});s.held['quiet-faculty'].card.state.points=5;
 const fresh={character:{name:'You',money:0,reputation:{}},levels:{},'current time':at,
 inventories:{person:{main_character:{}},storage:{player:{}}},availabilities:{location:{Shack:0}},expansion:{}};
 const end=62*GAME_YEAR,previous={...structuredClone(fresh),cheats:s,expansion:{rng:7,clock:end,chronicle:advanceChronicle(createChronicle(0,at,true),end)}};
 const next=buildLifeHeirSave(previous,fresh);assert.equal(next.cheats.held['quiet-faculty'].card.state.points,0);
 assert.deepEqual(next.cheats.held['quiet-faculty'].card.stages,s.held['quiet-faculty'].card.stages);
 assert.equal(next.cheats.held['quiet-faculty'].messages.length,1);assert.equal(next.cheats.held['system-quests'],undefined);
 assert.equal(s.held['quiet-faculty'].card.state.points,5);validateCheatState(next.cheats);
});
test('temporal carrier keeps faculty acquired after a checkpoint without copying other cards',()=>{
 const s=seedBeginningCheats(seed(),{choice:'system-quests',at});const next=carryCheats(s);
 assert.ok(next.held['quiet-faculty']);assert.equal(next.held['system-quests'],undefined);
 assert.deepEqual(carryCheats(undefined),defaultCheatState());
});

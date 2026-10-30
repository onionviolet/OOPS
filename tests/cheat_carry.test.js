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
test('heir receives enduring faculty stages without copying points or claim rows, and the accompanying system returns dormant',()=>{
 const s=awakenCheats(seedBeginningCheats(defaultCheatState(),{choice:'system-quests',at}),{wonFight:true,dayCount:1,at}).state;
 s.held['quiet-faculty'].card.stages.push({id:'true-appraisal',at,via:'practice',carried:true});s.held['quiet-faculty'].card.state.points=5;s.held['quiet-faculty'].card.state.earned=5;
 const fresh={character:{name:'You',money:0,reputation:{}},levels:{},'current time':at,
 inventories:{person:{main_character:{}},storage:{player:{}}},availabilities:{location:{Shack:0}},expansion:{}};
 const end=62*GAME_YEAR,previous={...structuredClone(fresh),cheats:s,expansion:{rng:7,clock:end,chronicle:advanceChronicle(createChronicle(0,at,true),end)}};
 const next=buildLifeHeirSave(previous,fresh);assert.equal(next.cheats.held['quiet-faculty'].card.state.points,0);
 assert.deepEqual(next.cheats.held['quiet-faculty'].card.stages,s.held['quiet-faculty'].card.stages);
 assert.equal(next.cheats.held['quiet-faculty'].messages.length,1);const line=next.cheats.held['system-quests'];assert.equal(line.card.state.awakened,false);assert.equal(line.card.state.points,0);assert.equal(line.messages.length,0);assert.equal(line.acquired.route,'heir-line');
 assert.equal(s.held['quiet-faculty'].card.state.points,5);validateCheatState(next.cheats);
});
test('temporal carrier keeps faculty acquired after a checkpoint without copying other cards',()=>{
 const s=seedBeginningCheats(seed(),{choice:'system-quests',at});const next=carryCheats(s);
 assert.ok(next.held['quiet-faculty']);assert.equal(next.held['system-quests'],undefined);
 assert.deepEqual(carryCheats(undefined),defaultCheatState());
});

test('native temporal return retains later designs and spent journey bank while restoring local reserves',async()=>{
 const {grantCheat}=await import('../src/cheat_cards.js'),{moduleCard}=await import('../src/cheat_definitions.js'),{SALT_STEEP}=await import('../src/craft_reference_content.js');
 const {beginContinuation,planContinuation}=await import('../src/continuation_state.js');
 let cheats=awakenCheats(seed(),{dayCount:3,at}).state;
 for(const id of ['pattern-book','patient-furnace']){cheats=grantCheat(cheats,moduleCard(id),{route:'test',at});cheats.held['quiet-faculty'].card.stages.push({id,at,via:'test',carried:true});}
 Object.assign(cheats.held['patient-furnace'].card.state.away,{assigned:true,world:'base.frontier',anchor:1000,bank:20});
 const initial=beginContinuation({character:{name:'Ada'},levels:{person:{main_character:{skill_xp:{}}}},'current time':at,cheats,expansion:{actors:{player:{worldId:'base.frontier'}},worlds:{'base.frontier':{}}}},'carry-test');
 const source=structuredClone(initial);source.cheats.held['pattern-book'].card.state.patterns.push({world:'base.frontier',at:1,recipe:structuredClone(SALT_STEEP)});source.cheats.held['pattern-book'].card.state.used=1;source.cheats.held['pattern-book'].card.state.charges=2;
 Object.assign(source.cheats.held['patient-furnace'].card.state.away,{bank:12,spent:8,anchor:5000});
 const restored=planContinuation(source,'initial',{expectedSequence:0,token:'return-1'});
 assert.deepEqual(restored.cheats.held['pattern-book'].card.state.patterns,source.cheats.held['pattern-book'].card.state.patterns);
 assert.equal(restored.cheats.held['pattern-book'].card.state.charges,3,'local reserves use native snapshot policy');
 assert.equal(restored.cheats.held['patient-furnace'].card.state.away.bank,12);assert.equal(restored.cheats.held['patient-furnace'].card.state.away.spent,8);validateCheatState(restored.cheats);
 const again=planContinuation(restored,'initial',{expectedSequence:1,token:'return-2'});assert.equal(again.cheats.held['patient-furnace'].card.state.away.bank,12);validateCheatState(again.cheats);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveHeirLeftovers,applyHeirLeftovers} from '../src/heir_inheritance.js';
import {buildLifeHeirSave} from '../src/life_experience_host.js';
import {createChronicle,advanceChronicle,GAME_YEAR} from '../src/chronicle.js';
import {defaultCheatState,grantCheat,seedBeginningCheats,awakenCheats,validateCheatState} from '../src/cheat_cards.js';
import {moduleCard} from '../src/cheat_definitions.js';
import {planCheatAction} from '../src/cheat_mechanisms.js';
const calendar={year:999,month:4,day:1,hour:8,minute:0,day_count:1},key=JSON.stringify({id:'Iron ore'});
function fixture(){let cheats=awakenCheats(seedBeginningCheats(defaultCheatState(),{at:0}),{dayCount:3,at:0}).state;cheats=grantCheat(cheats,moduleCard('heirloom-compact'),{at:0,route:'test'});cheats.held['quiet-faculty'].card.stages.push({id:'heirloom-compact',at:0,via:'test',carried:true});return {character:{name:'Ada',money:3,reputation:{}},cheats,'current time':calendar,expansion:{rng:7,clock:0,actors:{player:{worldId:'base.frontier'}},chronicle:createChronicle(0,calendar,true)},inventories:{person:{main_character:{}},storage:{player:{[key]:{count:4}}}},village_career:{debt:8}};}
const fresh=()=>({character:{name:'New',money:0,reputation:{}},levels:{person:{main_character:{}}},expansion:{},inventories:{person:{main_character:{}},storage:{player:{}}}});
function end(s){s.expansion.clock=62*GAME_YEAR;s.expansion.chronicle=advanceChronicle(s.expansion.chronicle,s.expansion.clock);return s;}
test('Compact claims exact counted chest goods once through actual heir boot without duplicating generic estate',()=>{
 const s=planCheatAction(fixture(),{type:'bequeath',source:'chest',key,count:2}),l=deriveHeirLeftovers(end(s));assert.equal(l.compact.status,'claimed');assert.deepEqual(l.chest,[[key,2]]);
 const next=buildLifeHeirSave(s,fresh(),JSON.parse(JSON.stringify(l)));assert.equal(next.inventories.person.main_character[key].count,2);assert.equal(next.inventories.storage.player[key].count,2);assert.equal(next.cheats.held['heirloom-compact'].card.state.nomination,null);assert.equal(next.cheats.held['heirloom-compact'].card.state.receipt.status,'claimed');validateCheatState(next.cheats);
 assert.deepEqual(l.debts,[{id:'kitDebt',owed:8,paid:3,shortfall:5}]);assert.equal(next.character.money,0);assert.equal(next.cheats.held['heirloom-compact'].card.state.charges,0);
 next.expansion.clock=62*GAME_YEAR;next.expansion.chronicle=advanceChronicle(next.expansion.chronicle,next.expansion.clock);assert.equal(deriveHeirLeftovers(next).compact,undefined,'consumed nomination is not executed again');
});
test('spent stock lapses rather than minting, forged counts and unknown carrier refuse before costs',()=>{
 const s=planCheatAction(fixture(),{type:'bequeath',source:'chest',key,count:3});s.inventories.storage.player[key].count=1;const l=deriveHeirLeftovers(end(s));assert.equal(l.compact.status,'lapsed');const next=fresh();applyHeirLeftovers(next,l);assert.equal(next.inventories.storage.player[key].count,1);assert.equal(next.inventories.person.main_character[key],undefined);
 const before=fixture();assert.throws(()=>planCheatAction(before,{type:'bequeath',source:'chest',key,count:5}),/quantity/);assert.equal(before.cheats.held['heirloom-compact'].card.state.charges,2);before.expansion.actors.player.worldId='unknown';assert.throws(()=>planCheatAction(before,{type:'bequeath',source:'chest',key,count:1}),/carrier/);
});

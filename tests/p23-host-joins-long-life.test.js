import test from 'node:test';
import assert from 'node:assert/strict';
import {stageTitleRecognition,validateLongLifeEnvelope} from '../src/absorb_p23/host_joins/long_life.js';
const calendar={year:999,month:4,day:1,hour:1,minute:0};
test('recognition stages settled native home and purchase counters without publishing titles',()=>{
 const titles={},plan={external:{money:0},localLifeResult:{state:{homeMinutes:60,itemsBought:25}}};
 stageTitleRecognition(plan,{titles,counters:{books:0},calendar});
 assert.deepEqual(titles,{});assert.ok(plan.nativePatch['character/titles'].quiet_hour);assert.ok(plan.nativePatch['character/titles'].pantry_keeper);
 assert.equal(plan.nativePatch['character/titles'].small_surprise,undefined);
});
test('repeat finished anthology does not invent another completed book',()=>{
 const plan={external:{money:0},p00FinishedAnthology:true};stageTitleRecognition(plan,{titles:{},counters:{books:4},calendar,anthologyFinished:true});
 assert.equal(plan.nativePatch?.['character/titles']?.bookworm,undefined);
});
test('optional worn state stays absent and rejects invalid selections in envelope preflight',()=>{
 const old={character:{titles:{}}};validateLongLifeEnvelope(old);assert.equal(Object.hasOwn(old.character,'long_life_worn'),false);
 assert.throws(()=>validateLongLifeEnvelope({character:{titles:{},long_life_worn:{schema:2,enabled:false,worn:null}}}));
 assert.throws(()=>validateLongLifeEnvelope({character:{titles:{},long_life_worn:{schema:1,enabled:true,worn:'quiet_hour'}}}));
});

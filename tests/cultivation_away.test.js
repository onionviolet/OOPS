import test from 'node:test';
import assert from 'node:assert/strict';
import {armAway,bankAway,validateAway} from '../src/absorb_p23/world_adaptation/away.js';
test('absence credits subtract online play, conserve fractions, cap bank and consume timestamps once',()=>{
 const a=armAway(undefined,10,100000),b=bankAway(a,12,105500);assert.equal(b.bank,3);assert.equal(b.remainder,500);
 const again=bankAway(b,12,105500);assert.equal(again.bank,3);assert.equal(again.remainder,500);
 const next=bankAway(again,12,106000);assert.equal(next.bank,4);assert.equal(next.remainder,0);
 const capped=bankAway(next,12,1000000);assert.equal(capped.bank,120);assert.ok(capped.last.dropped>0);validateAway(JSON.parse(JSON.stringify(capped)));
 assert.throws(()=>bankAway(capped,12,900000),/backwards/);assert.throws(()=>validateAway({...capped,bank:121}));
});

test('absence practice draws from the native away bank at its efficiency, never past it (TMR6, RCL6)', () => {
 const a=armAway(undefined,10,100000);
 const none=bankAway(a,10,100000+60000,{available:0});assert.equal(none.bank,0,'an empty native bank credits nothing');
 const one=bankAway(a,10,100000+90000,{available:1});assert.equal(one.bank,60,'one banked minute buys 60 practice minutes');
 assert.equal(bankAway(a,10,100000+30000,{available:5}).bank,30,'still bounded by the absence itself');
});

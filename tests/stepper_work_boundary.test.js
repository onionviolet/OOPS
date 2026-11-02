import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const source=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8');const start=source.indexOf('function advanceTicks(n,'),end=source.indexOf('// RT8:',start);const owner=source.slice(start,end);
test('work stepping batches real tick calls, stops at job settlement and closes on failure without extra idle time',()=>{
 function host(left=3,fail=false){let ticks=0,closed=0,samples=0;const state={simulation:{jobs:left?[{actorId:'player'}]:[]}},ctx=vm.createContext({fastForwarding:null,expansionState:state,domainRegistry:{command:()=>()=>{samples++;}},checkTickCount:n=>assert(n>=0&&Number.isSafeInteger(n)),openStepperBatch:()=>()=>{closed++;return 1;},runEngineTicks:n=>{if(fail)throw Error('tick failed');ticks+=n;if(ticks>=left)state.simulation.jobs=[];return {ticks:n,callbacks:n*2};}});vm.runInContext(owner+'\nglobalThis.step=advanceTicks;',ctx);return {step:ctx.step,counts:()=>({ticks,closed,samples})};}
 const h=host();const r=h.step(10,{untilIdle:true});assert.equal(r.ticks,3);assert.equal(r.callbacks,6);assert.deepEqual(h.counts(),{ticks:3,closed:1,samples:3});h.step(10,{untilIdle:true});assert.equal(h.counts().ticks,3,'idle stepping cannot add time');
 const normal=host();assert.equal(normal.step(10).ticks,10,'ordinary raw stepping retains its existing tick count');
 const bad=host(3,true);assert.throws(()=>bad.step(10,{untilIdle:true}),/tick failed/);assert.equal(bad.counts().closed,1);
});

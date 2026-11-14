import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const source=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const start=source.indexOf('const checkTickCount'),end=source.indexOf('/** Lifetime counters',start);
const owner=source.slice(start,end);
// A host whose engine ticks, with switches for the ways a forward can end before or after its first yield.
function host({pauseFails=false,tickFails=false}={}){
  const state={clock:0};let ticks=0;
  const ctx=vm.createContext({fastForwarding:null,stepperSaves:null,expansionState:state,performance,setTimeout,MessageChannel,
    testHooksEnabled:true,stepping:()=>false,resumeEngine(){},pauseEngine(){if(pauseFails)throw new Error('pause failed');},
    openStepperBatch:()=>()=>0,domainRegistry:{command:()=>()=>{}},
    runEngineTicks:n=>{if(tickFails)throw new Error('tick failed');ticks+=n;state.clock+=n;return {ticks:n,callbacks:n};}});
  vm.runInContext(owner+'\nglobalThis.ff=fastForward;globalThis.step=advanceTicks;',ctx);
  return {ff:ctx.ff,step:ctx.step,ticks:()=>ticks};
}
test('banked-time spend leaves stepping usable afterwards (G14)',async()=>{
  const h=host();
  const p=h.ff(5,{untilClock:5});
  assert.throws(()=>h.step(1),/Cannot nest advanceTicks/,'the nesting guard still holds during a forward');
  await p;
  assert.equal(h.step(2).ticks,2);
});
test('a forward with nothing to run (clock already at the target) does not wedge stepping',async()=>{
  const h=host();
  await h.ff(5,{untilClock:0});
  assert.equal(h.step(1).ticks,1);
  await h.ff(3);assert.equal(h.step(1).ticks,1);
});
test('a forward that throws before its first yield or mid-run leaves the next advance usable',async()=>{
  for(const opts of [{pauseFails:true},{tickFails:true}]){
    const h=host(opts);
    await assert.rejects(()=>h.ff(5),/failed/);
    assert.equal(h.step(0).ticks,0,'no nesting error after the failure');
  }
});
test('an advance that throws leaves the next advance usable',()=>{
  const h=host({tickFails:true});
  assert.throws(()=>h.step(3),/tick failed/);
  assert.throws(()=>h.step(3),/tick failed/,'fails for its own reason, not as a nested advance');
});

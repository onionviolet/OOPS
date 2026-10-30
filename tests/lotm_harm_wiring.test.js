import test from 'node:test';
import assert from 'node:assert/strict';
import {bare,hostOver,fresh,def,ctx,registry} from './lotm_helpers.js';
import {previewSimulationCommand} from '../src/simulation.js';
import {setHarmState,harmState} from '../src/harm_state.js';
import {harmContext,harmClassOf,accrueHarm,restHarm,lostControlOutcome} from '../src/book_world_lotm_harm.js';
const begin=()=>{const o=hostOver(bare());o.host.enroll('probationer');return o;};
const strain=n=>setHarmState({schema:1,backlash:{power:n}});
test.afterEach(()=>setHarmState(null));
test('the host context makes the command quote carry the stage reason and the graded modifier', () => {
 const p=fresh(),d=def('observe_comparator'),c={...ctx(p)};
 strain(7);
 const slipping=previewSimulationCommand(p.state,registry,d.id,{...c,...harmContext(p.state,d)});
 assert.ok(slipping.reasons.some(r=>/Slipping/.test(r)),'slipping blocks research');
 assert.deepEqual(slipping.harm?.map(m=>m.axis),['precision']);
 strain(0);
 assert.ok(!previewSimulationCommand(p.state,registry,d.id,{...c,...harmContext(p.state,d)}).reasons.some(r=>/Slipping|Power strain/.test(r)));
});
test('accrual comes from a committed cast ability or divination attempt only, and sleep recovers', () => {
 const s={actors:{player:{worldId:'book.lotm.tingen'}}};
 assert.equal(accrueHarm(s,{id:'x',divination:{kind:'prepare'}}),null);
 assert.equal(accrueHarm(s,{id:'x',divination:{kind:'attempt'}}).after,1);
 assert.equal(accrueHarm(s,{id:'y',castAbility:true}).after,1.5);
 assert.equal(accrueHarm({actors:{player:{worldId:'base.frontier'}}},{id:'x',divination:{kind:'attempt'}}),null);
 assert.equal(restHarm(s,120).after,1);
 assert.equal(harmState().backlash.power,1);
});
test('lost control left running resolves to the world outcome', () => {
 const s={actors:{player:{worldId:'book.lotm.tingen'}}};
 strain(8);assert.equal(lostControlOutcome(s),null);
 strain(9);assert.equal(lostControlOutcome(s).default,'final');
});
test('tick calls the die port once for lost control, not while asleep', async () => {
 const calls=[];const o=hostOver(bare(),{die:c=>{calls.push(c);return Promise.resolve();}});o.host.enroll('probationer');
 strain(9);o.box.sleeping=true;o.host.tick(1);assert.equal(calls.length,0);strain(9);
 o.box.sleeping=false;o.host.tick(1);o.host.tick(1);assert.deepEqual(calls,['loss_of_control']);
 await Promise.resolve();await Promise.resolve();o.host.tick(1);assert.equal(calls.length,2);
});
test('command classes cover the host command shapes', () => {
 assert.equal(harmClassOf({id:'a',bodyCare:{kind:'sleep'}}),'rest');
 assert.equal(harmClassOf({id:'a',journey:{}}),'travel');
 assert.equal(harmClassOf({id:'a',divination:{}}),'ritual');
 assert.equal(harmClassOf({id:'a'}),'other');
});

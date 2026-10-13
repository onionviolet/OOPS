import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeGameplayAdapter} from '../src/native_gameplay_adapter.js';
import {writeGameplayToEnvelope} from '../src/gameplay_transactions.js';

test('first staged enrollment binds a registered native owner before durable writing', () => {
    const resident = {}, player = {}, bindings = {player:{category:'person',id:'main_character'}};
    const adapter = createNativeGameplayAdapter({player,getPerson:id=>id==='fixture.resident'?resident:null,bindings});
    const key = JSON.stringify({id:'fixture.crate'});
    const snapshot = {'fixture.resident':{inventory:{[key]:1},skills:{},reputation:{}}};
    assert.deepEqual(adapter.actors({simulation:{people:{}}}),{player});
    const staged = adapter.stageBindings(snapshot,{simulation:{people:{'fixture.resident':{inventory:'native'}}}});
    assert.equal(staged.actors['fixture.resident'],resident);
    const envelope = {inventories:{person:{'fixture.resident':{}}},levels:{person:{'fixture.resident':{skill_xp:{}}}}};
    writeGameplayToEnvelope(envelope,snapshot,staged.bindings);
    assert.equal(envelope.inventories.person['fixture.resident'][key].count,1);
    assert.equal(Object.hasOwn(bindings,'fixture.resident'),false);
    assert.throws(()=>writeGameplayToEnvelope({inventories:{person:{}},levels:{person:{}}},snapshot,staged.bindings),/Missing bound/);
});

test('staged enrollment cannot invent a missing native owner or replace explicit bindings', () => {
    const bindings = {resident:{category:'person',id:'explicit.resident'}};
    const adapter = createNativeGameplayAdapter({player:{},getPerson:id=>id==='resident'?{}:null,bindings});
    const staged = adapter.stageBindings({resident:{}});
    assert.equal(staged.bindings.resident.id,'explicit.resident');
    assert.throws(()=>adapter.stageBindings({unregistered:{}}),/No live actor binding/);
    assert.equal(Object.hasOwn(bindings,'unregistered'),false);
    const unbound = createNativeGameplayAdapter({player:{},getPerson:()=>({}),bindings:{}});
    assert.throws(()=>unbound.stageBindings({resident:{}}),/No native persistence owner/);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {serializeEngineWorld} from '../src/engine_world.js';
import {ryanOpeningRun as run} from '../src/world_packs/perfect_run_opening.js';

const restore = e => run.restore(JSON.parse(JSON.stringify(serializeEngineWorld(e))));
const play = (e, ...ids) => ids.reduce((world, id) => run.act(world, id), e);
const facts = e => Object.fromEntries(run.view(e).facts);
const dead = play(run.create(), 'enter', 'ask', 'react');

test('an unknown ambush cannot be anticipated and a late reaction kills Ryan', () => {
    const fresh = run.create();
    assert.equal(run.act(fresh, 'wait'), fresh);
    assert.equal(run.act(fresh, 'bat'), fresh);
    assert.deepEqual(run.view(fresh).actions.map(a => a.id), ['enter']);
    assert.doesNotMatch(JSON.stringify(run.view(fresh)), /Ghoul|ice spear|50,000|bat/);
    assert.equal(facts(dead).Body, 'Frozen by the ice spear');
    assert.equal(facts(dead).Briefcase, 'With Renesco');
    assert.match(facts(dead)['What you remember'], /attacker/);
    assert.doesNotMatch(JSON.stringify(run.view(dead)), /Ghoul/);
});

test('death rewinds physical facts while retained knowledge changes available action', () => {
    const next = run.act(restore(dead), 'return');
    assert.match(facts(next).Attempt, /Loop 4/);
    assert.equal(next.world.clock, 0);
    assert.equal(facts(next).Body, 'Alive');
    assert.equal(facts(next).Briefcase, 'With you');
    assert.equal(next.world.holders.briefcase.place, 'new_rome.street');
    assert.equal(next.world.holders.ghoul.quantities.vitality, 30);
    assert.match(facts(next)['What you remember'], /Rust Town/);
    assert.equal(run.view(next).actions.find(a => a.id === 'wait').reason, undefined);
    assert.deepEqual(run.view(next).actions.map(a => a.id), ['enter', 'wait']);
    assert.deepEqual(serializeEngineWorld(restore(next)), serializeEngineWorld(next));
});

test('the remembered attempt still permits returning to Renesco and learning by another death', () => {
    const replay = play(restore(dead), 'return', 'enter', 'ask', 'react', 'return');
    assert.match(facts(replay).Attempt, /Loop 5/);
    assert.equal(facts(replay).Briefcase, 'With you');
    assert.deepEqual(run.view(replay).actions.map(a => a.id), ['enter', 'wait']);
});

test('memory enables the car ambush, shared contest defeats Ghoul, and settlement records the repair expense', () => {
    const next = play(restore(dead), 'return', 'wait', 'ram');
    assert.match(facts(next)['Pub entrance'], /Wrecked/);
    const won = run.act(restore(next), 'bat');
    assert.equal(won.world.holders.ghoul.quantities.vitality, 0);
    assert.equal(won.world.holders.ryan.quantities.vitality, 30);
    assert.equal(facts(won).Briefcase, 'With you');
    assert.doesNotMatch(JSON.stringify(run.view(won)), /Ghoul/);
    const repaired = run.act(restore(won), 'settle');
    assert.equal(facts(repaired).Briefcase, 'With you');
    assert.match(run.view(repaired).result, /rifles/);
    assert.equal(run.act(repaired, 'deliver'), repaired);
    const rejected = run.act(restore(repaired), 'bribe');
    assert.match(run.view(rejected).result, /refuses/);
    const cleared = run.act(restore(rejected), 'increase');
    assert.equal(facts(cleared)['Security captain'], 'Larger bribe accepted · rifles lowered');
    const done = run.act(restore(cleared), 'deliver');
    assert.equal(facts(done)['Repair payment'], '€50,000 paid');
    assert.equal(facts(done).Briefcase, 'With Renesco');
    assert.match(run.view(done).result, /Ghoul/);
    assert.equal(run.act(done, 'settle'), done);
    assert.deepEqual(run.view(restore(done)), run.view(done));
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {applyEngineOps, serializeEngineWorld} from '../src/engine_world.js';
import {ryanOpeningRun as run} from '../src/world_packs/perfect_run_opening.js';

// An earned completed checkpoint produced by the pre-N1 source, not a user save.
const previous = JSON.parse(readFileSync(new URL('./fixtures/perfect_run/opening_complete.json', import.meta.url)));
const fresh = () => run.restore(structuredClone(previous));
const play = (engine, ...ids) => ids.reduce((e, id) => run.act(e, id), engine);
const restore = e => run.restore(JSON.parse(JSON.stringify(serializeEngineWorld(e))));
const facts = e => Object.fromEntries(run.view(e).facts);
const npc = e => e.world.holders.wyvern?.state['perfect_run.wyvern'];
const memory = e => e.world.holders.ryan.state['perfect_run.memory'];
const card = e => e.world.holders.wyvern_card?.state['perfect_run.custody'];
const meet = () => play(fresh(), 'morning', 'open_window');

test('the old earned checkpoint continues into paid next morning without losing its outcomes or disclosing the visitor', () => {
    const old = fresh(), history = run.view(old).history;
    assert.equal(old.world.holders.wyvern, undefined);
    assert.deepEqual(run.view(old).actions.map(a => a.id), ['morning']);
    const morning = run.act(old, 'morning');
    assert.equal(morning.world.holders.ryan.quantities['stock:repairs_euro'], 50000);
    assert.equal(morning.world.holders.briefcase.place, 'new_rome.jolie_wrangler');
    assert.match(facts(morning)['Delivery payment'], /Received/);
    assert.equal(morning.world.holders.ryan.quantities['stock:euro'], undefined);
    assert.match(facts(morning)['Your lead'], /northwest/);
    assert.doesNotMatch(JSON.stringify(run.view(morning)), /Wyvern|Il Migliore|files/);
    assert.deepEqual(run.view(morning).history.slice(0, history.length), history);
    assert.deepEqual(run.view(restore(morning)), run.view(morning));
    assert.equal(run.act(morning, 'morning'), morning);
});

test('telling Wyvern about Len records the actual disclosure and conditional offer, never a result or alliance', () => {
    const met = meet();
    assert.doesNotMatch(JSON.stringify(run.view(met)), /Il Migliore|look in the files/);
    assert.deepEqual(run.view(met).actions.map(a => a.id), ['ask_len', 'keep_private']);
    assert.equal(npc(met).knowsLen, false);
    const offered = restore(run.act(met, 'ask_len'));
    assert.equal(npc(offered).knowsLen, true);
    assert.equal(npc(offered).disclosed.name, 'Len');
    assert.equal(npc(offered).disclosed.hair, 'black');
    assert.equal(npc(offered).disclosed.rustTown, undefined);
    assert.deepEqual(npc(offered).offer, {by: 'wyvern', to: 'ryan', target: 'len', kind: 'look_in_files',
        status: 'offered', conditional: true, result: null, at: met.world.clock, loop: 4});
    assert.match(facts(offered)['Wyvern’s offer'], /no answer yet/);
    assert.match(facts(offered)['Il Migliore'], /have not joined/);
    assert.equal(run.act(offered, 'ask_len'), offered);
    const finished = play(offered, 'defer_recruitment', 'take_card');
    assert.deepEqual(card(finished), {holder: 'ryan'});
    assert.equal(npc(finished).departed, true);
    assert.equal(npc(finished).offer.status, 'offered');
    assert.equal(npc(finished).offer.result, null);
    assert.equal(memory(finished).hqAddressKnown, true);
    assert.deepEqual(run.view(restore(finished)), run.view(finished));
    assert.equal(run.act(finished, 'take_card'), finished);
});

test('keeping Len private leaves no NPC request, and declining the card does not grant its address', () => {
    const done = play(meet(), 'keep_private', 'defer_recruitment', 'leave_card');
    assert.equal(npc(done).knowsLen, false);
    assert.equal(npc(done).disclosed, undefined);
    assert.equal(npc(done).offer, null);
    assert.equal(memory(done).wyvernOfferRemembered, undefined);
    assert.equal(memory(done).hqAddressKnown, undefined);
    assert.deepEqual(card(done), {holder: 'wyvern'});
    assert.equal(done.world.holders.wyvern_card.place, 'new_rome.northbound');
    assert.match(facts(done)['Wyvern’s offer'], /No inquiry/);
    assert.equal(facts(done)['Wyvern’s card'], 'With Wyvern');
    assert.deepEqual(run.view(restore(done)), run.view(done));
});

test('a later death keeps Ryan’s memory but erases the NPC disclosure, conditional offer, payment and physical card', () => {
    const done = play(meet(), 'ask_len', 'defer_recruitment', 'take_card');
    // Failure injection represents a future fatal event, not an authored new death scene.
    const dead = applyEngineOps(restore(done), [{op: 'set', holder: 'ryan', quantity: 'vitality', amount: 0}], 'test:later_fatal_event');
    const returned = run.act(dead, 'return');
    assert.match(facts(returned).Attempt, /Loop 5/);
    assert.equal(memory(returned).wyvernOfferRemembered, true);
    assert.equal(memory(returned).hqAddressKnown, true);
    assert.equal(npc(returned), undefined);
    assert.equal(card(returned), undefined);
    assert.equal(facts(returned)['Delivery payment'], undefined);
    assert.match(facts(returned)['Remembered conversation'], /earlier attempt/);
    assert.match(facts(returned)['Remembered contact'], /do not hold/);
    const replay = play(restore(returned), 'wait', 'ram', 'bat', 'settle', 'bribe', 'increase', 'deliver', 'morning', 'open_window');
    assert.equal(npc(replay).knowsLen, false);
    assert.equal(npc(replay).offer, null);
    assert.deepEqual(card(replay), {holder: 'wyvern'});
    assert.equal(memory(replay).wyvernOfferRemembered, true);
    const declinedAgain = play(replay, 'keep_private', 'defer_recruitment', 'leave_card');
    assert.equal(memory(declinedAgain).hqAddressKnown, true);
    assert.equal(npc(declinedAgain).offer, null);
    assert.deepEqual(card(declinedAgain), {holder: 'wyvern'});
    assert.match(facts(declinedAgain)['Remembered contact'], /remember the headquarters address/);
    assert.doesNotMatch(run.view(declinedAgain).result, /without giving you its address|will not have its address/);
});

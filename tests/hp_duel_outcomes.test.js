import assert from 'node:assert/strict';
import test from 'node:test';
import {restoreContest, serializeContest} from '../src/contest.js';
import {applyEngineOps, restoreEngineWorld, serializeEngineWorld} from '../src/engine_world.js';
import {cancelSpellCast} from '../src/spell_law.js';
import {DUELLING_CLUB_CONFIG} from '../src/world_packs/hp_duelling_club.js';
import {advanceDuelOutcome, answerDuelSurrender, castInDuelOutcome, DUEL_OUTCOME_LAW,
    followDuelPursuit, offerDuelSurrender, startDuelOutcome, withdrawFromDuelOutcome} from '../src/world_packs/hp_duel_outcomes.js';

const save = ({engine, record}) => ({engine: serializeEngineWorld(engine), record: serializeContest(record)});
const restore = state => {
    const data = JSON.parse(JSON.stringify(save(state)));
    return {engine: restoreEngineWorld(data.engine, DUELLING_CLUB_CONFIG), record: restoreContest(DUEL_OUTCOME_LAW, data.record)};
};
const drop = {id: 'drop', actor: 'harry', spellId: 'disarm', target: 'draco'};
const start = options => advanceDuelOutcome(castInDuelOutcome(startDuelOutcome(options), drop), 2);
const settled = state => state.engine.world.chain.filter(row => row.kind === 'contest.settled');
const holder = (state, id) => state.engine.world.holders[id];

test('a saved surrender offer settles once and an already released charm still hits', () => {
    const state = castInDuelOutcome(start(), {
        id: 'released', actor: 'harry', spellId: 'dance', target: 'draco', minutes: 1, flightMinutes: 3,
    });
    const launched = advanceDuelOutcome(state, 3);
    const offered = offerDuelSurrender(castInDuelOutcome(launched, {
        id: 'preparing', actor: 'harry', spellId: 'tickle', target: 'draco', minutes: 2,
    }));
    assert.equal(offered.record.result, null);
    assert.throws(() => answerDuelSurrender(withdrawFromDuelOutcome(offered)), /no offer/);
    const accepted = answerDuelSurrender(restore(offered));
    assert.equal(accepted.record.result.winnerOutcome, 'surrender_accepted');
    assert.equal(accepted.record.result.outcomes.draco, 'yielded');
    assert.equal(accepted.record.result.at, 1800);
    assert.equal(accepted.engine.records.workings.preparing.record.status, 'interrupted');
    assert.equal(settled(accepted).length, 1);
    assert.throws(() => castInDuelOutcome(accepted, {...drop, id: 'again'}), /exchange has ended/);
    const done = advanceDuelOutcome(answerDuelSurrender(restore(accepted)), 6);
    assert.deepEqual(save(done), save(advanceDuelOutcome(answerDuelSurrender(offered), 6)));
    assert.equal(settled(done).length, 1);
    assert.equal(holder(done, 'draco').properties.mind_compelled_steps, true);
    assert.equal(holder(done, 'harry').quantities.stamina, 5);
    assert.equal(holder(done, 'draco-wand').place, 'far-floor');
});

test('a refused surrender leaves escape open and publishes only after a real crossing', () => {
    const refused = answerDuelSurrender(restore(offerDuelSurrender(start({acceptsSurrender: false, pursues: true}))));
    assert.equal(refused.record.result, null);
    assert.equal(refused.record.log.at(-1).outcome, 'refused');
    const closed = {...refused, engine: applyEngineOps(refused.engine, [{op: 'link_set', id: 'exit', state: 'closed'}], 'closed')};
    const stuck = advanceDuelOutcome(restore(withdrawFromDuelOutcome(closed)), 3);
    assert.equal(holder(stuck, 'draco').place, 'east-platform');
    assert.equal(stuck.record.result, null);
    assert.equal(settled(stuck).length, 0);
    const open = {...stuck, engine: applyEngineOps(stuck.engine, [{op: 'link_set', id: 'exit', state: 'open'}], 'open')};
    const escaped = advanceDuelOutcome(restore(open), 5);
    assert.deepEqual(save(escaped), save(advanceDuelOutcome(open, 5)));
    assert.equal(holder(escaped, 'draco').place, 'doorway');
    assert.equal(holder(escaped, 'draco').quantities.vitality, 20);
    assert.equal(escaped.record.result.outcomes.draco, 'escaped');
    assert.deepEqual(escaped.record.pursuits, [{by: 'harry', of: 'draco', at: escaped.record.result.at}]);
    assert.equal(settled(escaped).length, 1);
});

test('a restored pursuer follows the witnessed route and stops at a closed leg', () => {
    const escaped = advanceDuelOutcome(withdrawFromDuelOutcome(start({pursues: true})), 3);
    assert.equal(holder(escaped, 'harry').properties.duel_pursuit_lead, 'doorway');
    const queued = followDuelPursuit(restore(escaped));
    const closed = {...queued, engine: applyEngineOps(queued.engine, [
        {op: 'link_set', id: 'platform-walk', state: 'closed'},
    ], 'close-after-choice')};
    const stalled = advanceDuelOutcome(restore(closed), 4);
    assert.equal(holder(stalled, 'harry').place, 'west-platform');
    assert.throws(() => followDuelPursuit(stalled), /route.*closed/);

    const open = {...stalled, engine: applyEngineOps(stalled.engine, [
        {op: 'link_set', id: 'platform-walk', state: 'open'},
    ], 'open-path')};
    const first = advanceDuelOutcome(restore(open), 5);
    assert.equal(holder(first, 'harry').place, 'east-platform');
    const last = followDuelPursuit(restore(first));
    const contact = advanceDuelOutcome(restore(last), 6);
    assert.deepEqual(save(contact), save(advanceDuelOutcome(last, 6)));
    assert.equal(holder(contact, 'harry').place, 'doorway');
    assert.equal(holder(contact, 'harry').quantities.stamina, 7);
    assert.deepEqual(contact.record.result, escaped.record.result);
    assert.equal(settled(contact).length, 1);
});

test('an unwitnessed escape leaves a pursuit intent but no destination to follow', () => {
    const pending = withdrawFromDuelOutcome(start({pursues: true}));
    const hidden = {...pending, engine: applyEngineOps(pending.engine, [
        {op: 'link_set', id: 'platform', state: 'closed'},
    ], 'hide-departure')};
    const escaped = advanceDuelOutcome(restore(hidden), 3);
    assert.equal(escaped.record.pursuits.length, 1);
    assert.equal(holder(escaped, 'draco').place, 'doorway');
    assert.throws(() => followDuelPursuit(restore(escaped)), /no witnessed route/);
});

test('the idle contest chooser uses the same paid spell actions and skips a disarmed caster', () => {
    const initial = startDuelOutcome();
    const idle = ['harry', 'draco'];
    const run = advanceDuelOutcome(initial, 6, {idle});
    const restored = advanceDuelOutcome(restore(advanceDuelOutcome(initial, 1, {idle})), 6, {idle});
    assert.deepEqual(save(restored), save(run));
    const manualDance = {id: 'idle.draco.dance', actor: 'draco', spellId: 'dance', target: 'harry'};
    const manualDisarm = {...drop, id: 'idle.harry.disarm'};
    // Draco starts the reply at minute one, while he still has the wand.
    const manualFirst = advanceDuelOutcome(castInDuelOutcome(castInDuelOutcome(initial, manualDance), manualDisarm), 1);
    const replay = castInDuelOutcome(manualFirst, {
        id: 'idle.draco.tickle', actor: 'draco', spellId: 'tickle', target: 'harry',
    });
    assert.deepEqual(save(advanceDuelOutcome(replay, 6)), save(run));
    assert.equal(run.engine.records.workings['idle.draco.tickle'].record.status, 'interrupted');
    assert.equal(holder(run, 'draco').quantities.stamina, 8);

    const disarmed = start();
    const afterDrop = advanceDuelOutcome(restore(disarmed), 6, {idle: ['draco']});
    assert.equal(Object.keys(afterDrop.engine.records.workings).length, 1);
    assert.equal(holder(afterDrop, 'draco').quantities.stamina, 10);
});

test('idle waits for the shield window and defends twice across restores', () => {
    const initial = startDuelOutcome();
    initial.record.entrants.draco.moves = ['shield'];
    const idle = {idle: ['draco']};
    const attack = id => ({id, actor: 'harry', spellId: 'dance', target: 'draco', minutes: 1, flightMinutes: 4});
    const launched = advanceDuelOutcome(castInDuelOutcome(initial, attack('first')), 1);
    const waiting = advanceDuelOutcome(restore(launched), 3, idle);
    assert.deepEqual(Object.keys(waiting.engine.records.workings), ['first']);
    const first = advanceDuelOutcome(restore(waiting), 5, idle);
    assert.deepEqual(save(first), save(advanceDuelOutcome(launched, 5, idle)));
    const manual = castInDuelOutcome(waiting, {id: 'idle.draco.shield.3', actor: 'draco', spellId: 'shield', target: 'draco'});
    assert.deepEqual(save(first), save(advanceDuelOutcome(manual, 5)));
    assert.match(first.engine.records.workings.first.landed[0].reason, /intercepted by idle.draco.shield.3/);

    const second = castInDuelOutcome(first, attack('second'));
    const defended = advanceDuelOutcome(restore(advanceDuelOutcome(second, 8, idle)), 10, idle);
    assert.deepEqual(save(defended), save(advanceDuelOutcome(second, 10, idle)));
    assert.match(defended.engine.records.workings.second.landed[0].reason, /intercepted by idle.draco.shield.8/);
    assert.equal(holder(defended, 'draco').quantities.stamina, 6);
    assert.equal(holder(defended, 'harry').quantities.stamina, 6);
    assert.equal(holder(defended, 'draco').properties.mind_compelled_steps, undefined);

    const tooLate = advanceDuelOutcome(restore(advanceDuelOutcome(launched, 4)), 5, idle);
    assert.equal(tooLate.engine.records.workings.first.landed[0].status, 'published');
    assert.equal(holder(tooLate, 'draco').quantities.stamina, 10);

    const covered = {...waiting, engine: applyEngineOps(waiting.engine, [
        {op: 'link_set', id: 'platform', state: 'closed'},
    ], 'close-sightline')};
    const missed = advanceDuelOutcome(restore(covered), 5, idle);
    assert.match(missed.engine.records.workings.first.landed[0].reason, /no clear path/);
    assert.equal(holder(missed, 'draco').quantities.stamina, 10);
});

test('idle abandons an unpaid reply against a visible wind-up when a shield can finish', () => {
    const initial = startDuelOutcome();
    initial.record.entrants.draco.moves = ['shield'];
    const reply = {id: 'reply', actor: 'draco', spellId: 'tickle', target: 'harry', minutes: 3};
    const pending = castInDuelOutcome(castInDuelOutcome(initial, reply), drop);
    const defend = state => advanceDuelOutcome(state, 3, {idle: ['draco']});
    const guarded = defend(restore(pending));
    const interrupted = guarded.engine.records.workings.reply.record;
    assert.equal(interrupted.status, 'interrupted');
    assert.match(interrupted.receipts[0].reason, /caster stopped/);
    assert.match(guarded.engine.records.workings.drop.landed[0].reason, /intercepted by idle.draco.shield.0/);
    assert.equal(holder(guarded, 'draco').quantities.stamina, 8);
    assert.deepEqual(holder(guarded, 'draco-wand').properties.marks, ['grip:draco']);

    const manual = {...pending, engine: cancelSpellCast(pending.engine, {id: 'reply', actor: 'draco'}).engine};
    const shielded = castInDuelOutcome(manual, {id: 'idle.draco.shield.0', actor: 'draco', spellId: 'shield', target: 'draco'});
    assert.deepEqual(save(guarded), save(advanceDuelOutcome(shielded, 3)));

    const tooLate = defend(restore(advanceDuelOutcome(pending, 1)));
    assert.match(tooLate.engine.records.workings.reply.record.receipts[0].reason, /out of your hand/);
    assert.equal(holder(tooLate, 'draco').quantities.stamina, 10);

    const exhausted = {...pending, engine: applyEngineOps(pending.engine, [
        {op: 'set', holder: 'draco', quantity: 'stamina', amount: 1},
    ], 'tired-before-defense')};
    const cannotGuard = defend(restore(exhausted));
    assert.match(cannotGuard.engine.records.workings.reply.record.receipts[0].reason, /out of your hand/);
    assert.equal(holder(cannotGuard, 'draco').quantities.stamina, 1);
});

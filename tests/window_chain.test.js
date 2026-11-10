// Shared story-window chain builder (LAYM1). Content identity is JSON.stringify of the
// raw window, so these checks pin key order as well as values.
import test from 'node:test';
import assert from 'node:assert/strict';
import {all, eq, gte, heldBodyReady, itemKey, windowKit} from '../src/window_chain.js';

const prefix = 'test.lead.window';
const ready = all(eq('actor.life', 'alive'), eq('native.ready'));
const admitted = eq('structured.extension.test.lead.window.admitted');
const kit = windowKit({prefix, energyId: 'test.pool', reserveReason: v => `Prepare ${v} parts first.`});
const act = kit.chain({worldId: 'test.world', location: 'test.place', admitted, ready, defaultReason: 'Finish the previous step first.'});

test('an act keeps the existing window key order and shape', () => {
    const c = act('look', 'Look around', 30, kit.done('arrive'), 'See who is here.', [kit.note('look', 'Seen.')]);
    assert.equal(JSON.stringify(Object.keys(c)), JSON.stringify(['id', 'revision', 'label', 'description', 'group', 'worldId',
        'actorId', 'location', 'audience', 'once', 'duration', 'visibleWhen', 'requires', 'completionRequires',
        'completionCoLocated', 'completionFailure', 'cancellation', 'reservationReturns', 'costs', 'effects']));
    const visibleWhen = {all: [admitted, {fact: 'completed.test.lead.window.arrive', op: 'eq', value: true}]};
    const support = {all: [ready, visibleWhen]};
    assert.equal(JSON.stringify(c), JSON.stringify({
        id: 'test.lead.window.look', revision: 1, label: 'Look around', description: 'See who is here.',
        group: 'structured_local', worldId: 'test.world', actorId: 'player', location: 'test.place',
        audience: ['$actor'], once: true, duration: 30, visibleWhen,
        requires: {all: [support], reason: 'Finish the previous step first.'},
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
        cancellation: 'refund', reservationReturns: 1, costs: [],
        effects: [{type: 'knowledge', actor: 'player', key: 'test.lead.window.look', stage: 'understood', value: 'Seen.'}]
    }));
});

test('parts reserve energy at start and spend it; repeat and extra fields carry through', () => {
    const c = act('push', 'Push on', 60, kit.done('look'), 'Spend effort.', [], {
        needs: [kit.stock('test.rope')], parts: 8, costs: [kit.item('test.rope', -1)], repeat: true,
        reason: 'Bring rope.', durationSinceKnowledge: 'test.anchor'});
    assert.equal(c.once, false);
    assert.equal(c.requires.reason, 'Bring rope.');
    assert.deepEqual(c.requires.all.at(-1), {fact: 'energy.test.pool.reserve', op: 'gte', value: 8, reason: 'Prepare 8 parts first.'});
    assert.deepEqual(c.completionRequires.all.at(-1), {fact: `item.${itemKey('test.rope')}`, op: 'gte', value: 1});
    assert.deepEqual(c.costs, [{type: 'item', actor: 'player', key: itemKey('test.rope'), amount: -1},
        {type: 'energy', actor: 'player', energyId: 'test.pool', operation: 'use', output: 8, control: 1}]);
    assert.equal(Object.keys(c).at(-1), 'durationSinceKnowledge');
});

test('helpers emit the same rows windows wrote by hand', () => {
    assert.deepEqual(eq('a'), {fact: 'a', op: 'eq', value: true});
    assert.equal(JSON.stringify(eq('a', 2, 'why')), '{"fact":"a","op":"eq","value":2,"reason":"why"}');
    assert.equal(JSON.stringify(gte('a', 3)), '{"fact":"a","op":"gte","value":3}');
    assert.equal(JSON.stringify(kit.set('x', 1)), '{"type":"fact","actor":"player","scope":"actor","key":"test.lead.window.x","value":1}');
    assert.equal(JSON.stringify(kit.event('x', 1)), '{"type":"fact","actor":"player","scope":"world","key":"test.lead.window.x","value":1}');
    assert.equal(JSON.stringify(kit.status('x', 'X')), '{"id":"test.lead.window.x_status","label":"X","knowledgeKey":"test.lead.window.x"}');
    assert.equal(JSON.stringify(kit.recover(4)), '{"type":"energy","actor":"player","energyId":"test.pool","operation":"recover","amount":4}');
    assert.equal(JSON.stringify(kit.field('x', 'y')), '{"fact":"actor.test.lead.window.x","op":"eq","value":"y"}');
});

test('missing context fails loudly instead of emitting a half-built window', () => {
    assert.throws(() => windowKit({}), /prefix/);
    assert.throws(() => kit.chain({worldId: 'w'}), /chain needs/);
    const plain = windowKit({prefix});
    assert.throws(() => plain.spend(1), /no energy pool/);
    assert.equal(plain.chain({worldId: 'w', location: 'p', admitted, ready, defaultReason: 'r'})
        ('a', 'A', 1, kit.done('z'), 'd', []).costs.length, 0);
});

test('heldBodyReady and window() emit the rows the hand-written windows used', () => {
    const ready2 = heldBodyReady({claim: 'c', faculty: 'f', place: 'p'});
    assert.equal(JSON.stringify(ready2), JSON.stringify(all(
        eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
        eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
        eq('claim.c.held'), eq('claim.c.owner', 'player'), eq('faculty.f.active'), eq('actor.location', 'p'))));
    const base = {id: 'b', revision: 1, contentHash: 'sha256:x', extra: 'dropped'};
    const w = kit.window({base, label: 'L', description: 'D', requires: ready, reason: 'R', status: [], commands: [{id: 'c'}]});
    assert.equal(JSON.stringify(Object.keys(w)), JSON.stringify(['schema', 'id', 'revision', 'base', 'label', 'description',
        'requires', 'reason', 'status', 'commands']));
    assert.deepEqual(w.base, {id: 'b', revision: 1, contentHash: 'sha256:x'});
    assert.ok(Object.hasOwn(kit.window({base, label: 'L', description: 'D', requires: ready, reason: 'R', items: [], status: [], commands: [{id: 'c'}]}), 'items'));
    assert.throws(() => kit.window({base}), /a window needs/);
});

test('flatRequires keeps the older spread shape for a plain act', () => {
    const flat = kit.chain({worldId: 'w', location: 'p', admitted, ready, defaultReason: 'r', flatRequires: true});
    const c = flat('a', 'A', 1, kit.done('z'), 'd', []);
    assert.deepEqual(Object.keys(c.requires), ['all', 'reason']);
    assert.deepEqual(c.requires.all[0], ready);
    // an act with start checks still wraps, so flat and nested agree on every non-trivial act
    assert.ok(flat('b', 'B', 1, kit.done('z'), 'd', [], {atStart: [eq('x')]}).requires.all[0].all);
});

// RCL9: windows moved onto windowKit keep their content hash, so earned saves still adopt them.
// Hashes were taken from the hand-written modules before the move.
test('moved Gu windows keep their pre-move content hash', async () => {
    const {createHash} = await import('node:crypto');
    const hash = v => createHash('sha256').update(JSON.stringify(v)).digest('hex');
    const {guLeadWolfFront} = await import('../src/world_packs/book_gu_lead_wolf_front.js');
    const {guLeadAllianceSlope} = await import('../src/world_packs/book_gu_lead_alliance_slope.js');
    assert.equal(hash(guLeadWolfFront), 'b50fb0bcc47bc5b80ac293f1bf7b0993e248b83dc30aaae130555e8f6eee3a95');
    assert.equal(hash(guLeadAllianceSlope), '5990ec8ed004505d82109ccfdec8002cfd0595a1f342241f0c8b195426aa5ce0');
});

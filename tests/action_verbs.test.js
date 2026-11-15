import test from 'node:test';
import assert from 'node:assert/strict';
import {ACTION_VERBS, verbOf, verbById} from '../src/ui/action_verbs.js';

test('one ordered verb list: YAIR native order with the life verbs placed by kind (PS120)', () => {
    const ids = ACTION_VERBS.map(v => v.id);
    assert.deepEqual(ids.slice(0, 3), ['travel', 'fast_travel', 'craft']);
    const at = id => ids.indexOf(id);
    assert.equal(at('refine'), at('craft') + 1);
    assert.ok(at('feed') > at('talk') && at('hand_in') === at('trade') + 1);
    assert.equal(at('attend'), at('train') - 1, 'a school world\'s Attend sits in Train\'s slot');
    assert.ok(at('study') > at('train') && at('practise') > at('train') && at('patrol') === at('challenge') - 1);
    assert.ok(ACTION_VERBS.every((v, i) => v.order === i && /^[a-z0-9_]+$/.test(v.icon)), 'Material Icons ligatures, order matches position');
    assert.equal(verbById('nope').id, 'action');
});

test('an act belongs to its own verb, else one read from its words (PS120)', () => {
    assert.equal(verbOf({label: 'Feed the Four Flavours Liquor Worm'}), 'feed');
    assert.equal(verbOf({label: 'Refine the wild Gu'}), 'refine');
    assert.equal(verbOf({label: 'Cow the wild Gu with a wolf eye, then refine it'}), 'refine');
    assert.equal(verbOf({label: 'Practice circulating essence'}), 'practise');
    assert.equal(verbOf({label: 'Hand in the wolf pelts'}), 'hand_in');
    assert.equal(verbOf({label: 'Patrol the stockade'}), 'patrol');
    assert.equal(verbOf({label: 'Study the Gu manual'}), 'study');
    assert.equal(verbOf({id: 'buy.petals', label: 'Buy a bag of Moon Orchid petals'}), 'trade');
    assert.equal(verbOf({label: 'Look around', verb: 'study'}), 'study', 'the pack\'s own verb wins');
    assert.equal(verbOf({label: 'Look around', verb: 'dance'}), 'action', 'an unknown verb id falls back');
    assert.equal(verbOf({label: 'Wait for dusk'}), 'action');
    // D3: Harry's school day reads by its command ids, so 'Go to Charms' is a lesson, not a journey.
    assert.equal(verbOf({id: 'book.hp.lead.day.attend_charms', label: 'Go to Charms · 1 h'}), 'attend');
    assert.equal(verbOf({id: 'book.hp.lead.day.homework_charms', label: 'Write your Charms homework · 1 h'}), 'study');
    assert.equal(verbOf({id: 'book.hp.lead.exam_charms', label: 'Charms'}), 'attend');
    assert.equal(verbOf({id: 'book.hp.lead.revise_charms', label: 'Charms'}), 'study');
    assert.equal(verbOf({label: 'Go to the market'}), 'travel');
});

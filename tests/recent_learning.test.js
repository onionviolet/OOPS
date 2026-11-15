import test from 'node:test';
import assert from 'node:assert/strict';
import {recordLearning, learningNowView, notePractice} from '../src/recent_learning.js';

const readers = {visible: id => id !== 'Hidden', name: id => id, capped: id => id === 'Old'};

test('Learning now keeps a skill through spaced gains, folds it after a quiet hour, and keeps join order (PS146)', () => {
    const owner = {};
    recordLearning(owner, 'Woodcutting', 2); recordLearning(owner, 'Breathing', 1);
    let v = learningNowView(owner, readers, 100);
    assert.deepEqual(v.now.map(r => r.skillId), ['Woodcutting', 'Breathing']);
    recordLearning(owner, 'Breathing', 1);
    v = learningNowView(owner, readers, 150);
    assert.deepEqual(v.now.map(r => r.skillId), ['Woodcutting', 'Breathing'], 'a fresh gain does not reorder the list');
    v = learningNowView(owner, readers, 170);
    assert.deepEqual(v.now.map(r => r.skillId), ['Breathing']);
    assert.deepEqual(v.earlier.map(r => r.skillId), ['Woodcutting']);
});

test('the practice line names a chosen practice that has given its skill nothing, and a level cap when that is why (PS146)', () => {
    const owner = {}, node = {isConnected: true};
    notePractice('fishing', ['Fishing', 'Old', 'Hidden'], node, 0);
    assert.equal(learningNowView(owner, readers, 10).practice, '', 'too soon to say');
    assert.equal(learningNowView(owner, readers, 40).practice, 'fishing: no Fishing, Old (at its highest level) XP since you started.');
    recordLearning(owner, 'Fishing', 1);
    assert.equal(learningNowView(owner, readers, 45).practice, 'fishing: no Old (at its highest level) XP since you started.');
    node.isConnected = false;
    assert.equal(learningNowView(owner, readers, 90).practice, '', 'a stopped activity says nothing');
});

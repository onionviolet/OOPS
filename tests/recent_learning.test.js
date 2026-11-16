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
    assert.equal(learningNowView(owner, readers, 40).practice, 'fishing: no Fishing or Old (at its highest level) XP since you started.');
    recordLearning(owner, 'Fishing', 1);
    assert.equal(learningNowView(owner, readers, 45).practice, 'fishing: no Old (at its highest level) XP since you started.');
    node.isConnected = false;
    assert.equal(learningNowView(owner, readers, 90).practice, '', 'a stopped activity says nothing');
});

test('Learning now gives a rate once there is a run to measure, the activity it comes from, and one line for a level reached (PS204)', () => {
    const owner = {}, node = {isConnected: true}; let lvl = 1;
    const r = {...readers, level: () => lvl};
    notePractice('running', ['Running'], node, 0);
    recordLearning(owner, 'Running', 1);
    let v = learningNowView(owner, r, 0);
    assert.equal(v.now[0].rate, null, 'no run yet: rate unknown');
    assert.equal(v.now[0].from, 'running');
    recordLearning(owner, 'Running', 20); lvl = 2;
    v = learningNowView(owner, r, 30);
    assert.equal(v.now[0].rate, 40, '20 XP over 30 minutes is 40 an hour');
    assert.equal(v.levelUp, 'Running reached 2');
    assert.equal(learningNowView(owner, r, 200).levelUp, '', 'the level line goes quiet after the hour');
    assert.equal(Object.keys(owner).includes('recent_level_up'), false, 'nothing new is kept on the owner');
});

test('the practice line adds the known cause when a quiet skill\'s gate is shut (PS168)', () => {
    const owner = {}, node = {isConnected: true};
    notePractice('sparring', ['Iron skin', 'Combat'], node, 0);
    const worn = {...readers, practiceFacts: () => ({wearingArmor: true})};
    assert.equal(learningNowView(owner, worn, 40).practice,
        'sparring: no Iron skin or Combat XP since you started. Iron skin: your armour takes the hits it learns from.');
    const bare = {...readers, practiceFacts: () => ({wearingArmor: false})};
    assert.equal(learningNowView(owner, bare, 41).practice, 'sparring: no Iron skin or Combat XP since you started.', 'no known cause, no guess');
    assert.deepEqual(learningNowView(owner, worn, 42).stalls.map(st => [st.skillId, st.reason]), [['Iron skin', 'gate'], ['Combat', 'unknown']], 'one structured reason per quiet skill');
    const capped = {...readers, capped: id => id === 'Combat'};
    assert.deepEqual(learningNowView(owner, capped, 43).stalls.find(st => st.skillId === 'Combat'), {skillId: 'Combat', name: 'Combat', reason: 'capped', cause: 'at its highest level'});
    node.isConnected = false;
});

test('PS280: the practising skill rows carry data-practising while the practice runs, and lose it when it stops', async () => {
    const {createDom} = await import('../scripts/headless/dom.mjs');
    const {renderRecentLearning} = await import('../src/recent_learning.js');
    const dom = createDom(); dom.loadHTML('<html><body><div id="list"><div class="skill_div" data-skill="Iron skin"></div><div class="skill_div" data-skill="Combat"></div><div class="skill_div" data-skill="Hidden"></div></div></body></html>');
    const doc = dom.document, host = doc.getElementById('list'), node = {isConnected: true};
    notePractice('sparring', ['Iron skin', 'Hidden'], node, 0);
    renderRecentLearning(host, {}, {...readers, now: () => 5});
    assert.deepEqual([...doc.querySelectorAll('[data-practising]')].map(n => n.dataset.skill), ['Iron skin'], 'an undiscovered skill is not marked');
    node.isConnected = false;
    renderRecentLearning(host, {}, {...readers, now: () => 6});
    assert.equal(doc.querySelectorAll('[data-practising]').length, 0);
});

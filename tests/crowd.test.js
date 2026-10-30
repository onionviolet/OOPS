import test from 'node:test';
import assert from 'node:assert/strict';
import {generateCrowd, stepCrowd, slotsOf, promote, chooseWitness, comesForward, crowdTestimony, parsePerson, nameSeed, CROWD_TABLE} from '../src/crowd.js';
import {witnessScene, witnessView, groupHolder} from '../src/crowd_memory.js';
import {recalledPhrase} from '../src/person_memory_effects.js';
import {freshMemory, readMemories, validateMemory} from '../src/person_memory.js';

const base = {place: 'v', minute: 1440 * 5 + 540, root: 11};

test('a crowd follows the hour and place, and replays identically', () => {
    const noon = generateCrowd({...base, minute: 1440 * 5 + 780}), night = generateCrowd({...base, minute: 1440 * 5 + 60});
    assert.deepEqual(noon, generateCrowd({...base, minute: 1440 * 5 + 780}));
    assert.ok(noon.size > night.size);
    assert.ok(generateCrowd({...base, scale: 3}).size > generateCrowd({...base}).size);
    assert.ok(generateCrowd({...base, exclude: {worker: 2}}).roles.worker <= generateCrowd(base).roles.worker);
});

test('one keyed draw splits the crowd, conserves heads, and a worse sight scares more', () => {
    const crowd = generateCrowd({...base, scale: 6});
    for (let sev = 0; sev <= 4; sev++) { const s = stepCrowd({crowd, severity: sev, root: 11}); assert.equal(Object.values(s.totals).reduce((a, b) => a + b, 0), crowd.size); }
    const calm = stepCrowd({crowd, severity: 0, root: 11}).totals, awful = stepCrowd({crowd, severity: 4, root: 11}).totals;
    assert.ok(awful.flee + awful.freeze > calm.flee + calm.freeze);
    assert.deepEqual(stepCrowd({crowd, severity: 2, root: 11}), stepCrowd({crowd, severity: 2, root: 11}));
    assert.deepEqual(stepCrowd({crowd, severity: 2, step: 1, root: 11}).byRole === undefined, false);
    // roles act by role: children flee more than authorities
    const s = stepCrowd({crowd: {...crowd, roles: {child: 50, authority: 50}}, severity: 0, root: 3}).byRole;
    assert.ok(s.child.flee > s.authority.flee);
});

test('promotion is the same person on replay, independent of other heads and unrelated draws', () => {
    const crowd = generateCrowd({...base, scale: 4}), step = stepCrowd({crowd, severity: 1, root: 11});
    const w = chooseWitness({crowd, step, reason: 'sees_face', root: 11});
    assert.deepEqual(w, chooseWitness({crowd, step, reason: 'sees_face', root: 11}));
    assert.deepEqual(parsePerson(w.id), {place: 'v', day: 5, band: 'morning', role: w.role, index: slotsOf(crowd)[w.slot].index});
    // identity and name seed need only (place, day, band, role, index)
    const other = generateCrowd({...base, scale: 4, exclude: {worker: 1}});
    assert.equal(nameSeed(11, w.id), w.seed);
    assert.equal(promote({crowd, slot: w.slot, reason: 'hurt', root: 11}).id, w.id);
    assert.ok(other.id === crowd.id);
    assert.notEqual(chooseWitness({crowd, step, reason: 'sees_face', root: 12})?.seed, w.seed);
});

test('witnesses come forward by keyed draw, bent by goals', () => {
    const rate = goals => Array.from({length: 200}, (_, i) => comesForward({witness: 'w' + i, investigator: 'i', day: 3, root: 5, goals}).comes).filter(Boolean).length;
    assert.ok(rate({civic: 1}) > rate({}) && rate({}) > rate({protect: 1, fear: 1}));
    assert.deepEqual(comesForward({witness: 'a', investigator: 'i', day: 3, root: 5}), comesForward({witness: 'a', investigator: 'i', day: 3, root: 5}));
    assert.ok(crowdTestimony({watching: 20, investigator: 'i', crowdId: 'c', root: 5, goals: {civic: 1}}) > crowdTestimony({watching: 20, investigator: 'i', crowdId: 'c', root: 5, goals: {protect: 1}}));
});

test('a scene writes one promoted witness episode and a group impression, replayably and once', () => {
    const fact = 'fx1|respect|-1|interruption|aaaaaaaaaaaaaaaa|bbbbbbbbbbbbbbbb', args = {memory: freshMemory(), scene: {place: 'v', severity: 1, scale: 2}, subject: 'player', fact, feeling: -1, minute: base.minute, day: 5, root: 11};
    const a = witnessScene(args), b = witnessScene(args);
    assert.deepEqual(a.memory, b.memory);
    assert.ok(a.witness);
    const rows = readMemories(a.memory, a.witness.id, 5);
    assert.equal(rows.length, 1); assert.equal(rows[0].kind, 'witnessed'); assert.equal(rows[0].about, 'player');
    const group = readMemories(a.memory, groupHolder('v'), 5);
    assert.equal(group[0].kind, 'impression');
    validateMemory(JSON.parse(JSON.stringify(a.memory)), 5);
    assert.equal(recalledPhrase({memory: a.memory, holder: a.witness.id, subject: 'player', day: 50}), 'Saw that you interrupted his counting at the bench.');
    const again = witnessScene({...args, memory: a.memory});
    assert.deepEqual(readMemories(again.memory, a.witness.id, 5), rows, 'the same scene does not write twice');
    const view = witnessView({memory: a.memory, place: 'v', subject: 'player', day: 5, root: 11, nameOf: (s, id) => 'N' + s, lineOf: () => ''});
    assert.equal(view.witnesses[0].id, a.witness.id); assert.ok(view.group.count >= 1);
    // a later scene merges the impression instead of duplicating it
    const later = witnessScene({...args, memory: a.memory, fact: fact + 'x', day: 6, minute: base.minute + 1440});
    assert.equal(readMemories(later.memory, groupHolder('v'), 6).filter(e => e.kind === 'impression').length, 1);
});

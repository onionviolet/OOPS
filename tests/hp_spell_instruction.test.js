import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld} from '../src/engine_world.js';
import {recordsOf} from '../src/knowledge_record.js';
import {sharedEffect} from '../src/spell_effects.js';
import {SPELL_EFFECT_LAW} from '../src/spell_law.js';
import {WORLD_PROPERTIES} from '../src/world_quantities.js';
import {demonstrateSummoning, recordSummoningTrial, repeatSummoning, retrySummoning, teachSummoning} from '../src/world_packs/hp_spell_instruction.js';

const config = {
    packs: ['n.knowledge'],
    shared: {properties: [...Object.values(WORLD_PROPERTIES), {id: 'summoning_instructor', type: 'flag'}],
        quantities: [{id: 'stamina', unit: 'effort', min: 0, max: 10}]},
    host: {laws: [SPELL_EFFECT_LAW], effects: {read: sharedEffect}, costs: {accounts: {stamina: {quantity: 'stamina'}}}},
};
const save = serializeEngineWorld;
const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(save(engine))), config);
const advance = (engine, at) => {
    const result = advanceEngineWorld(engine, at);
    assert.equal(result.pending, false);
    return result.engine;
};
const caster = id => ({id, kind: 'body', place: 'desk', quantities: {stamina: 10}});
const object = (id, place, marks = []) => ({id, kind: 'thing', as: ['object'], place, properties: {marks}});

test('a second caster learns a saved Accio form and records a paid failure under changed reach', () => {
    let engine = createEngineWorld({...config, holders: [
        ...['desk', 'shelf', 'bench'].map(id => ({id, kind: 'place'})),
        {...caster('teacher'), properties: {summoning_instructor: true}}, caster('student'),
        object('teacher-wand', 'desk', ['grip:teacher']), object('student-wand', 'desk', ['grip:student']),
        object('chalk', 'shelf'), object('cup', 'shelf'), object('weight', 'shelf'),
    ], links: [
        {id: 'desk-window', kind: 'sightline', from: 'desk', to: 'shelf'},
        {id: 'bench-window', kind: 'sightline', from: 'bench', to: 'shelf'},
    ]});
    const first = {id: 'demonstration', wand: 'teacher-wand', target: 'chalk'};
    const second = {id: 'student-first', wand: 'student-wand', target: 'cup'};
    assert.throws(() => repeatSummoning(engine, 'student', second), /Study the written form/);
    assert.throws(() => teachSummoning(engine, 'teacher', 'student'), /written form/);
    engine = demonstrateSummoning(engine, 'teacher', first);
    assert.throws(() => recordSummoningTrial(engine, 'teacher', first.id), /settled and paid/);
    engine = recordSummoningTrial(restore(advance(engine, 1)), 'teacher', first.id);
    engine = restore(teachSummoning(restore(engine), 'teacher', 'student'));
    const form = recordsOf(engine.world, 'student')['hp.summoning.v1'];
    assert.equal(form.source.kind, 'instruction');
    assert.equal(form.source.by, 'teacher');

    engine = repeatSummoning(engine, 'student', second);
    const atBench = applyEngineOps(engine, [
        {op: 'move', holder: 'student', to: 'bench'}, {op: 'move', holder: 'student-wand', to: 'bench'},
    ], 'rebind-before-release');
    const success = advance(restore(atBench), 2);
    assert.deepEqual(save(success), save(advance(atBench, 2)));
    assert.equal(success.world.holders.cup.place, 'bench');
    assert.equal(success.world.holders.student.quantities.stamina, 8);

    const third = {id: 'student-repeat', wand: 'student-wand', target: 'weight'};
    const pending = repeatSummoning(success, 'student', third);
    const obstructed = applyEngineOps(pending, [{op: 'link_set', id: 'bench-window', state: 'closed'}], 'shutter-closes');
    const missed = advance(restore(obstructed), 3);
    assert.equal(missed.world.holders.weight.place, 'shelf');
    assert.equal(missed.world.holders.student.quantities.stamina, 6);
    assert.equal(missed.world.holders.teacher.quantities.stamina, 8);
    assert.match(missed.records.workings[third.id].landed[0].reason, /no clear path/);

    const report = restore(recordSummoningTrial(missed, 'student', third.id));
    const learned = recordsOf(report.world, 'student');
    assert.deepEqual(learned['hp.summoning.v1'], form);
    assert.deepEqual(learned['trial:student-repeat'].believed.fillers, {
        method: 'hp.summoning.v1', target: 'weight', outcome: 'failed',
    });
    assert.equal(recordsOf(report.world, 'teacher')['trial:demonstration'].believed.fillers.outcome, 'worked');

    const reopened = applyEngineOps(report, [{op: 'link_set', id: 'bench-window', state: 'open'}], 'shutter-opens');
    const retry = {id: 'student-retry', from: third.id, wand: third.wand};
    assert.throws(() => retrySummoning(missed, 'student', retry), /Recall a failed trial/);
    const recovered = recordSummoningTrial(advance(restore(retrySummoning(reopened, 'student', retry)), 4), 'student', retry.id);
    assert.equal(recovered.world.holders.weight.place, 'bench');
    assert.equal(recovered.world.holders.student.quantities.stamina, 4);
    const history = recordsOf(restore(recovered).world, 'student');
    assert.equal(history['trial:student-retry'].believed.fillers.outcome, 'worked');
    assert.equal(history['trial:student-repeat'].believed.fillers.outcome, 'failed');
});

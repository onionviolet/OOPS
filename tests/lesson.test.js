import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonAvailability, lessonEffects} from '../src/lesson.js';
import {beDivMethodLearnEffects} from '../src/book_world_lotm_divination_method.js';
import {TEACHER_WINDOW} from '../src/everyday_life.js';

test('lesson availability follows the window and the first blocker', () => {
    assert.equal(lessonAvailability(TEACHER_WINDOW, 479).available, false);
    assert.equal(lessonAvailability(TEACHER_WINDOW, 480).available, true);
    const r = lessonAvailability(TEACHER_WINDOW, 600, [[false, 'a'], [true, 'away']]);
    assert.deepEqual([r.available, r.cause], [false, 'away']);
});
test('lesson effects: fact always, xp step only when asked', () => {
    const e = lessonEffects({key: 'k', value: 'v', situationId: 's', teacherId: 't', skill: 'Flying', xp: 3});
    assert.deepEqual(e.map(x => x.type), ['knowledge', 'xp']);
    assert.equal(e[0].basis.attributedTo, 't');
    assert.equal(lessonEffects({key: 'k', value: 'v', situationId: 's'}).length, 1);
});
test('Old Neil divination lesson replays the same effect shape', () => {
    assert.deepEqual(beDivMethodLearnEffects('pendulum', 'Old Neil showed you the swing.', 'sit'),
        [{type: 'knowledge', actor: 'player', key: 'book.lotm.div.method.pendulum', stage: 'understood', value: 'Old Neil showed you the swing.',
            basis: {kind: 'instruction', attributedTo: 'player', situationId: 'sit'}}]);
});

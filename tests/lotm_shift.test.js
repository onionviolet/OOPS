// Klein's office shift (book_world_lotm_shift.js): one a day in its hours, a seeded result line, counted for the pay week, never gating pay.
import test from 'node:test';
import assert from 'node:assert/strict';
import {shiftView, shiftEffects, SHIFT_KINDS, SHIFT_DAY_FACT, SHIFT_WEEK_FACT, SHIFT_COUNT_FACT, SHIFT_NOTE} from '../src/book_world_lotm_shift.js';
import {WAGE_CONTRACT_NOTE, WAGE_START_NOTE, WAGE_WEEK} from '../src/book_world_lotm_wage.js';

const life = ({clock = 0, facts = {}, start} = {}) => ({clock, actors: {player: {worldId: 'book.lotm.tingen', facts}}, simulation: {seed: 7,
    knowledge: {player: {[WAGE_CONTRACT_NOTE]: {at: 0}, ...(start == null ? {} : {[WAGE_START_NOTE]: {at: start}})}}}});
const fact = (effects, key) => effects.find(e => e.key === key)?.value;

test('only a life with the Nighthawk contract has office hours; each shift opens in its own hours', () => {
    assert.equal(shiftView({clock: 0, actors: {player: {worldId: 'book.lotm.tingen'}}, simulation: {knowledge: {player: {}}}}, {day: 3, hour: 10}), null);
    const at = hour => Object.fromEntries(shiftView(life(), {day: 3, hour}).kinds.map(k => [k.id, k.eligible]));
    assert.deepEqual(at(10), {desk: true, archive: true, gate: false});
    assert.deepEqual(at(14), {desk: false, archive: true, gate: false});
    assert.deepEqual(at(20), {desk: false, archive: false, gate: true});
    assert.match(shiftView(life(), {day: 3, hour: 7}).kinds[0].reason, /starts between 9:00 and 13:00/);
});

test('a shift takes its hours, leaves a line, counts for the pay week, and the office keeps one a day', () => {
    const one = shiftEffects(life({clock: 10, start: 0}), 'archive', {day: 3, hour: 10});
    assert.equal(one.minutes, SHIFT_KINDS.archive.minutes);
    assert.deepEqual([fact(one.effects, SHIFT_DAY_FACT), fact(one.effects, SHIFT_WEEK_FACT), fact(one.effects, SHIFT_COUNT_FACT)], [3, 0, 1]);
    assert.match(one.line, /one shift this pay week\.$/);
    assert.ok(one.effects.some(e => e.type === 'knowledge' && e.key === SHIFT_NOTE));
    assert.ok(!one.effects.some(e => e.type === 'resource' || e.key === 'money'), 'a shift pays nothing on its own: the wage is the salary');
    const done = life({clock: 10, start: 0, facts: {[SHIFT_DAY_FACT]: 3, [SHIFT_WEEK_FACT]: 0, [SHIFT_COUNT_FACT]: 1}});
    assert.throws(() => shiftEffects(done, 'desk', {day: 3, hour: 10}), /already worked a shift today/);
    assert.match(shiftEffects(done, 'desk', {day: 4, hour: 10}).line, /2 shifts this pay week/);
    const nextWeek = life({clock: WAGE_WEEK + 10, start: 0, facts: {[SHIFT_DAY_FACT]: 3, [SHIFT_WEEK_FACT]: 0, [SHIFT_COUNT_FACT]: 5}});
    assert.match(shiftEffects(nextWeek, 'gate', {day: 10, hour: 20}).line, /one shift this pay week/, 'a new pay week starts the count again');
    assert.equal(shiftEffects(life(), 'desk', {day: 3, hour: 10, seed: 7}).line, shiftEffects(life(), 'desk', {day: 3, hour: 10, seed: 7}).line, 'the same day and seed give the same line');
});

test('player words carry no source notes (PRS1)', () => {
    for(const [id, k] of Object.entries(SHIFT_KINDS)) assert.doesNotMatch(`${k.label} ${k.say}`, /Stated|authored|\bch\d/i, id);
});

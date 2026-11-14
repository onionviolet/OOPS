// Klein's weekly wage after the story window (book_world_lotm_wage.js): canon terms, half kept until the advance is repaid, one draw per closed week.
import test from 'node:test';
import assert from 'node:assert/strict';
import {wageView, wageStartEffects, wageCollectEffects, WAGE_WEEK, WAGE_START_NOTE, WAGE_PAID_FACT, WAGE_CONTRACT_NOTE, WAGE_ADVANCE_NOTE} from '../src/book_world_lotm_wage.js';

const life = ({clock = 0, start, paid, advance = true} = {}) => ({clock, actors: {player: {worldId: 'book.lotm.tingen', facts: paid == null ? {} : {[WAGE_PAID_FACT]: paid}}},
    simulation: {knowledge: {player: {[WAGE_CONTRACT_NOTE]: {at: 2088}, ...(advance ? {[WAGE_ADVANCE_NOTE]: {at: 2164}} : {}), ...(start == null ? {} : {[WAGE_START_NOTE]: {at: start}})}}}});
const money = effects => effects.filter(e => e.type === 'resource' || e.key === 'money').reduce((n, e) => n + e.amount, 0);

test('only a life holding the Nighthawk contract draws this wage, and it starts once', () => {
    assert.equal(wageView({clock: 0, actors: {player: {worldId: 'book.lotm.tingen'}}, simulation: {knowledge: {player: {}}}}), null);
    assert.equal(wageView({...life(), actors: {player: {worldId: 'book.ri.lead.world'}}}), null);
    const v = wageView(life());
    assert.deepEqual([v.started, v.weeklyPence, v.advanceLeft], [false, 720, 2880]);
    assert.ok(wageStartEffects(life()).some(e => e.key === WAGE_START_NOTE));
    assert.throws(() => wageStartEffects(life({start: 0, paid: 0})), /already/);
});

test('a week pays when it closes; half is kept for eight weeks, then the full three pounds', () => {
    assert.throws(() => wageCollectEffects(life({clock: WAGE_WEEK - 1, start: 0, paid: 0})), /Nothing to collect yet/);
    const one = wageCollectEffects(life({clock: WAGE_WEEK, start: 0, paid: 0}));
    assert.equal(money(one.effects), 360);
    assert.ok(one.effects.some(e => e.key === WAGE_PAID_FACT && e.value === 1), 'progress is a SET to the closed weeks, so a replay cannot pay twice');
    assert.match(one.line, /1 pound 10 soli.*kept 1 pound 10 soli.*10 pounds 10 soli still owed/);
    const nine = wageCollectEffects(life({clock: 9 * WAGE_WEEK, start: 0, paid: 1}));
    assert.equal(money(nine.effects), 7 * 360 + 720, 'weeks 2-8 at half, week 9 in full');
    assert.match(nine.line, /now repaid/);
    const later = wageView(life({clock: 10 * WAGE_WEEK, start: 0, paid: 9}));
    assert.deepEqual([later.owedWeeks, later.net, later.kept, later.advanceLeft], [1, 720, 0, 0]);
});

test('without an advance slip the whole wage is handed over', () => {
    const c = wageCollectEffects(life({clock: 2 * WAGE_WEEK, start: 0, paid: 0, advance: false}));
    assert.equal(money(c.effects), 1440);
    assert.doesNotMatch(c.line, /advance/);
});

// Fang Yuan's ordinary day: the meal clock his day extension reads (ri_lead_day_facts.js) and the extension's shape.
// The played journey on his ch140 save is in ri_lead_day_journey.test.js (slow tier).
import test from 'node:test';
import assert from 'node:assert/strict';
import {riLeadDayFacts, RI_DAY_DIETS, RI_DAY_DIALS, RI_LEAD_DAY} from '../src/ri_lead_day_facts.js';
import {guLeadDay} from '../src/world_packs/book_gu_lead_day.js';

const life = (clock, fed = {}) => ({clock, actors: {player: {worldId: 'book.ri.lead.world'}},
    simulation: {knowledge: {player: Object.fromEntries(Object.entries(fed).map(([slot, at]) => [`${RI_LEAD_DAY}.fed.${slot}`, {at}]))}}});
const f = (state, slot, k) => riLeadDayFacts(state)[`${RI_LEAD_DAY}.${slot}.${k}`];

test('a Gu never fed through the day is due and hungry, so the first day starts with a meal', () => {
    for(const d of RI_DAY_DIETS) {assert.equal(f(life(0), d.slot, 'due'), true); assert.equal(f(life(0), d.slot, 'hungry'), true);}
});

test('the Moonglow eats morning and evening: refused just after a meal, due after six hours, hungry after a missed meal', () => {
    const fedAt = 10_000;
    assert.equal(f(life(fedAt + 60, {moonglow: fedAt}), 'moonglow', 'due'), false);
    assert.equal(f(life(fedAt + 7 * 60, {moonglow: fedAt}), 'moonglow', 'due'), true);
    assert.equal(f(life(fedAt + 7 * 60, {moonglow: fedAt}), 'moonglow', 'hungry'), false);
    assert.equal(f(life(fedAt + 13 * 60, {moonglow: fedAt}), 'moonglow', 'hungry'), true);
});

test('the Liquor Worm\'s jar lasts four days and the White Jade\'s parcel twenty (canon rows)', () => {
    assert.equal(f(life(3 * 1440, {worm: 0}), 'worm', 'hungry'), false);
    assert.equal(f(life(4 * 1440 + 1, {worm: 0}), 'worm', 'hungry'), true);
    assert.equal(f(life(19 * 1440, {jade: 0}), 'jade', 'hungry'), false);
    assert.equal(f(life(20 * 1440 + 1, {jade: 0}), 'jade', 'hungry'), true);
});

test('other lives never see the day\'s facts', () => {
    assert.deepEqual(riLeadDayFacts({clock: 0, actors: {player: {worldId: 'book.ri.keeper.world'}}}), {});
});

test('the extension pays real costs and the patrol reads both the hunger fact and the sea', () => {
    const cmd = name => guLeadDay.commands.find(c => c.id === `${RI_LEAD_DAY}.${name}`);
    assert.ok(guLeadDay.commands.every(c => c.once === false && c.duration > 0), 'every day verb repeats and takes time');
    const patrol = JSON.stringify(cmd('patrol').requires);
    assert.match(patrol, /book\.ri\.lead\.day\.moonglow\.hungry/);
    assert.match(patrol, /energy\.book\.ri\.lead\.primeval\.reserve/);
    assert.deepEqual(cmd('buy_petals').costs, [{type: 'item', actor: 'player', key: JSON.stringify({id: 'book.ri.lead.refinement.primeval_stone'}), amount: -RI_DAY_DIALS.petalBag.stones}]);
    assert.ok(cmd('feed_moonglow').costs.some(c => c.key === JSON.stringify({id: 'book.ri.lead.dorm.petals'}) && c.amount === -2));
});

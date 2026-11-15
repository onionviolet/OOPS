// Directions B and D (adopted 2026-11-14; PS53, PS57): the status line's reserve words and the ready-now rows.
import test from 'node:test';
import assert from 'node:assert/strict';
import {reserveWords} from '../src/ui/status_line.js';
import {orderReady, readyUsing, registerReady, collectReady} from '../src/ready_rows.js';
import {hubModel} from '../src/ui/ready_hub.js';
import {guCareRows, heldIn, craftingRowsFrom} from '../src/ready_sources.js';
import {RI_DAY_DIETS} from '../src/ri_lead_day_facts.js';

test('the reserve reads the life\'s own pools, at most two, and nothing when it has none', () => {
    assert.equal(reserveWords([{label: 'Green-copper primeval essence', reserve: 30, capacity: 44}]), 'Green-copper primeval essence 30/44');
    assert.equal(reserveWords([]), '');
    assert.equal(reserveWords([{label: 'A', reserve: 1, capacity: 2}, {label: 'B', reserve: 0, capacity: 3}, {label: 'C', reserve: 1, capacity: 1}]), 'A 1/2 · B 0/3');
    assert.equal(reserveWords([{label: 'Broken', reserve: 1, capacity: 0}]), '', 'a pool with no capacity says nothing');
});

test('ready rows order across features: ready first, urgent on top, then near with its gap; rest is counted', () => {
    const rows = orderReady([
        ['crafting', [{id: 'wool', label: 'Make Wool cloth', state: 'near', gap: 'needs 2 Wool'}, {id: 'string', label: 'Make Sinew string', state: 'ready'}, {id: 'far', label: 'Make Boar trophy', state: 'rest'}], 'Crafting'],
        ['gu-care', [{id: 'moonglow', label: 'Feed the Moonglow Gu', state: 'ready', urgent: true}], 'Your Gu'],
        ['junk', [null, {label: '', state: 'ready'}, {label: 'x', state: 'maybe'}], 'Junk'],
    ]);
    assert.deepEqual(rows.map(r => r.label), ['Feed the Moonglow Gu', 'Make Sinew string', 'Make Wool cloth', 'Make Boar trophy']);
    assert.equal(rows[2].gap, 'needs 2 Wool');
    const m = hubModel(rows);
    assert.equal(m.head, 'Ready now · 2 ready · 1 close'); assert.equal(m.counts.rest, 1);
    assert.deepEqual(m.shown.map(r => r.label), ['Feed the Moonglow Gu', 'Make Sinew string', 'Make Wool cloth']);
    assert.equal(hubModel(orderReady([['c', [{id: 'f', label: 'Far', state: 'rest'}], 'C']])).empty, true, 'only further-off rows: no block');
});

test('two features naming one act merge into one row that keeps the act, the urgency and the panel\'s own wording', () => {
    const act = () => 'fed';
    const rows = orderReady([
        ['life-day', [{id: 'feed_moonglow', label: 'Feed the Moonglow Gu · two Moon Orchid petals', state: 'ready', act, detail: '5 min'}], 'Your day'],
        ['gu-care', [{id: 'moonglow', label: 'Feed the Moonglow Gu', state: 'ready', urgent: true, detail: 'missed a meal', uses: ['Moon Orchid petals']}], 'Your Gu'],
    ]);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].urgent, true);
    assert.equal(rows[0].act, act);
    assert.deepEqual(rows[0].uses, ['Moon Orchid petals']);
});

test('the hub caps ready and near rows and names how many more there are', () => {
    const many = Array.from({length: 8}, (_, i) => ({id: `r${i}`, label: `Ready ${i}`, state: 'ready'}));
    const near = Array.from({length: 5}, (_, i) => ({id: `n${i}`, label: `Near ${i}`, state: 'near', gap: 'one short'}));
    const rows = orderReady([['s', [...many, ...near], 'S']]);
    const m = hubModel(rows);
    assert.equal(m.shown.length, 8); assert.equal(m.hidden, 5);
    assert.equal(hubModel(rows, {expanded: true}).shown.length, 13);
});

test('PS55: rows that use what was just gained are found by name', () => {
    const rows = orderReady([['c', [{id: 'a', label: 'Make Wool cloth', state: 'near', gap: 'needs 1 Wool', uses: ['Wool']}, {id: 'b', label: 'Make Rope', state: 'ready', uses: ['Flax']}], 'C']]);
    assert.deepEqual(readyUsing(['wool'], rows).map(r => r.id), ['a']);
    assert.deepEqual(readyUsing([], rows), []);
});

test('a source that throws shows nothing and never breaks the list', () => {
    const off = registerReady({id: 'test-throws', rows: () => { throw Error('mid-load'); }});
    try { assert.doesNotThrow(() => collectReady()); } finally { off(); }
});

const moonglow = RI_DAY_DIETS.find(d => d.slot === 'moonglow');
const leadState = ({fedAt = null, clock = 10_000} = {}) => ({clock, actors: {player: {worldId: 'book.ri.lead.world', facts: {}}},
    simulation: {knowledge: {player: fedAt == null ? {} : {[moonglow.fed]: {at: fedAt}}}, owners: {player: {}}}});

test('Gu care: a missed meal is urgent; with too little food the gap names it, held from the hero\'s own pack', () => {
    const pack = {[JSON.stringify({id: moonglow.gu})]: 1, [JSON.stringify({id: moonglow.food, quality: 100})]: 1};
    const [row] = guCareRows(leadState(), pack, () => true);
    assert.equal(row.label, 'Feed the Moonglow Gu');
    assert.equal(row.state, 'near'); assert.equal(row.urgent, true);
    assert.equal(row.gap, `needs ${moonglow.perMeal} ${moonglow.foodLabel}; you have 1`);
    const fed = {...pack, [JSON.stringify({id: moonglow.food})]: 5};
    assert.equal(guCareRows(leadState(), fed, () => true)[0].state, 'ready');
    assert.deepEqual(guCareRows(leadState(), fed, () => false), [], 'without the life panel\'s rows, a fed-able Gu is left to its own Feed button');
    assert.deepEqual(guCareRows(leadState(), {}), [], 'a Gu not held is not asked for');
    assert.deepEqual(guCareRows(leadState({fedAt: 9_990}), pack), [], 'a Gu fed just now is not hungry');
    assert.deepEqual(guCareRows({...leadState(), actors: {player: {worldId: 'base.frontier'}}}, pack), [], 'other lives never see his Gu');
    assert.equal(heldIn({}, {[JSON.stringify({id: 'x'})]: 3}, 'x'), 3, 'a life\'s own stock counts when the pack holds none');
});

test('crafting rows read the recipe rows\' own readiness marks', () => {
    const row = (label, text, ready) => {
        const r = {getAttribute: () => `${label}; output ×1; x`, click() {}, scrollIntoView() {}};
        return {closest: () => r, parentElement: r, textContent: text, dataset: {ready: String(ready)}};
    };
    const rows = craftingRowsFrom([row('Sinew string', '3 ready', true), row('Wool cloth', 'needs 2 Wool', false), row('Boar trophy', '2 of 3 materials short', false), row('Bonemeal', 'needs 20 animal tooth', false)], t => t === 'animal tooth' ? ['Rat fang'] : []);
    assert.deepEqual(rows.map(r => [r.label, r.state, r.gap || r.detail]), [['Make Sinew string', 'ready', '3 ready'], ['Make Wool cloth', 'near', 'needs 2 Wool'], ['Make Boar trophy', 'rest', ''], ['Make Bonemeal', 'near', 'needs 20 animal tooth']]);
    assert.deepEqual(rows[3].uses, ['animal tooth', 'Rat fang'], 'a line naming the item points at the recipe asking for its type');
    assert.deepEqual(rows[1].uses, ['Wool']);
});

test('PS55: a Reports line that names what a row uses gets that row as its next step, by whole words', async () => {
    const {nextFor} = await import('../src/ui/next_steps.js');
    const rows = orderReady([['c', [
        {id: 'feed', label: 'Feed the Moonglow Gu', state: 'ready', uses: ['Moon Orchid petals']},
        {id: 'wool', label: 'Make Wool cloth', state: 'near', gap: 'needs 1 Wool', uses: ['Wool']},
        {id: 'far', label: 'Make Boar trophy', state: 'rest', uses: ['Boar tusk']}]]]);
    assert.deepEqual(nextFor('You buy 8 Moon Orchid petals from the steward.', rows).map(r => r.id), ['feed']);
    assert.deepEqual(nextFor('Gathered 2 wool.', rows).map(r => r.id), ['wool']);
    assert.deepEqual(nextFor('Your woollen cloak is warm.', rows), [], 'part of a word is not a match');
    assert.deepEqual(nextFor('Found a boar tusk.', rows), [], 'further-off rows are not offered');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {boardFor, resolveCause, questView, validateNeed} from '../src/quest_generator.js';
import {wantNeeds, debtNeeds} from '../src/quest_needs.js';

const person = (id, item, extra = {}) => ({id, name: id.toUpperCase(), role: 'hill courier', met: true, status: 'visiting',
    goal: {item, quantity: 2, reward: 5, fulfilled: false}, possessions: {coins: 9, supplies: {}}, ...extra});
const owed = {rows: [{id: 'credit:counting_house', kind: 'coin', debtor: 'player', creditor: 'counting_house', amount: 40, why: 'Loan from the Counting-House'}],
    live: {'credit:counting_house': {due: {daysLeft: 2, overdue: false}}}, labels: {counting_house: 'the Counting-House'}};

test('same seed and needs give the same board', () => {
    const needs = wantNeeds([person('a', 'Coal'), person('b', 'Rough wood log')], {world: 'village'});
    assert.deepEqual(boardFor({worldSeed: 7, world: 'village', day: 3, needs}), boardFor({worldSeed: 7, world: 'village', day: 3, needs}));
});

test('every quest cites a cause that resolves to a live need', () => {
    const needs = [...wantNeeds([person('a', 'Coal')], {world: 'village'}), ...debtNeeds(owed, {world: 'village'})];
    const board = boardFor({worldSeed: 7, world: 'village', day: 0, needs});
    assert.equal(board.length, 2);
    for(const q of board) { assert.ok(resolveCause(q, needs)); assert.ok(q.cause.why.length > 0); }
    assert.deepEqual(questView(board[0]).route, board[0].route);
});

test('no real need gives no quest, and a changed need changes the quest', () => {
    assert.deepEqual(boardFor({worldSeed: 1, world: 'lotm', day: 0, needs: []}), []);
    assert.deepEqual(wantNeeds([person('a', 'Coal', {goal: {item: 'Coal', quantity: 1, reward: 5, fulfilled: true}})]), []);
    assert.deepEqual(wantNeeds([person('a', 'Coal')], {pending: ['a']}), []);
    const a = boardFor({worldSeed: 1, world: 'village', day: 0, needs: wantNeeds([person('a', 'Coal')], {world: 'village'})});
    const b = boardFor({worldSeed: 1, world: 'village', day: 0, needs: wantNeeds([person('a', 'Survey rope')], {world: 'village'})});
    assert.notEqual(a[0].id, b[0].id);
});

test('overdue debt outranks a traveler want; the board respects the dial and the world', () => {
    const late = {...owed, live: {'credit:counting_house': {due: {daysLeft: -1, overdue: true}}}};
    const needs = [...wantNeeds([person('a', 'Coal'), person('b', 'Coal')], {world: 'lotm'}), ...debtNeeds(late, {world: 'lotm'})];
    const board = boardFor({worldSeed: 2, world: 'lotm', day: 10, needs, dial: {limit: 1, jitter: 0}});
    assert.equal(board.length, 1); assert.equal(board[0].cause.kind, 'debt');
    assert.deepEqual(boardFor({worldSeed: 2, world: 'village', day: 10, needs}), []);
    assert.throws(() => validateNeed({ref: 'x', kind: 'nope', urgency: 0, label: 'a', why: 'b', route: {verb: 'v'}}));
});

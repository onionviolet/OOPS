import test from 'node:test';
import assert from 'node:assert/strict';
import {freshAging, stepAging, treat, severityOf, careOwed, knownNeighbour, creditTerms, CHRONIC, CREDIT, DAY, TREAT_SEASON} from '../src/aging_contact.js';
import * as standing from '../src/economy_standing.js';
import {validateObligations} from '../src/obligations_ledger.js';
import {owedLedgerView, gatherOwed} from '../src/owed_ledger_view.js';

const aged = () => {
    let s = freshAging(), clock = 44 * 365 * DAY;
    for(let age = 44; age < 66; age++) {s = stepAging(s, {age, clock, minutes: 365 * DAY, worldId: 'base.frontier', inVillage: false}).state;clock += 365 * DAY;}
    return {s, clock, cost: 8 * (severityOf(CHRONIC[0], s.conditions.joints) + 1)};
};
const roundTrip = st => standing.migrateStanding(JSON.parse(JSON.stringify(st)));

test('a short purse rides on credit: coins untouched, one owed row, kept through save and load of the economy slice', () => {
    const {s, clock, cost} = aged();
    const r = treat(s, 'joints', clock, 0, {owed: 0, known: true, now: clock});
    assert.equal(r.paid, 0);assert.equal(r.cost, cost);
    assert.equal(r.state.conditions.joints.treatedUntil, clock + TREAT_SEASON);
    assert.equal(r.obligation.amount, cost);assert.equal(r.obligation.creditor, 'healer');
    const {state, id} = standing.owe(standing.fresh(), r.obligation, clock);
    const loaded = roundTrip(state);
    validateObligations(loaded.ledger);standing.validateStanding(loaded);
    assert.deepEqual(loaded.ledger.rows.map(x => [x.id, x.amount]), [[id, cost]]);
    assert.equal(careOwed(loaded.ledger.rows), cost);
    const view = owedLedgerView(gatherOwed({standing: {ledger: loaded.ledger.rows, now: clock}}));
    assert.match(view.rows[0].effect, /^You owe the healer \d+ coins/);
});

test('over the limit is refused with nothing changed: a stranger gets the small limit, a neighbour the larger', () => {
    const {s, clock, cost} = aged();
    assert.ok(cost > CREDIT.min && 2 * cost > CREDIT.known, 'fixture: one course exceeds a stranger limit, two exceed a neighbour limit');
    const first = treat(s, 'joints', clock, 0, {owed: 0, known: true, now: clock});
    const ledger = standing.owe(standing.fresh(), first.obligation, clock).state, owed = careOwed(ledger.ledger.rows);
    const before = JSON.stringify([s, ledger]);
    assert.throws(() => treat(s, 'joints', clock, 0, {owed, known: true, now: clock}), /will not wait/);
    assert.throws(() => treat(s, 'joints', clock, 0, {owed: 0, known: false, now: clock}), /will not wait/);
    assert.equal(JSON.stringify([s, ledger]), before);
    assert.deepEqual([creditTerms({owed, known: false}).limit, creditTerms({owed, known: true}).limit], [CREDIT.min, CREDIT.known]);
});

test('a full purse still pays coins, with no debt row; without a ledger a short purse is refused as before', () => {
    const {s, clock, cost} = aged();
    const r = treat(s, 'joints', clock, 500, {owed: 0, known: false, now: clock});
    assert.equal(r.paid, cost);assert.equal(r.obligation, null);
    assert.throws(() => treat(s, 'joints', clock, 1), /A course of care costs \d+ coins/);
});

test('two visits in the same minute keep two rows; an old save loads unchanged; undo removes only the care row', () => {
    const {s, clock} = aged();
    const row = treat(s, 'joints', clock, 0, {owed: 0, known: true, now: clock}).obligation;
    const a = standing.owe(standing.fresh(), row, clock), b = standing.owe(a.state, row, clock);
    assert.notEqual(a.id, b.id);assert.equal(b.state.ledger.rows.length, 2);
    assert.equal(standing.dropCareDebt(b.state, b.id, clock).ledger.rows.length, 1);
    const old = JSON.parse(JSON.stringify(standing.fresh()));
    assert.deepEqual(standing.migrateStanding(old), old);
    assert.throws(() => standing.owe(standing.fresh(), {...row, id: 'credit:x'}, clock), /care debt/);
});

test('known neighbour reads the Village standing tier', () => {
    assert.equal(knownNeighbour([{id: 'market_circle', tier: {id: 'friendly'}}]), true);
    assert.equal(knownNeighbour([{id: 'market_circle', tier: {id: 'neutral'}}]), false);
    assert.equal(knownNeighbour(undefined), false);
});

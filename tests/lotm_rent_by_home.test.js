// Rent follows the home (P7): the old flat's 5 soli 6 pence until the move, then 2 Daffodil Street's 12 soli 3 pence, on one duty id,
// so the standing order, its arrears and the collector read the week of the home he lives in now.
import test from 'node:test';
import assert from 'node:assert/strict';
import {LOTM_RENT, LOTM_RENT_ID, LOTM_MOVED_FACT, lotmRentDefs} from '../src/book_world_lotm_duties.js';
import {registerDutySet} from '../src/duties_domain.js';
import {domainRegistry} from '../src/domain_registry.js';

const WEEK = 10080;
test('the rent def is the old flat until the move, then Daffodil Street, under the same id', () => {
    const flat = lotmRentDefs(LOTM_RENT, {actors: {player: {facts: {}}}}), daffodil = lotmRentDefs(LOTM_RENT, {actors: {player: {facts: {[LOTM_MOVED_FACT]: true}}}});
    assert.deepEqual([flat[0].id, flat[0].dues.amount], [LOTM_RENT_ID, 66]);
    assert.deepEqual([daffodil[0].id, daffodil[0].dues.amount], [LOTM_RENT_ID, 147]);
    assert.match(daffodil[0].why, /2 Daffodil Street.*12 soli 3 pence/);
    assert.equal(daffodil[0].policy, flat[0].policy, 'the same standing order and its choices');
});

test('the standing order debits the week of the home he lives in, and the item says how much', () => {
    let clock = 0, moved = false, purse = 10000; const paid = [];
    registerDutySet('rent_by_home', {defs: LOTM_RENT, resolve: lotmRentDefs, state: () => ({clock, actors: {player: {facts: moved ? {[LOTM_MOVED_FACT]: true} : {}}}}),
        active: () => true, minute: s => s.clock, purse: {balance: () => purse, pay: amount => { purse -= amount; paid.push(amount); }}});
    clock = 10; domainRegistry.load({}); domainRegistry.tick(1);
    clock += WEEK; domainRegistry.tick(1);
    moved = true; clock += WEEK; domainRegistry.tick(1);
    assert.deepEqual(paid, [66, 147], 'a week at the old flat, then a week at Daffodil Street');
    clock += WEEK - 60; domainRegistry.tick(1);
    assert.equal(domainRegistry.project('duties').items.find(i => i.id === LOTM_RENT_ID)?.amount, 147, 'the item carries the week the household and the collector read');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {feeOn, changeFor, coinBreakdown, penceLabel, roundToGrain, isGrained} from '../src/currency_subunits.js';
import {setPurse, addPurse, resetMoneyLedger, moneyLedger, bindMoneyGrain as bindGrainForSeam} from '../src/economy_domain.js';
import {localMoneyLabel} from '../src/ui/local_money_label.js';
import {defineCastExchanges} from '../src/cast_exchange_adapter.js';

test('a 0.5% fee on a small sum rounds up to a halfpenny, never to zero', () => {
  assert.equal(feeOn(24, 0.005, 2), 0.5);      // 0.12 pence -> one halfpenny
  assert.equal(feeOn(240, 0.005, 2), 1.5);     // 1.2 pence -> 1.5, charged once on the sum
});
test('fee rounding is a dial', () => {
  assert.equal(feeOn(240, 0.005, 2, 'up'), 1.5);
  assert.equal(feeOn(240, 0.005, 2, 'nearest'), 1);
  assert.equal(roundToGrain(1.2, 2, 'down'), 1);
  assert.equal(feeOn(240, 0.005, 1, 'up'), 2);
  assert.equal(feeOn(0, 0.005, 2), 0);
});
test('change conserves every grain', () => {
  assert.equal(changeFor(10, 3.5, 2), 6.5);
  assert.equal(3.5 + changeFor(10, 3.5, 2), 10);
  assert.throws(() => changeFor(10, 3.25, 2));
  assert.throws(() => changeFor(3, 4, 2));
});
test('coin breakdown: halfpenny, penny, soli, pound', () => {
  assert.deepEqual(coinBreakdown(1.5, 2), {penny: 1, halfpenny: 1});
  assert.deepEqual(coinBreakdown(252.5, 2), {pound: 1, soli: 1, halfpenny: 1});
  assert.deepEqual(coinBreakdown(4, 2), {penny: 4});
});
test('labels show halfpence and keep whole-number lines', () => {
  assert.equal(penceLabel(1), '1 penny');
  assert.equal(penceLabel(2760), '2760 pence');
  assert.equal(penceLabel(3.5), '3½ pence');
  assert.equal(penceLabel(0.5), '½ penny');
  assert.equal(localMoneyLabel(1.5, 'book.lotm.tingen'), '1½ pence');
  assert.equal(localMoneyLabel(5, 'other'), null);
});
test('purse seam: whole-number money unchanged, halfpence allowed, finer grain rejected', () => {
  resetMoneyLedger(); bindGrainForSeam(() => 2);
  const h = {money: 2760};
  addPurse(h, -27, 'test.errand'); assert.equal(h.money, 2733);
  addPurse(h, -0.5, 'test.fee'); assert.equal(h.money, 2732.5);
  assert.throws(() => addPurse(h, 0.25, 'test.bad'));
  assert.equal(h.money, 2732.5);
  setPurse(h, 100, 'test.set');
  assert.deepEqual(moneyLedger().rows.map(r => r.delta), [-27, -0.5, 100 - 2732.5]);
  bindGrainForSeam(() => 1);
});
const pack = price => ({schema: 1, rows: [{id: 'p', revision: 1, place: 'shop', minutes: 5, label: 'Buy', description: 'd', report: 'r', kind: 'purchase',
  sellerId: 'seller', items: [{key: '{"id":"bread"}', count: 1, label: 'bread'}], price}]});
test('exchange quote: whole numbers default; halfpenny total with exact change', () => {
  const opts = {worldId: 'w', group: 'g', situationId: 's'};
  const whole = defineCastExchanges(pack({total: 3, unit: 'pence', moneyPerUnit: 1}), opts)[0];
  assert.equal(whole.costs.find(c => c.key === 'money').amount, -3);
  assert.throws(() => defineCastExchanges(pack({total: 3.5, unit: 'pence', moneyPerUnit: 1}), opts));
  const half = defineCastExchanges(pack({total: 3.5, unit: 'pence', moneyPerUnit: 1, grain: 2, tender: 5, change: 1.5}), opts)[0];
  assert.equal(half.costs.find(c => c.key === 'money').amount, -5);
  assert.equal(half.effects.find(c => c.key === 'money').amount, 1.5);
  assert.throws(() => defineCastExchanges(pack({total: 3.5, unit: 'pence', moneyPerUnit: 1, grain: 2, tender: 5, change: 1}), opts));
  assert.ok(isGrained(3.5, 2) && !isGrained(3.5, 1));
});

test('the grain dial is per world: off by default, on for Tingen only', async () => {
  const {bindMoneyGrain} = await import('../src/economy_domain.js');
  const {grainFor} = await import('../src/currency_subunits.js');
  assert.equal(grainFor('book.lotm.tingen'), 2);
  assert.equal(grainFor('base.frontier'), 1);
  const h = {money: 10};
  bindMoneyGrain(() => grainFor('base.frontier'));
  addPurse(h, 0.1, 'test.rate');                    // fractional income elsewhere keeps today's arithmetic
  assert.equal(h.money, 10.1);
  bindMoneyGrain(() => grainFor('book.lotm.tingen'));
  assert.throws(() => addPurse({money: 10}, 0.1, 'test.rate'));
  bindMoneyGrain(() => 1);
});

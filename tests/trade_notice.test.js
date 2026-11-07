import test from 'node:test';
import assert from 'node:assert/strict';
import {vendorRefusal} from '../src/trade_notice.js';

test('trade refusal uses the short name and names the item', () => {
    assert.equal(vendorRefusal({state: 'sold-out', traderName: 'Dunstan, the village trader', itemName: 'Lamp oil'}), 'Dunstan has no more lamp oil.');
    assert.equal(vendorRefusal({state: 'in-basket', traderName: 'Dunstan, the village trader', itemName: 'Lamp oil'}), 'Your basket already holds all Dunstan has of lamp oil.');
    assert.equal(vendorRefusal({state: 'sold-out', traderName: '', itemName: 'Coal'}), 'The trader has no more coal.');
});

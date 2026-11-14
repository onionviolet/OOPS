import test from 'node:test';
import assert from 'node:assert/strict';
import {livesOwnLife} from '../src/seat_profiles.js';
import {registerOwnHoldings} from '../src/own_holdings.js';

// A book lead on the native body and pack has no holdings of its own but still lives on its own panel, so the
// open-on-own-panel rule and the idle line under Here both count it (Fang Yuan's first screen).
test('a lead life counts as living its own life even with no holdings registered',()=>{
    assert.equal(livesOwnLife('book.ri.lead.world'),true);
    assert.equal(livesOwnLife('base.frontier'),false);
    assert.equal(livesOwnLife(undefined),false);
    const off=registerOwnHoldings('book.test.life.world',{purse:'p',items:'i',body:'b'});
    assert.equal(livesOwnLife('book.test.life.world'),true);off();
    assert.equal(livesOwnLife('book.test.life.world'),false);
});

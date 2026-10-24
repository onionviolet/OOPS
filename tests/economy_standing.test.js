import test from 'node:test';
import assert from 'node:assert/strict';
import * as s from '../src/economy_standing.js';
import {routeSpeedGain, routeMinutes} from '../src/known_routes.js';
import {readObligations, validateObligations} from '../src/obligations_ledger.js';

const D = s.DAY;

test('standing tiers change sale and purchase terms with a named breakdown', () => {
    let st = s.fresh();
    const base = s.standingTerms(st, {region: 'Village', vendorId: 'villageTrader'});
    assert.equal(base.sell, 1); assert.equal(base.parts[0].label.includes('Neutral'), true);
    st = s.shiftStanding(st, 'market_circle', 30, 'trade', 0);
    const friend = s.standingTerms(st, {region: 'Village', vendorId: 'villageTrader', reputation: {Village: 10}});
    assert.ok(friend.sell > 1.04 && friend.buy < 0.96);
    assert.deepEqual(friend.parts.map(p => p.id), ['tier', 'region']);
});

test('a shift moves the rival the other way by the backlash share', () => {
    const st = s.shiftStanding(s.fresh(), 'market_circle', 10, 'trade', 0);
    assert.equal(st.standing.market_circle, 10); assert.equal(st.standing.gutter_crews, -6);
    assert.equal(st.deeds.at(-1).moves[1].backlash, true);
    assert.equal(s.factionFor('Swamp', 'swamplandTrader'), null);
    assert.equal(s.factionFor('Village', 'suspiciousTrader'), 'gutter_crews');
});

test('credit writes the obligations ledger, repays, and a missed term ratchets once', () => {
    let st = s.shiftStanding(s.fresh(), 'counting_house', 30, 'trade', 0);
    st = s.takeLoan(st, 'counting_house', 40, 0);
    validateObligations(st.ledger);
    assert.equal(readObligations(st.ledger, {creditor: 'counting_house'})[0].amount, 40);
    assert.throws(() => s.takeLoan(st, 'counting_house', 40, 0), /at most/);
    const late = 28 * D + 4 * D, rate0 = st.loans.counting_house.rate;
    st = s.settleDue(st, late); const again = s.settleDue(st, late + D);
    assert.equal(st.loans.counting_house.missed, true); assert.ok(st.loans.counting_house.rate > rate0);
    assert.equal(again, st);
    assert.ok(s.standingTerms(st, {region: 'Town', vendorId: 'x', now: late}).parts.some(p => p.id === 'overdue'));
    const owed = readObligations(st.ledger)[0].amount;
    const r = s.repayLoan(st, 'counting_house', owed, late);
    assert.equal(r.state.ledger.rows.length, 0); assert.equal(r.state.loans.counting_house, undefined);
});

test('market memory goes stale and rumours settle when seen again', () => {
    let st = s.observePrice(s.fresh(), 'Village', 'Wolf fur', 12, 0, {label: 'Wolf fur'});
    assert.equal(s.memoryRows(st, 19 * D)[0].stale, false); assert.equal(s.memoryRows(st, 21 * D)[0].stale, true);
    for(let day = 1; day < 40 && !st.rumours.length; day++) st = s.drawRumour(st, day * D);
    assert.ok(st.rumours.length, 'a rumour was drawn');
    const r = st.rumours[0]; assert.ok(['sure', 'shaky'].includes(r.sounds));
    assert.equal('honest' in s.rumourView(st)[0], false);
    st = s.observePrice(st, r.region, r.key, r.claim, 50 * D);
    assert.equal(st.rumours[0].verdict, 'held');
});

test('insurance prices by danger, pays a share, one policy', () => {
    const q = s.quoteInsurance(100, 0.5);
    assert.equal(q.premium, 25); assert.equal(q.payout, 75);
    const st = s.buyInsurance(s.fresh(), q, 0);
    assert.throws(() => s.buyInsurance(st, q, 0), /One policy/);
});

test('route wear saturates under its cap; slice validates and migrates', () => {
    assert.equal(routeSpeedGain(0), 0); assert.ok(routeSpeedGain(100) <= 0.25 && routeSpeedGain(5) < routeSpeedGain(20));
    assert.ok(routeMinutes(100, 30) < 100);
    assert.deepEqual(s.migrateStanding(null), s.fresh());
    assert.throws(() => s.validateStanding({...s.fresh(), standing: {nobody: 1}}), /standing/);
    const st = s.takeLoan(s.shiftStanding(s.fresh(), 'counting_house', 30, 't', 0), 'counting_house', 10, 0);
    assert.doesNotThrow(() => s.validateStanding(JSON.parse(JSON.stringify(st))));
});

test('a road mishap on an insured traveller becomes a dated claim owed through the ledger', () => {
    const hit = (() => { for(let now = 0; now < 20000; now += 37) { const m = s.rollMishap({region: 'Slums', purse: 100, now}); if(m) return {m, now}; } })();
    assert.ok(hit, 'a mishap occurs within a bounded run');
    assert.equal(s.rollMishap({region: 'Slums', purse: 100, now: hit.now})?.loss, hit.m.loss);
    assert.equal(s.rollMishap({region: 'Village', purse: 5, now: hit.now}), null);
    let st = s.buyInsurance(s.fresh(), s.quoteInsurance(100, 0.2), hit.now);
    const {state: filed, claim} = s.fileClaim(st, hit.m.loss, hit.now);
    assert.equal(claim.amount, Math.max(0, Math.floor(hit.m.loss * 0.75) - 2)); assert.equal(filed.insurance, null);
    assert.equal(filed.ledger.rows.find(r => r.id === claim.id).debtor, 'insurer');
    assert.equal(s.settleClaims(filed, hit.now + D).paid, 0);
    const done = s.settleClaims(filed, hit.now + 4 * D);
    assert.equal(done.paid, claim.amount); assert.equal(done.state.ledger.rows.length, 0);
    assert.equal(s.fileClaim(s.fresh(), 10, 0).claim, null);
});

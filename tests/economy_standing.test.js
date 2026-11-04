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

test('the insurance offer is computed from the region and the dials, and buying it charges the quoted premium', async () => {
    const {setCurrentLocation} = await import('../src/runtime_state.js');
    const d = await import('../src/economy_standing_domain.js');
    setCurrentLocation({id: 'a', market_region: 'Village'});
    const village = d.insuranceOffer();
    setCurrentLocation({id: 'b', market_region: 'Slums'});
    const slums = d.insuranceOffer();
    assert.equal(village.premium, s.quoteInsurance(50, s.roadDanger('Village')).premium);
    assert.equal(slums.premium, s.quoteInsurance(50, 0.35).premium);
    assert.ok(slums.premium > village.premium && slums.danger > village.danger);
    assert.equal(slums.fee, s.DIALS.deductible.value); assert.equal(slums.days, s.DIALS.claimDays.value);
    const spent = []; let coins = 100;
    d.bindStandingHost({coins: () => coins, addCoins: n => { coins += n; spent.push(n); }});
    d.insure(50, undefined, 'carried cargo');
    assert.deepEqual(spent, [-slums.premium]);
});

test('H8 price causes: pity, fear, shortage tag the quote, a crew street closes, and each expires and persists', () => {
    let st = s.addCause(s.fresh(), {kind: 'pity', region: 'Slums', detail: '9 coins lost', source: 'road mishap'}, 0);
    const pity = s.standingTerms(st, {region: 'Slums', vendorId: 'x', now: D});
    assert.ok(pity.parts.some(p => p.id === 'cause:pity' && p.why) && pity.buy < 1 && !pity.closed);
    assert.equal(s.standingTerms(st, {region: 'Village', vendorId: 'x', now: D}).parts.some(p => p.cause), false, 'other regions unaffected');
    assert.equal(s.standingTerms(st, {region: 'Slums', vendorId: 'x', now: 4 * D}).parts.some(p => p.cause), false, 'expires');
    // A missed term at the crews: fear, and their street shuts; a counting-house default only taints prices.
    let late = s.takeLoan(s.shiftStanding(s.fresh(), 'gutter_crews', 30, 't', 0), 'gutter_crews', 10, 0);
    late = s.settleDue(late, 40 * D);
    const shut = s.standingTerms(late, {region: 'Slums', vendorId: 'x', now: 41 * D});
    assert.equal(shut.closed.kind, 'fear'); assert.ok(shut.closed.daysLeft >= 1 && shut.closed.why);
    assert.equal(s.standingTerms(late, {region: 'Slums', vendorId: 'x', now: 55 * D}).closed, undefined);
    let town = s.takeLoan(s.shiftStanding(s.fresh(), 'counting_house', 30, 't', 0), 'counting_house', 10, 0);
    town = s.settleDue(town, 40 * D);
    assert.equal(s.standingTerms(town, {region: 'Town', vendorId: 'x', now: 41 * D}).closed, undefined);
    assert.ok(s.standingTerms(town, {region: 'Town', vendorId: 'x', now: 41 * D}).parts.some(p => p.cause === 'fear'));
    // A big purchase makes a shortage; a small one does not; renewing replaces, never stacks.
    assert.equal(s.tradeDeed(s.fresh(), {region: 'Village', vendorId: 'v', buyValue: 20}, 0).causes.length, 0);
    const big = s.tradeDeed(s.fresh(), {region: 'Village', vendorId: 'v', buyValue: 150}, 0);
    assert.equal(big.causes[0].kind, 'shortage');
    assert.equal(s.addCause(big, {kind: 'shortage', region: 'Village'}, D).causes.length, 1);
    // Save, reload: JSON round trip validates and keeps the rows; an old slice without causes migrates to none.
    const saved = JSON.parse(JSON.stringify(big));
    assert.doesNotThrow(() => s.validateStanding(saved));
    assert.deepEqual(s.migrateStanding(saved).causes, big.causes);
    const {causes, ...old} = saved; assert.deepEqual(s.migrateStanding(old).causes, []);
    assert.throws(() => s.validateStanding({...saved, causes: [{kind: 'bogus', region: 'x', sell: 1, buy: 1, until: 1, since: 0}]}), /price cause/);
});

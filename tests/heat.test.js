import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {registerDutySet} from '../src/duties_domain.js';
import {LOTM_RENT, LOTM_RENT_ID} from '../src/book_world_lotm_duties.js';
import {configureHeatPurse, migrateHeat, freshHeat} from '../src/heat.js';
import {consequenceNews} from '../src/consequences.js';
import {readOwedLedger, settleOwed} from '../src/owed_ledger_sources.js';
import {eventFeed} from '../src/event_feed.js';
import {createExpansionState} from '../src/expansion_engine.js';
import {initializeExpedition, expeditionRegistry as registry} from '../src/expedition_content.js';

const WEEK = 10080, FINE = 120;
let clock = 10, purse = 0;
registerDutySet('heat_rent', {defs: LOTM_RENT, state: () => ({clock}), active: () => true, minute: s => s.clock,
    purse: {balance: () => purse, pay: amount => { purse -= amount; }}});
const state = () => initializeExpedition(createExpansionState(7));
const reset = (coins = 0, withPurse = true) => {
    clock = 10; purse = coins; domainRegistry.load({}); domainRegistry.tick(1);
    configureHeatPurse(withPurse ? {balance: () => purse, pay: amount => { purse -= amount; }} : null);
};
const weeks = n => { for(let i = 0; i < n; i++) { clock += WEEK; domainRegistry.tick(WEEK); } };
const lines = re => consequenceNews(state()).filter(n => re.test(n.id));
const proj = () => domainRegistry.project('heat');
const fineRow = () => readOwedLedger().rows.find(r => r.id.startsWith('fine:'));

test('3 misses give one collector line, once; it names the choice', () => {
    reset(0); weeks(2);
    assert.equal(lines(/^collector:/).length, 0);
    weeks(1);
    const [c] = lines(/^collector:/);
    assert.equal(lines(/^collector:/).length, 1);
    assert.match(c.text, /collector/); assert.match(c.text, /settles it/); assert.match(c.text, /never be taken while you are out/);
    domainRegistry.tick(1);
    assert.deepEqual(lines(/^collector:/), [c], 'a second read and tick add nothing and the line does not move');
    assert.equal(fineRow(), undefined);
});

test('4 misses write one fine as an owed row; reading and ticking again does not add another', () => {
    reset(0); weeks(4);
    const row = fineRow();
    assert.equal(row.amount, FINE); assert.equal(row.creditor, 'landlady'); assert.equal(row.debtor, 'player');
    assert.equal(lines(/^fine:/).length, 1);
    weeks(1); domainRegistry.tick(1);
    assert.equal(readOwedLedger().rows.filter(r => r.id.startsWith('fine:')).length, 1);
    assert.equal(Object.keys(domainRegistry.save({}).heat.fines).length, 1);
    assert.equal(purse, 0, 'nothing is taken while away (OB4)');
    assert.ok(readOwedLedger().live[row.id].quote.blocked, 'the Settle button is blocked while the purse is short');
});

test('settling pays through the purse, clears the row and the line, and does not re-levy at the same miss count', () => {
    reset(0); weeks(4); purse = 5 * FINE;
    const row = fineRow(), quote = readOwedLedger().live[row.id].quote;
    assert.equal(quote.blocked, null);
    assert.equal(settleOwed(quote), FINE);
    assert.equal(purse, 4 * FINE);
    assert.equal(fineRow(), undefined); assert.equal(lines(/^fine:/).length, 0);
    domainRegistry.tick(1);
    assert.equal(fineRow(), undefined);
    assert.throws(() => settleOwed(quote), /not open/);
});

test('a short purse refuses and leaves the fine open', () => {
    reset(0); weeks(4); purse = 10;
    assert.throws(() => settleOwed(readOwedLedger().live[fineRow().id].quote), /too little/);
    assert.ok(fineRow()); assert.equal(purse, 10);
});

test('no purse seam, no fine: the collector stands alone', () => {
    reset(0, false); weeks(5);
    assert.equal(lines(/^collector:/).length, 1); assert.equal(fineRow(), undefined);
});

test('heat is derived from known misses and falls when they are paid; a new bout is a new cause', () => {
    reset(0); weeks(1);
    assert.equal(proj().heat[0].word, 'known to the landlady');
    const first = lines(/^heat:/); assert.equal(first.length, 1);
    purse = 20 * 60; weeks(2); // pays this week and clears one old miss each week
    domainRegistry.tick(1);
    assert.deepEqual(proj().heat, []);
    assert.equal(lines(/^heat:/).length, 0);
    purse = 0; weeks(1);
    const second = lines(/^heat:/);
    assert.equal(second.length, 1); assert.notEqual(second[0].id, first[0].id);
});

test('an unknown act gives no heat; a known act gives the police word and ages out', () => {
    reset(0);
    const record = domainRegistry.command('heat', 'recordAct');
    assert.equal(record({authority: 'tingen_police', weight: 2, id: 'x', known: false}), false);
    assert.equal(record({authority: 'tingen_police', weight: 2, id: 'x'}), false);
    assert.equal(record({authority: 'nobody', weight: 2, id: 'x', known: true}), false);
    assert.deepEqual(proj().heat, []); assert.equal(domainRegistry.save({}).heat, undefined);
    assert.equal(record({authority: 'tingen_police', weight: 2, id: 'theft1', at: 50, known: true}), true);
    assert.equal(record({authority: 'tingen_police', weight: 2, id: 'theft1', at: 50, known: true}), false, 'same act counts once');
    assert.equal(proj().heat[0].word, 'the Tingen police have your name');
    assert.match(lines(/^heat:tingen_police/)[0].text, /Tingen police have your name/);
    domainRegistry.tick(14 * 1440);
    const half = proj().heat[0].value; assert.ok(half > 0.9 && half < 1.1, `half-decayed, got ${half}`);
    domainRegistry.tick(14 * 1440);
    assert.deepEqual(proj().heat, []); assert.equal(lines(/^heat:/).length, 0);
});

test('an untouched life writes no key and the feed gains nothing; old and junk slices load fresh', () => {
    reset(0);
    assert.equal(domainRegistry.save({}).heat, undefined);
    assert.deepEqual(eventFeed(state(), registry).news.filter(n => /^(heat|collector|fine):/.test(n.id)), []);
    assert.deepEqual(migrateHeat(undefined), freshHeat());
    assert.deepEqual(migrateHeat({family: 'other'}), freshHeat());
    const m = migrateHeat({family: 'heat@1', acts: [{id: 'a', authority: 'bogus', weight: 1, age: 0}], fines: {k: {authority: 'landlady', duty: 'd', epoch: -1, amount: 5, at: 0}}});
    assert.deepEqual(m, freshHeat());
});

test('heat lines reach the Events list and survive a save round trip', () => {
    reset(0); weeks(4);
    const ids = eventFeed(state(), registry).news.map(n => n.id);
    assert.ok(ids.some(i => i.startsWith('heat:landlady')) && ids.some(i => i.startsWith('collector:')) && ids.some(i => i.startsWith('fine:')));
    const env = domainRegistry.save({}); domainRegistry.validate(env);
    const before = JSON.stringify(consequenceNews(state()));
    domainRegistry.load(JSON.parse(JSON.stringify(env)));
    assert.equal(JSON.stringify(consequenceNews(state())), before);
});

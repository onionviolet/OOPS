import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {awayBankDomain} from '../src/away_bank_domain.js';
import {configureNativeToolDomains} from '../src/native_tool_domains.js';
import {createReturnDigestRow} from '../src/return_digest_ui.js';

// Real wiring: configureNativeToolDomains hands the bank its ports; the registry saves and loads it.
const MIN = 60000;
let clock = 100, wall = 1e12, assigned = false, calls = [], stopAt = Infinity;
const root = {get clock() {return clock;}};
const ports = {root: () => root, persist: fn => fn(), writable: () => true, furnaceAssigned: () => assigned,
    fastForward: async n => {calls.push(n); clock += Math.min(n, stopAt);}};
const realNow = Date.now;
// The bank is configured first, so the call reaches it; later domains need the full game's ports.
function wire() {try {configureNativeToolDomains(ports);} catch {/* unrelated domains */}}
test.before(() => {Date.now = () => wall; wire();});
test.after(() => {Date.now = realNow;});
const bank = awayBankDomain;
const fresh = () => bank.save({});
const load = slice => bank.load(slice);
const spend = () => domainRegistry.command('awayBank', 'spend')();
const project = () => domainRegistry.project('awayBank');

test('old save without the slice starts empty, with no retroactive bank', () => {
    load(null);
    assert.equal(project().bankedMinutes, 0);
    assert.deepEqual(fresh(), {schema: 1, lastSeen: wall, bankedMinutes: 0, remainderMs: 0});
});
test('time away banks on load, saves rebase it, reload does not double credit', () => {
    load({schema: 1, lastSeen: wall - 90 * MIN - 30000, bankedMinutes: 5, remainderMs: 0});
    const p = project();
    assert.equal(p.bankedMinutes, 95); assert.equal(p.lastReturn.minutes, 90);
    const saved = fresh();
    assert.equal(saved.lastSeen, wall); assert.equal(saved.bankedMinutes, 95); assert.equal(saved.remainderMs, 30000);
    load(saved);
    assert.equal(project().bankedMinutes, 95);
});
test('bank is capped at its capacity and the loss is reported', () => {
    load({schema: 1, lastSeen: wall - 8 * 24 * 60 * MIN, bankedMinutes: 0, remainderMs: 0});
    const p = project();
    assert.equal(p.bankedMinutes, 7 * 24 * 60); assert.equal(p.lastReturn.dropped, 24 * 60);
});
test('an assigned Patient Furnace keeps accruing; the ledger only rebases', () => {
    assigned = true;
    load({schema: 1, lastSeen: wall - 60 * MIN, bankedMinutes: 3, remainderMs: 0});
    assert.equal(project().bankedMinutes, 3);
    assert.equal(fresh().lastSeen, wall); assigned = false;
});
test('clock moving backwards banks nothing', () => {
    load({schema: 1, lastSeen: wall + 50 * MIN, bankedMinutes: 2, remainderMs: 0});
    assert.equal(project().bankedMinutes, 2);
});
test('spending runs the native clock and debits only what it consumed', async () => {
    load({schema: 1, lastSeen: wall - 100 * MIN, bankedMinutes: 0, remainderMs: 0});
    calls = [];
    const r = await spend();
    assert.deepEqual(calls, [60]); assert.equal(r.consumed, 60);
    assert.equal(project().bankedMinutes, 40);
    stopAt = 7;
    await spend();
    const p = project();
    assert.equal(p.bankedMinutes, 33); assert.match(p.lastSpend, /Stopped after 7 of 40/);
    stopAt = Infinity;
    assert.equal(fresh().bankedMinutes, 33);
});
test('invalid slices are rejected and an empty bank cannot be spent', async () => {
    assert.throws(() => bank.validate({schema: 1, lastSeen: 1, bankedMinutes: -1, remainderMs: 0}));
    load(null);
    await assert.rejects(() => spend(), /No time is banked/);
});
test('digest row shows the bank and spends it from the button', async () => {
    const els = [], doc = {createElement: tag => {const l = {};
        const e = {tagName: tag.toUpperCase(), children: [], dataset: {}, hidden: false, textContent: '', append(...c) {e.children.push(...c);}, replaceChildren(...c) {e.children = c;},
            setAttribute() {}, addEventListener: (t, f) => {l[t] = f;}, click: () => l.click()}; els.push(e); return e;}};
    let spent = 0;
    const row = createReturnDigestRow({doc, markRead() {}, spendBank: async () => {spent++;}});
    row.update(null, {bank: {bankedMinutes: 95, capacity: 10080, lastReturn: {minutes: 90, dropped: 0}, spendMinutes: 60, writable: true}});
    assert.equal(row.node.hidden, false);
    const line = els.find(e => e.className === 'return-digest-bank'), btn = els.find(e => e.id === 'away_bank_spend');
    assert.match(line.textContent, /Banked time: 95 minutes/); assert.equal(btn.textContent, 'Spend 60 banked minutes');
    await btn.click(); assert.equal(spent, 1);
    row.update(null, {bank: {bankedMinutes: 0, lastReturn: null}}); assert.equal(row.node.hidden, true);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {domainRegistry} from '../src/domain_registry.js';
import {awayBankDomain, spendAwayBank, configureAwayBank} from '../src/away_bank_domain.js';
import {registerDutySet} from '../src/duties_domain.js';
import {LOTM_RENT, LOTM_RENT_ID} from '../src/book_world_lotm_duties.js';
import {BE_PROFILE_ID} from '../src/seat_profiles.js';
import {lotmBe} from '../src/book_world_lotm_cast_host.js';

// AT23: banked away time spent in a LOTM life goes through the same clock-and-tick path as live time, so the LOTM clock
// advances and its standing orders settle exactly as they would have live.
const WEEK = 10080, RENT = 60;
const root = {clock: 10, lotm: {entryProfile: BE_PROFILE_ID}};
let purse = 0; const paid = [];
// The native clock owner's contract (src/clock_owner.js): move the root clock, then domainRegistry.tick(consumed).
const advance = n => { root.clock += n; domainRegistry.tick(n); };
registerDutySet('at23_rent', {defs: LOTM_RENT, state: () => root, active: lotmBe, minute: st => st.clock,
    purse: {balance: () => purse, pay: (amount, p) => { purse -= amount; paid.push(...p); }}});
const dutySlice = () => domainRegistry.save({}).duties;

test('wiring: the bank, the LOTM duty clock and the native tick all read the one expansion state', () => {
    const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
    assert.match(main, /configureLotm\(\{[^\n]*state:\(\)=>expansionState/, 'LOTM duties read the expansion clock');
    assert.match(main, /configureNativeToolDomains\(\{[^\n]*fastForward:n=>fastForward\(n\)[^\n]*root:\(\)=>expansionState/, 'the bank reads and spends the same clock');
    assert.match(readFileSync(new URL('../src/clock_owner.js', import.meta.url), 'utf8'), /domainRegistry\.tick\(consumed\)/, 'every native minute reaches the registry');
});

test('spending banked time in a LOTM life advances the LOTM clock and settles rent as live time does', async () => {
    // Live reference: two weeks, one minute per native tick.
    purse = 10 * RENT; domainRegistry.load({}); domainRegistry.tick(1);
    for (let i = 0; i < 2 * WEEK; i++) advance(1);
    const live = {slice: dutySlice(), purse, paid: paid.length, clock: root.clock};
    assert.equal(live.paid, 2); assert.equal(live.purse, 8 * RENT);

    // Banked: same life, same start; the bank spends two weeks through its fast-forward port.
    root.clock = 10; purse = 10 * RENT; paid.length = 0; domainRegistry.load({}); domainRegistry.tick(1);
    configureAwayBank({root: () => root, persist: fn => fn(), writable: () => true, furnaceAssigned: () => false,
        fastForward: async n => { for (let i = 0; i < n; i++) advance(1); }});
    awayBankDomain.load({schema: 1, bankedMinutes: 2 * WEEK, remainderMs: 0}, {});
    const r = await spendAwayBank(2 * WEEK);
    assert.equal(r.consumed, 2 * WEEK);
    assert.equal(root.clock, live.clock, 'the LOTM clock moved by exactly the spent minutes');
    assert.deepEqual({slice: dutySlice(), purse, paid: paid.length, clock: root.clock}, live, 'same duties, purse and payments as live time');
    assert.equal(domainRegistry.project('awayBank').bankedMinutes, 0);
});

test('a stop at a waiting choice leaves the rest banked and settles only the weeks reached', async () => {
    root.clock = 10; purse = 10 * RENT; paid.length = 0; domainRegistry.load({}); domainRegistry.tick(1);
    configureAwayBank({root: () => root, persist: fn => fn(), writable: () => true, furnaceAssigned: () => false,
        fastForward: async n => { for (let i = 0; i < Math.min(n, WEEK + 5); i++) advance(1); }});
    awayBankDomain.load({schema: 1, bankedMinutes: 3 * WEEK, remainderMs: 0}, {});
    const r = await spendAwayBank(3 * WEEK);
    assert.equal(r.consumed, WEEK + 5);
    assert.equal(paid.length, 1, 'one week closed');
    assert.equal(domainRegistry.project('awayBank').bankedMinutes, 3 * WEEK - (WEEK + 5));
});

test('a non-LOTM life does not pay LOTM rent from the bank', async () => {
    const other = {...root, lotm: undefined}; const keep = root.lotm;
    root.lotm = undefined; root.clock = 10; purse = 10 * RENT; paid.length = 0; domainRegistry.load({}); domainRegistry.tick(1);
    for (let i = 0; i < WEEK + 5; i++) advance(1);
    root.lotm = keep;
    assert.equal(paid.length, 0); assert.equal(purse, 10 * RENT); assert.ok(other);
});

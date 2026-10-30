import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {decodeSaveFile, encodeSaveFile} from '../src/save_files.js';
import {createChronicle, advanceChronicle, GAME_YEAR} from '../src/chronicle.js';
import {buildLifeHeirSave} from '../src/life_experience_host.js';
import {carryLedger, carryLedgerWorlds, registerCarryRules} from '../src/carry_ledger.js';
import {carriedObligations} from '../src/obligations_ledger.js';
import * as R from '../src/book_world_primordial_credit.js';
import {createPrimordialHost} from '../src/book_world_primordial_host.js';

const DAY = R.DAY, T0 = 5_000_000;
const SWORD = R.FORMULA, DRAGON = 'book.primordial.item.coiling_dragon_method', CURSE = 'book.primordial.item.killing_life_curse';
const hostAt = () => { const clock = {t: T0}; return {clock, host: createPrimordialHost({now: () => clock.t})}; };
// Harness CP for the repay tests (the mission is tested separately and slowly): load a slice that holds CP.
const fund = (host, cp) => host.load({...R.fresh(), ...(host.save() ?? {}), cp});

test('credit cap gate: 1,500 against 1,200 is refused with the vague hint until the rule is known, then it is named', () => {
    const {host} = hostAt();
    const first = host.request(DRAGON);
    assert.equal(first.ok, false);
    assert.deepEqual(first.shown, ['Something is still missing.']);
    assert.match(first.reasons[0], /never exceeds a disciple's total value/);
    assert.ok(first.routes.length >= 1 && first.routes[0].cost);
    host.askHowCreditIsWeighed();
    const second = host.request(DRAGON);
    assert.deepEqual(second.shown, ['The sect will not lend more than you are worth to it.']);
    assert.equal(host.view().bodyValue, 1200);
    assert.equal(host.view().loan, null);
    assert.equal(host.save()?.loan ?? null, null);
    assert.equal(host.request(SWORD).ok, true); // 1,000 passes at 1,200
});

const Y = 360 * DAY;
test('four quantities after 0, 1 and 10 payments: installment, accrued interest, remaining principal, total obligation', () => {
    const {host, clock} = hostAt(); host.request(SWORD);
    const q = () => host.view().loan;
    assert.deepEqual([q().installment, q().accruedInterest, q().remainingPrincipal, q().totalObligation, q().totalRemaining], [460, 0, 1000, 4600, 4600]);
    assert.equal(q().next.amount, 460); assert.equal(q().installmentsLeft, 10);
    clock.t = T0 + DAY; assert.equal(q().accruedInterest, 1);            // 360 a year, flat, by the day
    clock.t = T0 + Y;
    assert.equal(q().accruedInterest, 360); assert.equal(q().totalRemaining, 4600); // unpaid: still the whole 4,600, never a 1,360 lump
    fund(host, 5000); host.repay(460);
    assert.deepEqual([q().installmentsPaid, q().remainingPrincipal, q().totalRemaining, q().installmentsLeft], [1, 900, 4140, 9]);
    assert.equal(q().next.number, 2); assert.equal(q().next.dueAt, T0 + 2 * Y);
    for(let y = 2; y <= 10; y++) { clock.t = T0 + y * Y; host.repay(460); }
    assert.equal(q(), null);                                             // ten payments settle it: 4,600 in all
    assert.equal(host.save().loan, null);
});

test('accrued interest is flat on the original principal and stops at the term', () => {
    const {host, clock} = hostAt(); host.request(SWORD);
    clock.t = T0 + 3 * Y; assert.equal(host.view().loan.accruedInterest, 1080);
    clock.t = T0 + 20 * Y; assert.equal(host.view().loan.accruedInterest, 3600);
});

test('partial repayment: interest first inside an installment, the balance carries into the next', () => {
    const {host, clock} = hostAt(); host.request(SWORD);
    clock.t = T0 + Y; fund(host, 5000); host.repay(300);
    let l = host.view().loan;
    assert.deepEqual([l.installmentsPaid, l.next.amount, l.remainingPrincipal, l.totalRemaining], [0, 160, 1000, 4300]);
    host.repay(200);                                                     // 500 paid: installment 1 done, 40 into installment 2
    l = host.view().loan;
    assert.deepEqual([l.installmentsPaid, l.next.number, l.next.amount, l.remainingPrincipal, l.totalRemaining], [1, 2, 420, 900, 4100]);
});

test('a missed installment: due plus the existing grace days, then overdue; forgiving, nothing else changes', () => {
    const {host, clock} = hostAt(); host.request(SWORD);
    const grace = R.quantities(host.view().loan, T0).graceDays; assert.equal(grace, 3);
    clock.t = T0 + Y + grace * DAY; assert.equal(host.view().loan.overdue, false);
    clock.t = T0 + Y + grace * DAY + 1; assert.equal(host.view().loan.overdue, true);
    assert.equal(host.view().loan.totalRemaining, 4600);                 // no ratchet, no penalty built (AD19)
    fund(host, 5000); host.repay(460); assert.equal(host.view().loan.overdue, false);      // paying clears it
});

test('first exchange only: a second zero-down loan is refused; a held item is not re-issued; partial repay works', () => {
    const {host, clock} = hostAt();
    host.request(SWORD);
    const again = host.request(CURSE);
    assert.equal(again.ok, false);
    assert.match(again.reasons.join(' '), /first exchange only/);
    clock.t = T0 + 360 * DAY; fund(host, 5000);
    assert.equal(host.repay(360), 360);
    assert.equal(host.view().loan.totalRemaining, 4240);
    assert.equal(host.repay(9000), 4240); assert.equal(host.view().loan, null);
});

test('borrow, serialize, reload: still owed, and an untouched slice writes nothing', () => {
    assert.equal(createPrimordialHost({now: () => T0}).save(), undefined);
    const {host, clock} = hostAt();
    host.request(SWORD); host.askHowCreditIsWeighed();
    const text = JSON.stringify(host.save());
    const b = createPrimordialHost({now: () => clock.t});
    b.validate(JSON.parse(text)); b.load(JSON.parse(text));
    clock.t = T0 + 360 * DAY;
    assert.equal(b.view().loan.totalRemaining, 4600); assert.equal(b.view().loan.accruedInterest, 360);
    assert.equal(b.view().held[SWORD], 'first half issued');
    assert.throws(() => b.validate({...JSON.parse(text), loan: {...JSON.parse(text).loan, principal: -1}}), /bad loan/);
});

test('rebirth carry list: Open obligations drops for this world, carries for base.frontier; the ledger row is not carried', () => {
    registerCarryRules(R.WORLD_ID, R.CARRY_ROWS);
    assert.ok(carryLedgerWorlds().includes(R.WORLD_ID));
    const open = id => carryLedger(id).find(s => s.boundary === 'rebirth').rows.find(r => r.what === 'Open obligations');
    assert.equal(open(R.WORLD_ID).carries, 'drops');
    assert.equal(open('base.frontier').carries, 'carries');
    assert.throws(() => registerCarryRules('base.frontier', R.CARRY_ROWS), /built in/);
    const {host} = hostAt(); host.request(SWORD);
    assert.equal(host.view().ledger.length, 1);
    assert.equal(carriedObligations({family: 'obligations@1', rows: host.view().ledger}).rows.length, 0);
});

test('the restart: the existing heir route does not copy the slice, so the debt drops (the dial agrees with behavior)', () => {
    const calendar = {year: 999, month: 4, day: 1, hour: 8, minute: 0, day_count: 1};
    const end = 62 * GAME_YEAR, c = advanceChronicle(createChronicle(0, calendar, true), end);
    const {host} = hostAt(); host.request(SWORD);
    const prev = {name: 'Ada', character: {name: 'Ada', money: 0, reputation: {}}, levels: {person: {main_character: {total_xp: 0}}}, 'current time': calendar,
        expansion: {chronicle: c, clock: end, rng: 3}, inventories: {person: {main_character: {}}, storage: {player: {}}}, availabilities: {location: {Shack: 0}}, primordial_credit: host.save()};
    const fresh = {character: {name: 'You', money: 0, reputation: {Village: 0, Slums: 0, Town: 0}}, levels: {person: {main_character: {total_xp: 0}}}, 'current time': calendar, expansion: {chronicle: null},
        inventories: {person: {main_character: {}}, storage: {player: {}}}, availabilities: {location: {Shack: 0, Village: 1}}};
    const heir = buildLifeHeirSave(prev, fresh);
    assert.equal('primordial_credit' in heir, false);
    assert.equal(R.DIALS.restart.value, 'drops');
    const reborn = createPrimordialHost({now: () => T0}); reborn.load(heir.primordial_credit);
    assert.equal(reborn.view().loan, null);
});

test('save compatibility: a pre-change browser save loads unchanged and a save carrying the slice still validates', () => {
    const file = new URL('../docs/gm/dispatch/primordial-credit-2026-10-24/fixtures/pre_change_save.txt', import.meta.url);
    const env = decodeSaveFile(fs.readFileSync(file, 'utf8'), 'v0.6');
    assert.equal('primordial_credit' in env, false);
    const host = createPrimordialHost({now: () => T0});
    host.validate(env.primordial_credit); host.load(env.primordial_credit);
    assert.equal(host.save(), undefined);
    host.request(SWORD);
    const withSlice = {...env, primordial_credit: host.save()};
    const round = decodeSaveFile(encodeSaveFile(JSON.stringify(withSlice)), 'v0.6');
    assert.deepEqual(round.primordial_credit, host.save());
    const {primordial_credit, ...rest} = round;
    assert.deepEqual(rest, env); // every other key unchanged
});

const HOUR = 60;
test('the sect mission: eight game hours of ticks, then the pay less the cost; one a day; no CP needed to start', () => {
    const {host, clock} = hostAt();
    assert.equal(host.view().cp, 0);
    host.startShift();
    assert.throws(() => host.startShift(), /already under way/);
    clock.t = T0 + 7 * HOUR; host.tick(); assert.equal(host.view().cp, 0); assert.ok(host.view().shift);
    clock.t = T0 + 8 * HOUR; host.tick();
    assert.equal(host.view().cp, R.DIALS.taskPay.value - R.DIALS.taskCost.value); assert.equal(host.view().shift, null); assert.equal(host.view().shifts, 1);
    clock.t = T0 + 9 * HOUR; assert.throws(() => host.startShift(), /mission a day/);
    clock.t = T0 + DAY; host.startShift(); assert.ok(host.view().shift);
    const text = JSON.stringify(host.save()), b = createPrimordialHost({now: () => clock.t});
    b.validate(JSON.parse(text)); b.load(JSON.parse(text));
    clock.t = T0 + DAY + 8 * HOUR; b.tick(); assert.equal(b.view().cp, 8);
});

test('repay is atomic: no CP, bad amounts and no debt change nothing; a payment past the total is trimmed', () => {
    const {host, clock} = hostAt(); host.request(SWORD); clock.t = T0 + Y;
    const before = JSON.stringify(host.save());
    assert.throws(() => host.repay(460), /hold 0 CP/); assert.equal(JSON.stringify(host.save()), before);
    fund(host, 100); const funded = JSON.stringify(host.save());
    assert.throws(() => host.repay(101), /Nothing was paid/); assert.throws(() => host.repay(0), /whole number/); assert.throws(() => host.repay(1.5), /whole number/);
    assert.equal(JSON.stringify(host.save()), funded);
    assert.equal(host.repay(100), 100); assert.equal(host.view().cp, 0); assert.equal(host.view().loan.totalRemaining, 4500);
    fund(host, 9999); assert.equal(host.repay(9999), 4500); assert.equal(host.view().cp, 5499); assert.equal(host.view().loan, null);
    assert.throws(() => host.repay(1), /nothing/);
});

test('real clock: interest and the mission follow the game clock through the registry tick', async () => {
    const {current_game_time} = await import('../src/game_time.js');
    const {domainRegistry} = await import('../src/domain_registry.js');
    await import('../src/book_world_primordial_domain.js');
    const run = name => domainRegistry.command('primordial_credit', name);
    const ok = () => domainRegistry.project('primordial_credit');
    assert.equal(ok().loan, null);
    run('request')(SWORD);
    run('startShift')();
    const q0 = ok().loan.accruedInterest;
    for(let i = 0; i < 12 * 24 * 60; i++) { current_game_time.goUp(1); if(i % 60 === 59) domainRegistry.tick(60); }   // 12 game days of 1-minute clock steps, hourly ticks
    assert.equal(ok().shift, null); assert.ok(ok().cp >= 4);
    const q1 = ok().loan.accruedInterest;
    assert.equal(q0, 0); assert.ok(q1 >= 11 && q1 <= 13, `12 days of flat 360 a year is about 12 CP, got ${q1}`);
    assert.equal(domainRegistry.save({}).primordial_credit.cp, ok().cp);
});

test('slice validation: CP and mission fields must be sound; a save without them loads as zero', () => {
    const base = R.fresh();
    assert.doesNotThrow(() => R.validateSlice({schema: 1, loan: null, firstExchangeUsed: false, held: {}, knowsRule: false}));
    assert.equal(R.migrate({schema: 1, loan: null, firstExchangeUsed: false, held: {}, knowsRule: false}).cp, 0);
    assert.throws(() => R.validateSlice({...base, cp: -1}), /bad CP/); assert.throws(() => R.validateSlice({...base, cp: 1.5}), /bad CP/);
    assert.throws(() => R.validateSlice({...base, shift: {startedAt: 'x'}}), /bad mission/);
});

test('IP7: a second mission on the same day is a paid rush posting, never a flat refusal', () => {
    const {host, clock} = hostAt();
    host.startShift();
    clock.t = T0 + 8 * HOUR; host.tick();
    const cp = host.view().cp;
    clock.t = T0 + 9 * HOUR;
    assert.throws(() => host.startShift(), /rush posting/);
    host.startShift({rush: true});
    assert.ok(host.view().shift);
    assert.equal(host.view().cp, cp - R.DIALS.rushFee.value, 'the fee is the cost');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState, loadExpansionState, advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition, expeditionRegistry as registry} from '../src/expedition_content.js';
import {commitManagement} from '../src/management/host.js';
import {I, K} from '../src/management/shared.js';
import {domainRegistry} from '../src/domain_registry.js';
import {configureHiredHands, handDigestRows, WEEK} from '../src/hired_hands.js';
import {PLOT_JOB} from '../src/hired_hands_plot.js';
import {livelihoodsOf} from '../src/livelihoods.js';
import '../src/livelihood_sources.js';

// OB7/OB12 L1: a hired hand tends the courtyard plot. Fixture money and vitals are test values.
const body = {id: 'native.player.body', form: 'human', ownerId: 'player', controllerId: 'player', hands: 2, mobile: true};
const ctx = (p, extra = {}) => ({actorId: 'player', external: p.external, gameplay: p.gameplay, vitals: p.vitals || {player: {health: 100, max_health: 100, stamina: 100, max_stamina: 100}},
    facts: {location: 'Village'}, nativeBody: body, nativeAlive: true, nativeReady: true, managementPlayerLocation: 'Village', managementPlayerAlive: true, managementHost: true, ...extra});
const keep = (p, out) => ({...out, vitals: out.vitals || p.vitals});
const run = (p, id) => keep(p, commitManagement(p.state, registry, {id}, ctx(p), p.state.sequence));
const base = money => ({state: initializeExpedition(createExpansionState(17)), external: {money}, gameplay: {player: {inventory: {}, skills: {}, reputation: {}}}});
const box = {p: null};
const advance = (minutes) => {
    const p = box.p, c = ctx(p);
    const others = Object.fromEntries(Object.keys(p.state.simulation?.people || {}).filter(id => id !== 'player').map(id => [id, {...c, actorId: id, vitals: p.state.simulation.people[id].vitals, facts: {...c.facts, location: undefined}}]));
    const out = advanceSimulation(p.state, registry, minutes, p.external, p.gameplay, {player: {...c, vitals: c.vitals.player}, ...others});
    box.p = {...p, state: out.state, external: out.external ?? p.external, gameplay: out.gameplay ?? p.gameplay};
    domainRegistry.tick(minutes);
};
function setup(money = 300, seeds = 4) {
    let p = run(run(base(money), I.begin), 'mg.farm.rent_plot');
    for (let i = 0; i < seeds; i++) p = run(p, 'mg.supply.seed');
    box.p = p;
    let writable = true;
    configureHiredHands({plan: () => structuredClone(box.p), commit: plan => { if (!writable) throw Error('read only'); box.p = plan; }, writable: () => true, logMessage: () => {}});
    domainRegistry.load({}); // fresh slice
    return {readOnly: v => { writable = !v; }};
}
const cmd = (name, args) => domainRegistry.command('hired_hands', name)(args);
const hire = (extra = {}) => cmd('hire', {jobId: PLOT_JOB, hand: I.sela, crop: 'grain', ...extra});
const stock = k => box.p.gameplay.player.inventory[k] || 0;
const facts = () => box.p.state.actors.player.facts;
const projection = () => domainRegistry.project('hired_hands');
const row = () => livelihoodsOf(box.p.state).find(r => r.id === 'frontier.village.courtyard_plot');

test('hire once with a wage paid ahead; the plot becomes the hand\'s and the bed is sown from real seed', () => {
    setup(100, 4);
    const money = box.p.external.money, seeds = stock(K.seed);
    hire();
    assert.equal(box.p.external.money, money - 5);
    assert.equal(projection().hires[0].earned, 5, 'the hand\'s earnings are tallied on the hire record');
    assert.equal(stock(K.seed), seeds - 1, 'one real seed packet sown');
    assert.equal(facts()['mg.cropStage'], 'tended');
    assert.throws(() => hire({hand: I.orin}), /already tends this/);
    assert.equal(projection().jobs[0].hired, true);
});

test('cycles run on the clock while away; harvest goes to storage; the hand reports once; wage paid each week', () => {
    setup(100, 4);
    hire();
    const m0 = box.p.external.money;
    advance(2 * WEEK + 100); // two boundaries crossed in one away stretch
    assert.equal(box.p.external.money, m0 - 10, 'two more weeks paid, nothing more');
    assert.equal(stock(K.grain) > 0, true);
    assert.equal(stock(K.grain) % 5, 0);
    assert.equal(stock(K.seed) + stock(K.grain) / 5 <= 4, true, 'grain never exceeds the seed that went in');
    const rows = handDigestRows(0).filter(r => /brought in/.test(r.text));
    assert.equal(rows.length, 1, 'one report line for the whole pass');
    assert.match(rows[0].text, /^Sela: /);
    const r = row();
    assert.equal(r.stage, 'automated'); assert.equal(r.runBy, 'hire');
    assert.equal(r.income.per, 'week'); assert.equal(r.obligations.kind, 'wage-terms');
});

test('without seed the bed sits empty and the hand says so; no grain is invented', () => {
    setup(100, 1);
    hire();
    advance(2 * WEEK);
    assert.equal(stock(K.grain), 5);
    assert.equal(stock(K.seed), 0);
    assert.equal(handDigestRows(0).some(r => /no seed packets/.test(r.text)), true);
    advance(WEEK);
    assert.equal(stock(K.grain), 5, 'nothing more without seed');
});

test('a purse that cannot pay ends the hire at that week boundary with a line, no debt, no later work', () => {
    setup(300, 4);
    hire();
    box.p = {...box.p, external: {money: 5}}; // covers exactly one more week
    advance(5 * WEEK);
    const h = projection().hires[0];
    assert.equal(h.status, 'ended'); assert.equal(h.endReason, 'unpaid');
    assert.equal(h.endedAt, 2 * WEEK, 'ends at the second boundary, week 3 of work is not paid');
    assert.equal(box.p.external.money, 0);
    assert.equal(h.workedTo, 2 * WEEK, 'no work after the end');
    assert.equal(handDigestRows(0).some(r => /Nothing is owed/.test(r.text)), true);
    assert.equal(/debt|"owed"/.test(JSON.stringify(domainRegistry.save({}).hired_hands)), false, 'no debt row was written');
    assert.equal(box.p.external.money, 0, 'the purse never went below zero');
    assert.equal(row().stage === 'automated', false);
});

test('fire ends it, keeps the days worked, leaves the crop where it stands, and hands the plot back', () => {
    setup(100, 4);
    hire();
    advance(4 * 1440);
    const grain = stock(K.grain);
    cmd('fire', {jobId: PLOT_JOB});
    assert.equal(projection().hires[0].status, 'ended');
    assert.equal(stock(K.grain) >= grain, true);
    assert.equal(row().runBy, 'self');
    advance(2 * WEEK);
    assert.equal(stock(K.grain), grain, 'no harvest after the fire');
    assert.equal(projection().hires[0].workedTo < 2 * WEEK, true, 'nothing runs after a fire');
    assert.throws(() => cmd('fire', {jobId: PLOT_JOB}), /No one is hired/);
});

test('save and reload keep the hire; a read-only tab settles on a later tick (nothing lost away)', () => {
    const env = setup(100, 4);
    hire();
    const saved = JSON.parse(JSON.stringify(domainRegistry.save({})));
    assert.equal(saved.hired_hands.hires[PLOT_JOB].status, 'active');
    domainRegistry.load({});
    assert.equal(projection().hires.length, 0);
    domainRegistry.load(saved);
    assert.equal(projection().hires[0].name, 'Sela');
    assert.deepEqual(loadExpansionState(JSON.parse(JSON.stringify(box.p.state)), registry), box.p.state, 'the state with the new fact round-trips');
    env.readOnly(true);
    advance(WEEK + 50);
    assert.equal(stock(K.grain), 0, 'a failed commit rolls back');
    env.readOnly(false);
    advance(10);
    assert.equal(stock(K.grain) > 0, true, 'the later tick settles the whole stretch');
});

test('failure scenario: an untouched save gets no new key and the plot row stays the player\'s own', () => {
    setup(100, 2);
    assert.equal(Object.hasOwn(domainRegistry.save({}), 'hired_hands'), false);
    assert.equal(row().runBy, 'self');
    advance(3 * WEEK);
    assert.equal(Object.hasOwn(domainRegistry.save({}), 'hired_hands'), false);
    assert.throws(() => hire({hand: 'nobody'}), /./);
    assert.equal(Object.hasOwn(domainRegistry.save({}), 'hired_hands'), false, 'a refused hire writes nothing');
    domainRegistry.load({hired_hands: {family: 'other@1'}});
    assert.equal(projection().hires.length, 0);
});

test('the hand never double-harvests: a crop the player took from the bed pays nothing, and the hand will not sow over the player\'s crop', () => {
    setup(100, 4);
    hire();
    box.p.state.actors.player.facts['mg.cropStage'] = 'harvested'; // the player took the standing crop
    advance(4 * 1440);
    assert.equal(stock(K.grain), 0, 'no yield for a crop that was not standing');
    const h = projection().hires[0]; assert.equal(h.cycles, 0);
});

test('a hand with no seed says so on the first pass and at each paid week, not on every settled minute', () => {
    setup(300, 0);
    hire();
    for (let i = 0; i < 120; i++) advance(1); // two hours, one minute at a time (the live game ticks like this)
    const said = () => handDigestRows(0).filter(r => /no seed packets/.test(r.text)).length;
    assert.equal(said(), 1, 'once on the first pass');
    advance(WEEK);
    assert.equal(said(), 2, 'again when the week is paid');
});

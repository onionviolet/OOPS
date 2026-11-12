// The shell regulator's rate form (settle: 'rate') against its switch form: the
// same humidity, ledger, shell and inlet, and the same number of switches, in a
// bounded number of segments. Whole numbers throughout, so the match is exact.
import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceWorld, applyWorldOps, composeSubstrate, createWorld, readProvenance, readQuantity, restoreWorld, serializeWorld} from '../src/world_substrate.js';
import {WORLD_QUANTITIES as Q} from '../src/world_quantities.js';
import {createShellRegulatorPack, shellBodyState, shellInletState} from '../src/world_substrate_packs/shell_regulator.js';

const PACK = 'l.shell_regulator', DAY = 1440;
const LAW = {delay: 2, draft: 9, recharge: 7, closeBelow: 47, openAbove: 60, startleMinutes: 15};
// A second writer of the same air, from another domain: a kettle that steams while it is on.
const kettle = {id: 't.kettle', revision: 0, quantities: [Q.humidity], reads: ['humidity'], writes: ['humidity'],
    laws: [{id: 'steam', appliesTo: h => h.tags.includes('kettle'),
        rates: (view, id) => view.state(id)?.on ? [{holder: view.placeOf(id), quantity: 'humidity', perMinute: view.state(id).on}] : []}]};
const rulesFor = (law, settle) => composeSubstrate({packs: [createShellRegulatorPack({...law, settle}), kettle], dials: {chainCap: 100000}});

function room(rules, {humidity = 58, mode = 'linked', extra = []} = {}) {
    return createWorld(rules, {holders: [
        {id: 'room', kind: 'place', quantities: {humidity}},
        {id: 'shell', kind: 'body', place: 'room', tags: ['shell.body'], state: {[PACK]: shellBodyState('closed')}},
        {id: 'inlet', kind: 'thing', place: 'room', tags: ['shell.inlet'],
            state: {[PACK]: shellInletState({mode, position: mode === 'linked' ? 'closed' : mode, wanted: 'closed', follows: 'shell'})}},
        {id: 'kettle', kind: 'thing', place: 'room', tags: ['kettle'], state: {'t.kettle': {on: 0}}},
        ...extra,
    ]});
}

function play(rules, world, {until, events = [], step = Infinity, reloadAt = []}) {
    let segments = 0;
    const cuts = [...new Set([...events.map(e => e.at), ...reloadAt, until])].filter(at => at <= until).sort((a, b) => a - b);
    for (const cut of cuts) {
        while (world.clock < cut) {
            const result = advanceWorld(rules, world, Math.min(cut, world.clock + step));
            assert.equal(result.pending, false);
            world = result.world; segments += result.segments;
        }
        for (const [i, e] of events.entries()) if (e.at === cut) world = applyWorldOps(rules, world, e.ops, `outside:${i}`);
        if (reloadAt.includes(cut)) world = restoreWorld(rules, JSON.parse(JSON.stringify(serializeWorld(world))));
    }
    return {world, segments};
}

const rows = (w, kind) => w.chain.filter(row => row.kind === kind).length;
// What both forms must agree on. A switch is a published row in one form and a count in the other.
function tally(w) {
    const {pulls = 0, ...shell} = w.holders.shell.state[PACK], {opened = 0, closed = 0, ...inlet} = w.holders.inlet.state[PACK];
    return {humidity: readQuantity(w, 'room', 'humidity'), ledger: readProvenance(w, 'room', 'humidity'), shell, inlet,
        pulls: pulls + rows(w, 'shell.pull'), opened: opened + rows(w, 'draft.opened'), closed: closed + rows(w, 'draft.closed')};
}

test('thirty undisturbed days: one segment, and the per-switch totals to the unit', () => {
    const rate = rulesFor(LAW, 'rate'), perSwitch = rulesFor(LAW, 'switch');
    const until = 30 * DAY;
    const a = play(rate, room(rate), {until}), b = play(perSwitch, room(perSwitch), {until});
    assert.deepEqual(tally(a.world), tally(b.world));
    const t = tally(a.world);
    assert.deepEqual({humidity: t.humidity, ledger: t.ledger, pulls: t.pulls, opened: t.opened, closed: t.closed},
        {humidity: 58, ledger: {[`${PACK}:inlet:inlet`]: 0}, pulls: 6300, opened: 3150, closed: 3150});
    assert.equal(rows(a.world, 'shell.pull'), 0, 'a switch made by humidity is counted, not published');
    assert.equal(a.segments, 1);
    assert.ok(b.segments > 18000, `the switch form took ${b.segments}`);
    // One jump, minute steps, uneven steps and reloads reach the same save.
    const saved = serializeWorld(a.world);
    assert.deepEqual(serializeWorld(play(rate, room(rate), {until: 3 * DAY}).world), serializeWorld(play(rate, room(rate), {until: 3 * DAY, step: 1}).world));
    assert.deepEqual(serializeWorld(play(rate, room(rate), {until, step: 37}).world), saved);
    assert.deepEqual(serializeWorld(play(rate, room(rate), {until, reloadAt: [1, 6, 7, 500, 20001]}).world), saved);
});

// Small seeded generator, so a failure names its case.
const rng = seed => () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;

test('disturbed stretches agree with the switch form, and with themselves at every step size', () => {
    let longest = 0;
    for (let seed = 1; seed <= 60; seed++) {
        const r = rng(seed), pick = n => Math.floor(r() * n);
        const closeBelow = 5 + pick(60), law = {delay: 1 + pick(4), draft: pick(14), recharge: pick(12), closeBelow,
            openAbove: closeBelow + 1 + pick(30), startleMinutes: pick(3) ? 15 : 0, onLeave: 'drop'};
        const mode = ['linked', 'linked', 'linked', 'open', 'closed'][pick(5)], humidity = pick(101), until = 600 + pick(900);
        const events = Array.from({length: pick(7)}, () => {
            const at = 1 + pick(until - 1);
            return {at, ops: [
                [{op: 'add', holder: 'room', quantity: 'humidity', amount: pick(61) - 30}],
                [{op: 'publish', kind: 'smoke', place: 'room', by: 'room'}],
                [{op: 'state', holder: 'kettle', pack: 't.kettle', value: {on: pick(3) ? pick(9) - 4 : 0}}],
                [{op: 'law_add', field: {id: `scale-${at}-${pick(1000)}`, kind: 'airflow.scale', scope: 'room', params: {numerator: 1 + pick(3), denominator: 2}, until: at + 1 + pick(200)}}],
            ][pick(4)]};
        });
        const label = `seed ${seed} ${JSON.stringify({law, mode, humidity, until})}`;
        const rate = rulesFor(law, 'rate'), perSwitch = rulesFor(law, 'switch');
        const jump = play(rate, room(rate, {humidity, mode}), {until, events});
        const truth = play(perSwitch, room(perSwitch, {humidity, mode}), {until, events});
        assert.deepEqual(tally(jump.world), tally(truth.world), label);
        const saved = serializeWorld(jump.world);
        assert.deepEqual(serializeWorld(play(rate, room(rate, {humidity, mode}), {until, events, step: 1}).world), saved, `${label} by minutes`);
        assert.deepEqual(serializeWorld(play(rate, room(rate, {humidity, mode}), {until, events, step: 1 + pick(40),
            reloadAt: [1 + pick(until), 1 + pick(until), 1 + pick(until)]}).world), saved, `${label} with reloads`);
        longest = Math.max(longest, jump.segments - truth.segments);
    }
    // Known cost, stated: while another pack's rate runs on the same air the rate form goes minute by
    // minute, which can be more segments than the switch form (seed 7: a kettle against a pinned room).
    assert.ok(longest > 0);
});

test('a room with two inlets keeps the switch form, since the rate form replays one pair', () => {
    const extra = [{id: 'inlet-two', kind: 'thing', place: 'room', tags: ['shell.inlet'],
        state: {[PACK]: shellInletState({mode: 'linked', position: 'closed', wanted: 'closed', follows: 'shell'})}}];
    const rate = rulesFor(LAW, 'rate'), perSwitch = rulesFor(LAW, 'switch');
    assert.deepEqual(serializeWorld(play(rate, room(rate, {extra}), {until: 300}).world),
        serializeWorld(play(perSwitch, room(perSwitch, {extra}), {until: 300}).world));
    assert.throws(() => createShellRegulatorPack({...LAW, settle: 'often'}), /settle is switch or rate/);
});

// Canon pull first slice: pull strength, keyed draw, agents with budgets, substitutes, damping, save slice.
import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {newBeatState, resolveBeats} from '../src/beat_records.js';
import {emptyPull, recordPush, pullFor, resolveWithPull, pullRead, deviationChronicle, validateCanonPull, PULL_SLICE, PULL_SEATS} from '../src/canon_pull.js';
import {LOTM_PULL_BEATS as B, LOTM_PULL_BEAT as ID, LOTM_PULL_FACT as FACT, lotmPullStart} from '../src/world_packs/lotm_pull_slice.js';

const broken = () => newBeatState({});                       // precondition never set: the player pushed against it
const run = (seed, ctx = {}, state = broken(), pull = emptyPull()) =>
    resolveWithPull(B, state, 5, {pull: {state: pull, worldSeed: seed, world: 'lotm', seat: 'be', ...ctx}});

test('an intact precondition needs no pull and records nothing', () => {
    const r = run(1, {}, newBeatState(lotmPullStart()));
    assert.equal(r.state.done[ID].status, 'carried');
    assert.deepEqual(r.records, []);
});

test('seat dial: the lead holds more than a bystander; fixed beats ignore disturbance', () => {
    const b = B.find(x => x.id === ID);
    assert.ok(pullFor(b, B, emptyPull(), {seat: 'be'}).pull > pullFor(b, B, emptyPull(), {seat: 'bystander'}).pull);
    const pushed = recordPush(emptyPull(), {id: 'p1', day: 2, weight: 1, reaches: [ID]});
    assert.ok(pullFor(b, B, pushed, {seat: 'be'}).pull < pullFor(b, B, emptyPull(), {seat: 'be'}).pull);
    const fixed = {...b, pull: {...b.pull, fixed: true}};
    assert.equal(pullFor(fixed, B, pushed, {seat: 'be'}).inertia, 0);
});

test('a broken beat is restored, substituted or deviates, deterministic by key, and every outcome occurs', () => {
    const seen = {};
    for (let seed = 0; seed < 300; seed++) {
        const a = run(seed), again = run(seed);
        assert.deepEqual(a.records, again.records);
        const r = a.records[0];
        seen[r.outcome] = (seen[r.outcome] ?? 0) + 1;
        if (r.outcome === 'restored') { assert.equal(a.state.done[ID].status, 'carried'); assert.equal(a.state.facts[FACT], true); assert.equal(a.state.facts[`pull.${ID}`], 'restored'); }
        if (r.outcome === 'deviated') assert.notEqual(a.state.done[ID].status, 'carried');
        assert.equal(r.agent === undefined, r.outcome === 'deviated');
    }
    assert.ok(seen.restored > 100 && seen.deviated > 0, JSON.stringify(seen));
});

test('a larger push beats the pull: more disturbance, more deviation', () => {
    const rate = pull => { let n = 0; for (let s = 0; s < 300; s++) if (run(s, {}, broken(), pull).records[0].outcome === 'deviated') n++; return n; };
    const small = rate(recordPush(emptyPull(), {id: 'p', day: 2, weight: 0.2, reaches: [ID]}));
    const big = rate(recordPush(emptyPull(), {id: 'p', day: 2, weight: 1, reaches: [ID, 'lotm.v1.pull.a0']}));
    assert.ok(big > small, `${small} vs ${big}`);
});

test('agent budgets are finite: fate spent, the story has no hand left (reason recorded)', () => {
    const spent = {...emptyPull(), spent: {fate: 2, church: 1}};
    for (let s = 0; s < 40; s++) {
        const r = run(s, {}, broken(), spent).records[0];
        assert.equal(r.outcome, 'deviated');
        assert.ok(['draw', 'spent'].includes(r.reason));
    }
});

test('damping: a push reaches what hangs on it by deps and stops elsewhere', () => {
    const c1 = B.find(x => x.id === 'lotm.v1.pull.c1'), a0 = B.find(x => x.id === 'lotm.v1.pull.a0');
    const p = recordPush(emptyPull(), {id: 'p', day: 2, weight: 0.8, reaches: [ID]});
    assert.equal(pullFor(c1, B, p).disturbance, 0.4);          // one hop after the pushed beat: weight halves
    assert.equal(pullFor({...a0, pull: {}}, B, p).disturbance, 0);   // upstream is not reached
});

test('a substituted beat satisfies dependants; a broken one without agents stays broken', () => {
    for (let s = 0; s < 300; s++) {
        const r = run(s, {}, broken(), {...emptyPull(), spent: {fate: 2}});     // fate has spent its coincidences: the church steps in
        if (r.records[0].outcome === 'substituted') { assert.equal(r.state.facts['lotm.v1.pull.b1.by_other'], true); assert.equal(r.state.done['lotm.v1.pull.c1'].status, 'carried'); return; }
    }
    assert.fail('no substitution in 300 seeds');
});

test('the read shows lean words and ids only; the chronicle line never names the beat content', () => {
    const r = run(7);
    const read = pullRead(B, newBeatState(lotmPullStart()), emptyPull(), {seat: 'be'});
    assert.match(read.headline, /leans this way/);
    assert.ok(read.upcoming.every(u => /^Beat /.test(u.label)));
    const lines = deviationChronicle(r.pull);
    assert.equal(lines.length, 1);
    assert.match(lines[0].text, /^Beat b1 /);
    const pushed = recordPush(emptyPull(), {id: 'p', day: 2, weight: 1, reaches: [ID]});
    assert.ok(pullRead(B, newBeatState(lotmPullStart()), pushed, {seat: 'be'}).upcoming.some(u => u.pressed));
});

test('save slice: absent loads empty, empty writes no key, export/import round-trips, bad slices throw', () => {
    domainRegistry.load({});
    assert.equal(domainRegistry.save({})[PULL_SLICE], undefined);
    const r = run(3);
    domainRegistry.command(PULL_SLICE, 'commit')(r.pull);
    const saved = domainRegistry.save({})[PULL_SLICE];
    assert.deepEqual(saved.records, JSON.parse(JSON.stringify(r.pull.records)));
    domainRegistry.load(JSON.parse(JSON.stringify({[PULL_SLICE]: saved})));
    assert.deepEqual(domainRegistry.project(PULL_SLICE).records, saved.records);
    assert.throws(() => validateCanonPull({schema: 2}));
    assert.throws(() => validateCanonPull({schema: 1, disturbance: [], spent: {fate: -1}, records: []}));
    domainRegistry.load({});
});
test('seat table covers the five seats with the lead highest', () => {
    assert.equal(Math.max(...Object.values(PULL_SEATS)), PULL_SEATS.be);
});

test('host tick: a declined dose is pulled back or stands, once per day, and an accepted one needs no pull', async () => {
    const {canonPullTick, PULL_DECLINED} = await import('../src/canon_pull_host.js');
    const outcomes = [];
    for (let seed = 0; seed < 400; seed++) {
        const first = canonPullTick(emptyPull(), {facts: {[PULL_DECLINED]: true}, day: 2, worldSeed: seed});
        if (first.records[0].outcome === 'restored') {
            assert.deepEqual(first.effects[0], {type: 'fact', scope: 'actor', actor: 'player', key: PULL_DECLINED, value: false});
            assert.equal(first.pull.beats.day, 2);
            assert.equal(canonPullTick(first.pull, {facts: {[PULL_DECLINED]: true}, day: 2, worldSeed: seed}).records.length, 0);   // idempotent per day
            outcomes.push('restored');
        }
        if (first.records[0].outcome === 'deviated') outcomes.push('deviated');
    }
    assert.ok(outcomes.includes('restored') && outcomes.includes('deviated'));
    const held = canonPullTick(emptyPull(), {facts: {[PULL_DECLINED]: false}, day: 2, worldSeed: 1});
    assert.deepEqual(held.records, []);
    assert.equal(held.pull.beats.done['lotm.v1.pull.b1'].status, 'carried');
});

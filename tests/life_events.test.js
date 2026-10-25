import test from 'node:test';
import assert from 'node:assert/strict';
import {createVillageLives, advanceVillageLives, bondStatuses} from '../src/npc_lives.js';
import {householdRelationships} from '../src/relationship_view.js';
import {freshEvents, scan, resolve, bondAction, broadcast, introduceCandidates, deathForecast, validateEvents, migrateEvents, MEMORY_CAP, BROADCAST_CAP} from '../src/life_events.js';

const at = (lives, y) => advanceVillageLives(lives, y);
const baseline = (lives, y) => scan(freshEvents(), at(lives, y), y).state;
const run = (lives, s, y) => scan(s, at(lives, y), y);

test('a missing slice baselines silently: no retroactive grief for deaths already past', () => {
    const lives = createVillageLives(1000, 7), r = scan(freshEvents(), at(lives, 1100), 1100);
    assert.deepEqual(r.state.events, []);
    assert.deepEqual(r.deaths, []);
    assert.equal(r.state.lastYear, 1100);
    assert.deepEqual(run(lives, r.state, 1100).notes, [], 'a second scan of the same year adds nothing');
});

test('came of age fires once, keyed to the person who actually ages', () => {
    const lives = createVillageLives(1000, 7);
    let s = baseline(lives, 1000);
    let r = run(lives, s, 1013);
    assert.deepEqual(r.state.events.map(e => e.id), []);
    r = run(lives, s, 1014);
    assert.deepEqual(r.state.events.map(e => e.id), ['age:lio']);
    const again = run(lives, r.state, 1030);
    assert.equal(again.state.events.filter(e => e.id === 'age:lio').length, 1);
    assert.ok(again.state.events.some(e => e.id === 'age:neri'));
});

test('a death writes grief for the surviving spouse and adult child, a cause lesson and a broadcast', () => {
    const lives = createVillageLives(1000, 7), maia = lives.people.find(p => p.id === 'maia'), oren = lives.people.find(p => p.id === 'oren');
    const first = maia.deathYear < oren.deathYear ? maia : oren, other = first === maia ? oren : maia;
    let s = baseline(lives, 1000);
    s = run(lives, s, first.deathYear - 1).state;
    const r = run(lives, s, first.deathYear);
    const ids = r.state.events.map(e => e.id);
    assert.ok(ids.includes(`grief:${other.id}:${first.id}`) && ids.includes(`grief:lio:${first.id}`), ids.join());
    assert.deepEqual(r.deaths.map(d => d.kind), ['age']);
    assert.equal(r.state.lessons.age.n, 1);
    assert.ok(r.state.mourning[other.id] > first.deathYear);
    assert.ok(r.state.memories.lio.some(m => m.id === `death:${first.id}`), 'broadcast reached the household');
    assert.ok(bondStatuses(at(lives, first.deathYear), r.state.bonds, first.deathYear).some(b => b.status === 'widowed' && b.a === other.id));
    // mourning fades by itself
    assert.equal(run(lives, r.state, first.deathYear + 3).state.mourning[other.id], undefined);
});

test('a fever winter orphans the minors; each choice has a cost, a blameless free path and a record', () => {
    const lives = createVillageLives(1000, 7, 'fever_winter');
    let s = baseline(lives, 1000);
    const r = run(lives, s, 1010);
    const orphans = r.state.events.filter(e => e.kind === 'orphan').map(e => e.id);
    assert.deepEqual(orphans.sort(), ['orphan:lio', 'orphan:neri']);
    assert.equal(r.state.lessons.illness.n, 2);
    assert.deepEqual(r.deaths.map(d => d.kind), ['illness', 'illness']);
    const L = at(lives, 1010);
    assert.throws(() => resolve(r.state, L, 1010, 'orphan:neri', 'take_in', 5), /30 coins/);
    const done = resolve(r.state, L, 1010, 'orphan:neri', 'take_in', 100);
    assert.equal(done.cost, 30);
    assert.deepEqual(done.state.wards.neri, {by: 'player', since: 1010});
    const free = resolve(done.state, L, 1010, 'orphan:lio', 'village', 0);
    assert.equal(free.cost, 0);
    assert.equal(free.state.wards.lio.by, 'village');
    assert.throws(() => resolve(free.state, L, 1010, 'orphan:lio', 'village', 0), /passed/);
    assert.deepEqual(validateEvents(JSON.parse(JSON.stringify(free.state))), free.state);
});

test('forecasts read only deaths witnessed since the slice began (AD9)', () => {
    const lives = createVillageLives(1000, 7);
    assert.deepEqual(deathForecast(baseline(lives, 1100)), [], 'old deaths were never seen');
    const s = run(lives, baseline(lives, 1000), 1100).state;
    const f = deathForecast(s);
    assert.equal(f[0].cause, 'age');
    assert.match(f[0].text, /Old age has taken/);
});

test('status machine: introduce, ripen, quarrel, mend and part all have a path back', () => {
    let lives = createVillageLives(1000, 7);
    let s = baseline(lives, 1000);
    // Iona is an adult recruit; Lio is unreserved only until Rhea. Use a hand-built pair to isolate the overlay.
    lives = addAdults(lives);
    s = baseline(lives, 1000);
    const L = at(lives, 1000), c = introduceCandidates(s, L, 1000);
    assert.ok(c.some(x => x.a === 'ada' && x.b === 'bo'));
    const r = bondAction(s, L, 1000, 'introduce', 'ada', 'bo', 10);
    assert.equal(r.cost, 5);
    assert.equal(r.state.bonds['ada|bo'].status, 'courting');
    assert.throws(() => bondAction(r.state, L, 1000, 'introduce', 'ada', 'bo', 10), /cannot be introduced/);
    const parted = bondAction(r.state, L, 1000, 'part', 'ada', 'bo', 0);
    assert.deepEqual(parted.state.bonds, {});
    // courting ripens into marriage
    let t = run(lives, r.state, 1001).state;
    assert.equal(t.bonds['ada|bo'].status, 'married');
    // force a quarrel dial, check mend and the by-itself path
    const q = structuredClone(t);q.dial.quarrelPermille = 1000;
    const e = run(lives, q, 1002).state;
    assert.equal(e.bonds['ada|bo'].status, 'estranged');
    const mended = bondAction(e, at(lives, 1002), 1002, 'mend', 'ada', 'bo', 20);
    assert.equal(mended.state.bonds['ada|bo'].status, 'married');
    assert.equal(mended.cost, 10);
    const calm = structuredClone(e);calm.dial.quarrelPermille = 0;
    assert.equal(run(lives, calm, 1002 + calm.dial.healYears).state.bonds['ada|bo'].status, 'married', 'time restores it');
});

test('scripted marriages quarrel and heal without leaving a stray overlay', () => {
    const lives = createVillageLives(1000, 7);
    let s = baseline(lives, 1030);
    s.dial.quarrelPermille = 1000;
    s = run(lives, s, 1031).state;
    assert.equal(s.bonds['lio|rhea'].status, 'estranged');
    s.dial.quarrelPermille = 0;
    s = run(lives, s, 1031 + s.dial.healYears).state;
    assert.deepEqual(s.bonds, {});
    assert.equal(bondStatuses(at(lives, 1034), s.bonds, 1034)[0].status, 'married');
});

test('broadcast is capped by recipients and per person, and never repeats a fact', () => {
    let s = freshEvents();
    const ids = Array.from({length: 20}, (_, i) => `p${i}`);
    const r = broadcast(s, {id: 'f', text: 'x'}, ids, 5);
    assert.equal(r.heard.length, BROADCAST_CAP);
    assert.equal(broadcast(r.state, {id: 'f', text: 'x'}, ids, 6).heard.length, 0);
    let t = r.state;
    for(let i = 0; i < 30; i++) t = broadcast(t, {id: `g${i}`, text: 'y'}, ['p0'], 10 + i).state;
    assert.equal(t.memories.p0.length, MEMORY_CAP);
});

test('migration: absent slice is fresh, bad slices are refused', () => {
    assert.deepEqual(migrateEvents(null), freshEvents());
    assert.throws(() => migrateEvents({...freshEvents(), lessons: {nope: {n: 1, ages: []}}}));
});

function addAdults(lives) {
    const l = structuredClone(lives);
    for(const [id, name] of [['ada', 'Ada'], ['bo', 'Bo']]) {
        l.people.push({id, name, birthYear: 970, joinedYear: 1000, deathYear: 1070, parents: [], spouseId: null});
        l.events.push({id: `death:${id}`, year: 1070, kind: 'death', text: `Word from Village: ${name} died peacefully.`});
    }
    l.events.sort((a, b) => a.year - b.year || a.id.localeCompare(b.id));
    return l;
}

test('relationship view exposes statuses and broadcast memories as a household source', () => {
    const lives = createVillageLives(1000, 7), s = run(lives, baseline(lives, 1000), 1100).state, L = at(lives, 1100);
    const view = householdRelationships(L, s, 1100);
    assert.equal(view.scope, 'authoritative');
    assert.ok(view.memories.lio.every(m => m.source === 'household'));
    assert.ok(Object.values(view.statuses).every(r => ['courting', 'married', 'estranged', 'widowed'].includes(r.status)));
});

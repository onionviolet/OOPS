import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveBeats, newBeatState} from '../src/beat_records.js';
import {VILLAGE_BEATS, LEAD_ID, leadStartFacts} from '../src/world_packs/village_lead_line.js';
import {canonPullTick} from '../src/canon_pull_host.js';
import {deedFacts, deedView, deed_catalog, routeIsOwn, observeBeatRoutes, observedRoutes, clearObservedRoutes} from '../src/deeds.js';
import {achievement_catalog, readProfile, unlockEarned, PROFILE_KEY} from '../src/achievements.js';

const memory = () => { const m = new Map(); return {getItem: k => m.has(k) ? m.get(k) : null, setItem: (k, v) => m.set(k, String(v)), m}; };
const earned = facts => deed_catalog.filter(d => d.test(facts)).map(d => d.id);

test('a turning met by the book route is not another way; the other branch or the player\'s own fact is', () => {
    const run = facts => resolveBeats(VILLAGE_BEATS, newBeatState({...leadStartFacts(), ...facts}), 4, {lives: [{id: LEAD_ID}]}).results;
    const taught = run({}).find(r => r.beat === 'vl.route_taught');
    assert.equal(taught.status, 'carried'); assert.equal(routeIsOwn(taught), false);
    const alone = run({'village.teacherHours': false}).find(r => r.beat === 'vl.route_taught');
    assert.equal(alone.status, 'altered'); assert.ok(alone.via.length); assert.equal(routeIsOwn(alone), true);
    const own = resolveBeats(VILLAGE_BEATS, newBeatState(leadStartFacts()), 4, {lives: [{id: LEAD_ID}], writtenBy: f => f === 'village.craftsmanPresent' ? 'emergent' : 'canon'}).results;
    assert.equal(routeIsOwn(own.find(r => r.beat === 'vl.route_taught')), true);
    clearObservedRoutes();
    observeBeatRoutes(run({'village.teacherHours': false}).map(r => ({...r, actor: LEAD_ID})), [LEAD_ID]);   // the host stamps the actor
    observeBeatRoutes(run({}).map(r => ({...r, actor: 'someone_else', status: 'altered'})), [LEAD_ID]);   // only the lead's routes count
    assert.deepEqual(observedRoutes(), ['vl.route_taught']);
    assert.ok(earned(deedFacts({routes: observedRoutes()})).includes('deed.own_road'));
    clearObservedRoutes();
});

test('canon pull outcomes on the walk-away day read as the three hidden another-way deeds', () => {
    const away = {'lotm.pull.b1.known': true, 'lotm.pull.b1.present': false};
    const outcomes = new Map();
    for (let seed = 0; seed < 40 && outcomes.size < 3; seed++) {
        let pull; for (let day = 1; day <= 3; day++) pull = canonPullTick(pull, {facts: away, day, seat: 'be', worldSeed: seed}).pull;
        const r = pull.records.at(-1); if (r && !outcomes.has(r.outcome)) outcomes.set(r.outcome, pull);
    }
    assert.ok(outcomes.has('restored'), 'some seed has fate carry the day to the lead');
    assert.deepEqual(earned(deedFacts({canonPull: outcomes.get('restored')})), ['deed.found_you']);
    if (outcomes.has('substituted')) assert.deepEqual(earned(deedFacts({canonPull: outcomes.get('substituted')})), ['deed.in_your_place']);
    if (outcomes.has('deviated')) assert.deepEqual(earned(deedFacts({canonPull: outcomes.get('deviated')})), ['deed.off_the_page']);
    // Present on the day: carried the book's way, no deed.
    let pull; for (let day = 1; day <= 3; day++) pull = canonPullTick(pull, {facts: {'lotm.pull.b1.known': true, 'lotm.pull.b1.present': true}, day, worldSeed: 1}).pull;
    assert.deepEqual(earned(deedFacts({canonPull: pull})), []);
});

test('firsts and lives read the records their owners keep', () => {
    const f = deedFacts({
        residences: {properties: {manor: {brood: {roster: [{stage: 'egg'}, {stage: 'juvenile'}]}}}},
        continuation: {lives: {a: {ended: true, initial: {}}, b: {attempt: {count: 1, tokens: ['t']}, initial: {expansion: {actors: {player: {worldId: 'book.mol.cyoria'}}, motherOfLearning: {entryProfile: 'book.mol.zorian@1'}}}}}},
        lifeRecord: {observed: {worldId: 'x', crossings: {'book.hp.lead.world': 1}}},
        expansion: {actors: {player: {worldId: 'book.hp.lead.world', facts: Object.fromEntries(['transfiguration', 'charms', 'herbology', 'potions', 'astronomy', 'defence', 'history']
            .map((s, i) => [`hp.lead.exam.band.${s}`, i ? 'pass' : 'top']))}}, chronicle: {life: {experience: {generation: 3}}}}});
    assert.equal(f.hatched, true); assert.equal(f.loopsLived, 1); assert.equal(f.livesEnded, 2); assert.equal(f.crossings, 1); assert.equal(f.papersSat, 7); assert.equal(f.topPapers, 1);
    const ids = earned(f);
    for (const id of ['deed.first_hatch', 'deed.second_life', 'deed.crossing', 'deed.exams_sat', 'deed.top_paper', 'deed.month_again']) assert.ok(ids.includes(id), id);
    assert.ok(!ids.includes('deed.many_lives'));
    assert.deepEqual(earned(deedFacts({})), [], 'an empty game earns nothing');
    assert.equal(deedFacts({expansion: {motherOfLearning: {runs: 3}}}).loopsLived, 2);
});

test('hidden deeds show nothing until earned; deeds share the profile store and survive a new run', () => {
    const s = memory();
    unlockEarned(s, {counters: {}, titlesHeld: 1, named: 0, relics: 0});            // a naming-row unlock already held
    const got = unlockEarned(s, deedFacts({canonPull: {records: [{outcome: 'restored'}]}}), 5, deed_catalog);
    assert.deepEqual(got, ['deed.found_you']);
    const profile = readProfile(s);
    assert.ok(profile.unlocked.first_title && profile.unlocked['deed.found_you'], 'one store, both catalogs');
    const view = deedView(profile), another = view.find(g => g.id === 'another_way');
    assert.deepEqual(another.rows.map(r => r.id), ['deed.own_road', 'deed.found_you']);
    assert.equal(another.unfound, 2);
    assert.ok(!JSON.stringify(another).includes('someone else carried'), 'unearned hidden text never reaches the view');
    // A new run replaces the save, not the profile key.
    s.m.set('save data', '{}');
    assert.ok(readProfile(s).unlocked['deed.found_you']); assert.equal(PROFILE_KEY, 'yairpg.profile.v1');
    assert.equal(unlockEarned(s, deedFacts({canonPull: {records: [{outcome: 'restored'}]}}), 9, deed_catalog).length, 0, 'an unlock is told once');
    assert.ok(deed_catalog.every(d => !achievement_catalog.some(a => a.id === d.id)), 'ids never collide with the naming rows');
});

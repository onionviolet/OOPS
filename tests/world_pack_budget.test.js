// WP15 / P9Q45: a few hundred students over many simulated days, checked
// against the pack's declared budgets. Time limits are per query against the
// declared presenceQueryMicros, so a slow CI machine still has headroom.
import test from 'node:test';
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {loadWorldPacks} from '../src/world_pack_loader.js';
import {createPopulation} from '../src/world_pack_population.js';
import {createSection, revealPerson, reconcileWorldPackSaves, sectionBytes} from '../src/world_pack_save.js';
import {MEMBER_DRAWS} from '../src/world_pack_manifest.js';
import {makeSchoolPack, makeRulebookPack, fakeRuleAdapter, FEATURES} from './world_pack_school_fixture.js';

const DAY = 1440, DAYS = 360, SAMPLES = [120, 545, 610, 700, 790, 850];
const INSTANCE = 'test.school.main';

function sweep(pop) {
    const ids = pop.everyone(); let queries = 0, checksum = 0;
    const counts = new Map();
    for (let day = 0; day < DAYS; day++) for (const minute of SAMPLES) for (const id of ids) {
        const at = pop.presenceAt(id, day * DAY + minute); queries++;
        const key = at.placeId ?? 'away';
        counts.set(key, (counts.get(key) || 0) + 1);
        for (let i = 0; i < key.length; i++) checksum = (checksum * 31 + key.charCodeAt(i)) >>> 0;
    }
    return {queries, checksum, counts};
}

test('load budget: hundreds of students across a school year stay inside declared budgets', () => {
    const t0 = performance.now();
    const registry = loadWorldPacks([makeSchoolPack({perCohort: 12}), makeRulebookPack()], {features: FEATURES, ruleAdapter: fakeRuleAdapter});
    const loadMs = performance.now() - t0;
    const loaded = registry.packs.get('test.school'), budgets = loaded.pack.budgets;
    const pop = createPopulation(loaded, {root: 7, instanceId: INSTANCE});
    const students = pop.everyone().length;
    assert.ok(students >= 300, `${students} students`);

    const t1 = performance.now();
    const result = sweep(pop);
    const micros = (performance.now() - t1) * 1000 / result.queries;
    assert.equal(result.queries, students * DAYS * SAMPLES.length);
    assert.ok(micros <= budgets.presenceQueryMicros, `${micros.toFixed(2)} us per presence query over ${budgets.presenceQueryMicros}`);
    assert.ok(loadMs < 1000, `load took ${loadMs.toFixed(0)} ms`);

    // Nobody ticks: generation happens once per person, inside the draw budget.
    const stats = pop.stats();
    assert.ok(stats.materialized <= budgets.entities);
    assert.equal(stats.draws, (stats.materialized - 5) * MEMBER_DRAWS, 'only generated members draw, once each');
    assert.ok(stats.maxPerEntity <= budgets.drawsPerEntity);

    // Every lesson-time sample lands somewhere real; off-term days are away.
    for (const place of result.counts.keys()) assert.ok(place === 'away' || loaded.records.get(place)?.family === 'areas', place);
    assert.ok(result.counts.get('away') > 0 && result.counts.get('test.school.area.hall') > 0);

    // Deterministic across a fresh population (P9Q43).
    assert.equal(sweep(createPopulation(loaded, {root: 7, instanceId: INSTANCE})).checksum, result.checksum);
});

test('save budget: meeting a large share of the school stays inside saveBytes', () => {
    const registry = loadWorldPacks([makeSchoolPack({perCohort: 12}), makeRulebookPack()], {features: FEATURES, ruleAdapter: fakeRuleAdapter});
    const loaded = registry.packs.get('test.school'), pop = createPopulation(loaded, {root: 7, instanceId: INSTANCE});
    let section = createSection(loaded);
    const met = pop.everyone().filter((_, i) => i % 3 === 0);
    for (const id of met) section = revealPerson(section, pop, id);
    const bytes = sectionBytes(section);
    assert.ok(bytes <= loaded.pack.budgets.saveBytes, `${bytes} bytes for ${met.length} met people`);
    const t0 = performance.now();
    const {dormant} = reconcileWorldPackSaves(JSON.parse(JSON.stringify({schema: 1, sections: {'test.school': section}})), registry);
    assert.deepEqual(dormant, []);
    assert.ok(performance.now() - t0 < 500, 'reconcile of a large section stays fast');
});

test('a larger school still answers presence inside budget at 600+ students', () => {
    const pack = makeSchoolPack({perCohort: 22});
    const loaded = loadWorldPacks([pack, makeRulebookPack()], {features: FEATURES}).packs.get('test.school');
    const pop = createPopulation(loaded, {root: 11, instanceId: INSTANCE}), ids = pop.everyone();
    assert.ok(ids.length > 600);
    const t0 = performance.now(); let n = 0;
    for (let day = 0; day < 60; day++) for (const minute of SAMPLES) for (const id of ids) {pop.presenceAt(id, day * DAY + minute); n++;}
    assert.ok((performance.now() - t0) * 1000 / n <= pack.budgets.presenceQueryMicros);
});

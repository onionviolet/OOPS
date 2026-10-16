// P9S5 invariants over every fixture set. A new pack is checked by adding one
// entry to FIXTURE_SETS; the invariant tests themselves stay generic.
import test from 'node:test';
import assert from 'node:assert/strict';
import {loadWorldPacks, isActive} from '../src/world_pack_loader.js';
import {createPopulation} from '../src/world_pack_population.js';
import {createSection, revealPerson, personView, reconcileWorldPackSaves, savedExceptions} from '../src/world_pack_save.js';
import {RULE_LAYERS} from '../src/world_pack_manifest.js';
import {makeSchoolPack, makeRulebookPack, fakeRuleAdapter, FEATURES} from './world_pack_school_fixture.js';
import {makeSeriesFixture} from './world_pack_multiverse_fixture.js';

const FIXTURE_SETS = [
    {name: 'test school', packs: () => [makeSchoolPack(), makeRulebookPack()], options: {features: FEATURES, ruleAdapter: fakeRuleAdapter}},
    {name: 'series multiverse', packs: makeSeriesFixture, options: {}},
];
const ROOT = 99, TIMES = [3 * 1440 + 545, 3 * 1440 + 120, 10 * 1440 + 545, 13 * 1440 + 600];
const deepFreeze = v => {if (v && typeof v === 'object') {Object.values(v).forEach(deepFreeze); Object.freeze(v);} return v;};
const json = v => JSON.parse(JSON.stringify(v));
const load = set => loadWorldPacks(set.packs(), set.options);
const instanceOf = id => `${id}.main`;
// Every pack that holds people, with a population and a small sample of them.
function peopled(registry) {
    return [...registry.packs.values()].map(loaded => {
        const pop = createPopulation(loaded, {root: ROOT, instanceId: instanceOf(loaded.id)}), all = pop.everyone();
        return {loaded, pop, all, sample: [...all.slice(0, 6), ...all.slice(-2)]};
    }).filter(x => x.all.length);
}
function played(registry) {
    const sections = {};
    for (const {loaded, pop, sample} of peopled(registry)) {
        let s = createSection(loaded);
        for (const id of sample) s = revealPerson(s, pop, id);
        sections[loaded.id] = s;
    }
    return {schema: 1, sections};
}
// A content revision: new text, reshuffled generator tables, same rules.
function revise(pack) {
    const p = structuredClone(pack);
    p.revision += 1;
    for (const person of p.content.people || []) person.name += ' Revised';
    for (const slot of p.content.slots || []) if (slot.kind === 'cohort_members') {
        slot.table.revision += 1;
        slot.table.given = slot.table.given.map((g, i, all) => ({id: `${all[all.length - 1 - i].id}x`, weight: g.weight}));
    }
    return p;
}
const summary = r => JSON.stringify({order: r.order, dormant: [...r.dormantPacks], diagnostics: r.diagnostics,
    packs: [...r.packs.values()].map(p => [p.id, p.fingerprint, p.pin, p.axes, [...p.coverage], [...p.dormant], p.ruleProfile])});

for (const set of FIXTURE_SETS) {
    test(`INV1 identity: one ID per record, member and counterpart (${set.name})`, () => {
        const registry = load(set), owner = new Map();
        for (const p of registry.packs.values()) for (const id of p.records.keys()) {
            assert.equal(owner.has(id), false, `${id} is defined by ${owner.get(id)} and ${p.id}`);
            assert.ok(id.startsWith(p.id + '.'), `${id} outside ${p.id}`);
            owner.set(id, p.id);
        }
        for (const {loaded, all} of peopled(registry)) {
            assert.equal(new Set(all).size, all.length);
            for (const id of all) assert.ok(!owner.has(id) || owner.get(id) === loaded.id, `${id} collides across packs`);
        }
        for (const p of registry.packs.values()) for (const [id, {record}] of p.records) if (record.counterpartOf && isActive(p, id)) {
            assert.notEqual(record.counterpartOf, id);
            assert.notEqual(owner.get(record.counterpartOf), p.id, 'a counterpart lives in another pack');
        }
    });

    test(`INV2 conservation: people are counted once and never duplicated by saves (${set.name})`, () => {
        const registry = load(set);
        for (const {loaded, pop, all, sample} of peopled(registry)) {
            const named = [...loaded.records].filter(([id, x]) => x.family === 'people' && isActive(loaded, id)).length;
            const generated = [...loaded.records].filter(([id, x]) => x.family === 'cohorts' && isActive(loaded, id)).reduce((n, [, x]) => n + x.record.count, 0);
            assert.equal(all.length, named + generated);
            let s = createSection(loaded);
            for (const id of [...sample, ...sample]) s = revealPerson(s, pop, id);
            assert.equal(Object.keys(s.delta.instances[pop.instanceId].people).length, new Set(sample).size);
        }
        const saves = played(registry), count = state => Object.values(state.sections).reduce((n, s) =>
            n + Object.values(s.delta.instances).reduce((m, i) => m + Object.keys(i.people).length, 0) + Object.keys(s.delta.retired).filter(k => k.startsWith('person:')).length, 0);
        const revised = loadWorldPacks(set.packs().map(revise), set.options);
        assert.equal(count(reconcileWorldPackSaves(json(saves), revised).saves), count(saves));
    });

    test(`INV4 determinism: input order and repeated queries never change results (${set.name})`, () => {
        const packs = set.packs(), first = summary(loadWorldPacks(packs, set.options));
        assert.equal(summary(loadWorldPacks([...packs].reverse().map(json), set.options)), first);
        const registry = load(set);
        for (const {loaded, sample} of peopled(registry)) {
            const a = createPopulation(loaded, {root: ROOT, instanceId: instanceOf(loaded.id)}), b = createPopulation(loaded, {root: ROOT, instanceId: instanceOf(loaded.id)});
            for (const id of [...sample].reverse()) {
                assert.deepEqual(a.person(id), b.person(id));
                for (const t of TIMES) assert.deepEqual(a.presenceAt(id, t), b.presenceAt(id, t));
            }
        }
    });

    test(`INV6 freeze on reliance: a content revision leaves revealed facts unchanged (${set.name})`, () => {
        const registry = load(set), saves = played(registry), before = new Map();
        for (const {loaded, pop, sample} of peopled(registry)) for (const id of sample) before.set(id, personView(pop, saves.sections[loaded.id], id));
        const revised = loadWorldPacks(set.packs().map(revise), set.options);
        const {saves: after, dormant} = reconcileWorldPackSaves(json(saves), revised);
        assert.deepEqual(dormant, []);
        for (const {loaded, pop, sample} of peopled(revised)) for (const id of sample) {
            const view = personView(pop, after.sections[loaded.id], id), old = before.get(id);
            for (const f of ['name', 'house', 'club', 'tags', 'entryYear']) assert.deepEqual(view[f], old[f], `${id}.${f} changed after a revision`);
        }
    });

    test(`INV8 scoped, versioned rules: layers, revisions, pins and lock fingerprints are stable (${set.name})`, () => {
        const a = load(set), b = loadWorldPacks(json(set.packs()), set.options);
        for (const p of a.packs.values()) {
            const q = b.packs.get(p.id);
            assert.deepEqual(q.pin, p.pin);
            assert.deepEqual(q.ruleProfile, p.ruleProfile);
            if (p.ruleProfile.status !== 'none') assert.match(p.pin.profile, /@\d+$/);
            for (const prof of p.pack.provides?.ruleProfiles || []) {
                assert.ok(Number.isSafeInteger(prof.revision) && prof.revision > 0);
                for (const m of prof.modules) assert.ok(RULE_LAYERS.includes(m.priority.layer) && Number.isSafeInteger(m.revision), m.id);
            }
            for (const [name, x] of Object.entries(p.axes)) assert.ok(x.source && typeof x.locked === 'boolean', `${p.id} axis ${name}`);
        }
        for (const s of Object.values(played(a).sections)) for (const inst of Object.values(s.delta.instances)) assert.deepEqual(inst.pin, a.packs.get(s.packId).pin);
    });

    test(`INV9 round trip: save, reload and import give the same next result (${set.name})`, () => {
        const registry = load(set), saves = played(registry);
        const {saves: back, dormant} = reconcileWorldPackSaves(json(saves), loadWorldPacks(json(set.packs()), set.options));
        assert.deepEqual(dormant, []);
        assert.deepEqual(back, saves);
        for (const {loaded, sample} of peopled(registry)) {
            const before = createPopulation(loaded, {root: ROOT, instanceId: instanceOf(loaded.id)}), after = createPopulation(loaded, {root: ROOT, instanceId: instanceOf(loaded.id)});
            for (const id of sample) {
                assert.deepEqual(personView(after, back.sections[loaded.id], id), personView(before, saves.sections[loaded.id], id));
                for (const t of TIMES) assert.deepEqual(after.presenceAt(id, t, {extra: savedExceptions(back.sections[loaded.id], after)}),
                    before.presenceAt(id, t, {extra: savedExceptions(saves.sections[loaded.id], before)}));
            }
        }
    });

    test(`INV10 locality: loading writes nothing and a pack writes only its own section (${set.name})`, () => {
        const frozen = deepFreeze(set.packs());
        const registry = loadWorldPacks(frozen, set.options);
        const groups = peopled(registry);
        for (const {loaded, pop, sample} of groups) {
            const section = deepFreeze(createSection(loaded));
            const next = revealPerson(section, pop, sample[0]);
            assert.deepEqual(Object.keys(next.delta.instances), [pop.instanceId]);
            assert.deepEqual({...next, delta: {...next.delta, instances: {}}}, section);
            for (const other of groups) if (other.loaded.id !== loaded.id) assert.throws(() => revealPerson(section, other.pop, other.sample[0]), /different packs/);
        }
        const saves = deepFreeze(played(registry));
        assert.doesNotThrow(() => reconcileWorldPackSaves(saves, registry));
    });
}

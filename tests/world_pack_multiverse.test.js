import test from 'node:test';
import assert from 'node:assert/strict';
import {loadWorldPacks} from '../src/world_pack_loader.js';
import {createPopulation} from '../src/world_pack_population.js';
import {createSection, revealPerson, reconcileWorldPackSaves, createMigrationRegistry, createClusterSection, validateClusterSection} from '../src/world_pack_save.js';
import {validateWorldPack} from '../src/world_pack_manifest.js';
import {makeMultiversePack, makeSeriesPack, makeDawnPack, makeDuskPack, makeSeriesFixture} from './world_pack_multiverse_fixture.js';

const load = packs => loadWorldPacks(packs);
const axis = (registry, id, name) => registry.packs.get(id).axes[name];
const codes = (registry, packId) => registry.diagnostics.filter(d => d.packId === packId).map(d => d.code);

test('parents load before children and the series fixture is clean', () => {
    const registry = load(makeSeriesFixture());
    assert.deepEqual(registry.order, ['test.multiverse', 'test.saga', 'test.saga_dawn', 'test.saga_dusk']);
    assert.deepEqual(registry.diagnostics.filter(d => d.severity === 'error'), []);
    assert.deepEqual([...registry.packs.values()].map(p => p.role), ['multiverse', 'series', 'world', 'world']);
});

test('axes compose parent defaults, then preset, then own overrides', () => {
    const r = load(makeSeriesFixture());
    // Same series and multiverse; different resolution, progression and time models.
    assert.deepEqual([axis(r, 'test.saga_dawn', 'resolution').value, axis(r, 'test.saga_dusk', 'resolution').value], ['d20', 'percentile']);
    assert.deepEqual([axis(r, 'test.saga_dawn', 'progression').value, axis(r, 'test.saga_dusk', 'progression').value], ['levels', 'learn_by_use']);
    assert.deepEqual(axis(r, 'test.saga_dawn', 'time'), {value: {model: 'ratio', num: 1, den: 1}, source: 'preset:test.multiverse.preset.academy', locked: false, lockedBy: null});
    assert.deepEqual(axis(r, 'test.saga_dusk', 'time').source, 'test.saga_dusk', 'own axis beats its preset');
    // The series overrides the multiverse law; deeper and more specific wins.
    assert.deepEqual([axis(r, 'test.saga_dawn', 'law').value, axis(r, 'test.saga_dawn', 'law').source], ['mana_economy_tidal', 'test.saga']);
    // Dawn overrides an unlocked multiverse rule; dusk keeps the default.
    assert.deepEqual([axis(r, 'test.saga_dawn', 'lifeDeath').value, axis(r, 'test.saga_dusk', 'lifeDeath').value], ['respawn', 'permanent']);
    assert.deepEqual(axis(r, 'test.saga_dusk', 'metaphysics'), {value: 'souls_conserved', source: 'test.multiverse', locked: true, lockedBy: 'test.multiverse'});
    assert.equal(axis(r, 'test.saga_dawn', 'canonCourse').lockedBy, 'test.saga');
    assert.equal(axis(r, 'test.saga_dawn', 'cosmology'), undefined, 'not in any of its membership scopes');
    assert.notEqual(r.packs.get('test.saga_dawn').pin.axes, r.packs.get('test.saga_dusk').pin.axes);
});

test('locked parent laws cannot be overridden, even when a membership leaves them out of scope', () => {
    const dusk = makeDuskPack(); dusk.axes.metaphysics = 'souls_recycled';
    dusk.memberships[0].scopes = ['lifeDeath'];
    const r = load([makeMultiversePack(), makeSeriesPack(), makeDawnPack(), dusk]);
    assert.equal(axis(r, 'test.saga_dusk', 'metaphysics').value, 'souls_conserved');
    assert.ok(codes(r, 'test.saga_dusk').includes('locked-override'));
    assert.ok(r.packs.has('test.saga_dusk'), 'the rest of the world still loads');
    // A series cannot unlock what the multiverse locked either.
    const saga = makeSeriesPack(); saga.axes.metaphysics = 'souls_recycled';
    assert.ok(codes(load([makeMultiversePack(), saga]), 'test.saga').includes('locked-override'));
});

test('memberships are a validated list of distinct outer parents', () => {
    assert.equal(validateWorldPack({...makeDawnPack(), memberships: [{parent: 'test.saga', layer: 'series', scopes: ['law']}, {parent: 'test.other', layer: 'series', scopes: ['law']}]}).diagnostics.at(-1).code, 'memberships');
    assert.equal(validateWorldPack({...makeDawnPack(), memberships: [{parent: 'test.saga', layer: 'series', scopes: []}]}).diagnostics.at(-1).code, 'memberships');
    assert.equal(validateWorldPack({...makeMultiversePack(), memberships: [{parent: 'test.saga', layer: 'series', scopes: ['law']}]}).diagnostics.at(-1).code, 'memberships', 'a parent sits only under outer layers');
    assert.equal(validateWorldPack({...makeDawnPack(), lock: ['law']}).diagnostics.at(-1).code, 'lock', 'worlds do not lock');
    assert.equal(validateWorldPack({...makeDawnPack(), axes: {weather: 'odd'}}).diagnostics.at(-1).code, 'axes');
    const wrong = makeDawnPack(); wrong.memberships[1].layer = 'cluster';
    assert.equal(load([makeMultiversePack(), makeSeriesPack(), wrong]).dormantPacks.get('test.saga_dawn'), 'membership-unmet');
    assert.equal(load([makeMultiversePack(), makeDawnPack()]).dormantPacks.get('test.saga_dawn'), 'membership-unmet', 'a missing parent dorms the child');
    const preset = makeDuskPack(); preset.preset = 'test.multiverse.preset.missing';
    assert.ok(codes(load([makeMultiversePack(), makeSeriesPack(), preset]), 'test.saga_dusk').includes('preset-missing'));
});

test('counterparts are separate records in separate packs linked to the series census (INV1)', () => {
    const r = load(makeSeriesFixture());
    const dawn = r.packs.get('test.saga_dawn').records.get('test.saga_dawn.person.hero').record;
    const dusk = r.packs.get('test.saga_dusk').records.get('test.saga_dusk.person.hero').record;
    assert.equal(dawn.counterpartOf, dusk.counterpartOf);
    assert.notEqual(dawn.id, dusk.id);
    const saga = makeSeriesPack(); saga.content.catalog = saga.content.catalog.filter(c => c.id !== 'test.saga.cat.hero');
    const missing = load([makeMultiversePack(), saga, makeDawnPack(), makeDuskPack()]);
    assert.equal(missing.packs.get('test.saga_dawn').dormant.get('test.saga_dawn.person.hero'), 'counterpart-missing');
    const self = makeDuskPack(); self.content.people[0].counterpartOf = 'test.saga_dusk.person.smith';
    assert.equal(load([makeMultiversePack(), makeSeriesPack(), self]).packs.get('test.saga_dusk').dormant.get('test.saga_dusk.person.hero'), 'counterpart-missing');
    // Same name, separate state: meeting one never reveals the other.
    const popDawn = createPopulation(r.packs.get('test.saga_dawn'), {root: 3, instanceId: 'test.saga_dawn.main'});
    const section = revealPerson(createSection(r.packs.get('test.saga_dawn')), popDawn, 'test.saga_dawn.person.hero');
    const popDusk = createPopulation(r.packs.get('test.saga_dusk'), {root: 3, instanceId: 'test.saga_dusk.main'});
    assert.throws(() => revealPerson(section, popDusk, 'test.saga_dusk.person.hero'), /different packs/);
});

test('the one crossing names its authority model', () => {
    const r = load(makeSeriesFixture());
    assert.equal(r.packs.get('test.saga_dawn').dormant.has('test.saga_dawn.cross.dusk'), false);
    const dawn = makeDawnPack(); delete dawn.content.crossings[0].authority;
    assert.equal(load([makeMultiversePack(), makeSeriesPack(), dawn, makeDuskPack()]).packs.get('test.saga_dawn').dormant.get('test.saga_dawn.cross.dusk'), 'crossing-authority');
});

test('each instance freezes its world rules; a parent update needs a child migration (P9M5b)', () => {
    const r1 = load(makeSeriesFixture()), dawn1 = r1.packs.get('test.saga_dawn');
    const pop = createPopulation(dawn1, {root: 3, instanceId: 'test.saga_dawn.main'});
    const section = revealPerson(createSection(dawn1), pop, 'test.saga_dawn.person.smith');
    assert.deepEqual(section.delta.instances['test.saga_dawn.main'].pin, dawn1.pin);
    // The multiverse rulebook changes its academy preset.
    const mv = makeMultiversePack(); mv.revision = 2; mv.provides.presets[0].axes.resolution = 'three_d6';
    const r2 = load([mv, makeSeriesPack(), makeDawnPack(), makeDuskPack()]);
    let result = reconcileWorldPackSaves({schema: 1, sections: {'test.saga_dawn': section}}, r2);
    assert.equal(result.dormant[0].code, 'profile-changed');
    assert.deepEqual(result.saves.sections['test.saga_dawn'], section, 'never silently re-ruled');
    // The child publishes a revision with a migration that accepts the new rules.
    const dawn2 = makeDawnPack(); dawn2.revision = 2;
    const r3 = load([mv, makeSeriesPack(), dawn2, makeDuskPack()]);
    const migrations = createMigrationRegistry();
    migrations.register({packId: 'test.saga_dawn', from: 1, to: 2, migrate: (s, loaded) => {
        for (const inst of Object.values(s.delta.instances)) inst.pin = structuredClone(loaded.pin);
        return {...s, packRevision: 2};
    }});
    result = reconcileWorldPackSaves({schema: 1, sections: {'test.saga_dawn': section}}, r3, migrations);
    assert.deepEqual(result.dormant, []);
    assert.equal(r3.packs.get('test.saga_dawn').axes.resolution.value, 'three_d6');
    assert.deepEqual(result.saves.sections['test.saga_dawn'].delta.instances['test.saga_dawn.main'].pin, r3.packs.get('test.saga_dawn').pin);
});

test('cluster sections hold series-wide state with their parent and round trip (P9S3f)', () => {
    const r = load(makeSeriesFixture()), saga = r.packs.get('test.saga');
    const cluster = createClusterSection(saga);
    cluster.delta.members.push('test.saga_dawn', 'test.saga_dusk');
    cluster.delta.facts['test.saga.fact.rift_open'] = true;
    cluster.delta.events['test.saga.event.convergence'] = {status: 'brewing', touches: ['test.saga_dawn', 'test.saga_dusk'], since: 1440};
    assert.equal(validateClusterSection(cluster, saga, r), cluster);
    const saves = {schema: 1, sections: {}, clusters: {'test.saga': cluster}};
    const back = reconcileWorldPackSaves(JSON.parse(JSON.stringify(saves)), r);
    assert.deepEqual(back, {saves, dormant: []});
    assert.throws(() => createClusterSection(r.packs.get('test.saga_dawn')), /parent pack/);
    const stray = structuredClone(cluster); stray.delta.members.push('test.multiverse');
    assert.throws(() => validateClusterSection(stray, saga, r), /children/);
    const foreign = structuredClone(cluster); foreign.delta.facts['test.saga_dawn.fact.x'] = 1;
    assert.throws(() => validateClusterSection(foreign, saga, r), /cluster facts/);
    const gone = reconcileWorldPackSaves(saves, load([makeMultiversePack()]));
    assert.deepEqual([gone.saves.clusters['test.saga'], gone.dormant[0].code], [cluster, 'pack-missing']);
});

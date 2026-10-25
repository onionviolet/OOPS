import test from 'node:test';
import assert from 'node:assert/strict';
import {assembleDescription, addDescriptionClauses} from '../src/item_description.js';
import {generateRelic, seededRandom, tierFor} from '../src/relic_generator.js';
import {generateThingName, thingGrammars} from '../src/name_grammar.js';
import {emptyNaming, validateNaming, quoteNaming, executeNaming, opportunities, cleanName, applyNamedIdentity, DEFAULT_NAMING_DIAL} from '../src/naming_act.js';
import {achievement_catalog, unlockEarned, readProfile, normalizeProfile, PROFILE_KEY} from '../src/achievements.js';

const mem = () => { const m = new Map(); return {getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, v)}; };
const parts = {internal: {component_tier: 6}, external: {component_tier: 6}};

test('description clauses assemble in reading order and replace by source', () => {
    const item = {description: 'A coat'};
    addDescriptionClauses(item, [{kind: 'history', text: 'Worn for years', source: 'a'}, {kind: 'modifier', text: 'Padded'}]);
    addDescriptionClauses(item, [{kind: 'history', text: 'Worn for decades', source: 'a'}]);
    assert.equal(item.description, 'A coat. Padded. Worn for decades.');
    assert.equal(assembleDescription([{kind: 'zzz', text: 'late'}, {kind: 'base', text: 'first'}]), 'first. late.');
});

test('relic tier follows use and is deterministic from one seed', () => {
    assert.equal(tierFor(0).id, 'named'); assert.equal(tierFor(300).id, 'relic'); assert.equal(tierFor(5000).id, 'legend');
    const a = generateRelic({random: seededRandom(7), uses: 300, parts, name: 'Ash'}), b = generateRelic({random: seededRandom(7), uses: 300, parts, name: 'Ash'});
    assert.deepEqual(a, b); assert.equal(a.affixes.length, 2);
    assert.equal(generateRelic({random: seededRandom(7), uses: 0, parts}).affixes.length, 0);
    assert.equal(generateRelic({random: seededRandom(7), uses: 300, gearClass: 'other'}).affixes.length, 0);
});

test('item, relic and place grammars are pure and avoid used names', () => {
    for (const kind of ['item', 'relic', 'place']) {
        const one = generateThingName({seed: 5, key: 'k', kind}), two = generateThingName({seed: 5, key: 'k', kind});
        assert.deepEqual(one, two);
        assert.notEqual(generateThingName({seed: 5, key: 'k', kind, used: [one.name]}).name, one.name);
    }
    assert.throws(() => generateThingName({seed: 5, key: 'k', kind: 'nope'}));
    assert.ok(thingGrammars['base.frontier'].place);
});

test('naming binds to one instance, spends an opportunity, and requotes before executing', () => {
    const s = emptyNaming(), counters = {crafts: 0, kills: 0};
    const req = (name, extra = {}) => ({instance: 'e2.4', name, uses: 300, armor: true, seed: 9, counters, ...extra});
    const q = quoteNaming(s, req('  Ashen   Guard '));
    assert.ok(q.eligible); assert.equal(q.name, 'Ashen Guard'); assert.equal(q.relic.tier, 'relic');
    const rec = executeNaming(s, q, () => quoteNaming(s, req('  Ashen   Guard ')));
    assert.equal(s.used, 1); assert.equal(rec.bestow.length, 2);
    assert.ok(!quoteNaming(s, req('Other', {instance: 'e2.5'})).eligible, 'dial exhausted');
    assert.equal(opportunities(s, {crafts: 100, kills: 500}).available, 3);
    assert.ok(quoteNaming(s, req('Another one')).eligible, 'rename of the same instance is free');
    assert.throws(() => executeNaming(s, q, () => quoteNaming(s, req('Changed'))), /changed/);
    assert.ok(!quoteNaming(s, req('x')).eligible);
    assert.throws(() => cleanName('<b>'));
});

test('naming slice round-trips and rejects bad records; named identity is idempotent', () => {
    const s = emptyNaming(), req = {instance: 'e2.1', name: 'Wren', uses: 60, armor: true, seed: 3, counters: {}};
    executeNaming(s, quoteNaming(s, req), () => quoteNaming(s, req));
    assert.deepEqual(validateNaming(JSON.parse(JSON.stringify(s))), s);
    assert.deepEqual(validateNaming(undefined), emptyNaming());
    assert.throws(() => validateNaming({schema: 1, used: 0, named: {'bad key': {}}}));
    const item = {description: 'Coat', affixes: [], getName: () => 'Coat'};
    applyNamedIdentity(item, s.named['e2.1']); applyNamedIdentity(item, s.named['e2.1']);
    assert.equal(item.getName(), 'Wren (Coat)'); assert.equal(item.affixes.length, s.named['e2.1'].bestow.length);
    assert.equal(item.description.match(/Storied/g)?.length, 1);
    assert.equal(DEFAULT_NAMING_DIAL.max, null);
});

test('achievements persist in the profile, unlock once, grant nothing and tolerate bad storage', () => {
    const s = mem(), facts = {counters: {crafts: 120}, titlesHeld: 1, named: 1, relics: 0};
    assert.deepEqual(unlockEarned(s, facts, 5), ['first_name', 'first_title', 'a_hundred_hands']);
    assert.deepEqual(unlockEarned(s, facts, 6), []);
    assert.equal(readProfile(s).unlocked.first_name.at, 5);
    assert.ok(achievement_catalog.every(a => a.bonus === undefined && a.grant === undefined));
    assert.deepEqual(normalizeProfile({schema: 1, unlocked: {future_one: {at: 1}}}).unlocked, {future_one: {at: 1}});
    const broken = {getItem: () => { throw Error('x'); }, setItem: () => { throw Error('x'); }};
    assert.deepEqual(unlockEarned(broken, facts), ['first_name', 'first_title', 'a_hundred_hands']);
    assert.ok(PROFILE_KEY.startsWith('yairpg.'));
});

test('factions get names too, and a place name is stable for one key', () => {
    const f = generateThingName({seed: 1, key: 'f', kind: 'faction'});
    assert.match(f.name, / of /);
    assert.equal(generateThingName({seed: 1, key: 'p', kind: 'place'}).name, generateThingName({seed: 1, key: 'p', kind: 'place'}).name);
});

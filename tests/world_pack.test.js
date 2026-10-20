import test from 'node:test';
import assert from 'node:assert/strict';
import {lintWorldPack, worldPackCoverage, worldPackFingerprint} from '../src/world_pack.js';
import {buildMolWorldPack} from '../src/world_pack_mol.js';
import {molDefinitions} from '../src/book_world_mol_content.js';
import {TagRegistry} from '../src/tag_store.js';
import {RULE_FACTS} from '../src/rule_modules.js';

const pack = (over = {}) => ({
    schema: 1, id: 'test.w.pack', revision: 1, worldId: 'test.w', label: 'Test world',
    source: {title: 'Test', snapshot: 'snap-1', boundary: 'vol 1'},
    continuity: {id: 'test.w.canon', kind: 'canon'},
    facts: [{id: 'test.w.fact.cost', status: 'source', locator: 'ch 3'}],
    records: [{id: 'test.w.law.cost', kind: 'law', status: 'source', facts: ['test.w.fact.cost'],
        engine: 'w.manaPaid', reason: 'Casting needs mana you have.'}],
    laws: [], generators: [], unknowns: [], tiers: {K2: 'T2'}, ...over});
const rules = issues => issues.map(i => i.rule);

test('a well-formed pack lints clean', () => {
    assert.deepEqual(lintWorldPack(pack()), {ok: true, issues: []});
});

test('prose-only laws, uncited canon and leaky secrets are refused', () => {
    const {ok, issues} = lintWorldPack(pack({records: [
        {id: 'test.w.law.prose', kind: 'law', status: 'authored', summary: 'Magic is hard.'},
        {id: 'test.w.person.a', kind: 'person', status: 'source'},
        {id: 'test.w.secret.a', kind: 'secret', status: 'authored', sealed: true, summary: 'The truth', route: 'r', secretStatus: 'sealed'},
        {id: 'other.x', kind: 'item', status: 'authored'}]}));
    assert.equal(ok, false);
    for(const rule of ['WA4', 'WA3', 'WA11', 'WA9']) assert.ok(rules(issues).includes(rule), rule);
});

test('generated content needs a known generator with reader and budget, and cannot claim source truth', () => {
    const base = pack();
    const {issues} = lintWorldPack({...base,
        records: [...base.records, {id: 'test.w.person.gen', kind: 'person', status: 'generated', generator: 'test.w.gen.none', facts: ['test.w.fact.cost']}],
        generators: [{id: 'test.w.gen.folk', table: 'folk'}]});
    const messages = issues.filter(i => i.rule === 'WA7').map(i => i.message).join('\n');
    assert.match(messages, /cannot claim source facts/);
    assert.match(messages, /Unknown generator/);
    assert.match(messages, /id@rev/);
    assert.ok(rules(issues).includes('WA16'));
});

test('law modules are checked with the shared rule-module validator', () => {
    const registry = new TagRegistry([{id: 'herb', kind: 'material', revision: 1}]);
    const bad = {id: 'test.w.rule.x', schema: 1, revision: 1, resolver: 'nope'};
    const base = pack();
    const {issues} = lintWorldPack({...base, laws: [bad],
        records: [...base.records, {id: 'test.w.law.r', kind: 'law', status: 'authored', rule: 'test.w.rule.x', reason: 'r'}]},
    {registry, facts: RULE_FACTS});
    assert.ok(issues.some(i => i.rule === 'WA4' && i.path === '$.laws[0]'));
});

test('coverage reports the core floor honestly', () => {
    const cov = worldPackCoverage(pack({tiers: {K2: 'T2', K3: 'T2', K6: 'T2', K8: 'T2', K13: 'T4'}}));
    assert.equal(cov.coreFloorMet, false);
    assert.deepEqual(cov.floor.filter(f => !f.met).map(f => f.part), ['K3', 'K6', 'K8', 'K13']);
});

test('Cyoria pack is valid, meets the core floor and its laws name facts the engine reads', () => {
    const mol = buildMolWorldPack();
    // Laws must point at facts the Cyoria definitions actually read.
    const engineFacts = new Set(JSON.stringify(molDefinitions).match(/"fact":"[^"]+"/g).map(s => s.slice(8, -1)));
    assert.deepEqual(lintWorldPack(mol, {engineFacts}).issues, []);
    const cov = worldPackCoverage(mol);
    assert.equal(cov.coreFloorMet, true);
    assert.equal(cov.parts.K6.records, 9);
    assert.equal(cov.lawsAsRules, 8);
    assert.ok(cov.unknowns >= 4);
});

test('round 2 holes: descriptive sealed IDs, fan canon, confidence, code in data, dead engine facts', () => {
    const base = pack();
    const {issues} = lintWorldPack({...base,
        facts: [...base.facts, {id: 'test.w.fact.fan', status: 'fan', locator: 'ao3 x', confidence: 'vibes'}],
        records: [...base.records,
            {id: 'test.w.secret.king_is_a_dragon', kind: 'secret', status: 'authored', sealed: true, route: 'r', secretStatus: 'sealed'},
            {id: 'test.w.secret.s2', kind: 'secret', status: 'authored', sealed: true, route: 'r', secretStatus: 'sealed'}]},
    {engineFacts: new Set(['w.other'])});
    const by = rule => issues.filter(i => i.rule === rule).map(i => i.message).join('\n');
    assert.match(by('WA11'), /opaque/);
    assert.equal(issues.filter(i => i.rule === 'WA11').length, 1);
    assert.match(by('WA18'), /canon continuity/);
    assert.match(by('WA3'), /Confidence/);
    assert.match(by('WA4'), /read by nothing/);
    assert.ok(rules(lintWorldPack({...base, label: () => 'x'}).issues).includes('WA21'));
});

test('fingerprint follows content, not just revision', () => {
    const a = worldPackFingerprint(pack()), b = worldPackFingerprint(pack({label: 'Changed'}));
    assert.notEqual(a, b);
    assert.equal(a, worldPackFingerprint(pack()));
    assert.match(a, /^test\.w\.pack@1#[0-9a-f]{16}$/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {buildLedger, buildVolumeLedger, volumeOf} from '../scripts/lead_run/coverage_ledger.mjs';

// Invented rows and locators; no book prose.
const shard = 'lotmc001m', later = 'lotm2c001m', locator = 'zh 第1章 p1';
const entity = (id, kind, options = {}) => ({id, kind, shards: [shard], rows: 1, firstMention: locator, ...options});
const fixture = {
    registry: [entity('lotm.person.hit', 'person'), entity('lotm.person.x', 'person', {rows: 7, touchedByLead: true, label: 'S'}),
        entity('lotm.person.later', 'person', {shards: [later]}), entity('lotm.price.test', 'price'),
        entity('lotm.place.test', 'place', {shards: [later, shard]}), entity('lotm.organization.test', 'organization')],
    extras: [
        {extra: 'rules', kind: 'rite', id: 'lotm.rite.hit', shard, steps: [{locator}], what: 'fixture', note: 'fixture'},
        {extra: 'rules', kind: 'rite', id: 'lotm.rite.missing', shard, locator: 'zh 第2章 p2', label: 'T'},
        {extra: 'rules', kind: 'spell', id: 'lotm.spell.hit', shard, locator: 'zh 第8章 p8'},
        {extra: 'people', id: 'lotm.person.x', shard, routine: [{locator, what: 'fixture'}, {locator}]},
        {extra: 'people', id: 'lotm.person.x', shard, routine: [{locator}]},
        {extra: 'people', id: 'lotm.person.later', shard: later, routine: [{locator}]},
        {extra: 'services', shard, locator, price: '3 coins', what: 'fixture'},
        ...['', 'unstated', 'not stated'].map(price => ({extra: 'services', shard, locator: 'zh 第2章 p2', price})),
        {extra: 'news', shard, locator, note: 'fixture'},
        {extra: 'news', shard: 'lotm8c123', locator},
        {extra: 'customs', shard, locator},
        {extra: 'places', shard, locator, hours: 'morning'},
        {extra: 'places', shard, locator, hours: 'not stated'},
        {extra: 'people_other', shard, locator: 'zh 第2章 p2'},
    ],
    scenes: [
        {beat: 'lr.lotm.main.100', shard, date: {value: '1349-06-01'}},
        {beat: 'lr.lotm.main.101', shard, date: {value: 'unstated'}, dateRef: {absolute: '1349-06-02'}},
        {beat: 'lr.lotm.main.102', shard, date: {value: 'unstated'}, dateRef: {absolute: null}},
        {beat: 'lr.lotm.main.103', shard},
        {beat: 'lr.lotm.main.104', shard: later, date: {value: '1349-06-03'}},
    ],
    corpus: [`{"indexId":"lotm.person.hit","indexPlace":"lotm.place.test"} lotm.person.x-y ${locator}`,
        'lr.lotm.main.100 lotm.price.test lotm.spell.hit zh b2 第2章 p2'],
};

test('exact volume 1 counts use whole ids, step locators, unique routines, and dated beats', () => {
    const before = JSON.stringify(fixture), result = buildLedger(fixture);
    assert.deepEqual(result.counts, {
        customs: {total: 1, consumed: 1, missing: 0},
        'dated events': {total: 3, consumed: 2, missing: 1},
        'opening hours': {total: 1, consumed: 1, missing: 0},
        people: {total: 2, consumed: 1, missing: 1},
        people_other: {total: 1, consumed: 0, missing: 1},
        places: {total: 2, consumed: 1, missing: 1},
        prices: {total: 1, consumed: 1, missing: 0},
        routines: {total: 1, consumed: 1, missing: 0},
        'rules.rite': {total: 2, consumed: 1, missing: 1},
        'rules.spell': {total: 1, consumed: 1, missing: 0},
        services: {total: 4, consumed: 1, missing: 3, priced: 1},
    });
    assert.equal(result.missing.people[0].id, 'lotm.person.x', 'a hyphenated longer token does not consume x');
    assert.equal(result.missing.people[0].score, 7);
    assert.equal(result.missing['rules.rite'][0].score, 1.5);
    assert.equal(JSON.stringify(fixture), before, 'pure projection leaves the input unchanged');
    assert.ok(!JSON.stringify(result).includes('lotm.person.later'));
});

test('id boundaries reject embedded and extended tokens; missing ranking is deterministic', () => {
    const registry = ['x', 'a', 'z'].map(name => entity(`lotm.person.${name}`, 'person'));
    const result = buildLedger({registry, corpus: 'prefixlotm.person.x _lotm.person.a lotm.person.z- lotm.person.x. lotm.person.a_more'});
    assert.equal(result.counts.people.consumed, 0);
    assert.deepEqual(result.missing.people.map(row => row.id), ['lotm.person.a', 'lotm.person.x', 'lotm.person.z']);
    assert.deepEqual(result, buildLedger({registry: [...registry].reverse(), corpus: ''}));
});

test('CLI reads repeated game files/directories and writes only safe missing metadata', t => {
    const dir = mkdtempSync(join(tmpdir(), 'lead-coverage-'));
    t.after(() => rmSync(dir, {recursive: true, force: true}));
    for (const key of ['registry', 'extras', 'scenes']) writeFileSync(join(dir, `${key}.jsonl`), fixture[key].map(row => JSON.stringify(row)).join('\n') + '\n');
    const game = join(dir, 'game');
    mkdirSync(game);
    const first = join(dir, 'first.js'), out = join(dir, 'out.json');
    writeFileSync(first, fixture.corpus[0]);
    writeFileSync(join(game, 'second.json'), fixture.corpus[1]);
    const stdout = execFileSync(process.execPath, [fileURLToPath(new URL('../scripts/lead_run/coverage_ledger.mjs', import.meta.url)),
        '--merged', dir, '--game', first, '--game', game, '--out', out, '--summary'], {encoding: 'utf8'});
    const result = JSON.parse(readFileSync(out, 'utf8'));
    assert.deepEqual(result.counts, buildLedger(fixture).counts);
    assert.match(stdout, /services with stated price: 1/);
    const visit = value => {
        if (!value || typeof value !== 'object') return;
        for (const [key, child] of Object.entries(value)) {
            assert.ok(!['what', 'note'].includes(key));
            visit(child);
        }
    };
    visit(result);
    const allowed = ['id', 'locator', 'shard', 'rows', 'touchedByLead', 'score'];
    for (const rows of Object.values(result.missing)) for (const row of rows) assert.deepEqual(Object.keys(row), allowed);
});

test('per-volume ledger counts by kind and flags ids new in each volume', () => {
    const result = buildVolumeLedger({
        registry: [{id: 'a.person.one', kind: 'person', shards: ['lotmc001m', 'lotm3c001m']},
            {id: 'a.place.two', kind: 'place', shards: ['lotm3c001m']}, {id: 'a.place.three', kind: 'place', shards: ['lotm2c001m', 'lotm3c001m']}],
        extras: [{extra: 'rules', kind: 'rite', id: 'a.rite.x', shard: 'lotm2c001m'}, {extra: 'rules', kind: 'rite', id: 'a.rite.x', shard: 'lotm3c001m'},
            {extra: 'texture_other', shard: 'lotm3c002'}],
    });
    assert.equal(volumeOf('lotmc001m'), 1);
    assert.deepEqual(result.volumes[1].newIds, {person: 1});
    assert.deepEqual(result.volumes[2].newIds, {place: 1, 'rules.rite': 1});
    assert.deepEqual(result.volumes[3].newIds, {place: 1});
    assert.deepEqual(result.volumes[3].registry, {person: 1, place: 2});
    assert.deepEqual(result.volumes[3].extras, {rules: 1, texture_other: 1});
    assert.deepEqual(result.volumes[3].rules, {rite: 1});
});

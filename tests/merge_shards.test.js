import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {loadShards, mergeAll} from '../scripts/lead_run/merge_shards.mjs';

const census = (firstMention, label = 'Shared person') => ({
    schema: 'census/1.3', id: 'lotm.person.shared', label, zh: '同一人物', kind: 'person',
    rung: 'M1', whereabouts: [], firstMention, touchedByLead: true, aliases: [],
});
const scene = (beat, locator) => ({
    schema: 'lead-run/1.3', beat, order: 1, pov: 'lead', date: {}, timeOfDay: {},
    place: null, deps: [], steps: [], touched: [], present: ['lotm.person.shared'],
    options: [], footprint: null, evidence: [{label: 'S', locator, kind: 'narration'}], outcomes: [],
});

function putShard(dir, prefix, locator, chapterRange) {
    writeFileSync(join(dir, `${prefix}_header.json`), JSON.stringify({chapters: chapterRange, route: 'batch'}));
    writeFileSync(join(dir, `${prefix}_census.jsonl`), `${JSON.stringify(census(locator))}\n`);
    writeFileSync(join(dir, `${prefix}_scenes.jsonl`), `${JSON.stringify(scene(`lr.${prefix}`, locator))}\n`);
    writeFileSync(join(dir, `${prefix}_fills.jsonl`), '');
}

test('whole-book shards order by volume locator and keep one shared person id', () => {
    const dir = mkdtempSync(join(tmpdir(), 'merge-whole-book-'));
    try {
        putShard(dir, 'lotm2c001m', 'zh b2 第1章 p1', '1-3');
        putShard(dir, 'v1m', 'zh 第24章 p5', '24-24');

        const shards = loadShards(dir, {match: /^(?:lotm2c001m|v1m)$/});
        assert.deepEqual(shards.map(row => row.prefix), ['v1m', 'lotm2c001m']);

        const merged = mergeAll(dir, {match: /^(?:lotm2c001m|v1m)$/});
        assert.deepEqual(merged.scenes.map(row => row.beat), ['lr.v1m', 'lr.lotm2c001m']);
        assert.equal(merged.registry.filter(row => row.id === 'lotm.person.shared').length, 1);
        assert.equal(merged.registry.find(row => row.id === 'lotm.person.shared').rows, 2);
    } finally {
        rmSync(dir, {recursive: true, force: true});
    }
});

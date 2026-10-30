import test from 'node:test';
import assert from 'node:assert/strict';
import {collectStatGrants, scanStatReaders, buildStatReport} from '../src/stat_interactions.js';

const grants = collectStatGrants({
    item: {ring: {stats: {luck: {flat: 2}, grit: {multiplier: 4}}}, belt: {nested: {stats: {grit: {multiplier: 3}}}}},
    effect: {tea: {effects: {stats: {grit: 1}}}}});
const files = {'src/combat.js': 'const x = actor.stats.grit * 2; if (a.grit === 3) {}\nconst o = {grit: 5};',
    'src/display.js': 'label(stats["luck"])', 'src/other.js': 'const dead = {ghost: 1}'};

test('grants are collected from nested stats blocks, flat numbers included', () => {
    assert.deepEqual(grants.filter(g => g.stat === 'grit').map(g => [g.source, g.flat, g.multiplier]),
        [['item:ring', 0, 4], ['item:belt', 0, 3], ['effect:tea', 1, 1]]);
});
test('declarations are not reads, quoted indexes are', () => {
    assert.deepEqual(scanStatReaders('grit', files), {'src/combat.js': 1});
    assert.deepEqual(scanStatReaders('luck', files), {'src/display.js': 1});
});
test('report separates no-reader, presentation-only, no-writer, unused and runaway', () => {
    const r = buildStatReport({statKeys: ['grit', 'luck', 'ghost', 'wisp'], grants: [...grants, {stat: 'orphan', source: 'item:x', flat: 1, multiplier: 1}], files});
    assert.deepEqual(r.noReader, ['orphan']);
    assert.deepEqual(r.displayOnly, ['luck']);
    assert.deepEqual(r.unused, ['ghost', 'wisp']);
    assert.deepEqual(r.runaway.map(x => x.stat), ['grit']);
    assert.equal(r.runaway[0].worstCaseStack, 12);
});

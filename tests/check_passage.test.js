import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const source = join(process.env.CHAPTER_SOURCE_ROOT || root,
    'docs/research/novels/reverend-insanity/private/source');

function run(...args) {
    const result = spawnSync('python3', ['-I', 'scripts/check_passage.py', ...args], {
        cwd: root, encoding: 'utf8',
    });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    return result.stdout;
}

test('passage checker classifies its fixed examples', () => {
    assert.match(run('--self-test'), /self-test ok/);
});

test('passage checker returns the local atlas JSON contract for Plunder Gu', t => {
    let files = [];
    try {
        files = readdirSync(source);
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
    }
    if (!files.some(file => /^ri\d+\.html$/.test(file))) {
        t.skip('Private Reverend Insanity text is absent');
        return;
    }

    const result = JSON.parse(run('--ledger', 'gu_kinds', '--id', 'plunder', '--json'));
    assert.equal(result.schemaVersion, 1);
    assert.equal(result.ledger, 'gu_kinds');
    assert.equal(result.id, 'plunder');
    assert.equal(result.name, 'Plunder Gu');
    assert.equal(result.chapterRange, null);
    assert.ok(result.terms.includes('Plunder Gu'));
    assert.equal(typeof result.state, 'string');
    const counts = { fact: 0, mention: 0, collision: 0, hypothesis: 0 };
    for (const match of result.matches) {
        assert.ok(Object.hasOwn(counts, match.tag));
        counts[match.tag]++;
        assert.match(match.term, /plunder gu/i);
        assert.ok(match.text.length > 0);
        assert.equal(match.locator, `ri:ch${match.chapter}:p${match.paragraph}`);
    }
    assert.deepEqual(result.counts, counts);
    assert.ok(counts.fact > 0);
    assert.equal(result.topFact.tag, 'fact');
    assert.ok(result.topFact.signals.includes('rank'));
    assert.ok(result.topFact.ranks.includes(2));
    assert.ok(result.matches.some(match => match.locator === result.topFact.locator));
    assert.equal(result.evidence.chapterTier.rank, 2);
    assert.equal(result.evidence.wikiTier.rank, 2);
    assert.ok(Object.hasOwn(result.evidence, 'fulltextRanks'));
});

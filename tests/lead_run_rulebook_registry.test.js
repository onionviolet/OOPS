import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import {join} from 'node:path';
import {requestsFromPlan, estimateCost} from '../scripts/lead_run/batch_lib.mjs';
import {toBatchLine} from '../scripts/lead_run/openai_batch.mjs';

test('round 4 registers hash-checked editions and limits collected editions to the requested book', () => {
    const registry = JSON.parse(readFileSync('docs/gm/dispatch/batch-reading-2026-10-27/plans/books.json'));
    const books = registry.books.filter(b => b.type === 'pdf-pages' && b.dir.endsWith('lead-run-2026-11-28'));
    assert.equal(books.length, 17);
    assert.equal(new Set(books.map(b => b.world + ':' + b.book)).size, 17);
    for (const b of books) {
        assert.ok(['cyberpunk', 'shadowrun'].includes(b.world));
        assert.match(b.sourceAliases[0].sha256, /^[a-f0-9]{64}$/);
        assert.ok(b.pdfPageCount >= (b.pageRange?.[1] || 1));
    }
    assert.deepEqual(books.find(b => b.key === 'cpkit').pageRange, [1,42]);
    assert.deepEqual(books.find(b => b.key === 'cpchrome').pageRange, [1,97]);
});

test('a scan reaches both provider request formats and counts towards estimated input', t => {
    mkdirSync('.local', {recursive:true});
    const dir = mkdtempSync('.local/rulebook-test-');
    t.after(() => rmSync(dir, {recursive: true, force: true}));
    const shard = join(dir, 'sample.txt'), file = join(dir, 'page.jpg');
    writeFileSync(shard, '=== PDF page 1 | book 1\np1: [Rendered PDF page 1]');
    writeFileSync(file, Buffer.from([1,2,3]));
    const entry = {shard, prefix:'example', base:'00101'};
    const plan = {pass:'rules', world:'cyberpunk', shards:[entry]};
    const plain = requestsFromPlan(plan);
    entry.images = [{page:1, file}];
    const visual = requestsFromPlan(plan);
    assert.equal(visual[0].params.messages[0].content.at(-1).source.data, 'AQID');
    assert.equal(toBatchLine(visual[0]).body.input[0].content.at(-1).type,'input_image');
    assert.ok(estimateCost(visual, 32).inputTokens > estimateCost(plain, 32).inputTokens + 3100);
});

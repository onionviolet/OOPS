import test from 'node:test';
import assert from 'node:assert/strict';
import {pageShards} from '../scripts/lead_run/pdf_pages.mjs';
import {bookShards} from '../scripts/lead_run/make_book_plans.mjs';
import {parseShard} from '../scripts/lead_run/lint_lead_run.mjs';
import {lintExtra, buildRequest} from '../scripts/lead_run/batch_lib.mjs';

test('physical pages survive blank leaves, wraps, section boundaries and restricted volumes', () => {
    const text = 'Front\f\fFirst\nline\n\nTwo minutes later.\fFourth\fFifth\f';
    const book = {book: 3, key: 'test', type: 'pdf-pages', sections: [{from: 3, to: 4}]};
    const shards = pageShards(text, book);
    assert.deepEqual(shards.map(s => [s.first, s.last]), [[1, 2], [3, 4], [5, 5]]);
    assert.equal(shards[0].index[2], 0);
    const map = parseShard(shards[1].text);
    assert.equal(map.get('3:1'), 'First line');
    for (const [locator, errors] of [['en b3 pdf3 p2', 0], ['en b3 c3 p2', 1], ['en b4 pdf3 p2', 1], ['en b3 pdf2 p2', 1]])
        assert.equal(lintExtra([{locator}], map).length, errors);
    const req = buildRequest({world: 'shadowrun', pass: 'rules', prefix: 'test', base: '00101', shardText: shards[1].text});
    assert.match(req.params.system[0].text, /en bB pdfN pM/);
    assert.match(req.params.messages[0].content[0].text, /en b3 pdf3 p2/);
    assert.equal(bookShards(book, ['shard_test_b3_pg003-004.txt'])[0].chapters, '3-4');
    assert.deepEqual(pageShards(text, {...book, pageRange: [4, 5]}).map(s => s.first), [4, 5]);
    assert.equal(pageShards('Front\f', {book: 1, pdfPageCount: 2})[0].index[2], 0);
    assert.throws(() => pageShards('A\fB\fC\f', {book: 1, pdfPageCount: 2}), /page count/);
    assert.throws(() => pageShards('\f', book));
    assert.throws(() => pageShards(text, {...book, pageRange: [1, 6]}));
});

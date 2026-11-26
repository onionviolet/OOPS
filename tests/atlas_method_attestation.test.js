import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtempSync, writeFileSync, rmSync, unlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {readOutputMethodAttestation} from '../prototypes/world-atlas/output-method-attestation.mjs';

const book = {key: 'toy', world: 'toy-world'};
const query = {prefix: 'toyc127', pass: 'rules', kind: 'rules'};
const file = 'toyc127_rules.jsonl';
const bytes = '{"id":"toy.rule.test","locator":"zh 第127章 p3"}\n';
const sha = value => createHash('sha256').update(value).digest('hex');
const makeReceipt = () => ({schema: 'local-manual-reading/1', key: book.key, world: book.world, book: 1, language: 'zh',
    method: 'RAW_PRIVATE_METHOD', source: {path: 'C:/private/RAW_PRIVATE_SOURCE'}, reading: {chapter: 127, paragraphs: 64},
    verification: {preparedParagraphs: 64, schemaAndLocatorIssues: [], outputHashes: {[file]: sha(bytes)}},
    methodAttestations: {schema: 1, outputs: [{...query, key: book.key, file, sha256: sha(bytes), method: 'manual-structured-reading',
        locatorScope: {language: 'zh', book: 1, chapterFrom: 127, chapterTo: 127, paragraphFrom: 1, paragraphTo: 64}}]}});
function fixture(t) {
    const directory = mkdtempSync(join(tmpdir(), 'atlas-method-'));
    t.after(() => rmSync(directory, {recursive: true, force: true}));
    writeFileSync(join(directory, file), bytes);
    const write = receipt => writeFileSync(join(directory, 'LOCAL_READING_RECEIPT.json'), JSON.stringify(receipt));
    const receipt = makeReceipt(); write(receipt);
    const read = (q = query, b = book) => readOutputMethodAttestation(b, q, {directory});
    return {directory, write, receipt, read};
}
const noLeak = result => assert.doesNotMatch(JSON.stringify(result), /RAW_PRIVATE|C:\/|\.jsonl|sha256|provider-batch/);

test('adjacent chapters retain distinct receipts even for empty outputs', t => {
    const f = fixture(t);
    const second = JSON.parse(JSON.stringify(makeReceipt()).replaceAll('127','128'));
    const secondFile = file.replace('127','128');
    second.verification.outputHashes[secondFile] = sha('');
    second.methodAttestations.outputs[0].sha256 = sha('');
    const receiptPath = join(f.directory, 'CH128_READING_RECEIPT.json');
    writeFileSync(join(f.directory, secondFile), '');
    writeFileSync(receiptPath, JSON.stringify(second));
    const readSecond = () => f.read({...query, prefix:'toyc128'});
    assert.equal(readSecond().locatorScope.from, 'zh 第128章 p1');
    assert.equal(f.read().locatorScope.from, 'zh 第127章 p1');
    second.reading.chapter = 127;
    second.methodAttestations.outputs[0].locatorScope.chapterFrom = 127;
    second.methodAttestations.outputs[0].locatorScope.chapterTo = 127;
    writeFileSync(receiptPath, JSON.stringify(second));
    assert.equal(readSecond().status, 'unknown');
});

test('manual method is bound to the selected output bytes and exposes fixed labels plus locator endpoints', t => {
    const f = fixture(t), result = f.read();
    assert.deepEqual(result, {status: 'verified', method: 'manual-structured-reading', label: 'Manual structured reading', provider: 'unknown',
        locatorScope: {from: 'zh 第127章 p1', through: 'zh 第127章 p64'}});
    noLeak(result);
    f.receipt.language = 'en'; f.receipt.methodAttestations.outputs[0].locatorScope.language = 'en'; f.write(f.receipt);
    assert.equal(f.read().status, 'unknown', 'declared English scope cannot relabel Chinese output locators');
    const english = bytes.replace('zh 第127章 p3', 'en b1 c127 p3');
    writeFileSync(join(f.directory, file), english);
    f.receipt.verification.outputHashes[file] = sha(english); f.receipt.methodAttestations.outputs[0].sha256 = sha(english); f.write(f.receipt);
    assert.deepEqual(f.read().locatorScope, {from: 'en b1 c127 p1', through: 'en b1 c127 p64'});
});

test('padded first-chapter receipt checks each chapter and the endpoints of a multi-chapter slice', t => {
    const f=fixture(t), q={...query,prefix:'toyc003'}, name='toyc003_rules.jsonl';
    const receipt=makeReceipt(), entry=receipt.methodAttestations.outputs[0];
    Object.assign(receipt,{language:'en',reading:{chapter:3,chapterTo:5,chapters:[
        {chapter:3,paragraphs:8},{chapter:4,paragraphs:2},{chapter:5,paragraphs:6}
    ]}});
    receipt.verification.preparedParagraphs=16;
    Object.assign(entry,{prefix:q.prefix,file:name,locatorScope:{language:'en',book:1,chapterFrom:3,chapterTo:5,paragraphFrom:6,paragraphTo:3}});
    function check(locators) {
        const body=JSON.stringify({facts:locators.map(locator=>({locator}))});
        writeFileSync(join(f.directory,name),body);
        receipt.verification.outputHashes[name]=entry.sha256=sha(body);
        writeFileSync(join(f.directory,'CH3_READING_RECEIPT.json'),JSON.stringify(receipt));
        return f.read(q);
    }
    assert.deepEqual(check(['en b1 c3 p8','en b1 c4 p2','en b1 c5 p1']).locatorScope,{from:'en b1 c3 p6',through:'en b1 c5 p3'});
    for(const invalid of ['en b1 c3 p5','en b1 c3 p9','en b1 c4 p3','en b1 c5 p4','en b1 c6 p1','en b0 c4 p1'])
        assert.equal(check([invalid]).reason,'scope-unverified',invalid);
    check(['en b1 c4 p1']);
    writeFileSync(join(f.directory,'toyc003_READING_RECEIPT.json'),JSON.stringify(receipt));
    writeFileSync(join(f.directory,'CH3_READING_RECEIPT.json'),JSON.stringify({...receipt,key:'another-book'}));
    assert.equal(f.read(q).status,'verified','the exact slice wins in a shared book directory');
    unlinkSync(join(f.directory,'toyc003_READING_RECEIPT.json'));
    receipt.reading.chapters[1].chapter=5;
    assert.equal(check([]).status,'unknown');
});

test('missing, old, malformed and failed-verification receipts leave provider provenance unknown', t => {
    const f = fixture(t);
    for (const receipt of [{}, {...makeReceipt(), methodAttestations: undefined}, {...makeReceipt(), schema: 'unrecognized'},
        {...makeReceipt(), verification: {...makeReceipt().verification, schemaAndLocatorIssues: ['RAW_PRIVATE_ISSUE']}}]) {
        f.write(receipt); const result = f.read(); assert.equal(result.status, 'unknown'); assert.equal(result.provider, 'unknown'); noLeak(result);
    }
    writeFileSync(join(f.directory, 'LOCAL_READING_RECEIPT.json'), '{broken'); assert.equal(f.read().status, 'unknown');
    unlinkSync(join(f.directory, 'LOCAL_READING_RECEIPT.json')); assert.equal(f.read().status, 'unknown');
});

test('key, prefix, pass, kind and exact selected filename each require an unambiguous attestation', t => {
    const f = fixture(t);
    for (const field of ['key', 'prefix', 'pass', 'kind', 'file']) {
        const receipt = makeReceipt(); receipt.methodAttestations.outputs[0][field] = 'mismatch'; f.write(receipt);
        const result = f.read(); assert.equal(result.status, 'unknown', field); noLeak(result);
    }
    f.write(makeReceipt()); assert.equal(f.read(query, {...book, key: 'another'}).status, 'unknown');
    const ambiguous = makeReceipt(); ambiguous.methodAttestations.outputs.push({...ambiguous.methodAttestations.outputs[0]}); f.write(ambiguous);
    assert.equal(f.read().status, 'unknown');
    // A Luna fallback with identical bytes still needs its own exact-file attestation.
    f.write(makeReceipt()); writeFileSync(join(f.directory, 'toyc127L_rules.jsonl'), bytes); unlinkSync(join(f.directory, file));
    assert.equal(f.read().status, 'unknown');
});

test('stale raw bytes, mismatched verification hashes and unsupported method codes fail closed', t => {
    const f = fixture(t);
    writeFileSync(join(f.directory, file), bytes.replace(/\n/g, '\r\n'));
    assert.equal(f.read().reason, 'output-changed', 'byte identity is exact, including line endings');
    writeFileSync(join(f.directory, file), bytes);
    const stale = makeReceipt(); stale.verification.outputHashes[file] = 'f'.repeat(64); f.write(stale);
    assert.equal(f.read().status, 'unknown');
    const unsupported = makeReceipt(); unsupported.methodAttestations.outputs[0].method = 'RAW_PRIVATE_METHOD'; f.write(unsupported);
    const result = f.read(); assert.equal(result.status, 'unknown'); noLeak(result);
    f.write(makeReceipt()); unlinkSync(join(f.directory, file)); assert.equal(f.read().status, 'unknown');
});

test('scope is numeric-derived, consistent with the verified source chapter and bounded by prepared paragraphs', t => {
    const f = fixture(t);
    for (const patch of [{language: 'RAW_PRIVATE_PATH'}, {book: 2}, {chapterFrom: 128}, {chapterTo: 128},
        {paragraphFrom: 0}, {paragraphTo: 65}, {paragraphFrom: 8, paragraphTo: 7}]) {
        const receipt = makeReceipt(); Object.assign(receipt.methodAttestations.outputs[0].locatorScope, patch); f.write(receipt);
        const result = f.read(); assert.equal(result.status, 'unknown'); noLeak(result);
    }
});


test('server-owned selected bytes are reused without rereading a later file version', t => {
    const f = fixture(t), selected = {name: file, source: 'canonical', partial: false, migrated: true};
    writeFileSync(join(f.directory, file), bytes + '\n');
    let reads = 0;
    const readFile = path => {
        reads++;
        assert.ok(path.endsWith('LOCAL_READING_RECEIPT.json'), 'the observed output is not read again');
        return JSON.stringify(f.receipt);
    };
    const options = {directory: f.directory, names: [file], selected, content: Buffer.from(bytes), readFile};
    assert.equal(readOutputMethodAttestation(book, query, options).status, 'verified', 'attests precisely the server-observed byte version');
    assert.equal(reads, 1);
    assert.equal(readOutputMethodAttestation(book, query, {...options, content: Buffer.from(bytes + '\n')}).status, 'unknown');
    assert.equal(readOutputMethodAttestation(book, query, {...options, selected: {...selected, name: 'toyc127L_rules.jsonl'}}).status, 'unknown');
    assert.equal(f.read().status, 'unknown', 'standalone call observes the changed file');
});

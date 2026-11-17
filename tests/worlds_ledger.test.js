// PWC24 worlds ledger: the committed docs/coverage/worlds.jsonl equals a build from the registry, every cell has one
// of the three shapes, every library-index book row and census world has a row, ledger cells count what the ledger holds.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {build, toText, WORLDS_FILE, CORPORA, REGISTRY, readCensus, libraryRows, uncoveredLibraryRows} from '../scripts/worlds_ledger.mjs';
import {readLedgers, countLedger, DENOMINATORS, nextCells, renderWorlds} from '../scripts/coverage_report.mjs';

const root = new URL('../', import.meta.url).pathname;
const text = fs.readFileSync(`${root}${WORLDS_FILE}`, 'utf8');
const rows = text.trim().split('\n').map(l => JSON.parse(l));
const ledgers = readLedgers();

test('the committed file is what the builder writes', () => assert.equal(text, toText(build())));

test('one row per world, every corpus has exactly one well-formed cell', () => {
    assert.equal(new Set(rows.map(r => r.id)).size, rows.length);
    for (const r of rows) {
        assert.deepEqual(Object.keys(r.cells), CORPORA, r.id);
        for (const [corpus, c] of Object.entries(r.cells)) {
            const kinds = ['ledger', 'missing', 'none', 'rules_file'].filter(k => k in c);
            assert.equal(kinds.length, 1, `${r.id}.${corpus}`);
            assert.equal(typeof c[kinds[0]], 'string');
            assert.ok(c[kinds[0]].length > 0);
        }
    }
});

test('ledger cells name real ledgers and carry their counts', () => {
    const byName = new Map(ledgers.map(l => [l.name, l]));
    for (const r of rows) for (const c of Object.values(r.cells)) {
        if (!c.ledger) continue;
        const names = [c.ledger, ...(c.also ?? [])], total = names.reduce((n, x) => n + countLedger(byName.get(x).rows).total, 0);
        assert.equal(c.rows, total, `${r.id}.${c.ledger}`);
    }
});

test('every ledger and every ledger-registry name lands in exactly one world cell', () => {
    const used = rows.flatMap(r => Object.values(r.cells).flatMap(c => c.ledger ? [c.ledger, ...(c.also ?? [])] : []));
    assert.equal(new Set(used).size, used.length);
    for (const l of ledgers) assert.ok(used.includes(l.name), `${l.name} has no world`);
    for (const n of Object.keys(DENOMINATORS)) assert.ok(used.includes(n), `${n} has no world`);
});

test('every census world has a row with its rank and a proposed ledger on the powers cell', () => {
    const wiki = new Map(rows.filter(r => r.sources.wiki).map(r => [r.sources.wiki.split('/').pop() === 'dump' ? r.sources.wiki.split('/').slice(-2)[0].replace('.fandom.com', '') : '', r]));
    for (const c of readCensus()) {
        const r = wiki.get(c.world);
        assert.ok(r, `census world ${c.world} has no row`);
        assert.equal(r.census_rank, c.rank);
        if (r.cells.powers.missing) assert.equal(r.cells.powers.proposed, c.ledger);
    }
});

test('every held-book row of the library index is covered by a world', () => {
    assert.deepEqual(uncoveredLibraryRows(rows, libraryRows(root)), []);
    const index = fs.readFileSync(`${root}docs/research/LIBRARY_INDEX.md`, 'utf8');
    for (const e of REGISTRY.flatMap(r => r.library)) assert.ok(index.includes(e), `library entry not in the index: ${e}`);
});

test('tracked source paths exist; private ones are only named', () => {
    for (const r of rows) for (const d of r.sources.docs) assert.ok(fs.existsSync(`${root}${d}`), `${r.id}: ${d}`);
});

test('next cells list only empty cells with a source, best first', () => {
    const next = nextCells(rows);
    assert.ok(next.length > 0);
    for (const n of next) assert.ok(rows.find(r => r.id === n.world).cells[n.corpus].missing);
    for (let i = 1; i < next.length; i++) assert.ok(next[i - 1].score >= next[i].score);
    assert.ok(renderWorlds(rows).join('\n').includes('### Next cells'));
});

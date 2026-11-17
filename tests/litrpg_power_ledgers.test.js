import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parseLedger, countLedger} from '../scripts/coverage_report.mjs';
import {BOOKS, COVERAGE, tableNames, keyOf, heldOut, ledgerRow, sheetRow, scoreGrammar, POWER_KINDS, KNOWN_BY} from '../scripts/litrpg_power_ledgers.mjs';

test('table names split on semicolons, slashes and arrows, and skip other tables', () => {
    const md = ['| Function | x |', '|---|---|', '| Mana Dart | a |', '| Heavy Blow / Wand | b |', '| Scene / character stage | c |', '| Ch 55 | d |'].join('\n');
    assert.deepEqual(tableNames(md, {col: 1, headers: ['Function']}).map(n => n.name), ['Mana Dart', 'Heavy Blow', 'Wand']);
    assert.deepEqual(tableNames('| Names / family | x |\n|---|---|\n| A One; B Two → C Three | y |', {col: 1}).map(n => n.name), ['A One', 'B Two', 'C Three']);
    assert.equal(keyOf('Survivor (Basic)'), 'survivor');
});

test('the split is a pure hash of the id and holds out about a quarter', () => {
    const ids = Array.from({length: 400}, (_, i) => `x.power.${i}`);
    const held = ids.filter(heldOut).length;
    assert.ok(held > 60 && held < 140, `held ${held}`);
    assert.equal(heldOut('anc.power.a'), heldOut('anc.power.a'));
});

test('a non-power is a not-a-thing row, a blocked power names its slug, the rest are catalogued', () => {
    const base = {id: 'b.power.x', name: 'X', denominator: 'table', kind_loc: 'f:1', grammar: {verb: 'add', object: 'force', target: 'self', time: 'instant'}, blocking: {slug: 'none', why: '', loc: ''}};
    assert.equal(ledgerRow({...base, kind: 'power'}, 'anc').state, 'catalogued');
    assert.equal(ledgerRow({...base, kind: 'power', blocking: {slug: 'time-loop', why: 'rewind', loc: 'f:2'}}, 'anc').state, 'blocked:time-loop');
    assert.equal(ledgerRow({...base, kind: 'resource-or-stat', kind_reason: 'a-number'}, 'anc').state, 'not-a-thing:a-number');
    const s = sheetRow({id: 'b.power.x', name: 'X', sources: ['table'], word: 'Skill'}, {kind: {value: 'power', reason: '', locator: 'f:1', speaker: 'narrator'}, verb: {value: 'ADD', locator: '', speaker: 'unknown'}, object: {value: 'nonsense', locator: '', speaker: 'unknown'}, known_by: {value: 'rumour', locator: '', speaker: 'unknown'}});
    assert.equal(s.grammar.verb, 'add');
    assert.equal(s.grammar.object, '', 'a word outside the grammar is dropped');
    assert.equal(s.known_by.v, 'unstated');
    assert.ok(KNOWN_BY.includes(s.known_by.v) && POWER_KINDS.has('power'));
});

test('the score fits on tuning rows only and compares with the majority word', () => {
    const mk = (id, split, word, object) => ({id, split, kind: 'power', book_word: word, grammar: {verb: 'add', object, target: '', time: ''}});
    const r = scoreGrammar([mk('a', 'tuning', 'skill', 'force'), mk('b', 'tuning', 'skill', 'force'), mk('c', 'tuning', 'title', 'mind'),
        mk('d', 'held-out', 'title', 'mind'), mk('e', 'held-out', 'skill', 'force'), mk('f', 'held-out', 'skill', 'heat')]);
    assert.equal(r.heldOut, 3);
    assert.equal(r.grammarHits, 3);
    assert.equal(r.majorityHits, 2);
});

// Built ledgers: every row classified, sidecar and split agree. Skips a book whose ledger is not built yet.
for (const [book, cfg] of Object.entries(BOOKS)) {
    const file = `${COVERAGE}${cfg.ledger}_powers.jsonl`;
    test(`${cfg.ledger} ledger: zero unclassified, sidecar matches, split ids belong to it`, {skip: !fs.existsSync(file)}, () => {
        const text = fs.readFileSync(file, 'utf8');
        const {rows, problems} = parseLedger(text, {name: file});
        assert.deepEqual(problems, []);
        assert.ok(rows.length > 0);
        const c = countLedger(rows);
        assert.equal(c.unclassified, 0);
        assert.ok(rows.every(r => r.id.startsWith(`${cfg.prefix}.power.`)));
        const sheet = JSON.parse(fs.readFileSync(`${COVERAGE}${cfg.ledger}_powers_sheet.json`, 'utf8'));
        assert.deepEqual(sheet.map(s => s.id), rows.map(r => r.id));
        for (const s of sheet) {
            assert.ok(s.kind_loc || !POWER_KINDS.has(s.kind), `${s.id} power rows carry a locator`);
            assert.equal(s.split, heldOut(s.id) ? 'held-out' : 'tuning');
            assert.ok(KNOWN_BY.includes(s.known_by.v));
        }
        const split = JSON.parse(fs.readFileSync(`${COVERAGE}litrpg_powers_split.json`, 'utf8'));
        const ids = new Set(rows.map(r => r.id));
        assert.ok(split.books[book].heldOut.every(id => ids.has(id)));
    });
}

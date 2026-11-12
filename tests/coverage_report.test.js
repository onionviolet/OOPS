import test from 'node:test';
import assert from 'node:assert/strict';
import {parseLedger, countLedger, renderReadme} from '../scripts/coverage_report.mjs';

const exists = file => file === 'tests/gu_catalogue.test.js';
const rows = [
    {id: 'a', source: 'idx#a', state: 'runs-canon', mechanisms: ['G'], test: 'tests/gu_catalogue.test.js'},
    {id: 'b', source: 'idx#b', state: 'runs-authored', mechanisms: ['G', 'L'], test: 'tests/gu_catalogue.test.js#rank'},
    {id: 'c', source: 'idx#c', state: 'blocked:PGB2', mechanisms: ['B'], test: null},
    {id: 'd', source: 'idx#d', state: 'not-a-thing:alias', mechanisms: []},
    {id: 'e', source: 'idx#e', state: 'unclassified', mechanisms: []},
];
const text = rows.map(r => JSON.stringify(r)).join('\n');

test('well-formed rows parse and count (CV1, CV2, CV4)', () => {
    const {rows: parsed, problems} = parseLedger(text, {exists});
    assert.deepEqual(problems, []);
    const c = countLedger(parsed);
    assert.deepEqual([c.total, c['runs-canon'], c['runs-authored'], c.blocked, c['not-a-thing'], c.unclassified], [5, 1, 1, 1, 1, 1]);
    assert.equal(c.runsShare, 50);
    assert.equal(c.classifiedShare, 80);
    assert.deepEqual(c.rules, {PGB2: 1});
});

test('only malformed rows fail, each by line', () => {
    const bad = [
        '{not json',
        JSON.stringify({id: 'a', source: 's', state: 'runs-canon', mechanisms: ['G'], test: 'tests/gone.test.js'}),
        JSON.stringify({id: 'a', source: 's', state: 'runs-canon', mechanisms: ['G']}),
        JSON.stringify({id: 'x', source: '', state: 'blocked:', mechanisms: 'G', extra: 1}),
    ].join('\n');
    const {problems} = parseLedger(bad, {exists, name: 'demo.jsonl'});
    for (const want of [/demo.jsonl:1: not JSON/, /2: test file tests\/gone.test.js does not exist/, /3: duplicate id a/,
        /3: a runs-\* row names the test/, /4: unknown field extra/, /4: source/, /4: state/, /4: mechanisms/]) {
        assert.ok(problems.some(p => want.test(p)), String(want));
    }
});

test('the counts table lists every planned ledger, started or not', () => {
    const md = renderReadme([{name: 'hp_spells', rows: parseLedger(text, {exists}).rows}]);
    assert.match(md, /\| \[hp_spells\]\(hp_spells.jsonl\) \| S \| 117 \| 5 \| 1 \| 1 \| 1 \| 1 \| 1 \| 80% \| 50% \|/);
    assert.match(md, /\| gu_kinds \| G \| 1466 \| not started/);
    assert.match(md, /\| hp_spells \| PGB2 \| 1 \|/);
});

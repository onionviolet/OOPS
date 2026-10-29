import test from 'node:test';
import assert from 'node:assert/strict';
import {lstatSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {run} from '../scripts/lead_run/schema_union.mjs';

const writeJsonl = (path, rows) => writeFileSync(path, rows.map(row => JSON.stringify(row)).join('\n') + '\n');
const readJsonl = path => readFileSync(path, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);

test('schema union prefers present 1.4 fields, fills silent fields, and retains duplicate locators', () => {
    const base = mkdtempSync(join(tmpdir(), 'schema-union-'));
    try {
        const input = join(base, 'input'), old = join(input, 'pre-sv14'), out1 = join(base, 'out1'), out2 = join(base, 'out2');
        mkdirSync(old, {recursive: true});
        writeJsonl(join(input, 'toy_people.jsonl'), [
            {id: 'person.a', label: 'Test Entity', locator: 'ch1 p1', routine: [{locator: 'ch1 p1', what: 'morning'}], reacts: [{locator: 'ch1 p1', to: 'noise'}]},
            {id: 'person.a', label: 'Test Entity', locator: 'ch1 p2', routine: [{locator: 'ch1 p2', what: 'evening'}]},
        ]);
        writeJsonl(join(old, 'toy_people.jsonl'), [
            {id: 'person.a', label: 'Test Entity', locator: 'ch1 p0', routine: [{locator: 'ch1 p0', what: 'old'}], wants: ['quiet']},
            {id: 'person.a', label: 'Test Entity', locator: 'ch1 p1', routine: [{locator: 'ch1 p1', recurrence: 'daily', what: 'old'}]},
            {id: 'person.old', label: 'Other Entity', locator: 'ch1 p3', wants: ['shelter']},
        ]);
        writeJsonl(join(input, 'toym_census.jsonl'), [{id: 'person.a', zh: 'Test Entity', label: 'Test Entity', aliases: ['Alias A'], firstMention: 'ch1 p1', kind: 'person'}]);
        writeJsonl(join(input, 'toyx2m_census.jsonl'), [{id: 'different.id', zh: 'Dr. Test-Entity!', label: 'Test Entity', aliases: ['Alias B'], firstMention: 'ch2 p4', kind: 'person'}]);
        writeFileSync(join(input, 'toy_fills.jsonl'), '');

        const first = run(input, out1), second = run(input, out2);
        const people = readJsonl(join(out1, 'toy_people.jsonl'));
        assert.equal(lstatSync(join(out1, 'toy_people.jsonl')).isSymbolicLink(), false, 'union output is a real transformed file');
        assert.equal(lstatSync(join(out1, 'pre-sv14/toy_people.jsonl')).isSymbolicLink(), true, 'untouched backup is linked');
        assert.equal(lstatSync(join(out1, 'toy_fills.jsonl')).isSymbolicLink(), true, 'untouched shard data is linked');
        assert.equal(readFileSync(join(out1, 'toy_fills.jsonl'), 'utf8'), '');
        const same = people.filter(row => row.id === 'person.a');
        assert.equal(same.length, 1);
        assert.equal(same[0]._from.reacts, '1.4');
        assert.deepEqual(same[0].routine.map(slot => slot.locator), ['ch1 p1', 'ch1 p2', 'ch1 p0']);
        assert.equal(same[0].routine[0].recurrence, 'daily');
        assert.equal(same[0]._from['routine[ch1 p1].recurrence'], '1.3');
        assert.equal(same[0]._from['routine[ch1 p1].what'], '1.4');
        assert.equal(same[0]._from['routine[ch1 p0].what'], '1.3');
        assert.equal(same[0].wants.includes('quiet'), true);
        assert.equal(people.some(row => row.id === 'person.old' && row._from.wants === '1.3'), true);
        const census = readJsonl(join(out1, 'toym_census.jsonl'));
        assert.equal(census.length, 1);
        assert.equal(census[0].id, 'person.a');
        assert.deepEqual(census[0]._sources, [{version: 'x1', locator: 'ch1 p1'}, {version: 'x2', locator: 'ch2 p4'}]);
        assert.deepEqual(census[0].aliases, ['Alias A', 'Alias B', 'Dr. Test-Entity!', 'Test Entity']);
        assert.deepEqual(first.census, second.census);
        assert.equal(readFileSync(join(out1, 'toy_people.jsonl'), 'utf8'), readFileSync(join(out2, 'toy_people.jsonl'), 'utf8'));
        assert.equal(readFileSync(join(out1, 'toym_census.jsonl'), 'utf8'), readFileSync(join(out2, 'toym_census.jsonl'), 'utf8'));
    } finally { rmSync(base, {recursive: true, force: true}); }
});

test('schema union covers every row kind, keeps backup-only rows, and resolves versions newest first', () => {
    const base = mkdtempSync(join(tmpdir(), 'schema-union-kinds-'));
    try {
        const input = join(base, 'input'), out = join(base, 'out');
        mkdirSync(join(input, 'pre-sv8'), {recursive: true});
        mkdirSync(join(input, 'pre-sv14'), {recursive: true});
        writeJsonl(join(input, 'toym_rules.jsonl'), [{id: 'rule.same', name: 'Rule One', effect: 'new'}]);
        writeJsonl(join(input, 'pre-sv14', 'toym_rules.jsonl'), [
            {id: 'rule.same', name: 'Rule One', effect: 'old', detail: 'restored'},
            {id: 'rule.backup', name: 'Backup only', effect: 'kept'},
        ]);
        writeJsonl(join(input, 'pre-sv8', 'toym_rules.jsonl'), [{id: 'rule.same', name: 'Rule One', effect: 'oldest', ancient: true}]);
        writeJsonl(join(input, 'toym_places.jsonl'), [{name: '  The Old Hall! ', value: 'current'}]);
        writeJsonl(join(input, 'pre-sv14', 'toym_places.jsonl'), [
            {name: 'the-old hall', value: 'older', extra: 'silent'},
            {name: 'Another Place', value: 'backup'},
        ]);
        const report = run(input, out);
        const rules = readJsonl(join(out, 'toym_rules.jsonl'));
        assert.equal(rules.find(row => row.id === 'rule.same').effect, 'new');
        assert.equal(rules.find(row => row.id === 'rule.same').detail, 'restored');
        assert.equal(rules.find(row => row.id === 'rule.same').ancient, true);
        assert.equal(rules.find(row => row.id === 'rule.same')._from.ancient, 'pre-sv8');
        assert.equal(rules.some(row => row.id === 'rule.backup'), true);
        const places = readJsonl(join(out, 'toym_places.jsonl'));
        assert.equal(places.length, 2, 'id-less name rows use normalized kind/name identity');
        assert.equal(places.find(row => row.name.includes('Old')).value, 'current');
        assert.equal(places.find(row => row.name.includes('Old')).extra, 'silent');
        assert.equal(report.kinds.some(row => row.kind === 'rules' && row.keptOnlyFromBackup === 1), true);
        assert.equal(report.kinds.some(row => row.kind === 'places' && row.keptOnlyFromBackup === 1), true);
    } finally { rmSync(base, {recursive: true, force: true}); }
});

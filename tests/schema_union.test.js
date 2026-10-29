import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
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

        const first = run(input, out1), second = run(input, out2);
        const people = readJsonl(join(out1, 'toy_people.jsonl'));
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

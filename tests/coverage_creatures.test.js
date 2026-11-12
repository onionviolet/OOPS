import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {guCatalogue} from '../src/gu_catalogue.js';

test('creatures ledger names the unresolved fields without claiming runner credit', () => {
    const rows = readFileSync(new URL('../docs/coverage/creatures.jsonl', import.meta.url), 'utf8')
        .trimEnd().split('\n').map(line => JSON.parse(line));
    const gu = rows.filter(row => row.mechanisms.includes('G') && row.id !== 'insight-moth');
    assert.equal(rows.find(row => row.id === 'insight-moth').state, 'runs-authored');
    assert.equal(rows.length, 96);
    assert.equal(gu.length, 78);
    assert.equal(rows.filter(row => row.state === 'runs-authored').length, 18);
    assert.deepEqual(gu.map(row => row.id).sort(), Object.keys(guCatalogue).sort());
    for (const row of gu) {
        const diet = guCatalogue[row.id].body.diet;
        const unknown = /^.*unknown fields: ([^;]+)/.exec(row.note)?.[1].split(', ') ?? [];
        assert.ok(unknown.includes('stageMinutes'), row.id);
        assert.ok(unknown.includes('lifespan'), row.id);
        assert.equal(unknown.includes('diet'), !diet, row.id);
        assert.equal(row.state, diet ? 'blocked:runner-clock-advance' : 'blocked:diet-unknown', row.id);
        assert.equal(row.case, undefined, row.id);
        if (diet) assert.ok(row.note.includes(`diet ch. ${diet.chapters.join(', ')}`), row.id);
    }
});

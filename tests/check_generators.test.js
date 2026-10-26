import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {findGenerators} from '../scripts/check_generators.mjs';

test('generator detector reports the deliberately unshaped fixture as no generator', async () => {
    const source = await readFile(new URL('./fixtures/generators/unshaped.js', import.meta.url), 'utf8');
    assert.deepEqual(findGenerators(source, 'unshaped.js'), []);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {bookFinishLines} from '../src/book_finish_lines.js';

const fmt = b => `bonus:${Object.keys(b).join('+')}`;

test('finish lines name categories, never hidden skill, recipe or flag names', () => {
    const stats = {bonuses: {xp_multipliers: {Crafting: 2}}, rewards: {skills: ['Secret Art', 'Hidden Craft'], recipes: ['Moon Tonic'], flags: ['SEALED_FLAG']}};
    const lines = bookFinishLines(stats, fmt);
    assert.deepEqual(lines, ['bonus:xp_multipliers', 'new skills', 'a new recipe']);
    assert.doesNotMatch(lines.join(' '), /Secret|Hidden|Moon|SEALED/);
    assert.deepEqual(bookFinishLines({bonuses: {}, rewards: {skills: ['One']}}, fmt), ['a new skill']);
});

test('books with nothing to provide, and unknown books, produce no lines', () => {
    assert.deepEqual(bookFinishLines({bonuses: {}, rewards: {}}, fmt), []);
    assert.deepEqual(bookFinishLines({bonuses: {}}, fmt), []);
    assert.deepEqual(bookFinishLines(undefined, fmt), []);
});

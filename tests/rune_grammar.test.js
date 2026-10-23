import test from 'node:test';
import assert from 'node:assert/strict';
import {defineRuneGrammar, readPair, readTalisman, createRuneRecord, recordPair, coverage, learnByContrast, validateRuneRecord, totalPairs} from '../src/rune_grammar.js';

const g = defineRuneGrammar({id: 'g', revision: 1, runes: ['fire', 'wind', 'stone'],
    pairs: [{a: 'fire', b: 'wind', effect: 'blaze', power: 5}, {a: 'fire', b: 'stone', ordered: true, effect: 'forge', power: 4}, {a: 'stone', b: 'fire', ordered: true, effect: 'crack', power: 2}],
    discord: {effect: 'fizzle', power: 1, reason: 'Unfamiliar runes pull against each other.'}, maxLength: 4, perRuneCost: 2});

test('pairs: unordered and ordered entries, unnamed pairs discord instead of failing', () => {
    assert.equal(readPair(g, 'wind', 'fire').effect, 'blaze');
    assert.deepEqual([readPair(g, 'fire', 'stone').effect, readPair(g, 'stone', 'fire').effect], ['forge', 'crack']);
    assert.deepEqual(readPair(g, 'wind', 'wind'), {effect: 'fizzle', power: 1, discord: true});
    assert.equal(totalPairs(g), 6);
    assert.throws(() => readPair(g, 'fire', 'mud'), /Unknown rune/);
});

test('talisman order matters, cost is paid regardless, length is a dial', () => {
    const a = readTalisman(g, ['wind', 'fire', 'stone']), b = readTalisman(g, ['stone', 'fire', 'wind']);
    assert.deepEqual(a.effects, {blaze: 5, forge: 4}); assert.deepEqual(b.effects, {blaze: 5, crack: 2});
    assert.deepEqual([a.cost, a.discords], [6, 0]);
    assert.equal(readTalisman(g, ['wind', 'wind']).discords, 1);
    assert.throws(() => readTalisman(g, ['fire', 'wind', 'fire', 'wind', 'fire']), /holds 2-4/);
});

test('exhaustion coverage and contrast learning from the player record', () => {
    let r = createRuneRecord();
    r = recordPair(r, 'fire', 'wind', 'blaze', 1); r = recordPair(r, 'fire', 'wind', 'blaze', 2); r = recordPair(r, 'wind', 'stone', 'fizzle', 3);
    assert.equal(r.pairs.length, 2);
    const c = coverage(g, r);
    assert.deepEqual([c.tried, c.total, c.missing.length], [2, 6, 4]);
    const l = learnByContrast(r);
    assert.equal(l.find(x => x.material === 'fire' && x.effect === 'blaze').status, 'likely');
    assert.deepEqual(validateRuneRecord(g, JSON.parse(JSON.stringify(r))), r);
});

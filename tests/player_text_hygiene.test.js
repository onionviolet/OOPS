import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync, readFileSync} from 'node:fs';
import {evaluateRule} from '../src/rules.js';

test('player-facing description and reason strings carry no developer "Proposal:" label', () => {
    const hits = [];
    for(const f of readdirSync('src').filter(f => f.endsWith('.js'))) {
        const text = readFileSync(`src/${f}`, 'utf8');
        for(const m of text.matchAll(/\b(?:description|temperamentReason|reason|label)\s*:\s*["'`]\s*Proposal:/g)) hits.push(`${f}: ${m[0]}`);
    }
    assert.deepEqual(hits, []);
});

test('unmet fact rules explain themselves without raw fact ids or operators', () => {
    const r = evaluateRule({fact: 'skill.Cooking', op: 'gte', value: 1}, {'skill.Cooking': 0});
    assert.equal(r.reasons[0], 'Needs Cooking skill of at least 1.');
    for(const rule of [{fact: 'worldCompletion.accountObserved', op: 'eq', value: true}, {fact: 'a.b', op: 'lte', value: 3}]) {
        const text = evaluateRule(rule, {})?.reasons[0];
        assert.doesNotMatch(text, /\b(gte|lte|eq)\b|\w\.\w/);
    }
});

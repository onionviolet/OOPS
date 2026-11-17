// Generated Gu ledger shape (PWC30-PWC32): a fourth tier apart from canon, never mixed into gu_kinds, never a copy of a canon Gu,
// and a runs row has an effect sentence the Gu grammar accepts.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {assembleEffect} from '../src/effect_grammar.js';
import {guEffects} from '../src/world_packs/gu_effect_pack.js';
import {stemOf, heldOut, SPLIT_RULE} from '../scripts/gu_generator.mjs';

const read = f => readFileSync(new URL(`../docs/coverage/${f}`, import.meta.url), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
const generated = existsSync(new URL('../docs/coverage/gu_generated.jsonl', import.meta.url)) ? read('gu_generated.jsonl') : [];
const canon = read('gu_kinds.jsonl'), names = JSON.parse(readFileSync(new URL('../docs/coverage/gu_labels.json', import.meta.url), 'utf8')).kinds;
const canonStems = new Set(Object.values(names).map(k => stemOf(k.name)));

test('the split rule is the frozen GKM429 hash', () => {
    assert.match(SPLIT_RULE, /0x33/);
    assert.equal(typeof heldOut('river-as-before'), 'boolean');
});

test('generated rows are their own tier and stay out of gu_kinds', () => {
    const ids = new Set(canon.map(r => r.id));
    for (const r of generated) {
        assert.equal(r.tier, 'generated');
        assert.ok(['gpt-6-luna', 'claude-haiku-5-5'].includes(r.model), `${r.id} names its model`);
        assert.ok(r.concept && r.promptHash, r.id);
        assert.ok(!ids.has(r.id), `${r.id} is a canon id`);
        assert.ok(r.id.startsWith('gen.'));
    }
});

test('no generated name is a canon Gu under another spelling', () => {
    for (const r of generated) { const stem = stemOf(r.note.split('. ')[0]); assert.ok(!stem || !canonStems.has(stem), r.id); }
});

test('a runs row has a grammar-valid Gu sentence and a rule, a blocked row names its slug', () => {
    for (const r of generated) {
        if (r.state === 'runs-derived') {
            assert.equal(r.derived.rule, 'gu.generated.concept');
            const m = /, (\w+) (\w+) on (\w+), (\w+), pays ([\w-]+)\./.exec(r.note);
            assert.ok(m, r.id);
            const built = assembleEffect(guEffects, {verb: m[1], object: m[2], target: m[3], time: m[4], carrier: 'gu', cost: m[5], limits: []});
            assert.ok(built.ok, `${r.id}: ${JSON.stringify(built.receipt.violations)}`);
        } else assert.match(r.state, /^blocked:[a-z0-9]/);
    }
});

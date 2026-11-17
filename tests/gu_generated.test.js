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

// PWC47 and PWC49: sameness by meaning and ranks from the family-median rule.
test('a generated rank comes from the family-median rule, with the model rank kept as a note', () => {
    for (const r of generated) {
        assert.ok(Number.isInteger(r.rank) && r.rank >= 1 && r.rank <= 9, r.id);
        assert.ok(Number.isInteger(r.modelRank), `${r.id} keeps the model's own rank`);
        assert.match(r.rankBasis.rule, /^(gu\.rank\.family-median|model)$/, r.id);
        assert.ok(r.note.includes(`rank ${r.rank},`), `${r.id}: the note shows the ledger rank`);
        if (r.rankBasis.rule === 'gu.rank.family-median') assert.ok(r.rankBasis.n >= 3, `${r.id}: a family of at least three`);
    }
});

test('a variant_of row links an existing canon Gu and a judged copy is not in the ledger', () => {
    const ids = new Set(canon.map(r => r.id));
    for (const r of generated) if (r.variant_of) assert.ok(ids.has(r.variant_of) || ids.has(r.nearest), `${r.id} links a canon row`);
    const file = new URL('../docs/coverage/gu_sameness.json', import.meta.url);
    if (!existsSync(file)) return;
    const {verdicts} = JSON.parse(readFileSync(file, 'utf8'));
    const names = new Set(generated.map(r => r.note.split('. ')[0]));
    for (const [name, v] of Object.entries(verdicts)) {
        if (v.verdict === 'copy') assert.ok(!names.has(name), `${name} is a judged copy`);
        else if (v.verdict === 'variant_of') assert.equal(generated.find(r => r.note.startsWith(`${name}.`))?.variant_of, v.nearest, name);
    }
});

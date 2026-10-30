import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
    LOTM_AID_PREPARATIONS, LOTM_POTION_RULES,
    LOTM_POTION_RULE_FACTS, LOTM_POTION_RULE_GAPS,
} from '../src/lotm_potion_rule_rows.js';

const aids = LOTM_AID_PREPARATIONS.rows;
const rules = LOTM_POTION_RULES.rows;
const rows = [...aids, ...rules];
const aid = slug => aids.find(row => row.id === `lotm.aid.${slug}`);
const rule = slug => rules.find(row => row.id === `lotm.potionrule.${slug}`);

test('versioned tables have unique identities and cited English paraphrases', () => {
    assert.equal(LOTM_AID_PREPARATIONS.schema, 1);
    assert.equal(LOTM_POTION_RULES.schema, 1);
    for (const id of ['amanda-distillate', 'eye-of-spirit', 'ritual-oil-bath', 'craggy-oil', 'folk-herbal-remedy', 'calm-potion']) assert.ok(aids.some(r => r.id === `lotm.aid.${id}`), id);
    for (const id of ['procurement-attention', 'remains-main-material', 'related-pathway-substitution', 'low-sequence-brewing', 'animal-ingestion']) assert.ok(rules.some(r => r.id === `lotm.potionrule.${id}`), id);
    assert.equal(new Set(rows.map(row => row.id)).size, rows.length);
    for (const row of rows) {
        assert.match(row.id, /^lotm\.(?:aid|potionrule)\.[a-z0-9-]+$/);
        assert.ok(row.label);
        assert.ok(row.sourceIds.length);
        assert.equal(new Set(row.sourceIds).size, row.sourceIds.length);
        assert.ok(row.locators.length);
        assert.equal(new Set(row.locators).size, row.locators.length);
        for (const locator of row.locators) assert.match(locator, /^zh 第\d+章 p\d+$/);
        assert.ok(row.proposals.length);
        for (const tag of Object.values(row.evidence)) assert.ok(['S', 'T', 'I'].includes(tag));
        assert.equal(row.evidence.effects, 'I');
    }
    const source = readFileSync(new URL('../src/lotm_potion_rule_rows.js', import.meta.url), 'utf8');
    assert.doesNotMatch(source.replace(/(['"])zh 第\d+章 p\d+\1/g, '"locator"'), /\p{Script=Han}/u);
    for (const row of rows) {
        const prose = {...row};
        delete prose.locators;
        assert.doesNotMatch(JSON.stringify(prose), /\p{Script=Han}/u);
    }
});

test('aids describe ingredients, method and use without manufacturing undisclosed recipes', () => {
    for (const row of aids) {
        assert.ok(Array.isArray(row.ingredients));
        if (!row.ingredients.length) {
            assert.ok(row.proposals.some(text => /ingredients.*(?:empty|undisclosed)/i.test(text)), row.id);
        }
        for (const item of row.ingredients) {
            assert.ok(item.name);
            assert.ok(Object.hasOwn(item, 'quantity'));
            assert.ok(item.quantity === null || typeof item.quantity === 'string');
            assert.ok(['S', 'T', 'I'].includes(item.evidence));
        }
        assert.ok(row.method.length);
        assert.equal(new Set(row.method.map(step => step.id)).size, row.method.length);
        for (const step of row.method) {
            assert.ok(step.id && step.text);
            assert.equal(step.minutes, null, 'No source duration has been converted to a host pacing duration');
        }
        assert.ok(row.use.context && row.use.target && row.use.effect);
        assert.ok(Array.isArray(row.use.conditions) && row.use.conditions.length);
    }
    for (const slug of ['ritual-oil-bath', 'craggy-oil', 'calm-potion']) {
        assert.deepEqual(aid(slug).ingredients, []);
    }
});

test('material, mental and spirit changes are delegated to named owners', () => {
    for (const row of rows) {
        assert.ok(Array.isArray(row.effects));
        if (!row.effects.length) {
            assert.ok(row.effectsReason?.trim(), `${row.id} needs an explicit reason for no effects`);
        }
        for (const effect of row.effects) {
            assert.equal(effect.type, 'owner-needed');
            assert.ok(effect.owner?.trim());
            assert.ok(effect.value);
        }
    }
    for (const row of aids) assert.ok(row.effects.some(effect => effect.owner === 'inventory-consumption'));
    assert.ok(aid('eye-of-spirit').effects.some(effect => effect.owner === 'spirit-state'));
    assert.ok(aid('calm-potion').effects.some(effect => effect.owner === 'mind-state'));
});

test('rules have mechanisms, conditional facts and visible authorship', () => {
    const used = new Set();
    for (const row of rules) {
        assert.equal(typeof row.mechanism, 'string');
        assert.ok(row.mechanism.trim());
        assert.doesNotMatch(row.mechanism, /\b(?:never|always|only)\b/i);
        assert.equal(row.evidence.condition, 'I');
        assert.ok(row.condition === null || Array.isArray(row.condition.all));
        for (const predicate of row.condition?.all ?? []) {
            assert.match(predicate.fact, /^actor\.lotm\.potion\.[a-z0-9.-]+$/);
            assert.ok(LOTM_POTION_RULE_FACTS.includes(predicate.fact));
            assert.equal(predicate.op, 'eq');
            assert.equal(predicate.value, true);
            assert.ok(predicate.reason);
            used.add(predicate.fact);
        }
    }
    assert.equal(new Set(LOTM_POTION_RULE_FACTS).size, LOTM_POTION_RULE_FACTS.length);
    assert.deepEqual([...used].sort(), [...LOTM_POTION_RULE_FACTS].sort());
});

test('duplicate aids and rules retain their distinct cited source anchors', () => {
    assert.ok(aid('amanda-distillate').sourceIds.includes('lotm.item.amanda-distillate'));
    assert.ok(aid('amanda-distillate').sourceIds.includes('lotm.rule.amanda-distillate'));
    assert.ok(aid('eye-of-spirit').sourceIds.includes('lotm.potion.spirit-eye'));
    assert.ok(aid('eye-of-spirit').sourceIds.includes('lotm.item.eye-of-spirit-potion'));
    assert.ok(aid('calm-potion').sourceIds.includes('lotm.potion.calm-potion'));
    assert.ok(aid('calm-potion').sourceIds.includes('lotm.potion.calm'));
    assert.deepEqual(rule('remains-main-material').locators, ['zh 第207章 p14', 'zh 第212章 p51']);
    assert.ok(rule('remains-main-material').sourceIds.includes('lotm.rule.remains-promotion'));
    const swaps = rule('related-pathway-substitution');
    assert.deepEqual(swaps.locators, ['zh 第145章 p8', 'zh 第145章 p9', 'zh 第145章 p11']);
    assert.equal(swaps.evidence['mechanism.seer-convergence'], 'I');
    assert.match(swaps.mechanism, /conjecture is not a demonstrated restriction/);
});

test('source qualifiers survive extraction instead of becoming general grants', () => {
    const eye = aid('eye-of-spirit');
    assert.match(eye.method.find(step => step.id === 'sun-dry').text, /seven days/);
    assert.match(eye.method.find(step => step.id === 'boil').text, /three times/);
    const folk = aid('folk-herbal-remedy');
    assert.equal(folk.ingredients.find(item => /blood/.test(item.name)).quantity, 'Ten drops per brew');
    assert.match(folk.method.find(step => step.id === 'repeat').text, /three brews/);
    assert.match(folk.use.effect, /do not demonstrate a cure/);
    const brewing = rule('low-sequence-brewing');
    assert.match(brewing.condition.all[0].reason, /such as 8 and 9/);
    assert.equal(brewing.evidence.mechanism, 'T');
    const animals = rule('animal-ingestion');
    assert.match(animals.mechanism, /intelligence additionally depends on the potion improving thought/);
    assert.equal(animals.evidence.mechanism, 'T');
    assert.match(rule('procurement-attention').mechanism, /observer's formula knowledge/);
    assert.equal(rule('procurement-attention').evidence.mechanism, 'T');
    assert.match(rule('remains-main-material').mechanism, /lacks the auxiliaries/);
});

test('gap identities stay outside represented rows and duplicate mechanics stay out of gaps', () => {
    const represented = new Set(rows.flatMap(row => [row.id, ...row.sourceIds]));
    assert.equal(new Set(LOTM_POTION_RULE_GAPS.map(gap => gap.id)).size, LOTM_POTION_RULE_GAPS.length);
    for (const gap of LOTM_POTION_RULE_GAPS) {
        assert.ok(gap.id && gap.reason);
        assert.ok(!represented.has(gap.id), gap.id);
    }
    assert.ok(LOTM_POTION_RULE_GAPS.some(gap => gap.id === 'lotm.rule.mummy-powder-decoction' && /hearsay/.test(gap.reason)));
    for (const id of ['lotm.potion.implicit-rules', 'lotm.rule.sequence-potion-advance', 'lotm.rule.diviner-potion-digestion']) {
        assert.ok(!LOTM_POTION_RULE_GAPS.some(gap => gap.id === id));
    }
});

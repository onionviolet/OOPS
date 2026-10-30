import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LOTM_CRAFT_ROWS, LOTM_CRAFT_FACTS, LOTM_CRAFT_GAPS} from '../src/lotm_craft_rows.js';
import {LOTM_AID_PREPARATIONS} from '../src/lotm_potion_rule_rows.js';

const {rows} = LOTM_CRAFT_ROWS;
const row = slug => rows.find(item => item.id === `lotm.craft.${slug}`);
const locatorPattern = /^zh (?:b3 )?\u7b2c[1-9]\d*\u7ae0 p[1-9]\d*$/;

test('craft rows have unique identities, anchor locators and English paraphrases', () => {
    assert.equal(LOTM_CRAFT_ROWS.schema, 1);
    assert.ok(rows.length > 0);
    assert.equal(new Set(rows.map(item => item.id)).size, rows.length);
    for (const item of rows) {
        assert.match(item.id, /^lotm\.craft\.[a-z0-9-]+$/);
        assert.ok(item.label?.trim());
        assert.ok(item.sourceIds.length > 0);
        assert.equal(new Set(item.sourceIds).size, item.sourceIds.length);
        assert.ok(item.locators.length > 0);
        assert.equal(new Set(item.locators).size, item.locators.length);
        for (const locator of item.locators) assert.match(locator, locatorPattern);
        const {locators, ...prose} = item;
        assert.doesNotMatch(JSON.stringify(prose), /\p{Script=Han}/u);
        assert.ok(item.proposals.length > 0);
        for (const tag of Object.values(item.evidence)) assert.ok(['S', 'T', 'I'].includes(tag));
        assert.equal(item.evidence.effects, 'I');
        assert.equal(item.evidence.eligibility, 'I');
    }
    const source = readFileSync(new URL('../src/lotm_craft_rows.js', import.meta.url), 'utf8');
    assert.doesNotMatch(source.replace(/(['"])zh (?:b3 )?\u7b2c[1-9]\d*\u7ae0 p[1-9]\d*\1/g, '"locator"'), /\p{Script=Han}/u);
});

test('every craft has typed inputs, appropriate operations and a product mechanism', () => {
    for (const item of rows) {
        assert.ok(item.inputs.length > 0, item.id);
        for (const ingredient of item.inputs) {
            assert.ok(ingredient.name?.trim());
            assert.ok(Object.hasOwn(ingredient, 'quantity'));
            assert.ok(ingredient.quantity === null || typeof ingredient.quantity === 'string');
            assert.ok(['S', 'T', 'I'].includes(ingredient.evidence));
        }
        assert.ok(item.steps.length > 0, item.id);
        if (item.volume !== 3) assert.ok(item.steps.some(step => step.kind === 'craft'), item.id);
        assert.equal(new Set(item.steps.map(step => step.id)).size, item.steps.length);
        for (const step of item.steps) {
            assert.ok(step.id && step.text?.trim());
            assert.ok(['prepare', 'craft', 'finish', 'use'].includes(step.kind));
            assert.equal(step.minutes, null, 'No invented pacing is supplied by these source rows');
        }
        assert.ok(item.product.name?.trim());
        assert.ok(item.product.mechanism?.trim());
        assert.doesNotMatch(item.product.mechanism, /\b(?:never|always|only)\b/i);
        assert.ok(Array.isArray(item.limits));
        for (const limit of item.limits) assert.ok(limit.trim());
        assert.ok(item.effects.length > 0);
        for (const effect of item.effects) {
            assert.equal(effect.type, 'owner-needed');
            assert.ok(effect.owner?.trim());
            assert.ok(effect.value?.trim());
        }
    }
});

test('eligibility facts are declared host inputs with reasons', () => {
    const used = new Set();
    for (const item of rows) {
        assert.ok(Array.isArray(item.eligibility.all));
        for (const predicate of item.eligibility.all) {
            assert.match(predicate.fact, /^actor\.lotm\.craft\.[a-z0-9.-]+$/);
            assert.ok(LOTM_CRAFT_FACTS.includes(predicate.fact));
            assert.equal(predicate.op, 'eq');
            assert.equal(predicate.value, true);
            assert.ok(predicate.reason?.trim());
            used.add(predicate.fact);
        }
    }
    assert.equal(new Set(LOTM_CRAFT_FACTS).size, LOTM_CRAFT_FACTS.length);
    assert.deepEqual([...used].sort(), [...LOTM_CRAFT_FACTS].sort());
});

test('charm use and maintenance retain distinct mechanisms and costs', () => {
    const slumber = row('slumber-charm');
    const soothing = row('soothing-charm');
    const dream = row('dream-charm');
    assert.match(slumber.product.mechanism, /allies and the user can fall asleep/);
    assert.match(soothing.product.mechanism, /user also becomes calm/);
    assert.match(dream.product.mechanism, /sleeping subject/);
    assert.match(dream.steps.find(step => step.kind === 'use').text, /meditation/);
    for (const item of [slumber, soothing, dream]) {
        assert.match(item.recharge.mechanism, /two weeks/);
        assert.match(item.recharge.limits, /not a measured effect duration/);
        assert.equal(item.evidence.recharge, 'T');
        assert.match(item.limits.join(' '), /spent charm.*unused charm/);
        assert.ok(item.effects.some(effect => effect.owner === 'item-charge'));
    }
    for (const item of rows.filter(item => ![slumber, soothing, dream].includes(item))) {
        assert.ok(!Object.hasOwn(item, 'recharge'), item.id);
    }
});

test('distinct oils reference existing aid owners without duplicating their preparations', () => {
    const aids = new Set(LOTM_AID_PREPARATIONS.rows.map(item => item.id));
    for (const [slug, aidId] of [['ritual-essence-oil', 'lotm.aid.ritual-oil-bath'], ['full-moon-oil', 'lotm.aid.amanda-distillate']]) {
        assert.ok(aids.has(aidId), aidId);
        assert.ok(row(slug).effects.some(effect => effect.value.includes(aidId)));
    }
    assert.deepEqual(row('full-moon-oil').inputs.map(input => input.name), ['Dragon-pattern tree bark', 'Moon flower']);
    assert.match(row('full-moon-oil').limits.join(' '), /not a demonstrated distillation/);
    assert.equal(row('full-moon-oil').evidence['steps.0.text'], 'T');
    assert.ok(row('ritual-essence-oil').inputs.length >= 1);
    for (const item of rows) assert.ok(!aids.has(item.id));
    assert.ok(!rows.some(item => /Amanda|Eye of Spirit|Craggy/.test(item.label)));
});

test('unknown powder recipe and water yield stay unresolved', () => {
    assert.ok(row('holy-night-powder').inputs.some(input => /unspecified/.test(input.name)));
    assert.ok(!row('holy-night-powder').locators.some(locator => /^zh \u7b2c3\u7ae0 /.test(locator)));
    assert.match(row('pure-water').product.mechanism, /eighty milliliters belongs to the cited Clown formula/);
    assert.ok(row('pure-water').inputs.every(input => input.quantity === null));
});

test('unusable source identities remain reasoned gaps outside represented rows', () => {
    const represented = new Set(rows.flatMap(item => [item.id, ...item.sourceIds]));
    assert.equal(new Set(LOTM_CRAFT_GAPS.map(gap => gap.id)).size, LOTM_CRAFT_GAPS.length);
    for (const gap of LOTM_CRAFT_GAPS) {
        assert.ok(gap.id && gap.reason?.trim());
        assert.ok(!represented.has(gap.id), gap.id);
    }
    for (const id of ['lotm.craft.sun-flame-charm', 'lotm.craft.covert-entry-search', 'lotm.craft.surveillance-tailing', 'lotm.rite.nail-blood-charm', 'lotm.craft.hunter-bullets', 'lotm.craft.matchbox-gluing']) {
        assert.ok(LOTM_CRAFT_GAPS.some(gap => gap.id === id), id);
    }
});


test('volume and kind distinguish source operations without recasting item use as manufacture', () => {
    const kinds = new Set(['making', 'cooking', 'communication', 'disguise', 'concealment', 'training', 'item_use']);
    for (const item of rows) {
        assert.ok(kinds.has(item.kind), item.id);
        assert.equal(item.evidence.kind, 'I');
        if (item.volume === 3) {
            assert.ok(item.locators.every(locator => locator.startsWith('zh b3 ')), item.id);
        } else {
            assert.equal(item.kind, 'making');
            assert.ok(item.locators.every(locator => !locator.startsWith('zh b3 ')), item.id);
        }
    }
    for (const item of rows.filter(item => item.kind === 'item_use')) {
        assert.ok(item.steps.some(step => step.kind === 'use'), item.id);
        assert.ok(!item.steps.some(step => step.kind === 'craft'), item.id);
    }
});

test('merged source methods retain provenance without duplicate source identities', () => {
    const sourceIds = rows.filter(item => item.volume === 3).flatMap(item => item.sourceIds);
    assert.equal(new Set(sourceIds).size, sourceIds.length);
    for (const ids of [
        ['lotm.craft.radio-operation', 'lotm.craft.radio-codebook-report', 'lotm.craft.radio-telegram-decoding', 'lotm.craft.telegraph-decoding'],
        ['lotm.craft.fish-man-cooking', 'lotm.craft.fish-seasoning', 'lotm.craft.dixi-grilled-fish'],
        ['lotm.craft.makeup-disguise', 'lotm.craft.helene-male-disguise', 'lotm.craft.makeup-removal-disguise'],
    ]) {
        assert.ok(rows.some(item => ids.every(id => item.sourceIds.includes(id))));
    }
    for (const gap of LOTM_CRAFT_GAPS) {
        for (const id of gap.sourceIds ?? [gap.id]) assert.ok(!sourceIds.includes(id), id);
    }
});

test('reported, planned and judged outcomes retain their evidence boundary', () => {
    assert.equal(row('hybrid-bacteria-cultivation').evidence.product, 'T');
    assert.equal(row('hybrid-bacteria-cultivation').evidence.steps, 'T');
    assert.equal(row('three-layer-interference').evidence.steps, 'T');
    assert.equal(row('three-layer-interference').evidence['product.mechanism'], 'I');
    assert.equal(row('scent-dispersal-wall').evidence['product.mechanism'], 'I');
    assert.ok(!Object.hasOwn(row('sea-god-talisman-use'), 'recharge'));
    assert.equal(row('sea-god-talisman-use').evidence['steps.1.text'], 'T');
    assert.ok(LOTM_CRAFT_GAPS.some(gap => gap.id === 'lotm.craft.airship-barrage'));
});

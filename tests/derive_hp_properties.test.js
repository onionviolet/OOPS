import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runCaseData} from '../scripts/coverage_report.mjs';
import {DERIVE_DIALS, DERIVE_RULE, deriveIngredient, isHeldOut, potionAxis, statedAxes} from '../scripts/derive_hp_properties.mjs';
import {HP_AXES, HP_AXIS_DOSE, materialCase} from '../src/hp_property_set.js';

const rows = readFileSync(new URL('../docs/coverage/hp_ingredients.jsonl', import.meta.url), 'utf8').trim().split('\n').map(l => JSON.parse(l));
const derived = rows.filter(r => /-derived$/.test(r.state));
const rules = JSON.parse(readFileSync(new URL('../docs/coverage/hp_rules.json', import.meta.url), 'utf8')).rules;

test('every derived row cites a rule row and runs through the Hogwarts property set; dosed rows are brewed and served to a body', async () => {
    assert.ok(derived.length >= 80, `derived rows: ${derived.length}`);
    assert.ok(rules.some(r => r.id === DERIVE_RULE && r.derives.includes('ingredient-properties')));
    for (const r of derived) {
        assert.equal(r.derived.rule, DERIVE_RULE);
        assert.ok(r.derived.inputs.length, r.id);
        assert.equal(Boolean(r.test), Boolean(HP_AXIS_DOSE[r.case.id.replace('derived:', '').split('.')[0]]), `${r.id}: only a dosed row names the test`);
    }
    for (const id of new Set(derived.map(r => r.case.id))) {
        const dosed = Boolean(HP_AXIS_DOSE[id.replace(/^derived:/, '').split('.')[0]]);
        const out = await runCaseData(materialCase(id), {id, typedState: 'expressed-derived'});
        assert.equal(out.state, 'expressed-derived', `${id}: ${out.state} ${out.detail}`);
        assert.equal(materialCase(id).timeline.length, dosed ? 4 : 2, `${id}: dose step only when the dose law has a body account`);
    }
});

test('a dosed derived property reaches the body: a wrong expectation fails', async () => {
    const data = materialCase('derived:venom.some');
    data.timeline[3].expect = data.timeline[3].expect.map(e => e.property || e.quantity === 'vitality' ? {...e, direction: 'up'} : e);
    assert.equal((await runCaseData(data, {id: 'neg', typedState: 'expressed-derived'})).state, 'blocked:runner-expect-mismatch');
});

test('derived levels never exceed some, stated rows are untouched, axes stay in the property set', () => {
    for (const r of derived) for (const part of r.case.id.replace('derived:', '').split(',')) {
        const [axis, level] = part.split('.');
        assert.ok(HP_AXES.includes(axis) && ['trace', 'some'].includes(level), r.id);
    }
    for (const r of rows) if (Object.keys(statedAxes(r.id)).length) assert.ok(!/-derived$/.test(r.state), `${r.id} has a stated axis and stays stated`);
    assert.ok(DERIVE_DIALS.confidenceCap < 1);
});

test('the graph step: two recipes that agree beat one, and an unlabelled effect names its gap', () => {
    assert.equal(potionAxis('hp.potion.wiggenweld_potion').axis, 'mend');
    const one = deriveIngredient('hp.ingredient.banana');
    assert.equal(one.axes[0].axis, 'form');
    assert.equal(one.axes[0].level, 'trace');
    assert.equal(deriveIngredient('hp.ingredient.honey').block, 'no-recipe-edge');
});

test('the split is the frozen GKM429 rule: it agrees with every heldOut flag in the label file', () => {
    const labels = JSON.parse(readFileSync(new URL('../docs/coverage/wiki_tier_labels.json', import.meta.url), 'utf8')).hp_ingredients;
    for (const [id, t] of Object.entries(labels)) assert.equal(isHeldOut(id), t.heldOut, id);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {compareIngredientChoices} from '../src/craft_ingredient_selection.js';

function fixture() {
    return {holdings: [
        {key: 'horn-fine-1', name: 'Fine horn powder', count: 1, custody: 'borrowed', evidence: {properties: [{id: 'preparation', status: 'observed', value: 'fine'}]}},
        {key: 'horn-coarse-2', name: 'Coarse horn powder', count: 1, custody: 'owned'},
        {key: '{"id":"Bonemeal"}', name: 'Bonemeal', count: 3, custody: 'prized'},
        {key: 'tool-3', name: 'Held sieve', count: 1, custody: 'reserved', available: true},
    ], candidates: [
        {id: 'reference', label: 'Reference: fine powder', kind: 'reference', inputs: [{key: 'horn-fine-1', qty: 1}]},
        {id: 'alternative', label: 'Alternative: Bonemeal', kind: 'alternative', inputs: [{key: '{"id":"Bonemeal"}', qty: 2}]},
        {id: 'blend', label: 'Blend: coarse powder and Bonemeal', kind: 'blend', inputs: [{key: 'horn-coarse-2', qty: 1}, {key: '{"id":"Bonemeal"}', qty: 1}], retained: [{key: 'tool-3', qty: 1}]},
    ], selected: 'blend'};
}

test('comparison preserves explicit reference, alternative and blend amounts, custody and retained tools', () => {
    const view = compareIngredientChoices(fixture());
    assert.deepEqual(view.choices.map(row => row.id), ['reference', 'alternative', 'blend']);
    assert.equal(view.choices[1].debits[0].qty, 2);
    assert.equal(view.choices[0].debits[0].custody, 'borrowed');
    assert.equal(view.choices[1].debits[0].custody, 'prized');
    assert.deepEqual(view.selection.choice.debits.map(row => [row.key, row.qty, row.disposition]), [
        ['horn-coarse-2', 1, 'consumed'], ['{"id":"Bonemeal"}', 1, 'consumed'],
    ]);
    assert.equal(view.selection.choice.retained[0].disposition, 'retained');
    assert.equal(view.selection.choice.retained[0].custody, 'reserved');
    assert.equal(view.selection.stockAvailable, true, 'custody labels do not invent permission policy');
});

test('equal projected evidence yields identical names, order, costs and stock reasons despite concealed truth', () => {
    const a = fixture(), b = structuredClone(a);
    a.holdings[0].truth = {abrasion: 0, value: 100};
    b.holdings[0].truth = {abrasion: 999, value: 5000};
    a.candidates[2].truth = {fits: false, effect: 'none'};
    b.candidates[2].truth = {fits: true, effect: 'clean'};
    a.candidates[2].evidence = {properties: [{id: 'abrasion', status: 'unknown', value: 0}]};
    b.candidates[2].evidence = {properties: [{id: 'abrasion', status: 'unknown', value: 999}]};
    assert.deepEqual(compareIngredientChoices(a), compareIngredientChoices(b));
    assert.equal(compareIngredientChoices(a).selection.stockAvailable, true, 'unknown fit does not refuse a trial');
});

test('comparison retains observed absence, unverified attributed belief and unsupported prediction distinctly', () => {
    const input = fixture();
    input.candidates[0].evidence = {properties: [
        {id: 'observed-zero', status: 'observed', value: 0},
        {id: 'untried', status: 'unknown', value: 99},
        {id: 'supplier-belief', status: 'claim', source: 'Supplier label', value: 'fine'},
        {id: 'author-gap', status: 'unsupported', value: 0},
    ]};
    const rows = compareIngredientChoices(input).choices[0].evidence.properties;
    assert.deepEqual(rows, [
        {id: 'observed-zero', status: 'observed', value: 0},
        {id: 'untried', status: 'unknown'},
        {id: 'supplier-belief', status: 'claim', source: 'Supplier label', value: 'fine'},
        {id: 'author-gap', status: 'unsupported'},
    ]);
});

test('stale, reduced and inaccessible exact holdings stay selected without replacement', () => {
    for(const change of [
        input => {input.holdings = input.holdings.filter(row => row.key !== 'horn-coarse-2');},
        input => {input.holdings[1].count = 0;},
        input => {input.holdings[1].available = false; input.holdings[1].reason = 'Reserved for a paid order.';},
    ]) {
        const input = fixture(); change(input);
        const view = compareIngredientChoices(input);
        assert.equal(view.selection.id, 'blend');
        assert.equal(view.selection.choice.debits[0].key, 'horn-coarse-2');
        assert.equal(view.selection.choice.debits[0].qty, 1);
        assert.equal(view.selection.stockAvailable, false);
        assert.ok(view.selection.stockReason);
        assert.equal(view.choices[0].selected, false, 'available reference never replaces stale blend');
    }
    const input = fixture(); input.candidates = input.candidates.filter(row => row.id !== 'blend');
    const view = compareIngredientChoices(input);
    assert.equal(view.selection.id, 'blend'); assert.equal(view.selection.choice, null);
    assert.match(view.selection.stockReason, /no longer available/);
    assert.ok(view.choices.every(row => !row.selected));
});

test('role assignments cannot be charged twice or disguise a consumed catalyst', () => {
    for(const duplicate of ['debit', 'retained']) {
        const input = fixture(), row = input.candidates[0];
        if(duplicate === 'debit') row.inputs.push({...row.inputs[0]});
        else row.retained = [{...row.inputs[0]}];
        assert.throws(() => compareIngredientChoices(input), /canonical physical debits/);
    }
    const input = fixture(); input.candidates[0].inputs[0].qty = 0.5;
    assert.throws(() => compareIngredientChoices(input), /positive whole quantity/);
});

test('an observed method difference is evidence, not a stock-access refusal', () => {
    const input = fixture();
    input.candidates[2].evidence = {conditions: [{id: 'reference-preparation', status: 'observed', value: false, reason: 'Coarse powder differs from the fine reference.'}]};
    const view = compareIngredientChoices(input);
    assert.equal(view.selection.choice.evidence.failedConditions.length, 1);
    assert.equal(view.selection.stockAvailable, true, 'the adapter may still quote a different supported method or a trial');
    assert.equal(view.selection.stockReason, '');
});

test('repeated previews preserve stock, clock, RNG and knowledge and return detached evidence', () => {
    const owner = {clock: 1234, rng: {draw: 7}, knowledge: ['saw fine preparation'], input: fixture()};
    const before = JSON.stringify(owner);
    for(let i = 0; i < 3; i++) {
        const view = compareIngredientChoices(owner.input);
        view.choices[0].debits[0].evidence.properties[0].value = 'changed';
        view.selection.choice.debits[0].qty = 99;
    }
    assert.equal(JSON.stringify(owner), before);
});

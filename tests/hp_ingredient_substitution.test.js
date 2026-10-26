import test from 'node:test';
import assert from 'node:assert/strict';
import {HP_ABRASIVE_PROCESS as P, planNativeHpMaterials, planHpAbrasiveMixture, projectHpIngredientChoices} from '../src/hp_ingredient_substitution.js';
const key = JSON.stringify({id: 'Bonemeal'});
const lot = (id, variant = 'fine') => ({slot: id === 'a' ? 'bicorn' : 'knotgrass', lot: {id,
    ingredient: 'book.hp.ing.bicorn_horn', form: 'powdered', variant: `book.hp.prep.powder_${variant}`}});
const external = qty => planNativeHpMaterials({inputs: [{key, qty}], inventory: {[key]: {count: qty}}, world: 'book.hp.school.world'});
const plan = (localInputs, externalMaterials = [], extra = {}) => planHpAbrasiveMixture({localInputs, externalMaterials,
    process: P.steps, apparatus: {station: 'cauldron', carrier: 'water-suspension', application: 'manual-scour'}, ...extra});

test('actual reference, alternative and blend conserve physical portions and reach the useful same work', () => {
    const reference = plan([lot('a')]), alternative = plan([], external(2)), blend = plan([lot('a', 'coarse')], external(1));
    for(const p of [reference, alternative, blend]) {
        assert.equal(p.work, 2); assert.equal(p.strength, 200); assert.equal(p.identity, 'original-suspension');
        assert.equal(p.cost.coins, 1); assert.equal(p.process.minutes, 20);
        assert.equal(p.allocation.assignment.abrasion.qty, p.allocation.assignment['solid-load'].qty);
        assert.equal(p.allocation.debits.reduce((n, r) => n + r.qty, 0), p.bulk, 'shared functions do not double debit');
    }
    assert.deepEqual(alternative.nativeDebits, [{key, qty: 2}]);
    assert.deepEqual(blend.localDebits, [{lotId: 'a', qty: 1}]);
    assert.deepEqual(reference.nativeDebits, []);
});

test('preparation, concentration and essential absence reach actual resolved strength without erasing side solids', () => {
    assert.equal(plan([lot('a', 'coarse')]).strength, 100);
    assert.equal(plan([], external(3)).strength, 133, 'more bulk dilutes the usable work');
    const side = {slot: 'leeches', lot: {id: 'c', ingredient: 'book.hp.ing.leeches', form: 'raw', variant: null}};
    const diluted = plan([lot('a'), side], external(1));
    assert.equal(diluted.work, 3); assert.equal(diluted.bulk, 3); assert.equal(diluted.strength, 133);
    const raw = lot('a'); raw.lot.form = 'raw'; raw.lot.variant = null;
    for(const p of [plan([raw]), plan([side])]) {assert.equal(p.essentialMet, false); assert.equal(p.recognized, false); assert.equal(p.strength, 0);}
    assert.throws(() => plan([lot('a')], external(3)), /one to 3/);
    assert.throws(() => plan([lot('a')], [], {process: undefined}), /actual suspension/);
    assert.throws(() => plan([lot('a')], [], {process: [{op: 'boil', level: 1}]}), /actual suspension/);
});

test('native import reads actual exact stock/current HP presence, preserves unknown origin and spends nothing', () => {
    const inventory = {[key]: {count: 2}}, before = structuredClone(inventory), calls = [];
    const out = planNativeHpMaterials({inputs: [{key, qty: 2}], inventory, world: 'book.hp.trade.world', assertSpend: k => calls.push(k)});
    assert.deepEqual(inventory, before); assert.deepEqual(calls, [key]);
    assert.equal(out[0].definitionWorld, 'base.frontier'); assert.equal(out[0].originWorld, null);
    assert.equal(out[0].transport.departureWorld, null);
    assert.throws(() => planNativeHpMaterials({inputs: [{key, qty: 1}], inventory, world: 'base.frontier'}), /Carry.*HP/);
    assert.throws(() => planNativeHpMaterials({inputs: [{key, qty: 3}], inventory, world: 'book.hp.school.world'}), /exact selected/);
    assert.throws(() => planNativeHpMaterials({inputs: [{key, qty: 1}, {key, qty: 1}], inventory, world: 'book.hp.school.world'}), /each exact/);
    assert.throws(() => planNativeHpMaterials({inputs: [{key, qty: 1}], inventory, world: 'book.hp.school.world', assertSpend: () => {throw Error('reserved');}}), /reserved/);
    const forged = external(1); forged[0].material.properties.hardness++;
    assert.throws(() => plan([], forged), /catalogue entry/);
    assert.deepEqual(inventory, before);
});

test('projected exact choices carry uncertainty and stale stock without publishing strength or choosing another lot', () => {
    const lots = [{id: 'a', name: 'Horn', ingredient: 'book.hp.ing.bicorn_horn', form: 'powdered', variant: 'Fine powder', custody: 'owned', truth: {secret: 1}}];
    const holdings = [{key, name: 'Bonemeal', count: 2, custody: 'owned', available: true}];
    const a = projectHpIngredientChoices({lots, nativeHoldings: holdings, selected: 'reference:a'});
    const b = projectHpIngredientChoices({lots: [{...lots[0], truth: {secret: 999}}], nativeHoldings: holdings, selected: 'reference:a'});
    assert.deepEqual(a, b); assert.equal(a.selection.stockAvailable, true);
    assert.equal(a.selection.choice.evidence.uncertainConditions[0].status, 'unknown');
    assert.doesNotMatch(JSON.stringify(a), /strength|secret|hardness/);
    const stale = projectHpIngredientChoices({lots: [], nativeHoldings: holdings, selected: 'reference:a'});
    assert.equal(stale.selection.id, 'reference:a'); assert.equal(stale.selection.choice, null);
    assert.match(stale.selection.stockReason, /no longer available/);
    assert.deepEqual(a.requests['alternative:' + key].materialInputs, [{key, qty: 2}]);
    assert.deepEqual(a.requests['alternative-small:' + key].materialInputs, [{key, qty: 1}]);
    assert.deepEqual(a.requests['alternative-bulk:' + key].materialInputs, [{key, qty: 3}]);
    assert.equal(a.choices.find(c => c.id === 'alternative-bulk:' + key).stockAvailable, false, 'larger trial never borrows a missing third portion');
});

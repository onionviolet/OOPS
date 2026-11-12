import test from 'node:test';
import assert from 'node:assert/strict';
import {compileDraft, DEFAULT_DRAFT} from '../src/authored_site.js';
import {defineRegion} from '../src/region_kit.js';
import {generateWetField} from '../src/procedural_places.js';
import {
    advanceWorld, applyWorldOps, composeSubstrate, createWorld, explainEffect,
    readProvenance, readQuantity, restoreWorld, serializeWorld,
} from '../src/world_substrate.js';
import {WORLD_EFFECT_KINDS as K, WORLD_QUANTITIES as Q} from '../src/world_quantities.js';
import {createResidueFlowPack, residueQuantity} from '../src/world_substrate_packs/residue_flow.js';

const authored = compileDraft(DEFAULT_DRAFT);
const [anchor] = authored.locations;
const context = {
    id: 'fixture.valley', world: authored.world.id, era: 'fixture.present', label: 'Valley',
    arrival: {id: 'fixture.arrival', text: 'Arrive at the washroom.'},
    places: [anchor],
};
const region = defineRegion(context);
const evidence = {
    terrain: ['wet-soil'],
    source: 'fixture.survey.downhill-plot',
    residue: {key: 'active', min: 4, max: 11},
};
const account = residueQuantity(evidence.residue.key);
const generate = (options = {}) => generateWetField({
    root: 1, region, instance: 'fixture.instance', anchorId: anchor.id, evidence, ...options,
});

test('X v0 uses one addressed draw and one W account for a scoped wet plot', () => {
    const first = generate();
    assert.deepEqual(generate(), first);
    assert.equal(first.receipt.generator, 'x.procedural_places');
    assert.equal(first.receipt.revision, 0);
    assert.equal(first.receipt.draws, 1);
    assert.equal(first.receipt.cause, 'wet-soil');
    assert.equal(first.receipt.source, evidence.source);
    assert.deepEqual(JSON.parse(first.receipt.address), [
        'x.procedural_places', 0, region.world, 'fixture.instance', region.era, region.id, anchor.id,
        'adjacent-field', 'initial-residue', 'active',
    ]);
    assert.deepEqual([0, 1, 2].map(root => generate({root}).value.quantities[account]), [6, 11, 4]);
    const sample = Array.from({length: 128}, (_, root) => {
        const {value, receipt} = generate({root});
        assert.equal(receipt.draws, 1);
        assert.equal(value.id, first.value.id);
        assert.deepEqual(Object.keys(value.quantities), [account]);
        return value.quantities[account];
    });
    assert.deepEqual([...new Set(sample)].sort((a, b) => a - b), [4, 5, 6, 7, 8, 9, 10, 11]);
    assert.notEqual(generate({instance: 'fixture.other'}).value.id, first.value.id);
    assert.notEqual(generate({region: defineRegion({...context, era: 'fixture.past'})}).value.id, first.value.id);
});

test('X v0 skips missing or contradictory evidence and preserves fixed places', () => {
    const id = generate().value.id;
    const fixed = defineRegion({...context, places: [anchor, {id, label: 'Fixed plot'}]});
    const before = structuredClone(fixed);
    for (const [options, reason] of [
        [{anchorId: 'unknown'}, 'unknown-context'],
        [{evidence: undefined}, 'unknown-terrain'],
        [{evidence: {...evidence, terrain: ['dry-soil']}}, 'ineligible-terrain'],
        [{evidence: {...evidence, terrain: ['wet-soil', 'dry-soil']}}, 'ineligible-terrain'],
        [{evidence: {...evidence, terrain: ['dry-soil', 'wet-soil']}}, 'ineligible-terrain'],
        [{evidence: {...evidence, terrain: ['wet-soil', 'wet-soil', 'wet-soil']}}, 'ineligible-terrain'],
        [{region: fixed}, 'fixed-place'],
    ]) {
        // An unusable root would throw if a skipped candidate drew anything.
        const {value, receipt} = generate({...options, root: null});
        assert.equal(value, null);
        assert.equal(receipt.reason, reason);
        assert.equal(receipt.draws, 0);
    }
    assert.deepEqual(fixed, before);
    assert.deepEqual(region.places[0], anchor);
    assert.throws(() => generate({evidence: {...evidence, residue: {...evidence.residue, max: Q.residue.max + 1}}}),
        /Invalid wet field residue range/);
});

test('X v0: W drains into the generated account and reload keeps the witnessed holder by value', () => {
    const {value: field, receipt} = generate();
    const rules = composeSubstrate({packs: [createResidueFlowPack({drains: [
        {from: anchor.id, to: field.id, reason: 'The authored washroom drain empties into the downhill plot.'},
    ]})]});
    const world = createWorld(rules, {holders: [{id: anchor.id, kind: 'place'}, field]});
    // The fixture witnesses this holder. Only its identity is visible.
    const observed = ({id, kind}) => ({id, kind});
    const identity = observed(world.holders[field.id]);
    assert.deepEqual(identity, {id: field.id, kind: 'place'});
    const save = serializeWorld(world);
    const restored = restoreWorld(rules, JSON.parse(JSON.stringify(save)));
    assert.deepEqual(observed(restored.holders[field.id]), identity);
    assert.deepEqual(restored.holders[field.id].state[receipt.generator], receipt);
    assert.deepEqual(serializeWorld(restored), save);

    const amount = field.quantities[account];
    const pour = {op: 'publish', kind: K.water_poured.id, place: anchor.id,
        detail: {contents: {active: 30}}};
    const settle = (snapshot, effect = pour) =>
        applyWorldOps(rules, advanceWorld(rules, snapshot, 3).world, [effect], 'fixture.rinse');
    const drained = settle(restored);
    assert.deepEqual(serializeWorld(drained), serializeWorld(settle(world)));
    assert.equal(readQuantity(drained, field.id, account), amount + 30);
    assert.equal(readQuantity(drained, anchor.id, account), null);
    assert.deepEqual(readProvenance(drained, field.id, account),
        {[`w.residue_flow:drain:${anchor.id}`]: 30});
    const [, deposit] = drained.chain;
    assert.deepEqual(explainEffect(drained, deposit.seq).map(({kind, place, at}) => [kind, place, at]),
        [[K.water_poured.id, anchor.id, 3], ['effect.add', field.id, 3]]);

    // Same plot, new evidence: capacity changes for an uncommitted holder.
    // Importing the witnessed holder keeps the previous account and receipt.
    const changed = generate({evidence: {...evidence, source: 'fixture.later-survey',
        residue: {key: 'active', min: amount + 1, max: amount + 1}}}).value;
    assert.equal(changed.id, identity.id);
    const changedWorld = createWorld(rules, {holders: [{id: anchor.id, kind: 'place'}, changed]});
    const fullPour = {...pour, detail: {contents: {active: Q.residue.max - amount}}};
    assert.equal(readQuantity(settle(restored, fullPour), field.id, account), Q.residue.max);
    assert.throws(() => settle(changedWorld, fullPour), /insufficient capacity/);
    const imported = restoreWorld(rules, JSON.parse(JSON.stringify(serializeWorld(drained))));
    assert.deepEqual(observed(imported.holders[field.id]), identity);
    assert.equal(readQuantity(imported, field.id, account), amount + 30);
    assert.deepEqual(imported.holders[field.id].state[receipt.generator], receipt);
    assert.deepEqual(serializeWorld(imported), serializeWorld(drained));
});

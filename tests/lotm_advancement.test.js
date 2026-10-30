import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {seerPathway} from '../src/book_world_lotm_path.js';
import {pathView} from '../src/ascension_paths.js';
import {advanceLadder, advanceLadders, abilityViews} from '../src/lotm_advancement.js';

// Synthetic pack: same shape as the private one, invented content, so the tracked test never needs source text.
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const synthetic = () => ({rungs: {seq7: {label: 'Rung seven', crossings: [
    {id: 'digest7', type: 'digest', label: 'Acts', fact: 'acting7', need: 4},
    {id: 'dose7', type: 'ingest', label: 'Dose', fact: 'heldSeven', need: true, irreversible: true}],
    grants: ['A new faculty'], failure: {signs: 'Pressure', outcome: 'Owned by the backlash lane'},
    abilities: [{key: 'step', label: 'Step', sourceId: 'book.lotm.rungseven', conditions: [{label: 'Ready', requires: eq('actor.ready')}],
        cost: [{type: 'resource', scope: 'actor', key: 'spirit', amount: -1}], limit: {kind: 'cooldown', minutes: 5},
        effects: [{type: 'condition', id: 'book.lotm.rungseven.step', operation: 'apply', duration: 3}], failure: {hook: 'lotm.backlash'}}]}}});

test('without a pack the ladder is unchanged', () => {
    const r = advanceLadder(seerPathway, null);
    assert.equal(r.path, seerPathway);
    assert.equal(r.abilities, null);
    assert.deepEqual(abilityViews(r), []);
});

test('a rung pack fills the stub: crossings gate the next position and the ability records come out typed', () => {
    const r = advanceLadder(seerPathway, synthetic());
    const v = (facts) => pathView(r.path, 2, facts, {known: 4, ceiling: 3});
    assert.equal(v({acting7: 3, heldSeven: true}).ready, false);
    assert.equal(v({acting7: 4, heldSeven: false}).ready, false);
    assert.equal(v({acting7: 4, heldSeven: true}).ready, true);
    assert.equal(v({}).failure.outcome, 'Owned by the backlash lane');
    assert.equal(r.abilities.cards.step.failureHook, 'lotm.backlash');
    assert.deepEqual(r.conditions.map(c => c.id), ['book.lotm.rungseven.step']);
    const effects = r.promotionEffects.seq7;
    assert.ok(effects.some(e => e.type === 'source') && effects.some(e => e.type === 'power'));
});

test('the read model lists only held abilities and reports refusal by label', () => {
    const r = advanceLadder(seerPathway, synthetic());
    assert.deepEqual(abilityViews(r, {facts: {}}), []);
    const [a] = abilityViews(r, {facts: {'actor.ready': false}, held: ['book.lotm.adv.rungseven'], readyIn: {step: 2}});
    assert.deepEqual(a.refusedBy, ['Ready', 'recovering']);
    assert.equal(a.limit.readyIn, 2);
});

const privatePath = new URL('../private_packs/lotm-advancement/advancement.json', import.meta.url);
test('the private Sequence 7 pack, when present, compiles and every ability cites a locator', {skip: !existsSync(privatePath)}, () => {
    const pack = JSON.parse(readFileSync(privatePath, 'utf8'));
    const r = advanceLadder(seerPathway, pack);
    assert.ok(r.path.stages.find(s => s.id === 'seq7').crossings.every(c => c.type && c.fact));
    const all = advanceLadders(seerPathway, pack);
    const order = all.path.stages.map(s => s.id);
    assert.ok(order.indexOf('seq7') < order.indexOf('seq6') && order.indexOf('seq6') < order.indexOf('seq5'));
    assert.ok(Object.values(all.rungs.seq6.abilities.cards).some(c => c.blockedBy.length > 0));
    for(const rung of Object.values(pack.rungs)) for(const a of rung.abilities) for(const b of a.blockedBy ?? []) assert.ok(b.locator, a.key);
    assert.ok(Object.keys(r.abilities.cards).length >= 1);
    for(const row of pack.rungs.seq7.abilities) assert.ok(row.locator && row.conditions.every(c => c.locator), row.key);
    const ranks = Object.fromEntries(pack.rungs.seq7.abilities.map(a => [a.key, a.costBasis.rank])), spirit = k => -pack.rungs.seq7.abilities.find(a => a.key === k).cost.filter(c => c.key === 'spirituality').reduce((n, c) => n + c.amount, 0);
    assert.ok(spirit('paper_substitute') > spirit('flame_jump') && spirit('flame_jump') > spirit('air_bullet') && ranks.paper_substitute > ranks.flame_jump && ranks.flame_jump > ranks.air_bullet, 'cost order follows the cited ranking');
    assert.ok(pack.rungs.seq7.abilities.some(a => a.limit.kind === 'cooldown') && pack.rungs.seq7.abilities.some(a => a.limit.kind === 'charges'));
});

test('advanceLadders walks every rung of the pack in order and appends stages the base path lacks', () => {
    const pack = synthetic();
    pack.rungs.seq6 = {label: 'Rung six', crossings: [{id: 'dose6', type: 'ingest', label: 'Dose', fact: 'heldSix', need: true}], grants: ['Another faculty'],
        abilities: [{key: 'mask', label: 'Mask', sourceId: 'book.lotm.rungsix', conditions: [], cost: [], limit: {kind: 'none'}, blockedBy: [{label: 'a sharp-eyed observer', active: eq('actor.watched')}],
            effects: [{type: 'condition', id: 'book.lotm.rungsix.mask', operation: 'apply', duration: 5}]}]};
    const r = advanceLadders(seerPathway, pack);
    assert.deepEqual(r.path.stages.map(s => s.id).slice(-2), ['seq7', 'seq6']);
    assert.deepEqual(Object.keys(r.rungs), ['seq7', 'seq6']);
    assert.equal(r.rungs.seq6.abilities.cards.mask.blockedBy[0].label, 'a sharp-eyed observer');
    assert.ok(r.rungs.seq6.promotionEffects.some(e => e.type === 'source'));
});

test('advanceLadders refuses an ability key repeated across rungs', () => {
    const pack = synthetic();
    pack.rungs.seq6 = {...synthetic().rungs.seq7, label: 'Rung six'};
    assert.throws(() => advanceLadders(seerPathway, pack), /repeats across rungs/);
});

test('a loaded pack does not name rungs beyond the next one for a fresh life (ABILITIES F1)', async () => {
    const {setAdvancement, lotmPathView} = await import('../src/book_world_lotm_path.js');
    const pack = synthetic();
    pack.rungs.seq6 = {label: 'Rung six', crossings: [{id: 'dose6', type: 'ingest', label: 'Dose', fact: 'heldSix', need: true}], grants: ['Another faculty'], abilities: []};
    setAdvancement(pack);
    try {
        const names = lotmPathView({}, {'lotm.home.evernight': true, 'lotm.enrolled': true}).ladder.map(s => s.label);
        assert.ok(!names.includes('Rung seven') && !names.includes('Rung six'));
        assert.ok(names.includes('???'));
    } finally { setAdvancement(null); }
});

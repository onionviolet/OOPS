// PSA27 (PC8): the Gu working law and the spell law settle a working as a sentence, and the one effect host lands it.
import test from 'node:test';
import assert from 'node:assert/strict';
import {composeSubstrate, createWorld, readQuantity} from '../src/world_substrate.js';
import {WORLD_QUANTITIES as WQ, WORLD_PROPERTIES as WP} from '../src/world_quantities.js';
import {landEffect} from '../src/effect_host.js';
import {runGuStep} from '../src/gu_working_host.js';
import {guLanding, guSentenceKinds} from '../src/gu_effect_sentence.js';
import {guCatalogue} from '../src/gu_catalogue.js';
import {spellLabel} from '../src/spell_label.js';
import {hogwartsLumosRun as run, lumosLight} from '../src/world_packs/spell_charm_run.js';
import {serializeEngineWorld} from '../src/engine_world.js';

const rules = composeSubstrate({packs: [{id: 'w.vocabulary', quantities: Object.values(WQ), properties: Object.values(WP)}]});
const world = createWorld(rules, {clock: 0, holders: [{id: 'room', kind: 'place'}, {id: 'player', kind: 'body', place: 'room', quantities: {vitality: 10}, properties: {alive: true}}]});

test('a Gu treatment settles as a sentence and the host raises vitality', () => {
    const {effects} = runGuStep('vitality-leaf', 'treat', {at: 0, specimen: {id: 'leaf1', kind: 'vitality-leaf', rank: 1, alive: true, fedThrough: 1e9}});
    const [heal] = effects;
    assert.equal(heal.kind, 'heal');
    assert.deepEqual([heal.sentence.verb, heal.sentence.object], ['add', 'vitality']);
    const landed = landEffect(rules, world, heal, {cause: 'test:heal'});
    assert.equal(landed.status, 'landed');
    assert.equal(readQuantity(landed.world, 'player', 'vitality'), 10 + heal.details.amount);
});

test('every catalogue ability kind reads as a sentence, and an unknown kind stays a label that lands nothing', () => {
    const kinds = Object.values(guCatalogue).map(row => row.ability?.value?.effect?.kind).filter(Boolean);
    assert.ok(kinds.length >= 14);
    assert.deepEqual(kinds.filter(kind => !guLanding({kind, magnitude: 1}).sentence), []);
    assert.deepEqual(guLanding({kind: 'merged-body', magnitude: 1}), {});
    assert.ok(guSentenceKinds().includes('damage'));
    assert.equal(landEffect(rules, world, {kind: 'merged-body'}, {cause: 'test:label'}).status, 'label-only');
});

test('Lumos and Nox settle through the spell law; an old active-light run restores without a save change', () => {
    assert.equal(spellLabel({verb: 'add', object: 'light'}), 'spell.add.light');
    let engine = run.create();
    assert.equal(lumosLight(engine), 0);
    assert.deepEqual(run.view(engine).actions.map(action => action.id), ['lumos', 'nox']);
    engine = run.act(engine, 'lumos');
    assert.equal(lumosLight(engine), 4);
    const saved = JSON.parse(JSON.stringify(serializeEngineWorld(engine)));
    const back = run.restore(saved);
    assert.equal(lumosLight(back), 4, 'save and restore keep the landed light');
    assert.equal(run.view(back).history[0], 'Cast 1: Lumos.');
    const dark = run.act(back, 'nox');
    assert.equal(lumosLight(dark), 0, 'Nox removes the active wand-light');
    assert.equal(run.view(dark).result, "You cast Nox. The room's wand-light stands at 0.");
    assert.equal(lumosLight(run.act(dark, 'lumos')), 4, 'the existing Lumos action still works');
    assert.equal(lumosLight(run.act(run.act(back, 'lumos'), 'nox')), 0, 'one wand goes dark even after recasting Lumos');
});

test('Nox on an unlit room is a no-effect control', () => {
    const engine = run.act(run.create(), 'nox');
    assert.equal(lumosLight(engine), 0);
    assert.equal(run.view(engine).result, "You cast Nox. The room's wand-light stands at 0.");
});

// Hogwarts effect world pack (PC5, PC6, P1.8): the grammar and labeller load from src,
// and every spellbook case executes through the generic coverage runner.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {runCaseData, runCase} from '../scripts/coverage_report.mjs';
import {assembleEffect, lowerEffect} from '../src/effect_grammar.js';
import {HP_SPELL_ROWS, HP_SPELL_WORLD} from '../src/spell_pack_hogwarts.js';
import {labelSpellRow} from '../src/spell_grammar.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld,
    startEngineWorking} from '../src/engine_world.js';
import {sentenceFromIntent, sharedEffect} from '../src/spell_effects.js';
import {SPELL_EFFECT_LAW, spellEffectMethod} from '../src/spell_law.js';
import {WORLD_PROPERTIES} from '../src/world_quantities.js';
import {BREATHING_PACK} from '../src/world_substrate_packs/breathing.js';
import {brewDoseQuantity} from '../src/engine_brew_stock.js';
import {KNOWLEDGE_KINDS, recordsOf} from '../src/knowledge_record.js';
import * as pack from '../src/world_packs/hp_effect_pack.js';
import * as fixture from './fixtures/procedural_grammar/effect_worlds.mjs';

const ids = Object.keys(pack.HP_CASE_SCENES);

test('a Bedazzling Hex that loses contact still pays without hiding the wearer', async () => {
    const data = pack.coverageCase('bedazzling');
    data.timeline.splice(1, 0, {id: 'move-enchanter', ops: [
        {op: 'move', holder: 'enchanter', to: 'stairs'}, {op: 'move', holder: 'wand', to: 'stairs'},
    ]}, {id: 'restore-out-of-reach', restore: true});
    const sight = data.timeline.find(step => step.id === 'visible-again');
    const hidden = data.timeline.findIndex(step => step.id === 'hidden');
    data.timeline.splice(hidden, data.timeline.length - hidden, sight);
    data.timeline.find(step => step.id === 'release').expect.push({lawField: 'cloak-hex', direction: 'unchanged', to: null});
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);
});

test('only a body in reach can use a paid Portkey and its spent state survives restore', () => {
    const data = pack.coverageCase('portkey');
    const config = {packs: ['w.sky'], ...data.engine,
        shared: {...data.engine.shared, properties: Object.values(WORLD_PROPERTIES)},
        host: {...data.engine.host, laws: [SPELL_EFFECT_LAW], effects: {read: sharedEffect}}};
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const touch = (engine, actor) => pack.touchPortkey(engine, {carrier: 'kettle', actor});
    const initial = createEngineWorld({...data.world, ...config, holders: [...data.world.holders,
        {id: 'visitor', kind: 'body', place: 'hall'}, {id: 'bystander', kind: 'body', place: 'hall'},
        {id: 'distant', kind: 'body', place: 'office'}, {id: 'yard', kind: 'place'},
    ]});
    const cast = data.timeline[0].working;
    const pending = startEngineWorking(initial, {...spellEffectMethod(cast.spells), id: cast.id, payer: cast.payer});
    assert.equal(touch(pending, 'visitor'), pending);
    const outOfReach = applyEngineOps(pending, [{op: 'move', holder: 'kettle', to: 'yard'}], 'move-before-release');
    const missed = advanceEngineWorld(restore(outOfReach), 1).engine;
    assert.match(missed.records.workings.enchant.landed[0].reason, /no clear path/);
    assert.equal(missed.world.holders.caster.quantities.stamina, 3);
    assert.equal(touch(missed, 'visitor'), missed);
    const armed = advanceEngineWorld(restore(pending), 1).engine;
    const distant = touch(armed, 'distant');
    assert.equal(distant.records.stored['hp.portkey.kettle'].receipts.at(-1).reason, 'reach');
    const onward = applyEngineOps(distant, [{op: 'move', holder: 'kettle', to: 'yard'},
        {op: 'move', holder: 'visitor', to: 'yard'}, {op: 'move', holder: 'bystander', to: 'yard'}], 'carry-the-kettle');
    const used = touch(restore(onward), 'visitor');
    assert.deepEqual(serializeEngineWorld(used), serializeEngineWorld(touch(onward, 'visitor')));
    assert.equal(used.world.holders.visitor.place, 'office');
    assert.equal(used.world.holders.bystander.place, 'yard');
    assert.equal(used.world.holders.caster.quantities.stamina, 3);
    const retried = touch(restore(used), 'bystander');
    assert.equal(retried.records.stored['hp.portkey.kettle'].receipts.at(-1).reason, 'spent');
    assert.equal(retried.world.holders.bystander.place, 'yard');
});

test('a scheduled Portkey moves only its present graspers at departure, including after restore', () => {
    const data = pack.coverageCase('portkey');
    const config = {...data.engine, packs: ['w.sky', pack.HP_PORTKEY_GRIPS.id], ownPacks: [pack.HP_PORTKEY_GRIPS],
        shared: {...data.engine.shared, properties: Object.values(WORLD_PROPERTIES)},
        host: {...data.engine.host, laws: [SPELL_EFFECT_LAW], effects: {read: sharedEffect}}};
    const save = serializeEngineWorld;
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(save(engine))), config);
    const advance = (engine, at) => advanceEngineWorld(engine, at).engine;
    const args = actor => ({carrier: 'kettle', actor});
    const touch = (engine, actor) => pack.touchPortkey(engine, args(actor));
    const initial = createEngineWorld({...data.world, ...config, holders: [...data.world.holders,
        {id: 'yard', kind: 'place'}, ...['first', 'second', 'let-go', 'walked-away', 'returned', 'regrasped', 'bystander']
            .map(id => ({id, kind: 'body', place: 'hall'})),
    ]});
    const spell = pack.portkeyCast({carrier: 'kettle', caster: 'caster', wand: 'wand', destination: 'office', departure: 4});
    const pending = startEngineWorking(initial, {...spellEffectMethod([spell]), id: 'scheduled', payer: 'caster'});
    const armed = advance(restore(pending), 1);
    const held = ['first', 'second', 'let-go', 'walked-away', 'returned', 'regrasped'].reduce(touch, armed);
    const before = advance(pack.releasePortkey(held, args('let-go')), 3);
    const empty = ['first', 'second', 'walked-away', 'returned', 'regrasped'].reduce((engine, actor) =>
        pack.releasePortkey(engine, args(actor)), before);
    const missed = advance(restore(empty), 4);
    assert.equal(missed.records.stored['hp.portkey.kettle'].receipts.at(-1).reason, 'target-unavailable');
    assert.equal(touch(missed, 'bystander'), missed);
    assert.equal(missed.world.holders.first.place, 'hall');
    const separated = applyEngineOps(before, [
        {op: 'move', holder: 'walked-away', to: 'yard'},
        ...['returned', 'regrasped'].flatMap(holder => [{op: 'move', holder, to: 'yard'}, {op: 'move', holder, to: 'hall'}]),
    ], 'leave-the-kettle');
    for (const id of ['walked-away', 'returned', 'regrasped'])
        assert.deepEqual(separated.world.holders[id].properties.marks, []);
    const movedCarrier = applyEngineOps(before, [{op: 'move', holder: 'kettle', to: 'yard'},
        {op: 'move', holder: 'kettle', to: 'hall'}], 'move-and-return-kettle');
    assert.equal(advance(restore(movedCarrier), 4).world.holders.first.place, 'hall');
    const split = touch(restore(separated), 'regrasped');
    assert.equal(split.world.holders.first.place, 'hall');
    const departed = advance(restore(split), 4);
    assert.deepEqual(save(departed), save(advance(split, 4)));
    for (const id of ['first', 'second', 'regrasped']) {
        assert.equal(departed.world.holders[id].place, 'office');
        assert.deepEqual(departed.world.holders[id].properties.marks, []);
    }
    for (const id of ['let-go', 'returned', 'bystander', 'kettle']) assert.equal(departed.world.holders[id].place, 'hall');
    assert.equal(departed.world.holders['walked-away'].place, 'yard');
    assert.equal(departed.world.holders.caster.quantities.stamina, 3);
    assert.equal(departed.records.stored['hp.portkey.kettle'].status, 'spent');
    assert.equal(touch(departed, 'bystander'), departed);
});

test('the fixture re-exports the pack, so one Hogwarts grammar and labeller exist', () => {
    for (const name of ['hpEffects', 'labelHpEffect', 'compareHpEffect', 'HP_FORBID', 'hpEffectsGl2', 'labelHpEffectGl2']) assert.equal(fixture[name], pack[name], name);
    const out = pack.labelHpEffect({family: 'Move, stop and position', lead: 'Lift and support an object'});
    assert.equal(`${out.parts.verb} ${out.parts.object}`, 'move position');
    assert.deepEqual(pack.compareHpEffect(out, out.truth), []);
});

test('every Hogwarts case executes through the generic runner', async () => {
    assert.ok(ids.length >= 30);
    for (const id of ids) {
        const data = pack.coverageCase(id);
        // Preserve the generation grammar check for W-only scenes. Authored
        // owner scenes use the registered engine and prove their contact below.
        if (!data.engine) {
            assert.deepEqual(assembleEffect(pack.hpEffects, data.sentence).receipt.violations, [], `${id} sentence is not in the Hogwarts grammar`);
            const lowered = lowerEffect(data.sentence, {keys: data.keys});
            assert.ok(lowered.acts.length && !lowered.publish.length, id);
        }
        assert.equal((await runCaseData(data, {id})).state, 'expressed-authored', id);
        assert.ok(pack.HP_CASE_SCENES[id].seen, `${id} scene says what a reader sees`);
    }
});

test('the ledger carries exactly the pack cases, typed as the runner computes them', async () => {
    // The pack is not on the game's path yet (PC95), so the runner computes expressed, not runs.
    const ledger = fs.readFileSync(new URL('../docs/coverage/hp_spells.jsonl', import.meta.url), 'utf8').trim().split('\n').map(l => JSON.parse(l));
    const withCase = ledger.filter(r => r.case?.module === pack.HP_CASE_MODULE);
    assert.deepEqual(withCase.map(r => r.id).sort(), [...ids].sort());
    for (const row of withCase) assert.equal((await runCase(row, {reachable: new Set()})).state, row.state, row.id);
});

test('the camp ward case depends on both the jinx filter and the arrival warning', async () => {
    const wrongFilter = pack.coverageCase('salvio');
    wrongFilter.timeline.find(step => step.id === 'salvio').working.spells[0].details.params.spellObject = 'motion';
    assert.deepEqual(await runCaseData(wrongFilter, {id: 'salvio'}), {
        state: 'blocked:runner-expect-mismatch', detail: 'intercept: the world did not change as step expect says',
    });

    const noWarning = pack.coverageCase('cave');
    noWarning.world.holders.find(holder => holder.id === 'intruder').properties.camp_invited = true;
    assert.deepEqual(await runCaseData(noWarning, {id: 'cave'}), {
        state: 'blocked:runner-expect-mismatch', detail: 'intruder-enters: the world did not change as step expect says',
    });
});

test('a wrong expect is blocked, and an expect that restates the label is rejected', async () => {
    const kill = pack.coverageCase('kill');
    // Wrong outcome: the spider gaining vitality.
    assert.equal((await runCaseData({...kill, expect: [{holder: 'spider', quantity: 'vitality', direction: 'up'}]}, {id: 'kill'})).state, 'blocked:runner-expect-mismatch');
    // Wrong holder: the room changing instead of the feather.
    const lev = pack.coverageCase('levitation');
    assert.equal((await runCaseData({...lev, expect: [{holder: 'desk', quantity: 'humidity', direction: 'up'}]}, {id: 'levitation'})).state, 'blocked:runner-expect-mismatch');
    // The failure this packet guards: expect written as the sentence's own verb and object.
    await assert.rejects(runCaseData({...lev, expect: [{holder: 'feather', verb: lev.sentence.verb, object: lev.sentence.object, direction: 'changed'}]}, {id: 'levitation'}),
        /expect key verb is not a world term/);
    // A scene that disagrees with its sentence does not pass: the body-bind sentence on the levitation scene.
    const crossed = {...lev, sentence: pack.coverageCase('body-bind').sentence};
    const out = await runCaseData(crossed, {id: 'crossed'}).then(r => r.state, e => `threw: ${e.message}`);
    assert.doesNotMatch(out, /^expressed|^runs/);
});

test('every pack row without a case has a mechanism gap recorded in the ledger', () => {
    const ledger = fs.readFileSync(new URL('../docs/coverage/hp_spells.jsonl', import.meta.url), 'utf8').trim().split('\n').map(JSON.parse);
    const missing = HP_SPELL_ROWS.filter(row => !pack.HP_CASE_SCENES[row.id]).map(row => row.id);
    assert.deepEqual(Object.keys(pack.HP_CASE_LEFT_OUT).sort(), missing.sort());
    for (const id of missing) {
        const row = ledger.find(row => row.id === id);
        assert.equal(row.state, 'runs-authored', id);
        assert.ok(row.note.endsWith(pack.HP_CASE_LEFT_OUT[id]), id);
    }
});

test('the victim can evade a paid Oppugno after release and the bird does not substitute a bystander', async () => {
    const data = pack.coverageCase('oppugno');
    const contact = data.timeline.findIndex(step => step.id === 'contact');
    data.timeline.splice(contact, 0, {id: 'evade', ops: [{op: 'move', holder: 'ron', to: 'corridor'}]});
    for (const step of data.timeline.slice(contact + 1))
        step.expect = [{holder: 'ron', quantity: 'vitality', direction: 'unchanged', to: 10}];
    data.expect = data.expect.map(row => row.holder === 'ron'
        ? {holder: 'ron', quantity: 'vitality', direction: 'unchanged', to: 10} : row);
    data.expect.push({holder: 'ron', position: true, direction: 'changed', to: 'corridor'});
    assert.equal((await runCaseData(data, {id: 'oppugno-evaded'})).state, 'expressed-authored');
});

test('a diver without the Bubble-Head Charm exhausts their reserve and surfaces hurt', async () => {
    const data = pack.coverageCase('bubble-head');
    const wand = data.world.holders.find(holder => holder.id === 'wand');
    wand.properties.marks = [];
    const release = data.timeline.find(step => step.id === 'release');
    release.interruption = {working: 'bubble', reason: 'The casting implement is out of your hand.'};
    const paid = {holder: 'diver', quantity: 'stamina', direction: 'unchanged', to: 5};
    release.expect = [paid];
    const expiry = data.timeline.findIndex(step => step.id === 'expiry');
    data.timeline.splice(expiry, 4, {id: 'unprotected-dive', advanceTo: 9, expect: [
        {holder: 'diver', quantity: 'breath', direction: 'down', to: 0},
        {holder: 'diver', quantity: 'vitality', direction: 'down', to: 6},
    ]});
    data.expect = [paid, {holder: 'diver', quantity: 'breath', direction: 'down', to: 2},
        {holder: 'diver', quantity: 'vitality', direction: 'down', to: 5}];
    assert.equal((await runCaseData(data)).state, 'expressed-authored');
});

test('a closed fuel contact keeps Fiendfyre on one side and preserves the crossing after restore', async () => {
    const data = pack.coverageCase('fiendfyre');
    const spread = data.timeline.findIndex(step => step.id === 'spread');
    data.timeline.splice(spread, 1,
        {id: 'cut-contact', ops: [{op: 'link_set', id: 'fuel-line', state: 'closed'}]},
        {id: 'restore-closed', restore: true},
        {id: 'contained', advanceTo: 2, expect: [{lawField: 'fiendfyre:aisle', direction: 'unchanged', to: null}]});
    const crossing = data.timeline.findIndex(step => step.id === 'crossing-lost');
    data.timeline.splice(crossing, data.timeline.length - crossing, {id: 'cross', advanceTo: 7});
    data.expect.find(row => row.holder === 'runner' && row.position).to = 'aisle';
    Object.assign(data.expect.find(row => row.holder === 'aisle-fuel'), {direction: 'unchanged', to: 3});
    assert.equal((await runCaseData(data)).state, 'expressed-authored');
});

test('Fiendfyre crosses successive fuel contacts on separate clock boundaries', async () => {
    const data = pack.coverageCase('fiendfyre');
    data.world.holders.push(
        {id: 'stacks', kind: 'place', as: ['fiendfyre-site']},
        {id: 'stack-fuel', kind: 'thing', place: 'stacks', properties: {flammable: true}, quantities: {condition: 3}},
    );
    data.world.links.push({id: 'stack-contact', kind: 'fuel-contact', from: 'aisle', to: 'stacks'});
    data.timeline.find(step => step.id === 'spread').expect.push(
        {lawField: 'fiendfyre:stacks', direction: 'unchanged', to: null});
    data.timeline.find(step => step.id === 'crossing-lost').expect.push(
        {holder: 'stack-fuel', quantity: 'condition', direction: 'unchanged', to: 3});
    data.expect.push({holder: 'stack-fuel', quantity: 'condition', direction: 'down', to: 0});
    assert.equal((await runCaseData(data)).state, 'expressed-authored');
});

test('surfacing before the bubble expires preserves vitality and a full breath reserve', async () => {
    const data = pack.coverageCase('bubble-head');
    const expiry = data.timeline.findIndex(step => step.id === 'expiry');
    const back = data.timeline.find(step => step.id === 'return');
    const breath = {holder: 'diver', quantity: 'breath', direction: 'unchanged', to: 3};
    const vitality = {holder: 'diver', quantity: 'vitality', direction: 'unchanged', to: 10};
    data.timeline.splice(expiry, data.timeline.length - expiry, back, {id: 'surface', advanceTo: 12, expect: [
        {holder: 'diver', position: true, direction: 'changed', to: 'bank'}, breath, vitality,
    ]});
    data.expect = [data.expect[0], breath, vitality];
    assert.equal((await runCaseData(data)).state, 'expressed-authored');
});

test('a long submerged advance agrees with a partitioned restored dive through expiry', () => {
    const data = pack.coverageCase('bubble-head');
    const config = {...data.engine, ownPacks: [BREATHING_PACK],
        shared: {...data.engine.shared, properties: Object.values(WORLD_PROPERTIES)},
        host: {...data.engine.host, laws: [SPELL_EFFECT_LAW], effects: {read: sharedEffect}}};
    const cast = data.timeline.find(step => step.id === 'cast').working;
    const dive = data.timeline.find(step => step.id === 'dive');
    const initial = createEngineWorld({...data.world, ...config});
    const pending = startEngineWorking(initial, {...spellEffectMethod(cast.spells), id: cast.id, payer: cast.payer});
    const advance = (engine, to) => {
        const result = advanceEngineWorld(engine, to);
        assert.equal(result.pending, false);
        return result.engine;
    };
    const starting = applyEngineOps(advance(pending, 1), dive.ops, 'dive');
    const save = serializeEngineWorld;
    let restored = starting;
    for (let minute = 2; minute <= 9; minute++)
        restored = restoreEngineWorld(JSON.parse(JSON.stringify(save(advance(restored, minute)))), config);
    assert.deepEqual(save(advance(starting, 9)), save(restored));
});

test('a spoken cast fails after restore when Anapneo has not cleared the obstruction', async () => {
    const data = pack.coverageCase('anapneo');
    const reply = data.timeline.find(step => step.id === 'reply');
    data.timeline = [reply, {id: 'restore', restore: true}, {id: 'attempt', advanceTo: 1}];
    data.expect = [{holder: 'patient-wand', quantity: 'light:wand', direction: 'up', to: 2}];
    const result = await runCaseData(data, {id: 'obstructed-speech'});
    assert.equal(result.state, 'blocked:runner-working-interrupted');
    assert.match(result.detail, /cannot speak with an obstructed airway/);
});

test('Impervius blocks water during its lease and the next splash lands after expiry', async () => {
    const data = pack.coverageCase('waterproof');
    const splash = data.timeline.at(-1);
    const nowWet = {holder: 'glasses', quantity: 'humidity', direction: 'up', to: 3};
    data.timeline.push({id: 'ward-expires', advanceTo: 4}, {id: 'restore-after-expiry', restore: true},
        {...splash, id: 'second-splash', expect: [nowWet,
            {holder: 'spare-glasses', quantity: 'humidity', direction: 'up', to: 6}]});
    data.expect = [data.expect[0], nowWet];
    assert.equal((await runCaseData(data, {id: 'impervius-expiry'})).state, 'expressed-authored');
});

test('a paid Incendio that loses reach leaves the heat signal silent', async () => {
    const data = pack.coverageCase('fire');
    data.timeline.splice(2, 0, {id: 'step-out', ops: ['caster', 'wand'].map(holder =>
        ({op: 'move', holder, to: 'corridor'}))});
    const cold = {holder: 'hearth', quantity: 'temperature', direction: 'unchanged', to: 18};
    const quiet = {holder: 'hearth', quantity: 'noise', direction: 'unchanged', to: 0};
    const paid = data.expect.at(-1);
    data.timeline.find(step => step.id === 'release').expect = [cold, paid];
    data.timeline.find(step => step.id === 'threshold').expect = [quiet];
    data.expect = [cold, quiet, paid];
    const result = await runCaseData(data, {id: 'incendio-out-of-reach'});
    assert.equal(result.state, 'expressed-authored', result.detail);
});

test('Flame-Freezing expires while the same fire continues burning', async () => {
    const data = pack.coverageCase('flame-freezing');
    data.timeline.push({id: 'restore-in-fire', restore: true}, {id: 'expiry-exposure', advanceTo: 4});
    data.expect = data.expect.map(row => row.quantity !== 'burn' ? row : {...row, direction: 'up',
        to: row.holder === 'caster' ? 3 : 9});
    const result = await runCaseData(data, {id: 'flame-freezing-expiry'});
    assert.equal(result.state, 'expressed-authored', result.detail);
});

test('Arresto Momentum must reach the rider before impact and last through the final descent', async () => {
    for (const branch of ['late', 'blocked', 'expires-at-impact', 'expires-early']) {
        const data = pack.coverageCase('brake');
        const cast = data.timeline[0].working.spells[0];
        if (branch === 'late') cast.minutes = 2;
        if (branch === 'blocked') data.world.links[0].state = 'closed';
        if (branch === 'expires-at-impact') cast.details.minutes = 4;
        if (branch === 'expires-early') cast.details.minutes = 1;
        const paid = data.expect[0];
        const safe = branch === 'expires-at-impact';
        const vitality = {holder: 'rider', quantity: 'vitality', direction: safe ? 'unchanged' : 'down', to: safe ? 10 : 7};
        const [, , release, , descent, landing] = data.timeline;
        if (branch === 'late') {
            release.advanceTo = 2;
            release.expect = [paid, vitality, data.expect[1]];
        }
        if (branch === 'late' || branch === 'blocked') data.timeline.splice(data.timeline.indexOf(descent), 1);
        landing.expect = branch === 'late' ? [{...vitality, direction: 'unchanged'}] : [vitality, data.expect[1]];
        data.expect[2] = vitality;
        const result = await runCaseData(data, {id: `brake-${branch}`});
        assert.equal(result.state, 'expressed-authored', `${branch}: ${result.detail}`);
    }
});

test('a paid Erecto opens the pitched tent to a traveler after restore', () => {
    const data = pack.coverageCase('erecto');
    const config = {...data.engine, shared: {...data.engine.shared, properties: Object.values(WORLD_PROPERTIES)},
        host: {...data.engine.host, laws: [SPELL_EFFECT_LAW], effects: {read: sharedEffect}}};
    const save = serializeEngineWorld;
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(save(engine))), config);
    const advance = engine => advanceEngineWorld(engine, 1).engine;
    const enter = engine => pack.enterTent(engine, {actor: 'traveler', canvas: 'canvas', interior: 'tent-interior'});
    const initial = createEngineWorld({...data.world, ...config, holders: [...data.world.holders,
        {id: 'traveler', kind: 'body', place: 'clearing'}, {id: 'wood', kind: 'place'},
    ]});
    const cast = data.timeline[0].working;
    const pending = startEngineWorking(initial, {...spellEffectMethod(cast.spells), id: cast.id, payer: cast.payer});
    assert.equal(enter(pending), pending);
    const pitched = advance(restore(pending));
    assert.deepEqual(save(pitched), save(advance(pending)));
    const sheltered = enter(restore(pitched));
    assert.equal(sheltered.world.holders.traveler.place, 'tent-interior');
    assert.equal(sheltered.world.holders.canvas.place, 'clearing');
    assert.equal(sheltered.world.holders.caster.quantities.stamina, 4);

    const blocked = applyEngineOps(pitched, [{op: 'link_set', id: 'tent-entry.canvas', state: 'closed'}], 'entrance-closed');
    assert.equal(enter(blocked), blocked);
    const moved = applyEngineOps(pending, [{op: 'move', holder: 'canvas', to: 'wood'}], 'canvas-moved');
    const missed = advance(restore(moved));
    assert.match(missed.records.workings.pitch.landed[0].reason, /no clear path/);
    assert.equal(missed.world.holders.caster.quantities.stamina, 4);
    assert.equal(missed.world.holders.canvas.properties.form, 'folded-canvas');
    assert.equal(enter(missed), missed);
});

test('a restored Extension Charm changes which cargo fits without enlarging the bag', () => {
    const data = pack.coverageCase('extension');
    const config = {packs: ['w.sky'], ...data.engine,
        host: {...data.engine.host, laws: [SPELL_EFFECT_LAW], effects: {read: sharedEffect}}};
    const save = serializeEngineWorld;
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(save(engine))), config);
    const advance = engine => advanceEngineWorld(engine, 1).engine;
    const stow = (engine, item) => pack.stowInExtendedContainer(engine, {actor: 'caster', container: 'bag', item});
    const initial = createEngineWorld({...data.world, ...config});
    const cast = data.timeline[0].working;
    const pending = startEngineWorking(initial, {...spellEffectMethod(cast.spells), id: cast.id, payer: cast.payer});
    assert.equal(stow(pending, 'books'), pending);
    const expanded = advance(restore(pending));
    assert.deepEqual(save(expanded), save(advance(pending)));
    const filled = stow(restore(expanded), 'books');
    assert.equal(filled.world.holders.books.place, 'bag-interior');
    assert.equal(filled.world.holders.bag.properties.bulk, 2);
    assert.equal(filled.world.holders.caster.quantities.stamina, 3);
    const restored = restore(filled);
    assert.equal(stow(restored, 'blanket'), restored);

    const retrieve = engine => pack.retrieveFromExtendedContainer(engine, {actor: 'caster', container: 'bag', item: 'books'});
    const carried = applyEngineOps(restored, [{op: 'move', holder: 'bag', to: 'corridor'}], 'carry-bag');
    assert.equal(retrieve(restore(carried)).world.holders.books.place, 'bag-interior');
    const reunited = applyEngineOps(carried, ['caster', 'blanket'].map(holder =>
        ({op: 'move', holder, to: 'corridor'})), 'reach-bag');
    const closed = applyEngineOps(reunited, [{op: 'property', holder: 'bag', property: 'interior_closed', value: true}], 'close-bag');
    assert.deepEqual(save(retrieve(restore(closed))), save(closed));
    assert.equal(stow(reunited, 'blanket'), reunited);
    const unloaded = retrieve(restore(reunited));
    assert.deepEqual(save(unloaded), save(retrieve(reunited)));
    assert.equal(unloaded.world.holders.books.place, 'corridor');
    assert.equal(stow(restore(unloaded), 'blanket').world.holders.blanket.place, 'bag-interior');

    const moved = applyEngineOps(pending, [{op: 'move', holder: 'bag', to: 'corridor'}], 'bag-moved');
    const missed = advance(restore(moved));
    assert.match(missed.records.workings.extend.landed[0].reason, /no clear path/);
    assert.equal(missed.world.holders.bag.properties.interior_capacity, 2);
    assert.equal(missed.world.holders.caster.quantities.stamina, 3);
});

test('a restored Fidelius refuge opens to someone told by its keeper', () => {
    const data = pack.coverageCase('fidelius');
    const config = {...data.engine, host: {...data.engine.host, laws: [SPELL_EFFECT_LAW], effects: {read: sharedEffect}}};
    const save = serializeEngineWorld;
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(save(engine))), config);
    const advance = engine => advanceEngineWorld(engine, 1).engine;
    const approach = (engine, actor) => pack.approachRefuge(engine, {actor, place: 'refuge'});
    const tell = (engine, actor, listener) => pack.discloseRefuge(engine, {actor, listener, place: 'refuge'});
    const initial = createEngineWorld({...data.world, ...config});
    assert.equal(approach(initial, 'guest').world.holders.guest.place, 'refuge');
    const cast = data.timeline[0].working;
    const pending = startEngineWorking(initial, {...spellEffectMethod(cast.spells), id: cast.id, payer: cast.payer});
    const protectedWorld = restore(advance(restore(pending)));
    assert.deepEqual(save(protectedWorld), save(advance(pending)));
    assert.equal(protectedWorld.world.holders.keeper.quantities.stamina, 3);
    assert.equal(approach(protectedWorld, 'guest'), protectedWorld);

    const told = restore(tell(protectedWorld, 'keeper', 'guest'));
    assert.equal(tell(told, 'guest', 'stranger'), told);
    assert.equal(approach(told, 'stranger'), told);
    assert.equal(approach(told, 'guest').world.holders.guest.place, 'refuge');
    const retold = restore(applyEngineOps(told, [{op: 'publish', kind: KNOWLEDGE_KINDS.teach, place: 'approach', by: 'guest',
        detail: {knowledge: {from: 'guest', to: 'stranger', record: 'refuge:refuge', at: 1}}}], 'ordinary-retelling'));
    assert.equal(recordsOf(retold.world, 'stranger')['refuge:refuge'].source.by, 'guest');
    assert.equal(approach(retold, 'stranger'), retold);

    const moved = applyEngineOps(pending, ['keeper', 'wand'].map(holder => ({op: 'move', holder, to: 'lane'})), 'keeper-moves');
    const missed = advance(restore(moved));
    assert.match(missed.records.workings.conceal.landed[0].reason, /no clear path/);
    assert.equal(missed.world.holders.keeper.quantities.stamina, 3);
    assert.equal(approach(missed, 'guest').world.holders.guest.place, 'refuge');
});

test('a restored Protean inscription leads the member to the meeting, and severing the link stops updates', () => {
    const data = pack.coverageCase('protean');
    const config = {...data.engine, ownPacks: [pack.HP_PROTEAN_COINS],
        host: {...data.engine.host, laws: [SPELL_EFFECT_LAW], effects: {read: sharedEffect}}};
    const save = serializeEngineWorld;
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(save(engine))), config);
    const advance = (engine, at) => advanceEngineWorld(engine, at).engine;
    const initial = createEngineWorld({...data.world, ...config});
    const cast = data.timeline[0].working;
    const pending = startEngineWorking(initial, {...spellEffectMethod(cast.spells), id: cast.id, payer: cast.payer});
    const armed = advance(restore(pending), 1);
    const sent = applyEngineOps(armed, [...data.timeline[3].ops, ...data.timeline[4].ops], 'send-meeting-code');
    const feels = (engine, coin = 'copy') => pack.feelsMeetingCoin(engine, {actor: 'member', coin});
    const answer = (engine, coin) => pack.answerMeetingCoin(engine, {actor: 'member', coin,
        meetings: [{code: 'tonight', place: 'meeting'}]});
    assert.equal(answer(sent, 'copy'), sent);
    assert.equal(feels(sent), false);
    const delivered = advance(restore(sent), 2);
    assert.deepEqual(save(delivered), save(advance(sent, 2)));
    assert.equal(answer(delivered, 'plain'), delivered);
    assert.equal(feels(restore(delivered)), true);
    assert.equal(feels(delivered, 'plain'), false);
    const dropped = applyEngineOps(delivered, [{op: 'property', holder: 'copy', property: 'marks', value: []}], 'drop-coin');
    assert.equal(feels(restore(dropped)), false);
    const cooled = advance(restore(delivered), 4);
    assert.equal(feels(cooled), false);
    assert.equal(answer(cooled, 'copy').world.holders.member.place, 'meeting');
    assert.equal(answer(delivered, 'copy').world.holders.member.place, 'meeting');
    assert.equal(delivered.world.holders.caster.quantities.stamina, 3);

    const nextMessage = {op: 'property', holder: 'master', property: 'coin_inscription', value: 'tomorrow'};
    const updated = advance(restore(applyEngineOps(delivered, [nextMessage], 'reschedule')), 3);
    assert.equal(updated.world.holders.copy.properties.coin_inscription, 'tomorrow');
    const cut = applyEngineOps(delivered, [{op: 'law_remove', id: 'meeting-link'}, nextMessage], 'sever-link');
    assert.equal(advance(restore(cut), 3).world.holders.copy.properties.coin_inscription, 'tonight');
    assert.equal(feels(advance(restore(cut), 4)), false);

    const outOfReach = applyEngineOps(pending, data.timeline[3].ops, 'distribute-before-release');
    const missed = advance(restore(outOfReach), 1);
    assert.match(missed.records.workings['link-coin'].landed[0].reason, /no clear path/);
    assert.equal(missed.world.holders.caster.quantities.stamina, 3);
    const unsent = advance(restore(applyEngineOps(missed, data.timeline[4].ops, 'announce-after-miss')), 2);
    assert.equal(answer(unsent, 'copy'), unsent);
});

test('the Chamber opens to an intelligible local request and stays open after restore', () => {
    const data = pack.coverageCase('taboo');
    const config = {...data.engine, packs: ['a.mind', pack.HP_LANGUAGE_PASSAGE.id],
        ownPacks: [pack.HP_LANGUAGE_PASSAGE]};
    const save = serializeEngineWorld;
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(save(engine))), config);
    const initial = createEngineWorld({...config, holders: [
        ...['bathroom', 'chamber', 'hall'].map(id => ({id, kind: 'place'})),
        {id: 'sink', kind: 'thing', as: ['language-receiver'], place: 'bathroom'},
        {id: 'speaker', kind: 'body', place: 'bathroom', properties: {mind_awake: true}},
        {id: 'companion', kind: 'body', place: 'bathroom'},
    ], links: [{id: 'pipe', kind: 'language-passage', from: 'bathroom', to: 'chamber', state: 'closed'}],
    lawFields: [{id: 'sink-key', scope: 'sink', kind: 'language-key',
        params: {language: 'parseltongue', phrase: 'open', minClarity: 70, link: 'pipe'}}]});
    const ask = (engine, overrides) => pack.requestLanguagePassage(engine,
        {actor: 'speaker', receiver: 'sink', language: 'parseltongue', phrase: 'open', clarity: 75, ...overrides});
    const cross = engine => pack.enterLanguagePassage(engine, {actor: 'companion', destination: 'chamber'});
    assert.equal(cross(initial), initial);
    const wrongLanguage = ask(restore(initial), {language: 'english'});
    const wrongPhrase = ask(restore(wrongLanguage), {phrase: 'close'});
    const unclear = ask(restore(wrongPhrase), {clarity: 60});
    assert.equal(cross(unclear), unclear);
    const muted = applyEngineOps(unclear, [{op: 'property', holder: 'speaker', property: 'mind_speech_disrupted',
        value: true}], 'speaker-muted');
    assert.deepEqual(save(ask(restore(muted))), save(muted));
    const quiet = applyEngineOps(unclear, [{op: 'law_add', field: {id: 'silent-speaker', scope: 'speaker',
        kind: 'block', params: {verb: 'add', object: 'noise'}}}], 'silence-speaker');
    assert.deepEqual(save(ask(restore(quiet))), save(quiet));
    const distant = applyEngineOps(unclear, [{op: 'move', holder: 'speaker', to: 'hall'}], 'speaker-leaves');
    assert.equal(ask(distant), distant);
    const opened = ask(restore(unclear));
    assert.deepEqual(save(opened), save(ask(unclear)));
    assert.equal(cross(restore(opened)).world.holders.companion.place, 'chamber');
    assert.equal(opened.world.holders.speaker.place, 'bathroom');
});

test('a Trace reports the place of a visitor’s magic without blaming the pupil', () => {
    const data = pack.coverageCase('trace');
    const config = {...data.engine, ownPacks: [pack.HP_TRACE],
        host: {...data.engine.host, laws: [SPELL_EFFECT_LAW], effects: {read: sharedEffect}}};
    const save = serializeEngineWorld;
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(save(engine))), config);
    const advance = (engine, at) => advanceEngineWorld(engine, at).engine;
    const start = (engine, id, working) => startEngineWorking(engine, {
        ...spellEffectMethod(working.spells), id, payer: working.payer,
    });
    const initial = createEngineWorld({...data.world, ...config});
    const armed = restore(advance(start(initial, 'install', data.timeline[0].working), 1));
    const manual = applyEngineOps(armed, [{op: 'move', holder: 'dish', to: 'ledge'}], 'carry-dish');
    assert.deepEqual(recordsOf(manual.world, 'official'), {});
    const hover = engine => start(engine, 'hover', data.timeline[3].working);
    const pending = hover(armed);
    const detected = restore(advance(restore(pending), 2));
    assert.deepEqual(save(detected), save(advance(pending, 2)));
    const [record] = Object.values(recordsOf(detected.world, 'official'));
    assert.deepEqual(record.believed, {value: 'kitchen'});
    assert.deepEqual(record.source, {kind: 'observation', by: 'official', at: 2});
    assert.equal(detected.world.holders.installer.quantities.stamina, 3);
    assert.equal(pack.investigateTrace(detected, {official: 'visitor', report: record.id}), detected);
    assert.equal(pack.investigateTrace(detected, {official: 'official', report: record.id}).world.holders.official.place, 'kitchen');
    const absent = applyEngineOps(armed, [{op: 'move', holder: 'pupil', to: 'office'}], 'pupil-leaves');
    assert.deepEqual(recordsOf(advance(restore(hover(absent)), 2).world, 'official'), {});
    const expired = advance(armed, 5);
    assert.deepEqual(recordsOf(advance(restore(hover(expired)), 6).world, 'official'), {});
});

test('a saved Taboo report leads its watcher to where the name was spoken', () => {
    const data = pack.coverageCase('taboo');
    const config = {...data.engine, ownPacks: [pack.HP_TABOO],
        host: {...data.engine.host, laws: [SPELL_EFFECT_LAW], effects: {read: sharedEffect}}};
    const save = serializeEngineWorld;
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(save(engine))), config);
    const initial = createEngineWorld({...data.world, ...config});
    const cast = data.timeline[0].working;
    const pending = startEngineWorking(initial, {...spellEffectMethod(cast.spells), id: cast.id, payer: cast.payer});
    const armed = restore(advanceEngineWorld(restore(pending), 1).engine);
    const speak = (engine, name) => pack.speakTabooName(engine, {actor: 'speaker', name});
    const ignored = speak(armed, 'You-Know-Who');
    assert.deepEqual(recordsOf(ignored.world, 'watcher'), {});
    assert.ok(ignored.world.laws.some(field => field.id === 'camp-screen'));
    const muted = applyEngineOps(armed, [{op: 'property', holder: 'speaker', property: 'mind_speech_disrupted', value: true}], 'mute-speaker');
    assert.equal(speak(restore(muted), 'Voldemort').world.seq, muted.world.seq);
    const detected = restore(speak(restore(ignored), 'Voldemort'));
    assert.deepEqual(save(detected), save(speak(ignored, 'Voldemort')));
    assert.ok(!detected.world.laws.some(field => field.id === 'camp-screen'));
    assert.ok(detected.world.laws.some(field => field.id === 'sound-screen'));
    assert.equal(detected.world.holders.caster.quantities.stamina, 3);
    const [record] = Object.keys(recordsOf(detected.world, 'watcher'));
    assert.equal(pack.followTabooReport(detected, {actor: 'caster', record}), detected);
    assert.equal(pack.followTabooReport(detected, {actor: 'watcher', record}).world.holders.watcher.place, 'camp');
    const closed = applyEngineOps(detected, [{op: 'link_set', id: 'track', state: 'closed'}], 'close-track');
    assert.equal(pack.followTabooReport(closed, {actor: 'watcher', record}), closed);
});

test('restored Silencio blocks Taboo speech and spoken casts while leaving silent casting available', () => {
    const data = pack.coverageCase('taboo');
    const config = {...data.engine, ownPacks: [pack.HP_TABOO],
        host: {...data.engine.host, laws: [SPELL_EFFECT_LAW], effects: {read: sharedEffect}}};
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const advance = (engine, at) => advanceEngineWorld(engine, at).engine;
    const speak = engine => pack.speakTabooName(engine, {actor: 'speaker', name: 'Voldemort'});
    const start = (engine, id, payer, spells) => startEngineWorking(engine, {
        ...spellEffectMethod(spells), id, payer,
    });
    const initial = createEngineWorld({...data.world, ...config, holders: [
        ...data.world.holders.map(holder => holder.id === 'speaker'
            ? {...holder, as: ['creature'], quantities: {stamina: 5}} : holder),
        {id: 'speaker-wand', kind: 'thing', as: ['implement'], place: 'camp',
            properties: {marks: ['grip:speaker']}, quantities: {'light:wand': 0}},
    ]});
    const armed = advance(start(initial, 'taboo', 'caster', data.timeline[0].working.spells), 1);
    const silence = {
        sentence: {verb: 'block', object: 'voice', target: 'creature', time: 'sustained', cost: 'stamina'},
        target: {id: 'speaker'}, grip: {caster: 'caster', implement: 'wand'}, requiresSpeech: true,
        minutes: 1, details: {field: 'silenced-voice', params: {verb: 'add', object: 'noise'}, minutes: 3, cost: 1},
    };
    const muted = restore(advance(start(armed, 'silence', 'caster', [silence]), 2));
    assert.equal(speak(muted), muted);
    const lumos = {
        sentence: {verb: 'add', object: 'light', target: 'implement', time: 'instant', cost: 'stamina'},
        target: {id: 'speaker-wand'}, grip: {caster: 'speaker', implement: 'speaker-wand'},
        minutes: 1, details: {key: 'wand', amount: 2, cost: 1},
    };
    const stopped = advance(restore(start(muted, 'spoken', 'speaker', [{...lumos, requiresSpeech: true}])), 3);
    assert.match(stopped.records.workings.spoken.record.receipts[0].reason, /cannot make a sound/);
    assert.equal(stopped.world.holders.speaker.quantities.stamina, 5);
    const lit = advance(restore(start(stopped, 'silent', 'speaker', [lumos])), 4);
    assert.equal(lit.world.holders['speaker-wand'].quantities['light:wand'], 2);
    assert.equal(lit.world.holders.speaker.quantities.stamina, 4);
    assert.equal(speak(lit), lit);
    const recovered = restore(advance(lit, 5));
    assert.equal(Object.keys(recordsOf(speak(recovered).world, 'watcher')).length, 1);
});

test('a restored Revelaspell reading guides the caster’s antidote choice', () => {
    const data = pack.coverageCase('properties-reveal');
    const config = {...data.engine, host: {...data.engine.host, laws: [SPELL_EFFECT_LAW], effects: {read: sharedEffect}}};
    const save = serializeEngineWorld;
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(save(engine))), config);
    const advance = engine => advanceEngineWorld(engine, 1).engine;
    const select = (engine, observer) => pack.selectAssayAntidote(engine, {observer, sample: 'sample',
        candidates: ['first-antidote', 'second-antidote']});
    const initial = createEngineWorld({...data.world, ...config});
    const cast = data.timeline[0].working;
    const pending = startEngineWorking(initial, {...spellEffectMethod(cast.spells), id: cast.id, payer: cast.payer});
    assert.equal(select(pending, 'caster'), null);
    const read = restore(advance(restore(pending)));
    assert.deepEqual(save(read), save(advance(pending)));
    assert.equal(read.world.holders.caster.quantities.stamina, 4);
    assert.equal(select(read, 'caster'), 'second-antidote');
    assert.equal(select(read, 'observer'), null);

    const concealed = applyEngineOps(pending, [{op: 'property', holder: 'sample', property: 'concealed',
        value: ['composition']}], 'conceal-ingredients');
    const empty = advance(restore(concealed));
    assert.equal(empty.world.holders.caster.quantities.stamina, 4);
    assert.equal(select(empty, 'caster'), null);
    assert.match(empty.records.workings.inspect.record.receipts[0].observed.seen, /reveals no ingredients/);
    const moved = applyEngineOps(pending, [{op: 'move', holder: 'sample', to: 'corridor'}], 'sample-moved');
    const interrupted = advance(restore(moved));
    assert.equal(interrupted.records.workings.inspect.record.status, 'interrupted');
    assert.equal(interrupted.world.holders.caster.quantities.stamina, 5);
    assert.equal(select(interrupted, 'caster'), null);
});

test('Revelaspell reads live flask stock at release and a later assay changes the choice', () => {
    const data = pack.coverageCase('properties-reveal');
    const config = {...data.engine, host: {...data.engine.host, laws: [SPELL_EFFECT_LAW], effects: {read: sharedEffect}}};
    const save = serializeEngineWorld;
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(save(engine))), config);
    const advance = (engine, at) => advanceEngineWorld(engine, at).engine;
    const select = (engine, observer = 'caster') => pack.selectAssayAntidote(engine, {observer, sample: 'sample',
        candidates: ['first-antidote', 'second-antidote']});
    const mint = brewDoseQuantity('mint'), root = brewDoseQuantity('night-root');
    const initial = createEngineWorld({...data.world, ...config, holders: data.world.holders.map(holder => holder.id === 'sample'
        ? {...holder, as: [...holder.as, 'flask'], properties: {}, quantities: {[mint]: 3, [root]: 0}} : holder)});
    const cast = data.timeline[0].working;
    const spells = cast.spells.map(spell => ({...spell, inspectComposition: 'dose'}));
    const inspect = (engine, id) => startEngineWorking(engine, {...spellEffectMethod(spells), id, payer: cast.payer});
    const refill = (engine, take, add) => applyEngineOps(engine, [
        {op: 'add', holder: 'sample', quantity: take, amount: -3},
        {op: 'add', holder: 'sample', quantity: add, amount: 3},
    ], 'change-sample');
    const changed = refill(inspect(initial, 'first'), mint, root);
    const read = advance(restore(changed), 1);
    assert.deepEqual(save(read), save(advance(changed, 1)));
    assert.equal(select(restore(read)), 'second-antidote');
    assert.equal(select(read, 'observer'), null);
    assert.deepEqual(read.world.holders.sample.quantities, {[mint]: 0, [root]: 3});
    const changedAgain = refill(read, root, mint);
    assert.equal(select(changedAgain), 'second-antidote');
    const readAgain = advance(restore(inspect(changedAgain, 'second')), 2);
    assert.equal(select(restore(readAgain)), 'first-antidote');
    assert.equal(readAgain.world.holders.caster.quantities.stamina, 3);

    const drained = applyEngineOps(readAgain, [{op: 'add', holder: 'sample', quantity: mint, amount: -3}], 'drain-flask');
    const hidden = applyEngineOps(drained, [{op: 'property', holder: 'sample', property: 'concealed', value: ['composition']}], 'hide-flask');
    const unreadable = advance(restore(inspect(hidden, 'unreadable')), 3);
    assert.equal(select(restore(unreadable)), 'first-antidote');
    const empty = advance(restore(inspect(drained, 'empty')), 3);
    assert.equal(select(restore(empty)), null);
    assert.equal(empty.world.holders.caster.quantities.stamina, 2);
});

test('a restored Revelaspell resolves aged contents at the casting deadline', () => {
    const data = pack.coverageCase('properties-reveal');
    const config = {...data.engine, host: {...data.engine.host, laws: [SPELL_EFFECT_LAW], effects: {read: sharedEffect}}};
    const save = serializeEngineWorld;
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(save(engine))), config);
    const active = brewDoseQuantity('night-root'), spent = brewDoseQuantity('night-root:spent');
    const initial = createEngineWorld({...data.world, ...config, holders: data.world.holders.map(holder => holder.id === 'sample'
        ? {...holder, as: ['object', 'flask'], properties: {}, quantities: {[active]: 8},
            state: {'b.brew_storage': {bottledAt: 0, life: 4}}} : holder)});
    const cast = data.timeline[0].working;
    const inspect = (engine, id, minutes) => startEngineWorking(engine, {
        ...spellEffectMethod(cast.spells.map(spell => ({...spell, minutes, inspectComposition: 'dose',
            target: {...spell.target, kind: 'flask'}}))), id, payer: cast.payer,
    });
    const advance = (engine, at) => advanceEngineWorld(engine, at).engine;
    const fresh = advance(restore(inspect(initial, 'earlier', 1)), 1);
    assert.equal(recordsOf(fresh.world, 'caster')[`assay:sample:1:${active}`].believed.value, 6);
    const pending = inspect(fresh, 'later', 3);
    const aged = advance(restore(pending), 4);
    assert.deepEqual(save(aged), save(advance(pending, 4)));
    const records = recordsOf(restore(aged).world, 'caster');
    assert.equal(records[`assay:sample:4:${active}`], undefined);
    assert.equal(records[`assay:sample:4:${spent}`].believed.value, 8);
    assert.equal(pack.selectAssayAntidote(aged, {observer: 'caster', sample: 'sample', candidates: ['second-antidote']}), null);
    assert.deepEqual(aged.world.holders.sample.quantities, {[active]: 8});
    assert.equal(aged.world.holders.caster.quantities.stamina, 3);
});

test('Obliteration stops a tracker reading the erased trail after restore', () => {
    const data = pack.coverageCase('obliterate-trace');
    const config = {...data.engine, host: {...data.engine.host, laws: [SPELL_EFFECT_LAW], effects: {read: sharedEffect}}};
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const advance = (engine, at) => advanceEngineWorld(engine, at).engine;
    const follow = (engine, destination) => pack.followSnowTrail(engine, {actor: 'tracker', destination});
    const initial = createEngineWorld({...data.world, ...config, holders: [...data.world.holders,
        {id: 'tracker', kind: 'body', place: 'snow'},
    ]});
    const cast = data.timeline[0].working;
    const pending = startEngineWorking(initial, {...spellEffectMethod(cast.spells), id: cast.id, payer: cast.payer});
    const erased = restore(advance(restore(pending), 1));
    assert.equal(erased.world.holders.caster.quantities.stamina, 4);
    assert.equal(follow(erased, 'cabin'), erased);
    const queued = follow(erased, 'shed');
    const arrived = advance(restore(queued), 2);
    assert.equal(arrived.world.holders.tracker.place, 'shed');
    assert.deepEqual(serializeEngineWorld(arrived), serializeEngineWorld(advance(queued, 2)));

    // Reading the trail before release can get the tracker moving in time.
    const alreadySeen = advance(restore(follow(pending, 'cabin')), 1);
    assert.equal(alreadySeen.world.holders.tracker.place, 'cabin');
    assert.deepEqual(alreadySeen.world.holders.snow.properties.marks, ['snow-trail:shed']);

    const outOfReach = applyEngineOps(pending, [
        {op: 'move', holder: 'caster', to: 'shed'}, {op: 'move', holder: 'wand', to: 'shed'},
    ], 'caster-withdraws');
    const missed = advance(restore(outOfReach), 1);
    assert.match(missed.records.workings.erase.landed[0].reason, /no clear path/);
    assert.equal(missed.world.holders.caster.quantities.stamina, 4);
    assert.equal(advance(restore(follow(missed, 'cabin')), 2).world.holders.tracker.place, 'cabin');
});

test('a later crossing leaves fresh footprints after Obliteration and restore', () => {
    const data = pack.coverageCase('obliterate-trace');
    const config = {...data.engine, packs: [...data.engine.packs, pack.HP_SNOW_TRAILS.id], ownPacks: [pack.HP_SNOW_TRAILS],
        host: {...data.engine.host, laws: [SPELL_EFFECT_LAW], effects: {read: sharedEffect}}};
    const save = serializeEngineWorld;
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(save(engine))), config);
    const advance = (engine, at) => advanceEngineWorld(engine, at).engine;
    const follow = engine => pack.followSnowTrail(engine, {actor: 'tracker', destination: 'cabin'});
    const holders = data.world.holders.map(holder => holder.id === 'snow'
        ? {...holder, tags: ['trackable-snow'], properties: {marks: []}} : holder);
    const initial = createEngineWorld({...data.world, ...config, holders: [...holders,
        {id: 'walker', kind: 'body', place: 'snow', properties: {agency_goal: 'cabin'}},
        {id: 'tracker', kind: 'body', place: 'snow'},
    ]});
    assert.equal(follow(initial), initial);
    const closed = applyEngineOps(initial, [{op: 'link_set', id: 'cabin', state: 'closed'}], 'path-closed');
    const stalled = advance(restore(closed), 1);
    assert.equal(stalled.world.holders.walker.place, 'snow');
    assert.deepEqual(stalled.world.holders.snow.properties.marks, []);
    const crossed = restore(advance(initial, 1));
    assert.equal(crossed.world.holders.walker.place, 'cabin');
    assert.equal(advance(follow(crossed), 2).world.holders.tracker.place, 'cabin');

    const cast = data.timeline[0].working;
    const pending = startEngineWorking(crossed, {...spellEffectMethod(cast.spells), id: cast.id, payer: cast.payer});
    const erased = restore(advance(restore(pending), 2));
    assert.equal(follow(erased), erased);
    assert.equal(erased.world.holders.caster.quantities.stamina, 4);

    const returned = applyEngineOps(erased, [{op: 'move', holder: 'walker', to: 'snow'}], 'return-to-snow');
    const crossedAgain = advance(restore(returned), 3);
    const queued = follow(restore(crossedAgain));
    const arrived = advance(restore(queued), 4);
    assert.equal(arrived.world.holders.tracker.place, 'cabin');
    assert.deepEqual(save(arrived), save(advance(queued, 4)));
});

test('Anapneo spends the release effort but cannot clear a patient who has moved out of reach', async () => {
    const data = pack.coverageCase('anapneo');
    data.world.holders.push({id: 'corridor', kind: 'place'});
    const [treat, save, clear] = data.timeline;
    const obstruction = {holder: 'patient', property: 'marks', direction: 'unchanged'};
    clear.expect = [data.expect[1], obstruction];
    data.timeline = [treat, {id: 'patient-moves', ops: [{op: 'move', holder: 'patient', to: 'corridor'}]}, save, clear];
    data.expect = clear.expect;
    assert.equal((await runCaseData(data, {id: 'anapneo-out-of-reach'})).state, 'expressed-authored');
});

test('a wisp or an interrupted guardian leaves the approach open after restore', async () => {
    for (const formed of [false, true]) {
        const data = pack.coverageCase('patronus');
        const release = data.timeline.find(step => step.id === 'form').working.spells[0];
        const contact = data.timeline.find(step => step.id === 'contact');
        const guardian = release.details.create;
        if (formed) {
            // A real confusion spell changes the caster's focus before contact.
            const beforeRestore = data.timeline.findIndex(step => step.id === 'restore');
            data.world.holders.push(
                {id: 'opponent', kind: 'body', place: 'bank', quantities: {stamina: 5}},
                {id: 'opponent-wand', kind: 'thing', place: 'bank', properties: {marks: ['grip:opponent']}},
            );
            const confusion = HP_SPELL_ROWS.find(row => row.id === 'confuse');
            const harry = data.world.holders.find(holder => holder.id === 'harry');
            harry.as.push('creature');
            harry.properties = {mind_awake: true};
            data.timeline.splice(beforeRestore, 0, {id: 'disrupt-focus',
                working: {family: 'spell', id: 'confusion', payer: 'opponent', spells: [{
                    sentence: sentenceFromIntent(labelSpellRow(confusion, HP_SPELL_WORLD).parts),
                    target: {id: 'harry'}, grip: {caster: 'opponent', implement: 'opponent-wand'},
                    contact: {links: 0}, minutes: 0, details: {cost: 1, minutes: 2, mind: {faculty: 'confusion', amount: 1}},
                }]}, expect: [
                    {holder: 'harry', property: 'mind_confusion', direction: 'changed', to: 1},
                    {holder: 'opponent', quantity: 'stamina', direction: 'down', to: 4},
                ]});
        } else {
            guardian.properties = {form: 'wisp'};
        }
        contact.expect = [{holder: 'dementor', position: true, direction: 'unchanged', to: 'approach'}];
        if (formed) contact.expect.push({holder: guardian.id, exists: true, direction: 'changed', to: false});
        const harm = {holder: 'harry', quantity: 'vitality', direction: 'down', to: 8};
        data.timeline.at(-1).expect = [harm, {holder: 'harry', quantity: 'stamina', direction: 'unchanged', to: 3}];
        data.expect = [
            data.expect[0], harm,
            ...(formed ? [] : [{holder: guardian.id, exists: true, direction: 'changed', to: true},
                {holder: guardian.id, position: true, direction: 'changed', to: 'bank'}]),
        ];
        const result = await runCaseData(data, {id: formed ? 'guardian-lost' : 'wisp'});
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

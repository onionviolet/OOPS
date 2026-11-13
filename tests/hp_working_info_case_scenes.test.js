import test from 'node:test';
import assert from 'node:assert/strict';
import {runCaseData, expectHolds} from '../scripts/coverage_report.mjs';
import {caseSentence, HP_KEYS} from '../src/world_packs/hp_effect_pack.js';
import {HP_SPELL_ROWS, HP_SPELL_WORLD} from '../src/spell_pack_hogwarts.js';
import {HP_WORKING_INFO_SCENES, HP_WORKING_END_SCENES, isRainingInPlace} from '../src/world_packs/hp_working_info_case_scenes.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {landEffect} from '../src/effect_host.js';
import {applyEffect} from '../src/world_effects.js';
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from '../src/world_quantities.js';
import {skyQuantities} from '../src/world_sky.js';
import {WORLD_CALENDAR_PROFILES} from '../src/world_calendar_content.js';
import {sentenceFromIntent, sharedEffect} from '../src/spell_effects.js';
import {labelSpellRow} from '../src/spell_grammar.js';
import {SPELL_EFFECT_LAW, spellEffectMethod} from '../src/spell_law.js';
import {WORKING_END_PACK} from '../src/world_substrate_packs/working_end.js';

function caseData(id, scene) {
    const {holders, lawFields, engine, details, by, expect} = scene;
    return {world: {holders, lawFields}, engine, details, by, expect, keys: HP_KEYS,
        sentence: caseSentence(HP_SPELL_ROWS.find(row => row.id === id))};
}

for (const [id, scene] of Object.entries(HP_WORKING_INFO_SCENES)) {
    test(`${id}: the shared runner observes a named observer's changed contact`, async () => {
        const data = caseData(id, scene);
        assert.equal((await runCaseData(data, {id})).state, 'expressed-authored');
        const withoutOwner = {packs: ['w.sky'], shared: {
            properties: [...Object.values(WORLD_PROPERTIES), {id: 'sensed-presence', type: 'set'}],
        }};
        assert.equal((await runCaseData({...data, engine: withoutOwner}, {id})).state, 'blocked:runner-waiting');
    });
}

for (const [id, scene] of Object.entries(HP_WORKING_END_SCENES)) {
    test(`${id}: the shared runner and producer end the bound working`, async () => {
        const data = caseData(id, scene);
        assert.equal((await runCaseData(data, {id})).state, 'expressed-authored');
        const engine = createEngineWorld({...data.world, ...data.engine,
            shared: {properties: Object.values(WORLD_PROPERTIES), quantities: [WORLD_QUANTITIES.rain]}});
        const result = landEffect(engine.rules, engine.world, data, {cause: `effect-probe:${id}`});
        assert.ok(expectHolds(engine.world, result.world, data.expect));
        const holder = result.world.holders[data.details.target.id];
        assert.deepEqual(holder.state[WORKING_END_PACK].active, []);
        assert.equal(holder.state[WORKING_END_PACK].ended[0].remainingCharge, 2);
        if (id === 'counter-spell') {
            const leave = world => applyEffect(engine.rules, world,
                {verb: 'move', object: 'position', target: data.details.target, to: 'dance-spot'}, 'step');
            assert.equal(leave(engine.world).outcome.blocked.length, 1);
            assert.equal(leave(result.world).world.holders.duellist.place, 'dance-spot');
        }
    });
}

test('disillusion prevents sight reacquisition while an independent presence channel still works', () => {
    const data = caseData('disillusion', HP_WORKING_INFO_SCENES.disillusion);
    const engine = createEngineWorld({...data.world, ...data.engine});
    const sense = (world, channel) => applyEffect(engine.rules, world,
        {verb: 'sense', target: data.details.target, channel, by: 'watcher', presence: true}, 'probe');
    assert.equal(sense(engine.world, 'sight').outcome.observed.length, 1);
    const after = landEffect(engine.rules, engine.world, data, {cause: 'concealment', by: data.by}).world;
    assert.equal(sense(after, 'sight').outcome.observed.length, 0);
    assert.equal(sense(after, 'presence').outcome.observed.length, 1);
});

test('a paid Deletrius after restore dismisses the visible replay and preserves its source', () => {
    const data = caseData('history-release', HP_WORKING_END_SCENES['history-release']);
    const config = {...data.engine, host: {laws: [SPELL_EFFECT_LAW], costs: {accounts: {stamina: {quantity: 'stamina'}}},
        effects: {read: sharedEffect}}, shared: {properties: Object.values(WORLD_PROPERTIES),
        quantities: [{id: 'stamina', min: 0, max: 5, unit: 'effort'}]}};
    const engine = createEngineWorld({...config, ...data.world, holders: [...data.world.holders,
        {id: 'observer', kind: 'body', place: 'clearing', quantities: {stamina: 5}, properties: {marks: []}},
        {id: 'observer-wand', kind: 'thing', place: 'clearing', properties: {marks: ['grip:observer']}},
    ]});
    const restore = world => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(world))), config);
    const inspectEcho = world => world.world.laws.find(field => field.kind === 'wand-echo' &&
        field.scope === 'evidence-wand')?.params.spell;
    const cast = (world, {id, spell, target, implement = 'observer-wand', details}) => {
        const row = HP_SPELL_ROWS.find(row => row.id === spell);
        return startEngineWorking(world, {
            ...spellEffectMethod([{sentence: sentenceFromIntent(labelSpellRow(row, HP_SPELL_WORLD).parts), name: row.id,
                target: {id: target}, grip: {caster: 'observer', implement}, contact: {links: 0},
                details: {cost: 1, ...details},
            }]), payer: 'observer', id,
        });
    };
    const dismiss = (world, working) => cast(world, {
        id: 'deletrius', spell: 'history-release', target: 'evidence-wand', details: {working},
    });
    assert.equal(inspectEcho(restore(engine)), 'dark-mark');
    assert.equal(inspectEcho(dismiss(restore(engine), 'unrelated-echo')), 'dark-mark');
    const end = restore(dismiss(restore(engine), 'wand-echo'));
    assert.deepEqual(serializeEngineWorld(end), serializeEngineWorld(dismiss(engine, 'wand-echo')));
    assert.equal(inspectEcho(end), undefined);
    assert.deepEqual(end.world.holders['evidence-wand'].properties.marks, ['prior:dark-mark']);
    assert.equal(end.world.holders.observer.quantities.stamina, 4);

    // One recorded cast provides the replay input. Selecting it belongs to the
    // scene until a wand-history reader indexes settled releases by implement.
    const equipped = applyEngineOps(end, [{op: 'property', holder: 'evidence-wand',
        property: 'marks', value: ['grip:observer', 'prior:dark-mark']}], 'inspect-wand');
    const previous = cast(equipped, {
        id: 'previous-cast', spell: 'dark-mark', target: 'clearing', implement: 'evidence-wand', details: {mark: 'dark-mark'},
    });
    const recorded = restore(previous).records.workings['previous-cast'];
    assert.equal(recorded.record.bindings['t0.implement'].id, 'evidence-wand');
    assert.equal(recorded.landed[0].status, 'landed');
    const actualSpell = recorded.record.receipts[0].truth.effects[0].name;
    const replayed = cast(restore(previous), {
        id: 'prior-incantato', spell: 'wand-history', target: 'evidence-wand',
        details: {field: 'new-echo', kind: 'wand-echo', params: {spell: actualSpell}, minutes: 3},
    });
    assert.equal(inspectEcho(restore(replayed)), 'dark-mark');
    assert.equal(replayed.world.holders.observer.quantities.stamina, 2);
});

test('a concealed reveal cannot write contact even when its qualified publish is delivered', async () => {
    const data = caseData('person-reveal', HP_WORKING_INFO_SCENES['person-reveal']);
    const lawFields = [{id: 'veil', scope: 'hidden-person', kind: 'conceal', params: {channel: 'presence'}}];
    assert.equal((await runCaseData({...data, world: {...data.world, lawFields}})).state, 'blocked:runner-expect-mismatch');
});

test('a paid weather counter reopens dry work without changing the outdoor rain calendar', () => {
    const data = caseData('unjinx-weather', HP_WORKING_END_SCENES['unjinx-weather']);
    const config = {...data.engine, packs: [...data.engine.packs, 'w.sky'],
        host: {laws: [SPELL_EFFECT_LAW], costs: {accounts: {stamina: {quantity: 'stamina'}}}, effects: {read: sharedEffect}},
        shared: {properties: Object.values(WORLD_PROPERTIES),
            quantities: [{id: 'stamina', min: 0, max: 5, unit: 'effort'}]}};
    const {anchor, units} = WORLD_CALENDAR_PROFILES['base.frontier'];
    const rainStart = (4 - anchor.day_count) * units.hoursPerDay * units.minutesPerHour
        - anchor.hour * units.minutesPerHour - anchor.minute;
    const beforeRain = rainStart - 2;
    const scene = createEngineWorld({...config, ...data.world, clock: beforeRain, holders: [...data.world.holders,
        {id: 'courtyard', kind: 'place', tags: ['sky'], quantities: skyQuantities(beforeRain)},
        {id: 'clerk', kind: 'body', place: 'office', quantities: {stamina: 5}},
        {id: 'wand', kind: 'thing', place: 'office', properties: {marks: ['grip:clerk']}},
        {id: 'papers', kind: 'thing', place: 'office', properties: {marks: []}},
    ]});
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const advance = (engine, to) => {
        const result = advanceEngineWorld(engine, to);
        assert.equal(result.pending, false);
        return result.engine;
    };
    const adjacentRain = applyEngineOps(scene, [{op: 'law_add', field: {id: 'second-jinx', kind: 'local-weather',
        scope: 'courtyard', params: {rain: true}}}], 'second-local-jinx');
    const doPaperwork = engine => isRainingInPlace(engine.world, 'office') ? engine : applyEngineOps(engine, [
        {op: 'property', holder: 'papers', property: 'marks', value: ['copied']},
    ], 'copy-dry-papers');
    const counter = (engine, working) => startEngineWorking(engine, {
        ...spellEffectMethod([{sentence: sentenceFromIntent(labelSpellRow(HP_SPELL_ROWS.find(row => row.id === 'unjinx-weather'), HP_SPELL_WORLD).parts),
            target: {id: 'office'}, grip: {caster: 'clerk', implement: 'wand'}, contact: {links: 0},
            minutes: 1, details: {cost: 2, working},
        }]), id: 'counter-rain', payer: 'clerk',
    });
    const pending = counter(scene, 'office-rain');
    assert.equal(isRainingInPlace(pending.world, 'office'), true);
    assert.equal(doPaperwork(pending), pending);
    const failed = advance(counter(scene, 'other-jinx'), beforeRain + 1);
    assert.equal(isRainingInPlace(failed.world, 'office'), true);
    assert.equal(doPaperwork(failed), failed);
    assert.equal(failed.world.holders.clerk.quantities.stamina, 3);

    const dry = restore(advance(restore(pending), beforeRain + 1));
    assert.deepEqual(serializeEngineWorld(dry), serializeEngineWorld(advance(pending, beforeRain + 1)));
    assert.equal(isRainingInPlace(dry.world, 'office'), false);
    assert.equal(isRainingInPlace(dry.world, 'courtyard'), false);
    assert.equal(dry.world.holders.clerk.quantities.stamina, 3);
    const worked = advance(restore(doPaperwork(dry)), beforeRain + 2);
    assert.deepEqual(worked.world.holders.papers.properties.marks, ['copied']);
    assert.equal(isRainingInPlace(worked.world, 'office'), false);
    assert.equal(isRainingInPlace(worked.world, 'courtyard'), true);
    assert.equal(worked.world.holders.courtyard.quantities.rain, advance(scene, beforeRain + 2).world.holders.courtyard.quantities.rain);
    const oneJinxLeft = advance(counter(restore(adjacentRain), 'office-rain'), beforeRain + 1);
    assert.equal(isRainingInPlace(oneJinxLeft.world, 'office'), false);
    assert.equal(isRainingInPlace(oneJinxLeft.world, 'courtyard'), true);
    assert.equal(oneJinxLeft.world.holders.courtyard.quantities.rain, 0);
});

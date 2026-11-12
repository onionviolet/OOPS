import test from 'node:test';
import assert from 'node:assert/strict';
import {runCaseData, expectHolds} from '../scripts/coverage_report.mjs';
import {caseSentence, HP_KEYS} from '../src/world_packs/hp_effect_pack.js';
import {HP_SPELL_ROWS} from '../src/spell_pack_hogwarts.js';
import {HP_WORKING_INFO_SCENES, HP_WORKING_SCENES_PENDING_TRANSPORT} from '../src/world_packs/hp_working_info_case_scenes.js';
import {applyEngineOps, createEngineWorld} from '../src/engine_world.js';
import {landEffect} from '../src/effect_host.js';
import {applyEffect} from '../src/world_effects.js';
import {WORLD_PROPERTIES} from '../src/world_quantities.js';
import {WORKING_END_PACK, END_WORKING} from '../src/world_substrate_packs/working_end.js';

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

for (const [id, scene] of Object.entries(HP_WORKING_SCENES_PENDING_TRANSPORT)) {
    test(`${id}: common runner exposes missing transport, explicit publish changes the held effect`, async () => {
        const data = caseData(id, scene);
        assert.equal((await runCaseData(data, {id})).state, 'blocked:runner-expect-mismatch');
        const engine = createEngineWorld({...data.world, ...data.engine});
        const result = applyEngineOps(engine, [{op: 'publish', kind: END_WORKING,
            place: data.details.place, detail: data.details}], `effect-probe:${id}`);
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

test('a concealed reveal cannot write contact even when its qualified publish is delivered', async () => {
    const data = caseData('person-reveal', HP_WORKING_INFO_SCENES['person-reveal']);
    const lawFields = [{id: 'veil', scope: 'hidden-person', kind: 'conceal', params: {channel: 'presence'}}];
    assert.equal((await runCaseData({...data, world: {...data.world, lawFields}})).state, 'blocked:runner-expect-mismatch');
});

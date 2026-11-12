import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {expectHolds, runCaseData} from '../scripts/coverage_report.mjs';
import {createEngineWorld} from '../src/engine_world.js';
import {landEffect} from '../src/effect_host.js';
import {coverageCase, guEffectRows, labelGuEffect, GU_CASE_GAPS, GU_CASE_MODULE} from '../src/world_packs/gu_effect_pack.js';

const ledger = readFileSync(new URL('../docs/coverage/gu_kinds.jsonl', import.meta.url), 'utf8')
    .trim().split('\n').map(JSON.parse);
const links = ledger.filter(row => row.case?.module === GU_CASE_MODULE);
const labelled = (await guEffectRows()).filter(row => labelGuEffect(row).parts);
const byId = new Map(ledger.map(row => [row.id, row]));

function land(scene, id) {
    const engine = createEngineWorld({...scene.world, ...scene.engine});
    const out = landEffect(engine.rules, engine.world, scene, {keys: scene.keys, cause: `gu-case:${id}`});
    return {before: engine.world, out};
}

test('each of the 57 chapter-labelled Gu kinds has a linked case or a specific gap', () => {
    const ids = labelled.map(row => row.id.slice(3)).sort();
    assert.equal(ids.length, 57);
    assert.deepEqual([...links.map(row => row.id), ...Object.keys(GU_CASE_GAPS)].sort(), ids);
    for (const row of labelled) {
        const id = row.id.slice(3);
        const ledgerRow = byId.get(id);
        assert.match(ledgerRow.source, /\bch\d+\b/, id);
        assert.match(ledgerRow.note, /Former state: (runs-authored|blocked:rank-unknown)\./, id);
        if (Object.hasOwn(GU_CASE_GAPS, id)) {
            const formerState = /Former state: ([^.]+)\./.exec(ledgerRow.note)[1];
            assert.equal(ledgerRow.state, formerState, id);
            assert.ok(ledgerRow.note.includes(GU_CASE_GAPS[id]), id);
            assert.throws(() => coverageCase(id), /no coverage scene/, id);
        } else {
            assert.deepEqual(ledgerRow.case, {id, module: GU_CASE_MODULE});
            assert.equal(ledgerRow.state, 'expressed-authored', id);
        }
    }
});

test('every Gu ledger case is plain data and meets its outcome in the probe and through the engine host', async () => {
    for (const {id} of links) {
        const scene = coverageCase(id);
        assert.deepEqual(JSON.parse(JSON.stringify(scene)), scene, id);
        assert.equal(scene.basis, 'authored', id);
        const probe = await runCaseData(scene, {id});
        assert.equal(probe.state, 'expressed-authored', `${id}: ${probe.detail}`);

        const {before, out} = land(scene, id);
        assert.equal(out.status, 'landed', id);
        assert.deepEqual(out.waiting, [], id);
        assert.ok(expectHolds(before, out.world, scene.expect), id);
        assert.ok(!expectHolds(before, before, scene.expect), id);
    }
});

test('a blocking formation stops Fixed Immortal Travel despite the bound destination', () => {
    const id = 'fixed-immortal-travel';
    const scene = coverageCase(id);
    scene.world.lawFields = [{id: 'formation', kind: 'block', scope: 'start',
        params: {verb: 'move', object: 'position'}, source: 'formation'}];
    const {before, out} = land(scene, id);
    assert.deepEqual(out.outcomes[0].blocked, [{target: 'traveller', by: 'formation'}]);
    assert.equal(out.world.holders.traveller.place, 'start');
    assert.equal(expectHolds(before, out.world, scene.expect), false);
});

test('Moonglow cuts harder than Moonlight and the Liquor Worm halves the converted volume', () => {
    const vitality = id => land(coverageCase(id), id).out.world.holders['struck-body'].quantities.vitality;
    assert.ok(vitality('moonglow') < vitality('moonlight'));
    const id = 'liquor-worm';
    const {before, out} = land(coverageCase(id), id);
    const start = before.holders.aperture.quantities;
    const after = out.world.holders.aperture.quantities;
    const taken = start['energy:primeval.rank1.initial'] - after['energy:primeval.rank1.initial'];
    const made = after['energy:primeval.rank1.middle'] - start['energy:primeval.rank1.middle'];
    assert.equal(made * 2, taken);
    assert.ok(made > 0);
});

// Hogwarts effect world pack (PC5, PC6, P1.8): the grammar and labeller load from src,
// and every spellbook case executes through the generic coverage runner.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {runCaseData, runCase} from '../scripts/coverage_report.mjs';
import {assembleEffect, lowerEffect} from '../src/effect_grammar.js';
import {sharedEffect} from '../src/spell_effects.js';
import {HP_SPELL_ROWS} from '../src/spell_pack_hogwarts.js';
import * as pack from '../src/world_packs/hp_effect_pack.js';
import * as fixture from './fixtures/procedural_grammar/effect_worlds.mjs';

const ids = Object.keys(pack.HP_CASE_SCENES);

test('the fixture re-exports the pack, so one Hogwarts grammar and labeller exist', () => {
    for (const name of ['hpEffects', 'labelHpEffect', 'compareHpEffect', 'HP_FORBID', 'hpEffectsGl2', 'labelHpEffectGl2']) assert.equal(fixture[name], pack[name], name);
    const out = pack.labelHpEffect({family: 'Move, stop and position', lead: 'Lift and support an object'});
    assert.equal(`${out.parts.verb} ${out.parts.object}`, 'move position');
    assert.deepEqual(pack.compareHpEffect(out, out.truth), []);
});

test('every Hogwarts case executes through the generic runner and lowers to W acts alone', async () => {
    assert.ok(ids.length >= 30);
    for (const id of ids) {
        const data = pack.coverageCase(id);
        assert.deepEqual(assembleEffect(pack.hpEffects, data.sentence).receipt.violations, [], `${id} sentence is not in the Hogwarts grammar`);
        const lowered = lowerEffect(data.sentence, {keys: data.keys});
        assert.ok(lowered.acts.length && !lowered.publish.length, `${id} publishes for another owner`);
        assert.equal((await runCaseData(data, {id})).state, 'expressed-authored', id);
        assert.ok(pack.HP_CASE_SCENES[id].seen, `${id} scene says what a reader sees`);
    }
});

test('the ledger carries exactly the pack cases, typed as the runner computes them', async () => {
    // The pack is not on the game's path yet (PC95), so the runner computes expressed, not runs.
    const ledger = fs.readFileSync(new URL('../docs/coverage/hp_spells.jsonl', import.meta.url), 'utf8').trim().split('\n').map(l => JSON.parse(l));
    const withCase = ledger.filter(r => r.case);
    assert.deepEqual(withCase.map(r => r.id).sort(), [...ids].sort());
    for (const row of withCase) assert.equal((await runCase(row, {reachable: new Set()})).state, row.state, row.id);
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

test('every pack row without a case has a computed reason, none keyed on a row', () => {
    const reasons = {};
    for (const row of HP_SPELL_ROWS) {
        if (pack.HP_CASE_SCENES[row.id]) continue;
        const shared = sharedEffect(row.truth);
        let why;
        if (shared.gap) why = 'no-shared-reading';
        else {
            const {acts, publish} = lowerEffect(shared, {keys: pack.HP_KEYS});
            const act = acts[0];
            if (!acts.length) why = 'publishes-only';
            else if (publish.length) why = 'act-and-publish';
            else if (['block', 'alter'].includes(act.verb)) why = 'law-field-outcome';
            else if (act.verb === 'copy') why = 'makes-a-thing';
            else why = 'lowers-to-wrong-act';
        }
        assert.ok(pack.HP_CASE_LEFT_OUT[why], `${row.id}: ${why}`);
        (reasons[why] ??= []).push(row.id);
    }
    assert.equal(Object.values(reasons).flat().length + ids.length, HP_SPELL_ROWS.length);
    if (process.env.HP_CASE_REPORT) console.log(JSON.stringify(Object.fromEntries(Object.entries(reasons).map(([k, v]) => [k, v])), null, 1));
});

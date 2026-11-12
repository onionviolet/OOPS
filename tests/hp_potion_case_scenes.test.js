import assert from 'node:assert/strict';
import test from 'node:test';

import {readLedgers, runCase, runCaseData} from '../scripts/coverage_report.mjs';
import {landEffect} from '../src/effect_host.js';
import {advanceEngineWorld, createEngineWorld} from '../src/engine_world.js';
import {coverageCase, DRAUGHT_CASE_ID} from '../src/world_packs/hp_potion_case_scenes.js';
import {readQuantity} from '../src/world_substrate.js';

const response = world => readQuantity(world, 'recipient', 'responsiveness');

test('the only Hogwarts potion case earns authored expression through the common runner', async () => {
    const ledger = readLedgers().find(({name}) => name === 'hp_potions');
    assert.deepEqual(ledger.problems, []);
    const [row, ...rest] = ledger.rows.filter(row => row.case);
    assert.equal(rest.length, 0);
    assert.equal(row.id, 'hp.potion.draught_of_living_death');
    assert.equal(row.state, 'expressed-authored');
    assert.match(row.source, /oldid=1992923; HPPE006; HPPE007; HPPE008; HPPE009; HPPE010; HPPE011; HPPE012; HPPE088$/);
    assert.equal((await runCase(row)).state, 'expressed-authored');

    const data = coverageCase(DRAUGHT_CASE_ID);
    const noUptake = structuredClone(data);
    noUptake.engine.settings['l.living_body'].dose.liquid = 'energy:other-liquid';
    const uptakeResult = await runCaseData(noUptake);
    assert.equal(uptakeResult.state, 'blocked:runner-expect-mismatch');
    assert.match(uptakeResult.detail, /^dose:/);

    const slowerRecovery = structuredClone(data);
    slowerRecovery.engine.settings['l.living_body'].dose.recoveryPerMinute = 6;
    const recoveryResult = await runCaseData(slowerRecovery);
    assert.equal(recoveryResult.state, 'blocked:runner-expect-mismatch');
    assert.match(recoveryResult.detail, /^before-recovery:/);
});

test('equal volumes of different brews and unequal volumes of the same brew change responsiveness and recovery', async () => {
    for (const [input, dose, remaining, activeLeft, expected, minutes] of [
        [{}, 100, 8, 1, 2, 14],
        [{preparation: 'slice'}, 100, 3, 1, 30, 10],
        [{amount: 50}, 50, 58, 5, 58, 6],
    ]) {
        const data = coverageCase(DRAUGHT_CASE_ID, input);
        assert.equal((await runCaseData(data)).state, 'expressed-authored');
        const engine = createEngineWorld({...data.world, ...data.engine});
        assert.equal(response(engine.world), 100);
        const [step] = data.timeline;
        const run = landEffect(engine.rules, engine.world, step, {keys: step.keys, cause: 'measured-dose'});
        assert.equal(run.outcomes[0].applied[0].amount, dose);
        assert.equal(readQuantity(run.world, 'flask', 'energy:oral-liquid'), remaining);
        assert.equal(readQuantity(run.world, 'flask', 'energy:settled-soporific'), activeLeft);
        assert.equal(readQuantity(run.world, 'recipient', 'energy:oral-liquid'), 0);
        assert.equal(response(run.world), expected);

        const dosed = {...engine, world: run.world};
        const beforeRecovery = advanceEngineWorld(dosed, minutes - 1).engine;
        assert.equal(response(beforeRecovery.world), 93);
        const recovered = advanceEngineWorld(dosed, minutes).engine;
        assert.equal(response(recovered.world), 100);
        assert.deepEqual(advanceEngineWorld(beforeRecovery, minutes).engine.world, recovered.world);
        assert.equal(response(advanceEngineWorld(engine, minutes).engine.world), 100);
    }
});

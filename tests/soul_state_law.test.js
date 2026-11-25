import test from 'node:test';
import assert from 'node:assert/strict';
import {runCase} from '../scripts/coverage_report.mjs';
import {attachSoul} from '../scripts/soul_state_ledgers.mjs';
import {SOUL_CASE_MODULE, SOUL_TIMES, SOUL_VERBS, canRunSoul, soulBlocker, soulCaseId} from '../src/soul_state_law.js';

for (const verb of SOUL_VERBS) for (const time of SOUL_TIMES) test(`${verb}.soul ${time} runs and restores`, async () => {
    const result = await runCase({id: `soul-law-${verb}-${time}`, state: 'blocked:soul-state',
        case: {module: SOUL_CASE_MODULE, id: soulCaseId(verb, time)}}, {reachable: new Set()});
    assert.equal(result.state, 'expressed-authored', result.detail);
});

test('near misses and other soul mechanisms stay blocked', () => {
    assert.equal(canRunSoul({verb: 'bind', object: 'mind', time: 'instant'}), false);
    assert.match(soulBlocker({verb: 'sense', object: 'soul', time: 'instant'}), /another soul mechanism/);
    assert.match(soulBlocker({verb: 'move', object: 'soul', time: 'none'}), /no soul clock/);
    assert.match(soulBlocker({verb: 'move', object: 'soul', time: 'sustained'}), /upkeep and release/);
});

test('an unsupported ledger row retains its blocker and reason', async () => {
    const row = {id: 'unsupported-soul-sense', state: 'blocked:soul-state',
        note: 'Effect sense.soul/touched/instant: see a spirit.', mechanisms: []};
    const result = await attachSoul(row);
    assert.match(result.reason, /sense\.soul needs another soul mechanism/);
    assert.equal(row.state, 'blocked:soul-state');
    assert.equal(row.case, undefined);
});

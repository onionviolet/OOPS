import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {planObject} from '../scripts/lead_run/make_book_plans.mjs';
import {rowMetrics, inspectBook, dossierTemplate} from '../scripts/lead_run/reading_review.mjs';
import {systemText} from '../scripts/lead_run/batch_lib.mjs';
import {checkReadingBudget, upgradeUnsubmitted} from '../scripts/lead_run/reading_plan_maintenance.mjs';
import {runOvernight} from '../scripts/lead_run/batch_overnight.mjs';

test('new plans default to 1.5 while explicit legacy plans keep their version', () => {
    const input = {world: 'test', lang: 'en', pass: 'rules', priv: '/tmp/read', label: 'test', shards: []};
    assert.equal(planObject(input).schemaVersion, '1.5');
    assert.equal(planObject({...input, schema: null}).schemaVersion, '1.5');
    assert.equal(planObject({...input, schema: '1.3'}).schemaVersion, '1.3');
    assert.equal(planObject(input).reading.review, 'not-reviewed');
    assert.match(systemText('rules', {world: 'test', version: '1.5'}), /interruption, cancellation/);
    assert.match(systemText('rules', {world: 'test', version: '1.5'}), /fixed authored event is not proof of random generation/);
    assert.doesNotMatch(systemText('rules', {world: 'test', version: '1.3'}), /System lenses/);
});

test('field metrics count evidence shape without assigning truth or inferring costs', () => {
    const m = rowMetrics([{costStated: 'not-mentioned', label: 'T', locator: 'en b1 c1 p1'}, {acquire: {teacher: 'a'}}], 'rules');
    assert.equal(m.rows, 2); assert.equal(m.fields.costStated, 1); assert.equal(m.fields.acquire, 1);
    assert.equal(m.labelled, 1); assert.equal(m.located, 1);
    const d = dossierTemplate({world: 'test', topic: 'procedures'});
    assert.equal(d.state, 'not-reviewed'); assert.deepEqual(d.procedural.distribution, []);
    assert.throws(() => dossierTemplate({world: 'test', topic: 'x', level: 'done'}));
});

test('inventory reuses Luna output, respects partials and reports malformed rows without claiming L2', () => {
    const dir = mkdtempSync(join(tmpdir(), 'reading-review-'));
    writeFileSync(join(dir, 'shard_test_b1_ch001-001.txt'), 'invented fixture');
    writeFileSync(join(dir, 'testc001L_rules.jsonl'), JSON.stringify({id: 'test.rule.craft', name: 'craft procedure', locator: 'en b1 c1 p1', label: 'S', steps: []}) + '\nBAD\n');
    writeFileSync(join(dir, 'testc001_rules.jsonl'), '{}\n');
    writeFileSync(join(dir, 'testc001_rules.partial'), 'incomplete');
    const r = inspectBook({key: 'test', world: 'test', book: 1, dir});
    assert.equal(r.passes.rules.present, 1); assert.equal(r.passes.scenes.missing, 1);
    assert.equal(r.parseErrors.length, 1); assert.equal(r.rows.rules.rows, 1);
    assert.equal(r.candidates.procedures[0].file, 'testc001L_rules.jsonl');
    assert.match(r.levels.L2, /not established/);
});

test('maintenance preserves submitted bytes and refuses an upgrade that breaches a cap', () => {
    const plans = {sent: {label: 'sent', outDir: '/o', schemaVersion: '1.3'}, pending: {label: 'pending', outDir: '/o'}};
    const run = {steps: [{labels: [{plan: 'sent', cap: .04}, {plan: 'pending', cap: .04}]}]};
    const writes = [], opts = {root: '/', read: p => plans[p.slice(1)], exists: p => p === '/o/sent_receipt.json', write: (p, v) => writes.push([p, v]), bound: () => ({usdBatch: .033})};
    const result = upgradeUnsubmitted(run, opts);
    assert.deepEqual(result.retained, ['sent']); assert.equal(writes.length, 1);
    assert.equal(writes[0][1].schemaVersion, '1.5'); assert.equal(plans.sent.schemaVersion, '1.3');
    writes.length = 0;
    assert.throws(() => upgradeUnsubmitted(run, {...opts, bound: () => ({usdBatch: .041})}), /exceeds/);
    assert.equal(writes.length, 0);
    assert.throws(() => upgradeUnsubmitted(run, {...opts, exists: p => p.endsWith('_requests.jsonl')}), /ambiguous submission/);
});

test('whole-campaign reservations include prior failures, pending work and supplements', () => {
    const reservations = [{id: 'coi', capUsd: 3.96}, {id: 'four-books', capUsd: 23.72}, {id: 'prior-failure', capUsd: .0567}, {id: 'supplement', capUsd: 1}];
    assert.deepEqual(checkReadingBudget({ceilingUsd: 33, reservations}), {ceilingUsd: 33, reservedUsd: 28.74, unallocatedUsd: 4.26});
    assert.throws(() => checkReadingBudget({ceilingUsd: 28, reservations}), /exceed/);
    assert.throws(() => checkReadingBudget({ceilingUsd: 33, reservations: [...reservations, reservations[0]]}), /unique/);
});

test('a supplement cannot submit when its campaign or assigned reservation is exceeded', async () => {
    const root = mkdtempSync(join(tmpdir(), 'reading-budget-'));
    const budget = {ceilingUsd: 33, reservations: [{id: 'prior', capUsd: 32.9}, {id: 'extra', capUsd: .2}]};
    writeFileSync(join(root, 'budget.json'), JSON.stringify(budget));
    const run = {budgetFile: 'budget.json', budgetReservation: 'extra', ceilingUsd: .2, steps: [{labels: [{cap: .2}]}]};
    let submitted = false;
    await assert.rejects(runOvernight({root, run, submitFn: async () => { submitted = true; }}), /reservations/);
    budget.reservations[0].capUsd = 30; budget.reservations[1].capUsd = .1;
    writeFileSync(join(root, 'budget.json'), JSON.stringify(budget));
    await assert.rejects(runOvernight({root, run, submitFn: async () => { submitted = true; }}), /whole-campaign/);
    assert.equal(submitted, false);
});

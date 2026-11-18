import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {runCase, runRow} from '../scripts/case_runner.mjs';
import {computeLedgers, runCase as reexported} from '../scripts/coverage_report.mjs';
import {passItems, passRows, fieldRow, searchOutputRows} from '../scripts/case_adapters.mjs';
import {coverageCase as lotmDerived} from '../src/world_packs/lotm_derived_cases.js';
import {coverageCase as hpSpell} from '../src/world_packs/hp_effect_pack.js';

// reachable: new Set() fixes the library-only reading so a pack gaining an import (PSA24) cannot flip these to runs-*.
import {reachableFrom} from '../scripts/reachable.mjs';
const NONE = {reachable: new Set()};
const ledgerRow = (file, id) => fs.readFileSync(new URL(`../docs/coverage/${file}.jsonl`, import.meta.url), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)).find(r => r.id === id);

test('derived row: module case runs and carries the rule confidence', async () => {
    const row = ledgerRow('lotm_potions', 'lotm.potion.error_9');
    const out = await runCase(row, NONE);
    assert.equal(out.state, 'expressed-derived');
    assert.equal(out.basis, 'derived');
    assert.equal(out.confidence.n, 14);
    assert.equal(out.confidence.verdict, 'fails-baseline');
});

test('canon row: inline case data of canon basis runs through the same function with no confidence', async () => {
    const data = {...hpSpell('levitation'), basis: 'canon'};
    const out = await runCase({id: 'hp.spell.levitation', state: 'catalogued', case: {id: 'levitation', data}}, NONE);
    assert.equal(out.state, 'expressed-canon');
    assert.equal(out.confidence, null);
});

test('inline data and a module are not both allowed; a row with no case is catalogued', async () => {
    await assert.rejects(runCase({id: 'x', state: 'catalogued', case: {module: 'src/x.js', id: 'x', data: {}}}, NONE), /not both/);
    assert.equal((await runRow({id: 'x', state: 'catalogued'}, NONE)).state, 'catalogued');
});

test('coverage_report re-exports the same runner; the existing case ledgers still compute', async () => {
    assert.equal(reexported, runCase);
    const rows = ['gu_kinds', 'hp_spells'].map(f => ({name: f, rows: fs.readFileSync(new URL(`../docs/coverage/${f}.jsonl`, import.meta.url), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)).slice(0, 5)}));
    // The typed runs-* rows in these ledgers follow reachability (PSA24), so compute them against the real graph.
    const {problems} = await computeLedgers(rows, {reachable: reachableFrom()});
    assert.deepEqual(problems, []);
});

test('adapters emit the shared shape', () => {
    const rows = [{id: 'a', state: 'catalogued'}, {id: 'b', state: 'catalogued', case: {id: 'b', module: 'm'}}];
    assert.deepEqual(passItems(rows, r => `q ${r.id}`), [{id: 'a', user: 'q a'}]);
    assert.equal(passRows(rows, {a: {reply: {k: 1}}}, () => ({sentence: {}}))[0].case.data.sentence !== undefined, true);
    const fill = {id: 'z', ledger: 'l', f: {shape: 'sphere'}};
    assert.equal(fieldRow(fill, {required: ['shape'], caseOf: () => ({})}).case.id, 'z');
    assert.equal(fieldRow(fill, {required: ['shape', 'size'], caseOf: () => ({})}).case, undefined);
    const [r] = searchOutputRows({final: {by: {precursor: {n: 8, exact: 8, within1: 8}}}});
    assert.deepEqual([r.id, r.confidence.exact, r.confidence.n], ['gu.rank.search:precursor', 1, 8]);
});

test('a derived row with an unscored rule throws', async () => {
    const row = {...ledgerRow('lotm_potions', 'lotm.potion.error_9'), derived: {rule: 'no.such.rule', inputs: []}};
    await assert.rejects(runCase(row, NONE), /no score row/);
});

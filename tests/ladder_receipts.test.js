import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {buildReach, receiptState, rowReach, parsePlayManifest} from '../scripts/ladder_receipts.mjs';

function fixture() {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ladder-'));
    fs.mkdirSync(path.join(root, 'src'), {recursive: true});
    fs.mkdirSync(path.join(root, 'docs/coverage'), {recursive: true});
    fs.writeFileSync(path.join(root, 'src/main.js'), "import './landing.js';\n");
    fs.writeFileSync(path.join(root, 'src/landing.js'), "import {grammar} from './case.js';\nexport const text = grammar;\n");
    fs.writeFileSync(path.join(root, 'src/case.js'), "export const grammar = {}; export function coverageCase(id) { return id; }\n");
    const row = {id: 'a', case: {module: 'src/case.js', id: 'a'}};
    fs.writeFileSync(path.join(root, 'docs/coverage/demo.jsonl'), JSON.stringify(row) + '\n');
    return root;
}

test('reach stores the shortest import chain without mistaking grammar import for a case call', () => {
    const root = fixture();
    try {
        const receipt = buildReach({root, entry: path.join(root, 'src/main.js')});
        assert.deepEqual(receipt.modules['src/case.js'].via, ['src/main.js', 'src/landing.js', 'src/case.js']);
        assert.equal(receipt.modules['src/case.js'].reachable, true);
        assert.equal(receipt.modules['src/case.js'].consumerCallsCase, false);
        assert.equal(receipt.rows['demo:a'].rowSha1.length, 40);
        assert.equal(receiptState(receipt, root), 'current');
        fs.appendFileSync(path.join(root, 'src/landing.js'), '// changed\n');
        assert.equal(receiptState(receipt, root), 'stale');
    } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

test('a direct case call on the chain is marked as a static consumer', () => {
    const root = fixture();
    try {
        fs.writeFileSync(path.join(root, 'src/landing.js'), "import {coverageCase} from './case.js';\nexport const scene = coverageCase('a');\n");
        const receipt = buildReach({root, entry: path.join(root, 'src/main.js')});
        assert.equal(receipt.modules['src/case.js'].consumerCallsCase, true);
    } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

test('a row without a case says no case module', () => {
    assert.deepEqual(rowReach({id: 'empty'}, {}), {status: 'no case module'});
});

test('play manifest declares ledger keys, scope and independent persistence checks', () => {
    const source = `// @ladder {"keys":["gu_kinds:vitality-leaf"],"scope":"workshop demo",\n// @ladder "route":"capability-run","checks":{"saveReload":true,"exportImport":true,"browser":false}}\n`;
    assert.deepEqual(parsePlayManifest(source), {keys: ['gu_kinds:vitality-leaf'], scope: 'workshop demo',
        route: 'capability-run', checks: {saveReload: true, exportImport: true, browser: false}});
    assert.equal(parsePlayManifest('// no declaration'), null);
    assert.throws(() => parsePlayManifest('// @ladder {"keys":["bare"],"scope":"headless","route":"fixture"}'));
});

test('a single-row case module called by its direct importer counts; a shared module does not', async () => {
    const {mkdtempSync, mkdirSync, writeFileSync} = await import('node:fs');
    const {tmpdir} = await import('node:os');
    const {join} = await import('node:path');
    const {consumerCallsCase} = await import('../scripts/ladder_receipts.mjs');
    const dir = mkdtempSync(join(tmpdir(), 'ccc-'));
    mkdirSync(join(dir, 'src'));
    writeFileSync(join(dir, 'src/case.js'), 'export function landing() { return 1; }\n');
    writeFileSync(join(dir, 'src/user.js'), "import {landing as land} from './case.js';\nexport const act = () => land();\n");
    const chain = ['src/user.js', 'src/case.js'];
    assert.equal(consumerCallsCase(chain, 'x', dir, {singleRow: true}), true);
    assert.equal(consumerCallsCase(chain, 'x', dir, {singleRow: false}), false);
});

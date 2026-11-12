import test from 'node:test';
import assert from 'node:assert/strict';
import {parseLedger, countLedger, renderReadme} from '../scripts/coverage_report.mjs';

const exists = file => file === 'tests/gu_catalogue.test.js';
const rows = [
    {id: 'a', source: 'idx#a', state: 'runs-canon', mechanisms: ['G'], test: 'tests/gu_catalogue.test.js'},
    {id: 'b', source: 'idx#b', state: 'runs-authored', mechanisms: ['G', 'L'], test: 'tests/gu_catalogue.test.js#rank'},
    {id: 'c', source: 'idx#c', state: 'blocked:PGB2', mechanisms: ['B'], test: null},
    {id: 'd', source: 'idx#d', state: 'not-a-thing:alias', mechanisms: []},
    {id: 'e', source: 'idx#e', state: 'unclassified', mechanisms: []},
];
const text = rows.map(r => JSON.stringify(r)).join('\n');

test('well-formed rows parse and count (CV1, CV2, CV4)', () => {
    const {rows: parsed, problems} = parseLedger(text, {exists});
    assert.deepEqual(problems, []);
    const c = countLedger(parsed);
    assert.deepEqual([c.total, c['runs-canon'], c['runs-authored'], c.blocked, c['not-a-thing'], c.unclassified], [5, 1, 1, 1, 1, 1]);
    assert.equal(c.runsShare, 50);
    assert.equal(c.classifiedShare, 80);
    assert.deepEqual(c.rules, {PGB2: 1});
});

test('only malformed rows fail, each by line', () => {
    const bad = [
        '{not json',
        JSON.stringify({id: 'a', source: 's', state: 'runs-canon', mechanisms: ['G'], test: 'tests/gone.test.js'}),
        JSON.stringify({id: 'a', source: 's', state: 'runs-canon', mechanisms: ['G']}),
        JSON.stringify({id: 'x', source: '', state: 'blocked:', mechanisms: 'G', extra: 1}),
    ].join('\n');
    const {problems} = parseLedger(bad, {exists, name: 'demo.jsonl'});
    for (const want of [/demo.jsonl:1: not JSON/, /2: test file tests\/gone.test.js does not exist/, /3: duplicate id a/,
        /3: a runs-\* row names the test/, /4: unknown field extra/, /4: source/, /4: state/, /4: mechanisms/]) {
        assert.ok(problems.some(p => want.test(p)), String(want));
    }
});

test('the counts table lists every planned ledger, started or not', () => {
    const md = renderReadme([{name: 'hp_spells', rows: parseLedger(text, {exists}).rows}]);
    assert.match(md, /\| \[hp_spells\]\(hp_spells.jsonl\) \| S \| 117 \| 5 \| 1 \| 1 \| 1 \| 1 \| 1 \| 80% \| 50% \|/);
    assert.match(md, /\| gu_kinds \| G \| 1466 \| not started/);
    assert.match(md, /\| hp_spells \| PGB2 \| 1 \|/);
});

// ---- Reachability and the case runner (PC5, PC9, PC10, PC14) ----
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {reachableFrom, walkFrom, importsOf} from '../scripts/reachable.mjs';
import {computeLedgers, runCase, runCaseData, computedCounts, expectHolds} from '../scripts/coverage_report.mjs';

import {applyEngineOps, createEngineWorld} from '../src/engine_world.js';
import {configured} from './fixtures/coverage_cases/w_cases.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CASES = 'tests/fixtures/coverage_cases/w_cases.mjs';

test('reachability follows static, re-export and literal dynamic imports, and lists computed ones (PC14)', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'reach-'));
    const put = (f, t) => { fs.mkdirSync(path.dirname(path.join(dir, f)), {recursive: true}); fs.writeFileSync(path.join(dir, f), t); };
    put('main.js', "import {a} from './a.js';\nexport * from './re.js';\nconst l = () => import('./lazy.js');\n// import('./commented.js')\nconst n = 'x';\nawait import(`./packs/${n}.js`);\nimport 'node:fs';\n");
    put('a.js', "import b from './sub';\nexport const a = 1;\n");
    put('sub/index.js', 'export default 2;\n');
    put('re.js', 'export const r = 1;\n');
    put('lazy.js', 'export const z = 1;\n');
    put('commented.js', 'export const c = 1;\n');
    put('packs/hidden.js', 'export const h = 1;\n');
    const walk = walkFrom(path.join(dir, 'main.js'));
    const rel = new Set([...walk.reachable].map(f => path.relative(dir, f)));
    assert.deepEqual([...rel].sort(), ['a.js', 'lazy.js', 're.js', 'main.js', 'sub/index.js'].sort());
    // The pack loaded through a computed path is unreachable AND the gap is listed, not silent.
    assert.equal(rel.has('packs/hidden.js'), false);
    assert.equal(walk.computedImports.length, 1);
    assert.match(walk.computedImports[0].snippet, /packs\/\$\{n\}/);
    assert.equal(reachableFrom(path.join(dir, 'main.js')).size, 5);
    assert.deepEqual(importsOf("import x, {y} from './m.js'; export {z} from \"./n.js\";").specs.sort(), ['./m.js', './n.js']);
});

test('the real walk reaches src/main.js and no test fixture', () => {
    const r = reachableFrom();
    assert.ok(r.has(path.join(repo, 'src/main.js')));
    assert.equal(r.has(path.join(repo, CASES)), false);
});

const caseRow = (id, state, extra = {}) => ({id: `r-${id}`, source: 's', state, mechanisms: ['W'], test: null, case: {module: CASES, id}, ...extra});
const ledgerOf = rows => [{name: 'fx', file: 'fx.jsonl', rows}];

test('a case that changes the world computes expressed, and never runs from under tests/', async () => {
    const row = caseRow('cut', 'expressed-canon');
    const out = await runCase(row, {reachable: new Set()});
    assert.equal(out.state, 'expressed-canon');
    const fakeReach = new Set([path.join(repo, CASES)]);
    assert.equal((await runCase({...row, state: 'runs-authored'}, {reachable: fakeReach})).state, 'runs-authored');
    const real = await computeLedgers(ledgerOf([row]));
    assert.deepEqual(real.problems, []);
    assert.equal(real.computed.get('fx').get('r-cut').state, 'expressed-canon');
    assert.deepEqual(computedCounts(ledgerOf([row])[0].rows, real.computed.get('fx')), {typedRuns: 0, expressed: 1, runs: 0, noCase: 0});
});

test('a wrong expectation, a label-only expectation, a needed key and a working case compute blocked states', async () => {
    const run = id => runCase(caseRow(id, 'unclassified'), {reachable: new Set()});
    assert.equal((await run('wrong-direction')).state, 'blocked:runner-expect-mismatch');
    assert.equal((await run('needs-key')).state, 'blocked:runner-needs');
    assert.equal((await run('working')).state, 'blocked:runner-working-case');
    // Sentence words are not world terms: a label cannot satisfy expect.
    await assert.rejects(run('label'), /not a world term/);
});

function check(rows) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cov-'));
    fs.writeFileSync(path.join(dir, 'fx.jsonl'), rows.map(r => JSON.stringify(r)).join('\n'));
    return spawnSync(process.execPath, [path.join(repo, 'scripts/coverage_report.mjs'), '--check', '--dir', dir], {encoding: 'utf8'});
}

test('--check fails on a typed/computed disagreement, a missing module, a missing export and a throwing case', () => {
    const ok = check([caseRow('cut', 'expressed-canon')]);
    assert.equal(ok.status, 0, ok.stderr);
    const typedRuns = check([caseRow('cut', 'runs-canon', {test: 'tests/coverage_report.test.js'})]);
    assert.equal(typedRuns.status, 1);
    assert.match(typedRuns.stderr, /typed state runs-canon disagrees with computed expressed-canon/);
    const wrong = check([caseRow('wrong-direction', 'expressed-canon')]);
    assert.match(wrong.stderr, /disagrees with computed blocked:runner-expect-mismatch/);
    const missing = check([{...caseRow('cut', 'unclassified'), case: {module: 'tests/fixtures/coverage_cases/nope.mjs', id: 'cut'}}]);
    assert.match(missing.stderr, /does not exist/);
    const noExport = check([{...caseRow('cut', 'unclassified'), case: {module: 'tests/fixtures/coverage_cases/no_export.mjs', id: 'cut'}}]);
    assert.match(noExport.stderr, /does not export coverageCase/);
    const throws = check([caseRow('throws', 'unclassified')]);
    assert.equal(throws.status, 1);
    assert.match(throws.stderr, /threw: boom/);
    assert.equal(check([caseRow('cut', 'expressed-canon', {case: undefined})]).status, 1);
});

test('a plain case uses the engine registry, pack settings, shared vocabulary and dials', async () => {
    const row = caseRow('configured', 'expressed-authored');
    assert.equal((await runCase(row, {reachable: new Set()})).state, 'expressed-authored');
    for (const pack of configured.engine.packs) {
        const engine = {...configured.engine, packs: configured.engine.packs.filter(id => id !== pack)};
        await assert.rejects(runCaseData({...configured, engine}), /undeclared quantity/);
    }
    const engine = structuredClone(configured.engine);
    engine.settings['m.market'].goods = ['grain'];
    await assert.rejects(runCaseData({...configured, engine}), /undeclared quantity stock\.herb/);
    engine.settings['m.market'].goods = ['herb'];
    engine.dials.chainCap = 0;
    await assert.rejects(runCaseData({...configured, engine}), /dial chainCap must be a whole number/);
    engine.dials.chainCap = 3;
    engine.shared.properties = [];
    await assert.rejects(runCaseData({...configured, engine}), /undeclared property ready/);
    engine.shared.properties = configured.engine.shared.properties;
    engine.settings['m.market'].dials = () => ({});
    await assert.rejects(runCaseData({...configured, engine}), /plain JSON configuration/);
});

test('law fields compare scope, kind, parameters and expiry against independent outcomes', async () => {
    const world = {clock: 5, holders: [{id: 'room', kind: 'place'}]};
    const data = {
        world, sentence: {verb: 'block', object: 'position', time: 'sustained'},
        details: {target: {shape: 'holder', id: 'room'}, field: 'ward', minutes: 2},
        expect: [{lawField: 'ward', direction: 'changed',
            to: {kind: 'block', scope: 'room', params: {object: 'position', verb: 'move'}, until: 7}}],
    };
    assert.equal((await runCaseData(data)).state, 'expressed-authored');
    const wrongExpiry = {...data, details: {...data.details, minutes: 3}};
    assert.equal((await runCaseData(wrongExpiry)).state, 'blocked:runner-expect-mismatch');
    const noChange = {...data, expect: [{lawField: 'ward', direction: 'unchanged'}]};
    await assert.rejects(runCaseData(noChange), /expect must name at least one change/);
    await assert.rejects(runCaseData({...data, sentence: undefined, kind: 'ward'}), /carries a sentence or a working/);
});

test('a new holder observation requires the holder to be absent before and present after', async () => {
    const engine = createEngineWorld({packs: ['w.sky'], holders: [{id: 'room', kind: 'place'}]});
    const expect = [
        {holder: 'copy', exists: true, direction: 'changed', to: true},
        {holder: 'copy', position: true, direction: 'changed', to: 'room'},
    ];
    const value = {id: 'copy', kind: 'thing', place: 'room'};
    const after = applyEngineOps(engine, [{op: 'holder_add', value}], 'fixture:copy');
    assert.equal(expectHolds(engine.world, after.world, expect), true);
    assert.equal(expectHolds(engine.world, engine.world, expect), false);
    assert.equal(expectHolds(after.world, after.world, expect), false);

    const data = {...configured, expect};
    assert.equal((await runCaseData(data)).state, 'blocked:runner-expect-mismatch');
    const world = {holders: [...configured.world.holders, {...value, place: 'stall'}]};
    await assert.rejects(runCaseData({...data, world}), /expected new holder copy already exists/);
    await assert.rejects(runCaseData({...data, expect: expect.slice(1)}), /case world does not define or expect to create/);
});

test('an act plus an unanswered publish cannot earn expression for the act alone', async () => {
    const data = {
        world: {holders: [{id: 'room', kind: 'place'},
            {id: 'subject', kind: 'body', place: 'room', properties: {concealed: []}}]},
        sentence: {verb: 'conceal', object: 'information', time: 'instant'},
        details: {target: {shape: 'holder', id: 'subject'}, channel: 'sight'},
        expect: [{holder: 'subject', property: 'concealed', direction: 'changed', to: ['sight']}],
    };
    const result = await runCaseData(data);
    assert.equal(result.state, 'blocked:runner-waiting');
    assert.match(result.detail, /effect.conceal.information/);
});

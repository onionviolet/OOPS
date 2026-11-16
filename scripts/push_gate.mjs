#!/usr/bin/env node
// npm run gate:push: the gate before a push, sized to the push (Weibao 2026-11-16, approving tiered gates; AD36).
// Run it in a clean checkout of the commit you will push. Usage:
//   node scripts/push_gate.mjs [--base origin/master] [--full] [--list]
// Always: check:arch, check:rules, check:docs, and the bundle rebuilt from HEAD matching dist/.
// check:flow: when the push changes what a player sees (src/, styles/, index.html, dist/, resources/).
// Tests, default: the files the push can reach (test:changed against --base, slow tier included). The full suite
// runs instead with --full (every wave close), or when the push touches something every test leans on (WIDE below),
// or when the reach is half the suite or more anyway. Reason: a narrow push gets a gate in minutes; the wave close
// and wide pushes keep the whole-suite safety net, which catches what the reach map misses.
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdtempSync, readFileSync, rmSync, symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Paths every test leans on: the harness, shared fixtures, the composition root, saves, the build and the runners.
export const WIDE = [/^package(-lock)?\.json$/, /^build\.js$/, /^scripts\/headless\//, /^tests\/fixtures\//, /^tests\/helpers?\//,
    /^scripts\/(test_suite|test_plan|test_changed|test_budget_reporter|slot_run|slot_gate)\.mjs$/, /^src\/main\.js$/, /^src\/save[^/]*\.js$/, /^src\/migrations?\b/];
export const VISIBLE = [/^src\//, /^styles\//, /^index\.html$/, /^dist\//, /^resources\//];

/** Pure: what the gate runs for a list of changed paths. */
export function planGate(changed, {full = false} = {}) {
    const wide = changed.filter(f => WIDE.some(re => re.test(f)));
    return {
        tests: full ? 'full' : wide.length ? 'full' : 'changed',
        why: full ? '--full (wave close)' : wide.length ? `${wide[0]}${wide.length > 1 ? ` and ${wide.length - 1} more` : ''} touches what every test leans on` : 'the files this push can reach',
        flow: changed.some(f => VISIBLE.some(re => re.test(f))),
    };
}

const git = args => execFileSync('git', args, {cwd: root, encoding: 'utf8'}).split('\n').filter(Boolean);
const npm = script => spawnSync('npm', ['run', '-s', script], {cwd: root, stdio: 'inherit'}).status ?? 1;

function bundleMatches() {
    const tree = mkdtempSync(path.join(tmpdir(), 'yairpg-gate-bundle-'));
    try {
        execFileSync('sh', ['-c', `git archive HEAD | tar -x -C "${tree}"`], {cwd: root});
        symlinkSync(path.join(root, 'node_modules'), path.join(tree, 'node_modules'));
        execFileSync(process.execPath, ['build.js'], {cwd: tree, stdio: 'ignore'});
        return readFileSync(path.join(tree, 'dist/bundle.js')).equals(readFileSync(path.join(root, 'dist/bundle.js'))) ? 0 : 1;
    } catch (e) { console.error(`push gate: bundle rebuild failed: ${e.message}`); return 1; }
    finally { rmSync(tree, {recursive: true, force: true}); }
}

async function main(argv) {
    const opt = {base: 'origin/master', full: false, list: false};
    for (let i = 0; i < argv.length; i++) {
        if (argv[i] === '--base') opt.base = argv[++i];
        else if (argv[i] === '--full') opt.full = true;
        else if (argv[i] === '--list') opt.list = true;
        else { console.error(`push_gate: unknown argument ${argv[i]}`); return 2; }
    }
    const dirty = git(['status', '--porcelain', '--untracked-files=no']);
    if (dirty.length) console.error(`push gate: WARNING ${dirty.length} uncommitted change(s); the gate reads the tree, so run it in a clean checkout of the commit`);
    const changed = git(['diff', '--name-only', `${opt.base}...HEAD`]);
    const plan = planGate(changed, opt);
    let tests = plan.tests;
    if (tests === 'changed') {
        const sel = JSON.parse(execFileSync(process.execPath, ['scripts/test_changed.mjs', '--base', opt.base, '--slow', '--json'], {cwd: root, encoding: 'utf8', maxBuffer: 64 << 20}));
        const total = git(['ls-files', 'tests/*.test.js']).length;
        if (sel.mode === 'full' || Object.keys(sel.selected).length * 2 >= total) { tests = 'full'; plan.why = 'the push reaches half the suite or more'; }
        else plan.why += ` (${Object.keys(sel.selected).length} of ${total} test files)`;
    }
    console.log(`push gate: ${changed.length} file(s) since ${opt.base}; tests: ${tests} (${plan.why}); check:flow: ${plan.flow ? 'yes' : 'skipped, nothing a player sees changed'}`);
    if (opt.list) return 0;
    const steps = [['check:arch', () => npm('check:arch')], ['check:rules', () => npm('check:rules')], ['check:docs', () => npm('check:docs')],
        ['bundle matches HEAD', bundleMatches]];
    if (plan.flow) steps.push(['check:flow', () => npm('check:flow')]);
    steps.push(tests === 'full' ? ['npm test (full suite)', () => npm('test')]
        : ['test:changed --slow', () => spawnSync(process.execPath, ['scripts/test_changed.mjs', '--base', opt.base, '--slow'], {cwd: root, stdio: 'inherit'}).status ?? 1]);
    const results = [];
    for (const [name, run] of steps) { const t0 = Date.now(); const code = run(); results.push([name, code, Date.now() - t0]); }
    console.log('push gate:');
    for (const [name, code, ms] of results) console.log(`  ${code ? 'FAIL' : 'pass'}  ${name}  ${(ms / 1000).toFixed(0)} s`);
    return results.some(([, code]) => code) ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) process.exitCode = await main(process.argv.slice(2));

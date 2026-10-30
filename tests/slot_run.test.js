import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn, spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const SCRIPT = fileURLToPath(new URL('../scripts/slot_run.mjs', import.meta.url));

function env(dir) {
  return {...process.env, YAIRPG_SLOT_DIR: dir, YAIRPG_SLOT_POLL_MS: '50'};
}
function start(dir, args) {
  const child = spawn(process.execPath, [SCRIPT, ...args], {env: env(dir), stdio: ['ignore', 'pipe', 'pipe']});
  child.out = '';
  child.err = '';
  child.stdout.on('data', (d) => { child.out += d; });
  child.stderr.on('data', (d) => { child.err += d; });
  child.done = new Promise((r) => child.on('exit', (code) => r(code)));
  return child;
}
const until = async (fn, ms = 5000) => {
  const end = Date.now() + ms;
  while (Date.now() < end) { if (fn()) return true; await new Promise((r) => setTimeout(r, 25)); }
  return false;
};
const held = (dir) => { try { return readdirSync(join(dir, 'heavy')).length; } catch { return 0; } };
const tmp = () => mkdtempSync(join(tmpdir(), 'slot-run-'));
const SLEEP = ['--', process.execPath, '-e', 'setTimeout(()=>{}, 60000)'];

test('two slots admit two holders and block the third', async () => {
  const dir = tmp();
  const a = start(dir, ['--slots', '2', ...SLEEP]);
  const b = start(dir, ['--slots', '2', ...SLEEP]);
  assert.ok(await until(() => held(dir) === 2));
  const c = start(dir, ['--slots', '2', '--', process.execPath, '-e', '0']);
  assert.ok(await until(() => c.err.includes('waiting')));
  assert.equal(held(dir), 2);
  a.kill('SIGTERM');
  assert.equal(await c.done, 0);
  assert.ok(c.err.includes('slot acquired'));
  b.kill('SIGTERM');
  await Promise.all([a.done, b.done]);
  assert.equal(held(dir), 0, 'signal releases the slot');
  rmSync(dir, {recursive: true, force: true});
});

test('a slot held by a dead pid is reclaimed', () => {
  const dir = tmp();
  const slot = join(dir, 'heavy', 'slot-0');
  mkdirSync(slot, {recursive: true});
  writeFileSync(join(slot, 'holder.json'), JSON.stringify({pid: 2 ** 22 + 12345, kind: 'suite', started: 'x', cwd: '/', command: 'ghost'}));
  const r = spawnSync(process.execPath, [SCRIPT, '--slots', '1', '--', process.execPath, '-e', '0'], {env: env(dir), timeout: 5000});
  assert.equal(r.status, 0);
  assert.ok(!String(r.stderr).includes('waiting'));
  rmSync(dir, {recursive: true, force: true});
});

test('child exit code passes through and the slot is freed on exit and crash', () => {
  const dir = tmp();
  const ok = spawnSync(process.execPath, [SCRIPT, '--', process.execPath, '-e', 'process.exit(7)'], {env: env(dir)});
  assert.equal(ok.status, 7);
  assert.equal(held(dir), 0);
  const crash = spawnSync(process.execPath, [SCRIPT, '--', process.execPath, '-e', 'throw new Error("boom")'], {env: env(dir)});
  assert.notEqual(crash.status, 0);
  assert.equal(held(dir), 0);
  const missing = spawnSync(process.execPath, [SCRIPT, '--', 'definitely-not-a-command-xyz'], {env: env(dir)});
  assert.equal(missing.status, 127);
  assert.equal(held(dir), 0);
  rmSync(dir, {recursive: true, force: true});
});

test('browser kind uses its own single slot and --status lists holders', async () => {
  const dir = tmp();
  const a = start(dir, ['--kind', 'browser', ...SLEEP]);
  assert.ok(await until(() => existsSync(join(dir, 'browser', 'slot-0', 'holder.json'))));
  const s = spawnSync(process.execPath, [SCRIPT, '--status'], {env: env(dir), encoding: 'utf8'});
  assert.match(s.stdout, /browser\/slot-0 pid=\d+ alive/);
  const heavy = spawnSync(process.execPath, [SCRIPT, '--kind', 'build', '--', process.execPath, '-e', '0'], {env: env(dir)});
  assert.equal(heavy.status, 0, 'build pool is independent of browser');
  a.kill('SIGTERM');
  await a.done;
  rmSync(dir, {recursive: true, force: true});
});

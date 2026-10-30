#!/usr/bin/env node
// Machine-wide counting semaphore for heavy gates (suites, builds, browser captures).
// Usage: node scripts/slot_run.mjs [--kind suite|build|browser] [--slots N] -- <command...>
//        node scripts/slot_run.mjs --status
// Slots are atomic mkdir dirs under YAIRPG_SLOT_DIR (default ~/.cache/yairpg-slots).
// suite and build share one pool (default 2 slots); browser has its own (default 4, so lanes prove their own
// slices in parallel; each run serves its own worktree on its own free port).
// --max-load N (or YAIRPG_SLOT_MAX_LOAD) also holds the gate until the 1-minute load average is <= N.
// --load-wait SECONDS makes that a soft wait: after that long the command runs anyway (slots still apply).
// Waiters are listed with their queue position and reason by --status.
import {spawn} from 'node:child_process';
import {mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import {homedir, loadavg} from 'node:os';
import {join} from 'node:path';
import {loadGate} from './slot_gate.mjs';

const DEFAULT_SLOTS = {heavy: 2, browser: 4};
const POLL_MS = Number(process.env.YAIRPG_SLOT_POLL_MS) || 1000;

const slotRoot = () => process.env.YAIRPG_SLOT_DIR || join(homedir(), '.cache', 'yairpg-slots');
const poolOf = (kind) => (kind === 'browser' ? 'browser' : 'heavy');

function pidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; }
}

function readHolder(dir) {
  try { return JSON.parse(readFileSync(join(dir, 'holder.json'), 'utf8')); } catch { return null; }
}

// Pool dir holds slot-0..slot-(N-1) directories; a slot dir exists only while held.
function tryAcquire(pool, slots, info) {
  const base = join(slotRoot(), pool);
  mkdirSync(base, {recursive: true});
  for (let i = 0; i < slots; i += 1) {
    const dir = join(base, `slot-${i}`);
    try {
      mkdirSync(dir);
    } catch (e) {
      if (e.code !== 'EEXIST') throw e;
      const holder = readHolder(dir);
      // A missing holder file may be a holder mid-write; only reclaim it when old.
      const dead = holder ? !pidAlive(holder.pid) : false;
      if (!dead) continue;
      rmSync(dir, {recursive: true, force: true});
      try { mkdirSync(dir); } catch { continue; }
    }
    writeFileSync(join(dir, 'holder.json'), JSON.stringify(info));
    return dir;
  }
  return null;
}

function listHolders() {
  const rows = [];
  for (const pool of ['heavy', 'browser']) {
    let names = [];
    try { names = readdirSync(join(slotRoot(), pool)); } catch { /* none */ }
    for (const name of names.sort()) {
      const h = readHolder(join(slotRoot(), pool, name));
      rows.push({pool, slot: name, ...(h || {}), alive: h ? pidAlive(h.pid) : false});
    }
  }
  return rows;
}

const waitDir = () => join(slotRoot(), 'waiting');
function listWaiters() {
  let names = [];
  try { names = readdirSync(waitDir()); } catch { /* none */ }
  const rows = [];
  for (const name of names) {
    let w = null;
    try { w = JSON.parse(readFileSync(join(waitDir(), name), 'utf8')); } catch { /* mid-write */ }
    if (!w) continue;
    if (!pidAlive(w.pid)) { rmSync(join(waitDir(), name), {force: true}); continue; }
    rows.push(w);
  }
  return rows.sort((a, b) => a.since.localeCompare(b.since) || a.pid - b.pid);
}

function parseArgs(argv) {
  const out = {kind: 'suite', slots: null, maxLoad: Number(process.env.YAIRPG_SLOT_MAX_LOAD) || null, loadWait: null, status: false, command: []};
  const sep = argv.indexOf('--');
  const head = sep === -1 ? argv : argv.slice(0, sep);
  out.command = sep === -1 ? [] : argv.slice(sep + 1);
  for (let i = 0; i < head.length; i += 1) {
    if (head[i] === '--status') out.status = true;
    else if (head[i] === '--kind') out.kind = head[++i];
    else if (head[i] === '--slots') out.slots = Number(head[++i]);
    else if (head[i] === '--max-load') out.maxLoad = Number(head[++i]);
    else if (head[i] === '--load-wait') out.loadWait = Number(head[++i]);
    else throw new Error(`unknown argument ${head[i]}`);
  }
  // YAIRPG_SLOT_MAX_LOAD is the explicit opt-in: a hard load gate that overrides --max-load and --load-wait.
  if (Number(process.env.YAIRPG_SLOT_MAX_LOAD)) { out.maxLoad = Number(process.env.YAIRPG_SLOT_MAX_LOAD); out.loadWait = null; }
  if (!['suite', 'build', 'browser'].includes(out.kind)) throw new Error(`bad --kind ${out.kind}`);
  if (out.slots !== null && !(out.slots >= 1)) throw new Error('--slots must be >= 1');
  return out;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  let args;
  try { args = parseArgs(process.argv.slice(2)); } catch (e) {
    console.error(`slot_run: ${e.message}`);
    process.exit(2);
  }
  if (args.status) {
    const rows = listHolders();
    if (!rows.length) console.log(`slot_run: no holders (${slotRoot()})`);
    listWaiters().forEach((w, i) => console.log(`waiting #${i + 1} pid=${w.pid} kind=${w.kind} since=${w.since} why=${w.why} cwd=${w.cwd}`));
    for (const r of rows) {
      console.log(`${r.pool}/${r.slot} pid=${r.pid} ${r.alive ? 'alive' : 'STALE'} kind=${r.kind} since=${r.started} cwd=${r.cwd} cmd=${r.command}`);
    }
    return;
  }
  if (!args.command.length) {
    console.error('slot_run: no command after --');
    process.exit(2);
  }
  // A wrapped command that wraps again (slot_run -- npm test) runs under the outer slot; re-acquiring could deadlock a full pool.
  if (process.env.YAIRPG_SLOT_HELD) {
    const inner = spawn(args.command[0], args.command.slice(1), {stdio: 'inherit'});
    inner.on('error', (e) => { console.error(`slot_run: ${e.message}`); process.exit(127); });
    inner.on('exit', (code, signal) => process.exit(code ?? (signal ? 128 + 15 : 1)));
    return;
  }
  const pool = poolOf(args.kind);
  const slots = args.slots || DEFAULT_SLOTS[pool];
  const info = {
    pid: process.pid, kind: args.kind, started: new Date().toISOString(),
    cwd: process.cwd(), command: args.command.join(' '),
  };

  let dir = null;
  let announced = false;
  let child = null;
  const release = () => { if (dir) { rmSync(dir, {recursive: true, force: true}); dir = null; } };
  const onSignal = (sig) => {
    if (child) child.kill(sig);
    else { release(); process.exit(128 + (sig === 'SIGINT' ? 2 : 15)); }
  };
  for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => onSignal(sig));
  process.on('exit', release);

  const t0 = Date.now();
  const waitFile = join(waitDir(), `${process.pid}.json`);
  const clearWait = () => rmSync(waitFile, {force: true});
  process.on('exit', clearWait);
  let overrode = false;
  const gate = () => {
    const g = loadGate({load: loadavg()[0], maxLoad: args.maxLoad, waitedMs: Date.now() - t0, loadWaitMs: args.loadWait == null ? null : args.loadWait * 1000});
    if (g === 'run-anyway' && !overrode) { overrode = true; console.error(`slot_run: load stayed above ${args.maxLoad} for ${args.loadWait}s; running anyway`); }
    return g !== 'wait-load';
  };
  let lastWhy = '';
  while (true) {
    const calm = gate();
    if (calm && (dir = tryAcquire(pool, slots, info))) break;
    const held = listHolders().filter((r) => r.pool === pool && r.alive).length;
    const why = calm ? `${held}/${slots} slots held` : `load ${loadavg()[0].toFixed(0)} > ${args.maxLoad}${args.loadWait == null ? '' : ` (soft, runs anyway after ${args.loadWait}s)`}`;
    if (!announced) {
      console.error(`slot_run: waiting for a ${pool} slot (${why}; run --status to see holders and queue)`);
      announced = true;
    }
    if (why !== lastWhy) {
      mkdirSync(waitDir(), {recursive: true});
      writeFileSync(waitFile, JSON.stringify({pid: process.pid, kind: args.kind, since: new Date(t0).toISOString(), why, cwd: process.cwd()}));
      lastWhy = why;
    }
    await sleep(POLL_MS);
  }
  clearWait();
  if (announced) console.error('slot_run: slot acquired');

  child = spawn(args.command[0], args.command.slice(1), {stdio: 'inherit', env: {...process.env, YAIRPG_SLOT_HELD: '1'}});
  child.on('error', (e) => {
    console.error(`slot_run: ${e.message}`);
    release();
    process.exit(127);
  });
  child.on('exit', (code, signal) => {
    release();
    process.exit(code ?? (signal ? 128 + ({SIGINT: 2, SIGTERM: 15, SIGHUP: 1, SIGKILL: 9}[signal] || 1) : 1));
  });
}

main();

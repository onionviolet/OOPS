#!/usr/bin/env node
// Machine-wide queue for heavy test work, shared by every session, lane and worktree.
//   node scripts/test_queue.mjs suite -- npm test          one full node --test suite at a time
//   node scripts/test_queue.mjs browser -- node scripts/village_browser.cjs
//                                                          at most N browser checks at a time (default 2)
//   node scripts/test_queue.mjs status                     who holds a slot, who is waiting
// Waiters run in arrival order. The command inherits stdio and its exit code is returned.
// Locks are directories under os.tmpdir() (atomic mkdir). A slot whose owner process is gone is reclaimed.
// If the wrapper is SIGKILLed the slot frees itself once its pid is dead; the child is not killed for you.
// Env: YAIRPG_QUEUE_DIR (lock root), YAIRPG_QUEUE_SUITE_SLOTS (default 1), YAIRPG_QUEUE_BROWSER_SLOTS (default 2),
//      YAIRPG_QUEUE_POLL_MS (default 500), YAIRPG_QUEUE_TIMEOUT_S (give up waiting; default none).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';

const ROOT = process.env.YAIRPG_QUEUE_DIR || path.join(os.tmpdir(), 'yairpg-test-queue');
const LIMITS = {suite:+(process.env.YAIRPG_QUEUE_SUITE_SLOTS || 1), browser:+(process.env.YAIRPG_QUEUE_BROWSER_SLOTS || 2)};
const POLL_MS = +(process.env.YAIRPG_QUEUE_POLL_MS || 500);
const alive = pid => {try {process.kill(pid, 0); return true;} catch(e) {return e.code === 'EPERM';}};
const readJson = file => {try {return JSON.parse(fs.readFileSync(file, 'utf8'));} catch {return null;}};
const kindDir = (kind, sub) => path.join(ROOT, kind, sub);
const describe = o => `pid ${o.pid} in ${o.cwd} for ${Math.round((Date.now() - o.startedAt) / 1000)}s: ${o.cmd}`;

function slotOwners(kind) {
    const dir = kindDir(kind, 'slots');
    fs.mkdirSync(dir, {recursive:true});
    return fs.readdirSync(dir).map(name => ({name, owner:readJson(path.join(dir, name, 'owner.json'))}));
}

/** Waiters in arrival order, dead ones removed. */
function liveTickets(kind) {
    const dir = kindDir(kind, 'tickets');
    fs.mkdirSync(dir, {recursive:true});
    const tickets = [];
    for(const name of fs.readdirSync(dir).sort()) {
        const t = readJson(path.join(dir, name));
        if(!t || !alive(t.pid)) {fs.rmSync(path.join(dir, name), {force:true}); continue;}
        tickets.push({name, ...t});
    }
    return tickets;
}

function reclaimStale(kind) {
    const dir = kindDir(kind, 'slots');
    for(const {name, owner} of slotOwners(kind)) {
        // A slot directory with no owner.json is being created right now; give it a moment before judging.
        const age = Date.now() - fs.statSync(path.join(dir, name)).mtimeMs;
        if((owner && !alive(owner.pid)) || (!owner && age > 5000)) fs.rmSync(path.join(dir, name), {recursive:true, force:true});
    }
}

function tryAcquire(kind, me) {
    reclaimStale(kind);
    for(let i = 0; i < LIMITS[kind]; i++) {
        const slot = kindDir(kind, `slots/${i}`);
        try {fs.mkdirSync(slot);} catch(e) {if(e.code === 'EEXIST') continue; throw e;}
        fs.writeFileSync(path.join(slot, 'owner.json'), JSON.stringify(me));
        return slot;
    }
    return null;
}

async function acquire(kind, me) {
    const ticketDir = kindDir(kind, 'tickets');
    fs.mkdirSync(ticketDir, {recursive:true});
    const ticket = path.join(ticketDir, `${String(Date.now()).padStart(15, '0')}-${String(process.pid).padStart(8, '0')}`);
    fs.writeFileSync(ticket, JSON.stringify(me));
    const deadline = process.env.YAIRPG_QUEUE_TIMEOUT_S ? Date.now() + process.env.YAIRPG_QUEUE_TIMEOUT_S * 1000 : Infinity;
    let lastNote = 0;
    try {
        for(;;) {
            const waiting = liveTickets(kind), index = waiting.findIndex(t => t.pid === process.pid);
            // Only the head of the line may take a free slot, so arrival order is kept.
            if(index === 0) {
                const slot = tryAcquire(kind, me);
                if(slot) return slot;
            }
            if(Date.now() > deadline) throw new Error(`Timed out waiting for a ${kind} slot.`);
            if(Date.now() - lastNote > 15000) {
                lastNote = Date.now();
                const holders = slotOwners(kind).map(s => s.owner).filter(Boolean);
                console.error(`[test_queue] waiting for a ${kind} slot, position ${index + 1} of ${waiting.length}; running: ${holders.map(describe).join(' ; ') || 'none'}`);
            }
            await new Promise(r => setTimeout(r, POLL_MS + Math.random() * POLL_MS * 0.5));
        }
    } finally {fs.rmSync(ticket, {force:true});}
}

function status() {
    for(const kind of Object.keys(LIMITS)) {
        reclaimStale(kind);
        const running = slotOwners(kind).map(s => s.owner).filter(Boolean), waiting = liveTickets(kind);
        console.log(`${kind}: ${running.length}/${LIMITS[kind]} running, ${waiting.length} waiting`);
        for(const o of running) console.log(`  running  ${describe(o)}`);
        for(const [i, o] of waiting.entries()) console.log(`  waiting#${i + 1} ${describe(o)}`);
    }
}

async function main() {
    const [kind, ...rest] = process.argv.slice(2);
    if(kind === 'status') return status();
    const split = rest.indexOf('--');
    const command = split >= 0 ? rest.slice(split + 1) : rest;
    if(!(kind in LIMITS) || !command.length) {
        console.error('usage: test_queue.mjs <suite|browser> -- <command...>   |   test_queue.mjs status');
        process.exit(2);
    }
    const me = {pid:process.pid, cwd:process.cwd(), cmd:command.join(' '), startedAt:Date.now()};
    const slot = await acquire(kind, me);
    me.startedAt = Date.now();
    fs.writeFileSync(path.join(slot, 'owner.json'), JSON.stringify(me));
    let release = () => {release = () => {}; fs.rmSync(slot, {recursive:true, force:true});};
    const child = spawn(command[0], command.slice(1), {stdio:'inherit'});
    for(const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => child.kill(sig));
    process.on('exit', () => release());
    child.on('error', e => {console.error(e.message); release(); process.exit(127);});
    child.on('close', (code, signal) => {release(); process.exit(code ?? (signal ? 128 + (os.constants.signals[signal] || 0) : 1));});
}

main().catch(e => {console.error(e.message); process.exit(1);});

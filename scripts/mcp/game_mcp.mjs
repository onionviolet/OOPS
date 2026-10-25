#!/usr/bin/env node
// Game MCP server: lets an agent play the headless game in game terms.
// Stdio transport, no packages. Backend is scripts/headless (deterministic, no
// browser, no Electron, never the player's save). One game per server.
//   node scripts/mcp/game_mcp.mjs               serve over stdio
//   node scripts/mcp/game_mcp.mjs --self-check  boot, look, step, save, exit 0
// Register it yourself where you want it, e.g. Claude Code:
//   claude mcp add yairpg-game -- node /abs/path/scripts/mcp/game_mcp.mjs
import {fork} from 'node:child_process';
import {appendFileSync, mkdirSync, existsSync, readFileSync} from 'node:fs';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from './stdio_server.mjs';

const WORKER = fileURLToPath(new URL('./game_worker.mjs', import.meta.url));
// Append-only ledger of limits agents hit; docs/tools/GAME_MCP_LIMITS.md owns the rule.
const LIMITS = process.env.YAIRPG_MCP_LIMITS || fileURLToPath(new URL('../../docs/tools/game_mcp_limits.jsonl', import.meta.url));
const clip = (v, n = 500) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, n);
const openLimits = () => existsSync(LIMITS) ? readFileSync(LIMITS, 'utf8').split('\n').filter(Boolean).length : 0;
const OP_TIMEOUT_MS = Number(process.env.YAIRPG_MCP_TIMEOUT_MS) || 300000;

let worker = null, nextId = 1;
const waiting = new Map();

function ensureWorker() {
    if(worker) return worker;
    worker = fork(WORKER, [], {stdio: ['ignore', 'ignore', 'inherit', 'ipc']});
    worker.on('message', msg => {
        const slot = waiting.get(msg.id);
        if(!slot) return;
        waiting.delete(msg.id); clearTimeout(slot.timer);
        msg.ok ? slot.resolve(msg.result) : slot.reject(new Error(msg.error));
    });
    worker.on('exit', () => {
        for(const [id, slot] of waiting) {clearTimeout(slot.timer); slot.reject(new Error('Game process ended. Call game_new to start again.')); waiting.delete(id);}
        worker = null;
    });
    return worker;
}

function call(op, args = {}) {
    const w = ensureWorker();
    return new Promise((resolve, reject) => {
        const id = nextId++;
        const timer = setTimeout(() => {waiting.delete(id); w.kill(); reject(new Error(`${op} timed out after ${OP_TIMEOUT_MS} ms; the game process was stopped.`));}, OP_TIMEOUT_MS);
        waiting.set(id, {resolve, reject, timer});
        w.send({id, op, args});
    });
}

const view = r => ({text: JSON.stringify(r, null, 1), data: r});
const obj = (properties, required = []) => ({type: 'object', properties, required});

const tools = [
    {name: 'game_new', description: 'Start a fresh game (new hero) or resume from an exported file. Replaces any running game. Automatically clicks PLAY through the headless driver. Returns started and what the player sees.',
        inputSchema: obj({seed: {type: 'integer', description: 'Seed for all randomness; same seed and same actions give the same game.'}, heroName: {type: 'string'}, url: {type: 'string', description: 'Localhost test origin, for opt-in world entry flags. Defaults to http://localhost/?test_hooks=1.'}, path: {type: 'string', description: 'An export file written by game_export.'}}),
        handler: a => call('new', a).then(view)},
    {name: 'game_look', description: 'What the player sees now: location, game time, screen text and the numbered list of available actions.', readOnly: true,
        inputSchema: obj({scope: {type: 'string', description: 'Optional CSS selector for a visible panel.'}, offset: {type: 'integer', description: 'Action offset, in pages of 80. Indices remain absolute within this view.'}}),
        handler: a => call('look', a).then(view)},
    {name: 'game_click', description: 'Do one action the way a player clicks it. Prefer index from the last game_look; key and text also work. Returns the new view.',
        inputSchema: obj({index: {type: 'integer'}, key: {type: 'string', description: 'CSS selector from an action key.'}, text: {type: 'string', description: 'Exact button text.'}}),
        handler: a => call('click', a).then(view)},
    {name: 'game_step', description: 'Let game time pass (1 to 10080 minutes). Runs as fast as the CPU allows.', inputSchema: obj({minutes: {type: 'integer'}}, ['minutes']),
        handler: a => call('step', a).then(view)},
    {name: 'game_status', description: 'Game time, location, boot count, step stats and the last page errors.', readOnly: true, handler: () => call('status').then(view)},
    {name: 'game_save', description: 'Save through the game and return a hash and size only, never the raw save.', handler: () => call('save').then(view)},
    {name: 'game_export', description: 'Write the options-menu export file to a private temp folder and return its path.', handler: () => call('export').then(view)},
    {name: 'game_load', description: 'Import an export file written by game_export (it must be in that temp folder).', inputSchema: obj({path: {type: 'string'}}, ['path']),
        handler: a => call('load', a).then(view)},
    {name: 'game_report_limit', description: 'Call once when a limit of these tools blocks or slows you: a missing tool, a view you could not get, an action that would not run. Say what you wanted. Keep playing with a workaround. The entry is appended to a ledger that maintainers fold into the next version of this server.',
        inputSchema: obj({wanted: {type: 'string', description: 'What you tried to do or needed to see.'}, blockedBy: {type: 'string', description: 'The error or missing capability.'}, workaround: {type: 'string', description: 'What you did instead, if anything.'}}, ['wanted']),
        handler: a => {
            mkdirSync(dirname(LIMITS), {recursive: true});
            appendFileSync(LIMITS, JSON.stringify({at: new Date().toISOString(), wanted: clip(a.wanted), blockedBy: clip(a.blockedBy), workaround: clip(a.workaround)}) + '\n');
            return view({recorded: true, ledgerEntries: openLimits(), note: 'Thanks. Continue with your workaround.'});
        }},
];

const server = createServer({
    name: 'yairpg-game', version: '0.1.0', tools,
    instructions: 'Plays a headless copy of the game. Call game_new, then loop game_look, game_click and game_step. Text is what a player sees; sealed secrets stay in the game. Saves never leave as raw bytes. If a limit of these tools blocks or slows you (no screenshot, no quote tool, an action that will not run), call game_report_limit once with what you wanted and keep going with a workaround.',
});

if(process.argv.includes('--self-check')) {
    try {
        const first = await call('new', {seed: 7});
        const stepped = await call('step', {minutes: 30});
        const saved = await call('save');
        if(!first.actions.length || stepped.time.minute === first.time.minute && stepped.time.hour === first.time.hour) throw new Error('no actions or time did not move');
        console.log(JSON.stringify({ok: true, actions: first.actions.length, hash: saved.hash, openLimitEntries: openLimits()}));
        process.exitCode = 0;
    } catch(error) {console.error('self-check failed:', error.message); process.exitCode = 1;}
    worker?.kill();
} else {
    await server.listen();
    worker?.kill();
}

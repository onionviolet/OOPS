#!/usr/bin/env node
// Game MCP server: lets an agent play the headless game in game terms.
// Stdio transport, no packages. Backend is scripts/headless (deterministic, no
// browser, no Electron, never the player's save). One isolated worker per session.
//   node scripts/mcp/game_mcp.mjs               serve over stdio
//   node scripts/mcp/game_mcp.mjs --self-check  boot, look, step, save, exit 0
// Register it yourself where you want it, e.g. Claude Code:
//   claude mcp add yairpg-game -- node /abs/path/scripts/mcp/game_mcp.mjs
import {fork} from 'node:child_process';
import {appendFileSync, mkdirSync, existsSync, readFileSync} from 'node:fs';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {electronPreflight,captureElectron} from './electron_backend.mjs';
import {freezeBuild, ownFrozen} from './frozen_build.mjs';
import {resolveCheckout} from './checkout.mjs';
import {createServer} from './stdio_server.mjs';

const WORKER = fileURLToPath(new URL('./game_worker.mjs', import.meta.url));
// Append-only ledger of limits agents hit; docs/tools/GAME_MCP_LIMITS.md owns the rule.
const LIMITS = process.env.YAIRPG_MCP_LIMITS || fileURLToPath(new URL('../../docs/tools/game_mcp_limits.jsonl', import.meta.url));
const clip = (v, n = 500) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, n);
const openLimits = () => existsSync(LIMITS) ? readFileSync(LIMITS, 'utf8').split('\n').filter(Boolean).length : 0;
const OP_TIMEOUT_MS = Number(process.env.YAIRPG_MCP_TIMEOUT_MS) || 300000;

const sessions = new Map();
let nextId = 1;
function sessionKey(args) {
    const id = args.sessionId ?? 'default';
    if(typeof id !== 'string' || !/^[A-Za-z0-9_.-]{1,64}$/.test(id)) throw Error('sessionId must be 1 to 64 letters, digits, dots, underscores or hyphens.');
    return id;
}
function stopSession(id) {
    const slot = sessions.get(id);
    if(slot) {sessions.delete(id); slot.worker.kill();}
}
function ensureWorker(id, create = false, frozen = null, checkout = null) {
    if(sessions.has(id)) return sessions.get(id);
    if(!create) throw Error(`No game for session ${id}. Call game_new first.`);
    const worker = fork(frozen ? frozen.root + '/scripts/mcp/game_worker.mjs' : checkout ? checkout.root + '/scripts/mcp/game_worker.mjs' : WORKER, [], {stdio:['ignore','ignore','inherit','ipc']});
    const slot = {worker, frozen, checkout, waiting:new Map()};
    sessions.set(id, slot);
    worker.on('message', msg => {
        const pending = slot.waiting.get(msg.id);
        if(!pending) return;
        slot.waiting.delete(msg.id); clearTimeout(pending.timer);
        msg.ok ? pending.resolve({...msg.result, sessionId:id, build:slot.frozen ? {kind:"frozen",manifestSha256:slot.frozen.manifestSha256,bundleSha256:slot.frozen.bundleSha256,inputCount:slot.frozen.inputCount} : {kind:"live",...(slot.checkout ? {checkout:slot.checkout.root} : {})}}) : pending.reject(new Error(msg.error));
    });
    worker.on('exit', () => {
        for(const pending of slot.waiting.values()) {clearTimeout(pending.timer); pending.reject(Error(`Game process ended for session ${id}. Call game_new to start again.`));}
        slot.waiting.clear();
        if(sessions.get(id) === slot) sessions.delete(id);
    });
    return slot;
}
function call(op, args = {}) {
    const key = sessionKey(args);
    let frozen = null, checkout = null;
    if(op === 'new') {
        if(args.checkout) {
            if(args.bundlePath || args.snapshotManifest) throw Error('checkout and a frozen build cannot be combined.');
            checkout = resolveCheckout(args.checkout);
        }
        if(args.bundlePath || args.snapshotManifest) frozen = ownFrozen(args);
        stopSession(key);
    }
    const slot = ensureWorker(key, op === 'new', frozen, checkout);
    return new Promise((resolve, reject) => {
        const id = nextId++;
        const timer = setTimeout(() => {slot.waiting.delete(id); slot.worker.kill(); reject(Error(`${op} timed out after ${OP_TIMEOUT_MS} ms; session ${key} was stopped.`));}, OP_TIMEOUT_MS);
        slot.waiting.set(id, {resolve,reject,timer});
        slot.worker.send({id,op,args});
    });
}

const view = r => ({text: JSON.stringify(r, null, 1), data: r});
const obj = (properties, required = []) => ({type: 'object', properties, required});

const tools = [
    {name:'game_capabilities',description:'Preflight native screenshot dependencies; available means installed, not a verified launch. Headless look remains text only.',readOnly:true,handler:() => view({quoteCommands:['lamp.toggle'],sessions:true,frozenBuild:true,screenshot:electronPreflight()})},
    {name:'game_screenshot',description:'Real Electron/CDP PNG of a native saved-state mirror in a fresh hidden profile. Requires backend electron. Does not mirror transient headless panel selections or exact paused timing; returns image path and hash, never DOM layout claims.',readOnly:true,inputSchema:obj({backend:{type:'string',enum:['electron']}},['backend']),handler:async a => {
        if(a.backend !== 'electron') throw Error('Only the explicit electron screenshot backend is supported. Headless DOM is text only.');
        const cap=electronPreflight();if(!cap.available) throw Error(`Electron screenshot unavailable: ${cap.reason}`);
        const id=sessionKey(a),slot=ensureWorker(id);
        const state=await call('captureState',a);
        return view({...await captureElectron({root:slot.frozen?.root ?? slot.checkout?.root,save:state.save}),sessionId:id,build:state.build});
    }},
    {name:"game_freeze",description:"Freeze an instrumented build plus HTML/CSS/assets and runner inputs. Returns bundlePath, snapshotManifest and SHA-256 identities. Does not boot a game.",handler:async () => view(await freezeBuild())},
    {name:'game_quote', description:'Read the existing AR7 lamp toggle quote. Finite command surface: lamp.toggle only. No click, clock advance or consumption.', readOnly:true, inputSchema:obj({command:{type:'string',enum:['lamp.toggle']}},['command']), handler:a => call('quote',a).then(view)},
    {name:'game_reload',description:'Reload this session using its own storage and build inputs.',handler:a => call('reload',a).then(view)},
    {name:'game_close',description:'Stop only the selected session.',handler:a => {const id=sessionKey(a);stopSession(id);return view({closed:true,sessionId:id});}},
    {name: 'game_new', description: 'Start a fresh game (new hero) or resume from an exported file. Replaces only the selected session game. Automatically clicks PLAY through the headless driver. Returns started and what the player sees.',
        inputSchema: obj({checkout:{type:'string',description:'Absolute path of a git worktree of this repository to play instead of the primary checkout (its branch needs scripts/mcp/game_worker.mjs). Private packs, private fonts and node_modules are symlinked from the primary checkout. Not with bundlePath.'},bundlePath:{type:'string',description:'Instrumented bundle returned by game_freeze, distinct from exported save path.'},snapshotManifest:{type:'string',description:'Manifest returned by game_freeze; required with bundlePath.'},seed: {type: 'integer', description: 'Seed for all randomness; same seed and same actions give the same game.'}, heroName: {type: 'string'}, panel: {type: 'string', description: 'Open a known panel through the native More panels select, e.g. projects, continuation, lotm. Does not enroll or unlock it.'}, url: {type: 'string', description: 'Localhost test origin, for opt-in world entry flags. Defaults to http://localhost/?test_hooks=1.'}, path: {type: 'string', description: 'An export file written by game_export.'}}),
        handler: a => call('new', a).then(view)},
    {name: 'game_look', description: 'What the player sees now: location, game time, screen text and the numbered list of available actions.', readOnly: true,
        inputSchema: obj({scope: {type: 'string', description: 'Optional CSS selector for a visible panel.'}, offset: {type: 'integer', description: 'Action offset, in pages of 80. Indices remain absolute within this view.'}, view: {type: 'string', enum: ['full', 'compact'], description: 'compact returns only what changed since the last reply for this scope: header (time, location, job), added and removed screen lines, new actions. Indices stay absolute. Default full.'}}),
        handler: a => call('look', a).then(view)},
    {name: 'game_click', description: 'Do one native player action. Prefer index from game_look; key/text clicks, key+value selects, and panel navigation also work. Returns the new view.',
        inputSchema: obj({value: {type: 'string', description: 'Choose an available option in the visible native select identified by key.'}, panel: {type: 'string', description: 'Open a known panel using the native More panels select. No discovery bypass.'}, index: {type: 'integer'}, key: {type: 'string', description: 'CSS selector from an action key.'}, text: {type: 'string', description: 'Exact button text.'}, view: {type: 'string', enum: ['full', 'compact'], description: 'compact returns only what changed since the last reply for this scope: header (time, location, job), added and removed screen lines, new actions. Indices stay absolute. Default full.'}}),
        handler: a => call('click', a).then(view)},
    {name: 'game_step', description: 'Let game time pass (1 to 10080 minutes). Runs as fast as the CPU allows.', inputSchema: obj({minutes: {type: 'integer'}, view: {type: 'string', enum: ['full', 'compact'], description: 'compact returns only what changed since the last reply for this scope: header (time, location, job), added and removed screen lines, new actions. Indices stay absolute. Default full.'}}, ['minutes']),
        handler: a => call('step', a).then(view)},
    {name: 'game_status', description: 'Game time, location, boot count, step stats and the last page errors.', readOnly: true, handler: a => call('status', a).then(view)},
    {name: 'game_save', description: 'Save through the game and return a hash and size only, never the raw save.', handler: a => call('save', a).then(view)},
    {name: 'game_export', description: 'Write the options-menu export file to a private temp folder and return its path.', handler: a => call('export', a).then(view)},
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

for(const tool of tools) {
    tool.inputSchema ??= obj({});
    tool.inputSchema.properties.sessionId = {type:'string',description:'Isolated game id. Omit for backward-compatible default game.'};
}

const server = createServer({
    name: 'yairpg-game', version: '0.1.0', tools,
    instructions: 'Plays a headless copy of the game. Call game_new, then loop game_look, game_click and game_step. Text is what a player sees; sealed secrets stay in the game. Saves never leave as raw bytes. If a limit of these tools blocks or slows you (an action that will not run), call game_report_limit once with what you wanted and keep going with a workaround.',
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
    for(const id of sessions.keys()) stopSession(id);
} else {
    await server.listen();
    for(const id of sessions.keys()) stopSession(id);
}

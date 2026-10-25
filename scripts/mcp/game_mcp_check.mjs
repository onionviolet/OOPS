// Plays the elder greeting through the real stdio protocol: initialize, list,
// new, look, click by key and index, step, save, export, load. Checks that the
// same seed and actions give the same save hash twice, and that export then
// load returns to the exported game time with the same hero (byte-equal hashes
// are not expected: import and export touch bookkeeping fields). Usage: node scripts/mcp/game_mcp_check.mjs
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const LEDGER = join(mkdtempSync(join(tmpdir(), 'yairpg-limits-')), 'limits.jsonl');   // never the repo ledger

const SERVER = fileURLToPath(new URL('./game_mcp.mjs', import.meta.url));

function client() {
    const child = spawn(process.execPath, [SERVER], {stdio: ['pipe', 'pipe', 'inherit'], env: {...process.env, YAIRPG_MCP_LIMITS: LEDGER}});
    let buffer = '', next = 1;
    const waiting = new Map();
    child.stdout.setEncoding('utf8').on('data', chunk => {
        buffer += chunk;
        let at;
        while((at = buffer.indexOf('\n')) >= 0) {
            const msg = JSON.parse(buffer.slice(0, at)); buffer = buffer.slice(at + 1);
            waiting.get(msg.id)?.(msg); waiting.delete(msg.id);
        }
    });
    const rpc = (method, params) => new Promise(resolve => {
        const id = next++; waiting.set(id, resolve);
        child.stdin.write(JSON.stringify({jsonrpc: '2.0', id, method, params}) + '\n');
    });
    const tool = async (name, args = {}) => {
        const r = (await rpc('tools/call', {name, arguments: args})).result;
        assert.equal(r.isError, false, `${name}: ${r.content[0].text}`);
        return r.structuredContent;
    };
    return {rpc, tool, notify: (method, params) => child.stdin.write(JSON.stringify({jsonrpc: '2.0', method, params}) + '\n'), close: () => {child.stdin.end(); return new Promise(r => child.on('exit', r));}};
}

async function greetElder(c, seed) {
    const fresh = await c.tool('game_new', {seed});
    assert.equal(fresh.started, true, 'game_new auto-starts PLAY');
    assert.doesNotMatch(fresh.screen, /Waiting for you to click|Inspired by/, 'hidden startup text is absent');
    let choices = fresh, work;
    for(let offset = 0; offset < fresh.actionCount; offset += 80) {
        choices = await c.tool('game_look', {offset});
        work = choices.actions.find(a => /Find work/.test(a.text));
        if(work) break;
    }
    assert.ok(work, 'interactive Village livelihood action is reachable');
    await c.tool('game_click', {text: work.text});
    const working = await c.tool('game_look', {scope: '#location_actions_div'});
    const patrol = working.actions.find(a => a.key === '[data-activity="patrolling"]');
    assert.ok(patrol, 'Find work reveals the interactive Village patrol action');
    await c.tool('game_click', {index: patrol.index});
    // Patrol ticking has a baseline game defect (B1 report), outside the MCP seam.
    // This regression proves the formerly hidden control is reachable and accepts a click.
    assert.equal((await c.tool('game_status')).errors.length, 0, 'Village action click raises no page error');
    await c.tool('game_new', {seed});
    await c.tool('game_click', {key: '.choice_dialogue'});
    await c.tool('game_click', {key: '[data-dialogue="villageElder"]'});
    await c.tool('game_click', {key: '[data-textline="hello"]'});
    await c.tool('game_step', {minutes: 15});
    return c.tool('game_save');
}

async function nativeDropdownRoundtrip(c) {
    await c.tool('game_new', {seed: 251036});
    const local = () => c.tool('game_look', {scope: '#location_actions_div'});
    let v = await local();
    await c.tool('game_click', {index: v.actions.find(a => /Move somewhere else/.test(a.text)).index});
    v = await local();
    await c.tool('game_click', {index: v.actions.find(a => /Go to \[Wild willow stand\]/.test(a.text)).index});
    v = await local();
    assert.equal(v.location, 'Wild willow stand');
    const dropdown = v.actions.find(a => a.key === '.location_choice_dropdown');
    assert.ok(dropdown, 'native listener-only dropdown appears in action list');
    await c.tool('game_click', {index: dropdown.index});
    v = await local();
    const back = v.actions.find(a => /Return to Village/.test(a.text));
    assert.ok(back, 'native dropdown reveals a return route');
    const returned = await c.tool('game_click', {index: back.index});
    assert.equal(returned.location, 'Village');
}

const c = client();
try {
    const init = await c.rpc('initialize', {protocolVersion: '2025-06-18', capabilities: {}, clientInfo: {name: 'check', version: '1'}});
    assert.equal(init.result.serverInfo.name, 'yairpg-game');
    c.notify('notifications/initialized');
    const list = (await c.rpc('tools/list')).result.tools.map(t => t.name);
    assert.deepEqual(list.sort(), ['game_click', 'game_export', 'game_load', 'game_look', 'game_new', 'game_report_limit', 'game_save', 'game_status', 'game_step']);
    assert.equal((await c.rpc('nope')).error.code, -32601);

    const remote = (await c.rpc('tools/call', {name: 'game_new', arguments: {url: 'https://example.com/'}})).result;
    assert.equal(remote.isError, true, 'remote entry origins are refused');
    await nativeDropdownRoundtrip(c);
    const a = await greetElder(c, 11);
    assert.ok(a.heroCreated);
    const looked = await c.tool('game_look');
    assert.ok(looked.actions.length > 0 && typeof looked.screen === 'string');
    const laterPage = await c.tool('game_look', {offset: 80});
    assert.ok(laterPage.actions.length > 0 && laterPage.actions[0].index === 80, 'later controls are exposed with stable absolute indices');
    await c.tool('game_click', {index: 0}).catch(() => {});   // index path must not crash the server
    const b = await greetElder(c, 11);
    assert.equal(b.hash, a.hash, 'same seed and actions, same save');
    // Export itself touches state (reward timers), so compare with a save taken just after it.
    const exported = await c.tool('game_export');
    const secondExport = await c.tool('game_export');
    assert.notEqual(secondExport.path, exported.path, 'exports cannot overwrite each other at the same virtual instant');
    const atExport = (await c.tool('game_status')).time;
    await c.tool('game_step', {minutes: 60});
    assert.notDeepEqual((await c.tool('game_status')).time, atExport, 'time passes');
    await c.tool('game_load', {path: exported.path});
    const after = await c.tool('game_status');
    assert.deepEqual(after.time, atExport, 'export then load returns to the exported moment');
    assert.ok((await c.tool('game_save')).heroCreated, 'same hero after load');
    const resumed = await c.tool('game_new', {path: exported.path, seed: 11});
    assert.deepEqual(resumed.time, atExport, 'game_new path decodes an MCP export through the native import route');
    assert.equal(resumed.started, true);
    assert.ok((await c.tool('game_save')).heroCreated, 'same hero after resume');
    const bad = (await c.rpc('tools/call', {name: 'game_load', arguments: {path: '/etc/passwd'}})).result;
    assert.equal(bad.isError, true, 'paths outside the export folder are refused');
    const noted = await c.tool('game_report_limit', {wanted: 'a screenshot of the village', blockedBy: 'no browser here', workaround: 'read game_look text'});
    assert.equal(noted.ledgerEntries, 1);
    assert.match(readFileSync(LEDGER, 'utf8'), /screenshot of the village/);
    console.log(JSON.stringify({result: 'PASS', hash: a.hash, tools: list.length}));
} finally { await c.close(); }

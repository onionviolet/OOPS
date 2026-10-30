// Plays the elder greeting through the real stdio protocol: initialize, list,
// new, look, click by key and index, step, save, export, load. Checks that the
// same seed and actions give the same save hash twice, and that export then
// load returns to the exported game time with the same hero (byte-equal hashes
// are not expected: import and export touch bookkeeping fields). Usage: node scripts/mcp/game_mcp_check.mjs
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {existsSync, mkdtempSync, readFileSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, dirname, resolve} from 'node:path';

const LEDGER = join(mkdtempSync(join(tmpdir(), 'yairpg-limits-')), 'limits.jsonl');   // never the repo ledger

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const SERVER = fileURLToPath(new URL('./game_mcp.mjs', import.meta.url));

function client() {
    const child = spawn(process.execPath, [SERVER], {stdio: ['pipe', 'pipe', 'inherit'], env: {...process.env, YAIRPG_MCP_LIMITS: LEDGER}});
    let buffer = '', next = 1;
    const waiting = new Map();
    child.on('exit',(code,signal)=>{for(const pending of waiting.values()) pending({error:{message:`MCP server exited (${code ?? signal})`}});waiting.clear();});
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
        if(process.env.YAIRPG_MCP_CHECK_TRACE) process.stderr.write(`${name} ${args.sessionId ?? 'default'}\n`);
        const reply=await rpc('tools/call', {name, arguments: args});
        assert.ok(!reply.error,reply.error?.message);
        const r=reply.result;
        assert.equal(r.isError, false, `${name}: ${r.content[0].text}`);
        return r.structuredContent;
    };
    return {rpc, tool, notify: (method, params) => child.stdin.write(JSON.stringify({jsonrpc: '2.0', method, params}) + '\n'), close: () => {if(child.exitCode !== null || child.signalCode) return Promise.resolve();child.stdin.end(); return new Promise(r => child.on('exit', r));}};
}

async function nativeOnly(c) {
    const frozen=await c.tool('game_freeze');
    await c.tool('game_new',{sessionId:'native',seed:11,...frozen});
    const before=(await c.tool('game_status',{sessionId:'native'})).stateHash;
    const result=await c.tool('game_screenshot',{sessionId:'native',backend:'electron'});
    assert.equal(result.backend,'electron-cdp');assert.equal(result.width,1920);assert.equal(result.height,1080);
    assert.equal(readFileSync(result.path).subarray(0,8).toString('hex'),'89504e470d0a1a0a');
    assert.ok(result.bytes>10000);
    assert.equal((await c.tool('game_status',{sessionId:'native'})).stateHash,before,'native screenshot does not mutate source session');
    await c.tool('game_close',{sessionId:'native'});
    console.log(JSON.stringify({slice:'native-only',result:'PASS',frozen,screenshot:result}));
}

async function frozenAndNative(c) {
    const frozen=await c.tool('game_freeze');
    assert.match(frozen.bundleSha256,/^[a-f0-9]{64}$/);
    assert.match(frozen.manifestSha256,/^[a-f0-9]{64}$/);
    assert.ok(frozen.inputCount>10);
    await c.tool('game_new',{sessionId:'frozen',seed:11,...frozen});
    await c.tool('game_save',{sessionId:'frozen'});
    const first=await c.tool('game_look',{sessionId:'frozen'});
    const q=await c.tool('game_quote',{sessionId:'frozen',command:'lamp.toggle'});
    assert.equal(first.build.bundleSha256,frozen.bundleSha256);
    // Test actual working-tree drift. This lane is the sole writer here, and
    // every byte is restored even on failure. No primary checkout is touched.
    const paths=['src/main.js','scripts/headless/runner.mjs','index.html','style.css'];
    const originals=paths.map(p=>readFileSync(join(ROOT,p)));
    try {
        writeFileSync(join(ROOT,paths[0]),'throw new Error("E4 live source must not boot");');
        writeFileSync(join(ROOT,paths[1]),'throw new Error("E4 live runner must not load");');
        writeFileSync(join(ROOT,paths[2]),'<html><body>LIVE HTML DRIFT</body></html>');
        writeFileSync(join(ROOT,paths[3]),'* {display:none !important}');
        const reloaded=await c.tool('game_reload',{sessionId:'frozen'});
        assert.equal(reloaded.started,true);
        assert.equal(reloaded.location,first.location);
        assert.deepEqual(reloaded.time,first.time);
        assert.doesNotMatch(reloaded.screen,/LIVE HTML DRIFT/);
        assert.deepEqual((await c.tool('game_quote',{sessionId:'frozen',command:'lamp.toggle'})).quote,q.quote);
        assert.equal(reloaded.build.manifestSha256,frozen.manifestSha256);
    } finally {paths.forEach((p,i)=>writeFileSync(join(ROOT,p),originals[i]));}
    const exported=await c.tool('game_export',{sessionId:'frozen'});
    const atExport=(await c.tool('game_status',{sessionId:'frozen'})).time;
    await c.tool('game_step',{sessionId:'frozen',minutes:7});
    await c.tool('game_load',{sessionId:'frozen',path:exported.path});
    assert.deepEqual((await c.tool('game_status',{sessionId:'frozen'})).time,atExport,'frozen import reloads pinned inputs');
    const badPair=await c.rpc('tools/call',{name:'game_new',arguments:{sessionId:'frozen',bundlePath:frozen.bundlePath}});
    assert.equal(badPair.result.isError,true,'bundle alone cannot claim freeze');
    const mismatch=await c.rpc('tools/call',{name:'game_new',arguments:{sessionId:'frozen',...frozen,bundlePath:frozen.bundlePath+'.wrong'}});
    assert.equal(mismatch.result.isError,true,'manifest/bundle mismatch rejected');
    const manifest=JSON.parse(readFileSync(frozen.snapshotManifest,'utf8'));
    assert.ok(manifest.inputs.some(r=>r.path==='scripts/mcp/game_worker.mjs'));
    writeFileSync(frozen.bundlePath,'throw new Error("tampered external snapshot");');
    const tampered=await c.rpc('tools/call',{name:'game_new',arguments:{sessionId:'frozen',...frozen}});
    assert.equal(tampered.result.isError,true,'tampered input rejected before replacing existing session');
    assert.equal((await c.tool('game_reload',{sessionId:'frozen'})).started,true,'session owns frozen bytes even if supplied snapshot changes');
    const cap=await c.tool('game_capabilities');
    const badBackend=await c.rpc('tools/call',{name:'game_screenshot',arguments:{sessionId:'frozen',backend:'headless'}});
    assert.equal(badBackend.result.isError,true,'DOM cannot masquerade as screenshot');
    const before=(await c.tool('game_status',{sessionId:'frozen'})).stateHash;
    const image=await c.rpc('tools/call',{name:'game_screenshot',arguments:{sessionId:'frozen',backend:'electron'}});
    let native;
    if(image.result.isError) {
        assert.match(image.result.content[0].text,/Electron screenshot unavailable/);
        native={status:'blocked',preflight:cap.screenshot,error:image.result.content[0].text};
        if(process.env.YAIRPG_MCP_REQUIRE_ELECTRON==='1') assert.fail(native.error);
    } else {
        native=image.result.structuredContent;
        assert.equal(native.backend,'electron-cdp');
        assert.equal(native.width,1920);assert.equal(native.height,1080);
        const bytes=readFileSync(native.path);
        assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
        assert.ok(bytes.length>10000,'real rendered PNG');
        assert.equal(native.transientUiRestored,false);
    }
    assert.equal((await c.tool('game_status',{sessionId:'frozen'})).stateHash,before,'native mirror cannot mutate game session');
    await c.tool('game_close',{sessionId:'frozen'});
    console.log(JSON.stringify({slice:'frozen/native',frozen,native}));
}

// O5: game_new({checkout}) plays a git worktree and links the private inputs the worktree lacks.
async function worktreeCheckout(c) {
    const wt = join(mkdtempSync(join(tmpdir(), 'yairpg-wt-')), 'tree');
    execFileSync('git', ['worktree', 'add', '--detach', wt, 'HEAD'], {cwd: ROOT, stdio: 'ignore'});
    try {
        const first = await c.tool('game_new', {sessionId: 'wt', seed: 3, checkout: wt});
        assert.equal(first.build.kind, 'live');
        assert.match(first.build.checkout, /tree$/, 'reply names the played checkout');
        assert.equal(first.started, true);
        for(const rel of ['private_packs', 'node_modules']) if(existsSync(join(ROOT, rel))) assert.ok(existsSync(join(wt, rel)), `${rel} is linked into the worktree`);
        await c.tool('game_close', {sessionId: 'wt'});
        const outside = (await c.rpc('tools/call', {name: 'game_new', arguments: {sessionId: 'wt', checkout: tmpdir()}})).result;
        assert.equal(outside.isError, true, 'a folder that is not a worktree of this repo is refused');
    } finally { execFileSync('git', ['worktree', 'remove', '--force', wt], {cwd: ROOT, stdio: 'ignore'}); }
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
    const dropdown = v.actions.find(a => a.key === '.location_choice_dropdown' || a.key.includes('location_choice_dropdown') || a.key.includes('data-native-choice'));
    assert.ok(dropdown, 'native listener-only dropdown appears in action list');
    await c.tool('game_click', {index: dropdown.index});
    v = await local();
    const back = v.actions.find(a => /Return to Village/.test(a.text));
    assert.ok(back, 'native dropdown reveals a return route');
    const returned = await c.tool('game_click', {index: back.index});
    assert.equal(returned.location, 'Village');
}

async function blockedRoutes(c) {
    // Native startup must leave the launch-screen mode, not merely hide its text.
    await c.tool('game_new', {seed: 251041, panel: 'continuation'});
    let v = await c.tool('game_look', {scope: '#continuation_panel'});
    assert.ok(v.actions.some(a => a.key === '#continuation_open'), 'BLD3 native continuing connection is reachable');
    await c.tool('game_click', {key: '#continuation_open'});
    v = await c.tool('game_look', {scope: '#continuation_view'});
    assert.ok(v.actions.some(a => a.text === 'Begin a fresh life'), 'native fresh-life confirmation route is offered');
    await c.tool('game_click', {key: '[data-continuation-action="fresh"]'});
    await c.tool('game_click', {key: '[data-continuation-action="fresh"]'});
    await c.tool('game_click', {panel: 'continuation'});
    await c.tool('game_click', {key: '#continuation_open'});
    v = await c.tool('game_look', {scope: '#continuation_view'});
    assert.match(v.screen, /arrival paused/, 'fresh confirmation waits for native validation and reload into the new life');
    assert.ok(v.actions.some(a => /Continue this life/.test(a.text)), 'new-life arrival has its normal continuation control');
    assert.ok((await c.tool('game_save')).heroCreated, 'new-life runtime is writable after asynchronous validation');
    const unknown = (await c.rpc('tools/call', {name: 'game_click', arguments: {panel: 'nonexistent-c2-panel'}})).result;
    assert.equal(unknown.isError, true, 'panel helper cannot invent unknown panels');

    await c.tool('game_new', {seed: 251042, panel: 'lotm', url: 'http://localhost/?lotm_probe=1'});
    v = await c.tool('game_look', {scope: '#lotm_panel'});
    assert.ok(v.actions.some(a => /Begin as a Nighthawk/.test(a.text)), 'BLD2 localhost opt-in start exposed through native panel');
    await c.tool('game_click', {key: '[data-lotm="pick_probationer"]'});
    await c.tool('game_click', {key: '[data-lotm="enroll"]'});
    v = await c.tool('game_look', {scope: '#lotm_panel'});
    assert.match(v.screen, /Tingen/);
    assert.equal(v.location, 'Tingen supervised workroom', 'native enrollment moves to its own workroom');
    assert.doesNotMatch(v.screen, /A disposable test start/, 'enrollment retires the test-start choices');

    await c.tool('game_new', {seed: 251043});
    await c.tool('game_click', {key: '.choice_dialogue'});
    await c.tool('game_click', {key: '[data-dialogue="villageElder"]'});
    await c.tool('game_click', {key: '[data-textline="hello"]'});
    await c.tool('game_click', {key: '#center_mode_back'});
    await c.tool('game_step', {minutes: 1});
    await c.tool('game_click', {key: '[data-place-tab="options"]'});
    await c.tool('game_click', {key: '#systems_workshop_panel > summary'});
    await c.tool('game_click', {key: '[data-systems="enroll"]'});
    await c.tool('game_click', {panel: 'projects'});
    await c.tool('game_click', {key: '#projects_drawer > summary'});
    await c.tool('game_click', {key: '#p23_mistglass_panel > summary'});
    v = await c.tool('game_look', {scope: '#p23_mistglass_panel'});
    assert.ok(v.actions.some(a => /Enter Mistglass/.test(a.text)), 'BMC1 native conservatory entry is exposed after local enrollment');
    await c.tool('game_click', {key: '[data-mistglass-action="enter"]'});
    v = await c.tool('game_look', {scope: '#p23_mistglass_panel'});
    assert.ok(v.actions.some(a => /Learn the conservatory method/.test(a.text)), 'native Mistglass entry reached without debug state');
    assert.equal((await c.tool('game_status')).errors.length, 0);
}

const c = client();
try {
    const init = await c.rpc('initialize', {protocolVersion: '2025-06-18', capabilities: {}, clientInfo: {name: 'check', version: '1'}});
    assert.equal(init.result.serverInfo.name, 'yairpg-game');
    c.notify('notifications/initialized');
    const list = (await c.rpc('tools/list')).result.tools.map(t => t.name);
    assert.deepEqual(list.sort(), ['game_capabilities', 'game_screenshot', 'game_close', 'game_freeze', 'game_quote', 'game_reload', 'game_click', 'game_export', 'game_load', 'game_look', 'game_new', 'game_report_limit', 'game_save', 'game_status', 'game_step'].sort());
    assert.equal((await c.rpc('nope')).error.code, -32601);

    if(process.argv.includes('--native-only')) {
        await nativeOnly(c);
    } else if(process.argv.includes('--freeze-only')) {
        await frozenAndNative(c);
    } else {
    const remote = (await c.rpc('tools/call', {name: 'game_new', arguments: {url: 'https://example.com/'}})).result;
    assert.equal(remote.isError, true, 'remote entry origins are refused');
    await c.tool('game_new', {seed:17});
    await c.tool('game_save');
    const defaultSave=await c.tool('game_status');
    const q=await c.tool('game_quote',{command:'lamp.toggle'});
    assert.equal(q.quote.eligible,false,'native AR7 quote explains missing lamp');
    assert.match(q.quote.reason,/lamp/);
    const rejected=await c.rpc('tools/call',{name:'game_quote',arguments:{command:'debug.truth'}});
    assert.equal(rejected.result.isError,true,'unlisted quote commands fail closed');
    assert.equal((await c.tool('game_status')).stateHash,defaultSave.stateHash,'quotes consume no items, money, oil or time');
    const fixture=await c.tool('game_export');
    const encoded=readFileSync(fixture.path,'utf8');
    const fresh=JSON.parse(Buffer.from(encoded.replace(/^YAIR-UTF8-1:/,''),'base64').toString('utf8'));
    for(const id of ['Oil lamp','Lamp oil']) fresh.inventories.person.main_character[JSON.stringify({id})]={count:1};
    fresh.lamplight={schema:1,lit:false,oil:0,noticed:{}};
    writeFileSync(fixture.path,Buffer.from(JSON.stringify(fresh),'utf8').toString('base64'));
    await c.tool('game_load',{path:fixture.path});
    const fundedBefore=(await c.tool('game_status')).stateHash;
    const funded=await c.tool('game_quote',{command:'lamp.toggle'});
    assert.equal(funded.quote.eligible,true);assert.equal(funded.quote.spend,1);
    await c.tool('game_quote',{command:'lamp.toggle'});
    assert.equal((await c.tool('game_status')).stateHash,fundedBefore,'funded quotes do not spend oil or light lamp; old unmarked export imports');
    await c.tool('game_new',{sessionId:'other',seed:31});
    const otherTime=(await c.tool('game_status',{sessionId:'other'})).time;
    await c.tool('game_save',{sessionId:'other'});
    const otherSave=await c.tool('game_status',{sessionId:'other'});
    await c.tool('game_step',{minutes:8});
    assert.deepEqual((await c.tool('game_status',{sessionId:'other'})).time,otherTime,'clocks are isolated');
    assert.equal((await c.tool('game_status',{sessionId:'other'})).stateHash,otherSave.stateHash,'save storage is isolated');
    const ownExport=await c.tool('game_export');
    await c.tool('game_step',{sessionId:'other',minutes:12});
    await c.tool('game_load',{path:ownExport.path});
    await c.tool('game_save',{sessionId:'other'});
    const laterOther=(await c.tool('game_status',{sessionId:'other'})).time;
    await c.tool('game_reload',{sessionId:'other'});
    assert.deepEqual((await c.tool('game_status',{sessionId:'other'})).time,laterOther,'reload uses selected session storage');
    await c.tool('game_new',{seed:17});
    assert.deepEqual((await c.tool('game_status',{sessionId:'other'})).time,laterOther,'replacing default preserves other game');
    await c.tool('game_close',{sessionId:'other'});
    assert.equal((await c.rpc('tools/call',{name:'game_status',arguments:{sessionId:'other'}})).result.isError,true,'closed id cannot access default');
    assert.equal((await c.rpc('tools/call',{name:'game_new',arguments:{sessionId:''}})).result.isError,true,'invalid ids rejected');
    assert.equal((await c.tool('game_status')).sessionId,'default','omitted id preserves default session');
    console.log(JSON.stringify({slice:'quote/sessions',result:'PASS'}));
    await frozenAndNative(c);
    await blockedRoutes(c);
    await nativeDropdownRoundtrip(c);
    const a = await greetElder(c, 11);
    assert.ok(a.heroCreated);
    const looked = await c.tool('game_look');
    assert.ok(looked.actions.length > 0 && typeof looked.screen === 'string');
    const laterPage = await c.tool('game_look', {offset: 80});
    assert.ok(laterPage.actions.length > 0 && laterPage.actions[0].index === 80, 'later controls are exposed with stable absolute indices');
    await c.tool('game_click', {index: 0}).catch(() => {});   // index path must not crash the server
    // Compact view: baseline once, then deltas only, with indices valid against the full list.
    await c.tool('game_new', {seed: 11, sessionId: 'compact'});
    const base = await c.tool('game_look', {sessionId: 'compact', view: 'compact'});
    assert.equal(base.baseline, true);
    const again = await c.tool('game_look', {sessionId: 'compact', view: 'compact'});
    assert.equal(again.baseline, false);
    assert.equal(again.addedLineCount, 0);
    assert.equal(again.newActionCount, 0, 'unchanged screen reports no delta');
    const fullView = await c.tool('game_look', {sessionId: 'compact'});
    assert.ok(fullView.screen.length > 4 * JSON.stringify(again).length, 'compact reply is far smaller than the full one');
    const stepDelta = await c.tool('game_step', {sessionId: 'compact', minutes: 30, view: 'compact'});
    assert.ok(stepDelta.addedLineCount > 0 && stepDelta.addedLineCount < 40 && stepDelta.time.minute === 30, 'step delta carries the new clock line');
    const talk = (await c.tool('game_look', {sessionId: 'compact', view: 'compact'}));
    const fullNow = await c.tool('game_look', {sessionId: 'compact', offset: 0});
    const dlg = fullNow.actions.find(a => a.key === '.choice_dialogue');
    if(dlg) {
        const d = await c.tool('game_click', {sessionId: 'compact', index: dlg.index, view: 'compact'});
        for(const a of d.newActions) assert.equal((await c.tool('game_look', {sessionId: 'compact'})).actionCount > a.index, true, 'new action index is valid in the full list');
        assert.equal(d.baseline, false);
    }
    assert.equal(talk.baseline, false);
    await c.tool('game_close', {sessionId: 'compact'});
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
    await worktreeCheckout(c);
    console.log(JSON.stringify({result: 'PASS', hash: a.hash, tools: list.length}));
    }
} finally { await c.close(); }

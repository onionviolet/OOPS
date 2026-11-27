import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {spawn, execFileSync} from 'node:child_process';
import {once} from 'node:events';
import {mkdtemp, readFile, writeFile, rm, access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const {selectOwnedTree, wrapOwnedClose, launchOwnedChromium, stopOwnedTree} = createRequire(import.meta.url)('../scripts/owned_chrome.cjs');
test('a launch tree excludes sibling proof browsers and user Chrome',()=>{
    const rows=[{pid:10,parentId:1,started:'a',commandLine:'chrome --yairpg-proof-owner=a'},
        {pid:11,parentId:10,started:'b'},{pid:12,parentId:11,started:'c'},
        {pid:20,parentId:1,started:'d',commandLine:'chrome --yairpg-proof-owner=b'},
        {pid:21,parentId:20,started:'e'},{pid:30,parentId:2,started:'f',commandLine:'chrome --user-profile'}];
    assert.deepEqual(selectOwnedTree(rows,1,'--yairpg-proof-owner=a'),[{pid:10,started:'a'},{pid:11,started:'b'},{pid:12,started:'c'}]);
    assert.throws(()=>selectOwnedTree(rows,1,'missing'),/found 0/);
});
test('close captures before parent exit, stops only the captured tree and releases the original promise',async()=>{
    const events=[],owned=[{pid:10,started:'a'},{pid:11,started:'b'}];let release;
    const browser={close:()=>{events.push('close');return new Promise(resolve=>{release=resolve;});},newContext:()=> 'unchanged'};
    wrapOwnedClose(browser,{timeoutMs:1,readTree:async()=>{events.push('capture');return owned;},stopTree:async rows=>{events.push('stop');assert.deepEqual(rows,owned);release();}});
    const closing=browser.close();assert.equal(browser.close(),closing);await closing;
    assert.deepEqual(events,['capture','close','stop']);assert.equal(browser.newContext(),'unchanged');
});
test('normal close does not force cleanup, close failures propagate, and non-Windows launch is unchanged',async()=>{
    const browser={close:async()=>{}};wrapOwnedClose(browser,{readTree:async()=>[],stopTree:()=>assert.fail('forced')});await browser.close();
    const failing={close:async()=>{throw Error('original failure');}};wrapOwnedClose(failing,{readTree:async()=>[],stopTree:()=>assert.fail('forced')});await assert.rejects(failing.close(),/original failure/);
    const options={headless:true,args:['existing']};assert.equal(await launchOwnedChromium({launch:async actual=>{assert.equal(actual,options);return browser;}},options,'linux'),browser);
});

test('a disconnected WS client still closes its owning server and disposes it once',async()=>{
    const events=[];
    const browser={isConnected:()=>false,close:async()=>{events.push('client');}};
    wrapOwnedClose(browser,{readTree:async()=>[],stopTree:()=>assert.fail('forced'),closeTransport:async()=>{events.push('server');},dispose:async()=>{events.push('dispose');}});
    await Promise.all([browser.close(),browser.close()]);
    assert.deepEqual(events,['client','server','dispose']);
});

test('timeout stops the owned transport, releases close and preserves its original failure',async()=>{
    const original=Error('original transport failure'),events=[];let release;
    const browser={close:async()=>{throw original;}};
    wrapOwnedClose(browser,{timeoutMs:1,readTree:async()=>[{pid:10,started:'owned'}],
        closeTransport:()=>new Promise(resolve=>{release=resolve;}),stopTree:async rows=>{assert.equal(rows[0].started,'owned');events.push('stop');release();},dispose:async()=>events.push('dispose')});
    await assert.rejects(browser.close(),error=>error===original);
    assert.deepEqual(events,['stop','dispose']);
});

test('cleanup failures retain the underlying close failure in order',async()=>{
    const original=Error('original'),cleanup=Error('cleanup');
    const browser={close:async()=>{throw original;}};
    wrapOwnedClose(browser,{timeoutMs:1,readTree:async()=>[{pid:10,started:'owned'}],closeTransport:()=>new Promise(()=>{}),stopTree:async()=>{throw cleanup;}});
    await assert.rejects(browser.close(),error=>error instanceof AggregateError&&error.errors[0]===original&&error.errors[1]===cleanup);
});

test('snapshot failure still closes the Browser and helper, disposes once and retains the failure',async()=>{
    const snapshot=Error('snapshot timeout'),events=[];
    const browser={close:async()=>events.push('browser')};
    wrapOwnedClose(browser,{readTree:async()=>{throw snapshot;},stopTree:()=>assert.fail('unverified force'),
        closeTransport:async()=>events.push('helper'),dispose:async()=>events.push('dispose')});
    const closing=browser.close();assert.equal(browser.close(),closing);
    await assert.rejects(closing,error=>error===snapshot);
    assert.deepEqual(events,['browser','helper','dispose']);
});

test('failed fresh capture can force only a prior verified tree and always disposes',async()=>{
    const snapshot=Error('snapshot timeout'),owned=[{pid:10,started:'verified earlier'}],events=[];let release;
    const browser={close:async()=>events.push('browser')};
    wrapOwnedClose(browser,{timeoutMs:1,readTree:async()=>{throw snapshot;},knownTree:()=>owned,
        closeTransport:()=>new Promise(resolve=>{release=resolve;}),stopTree:async rows=>{assert.equal(rows,owned);events.push('guarded stop');release();},dispose:async()=>events.push('dispose')});
    await assert.rejects(browser.close(),error=>error===snapshot);
    assert.deepEqual(events,['browser','guarded stop','dispose']);
});

test('missing verified identities never force; snapshot, close and disposal errors survive',async()=>{
    const snapshot=Error('snapshot timeout'),original=Error('Browser close'),disposal=Error('dispose');let disposed=0;
    const browser={close:async()=>{throw original;}};
    wrapOwnedClose(browser,{timeoutMs:1,readTree:async()=>{throw snapshot;},stopTree:()=>assert.fail('unverified force'),
        closeTransport:()=>new Promise(()=>{}),dispose:async()=>{disposed++;throw disposal;}});
    await assert.rejects(browser.close(),error=>error instanceof AggregateError&&error.errors[0]===snapshot&&
        error.errors.includes(original)&&error.errors.includes(disposal)&&error.errors.some(e=>/No verified owned/.test(e.message)));
    assert.equal(disposed,1);
});

test('startup capture failure gracefully closes the actual IPC helper and removes its private directory', {timeout:10000}, async t=>{
    const directory=await mkdtemp(join(tmpdir(),'owned-helper-test-')),modulePath=join(directory,'playwright.cjs'),metadata=join(directory,'metadata.json'),closed=join(directory,'closed');
    t.after(()=>rm(directory,{recursive:true,force:true}));
    // A real Node helper/IPC lifecycle, without Chrome or a PowerShell inventory.
    // The fake server's own watchdog prevents a regressed cleanup from holding the suite.
    await writeFile(modulePath,`const fs=require('node:fs');module.exports.chromium={launchServer:async()=>{
        fs.writeFileSync(${JSON.stringify(metadata)},JSON.stringify({pid:process.pid,directory:process.env.TEMP}));
        const keep=setInterval(()=>{},1000),watch=setTimeout(()=>{clearInterval(keep);if(process.connected)process.disconnect();},5000);
        return {wsEndpoint:()=> 'ws://fixture',close:async()=>{fs.writeFileSync(${JSON.stringify(closed)},'closed');clearInterval(keep);clearTimeout(watch);}};
    },connect:async()=>{throw Error('capture should fail before connecting');}};`);
    const chromium=createRequire(import.meta.url)(modulePath).chromium,snapshot=Error('injected process snapshot timeout');let captures=0;
    await assert.rejects(launchOwnedChromium(chromium,{headless:true},'win32',{readTree:async()=>{captures++;throw snapshot;}}),error=>error===snapshot);
    assert.equal(captures,1,'startup cleanup must not repeat the failed inventory');
    assert.equal(await readFile(closed,'utf8'),'closed');
    const child=JSON.parse(await readFile(metadata,'utf8'));
    assert.throws(()=>process.kill(child.pid,0),error=>error.code==='ESRCH');
    await assert.rejects(access(child.directory),error=>error.code==='ENOENT');
});
test('Windows cleanup refuses a reused PID identity and leaves a sibling process alive', {skip:process.platform!=='win32'}, async()=>{
    const owned=spawn(process.execPath,['-e','setInterval(()=>{},1000)'],{windowsHide:true,stdio:'ignore'});
    const sibling=spawn(process.execPath,['-e','setInterval(()=>{},1000)'],{windowsHide:true,stdio:'ignore'});
    await Promise.all([once(owned,'spawn'),once(sibling,'spawn')]);
    try {
        const started=execFileSync('powershell.exe',['-NoProfile','-Command',`(Get-Process -Id ${owned.pid}).StartTime.ToUniversalTime().Ticks.ToString()`],{windowsHide:true,encoding:'utf8'}).trim();
        await stopOwnedTree([{pid:owned.pid,started:'0'}]);assert.equal(owned.exitCode,null);process.kill(owned.pid,0);
        const exited=once(owned,'exit');await stopOwnedTree([{pid:owned.pid,started}]);await exited;
        assert.equal(sibling.exitCode,null);process.kill(sibling.pid,0);
    } finally {owned.kill();sibling.kill();}
});

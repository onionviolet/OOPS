// Windows proof-browser teardown. Own the transport process as well as its tagged Chrome tree.
const {randomUUID} = require('node:crypto');
const {execFile, fork} = require('node:child_process');
const {mkdtemp, rm} = require('node:fs/promises');
const {tmpdir} = require('node:os');
const path = require('node:path');
const markerPrefix = '--yairpg-proof-owner=';
const powerShell = (script, payload) => new Promise((resolve, reject) => {
    const child = execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script],
        {windowsHide:true, encoding:'utf8', maxBuffer:8*1024*1024, timeout:20000}, (error, stdout, stderr) => {
            if(error) reject(new Error(`Owned Chrome cleanup failed: ${stderr.trim() || error.message}`)); else resolve(stdout.trim());
        });
    child.stdin.end(JSON.stringify(payload));
});
function selectOwnedTree(rows, parentId, marker) {
    const roots = rows.filter(row => row.parentId === parentId && row.commandLine?.split(/\s+/).includes(marker));
    if(roots.length !== 1) throw new Error(`Expected one tagged proof browser, found ${roots.length}.`);
    const owned = [roots[0]];
    for(let i=0;i<owned.length;i++) for(const row of rows) if(row.parentId === owned[i].pid && !owned.some(old=>old.pid===row.pid)) owned.push(row);
    return owned.map(({pid, started}) => ({pid, started}));
}
async function readOwnedTree(marker, parentId=process.pid) {
    const raw = await powerShell(`$payload = [Console]::In.ReadToEnd() | ConvertFrom-Json
        $all = @(Get-CimInstance Win32_Process)
        $roots = @($all | Where-Object { $_.ParentProcessId -eq $payload.parentId -and ($_.CommandLine -split '\\s+') -contains $payload.marker })
        if ($roots.Count -ne 1) { throw 'Expected one tagged proof browser.' }
        $tree = [System.Collections.Generic.List[object]]::new(); $tree.Add($roots[0])
        $seen = [System.Collections.Generic.HashSet[int]]::new(); [void]$seen.Add([int]$roots[0].ProcessId)
        for ($i=0; $i -lt $tree.Count; $i++) { foreach ($row in $all) { if ($row.ParentProcessId -eq $tree[$i].ProcessId -and $seen.Add([int]$row.ProcessId)) { $tree.Add($row) } } }
        $rows = @($tree | ForEach-Object {
        $live = Get-Process -Id $_.ProcessId -ErrorAction SilentlyContinue
        if ($live) { try { [pscustomobject]@{pid=[int]$_.ProcessId;parentId=[int]$_.ParentProcessId;started=$live.StartTime.ToUniversalTime().Ticks.ToString();commandLine=$_.CommandLine} } catch {} }
    }); ConvertTo-Json -InputObject $rows -Compress`, {parentId,marker});
    return selectOwnedTree(JSON.parse(raw || '[]'), parentId, marker);
}
async function stopOwnedTree(owned) {
    await powerShell(`Add-Type -TypeDefinition 'using System;using System.Runtime.InteropServices;public class OwnedExit { [DllImport("kernel32.dll",SetLastError=true)]public static extern bool GetExitCodeProcess(IntPtr h,out uint c); }'
        $owned = @(([Console]::In.ReadToEnd() | ConvertFrom-Json)); $stopped = @();
        foreach ($row in $owned) {
            $live = Get-Process -Id ([int]$row.pid) -ErrorAction SilentlyContinue
            if ($live) { try {
                if ($live.StartTime.ToUniversalTime().Ticks.ToString() -eq $row.started) {
                    [void]$live.Handle
                    Stop-Process -Id $live.Id -Force -ErrorAction Stop
                    $stopped += $live
                }
            } catch { if (Get-Process -Id ([int]$row.pid) -ErrorAction SilentlyContinue) { throw } } }
        }
        foreach ($live in $stopped) {
            $code = [uint32]259
            if (-not [OwnedExit]::GetExitCodeProcess($live.Handle,[ref]$code) -or $code -eq 259) { throw 'Owned process has no verified termination exit code.' }
            $live.Dispose()
        }`, owned.slice().reverse());
}
async function settledWithin(promise, ms) {
    let timer;
    try { return await Promise.race([promise.then(()=>true), new Promise(resolve=>{timer=setTimeout(()=>resolve(false),ms);})]); }
    finally {clearTimeout(timer);}
}
function wrapOwnedClose(browser, {readTree, stopTree, knownTree=()=>[], closeTransport=async()=>{}, dispose=async()=>{}, timeoutMs=5000}) {
    const close = browser.close.bind(browser);
    let closing;
    browser.close = options => closing ||= (async()=>{
        const failures=[];
        const attempt = fn => Promise.resolve().then(fn).catch(error=>{failures.push(error);});
        try {
            // A failed inventory must not bypass either graceful close channel. A
            // prior capture is still guarded by PID/start time if forcing is needed.
            let owned=[];
            try {owned=await readTree();}
            catch(error) {failures.push(error);try {owned=knownTree();}catch(error){failures.push(error);}}
            // Browser.close disconnects this WS client; the helper owns server.close.
            const graceful = Promise.all([attempt(()=>close(options)),attempt(closeTransport)]);
            if(!await settledWithin(graceful, timeoutMs)) {
                if(!owned.length)throw new Error('No verified owned process snapshot; force cleanup was not attempted.');
                await stopTree(owned);
                if(!await settledWithin(graceful, timeoutMs)) throw new Error('Owned proof transport did not exit after guarded cleanup.');
            }
        } catch(error) {failures.push(error);}
        finally {await attempt(dispose);}
        if(failures.length===1) throw failures[0];
        if(failures.length) throw new AggregateError(failures,'Owned browser close failed; original failures retained.');
    })();
    return browser;
}
async function launchOwnedChromium(chromium, options, platform=process.platform, {readTree=readOwnedTree}={}) {
    if(platform !== 'win32') return chromium.launch(options);
    const marker = markerPrefix + randomUUID();
    const modulePath=Object.values(require.cache).find(module=>module.exports?.chromium===chromium)?.filename;
    if(!modulePath) throw new Error('Cannot resolve the loaded Playwright module for the owned browser transport.');
    const directory=await mkdtemp(path.join(tmpdir(),'yairpg-owned-chrome-'));
    const child=fork(__filename,['--owned-server',marker],{windowsHide:true,stdio:['ignore','ignore','pipe','ipc'],
        env:{...process.env,TEMP:directory,TMP:directory}});
    let stderr='';child.stderr.on('data',chunk=>{stderr=(stderr+chunk).slice(-8192);});
    let exited=false,forcing=false,closedError,finishExit;
    const exit=new Promise(resolve=>{finishExit=resolve;child.once('exit',(code,signal)=>{exited=true;resolve({code,signal});});});
    const ready=new Promise((resolve,reject)=>{
        child.on('message',message=>{
            if(message.type==='ready') resolve(message.endpoint);
            if(message.type==='error') {closedError=new Error(message.message);reject(closedError);}
        });
        child.once('error',error=>{closedError=error;reject(error);});
        exit.then(({code,signal})=>reject(new Error(`Owned browser helper exited before ready (${code ?? signal}): ${stderr}`)));
    });
    let captured;
    const capture=async()=>{
        if(exited) return [];
        const rows=await readTree(marker);
        if(rows[0].pid!==child.pid) throw new Error('Owned browser helper identity mismatch.');
        captured=rows;return rows;
    };
    const debug=message=>{if(process.env.YAIRPG_OWNED_CHROME_DEBUG)console.error(`[owned Chrome ${child.pid}] ${message}`);};
    const dispose=async()=>{
        debug('dispose');if(!exited)throw new Error('Owned browser helper is still alive.');child.stderr.destroy();
        try {await rm(directory,{recursive:true,force:true,maxRetries:0});}
        catch(error) {
            if(error.code!=='EBUSY')throw error;
            // Termination is verified separately. A kernel-held profile lock is residue,
            // not a live transport or an error in the caller's gameplay assertion.
            process.emitWarning(`Terminated owned Chrome left a Windows-locked private profile: ${directory}`,{code:'OWNED_CHROME_PROFILE_BUSY'});
        }
        debug('disposed');
    };
    const force=async rows=>{
        debug('guarded stop');
        forcing=true;
        await stopOwnedTree(rows);
        debug('guarded stop verified');
        // Windows may publish the termination exit code without signalling the process
        // handle, leaving libuv's exit callback pending. Check termination independently.
        // Release only this helper's public IPC/stdio/process handles, never a live browser.
        exited=true;if(child.connected)child.disconnect();child.stderr.destroy();child.unref();finishExit({guarded:true});
    };
    const closeTransport=async()=>{
        debug('graceful close');
        if(!exited&&child.connected)child.send({type:'close'});
        const result=await exit;debug('transport exited');if(closedError)throw closedError;
        if(!forcing&&result.code!==0)throw new Error(`Owned browser helper exited unexpectedly (${result.code ?? result.signal}).`);
    };
    try {
        child.send({type:'launch',modulePath,options:{...options,args:[...(options.args||[]),marker]}});
        const endpoint=await ready;
        await capture();
        const browser=await chromium.connect(endpoint);
        return wrapOwnedClose(browser,{readTree:capture,knownTree:()=>captured||[],stopTree:force,closeTransport,dispose});
    } catch(error) {
        // Startup failures have no returned Browser to own cleanup.
        // No returned Browser owns startup cleanup. Ask the IPC server to close
        // even when capture failed; do not repeat the failed process inventory.
        const cleanup=wrapOwnedClose({close:async()=>{}},{readTree:async()=>captured||[],stopTree:force,closeTransport,dispose,timeoutMs:1000});
        try {await cleanup.close();}
        catch(cleanupError){throw new AggregateError([error,cleanupError],'Owned browser startup and cleanup failed.');}
        throw error;
    }
}
module.exports = {launchOwnedChromium, selectOwnedTree, wrapOwnedClose, stopOwnedTree,readOwnedTree};

if(require.main===module&&process.argv[2]==='--owned-server') {
    let server;
    process.on('message',async message=>{
        try {
            if(message.type==='launch') {
                server=await require(message.modulePath).chromium.launchServer({...message.options,host:'127.0.0.1',port:0});
                process.send({type:'ready',endpoint:server.wsEndpoint()});
            } else if(message.type==='close') {
                await server.close();process.disconnect();
            }
        } catch(error) {
            if(process.connected)process.send({type:'error',message:error.stack||error.message});
            if(!server&&process.connected)process.disconnect();
        }
    });
}

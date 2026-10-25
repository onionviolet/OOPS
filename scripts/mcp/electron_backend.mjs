// Optional native saved-state renderer. Hidden isolated desktop host, no player
// profile, installs, sign-in or text-as-image fallback. No generic evaluate API.
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {existsSync, mkdtempSync, readFileSync, writeFileSync} from 'node:fs';
import {tmpdir, homedir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {ROOT} from './frozen_build.mjs';
const require=createRequire(import.meta.url);
function dependencies() {
    const dependencyRoot=process.env.YAIRPG_MCP_DEPENDENCIES_ROOT || ROOT;
    const executablePath=require(join(dependencyRoot,'node_modules/electron'));
    if(!existsSync(executablePath)) throw Error(`Electron executable missing: ${executablePath}`);
    for(const id of [process.env.YAIRPG_PLAYWRIGHT,'playwright',join(homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')].filter(Boolean)) {
        try {const {_electron}=require(id);if(_electron) return {executablePath,_electron};}
        catch(e) {if(e.code!=='MODULE_NOT_FOUND') throw e;}
    }
    throw Error('Existing Playwright Electron support is unavailable; no installation attempted.');
}
export function electronPreflight() {
    try {const {executablePath}=dependencies();return {available:true,backend:'electron',executablePath,launchVerified:false,mode:'hidden isolated saved-state mirror',viewport:{width:1920,height:1080}};}
    catch(e) {return {available:false,backend:'electron',reason:e.message};}
}
async function captureNative({root=ROOT,save}) {
    const cap=electronPreflight();
    if(!cap.available) throw Error(`Electron screenshot unavailable: ${cap.reason}`);
    const {_electron,executablePath}=dependencies(),work=mkdtempSync(join(tmpdir(),'yairpg-mcp-electron-'));
    let app;
    try {
        app=await _electron.launch({executablePath,args:[root],cwd:root,timeout:30000,
            env:{...process.env,YAIRPG_HIDDEN:'1',YAIRPG_INACTIVE:'0',YAIRPG_USER_DATA:join(work,'profile'),YAIRPG_ROOT:root,YAIRPG_DOWNLOAD_DIR:join(work,'downloads')}});
        const page=await app.firstWindow();
        // Inject the current-format native snapshot before loading the same build.
        // This mirror cannot mutate the worker or the player's saves.
        await page.addInitScript(save=>{localStorage.setItem('save data',JSON.stringify(save));},save);
        await page.reload();
        await page.locator('#loading_screen_play_button').click({timeout:30000});
        await page.waitForTimeout(400);
        await app.evaluate(({BrowserWindow})=>{const w=BrowserWindow.getAllWindows()[0];w.setContentSize(1920,1080);});
        const cdp=await page.context().newCDPSession(page);
        await cdp.send('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
        const {data}=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
        const png=Buffer.from(data,'base64'),path=join(work,'screenshot.png');writeFileSync(path,png);
        if(png.subarray(0,8).toString('hex')!=='89504e470d0a1a0a') throw Error('Electron did not return a PNG.');
        return {backend:'electron-cdp',path,sha256:createHash('sha256').update(readFileSync(path)).digest('hex'),bytes:png.length,
            width:png.readUInt32BE(16),height:png.readUInt32BE(20),source:'native saved-state mirror',
            transientUiRestored:false,note:'Real Electron pixels of this session snapshot on a fresh isolated profile. Transient open panels/selections and exact paused timing are not mirrored. This is not a screenshot of the headless DOM.'};
    } catch(e) {throw Error(`Electron screenshot unavailable or failed: ${e.message}`);}
    finally {if(app) await app.close();}
}


// Contain native launcher failures (including automation-library unhandled
// launch rejections) so they become honest tool errors, not a dead MCP server.
export function captureElectron(args) {
    return new Promise((resolve,reject)=>{
        const frozenHelper=args.root && join(args.root,'scripts/mcp/electron_backend.mjs');
        const helper=frozenHelper && existsSync(frozenHelper) ? frozenHelper : fileURLToPath(import.meta.url);
        const child=spawn(process.execPath,[helper,'--capture'],{stdio:['pipe','pipe','pipe'],env:{...process.env,YAIRPG_MCP_DEPENDENCIES_ROOT:ROOT}});
        let output='',errors='';
        const timer=setTimeout(()=>{child.kill();},90000);
        child.stdout.on('data',b=>{output+=b;});
        child.stderr.on('data',b=>{errors=(errors+b).slice(-2000);});
        child.on('error',e=>{clearTimeout(timer);reject(Error(`Electron screenshot unavailable: ${e.message}`));});
        child.on('close',code=>{
            clearTimeout(timer);
            try {const result=JSON.parse(output);if(code!==0 || result.error) throw Error(result.error || errors);resolve(result);}
            catch(e) {reject(Error(`Electron screenshot unavailable: native helper exited ${code}: ${errors || e.message}`));}
        });
        child.stdin.on('error',()=>{});
        child.stdin.end(JSON.stringify(args));
    });
}
if(process.argv.includes('--capture')) {
    let input='';for await(const chunk of process.stdin) input+=chunk;
    try {process.stdout.write(JSON.stringify(await captureNative(JSON.parse(input)))+'\n');}
    catch(e) {process.stdout.write(JSON.stringify({error:e.message})+'\n');process.exitCode=1;}
}

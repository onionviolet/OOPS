// Optional saved-state renderer for game_screenshot: headless Chrome (the same
// Playwright route as scripts/ui_helpers.cjs) on a throwaway loopback server
// for the session's frozen root. No player profile, installs, sign-in, visible
// window or text-as-image fallback. Replaced the Electron backend on 2026-11-06
// when Electron was removed (AD39).
import http from 'node:http';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {existsSync, mkdtempSync, readFile, readFileSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, normalize, extname} from 'node:path';
import {createHash} from 'node:crypto';
import {ROOT} from './frozen_build.mjs';
const require=createRequire(import.meta.url);
const TYPES={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.webp':'image/webp'};

function dependencies() {
    const helpers=require(join(process.env.YAIRPG_MCP_DEPENDENCIES_ROOT || ROOT,'scripts/ui_helpers.cjs'));
    const executablePath=helpers.chromeExecutable();
    if(!executablePath || !existsSync(executablePath)) throw Error(`Chrome executable missing: ${executablePath}`);
    const {chromium}=helpers.loadPlaywright();
    if(!chromium) throw Error('Existing Playwright Chromium support is unavailable; no installation attempted.');
    return {executablePath,chromium};
}
export function screenshotPreflight() {
    try {const {executablePath}=dependencies();return {available:true,backend:'chromium',executablePath,launchVerified:false,mode:'headless isolated saved-state mirror',viewport:{width:1920,height:1080}};}
    catch(e) {return {available:false,backend:'chromium',reason:e.message};}
}

function serve(root) {
    const server=http.createServer((req,res)=>{
        const rel=normalize(decodeURIComponent(new URL(req.url,'http://x').pathname)).replace(/^[/\\]+/,'') || 'index.html';
        if(rel.split(/[/\\]/).includes('..')) return res.writeHead(403).end();
        readFile(join(root,rel),(err,data)=>{if(err) return res.writeHead(404).end();res.writeHead(200,{'Content-Type':TYPES[extname(rel)]||'application/octet-stream'}).end(data);});
    });
    return new Promise(resolve=>server.listen(0,'127.0.0.1',()=>resolve(server)));
}

async function capture({root=ROOT,save}) {
    const cap=screenshotPreflight();
    if(!cap.available) throw Error(`Screenshot unavailable: ${cap.reason}`);
    const {chromium,executablePath}=dependencies(),work=mkdtempSync(join(tmpdir(),'yairpg-mcp-chromium-'));
    const server=await serve(root);
    let browser;
    try {
        browser=await chromium.launch({headless:true,executablePath});
        const context=await browser.newContext({viewport:{width:1920,height:1080},deviceScaleFactor:1});
        // Inject the current-format native snapshot before the page boots. This
        // mirror cannot mutate the worker or the player's saves.
        await context.addInitScript(save=>{localStorage.setItem('save data',JSON.stringify(save));},save);
        const page=await context.newPage();
        await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
        await page.locator('#loading_screen_play_button').click({timeout:60000});
        await page.waitForTimeout(400);
        const png=await page.screenshot({type:'png'}),path=join(work,'screenshot.png');writeFileSync(path,png);
        if(png.subarray(0,8).toString('hex')!=='89504e470d0a1a0a') throw Error('Chromium did not return a PNG.');
        return {backend:'chromium',path,sha256:createHash('sha256').update(readFileSync(path)).digest('hex'),bytes:png.length,
            width:png.readUInt32BE(16),height:png.readUInt32BE(20),source:'native saved-state mirror',
            transientUiRestored:false,note:'Real Chromium pixels of this session snapshot on a fresh isolated profile. Transient open panels/selections and exact paused timing are not mirrored. This is not a screenshot of the headless DOM.'};
    } catch(e) {throw Error(`Screenshot unavailable or failed: ${e.message}`);}
    finally {if(browser) await browser.close().catch(()=>{});server.close();}
}

// Contain launcher failures (including automation-library unhandled launch
// rejections) so they become honest tool errors, not a dead MCP server.
export function captureScreenshot(args) {
    return new Promise((resolve,reject)=>{
        const frozenHelper=args.root && join(args.root,'scripts/mcp/chromium_backend.mjs');
        const helper=frozenHelper && existsSync(frozenHelper) ? frozenHelper : fileURLToPath(import.meta.url);
        const child=spawn(process.execPath,[helper,'--capture'],{stdio:['pipe','pipe','pipe'],env:{...process.env,YAIRPG_MCP_DEPENDENCIES_ROOT:ROOT}});
        let output='',errors='';
        const timer=setTimeout(()=>{child.kill();},120000);
        child.stdout.on('data',b=>{output+=b;});
        child.stderr.on('data',b=>{errors=(errors+b).slice(-2000);});
        child.on('error',e=>{clearTimeout(timer);reject(Error(`Screenshot unavailable: ${e.message}`));});
        child.on('close',code=>{
            clearTimeout(timer);
            try {const result=JSON.parse(output);if(code!==0 || result.error) throw Error(result.error || errors);resolve(result);}
            catch(e) {reject(Error(`Screenshot unavailable: helper exited ${code}: ${errors || e.message}`));}
        });
        child.stdin.on('error',()=>{});
        child.stdin.end(JSON.stringify(args));
    });
}
if(process.argv.includes('--capture')) {
    let input='';for await(const chunk of process.stdin) input+=chunk;
    try {process.stdout.write(JSON.stringify(await capture(JSON.parse(input)))+'\n');}
    catch(e) {process.stdout.write(JSON.stringify({error:e.message})+'\n');process.exitCode=1;}
}

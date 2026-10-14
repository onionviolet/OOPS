// Each invocation owns a fresh browser context and a unique evidence directory.
// Committed fixtures are immutable prerequisites, never another check's output.
const __p00Fs = require('fs'), __p00Path = require('path');
if (!process.env.URL) throw new Error('Set URL to the served native build origin.');
const __p00Base = new URL(process.env.URL);
if (!/^https?:$/.test(__p00Base.protocol)) throw new Error('URL must use HTTP or HTTPS.');
const __p00URL = __p00Base.href.replace(/\/?$/, '/');
const fixtureDir = __p00Path.join(__dirname, 'fixtures');
const __p00ProofRoot = process.env.YAIRPG_PROOF_DIR || require('os').tmpdir();
__p00Fs.mkdirSync(__p00ProofRoot, {recursive: true});
const __p00OutputDir = __p00Fs.mkdtempSync(__p00Path.join(__p00ProofRoot, __p00Path.basename(__filename, '.cjs') + '-'));
const fs=require('fs'),crypto=require('crypto'),path=require('path');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dir=__p00OutputDir,base=__p00URL;
const R=require(path.resolve('docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs'));
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});const c=await b.newContext({viewport:{width:1366,height:768},acceptDownloads:true});const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
try{
 await p.goto(base);await R.startFresh(p);
 await p.locator('#save_button').click();const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
 await p.reload();await R.startFresh(p);const location=await p.locator('#location_name_span').innerText();
 const served=await p.request.get(base+'dist/bundle.js');const bytes=await served.body();const hash=x=>crypto.createHash('sha256').update(x).digest('hex');const local=fs.readFileSync('dist/bundle.js');if(hash(bytes)!==hash(local))throw Error('Served bundle mismatch');
 await R.unlockCombatRoute(p);await R.enterCombat(p,{fightMs:1200});await p.locator('#save_button').click();
 const combatSave=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
 if(!combatSave.native_encounter||!combatSave.expansion?.streams)throw Error('Native encounter/stream absent');
 await p.reload();await p.locator('#loading_screen_play_button:not(.none_display)').click();await R.waitLocation(p,'Infested field');
 await p.screenshot({path:path.join(dir,'merged-desktop.png')});
 if(errors.length)throw Error(errors.join('; '));
 fs.writeFileSync(path.join(dir,'merged-smoke.json'),JSON.stringify({status:'PASS baseline only; no P00 feature joins',viewport:{width:1366,height:768},location,savedLocation:saved['current location'],nativeCombatRestore:true,encounterKey:combatSave.native_encounter.key,bundleSha256:hash(local),pageErrors:errors},null,2));
}finally{await c.close();await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});

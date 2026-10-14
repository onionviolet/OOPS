const fs=require('fs'),crypto=require('crypto'),path=require('path');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dir=__dirname,base='http://127.0.0.1:18834/';
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

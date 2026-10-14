const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const R=require('../../../vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const base='http://127.0.0.1:18833/';
require('esbuild').buildSync({stdin:{contents:"export * from './src/absorb_p23/save_time_options/backup_undo.js'; export {validateSaveEnvelope} from './src/save_files.js'; export {preflightImport} from './src/import_probe.js';",resolveDir:process.cwd()},bundle:true,format:'esm',platform:'browser',target:'es2022',outfile:path.join(__dirname,'probe.bundle.js')});
(async()=>{
 const browser=await chromium.launch({headless:true,channel:"chrome"});
 try {
 const context=await browser.newContext({viewport:{width:1366,height:768}}), page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 let servedHash;
 page.on('response',async r=>{if(r.status()===200 && r.url().includes('/dist/bundle.js?'))servedHash=crypto.createHash('sha256').update(await r.body()).digest('hex');});
 console.log('native start');await page.goto(base);await R.startFresh(page);console.log('native started');
 await page.locator('#save_button').click();console.log('native saved');
 await page.waitForFunction(()=>!!localStorage.getItem('save data'));
 let original=await page.evaluate(()=>localStorage.getItem('save data'));
 // Native export/download followed by literal file import exercises existing
 // host compatibility only. It does not exercise a native backup/undo join.
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);
 const file=path.join(__dirname,'fresh-native-export.txt');await download.saveAs(file);
 original=await page.evaluate(()=>localStorage.getItem('save data'));
 await page.reload();await R.startFresh(page);
 const reloadSaved=await page.evaluate(()=>localStorage.getItem('save data'));
 assert.equal(reloadSaved,original);
 await Promise.all([page.waitForEvent('load',{timeout:70000}),page.locator('#saved_file_input').setInputFiles(file)]);
 await R.startFresh(page);
 await page.screenshot({path:path.join(__dirname,'desktop.png')});
 // Probe mode disables the running host's clock/autosave; snapshots belong
 // to this disposable context, and preflight iframes still use the real loader.
 await page.goto(base+'?import_probe=p15-isolated-module');
 console.log('module probe');const result=await page.evaluate(async()=>{
   const {createBackupUndo,validateSaveEnvelope,preflightImport}=await import('/docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-save-time-options/probe.bundle.js');
   const original=localStorage.getItem('save data'), first=JSON.parse(original);
   const version=first['game version'];
   const before=Object.fromEntries(Object.entries(localStorage));
   // Isolated module probe with the native iframe preflight. Native backup
   // controls/publication still require P00 and are not exercised here.
   const store=createBackupUndo({storage:localStorage,release:'live',currentVersion:version,
     ownsSave:()=>true,preflight:preflightImport});
   await store.capture(original);
   const second=structuredClone(first);second.character.name='Disposable backup probe';
   await store.capture(JSON.stringify(second));
   const undo=await store.undo();
   if(undo.current!==original)throw Error('undo mismatch');
   for(const [k,v] of Object.entries(before))if(localStorage.getItem(k)!==v)throw Error('legacy changed '+k);
   const prior=localStorage.getItem(store.key);
   const broken={getItem:k=>localStorage.getItem(k),get length(){return localStorage.length;},
     key:i=>localStorage.key(i),setItem:()=>{throw new DOMException('full','QuotaExceededError');}};
   const failed=createBackupUndo({storage:broken,release:'live',currentVersion:version,
     ownsSave:()=>true,preflight:()=>{}});
   try{await failed.undo();throw Error('expected quota rejection');}catch(e){if(e.code!=='SAVE_STORAGE_FULL')throw e;}
   if(localStorage.getItem(store.key)!==prior)throw Error('abort changed journal');
   const unsupported=structuredClone(first);unsupported.fork_schema=999;
   try{await store.capture(JSON.stringify(unsupported));throw Error('expected schema rejection');}catch(e){if(!/schema/.test(e.message))throw e;}
   return {undoExact:true,abortPreserved:true,unsupportedRejected:true,legacyKeysPreserved:true,revision:store.read().revision};
 });
 await page.reload();
 const durable=await page.evaluate(()=>JSON.parse(localStorage.getItem('yairpg:p23:backup-undo:1:live')).revision);
 assert.equal(durable,3);
 assert.deepEqual(errors,[]);
 const localHash=crypto.createHash('sha256').update(fs.readFileSync('dist/bundle.js')).digest('hex');
 assert.equal(servedHash,localHash);
 fs.writeFileSync(path.join(__dirname,'browser.json'),JSON.stringify({origin:base,probeBundleHash:crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'probe.bundle.js'))).digest('hex'),viewport:{width:1366,height:768},servedHash,
   baselineNative:{save:true,reloadExact:true,exportDownload:true,literalFileImportReloadVerified:true,pageErrors:errors},
   moduleProbe:{...result,reloadDurable:true,preflight:'native iframe loader; native backup controls/publication OPEN'},
   changedNativeLoop:'OPEN: no P00 integration'},null,2));
 console.log(JSON.stringify({result,servedHash,durable,errors}));await context.close();
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

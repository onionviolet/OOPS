// Natural wall-clock smoke, with the shipped HackTimer worker unchanged.
// Argument is a disposable pending export from browser.cjs, never a personal save.
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{pathToFileURL}=require('url');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const {decodeSaveFile}=await import(pathToFileURL(path.resolve(__dirname,'../../../../src/save_files.js')));
 const incoming=decodeSaveFile(fs.readFileSync(process.argv[2],'utf8'),'v0.6'),id='feature_objects.dry_shade',claim='feature_objects.collect_drying_sap';
 const previous=incoming.expansion.actors.player.completed[id]||0;
 assert(incoming.expansion.simulation.jobs.some(j=>j.commandId===id));
 const browser=await chromium.launch({headless:true,channel:'chrome'});try{
 const p=await browser.newPage({viewport:{width:1366,height:768}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8201/style.css');await p.evaluate(s=>localStorage.setItem('save data',s),JSON.stringify(incoming));
 await p.goto('http://127.0.0.1:8201/',{waitUntil:'domcontentloaded'});await p.locator('#loading_screen_play_button').click({noWaitAfter:true});
 await p.waitForFunction(([id,previous])=>{const state=JSON.parse(localStorage.getItem('save data'));return state.expansion.actors.player.completed[id]===previous+1;},[id,previous],{timeout:45000});
 await p.locator('#save_button').click({noWaitAfter:true});const save=JSON.parse(await p.evaluate(()=>localStorage.getItem('save data')));
 assert.equal(save.expansion.actors.player.completed[id],previous+1);assert.equal(save.expansion.actors.player.completed[claim]||0,incoming.expansion.actors.player.completed[claim]||0);
 assert(!save.expansion.simulation.jobs.some(j=>j.commandId===id));assert.deepEqual(errors,[]);
 const result={timer:'Unmodified shipped HackTimer worker, natural wall time; no virtual clock or timer route override.',beforeClock:incoming.expansion.clock,afterClock:save.expansion.clock,beforeCompleted:previous,afterCompleted:save.expansion.actors.player.completed[id],rewardClaims:save.expansion.actors.player.completed[claim]||0,pageErrors:errors};
 fs.writeFileSync(path.join(__dirname,'worker-results.json'),JSON.stringify(result,null,2)+'\n');console.log('PASS shipped worker pending resume',JSON.stringify(result));
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});

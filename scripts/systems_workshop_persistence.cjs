// Reopen earned native state, then exercise the actual Export and Import controls.
const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const URL=process.env.YAIRPG_PROOF_URL||'http://127.0.0.1:18701/',OUT=process.env.YAIRPG_PROOF_DIR||'/tmp/systems-workshop-proof';
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const c=await b.newContext({viewport:{width:1366,height:768}}),fixture=JSON.parse(fs.readFileSync(OUT+'/natural-final-save.json'));await c.addInitScript(d=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(d));},fixture);
 const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));const play=async()=>{await p.getByText('PLAY',{exact:true}).click();if(new globalThis.URL(URL).searchParams.get('test_hooks')==='1'){await p.waitForFunction(()=>typeof simulationTestHooks==='object');await p.evaluate(()=>simulationTestHooks.pause());}};await p.goto(URL);await play();
 const save=async()=>{await p.evaluate(()=>window.saveProgress());return p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
 const exact=s=>{assert.deepEqual(s.expansion.actors,fixture.expansion.actors);for(const k of ['owners','knowledge','claims','titles','seed'])assert.deepEqual(s.expansion.simulation[k],fixture.expansion.simulation[k]);assert.deepEqual(s.inventories,fixture.inventories);assert.equal(s.character.money,fixture.character.money);};
 exact(await save());await p.reload();await play();exact(await save());
 const dp=p.waitForEvent('download');await p.locator('#save_to_file_button').click();await (await dp).saveAs(OUT+'/native-export.txt');
 const loaded=p.waitForEvent('load');await p.locator('#saved_file_input').setInputFiles(OUT+'/native-export.txt');await loaded;await play();exact(await save());assert.deepEqual(errors,[]);
 // Mount native panels only after the exact paused persistence comparisons.
 if(new globalThis.URL(URL).searchParams.get('test_hooks')==='1')await p.evaluate(()=>advanceTicks(1));
 await p.locator('#systems_workshop_panel').evaluate(n=>{n.open=true;n.scrollIntoView({block:'start'});});await p.screenshot({path:OUT+'/desktop-workshop-1366x768.png'});
 fs.writeFileSync(OUT+'/PERSISTENCE_PROOF.json',JSON.stringify({viewport:[1366,768],checks:['exact earned workshop reload','actual native Export download','actual file-input Import preserves all actors, custody, knowledge, grants, RNG, inventory and purse'],errors},null,2));console.log('native export/reload/import passed');
 }finally{await b.close();}})();

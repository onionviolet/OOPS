// DWF101/DWF102 browser proof. Derived from the S1 brew script (lane B). Headless Chrome, own static server on a never-used port, fresh origin, ?lotm_probe=1&test_hooks=1.
//   node docs/gm/dispatch/potion-pathways-2026-10-24/s1-brew-browser.cjs journey            (rebuilt bundle of this checkout)
//   ROOT=<dir of an older build> node ... oldsave                                          (writes evidence/s1-old-probe-save.json)
//   node ... compat                                                                          (loads that old save on this build)
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const here=__dirname,repo=path.resolve(here,'../../../..'),root=process.env.ROOT?path.resolve(process.env.ROOT):repo;
const {launchChrome,advanceGameMinutes}=require(path.join(repo,'scripts/ui_helpers.cjs'));
const out=path.join(here,'evidence');fs.mkdirSync(out,{recursive:true});
const mode=process.argv[2]||'journey',types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.map':'application/json'};
const server=http.createServer((req,res)=>{const u=decodeURIComponent(req.url.split('?')[0]),f=path.join(root,u==='/'?'index.html':u);
 if(!f.startsWith(root)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end();}
 res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);});
const sel=t=>`#lotm_panel [data-lotm="${t}"]`;
const btn=(page,t)=>({exists:()=>page.locator(sel(t)).count(),disabled:()=>page.evaluate(s=>document.querySelector(s).disabled,sel(t)),
 wait:()=>page.waitForFunction(s=>document.querySelector(s),sel(t),{polling:200})});
async function click(page,t){const b=btn(page,t);await b.wait();assert.equal(await b.disabled(),false,`${t} is disabled`);await page.evaluate(s=>document.querySelector(s).click(),sel(t));}
const text=page=>page.evaluate(()=>[...document.querySelectorAll('#lotm_panel p, #lotm_panel h3, #lotm_panel summary, #lotm_panel button, #lotm_panel [data-panel-row] span')].map(e=>e.textContent).join('\n'));
const snap=page=>page.evaluate(()=>simulationTestHooks.snapshot());
const player=async page=>{const s=await snap(page),a=s.expansion.actors.player;return {money:s.character.money,facts:Object.fromEntries(Object.entries(a.facts).filter(([k])=>k.startsWith('book.lotm.cc.'))),inv:s.inventories?.person?.main_character||{},sources:Object.keys(a.sources||{}),clock:s.expansion.clock,note:s.expansion.simulation.knowledge.player['book.lotm.brew.cc.started']};};
const go=async(page,key)=>{await click(page,`lotm.move.${key}`);await advanceGameMinutes(page,36);};
async function persist(page){await page.evaluate(()=>window.saveProgress&&window.saveProgress());return page.evaluate(()=>localStorage.getItem('save data'));}
async function boot(page,url){await page.goto(url);await page.getByText('PLAY',{exact:true}).click();}
async function replay(page,url){await page.reload();await page.getByText('PLAY',{exact:true}).click();await page.waitForFunction(()=>document.querySelector('#lotm_panel'),null,{polling:250});}
async function fund(page,url,amount){await persist(page);await page.evaluate(n=>{const d=JSON.parse(localStorage.getItem('save data'));d.character.money=n;localStorage.setItem('save data',JSON.stringify(d));},amount);await replay(page,url);}
async function enroll(page){await page.waitForFunction(()=>document.querySelector('#lotm_panel [data-lotm="enroll"]'),null,{polling:250});await click(page,'enroll');}
async function importCheck(page,log,expect){const str=await page.evaluate(()=>window.save_to_file());assert.ok(str&&str.length>1000,'export string');
 await click(page,'lotm.move.lodging');await page.evaluate(s=>window.load_progress(s),str);await page.waitForTimeout(2500);
 await page.waitForFunction(()=>document.querySelector('#lotm_panel'),null,{polling:250});const t=await text(page);for(const e of expect)assert.match(t,e,`after import: ${e}`);
 log.push(`Export string (${str.length} chars) literally imported after walking away: state restored`);await page.getByText('PLAY',{exact:true}).click({timeout:1500}).catch(()=>{});return str;}
async function shots(page,tag,log){const done=[];
 for(const [w,h,px] of [[1920,1080,null],[1536,864,14],[1536,864,21]]){await page.setViewportSize({width:w,height:h});
  await page.evaluate(px=>{for(const k of ['--ui-type-body','--ui-type-small','--ui-type-title','--custom-size'])px?document.documentElement.style.setProperty(k,px+'px'):document.documentElement.style.removeProperty(k);if(px)document.body.style.fontSize=px+'px';else document.body.style.fontSize='';},px);
  await page.evaluate(()=>{const sl=document.querySelector('[aria-label="Other known panels"]');if(sl&&[...sl.options].some(o=>o.value==='lotm')){sl.value='lotm';sl.dispatchEvent(new Event('change',{bubbles:true}));}const n=document.querySelector('#lotm_panel');for(let e=n;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true;(document.querySelector('#lotm_panel [data-lotm-bench] h3')||n)?.scrollIntoView();});
  const file=`dm-${tag}-${w}x${h}${px?'-'+px+'px':''}.png`;await page.screenshot({path:path.join(out,file)});done.push(file);}
 await page.setViewportSize({width:1920,height:1080});await page.evaluate(()=>{document.body.style.fontSize='';for(const k of ['--ui-type-body','--ui-type-small','--ui-type-title','--custom-size'])document.documentElement.style.removeProperty(k);});
 log.push('screenshots: '+done.join(', '));}
const scenarios={
 // Run on the PRE-change bundle: a Corpse Collector brew started and not ready, saved raw from the browser.
 async oldsave({page,url,log}){await enroll(page);await fund(page,url,5000);await click(page,'book.lotm.report_in');await click(page,'book.lotm.buy_formula_cc');
  await go(page,'docks');for(const s of ['pay','verify','settle'])await click(page,`book.lotm.lot_${s}_frog`);await go(page,'workroom');await click(page,'book.lotm.brew_start_cc');
  const raw=await persist(page);fs.writeFileSync(path.join(here,'fixtures','cc-brew-browser-save.json'),raw);log.push(`old-build browser save: CC brew started, not ready (${raw.length} chars)`);},
 async journey({page,url,log}){
  await enroll(page);await fund(page,url,5000);log.push('Nighthawk probationer enrolled; disposable save funded to 5000 pence (browser start money is outside the slice)');
  await click(page,'book.lotm.report_in');let t=await text(page);assert.match(t,/Buy the Corpse Collector formula/);
  await click(page,'book.lotm.buy_formula_cc');let p=await player(page);assert.equal(p.facts['book.lotm.cc.formula'],true);assert.equal(p.money,3800);log.push('formula bought from Hale: 1200 pence, money 3800');
  await go(page,'docks');for(const s of ['pay','verify','settle'])await click(page,`book.lotm.lot_${s}_frog`);p=await player(page);
  assert.equal(p.money,3800-36-12);assert.equal(p.inv['{"id":"Dried black-spotted frog"}']?.count,1);log.push(`frog bought through the broker, money ${p.money}`);
  await go(page,'workroom');t=await text(page);assert.match(t,/dried frog/);
  await shots(page,'before-brew',log);
  await click(page,'book.lotm.brew_start_cc');p=await player(page);assert.equal(p.facts['book.lotm.cc.brew.started'],true);assert.equal(p.inv['{"id":"Dried black-spotted frog"}']?.count||0,0);log.push('brew started: frog consumed, stage recorded');
  assert.equal(await btn(page,'book.lotm.accept_allocation_cc').exists()?await btn(page,'book.lotm.accept_allocation_cc').disabled():true,true,'issued dose closed while a brew stands');
  assert.equal(await btn(page,'book.lotm.brew_collect_cc').disabled(),true,'cannot bottle before the time');
  await persist(page);await replay(page,url);p=await player(page);assert.equal(p.facts['book.lotm.cc.brew.started'],true);assert.ok(p.note);assert.match(await text(page),/Bottle the brewed/);log.push('saved and reloaded mid-brew: stage and start clock survive');
  await advanceGameMinutes(page,60);assert.equal(await btn(page,'book.lotm.brew_collect_cc').disabled(),true,'still brewing at 60 minutes');
  await advanceGameMinutes(page,65);await shots(page,'brew-ready',log);await click(page,'book.lotm.brew_collect_cc');p=await player(page);
  assert.equal(p.inv['{"id":"Tingen prepared Corpse Collector dose"}']?.count,1);assert.equal(p.facts['book.lotm.cc.allocated'],true);t=await text(page);assert.match(t,/prepared Corpse Collector dose|prepared dose/);log.push('brewed dose held: the same Corpse Collector dose item, allocated recorded');
  await click(page,'book.lotm.ingest_cc');p=await player(page);assert.ok(p.sources.includes('book.lotm.corpse_collector'));assert.equal(p.inv['{"id":"Tingen prepared Corpse Collector dose"}']?.count||0,0);log.push('brewed dose drunk through the existing ingest: Corpse Collector source granted');
  await shots(page,'drunk',log);
  await persist(page);await replay(page,url);assert.match(await text(page),/Sequence 9/);p=await player(page);assert.ok(p.sources.includes('book.lotm.corpse_collector'));log.push('save, reload: source and flags kept');
  await importCheck(page,log,[/Sequence 9/,/Corpse Collector pathway/]);p=await player(page);assert.ok(p.sources.includes('book.lotm.corpse_collector'));
  // The file route: Export to a download, then import that exact file through the file input.
  try{const dl=page.waitForEvent('download',{timeout:5000});await page.evaluate(()=>document.querySelector('#save_to_file_button').click());const file=path.join(out,'dm-cc-export.save.txt');await (await dl).saveAs(file);
   await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded',timeout:8000}).catch(()=>{}),page.locator('#saved_file_input').setInputFiles(file)]);
   await page.getByText('PLAY',{exact:true}).click({timeout:3000}).catch(()=>{});await page.waitForFunction(()=>document.querySelector('#lotm_panel'),null,{polling:250});
   assert.match(await text(page),/Sequence 9/);log.push('Export button download re-imported through the file input: state confirmed');}
  catch(e){log.push('FILE ROUTE NOT CONFIRMED: '+String(e.message).split('\n')[0]);}
  },
 async compat({page,url,log}){
  const raw=fs.readFileSync(path.join(here,'fixtures','cc-brew-browser-save.json'),'utf8');
  await page.evaluate(r=>localStorage.setItem('save data',r),raw);await replay(page,url);
  let p=await player(page);assert.equal(p.facts['book.lotm.cc.brew.started'],true);assert.ok(p.note);log.push('old-build CC brew-in-progress save loaded on the new build: stage and start note intact');
  assert.equal(await btn(page,'book.lotm.brew_collect_cc').disabled(),true,'not ready yet');
  await advanceGameMinutes(page,130);await click(page,'book.lotm.brew_collect_cc');p=await player(page);
  assert.equal(p.inv['{"id":"Tingen prepared Corpse Collector dose"}']?.count,1);log.push('old brew finished and bottled on the new build: same Corpse Collector dose held');
  await click(page,'book.lotm.ingest_cc');p=await player(page);assert.ok(p.sources.includes('book.lotm.corpse_collector'));log.push('and drunk through the existing ingest');
  // DWF127 on a pre-change save: the broker has no bench stock yet; the first buy seeds it, then save, reload, import.
  const pick=async id=>{await page.waitForFunction(()=>document.querySelector('#lotm_panel [data-lotm="bench_select"]'),null,{polling:200});await page.evaluate(id=>{const b=document.querySelector('#lotm_panel [data-lotm-bench]');b.open=true;const s=b.querySelector('select');s.value=id;s.dispatchEvent(new Event('change',{bubbles:true}));},id);await page.waitForTimeout(300);};
  let snapOld=await snap(page);assert.equal(snapOld.expansion.actors['book.lotm.broker'].resources['book.lotm.stockRev']??0,0,'the old save carries no stock revision');
  await fund(page,url,20000);await go(page,'docks');await pick('sun_9');await click(page,'book.lotm.bf_buy_sun_9');await click(page,'book.lotm.bf_ing_crystal_sunflower');
  snapOld=await snap(page);assert.equal(snapOld.expansion.actors['book.lotm.broker'].resources['book.lotm.stockRev'],1);assert.equal(snapOld.inventories.person.main_character['{"id":"Crystal sunflower"}']?.count,1);
  log.push('pre-change save: first bench purchase seeded the broker stock (revision 1); formula copy and a Crystal sunflower bought');
  await persist(page);await replay(page,url);snapOld=await snap(page);assert.equal(snapOld.inventories.person.main_character['{"id":"Crystal sunflower"}']?.count,1);assert.equal(snapOld.expansion.actors.player.facts['book.lotm.bf.sun_9.formula'],true);log.push('saved and reloaded: seeded stock, item and formula copy kept');
  await importCheck(page,log,[/Brewing bench/]);snapOld=await snap(page);assert.equal(snapOld.expansion.actors['book.lotm.broker'].resources['book.lotm.stockRev'],1);
  await page.screenshot({path:path.join(out,'dm-compat-old-cc.png')});},
 async bench({page,url,log}){
  const bt=()=>page.evaluate(()=>document.querySelector('#lotm_panel [data-lotm-bench]').innerText);
  const pick=async id=>{await page.waitForFunction(()=>document.querySelector('#lotm_panel [data-lotm="bench_select"]'),null,{polling:200});await page.evaluate(id=>{const b=document.querySelector('#lotm_panel [data-lotm-bench]');b.open=true;const s=b.querySelector('select');s.value=id;s.dispatchEvent(new Event('change',{bubbles:true}));},id);await page.waitForTimeout(300);};
  const inv=async()=>(await snap(page)).inventories?.person?.main_character||{};
  const slugs=['adult_manhar_fish_eyes','horn_black_fish_blood','purified_water','meadow_saffron_essence','ox_tooth_peony_powder','elf_flowers'];
  const DOSE='{"id":"Brewed Spectator dose (Sequence 9)"}';
  await enroll(page);await fund(page,url,40000);log.push('probationer enrolled; disposable save funded to 40000 pence');
  await click(page,'book.lotm.report_in');
  assert.equal(await page.locator('#lotm_panel button[data-lotm^="book.lotm.bf_"]').count(),0,'no bench buttons before a formula is picked');
  assert.ok(await page.locator('#lotm_panel [data-lotm-bench]').count(),'bench section exists');
  await go(page,'docks');await pick('visionary_9');let t=await bt();
  assert.match(t,/Spectator/);assert.match(t,/Canon route/);assert.match(t,/Unknown:|Rite|No rite/);assert.equal(await btn(page,'book.lotm.bf_start_visionary_9').exists(),0,'start is not offered before the formula');
  await click(page,'book.lotm.bf_buy_visionary_9');let p=await snap(page);assert.equal(p.expansion.actors.player.facts['book.lotm.bf.visionary_9.formula'],true);log.push('Spectator formula copy bought at the broker desk (Visionary Seq 9, no Tingen church route)');
  for(const s of slugs)await click(page,`book.lotm.bf_ing_${s}`);
  const h=await inv();assert.equal(Object.keys(h).filter(k=>/Manhar|Horn-black|Purified|Meadow|Ox-tooth|Elf/.test(k)).length,6);log.push('six materials bought from the supplier counter (stock-limited)');
  await go(page,'workroom');await pick('visionary_9');await shots(page,'bench-before',log);
  await click(page,'book.lotm.bf_start_visionary_9');t=await bt();assert.match(t,/Brewing · \d+ min left/);assert.equal(Object.keys(await inv()).filter(k=>/Manhar/.test(k)).length,0,'materials consumed');log.push('brew started, materials consumed, timer shown');
  assert.equal(await btn(page,'book.lotm.bf_start_visionary_9').exists(),0);
  await persist(page);await replay(page,url);await pick('visionary_9');assert.match(await bt(),/Brewing/);log.push('saved and reloaded mid-brew: brewing state and clock kept');
  await importCheck(page,log,[/Brewing bench/]);await pick('visionary_9');assert.match(await bt(),/Brewing/);log.push('export string imported mid-brew: brew still in progress');
  assert.equal(await btn(page,'book.lotm.bf_collect_visionary_9').exists(),1);assert.equal(await btn(page,'book.lotm.bf_collect_visionary_9').disabled(),true,'cannot bottle early');
  await advanceGameMinutes(page,125);await pick('visionary_9');await shots(page,'bench-ready',log);
  await click(page,'book.lotm.bf_collect_visionary_9');assert.equal((await inv())[DOSE]?.count,1);t=await bt();assert.match(t,/You hold 1 Brewed Spectator dose/);assert.match(t,/Not yet written/);
  assert.equal(await page.evaluate(()=>document.querySelector('#lotm_panel [data-lotm="bench_drink"]').disabled),true);log.push('dose bottled and held; Drink is disabled with the honest "not yet written" reason');
  await go(page,'docks');await pick('visionary_9');const m0=(await snap(page)).character.money;await click(page,'book.lotm.bf_sell_visionary_9');
  const s1=await snap(page);assert.ok(s1.character.money>m0);assert.equal((s1.inventories?.person?.main_character||{})[DOSE]?.count||0,0);log.push(`dose sold to the broker: money +${s1.character.money-m0}`);
  await shots(page,'bench-sold',log);
  try{const dl=page.waitForEvent('download',{timeout:5000});await page.evaluate(()=>document.querySelector('#save_to_file_button').click());const file=path.join(out,'dm-bench-export.save.txt');await (await dl).saveAs(file);
   await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded',timeout:8000}).catch(()=>{}),page.locator('#saved_file_input').setInputFiles(file)]);
   await page.getByText('PLAY',{exact:true}).click({timeout:3000}).catch(()=>{});await page.waitForFunction(()=>document.querySelector('#lotm_panel'),null,{polling:250});
   assert.equal(((await snap(page)).expansion.actors.player.resources||{})['book.lotm.bf.visionary_9.sold'],1);log.push('Export button download re-imported through the file input: sold counter kept');}
  catch(e){log.push('FILE ROUTE NOT CONFIRMED: '+String(e.message).split('\n')[0]);}
 },
};

(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port,url=`http://127.0.0.1:${port}/?lotm_probe=1&test_hooks=1`;
 const browser=await launchChrome(),errors=[],log=[];
 try{const context=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true}),page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.stack||String(e)));
  await boot(page,url);await scenarios[mode]({page,url,log});
  const r={mode,root:root===repo?'this checkout':root,port,errors,log};fs.writeFileSync(path.join(out,`dm-${mode}-result.json`),JSON.stringify(r,null,1));console.log(JSON.stringify(r,null,1));if(errors.length)process.exitCode=1;
 }catch(e){console.error(e);console.log(JSON.stringify(log,null,1));process.exitCode=1;}finally{await browser.close().catch(()=>{});server.close();}
})();

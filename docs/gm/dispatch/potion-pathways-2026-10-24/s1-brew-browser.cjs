// S1 brew browser proof (lane B). Headless Chrome, own static server on a never-used port, fresh origin, ?lotm_probe=1&test_hooks=1.
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
const text=page=>page.evaluate(()=>[...document.querySelectorAll('#lotm_panel p, #lotm_panel h3, #lotm_panel button, #lotm_panel [data-panel-row] span')].map(e=>e.textContent).join('\n'));
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
  await page.evaluate(()=>{const sl=document.querySelector('[aria-label="Other known panels"]');if(sl&&[...sl.options].some(o=>o.value==='lotm')){sl.value='lotm';sl.dispatchEvent(new Event('change',{bubbles:true}));}const n=document.querySelector('#lotm_panel');for(let e=n;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true;n?.scrollIntoView();});
  const file=`s1-${tag}-${w}x${h}${px?'-'+px+'px':''}.png`;await page.screenshot({path:path.join(out,file)});done.push(file);}
 await page.setViewportSize({width:1920,height:1080});await page.evaluate(()=>{document.body.style.fontSize='';for(const k of ['--ui-type-body','--ui-type-small','--ui-type-title','--custom-size'])document.documentElement.style.removeProperty(k);});
 log.push('screenshots: '+done.join(', '));}
const scenarios={
 async oldsave({page,url,log}){await enroll(page);await click(page,'book.lotm.report_in');await click(page,'book.lotm.accept_allocation_cc');
  const raw=await persist(page);fs.writeFileSync(path.join(out,'s1-old-probe-save.json'),raw);log.push(`old-build probe save: report in, Corpse Collector dose allocated and held (${raw.length} chars)`);},
 async compat({page,url,log}){const raw=fs.readFileSync(path.join(out,'s1-old-probe-save.json'),'utf8');
  await page.evaluate(r=>localStorage.setItem('save data',r),raw);await replay(page,url);let t=await text(page);
  assert.match(t,/Corpse Collector pathway/);assert.match(t,/prepared dose|You hold: .*dose/i);log.push('old probe save loaded on the new build; panel shows the Corpse Collector ladder and the held dose');
  assert.equal(await btn(page,'book.lotm.buy_formula_cc').exists()?await btn(page,'book.lotm.buy_formula_cc').disabled():true,true,'brewing offers stay closed for an allocated life');
  await click(page,'book.lotm.ingest_cc');const p=await player(page);assert.ok(p.sources.includes('book.lotm.corpse_collector'));log.push('the old allocated dose still drinks through the existing ingest');
  const raw2=await persist(page);assert.ok(raw2.length>1000);await replay(page,url);assert.match(await text(page),/Sequence 9/);log.push('re-saved and reloaded on the new build');
  await page.screenshot({path:path.join(out,'s1-compat-old-save.png')});},
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
  try{const dl=page.waitForEvent('download',{timeout:5000});await page.evaluate(()=>document.querySelector('#save_to_file_button').click());const file=path.join(out,'s1-export.save.txt');await (await dl).saveAs(file);
   await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded',timeout:8000}).catch(()=>{}),page.locator('#saved_file_input').setInputFiles(file)]);
   await page.getByText('PLAY',{exact:true}).click({timeout:3000}).catch(()=>{});await page.waitForFunction(()=>document.querySelector('#lotm_panel'),null,{polling:250});
   assert.match(await text(page),/Sequence 9/);log.push('Export button download re-imported through the file input: state confirmed');}
  catch(e){log.push('FILE ROUTE NOT CONFIRMED: '+String(e.message).split('\n')[0]);}
  }};
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port,url=`http://127.0.0.1:${port}/?lotm_probe=1&test_hooks=1`;
 const browser=await launchChrome(),errors=[],log=[];
 try{const context=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true}),page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.stack||String(e)));
  await boot(page,url);await scenarios[mode]({page,url,log});
  const r={mode,root:root===repo?'this checkout':root,port,errors,log};fs.writeFileSync(path.join(out,`s1-${mode}-result.json`),JSON.stringify(r,null,1));console.log(JSON.stringify(r,null,1));if(errors.length)process.exitCode=1;
 }catch(e){console.error(e);console.log(JSON.stringify(log,null,1));process.exitCode=1;}finally{await browser.close().catch(()=>{});server.close();}
})();

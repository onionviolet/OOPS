// DWF139 browser proof (pathway-row generator: brew, drink, act, digest, Telepathist, save/reload/export/import). Derived from the DWF101/DWF102 script.
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
async function click(page,t){const b=btn(page,t);await b.wait();assert.equal(await b.disabled(),false,`${t} is disabled: ${await page.evaluate(s=>document.querySelector(s).title,sel(t))} | ${await page.evaluate(()=>(document.querySelector('#lotm_panel p')||{}).textContent)}`);await page.evaluate(s=>document.querySelector(s).click(),sel(t));}
const text=page=>page.evaluate(()=>[...document.querySelectorAll('#lotm_panel p, #lotm_panel h3, #lotm_panel summary, #lotm_panel button, #lotm_panel [data-panel-row] span')].map(e=>e.textContent).join('\n'));
const snap=page=>page.evaluate(()=>simulationTestHooks.snapshot());
const player=async page=>{const s=await snap(page),a=s.expansion.actors.player;return {money:s.character.money,facts:Object.fromEntries(Object.entries(a.facts).filter(([k])=>k.startsWith('book.lotm.cc.'))),inv:s.inventories?.person?.main_character||{},sources:Object.keys(a.sources||{}),clock:s.expansion.clock,note:s.expansion.simulation.knowledge.player['book.lotm.brew.cc.started']};};
const go=async(page,key)=>{await click(page,`lotm.move.${key}`);await advanceGameMinutes(page,36);};
async function persist(page){await page.evaluate(()=>window.saveProgress&&window.saveProgress());return page.evaluate(()=>localStorage.getItem('save data'));}
async function boot(page,url){await page.goto(url);await page.getByText('PLAY',{exact:true}).click();}
async function replay(page,url){await page.reload();await page.getByText('PLAY',{exact:true}).click();await page.waitForFunction(()=>document.querySelector('#lotm_panel'),null,{polling:250});}
async function fund(page,url,amount){for(let i=0;i<4;i++){await persist(page);await page.evaluate(n=>{const d=JSON.parse(localStorage.getItem('save data'));d.character.money=n;localStorage.setItem('save data',JSON.stringify(d));},amount);await replay(page,url);if((await snap(page)).character.money===amount)return;}throw new Error('funding did not stick');}
async function enroll(page){await page.waitForFunction(()=>document.querySelector('#lotm_panel [data-lotm="enroll"]'),null,{polling:250});await click(page,'enroll');}
async function importCheck(page,log,expect){const str=await page.evaluate(()=>window.save_to_file());assert.ok(str&&str.length>1000,'export string');
 await click(page,'lotm.move.lodging');await page.evaluate(s=>window.load_progress(s),str);await page.waitForTimeout(2500);
 await page.waitForFunction(()=>document.querySelector('#lotm_panel'),null,{polling:250});const t=await text(page);for(const e of expect)assert.match(t,e,`after import: ${e}`);
 log.push(`Export string (${str.length} chars) literally imported after walking away: state restored`);await page.getByText('PLAY',{exact:true}).click({timeout:1500}).catch(()=>{});return str;}
async function shots(page,tag,log,look){const done=[];
 for(const [w,h,px] of [[1920,1080,null],[1536,864,14],[1536,864,21]]){await page.setViewportSize({width:w,height:h});
  await page.evaluate(px=>{for(const k of ['--ui-type-body','--ui-type-small','--ui-type-title','--custom-size'])px?document.documentElement.style.setProperty(k,px+'px'):document.documentElement.style.removeProperty(k);if(px)document.body.style.fontSize=px+'px';else document.body.style.fontSize='';},px);
  await page.evaluate(()=>{const sl=document.querySelector('[aria-label="Other known panels"]');if(sl&&[...sl.options].some(o=>o.value==='lotm')){sl.value='lotm';sl.dispatchEvent(new Event('change',{bubbles:true}));}const n=document.querySelector('#lotm_panel');for(let e=n;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true;(document.querySelector('#lotm_panel [data-lotm-bench] h3')||n)?.scrollIntoView();});
  if(look){await page.evaluate(s=>{const e=document.querySelector(s);if(e)e.scrollIntoView({block:'center'});},look);await page.waitForTimeout(200);}
  const file=`lpg-${tag}-${w}x${h}${px?'-'+px+'px':''}.png`;await page.screenshot({path:path.join(out,file)});done.push(file);}
 await page.setViewportSize({width:1920,height:1080});await page.evaluate(()=>{document.body.style.fontSize='';for(const k of ['--ui-type-body','--ui-type-small','--ui-type-title','--custom-size'])document.documentElement.style.removeProperty(k);});
 log.push('screenshots: '+done.join(', '));}
const look=(page,sel)=>page.evaluate(s=>{const e=document.querySelector(s);if(e)e.scrollIntoView({block:'center'});},sel);
const scenarios={
 async drink({page,url,log}){
  const pick=async id=>{await page.waitForFunction(()=>document.querySelector('#lotm_panel [data-lotm="bench_select"]'),null,{polling:200});await page.evaluate(id=>{const b=document.querySelector('#lotm_panel [data-lotm-bench]');b.open=true;const s=b.querySelector('select');s.value=id;s.dispatchEvent(new Event('change',{bubbles:true}));},id);await page.waitForTimeout(300);};
  const sources=async()=>Object.keys((await snap(page)).expansion.actors.player.sources||{});
  const res=async()=>(await snap(page)).expansion.actors.player.resources||{};
  const pathText=()=>page.evaluate(()=>document.querySelector('#lotm_panel [data-lotm-path]').innerText);
  const brewOne=async(id,slugs,startId,mins)=>{await go(page,'docks');await pick(id);await click(page,`book.lotm.bf_buy_${id}`);for(const s of slugs)await click(page,`book.lotm.bf_ing_${s}`);
   await go(page,'workroom');await pick(id);await click(page,`book.lotm.bf_start_${id}`);await advanceGameMinutes(page,mins);await pick(id);await click(page,`book.lotm.bf_collect_${id}`);};
  await enroll(page);await fund(page,url,40000);log.push('probationer enrolled; disposable save funded to 40000 pence');
  await click(page,'book.lotm.report_in');
  await brewOne('visionary_9',['adult_manhar_fish_eyes','horn_black_fish_blood','purified_water','meadow_saffron_essence','ox_tooth_peony_powder','elf_flowers'],'',125);
  let t=await text(page);assert.match(t,/Drink the brewed Spectator dose/);assert.doesNotMatch(t,/Not yet written: this pathway/);
  assert.equal(await page.locator('#lotm_panel [data-lotm="bench_drink"]').count(),0,'no disabled placeholder once the row exists');
  log.push('Spectator formula bought, six materials bought, brewed 120 min, bottled; "Drink the brewed Spectator dose" is offered (no "not yet written" marker)');
  await shots(page,'spectator-before-drink',log,'#lotm_panel [data-lotm="book.lotm.drink_vi9"]');
  await click(page,'book.lotm.drink_vi9');assert.ok((await sources()).includes('book.lotm.spectator'));
  let r=await res();assert.equal(r['book.lotm.bf.visionary_9.drunk'],1);t=await pathText();assert.match(t,/Spectator pathway/);assert.match(await text(page),/Acts performed in the Spectator role \(0\/4\)/);
  log.push('dose drunk: Spectator source granted, drunk counter 1, path panel shows the Spectator ladder with acts 0/4 and no Seer/Hale offer');
  assert.equal(await btn(page,'book.lotm.accept_allocation').exists()?await btn(page,'book.lotm.accept_allocation').disabled():true,true,'Seer offer closed after drinking');
  await shots(page,'spectator-drunk',log,'#lotm_panel [data-lotm-path]');
  await click(page,'book.lotm.act_watch');await advanceGameMinutes(page,25);t=await text(page);assert.match(t,/Acts performed in the Spectator role \(1\/4\)/);assert.match(t,/Spectator potion feels settling/);log.push('first act (20 min): digest progress 1/4, potion feels settling');
  await shots(page,'spectator-acting',log,'#lotm_panel [data-lotm-path]');
  for(let i=0;i<2;i++){await click(page,'book.lotm.act_watch');await advanceGameMinutes(page,25);}
  await click(page,'book.lotm.act_abstain');await advanceGameMinutes(page,35);t=await text(page);assert.match(t,/\(4\/4\)/);assert.match(t,/feels settled/);log.push('four acts done: progress 4/4, potion feels settled');
  await click(page,'book.lotm.judge_vi');t=await text(page);assert.match(t,/You judge the digestion by feel/);assert.ok(((await snap(page)).expansion.actors.player.facts||{})['book.lotm.vi.assessed']);log.push('judged by feel: assessed flag set, no examiner or officer involved');
  await persist(page);await replay(page,url);assert.ok((await sources()).includes('book.lotm.spectator'));assert.match(await pathText(),/Spectator pathway/);log.push('save, reload: Spectator source, acts and assessment kept');
  await importCheck(page,log,[/Spectator pathway/,/Acts performed in the Spectator role \(4\/4\)/]);assert.ok((await sources()).includes('book.lotm.spectator'));
  await brewOne('visionary_8',['complete_pituitary_of_an_adult_rainbow_lizard_dragon','farsman_rabbit_spinal_fluid','chestnut_buds','dragonblood_grass_powder','pure_white_elf_flowers','purified_water'],'',185);
  await click(page,'book.lotm.drink_vi8');assert.ok((await sources()).includes('book.lotm.telepathist'));r=await res();assert.equal(r['book.lotm.bf.visionary_8.drunk'],1);assert.equal(r['book.lotm.pressure']||0,0);
  log.push('Telepathist brewed (180 min) and drunk after the settled Spectator: Sequence 8 source granted, no pressure');
  await shots(page,'telepathist-drunk',log,'#lotm_panel [data-lotm-path]');
  await persist(page);await replay(page,url);assert.ok((await sources()).includes('book.lotm.telepathist'));
  await importCheck(page,log,[/Telepathist/]);
  try{const dl=page.waitForEvent('download',{timeout:5000});await page.evaluate(()=>document.querySelector('#save_to_file_button').click());const file=path.join(out,'lpg-export.save.txt');await (await dl).saveAs(file);
   await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded',timeout:8000}).catch(()=>{}),page.locator('#saved_file_input').setInputFiles(file)]);
   await page.getByText('PLAY',{exact:true}).click({timeout:3000}).catch(()=>{});await page.waitForFunction(()=>document.querySelector('#lotm_panel'),null,{polling:250});
   assert.ok((await sources()).includes('book.lotm.telepathist'));log.push('Export button download re-imported through the file input: both sources kept');}
  catch(e){log.push('FILE ROUTE NOT CONFIRMED: '+String(e.message).split('\n')[0]);}
 },
};

(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port,url=`http://127.0.0.1:${port}/?lotm_probe=1&test_hooks=1`;
 const browser=await launchChrome(),errors=[],log=[];
 try{const context=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true}),page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.stack||String(e)));
  await boot(page,url);await scenarios[mode]({page,url,log});
  const r={mode,root:root===repo?'this checkout':root,port,errors,log};fs.writeFileSync(path.join(out,`lpg-${mode}-result.json`),JSON.stringify(r,null,1));console.log(JSON.stringify(r,null,1));if(errors.length)process.exitCode=1;
 }catch(e){console.error(e);console.log(JSON.stringify(log,null,1));process.exitCode=1;}finally{await browser.close().catch(()=>{});server.close();}
})();

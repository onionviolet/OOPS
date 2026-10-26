// DWF160/DWF162 browser proof (rites graded, merit and sect contribution earned then spent). Headless Chrome, own static server on a never-used port, fresh origin.
//   node docs/gm/dispatch/ritual-contribution-2026-10-25/browser.cjs rites | merit | sect      (rebuilt bundle of this checkout; evidence/rc-<mode>-result.json)
// Derived from docs/gm/dispatch/dose-mechanism-2026-10-25/browser.cjs (helpers copied).

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
  await page.evaluate(()=>{const sl=document.querySelector('[aria-label="Other known panels"]');const pid=document.querySelector('#primordial_credit_panel')||[...(sl?sl.options:[])].some(o=>o.value==='primordial_credit')?'primordial_credit':'lotm';if(sl&&[...sl.options].some(o=>o.value===pid)){sl.value=pid;sl.dispatchEvent(new Event('change',{bubbles:true}));}const n=document.querySelector('#lotm_panel');for(let e=n;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true;(document.querySelector('#lotm_panel [data-lotm-rite]')||document.querySelector('#lotm_panel [data-lotm-merit]')||document.querySelector('#primordial_credit_panel [data-primordial-hall-balance]')||document.querySelector('#lotm_panel [data-lotm-bench] h3')||n)?.scrollIntoView();});
  const file=`rc-${tag}-${w}x${h}${px?'-'+px+'px':''}.png`;await page.screenshot({path:path.join(out,file)});done.push(file);}
 await page.setViewportSize({width:1920,height:1080});await page.evaluate(()=>{document.body.style.fontSize='';for(const k of ['--ui-type-body','--ui-type-small','--ui-type-title','--custom-size'])document.documentElement.style.removeProperty(k);});
 log.push('screenshots: '+done.join(', '));}

const riteGrade=page=>page.evaluate(()=>document.querySelector('#lotm_panel [data-lotm-rite]')?.dataset.lotmRite||null);
const riteText=page=>page.evaluate(()=>document.querySelector('#lotm_panel [data-lotm-rite]')?.innerText||'');
const pick=async(page,id)=>{await page.waitForFunction(()=>document.querySelector('#lotm_panel [data-lotm="bench_select"]'),null,{polling:200});await page.evaluate(id=>{const b=document.querySelector('#lotm_panel [data-lotm-bench]');b.open=true;const s=b.querySelector('select');s.value=id;s.dispatchEvent(new Event('change',{bubbles:true}));},id);await page.waitForTimeout(300);};
const scenarios={
 async rites({page,url,log}){
  await enroll(page);await fund(page,url,300000);await click(page,'book.lotm.report_in');log.push('Nighthawk probationer enrolled and reported in; disposable save funded to 300000 pence');
  await go(page,'docks');await pick(page,'sun_5');assert.equal(await riteGrade(page),'absent');let t=await riteText(page);assert.match(t,/90 percent/);assert.match(t,/preview/);log.push('Sun 5 Priest of Light: absent, stated odds 90 percent, labelled a preview (Seq 5 doses cannot be drunk yet)');
  await shots(page,'sun5-absent',log);
  await click(page,'book.lotm.rit_buy_ice');await go(page,'lodging');await pick(page,'sun_5');assert.equal(await riteGrade(page),'substituted');t=await riteText(page);assert.match(t,/ordinary ice/);assert.match(t,/shuttered lodging/);log.push('after ordinary ice, at the shuttered lodging: substituted (ice fit 0.5, room fit 0.5), odds '+(t.match(/odds (\d+)/)||[])[1]);
  await shots(page,'sun5-substituted',log);
  await go(page,'docks');await click(page,'book.lotm.rit_buy_canvas');await click(page,'book.lotm.rit_buy_nonmelting');await pick(page,'sun_5');assert.equal(await riteGrade(page),'met');t=await riteText(page);assert.match(t,/odds 5 percent/);log.push('after blackout canvas and non-melting ice: met, odds 5 percent');
  await shots(page,'sun5-met',log);
  await persist(page);await replay(page,url);await pick(page,'sun_5');assert.equal(await riteGrade(page),'met');log.push('saved and reloaded: Sun 5 still met (holdings kept)');
  await importCheck(page,log,[/Brewing bench/]);await pick(page,'sun_5');assert.equal(await riteGrade(page),'met');log.push('export string imported: Sun 5 still met');
  await go(page,'lodging');await pick(page,'visionary_5');assert.equal(await riteGrade(page),'absent');
  await click(page,'book.lotm.rit_messenger_pact');await click(page,'book.lotm.rit_stir_joy');await advanceGameMinutes(page,12);await pick(page,'visionary_5');assert.equal(await riteGrade(page),'substituted');t=await riteText(page);assert.match(t,/messenger/);log.push('Visionary 5 Dreamwalker: absent, then substituted (messenger pact feather + joy), odds '+(t.match(/odds (\d+)/)||[])[1]);
  await shots(page,'vis5-substituted',log);
  await click(page,'book.lotm.rit_harpy_contract');await pick(page,'visionary_5');assert.equal(await riteGrade(page),'met');log.push('after the harpy contract and its tail feather: met, odds 5 percent');
  await advanceGameMinutes(page,70);await pick(page,'visionary_5');assert.equal(await riteGrade(page),'partial');log.push('an hour later the feeling has faded: partial (creature met, feeling absent)');
  await click(page,'book.lotm.rit_stir_anger');await advanceGameMinutes(page,12);await pick(page,'visionary_5');assert.equal(await riteGrade(page),'met');await shots(page,'vis5-met',log);log.push('anger stirred again: met');
  await persist(page);await replay(page,url);await pick(page,'visionary_5');assert.equal(await riteGrade(page),'met');log.push('saved and reloaded within the hour: Visionary 5 still met (timed note kept)');
 },
 async merit({page,url,log}){
  const bal=()=>page.evaluate(()=>Number(document.querySelector('#lotm_panel [data-lotm-merit-balance]')?.dataset.lotmMeritBalance));
  await enroll(page);await fund(page,url,5000);await click(page,'book.lotm.report_in');assert.equal(await bal(),0);log.push('Nighthawk probationer reported in; merit 0');
  assert.equal(await btn(page,'book.lotm.merit_buy_sun_8_sheet').disabled(),true);const why=await page.evaluate(s=>document.querySelector(s).title,sel('book.lotm.merit_buy_sun_8_sheet'));assert.match(why,/costs 8 merit/);log.push('formula copy disabled with its reason: '+why);
  await shots(page,'merit-start',log);
  await click(page,'book.lotm.merit_case_file_copy');assert.equal(await bal(),0);await advanceGameMinutes(page,35);assert.equal(await bal(),1);log.push('file copy (30 min) paid 1 merit only after the time passed');
  for(let i=0;i<6;i++){await click(page,'book.lotm.merit_cold_room_watch');await advanceGameMinutes(page,65);}assert.equal(await bal(),13);log.push('six night watches (60 min each): merit 13');
  await persist(page);await replay(page,url);assert.equal(await bal(),13);log.push('saved and reloaded: merit 13 kept');
  await click(page,'book.lotm.merit_buy_sun_8_sheet');assert.equal(await bal(),5);let p=await snap(page);assert.equal(p.expansion.actors.player.facts['book.lotm.bf.sun_8.formula'],true);log.push('8 merit bought the Sequence 8 formula copy: merit 5, formula held');
  await click(page,'book.lotm.merit_buy_sunflower_lot');assert.equal(await bal(),2);assert.ok(Object.keys((p=await snap(page)).inventories?.person?.main_character||{}).some(k=>/Crystal sunflower/.test(k)));log.push('3 merit bought a lot of crystal sunflower: merit 2');
  assert.equal(await btn(page,'book.lotm.merit_buy_sunflower_lot').disabled(),true,'cannot afford a second lot');
  await shots(page,'merit-spent',log);
  await importCheck(page,log,[/Brewing bench/]);assert.equal(await bal(),2);log.push('export string imported: merit 2 and purchases kept');
 },

 async sect({page,url,log}){
  const show=()=>page.evaluate(()=>{const sl=document.querySelector('[aria-label="Other known panels"]');if(sl&&[...sl.options].some(o=>o.value==='primordial_credit')){sl.value='primordial_credit';sl.dispatchEvent(new Event('change',{bubbles:true}));}for(let e=document.querySelector('#primordial_credit_panel');e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true;});
  const q=s=>page.evaluate(s=>document.querySelector(s)?.innerText||'',s);
  const cp=async()=>{await show();await page.waitForFunction(()=>document.querySelector('[data-primordial-hall-balance]'),null,{polling:200});return Number(await page.evaluate(()=>document.querySelector('[data-primordial-hall-balance]').dataset.primordialHallBalance));};
  const pclick=async s=>{await show();await page.waitForFunction(s=>{const b=document.querySelector(s);return b&&!b.disabled;},s,{polling:200});await page.evaluate(s=>document.querySelector(s).click(),s);};
  const dis=async s=>{await show();return page.evaluate(s=>({disabled:document.querySelector(s).disabled,title:document.querySelector(s).title}),s);};
  assert.equal(await cp(),0);log.push('Sect Library panel opened (?primordial_probe=1); CP in hand 0');
  let r=await dis('[data-primordial-buy="fire_grass"]');assert.equal(r.disabled,true);assert.match(r.title,/costs 8 CP; you hold 0/);log.push('fire grass disabled with its reason: '+r.title);
  r=await dis('[data-primordial-buy="killing_life_curse"]');assert.match(r.title,/costs 300 CP/);
  await shots(page,'sect-start',log);
  for(let i=0;i<2;i++){await pclick('[data-primordial-start-task]');await advanceGameMinutes(page,490);log.push(`shelving mission ${i+1} done; CP ${await cp()}`);await advanceGameMinutes(page,1000);}
  assert.equal(await cp(),8);
  await persist(page);await replay(page,url);assert.equal(await cp(),8);log.push('saved and reloaded: CP 8 kept');
  await pclick('[data-primordial-buy="fire_grass"]');assert.equal(await cp(),0);assert.match(await q('[data-primordial-hall-held]'),/Fire grass, a pill ingredient x1/);log.push('8 CP bought fire grass (a pill ingredient): CP 0, hall record shows it');
  r=await dis('[data-primordial-buy="fire_grass"]');assert.equal(r.disabled,true);
  await shots(page,'sect-spent',log);
  await persist(page);await replay(page,url);assert.match(await q('[data-primordial-hall-held]'),/Fire grass, a pill ingredient x1/);assert.equal(await cp(),0);log.push('saved and reloaded: purchase and CP kept');
  const str=await page.evaluate(()=>window.save_to_file());assert.ok(str&&str.length>1000);await page.evaluate(s=>window.load_progress(s),str);await page.waitForTimeout(2500);await page.getByText('PLAY',{exact:true}).click({timeout:1500}).catch(()=>{});
  assert.match(await q('[data-primordial-hall-held]'),/Fire grass, a pill ingredient x1/);log.push(`export string (${str.length} chars) imported: purchase kept`);
 },

};
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port,url=`http://127.0.0.1:${port}/?${mode==='sect'?'primordial_probe=1':'lotm_probe=1'}&test_hooks=1`;
 const browser=await launchChrome(),errors=[],log=[];
 try{const context=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true}),page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.stack||String(e)));
  await boot(page,url);await scenarios[mode]({page,url,log});
  const r={mode,root:root===repo?'this checkout':root,port,errors,log};fs.writeFileSync(path.join(out,`rc-${mode}-result.json`),JSON.stringify(r,null,1));console.log(JSON.stringify(r,null,1));if(errors.length)process.exitCode=1;
 }catch(e){console.error(e);console.log(JSON.stringify(log,null,1));process.exitCode=1;}finally{await browser.close().catch(()=>{});server.close();}
})();

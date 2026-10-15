// Bounded synthetic baseline. Profiling does not change runtime save policy.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {performance}=require('node:perf_hooks');
const {chromium}=(()=>{for(const c of [process.env.YAIRPG_PLAYWRIGHT,'playwright',path.join(require('node:os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')].filter(Boolean)){try{return require(c);}catch{}}throw new Error('Playwright not found; set YAIRPG_PLAYWRIGHT.');})();
const {openNotebook}=require('./ui_helpers.cjs');
const url=process.env.YAIRPG_PROOF_URL || 'http://127.0.0.1:18624/';
const out=process.env.YAIRPG_PROFILE_DIR || path.join(require('node:os').tmpdir(),'yairpg-engine-profile');
// Committed synthetic seed (scripts/perf/gen_fixtures.mjs); never a personal save.
const proof=process.env.YAIRPG_PROFILE_SEED || path.join(__dirname,'../tests/fixtures/perf/mid.json');
fs.mkdirSync(out,{recursive:true});
const summary=values=>{
 const s=[...values].sort((a,b)=>a-b);
 return {n:s.length,median:s[Math.floor(s.length/2)],p95:s[Math.min(s.length-1,Math.ceil(s.length*.95)-1)],max:s.at(-1)};
};
const sample=(fn,n=15)=>{const a=[];fn();for(let i=0;i<n;i++){const t=performance.now();fn();a.push(performance.now()-t);}return summary(a);};
const wood=JSON.stringify({id:'Rough wood log'});
(async()=>{
 const engine=await import('../src/expansion_engine.js'),simulation=await import('../src/simulation.js');
 const {expeditionRegistry:registry}=await import('../src/expedition_content.js');
 const saveAPI=await import('../src/save_files.js');
 const seed=JSON.parse(fs.readFileSync(proof,'utf8'));
 const developed=structuredClone(seed),crowded=structuredClone(seed);
 let p={state:crowded.expansion,external:{money:1000},gameplay:{player:{inventory:{[wood]:1000},skills:{},reputation:{}}}};
 p.state.simulation.knowledge.player.workbench={stage:'understood',value:'Generated benchmark qualification',at:p.state.clock,cause:'fixture:qualification'};
 const ctx=()=>({actorId:'player',external:p.external,gameplay:p.gameplay,facts:{location:'Village','village.craftsmanMet':true},vitals:{player:{health:60,max_health:60,stamina:40,max_stamina:40}}});
 for(let i=0;i<64;i++)p=simulation.commitSimulationCommand(p.state,registry,{id:'village.hire_helper'},ctx());
 const active=structuredClone(p);
 p=engine.advanceSimulation(p.state,registry,12,p.external,p.gameplay,{player:ctx()});
 const helpers=Object.entries(p.state.simulation.people).filter(([,v])=>v.definitionId === 'village.route_helper').map(([id])=>id);
 assert.equal(helpers.length,64);assert.ok(helpers.every(id=>p.state.simulation.owners[id][JSON.stringify({id:'Prepared survey kit'})] === 1));
 for(const id of helpers)p=simulation.commitSimulationCommand(p.state,registry,{id:'village.collect_helper'},{...ctx(),targetId:id});
 for(let i=0;i<512;i++){
  const cause='fixture:history:'+i;p.state.simulation.causes[cause]=p.state.clock;
  p.state.simulation.claims['fixture.history_'+i]={owner:'player',status:'settled',cause};
 }
 engine.validateExpansionState(p.state,registry);
 crowded.expansion=p.state;crowded.character.money=p.external.money;
 crowded.inventories.person.main_character=Object.fromEntries(Object.entries(p.gameplay.player.inventory).map(([k,count])=>[k,{count}]));
 // Only registered ordinary template IDs; no equipment/components are guessed.
 const materialIds=[...fs.readFileSync('src/items.js','utf8').matchAll(/item_templates\["([^"]+)"\]\s*=\s*new (?:Material|OtherItem|UsableItem)\(/g)].map(m=>m[1]);
 for(const id of materialIds)crowded.inventories.person.main_character[JSON.stringify({id})] ||= {count:1};
 const chrome=process.env.YAIRPG_CHROME || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(p=>fs.existsSync(p));
 const browser=await chromium.launch({headless:true,...(chrome ? {executablePath:chrome} : {})});
 const report={environment:{node:process.version,browser:await browser.version(),platform:process.platform,arch:process.arch,url,headless:true},
  worldCase:'WE01/WE02 and MoL original three-person learning/workshop contrast; current visitor/field/helper proxies only. No academy world or canonical magic/loop is implemented.',
  browser:[],pure:[],errors:[],warnings:[]};
 let base;
 const open=async fixture=>{
  const context=await browser.newContext({viewport:{width:1500,height:1050}});
  await context.addInitScript(s=>{
   if(s && !localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(s));
   window.profile={writes:[],serializes:[],longTasks:[]};
   const write=Storage.prototype.setItem,stringify=JSON.stringify;
   Storage.prototype.setItem=function(k,v){const t=performance.now();const result=write.call(this,k,v);if(k==='save data')window.profile.writes.push(performance.now()-t);return result;};
   JSON.stringify=function(...args){const t=performance.now(),result=stringify.apply(this,args);if(args[0]?.character && args[0]?.expansion)window.profile.serializes.push(performance.now()-t);return result;};
   if(PerformanceObserver.supportedEntryTypes.includes('longtask'))new PerformanceObserver(list=>window.profile.longTasks.push(...list.getEntries().map(e=>({start:e.startTime,ms:e.duration})))).observe({type:'longtask',buffered:true});
  },fixture);
  const page=await context.newPage();page.setDefaultTimeout(30000);
  page.on('pageerror',e=>report.errors.push(e.stack));page.on('console',m=>{if(['warning','error'].includes(m.type())&&!m.location()?.url?.includes('/private_packs/'))report.warnings.push(m.text());}); // optional gitignored packs 404 by design
  const nav=performance.now();await page.goto(url);const domReadyMs=performance.now()-nav;
  const hydrate=performance.now();await page.getByText('PLAY',{exact:true}).click();
  if(await page.getByText('Confirm',{exact:true}).isVisible())await page.getByText('Confirm',{exact:true}).click();
  await page.waitForFunction(()=>typeof window.saveProgress === 'function');const playReadyMs=performance.now()-hydrate;
  return {context,page,domReadyMs,playReadyMs};
 };
 try{
  for(const [name,fixture] of [['fresh',null],['visitor_and_method',developed],['history_64_helpers_and_inventory',crowded]]){
   const {context,page,domReadyMs,playReadyMs}=await open(fixture);
   await page.evaluate(()=>window.saveProgress());
   if(name==='fresh'){base=await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));}
   else {await openNotebook(page);await page.locator('[data-notebook-view="people"]').click();}
   const cdp=await context.newCDPSession(page);await cdp.send('Performance.enable');
   const memory=async()=>{
    await cdp.send('HeapProfiler.collectGarbage');
    const counters=await cdp.send('Memory.getDOMCounters'),metrics=await cdp.send('Performance.getMetrics');
    return {...counters,heapUsedBytes:metrics.metrics.find(m=>m.name === 'JSHeapUsedSize')?.value};
   };
   const retained=[await memory()],renderMs=[],inputCPU=[],inputPaint=[],commandMs=[];
   for(let cycle=0;cycle<2;cycle++){
    const values=await page.evaluate(async()=>{
     const render=[],cpu=[],paint=[];
     for(let i=0;i<20;i++){
      let t=performance.now();window.update_displayed_character_inventory();render.push(performance.now()-t);
      const control=document.querySelector('#notebook_tab_people:not([hidden]):not(:disabled)') || document.querySelector('#save_button');t=performance.now();
      control?.click();cpu.push(performance.now()-t);
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));paint.push(performance.now()-t);
     }
     return {render,cpu,paint};
    });
    renderMs.push(...values.render);inputCPU.push(...values.cpu);inputPaint.push(...values.paint);retained.push(await memory());
   }
   if(name!=='fresh'){
    await page.locator('#promise_panel').evaluate(n=>{n.open=true;});
    for(let i=0;i<5;i++){
     const duration=await page.evaluate(()=>{
      const pack=document.querySelector('[data-promise-command="promise.pack_brace"]'),cancel=document.querySelector('[data-promise-command="cancel"]');
      const t=performance.now();pack.click();const start=performance.now()-t,after=performance.now();cancel.click();return {start,cancel:performance.now()-after};
     });commandMs.push(duration);
    }
    assert.equal(await page.locator('[data-promise-command="cancel"]').isVisible(),false);
   }
   const frames=await page.evaluate(()=>new Promise(resolve=>{
    const intervals=[];let last,start;
    const tick=t=>{start ??=t;if(last!=null)intervals.push(t-last);last=t;if(t-start>=2200)resolve(intervals);else requestAnimationFrame(tick);};requestAnimationFrame(tick);
   }));
   const live=await page.evaluate(()=>({bytes:new TextEncoder().encode(localStorage.getItem('save data')).length,
    data:window.profile,fingerprint:performance.getEntriesByType('resource').find(e=>e.name.includes('/dist/bundle.js?version='))?.name}));
   const exportSamples=[];
   for(let i=0;i<5;i++)exportSamples.push(await page.evaluate(()=>{const t=performance.now(),s=window.save_to_file();return {ms:performance.now()-t,encodedBytes:new TextEncoder().encode(s).length};}));
   const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
   assert.equal(Object.keys(saved.inventories.person.main_character).length,Object.keys((fixture || base).inventories.person.main_character).length);
   if(name==='history_64_helpers_and_inventory'){assert.equal(Object.keys(saved.expansion.simulation.claims).length,Object.keys(crowded.expansion.simulation.claims).length);assert.equal(saved.expansion.actors.player.completed['village.collect_helper'],64);}
   const importStart=performance.now(),encoded=await page.evaluate(()=>window.save_to_file());
   await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'generated-profile.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);
   await page.getByText('PLAY',{exact:true}).click();const importReloadMs=performance.now()-importStart;
   report.browser.push({name,inputControl:name === "fresh" ? "native Save" : "Notebook People tab",wholeSaveBytes:live.bytes,inventoryKeys:Object.keys(saved.inventories.person.main_character).length,
    actors:Object.keys(saved.expansion.actors).length,knownPeopleRows:await page.locator('[data-known-person]').count(),domReadyMs,playReadyMs,importReloadMs,
    serializationMs:summary(live.data.serializes),localStorageWriteMs:summary(live.data.writes),inventoryRenderMs:summary(renderMs),
    inputCPUms:summary(inputCPU),inputTwoPaintMs:summary(inputPaint),commandStartMs:summary(commandMs.map(d=>d.start)),commandCancelMs:summary(commandMs.map(d=>d.cancel)),
    frameIntervalMs:summary(frames),longTasks:live.data.longTasks,retainedAfterGC:retained,exportMs:summary(exportSamples.map(e=>e.ms)),exportBytes:exportSamples[0].encodedBytes,fingerprint:live.fingerprint});
   fs.writeFileSync(path.join(out,name+'-save.json'),JSON.stringify(saved));await context.close();
  }
 }finally{await browser.close();}
 for(const [name,fixture] of [['fresh',base],['visitor_and_method',developed],['history_64_helpers_and_inventory',crowded]]){
  const bytes=JSON.stringify(fixture);
  report.pure.push({name,bytes:Buffer.byteLength(bytes),serializeMs:sample(()=>JSON.stringify(fixture)),parseMs:sample(()=>JSON.parse(bytes)),
   validateAndHydrateMs:sample(()=>{saveAPI.validateSaveEnvelope(JSON.parse(bytes),'v0.6');engine.loadExpansionState(JSON.parse(bytes).expansion,registry);})});
 }
 const elapsed=[],ticks=[];let last;
 for(let i=0;i<5;i++){
  let t=performance.now();last=engine.advanceSimulation(active.state,registry,12,active.external,active.gameplay);elapsed.push(performance.now()-t);
  t=performance.now();engine.advanceSimulation(active.state,registry,1,active.external,active.gameplay);ticks.push(performance.now()-t);
 }
 const budget=engine.advanceSimulation(active.state,registry,10000,active.external,active.gameplay);
 report.scheduler={actors:helpers.length,twelveMinuteJumpMs:summary(elapsed),oneMinuteTickMs:summary(ticks),remaining:last.remaining,budgetExhausted:last.budgetExhausted,
  pathologicalRequestMinutes:10000,unspentMinutes:budget.remaining,budgetBounded:budget.budgetExhausted};
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.warnings,[]);
 fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({out,browser:report.browser.map(r=>({name:r.name,bytes:r.wholeSaveBytes,serialize:r.serializationMs.median,write:r.localStorageWriteMs.median,inputCPU:r.inputCPUms.p95,commandStart:r.commandStartMs.p95,frame:r.frameIntervalMs.p95,heap:r.retainedAfterGC})),scheduler:report.scheduler},null,2));
})().catch(e=>{console.error(e);process.exit(1);});

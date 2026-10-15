// Audit baseline: phase timings and CDP renderer metrics for one fresh-origin page.
// Read-only against the repo; serves a scratch mirror. Usage: node baseline.cjs <url> <out.json> [idleSec]
const fs=require('node:fs');
const {performance}=require('node:perf_hooks');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const URL=process.argv[2],OUT=process.argv[3],IDLE=+(process.argv[4]||20);
const M=['TaskDuration','ScriptDuration','LayoutDuration','RecalcStyleDuration','LayoutCount','RecalcStyleCount','JSHeapUsedSize','Nodes','JSEventListeners'];
const r={url:URL,idleSec:IDLE,phases:{},windows:{},notes:[]};
const t=async(name,fn)=>{const a=performance.now();const v=await fn();r.phases[name]=+(performance.now()-a).toFixed(1);return v;};
(async()=>{
 const browser=await t('launch',()=>chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}));
 let context,page;
 try{
  context=await t('newContext',()=>browser.newContext({viewport:{width:1366,height:768}}));
  // Instrumentation: count storage writes and bytes. Cheap wrapper; measured as part of the page.
  await context.addInitScript(()=>{const o=Storage.prototype.setItem;window.__ls={n:0,bytes:0,ms:0,keys:{}};Storage.prototype.setItem=function(k,v){const a=performance.now();o.call(this,k,v);const s=window.__ls;s.n++;s.bytes+=String(v).length;s.ms+=performance.now()-a;s.keys[k]=(s.keys[k]||0)+1;};
   window.__lt=[];try{new PerformanceObserver(l=>{for(const e of l.getEntries())window.__lt.push(e.duration);}).observe({type:'longtask',buffered:true});}catch{}});
  page=await t('newPage',()=>context.newPage());
  const cdp=await context.newCDPSession(page);await cdp.send('Performance.enable');
  const metrics=async()=>Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.filter(m=>M.includes(m.name)).map(m=>[m.name,m.value]));
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await t('goto_load',()=>page.goto(URL,{waitUntil:'load'}));
  await t('play_ready',async()=>{await page.getByText('PLAY',{exact:true}).click({noWaitAfter:true});const c=page.getByText('Confirm',{exact:true});if(await c.isVisible().catch(()=>false))await c.click({noWaitAfter:true});await page.waitForFunction(()=>!!localStorage.getItem('save data'),null,{polling:100,timeout:30000}).catch(()=>r.notes.push('no save data within 30s of PLAY'));});
  const win=async(name,sec,during)=>{const m0=await metrics();const ls0=await page.evaluate(()=>({...window.__ls,keys:undefined,lt:window.__lt.length}));const a=performance.now();
   if(during)await during(sec*1000);else await page.waitForTimeout(sec*1000);
   const wall=performance.now()-a,m1=await metrics();const ls1=await page.evaluate(()=>({...window.__ls,keys:window.__ls.keys,lt:window.__lt.length,ltMax:Math.max(0,...window.__lt),saveBytes:(localStorage.getItem('save data')||'').length}));
   const d=k=>m1[k]-m0[k];r.windows[name]={wallMs:+wall.toFixed(0),cpuBusyPct:+(100*d('TaskDuration')*1000/wall).toFixed(1),scriptMs:+(d('ScriptDuration')*1000).toFixed(0),layoutMs:+(d('LayoutDuration')*1000).toFixed(0),styleMs:+(d('RecalcStyleDuration')*1000).toFixed(0),layouts:d('LayoutCount'),styleRecalcs:d('RecalcStyleCount'),heapMB:+(m1.JSHeapUsedSize/1048576).toFixed(1),heapDeltaMB:+(d('JSHeapUsedSize')/1048576).toFixed(2),domNodes:m1.Nodes,listeners:m1.JSEventListeners,storageWrites:ls1.n-ls0.n,storageWriteKB:+((ls1.bytes-ls0.bytes)*2/1024).toFixed(0),storageWriteMs:+(ls1.ms-ls0.ms).toFixed(0),longTasks:ls1.lt-ls0.lt,longTaskMaxMs:+ls1.ltMax.toFixed(0),saveKB:+(ls1.saveBytes*2/1024).toFixed(0),keys:ls1.keys};};
  await win('idle_a',IDLE);
  await win('idle_b',IDLE);
  // Polling cost of the dominant wait idiom: JSON.parse of the save every rAF frame vs every 250 ms.
  const pred=()=>{const s=JSON.parse(localStorage.getItem('save data'));return s&&s.__never===true;};
  await win('poll_raf',IDLE,ms=>page.waitForFunction(pred,null,{timeout:ms}).catch(()=>{}));
  await win('poll_250',IDLE,ms=>page.waitForFunction(pred,null,{timeout:ms,polling:250}).catch(()=>{}));
  // Busy: click the first visible location action, if any, and watch.
  const actions=await page.locator('#location_actions_div button, #location_actions_div .location_action, [data-action]').all();
  let clicked=null;for(const a of actions){if(await a.isVisible().catch(()=>false)){clicked=(await a.innerText().catch(()=>'?')).slice(0,60);await a.click({noWaitAfter:true,timeout:3000}).catch(()=>{clicked+=' (click failed)';});break;}}
  r.busyAction=clicked;await win('busy',IDLE);
  // Save call, screenshots.
  const saves=[];for(let i=0;i<5;i++){saves.push(await page.evaluate(()=>{const a=performance.now();window.saveProgress();return performance.now()-a;}));}
  r.saveProgressMs=saves.map(x=>+x.toFixed(1));
  await t('screenshot_viewport',()=>page.screenshot({path:OUT.replace(/\.json$/,'-vp.png')}));
  await t('screenshot_fullpage',()=>page.screenshot({path:OUT.replace(/\.json$/,'-full.png'),fullPage:true}));
  await t('reload_to_load',()=>page.reload({waitUntil:'load'}));
  r.errors=errors;
  await t('context_close',()=>context.close());context=null;
 }finally{
  if(context)await context.close().catch(()=>{});
  await t('browser_close',()=>browser.close());
  fs.writeFileSync(OUT,JSON.stringify(r,null,1));console.log(JSON.stringify(r,null,1));
 }
})().catch(e=>{console.error(e);process.exitCode=1;});

// Per-checkpoint browser measurements: idle JS-busy, save cost, reload cost, synchronous time-skip drains.
// Usage: node measure.cjs <url> <fixture.json> <out.json> <clock,clock,...>
// Needs a scratch build that exposes window.__progress_time (the repo src is not modified).
const fs=require('node:fs');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const [URL,FIX,OUT]=process.argv.slice(2,5),CLOCKS=process.argv[5].split(',').map(Number);
const M=['TaskDuration','ScriptDuration','LayoutDuration','JSHeapUsedSize','Nodes'];
const res={url:URL,checkpoints:[]};
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const fixture=JSON.parse(fs.readFileSync(FIX,'utf8'));
 const ctx=await browser.newContext({viewport:{width:1366,height:768}});
 await ctx.addInitScript(d=>{
  if(!sessionStorage.getItem('seeded')){localStorage.setItem('save data',JSON.stringify(d));sessionStorage.setItem('seeded','1');}
  window.__lt=[];try{new PerformanceObserver(l=>{for(const e of l.getEntries())window.__lt.push([e.startTime,e.duration]);}).observe({type:'longtask',buffered:true});}catch{}
  const o=Storage.prototype.setItem;window.__ls={n:0,bytes:0,ms:0};Storage.prototype.setItem=function(k,v){const a=performance.now();o.call(this,k,v);window.__ls.n++;window.__ls.bytes+=String(v).length*2;window.__ls.ms+=performance.now()-a;};
 },fixture);
 let page=await ctx.newPage();const errors=[];
 const attach=async p=>{p.on('pageerror',e=>errors.push(e.message));const cdp=await ctx.newCDPSession(p);await cdp.send('Performance.enable');return cdp;};
 let cdp=await attach(page);
 const metrics=async()=>Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.filter(m=>M.includes(m.name)).map(m=>[m.name,m.value]));
 const play=async()=>{await page.getByText('PLAY',{exact:true}).click({noWaitAfter:true});if(await page.getByText('Confirm',{exact:true}).isVisible().catch(()=>false))await page.getByText('Confirm',{exact:true}).click({noWaitAfter:true});await page.waitForFunction(()=>typeof advanceTicks==='function'&&!!window.__progress_time,null,{timeout:60000});};
 const clock=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('save data')).expansion.clock);
 await page.goto(URL);await play();
 for(const target of CLOCKS){
  const cp={target};
  let c=await clock();const t0=Date.now();
  while(c<target){const n=Math.min(500,target-c);await page.evaluate(n=>advanceTicks(n),n);c=await clock();}
  cp.advanceWallS=+((Date.now()-t0)/1000).toFixed(0);cp.clock=c;
  const raw=await page.evaluate(()=>localStorage.getItem('save data'));cp.saveStorageBytes=raw.length*2;
  // saveProgress cost
  cp.saveProgressMs=await page.evaluate(()=>{const r=[];for(let i=0;i<5;i++){const a=performance.now();window.saveProgress();r.push(+(performance.now()-a).toFixed(1));}return r;});
  cp.stringifyParseMs=await page.evaluate(()=>{const r=localStorage.getItem('save data');const a=performance.now();const o=JSON.parse(r);const b=performance.now();JSON.stringify(o);return {parse:+(b-a).toFixed(1),stringify:+(performance.now()-b).toFixed(1)};});
  // idle 20 s on real timers
  await page.waitForTimeout(2000);
  const m0=await metrics(),l0=await page.evaluate(()=>({lt:window.__lt.length,...window.__ls}));const a=Date.now();await page.waitForTimeout(20000);const wall=Date.now()-a;
  const m1=await metrics(),l1=await page.evaluate(()=>({lt:window.__lt.length,...window.__ls,ltMax:Math.max(0,...window.__lt.map(x=>x[1]))}));
  cp.idle={wallMs:wall,busyPct:+(100*(m1.TaskDuration-m0.TaskDuration)*1000/wall).toFixed(1),scriptMs:+((m1.ScriptDuration-m0.ScriptDuration)*1000).toFixed(0),storageWrites:l1.n-l0.n,storageKB:+((l1.bytes-l0.bytes)/1024).toFixed(0),storageMs:+(l1.ms-l0.ms).toFixed(0),longTasks:l1.lt-l0.lt,heapMB:+(m1.JSHeapUsedSize/1048576).toFixed(0),nodes:m1.Nodes};
  // reload at this checkpoint: no wall-clock replay expected; record time and long tasks
  const clockBefore=await clock();
  cp.reload=[];
  for(const hoursAway of [0,8]){
   if(hoursAway){ // age the save's wall time to prove nothing replays: saved_at is only metadata
     await page.evaluate(h=>{const s=JSON.parse(localStorage.getItem('save data'));const d=new Date(Date.now()-h*3600e3);s.saved_at=d.toISOString?d.toISOString():String(d);localStorage.setItem('save data',JSON.stringify(s));},hoursAway);
   }
   await page.evaluate(raw=>{},raw);
   // stop timers from re-saving over the aged copy: reload immediately
   const a=Date.now();await page.reload({waitUntil:'load'});const loadMs=Date.now()-a;
   const b=Date.now();await play();const playMs=Date.now()-b;
   const lt=await page.evaluate(()=>window.__lt.map(x=>x[1]));
   cp.reload.push({hoursAway,loadMs,playReadyMs:playMs,clockAfter:await clock(),clockBefore,longTaskMaxMs:+Math.max(0,...lt).toFixed(0),longTasks:lt.length});
  }
  // synchronous time-skip drains (a long commitment / sleep / travel resolves in one task)
  cp.drain=[];
  for(const hours of [1,8,24,72]){
   await page.evaluate(raw=>localStorage.setItem('save data',raw),raw);await page.reload({waitUntil:'load'});await play();
   const out=await page.evaluate(h=>{const before=JSON.parse(localStorage.getItem('save data')).expansion.clock;const a=performance.now();let err=null;try{window.__progress_time({value:h*60,source:'travel'});}catch(e){err=e.message;}const ms=performance.now()-a;const after=JSON.parse(localStorage.getItem('save data')).expansion.clock;return {ms:+ms.toFixed(0),advanced:after-before,err};},hours);
   out.hours=hours;out.requested=hours*60;cp.drain.push(out);
  }
  // restore the pre-drain save and continue advancing from it
  await page.evaluate(raw=>localStorage.setItem('save data',raw),raw);await page.reload({waitUntil:'load'});await play();
  res.checkpoints.push(cp);fs.writeFileSync(OUT,JSON.stringify({...res,errors},null,1));console.log(JSON.stringify(cp));
 }
 await ctx.close();await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1;});

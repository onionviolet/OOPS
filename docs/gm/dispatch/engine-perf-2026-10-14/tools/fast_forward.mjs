// node ffcheck.mjs <builtDir> <fixture> <N> <singleN> : fastForward(N) vs advanceTicks(N) and vs singleN single ticks; long tasks during the forward.
import fs from 'node:fs';
const W=new URL('../../../../../',import.meta.url).pathname.replace(/\/$/,''); // repo root
const L=await import(W+'/scripts/perf/lib.mjs');
const [DIR,FIX,N='480',SN='60',QS='']=process.argv.slice(2); const fx=fs.readFileSync(FIX,'utf8');
const srv=await L.serve(DIR); const b=await L.launchChrome(); const out={N:+N,singleN:+SN};
const strip=t=>{const s=JSON.parse(t);delete s.saved_at;delete s.total_playtime;return JSON.stringify(s);};
async function page(){const c=await b.newContext({viewport:{width:1366,height:768}});
  await c.addInitScript(d=>{if(!sessionStorage.getItem('s')){localStorage.setItem('save data',d);sessionStorage.setItem('s','1');}window.__lt=[];try{new PerformanceObserver(l=>{for(const e of l.getEntries())window.__lt.push([Math.round(e.startTime),Math.round(e.duration)]);}).observe({type:'longtask',buffered:true});}catch{}},fx);
  const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(srv.url+'?test_hooks=1'+QS,{waitUntil:'load'});
  await p.waitForFunction(()=>window.simulationTestHooks,null,{polling:100});await p.evaluate(()=>window.simulationTestHooks.pause());
  const play=p.getByText('PLAY',{exact:true});await play.waitFor({state:'visible'});await play.click({noWaitAfter:true});await p.waitForTimeout(800);
  const cf=p.getByText('Confirm',{exact:true});if(await cf.isVisible().catch(()=>false))await cf.click({noWaitAfter:true});await p.waitForTimeout(1500);return {c,p,errors};}
const snap=p=>p.evaluate(()=>({save:JSON.stringify(window.simulationTestHooks.snapshot()),stored:localStorage.getItem('save data')}));
try{
  // fastForward(N)
  {const {c,p,errors}=await page(); const r=await p.evaluate(async n=>{const t0=performance.now();window.__lt=[];const res=await window.fastForward(n);const lt=window.__lt.filter(([s])=>s>=t0);return {res,longTasks:lt.length,longTaskMaxMs:Math.max(0,...lt.map(x=>x[1])),lt:lt.slice(0,10)};},+N);
   out.fastForward=r; out.ffErrors=errors; const s=await snap(p); out.ffSave=strip(s.save); out.ffStored=strip(s.stored); await c.close();}
  // advanceTicks(N)
  {const {c,p}=await page(); const r=await p.evaluate(n=>{const t0=performance.now();const res=window.advanceTicks(n);return {res,wallMs:Math.round(performance.now()-t0)};},+N);
   out.advanceTicks=r; const s=await snap(p); out.atSave=strip(s.save); out.atStored=strip(s.stored); await c.close();}
  out.ffEqualsAdvanceTicks=out.ffSave===out.atSave; out.ffStoredEqualsAt=out.ffStored===out.atStored;
  // singleN single ticks vs fastForward(singleN)
  if(+SN>0){
    let a,bb;
    {const {c,p}=await page(); await p.evaluate(n=>{for(let i=0;i<n;i++)window.advanceTicks(1);},+SN); a=strip((await snap(p)).save); await c.close();}
    {const {c,p}=await page(); await p.evaluate(n=>window.fastForward(n),+SN); bb=strip((await snap(p)).save); await c.close();}
    out.ffEqualsSingleTicks=a===bb;
  }
  delete out.ffSave;delete out.atSave;delete out.ffStored;delete out.atStored;
}finally{console.log(JSON.stringify(out,null,1));await b.close();await srv.close();}

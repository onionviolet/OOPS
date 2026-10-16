// node catchup.mjs <builtDir> <fixture> <ticks>: reload with ?catch_up_ticks, long tasks from PLAY to catch-up end, result vs advanceTicks.
import fs from 'node:fs';
const W=new URL('../../../../../',import.meta.url).pathname.replace(/\/$/,''); // repo root
const L=await import(W+'/scripts/perf/lib.mjs');
const [DIR,FIX,N='480']=process.argv.slice(2); const fx=fs.readFileSync(FIX,'utf8');
const srv=await L.serve(DIR); const b=await L.launchChrome(); const out={};
const strip=t=>{const s=JSON.parse(t);delete s.saved_at;delete s.total_playtime;return JSON.stringify(s);};
const mins=t=>((t.day_count*24+t.hour)*60+t.minute);
try{const c=await b.newContext({viewport:{width:1366,height:768}});
 await c.addInitScript(d=>{if(!sessionStorage.getItem('s')){localStorage.setItem('save data',d);sessionStorage.setItem('s','1');}window.__lt=[];try{new PerformanceObserver(l=>{for(const e of l.getEntries())window.__lt.push([Math.round(e.startTime),Math.round(e.duration)]);}).observe({type:'longtask',buffered:true});}catch{}},fx);
 const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 // First visit plays and saves; the reload is the return after hours away.
 await p.goto(srv.url+'?test_hooks=1',{waitUntil:'load'});await p.waitForFunction(()=>window.simulationTestHooks,null,{polling:100});await p.evaluate(()=>window.simulationTestHooks.pause());
 let play=p.getByText('PLAY',{exact:true});await play.waitFor({state:'visible'});await play.click({noWaitAfter:true});await p.waitForTimeout(800);
 let cf=p.getByText('Confirm',{exact:true});if(await cf.isVisible().catch(()=>false))await cf.click({noWaitAfter:true});await p.waitForTimeout(1000);
 const before=await p.evaluate(()=>JSON.stringify(window.simulationTestHooks.snapshot()));
 await p.goto(srv.url+`?test_hooks=1&catch_up_ticks=${N}`,{waitUntil:'load'});
 play=p.getByText('PLAY',{exact:true});await play.waitFor({state:'visible'});
 const t0=await p.evaluate(()=>performance.now());await play.click({noWaitAfter:true});
 await p.waitForTimeout(300);cf=p.getByText('Confirm',{exact:true});if(await cf.isVisible().catch(()=>false))await cf.click({noWaitAfter:true});
 await p.waitForFunction(()=>window.catchUpResult,null,{polling:100});
 const r=await p.evaluate(async t0=>{const res=await window.catchUpResult;window.simulationTestHooks.pause();const lt=window.__lt.filter(([s])=>s>=t0);return {res,longTasks:lt.length,longTaskMaxMs:Math.max(0,...lt.map(x=>x[1])),lt:lt.slice(0,8),save:JSON.stringify(window.simulationTestHooks.snapshot())};},t0);
 out.playAt=t0;out.catchUp=r.res;out.longTasksFromPlay=r.longTasks;out.longTaskMaxMs=r.longTaskMaxMs;out.lt=r.lt;
 out.gameMinutes=mins(JSON.parse(r.save)['current time'])-mins(JSON.parse(before)['current time']);
 out.realTimeFactor=+((r.res.ticks*1000)/r.res.wallMs).toFixed(0);
 out.errors=errors;
}finally{console.log(JSON.stringify(out,null,1));await b.close();await srv.close();}

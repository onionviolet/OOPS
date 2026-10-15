// node reveal.mjs <builtDir> <fixture> <ticks>: hidden-then-revealed page vs always-visible page, same deterministic ticks.
import fs from 'node:fs';
const W=new URL('../../../../../',import.meta.url).pathname.replace(/\/$/,''); // repo root
const L=await import(W+'/scripts/perf/lib.mjs'); const V=await import('./vis.mjs');
const [DIR,FIX,N='30']=process.argv.slice(2); const fx=fs.readFileSync(FIX,'utf8');
const srv=await L.serve(DIR); const b=await L.launchChrome(); const out={};
async function run(hidden){
  const c=await b.newContext({viewport:{width:1366,height:768}}); await c.addInitScript(V.VIS_INIT);
  await c.addInitScript(d=>{if(!sessionStorage.getItem('s')){localStorage.setItem('save data',d);sessionStorage.setItem('s','1');}},fx);
  const p=await c.newPage(); const errors=[]; p.on('pageerror',e=>errors.push(e.message)); p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await p.goto(srv.url+'?test_hooks=1',{waitUntil:'load'});
  await p.waitForFunction(()=>window.simulationTestHooks,null,{polling:100}); await p.evaluate(()=>window.simulationTestHooks.pause());
  const play=p.getByText('PLAY',{exact:true}); await play.waitFor({state:'visible'}); await play.click({noWaitAfter:true});
  await p.waitForTimeout(800); const cf=p.getByText('Confirm',{exact:true}); if(await cf.isVisible().catch(()=>false))await cf.click({noWaitAfter:true});
  await p.waitForTimeout(1500);
  if(hidden) await V.setHidden(p,true);
  const r=await p.evaluate(([n,hidden])=>{const t0=performance.now();const res=window.advanceTicks(n,{render:true});const ms=performance.now()-t0;
    const before=document.getElementById('main_content')?.innerText;
    if(hidden){window.__forceHidden=false;document.dispatchEvent(new Event('visibilitychange'));}
    const text=document.getElementById('main_content').innerText; const save=window.simulationTestHooks.snapshot(); delete save.saved_at; delete save.total_playtime;
    return {res,ms,text,staleBefore:hidden?before!==text:null,save:JSON.stringify(save)};},[+N,hidden]);
  await p.waitForTimeout(300); r.textAfterPolls=await p.evaluate(()=>document.getElementById('main_content').innerText);
  r.errors=errors; await p.screenshot({path:`${process.cwd()}/reveal-${hidden?'hidden':'visible'}.png`}); await c.close(); return r;
}
try{ const v=await run(false), h=await run(true);
  const dl=(a,b)=>{const A=a.split('\n'),B=b.split('\n');const d=[];for(let i=0;i<Math.max(A.length,B.length);i++)if(A[i]!==B[i])d.push([i,A[i],B[i]]);return d;};
  const diff=dl(v.text,h.text);
  console.log(JSON.stringify({ticks:v.res,msVisible:+v.ms.toFixed(0),msHidden:+h.ms.toFixed(0),saveIdentical:v.save===h.save,textIdentical:v.text===h.text,hiddenWasStaleBeforeReveal:h.staleBefore,diffLines:diff.length,diff:diff.slice(0,12),errorsV:v.errors.slice(0,5),errorsH:h.errors.slice(0,5)},null,1));
}finally{await b.close();await srv.close();}

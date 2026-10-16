// node d3check.mjs <builtDir> <fixture|none> : write counts under the dev stepper, kill-and-reload, export/import round trip.
import fs from 'node:fs'; import path from 'node:path';
const W=new URL('../../../../../',import.meta.url).pathname.replace(/\/$/,''); // repo root
const L=await import(W+'/scripts/perf/lib.mjs'); const V=await import('./vis.mjs');
const [DIR,FIX]=process.argv.slice(2); const fx=FIX&&FIX!=='none'?fs.readFileSync(FIX,'utf8'):null;
const strip=t=>{const s=JSON.parse(t);delete s.saved_at;delete s.total_playtime;return JSON.stringify(s);};
const srv=await L.serve(DIR); const b=await L.launchChrome(); const out={};
const ctx=await b.newContext({viewport:{width:1366,height:768},acceptDownloads:true}); await ctx.addInitScript(V.VIS_INIT);
await ctx.addInitScript(d=>{if(d&&!localStorage.getItem('d3-seeded')){localStorage.setItem('save data',d);localStorage.setItem('d3-seeded','1');}
  const o=Storage.prototype.setItem;window.__saves=0;Storage.prototype.setItem=function(k,v){if(k==='save data')window.__saves++;return o.call(this,k,v);};},fx);
const errors=[]; let p;
async function open(){p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(srv.url+'?test_hooks=1',{waitUntil:'load'});
  await p.waitForFunction(()=>window.simulationTestHooks,null,{polling:100});await p.evaluate(()=>window.simulationTestHooks.pause());
  const play=p.getByText('PLAY',{exact:true});await play.waitFor({state:'visible'});await play.click({noWaitAfter:true});
  await p.waitForTimeout(800);const cf=p.getByText('Confirm',{exact:true});if(await cf.isVisible().catch(()=>false))await cf.click({noWaitAfter:true});
  await p.waitForFunction(()=>typeof window.saveProgress==='function'&&!!localStorage.getItem('save data'),null,{polling:250});await p.waitForTimeout(500);}
try{
  await open();
  // 1. Writes per tick and per autosave under the deterministic stepper (one autosave per 60 ticks).
  out.stepper=await p.evaluate(()=>{const w0=window.__saves;const r=window.advanceTicks(120);return {ticks:r.ticks,autosaves:r.autosaves,writes:window.__saves-w0};});
  // 3. Kill and reload: the stored bytes match live state except the counters.
  const live=await p.evaluate(()=>JSON.stringify(window.simulationTestHooks.snapshot()));
  const stored=await p.evaluate(()=>localStorage.getItem('save data'));
  out.storedMatchesLive=strip(live)===strip(stored);
  // Kill: the bytes storage holds now, with no pagehide flush, are all a crash keeps. Reload them in a fresh origin.
  const killCtx=await b.newContext({viewport:{width:1366,height:768}}); await killCtx.addInitScript(d=>{if(!localStorage.getItem('d3-seeded')){localStorage.setItem('save data',d);localStorage.setItem('d3-seeded','1');}},stored);
  const keep=[ctx,p]; let reloaded;
  { const q=await killCtx.newPage(); q.on('pageerror',e=>errors.push(e.message)); await q.goto(srv.url+'?test_hooks=1',{waitUntil:'load'});
    await q.waitForFunction(()=>window.simulationTestHooks,null,{polling:100}); await q.evaluate(()=>window.simulationTestHooks.pause());
    const play=q.getByText('PLAY',{exact:true});await play.waitFor({state:'visible'});await play.click({noWaitAfter:true});
    await q.waitForTimeout(800);const cf=q.getByText('Confirm',{exact:true});if(await cf.isVisible().catch(()=>false))await cf.click({noWaitAfter:true});
    await q.waitForTimeout(1000); reloaded=await q.evaluate(()=>JSON.stringify(window.simulationTestHooks.snapshot())); await killCtx.close(); }
  const a=JSON.parse(strip(live)),r=JSON.parse(strip(reloaded));
  out.killReloadIdentical=strip(live)===strip(reloaded);
  if(!out.killReloadIdentical){const diff=(x,y,pp='',o=[])=>{if(JSON.stringify(x)===JSON.stringify(y))return o;if(x&&y&&typeof x==='object'&&typeof y==='object'){for(const k of new Set([...Object.keys(x),...Object.keys(y)]))diff(x[k],y[k],pp+'/'+k,o);}else o.push(pp);return o;};out.killReloadDiff=diff(a,r).slice(0,20);}
  // 4. Explicit save writes even when unchanged.
  out.explicitSave=await p.evaluate(()=>{const w0=window.__saves;window.saveProgress();window.saveProgress();return window.__saves-w0;});
  // 5. Literal file export through the button, then import through the file input.
  const dl=p.waitForEvent('download'); await p.locator('#save_to_file_button').click(); const file=path.join(process.cwd(),'d3-export.txt'); await (await dl).saveAs(file);
  const beforeImport=await p.evaluate(()=>JSON.stringify(window.simulationTestHooks.snapshot()));
  const loaded=p.waitForEvent('load'); await p.locator('#saved_file_input').setInputFiles(file); await loaded;
  await p.waitForFunction(()=>window.simulationTestHooks,null,{polling:100}); await p.evaluate(()=>window.simulationTestHooks.pause());
  const play=p.getByText('PLAY',{exact:true}); if(await play.isVisible().catch(()=>false)){await play.click({noWaitAfter:true});await p.waitForTimeout(800);const cf=p.getByText('Confirm',{exact:true});if(await cf.isVisible().catch(()=>false))await cf.click({noWaitAfter:true});}
  await p.waitForTimeout(1000); const afterImport=await p.evaluate(()=>JSON.stringify(window.simulationTestHooks.snapshot()));
  const ai=JSON.parse(strip(afterImport)),bi=JSON.parse(strip(beforeImport));
  const diff=(x,y,pp='',o=[])=>{if(JSON.stringify(x)===JSON.stringify(y))return o;if(x&&y&&typeof x==='object'&&typeof y==='object'){for(const k of new Set([...Object.keys(x),...Object.keys(y)]))diff(x[k],y[k],pp+'/'+k,o);}else o.push(pp);return o;};
  out.importDiff=diff(bi,ai).slice(0,20); out.importIdentical=out.importDiff.length===0;
  // 6. Hidden flush: skipped counters reach storage when the tab hides.
  out.flushOnHidden=await p.evaluate(()=>{window.advanceTicks(60);const before=JSON.parse(localStorage.getItem('save data')).total_playtime;const w0=window.__saves;window.__forceHidden=true;document.dispatchEvent(new Event('visibilitychange'));const after=JSON.parse(localStorage.getItem('save data')).total_playtime;window.__forceHidden=false;document.dispatchEvent(new Event('visibilitychange'));return {writes:window.__saves-w0,playtimeBefore:before,playtimeAfter:after};});
}finally{out.errors=errors.slice(0,5);console.log(JSON.stringify(out,null,1));await b.close();await srv.close();}

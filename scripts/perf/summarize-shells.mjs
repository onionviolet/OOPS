import fs from 'node:fs';
const file=process.argv[2]||'work/shell-comparison-20261106/results.json';
const rows=JSON.parse(fs.readFileSync(file));
const median=a=>{a=[...a].sort((x,y)=>x-y);return a.length?a[Math.floor(a.length/2)]:null;};
const quantile=(a,p)=>{a=[...a].sort((x,y)=>x-y);return a.length?a[Math.min(a.length-1,Math.floor(a.length*p))]:null;};
const metrics=rows.map(r=>{
 const event=t=>r.events.find(e=>e.type===t);
 const ready=event('ready'),start=r.events.find(e=>e.type==='phase'&&e.phase==='idle'),end=event('idle-done'),saved=event('saved'),reload=event('reloaded');
 const samples=start&&end?r.samples.filter(s=>s.elapsedMs>start.receivedMs+500&&s.elapsedMs<end.receivedMs-500):[];
 const first=samples[0],last=samples.at(-1);
 const ids=new Set(first?.processes.map(p=>p.pid));
 const stable=first&&last&&ids.size===last.processes.length&&last.processes.every(p=>ids.has(p.pid));
 const total=(s,k)=>s.processes.reduce((a,p)=>a+p[k],0);
 const cpu=stable?(total(last,'cpuSeconds')-total(first,'cpuSeconds'))/(last.elapsedMs-first.elapsedMs)*100000:null;
 return {host:r.host,fixture:r.fixture,run:r.run,normalizedVisibility:r.normalizedVisibility,
   failure:r.failure||event('failed')?.error||null,readyMs:ready?.receivedMs,documentReadyMs:ready?.readyMs,viewport:ready?.viewport,visibility:ready?.visibility,
   idleCpuPercentOneCore:cpu,idleFootprintMiB:median(samples.map(s=>total(s,'footprintBytes')/1048576)),idleRssMiB:median(samples.map(s=>total(s,'residentBytes')/1048576)),
   idleEventLoopP95Ms:quantile(end?.lags||[],.95),idleEventLoopMaxMs:Math.max(...end?.lags||[]),
   clockAdvance:start&&end?end.clock-start.clock:null,idleElapsedSeconds:start&&end?(end.receivedMs-start.receivedMs)/1000:null,
   gameMinutesPerWallSecond:start&&end?(end.clock-start.clock)/((end.receivedMs-start.receivedMs)/1000):null,
   medianSaveMs:median(saved?.saveMs||[]),saveBytes:saved?.saveBytes,
   reloadOk:!!reload&&reload.sameCharacter&&reload.hasHero&&reload.clock>=reload.expected.clock,
   pageErrors:r.events.flatMap(e=>e.errors||[]),missing:r.missing??null,attributionStable:!!stable,
   rendererAttributed:!!first?.processes.some(p=>r.host==='tauri'?p.command.includes('WebKit.WebContent'):p.command.includes('Helper (Renderer)')),
   processNames:first?.processes.map(p=>p.command.split('/').at(-1)),loadBefore:r.loadBefore,loadAfter:r.loadAfter};
});
const groups=[];
for(const host of ['electron','tauri'])for(const fixture of [...new Set(metrics.map(r=>r.fixture))]){
 const a=metrics.filter(r=>r.host===host&&r.fixture===fixture);if(!a.length)continue;
 const g={host,fixture,runs:a.length,completed:a.filter(r=>r.reloadOk).length,timeouts:a.filter(r=>r.failure?.includes('timeout')).length,allPageErrorFree:a.every(r=>!r.pageErrors.length),allReloadOk:a.every(r=>r.reloadOk),allReportedErrorFree:a.every(r=>!r.failure&&!r.pageErrors.length&&!(r.missing?.length)),allAttributionStable:a.every(r=>r.attributionStable),allRenderersAttributed:a.every(r=>r.rendererAttributed)};
 for(const k of ['readyMs','idleCpuPercentOneCore','idleFootprintMiB','idleRssMiB','idleEventLoopP95Ms','medianSaveMs','gameMinutesPerWallSecond'])g[k]=median(a.map(r=>r[k]).filter(x=>x!==null&&x!==undefined));
 groups.push(g);
}
const result={metrics,groups};fs.writeFileSync(file.replace('.json','-summary.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(groups,null,2));

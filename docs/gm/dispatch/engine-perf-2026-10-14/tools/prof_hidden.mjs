// node prof.mjs <builtDir> <fixture> <sec> <out.cpuprofile> [hidden]
import fs from 'node:fs';
const W=new URL('../../../../../',import.meta.url).pathname.replace(/\/$/,''); // repo root
const L=await import(W+'/scripts/perf/lib.mjs'); const V=await import('./vis.mjs');
const [DIR,FIX,SEC,OUT,H]=process.argv.slice(2);
const srv=await L.serve(DIR); const b=await L.launchChrome();
try{const {context,page}=await V.openGameVis(L,b,srv.url,fs.readFileSync(FIX,'utf8'));await page.waitForTimeout(4000);
 if(H)await V.setHidden(page,true);await page.waitForTimeout(1000);
 const cdp=await context.newCDPSession(page);await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{interval:500});await cdp.send('Profiler.start');
 await page.waitForTimeout(+SEC*1000);const {profile}=await cdp.send('Profiler.stop');fs.writeFileSync(OUT,JSON.stringify(profile));
}finally{await b.close();await srv.close();}

// CPU profile of an idle fresh-origin page; prints self-time by function and by bundle-mapped source file.
const fs=require('node:fs');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const URL=process.argv[2],OUT=process.argv[3],SEC=+(process.argv[4]||15);
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try{const c=await b.newContext({viewport:{width:1366,height:768}});const p=await c.newPage();
await p.goto(URL,{waitUntil:'load'});await p.getByText('PLAY',{exact:true}).click({noWaitAfter:true});
const cf=p.getByText('Confirm',{exact:true});if(await cf.isVisible().catch(()=>false))await cf.click({noWaitAfter:true});
await p.waitForTimeout(5000);
const s=await c.newCDPSession(p);await s.send('Profiler.enable');await s.send('Profiler.setSamplingInterval',{interval:500});await s.send('Profiler.start');
await p.waitForTimeout(SEC*1000);const {profile}=await s.send('Profiler.stop');fs.writeFileSync(OUT,JSON.stringify(profile));
const dt={};for(let i=0;i<profile.samples.length;i++){dt[profile.samples[i]]=(dt[profile.samples[i]]||0)+(profile.timeDeltas[i]||0);}
const by={};for(const n of profile.nodes){const f=n.callFrame;const k=(f.functionName||'(anon)')+' @'+(f.url.split('/').pop()||f.url)+':'+f.lineNumber+':'+f.columnNumber;by[k]=(by[k]||0)+(dt[n.id]||0);}
const tot=Object.values(by).reduce((a,b)=>a+b,0);
console.log('total ms',(tot/1000).toFixed(0));for(const [k,v] of Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,40))console.log((v/1000).toFixed(0).padStart(7),(100*v/tot).toFixed(1).padStart(5)+'%',k);
}finally{await b.close();}})();

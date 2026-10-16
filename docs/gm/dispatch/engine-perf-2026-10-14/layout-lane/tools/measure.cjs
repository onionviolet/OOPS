// Usage: node measure.cjs <url> <label> [fixture.json] [idleSec] [trace]
const fs=require('node:fs');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const [URL,LABEL,FIX,IDLE='15',TRACE]=process.argv.slice(2);
const M=['TaskDuration','ScriptDuration','LayoutDuration','RecalcStyleDuration','LayoutCount','RecalcStyleCount'];
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const context=await browser.newContext({viewport:{width:1366,height:768}});
 if(FIX&&FIX!=='-'){const d=JSON.parse(fs.readFileSync(FIX,'utf8'));await context.addInitScript(d=>{if(!sessionStorage.getItem('fx')){localStorage.setItem('save data',JSON.stringify(d));sessionStorage.setItem('fx','1');}},d);}
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const cdp=await context.newCDPSession(page);await cdp.send('Performance.enable');
 const metrics=async()=>Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.filter(m=>M.includes(m.name)).map(m=>[m.name,m.value]));
 await page.goto(URL,{waitUntil:'load'});
 await page.getByText('PLAY',{exact:true}).click({noWaitAfter:true});const c=page.getByText('Confirm',{exact:true});if(await c.isVisible().catch(()=>false))await c.click({noWaitAfter:true});
 await page.waitForFunction(()=>!!localStorage.getItem('save data')&&document.documentElement.dataset.startScreen==='closed',null,{polling:100,timeout:30000});
 await page.waitForTimeout(3000);
 const out={label:LABEL,windows:[],errors};
 for(let i=0;i<2;i++){const a=await metrics();const t=Date.now();await page.waitForTimeout(+IDLE*1000);const b=await metrics();const s=(Date.now()-t)/1000;const d=k=>b[k]-a[k];
  out.windows.push({sec:+s.toFixed(1),layoutsPerSec:+(d('LayoutCount')/s).toFixed(1),stylePerSec:+(d('RecalcStyleCount')/s).toFixed(1),layoutMs:+(d('LayoutDuration')*1000).toFixed(0),styleMs:+(d('RecalcStyleDuration')*1000).toFixed(0),scriptMs:+(d('ScriptDuration')*1000).toFixed(0),busyPct:+(100*d('TaskDuration')/s).toFixed(1)});}
 if(TRACE){const chunks=[];cdp.on('Tracing.dataCollected',e=>chunks.push(...e.value));await cdp.send('Tracing.start',{categories:'devtools.timeline,disabled-by-default-devtools.timeline.stack,disabled-by-default-devtools.timeline.invalidationTracking',transferMode:'ReportEvents'});await page.waitForTimeout(3000);const done=new Promise(r=>cdp.once('Tracing.tracingComplete',r));await cdp.send('Tracing.end');await done;
  const lay=chunks.filter(e=>['Layout','UpdateLayoutTree','InvalidateLayout','ScheduleStyleRecalculation','LayoutInvalidationTracking','StyleRecalcInvalidationTracking','StyleInvalidatorInvalidationTracking','Animation'].includes(e.name));const by={};for(const e of lay){const st=e.args?.beginData?.stackTrace||e.args?.data?.stackTrace;const k=e.name+' | '+(e.args?.data?.reason||'')+' '+(e.args?.data?.nodeName||'')+' | '+(st?st.slice(0,3).map(f=>`${f.functionName}@${(f.url||'').split('/').pop()}:${f.lineNumber}:${f.columnNumber}`).join(' < '):'(no stack: rendering)');by[k]=(by[k]||0)+1;}
  out.trace=Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,40);}
 console.log(JSON.stringify(out,null,1));await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});

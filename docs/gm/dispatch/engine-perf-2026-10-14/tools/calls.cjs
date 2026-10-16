// Function call counts over an idle window via precise coverage, mapped to source names.
const fs=require('node:fs');const {SourceMap}=require('node:module');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const [URL,MAP,SEC,FIX]=[process.argv[2],process.argv[3],+(process.argv[4]||10),process.argv[5]];
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try{const c=await b.newContext({viewport:{width:1366,height:768}});if(FIX)await c.addInitScript(d=>{if(!sessionStorage.getItem('seeded')){localStorage.setItem('save data',d);sessionStorage.setItem('seeded','1');}},fs.readFileSync(FIX,'utf8'));const p=await c.newPage();
await p.goto(URL,{waitUntil:'load'});await p.getByText('PLAY',{exact:true}).waitFor({state:'visible'});await p.getByText('PLAY',{exact:true}).click({noWaitAfter:true});await p.waitForTimeout(500);
const cf=p.getByText('Confirm',{exact:true});if(await cf.isVisible().catch(()=>false))await cf.click({noWaitAfter:true});
await p.waitForTimeout(4000);const s=await c.newCDPSession(p);await s.send('Profiler.enable');
await s.send('Profiler.startPreciseCoverage',{callCount:true,detailed:false});await s.send('Profiler.takePreciseCoverage');
const ticks0=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data'))?.expansion?.clock??null);
await p.waitForTimeout(SEC*1000);const {result}=await s.send('Profiler.takePreciseCoverage');
const ticks1=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data'))?.expansion?.clock??null);
const sm=new SourceMap(JSON.parse(fs.readFileSync(MAP)));const src=fs.readFileSync(MAP.replace(/\.map$/,''),'utf8');
const lineStarts=[0];for(let i=0;i<src.length;i++)if(src.charCodeAt(i)===10)lineStarts.push(i+1);
const pos=o=>{let lo=0,hi=lineStarts.length-1;while(lo<hi){const m=(lo+hi+1)>>1;if(lineStarts[m]<=o)lo=m;else hi=m-1;}return [lo,o-lineStarts[lo]];};
const rows=[];for(const sc of result){if(!sc.url.includes('bundle.js'))continue;for(const f of sc.functions){const n=f.ranges[0].count;if(n<2)continue;const [l,col]=pos(f.ranges[0].startOffset);const e=sm.findEntry(l,col);rows.push([n,(e?.originalSource||'?').replace(/.*\/src\//,'src/')+':'+((e?.originalLine??-1)+1)+' '+(f.functionName||e?.name||'')]);}}
rows.sort((a,b)=>b[0]-a[0]);console.log('clock',ticks0,'->',ticks1);
const want=/featureWaveContext|campaignContext|backlogContext|simulationNativeContexts|worldCompletionContext|worldCompletionFacts|simulationFacts|expeditionContext|refinementPresentation|persistExpansion|prepareFoundationSave|validateSaveEnvelope|create_save|update_timer|validateExpansionState|structuredClone|paradiseFacts|auditRemainderCombinedFacts|render$/;
for(const r of rows.filter(r=>want.test(r[1])||r[0]<=100000).slice(0,4000))console.log(String(r[0]).padStart(8),r[1]);
}finally{await b.close();}})();

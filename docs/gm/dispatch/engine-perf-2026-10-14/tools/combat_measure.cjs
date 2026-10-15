// Busy-combat window on a developed fixture: start a fight through native UI, then measure.
// Usage: node combat_measure.cjs <url> <fixture> <out-prefix> [sec]
const fs=require('node:fs');const {SourceMap}=require('node:module');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const [URL,FIX,OUT,SEC]=[process.argv[2],process.argv[3],process.argv[4],+(process.argv[5]||20)];
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});const r={url:URL};
try{const c=await b.newContext({viewport:{width:1366,height:768}});
await c.addInitScript(d=>{if(!sessionStorage.getItem('seeded')){localStorage.setItem('save data',d);sessionStorage.setItem('seeded','1');}
 window.__tm={fired:0,set:0,raf:0};const wrap=st=>function(f,...a){window.__tm.set++;if(typeof f!=='function')return st.call(this,f,...a);return st.call(this,function(...x){window.__tm.fired++;return f.apply(this,x);},...a);};let cur=wrap(window.setTimeout);Object.defineProperty(window,'setTimeout',{configurable:true,get:()=>cur,set:v=>{cur=wrap(v);}});
 const ra=window.requestAnimationFrame;window.requestAnimationFrame=function(f){return ra.call(this,t=>{window.__tm.raf++;f(t);});};
 window.__lt=[];try{new PerformanceObserver(l=>{for(const e of l.getEntries())window.__lt.push(e.duration);}).observe({type:'longtask',buffered:true});}catch{}},fs.readFileSync(FIX,'utf8'));
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto(URL,{waitUntil:'load'});
const pl=p.getByText('PLAY',{exact:true});await pl.waitFor({state:'visible',timeout:30000});await pl.click({noWaitAfter:true});await p.waitForTimeout(800);const cf=p.getByText('Confirm',{exact:true});if(await cf.isVisible().catch(()=>false))await cf.click({noWaitAfter:true});
await p.waitForTimeout(1500);
await p.locator('.choice_travel',{hasText:'Move somewhere else'}).first().click();await p.waitForTimeout(300);
await p.locator('.choice_travel',{hasText:'Move somewhere else'}).first().locator('[data-travel="Infested field"]').click();
await p.waitForFunction(()=>document.querySelectorAll('#enemies_div [data-attack_bar], [data-attack_bar].enemy_attack_bar').length>0,null,{timeout:60000,polling:250});
await p.waitForTimeout(3000);
await p.screenshot({path:OUT+'-a.png'});
const cdp=await c.newCDPSession(p);await cdp.send('Performance.enable');
const M=async()=>Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));
await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{interval:500});
const s0=await p.evaluate(()=>({...window.__tm,lt:window.__lt.length,kills:JSON.parse(localStorage.getItem('save data')).total_kills}));const m0=await M();const t0=Date.now();
await cdp.send('Profiler.start');await p.waitForTimeout(SEC*1000);const {profile}=await cdp.send('Profiler.stop');
const wall=Date.now()-t0;const m1=await M();const s1=await p.evaluate(()=>({...window.__tm,lt:window.__lt.length,ltMax:Math.max(0,...window.__lt.slice(-50)),kills:JSON.parse(localStorage.getItem('save data')).total_kills,inCombat:!!document.querySelector('.enemy_attack_bar')}));
await p.screenshot({path:OUT+'-b.png'});
const dt={};profile.samples.forEach((s,i)=>dt[s]=(dt[s]||0)+(profile.timeDeltas[i]||0));let tot=0,busy=0;const self={};
for(const n of profile.nodes){const t=dt[n.id]||0;tot+=t;const f=n.callFrame.functionName;if(f!=='(idle)'&&f!=='(program)')busy+=t;}
fs.writeFileSync(OUT+'.cpuprofile',JSON.stringify(profile));
const d=k=>m1[k]-m0[k];Object.assign(r,{wallMs:wall,jsBusyMs:+(busy/1000).toFixed(0),jsBusyPct:+(100*busy/1000/wall).toFixed(1),taskBusyPct:+(100*d('TaskDuration')*1000/wall).toFixed(1),scriptMs:+(d('ScriptDuration')*1000).toFixed(0),layoutMs:+(d('LayoutDuration')*1000).toFixed(0),styleMs:+(d('RecalcStyleDuration')*1000).toFixed(0),
 timerCallbacksPerSec:+((s1.fired-s0.fired)*1000/wall).toFixed(1),timersSetPerSec:+((s1.set-s0.set)*1000/wall).toFixed(1),rafPerSec:+((s1.raf-s0.raf)*1000/wall).toFixed(1),longTasks:s1.lt-s0.lt,longTaskMaxMs:+s1.ltMax.toFixed(0),kills:[s0.kills,s1.kills],inCombatAtEnd:s1.inCombat,errors:errs.slice(0,5)});
console.log(JSON.stringify(r));fs.writeFileSync(OUT+'.json',JSON.stringify(r,null,1));
}finally{await b.close();}})();

// Deterministic combat replay: developed fixture, dev-stepped engine (?test_hooks=1), fight entered through native UI,
// fixed Math.random seed, native combat controls (hero attack power 40, enemy attack power 0.01), N kills.
// Usage: node combat_replay.cjs <url> <fixture> <out.json> [kills=20]
const fs=require('node:fs');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const [URL,FIX,OUT,N]=[process.argv[2],process.argv[3],process.argv[4],+(process.argv[5]||20)];
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});const errs=[];
try{const c=await b.newContext({viewport:{width:1366,height:768}});
await c.addInitScript(d=>{if(!sessionStorage.getItem('seeded')){localStorage.setItem('save data',d);sessionStorage.setItem('seeded','1');}
 let a=0x9e3779b9;Math.random=()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};},fs.readFileSync(FIX,'utf8'));
const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto(URL+(URL.includes('?')?'&':'?')+'test_hooks=1',{waitUntil:'load'});
const pl=p.getByText('PLAY',{exact:true});await pl.waitFor({state:'visible',timeout:30000});await p.waitForFunction(()=>!!window.simulationTestHooks,null,{timeout:30000});await p.evaluate(()=>window.simulationTestHooks.pause());await pl.click({noWaitAfter:true});await p.waitForTimeout(800);const cf=p.getByText('Confirm',{exact:true});if(await cf.isVisible().catch(()=>false))await cf.click({noWaitAfter:true});
await p.waitForFunction(()=>!!window.simulationTestHooks,null,{timeout:30000});console.error('ready');await p.evaluate(()=>window.simulationTestHooks.pause());
await p.locator('.choice_travel',{hasText:'Move somewhere else'}).first().click();
await p.locator('.choice_travel',{hasText:'Move somewhere else'}).first().locator('[data-travel="Infested field"]').click();
console.error('travel clicked');let ticks=0;const step=async n=>{const r=await p.evaluate(n=>window.advanceTicks(n),n);ticks+=n;if(process.env.V)console.error('t',ticks,JSON.stringify(r),await p.evaluate(async()=>{const m=await import(document.querySelector('script[src*="dist/bundle.js"]').src);const c=m.current_combat;const s=window.simulationTestHooks.snapshot();return JSON.stringify({loc:m.current_location?.id,c:!!c,ended:c?.is_ended,hp:c?.defenders.map(d=>d.getFullStats?.().health),hero:c?.attackers[0].getFullStats?.().health,kills:s.total_kills,hits:s.total_hits_done,time:s['current time']});}));};
for(let i=0;i<200;i++){if(await p.evaluate(async()=>{const m=await import(document.querySelector('script[src*="dist/bundle.js"]').src);return !!m.current_combat&&!m.current_combat.is_ended;}))break;await step(1);}
await p.evaluate(async()=>{const m=await import(document.querySelector('script[src*="dist/bundle.js"]').src);const hero=m.current_combat.attackers[0];hero.getAttackPower=()=>40;
 Object.getPrototypeOf(m.current_combat.defenders[0]).getAttackPower=function(){return 0.01;};});
const kills=()=>p.evaluate(()=>Object.values(window.simulationTestHooks.snapshot().enemy_killcount||{}).reduce((a,b)=>a+b,0));
const reenter=async()=>{if(await p.evaluate(async()=>{const m=await import(document.querySelector('script[src*="dist/bundle.js"]').src);return m.current_location?.id==='Village';})){await p.locator('.choice_travel',{hasText:'Move somewhere else'}).first().click();await p.locator('.choice_travel',{hasText:'Move somewhere else'}).first().locator('[data-travel="Infested field"]').click();reentries++;}};let reentries=0;const k0=await kills();console.error('combat',k0);let k=k0;const trace=[];
if(process.env.LOGAT){await step(+process.env.LOGAT);console.error((await p.evaluate(()=>document.getElementById('message_log_div')?.innerText||document.body.innerText.slice(0,3000))).slice(0,3000));process.exit(0);}
while(k-k0<N&&ticks<20000){await step(5);k=await kills();trace.push(k-k0);await reenter();}
await p.evaluate(()=>window.simulationTestHooks.resume&&0);
const save=await p.evaluate(()=>window.simulationTestHooks.snapshot());const durable=await p.evaluate(()=>localStorage.getItem('save data'));
const log=await p.evaluate(()=>(document.getElementById('message_log_div')?.innerText||'').split('\n'));
for(const s of [save]){delete s.saved_at;delete s.total_playtime;}
const d=JSON.parse(durable);delete d.saved_at;delete d.total_playtime;
fs.writeFileSync(OUT,JSON.stringify({ticks,kills:k-k0,reentries,trace,save,durable:d,log}));
await p.screenshot({path:OUT.replace(/\.json$/,'.png')});
console.log(JSON.stringify({ticks,kills:k-k0,reentries,defeated:log.filter(l=>l.endsWith('was defeated')).length,deaths:save.total_deaths,hits:save.total_hits_done,taken:save.total_hits_taken,logLines:log.length,errors:errs.slice(0,3)}));
}finally{await b.close();}})();

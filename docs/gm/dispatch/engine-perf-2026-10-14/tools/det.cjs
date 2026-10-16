// Load one fixture save, let N game minutes pass idle, capture that tick's durable save; optional CPU profile.
const fs=require('node:fs');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const [URL,FIX,OUT,N,PROF]=[process.argv[2],process.argv[3],process.argv[4],+(process.argv[5]||20),process.argv[6]];
const mins=t=>((t.day_count*24+t.hour)*60+t.minute);
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});const errors=[];
try{const c=await b.newContext({viewport:{width:1366,height:768}});await c.addInitScript(d=>{if(!sessionStorage.getItem('seeded')){localStorage.setItem('save data',d);sessionStorage.setItem('seeded','1');}},fs.readFileSync(FIX,'utf8'));
const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(URL,{waitUntil:'load'});
const pl=p.getByText('PLAY',{exact:true});await pl.waitFor({state:'visible',timeout:30000});await pl.click({noWaitAfter:true});const cf=p.getByText('Confirm',{exact:true});await p.waitForTimeout(500);if(await cf.isVisible().catch(()=>false))await cf.click({noWaitAfter:true});
const start=await p.evaluate(()=>{const t=JSON.parse(localStorage.getItem('save data'))['current time'];return ((t.day_count*24+t.hour)*60+t.minute);});
let s;if(PROF){var cdp=await c.newCDPSession(p);await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{interval:500});await cdp.send('Profiler.start');}
const t0=Date.now();
const raw=await p.waitForFunction(target=>{const v=localStorage.getItem('save data');const t=JSON.parse(v)['current time'];return ((t.day_count*24+t.hour)*60+t.minute)>=target&&v;},start+N,{polling:20,timeout:N*3000+30000});
s=await raw.jsonValue();const wall=Date.now()-t0;
if(PROF){const {profile}=await cdp.send('Profiler.stop');fs.writeFileSync(PROF,JSON.stringify(profile));}
const save=JSON.parse(s);for(const k of ['saved_at','total_playtime'])delete save[k];
fs.writeFileSync(OUT,JSON.stringify(save));console.log(JSON.stringify({start,end:mins(save['current time']),wallMs:wall,clock:save.expansion?.clock,bytes:s.length,errors}));
}finally{await b.close();}})();

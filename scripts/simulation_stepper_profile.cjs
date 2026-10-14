global.fetch=undefined;
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {SourceMap}=require('node:module');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const ROOT='http://127.0.0.1:18950/',OUT='docs/gm/dispatch/absorb-all-2026-10-14/checks/sim-stepper';
const fixture=JSON.parse(fs.readFileSync(OUT+'/fixtures/opening.json'));
const label=process.argv[3]||'before',profile=process.argv[2]==='--profile';
const ticks=Number(process.env.YAIRPG_BENCH_TICKS||(profile?1000:200));
async function open(browser,id){
 const seed=structuredClone(fixture);
 if(id==='combat'){seed['current location']='Infested field';seed.availabilities.location['Infested field']=1;seed.character.xp.total_xp=10000000;seed.levels.person.main_character.total_xp=10000000;}
 if(id==='search'){seed['current location']='Mountain camp';seed.availabilities.location['Mountain camp']=1;seed.availabilities.action['frontier.fort.search']=1;}
 const context=await browser.newContext({viewport:{width:1366,height:768}});
 await context.addInitScript(s=>{localStorage.setItem('save data',JSON.stringify(s));},seed);
 const page=await context.newPage();page.setDefaultTimeout(30000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>route.request().url().startsWith(ROOT)?route.continue():route.abort());
 await page.goto(ROOT+'?test_hooks=1');
 await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('save data'));s.__waitingWriter=true;localStorage.setItem('save data',JSON.stringify(s));});
 await page.waitForFunction(()=>{saveProgress();return !JSON.parse(localStorage.getItem('save data')).__waitingWriter;});
 await page.evaluate(id=>{document.getElementById('loading_screen_play_button').click();if(id==='work')start_activity('running');if(id==='search')start_game_action('frontier.fort.search');simulationTestHooks.pause();},id);
 return {context,page,errors};
}
function table(cpu){
 const map=new SourceMap(JSON.parse(fs.readFileSync('dist/bundle.js.map'))),nodes=new Map(cpu.nodes.map(n=>[n.id,n]));
 const parent=new Map(),grouped=new Map(),keys=new Map();for(const n of cpu.nodes)for(const id of n.children||[])parent.set(id,n.id);
 for(const n of cpu.nodes){
  const f=n.callFrame,loc=f.url.includes('/dist/bundle.js')?map.findEntry(f.lineNumber,f.columnNumber):null;
  const site=loc?.originalSource?`${loc.originalSource}:${loc.originalLine+1}:${loc.originalColumn+1}`:`${f.url||'(V8)'}:${f.lineNumber+1}:${f.columnNumber+1}`;
  let name=loc?.name||f.functionName||'(anonymous)';
  if(loc?.originalSource){try{const line=fs.readFileSync(path.resolve('dist',loc.originalSource),'utf8').split('\n')[loc.originalLine];name=line?.match(/(?:function\s+|^\s*)([\w$]+)\s*\(/)?.[1]||name;}catch{}}
  const key=name+' '+site;keys.set(n.id,key);if(!grouped.has(key))grouped.set(key,{function:name,site,selfMs:0,totalMs:0});
 }
 for(let i=0;i<(cpu.samples||[]).length;i++){
  const id=cpu.samples[i],dt=cpu.timeDeltas[i]/1000;grouped.get(keys.get(id)).selfMs+=dt;
  const seen=new Set();for(let p=id;p!=null;p=parent.get(p))seen.add(keys.get(p));for(const key of seen)grouped.get(key).totalMs+=dt;
 }
 const rows=[...grouped.values()];for(const r of rows){r.selfMs=+r.selfMs.toFixed(2);r.totalMs=+r.totalMs.toFixed(2);}
 return {topSelf:[...rows].sort((a,b)=>b.selfMs-a.selfMs).slice(0,15),topTotal:[...rows].sort((a,b)=>b.totalMs-a.totalMs).slice(0,15)};
}
if(process.argv[2]==='--summarize'){fs.writeFileSync(`${OUT}/${label}-profile-top.json`,JSON.stringify(table(JSON.parse(fs.readFileSync(`${OUT}/${label}.cpuprofile`))),null,2));process.exit(0);}
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});try{
 const runs=[];
 for(const id of profile?['idle']:['idle','work','combat','search'])for(let run=0;run<(profile?1:3);run++){
  const {context,page,errors}=await open(browser,id);const host={at:new Date().toISOString(),loadavg:os.loadavg(),cores:os.cpus().length,freeMiB:Math.round(os.freemem()/2**20)};
  let session;if(profile){session=await context.newCDPSession(page);await session.send('Profiler.enable');await session.send('Profiler.setSamplingInterval',{interval:1000});await session.send('Profiler.start');}
  const result=await page.evaluate(n=>{const start=performance.now();const result=advanceTicks(n,{render:false});return {...result,ms:performance.now()-start};},ticks);
  if(profile){const {profile:cpu}=await session.send('Profiler.stop');fs.writeFileSync(`${OUT}/${label}.cpuprofile`,JSON.stringify(cpu));fs.writeFileSync(`${OUT}/${label}-profile-top.json`,JSON.stringify(table(cpu),null,2));}
  const row={id,run:run+1,ticks,ms:result.ms,ticksPerSecond:1000*ticks/result.ms,callbacks:result.callbacks,errors,host};runs.push(row);console.log(JSON.stringify(row));await context.close();
 }
 const medians=Object.fromEntries([...new Set(runs.map(r=>r.id))].map(id=>[id,runs.filter(r=>r.id===id).map(r=>r.ticksPerSecond).sort((a,b)=>a-b)[Math.floor(runs.filter(r=>r.id===id).length/2)]]));
 fs.writeFileSync(`${OUT}/${label}-${profile?'profile':'benchmark'}.json`,JSON.stringify({viewport:[1366,768],ticks,runs,medians},null,2));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

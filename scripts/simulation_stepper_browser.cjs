global.fetch=undefined;
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),assert=require('node:assert/strict');
const root='http://127.0.0.1:18950/', out='/tmp/sim-stepper-equivalence';fs.mkdirSync(out,{recursive:true});
const errors=[], results=[];
const seed=JSON.parse(fs.readFileSync('docs/gm/dispatch/absorb-all-2026-10-14/checks/sim-stepper/fixtures/opening.json'));
async function open(browser, hooks, initial, setup) {
 const context=await browser.newContext({viewport:{width:1366,height:768}});
 await context.addInitScript(s=>localStorage.setItem('save data',JSON.stringify(s)),initial);
 const page=await context.newPage();page.setDefaultTimeout(20000);page.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text());});page.on('pageerror',e=>{errors.push(e.stack);console.log('ERROR',e.stack);});
 const clockSource = `const now=1791993600000;
    let time=now, serial=0;const tasks=new Map();Date.now=()=>time;
    const setTimeout=(callback,delay=0,...args)=>{const id=++serial;tasks.set(id,{id,callback:()=>callback(...args),at:time+Math.max(1,Number(delay)||0)});return id;};
    const clearTimeout=id=>tasks.delete(id);
    const setInterval=(callback,delay=0,...args)=>{const id=++serial;tasks.set(id,{id,callback:()=>callback(...args),at:time+Math.max(1,Number(delay)||0),interval:Math.max(1,Number(delay)||0)});return id;};
    const clearInterval=clearTimeout;
    window.proofClock={advance(ms){const end=time+ms;let count=0;while(true){const t=[...tasks.values()].sort((a,b)=>a.at-b.at||a.id-b.id)[0];if(!t||t.at>end)break;if(++count>1000000)throw Error('Proof clock runaway');time=t.at;tasks.delete(t.id);if(t.interval)tasks.set(t.id,{...t,at:time+t.interval});t.callback();}time=end;return count;}};

`;
 await page.route('**/dist/bundle.js*',route=>route.fulfill({contentType:'application/javascript',body:clockSource+fs.readFileSync('dist/bundle.js','utf8')}));
 await page.goto(root+(hooks?'?test_hooks=1':''));
 await page.locator('#loading_screen_play_button:not(.none_display)').waitFor({state:'visible'});
 await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('save data'));s.__proofPendingWriter=true;localStorage.setItem('save data',JSON.stringify(s));});
 await page.waitForFunction(()=>{saveProgress();return !JSON.parse(localStorage.getItem('save data')).__proofPendingWriter;},null,{polling:'raf'});
 await page.evaluate(()=>{document.getElementById('loading_screen_play_button').click();const c=document.getElementById('hero_creation_panel_confirmation');if(c && c.getClientRects().length)c.click();});
 if(setup)await page.evaluate(setup);
 return {page,context};
}
function clean(s) {delete s.saved_at;delete s.last_rewarded_export;return s;}
async function snapshot(page) {return clean(await page.evaluate(()=>{saveProgress();return JSON.parse(localStorage.getItem('save data'));}));}
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});
try {
 const combat=structuredClone(seed);combat['current location']='Infested field';combat.availabilities.location['Infested field']=1;
 const job=structuredClone(seed);job['current location']='Mountain camp';job.availabilities.location['Mountain camp']=1;job.availabilities.action['frontier.fort.search']=1;
 for(const scenario of [
  {id:'idle',seed,n:12},
  {id:'work',seed,n:12,setup:()=>start_activity('running')},
  {id:'combat',seed:combat,n:12},
  {id:'timed-action',seed:job,n:65,setup:()=>start_game_action('frontier.fort.search')},
  {id:'timed-job',seed,n:125,setup:()=>start_activity('fieldwork')},
  {id:'autosave-boundary',seed,n:65},
 ]) {
  console.log('CASE',scenario.id);
  const real=await open(browser,false,scenario.seed,scenario.setup);
  const initial=await snapshot(real.page);
  await real.page.evaluate(ms=>proofClock.advance(ms),scenario.n*1000);
  const a=await snapshot(real.page);
  await real.page.evaluate(()=>proofClock.advance(1000));
  const resumedReference=await snapshot(real.page);
  await real.context.close();
  const stepped=await open(browser,true,scenario.seed,scenario.setup);
  assert.deepEqual(await snapshot(stepped.page),initial,scenario.id+' initial');
  await stepped.page.evaluate(()=>{for(const n of [-1,1.5,NaN,Infinity]){let rejected=false;try{advanceTicks(n);}catch(e){rejected=e instanceof RangeError;}if(!rejected)throw Error('Invalid tick count accepted');}if(advanceTicks(0).ticks!==0)throw Error('Zero advanced');});
  const started=performance.now();const count=await stepped.page.evaluate(n=>advanceTicks(n),scenario.n);const ms=performance.now()-started;
  const b=await snapshot(stepped.page);
  fs.writeFileSync(`${out}/${scenario.id}-real.json`,JSON.stringify(a,null,2));fs.writeFileSync(`${out}/${scenario.id}-step.json`,JSON.stringify(b,null,2));
  assert.deepEqual(b,a,scenario.id+' real speed-1 vs step');
  assert.equal(count.ticks,scenario.n);
  if(scenario.id==='timed-action')assert.ok(count.callbacks>500,'action interval really ran');
  if(scenario.id==='timed-job')assert.ok(b.current_activity.earnings>0,'paid working period settled');
  if(scenario.id==='autosave-boundary')assert.equal(count.autosaves,1);
  if(scenario.id==='idle')assert.equal(count.autosaves,0);
  results.push({id:scenario.id,ticks:scenario.n,callbacks:count.callbacks,stepMs:Math.round(ms)});console.log(results.at(-1));
  await stepped.page.evaluate(()=>proofClock.advance(1000));
  assert.deepEqual(await snapshot(stepped.page),resumedReference,scenario.id+' resume at speed 1');
  await stepped.page.screenshot({path:`${out}/${scenario.id}.png`});
  await stepped.context.close();
 }
 // Real browser timers, fresh origin, hooks absent and a pre-change saved envelope.
 const normal=await browser.newContext({viewport:{width:1366,height:768}});const p=await normal.newPage();p.on('pageerror',e=>errors.push(e.stack));
 await p.goto(root);await p.locator('#loading_screen_play_button:not(.none_display)').click();if(await p.locator('#hero_creation_panel_confirmation').isVisible())await p.locator('#hero_creation_panel_confirmation').click();
 assert.equal(await p.evaluate(()=>typeof advanceTicks),'undefined');const before=await snapshot(p);await p.waitForTimeout(2200);const after=await snapshot(p);assert.ok(after.total_playtime>before.total_playtime);await p.reload();await p.locator('#loading_screen_play_button:not(.none_display)').click();assert.equal(await p.evaluate(()=>typeof simulationTestHooks),'undefined');await normal.close();
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'/results.json',JSON.stringify({viewport:[1366,768],excluded:['saved_at','last_rewarded_export'],results,errors,normalSmoke:true,oldSaveLoad:true},null,2));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

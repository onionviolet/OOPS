// Native combat journey at 1366x768 from a fresh origin: deterministic seeds, paused engine, dev stepper.
// Records the native opponent view at fixed tick counts (and the registered projection when present),
// then Save, reload, Export and literal Import. Before/after runs compare the JSON output.
const {chromium}=require(process.env.YAIRPG_PLAYWRIGHT||'/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const {startFresh,waitLocation}=require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const url=process.env.PROOF_URL||'http://127.0.0.1:19462/?test_hooks=1',out=process.env.PROOF_OUT||'/tmp/combat-projection.json';
const STEPS=[0,1,2,3,5,8,12,16,20,25,30,40,50,60,200],SEED=Number(process.env.PROOF_SEED||41);
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),errors=[];
 try{
 const context=await browser.newContext({viewport:{width:1366,height:768}});await context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
 await context.addInitScript(seed=>{globalThis.__seed=seed;},SEED);await context.addInitScript(()=>{Date.now=()=>1792108800000;crypto.getRandomValues=a=>{for(let i=0;i<a.length;i++)a[i]=12345+globalThis.__seed*7919+i;return a;};let n=globalThis.__seed;Math.random=()=>((n=Math.imul(n,1664525)+1013904223>>>0)/4294967296);});
 const page=await context.newPage();page.on('pageerror',e=>{errors.push(e.message);console.log('PAGEERROR',e.message);});page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const boot=async()=>{await page.waitForFunction(()=>window.simulationTestHooks);await page.evaluate(()=>window.simulationTestHooks.pause());await startFresh(page);};
 // stale: rows as the native view last drew them; rows: after a forced native re-render (display only).
 const statsText=()=>page.evaluate(()=>[...document.querySelectorAll('#combat_div .fighter_div .fighter_stats')].map(n=>n.innerText));
 const view=async()=>{const before=await statsText();await page.evaluate(()=>window.simulationTestHooks.refreshCombatView?.());const after=await statsText();return {nativeWasStale:JSON.stringify(before)!==JSON.stringify(after),...await viewNow()};};
 const viewNow=()=>page.evaluate(()=>{
  const first=n=>(n?.innerText||n?.textContent||'').split('\n')[0].trim();
  const rows=[...document.querySelectorAll('#combat_div .fighter_div')].filter(r=>!r.closest('[id*=attacker]')||true).map(r=>({id:r.id,name:first(r.querySelector('.fighter_name')),hp:first(r.querySelector('.health_value')),
   bar:r.querySelector('.healthbar_current')?.style.width??null,stats:[...r.querySelectorAll('.fighter_stats > *')].map(first),youHit:r.dataset.playerHitChance??null,dim:r.style.filter||''}));
  const projection=window.simulationTestHooks.project?.('combat-opponents')??null;
  return {rows,projection,clock:window.simulationTestHooks.snapshot()['current time']??null};
 });
 // Elder lines unlock Infested field; the dialogue closes through the shared center Back (the shell hides the old exit).
 async function unlockCombatRoute(){await page.getByText('Talk to someone',{exact:false}).first().click();await page.locator('[data-dialogue="villageElder"]').click();
  for(const key of ['hello','what happened','ask to leave 1','need to']){const line=page.locator(`.dialogue_textline[data-textline="${key}"]`);await line.click();await line.waitFor({state:'detached'});}
  await page.locator('#center_mode_back').click();}
 await page.goto(url);await boot();await unlockCombatRoute();
 await page.locator('#location_actions_div').getByText('Move somewhere else',{exact:false}).first().click();
 await page.locator('#location_actions_div .action_travel[data-travel="Infested field"]').click();await waitLocation(page,'Infested field');
 await page.locator('#combat_div .fighter_div').first().waitFor({state:'attached'});
 const frames=[];let done=0;
 for(const at of STEPS){if(at>done){await page.evaluate(n=>window.advanceTicks(n,{render:true}),at-done);done=at;}frames.push({ticks:at,...await view()});}
 await page.locator('#location_actions_div .action_travel[data-travel="Village"]').click().catch(()=>{});
 await waitLocation(page,'Village');
 await page.locator('#save_button').click();const saved=await page.evaluate(()=>JSON.parse(JSON.stringify(window.simulationTestHooks.snapshot())));
 await page.reload();await boot();const restored=await page.evaluate(()=>window.simulationTestHooks.snapshot());
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);const encoded=fs.readFileSync(await download.path());
 await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'combat.txt',mimeType:'text/plain',buffer:encoded})]);await boot();
 const imported=await page.evaluate(()=>window.simulationTestHooks.snapshot());
 fs.writeFileSync(out,JSON.stringify({viewport:'1366x768',steps:STEPS,frames,saved,restored,imported,errors},null,1)+'\n');
 assert.ok(frames.some(f=>f.rows.length),'combat rendered');
 // When the registered projection exists, it must reproduce exactly what the native view shows.
 const nativeText=f=>{const n=f.number;switch(f.id){case 'attack':return `Atk: ${n}dmg${f.count>1?` x${f.count}`:''}`;case 'speed':return `| Spd: ${n}`;
  case 'hits-you':return f.shield?'| Hit: 100% 🛡️':`| Hit: ${n}%`;case 'attack-rating':return `| AP: ${n}`;case 'block':return `| 🛡️: ${n}2345`;
  case 'evades-you':return `| Ddg: ${n}%`;case 'evasion-rating':return `| EP: ${n}`;case 'defense':return `| Def: ${n}`;}};
 let checked=0;for(const f of frames){if(!f.projection)continue;const defenders=f.rows.filter(r=>/^defender_/.test(r.id));
  assert.equal(f.projection.count,defenders.length,`count at ${f.ticks}`);assert.equal(f.projection.active,defenders.length>0);
  f.projection.opponents.forEach((o,i)=>{const r=defenders[i];assert.equal(o.name,r.name);assert.equal(`${o.health.current}/${o.health.max} hp`,r.hp);
   assert.deepEqual(o.facts.filter(x=>x.id!=='you-hit').map(nativeText),r.stats,`stats ${o.slot} at ${f.ticks}`);
   assert.equal(o.facts.find(x=>x.id==='you-hit')?.value??null,r.youHit);assert.equal(o.defeated,r.dim==='brightness(30%)');checked++;});}
 if(frames.some(f=>f.projection))console.log('parity checked opponents',checked,'native-stale frames',frames.filter(f=>f.nativeWasStale).length,'multi',frames.filter(f=>f.projection?.count>1).length,'defeated',frames.filter(f=>f.projection?.opponents.some(o=>o.defeated)).length);assert.deepEqual(errors,[]);
 fs.writeFileSync(out,JSON.stringify({viewport:'1366x768',steps:STEPS,frames,saved,restored,imported,errors},null,1)+'\n');
 console.log('PASS combat journey',JSON.stringify({frames:frames.length,opponents:frames.map(f=>f.rows.length),out}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

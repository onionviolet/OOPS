const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const R=require('../vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const E=path.join(__dirname,'evidence'),PHASE=process.env.PHASE||'s1',URL='http://127.0.0.1:19115/';
const population=fs.readFileSync(path.join(__dirname,'../calm-vivid-2026-10-14/evidence/populated-ui-fixture.json'),'utf8');
const precombat=fs.readFileSync(path.join(__dirname,'../calm-vivid-2026-10-14/evidence/precombat-native.save.txt'),'utf8');
const results=[];let b;
function record(name,detail={}){results.push({name,pass:true,detail});fs.writeFileSync(path.join(E,PHASE+'-browser.json'),JSON.stringify(results,null,2));console.log('PASS',name,JSON.stringify(detail));}
async function open(save,w=1366,h=768,storage={}){
 const ctx=await b.newContext({viewport:{width:w,height:h}}),p=await ctx.newPage();p.setDefaultTimeout(15000);p.errors=[];p.on('pageerror',e=>p.errors.push(e.message));
 await p.goto(URL+'style.css');await p.evaluate(({save,storage})=>{if(save)localStorage.setItem('save data',save);for(const[k,v]of Object.entries(storage))localStorage.setItem(k,v)},{save,storage});
 await p.goto(URL);await R.startFresh(p);await p.waitForTimeout(700);return{ctx,p};
}
async function shot(p,name){await p.mouse.move(2,2);await p.screenshot({path:path.join(E,PHASE+'-'+name+'.png')});}
async function visibleInViewport(p,selector){return p.locator(selector).evaluate(n=>{const r=n.getBoundingClientRect();let t=r.top,b=r.bottom;for(let a=n.parentElement;a;a=a.parentElement){const s=getComputedStyle(a);if(/auto|scroll|hidden|clip/.test(s.overflowY)){const q=a.getBoundingClientRect();t=Math.max(t,q.top);b=Math.min(b,q.bottom);}}return r.width>0&&b>Math.max(t,0)&&t<innerHeight;});}
async function back(p){await p.locator('#center_mode_back').click();}
(async()=>{
 b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 for(const [w,h]of (PHASE==='s1'?[[1366,768]]:[[1366,768],[1440,900],[1920,1080]])){
  const fresh=await open(null,w,h);await shot(fresh.p,'opening-'+w);assert.deepEqual(fresh.p.errors,[]);await fresh.ctx.close();
  const {ctx,p}=await open(population,w,h);await shot(p,'village-'+w);
  assert.equal(await p.locator('#message_box_div details').count(),0);
  for(const id of ['generated_people_panel','life_record_panel','village_lives_panel','world_event_feed'])assert.equal(await p.locator('#'+id).evaluate(n=>!!n.closest('[data-panel-kit="1"]')),true,id);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await p.locator('#village_mixing_open').click();assert(await visibleInViewport(p,'#center_mode_back'));await p.locator('#center_mode_content').evaluate(n=>n.scrollTop=n.scrollHeight);assert(await visibleInViewport(p,'#center_mode_back'));assert.match(await p.locator('#center_mode_back').innerText(),/← Village/);await shot(p,'mixing-'+w);await back(p);assert(await p.locator('#location_actions_div').isVisible());
  await p.locator('#village_mixing_open').click();await p.evaluate(()=>window.openCraftingWindow());assert(await p.locator('#crafting_mainpage_buttons').isVisible());assert.equal(await p.locator('#village_mixing_panel').isVisible(),false);await shot(p,'crafting-'+w);
  await p.keyboard.press('Escape');assert(await p.locator('#village_mixing_panel').isVisible());await back(p);assert(await p.locator('#location_actions_div').isVisible());
  await p.evaluate(()=>window.openCraftingWindow());assert(await p.locator('#crafting_mainpage_buttons').isVisible());await back(p);assert(await p.locator('#location_actions_div').isVisible());
  await p.locator('#village_mixing_open').click();await p.evaluate(()=>window.start_dialogue('villageElder'));assert(await p.locator('#dialogue_name_div').isVisible());await p.keyboard.press('Escape');assert(await p.locator('#village_mixing_panel').isVisible());await p.keyboard.press('Escape');assert(await p.locator('#location_actions_div').isVisible());
  record('navigation-'+w,{mixingButton:true,overlapCrafting:true,overlapDialogue:true,escape:true});
  if(w===1366){
   // Real native purchases/mix/observation/queue, on synthetic disposable resources.
   await p.locator('#village_mixing_open').click();
   await p.locator('#mixture_amount_River_bellleaf').fill('1');await p.locator('#mixture_amount_Spring_water').fill('1');
   for(const item of ['River bellleaf','Spring water'])for(let i=0;i<8;i++)await p.locator('#mixture_amount_'+item.replaceAll(' ','_')).locator('..').getByRole('button').click();
   await p.locator('#mixture_craft').click();await p.locator('#mixture_products button').filter({hasText:'Experiment: drink one dose'}).first().click();await p.getByRole('button',{name:'Save observed method',exact:true}).click();await p.getByRole('button',{name:'Queue learned method',exact:true}).click();assert(await p.locator('#mixture_cancel').isVisible());
   await p.locator('#save_button').click();const saved=JSON.parse(await p.evaluate(()=>localStorage.getItem('save data')));assert(saved.mixtures.job);
   await p.locator('#center_mode_back').focus();assert.equal(await p.locator('#center_mode_back').evaluate(n=>document.activeElement===n),true);await p.keyboard.press('Escape');assert(await p.locator('#location_actions_div').isVisible());
   await p.reload();await R.startFresh(p);await p.waitForTimeout(400);assert(await p.locator('#location_actions_div').isVisible());await p.locator('#village_mixing_open').click();assert(await p.locator('#mixture_cancel').isVisible());await shot(p,'running-batch-reloaded');await p.locator('#mixture_cancel').click();await back(p);
   record('queue-and-reload',{jobRetained:true,openViewReloadsToLocal:true});
   // A saved personal layout remains byte-for-byte browser-owned.
   const layout={version:1,mode:'dock',density:'comfortable',columns:[.27,.43,.30],modules:[{id:'skills',dock:'left',height:180,width:400,pinned:true,collapsed:true,order:0},{id:'messages',dock:'right',height:250,width:400,order:1}]};
   const storage={'yairpg.workspace.v1.desktop':JSON.stringify(layout)};const custom=await open(population,1366,768,storage);
   assert.equal(await custom.p.evaluate(()=>localStorage.getItem('yairpg.workspace.v1.desktop')),storage['yairpg.workspace.v1.desktop']);const shell=custom.p.locator('[data-module="skills"].workspace-module');assert.equal(await shell.getAttribute('data-pinned'),'true');assert(await shell.evaluate(n=>n.classList.contains('workspace-collapsed')));await custom.ctx.close();record('layout-compatibility',{layoutUnchanged:true,pin:true,collapse:true});
   await p.locator('#save_button').click();const dp=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const file=path.join(E,PHASE+'-export.save.txt');await(await dp).saveAs(file);const exported=JSON.parse(await p.evaluate(()=>localStorage.getItem('save data')));
   const imported=await open();const loaded=imported.p.waitForEvent('load');await imported.p.locator('#saved_file_input').setInputFiles(file);await loaded;await R.startFresh(imported.p);await imported.p.waitForTimeout(400);await imported.p.locator('#save_button').click();const restored=JSON.parse(await imported.p.evaluate(()=>localStorage.getItem('save data')));fs.writeFileSync(path.join(E,PHASE+'-import-debug.json'),JSON.stringify({exportedKeys:Object.keys(exported),restoredKeys:Object.keys(restored),errors:imported.p.errors,body:(await imported.p.locator('body').innerText()).slice(0,2400)},null,2));assert(restored.mixtures,'import lost mixture owner; see import-debug.json');assert.deepEqual(restored.mixtures.methods,exported.mixtures.methods);assert.equal(restored.character.name,exported.character.name);assert.deepEqual(imported.p.errors,[]);await imported.ctx.close();record('export-literal-file-import',{methodsPreserved:true,identityPreserved:true});
  }
  assert.deepEqual(p.errors,[]);await ctx.close();
  const fight=await open(precombat,w,h);await R.enterCombat(fight.p,{fightMs:2500});await shot(fight.p,'combat-'+w);
  const log=fight.p.locator('#message_box_div');const text=await log.innerText();assert(/damage|hits|attacks|defeated|health|misses/i.test(text),text);assert(await visibleInViewport(fight.p,'#message_box_div'));const height=await log.evaluate(n=>n.getBoundingClientRect().height);assert(height>300,'log height '+height);assert(await visibleInViewport(fight.p,'#message_controls'));assert.deepEqual(fight.p.errors,[]);record('combat-log-'+w,{height,combatMessages:true,filtersVisible:true});await fight.ctx.close();
 }
 await b.close();
})().catch(async e=>{console.error(e.stack);fs.writeFileSync(path.join(E,PHASE+'-failure.txt'),e.stack);if(b)await b.close();process.exitCode=1});

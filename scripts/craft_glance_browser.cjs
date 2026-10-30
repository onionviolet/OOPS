// Crafting glance evidence (CF1): fresh seeded origin, headless, 1920x1080 at 14 px and 21 px text. Run after npm run build
// with a static server (npm run serve) on YAIRPG_PORT. Writes PNGs and prints the glance text for a blocked and a ready recipe.
const fs=require('node:fs'),assert=require('node:assert/strict');
const {launchChrome}=require('./ui_helpers.cjs');
const {startFresh}=require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const url=`http://127.0.0.1:${process.env.YAIRPG_PORT||8123}/?test_hooks=1`,out='docs/representations/evidence/crafting';
fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await launchChrome(),errors=[];
 try{
  let c=await b.newContext({viewport:{width:1920,height:1080}}),p=await c.newPage();
  await p.goto(url);await p.waitForFunction(()=>window.simulationTestHooks);await startFresh(p);
  await p.evaluate(()=>window.saveProgress());const seed=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));await c.close();
  seed.global_flags.is_crafting_unlocked=true;for(const id of ['Rat tail','Piece of willow wood'])seed.inventories.person.main_character[JSON.stringify({id})]={count:3};
  for(const px of [14,21]){
   c=await b.newContext({viewport:{width:1920,height:1080}});await c.addInitScript(s=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(s))},seed);
   await c.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400&&!/favicon\.ico|fonts\/private/.test(r.url()))errors.push(r.status()+' '+r.url())});p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errors.push(m.text())});
   await p.goto(url);await p.waitForFunction(()=>window.simulationTestHooks);await startFresh(p);await p.evaluate(()=>window.simulationTestHooks.pause());
   if(px!==14)await p.addStyleTag({content:`html{font-size:${px}px !important}`});
   await p.evaluate(()=>window.openCraftingWindow());await p.locator('#crafting_window .recipe_div[data-recipe_id]').first().click();
   const blocked=await p.locator('#crafting_detail [data-craft-glance]').innerText();assert.match(blocked,/Can't craft yet/);assert.match(blocked,/Time\s+Instant/);assert.match(blocked,/Not graded/);
   const commit=p.locator('#crafting_detail [data-craft-commit]');assert.ok(await commit.isVisible());const box=await commit.boundingBox();assert.ok(box.y+box.height<=1080,'Craft button inside the viewport');
   for(const sel of ['[data-craft-glance]','[data-craft-blocked-reason]','[data-craft-chance]'])assert.ok(await p.locator('#crafting_detail '+sel).isVisible(),sel);
   await p.screenshot({path:`${out}/glance-blocked-${px}px.png`});console.log(`[${px}px blocked]\n${blocked}`);
   await p.locator('#crafting_window .recipe_div[data-recipe_id="Knotted chance charm"]').click();
   const ready=await p.locator('#crafting_detail [data-craft-glance]').innerText();assert.match(ready,/Ready: \d+ attempts? possible now/);assert.equal(await p.locator('#crafting_detail [data-craft-blocked-reason]').count(),0);
   await p.screenshot({path:`${out}/glance-ready-${px}px.png`});console.log(`[${px}px ready]\n${ready}`);
   await c.close();
  }
  assert.deepEqual(errors,[]);console.log('PASS');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

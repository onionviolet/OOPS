// D7 fresh disposable native journeys. Uses real UI, save, Export and literal Import.
const fs=require('node:fs'),assert=require('node:assert/strict');
const {launchChrome}=require('./ui_helpers.cjs');
const slice=Number(process.argv[2]||1),out=`docs/gm/dispatch/hp-world-2026-10-25/slice-${slice}`;
(async()=>{
 const browser=await launchChrome(),result={slice,errors:[],journeys:[]};
 try{
  for(const profile of slice>=4?['school','trade']:['school']){
   const context=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true});
   const page=await context.newPage();page.setDefaultTimeout(12000);
   page.on('pageerror',e=>result.errors.push(e.message));
   const P=`book.hp.${profile}`;
   await page.goto(`http://127.0.0.1:5107/?test_hooks=1&structured_candidate=${P}`);
   await page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});
   await page.evaluate(()=>window.simulationTestHooks.pause());
   await page.locator('#loading_screen_play_button').click();
   await page.waitForTimeout(350);
   const old=await page.evaluate(()=>window.simulationTestHooks.snapshot());
   assert.equal(old.expansion.actors.player.worldId,'base.frontier');
   const oldLiteral=await page.evaluate(()=>window.save_to_file());
   fs.writeFileSync('/tmp/hp-d7-old-save.json',JSON.stringify(old));
   await page.locator('#workspace_navigation select').first().selectOption('beginning');
   await page.locator('[data-structured-begin]').click();
   await page.waitForTimeout(350);
   const save=async()=>page.evaluate(()=>{window.saveProgress();return JSON.parse(localStorage.getItem('save data'));});
   const check=s=>{assert.equal(s.content_packs.structured.packId,P);assert.equal(s.expansion.actors.player.worldId,P+'.world');assert.equal(s.expansion.simulation.people.player.body.ownerId,'player');};
   check(await save());
   const act=async n=>{await page.locator(`[data-structured-action="${P}.${n}"]`).click();await page.waitForTimeout(300);};
   const step=async n=>{await page.evaluate(n=>window.advanceTicks(n),n);await page.waitForTimeout(300);};
   if(slice>=2&&profile==='school'){await act('lesson_charms');await step(30);const s=await save();assert.ok(s.expansion.simulation.powers.player[P+'.levitation']?.owned);}
   if(slice>=3&&profile==='school'){await act('practice_levitation');await step(3);await act('cast_levitation');assert.equal((await save()).inventories.person.main_character[JSON.stringify({id:P+'.raised_feather'})].count,1);if(slice>=4){await act('borrow_wand');await act('cast_levitation');await act('return_wand');await act('lesson_repair');await step(30);await act('practice_repair_glass');await step(3);await act('cast_repair_glass');assert.equal((await save()).inventories.person.main_character[JSON.stringify({id:P+'.glass_pane'})].count,1);}}
   if(profile==='trade'){await act('repair');await step(10);await act('walk_shop');await step(5);await act('deliver');await act('buy_fragments');await act('repay');assert.equal((await save())['current location'],P+'.shop');}
   const first=await save(),receipt=first.content_packs.structured;check(first);
   const hpDigest=s=>JSON.stringify({record:s.content_packs.structured,facts:s.expansion.actors.player,body:s.expansion.simulation.people.player,known:s.expansion.simulation.knowledge.player,powers:s.expansion.simulation.powers.player,inventory:s.inventories.person.main_character});
   const before=hpDigest(first);
   assert.match(await page.locator('.scene-calendar').innerText(),profile==='school'?/Hogwarts term/:/Diagon Alley trade/);
   await page.reload();await page.locator('#loading_screen_play_button').waitFor({state:'visible'});await page.evaluate(()=>window.simulationTestHooks.pause());await page.locator('#loading_screen_play_button').click();await page.waitForTimeout(350);
   const reloaded=await save();check(reloaded);assert.equal(hpDigest(reloaded),before);
   const literal=await page.evaluate(()=>window.save_to_file());
   await Promise.all([page.waitForEvent('load'),page.evaluate(x=>window.load_progress(x),literal)]);
   await page.locator('#loading_screen_play_button').waitFor({state:'visible'});await page.evaluate(()=>window.simulationTestHooks.pause());await page.locator('#loading_screen_play_button').click();await page.waitForTimeout(300);
   const imported=await save();check(imported);assert.equal(hpDigest(imported),before);
   await page.waitForFunction(()=>document.documentElement.dataset.startScreen==='closed');
   await page.locator('#workspace_navigation select').first().selectOption('beginning');
   await page.screenshot({path:`${out}-${profile}.png`,fullPage:true});
   fs.writeFileSync(`/tmp/hp-d7-slice-${slice}-${profile}.json`,JSON.stringify(imported));
   if(slice>=4){
    const matrix=[];
    for(const [width,height]of [[1920,1080],[1536,864]])for(const size of [14,21]){
     await page.setViewportSize({width,height});
     await page.locator('#workspace_navigation select').first().selectOption('customization');
     await page.locator('[aria-label="Font size"]').fill(String(size));await page.locator('[aria-label="Font size"]').dispatchEvent('change');
     await page.getByRole('button',{name:'Apply and save',exact:true}).first().click();
     await page.locator('#workspace_navigation select').first().selectOption('beginning');await page.waitForTimeout(250);
     const geometry=await page.locator('#structured_pack_panel').evaluate(el=>({font:parseFloat(getComputedStyle(el).fontSize),pageOverflow:document.documentElement.scrollWidth>innerWidth+1}));
     assert.equal(geometry.font,size);assert.equal(geometry.pageOverflow,false);
     await page.screenshot({path:`${out}-${profile}-${width}-${size}.png`});matrix.push({width,height,size,...geometry});
    }
    result.journeys.push({profile,matrix});
   }

   // Old default save imports without creating HP content or rewriting its body.
   await Promise.all([page.waitForEvent('load'),page.evaluate(s=>window.load_progress(s),oldLiteral)]);await page.locator('#loading_screen_play_button').waitFor({state:'visible'});await page.evaluate(()=>window.simulationTestHooks.pause());await page.locator('#loading_screen_play_button').click();await page.waitForTimeout(300);
   const restored=await save();assert.equal(restored.expansion.actors.player.worldId,'base.frontier');assert.equal(restored.content_packs?.structured,undefined);
   result.journeys.push({profile,instance:receipt.instanceId,saveReloadImportEqual:true,oldSaveUnchanged:true});
   await context.close();
  }
 }finally{await browser.close();fs.writeFileSync(out+'.json',JSON.stringify(result,null,2));}
 assert.deepEqual(result.errors,[]);console.log(JSON.stringify(result));
})().catch(e=>{console.error(e);process.exitCode=1;});

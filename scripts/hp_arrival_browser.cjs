// Native E3 journey: no localhost query parameters, actual Save/Export/file Import.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {launchChrome}=require('./ui_helpers.cjs');
const out='docs/gm/dispatch/hp-arrival-2026-10-25',base='http://127.0.0.1:5113';
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const write=(name,value)=>fs.writeFileSync(`${out}/${name}`,JSON.stringify(value,null,2));
(async()=>{
 const browser=await launchChrome(),result={base,queryParameters:false,errors:[],journeys:[]};
 const boot=async page=>{await page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await page.locator('#loading_screen_play_button').click();await page.waitForFunction(()=>document.documentElement.dataset.startScreen==='closed');};
 const save=async(page,name)=>{await page.locator('#save_button').click();const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));if(name)write(name+'.json',s);return s;};
 const exportFile=async(page,name)=>{const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);const path=`${out}/${name}.txt`;await download.saveAs(path);return path;};
 const importFile=async(page,path)=>{await Promise.all([page.waitForEvent('load'),page.locator('#saved_file_input').setInputFiles(path)]);await boot(page);};
 const beginning=page=>page.locator('#workspace_navigation select').first().selectOption('beginning');
 const digest=s=>JSON.stringify({record:s.content_packs.structured,inventory:s.inventories.person.main_character,resources:s.expansion.actors.player.resources,completed:s.expansion.actors.player.completed,owners:s.expansion.simulation.owners,powers:s.expansion.simulation.powers,body:s.expansion.simulation.people.player.body});
 const matrix=async(page,name)=>{
  const rows=[];
  for(const [width,height] of [[1920,1080],[1536,864]])for(const size of [14,21]){
   await page.setViewportSize({width,height});await page.locator('#workspace_navigation select').first().selectOption('customization');
   await page.locator('[aria-label="Font size"]').fill(String(size));await page.locator('[aria-label="Font size"]').dispatchEvent('change');
   await page.getByRole('button',{name:'Apply and save',exact:true}).first().click();await beginning(page);await page.waitForTimeout(300);
   if(name.endsWith('-arrival')){await page.locator('[data-structured-begin]').scrollIntoViewIfNeeded();await page.locator('#structured_pack_panel').evaluate(el=>{for(let p=el.parentElement;p;p=p.parentElement)if(p.scrollHeight>p.clientHeight)p.scrollTop=0;});await page.waitForTimeout(300);}
   const geometry=await page.locator('#structured_pack_panel').evaluate(el=>({font:parseFloat(getComputedStyle(el).fontSize),pageOverflow:document.documentElement.scrollWidth>innerWidth+1,visible:el.getBoundingClientRect().width>0,confirmVisible:(()=>{const b=el.querySelector('[data-structured-begin]');if(!b)return null;const r=b.getBoundingClientRect();let visible=r.top>=0&&r.bottom<innerHeight;for(let p=b.parentElement;p;p=p.parentElement){const style=getComputedStyle(p);if(/auto|scroll|hidden/.test(style.overflowY)){const q=p.getBoundingClientRect();visible=visible&&r.top>=q.top&&r.bottom<=q.bottom;}}return visible;})()}));
   assert.equal(geometry.font,size);assert.equal(geometry.pageOverflow,false);assert.equal(geometry.visible,true);if(name.endsWith('-arrival'))assert.equal(geometry.confirmVisible,true);
   await page.screenshot({path:`${out}/${name}-${width}-${size}.png`});rows.push({width,height,size,...geometry});
  }
  return rows;
 };
 try{
  // Exact pre-E3 master source, rebuilt separately; assets shared by read-only server.
  const oldContext=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true}),oldPage=await oldContext.newPage();
  oldPage.on('pageerror',e=>result.errors.push('baseline: '+e.message));
  await oldPage.goto(base+'/__baseline/');await boot(oldPage);
  const old=await save(oldPage,'old-master-default');assert.equal(old.expansion.actors.player.worldId,'base.frontier');
  const oldLiteral=await exportFile(oldPage,'old-master-default');await oldContext.close();
  for(const profile of ['school','trade']){
   const context=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true}),page=await context.newPage();page.setDefaultTimeout(15000);
   page.on('pageerror',e=>result.errors.push(profile+': '+e.message));
   page.on('dialog',dialog=>dialog.dismiss());
   await page.goto(base+'/');await boot(page);
   const pre=await save(page,profile+'-pre-entry');assert.equal(pre.expansion.actors.player.worldId,'base.frontier');assert.equal(pre.content_packs.structured,undefined);const preLiteral=await exportFile(page,profile+'-pre-entry');
   await beginning(page);
   const select=()=>page.locator('[data-structured-choice="life"]');
   // Both choices reachable; preview/cancel mint no stock and do not enroll.
   for(const other of ['school','trade']){await select().selectOption('book.hp.'+other);assert.match(await page.locator('#structured_pack_panel').innerText(),/Proposed supply-week arrival/);}
   await page.locator('[data-structured-choice-cancel]').click();
   const cancelled=await save(page,profile+'-cancelled');assert.equal(cancelled.content_packs.structured,undefined);assert.deepEqual(cancelled.inventories,pre.inventories);assert.equal(cancelled.character.money,pre.character.money);
   // Preview does not survive reload as a committed beginning.
   await select().selectOption('book.hp.'+profile);await page.reload();await boot(page);await beginning(page);assert.equal(await select().inputValue(),'');
   await select().selectOption('book.hp.'+profile);
   const previewMatrix=await matrix(page,profile+'-arrival');
   await page.getByRole('button',{name:'Confirm arrival',exact:true}).click();
   const P='book.hp.'+profile,K=n=>JSON.stringify({id:P+'.'+n});
   const entered=await save(page,profile+'-entered');assert.equal(entered.content_packs.structured.packId,P);assert.equal(entered.expansion.actors.player.worldId,P+'.world');
   assert.equal(entered.character.money,pre.character.money);
   for(const [key,row]of Object.entries(pre.inventories.person.main_character))assert.deepEqual(entered.inventories.person.main_character[key],row,'retained carried cargo');
   assert.equal(entered.inventories.person.main_character[K('wand')].count,1);assert.equal(await select().count(),0);assert.equal(await page.locator('[data-structured-begin]').count(),0);
   // A real starting activity and its cancellation settle through existing owners.
   const action=profile==='school'?'study_notes':'repair',material=profile==='school'?'paper':'glass_shards';
   const initialCount=entered.inventories.person.main_character[K(material)].count;
   await page.locator(`[data-structured-action="${P}.${action}"]`).click();
   const reserved=await save(page,profile+'-reserved');assert.equal(reserved.inventories.person.main_character[K(material)].count,initialCount-1);assert.equal(reserved.expansion.simulation.jobs.length,1);
   await page.locator('[data-structured-cancel]').click();const refunded=await save(page,profile+'-refunded');assert.equal(refunded.inventories.person.main_character[K(material)].count,initialCount);
   await page.locator(`[data-structured-action="${P}.${action}"]`).click();
   await page.waitForFunction(({P,action})=>{return document.querySelector('[data-structured-row=\"'+P+'.'+action+'\"]')?.textContent.includes('Settled completions: 1.');},{P,action},{timeout:30000});
   const settled=await save(page,profile+'-settled'),before=digest(settled);
   await page.reload();await boot(page);const reloaded=await save(page,profile+'-reloaded');assert.equal(digest(reloaded),before);
   const literal=await exportFile(page,profile+'-export');await importFile(page,literal);const imported=await save(page,profile+'-imported');assert.equal(digest(imported),before);assert.equal(imported.inventories.person.main_character[K('wand')].count,1);
   await beginning(page);const activeMatrix=await matrix(page,profile+'-active');
   // Real D7 browser fixture, before E3, admitted unchanged by its exact receipt.
   const d7Path=`/tmp/hp-d7-slice-4-${profile}.json`;
   const d7Text=fs.readFileSync(d7Path,'utf8'),d7=JSON.parse(d7Text);
   fs.writeFileSync(`${out}/d7-${profile}-input.json`,d7Text);
   const d7Literal=`${out}/d7-${profile}-input.txt`;fs.writeFileSync(d7Literal,'YAIR-UTF8-1:'+Buffer.from(d7Text).toString('base64'));
   await importFile(page,d7Literal);const d7Restored=await save(page,profile+'-d7-imported');
   assert.equal(digest(d7Restored),digest(d7));
   // Exact old-master export imports without HP enrollment or extra cargo.
   await importFile(page,oldLiteral);const restored=await save(page,profile+'-old-master-imported');assert.equal(restored.expansion.actors.player.worldId,'base.frontier');assert.equal(restored.content_packs.structured,undefined);assert.deepEqual(restored.inventories,old.inventories);assert.equal(restored.character.money,old.character.money);
   // Same-bundle pre-entry default save also remains unselected.
   await importFile(page,preLiteral);const preRestored=await save(page,profile+'-pre-entry-imported');assert.equal(preRestored.content_packs.structured,undefined);assert.deepEqual(preRestored.inventories,pre.inventories);
   result.journeys.push({profile,previewMatrix,activeMatrix,cancelUnchanged:true,reloadClearsUncommittedPreview:true,retainedCargo:true,oneStartingWand:true,reservationRefund:true,realTimeActivity:true,saveReloadExportLiteralImport:true,oldMasterImport:true,d7BrowserFixtureImport:true,preEntryImport:true});
   await context.close();
  }
 }finally{await browser.close();result.hashes=Object.fromEntries(fs.readdirSync(out).filter(n=>/\.(png|json|txt)$/.test(n)&&n!=='browser-result.json').map(n=>[n,sha(fs.readFileSync(`${out}/${n}`))]));write('browser-result.json',result);}
 assert.deepEqual(result.errors,[]);console.log(JSON.stringify(result.journeys));
})().catch(e=>{console.error(e);process.exitCode=1;});

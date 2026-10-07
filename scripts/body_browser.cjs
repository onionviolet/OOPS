// Rebuilt body/condition/NPC proof using only a separate generated native save.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.YAIRPG_PLAYWRIGHT || 'playwright');
const {openNotebook}=require('./ui_helpers.cjs');
const url=process.env.YAIRPG_PROOF_URL || 'http://127.0.0.1:18503/';
const output=process.env.YAIRPG_PROOF_DIR || '/tmp/yairpg-body-proof';fs.mkdirSync(output,{recursive:true});
const fixture=JSON.parse(fs.readFileSync('/Users/weiwei/.codex/visualizations/2026/10/03/01a10034-a55a-7643-b09e-e504af3f2b38/bio-review/generated-bio-review.json','utf8'));
const wood=JSON.stringify({id:'Rough wood log'}),kit=JSON.stringify({id:'Prepared survey kit'});
fixture.character.money=30;fixture.inventories.person.main_character[wood]={count:5};fixture['current location']='Village';
fixture.availabilities.person.oldCraftsman=1;fixture.availabilities.dialogue.oldCraftsman=1;fixture.availabilities.location.Shack|=1;
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.YAIRPG_CHROME}),errors=[],warnings=[],findings=[];
 const open=async()=>{const context=await browser.newContext({viewport:{width:1600,height:1100}});await context.addInitScript(s=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(s));},fixture);
  const page=await context.newPage();page.setDefaultTimeout(16000);page.on('pageerror',e=>errors.push(e.stack));page.on('console',m=>{if(['warning','error'].includes(m.type()))warnings.push(m.text());});await page.goto(url);await page.getByText('PLAY',{exact:true}).click();return {page,context};};
 const save=async page=>{await page.evaluate(()=>window.saveProgress());return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
 const panel=async page=>{await openNotebook(page);await page.locator('[data-notebook-view="practice"]').click();if(!await page.locator('#body_panel').evaluate(n=>n.open))await page.locator('#body_panel > summary').click();};
 const click=async(page,id)=>{
  if(id.startsWith('body.show_')) {
   await page.locator('[data-notebook-view="people"]').click();if(!await page.locator('#simulation_panel').evaluate(n=>n.open))await page.locator('#simulation_panel > summary').click();
   if(!await page.locator('#workshop_conversation').evaluate(n=>n.open))await page.locator('#workshop_conversation > summary').click();
   await page.locator(`[data-simulation="${id}"]`).click();await page.locator('[data-notebook-view="practice"]').click();
  }else await page.locator(`[data-body-command="${id}"]`).click();
 };
 const finish=page=>page.waitForFunction(()=>{const s=JSON.parse(localStorage.getItem('save data')).expansion;return !!s.simulation && !s.simulation.jobs.some(j=>j.actorId==='player');});
 const reload=async page=>{await page.reload();await page.getByText('PLAY',{exact:true}).click();await panel(page);};
 let {page,context}=await open();const fingerprint=await page.evaluate(()=>performance.getEntriesByType('resource').find(e=>e.name.includes('/dist/bundle.js?version='))?.name);
 assert.ok(fingerprint.endsWith(fs.readFileSync('index.html','utf8').match(/dist\/bundle\.js\?version=[^&"]+/)[0]));
 await page.getByText('Talk to someone',{exact:false}).click();await page.locator('[data-dialogue="oldCraftsman"]').click();await page.locator('[data-textline="hello"]').click();await page.locator('.end_dialogue_button').click();
 const original=await save(page),quests=structuredClone(original.quests),profile=structuredClone(original.character.bio);await panel(page);
 assert.equal(original.expansion.simulation,null);await click(page,'body.begin');const begun=await save(page);
 assert.equal(begun.expansion.actors.player.facts['body.enrolled'],true);assert.equal(begun.expansion.chronicle,null);assert.equal(begun.character.money,30);
 assert.equal(begun.expansion.simulation.faculties.player['body.natural_balance'].awakened,false);
 fs.writeFileSync(path.join(output,'start-save.json'),JSON.stringify(begun));
 await page.locator('#character_show_bio').click();assert.equal(await page.locator('[data-bio-section="heritage"]').isVisible(),false);
 await click(page,'body.study_balance');const pending=await save(page);await reload(page);assert.equal((await save(page)).expansion.simulation.jobs[0].due,pending.expansion.simulation.jobs[0].due);await finish(page);
 const learned=await save(page);assert.equal(learned.expansion.actors.player.sources['body.natural_balance'].origin,'inherited');assert.equal(learned.expansion.simulation.knowledge.oldCraftsman,undefined);
 await page.locator('#character_show_bio').click();await page.locator('[data-bio-section="heritage"] summary').click();assert.equal(await page.locator('[data-bio-entry="body.natural_balance"]').isVisible(),true);
 assert.match(await page.locator('[data-bio-entry="body.natural_balance"]').textContent(),/ancestry uncertain/);
 await click(page,'body.show_footing');const seen=await save(page);assert.deepEqual(Object.keys(seen.expansion.simulation.knowledge.oldCraftsman),['person.player.steady_footing']);
 assert.ok(!/Natural balance|inherited/.test(JSON.stringify(seen.expansion.simulation.knowledge.oldCraftsman)));
 findings.push('Existing native craft greeting remains the access gate. One atomic opt-in enrolls body/local services without age or rewards. Latent inherited balance stays absent from Bio until a saved/reloaded discovery; NPC knowledge begins only after demonstrated footing and omits its origin.');

 await click(page,'body.grip_drill');const paid=await save(page);assert.ok(paid.character.stamina_to_full>seen.character.stamina_to_full);assert.equal(paid.expansion.simulation.jobs[0].costs[0].amount,-2);
 await page.locator('[data-body-cancel]').click();const cancelled=await save(page);assert.equal(cancelled.expansion.actors.player.resources.grip_practice,undefined);assert.equal(cancelled.levels.person.main_character.skill_xp.Climbing,original.levels.person.main_character.skill_xp.Climbing);
 await click(page,'body.grip_drill');await reload(page);await finish(page);const strained=await save(page);assert.ok(strained.expansion.simulation.conditions.player['body.sore_hands']);
 assert.equal(await page.locator('[data-body-command="body.grip_drill"]').isEnabled(),false);
 await page.locator('#character_show_bio').click();await page.locator('[data-bio-section="conditions"] summary').click();assert.match(await page.locator('[data-bio-entry="body.sore_hands"]').textContent(),/remaining/);
 await click(page,'body.show_soreness');await click(page,'body.recover');await reload(page);await finish(page);
 await click(page,'body.grip_drill');await finish(page);await click(page,'body.recover');await finish(page);await click(page,'body.condition_grip');await click(page,'body.show_calluses');
 const trained=await save(page);assert.equal(trained.levels.person.main_character.skill_xp.Climbing,original.levels.person.main_character.skill_xp.Climbing+12);assert.equal(trained.expansion.actors.player.resources.grip_practice,2);
 assert.equal(trained.expansion.actors.player.sources['body.conditioned_grip'].origin,'trained');assert.equal(trained.expansion.simulation.people.player.body['palms.callused'],true);
 assert.equal(await page.locator('[data-body-command="body.condition_grip"]').isVisible(),false);
 findings.push('Timed drills spend native stamina and grant native Climbing XP only on completion. Cancellation forfeits stamina without XP/practice. Soreness blocks another drill; saved recovery removes the condition while retaining both drills, trained grip and callused palms.');

 await click(page,'body.rough_kit');const reserved=await save(page);assert.equal(reserved.character.money,29);assert.equal(reserved.inventories.person.main_character[wood].count,4);
 await page.locator('[data-body-cancel]').click();const refunded=await save(page);assert.equal(refunded.character.money,30);assert.equal(refunded.inventories.person.main_character[wood].count,5);
 await click(page,'body.rough_kit');await reload(page);await finish(page);const scraped=await save(page);assert.equal(scraped.inventories.person.main_character[kit].count,1);assert.equal(scraped.expansion.actors.player.sources['body.palm_mark'].origin,'acquired');
 fs.writeFileSync(path.join(output,'scraped-save.json'),JSON.stringify(scraped));
 await click(page,'body.show_mark');await click(page,'body.recover');await reload(page);await finish(page);const settled=await save(page);
 assert.equal(settled.expansion.simulation.conditions.player['body.scraped_hands'],undefined);assert.equal(settled.expansion.simulation.people.player.body['palms.marked'],true);
 assert.equal(settled.expansion.simulation.relationships.oldCraftsman.player.axes.familiarity,4);assert.equal(await page.locator('[data-simulation="body.show_mark"]').isVisible(),false);
 assert.deepEqual(settled.quests,quests);assert.deepEqual(settled.character.bio,profile);assert.equal(settled.character.money,29);assert.equal(settled.inventories.person.main_character[kit].count,1);
 await page.locator('#character_show_bio').click();await page.locator('[data-bio-section="heritage"] summary').click();await page.locator('[data-bio-section="learned"] summary').click();
 assert.match(await page.locator('[data-bio-entry="body.palm_mark"]').textContent(),/Faint palm scar/);assert.match(await page.locator('[data-bio-entry="body.conditioned_grip"]').textContent(),/Hand control/);
 await page.screenshot({path:path.join(output,'body-record.png'),fullPage:true});fs.writeFileSync(path.join(output,'review-save.json'),JSON.stringify(settled));
 const encoded=await page.evaluate(()=>window.save_to_file());await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'generated-body.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);await page.getByText('PLAY',{exact:true}).click();await panel(page);const imported=await save(page);
 assert.equal(imported.character.money,29);assert.equal(imported.inventories.person.main_character[kit].count,1);assert.equal(imported.expansion.actors.player.resources.grip_practice,2);assert.equal(imported.expansion.actors.player.sources['body.natural_balance'].origin,'inherited');assert.deepEqual(imported.quests,quests);
 findings.push('Rough-kit supplies reserve/refund and pay once. Recovery clears the scrape while preserving an acquired scar. Four specific demonstrations create four directed memories/familiarity with no repeat button, private origin or original quest rewrite. Native encoded import/reload keeps money, kit, training, traits and marks without duplicate rewards.');await context.close();

 ({page,context}=await open());await panel(page);
 await page.evaluate(()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){
  if(key==='save data' && JSON.parse(value).expansion?.actors.player.facts['body.enrolled']) {window.bodyRejectedBytes=localStorage.getItem(key);throw new Error('Injected body quota');}
  return original.call(this,key,value);
 };});await click(page,'body.begin');assert.equal(await page.evaluate(()=>localStorage.getItem('save data')),await page.evaluate(()=>window.bodyRejectedBytes));
 assert.equal(await page.locator('[data-body-command="body.begin"]').isVisible(),true);assert.ok((await page.locator('#body_panel').textContent()).includes('saving failed'));
 await reload(page);assert.equal((await save(page)).expansion.simulation,null);
 findings.push('Injected storage failure leaves exact original bytes, no partial local-service enrollment, trait or resource publication. Reload restores the original optional body choice.');
 const result={url,fingerprint,findings,errors,warnings,generatedSavesOnly:true};fs.writeFileSync(path.join(output,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));assert.deepEqual(errors,[]);await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});

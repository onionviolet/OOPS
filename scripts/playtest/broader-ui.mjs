import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,join} from 'node:path';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
import {defaultCustomizationState} from '../../src/customization_profiles.js';
const root=resolve(process.argv[2]),out=resolve(process.argv[3]),phase=process.argv[4]||'sample';await mkdir(out,{recursive:true});
const server=await serve(root),s=new Session({url:server.url+'?test_hooks=1',seed:87,wall:Date.UTC(2026,9,26,15),hooks:{beforeOpen:async c=>c.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}))}});
const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));delete seed.availabilities.recipe.undefined;delete seed.availabilities.recipe['recipe/undefined'];seed.customization=defaultCustomizationState();seed.global_flags.is_crafting_unlocked=true;if(phase!=='sample'){seed.levels.person.main_character.skill_xp.Breathing=100;seed.levels.person.main_character.skill_xp.Combat=100;}seed.inventories.person.main_character[JSON.stringify({id:'Rat meat chunks'})]={count:4};
const receipt={phase,fixture:'generated broader-ui-mid: perf/mid plus cooking unlock and four rat-meat chunks; empty private-pack manifest',root,bundleSha256:createHash('sha256').update(await readFile(join(root,'dist/bundle.js'))).digest('hex'),checks:[],samples:[]};let p;
const shot=async n=>p.screenshot({path:join(out,n+'.png')});
const pause=async()=>{await p.waitForTimeout(450);};
const sample=async(family)=>{receipt.samples.push({family,task:await p.locator('#main_content').getAttribute('data-center-task'),text:(await p.locator('body').innerText()).slice(0,14000)});};
try{await s.start();await s.open(seed);p=s.page;await pause();await shot('idle-1920-14');await sample('navigation/place/condition/items/reports');
await p.locator('#inventory_content_div .item_name').filter({hasText:'Cheap leather pants'}).first().click();await pause();await shot('item-selected');
const detail=p.locator('#proto23_item_detail');const beforeTask=await p.locator('#main_content').getAttribute('data-center-task');await detail.locator('.shell-item-more > summary').click();await pause();receipt.moreActions={beforeTask,afterTask:await p.locator('#main_content').getAttribute('data-center-task')};await shot('more-actions');
if(phase==='sample'){
 await p.keyboard.press('Escape');
 for(const name of ['skills','records','condition','display']){const select=p.locator('#workspace_navigation select').first();const value=await select.locator('option').evaluateAll((ns,key)=>ns.find(n=>n.value===key)?.value,name);if(value){await select.selectOption(value);await pause();await sample(name);await shot(name);await p.keyboard.press('Escape');}}
 await p.locator('.choice_craft').click();await pause();await sample('crafting');await shot('crafting');
 receipt.nav=await p.locator('#workspace_navigation').innerText();
}else{
 assert.equal(receipt.moreActions.afterTask,beforeTask,'local disclosure preserves task');
 await p.getByRole('button',{name:'Close item',exact:true}).click();
 for(const [width,height,size]of [[1920,1080,14],[1920,1080,21],[1800,1040,14],[1800,1040,21],[1536,864,14],[1536,864,21]]){
  const f=structuredClone(seed);f.customization.profiles.Default.settings.typography.size=size;await s.open(f);p=s.page;await p.setViewportSize({width,height});await pause();await p.evaluate(()=>document.fonts.ready);
  const suffix=`${width}-${size}`,task=()=>p.locator('#main_content').getAttribute('data-center-task');
  const inv=p.locator('[data-control-box="inventory"] > button');assert.match(await inv.innerText(),/Find \/ filter/);await inv.click();
  const find=p.getByRole('searchbox',{name:'Find inventory item',exact:true});await find.fill('pants');await p.keyboard.press('Escape');assert(await inv.evaluate(n=>n===document.activeElement));
  const item=p.locator('#inventory_content_div .item_name').filter({hasText:'Cheap leather pants'}).first();await item.click();await pause();
  const selected=p.locator('#proto23_item_detail');const selectedTitle=await selected.locator('.shell-item-title').innerText();
  await selected.locator('.shell-item-more > summary').click();await pause();assert.equal(await task(),null);assert(await selected.locator('.shell-item-more').evaluate(n=>n.open));
  await shot(`local-item-${suffix}`);
  await selected.getByRole('button',{name:'Equip',exact:true}).click();await pause();assert.match(await selected.innerText(),/Equipped · legs/);
  await selected.getByRole('button',{name:'Take off',exact:true}).click();await pause();assert.match(await selected.locator('.shell-item-title').innerText(),/slot · empty/);assert.equal(await selected.getByRole('button',{name:'Take off',exact:true}).count(),0);assert.match(await selected.innerText(),/Choose carried equipment/);
  await selected.getByRole('button',{name:'Cheap leather pants',exact:true}).click();await pause();
  await inv.click();await find.fill('');await p.keyboard.press('Escape');
  const bread=p.locator('#inventory_content_div > [data-character_item]').filter({has:p.locator('.item_name').filter({hasText:'Stale bread'})});await bread.focus();await pause();assert.equal(await selected.locator('.shell-item-title').innerText(),selectedTitle,'focus preview does not select');assert(await p.locator('#shell_item_preview').isVisible());await p.locator('#shell_item_preview .shell-preview-footer button').focus();await p.keyboard.press('Escape');assert(await bread.evaluate(n=>n===document.activeElement));assert.equal(await p.locator('#shell_item_preview').isVisible(),false);assert.equal(await task(),null);
  await selected.getByRole('button',{name:'Full item ›',exact:true}).click();await pause();assert.equal(await task(),'workspace:shell-detail');await p.keyboard.press('Escape');await pause();assert.equal(await task(),null);await selected.getByRole('button',{name:'Close item',exact:true}).click();
  // Recipe view uses the same disclosure primitive but commits a native making command.
  const craft=p.locator('#workspace_pane_navigation [data-panel-path="crafting"]');await craft.click();await pause();assert.equal(await task(),'crafting');
  const box=p.locator('[data-control-box="crafting"] > button');assert.match(await box.innerText(),/Filter/);await box.click();await p.locator('#crafting_makeable_filter').check();await p.keyboard.press('Escape');assert(await box.evaluate(n=>n===document.activeElement));assert.equal(await task(),'crafting');
  await p.locator('#crafting_mainpage_buttons [data-crafting_category="cooking"]').click();
  await p.locator('[data-crafting_category="cooking"][data-crafting_subcategory="items"] [data-recipe_id="Roasted rat meat"] .recipe_item_name').click();await pause();
  const old=await s.save();await p.locator('#crafting_detail [data-craft-commit]').click();await pause();assert.equal((await s.save()).total_crafting_attempts,old.total_crafting_attempts+1);await shot(`crafting-${suffix}`);
  // A list with no matching recipes gives an explicit empty result, then clears in place.
  await box.click();await p.locator('#crafting_makeable_filter').uncheck();await p.keyboard.press('Escape');
  await p.locator('#crafting_mainpage_buttons [data-crafting_category="crafting"]').click();
  await p.locator('[data-crafting_category="crafting"][data-crafting_subcategory="items"] [data-recipe_id="Wolf trophy"] .recipe_item_name').click();await pause();assert(await p.locator('#crafting_detail [data-craft-blocked-reason]').isVisible());
  const blocked=await s.save();const refused=p.locator('#crafting_detail [data-craft-commit]');assert.equal(await refused.getAttribute('aria-disabled'),'true');await refused.focus();await p.keyboard.press('Enter');assert.equal((await s.save()).total_crafting_attempts,blocked.total_crafting_attempts);await shot(`missing-recipe-${suffix}`);
  await p.keyboard.press('Escape');await pause();assert.equal(await task(),null);assert(await craft.evaluate(n=>n===document.activeElement),'Back returns focus to actual Crafting opener');
  // Journal and skills adjust their own native choices; Back preserves those choices.
  const journal=p.locator('#workspace_navigation [data-panel-path="records"]').first();await journal.click();await pause();const quests=p.locator('[data-control-box="quests"] > button');await quests.click();await p.locator('#quest_hiding_button').check();await p.keyboard.press('Escape');assert(await quests.evaluate(n=>n===document.activeElement));await p.keyboard.press('Escape');await pause();assert(await journal.evaluate(n=>n===document.activeElement));await journal.click();await pause();await quests.click();assert(await p.locator('#quest_hiding_button').isChecked());await p.keyboard.press('Escape');await p.keyboard.press('Escape');
  await p.keyboard.press('Alt+k');await pause();assert.equal(await task(),'workspace:skills');const skills=p.locator('[data-control-box="skills"] > button');assert.match(await skills.innerText(),/Sort \/ filter/);const skillCount=p.locator('#skill_list').locator('xpath=preceding-sibling::div[contains(@class,"ui-list-tools")]').locator('output');assert.match(await skillCount.innerText(),/skills/);assert(!/stacks|items/.test(await skillCount.innerText()));
  const skillFind=p.getByRole('searchbox',{name:'Find skill',exact:true});const categoryStates=await p.locator('#skill_list .skill_category_div').evaluateAll(ns=>ns.map(n=>n.classList.contains('skill_category_expanded')));const skillName=await p.locator('#skill_list .skill_bar_name').first().textContent();await skillFind.fill(skillName.trim());await pause();assert(await p.locator('#skill_list .skill_div:visible').count()>0,'skill search reveals matching collapsed entries');await skillFind.fill('no-such-visible-skill');await pause();assert.match(await p.locator('#skill_list + .ui-list-empty').innerText(),/No skills match/);await skillFind.fill('');await pause();assert.deepEqual(await p.locator('#skill_list .skill_category_div').evaluateAll(ns=>ns.map(n=>n.classList.contains('skill_category_expanded'))),categoryStates);await skills.click();await p.locator('#options_hide_max_level_skills').check();await p.keyboard.press('Escape');assert(await skills.evaluate(n=>n===document.activeElement));await shot(`skills-${suffix}`);await p.keyboard.press('Escape');
  // Filter report kinds without clearing occurrence-time history.
  const reports=p.locator('[data-control-box="reports"] > button');const history=await p.locator('#message_box_div .message_common').allTextContents();await reports.click();const toggles=p.locator('#control_box_reports [data-native-filter]');const count=await toggles.count();for(let i=0;i<count;i++)if(await toggles.nth(i).getAttribute('aria-pressed')==='true')await toggles.nth(i).click();await pause();assert(await p.locator('.shell-reports-empty').isVisible());assert.equal(await p.locator('#message_box_div .message_common:visible').count(),0,'native categories actually hide report rows');await shot(`reports-filter-${suffix}`);for(let i=0;i<count;i++)await toggles.nth(i).click();await p.keyboard.press('Escape');assert(await reports.evaluate(n=>n===document.activeElement));assert.deepEqual(await p.locator('#message_box_div .message_common').allTextContents(),history,'filters preserve event history');
  const geometry=await p.evaluate(()=>({page:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],font:getComputedStyle(document.querySelector('#inventory_div')).fontSize}));assert.equal(geometry.font,`${size}px`);assert(geometry.page[0]<=width&&geometry.page[1]<=height,'ordinary play within viewport');await shot(`resume-${suffix}`);receipt.checks.push({width,height,size,geometry,journeys:'Inventory find/inspect/equip/take-off/preview/full/return; recipe filter/craft/refusal/return; Journal and Skills choice/return; Reports all-hidden/recover'});
 }

}
receipt.errors=s.errors;assert.deepEqual(s.errors,[]);receipt.status='PASS';
}catch(error){receipt.status='FAIL';receipt.error=error.stack;if(p)await shot('failure').catch(()=>{});throw error;}finally{await writeFile(join(out,'result.json'),JSON.stringify(receipt,null,2));await s.close();await server.close();}console.log(JSON.stringify({status:receipt.status,moreActions:receipt.moreActions,samples:receipt.samples.map(x=>x.family)}));

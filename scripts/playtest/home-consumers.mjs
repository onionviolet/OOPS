import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,join} from 'node:path';
import {Session} from './lib.mjs';
import {serve} from '../perf/lib.mjs';
const root=resolve(process.argv[2]),out=resolve(process.argv[3]||'/tmp/oops-home-consumers-proof');await mkdir(out,{recursive:true});
const server=await serve(root),session=new Session({url:server.url+'?test_hooks=1',seed:19,wall:Date.UTC(2026,9,21),opTimeout:12000});let page;
const receipt={setup:'Native homeowner beginning; synthetic dishes/incense/raw-meat inventory and global Cooking/Meditation discovery prerequisites. Native install, cooking and meditation thereafter.',checks:[]};
const key=id=>JSON.stringify({id});
async function home(){await page.getByRole('combobox',{name:'Other known panels'}).selectOption('homes');}
async function click(id){const b=page.locator(`[data-home-action=${JSON.stringify(id)}]`);await b.evaluate(n=>{for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});assert.equal(await b.isEnabled(),true);await b.click();}
const xp=(s,id)=>s.skills?.[id]?.total_xp??s.levels?.person?.main_character?.skill_xp?.[id]??0;
try{
    await session.start();await session.open();page=session.page;await home();await click('start:homeowner');
    const seed=await session.save();for(const id of ['Home wooden tableware','Home incense holder','Rat meat chunks'])seed.inventories.person.main_character[key(id)]={count:2};
    seed.global_flags.is_crafting_unlocked=true;seed.availabilities.skill.Cooking=1;seed.availabilities.skill.Meditation=1;seed.item_log['Rat meat chunks']={id:'Rat meat chunks',number:2,quality_highest:0,quality_lowest:0};
    await session.open(seed);page=session.page;await home();await click('install:cottage:'+key('Home wooden tableware'));await click('install:cottage:'+key('Home incense holder'));
    await page.locator('#center_mode_back').click();await page.locator('.choice_craft').click();await page.locator('#crafting_mainpage_buttons [data-crafting_category="cooking"]').click();
    await page.locator('[data-crafting_category="cooking"][data-crafting_subcategory="items"] [data-recipe_id="Roasted rat meat"] .recipe_item_name').click();
    const before=await session.save();await page.locator('#crafting_detail [data-craft-commit]').click();const after=await session.save();assert.equal(after.total_crafting_attempts,before.total_crafting_attempts+1);assert.ok(xp(after,'Cooking')>xp(before,'Cooking'));assert.equal(after.inventories.person.main_character[key('Rat meat chunks')],undefined);
    receipt.checks.push('The actual home kitchen cooks through the native recipe/cost/XP consumer with installed tableware');
    await page.locator('#center_mode_back').click();await page.evaluate(()=>start_activity('meditating'));const medBefore=await session.save();await session.step(1);const medAfter=await session.save();assert.equal(medAfter.current_activity.activity_id,'meditating');assert.ok(xp(medAfter,'Meditation')>xp(medBefore,'Meditation'));await page.evaluate(()=>end_activity());
    receipt.checks.push('Installed incense opens actual native home meditation, which advances native Meditation XP');
    await home();await page.screenshot({path:join(out,'home-consumers.png')});receipt.status='passed';receipt.bundle_sha256=createHash('sha256').update(await readFile(join(root,'dist/bundle.js'))).digest('hex');
}catch(e){receipt.status='failed';receipt.failure=e.stack;receipt.errors=session.errors;if(page){receipt.screen=(await page.locator('body').innerText()).slice(-8000);await page.screenshot({path:join(out,'failure.png')}).catch(()=>{});}throw e;}
finally{await writeFile(join(out,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');await session.close();await server.close();}

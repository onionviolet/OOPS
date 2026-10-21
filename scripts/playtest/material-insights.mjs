// Native trade/acquisition, recipe knowledge and crafting on disposable inputs.
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
import {canonicalSave,diffSaves} from '../headless/runner.mjs';
const root=resolve(process.argv[2]||'.'),out=resolve(process.argv[3]||'/tmp/material-insights-evidence');await mkdir(out,{recursive:true});
const server=await serve(root),s=new Session({url:server.url+'?test_hooks=1',seed:19,wall:Date.UTC(2026,9,21),opTimeout:10000});
const key=id=>JSON.stringify({id}),checks=[],normalization=[];let p;
const snap=()=>p.evaluate(()=>simulationTestHooks.snapshot());
const inv=x=>x.inventories.person.main_character;
const learned=x=>!!(x.availabilities.recipe['Healing powder']&1);
async function play(){await p.waitForFunction(()=>typeof simulationTestHooks==='object');await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();await p.waitForTimeout(250);}
async function shop(){await p.locator('.choice_trade').click();await p.locator('[data-trader="villageTrader"]').click();}
async function buy(id,n=1){for(let i=0;i<n;i++)await p.locator(`[data-trader_item='${key(id)}']`).click();await p.locator('#accept_trade_button').click();}
async function craft(){await p.locator('.choice_craft').click();await p.locator('#crafting_mainpage_buttons [data-crafting_category="alchemy"]').click();await p.locator('[data-crafting_category="alchemy"][data-crafting_subcategory="items"] [data-recipe_id="Healing powder"] .recipe_item_name').click();}
async function roundtrip(){
 const initial=await s.save();await p.reload();await play();const delta=diffSaves(canonicalSave(await s.save()),canonicalSave(initial));
 assert.ok(delta.every(d=>/^\/levels\/person\/(?!main_character\/)[^/]+\/skill_xp\//.test(d.path)&&d.a==='0'&&d.b===undefined),JSON.stringify(delta));normalization.push(...delta);
 const before=await s.save();await p.reload();await play();assert.deepEqual(diffSaves(canonicalSave(await s.save()),canonicalSave(before)),[]);
 const literal=await p.evaluate(()=>save_to_file()),exported=await s.save();await Promise.all([p.waitForEvent('load'),p.evaluate(x=>load_progress(x),literal)]);await play();assert.deepEqual(diffSaves(canonicalSave(await s.save()),canonicalSave(exported)),[]);assert.doesNotMatch(await p.locator('#message_log_div').innerText(),/Your alchemy practice connects/);
}
try{
 await s.start();const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));
 seed['current location']='Village';seed.availabilities.trader.villageTrader=1;seed.npcs.villageTrader.trader.last_refresh=1;seed.global_flags.is_crafting_unlocked=true;seed.character.money=10000;
 delete seed.availabilities.recipe.undefined;seed.availabilities.recipe['Weak healing powder']=1;seed.availabilities.recipe['Healing powder']=0;seed.levels.person.main_character.skill_xp.Alchemy=100000;
 for(const id of ['Golmoon leaf','Silver thistle']){delete seed.item_log[id];delete seed.inventories.person.main_character[key(id)];seed.inventories.trader.villageTrader[key(id)]={count:8};}
 for(const order of [['Golmoon leaf','Silver thistle'],['Silver thistle','Golmoon leaf']]){
  await s.open(seed);p=s.page;assert.equal(learned(await snap()),false);await shop();await buy(order[0]);assert.equal(learned(await snap()),false);
  assert.ok((await snap()).item_log[order[0]].number>0);
  await p.locator(`#inventory_content_div > [data-character_item='${key(order[0])}']`).click();await p.locator('#accept_trade_button').click();assert.equal(inv(await snap())[key(order[0])],undefined);
  await buy(order[1]);const learnedState=await snap();assert.equal(learned(learnedState),true);assert.equal(inv(learnedState)[key(order[1])].count,1);assert.equal(inv(learnedState)[key('Healing powder')],undefined);
  assert.match(await p.locator('#message_log_div').innerText(),/Your alchemy practice connects/);checks.push(`${order.join(' then ')}: actual buy/sell/buy uses remembered encounter, learns without samples or result`);
  const notices=await p.locator('#message_log_div').innerText();await buy(order[0]);assert.equal((await p.locator('#message_log_div').innerText()).split('Your alchemy practice connects').length,notices.split('Your alchemy practice connects').length);
  await p.locator('#center_mode_back').click();await craft();assert.equal(await p.locator('#crafting_detail [data-craft-commit]').isDisabled(),true);assert.match(await p.locator('#crafting_detail').innerText(),/missing/);
  const inspected=await s.save();await p.locator('#crafting_detail [data-craft-title]').hover();await p.waitForTimeout(250);assert.deepEqual(diffSaves(canonicalSave(await s.save()),canonicalSave(inspected)),[]);
  await p.locator('#center_mode_back').click();await shop();await buy(order[0],2);await buy(order[1],2);await p.locator('#center_mode_back').click();await craft();
  const before=await snap();assert.equal(await p.locator('#crafting_detail [data-craft-commit]').isEnabled(),true);await p.locator('#crafting_detail [data-craft-commit]').click();const after=await snap();
  for(const id of order)assert.equal((inv(before)[key(id)]?.count||0)-(inv(after)[key(id)]?.count||0),3);
  assert.equal(inv(after)[key('Healing powder')].count,1);assert.ok(after.total_crafting_successes>before.total_crafting_successes);
  assert.equal(learned(after),true);await roundtrip();checks.push('Native craft requires full stock, consumes exactly 3 of each herb, creates one result; knowledge and XP survive Save/reload/Export/literal Import without a notice replay');
 }
 for(const size of [14,21]){const view=await s.save();view.customization.profiles.Default.settings.typography={font:'gothic',size};await s.open(view);p=s.page;await craft();assert.equal(await p.locator('#crafting_detail').evaluate(el=>getComputedStyle(el).fontSize),`${size}px`);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:join(out,`insight-recipe-${size}.png`)});}
 assert.deepEqual(s.errors,[]);await writeFile(join(out,'receipt.json'),JSON.stringify({checks,normalization,errors:s.errors,setup:'Disposable fixture; native shop stock, access, money, Weak healing powder knowledge and Alchemy XP seeded. Real buy/sell/reacquire and craft UI. No personal saves.'},null,2));console.log(JSON.stringify({checks,out}));
}catch(error){await writeFile(join(out,'failure.txt'),error.stack);await p?.screenshot({path:join(out,'failure.png')}).catch(()=>{});throw error;}finally{await s.close();await server.close();}

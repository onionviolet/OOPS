import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
import {canonicalSave,diffSaves} from '../headless/runner.mjs';
const root=resolve(process.argv[2]||'.'),out=resolve(process.argv[3]||'/tmp/shop-restock-evidence');await mkdir(out,{recursive:true});
const server=await serve(root),s=new Session({url:server.url+'?test_hooks=1',seed:19,wall:Date.UTC(2026,9,21),opTimeout:10000});const key=JSON.stringify({id:'Coal'}),checks=[];let p;
const snap=()=>p.evaluate(()=>simulationTestHooks.snapshot());
async function play(){await p.waitForFunction(()=>typeof simulationTestHooks==='object');await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();await p.waitForTimeout(250);}
try{
 await s.start();const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));delete seed.availabilities.recipe.undefined;
 Object.assign(seed['current time'],{day:4,day_count:4,hour:23,minute:59});seed['current location']='Village';seed.availabilities.trader.villageTrader=1;seed.npcs.villageTrader.trader.last_refresh=1;seed.character.money=10000;seed.inventories.trader.villageTrader={[key]:{count:5}};
 for(const size of [14,21]){const view=structuredClone(seed);view.customization.profiles.Default.settings.typography={font:'gothic',size};
 await s.open(view);p=s.page;await p.locator('.choice_trade').click();await p.locator('[data-trader="villageTrader"]').click();await p.locator(`[data-trader_item='${key}']`).click();
 const before=await snap();assert.equal(before.inventories.trader.villageTrader[key].count,5);
 await s.step(2);const refreshed=await snap();assert.ok(refreshed.npcs.villageTrader.trader.last_refresh>before.npcs.villageTrader.trader.last_refresh);assert.notDeepEqual(refreshed.inventories.trader.villageTrader,before.inventories.trader.villageTrader);
 assert.equal(await p.locator('#trade_stock_notice').isVisible(),true);assert.equal(refreshed.character.money,before.character.money);
 await p.locator('#accept_trade_button').click();assert.equal((await snap()).character.money,before.character.money);assert.match(await p.locator('#message_log_div').innerText(),/Review the updated selection and prices/);
 assert.equal(await p.locator('#trade_stock_notice').evaluate(el=>getComputedStyle(el).fontSize),`${size}px`);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:join(out,`changed-stock-review-${size}.png`)});
 await p.locator('#accept_trade_button').click();const accepted=await snap();assert.ok(accepted.character.money<before.character.money);assert.equal(accepted.inventories.person.main_character[key].count,1);assert.equal(accepted.inventories.trader.villageTrader[key].count,refreshed.inventories.trader.villageTrader[key].count-1);
 checks.push('Open native shop crosses actual day restock, preserves selected Coal, requires review before charging, then conserves stock at current terms');
 const saved=await s.save();await p.reload();await play();const reload=await s.save(),d=diffSaves(canonicalSave(reload),canonicalSave(saved));assert.ok(d.every(x=>/^\/levels\/person\/(?!main_character\/)[^/]+\/skill_xp\//.test(x.path)&&x.a==='0'&&x.b===undefined),JSON.stringify(d));
 await p.reload();await play();assert.deepEqual(diffSaves(canonicalSave(await s.save()),canonicalSave(reload)),[]);
 const literal=await p.evaluate(()=>save_to_file()),exported=await s.save();await Promise.all([p.waitForEvent('load'),p.evaluate(x=>load_progress(x),literal)]);await play();assert.deepEqual(diffSaves(canonicalSave(await s.save()),canonicalSave(exported)),[]);
 await p.locator('.choice_trade').click();await p.locator('[data-trader="villageTrader"]').click();const reopened=await snap();assert.deepEqual(reopened.inventories.trader.villageTrader,accepted.inventories.trader.villageTrader);assert.equal(await p.locator('#trade_stock_notice').isVisible(),false);
 const inspected=await s.save();await p.locator(`[data-trader_item='${key}']`).hover();await p.waitForTimeout(300);assert.deepEqual(diffSaves(canonicalSave(await s.save()),canonicalSave(inspected)),[]);checks.push('Save/reload/Export/literal Import retain stock/terms; reopen and hover do not regenerate stock or repeat the notice');
 }
 // Browsing without a pending quote must not add an unnecessary extra acceptance.
 await s.open(seed);p=s.page;await p.locator('.choice_trade').click();await p.locator('[data-trader="villageTrader"]').click();await s.step(2);const freshTerms=await snap();await p.locator(`[data-trader_item='${key}']`).click();await p.locator('#accept_trade_button').click();assert.ok((await snap()).character.money<freshTerms.character.money);assert.equal((await snap()).inventories.person.main_character[key].count,1);checks.push('No pending quote at restock: selecting current stock afterward completes on the first acceptance');
 assert.deepEqual(s.errors,[]);await writeFile(join(out,'receipt.json'),JSON.stringify({checks,errors:s.errors,setup:'Disposable mid fixture with native day boundary, access, shop stock and money seeded; native quote and clock/accept UI.'},null,2));console.log(JSON.stringify({checks,out}));
}catch(error){await writeFile(join(out,'failure.txt'),error.stack);await p?.screenshot({path:join(out,'failure.png')}).catch(()=>{});throw error;}finally{await s.close();await server.close();}

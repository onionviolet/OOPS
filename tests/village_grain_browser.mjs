// Native progressed fixture for setup; apples and the changed delivery are actually played.
import assert from 'node:assert/strict';
import {resolve,join} from 'node:path';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {Session} from '../scripts/playtest/lib.mjs';
import {serve} from '../scripts/perf/lib.mjs';
import {defaultCustomizationState} from '../src/customization_profiles.js';
import {GRAIN_APPLE_ACTION,GRAIN_CART_METHODS} from '../src/village_grain_cart.js';
const build=resolve(process.argv[2]||'.lane-builds/village-grain-20261125'),out=resolve('docs/representations/evidence/village-grain-2026-11-25');
await mkdir(out,{recursive:true});
const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));
seed.customization=defaultCustomizationState();delete seed.availabilities.recipe.undefined;delete seed.availabilities.recipe['recipe/undefined'];
seed.global_flags.is_gathering_unlocked=true;
seed.quests["It won't mill itself"]={is_active:true,is_finished:false,task_status:[{is_finished:true},{is_finished:true},{is_finished:false}]};
seed.availabilities.quest["It won't mill itself"]=1;
seed.availabilities.person.villageMillers=1;
seed.availabilities.action['search for delivery']=3;
for(const id of GRAIN_CART_METHODS)seed.availabilities.action[id]=1;
delete seed.availabilities.action[GRAIN_APPLE_ACTION];
for(const id of ['Village','Forest road','Town outskirts','Town farms','Eastern mill','Eastern storehouse'])seed.availabilities.location[id]=1;
seed.availabilities.activity['Town farms:harvesting']=1;
seed.levels.person.main_character.skill_xp.Farming=2000;
seed.levels.person.main_character.skill_xp['Animal handling']=0;
seed.availabilities.skill.Farming=1;seed.availabilities.skill['Animal handling']=1;
for(const [key] of Object.entries(seed.inventories.person.main_character))if(JSON.parse(key).id==='Apple')delete seed.inventories.person.main_character[key];
seed['current location']='Village';delete seed.current_activity;
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const server=await serve(build),session=new Session({url:server.url+'?test_hooks=1',seed:87,wall:Date.UTC(2026,10,25,15),opTimeout:30000,
 hooks:{beforeOpen:async context=>context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}))}});
const checks=[],snap=()=>session.page.evaluate(()=>window.simulationTestHooks.snapshot());
const apples=s=>Object.entries(s.inventories.person.main_character).filter(([k])=>JSON.parse(k).id==='Apple').reduce((n,[,v])=>n+v.count,0);
const clock=s=>s['current time'].day_count*1440+s['current time'].hour*60+s['current time'].minute;
async function boot(){const p=session.page;await p.waitForFunction(()=>!!window.simulationTestHooks);await p.evaluate(()=>window.simulationTestHooks.pause());if(await p.locator('#loading_screen_play_button').isVisible())await p.locator('#loading_screen_play_button').click({force:true});}
async function choose(selector,group){const p=session.page,t=p.locator(selector).first();if(!await t.isVisible()){
 const expanded=p.locator('#location_actions_div .location_choice_dropdown_expanded:visible').first();if(await expanded.count())await expanded.click();
 if(!await t.isVisible())await p.locator('#location_actions_div '+group).first().click();}await t.click();}
async function travel(id){await session.page.locator(`[data-nearby-verb="go:${id}"]`).click();assert.equal((await snap())['current location'],id);}
try{
 await session.start();await session.open(seed);console.log('Opened native mill-cart fixture');
 const p=session.page,action=()=>session.page.locator(`[data-location_action="${GRAIN_APPLE_ACTION}"]`);
 await choose(`[data-location_action="${GRAIN_APPLE_ACTION}"]`,'.choice_action');
 const refused=await snap();assert.equal(apples(refused),0);assert.equal(refused['current location'],'Village');
 assert.match(await p.locator('body').innerText(),/need two apples/i);
 await p.locator('#action_end_div').click();checks.push('Missing apples refuses immediately with no delivery');
 const orchard=structuredClone(seed);orchard['current location']='Town farms';
 await session.open(orchard);console.log('Opened orchard production fixture');
 await choose('[data-activity="harvesting"]','.choice_gather');
 for(let i=0;i<12&&apples(await snap())<2;i++)await session.step(60);
 let grown=await snap();assert.ok(apples(grown)>=2,'native orchard produced the apples');
 await session.page.locator('#action_end_div').click();
 grown=await snap();const produced=apples(grown);console.log(`Harvested ${produced} native apples`);
 checks.push(`Native orchard harvesting produced ${produced} apples, none seeded`);
 await travel('Town outskirts');await travel('Forest road');await travel('Village');
 const before=await snap();assert.equal(apples(before),produced);
 if(!await action().isVisible())await session.page.locator('#location_actions_div .choice_action').first().click();
 await session.page.screenshot({path:join(out,'village-grain-offers.png')});
 assert.match(await action().innerText(),/2 apples.*30 min/);
 await action().click();await session.step(5);await session.page.locator('#action_end_div').click();
 const stopped=await session.save();assert.equal(apples(stopped),produced);assert.equal(stopped['current location'],'Village');
 assert.equal(stopped.availabilities.textline['villageMillers:delivered']&1,0);
 const partial=stopped.locations.Village.actions[GRAIN_APPLE_ACTION].accumulated_progress;assert.ok(partial>0);
 await session.page.reload();await boot();
 assert.equal((await snap()).locations.Village.actions[GRAIN_APPLE_ACTION].accumulated_progress,partial);
 checks.push('Stop keeps apples and withholds mill receipt; partial work survives Save/reload');
 await choose(`[data-location_action="${GRAIN_APPLE_ACTION}"]`,'.choice_action');await session.step(24);
 assert.equal((await snap())['current location'],'Village','29 committed minutes have not delivered the cart');
 await session.step(1);
 const delivered=await snap();assert.equal(delivered['current location'],'Eastern mill');assert.equal(apples(delivered),produced-2);
 assert.ok(delivered.availabilities.textline['villageMillers:delivered']&1);
 for(const id of [GRAIN_APPLE_ACTION,...GRAIN_CART_METHODS])assert.ok(delivered.availabilities.action[id]&6,`${id} cannot redeliver`);
 console.log('Delivered at the quoted30 minutes, including preserved partial work');
 await session.page.screenshot({path:join(out,'village-grain-delivered.png')});
 await session.page.locator('#action_end_div').click();
 const beforeClaim=(await snap()).character.money;
 await session.page.locator('[data-nearby-verb="talk:villageMillers"]').click();
 await session.page.getByRole('button',{name:'Your delivery has arrived.',exact:true}).click();
 const claimed=await session.save();assert.ok(claimed.quests["It won't mill itself"].is_finished);
 assert.equal(claimed.character.money-beforeClaim,500);
 assert.ok(claimed.availabilities.action['unlock balancing']&1);assert.ok(claimed.availabilities.action['unlock weightlifting']&1);
 console.log('Claimed existing mill quest reward and training access');
 await session.page.screenshot({path:join(out,'village-grain-mill-receipt.png')});
 checks.push('Success consumes exactly2 apples, closes all cart routes, and millers pay existing500-coin quest reward plus native training access');
 const download=session.page.waitForEvent('download');await session.page.locator('#save_to_file_button').click();
 const stream=await (await download).createReadStream(),chunks=[];for await(const chunk of stream)chunks.push(chunk);
 const exportBytes=Buffer.concat(chunks);
 await session.open();const imported=session.page;imported.on('dialog',d=>d.accept());
 const loaded=imported.waitForEvent('domcontentloaded');await imported.locator('#saved_file_input').setInputFiles({name:'native-mill-save.txt',mimeType:'text/plain',buffer:exportBytes});await loaded;await boot();
 const kept=await snap();assert.ok(kept.quests["It won't mill itself"].is_finished);assert.equal(apples(kept),produced-2);assert.equal(kept.character.money,claimed.character.money);
 for(const id of [GRAIN_APPLE_ACTION,...GRAIN_CART_METHODS])assert.ok(kept.availabilities.action[id]&6);
 checks.push('Literal Export/Import preserves consumed food, finished delivery and claimed downstream reward');
 const result={viewport:'1920x1080',fixture:'composed native mill-cart/orchard checkpoint based on tests/fixtures/perf/mid.json',
  setup:'Native mill quest first two tasks, cart discovery, farm access and trained Farming are fixture setup; no apples or Animal handling skill are gifted. Original combat earning is not covered.',
  fixtureSha256:hash(JSON.stringify(seed)),bundleSha256:hash(await readFile(join(build,'dist/bundle.js'))),checks,
  production:{apples:produced,reportedHarvest:grown.gathered_materials?.Apple},use:{applesBefore:produced,applesAfter:apples(kept),moneyBeforeClaim:beforeClaim,moneyAfterClaim:claimed.character.money,elapsedCommitment:clock(delivered)-clock(before)},pageErrors:session.errors.filter(e=>e.kind==='pageerror')};
 assert.equal(result.pageErrors.length,0);await writeFile(join(out,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}catch(e){console.error(e);await session.page?.screenshot({path:join(out,'failed.png')});await writeFile(join(out,'failure.txt'),await session.page?.locator('body').innerText()||String(e));throw e;}
finally{await session.browser?.close();await server.close();}

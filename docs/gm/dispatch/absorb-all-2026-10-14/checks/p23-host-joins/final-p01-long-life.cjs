const {run,village,assert}=require('./native-lane-helper.inc');
run('p01-long-life',async({page,seed,save,open,until,persist,reject,quota,gates,limitations})=>{
 const f=village();f.absorb_local_life.homeMinutes=59;f.absorb_local_life.itemsBought=24;f.levels.person.main_character.skill_xp.Cooking=189;f.levels.person.main_character.skill_xp.Alchemy=1000;f.levels.person.main_character.skill_xp.Sleeping=31000;
 // Admitted prior native crafting permission/materials and XP. No training bonus is seeded. Old optional hunger/weather off and no temporary effects keep native pacing efficiency1. A recent old export timestamp prevents an unrelated Spark reward during this comparison.
 f.last_rewarded_export=Date.now();f.pacing_e1.hungerEnabled=false;f.pacing_e1.weatherEnabled=false;f.active_effects={};f.global_flags.is_crafting_unlocked=true;f.availabilities.recipe['Weak healing powder']=1;
 for(const [id,count] of [['Rat meat chunks',200],['Golmoon leaf',100]]){f.inventories.person.main_character[JSON.stringify({id})]={count};f.item_log[id]={id,number:count,quality_highest:0,quality_lowest:0};}
 await seed(f);assert.equal((await save()).character.long_life_worn,undefined);gates.push('old worn family absent; admitted old native counters home59/purchases24, earned Cooking/Alchemy prerequisites');
 // Cooking3 native threshold is 40+60+90=190 XP. Alchemy1000 is level6, recipe<=10, below its grant cap.
 const xp=s=>s.levels.person.main_character.skill_xp;
 const alchemyRate=async()=>{const text=await page.locator('[data-skill="Alchemy"] .skill_xp_gain').textContent();const m=text.match(/XP gain:\s*x([\d.]+)/);assert.ok(m,'known native Alchemy XP rate');return Number(m[1]);};
 const craft=async(category,id,amount=1)=>{
  await page.locator('.choice_craft').first().click();await page.locator('#crafting_window').waitFor({state:'visible'});
  await page.locator('.crafting_mainpage_button[data-crafting_category="'+category+'"]').click();
  const row=page.locator('.crafting_recipe_list:visible .recipe_div[data-recipe_id="'+id+'"]').first();await row.click();
  const before=await save(),button=amount===1?page.locator('[data-craft-detail] [data-craft-commit]'):page.locator('[data-craft-detail] [data-craft-amount="'+amount+'"]');
  assert.notEqual(await button.getAttribute('aria-disabled'),'true','native recipe must be craftable');await button.click();const after=await save();
  assert.ok(after.total_crafting_attempts>before.total_crafting_attempts,'native craft receipt advances only after actual commit');
  await page.locator('#exit_crafting_button').click();return {before,after};
 };
 const alchemyCraft=async(expectedRate)=>{
  assert.equal(await alchemyRate(),Math.round(100*expectedRate)/100);const {before,after}=await craft('alchemy','Weak healing powder');
  const attempted=after.total_crafting_attempts-before.total_crafting_attempts,success=after.total_crafting_successes-before.total_crafting_successes;
  assert.equal(attempted,1);assert.ok(success===0||success===1);
  const nativeTotal=xp(before).Alchemy,level=6,next= Math.round(100*40*(1-1.5**(level+1))/(1-1.5))/100;
  assert.ok(nativeTotal>=831.25&&nativeTotal<next,'unchanged native Alchemy level6');
  const base=Math.round(10*15**1.1)/10,uncapped=base*expectedRate;assert.ok((next-nativeTotal)*0.25>uncapped,'actual craft XP stays below native cap');
  const expected=Math.round(100*uncapped*(success+(attempted-success)/4))/100,delta=Math.round(100*(xp(after).Alchemy-xp(before).Alchemy))/100;
  assert.equal(delta,expected,'actual native grant uses exactly one related-skill multiplier with real success/failure weight');
  assert.equal(before.inventories.person.main_character['{"id":"Golmoon leaf"}'].count-after.inventories.person.main_character['{"id":"Golmoon leaf"}'].count,5);
  return {delta,success,rate:expectedRate};
 };
 // Old Sleeping level5 retains both native all-XP milestones at2 and4. UI rounds the raw product.
 const baselineRaw=1.05**2,boostedRaw=baselineRaw*1.05;assert.equal(await alchemyRate(),Math.round(100*baselineRaw)/100);const beforeGrant=await alchemyCraft(baselineRaw);
 let cooked;for(let n=0;n<10;n++){cooked=await craft('cooking','Roasted rat meat',10);if(xp(cooked.after).Cooking>=190)break;}
 assert.ok(xp(cooked.before).Cooking<190&&xp(cooked.after).Cooking>=190,'real Cooking craft crosses level3');
 assert.equal(await alchemyRate(),Math.round(100*boostedRaw)/100);const afterGrant=await alchemyCraft(boostedRaw);
 await persist('native-cooking3-alchemy-milestone',s=>({Cooking:xp(s).Cooking,Alchemy:xp(s).Alchemy}));assert.equal(await alchemyRate(),Math.round(100*boostedRaw)/100);
 await craft('cooking','Roasted rat meat');assert.equal(await alchemyRate(),Math.round(100*boostedRaw)/100);const repeatGrant=await alchemyCraft(boostedRaw);
 await persist('repeated-craft-training-bonus',s=>({Cooking:xp(s).Cooking,Alchemy:xp(s).Alchemy}));assert.equal(await alchemyRate(),Math.round(100*boostedRaw)/100);
 gates.push('admitted old native Cooking189/Alchemy1000 and ingredient custody; actual recipe commit crosses Cooking3; known Alchemy rate preserves old Sleeping bonuses and gains one Cooking3 factor1.05; uncapped real grants before/after and repeated post-reload craft use exactly one multiplier: '+JSON.stringify({beforeGrant,afterGrant,repeatGrant}));
 await page.evaluate(()=>window.startTrade('villageTrader'));await page.locator('#trader_inventory_div .item_name').getByText('Stale bread',{exact:true}).locator('xpath=ancestor::*[contains(@class,"inventory_item_control")]').click();await page.locator('#accept_trade_button').click();await page.locator('#exit_trade_button').click();let bought=await save();assert.ok(bought.absorb_local_life.itemsBought>=25);assert.ok(bought.character.titles.pantry_keeper);assert.ok(bought.character.money<f.character.money);
 await page.evaluate(()=>window.change_location({location_id:'Shack'}));await until(s=>s.character.titles.quiet_hour);await page.locator('#character_show_bio').click();await open('titles_panel');assert.match(await page.locator('#titles_panel').innerText(),/Cooking|Alchemy/);
 const toggle=page.locator('#titles_panel input[type=checkbox]');await quota(()=>toggle.check());await open('titles_panel');assert.equal((await save()).character.long_life_worn,undefined);await toggle.uncheck();await toggle.check();await page.locator('[aria-label="Worn title"]').selectOption('quiet_hour');let worn=await save();assert.deepEqual(worn.character.long_life_worn,{schema:1,enabled:true,worn:'quiet_hour'});assert.ok(Object.keys(worn.character.titles).length>=3);
 await persist('worn-enabled',s=>s.character.long_life_worn);await page.locator('#character_show_bio').click();await open('titles_panel');await page.locator('#titles_panel input[type=checkbox]').uncheck();await persist('worn-disabled',s=>s.character.long_life_worn);await reject('character/long_life_worn');gates.push('native paid25th purchase and played60th home minute earn domestic titles; explicit worn opt-in/off');limitations.push('Weak known novice-loss title has no accepted native producer and remains OPEN.');
}).catch(e=>{console.error(e);process.exitCode=1;});

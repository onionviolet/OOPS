// Disposable fresh contexts only. Generated project fixtures, never player saves.
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const R=require('../vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const C=require('../crafting-screen-2026-10-13/checks/routes.cjs');
const out=__dirname;
(async()=>{const b=await chromium.launch({headless:true,channel:'chrome'});const results=[];
async function open(save, fixedRandom=false){const ctx=await b.newContext({viewport:{width:1366,height:768}});const p=await ctx.newPage();p.setDefaultTimeout(15000);p.errors=[];p.on('pageerror',e=>{p.errors.push(e.message);console.log('PAGEERROR',e.message);});if(save)await C.loadSave(p,JSON.stringify(save));else{await p.goto(process.env.URL);await R.startFresh(p);}return {ctx,p};}
try {
  const {ctx,p}=await open();
  // Move focus with Tab, without any prior pointer hover on inventory.
  const row=p.locator('#inventory_content_div .inventory_item_control').first();
  await row.focus();await p.keyboard.press('Tab');await p.keyboard.press('Shift+Tab');
  const focus=await p.evaluate(()=>{const r=document.activeElement;const t=r.querySelector('.item_tooltip'),q=t.getBoundingClientRect();return {visible:getComputedStyle(t).display,within:q.left>=0&&q.top>=0&&q.right<=innerWidth&&q.bottom<=innerHeight,description:r.getAttribute('aria-describedby')===t.id};});
  assert.equal(focus.visible,'block');assert(focus.within&&focus.description);results.push({check:'keyboard detail without hover',...focus});
  await p.screenshot({path:path.join(out,'keyboard.png')});
  // Native setting action equips immutable copies using the existing durability owner.
  const equip=p.locator('#inventory_content_div .equip_item_button'); if(await equip.count()) await equip.first().click();
  await p.evaluate(()=>openOptions());await p.locator('[data-durability-option]').check();await p.locator('[data-pacing-option="weatherEnabled"]').check();
  await p.evaluate(()=>closeOptions());
  await p.waitForTimeout(1300);
  let labels=await p.locator('[data-item-condition]').allTextContents();assert(labels.length&&labels.every(t=>/Condition 100\/100 · Repair 0 coins/.test(t)));results.push({check:'native enabled condition',labels});
  const weather=await p.locator('[data-weather-consequence]').innerText();assert.match(weather,/Weather XP ×1/);results.push({check:'enabled weather consequence',weather});
  await R.unlockCombatRoute(p);await R.enterCombat(p,{fightMs:3500});
  await p.waitForFunction(()=>[...document.querySelectorAll('[data-item-condition]')].some(e=>!e.textContent.includes('Condition 100/')));
  labels=await p.locator('[data-item-condition]').allTextContents();
  const hits=await p.locator('[data-damage-type="physical"]').allTextContents();assert(hits.length&&hits.every(t=>t.includes('physical damage')));results.push({check:'native landed hits update exact condition and grammar',labels,hits});
  await p.screenshot({path:path.join(out,'combat.png')});
  await R.leaveCombat(p);await p.locator('#switch_to_inventory').click();await p.locator('[data-item-condition]').first().scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,'condition.png')});assert.deepEqual(p.errors,[]);await ctx.close();
  // Controlled stock/budget fixture still runs native trade commands and settlement.
  const fixture=JSON.parse(C.readFixture('craft_ready.save.txt'));fixture.character.money=100000;
  const a=await open(fixture);const q=a.p;await q.evaluate(()=>startTrade('villageTrader'));
  let stock=q.locator('#trader_inventory_div .inventory_item_control:not(.item_to_trade)');assert(await stock.count());
  const selected=stock.first();const key=await selected.getAttribute('data-trader_item');
  const before=await selected.innerText();await selected.locator('.trade_ammount_button[data-trade_ammount="all"]').count();
  // The native all button uses the maximum safe batch value.
  await selected.locator('.trade_ammount_button').last().click();
  await q.waitForTimeout(300);
  const basket=q.locator('#trader_inventory_div [data-vendor-state="in-basket"]');assert(await basket.count());
  await q.evaluate(()=>accept_trade());await q.waitForTimeout(300);
  const sold=q.locator('#trader_inventory_div [data-vendor-state="sold-out"]');assert(await sold.count());assert.match(await sold.first().innerText(),/Sold out/);
  const money=await q.evaluate(()=>get_character_money());await sold.first().click();assert.equal(await q.evaluate(()=>get_character_money()),money);
  results.push({check:'native bulk purchase retains disabled sold-out row',before,after:await sold.first().innerText(),key});await q.screenshot({path:path.join(out,'vendor.png')});assert.deepEqual(q.errors,[]);await a.ctx.close();
  const poor=JSON.parse(C.readFixture('craft_ready.save.txt'));poor.character.money=0;const z=await open(poor);await z.p.evaluate(()=>startTrade('villageTrader'));
  assert(await z.p.locator('[data-vendor-state="unaffordable"]').count());results.push({check:'zero budget shows semantic price and reason',text:await z.p.locator('[data-vendor-state="unaffordable"]').first().innerText()});await z.p.screenshot({path:path.join(out,'unaffordable.png')});await z.ctx.close();
  const fog=JSON.parse(C.readFixture('craft_ready.save.txt'));fog.pacing_e1={schema:1,hungerEnabled:false,weatherEnabled:true,fullness:100,weather:{phase:2,remaining:90}};
  const f=await open(fog);await f.p.waitForTimeout(1300);const consequence=await f.p.locator('[data-weather-consequence]').innerText();assert.match(consequence,/Fog.*Weather XP ×0.95/);results.push({check:'restored optional fog reports its actual XP consequence',text:consequence});await f.p.screenshot({path:path.join(out,'fog.png')});assert.deepEqual(f.p.errors,[]);await f.ctx.close();
  // A generated late-combat fixture and fixed RNG exercise the existing native burst.
  // This proves presentation, not earned access, odds, progression or balance.
  const burst=JSON.parse(C.readFixture('craft_ready.save.txt'));burst.locations['Forest ant nest']={...(burst.locations['Forest ant nest']||{}),is_unlocked:true};
  const h=await open(burst);await h.p.evaluate(async()=>{const m=await import(document.querySelector('script[src*="dist/bundle.js"]').src);m.change_location({location_id:'Forest ant nest',skip_travel_time:true});m.current_combat.defenders.forEach((enemy,i)=>{const stats=enemy.getFullStats();stats.crit_rate=1;stats.attack_power=.01;m.current_combat.setAttackLoop({fighter_index:i,is_attacker:false,base_cooldown:1/stats.attack_speed});});});await h.p.waitForFunction(()=>[...document.querySelectorAll('[data-damage-type="physical"]')].some(e=>e.textContent.includes('×30 hits')&&e.textContent.includes('[CRIT]')),null,{timeout:30000});
  const burstLine=await h.p.locator('[data-damage-type="physical"]').allTextContents();results.push({check:'controlled native 30-hit critical is one total',lines:burstLine.filter(t=>t.includes('×30 hits'))});await h.p.screenshot({path:path.join(out,'burst.png')});assert.deepEqual(h.p.errors,[]);await h.ctx.close();
  fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
} finally {await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

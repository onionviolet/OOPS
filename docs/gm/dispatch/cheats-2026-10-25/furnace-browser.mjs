import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {cheatGame} from '../../../../tests/helpers/cheat_game.mjs';
import {awakenCheats,grantCheat} from '../../../../src/cheat_cards.js';
import {moduleCard,CHEAT_MODULES} from '../../../../src/cheat_definitions.js';
import {createChronicle,advanceChronicle,GAME_YEAR} from '../../../../src/chronicle.js';
import {calendarMinutes} from '../../../../src/world_rhythm.js';
import {createHarvest,addCarcass,drawSpecimen,setHarvestRoutine} from '../../../../src/harvest.js';
import {encodeSaveFile} from '../../../../src/save_files.js';
const root=new URL('./',import.meta.url),g=await cheatGame({port:5104}),r={route:'Patient Furnace',viewport:[1920,1080],checks:[]};

async function open(){if(await g.page.locator('#loading_screen_play_button').isVisible())await g.page.locator('#loading_screen_play_button').click();await g.page.locator('select[aria-label="Other known panels"]').selectOption('cheat-faculty');await g.page.locator('#cheat_faculty_panel button').click();}
try{
 let s=await g.page.evaluate(()=>JSON.parse(__cheatTest.create_save()));s.cheats=awakenCheats(s.cheats,{dayCount:3,at:0}).state;
 for(const d of CHEAT_MODULES.slice(0,7)){s.cheats=grantCheat(s.cheats,moduleCard(d.id),{at:0,route:'browser-fixture'});s.cheats.held['quiet-faculty'].card.stages.push({id:d.id,at:0,via:'fixture',carried:true});}
 const clock=calendarMinutes(s['current time']),h=createHarvest();h.processed=1;addCarcass(h,drawSpecimen({species:'Wolf rat',key:'away-stock',clock},()=>.4),{clock,skill:0,tool:100});setHarvestRoutine(h,1,clock);s.harvest=h;
 await g.page.evaluate(s=>{__cheatTest.load(s);globalThis.furnaceFreeze=__cheatTest.freeze();},s);await open();const card=g.page.locator('[data-cheat-card="patient-furnace"]');await card.locator('[data-cheat-action="assign-furnace"]').click();assert.match(await card.innerText(),/Routine assigned/);r.checks.push('UI assigns actual finite stocked routine and pays one charge');
 await g.page.evaluate(()=>__cheatTest.save());await g.page.waitForTimeout(10500);await g.page.reload({waitUntil:'domcontentloaded'});await g.page.waitForFunction(()=>!!globalThis.__cheatTest?.ready());await g.page.evaluate(()=>{globalThis.furnaceFreeze=__cheatTest.freeze();});await open();
 const before=await g.page.evaluate(()=>JSON.parse(__cheatTest.create_save()));const a=before.cheats.held['patient-furnace'].card.state.away;assert.ok(a.bank>=10);assert.equal(before.harvest.processed,1);r.checks.push('real elapsed absence loads once into retained bank; no automatic output granted');
 await card.locator('[data-cheat-action="settle-furnace"]').click();const after=await g.page.evaluate(()=>JSON.parse(__cheatTest.create_save())),b=after.cheats.held['patient-furnace'].card.state.away,delta=after.expansion.clock-before.expansion.clock;
 assert.equal(after.harvest.processed,2);assert.equal(after.harvest.routine.status,'complete');assert.equal(a.bank-b.bank,delta);assert.equal(b.spent-a.spent,delta);assert.ok(delta>0);assert.match(await card.innerText(),/complete|finished/);assert.ok(after.levels.person.main_character.skill_xp.Butchering>0);
 r.checks.push('UI spends bank through actual native calendar and finite processor: exact debit, outputs, skill XP and stop; unused bank retained');
 await card.scrollIntoViewIfNeeded();await g.page.screenshot({path:new URL('furnace-1920.png',root).pathname});await g.page.evaluate(()=>__cheatTest.save());await g.page.reload({waitUntil:'domcontentloaded'});await g.page.waitForFunction(()=>!!globalThis.__cheatTest?.ready());assert.equal(await g.page.evaluate(()=>__cheatTest.read().held['patient-furnace'].card.state.away.spent),b.spent);
 const exported=await g.page.evaluate(()=>__cheatTest.create_save());await g.page.evaluate(s=>__cheatTest.import(s),encodeSaveFile(exported));await g.page.waitForTimeout(1500);await g.page.waitForFunction(()=>!!globalThis.__cheatTest?.ready());assert.equal(await g.page.evaluate(()=>__cheatTest.read().held['patient-furnace'].card.state.away.spent),b.spent);assert.equal((await g.page.evaluate(()=>JSON.parse(__cheatTest.create_save()))).harvest.processed,2);r.checks.push('Save/reload/literal Import retain spent time and real outputs without replaying the routine');
 let ended=await g.page.evaluate(()=>JSON.parse(__cheatTest.create_save()));const anchor=ended['current time'],end=62*GAME_YEAR,total=calendarMinutes(anchor)+end,day=Math.floor(total/1440),within=day%360;
 ended['current time']={...anchor,year:Math.floor(day/360),month:Math.floor(within/30)+1,day:within%30+1,hour:Math.floor(total/60)%24,minute:total%60,day_count:anchor.day_count+Math.floor((anchor.hour*60+anchor.minute+end)/1440)};ended.expansion.clock=end;ended.expansion.chronicle=advanceChronicle(createChronicle(0,anchor,true),end);
 const retained=await g.page.evaluate(s=>{__cheatTest.load(s);const a=structuredClone(__cheatTest.read().held['patient-furnace'].card.state.away);__cheatTest.beginHeir();return a;},ended);await g.page.waitForFunction(()=>{if(!globalThis.__cheatTest?.ready()||localStorage.getItem('heir request'))return false;const b=__cheatTest.create_save();return !!b&&JSON.parse(b).character.name==='The heir';},{},{timeout:60000});
 const carried=await g.page.evaluate(()=>__cheatTest.read().held['patient-furnace'].card.state.away);assert.equal(carried.bank,retained.bank);assert.equal(carried.spent,retained.spent);assert.equal(carried.assigned,false);r.checks.push('actual beginHeir retains unused journey bank and spent receipt, clears body-local assignment');
 assert.deepEqual(g.errors,[]);r.pass=true;
}catch(e){r.pass=false;r.error=e.stack;await g.page.screenshot({path:new URL('furnace-failure.png',root).pathname});throw e;}finally{r.errors=g.errors;await writeFile(new URL('FURNACE_BROWSER.json',root),JSON.stringify(r,null,2)+'\n');await g.close();}console.log(JSON.stringify(r));

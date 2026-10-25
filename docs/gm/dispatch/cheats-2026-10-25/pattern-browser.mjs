import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {cheatGame} from '../../../../tests/helpers/cheat_game.mjs';
import {awakenCheats,grantCheat} from '../../../../src/cheat_cards.js';
import {moduleCard,CHEAT_MODULES} from '../../../../src/cheat_definitions.js';
import {createChronicle,advanceChronicle,GAME_YEAR} from '../../../../src/chronicle.js';
import {calendarMinutes} from '../../../../src/world_rhythm.js';
import {encodeSaveFile} from '../../../../src/save_files.js';
const root=new URL('./',import.meta.url),g=await cheatGame({port:5104}),r={route:'Pattern Book',viewport:[1920,1080],checks:[]};

async function open(){if(await g.page.locator('#loading_screen_play_button').isVisible())await g.page.locator('#loading_screen_play_button').click();await g.page.locator('select[aria-label="Other known panels"]').selectOption('cheat-faculty');await g.page.locator('#cheat_faculty_panel button').click();}
try{
 let s=await g.page.evaluate(()=>JSON.parse(__cheatTest.create_save()));s.cheats=awakenCheats(s.cheats,{dayCount:3,at:0}).state;
 for(const d of CHEAT_MODULES.slice(0,5)){s.cheats=grantCheat(s.cheats,moduleCard(d.id),{at:0,route:'browser-fixture'});s.cheats.held['quiet-faculty'].card.stages.push({id:d.id,at:0,via:'fixture',carried:true});}
 await g.page.evaluate(s=>{__cheatTest.load(s);__cheatTest.craft({type:'acquire',ref:'village.method-book'});},s);
 await open();const card=g.page.locator('[data-cheat-card="pattern-book"]');await card.locator('[data-cheat-action="sketch"]').click();
 assert.match(await card.innerText(),/Salt-and-herb steep · design/);r.checks.push('UI sketches actually carried readable method; design has no material knowledge');
 const retained=await g.page.evaluate(()=>__cheatTest.read().held['pattern-book']);await g.page.evaluate(()=>__cheatTest.save());await g.page.reload({waitUntil:'domcontentloaded'});await g.page.waitForFunction(()=>!!globalThis.__cheatTest);
 assert.deepEqual(await g.page.evaluate(()=>__cheatTest.read().held['pattern-book']),retained);r.checks.push('Save/reload retains exact design and cost');
 const bytes=await g.page.evaluate(()=>__cheatTest.create_save());await g.page.evaluate(s=>__cheatTest.import(s),encodeSaveFile(bytes));await g.page.waitForTimeout(1500);await g.page.waitForFunction(()=>!!globalThis.__cheatTest);
 assert.deepEqual(await g.page.evaluate(()=>__cheatTest.read().held['pattern-book']),retained);r.checks.push('literal Import retains exact design');
 s=await g.page.evaluate(()=>JSON.parse(__cheatTest.create_save()));const anchor=s['current time'],end=62*GAME_YEAR,total=calendarMinutes(anchor)+end,day=Math.floor(total/1440),within=day%360;
 s['current time']={...anchor,year:Math.floor(day/360),month:Math.floor(within/30)+1,day:within%30+1,hour:Math.floor(total/60)%24,minute:total%60,day_count:anchor.day_count+Math.floor((anchor.hour*60+anchor.minute+end)/1440)};
 s['current location']='Village';s.native_encounter=null;s.expansion.clock=end;s.expansion.chronicle=advanceChronicle(createChronicle(0,anchor,true),end);
 await g.page.evaluate(s=>{__cheatTest.load(s);__cheatTest.beginHeir();},s);
 await g.page.waitForFunction(()=>{if(!globalThis.__cheatTest?.ready()||localStorage.getItem('heir request'))return false;const b=__cheatTest.create_save();return !!b&&JSON.parse(b).character.name==='The heir';},{},{timeout:60000});
 assert.deepEqual(await g.page.evaluate(()=>__cheatTest.read().held['pattern-book'].card.state.patterns),retained.card.state.patterns);
 assert.equal((await g.page.evaluate(()=>__cheatTest.craftView())).methods.length,0,'new body has no learned method or registered reference');
 await g.page.evaluate(()=>__cheatTest.craft({type:'return',key:JSON.stringify({id:'Craft reference',ref:'village.method-book'})}));
 assert.equal((await g.page.evaluate(()=>__cheatTest.craftView())).methods.length,0);
 await open();const view=g.page.locator('#cheat_faculty_view');await view.locator('[data-cheat-action="claim"]:enabled').first().click();await card.locator('[data-cheat-action="recharge"]').click();await card.locator('[data-cheat-action="rebuild-pattern"]').click();
 assert.match(await view.innerText(),/Recorded/);const cv=await g.page.evaluate(()=>__cheatTest.craftView());assert.equal(cv.methods[0].via[0],'learned');assert.equal(cv.materials.length,0);
 await g.page.locator('select[aria-label="Other known panels"]').selectOption('herbal-experiments');await g.page.locator('#crafting_method').selectOption('village.salt-steep');
 assert.match(await g.page.locator('#crafting_engine_home').innerText(),/salt.*herb|herb.*salt/);assert.match(await g.page.locator('#crafting_engine_home [data-craft-detail]').innerText(),/Select at least|materials/i);
 const durable=await g.page.evaluate(()=>{__cheatTest.save();return __cheatTest.create_save();});assert.ok(durable);await g.page.reload({waitUntil:'domcontentloaded'});await g.page.waitForFunction(()=>!!globalThis.__cheatTest);assert.equal((await g.page.evaluate(()=>__cheatTest.craftView())).methods[0].via[0],'learned');await open();await g.page.locator('select[aria-label="Other known panels"]').selectOption('herbal-experiments');await g.page.locator('#crafting_method').selectOption('village.salt-steep');
 r.checks.push('real beginHeir carries design; after returning estate book, UI rebuild enables native learned method and displays missing ingredients');
 await g.page.screenshot({path:new URL('pattern-1920.png',root).pathname});assert.deepEqual(g.errors,[]);r.pass=true;
}catch(e){r.pass=false;r.error=e.stack;await g.page.screenshot({path:new URL('pattern-failure.png',root).pathname});throw e;}finally{r.errors=g.errors;await writeFile(new URL('PATTERN_BROWSER.json',root),JSON.stringify(r,null,2)+'\n');await g.close();}console.log(JSON.stringify(r));

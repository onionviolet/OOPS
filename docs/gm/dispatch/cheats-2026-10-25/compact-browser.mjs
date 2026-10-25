import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {cheatGame} from '../../../../tests/helpers/cheat_game.mjs';
import {awakenCheats,grantCheat} from '../../../../src/cheat_cards.js';
import {moduleCard,CHEAT_MODULES} from '../../../../src/cheat_definitions.js';
import {createChronicle,advanceChronicle,GAME_YEAR} from '../../../../src/chronicle.js';
import {calendarMinutes} from '../../../../src/world_rhythm.js';
import {encodeSaveFile} from '../../../../src/save_files.js';
const root=new URL('./',import.meta.url),g=await cheatGame({port:5104}),r={route:'Heirloom Compact',viewport:[1920,1080],checks:[]};

async function open(){if(await g.page.locator('#loading_screen_play_button').isVisible())await g.page.locator('#loading_screen_play_button').click();await g.page.locator('select[aria-label="Other known panels"]').selectOption('cheat-faculty');await g.page.locator('#cheat_faculty_panel button').click();}
try{
 let s=await g.page.evaluate(()=>JSON.parse(__cheatTest.create_save()));s.cheats=awakenCheats(s.cheats,{dayCount:3,at:0}).state;
 for(const d of CHEAT_MODULES.slice(0,6)){s.cheats=grantCheat(s.cheats,moduleCard(d.id),{at:0,route:'browser-fixture'});s.cheats.held['quiet-faculty'].card.stages.push({id:d.id,at:0,via:'fixture',carried:true});}
 s.inventories.storage.player[JSON.stringify({id:'Iron ore'})]={count:4};
 await g.page.evaluate(s=>__cheatTest.load(s),s);await open();const card=g.page.locator('[data-cheat-card="heirloom-compact"]');
 await card.locator('select').selectOption(JSON.stringify({source:'chest',key:JSON.stringify({id:'Iron ore'})}));await card.locator('input').fill('2');await card.locator('[data-cheat-action="bequeath"]').click();
 assert.match(await card.innerText(),/Nominated:.*Iron ore.*2/);r.checks.push('UI nominates two actually owned chest goods for local successor');
 const retained=await g.page.evaluate(()=>__cheatTest.read().held['heirloom-compact']);await g.page.evaluate(()=>__cheatTest.save());await g.page.reload({waitUntil:'domcontentloaded'});await g.page.waitForFunction(()=>!!globalThis.__cheatTest);
 assert.deepEqual(await g.page.evaluate(()=>__cheatTest.read().held['heirloom-compact']),retained);r.checks.push('Save/reload retains exact nomination and cost');
 const bytes=await g.page.evaluate(()=>__cheatTest.create_save());await g.page.evaluate(s=>__cheatTest.import(s),encodeSaveFile(bytes));await g.page.waitForTimeout(1500);await g.page.waitForFunction(()=>!!globalThis.__cheatTest);
 assert.deepEqual(await g.page.evaluate(()=>__cheatTest.read().held['heirloom-compact']),retained);r.checks.push('literal Import retains exact nomination');
 s=await g.page.evaluate(()=>JSON.parse(__cheatTest.create_save()));const anchor=s['current time'],end=62*GAME_YEAR,total=calendarMinutes(anchor)+end,day=Math.floor(total/1440),within=day%360;
 s['current time']={...anchor,year:Math.floor(day/360),month:Math.floor(within/30)+1,day:within%30+1,hour:Math.floor(total/60)%24,minute:total%60,day_count:anchor.day_count+Math.floor((anchor.hour*60+anchor.minute+end)/1440)};
 s['current location']='Village';s.native_encounter=null;s.expansion.clock=end;s.expansion.chronicle=advanceChronicle(createChronicle(0,anchor,true),end);
 const estateCount=await g.page.evaluate(s=>{__cheatTest.load(s);const n=JSON.parse(__cheatTest.create_save()).inventories.storage.player[JSON.stringify({id:'Iron ore'})].count;__cheatTest.beginHeir();return n;},s);
 await g.page.waitForFunction(()=>{if(!globalThis.__cheatTest?.ready()||localStorage.getItem('heir request'))return false;const b=__cheatTest.create_save();return !!b&&JSON.parse(b).character.name==='The heir';},{},{timeout:60000});
 const after=await g.page.evaluate(()=>JSON.parse(__cheatTest.create_save()));const receipt=after.cheats.held['heirloom-compact'].card.state.receipt;
 assert.equal(receipt.status,'claimed');assert.equal(receipt.count,2);assert.equal(after.cheats.held['heirloom-compact'].card.state.nomination,null);
 const key=JSON.stringify({id:'Iron ore'});assert.equal(after.inventories.person.main_character[key].count,2);assert.equal(after.inventories.storage.player[key].count,estateCount-2);
 await open();assert.match(await card.innerText(),/Last succession: claimed.*Iron ore.*2/);
 await g.page.evaluate(()=>__cheatTest.save());await g.page.reload({waitUntil:'domcontentloaded'});await g.page.waitForFunction(()=>!!globalThis.__cheatTest?.ready());assert.deepEqual(await g.page.evaluate(()=>__cheatTest.read().held['heirloom-compact'].card.state.receipt),receipt);
 await open();await g.page.screenshot({path:new URL('compact-1920.png',root).pathname});r.checks.push('real beginHeir executes exact claim once: two personal, conserved remaining chest, nomination cleared; claim receipt survives another Save/reload');
 assert.deepEqual(g.errors,[]);r.pass=true;
}catch(e){r.pass=false;r.error=e.stack;await g.page.screenshot({path:new URL('compact-failure.png',root).pathname});throw e;}finally{r.errors=g.errors;await writeFile(new URL('COMPACT_BROWSER.json',root),JSON.stringify(r,null,2)+'\n');await g.close();}console.log(JSON.stringify(r));

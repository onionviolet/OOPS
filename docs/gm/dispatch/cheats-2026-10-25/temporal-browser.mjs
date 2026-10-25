import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {cheatGame} from '../../../../tests/helpers/cheat_game.mjs';
import {awakenCheats,grantCheat} from '../../../../src/cheat_cards.js';
import {moduleCard,CHEAT_MODULES} from '../../../../src/cheat_definitions.js';
import {createHarvest,drawSpecimen,addCarcass,setHarvestRoutine} from '../../../../src/harvest.js';
import {calendarMinutes} from '../../../../src/world_rhythm.js';
import {beginContinuation} from '../../../../src/continuation_state.js';
const root=new URL('./',import.meta.url),g=await cheatGame({port:5104}),r={route:'existing continuation carry',viewport:[1920,1080],checks:[]};
async function open(){if(await g.page.locator('#loading_screen_play_button').isVisible())await g.page.locator('#loading_screen_play_button').click();await g.page.locator('select[aria-label="Other known panels"]').selectOption('cheat-faculty');await g.page.locator('#cheat_faculty_panel button').click();}
try{
 let s=await g.page.evaluate(()=>JSON.parse(__cheatTest.create_save()));s.cheats=awakenCheats(s.cheats,{dayCount:3,at:0}).state;for(const d of CHEAT_MODULES){s.cheats=grantCheat(s.cheats,moduleCard(d.id),{at:0,route:'fixture'});s.cheats.held['quiet-faculty'].card.stages.push({id:d.id,at:0,via:'fixture',carried:true});}
 const clock=calendarMinutes(s['current time']),h=createHarvest();h.processed=1;addCarcass(h,drawSpecimen({species:'Wolf rat',key:'temporal-stock',clock},()=>.4),{clock});setHarvestRoutine(h,1,clock);s.harvest=h;
 Object.assign(s.cheats.held['patient-furnace'].card.state.away,{assigned:true,world:'base.frontier',anchor:Date.now(),bank:12});delete s.continuation;s=beginContinuation(s,'d4-temporal-test');
 await g.page.evaluate(s=>{__cheatTest.load(s);globalThis.temporalFreeze=__cheatTest.freeze();__cheatTest.craft({type:'acquire',ref:'village.method-book'});},s);await open();await g.page.locator('[data-cheat-action="sketch"]').click();await g.page.locator('[data-cheat-action="settle-furnace"]').click();
 const before=await g.page.evaluate(()=>__cheatTest.read()),patterns=before.held['pattern-book'].card.state.patterns,away=before.held['patient-furnace'].card.state.away;assert.equal(patterns.length,1);assert.ok(away.spent>0);r.checks.push('after initial point: UI sketch and actual native bank expenditure');
 await g.page.evaluate(()=>{void __cheatTest.continuation('initial');});await g.page.waitForFunction(()=>{if(!globalThis.__cheatTest?.ready())return false;const b=__cheatTest.create_save();return !!b&&JSON.parse(b).continuation?.lastTransition?.kind==='initial';},{},{timeout:60000});
 const after=await g.page.evaluate(()=>__cheatTest.read());assert.deepEqual(after.held['pattern-book'].card.state.patterns,patterns);assert.equal(after.held['pattern-book'].card.state.charges,3);assert.equal(after.held['patient-furnace'].card.state.away.bank,away.bank);assert.equal(after.held['patient-furnace'].card.state.away.spent,away.spent);assert.equal((await g.page.evaluate(()=>JSON.parse(__cheatTest.create_save()))).harvest.processed,1);r.checks.push('actual continuation host preflight/write/reload: later design retained, local reserves/body restore, spent journey time stays spent');
 await open();await g.page.locator('[data-cheat-action="rebuild-pattern"]').click();assert.equal((await g.page.evaluate(()=>__cheatTest.craftView())).methods[0].via[0],'learned');await g.page.locator('[data-cheat-card="pattern-book"]').scrollIntoViewIfNeeded();await g.page.screenshot({path:new URL('temporal-1920.png',root).pathname});r.checks.push('retained design reconstructs into actual crafting after return');
 assert.deepEqual(g.errors,[]);r.pass=true;
}catch(e){r.pass=false;r.error=e.stack;await g.page.screenshot({path:new URL('temporal-failure.png',root).pathname});throw e;}finally{r.errors=g.errors;await writeFile(new URL('TEMPORAL_BROWSER.json',root),JSON.stringify(r,null,2)+'\n');await g.close();}console.log(JSON.stringify(r));

import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {cheatGame} from '../../../../tests/helpers/cheat_game.mjs';
import {createHarvest,drawSpecimen,addCarcass} from '../../../../src/harvest.js';
import {calendarMinutes} from '../../../../src/world_rhythm.js';
import {seedBeginningCheats} from '../../../../src/cheat_cards.js';
import {createChronicle,advanceChronicle,GAME_YEAR} from '../../../../src/chronicle.js';
import {encodeSaveFile} from '../../../../src/save_files.js';
const root=new URL('./',import.meta.url),g=await cheatGame({port:5104});
const result={viewport:'1920x1080',port:5104,checks:[]};
try {
 const initial=await g.page.evaluate(()=>__cheatTest.read());
 assert.deepEqual(Object.keys(initial.held),['quiet-faculty']);assert.equal(initial.held['quiet-faculty'].card.state.awakened,false);
 assert.equal(await g.page.locator('#cheat_faculty_panel').isVisible(),false);result.checks.push('ordinary beginning is quiet; dormant UI hidden');
 let save=await g.page.evaluate(()=>JSON.parse(__cheatTest.create_save()));
 const clock=calendarMinutes(save['current time']),h=createHarvest();h.processed=1;
 addCarcass(h,drawSpecimen({species:'Wolf rat',key:'browser-specimen',clock},()=>.4),{clock,skill:0,tool:0});save.harvest=h;
 save.cheats=seedBeginningCheats(save.cheats,{choice:'system-quests',at:save['current time']});
 save.levels.person.main_character.skill_xp.Crafting=1;save.levels.person.main_character.skill_xp.Perception=1;
 save.locations['Infested field']??={};save.locations['Infested field'].enemy_groups_killed=1;
 await g.page.evaluate(s=>{__cheatTest.load(s);__cheatTest.awaken(true);},save);
 await g.page.locator('select[aria-label="Other known panels"]').selectOption('cheat-faculty');
 await g.page.locator('#cheat_faculty_panel button').click();
 const view=g.page.locator('#cheat_faculty_view');await view.waitFor({state:'visible'});
 for(let i=0;i<4;i++){
  await view.locator('[data-cheat-action="claim"]:enabled').first().click();
  await view.locator('[data-cheat-action="develop"]').click();
 }
 assert.equal(await view.locator('[data-cheat-card]').count(),4);result.checks.push('quiet base: four lived insights claimed and four facets developed through UI');
 await view.locator('[data-cheat-card="true-appraisal"] [data-cheat-action="appraise"]').click();
 assert.match(await view.locator('[data-cheat-card="true-appraisal"]').innerText(),/as of/);result.checks.push('True Appraisal: native specimen observation retained with time');
 await view.locator('[data-cheat-card="loaded-dice"] [data-cheat-action="call"]').click();
 const called=await g.page.evaluate(()=>__cheatTest.drawLoot('browser:drop:0'));assert.equal(called,0);result.checks.push('Loaded Dice: UI pays charge; actual native loot stream returns called result');
 await view.locator('[data-cheat-card="earned-habit"] input').fill('3');await view.locator('[data-cheat-card="earned-habit"] [data-cheat-action="routine"]').click();
 const routine=await g.page.evaluate(()=>JSON.parse(__cheatTest.create_save()).harvest.routine);assert.equal(routine.target,3);result.checks.push('Earned Habit: UI starts existing finite routine');
 await g.page.locator('select[aria-label="Other known panels"]').selectOption('status-window');
 await g.page.locator('[data-system-claim]').click();assert.equal((await g.page.evaluate(()=>__cheatTest.read())).held['system-quests'].card.state.points,1);result.checks.push('Quest system: UI manually claims native victory once');
 await g.page.locator('select[aria-label="Other known panels"]').selectOption('cheat-faculty');await g.page.locator('#cheat_faculty_panel button').click();
 await g.page.evaluate(()=>{__cheatTest.startEncounter();globalThis.releaseCheatBrowserFreeze=__cheatTest.freeze();});
 await g.page.locator('select[aria-label="Other known panels"]').selectOption('cheat-faculty');await g.page.locator('#cheat_faculty_panel button').click();
 await view.locator('[data-cheat-card="fate-ledger"] [data-cheat-action="peek"]').click({timeout:5000});
 assert.match(await view.locator('[data-cheat-card="fate-ledger"]').innerText(),/roll · as of/);result.checks.push('Fate Ledger: UI reads a visible foe in a real native encounter without raw engine keys');
 result.matrix=[];
 for(const [width,height] of [[1920,1080],[1536,864]])for(const font of [14,21]){
  await g.page.setViewportSize({width,height});
  await g.page.evaluate(px=>document.documentElement.style.setProperty('--ui-type-body',px+'px'),font);
  await view.evaluate((el,px)=>{el.style.setProperty('--custom-size',px+'px');el.style.setProperty('--ui-type-body',px+'px');el.style.fontSize=px+'px';},font);
  const geometry=await view.evaluate(el=>({contentWidth:el.clientWidth,contentScrollWidth:el.scrollWidth,actualFont:getComputedStyle(el.querySelector('p')).fontSize}));
  assert.equal(geometry.actualFont,font+'px');
  assert.ok(geometry.contentScrollWidth<=geometry.contentWidth+1,JSON.stringify({width,font,geometry}));
  result.matrix.push({width,height,font,...geometry});
  await g.page.screenshot({path:new URL(`cheats-${width}-${font}.png`,root).pathname});
 }
 await g.page.setViewportSize({width:1920,height:1080});await g.page.evaluate(()=>document.documentElement.style.removeProperty('--ui-type-body'));
 await view.evaluate(el=>{el.style.removeProperty('--custom-size');el.style.removeProperty('--ui-type-body');el.style.removeProperty('font-size');});
 await g.page.screenshot({path:new URL('cheats-1920.png',root).pathname});
 const before=await g.page.evaluate(()=>{__cheatTest.save();return JSON.parse(__cheatTest.create_save()).cheats;});
 await g.page.reload({waitUntil:'domcontentloaded'});await g.page.waitForFunction(()=>!!globalThis.__cheatTest);
 await g.page.locator('#loading_screen_play_button:not(.none_display)').click();
 await g.page.waitForTimeout(600);
 assert.deepEqual(await g.page.evaluate(()=>__cheatTest.read()),before);result.checks.push('real Save and page reload retain every card and reserve');
 const exported=await g.page.evaluate(()=>__cheatTest.create_save());
 await g.page.evaluate(encoded=>__cheatTest.import(encoded),encodeSaveFile(exported));
 await g.page.waitForTimeout(2000);await g.page.waitForFunction(()=>!!globalThis.__cheatTest);
 assert.deepEqual(await g.page.evaluate(()=>__cheatTest.read()),before);result.checks.push('literal Import through production load_from_file, guarded preflight and reload retains cards');
 let ended=await g.page.evaluate(()=>JSON.parse(__cheatTest.create_save()));
 const anchor=ended['current time'],end=62*GAME_YEAR,total=calendarMinutes(anchor)+end,day=Math.floor(total/1440),within=day%360;
 ended['current time']={...anchor,year:Math.floor(day/360),month:Math.floor(within/30)+1,day:within%30+1,hour:Math.floor(total/60)%24,minute:total%60,day_count:anchor.day_count+Math.floor((anchor.hour*60+anchor.minute+end)/1440)};
 ended['current location']='Village';ended.native_encounter=null;ended.expansion.clock=end;ended.expansion.chronicle=advanceChronicle(createChronicle(0,anchor,true),end);
 await g.page.evaluate(s=>{__cheatTest.load(s);__cheatTest.beginHeir();},ended);
 await g.page.waitForFunction(()=>{if(!globalThis.__cheatTest||localStorage.getItem('heir request'))return false;const bytes=__cheatTest.create_save();return !!bytes&&JSON.parse(bytes).character.name==='The heir';},{},{timeout:60000});
 const heir=await g.page.evaluate(()=>__cheatTest.read());assert.deepEqual(heir.held['quiet-faculty'].card.stages,before.held['quiet-faculty'].card.stages);
 assert.equal(heir.held['quiet-faculty'].card.state.points,0);assert.equal(heir.held['quiet-faculty'].messages.length,1);assert.equal(heir.held['system-quests'],undefined);
 for(const id of ['true-appraisal','loaded-dice','fate-ledger','earned-habit'])assert.equal(heir.held[id].card.state.charges,0);
 result.checks.push('real beginHeir reload/preflight/import: enduring stages and learned modules retained, local reserves empty, no repeated awakening');
 assert.deepEqual(g.errors,[]);result.errors=g.errors;result.pass=true;
} catch(error){result.pass=false;result.error=error.stack;await g.page.screenshot({path:new URL('browser-failure.png',root).pathname});throw error;}
finally {await writeFile(new URL('BROWSER.json',root),JSON.stringify(result,null,2)+'\n');await g.close();}
console.log(JSON.stringify(result));

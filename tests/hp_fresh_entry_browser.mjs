// N1: ordinary fresh entry, no supplied save, clock changes, grants or stepped ticks.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {serve} from '../scripts/playtest/lib.mjs';
const {launchChrome}=createRequire(import.meta.url)('../scripts/ui_helpers.cjs');
const build=resolve(process.argv[2]||'.lane-builds/discord-earned-20261125');
const out=resolve('docs/representations/evidence/harry-fresh-entry-2026-11-25');await mkdir(out,{recursive:true});
const server=await serve(join(build,'dist')),browser=await launchChrome(),errors=[];
const context=await browser.newContext({viewport:{width:1920,height:1080}}),page=await context.newPage();
page.setDefaultTimeout(15000);page.on('pageerror',error=>errors.push(error.message));
const snapshot=()=>page.evaluate(()=>simulationTestHooks.snapshot());
const ready=async()=>{await page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await page.locator('#loading_screen_play_button').click();const confirm=page.locator('#hero_creation_panel_confirmation');if(await confirm.isVisible())await confirm.click();};
try{
 await page.goto(server.url);await ready();assert.equal((await snapshot())['current location'],'Village');
 console.log('Fresh normal Village');
 await page.getByRole('combobox',{name:'Other known panels'}).selectOption('beginning');
 await page.getByRole('combobox',{name:'Optional world and life'}).selectOption('book.hp.lead');
 await page.screenshot({path:join(out,'arrival-preview-1920.jpg'),type:'jpeg',quality:88});
 await page.locator('[data-structured-begin="begin"]').click();
 await page.waitForFunction(()=>simulationTestHooks.snapshot().expansion.actors.player.worldId==='book.hp.lead.world');
 console.log('Confirmed Harry life through normal arrival');
 await page.getByRole('combobox',{name:'Other known panels'}).selectOption('hp');
 const start=await snapshot(),dress=page.locator('[data-hp="book.hp.lead.dress"]');
 assert.equal(start.expansion.simulation.people.player.body.lifeStage,'child');
 assert.equal(start.expansion.simulation.people.player.location,'book.hp.lead.cupboard');
 assert.equal(start.expansion.simulation.knowledge.player['book.hp.lead.dressed'],undefined);
 await dress.click();
 // Let the accepted five-minute job run on the ordinary real timer.
 await page.waitForFunction(()=>!!simulationTestHooks.snapshot().expansion.simulation.knowledge.player['book.hp.lead.dressed'],null,{timeout:30000});
 const earned=await snapshot(),train=page.locator('button[data-hp-school="book.hp.lead.arrive_school"]');
 assert.equal(await train.isDisabled(),true);const refusal=await train.locator('..').innerText();
 assert.match(refusal,/term starts on 1 September/i);
 assert.equal(earned.expansion.actors.player.facts['hp.lead.atSchool'],undefined);
 assert.equal(earned.expansion.simulation.powers.player?.['book.hp.lead.levitation'],undefined);
 const elapsed=earned.expansion.clock-earned.expansion.simulation.knowledge.player['book.hp.lead.opening'].at;
 const day=Math.floor((elapsed+480)/1440),remaining=32*1440-480-elapsed;
 assert.equal(day,0);assert.ok(remaining>45000);
 await page.screenshot({path:join(out,'earned-dressing-first-dependency-1920.jpg'),type:'jpeg',quality:88});
 await page.locator('#save_button').click();await page.reload();await ready();
 await page.getByRole('combobox',{name:'Other known panels'}).selectOption('hp');
 const kept=await snapshot();assert.equal(kept.expansion.actors.player.worldId,'book.hp.lead.world');
 assert.deepEqual(kept.expansion.simulation.knowledge.player['book.hp.lead.dressed'],earned.expansion.simulation.knowledge.player['book.hp.lead.dressed']);
 assert.equal(await page.locator('button[data-hp-school="book.hp.lead.arrive_school"]').isDisabled(),true);
 assert.deepEqual(errors,[]);
 const result={status:'passed-bounded-entry',viewport:{width:1920,height:1080},bundleSha256:createHash('sha256').update(await readFile(join(build,'dist/bundle.js'))).digest('hex'),
  route:'Fresh PLAY -> Village -> Your beginning -> Harry preview/Confirm arrival -> cupboard -> natural five-minute dressing -> Save/reload',
  setup:'No supplied save, private cast, time/skill grant, clock mutation, stepped ticks or timer override. Ordinary real timer remained running.',
  localDependencies:{manifest:existsSync('private_packs/manifest.json'),hpCast:existsSync('private_packs/hp-cast/cast.json'),privateReadingOwner:existsSync('docs/research/novels/harry-potter/private')},
  genuinelyEarned:{world:'book.hp.lead.world',place:'book.hp.lead.cupboard',lifeStage:'child',dressing:earned.expansion.simulation.knowledge.player['book.hp.lead.dressed'],savedAndReloaded:true},
  nextDependency:{commandId:'book.hp.lead.arrive_school',refusal,arrivalDay:32,currentDay:day,remainingGameMinutes:remaining,
   ordinaryAwakeSecondsPerGameMinute:1,publicRoute:'calendar-gated train, then Sorting and scheduled lessons',missingSourceRoute:'hp-cast household/summer acts',schoolStudyOrChartReached:false},pageErrors:errors};
 await writeFile(join(out,'proof.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}catch(error){console.error('FAIL',error);await page.screenshot({path:join(out,'failure.jpg')});console.error((await page.locator('body').innerText()).slice(0,7000));throw error;}
finally{await browser.close();server.close();}

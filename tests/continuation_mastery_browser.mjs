import {createRequire} from 'node:module';import {readFile,writeFile} from 'node:fs/promises';import assert from 'node:assert/strict';
import {decodeSaveFile,encodeSaveFile} from '../src/save_files.js';
const evidence='docs/gm/dispatch/quiet-continuation-2026-10-15/evidence/';
const fixture=decodeSaveFile(await readFile(evidence+'synthetic-export.txt','utf8'),'v0.6');
fixture.character.money=7;fixture.levels.person.main_character.skill_xp.Literacy=240;fixture.levels.person.main_character.skill_xp.Weightlifting=500;
await writeFile(evidence+'synthetic-mastery-input.txt',encodeSaveFile(JSON.stringify(fixture)));
const require=createRequire(import.meta.url),{chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));const check=(label,value)=>{assert.ok(value,label);checks.push(label);console.log('PASS '+label);};
async function play(){await page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:15000});await page.locator('#loading_screen_play_button').click();await page.waitForTimeout(600);}
try{
 await page.goto('http://127.0.0.1:19146/?test_hooks=1',{waitUntil:'domcontentloaded'});await play();await page.locator('#saved_file_input').setInputFiles(evidence+'synthetic-mastery-input.txt');await page.waitForTimeout(1600);await play();
 let s=await page.evaluate(()=>window.simulationTestHooks.snapshot());check('seeded synthetic file reaches actual native XP loader',s.levels.person.main_character.skill_xp.Literacy===240&&s.levels.person.main_character.skill_xp.Weightlifting===500);
 await page.getByRole('combobox',{name:'Other known panels'}).selectOption('continuation');await page.locator('#continuation_open').click();
 await page.locator('[data-continuation-action=initial]').click();await page.locator('[data-continuation-action=initial]').filter({hasText:/^Confirm/}).click();await page.waitForTimeout(1800);await play();s=await page.evaluate(()=>window.simulationTestHooks.snapshot());
 check('actual rewind/native reload carries compatible Literacy knowledge',s.levels.person.main_character.skill_xp.Literacy===240);
 check('actual rewind/native reload restores bodily training',s.levels.person.main_character.skill_xp.Weightlifting===fixture.continuation.lives[fixture.continuation.active].initial.levels.person.main_character.skill_xp.Weightlifting);
 check('physical money restores instead of carrying',s.character.money===fixture.continuation.lives[fixture.continuation.active].initial.character.money);
 check('known training remains recorded without transferring bodily XP',s.continuation.mastery.Weightlifting===500);
 check('seeded native mastery route has no runtime errors',errors.length===0);
}finally{await writeFile(evidence+'mastery-browser.json',JSON.stringify({fixture:'synthetic input, actual native file loader and return command; not a natural training claim',checks,errors},null,2));await browser.close();}

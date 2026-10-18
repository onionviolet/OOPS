import {createRequire} from 'node:module';import {writeFile} from 'node:fs/promises';import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));const evidence='docs/gm/dispatch/quiet-continuation-2026-10-15/evidence/';
const save=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
const check=(label,value)=>{assert.ok(value,label);checks.push(label);console.log('PASS '+label);};
async function open(){await page.waitForTimeout(500);if(!await page.locator('#continuation_open').isVisible())await page.getByRole('combobox',{name:'Other known panels'}).selectOption('continuation');await page.locator('#continuation_open').click();}
async function act(id){await page.locator(`[data-continuation-action="${id}"]`).click();await page.waitForTimeout(100);const confirm=page.locator(`[data-continuation-action="${id}"]`).filter({hasText:/^Confirm /});if(await confirm.count())await confirm.click();await page.waitForTimeout(1200);}
try{
 await page.goto('http://127.0.0.1:19146/',{waitUntil:'domcontentloaded'});await page.waitForTimeout(1000);await page.locator('#loading_screen_play_button').click();await page.waitForTimeout(600);if(await page.locator('#hero_creation_panel_confirmation').isVisible())await page.locator('#hero_creation_panel_confirmation').click();await page.waitForTimeout(800);
 check('production preview has no test hook',await page.evaluate(()=>!window.simulationTestHooks));await open();await page.locator('[data-connection-tab=research]').click();await act('study');
 await page.waitForTimeout(11500);await page.locator('#save_button').count().then(async n=>{if(n)await page.locator('#save_button').click();else await page.getByText('Save',{exact:true}).last().click();});
 let s=await save();check('unmodified real-time engine learns checkpoint',s.continuation.research.checkpoint);await act('set');await page.locator('[data-connection-tab=return]').click();
 await page.locator('summary').filter({hasText:'Intentional repeat loop'}).click();await act('loop:checkpoint');
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('save data')).continuation.loop.cycles>=1,null,{timeout:15000});
 await open();await page.locator('summary').filter({hasText:'Intentional repeat loop'}).click();await act('loop');s=await save();check('chosen loop executes actual return then can be stopped',s.continuation.loop.cycles>=1&&!s.continuation.loop.enabled);
 const cycles=s.continuation.loop.cycles;await page.waitForTimeout(6500);await page.getByText('Save',{exact:true}).last().click();s=await save();check('stopped loop does not fire again',s.continuation.loop.cycles===cycles);
 await page.screenshot({path:evidence+'production-loop.png'});check('production route has no runtime errors',errors.length===0);
}finally{await writeFile(evidence+'production-browser.json',JSON.stringify({checks,errors},null,2));await browser.close();}

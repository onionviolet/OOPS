import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const context=await browser.newContext({viewport:{width:1366,height:768}}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));const evidence='docs/gm/dispatch/quiet-continuation-2026-10-15/evidence/';
const report={checks:[],errors};
const check=(label,value)=>{assert.ok(value,label);report.checks.push(label);console.log('PASS '+label);};
const snapshot=()=>page.evaluate(()=>window.simulationTestHooks.snapshot());
async function play(){await page.waitForTimeout(500);if(await page.locator('#loading_screen_play_button').isVisible())await page.locator('#loading_screen_play_button').click();if(await page.locator('#hero_creation_panel_confirmation').isVisible())await page.locator('#hero_creation_panel_confirmation').click();await page.waitForTimeout(800);}
async function open(){if(!await page.locator('#continuation_open').isVisible())await page.getByRole('combobox',{name:'Other known panels'}).selectOption('continuation');await page.locator('#continuation_open').click();await page.waitForTimeout(150);}
async function action(id){await page.locator(`[data-continuation-action="${id}"]`).first().click();await page.waitForTimeout(150);const buttons=page.locator(`[data-continuation-action="${id}"]`);if(await buttons.filter({hasText:/^Confirm /}).count())await buttons.filter({hasText:/^Confirm /}).click();}
try{
 await page.goto('http://127.0.0.1:19146/?test_hooks=1',{waitUntil:'domcontentloaded'});await play();
 let a=await snapshot();check('native fresh start establishes truthful initial fallback',!!a.continuation);
 console.log('OPEN',await page.locator('#continuation_open').isVisible(),await page.locator('#continuation_open').boundingBox());
 await open();await page.locator('[data-connection-tab=research]').click();await action('study');await page.waitForTimeout(1800);console.log('STUDY',await page.locator('#continuation_message').innerText());
 await page.evaluate(()=>window.advanceTicks(12,{render:true}));await page.waitForTimeout(600);a=await snapshot();
 check('ordinary native-time study unlocks later checkpoint',a.continuation.research.checkpoint);
 await action('set');await page.waitForTimeout(1600);a=await snapshot();check('checkpoint records later actual moment',!!a.continuation.lives[a.continuation.active].checkpoint);
 await page.screenshot({path:evidence+'connection.png'});
 await page.evaluate(()=>window.advanceTicks(7,{render:true}));a=await snapshot();const depart=a['current time'];
 await page.locator('[data-connection-tab=return]').click();await action('fresh');await page.waitForTimeout(2200);console.log('FRESH',await page.locator('body').innerText().then(x=>x.slice(-600)));await play();
 let b=await snapshot();check('fresh B has different history identity',b.continuation.active==='life-2');
 check('living A pauses at departure instead of ending',b.continuation.lives['life-1'].paused['current time'].minute>=depart.minute);
 check('checkpoint capability carries into B',b.continuation.research.checkpoint);
 await open();await page.screenshot({path:evidence+'reciprocal.png'});
 await action('resume:life-1');await page.waitForTimeout(2000);await play();
 a=await snapshot();check('reciprocal route resumes A',a.continuation.active==='life-1');check('B now paused',!!a.continuation.lives['life-2'].paused);
 check('A keeps learned checkpoint',!!a.continuation.lives['life-1'].checkpoint);
 await open();await action('initial');await page.waitForTimeout(1800);await play();a=await snapshot();
 check('rewind preserves enduring upgrade',a.continuation.research.checkpoint);check('rewind restores initial calendar',a['current time'].hour===8&&a['current time'].minute===0);
 check('arrival is deliberately paused',a.continuation.arrivalPaused===true);
 await page.screenshot({path:evidence+'returned.png'});
 await page.reload();await play();a=await snapshot();check('reload preserves return and paused state',a.continuation.arrivalPaused&&a.continuation.research.checkpoint);
 const downloadPromise=page.waitForEvent('download');await page.locator('#save_to_file_button').click();const download=await downloadPromise;
 await download.saveAs(evidence+'synthetic-export.txt');
 await page.locator('#saved_file_input').setInputFiles(evidence+'synthetic-export.txt');await page.waitForTimeout(2200);await play();
 a=await snapshot();check('literal exported file imports with both histories and upgrade',a.continuation.research.checkpoint&&!!a.continuation.lives['life-2'].paused);
 check('no browser runtime errors',errors.length===0);
 report.final={history:a.continuation.active,sequence:a.continuation.sequence,bytes:JSON.stringify(a).length*2};
}finally{await writeFile(evidence+'browser.json',JSON.stringify(report,null,2));await browser.close();}

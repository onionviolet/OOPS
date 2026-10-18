import {createRequire} from 'node:module';import {writeFile} from 'node:fs/promises';import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),context=await browser.newContext({viewport:{width:1366,height:768}}),page=await context.newPage(),checks=[],errors=[];
page.on('pageerror',e=>errors.push(e.message));const evidence='docs/gm/dispatch/quiet-continuation-2026-10-15/evidence/';
const check=(label,value)=>{assert.ok(value,label);checks.push(label);console.log('PASS '+label);};
const snapshot=()=>page.evaluate(()=>window.simulationTestHooks.snapshot());
async function play(){await page.waitForTimeout(600);await page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:15000});if(await page.locator('#loading_screen_play_button').isVisible())await page.locator('#loading_screen_play_button').click();await page.waitForTimeout(400);if(await page.locator('#hero_creation_panel_confirmation').isVisible())await page.locator('#hero_creation_panel_confirmation').click();await page.waitForTimeout(800);}
async function open(){if(!await page.locator('#continuation_open').isVisible())await page.getByRole('combobox',{name:'Other known panels'}).selectOption('continuation');await page.locator('#continuation_open').click();}
async function act(id){await page.locator(`[data-continuation-action="${id}"]`).click();await page.waitForTimeout(100);const c=page.locator(`[data-continuation-action="${id}"]`).filter({hasText:/^Confirm /});if(await c.count())await c.click();await page.waitForTimeout(1600);}
try{
 await page.goto('http://127.0.0.1:19146/?test_hooks=1',{waitUntil:'domcontentloaded'});await play();
 await page.locator('#options_button').click();await page.locator('#native_save_authority > summary').click();await page.getByText('Enroll this game',{exact:true}).click();await page.waitForTimeout(1600);await page.locator('#options_button').click();
 check('existing native authority enrollment is active',await page.evaluate(()=>localStorage.getItem('yairpg:p23:native-authority:1:live')!==null));
 await page.evaluate(()=>window.start_activity('meditating'));await page.evaluate(()=>window.advanceTicks(4,{render:true}));let a=await snapshot();check('native work actually started',a.current_activity?.activity_id==='meditating');
 await open();await act('fresh');await play();let b=await snapshot();check('occupied A can depart through continuation boundary',b.continuation.active==='life-2');
 const paused=b.continuation.lives['life-1'].paused;check('paused A retains native activity',paused.current_activity.activity_id==='meditating');
 await open();await act('resume:life-1');await play();a=await snapshot();check('paused work restores at exact departure progress',a.current_activity.activity_id==='meditating'&&a.current_activity.gathering_time===paused.current_activity.gathering_time);
 await page.waitForTimeout(700);let before=await snapshot();await page.waitForTimeout(1200);let after=await snapshot();check('arrival actually freezes native time and work',JSON.stringify(before['current time'])===JSON.stringify(after['current time'])&&before.levels.person.main_character.skill_xp.Meditation===after.levels.person.main_character.skill_xp.Meditation);
 await open();await act('continue');await page.evaluate(()=>window.advanceTicks(3,{render:true}));after=await snapshot();check('deliberately continuing advances resumed work',JSON.stringify(after['current time'])!==JSON.stringify(before['current time'])&&after.current_activity.activity_id==='meditating');
 // Synthetic quota injection targets only this browser context's authoritative root.
 await page.evaluate(()=>{window.simulationTestHooks.pause();window.__continuationSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='yairpg:p23:native-authority:1:live')throw new DOMException('Synthetic quota failure','QuotaExceededError');return window.__continuationSetItem.call(this,k,v);};});
 const bytes=await page.evaluate(()=>localStorage.getItem('yairpg:p23:native-authority:1:live'));await act('initial');
 check('quota rejection preserves exact enrolled root',bytes===await page.evaluate(()=>localStorage.getItem('yairpg:p23:native-authority:1:live')));check('quota error is shown',/room|quota/i.test(await page.locator('#continuation_message').innerText()));
 await page.evaluate(()=>{Storage.prototype.setItem=window.__continuationSetItem;});
 const readonly=await context.newPage();await readonly.goto('http://127.0.0.1:19146/?test_hooks=1',{waitUntil:'domcontentloaded'});await readonly.waitForTimeout(1400);
 check('second tab cannot obtain save writer',await readonly.evaluate(()=>navigator.locks.request('yairpg-save:save data',{ifAvailable:true},lock=>!lock)));await readonly.close();
 await page.screenshot({path:evidence+'quota-preserved.png'});check('boundary journey has no runtime errors',errors.length===0);
}catch(e){console.log('BODY', (await page.locator('body').innerText()).slice(-1600),'ERRORS',JSON.stringify(errors));await page.screenshot({path:evidence+'boundary-debug.png'});throw e;}finally{await writeFile(evidence+'boundary-browser.json',JSON.stringify({checks,errors},null,2));await browser.close();}

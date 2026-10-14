const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');const path=require('path');
(async()=>{const profile=fs.mkdtempSync('/private/tmp/body-b8-');const c=await chromium.launchPersistentContext(profile,{channel:'chrome',headless:true,viewport:{width:1366,height:768}});const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://127.0.0.1:19480/');await p.locator('#loading_screen_play_button').click();await p.locator('#hero_creation_name_field').fill('B8 layout observer');await p.locator('#hero_creation_panel_confirmation').click();await p.waitForTimeout(1600);
await p.screenshot({path:path.join(__dirname,'current-opening-1366x768.png')});
await p.locator('#character_show_bio').click();await p.screenshot({path:path.join(__dirname,'current-bio-1366x768.png')});
console.log(await p.locator('body').innerText());
fs.writeFileSync(path.join(__dirname,'current-observation.json'),JSON.stringify({url:p.url(),profile,errors,at:new Date().toISOString(),panels:await p.locator('[data-module]').evaluateAll(es=>es.map(e=>({id:e.dataset.module,text:e.innerText.slice(0,220),rect:JSON.parse(JSON.stringify(e.getBoundingClientRect()))})))},null,2));
await p.setViewportSize({width:1920,height:1080});await p.screenshot({path:path.join(__dirname,'current-bio-1920x1080.png')});await c.close();})();

const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path');
const R=require('../vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const E=path.join(__dirname,'evidence');
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const c=await b.newContext({viewport:{width:1366,height:768}}),p=await c.newPage();
 await p.goto('http://127.0.0.1:19115/');await R.startFresh(p);await p.waitForTimeout(700);
 await p.locator('#village_mixing_open').click();
 const measure=()=>p.evaluate(()=>Object.fromEntries(['location_actions_div','crafting_window','village_mixing_panel','crafting_mainpage_buttons'].map(id=>{const n=document.getElementById(id);return [id,{display:getComputedStyle(n).display,box:n.getBoundingClientRect().toJSON()}]})));
 const results={fresh:await measure()};await p.screenshot({path:path.join(E,'s1-before-mixing.png')});
 await p.getByRole('button',{name:'Back to local actions',exact:true}).click();
 results.freshBack=await measure();
 await p.locator('#village_mixing_open').click();
 // Existing native entry point, representing a native mode opened over mixing.
 await p.evaluate(()=>window.openCraftingWindow());
 results.nativeOverMixing=await measure();
 await p.evaluate(()=>window.closeCraftingWindow());
 await p.locator('#village_mixing_open').click();
 await p.getByRole('button',{name:'Back to local actions',exact:true}).click();
 await p.evaluate(()=>window.openCraftingWindow());
 results.reopenedNative=await measure();
 await p.screenshot({path:path.join(E,'s1-before-overlap.png')});
 await p.keyboard.press('Escape');results.escape=await measure();
 fs.writeFileSync(path.join(E,'s1-repro.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});

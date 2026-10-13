import {chromium} from '/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';import crypto from 'node:crypto';
const out=new URL('.',import.meta.url).pathname, candidate='/Users/weiwei/.codex/candidates/yairpg-foundation-adoption-2026-10-13-r9';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const context=await browser.newContext({viewport:{width:1600,height:1100},acceptDownloads:true});
const page=await context.newPage();page.setDefaultTimeout(5000);
const bindings=[];const errors=[];page.on('pageerror',e=>errors.push(e.message));
page.on('response',async r=>{if(r.url().includes('/dist/bundle.js?')){const b=await r.body();bindings.push({url:r.url(),loadedHash:hash(b),candidateHash:hash(fs.readFileSync(candidate+'/dist/bundle.js')),fetchHash:hash(Buffer.from(await (await fetch(r.url())).arrayBuffer()))});}});
try{
 await page.goto('http://127.0.0.1:18740/',{waitUntil:'networkidle',timeout:15000});
 await page.locator('#saved_file_input').setInputFiles(out+'../r8/final-earned-native.txt');
 await page.waitForFunction(()=>localStorage.getItem('save data')||localStorage.getItem('dev save data'),{timeout:8000});
 await page.waitForLoadState('networkidle');
 await page.waitForFunction(()=>document.querySelector('#loading_screen_play_button')?.className.includes('none_display')===false,{timeout:8000});
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('dev save data')||localStorage.getItem('save data')));
 fs.writeFileSync(out+'ENTRY_RESTORED.json',JSON.stringify(saved,null,2)+'\n');
 await page.screenshot({path:out+'ENTRY_PAUSED.png',fullPage:true});
 const original=JSON.parse(Buffer.from(fs.readFileSync(out+'../r8/final-earned-native.txt','utf8').split(':')[1],'base64'));
 const groups=['character','inventories','expansion','current time','current location','npcs','npc_equipment'];
 const equal=groups.map(group=>({group,equal:JSON.stringify(saved[group])===JSON.stringify(original[group])}));
 fs.writeFileSync(out+'NATIVE_RESULT.json',JSON.stringify({status:'SOURCE-ONLY / BLOCKED',playClicked:false,viewport:[1600,1100],clock:saved.expansion.clock,calendar:saved['current time'],pausedPlayVisible:await page.locator('#loading_screen_play_button').isVisible(),restoration:equal,pageErrors:errors,bindings,text:(await page.locator('body').innerText()).slice(0,2500)},null,2)+'\n');
 console.log(JSON.stringify({clock:saved.expansion.clock,equal,errors,bindings,paused:true}));
}finally{await browser.close();}

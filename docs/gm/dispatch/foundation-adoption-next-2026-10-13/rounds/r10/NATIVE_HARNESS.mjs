import {chromium} from '/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';import crypto from 'node:crypto';import readline from 'node:readline';
const out=new URL('.',import.meta.url).pathname,candidate='/Users/weiwei/.codex/candidates/yairpg-foundation-adoption-2026-10-13-r10';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const context=await browser.newContext({viewport:{width:1600,height:1100},acceptDownloads:true});
const page=await context.newPage();page.setDefaultTimeout(15000);const errors=[],bindings=[],batches=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',async r=>{if(r.status()===200&&r.url().includes('/dist/bundle.js?'))bindings.push({url:r.url(),loadedHash:hash(await r.body()),candidateHash:hash(fs.readFileSync(candidate+'/dist/bundle.js')),fetchHash:hash(Buffer.from(await(await fetch(r.url())).arrayBuffer()))});});
const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('dev save data')||localStorage.getItem('save data')));
async function pause(name){await page.locator('#save_button').click();const s=await saved();fs.writeFileSync(out+name+'.json',JSON.stringify(s,null,2));await page.reload({waitUntil:'domcontentloaded',timeout:15000});await page.locator('#loading_screen_play_button').waitFor({state:'visible'});return s;}
async function batch(name,fn){let ok=false;try{const before=await saved();batches.push({name,beforeClock:before?.expansion.clock});await fn();ok=true;}finally{if(!ok){try{await pause('ERROR_LATEST_EARNED_'+Date.now());}catch(e){fs.writeFileSync(out+'ERROR_FAILSAFE.txt',String(e));await browser.close();}fs.writeFileSync(out+'ERRORS.json',JSON.stringify(errors));}}}
try { await page.goto('http://127.0.0.1:18741/',{waitUntil:'networkidle'});await page.locator('#saved_file_input').setInputFiles(out+'../r8/final-earned-native.txt');await page.waitForFunction(()=>!!(localStorage.getItem('dev save data')||localStorage.getItem('save data')));await page.waitForTimeout(1500);await page.reload({waitUntil:'domcontentloaded',timeout:15000});await page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:15000});await page.waitForTimeout(1000);
const entry=await saved();fs.writeFileSync(out+'ENTRY_RESTORED.json',JSON.stringify(entry,null,2));fs.writeFileSync(out+'LOADED_BINDINGS.json',JSON.stringify(bindings,null,2));console.log(JSON.stringify({ready:true,clock:entry.expansion.clock,bindings,errors}));
} catch(e) { fs.writeFileSync(out+'ENTRY_ERROR.txt',e.stack); fs.writeFileSync(out+'ENTRY_DIAGNOSIS.json',JSON.stringify({errors,body:await page.locator('body').innerText(),save:await saved()},null,2)); await page.screenshot({path:out+'ENTRY_ERROR.png'}); await browser.close(); throw e; }
const rl=readline.createInterface({input:process.stdin});
for await(const code of rl){try{console.log(JSON.stringify(await eval('(async()=>{'+code+'})()')));}catch(e){console.log(JSON.stringify({error:e.stack}));}}
await browser.close();

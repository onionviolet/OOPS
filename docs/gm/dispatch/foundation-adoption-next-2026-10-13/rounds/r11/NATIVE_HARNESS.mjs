import {chromium} from '/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';import crypto from 'node:crypto';import readline from 'node:readline';
const out=new URL('.',import.meta.url).pathname,candidate='/Users/weiwei/.codex/candidates/yairpg-foundation-adoption-2026-10-13-r11',profile='/Users/weiwei/.codex/candidates/yairpg-foundation-adoption-2026-10-13-r11-native-profile';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const context=await chromium.launchPersistentContext(profile,{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,viewport:{width:1600,height:1100},acceptDownloads:true});
const page=context.pages()[0]||await context.newPage();page.setDefaultTimeout(2500);const errors=[],bindings=[],batches=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',async r=>{if(r.status()===200&&r.url().includes('/dist/bundle.js?')){try{bindings.push({url:r.url(),loadedHash:hash(await r.body()),candidateHash:hash(fs.readFileSync(candidate+'/dist/bundle.js')),fetchHash:hash(Buffer.from(await(await fetch(r.url())).arrayBuffer()))});}catch(e){errors.push('binding:'+e.message);}}});
const saved=()=>page.evaluate(()=>({key:localStorage.getItem('dev save data')?'dev save data':'save data',data:JSON.parse(localStorage.getItem('dev save data')||localStorage.getItem('save data')||'null')}));
async function pause(name){await page.getByRole('button',{name:'Save',exact:true}).click();const s=await saved();fs.writeFileSync(out+name+'.json',JSON.stringify(s,null,2));await page.reload({waitUntil:'domcontentloaded',timeout:15000});await page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:15000});return s;}
async function batch(name,fn){let ok=false;try{batches.push({name});const value=await fn();ok=true;return value;}finally{if(!ok){try{await pause('ERROR_LATEST_EARNED_'+Date.now());}catch(e){fs.writeFileSync(out+'ERROR_FAILSAFE.txt',String(e));}fs.writeFileSync(out+'ERRORS.json',JSON.stringify(errors));}fs.writeFileSync(out+'BATCHES.json',JSON.stringify(batches));}}
await page.goto('http://127.0.0.1:18742/',{waitUntil:'domcontentloaded',timeout:15000});await page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:15000});
console.log(JSON.stringify({ready:true,body:(await page.locator('body').innerText()).slice(0,1400),saved:await saved(),profile}));
const rl=readline.createInterface({input:process.stdin});for await(const code of rl){try{console.log(JSON.stringify(await eval('(async()=>{'+code+'})()')));}catch(e){console.log(JSON.stringify({error:e.stack}));}}
// Durable profile is intentionally retained even after the harness exits.
await context.close();

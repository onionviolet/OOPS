// Native reload regression on an isolated save origin. Never reads player data.
import {createRequire} from 'node:module';
import {readFile,mkdtemp,mkdir,writeFile,cp} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import assert from 'node:assert/strict';
import {defaultCustomizationState} from '../../src/customization_profiles.js';
import {resumeElectronGame} from './electron_ready.mjs';
const require=createRequire(import.meta.url),{_electron}=require('../ui_helpers.cjs').loadPlaywright();
const root=resolve('.'),out=resolve(process.argv[2]||'docs/reviews/corc_ui_2026-10-21/reload');await mkdir(out,{recursive:true});
const profile=await mkdtemp(join(tmpdir(),'oops-reload-'));
if(process.env.RELOAD_PROFILE)await cp(process.env.RELOAD_PROFILE,profile,{recursive:true});
const app=await _electron.launch({executablePath:require('electron'),args:[root],cwd:root,env:{...process.env,YAIRPG_USER_DATA:profile,YAIRPG_ROOT:root,YAIRPG_HIDDEN:'1'}});
const page=await app.firstWindow(),errors=[],loads=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{
 if(window.name.startsWith('RELOAD_SEED:')){localStorage.setItem('save data',window.name.slice(12));window.name='';}
});
async function ready(i){
 try{await resumeElectronGame(page,{timeout:10000});}
 catch(error){
  const state=await page.evaluate(()=>({buttons:[...document.querySelectorAll('[id="loading_screen_play_button"]')].map(n=>({html:n.outerHTML,display:getComputedStyle(n).display,rect:n.getBoundingClientRect().toJSON()})),progress:document.querySelector('#loading_screen_loading_progress')?.textContent,trace:window.__reloadTrace,body:document.body.innerText.slice(0,1500)}));
  await page.screenshot({path:join(out,`failure-${i}.png`)});await writeFile(join(out,'failure.json'),JSON.stringify({i,error:error.stack,state,errors,loads},null,2));throw error;
 }
 loads.push({i,ready:true});await page.locator('#inventory_content_div').waitFor({state:'visible'});
}
try{
 await ready(-1);
 const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));delete seed.availabilities.recipe.undefined;delete seed.availabilities.recipe['recipe/undefined'];seed.customization=defaultCustomizationState();if(process.env.RELOAD_SKIP_PLAY==='1')seed.options.skip_play_button=true;
 if(!process.env.RELOAD_PROFILE)await page.evaluate(s=>window.name='RELOAD_SEED:'+JSON.stringify(s),seed);
 await page.reload();
 for(let i=0;i<Number(process.env.RELOAD_COUNT||16);i++){
  await ready(i);
  if(process.env.RELOAD_EQUIP==='1'){
   await page.setViewportSize(i%2?{width:1536,height:864}:{width:1920,height:1080});
   await page.locator('#inventory_content_div .item_name').filter({hasText:'Cheap leather pants'}).click();
   const equip=page.getByRole('button',{name:'Equip',exact:true}),off=page.getByRole('button',{name:'Take off',exact:true});
   if(await equip.count())await equip.click();else if(await off.count())await off.click();
  }
  await page.locator('#save_button').click();await page.reload();
 }
 await ready('final');assert.deepEqual(errors,[]);await writeFile(join(out,'receipt.json'),JSON.stringify({profile,loads,errors},null,2));console.log(JSON.stringify({loads:loads.length,errors,profile}));
}finally{await app.close();}

// Native desktop comparison on a disposable profile. No player save is read.
import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile,mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import assert from 'node:assert/strict';
import {defaultCustomizationState} from '../../src/customization_profiles.js';
const require=createRequire(import.meta.url),{loadPlaywright}=require('../ui_helpers.cjs');
const {_electron}=loadPlaywright();
const root=resolve(process.argv[2]||'.'),out=resolve(process.argv[3]||'docs/reviews/corc_ui_2026-10-21/baseline');
await mkdir(out,{recursive:true});
const profile=await mkdtemp(join(tmpdir(),'oops-corc-electron-'));
const app=await _electron.launch({executablePath:require('electron'),args:[resolve('.')],cwd:resolve('.'),env:{...process.env,YAIRPG_USER_DATA:profile,YAIRPG_ROOT:root,YAIRPG_HIDDEN:'1'}});
const page=await app.firstWindow(),errors=[];page.on('pageerror',e=>errors.push(e.message));
const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));seed.customization=defaultCustomizationState();
delete seed.availabilities?.recipe?.undefined;
if(seed.availabilities?.recipe)delete seed.availabilities.recipe['recipe/undefined'];
const receipt={root,profile,url:page.url(),cases:[]};
async function open(fixture){
 await page.evaluate(s=>{localStorage.setItem('save data',JSON.stringify(s));},fixture);await page.reload();
 await page.locator('#loading_screen_play_button').click({timeout:60000});await page.waitForTimeout(650);await page.evaluate(()=>document.fonts.ready);
}
try{
 for(const [width,height,size] of [[1920,1080,14],[1920,1080,21],[1800,1040,14],[1536,864,21]]){
  const fixture=structuredClone(seed);fixture.customization.profiles.Default.settings.typography.size=size;
  await page.setViewportSize({width,height});await open(fixture);
  const pants=page.locator('#inventory_content_div .item_name').filter({hasText:'Cheap leather pants'});await pants.click();await page.waitForTimeout(500);
  const equip=page.locator('#proto23_item_detail button').filter({hasText:/^Equip$/i});if(await equip.count()){await equip.click();await page.waitForTimeout(650);}
  await page.screenshot({path:join(out,`inventory-${width}-${size}.png`)});
  const description=await page.locator('#proto23_item_detail').innerText();
  const fonts=await page.evaluate(()=>[...document.querySelectorAll('#inventory_content_div .item_name,#proto23_item_detail,#proto23_character')].slice(0,8).map(n=>({text:n.textContent.slice(0,60),family:getComputedStyle(n).fontFamily,weight:getComputedStyle(n).fontWeight,size:getComputedStyle(n).fontSize})));
  receipt.cases.push({width,height,size,description,fonts,overflow:await page.evaluate(()=>[document.documentElement.scrollWidth>innerWidth,document.documentElement.scrollHeight>innerHeight])});
  if(process.env.CORC_VERIFY==='1'){
   assert.equal((description.match(/Cold tolerance: \+0.5/g)||[]).length,1,'summary shows a modifier once');
   assert(await page.locator('.shell-worn-summary button[data-shell-slot="legs"]').isVisible(),'worn gear directly visible');
   await page.locator('.shell-worn-summary button[data-shell-slot="legs"]').click();
   assert(await page.getByRole('button',{name:'Take off',exact:true}).isVisible());
   await page.getByRole('button',{name:'Take off',exact:true}).click();await page.waitForTimeout(650);
   assert.equal(await page.locator('.shell-worn-summary button').count(),0,'summary reconciles unequip');
   await pants.click();await page.waitForTimeout(450);await page.getByRole('button',{name:'Equip',exact:true}).click();await page.waitForTimeout(650);
   await page.locator('#save_button').click();await page.reload();await page.locator('#loading_screen_play_button').click();await page.waitForTimeout(650);
   assert(await page.locator('.shell-worn-summary button[data-shell-slot="legs"]').isVisible(),'native equipment persists on reload');
  }
 }
 await writeFile(join(out,'description.html'),await page.locator('#proto23_item_detail').innerHTML());
 assert.deepEqual(errors,[]);receipt.errors=errors;
 await writeFile(join(out,'receipt.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify({cases:receipt.cases.length,errors,out}));
}finally{await app.close();}

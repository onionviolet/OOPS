// Native desktop comparison on a disposable profile. No player save is read.
import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile,mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import assert from 'node:assert/strict';
import {createHarvest,drawSpecimen,addCarcass} from '../../src/harvest.js';
import {calendarMinutes} from '../../src/world_rhythm.js';
import {defaultCustomizationState} from '../../src/customization_profiles.js';
import {resumeElectronGame} from './electron_ready.mjs';
const require=createRequire(import.meta.url),{loadPlaywright}=require('../ui_helpers.cjs');
const {_electron}=loadPlaywright();
const root=resolve(process.argv[2]||'.'),out=resolve(process.argv[3]||'docs/reviews/corc_ui_2026-10-21/baseline');
await mkdir(out,{recursive:true});
const profile=await mkdtemp(join(tmpdir(),'oops-corc-electron-'));
const app=await _electron.launch({executablePath:require('electron'),args:[resolve('.')],cwd:resolve('.'),env:{...process.env,YAIRPG_USER_DATA:profile,YAIRPG_ROOT:root,YAIRPG_HIDDEN:'1'}});
const page=await app.firstWindow(),errors=[];page.on('pageerror',e=>errors.push(e.message));
// Let the first native load finish before replacing the disposable fixture.
await page.locator('#loading_screen_play_button:not(.none_display)').waitFor({state:'visible',timeout:60000});
await page.addInitScript(()=>{
 if(window.name.startsWith('CORC_FIXTURE:')){localStorage.setItem('save data',window.name.slice(13));window.name='';}
});
const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));seed.customization=defaultCustomizationState();
delete seed.availabilities?.recipe?.undefined;
if(seed.availabilities?.recipe)delete seed.availabilities.recipe['recipe/undefined'];
const receipt={root,profile,url:page.url(),cases:[]};
async function open(fixture){
 // Apply after the departing page's unload/save handlers have finished.
 await page.evaluate(s=>{window.name='CORC_FIXTURE:'+JSON.stringify(s);},fixture);await page.reload();
 await resumeElectronGame(page);await page.waitForTimeout(650);await page.evaluate(()=>document.fonts.ready);
}
try{
 for(const [width,height,size] of [[1920,1080,14],[1920,1080,21],[1800,1040,14],[1800,1040,21],[1536,864,14],[1536,864,21]]){
  const fixture=structuredClone(seed);fixture.customization.profiles.Default.settings.typography.size=size;
  await page.setViewportSize({width,height});await open(fixture);
  const pants=page.locator('#inventory_content_div .item_name').filter({hasText:'Cheap leather pants'});await pants.click();await page.waitForTimeout(500);
  const equip=page.locator('#proto23_item_detail button').filter({hasText:/^Equip$/i});if(await equip.count()){await equip.click();await page.waitForTimeout(650);}
  await page.screenshot({path:join(out,`inventory-${width}-${size}.png`)});
  const description=await page.locator('#proto23_item_detail').innerText();
  const fonts=await page.evaluate(()=>[...document.querySelectorAll('#inventory_content_div .item_name,#proto23_item_detail,#proto23_character')].slice(0,8).map(n=>({text:n.textContent.slice(0,60),family:getComputedStyle(n).fontFamily,weight:getComputedStyle(n).fontWeight,size:getComputedStyle(n).fontSize})));
  receipt.cases.push({width,height,size,description,fonts,overflow:await page.evaluate(()=>[document.documentElement.scrollWidth>innerWidth,document.documentElement.scrollHeight>innerHeight])});
  if(process.env.CORC_VERIFY==='1'){
   const cdp=await page.context().newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');
   const {root:dom}=await cdp.send('DOM.getDocument');const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:dom.nodeId,selector:'#inventory_content_div .item_name'});
   const actual=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});
   const {nodeId:smallNode}=await cdp.send('DOM.querySelector',{nodeId:dom.nodeId,selector:'.nearby-context-list small'});
   const smallFonts=await cdp.send('CSS.getPlatformFontsForNode',{nodeId:smallNode});await cdp.detach();
   assert(smallFonts.fonts.some(f=>f.familyName===`OOPS Gothic Bitmap ${Math.round(size*.85)}`&&f.isCustomFont),'secondary labels render the matching native strike');receipt.cases.at(-1).smallFonts=smallFonts.fonts;
   const sheet=await page.evaluate(()=>({
    backing:getComputedStyle(document.querySelector('#inventory_div')).backgroundColor,
    labels:[...document.querySelectorAll('.shell-core-stats > button')].map(n=>{
     const label=n.firstElementChild.getBoundingClientRect(),value=n.children[1].getBoundingClientRect();
     return {name:n.dataset.statRecord,overlap:label.right>value.left+1,outside:n.scrollWidth>n.clientWidth+1};
    }),smallSize:getComputedStyle(document.querySelector('.nearby-context-list small')).fontSize
   }));
   assert.equal(sheet.backing,'rgb(8, 21, 42)','inventory backing is opaque');
   assert.equal(sheet.smallSize,`${Math.round(size*.85)}px`);
   assert(sheet.labels.every(n=>!n.overlap&&!n.outside),'You label/value pairs stay together without collision');receipt.cases.at(-1).sheet=sheet;
   assert(actual.fonts.some(f=>f.familyName===`OOPS Gothic Bitmap ${size}`&&f.isCustomFont),'actual native bitmap face rendered');receipt.cases.at(-1).actualFonts=actual.fonts;
   assert.deepEqual(receipt.cases.at(-1).overflow,[false,false]);
   assert.equal((description.match(/Cold tolerance: \+0.5/g)||[]).length,1,'summary shows a modifier once');
   assert.match(description,/^Equipment/,'equipped inspection retains its equipment kind');
   assert(await page.locator('.shell-worn-summary button[data-shell-slot="legs"]').isVisible(),'worn gear directly visible');
   const body=await page.locator('#shell_condition > details > summary').first().boundingBox(),region=await page.locator('[data-region="player"]').boundingBox();
   assert(body&&region&&body.y+body.height<=region.y+region.height+1,'Body route remains inside the character region');
   const price=await page.locator('#inventory_content_div > .equipped_item_control .item_value').first().boundingBox(),take=await page.locator('#inventory_content_div > .equipped_item_control .unequip_item_button').first().boundingBox();
   assert(price&&take&&!(price.x<take.x+take.width&&price.x+price.width>take.x&&price.y<take.y+take.height&&price.y+price.height>take.y),'native price and take-off action do not overlap');
   const itemRow=await page.locator('#inventory_content_div > .equipped_item_control').first().boundingBox();
   assert(itemRow&&Math.max(price.x+price.width,take.x+take.width)<=itemRow.x+itemRow.width+1,'native price and action fit inside the equipped row');
   if(process.env.CORC_VISUAL_ONLY==='1')continue;
   const worn=page.locator('.shell-worn-summary button[data-shell-slot="legs"]');await worn.focus();await page.waitForTimeout(650);
   assert(await worn.evaluate(n=>document.activeElement===n),'worn-slot focus survives updates');
   await worn.click();
   assert(await page.getByRole('button',{name:'Take off',exact:true}).isVisible());
   await page.getByRole('button',{name:'Take off',exact:true}).click();await page.waitForTimeout(650);
   assert.equal(await page.locator('.shell-worn-summary button').count(),0,'summary reconciles unequip');
   await pants.click();await page.waitForTimeout(450);await page.getByRole('button',{name:'Equip',exact:true}).click();await page.waitForTimeout(650);
   await page.locator('#save_button').click();await page.reload();await resumeElectronGame(page);await page.waitForTimeout(650);
   assert(await page.locator('.shell-worn-summary button[data-shell-slot="legs"]').isVisible(),'native equipment persists on reload');
  }
 }
 // Current paired storage already exists. Verify its actual native controls.
 const home=structuredClone(seed);home['current location']='Shack';home.availabilities.location.Shack=1;home.locations.Shack={...home.locations.Shack,housing_unlocked:true};home.customization.profiles.Default.settings.typography.size=21;
 await page.setViewportSize({width:1920,height:1080});await open(home);
 await page.locator('#open_storage_div').click();await page.waitForTimeout(500);
 const bread=JSON.stringify({id:'Stale bread'});await page.locator('#storage_comparison select').selectOption(bread);
 await page.locator('[data-storage-compare="deposit"]').click();await page.waitForTimeout(500);
 assert.match(await page.locator('[data-storage-comparison]').innerText(),/Carried: 4 · In this chest: 1/);
 await page.screenshot({path:join(out,'storage-21.png')});await page.locator('[data-storage-compare="withdraw"]').click();
 receipt.storage='Native deposit and withdrawal retained; exact bread stack compared in both holders.';
 // Exercise the native work owner, not a fabricated animation fixture.
 const job=structuredClone(seed),clock=calendarMinutes(job['current time']);job.harvest=createHarvest();
 addCarcass(job.harvest,drawSpecimen({species:'Wolf rat',key:'corc-ui:work',clock:clock-10},()=>.5),{clock,skill:0,tool:0});job.availabilities.skill.Butchering=1;job.levels.person.main_character.skill_xp.Butchering=0;
 await open(job);await page.locator('#workspace_navigation select[aria-label="Other known panels"]').selectOption('carcass-processing');
 await page.locator('#harvest_panel').evaluate(n=>n.open=true);await page.locator('[data-harvest-choice="whole"]').click();await page.waitForTimeout(550);
 assert(await page.locator('#harvest_panel .work-status-view').isVisible());await page.screenshot({path:join(out,'work-14.png')});
 await page.locator('[data-harvest="cancel"]').click();await page.waitForTimeout(500);assert.equal(await page.locator('#harvest_panel .work-status-view').count(),0);
 receipt.work='Native target/method/progress displayed; cancel returns the actual carcass.';
 // Font comparison rendered by Electron, with every sample at its stated CSS size.
 await page.evaluate(async()=>{
  const box=document.createElement('section');box.id='corc-font-comparison';Object.assign(box.style,{position:'fixed',inset:'25px',zIndex:'99999',background:'#06162d',color:'#d5f7ff',padding:'28px',overflow:'auto'});
  const title=document.createElement('h2');title.textContent='MS Gothic: outline and original bitmap glyphs';title.style.font='20px system-ui';box.append(title);
  for(const size of [14,16,18,21])for(const kind of ['Outline','Bitmap']){
   const row=document.createElement('div'),label=document.createElement('div'),sample=document.createElement('div');label.textContent=`${kind} · ${size}px`;label.style.font='13px system-ui';label.style.marginTop='12px';
   sample.textContent='You · hp: 45/215 | A Stick | Linen Vest | Cold tolerance: +0.5';
   sample.style.font=`400 ${size}px "${kind==='Bitmap'?`OOPS Gothic Bitmap ${size}`:'OOPS MS Gothic'}"`;sample.style.fontSynthesis='none';row.append(label,sample);box.append(row);
  }document.body.append(box);await document.fonts.ready;
 });await page.locator('#corc-font-comparison').screenshot({path:join(out,'font-comparison.png')});
 await page.evaluate(()=>document.querySelector('#corc-font-comparison').remove());
 assert.deepEqual(errors,[]);receipt.errors=errors;
 await writeFile(join(out,'receipt.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify({cases:receipt.cases.length,errors,out,profile}));
}catch(error){await page.screenshot({path:join(out,'failure.png')}).catch(()=>{});const state=await page.evaluate(()=>({buttons:[...document.querySelectorAll('[id="loading_screen_play_button"]')].map(n=>n.outerHTML),trace:window.__reloadTrace,body:document.body.innerText.slice(0,1800)})).catch(()=>null);await writeFile(join(out,'failure.json'),JSON.stringify({error:error.stack,errors,receipt,state},null,2));throw error;
}finally{await app.close();}

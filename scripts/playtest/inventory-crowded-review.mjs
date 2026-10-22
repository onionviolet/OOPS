// Crowded native stock review, exact combined frozen build, spare profile only.
import {createRequire} from 'node:module';
import {readFile,writeFile,mkdtemp,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import assert from 'node:assert/strict';
import {defaultCustomizationState} from '../../src/customization_profiles.js';
import {resumeElectronGame} from './electron_ready.mjs';
const require=createRequire(import.meta.url),{_electron}=require('../ui_helpers.cjs').loadPlaywright(),{makeSnapshot}=require('../../desktop/snapshot.cjs');
const root=resolve('.'),out=resolve('docs/reviews/proto23_desktop_2026-10-21/inventory');await mkdir(out,{recursive:true});
const release=JSON.parse(await readFile('docs/gm/dispatch/minecraft-fit-2026-10-21/ROUTES_RELEASE.json','utf8'));
const profile=await mkdtemp(join(tmpdir(),'oops-inventory-review-'));const snapshot=makeSnapshot(release.candidate,profile);
const app=await _electron.launch({executablePath:require('electron'),args:[root],cwd:root,env:{...process.env,YAIRPG_ROOT:'',YAIRPG_USER_DATA:profile,YAIRPG_FROZEN:'1',YAIRPG_HIDDEN:'1'}}),page=await app.firstWindow();
const receipt={snapshot,profile,setup:'Declared test stock: 29 exact native pants quality variants, 5 bread, 2 ordinary materials. No natural acquisition claim.',cases:[],errors:[]};page.on('pageerror',e=>receipt.errors.push(e.message));
const base=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));base.customization=defaultCustomizationState();delete base.availabilities.recipe.undefined;delete base.availabilities.recipe['recipe/undefined'];
base.inventories.person.main_character={};for(let quality=10;quality<=150;quality+=5)base.inventories.person.main_character[JSON.stringify({id:'Cheap leather pants',quality})]={count:1};
base.inventories.person.main_character[JSON.stringify({id:'Stale bread'})]={count:5};base.inventories.person.main_character[JSON.stringify({id:'Rat meat chunks'})]={count:2};
await page.locator('#loading_screen_play_button:not(.none_display)').waitFor({state:'visible',timeout:60000});
await page.addInitScript(()=>{if(window.name.startsWith('STOCK_REVIEW:')){localStorage.setItem('save data',window.name.slice(13));window.name='';}});
try{
 for(const [width,height,size]of [[1920,1080,14],[1920,1080,21],[1800,1040,14],[1800,1040,21],[1536,864,14],[1536,864,21]]){
 const seed=structuredClone(base);seed.customization.profiles.Default.settings.typography.size=size;
 await app.evaluate(({BrowserWindow},{width,height})=>BrowserWindow.getAllWindows()[0].setContentSize(width,height),{width,height});
 await page.evaluate(s=>{window.name='STOCK_REVIEW:'+JSON.stringify(s)},seed);await page.reload();await resumeElectronGame(page);await page.waitForTimeout(500);
 const rows=page.locator('#inventory_content_div > .inventory_item_control');assert.equal(await rows.count(),31);
 await page.locator('[data-control-box="inventory"] > button').click();
 const find=page.getByRole('searchbox',{name:'Find inventory item',exact:true});await find.fill('Stale bread');await page.waitForTimeout(250);
 assert.equal(await rows.evaluateAll(ns=>ns.filter(n=>getComputedStyle(n).display!=='none').length),1);
 await find.fill('Cheap leather pants');await page.waitForTimeout(250);assert.equal(await rows.evaluateAll(ns=>ns.filter(n=>getComputedStyle(n).display!=='none').length),29);
 await page.keyboard.press('Escape');
 await page.locator('#inventory_content_div .item_name').filter({hasText:'Cheap leather pants'}).last().click();await page.waitForTimeout(250);
 assert(await page.getByRole('button',{name:'Equip',exact:true}).isVisible());
 await page.screenshot({path:join(out,`crowded-${width}-${size}.png`)});
 const stats=await page.evaluate(()=>{const list=document.querySelector('#inventory_content_div'),box=list.getBoundingClientRect();return {bodySize:getComputedStyle(document.body).fontSize,rows:list.children.length,list:{width:box.width,height:box.height,scrollHeight:list.scrollHeight},visibleFullRows:[...list.querySelectorAll(':scope > .inventory_item_control')].filter(n=>{const b=n.getBoundingClientRect();return getComputedStyle(n).display!=='none'&&b.top>=box.top&&b.bottom<=box.bottom}).length,overflow:document.documentElement.scrollWidth>innerWidth,detail:document.querySelector('#proto23_item_detail').innerText};});
 assert.equal(stats.overflow,false);receipt.cases.push({width,height,size,...stats});
 }
 assert.deepEqual(receipt.errors,[]);receipt.result='PASS';
}catch(e){receipt.failure=e.stack;await page.screenshot({path:join(out,'failure.png')}).catch(()=>{});throw e;}
finally{await writeFile(join(out,'receipt.json'),JSON.stringify(receipt,null,2));await app.close();}
console.log(JSON.stringify({result:receipt.result,cases:receipt.cases.length,out}));

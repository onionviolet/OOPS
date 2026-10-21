// Combined native gear + presentation review, using disposable fixture stock.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile,mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {defaultCustomizationState} from '../../src/customization_profiles.js';
import {resumeElectronGame} from './electron_ready.mjs';
const require=createRequire(import.meta.url),root=resolve('.'),out=resolve(process.argv[2]||'docs/reviews/corc_ui_2026-10-21/combined/gear');
await mkdir(out,{recursive:true});
const profile=await mkdtemp(join(tmpdir(),'oops-combined-gear-ui-'));
const snapshot=require('../../desktop/snapshot.cjs').makeSnapshot(root,profile);
const {_electron}=require('../ui_helpers.cjs').loadPlaywright();
const app=await _electron.launch({executablePath:require('electron'),args:[root],cwd:root,env:{...process.env,YAIRPG_ROOT:snapshot.root,YAIRPG_USER_DATA:profile,YAIRPG_HIDDEN:'1'}});
const p=await app.firstWindow(),errors=[],checks=[];p.on('pageerror',e=>errors.push(e.message));
const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));
delete seed.availabilities.recipe.undefined;delete seed.availabilities.recipe['recipe/undefined'];
seed.customization=defaultCustomizationState();seed.customization.profiles.Default.settings.typography.size=21;
seed.equipment_durability.enabled=true;seed.global_flags.is_crafting_unlocked=true;seed.availabilities.dialogue.oldCraftsman=1;seed.character.money=1000;
const armor=JSON.stringify({components:{internal:'Leather vest',external:'Steel chainmail vest'},quality:150}),material=JSON.stringify({id:'Cheap iron short blade',quality:100});
for(const [k,count]of [[armor,1],[material,8],[JSON.stringify({id:'Charcoal'}),8]])seed.inventories.person.main_character[k]={count};
await p.addInitScript(()=>{if(window.name.startsWith('CORC_FIXTURE:')){localStorage.setItem('save data',window.name.slice(13));window.name='';}});
async function open(fixture){await p.evaluate(s=>window.name='CORC_FIXTURE:'+JSON.stringify(s),fixture);await p.reload();await resumeElectronGame(p);await p.evaluate(()=>document.fonts.ready);}
async function saved(){return p.evaluate(()=>{saveProgress();return JSON.parse(localStorage.getItem('save data'));});}
try{
 await resumeElectronGame(p);await p.setViewportSize({width:1920,height:1080});await open(seed);
 await p.locator('#workspace_navigation select').first().selectOption('gear-workshop');
 const input=label=>p.getByRole('combobox',{name:label,exact:true});
 await input('Carried gear').selectOption(armor);await input('Maker').selectOption('oldCraftsman');await input('Gear process').selectOption('reforge');await input('Process material').selectOption(material);
 await p.locator('[data-gear-commit]').click();const worked=await input('Carried gear').inputValue();assert.ok(JSON.parse(worked).affixes.length);assert.equal(JSON.parse(worked).gearwork.history.at(-1).maker,'oldCraftsman');
 checks.push('Native craftsman reforge creates affixed armor with real stored work history');
 await p.locator('#center_mode_back').click();
 const rows=p.locator('#inventory_content_div > [data-character_item]'),index=await rows.evaluateAll((ns,k)=>ns.findIndex(n=>n.getAttribute('data-character_item')===k),worked);
 await rows.nth(index).click();await p.getByRole('button',{name:'Equip',exact:true}).click();
 assert.equal((await saved()).character.equipment.torso.inventory_key,worked);await p.reload();await resumeElectronGame(p);
 assert.equal((await saved()).character.equipment.torso.inventory_key,worked);checks.push('Native equip/save/reload retains exact affixes, identity and maker');
 const equipped=await saved();
 for(const [width,height,size]of [[1920,1080,21],[1536,864,21],[1920,1080,14]]){
  const fixture=structuredClone(equipped);fixture.customization.profiles.Default.settings.typography.size=size;
  await p.setViewportSize({width,height});await open(fixture);await p.locator('.shell-worn-summary [data-shell-slot="torso"]').click();await p.waitForTimeout(400);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await p.screenshot({path:join(out,`combined-${width}-${size}.png`)});
  await p.getByRole('button',{name:'Full item ›',exact:true}).click();await p.waitForTimeout(300);
  const detail=p.locator('#proto23_item_detail');assert.match(await detail.innerText(),/Min damage share:/);assert.match(await detail.innerText(),/Damage taken: x0.96/);
  assert.equal(await detail.locator('.shell-description-line').filter({hasText:/^Damage taken:/}).getAttribute('data-detail-role'),'increase');
  assert.equal(await detail.locator('.shell-description-line').filter({hasText:/^Min damage share:/}).getAttribute('data-detail-role'),'increase');
  await p.screenshot({path:join(out,`equipment-${width}-${size}.png`)});
  await detail.locator('.shell-item-specifics > summary').click();assert.match(await detail.locator('.shell-item-specifics').innerText(),/Last work: reforge by old craftsman/);
  if(size===21&&width===1920)await p.screenshot({path:join(out,'equipment-provenance-1920-21.png')});
 }
 checks.push('Full equipment facts, favorable damage reductions and disclosed provenance remain reachable at both desktop text sizes and laptop width');
 const custom=structuredClone(equipped);custom.customization.profiles.Default.modules.belongings={palette:{background:'#182036',text:'#eef4ff',accent:'#b8d8cf'}};
 await open(custom);assert.equal(await p.locator('#inventory_div').evaluate(n=>getComputedStyle(n).backgroundColor),'rgb(24, 32, 54)');checks.push('Explicit player inventory palette retains its chosen backing');
 await p.setViewportSize({width:1920,height:1080});await open(equipped);await p.locator('.shell-worn-summary [data-shell-slot="torso"]').click();await p.waitForTimeout(350);await p.screenshot({path:join(out,'review.png')});
 await p.locator('.nearby-context-list').screenshot({path:join(out,'menu-spacing.png')});
 assert.deepEqual(errors,[]);
 const receipt={base:'cb741db82',profile,snapshot,pid:app.process().pid,checks,errors,fixture:'Midgame fixture with funded craftsman/material stock. Natural acquisition pacing is not asserted.'};
 await writeFile(join(out,'receipt.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));
 if(process.env.COMBINED_REVIEW==='1'){
  await app.evaluate(({BrowserWindow})=>{const win=BrowserWindow.getAllWindows()[0];win.setTitle('OOPS · Combined gear + UI · disposable review save');win.showInactive();});
  await new Promise(resolve=>app.once('close',resolve));
 }else await app.close();
}catch(e){await p.screenshot({path:join(out,'failure.png')}).catch(()=>{});await writeFile(join(out,'failure.json'),JSON.stringify({error:e.stack,errors},null,2));await app.close();throw e;}

// Native divider and hover regression. Synthetic future bars test layout only.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile,mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {defaultCustomizationState} from '../../src/customization_profiles.js';
import {resumeElectronGame} from './electron_ready.mjs';
const require=createRequire(import.meta.url),root=resolve('.'),out=resolve(process.argv[2]||'docs/reviews/corc_ui_2026-10-21/you-resize/final');
await mkdir(out,{recursive:true});const profile=await mkdtemp(join(tmpdir(),'oops-you-drag-'));
const {_electron}=require('../ui_helpers.cjs').loadPlaywright();
const app=await _electron.launch({executablePath:require('electron'),args:[root],cwd:root,env:{...process.env,YAIRPG_USER_DATA:profile,YAIRPG_ROOT:root,YAIRPG_HIDDEN:'1'}});
const p=await app.firstWindow(),errors=[],checks=[];p.on('pageerror',e=>errors.push(e.message));
const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));delete seed.availabilities.recipe.undefined;delete seed.availabilities.recipe['recipe/undefined'];seed.customization=defaultCustomizationState();
await p.addInitScript(()=>{if(window.name.startsWith('RESIZE_FIXTURE:')){localStorage.setItem('save data',window.name.slice(15));window.name='';}});
const handle=()=>p.locator('[data-shell-resize="topLeft"]');
async function drag(delta,cancel=false){const r=await handle().boundingBox();await p.mouse.move(r.x+3,r.y+12);await p.mouse.down();await p.mouse.move(r.x+3+delta,r.y+12,{steps:20});if(cancel)await p.keyboard.press('Escape');await p.mouse.up();await p.mouse.move(1000,30);await p.waitForTimeout(600);}
async function geometry(){return p.evaluate(()=>{const region=document.querySelector('[data-region="player"]'),body=document.querySelector('#shell_condition > details > summary'),rr=region.getBoundingClientRect(),br=body.getBoundingClientRect();return {width:rr.width,columns:getComputedStyle(document.querySelector('.shell-core-stats')).gridTemplateColumns.split(' ').length,bodyVisible:br.bottom<=rr.bottom+1,overflow:document.documentElement.scrollWidth>innerWidth,font:getComputedStyle(document.querySelector('#proto23_character')).fontSize,autoHeight:!document.querySelector('.workspace-board').style.getPropertyValue('grid-template-rows')};});}
try{
 await resumeElectronGame(p);
 for(const [width,height,size]of [[1920,1080,14],[1920,1080,21],[1536,864,14],[1536,864,21]]){
  seed.customization.profiles.Default.settings.typography.size=size;await p.setViewportSize({width,height});await p.evaluate(s=>window.name='RESIZE_FIXTURE:'+JSON.stringify(s),seed);await p.reload();await resumeElectronGame(p);
  for(const k of ['topLeft','bottomLeft','log','top'])await p.locator(`[data-shell-resize="${k}"]`).press('Home');
  await drag(-1200);const narrow=await geometry();assert(narrow.columns>=2);assert(narrow.bodyVisible);assert(!narrow.overflow);assert.equal(narrow.font,`${size}px`);assert(narrow.autoHeight);
  await p.screenshot({path:join(out,`narrow-${width}-${size}.png`)});
  await p.locator('#character_stamina_div').hover();await p.waitForTimeout(100);
  assert(await p.locator('#shell_context_preview').evaluate(n=>n.matches(':popover-open')));
  assert.equal(await p.locator('#shell_context_preview').evaluate(n=>getComputedStyle(n).fontSize),`${size}px`);
  assert.equal(await p.locator('#character_stamina_tooltip').evaluate(n=>getComputedStyle(n).display),'none');
  await p.screenshot({path:join(out,`hover-${width}-${size}.png`)});
  const r=await handle().boundingBox();await p.mouse.move(r.x+3,r.y+12);await p.mouse.down();assert.equal(await p.locator('#shell_context_preview').evaluate(n=>n.matches(':popover-open')),false);await p.mouse.up();
  await drag(400);const wide=await geometry();assert(wide.width>narrow.width);assert(!wide.overflow);assert.equal(wide.font,`${size}px`);
  await p.screenshot({path:join(out,`wide-${width}-${size}.png`)});
  const before=(await geometry()).width;await drag(-200,true);assert(Math.abs((await geometry()).width-before)<2);
  await p.locator('.shell-core-stats > button').first().focus();await p.waitForTimeout(100);assert(await p.locator('#shell_context_preview').evaluate(n=>n.matches(':popover-open')));await p.keyboard.press('Escape');assert.equal(await p.locator('#shell_context_preview').evaluate(n=>n.matches(':popover-open')),false);
  checks.push({width,height,size,narrow,wide,hover:'one shell card; native duplicate suppressed',cancel:'restored',keyboard:'focus and Escape pass'});
  if(width===1920){
   await drag(-1200);
   await p.evaluate(()=>{for(let i=0;i<3;i++){const bar=document.createElement('div');bar.className='character_bar_parent_div';bar.id=`fixture_resource_${i}`;bar.style.minHeight='28px';bar.textContent=`Future resource ${i+1}: 20/20`;const tip=document.createElement('div');tip.id=`fixture_resource_${i}_tooltip`;tip.textContent='Fixture resource details';bar.append(tip);document.querySelector('#basic_character_info_div').append(bar);}document.dispatchEvent(new CustomEvent('workspace-presentation-change'));});
   await p.waitForTimeout(600);await p.locator('#fixture_resource_0').hover();assert.match(await p.locator('#shell_context_preview').innerText(),/Fixture resource details/);
   await p.mouse.move(1000,30);await p.waitForTimeout(250);await p.locator('#shell_condition > details > summary').scrollIntoViewIfNeeded();
   const future=await geometry();assert(future.bodyVisible);await p.screenshot({path:join(out,`future-bars-${size}.png`)});checks.at(-1).future='three synthetic bars retain readable body route and generic single hover';
   for(let i=0;i<24;i++)await p.locator('[data-shell-resize="top"]').press('ArrowUp');
   await p.waitForTimeout(500);await p.locator('[data-region="player"]').evaluate(n=>n.scrollTop=n.scrollHeight);await p.waitForTimeout(100);
   assert((await geometry()).bodyVisible,'Body is reachable by scrolling a deliberately short frame');
   await p.screenshot({path:join(out,`short-frame-${size}.png`)});checks.at(-1).shortFrame='Condition reachable at minimum manual height';
  }
 }
 assert.deepEqual(errors,[]);await writeFile(join(out,'receipt.json'),JSON.stringify({profile,checks,errors,note:'Future bars are disposable DOM geometry fixtures, not new gameplay resources.'},null,2));console.log(JSON.stringify({cases:checks.length,errors,out}));
}catch(e){await p.screenshot({path:join(out,'failure.png')}).catch(()=>{});await writeFile(join(out,'failure.json'),JSON.stringify({error:e.stack,checks,errors},null,2));throw e;}finally{await app.close();}

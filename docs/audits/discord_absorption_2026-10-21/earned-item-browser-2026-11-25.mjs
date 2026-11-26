// Fresh Village, native elder dialogue reward. Observe actual CSS motion; no supplied inventory or timing changes.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,join} from 'node:path';
import {createRequire} from 'node:module';
import {serve} from '../../../scripts/playtest/lib.mjs';
const {launchChrome}=createRequire(import.meta.url)('../../../scripts/ui_helpers.cjs');
const directory=resolve('docs/audits/discord_absorption_2026-10-21/earned-item-2026-11-25');
const bundle=resolve(process.argv[2]||'.lane-builds/discord-earned-20261125/dist');
await mkdir(directory,{recursive:true});
const server=await serve(bundle), results=[];
const motionOnly=process.argv[3]==='motion';
const variants=[{id:'default'},{id:'glow-off',glow:'off'},{id:'effects-reduced',effects:'reduced'},
    {id:'system-reduced',system:'reduce'},{id:'new-marker-off',newDot:'off'}];
const expand=locator=>locator.evaluate(node=>{for(let p=node.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
async function openFresh(){
 const browser=await launchChrome(),context=await browser.newContext({viewport:{width:1920,height:1080}}),page=await context.newPage(),errors=[];
 page.setDefaultTimeout(15000);page.on('pageerror',error=>errors.push({kind:'pageerror',text:error.message}));
 try {
  await page.goto(server.url);
  await page.waitForFunction(()=>!!window.simulationTestHooks&&document.querySelector('#loading_screen_play_button')?.checkVisibility(),null,{timeout:60000});
  await page.evaluate(()=>simulationTestHooks.pause());await page.locator('#loading_screen_play_button').click();
  const confirm=page.locator('#hero_creation_panel_confirmation');if(await confirm.isVisible())await confirm.click();
  return {browser,page,errors};
 }catch(error){await browser.close();throw error;}
}
try {
 for(const variant of motionOnly?variants.slice(0,1):variants){
  const session=await openFresh();
  try{
   const page=session.page;
   let arrivalScreenshot;
   if(motionOnly)await page.exposeFunction('__arrivalScreen',()=>arrivalScreenshot ||= page.screenshot({path:join(directory,'default-arrival-pulse-1920.jpg'),type:'jpeg',quality:90,animations:'allow'}));
   console.log('Fresh Village',variant.id);
   if(variant.system)await page.emulateMedia({reducedMotion:variant.system});
   const before=await page.evaluate(()=>simulationTestHooks.snapshot());
   assert.equal(before['current location'],'Village');
   if(variant.glow||variant.effects||variant.newDot){
    await page.getByRole('combobox',{name:'Other known panels'}).selectOption('customization-effects');
    if(variant.glow){const control=page.locator('[data-display-setting="panel.feel.glow"]');await expand(control);await control.selectOption(variant.glow);}
    if(variant.newDot){const control=page.locator('[data-display-setting="newDot"]');await expand(control);await control.selectOption(variant.newDot);}
    if(variant.effects){const control=page.getByLabel('Effects',{exact:true});await expand(control);await control.selectOption(variant.effects);await page.getByRole('button',{name:'Apply and save',exact:true}).filter({visible:true}).first().click();}
    await page.getByRole('button',{name:/Back to Village/}).click();
   }
   // Read-only event/frame observation. CSS clock, animation currentTime and game timers remain native.
   await page.evaluate(()=>{
    window.__arrival={events:[],frames:[]};
    for(const type of ['animationstart','animationend'])document.addEventListener(type,event=>{
     const row=event.target.closest?.('.inventory_item_control');
     if(event.animationName!=='feel-new-pulse'||!row?.textContent.includes('Cheap iron dagger'))return;
     __arrival.events.push({type,name:event.animationName,elapsed:event.elapsedTime,at:performance.now()});
     if(type==='animationstart'){
      const sample=()=>{const css=getComputedStyle(row);__arrival.frames.push({at:performance.now(),shadow:css.boxShadow,duration:css.animationDuration,
       animations:row.getAnimations().map(a=>({playState:a.playState,currentTime:a.currentTime}))});
       if(__arrival.frames.length===6&&typeof window.__arrivalScreen==='function')window.__arrivalScreen();
       if(row.isConnected&&row.getAnimations().some(a=>a.playState==='running'))requestAnimationFrame(sample);};sample();
     }
    },true);
   });
   await page.locator('.nearby-row').filter({hasText:'Old Hesk'}).getByRole('button',{name:'Talk',exact:true}).click();
   for(const topic of ['hello','what happened','ask to leave 1','need to','starting gear']){
    await page.locator(`button[data-topic-id="${topic}"]`).click();
   }
   await page.locator('[data-textline="dagger"]').filter({visible:true}).click();
   const row=page.locator('#inventory_div .inventory_item_control').filter({hasText:'Cheap iron dagger'}).first();
   await row.waitFor();
   await page.waitForFunction(()=>[...document.querySelectorAll('#inventory_div .inventory_item_control')].some(row=>row.textContent.includes('Cheap iron dagger')&&row.dataset.feelRarity==='common'));
   if(variant.id==='default')await page.waitForFunction(()=>__arrival.events.some(e=>e.type==='animationend'));
   if(motionOnly){assert.ok(arrivalScreenshot,'native animation reached the frame capture callback');await arrivalScreenshot;}
   const measure=locator=>locator.evaluate(row=>{const q=row.querySelector('[data-rarity]'),css=getComputedStyle(row);return {
    text:row.innerText,rarity:row.dataset.feelRarity,quality:q?.textContent,color:q&&getComputedStyle(q).color,
    rarityTitle:q?.title,shadow:css.boxShadow,animation:css.animationName,duration:css.animationDuration,
    new:row.hasAttribute('data-item-new'),newWord:getComputedStyle(row.querySelector('.item_name'),'::after').content,
    worn:row.hasAttribute('data-feel-worn'),wornMark:getComputedStyle(row.querySelector('.item_name'),'::before').content};});
   const earned=await measure(row), after=await page.evaluate(()=>simulationTestHooks.snapshot());
   const itemKey=await row.getAttribute('data-character_item');
   assert.equal(before.inventories.person.main_character[itemKey],undefined);
   assert.equal(JSON.parse(itemKey).quality,50);assert.equal(after.inventories.person.main_character[itemKey].count,1);
   assert.equal(earned.rarity,'common');assert.equal(earned.quality,'50%');assert.equal(earned.worn,false);
   assert.equal(earned.new,variant.newDot!=='off');
   if(variant.id==='default'){assert.equal(earned.animation,'feel-new-pulse');assert.notEqual(earned.duration,'0s');}
   if(variant.glow)assert.equal(earned.animation,'none');
   if(variant.effects)assert.equal(earned.duration,'0s');
   // workspace.css preserves animation lifecycle events with a 0.001ms system-reduce cap.
   if(variant.system)assert.equal(earned.duration,'1e-06s');
   if(variant.newDot)assert.equal(earned.animation,'none');
   await page.mouse.move(1100,800);await page.screenshot({path:join(directory,`${variant.id}-earned-1920.jpg`),type:'jpeg',quality:88});
   const observed=await page.evaluate(()=>({root:{glow:document.documentElement.dataset.feelGlow,effects:document.documentElement.dataset.effects,
    lookMotion:document.documentElement.dataset.lookMotion,systemReduced:matchMedia('(prefers-reduced-motion: reduce)').matches},...__arrival}));
   let acknowledged,equipped;
   if(variant.id==='default'){
    assert.ok(observed.events.some(e=>e.type==='animationend'&&e.elapsed>0));
    assert.ok(new Set(observed.frames.map(f=>f.shadow)).size>1,'native frames observed changing arrival shadow');
    await row.hover();acknowledged=await measure(row);assert.equal(acknowledged.new,false);
    await row.click();
    await page.locator('[data-shell-item-action="equip"]').filter({visible:true}).click();
    const worn=page.locator('#inventory_div .equipped_item_control[data-feel-worn]').filter({hasText:'Cheap iron dagger'}).first();await worn.waitFor();
    equipped=await measure(worn);assert.equal(equipped.worn,true);assert.equal(equipped.new,false);assert.ok(equipped.wornMark.includes('◆'));
    await page.mouse.move(1100,800);await page.screenshot({path:join(directory,'default-equipped-1920.jpg'),type:'jpeg',quality:88});
   }
   assert.deepEqual(session.errors.filter(e=>e.kind==='pageerror'),[]);
   const result={variant:variant.id,route:'fresh normal Village -> elder hello/head injury/leave/need/starting gear/dagger',earned,observed,acknowledged,equipped,
    quantity:1,quality:50,pageErrors:0,fixture:false};
   results.push(result);await writeFile(join(directory,`${variant.id}${motionOnly?'-motion':''}-proof.json`),JSON.stringify(result,null,2)+'\n');
  }catch(error){console.error('FAIL',variant.id,error);await session.page.screenshot({path:join(directory,`${variant.id}-failure.jpg`)});console.error((await session.page.locator('body').innerText()).slice(0,8000));throw error;}
  finally{await session.browser.close();}
 }
 const proof={status:'passed',viewport:{width:1920,height:1080},bundleSha256:createHash('sha256').update(await readFile(join(bundle,'bundle.js'))).digest('hex'),
  setup:'Isolated fresh contexts with no supplied save/items or wall-clock override; native dialogue actions and real setting controls. Game stepping paused after boot; CSS timing unchanged.',results};
 await writeFile(join(directory,motionOnly?'motion-proof.json':'proof.json'),JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify({status:proof.status,bundle:proof.bundleSha256,variants:results.map(r=>r.variant)}));
}finally{server.close();}

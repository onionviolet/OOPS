// UIL7 extends UIL4's fresh-origin populated-fixture route.
const T=require('./target-set.cjs'),{L}=T,{fs,path,assert}=L;
const E=path.join(__dirname,'evidence/uil7');fs.mkdirSync(E,{recursive:true});
const phase=process.env.PHASE||'after';
const KEY='yairpg.workspace.v1.desktop.proto23-parity.placement';
const stored=p=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
const settle=p=>p.waitForTimeout(600);
async function exercise(p,w,font){
 console.log('exercise',w,font);const results={};
 const context=()=>p.evaluate(()=>document.getElementById('main_content').dataset.layoutContext);
 const shape=()=>p.evaluate(()=>Object.fromEntries([...document.querySelectorAll('.parity-region')].map(n=>{const r=n.getBoundingClientRect();return[n.dataset.region,[r.x,r.y,r.width,r.height].map(x=>Math.round(x*10)/10)]})));
 results.initial=await shape();
 const beforeState=await L.state(p);
 for(const key of ['topLeft','bottomLeft','log','top']){
  console.log('handle',key);const h=p.locator(`[data-shell-resize=${key}]`);if(!await h.isVisible())continue;
  const beforeGeometry=await shape();const box=await h.boundingBox(),x=box.x+box.width/2,y=box.y+box.height/2;
  await p.mouse.move(x,y);await p.mouse.down();await p.mouse.move(x+(key==='top'?0:key==='log'?-32:32),y+(key==='top'?26:0),{steps:6});await p.mouse.up();await settle(p);
  const pointer=await stored(p);assert(pointer.contexts.idle.sizes[key]);
  const afterGeometry=await shape();const region={topLeft:'player',bottomLeft:'inventory',log:'log',top:'player'}[key],dimension=key==='top'?3:2;
  const delta=Math.abs(afterGeometry[region][dimension]-beforeGeometry[region][dimension]);assert(delta>1&&delta<90,`actual ${key} resize delta ${delta}`);
  await h.focus();await p.keyboard.press(key==='top'?'ArrowDown':key==='log'?'ArrowRight':'ArrowLeft');await settle(p);
  results[key]={pointer:pointer.contexts.idle.sizes,keyboard:(await stored(p)).contexts.idle.sizes};
 }
 assert.deepStrictEqual(await L.state(p),beforeState,'resize changes no gameplay');
 // Cancel a pointer drag, including preview geometry, before global Esc navigation.
 const h=p.locator('[data-shell-resize=topLeft]'),box=await h.boundingBox(),saved=await stored(p),geometry=await shape();
 await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.mouse.down();await p.mouse.move(box.x+80,box.y+20,{steps:5});await p.keyboard.press('Escape');await p.mouse.up();await settle(p);
 assert.deepStrictEqual(await stored(p),saved);assert.deepStrictEqual(await shape(),geometry);results.cancel=true;
 const idle=(await stored(p)).contexts.idle.sizes;
 // UIL4's real service route, independently resized and restored on return.
 await p.keyboard.press('Alt+m');await settle(p);assert.equal(await context(),'service');
 await p.locator('[data-shell-resize=log]').focus();await p.keyboard.press('ArrowLeft');await settle(p);
 const service=(await stored(p)).contexts.service.sizes;
 await p.keyboard.press('Escape');await settle(p);assert.equal(await context(),'idle');assert.deepStrictEqual((await stored(p)).contexts.idle.sizes,idle);
 await p.keyboard.press('Alt+m');await settle(p);results.serviceGeometry=await shape();assert.deepStrictEqual((await stored(p)).contexts.service.sizes,service);await p.keyboard.press('Escape');await settle(p);
 results.idle=idle;results.service=service;
 // Stable paused content must not reflow while pointer is over a pending action.
 await p.mouse.move(600,550);const stable=await shape();await p.waitForTimeout(1500);assert.deepStrictEqual(await shape(),stable);results.stable=true;
 await T.shot(p,path.join(E,`after-${w}-${font}-resized.png`));
 // Reset is the existing per-context R21 action. Trigger its real delegated control.
 await p.evaluate(()=>document.querySelector('[data-workspace-action=shell-reset]').click());await settle(p);
 assert.deepStrictEqual((await stored(p)).contexts.idle.sizes,{});assert.deepStrictEqual((await stored(p)).contexts.service.sizes,service);results.resetGeometry=await shape();
 // Put distinct idle sizes back through a real key action before persistence roundtrip.
 await p.locator('[data-shell-resize=log]').focus();await p.keyboard.press('ArrowLeft');await settle(p);
 const expected=await stored(p);
 await p.locator('#save_button').click();await p.reload();await p.waitForFunction(()=>!!window.simulationTestHooks);await L.R.startFresh(p);await p.evaluate(()=>simulationTestHooks.pause());await settle(p);assert.deepStrictEqual(await stored(p),expected);results.reload=true;
 const dl=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const file=path.join(E,`roundtrip-${w}-${font}.save.txt`);await(await dl).saveAs(file);
 const loaded=p.waitForEvent('domcontentloaded');await p.locator('#saved_file_input').setInputFiles(file);await loaded;await L.R.startFresh(p);await p.evaluate(()=>simulationTestHooks.pause());await settle(p);assert.deepStrictEqual(await stored(p),expected);fs.rmSync(file);results.import=true;
 await T.shot(p,path.join(E,`after-${w}-${font}-imported.png`));
 // A real combat transition, then return. No context dataset injection.
 await p.locator('[data-travel="Infested field"]').first().evaluate(n=>n.click());await settle(p);assert.equal(await context(),'combat');
 await p.locator('[data-shell-resize=top]').focus();await p.keyboard.press('ArrowUp');await settle(p);
 const combat=(await stored(p)).contexts.combat.sizes;assert(combat.top);results.combat=combat;results.combatGeometry=await shape();
 await T.shot(p,path.join(E,`after-${w}-${font}-combat.png`));
 await p.locator('[data-travel="Village"]').first().evaluate(n=>n.click());await settle(p);assert.equal(await context(),'idle');assert.deepStrictEqual((await stored(p)).contexts.idle.sizes,expected.contexts.idle.sizes);
 await p.locator('[data-travel="Infested field"]').first().evaluate(n=>n.click());await settle(p);assert.deepStrictEqual((await stored(p)).contexts.combat.sizes,combat);
 await p.locator('[data-travel="Village"]').first().evaluate(n=>n.click());await settle(p);
 // Layout export/import must carry the placement itself, beyond same-browser game-save retention.
 await p.evaluate(()=>document.querySelector('[data-workspace-action=export]').click());
 const exported=await p.locator('textarea[aria-label="Layout configuration"]').inputValue();
 assert(JSON.parse(exported).shellPlacement.contexts.combat.sizes.top);
 const beforeReset=await stored(p), beforeLayoutImport=await shape();await p.evaluate(()=>document.querySelector('[data-workspace-action=shell-reset]').click());await settle(p);
 
 await p.evaluate(text=>{document.querySelector('textarea[aria-label="Layout configuration"]').value=text;document.querySelector('[data-workspace-action=import]').click();},exported);await settle(p);
 assert.deepStrictEqual(await stored(p),beforeReset);assert.deepStrictEqual(await shape(),beforeLayoutImport);results.layoutImport=true;
 results.errors=p.errors;return results;
}

async function legacyAndLimits(){
 const b=await T.launch(300),result={};try{
 const old={version:1,spec:4,contexts:{idle:{boxes:{inventory:'player'},companions:{journal:'inventory'},swap:true},combat:{boxes:{},companions:{},swap:false}}};
 const {ctx,p}=await L.open(b,{w:1920,h:1080,storage:{[KEY]:JSON.stringify(old)}});await settle(p);
 assert.equal(await p.locator('[data-module=belongings]').first().evaluate(n=>n.closest('.parity-region').dataset.region),'player');
 assert.deepStrictEqual(await stored(p),old,'legacy placement is not rewritten on read');
 await p.locator('[data-shell-resize=log]').focus();await p.keyboard.press('ArrowLeft');await settle(p);
 assert.equal((await stored(p)).contexts.idle.boxes.inventory,'player');result.legacy=await stored(p);result.errors=p.errors;await ctx.close();
 const second=await L.open(b,{w:1366,h:768});await L.textSize(second.p,21);await settle(second.p);
 const log=second.p.locator('[data-shell-resize=log]');await log.focus();for(let i=0;i<30;i++)await second.p.keyboard.press('Shift+ArrowRight');await settle(second.p);
 result.limit=await L.geometry(second.p);assert(result.limit.regions.log.w>=200);assert.equal(result.limit.page[0],1366);
 const width=result.limit.regions.log.w;await second.p.keyboard.press('Shift+ArrowRight');await settle(second.p);assert.equal((await L.geometry(second.p)).regions.log.w,width,'Reports stops at the content minimum');
 await T.shot(second.p,path.join(E,'after-1366-21-log-minimum.png'));result.errors.push(...second.p.errors);await second.ctx.close();
 }finally{await b.close();}fs.writeFileSync(path.join(E,'legacy-and-limits.json'),JSON.stringify(result,null,2));
}
if(process.env.LEGACY_ONLY) legacyAndLimits().catch(e=>{console.error(e);process.exit(1)});
else (async()=>{const b=await T.launch(900);const out=[];try{for(const [w,h,font] of [[1920,1080,14],[1920,1080,21],[1366,768,14],[1366,768,21]]){console.log('open',w,font);const {ctx,p}=await L.open(b,{w,h});console.log('opened');if(font!==14)await L.textSize(p,font);await p.waitForTimeout(700);await T.shot(p,path.join(E,`${phase}-${w}-${font}.png`));out.push({w,h,font,geometry:await L.geometry(p),...(phase==='after'?await exercise(p,w,font):{}),errors:p.errors});await ctx.close();}}finally{await b.close();}fs.writeFileSync(path.join(E,`${phase}.json`),JSON.stringify(out,null,2));})().catch(e=>{console.error(e);process.exit(1)});

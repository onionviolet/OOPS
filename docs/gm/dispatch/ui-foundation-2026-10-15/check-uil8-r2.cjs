// UIL8 R2: actual native effects, aligned controls/weather, no duplicate readings.
const T=require('./target-set.cjs'),{fs,path,assert}=T.L,E=path.join(__dirname,'evidence/uil8/r2');
const targets=T.targets().filter(t=>['1920','1366'].includes(t.name)),settle=p=>p.waitForTimeout(550);
const snap=p=>p.evaluate(()=>{const rect=n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,bottom:r.bottom}};
const attrs=document.querySelector('.shell-attributes-open'),gear=document.querySelector('.shell-gear-disclosure > summary'),body=attrs.closest('.workspace-module-body');
return {attributes:rect(attrs),gear:rect(gear),youBody:rect(body),condition:document.querySelector('#shell_condition').textContent,
weather:document.querySelector('.scene-conditions').textContent,calendar:rect(document.querySelector('.scene-calendar')),calendarText:document.querySelector('.scene-calendar').textContent,
weatherBoxes:[...document.querySelectorAll('.scene-conditions > *')].map(n=>({text:n.textContent,...rect(n)})),
conditionTemperatureCount:document.querySelectorAll('#shell_condition [data-context-preview=temperature]').length,
effects:[...document.querySelectorAll('.condition-effect')].map(n=>({id:n.dataset.effectId,name:n.querySelector('.condition-effect-name').textContent,duration:n.querySelector('.condition-effect-duration').textContent,kind:n.querySelector('.condition-effect-kind').textContent,font:getComputedStyle(n).fontSize,bottom:rect(n).bottom,viewportBottom:rect(n.closest('.workspace-module-body')).bottom})),
pageOverflow:document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight+1};});
const checkGeometry=(r,font)=>{assert(Math.abs(r.attributes.y-r.gear.y)<1,'Attributes/Gear top edges align');assert(Math.abs(r.attributes.h-r.gear.h)<1,'Attributes/Gear control heights align');assert(r.attributes.bottom<=r.youBody.bottom+1,'Attributes remains inside You');assert(r.gear.bottom<=r.youBody.bottom+1,'Gear remains inside You');assert.equal(r.conditionTemperatureCount,0);assert(!r.condition.includes('comfortable'));assert.equal(r.pageOverflow,false);
assert(r.calendar.h<font*1.6,'calendar stays a complete line');const normal=r.weatherBoxes.filter(x=>!x.text.includes('Cold exposure'));assert(Math.max(...normal.map(n=>n.bottom))-Math.min(...normal.map(n=>n.bottom))<2,'weather badges share a baseline');};
(async()=>{const b=await T.launch(900),out={targets:[],effects:[]};try{
for(const t of targets){console.log('neutral',T.tag(t));const {p,ctx}=await T.L.open(b,{w:t.w,h:t.h,dpr:t.dpr});try{if(t.font!==14)await T.L.textSize(p,t.font);await settle(p);const r={target:T.tag(t),...await snap(p)};out.targets.push(r);checkGeometry(r,t.font);assert.equal(r.effects.length,0);await T.shot(p,path.join(E,`after-${T.tag(t)}.png`));
// Gear disclosure and Attributes remain usable with the common control row.
await p.locator('.shell-gear-disclosure > summary').click();assert(await p.locator('.shell-gear-disclosure').evaluate(n=>n.open));await p.locator('.shell-gear-disclosure > summary').click();
await p.locator('.shell-attributes-open').click();await settle(p);assert(await p.locator('#character_attribute_inspector').isVisible());await p.keyboard.press('Escape');await settle(p);
const temp=p.locator('.scene-conditions [data-context-preview=temperature]');await temp.click();await p.mouse.move(2,2);await settle(p);assert(await p.locator('#shell_context_preview').evaluate(n=>n.matches(':popover-open')),'clicked weather stays pinned');await p.keyboard.press('Escape');assert(!await p.locator('#shell_context_preview').evaluate(n=>n.matches(':popover-open')));
assert.deepEqual(p.errors,[]);}finally{await ctx.close()}}
for(const t of targets){console.log('effects',T.tag(t));const data=JSON.parse(T.L.save);data.active_effects={'Basic meal':{duration:150},Wet:{duration:30},Cold:{duration:60}};
const {p,ctx}=await T.L.open(b,{w:t.w,h:t.h,dpr:t.dpr,data:JSON.stringify(data)});try{if(t.font!==14)await T.L.textSize(p,t.font);await settle(p);const r={target:T.tag(t),...await snap(p)};out.effects.push(r);checkGeometry(r,t.font);assert.equal(r.effects.length,3);assert(r.effects.some(e=>e.name==='Basic meal'&&e.kind==='Buff'));assert(r.effects.some(e=>e.name==='Wet'&&e.kind==='Debuff'));assert(r.effects.some(e=>e.name==='Cold'&&e.kind==='Debuff'));
for(const effect of r.effects){assert.equal(effect.font,`${t.font}px`);assert(effect.duration);assert(effect.bottom<=effect.viewportBottom+1,'each of the three effect rows is visible without scrolling');}
assert(r.weather.includes('cold'));assert.equal(await p.locator('#shell_condition .condition-warning').count(),0);assert.equal(await p.locator('.scene-conditions [data-cold-warning]').count(),1);
await T.shot(p,path.join(E,`effects-${T.tag(t)}.png`));
const wet=p.locator('.condition-effect[data-effect-id=Wet]');await wet.focus();await settle(p);assert((await p.locator('#shell_context_preview').textContent()).toLowerCase().includes('cold resistance'));
await wet.click();await p.mouse.move(2,2);await settle(p);assert(await p.locator('#shell_context_preview').evaluate(n=>n.matches(':popover-open')));await T.shot(p,path.join(E,`inspect-${T.tag(t)}.png`));
// Advance the existing native clock, never a presentation timer. Duration is copied from its owner.
await p.evaluate(()=>{window.__uil8Wet=document.querySelector('.condition-effect[data-effect-id=Wet]');advanceTicks(1,{render:true});simulationTestHooks.pause();});await settle(p);
assert(await wet.evaluate(n=>n===window.__uil8Wet),'tick retains inspected node');assert(await p.locator('#shell_context_preview').evaluate(n=>n.matches(':popover-open')));r.afterTick=await snap(p);
const native=await p.locator('#effects_tooltip [data-effect-id=Wet] .active_effect_duration').textContent();assert.equal(await wet.locator('.condition-effect-duration').textContent(),native.trim());
await p.keyboard.press('Escape');assert(!await p.locator('#shell_context_preview').evaluate(n=>n.matches(':popover-open')));
// Save/reload preserves native effect projection and existing browser display pins.
await p.locator('#save_button').click();await p.reload({waitUntil:'domcontentloaded'});await T.L.R.startFresh(p);await p.evaluate(()=>simulationTestHooks.pause());await settle(p);assert.equal(await p.locator('.condition-effect').count(),3);r.errors=p.errors;assert.deepEqual(p.errors,[]);
}finally{await ctx.close()}}
// Existing status can outlast the weather; expiry must not destroy a pending inspection.
out.lingering=[];
for(const t of [targets[0],targets.at(-1)]){const data=JSON.parse(T.L.save);data.active_effects={Cold:{duration:1}};
const {p,ctx}=await T.L.open(b,{w:t.w,h:t.h,data:JSON.stringify(data)});try{if(t.font!==14)await T.L.textSize(p,t.font);await settle(p);
const initial=await snap(p);assert(initial.weather.includes('comfortable'));assert(initial.effects.some(e=>e.name==='Cold'));assert.equal(await p.locator('.scene-conditions [data-cold-warning]').count(),0);
const cold=p.locator('.condition-effect[data-effect-id=Cold]');await cold.click();await p.mouse.move(2,2);await settle(p);
await p.evaluate(()=>{window.__uil8Cold=document.querySelector('.condition-effect[data-effect-id=Cold]');advanceTicks(1,{render:true});simulationTestHooks.pause();});await settle(p);
assert(await cold.evaluate(n=>n===window.__uil8Cold));assert.equal(await cold.getAttribute('data-ended'),'true');assert((await cold.textContent()).includes('Ended'));assert((await p.locator('#shell_context_preview').textContent()).includes('has ended'));
await T.shot(p,path.join(E,`ended-${T.tag(t)}.png`));await p.keyboard.press('Escape');await p.locator('.scene-conditions [data-context-preview=temperature]').focus();await settle(p);assert.equal(await cold.count(),0);
out.lingering.push({target:T.tag(t),initial,endedInspectionRetained:true,removedAfterLeaving:true});assert.deepEqual(p.errors,[]);
}finally{await ctx.close()}}
}finally{fs.writeFileSync(path.join(E,'after.json'),JSON.stringify(out,null,2));await b.close()};console.log('UIL8 R2 passed')})().catch(e=>{console.error(e);process.exit(1)});

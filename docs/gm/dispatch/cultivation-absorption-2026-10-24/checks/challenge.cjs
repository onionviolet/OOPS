const gate=require('../../cultivation-spacing-2026-10-22/browser-helper.cjs');
gate('challenge',async h=>{
 const {p,assert,boot,save,play,roundtrip,gates,played,path,out}=h;await p.setViewportSize({width:1920,height:1080});await boot();
 const open=async()=>{await p.getByRole('combobox',{name:'Other known panels'}).selectOption('continuation');await p.locator('#continuation_open').click();};
 const action=async id=>{const q=p.locator(`[data-continuation-action="${id}"]`);await q.first().click();const confirm=q.filter({hasText:/^Confirm /});if(await confirm.count())await confirm.click();};
 await open();if(await p.locator('[data-continuation-action="enroll"]').count()){await action('enroll');await p.waitForFunction(()=>!!simulationTestHooks.snapshot().continuation);}
 const parent=await save();
 await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded'}),action('challenge:begin:experiment')]);await play();await open();await action('continue');await p.waitForFunction(()=>!simulationTestHooks.snapshot().continuation.arrivalPaused);await p.keyboard.press('Escape');
 let s=await save();assert.equal(s.continuation.challenge.kind,'experiment');assert.notEqual(s.continuation.active,parent.continuation.active);assert.ok(s.continuation.lives[parent.continuation.active].paused);assert.notEqual(s.character.money,parent.character.money);
 await p.getByRole('combobox',{name:'Other known panels'}).selectOption('herbal-experiments');
 // All new-life supplies and observations come from the ordinary gather/brew/use loop.
 for(let n=0;n<12;n++){const gather=p.locator('#crafting_gather');if(await gather.isEnabled())await gather.click();}
 const materialRows=()=>p.locator('[data-craft-material]');
 for(let n=0;n<18;n++){
  s=await save();const observed=new Set(Object.values(s.crafting?.knowledge?.player||{}).flatMap(k=>k.facts.filter(f=>f.startsWith('effect:oral.'))));if(observed.size>=2)break;
  const keys=await materialRows().evaluateAll(rows=>rows.map(n=>n.dataset.craftMaterial));if(!keys.length)break;
  const selected=await p.locator('[data-craft-material]:checked').evaluateAll(rows=>rows.map(n=>n.dataset.craftMaterial));for(const key of selected)await p.locator(`[data-craft-material=${JSON.stringify(key)}]`).uncheck();
  await p.locator(`[data-craft-material=${JSON.stringify(keys[n%keys.length])}]`).check();const craft=p.locator('#crafting_engine_home [data-craft-commit]');if(await craft.getAttribute('aria-disabled')!=='true')await craft.press('Enter');
  for(const use of await p.locator('[data-crafted-use]').all())await use.press('Enter');
 }
 s=await save();const observed=new Set(Object.values(s.crafting?.knowledge?.player||{}).flatMap(k=>k.facts.filter(f=>f.startsWith('effect:oral.'))));assert.ok(observed.size>=2,'challenge earned two effects through native preparations');
 await roundtrip('pending-isolated-life',s=>({challenge:s.continuation.challenge,parent:s.continuation.lives[parent.continuation.active].paused,crafting:s.crafting}));await open();
 await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded'}),action('challenge:return')]);await play();s=await save();assert.equal(s.continuation.active,parent.continuation.active);assert.deepEqual(s.inventories,parent.inventories);assert.equal(s.character.money,parent.character.money);assert.equal(s.craftDepth?.body,parent.craftDepth?.body);assert.ok(s.crafting&&Object.keys(s.crafting.knowledge.player).length);assert.equal(s.continuation.challengeHistory.at(-1).completed,true);assert.equal(s.continuation.challenge,undefined);
 await roundtrip('knowledge-only-return',s=>({history:s.continuation.challengeHistory,crafting:s.crafting,inventories:s.inventories}));await open();await p.screenshot({path:path.join(out,'challenge-return-1920.png')});gates.push('Fresh sealed challenge body, ordinary native gathering/brewing/observing, pending parent shelf import, knowledge-only completion restoring exact parent money/stock/body and one durable receipt');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});

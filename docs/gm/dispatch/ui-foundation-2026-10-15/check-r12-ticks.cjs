// R12: running clock keeps the selected recipe/focus; leaving Crafting restores the normal composition.
const T=require('./r12-lib.cjs');const {assert}=T;
(async()=>{const b=await T.launch();try{const {ctx,p}=await T.open(b);const regions=()=>p.evaluate(()=>Object.fromEntries([...document.querySelectorAll('.parity-region')].map(n=>[n.dataset.region,getComputedStyle(n).display+' '+getComputedStyle(n).gridColumn+' / '+getComputedStyle(n).gridRow])));
 const before=await regions();await T.openCooking(p);const during=await regions();assert.equal(during.focus.split(' ')[0],'none');
 await T.pick(p,'Roasted rat meat');await p.locator('[data-craft-related="Roasted purified rat meat"]').focus();
 const c0=await p.evaluate(()=>JSON.stringify(simulationTestHooks.snapshot()['current time']));await p.evaluate(()=>simulationTestHooks.resume());await p.waitForTimeout(3500);await p.evaluate(()=>simulationTestHooks.pause());
 const c1=await p.evaluate(()=>JSON.stringify(simulationTestHooks.snapshot()['current time']));assert.notEqual(c0,c1,'clock advanced while inspecting');
 const st=await p.evaluate(()=>({title:document.querySelector('[data-craft-title]').textContent,focus:document.activeElement?.getAttribute('data-craft-related')}));assert.deepEqual(st,{title:'Roasted rat meat',focus:'Roasted purified rat meat'});
 await p.getByText('← Village',{exact:true}).first().click({noWaitAfter:true});await p.waitForTimeout(400);const after=await regions();assert.deepEqual(after,before,'composition restored after leaving Crafting');
 assert.deepEqual(p.errors,[]);console.log('PASS ticks+exit',JSON.stringify({c0,c1,before,during}));await ctx.close();}finally{await b.close();}})().catch(e=>{console.error('FAIL',e.message);process.exit(1)});

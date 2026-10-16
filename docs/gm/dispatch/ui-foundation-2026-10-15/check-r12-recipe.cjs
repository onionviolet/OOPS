// R12 native recipe journey on a fresh origin with the synthetic cooking fixture.
// State is read from the native save snapshot; UI text is checked against it.
const T=require('./r12-lib.cjs');const {assert}=T;
const facts=p=>p.evaluate(()=>{const s=simulationTestHooks.snapshot();const inv={};for(const[k,v]of Object.entries(s.inventories.person.main_character)){const id=JSON.parse(k).id;inv[id]=(inv[id]||0)+v.count;}
 return{clock:JSON.stringify(s['current time']),inv,xp:s.levels.person.main_character.skill_xp.Cooking||0};});
const detail=p=>p.evaluate(()=>{const d=document.getElementById('crafting_detail');return{state:d.dataset.state,text:d.innerText,title:d.querySelector('[data-craft-title]')?.textContent,
 reqs:[...d.querySelectorAll('[data-craft-req]')].map(r=>r.getAttribute('aria-label')),attempts:d.querySelector('[data-craft-attempts]')?.textContent,
 effects:[...d.querySelectorAll('.craft_effect')].map(e=>({text:e.innerText,kind:e.dataset.effectKind})),related:[...d.querySelectorAll('[data-craft-related]')].map(r=>r.getAttribute('aria-label')),
 back:d.querySelector('[data-craft-back]')?.textContent||null,receipt:d.querySelector('[data-craft-receipt]')?.textContent,reason:d.querySelector('[data-craft-blocked-reason]')?.textContent,active:document.activeElement?.closest('[data-craft-req],[data-craft-blocked-reason],.recipe_div')?.outerHTML.slice(0,90)};});
(async()=>{const b=await T.launch();const log=[];const ok=(name,v)=>{log.push({name,...(v===undefined?{}:{v})});console.log('PASS',name);};
try{for(const [w,h,f] of [[1366,768,14],[1366,768,17.5],[1366,768,21],[1920,1080,21]]){const tag=`${w}-${f}`;const {ctx,p}=await T.open(b,{w,h});if(f!==14)await T.textSize(p,f);await T.openCooking(p);
 const s0=await facts(p);
 await T.pick(p,'Roasted rat meat');let d=await detail(p);
 assert.equal(d.title,'Roasted rat meat');assert(d.text.includes('Uses · have / need'));assert.deepEqual(d.reqs,['Rat meat chunks: have 3, need 2']);
 assert.equal(d.attempts,'Can craft now: 1 attempt');assert.equal(d.effects.length,2);assert.equal(d.effects.find(e=>/poisoning/.test(e.text)).kind,'debuff');
 assert(d.related.some(r=>r.startsWith('Show recipe Roasted purified rat meat, also uses Rat meat chunks')));ok(`${tag} ready detail`,d);
 const g=await T.geo(p);assert.deepEqual(g.page,[w,h]);assert(g.commit.bottom<=h&&g.commit.top>=0,'Craft visible without page scroll');ok(`${tag} craft visible`,{commit:g.commit,page:g.page});
 // Unknown ingredient stays unnamed in text and accessibility.
 await T.pick(p,'Roasted purified rat meat');d=await detail(p);
 assert(d.reqs.includes('Unfamiliar material: have 0, need 1'));const leak=await p.evaluate(()=>{const w=document.getElementById('crafting_window');return /Belmart/i.test(w.innerHTML)||[...w.querySelectorAll('*')].some(n=>[...n.attributes].some(a=>/Belmart/i.test(a.value)));});assert(!leak,'no Belmart in crafting DOM');
 assert.equal(d.state,'blocked');assert.equal(d.attempts,'Can craft now: 0 attempts');
 await p.locator('#crafting_window [data-craft-commit]').click({noWaitAfter:true,force:true});await p.waitForTimeout(150);d=await detail(p);assert(/data-craft-req/.test(d.active||''),'blocked Craft focuses the missing requirement');
 assert.deepEqual(await facts(p),s0,'blocked attempt and inspection change nothing');ok(`${tag} unknown + blocked`,{reqs:d.reqs,reason:d.reason});
 // Related link and local return with list scroll.
 await T.pick(p,'Roasted rat meat');const list=p.locator('.crafting_recipe_list:visible');await list.evaluate(n=>n.scrollTop=0);const scroll0=await list.evaluate(n=>n.scrollTop);
 await p.locator('#crafting_window [data-craft-related="Roasted purified rat meat"]').click({noWaitAfter:true});await p.waitForTimeout(150);d=await detail(p);
 assert.equal(d.title,'Roasted purified rat meat');assert.equal(d.back,'← Back to Roasted rat meat');assert.equal(await T.row(p,'Roasted purified rat meat').getAttribute('aria-selected'),'true');
 await p.locator('#crafting_window [data-craft-back]').click({noWaitAfter:true});await p.waitForTimeout(150);d=await detail(p);
 assert.equal(d.title,'Roasted rat meat');assert.equal(d.back,null);assert.equal(await list.evaluate(n=>n.scrollTop),scroll0);assert(/Roasted rat meat/.test(d.active||''),'focus returns to the original row');
 assert.deepEqual(await facts(p),s0,'related navigation changes nothing');ok(`${tag} related + back`);
 await T.shot(p,`journey-${tag}-ready`);
 // Explicit native Craft 1 once; receipt must match measured native deltas.
 await p.locator('#crafting_window [data-craft-commit]').click({noWaitAfter:true});await p.waitForTimeout(250);const s1=await facts(p);d=await detail(p);
 const made=(s1.inv['Roasted rat meat']||0)-(s0.inv['Roasted rat meat']||0),used=s0.inv['Rat meat chunks']-(s1.inv['Rat meat chunks']||0),xp=s1.xp-s0.xp;
 assert.equal(used,2);assert(xp>0);
 if(made>0)assert.equal(d.receipt,`Made ${made} Roasted rat meat from 2 Rat meat chunks (+${Math.round(xp*10)/10} XP)`);else assert.equal(d.receipt,`Failed: 2 Rat meat chunks used, nothing made (+${Math.round(xp*10)/10} XP)`);
 assert.equal(d.attempts,'Can craft now: 0 attempts');assert(/missing 1 Rat meat chunks/.test(d.reason));ok(`${tag} craft 1`,{made,used,xp,receipt:d.receipt,reason:d.reason});
 await T.shot(p,`journey-${tag}-after-craft`);
 assert.deepEqual(p.errors,[]);await ctx.close();}}
finally{await b.close();}T.fs.writeFileSync(T.path.join(T.E,'recipe-journey.json'),JSON.stringify(log,null,1));console.log('ALL',log.length);})().catch(e=>{console.error('FAIL',e.message);process.exit(1)});

// R13 acceptance: idle place card, subject + local back, regions yield to center views, native area progress, restore.
const L=require('./r12-regress-lib.cjs');const fs=require('fs'),path=require('path');const OUT=path.join(__dirname,'evidence/r13');
const shot=async(p,n)=>{const cdp=await p.context().newCDPSession(p);const r=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true});fs.writeFileSync(path.join(OUT,n+'.png'),Buffer.from(r.data,'base64'));await cdp.detach();};
const regions=p=>p.evaluate(()=>Object.fromEntries([...document.querySelectorAll('.parity-region')].map(n=>[n.dataset.region,getComputedStyle(n).display==='none'?'hidden':`${getComputedStyle(n).gridColumn} / ${getComputedStyle(n).gridRow}`])));
const centerH=p=>p.evaluate(()=>{const c=document.getElementById('center_mode_content');return c?.offsetParent?c.clientHeight:0;});
(async()=>{const b=await L.launch();const log=[];const ok=(n,v)=>{log.push({n,v});console.log('PASS',n);};
try{for(const[w,h,f]of[[1366,768,14],[1366,768,17.5],[1366,768,21],[1920,1080,21]]){const tag=`${w}-${f}`;let{ctx,p}=await L.open(b,{w,h});if(f!==14)await L.textSize(p,f);await p.waitForTimeout(400);
 const before=await L.state(p),home=await regions(p);
 // B2 idle place card
 const card=await p.evaluate(()=>{const o=document.querySelector('#current_focus .shell-place-overview');return o?{people:o.querySelectorAll('[data-inspect-nearby]:not([data-nearby-kind])').length,things:o.querySelectorAll('[data-nearby-kind="thing"]').length,text:o.innerText.slice(0,80)}:null;});
 L.assert(card&&card.people>=1&&card.things>=1,JSON.stringify(card));
 const dedupe=await p.evaluate(()=>({tabs:[...document.querySelectorAll('.scene-local-tabs button')].filter(b=>b.checkVisibility()).map(b=>b.textContent.trim()),cardTitle:!!document.querySelector('.shell-place-overview > strong'),presentationVisible:!!document.querySelector('[data-workspace-action="presentation"]')?.checkVisibility(),expandVisible:[...document.querySelectorAll('.parity-region .workspace-module-header > [data-workspace-action="expand"]')].filter(b=>getComputedStyle(b).visibility==='visible').length}));
 L.assert.deepEqual(dedupe.tabs,['Actions','Options'],JSON.stringify(dedupe));L.assert.equal(dedupe.cardTitle,false);L.assert.equal(dedupe.presentationVisible,false);
 await p.locator('[data-region="log"] .workspace-module').first().hover();await p.waitForTimeout(150);const hoverExpand=await p.evaluate(()=>getComputedStyle(document.querySelector('[data-region="log"] .workspace-module-header > [data-workspace-action="expand"]')).visibility);
 L.assert.equal(hoverExpand,'visible');await p.mouse.move(2,h-2);ok(`${tag} dedupe`,{...dedupe,hoverExpand});await shot(p,`idle-${tag}`);ok(`${tag} idle place card`,card);
 // subject, local back, Esc
 await p.locator('#current_focus [data-inspect-nearby]').first().click({noWaitAfter:true});await p.waitForTimeout(400);
 L.assert.equal(await p.locator('#current_focus').getAttribute('data-subject-heading'),'true');L.assert(await p.locator('[data-focus-back]').isVisible());
 await p.locator('[data-focus-back]').click({noWaitAfter:true});await p.waitForTimeout(400);L.assert(await p.locator('#current_focus .shell-place-overview').isVisible());
 await p.locator('#current_focus [data-inspect-nearby]').first().click({noWaitAfter:true});await p.waitForTimeout(400);await p.keyboard.press('Escape');await p.waitForTimeout(400);L.assert(await p.locator('#current_focus .shell-place-overview').isVisible());ok(`${tag} subject back + Esc`);
 // B1 yield per view, one back, restore
 const views=[];for(const id of['records','known-people','projects','customization']){await L.nav(p,id);await p.waitForTimeout(450);const r=await regions(p),hgt=await centerH(p),backs=await p.evaluate(()=>[...document.querySelectorAll('#center_mode_content .expanded-panel-heading [data-workspace-action="expand"]')].filter(n=>n.checkVisibility()).length+document.querySelectorAll('#center_mode_navigation:not([hidden]) #center_mode_back').length);
  L.assert.equal(r.focus,'hidden');L.assert.equal(backs,1,id);views.push({id,hgt});if(id==='records')await shot(p,`journal-${tag}`);await p.keyboard.press('Escape');await p.waitForTimeout(400);L.assert.deepEqual(await regions(p),home,'restored after '+id);}
 ok(`${tag} views yield + one back + restore`,views);
 // subject keeps Focus while a view is open
 await p.locator('#current_focus [data-inspect-nearby]').first().click({noWaitAfter:true});await p.waitForTimeout(300);await L.nav(p,'records');await p.waitForTimeout(450);L.assert.notEqual((await regions(p)).focus,'hidden');await p.keyboard.press('Escape');await p.waitForTimeout(300);await p.keyboard.press('Escape');await p.waitForTimeout(300);ok(`${tag} subject keeps Focus`);
 // Inventory nav stays home
 await L.nav(p,'belongings');await p.waitForTimeout(400);const inv=await p.evaluate(()=>({inCenter:!!document.querySelector('#center_mode_content #inventory_content_div'),active:document.activeElement?.closest('[data-region]')?.dataset.region,task:document.getElementById('main_content').dataset.centerTask||null}));
 L.assert.deepEqual(inv,{inCenter:false,active:'inventory',task:null});ok(`${tag} inventory in place`,inv);
 L.assert.deepEqual(await L.state(p),before,'no native state change');L.assert.deepEqual(p.errors,[]);await ctx.close();
 // combat: native area progress, Focus not yielded
 if(f===14||w===1920){({ctx,p}=await L.open(b,{w,h,data:fs.readFileSync(path.join(__dirname,'evidence/parity-r9/populated-three.save.txt'),'utf8')}));if(f!==14)await L.textSize(p,f);await p.waitForTimeout(700);
  const cap=await p.locator('.enemy-roster-toolbar span').first().textContent();L.assert.match(cap,/3 opponents · inspect/);L.assert.match(cap,/Clears/);L.assert.equal(await p.locator('.enemy-card:visible').count(),3);L.assert.notEqual((await regions(p)).focus,'hidden');
  await shot(p,`combat-${tag}`);ok(`${tag} combat progress`,cap);L.assert.deepEqual(p.errors,[]);await ctx.close();}
}}finally{await b.close();}fs.writeFileSync(path.join(OUT,'r13-checks.json'),JSON.stringify(log,null,1));console.log('ALL',log.length);})().catch(e=>{console.error('FAIL',e.message.slice(0,600));process.exit(1)});

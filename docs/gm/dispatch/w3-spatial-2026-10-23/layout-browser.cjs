const gate=require('../cultivation-spacing-2026-10-22/browser-helper.cjs');
gate('home-layout',async h=>{
 const {p,boot,enroll,save:_s,load,read,roundtrip,assert,gates,out}=h;
 const save=async()=>{await p.evaluate(()=>document.getElementById('save_button').click());return read();};
 const openId=async id=>{await p.evaluate(id=>{document.querySelector(`[data-panel-path="${id}"]`)?.press('Enter');const n=document.querySelector('[aria-label="Other known panels"]');if(n&&[...n.options].some(o=>o.value===id)){n.value=id;n.dispatchEvent(new Event('change',{bubbles:true}));}},id);};
 await boot();await enroll();await p.evaluate(()=>advanceTicks(1));
 await openId('homes');const j=p.locator('[data-home-action="institution_join"]');await j.waitFor({state:'visible'});await j.press('Enter');
 await p.evaluate(()=>advanceTicks(3));let s=await save();
 assert.equal(s.home_layout,undefined);gates.push('A: a manor save without layouts has no home_layout key');
 const fort0=await p.evaluate(()=>JSON.stringify(simulationTestHooks?.snapshot?.().household_fortunes?.members||null));
 for(const [w,hh] of [[1920,1080],[1536,864]]){
  await p.setViewportSize({width:w,height:hh});await openId('home-layout');await p.locator('#home_layout_panel').waitFor({state:'visible'});
  if(w===1920){await p.locator('[data-layout-adopt]').press('Enter');}
  await p.waitForTimeout(300);
  const box=await p.locator('#home_layout_panel').boundingBox();console.log(w,'panel box',JSON.stringify(box));
  assert.ok(box.width>300&&box.x>=0&&box.x+box.width<=w);
  await p.screenshot({path:out+`/layout-${w}.png`});
 }
 s=await save();assert.ok(s.home_layout.homes.manor.moves===0);gates.push('B: adopt creates a default layout, zero moves, no cost');
 const mo=x=>x.character?.money;const money0=mo(s);
 await p.locator('[data-layout-slot="hearth"]').press('Enter');await p.locator('[data-layout-cell="1,0"]').press('Enter');
 const q=await p.locator('[data-layout-quote]').innerText();console.log(q);assert.match(q,/→ -0\./);
 await p.screenshot({path:out+'/layout-quote-1536.png'});
 await p.locator('[data-layout-confirm]').press('Enter');await p.waitForTimeout(300);
 s=await save();console.log('slice',JSON.stringify(s.home_layout),'money',money0,'->',mo(s));
 assert.deepEqual(s.home_layout.homes.manor.at.hearth,[1,0]);assert.equal(s.home_layout.homes.manor.moves,1);
 assert.equal(money0-mo(s),2,'fee of 2 coins charged');const wallet=s.expansion?.actors?.player?.resources;console.log('player resources',JSON.stringify(wallet));
 gates.push('C: hearth moved beside the bed via quote then confirm; slice updated; fee charged ('+money0+'->'+mo(s)+')');
 const t=await p.locator('#home_layout_panel').innerText();assert.match(t,/Sleep from the room: -0\./);
 await p.screenshot({path:out+'/layout-moved-1536.png'});
 await p.evaluate(()=>advanceTicks(2));
 await roundtrip('layout',s=>s.home_layout);gates.push('D: save, reload, Export, literal Import keep the layout slice');
 s=await save();delete s.home_layout;await load(s,'nolayout');await p.evaluate(()=>advanceTicks(2));s=await save();assert.equal(s.home_layout,undefined);gates.push('E: a save without the slice loads and stays without it');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});

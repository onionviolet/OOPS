// UIL9: root runs against an integrated rebuilt candidate through R4_URL.
// Seeded known fixture, fresh browser storage. No personal save and no progression claim.
const T=require('./target-set.cjs'),{fs,path,assert}=T.L;
const E=path.join(__dirname,'evidence/gripes-a1');
const category=async(p,id)=>{const tab=p.locator(`.inventory-tabs [data-category=${id}]`);if(!await tab.isVisible())await p.locator('[data-control-box=inventory] > .control-box-button').click();await tab.click();if(await p.locator('#control_box_inventory').isVisible())await p.keyboard.press('Escape');};
const measure=p=>p.evaluate(()=>{
 const box=s=>{const n=document.querySelector(s),r=n.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};};
 return {inventory:box('[data-region=inventory]'),you:box('[data-region=player]'),actions:box('[data-region=actions]'),reports:box('[data-region=log]'),overflow:document.documentElement.scrollWidth>innerWidth};
});
(async()=>{const b=await T.launch(300),out=[];try{
 for(const t of T.targets().filter(t=>['1920','1366'].includes(t.name))){
  const {p,ctx}=await T.L.open(b,{w:t.w,h:t.h,dpr:t.dpr});
  try{
   if(t.font!==14)await T.L.textSize(p,t.font);
   await p.waitForTimeout(500);
   assert.equal(await p.locator('#main_content').getAttribute('data-inventory-composition'),'true');
   await p.evaluate(()=>document.fonts.ready);const after=await measure(p);
   await p.evaluate(()=>{for(const s of document.styleSheets)if(s.href?.includes('/inventory_composition.css'))s.disabled=true;});await p.waitForTimeout(300);
   const before=await measure(p);
   await p.evaluate(()=>{for(const s of document.styleSheets)if(s.href?.includes('/inventory_composition.css'))s.disabled=false;});await p.waitForTimeout(300);
   assert(after.inventory.w<before.inventory.w,`inventory narrows at ${T.tag(t)}`);
   assert(after.actions.w>before.actions.w,'freed width reaches actions');
   assert(Math.abs(after.you.w-before.you.w)<12,`${T.tag(t)} You before ${before.you.w} after ${after.you.w}`);
   assert(Math.abs(after.reports.w-before.reports.w)<12,'Reports retains its width');
   assert(!after.overflow);
   const gear=p.locator('#inventory_content_div > .character_item_equippable').first();await gear.focus();await p.waitForTimeout(300);
   assert.equal(await p.locator('#proto23_item_detail').getAttribute('data-inventory-kind'),'equipment');
   assert(await p.locator('#current_focus > .nearby-context-view').isVisible(),'item inspection preserves nearby context');
   const detailName=await p.locator('.shell-item-title').textContent();
   await category(p,'usable');await p.waitForTimeout(300);
   assert.equal(await p.locator('.shell-item-title').textContent(),detailName,'native filter retains inspected item');
   assert.equal(await p.locator('#proto23_item_detail').getAttribute('data-inventory-kind'),'equipment');
   await category(p,'all');
   const bread=p.locator('#inventory_content_div > [data-character_item]').filter({has:p.locator('.item_name',{hasText:'Fresh bread'})}).first();
   await bread.focus();await p.waitForTimeout(250);
   assert.equal(await p.locator('#proto23_item_detail').getAttribute('data-inventory-kind'),'usable');
   const nativeBefore=await T.L.state(p);
   const colors=await p.evaluate(()=>{
    const color=n=>getComputedStyle(n).color;
    return {row:color(document.querySelector('#inventory_content_div > [data-inventory-kind=usable] .item_name')),tab:color(document.querySelector('.inventory-tabs [data-category=usable] .inventory-tab-count')),detail:color(document.querySelector('.inventory-kind-caption'))};
   });
   assert.equal(colors.row,colors.tab);assert.equal(colors.row,colors.detail);
   assert.deepEqual(await T.L.state(p),nativeBefore,'inspection and color reads do not mutate game');
   await gear.hover();await p.waitForTimeout(200);assert.equal(await p.locator('#shell_item_preview').evaluate(n=>n.matches(':popover-open')),false,'hovering another row cannot cover the stable inspector');
   await T.shot(p,path.join(E,`${T.tag(t)}-selected.png`));
   const quality=await gear.locator('.item_quality').textContent();assert.match(quality,/%/);
   await bread.hover();await p.waitForTimeout(250);assert.equal(await p.locator('#shell_item_preview').evaluate(n=>n.matches(':popover-open')),false,'selected item does not duplicate its inspector with an action-blocking preview');
   const use=p.locator('.shell-item-actions').getByRole('button',{name:'Use',exact:true});await use.click();await p.waitForTimeout(400);assert.notDeepEqual(await T.L.state(p),nativeBefore,'native item Use remains reachable in the short companion');
   out.push({target:T.tag(t),before,after,colors,quality,errors:p.errors});assert.deepEqual(p.errors,[]);
  }finally{await ctx.close();}
 }
 fs.mkdirSync(E,{recursive:true});fs.writeFileSync(path.join(E,'results.json'),JSON.stringify(out,null,2));console.log(JSON.stringify(out,null,2));
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

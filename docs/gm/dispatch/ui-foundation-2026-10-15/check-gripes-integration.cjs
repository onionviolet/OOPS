// Integrated A1/A2: native populated fixture, isolated browser contexts, real native service action.
const T=require('./target-set.cjs'),{fs,path,assert}=T.L;
const E=path.join(__dirname,'evidence/gripes-a1a2');
const settle=p=>p.waitForTimeout(500);
const restart=async p=>{await p.waitForFunction(()=>!!window.simulationTestHooks);await T.L.R.startFresh(p);await p.evaluate(()=>simulationTestHooks.pause());await settle(p);};
(async()=>{const b=await T.launch(500);const out=[];try{
for(const t of T.targets().filter(t=>['1920','1366'].includes(t.name))){
 const {ctx,p}=await T.L.open(b,{w:t.w,h:t.h,dpr:t.dpr});
 try{
  if(t.font!==14)await T.L.textSize(p,t.font);await settle(p);
  assert(await p.locator('#current_focus > .nearby-context-view').isVisible());
  assert.equal(await p.locator('.nearby-context-list button').first().evaluate(n=>parseFloat(getComputedStyle(n).fontSize)),t.font,'nearby names honor actual text size');
  assert.equal(await p.locator('[data-module=focus] [data-workspace-action=collapse]').getAttribute('aria-label'),'Collapse Around you');
  assert.equal(await p.locator('[data-inspect-nearby=projects]').count(),0);
  assert(await p.locator('#workspace_navigation [data-panel-path=projects]').count());
  const before=await T.L.state(p);const subjects=p.locator('.nearby-context-list [data-inspect-nearby]');assert(await subjects.count()>=3);
  const first=subjects.first(),firstId=await first.getAttribute('data-inspect-nearby');
  await first.click();await settle(p);assert(await p.locator('.nearby-context-detail').isVisible());assert.deepEqual(await T.L.state(p),before,'inspection is free');
  const mode=await p.locator('.nearby-context-list').isVisible()?'split':'drilldown';
  await p.locator('[data-nearby-next]').click();await settle(p);
  await p.keyboard.press('Escape');await settle(p);assert(await p.locator('.nearby-context-list').isVisible());
  assert(await p.evaluate(()=>document.activeElement.hasAttribute('data-inspect-nearby')),'Esc restores subject-row focus');
  const station=subjects.filter({hasText:/Village mixing counter/i}).first();await station.click();await settle(p);
  const selected=await station.getAttribute('data-inspect-nearby');
  await T.shot(p,path.join(E,`after-${T.tag(t)}-nearby.png`));
  await p.locator('.nearby-context-actions button').first().click();await settle(p);
  assert.equal(await p.locator('#main_content').getAttribute('data-center-task'),'mixing');
  const stock=p.locator('.mixture-ingredient').first();const stockBefore=await stock.textContent();
  await stock.getByRole('button',{name:/Buy 1/}).click();await settle(p);
  assert.notEqual(await stock.textContent(),stockBefore,'native purchase changes owned ingredient count');
  await T.shot(p,path.join(E,`after-${T.tag(t)}-service.png`));
  await p.keyboard.press('Escape');await settle(p);
  assert.equal(await p.locator('.nearby-context-detail h3').textContent(),'Village mixing counter');
  assert.equal(await p.locator(`[data-inspect-nearby="${selected}"]`).getAttribute('aria-pressed'),'true');
  await p.locator('[data-nearby-back]').click();await settle(p);assert.equal(await p.evaluate(()=>document.activeElement.dataset.inspectNearby),selected);
  const gutter=p.locator('[data-shell-resize=bottomLeft]');await gutter.focus();await p.keyboard.press('ArrowRight');await settle(p);
  const savedSizes=await p.evaluate(()=>document.querySelector('.workspace-board').style.getPropertyValue('grid-template-columns'));assert(savedSizes,'saved sizing wins automatic inventory default');
  await p.locator('#save_button').click();
  await p.reload();await restart(p);
  assert.equal(await p.locator('.nearby-context-detail').isVisible(),false,'inspection is transient after reload');
  assert.equal(await p.evaluate(()=>document.querySelector('.workspace-board').style.getPropertyValue('grid-template-columns')),savedSizes);
  const download=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const file=path.join(E,`${T.tag(t)}.save.txt`);await(await download).saveAs(file);
  const loaded=p.waitForEvent('domcontentloaded');await p.locator('#saved_file_input').setInputFiles(file);await loaded;await restart(p);fs.rmSync(file);
  assert.equal(await p.evaluate(()=>document.querySelector('.workspace-board').style.getPropertyValue('grid-template-columns')),savedSizes,'literal game import preserves browser-owned layout');
  assert(await p.locator('.nearby-context-list').isVisible());
  const geometry=await T.L.geometry(p);assert(geometry.page[0]<=t.w);assert(geometry.page[1]<=t.h);assert.deepEqual(p.errors,[]);
  out.push({target:T.tag(t),mode,selected,serviceAction:'native ingredient purchase',nativePersistence:'save/reload/export/literal import',savedSizes,geometry,errors:p.errors});
  console.log('PASS native A1/A2',T.tag(t),mode);
 }finally{await ctx.close();}
}
// Existing native combat route remains the opponent board, then returns to nearby representation.
const combatSave=JSON.stringify({...JSON.parse(T.L.save),'current location':'Infested field'});
const {ctx,p}=await T.L.open(b,{w:1920,h:1080,data:combatSave});try{
 assert(await p.locator('#current_focus > .combat-focus-view').isVisible());
 assert.equal(await p.locator('#current_focus > .nearby-context-view').count(),0);
 assert.equal(await p.locator('#current_focus').getAttribute('data-nearby-summary'),null);
 await T.shot(p,path.join(E,'after-combat-1920.png'));assert.deepEqual(p.errors,[]);out.push({combat:'native fixture opponent board preserved'});
}finally{await ctx.close();}
fs.writeFileSync(path.join(E,'integration.json'),JSON.stringify(out,null,2));
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

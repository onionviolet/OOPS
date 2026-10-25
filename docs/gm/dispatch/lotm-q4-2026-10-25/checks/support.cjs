const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {startFresh}=require(process.cwd()+'/docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const assert=require('node:assert/strict');
exports.launch=()=>chromium.launch({headless:true,channel:'chrome'});
exports.fixture=async browser=>{
 const context=await browser.newContext({viewport:{width:1920,height:1080}}),p=await context.newPage(),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:19873/?lotm_probe=1&test_hooks=1');
 await p.waitForFunction(()=>window.simulationTestHooks);await startFresh(p);await p.evaluate(()=>simulationTestHooks.pause());
 const snapshot=()=>p.evaluate(()=>simulationTestHooks.snapshot());
 const open=async()=>{await p.locator('[data-workspace-action="restore"][data-module="lotm"]').evaluate(n=>n.click());await p.locator('[data-workspace-action="expand"][data-module="lotm"]').evaluate(n=>n.click());await p.locator('#lotm_panel').waitFor({state:'visible'});};
 await open();
 const button=token=>p.locator(`#lotm_panel [data-lotm="${token}"]`);
 const click=async token=>{if(!await p.locator('#lotm_panel').isVisible())await open();assert.equal(await button(token).isDisabled(),false,token);await button(token).click();console.log('clicked',token);};
 const ticks=n=>p.evaluate(n=>advanceTicks(n,{render:true}),n);
 const project=s=>({money:s.character.money,profile:s.expansion.lotm.entryProfile,knowledge:s.expansion.simulation.knowledge.player,
  resources:Object.fromEntries(Object.entries(s.expansion.actors).filter(([k])=>k==='player'||k.startsWith('book.lotm.')).map(([k,v])=>[k,v.resources])),
  facts:s.expansion.actors.player.facts,inventories:s.inventories.person,location:s['current location']});
 const persistence=async perturb=>{
  await p.evaluate(()=>saveProgress());const saved=project(await snapshot());
  await p.reload();await p.waitForFunction(()=>window.simulationTestHooks);await p.getByText('PLAY',{exact:true}).click();await p.evaluate(()=>simulationTestHooks.pause());assert.deepEqual(project(await snapshot()),saved);await open();
  const encoded=await p.evaluate(()=>save_to_file());assert.ok(encoded?.length>1000);const exported=project(await snapshot());
  await perturb();assert.notDeepEqual(project(await snapshot()),exported,'test perturbs actual state before Import');
  await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded'}),p.locator('#saved_file_input').setInputFiles({name:'c1-disposable.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);
  await p.waitForFunction(()=>window.simulationTestHooks);await p.getByText('PLAY',{exact:true}).click();await p.evaluate(()=>simulationTestHooks.pause());assert.deepEqual(project(await snapshot()),exported);await open();
  console.log('Save/reload/Export/literal Import passed');return {exportChars:encoded.length};
 };
 return {context,p,errors,snapshot,open,button,click,ticks,persistence};
};

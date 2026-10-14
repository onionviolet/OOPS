const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const root=process.cwd(),out=__dirname,base='http://127.0.0.1:18830/';process.env.URL=base;
const routes=require(path.join(root,'docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs'));
const fixture=base+'docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-known-detail/fixture.html';
const results=[];function pass(id,detail){results.push({id,status:'pass',detail});console.log('PASS',id)}
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const native=await browser.newContext({viewport:{width:1366,height:768}}),p=await native.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  const bundle=fs.readFileSync(path.join(root,'dist/bundle.js'));const served=await p.request.get(base+'dist/bundle.js');assert.deepEqual(await served.body(),bundle);
  pass('served-bundle',{sha256:crypto.createHash('sha256').update(bundle).digest('hex')});
  await p.goto(base);await routes.startFresh(p);await routes.unlockCombatRoute(p);await routes.enterCombat(p);
  await p.waitForFunction(()=>document.querySelectorAll('.bestiary_entry_div').length>0,null,{timeout:60000});
  const bestiary=await p.locator('#bestiary_list').evaluate(e=>({entries:e.querySelectorAll('.bestiary_entry_div').length,killCounts:[...e.querySelectorAll('.bestiary_entry_kill_count')].map(n=>n.innerText),hasUnknown:[...e.querySelectorAll('.loot_name')].some(n=>/unknown|unfamiliar|\?/.test(n.innerText.toLowerCase())),odds:[...e.querySelectorAll('.loot_chance')].map(n=>n.innerText)}));
  assert.ok(bestiary.entries>0);pass('native-existing-first-kill-bestiary',bestiary);
  await routes.leaveCombat(p);await p.screenshot({path:path.join(out,'native-baseline.png')});assert.deepEqual(errors,[]);pass('native-desktop-baseline',{pageErrors:errors});await native.close();
  const context=await browser.newContext({viewport:{width:1366,height:768}}),page=await context.newPage();await page.goto(fixture);await page.waitForFunction(()=>window.ready);
  const input=page.getByRole('textbox',{name:'Hotkey for Known kit'});await input.focus();await input.fill('k');await page.getByRole('button',{name:'Bind',exact:true}).press('Enter');
  await page.getByRole('button',{name:'Unbind',exact:true}).focus();await page.keyboard.press('k');assert.equal(await page.evaluate(()=>calls.length),1);
  await page.getByRole('textbox',{name:'Typing control'}).focus();await page.keyboard.press('k');assert.equal(await page.evaluate(()=>calls.length),1);
  await input.fill('j');await page.getByRole('button',{name:'Bind',exact:true}).press('Enter');await page.getByRole('button',{name:'Unbind',exact:true}).focus();await page.keyboard.press('k');await page.keyboard.press('j');assert.equal(await page.evaluate(()=>calls.length),2);
  await page.getByRole('button',{name:'Unbind',exact:true}).press('Enter');await page.keyboard.press('j');assert.equal(await page.evaluate(()=>calls.length),2);pass('fixture-keyboard-bind-use-typing-rebind-unbind','Exact mock dispatch count 2; no hover');
  await input.fill('k');await page.getByRole('button',{name:'Bind',exact:true}).press('Enter');await page.reload();await page.waitForFunction(()=>window.ready);assert.equal(await input.inputValue(),'k');pass('fixture-hotkey-reload','Browser binding retained');
  await page.evaluate(()=>{state.items=[];binding.render();hotkeyList.render()});assert.match(await page.locator('#item').innerText(),/Unavailable item/);await page.getByRole('button',{name:'Unbind K',exact:true}).press('Enter');assert.deepEqual(await page.evaluate(()=>controller.getBindings()),{});pass('fixture-stale-binding-cleanup','Lost item can be unbound by keyboard without exposing identity');
  await page.locator('#numbers summary').press('Enter');assert.equal(await page.locator('#numbers p').innerText(),'Exact value: 1234567');assert.match(await page.locator('#chains').innerText(),/Blocked: Use method.*Missing known tool/);pass('fixture-exact-values-and-readiness','Keyboard exact detail and native-shaped blocked row');
  assert.deepEqual(await page.evaluate(()=>projectObservedDrops([{id:'x',known:true,recipientId:'player',observed:false,label:{known:true,text:'Secret'},count:1}])),[]);pass('fixture-observed-drop-boundary','Unobserved association absent');
  await page.evaluate(()=>settings.setDisplaySettings({numberFormat:'scientific',semGain:'#aabbcc'}));const snapshot=await page.evaluate(()=>settings.exportDisplayPreferences());fs.writeFileSync(path.join(out,'presentation-snapshot.json'),JSON.stringify(snapshot));
  const fresh=await browser.newContext({viewport:{width:1366,height:768}}),q=await fresh.newPage();await q.goto(fixture);await q.waitForFunction(()=>window.ready);await q.locator('#literal').setInputFiles(path.join(out,'presentation-snapshot.json'));await q.waitForFunction(()=>window.importResult==='ok');assert.equal(await q.evaluate(()=>settings.getDisplaySetting('numberFormat')),'scientific');await q.reload();await q.waitForFunction(()=>window.ready);assert.equal(await q.evaluate(()=>settings.getDisplaySetting('numberFormat')),'scientific');pass('fixture-fresh-browser-literal-snapshot-adoption-reload','Presentation file only, not native save envelope');
  await page.evaluate(()=>{settings.setDisplaySettings({numberFormat:'exact'});window.importResult=null});await page.locator('#literal').setInputFiles(path.join(out,'presentation-snapshot.json'));await page.waitForFunction(()=>window.importResult==='ok');assert.equal(await page.evaluate(()=>settings.getDisplaySetting('numberFormat')),'exact');pass('fixture-existing-local-precedence','Existing exact format wins');
  await page.screenshot({path:path.join(out,'module-contract.png')});await context.close();await fresh.close();
 }catch(error){results.push({id:'browser-error',status:'fail',detail:error.stack});throw error}
 finally{fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify({viewport:[1366,768],nativeFeatureAcceptance:'OPEN: requires P00 host integration',results},null,2));await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});

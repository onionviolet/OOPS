// Run after building and serving ONLY this worktree at 127.0.0.1:8201.
// No personal browser profile or save. Workshop introduction and 3 logs are
// controlled prerequisites; all counted work and reward transfers use real UI.
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),os=require('os'),assert=require('node:assert/strict'),{execFileSync}=require('child_process');
const URL='http://127.0.0.1:8201/',DIR=__dirname,TMP=fs.mkdtempSync(path.join(os.tmpdir(),'lp8-proof-'));
const reward='feature_objects.collect_drying_sap',dry='feature_objects.dry_shade',key=id=>JSON.stringify({id});
const results=[],errors=[];
const pass=(id,detail)=>{results.push({id,detail});console.log('PASS',id,JSON.stringify(detail));};
let browser,debugPage;
(async()=>{
 browser=await chromium.launch({headless:true,channel:'chrome'});
 const context=()=>browser.newContext({viewport:{width:1366,height:768},acceptDownloads:true});
 async function open(ctx,serialized){const p=await ctx.newPage();p.setDefaultTimeout(15000);await p.route('**/resources/js/HackTimer/HackTimer.min.js',r=>r.fulfill({contentType:'application/javascript',body:'// Standard browser timers for deterministic Playwright time.'}));await p.clock.install();p.on('pageerror',e=>errors.push(e.message));
  if(serialized){await p.goto(URL+'style.css');await p.evaluate(s=>localStorage.setItem('save data',s),serialized);}
  await p.goto(URL,{waitUntil:'domcontentloaded'});await p.locator('#loading_screen_play_button').click();
  if(await p.locator('#hero_creation_panel_confirmation').isVisible())await p.locator('#hero_creation_panel_confirmation').click();
  await p.clock.pauseAt((await p.evaluate(()=>Date.now()))+1000);return p;
 }
 const save=async p=>{await p.locator('#save_button').click({noWaitAfter:true});const data=await p.evaluate(()=>localStorage.getItem('save data'));fs.writeFileSync(path.join(TMP,'last.json'),data);return JSON.parse(data);};
 const counts=s=>({completed:['shade','braced','shelf'].reduce((n,r)=>n+(s.expansion.actors.player.completed['feature_objects.dry_'+r]||0),0),
  collected:s.expansion.actors.player.completed[reward]||0,wet:s.inventories.person.main_character[key('Wet repair stave')]?.count||0,
  sound:s.inventories.person.main_character[key('Sound repair stave')]?.count||0,sap:s.inventories.person.main_character[key('Tree sap')]?.count||0,
  edaSap:s.expansion.simulation?.owners['feature_objects.miri']?.[key('Tree sap')]||0});
 const section=p=>p.locator('#feature_expansion_panel details').filter({has:p.getByText('Fitting tools & materials',{exact:true})});
 async function show(p){const panel=p.locator('#feature_expansion_panel');if(!await panel.evaluate(e=>e.open))await panel.locator(':scope > summary').click();
  const s=section(p);if(!await s.evaluate(e=>e.open))await s.locator(':scope > summary').click();return s;}
 const button=(p,id)=>section(p).locator(`[data-action-legibility-key="action:${id}"] .action-legibility__controls > button`).first();
 const act=async(p,id)=>{const b=button(p,id);assert.equal(await b.getAttribute('aria-disabled'),'false',id+' must be eligible');await b.click({noWaitAfter:true});};
 const shot=async(p,name)=>{await section(p).locator(':scope > summary').evaluate(e=>e.scrollIntoView({block:'start'}));await p.screenshot({path:path.join(DIR,name+'.png')});};
 const freshCtx=await context(),fresh=await open(freshCtx);
 assert(!await fresh.locator('body').innerText().then(t=>t.includes('Drying work (proposal)')));
 assert.equal(await fresh.locator(`[data-action-legibility-key="action:${reward}"]`).count(),0);
 await fresh.screenshot({path:path.join(DIR,'01-unseen.png')});
 const base=await save(fresh);assert(!base.expansion.actors.player.completed[reward]);
 fs.writeFileSync(path.join(TMP,'base.json'),JSON.stringify(base));
 execFileSync(process.execPath,[path.join(DIR,'make-fixture.mjs'),path.join(TMP,'base.json'),path.join(TMP,'fixture.json')]);
 pass('B1_unseen',{trackerAbsent:true,rewardAbsent:true});await freshCtx.close();
 const ctx=await context(),p=await open(ctx,fs.readFileSync(path.join(TMP,'fixture.json'),'utf8'));debugPage=p;await show(p);
 let state=await save(p);assert.equal(counts(state).completed,0);assert.equal(counts(state).sap,0);await shot(p,'02-discovered-zero');
 for(let i=0;i<3;i++){await section(p).locator(':scope > summary').click();await section(p).locator(':scope > summary').click();}
 await act(p,'feature_objects.inspect');await p.clock.runFor(3000);assert.equal(counts(await save(p)).completed,0);
 pass('B2_inspection',{completed:0,repeatViews:3,paidJointInspection:true});
 await act(p,'feature_objects.buy');await act(p,'feature_objects.cut_sharp_own');await p.clock.runFor(5000);
 state=await save(p);assert.equal(counts(state).wet,2);assert.equal(counts(state).completed,0);
 pass('B3_real_inputs',{logsBefore:3,logsAfter:state.inventories.person.main_character[key('Rough wood log')].count,wet:2,knifeDulled:true,money:state.character.money});
 await act(p,dry);state=await save(p);assert.equal(counts(state).completed,0);assert.equal(counts(state).wet,1);
 await section(p).locator('[data-action-legibility-key^="action:cancel:"] button').first().click();
 state=await save(p);assert.equal(counts(state).wet,2);assert.equal(counts(state).completed,0);
 pass('B4_pending_cancel',{completed:0,wetRefunded:2});
 await act(p,dry);await p.clock.runFor(7000);state=await save(p);assert.equal(counts(state).completed,1);assert.equal(counts(state).sound,1);assert.equal(counts(state).wet,1);
 assert.equal(await button(p,reward).getAttribute('aria-disabled'),'true');await shot(p,'03-first-earned');pass('B5_first_action',counts(state));
 await act(p,dry);const pending=await save(p);assert.equal(counts(pending).completed,1);assert.equal(counts(pending).wet,0);
 const pendingFile=path.join(TMP,'pending.txt');{const dl=p.waitForEvent('download');await p.locator('#save_to_file_button').click();await(await dl).saveAs(pendingFile);}
 await p.reload({waitUntil:'domcontentloaded'});await p.locator('#loading_screen_play_button').click();await show(p);
 state=await save(p);assert.deepEqual(counts(state),counts(pending));assert(state.expansion.simulation.jobs.some(j=>j.commandId===dry));
 await Promise.all([p.waitForEvent('domcontentloaded'),p.locator('#saved_file_input').setInputFiles(pendingFile)]);await p.locator('#loading_screen_play_button').click();await show(p);
 state=await save(p);assert.deepEqual(counts(state),counts(pending));assert(state.expansion.simulation.jobs.some(j=>j.commandId===dry));
 pass('B6_pending_reload_literal_import',counts(state));
 await p.clock.runFor(7000);state=await save(p);console.log('PENDING_FINISH',JSON.stringify({clock:state.expansion.clock,jobs:state.expansion.simulation.jobs.map(j=>({command:j.commandId,due:j.due})),counts:counts(state)}));assert.equal(counts(state).completed,2);assert.equal(counts(state).sound,2);assert.equal(counts(state).sap,0);
 await shot(p,'04-reward-earned');pass('B7_second_action',counts(state));
 await act(p,reward);state=await save(p);assert.deepEqual(counts(state),{completed:2,collected:1,wet:0,sound:2,sap:1,edaSap:1});
 assert.equal(await button(p,reward).getAttribute('aria-disabled'),'true');await shot(p,'05-collected');pass('B8_finite_reward',counts(state));
 const collected=counts(state),file=path.join(TMP,'collected.txt');{const dl=p.waitForEvent('download');await p.locator('#save_to_file_button').click();await(await dl).saveAs(file);}
 for(let i=0;i<3;i++){
  if(i===0)await p.reload({waitUntil:'domcontentloaded'});else await Promise.all([p.waitForEvent('domcontentloaded'),p.locator('#saved_file_input').setInputFiles(file)]);
  await p.waitForLoadState('domcontentloaded');await p.locator('#loading_screen_play_button').click();await show(p);
  state=await save(p);assert.deepEqual(counts(state),collected);assert.equal(await button(p,reward).getAttribute('aria-disabled'),'true');
 }
 await shot(p,'06-reloaded-imported');pass('B9_collected_reload_repeated_literal_import',{...collected,imports:2});
 await act(p,'feature_objects.repair_dull_own');state=await save(p);assert.equal(counts(state).sap,0);assert.equal(counts(state).completed,2);
 assert.equal(state.inventories.person.main_character[key('Field fitting knife')].count,1);assert(!state.inventories.person.main_character[key('Dulled field fitting knife')]);
 pass('B10_useful_local_consumer',{sapSpent:1,ownedSharpKnife:1,completed:2});
 assert(!await section(p).innerText().then(t=>/whole world complete|world completion total/i.test(t)));
 assert.deepEqual(errors,[]);await ctx.close();
 // Compatibility on the original disposable native save, without LP8 state.
 const oldCtx=await context(),old=await open(oldCtx,JSON.stringify(base)),oldSave=await save(old);
 assert(!oldSave.expansion.actors.player.completed[reward]);assert.equal(counts(oldSave).completed,0);
 assert.deepEqual(oldSave.inventories.person.main_character,base.inventories.person.main_character);
 pass('B11_old_save',{lp8StateAbsent:true,stockUnchanged:true});await oldCtx.close();
 fs.writeFileSync(path.join(DIR,'results.json'),JSON.stringify({viewport:{width:1366,height:768},origin:URL,fixture:'Workshop/body introduction and three logs are controlled prerequisites. No qualifying drying receipts or player sap were seeded.',results,pageErrors:errors},null,2)+'\n');
 await browser.close();
})().catch(async e=>{console.error(e.stack);if(debugPage){console.error((await debugPage.locator('#feature_expansion_panel').innerText()).slice(0,1600));await debugPage.screenshot({path:path.join(DIR,'failure.png')});}fs.writeFileSync(path.join(DIR,'failure.txt'),e.stack+'\n');if(browser)await browser.close();process.exitCode=1;});

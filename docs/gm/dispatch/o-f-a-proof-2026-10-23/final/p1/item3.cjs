// Item 3: Paradise chart enrolment (adapted from progression-gates-2026-10-23/paradise-chart-fix/paradise_chart_proof.cjs).
// Serves the integration worktree root on port 0 (lib.cjs). Fresh game, village elder dialogue, then the chart BEFORE any other enrolment;
// reload, export (window.save_to_file) + file import (#saved_file_input setInputFiles). Hooks: ?test_hooks=1 (snapshot, advanceGameMinutes). Usage: node item3.cjs
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {run,out,root}=require('./lib.cjs');
const {advanceGameMinutes}=require(path.join(root,'scripts/ui_helpers.cjs'));
const {startFresh}=require(path.join(root,'docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs'));
const res={};
run('i3',async({page,url,say,shot})=>{
 await page.goto(url);await page.waitForFunction(()=>window.simulationTestHooks);await startFresh(page);
 const snap=()=>page.evaluate(()=>window.simulationTestHooks.snapshot());
 const a=page.locator('#location_actions_div');
 await a.getByText('Talk to someone',{exact:false}).first().click();await a.getByText('Talk to village elder',{exact:false}).first().click();
 for(const key of ['hello','what happened','ask to leave 1','need to']){const l=a.locator(`.dialogue_textline[data-textline="${key}"]`);await l.waitFor({state:'visible'});await l.evaluate(n=>n.click());await l.waitFor({state:'detached'});}
 await page.evaluate(()=>end_dialogue());await advanceGameMinutes(page,3);
 await page.getByRole('combobox',{name:'Other known panels'}).selectOption({label:'Notes, practice & people •'});
 await page.locator('[data-notebook-view="here"]').click();await page.locator('#feature_expansion_panel').evaluate(n=>{n.open=true;});
 const before=await snap();res.simulationBefore=before.expansion.simulation==null?'absent (no living-world services yet)':'PRESENT';assert.equal(before.expansion.simulation==null,true,'fresh game has no living-world services yet');
 await page.evaluate(()=>document.querySelectorAll('#feature_expansion_panel details').forEach(d=>d.open=true));
 const chart=page.locator('#feature_expansion_panel button',{hasText:/Read the parallel-entry/}).first();
 assert.ok(await chart.count(),'chart action offered');res.buttonBefore=await chart.isDisabled()?'disabled':'enabled';
 await chart.scrollIntoViewIfNeeded();await shot('1-before-chart');
 const b=await chart.boundingBox();await page.mouse.click(b.x+b.width/2,b.y+b.height/2);await page.waitForTimeout(1500);
 try{await page.waitForLoadState('load',{timeout:8000});}catch{}
 if(await page.locator('#loading_screen_play_button').isVisible().catch(()=>false)){say('page reloaded after chart click (enrolment restart path)');await page.waitForFunction(()=>window.simulationTestHooks);await page.locator('#loading_screen_play_button').click();await page.waitForFunction(()=>window.simulationTestHooks.saveStatus().ownsSave);await page.waitForTimeout(800);}
 const after=await snap();res.enrolled=after.expansion.simulation!=null;
 const text=await page.locator('body').innerText();res.refusalShown=/required knowledge, means or circumstances are missing/i.test(text);
 await shot('2-after-chart');
 assert.equal(res.enrolled,true,'chart enrols');assert.equal(res.refusalShown,false,'no refusal');
 res.location=after.expansion.simulation.people.player.location;assert.equal(res.location,'Village');
 res.chartDone=JSON.stringify(after.expansion.actors.player.completed||{}).includes('book.paradise.chart');assert.equal(res.chartDone,true,'chart recorded complete');
 await page.evaluate(()=>window.saveProgress());await page.reload();await page.waitForFunction(()=>window.simulationTestHooks||document.getElementById('loading_screen_play_button'));
 await page.locator('#loading_screen_play_button').click();await page.waitForFunction(()=>window.simulationTestHooks.saveStatus().ownsSave);
 const re=await snap();res.afterReload=re.expansion.simulation!=null&&JSON.stringify(re.expansion.actors.player.completed||{}).includes('book.paradise.chart');assert.equal(res.afterReload,true,'survives reload');await shot('3-after-reload');
 // in-game export: Export button is a UI affordance; window.save_to_file is the function it calls
 const encoded=await page.evaluate(()=>window.save_to_file());res.exportBytes=encoded.length;
 await Promise.all([page.waitForNavigation(),page.locator('#saved_file_input').setInputFiles({name:'chart.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);
 await page.locator('#loading_screen_play_button').click();await page.waitForFunction(()=>window.simulationTestHooks.saveStatus().ownsSave);
 const im=await snap();res.afterImport=im.expansion.simulation!=null&&JSON.stringify(im.expansion.actors.player.completed||{}).includes('book.paradise.chart')&&im.expansion.simulation.people.player.location==='Village';assert.equal(res.afterImport,true,'survives file import');await shot('4-after-import');
 say(res);fs.writeFileSync(path.join(out,'i3-results.json'),JSON.stringify(res,null,1));
});

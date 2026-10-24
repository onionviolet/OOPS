// F1-F4 proof: frail start via the start-probe Beginning UI (localhost ?start_probe=1), body panel buttons, Bio panel, dev skill inspector (?skill_inspector=1).
// Test hook use: only ?test_hooks=1 dev-stepped game time (advanceGameMinutes), as existing harnesses do. No state edits.
const assert=require('node:assert/strict');
const {run}=require('./lib.cjs');
const {openNotebook,advanceGameMinutes}=require('../../../../../scripts/ui_helpers.cjs');
run('f',`start_probe=1&skill_inspector=1`,async({page,context,url,shot,say})=>{
 const save=async()=>{await page.evaluate(()=>window.saveProgress());return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
 const play=async()=>{await page.getByText('PLAY',{exact:true}).click();await page.waitForTimeout(1500);};
 const bioOpen=async()=>{if(!await page.locator('#character_show_bio').isVisible()){await page.locator('nav button:text-is("Stats"), button:text-is("Stats")').first().click();await page.waitForTimeout(600);}if(!await page.locator('#character_bio_div').isVisible())await page.locator('#character_show_bio').click();
  for(const s of ['description','conditions','learned','faded']){const d=page.locator(`[data-bio-section="${s}"]`);if(await d.isVisible()&&!await d.evaluate(n=>n.open)){await d.locator('summary').focus();await page.keyboard.press('Enter');}}};
 const bioText=async()=>{await bioOpen();return page.locator('#character_history_bio').innerText();};
 const bodyPanel=async()=>{if(!await page.locator('#notebook_tab_practice').isVisible()){await page.getByLabel('Other known panels').selectOption('notebook');await page.waitForTimeout(700);}await page.locator('[data-notebook-view="practice"]').click();if(!await page.locator('#body_panel').evaluate(n=>n.open))await page.locator('#body_panel > summary').click();};
 const cmd=async id=>{await bodyPanel();await page.locator(`[data-body-command="${id}"]`).click();};
 const finishJob=async()=>{for(let i=0;i<30;i++){const s=await save();if(!s.expansion.simulation.jobs.some(j=>j.actorId==='player'))return;await advanceGameMinutes(page,1);}throw new Error('job did not finish');};
 await page.goto(url);
 const body=page.locator('[data-start-axis="body"]');await body.locator('[data-start-mode]').selectOption('lock');await body.locator('[data-start-layer]').selectOption('frail');
 await page.locator('[data-start-use]').check();await page.locator('[data-start-card]').scrollIntoViewIfNeeded();await shot('f1-01-frail-beginning-card');
 await play();await shot('f1-02-after-play-underfed');
 let s=await save();assert.ok(s.expansion.actors.player.sources['body.frail_frame'],'frail source granted');
 // elder must be met for the body panel (existing gate)
 await page.getByRole('button',{name:'Talk to someone'}).click();await page.locator('[data-dialogue="oldCraftsman"]').click().catch(async()=>{await page.locator('[data-dialogue]').first().click();});
 await page.getByText('"Hello?"').click();await page.locator('text=← Village >> visible=true').first().click();
 await bodyPanel();await shot('f1-03-body-panel-frail');
 say('body panel buttons visible',await page.evaluate(()=>[...document.querySelectorAll('[data-body-command]')].filter(b=>b.offsetParent).map(b=>b.textContent+(b.disabled?' [disabled]':''))));
 const t0=await bioText();assert.match(t0,/thin, narrow/);assert.match(t0,/pinched/);assert.match(t0,/hungry winter/);await shot('f2-01-bio-frail-description');say('BIO frail',t0);
 await cmd('body.eat_meal');await finishJob();
 const t1=await bioText();assert.doesNotMatch(t1,/pinched/);assert.notEqual(t1,t0);await shot('f2-02-bio-after-meal');
 for(let i=0;i<3;i++){await cmd('body.steady_walk');await finishJob();}
 await cmd('body.settle_frame');await advanceGameMinutes(page,1);
 const t2=await bioText();assert.match(t2,/easy stride/);assert.doesNotMatch(t2,/thin, narrow/);await shot('f1-04-after-growth-bio');say('BIO steadier',t2);
 assert.match(t2,/replaced by Steadier frame/);await shot('f3-01-faded-trait-cause');
 s=await save();const cap=s.expansion.actors.player.sources;assert.ok(cap['body.steady_frame']);say('sources',Object.keys(cap));
 // grow native skills by real body-panel play so the inspector has skills to list
 for(let i=0;i<10;i++){for(const id of ['body.grip_drill','body.steady_walk']){try{await cmd(id);await finishJob();}catch(e){say('skip '+id+' round '+i+': '+String(e.message).slice(0,60));}}await advanceGameMinutes(page,25);}
 s=await save();say('skill_xp',s.levels.person.main_character.skill_xp);
 // F4 inspector (read-only): compare save before/after opening it
 const stable=x=>JSON.stringify({a:x.expansion.actors,p:x.expansion.simulation?.powers,xp:x.levels.person.main_character.skill_xp});const before=stable(s);
 const insp=page.locator('[data-skill-inspector]');if(!await insp.evaluate(n=>n.open)){await insp.locator('summary').focus();await page.keyboard.press('Enter');}
 const itxt=await insp.innerText();say('INSPECTOR',itxt);await shot('f4-01-inspector');
 const after=stable(await save());say('inspector interactive controls',await insp.locator('button,input,select,a').count());
 // reload reproduces
 await page.reload();await play();const t3=await bioText();say('reload description same',t3.includes('easy stride')&&t3.includes('replaced by Steadier frame'));assert.match(t3,/easy stride/);assert.match(t3,/replaced by Steadier frame/);await shot('f2-03-after-reload');
 // export + file import
 const encoded=await page.evaluate(()=>window.save_to_file());
 await Promise.all([page.waitForNavigation(),page.locator('#saved_file_input').setInputFiles({name:'generated-frail.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);
 await play();const t4=await bioText();assert.match(t4,/easy stride/);assert.match(t4,/replaced by Steadier frame/);await shot('f2-04-after-import');say('import ok; exported bytes',encoded.length);
 fs.writeFileSync(require('node:path').join(__dirname,'evidence','f-results.json'),JSON.stringify({t0,t1,t2,inspector:itxt,t3,t4},null,1));
 say('actors/powers/skill_xp identical before vs after opening inspector (no clock keys compared; time ticks between)',before===after);
});
const fs=require('node:fs');

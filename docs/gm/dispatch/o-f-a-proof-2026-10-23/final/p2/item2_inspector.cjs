// Item 2. Route: ?start_probe=1&skill_inspector=1&structured_candidate=warmhand (both existing localhost-only dev switches).
// Native skill XP comes from the frail-start body commands (F4 route: eat, steady walk x3, grip drill, cold soak); the held method (simulation power
// warmhand.warming) comes from the A3 warmhand pack's own actions (warm, practice, practice, warm_batch). No state is written by hook; time is advanced with dev-stepped ticks (test_hooks).
const fs=require('node:fs'),path=require('node:path');
const {run,out}=require('./lib.cjs');const {advanceGameMinutes}=require('../../../../../../scripts/ui_helpers.cjs');
const POW=process.argv[2]||'warmhand';
const plans={warmhand:['warmhand.warm','warmhand.practice','warmhand.practice','warmhand.warm_batch'],slakebench:['slakebench.slake','slakebench.bake']};
run('i2-inspector','start_probe=1&skill_inspector=1&structured_candidate='+POW,async({page,url,shot,say})=>{
 const save=async()=>{await page.evaluate(()=>window.saveProgress());return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
 const press=async l=>{await l.focus();await page.keyboard.press('Enter');await page.waitForTimeout(500);};
 const bodyPanel=async()=>{if(!await page.locator('#notebook_tab_practice').isVisible()){await page.getByLabel('Other known panels').selectOption('notebook');await page.waitForTimeout(700);}await page.locator('[data-notebook-view="practice"]').click();if(!await page.locator('#body_panel').evaluate(n=>n.open))await page.locator('#body_panel > summary').click();};
 const cmd=async id=>{await bodyPanel();await page.locator(`[data-body-command="${id}"]`).click();};
 const finishJob=async()=>{for(let i=0;i<40;i++){const s=await save();if(!s.expansion.simulation.jobs.some(j=>j.actorId==='player'))return;await advanceGameMinutes(page,1);}throw new Error('job did not finish');};
 await page.goto(url);const b=page.locator('[data-start-axis="body"]');await b.locator('[data-start-mode]').selectOption('lock');await b.locator('[data-start-layer]').selectOption('frail');
 await page.locator('[data-start-use]').check();await page.getByText('PLAY',{exact:true}).click();await page.waitForTimeout(1500);
 await page.getByRole('button',{name:'Talk to someone'}).click();await page.locator('[data-dialogue="oldCraftsman"]').click().catch(async()=>{await page.locator('[data-dialogue]').first().click();});
 await page.getByText('"Hello?"').click();await page.locator('text=← Village >> visible=true').first().click();
 await cmd('body.eat_meal');await finishJob();for(let i=0;i<3;i++){await cmd('body.steady_walk');await finishJob();}
 await cmd('body.grip_drill');await finishJob();await cmd('body.cold_soak');await finishJob();
 say('native skill_xp>0 after body commands',Object.entries((await save()).levels.person.main_character.skill_xp).filter(([,v])=>v>0));
 // pack
 const open=async()=>{if(!await page.locator('#structured_pack_panel').isVisible()){await page.locator('button:text-is("Beginning")').first().click();await page.waitForTimeout(600);}};
 await open();await shot('1-pack-offer');await press(page.locator('[data-structured-begin]'));await page.waitForTimeout(1000);
 for(const a of plans[POW]){await advanceGameMinutes(page,22);const bt=page.locator(`[data-structured-action="${a}"]`);if(await bt.isDisabled().catch(()=>true)){say(a+' DISABLED');continue;}await press(bt);for(let i=0;i<12&&await page.locator('[data-structured-cancel]:visible').count();i++)await advanceGameMinutes(page,1);say(a+' done');}
 await shot('2-pack-done');
 // freeze time and open the inspector
 await page.evaluate(()=>simulationTestHooks.pause());
 await page.locator('nav button:text-is("Stats"), button:text-is("Stats")').first().click().catch(()=>{});await page.waitForTimeout(500);
 if(await page.locator('#character_show_bio').isVisible()&&!await page.locator('#character_bio_div').isVisible())await page.locator('#character_show_bio').click();
 const insp=page.locator('[data-skill-inspector]');
 const snap=async()=>{await page.evaluate(()=>window.saveProgress());return page.evaluate(()=>localStorage.getItem('save data'));};
 const before=await snap();const tick0=await page.evaluate(()=>simulationTestHooks.snapshot()['current time']);
 if(!await insp.evaluate(n=>n.open)){await insp.locator('summary').focus();await page.keyboard.press('Enter');}
 const itxt=await insp.innerText();say('INSPECTOR',itxt);
 await insp.scrollIntoViewIfNeeded();await insp.screenshot({path:path.join(out,'i2-inspector-element.png')});await shot('3-inspector-page');
 {const g=await insp.evaluate(n=>{let a=n.parentElement;while(a&&a.scrollHeight<=a.clientHeight+2)a=a.parentElement;const r=n.getBoundingClientRect();return {inspectorHeight:Math.round(r.height),scrollAncestor:a?(a.id||a.className||a.tagName):null,ancestorClient:a?.clientHeight,ancestorScroll:a?.scrollHeight}});say('layout: inspector vs scroll container',g);
  const m=page.locator('[data-skill-inspector] > div',{hasText:/\(simulation\)/}).first();await m.scrollIntoViewIfNeeded();await m.screenshot({path:path.join(out,'i2-method-row.png')});await page.screenshot({path:path.join(out,'i2-method-row-page.png')});say('method row text',(await m.innerText()).replace(/\n+/g,' | '));}
 await page.waitForTimeout(1500); // wall time passes while paused; game must not move
 const after=await snap();const tick1=await page.evaluate(()=>simulationTestHooks.snapshot()['current time']);
 const jb=JSON.parse(before),ja=JSON.parse(after);const strip=x=>JSON.stringify(x,(k,v)=>/^(savedAt|saved_at|timestamp|lastSaved|real_time)$/i.test(k)?undefined:v);
 say('game time before/after',tick0,tick1,'equal',JSON.stringify(tick0)===JSON.stringify(tick1));
 say('full save JSON byte-identical before/after opening+reading inspector (paused, saveProgress both times)',before===after);
 if(before!==after){const d=[];const walk=(a,b,p)=>{if(JSON.stringify(a)===JSON.stringify(b))return;if(a&&b&&typeof a==='object'&&typeof b==='object'){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))walk(a[k],b[k],p+'.'+k);}else d.push(p+': '+JSON.stringify(a)+' -> '+JSON.stringify(b));};walk(jb,ja,'');say('DIFF paths',d.slice(0,20));say('identical after stripping wall-clock keys',strip(jb)===strip(ja));}
 say('controls inside inspector (buttons/inputs/selects/links)',await insp.locator('button,input,select,a').count());
 fs.writeFileSync(path.join(out,'i2-inspector.txt'),itxt);
 // persistence of the rows: reload + export + import
 const rows=t=>t.replace(/\s+/g,' ').trim().replace(/\d+(\.\d+)? total XP/g,'N total XP'); // passive Breathing XP can tick once between PLAY and the pause hook, so native XP counts are normalised; method rows are compared exactly below
 const method=async i=>(await i.locator(':scope > div',{hasText:/\(simulation\)/}).first().innerText()).replace(/\s+/g,' ');const m0=await method(insp);
 const reopen=async()=>{await page.getByText('PLAY',{exact:true}).click().catch(()=>{});await page.waitForTimeout(1500);await page.evaluate(()=>simulationTestHooks.pause());await page.locator('nav button:text-is("Stats"), button:text-is("Stats")').first().click().catch(()=>{});await page.waitForTimeout(500);
  if(await page.locator('#character_show_bio').isVisible()&&!await page.locator('#character_bio_div').isVisible())await page.locator('#character_show_bio').click();const i=page.locator('[data-skill-inspector]');if(!await i.evaluate(n=>n.open)){await i.locator('summary').focus();await page.keyboard.press('Enter');}return i;};
 await page.reload();const i2=await reopen();const t2=await i2.innerText();say('method row identical after reload',(await method(i2))===m0);say('inspector identical after reload (XP counts normalised)',rows(t2)===rows(itxt));if(rows(t2)!==rows(itxt)){const A=itxt.split('\n').filter(Boolean),B=t2.split('\n').filter(Boolean);say('RELOAD LINE DIFFS',A.map((l,i)=>l!==B[i]?[l,B[i]]:null).filter(Boolean).concat(B.length!==A.length?[['len',A.length+'/'+B.length]]:[]));}await i2.screenshot({path:path.join(out,'i2-inspector-after-reload.png')});
 const enc=await page.evaluate(()=>window.save_to_file());
 await Promise.all([page.waitForNavigation(),page.locator('#saved_file_input').setInputFiles({name:'i2.txt',mimeType:'text/plain',buffer:Buffer.from(enc)})]);
 const i3=await reopen();const t3=await i3.innerText();say('method row identical after import',(await method(i3))===m0);say('inspector identical after file import (XP counts normalised)',rows(t3)===rows(itxt));if(rows(t3)!==rows(itxt)){const A=itxt.split('\n').filter(Boolean),B=t3.split('\n').filter(Boolean);say('IMPORT LINE DIFFS',A.map((l,i)=>l!==B[i]?[l,B[i]]:null).filter(Boolean).concat(B.length!==A.length?[['len',A.length+'/'+B.length]]:[]));}await i3.screenshot({path:path.join(out,'i2-inspector-after-import.png')});
});

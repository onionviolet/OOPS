// Fresh normal entry and actual source actions. Accepted long jobs are dev-stepped;
// the new summer routine itself runs on the ordinary wall timer.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {serve} from '../scripts/playtest/lib.mjs';
const {launchChrome}=createRequire(import.meta.url)('../scripts/ui_helpers.cjs');
const build=resolve(process.argv[2]||'.lane-builds/harry-summer-20261125'),out=resolve('docs/representations/evidence/harry-summer-2026-11-25');
await mkdir(out,{recursive:true});const server=await serve(join(build,'dist')),browser=await launchChrome(),errors=[],steps=[];
let context=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true}),p=await context.newPage();
const attach=page=>{page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());page.setDefaultTimeout(30000);};attach(p);
const snap=()=>p.evaluate(()=>simulationTestHooks.snapshot());
const project=()=>p.evaluate(()=>simulationTestHooks.project('hp'));
const ready=async()=>{await p.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:120000});await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();const c=p.locator('#hero_creation_panel_confirmation');if(await c.isVisible())await c.click();};
const show=()=>p.getByRole('combobox',{name:'Other known panels'}).selectOption('hp');
const click=async locator=>{await locator.evaluate(n=>{for(let a=n.parentElement;a;a=a.parentElement)if(a.tagName==='DETAILS')a.open=true;});await locator.click();};
const finish=async()=>{const jobs=(await snap()).expansion.simulation.jobs.filter(j=>j.actorId==='player');if(jobs.length){const n=Math.max(...jobs.map(j=>j.due))-(await snap()).expansion.clock;await p.evaluate(n=>simulationTestHooks.workTicks(n),n);}};
const next=async()=>{const v=await project(),id=v.arc.next?.id;assert.ok(id,'next source act');const b=p.locator(`[data-hp="${id}"]`);assert.equal(await b.isEnabled(),true,`${id}: ${await b.locator('..').innerText()}`);await click(b);await finish();steps.push(id);console.log('Earned '+id);return id;};
try{
 await p.goto(server.url);await ready();assert.equal((await snap())['current location'],'Village');
 await p.getByRole('combobox',{name:'Other known panels'}).selectOption('beginning');await p.getByRole('combobox',{name:'Optional world and life'}).selectOption('book.hp.lead');await click(p.locator('[data-structured-begin="begin"]'));await show();
 const start=await snap();assert.equal(start.expansion.actors.player.worldId,'book.hp.lead.world');assert.equal(await p.locator('[data-hp-summer]').count(),0);
 for(let i=0;i<56;i++)await next();
 assert.equal((await project()).arc.next.id,'book.hp.lead.arrive_school');assert.equal(await p.locator('[data-hp="book.hp.lead.arrive_school"]').isDisabled(),true);
 await p.locator('[data-hp-summer]').scrollIntoViewIfNeeded();await p.screenshot({path:join(out,'completed-household-choice.jpg')});
 await click(p.locator('[data-hp-summer-action="adopt"]'));await click(p.locator('[data-hp-summer-action="start"]'));
 const accepted=await snap(),opening=accepted.expansion.simulation.knowledge.player['book.hp.lead.opening'].at,job=accepted.expansion.simulation.jobs.find(j=>j.commandId.endsWith('summer_routine.keep_household'));
 assert.equal(job.due,opening+45600);const began=accepted.expansion.clock;await p.evaluate(()=>simulationTestHooks.resume());
 await p.waitForFunction(clock=>simulationTestHooks.clock()>=clock+240,began,{timeout:12000});await p.evaluate(()=>simulationTestHooks.pause());
 const partial=await snap();assert.ok(partial.expansion.clock>=began+240);assert.ok(partial.expansion.clock<job.due);
 await p.locator('#save_button').click();await p.reload();await ready();await show();assert.equal((await snap()).expansion.simulation.jobs.find(j=>j.commandId===job.commandId).due,job.due);
 await click(p.locator('[data-hp-summer-action="stop"]'));const stopped=await snap();assert.equal(stopped.expansion.simulation.jobs.length,0);assert.ok(stopped.expansion.clock>=partial.expansion.clock);
 await click(p.locator('[data-hp-summer-action="start"]'));assert.equal((await snap()).expansion.simulation.jobs[0].due,job.due);
 const download=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const file=join(out,'temporary-export.txt');await(await download).saveAs(file);
 const old=context;context=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true});p=await context.newPage();attach(p);await p.goto(server.url);await ready();
 const nav=p.waitForEvent('domcontentloaded');await p.locator('#saved_file_input').setInputFiles(file);await nav;await ready();await show();await old.close();await rm(file);
 assert.equal((await snap()).expansion.simulation.jobs[0].due,job.due);await p.locator('[data-hp-summer]').scrollIntoViewIfNeeded();await p.screenshot({path:join(out,'imported-running-routine.jpg')});
 console.log('Natural routine running to actual term boundary');await p.evaluate(()=>simulationTestHooks.resume());
 await p.waitForFunction(()=>!simulationTestHooks.snapshot().expansion.simulation.jobs.some(j=>j.commandId.endsWith('summer_routine.keep_household')),null,{timeout:480000});await p.evaluate(()=>simulationTestHooks.pause());
 const boundary=await snap();assert.ok(boundary.expansion.clock>=job.due&&boundary.expansion.clock<=job.due+1);assert.equal(boundary.expansion.actors.player.facts['hp.lead.atSchool'],undefined);
 assert.equal(await p.locator('[data-hp="book.hp.lead.arrive_school"]').isEnabled(),true);await p.locator('[data-hp-summer]').scrollIntoViewIfNeeded();await p.screenshot({path:join(out,'term-boundary-train-choice.jpg')});console.log('Boundary reached, train offered');
 while(!(await project()).school.house){await next();assert.ok(steps.length<64);}
 assert.equal((await project()).school.atSchool,true);await p.screenshot({path:join(out,'earned-sorting.jpg')});
 // Continue the original first-week acts before claiming any lesson-derived benefit.
 while((await project()).arc.next?.id?.startsWith('book.hp.lead.w6.'))await next();
 const school=p.locator('[data-hp-school-day]');const open=school.getByRole('button',{name:'Open your school timetable',exact:true});if(await open.count())await click(open);
 await click(school.locator('[data-hp-library-open]'));
 const action=suffix=>p.locator(`[data-hp-day-action="book.hp.lead.library_work.${suffix}"] button`).first();
 await click(action('move_ladder'));await finish();await click(action('copy_chart'));await finish();
 let s=await snap();assert.equal(s.inventories.person.main_character[JSON.stringify({id:'book.hp.lead.library_work.astronomy_notes'})]?.count,1);
 await p.locator('[data-hp-school-group="library"]').scrollIntoViewIfNeeded();await p.screenshot({path:join(out,'earned-chart-notes.jpg')});
 assert.deepEqual(errors,[]);
 const result={ok:true,route:'Fresh Village -> normal Harry entry -> all 56 real household actions -> optional natural paced routine -> Stop/restart, Save/reload and fresh literal file Import -> actual train -> Sorting -> original first school week -> ladder/chart notes',
  setup:'No supplied save, clock/date/skill grants or source events inserted. Existing accepted household/train/school jobs dev-stepped at original durations. Summer routine ran on ordinary wall timer, including after Import.',
  viewport:{width:1920,height:1080},steps,opening,summerDue:job.due,boundaryClock:boundary.expansion.clock,finalClock:s.expansion.clock,pageErrors:errors,
  bundleSha256:createHash('sha256').update(await readFile(join(build,'dist/bundle.js'))).digest('hex')};await writeFile(join(out,'proof.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}catch(error){console.error(error);await p.screenshot({path:join(out,'failure.jpg')});console.error((await p.locator('#hp_panel').innerText()).slice(0,4500));throw error;}
finally{await context.close();await browser.close();server.close();}

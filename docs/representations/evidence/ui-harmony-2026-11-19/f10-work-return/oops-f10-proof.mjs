import {readFile,writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {defaultCustomizationState} from '/Users/weiwei/code/yet-another-idle-rpg/src/customization_profiles.js';
import {buildBundle,serve,Session,sha} from '/Users/weiwei/code/yet-another-idle-rpg/scripts/playtest/lib.mjs';
import {buildWorldFixture} from '/Users/weiwei/code/yet-another-idle-rpg/scripts/headless/world_fixtures.mjs';
const out='/tmp/oops-f10-proof';await mkdir(out,{recursive:true});
const save=JSON.parse(await buildWorldFixture('ri-fang-yuan-wild-gu',{seed:7}));
const bundle=await buildBundle(),server=await serve(bundle.dir),report={bundle:sha(await readFile(bundle.dir+'/bundle.js')),origin:server.url,checks:[]};
const s=await new Session({url:server.url,seed:7,wall:Date.UTC(2026,10,20)}).start();
const pause=()=>s.page.waitForTimeout(650);
try{
 await s.open(save);let p=s.page;
 const beginning=p.locator('[data-panel-path="beginning"]:visible').first();if(await beginning.count())await beginning.click();
 await p.locator('[data-structured-action="book.ri.lead.wild_refinement.refine"]').click();await pause();
 const skills=p.locator('[data-panel-path="skills"]:visible').first();await skills.click();await pause();
 let strip=p.locator('[data-status-slot="work"]');await strip.focus();await strip.press('Enter');await pause();
 const status=p.locator('[data-structured-job] > p');assert.match(await status.innerText(),/Refine the wild Gu.*60 played minutes remaining/);assert(await status.evaluate(n=>n===document.activeElement));
 assert.equal((await s.save()).expansion.simulation.jobs.filter(j=>j.actorId==='player').length,1);
 await p.screenshot({path:out+'/gu-return.png'});
 await p.keyboard.press('Tab');assert.match(await p.evaluate(()=>document.activeElement.textContent),/Cancel Refine the wild Gu/);
 assert.equal((await s.save()).expansion.simulation.jobs.filter(j=>j.actorId==='player').length,1);
 report.checks.push('Keyboard strip opens exact Gu job status with remaining time and focus; Tab reaches separate Cancel; navigation spends/cancels nothing.');
 await s.step(60);await pause();await strip.focus();await strip.press('Enter');await pause();
 assert.equal(await p.locator('[data-structured-job]').count(),0);assert.match(await strip.innerText(),/No work running/);assert.equal((await s.save()).expansion.simulation.jobs.filter(j=>j.actorId==='player').length,0);
 assert.equal(await p.evaluate(()=>document.activeElement.id),'workspace_current_work');
 report.checks.push('After settlement strip says No work running, focuses current-work fallback and never returns to stale Gu job.');
 const mid=JSON.parse(await readFile('/Users/weiwei/code/yet-another-idle-rpg/tests/fixtures/perf/mid.json','utf8'));mid.customization=defaultCustomizationState();await s.open(mid);p=s.page;strip=p.locator('[data-status-slot="work"]');
 await p.locator('.choice_train').click();await p.locator('.start_activity[data-activity]').filter({hasText:/run/i}).first().click();await pause();
 const before=(await s.save()).current_activity;assert(before);
 await p.locator('#inventory_content_div .item_name').filter({hasText:'Cheap leather pants'}).click();await pause();
 await strip.focus();await strip.press('Enter');await pause();
 const native=p.locator('#action_status_div');assert(await native.isVisible());assert(await native.evaluate(n=>n===document.activeElement));assert.deepEqual((await s.save()).current_activity,before);
 report.nativeStatus=await native.innerText();await p.screenshot({path:out+'/native-return.png'});
 await p.locator('#action_end_div').click();await pause();assert(!(await s.save()).current_activity);
 report.checks.push('Native running from item inspection returns to actual action status with focus, preserves activity, and stops only through explicit end control.');
 report.pageerrors=s.errors.filter(e=>e.kind==='pageerror');assert.deepEqual(report.pageerrors,[]);report.status='PASS';
}catch(e){report.status='FAIL';report.error=e.stack;report.focus=await s.page.evaluate(()=>document.activeElement?.outerHTML.slice(0,500));await s.page.screenshot({path:out+'/failure.png'});throw e;}
finally{await writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await s.close();server.close();await bundle.dispose();}

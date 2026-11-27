// Rebuilt normal-entry proof. No fixture or gifted work progression.
import assert from 'node:assert/strict';
import {resolve,join} from 'node:path';
import {mkdir,readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {serve} from '../scripts/perf/lib.mjs';
import {Session} from '../scripts/playtest/lib.mjs';
const build=resolve(process.argv[2]||'.lane-builds/ordinary-repeat-20261125');
const evidence=resolve(process.argv[3] || 'docs/representations/evidence/ordinary-repeat-2026-11-25');
await mkdir(evidence,{recursive:true});
const server=await serve(build),session=new Session({url:server.url+'?test_hooks=1',seed:87,wall:Date.UTC(2026,10,25,15),opTimeout:30000,
 hooks:{beforeOpen:async context=>context.route('**/private_packs/manifest.json',route=>route.fulfill({json:{schema:1,packs:[]}}))}});
const checks=[];
const scratch=await mkdtemp(join(tmpdir(),'ordinary-repeat-proof-'));
const show=async page=>{
 await page.waitForFunction(()=>!!window.simulationTestHooks);await page.evaluate(()=>window.simulationTestHooks.pause());
 if(await page.locator('#loading_screen_play_button').isVisible())await page.locator('#loading_screen_play_button').click({force:true});
 const open=page.locator('[data-nearby-verb="lotm-workroom"]');assert.ok(await open.isEnabled(),'Here can reopen the current work panel while the job occupies the player');await open.click();
 await page.getByRole('tab',{name:/Work & merit/}).click();
};
try{
 await session.start();await session.open();const page=session.page;
 console.log('Opened ordinary PLAY');
 const cross=page.getByRole('button',{name:'Cross',exact:true});await cross.click();
 await page.locator('[data-lotm="pick_probationer"]').click();
 await page.getByRole('button',{name:'Confirm and cross to Tingen',exact:true}).click();
 await page.locator('[data-lotm="book.lotm.report_in"]').click();
 await page.getByRole('tab',{name:/Work & merit/}).click();
 const single=page.locator('[data-lotm="book.lotm.merit_case_file_copy"]');
 const repeat=page.locator('[data-lotm="repeat.2.book.lotm.merit_case_file_copy"]');
 assert.ok(await single.isEnabled());assert.ok(await repeat.isEnabled());
 assert.match(await repeat.innerText(),/^Do 2 assignments/,'the finite count stays visible after action-label shortening');
 const earned=await session.save();
 await page.screenshot({path:join(evidence,'ordinary-repeat-offers.png')});
 await repeat.click();await session.step(30);
 assert.equal(await page.locator('[data-lotm-merit-balance]').getAttribute('data-lotm-merit-balance'),'1');
 assert.equal(await page.locator('[data-lotm-job]').count(),1);
 checks.push('One repeat start earns first merit after 30 minutes and starts second copy');console.log(checks.at(-1));
 await page.locator('#save_button').click();
 await page.reload();await show(page);
 checks.push('Here reopens saved current work while occupied');
 await session.step(30);
 assert.equal(await page.locator('[data-lotm-merit-balance]').getAttribute('data-lotm-merit-balance'),'2');
 assert.equal(await page.locator('[data-lotm-job]').count(),0);
 assert.match(await page.locator('[data-lotm-routine]').innerText(),/finished.*No further/);
 await page.screenshot({path:join(evidence,'ordinary-repeat-finished.png')});
 checks.push('Reload midway preserves final assignment; two copies settle at 60 minutes for 2 merit');console.log(checks.at(-1));
 await repeat.click();await session.step(10);
 await session.save();await page.reload();await show(page);
 await page.locator('[data-lotm="cancel"]').click();
 assert.match(await page.locator('[data-lotm-routine]').innerText(),/stopped early/);
 await page.screenshot({path:join(evidence,'ordinary-repeat-stopped.png')});
 await session.save();
 const downloaded=page.waitForEvent('download');await page.locator('#save_to_file_button').click();
 const exported=join(scratch,'ordinary-save.txt');await (await downloaded).saveAs(exported);
 await session.open();const imported=session.page;imported.on('dialog',d=>d.accept());
 const importedLoad=imported.waitForEvent('domcontentloaded');await imported.locator('#saved_file_input').setInputFiles(exported);await importedLoad;await show(imported);
 await session.step(60);
 assert.equal(await session.page.locator('[data-lotm-job]').count(),0);
 assert.equal(await session.page.locator('[data-lotm-merit-balance]').getAttribute('data-lotm-merit-balance'),'2');
 assert.match(await session.page.locator('[data-lotm-routine]').innerText(),/stopped early/);
 checks.push('Here reopens a resumed job and its actual Stop cancels current work and future repeat; Export/Import into fresh context cannot restart it');
 const result={viewport:'1920x1080',route:'Normal PLAY -> Tingen Cross -> probationer -> confirm -> report -> Work & merit',
  setup:'UI-earned ordinary checkpoint; no seeded fixture; only subsequent clock advancement uses test hook',
  bundleSha256:createHash('sha256').update(await readFile(join(build,'dist/bundle.js'))).digest('hex'),
  earnedCheckpointSha256:createHash('sha256').update(JSON.stringify(earned)).digest('hex'),checks,pageErrors:session.errors.filter(e=>e.kind==='pageerror')};
 assert.equal(result.pageErrors.length,0);await writeFile(join(evidence,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}catch(error){console.error(error);await session.page?.screenshot({path:join(evidence,'failed.png')});await writeFile(join(evidence,'failure.json'),JSON.stringify({error:String(error),buttons:await session.page?.locator('button').evaluateAll(bs=>bs.map(b=>({text:b.innerText,html:b.outerHTML.slice(0,650)})).filter(b=>b.text==='Open'||/lotm|Tingen/.test(b.html)))},null,2));throw error;}
finally{await session.close();await server.close();await rm(scratch,{recursive:true,force:true});}
